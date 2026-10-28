// 自动拆分自 app_wechat.js（2026-10-28）
// 朋友圈数据（按 角色聊天记录总表.md 重写 · 2026-10-29）
const MOCK_MOMENTS_DATA = {
  "穆祉丞": {
    wxid: "nanpengyou",
    region: "重庆",
    cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=800",
    posts: [
      {
        id: 101,
        date: { day: "今天", month: "" },
        text: "今年也买了两个位置。",
        images: [],
        location: "家里",
        time: "2026年11月15日 21:40",
        likes: ["穆小恩", "恩恩", "兔子", "丞丞"],
        comments: [
          { user: "穆小恩", text: "人呢？电话不接。", replyTo: "" }
        ]
      },
      {
        id: 102,
        date: { day: "13", month: "9月" },
        text: "今天有人说我笑起来像高中生。我十九了。",
        images: [],
        location: "",
        time: "2026年9月13日 23:11",
        likes: ["丞丞", "Mu"],
        comments: []
      }
    ]
  },

  "穆瑞恩": {
    wxid: "xiaobaobei",
    region: "重庆",
    cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800",
    posts: [
      {
        id: 201,
        date: { day: "10", month: "9月" },
        text: "下面有一千个人。我一个都看不见。只看得到我自己。",
        images: [],
        location: "Topking 舞社",
        time: "2017年9月10日 22:40",
        likes: ["张峻豪"],
        comments: []
      },
      {
        id: 202,
        date: { day: "12", month: "12月" },
        text: "压轴。老师说压轴就是最后一个，也是最重要的那个。",
        images: [],
        location: "重庆国际少儿时装周",
        time: "2016年12月12日 21:10",
        likes: [],
        comments: []
      },
      {
        id: 203,
        date: { day: "13", month: "9月" },
        text: "今天也没有偷懒。",
        images: [],
        location: "",
        time: "2016年9月13日 21:30",
        likes: [],
        comments: []
      }
    ]
  },

  "穆小恩": {
    wxid: "haoguimi",
    region: "北京",
    cover: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800",
    posts: [
      {
        id: 301,
        date: { day: "昨天", month: "" },
        text: "等一个人。他不来我自己喝。",
        images: [],
        location: "楼下小馆",
        time: "2026年11月14日 21:40",
        likes: ["穆祉丞"],
        comments: [
          { user: "穆祉丞", text: "两瓶？", replyTo: "" },
          { user: "穆小恩", text: "一瓶没开，你猜是哪瓶。", replyTo: "穆祉丞" }
        ]
      },
      {
        id: 302,
        date: { day: "10", month: "11月" },
        text: "第一张是待办。下面六张都是骂人的。",
        images: [],
        location: "工位",
        time: "2026年11月10日 12:30",
        likes: ["恩仔"],
        comments: [
          { user: "恩仔", text: "穆小恩加油！", replyTo: "" }
        ]
      }
    ]
  },

  "恩恩": {
    wxid: "laopo_jiao",
    region: "重庆",
    cover: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800",
    posts: [
      {
        id: 401,
        date: { day: "今天", month: "" },
        text: "等一个人，等到灯都困了。",
        images: [],
        location: "家",
        time: "2026年11月15日 20:10",
        likes: ["兔子", "穆小恩"],
        comments: [
          { user: "穆小恩", text: "别等了，他手机丢了。", replyTo: "" },
          { user: "恩恩", text: "……哦。", replyTo: "穆小恩" }
        ]
      },
      {
        id: 402,
        date: { day: "11", month: "11月" },
        text: "一个在我这，一个在你那。",
        images: [],
        location: "",
        time: "2026年11月11日 23:50",
        likes: ["穆祉丞"],
        comments: []
      }
    ]
  },

  "cat": {
    wxid: "laopo_zuo",
    region: "重庆",
    cover: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800",
    posts: [
      {
        id: 501,
        date: { day: "13", month: "11月" },
        text: "他比我重要。",
        images: ["https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=500"],
        location: "家",
        time: "2026年11月13日 02:14",
        likes: ["恩恩"],
        comments: [
          { user: "恩恩", text: "猫猫好可爱。", replyTo: "" },
          { user: "黑猫", text: "重点是这个吗。", replyTo: "恩恩" }
        ]
      }
    ]
  },

  "丞丞": {
    wxid: "chengcheng",
    region: "重庆",
    cover: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800",
    posts: [
      {
        id: 601,
        date: { day: "15", month: "7月" },
        text: "😼",
        images: [],
        location: "",
        time: "2026年7月15日 18:20",
        likes: ["穆祉丞", "穆小恩"],
        comments: [
          { user: "穆祉丞", text: "恭喜。", replyTo: "" },
          { user: "丞丞", text: "最后一名也是名。", replyTo: "穆祉丞" }
        ]
      },
      {
        id: 602,
        date: { day: "20", month: "12月" },
        text: "我想踢球了",
        images: [],
        location: "八中操场",
        time: "2025年12月20日 10:58",
        likes: ["穆祉丞"],
        comments: [
          { user: "穆祉丞", text: "耍起！", replyTo: "" },
          { user: "丞丞", text: "等考完。真的。", replyTo: "穆祉丞" }
        ]
      }
    ]
  },

  "pig": {
    wxid: "xiaopangpang",
    region: "重庆",
    cover: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800",
    posts: [
      {
        id: 701,
        date: { day: "今天", month: "" },
        text: "等一个人回来吃饭。",
        images: [],
        location: "家",
        time: "2026年11月15日 19:30",
        likes: ["兔子", "恩恩", "黑猫"],
        comments: [
          { user: "兔子", text: "我也留了饭。", replyTo: "" },
          { user: "猪", text: "那我们两个一起等。", replyTo: "兔子" }
        ]
      }
    ]
  },

  "Mu": {
    wxid: "CSGOD",
    region: "上海",
    cover: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800",
    posts: [
      {
        id: 801,
        date: { day: "14", month: "11月" },
        text: "2:0",
        images: [],
        location: "训练室",
        time: "2026年11月14日 23:52",
        likes: ["丞丞"],
        comments: []
      },
      {
        id: 802,
        date: { day: "12", month: "11月" },
        text: "再打一局。",
        images: [],
        location: "训练室",
        time: "2026年11月12日 01:30",
        likes: [],
        comments: [
          { user: "丞丞", text: "几点了哥。", replyTo: "" },
          { user: "Mu", text: "1", replyTo: "丞丞" }
        ]
      }
    ]
  },

  "MuAMuA": {
    wxid: "mama",
    region: "重庆",
    cover: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800",
    posts: [
      {
        id: 901,
        date: { day: "今天", month: "" },
        text: "煲了汤，等一个不按时回家的人。",
        images: [],
        location: "厨房",
        time: "2026年11月15日 18:00",
        likes: ["恩恩", "穆小恩"],
        comments: [
          { user: "穆小恩", text: "阿姨我可以去喝吗。", replyTo: "" },
          { user: "MuAMuA", text: "来吧，宝宝。", replyTo: "穆小恩" }
        ]
      }
    ]
  },

  "丞哥": {
    wxid: "cgcgdsg",
    region: "重庆",
    cover: "https://images.unsplash.com/photo-1502136969935-8d8eef54d77b?q=80&w=800",
    posts: [
      {
        id: 1001,
        date: { day: "11", month: "11月" },
        text: "不乖。",
        images: [],
        location: "",
        time: "2026年11月11日 23:40",
        likes: [],
        comments: []
      }
    ]
  },

  "恩仔": {
    wxid: "xiaolianxisheng",
    region: "重庆",
    cover: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800",
    posts: [
      {
        id: 1101,
        date: { day: "16", month: "11月" },
        text: "十四岁了。不可以随便哭。",
        images: [],
        location: "练习室",
        time: "2021年11月16日 22:50",
        likes: [],
        comments: []
      },
      {
        id: 1102,
        date: { day: "31", month: "7月" },
        text: "今天有一场戏，我 NG 了七次。但是过了。",
        images: [],
        location: "片场",
        time: "2020年7月31日 23:10",
        likes: [],
        comments: []
      },
      {
        id: 1103,
        date: { day: "12", month: "3月" },
        text: "一个人也可以的。",
        images: [],
        location: "",
        time: "2020年3月12日 22:40",
        likes: [],
        comments: []
      }
    ]
  },

  "rabbit": {
    wxid: "laopo_guai",
    region: "重庆",
    cover: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800",
    posts: [
      {
        id: 1201,
        date: { day: "昨天", month: "" },
        text: "三个月前，他说过一次。",
        images: [],
        location: "",
        time: "2026年11月14日 21:15",
        likes: ["恩恩"],
        comments: [
          { user: "恩恩", text: "你还记着啊。", replyTo: "" },
          { user: "兔子", text: "嗯，我记性好。", replyTo: "恩恩" }
        ]
      },
      {
        id: 1202,
        date: { day: "12", month: "11月" },
        text: "坐反了。不过终点站的日落挺好看的。",
        images: [],
        location: "地铁终点站",
        time: "2026年11月12日 19:05",
        likes: ["猪"],
        comments: []
      },
      {
        id: 1203,
        date: { day: "10", month: "11月" },
        text: "留了一份。等你回来。",
        images: [],
        location: "家",
        time: "2026年11月10日 22:30",
        likes: ["猪", "MuAMuA"],
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
  window._mDetailOpen = false;
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
  window._mDetailOpen = false;
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
        const time = last ? wxTimeLabel(last[2]) : "";
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
      rejected: m[3] === "rejected", // 被对方删除后发出的消息
      rawIdx: rawIdx,
    });
  });
  return items;
}

