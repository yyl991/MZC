// ==========================================
// 📱 小红书模块 (app_xhs.js) - 顶部遮挡修复+紧凑版
// ==========================================

const XHS_AVATAR_MZC = "./data/avatar/mzc.jpg"; 
const XHS_AVATAR_DEFAULT = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop"; 

const baseNotes = [
  // 🌟 1. 穆祉丞的帖子 (点击跳转真实小红书外链)
  { 
    title: "用户穆祉丞的某天", 
    author: "穆祉丞", 
    avatar: XHS_AVATAR_MZC, 
    likes: "7.1万", 
    liked: false,
    cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500&auto=format&fit=crop", 
    type: "link",
    url: "https://www.xiaohongshu.com/explore/6ad4a49f000000002900f6ef?xsec_token=ABtB0BmHqHq-ZNMqqsB1D-_vdK7paBsl-_yO3U_-eaLFc=&xsec_source=pc_search",
    h: 260, 
    followType: "mutual" 
  },
  // 2. 舒客的帖子
  { 
    title: "舒仔闪亮到场🥳现场的朋友们举手让我看到！", 
    author: "舒客", 
    avatar: XHS_AVATAR_DEFAULT,
    likes: "3451", 
    liked: false,
    cover: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=500&auto=format&fit=crop", 
    type: "web_img", 
    h: 200,
    followType: "following"
  },
  // 3. 普通笔记 (本地视频)
  { 
    title: "表现不好的人能被喷成筛子", 
    author: "star侃球", 
    avatar: XHS_AVATAR_DEFAULT,
    likes: "98", 
    liked: false,
    cover: "linear-gradient(135deg, #84fab0, #8fd3f4)", 
    type: "local_video", 
    video: "./data/chat/1.mp4", 
    h: 280,
    followType: null 
  },
  // 4. 你的关注
  { 
    title: "令人心动的Offer程序员季", 
    author: "可不可以不工作", 
    avatar: XHS_AVATAR_DEFAULT,
    likes: "1278", 
    liked: false,
    cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500&auto=format&fit=crop", 
    type: "web_img", 
    h: 220,
    followType: "following"
  },
  // 5. 普通笔记
  { 
    title: "看看我在圣钓江湖赛签到活捉到了谁？！", 
    author: "大大Niko", 
    avatar: XHS_AVATAR_DEFAULT,
    likes: "7844", 
    liked: false,
    cover: "linear-gradient(135deg, #ffecd2, #fcb69f)", 
    type: "web_img", 
    h: 260,
    followType: null
  },
  // 6. 互相关注
  { 
    title: "奶丞？奶丞！", 
    author: "吉么", 
    avatar: XHS_AVATAR_DEFAULT,
    likes: "87", 
    liked: false,
    cover: "linear-gradient(135deg, #a8edea, #fed6e3)", 
    type: "web_img", 
    h: 210,
    followType: "mutual"
  }
];

function getFollowTagHTML(type) {
  if (!type) return '';
  const isMutual = type === 'mutual';
  const text = isMutual ? '互相关注' : '你的关注';
  const bgColor = isMutual ? '#5dc76d' : '#68c27d'; 
  const iconSVG = `<svg viewBox="0 0 24 24" width="12" height="12" style="background:${bgColor}; border-radius:50%; padding:2px; fill:#fff; display:inline-block; vertical-align:middle; margin-right:4px;"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>`;
  return `<div style="display:flex; align-items:center; font-size:11px; color:#666; margin-bottom:4px;">${iconSVG}${text}</div>`;
}

