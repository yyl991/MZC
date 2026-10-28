"use strict";

/* ==========================================
   1. 电话 & 通话
   ========================================== */
window._callHits = window._callHits || {};
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

/* ---- 电话 App：分页 / 联系人 / 拨号盘 ---- */
let phoneTab = "recent";
let phoneEditMode = false;
let dialBuf = "";
const PHONE_FAV = ["穆祉丞", "MuAMuA", "穆小恩"];
const PHONE_VM = [
  { from: "穆祉丞", time: "今天 23:02", dur: "0:14" },
  { from: "MuAMuA", time: "今天 23:05", dur: "0:09" },
];

function phoneContacts() {
  const out = [];
  const add = (n) => {
    if (!n) return;
    const name = String(n).replace(/ \(\d+\)$/, "");
    if (name && !out.includes(name)) out.push(name);
  };
  (typeof chatNames !== "undefined" ? chatNames : []).forEach(add);
  (typeof calls !== "undefined" ? calls : []).forEach((c) => add(c[0]));
  typeof extraCalls !== "undefined" && extraCalls.forEach((c) => add(c[0]));
  return out;
}
function phoneAvatar(n, size) {
  const s = size || 44;
  const r = window.CFG && CFG.roles && CFG.roles[n];
  const box = `width:${s}px;height:${s}px;border-radius:50%;overflow:hidden;flex:none;display:inline-grid;place-items:center;`;
  if (r && r.avatar)
    return `<span style="${box}background:#d8dbe0"><img src="${r.avatar}" style="width:100%;height:100%;object-fit:cover"></span>`;
  const ch = (r && r.initial) || dn(n).slice(0, 1) || "?";
  return `<span style="${box}background:#b9bec7;color:#fff;font-weight:600;font-size:${Math.round(s * 0.38)}px">${esc(ch)}</span>`;
}
function phoneRow(n, sub, right, onclick, extra) {
  return `<div class="prow" data-name="${esc(n)}" style="cursor:pointer;${extra || ""}" onclick="${onclick}">${phoneAvatar(n, 40)}<div class="pn"><b>${esc(dn(n))}</b><small>${sub}</small></div>${right || ""}</div>`;
}

window.setPhoneTab = function (t) {
  phoneTab = t;
  phoneEditMode = false;
  vib(6);
  show("phone");
};
window.phoneToggleEdit = function () {
  phoneEditMode = !phoneEditMode;
  vib(6);
  show("phone");
};
window.phoneFilter = function (q) {
  const k = (q || "").trim();
  document.querySelectorAll("#appL .prow[data-name]").forEach((row) => {
    const n = row.dataset.name || "";
    row.style.display = !k || n.includes(k) ? "" : "none";
  });
};
window.phoneDelCall = function (name, time) {
  [extraCalls, calls].forEach((arr) => {
    const i = arr.findIndex(
      (c) => String(c[0]) === String(name) && String(c[1]) === String(time),
    );
    if (i >= 0) arr.splice(i, 1);
  });
  vib([10, 40, 10]);
  show("phone");
};
window.phoneContactMenu = function (name) {
  if (typeof wxActionSheet !== "function") return dial(name);
  wxActionSheet(dn(name), [
    { label: "呼叫", onClick: () => dial(name) },
    { label: "发信息", onClick: () => composeSms(name) },
    { label: "微信", onClick: () => openWxChatFromPhone(name) },
  ]);
};
window.openWxChatFromPhone = function (name) {
  if (typeof openChat === "function" && chatData && chatData[name]) {
    openChat(name);
  } else toastDev("微信里没有这个联系人");
};
window.phoneDialKey = function (k) {
  if (k === "call") {
    const n = dialBuf.trim();
    if (!n) return;
    dialBuf = "";
    const el = document.getElementById("phoneDialNum");
    if (el) el.textContent = "";
    checkDialBtn();
    return dial(n);
  }
  if (k === "del") dialBuf = dialBuf.slice(0, -1);
  else if (dialBuf.length < 16) dialBuf += k;
  const el = document.getElementById("phoneDialNum");
  if (el) el.textContent = dialBuf;
  vib(5);
  checkDialBtn();
};
function checkDialBtn() {
  const b = document.getElementById("phoneCallBtn");
  if (b) b.style.opacity = dialBuf ? "1" : ".35";
}
window.phonePlayVm = function (el, i) {
  const vm = PHONE_VM[i];
  if (!vm) return;
  window._vm = window._vm || new Audio();
  const a = window._vm;
  if (!a.paused && a.dataset.on === String(i)) {
    a.pause();
    el.textContent = "▶";
    return;
  }
  a.dataset.on = String(i);
  a.src = "./data/album/boli.mp3";
  a.currentTime = 0;
  a.play().catch(() => {});
  el.textContent = "❚❚";
  a.onended = () => {
    el.textContent = "▶";
  };
};

