const MOCK_MOMENTS_DATA = {
  "穆祉丞": {
    wxid: "mzc_1108",
    region: "重庆",
    cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=800",
    posts: [
      {
        id: 1,
        date: { day: "今天", month: "" },
        text: "皇马早晚十一个幽灵在场上踢球。",
        images: [],
        location: "",
        time: "刚刚",
        likes: ["穆小恩", "恩仔"],
        comments: [
          { user: "穆小恩", text: "晚上出来吃夜宵不？", replyTo: "" },
          { user: "穆祉丞", text: "好啊，老地方见。", replyTo: "穆小恩" }
        ]
      },
      {
        id: 2,
        date: { day: "16", month: "10月" },
        text: "突然翻到一张绝望的饭撒牌。",
        images: ["https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=500"],
        location: "",
        time: "2026年10月16日 22:51",
        likes: ["恩仔", "丞哥", "穆老爹"],
        comments: [
          { user: "恩仔", text: "奇缘2028呢。", replyTo: "" },
          { user: "穆祉丞", text: "郑棋元说听不懂给你比个心吧。", replyTo: "恩仔" }
        ]
      }
    ]
  },
  "穆小恩": {
    wxid: "muxiaoen_99",
    region: "北京",
    cover: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800",
    posts: [
      {
        id: 3,
        date: { day: "昨天", month: "" },
        text: "今天的晚霞太绝了，分享给大家！🌇",
        images: ["https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?q=80&w=500"],
        location: "",
        time: "昨天 18:30",
        likes: ["穆祉丞", "恩仔"],
        comments: [
          { user: "恩仔", text: "真的好看！在哪儿拍的？", replyTo: "" },
          { user: "穆小恩", text: "就在家楼下哈哈。", replyTo: "恩仔" }
        ]
      }
    ]
  },
  "恩仔": {
    wxid: "enzai_0412",
    region: "浙江",
    cover: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800",
    posts: [
      {
        id: 4,
        date: { day: "15", month: "10月" },
        text: "我的猫今天终于愿意理我了，感动哭了😭",
        images: [
          "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=300",
          "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=300"
        ],
        location: "",
        time: "2026年10月15日 21:00",
        likes: ["穆小恩"],
        comments: [
          { user: "穆小恩", text: "猫主子是这样的，习惯就好。", replyTo: "" }
        ]
      }
    ]
  },
  "丞哥": {
    wxid: "cheng_ge",
    region: "北京",
    cover: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800",
    posts: [
      {
        id: 5,
        date: { day: "12", month: "10月" },
        text: "今天腿练废了。",
        images: ["https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=500"],
        location: "",
        time: "2026年10月12日 19:30",
        likes: ["穆祉丞"],
        comments: []
      }
    ]
  }
};

// ============ 朋友圈跳转来源管理 ============
window._wxMomentFeed = [];
window._wxMomentUserFeed = [];
window._momentDetailFrom = "moments";
window._profileFrom = "chat";
window._momentsUserFrom = "wx_profile";

// ============ 微信运行状态 ============
window._wxMyPosts = window._wxMyPosts || [];
window._wxChatSettings = window._wxChatSettings || {};
window._wxDiscoverNew = true;
window._wxNotifyOn = true;
window._wxComposeImages = [];
window._wxSearchQuery = "";
window._wxSearchFrom = "wechat";
window._wxSearchScope = "";
window._wxPanelType = "";
window._wxHoldFired = false;
window._wxScanFrom = "wx_me";

function wxTabDot() {
  return window._wxDiscoverNew
    ? `<span style="position:absolute;top:4px;right:22px;width:8px;height:8px;background:#fa5151;border-radius:50%;"></span>`
    : "";
}
function wxChatTabBadge() {
  const total = Object.values(unread || {}).reduce((a, b) => a + b, 0);
  if (!total) return "";
  return `<span class="wx-tab-badge">${total > 99 ? "99+" : total}</span>`;
}

// ============ 通用底部操作菜单 ============
window.wxCloseSheet = function () {
  document.querySelectorAll(".wx-sheet-wrap").forEach((w) => w.remove());
  window._wxSheetItems = null;
  window._wxPromptCb = null;
};
window.wxActionSheet = function (title, items) {
  wxCloseSheet();
  window._wxSheetItems = items || [];
  const wrap = document.createElement("div");
  wrap.className = "wx-sheet-wrap";
  wrap.innerHTML = `
    <div class="wx-sheet-mask" onclick="wxCloseSheet()"></div>
    <div class="wx-sheet">
      ${title ? `<div class="wx-sheet-title">${esc(title)}</div>` : ""}
      ${window._wxSheetItems
        .map(
          (it, i) =>
            `<button class="wx-sheet-item ${it.danger ? "danger" : ""}" onclick="wxRunSheetItem(${i})">${esc(it.label)}</button>`,
        )
        .join("")}
      <button class="wx-sheet-item" onclick="wxCloseSheet()">取消</button>
    </div>`;
  document.getElementById("screen").appendChild(wrap);
};
window.wxRunSheetItem = function (i) {
  const it = (window._wxSheetItems || [])[i];
  wxCloseSheet();
  if (it && it.onClick) setTimeout(it.onClick, 0);
};

// ============ 内置数字键盘（红包 / 转账用，不弹系统键盘） ============
window.wxAmountPad = function (title, placeholder, cb) {
  wxCloseSheet();
  window._wxPadVal = "";
  window._wxPadPh = placeholder || "0.00";
  window._wxPadCb = cb;
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "⌫"];
  const wrap = document.createElement("div");
  wrap.className = "wx-sheet-wrap";
  wrap.innerHTML = `
    <div class="wx-sheet-mask" onclick="wxCloseSheet()"></div>
    <div class="wx-sheet" style="padding-bottom:calc(10px + env(safe-area-inset-bottom))">
      <div class="wx-sheet-title">${esc(title)}</div>
      <div id="wx-pad-val" style="text-align:center;font-size:34px;font-weight:500;color:#c7c7cc;padding:6px 16px 14px;letter-spacing:1px;">${esc(window._wxPadPh)}</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:0 14px 12px;">
        ${keys
          .map(
            (k) =>
              `<button class="wx-pad-key" onclick="wxPadTap('${k}')">${k}</button>`,
          )
          .join("")}
      </div>
      <button class="wx-sheet-item" id="wx-pad-done" style="color:#b2b2b2;font-weight:600;" onclick="wxPadDone()">确定</button>
      <button class="wx-sheet-item" onclick="wxCloseSheet()">取消</button>
    </div>`;
  document.getElementById("screen").appendChild(wrap);
};
window.wxPadTap = function (k) {
  if (k === "⌫") window._wxPadVal = window._wxPadVal.slice(0, -1);
  else if (k === "." && window._wxPadVal.indexOf(".") >= 0) return;
  else if (window._wxPadVal.length >= 8) return;
  else {
    if (k === "." && !window._wxPadVal) window._wxPadVal = "0";
    window._wxPadVal += k;
  }
  if (typeof vib === "function") vib(6);
  const el = document.getElementById("wx-pad-val");
  if (el) {
    el.textContent = window._wxPadVal || window._wxPadPh;
    el.style.color = window._wxPadVal ? "#111" : "#c7c7cc";
  }
  const d = document.getElementById("wx-pad-done");
  if (d) d.style.color = window._wxPadVal ? "#07c160" : "#b2b2b2";
};
window.wxPadDone = function () {
  const v = window._wxPadVal;
  const cb = window._wxPadCb;
  if (!v) return;
  wxCloseSheet();
  if (cb) cb(v);
};

// ============ 通用输入弹窗 ============
window.wxPrompt = function (title, placeholder, cb) {
  wxCloseSheet();
  window._wxPromptCb = cb;
  const wrap = document.createElement("div");
  wrap.className = "wx-sheet-wrap";
  wrap.innerHTML = `
    <div class="wx-sheet-mask" onclick="wxCloseSheet()"></div>
    <div class="wx-prompt">
      <div class="wx-prompt-title">${esc(title)}</div>
      <input class="wx-prompt-input" id="wx-prompt-input" placeholder="${esc(placeholder || "")}" />
      <div class="wx-prompt-btns">
        <button onclick="wxCloseSheet()">取消</button>
        <button class="primary" onclick="wxSubmitPrompt()">确定</button>
      </div>
    </div>`;
  document.getElementById("screen").appendChild(wrap);
  setTimeout(() => {
    const i = document.getElementById("wx-prompt-input");
    if (i) i.focus();
  }, 60);
};
window.wxSubmitPrompt = function () {
  const i = document.getElementById("wx-prompt-input");
  const v = i ? i.value.trim() : "";
  const cb = window._wxPromptCb;
  wxCloseSheet();
  if (v && cb) cb(v);
};

// 长按后拦截紧随其后的 click
document.addEventListener(
  "click",
  (e) => {
    if (window._wxHoldFired) {
      window._wxHoldFired = false;
      e.stopPropagation();
      e.preventDefault();
    }
  },
  true,
);

window.openWxProfileByName = function (name, from) {
  if (!name || name === "小狗团汪汪" || name === "我" || name === "系统") return toastDev();
  chatId = name;
  window._profileFrom = from || "chat";
  push("wx_profile");
};

window.openMomentDetailFromFeed = function (index) {
  const post = window._wxMomentFeed && window._wxMomentFeed[index];
  if (!post) return toastDev();
  window._momentDetailFrom = "moments";
  window._currentMomentDetail = {
    author: post.author,
    authorId: post.author,
    avatar: post.avatar,
    post: post,
  };
  push("wx_moments_detail");
};

window.openMomentDetailFromUserFeed = function (index) {
  const post = window._wxMomentUserFeed && window._wxMomentUserFeed[index];
  if (!post) return toastDev();
  const name = wxName(chatId);
  const av = (CFG.roles && CFG.roles[chatId] && CFG.roles[chatId].avatar) || G.sil;
  window._momentDetailFrom = "wx_moments_user";
  window._currentMomentDetail = {
    author: name,
    authorId: chatId,
    avatar: av,
    post: post,
  };
  push("wx_moments_detail");
};

window.openWxProfileFromFeed = function (index, from) {
  const post = window._wxMomentFeed && window._wxMomentFeed[index];
  if (!post) return toastDev();
  window.openWxProfileByName(post.author, from || "moments");
};

window.openWxProfileFromDetail = function () {
  const d = window._currentMomentDetail;
  if (!d || !(d.authorId || d.author)) return toastDev();
  window.openWxProfileByName(d.authorId || d.author, "wx_moments_detail");
};

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
  if (msgDate.getFullYear() === today.getFullYear())
    return `${msgDate.getMonth() + 1}月${msgDate.getDate()}日 ${timeOnly}`;
  return `${msgDate.getFullYear()}年${msgDate.getMonth() + 1}月${msgDate.getDate()}日 ${timeOnly}`;
}

