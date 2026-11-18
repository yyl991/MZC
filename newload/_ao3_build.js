// AO3 静态聊天记录生成器
// 读取项目真实数据，复刻 wx_chat.js 的渲染与时间规则，输出 AO3 兼容的三件套
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const BASE = 'C:/Users/53184/Desktop/233/MZC/newload';
const OUT = 'C:/Users/53184/WorkBuddy/2026-11-17-21-04-27/ao3-export';
const CDN = 'https://cgcgdsg.cc.cd/';
fs.mkdirSync(path.join(OUT, 'icons'), { recursive: true });

// ---------- 1. 加载原始数据 ----------
const sandbox = { window: {}, console };
sandbox.window.window = sandbox.window;
vm.createContext(sandbox);
for (const f of ['core/icons.js', 'data/story.js', 'data/chat_history.js']) {
  vm.runInContext(fs.readFileSync(path.join(BASE, f), 'utf8'), sandbox, { filename: f });
}
const H = sandbox.window.CHAT_HISTORY;
const S = sandbox.window.STORY;
const T = S.timeline || [];
const G = sandbox.window.G;
const DISPLAY = sandbox.DISPLAY || {};
const roles = S.roles;
const myAvatar = S.myAvatar || './data/avatar/me.jpg';
const myPat = S.myPat || '';

