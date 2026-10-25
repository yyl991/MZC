// ==========================================
// 📱 附加应用模块 (app_extra.js)
// ==========================================

// ---------------- 1. 短信 (SMS) ----------------
const smsData = [
  {
    id: 0, name: "中国农业银行", tag: "个人", text: "【中国农业银行】尾号1109卡11月15日02:58农业银行收入(劳务费)...", time: "02:58", iconText: "农", iconColor: "#007AFF", unread: true,
    msgs: [{ me: false, time: "11月15日 02:58", text: "【中国农业银行】尾号1109卡11月15日02:58农业银行收入(劳务费)5.21元，余额11.16元。", type: "text" }]
  },
  {
    id: 1, name: "中国移动高频骚扰电话防护", tag: "商务", text: "【高频骚扰电话防护】尊敬的用户您好...", time: "昨天", iconText: "移", iconColor: "#3FA9F5", unread: false,
    msgs: [{ me: false, time: "昨天 17:38", text: "【高频骚扰电话防护】尊敬的用户您好，2026年11月14日17时38分37秒高频系统为您拦截了1个骚扰电话。", type: "text" }]
  },
  {
    id: 2, name: "美团", tag: "商务", text: "665540 (商户登录二次验证验证码)...", time: "星期四", iconText: "美", iconColor: "#FFD100", unread: false,
    msgs: [{ me: false, time: "星期四 11:00", text: "665540 (商户登录二次验证验证码)。工作人员不会向您索要，请勿向任何人泄露。", type: "text" }]
  },
  {
    id: 3, name: "5G消息 AI助手", tag: "商务", text: "信息：【灵犀会员，让每一秒都成为成长阶梯】", time: "星期三", iconText: "AI", iconColor: "#4CD964", unread: false,
    msgs: [{ me: false, time: "11月11日 周三 09:11", type: "card", title: "【流量查询提醒】", desc: "尊敬的用户，您好！为方便您随时掌握流量使用情况，可点击下方按钮查询，避免扣费。", buttons: ["一句话查询", "同意协议免费关注", "用户协议", "如何取消推送"] }]
  }
];

let currentSmsDetailId = 0;

function openSmsDetail(id) {
  const data = smsData.find(d => d.id === id);
  if (!data) return;
  data.unread = false; 
  currentSmsDetailId = id;
  push('sms_detail');
}

VIEWS.sms = () => ({
  html: navHTML({ title: "信息", back: "主页", backFn: "closeApp()" }) +
  `<div class="scroll" style="background:#f2f2f7;">
    <div class="srch" style="margin-top:10px;" onclick="toastDev()">${G.search}搜索</div>
    <div style="background:#fff; margin:0 16px; border-radius:12px; overflow:hidden;">
      ${smsData.map(m => `
        <div onclick="openSmsDetail(${m.id})" style="display:flex; align-items:flex-start; padding:12px 16px; border-bottom:0.5px solid #e5e5ea; cursor:pointer;">
          <div style="width:48px; height:48px; border-radius:50%; background:${m.iconColor}22; display:flex; align-items:center; justify-content:center; margin-right:12px; flex:none; border:1px solid ${m.iconColor}44;">
             <span style="color:${m.iconColor}; font-weight:800; font-size:16px;">${m.iconText}</span>
          </div>
          <div style="flex:1; min-width:0; padding-top:2px;">
            <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:4px;">
              <span style="font-size:16px; font-weight:500; color:#111; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${esc(m.name)}</span>
              <div style="display:flex; align-items:center; gap:6px; flex:none; margin-left:8px;">
                <span style="font-size:13px; color:#8e8e93;">${m.time}</span>
                <span style="color:#c4c4c7;">${G.chevR}</span>
              </div>
            </div>
            <div style="font-size:14px; line-height:1.35; color:#8e8e93; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
              <span style="display:inline-block; background:#e5e5ea; color:#666; font-size:10px; padding:1px 4px; border-radius:4px; margin-right:4px; transform:translateY(-1px);">${m.tag}</span>
              ${esc(m.text)}
            </div>
          </div>
          ${m.unread ? `<div style="width:10px; height:10px; border-radius:50%; background:#007aff; margin-left:10px; align-self:center; flex:none;"></div>` : ''}
        </div>
      `).join('')}
    </div>
  </div>`,
});

