"use strict";
const $ = (s) => document.querySelector(s);
const SCREEN = $("#screen"),
  APP = $("#appL"),
  HOME = $("#homeL"),
  LOCK = $("#lockL"),
  OV = $("#ov"),
  PLAYER = $("#player");
let base = 0;
const elapsed = () => (base ? (Date.now() - base) / 1000 : 0);
function startClock() {
  if (base) return;
  const saved = localStorage.getItem(GAME_SAVE_KEY);
  if (saved) {
    try {
      const data = JSON.parse(saved);
      base = Date.now() - (data.elapsed || 0) * 1000;
    } catch (e) { base = Date.now(); }
  } else { base = Date.now(); }
  window.GAME_BASE = base;
}

const IS_DEV_HOST = (() => {
  try {
    if (/[?&]dev=1\b/.test(location.search)) return true;
    if (/[?&]dev=0\b/.test(location.search)) return false;
    return /^(localhost|127\.0\.0\.1|0\.0\.0\.0|::1|\[::1\])$/.test(location.hostname);
  } catch (e) { return false; }
})();
// 本地快速验收使用独立存档，不覆盖玩家进度。
const ENDING_PREVIEW = IS_DEV_HOST && /[?&]endingPreview=1\b/.test(location.search);
// 尾段预览：321跳传送幕（起点仍640秒，保证时间线状态一致），独立存档不影响正式进度。
const TAIL_PREVIEW = !ENDING_PREVIEW && IS_DEV_HOST && /[?&]tailPreview=1\b/.test(location.search);
const TAIL_PREVIEW_START = 640;
const GAME_SAVE_KEY = ENDING_PREVIEW ? "mzc_homecoming_preview" : TAIL_PREVIEW ? "mzc_tail_preview" : "mzc_game_save";
const HOMECOMING_FAULT_SECONDS = ENDING_PREVIEW ? 20 : 660 * 5 / 51;
// 零点前最后10秒：屏幕上方黑底带框纯数字死亡倒计时，最后一个数字是00:00:01，零点直接进传送幕。
const HOMECOMING_COUNTDOWN_SECONDS = 10;

window.preloadAssets = function () { return; };

window.toastDev = function (customMsg) {
  const msgs = [
    "这功能还在“局部宇宙”里没飞过来，请小纸团耐心等候~", "系统正在呼唤你：睡个好觉，功能还没写好，别熬夜等这个按钮了~",
    "我在后台看到你点了，但我不想理你（理直气壮）", "其它按钮点起来，这个功能I don't care",
    "这个功能还没写，别催，正在做数据", "穆祉丞说门留着等你回家，但没说这个假按钮今天能点开",
    "这是九岁的穆瑞恩画的按钮，他还没学会怎么让它动起来", "作者正在为了买馒头的钱努力搬砖写代码，这个按钮还没做好，再等等！",
    "功能开发进度：0.01%，但至少开始了，就像当初认识丞丞一样", "世界那么大，馒头那么小，功能那么新，代码那么旧，这个按钮还没写好呢~",
    "欢迎来到属于我们的局部宇宙~宇宙太大了，功能还在飞尚未抵达（还没做完。）", "程序员正在给你的局部宇宙搭建功能，星星太多，得一颗一颗连",
    "等一下等一下，等等等等等等，哎别这么着急好不好——代码还在写", "穆祉丞说‘怎么办，你们是不是要对我负责啊~’ 所以这个还没做完的功能，你得负责等。",
  ];
  const msg = customMsg || msgs[Math.floor(Math.random() * msgs.length)];
  document.querySelectorAll(".dev-toast-wrap").forEach((e) => e.remove());
  const wrap = document.createElement("div");
  wrap.className = "dev-toast-wrap";
  wrap.style.cssText = "position:absolute; bottom:120px; left:0; right:0; display:flex; justify-content:center; pointer-events:none; z-index:999999;";
  const t = document.createElement("div");
  t.style.cssText = "background:rgba(20,20,20,.9); color:#fff; padding:12px 22px; border-radius:16px; font-size:13.5px; transition:opacity 0.3s, transform 0.3s; box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-weight: 500; -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); border: 1.5px solid rgba(255, 163, 107, 0.7); max-width: 80%; text-align: center; line-height: 1.5; word-break: break-word;";
  t.textContent = msg;
  wrap.appendChild(t);
  document.getElementById("screen").appendChild(wrap);
  t.style.opacity = "1"; t.style.transform = "translateY(0)";
  setTimeout(() => { t.style.opacity = "0"; t.style.transform = "translateY(10px)"; setTimeout(() => wrap.remove(), 300); }, 2500);
};
window.alert = function (msg) {
  if (typeof msg === "string" && (msg.includes("开发") || msg.includes("暂无") || msg.includes("占位") || msg === "")) window.toastDev();
  else window.toastDev(msg);
};
// 传送幕后恩仔生日：玩家自由回复收集（每台设备存本机 localStorage，作者可用 ?dev=1&replies=1 查看本机收集）
// 玩家回复远程上报配置：注册 leancloud.cn → 创建应用（开发版免费）→ 设置/应用凭证里把
// AppID、AppKey、REST API 服务器地址三个值填进下面 → 重新部署即自动上报；留空则只存本机
const REPLY_LC = { appId: "", appKey: "", server: "" };
window.collectPlayerReply = function (text) {
  let time = "";
  try { time = new Date().toLocaleString("zh-CN", { hour12: false }); } catch (e) {}
  try {
    const key = "mzc_player_replies";
    const arr = JSON.parse(localStorage.getItem(key) || "[]");
    arr.push({ time: time || "—", text: String(text).slice(0, 300) });
    while (arr.length > 300) arr.shift();
    localStorage.setItem(key, JSON.stringify(arr));
  } catch (e) {}
  try {
    if (REPLY_LC.appId && REPLY_LC.server && (location.protocol === "http:" || location.protocol === "https:")) {
      fetch(REPLY_LC.server + "/1.1/classes/PlayerReply", {
        method: "POST",
        headers: { "X-LC-Id": REPLY_LC.appId, "X-LC-Key": REPLY_LC.appKey, "content-type": "application/json" },
        body: JSON.stringify({ content: String(text).slice(0, 300), time: time || "—" }),
      }).catch(() => {});
    }
  } catch (e) {}
};
window.getPlayerReplies = function () {
  try { return JSON.parse(localStorage.getItem("mzc_player_replies") || "[]"); } catch (e) { return []; }
};
function mountTailCountdown() {
  if (!SCREEN || document.getElementById("tail-countdown")) return;
  const box = document.createElement("div");
  box.id = "tail-countdown";
  box.style.cssText = "position:absolute; inset:0; z-index:999996; background:#050203; color:#ff1f2e; display:flex; align-items:center; justify-content:center; font-family:'DSEG7 Classic','Cascadia Mono',Consolas,monospace; font-size:130px; font-weight:700; letter-spacing:4px; text-shadow:0 0 14px rgba(255,42,35,.6), 0 0 48px rgba(255,32,20,.32); pointer-events:none;";
  SCREEN.appendChild(box);
  const show = (n) => {
    box.textContent = String(n);
    if (typeof box.animate === "function") {
      box.animate([{ opacity: 0, transform: "scale(1.6)" }, { opacity: 1, transform: "scale(1)" }], { duration: 220, fill: "forwards", easing: "cubic-bezier(.2,.9,.3,1)" });
    }
  };
  show(3);
  setTimeout(() => show(2), 1000);
  setTimeout(() => show(1), 2000);
  setTimeout(() => { box.remove(); beginHomecoming(); }, 3100);
}
function mountReplyViewer() {
  if (!SCREEN || document.getElementById("reply-viewer")) return;
  const box = document.createElement("div");
  box.id = "reply-viewer";
  box.style.cssText = "position:absolute; inset:0; z-index:1000002; background:#141414; color:#eee; overflow-y:auto; padding:16px; font-size:14px; line-height:1.7;";
  const render = () => {
    const E = (v) => (typeof esc === "function" ? esc(v) : String(v));
    const arr = window.getPlayerReplies ? window.getPlayerReplies() : [];
    box.innerHTML =
      '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;"><b style="font-size:16px;">玩家自由回复（本机 ' + arr.length + ' 条）</b><span><button id="rv-clear" style="margin-right:8px; padding:6px 12px; background:#5b2233; color:#f1d6df; border:1px solid #7a4f5e; border-radius:6px; cursor:pointer;">清空</button><button id="rv-close" style="padding:6px 12px; background:#261d25; color:#f1d6df; border:1px solid #705564; border-radius:6px; cursor:pointer;">关闭</button></span></div>' +
      (arr.length
        ? arr.map((r) => '<div style="background:#1f1f22; border-radius:10px; padding:10px 12px; margin-bottom:8px;"><span style="color:#8e8e93; font-size:12px;">' + E(r.time) + '</span><br>' + E(r.text) + '</div>').join("")
        : '<div style="color:#8e8e93;">还没有收集到回复（去恩仔聊天里发一条就会出现在这里）</div>');
    const clearBtn = box.querySelector("#rv-clear");
    const closeBtn = box.querySelector("#rv-close");
    if (clearBtn) clearBtn.onclick = () => { try { localStorage.removeItem("mzc_player_replies"); } catch (e) {} render(); };
    if (closeBtn) closeBtn.onclick = () => box.remove();
  };
  render();
  SCREEN.appendChild(box);
}
document.addEventListener("click", (e) => {
  if (e.target.closest("input, textarea, video, [onclick]")) return;
  const fakeBtn = e.target.closest('button, .row, .wx-item, .wx-tabbar button, .tabbar button, .mrw, .cal-d, [style*="cursor: pointer"], [style*="cursor:pointer"]');
  if (!fakeBtn) return;
  if (fakeBtn.closest("#music-scroll") || fakeBtn.classList.contains("key") || fakeBtn.closest(".kbd") || fakeBtn.closest(".mapwrap") || fakeBtn.closest("#pinL") || fakeBtn.closest(".pkeys") || fakeBtn.classList.contains("pk") || fakeBtn.closest("#privateAlbum") || fakeBtn.closest(".phone-album-picker")) return;
  window.toastDev();
});

