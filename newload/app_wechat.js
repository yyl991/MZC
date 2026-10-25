// ==========================================
// 1. 读取本地保存的聊天记录 (当前关掉了)
// ==========================================
/*
try { ... } catch (e) {}
*/

// ==========================================
// 2. 基础工具函数
// ==========================================
function getWxTimeString(dateLabel, timeStr) {
  if (/昨天|前天|周[一二三四五六日]|\d{4}年/.test(timeStr)) return timeStr;
  let h = 0,
    m = 0;
  let match = timeStr.match(/(上午|下午)\s*(\d+):(\d+)/);
  if (match) {
    h = parseInt(match[2]);
    m = parseInt(match[3]);
    if (match[1] === "下午" && h < 12) h += 12;
    if (match[1] === "上午" && h === 12) h = 0;
  } else {
    const match2 = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (match2) {
      h = parseInt(match2[1]);
      m = parseInt(match2[2]);
      const ampm = match2[3] ? match2[3].toUpperCase() : "";
      if (ampm === "PM" && h < 12) h += 12;
      if (ampm === "AM" && h === 12) h = 0;
    }
  }
  const ampmCN =
    h >= 12
      ? '<span class="ampm">下午</span>'
      : '<span class="ampm">上午</span>';
  const h12 = h % 12 || 12;
  const timeOnly = `${ampmCN} ${h12}:${pad(m)}`;

  if (!dateLabel) return timeOnly;
  let msgDate = new Date(2026, 10, 15);
  const dm = dateLabel.match(/(?:(\d{4})年)?(\d+)月(\d+)日/);
  if (dm) {
    const y = dm[1] ? parseInt(dm[1]) : 2026;
    const mo = parseInt(dm[2]) - 1;
    const d = parseInt(dm[3]);
    msgDate = new Date(y, mo, d);
  }
  const today = new Date(2026, 10, 15);
  const diffDays = Math.floor((today - msgDate) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return timeOnly;
  if (diffDays === 1) return `昨天 ${timeOnly}`;
  if (diffDays > 1 && diffDays < 7) {
    const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    return `${weekdays[msgDate.getDay()]} ${timeOnly}`;
  }
  if (msgDate.getFullYear() === today.getFullYear()) {
    return `${msgDate.getMonth() + 1}月${msgDate.getDate()}日 ${timeOnly}`;
  }
  return `${msgDate.getFullYear()}年${msgDate.getMonth() + 1}月${msgDate.getDate()}日 ${timeOnly}`;
}

const isGroup = (n) => /4组|公告|任务/.test(n);

function previewText(s, grp) {
  if (s.startsWith("[图片]")) return "[图片]";
  if (s.startsWith("[表情]")) return "[表情]";
  if (s.startsWith("[语音]")) return "[语音]";
  if (s.startsWith("[视频]")) return "[视频]";
  return s;
}

function avatarFor(name, group, isMe) {
  if (isMe) {
    const myAv = CFG && CFG.myAvatar ? CFG.myAvatar : "./data/avatar/me.jpg";
    return `<img src="${myAv}" style="width:100%;height:100%;object-fit:cover;border-radius:6px;" onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\\'app-icon-fallback\\' style=\\'background:#3a3a3c;font-size:20px\\'>我</div>';" />`;
  }

  const r = CFG.roles && CFG.roles[name];
  if (r) {
    if (r.avatar)
      return `<img src="${r.avatar}" style="width:100%;height:100%;object-fit:cover;border-radius:6px;" />`;
    return `<div class="app-icon-fallback" style="background:${r.color};font-size:20px">${r.initial}</div>`;
  }
  return G.sil;
}
// ==========================================
// 3. 微信列表页
// ==========================================
VIEWS.wechat = () => {
  const list = chatNames.filter((n) => {
    const arr = chatData[n] || [];
    return arr.some((x) => x[1] !== "date");
  });

  const svgSearch = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>`;
  const svgPlus = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>`;
  const tabChat = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 4C7 4 3 7.1 3 11c0 2.4 1.5 4.5 3.9 5.8L6 20.5l4-2.4c.6.1 1.3.1 2 .1 5 0 9-3.1 9-7.1S17 4 12 4Z"/></svg>`;
  const tabContacts = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>`;
  const tabDiscover = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5Z"/></svg>`;
  const tabMe = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="7" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>`;

  return {
    cls: "wx-list",
    html: `
    <div class="wx-head">
        <div class="wx-head-left"></div>
        <h1>微信</h1>
        <div class="wx-actions">${svgSearch}${svgPlus}</div>
    </div>
    <div class="wx-scroll">
        ${list
          .map((n) => {
            const arr = chatData[n] || [];
            let last = arr.filter((x) => x[1] !== "date").slice(-1)[0];
            let time = "";
            if (last) {
              let tStr = last[2];
              let h = 0,
                m = 0;
              let match = tStr.match(/(上午|下午)\s*(\d+):(\d+)/);
              if (match) {
                h = parseInt(match[2]);
                m = parseInt(match[3]);
                if (match[1] === "下午" && h < 12) h += 12;
                if (match[1] === "上午" && h === 12) h = 0;
              } else {
                const match2 = tStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
                if (match2) {
                  h = parseInt(match2[1]);
                  m = parseInt(match2[2]);
                  const ampm = match2[3] ? match2[3].toUpperCase() : "";
                  if (ampm === "PM" && h < 12) h += 12;
                  if (ampm === "AM" && h === 12) h = 0;
                }
              }
              let ampmCN = h >= 12 ? "下午" : "上午";
              let h12 = h % 12 || 12;
              time = `${ampmCN} ${h12}:${pad(m)}`;
            }
            let cnt = unread[n] || 0;
            const badge = cnt
              ? `<span class="wx-badge">${cnt > 99 ? "99+" : cnt}</span>`
              : "";

            return `
            <button class="wx-item" onclick="chatId=&quot;${n}&quot;;push('chat')">
                <div class="wx-av">${avatarFor(n, isGroup(n))}${badge}</div>
                <div class="wx-info">
                    <div class="wx-name">${esc(dn(n))}</div>
                    <div class="wx-msg">${last ? esc(previewText(last[0], isGroup(n))) : ""}</div>
                </div>
                <div class="wx-meta"><span class="wx-time">${time}</span></div>
            </button>`;
          })
          .join("")}
    </div>
    <div class="wx-tabbar">
        <button class="on"><span>${tabChat}</span><small>微信</small></button>
        <button onclick="push('wx_contacts')"><span>${tabContacts}</span><small>通讯录</small></button>
        <button onclick="push('wx_discover')"><span>${tabDiscover}</span><small>发现</small></button>
        <button onclick="push('wx_me')"><span>${tabMe}</span><small>我</small></button>
    </div>`,
  };
};

// ==========================================
// 4. 聊天详情渲染
// ==========================================
function chatItems(id) {
  const arr = chatData[id] || [];
  const items = [];
  arr.forEach((m, rawIdx) => {
    if (m[1] === "date") {
      items.push({ date: m[0] });
      return;
    }
    items.push({
      who: m[1],
      text: m[0],
      sender: id,
      time: m[2] || "",
      rd: m[3] === "rd",
      rawIdx: rawIdx,
    });
  });
  return items;
}

function chatMsgs(id) {
  const it = chatItems(id);
  let o = "";
  let currentDateLabel = "11月15日";

  const getMins = (timeStr) => {
    if (!timeStr) return 0;
    let h = 0,
      m = 0;
    let match = timeStr.match(/(上午|下午)\s*(\d+):(\d+)/);
    if (match) {
      h = parseInt(match[2]);
      m = parseInt(match[3]);
      if (match[1] === "下午" && h < 12) h += 12;
      if (match[1] === "上午" && h === 12) h = 0;
    } else {
      match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      if (match) {
        h = parseInt(match[1]);
        m = parseInt(match[2]);
        const ampm = match[3] ? match[3].toUpperCase() : "";
        if (ampm === "PM" && h < 12) h += 12;
        if (ampm === "AM" && h === 12) h = 0;
      }
    }
    return h * 60 + m;
  };

  it.forEach((x, i) => {
    if (x.date) {
      currentDateLabel = x.date;
      return;
    }
    const me = x.who === "me";
    const prev = it[i - 1];

    let showTime = false;
    if (i === 1 || !prev || prev.date) showTime = true;
    else {
      const currMin = getMins(x.time);
      const prevMin = getMins(prev.time);
      if (currMin - prevMin >= 5 || currMin < prevMin) showTime = true;
    }

    if (showTime)
      o += `<div class="wx-dpill"><span>${getWxTimeString(currentDateLabel, x.time)}</span></div>`;
    if (x.who === "sys") {
      o += `<div class="wx-sys-tip">${esc(x.text)}</div>`;
      return;
    }

    let innerContent = "";
    let bubbleClass = "wx-bb";
    let onclickAttr = "";

    if (x.text.startsWith("[图片]")) {
      const imgUrl = x.text.replace("[图片]", "").trim();
      // 👇 图片：点击打开全局查看器
      innerContent = `<img src="${imgUrl}" class="wx-img" style="cursor:pointer;" onclick="event.stopPropagation();openMediaViewer(['${imgUrl}'], 0)" />`;
      bubbleClass = "wx-bb img-bb";
    } else if (x.text.startsWith("[表情]")) {
      const emoUrl = x.text.replace("[表情]", "").trim();
      innerContent = `<img src="${emoUrl}" class="wx-emoji" />`;
      bubbleClass = "wx-bb emo-bb";
    } else if (x.text.startsWith("[语音]")) {
      const raw = x.text.replace("[语音]", "").trim();
      const parts = raw.split("|");
      const sec = parseInt(parts[0]) || 1;
      const audioUrl = parts[1] || "";
      const bubbleWidth = Math.max(80, Math.min(200, 60 + sec * 8));

      innerContent = `
        <div style="display: flex; align-items: center; justify-content: ${me ? "flex-end" : "flex-start"}; width: ${bubbleWidth}px;">
          ${!me ? `<span class="voice-speaker">${G.speaker}</span><span class="voice-sec">${sec}"</span>` : ""}
          ${me ? `<span class="voice-sec">${sec}"</span><span class="voice-speaker me">${G.speaker}</span>` : ""}
        </div>
      `;
      bubbleClass = "wx-bb voice-bb";
      onclickAttr = `onclick="playVoice(this, '${audioUrl}', ${sec})"`;
    } else if (x.text.startsWith("[视频]")) {
      const parts = x.text.replace("[视频]", "").trim().split("|");
      const videoUrl = parts[0];
      const coverUrl = parts[1]; 
      const timeStr = parts[2] || "0:00";
      
      // 👇 视频：有封面用封面，没封面自动抓取视频第一帧
      const coverHTML = (coverUrl && coverUrl !== videoUrl) 
        ? `<img src="${coverUrl}" style="width:100%; height:100%; object-fit:cover; position:absolute; inset:0;">`
        : `<video src="${videoUrl}" muted preload="metadata" style="width:100%; height:100%; object-fit:cover; position:absolute; inset:0; pointer-events:none;"></video>`;
      
      innerContent = `
        ${coverHTML}
        <div class="wx-video-play">▶</div>
        <div class="wx-video-time">${timeStr}</div>
      `;
      bubbleClass = "wx-bb video-bb";
      // 👇 视频：点击打开全局查看器播放
      onclickAttr = `onclick="event.stopPropagation();openMediaViewer(['${videoUrl}'], 0)"`;
    } else {
      innerContent = esc(x.text);
    }

    const holdEvent = me
      ? `onpointerdown="startHoldMsg(event, ${x.rawIdx})" onpointerup="cancelHoldMsg()" onpointerleave="cancelHoldMsg()"`
      : "";

    let dotHtml = "";
    let btnHtml = "";
    let textHtml = "";

    if (!me && x.text.startsWith("[语音]")) {
      dotHtml = `<span class="voice-unread" id="dot-${x.rawIdx}" style="width:8px;height:8px;background:#ff3b30;border-radius:50%;flex:none;"></span>`;
      const parts = x.text.replace("[语音]", "").trim().split("|");
      const transTxt = parts[2] || "";
      if (transTxt) {
        btnHtml = `<div class="voice-trans-btn" onclick="toggleVoiceText(this)">转文字</div>`;
        textHtml = `<div class="voice-trans-text">${esc(transTxt)}</div>`;
      }
    }

    o += `
    <div class="wx-ln ${me ? "me" : "th"}">
    <div class="wx-sav" ondblclick="doPat(${me})">${avatarFor(x.sender, false, me)}</div>
    
      <div style="display: flex; flex-direction: column; align-items: ${me ? "flex-end" : "flex-start"}; max-width: calc(100% - 60px);">
        <div style="display: flex; align-items: center; flex-direction: ${me ? "row-reverse" : "row"}; gap: 6px;">
          <div class="${bubbleClass}" data-idx="${x.rawIdx}" ${onclickAttr} ${holdEvent}>${innerContent}</div>
          ${!me ? dotHtml : ""}
          ${!me ? btnHtml : ""}
        </div>
        ${textHtml}
      </div>
    </div>`;
  });
  return o;
}

// ==========================================
// 5. 交互逻辑 (撤回、语音、视频、拍一拍)
// ==========================================
let holdTimer = null;
function startHoldMsg(e, rawIdx) {
  if (SS.typing) return;
  holdTimer = setTimeout(() => {
    vib(20);
    if (confirm("你要撤回这条消息吗？")) {
      const arr = chatData[chatId];
      const time = arr[rawIdx][2];
      arr[rawIdx] = ["你撤回了一条消息", "sys", time];
      saveChat();
      refreshChat();
    }
  }, 600);
}
function cancelHoldMsg() {
  if (holdTimer) clearTimeout(holdTimer);
}

function toggleVoiceText(btn) {
  const container =
    btn.closest(".wx-ln").querySelector(".wx-wrap") || btn.closest(".wx-ln");
  const txt =
    container.querySelector(".voice-trans-text") ||
    btn.parentElement.parentElement.querySelector(".voice-trans-text");
  if (txt.style.display === "block") {
    txt.style.display = "none";
    btn.textContent = "转文字";
  } else {
    txt.style.display = "block";
    btn.textContent = "收起文字";
  }
}


let voiceAudio = null;
let currentVoiceEl = null;

function playVoice(el, url, sec) {
  // 如果点的是正在播放的语音，直接暂停
  if (currentVoiceEl === el && voiceAudio && !voiceAudio.paused) {
    voiceAudio.pause();
    el.classList.remove("playing");
    currentVoiceEl = null;
    resumeBGM();
    return;
  }

  // 停止上一条正在播的语音
  if (voiceAudio) { voiceAudio.pause(); voiceAudio = null; }
  if (currentVoiceEl) { currentVoiceEl.classList.remove("playing"); currentVoiceEl = null; }

  el.classList.add("playing");
  currentVoiceEl = el;

  // 消除红点
  const idx = el.getAttribute("data-idx");
  if (idx) {
    const dot = document.getElementById(`dot-${idx}`);
    if (dot) dot.style.display = "none";
  }

  pauseBGM(); // 暂停背景音乐

  if (url) {
    voiceAudio = new Audio(url);
    voiceAudio.volume = 0.9;
    voiceAudio.play().catch((e) => {
      console.error("语音播放失败（请检查路径或文件是否存在）:", url, e);
      el.classList.remove("playing");
      currentVoiceEl = null;
      resumeBGM();
    });
    voiceAudio.onended = () => {
      el.classList.remove("playing");
      currentVoiceEl = null;
      voiceAudio = null;
      resumeBGM();
    };
  } else {
    setTimeout(() => {
      el.classList.remove("playing");
      currentVoiceEl = null;
      resumeBGM();
    }, sec * 1000);
  }
}
function openVideo(url) {
  const BGM = document.getElementById("bgm");
  if (BGM) {
    BGM.pause(); // 👈 只暂停，记住当前位置
    // BGM.currentTime = 0; 👈 千万别加这行！加就从头开始了！
    window.bgmPausedByOther = true;
  }

  const d = document.createElement("div");
  d.className = "video-overlay";
  d.innerHTML = `
    <div class="video-close">×</div>
    <video src="${url}" controls autoplay playsinline></video>
  `;
  document.getElementById("screen").appendChild(d);

  const close = () => {
    const v = d.querySelector('video');
    if (v) { v.pause(); v.src = ""; }
    d.remove();
    resumeBGM();
  };
  d.querySelector('.video-close').onclick = close;
  d.querySelector('video').onended = close;
}

function doPat(isSelf) {
  if (window._patLock) return;
  window._patLock = true;
  setTimeout(() => {
    window._patLock = false;
  }, 500);

  vib([20, 50, 20]);
  const time = nowAmpm();
  let msg = "";

  if (isSelf) {
    const myPat = CFG && CFG.myPat ? CFG.myPat : "";
    msg = `"你" 拍了拍自己${myPat ? " " + myPat : ""}`;
  } else {
    const targetRole = CFG.roles && CFG.roles[chatId];
    const targetSuffix = targetRole && targetRole.pat ? targetRole.pat : "";
    const targetName = dn(chatId);
    msg = `"你" 拍了拍 "${targetName}"${targetSuffix ? " " + targetSuffix : ""}`;
  }

  chatData[chatId].push([msg, "sys", time]);
  saveChat();
  refreshChat(true);
}

// ==========================================
// 6. 底部输入栏与键盘
// ==========================================
function toggleVoiceInput() {
  const field = $("#fld"),
    btn = $("#voice-btn"),
    icon = $("#voice-icon");

  if (field.style.display === "none") {
    field.style.display = "flex";
    btn.style.display = "none";
    icon.innerHTML = G.mic;
  } else {
    field.style.display = "none";
    btn.style.display = "flex";
    icon.innerHTML = G.keypad;
    closeKbd();
  }
}

let recordStart = 0;
function startRecord(e) {
  e.preventDefault();
  recordStart = Date.now();
  e.target.classList.add("recording");
  e.target.textContent = "松开 发送";
  vib(10);
}
function endRecord(e) {
  e.preventDefault();
  if (!recordStart) return;
  const sec = Math.round((Date.now() - recordStart) / 1000);
  recordStart = 0;
  e.target.classList.remove("recording");
  e.target.textContent = "按住 说话";
  if (sec < 1) return;

  chatData[chatId].push([`[语音] ${sec}`, "me", nowAmpm(), "rd"]);
  saveChat();
  refreshChat(true);
  sfx("send");
  vib(20);
}

VIEWS.chat = () => ({
  cls: "wx-chat",
  html: `
  <div class="wx-chat-h">
      <button class="bk" onclick="back()">${G.chevL}</button>
      <div class="nm" id="chatTitle">${esc(dn(chatId))}</div>
      <div class="rt">${G.dotsH}</div>
  </div>
  <div class="msgs" id="msgs" onclick="closeKbd()">${chatMsgs(chatId)}</div>
  <div class="wx-cin safe" id="cin">
      <button class="ic" id="voice-icon" onclick="vib(10);toggleVoiceInput()">${G.mic}</button>
      <div class="wx-fld ph" id="fld" onclick="event.stopPropagation();tapInput()">输入消息</div>
      <button class="wx-voice-btn" id="voice-btn" onpointerdown="startRecord(event)" onpointerup="endRecord(event)" onpointerleave="endRecord(event)">按住 说话</button>
      <button class="ic" onclick="vib(10)">${G.smile}</button>
      <button class="ic" onclick="vib(10)">${G.plusSq}</button>
      <button class="wx-snd" id="snd" onclick="sendLine()">发送</button>
  </div>
  <div class="kbd" id="kbd">${kbdHTML()}</div>`,
  init: () => {
    if (chatId) unread[chatId] = 0;
    SS.typing = false;
    SS.pendingText = "";
    scrollChat();
  },
});

function scrollChat(smooth) {
  const b = $("#msgs");
  if (!b) return;
  if (smooth) b.scrollTo({ top: b.scrollHeight, behavior: "smooth" });
  else b.scrollTop = b.scrollHeight;
}
function refreshChat(pop) {
  const b = $("#msgs");
  if (!b || view !== "chat") return;
  b.innerHTML = chatMsgs(chatId);
  scrollChat();
  if (pop) {
    const l = b.lastElementChild && b.lastElementChild.querySelector(".wx-bb");
    if (l) l.classList.add("pop");
  }
}

const KB_LAT = [
  "qwertyuiop".split(""),
  "asdfghjkl".split(""),
  "zxcvbnm".split(""),
];
function kbdHTML() {
  const k = (c) => `<div class="key" data-k="${c}" data-c="${c}">${c}</div>`;
  const R = KB_LAT;
  return `<div class="kin" onclick="event.stopPropagation();kbdTap(event)"><div class="kr">${R[0].map(k).join("")}</div><div class="kr" style="padding:0 3px">${R[1].map(k).join("")}</div><div class="kr"><div class="key sp" data-k="⇧">${G.shift}</div><span style="width:6px"></span>${R[2].map(k).join("")}<span style="width:6px"></span><div class="key sp" data-k="⌫">${G.bksp}</div></div><div class="kr"><div class="key sp" data-k="123" style="font-size:16px">123</div><div class="key sp" data-k="emo" style="font-size:20px">🙂</div><div class="key wide" data-k="space">空格</div><div class="key ret" data-k="ret">换行</div></div><div class="kbot">${G.globe}${G.mic}</div></div>`;
}
function openKbd() {
  const k = $("#kbd");
  if (!k || k.classList.contains("open")) return;
  k.classList.add("open");
  $("#cin").classList.remove("safe");
  const t0 = performance.now();
  (function f() {
    scrollChat();
    if (performance.now() - t0 < 420) requestAnimationFrame(f);
  })();
}
function closeKbd() {
  const k = $("#kbd");
  if (!k || !k.classList.contains("open")) return;
  k.classList.remove("open");
  $("#cin").classList.add("safe");
}
function pressKey(k) {
  const el = document.querySelector(`#kbd [data-k="${k}"]`);
  if (!el) return;
  el.classList.add("dn");
  if (
    !el.classList.contains("sp") &&
    !el.classList.contains("wide") &&
    !el.classList.contains("ret")
  )
    el.classList.add("pv");
  sfx("key");
  setTimeout(() => el.classList.remove("dn", "pv"), 130);
}
function kbdTap(e) {
  const k = e.target.closest(".key");
  if (!k) return;
  if (SS.typing) {
    pressKey(k.dataset.k);
    vib(5);
    return;
  }
  if (!SS.pendingText && canType()) {
    const c = CFG.chats[chatId],
      st = SS.stage[chatId] || 0,
      li = SS.lineIdx[chatId] || 0;
    typeLine(c.replies[st].mine[li]);
    return;
  }
  pressKey(k.dataset.k);
  vib(5);
}
function genSteps(str) {
  const st = [];
  let done = "";
  const letters = "qwertyuiopasdfghjklzxcvbnm".split("");
  for (const ch of str) {
    done += ch;
    let k = [];
    if (ch === " ") k = ["space"];
    else if (/[a-zA-Z0-9]/.test(ch)) k = [ch.toLowerCase()];
    else {
      k = [letters[Math.floor(Math.random() * letters.length)]];
      if (Math.random() > 0.6)
        k.push(letters[Math.floor(Math.random() * letters.length)]);
    }
    st.push({ k, t: done });
  }
  return st;
}
function setField(txt, cursor) {
  const f = $("#fld");
  if (!f) return;
  if (!txt && !cursor) {
    f.className = "wx-fld ph";
    f.textContent = "输入消息";
    return;
  }
  f.className = "wx-fld";
  f.innerHTML = esc(txt) + (cursor ? '<span class="cur"></span>' : "");
}
function canType() {
  const c = CFG.chats && CFG.chats[chatId];
  if (!c) return false;
  const st = SS.stage[chatId] || 0,
    li = SS.lineIdx[chatId] || 0;
  return (
    st < c.replies.length && !SS.typing && !SS.pendingText && !SS.replyBusy
  );
}
function tapInput() {
  openKbd();
  if (!canType()) {
    setField(SS.pendingText, true);
    return;
  }
  setField("", true);
}
function typeLine(line) {
  SS.typing = true;
  const steps = genSteps(line);
  let i = 0;
  setField("", true);
  (function step() {
    if (view !== "chat") {
      SS.typing = false;
      return;
    }
    if (i >= steps.length) {
      SS.typing = false;
      SS.pendingText = line;
      const s = $("#snd");
      if (s) s.classList.add("on");
      return;
    }
    const s = steps[i++];
    s.k.forEach((k, j) => setTimeout(() => pressKey(k), j * 45));
    setField(s.t, true);
    setTimeout(step, 120 + Math.random() * 100);
  })();
}
function sendLine() {
  if (!SS.pendingText) return;
  const c = CFG.chats[chatId];
  if (!c) return;
  const st = SS.stage[chatId] || 0,
    li = SS.lineIdx[chatId] || 0,
    line = SS.pendingText;

  chatData[chatId].push([line, "me", nowAmpm(), "rd"]);
  SS.pendingText = "";
  sfx("send");
  vib(10);
  setField("", false);
  $("#snd").classList.remove("on");

  saveChat();
  refreshChat(true);
  SS.lineIdx[chatId] = li + 1;

  const stage = c.replies[st];
  if (SS.lineIdx[chatId] < stage.mine.length) {
    setTimeout(() => {
      if (view === "chat" && chatId && $("#kbd.open"))
        typeLine(stage.mine[SS.lineIdx[chatId]]);
    }, 500);
    return;
  }

  SS.stage[chatId] = st + 1;
  SS.lineIdx[chatId] = 0;
  SS.replyBusy = true;
  setTimeout(() => {
    chatData[chatId].forEach((x) => {
      if (x[3] === "rd") x[3] = "";
    });
    saveChat();
    refreshChat();
  }, 900);

  let t = 1200;
  stage.them.forEach((msg) => {
    setTimeout(() => showTypingFrom(chatId), t);
    t += 700 + msg.length * 40;
    setTimeout(() => {
      hideTyping();
      deliverFrom(chatId, msg);
    }, t);
    t += 300;
  });

  setTimeout(() => {
    SS.replyBusy = false;
    if (SS.stage[chatId] >= c.replies.length) {
      SS.completed.add(chatId);
      unlockFragment(chatId);
    }
  }, t + 50);
}

function showTypingFrom(from) {
  if (!(view === "chat" && chatId === from)) return;
  const title = $("#chatTitle");
  if (title) title.textContent = "对方正在输入...";
}
function hideTyping() {
  const title = $("#chatTitle");
  if (title && view === "chat") title.textContent = dn(chatId);
}
function deliverFrom(from, text) {
  if (!chatData[from]) chatData[from] = [];

  // 👈 防重复拦截
  const arr = chatData[from];
  if (arr.length > 0) {
    const last = arr[arr.length - 1];
    if (last[0] === text && last[1] === "them") return;
  }

  chatData[from].push([text, "them", nowAmpm()]);
  saveChat();

  if (view === "chat" && chatId === from) {
    refreshChat(true);
    tone(1318, 0, 0.12, 0.05);
  } else {
    unread[from] = (unread[from] || 0) + 1;
    notifyFrom(from, text);
    if (view === "wechat") {
      const pg = APP.lastElementChild;
      if (pg) pg.innerHTML = VIEWS.wechat().html;
    }
    if (view === "home") renderHome();
  }
}
function incomingMsgFrom(from, text) {
  if (view === "chat" && chatId === from) {
    showTypingFrom(from);
    setTimeout(() => {
      hideTyping();
      deliverFrom(from, text);
    }, 1200);
  } else deliverFrom(from, text);
}

function notifyFrom(from, body) {
  // 👈 核心拦截：如果开启了免打扰，不播放音效、不弹横幅，直接返回
  if (window.isDnd) {
    return;
  }

  sfx("msg");
  vib([30, 60, 30]);
  if (view === "lock" || view === "pin") {
    lockNotes.unshift({ title: dn(from), body, app: "wechat", time: t("now") });
    renderLock();
    return;
  }

  OV.querySelectorAll(".banner").forEach((b) => b.remove());
  const b = document.createElement("div");
  b.className = "banner";
  b.innerHTML = `<div class="ncard">${ncardHTML({ title: dn(from), body, app: "wechat", time: t("now") })}</div>`;
  OV.appendChild(b);

  b.animate(
    [{ transform: "translateY(-140%) scale(.96)" }, { transform: "none" }],
    { duration: 620, easing: "cubic-bezier(.2,1.25,.35,1)" },
  );

  let tm = setTimeout(() => {
    closeBanner(b);
  }, 5600);

  let y0 = null,
    dy = 0,
    isDragging = false;

  b.addEventListener("pointerdown", (e) => {
    y0 = e.clientY;
    dy = 0;
    isDragging = true;
    clearTimeout(tm);
    b.getAnimations().forEach((a) => a.cancel());
    b.style.transition = "none";
    b.setPointerCapture(e.pointerId);
  });

  b.addEventListener("pointermove", (e) => {
    if (!isDragging) return;
    dy = e.clientY - y0;
    if (dy < 0) {
      const opacity = Math.max(0, 1 - Math.abs(dy) / 100);
      b.style.transform = `translateY(${dy}px) scale(${1 - Math.abs(dy) / 1000})`;
      b.style.opacity = opacity;
    } else {
      b.style.transform = `translateY(${dy * 0.2}px)`;
    }
  });

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    isDragging = false;
    b.releasePointerCapture(e.pointerId);
    b.style.transition = "all 0.3s cubic-bezier(0.2, 0.9, 0.25, 1)";

    if (dy < -40) {
      closeBanner(b, true);
    } else if (Math.abs(dy) < 5) {
      b.remove();
      openChatFrom(from);
    } else {
      b.style.transform = "none";
      b.style.opacity = 1;
      tm = setTimeout(() => {
        closeBanner(b);
      }, 3000);
    }
  };

  b.addEventListener("pointerup", handlePointerUp);
  b.addEventListener("pointercancel", handlePointerUp);

  function closeBanner(el, isSwipe = false) {
    clearTimeout(tm);
    const startTransform = el.style.transform || "none";
    const startOpacity = el.style.opacity || "1";
    el.animate(
      [
        { transform: startTransform, opacity: startOpacity },
        { transform: "translateY(-140%) scale(0.9)", opacity: 0 },
      ],
      {
        duration: 300,
        easing: "cubic-bezier(0.3, 0.7, 0.2, 1)",
        fill: "forwards",
      },
    ).onfinish = () => el.remove();
  }
}