VIEWS.sms_detail = () => {
  const data = smsData.find(d => d.id === currentSmsDetailId);
  if (!data) return { html: "" };

  return {
    html: navHTML({ title: data.name, back: "信息", backFn: "back()", right: `<span onclick="toastDev()" style="color:#007aff; display:flex;"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></span>` }) +
    `<div class="scroll" style="background:#f2f2f7; padding-top:88px; padding-bottom:100px; display:flex; flex-direction:column; gap:8px;">
        ${data.msgs.map(msg => {
          if (msg.type === "card") {
             return `
               <div style="text-align:center; font-size:12px; color:#8e8e93; margin: 10px 0;">${msg.time}</div>
               <div style="padding:0 16px; display:flex; flex-direction:column; align-items:flex-start;">
                  <div style="max-width:85%; background:#e9e9eb; border-radius:16px; padding:12px 16px; color:#111;">
                     <div style="font-size:15px; font-weight:600; margin-bottom:4px;">${esc(msg.title)}</div>
                     <div style="font-size:14px; line-height:1.4; color:#333;">${esc(msg.desc)}</div>
                  </div>
               </div>
               <div style="padding:0 16px; display:flex; flex-direction:column; align-items:flex-start; margin-top:-4px;">
                  <div style="max-width:85%; background:#e9e9eb; border-radius:16px; overflow:hidden;">
                     ${msg.buttons.map((btn, i) => `
                        <div onclick="toastDev()" style="font-size:15px; color:#007aff; padding:11px 16px; cursor:pointer; ${i > 0 ? 'border-top:0.5px solid #d1d1d6;' : ''}">
                           ${esc(btn)}
                        </div>
                     `).join('')}
                  </div>
               </div>
             `;
          } else {
             return `
               <div style="text-align:center; font-size:12px; color:#8e8e93; margin: 10px 0;">${msg.time}</div>
               <div style="padding:0 16px; display:flex; flex-direction:column; align-items:${msg.me ? 'flex-end' : 'flex-start'};">
                  <div style="max-width:75%; padding:10px 14px; border-radius:18px; font-size:15px; line-height:1.4; background:${msg.me ? '#007aff' : '#e9e9eb'}; color:${msg.me ? '#fff' : '#111'};">
                    ${esc(msg.text)}
                  </div>
               </div>
             `;
          }
        }).join('')}
      </div>
      <div style="position:absolute; bottom:34px; left:16px; right:16px; display:flex; align-items:flex-end; gap:12px;">
         <div onclick="toastDev()" style="width:36px; height:36px; background:#fff; border-radius:50%; display:grid; place-items:center; color:#333; font-size:24px; font-weight:300; margin-bottom:2px; cursor:pointer; box-shadow:0 1px 4px rgba(0,0,0,0.08);">+</div>
         <div onclick="toastDev()" style="flex:1; background:#fff; height:38px; border-radius:19px; display:flex; align-items:center; justify-content:space-between; padding:0 14px; color:#8e8e93; box-shadow:0 1px 4px rgba(0,0,0,0.05);">
            <span style="font-size:15px;">信息 · RCS</span>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3"/></svg>
         </div>
      </div>`,
  };
};

