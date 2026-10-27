"use strict";

/* ==========================================
   1. 电话 & 通话
   ========================================== */
let callState = "",
  declined = 0,
  callStart = 0,
  callPrev = "",
  capIdx = -1,
  extraCalls = [];
let ringIv = null,
  ringTo = null,
  callDir = "in",
  curScript = null,
  isEnding = false,
  rbIv = null;
let missOnly = false;
let dialVal = "";

window.callWhen = function (s) {
  if (s.startsWith("今天 ")) {
    const [h, m] = s.slice(3).split(":").map(Number);
    return ampm(h * 60 + m);
  }
  const w = s.split(" ")[0];
  if (w === "昨天") return "昨天";
  if (ZH_WD[w] != null) return wdLong(2026, 10, 11 + ZH_WD[w]);
  return w;
};
window.callNameDisp = (n) => n;

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
window.dial = function (name) {
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
};
window.startRing = function () {
  ringOnce();
  clearInterval(ringIv);
  ringIv = setInterval(() => {
    ringOnce();
    vib([400, 250, 400]);
  }, 2600);
  vib([400, 250, 400]);
};
window.stopRing = function () {
  clearInterval(ringIv);
  ringIv = null;
  clearTimeout(ringTo);
  try {
    navigator.vibrate && navigator.vibrate(0);
  } catch (e) {}
};
window.incomingCallFrom = function (from = "穆祉丞") {
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
};
window.callTop = function () {
  const r = CFG.roles && CFG.roles[callName];
  let content = "";
  if (r && r.avatar)
    content = `<img src="${r.avatar}" style="width:100%;height:100%;object-fit:cover;" />`;
  else if (r) content = `<div style="font-size:40px">${r.initial}</div>`;
  else
    content = `<span style="width:100%;height:100%;display:grid;place-items:center;background:linear-gradient(#a5abb6,#7f858f)">${G.sil.replace("<svg", '<svg width="64"')}</span>`;
  return `<div class="cav">${content}</div><div class="cnm">${esc(dn(callName))}</div>`;
};
window.renderCall = function () {
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
};
window.wireSlider = function () {
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
};
window.answerCall = function () {
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
};
window.declineCall = function () {
  stopRing();
  callState = "";
  declined++;
  extraCalls.unshift([callName, "今天 " + gameTime24(), "未接来电"]);
  closeCallUI();
};
window.missCall = function () {
  if (callState !== "ring") return;
  stopRing();
  callState = "";
  declined++;
  extraCalls.unshift([callName, "今天 " + gameTime24(), "未接来电"]);
  closeCallUI();
};
window.endCall = function () {
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
};
window.closeCallUI = function () {
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
};
window.showDialpad = function () {
  let dp = OV.querySelector(".dialpad");
  if (dp) return;
  dp = document.createElement("div");
  dp.className = "dialpad";
  dp.innerHTML = `<div class="dp-num" id="dp-num"></div><div class="dp-grid"><button onclick="dpPress('1')">1<small> </small></button><button onclick="dpPress('2')">2<small>ABC</small></button><button onclick="dpPress('3')">3<small>DEF</small></button><button onclick="dpPress('4')">4<small>GHI</small></button><button onclick="dpPress('5')">5<small>JKL</small></button><button onclick="dpPress('6')">6<small>MNO</small></button><button onclick="dpPress('7')">7<small>PQRS</small></button><button onclick="dpPress('8')">8<small>TUV</small></button><button onclick="dpPress('9')">9<small>WXYZ</small></button><button onclick="dpPress('*')">*<small> </small></button><button onclick="dpPress('0')">0<small>+</small></button><button onclick="dpPress('#')">#<small> </small></button></div><div class="dp-bottom"><button class="dp-end" onclick="endCall()"><span style="display:block;transform:rotate(135deg)">${G.handset}</span></button><button class="dp-hide" onclick="closeDialpad()">隐藏拨号键盘</button></div>`;
  OV.appendChild(dp);
  dialVal = "";
};
window.closeDialpad = function () {
  const dp = OV.querySelector(".dialpad");
  if (dp) dp.remove();
};
window.dpPress = function (k) {
  dialVal += k;
  const el = document.getElementById("dp-num");
  if (el) el.textContent = dialVal;
  vib(10);
  sfx("key");
};