// ---------- 2. 工具函数 ----------
const pad = (n) => String(n).padStart(2, '0');
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function toUrl(p) {
  p = String(p == null ? '' : p).trim();
  if (/^https?:\/\//i.test(p)) return p;
  return CDN + p.replace(/^\.\//, '').replace(/^\//, '');
}
function timeToMin(s) {
  if (!s) return 0;
  const str = String(s);
  let m = str.match(/(上午|下午)\s*(\d+):(\d+)/);
  if (m) {
    let h = parseInt(m[2]);
    if (m[1] === '下午' && h < 12) h += 12;
    if (m[1] === '上午' && h === 12) h = 0;
    return h * 60 + parseInt(m[3]);
  }
  m = str.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (m) {
    let h = parseInt(m[1]);
    const ap = (m[3] || '').toUpperCase();
    if (ap === 'PM' && h < 12) h += 12;
    if (ap === 'AM' && h === 12) h = 0;
    return h * 60 + parseInt(m[2]);
  }
  return 0;
}

// 游戏里的「今天」固定 11月15日（原 gameMin 默认 23:09）
const TODAY = new Date(Date.UTC(2026, 10, 15));

// 复刻 getWxTimeString(dateLabel, timeStr)
function getWxTimeString(dateLabel, timeStr) {
  if (/昨天|前天|周[一二三四五六日]|\d{4}年/.test(timeStr)) return timeStr;
  let h = 0, mi = 0;
  let match = String(timeStr || '').match(/(上午|下午)\s*(\d+):(\d+)/);
  if (match) {
    h = parseInt(match[2]); mi = parseInt(match[3]);
    if (match[1] === '下午' && h < 12) h += 12;
    if (match[1] === '上午' && h === 12) h = 0;
  } else {
    const m2 = String(timeStr || '').match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (m2) {
      h = parseInt(m2[1]); mi = parseInt(m2[2]);
      const ap = (m2[3] || '').toUpperCase();
      if (ap === 'PM' && h < 12) h += 12;
      if (ap === 'AM' && h === 12) h = 0;
    }
  }
  const ampmCN = h >= 12
    ? '<span class="mzc-ampm">下午</span>'
    : '<span class="mzc-ampm">上午</span>';
  const h12 = pad(h % 12);
  const timeOnly = `${ampmCN} ${h12}:${pad(mi)}`;
  if (!dateLabel) return timeOnly;
  let msgDate = new Date(Date.UTC(2026, 10, 15));
  const dm = String(dateLabel).match(/(?:(\d{4})年)?(\d+)月(\d+)日/);
  if (dm) {
    const y = dm[1] ? parseInt(dm[1]) : 2026;
    msgDate = new Date(Date.UTC(y, parseInt(dm[2]) - 1, parseInt(dm[3])));
  }
  const diffDays = Math.floor((TODAY - msgDate) / 86400000);
  if (diffDays === 0) return timeOnly;
  if (diffDays === 1) return `昨天 ${timeOnly}`;
  if (diffDays > 1 && diffDays < 7) {
    const wd = ['周日','周一','周二','周三','周四','周五','周六'][msgDate.getUTCDay()];
    return `${wd} ${timeOnly}`;
  }
  if (msgDate.getUTCFullYear() === TODAY.getUTCFullYear())
    return `${msgDate.getUTCMonth() + 1}月${msgDate.getUTCDate()}日 ${timeOnly}`;
  return `${msgDate.getUTCFullYear()}年${msgDate.getUTCMonth() + 1}月${msgDate.getUTCDate()}日 ${timeOnly}`;
}

// 复刻 normalizePatSys（拍一拍补全）
function normalizePatSys(text, meta) {
  let s = String(text || '').replace(/^[\[【]\s*系统\s*[\]】]\s*/, '').trim();
  if (!/拍了拍/.test(s)) return s;
  if (/^[""]我[""]\s*拍了拍/.test(s) || /^我\s*拍了拍\s*[""]/.test(s)) return s;
  if (/^(你|我)\s*拍了拍/.test(s)) {
    if (/拍了拍自己/.test(s)) return `我拍了拍自己${myPat ? ' ' + myPat : ''}`;
    const suffix = meta.pat || '';
    return `我拍了拍"${meta.name}"${suffix ? ' ' + suffix : ''}`;
  }
  return s;
}

// 角色映射：chat key -> {roleKey, name, avatar, pat}
const HISTORY_ALIAS = { '黑猫': 'cat' };
function metaFor(chatKey) {
  const rk = HISTORY_ALIAS[chatKey] || chatKey;
  const role = roles[rk] || {};
  const name = DISPLAY[rk] || chatKey;
  return {
    roleKey: rk,
    name,
    avatar: role.avatar || './data/avatar/me.jpg',
    pat: role.pat || '',
  };
}

// ---------- 3. 图标：SVG 内联为 data URI，避免依赖 CDN 上传 ----------
function svgUri(svg) {
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.replace(/\s+/g, ' ').trim());
}
const icon = {
  call: svgUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#111" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`),
  video: svgUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#111" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>`),
  speaker: svgUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`),
};

// ---------- 4. 时间线通知补入聊天记录（只补选定的几个角色） ----------
const TIMELINE_INCLUDE = { 'MuAMuA': true, '穆祉丞': true };
// 把这些角色的 timeline 通知按 at 排序，转成聊天消息追加到末尾（静态化后这些动态消息会丢失）
function withTimeline(chatKey, arr) {
  if (!TIMELINE_INCLUDE[chatKey]) return arr;
  const beats = T.filter(b => (b.from === chatKey) && (b.type === 'notify' || b.type === 'call'))
                 .sort((a, b) => a.at - b.at);
  if (!beats.length) return arr;
  const out = arr.slice();
  // 起始时间接着聊天记录末尾的晚间时间往后推（12小时制，避免 parse 混乱）
  const start = 23 * 60 + 10; // 晚上 11:10
  beats.forEach((b, i) => {
    const mm = start + i * 3;
    const h24 = Math.floor(mm / 60) % 24;
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    const t = `下午 ${h12}:${String(mm % 60).padStart(2, '0')}`;
    if (b.type === 'call') out.push(['[通话] 对方无应答', 'them', t]);
    else out.push([b.text, 'them', t]);
  });
  return out;
}

// ---------- 5. 渲染单个聊天 ----------
function renderChat(chatKey, arrRaw) {
  const arr = withTimeline(chatKey, arrRaw);
  const meta = metaFor(chatKey);
  const themAv = toUrl(meta.avatar);
  const meAv = toUrl(myAvatar);
  let o = '';
  let currentDateLabel = '11月15日';
  arr.forEach((m, i) => {
    // 日期分隔项
    if (m[1] === 'date') { currentDateLabel = m[0]; return; }

    const text = m[0];
    const who = m[1];
    const time = m[2] || '';
    const flag = m[3] || '';
    const quote = (m[4] && m[4].name) ? m[4] : null;
    const me = who === 'me';

    // 时间条：每段第一条 + 间隔>=10分钟 + 时间倒退
    let showTime = false;
    const prev = arr[i - 1];
    if (i === 1 || !prev || prev[1] === 'date') showTime = true;
    else {
      const cm = timeToMin(time), pm = timeToMin(prev[2] || '');
      if (cm - pm >= 10 || cm < pm) showTime = true;
    }
    if (showTime)
      o += `<div class="mzc-dpill"><span>${getWxTimeString(currentDateLabel, time)}</span></div>`;

    // 系统消息（拍一拍 / 撤回）
    if (who === 'sys') {
      o += `<div class="mzc-sys">${esc(normalizePatSys(text, meta))}</div>`;
      return;
    }

    let inner = '';
    let bubbleCls = 'mzc-bb';
    const t = String(text || '');
    if (t.startsWith('[图片]')) {
      const u = toUrl(t.replace('[图片]', '').trim());
      inner = `<img class="mzc-img" src="${esc(u)}" alt="[图片]">`;
      bubbleCls += ' mzc-bb-img';
    } else if (t.startsWith('[表情]')) {
      const u = toUrl(t.replace('[表情]', '').trim());
      inner = `<img class="mzc-emo" src="${esc(u)}" alt="[表情]">`;
      bubbleCls += ' mzc-bb-emo';
    } else if (t.startsWith('[语音]')) {
      const parts = t.replace('[语音]', '').trim().split('|');
      const sec = parseInt(parts[0]) || 1;
      const audioUrl = parts[1] ? toUrl(parts[1]) : '';
      const trans = parts[2] || '';
      const speaker = `<span class="mzc-spk">&#128266;</span>`;
      const voiceCore = me
        ? `<span class="mzc-voice"><span class="mzc-sec">${sec}&quot;</span>${speaker}</span>`
        : `<span class="mzc-voice">${speaker}<span class="mzc-sec">${sec}&quot;</span></span>`;
      // 有音频链接则整条可点击打开播放（AO3 禁 JS，用 a 标签新窗口播放）
      inner = audioUrl
        ? `<a class="mzv-a" href="${esc(audioUrl)}" target="_blank" rel="noreferrer">${voiceCore}</a>`
        : voiceCore;
      bubbleCls += ' mzc-bb-voice';
      // 转文字直接展开（AO3 无 JS，无法做点击展开）
      if (trans) inner += `<span class="mzc-trans">${esc(trans)}</span>`;
    } else if (t.startsWith('[视频]')) {
      const parts = t.replace('[视频]', '').trim().split('|');
      const videoUrl = parts[0] ? toUrl(parts[0]) : '';
      const cover = parts[1] && parts[1] !== parts[0] ? toUrl(parts[1]) : '';
      const dur = parts[2] || '0:00';
      let vBody = cover
        ? `<img class="mzc-vcover" src="${esc(cover)}" alt="[视频]">`
        : `<span class="mzc-vph">[视频]</span>`;
      vBody += `<span class="mzc-vplay">&#9654;</span><span class="mzc-vtime">${esc(dur)}</span>`;
      // 视频封面可点击打开播放
      inner = videoUrl
        ? `<a class="mzv-a" href="${esc(videoUrl)}" target="_blank" rel="noreferrer">${vBody}</a>`
        : vBody;
      bubbleCls += ' mzc-bb-video';
    } else if (t.startsWith('[视频通话]') || t.startsWith('[通话]')) {
      const isVideo = t.startsWith('[视频通话]');
      const callText = t.replace(isVideo ? '[视频通话]' : '[通话]', '').trim();
      const ic = `<span class="mzc-callic">${isVideo ? '&#128249;' : '&#9742;'}</span>`;
      inner = me
        ? `<span class="mzc-call">${esc(callText)}${ic}</span>`
        : `<span class="mzc-call">${ic}${esc(callText)}</span>`;
    } else if (t.startsWith('[位置]')) {
      const [locName, locAddr] = t.replace('[位置]', '').trim().split('|');
      inner = `<span class="mzc-card"><span class="mzc-card-t">${esc(locName || '位置')}</span><span class="mzc-card-s">${esc(locAddr || '')}</span><span class="mzc-card-e">📍</span></span>`;
      bubbleCls += ' mzc-bb-card';
    } else if (t.startsWith('[红包]')) {
      const [rpText, rpAmount] = t.replace('[红包]', '').trim().split('|');
      inner = `<span class="mzc-card"><span class="mzc-card-e">🧧</span><span class="mzc-card-t">${esc(rpText || '恭喜发财，大吉大利')}</span><span class="mzc-card-s">${rpAmount ? '￥' + esc(rpAmount) + ' · ' : ''}微信红包</span></span>`;
      bubbleCls += ' mzc-bb-card';
    } else if (t.startsWith('[转账]')) {
      const [trAmount, trNote] = t.replace('[转账]', '').trim().split('|');
      inner = `<span class="mzc-card"><span class="mzc-card-t">￥${esc(trAmount || '0.00')}</span><span class="mzc-card-s">${esc(trNote || '转账')}</span><span class="mzc-card-e">💸</span></span>`;
      bubbleCls += ' mzc-bb-card';
    } else {
      inner = esc(t);
    }

    // 引用
    let quoteHtml = '';
    if (quote && quote.text) {
      let qc;
      const qt = String(quote.text);
      if (qt.startsWith('[图片]') || qt.startsWith('[表情]')) {
        const qu = toUrl(qt.replace(/^\[(图片|表情)\]/, '').trim());
        qc = `<img class="mzc-qimg" src="${esc(qu)}" alt="">`;
      } else {
        qc = `<span class="mzc-qtxt">${esc(qt)}</span>`;
      }
      quoteHtml = `<span class="mzc-quote"><span class="mzc-qname">${esc(quote.name)}：</span>${qc}</span>`;
    }

    // 红叹号（拒收/拉黑）
    const rej = me && (flag === 'rejected' || flag === 'blocked')
      ? `<span class="mzc-rej">!</span>` : '';

    const av = me ? meAv : themAv;
    o += `<div class="mzc-ln ${me ? 'me' : 'th'}"><span class="mzc-sav"><img src="${esc(av)}" alt=""></span><span class="mzc-wrap"><span class="mzc-row"><span class="${bubbleCls}">${inner}</span>${rej}</span>${quoteHtml}</span></div>`;
  });

  // 手机外框：状态栏 + 导航栏 + 可滚动聊天区 + 底部输入栏
  // 状态栏右侧：纯 CSS 画信号格 + wifi 扇形弧线 + 带正极电池（AO3 过滤 SVG，只能用真实元素）
  const status = `<div class="mzc-status"><span class="mzc-st-time">上午00:24</span><span class="mzc-st-right"><span class="mzc-sig"><i></i><i></i><i></i><i></i></span><span class="mzc-wifi"><i class="w1"></i><i class="w2"></i><i class="w3"></i></span><span class="mzc-bat"><span class="mzc-bat-in"></span><span class="mzc-bat-cap"></span></span></span></div>`;
  // 导航栏更多：三个圆点（参考 icons.js dotsH），用字符 + 字间距
  const nav = `<div class="mzc-hd"><span class="mzc-back">&#8249;</span><span class="mzc-hdname">${esc(meta.name)}</span><span class="mzc-more">&#8226;&#8226;&#8226;</span></div>`;
  const inputbar = `<div class="mzc-inputbar"><span class="mzc-ib-mic">&#127908;</span><span class="mzc-ib-field">输入消息</span><span class="mzc-ib-emoji">&#9786;</span><span class="mzc-ib-plus">&#43;</span></div>`;
  const home = `<div class="mzc-homebar"></div>`;
  // 顶部“⌂ 主页”小条（截图里状态栏下方）
  const homelink = `<div class="mzc-homelink">&#9664; 主页</div>`;
  const phone = `<div class="mzc-phone"><div class="mzc-screen">${status}${homelink}<div class="mzc-chat">${nav}<div class="mzc-body">${o}</div></div>${inputbar}${home}</div></div>`;
  // 每章底部引流说明（AO3 功能受限，引导到原站体验完整版）
  const promo = `<div class="mzc-promo"><span class="mzc-promo-line">ao3功能有限仅存档捡手机聊天记录部分，可互动版本需打开网页版↓</span><a class="mzc-promo-btn" href="https://cgcgdsg.cc.cd/" target="_blank" rel="noreferrer">进入完整捡手机小游戏</a></div>`;
  return phone + promo;
}

