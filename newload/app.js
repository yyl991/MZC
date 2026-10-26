"use strict";
const $ = (s) => document.querySelector(s);
const SCREEN = $("#screen"),
  APP = $("#appL"),
  HOME = $("#homeL"),
  LOCK = $("#lockL"),
  OV = $("#ov"),
  PLAYER = $("#player");
const base = Date.now();
const elapsed = () => (Date.now() - base) / 1000;

window.toastDev = function (customMsg) {
  const msgs = [
    "这功能还在“局部宇宙”里没飞过来，请小纸团耐心等候~",
    "系统正在呼唤你：睡个好觉，功能还没写好，别熬夜等这个按钮了~",
    "我在后台看到你点了，但我不想理你（理直气壮）",
    "其它按钮点起来，这个功能I don't care",
    "这个功能还没写，别催，正在做数据",
    "穆祉丞说门留着等你回家，但没说这个假按钮今天能点开",
    "这是九岁的穆瑞恩画的按钮，他还没学会怎么让它动起来",
    "作者正在为了买馒头的钱努力搬砖写代码，这个按钮还没做好，再等等！",
    "功能开发进度：0.01%，但至少开始了，就像当初认识丞丞一样",
    "世界那么大，馒头那么小，功能那么新，代码那么旧，这个按钮还没写好呢~",
    "欢迎来到属于我们的局部宇宙~宇宙太大了，功能还在飞尚未抵达（还没做完。）",
    "程序员正在给你的局部宇宙搭建功能，星星太多，得一颗一颗连",
    "等一下等一下，等等等等等等，哎别这么着急好不好——代码还在写",
    "穆祉丞说‘怎么办，你们是不是要对我负责啊~’ 所以这个还没做完的功能，你得负责等。",
  ];
  const msg = customMsg || msgs[Math.floor(Math.random() * msgs.length)];
  document.querySelectorAll(".dev-toast-wrap").forEach((e) => e.remove());
  const wrap = document.createElement("div");
  wrap.className = "dev-toast-wrap";
  wrap.style.cssText =
    "position:absolute; bottom:120px; left:0; right:0; display:flex; justify-content:center; pointer-events:none; z-index:999999;";
  const t = document.createElement("div");
  t.style.cssText =
    "background:rgba(20,20,20,.9); color:#fff; padding:12px 22px; border-radius:16px; font-size:13.5px; transition:opacity 0.3s, transform 0.3s; box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-weight: 500; -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); border: 1.5px solid rgba(255, 163, 107, 0.7); max-width: 80%; text-align: center; line-height: 1.5; word-break: break-word;";
  t.textContent = msg;
  wrap.appendChild(t);
  document.getElementById("screen").appendChild(wrap);
  t.style.opacity = "1";
  t.style.transform = "translateY(0)";
  setTimeout(() => {
    t.style.opacity = "0";
    t.style.transform = "translateY(10px)";
    setTimeout(() => wrap.remove(), 300);
  }, 2500);
};

window.alert = function (msg) {
  if (
    typeof msg === "string" &&
    (msg.includes("开发") ||
      msg.includes("暂无") ||
      msg.includes("占位") ||
      msg === "")
  )
    window.toastDev();
  else window.toastDev(msg);
};

document.addEventListener("click", (e) => {
  if (e.target.closest("input, textarea, video, [onclick]")) return;
  const fakeBtn = e.target.closest(
    'button, .row, .wx-item, .wx-tabbar button, .tabbar button, .mrw, .cal-d, [style*="cursor: pointer"], [style*="cursor:pointer"]',
  );
  if (!fakeBtn) return;
  if (
    fakeBtn.closest("#music-scroll") ||
    fakeBtn.classList.contains("key") ||
    fakeBtn.closest(".kbd") ||
    fakeBtn.closest(".mapwrap")
  )
    return;
  window.toastDev();
});

const CFG = window.STORY || {};
const SS = window.STORY_STATE || {};
if (!SS.fired) SS.fired = new Set();
if (!SS.fragments) SS.fragments = new Set();
if (!SS.completed) SS.completed = new Set();
if (!SS.stage) SS.stage = {};
if (!SS.lineIdx) SS.lineIdx = {};

const GAME_START_MIN = 23 * 60 + 9,
  GAME_END_AT = 300;
let view = "lock",
  curDark = true,
  SC = 1,
  lastRect = null,
  animTok = 0,
  firstOpen = true,
  pendingOpen = null;
let pincode = "",
  noteId = 0,
  selectedDay = 15,
  calMonth = 11,
  chatId = "穆祉丞",
  mailId = 0,
  missOnly = false,
  safSearch = false;
let unread = {},
  callState = "",
  declined = 0,
  callStart = 0,
  callPrev = "",
  capIdx = -1,
  extraCalls = [];
let callName = "穆祉丞",
  ringIv = null,
  ringTo = null,
  callDir = "in",
  curScript = null,
  isEnding = false,
  callTimers = [],
  rbIv = null;
let lockNotes = [
  {
    title: "闺蜜",
    body: "你跑哪去了？手机怎么在街上？",
    app: "wechat",
    time: "23:09",
  },
];
let nowSong = -1;
window.isDnd = false;

