// ==========================================
// 📱 小红书模块 (app_xhs.js)
// ==========================================

const XHS_AVATAR_MZC = "./data/xhs/mzc.jpg";
const XHS_AVATAR_DEFAULT =
  "./data/avatar/me.jpg";

window.xhsSearchHistory = [
  "男生经常半夜给你发球衣照片是什么意思",
  "室友是猪",
  "北京2026供暖时间",
  "tx由你榜",
  "男朋友喜欢足球送什么生日礼物",
  "蓝猫 减肥",
  "折耳根调料汁",
  "咖啡店兼职风险",
  "耳洞发炎怎么办",
];
window.xhsSearchActive = false;
window.xhsIsRecording = false;
window.xhsHistoryExpanded = false;

const baseNotes = [

  {
    title: "我只有丞丞一只小猪",
    author: "恩恩养猪基地",
    avatar: XHS_AVATAR_DEFAULT,
    likes: "1306",
    liked: false,
    cover: "./data/xhs/pig.jpg",
    type: "local_img",
    h: 190,
    followType: null,
  },
  // 👇 这是新替换的“丑萌玩偶”
  {
    title: "好像杀错型号了🥺 怎么这么大一坨啊",
    author: "我零食ne",
    avatar: XHS_AVATAR_DEFAULT,
    likes: "470",
    liked: false,
    cover: "./data/xhs/mutou.jpg", // 👈 记得把图片放进这个路径
    type: "local_img",
    h: 240, // 高度设成 310，适配这张图的比例
    followType: null,
  },
  
  //最后上线前更新 11-15
  {
    title: "放一些照片在这里",
    author: "穆祉丞",
    avatar: XHS_AVATAR_MZC,
    likes: "7.1万",
    liked: false,
    cover: "./data/xhs/xhs-cover.jpg",
    video: "./data/xhs/xhs.mp4",
    type: "link",
    url: "https://www.xiaohongshu.com/explore/6af1ce760000000034003f55?xsec_token=ABGdw_OWVcSLkDMSgkT-KUztU0EETSEGYQJWdC15yiln8=&xsec_source=pc_search",
    h: 245,
    followType: "mutual",
  },

  {
    title: "足球宝贝⚽",
    author: "RealM",
    avatar: XHS_AVATAR_DEFAULT,
    likes: "3324",
    liked: false,
    cover: "./data/xhs/bb.jpg",
    type: "local_img",
    h: 320,
    followType: null,
  },

  
  // 👇 这是新替换的“丑萌玩偶”
  {
    title: "",
    author: "深情路人攻",
    avatar: XHS_AVATAR_DEFAULT,
    likes: "99",
    liked: false,
    cover: "./data/xhs/lr.jpg", // 👈 记得把图片放进这个路径
    type: "local_img",
    h: 150, // 高度设成 310，适配这张图的比例
    followType: null,
  },
];

function getFollowTagHTML(type) {
  if (!type) return "";
  const isMutual = type === "mutual";
  const text = isMutual ? "互相关注" : "你的关注";
  const bgColor = isMutual ? "#5dc76d" : "#68c27d";
  return `<div style="display:flex; align-items:center; font-size:11px; color:#666; margin-bottom:4px;">${G.xhsMutual(bgColor)}${text}</div>`;
}

window.openXhsSearch = function (e) {
  if (e) e.stopPropagation();
  window.xhsSearchActive = true;
  show("xhs", "none");
};

window.closeXhsSearch = function (e) {
  if (e) e.stopPropagation();
  window.xhsSearchActive = false;
  window.xhsHistoryExpanded = false;
  show("xhs", "none");
};

window.toggleXhsExpand = function (e) {
  if (e) e.stopPropagation();
  window.xhsHistoryExpanded = !window.xhsHistoryExpanded;
  show("xhs", "none");
};

window.deleteXhsHistory = function (e, index) {
  if (e) e.stopPropagation();
  window.xhsSearchHistory.splice(index, 1);
  show("xhs", "none");
};

window.clearXhsHistory = function (e) {
  if (e) e.stopPropagation();
  window.xhsSearchHistory = [];
  show("xhs", "none");
};

window.startXhsRecord = function (e) {
  e.preventDefault();
  window.xhsIsRecording = true;
  const t = document.getElementById("xhs-search-hint");
  if (t) t.textContent = "松开 搜索";
};

