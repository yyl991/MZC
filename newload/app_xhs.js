// ==========================================
// 📱 小红书模块 (app_xhs.js) - 顶部紧凑无缝隙版
// ==========================================

const XHS_AVATAR_MZC = "./data/avatar/mzc.jpg"; 
const XHS_AVATAR_DEFAULT = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop"; 

window.xhsSearchHistory = [
  "男友回避型怎么办", 
  "intp男生容易喜欢什...", 
  "同性结婚合法的国家", 
  "左航梦女素材", 
  "邓佳鑫新歌", 
  "左航德文猫塑", 
  "异瞳德文", 
  "金渐层多重算胖",
  "望京漂亮饭"
];
window.xhsSearchActive = false;
window.xhsIsRecording = false;
window.xhsHistoryExpanded = false; 

const baseNotes = [
  { title: "用户穆祉丞的某天", author: "穆祉丞", avatar: XHS_AVATAR_MZC, likes: "7.1万", liked: false, cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500&auto=format&fit=crop", type: "link", url: "https://www.xiaohongshu.com/explore/6ad4a49f000000002900f6ef", h: 260, followType: "mutual" },
  { title: "舒仔闪亮到场🥳现场的朋友们举手让我看到！", author: "舒客", avatar: XHS_AVATAR_DEFAULT, likes: "3451", liked: false, cover: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=500&auto=format&fit=crop", type: "web_img", h: 200, followType: "following" },
  { title: "表现不好的人能被喷成筛子", author: "star侃球", avatar: XHS_AVATAR_DEFAULT, likes: "98", liked: false, cover: "linear-gradient(135deg, #84fab0, #8fd3f4)", type: "local_video", video: "./data/chat/1.mp4", h: 280, followType: null },
  { title: "令人心动的Offer程序员季", author: "可不可以不工作", avatar: XHS_AVATAR_DEFAULT, likes: "1278", liked: false, cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500&auto=format&fit=crop", type: "web_img", h: 220, followType: "following" },
  { title: "看看我在圣钓江湖赛签到活捉到了谁？！", author: "大大Niko", avatar: XHS_AVATAR_DEFAULT, likes: "7844", liked: false, cover: "linear-gradient(135deg, #ffecd2, #fcb69f)", type: "web_img", h: 260, followType: null },
  { title: "奶丞？奶丞！", author: "吉么", avatar: XHS_AVATAR_DEFAULT, likes: "87", liked: false, cover: "linear-gradient(135deg, #a8edea, #fed6e3)", type: "web_img", h: 210, followType: "mutual" }
];

function getFollowTagHTML(type) {
  if (!type) return '';
  const isMutual = type === 'mutual';
  const text = isMutual ? '互相关注' : '你的关注';
  const bgColor = isMutual ? '#5dc76d' : '#68c27d'; 
  const iconSVG = `<svg viewBox="0 0 24 24" width="12" height="12" style="background:${bgColor}; border-radius:50%; padding:2px; fill:#fff; display:inline-block; vertical-align:middle; margin-right:4px;"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>`;
  return `<div style="display:flex; align-items:center; font-size:11px; color:#666; margin-bottom:4px;">${iconSVG}${text}</div>`;
}

window.openXhsSearch = function(e) {
  if(e) e.stopPropagation();
  window.xhsSearchActive = true;
  show('xhs', 'none');
};

window.closeXhsSearch = function(e) {
  if(e) e.stopPropagation();
  window.xhsSearchActive = false;
  window.xhsHistoryExpanded = false;
  show('xhs', 'none');
};

window.toggleXhsExpand = function(e) {
  if(e) e.stopPropagation();
  window.xhsHistoryExpanded = !window.xhsHistoryExpanded;
  show('xhs', 'none');
};

window.deleteXhsHistory = function(e, index) {
  if(e) e.stopPropagation();
  window.xhsSearchHistory.splice(index, 1);
  show('xhs', 'none');
};

window.clearXhsHistory = function(e) {
  if(e) e.stopPropagation();
  window.xhsSearchHistory = [];
  show('xhs', 'none');
};

window.startXhsRecord = function(e) {
  e.preventDefault();
  window.xhsIsRecording = true;
  const t = document.getElementById("xhs-search-hint");
  if(t) t.textContent = "松开 搜索";
};

window.endXhsRecord = function(e) {
  e.preventDefault();
  window.xhsIsRecording = false;
  const t = document.getElementById("xhs-search-hint");
  if(t) t.textContent = "按住提问 有问必答 ✨";
  toastDev();
};

window.toggleLikeXhs = function(e, el, index) {
  if(e) e.stopPropagation();
  const note = baseNotes[index];
  if (!note) return;
  const icon = el.querySelector('.heart-icon');
  const countEl = el.querySelector('.like-count');
  note.liked = !note.liked;
  let rawStr = countEl.textContent;
  let isWan = rawStr.includes('万');
  let num = parseFloat(rawStr);
  if (note.liked) {
    num += isWan ? 0.1 : 1;
    icon.setAttribute('fill', '#ff2442');
    icon.setAttribute('stroke', '#ff2442');
    icon.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.4)' }, { transform: 'scale(1)' }], { duration: 300, easing: 'cubic-bezier(.2,1.4,.4,1)' });
    if (typeof vib === 'function') vib(10);
  } else {
    num -= isWan ? 0.1 : 1;
    icon.setAttribute('fill', 'none');
    icon.setAttribute('stroke', '#999');
  }
  let newStr = isWan ? (num.toFixed(1) + '万') : Math.floor(num);
  countEl.textContent = newStr;
  note.likes = newStr; 
};

function renderXhsCard(note, index) {
  let mediaHTML = '';
  let onclickAction = '';
  if (note.type === 'link') {
    const isHttp = note.cover.startsWith('http') || note.cover.startsWith('./');
    if (isHttp) {
      mediaHTML = `<img src="${note.cover}" style="width:100%; height:100%; object-fit:cover; display:block;" onerror="this.style.display='none'">`;
    } else {
      mediaHTML = `<div style="width:100%; height:100%; background:${note.cover}; display:flex; align-items:center; justify-content:center; color:#fff; font-size:14px; font-weight:600;">[ 链接笔记 ]</div>`;
    }
    onclickAction = `event.stopPropagation(); window.open('${note.url}', '_blank')`;
  } else if (note.type === 'local_video') {
    mediaHTML = `
      <video src="${note.video}" muted preload="metadata" style="width:100%; height:100%; object-fit:cover; pointer-events:none; border-radius: 8px 8px 0 0;"></video>
      <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:32px; height:32px; background:rgba(0,0,0,0.4); border-radius:50%; display:grid; place-items:center; font-size:12px; padding-left:2px; backdrop-filter:blur(4px); color:#fff;">▶</div>
    `;
    onclickAction = `event.stopPropagation(); openMediaViewer(['${note.video}'], 0)`;
  } else if (note.type === 'web_img' || note.type === 'local_img') {
    const isHttp = note.cover.startsWith('http') || note.cover.startsWith('./');
    if (isHttp) {
      mediaHTML = `<img src="${note.cover}" style="width:100%; height:100%; object-fit:cover; display:block;" onerror="this.style.display='none'">`;
      onclickAction = `event.stopPropagation(); openMediaViewer(['${note.cover}'], 0)`;
    } else {
      mediaHTML = `<div style="width:100%; height:100%; background:${note.cover}; display:flex; align-items:center; justify-content:center; color:#fff; font-size:14px; font-weight:600; text-shadow:0 1px 3px rgba(0,0,0,0.3);">[ 笔记 ]</div>`;
      onclickAction = `event.stopPropagation(); toastDev()`;
    }
  }
  const bgColor = note.cover.startsWith('linear') ? note.cover : '#f0f0f0';
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
            <svg class="heart-icon" viewBox="0 0 24 24" width="14" height="14" fill="${note.liked ? '#ff2442' : 'none'}" stroke="${note.liked ? '#ff2442' : '#999'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            <span class="like-count" style="font-size:11px;">${note.likes}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

VIEWS.xhs = () => {
  // 👇 搜索页面渲染
  if (window.xhsSearchActive) {
    return {
      html: `
      <div class="scroll" style="background:#fff; padding-top:54px; padding-bottom:120px; z-index:50;">
        
        <!-- 顶部固定栏 -->
        <div style="position:sticky; top:0; z-index:10; background:#fff; display:flex; align-items:center; gap:12px; padding:6px 16px 10px;">
          <div onclick="closeXhsSearch(event)" style="width:24px; height:24px; display:grid; place-items:center; cursor:pointer; flex:none;">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 5-7 7 7 7"/></svg>
          </div>
          
          <div style="flex:1; min-width:0; background:#f5f5f5; border-radius:20px; height:36px; display:flex; align-items:center; padding:0 12px; box-sizing:border-box;">
            <span style="font-size:14px; color:#999; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">搜索笔记，用户和商品</span>
            <div style="display:flex; align-items:center; gap:8px; flex:none; margin-left:auto;">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#333" stroke-width="1.8"><path d="M4 8h3.5L9 5.5h6L16.5 8H20v11H4Z"/><circle cx="12" cy="13" r="3.5"/></svg>
              <div style="width:1px; height:14px; background:#ccc;"></div>
              <span style="color:#333; font-weight:600; font-size:14px;">搜索</span>
            </div>
          </div>
        </div>
        
        <!-- 历史记录内容 -->
        <div style="padding:16px;">
          ${window.xhsSearchHistory.length > 0 ? `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <span style="font-size:16px; font-weight:700; color:#111;">历史记录</span>
            <div onclick="clearXhsHistory(event)" style="color:#999; display:flex; align-items:center; cursor:pointer; padding:4px;">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 7h14M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/></svg>
            </div>
          </div>
          
          <div style="display:flex; flex-wrap:wrap; gap:10px; align-items:center;">
            ${(window.xhsHistoryExpanded ? window.xhsSearchHistory : window.xhsSearchHistory.slice(0, 5)).map((h, i) => `
              <div onclick="toastDev()" style="background:#fff; border:0.5px solid #e5e5e5; border-radius:20px; padding:8px 14px; font-size:13.5px; color:#333; display:flex; align-items:center; gap:6px; max-width:100%; cursor:pointer;">
                <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:220px;">${esc(h)}</span>
                <span onclick="deleteXhsHistory(event, ${i})" style="color:#ccc; font-size:16px; display:inline-block; padding:0 2px;">×</span>
              </div>
            `).join('')}
            
            ${window.xhsSearchHistory.length > 5 ? `
              <div onclick="toggleXhsExpand(event)" 
                   style="width:33px; height:33px; border-radius:50%; background:#fff; border:1px solid #eee; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(${window.xhsHistoryExpanded ? '180deg' : '0deg'}); transition: transform 0.3s;">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </div>
            ` : ``}
          </div>
          ` : ''}

          <!-- 猜你想搜 -->
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:32px; margin-bottom:16px;">
            <span style="font-size:16px; font-weight:700; color:#111;">猜你想搜</span>
            <span style="font-size:13px; color:#999; display:flex; align-items:center; gap:4px;">已隐藏
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            </span>
          </div>
        </div>

        <!-- 底部按住提问 -->
        <div style="position:absolute; bottom:40px; left:0; right:0; display:flex; flex-direction:column; align-items:center; gap:16px; pointer-events:none;">
          <div id="xhs-search-hint" style="font-size:14px; color:#666; font-weight:500;">按住提问 有问必答 ✨</div>
          <div onpointerdown="startXhsRecord(event)" onpointerup="endXhsRecord(event)" onpointerleave="endXhsRecord(event)" 
               style="width:120px; height:60px; background:#fff; border-radius:30px; box-shadow:0 4px 16px rgba(0,0,0,0.1); display:flex; align-items:center; justify-content:center; border:1px solid #eee; touch-action:none; pointer-events:auto;">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#ff2442" stroke-width="2" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></svg>
          </div>
        </div>
      </div>`
    };
  }

  // 👇 小红书首页渲染
  return {
    html: `
    <!-- 👇 核心修改：top:0 配合 padding-top:44px，让顶栏直接吸在最上面，去掉多余留白 -->
    <div style="position:absolute; top:0; left:0; right:0; background:#fff; z-index:10; display:flex; flex-direction:column; padding-top:30px;">
      
      <!-- 顶部主导航 -->
      <div style="display:flex; justify-content:center; align-items:center; height:40px; gap:36px; font-size:15px; color:#666;">
        <span onclick="toastDev()">关注</span>
        <span style="font-weight:600; color:#111; font-size:17px; position:relative;">发现<span style="position:absolute; bottom:-6px; left:50%; transform:translateX(-50%); width:20px; height:3px; background:#ff2442; border-radius:2px;"></span></span>
        <span onclick="toastDev()">杭州</span>
      </div>
      
      <!-- 搜索框 -->
      <div style="padding:6px 16px 10px;">
        <div onclick="openXhsSearch(event)" style="background:#f5f5f5; border-radius:18px; height:34px; display:flex; align-items:center; padding:0 12px; font-size:14px; color:#999; cursor:pointer;">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px;"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
          搜索笔记，用户和商品
        </div>
      </div>

      <!-- 👇 核心修改：分类 Tab 增加词汇量，用 space-around 铺满整行，代替之前的自动滑动，视觉上更饱满 -->
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

    <!-- 👇 对应调整 padding-top，确保内容刚好接在顶栏下方 -->
    <div class="scroll" id="xhs-scroll" style="background:#f4f4f4; padding-top:155px; padding-bottom:90px;">
      <div style="display:flex; gap:6px; padding:8px; align-items:flex-start;">
        <div id="xhs-col-left" style="flex:1; min-width:0; display:flex; flex-direction:column;"></div>
        <div id="xhs-col-right" style="flex:1; min-width:0; display:flex; flex-direction:column;"></div>
      </div>
    </div>

    <div class="tabbar" style="background:#fff; border-top:0.5px solid #eee; display:flex; padding-bottom:20px;">
      <button onclick="toastDev()" style="color:#111; display:flex; flex-direction:column; align-items:center; gap:4px; flex:1; border:none; background:none;">
        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M12 3 2 10v11h7v-7h6v7h7V10L12 3z"/></svg>
        <span style="font-size:10px; font-weight:500;">首页</span>
      </button>
      <button onclick="toastDev()" style="color:#111; display:flex; flex-direction:column; align-items:center; gap:4px; flex:1; border:none; background:none;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><rect x="2" y="6" width="20" height="12" rx="4"/><path d="m10 10 5 2-5 2v-4z" fill="currentColor"/></svg>
        <span style="font-size:10px; font-weight:500;">视频</span>
      </button>
      <div style="flex:1; display:flex; justify-content:center;">
        <button onclick="toastDev()" style="width:52px; height:36px; border-radius:18px; background:#ff2442; color:#fff; display:flex; align-items:center; justify-content:center; border:none; transform:translateY(-8px); box-shadow:0 2px 6px rgba(255,36,66,0.3);">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
        </button>
      </div>
      <button onclick="toastDev()" style="color:#111; display:flex; flex-direction:column; align-items:center; gap:4px; flex:1; border:none; background:none;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
        <span style="font-size:10px; font-weight:500;">消息</span>
      </button>
      <button onclick="toastDev()" style="color:#111; display:flex; flex-direction:column; align-items:center; gap:4px; flex:1; border:none; background:none;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span style="font-size:10px; font-weight:500;">我</span>
      </button>
    </div>`,
    init: () => {
      const colLeft = document.getElementById('xhs-col-left');
      const colRight = document.getElementById('xhs-col-right');
      if (!colLeft || !colRight) return;
      baseNotes.forEach((note, i) => {
        const html = renderXhsCard(note, i);
        if (i % 2 === 0) colLeft.insertAdjacentHTML('beforeend', html);
        else colRight.insertAdjacentHTML('beforeend', html);
      });
    }
  };
};