const pad = (n) => String(n).padStart(2, "0");
const esc = (v) =>
  String(v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
function ampm(minutes) {
  const h = Math.floor(minutes / 60) % 24;
  const m = Math.floor(minutes % 60);
  const ap = h >= 12 ? "下午" : "上午";
  const h12 = h % 12 || 12;
  return `${ap} ${h12}:${pad(m)}`;
}
function gameMin() {
  const p = Math.min(1, elapsed() / GAME_END_AT);
  return GAME_START_MIN + Math.floor(p * 51);
}
function clock12(showAmpm = true) {
  const m = gameMin();
  const h = Math.floor(m / 60) % 24;
  const min = Math.floor(m % 60);
  const ampmStr = h >= 12 ? "下午" : "上午";
  const h12 = h % 12 || 12;
  return showAmpm ? `${ampmStr} ${h12}:${pad(min)}` : `${h12}:${pad(min)}`;
}
function gameTime24() {
  const m = gameMin();
  const h = Math.floor(m / 60) % 24;
  const min = Math.floor(m % 60);
  return pad(h) + ":" + pad(min);
}
const nowAmpm = () => clock12();
function relRect(el) {
  const s = SCREEN.getBoundingClientRect(),
    r = el.getBoundingClientRect();
  return {
    x: (r.left - s.left) / SC,
    y: (r.top - s.top) / SC,
    w: r.width / SC,
    h: r.height / SC,
  };
}
const vib = (p) => {
  try {
    navigator.vibrate && navigator.vibrate(p);
  } catch (e) {}
};
const t_ = t;
const T = { duration: 460, easing: "cubic-bezier(.32,.72,0,1)" };
function devRadius() {
  return document.getElementById("phone").classList.contains("mob") ? 0 : 56;
}
const g = (p, o = "") =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ${o}>${p}</svg>`;

const G = {
  speaker: g(
    '<path d="M11 5 6 9H2v6h4l5 4V5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/>',
  ),
  videoF: g(
    '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/>',
  ),
  muteF: g(
    '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/><path d="m3 3 18 18"/>',
  ),
  plusF: g('<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>'),
  keypadF: g(
    '<g fill="currentColor" stroke="none"><circle cx="6" cy="5" r="1.7"/><circle cx="12" cy="5" r="1.7"/><circle cx="18" cy="5" r="1.7"/><circle cx="6" cy="11" r="1.7"/><circle cx="12" cy="11" r="1.7"/><circle cx="18" cy="11" r="1.7"/><circle cx="6" cy="17" r="1.7"/><circle cx="12" cy="17" r="1.7"/><circle cx="18" cy="17" r="1.7"/><circle cx="12" cy="22" r="1.5"/></g>',
  ),
  chevL: `<svg viewBox="0 0 12 20" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2 2 10l8 8"/></svg>`,
  chevR: `<svg class="chev" viewBox="0 0 8 13"><path d="m1.5 1.5 5 5-5 5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  chevRb: g('<path d="m9 5 7 7-7 7"/>'),
  chevLb: g('<path d="m15 5-7 7 7 7"/>'),
  search: g('<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>'),
  plus: g('<path d="M12 5v14M5 12h14"/>'),
  dots: g(
    '<circle cx="12" cy="12" r="9.2"/><circle cx="8" cy="12" r=".8" fill="currentColor"/><circle cx="12" cy="12" r=".8" fill="currentColor"/><circle cx="16" cy="12" r=".8" fill="currentColor"/>',
  ),
  dotsH: g(
    '<circle cx="5" cy="12" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="19" cy="12" r="1.2" fill="currentColor"/>',
  ),
  gear: g(
    '<circle cx="12" cy="12" r="3"/><path d="M12 2.8v2.6M12 18.6v2.6M2.8 12h2.6M18.6 12h2.6M5.5 5.5l1.8 1.8M16.7 16.7l1.8 1.8M5.5 18.5l1.8-1.8M16.7 7.3l1.8-1.8"/><circle cx="12" cy="12" r="6.4"/>',
  ),
  person: g(
    '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
  ),
  chat: g(
    '<path d="M12 4C7 4 3 7.1 3 11c0 2.4 1.5 4.5 3.9 5.8L6 20.5l4-2.4c.6.1 1.3.1 2 .1 5 0 9-3.1 9-7.1S17 4 12 4Z"/>',
  ),
  bag: g('<path d="M5 8h14l-1 12H6Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>'),
  clock: g('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  star: g(
    '<path d="m12 3.6 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9Z"/>',
  ),
  contacts: g(
    '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="9.5" r="3"/><path d="M6.8 18c.9-2.4 2.9-3.6 5.2-3.6s4.3 1.2 5.2 3.6"/>',
  ),
  keypad: g(
    '<g fill="currentColor" stroke="none"><circle cx="6" cy="5" r="1.7"/><circle cx="12" cy="5" r="1.7"/><circle cx="18" cy="5" r="1.7"/><circle cx="6" cy="11" r="1.7"/><circle cx="12" cy="11" r="1.7"/><circle cx="18" cy="11" r="1.7"/><circle cx="6" cy="17" r="1.7"/><circle cx="12" cy="17" r="1.7"/><circle cx="18" cy="17" r="1.7"/><circle cx="12" cy="22" r="1.5"/></g>',
  ),
  info: g(
    '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5"/><circle cx="12" cy="7.8" r=".7" fill="currentColor"/>',
  ),
  compose: g(
    '<path d="M20 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h6"/><path d="M17.5 3.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4Z"/>',
  ),
  share: g('<path d="M12 3v12M8 7l4-4 4 4"/><path d="M6 11v9h12v-9"/>'),
  heart: g(
    '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z"/>',
  ),
  trash: g('<path d="M5 7h14M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/>'),
  book: g(
    '<path d="M4 5.5C6 4.5 9 4.5 12 6c3-1.5 6-1.5 8-.5V19c-2-1-5-1-8 .5-3-1.5-6-1.5-8-.5Z"/><path d="M12 6v13.5"/>',
  ),
  mic: g(
    '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>',
  ),
  globe: g(
    '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.8 3.5 5.8 3.5 9s-1 6.2-3.5 9c-2.5-2.8-3.5-5.8-3.5-9s1-6.2 3.5-9Z"/>',
  ),
  smile: g(
    '<circle cx="12" cy="12" r="9"/><path d="M8.5 14.5c1.8 2 5.2 2 7 0"/><circle cx="9" cy="10" r=".9" fill="currentColor"/><circle cx="15" cy="10" r=".9" fill="currentColor"/>',
  ),
  plusSq: g(
    '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><path d="M12 8v8M8 12h8"/>',
  ),
  arrowUp: g('<path d="M12 19V5M6 11l6-6 6 6"/>'),
  home: g('<path d="M4 10.5 12 4l8 6.5V20h-5v-6H9v6H4Z"/>'),
  bell: g(
    '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15Z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
  ),
  send: g('<path d="M21 3 10 14"/><path d="M21 3 14.5 21l-4.5-7-7-4.5Z"/>'),
  comment: g(
    '<path d="M12 3.5a8.5 8.5 0 1 0 4.3 15.8l4.2 1.2-1.2-4.2A8.5 8.5 0 0 0 12 3.5Z"/>',
  ),
  grid: g(
    '<rect x="3.5" y="3.5" width="17" height="17" rx="1.5"/><path d="M9.2 3.5v17M14.8 3.5v17M3.5 9.2h17M3.5 14.8h17"/>',
  ),
  camera: g(
    '<path d="M4 8h3.5L9 5.5h6L16.5 8H20v11H4Z"/><circle cx="12" cy="13" r="3.5"/>',
  ),
  photo: g(
    '<rect x="3.5" y="5" width="17" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="m4 17 5-4.5 4 3.5 3-2.5 4 3.5"/>',
  ),
  video: g(
    '<rect x="3" y="6.5" width="13" height="11" rx="2"/><path d="m16 10.5 5-3v9l-5-3"/>',
  ),
  list: g(
    '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r=".9" fill="currentColor"/><circle cx="4.5" cy="12" r=".9" fill="currentColor"/><circle cx="4.5" cy="18" r=".9" fill="currentColor"/>',
  ),
  inbox: g(
    '<path d="M3.5 13.5 6 5h12l2.5 8.5V19h-17Z"/><path d="M3.5 13.5H9a3 3 0 0 0 6 0h5.5"/>',
  ),
  check: g('<circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.8 2.7L16 9.5"/>'),
  pen: g('<path d="m14.5 5.5 4 4L8 20H4v-4Z"/>'),
  alarm: g(
    '<circle cx="12" cy="13" r="7.5"/><path d="M12 9.5V13l2.5 1.5M4.5 5 7 3M19.5 5 17 3"/>',
  ),
  stopwatch: g(
    '<circle cx="12" cy="13.5" r="7.5"/><path d="M12 13.5V9.5M10 2.5h4M12 2.5V6"/>',
  ),
  timer: g('<circle cx="12" cy="12" r="8.5"/><path d="M12 12 8 8"/>'),
  musicNote:
    '<svg viewBox="0 0 24 24"><path d="M17 3v11.5a3 3 0 1 1-2-2.8V7.3l-6 1.4v8a3 3 0 1 1-2-2.8V5.5Z"/></svg>',
  playF: '<svg viewBox="0 0 24 24"><path d="M7 4.5v15l12.5-7.5Z"/></svg>',
  pauseF:
    '<svg viewBox="0 0 24 24"><rect x="6" y="4.5" width="4" height="15" rx="1"/><rect x="14" y="4.5" width="4" height="15" rx="1"/></svg>',
  handset:
    '<svg viewBox="0 0 24 24"><path d="M6.6 3.2c.6-.3 1.4-.1 1.8.5l1.9 3c.4.6.3 1.4-.2 1.9l-1.4 1.3a12.4 12.4 0 0 0 5.4 5.4l1.3-1.4c.5-.5 1.3-.6 1.9-.2l3 1.9c.6.4.8 1.2.5 1.8l-.9 1.9c-.5 1-1.6 1.6-2.7 1.4C10 19.6 4.4 14 3.3 6.8c-.2-1.1.4-2.2 1.4-2.7Z"/></svg>',
  voicemail: g(
    '<circle cx="12" cy="12" r="9"/><path d="M8.5 15a4 4 0 0 1 0-6M15.5 9a4 4 0 0 1 0 6"/><path d="M12 9v6"/>',
  ),
  bellF:
    '<svg viewBox="0 0 24 24"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15Z"/><circle cx="12" cy="20.5" r="2"/></svg>',
  msgF: '<svg viewBox="0 0 24 24"><path d="M12 4C7 4 3 7.1 3 11c0 2.4 1.5 4.5 3.9 5.8L6 20.5l4-2.4c.6.1 1.3.1 2 .1 5 0 9-3.1 9-7.1S17 4 12 4Z"/></svg>',
  shift:
    '<svg viewBox="0 0 24 24" width="22" fill="none" stroke="#000" stroke-width="1.7" stroke-linejoin="round"><path d="M12 4 4 12.5h4.5V20h7v-7.5H20Z"/></svg>',
  bksp: '<svg viewBox="0 0 26 20" width="26" fill="none" stroke="#000" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"><path d="M8 3h15v14H8l-6-7Z"/><path d="m12 7 6 6M18 7l-6 6"/></svg>',
  sil: '<svg viewBox="0 0 24 24"><circle cx="12" cy="9" r="4.3" fill="#fff"/><path d="M3.8 22c.6-4.4 4-7 8.2-7s7.6 2.6 8.2 7Z" fill="#fff"/></svg>',
  sun: '<svg viewBox="0 0 24 24" width="24"><circle cx="12" cy="12" r="5" fill="#ffd60a"/><g stroke="#ffd60a" stroke-width="2" stroke-linecap="round"><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></g></svg>',
  moon: '<svg viewBox="0 0 24 24" width="24"><path d="M15.5 3.5A8.5 8.5 0 1 0 20.5 15 7 7 0 0 1 15.5 3.5Z" fill="#fff"/></svg>',
  pcloud:
    '<svg viewBox="0 0 24 24" width="24"><circle cx="9" cy="9" r="4.2" fill="#ffd60a"/><path d="M8 19.5h9.5a3.5 3.5 0 0 0 .3-7A5 5 0 0 0 8.4 11 4.3 4.3 0 0 0 8 19.5Z" fill="#fff"/></svg>',
  cloud:
    '<svg viewBox="0 0 24 24" width="24"><path d="M7 19h10.5a4 4 0 0 0 .4-8A5.6 5.6 0 0 0 7.2 9.2 5 5 0 0 0 7 19Z" fill="#fff"/></svg>',
};

const APPS = {
  maps: "地图",
  instagram: "Instagram",
  photos: "照片",
  mail: "邮件",
  calendar: "日历",
  clock: "时钟",
  notes: "备忘录",
  weather: "天气",
  settings: "设置",
  phone: "电话",
  safari: "Safari",
  wechat: "微信",
  music: "音乐",
  weibo: "微博",
  xianyu: "闲鱼",
  bilibili: "B站",
  xhs: "小红书",
  sms: "短信",
  recorder: "录音",
  privateAlbum: "私密相册",
};


function appIcon(id) {
  const newApps = {
    // 👇 1. 微信也改成读取本地图片
    wechat: {
      cls: "ic-wechat",
      path: "./data/app/wechat.png",
      fallback: `<svg viewBox="0 0 60 60"><rect width="60" height="60" fill="#07c160"/><g fill="#fff"><path d="M23 19c-7.7 0-14 5.2-14 11.7 0 3.7 2.1 7 5.4 9.1l-1.4 4.2 4.9-2.4c1.6.5 3.3.8 5.1.8 7.7 0 14-5.2 14-11.7S30.7 19 23 19Z"/><path d="M39 28c-7.7 0-14 5.2-14 11.7 0 3.7 2.1 7 5.4 9.1l-1.4 4.2 4.9-2.4c1.6.5 3.3.8 5.1.8 7.7 0 14-5.2 14-11.7S46.7 28 39 28Z"/><circle cx="18" cy="27" r="2.5" fill="#07c160"/><circle cx="28" cy="27" r="2.5" fill="#07c160"/><circle cx="34" cy="36" r="2.5" fill="#07c160"/><circle cx="44" cy="36" r="2.5" fill="#07c160"/></g></svg>`
    },
    weibo: {
      cls: "ic-weibo",
      path: "./data/app/weibo.png",
      fallback: `<div style="background:linear-gradient(135deg,#ff8a3d,#ff3b30); width:100%; height:100%; display:grid; place-items:center;">${G.globe}</div>`
    },
    xianyu: {
      cls: "ic-xianyu",
      path: "./data/app/xianyu.png",
      fallback: `<div style="background:linear-gradient(135deg,#ffe25a,#ffb300); width:100%; height:100%; display:grid; place-items:center;">${G.bag}</div>`
    },
    bilibili: {
      cls: "ic-bili",
      path: "./data/app/bilibili.png",
      fallback: `<div style="background:linear-gradient(135deg,#4fc3f7,#00a1d6); width:100%; height:100%; display:grid; place-items:center;">${G.playF}</div>`
    },
    xhs: {
      cls: "ic-xhs",
      path: "./data/app/xhs.png",
      fallback: `<div style="background:linear-gradient(135deg,#ff6b8a,#ff2442); width:100%; height:100%; display:grid; place-items:center;">${G.book}</div>`
    },
    sms: { cls: "ic-sms", icon: G.msgF },
    recorder: { cls: "ic-recorder", icon: G.mic },
    privateAlbum: { cls: "ic-private", icon: G.keypad },
  };

  // 👇 2. 新的安全渲染逻辑：不用恶心的 onerror 嵌套，直接原地叠层
  if (newApps[id]) {
    const app = newApps[id];
    if (app.path) {
      return `<div class="${app.cls}" style="width:100%; height:100%; border-radius:14px; overflow:hidden; position:relative;">
        <!-- 图片层（如果加载失败，它就自己消失） -->
        <img src="${app.path}" style="width:100%; height:100%; object-fit:cover; position:absolute; inset:0; z-index:2;" onerror="this.style.display='none';">
        <!-- 兜底层（默认隐藏，如果上面图片没加载出来，就用 JS 让这个显示） -->
        <div style="width:100%; height:100%; position:absolute; inset:0; z-index:1;">${app.fallback}</div>
      </div>`;
    } else {
      return `<div class="${app.cls}" style="width:100%; height:100%; border-radius:14px; overflow:hidden;"><div class="app-icon-fallback">${app.icon}</div></div>`;
    }
  }

  // 原生系统应用保持原样
  const L = (a, b, c, d) => `<linearGradient id="${a}" x1="0" y1="${d ? 1 : 0}" x2="${d ? 1 : 0}" y2="${d ? 0 : 1}"><stop offset="0" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient>`;
  const W = (defs, body) => `<svg viewBox="0 0 60 60"><defs>${defs}</defs>${body}</svg>`;
  switch (id) {
    case "instagram": return W(`<linearGradient id="gi" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#ffc35c"/><stop offset=".5" stop-color="#ff3d6e"/><stop offset="1" stop-color="#7c3bf0"/></linearGradient>`, `<rect width="60" height="60" fill="url(#gi)"/><rect x="17" y="12.5" width="26" height="34" rx="4.5" fill="none" stroke="#fff" stroke-width="3.2"/><rect x="21.6" y="17" width="16.8" height="17" rx="2" fill="#fff"/>`);
    case "photos": { let p = ""; for (let i = 0; i < 10; i++) p += `<ellipse cx="30" cy="18.2" rx="4.4" ry="10.5" fill="#fff" transform="rotate(${i * 36} 30 30)"/>`; return W(L("gp", "#9bdcff", "#d8f1ff"), `<rect width="60" height="60" fill="url(#gp)"/>${p}<circle cx="30" cy="30" r="7.2" fill="#ffc83d"/><circle cx="30" cy="30" r="7.2" fill="none" stroke="#f0a500" stroke-width="1"/>`); }
    case "mail": return W(L("gm", "#3fb0ff", "#0a6cf5"), `<rect width="60" height="60" fill="url(#gm)"/><rect x="11.5" y="18" width="37" height="25" rx="3.5" fill="#fff"/><path d="M12.5 20 30 32.5 47.5 20" fill="none" stroke="#1676f3" stroke-width="2.4" stroke-linejoin="round"/>`);
    case "calendar": return W("", `<rect width="60" height="60" fill="#fff"/><text x="30" y="17.5" text-anchor="middle" font-size="9.5" font-weight="600" fill="#ff3b30" font-family="-apple-system,sans-serif">星期日</text><text x="30" y="47" text-anchor="middle" font-size="31" font-weight="300" fill="#111" font-family="-apple-system,sans-serif">15</text>`);
    case "clock": { const d = new Date(), h = d.getHours() % 12, m = d.getMinutes(); let t = ""; for (let i = 0; i < 12; i++) t += `<path d="M30 8.5v${i % 3 ? 2.6 : 3.8}" stroke="#111" stroke-width="${i % 3 ? 1 : 1.6}" transform="rotate(${i * 30} 30 30)"/>`; return W("", `<rect width="60" height="60" fill="#000"/><circle cx="30" cy="30" r="24" fill="#fff"/>${t}<path d="M30 30V17" stroke="#111" stroke-width="2.6" stroke-linecap="round" transform="rotate(${h * 30 + m / 2} 30 30)"/><path d="M30 30V11.5" stroke="#111" stroke-width="1.8" stroke-linecap="round" transform="rotate(${m * 6} 30 30)"/><path d="M30 34V11" stroke="#ff9500" stroke-width="1" transform="rotate(${(m * 6 + 90) % 360} 30 30)"/><circle cx="30" cy="30" r="1.8" fill="#ff9500"/>`); }
    case "notes": return W(L("gn", "#ffe27a", "#ffc933"), `<rect width="60" height="60" fill="#fff"/><rect width="60" height="17" fill="url(#gn)"/><g stroke="#d9d9de" stroke-width="1.2"><path d="M8 27h44M8 35h44M8 43h44M8 51h44"/></g><g fill="#cfcfd4"><circle cx="10" cy="17" r=".9"/><circle cx="14" cy="17" r=".9"/><circle cx="18" cy="17" r=".9"/><circle cx="22" cy="17" r=".9"/><circle cx="26" cy="17" r=".9"/><circle cx="30" cy="17" r=".9"/><circle cx="34" cy="17" r=".9"/><circle cx="38" cy="17" r=".9"/><circle cx="42" cy="17" r=".9"/><circle cx="46" cy="17" r=".9"/><circle cx="50" cy="17" r=".9"/></g>`);
    case "weather": return W(L("gw", "#53b5ff", "#1f6fe0"), `<rect width="60" height="60" fill="url(#gw)"/><circle cx="23" cy="23" r="9.5" fill="#ffd84a"/><path d="M19 45h21.5a7.5 7.5 0 0 0 .6-15 10 10 0 0 0-19.2 3.2A6 6 0 0 0 19 45Z" fill="#fff"/>`);
    case "settings": return W(L("gs", "#a7adb6", "#6d727b"), `<rect width="60" height="60" fill="url(#gs)"/><circle cx="30" cy="30" r="17" fill="none" stroke="#e9eaee" stroke-width="7" stroke-dasharray="4.4 4.5"/><circle cx="30" cy="30" r="14" fill="#878c95" stroke="#e9eaee" stroke-width="3.2"/><circle cx="30" cy="30" r="5.5" fill="none" stroke="#e9eaee" stroke-width="3"/><g stroke="#e9eaee" stroke-width="2.4"><path d="M30 17.5v7M30 35.5v7M17.5 30h7M35.5 30h7"/></g>`);
    case "phone": return W(L("gph", "#65f38f", "#28c253"), `<rect width="60" height="60" fill="url(#gph)"/><g transform="translate(12 12) scale(1.5)" fill="#fff">${G.handset.replace(/<\/?svg[^>]*>/g, "")}</g>`);
    case "safari": return W(L("gsa", "#3aa8ff", "#0f5fe0"), `<rect width="60" height="60" fill="#fff"/><circle cx="30" cy="30" r="21" fill="url(#gsa)"/><g fill="none" stroke="#fff" stroke-width="1.6" opacity=".95"><ellipse cx="30" cy="30" rx="8.5" ry="21"/><path d="M9 30h42M12 19.5h36M12 40.5h36M30 9v42"/></g>`);
    case "music": return W(L("gmu", "#ff6f86", "#fa2b47"), `<rect width="60" height="60" fill="url(#gmu)"/><g transform="translate(11 10) scale(1.55)" fill="#fff">${G.musicNote.replace(/<\/?svg[^>]*>/g, "")}</g>`);
    case "maps": return W("", `<rect width="60" height="60" fill="#e9f2df"/><path d="M0 38 60 22v12L0 50Z" fill="#fff"/><path d="M24 0h9L27 60h-9Z" fill="#ffd966"/><path d="M0 12c14 6 30-4 60 6V0H0Z" fill="#bfe3a5"/><path d="M42 60c0-8 10-10 18-12v12Z" fill="#9fd0f5"/><path d="M40 14a8 8 0 0 0-8 8c0 6 8 14 8 14s8-8 8-14a8 8 0 0 0-8-8Z" fill="#ff3b30"/><circle cx="40" cy="22" r="3" fill="#fff"/>`);
  }
  return "";
}

