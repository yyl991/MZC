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

window.preloadAssets = function () {
  const assets = new Set();
  if (window.STORY && window.STORY.roles)
    Object.values(window.STORY.roles).forEach((r) => {
      if (r.avatar) assets.add(r.avatar);
    });
  if (typeof LIFE_WEIBO_DATA !== "undefined")
    LIFE_WEIBO_DATA.forEach((w) => {
      if (w.images) w.images.forEach((img) => assets.add(img));
    });
  if (typeof baseNotes !== "undefined")
    baseNotes.forEach((n) => {
      if (n.cover) assets.add(n.cover);
    });
  if (window.chatData) {
    for (const name in window.chatData) {
      window.chatData[name].forEach((msg) => {
        const text = msg[0];
        if (typeof text === "string") {
          if (text.startsWith("[图片]")) {
            const url = text.replace("[图片]", "").trim();
            if (url) assets.add(url);
          } else if (text.startsWith("[表情]")) {
            const url = text.replace("[表情]", "").trim();
            if (url) assets.add(url);
          }
        }
      });
    }
  }
  assets.forEach((url) => {
    if (
      !url ||
      (url.startsWith("http") === false && url.startsWith("./") === false)
    )
      return;
    const img = new Image();
    img.src = url;
  });
};

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
  selectedDay = 15,
  calMonth = 11,
  chatId = "穆祉丞",
  mailId = 0;
let unread = {};
let callName = "穆祉丞";
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
  return pad(h) + ":" + pad(Math.floor(m % 60));
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
const T = { duration: 460, easing: "cubic-bezier(.32,.72,0,1)" };
function devRadius() {
  return document.getElementById("phone").classList.contains("mob") ? 0 : 56;
}

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
  badge.style.display = window.isDnd ? "flex" : "none";
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
  if (id === "phone") {
    try {
      return 3 + declined;
    } catch (e) {
      return 3;
    }
  }
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
  let name = APPS[id] || id;
  return `<button class="app" data-app="${id}" onclick="openApp('${id}',this.firstElementChild)"><div class="icon"><div class="ic">${appIcon(id)}</div>${b ? `<span class="bdg">${b}</span>` : ""}</div><span class="lbl">${name}</span></button>`;
}

const PARENT = {
  note: "notes",
  chat: "wechat",
  moments: "wx_discover",
  wx_profile: "chat",            // 资料页返回聊天
  wx_moments_user: "wx_profile", // 个人朋友圈返回资料页
  wx_moments_detail: "wx_moments_user", // 详情页返回朋友圈
  maild: "mail",
  reel: "instagram",
  screentime: "settings",
  sms_detail: "sms",
  weibo: "weibo",
  weibo_profile: "weibo",
  weibo_artist: "weibo",
  weibo_supertopic: "weibo_artist",
  weibo_follow: "weibo_profile",
  mail_detail: "mail",
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
  const v = VIEWS[id] && VIEWS[id]();
  if (!v) return;
  
  const pg = document.createElement("div");
  pg.className = "pg " + (v.cls || "");
  pg.innerHTML = v.html;
  pg.dataset.view = id;
  pg.dataset.dark = v.dark ? "1" : "";

  // ==========================================
  // 👇 全自动全局返回键管理 (一级隐藏，二级自动注入)
  // ==========================================
  const ROOT_VIEWS = [
    "home", "lock", "pin",
    "wechat", "wx_contacts", "wx_discover", "wx_me",
    "phone", "sms", "weather", "recorder", "calendar", "clock", "notes", "safari", "music", "maps", "photos", "settings", "mail",
    "weibo", "weibo_profile", "xianyu", "xianyu_me", "bilibili", "xhs", "instagram"
  ];

  if (ROOT_VIEWS.includes(id)) {
    // 1. 如果是一级界面，强制隐藏页面里所有可能存在的返回键
    pg.querySelectorAll('.nb-back, .bk').forEach(el => {
      el.style.visibility = 'hidden';
      el.style.pointerEvents = 'none';
    });
  } else {
    // 2. 如果是二级界面，检查是否有标准导航或手写的返回逻辑
    const hasStandardNav = pg.querySelector('.nav') || pg.querySelector('.wx-chat-h');
    const hasManualBack = pg.innerHTML.includes('onclick="back()"') || 
                          pg.innerHTML.includes('onclick="closeApp()"') || 
                          pg.innerHTML.includes('onclick="backSuperTopic()"');

    if (!hasStandardNav && !hasManualBack) {
      const isDark = !!v.dark || pg.classList.contains('dark');
      const autoBack = document.createElement("div");
      autoBack.className = "auto-global-back";
      
      // 极简无圆圈纯箭头
      autoBack.style.cssText = `position: absolute; top: 45px; left: 10px; z-index: 999; display: flex; align-items: center; justify-content: center; cursor: pointer; padding: 8px;`;
      
      autoBack.innerHTML = `<button onclick="back()" style="display: flex; align-items: center; justify-content: center; color: ${isDark ? '#fff' : '#111'}; border: none; background: none; padding: 0; cursor: pointer;">${G.chevL.replace('<svg', '<svg width="22" height="22" stroke="currentColor" stroke-width="2.2"')}</button>`;
      
      pg.appendChild(autoBack);
    }
  }
  // ==========================================

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
  if (
    (typeof callState !== "undefined" && callState) ||
    view !== "home" ||
    !VIEWS[id]
  )
    return;
  if (id === "weibo") id = "weibo_profile";
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
  if (
    (typeof callState !== "undefined" && callState) ||
    ["home", "lock", "pin"].includes(view)
  )
    return;
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
  // 朋友圈详情：按来源返回
  if (view === "wx_moments_detail") {
    const from = window._momentDetailFrom || "moments";
    window._momentDetailFrom = "moments"; // 用完重置
    return show(from, "pop");
  }
  // 某人朋友圈：按来源返回
  if (view === "wx_moments_user") {
    const from = window._momentsUserFrom || "wx_profile";
    window._momentsUserFrom = "wx_profile";
    return show(from, "pop");
  }
  // 资料页：按来源返回
  if (view === "wx_profile") {
    const from = window._profileFrom || "chat";
    window._profileFrom = "chat";
    return show(from, "pop");
  }
  // 其它页面走原 PARENT
  if (PARENT[view]) show(PARENT[view], "pop");
  else closeApp();
}

