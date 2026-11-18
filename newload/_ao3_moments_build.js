// AO3 朋友圈章节生成器
// 读取 wx_chat.js 里的 MOCK_MOMENTS_DATA，按 VIEWS.moments 的规则复刻成静态手机页面
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const BASE = 'C:/Users/53184/Desktop/233/MZC/newload';
const OUT = 'C:/Users/53184/WorkBuddy/2026-11-17-21-04-27/ao3-export';
const CDN = 'https://cgcgdsg.cc.cd/';

// ---------- 1. 加载数据 ----------
const sandbox = { window: {}, console };
sandbox.window.window = sandbox.window;
vm.createContext(sandbox);
for (const f of ['core/icons.js', 'data/story.js']) {
  vm.runInContext(fs.readFileSync(path.join(BASE, f), 'utf8'), sandbox, { filename: f });
}
const S = sandbox.window.STORY;
const roles = S.roles || {};
const DISPLAY = S.display || {};
const myAvatar = S.myAvatar || './data/avatar/me.jpg';

// MOCK_MOMENTS_DATA 是 wx_chat.js 里的 const，用正则截出对象字面量后在隔离上下文求值
const wxSrc = fs.readFileSync(path.join(BASE, 'views/wx_chat.js'), 'utf8');
const m = wxSrc.match(/const MOCK_MOMENTS_DATA = \{[\s\S]*?\n\};/);
if (!m) throw new Error('MOCK_MOMENTS_DATA 未找到');
const literal = m[0].replace(/^const MOCK_MOMENTS_DATA\s*=\s*/, '').replace(/;\s*$/, '');
const MOMENTS = vm.runInNewContext('(' + literal + ')');