// ---------- 5. 组装全部角色 ----------
const keys = Object.keys(H);
let chapterInner = '';
for (const k of keys) chapterInner += renderChat(k, H[k]);
const chapterBody = `<div class="mzc-root">${chapterInner}</div>`;

// ---------- 6. Work Skin CSS ----------
const css = `#workskin .mzc-root{font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",Helvetica,Arial,sans-serif;color:#111;}
/* 手机外框 */
#workskin .mzc-phone{position:relative;width:400px;height:812px;margin:0 auto 30px;background:#000;border-radius:52px;overflow:hidden;box-shadow:0 0 0 8px #1a1a1c,0 0 0 10px #45454b,0 0 0 11px #101012,0 24px 60px rgba(0,0,0,.55);}
#workskin .mzc-screen{position:relative;width:400px;height:812px;background:#ededed;overflow:hidden;}
/* 清掉 AO3 给裸块级元素自动包 <p> 产生的上下 margin，避免整体下移挡住输入栏 */
#workskin .mzc-screen p{margin:0;}
#workskin .mzc-status,#workskin .mzc-homelink,#workskin .mzc-hd,#workskin .mzc-body,#workskin .mzc-inputbar,#workskin .mzc-homebar{margin-top:0;margin-bottom:0;}
/* 右侧遮罩：物理盖住任何浏览器显示的滚动条 */
#workskin .mzc-screen::after{content:"";position:absolute;right:0;top:94px;width:12px;height:632px;background:#ededed;z-index:50;}
/* 状态栏 */
#workskin .mzc-status{position:relative;width:400px;height:30px;background:#f7f7f7;font-size:13px;font-weight:600;color:#000;}
#workskin .mzc-st-time{position:absolute;left:26px;top:7px;}
#workskin .mzc-st-right{position:absolute;right:24px;top:9px;font-size:12px;}
#workskin .mzc-sig{display:inline-block;height:11px;vertical-align:middle;margin-right:5px;}
#workskin .mzc-sig i{display:inline-block;width:3px;background:#000;margin-right:1.5px;vertical-align:bottom;border-radius:1px;}
#workskin .mzc-sig i:nth-child(1){height:4px;}
#workskin .mzc-sig i:nth-child(2){height:6px;}
#workskin .mzc-sig i:nth-child(3){height:8px;}
#workskin .mzc-sig i:nth-child(4){height:11px;}
#workskin .mzc-wifi{display:inline-block;width:16px;height:12px;margin-right:6px;vertical-align:middle;position:relative;}
#workskin .mzc-wifi i{position:absolute;left:0;border-style:solid;border-color:#000 transparent transparent transparent;border-radius:50%;}
#workskin .mzc-wifi .w1{width:16px;height:16px;border-width:1.8px;top:1px;}
#workskin .mzc-wifi .w2{width:10px;height:10px;border-width:1.8px;top:5px;left:3px;}
#workskin .mzc-wifi .w3{width:4px;height:4px;background:#000;border:0;top:9px;left:6px;}
#workskin .mzc-bat{display:inline-block;width:22px;height:11px;border:1.5px solid #000;border-radius:3px;vertical-align:middle;position:relative;}
#workskin .mzc-bat-in{display:block;width:15px;height:7px;background:#000;margin:1px;border-radius:1px;}
#workskin .mzc-bat-cap{position:absolute;right:-4px;top:3px;width:2px;height:5px;background:#000;border-radius:0 2px 2px 0;}
/* 主页小条 */
#workskin .mzc-homelink{position:relative;width:400px;height:20px;background:#f7f7f7;font-size:12px;color:#576b95;padding-left:14px;line-height:20px;}
/* 导航栏 */
#workskin .mzc-chat{width:400px;background:#ededed;}
#workskin .mzc-hd{position:relative;width:400px;height:44px;text-align:center;background:#f7f7f7;border-bottom:1px solid #d9d9d9;font-size:16px;font-weight:600;line-height:44px;}
#workskin .mzc-back{position:absolute;left:14px;top:0;font-size:28px;line-height:44px;color:#111;}
#workskin .mzc-hdname{display:inline-block;}
#workskin .mzc-more{position:absolute;right:18px;top:0;font-size:24px;line-height:44px;letter-spacing:2px;color:#111;}
/* 可滚动聊天区 */
#workskin .mzc-body{width:400px;height:632px;overflow-y:auto;overflow-x:hidden;scrollbar-width:none;scrollbar-color:transparent transparent;background:#ededed;padding-top:18px;}
#workskin .mzc-body::-webkit-scrollbar{display:none;width:0;height:0;background:transparent;}
#workskin .mzc-body::-webkit-scrollbar-thumb{background:transparent;}
#workskin .mzc-body::-webkit-scrollbar-track{background:transparent;}
#workskin .mzc-body p{margin:0;}
#workskin .mzc-dpill{text-align:center;margin:14px 0 10px;}
#workskin .mzc-dpill span{display:inline-block;color:#fff;background:#cecece;font-size:11px;line-height:1.4;padding:2px 6px;border-radius:4px;}
#workskin .mzc-ampm{opacity:.95;}
#workskin .mzc-sys{text-align:center;margin:10px 0;color:#9a9a9a;font-size:12px;line-height:1.5;}
#workskin .mzc-ln{display:flex;align-items:flex-start;margin:0 12px 16px;}
#workskin .mzc-ln.me{flex-direction:row-reverse;}
#workskin .mzc-ln p{display:contents;}
#workskin .mzc-dpill p,#workskin .mzc-sys p,#workskin .mzc-hd p{margin:0;display:inline;}
#workskin .mzc-sav{display:inline-block;width:40px;height:40px;min-width:40px;border-radius:5px;overflow:hidden;background:#c4d6e8;}
#workskin .mzc-sav img{display:block;width:40px;height:40px;}
#workskin .mzc-wrap{display:flex;flex-direction:column;align-items:flex-start;max-width:74%;margin:0 8px;}
#workskin .mzc-ln.me .mzc-wrap{align-items:flex-end;}
#workskin .mzc-row{display:flex;align-items:center;max-width:100%;}
#workskin .mzc-ln.me .mzc-row{flex-direction:row-reverse;}
#workskin .mzc-bb{display:inline-block;padding:9px 12px;border-radius:5px;font-size:15px;line-height:1.45;background:#fff;color:#111;word-break:break-word;vertical-align:top;}
#workskin .mzc-ln.me .mzc-bb{background:#95ec69;}
#workskin .mzc-bb-img,#workskin .mzc-bb-emo,#workskin .mzc-bb-video{padding:4px;}
#workskin .mzc-img{display:block;max-width:190px;height:auto;border-radius:4px;}
#workskin .mzc-emo{display:block;width:110px;height:110px;border-radius:4px;}
#workskin .mzc-voice{display:inline-flex;align-items:center;min-width:92px;}
#workskin .mzc-spk{font-size:15px;line-height:1;vertical-align:middle;}
#workskin .mzc-sec{margin:0 4px;font-size:14px;}
#workskin .mzc-ln.me .mzc-sec{margin-right:6px;}
#workskin .mzc-trans{display:block;margin-top:6px;padding-top:6px;border-top:1px solid rgba(0,0,0,.08);font-size:12px;color:#555;line-height:1.5;}
#workskin .mzc-bb-voice{min-width:150px;}
#workskin .mzv-a{color:inherit;text-decoration:none;}
#workskin .mzc-bb-video{position:relative;width:190px;height:120px;}
#workskin .mzc-vcover{display:block;width:182px;height:112px;border-radius:4px;}
#workskin .mzc-vph{display:block;width:182px;height:112px;line-height:112px;text-align:center;background:#333;color:#fff;border-radius:4px;}
#workskin .mzc-vplay{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-size:30px;color:#fff;text-shadow:0 1px 4px rgba(0,0,0,.6);}
#workskin .mzc-vtime{position:absolute;right:9px;bottom:9px;color:#fff;font-size:11px;background:rgba(0,0,0,.5);padding:1px 5px;border-radius:3px;}
#workskin .mzc-call{display:inline-flex;align-items:center;}
#workskin .mzc-callic{font-size:15px;line-height:1;margin:0 5px;vertical-align:middle;}
#workskin .mzc-card{display:inline-flex;align-items:center;min-width:180px;}
#workskin .mzc-card-t{font-size:15px;}
#workskin .mzc-card-s{display:block;font-size:12px;color:#888;margin-top:3px;}
#workskin .mzc-card-e{font-size:26px;margin:0 8px;}
#workskin .mzc-bb-card{background:#fff;}
#workskin .mzc-quote{display:block;margin-top:5px;padding:6px 8px;background:#dcdcdc;border-radius:4px;font-size:12px;color:#666;line-height:1.5;}
#workskin .mzc-qname{color:#111;}
#workskin .mzc-qimg{width:32px;height:32px;border-radius:3px;vertical-align:middle;}
#workskin .mzc-qtxt{color:#555;}
#workskin .mzc-rej{display:inline-block;min-width:16px;height:16px;line-height:16px;text-align:center;border-radius:50%;background:#fa5151;color:#fff;font-size:12px;font-weight:bold;margin:0 5px;}
/* 底部输入栏 */
#workskin .mzc-inputbar{position:relative;width:400px;height:54px;background:#f7f7f7;border-top:1px solid #d9d9d9;}
#workskin .mzc-ib-mic{position:absolute;left:14px;top:12px;font-size:24px;color:#111;}
#workskin .mzc-ib-field{position:absolute;left:52px;top:9px;width:250px;height:36px;line-height:36px;background:#fff;border-radius:5px;font-size:14px;color:#b0b0b0;padding-left:10px;}
#workskin .mzc-ib-emoji{position:absolute;right:52px;top:13px;width:26px;height:26px;line-height:26px;text-align:center;font-size:26px;color:#111;}
#workskin .mzc-ib-plus{position:absolute;right:14px;top:13px;width:22px;height:22px;line-height:18px;text-align:center;border:2px solid #111;border-radius:50%;font-size:18px;font-weight:300;color:#111;}
/* Home 指示条 */
#workskin .mzc-homebar{position:absolute;left:50%;bottom:9px;margin-left:-70px;width:140px;height:5px;background:#000;border-radius:3px;}
/* 底部引流说明 */
#workskin .mzc-promo{max-width:400px;margin:26px auto 10px;padding:0;text-align:center;background:none;border:0;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",Helvetica,Arial,sans-serif;}
#workskin .mzc-promo p{display:contents;margin:0;}
#workskin .mzc-promo-line{display:block;color:#888;font-size:13px;line-height:1.7;margin-bottom:14px;}
#workskin .mzc-promo-btn{display:inline-block;padding:11px 22px;background:#ff9d64;background:linear-gradient(135deg,#ff9d64,#ff6e9b);border:1px solid #ff9070;border-radius:7px;color:#fff;font-size:14px;font-weight:400;text-decoration:none;}
#workskin .mzc-promo-btn:hover{background:#ff9255;background:linear-gradient(135deg,#ff9255,#ff5f96);}
`;