const CFG = window.STORY || {};
const SS = window.STORY_STATE || {};
if (!SS.fired) SS.fired = new Set();
if (!SS.fragments) SS.fragments = new Set();
if (!SS.completed) SS.completed = new Set();
if (!SS.missed) SS.missed = new Set();
if (!SS.stage) SS.stage = {};
if (!SS.lineIdx) SS.lineIdx = {};
if (!SS.talked) SS.talked = {}; // 本局通过电话的角色
if (!SS.callDone) SS.callDone = {};

const GAME_START_MIN = 23 * 60 + 9, GAME_END_AT = 660;
let view = "lock", curDark = true, SC = 1, lastRect = null, animTok = 0, firstOpen = true, pendingOpen = null;
let pincode = "", selectedDay = 15, calMonth = 11, chatId = "穆祉丞", mailId = 0;
// 开局前就收到的两条消息，同样算未读
let unread = { cat: 1, 丞丞: 1 };
let callName = "穆祉丞";
// 开局前就已经收到的两条：玩家点亮手机之前，锁屏上已经有消息了
let lockNotes = [
  { title: "🐈‍⬛", from: "cat", body: "死哪去了", app: "wechat", time: "22:58" },
  { title: "丞丞", from: "丞丞", body: "诶你人呢", app: "wechat", time: "22:53" },
  { title: "免打扰建议", body: "穆祉丞一直很吵闹，可以点击开启免打扰", app: "dnd", time: (typeof CFG !== "undefined" && CFG.start && CFG.start.time) || "23:09" },
];
window._dndHintShown = true; 
let nowSong = -1;
window.isDnd = false;

function ampm(minutes) {
  const h = Math.floor(minutes / 60) % 24, m = Math.floor(minutes % 60);
  const ap = h >= 12 ? "下午" : "上午", h12 = pad(h % 12);
  return `${ap} ${h12}:${pad(m)}`;
}
function gameMin() {
  const e = elapsed();
  if (SS.homecoming && SS.homecoming.phase === "exploring") {
    return 24 * 60 + Math.floor(Math.max(0, e - SS.homecoming.continuedAt) / 60);
  }
  if (ENDING_PREVIEW && !SS.homecoming) {
    return GAME_START_MIN + 46 + Math.floor(Math.max(0, e - (GAME_END_AT - HOMECOMING_FAULT_SECONDS)) * 5 / HOMECOMING_FAULT_SECONDS);
  }
  if (e <= GAME_END_AT) return GAME_START_MIN + Math.floor((e / GAME_END_AT) * 51);
  return GAME_START_MIN + 51;
}
function clock12(showAmpm = true) {
  const m = gameMin(), h = Math.floor(m / 60) % 24, min = Math.floor(m % 60);
  const ampmStr = h >= 12 ? "下午" : "上午", h12 = pad(h % 12);
  return showAmpm ? `${ampmStr}${h12}:${pad(min)}` : `${h12}:${pad(min)}`;
}
function gameTime24() {
  const m = gameMin(), h = Math.floor(m / 60) % 24;
  return pad(h) + ":" + pad(Math.floor(m % 60));
}
const nowAmpm = () => clock12();
function relRect(el) {
  const s = SCREEN.getBoundingClientRect(), r = el.getBoundingClientRect();
  return { x: (r.left - s.left) / SC, y: (r.top - s.top) / SC, w: r.width / SC, h: r.height / SC };
}
const vib = (p) => { try { navigator.vibrate && navigator.vibrate(p); } catch (e) {} };
const T = { duration: 460, easing: "cubic-bezier(.32,.72,0,1)" };
function devRadius() { return document.getElementById("phone").classList.contains("mob") ? 0 : 56; }

const APPS = { maps: "地图", instagram: "Instagram", photos: "照片", mail: "邮件", calendar: "日历", clock: "时钟", notes: "备忘录", weather: "天气", settings: "设置", phone: "电话", safari: "Safari", wechat: "微信", music: "音乐", weibo: "微博", xianyu: "闲鱼", bilibili: "B站", xhs: "小红书", sms: "短信", recorder: "录音", privateAlbum: "私密相册" };

function setStatus(dark) {
  curDark = !!dark;
  $("#sb").classList.toggle("light", curDark);
  $("#hb").classList.toggle("light", curDark);
}
function updateIsland() {
  typeof updateCrumb === "function" && updateCrumb();
  const on = nowSong >= 0 && !PLAYER.paused && !["music", "lock", "pin"].includes(view) && !OV.querySelector(".np,.call,.viewer");
  const il = $("#island"); if (il) il.classList.toggle("act", on);
}
function roleOfName(name) {
  const roles = CFG.roles || {}; if (!name) return null;
  if (roles[name]) return roles[name];
  for (const k in roles) { if (typeof DISPLAY !== "undefined" && DISPLAY[k] === name) return roles[k]; }
  return null;
}
function ncardHTML(n) {
  let av = "";
  if (n.app === "dnd") av = `<div class="ni"><div class="app-icon-fallback" style="background:#af52de;font-size:18px">🌙</div></div>`;
  else {
    const r = roleOfName(n.from) || roleOfName(n.title);
    if (r) {
      if (r.avatar) av = `<div class="ni"><img src="${r.avatar}" style="width:100%;height:100%;object-fit:cover;border-radius:9px" /></div>`;
      else av = `<div class="ni"><div class="app-icon-fallback" style="background:${r.color};font-size:18px">${r.initial}</div></div>`;
    } else av = `<div class="ni">${appIcon("wechat")}</div>`;
  }
  return `${av}<div class="nt"><div class="nh"><span>${esc(n.title)}</span><small>${n.time}</small></div><div class="nb">${esc(n.body)}</div></div>`;
}