window.endXhsRecord = function (e) {
  e.preventDefault();
  window.xhsIsRecording = false;
  const t = document.getElementById("xhs-search-hint");
  if (t) t.textContent = "按住提问 有问必答 ✨";
  toastDev();
};

window.toggleLikeXhs = function (e, el, index) {
  if (e) e.stopPropagation();
  const note = baseNotes[index];
  if (!note) return;

  const iconContainer = el.querySelector(".heart-icon-container");
  const countEl = el.querySelector(".like-count");
  note.liked = !note.liked;

  let rawStr = countEl.textContent;
  let isWan = rawStr.includes("万");
  let num = parseFloat(rawStr);

  if (note.liked) {
    num += isWan ? 0.1 : 1;
    if (iconContainer) {
      iconContainer.innerHTML = G.xhsLikeHeart(true);
      iconContainer.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(1.4)" },
          { transform: "scale(1)" },
        ],
        { duration: 300, easing: "cubic-bezier(.2,1.4,.4,1)" },
      );
    }
    if (typeof vib === "function") vib(10);
  } else {
    num -= isWan ? 0.1 : 1;
    if (iconContainer) {
      iconContainer.innerHTML = G.xhsLikeHeart(false);
    }
  }

  let newStr = isWan ? num.toFixed(1) + "万" : Math.floor(num);
  countEl.textContent = newStr;
  note.likes = newStr;
};

