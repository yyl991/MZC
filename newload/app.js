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

const CFG = window.STORY || {};
const SS = window.STORY_STATE || {};

// 加上这段安全气囊！
if (!SS.fired) SS.fired = new Set();
if (!SS.fragments) SS.fragments = new Set();
if (!SS.completed) SS.completed = new Set();
if (!SS.stage) SS.stage = {};
if (!SS.lineIdx) SS.lineIdx = {};

const GAME_START_MIN = 23 * 60 + 9;
const GAME_END_AT = 300;

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
let unread = {};
let callState = "",
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
    app: "kakao",
    time: "23:09",
  },
];
let nowSong = -1;

const pad = (n) => String(n).padStart(2, "0");
const esc = (v) =>
  String(v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

function gameMin() {
  const p = Math.min(1, elapsed() / GAME_END_AT);
  return GAME_START_MIN + Math.floor(p * 51);
}
function clock12() {
  const m = gameMin();
  const h = Math.floor(m / 60) % 24;
  const min = Math.floor(m % 60);
  const ampm = h >= 12 ? "下午" : "上午";
  const h12 = h % 12 || 12;
  return `${ampm} ${h12}:${pad(min)}`;
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
  kakao: "微信",
  music: "音乐",
  wechat: "微信",
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
    wechat: {
      cls: "ic-wechat",
      icon: `<svg viewBox="0 0 60 60"><rect width="60" height="60" fill="#07c160"/><g fill="#fff"><path d="M23 19c-7.7 0-14 5.2-14 11.7 0 3.7 2.1 7 5.4 9.1l-1.4 4.2 4.9-2.4c1.6.5 3.3.8 5.1.8 7.7 0 14-5.2 14-11.7S30.7 19 23 19Z"/><path d="M39 28c-7.7 0-14 5.2-14 11.7 0 3.7 2.1 7 5.4 9.1l-1.4 4.2 4.9-2.4c1.6.5 3.3.8 5.1.8 7.7 0 14-5.2 14-11.7S46.7 28 39 28Z"/><circle cx="18" cy="27" r="2.5" fill="#07c160"/><circle cx="28" cy="27" r="2.5" fill="#07c160"/><circle cx="34" cy="36" r="2.5" fill="#07c160"/><circle cx="44" cy="36" r="2.5" fill="#07c160"/></g></svg>`,
    },
    weibo: { cls: "ic-weibo", icon: G.globe },
    xianyu: { cls: "ic-xianyu", icon: G.bag },
    bilibili: { cls: "ic-bili", icon: G.playF },
    xhs: { cls: "ic-xhs", icon: G.book },
    sms: { cls: "ic-sms", icon: G.msgF },
    recorder: { cls: "ic-recorder", icon: G.mic },
    privateAlbum: { cls: "ic-private", icon: G.keypad },
  };
  if (newApps[id])
    return `<div class="${newApps[id].cls}"><div class="app-icon-fallback">${newApps[id].icon}</div></div>`;

  const L = (a, b, c, d) =>
    `<linearGradient id="${a}" x1="0" y1="${d ? 1 : 0}" x2="${d ? 1 : 0}" y2="${d ? 0 : 1}"><stop offset="0" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient>`;
  const W = (defs, body) =>
    `<svg viewBox="0 0 60 60"><defs>${defs}</defs>${body}</svg>`;
  switch (id) {
    case "instagram":
      return W(
        `<linearGradient id="gi" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#ffc35c"/><stop offset=".5" stop-color="#ff3d6e"/><stop offset="1" stop-color="#7c3bf0"/></linearGradient>`,
        `<rect width="60" height="60" fill="url(#gi)"/><rect x="17" y="12.5" width="26" height="34" rx="4.5" fill="none" stroke="#fff" stroke-width="3.2"/><rect x="21.6" y="17" width="16.8" height="17" rx="2" fill="#fff"/>`,
      );
    case "photos": {
      let p = "";
      for (let i = 0; i < 10; i++)
        p += `<ellipse cx="30" cy="18.2" rx="4.4" ry="10.5" fill="#fff" transform="rotate(${i * 36} 30 30)"/>`;
      return W(
        L("gp", "#9bdcff", "#d8f1ff"),
        `<rect width="60" height="60" fill="url(#gp)"/>${p}<circle cx="30" cy="30" r="7.2" fill="#ffc83d"/><circle cx="30" cy="30" r="7.2" fill="none" stroke="#f0a500" stroke-width="1"/>`,
      );
    }
    case "mail":
      return W(
        L("gm", "#3fb0ff", "#0a6cf5"),
        `<rect width="60" height="60" fill="url(#gm)"/><rect x="11.5" y="18" width="37" height="25" rx="3.5" fill="#fff"/><path d="M12.5 20 30 32.5 47.5 20" fill="none" stroke="#1676f3" stroke-width="2.4" stroke-linejoin="round"/>`,
      );
    case "calendar":
      return W(
        "",
        `<rect width="60" height="60" fill="#fff"/><text x="30" y="17.5" text-anchor="middle" font-size="9.5" font-weight="600" fill="#ff3b30" font-family="-apple-system,sans-serif">星期六</text><text x="30" y="47" text-anchor="middle" font-size="31" font-weight="300" fill="#111" font-family="-apple-system,sans-serif">15</text>`,
      );
    case "clock": {
      const d = new Date(),
        h = d.getHours() % 12,
        m = d.getMinutes();
      let t = "";
      for (let i = 0; i < 12; i++)
        t += `<path d="M30 8.5v${i % 3 ? 2.6 : 3.8}" stroke="#111" stroke-width="${i % 3 ? 1 : 1.6}" transform="rotate(${i * 30} 30 30)"/>`;
      return W(
        "",
        `<rect width="60" height="60" fill="#000"/><circle cx="30" cy="30" r="24" fill="#fff"/>${t}<path d="M30 30V17" stroke="#111" stroke-width="2.6" stroke-linecap="round" transform="rotate(${h * 30 + m / 2} 30 30)"/><path d="M30 30V11.5" stroke="#111" stroke-width="1.8" stroke-linecap="round" transform="rotate(${m * 6} 30 30)"/><path d="M30 34V11" stroke="#ff9500" stroke-width="1" transform="rotate(${(m * 6 + 90) % 360} 30 30)"/><circle cx="30" cy="30" r="1.8" fill="#ff9500"/>`,
      );
    }
    case "notes":
      return W(
        L("gn", "#ffe27a", "#ffc933"),
        `<rect width="60" height="60" fill="#fff"/><rect width="60" height="17" fill="url(#gn)"/><g stroke="#d9d9de" stroke-width="1.2"><path d="M8 27h44M8 35h44M8 43h44M8 51h44"/></g><g fill="#cfcfd4"><circle cx="10" cy="17" r=".9"/><circle cx="14" cy="17" r=".9"/><circle cx="18" cy="17" r=".9"/><circle cx="22" cy="17" r=".9"/><circle cx="26" cy="17" r=".9"/><circle cx="30" cy="17" r=".9"/><circle cx="34" cy="17" r=".9"/><circle cx="38" cy="17" r=".9"/><circle cx="42" cy="17" r=".9"/><circle cx="46" cy="17" r=".9"/><circle cx="50" cy="17" r=".9"/></g>`,
      );
    case "weather":
      return W(
        L("gw", "#53b5ff", "#1f6fe0"),
        `<rect width="60" height="60" fill="url(#gw)"/><circle cx="23" cy="23" r="9.5" fill="#ffd84a"/><path d="M19 45h21.5a7.5 7.5 0 0 0 .6-15 10 10 0 0 0-19.2 3.2A6 6 0 0 0 19 45Z" fill="#fff"/>`,
      );
    case "settings":
      return W(
        L("gs", "#a7adb6", "#6d727b"),
        `<rect width="60" height="60" fill="url(#gs)"/><circle cx="30" cy="30" r="17" fill="none" stroke="#e9eaee" stroke-width="7" stroke-dasharray="4.4 4.5"/><circle cx="30" cy="30" r="14" fill="#878c95" stroke="#e9eaee" stroke-width="3.2"/><circle cx="30" cy="30" r="5.5" fill="none" stroke="#e9eaee" stroke-width="3"/><g stroke="#e9eaee" stroke-width="2.4"><path d="M30 17.5v7M30 35.5v7M17.5 30h7M35.5 30h7"/></g>`,
      );
    case "phone":
      return W(
        L("gph", "#65f38f", "#28c253"),
        `<rect width="60" height="60" fill="url(#gph)"/><g transform="translate(12 12) scale(1.5)" fill="#fff">${G.handset.replace(/<\/?svg[^>]*>/g, "")}</g>`,
      );
    case "safari":
      return W(
        L("gsa", "#3aa8ff", "#0f5fe0"),
        `<rect width="60" height="60" fill="#fff"/><circle cx="30" cy="30" r="21" fill="url(#gsa)"/><g fill="none" stroke="#fff" stroke-width="1.6" opacity=".95"><ellipse cx="30" cy="30" rx="8.5" ry="21"/><path d="M9 30h42M12 19.5h36M12 40.5h36M30 9v42"/></g>`,
      );
    case "kakao":
      return W(
        "",
        `<rect width="60" height="60" fill="#07c160"/><path d="M30 14.5c-11.9 0-21.5 7.4-21.5 16.5 0 5.9 4 11.1 10 14l-2.2 7.8c-.2.7.6 1.3 1.2.8l9.2-6.1c1.1.1 2.2.2 3.3.2 11.9 0 21.5-7.4 21.5-16.6S41.9 14.5 30 14.5Z" fill="#fff"/><g fill="#07c160"><circle cx="21.5" cy="31" r="2.7"/><circle cx="30" cy="31" r="2.7"/><circle cx="38.5" cy="31" r="2.7"/></g>`,
      );
    case "music":
      return W(
        L("gmu", "#ff6f86", "#fa2b47"),
        `<rect width="60" height="60" fill="url(#gmu)"/><g transform="translate(11 10) scale(1.55)" fill="#fff">${G.musicNote.replace(/<\/?svg[^>]*>/g, "")}</g>`,
      );
    case "maps":
      return W(
        "",
        `<rect width="60" height="60" fill="#e9f2df"/><path d="M0 38 60 22v12L0 50Z" fill="#fff"/><path d="M24 0h9L27 60h-9Z" fill="#ffd966"/><path d="M0 12c14 6 30-4 60 6V0H0Z" fill="#bfe3a5"/><path d="M42 60c0-8 10-10 18-12v12Z" fill="#9fd0f5"/><path d="M40 14a8 8 0 0 0-8 8c0 6 8 14 8 14s8-8 8-14a8 8 0 0 0-8-8Z" fill="#ff3b30"/><circle cx="40" cy="22" r="3" fill="#fff"/>`,
      );
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
document.addEventListener("pointerdown", () => ac(), { once: true });

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
  if (il) il.classList.toggle("act", on); // 加了 if(il) 保护，找不到也不报错
}

function ncardHTML(n) {
  const r = CFG.roles && CFG.roles[n.title];
  const av = r
    ? `<div class="ni"><div class="app-icon-fallback" style="background:${r.color};font-size:18px">${r.initial}</div></div>`
    : `<div class="ni">${appIcon("kakao")}</div>`;
  return `${av}<div class="nt"><div class="nh"><span>${esc(n.title)}</span><small>${n.time}</small></div><div class="nb">${esc(n.body)}</div></div>`;
}
function renderLock() {
  $("#lkc").innerHTML =
    `<div class="lk-date">${CFG.start?.date || "11月15日"} ${CFG.start?.weekday || "星期六"}</div><div class="lk-time" id="lkt">${clock12()}</div>
 <div class="lk-notes">${lockNotes.map((n, i) => `<button class="ncard" onclick="lockNoteTap(${i},event)">${ncardHTML(n)}</button>`).join("")}</div>
 <div class="lk-hint">向上轻扫以打开</div>`;
}
function lockNoteTap(i, e) {
  e.stopPropagation();
  if (lockNotes[i].app === "kakao") pendingOpen = "chat";
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
}
const PL = ["", "ABC", "DEF", "GHI", "JKL", "MNO", "PQRS", "TUV", "WXYZ"];
function renderPin() {
  $("#pinL").innerHTML =
    `<div class="pt">输入密码</div><div class="pdots" id="pdots">${[0, 1, 2, 3].map((i) => `<i class="${i < pincode.length ? "on" : ""}"></i>`).join("")}</div>
 <div class="pkeys">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<button class="pk" onpointerdown="pinPress('${n}',this)"><b>${n}</b><small>${PL[n - 1]}</small></button>`).join("")}<span></span><button class="pk" onpointerdown="pinPress('0',this)"><b>0</b><small></small></button><span></span></div>
 <div class="pbot"><button onclick="vib(10)">紧急情况</button><button id="pcancel" onclick="pinCancelOrDel()">${pincode ? "删除" : "取消"}</button></div>`;
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
      openApp("chat", HOME.querySelector('.app[data-app="kakao"] .icon'));
    }, 520);
  }
}
function badgeOf(id) {
  if (id === "phone") return 3 + declined;
  if (id === "mail") return 2;
  if (id === "kakao")
    return Math.min(
      99,
      Object.values(unread).reduce((a, b) => a + b, 0),
    );
  return 0;
}
function appBtn(id) {
  const b = badgeOf(id);
  // 优先从翻译字典找，如果找不到（返回键名），就使用 APPS 里写死的中文名，最后才用 id
  let name = t("app_" + id);
  if (name === "app_" + id) name = APPS[id] || id;

  return `<button class="app" data-app="${id}" onclick="openApp('${id}',this.firstElementChild)"><div class="icon"><div class="ic">${appIcon(id)}</div>${b ? `<span class="bdg">${b}</span>` : ""}</div><span class="lbl">${name}</span></button>`;
}
function renderHome() {
  HOME.innerHTML = `<div class="hgrid">
  <button class="widget wcal" data-app="calendar" onclick="openApp('calendar',this)"><div class="wd">${wdLong(2026, 11, 15)}</div><div class="wn">15</div>${(events[15] || []).map((x) => `<div class="we">${esc(x)}<small>全天</small></div>`).join("")}</button>
  <button class="widget wwx" data-app="weather" onclick="openApp('weather',this)"><div class="c">首尔 ➚</div><div class="tp">18°</div><span style="position:absolute;top:14px;right:14px">${G.sun}</span><div class="ds">大部晴朗<small>最高:21° 最低:12°</small></div></button>
  ${["wechat", "instagram", "photos", "mail", "calendar", "clock", "notes", "weather", "settings", "maps", "weibo", "xianyu", "bilibili", "xhs", "sms", "recorder", "privateAlbum"].map(appBtn).join("")}
 </div>
 <div class="dock">${["wechat", "phone", "safari", "music"].map(appBtn).join("")}</div>`;
}

const PARENT = {
  note: "notes",
  chat: "kakao",
  maild: "mail",
  reel: "instagram",
  screentime: "settings",
  weibo: "weibo",
  xianyu: "xianyu",
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
  old.forEach((o) => {
    o.querySelectorAll("video").forEach((v) => v.pause());
  });
  if (PLAYER.dataset.voice && !(id === "chat")) {
    PLAYER.pause();
  }
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
  if (callState) return;
  if (view !== "home") return;
  if (!VIEWS[id]) {
    console.warn("View not found", id);
    return;
  }
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
  let y0 = null;
  hb.addEventListener("pointerdown", (e) => {
    y0 = e.clientY;
    hb.setPointerCapture(e.pointerId);
  });
  hb.addEventListener("pointerup", (e) => {
    if (y0 === null) return;
    y0 = null;
    hbAction();
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
  const on = !["lock", "pin", "home"].includes(view) && !callState;
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
  return `<div class="nav ${o.solid ? "solid" : ""}">${o.back !== undefined ? `<button class="nb-back" onclick="${o.backFn || "back()"}">${G.chevL}${o.back}</button>` : o.left || "<span></span>"}<div class="nb-title">${o.title || ""}</div><div class="nb-right">${o.right || ""}</div></div>`;
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
    `<div class="scroll"><h1 class="lt">备忘录</h1><div class="srch">${G.search}搜索</div><div class="gh" style="margin-top:8px">📌 置顶</div><div class="group note-l">${notes
      .slice(0, 3)
      .map((n, i) => noteRow(n, i))
      .join(
        "",
      )}</div><div class="gh">备忘录</div><div class="group note-l">${notes
      .slice(3)
      .map((n, i) => noteRow(n, i + 3))
      .join(
        "",
      )}</div></div><div class="toolbar"><span style="width:24px"></span><span style="color:#000;align-self:center;font-size:11px">${notes.length}个备忘录</span>${G.compose}</div>`,
});
VIEWS.note = () => {
  const n = notes[noteId];
  return {
    cls: "notes-pg",
    html:
      navHTML({
        title: "",
        back: "备忘录",
        right: G.share + G.dots,
        solid: false,
      }) +
      `<div class="scroll"><div class="note-v"><div class="nd">${noteDate(n[3], true)}</div><h2>${esc(n[0])}</h2>${esc(n[2])}</div></div><div class="toolbar">${G.check}${G.camera}${G.pen}${G.compose}</div>`,
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
        right: G.list + G.search + G.plus,
      }) +
      `<div class="scroll" style="padding-bottom:120px"><div style="display:flex;justify-content:space-between;align-items:center;margin:0 16px 8px"><h1 class="lt" style="margin:0">${fmtMonth(calMonth)}</h1><span style="display:flex;gap:26px;color:var(--blue)"><button style="width:22px" onclick="calNav(-1)">${G.chevLb}</button><button style="width:22px" onclick="calNav(1)">${G.chevRb}</button></span></div><div class="cal-g cal-w">${wdNarrow()
        .map((w) => `<div>${w}</div>`)
        .join(
          "",
        )}</div><div class="cal-g" id="calg">${c}</div><div style="border-top:.5px solid var(--sep);margin-top:4px;padding-top:4px">${ev}</div></div><div class="tabbar" style="color:#ff3b30">${["今天", "日历", "收件箱"].map((x) => `<button style="color:#ff3b30;font-size:16px;justify-content:center">${x}</button>`).join("")}</div>`,
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

VIEWS.clock = () => ({
  cls: "dark",
  dark: true,
  html: `<div class="nav" style="color:#ff9f0a"><button style="color:#ff9f0a;font-size:17px;justify-self:start;padding-left:8px">编辑</button><div class="nb-title">闹钟</div><div class="nb-right" style="color:#ff9f0a">${G.plus}</div></div><div class="scroll"><h1 class="lt">闹钟</h1><div style="margin:18px 16px 4px;font-size:15px;font-weight:600">其他</div>${Array.from({ length: 3 }, (_, i) => `<div class="alarm"><div><div class="at">08:30</div><div class="al">起床</div></div>${sw(true)}</div>`).join("")}</div>${tabbar(
    [
      ["globe", "世界时钟"],
      ["alarm", "闹钟"],
      ["stopwatch", "秒表"],
      ["timer", "计时器"],
    ],
    1,
  ).replace('class="on"', 'class="on" style="color:#ff9f0a"')}`,
});

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
    html: `<div class="nav"><button style="color:var(--blue);font-size:17px;justify-self:start;padding-left:8px">编辑</button><div class="seg"><button class="${missOnly ? "" : "on"}" onclick="missOnly=false;show('phone')">全部</button><button class="${missOnly ? "on" : ""}" onclick="missOnly=true;show('phone')">未接来电</button></div><span></span></div><div class="scroll"><h1 class="lt">最近通话</h1><div class="srch">${G.search}搜索</div>${all.map((c) => `<div class="prow ${c[2] === "未接来电" ? "miss" : ""}" style="cursor:pointer" onclick="dial('${esc(c[0].replace(/ \(\d+\)$/, ""))}')"><span class="pi">${c[2] === "呼出" ? G.handset : ""}</span><div class="pn"><b>${esc(callNameDisp(c[0]))}</b><small>手机</small></div><span class="pd">${callWhen(c[1])}</span><span class="inf">${G.info}</span></div>`).join("")}</div>${tabbar(
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
function callTop() {
  const sh = !!(CFG.roles && CFG.roles[callName]);
  return `<div class="cav">${sh ? `<div style="font-size:40px">${CFG.roles[callName].initial}</div>` : `<span style="width:100%;height:100%;display:grid;place-items:center;background:linear-gradient(#a5abb6,#7f858f)">${G.sil.replace("<svg", '<svg width="64"')}</span>`}</div><div class="cnm">${esc(dn(callName))}</div>`;
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
      ["speaker", "扬声器"],
      ["videoF", "FaceTime"],
      ["muteF", "静音"],
      ["plusF", "添加通话"],
      ["end", "结束"],
      ["keypadF", "拨号键盘"],
    ];
    const dl = callState === "dialing";
    c.innerHTML =
      callTop() +
      `<div class="csub" id="ctime">${dl ? "正在呼叫…" : "00:00"}</div>${dl ? "" : `<div class="cap" id="cap"><small>实时字幕</small>…</div>`}<div class="cgrid">${B.map(([i, l]) => (i === "end" ? `<button class="cb red" onclick="endCall()"><span class="cc"><span style="display:block;transform:rotate(135deg)">${G.handset}</span></span>${l}</button>` : `<button class="cb" onclick="${i === "videoF" || i === "plusF" ? "" : "this.classList.toggle('on');vib(8)"}"><span class="cc">${G[i]}</span>${l}</button>`)).join("")}</div>`;
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
    curScript = CFG.callScripts?.[callName] || speech;
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
  extraCalls.unshift([
    "穆祉丞",
    "今天 " + new Date().getHours() + ":" + pad(new Date().getMinutes()),
    "未接来电",
  ]);
  closeCallUI();
}
function missCall() {
  if (callState !== "ring") return;
  stopRing();
  callState = "";
  declined++;
  extraCalls.unshift([
    callName,
    "今天 " + new Date().getHours() + ":" + pad(new Date().getMinutes()),
    "未接来电",
  ]);
  closeCallUI();
}
function endCall() {
  if (callState === "dialing") {
    clearInterval(rbIv);
    callState = "";
    extraCalls.unshift([
      callName,
      "今天 " + new Date().getHours() + ":" + pad(new Date().getMinutes()),
      "呼出",
    ]);
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
  c && c.querySelectorAll(".cb").forEach((b) => (b.style.opacity = 0.4));
  extraCalls.unshift([
    callName,
    "今天 " + new Date().getHours() + ":" + pad(new Date().getMinutes()),
    callDir === "out" ? "呼出" : "接收",
  ]);
  if (isEnding) phoneDone = true;
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
    setStatus(viewDark());
    updateIsland();
    if (view === "home") renderHome();
  };
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
      
      // 【核心拦截逻辑】
      if (beat.needStage !== undefined && beat.from) {
        const currentStage = SS.stage[beat.from] || 0;
        // 如果玩家当前进度大于了设定的需求（说明玩家回过了），这条催命短信直接作废！
        if (currentStage > beat.needStage) {
            SS.fired.add(key); 
            return; 
        }
      }

      SS.fired.add(key);
      if (beat.type === "notify") incomingMsgFrom(beat.from, beat.text);
      if (beat.type === "call") incomingCallFrom(beat.from || "穆祉丞");
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
  if (lk) lk.textContent = clock12();
  storyTick(elapsed());
  if (callState === "active") {
    const sec = Math.floor((Date.now() - callStart) / 1000);
    const tm = $("#ctime");
    if (tm) tm.textContent = pad(Math.floor(sec / 60)) + ":" + pad(sec % 60);
    const S = curScript || speech;
    const idx = Math.min(S.length - 1, Math.floor(sec / 3));
    if (idx !== capIdx) {
      capIdx = idx;
      const c = $("#cap");
      if (c) {
        c.innerHTML = `<small>${esc(dn(S[idx][0]))}</small>${esc(S[idx][1])}`;
      }
    }
    if (sec > S.length * 3 + 2) endCall();
  }
}

function fit() {
  const ph = $("#phone");
  const mob = innerWidth <= 540;
  ph.classList.toggle("mob", mob);
  ph.classList.toggle("short", mob && innerHeight < 740);
  if (mob) {
    ph.style.width = innerWidth + "px";
    ph.style.height = innerHeight + "px";
    ph.style.transform = "";
    SC = 1;
  } else {
    ph.style.width = "393px";
    ph.style.height = "852px";
    SC = Math.min((innerHeight - 40) / 852, (innerWidth - 40) / 393, 1.1);
    ph.style.transform = `scale(${SC})`;
  }
}

function initApp() {
  addEventListener("resize", fit);
  fit();

  // ==========================================
  // 🚀 开发者调试模式：跳过锁屏，直接进桌面
  // ==========================================
  view = "home"; // 状态直接设为 home
  LOCK.style.display = "none"; // 隐藏锁屏界面
  renderHome(); // 渲染桌面
  HOME.style.visibility = "visible"; // 让桌面可见
  setStatus(true); // 设置状态栏

  setInterval(tick, 250);
  tick();
}

/*
function initApp() {
  addEventListener("resize", fit);
  fit();
  renderLock();
  renderHome();
  setStatus(true);
  setInterval(tick, 250);
  tick();
}
*/