function chatMsgs(id) {
  const it = chatItems(id);
  let o = "";
  let currentDateLabel = "11月15日";
  const getMins = timeToMin;
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
    const nextIt = it[i + 1];
    const nextRej = nextIt && !nextIt.date && nextIt.rejected;
    const rejHtml =
      me && x.rejected
        ? `<span class="wx-reject-ic" onclick="event.stopPropagation();toastDev('消息发送失败：你还不是对方好友')">!</span>`
        : "";
    const rejTip =
      me && x.rejected && !nextRej
        ? `<div class="wx-reject-tip">你还不是对方好友，请先发送朋友验证</div>`
        : "";
    o += `<div class="wx-ln ${me ? "me" : "th"}"><div class="wx-sav" onclick="event.stopPropagation();wxPatTap(event,${me},'${x.sender}')">${avatarFor(x.sender, false, me)}</div><div style="display: flex; flex-direction: column; align-items: ${me ? "flex-end" : "flex-start"}; max-width: calc(100% - 60px);"><div style="display: flex; align-items: center; flex-direction: ${me ? "row-reverse" : "row"}; gap: 6px;"><div class="${bubbleClass}" data-idx="${x.rawIdx}" ${onclickAttr} ${holdEvent}>${innerContent}</div>${rejHtml}${!me ? dotHtml : ""}${!me ? btnHtml : ""}</div>${rejTip}${textHtml}</div></div>`;
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
  // 拍完不回消息，对方会回一个「？」
  if (!isSelf) {
    const target = chatId;
    const snap = chatData[target].length;
    setTimeout(
      () => {
        if (view !== "chat" && view !== "wechat") return;
        const arr = chatData[target] || [];
        const replied =
          typeof lastMsgFromMe === "function" && lastMsgFromMe(target);
        if (replied || arr.length > snap) return;
        if (typeof botSay === "function") botSay(target, "？");
        if (chatId === target) refreshChat(true);
      },
      18000 + Math.random() * 4000,
    );
  }
}
// 头像单击不跳个人主页，双击 = 拍一拍
window.wxPatTap = function (e, isSelf, name) {
  const el = e && e.currentTarget;
  const now = Date.now();
  // 双击 = 拍一拍
  if (el && el._patT && now - el._patT < 300) {
    clearTimeout(el._tapTimer);
    el._patT = 0;
    doPat(isSelf);
    return;
  }
  if (el) {
    el._patT = now;
    clearTimeout(el._tapTimer);
    // 单击 = 进对方资料页（延迟 300ms，等双击判定）
    el._tapTimer = setTimeout(() => {
      if (!isSelf && name) openWxProfileByName(name, "chat");
    }, 300);
  }
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
  window.clearPatience(chatId);
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
        window.clearPatience(chatId);
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
  window.clearPatience(chatId);
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
/* ---------- 耐心值：回得慢就错过这段对话 ---------- */
window._patience = window._patience || {};
function armPatience(name) {
  if (!name) return;
  if (typeof SS.missed === "undefined") SS.missed = new Set();
  if (SS.missed.has(name)) return;
  clearTimeout(window._patience[name]);
  const sec = (CFG.patienceSec || 100) * 1000;
  window._patience[name] = setTimeout(() => {
    if (typeof lastMsgFromMe === "function" && lastMsgFromMe(name)) return;
    SS.missed.add(name);
    if (typeof saveStory === "function") saveStory();
    const line =
      (CFG.missLines && CFG.missLines[name]) ||
      (CFG.missLines && CFG.missLines.default) ||
      "算了。";
    const arr = chatData[name] || (chatData[name] = []);
    const last = arr[arr.length - 1];
    if (last && last[0] === line && last[1] === "them") return;
    arr.push([line, "them", nowAmpm()]);
    saveChat();
    if (view === "chat" && chatId === name) refreshChat(true);
    else {
      unread[name] = (unread[name] || 0) + 1;
      if (typeof notifyFrom === "function") notifyFrom(name, line);
    }
  }, sec);
}
window.clearPatience = function (name) {
  if (window._patience[name]) clearTimeout(window._patience[name]);
  window._patience[name] = null;
};

function deliverFrom(from, text) {
  if (!chatData[from]) chatData[from] = [];
  const arr = chatData[from];
  if (arr.length > 0) {
    const last = arr[arr.length - 1];
    if (last[0] === text && last[1] === "them") return;
  }
  chatData[from].push([text, "them", nowAmpm()]);
  saveChat();
  armPatience(from);
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
  // 媒体消息的通知只显示类型，别把文件路径甩到锁屏上
  const raw = String(body || "");
  for (const k of ["[图片]", "[视频]", "[语音]", "[表情]"]) {
    if (raw.startsWith(k)) {
      body = k;
      break;
    }
  }
  sfx("msg");
  vib([30, 60, 30]);
  if (view === "lock" || view === "pin") {
    lockNotes.unshift({ title: wxName(from), body, app: "wechat", time: t("now") });
    if (lockNotes.length > 30) lockNotes.length = 30;
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
// 不做任何持久化：每次刷新都是全新的一局
function saveStory() {}
function saveChat() {}
window.resetWxChat = function () {
  location.reload();
};
