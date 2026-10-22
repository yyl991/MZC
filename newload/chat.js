// ==========================================
// 微信时间智能解析逻辑 (今天/昨天/周几/日期/年份)
// ==========================================
function getWxTimeString(dateLabel, timeStr) {
  if (!timeStr) return "";
  if (/昨天|前天|周[一二三四五六日]|\d{4}年/.test(timeStr)) return timeStr;

  let h = 0,
    m = 0;
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (match) {
    h = parseInt(match[1]);
    m = parseInt(match[2]);
    const ampm = match[3] ? match[3].toUpperCase() : "";
    if (ampm === "PM" && h < 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;
  }
  const timeOnly = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

  if (!dateLabel) return timeOnly;

  let msgDate = new Date(2026, 10, 15); // 游戏基准日 2026-11-15
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

// ==========================================
// 微信列表页
// ==========================================
const isGroup = (n) => /4组|公告|任务/.test(n);
function previewText(s, grp) {
  return s;
}
function avatarFor(name, group) {
  const r = CFG.roles && CFG.roles[name];
  if (r)
    return `<div class="app-icon-fallback" style="background:${r.color};font-size:20px">${r.initial}</div>`;
  return G.sil;
}
function otherUnread() {
  return Object.entries(unread)
    .filter(([k]) => k !== chatId)
    .reduce((a, [, b]) => a + b, 0);
}

VIEWS.kakao = () => {
  const list = chatNames.slice();
  return {
    cls: "wx-list",
    html: `
    <div class="wx-head">
        <h1>微信</h1>
        <div class="wx-actions">${G.wxSearch}${G.wxPlus}</div>
    </div>
    <div class="scroll">
        ${list
          .map((n) => {
            const arr = chatData[n] || [];
            let last = arr.filter((x) => x[1] !== "date").slice(-1)[0];
            let time = last
              ? last[2].replace(" PM", "").replace(" AM", "")
              : "";
            let cnt = unread[n] || 0;
            const badge = cnt
              ? `<span class="wx-badge">${cnt > 99 ? "99+" : cnt}</span>`
              : "";

            return `
            <button class="wx-item" onclick="chatId=${esc(JSON.stringify(n))};push('chat')">
                <div class="wx-av">
                    ${avatarFor(n, isGroup(n))}
                    ${badge}
                </div>
                <div class="wx-info">
                    <div class="wx-name">${esc(dn(n))}</div>
                    <div class="wx-msg">${last ? esc(previewText(last[0], isGroup(n))) : ""}</div>
                </div>
                <div class="wx-meta">
                    <span class="wx-time">${time}</span>
                </div>
            </button>`;
          })
          .join("")}
    </div>
    <div class="wx-tabbar">
        <button class="on"><span>${G.wechatTab}</span><small>微信</small></button>
        <button><span>${G.contactsTab}</span><small>通讯录</small></button>
        <button><span>${G.discoverTab}</span><small>发现</small></button>
        <button><span>${G.meTab}</span><small>我</small></button>
    </div>`,
  };
};

// ==========================================
// 微信聊天页
// ==========================================
function bubble(s) {
  return `<div class="wx-bb">${esc(s)}</div>`;
}

function chatItems(id) {
  const arr = chatData[id] || [];
  const items = [];
  arr.forEach((m) => {
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
    });
  });
  return items;
}

function chatMsgs(id) {
  const it = chatItems(id);
  let o = "";
  let currentDateLabel = "11月15日";

  it.forEach((x, i) => {
    if (x.date) {
      currentDateLabel = x.date;
      return;
    }

    const me = x.who === "me";
    const prev = it[i - 1];

    if (i === 1 || !prev || prev.date || prev.time !== x.time) {
      o += `<div class="wx-dpill"><span>${getWxTimeString(currentDateLabel, x.time)}</span></div>`;
    }

    o += `
    <div class="wx-ln ${me ? "me" : "th"}">
      <div class="wx-sav">${avatarFor(x.sender)}</div>
      <div class="wx-wrap">
        ${bubble(x.text)}
      </div>
    </div>`;
  });
  return o;
}

