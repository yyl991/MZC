const smsData = [
  {
    id: 4,
    name: "大麦网",
    tag: "通知",
    text: "【大麦网】您订购的穆祉丞2026「局部宇宙」演唱会 - 北京站...",
    time: "刚刚",
    iconText: "麦",
    iconColor: "#FF5722",
    unread: true,
    msgs: [
      {
        me: false,
        time: "刚刚",
        text: "【大麦网】您订购的穆祉丞2026「局部宇宙」演唱会 - 北京站（人、票、证信息不匹配无法入场），场次时间为：2026-11-16 星期一 18:30已正式开票，订单号:20071116521131415926信息已更新，您可通过大麦App的票夹查看票品信息、取票方式等演出相关信息。大麦网预祝您观演愉快。",
        type: "text",
      },
    ],
  },
  {
    id: 0,
    name: "中国农业银行",
    tag: "个人",
    text: "【中国农业银行】尾号1109卡11月15日02:58农业银行收入(劳务费)...",
    time: "02:58",
    iconText: "农",
    iconColor: "#007AFF",
    unread: false,
    msgs: [
      {
        me: false,
        time: "11月15日 02:58",
        text: "【中国农业银行】尾号1109卡11月15日02:58农业银行收入(劳务费)5.21元，余额11.16元。",
        type: "text",
      },
    ],
  },
  {
    id: 1,
    name: "中国移动高频骚扰电话防护",
    tag: "商务",
    text: "【高频骚扰电话防护】尊敬的用户您好...",
    time: "昨天",
    iconText: "移",
    iconColor: "#3FA9F5",
    unread: false,
    msgs: [
      {
        me: false,
        time: "昨天 17:38",
        text: "【高频骚扰电话防护】尊敬的用户您好，2026年11月14日17时38分37秒高频系统为您拦截了1个骚扰电话。",
        type: "text",
      },
    ],
  },
  {
    id: 2,
    name: "美团",
    tag: "商务",
    text: "665540 (商户登录二次验证验证码)...",
    time: "星期四",
    iconText: "美",
    iconColor: "#FFD100",
    unread: false,
    msgs: [
      {
        me: false,
        time: "星期四 11:00",
        text: "665540 (商户登录二次验证验证码)。工作人员不会向您索要，请勿向任何人泄露。",
        type: "text",
      },
    ],
  },
  {
    id: 3,
    name: "5G消息 AI助手",
    tag: "商务",
    text: "信息：【灵犀会员，让每一秒都成为成长阶梯】",
    time: "星期三",
    iconText: "AI",
    iconColor: "#4CD964",
    unread: false,
    msgs: [
      {
        me: false,
        time: "11月11日 周三 09:11",
        type: "card",
        title: "【流量查询提醒】",
        desc: "尊敬的用户，您好！为方便您随时掌握流量使用情况，可点击下方按钮查询，避免扣费。",
        buttons: ["一句话查询", "同意协议免费关注", "用户协议", "如何取消推送"],
      },
    ],
  },
];
let currentSmsDetailId = 0;
function openSmsDetail(id) {
  const data = smsData.find((d) => d.id === id);
  if (!data) return;
  data.unread = false;
  currentSmsDetailId = id;
  push("sms_detail");
}
VIEWS.sms = () => ({
  html:
    navHTML({ title: "信息", back: "主页", backFn: "closeApp()" }) +
    `<div class="scroll" style="background:#f2f2f7;"><div class="srch" style="margin-top:10px;" onclick="toastDev()">${G.search}搜索</div><div style="background:#fff; margin:0 16px; border-radius:12px; overflow:hidden;">${smsData.map((m) => `<div onclick="openSmsDetail(${m.id})" style="display:flex; align-items:flex-start; padding:12px 16px; border-bottom:0.5px solid #e5e5ea; cursor:pointer;"><div style="width:48px; height:48px; border-radius:50%; background:${m.iconColor}22; display:flex; align-items:center; justify-content:center; margin-right:12px; flex:none; border:1px solid ${m.iconColor}44;"><span style="color:${m.iconColor}; font-weight:800; font-size:16px;">${m.iconText}</span></div><div style="flex:1; min-width:0; padding-top:2px;"><div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:4px;"><span style="font-size:16px; font-weight:500; color:#111; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${esc(m.name)}</span><div style="display:flex; align-items:center; gap:6px; flex:none; margin-left:8px;"><span style="font-size:13px; color:#8e8e93;">${m.time}</span><span style="color:#c4c4c7;">${G.chevR}</span></div></div><div style="font-size:14px; line-height:1.35; color:#8e8e93; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;"><span style="display:inline-block; background:#e5e5ea; color:#666; font-size:10px; padding:1px 4px; border-radius:4px; margin-right:4px; transform:translateY(-1px);">${m.tag}</span>${esc(m.text)}</div></div>${m.unread ? `<div style="width:10px; height:10px; border-radius:50%; background:#007aff; margin-left:10px; align-self:center; flex:none;"></div>` : ""}</div>`).join("")}</div></div>`,
});
VIEWS.sms_detail = () => {
  const data = smsData.find((d) => d.id === currentSmsDetailId);
  if (!data) return { html: "" };
  return {
    html:
      navHTML({
        title: data.name,
        back: "信息",
        backFn: "back()",
        right: `<span onclick="toastDev()" style="color:#007aff; display:flex;"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></span>`,
      }) +
      `<div class="scroll" style="background:#f2f2f7; padding-top:88px; padding-bottom:100px; display:flex; flex-direction:column; gap:8px;">${data.msgs
        .map((msg) => {
          if (msg.type === "card") {
            return `<div style="text-align:center; font-size:12px; color:#8e8e93; margin: 10px 0;">${msg.time}</div><div style="padding:0 16px; display:flex; flex-direction:column; align-items:flex-start;"><div style="max-width:85%; background:#e9e9eb; border-radius:16px; padding:12px 16px; color:#111;"><div style="font-size:15px; font-weight:600; margin-bottom:4px;">${esc(msg.title)}</div><div style="font-size:14px; line-height:1.4; color:#333;">${esc(msg.desc)}</div></div></div><div style="padding:0 16px; display:flex; flex-direction:column; align-items:flex-start; margin-top:-4px;"><div style="max-width:85%; background:#e9e9eb; border-radius:16px; overflow:hidden;">${msg.buttons.map((btn, i) => `<div onclick="toastDev()" style="font-size:15px; color:#007aff; padding:11px 16px; cursor:pointer; ${i > 0 ? "border-top:0.5px solid #d1d1d6;" : ""}">${esc(btn)}</div>`).join("")}</div></div>`;
          } else {
            return `<div style="text-align:center; font-size:12px; color:#8e8e93; margin: 10px 0;">${msg.time}</div><div style="padding:0 16px; display:flex; flex-direction:column; align-items:${msg.me ? "flex-end" : "flex-start"};"><div style="max-width:75%; padding:10px 14px; border-radius:18px; font-size:15px; line-height:1.4; background:${msg.me ? "#007aff" : "#e9e9eb"}; color:${msg.me ? "#fff" : "#111"};">${esc(msg.text)}</div></div>`;
          }
        })
        .join(
          "",
        )}</div><div style="position:absolute; bottom:34px; left:16px; right:16px; display:flex; align-items:flex-end; gap:12px;"><div onclick="toastDev()" style="width:36px; height:36px; background:#fff; border-radius:50%; display:grid; place-items:center; color:#333; font-size:24px; font-weight:300; margin-bottom:2px; cursor:pointer; box-shadow:0 1px 4px rgba(0,0,0,0.08);">+</div><div onclick="toastDev()" style="flex:1; background:#fff; height:38px; border-radius:19px; display:flex; align-items:center; justify-content:space-between; padding:0 14px; color:#8e8e93; box-shadow:0 1px 4px rgba(0,0,0,0.05);"><span style="font-size:15px;">信息 · RCS</span><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3"/></svg></div></div>`,
  };
};
VIEWS.weather = () => {
  const hours = [
    { t: "现在", icon: "moon", temp: "18°" },
    { t: "23时", icon: "moon", temp: "14°" },
    { t: "0时", icon: "moon", temp: "13°" },
    { t: "1时", icon: "moon", temp: "11°" },
    { t: "2时", icon: "moon", temp: "11°" },
    { t: "3时", icon: "moon", temp: "10°" },
    { t: "4时", icon: "moon", temp: "10°" },
  ];
  const daily = [
    { day: "今天", icon: "sun", min: 12, max: 21 },
    { day: "周一", icon: "cloud-sun", min: 11, max: 20 },
    { day: "周二", icon: "cloud", min: 10, max: 18 },
    { day: "周三", icon: "sun", min: 9, max: 19 },
    { day: "周四", icon: "sun", min: 10, max: 20 },
    { day: "周五", icon: "cloud-sun", min: 11, max: 19 },
    { day: "周六", icon: "cloud", min: 8, max: 15 },
    { day: "周日", icon: "sun", min: 7, max: 16 },
    { day: "周一", icon: "sun", min: 8, max: 17 },
    { day: "周二", icon: "cloud-sun", min: 9, max: 18 },
  ];
  const Icons = {
    moon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="#fff"><path d="M15.5 3.5A8.5 8.5 0 1 0 20.5 15 7 7 0 0 1 15.5 3.5Z"/></svg>`,
    sun: `<svg viewBox="0 0 24 24" width="22" height="22" fill="#ffd60a"><circle cx="12" cy="12" r="5"/><g stroke="#ffd60a" stroke-width="2" stroke-linecap="round"><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></g></svg>`,
    cloud: `<svg viewBox="0 0 24 24" width="22" height="22" fill="#fff"><path d="M7 19h10.5a4 4 0 0 0 .4-8A5.6 5.6 0 0 0 7.2 9.2 5 5 0 0 0 7 19Z"/></svg>`,
    "cloud-sun": `<svg viewBox="0 0 24 24" width="22" height="22"><circle cx="8" cy="8" r="4" fill="#ffd60a"/><path d="M10 19h8.5a3.5 3.5 0 0 0 .3-7A5 5 0 0 0 10 12.5 4 4 0 0 0 10 19Z" fill="#fff"/></svg>`,
  };
  const globalMin = 5,
    globalMax = 25;
  const getBarStyle = (min, max) =>
    `left: ${((min - globalMin) / (globalMax - globalMin)) * 100}%; width: ${((max - min) / (globalMax - globalMin)) * 100}%;`;
  return {
    html: `<div style="position:absolute; inset:0; background:linear-gradient(180deg, #3d65d8 0%, #6495ed 50%, #3d65d8 100%); color:#fff; display:flex; flex-direction:column; overflow:hidden;"><div style="position:absolute; top:50px; left:16px; z-index:10; display:flex; align-items:center; gap:4px; font-size:15px; font-weight:500; cursor:pointer;" onclick="closeApp()"><svg viewBox="0 0 12 20" width="10" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2 2 10l8 8"/></svg> 主屏幕</div><div class="scroll" style="flex:1; padding-top:85px; padding-bottom:100px; overflow-y:auto; scrollbar-width:none;"><div style="text-align:center; margin-bottom:20px;"><div style="font-size:15px; font-weight:500; opacity:0.8; margin-bottom:2px;">我的位置</div><div style="font-size:34px; font-weight:400;">北京</div><div style="font-size:96px; font-weight:200; line-height:1; margin:0 0 4px -15px;">18°</div><div style="font-size:20px; font-weight:500;">大部晴朗</div><div style="font-size:16px; font-weight:500; opacity:0.9; margin-top:2px;">最高21° 最低12°</div></div><div style="background:rgba(255,255,255,0.15); border-radius:16px; margin:0 16px 16px; padding:14px 16px; backdrop-filter:blur(10px);"><div style="font-size:14px; font-weight:500; padding-bottom:10px; border-bottom:0.5px solid rgba(255,255,255,0.2); margin-bottom:10px;">预计整个下午大部晴朗。阵风风速最高 4 米/秒。</div><div style="display:flex; gap:24px; overflow-x:auto; scrollbar-width:none;">${hours.map((h) => `<div style="display:flex; flex-direction:column; align-items:center; gap:8px;"><div style="font-size:15px; font-weight:600;">${h.t}</div>${Icons[h.icon]}<div style="font-size:17px; font-weight:600;">${h.temp}</div></div>`).join("")}</div></div><div style="background:rgba(255,255,255,0.15); border-radius:16px; margin:0 16px 16px; padding:14px 16px; backdrop-filter:blur(10px);"><div style="font-size:13px; font-weight:600; opacity:0.7; display:flex; align-items:center; gap:6px; padding-bottom:10px; border-bottom:0.5px solid rgba(255,255,255,0.2); margin-bottom:6px;"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg> 10 天天气预报</div>${daily.map((d, i) => `<div style="display:flex; align-items:center; padding:10px 0; ${i > 0 ? "border-top:0.5px solid rgba(255,255,255,0.15);" : ""}"><div style="width:50px; font-size:16px; font-weight:600;">${d.day}</div><div style="width:40px; display:flex; justify-content:center;">${Icons[d.icon]}</div><div style="width:35px; font-size:16px; font-weight:500; opacity:0.8; text-align:right;">${d.min}°</div><div style="flex:1; height:4px; background:rgba(0,0,0,0.15); border-radius:2px; margin:0 12px; position:relative;"><div style="position:absolute; top:0; bottom:0; border-radius:2px; background:linear-gradient(90deg, #84fab0, #ffe259); ${getBarStyle(d.min, d.max)}"></div></div><div style="width:35px; font-size:16px; font-weight:500; text-align:right;">${d.max}°</div></div>`).join("")}</div></div><div style="position:absolute; bottom:0; left:0; right:0; height:84px; background:rgba(255,255,255,0.15); backdrop-filter:blur(20px); display:flex; justify-content:space-between; align-items:center; padding:0 24px;"><svg onclick="toastDev()" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fff" stroke-width="1.8"><path d="M9 20l-5.5 2.5V6L9 3.5M9 20l6-2.5M9 20V3.5M15 17.5l5.5 2.5V8L15 5.5M15 17.5V5.5"/></svg><div style="display:flex; gap:8px;"><div style="width:8px; height:8px; border-radius:50%; background:#fff;"></div><div style="width:8px; height:8px; border-radius:50%; background:rgba(255,255,255,0.4);"></div></div><svg onclick="toastDev()" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg></div></div>`,
  };
};

// ==========================================
// 📱 录音模块 (稳定完美版)
// ==========================================

const RECORDER_DATA = [
  { id: 0, title: "城许路", date: "星期日", time: "04:19", src: "./data/music/boli.mp3" },
  { id: 1, title: "竹园弄", date: "2025年4月1日", time: "02:14", src: "./data/music/boli.mp3" },
  { id: 2, title: "235国道", date: "2024年6月11日", time: "00:26", src: "./data/music/boli.mp3" },
  { id: 3, title: "运溪路", date: "2024年1月31日", time: "01:44", src: "./data/music/boli.mp3" },
  { id: 4, title: "东莲街", date: "2023年4月22日", time: "00:14", src: "./data/music/boli.mp3" },
];

let currentRecorderId = -1;
let recorderProgressTimer = null;

window.playRecorder = function(id) {
  const data = RECORDER_DATA.find((r) => r.id === id);
  if (!data || typeof PLAYER === "undefined" || !PLAYER) return;
  
  // 如果点的是当前正在播放的，就暂停
  if (currentRecorderId === id && !PLAYER.paused) {
    PLAYER.pause();
    currentRecorderId = -1;
    show('recorder'); // 重绘界面恢复列表状态
    if (typeof resumeBGM === "function") resumeBGM();
    return;
  }
  
  if (typeof pauseBGM === "function") pauseBGM();
  if (typeof nowSong !== "undefined") nowSong = -1;
  if (typeof updateMiniUI === "function") updateMiniUI();
  
  currentRecorderId = id;
  PLAYER.dataset.isRecorder = "true";
  PLAYER.src = data.src;
  PLAYER.volume = 0.8;
  PLAYER.load();
  
  PLAYER.onended = () => {
    currentRecorderId = -1;
    show('recorder');
    if (typeof resumeBGM === "function") resumeBGM();
  };
  
  PLAYER.play().catch((e) => console.warn("录音播放失败:", e));
  show('recorder'); // 播放时重绘界面，展开控制面板
};

window.seekRecorder = function(offset) {
  if (typeof PLAYER === "undefined" || currentRecorderId === -1) return;
  let t = (PLAYER.currentTime || 0) + offset;
  if (t < 0) t = 0;
  PLAYER.currentTime = t;
};

function tickRecorderProgress() {
  if (typeof view === "undefined" || view !== "recorder" || currentRecorderId === -1) {
    clearInterval(recorderProgressTimer);
    return;
  }
  const bar = document.getElementById(`rec-bar-${currentRecorderId}`);
  const timeNow = document.getElementById(`rec-time-now-${currentRecorderId}`);
  const timeLeft = document.getElementById(`rec-time-left-${currentRecorderId}`);
  
  if (!bar || !timeNow || !timeLeft) return;
  
  let cur = PLAYER.currentTime || 0;
  let dur = PLAYER.duration;
  
  // 本地音频读不到时长时，默认给15秒兜底，保证进度条能动
  if (isNaN(dur) || dur === Infinity || dur === 0) dur = 15; 
  if (cur > dur) cur = dur;
  
  const percent = (cur / dur) * 100;
  bar.value = percent;
  
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  };
  
  timeNow.textContent = formatTime(cur);
  timeLeft.textContent = `-${formatTime(dur - cur)}`;
}
VIEWS.recorder = () => {
  if (recorderProgressTimer) clearInterval(recorderProgressTimer);
  if (currentRecorderId !== -1 && PLAYER && !PLAYER.paused) {
    recorderProgressTimer = setInterval(tickRecorderProgress, 100);
  }

  const playSvg = `<svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
  const pauseSvg = `<svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor"><rect x="6" y="4.5" width="4" height="15" rx="1"/><rect x="14" y="4.5" width="4" height="15" rx="1"/></svg>`;

  const listHTML = RECORDER_DATA.map((r) => {
    const isActive = currentRecorderId === r.id;
    
    if (isActive) {
      const currentIcon = PLAYER.paused ? playSvg : pauseSvg;
      return `
        <div style="padding: 16px 0; border-bottom: 0.5px solid #e5e5ea; display: flex; flex-direction: column;">
          <div style="padding: 0 16px;">
            <div style="font-size: 22px; font-weight: 400; color: #111; margin-bottom: 4px;">${esc(r.title)}</div>
            <div style="font-size: 14px; color: #8e8e93;">${r.date}</div>
          </div>
          
          <div style="padding: 20px 16px 10px;">
            <input type="range" id="rec-bar-${r.id}" min="0" max="100" value="0" style="width: 100%; accent-color: #8e8e93; height: 4px;">
            <div style="display: flex; justify-content: space-between; font-size: 11px; color: #8e8e93; margin-top: 6px;">
              <span id="rec-time-now-${r.id}">0:00</span>
              <span id="rec-time-left-${r.id}">-${r.time}</span>
            </div>
          </div>
          
          <div style="padding: 10px 16px; display: flex; justify-content: space-between; align-items: center;">
            <div onclick="event.stopPropagation();toastDev()" style="color: #007aff; cursor: pointer; padding: 8px;">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h10M4 18h16"/><circle cx="18" cy="12" r="2" fill="currentColor"/></svg>
            </div>
            <div style="display: flex; align-items: center; gap: 30px;">
              <div onclick="event.stopPropagation();seekRecorder(-15)" style="cursor: pointer;">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#111" stroke-width="1.8" stroke-linecap="round"><path d="M12 21a9 9 0 1 1 9-9"/><path d="M21 3v6h-6"/><text x="12" y="16" font-size="8" font-weight="bold" stroke="none" fill="#111" text-anchor="middle">15</text></svg>
              </div>
              
              <div onclick="event.stopPropagation();playRecorder(${r.id})" style="cursor: pointer; color: #111;">
                ${currentIcon}
              </div>
              
              <div onclick="event.stopPropagation();seekRecorder(15)" style="cursor: pointer;">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#111" stroke-width="1.8" stroke-linecap="round"><path d="M12 21a9 9 0 1 0-9-9"/><path d="M3 3v6h6"/><text x="12" y="16" font-size="8" font-weight="bold" stroke="none" fill="#111" text-anchor="middle">15</text></svg>
              </div>
            </div>
            <div onclick="event.stopPropagation();toastDev()" style="color: #007aff; cursor: pointer; padding: 8px;">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4.5h8V6M5.5 6l1 14h11l1-14"/></svg>
            </div>
          </div>
        </div>
      `;
    } else {
      return `
        <div onclick="playRecorder(${r.id})" style="padding: 16px; border-bottom: 0.5px solid #e5e5ea; display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span style="font-size: 18px; font-weight: 400; color: #111;">${esc(r.title)}</span>
            <span style="font-size: 14px; color: #8e8e93;">${r.date}</span>
          </div>
          <span style="font-size: 14px; color: #8e8e93; font-variant-numeric: tabular-nums;">${r.time}</span>
        </div>
      `;
    }
  }).join("");

  return {
    // 给当前页面加上专属标识类名，方便写专属样式
    cls: "recorder-page",
    html:
      navHTML({ title: "所有录音", back: "", backFn: "closeApp()", solid: true, right: `<span onclick="toastDev()" style="color:#007aff; font-size:17px;">编辑</span>` }) +
      
      // 👇 这里动态注入专属 CSS 放大顶栏和标题
      `<style>
        .recorder-page .nav {
          height: 130px !important; /* 顶栏变高 */
          padding-top: 64px !important; /* 内容下移 */
        }
        .recorder-page .nb-title {
          font-size: 24px !important; /* 标题字变大 */
          font-weight: 700 !important;
        }
        .recorder-page .scroll {
          padding-top: 130px !important; /* 列表避让 */
        }
      </style>

      <div class="scroll" style="background:#fff; padding-bottom:140px;">
         <div style="padding: 0 13px;">
           ${listHTML}
         </div>
      </div>
      
      <!-- 底部原生录音按钮 (背景纯白) -->
      <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 120px; background: #fff; border-top: 0.5px solid #e5e5ea; display: flex; justify-content: center; align-items: flex-start; padding-top: 16px; z-index: 10; padding-bottom: env(safe-area-inset-bottom);">
        <button onclick="toastDev()" style="width: 64px; height: 64px; border-radius: 50%; border: 2px solid #d1d1d6; background: transparent; display: flex; justify-content: center; align-items: center; padding: 0; cursor: pointer;">
          <div style="width: 52px; height: 52px; background: #ff3b30; border-radius: 50%;"></div>
        </button>
      </div>`,
  };
};

const placeholderView = (title) => () => ({
  html:
    navHTML({ title: title, back: "主页", backFn: "closeApp()" }) +
    `<div class="scroll" style="display:flex;align-items:center;justify-content:center;height:80vh;color:#8e8e93;font-size:15px">暂无内容</div>`,
});
VIEWS.settings = placeholderView("设置");
VIEWS.instagram = placeholderView("Instagram");