/* ==========================================
   2. 短信 (SMS)
   ========================================== */
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
    { t: "现在", icon: "snow", temp: "0°" },
    { t: "0时", icon: "snow", temp: "1°" },
    { t: "1时", icon: "snow", temp: "-1°" },
    { t: "2时", icon: "snow", temp: "-1°" },
    { t: "3时", icon: "snow", temp: "-2°" },
    { t: "4时", icon: "snow", temp: "-3°" },
    { t: "5时", icon: "snow", temp: "-3°" },
  ];

  // 👇 按照你截图里真实历史天气的数据配置：只有 16、17 号最冷，之后回温
  const daily = [
    { day: "今天", icon: "snow", min: -3, max: 2 }, // 16 号：多云转小雪
    { day: "周一", icon: "snow", min: -5, max: -1 }, // 17 号：持续降温
    { day: "周二", icon: "pcloud", min: 0, max: 8 },
    { day: "周三", icon: "pcloud", min: 3, max: 14 },
    { day: "周四", icon: "pcloud", min: 2, max: 9 },
    { day: "周五", icon: "cloud", min: -2, max: 10 },
    { day: "周六", icon: "pcloud", min: 0, max: 14 },
    { day: "周日", icon: "pcloud", min: 2, max: 13 },
    { day: "周一", icon: "pcloud", min: -2, max: 11 },
    { day: "周二", icon: "cloud", min: -3, max: 6 },
  ];

  // 👇 全换成 Emoji
  const Icons = {
    moon: "🌙",
    sun: "☀️",
    cloud: "☁️",
    "cloud-sun": "⛅",
    pcloud: "⛅",
    snow: "🌨️",
    rain: "🌧️",
  };

  // 调整温度条的范围（最低按 -5 度算，最高按 15 度算）
  const getBarStyle = (min, max) =>
    `left: ${((min + 7) / 22) * 100}%; width: ${((max - min) / 22) * 100}%;`;

  return {
    html: `
    <style>
      @keyframes snow-fall {
        0% { transform: translateY(-10px) rotate(0deg); opacity: 0; }
        20% { opacity: 1; }
        100% { transform: translateY(800px) rotate(360deg); opacity: 0; }
      }
      .snowflake {
        position: absolute; top: -20px; color: #fff; font-size: 18px;
        pointer-events: none; z-index: 1; animation: snow-fall linear infinite;
      }
    </style>
    <div style="position:absolute; inset:0; background:linear-gradient(180deg, #2a3441 0%, #4a5b70 50%, #2a3441 100%); color:#fff; display:flex; flex-direction:column; overflow:hidden;">
      
      <!-- 纯 CSS 雪花特效 -->
      <div class="snowflake" style="left: 10%; animation-duration: 4s; animation-delay: 0s;">❅</div>
      <div class="snowflake" style="left: 30%; animation-duration: 5s; animation-delay: 1s;">❆</div>
      <div class="snowflake" style="left: 55%; animation-duration: 3.5s; animation-delay: 2s;">❅</div>
      <div class="snowflake" style="left: 75%; animation-duration: 6s; animation-delay: 0.5s;">❆</div>
      <div class="snowflake" style="left: 90%; animation-duration: 4.5s; animation-delay: 1.5s;">❅</div>
      
      <div style="position:absolute; top:50px; left:16px; z-index:10; display:flex; align-items:center; gap:4px; font-size:15px; font-weight:500; cursor:pointer;" onclick="closeApp()"><svg viewBox="0 0 12 20" width="10" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2 2 10l8 8"/></svg> 主屏幕</div>
      
      <div class="scroll" style="flex:1; padding-top:85px; padding-bottom:100px; overflow-y:auto; scrollbar-width:none; z-index:2; position:relative;">
        <div style="text-align:center; margin-bottom:20px;">
          <div style="font-size:15px; font-weight:500; opacity:0.8; margin-bottom:2px;">我的位置</div>
          <div style="font-size:34px; font-weight:400;">北京</div>
          <div style="font-size:96px; font-weight:200; line-height:1; margin:0 0 4px -15px;">0°</div>
          <div style="font-size:20px; font-weight:500;">阴转小雪</div>
          <div style="font-size:16px; font-weight:500; opacity:0.9; margin-top:2px;">最高 2° 最低 -3°</div>
        </div>
        
        <div style="background:rgba(255,255,255,0.15); border-radius:16px; margin:0 16px 16px; padding:14px 16px; backdrop-filter:blur(10px);">
          <div style="font-size:14px; font-weight:500; padding-bottom:10px; border-bottom:0.5px solid rgba(255,255,255,0.2); margin-bottom:10px;">预计零点后转小雪，气温骤降至零下，注意保暖，初雪出行注意安全。</div>
          <div style="display:flex; gap:24px; overflow-x:auto; scrollbar-width:none; flex-wrap:nowrap;">
            ${hours.map((h) => `<div style="display:flex; flex-direction:column; align-items:center; gap:8px; min-width:40px; white-space:nowrap;"><div style="font-size:15px; font-weight:600;">${h.t}</div><div style="font-size:24px; line-height: 1; margin: 4px 0;">${Icons[h.icon] || Icons.cloud}</div><div style="font-size:17px; font-weight:600;">${h.temp}</div></div>`).join("")}
          </div>
        </div>
        
        <div style="background:rgba(255,255,255,0.15); border-radius:16px; margin:0 16px 16px; padding:14px 16px; backdrop-filter:blur(10px);">
          <div style="font-size:13px; font-weight:600; opacity:0.7; display:flex; align-items:center; gap:6px; padding-bottom:10px; border-bottom:0.5px solid rgba(255,255,255,0.2); margin-bottom:6px;">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg> 10 天天气预报
          </div>
          ${daily
            .map(
              (
                d,
                i,
              ) => `<div style="display:flex; align-items:center; padding:10px 0; ${i > 0 ? "border-top:0.5px solid rgba(255,255,255,0.15);" : ""}">
            <div style="width:45px; font-size:16px; font-weight:600;">${d.day}</div>
            <div style="width:35px; font-size:22px; display:flex; justify-content:center; align-items:center;">${Icons[d.icon] || Icons.cloud}</div>
            <div style="width:30px; font-size:16px; font-weight:500; opacity:0.8; text-align:right;">${d.min}°</div>
            <div style="flex:1; height:4px; background:rgba(0,0,0,0.15); border-radius:2px; margin:0 10px; position:relative;">
              <div style="position:absolute; top:0; bottom:0; border-radius:2px; background:linear-gradient(90deg, #a1c4fd, #c2e9fb); ${getBarStyle(d.min, d.max)}"></div>
            </div>
            <div style="width:30px; font-size:16px; font-weight:500; text-align:right;">${d.max}°</div>
          </div>`,
            )
            .join("")}
        </div>
      </div>
      
      <div style="position:absolute; bottom:0; left:0; right:0; height:84px; background:rgba(255,255,255,0.1); backdrop-filter:blur(20px); display:flex; justify-content:space-between; align-items:center; padding:0 24px; z-index:10;"><svg onclick="toastDev()" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fff" stroke-width="1.8"><path d="M9 20l-5.5 2.5V6L9 3.5M9 20l6-2.5M9 20V3.5M15 17.5l5.5 2.5V8L15 5.5M15 17.5V5.5"/></svg><div style="display:flex; gap:8px;"><div style="width:8px; height:8px; border-radius:50%; background:#fff;"></div><div style="width:8px; height:8px; border-radius:50%; background:rgba(255,255,255,0.4);"></div></div><svg onclick="toastDev()" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg></div>
    </div>`,
  };
};
/* ==========================================
   4. 录音 (Recorder)
   ========================================== */