const isGroup = (n) => /4组|公告|任务/.test(n);
function previewText(s, grp) {
  if (s.startsWith("[图片]")) return "[图片]";
  if (s.startsWith("[表情]")) return "[表情]";
  if (s.startsWith("[语音]")) return "[语音]";
  if (s.startsWith("[视频]")) return "[视频]";
  if (s.startsWith("[位置]")) return "[位置]";
  if (s.startsWith("[红包]")) return "[红包]";
  if (s.startsWith("[转账]")) return "[转账]";
  return s;
}
window._wxRemarks = window._wxRemarks || {};
function wxName(n) {
  return (
    (window._wxRemarks && window._wxRemarks[n]) ||
    (typeof DISPLAY !== "undefined" && DISPLAY[n]) ||
    n
  );
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

VIEWS.wechat = () => {
  const list = chatNames
    .filter((n) => {
      const arr = chatData[n] || [];
      return arr.some((x) => x[1] !== "date");
    })
    .sort((a, b) => {
      const ta = window._wxChatSettings?.[a]?.top ? 1 : 0;
      const tb = window._wxChatSettings?.[b]?.top ? 1 : 0;
      return tb - ta;
    });
  return {
    cls: "wx-list",
    html: `
    <div class="wx-head"><div class="wx-head-left"></div><h1>微信${(() => {
      const t = Object.values(unread || {}).reduce((a, b) => a + b, 0);
      return t > 0 ? `(${t > 99 ? "99+" : t})` : "";
    })()}</h1><div class="wx-actions"><span style="display:flex;cursor:pointer;" onclick="openWxSearch('wechat')">${G.wxSearch}</span><span style="display:flex;cursor:pointer;" onclick="wxOpenAddMenu()">${G.wxPlus}</span></div></div>
    <div class="wx-scroll"><div class="wx-pc-bar" onclick="toastDev()"><span class="wx-pc-ic">${G.wxPcLogin}</span><span>已登录Windows电脑</span></div>${list
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
        return `<button class="wx-item" onclick="window._chatBackTo=null;chatId=&quot;${n}&quot;;push('chat')"><div class="wx-av">${avatarFor(n, isGroup(n))}${badge}</div><div class="wx-info"><div class="wx-name">${esc(wxName(n))}</div><div class="wx-msg">${last ? esc(previewText(last[0], isGroup(n))) : ""}</div></div><div class="wx-meta"><span class="wx-time">${time}</span></div></button>`;
      })
      .join("")}</div>
    <div class="wx-tabbar">
      <button class="on" style="position:relative;"><span>${G.wxTabChat}</span>${wxChatTabBadge()}<small>微信</small></button>
      <button onclick="show('wx_contacts')"><span>${G.wxTabContacts}</span><small>通讯录</small></button>
      <button onclick="show('wx_discover')" style="position:relative;"><span>${G.wxTabDiscover}</span>${wxTabDot()}<small>发现</small></button>
      <button onclick="show('wx_me')"><span>${G.wxTabMe}</span><small>我</small></button>
    </div>`,
  };
};

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
    let innerContent = "",
      bubbleClass = "wx-bb",
      onclickAttr = "";
    if (x.text.startsWith("[图片]")) {
      const imgUrl = x.text.replace("[图片]", "").trim();
      innerContent = `<img src="${imgUrl}" class="wx-img" style="cursor:pointer;" onerror="wxMediaMiss(this,'图片未找到')" onclick="event.stopPropagation();openMediaViewer(['${imgUrl}'], 0)" />`;
      bubbleClass = "wx-bb img-bb";
    } else if (x.text.startsWith("[表情]")) {
      const emoUrl = x.text.replace("[表情]", "").trim();
      innerContent = `<img src="${emoUrl}" class="wx-emoji" onerror="wxMediaMiss(this,'表情')" />`;
      bubbleClass = "wx-bb emo-bb";
    } else if (x.text.startsWith("[语音]")) {
      const raw = x.text.replace("[语音]", "").trim();
      const parts = raw.split("|");
      const sec = parseInt(parts[0]) || 1;
      const audioUrl = parts[1] || "";
      const bubbleWidth = Math.max(80, Math.min(200, 60 + sec * 8));
      innerContent = `<div style="display: flex; align-items: center; justify-content: ${me ? "flex-end" : "flex-start"}; width: ${bubbleWidth}px;">${!me ? `<span class="voice-speaker">${G.speaker}</span><span class="voice-sec">${sec}"</span>` : ""}${me ? `<span class="voice-sec">${sec}"</span><span class="voice-speaker me">${G.speaker}</span>` : ""}</div>`;
      bubbleClass = "wx-bb voice-bb";
      onclickAttr = `onclick="playVoice(this, '${audioUrl}', ${sec})"`;
    } else if (x.text.startsWith("[视频]")) {
      const parts = x.text.replace("[视频]", "").trim().split("|");
      const videoUrl = parts[0];
      const coverUrl = parts[1];
      const timeStr = parts[2] || "0:00";
      const coverHTML =
        coverUrl && coverUrl !== videoUrl
          ? `<img src="${coverUrl}" style="width:100%; height:100%; object-fit:cover; position:absolute; inset:0;">`
          : `<video src="${videoUrl}" muted preload="metadata" style="width:100%; height:100%; object-fit:cover; position:absolute; inset:0; pointer-events:none;"></video>`;
      innerContent = `${coverHTML}<div class="wx-video-play">▶</div><div class="wx-video-time">${timeStr}</div>`;
      bubbleClass = "wx-bb video-bb";
      onclickAttr = `onclick="event.stopPropagation();openMediaViewer(['${videoUrl}'], 0)"`;
    } else if (x.text.startsWith("[位置]")) {
      const raw = x.text.replace("[位置]", "").trim();
      const [locName, locAddr] = raw.split("|");
      innerContent = `<div class="wx-card wx-loc-card"><div class="wx-card-body"><div class="wx-card-title">${esc(locName || "位置")}</div><div class="wx-card-sub">${esc(locAddr || "")}</div></div><div class="wx-card-emoji">📍</div></div>`;
      bubbleClass = "wx-bb card-bb";
      onclickAttr = `onclick="event.stopPropagation();toastDev('地图功能还没接入这个宇宙~')"`;
    } else if (x.text.startsWith("[红包]")) {
      const raw = x.text.replace("[红包]", "").trim();
      const [rpText, rpAmount] = raw.split("|");
      innerContent = `<div class="wx-card wx-red-card"><div class="wx-card-emoji">🧧</div><div class="wx-card-body"><div class="wx-card-title">${esc(rpText || "恭喜发财，大吉大利")}</div><div class="wx-card-sub">${rpAmount ? "￥" + esc(rpAmount) + " · " : ""}微信红包</div></div></div>`;
      bubbleClass = "wx-bb card-bb";
      onclickAttr = `onclick="event.stopPropagation();toastDev('红包已存入零钱~')"`;
    } else if (x.text.startsWith("[转账]")) {
      const raw = x.text.replace("[转账]", "").trim();
      const [trAmount, trNote] = raw.split("|");
      innerContent = `<div class="wx-card wx-transfer-card"><div class="wx-card-body"><div class="wx-card-title">￥${esc(trAmount || "0.00")}</div><div class="wx-card-sub">${esc(trNote || "转账")}</div></div><div class="wx-card-emoji">💸</div></div>`;
      bubbleClass = "wx-bb card-bb";
      onclickAttr = `onclick="event.stopPropagation();toastDev('转账已收款~')"`;
    } else {
      innerContent = esc(x.text);
    }
    const holdEvent = `onpointerdown="startHoldMsg(event, ${x.rawIdx})" onpointerup="cancelHoldMsg()" onpointerleave="cancelHoldMsg()"`;
    let dotHtml = "",
      btnHtml = "",
      textHtml = "";
    if (!me && x.text.startsWith("[语音]")) {
      dotHtml = `<span class="voice-unread" id="dot-${x.rawIdx}" style="width:8px;height:8px;background:#ff3b30;border-radius:50%;flex:none;"></span>`;
      const parts = x.text.replace("[语音]", "").trim().split("|");
      const transTxt = parts[2] || "";
      if (transTxt) {
        btnHtml = `<div class="voice-trans-btn" onclick="toggleVoiceText(this)">转文字</div>`;
        textHtml = `<div class="voice-trans-text">${esc(transTxt)}</div>`;
      }
    }
    o += `<div class="wx-ln ${me ? "me" : "th"}"><div class="wx-sav" onclick="event.stopPropagation();wxPatTap(event,${me})">${avatarFor(x.sender, false, me)}</div><div style="display: flex; flex-direction: column; align-items: ${me ? "flex-end" : "flex-start"}; max-width: calc(100% - 60px);"><div style="display: flex; align-items: center; flex-direction: ${me ? "row-reverse" : "row"}; gap: 6px;"><div class="${bubbleClass}" data-idx="${x.rawIdx}" ${onclickAttr} ${holdEvent}>${innerContent}</div>${!me ? dotHtml : ""}${!me ? btnHtml : ""}</div>${textHtml}</div></div>`;
  });
  return o;
}

// 素材缺失时给个占位，不要留破图
window.wxMediaMiss = function (el, label) {
  if (!el || !el.parentNode) return;
  const d = document.createElement("div");
  d.className = "wx-media-miss";
  d.textContent = label || "图片未找到";
  el.parentNode.replaceChild(d, el);
};