let AC = null;
function ac() {
  if (!AC) {
    try {
      AC = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {}
  }
  if (AC && AC.state === "suspended") AC.resume();
  return AC;
}
function tone(f, t0, dur, vol = 0.12, type = "sine") {
  const a = ac();
  if (!a) return;
  const t = a.currentTime + t0,
    o = a.createOscillator(),
    gn = a.createGain();
  o.type = type;
  o.frequency.value = f;
  gn.gain.setValueAtTime(0, t);
  gn.gain.linearRampToValueAtTime(vol, t + 0.008);
  gn.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(gn).connect(a.destination);
  o.start(t);
  o.stop(t + dur + 0.05);
}
function sfx(k) {
  if (k === "key") tone(2400, 0, 0.025, 0.035, "triangle");
  else if (k === "msg") {
    tone(1046, 0, 0.22, 0.09);
    tone(1397, 0.1, 0.32, 0.09);
  } else if (k === "send") {
    tone(620, 0, 0.07, 0.05);
    tone(930, 0.05, 0.09, 0.05);
  } else if (k === "unlock") {
    tone(1300, 0, 0.05, 0.04, "triangle");
    tone(1700, 0.04, 0.05, 0.03, "triangle");
  } else if (k === "lock") tone(500, 0, 0.06, 0.05, "triangle");
}
function ringOnce() {
  [
    [784, 0],
    [988, 0.2],
    [1175, 0.4],
    [988, 0.6],
    [784, 1.0],
    [988, 1.2],
    [1175, 1.4],
    [1319, 1.6],
  ].forEach(([f, t]) => {
    tone(f, t, 0.35, 0.11);
    tone(f * 2, t, 0.18, 0.03);
  });
}

window.bgmPausedByOther = false;
window.AudioHub = {
  bgm: () => document.getElementById("bgm"),
  isBusy() {
    const videos = document.querySelectorAll("video");
    for (let v of videos) {
      if (!v.paused && !v.ended) return true;
    }
    const audios = document.querySelectorAll("audio");
    for (let a of audios) {
      if (a.id === "bgm") continue;
      if (!a.paused && !a.ended) return true;
    }
    if (document.querySelector(".voice-bb.playing")) return true;
    if (callState) return true;
    if (typeof PLAYER !== "undefined" && !PLAYER.paused && nowSong >= 0)
      return true;
    return false;
  },
  pauseBGM() {
    const b = this.bgm();
    if (b) {
      b.pause();
      window.bgmPausedByOther = true;
    }
  },
  resumeBGM() {
    const b = this.bgm();
    if (!b || !window.bgmPausedByOther) return;
    if (this.isBusy()) return;
    b.play().catch(() => {});
    window.bgmPausedByOther = false;
  },
};
window.pauseBGM = () => window.AudioHub.pauseBGM();
window.resumeBGM = () => window.AudioHub.resumeBGM();
document.addEventListener(
  "play",
  (e) => {
    if (
      e.target.tagName === "VIDEO" ||
      (e.target.tagName === "AUDIO" && e.target.id !== "bgm")
    ) {
      window.AudioHub.pauseBGM();
    }
  },
  true,
);
document.addEventListener(
  "pause",
  (e) => {
    if (
      e.target.tagName === "VIDEO" ||
      (e.target.tagName === "AUDIO" && e.target.id !== "bgm")
    ) {
      setTimeout(() => window.AudioHub.resumeBGM(), 100);
    }
  },
  true,
);
document.addEventListener(
  "pointerdown",
  () => {
    ac();
    const BGM = document.getElementById("bgm");
    if (BGM && BGM.paused && !window.bgmPausedByOther) {
      BGM.volume = 0.1116;
      BGM.play().catch((e) => console.log("BGM播放被拦截", e));
    }
  },
  { once: true },
);

function setStatus(dark) {
  curDark = !!dark;
  $("#sb").classList.toggle("light", curDark);
  $("#hb").classList.toggle("light", curDark);
}
function updateIsland() {
  typeof updateCrumb === "function" && updateCrumb();
  const on =
    nowSong >= 0 &&
    !PLAYER.paused &&
    !["music", "lock", "pin"].includes(view) &&
    !OV.querySelector(".np,.call,.viewer");
  const il = $("#island");
  if (il) il.classList.toggle("act", on);
}
function ncardHTML(n) {
  const r = CFG.roles && CFG.roles[n.title];
  let av = "";
  if (r) {
    if (r.avatar)
      av = `<div class="ni"><img src="${r.avatar}" style="width:100%;height:100%;object-fit:cover;border-radius:9px" /></div>`;
    else
      av = `<div class="ni"><div class="app-icon-fallback" style="background:${r.color};font-size:18px">${r.initial}</div></div>`;
  } else av = `<div class="ni">${appIcon("wechat")}</div>`;
  return `${av}<div class="nt"><div class="nh"><span>${esc(n.title)}</span><small>${n.time}</small></div><div class="nb">${esc(n.body)}</div></div>`;
}
function renderLock() {
  const showNotes = lockNotes.slice(0, 7);
  $("#lkc").innerHTML =
    `<div class="lk-date">${CFG.start?.date || "11月15日"} ${CFG.start?.weekday || "星期日"}</div><div class="lk-time" id="lkt">${clock12(false)}</div><div class="lk-dnd-wrap"><button class="lk-dnd ${window.isDnd ? "on" : ""}" onclick="toggleDnd(event)"><span style="filter:${window.isDnd ? "none" : "grayscale(100%)"}; margin-right:4px;">🌙</span>${window.isDnd ? "免打扰已开启" : "开启免打扰"}</button></div><div class="lk-notes">${showNotes.map((n, i) => `<button class="ncard" onclick="lockNoteTap(${i},event)">${ncardHTML(n)}</button>`).join("")}</div><div class="lk-hint">向上轻扫以打开</div>`;
}
function toggleDnd(e) {
  if (e) e.stopPropagation();
  window.isDnd = !window.isDnd;
  vib(10);
  renderLock();
  updateDndBadge();
}
function updateDndBadge() {
  let badge = document.getElementById("dnd-badge");
  if (!badge) {
    badge = document.createElement("div");
    badge.id = "dnd-badge";
    badge.className = "dnd-badge";
    badge.innerHTML = "🌙";
    document.getElementById("screen").appendChild(badge);
  }
  if (window.isDnd) {
    badge.style.display = "flex";
  } else {
    badge.style.display = "none";
  }
}
function lockNoteTap(i, e) {
  e.stopPropagation();
  if (lockNotes[i].app === "wechat") pendingOpen = "chat";
  goPin();
}

(function lockDrag() {
  const el = $("#lkc");
  let y0 = null,
    dy = 0,
    moved = false;
  el.addEventListener("pointerdown", (e) => {
    if (view !== "lock" || e.target.closest("button")) return;
    y0 = e.clientY;
    dy = 0;
    moved = false;
    el.setPointerCapture(e.pointerId);
  });
  el.addEventListener("pointermove", (e) => {
    if (y0 === null) return;
    dy = Math.min(0, (e.clientY - y0) / SC);
    if (Math.abs(dy) > 6) moved = true;
    el.style.transform = `translateY(${dy}px)`;
    el.style.opacity = 1 + dy / 500;
    $("#wall").style.filter =
      `blur(${Math.min(24, -dy / 8)}px) brightness(${1 - Math.min(0.38, -dy / 700)})`;
  });
  el.addEventListener("pointerup", (e) => {
    if (y0 === null) return;
    const d = dy;
    y0 = null;
    $("#wall").style.filter = "";
    if (d < -70 || (!moved && !e.target.closest("button"))) goPin(d);
    else {
      el.animate(
        [
          { transform: `translateY(${d}px)`, opacity: 1 + d / 500 },
          { transform: "none", opacity: 1 },
        ],
        { duration: 350, easing: "cubic-bezier(.2,1.3,.4,1)" },
      );
      el.style.transform = "";
      el.style.opacity = "";
    }
  });
})();
function goPin(fromDy = 0) {
  view = "pin";
  pincode = "";
  const lk = $("#lkc");
  lk.animate(
    [
      {
        transform: `translateY(${fromDy}px)`,
        opacity: Math.max(0, 1 + fromDy / 500),
      },
      { transform: "translateY(-120px)", opacity: 0 },
    ],
    { duration: 380, easing: "cubic-bezier(.3,.7,.2,1)", fill: "forwards" },
  );
  lk.style.transform = "";
  lk.style.opacity = "";
  lk.style.pointerEvents = "none";
  $("#wall").classList.add("dim");
  renderPin();
  const p = $("#pinL");
  p.style.display = "flex";
  p.animate(
    [
      { opacity: 0, transform: "translateY(40px)" },
      { opacity: 1, transform: "none" },
    ],
    { duration: 420, easing: "cubic-bezier(.2,.9,.25,1)" },
  );
  updateDndBadge();
}
const PL = ["", "ABC", "DEF", "GHI", "JKL", "MNO", "PQRS", "TUV", "WXYZ"];
function renderPin() {
  $("#pinL").innerHTML =
    `<div class="pt">输入密码</div><div class="pdots" id="pdots">${[0, 1, 2, 3].map((i) => `<i class="${i < pincode.length ? "on" : ""}"></i>`).join("")}</div><div class="pkeys">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<button class="pk" onpointerdown="pinPress('${n}',this)"><b>${n}</b><small>${PL[n - 1]}</small></button>`).join("")}<span></span><button class="pk" onpointerdown="pinPress('0',this)"><b>0</b><small></small></button><span></span></div><div class="pbot"><button onclick="vib(10)">紧急情况</button><button id="pcancel" onclick="pinCancelOrDel()">${pincode ? "删除" : "取消"}</button></div>`;
}
function pinDots() {
  $("#pdots").innerHTML = [0, 1, 2, 3]
    .map((i) => `<i class="${i < pincode.length ? "on" : ""}"></i>`)
    .join("");
  $("#pcancel").textContent = pincode ? "删除" : "取消";
}
function pinPress(n, el) {
  if (pincode.length >= 4) return;
  el.classList.add("dn");
  setTimeout(() => el.classList.remove("dn"), 90);
  sfx("key");
  vib(8);
  pincode += n;
  pinDots();
  if (pincode.length === 4) {
    if (pincode === (CFG.start?.pin || "1116")) setTimeout(unlock, 140);
    else {
      setTimeout(() => {
        const d = $("#pdots");
        d.classList.remove("shake");
        void d.offsetWidth;
        d.classList.add("shake");
        vib([60, 40, 60]);
        setTimeout(() => {
          pincode = "";
          pinDots();
        }, 420);
      }, 120);
    }
  }
}
function pinCancelOrDel() {
  if (pincode) {
    pincode = pincode.slice(0, -1);
    pinDots();
    return;
  }
  pinCancel();
}
function pinCancel() {
  view = "lock";
  const p = $("#pinL");
  p.animate([{ opacity: 1 }, { opacity: 0, transform: "translateY(30px)" }], {
    duration: 300,
  }).onfinish = () => (p.style.display = "none");
  const lk = $("#lkc");
  lk.getAnimations().forEach((a) => a.cancel());
  lk.style.pointerEvents = "";
  lk.animate(
    [
      { transform: "translateY(-120px)", opacity: 0 },
      { transform: "none", opacity: 1 },
    ],
    { duration: 450, easing: "cubic-bezier(.2,.9,.25,1)" },
  );
  $("#wall").classList.remove("dim");
  updateDndBadge();
}
function unlock() {
  sfx("unlock");
  view = "home";
  $("#wall").classList.remove("dim");
  LOCK.animate([{ opacity: 1 }, { opacity: 0 }], {
    duration: 300,
    fill: "forwards",
  }).onfinish = () => {
    LOCK.style.visibility = "hidden";
    $("#pinL").style.display = "none";
    $("#lkc")
      .getAnimations()
      .forEach((a) => a.cancel());
    $("#lkc").style.pointerEvents = "";
  };
  renderHome();
  HOME.style.visibility = "visible";
  HOME.animate(
    [
      { transform: "scale(1.18)", opacity: 0 },
      { transform: "none", opacity: 1 },
    ],
    { duration: 560, easing: "cubic-bezier(.2,.9,.22,1)" },
  );
  [...HOME.querySelectorAll(".app,.widget")].forEach((el, i) =>
    el.animate(
      [
        { transform: "scale(.7)", opacity: 0 },
        { transform: "none", opacity: 1 },
      ],
      {
        duration: 520,
        delay: 30 + i * 14,
        easing: "cubic-bezier(.2,1.1,.3,1)",
        fill: "backwards",
      },
    ),
  );
  setStatus(true);
  if (pendingOpen) {
    pendingOpen = null;
    setTimeout(() => {
      chatId = "穆祉丞";
      openApp("chat", HOME.querySelector('.app[data-app="wechat"] .icon'));
    }, 520);
  }
  updateDndBadge();
}

function badgeOf(id) {
  if (id === "phone") return 3 + declined;
  if (id === "mail") {
    if (typeof emailData !== "undefined") {
      const n = emailData.filter((m) => m.unread).length;
      return n > 0 ? Math.min(99, n) : 0;
    }
    return 0;
  }
  if (id === "wechat") {
    let totalUnread = Object.values(unread).reduce((a, b) => a + b, 0);
    return totalUnread > 0 ? Math.min(99, totalUnread) : 0;
  }
  if (id === "sms") {
    if (typeof smsData !== "undefined") {
      const n = smsData.filter((m) => m.unread).length;
      return n > 0 ? Math.min(99, n) : 0;
    }
    return 0;
  }
  return 0;
}
function appBtn(id) {
  const b = badgeOf(id);
  let name = t("app_" + id);
  if (name === "app_" + id) name = APPS[id] || id;
  return `<button class="app" data-app="${id}" onclick="openApp('${id}',this.firstElementChild)"><div class="icon"><div class="ic">${appIcon(id)}</div>${b ? `<span class="bdg">${b}</span>` : ""}</div><span class="lbl">${name}</span></button>`;
}
function renderHome() {
  HOME.innerHTML = `<div class="hgrid"><button class="widget wcal" data-app="calendar" onclick="openApp('calendar',this)"><div class="wd">${wdLong(2026, 11, 15)}</div><div class="wn">15</div>${(events[15] || []).map((x) => `<div class="we">${esc(x)}<small>全天</small></div>`).join("")}</button><button class="widget wwx" data-app="weather" onclick="openApp('weather',this)"><div class="c">北京 ➚</div><div class="tp">18°</div><span style="position:absolute;top:14px;right:14px">${G.sun}</span><div class="ds">大部晴朗<small>最高:21° 最低:12°</small></div></button>${["photos", "mail", "calendar", "clock", "notes", "weather", "settings", "maps", "weibo", "xianyu", "bilibili", "xhs", "recorder"].map(appBtn).join("")}</div><div class="dock">${["wechat", "phone", "sms", "photos"].map(appBtn).join("")}</div>`;
}

const PARENT = {
  note: "notes",
  chat: "wechat",
  maild: "mail",
  reel: "instagram",
  screentime: "settings",
  sms_detail: "sms",
  
  weibo: "weibo",            
  weibo_profile: "weibo",    
  weibo_artist: "weibo",     
  weibo_supertopic: "weibo_artist", 
  weibo_follow: "weibo_profile", // 👈 必须加这一行！

  mail_detail: "mail",
  weibo: "weibo",
  xianyu: "xianyu",
  xianyu_me: "xianyu",
  xianyu_orders: "xianyu_me",
  bilibili: "bilibili",
  xhs: "xhs",
  sms: "sms",
  recorder: "recorder",
  privateAlbum: "photos",
};
const rootOf = (v) => PARENT[v] || v;
function viewDark() {
  if (["lock", "pin", "home"].includes(view)) return true;
  const p = APP.lastElementChild;
  return !!(p && p.dataset.dark);
}
function wireScroll(pg) {
  const sc = pg.querySelector(".scroll");
  if (sc)
    sc.addEventListener(
      "scroll",
      () => pg.classList.toggle("scrolled", sc.scrollTop > 38),
      { passive: true },
    );
}
const VIEWS = {};

function show(id, anim = "swap") {
  const old = [...APP.children];
  old.forEach((o) => o.querySelectorAll("video").forEach((v) => v.pause()));
  if (view === "recorder" && id !== "recorder" && PLAYER.dataset.isRecorder)
    PLAYER.pause();
  if (PLAYER.dataset.voice && !(id === "chat")) PLAYER.pause();
  view = id;
  const v = VIEWS[id]();
  if (!v) return;
  const pg = document.createElement("div");
  pg.className = "pg " + (v.cls || "");
  pg.innerHTML = v.html;
  pg.dataset.view = id;
  pg.dataset.dark = v.dark ? "1" : "";
  if (anim === "pop") APP.insertBefore(pg, APP.firstChild);
  else APP.appendChild(pg);
  setStatus(v.dark);
  wireScroll(pg);
  const done = () => old.forEach((o) => o.remove());
  if (anim === "push") {
    pg.classList.add("pushed");
    pg.animate([{ transform: "translateX(100%)" }, { transform: "none" }], T);
    old.forEach((o) =>
      o.animate(
        [
          { transform: "none", filter: "brightness(1)" },
          { transform: "translateX(-28%)", filter: "brightness(.92)" },
        ],
        T,
      ),
    );
    setTimeout(done, T.duration);
  } else if (anim === "pop") {
    pg.animate(
      [
        { transform: "translateX(-28%)", filter: "brightness(.92)" },
        { transform: "none", filter: "brightness(1)" },
      ],
      T,
    );
    old.forEach((o) => {
      o.classList.add("pushed");
      o.animate([{ transform: "none" }, { transform: "translateX(100%)" }], {
        ...T,
        fill: "forwards",
      });
    });
    setTimeout(done, T.duration);
  } else done();
  v.init && v.init(pg);
  updateIsland();
  updateDndBadge();
  return pg;
}
function zoomFrames(r) {
  const W = SCREEN.clientWidth,
    H = SCREEN.clientHeight,
    s = r.w / W,
    iy = Math.max(0, (H - r.h / s) / 2),
    dx = r.x + r.w / 2 - W / 2,
    dy = r.y + r.h / 2 - H / 2;
  return [
    {
      transform: `translate(${dx}px,${dy}px) scale(${s})`,
      clipPath: `inset(${iy}px 0px round ${15 / s}px)`,
      opacity: 0.25,
    },
    {
      transform: "translate(0px,0px) scale(1)",
      clipPath: `inset(0px 0px round ${devRadius()}px)`,
      opacity: 1,
    },
  ];
}
function openApp(id, el) {
  if (callState || view !== "home" || !VIEWS[id]) return;
  lastRect = el ? relRect(el) : null;
  APP.innerHTML = "";
  try {
    show(id, "none");
  } catch (e) {
    console.error(e);
    view = "home";
    return;
  }
  const tok = ++animTok;
  APP.style.visibility = "visible";
  APP.getAnimations().forEach((a) => a.cancel());
  APP.animate(zoomFrames(lastRect || { x: 166, y: 396, w: 60, h: 60 }), {
    duration: 540,
    easing: "cubic-bezier(.2,.9,.22,1)",
  });
  HOME.animate(
    [
      { transform: "none", opacity: 1 },
      { transform: "scale(1.1)", opacity: 0 },
    ],
    { duration: 400, easing: "ease-in" },
  ).onfinish = () => {
    if (tok === animTok && view !== "home") HOME.style.visibility = "hidden";
  };
  if (firstOpen) {
    firstOpen = false;
    setTimeout(() => {
      $("#hb").classList.add("pulse");
      setTimeout(() => $("#hb").classList.remove("pulse"), 3400);
    }, 900);
  }
}
function closeApp() {
  if (callState || ["home", "lock", "pin"].includes(view)) return;
  if (view === "recorder" && PLAYER.dataset.isRecorder) PLAYER.pause();
  const root = rootOf(view);
  if (PLAYER.dataset.voice) PLAYER.pause();
  view = "home";
  renderHome();
  HOME.style.visibility = "visible";
  setStatus(true);
  const icon = HOME.querySelector(`.app[data-app="${root}"] .icon`);
  const r = icon ? relRect(icon) : { x: 166, y: 396, w: 60, h: 60 };
  const tok = ++animTok;
  APP.getAnimations().forEach((a) => a.cancel());
  const a = APP.animate(zoomFrames(r).reverse(), {
    duration: 460,
    easing: "cubic-bezier(.3,.75,.2,1)",
    fill: "forwards",
  });
  a.onfinish = () => {
    if (tok !== animTok) return;
    APP.style.visibility = "hidden";
    APP.querySelectorAll("video").forEach((v) => v.pause());
    APP.innerHTML = "";
    a.cancel();
  };
  HOME.animate(
    [
      { transform: "scale(1.1)", opacity: 0 },
      { transform: "none", opacity: 1 },
    ],
    { duration: 460, easing: "cubic-bezier(.2,.9,.22,1)" },
  );
  updateIsland();
}
function push(id) {
  show(id, "push");
}
function back() {
  if (PARENT[view]) show(PARENT[view], "pop");
  else closeApp();
}
function hbAction() {
  if (callState) return;
  const vw = OV.querySelector(".viewer");
  if (vw) return closeViewer();
  if (OV.querySelector(".np")) return closeNP();
  if (view === "lock") return goPin();
  if (view === "pin") return;
  if (view === "home")
    return HOME.animate(
      [
        { transform: "none" },
        { transform: "scale(.97)" },
        { transform: "none" },
      ],
      250,
    );
  closeApp();
}
(function hbGesture() {
  const hb = $("#hb");
  const bar = hb.querySelector("i");
  let y0 = null;
  bar.addEventListener("pointerdown", (e) => {
    y0 = e.clientY;
    bar.setPointerCapture(e.pointerId);
  });
  bar.addEventListener("pointerup", (e) => {
    if (y0 === null) return;
    const dy = e.clientY - y0;
    y0 = null;
    if (dy < -20) {
      hbAction();
    }
  });
})();
(function edgeBack() {
  let x0 = null,
    y0 = 0,
    pg = null;
  SCREEN.addEventListener("pointerdown", (e) => {
    const r = SCREEN.getBoundingClientRect();
    if (!PARENT[view] || (e.clientX - r.left) / SC > 22) return;
    x0 = e.clientX;
    y0 = e.clientY;
    pg = APP.lastElementChild;
  });
  SCREEN.addEventListener("pointermove", (e) => {
    if (x0 === null) return;
    const dx = Math.max(0, (e.clientX - x0) / SC);
    if (pg) pg.style.transform = `translateX(${dx}px)`;
  });
  SCREEN.addEventListener("pointerup", (e) => {
    if (x0 === null) return;
    const dx = (e.clientX - x0) / SC;
    x0 = null;
    if (pg) pg.style.transform = "";
    if (dx > 90) back();
  });
})();
function goBack() {
  if (callState) return;
  if (OV.querySelector(".viewer")) return closeViewer();
  if (OV.querySelector(".np")) return closeNP();
  if (["lock", "pin", "home"].includes(view)) {
    if (view === "pin") pinCancel();
    return;
  }
  back();
}
function updateCrumb() {
  // 把 weibo_profile 排除，使用页面自身的滑动返回按钮
  const on = !["lock", "pin", "home", "weibo_profile"].includes(view) && !callState;
  $("#sb").classList.toggle("crumb", on);
}
$("#sbk").innerHTML =
  `<svg viewBox="0 0 7 12"><path d="M6 1 1 6l5 5"/></svg>主页`;
$("#sbk").addEventListener("click", (e) => {
  e.stopPropagation();
  if (callState) return;
  if (OV.querySelector(".viewer")) closeViewer();
  if (OV.querySelector(".np")) closeNP();
  closeApp();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") hbAction();
  else if (e.key === "Backspace" && !e.target.closest("input,textarea")) {
    e.preventDefault();
    goBack();
  }
});
document.addEventListener("mouseup", (e) => {
  if (e.button === 3) {
    e.preventDefault();
    goBack();
  }
});
try {
  history.pushState({ wb: 1 }, "");
  addEventListener("popstate", () => {
    goBack();
    history.pushState({ wb: 1 }, "");
  });
} catch (e) {}

function navHTML(o) {
  return `<div class="nav ${o.solid ? "solid" : ""}">${o.back !== undefined ? `<button class="nb-back" onclick="${o.backFn || "back()"}">${G.chevL}</button>` : o.left || "<span></span>"}<div class="nb-title">${o.title || ""}</div><div class="nb-right">${o.right || ""}</div></div>`;
}

function tabbar(items, on, cls = "") {
  return `<div class="tabbar ${cls}">${items.map(([ic, l], i) => `<button class="${i === on ? "on" : ""}">${G[ic] || ic}<span>${l}</span></button>`).join("")}</div>`;
}
const sw = (on, fn) =>
  `<button class="sw ${on ? "on" : ""}" onclick="this.classList.toggle('on');vib(8);${fn || ""}"></button>`;
function noteDate(d, full) {
  const [y, m, dd] = d.split("-").map(Number);
  if (full) return fmtYMD(y, m, dd);
  if (d === "2026-11-15") return "23:09";
  if (d === "2026-11-14") return "昨天";
  const diff = (new Date(2026, 11, 15) - new Date(y, m - 1, dd)) / 864e5;
  if (diff < 7) return wdLong(y, m, dd);
  return fmtNum(y, m, dd);
}
const noteRow = (n, i) =>
  `<button class="row tap" onclick="noteId=${i};push('note')"><b>${esc(n[0])}</b><small><em>${noteDate(n[3])}</em>${esc(n[1])}</small></button>`;
VIEWS.notes = () => ({
  cls: "grouped notes-pg",
  html:
    navHTML({ title: "备忘录", back: "文件夹", right: G.dots }) +
    `<div class="scroll"><h1 class="lt">备忘录</h1><div class="srch" onclick="toastDev()">${G.search}搜索</div><div class="gh" style="margin-top:8px">📌 置顶</div><div class="group note-l">${notes
      .slice(0, 3)
      .map((n, i) => noteRow(n, i))
      .join(
        "",
      )}</div><div class="gh">备忘录</div><div class="group note-l">${notes
      .slice(3)
      .map((n, i) => noteRow(n, i + 3))
      .join(
        "",
      )}</div></div><div class="toolbar"><span style="width:24px"></span><span style="color:#000;align-self:center;font-size:11px">${notes.length}个备忘录</span><span onclick="toastDev()">${G.compose}</span></div>`,
});
VIEWS.note = () => {
  const n = notes[noteId];
  return {
    cls: "notes-pg",
    html:
      navHTML({
        title: "",
        back: "备忘录",
        right: `<span onclick="toastDev()">${G.share}${G.dots}</span>`,
        solid: false,
      }) +
      `<div class="scroll"><div class="note-v"><div class="nd">${noteDate(n[3], true)}</div><h2>${esc(n[0])}</h2>${esc(n[2])}</div></div><div class="toolbar"><span onclick="toastDev()">${G.check}</span><span onclick="toastDev()">${G.camera}</span><span onclick="toastDev()">${G.pen}</span><span onclick="toastDev()">${G.compose}</span></div>`,
  };
};
function calEvents() {
  if (calMonth === 11)
    return selectedDay === 16 ? ["🎂 生日"] : events[selectedDay] || [];
  return events[selectedDay] || [];
}
VIEWS.calendar = () => {
  const nov = calMonth === 11,
    first = nov ? 0 : 4,
    days = nov ? 30 : 31;
  let c = "";
  for (let i = 0; i < first; i++) c += "<div></div>";
  for (let d = 1; d <= days; d++) {
    const dow = (first + d - 1) % 7,
      has = nov ? d === 16 : !!events[d],
      td = nov && d === 15;
    c += `<button class="cal-d ${td ? "td" : ""} ${d === selectedDay ? "sel" : ""} ${dow === 0 || dow === 6 ? "we" : ""}" onclick="selectedDay=${d};show('calendar')"><span>${d}</span>${has ? "<i></i>" : ""}</button>`;
  }
  const ev =
    calEvents()
      .map((x) => {
        const m = x.split(" · ");
        return `<div class="evt"><span class="bar" style="background:${x.startsWith("🎂") ? "#ff9500" : "#af52de"}"></span><b>${esc(m[0])}</b><small>${m[1] || "全天"}</small></div>`;
      })
      .join("") || `<div class="evt muted">无日程</div>`;
  return {
    html:
      navHTML({
        title: "",
        back: "2026",
        backFn: "closeApp()",
        right: `<span onclick="toastDev()">${G.list}${G.search}${G.plus}</span>`,
      }) +
      `<div class="scroll" style="padding-bottom:120px"><div style="display:flex;justify-content:space-between;align-items:center;margin:0 16px 8px"><h1 class="lt" style="margin:0">${fmtMonth(calMonth)}</h1><span style="display:flex;gap:26px;color:var(--blue)"><button style="width:22px" onclick="calNav(-1)">${G.chevLb}</button><button style="width:22px" onclick="calNav(1)">${G.chevRb}</button></span></div><div class="cal-g cal-w">${wdNarrow()
        .map((w) => `<div>${w}</div>`)
        .join(
          "",
        )}</div><div class="cal-g" id="calg">${c}</div><div style="border-top:.5px solid var(--sep);margin-top:4px;padding-top:4px">${ev}</div></div><div class="tabbar" style="color:#ff3b30">${["今天", "日历", "收件箱"].map((x) => `<button onclick="toastDev()" style="color:#ff3b30;font-size:16px;justify-content:center">${x}</button>`).join("")}</div>`,
  };
};
function calNav(d) {
  const n = calMonth + d;
  if (n < 11 || n > 11) return;
  calMonth = n;
  selectedDay = 15;
  const pg = show("calendar");
  pg.querySelector("#calg").animate(
    [
      { transform: `translateX(${d * 40}%)`, opacity: 0 },
      { transform: "none", opacity: 1 },
    ],
    { duration: 350, easing: "cubic-bezier(.2,.9,.25,1)" },
  );
}