// ---------- 2. 工具 ----------
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function toUrl(p) {
  p = String(p == null ? '' : p).trim();
  if (!p) return '';
  if (/^https?:\/\//i.test(p)) return p;
  return CDN + p.replace(/^\.\//, '').replace(/^\//, '');
}
const dn = (n) => DISPLAY[n] || n;
const ALIAS = { '黑猫': 'cat' };
function avatarOf(name, fallback) {
  if (name === '我') return toUrl(myAvatar);
  const rk = ALIAS[name] || name;
  const r = roles[rk];
  return toUrl((r && r.avatar) || fallback || './data/avatar/me.jpg');
}
function momentTime(s) {
  const str = String(s || '');
  if (str.indexOf('刚刚') >= 0) return Date.now();
  const mt = str.match(/(\d{4})年(\d{1,2})月(\d{1,2})日(?:\s*(\d{1,2}):(\d{1,2}))?/);
  if (mt) return Date.UTC(+mt[1], +mt[2] - 1, +mt[3], +(mt[4] || 0), +(mt[5] || 0));
  return 0;
}
// 复刻 padHm：小时补零
const padHm = (s) => String(s || '').replace(/(\d{1,2}):(\d{2})/g, (_, h, mi) => `${String(h).padStart(2, '0')}:${mi}`);

// ---------- 3. 汇总全部动态，按真实发布时间倒序 ----------
const all = [];
for (const user of Object.keys(MOMENTS)) {
  const ud = MOMENTS[user] || {};
  (ud.posts || []).forEach((p) => {
    all.push(Object.assign({}, p, { author: user, cover: ud.cover || '' }));
  });
}
// _wxMyPosts 默认为空，本地预览里用户新发的动态不落盘，这里无需补
all.sort((a, b) => momentTime(b.time) - momentTime(a.time));

// ---------- 4. 渲染一条动态 ----------
function renderPost(post) {
  const imgs = post.images || [];
  const cols = imgs.length === 1 ? 1 : (imgs.length === 4 ? 2 : 3);
  let imgsHtml = '';
  if (imgs.length) {
    const cls = cols === 1 ? 'mzc-mom-i mzc-mom-i1' : (cols === 2 ? 'mzc-mom-i mzc-mom-i4' : 'mzc-mom-i');
    imgsHtml = `<div class="mzc-mom-imgs">` + imgs.map((u) => `<img class="${cls}" src="${esc(toUrl(u))}" alt="">`).join('') + `</div>`;
  }

  let social = '';
  const likes = post.likes || [];
  const comments = post.comments || [];
  if (likes.length || comments.length) {
    let inner = '';
    if (likes.length) {
      const names = likes.map((n, i) => `<span class="mzc-mom-likers">${esc(dn(n))}</span>${i === likes.length - 1 ? '' : '<span class="mzc-mom-sep">，</span>'}`).join('');
      const likeCls = comments.length ? 'mzc-mom-like' : 'mzc-mom-like mzc-mom-like-only';
      inner += `<div class="${likeCls}"><span class="mzc-mom-heart">&#9829;</span><span class="mzc-mom-likers-box">${names}</span></div>`;
    }
    comments.forEach((c) => {
      let line = `<span class="mzc-mom-cname">${esc(dn(c.user))}</span>`;
      if (c.replyTo) line += `<span class="mzc-mom-reply"> 回复 </span><span class="mzc-mom-cname">${esc(dn(c.replyTo))}</span>`;
      line += `<span class="mzc-mom-ctext">：${esc(c.text)}</span>`;
      inner += `<div class="mzc-mom-cmt">${line}</div>`;
    });
    social = `<div class="mzc-mom-social">${inner}</div>`;
  }

  const txt = String(post.text || '');
  return `<div class="mzc-mom-row"><img class="mzc-mom-av" src="${esc(avatarOf(post.author))}" alt="">`
    + `<div class="mzc-mom-main">`
    + `<div class="mzc-mom-name">${esc(dn(post.author))}</div>`
    + (txt ? `<div class="mzc-mom-txt">${esc(txt)}</div>` : '')
    + imgsHtml
    + `<div class="mzc-mom-meta"><span class="mzc-mom-time">${esc(padHm(post.time))}</span><span class="mzc-mom-dots">&#8226;&#8226;&#8226;</span></div>`
    + social
    + `</div></div>`;
}

// ---------- 5. 手机外框（与聊天章节一致） ----------
const status = `<div class="mzc-status"><span class="mzc-st-time">上午00:24</span><span class="mzc-st-right"><span class="mzc-sig"><i></i><i></i><i></i><i></i></span><span class="mzc-wifi"><i class="w1"></i><i class="w2"></i><i class="w3"></i></span><span class="mzc-bat"><span class="mzc-bat-in"></span><span class="mzc-bat-cap"></span></span></span></div>`;
const nav = `<div class="mzc-mom-nav"><span class="mzc-mom-back">&#8249;</span><span class="mzc-mom-title">朋友圈</span><span class="mzc-mom-cam">&#128247;</span></div>`;
const cover = `<div class="mzc-mom-cover"><span class="mzc-mom-shade"></span><span class="mzc-mom-me">我</span><img class="mzc-mom-meav" src="${esc(toUrl(myAvatar))}" alt=""></div>`;
const body = `<div class="mzc-mom-body">${cover}${all.map(renderPost).join('')}</div>`;
const home = `<div class="mzc-homebar"></div>`;
const phone = `<div class="mzc-phone mzc-mom-phone"><div class="mzc-screen">${status}${nav}${body}${home}</div></div>`;
const promo = `<div class="mzc-promo"><span class="mzc-promo-line">ao3功能有限仅存档捡手机聊天记录部分，可互动版本需打开网页版↓</span><a class="mzc-promo-btn" href="https://cgcgdsg.cc.cd/" target="_blank" rel="noreferrer">进入完整捡手机小游戏</a></div>`;
const chapter = `<div class="mzc-root">${phone}${promo}</div>`;

// ---------- 6. Work Skin CSS 追加朋友圈样式 ----------
const momCss = `/* ===== MOMENTS CHUNK START ===== */
#workskin .mzc-mom-phone .mzc-screen::after{top:74px;height:733px;}
#workskin .mzc-mom-nav{height:44px;background:#f7f7f7;border-bottom:1px solid #d9d9d9;position:relative;text-align:center;line-height:44px;font-size:17px;font-weight:600;color:#111;}
#workskin .mzc-mom-back{position:absolute;left:14px;top:0;font-size:28px;line-height:44px;color:#111;}
#workskin .mzc-mom-title{display:inline-block;}
#workskin .mzc-mom-cam{position:absolute;right:16px;top:0;font-size:20px;line-height:44px;color:#111;}
#workskin .mzc-mom-body{width:400px;height:733px;overflow-y:auto;overflow-x:hidden;background:#fff;scrollbar-width:none;scrollbar-color:transparent transparent;}
#workskin .mzc-mom-body::-webkit-scrollbar{display:none;width:0;height:0;background:transparent;}
#workskin .mzc-mom-body::-webkit-scrollbar-thumb{background:transparent;}
#workskin .mzc-mom-body::-webkit-scrollbar-track{background:transparent;}
#workskin .mzc-mom-body p{margin:0;}
#workskin .mzc-mom-cover p,#workskin .mzc-mom-row p,#workskin .mzc-mom-meta p,#workskin .mzc-mom-imgs p,#workskin .mzc-mom-social p,#workskin .mzc-mom-like p,#workskin .mzc-mom-cmt p{display:contents;}
#workskin .mzc-mom-cover{position:relative;height:300px;background-image:url('https://cgcgdsg.cc.cd/data/avatar/mycover.jpg');background-position:center;background-size:cover;background-repeat:no-repeat;}
#workskin .mzc-mom-shade{position:absolute;left:0;top:180px;width:400px;height:120px;background:rgba(0,0,0,.28);}
#workskin .mzc-mom-me{position:absolute;right:100px;bottom:24px;color:#fff;font-size:18px;font-weight:600;text-shadow:0 1px 3px rgba(0,0,0,.5);}
#workskin .mzc-mom-meav{position:absolute;right:16px;bottom:20px;width:70px;height:70px;border-radius:8px;border:2px solid #fff;}
#workskin .mzc-mom-row{display:flex;align-items:flex-start;padding:20px 16px;border-bottom:1px solid #f0f0f0;}
#workskin .mzc-mom-av{width:44px;height:44px;min-width:44px;border-radius:6px;}
#workskin .mzc-mom-main{flex:1;min-width:0;margin-left:12px;}
#workskin .mzc-mom-name{color:#576b95;font-size:16px;font-weight:600;line-height:1.3;margin-bottom:4px;}
#workskin .mzc-mom-txt{font-size:15px;color:#111;line-height:1.45;white-space:pre-wrap;word-break:break-word;}
#workskin .mzc-mom-imgs{margin-top:8px;margin-bottom:8px;}
#workskin .mzc-mom-i{display:inline-block;width:88px;height:88px;margin:0 4px 4px 0;border-radius:4px;vertical-align:top;}
#workskin .mzc-mom-i4{width:135px;height:135px;}
#workskin .mzc-mom-i1{width:180px;height:135px;}
#workskin .mzc-mom-meta{display:flex;align-items:center;justify-content:space-between;margin-top:8px;}
#workskin .mzc-mom-time{font-size:12px;color:#999;}
#workskin .mzc-mom-dots{background:#f7f7f7;padding:2px 8px;border-radius:4px;color:#576b95;font-size:13px;font-weight:500;}
#workskin .mzc-mom-social{background:#f7f7f7;border-radius:4px;padding:8px 10px;margin-top:8px;font-size:14px;line-height:1.5;color:#111;}
#workskin .mzc-mom-like{display:flex;align-items:flex-start;border-bottom:1px solid #e5e5ea;padding-bottom:8px;margin-bottom:8px;}
#workskin .mzc-mom-like-only{border-bottom:0;padding-bottom:0;margin-bottom:0;}
#workskin .mzc-mom-heart{width:18px;min-width:18px;color:#576b95;font-size:15px;}
#workskin .mzc-mom-likers-box{flex:1;color:#576b95;font-weight:500;}
#workskin .mzc-mom-sep{color:#576b95;}
#workskin .mzc-mom-cmt{margin-top:4px;}
#workskin .mzc-mom-cname{color:#576b95;font-weight:500;}
#workskin .mzc-mom-reply{color:#111;}
#workskin .mzc-mom-ctext{color:#111;}
/* ===== MOMENTS CHUNK END ===== */`;

const cssPath = path.join(OUT, 'work_skin.css');
let css = fs.readFileSync(cssPath, 'utf8');
css = css.replace(/\/\* ===== MOMENTS CHUNK START ===== \*\/[\s\S]*?\/\* ===== MOMENTS CHUNK END ===== \*\/\n?/, '');
css = css.replace(/\s*$/, '') + '\n' + momCss + '\n';
fs.writeFileSync(cssPath, css, 'utf8');

// ---------- 7. 输出 ----------
const chaptersDir = path.join(OUT, 'chapters');
fs.writeFileSync(path.join(chaptersDir, 'chapter_12.html'), chapter.replace(/\n/g, ''), 'utf8');
const listPath = path.join(chaptersDir, 'chapters.json');
const list = JSON.parse(fs.readFileSync(listPath, 'utf8'));
const idx = list.filter((x) => x.role !== '朋友圈').length + 1;
const rest = list.filter((x) => x.role !== '朋友圈');
rest.push({ index: idx, role: '朋友圈', name: '朋友圈', file: 'chapter_12.html', chars: chapter.length, msgs: all.length });
fs.writeFileSync(listPath, JSON.stringify(rest, null, 2), 'utf8');

// 本地预览（复用工作皮肤 CSS）
const preview = `<!doctype html><html lang="zh"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AO3 朋友圈预览</title><style>body{margin:0;background:#c9c9c9;padding:20px;}#workskin{max-width:430px;margin:0 auto;background:#ededed;}${css}</style></head><body><div id="workskin">${chapter.replace(/\n/g, '')}</div></body></html>`;
fs.writeFileSync(path.join(OUT, 'preview_moments.html'), preview, 'utf8');

console.log('动态条数:', all.length);
all.forEach((p, i) => console.log(`  ${i + 1}. ${dn(p.author)} | ${p.time} | 图${(p.images || []).length} 赞${(p.likes || []).length} 评${(p.comments || []).length}`));
console.log('chapter_12.html 字节:', fs.statSync(path.join(chaptersDir, 'chapter_12.html')).size);
console.log('work_skin.css 字节:', fs.statSync(cssPath).size);
console.log('章节总数:', rest.length);