VIEWS.phone = () => {
  const all = [...extraCalls, ...calls].filter(
    (c) => !missOnly || c[2] === "未接来电",
  );
  const tabs = [
    ["star", "收藏", "setPhoneTab('fav')"],
    ["clock", "最近通话", "setPhoneTab('recent')"],
    ["contacts", "通讯录", "setPhoneTab('contacts')"],
    ["keypad", "拨号键盘", "setPhoneTab('keypad')"],
    ["voicemail", "语音留言", "setPhoneTab('vm')"],
  ];
  const tabIdx = { fav: 0, recent: 1, contacts: 2, keypad: 3, vm: 4 }[phoneTab];
  let head = "";
  let body = "";

  if (phoneTab === "recent") {
    head = `<div class="nav"><button onclick="phoneToggleEdit()" style="color:var(--blue);font-size:17px;justify-self:start;padding-left:8px">${phoneEditMode ? "完成" : "编辑"}</button>${
      phoneEditMode
        ? '<span></span>'
        : `<div class="seg"><button class="${missOnly ? "" : "on"}" onclick="missOnly=false;show('phone')">全部</button><button class="${missOnly ? "on" : ""}" onclick="missOnly=true;show('phone')">未接来电</button></div>`
    }<span></span></div>`;
    body = `<h1 class="lt">最近通话</h1><div class="srch">${G.search}<input placeholder="搜索" style="border:0;background:transparent;outline:none;font-size:16px;flex:1;margin-left:6px" oninput="phoneFilter(this.value)"></div>${all
      .map((c) => {
        const nm = String(c[0]).replace(/ \(\d+\)$/, "");
        if (phoneEditMode)
          return phoneRow(
            nm,
            "手机",
            `<button style="width:64px;height:62px;color:#ff3b30;font-size:16px;background:none" onclick="event.stopPropagation();phoneDelCall('${esc(nm)}','${esc(c[1])}')">删除</button>`,
            "",
          );
        return `<div class="prow ${c[2] === "未接来电" ? "miss" : ""}" data-name="${esc(nm)}" style="cursor:pointer" onclick="dial('${esc(nm)}')"><span class="pi">${c[2] === "呼出" ? G.handset : ""}</span><div class="pn"><b>${esc(callNameDisp(nm))}</b><small>${c[2]}</small></div><span class="pd">${callWhen(c[1])}</span><span class="inf">${G.info}</span></div>`;
      })
      .join("")}`;
  } else if (phoneTab === "contacts") {
    const list = phoneContacts();
    head = `<div class="nav"><span></span><div class="nb-title">通讯录</div><button onclick="phoneToggleEdit()" style="color:var(--blue);font-size:17px;justify-self:end;padding-right:12px">${list.length}</button></div>`;
    body = `<h1 class="lt">所有联系人</h1><div class="srch">${G.search}<input placeholder="搜索" style="border:0;background:transparent;outline:none;font-size:16px;flex:1;margin-left:6px" oninput="phoneFilter(this.value)"></div>${list
      .map((n) =>
        phoneRow(n, "手机", "", "phoneContactMenu(this.dataset.name)"),
      )
      .join("")}`;
  } else if (phoneTab === "fav") {
    head = `<div class="nav"><span></span><div class="nb-title">个人收藏</div><span></span></div>`;
    body = `<h1 class="lt">收藏</h1>${PHONE_FAV.map((n) =>
      phoneRow(n, "手机", "", "phoneContactMenu(this.dataset.name)"),
    ).join("")}`;
  } else if (phoneTab === "vm") {
    head = `<div class="nav"><span></span><div class="nb-title">语音留言</div><span></span></div>`;
    body = `<h1 class="lt">语音留言</h1>${PHONE_VM.map(
      (v, i) => `<div class="prow"><button style="width:40px;height:40px;border-radius:50%;background:#eef0f3;color:#007aff;font-size:14px;flex:none" onclick="phonePlayVm(this,${i})">▶</button><div class="pn"><b>${esc(v.from)}</b><small>${v.dur}</small></div><span class="pd">${v.time}</span></div>`,
    ).join("")}`;
  } else {
    head = `<div class="nav"><span></span><div class="nb-title">拨号键盘</div><span></span></div>`;
    const keys = [
      ["1", ""],
      ["2", "ABC"],
      ["3", "DEF"],
      ["4", "GHI"],
      ["5", "JKL"],
      ["6", "MNO"],
      ["7", "PQRS"],
      ["8", "TUV"],
      ["9", "WXYZ"],
      ["*", ""],
      ["0", "+"],
      ["#", ""],
    ];
    body = `<div id="phoneDialNum" style="min-height:62px;font-size:34px;letter-spacing:2px;text-align:center;padding-top:26px;color:#111;word-break:break-all"></div>
      <div style="display:grid;grid-template-columns:repeat(3,74px);gap:12px 24px;justify-content:center;margin-top:14px">${keys
        .map(
          ([k, sub]) =>
            `<button onclick="phoneDialKey('${k}')" style="width:74px;height:74px;border-radius:50%;background:#f2f2f5;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px"><span style="font-size:30px;font-weight:400;line-height:1">${k}</span><span style="font-size:9px;letter-spacing:1.5px;color:#8e8e93;height:10px">${sub}</span></button>`,
        )
        .join("")}</div>
      <div style="display:flex;align-items:center;justify-content:center;gap:34px;margin-top:16px">
        <span style="width:74px"></span>
        <button id="phoneCallBtn" onclick="phoneDialKey('call')" style="width:74px;height:74px;border-radius:50%;background:#34c759;color:#fff;display:grid;place-items:center;opacity:.35">${G.handset}</button>
        <button onclick="phoneDialKey('del')" style="width:74px;height:74px;background:none;color:#333;font-size:22px;display:grid;place-items:center">⌫</button>
      </div>`;
  }
  return {
    html: `${head}<div class="scroll" style="padding-bottom:110px">${body}</div>${tabbar(tabs, tabIdx || 0)}`,
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
  window._callHits[callName] = 0;
  callStart = Date.now();
  capIdx = -1;
  renderCall();
};
window.declineCall = function () {
  stopRing();
  callState = "";
  declined++;
  const who = callName;
  extraCalls.unshift([callName, "今天 " + gameTime24(), "未接来电"]);
  closeCallUI();
  window.scheduleCallAgain(who, "miss");
};
window.missCall = function () {
  if (callState !== "ring") return;
  stopRing();
  callState = "";
  declined++;
  const who = callName;
  extraCalls.unshift([callName, "今天 " + gameTime24(), "未接来电"]);
  closeCallUI();
  window.scheduleCallAgain(who, "miss");
};
/* ---------- 挂断追命系统 ----------
   mode: "miss" 没接/拒接 | "hangup" 接通后挂断 */
function callChatData(name) {
  return (typeof chatData !== "undefined" && chatData[name]) || [];
}
function lastMsgFromMe(name) {
  const arr = callChatData(name);
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i][1] === "date") continue;
    return arr[i][1] === "me";
  }
  return false;
}
function botSay(name, text) {
  if (lastMsgFromMe(name)) return;
  if (typeof chatData === "undefined" || !chatData[name]) return;
  chatData[name].push([
    text,
    "them",
    typeof nowAmpm === "function" ? nowAmpm() : "",
  ]);
  if (typeof saveChat === "function") saveChat();
  if (typeof view !== "undefined" && view === "chat" && chatId === name) {
    if (typeof refreshChat === "function") refreshChat(true);
    if (typeof scrollChat === "function") scrollChat();
  }
  if (typeof notifyFrom === "function") notifyFrom(name, text);
}
const CALL_NAG = {
  miss: [
    "？",
    "为什么不接电话",
    "你在哪",
    "接一下行不行",
    "我都打第几遍了",
    "别装作没看见",
    "电话都不接了是吗",
  ],
  hangup: [
    "喂？",
    "怎么把我电话挂了",
    "刚刚不是接通了吗",
    "人呢",
    "你把我挂了",
    "挂我电话算什么",
  ],
};
const CALL_ANGRY = ["行，不打了。", "随便你吧。", "……好。", "我等你主动找我。"];
window._lastNag = window._lastNag || {};
window.scheduleCallAgain = function (name, mode) {
  if (!name) return;
  // 已经回过消息就不再追命
  if (lastMsgFromMe(name)) return;
  const n = (window._callHits[name] || 0) + 1;
  window._callHits[name] = n;
  const isMzc = name === "穆祉丞";
  const maxHit = isMzc ? 5 : 3;
  if (n > maxHit) {
    // 挂太多次，对方生气收手
    botSay(name, CALL_ANGRY[Math.floor(Math.random() * CALL_ANGRY.length)]);
    return;
  }
  const texts = CALL_NAG[mode] || CALL_NAG.miss;
  const last = window._lastNag[name];
  const pool = texts.filter((t) => t !== last);
  const line = pool[Math.floor(Math.random() * pool.length)] || texts[0];
  window._lastNag[name] = line;
  botSay(name, line);
  const wait = isMzc ? 2500 + n * 900 : 5000 + n * 1500;
  setTimeout(() => {
    if (callState) return;
    if (lastMsgFromMe(name)) return;
    incomingCallFrom(name);
  }, wait);
};