// ---------------- 2. 天气 (Weather) ----------------
VIEWS.weather = () => {
  const hours = [
    { t: "现在", icon: "moon", temp: "18°" }, { t: "23时", icon: "moon", temp: "14°" },
    { t: "0时", icon: "moon", temp: "13°" }, { t: "1时", icon: "moon", temp: "11°" },
    { t: "2时", icon: "moon", temp: "11°" }, { t: "3时", icon: "moon", temp: "10°" },
    { t: "4时", icon: "moon", temp: "10°" }
  ];
  const daily = [
    { day: "今天", icon: "sun", min: 12, max: 21 }, { day: "周一", icon: "cloud-sun", min: 11, max: 20 },
    { day: "周二", icon: "cloud", min: 10, max: 18 }, { day: "周三", icon: "sun", min: 9, max: 19 },
    { day: "周四", icon: "sun", min: 10, max: 20 }, { day: "周五", icon: "cloud-sun", min: 11, max: 19 },
    { day: "周六", icon: "cloud", min: 8, max: 15 }, { day: "周日", icon: "sun", min: 7, max: 16 },
    { day: "周一", icon: "sun", min: 8, max: 17 }, { day: "周二", icon: "cloud-sun", min: 9, max: 18 }
  ];
  const Icons = {
    moon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="#fff"><path d="M15.5 3.5A8.5 8.5 0 1 0 20.5 15 7 7 0 0 1 15.5 3.5Z"/></svg>`,
    sun: `<svg viewBox="0 0 24 24" width="22" height="22" fill="#ffd60a"><circle cx="12" cy="12" r="5"/><g stroke="#ffd60a" stroke-width="2" stroke-linecap="round"><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></g></svg>`,
    cloud: `<svg viewBox="0 0 24 24" width="22" height="22" fill="#fff"><path d="M7 19h10.5a4 4 0 0 0 .4-8A5.6 5.6 0 0 0 7.2 9.2 5 5 0 0 0 7 19Z"/></svg>`,
    "cloud-sun": `<svg viewBox="0 0 24 24" width="22" height="22"><circle cx="8" cy="8" r="4" fill="#ffd60a"/><path d="M10 19h8.5a3.5 3.5 0 0 0 .3-7A5 5 0 0 0 10 12.5 4 4 0 0 0 10 19Z" fill="#fff"/></svg>`
  };
  const globalMin = 5, globalMax = 25;
  const getBarStyle = (min, max) => `left: ${((min - globalMin) / (globalMax - globalMin)) * 100}%; width: ${((max - min) / (globalMax - globalMin)) * 100}%;`;

  return {
    html: `
    <div style="position:absolute; inset:0; background:linear-gradient(180deg, #3d65d8 0%, #6495ed 50%, #3d65d8 100%); color:#fff; display:flex; flex-direction:column; overflow:hidden;">
      <div style="position:absolute; top:50px; left:16px; z-index:10; display:flex; align-items:center; gap:4px; font-size:15px; font-weight:500; cursor:pointer;" onclick="closeApp()">
        <svg viewBox="0 0 12 20" width="10" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2 2 10l8 8"/></svg> 主屏幕
      </div>
      <div class="scroll" style="flex:1; padding-top:85px; padding-bottom:100px; overflow-y:auto; scrollbar-width:none;">
        <div style="text-align:center; margin-bottom:20px;">
          <div style="font-size:15px; font-weight:500; opacity:0.8; margin-bottom:2px;">我的位置</div>
          <div style="font-size:34px; font-weight:400;">北京</div>
          <div style="font-size:96px; font-weight:200; line-height:1; margin:0 0 4px -15px;">18°</div>
          <div style="font-size:20px; font-weight:500;">大部晴朗</div>
          <div style="font-size:16px; font-weight:500; opacity:0.9; margin-top:2px;">最高21° 最低12°</div>
        </div>
        <div style="background:rgba(255,255,255,0.15); border-radius:16px; margin:0 16px 16px; padding:14px 16px; backdrop-filter:blur(10px);">
          <div style="font-size:14px; font-weight:500; padding-bottom:10px; border-bottom:0.5px solid rgba(255,255,255,0.2); margin-bottom:10px;">预计整个下午大部晴朗。阵风风速最高 4 米/秒。</div>
          <div style="display:flex; gap:24px; overflow-x:auto; scrollbar-width:none;">
            ${hours.map(h => `<div style="display:flex; flex-direction:column; align-items:center; gap:8px;"><div style="font-size:15px; font-weight:600;">${h.t}</div>${Icons[h.icon]}<div style="font-size:17px; font-weight:600;">${h.temp}</div></div>`).join('')}
          </div>
        </div>
        <div style="background:rgba(255,255,255,0.15); border-radius:16px; margin:0 16px 16px; padding:14px 16px; backdrop-filter:blur(10px);">
          <div style="font-size:13px; font-weight:600; opacity:0.7; display:flex; align-items:center; gap:6px; padding-bottom:10px; border-bottom:0.5px solid rgba(255,255,255,0.2); margin-bottom:6px;"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg> 10 天天气预报</div>
          ${daily.map((d, i) => `
            <div style="display:flex; align-items:center; padding:10px 0; ${i > 0 ? 'border-top:0.5px solid rgba(255,255,255,0.15);' : ''}">
              <div style="width:50px; font-size:16px; font-weight:600;">${d.day}</div>
              <div style="width:40px; display:flex; justify-content:center;">${Icons[d.icon]}</div>
              <div style="width:35px; font-size:16px; font-weight:500; opacity:0.8; text-align:right;">${d.min}°</div>
              <div style="flex:1; height:4px; background:rgba(0,0,0,0.15); border-radius:2px; margin:0 12px; position:relative;"><div style="position:absolute; top:0; bottom:0; border-radius:2px; background:linear-gradient(90deg, #84fab0, #ffe259); ${getBarStyle(d.min, d.max)}"></div></div>
              <div style="width:35px; font-size:16px; font-weight:500; text-align:right;">${d.max}°</div>
            </div>
          `).join('')}
        </div>
      </div>
      <div style="position:absolute; bottom:0; left:0; right:0; height:84px; background:rgba(255,255,255,0.15); backdrop-filter:blur(20px); display:flex; justify-content:space-between; align-items:center; padding:0 24px;">
        <svg onclick="toastDev()" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fff" stroke-width="1.8"><path d="M9 20l-5.5 2.5V6L9 3.5M9 20l6-2.5M9 20V3.5M15 17.5l5.5 2.5V8L15 5.5M15 17.5V5.5"/></svg>
        <div style="display:flex; gap:8px;"><div style="width:8px; height:8px; border-radius:50%; background:#fff;"></div><div style="width:8px; height:8px; border-radius:50%; background:rgba(255,255,255,0.4);"></div></div>
        <svg onclick="toastDev()" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
      </div>
    </div>`
  };
};

// ---------------- 3. 录音 (Recorder) ----------------
const RECORDER_DATA = [
  { id: 0, title: "小恩恩唱歌", time: "0:13", date: "11月15日", src: "./data/music/boli.mp3" },
  { id: 1, title: "玻璃弹唱", time: "0:21", date: "11月14日", src: "./data/music/boli.mp3" },
  { id: 2, title: "🎧 穆祉丞动静", time: "0:08", date: "11月13日", src: "./data/music/boli.mp3" },
  { id: 3, title: "练习室环境音", time: "1:05", date: "11月10日", src: "./data/music/boli.mp3" }
];

let currentRecorderId = -1;

function playRecorder(id) {
  const data = RECORDER_DATA.find(r => r.id === id);
  if (!data) return;
  if (typeof PLAYER === 'undefined' || !PLAYER) return;

  if (currentRecorderId === id && !PLAYER.paused) {
    PLAYER.pause(); updateRecorderUI(); if (typeof resumeBGM === 'function') resumeBGM(); return;
  }
  if (typeof pauseBGM === 'function') pauseBGM();
  if (typeof nowSong !== 'undefined') nowSong = -1;
  if (typeof updateMiniUI === 'function') updateMiniUI(); 
  currentRecorderId = id;
  PLAYER.dataset.isRecorder = "true"; 
  PLAYER.src = data.src;
  PLAYER.volume = 0.8;
  PLAYER.load();
  PLAYER.onended = () => { updateRecorderUI(); if (typeof resumeBGM === 'function') resumeBGM(); };
  PLAYER.play().catch(e => console.warn("录音播放失败:", e));
  updateRecorderUI();
}

function updateRecorderUI() {
  if (typeof view === 'undefined' || view !== 'recorder') return;
  const pg = APP.lastElementChild;
  if (!pg) return;
  RECORDER_DATA.forEach(r => {
    const btn = document.getElementById(`rec-btn-${r.id}`);
    if (btn) {
      const isPlaying = typeof PLAYER !== 'undefined' && PLAYER && !PLAYER.paused && currentRecorderId === r.id;
      if (isPlaying) {
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" style="width:16px;height:16px;"><rect x="6" y="4.5" width="4" height="15" rx="1"/><rect x="14" y="4.5" width="4" height="15" rx="1"/></svg>`;
      } else {
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" style="width:16px;height:16px;margin-left:2px;"><path d="M7 4.5v15l12.5-7.5Z"/></svg>`;
      }
    }
  });
}