function renderXhsCard(note, index) {
  let mediaHTML = "";
  let onclickAction = "";
  if (note.type === "link") {
    const isHttp = note.cover.startsWith("http") || note.cover.startsWith("./");
    if (note.video) {
      mediaHTML = `<video src="${esc(note.video)}" poster="${esc(note.cover)}" muted playsinline preload="none" style="width:100%; height:100%; object-fit:cover; display:block; pointer-events:none;"></video>`;
    } else if (isHttp) {
      mediaHTML = `<img src="${note.cover}" style="width:100%; height:100%; object-fit:cover; display:block;" onerror="this.style.display='none'">`;
    } else {
      mediaHTML = `<div style="width:100%; height:100%; background:${note.cover}; display:flex; align-items:center; justify-content:center; color:#fff; font-size:14px; font-weight:600;">[ 链接笔记 ]</div>`;
    }
    onclickAction = `event.stopPropagation(); window.open('${note.url}', '_blank')`;
  } else if (note.type === "local_video") {
    mediaHTML = `
      <video src="${note.video}" muted preload="metadata" style="width:100%; height:100%; object-fit:cover; pointer-events:none; border-radius: 8px 8px 0 0;"></video>
      <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:32px; height:32px; background:rgba(0,0,0,0.4); border-radius:50%; display:grid; place-items:center; font-size:12px; padding-left:2px; backdrop-filter:blur(4px); color:#fff;">▶</div>
    `;
    onclickAction = `event.stopPropagation(); openMediaViewer(['${note.video}'], 0)`;
  } else if (note.type === "web_img" || note.type === "local_img") {
    const isHttp = note.cover.startsWith("http") || note.cover.startsWith("./");
    if (isHttp) {
      mediaHTML = `<img src="${note.cover}" style="width:100%; height:100%; object-fit:cover; display:block;" onerror="this.style.display='none'">`;
      onclickAction = `event.stopPropagation(); openMediaViewer(['${note.cover}'], 0)`;
    } else {
      mediaHTML = `<div style="width:100%; height:100%; background:${note.cover}; display:flex; align-items:center; justify-content:center; color:#fff; font-size:14px; font-weight:600; text-shadow:0 1px 3px rgba(0,0,0,0.3);">[ 笔记 ]</div>`;
      onclickAction = `event.stopPropagation(); toastDev()`;
    }
  }
  const bgColor = note.cover.startsWith("linear") ? note.cover : "#f0f0f0";
  return `
    <div onclick="${onclickAction}" style="width:100%; box-sizing:border-box; background:#fff; border-radius:8px; overflow:hidden; cursor:pointer; border: 0.5px solid #f0f0f0; margin-bottom:6px; transform: translateZ(0);">
      <div style="position:relative; width:100%; height:${note.h}px; background:${bgColor}; border-radius: 8px 8px 0 0; overflow:hidden;">
         ${mediaHTML}
      </div>
      <div style="padding:8px 10px 10px;">
        ${getFollowTagHTML(note.followType)}
        <div style="font-size:13.5px; color:#111; font-weight:500; line-height:1.4; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; margin-bottom:6px;">
          ${esc(note.title)}
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:11px; color:#999; gap:8px;">
          <div style="display:flex; align-items:center; gap:4px; flex:1; min-width:0;">
            <div style="width:16px; height:16px; border-radius:50%; overflow:hidden; background:#eee; flex:none;">
              <img src="${note.avatar || XHS_AVATAR_DEFAULT}" style="width:100%; height:100%; object-fit:cover;">
            </div>
            <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:#666; font-size:11px;">${esc(note.author)}</span>
          </div>
          <div onclick="toggleLikeXhs(event, this, ${index})" style="display:flex; align-items:center; gap:3px; flex:none; z-index:2; position:relative; padding: 2px;">
            <div class="heart-icon-container">${G.xhsLikeHeart(note.liked)}</div>
            <span class="like-count" style="font-size:11px;">${note.likes}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

VIEWS.xhs = () => {
  if (window.xhsSearchActive) {
    return {
      html: `
      <div class="scroll" style="background:#fff; padding-top:54px; padding-bottom:120px; z-index:50;">
        
        <div style="position:sticky; top:0; z-index:10; background:#fff; display:flex; align-items:center; gap:12px; padding:6px 16px 10px;">
          <div onclick="closeXhsSearch(event)" style="width:24px; height:24px; display:grid; place-items:center; cursor:pointer; flex:none;">
            ${G.xhsBack}
          </div>
          
          <div style="flex:1; min-width:0; background:#f5f5f5; border-radius:20px; height:36px; display:flex; align-items:center; padding:0 12px; box-sizing:border-box;">
            <span style="font-size:14px; color:#999; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">曼联9轮7分</span>
            <div style="display:flex; align-items:center; gap:8px; flex:none; margin-left:auto;">
              ${G.xhsCamera}
              <div style="width:1px; height:14px; background:#ccc;"></div>
              <span style="color:#333; font-weight:600; font-size:14px;">搜索</span>
            </div>
          </div>
        </div>
        
        <div style="padding:16px;">
          ${
            window.xhsSearchHistory.length > 0
              ? `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <span style="font-size:16px; font-weight:700; color:#111;">历史记录</span>
            <div onclick="clearXhsHistory(event)" style="color:#999; display:flex; align-items:center; cursor:pointer; padding:4px;">
              ${G.xhsDelete}
            </div>
          </div>
          
          <div style="display:flex; flex-wrap:wrap; gap:10px; align-items:center;">
            ${(window.xhsHistoryExpanded
              ? window.xhsSearchHistory
              : window.xhsSearchHistory.slice(0, 5)
            )
              .map(
                (h, i) => `
              <div onclick="toastDev()" style="background:#fff; border:0.5px solid #e5e5e5; border-radius:20px; padding:8px 14px; font-size:13.5px; color:#333; display:flex; align-items:center; gap:6px; max-width:100%; cursor:pointer;">
                <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:220px;">${esc(h)}</span>
                <span onclick="deleteXhsHistory(event, ${i})" style="color:#ccc; font-size:16px; display:inline-block; padding:0 2px;">×</span>
              </div>
            `,
              )
              .join("")}
            
            ${
              window.xhsSearchHistory.length > 5
                ? `
              <div onclick="toggleXhsExpand(event)" 
                   style="width:33px; height:33px; border-radius:50%; background:#fff; border:1px solid #eee; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                ${G.xhsArrowDown(window.xhsHistoryExpanded)}
              </div>
            `
                : ``
            }
          </div>
          `
              : ""
          }

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:32px; margin-bottom:16px;">
            <span style="font-size:16px; font-weight:700; color:#111;">猜你想搜</span>
            <span style="font-size:13px; color:#999; display:flex; align-items:center; gap:4px;">已隐藏
              ${G.xhsHideEye}
            </span>
          </div>
        </div>

        <div style="position:absolute; bottom:40px; left:0; right:0; display:flex; flex-direction:column; align-items:center; gap:16px; pointer-events:none;">
          <div id="xhs-search-hint" style="font-size:14px; color:#666; font-weight:500;">按住提问 有问必答 ✨</div>
          <div onpointerdown="startXhsRecord(event)" onpointerup="endXhsRecord(event)" onpointerleave="endXhsRecord(event)" 
               style="width:120px; height:60px; background:#fff; border-radius:30px; box-shadow:0 4px 16px rgba(0,0,0,0.1); display:flex; align-items:center; justify-content:center; border:1px solid #eee; touch-action:none; pointer-events:auto;">
            ${G.xhsVoice}
          </div>
        </div>
      </div>`,
    };
  }

  return {
    html: `
    <div style="position:absolute; top:0; left:0; right:0; background:#fff; z-index:10; display:flex; flex-direction:column; padding-top:30px;">
      <div style="display:flex; justify-content:center; align-items:center; height:40px; gap:36px; font-size:15px; color:#666;">
        <span onclick="toastDev()">关注</span>
        <span style="font-weight:600; color:#111; font-size:17px; position:relative;">发现<span style="position:absolute; bottom:-6px; left:50%; transform:translateX(-50%); width:20px; height:3px; background:#ff2442; border-radius:2px;"></span></span>
        <span onclick="toastDev()">北京</span>
      </div>
      
      <div style="padding:6px 16px 10px;">
        <div onclick="openXhsSearch(event)" style="background:#f5f5f5; border-radius:18px; height:34px; display:flex; align-items:center; padding:0 12px; font-size:14px; color:#999; cursor:pointer;">
          ${G.xhsSearchGray}
          曼联10轮8分
        </div>
      </div>

      <div style="display:flex; justify-content:space-around; padding:8px 4px; font-size:13.5px; color:#666; border-bottom:0.5px solid #f0f0f0;">
        <span style="font-weight:700; color:#111;">推荐</span>
        <span onclick="toastDev()">视频</span>
        <span onclick="toastDev()">直播</span>
        <span onclick="toastDev()">穿搭</span>
        <span onclick="toastDev()">美食</span>
        <span onclick="toastDev()">彩妆</span>
        <span onclick="toastDev()">影视</span>
      </div>
    </div>

    <div class="scroll" id="xhs-scroll" style="background:#f4f4f4; padding-top:155px; padding-bottom:90px;">
      <div style="display:flex; gap:6px; padding:8px; align-items:flex-start;">
        <div id="xhs-col-left" style="flex:1; min-width:0; display:flex; flex-direction:column;"></div>
        <div id="xhs-col-right" style="flex:1; min-width:0; display:flex; flex-direction:column;"></div>
      </div>
    </div>

    <div class="tabbar" style="background:#fff; border-top:0.5px solid #eee; display:flex; padding-bottom:20px;">
      <button onclick="toastDev()" style="color:#111; display:flex; flex-direction:column; align-items:center; gap:4px; flex:1; border:none; background:none;">
        ${G.xhsTabHome}
        <span style="font-size:10px; font-weight:500;">首页</span>
      </button>
      <button onclick="toastDev()" style="color:#111; display:flex; flex-direction:column; align-items:center; gap:4px; flex:1; border:none; background:none;">
        ${G.xhsTabVideo}
        <span style="font-size:10px; font-weight:500;">视频</span>
      </button>
      <div style="flex:1; display:flex; justify-content:center;">
        <button onclick="toastDev()" style="width:52px; height:36px; border-radius:18px; background:#ff2442; color:#fff; display:flex; align-items:center; justify-content:center; border:none; transform:translateY(-8px); box-shadow:0 2px 6px rgba(255,36,66,0.3);">
          ${G.xhsPlusFab}
        </button>
      </div>
      <button onclick="toastDev()" style="color:#111; display:flex; flex-direction:column; align-items:center; gap:4px; flex:1; border:none; background:none;">
        ${G.xhsTabMessage}
        <span style="font-size:10px; font-weight:500;">消息</span>
      </button>
      <button onclick="toastDev()" style="color:#111; display:flex; flex-direction:column; align-items:center; gap:4px; flex:1; border:none; background:none;">
        ${G.xhsTabMe}
        <span style="font-size:10px; font-weight:500;">我</span>
      </button>
    </div>`,
    init: () => {
      const colLeft = document.getElementById("xhs-col-left");
      const colRight = document.getElementById("xhs-col-right");
      if (!colLeft || !colRight) return;
      baseNotes.forEach((note, i) => {
        const html = renderXhsCard(note, i);
        if (i % 2 === 0) colLeft.insertAdjacentHTML("beforeend", html);
        else colRight.insertAdjacentHTML("beforeend", html);
      });
    },
  };
};