// 你打给谁，对方都会回拨过来
window.scheduleCallBack = function (name) {
  if (!name) return;
  clearTimeout(window._callBackTo);
  window._callBackTo = setTimeout(() => {
    if (callState) return;
    incomingCallFrom(name);
  }, 3000);
};
window.endCall = function () {
  if (typeof closeDialpad === "function") closeDialpad();
  const wasOut = callDir === "out";
  const outName = callName;
  if (callState === "dialing") {
    clearInterval(rbIv);
    callState = "";
    extraCalls.unshift([callName, "今天 " + gameTime24(), "呼出"]);
    closeCallUI();
    if (view === "phone") show("phone");
    if (wasOut) window.scheduleCallBack(outName);
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
  const secs = Math.floor((Date.now() - callStart) / 1000);
  const inName = callName;
  setTimeout(() => {
    callState = "";
    closeCallUI();
    if (view === "phone") show("phone");
  }, 1100);
  if (wasOut) window.scheduleCallBack(outName);
  else if (secs < 8) window.scheduleCallAgain(inName, "hangup");
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
    navHTML({
      title: "信息",
      back: "主页",
      backFn: "closeApp()",
      right: `<span onclick="smsComposeMenu()" style="color:#007aff; display:flex;">${G.smsCompose}</span>`,
    }) +
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
        right: `<span onclick="dial('${esc(data.name)}')" style="color:#007aff; display:flex;">${G.handset}</span>`,
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
        )}</div><div style="position:absolute; bottom:34px; left:16px; right:16px; display:flex; align-items:flex-end; gap:12px;"><div onclick="smsComposeMenu()" style="width:36px; height:36px; background:#fff; border-radius:50%; display:grid; place-items:center; color:#333; font-size:24px; font-weight:300; margin-bottom:2px; cursor:pointer; box-shadow:0 1px 4px rgba(0,0,0,0.08);">+</div><div style="flex:1; background:#fff; height:38px; border-radius:19px; display:flex; align-items:center; gap:8px; padding:0 6px 0 14px; box-shadow:0 1px 4px rgba(0,0,0,0.05);"><input id="smsInput" placeholder="信息 · RCS" onkeydown="if(event.key==='Enter')sendSms()" style="flex:1; border:0; outline:none; background:transparent; font-size:15px; min-width:0"><button onclick="sendSms()" style="width:26px; height:26px; border-radius:50%; background:#007aff; color:#fff; display:grid; place-items:center; font-size:15px; flex:none">↑</button></div></div>`,
  };
};

/* ---- 短信：新建会话 / 发送 / 选联系人 ---- */
window.composeSms = function (name) {
  let data = smsData.find((d) => d.name === name);
  if (!data) {
    data = {
      id: Date.now(),
      name: name,
      tag: "短信",
      text: "",
      time: "刚刚",
      iconText: dn(name).slice(0, 1),
      iconColor: "#34C759",
      unread: false,
      msgs: [],
    };
    smsData.unshift(data);
  }
  data.unread = false;
  currentSmsDetailId = data.id;
  push("sms_detail");
};
window.smsComposeMenu = function () {
  if (typeof wxActionSheet !== "function") return toastDev("暂不支持新建信息");
  const list = (typeof phoneContacts === "function" ? phoneContacts() : []).slice(
    0,
    6,
  );
  wxActionSheet(
    "新信息",
    list.map((n) => ({ label: dn(n), onClick: () => composeSms(n) })),
  );
};
window.sendSms = function () {
  const el = document.getElementById("smsInput");
  if (!el) return;
  const t = el.value.trim();
  if (!t) return;
  const data = smsData.find((d) => d.id === currentSmsDetailId);
  if (!data) return;
  const time =
    typeof nowAmpm === "function" ? nowAmpm() : "刚刚";
  data.msgs.push({ me: true, time: time, text: t, type: "text" });
  data.text = t;
  data.time = "刚刚";
  data.tag = data.tag || "短信";
  el.value = "";
  show("sms_detail");
  const sc = document.querySelector("#appL .scroll");
  if (sc) sc.scrollTop = sc.scrollHeight;
  if (typeof sfx === "function") sfx("send");
  if (typeof vib === "function") vib(8);
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
      
      <div style="position:absolute; top:50px; left:16px; z-index:10; display:flex; align-items:center; gap:4px; font-size:15px; font-weight:500; cursor:pointer;" onclick="closeApp()">${G.backThin} 主屏幕</div>
      
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
            ${G.calSmall} 10 天天气预报
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
      
      <div style="position:absolute; bottom:0; left:0; right:0; height:84px; background:rgba(255,255,255,0.1); backdrop-filter:blur(20px); display:flex; justify-content:space-between; align-items:center; padding:0 24px; z-index:10;"><span onclick="toastDev()" style="display:flex">${G.mapRoad}</span><div style="display:flex; gap:8px;"><div style="width:8px; height:8px; border-radius:50%; background:#fff;"></div><div style="width:8px; height:8px; border-radius:50%; background:rgba(255,255,255,0.4);"></div></div><span onclick="toastDev()" style="display:flex">${G.listWhite}</span></div>
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
    const seg = d.split(" ");
    const parts = seg[0].split("-").map(Number);
    const hhmm = seg[1] || "";
    if (parts.length < 3 || parts.some(isNaN)) return d;
    const [y, m, dd] = parts;
    if (full)
      return fmtYMD(y, m, dd) + (hhmm ? " " + hhmm : "");
    // 游戏内的今天（11.15 23:09 之后跨到 11.16 零点）
    if (y === 2026 && m === 11 && dd === 15) return hhmm || "23:09";
    if (y === 2026 && m === 11 && dd === 16) return hhmm || "00:00";
    if (y === 2026 && m === 11 && dd === 14) return "昨天";
    const diff = (new Date(2026, 11, 15) - new Date(y, m - 1, dd)) / 864e5;
    if (diff < 7) return wdLong(y, m, dd);
    return fmtNum(y, m, dd);
  }
  // 备忘录用「游戏内系统时间」，不是固定 23:09
  window.noteNow = function () {
    let mins = 1389; // 23:09
    if (typeof gameMin === "function") mins = gameMin();
    const day = mins >= 1440 ? 16 : 15;
    const m = mins % 1440;
    return `2026-11-${pad(day)} ${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
  };
  const renderRow = (n, i) => {
    if (!n || n.length < 4) return "";
    return `<button class="row tap note-row" data-note-search="${esc((n[0] + " " + n[1] + " " + n[2]).toLowerCase())}" onclick="noteId=${i};push('note')"><b>${esc(n[0])}</b><small><em>${parseNoteDate(n[3])}</em>${esc(n[1])}</small></button>`;
  };
  VIEWS.notes = () => {
    const safeNotes =
      typeof notes !== "undefined" && Array.isArray(notes) ? notes : [];
    return {
      cls: "grouped notes-pg",
      html:
        navHTML({ title: "备忘录", back: "文件夹", right: G.dots }) +
        `<div class="scroll"><h1 class="lt">备忘录</h1><div class="srch" style="margin:0 16px 14px;">${G.search}<input id="note-search" placeholder="搜索" oninput="filterNotes(this.value)" style="flex:1;min-width:0;border:none;background:transparent;outline:none;font-size:17px;color:inherit;font-family:inherit;"></div><div class="gh" style="margin-top:8px">📌 置顶</div><div class="group note-l">${safeNotes
          .slice(0, 3)
          .map((n, i) => renderRow(n, i))
          .join(
            "",
          )}</div><div class="gh">备忘录</div><div class="group note-l">${safeNotes
          .slice(3)
          .map((n, i) => renderRow(n, i + 3))
          .join(
            "",
          )}</div></div><div class="toolbar"><span style="width:24px"></span><span style="color:#000;align-self:center;font-size:11px">${safeNotes.length}个备忘录</span><span onclick="openNoteEditor(-1)" style="cursor:pointer;">${G.compose}</span></div>`,
    };
  };
  /* ---- 加密备忘录（彩蛋：0913） ---- */
  window._notePinBuf = "";
  window._noteUnlocked = window._noteUnlocked || {};
  const noteDotsHTML = () =>
    [0, 1, 2, 3]
      .map(
        (i) =>
          `<i style="width:13px;height:13px;border-radius:50%;border:1.4px solid #c7c7cc;background:${i < window._notePinBuf.length ? "#111" : "transparent"}"></i>`,
      )
      .join("");
  window.renderNoteDots = function () {
    const el = document.getElementById("note-pdots");
    if (el) el.innerHTML = noteDotsHTML();
  };
  window.pressNotePin = function (num, el) {
    if (window._notePinBuf.length >= 4) return;
    if (el) {
      el.classList.add("dn");
      setTimeout(() => el.classList.remove("dn"), 90);
    }
    if (typeof sfx === "function") sfx("key");
    if (typeof vib === "function") vib(8);
    window._notePinBuf += num;
    window.renderNoteDots();
    if (window._notePinBuf.length < 4) return;
    const pin =
      (CFG.start && (CFG.start.memoPin || CFG.start.notePin)) || "0913";
    if (window._notePinBuf === pin) {
      setTimeout(() => {
        window._noteUnlocked[noteId] = true;
        window._notePinBuf = "";
        show("note", "pop");
      }, 140);
    } else {
      setTimeout(() => {
        if (typeof vib === "function") vib([60, 40, 60]);
        window._notePinBuf = "";
        window.renderNoteDots();
        toastDev("密码不对哦，再想想");
      }, 160);
    }
  };
  window.delNotePin = function () {
    if (window._notePinBuf.length) {
      window._notePinBuf = window._notePinBuf.slice(0, -1);
      window.renderNoteDots();
      if (typeof sfx === "function") sfx("key");
    } else back();
  };
  const noteLockHTML = () => {
    const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const kb = keys
      .map(
        (k) =>
          `<button onclick="pressNotePin('${k}',this)" style="width:72px;height:72px;border-radius:50%;background:#fff;font-size:28px;color:#111;box-shadow:0 1px 3px rgba(0,0,0,.06)">${k}</button>`,
      )
      .join("");
    return `
    <div style="height:100%;display:flex;flex-direction:column;align-items:center;padding-top:10vh;background:#f2f2f7;">
      <div style="width:58px;height:58px;border-radius:15px;background:#fff;display:grid;place-items:center;font-size:26px;box-shadow:0 4px 14px rgba(0,0,0,.08);">🔒</div>
      <div style="margin:16px 0 6px;font-size:17px;font-weight:600;color:#111;">加密备忘录</div>
      <div style="font-size:13px;color:#8e8e93;margin-bottom:26px;">输入密码以查看这条笔记</div>
      <div id="note-pdots" style="display:flex;gap:22px;margin-bottom:34px;">${noteDotsHTML()}</div>
      <div style="display:grid;grid-template-columns:repeat(3,72px);gap:16px 22px;justify-items:center;">
        ${kb}
        <span></span>
        <button onclick="pressNotePin('0',this)" style="width:72px;height:72px;border-radius:50%;background:#fff;font-size:28px;color:#111;box-shadow:0 1px 3px rgba(0,0,0,.06)">0</button>
        <button onclick="delNotePin()" style="width:72px;height:72px;background:none;font-size:22px;color:#111;">⌫</button>
      </div>
      <button onclick="back()" style="margin-top:24px;background:none;border:none;color:#007aff;font-size:16px;padding:8px;">取消</button>
    </div>`;
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
    if (String(n[0]).indexOf("🔒") === 0 && !window._noteUnlocked[noteId]) {
      window._notePinBuf = "";
      return { cls: "notes-pg", html: noteLockHTML() };
    }
    return {
      cls: "notes-pg",
      html:
        navHTML({
          title: "",
          back: "备忘录",
          right: G.share + G.dots,
          solid: false,
        }) +
        `<div class="scroll"><div class="note-v"><div class="nd">${parseNoteDate(n[3], true)}</div><h2>${esc(n[0])}</h2>${esc(n[2])}</div></div><div class="toolbar"><span onclick="deleteNote(${noteId})" style="color:#ff3b30;cursor:pointer;">${G.trash}</span><span style="color:#000;align-self:center;font-size:11px;">${parseNoteDate(n[3])}</span><span onclick="openNoteEditor(${noteId})" style="cursor:pointer;">${G.pen}</span></div>`,
    };
  };
})();