// ==========================================
// 📱 时钟应用 (默认世界时钟，完美复刻截图UI)
// ==========================================

if (typeof window.clockTab === "undefined") window.clockTab = "world";

window.switchClockTab = function (tabName) {
  window.clockTab = tabName;
  show("clock");
};

// ==========================================
// 📱 时钟应用 (默认世界时钟，完美复刻截图UI)
// ==========================================

// 全局记录当前选中的 Tab
if (typeof window.clockTab === "undefined") window.clockTab = "world";

// 切换时钟 Tab 的辅助函数
window.switchClockTab = function (tabName) {
  window.clockTab = tabName;
  show("clock"); 
};

VIEWS.clock = () => {
  const tabs = [
    { id: "world", label: "世界时钟", icon: G.globe },
    { id: "alarm", label: "闹钟", icon: G.alarm },
    { id: "stopwatch", label: "秒表", icon: G.stopwatch },
    { id: "timer", label: "计时器", icon: G.timer },
  ];

  // 底部 Tab 栏 HTML
  const bottomTabHTML = `
    <div style="position:absolute; bottom:34px; left:16px; right:16px; background:#1c1c1e; border-radius:40px; display:flex; padding:8px; z-index:100; box-shadow:0 4px 20px rgba(0,0,0,0.5);">
      ${tabs.map((t) => {
        const isActive = window.clockTab === t.id;
        const color = isActive ? "#ff9f0a" : "#fff";
        const bg = isActive ? "rgba(255, 159, 10, 0.15)" : "transparent";
        return `
          <button onclick="switchClockTab('${t.id}')" style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; border:none; background:${bg}; border-radius:30px; color:${color}; padding:8px 0; transition: background 0.2s;">
            <span style="width:24px; height:24px; display:grid; place-items:center;">${t.icon.replace('<svg', '<svg width="100%" height="100%" stroke="currentColor" fill="none" stroke-width="1.6"')}</span>
            <small style="font-size:10px; font-weight:500;">${t.label}</small>
          </button>
        `;
      }).join("")}
    </div>
  `;

  let contentHTML = "";

  // ==============================
  // 1. 世界时钟
  // ==============================
  if (window.clockTab === "world") {
    const cities = [
      { name: "戛纳", utc: 1 },
      { name: "巴黎", utc: 1 },
      { name: "釜山", utc: 9 },
      { name: "北京", utc: 8 },
      { name: "利雅得", utc: 3 },
    ];

    contentHTML = `
      <div class="scroll" style="padding-top:60px; padding-bottom:120px;">
        <div style="display:flex; justify-content:space-between; align-items:center; padding: 0 16px 20px;">
          <button onclick="toastDev()" style="background:#2c2c2e; color:#fff; border-radius:20px; padding:8px 16px; border:none; font-size:15px; font-weight:500;">编辑</button>
          <button onclick="toastDev()" style="background:#2c2c2e; color:#fff; border-radius:50%; width:36px; height:36px; display:grid; place-items:center; border:none;">${G.plus.replace('<svg', '<svg width="20" height="20"')}</button>
        </div>
        
        <h1 style="margin: 0 16px 10px; font-size:34px; font-weight:700; color:#fff; letter-spacing:0.5px;">世界时钟</h1>
        
        <div style="padding: 0 16px;">
          ${cities.map((c) => {
            const currentMin = gameMin(); 
            let cityMin = currentMin + (c.utc - 8) * 60;
            let dayStr = "今天";
            
            if (cityMin < 0) {
              cityMin += 1440;
              dayStr = "昨天";
            } else if (cityMin >= 1440) {
              cityMin -= 1440;
              dayStr = "明天";
            }

            const h = Math.floor(cityMin / 60) % 24;
            const m = Math.floor(cityMin % 60);
            const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
            
            const diff = c.utc - 8;
            const diffStr = diff === 0 ? "当前时间" : (diff > 0 ? "+" : "") + diff + "小时";

            return `
              <div style="border-bottom: 0.5px solid #333; padding: 16px 0 20px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <div style="font-size:24px; font-weight:500; color:#fff; margin-bottom:4px; letter-spacing:0.5px;">${c.name}</div>
                  <div style="font-size:13px; color:#8e8e93; font-weight:500;">${dayStr} ${diffStr}</div>
                </div>
                <div style="font-size:62px; font-weight:100; color:#fff; line-height:1; letter-spacing:-1px;">${timeStr}</div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  } 
  // ==============================
  // 2. 闹钟
  // ==============================
  else if (window.clockTab === "alarm") {
    contentHTML = `
      <div class="scroll" style="padding-top:60px; padding-bottom:120px;">
        <div style="display:flex; justify-content:space-between; align-items:center; padding: 0 16px 20px;">
          <button onclick="toastDev()" style="background:#2c2c2e; color:#fff; border-radius:20px; padding:8px 16px; border:none; font-size:15px; font-weight:500;">编辑</button>
          <button onclick="toastDev()" style="background:#2c2c2e; color:#fff; border-radius:50%; width:36px; height:36px; display:grid; place-items:center; border:none;">${G.plus.replace('<svg', '<svg width="20" height="20"')}</button>
        </div>
        
        <h1 style="margin: 0 16px 24px; font-size:34px; font-weight:700; color:#fff; letter-spacing:0.5px;">闹钟</h1>
        
        <div style="margin: 0 16px;">
          ${Array.from({ length: 3 }, (_, i) => `
            <div style="border-bottom:0.5px solid #333; padding:16px 0; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <div style="font-size:56px; font-weight:100; color:#fff; line-height:1; letter-spacing:-1px;">08:30</div>
                <div style="font-size:15px; color:#fff; margin-top:4px;">起床</div>
              </div>
              <!-- 原生风格绿色开关 -->
              <div class="sw on" onclick="this.classList.toggle('on'); vib(8);" style="width:51px; height:31px; border-radius:16px; background:#34c759; position:relative; cursor:pointer; flex:none;">
                <div style="position:absolute; top:2px; right:2px; width:27px; height:27px; background:#fff; border-radius:50%; box-shadow:0 2px 6px rgba(0,0,0,0.2); transition: transform 0.2s;"></div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  } 
  // ==============================
  // 3. 秒表
  // ==============================
  else if (window.clockTab === "stopwatch") {
    contentHTML = `
      <div class="scroll" style="padding-top:100px; padding-bottom:120px; display:flex; flex-direction:column; align-items:center;">
        <div style="font-size:86px; font-weight:100; color:#fff; font-variant-numeric:tabular-nums; letter-spacing:-3px;">
          00:00<span style="font-size:40px; margin-left:4px; font-weight:200;">.00</span>
        </div>
        <div style="display:flex; justify-content:space-around; width:100%; margin-top:60px; padding: 0 30px;">
          <button onclick="toastDev()" style="width:86px; height:86px; border-radius:50%; background:#333; color:#fff; font-size:17px; border:none; font-weight:500;">计次</button>
          <button onclick="toastDev()" style="width:86px; height:86px; border-radius:50%; background:#0a3a22; color:#30d158; font-size:17px; border:none; font-weight:500;">启动</button>
        </div>
      </div>
    `;
  } 
  // ==============================
  // 4. 计时器
  // ==============================
  else if (window.clockTab === "timer") {
    contentHTML = `
      <div class="scroll" style="padding-top:100px; padding-bottom:120px; display:flex; flex-direction:column; align-items:center;">
        <div style="width:280px; height:280px; border-radius:50%; border:6px solid #333; display:flex; align-items:center; justify-content:center; position:relative; margin-bottom:40px;">
          <div style="font-size:76px; font-weight:100; color:#fff;">5:00</div>
        </div>
        <div style="display:flex; justify-content:space-around; width:100%; padding: 0 30px;">
          <button onclick="toastDev()" style="width:86px; height:86px; border-radius:50%; background:#333; color:#fff; font-size:17px; border:none; font-weight:500;">取消</button>
          <button onclick="toastDev()" style="width:86px; height:86px; border-radius:50%; background:#0a3a22; color:#30d158; font-size:17px; border:none; font-weight:500;">启动</button>
        </div>
      </div>
    `;
  }

  return {
    cls: "dark",
    dark: true,
    html: contentHTML + bottomTabHTML,
  };
};