function hbAction() {
  if (typeof callState !== "undefined" && callState) return;
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
    pg = null,
    isDragging = false,
    startTime = 0;
  SCREEN.addEventListener("pointerdown", (e) => {
    const r = SCREEN.getBoundingClientRect();
    const x = (e.clientX - r.left) / SC;
    if (!PARENT[view] || x > 25) return;
    x0 = e.clientX;
    y0 = e.clientY;
    pg = APP.lastElementChild;
    isDragging = true;
    startTime = Date.now();
    if (pg) pg.style.transition = "none";
  });
  SCREEN.addEventListener("pointermove", (e) => {
    if (!isDragging || x0 === null) return;
    const dx = Math.max(0, (e.clientX - x0) / SC);
    const dampedDx = dx > 100 ? 100 + (dx - 100) * 0.3 : dx;
    if (pg) pg.style.transform = `translateX(${dampedDx}px)`;
  });
  SCREEN.addEventListener("pointerup", (e) => {
    if (!isDragging || x0 === null) return;
    isDragging = false;
    const dx = (e.clientX - x0) / SC;
    const timeTaken = Date.now() - startTime;
    const velocity = dx / timeTaken;
    x0 = null;
    if (pg) {
      pg.style.transition = "transform 0.3s cubic-bezier(0.2, 0.9, 0.25, 1)";
      pg.style.transform = "";
    }
    if (dx > 90 || velocity > 0.5) {
      back();
    }
  });
})();
function goBack() {
  if (typeof callState !== "undefined" && callState) return;
  if (OV.querySelector(".viewer")) return closeViewer();
  if (OV.querySelector(".np")) return closeNP();
  if (["lock", "pin", "home"].includes(view)) {
    if (view === "pin") pinCancel();
    return;
  }
  back();
}
function updateCrumb() {
  const on =
    !["lock", "pin", "home"].includes(view) &&
    !(typeof callState !== "undefined" && callState);
  $("#sb").classList.toggle("crumb", on);
}
$("#sbk").innerHTML =
  `<svg viewBox="0 0 7 12"><path d="M6 1 1 6l5 5"/></svg>主页`;
$("#sbk").addEventListener("click", (e) => {
  e.stopPropagation();
  if (typeof callState !== "undefined" && callState) return;
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
let lastPopTime = 0;
try {
  history.pushState({ wb: 1 }, "");
  window.addEventListener("popstate", (e) => {
    if (
      view === "home" &&
      !OV.querySelector(".viewer") &&
      !OV.querySelector(".np") &&
      !(typeof callState !== "undefined" && callState)
    ) {
      const now = Date.now();
      if (now - lastPopTime < 2000) {
        history.back();
      } else {
        lastPopTime = now;
        toastDev("再滑一次退出网页");
        history.pushState({ wb: 1 }, "");
      }
    } else {
      goBack();
      history.pushState({ wb: 1 }, "");
    }
  });
} catch (e) {}

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
  // 👇 同样加锁拦截
  if (view === "home" && !window.isVinylBusy) renderHome();
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
    }
  });
}

let lastTickSec = -1;
function tick() {
  // 👇 核心优化：利用节流锁。如果秒数没有变化，直接跳过，不去查 DOM、改 DOM，彻底释放 CPU！
  const currentSec = Math.floor(Date.now() / 1000);
  if (currentSec === lastTickSec) return;
  lastTickSec = currentSec;

  // 1. 顶部状态栏时间更新
  typeof updateCrumb === "function" && updateCrumb();
  const sbtEl = $("#sbt");
  if (sbtEl) sbtEl.textContent = clock12();
  const lk = $("#lkt");
  if (lk) lk.textContent = clock12(false);

  // 2. 剧情时间线检查 (每秒检查一次足够了)
  storyTick(elapsed());

  // 3. 通话状态实时更新 (严格基于真实流逝时间)
  if (typeof callState !== "undefined" && callState === "active") {
    const sec = Math.floor(
      (Date.now() -
        (typeof callStart !== "undefined" ? callStart : Date.now())) /
        1000,
    );

    // 更新通话时长
    const tm = $("#ctime");
    if (tm) tm.textContent = pad(Math.floor(sec / 60)) + ":" + pad(sec % 60);

    // 更新通话字幕
    const S = (typeof curScript !== "undefined" && curScript) ||
      speech || [["对方", "喂？"]];
    if (!S || S.length === 0) return;

    const idx = Math.min(S.length - 1, Math.floor(sec / 3));
    if (idx !== capIdx) {
      capIdx = idx;
      const c = $("#cap");
      if (c && S[idx])
        c.innerHTML = `<small>${esc(dn(S[idx][0]))}</small>${esc(S[idx][1])}`;
    }

    // 自动挂断
    if (sec > S.length * 3 + 2 && typeof endCall === "function") endCall();
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
  window.preloadAssets();
  view = "home";
  LOCK.style.display = "none";
  renderHome();
  HOME.style.visibility = "visible";
  setStatus(true);
  setInterval(tick, 1000);
  tick();
}