const RECORDER_DATA = [
  {
    id: 0,
    title: "城许路",
    date: "星期日",
    time: "04:19",
    src: "./data/music/boli.mp3",
  },
  {
    id: 1,
    title: "竹园弄",
    date: "2025年4月1日",
    time: "02:14",
    src: "./data/music/boli.mp3",
  },
  {
    id: 2,
    title: "235国道",
    date: "2024年6月11日",
    time: "00:26",
    src: "./data/music/boli.mp3",
  },
  {
    id: 3,
    title: "运溪路",
    date: "2024年1月31日",
    time: "01:44",
    src: "./data/music/boli.mp3",
  },
  {
    id: 4,
    title: "东莲街",
    date: "2023年4月22日",
    time: "00:14",
    src: "./data/music/boli.mp3",
  },
];
let currentRecorderId = -1,
  recorderProgressTimer = null;

window.playRecorder = function (id) {
  const data = RECORDER_DATA.find((r) => r.id === id);
  if (!data || typeof PLAYER === "undefined" || !PLAYER) return;
  if (currentRecorderId === id && !PLAYER.paused) {
    PLAYER.pause();
    currentRecorderId = -1;
    show("recorder");
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
    show("recorder");
    if (typeof resumeBGM === "function") resumeBGM();
  };
  PLAYER.play().catch((e) => console.warn("录音播放失败:", e));
  show("recorder");
};
window.seekRecorder = function (offset) {
  if (typeof PLAYER === "undefined" || currentRecorderId === -1) return;
  let t = (PLAYER.currentTime || 0) + offset;
  if (t < 0) t = 0;
  PLAYER.currentTime = t;
};
function tickRecorderProgress() {
  if (
    typeof view === "undefined" ||
    view !== "recorder" ||
    currentRecorderId === -1
  ) {
    clearInterval(recorderProgressTimer);
    return;
  }
  const bar = document.getElementById(`rec-bar-${currentRecorderId}`);
  const timeNow = document.getElementById(`rec-time-now-${currentRecorderId}`);
  const timeLeft = document.getElementById(
    `rec-time-left-${currentRecorderId}`,
  );
  if (!bar || !timeNow || !timeLeft) return;
  let cur = PLAYER.currentTime || 0;
  let dur = PLAYER.duration;
  if (isNaN(dur) || dur === Infinity || dur === 0) dur = 15;
  if (cur > dur) cur = dur;
  bar.value = (cur / dur) * 100;
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
  if (currentRecorderId !== -1 && PLAYER && !PLAYER.paused)
    recorderProgressTimer = setInterval(tickRecorderProgress, 100);
  const listHTML = RECORDER_DATA.map((r) => {
    const isActive = currentRecorderId === r.id;
    if (isActive) {
      const currentIcon = PLAYER.paused ? G.recPlay : G.recPause;
      return `<div style="padding: 16px 0; border-bottom: 0.5px solid #e5e5ea; display: flex; flex-direction: column;"><div style="padding: 0 16px;"><div style="font-size: 22px; font-weight: 400; color: #111; margin-bottom: 4px;">${esc(r.title)}</div><div style="font-size: 14px; color: #8e8e93;">${r.date}</div></div><div style="padding: 20px 16px 10px;"><input type="range" id="rec-bar-${r.id}" min="0" max="100" value="0" style="width: 100%; accent-color: #8e8e93; height: 4px;"><div style="display: flex; justify-content: space-between; font-size: 11px; color: #8e8e93; margin-top: 6px;"><span id="rec-time-now-${r.id}">0:00</span><span id="rec-time-left-${r.id}">-${r.time}</span></div></div><div style="padding: 10px 16px; display: flex; justify-content: space-between; align-items: center;"><div onclick="event.stopPropagation();toastDev()" style="color: #007aff; cursor: pointer; padding: 8px;">${G.recList}</div><div style="display: flex; align-items: center; gap: 30px;"><div onclick="event.stopPropagation();seekRecorder(-15)" style="cursor: pointer;">${G.recSeekBack}</div><div onclick="event.stopPropagation();playRecorder(${r.id})" style="cursor: pointer; color: #111;">${currentIcon}</div><div onclick="event.stopPropagation();seekRecorder(15)" style="cursor: pointer;">${G.recSeekFwd}</div></div><div onclick="event.stopPropagation();toastDev()" style="color: #007aff; cursor: pointer; padding: 8px;">${G.recTrash}</div></div></div>`;
    } else {
      return `<div onclick="playRecorder(${r.id})" style="padding: 16px; border-bottom: 0.5px solid #e5e5ea; display: flex; justify-content: space-between; align-items: center; cursor: pointer;"><div style="display: flex; flex-direction: column; gap: 4px;"><span style="font-size: 18px; font-weight: 400; color: #111;">${esc(r.title)}</span><span style="font-size: 14px; color: #8e8e93;">${r.date}</span></div><span style="font-size: 14px; color: #8e8e93; font-variant-numeric: tabular-nums;">${r.time}</span></div>`;
    }
  }).join("");
  return {
    cls: "recorder-page",
    html:
      navHTML({
        title: "所有录音",
        back: "",
        backFn: "closeApp()",
        solid: true,
        right: `<span onclick="toastDev()" style="color:#007aff; font-size:17px;">编辑</span>`,
      }) +
      `<style>.recorder-page .nav { height: 130px !important; padding-top: 64px !important; } .recorder-page .nb-title { font-size: 24px !important; font-weight: 700 !important; } .recorder-page .scroll { padding-top: 130px !important; }</style><div class="scroll" style="background:#fff; padding-bottom:140px;"><div style="padding: 0 13px;">${listHTML}</div></div><div style="position: absolute; bottom: 0; left: 0; right: 0; height: 120px; background: #fff; border-top: 0.5px solid #e5e5ea; display: flex; justify-content: center; align-items: flex-start; padding-top: 16px; z-index: 10; padding-bottom: env(safe-area-inset-bottom);"><button onclick="toastDev()" style="width: 64px; height: 64px; border-radius: 50%; border: 2px solid #d1d1d6; background: transparent; display: flex; justify-content: center; align-items: center; padding: 0; cursor: pointer;"><div style="width: 52px; height: 52px; background: #ff3b30; border-radius: 50%;"></div></button></div>`,
  };
};