window._noteEditIndex = -1;
window.openNoteEditor = function (idx) {
  window._noteEditIndex = typeof idx === "number" ? idx : -1;
  push("note_edit");
};
window.saveNote = function () {
  const titleEl = document.getElementById("note-edit-title");
  const bodyEl = document.getElementById("note-edit-body");
  const title = (titleEl ? titleEl.value.trim() : "") || "新建备忘录";
  const body = bodyEl ? bodyEl.value.trim() : "";
  const preview = (body.split("\n")[0] || "暂无内容").slice(0, 26);
  const idx = window._noteEditIndex;
  if (idx >= 0 && notes[idx]) {
    notes[idx] = [
      title,
      preview,
      body,
      notes[idx][3] || window.noteNow(),
    ];
  } else {
    notes.unshift([title, preview, body, window.noteNow()]);
  }
  show("notes", "pop");
  toastDev("备忘录已保存");
};
window.deleteNote = function (idx) {
  const doDelete = function () {
    notes.splice(idx, 1);
    show("notes", "pop");
    toastDev("备忘录已删除");
  };
  if (typeof wxActionSheet === "function") {
    wxActionSheet("删除这条备忘录？", [
      { label: "删除", danger: true, onClick: doDelete },
    ]);
  } else if (confirm("删除这条备忘录？")) {
    doDelete();
  }
};
window.filterNotes = function (q) {
  const query = String(q || "").trim().toLowerCase();
  document.querySelectorAll(".note-row").forEach((r) => {
    const hit =
      !query ||
      (r.getAttribute("data-note-search") || "").toLowerCase().includes(query);
    r.style.display = hit ? "" : "none";
  });
};
VIEWS.note_edit = () => {
  const idx = window._noteEditIndex;
  const n = idx >= 0 && notes[idx] ? notes[idx] : ["", "", "", "2026-11-15"];
  return {
    cls: "notes-pg",
    html:
      navHTML({
        title: idx >= 0 ? "编辑备忘录" : "新建备忘录",
        back: "备忘录",
        right: `<span style="color:#007aff;font-size:16px;cursor:pointer;" onclick="saveNote()">保存</span>`,
        solid: true,
      }) +
      `<div class="scroll" style="padding-top:110px;padding-bottom:120px;background:#fff;">
        <input id="note-edit-title" value="${esc(n[0])}" placeholder="标题" style="width:100%;box-sizing:border-box;border:none;outline:none;font-size:24px;font-weight:700;padding:14px 16px 8px;background:transparent;font-family:inherit;color:#111;">
        <textarea id="note-edit-body" placeholder="开始输入..." style="width:100%;box-sizing:border-box;min-height:50vh;border:none;outline:none;font-size:17px;line-height:1.55;padding:8px 16px 120px;background:transparent;resize:none;font-family:inherit;color:#111;">${esc(n[2])}</textarea>
      </div>`,
  };
};

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
/* ==========================================
   10. 设置 App
   ========================================== */