function openChatFrom(from) {
  if (callState) return;
  chatId = from;
  if (view === "home")
    openApp("chat", HOME.querySelector('.app[data-app="wechat"] .icon'));
  else if (view === "chat") show("chat");
  else push("chat");
}

function unlockFragment(id) {
  const f = CFG.chats?.[id]?.fragment;
  if (!f || SS.fragments.has(id)) return;
  SS.fragments.add(id);
  SS.goingHome = Math.round(
    (SS.fragments.size /
      Object.keys(CFG.chats).filter((k) => CFG.chats[k].fragment).length) *
      100,
  );
  notes.unshift([`碎片 · ${id}`, f.title, f.body, "2026-11-15"]);
  saveStory();
  notifyFrom("系统", `已解锁：${f.title} · 回家进度 ${SS.goingHome}%`);
}
function saveStory() {
  try {
    localStorage.setItem(
      "wb_story",
      JSON.stringify({
        stage: SS.stage,
        lineIdx: SS.lineIdx,
        fragments: [...SS.fragments],
        goingHome: SS.goingHome,
        choice: SS.choice,
        arriveHome: SS.arriveHome,
        completed: [...SS.completed],
        fired: [...SS.fired],
        privateUnlocked: SS.privateUnlocked,
        memoUnlocked: SS.memoUnlocked,
      }),
    );
  } catch (e) {}
}