function callWhen(s) {
  if (s.startsWith("今天 ")) {
    const [h, m] = s.slice(3).split(":").map(Number);
    return ampm(h * 60 + m);
  }
  const w = s.split(" ")[0];
  if (w === "昨天") return "昨天";
  if (ZH_WD[w] != null) return wdLong(2026, 10, 11 + ZH_WD[w]);
  return w;
}
const callNameDisp = (n) => n;
VIEWS.phone = () => {
  const all = [...extraCalls, ...calls].filter(
    (c) => !missOnly || c[2] === "未接来电",
  );
  return {
    html: `<div class="nav"><button onclick="toastDev()" style="color:var(--blue);font-size:17px;justify-self:start;padding-left:8px">编辑</button><div class="seg"><button class="${missOnly ? "" : "on"}" onclick="missOnly=false;show('phone')">全部</button><button class="${missOnly ? "on" : ""}" onclick="missOnly=true;show('phone')">未接来电</button></div><span></span></div><div class="scroll"><h1 class="lt">最近通话</h1><div class="srch" onclick="toastDev()">${G.search}搜索</div>${all.map((c) => `<div class="prow ${c[2] === "未接来电" ? "miss" : ""}" style="cursor:pointer" onclick="dial('${esc(c[0].replace(/ \(\d+\)$/, ""))}')"><span class="pi">${c[2] === "呼出" ? G.handset : ""}</span><div class="pn"><b>${esc(callNameDisp(c[0]))}</b><small>手机</small></div><span class="pd">${callWhen(c[1])}</span><span class="inf">${G.info}</span></div>`).join("")}</div>${tabbar(
      [
        ["star", "收藏"],
        ["clock", "最近通话"],
        ["contacts", "通讯录"],
        ["keypad", "拨号键盘"],
        ["voicemail", "语音留言"],
      ],
      1,
    )}`,
  };
};
function dial(name) {
  pauseBGM();
  if (callState) return;
  callName = name;
  callDir = "out";
  callPrev = view;
  callState = "dialing";
  if (nowSong >= 0 || PLAYER.dataset.voice) PLAYER.pause();
  APP.querySelectorAll("video").forEach((v) => v.pause());
  OV.querySelectorAll(".banner").forEach((b) => b.remove());
  renderCall();
  rbIv = setTimeout(() => {
    if (callState === "dialing") endCall();
  }, 5000);
}
function startRing() {
  ringOnce();
  clearInterval(ringIv);
  ringIv = setInterval(() => {
    ringOnce();
    vib([400, 250, 400]);
  }, 2600);
  vib([400, 250, 400]);
}
function stopRing() {
  clearInterval(ringIv);
  ringIv = null;
  clearTimeout(ringTo);
  try {
    navigator.vibrate && navigator.vibrate(0);
  } catch (e) {}
}
function incomingCallFrom(from = "穆祉丞") {
  pauseBGM();
  const BGM = document.getElementById("bgm");
  if (BGM) BGM.pause();
  callName = from;
  callDir = "in";
  callPrev = view;
  callState = "ring";
  if (nowSong >= 0 || PLAYER.dataset.voice) PLAYER.pause();
  APP.querySelectorAll("video").forEach((v) => v.pause());
  OV.querySelectorAll(".banner").forEach((b) => b.remove());
  renderCall();
  startRing();
  ringTo = setTimeout(missCall, 30000);
}
function incomingMailFrom(beat) {
  if (typeof emailData === "undefined") return;
  const newId = emailData.reduce((max, m) => Math.max(max, m.id), -1) + 1;
  emailData.unshift({
    id: newId,
    sender: beat.from || "TFEntertainment",
    initial: beat.initial || "T",
    from: beat.fromEmail || "no-reply@tfent.cn",
    subject: beat.subject || "新邮件",
    preview: beat.preview || "点击查看邮件详情",
    time: "刚刚",
    unread: true,
    body: beat.body || "",
  });
  if (view === "mail") {
    const pg = APP.lastElementChild;
    if (pg) pg.innerHTML = VIEWS.mail().html;
  }
  if (view === "home") renderHome();
  if (window.isDnd) return;
  sfx("msg");
  vib([30, 60, 30]);
  OV.querySelectorAll(".banner").forEach((b) => b.remove());
  const b = document.createElement("div");
  b.className = "banner";
  b.style.cursor = "pointer";
  b.innerHTML = `<div class="ncard"><div class="ni"><div class="app-icon-fallback" style="background:#3fb0ff;font-size:18px">${esc(beat.initial || "T")}</div></div><div class="nt"><div class="nh"><span>${esc(beat.from || "TFEntertainment")}</span><small>刚刚</small></div><div class="nb">${esc(beat.subject || "新邮件")}</div></div></div>`;
  OV.appendChild(b);
  b.animate(
    [{ transform: "translateY(-140%) scale(.96)" }, { transform: "none" }],
    { duration: 620, easing: "cubic-bezier(.2,1.25,.35,1)" },
  );
  let tm = setTimeout(() => {
    b.animate(
      [
        { transform: "none", opacity: 1 },
        { transform: "translateY(-140%) scale(.9)", opacity: 0 },
      ],
      { duration: 300, fill: "forwards" },
    ).onfinish = () => b.remove();
  }, 5000);
  b.onclick = () => {
    clearTimeout(tm);
    b.remove();
    if (view === "home")
      openApp("mail", HOME.querySelector('.app[data-app="mail"] .icon'));
    else if (view === "mail") openMailDetail(newId);
    else if (view === "mail_detail") {
      currentMailId = newId;
      show("mail_detail", "push");
    }
  };
}
function callTop() {
  const r = CFG.roles && CFG.roles[callName];
  let content = "";
  if (r && r.avatar)
    content = `<img src="${r.avatar}" style="width:100%;height:100%;object-fit:cover;" />`;
  else if (r) content = `<div style="font-size:40px">${r.initial}</div>`;
  else
    content = `<span style="width:100%;height:100%;display:grid;place-items:center;background:linear-gradient(#a5abb6,#7f858f)">${G.sil.replace("<svg", '<svg width="64"')}</span>`;
  return `<div class="cav">${content}</div><div class="cnm">${esc(dn(callName))}</div>`;
}
function renderCall() {
  let c = OV.querySelector(".call");
  if (!c) {
    c = document.createElement("div");
    c.className = "call";
    OV.appendChild(c);
    c.animate(
      [
        { opacity: 0, transform: "scale(1.05)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 380, easing: "cubic-bezier(.2,.9,.25,1)" },
    );
  }
  setStatus(true);
  const locked = ["lock", "pin"].includes(callPrev);
  c.classList.toggle("act", callState !== "ring");
  if (callState === "ring") {
    c.innerHTML =
      callTop() +
      `<div class="csub">手机</div>` +
      (locked
        ? `<div class="ring-top"><div class="cb"><span class="cc" style="width:50px;height:50px">${G.bellF}</span>提醒我</div><div class="cb"><span class="cc" style="width:50px;height:50px">${G.msgF}</span>信息</div></div><div class="slider" id="slider"><div class="kn">${G.handset}</div><span>滑动来接听</span></div>`
        : `<div class="ring-top"><div class="cb"><span class="cc" style="width:50px;height:50px">${G.bellF}</span>提醒我</div><div class="cb"><span class="cc" style="width:50px;height:50px">${G.msgF}</span>信息</div></div><div class="ring"><button class="cb red" onclick="declineCall()"><span class="cc"><span style="display:block;transform:rotate(135deg)">${G.handset}</span></span>拒绝</button><button class="cb grn" onclick="answerCall()"><span class="cc">${G.handset}</span>接听</button></div>`);
    if (locked) wireSlider();
  } else {
    const B = [
      ["speaker", "免提"],
      ["videoF", "FaceTime"],
      ["muteF", "静音"],
      ["plusF", "添加"],
      ["end", "结束"],
      ["keypadF", "拨号键盘"],
    ];
    const dl = callState === "dialing";
    c.innerHTML =
      callTop() +
      `<div class="csub" id="ctime">${dl ? "正在呼叫…" : "00:00"}</div>${dl ? "" : `<div class="cap" id="cap"><small>实时字幕</small>…</div>`}<div class="cgrid">${B.map(
        ([i, l]) => {
          if (i === "end")
            return `<button class="cb red" onclick="endCall()"><span class="cc"><span style="display:block;transform:rotate(135deg)">${G.handset}</span></span>${l}</button>`;
          let onclick = "this.classList.toggle('on');vib(8)";
          if (i === "keypadF") onclick = "showDialpad()";
          else if (i === "videoF" || i === "plusF") onclick = "toastDev()";
          return `<button class="cb" onclick="${onclick}"><span class="cc">${G[i]}</span>${l}</button>`;
        },
      ).join("")}</div>`;
    if (!dl)
      c.querySelector(".cav").animate(
        [{ transform: "scale(1)" }, { transform: "scale(.82)" }],
        {
          duration: 400,
          fill: "forwards",
          easing: "cubic-bezier(.2,.9,.25,1)",
        },
      );
  }
}
function wireSlider() {
  const s = $("#slider"),
    k = s.querySelector(".kn"),
    lab = s.querySelector("span");
  let x0 = null,
    dx = 0;
  const max = s.clientWidth - k.clientWidth - 12;
  k.addEventListener("pointerdown", (e) => {
    x0 = e.clientX;
    k.setPointerCapture(e.pointerId);
  });
  k.addEventListener("pointermove", (e) => {
    if (x0 === null) return;
    dx = Math.max(0, Math.min(max, (e.clientX - x0) / SC));
    k.style.transform = `translateX(${dx}px)`;
    lab.style.opacity = 1 - dx / max;
  });
  k.addEventListener("pointerup", () => {
    if (x0 === null) return;
    x0 = null;
    if (dx > max * 0.75) answerCall();
    else {
      k.animate([{ transform: `translateX(${dx}px)` }, { transform: "none" }], {
        duration: 300,
        easing: "cubic-bezier(.2,1.3,.4,1)",
      });
      k.style.transform = "";
      lab.style.opacity = 1;
    }
  });
}
function answerCall() {
  if (callDir === "in") {
    curScript = CFG.callScripts?.[callName] ||
      speech || [["对方", "喂？听得到吗？"]];
    isEnding = true;
  }
  stopRing();
  vib(20);
  callState = "active";
  callStart = Date.now();
  capIdx = -1;
  renderCall();
}
function declineCall() {
  stopRing();
  callState = "";
  declined++;
  extraCalls.unshift([callName, "今天 " + gameTime24(), "未接来电"]);
  closeCallUI();
}
function missCall() {
  if (callState !== "ring") return;
  stopRing();
  callState = "";
  declined++;
  extraCalls.unshift([callName, "今天 " + gameTime24(), "未接来电"]);
  closeCallUI();
}
function endCall() {
  if (typeof closeDialpad === "function") closeDialpad();
  if (callState === "dialing") {
    clearInterval(rbIv);
    callState = "";
    extraCalls.unshift([callName, "今天 " + gameTime24(), "呼出"]);
    closeCallUI();
    if (view === "phone") show("phone");
    return;
  }
  if (callState !== "active") return;
  callState = "ended";
  vib(15);
  const t = $("#ctime");
  if (t) t.textContent = "通话结束";
  const c = OV.querySelector(".call");
  if (c) c.querySelectorAll(".cb").forEach((b) => (b.style.opacity = 0.4));
  extraCalls.unshift([
    callName,
    "今天 " + gameTime24(),
    callDir === "out" ? "呼出" : "接收",
  ]);
  isEnding = false;
  setTimeout(() => {
    callState = "";
    closeCallUI();
    if (view === "phone") show("phone");
  }, 1100);
}
function closeCallUI() {
  const c = OV.querySelector(".call");
  if (!c) return;
  c.animate([{ opacity: 1 }, { opacity: 0, transform: "scale(1.04)" }], {
    duration: 320,
    fill: "forwards",
  }).onfinish = () => {
    c.remove();
    callState = "";
    if (
      callPrev &&
      callPrev !== "lock" &&
      callPrev !== "pin" &&
      callPrev !== view
    ) {
      view = callPrev;
      renderHome();
      HOME.style.visibility = "visible";
      setStatus(true);
    }
    setStatus(viewDark());
    updateIsland();
    if (view === "home") renderHome();
    resumeBGM();
  };
}
let dpVal = "";
function showDialpad() {
  let dp = OV.querySelector(".dialpad");
  if (dp) return;
  dp = document.createElement("div");
  dp.className = "dialpad";
  dp.innerHTML = `<div class="dp-num" id="dp-num"></div><div class="dp-grid"><button onclick="dpPress('1')">1<small> </small></button><button onclick="dpPress('2')">2<small>ABC</small></button><button onclick="dpPress('3')">3<small>DEF</small></button><button onclick="dpPress('4')">4<small>GHI</small></button><button onclick="dpPress('5')">5<small>JKL</small></button><button onclick="dpPress('6')">6<small>MNO</small></button><button onclick="dpPress('7')">7<small>PQRS</small></button><button onclick="dpPress('8')">8<small>TUV</small></button><button onclick="dpPress('9')">9<small>WXYZ</small></button><button onclick="dpPress('*')">*<small> </small></button><button onclick="dpPress('0')">0<small>+</small></button><button onclick="dpPress('#')">#<small> </small></button></div><div class="dp-bottom"><button class="dp-end" onclick="endCall()"><span style="display:block;transform:rotate(135deg)">${G.handset}</span></button><button class="dp-hide" onclick="closeDialpad()">隐藏拨号键盘</button></div>`;
  OV.appendChild(dp);
  dpVal = "";
}
function closeDialpad() {
  const dp = OV.querySelector(".dialpad");
  if (dp) dp.remove();
}
function dpPress(k) {
  dpVal += k;
  const el = document.getElementById("dp-num");
  if (el) el.textContent = dpVal;
  vib(10);
  sfx("key");
}
function showStoryChoice() {
  if (SS.choice) return;
  const d = document.createElement("div");
  d.className = "banner";
  d.style.cssText =
    "top:80px;left:16px;right:16px;background:#fff;border-radius:16px;padding:16px;box-shadow:0 10px 40px rgba(0,0,0,.2)";
  d.innerHTML = `<b style="font-size:17px">你要怎么面对这些年？</b><button style="display:block;width:100%;margin-top:12px;padding:12px;border-radius:12px;background:#f2f2f7" onclick="chooseStory('A',this)">A. 我好愧疚，我错过了你那么多年</button><button style="display:block;width:100%;margin-top:8px;padding:12px;border-radius:12px;background:#ffe8d6" onclick="chooseStory('B',this)">B. 过去无法重来，我会抓住现在的你</button>`;
  OV.appendChild(d);
}
function chooseStory(v, el) {
  SS.choice = v;
  saveStory();
  el.closest(".banner").remove();
  notifyFrom(
    "穆祉丞",
    v === "A" ? "不要愧疚。你来了就好。" : "嗯。我想要的是此刻。",
  );
}
function showEnding(choice) {
  if (SS.arriveHome) return;
  SS.arriveHome = true;
  saveStory();
  const E = CFG.ending?.[choice] || CFG.ending.B;
  const d = document.createElement("div");
  d.className = "viewer";
  d.innerHTML = `<div class="vbg"></div><div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:32px;color:#fff;background:linear-gradient(180deg,#2a1f1a,#0b0b0d)"><div style="font-size:13px;opacity:.6;letter-spacing:2px">11-16 00:00</div><h1 style="font-size:30px;margin:10px 0 18px">${esc(E.title)}</h1><div style="font-size:17px;line-height:1.7;white-space:pre-line">${esc(E.body)}</div><button style="margin-top:28px;padding:14px;border-radius:14px;background:#fff;color:#000;font-weight:700" onclick="this.closest('.viewer').remove();location.reload()">重新开始</button></div>`;
  OV.appendChild(d);
}
function storyTick(e) {
  if (!CFG.timeline) return;
  CFG.timeline.forEach((beat, i) => {
    const key = i + "@" + beat.at;
    if (e >= beat.at && !SS.fired.has(key)) {
      if (beat.needStage !== undefined && beat.from) {
        const currentStage = SS.stage[beat.from] || 0;
        if (currentStage > beat.needStage) {
          SS.fired.add(key);
          return;
        }
      }
      SS.fired.add(key);
      if (beat.type === "notify") incomingMsgFrom(beat.from, beat.text);
      if (beat.type === "call") incomingCallFrom(beat.from || "穆祉丞");
      if (beat.type === "mail") incomingMailFrom(beat);
      if (beat.type === "choice") showStoryChoice();
      if (beat.type === "ending") showEnding(SS.choice || "B");
    }
  });
}
let lastMin = -1;
function tick() {
  typeof updateCrumb === "function" && updateCrumb();
  $("#sbt").textContent = clock12();
  const lk = $("#lkt");
  if (lk) lk.textContent = clock12(false);
  storyTick(elapsed());
  if (callState === "active") {
    const sec = Math.floor((Date.now() - callStart) / 1000);
    const tm = $("#ctime");
    if (tm) tm.textContent = pad(Math.floor(sec / 60)) + ":" + pad(sec % 60);
    const S = curScript || speech || [["对方", "喂？"]];
    if (!S || S.length === 0) return;
    const idx = Math.min(S.length - 1, Math.floor(sec / 3));
    if (idx !== capIdx) {
      capIdx = idx;
      const c = $("#cap");
      if (c && S[idx])
        c.innerHTML = `<small>${esc(dn(S[idx][0]))}</small>${esc(S[idx][1])}`;
    }
    if (sec > S.length * 3 + 2) endCall();
  }
}
function fit() {
  const ph = $("#phone");
  ph.classList.remove("mob");
  ph.classList.toggle("short", innerHeight < 740);
  const baseW = 393,
    baseH = 852;
  const safeH = innerHeight - 30,
    safeW = innerWidth - 20;
  SC = Math.min(safeW / baseW, safeH / baseH, 1);
  ph.style.width = baseW + "px";
  ph.style.height = baseH + "px";
  ph.style.position = "absolute";
  ph.style.left = "50%";
  ph.style.top = "50%";
  ph.style.transformOrigin = "center center";
  ph.style.transform = `translate(-50%, -50%) scale(${SC})`;
  ph.style.margin = "0";
}
function initApp() {
  addEventListener("resize", fit);
  fit();
  view = "home";
  LOCK.style.display = "none";
  renderHome();
  HOME.style.visibility = "visible";
  setStatus(true);
  setInterval(tick, 250);
  tick();
}

let globalViewerList = [],
  globalViewerIndex = 0;
window.openMediaViewer = function (urls, startIndex = 0) {
  let list = urls,
    index = startIndex;
  if (typeof urls === "number") {
    index = urls;
    list = window.currentMediaList || [];
  }
  globalViewerList = list || [];
  globalViewerIndex = index;
  if (globalViewerList.length === 0) return;
  let d = document.querySelector(".global-media-viewer");
  if (d) d.remove();
  d = document.createElement("div");
  d.className = "global-media-viewer";
  d.style.cssText =
    "position:fixed; inset:0; z-index:999999; background:#000; display:flex; align-items:center; justify-content:center; flex-direction:column; overflow:hidden; touch-action:pan-y;";
  const renderViewer = () => {
    const url = globalViewerList[globalViewerIndex];
    const isVideo = /\.(mp4|webm|mov)$/i.test(url);
    d.innerHTML = `<div style="position:absolute; top:50px; left:20px; color:#fff; font-size:30px; cursor:pointer; padding:10px; z-index:10;" onclick="this.parentElement.remove()">×</div><div style="position:absolute; top:54px; right:20px; color:#fff; font-size:14px; opacity:0.8; z-index:10;">${globalViewerList.length > 1 ? globalViewerIndex + 1 + " / " + globalViewerList.length : ""}</div><div id="gmv-container" style="width:100%; height:80%; display:flex; align-items:center; justify-content:center; transition:transform 0.3s ease-out;">${isVideo ? `<video src="${url}" controls autoplay playsinline style="max-width:100%; max-height:100%; border-radius:8px;"></video>` : url.length > 5 ? `<img src="${url}" style="max-width:100%; max-height:100%; object-fit:contain;">` : `<div style="font-size:20px; padding:40px; background:linear-gradient(45deg,#ff9a9e,#fecfef); border-radius:12px; color:#fff;">🎀 图片占位：${url}</div>`}</div>`;
  };
  renderViewer();
  let startX = 0,
    startY = 0,
    moveX = 0,
    isDragging = false;
  d.addEventListener("pointerdown", (e) => {
    if (
      e.target.closest("div[onclick]") ||
      e.target.tagName === "VIDEO" ||
      globalViewerList.length <= 1
    )
      return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    moveX = 0;
    const c = d.querySelector("#gmv-container");
    if (c) c.style.transition = "none";
  });
  d.addEventListener("pointermove", (e) => {
    if (!isDragging) return;
    moveX = e.clientX - startX;
    const c = d.querySelector("#gmv-container");
    if (c) {
      if (
        (globalViewerIndex === 0 && moveX > 0) ||
        (globalViewerIndex === globalViewerList.length - 1 && moveX < 0)
      )
        moveX *= 0.3;
      c.style.transform = `translateX(${moveX}px)`;
    }
  });
  d.addEventListener("pointerup", () => {
    if (!isDragging) return;
    isDragging = false;
    const c = d.querySelector("#gmv-container");
    if (c) c.style.transition = "transform 0.3s ease-out";
    if (moveX > 70 && globalViewerIndex > 0) {
      c.style.transform = `translateX(100%)`;
      setTimeout(() => {
        globalViewerIndex--;
        renderViewer();
        const nc = d.querySelector("#gmv-container");
        nc.style.transition = "none";
        nc.style.transform = `translateX(-100%)`;
        requestAnimationFrame(() => {
          nc.style.transition = "transform 0.3s ease-out";
          nc.style.transform = `translateX(0)`;
        });
      }, 250);
    } else if (moveX < -70 && globalViewerIndex < globalViewerList.length - 1) {
      c.style.transform = `translateX(-100%)`;
      setTimeout(() => {
        globalViewerIndex++;
        renderViewer();
        const nc = d.querySelector("#gmv-container");
        nc.style.transition = "none";
        nc.style.transform = `translateX(100%)`;
        requestAnimationFrame(() => {
          nc.style.transition = "transform 0.3s ease-out";
          nc.style.transform = `translateX(0)`;
        });
      }, 250);
    } else {
      c.style.transform = `translateX(0)`;
    }
  });
  document.getElementById("screen").appendChild(d);
};
window.openPhotoViewer = window.openMediaViewer;