window._phoneSettings = window._phoneSettings || {
  wifi: true,
  bluetooth: true,
  cellular: true,
  airplane: false,
  lowPower: false,
  brightness: 1,
  wallpaper: "./data/app/wallpaper.jpg",
};
try {
  Object.assign(
    window._phoneSettings,
    JSON.parse(localStorage.getItem("phone_settings") || "{}"),
  );
} catch (e) {}

function savePhoneSettings() {
  try {
    localStorage.setItem("phone_settings", JSON.stringify(window._phoneSettings));
  } catch (e) {}
}

function applyPhoneDisplaySettings() {
  const s = window._phoneSettings;
  if (s.brightness && s.brightness < 0.999) {
    const ph = document.getElementById("phone");
    if (ph) ph.style.filter = `brightness(${s.brightness})`;
  }
  if (s.wallpaper) {
    const wall = document.getElementById("wall");
    if (wall) wall.style.backgroundImage = `url('${s.wallpaper}')`;
  }
}
applyPhoneDisplaySettings();

function refreshSettingsView() {
  if (
    ["settings", "settings_display", "settings_wallpaper", "settings_notifications", "settings_about"].indexOf(
      view,
    ) < 0
  )
    return;
  const old = APP.lastElementChild;
  let top = 0;
  if (old) {
    const sc = old.querySelector(".scroll");
    if (sc) top = sc.scrollTop;
  }
  show(view, "none");
  const pg = APP.lastElementChild;
  if (pg) {
    const sc = pg.querySelector(".scroll");
    if (sc) sc.scrollTop = top;
  }
}