function saveChat() {
  /*
  try {
    localStorage.setItem("wb_chatData", JSON.stringify(chatData));
  } catch (e) {}*/
}



// ---------------- 4. 微信子页面 ----------------
VIEWS.wx_discover = () => {
  const icPengyouquan = `<svg viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="11" fill="#41b883"/><circle cx="12" cy="12" r="4" fill="#fff"/><path d="M12 1a11 11 0 0 1 9.5 5.5H12V1z" fill="#ffd200"/><path d="M22 13a11 11 0 0 1-6 9.5V13h6z" fill="#e96923"/><path d="M12 23A11 11 0 0 1 2.5 17.5H12V23z" fill="#2b9ded"/></svg>`;
  const icShipinhao = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fa9d3b" stroke-width="2"><path d="M4 8c4-4 12-4 16 0M4 16c4 4 12 4 16 0"/><circle cx="8" cy="8" r="2" fill="#fa9d3b"/><circle cx="16" cy="16" r="2" fill="#fa9d3b"/></svg>`;
  const icZhibo = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fa5151" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="#fa5151"/></svg>`;
  const icSaoyisao = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#4a90e2" stroke-width="2"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/><path d="M3 12h18"/></svg>`;
  const icTingyiting = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fa5151" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`;
  const icKanyikan = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#f5c84c" stroke-width="2"><path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/></svg>`;
  const icSouyisou = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fa5151" stroke-width="2"><path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M5 19l4-4M15 9l4-4"/></svg>`;
  const icFujin = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#4a90e2" stroke-width="2"><circle cx="9" cy="8" r="3"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><circle cx="17" cy="10" r="2"/><path d="M17 15a3 3 0 0 1 3 3v3"/></svg>`;
  const icYouxi = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke-width="2"><polygon points="12,2 22,8 22,16 12,22 2,16 2,8" fill="#a2e6ff" stroke="#4a90e2"/><polygon points="12,2 22,8 12,12 2,8" fill="#ffd200" stroke="#e9a623"/><polygon points="12,12 22,8 22,16 12,22" fill="#fa5151" stroke="#c73b3b"/></svg>`;
  const icXiaochengxu = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#8c65e3" stroke-width="2"><path d="M18 6a8 8 0 0 0-11.3 0M6 18a8 8 0 0 0 11.3 0"/><circle cx="12" cy="12" r="3"/></svg>`;
  const svgSearch = `<svg viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>`;
  const svgPlus = `<svg viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>`;

  const row = (icon, text, isLast = false) => `
    <div class="row tap" style="min-height:56px; padding:0 16px; position:relative; display:flex; align-items:center; background:#fff; width:100%; text-align:left; border:none;">
      <div style="width:24px; height:24px; display:flex; justify-content:center; align-items:center; margin-right:16px; flex:none;">${icon}</div>
      <div style="flex:1; font-size:16px; color:#111;">${text}</div>
      <div style="width:16px; display:flex; justify-content:flex-end;">${G.chevR}</div>
      ${!isLast ? `<div style="position:absolute; bottom:0; left:56px; right:0; height:.5px; background:#e5e5ea;"></div>` : ''}
    </div>
  `;

  return {
    cls: "wx-list",
    html: `
    <div class="wx-head" style="display:grid; grid-template-columns:1fr auto 1fr; align-items:center; height:88px; padding:44px 18px 0; background:#ededed; padding-bottom:8px;">
        <div></div><h1 style="font-size:18px; font-weight:500; color:#000; margin:0; text-align:center;">发现</h1>
        <div class="wx-actions" style="display:flex; gap:18px; justify-self:end; align-items:center;">${svgSearch}${svgPlus}</div>
    </div>
    <div class="wx-scroll" style="background:#ededed;">
        <div style="background:#fff; margin-top:8px;">${row(icPengyouquan, "朋友圈", true)}</div>
        <div style="background:#fff; margin-top:8px;">${row(icShipinhao, "视频号")}${row(icZhibo, "直播", true)}</div>
        <div style="background:#fff; margin-top:8px;">${row(icSaoyisao, "扫一扫")}${row(icTingyiting, "听一听", true)}</div>
        <div style="background:#fff; margin-top:8px;">${row(icKanyikan, "看一看")}${row(icSouyisou, "搜一搜", true)}</div>
        <div style="background:#fff; margin-top:8px;">${row(icFujin, "附近的人", true)}</div>
        <div style="background:#fff; margin-top:8px;">${row(icYouxi, "游戏", true)}</div>
        <div style="background:#fff; margin-top:8px; margin-bottom:20px;">${row(icXiaochengxu, "小程序", true)}</div>
    </div>
    <div class="wx-tabbar">
        <button onclick="back()"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 4C7 4 3 7.1 3 11c0 2.4 1.5 4.5 3.9 5.8L6 20.5l4-2.4c.6.1 1.3.1 2 .1 5 0 9-3.1 9-7.1S17 4 12 4Z"/></svg></span><small>微信</small></button>
        <button><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg></span><small>通讯录</small></button>
        <button class="on" onclick="push('wx_discover')"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5Z"/></svg></span><small>发现</small></button>
        <button><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="7" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg><span class="wx-badge" style="top:-4px;right:-8px;">1</span></span><small>我</small></button>
    </div>`,
  };
};