function renderLock() {
  const MAX = 4;
  const shown = lockNotes.slice(0, MAX);
  const rest = lockNotes.length - shown.length;
  $("#lkc").innerHTML =
    `<div class="lk-date">${isAfterZero() ? "11月16日 星期一" : (CFG.start?.date || "11月15日") + " " + (CFG.start?.weekday || "星期日")}</div>
     <div class="lk-time" id="lkt">${clock12()}</div>
     <div class="lk-notes">${shown.map((n, i) => `<button class="ncard" onclick="lockNoteTap(${i},event)">${ncardHTML(n)}</button>`).join("")}${rest > 0 ? `<div class="lk-more">还有 ${rest} 条更早的通知</div>` : ""}</div>
     <div class="lk-actions" style="display:flex; gap:12px; justify-content:center; align-items:center;">
       <button class="lk-dnd ${window.isDnd ? "on" : ""}" onclick="toggleDnd(event)">
         <span style="filter:${window.isDnd ? "none" : "grayscale(100%)"};margin-right:4px;">🌙</span>${window.isDnd ? "免打扰已开启" : "开启免打扰"}
       </button>
       <button class="lk-dnd" onclick="window.resetGameState()">
         <span style="margin-right:6px; display:flex; align-items:center; justify-content:center; width:16px; height:16px;">${G.sysReset}</span>重置进度
       </button>
     </div>
     <div class="lk-hint">向上轻扫以打开</div>`;
}
function syncDndUI() {
  const on = !!window.isDnd;
  const lockBtn = document.querySelector(".lk-dnd");
  if (lockBtn) {
    lockBtn.classList.toggle("on", on);
    lockBtn.innerHTML = `<span style="filter:${on ? "none" : "grayscale(100%)"};margin-right:4px;">🌙</span>${on ? "免打扰已开启" : "开启免打扰"}`;
  }
  const ccBtn = document.getElementById("cc-dnd"); if (ccBtn) ccBtn.classList.toggle("on", on);
  
 
    const homeBtn = document.getElementById("home-dnd");
  if (homeBtn) {
    const iconWrap = homeBtn.querySelector(".icon");
    // 👇 只切背景色，月亮保持彩色
    if (iconWrap) iconWrap.style.background = on ? "#5e5ce6" : "#8e8e93";
  }
  
  const ccTxt = document.querySelector(".cc-dnd-s"); if (ccTxt) ccTxt.textContent = on ? "已开启，锁屏不再弹消息" : "开启后锁屏不再弹消息";
  updateDndBadge();
}
function toggleDnd(e) {
  if (e) e.stopPropagation();
  
  // 👇 删除了所有防抖锁，按下即触发！
  window.isDnd = !window.isDnd;
  vib(10);
  if (view === "lock") renderLock();
  syncDndUI();
  
  document.querySelectorAll(".dnd-global-toast").forEach(el => el.remove());
  const toast = document.createElement("div");
  toast.className = "dnd-global-toast";
  toast.style.cssText = "position:absolute; top:240px; left:50%; transform:translate(-50%, 0); background:rgba(30,30,30,0.85); color:#fff; padding:12px 24px; border-radius:24px; font-size:14px; font-weight:500; z-index:99999999; pointer-events:none; display:flex; align-items:center; gap:8px; box-shadow:0 4px 12px rgba(0,0,0,0.15); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px); opacity:0;";
  toast.innerHTML = `<span style="font-size:16px;">${window.isDnd ? "🌙" : "☀️"}</span>${window.isDnd ? "已开启免打扰" : "已关闭免打扰"}`;
  document.getElementById("screen").appendChild(toast);
  toast.animate([{ opacity: 0, transform: "translate(-50%, -10px) scale(0.95)" }, { opacity: 1, transform: "translate(-50%, 0) scale(1)" }], { duration: 300, fill: "forwards", easing: "cubic-bezier(0.2, 0.9, 0.25, 1)" });
  setTimeout(() => { toast.animate([{ opacity: 1, transform: "translate(-50%, 0) scale(1)" }, { opacity: 0, transform: "translate(-50%, -10px) scale(0.95)" }], { duration: 300, fill: "forwards" }).onfinish = () => toast.remove(); }, 1800);
}
function updateDndBadge() {
  let badge = document.getElementById("dnd-badge");
  if (!badge) { badge = document.createElement("div"); badge.id = "dnd-badge"; badge.className = "dnd-badge"; badge.innerHTML = "🌙"; document.getElementById("screen").appendChild(badge); }
  badge.style.display = window.isDnd ? "flex" : "none";
}
window.openCC = function () {
  if (view !== "home" || (typeof callState !== "undefined" && callState)) return;
  const cc = document.getElementById("cc"); if (!cc) return;
  cc.classList.add("open"); vib(8); syncDndUI();
};
window.closeCC = function () {
  const cc = document.getElementById("cc"); if (cc) cc.classList.remove("open");
};
(function ccGesture() {
  let y0 = null;
  SCREEN.addEventListener("pointerdown", (e) => {
    if (view !== "home" || (typeof callState !== "undefined" && callState) || e.target.closest("#cc")) return;
    const r = SCREEN.getBoundingClientRect(); const y = (e.clientY - r.top) / SC; if (y > 90) return; y0 = e.clientY;
  });
  SCREEN.addEventListener("pointerup", (e) => {
    if (y0 === null) return; const dy = (e.clientY - y0) / SC; y0 = null; if (dy > 55) openCC();
  });
  SCREEN.addEventListener("pointercancel", () => { y0 = null; });
})();
function lockNoteTap(i, e) {
  e.stopPropagation(); const n = lockNotes[i] || {};
  if (n.app === "dnd") return toggleDnd(e);
  pendingOpen = n.from || "穆祉丞"; goPin();
}
(function lockDrag() {
  const el = $("#lkc"); let y0 = null, dy = 0, moved = false;
  el.addEventListener("pointerdown", (e) => { if (view !== "lock" || e.target.closest("button")) return; y0 = e.clientY; dy = 0; moved = false; el.setPointerCapture(e.pointerId); });
  el.addEventListener("pointermove", (e) => {
    if (y0 === null) return; dy = Math.min(0, (e.clientY - y0) / SC); if (Math.abs(dy) > 6) moved = true;
    el.style.transform = `translateY(${dy}px)`; el.style.opacity = 1 + dy / 500;
    $("#wall").style.filter = `blur(${Math.min(24, -dy / 8)}px) brightness(${1 - Math.min(0.38, -dy / 700)})`;
  });
  el.addEventListener("pointerup", (e) => {
    if (y0 === null) return; const d = dy; y0 = null; $("#wall").style.filter = "";
    if (d < -70 || (!moved && !e.target.closest("button"))) goPin(d);
    else { el.animate([{ transform: `translateY(${d}px)`, opacity: 1 + d / 500 }, { transform: "none", opacity: 1 }], { duration: 350, easing: "cubic-bezier(.2,1.3,.4,1)" }); el.style.transform = ""; el.style.opacity = ""; }
  });
})();