// ---------- 7. 输出文件 ----------
// 章节 HTML：压成单行，避免 AO3 parser 注入 <p>/<br> 破坏结构
fs.writeFileSync(path.join(OUT, 'chapter.html'), chapterBody.replace(/\n/g, ''), 'utf8');

// 分章节：每个角色一个章节（一人一部手机），压成单行
const chaptersDir = path.join(OUT, 'chapters');
if (!fs.existsSync(chaptersDir)) fs.mkdirSync(chaptersDir, {recursive:true});
const chapterList = [];
keys.forEach((k, idx) => {
  const body = `<div class="mzc-root">${renderChat(k, H[k])}</div>`;
  const file = `chapter_${String(idx+1).padStart(2,'0')}.html`;
  fs.writeFileSync(path.join(chaptersDir, file), body.replace(/\n/g, ''), 'utf8');
  chapterList.push({index:idx+1, role:k, name:metaFor(k).name, file, chars:body.length, msgs:H[k].length});
});
fs.writeFileSync(path.join(chaptersDir, 'chapters.json'), JSON.stringify(chapterList, null, 2), 'utf8');
// Work Skin CSS
fs.writeFileSync(path.join(OUT, 'work_skin.css'), css, 'utf8');
// 本地预览（内联 CSS + 模拟 #workskin 容器）
const preview = `<!doctype html><html lang="zh"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AO3 微信聊天记录预览</title><style>body{margin:0;background:#c9c9c9;padding:20px;}#workskin{max-width:430px;margin:0 auto;background:#ededed;}${css}</style></head><body><div id="workskin">${chapterBody.replace(/\n/g, '')}</div></body></html>`;
fs.writeFileSync(path.join(OUT, 'preview.html'), preview, 'utf8');