window.toggleLikeXhs = function(e, el, index) {
  e.stopPropagation();
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
    icon.animate([
      { transform: 'scale(1)' },
      { transform: 'scale(1.4)' },
      { transform: 'scale(1)' }
    ], { duration: 300, easing: 'cubic-bezier(.2,1.4,.4,1)' });
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
      onclickAction = `event.stopPropagation(); alert('这是占位笔记')`;
    }
  }

  const bgColor = note.cover.startsWith('linear') ? note.cover : '#f0f0f0';

  return `
    <!-- 卡片根容器加 transform 强制开启硬件加速，解决有些浏览器切不了视频圆角的问题 -->
    <div onclick="${onclickAction}" style="width:100%; box-sizing:border-box; background:#fff; border-radius:8px; overflow:hidden; cursor:pointer; border: 0.5px solid #f0f0f0; margin-bottom:6px; transform: translateZ(0);">
      
      <!-- 封面区域，强制切圆角 -->
      <div style="position:relative; width:100%; height:${note.h}px; background:${bgColor}; border-radius: 8px 8px 0 0; overflow:hidden;">
         ${mediaHTML}
      </div>

      <div style="padding:8px 10px 10px;">
        ${getFollowTagHTML(note.followType)}
        
        <!-- 标题，去掉了死高度，改成自然撑开，margin压小 -->
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
  return {
    html: `
    <!-- 顶部导航 -->
    <div style="position:absolute; top:44px; left:0; right:0; background:#fff; z-index:10; display:flex; flex-direction:column;">
      <div style="display:flex; justify-content:center; align-items:center; height:40px; gap:36px; font-size:15px; color:#666; padding-top:8px;">
        <span>关注</span>
        <span style="font-weight:600; color:#111; font-size:17px; position:relative;">发现<span style="position:absolute; bottom:-6px; left:50%; transform:translateX(-50%); width:20px; height:3px; background:#ff2442; border-radius:2px;"></span></span>
        <span>杭州</span>
      </div>
      
      <div style="display:flex; gap:20px; padding:8px 16px; overflow-x:auto; white-space:nowrap; font-size:13px; color:#666; border-bottom:0.5px solid #f0f0f0; scrollbar-width:none;">
        <span style="font-weight:600; color:#111;">推荐</span>
        <span>视频</span>
        <span>直播</span>
        <span>热点</span>
        <span>短剧</span>
        <span>明星</span>
      </div>
    </div>

    <!-- 👇 核心修复：把 padding-top 从 105px 提升到 135px，把位置彻底让给顶栏，防止遮挡卡片头 -->
    <div class="scroll" id="xhs-scroll" style="background:#f4f4f4; padding-top:135px; padding-bottom:90px;">
      <div style="display:flex; gap:6px; padding:8px; align-items:flex-start;">
        <div id="xhs-col-left" style="flex:1; min-width:0; display:flex; flex-direction:column;"></div>
        <div id="xhs-col-right" style="flex:1; min-width:0; display:flex; flex-direction:column;"></div>
      </div>
    </div>

    <!-- 底部 Tabbar -->
    <div class="tabbar" style="background:#fff; border-top:0.5px solid #eee; display:flex; padding-bottom:20px;">
      <button style="color:#111; display:flex; flex-direction:column; align-items:center; gap:4px; flex:1; border:none; background:none;">
        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M12 3 2 10v11h7v-7h6v7h7V10L12 3z"/></svg>
        <span style="font-size:10px; font-weight:500;">首页</span>
      </button>
      <button style="color:#111; display:flex; flex-direction:column; align-items:center; gap:4px; flex:1; border:none; background:none;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><rect x="2" y="6" width="20" height="12" rx="4"/><path d="m10 10 5 2-5 2v-4z" fill="currentColor"/></svg>
        <span style="font-size:10px; font-weight:500;">视频</span>
      </button>
      <div style="flex:1; display:flex; justify-content:center;">
        <button onclick="alert('发布功能开发中~')" style="width:52px; height:36px; border-radius:18px; background:#ff2442; color:#fff; display:flex; align-items:center; justify-content:center; border:none; transform:translateY(-8px); box-shadow:0 2px 6px rgba(255,36,66,0.3);">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
        </button>
      </div>
      <button style="color:#111; display:flex; flex-direction:column; align-items:center; gap:4px; flex:1; border:none; background:none;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
        <span style="font-size:10px; font-weight:500;">消息</span>
      </button>
      <button style="color:#111; display:flex; flex-direction:column; align-items:center; gap:4px; flex:1; border:none; background:none;">
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