window.phoneToggle = function (key, el) {
  const s = window._phoneSettings;
  if (key === "dnd") {
    window.isDnd = !window.isDnd;
    if (el) el.classList.toggle("on", window.isDnd);
    if (typeof updateDndBadge === "function") updateDndBadge();
    vib(8);
    return;
  }
  s[key] = !s[key];
  if (key === "airplane" && s.airplane) {
    s.wifi = false;
    s.bluetooth = false;
    s.cellular = false;
  }
  if (key === "airplane" && !s.airplane) s.cellular = true;
  savePhoneSettings();
  refreshSettingsView();
};

window.setPhoneBrightness = function (v) {
  const s = window._phoneSettings;
  s.brightness = Math.max(0.35, Math.min(1, Number(v) / 100));
  applyPhoneDisplaySettings();
  savePhoneSettings();
};

window.setPhoneWallpaper = function (url) {
  window._phoneSettings.wallpaper = url;
  applyPhoneDisplaySettings();
  savePhoneSettings();
  refreshSettingsView();
};

window.toggleWxNotify = function (el) {
  window._wxNotifyOn = !(window._wxNotifyOn !== false);
  if (el) el.classList.toggle("on", window._wxNotifyOn);
  vib(8);
};

window.toggleMailNotify = function (el) {
  window._mailNotifyOn = !(window._mailNotifyOn !== false);
  if (el) el.classList.toggle("on", window._mailNotifyOn);
  vib(8);
};

window.filterSettings = function (q) {
  const query = String(q || "").trim().toLowerCase();
  const rows = document.querySelectorAll("#settings-scroll [data-settings-row]");
  rows.forEach((r) => {
    const hit =
      !query || (r.getAttribute("data-settings-row") || "").toLowerCase().includes(query);
    r.style.display = hit ? "" : "none";
  });
  document.querySelectorAll("#settings-scroll .group").forEach((g) => {
    const inner = [...g.querySelectorAll("[data-settings-row]")];
    const visible = inner.some((r) => r.style.display !== "none");
    g.style.display = visible ? "" : "none";
  });
};