/* ==========================================
   5. 日历 (Calendar)
   ========================================== */
window.calEvents = function () {
  if (calMonth === 11)
    return selectedDay === 16 ? ["🎂 19岁生日"] : events[selectedDay] || [];
  return events[selectedDay] || [];
};
window.calNav = function (d) {
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
};
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
    window
      .calEvents()
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
      `<div class="scroll" style="padding-bottom:120px"><div style="display:flex;justify-content:space-between;align-items:center;margin:0 16px 8px"><h1 class="lt" style="margin:0">${fmtMonth(calMonth)}</h1><span style="display:flex;gap:26px;color:var(--blue)"><button style="width:22px" onclick="window.calNav(-1)">${G.chevLb}</button><button style="width:22px" onclick="window.calNav(1)">${G.chevRb}</button></span></div><div class="cal-g cal-w">${wdNarrow()
        .map((w) => `<div>${w}</div>`)
        .join(
          "",
        )}</div><div class="cal-g" id="calg">${c}</div><div style="border-top:.5px solid var(--sep);margin-top:4px;padding-top:4px">${ev}</div></div><div class="tabbar" style="color:#ff3b30">${["今天", "日历", "收件箱"].map((x) => `<button onclick="toastDev()" style="color:#ff3b30;font-size:16px;justify-content:center">${x}</button>`).join("")}</div>`,
  };
};