let holdTimer = null;
function startHoldMsg(e, rawIdx) {
  if (SS.typing) return;
  cancelHoldMsg();
  holdTimer = setTimeout(() => {
    holdTimer = null;
    window._wxHoldFired = true;
    setTimeout(() => {
      window._wxHoldFired = false;
    }, 900);
    vib(20);
    openMsgActions(rawIdx);
  }, 600);
}
function cancelHoldMsg() {
  if (holdTimer) {
    clearTimeout(holdTimer);
    holdTimer = null;
  }
}
function wxCopyText(text) {
  const done = () => toastDev("已复制");
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, done);
      return;
    }
  } catch (e) {}
  const ta = document.createElement("textarea");
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand("copy");
  } catch (e) {}
  ta.remove();
  done();
}
function wxForwardMsg(rawIdx) {
  const arr = chatData[chatId];
  const msg = arr && arr[rawIdx];
  if (!msg) return;
  const others = chatNames.filter((n) => n !== chatId);
  if (!others.length) return toastDev("没有可以转发的聊天~");
  wxActionSheet(
    "转发给",
    others.map((n) => ({
      label: wxName(n),
      onClick: () => {
        if (!chatData[n]) chatData[n] = [];
        chatData[n].push([msg[0], "me", nowAmpm()]);
        saveChat();
        toastDev("已转发给 " + wxName(n));
      },
    })),
  );
}
function openMsgActions(rawIdx) {
  const arr = chatData[chatId];
  const msg = arr && arr[rawIdx];
  if (!msg || msg[1] === "sys") return;
  const me = msg[1] === "me";
  const text = String(msg[0] || "");
  const plain = !/^\[(图片|表情|语音|视频|位置|红包|转账)\]/.test(text);
  const items = [];
  if (plain) items.push({ label: "复制", onClick: () => wxCopyText(text) });
  items.push({ label: "转发", onClick: () => wxForwardMsg(rawIdx) });
  if (me)
    items.push({
      label: "撤回",
      onClick: () => {
        const cur = chatData[chatId][rawIdx];
        if (!cur) return;
        chatData[chatId][rawIdx] = [
          "你撤回了一条消息",
          "sys",
          cur[2] || nowAmpm(),
        ];
        saveChat();
        refreshChat();
      },
    });
  items.push({
    label: "删除",
    danger: true,
    onClick: () => {
      const cur = chatData[chatId];
      if (!cur || !cur[rawIdx]) return;
      cur.splice(rawIdx, 1);
      saveChat();
      refreshChat();
    },
  });
  wxActionSheet("", items);
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

let voiceAudio = null,
  currentVoiceEl = null;
function playVoice(el, url, sec) {
  if (currentVoiceEl === el && voiceAudio && !voiceAudio.paused) {
    voiceAudio.pause();
    el.classList.remove("playing");
    currentVoiceEl = null;
    resumeBGM();
    return;
  }
  if (voiceAudio) {
    voiceAudio.pause();
    voiceAudio = null;
  }
  if (currentVoiceEl) {
    currentVoiceEl.classList.remove("playing");
    currentVoiceEl = null;
  }
  el.classList.add("playing");
  currentVoiceEl = el;
  const idx = el.getAttribute("data-idx");
  if (idx) {
    const dot = document.getElementById(`dot-${idx}`);
    if (dot) dot.style.display = "none";
  }
  pauseBGM();
  if (url) {
    voiceAudio = new Audio(url);
    voiceAudio.volume = 0.9;
    voiceAudio.play().catch(() => {
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
    const targetName = wxName(chatId);
    msg = `"你" 拍了拍 "${targetName}"${targetSuffix ? " " + targetSuffix : ""}`;
  }
  chatData[chatId].push([msg, "sys", time]);
  saveChat();
  refreshChat(true);
}
// 头像单击不跳个人主页，双击 = 拍一拍
window.wxPatTap = function (e, isSelf) {
  const el = e && e.currentTarget;
  const now = Date.now();
  if (el && el._patT && now - el._patT < 320) {
    el._patT = 0;
    doPat(isSelf);
    return;
  }
  if (el) el._patT = now;
};
function toggleVoiceInput() {
  closeKbd();
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
    <div class="nm" id="chatTitle" onclick="window.openWxProfileByName(chatId, 'chat')" style="cursor:pointer;">${esc(wxName(chatId))}</div>
    <div class="rt" onclick="openWxChatInfo()" style="cursor:pointer;">${G.dotsH}</div>
  </div>
  <div class="msgs" id="msgs" onclick="closeKbd()">${chatMsgs(chatId)}</div>
  <div class="wx-cin safe" id="cin"><button class="ic" id="voice-icon" onclick="vib(10);toggleVoiceInput()">${G.mic}</button><div class="wx-fld ph" id="fld" onclick="event.stopPropagation();tapInput()">输入消息</div><button class="wx-voice-btn" id="voice-btn" onpointerdown="startRecord(event)" onpointerup="endRecord(event)" onpointerleave="endRecord(event)">按住 说话</button><button class="ic" onclick="event.stopPropagation();toggleWxPanel('emoji')">${G.smile}</button><button class="ic" onclick="event.stopPropagation();toggleWxPanel('plus')">${G.plusSq}</button><button class="wx-snd" id="snd" onclick="sendLine()">发送</button></div>
  <div class="kbd" id="kbd">${kbdHTML()}</div>
  <div class="wx-panel" id="wx-panel"></div>`,
  init: () => {
    if (chatId) unread[chatId] = 0;
    SS.typing = false; SS.pendingText = ""; scrollChat();
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
  closeWxPanel();
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
function closeWxPanel() {
  const p = $("#wx-panel");
  if (!p || !p.classList.contains("open")) return;
  p.classList.remove("open");
  window._wxPanelType = "";
  $("#cin").classList.add("safe");
}
function closeKbd() {
  const k = $("#kbd");
  if (k && k.classList.contains("open")) k.classList.remove("open");
  closeWxPanel();
  const c = $("#cin");
  if (c) c.classList.add("safe");
}

// ============ 表情 / 更多面板 ============
const WX_EMOJIS = [
  "😀", "😁", "😂", "🤣", "😊", "😍", "😘", "😜",
  "😎", "🤔", "😅", "😭", "😡", "👍", "👏", "🙏",
  "💪", "🎉", "❤️", "💔", "🌹", "🍻", "🐶", "🐱",
  "🐼", "🐷", "🌈", "☀️", "🌙", "⭐", "🔥", "💯",
  "🍰", "🎂", "🎁", "🧧", "😴", "🤗", "😏", "🥰",
  "😇", "🤩", "😱", "🥺", "😤", "🙄", "😬", "🤝",
];
function wxEmojiPanelHTML() {
  return `<div class="wx-panel-in">
    <div class="wx-emoji-grid">${WX_EMOJIS.map(
      (e) => `<button onclick="wxSendEmoji('${e}')">${e}</button>`,
    ).join("")}</div>
    <div class="wx-panel-tip">点击表情直接发送</div>
  </div>`;
}
function wxPlusPanelHTML() {
  const items = [
    [G.wxAbAlbum, "相册", "album"],
    [G.wxAbCamera, "拍摄", "camera"],
    [G.wxAbVideo, "视频通话", "video"],
    [G.wxAbLocation, "位置", "location"],
    [G.wxAbRedPacket, "红包", "redpacket"],
    [G.wxAbGift, "礼物", "gift"],
    [G.wxAbTransfer, "转账", "transfer"],
    [G.wxAbFav, "收藏", "fav"],
  ];
  return `<div class="wx-panel-in"><div class="wx-plus-grid">${items
    .map(
      ([ic, label, key]) =>
        `<button onclick="wxPlusAction('${key}')"><span class="wx-plus-ic">${ic}</span><span>${label}</span></button>`,
    )
    .join(
      "",
    )}</div><div class="wx-plus-dots"><i class="on"></i><i></i></div></div>`;
}
function toggleWxPanel(type) {
  const p = $("#wx-panel");
  if (!p) return;
  if (window._wxPanelType === type) {
    closeKbd();
    return;
  }
  const k = $("#kbd");
  if (k && k.classList.contains("open")) k.classList.remove("open");
  window._wxPanelType = type;
  p.innerHTML = type === "emoji" ? wxEmojiPanelHTML() : wxPlusPanelHTML();
  p.classList.add("open");
  $("#cin").classList.remove("safe");
  scrollChat();
  setTimeout(() => scrollChat(), 320);
}
window.wxPlusAction = function (key) {
  closeKbd();
  setTimeout(() => {
    if (key === "album") return wxPickChatPhoto();
    if (key === "camera") return toastDev();
    if (key === "gift") return toastDev();
    if (key === "fav") return toastDev();
    if (key === "video") return wxStartVideoCall();
    if (key === "location") return wxSendLocation();
    if (key === "redpacket") return wxSendRedPacket();
    if (key === "transfer") return wxSendTransfer();
    if (key === "voice") return wxSwitchToVoice();
  }, 60);
};
window.wxSendEmoji = function (ch) {
  if (!chatData[chatId]) return;
  chatData[chatId].push([ch, "me", nowAmpm()]);
  saveChat();
  refreshChat(true);
  sfx("send");
  vib(8);
};
window.wxPickChatPhoto = function () {
  if (typeof openPhoneAlbumPicker !== "function")
    return toastDev("相册还没准备好~");
  openPhoneAlbumPicker({
    multiple: true,
    max: 9,
    onDone: function (urls) {
      if (!chatData[chatId]) return;
      urls.forEach(function (u) {
        const isVideo = /\.(mp4|webm|mov)$/i.test(u);
        chatData[chatId].push([
          isVideo ? `[视频] ${u}||0:15` : `[图片] ${u}`,
          "me",
          nowAmpm(),
        ]);
      });
      saveChat();
      refreshChat(true);
      sfx("send");
      vib(10);
    },
  });
};
window.wxStartVideoCall = function () {
  if (typeof callState !== "undefined" && callState) return;
  if (typeof dial === "function") {
    dial(chatId);
    return;
  }
  toastDev("视频通话暂时无法接通~");
};
window.wxSendLocation = function () {
  if (!chatData[chatId]) return;
  chatData[chatId].push([
    "[位置] 重庆市·解放碑|重庆市渝中区民族路177号",
    "me",
    nowAmpm(),
  ]);
  saveChat();
  refreshChat(true);
  sfx("send");
};
window.wxSendRedPacket = function () {
  wxAmountPad("红包金额", "0.00", function (v) {
    if (!chatData[chatId]) return;
    chatData[chatId].push([
      `[红包] 恭喜发财，大吉大利|${v}`,
      "me",
      nowAmpm(),
    ]);
    saveChat();
    refreshChat(true);
    sfx("send");
  });
};
window.wxSendTransfer = function () {
  wxAmountPad("转账金额", "0.00", function (v) {
    if (!chatData[chatId]) return;
    chatData[chatId].push([`[转账] ${v}|请你喝奶茶`, "me", nowAmpm()]);
    saveChat();
    refreshChat(true);
    sfx("send");
  });
};
window.wxSwitchToVoice = function () {
  const field = $("#fld");
  if (field && field.style.display !== "none") toggleVoiceInput();
};
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
  if (title && view === "chat") title.textContent = wxName(chatId);
}
function deliverFrom(from, text) {
  if (!chatData[from]) chatData[from] = [];
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
    if (view === "home" && !window.isVinylBusy) renderHome();
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
  if (window.isDnd || window._wxNotifyOn === false) return;
  if (window._wxChatSettings?.[from]?.mute) return;
  sfx("msg");
  vib([30, 60, 30]);
  if (view === "lock" || view === "pin") {
    lockNotes.unshift({ title: wxName(from), body, app: "wechat", time: t("now") });
    renderLock();
    return;
  }
  OV.querySelectorAll(".banner").forEach((b) => b.remove());
  const b = document.createElement("div");
  b.className = "banner";
  b.innerHTML = `<div class="ncard">${ncardHTML({ title: wxName(from), body, app: "wechat", time: t("now") })}</div>`;
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
  window._chatBackTo = null;
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
function saveChat() {}

/* ================= 聊天信息页 ================= */
window.openWxChatInfo = function () {
  if (!chatId) return toastDev();
  push("wx_chat_info");
};
window.wxToggleChatSetting = function (key, el) {
  const s = (window._wxChatSettings[chatId] =
    window._wxChatSettings[chatId] || {});
  s[key] = !s[key];
  if (el) el.classList.toggle("on", s[key]);
  vib(8);
};
window.wxSetRemark = function () {
  const cur = window._wxRemarks[chatId] || "";
  wxPrompt("设置备注", cur || "输入备注名", function (v) {
    window._wxRemarks[chatId] = v;
    show("wx_chat_info", "none");
    toastDev("备注已保存");
  });
};
window.wxClearChat = function () {
  wxActionSheet("清空聊天记录", [
    {
      label: "清空",
      danger: true,
      onClick: () => {
        chatData[chatId] = [["11月15日", "date"]];
        saveChat();
        show("wx_chat_info", "none");
        toastDev("聊天记录已清空");
      },
    },
  ]);
};
function wxCell(label, right, onclick, last) {
  return `<div class="wx-cell" ${onclick ? `onclick="${onclick}"` : ""} style="${last ? "" : "border-bottom:.5px solid #f0f0f0;"}">
    <div class="wx-cell-label">${label}</div>
    <div class="wx-cell-right">${right}</div>
  </div>`;
}
VIEWS.wx_chat_info = () => {
  const s = window._wxChatSettings[chatId] || {};
  const msgCount = (chatData[chatId] || []).filter((x) => x[1] !== "date").length;
  return {
    cls: "wx-list",
    html: `
    <div class="nav solid" style="background:#ededed;border-bottom:.5px solid #dcdcdc;">
      <button class="nb-back" onclick="back()" style="border:none;background:none;color:#111;cursor:pointer;">${G.chevL}</button>
      <div class="nb-title" style="opacity:1;">聊天信息</div>
      <div class="nb-right"></div>
    </div>
    <div class="wx-scroll" style="padding-top:98px;background:#ededed;padding-bottom:30px;">
      <div style="background:#fff;padding:16px;">
        <div class="wx-member-grid">
          <div class="wx-member">
            <div class="wx-member-av">${avatarFor(chatId, false)}</div>
            <div class="wx-member-name">${esc(wxName(chatId))}</div>
          </div>
          <div class="wx-member" onclick="toastDev()">
            <div class="wx-member-av add">＋</div>
            <div class="wx-member-name"></div>
          </div>
        </div>
      </div>
      <div style="background:#fff;margin-top:8px;">
        ${wxCell("查找聊天记录", `<span style="color:#999;font-size:13px;">${msgCount} 条</span><span class="wx-cell-chev">${G.chevR}</span>`, "openWxSearch('wx_chat_info', chatId)")}
        ${wxCell("消息免打扰", `<button class="sw ${s.mute ? "on" : ""}" onclick="wxToggleChatSetting('mute',this)"></button>`)}
        ${wxCell("置顶聊天", `<button class="sw ${s.top ? "on" : ""}" onclick="wxToggleChatSetting('top',this)"></button>`)}
      </div>
      <div style="background:#fff;margin-top:8px;">
        ${wxCell("设置备注和标签", `<span class="wx-cell-chev">${G.chevR}</span>`, "wxSetRemark()")}
        ${wxCell("清空聊天记录", `<span class="wx-cell-chev">${G.chevR}</span>`, "wxClearChat()", true)}
      </div>
      <div style="background:#fff;margin-top:8px;">
        ${wxCell("投诉", `<span class="wx-cell-chev">${G.chevR}</span>`, "toastDev()", true)}
      </div>
    </div>`,
  };
};

/* ================= 全局搜索 ================= */
window._wxSearchHits = [];
window.openWxSearch = function (from, scope) {
  window._wxSearchFrom = from || view || "wechat";
  window._wxSearchScope = scope || "";
  window._wxSearchQuery = "";
  push("wx_search");
};
window.wxSearchInput = function (v) {
  window._wxSearchQuery = v;
  wxRenderSearch(v);
};
window.openSearchHit = function (i) {
  const h = (window._wxSearchHits || [])[i];
  if (!h) return;
  if (h.kind === "profile") {
    chatId = h.chat;
    window._profileFrom = "wx_search";
    push("wx_profile");
  } else if (h.kind === "chat") {
    chatId = h.chat;
    window._chatBackTo = "wx_search";
    push("chat");
  } else if (h.kind === "moment") {
    window._momentDetailFrom = "wx_search";
    window._currentMomentDetail = {
      author: h.author,
      authorId: h.authorId || h.author,
      avatar: h.avatar,
      post: h.post,
    };
    push("wx_moments_detail");
  }
};
window.wxRenderSearch = function (q) {
  const box = document.getElementById("wx-search-results");
  if (!box) return;
  const query = String(q || "").trim().toLowerCase();
  const scope = window._wxSearchScope || "";
  if (!query) {
    box.innerHTML = `<div class="wx-search-empty">搜索聊天记录、联系人和朋友圈</div>`;
    window._wxSearchHits = [];
    return;
  }
  const hits = [];
  const chats = [];
  chatNames.forEach((n) => {
    if (scope && n !== scope) return;
    const arr = chatData[n] || [];
    const shown = wxName(n);
    if (!scope && shown.toLowerCase().includes(query)) {
      chats.push({ kind: "profile", chat: n, label: shown, sub: "联系人" });
      return;
    }
    const msgs = arr.filter((x) => x[1] !== "date");
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (String(msgs[i][0]).toLowerCase().includes(query)) {
        chats.push({
          kind: "chat",
          chat: n,
          label: scope ? shown : "聊天记录 · " + shown,
          sub: msgs[i][0],
          time: msgs[i][2] || "",
        });
        break;
      }
    }
  });
  const momentHits = [];
  if (!scope) {
    const all = [];
    for (const user in MOCK_MOMENTS_DATA) {
      const u = MOCK_MOMENTS_DATA[user];
      const av = (CFG.roles && CFG.roles[user] && CFG.roles[user].avatar) || u.avatar || G.sil;
      (u.posts || []).forEach((p) => all.push({ author: user, avatar: av, post: p }));
    }
    (window._wxMyPosts || []).forEach((p) =>
      all.push({ author: "我", avatar: CFG.myAvatar || G.sil, post: p }),
    );
    all.forEach((h) => {
      if (String(h.post.text || "").toLowerCase().includes(query))
        momentHits.push({ kind: "moment", label: h.author, sub: h.post.text, author: h.author, avatar: h.avatar, post: h.post });
    });
  }
  let html = "";
  if (chats.length) {
    html += `<div class="wx-search-sec">${scope ? "聊天记录" : "聊天"}</div>`;
    chats.slice(0, 30).forEach((h) => {
      const i = hits.push(h) - 1;
      html += `<div class="wx-search-row" onclick="openSearchHit(${i})">
        <div class="wx-search-av">${avatarFor(h.chat, false)}</div>
        <div class="wx-search-info"><div class="wx-search-name">${esc(h.label)}</div><div class="wx-search-sub">${esc(h.sub)}</div></div>
        ${h.time ? `<div class="wx-search-time">${esc(h.time)}</div>` : ""}
      </div>`;
    });
  }
  if (momentHits.length) {
    html += `<div class="wx-search-sec">朋友圈</div>`;
    momentHits.slice(0, 30).forEach((h) => {
      const i = hits.push(h) - 1;
      html += `<div class="wx-search-row" onclick="openSearchHit(${i})">
        <div class="wx-search-av"><img src="${h.avatar}" style="width:100%;height:100%;object-fit:cover;border-radius:6px;" /></div>
        <div class="wx-search-info"><div class="wx-search-name">${esc(h.author)}</div><div class="wx-search-sub">${esc(h.sub)}</div></div>
      </div>`;
    });
  }
  window._wxSearchHits = hits;
  box.innerHTML = html || `<div class="wx-search-empty">没有找到相关内容</div>`;
};
VIEWS.wx_search = () => {
  const q = window._wxSearchQuery || "";
  const scopeName = window._wxSearchScope ? wxName(window._wxSearchScope) : "";
  return {
    cls: "wx-list",
    html: `
    <div class="wx-search-head">
      <div class="wx-search-box">${G.wxSearch}<input id="wx-search-input" value="${esc(q)}" placeholder="${scopeName ? "搜索 " + esc(scopeName) + " 的聊天记录" : "搜索"}" oninput="wxSearchInput(this.value)" /></div>
      <button class="wx-search-cancel" onclick="back()">取消</button>
    </div>
    <div class="wx-scroll" id="wx-search-results" style="background:#fff;"></div>`,
    init: () => {
      wxRenderSearch(window._wxSearchQuery || "");
      setTimeout(() => {
        const i = document.getElementById("wx-search-input");
        if (i) i.focus();
      }, 100);
    },
  };
};

window.openMoments = function () {
  window._wxDiscoverNew = false;
  push("moments");
};
VIEWS.wx_discover = () => {
  const row = (icon, text, onclick = "toastDev()", isLast = false) => `
    <div class="row tap" onclick="${onclick}" style="min-height:56px; padding:0 16px; position:relative; display:flex; align-items:center; background:#fff; width:100%; text-align:left; border:none;">
      <div style="width:24px; height:24px; display:flex; justify-content:center; align-items:center; margin-right:16px; flex:none;">${icon}</div>
      <div style="flex:1; font-size:16px; color:#111;">${text}</div>
      <div style="width:16px; display:flex; justify-content:flex-end;">${G.chevR}</div>
      ${!isLast ? `<div style="position:absolute; bottom:0; left:56px; right:0; height:.5px; background:#e5e5ea;"></div>` : ""}
    </div>`;

  return {
    cls: "wx-list",
    html: `
    <div class="wx-head" style="background:#ededed;">
      <div class="wx-head-left"></div>
      <h1>发现</h1>
      <div class="wx-actions"><span style="display:flex;cursor:pointer;" onclick="openWxSearch('wx_discover')">${G.wxSearch}</span></div>
    </div>

    <div class="wx-scroll" style="flex:1; overflow-y:auto; background:#ededed; padding-bottom: 80px;">
      <div style="background:#fff; margin-top:8px;">
${row(G.wxPengyouquan, "朋友圈", "openMoments()", true)}
      </div>
      <div style="background:#fff; margin-top:8px;">${row(G.wxShipinhao, "视频号", "toastDev()")}${row(G.wxZhibo, "直播", "toastDev()", true)}</div>
      <div style="background:#fff; margin-top:8px;">${row(G.wxSaoyisao, "扫一扫", "openWxScan()")}${row(G.wxSouyisou, "搜一搜", "openWxSearch('wx_discover')", true)}</div>
      <div style="background:#fff; margin-top:8px;">${row(G.wxKanyikan, "看一看", "toastDev()")}${row(G.wxTingyiting, "听一听", "toastDev()", true)}</div>
      <div style="background:#fff; margin-top:8px;">${row(G.wxFujin, "附近的人", "toastDev()")}${row(G.wxYouxi, "游戏", "toastDev()")}${row(G.wxXiaochengxu, "小程序", "toastDev()", true)}</div>
    </div>

    <div class="wx-tabbar">
      <button onclick="show('wechat')" style="position:relative;"><span>${G.wxTabChat}</span>${wxChatTabBadge()}<small>微信</small></button>
      <button onclick="show('wx_contacts')"><span>${G.wxTabContacts}</span><small>通讯录</small></button>
      <button class="on" style="position:relative;">
        <span>${G.wxTabDiscover}</span>
        ${wxTabDot()}
        <small>发现</small>
      </button>
      <button onclick="show('wx_me')" style="position:relative;">
        <span>${G.wxTabMe}</span>
        <span style="position:absolute;top:4px;right:22px;width:8px;height:8px;background:#fa5151;border-radius:50%;"></span>
        <small>我</small>
      </button>
    </div>`,
  };
};

function getPinyinInitial(str) {
  const map = {
    穆: "M",
    丞: "C",
    恩: "E",
    小: "X",
    蓝: "L",
    瑞: "R",
    闺: "G",
    爹: "D",
    哥: "G",
    仔: "Z",
    胖: "P",
    M: "M",
    p: "P",
    c: "C",
    r: "R",
    t: "T",
  };
  const c = str.charAt(0);
  if (/[a-zA-Z]/.test(c)) return c.toUpperCase();
  return map[c] || "#";
}

VIEWS.wx_contacts = () => {
  const groups = {};
  chatNames.forEach((name) => {
    const initial = getPinyinInitial(name);
    if (!groups[initial]) groups[initial] = [];
    groups[initial].push(name);
  });

  const sortedInitials = Object.keys(groups).sort((a, b) => {
    if (a === "#") return 1;
    if (b === "#") return -1;
    return a.localeCompare(b);
  });

  let listHTML = "";
  sortedInitials.forEach((initial) => {
    listHTML += `<div id="group-${initial}" style="padding:4px 16px; font-size:13px; color:#888; background:#ededed; font-weight:500;">${initial}</div>`;
    groups[initial].forEach((name) => {
      listHTML += `
        <div class="wx-item" style="padding-left:16px; background:#fff;" onclick="window._chatBackTo=null; chatId='${name}'; push('chat')">
          <div class="wx-av" onclick="event.stopPropagation(); openWxProfileByName('${name}', 'wx_contacts')">${avatarFor(name)}</div>
          <div class="wx-info"><div class="wx-name">${esc(wxName(name))}</div></div>
        </div>
      `;
    });
  });

  const topIcon = (bg, svg) =>
    `<div style="width:40px; height:40px; border-radius:6px; background:${bg}; display:grid; place-items:center; flex:none; margin-right:16px;">${svg}</div>`;

  return {
    cls: "wx-list",
    html: `
    <div class="wx-head" style="background:#ededed; position:relative;">
      <div class="wx-head-left"></div>
      <h1>通讯录</h1>
      <div class="wx-actions"><span style="display:flex;cursor:pointer;" onclick="openWxSearch('wx_contacts')">${G.wxSearch}</span><span style="display:flex;cursor:pointer;" onclick="wxOpenAddMenu()">${G.wxPlus}</span></div>
    </div>
    <div class="wx-scroll" style="flex:1; overflow-y:auto; padding-top: 0; background:#ededed;">
      
      <div style="background:#fff; margin-bottom:8px;">
        <div class="wx-item" style="padding-left:16px; background:#fff; border-bottom: 0.5px solid #ededed;" onclick="openWxContactsSub('new_friends')">
          ${topIcon("#fca130", G.wxNewFriend)}
          <div class="wx-info"><div class="wx-name">新的朋友</div></div>
        </div>
        <div class="wx-item" style="padding-left:16px; background:#fff; border-bottom: 0.5px solid #ededed;" onclick="openWxContactsSub('chat_only')">
          ${topIcon("#fca130", G.wxChatOnly)}
          <div class="wx-info"><div class="wx-name">仅聊天的朋友</div></div>
        </div>
        <div class="wx-item" style="padding-left:16px; background:#fff; border-bottom: 0.5px solid #ededed;" onclick="openWxContactsSub('groups')">
          ${topIcon("#07c160", G.wxGroup)}
          <div class="wx-info"><div class="wx-name">群聊</div></div>
        </div>
        <div class="wx-item" style="padding-left:16px; background:#fff; border-bottom: 0.5px solid #ededed;" onclick="openWxContactsSub('tags')">
          ${topIcon("#2782d7", G.wxTag)}
          <div class="wx-info"><div class="wx-name">标签</div></div>
        </div>
        <div class="wx-item" style="padding-left:16px; background:#fff; border-bottom: 0.5px solid #ededed;" onclick="openWxContactsSub('official')">
          ${topIcon("#2782d7", G.wxOfficial)}
          <div class="wx-info"><div class="wx-name">公众号</div></div>
        </div>
        <div class="wx-item" style="padding-left:16px; background:#fff;" onclick="openWxContactsSub('service')">
          ${topIcon("#2782d7", G.wxService)}
          <div class="wx-info"><div class="wx-name">服务号</div></div>
        </div>
      </div>

      <div style="padding:6px 16px; font-size:13px; color:#888; background:#ededed;">我的企业及企业联系人</div>
      <div style="background:#fff; margin-bottom:8px;">
        <div class="wx-item" style="padding-left:16px; background:#fff;" onclick="openWxContactsSub('enterprise')">
          ${topIcon("#2782d7", G.wxEnterprise)}
          <div class="wx-info"><div class="wx-name">企业微信联系人</div></div>
        </div>
      </div>

      <div style="background:#fff;">
        ${listHTML}
      </div>
      
      <div style="text-align:center; padding: 20px 0 40px; color: #999; font-size: 15px;">705个朋友</div>
    </div>

    <div style="position: absolute; right: 2px; top: 100px; bottom: 80px; width: 24px; display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 100; gap: 1px; background: transparent;">
      <span style="font-size:12px; color:#555; font-weight:600; padding:2px 0;" onclick="document.querySelector('.wx-scroll').scrollTo({top:0,behavior:'smooth'})">↑</span>
      <span style="font-size:12px; color:#555; font-weight:600; padding:2px 0;" onclick="document.querySelector('.wx-scroll').scrollTo({top:0,behavior:'smooth'})">☆</span>
      ${sortedInitials.map((initial) => `<span style="font-size:11px; color:#555; font-weight:600; padding:1px 0; cursor:pointer;" onclick="document.getElementById('group-${initial}').scrollIntoView({behavior:'smooth'});">${initial}</span>`).join("")}
    </div>

    <div class="wx-tabbar">
      <button onclick="show('wechat')" style="position:relative;"><span>${G.wxTabChat}</span>${wxChatTabBadge()}<small>微信</small></button>
      <button class="on"><span>${G.wxTabContacts}</span><small>通讯录</small></button>
      <button onclick="show('wx_discover')" style="position:relative;"><span>${G.wxTabDiscover}</span>${wxTabDot()}<small>发现</small></button>
      <button onclick="show('wx_me')" style="position:relative;"><span>${G.wxTabMe}</span><span style="position:absolute;top:4px;right:22px;width:8px;height:8px;background:#fa5151;border-radius:50%;"></span><small>我</small></button>
    </div>`,
  };
};

VIEWS.wx_me = () => {
  const row = (icon, title, extra = "", onclick = "toastDev()") => `
    <div class="wx-item" style="background:#fff; padding: 12px 16px; display:flex; align-items:center; border-bottom:0.5px solid #f0f0f0;" onclick="${onclick}">
      <div style="width:22px; height:22px; margin-right:14px; display:flex; align-items:center; justify-content:center;">${icon}</div>
      <div style="flex:1; font-size:16px; color:#111;">${title}</div>
      ${extra ? `<div style="font-size:14px; color:#888; margin-right:8px;">${extra}</div>` : ""}
      <div style="color:#c7c7cc;">${G.chevR}</div>
    </div>`;

  return {
    cls: "wx-list",
    html: `
    <div class="wx-scroll" style="flex:1; overflow-y:auto; background:#ededed; padding-top: 88px; padding-bottom: 20px;">
      
      <div style="background:#fff; padding: 24px 16px 20px; display:flex; align-items:flex-start; border-radius: 8px; margin-bottom: 8px;">
        <div style="width: 64px; height: 64px; border-radius: 8px; overflow: hidden; border: 0.5px solid #e5e5ea; flex:none; margin-right: 16px;">
          ${CFG.myAvatar ? `<img src="${CFG.myAvatar}" style="width:100%;height:100%;border-radius:8px;object-fit:cover;">` : `<div style="width:100%;height:100%;border-radius:8px;background:#eee;display:grid;place-items:center;">${G.sil}</div>`}
        </div>
        <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap: 6px; padding-top: 4px;">
          <div style="font-size: 20px; font-weight: 500; color: #111; display:flex; align-items:center; gap:6px;">🐱</div>
          <div style="font-size: 14px; color: #888;">微信号：cgcgdsg</div>
          
          <div style="display:flex; gap: 8px; margin-top: 4px;">
            <div style="border: 1px solid #e5e5ea; border-radius: 14px; padding: 2px 10px; font-size: 12px; color: #555; display:flex; align-items:center;">+ 状态</div>
            <div style="border: 1px solid #e5e5ea; border-radius: 14px; padding: 2px 10px; font-size: 12px; color: #555; display:flex; align-items:center;">
              <span style="margin-right:4px;">👥</span>等12个朋友 <span style="color:#fa5151; margin-left:4px;">●</span>
            </div>
          </div>
        </div>
        <div style="color:#111; margin-top:4px;cursor:pointer;" onclick="openWxScan()">${G.wxMeScan}</div>
      </div>

      <div style="background:#fff; margin-bottom: 8px;">
        ${row(G.wxMeService, '服务', '', "push('wx_services')")}
      </div>

      <div style="background:#fff; margin-bottom: 8px;">
        ${row(G.wxMeFav, '收藏', '', "push('wx_favorites')")}
        ${row(G.photo, '朋友圈', '', "push('wx_moments_self')")}
      </div>

      <div style="background:#fff; margin-bottom: 8px;">
        ${row(G.wxMeWorks, '我的作品', '', "toastDev()")}
        ${row(G.wxMeShop, '小店与卡包', '', "toastDev()")}
        ${row(G.wxMeEmoji, '表情', '', "toastDev()")}
      </div>

      <div style="background:#fff; margin-bottom: 8px;">
        ${row(G.wxMeSettings, '设置', '<span style="width:8px;height:8px;background:#fa5151;border-radius:50%;"></span>', "push('wx_settings')")}
      </div>

    </div>

    <div class="wx-tabbar">
      <button onclick="show('wechat')" style="position:relative;"><span>${G.wxTabChat}</span>${wxChatTabBadge()}<small>微信</small></button>
      <button onclick="show('wx_contacts')"><span>${G.wxTabContacts}</span><small>通讯录</small></button>
      <button onclick="show('wx_discover')" style="position:relative;"><span>${G.wxTabDiscover}</span>${wxTabDot()}<small>发现</small></button>
      <button class="on" style="position:relative;"><span>${G.wxTabMe}</span><span style="position:absolute;top:4px;right:22px;width:8px;height:8px;background:#fa5151;border-radius:50%;"></span><small>我</small></button>
    </div>`,
  };
};
/* ================= 加号菜单 / 扫一扫 ================= */
window.wxOpenAddMenu = function () {
  wxActionSheet("", [
    { label: "发起群聊", onClick: () => toastDev("建群功能还在路上~") },
    {
      label: "添加朋友",
      onClick: () => openWxContactsSub("new_friends", view),
    },
    { label: "扫一扫", onClick: () => openWxScan() },
    { label: "收付款", onClick: () => toastDev("收付款还没接进来~") },
  ]);
};
window.openWxScan = function () {
  window._wxScanFrom = view === "wx_scan" ? "wx_me" : view || "wx_me";
  push("wx_scan");
};
VIEWS.wx_scan = () => ({
  cls: "dark",
  html: `
  <div class="wx-scan-page">
    <div class="wx-scan-head">
      <button onclick="back()">${G.chevL}</button>
      <div>扫一扫</div>
      <span style="width:22px;"></span>
    </div>
    <div class="wx-scan-body">
      <div class="wx-scan-box">
        <span class="wx-scan-corner tl"></span><span class="wx-scan-corner tr"></span>
        <span class="wx-scan-corner bl"></span><span class="wx-scan-corner br"></span>
        <span class="wx-scan-line"></span>
      </div>
      <div class="wx-scan-tip">将二维码放入框内，即可自动扫描</div>
      <button class="wx-scan-btn" onclick="toastDev('相册里没有二维码~')">从相册选取</button>
    </div>
  </div>`,
});

/* ================= 通讯录二级页 ================= */
window._wxSubType = "new_friends";
window._wxSubFrom = "wx_contacts";
window.openWxContactsSub = function (type, from) {
  window._wxSubType = type;
  window._wxSubFrom = from || "wx_contacts";
  push("wx_contacts_sub");
};
window.wxSubBack = function () {
  show(window._wxSubFrom || "wx_contacts", "pop");
};
function wxEmpty(text) {
  return `<div style="padding:80px 20px;text-align:center;color:#999;font-size:15px;">${esc(text)}</div>`;
}
VIEWS.wx_contacts_sub = () => {
  const t = window._wxSubType;
  const titles = {
    new_friends: "新的朋友",
    chat_only: "仅聊天的朋友",
    groups: "群聊",
    tags: "标签",
    official: "公众号",
    service: "服务号",
    enterprise: "企业微信联系人",
  };
  const av = (n) => `<div class="wx-av">${avatarFor(n, false)}</div>`;
  let body = "";

  if (t === "new_friends") {
    const reqs = [
      { name: "穆小恩", note: "来自搜索手机号" },
      { name: "恩仔", note: "来自群聊「4组」" },
      { name: "蓝胖胖", note: "来自附近的人" },
    ];
    body = `<div style="background:#fff;">${reqs
      .map(
        (r) => `<div class="wx-item" style="background:#fff;padding-left:16px;">
        ${av(r.name)}
        <div class="wx-info"><div class="wx-name">${esc(wxName(r.name))}</div><div class="wx-msg">${esc(r.note)}</div></div>
        <button class="wx-mini-btn" onclick="event.stopPropagation();this.textContent='已添加';this.disabled=true;this.classList.add('done')">接受</button>
      </div>`,
      )
      .join("")}</div>`;
  } else if (t === "groups") {
    const gs = chatNames.filter(isGroup);
    body = gs.length
      ? `<div style="background:#fff;">${gs
          .map(
            (n) =>
              `<div class="wx-item" style="background:#fff;padding-left:16px;" onclick="chatId='${n}';push('chat')">${av(n)}<div class="wx-info"><div class="wx-name">${esc(wxName(n))}</div></div></div>`,
          )
          .join("")}</div>`
      : wxEmpty("暂无群聊");
  } else if (t === "tags") {
    const tags = [
      { name: "家人", members: ["穆小恩", "MuAMuA", "穆老爹", "恩恩"] },
      { name: "朋友", members: ["丞哥", "穆祉丞", "穆瑞恩", "恩仔"] },
      { name: "同事", members: ["小队长", "蓝胖胖"] },
      { name: "不想说话", members: ["Mu", "pig", "cat"] },
    ];
    body = `<div style="background:#fff;">${tags
      .map(
        (g) => `<div class="wx-item" style="background:#fff;padding-left:16px;" onclick="toastDev()">
        <div class="wx-av" style="background:#2782d7;display:grid;place-items:center;font-size:18px;">🏷️</div>
        <div class="wx-info"><div class="wx-name">${esc(g.name)}</div><div class="wx-msg">${g.members.map((m) => esc(wxName(m))).join("、")}</div></div>
      </div>`,
      )
      .join("")}</div>`;
  } else if (t === "official" || t === "service" || t === "enterprise") {
    const list =
      t === "official"
        ? ["TF家族", "时代峰峻", "穆祉丞工作室", "橙粉色研究所"]
        : t === "service"
          ? ["微信支付", "城市服务", "手机充值", "信用卡还款"]
          : ["企业微信", "腾讯文档", "腾讯会议"];
    body = `<div style="background:#fff;">${list
      .map(
        (n, i) =>
          `<div class="wx-item" style="background:#fff;padding-left:16px;" onclick="toastDev()">
        <div class="wx-av" style="background:${t === "service" ? "#07c160" : t === "enterprise" ? "#2782d7" : "#fca130"};display:grid;place-items:center;color:#fff;font-size:20px;">${esc(n.charAt(0))}</div>
        <div class="wx-info"><div class="wx-name">${esc(n)}</div><div class="wx-msg">${t === "official" ? "公众号" : t === "service" ? "服务号" : "企业微信"}</div></div>
      </div>`,
      )
      .join("")}</div>`;
  } else {
    body = wxEmpty("这里暂时还没有内容");
  }

  return {
    cls: "wx-list",
    html: `
    <div class="nav solid" style="background:#ededed;border-bottom:.5px solid #dcdcdc;">
      <button class="nb-back" onclick="wxSubBack()" style="border:none;background:none;color:#111;cursor:pointer;">${G.chevL}</button>
      <div class="nb-title" style="opacity:1;">${titles[t] || "通讯录"}</div>
      <div class="nb-right"></div>
    </div>
    <div class="wx-scroll" style="padding-top:98px;background:#ededed;padding-bottom:30px;">${body}</div>`,
  };
};

/* ================= 我的：服务 / 收藏 / 设置 ================= */
VIEWS.wx_services = () => {
  const svcBtn = (icon, label) =>
    `<button onclick="toastDev()" style="display:flex;flex-direction:column;align-items:center;gap:9px;background:none;border:none;padding:0 0 12px;font-family:inherit;"><span style="height:30px;display:grid;place-items:center;">${icon}</span><span style="font-size:13px;color:#111;">${label}</span></button>`;
  const sec = (title, items, last) => `
    <div style="background:#fff;border-radius:10px;margin:0 12px 10px;padding:16px 6px 4px;">
      <div style="font-size:13px;color:#94949a;padding:0 8px 14px;">${title}</div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px 2px;">${items
        .map(([ic, label]) => svcBtn(ic, label))
        .join("")}</div>
    </div>`;
  return {
    cls: "wx-list",
    html: `
    <div class="nav solid" style="background:#ededed;border-bottom:.5px solid #dcdcdc;">
      <button class="nb-back" onclick="back()" style="border:none;background:none;color:#111;cursor:pointer;">${G.chevL}</button>
      <div class="nb-title" style="opacity:1;">服务</div>
      <div class="nb-right">${G.dots}</div>
    </div>
    <div class="wx-scroll" style="padding-top:98px;background:#ededed;padding-bottom:30px;">
      <div style="background:#07c160;border-radius:10px;margin:10px 12px 12px;padding:24px 0 26px;display:flex;">
        <button onclick="toastDev()" style="flex:1;display:flex;flex-direction:column;align-items:center;gap:12px;background:none;border:none;font-family:inherit;">
          <span style="height:32px;display:grid;place-items:center;">${G.wxSvcScan}</span>
          <span style="font-size:16px;color:#fff;">收付款</span>
        </button>
        <button onclick="toastDev()" style="flex:1;display:flex;flex-direction:column;align-items:center;gap:12px;background:none;border:none;font-family:inherit;">
          <span style="height:32px;display:grid;place-items:center;">${G.wxSvcWallet}</span>
          <span style="font-size:16px;color:#fff;line-height:1.1;">钱包</span>
          <span style="font-size:13px;color:rgba(255,255,255,.85);margin-top:-4px;">¥0.00</span>
        </button>
      </div>
      ${sec("金融理财", [
        [G.wxSvcCredit, "信用卡还款"],
        [G.wxSvcLicaicai, "理财通"],
        [G.wxSvcInsurance, "保险服务"],
      ])}
      ${sec("生活服务", [
        [G.wxSvcPhoneTop, "手机充值"],
        [G.wxSvcUtility, "生活缴费"],
        [G.wxSvcQcoin, "Q币充值"],
        [G.wxSvcCity, "城市服务"],
        [G.wxSvcGongyi, "腾讯公益"],
        [G.wxSvcMedical, "医疗健康"],
      ])}
      ${sec("交通出行", [
        [G.wxSvcTravel, "出行服务"],
        [G.wxSvcTrain, "火车票机票"],
        [G.wxSvcDidi, "滴滴出行"],
        [G.wxSvcHotel, "酒店民宿"],
      ])}
      ${sec("购物消费", [
        [G.wxSvcShop, "京东购物"],
        [G.wxSvcGift, "拼多多"],
        [G.wxSvcUtility, "电影演出"],
        [G.wxSvcMore, "更多"],
      ])}
    </div>`,
  };
};

VIEWS.wx_favorites = () => {
  const items = [
    ["🔗", "穆祉丞工作室的微博", "链接 · 11月14日"],
    ["🖼️", "演唱会现场的晚霞", "图片 · 11月13日"],
    ["📝", "给穆祉丞的生日小作文", "笔记 · 11月12日"],
    ["💬", "和穆小恩的聊天记录", "聊天记录 · 11月11日"],
    ["🎵", "循环了一整晚的歌", "音乐 · 11月10日"],
  ];
  return {
    cls: "wx-list",
    html: `
    <div class="nav solid" style="background:#ededed;border-bottom:.5px solid #dcdcdc;">
      <button class="nb-back" onclick="back()" style="border:none;background:none;color:#111;cursor:pointer;">${G.chevL}</button>
      <div class="nb-title" style="opacity:1;">收藏</div>
      <div class="nb-right"></div>
    </div>
    <div class="wx-scroll" style="padding-top:98px;background:#ededed;padding-bottom:30px;">
      <div style="background:#fff;margin-top:8px;">
        ${items
          .map(
            ([ic, title, sub], i) =>
              `<div class="wx-cell" onclick="toastDev()" style="${i === items.length - 1 ? "" : "border-bottom:.5px solid #f0f0f0;"}">
                <div class="wx-fav-icon">${ic}</div>
                <div style="flex:1;min-width:0;"><div class="wx-cell-label" style="font-size:16px;">${title}</div><div class="wx-cell-sub">${sub}</div></div>
              </div>`,
          )
          .join("")}
      </div>
    </div>`,
  };
};

window.wxToggleNotify = function (el) {
  window._wxNotifyOn = !window._wxNotifyOn;
  if (el) el.classList.toggle("on", window._wxNotifyOn);
  vib(8);
};
window.wxToggleDnd = function (el) {
  window.isDnd = !window.isDnd;
  if (el) el.classList.toggle("on", window.isDnd);
  if (typeof updateDndBadge === "function") updateDndBadge();
  vib(8);
};
VIEWS.wx_settings = () => {
  const notifyOn = window._wxNotifyOn !== false;
  const rows = ["账号与安全", "隐私", "通用", "帮助与反馈", "关于微信"];
  return {
    cls: "wx-list",
    html: `
    <div class="nav solid" style="background:#ededed;border-bottom:.5px solid #dcdcdc;">
      <button class="nb-back" onclick="back()" style="border:none;background:none;color:#111;cursor:pointer;">${G.chevL}</button>
      <div class="nb-title" style="opacity:1;">设置</div>
      <div class="nb-right"></div>
    </div>
    <div class="wx-scroll" style="padding-top:98px;background:#ededed;padding-bottom:30px;">
      <div style="background:#fff;margin-top:8px;">
        ${wxCell("新消息通知", `<button class="sw ${notifyOn ? "on" : ""}" onclick="wxToggleNotify(this)"></button>`)}
        ${wxCell("免打扰", `<button class="sw ${window.isDnd ? "on" : ""}" onclick="wxToggleDnd(this)"></button>`, "", true)}
      </div>
      <div style="background:#fff;margin-top:8px;">
        ${rows
          .map(
            (r, i) =>
              `<div class="wx-cell" onclick="toastDev()" style="${i === rows.length - 1 ? "" : "border-bottom:.5px solid #f0f0f0;"}"><div class="wx-cell-label">${r}</div><div class="wx-cell-right"><span class="wx-cell-chev">${G.chevR}</span></div></div>`,
          )
          .join("")}
      </div>
      <div style="background:#fff;margin-top:8px;">
        ${wxCell("清空缓存", `<span style="color:#999;font-size:13px;">0 KB</span><span class="wx-cell-chev">${G.chevR}</span>`, "toastDev('缓存已经空啦~')", true)}
      </div>
    </div>`,
  };
};

window.wxProfileMenu = function () {
  wxActionSheet("", [
    { label: "设置备注和标签", onClick: () => toastDev("备注信息已记下~") },
    { label: "朋友权限", onClick: () => toastDev("朋友权限暂时不用设置~") },
    { label: "加入黑名单", danger: true, onClick: () => toastDev("才不舍得拉黑呢~") },
    { label: "投诉", onClick: () => toastDev() },
  ]);
};

VIEWS.wx_profile = () => {
  const role = CFG.roles?.[chatId] || { initial: chatId.charAt(0) };
  const avatar = role.avatar || G.sil;
  const data = MOCK_MOMENTS_DATA[chatId] || { wxid: "wxid_default", region: "未知", posts: [] };
  const thumbnails = (data.posts || []).flatMap(p => p.images).slice(0, 4);

  return {
    cls: "wx-list",
    html: `
    <div class="wx-head" style="background:#fff; border-bottom:0.5px solid #e5e5ea; position:absolute; z-index:10; width:100%;">
      <!-- 👇 左侧留空，全局会自动注入返回键 -->
      <div class="wx-head-left"></div>
      <h1 style="opacity:0;">资料</h1>
      <div class="wx-actions"><span style="display:flex;cursor:pointer;" onclick="wxProfileMenu()">${G.dotsH}</span></div>
    </div>

    <div class="wx-scroll" style="background:#f7f7f7; padding-top: 88px; padding-bottom:20px;">
      
      <div style="background:#fff; padding: 20px 16px; display:flex; align-items:flex-start; border-bottom:0.5px solid #e5e5ea; margin-bottom:10px;">
        <div style="width:64px; height:64px; border-radius:8px; overflow:hidden; margin-right:16px; flex-shrink:0;">
          <img src="${avatar}" style="width:100%;height:100%;object-fit:cover;">
        </div>
        <div style="flex:1;">
          <div style="font-size:22px; font-weight:600; color:#111; display:flex; align-items:center; gap:6px;">
            ${esc(wxName(chatId))}
            <span style="font-size:14px; color:#5ac8fa; font-weight:normal;">♂</span>
          </div>
          <div style="font-size:14px; color:#666; margin-top:6px;">微信号：${data.wxid}</div>
          <div style="font-size:14px; color:#666; margin-top:4px;">地区：${data.region}</div>
        </div>
      </div>

      <div style="background:#fff; padding: 16px; border-top:0.5px solid #e5e5ea; border-bottom:0.5px solid #e5e5ea; margin-bottom:10px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span style="font-size:16px; font-weight:600; color:#111;">朋友资料</span>
          <span>${G.chevR}</span>
        </div>
        <div style="font-size:13px; color:#999; line-height:1.4;">添加朋友的备注名、电话、标签、备忘、照片等，并设置朋友权限。</div>
      </div>

      <div onclick="window._momentsUserFrom='wx_profile'; push('wx_moments_user')" style="background:#fff; padding: 16px; display:flex; align-items:center; border-top:0.5px solid #e5e5ea; border-bottom:0.5px solid #e5e5ea; margin-bottom:10px;">
        <span style="font-size:16px; font-weight:600; color:#111; margin-right:16px;">朋友圈</span>
        <div style="flex:1; display:flex; gap:4px; overflow:hidden; justify-content:flex-start;">
          ${thumbnails.map(img => `<img src="${img}" style="width:46px; height:46px; object-fit:cover; border-radius:2px;">`).join('')}
        </div>
        <span style="margin-left:12px;">${G.chevR}</span>
      </div>

      <div style="background:#fff; border-top:0.5px solid #e5e5ea; border-bottom:0.5px solid #e5e5ea;">
        <div onclick="window._chatBackTo=null; push('chat')" style="padding: 16px; display:flex; align-items:center; justify-content:center; gap:8px; color:#576b95; font-size:17px; border-bottom:0.5px solid #e5e5ea; cursor:pointer;" onpointerdown="this.style.background='#f0f0f0'" onpointerup="this.style.background='#fff'">
          ${G.chat.replace('<svg', '<svg width="22" height="22"')} 发消息
        </div>
        <div onclick="if(typeof dial==='function'){dial(chatId)}else{toastDev()}" style="padding: 16px; display:flex; align-items:center; justify-content:center; gap:8px; color:#576b95; font-size:17px; cursor:pointer;" onpointerdown="this.style.background='#f0f0f0'" onpointerup="this.style.background='#fff'">
          ${G.handset.replace('<svg', '<svg width="22" height="22"')} 音视频通话
        </div>
      </div>

    </div>`,
  };
};

VIEWS.wx_moments_user = () => {
  const role = CFG.roles?.[chatId] || { initial: chatId.charAt(0) };
  const avatar = role.avatar || G.sil;
  const data = MOCK_MOMENTS_DATA[chatId] || { cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800", posts: [] };

  window._wxMomentUserFeed = data.posts || [];

  return {
    cls: "wx-list",
    html: `
    <!-- 👇 手写的返回键已全部删除，交给 app.js 自动生成 -->

    <div class="wx-scroll" id="wx-moments-scroll" style="background:#fff; padding-top:0; padding-bottom:20px;">
      
      <div style="position:relative; height:320px; background:url('${data.cover}') center/cover;">
        <div style="position:absolute; right:16px; bottom:-20px; display:flex; align-items:flex-end; gap:12px;">
          <span style="color:#fff; font-size:16px; font-weight:500; text-shadow:0 1px 3px rgba(0,0,0,0.5); padding-bottom:24px;">${esc(wxName(chatId))}</span>
          <img src="${avatar}" onclick="event.stopPropagation(); window._profileFrom='wx_moments_user'; push('wx_profile')" style="width:72px; height:72px; border-radius:8px; border:2px solid #fff; object-fit:cover; cursor:pointer;">
        </div>
      </div>

      <div style="margin-top:30px;">
        <!-- 空状态：长横线+圆点+长横线 -->
        ${(data.posts || []).length === 0 ? `
          <div style="display:flex; align-items:center; justify-content:center; gap:12px; margin-top: 80px;">
            <div style="width: 80px; height: 1px; background: #dcdcdc;"></div>
            <div style="width: 4px; height: 4px; background: #dcdcdc; border-radius: 50%;"></div>
            <div style="width: 80px; height: 1px; background: #dcdcdc;"></div>
          </div>
        ` : ''}
        
        ${(data.posts || []).map((post, index) => `
          <div onclick="openMomentDetailFromUserFeed(${index})" style="display:flex; gap:16px; padding:16px; border-bottom:0.5px solid #f0f0f0; cursor:pointer;">
            <div style="width:44px; height:44px; flex-shrink:0;">
               <img src="${avatar}" style="width:100%; height:100%; border-radius:6px; object-fit:cover;">
            </div>
            <div style="flex:1; min-width:0;">
              <div style="color: #576b95; font-size: 16px; font-weight: 600; margin-bottom: 4px;">${esc(wxName(chatId))}</div>
              <div style="font-size:15px; color:#111; line-height:1.45; margin-bottom:8px; white-space:pre-wrap;">${esc(post.text)}</div>
              ${post.images && post.images.length > 0 ? `
                <div style="display:grid; grid-template-columns:repeat(${post.images.length === 1 ? 1 : 3}, 1fr); gap:4px; margin-bottom: 6px; max-width:${post.images.length === 1 ? '180px' : '100%'};">
                  ${post.images.map(img => `<div style="${post.images.length === 1 ? 'aspect-ratio:4/3' : 'aspect-ratio:1'}; background:#eee; border-radius:2px; overflow:hidden;"><img src="${img}" style="width:100%;height:100%;object-fit:cover;"></div>`).join('')}
                </div>
              ` : ''}
              <div style="font-size: 13px; color: #999; margin-top: 8px;">${post.time || '刚刚'}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>`,
    init: (pg) => {
      const scroll = pg.querySelector('#wx-moments-scroll');
      scroll.addEventListener('scroll', () => {
        // 由于删了 nav，这里滑动变色逻辑也删了
      });
    }
  };
};

VIEWS.wx_moments_detail = () => {
  let post, avatar, authorName;

  if (window._currentMomentDetail) {
    post = window._currentMomentDetail.post;
    avatar = window._currentMomentDetail.avatar;
    authorName = window._currentMomentDetail.author;
  } else {
    const role = CFG.roles?.[chatId] || { initial: chatId.charAt(0) };
    avatar = role.avatar || G.sil;
    authorName = wxName(chatId);
    const data = MOCK_MOMENTS_DATA[chatId] || { posts: [] };
    const postId = window._currentMomentId || 1;
    post = data.posts.find(p => p.id === postId) || data.posts[0];
  }

  if (!post) return { html: "动态不存在" };

  const getLikeAvatar = (user) => {
    if (user === "我") return CFG.myAvatar || G.sil;
    return (CFG.roles && CFG.roles[user] && CFG.roles[user].avatar) ? CFG.roles[user].avatar : G.sil;
  };

  return {
    cls: "wx-list",
    html: `
    <!-- 👇 顶部换成带返回键的标准 nav，删掉原来的 wx-head -->
    <div class="nav solid" style="background:#ededed; position:absolute; z-index:10; width:100%; border-bottom:none;">
      <button class="nb-back" onclick="back()" style="border:none; background:none; cursor:pointer; color:#111; pointer-events: auto;">${G.chevL}</button>
      <div class="nb-title" style="opacity:1; font-size:17px; color:#111;">详情</div>
      <div class="nb-right"></div>
    </div>

    <div class="wx-scroll" style="background:#fff; padding-top: 98px; padding-bottom: 60px;">
      
      <!-- 设置统一的左右内边距 -->
      <div style="padding: 16px;">
        
        <!-- 顶部左右结构：大头像 + 右侧内容 -->
        <div style="display:flex; gap: 12px; align-items: flex-start;">
          
          <!-- 左侧头像 -->
          <img src="${avatar}" onclick="event.stopPropagation(); openWxProfileFromDetail()" style="width:40px; height:40px; border-radius:6px; object-fit:cover; flex: none; cursor:pointer;">
          
          <!-- 右侧文字、图片、时间等 -->
          <div style="flex:1; min-width:0;">
            <div style="color:#576b95; font-size:16px; font-weight:600; margin-bottom: 6px;">${esc(authorName)}</div>
            <div style="font-size:15px; color:#111; line-height:1.45; margin-bottom:8px; white-space:pre-wrap;">${esc(post.text)}</div>
            
            ${post.images && post.images.length > 0 ? `
              <div style="display:flex; flex-direction: column; margin-bottom: 8px;">
                ${post.images.map(img => `<img src="${img}" style="max-width: 220px; width: 100%; aspect-ratio: ${post.images.length === 1 ? '4/3' : '1'}; object-fit: cover; border-radius: 4px;" onclick="openMediaViewer(['${img}'], 0)">`).join('')}
              </div>
            ` : ''}

            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
              <div style="font-size:13px; color:#999;">${post.time || '刚刚'}</div>
              <div style="background:#f7f7f7; padding:4px 12px; border-radius:4px; color:#576b95; font-weight:600; letter-spacing:2px; cursor:pointer;" onclick="wxMomentActionsCurrent()">··</div>
            </div>
          </div>
        </div>

        <!-- 灰框（点赞评论）：跳出右侧容器，直接占满下方，左边缘与上方大头像对齐 -->
        <div style="background:#f7f7f7; border-radius:6px; margin-top: 10px; padding: 12px 12px 12px 0; display: ${((post.likes && post.likes.length) || (post.comments && post.comments.length)) ? "flex" : "none"}; flex-direction: column; gap: 10px;">
          
          <!-- 点赞区 -->
          ${post.likes && post.likes.length > 0 ? `
            <div style="display:flex; align-items:flex-start; ${post.comments && post.comments.length > 0 ? 'border-bottom:0.5px solid #e5e5ea; padding-bottom:10px;' : ''}">
              <!-- 第一列占位 52px，图标居左，对齐大头像中心 -->
              <div style="width: 52px; flex: none; display: flex; justify-content: flex-start; padding-left: 10px;">
                 ${G.heart.replace('<svg', '<svg width="20" height="20" style="color:#576b95;"')}
              </div>
              <!-- 第二列从 52px 处开始，与上方文字完美对齐 -->
              <div style="display:flex; gap:6px; flex-wrap:wrap; flex: 1; align-items:center;">
                ${post.likes.map(name => `<img src="${getLikeAvatar(name)}" onclick="event.stopPropagation(); window.openWxProfileByName('${name}', 'wx_moments_detail')" style="width:24px; height:24px; border-radius:4px; object-fit:cover; cursor:pointer;">`).join('')}
              </div>
            </div>
          ` : ''}

          <!-- 评论区 -->
          ${(post.comments || []).map((c, index) => `
            <div style="display:flex; align-items:flex-start;">
              <!-- 第一列占位 52px -->
              <div style="width: 52px; flex: none; display: flex; justify-content: flex-start; padding-left: 10px; margin-top: 2px;">
                 ${index === 0 ? G.comment.replace('<svg', '<svg width="20" height="20" style="color:#576b95;"') : ''}
              </div>
              <!-- 第二列头像从 52px 处开始，与上方文字完美对齐 -->
              <img src="${getLikeAvatar(c.user)}" onclick="event.stopPropagation(); window.openWxProfileByName('${c.user}', 'wx_moments_detail')" style="width: 24px; height: 24px; border-radius: 4px; object-fit: cover; flex: none; margin-right: 8px; margin-top: 2px;">
              <!-- 第三列名字和内容 -->
              <div style="flex:1; min-width:0;">
                <div style="color:#576b95; font-size:14px; font-weight:500;">
                  <span onclick="event.stopPropagation(); window.openWxProfileByName('${c.user}', 'wx_moments_detail')" style="cursor:pointer;">${esc(c.user)}</span>
                  ${c.replyTo ? `<span style="color:#111; font-weight:normal;"> 回复 </span><span onclick="event.stopPropagation(); window.openWxProfileByName('${c.replyTo}', 'wx_moments_detail')" style="color:#576b95; cursor:pointer;">${esc(c.replyTo)}</span>` : ''}
                </div>
                <div style="font-size:14px; color:#111; line-height:1.4; margin-top:2px;">${esc(c.text)}</div>
              </div>
            </div>
          `).join('')}

        </div>

      </div>
    </div>

    <div style="position:absolute; bottom:0; left:0; right:0; height:50px; background:#f7f7f7; border-top:0.5px solid #e5e5ea; display:flex; align-items:center; padding:0 12px; gap:12px;">
      <div onclick="wxMomentCommentCurrent()" style="flex:1; background:#fff; height:34px; border-radius:4px; display:flex; align-items:center; padding:0 10px; color:#999; font-size:14px; cursor:text;">发表评论：</div>
      <span style="font-size:20px;cursor:pointer;" onclick="wxMomentCommentCurrent()">${G.smile}</span>
      <span style="font-size:20px;cursor:pointer;" onclick="toastDev('朋友圈图片功能还没做~')">${G.photo}</span>
    </div>`,
    init: () => {}
  };
};

/* ================= 朋友圈交互 / 发表 ================= */
window.wxRefreshWxView = function () {
  if (["moments", "wx_moments_detail", "wx_moments_user", "wx_moments_self"].indexOf(view) < 0) return;
  const old = APP.lastElementChild;
  let top = 0;
  if (old) {
    const sc = old.querySelector(".wx-scroll, .scroll");
    if (sc) top = sc.scrollTop;
  }
  show(view, "none");
  const pg = APP.lastElementChild;
  if (pg) {
    const sc = pg.querySelector(".wx-scroll, .scroll");
    if (sc) sc.scrollTop = top;
  }
};
window.wxMomentComment = function (post) {
  if (!post) return;
  wxPrompt("评论", "说点什么...", function (txt) {
    post.comments = post.comments || [];
    post.comments.push({ user: "我", text: txt, replyTo: "" });
    wxRefreshWxView();
    toastDev("评论成功");
  });
};
window.wxMomentActions = function (post) {
  if (!post) return;
  const likes = (post.likes = post.likes || []);
  const liked = likes.indexOf("我") >= 0;
  wxActionSheet("", [
    {
      label: liked ? "取消赞" : "赞",
      onClick: () => {
        if (liked) {
          const i = likes.indexOf("我");
          if (i >= 0) likes.splice(i, 1);
        } else likes.push("我");
        wxRefreshWxView();
      },
    },
    { label: "评论", onClick: () => wxMomentComment(post) },
  ]);
};
window.wxMomentActionsFromFeed = function (i) {
  wxMomentActions((window._wxMomentFeed || [])[i]);
};
window.wxMomentActionsCurrent = function () {
  wxMomentActions(window._currentMomentDetail && window._currentMomentDetail.post);
};
window.wxMomentCommentCurrent = function () {
  wxMomentComment(window._currentMomentDetail && window._currentMomentDetail.post);
};
window.openMomentDetailFromSelf = function (i) {
  const p = (window._wxMyPosts || [])[i];
  if (!p) return;
  window._momentDetailFrom = "wx_moments_self";
  window._currentMomentDetail = {
    author: "小狗团汪汪",
    authorId: "我",
    avatar: CFG.myAvatar || G.sil,
    post: p,
  };
  push("wx_moments_detail");
};

window._wxComposeFrom = "moments";
window.openMomentCompose = function () {
  window._wxComposeFrom = view || "moments";
  window._wxComposeImages = [];
  push("wx_moment_compose");
};
window.wxComposeBack = function () {
  show(window._wxComposeFrom || "moments", "pop");
};
window.wxComposePick = function () {
  if (typeof openPhoneAlbumPicker !== "function")
    return toastDev("相册还没准备好~");
  openPhoneAlbumPicker({
    multiple: true,
    max: 9,
    imagesOnly: true,
    onDone: function (urls) {
      urls.forEach(function (u) {
        if (window._wxComposeImages.length < 9)
          window._wxComposeImages.push(u);
      });
      wxRenderComposeImages();
    },
  });
};
window.wxComposeRemove = function (i) {
  window._wxComposeImages.splice(i, 1);
  wxRenderComposeImages();
};
window.wxRenderComposeImages = function () {
  const box = document.getElementById("wx-compose-imgs");
  if (!box) return;
  box.innerHTML =
    window._wxComposeImages
      .map(
        (u, i) =>
          `<div class="wx-compose-img"><img src="${u}"><button onclick="event.stopPropagation();wxComposeRemove(${i})">×</button></div>`,
      )
      .join("") +
    (window._wxComposeImages.length < 9
      ? `<div class="wx-compose-add" onclick="wxComposePick()">＋</div>`
      : "");
};
window.wxPublishMoment = function () {
  const ta = document.getElementById("wx-compose-text");
  const text = ta ? ta.value.trim() : "";
  const imgs = (window._wxComposeImages || []).slice();
  if (!text && !imgs.length) return toastDev("写点什么再发表吧~");
  window._wxMyPosts.unshift({
    id: Date.now(),
    date: { day: "今天", month: "" },
    text,
    images: imgs,
    location: "",
    time: "刚刚",
    likes: [],
    comments: [],
  });
  window._wxComposeImages = [];
  show(window._wxComposeFrom || "moments", "pop");
  setTimeout(() => toastDev("发表成功"), 260);
};
VIEWS.wx_moment_compose = () => ({
  cls: "wx-list",
  html: `
  <div class="nav solid" style="background:#fff;border-bottom:.5px solid #e5e5ea;">
    <button onclick="wxComposeBack()" style="justify-self:start;border:none;background:none;color:#111;font-size:16px;cursor:pointer;">取消</button>
    <div class="nb-title" style="opacity:1;">发表</div>
    <button onclick="wxPublishMoment()" style="justify-self:end;border:none;background:none;color:#07c160;font-size:16px;font-weight:600;cursor:pointer;">发表</button>
  </div>
  <div class="wx-scroll" style="padding-top:98px;background:#fff;padding-bottom:30px;">
    <div style="padding:16px;">
      <textarea id="wx-compose-text" class="wx-compose-text" placeholder="这一刻的想法..."></textarea>
      <div id="wx-compose-imgs" class="wx-compose-imgs"></div>
      <div class="wx-compose-row" onclick="toastDev()"><span>📍 所在位置</span><span class="wx-compose-hint">所在位置</span></div>
      <div class="wx-compose-row" onclick="toastDev()"><span>👥 谁可以看</span><span class="wx-compose-hint">公开</span></div>
    </div>
  </div>`,
  init: () => {
    wxRenderComposeImages();
    setTimeout(() => {
      const t = document.getElementById("wx-compose-text");
      if (t) t.focus();
    }, 100);
  },
});
VIEWS.wx_moments_self = () => {
  const posts = window._wxMyPosts || [];
  const cover = MOCK_MOMENTS_DATA["穆祉丞"]?.cover || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800";
  const myAvatar = CFG.myAvatar || "./data/avatar/miantuan.jpg";
  return {
    cls: "wx-list",
    html: `
    <div class="wx-scroll" style="background:#fff;padding-bottom:20px;">
      <div style="position:relative;height:320px;background:url('${cover}') center/cover;">
        <div style="position:absolute;inset:0;background:linear-gradient(transparent 60%,rgba(0,0,0,.35));"></div>
        <button class="nb-back" onclick="back()" style="position:absolute;top:45px;left:10px;z-index:20;width:36px;height:36px;border-radius:50%;border:none;background:rgba(0,0,0,.25);color:#fff;display:grid;place-items:center;cursor:pointer;">${G.chevL}</button>
        <button onclick="openMomentCompose()" style="position:absolute;top:45px;right:14px;z-index:20;border:none;background:rgba(0,0,0,.25);color:#fff;border-radius:18px;padding:7px 12px;font-size:13px;cursor:pointer;">发表</button>
        <div style="position:absolute;right:16px;bottom:-20px;display:flex;align-items:flex-end;gap:12px;">
          <span style="color:#fff;font-size:16px;font-weight:500;text-shadow:0 1px 3px rgba(0,0,0,.5);padding-bottom:24px;">小狗团汪汪</span>
          <img src="${myAvatar}" style="width:72px;height:72px;border-radius:8px;border:2px solid #fff;object-fit:cover;">
        </div>
      </div>
      <div style="margin-top:30px;">
        ${
          posts.length === 0
            ? `<div class="wx-moments-empty"><div class="wx-moments-empty-line"></div><div class="wx-moments-empty-dot"></div><div class="wx-moments-empty-line"></div></div>
               <div style="text-align:center;color:#999;font-size:14px;margin-top:16px;">还没有发过朋友圈</div>
               <div style="text-align:center;margin-top:16px;"><button class="wx-mini-btn" style="padding:7px 18px;" onclick="openMomentCompose()">发表第一条</button></div>`
            : posts
                .map(
                  (post, index) => `<div onclick="openMomentDetailFromSelf(${index})" style="display:flex;gap:16px;padding:16px;border-bottom:.5px solid #f0f0f0;cursor:pointer;">
              <div style="width:44px;height:44px;flex-shrink:0;"><img src="${myAvatar}" style="width:100%;height:100%;border-radius:6px;object-fit:cover;"></div>
              <div style="flex:1;min-width:0;">
                <div style="color:#576b95;font-size:16px;font-weight:600;margin-bottom:4px;">小狗团汪汪</div>
                <div style="font-size:15px;color:#111;line-height:1.45;margin-bottom:8px;white-space:pre-wrap;">${esc(post.text)}</div>
                ${
                  post.images && post.images.length
                    ? `<div style="display:grid;grid-template-columns:repeat(${post.images.length === 1 ? 1 : 3},1fr);gap:4px;margin-bottom:6px;max-width:${post.images.length === 1 ? "180px" : "100%"};">${post.images
                        .map(
                          (img) =>
                            `<div style="${post.images.length === 1 ? "aspect-ratio:4/3" : "aspect-ratio:1"};background:#eee;border-radius:2px;overflow:hidden;"><img src="${img}" style="width:100%;height:100%;object-fit:cover;"></div>`,
                        )
                        .join("")}</div>`
                    : ""
                }
                <div style="font-size:13px;color:#999;margin-top:8px;">${esc(post.time || "刚刚")}</div>
              </div>
            </div>`,
                )
                .join("")
        }
      </div>
    </div>`,
  };
};

VIEWS.moments = () => {
  let allPosts = [];
  for (const user in MOCK_MOMENTS_DATA) {
    const userData = MOCK_MOMENTS_DATA[user];
    const userAvatar = CFG.roles?.[user]?.avatar || userData.avatar || G.sil;
    
    userData.posts.forEach(post => {
      allPosts.push({
        ...post,
        author: user,
        avatar: userAvatar
      });
    });
  }
  (window._wxMyPosts || []).forEach((post) => {
    allPosts.push({
      ...post,
      author: "小狗团汪汪",
      avatar: CFG.myAvatar || G.sil,
    });
  });
  allPosts.sort((a, b) => b.id - a.id);

  window._wxMomentFeed = allPosts;

  const renderImages = (images) => {
    if (!images || images.length === 0) return '';
    const isSingle = images.length === 1;
    return `
      <div style="display: grid; grid-template-columns: ${isSingle ? '1fr' : 'repeat(3, 1fr)'}; gap: 4px; margin-top: 8px; margin-bottom: 8px; max-width: ${isSingle ? '200px' : '100%'};">
        ${images.map(img => `
          <div style="${isSingle ? 'aspect-ratio: 4/3;' : 'aspect-ratio: 1;'} background: #eee; border-radius: 4px; overflow: hidden;" onclick="event.stopPropagation(); openMediaViewer(['${img}'], 0)">
            <img src="${img}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
        `).join('')}
      </div>
    `;
  };

  const renderSocial = (likes, comments) => {
    if ((!likes || likes.length === 0) && (!comments || comments.length === 0)) return '';
    let html = `<div style="background: #f7f7f7; border-radius: 4px; padding: 8px 10px; margin-top: 8px; font-size: 14px; line-height: 1.5;">`;
    
    if (likes && likes.length > 0) {
      const namesHTML = likes.map((n, i) => {
        const isLast = i === likes.length - 1;
        return `<span onclick="event.stopPropagation(); window.openWxProfileByName('${n}', 'moments')" style="color: #576b95; font-weight: 500; cursor:pointer;">${esc(n)}</span>${isLast ? '' : '<span style="color: #576b95;">，</span>'}`;
      }).join('');
      
      html += `<div style="display:flex; gap:6px; align-items:flex-start; ${comments && comments.length > 0 ? 'border-bottom:0.5px solid #e5e5ea; padding-bottom:8px; margin-bottom:8px;' : ''}">
                 <div style="width: 18px; height: 18px; flex:none; display:flex; align-items:center; justify-content:center; margin-top:2px;">
                   ${G.heart.replace('<svg', '<svg width="18" height="18" style="color:#576b95;"')}
                 </div>
                 <div style="flex:1;">${namesHTML}</div>
               </div>`;
    }
    
    if (comments && comments.length > 0) {
      comments.forEach(c => {
        html += `<div style="margin-top: 4px;">`;
        html += `<span onclick="event.stopPropagation(); window.openWxProfileByName('${c.user}', 'moments')" style="color: #576b95; font-weight: 500; cursor:pointer;">${esc(c.user)}</span>`;
        if (c.replyTo) {
          html += ` <span style="color: #111;">回复</span> <span onclick="event.stopPropagation(); window.openWxProfileByName('${c.replyTo}', 'moments')" style="color: #576b95; font-weight: 500; cursor:pointer;">${esc(c.replyTo)}</span>`;
        }
        html += `<span style="color: #111;">：${esc(c.text)}</span>`;
        html += `</div>`;
      });
    }
    html += `</div>`;
    return html;
  };

  return {
    cls: "dark",
    html: `
    <div class="nav" id="moments-nav" style="position: absolute; z-index: 10; top: 0; left: 0; right: 0; height: 98px; padding: 54px 16px 0; display: flex; align-items: center; justify-content: space-between; color: #fff; background: transparent; transition: background 0.3s, color 0.3s; box-shadow: none; pointer-events: none;">
      <button class="nb-back" onclick="back()" style="pointer-events:auto; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));">${G.chevL}</button>
      <div id="moments-nav-title" style="position: absolute; left: 50%; transform: translateX(-50%); font-size: 17px; font-weight: 600; opacity: 0; transition: opacity 0.3s;">朋友圈</div>
      <div style="pointer-events:auto; display: flex; gap: 18px; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));">
        <span onclick="openMomentCompose()" style="cursor:pointer;">${G.camera}</span>
      </div>
    </div>

    <div class="scroll" id="moments-scroll" style="background: #fff; padding-top: 0; padding-bottom: 40px;">
      
      <div style="position: relative; height: 300px; background: url('${MOCK_MOMENTS_DATA["穆祉丞"]?.cover || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800"}') center/cover;">
        <div style="position: absolute; inset: 0; background: linear-gradient(transparent 60%, rgba(0,0,0,0.4));"></div>
        
        <div style="position: absolute; bottom: 20px; right: 16px; display: flex; align-items: flex-end; gap: 12px;">
          <div style="text-align: right; color: #fff; padding-bottom: 4px;">
            <div style="font-size: 18px; font-weight: 600; text-shadow: 0 1px 3px rgba(0,0,0,0.5);">小狗团汪汪</div>
          </div>
          <img src="${CFG.myAvatar || './data/avatar/miantuan.jpg'}" style="width: 70px; height: 70px; border-radius: 8px; border: 2px solid #fff; object-fit: cover;">
        </div>
      </div>

      <div style="padding-bottom: 20px;">
        ${allPosts.map((m, index) => `
          <div onclick="openMomentDetailFromFeed(${index})" style="display: flex; gap: 12px; padding: 20px 16px; border-bottom: 0.5px solid #f0f0f0; cursor: pointer;">
            
            <img src="${m.avatar}" onclick="event.stopPropagation(); openWxProfileFromFeed(${index}, 'moments')" style="width: 44px; height: 44px; border-radius: 6px; object-fit: cover; flex-shrink: 0; cursor: pointer;">
            
            <div style="flex: 1; min-width: 0;">
              <div style="color: #576b95; font-size: 16px; font-weight: 600; margin-bottom: 4px;">${esc(m.author)}</div>
              <div style="font-size: 15px; color: #111; line-height: 1.45; white-space: pre-wrap; margin-bottom: 6px;">${esc(m.text)}</div>
              
              ${renderImages(m.images)}
              
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
                <span style="font-size: 12px; color: #999;">${esc(m.time)}</span>
                <div style="background: #f7f7f7; padding: 2px 8px; border-radius: 4px; color: #576b95; font-size: 13px; font-weight: 500; cursor: pointer;" onclick="event.stopPropagation(); wxMomentActionsFromFeed(${index})">•••</div>
              </div>

              ${renderSocial(m.likes, m.comments)}
            </div>
          </div>
        `).join('')}
      </div>
    </div>`,
    
    init: (pg) => {
      const nav = pg.querySelector('#moments-nav');
      const title = pg.querySelector('#moments-nav-title');
      const scroll = pg.querySelector('#moments-scroll');
      if (scroll && nav && title) {
        scroll.addEventListener('scroll', () => {
          if (scroll.scrollTop > 150) {
            nav.style.background = 'rgba(255, 255, 255, 0.96)';
            nav.style.backdropFilter = 'blur(10px)';
            nav.style.color = '#111';
            nav.style.boxShadow = '0 0.5px 0 #eee';
            title.style.opacity = '1';
            nav.querySelectorAll('.nb-back, div[style*="filter"]').forEach(el => el.style.filter = 'none');
          } else {
            nav.style.background = 'transparent';
            nav.style.backdropFilter = 'none';
            nav.style.color = '#fff';
            nav.style.boxShadow = 'none';
            title.style.opacity = '0';
            nav.querySelectorAll('.nb-back, div[style*="filter"]').forEach(el => el.style.filter = 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))');
          }
        });
      }
    }
  };
};