VIEWS.wx_contacts = () => ({
  cls: "wx-list",
  html: `
  <div class="wx-head"><h1>通讯录</h1><div class="wx-actions"></div></div>
  <div class="wx-scroll" style="padding-top: 10px;">
      ${chatNames.map(n => `<div class="wx-item"><div class="wx-av">${avatarFor(n)}</div><div class="wx-info"><div class="wx-name">${esc(dn(n))}</div></div></div>`).join('')}
  </div>
  <div class="wx-tabbar">
      <button onclick="back()"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 4C7 4 3 7.1 3 11c0 2.4 1.5 4.5 3.9 5.8L6 20.5l4-2.4c.6.1 1.3.1 2 .1 5 0 9-3.1 9-7.1S17 4 12 4Z"/></svg></span><small>微信</small></button>
      <button class="on" onclick="push('wx_contacts')"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg></span><small>通讯录</small></button>
      <button onclick="push('wx_discover')"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5Z"/></svg></span><small>发现</small></button>
      <button onclick="push('wx_me')"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="7" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg></span><small>我</small></button>
  </div>`,
});

VIEWS.wx_me = () => ({
  cls: "wx-list",
  html: `
  <div class="wx-head"><h1>我</h1><div class="wx-actions"></div></div>
  <div class="wx-scroll" style="padding-top: 20px;">
      <div class="wx-item" style="background:#fff; margin-bottom:10px; padding:20px 16px;">
          <div class="wx-av" style="width:64px;height:64px;">${CFG.myAvatar ? `<img src="${CFG.myAvatar}" style="width:100%;height:100%;border-radius:6px;object-fit:cover;">` : G.sil}</div>
          <div class="wx-info" style="margin-left:12px;">
              <div class="wx-name" style="font-size:20px; font-weight:600;">我</div>
              <div class="wx-msg" style="margin-top:6px;">微信号：wan_wan</div>
          </div>
      </div>
      <div class="wx-item" style="background:#fff;"><div class="wx-info"><div class="wx-name">收藏</div></div></div>
      <div class="wx-item" style="background:#fff;"><div class="wx-info"><div class="wx-name">朋友圈</div></div></div>
      <div class="wx-item" style="background:#fff;"><div class="wx-info"><div class="wx-name">卡包</div></div></div>
      <div class="wx-item" style="background:#fff;"><div class="wx-info"><div class="wx-name">表情</div></div></div>
      <div class="wx-item" style="background:#fff; margin-top:10px;"><div class="wx-info"><div class="wx-name">设置</div></div></div>
  </div>
  <div class="wx-tabbar">
      <button onclick="back()"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 4C7 4 3 7.1 3 11c0 2.4 1.5 4.5 3.9 5.8L6 20.5l4-2.4c.6.1 1.3.1 2 .1 5 0 9-3.1 9-7.1S17 4 12 4Z"/></svg></span><small>微信</small></button>
      <button onclick="push('wx_contacts')"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg></span><small>通讯录</small></button>
      <button onclick="push('wx_discover')"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5Z"/></svg></span><small>发现</small></button>
      <button class="on" onclick="push('wx_me')"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="7" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg></span><small>我</small></button>
  </div>`,
});