function settingsIcon(bg, emoji) {
  return `<span style="width:28px;height:28px;border-radius:7px;background:${bg};display:grid;place-items:center;font-size:15px;color:#fff;flex:none;">${emoji}</span>`;
}
function settingsSwitch(on, handler) {
  return `<button class="sw ${on ? "on" : ""}" onclick="${handler}"></button>`;
}
function settingsValue(t) {
  return `<span style="font-size:15px;color:#8e8e93;">${esc(t)}</span>`;
}
function settingsRow(icon, label, right, onclick, search, extraStyle) {
  return `<div class="row ${onclick ? "tap" : ""}" ${onclick ? `onclick="${onclick}"` : ""} data-settings-row="${esc(search || label)}" style="min-height:50px;${extraStyle || ""}">
    ${icon ? `<span style="width:28px;display:flex;justify-content:center;flex:none;">${icon}</span>` : ""}
    <span style="flex:1;font-size:16px;">${label}</span>
    <span style="display:flex;align-items:center;gap:8px;flex:none;">${right || ""}</span>
  </div>`;
}
function settingsInfoRow(label, value) {
  return `<div class="row" data-settings-row="${esc(label)}" style="min-height:44px;">
    <span style="flex:1;font-size:16px;">${label}</span>
    <span style="color:#8e8e93;font-size:15px;max-width:62%;text-align:right;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(value)}</span>
  </div>`;
}

VIEWS.settings = () => {
  const s = window._phoneSettings;
  const avatar = CFG.myAvatar
    ? `<img src="${CFG.myAvatar}" style="width:56px;height:56px;border-radius:50%;object-fit:cover;flex:none;">`
    : `<div style="width:56px;height:56px;border-radius:50%;background:#e5e5ea;display:grid;place-items:center;flex:none;">${G.sil}</div>`;
  return {
    cls: "grouped",
    html:
      navHTML({ title: "设置", back: "主页", backFn: "closeApp()", solid: true }) +
      `<div class="scroll" id="settings-scroll" style="padding-top:98px;padding-bottom:40px;background:#f2f2f7;">
        <div style="padding:0 16px 12px;">
          <div class="srch" style="margin:0;">${G.search}<input placeholder="搜索" oninput="filterSettings(this.value)" style="flex:1;min-width:0;border:none;background:transparent;outline:none;font-size:17px;color:inherit;font-family:inherit;"></div>
        </div>

        <div class="group" style="margin-bottom:16px;">
          <div class="row tap" data-settings-row="Apple ID iCloud 账号 媒体与购买项目" onclick="toastDev()" style="min-height:70px;">
            ${avatar}
            <div style="flex:1;min-width:0;">
              <div style="font-size:17px;font-weight:500;color:#111;">小狗团汪汪</div>
              <div style="font-size:12px;color:#8e8e93;margin-top:3px;">Apple ID、iCloud、媒体与购买项目</div>
            </div>
            ${G.chevR}
          </div>
        </div>

        <div class="group" style="margin-bottom:16px;">
          ${settingsRow(settingsIcon("#ff9500", "✈️"), "飞行模式", settingsSwitch(s.airplane, "phoneToggle('airplane',this)"), "", "飞行模式 airplane")}
          ${settingsRow(settingsIcon("#007aff", "📶"), "无线局域网", `${settingsValue(s.wifi ? "CMCC-EDU" : "关闭")}${settingsSwitch(s.wifi, "phoneToggle('wifi',this)")}`, "", "无线局域网 wifi")}
          ${settingsRow(settingsIcon("#007aff", "ᛒ"), "蓝牙", `${settingsValue(s.bluetooth ? "已开启" : "关闭")}${settingsSwitch(s.bluetooth, "phoneToggle('bluetooth',this)")}`, "", "蓝牙 bluetooth")}
          ${settingsRow(settingsIcon("#34c759", "📱"), "蜂窝网络", `${settingsValue(s.cellular ? "中国移动" : "关闭")}${settingsSwitch(s.cellular, "phoneToggle('cellular',this)")}`, "", "蜂窝网络 移动 cellular")}
        </div>

        <div class="group" style="margin-bottom:16px;">
          ${settingsRow(settingsIcon("#fa5151", "🔔"), "通知", `${settingsValue(window._wxNotifyOn === false ? "关闭" : "开启")}${G.chevR}`, "push('settings_notifications')", "通知 notifications")}
          ${settingsRow(settingsIcon("#8e8e93", "🌙"), "专注模式", settingsSwitch(window.isDnd, "phoneToggle('dnd',this)"), "", "专注模式 免打扰 dnd")}
          ${settingsRow(settingsIcon("#5e5ce6", "⏱"), "屏幕使用时间", `${settingsValue("2小时13分")}${G.chevR}`, "", "屏幕使用时间 screen time")}
        </div>

        <div class="group" style="margin-bottom:16px;">
          ${settingsRow(settingsIcon("#5856d6", "☀️"), "显示与亮度", G.chevR, "push('settings_display')", "显示与亮度 屏幕 brightness display")}
          ${settingsRow(settingsIcon("#5ac8fa", "🖼"), "墙纸", G.chevR, "push('settings_wallpaper')", "墙纸 壁纸 wallpaper")}
          ${settingsRow(settingsIcon("#34c759", "🔋"), "电池", `${settingsValue("87%")}${G.chevR}`, "", "电池 battery")}
        </div>

        <div class="group" style="margin-bottom:8px;">
          ${settingsRow(settingsIcon("#8e8e93", "⚙️"), "通用", G.chevR, "push('settings_about')", "通用 关于本机 about general")}
        </div>
      </div>`,
  };
};

