function getWxTimeString(dateLabel, timeStr) {
  if (/昨天|前天|周[一二三四五六日]|\d{4}年/.test(timeStr)) return timeStr;

  let h = 0,
    m = 0;
  // 先尝试匹配中文 "下午 11:11"
  let match = timeStr.match(/(上午|下午)\s*(\d+):(\d+)/);
  if (match) {
    h = parseInt(match[2]);
    m = parseInt(match[3]);
    if (match[1] === "下午" && h < 12) h += 12;
    if (match[1] === "上午" && h === 12) h = 0;
  } else {
    // 兼容英文 "11:11 PM"
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
  // 过滤掉还没有任何聊天记录的人（只显示弹过消息的人）
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
            <button class="wx-item" onclick="chatId=${esc(JSON.stringify(n))};push('chat')">
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
        <button><span>${tabContacts}</span><small>通讯录</small></button>
        <button onclick="push('wx_discover')"><span>${tabDiscover}</span><small>发现</small></button>
        <button><span>${tabMe}</span><small>我</small></button>
    </div>`,
  };
};

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

  // 辅助函数：把时间字符串转成总分钟数，用于计算 5 分钟间隔
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

    // 微信时间戳显示逻辑：当天第一条、或者间隔大于等于 5 分钟才显示
    let showTime = false;
    if (i === 1 || !prev || prev.date) {
      showTime = true;
    } else {
      const currMin = getMins(x.time);
      const prevMin = getMins(prev.time);
      if (currMin - prevMin >= 5 || currMin < prevMin) showTime = true;
    }

    if (showTime) {
      o += `<div class="wx-dpill"><span>${getWxTimeString(currentDateLabel, x.time)}</span></div>`;
    }

    o += `
    <div class="wx-ln ${me ? "me" : "th"}">
      <div class="wx-sav">${avatarFor(x.sender)}</div>
      <div class="wx-wrap"><div class="wx-bb">${esc(x.text)}</div></div>
    </div>`;
  });
  return o;
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
      <button class="ic" onclick="vib(10)">${G.mic}</button>
      <div class="wx-fld ph" id="fld" onclick="event.stopPropagation();tapInput()">输入消息</div>
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
  ) {
    el.classList.add("pv");
  }
  sfx("key");

  // 动画停留时间拉长到 130ms，肉眼可以捕捉到
  setTimeout(() => el.classList.remove("dn", "pv"), 130);
}
function kbdTap(e) {
  const k = e.target.closest(".key");
  if (!k) return;

  // 如果已经在自动打字中，忽略其他按键的干扰
  if (SS.typing) {
    pressKey(k.dataset.k);
    vib(5);
    return;
  }

  // 如果你还没打字，且当前可以打字，随便按键盘上的一个键，就会触发“自动打字”
  if (!SS.pendingText && canType()) {
    const c = CFG.chats[chatId],
      st = SS.stage[chatId] || 0,
      li = SS.lineIdx[chatId] || 0;
    typeLine(c.replies[st].mine[li]);
    return;
  }

  // 其他情况，正常反馈按键
  pressKey(k.dataset.k);
  vib(5);
}

// 模拟中文输入法敲击：遇到中文时，随机找几个英文字母来敲
function genSteps(str) {
  const st = [];
  let done = "";
  const letters = "qwertyuiopasdfghjklzxcvbnm".split("");

  for (const ch of str) {
    done += ch;
    let k = [];
    if (ch === " ") {
      k = ["space"];
    } else if (/[a-zA-Z0-9]/.test(ch)) {
      k = [ch.toLowerCase()];
    } else {
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
  // 点输入框只显示光标，不自动打字
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

    // 控制每个字出现的间隔（120ms - 220ms 随机）
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

// 显示“对方正在输入” (直接替换标题文字)
function showTypingFrom(from) {
  if (!(view === "chat" && chatId === from)) return;
  const title = $("#chatTitle");
  if (title) title.textContent = "对方正在输入...";
}
// 隐藏“对方正在输入” (恢复原本的名字)
function hideTyping() {
  const title = $("#chatTitle");
  if (title && view === "chat") title.textContent = dn(chatId);
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