VIEWS.chat = () => ({
  cls: "wx-chat",
  html: `
  <div class="wx-chat-h">
      <button class="bk" onclick="back()">${G.chevL}</button>
      <div class="nm">${esc(dn(chatId))}</div>
      <div class="rt">${G.dotsH}</div>
  </div>
  <div class="msgs" id="msgs" onclick="closeKbd()">${chatMsgs(chatId)}</div>
  <div class="wx-cin safe" id="cin">
      <button class="ic" onclick="vib(10)">${G.wxVoice}</button>
      <div class="wx-fld ph" id="fld" onclick="event.stopPropagation();tapInput()">输入消息</div>
      <button class="ic" onclick="vib(10)">${G.wxEmoji}</button>
      <button class="ic" onclick="vib(10)">${G.wxPlus}</button>
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

// ==========================================
// 键盘系统与打字机
// ==========================================
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
  setTimeout(() => el.classList.remove("dn", "pv"), 95);
}
function kbdTap(e) {
  const k = e.target.closest(".key");
  if (!k) return;
  pressKey(k.dataset.k);
  vib(5);
  tapInput();
}

function genSteps(str) {
  const st = [];
  let done = "";
  for (const ch of str) {
    done += ch;
    st.push({ k: [ch === " " ? "space" : ch], t: done });
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
  const c = CFG.chats[chatId],
    st = SS.stage[chatId] || 0,
    li = SS.lineIdx[chatId] || 0;
  typeLine(c.replies[st].mine[li]);
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
    setTimeout(step, 60 + Math.random() * 70);
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

// ==========================================
// 消息收发与通知
// ==========================================
function showTypingFrom(from) {
  if (!(view === "chat" && chatId === from)) return;
  const b = $("#msgs");
  if (!b || $("#typ")) return;
  b.insertAdjacentHTML(
    "beforeend",
    `<div class="wx-ln th" id="typ"><div class="wx-sav">${avatarFor(from)}</div><div class="wx-wrap"><div class="wx-bb typing pop"><i></i><i></i><i></i></div></div></div>`,
  );
  scrollChat(true);
}
function showTyping() {
  showTypingFrom(chatId);
}
function hideTyping() {
  const t = $("#typ");
  if (t) t.remove();
}

function deliverFrom(from, text) {
  if (!chatData[from]) chatData[from] = [];
  chatData[from].push([text, "them", nowAmpm()]);
  if (view === "chat" && chatId === from) {
    refreshChat(true);
    tone(1318, 0, 0.12, 0.05);
  } else {
    unread[from] = (unread[from] || 0) + 1;
    notifyFrom(from, text);
    if (view === "kakao") show("kakao");
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
  sfx("msg");
  vib([30, 60, 30]);
  if (view === "lock" || view === "pin") {
    lockNotes.unshift({ title: dn(from), body, app: "kakao", time: t("now") });
    renderLock();
    return;
  }
  OV.querySelectorAll(".banner").forEach((b) => b.remove());
  const b = document.createElement("div");
  b.className = "banner";
  b.innerHTML = `<div class="ncard">${ncardHTML({ title: dn(from), body, app: "kakao", time: t("now") })}</div>`;
  OV.appendChild(b);
  b.animate(
    [{ transform: "translateY(-140%) scale(.96)" }, { transform: "none" }],
    { duration: 620, easing: "cubic-bezier(.2,1.25,.35,1)" },
  );
  const tm = setTimeout(() => b.remove(), 5600);
  b.addEventListener("pointerup", () => {
    clearTimeout(tm);
    b.remove();
    openChatFrom(from);
  });
}
function openChatFrom(from) {
  if (callState) return;
  chatId = from;
  if (view === "home")
    openApp("chat", HOME.querySelector('.app[data-app="kakao"] .icon'));
  else if (view !== "chat") push("chat");
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