VIEWS.settings_display = () => {
  const s = window._phoneSettings;
  return {
    cls: "grouped",
    html:
      navHTML({ title: "显示与亮度", back: "设置", solid: true }) +
      `<div class="scroll" style="padding-top:98px;padding-bottom:40px;background:#f2f2f7;">
        <div class="group" style="margin-bottom:16px;">
          <div class="row" style="min-height:64px;flex-direction:column;align-items:stretch;gap:10px;padding-top:12px;padding-bottom:12px;">
            <div style="display:flex;align-items:center;gap:10px;">
              <span style="font-size:18px;">🔅</span>
              <span style="flex:1;font-size:16px;">亮度</span>
              <span style="font-size:13px;color:#8e8e93;">${Math.round((s.brightness || 1) * 100)}%</span>
            </div>
            <input type="range" min="35" max="100" value="${Math.round((s.brightness || 1) * 100)}" oninput="setPhoneBrightness(this.value)" style="width:100%;accent-color:#007aff;">
          </div>
          ${settingsRow("", "自动亮度", settingsSwitch(true, "this.classList.toggle('on');vib(8)"), "", "自动亮度 auto brightness")}
        </div>
        <div class="group" style="margin-bottom:16px;">
          ${settingsInfoRow("外观", "浅色")}
          ${settingsInfoRow("文字大小", "默认")}
        </div>
      </div>`,
  };
};

VIEWS.settings_wallpaper = () => {
  const s = window._phoneSettings;
  const walls = [
    { src: "./data/app/wallpaper.jpg", label: "默认" },
    { src: "./data/album/mzc.jpg", label: "橙粉色" },
    { src: "./data/album/cat.jpg", label: "猫" },
    { src: "./data/album/1leader.jpg", label: "舞台" },
  ];
  return {
    cls: "grouped",
    html:
      navHTML({ title: "墙纸", back: "设置", solid: true }) +
      `<div class="scroll" style="padding-top:98px;padding-bottom:40px;background:#f2f2f7;">
        <div class="group" style="margin-bottom:16px;padding:14px;">
          <div style="font-size:13px;color:#8e8e93;margin-bottom:10px;">选取一张墙纸，锁屏和主屏幕会一起更换。</div>
          <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;">
            ${walls
              .map(
                (w) => `<div onclick="setPhoneWallpaper('${w.src}')" style="position:relative;aspect-ratio:9/16;border-radius:10px;overflow:hidden;background:url('${w.src}') center/cover;border:2px solid ${s.wallpaper === w.src ? "#007aff" : "transparent"};cursor:pointer;">
                  <span style="position:absolute;left:8px;bottom:8px;background:rgba(0,0,0,.45);color:#fff;font-size:12px;padding:3px 8px;border-radius:10px;">${w.label}</span>
                  ${s.wallpaper === w.src ? `<span style="position:absolute;top:8px;right:8px;width:22px;height:22px;border-radius:50%;background:#007aff;color:#fff;display:grid;place-items:center;font-size:12px;border:2px solid #fff;">✓</span>` : ""}
                </div>`,
              )
              .join("")}
          </div>
        </div>
      </div>`,
  };
};

VIEWS.settings_notifications = () => {
  return {
    cls: "grouped",
    html:
      navHTML({ title: "通知", back: "设置", solid: true }) +
      `<div class="scroll" style="padding-top:98px;padding-bottom:40px;background:#f2f2f7;">
        <div class="group" style="margin-bottom:16px;">
          ${settingsRow(settingsIcon("#07c160", "💬"), "微信", settingsSwitch(window._wxNotifyOn !== false, "toggleWxNotify(this)"), "", "微信 wechat 通知")}
          ${settingsRow(settingsIcon("#007aff", "✉️"), "邮件", settingsSwitch(window._mailNotifyOn !== false, "toggleMailNotify(this)"), "", "邮件 mail 通知")}
          ${settingsRow(settingsIcon("#8e8e93", "🌙"), "专注模式", settingsSwitch(window.isDnd, "phoneToggle('dnd',this)"), "", "专注模式 免打扰 dnd")}
        </div>
        <div class="group">
          ${settingsInfoRow("横幅风格", "临时")}
          ${settingsInfoRow("声音", "开启")}
        </div>
      </div>`,
  };
};

VIEWS.settings_about = () => {
  return {
    cls: "grouped",
    html:
      navHTML({ title: "关于本机", back: "设置", solid: true }) +
      `<div class="scroll" style="padding-top:98px;padding-bottom:40px;background:#f2f2f7;">
        <div class="group" style="margin-bottom:16px;">
          ${settingsInfoRow("名称", "小狗团汪汪的 iPhone")}
          ${settingsInfoRow("型号名称", "iPhone 15 Pro")}
          ${settingsInfoRow("系统版本", "iOS 18.1")}
          ${settingsInfoRow("序列号", "F2LX9K3Q7H2J")}
        </div>
        <div class="group" style="margin-bottom:16px;">
          <div style="padding:14px 16px 4px;font-size:13px;color:#8e8e93;">捡到这部手机</div>
          ${settingsInfoRow("捡到地点", "街角")}
          ${settingsInfoRow("捡到时间", "11月15日 23:09")}
          ${settingsInfoRow("锁屏留言", "快回家")}
        </div>
        <div style="padding:0 16px;font-size:12px;color:#8e8e93;line-height:1.5;">如果这是你的手机，请尽快联系失主。</div>
      </div>`,
  };
};

VIEWS.instagram = placeholderView("Instagram");