// 图标 SVG（原 icons.js 的图标，补上独立文档所需的尺寸与颜色）
const callSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#111" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;
const videoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#111" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>`;
const speakerSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`;
fs.writeFileSync(path.join(OUT, 'icons', 'call.svg'), callSvg, 'utf8');
fs.writeFileSync(path.join(OUT, 'icons', 'video.svg'), videoSvg, 'utf8');
fs.writeFileSync(path.join(OUT, 'icons', 'speaker.svg'), speakerSvg, 'utf8');

// ---------- 8. 统计报告 ----------
console.log('输出目录:', OUT);
console.log('角色数:', keys.length, '=', keys.join(', '));
console.log('chapter.html 字节:', fs.statSync(path.join(OUT, 'chapter.html')).size);
console.log('work_skin.css 字节:', fs.statSync(path.join(OUT, 'work_skin.css')).size);
console.log('preview.html 字节:', fs.statSync(path.join(OUT, 'preview.html')).size);
// 抽样几个时间条文案核对
const sample = [];
for (const k of keys) {
  const arr = H[k];
  let label = '11月15日';
  for (let i = 0; i < arr.length; i++) {
    const m = arr[i];
    if (m[1] === 'date') { label = m[0]; continue; }
    if (i === 1 || !arr[i-1] || arr[i-1][1] === 'date' || timeToMin(m[2]||'') - timeToMin(arr[i-1][2]||'') >= 10 || timeToMin(m[2]||'') < timeToMin(arr[i-1][2]||'')) {
      sample.push(`${k}: [${label}] ${getWxTimeString(label, m[2]||'')}`);
      if (sample.length > 12) break;
    }
  }
  if (sample.length > 12) break;
}
console.log('\n时间条抽样:\n' + sample.join('\n'));
