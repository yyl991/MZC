// 聊天核心逻辑
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
    cls: "kk",
    html: `<div class="kk-h"><b>微信</b><span>${G.search}${G.chatPlus}${G.gear}</span></div><div class="scroll">${list
      .map((n) => {
        const arr = chatData[n] || [];
        let last = arr.filter((x) => x[1] !== "date").slice(-1)[0],
          time = last ? last[2] : "",
          cnt = unread[n] || 0;
        return `<button class="crow" onclick="chatId=${esc(JSON.stringify(n))};push('chat')"><div class="av">${avatarFor(n, isGroup(n))}</div><div style="flex:1;min-width:0"><div class="cn">${esc(dn(n))}</div><div class="cp">${last ? esc(previewText(last[0], isGroup(n))) : ""}</div></div><div class="cm"><span class="ct">${time}</span>${cnt ? `<span class="kbdg">${cnt}</span>` : ""}</div></button>`;
      })
      .join("")}</div>${tabbar(
      [
        ["person", "通讯录"],
        ["chat", "聊天"],
        ["openchat", "发现"],
        ["bag", "我"],
        ["dotsH", "更多"],
      ],
      1,
    )}`,
  };
};
function bubble(s) {
  return `<div class="bb">${esc(s)}</div>`;
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
  it.forEach((x, i) => {
    if (x.date) {
      o += `<div class="dpill"><span>${x.date}</span></div>`;
      return;
    }
    const p = it[i - 1],
      n = it[i + 1];
    const first = !p || p.date || p.who !== x.who || p.sender !== x.sender;
    const me = x.who === "me";
    o += `<div class="ln ${me ? "me" : "th"} ${first ? "first" : ""}">${!me && first ? `<div class="sav">${avatarFor(x.sender)}</div>` : ""}<div class="col" style="${me ? "align-items:flex-end" : ""}">${!me && first ? `<div class="who">${esc(dn(x.sender))}</div>` : ""}<div class="wrap">${bubble(x.text)}</div></div></div>`;
  });
  return o;
}
VIEWS.chat = () => ({
  cls: "chat",
  html: `<div class="chat-h"><button class="bk" onclick="back()">${G.chevL}<span>${otherUnread() || ""}</span></button><div class="nm">${esc(dn(chatId))}</div><div class="rt">${G.search}${G.dotsH}</div></div><div class="msgs" id="msgs" onclick="closeKbd()">${chatMsgs(chatId)}</div><div class="cin safe" id="cin">${G.plusSq}<div class="fld ph" id="fld" onclick="event.stopPropagation();tapInput()">输入消息</div>${G.smile}<button class="snd" id="snd" onclick="sendLine()">${G.arrowUp}</button></div><div class="kbd" id="kbd">${kbdHTML()}</div>`,
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
    const l = b.lastElementChild && b.lastElementChild.querySelector(".bb");
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
    f.className = "fld ph";
    f.textContent = "输入消息";
    return;
  }
  f.className = "fld";
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

function showTypingFrom(from) {
  if (!(view === "chat" && chatId === from)) return;
  const b = $("#msgs");
  if (!b || $("#typ")) return;
  b.insertAdjacentHTML(
    "beforeend",
    `<div class="ln th first" id="typ"><div class="sav">${avatarFor(from)}</div><div class="col"><div class="wrap"><div class="bb typing pop"><i></i><i></i><i></i></div></div></div></div>`,
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