/* ==========================================
   6. 时钟 (Clock)*/
 
   if (typeof window.clockTab === "undefined") window.clockTab = "world";
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
  const bottomTabHTML = `<div style="position:absolute; bottom:34px; left:16px; right:16px; background:#1c1c1e; border-radius:40px; display:flex; padding:8px; z-index:100; box-shadow:0 4px 20px rgba(0,0,0,0.5);">${tabs
    .map((t) => {
      const isActive = window.clockTab === t.id;
      const color = isActive ? "#ff9f0a" : "#fff";
      const bg = isActive ? "rgba(255, 159, 10, 0.15)" : "transparent";
      return `<button onclick="window.switchClockTab('${t.id}')" style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; border:none; background:${bg}; border-radius:30px; color:${color}; padding:8px 0; transition: background 0.2s;"><span style="width:24px; height:24px; display:grid; place-items:center;">${t.icon.replace("<svg", '<svg width="100%" height="100%" stroke="currentColor" fill="none" stroke-width="1.6"')}</span><small style="font-size:10px; font-weight:500;">${t.label}</small></button>`;
    })
    .join("")}</div>`;
  let contentHTML = "";
  
  if (window.clockTab === "world") {
    const cities = [
      { name: "戛纳", utc: 1 },
      { name: "巴黎", utc: 1 },
      { name: "釜山", utc: 9 },
      { name: "北京", utc: 8 },
      { name: "利雅得", utc: 3 },
    ];
    contentHTML = `<div class="scroll" style="padding-top:60px; padding-bottom:120px;"><div style="display:flex; justify-content:space-between; align-items:center; padding: 0 16px 20px;"><button onclick="toastDev()" style="background:#2c2c2e; color:#fff; border-radius:20px; padding:8px 16px; border:none; font-size:15px; font-weight:500;">编辑</button><button onclick="toastDev()" style="background:#2c2c2e; color:#fff; border-radius:50%; width:36px; height:36px; display:grid; place-items:center; border:none;">${G.plus.replace("<svg", '<svg width="20" height="20"')}</button></div><h1 style="margin: 0 16px 10px; font-size:34px; font-weight:700; color:#fff; letter-spacing:0.5px;">世界时钟</h1><div style="padding: 0 16px;">${cities
      .map((c) => {
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
        const timeStr = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        const diff = c.utc - 8;
        const diffStr =
          diff === 0 ? "当前时间" : (diff > 0 ? "+" : "") + diff + "小时";
        return `<div style="border-bottom: 0.5px solid #333; padding: 16px 0 20px; display:flex; justify-content:space-between; align-items:center;"><div><div style="font-size:24px; font-weight:500; color:#fff; margin-bottom:4px; letter-spacing:0.5px;">${c.name}</div><div style="font-size:13px; color:#8e8e93; font-weight:500;">${dayStr} ${diffStr}</div></div><div style="font-size:62px; font-weight:100; color:#fff; line-height:1; letter-spacing:-1px;">${timeStr}</div></div>`;
      })
      .join("")}</div></div>`;
  } else if (window.clockTab === "alarm") {
    const alarms = [
      { time: "07:30", label: "起床练功", on: true },
      { time: "09:00", label: "声乐课", on: true },
      { time: "13:30", label: "午休", on: false }, 
      { time: "18:00", label: "舞蹈排练", on: true }
    ];
    contentHTML = `<div class="scroll" style="padding-top:60px; padding-bottom:120px;"><div style="display:flex; justify-content:space-between; align-items:center; padding: 0 16px 20px;"><button onclick="toastDev()" style="background:#2c2c2e; color:#fff; border-radius:20px; padding:8px 16px; border:none; font-size:15px; font-weight:500;">编辑</button><button onclick="toastDev()" style="background:#2c2c2e; color:#fff; border-radius:50%; width:36px; height:36px; display:grid; place-items:center; border:none;">${G.plus.replace("<svg", '<svg width="20" height="20"')}</button></div><h1 style="margin: 0 16px 24px; font-size:34px; font-weight:700; color:#fff; letter-spacing:0.5px;">闹钟</h1><div style="margin: 0 16px;">${alarms.map(a => `
      <div style="border-bottom:0.5px solid #333; padding:16px 0; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div class="a-time" style="font-size:56px; font-weight:100; color:${a.on ? '#fff' : '#666'}; line-height:1; letter-spacing:-1px; transition: color 0.2s;">${a.time}</div>
          <div class="a-lbl" style="font-size:15px; color:${a.on ? '#fff' : '#666'}; margin-top:4px; transition: color 0.2s;">${a.label}</div>
        </div>
        <!-- 👇 直接用原生 .sw 类，删除多余的 div，加上 class 控制文字颜色 -->
        <div class="sw ${a.on ? 'on' : ''}" onclick="this.classList.toggle('on'); const isOn = this.classList.contains('on'); const p = this.parentElement; p.querySelector('.a-time').style.color = isOn ? '#fff' : '#666'; p.querySelector('.a-lbl').style.color = isOn ? '#fff' : '#666'; vib(8);"></div>
      </div>
    `).join("")}</div></div>`;
  } else if (window.clockTab === "stopwatch") {
    contentHTML = `<div class="scroll" style="padding-top:100px; padding-bottom:120px; display:flex; flex-direction:column; align-items:center;"><div style="font-size:86px; font-weight:100; color:#fff; font-variant-numeric:tabular-nums; letter-spacing:-3px;">00:00<span style="font-size:40px; margin-left:4px; font-weight:200;">.00</span></div><div style="display:flex; justify-content:space-around; width:100%; margin-top:60px; padding: 0 30px;"><button onclick="toastDev()" style="width:86px; height:86px; border-radius:50%; background:#333; color:#fff; font-size:17px; border:none; font-weight:500;">计次</button><button onclick="toastDev()" style="width:86px; height:86px; border-radius:50%; background:#0a3a22; color:#30d158; font-size:17px; border:none; font-weight:500;">启动</button></div></div>`;
  } else if (window.clockTab === "timer") {
    contentHTML = `<div class="scroll" style="padding-top:100px; padding-bottom:120px; display:flex; flex-direction:column; align-items:center;"><div style="width:280px; height:280px; border-radius:50%; border:6px solid #333; display:flex; align-items:center; justify-content:center; position:relative; margin-bottom:40px;"><div style="font-size:76px; font-weight:100; color:#fff;">5:00</div></div><div style="display:flex; justify-content:space-around; width:100%; padding: 0 30px;"><button onclick="toastDev()" style="width:86px; height:86px; border-radius:50%; background:#333; color:#fff; font-size:17px; border:none; font-weight:500;">取消</button><button onclick="toastDev()" style="width:86px; height:86px; border-radius:50%; background:#0a3a22; color:#30d158; font-size:17px; border:none; font-weight:500;">启动</button></div></div>`;
  }
  return { cls: "dark", dark: true, html: contentHTML + bottomTabHTML };
};
/* ==========================================
   7. 备忘录 (Notes)
   ========================================== */
let noteId = 0;
(function initNotesApp() {
  function parseNoteDate(d, full) {
    if (!d || typeof d !== "string") return "";
    const parts = d.split("-").map(Number);
    if (parts.length < 3 || parts.some(isNaN)) return d;
    const [y, m, dd] = parts;
    if (full) return fmtYMD(y, m, dd);
    if (d === "2026-11-15") return "23:09";
    if (d === "2026-11-14") return "昨天";
    const diff = (new Date(2026, 11, 15) - new Date(y, m - 1, dd)) / 864e5;
    if (diff < 7) return wdLong(y, m, dd);
    return fmtNum(y, m, dd);
  }
  const renderRow = (n, i) => {
    if (!n || n.length < 4) return "";
    return `<button class="row tap" onclick="noteId=${i};push('note')"><b>${esc(n[0])}</b><small><em>${parseNoteDate(n[3])}</em>${esc(n[1])}</small></button>`;
  };
  VIEWS.notes = () => {
    const safeNotes =
      typeof notes !== "undefined" && Array.isArray(notes) ? notes : [];
    return {
      cls: "grouped notes-pg",
      html:
        navHTML({ title: "备忘录", back: "文件夹", right: G.dots }) +
        `<div class="scroll"><h1 class="lt">备忘录</h1><div class="srch">${G.search}搜索</div><div class="gh" style="margin-top:8px">📌 置顶</div><div class="group note-l">${safeNotes
          .slice(0, 3)
          .map((n, i) => renderRow(n, i))
          .join(
            "",
          )}</div><div class="gh">备忘录</div><div class="group note-l">${safeNotes
          .slice(3)
          .map((n, i) => renderRow(n, i + 3))
          .join(
            "",
          )}</div></div><div class="toolbar"><span style="width:24px"></span><span style="color:#000;align-self:center;font-size:11px">${safeNotes.length}个备忘录</span>${G.compose}</div>`,
    };
  };
  VIEWS.note = () => {
    const safeNotes =
      typeof notes !== "undefined" && Array.isArray(notes) ? notes : [];
    const n = safeNotes[noteId];
    if (!n || n.length < 4)
      return {
        cls: "notes-pg",
        html:
          navHTML({ title: "备忘录", back: "备忘录" }) +
          `<div class="scroll" style="text-align:center; padding-top:100px; color:#999;">备忘录不存在</div>`,
      };
    return {
      cls: "notes-pg",
      html:
        navHTML({
          title: "",
          back: "备忘录",
          right: G.share + G.dots,
          solid: false,
        }) +
        `<div class="scroll"><div class="note-v"><div class="nd">${parseNoteDate(n[3], true)}</div><h2>${esc(n[0])}</h2>${esc(n[2])}</div></div><div class="toolbar">${G.check}${G.camera}${G.pen}${G.compose}</div>`,
    };
  };
})();

/* ==========================================
   8. 媒体查看器 (Media Viewer)
   ========================================== */
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
    d.innerHTML = `<div style="position:absolute; top:50px; left:20px; color:#fff; font-size:30px; cursor:pointer; padding:10px; z-index:10;" onclick="this.parentElement.remove()">×</div><div style="position:absolute; top:54px; right:20px; color:#fff; font-size:14px; opacity:0.8; z-index:10;">${globalViewerList.length > 1 ? globalViewerIndex + 1 + " / " + globalViewerList.length : ""}</div><div id="gmv-container" style="width:100%; height:80%; display:flex; align-items:center; justify-content:center; transition:transform 0.3s ease-out;">${isVideo ? `<video src="${url}" controls autoplay playsinline style="max-width:100%; max-height:100%; border-radius:8px;"></video>` : `<img src="${url}" style="max-width:100%; max-height:100%; object-fit:contain;">`}</div>`;
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

/* ==========================================
   9. 占位 App
   ========================================== */
const placeholderView = (title) => () => ({
  html:
    navHTML({ title: title, back: "主页", backFn: "closeApp()" }) +
    `<div class="scroll" style="display:flex;align-items:center;justify-content:center;height:80vh;color:#8e8e93;font-size:15px">暂无内容</div>`,
});
VIEWS.settings = placeholderView("设置");
VIEWS.instagram = placeholderView("Instagram");