function goPin(fromDy = 0) {
  view = "pin"; pincode = ""; const lk = $("#lkc");
  lk.animate([{ transform: `translateY(${fromDy}px)`, opacity: Math.max(0, 1 + fromDy / 500) }, { transform: "translateY(-120px)", opacity: 0 }], { duration: 380, easing: "cubic-bezier(.3,.7,.2,1)", fill: "forwards" });
  lk.style.transform = ""; lk.style.opacity = ""; lk.style.pointerEvents = "none"; $("#wall").classList.add("dim"); renderPin();
  const p = $("#pinL"); p.style.display = "flex"; p.animate([{ opacity: 0, transform: "translateY(40px)" }, { opacity: 1, transform: "none" }], { duration: 420, easing: "cubic-bezier(.2,.9,.25,1)" });
  updateDndBadge();
}
const PL = ["", "ABC", "DEF", "GHI", "JKL", "MNO", "PQRS", "TUV", "WXYZ"];
function renderPin() {
  $("#pinL").innerHTML = `<div class="pt">输入密码</div><div class="pdots" id="pdots">${[0, 1, 2, 3].map((i) => `<i class="${i < pincode.length ? "on" : ""}"></i>`).join("")}</div><div class="pkeys">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<button class="pk" onpointerdown="pinPress('${n}',this)"><b>${n}</b><small>${PL[n - 1]}</small></button>`).join("")}<span></span><button class="pk" onpointerdown="pinPress('0',this)"><b>0</b><small></small></button><span></span></div><div class="pbot"><button onclick="vib(10)">紧急情况</button><button id="pcancel" onclick="pinCancelOrDel()">${pincode ? "删除" : "取消"}</button></div>`;
}
function pinDots() { $("#pdots").innerHTML = [0, 1, 2, 3].map((i) => `<i class="${i < pincode.length ? "on" : ""}"></i>`).join(""); $("#pcancel").textContent = pincode ? "删除" : "取消"; }
function pinPress(n, el) {
  if (pincode.length >= 4) return; el.classList.add("dn"); setTimeout(() => el.classList.remove("dn"), 90); sfx("key"); vib(8); pincode += n; pinDots();
  if (pincode.length === 4) {
    if (pincode === (CFG.start?.pin || "1116")) setTimeout(unlock, 140);
    else { setTimeout(() => { const d = $("#pdots"); d.classList.remove("shake"); void d.offsetWidth; d.classList.add("shake"); vib([60, 40, 60]); setTimeout(() => { pincode = ""; pinDots(); }, 420); }, 120); }
  }
}
function pinCancelOrDel() { if (pincode) { pincode = pincode.slice(0, -1); pinDots(); return; } pinCancel(); }
function pinCancel() {
  view = "lock"; const p = $("#pinL");
  p.animate([{ opacity: 1 }, { opacity: 0, transform: "translateY(30px)" }], { duration: 300 }).onfinish = () => (p.style.display = "none");
  const lk = $("#lkc"); lk.getAnimations().forEach((a) => a.cancel()); lk.style.pointerEvents = "";
  lk.animate([{ transform: "translateY(-120px)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 450, easing: "cubic-bezier(.2,.9,.25,1)" });
  $("#wall").classList.remove("dim"); updateDndBadge();
}
function unlock() {
  sfx("unlock"); if (typeof window.tryStartBGM === "function") window.tryStartBGM(); view = "home"; $("#wall").classList.remove("dim");
  LOCK.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: "forwards" }).onfinish = () => {
    LOCK.style.visibility = "hidden"; $("#pinL").style.display = "none";
    $("#lkc").getAnimations().forEach((a) => a.cancel()); $("#lkc").style.pointerEvents = "";
  };
  renderHome(); HOME.style.visibility = "visible";
  HOME.animate([{ transform: "scale(1.18)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 560, easing: "cubic-bezier(.2,.9,.22,1)" });
  [...HOME.querySelectorAll(".app,.widget")].forEach((el, i) => el.animate([{ transform: "scale(.7)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 520, delay: 30 + i * 14, easing: "cubic-bezier(.2,1.1,.3,1)", fill: "backwards" }));
  setStatus(true);
  if (pendingOpen) { const target = pendingOpen; pendingOpen = null; setTimeout(() => { chatId = target; openApp("chat", HOME.querySelector('.app[data-app="wechat"] .icon')); }, 520); }
  syncDndUI();
}

function badgeOf(id) {
  if (id === "phone") { try { return 3 + declined; } catch (e) { return 3; } }
  if (id === "mail") { if (typeof emailData !== "undefined") { const n = emailData.filter((m) => m.unread).length; return n > 0 ? Math.min(99, n) : 0; } return 0; }
  if (id === "wechat") { let totalUnread = Object.values(unread).reduce((a, b) => a + b, 0); return totalUnread > 0 ? Math.min(99, totalUnread) : 0; }
  if (id === "sms") { if (typeof smsData !== "undefined") { const n = smsData.filter((m) => m.unread).length; return n > 0 ? Math.min(99, n) : 0; } return 0; }
  return 0;
}
function appBtn(id) {
  const b = badgeOf(id); let name = APPS[id] || id;
  return `<button class="app" data-app="${id}" onclick="openApp('${id}',this.firstElementChild)"><div class="icon"><div class="ic">${appIcon(id)}</div>${b ? `<span class="bdg">${b}</span>` : ""}</div><span class="lbl">${name}</span></button>`;
}
function updateHomeBadges() {
  if (!HOME) return;
  HOME.querySelectorAll(".app[data-app]").forEach(app => {
    const icon = app.querySelector(".icon");
    if (!icon) return;
    const count = badgeOf(app.dataset.app);
    let badge = icon.querySelector(".bdg");
    if (!count) { if (badge) badge.remove(); return; }
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "bdg";
      icon.appendChild(badge);
    }
    badge.textContent = String(count);
  });
}

const PARENT = { note: "notes", chat: "wechat", moments: "wx_discover", wx_profile: "chat", wx_moments_user: "wx_profile", wx_moments_detail: "wx_moments_user", wx_search: "wechat", wx_scan: "wx_me", wx_chat_info: "chat", wx_moment_compose: "moments", wx_moments_self: "wx_me", wx_contacts_sub: "wx_contacts", wx_services: "wx_me", wx_favorites: "wx_me", wx_settings: "wx_me", settings_about: "settings", settings_display: "settings", settings_wallpaper: "settings", settings_notifications: "settings", note_edit: "notes", mail_compose: "mail", maild: "mail", reel: "instagram", screentime: "settings", sms_detail: "sms", weibo: "weibo", weibo_profile: "weibo", weibo_my_posts: "weibo_profile", weibo_artist: "weibo", weibo_supertopic: "weibo_artist", weibo_follow: "weibo_profile", mail_detail: "mail", xianyu: "xianyu", xianyu_me: "xianyu", xianyu_orders: "xianyu_me", bilibili: "bilibili", xhs: "xhs", sms: "sms", recorder: "recorder", privateAlbum: "photos", albumDetail: "photos" };
const rootOf = (v) => {
  const seen = new Set();
  let root = v;
  while (PARENT[root] && PARENT[root] !== root && !seen.has(PARENT[root])) {
    seen.add(root);
    root = PARENT[root];
  }
  return ["wx_contacts", "wx_discover", "wx_me"].includes(root) ? "wechat" : root;
};
function viewDark() { if (["lock", "pin", "home"].includes(view)) return true; const p = APP.lastElementChild; return !!(p && p.dataset.dark); }
function wireScroll(pg) { const sc = pg.querySelector(".scroll"); if (sc) sc.addEventListener("scroll", () => pg.classList.toggle("scrolled", sc.scrollTop > 38), { passive: true }); }
const VIEWS = {};

function show(id, anim = "swap") {
  const old = [...APP.children];
  old.forEach((o) => o.querySelectorAll("video").forEach((v) => v.pause()));
  if (view === "recorder" && id !== "recorder" && PLAYER.dataset.isRecorder) PLAYER.pause();
  if (PLAYER.dataset.voice && !(id === "chat")) PLAYER.pause();
  view = id;
  const v = VIEWS[id] && VIEWS[id]();
  if (!v) return;
  
  const pg = document.createElement("div");
  pg.className = "pg " + (v.cls || ""); pg.innerHTML = v.html; pg.dataset.view = id; pg.dataset.dark = v.dark ? "1" : "";

  const ROOT_VIEWS = ["home", "lock", "pin", "wechat", "wx_contacts", "wx_discover", "wx_me", "phone", "sms", "weather", "recorder", "calendar", "clock", "notes", "safari", "music", "maps", "photos", "settings", "mail", "weibo", "weibo_profile", "xianyu", "xianyu_me", "bilibili", "xhs", "instagram"];
  if (ROOT_VIEWS.includes(id)) {
    pg.querySelectorAll('.nb-back, .bk').forEach(el => { el.style.visibility = 'hidden'; el.style.pointerEvents = 'none'; });
  } else {
    const hasStandardNav = pg.querySelector('.nav') || pg.querySelector('.wx-chat-h');
    const hasManualBack = pg.innerHTML.includes('onclick="back()"') || pg.innerHTML.includes('onclick="closeApp()"') || pg.innerHTML.includes('onclick="backSuperTopic()"');
    if (!hasStandardNav && !hasManualBack) {
      const isDark = !!v.dark || pg.classList.contains('dark');
      const autoBack = document.createElement("div");
      autoBack.className = "auto-global-back";
      autoBack.style.cssText = `position: absolute; top: 45px; left: 10px; z-index: 999; display: flex; align-items: center; justify-content: center; cursor: pointer; padding: 8px;`;
      autoBack.innerHTML = `<button onclick="back()" style="display: flex; align-items: center; justify-content: center; color: ${isDark ? '#fff' : '#111'}; border: none; background: none; padding: 0; cursor: pointer;">${G.chevL.replace('<svg', '<svg width="22" height="22" stroke="currentColor" stroke-width="2.2"')}</button>`;
      pg.appendChild(autoBack);
    }
  }

  if (anim === "pop") APP.insertBefore(pg, APP.firstChild); else APP.appendChild(pg);
  setStatus(v.dark); wireScroll(pg);
  const done = () => old.forEach((o) => o.remove());
  if (anim === "push") {
    pg.classList.add("pushed"); pg.animate([{ transform: "translateX(100%)" }, { transform: "none" }], T);
    old.forEach((o) => o.animate([{ transform: "none", filter: "brightness(1)" }, { transform: "translateX(-28%)", filter: "brightness(.92)" }], T)); setTimeout(done, T.duration);
  } else if (anim === "pop") {
    pg.animate([{ transform: "translateX(-28%)", filter: "brightness(.92)" }, { transform: "none", filter: "brightness(1)" }], T);
    old.forEach((o) => { o.classList.add("pushed"); o.animate([{ transform: "none" }, { transform: "translateX(100%)" }], { ...T, fill: "forwards" }); }); setTimeout(done, T.duration);
  } else done();
  
  v.init && v.init(pg); updateIsland(); updateDndBadge();

  let pageUrls = [];
  try {
    if (id === "chat" && window.CHAT_HISTORY && typeof chatId !== 'undefined') {
      const msgs = window.CHAT_HISTORY[chatId];
      if (Array.isArray(msgs)) {
        msgs.forEach(msg => {
          if (Array.isArray(msg) && typeof msg[0] === 'string') {
            const text = msg[0];
            if (text.startsWith('[图片] ') || text.startsWith('[表情] ')) pageUrls.push(text.slice(4).trim());
            else if (text.startsWith('[视频] ')) pageUrls.push(text.slice(4).split('|')[0].trim());
          }
        });
      }
    } else if (id === "moments" || id === "wx_moments" || id === "wx_discover") {
      if (typeof MOCK_MOMENTS_DATA !== "undefined" && MOCK_MOMENTS_DATA) {
        Object.values(MOCK_MOMENTS_DATA).forEach(role => {
          if (role.posts) role.posts.forEach(post => { if (post.images) post.images.forEach(src => pageUrls.push(src)); });
        });
      }
    } else if (id === "photos") {
      const media = typeof getPhoneDisplayList === "function" ? getPhoneDisplayList() : typeof MOCK_PHOTOS !== "undefined" ? MOCK_PHOTOS : [];
      if (Array.isArray(media)) media.forEach(i => { if (i.src) pageUrls.push(i.src); });
    } else if (id === "privateAlbum") {
      // 只收集当前已渲染的媒体；密码页不会提前拉取私密照片。
      pg.querySelectorAll("img[src], video[poster]").forEach(el => {
        const src = el.getAttribute("poster") || el.getAttribute("src");
        if (src) pageUrls.push(src);
      });
    }
  } catch (e) { console.warn(e); }

  if (pageUrls.length > 0 && typeof window.priorityPreload === 'function') {
    window.priorityPreload(pageUrls);
  }

  return pg;
}

function zoomFrames(r) {
  const W = SCREEN.clientWidth, H = SCREEN.clientHeight, s = r.w / W, iy = Math.max(0, (H - r.h / s) / 2), dx = r.x + r.w / 2 - W / 2, dy = r.y + r.h / 2 - H / 2;
  return [{ transform: `translate(${dx}px,${dy}px) scale(${s})`, clipPath: `inset(${iy}px 0px round ${15 / s}px)`, opacity: 0.25 }, { transform: "translate(0px,0px) scale(1)", clipPath: `inset(0px 0px round ${devRadius()}px)`, opacity: 1 }];
}
function openApp(id, el) {
  if ((typeof callState !== "undefined" && callState) || view !== "home" || !VIEWS[id]) return;
  if (id === "weibo") id = "weibo_my_posts";
  lastRect = el ? relRect(el) : null; APP.innerHTML = "";
  try { show(id, "none"); } catch (e) { console.error(e); view = "home"; return; }
  const tok = ++animTok; APP.style.visibility = "visible"; APP.getAnimations().forEach((a) => a.cancel());
  APP.animate(zoomFrames(lastRect || { x: 166, y: 396, w: 60, h: 60 }), { duration: 540, easing: "cubic-bezier(.2,.9,.22,1)" });
  HOME.animate([{ transform: "none", opacity: 1 }, { transform: "scale(1.1)", opacity: 0 }], { duration: 400, easing: "ease-in" }).onfinish = () => { if (tok === animTok && view !== "home") HOME.style.visibility = "hidden"; };
  if (firstOpen) { firstOpen = false; setTimeout(() => { $("#hb").classList.add("pulse"); setTimeout(() => $("#hb").classList.remove("pulse"), 3400); }, 900); }
}
function closeApp() {
  if ((typeof callState !== "undefined" && callState) || ["home", "lock", "pin"].includes(view)) return;
  if (view === "recorder" && PLAYER.dataset.isRecorder) PLAYER.pause();
  const root = rootOf(view); if (PLAYER.dataset.voice) PLAYER.pause();
  view = "home"; renderHome(); HOME.style.visibility = "visible"; setStatus(true);
  const icon = HOME.querySelector(`.app[data-app="${root}"] .icon`); const r = icon ? relRect(icon) : { x: 166, y: 396, w: 60, h: 60 };
  const tok = ++animTok; APP.getAnimations().forEach((a) => a.cancel());
  const a = APP.animate(zoomFrames(r).reverse(), { duration: 460, easing: "cubic-bezier(.3,.75,.2,1)", fill: "forwards" });
  a.onfinish = () => { if (tok !== animTok) return; APP.style.visibility = "hidden"; APP.querySelectorAll("video").forEach((v) => v.pause()); APP.innerHTML = ""; a.cancel(); };
  HOME.animate([{ transform: "scale(1.1)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 460, easing: "cubic-bezier(.2,.9,.22,1)" });
  updateIsland();
}
function push(id) { show(id, "push"); }
function back() {
  if (view === "wx_search") { const from = window._wxSearchFrom || "wechat"; window._wxSearchScope = ""; return show(from, "pop"); }
  if (view === "wx_scan") { const from = window._wxScanFrom || "wx_me"; return show(from, "pop"); }
  if (view === "chat" && window._chatBackTo) { const from = window._chatBackTo; window._chatBackTo = null; return show(from, "pop"); }
  if (view === "wx_moments_detail") { const from = window._momentDetailFrom || "moments"; window._momentDetailFrom = "moments"; return show(from, "pop"); }
  if (view === "wx_moments_user") { const from = window._momentsUserFrom || "wx_profile"; window._momentsUserFrom = "wx_profile"; return show(from, "pop"); }
  if (view === "wx_profile") { const from = window._profileFrom || "chat"; window._profileFrom = "chat"; return show(from, "pop"); }
  if (view === "wx_moment_compose") { const from = window._wxComposeFrom || "moments"; return show(from, "pop"); }
  if (PARENT[view]) show(PARENT[view], "pop"); else closeApp();
}

function hbAction() {
  if (typeof callState !== "undefined" && callState) return;
  const vw = OV.querySelector(".viewer"); if (vw) return closeViewer();
  if (OV.querySelector(".np")) return closeNP();
  if (view === "lock") return goPin(); if (view === "pin") return;
  if (view === "home") return HOME.animate([{ transform: "none" }, { transform: "scale(.97)" }, { transform: "none" }], 250);
  closeApp();
}
(function hbGesture() {
  const hb = $("#hb"); const bar = hb.querySelector("i"); let y0 = null;
  bar.addEventListener("pointerdown", (e) => { y0 = e.clientY; bar.setPointerCapture(e.pointerId); });
  bar.addEventListener("pointerup", (e) => { if (y0 === null) return; const dy = e.clientY - y0; y0 = null; if (dy < -20) hbAction(); });
})();
(function edgeBack() {
  let x0 = null, y0 = 0, pg = null, isDragging = false, startTime = 0;
  SCREEN.addEventListener("pointerdown", (e) => {
    const r = SCREEN.getBoundingClientRect(); const x = (e.clientX - r.left) / SC; if (!PARENT[view] || x > 25) return;
    x0 = e.clientX; y0 = e.clientY; pg = APP.lastElementChild; isDragging = true; startTime = Date.now(); if (pg) pg.style.transition = "none";
  });
  SCREEN.addEventListener("pointermove", (e) => {
    if (!isDragging || x0 === null) return; const dx = Math.max(0, (e.clientX - x0) / SC); const dampedDx = dx > 100 ? 100 + (dx - 100) * 0.3 : dx; if (pg) pg.style.transform = `translateX(${dampedDx}px)`;
  });
  SCREEN.addEventListener("pointerup", (e) => {
    if (!isDragging || x0 === null) return; isDragging = false; const dx = (e.clientX - x0) / SC; const timeTaken = Date.now() - startTime; const velocity = dx / timeTaken; x0 = null;
    if (pg) { pg.style.transition = "transform 0.3s cubic-bezier(0.2, 0.9, 0.25, 1)"; pg.style.transform = ""; }
    if (dx > 90 || velocity > 0.5) { back(); }
  });
})();
function goBack() {
  if (typeof callState !== "undefined" && callState) return;
  if (OV.querySelector(".viewer")) return closeViewer(); if (OV.querySelector(".np")) return closeNP();
  if (["lock", "pin", "home"].includes(view)) { if (view === "pin") pinCancel(); return; }
  back();
}
function updateCrumb() { const on = !["lock", "pin", "home"].includes(view) && !(typeof callState !== "undefined" && callState); $("#sb").classList.toggle("crumb", on); }
$("#sbk").innerHTML = `<svg viewBox="0 0 7 12"><path d="M6 1 1 6l5 5"/></svg>主页`;
$("#sbk").addEventListener("click", (e) => {
  e.stopPropagation(); if (typeof callState !== "undefined" && callState) return;
  if (OV.querySelector(".viewer")) closeViewer(); if (OV.querySelector(".np")) closeNP(); closeApp();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") hbAction(); else if (e.key === "Backspace" && !e.target.closest("input,textarea")) { e.preventDefault(); goBack(); }
});
document.addEventListener("mouseup", (e) => { if (e.button === 3) { e.preventDefault(); goBack(); } });
let lastPopTime = 0;
try {
  history.pushState({ wb: 1 }, "");
  window.addEventListener("popstate", (e) => {
    if (view === "home" && !OV.querySelector(".viewer") && !OV.querySelector(".np") && !(typeof callState !== "undefined" && callState)) {
      const now = Date.now(); if (now - lastPopTime < 2000) { history.back(); } else { lastPopTime = now; toastDev("再滑一次退出网页"); history.pushState({ wb: 1 }, ""); }
    } else { goBack(); history.pushState({ wb: 1 }, ""); }
  });
} catch (e) {}

function incomingMailFrom(beat) {
  if (typeof emailData === "undefined") return;
  const newId = emailData.reduce((max, m) => Math.max(max, m.id), -1) + 1;
  emailData.unshift({ id: newId, sender: beat.from || "TFEntertainment", initial: beat.initial || "T", from: beat.fromEmail || "no-reply@tfent.cn", subject: beat.subject || "新邮件", preview: beat.preview || "点击查看邮件详情", time: "刚刚", unread: true, body: beat.body || "" });
  if (view === "mail") { const pg = APP.lastElementChild; if (pg) pg.innerHTML = VIEWS.mail().html; }
  if (view === "home") updateHomeBadges();
  if (window.isDnd || window._mailNotifyOn === false) return;
  sfx("msg"); vib([30, 60, 30]);
  OV.querySelectorAll(".banner:not(.story-choice)").forEach((b) => b.remove());
  const b = document.createElement("div");
  b.className = "banner"; b.style.cursor = "pointer";
  b.innerHTML = `<div class="ncard"><div class="ni"><div class="app-icon-fallback" style="background:#3fb0ff;font-size:18px">${esc(beat.initial || "T")}</div></div><div class="nt"><div class="nh"><span>${esc(beat.from || "TFEntertainment")}</span><small>刚刚</small></div><div class="nb">${esc(beat.subject || "新邮件")}</div></div></div>`;
  OV.appendChild(b);
  b.animate([{ transform: "translateY(-140%) scale(.96)" }, { transform: "none" }], { duration: 620, easing: "cubic-bezier(.2,1.25,.35,1)" });
  let tm = setTimeout(() => { b.animate([{ transform: "none", opacity: 1 }, { transform: "translateY(-140%) scale(.9)", opacity: 0 }], { duration: 300, fill: "forwards" }).onfinish = () => b.remove(); }, 5000);
  b.onclick = () => { clearTimeout(tm); b.remove(); if (view === "home") openApp("mail", HOME.querySelector('.app[data-app="mail"] .icon')); else if (view === "mail") openMailDetail(newId); else if (view === "mail_detail") { currentMailId = newId; show("mail_detail", "push"); } };
}
function showStoryChoice() {}
function showEnding() { beginHomecoming(); }

// Six short visual-only faults from game time 23:55; no page freezes or input interception.
let homecomingFaultTimer = null;
function updateHomecoming(e) {
  if (SS.homecoming) {
    clearHomecomingCountdown();
    clearHomecomingFault();
    if (SS.homecoming.phase === "transferred") renderHomecoming();
    if (SS.homecoming.phase === "exploring") deliverHomecomingTimeline();
    return;
  }
  if (e >= GAME_END_AT) { beginHomecoming(); return; }
  updateHomecomingCountdown(e);
  const start = GAME_END_AT - HOMECOMING_FAULT_SECONDS;
  if (e < start || !SCREEN) return;
  const seen = window._homecomingFaultSeen || (window._homecomingFaultSeen = new Set());
  [0, .18, .38, .57, .76, .94].forEach((fraction, index) => {
    const due = start + fraction * HOMECOMING_FAULT_SECONDS;
    if (e < due || seen.has(index)) return;
    seen.add(index);
    // Resuming a background tab must not replay a burst of missed faults.
    if (e - due > 1.5) return;
    playHomecomingFault(index);
  });
}
function playHomecomingFault(index) {
  if (!SCREEN || (SS.homecoming && SS.homecoming.phase)) return;
  if (typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  clearTimeout(homecomingFaultTimer);
  const previous = document.getElementById("homecoming-fault");
  if (previous) previous.remove();
  const effect = document.createElement("div");
  effect.id = "homecoming-fault";
  effect.className = "fault-variant-" + (index % 3);
  effect.setAttribute("aria-hidden", "true");
  effect.innerHTML = '<div class="fault-ink"></div><div class="fault-scan"></div><div class="fault-tear"></div>';
  SCREEN.appendChild(effect);
  homecomingFaultTimer = setTimeout(() => { effect.remove(); homecomingFaultTimer = null; }, 420);
}
function clearHomecomingFault() {
  clearTimeout(homecomingFaultTimer);
  homecomingFaultTimer = null;
  if (SCREEN) SCREEN.classList.remove("homecoming-failing");
  const fault = document.getElementById("homecoming-fault");
  if (fault) fault.remove();
}
// 零点前最后10秒：上半屏只显示数字的死亡倒计时，按 elapsed 实时重算，刷新可自然恢复。
let homecomingCountdownRemain = null;
function updateHomecomingCountdown(e) {
  const raw = Math.ceil(GAME_END_AT - e);
  if (raw > HOMECOMING_COUNTDOWN_SECONDS) { clearHomecomingCountdown(); return; }
  // 零点即跳传送幕，永远不显示00:00:00。
  const remain = Math.max(1, raw);
  if (remain === homecomingCountdownRemain) return;
  homecomingCountdownRemain = remain;
  if (!SCREEN) return;
  let layer = document.getElementById("homecoming-countdown");
  if (!layer) {
    layer = document.createElement("div");
    layer.id = "homecoming-countdown";
    layer.setAttribute("aria-hidden", "true");
    layer.innerHTML = '<div class="homecoming-countdown-num"></div>';
    SCREEN.appendChild(layer);
  }
  const num = layer.firstChild || layer;
  num.textContent = "00:00:" + pad(remain);
  // 每个数字压一下节奏；减少动态效果时只保留数字本身。
  if (typeof num.animate === "function" && !(typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
    num.animate(
      [{ transform: "scale(1.18)", opacity: .35, filter: "brightness(1.9)" }, { transform: "scale(1)", opacity: 1, filter: "brightness(1)" }],
      { duration: 430, easing: "cubic-bezier(.17,.84,.44,1)" }
    );
  }
}
function clearHomecomingCountdown() {
  homecomingCountdownRemain = null;
  const layer = document.getElementById("homecoming-countdown");
  if (layer) layer.remove();
}
function beginHomecoming() {
  if (SS.homecoming) return;
  SS.arriveHome = true;
  SS.homecoming = { phase: "transferred" };
  // 中断尚未送达的催命、电话与耐心计时，避免继续后又有残留回调。
  Object.values(window._patience || {}).forEach(clearTimeout);
  clearTimeout(window._callBackTo);
  if (typeof stopRing === "function") stopRing();
  if (typeof rbIv !== "undefined") clearTimeout(rbIv);
  if (typeof callState !== "undefined") callState = "";
  window._isCallBackName = null;
  if (typeof hideTyping === "function") hideTyping();
  if (OV) OV.querySelectorAll(".banner, .call").forEach(el => el.remove());
  document.querySelectorAll("video, audio").forEach(media => media.pause());
  window.bgmPausedByOther = false;
  window._bgmStarted = false;
  clearHomecomingCountdown();
  clearHomecomingFault();
  if (typeof window.saveGameState === "function") window.saveGameState();
  renderHomecoming();
  if (typeof window.tryStartBGM === "function") window.tryStartBGM();
}

function renderHomecoming() {
  if (!SCREEN || document.getElementById("homecoming-scene")) return;
  const scene = document.createElement("div");
  scene.id = "homecoming-scene";
  scene.setAttribute("role", "dialog");
  scene.setAttribute("aria-modal", "true");
  scene.setAttribute("aria-labelledby", "homecoming-title");
    scene.innerHTML = `<div class="homecoming-content">
    <!-- 时间：p1样式 灰粉小字宽字距 -->
    <p class="homecoming-time" style="color:#81777e; font-size:13px; font-weight:400; margin-top:0; margin-bottom:8px; letter-spacing:4px;">
      11 / 15 <span style="color:#d3b5bd; font-size:14px; font-weight:400;">23:59:59</span>
    </p>

    <!-- 传送完成 + 渐变线 保持一行：p1配色 -->
    <div style="display:flex; align-items:center; gap:12px; margin-top:0; margin-bottom:12px;">
     <span style="font-size: 12px; color: #a77d8a; letter-spacing: 3px; white-space: nowrap; font-weight: 400;">传送完成</span> <div style="flex:1; height:1px; background:linear-gradient(90deg,#533540,transparent);"></div>
    </div>

    <!-- 主标题：保持绝对纯白，压住全场 -->
    <h1 id="homecoming-title" style="margin: 0 0 20px 0; color: #fff;">用户「小纸团」<br>已被强制传送回家。</h1>
    
    <!-- 图片 -->
    <div class="homecoming-photo-wrap" style="margin-top: 0; margin-bottom: 28px;">
      <img class="homecoming-photo" src="./data/app/angry.jpg" alt="恩恩大王">
    </div>

    <!-- 警告语：放在图片下方。颜色微微提亮到 #e8ccd4，避免被纯黑背景吞噬 -->
    <div style="margin-bottom: 24px; font-size: 13px; line-height: 1.6; color: #e8ccd4; font-weight: 500;">
      <p style="margin: 0 0 6px 0;">敢不陪恩恩大王过生日？</p>
      <p style="margin: 0 0 6px 0;">你要死定了！</p>
      <p style="margin: 0;">烫知识18岁的最后一秒不在相当于冷落了他一年‎•᷄ࡇ•᷅</p>
    </div>
    
    <!-- 按钮 -->
    <button class="homecoming-continue" onclick="continueHomecoming()">继续 <span aria-hidden="true">→</span></button>
    
    <!-- 底部备注 -->
    <p class="homecoming-note" style="text-align: center; margin-top: 16px; margin-bottom: 0; font-size: 12px; color: #8c7b82;">门开着，蛋糕也还在等你</p>
  </div>`;
  SCREEN.appendChild(scene);
  const button = scene.querySelector("button");
  if (button) button.focus();

  const retryHomecomingBgm = (e) => {
    if (e && e.target && e.target.closest && e.target.closest("button")) return;
    if (!SS.homecoming || SS.homecoming.phase !== "transferred") return;
    if (typeof window.tryStartBGM === "function") window.tryStartBGM();
  };
  scene.addEventListener("pointerdown", retryHomecomingBgm);
  scene.addEventListener("click", retryHomecomingBgm);
}

function continueHomecoming() {
  if (!SS.homecoming || SS.homecoming.phase !== "transferred") return;
  SS.homecoming = { phase: "exploring", continuedAt: elapsed() };
  SS.arriveHome = true;
  const scene = document.getElementById("homecoming-scene");
  if (scene) scene.remove();
  if (LOCK) LOCK.style.display = "none";
  const pin = document.getElementById("pinL");
  if (pin) pin.style.display = "none";
  const wall = document.getElementById("wall");
  if (wall) { wall.classList.remove("dim"); wall.style.filter = ""; }
  if (APP) { APP.innerHTML = ""; APP.style.visibility = "hidden"; }
  view = "home";
  if (HOME) HOME.style.visibility = "visible";
  if (typeof renderHome === "function") renderHome();
  setStatus(true);
  if (typeof updateIsland === "function") updateIsland();
  if (typeof window.saveGameState === "function") window.saveGameState();
  if (typeof window.tryStartBGM === "function") window.tryStartBGM();
  deliverHomecomingTimeline();
}
function deliverHomecomingTimeline() {
  if (!SS.homecoming || SS.homecoming.phase !== "exploring" || typeof deliverFrom !== "function") return;
  const fired = SS.homecoming.fired || (SS.homecoming.fired = []);
  let changed = false;
  (CFG.homecomingTimeline || []).forEach(beat => {
    if (!beat.id || !beat.from || !beat.text || fired.includes(beat.id)) return;
    // 兼容已收到旧版长句的存档；新分句逐条记进度，刷新后只补未发部分。
    if (beat.group && fired.includes(beat.group)) return;
    if (elapsed() - SS.homecoming.continuedAt < (beat.after || 0)) return;
    fired.push(beat.id);
    changed = true;
    // 使用正常收信渲染：保留日期、未读、通知及黑名单/免打扰规则。
    // 此处不走已经停止的催命入口 incomingMsgFrom。
    deliverFrom(beat.from, beat.text);
  });
  if (changed && typeof window.saveGameState === "function") window.saveGameState();
}
function mountEndingPreviewControl() {
  if (!IS_DEV_HOST || !SCREEN || document.getElementById("ending-preview-control")) return;
  const button = document.createElement("button");
  button.id = "ending-preview-control";
  button.className = "ending-preview-control";
  button.textContent = ENDING_PREVIEW ? "重播结尾 · 20秒" : TAIL_PREVIEW ? "重播尾段 · 321" : "体验结尾 · 20秒";
  button.onclick = () => {
    // 重新打开预览会清理独立预览档，正式进度不受影响。
    location.href = location.pathname + (TAIL_PREVIEW ? "?dev=1&tailPreview=1" : "?dev=1&endingPreview=1");
  };
  SCREEN.appendChild(button);
}

function pacedAt(at) {
  if (at === 0) return 0;
  const p = CFG.pace || {};
  const off = p.offset != null ? p.offset : 40;
  const amp = p.amp != null ? p.amp : 110;
  const soft = p.soft != null ? p.soft : 30;
  return off + amp * Math.log(1 + at / soft);
}

const NAG_LINES = ["在吗", "回我一下", "？", "你在哪", "看到消息了吗", "别不回我"];
function pressureTick() {
  if (SS.arriveHome || SS.midnightBoom) return;
  const from = CFG.nagFrom != null ? CFG.nagFrom : 470;
  if (elapsed() < from) return;
  const now = Date.now();
  if (!window._nextNag) window._nextNag = now + 6000;
  if (now < window._nextNag) return;
  const n = window._nagCount || 0;
  if (n >= 12) return;
  const names = Object.keys(CFG.chats || {}).filter((k) => !(SS.missed && SS.missed.has(k)) && !(window._playerCalledBack && window._playerCalledBack[k]) && !SS.callDone[k]);
  if (!names.length) return;
  const who = names[Math.floor(Math.random() * names.length)];
  if (hasRepliedTo(who)) { window._nextNag = now + 2000; return; }
  window._nagCount = n + 1;
  const wait = Math.max(4500, 13000 * Math.pow(0.9, n));
  window._nextNag = now + wait;
  const line = NAG_LINES[Math.min(n, NAG_LINES.length - 1)];
  if (typeof incomingMsgFrom === "function") incomingMsgFrom(who, line);
}
function midnightBoom() { beginHomecoming(); }

// 本局是否已经跟这个角色接触过（聊过天，或通过电话）
// 注意：不能用「聊天记录里有 me」判断——历史记录本来就带玩家消息
function hasRepliedTo(name) {
  if (SS.talked && SS.talked[name]) return true;
  if ((SS.stage && (SS.stage[name] || 0) > 0)) return true;
  return ((SS.lineIdx && (SS.lineIdx[name] || 0)) > 0);
}

function storyTick(e) {
  if (SS.arriveHome) return;
  if (!CFG.timeline) return;
  CFG.timeline.forEach((beat, i) => {
    if (beat.type === "choice" || beat.type === "ending") return;
    const key = i + "@" + beat.at;
    if (beat.from && SS.callDone[beat.from] && (beat.type === "notify" || beat.type === "call")) {
      SS.fired.add(key);
      return;
    }
    // beat.t = 直接指定第几秒触发（开场连环通知用），不填则按 at 走节奏曲线
    const due = beat.t != null ? beat.t : pacedAt(beat.at);
    if (e >= due && !SS.fired.has(key)) {
      // 已完成过一次回拨对话的人：时间线里他的 notify / call 全部作废
      if (beat.from && window._playerCalledBack && window._playerCalledBack[beat.from] &&
          (beat.type === "notify" || beat.type === "call")) {
        SS.fired.add(key);
        return;
      }
      // 催命类台词：玩家已经回过话就直接作废，避免「刚说好又质问」
      if (beat.skipIfReplied && beat.from && hasRepliedTo(beat.from)) { SS.fired.add(key); return; }
      if (beat.needStage !== undefined && beat.from) {
        const currentStage = SS.stage[beat.from] || 0;
        if (currentStage > beat.needStage) { SS.fired.add(key); return; }
      }
      if (beat.type === "ending" && typeof callState !== "undefined" && callState) return;
      // 这通电话这次不打（已经主动找过这个人），但也别记成「已触发」，否则永远补不回来
      if (beat.type === "call" && window._playerCalledWho && window._playerCalledWho[beat.from]) return;
      SS.fired.add(key);
      if (beat.type === "notify") incomingMsgFrom(beat.from, beat.text);
      if (beat.type === "call") incomingCallFrom(beat.from || "穆祉丞");
      if (beat.type === "mail") incomingMailFrom(beat);
      if (beat.type === "choice" && !SS.arriveHome && !IS_DEV_HOST) showStoryChoice();
      if (beat.type === "ending" && !SS.arriveHome && !IS_DEV_HOST) showEnding(SS.choice || "B");
    }
  });
}

let lastTickSec = -1;
function tick() {
  const currentSec = Math.floor(Date.now() / 1000); if (currentSec === lastTickSec) return; lastTickSec = currentSec;
  if (!window._lastSaveSec || currentSec - window._lastSaveSec >= 5) {
    window._lastSaveSec = currentSec;
    if (typeof window.saveGameState === "function") window.saveGameState();
  }
  typeof updateCrumb === "function" && updateCrumb();
  const sbtEl = $("#sbt"); if (sbtEl) sbtEl.textContent = clock12();
  const lk = $("#lkt"); if (lk) lk.textContent = clock12();
  if (!window._dndHintShown && view === "lock" && elapsed() > 60 && (window._mzcNoise || 0) >= 3) {
    window._dndHintShown = true; lockNotes.unshift({ title: "免打扰建议", body: "穆祉丞一直很吵闹，可以点击开启免打扰", app: "dnd", time: gameTime24() }); renderLock();
  }
  updateHomecoming(elapsed());
  if (!ENDING_PREVIEW) { storyTick(elapsed()); pressureTick(); }
  if (!window._dateFlipped && elapsed() >= GAME_END_AT) { window._dateFlipped = true; selectedDay = 16; if (view === "home" && typeof renderHome === "function") renderHome(); if (view === "calendar") show("calendar", "none"); if (view === "lock" || view === "pin") renderLock(); }
  if (typeof callState !== "undefined" && callState === "active") {
    const sec = Math.floor((Date.now() - (typeof callStart !== "undefined" ? callStart : Date.now())) / 1000);
    const tm = $("#ctime"); if (tm) tm.textContent = pad(Math.floor(sec / 60)) + ":" + pad(sec % 60);
    const S = (typeof curScript !== "undefined" && curScript) || speech || [["对方", "喂？"]]; if (!S || S.length === 0) return;
    const idx = Math.min(S.length - 1, Math.floor(sec / 2)); if (idx !== capIdx) { capIdx = idx; const c = $("#cap"); if (c && S[idx]) c.innerHTML = `<small>${esc(dn(S[idx][0]))}</small>${esc(S[idx][1])}`; }
    if (sec > S.length * 2 + 2 && typeof endCall === "function") endCall();
  }
}
function fit() {
  const ph = $("#phone"); ph.classList.remove("mob"); ph.classList.toggle("short", innerHeight < 740);
  const baseW = 393, baseH = 852; const safeH = innerHeight - 30, safeW = innerWidth - 20;
  SC = Math.min(safeW / baseW, safeH / baseH, 1); ph.style.width = baseW + "px"; ph.style.height = baseH + "px"; ph.style.position = "absolute"; ph.style.left = "50%"; ph.style.top = "50%"; ph.style.transformOrigin = "center center"; ph.style.transform = `translate(-50%, -50%) scale(${SC})`; ph.style.margin = "0";
}
function buildInterleavedTimeline() {
  const list = CFG.timeline || [];
  const withFrom = list.filter((b) => b.from);
  const rest = list.filter((b) => !b.from);
  if (withFrom.length < 3) return;
  // 作者已手工排定每条消息的at与交错顺序（含结尾303-326的情绪阶梯），这里只按at稳定排序、
  // 保留原at触发，不再按角色轮询改写——改写会把条数少的角色挤到前段，结尾被高条数角色占走。
  withFrom.sort((a, b) => a.at - b.at);
  CFG.timeline = withFrom.concat(rest);
}
window.buildInterleavedTimeline = buildInterleavedTimeline;
function hideBoot() { const b = document.getElementById("boot"); if (!b) return; b.style.opacity = "0"; setTimeout(() => { if (b.parentNode) b.parentNode.removeChild(b); }, 400); }

// ================= 存档核心 =================
window.saveGameState = function () {
  // 正在重置：别让每 5 秒的自动存档把刚删掉的旧进度又写回来
  if (window._resetting) return;
  try {
    const state = {
      sig: window.DATA_SIG,
      elapsed: elapsed(),
      chatData: window.chatData,
      unread: window.unread,
      lockNotes: typeof lockNotes !== "undefined" ? lockNotes : [],
      wxBlocked: window._wxBlocked || {},
      SS: {
        stage: SS.stage, lineIdx: SS.lineIdx,
        fired: Array.from(SS.fired), fragments: Array.from(SS.fragments),
        missed: Array.from(SS.missed || []), arriveHome: SS.arriveHome, choice: SS.choice,
        talked: SS.talked, callDone: SS.callDone, homecoming: SS.homecoming || null,
      },
    };
    localStorage.setItem(GAME_SAVE_KEY, JSON.stringify(state));
  } catch (e) { console.warn("存档失败", e); }
};

window.loadGameState = function () {
  const saved = localStorage.getItem(GAME_SAVE_KEY); if (!saved) return;
  try {
    const state = JSON.parse(saved);
    // 剧情数据改过（指纹对不上）就把旧档丢掉，否则旧的时间线 fired 会一直生效
    if (state.sig !== window.DATA_SIG) { localStorage.removeItem(GAME_SAVE_KEY); return; }
    if (state.chatData) { for (const k in window.chatData) delete window.chatData[k]; Object.assign(window.chatData, state.chatData); }
    if (state.unread) Object.assign(window.unread, state.unread);
    if (state.lockNotes) lockNotes = state.lockNotes;
    if (state.wxBlocked) window._wxBlocked = state.wxBlocked;
    if (state.SS) {
      SS.stage = state.SS.stage || {}; SS.lineIdx = state.SS.lineIdx || {};
      SS.fired = new Set(state.SS.fired || []); SS.fragments = new Set(state.SS.fragments || []);
      SS.missed = new Set(state.SS.missed || []); SS.arriveHome = state.SS.arriveHome || false; SS.choice = state.SS.choice || null;
      SS.talked = state.SS.talked || {};
      SS.callDone = state.SS.callDone || {};
      SS.homecoming = state.SS.homecoming || null;
    }
  } catch (e) { console.warn("读档失败", e); }
};

window.saveChat = window.saveGameState;
window.saveStory = window.saveGameState;

// 👇 重置进度（手写 UI 确认版，防浏览器拦截）
window.resetGameState = function () {
  if (document.getElementById("reset-confirm-wrap")) return;

  const wrap = document.createElement("div");
  wrap.id = "reset-confirm-wrap";
  wrap.style.cssText = "position:absolute; inset:0; z-index:9999999; background:rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; backdrop-filter:blur(4px); -webkit-backdrop-filter:blur(4px); opacity:0; transition:opacity 0.2s;";
  
  wrap.innerHTML = `
    <div style="background:#fff; width:270px; border-radius:20px; overflow:hidden; text-align:center; transform:scale(0.95); transition:transform 0.2s; box-shadow:0 10px 30px rgba(0,0,0,0.2);">
      <div style="padding:24px 20px 20px;">
        <div style="font-size:17px; font-weight:600; color:#111; margin-bottom:8px;">重置进度</div>
        <div style="font-size:13px; color:#666; line-height:1.5;">清空当前存档，聊天记录和时间线将全部清空，从头开始。</div>
      </div>
      <div style="display:flex; border-top:0.5px solid #e5e5ea;">
        <button style="flex:1; padding:16px; border:none; background:none; font-size:16px; color:#007aff; border-right:0.5px solid #e5e5ea; cursor:pointer;" onclick="document.getElementById('reset-confirm-wrap').remove();">取消</button>
        <button style="flex:1; padding:16px; border:none; background:none; font-size:16px; color:#ff3b30; font-weight:600; cursor:pointer;" id="btn-do-reset">确认重置</button>
      </div>
    </div>
  `;
  
  document.getElementById("screen").appendChild(wrap);
  
  requestAnimationFrame(() => {
    wrap.style.opacity = "1";
    wrap.querySelector('div').style.transform = "scale(1)";
  });

  wrap.querySelector("#btn-do-reset").onclick = () => {
    // 先上锁再删档：不然 reload 前的这 300ms 里，tick 可能刚好又存一次旧档
    window._resetting = true;
    localStorage.removeItem(GAME_SAVE_KEY);
    if (typeof toastDev === "function") toastDev("进度已清空");
    setTimeout(() => { location.reload(); }, 300);
  };
};

// 👇 一键回到锁屏（带黑屏过渡 + 彻底清理动画残留）
window.lockPhone = function () {
  if (typeof callState !== "undefined" && callState) return;
  if (view === "lock") return;
  if (!["home", "pin"].includes(view)) return;

  const mask = document.createElement("div");
  mask.style.cssText = "position:absolute; inset:0; z-index:999999999; background:#000; opacity:0; transition:opacity 0.35s ease; pointer-events:none; -webkit-tap-highlight-color:transparent;";
  document.getElementById("screen").appendChild(mask);
  
  requestAnimationFrame(() => { mask.style.opacity = "1"; });

  setTimeout(() => {
    if (typeof APP !== "undefined") APP.style.visibility = "hidden";
    if (typeof HOME !== "undefined") {
      HOME.style.visibility = "hidden"; 
      HOME.style.transform = "none"; HOME.style.opacity = "1";
      HOME.getAnimations().forEach(a => a.cancel());
    }
    
    const wall = $("#wall");
    if (wall) { wall.classList.remove("dim"); wall.style.filter = ""; wall.getAnimations().forEach(a => a.cancel()); }
    
    const pinL = $("#pinL");
    if (pinL) { pinL.style.display = "none"; pinL.getAnimations().forEach(a => a.cancel()); }
    
    LOCK.getAnimations().forEach(a => a.cancel()); 
    LOCK.style.display = "block"; LOCK.style.visibility = "visible"; LOCK.style.opacity = "1";

    const lk = $("#lkc");
    if (lk) {
      lk.getAnimations().forEach(a => a.cancel());
      lk.style.transform = "none"; lk.style.opacity = "1"; lk.style.pointerEvents = "";
    }
    
    view = "lock"; renderLock();
    setStatus(true); updateCrumb();

    mask.style.opacity = "0";
    setTimeout(() => { if (mask.parentNode) mask.remove(); }, 350);
  }, 350);
};

// LED倒计时字体预热：仅5KB，避开首屏关键请求，页面加载完空闲时后台拉取，倒计时出现前早已就绪。
if (typeof addEventListener === "function") addEventListener("load", () => {
  setTimeout(() => {
    try { fetch("data/fonts/DSEG7Classic-Bold.woff2", { cache: "force-cache" }).catch(() => {}); } catch (e) {}
  }, 4000);
});

function initApp() {
  // 预览每次打开都重播，不被上一次的 transferred/exploring 阶段跳过。
  if (ENDING_PREVIEW || TAIL_PREVIEW) localStorage.removeItem(GAME_SAVE_KEY);
  window.loadGameState();
  if (typeof window.syncBackgroundTrack === "function") window.syncBackgroundTrack();
  addEventListener("resize", fit); fit(); buildInterleavedTimeline();
  if (TAIL_PREVIEW) {
    // 尾段预览只看最后20秒：开始前的历史消息直接标记已发，避免一进预览就补播轰炸。
    CFG.timeline.forEach((beat, i) => {
      const due = beat.t != null ? beat.t : pacedAt(beat.at);
      if (due < TAIL_PREVIEW_START) SS.fired.add(i + "@" + beat.at);
    });
  }
  if (IS_DEV_HOST) { view = "home"; LOCK.style.display = "none"; renderHome(); HOME.style.visibility = "visible"; }
  else { view = "lock"; HOME.style.visibility = "hidden"; LOCK.style.display = "block"; LOCK.style.visibility = "visible"; renderLock(); }
  try { const bgmEl = document.getElementById("bgm"); if (bgmEl && !bgmEl.dataset.vol) { bgmEl.volume = 1; bgmEl.dataset.vol = "1"; } } catch (e) {}
  setStatus(true); startClock();
  if (ENDING_PREVIEW) base = Date.now() - (GAME_END_AT - HOMECOMING_FAULT_SECONDS) * 1000;
  if (TAIL_PREVIEW) base = Date.now() - TAIL_PREVIEW_START * 1000;
  if (SS.homecoming && SS.homecoming.phase === "transferred") {
    document.querySelectorAll("video, audio").forEach(media => media.pause());
  }
  setInterval(tick, 1000); tick(); hideBoot();
  mountEndingPreviewControl();
  if (TAIL_PREVIEW) mountTailCountdown();
  if (IS_DEV_HOST && /[?&]replies=1/.test(location.search)) mountReplyViewer();
  if (SS.homecoming && typeof window.tryStartBGM === "function") window.tryStartBGM();
}