if (typeof PLAYER !== 'undefined' && PLAYER) {
  PLAYER.addEventListener('pause', updateRecorderUI);
}

VIEWS.recorder = () => ({
  html: navHTML({ title: "录音", back: "主页", backFn: "closeApp()" }) +
    `<div class="scroll" style="background:#f9f9f9; padding-bottom:120px;">
      <h1 class="lt" style="margin-top:10px;">所有录音</h1>
      <div style="margin:0 16px;">
        ${RECORDER_DATA.map(r => `
          <div style="background:#fff; border-radius:12px; padding:14px 16px; margin-bottom:10px; display:flex; align-items:center; justify-content:space-between; box-shadow:0 1px 3px rgba(0,0,0,0.04);">
            <div>
              <div style="font-size:16px; font-weight:600; color:#111; margin-bottom:4px;">${esc(r.title)}</div>
              <div style="font-size:13px; color:#888;">${r.date}</div>
            </div>
            <div style="display:flex; align-items:center; gap:12px;">
              <span style="font-size:15px; color:#666; font-variant-numeric:tabular-nums;">${r.time}</span>
              <button id="rec-btn-${r.id}" onclick="playRecorder(${r.id})" style="width:36px; height:36px; border-radius:50%; background:#ff3b30; color:#fff; display:grid; place-items:center; border:none;">
                <svg viewBox="0 0 24 24" fill="currentColor" style="width:16px;height:16px;margin-left:2px;"><path d="M7 4.5v15l12.5-7.5Z"/></svg>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
    <div style="position:absolute; bottom:40px; left:50%; transform:translateX(-50%); z-index: 10;">
      <button onclick="toastDev()" style="width:72px; height:72px; border-radius:50%; background:#ff3b30; color:#fff; border:4px solid #fff; box-shadow:0 4px 20px rgba(255,59,48,0.4); font-size:28px; display:grid; place-items:center;">🎙️</button>
    </div>`,
  init: () => { setTimeout(updateRecorderUI, 50); }
});

// ---------------- 4. 基础占位 ----------------
const placeholderView = (title) => () => ({
  html: navHTML({ title: title, back: "主页", backFn: "closeApp()" }) +
  `<div class="scroll" style="display:flex;align-items:center;justify-content:center;height:80vh;color:#8e8e93;font-size:15px">暂无内容</div>`,
});
VIEWS.settings = placeholderView("设置");
VIEWS.instagram = placeholderView("Instagram");