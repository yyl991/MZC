// ==========================================
// 📱 微博模块 (app_weibo.js) - 最终稳定版
// ==========================================

// 1. 首页展示的生活流（包含你真人的转发）
const LIFE_WEIBO_DATA = [
  { 
    id: 1, 
    text: "小萌萌", 
    time: "10-16", 
    device: "来自 HarmonyOS设备", 
    images: ["./data/avatar/mzc.jpg", "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=400&auto=format&fit=crop", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop"], 
    likes: "118万", comments: "100万+", forwards: "100万+", read: "55", isRepost: true, originalAuthor: "与橡树至世界尽头", originalText: "🐼➡️😡➡️啊打"
  },
  { 
    id: 2, 
    text: "小猪宝宝🐷", 
    time: "10-16", 
    device: "来自 HarmonyOS设备", 
    images: ["https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop"], 
    likes: "42万", comments: "1.2万", forwards: "5千", read: "55", isRepost: true, originalAuthor: "TF_ING穆祉丞MUA", originalText: "#大哥小助理收官# 又想和哥哥们一起吃火锅了，谢谢哥哥们的照顾，必须批准！#大哥小助理#" }
];

// 2. 你的“我-微博(112)”列表
const DATA_WEIBO_DATA = [
  { id: 10, text: "小萌萌", time: "10-16", device: "来自 HarmonyOS设备", images: ["./data/avatar/mzc.jpg", "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=400&auto=format&fit=crop"], likes: "186万", comments: "5万", forwards: "100万+", read: "55", isRepost: true, originalAuthor: "与橡树至世界尽头", originalText: "🐼➡️😡➡️啊打" },
  { id: 9, text: "小猪宝宝🐷", time: "10-16", device: "来自 HarmonyOS设备", images: ["https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop"], likes: "186万", comments: "5万", forwards: "100万+", read: "55", isRepost: true, originalAuthor: "TF_ING穆祉丞MUA", originalText: "#大哥小助理收官# 又想和哥哥们一起吃火锅了，谢谢哥哥们的照顾，必须批准！#大哥小助理#" }
];

// 3. 艺人主页置顶数据（图2）
const ARTIST_PINNED_WEIBO = [
  { 
    id: 1, 
    isTop: true, 
    text: "大人是什么？\n\n曾经的我陷入过迷茫和绝望，有过不甘和愤怒，我几乎被这些负面情绪吞噬，让我一度怀疑我自己。然而，当时间流逝，我真正敢于直面它们之后我发现，它们对我来说，已经是“过去”了。\n美好的也好、痛苦的也罢，它们都构成了我热烈而勇敢的“未成年”时期，变成了一份记忆永远留在了我的回忆录里。\n\n大人的第一站，要从哪里开始呢？\n我思考了很久，最后决定：管他的呢！不纠结于过去，只管冲向属于我的未来。无论多少岁，我永远都是我自己！\n\n#穆祉丞18岁生日主题Eleutheria# #朝朝穆穆#", 
    time: "25-11-16", 
    device: "来自 微博视频号", 
    video: "./data/chat/1.mp4", 
    likes: "189万", comments: "100万+", forwards: "100万+", hot: "30000+" 
  },
  { 
    id: 2, 
    isTop: true, 
    text: "If you want me to be with you\n\n#朝朝穆穆#", 
    time: "昨天 17:20", 
    device: "来自 微博视频号", 
    video: "./data/chat/1.mp4", 
    likes: "202万", comments: "69.3万", forwards: "100万+", hot: "30000+" 
  }
];

// 4. 艺人新发动态（首页只显示这个）
const ARTIST_NEW_WEIBO = [
  { 
    id: 3, 
    text: "今天排练好累，但想到你们就不累了。#穆祉丞#", 
    time: "10-16", 
    device: "来自 iPhone客户端", 
    images: ["./data/avatar/mzc.jpg"], 
    likes: "50万", comments: "10万", forwards: "20万", hot: "12000+"
  }
];

// 5. 关注列表数据
const FOLLOW_DATA = [
  { name: "TF_ING穆祉丞MUA", isArtist: true, desc: "北京时代峰峻旗下音乐厂牌...", latest: "If you want me to be with you...", supertopic: "穆祉丞超话", status: "特别关注", avatar: "./data/avatar/mzc.jpg" },
  { name: "新浪娱乐", isArtist: false, desc: "新浪娱乐频道官方微博", latest: "【午间娱乐播报】#第二届...", supertopic: "新浪娱乐超话", status: "已关注", avatar: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=100&auto=format&fit=crop" },
  { name: "钟嘉诚ZZzzz", isArtist: false, desc: "《声鸣远扬2025》选手...", latest: "很荣幸收到@MAC魅可的邀...", supertopic: "", status: "已关注", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop" },
  { name: "我们共同呼吸局部...", isArtist: false, desc: "爱恩记<Ɛ>. < 3ω", latest: "救救#穆祉丞[超话]#井为...", supertopic: "", status: "已关注", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" }
];

// 6. 超话数据
const SUPERTopic_DATA = [
  { user: "我零食呢nn", isArtist: false, text: "#为穆祉丞守护星愿#\n“一百岁大家还会陪着我吗”", time: "刚刚 最后评论 已编辑", likes: "12", comments: "5", forwards: "1", images: ["https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop", "./data/avatar/mzc.jpg", "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=200&auto=format&fit=crop", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop", "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=200&auto=format&fit=crop", "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=200&auto=format&fit=crop"] }
];

const discoverIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/><circle cx="16" cy="8" r="5" fill="#ff3b30" stroke="none"/><text x="16" y="10" font-size="6" fill="#fff" text-anchor="middle" font-weight="bold">热</text></svg>`;

const getWBTabbar = (active) => `
  <div class="tabbar" style="position:absolute; bottom:0; left:0; right:0; z-index:20; background:#fff; border-top:0.5px solid #eee; display:flex; padding-bottom:20px;">
    <button onclick="show('weibo')" style="color:${active === 'home' ? '#111' : '#666'}; display:flex; flex-direction:column; align-items:center; gap:4px; flex:1; border:none; background:none;">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M12 3 2 10v11h7v-7h6v7h7V10L12 3z"/></svg>
      <span style="font-size:10px; font-weight:500;">首页</span>
    </button>
    <button onclick="toastDev()" style="color:#666; display:flex; flex-direction:column; align-items:center; gap:4px; flex:1; border:none; background:none; position:relative;">
      <div style="position:absolute; top:-2px; right:22px; background:#ff3b30; color:#fff; font-size:9px; padding:1px 4px; border-radius:8px; border:1px solid #fff;">1</div>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><rect x="2" y="6" width="20" height="12" rx="4"/><path d="m10 10 5 2-5 2v-4z" fill="currentColor"/></svg>
      <span style="font-size:10px; font-weight:500;">视频</span>
    </button>
    <button onclick="toastDev()" style="color:#666; display:flex; flex-direction:column; align-items:center; gap:4px; flex:1; border:none; background:none;">
      ${discoverIcon}
      <span style="font-size:10px; font-weight:500;">发现</span>
    </button>
    <button onclick="toastDev()" style="color:#666; display:flex; flex-direction:column; align-items:center; gap:4px; flex:1; border:none; background:none; position:relative;">
      <div style="position:absolute; top:-2px; right:22px; background:#ff3b30; color:#fff; font-size:9px; padding:1px 4px; border-radius:8px; border:1px solid #fff;">1</div>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
      <span style="font-size:10px; font-weight:500;">消息</span>
    </button>
    <button onclick="show('weibo_profile')" style="color:${active === 'me' ? '#111' : '#666'}; display:flex; flex-direction:column; align-items:center; gap:4px; flex:1; border:none; background:none;">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      <span style="font-size:10px; font-weight:500;">我</span>
    </button>
  </div>
`;

const WB_ACTION_BAR = (likes, comments, forwards) => `
  <div style="display:flex; justify-content:space-between; align-items:center; border-top:0.5px solid #f0f0f0; padding-top:12px; color:#666; font-size:13.5px; margin-top:12px;">
    <div style="display:flex; align-items:center; gap:4px; cursor:pointer;" onclick="toastDev()">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m15 5-7 7 7 7"/><path d="M20 12H8"/></svg> ${forwards}
    </div>
    <div style="display:flex; align-items:center; gap:4px; cursor:pointer;" onclick="toastDev()">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg> ${comments}
    </div>
    <div class="like-btn" style="display:flex; align-items:center; gap:4px; cursor:pointer;" onclick="toggleWbLike(this, '${likes}')">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg> 
      <span class="like-count">${likes}</span>
    </div>
  </div>
`;

const renderRepostCard = (w) => `
  <div style="background:#f7f7f7; border-radius:8px; padding:12px; margin-bottom:12px; cursor:pointer;" onclick="event.stopPropagation(); window._wbData={type:'pinned', id:2}; push('weibo_detail');">
    <div style="font-size:14px; line-height:1.5; color:#333; margin-bottom:8px;">
      <span style="color:#5c8bd6; font-weight:600;" onclick="event.stopPropagation(); push('weibo_artist')">@${w.originalAuthor}</span>：${esc(w.originalText)}
    </div>
    ${w.images && w.images.length > 0 ? `
      <div style="display:grid; grid-template-columns:repeat(${w.images.length === 1 ? 1 : w.images.length === 4 ? 2 : 3}, 1fr); gap:4px;">
        ${w.images.map((img, idx) => `
          <div style="aspect-ratio:1; border-radius:4px; overflow:hidden; background:#eee;">
            <img src="${img}" style="width:100%; height:100%; object-fit:cover;">
          </div>
        `).join('')}
      </div>
    ` : ''}
  </div>
`;

// 👇 极度安全的话题高亮，不会崩溃
function renderWeiboText(text) {
  if (!text) return '';
  let safeText = esc(text);
  // 匹配话题变蓝
  safeText = safeText.replace(/#([^#]+?)#/g, '<span style="color:#5c8bd6;">#$1#</span>');

  if (text.length > 120) {
    return `
      <div style="position:relative;">
        <div style="font-size:15px; color:#333; line-height:1.6; margin-bottom:12px; display:-webkit-box; -webkit-line-clamp:4; -webkit-box-orient:vertical; overflow:hidden; white-space:pre-wrap;">${safeText}</div>
        <div style="color:#5c8bd6; font-weight:500; font-size:15px; cursor:pointer; margin-bottom:12px;" onclick="event.stopPropagation(); this.previousElementSibling.style.webkitLineClamp='unset'; this.style.display='none';">全文</div>
      </div>
    `;
  }
  return `<div style="font-size:15px; color:#333; line-height:1.6; margin-bottom:12px; white-space:pre-wrap;">${safeText}</div>`;
}

window.toggleWbLike = function(el, initialLikes) {
  const icon = el.querySelector('svg');
  const count = el.querySelector('.like-count');
  if (el.classList.contains('liked')) {
    el.classList.remove('liked');
    el.style.color = '#666';
    icon.setAttribute('fill', 'none');
    icon.setAttribute('stroke', 'currentColor');
    count.textContent = initialLikes;
  } else {
    el.classList.add('liked');
    el.style.color = '#ff8200';
    icon.setAttribute('fill', '#ff8200');
    icon.setAttribute('stroke', '#ff8200');
    if (initialLikes.includes('万')) {
       let n = parseFloat(initialLikes) + 0.1;
       count.textContent = n.toFixed(1) + '万';
    } else {
       count.textContent = parseInt(initialLikes) + 1;
    }
    el.animate([{ transform: "scale(1)" }, { transform: "scale(1.3)" }, { transform: "scale(1)" }], { duration: 300, easing: "cubic-bezier(.2,1.4,.4,1)" });
    if(typeof vib === 'function') vib(10);
  }
};

// ==========================================
// 📱 页面 1：微博首页 (只显示新发动态)
// ==========================================
VIEWS.weibo = () => ({
  html: `
    <div style="position:absolute; top:0; left:0; right:0; z-index:10; background:#fff;">
      <div style="height:30px;"></div> 
      <div style="display:flex; align-items:center; justify-content:space-around; height:44px; padding:0 16px;">
        <div style="color:#666; font-size:18px; font-weight:bold; text-shadow:0 0 1px #ff8200, 0 0 1px #ff8200;">超话</div>
        <div style="color:#666; font-size:16px;">推荐</div>
        <div style="color:#111; font-size:17px; font-weight:700; position:relative;">特别关注<span style="position:absolute; bottom:-6px; left:0; right:0; height:3px; background:#ffc107; border-radius:2px;"></span></div>
        <div style="display:flex; gap:12px;">
          <div onclick="toastDev()" style="width:24px; height:24px; background:#ff5d5d; border-radius:4px; display:grid; place-items:center; color:#ffd700; font-size:16px;">🧧</div>
          <div onclick="toastDev()" style="width:24px; height:24px; background:#ff8200; border-radius:50%; display:grid; place-items:center; color:#fff; font-size:20px; font-weight:300; line-height:1;">+</div>
        </div>
      </div>
      <div onclick="toastDev()" style="display:flex; justify-content:space-between; align-items:center; padding:10px 16px; border-bottom:8px solid #f5f5f5; background:#fff;">
        <div style="display:flex; align-items:center; gap:6px; font-size:14px; color:#333;">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="#5c8bd6"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
          管理 特别关注
        </div>
        <div style="font-size:14px; color:#999;">1人</div>
      </div>
    </div>
    <div class="scroll" style="background:#f5f5f5; padding-top:120px; padding-bottom:80px;">
      ${ARTIST_NEW_WEIBO.map(w => `
        <div style="background:#fff; margin-bottom:10px; padding:16px;" onclick="window._wbData={type:'new',id:${w.id}}; push('weibo_detail');">
          <div style="display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:10px;">
            <div style="display:flex; align-items:center; gap:10px;">
              <div style="width:44px; height:44px; border-radius:50%; overflow:hidden; background:#eee; position:relative;">
                <img src="./data/avatar/mzc.jpg" style="width:100%; height:100%; object-fit:cover;">
                <div style="position:absolute; bottom:-2px; right:-2px; background:#ff8200; color:#fff; font-size:9px; width:14px; height:14px; border-radius:50%; display:grid; place-items:center; border:1px solid #fff;">V</div>
              </div>
              <div>
                <div style="font-size:16px; font-weight:600; color:#ff8200; display:flex; align-items:center; gap:4px;">TF_ING穆祉丞MUA <span style="font-size:14px;">👑</span></div>
                <div style="font-size:12px; color:#999;">${w.time} ${w.device}</div>
              </div>
            </div>
            <div style="color:#ccc; font-size:16px;">﹀</div>
          </div>
          ${renderWeiboText(w.text)}
          ${w.video ? `
            <div style="border-radius:8px; overflow:hidden; margin-bottom:12px; background:#000; position:relative; cursor:pointer;" onclick="event.stopPropagation();openMediaViewer(['${w.video}'], 0)">
              <video src="${w.video}" muted preload="metadata" style="width:100%; max-height:300px; display:block; object-fit:cover; pointer-events:none;"></video>
              <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:44px; height:44px; background:rgba(0,0,0,0.5); border-radius:50%; display:grid; place-items:center; color:#fff; font-size:20px; padding-left:4px;">▶</div>
            </div>
          ` : ''}
          ${w.images && w.images.length > 0 ? `
            <div style="display:grid; grid-template-columns:repeat(${w.images.length === 1 ? 1 : w.images.length === 4 ? 2 : 3}, 1fr); gap:4px; margin-bottom:12px;">
              ${w.images.map((img, idx) => `
                <div style="aspect-ratio:1; border-radius:4px; overflow:hidden; background:#eee;" onclick="event.stopPropagation();openMediaViewer(${JSON.stringify(w.images).replace(/"/g, '&quot;')}, ${idx})">
                  <img src="${img}" style="width:100%; height:100%; object-fit:cover;">
                </div>
              `).join('')}
            </div>
          ` : ''}
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
             <span style="background:#fff0eb; color:#ff3b30; font-size:11px; padding:3px 8px; border-radius:12px; border:0.5px solid #ff3b30;">🔥 爆文 热文指数${w.hot}</span>
             <span style="font-size:12px; color:#999;">70人 😆😆😆</span>
          </div>
          <div style="display:flex; gap:10px; align-items:center; background:#f5f5f5; border-radius:20px; padding:8px 12px; margin-bottom:12px;">
            <img src="${CFG.myAvatar || 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=100&auto=format&fit=crop'}" style="width:24px; height:24px; border-radius:50%;">
            <span style="font-size:14px; color:#999;">发条评论说说你的看法吧</span>
          </div>
          ${WB_ACTION_BAR(w.likes, w.comments, w.forwards)}
        </div>
      `).join('')}
    </div>
    ${getWBTabbar('home')}`
});

// ==========================================
// 📱 页面 2：我的个人主页 (图1，去掉顶栏)
// ==========================================
VIEWS.weibo_profile = () => ({
  html: `
       <div class="scroll" style="background:#f5f5f5; padding-top:54px; padding-bottom:80px;">
       <div style="background:#fff; padding:16px;">
         <div style="display:flex; gap:16px;">
           <div style="width:80px; height:80px; border-radius:50%; background:#eee; overflow:hidden; border:1px solid #eee;">
             <img src="${CFG.myAvatar || 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=100&auto=format&fit=crop'}" style="width:100%; height:100%; object-fit:cover;">
           </div>
           <div style="flex:1;">
             <div style="font-size:20px; font-weight:700; color:#111; display:flex; align-items:center; gap:6px;">小狗团汪汪 <span style="background:linear-gradient(90deg,#ffd700,#ff8c00); color:#fff; font-size:10px; font-weight:800; padding:1px 6px; border-radius:10px; transform:scale(0.9);">🧧 抢红包</span></div>
             <div style="font-size:13px; color:#666; margin-top:6px;">简介：已有主人，勿扰</div>
             <div onclick="toastDev()" style="display:inline-flex; align-items:center; gap:4px; background:#eaf7ea; color:#5cb85c; border-radius:12px; padding:2px 10px; font-size:12px; margin-top:8px;">在线 ></div>
           </div>
         </div>
       </div>
       <div style="background:#fff; padding:0 16px 16px;">
          <div onclick="toastDev()" style="background:linear-gradient(90deg, #fdf3f3, #fce4e4); border-radius:12px; padding:12px 16px; display:flex; justify-content:space-between; align-items:center; border:1px solid #f0e0e0; position:relative; overflow:hidden;">
             <div style="position:absolute; right:40px; top:0; height:100%; width:100px; background:url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop') center/cover; opacity:0.2; mask-image:linear-gradient(to right, transparent, black); -webkit-mask-image:linear-gradient(to right, transparent, black);"></div>
             <div style="color:#b25e5e; font-size:14px; font-weight:600; z-index:2;">👑 新户专享价<br><span style="font-size:11px; font-weight:400;">点亮皇冠送会员时长 ></span></div>
             <div style="background:#fff; color:#b25e5e; font-size:12px; font-weight:600; padding:6px 14px; border-radius:14px; box-shadow:0 2px 4px rgba(0,0,0,0.05); z-index:2;">去看看</div>
          </div>
       </div>
       <div style="background:#fff; display:flex; justify-content:space-between; padding:16px 24px; border-bottom:8px solid #f5f5f5;">
          <div style="text-align:center; cursor:pointer;" onclick="push('weibo_my_posts')"><div style="font-size:18px; font-weight:700; color:#111;">112</div><div style="font-size:13px; color:#999;">微博</div></div>
          <div style="text-align:center; cursor:pointer;" onclick="push('weibo_follows')"><div style="font-size:18px; font-weight:700; color:#111;">1</div><div style="font-size:13px; color:#999;">关注</div></div>
          <div style="text-align:center;" onclick="toastDev()"><div style="font-size:18px; font-weight:700; color:#111;">8</div><div style="font-size:13px; color:#999;">粉丝</div></div>
          <div style="text-align:center;" onclick="toastDev()"><div style="font-size:18px; font-weight:700; color:#111;">36</div><div style="font-size:13px; color:#999;">访客</div></div>
       </div>
       <div style="background:#fff; margin:10px 12px; border-radius:12px; padding:16px;">
         <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:16px 0; text-align:center; font-size:12px; color:#333;">
           <div onclick="toastDev()"><div style="font-size:28px; margin-bottom:6px;">🖼️</div>我的相册</div>
           <div onclick="toastDev()"><div style="font-size:28px; margin-bottom:6px;">⭐</div>赞/收藏</div>
           <div onclick="toastDev()"><div style="font-size:28px; margin-bottom:6px;">🕒</div>浏览记录</div>
           <div onclick="toastDev()"><div style="font-size:28px; margin-bottom:6px;">📝</div>草稿箱</div>
           <div onclick="toastDev()" style="position:relative;"><div style="font-size:28px; margin-bottom:6px;">👛</div>我的钱包<div style="position:absolute; top:-2px; right:8px; width:6px; height:6px; background:#ff3b30; border-radius:50%;"></div></div>
           <div onclick="toastDev()"><div style="font-size:28px; margin-bottom:6px;">🛍️</div>微博购订单</div>
           <div onclick="toastDev()"><div style="font-size:28px; margin-bottom:6px;">💡</div>创作中心</div>
           <div onclick="toastDev()"><div style="font-size:28px; margin-bottom:6px;">📅</div>粉丝头条</div>
         </div>
       </div>
       <div style="background:#fff; margin:10px 12px; border-radius:12px; padding:16px;">
         <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
           <div onclick="toastDev()" style="display:flex; align-items:center; justify-content:space-between;">
             <div><div style="font-size:15px; font-weight:700; color:#111;">任务中心</div><div style="font-size:12px; color:#c26a32; margin-top:4px;">今日待领670积分</div></div>
             <div style="font-size:24px;">🧧</div>
           </div>
           <div onclick="toastDev()" style="display:flex; align-items:center; justify-content:space-between;">
             <div><div style="font-size:15px; font-weight:700; color:#111;">🍁 金秋答题赛</div><div style="font-size:12px; color:#c26a32; margin-top:4px;">参与瓜分十万现金</div></div>
             <div style="font-size:24px;">💰</div>
           </div>
           <div onclick="toastDev()" style="display:flex; align-items:center; justify-content:space-between; border-top:0.5px solid #eee; padding-top:12px;">
             <div><div style="font-size:15px; font-weight:700; color:#111;">每日签到</div><div style="font-size:12px; color:#c26a32; margin-top:4px;">点击领10积分</div></div>
             <div style="background:#ff8200; color:#fff; font-size:12px; padding:4px 12px; border-radius:12px;">签到</div>
           </div>
           <div onclick="toastDev()" style="display:flex; align-items:center; justify-content:space-between; border-top:0.5px solid #eee; padding-top:12px;">
             <div><div style="font-size:15px; font-weight:700; color:#111;">🍔 环球美食嘉年华</div><div style="font-size:12px; color:#c26a32; margin-top:4px;">答题瓜分十万奖池</div></div>
             <div style="font-size:24px;">🎁</div>
           </div>
         </div>
       </div>
       <div style="background:#fff; margin:10px 12px; border-radius:12px; padding:16px;">
         <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;"><div style="font-size:16px; font-weight:700; color:#111;">我的钱包</div><div onclick="toastDev()" style="font-size:13px; color:#999;">查看详情 ></div></div>
         <div style="display:flex; justify-content:space-between; text-align:center;">
           <div onclick="toastDev()" style="position:relative;"><div style="font-size:16px; font-weight:700; color:#111;">1.22万</div><div style="font-size:12px; color:#999; margin-top:4px;">可借额度</div><div style="position:absolute; top:-4px; left:0; width:6px; height:6px; background:#ff3b30; border-radius:50%;"></div></div>
           <div onclick="toastDev()"><div style="font-size:16px; font-weight:700; color:#111;">租·手机</div><div style="font-size:12px; color:#999; margin-top:4px;">抢iphone18</div></div>
           <div onclick="toastDev()"><div style="font-size:16px; font-weight:700; color:#111;">✨5888✨</div><div style="font-size:12px; color:#999; margin-top:4px;">应急额度</div></div>
           <div onclick="toastDev()"><div style="font-size:16px; font-weight:700; color:#111;">钱包</div><div style="font-size:12px; color:#999; margin-top:4px;">金融资产</div></div>
         </div>
       </div>
       <div style="background:#fff; margin:10px 12px; border-radius:12px; padding:16px; padding-bottom:8px;">
         <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;"><div style="font-size:16px; font-weight:700; color:#111;">我的经常访问</div><div onclick="toastDev()" style="font-size:13px; color:#999;">有更新 ></div></div>
         <div style="display:flex; gap:16px; overflow-x:auto; scrollbar-width:none; padding-bottom:8px;">
           <div style="display:flex; flex-direction:column; align-items:center; gap:6px; flex:none;" onclick="toastDev()">
             <div style="width:56px; height:56px; border-radius:50%; overflow:hidden; border:1px solid #eee; position:relative;"><img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=100&auto=format&fit=crop" style="width:100%; height:100%; object-fit:cover;"><div style="position:absolute; bottom:0; right:0; background:#ff8200; color:#fff; font-size:9px; width:14px; height:14px; border-radius:50%; display:grid; place-items:center; border:1px solid #fff;">V</div></div>
             <span style="font-size:12px; color:#333;">内八小...</span>
             <span style="font-size:10px; color:#999;">访问1次</span>
           </div>
           <div style="display:flex; flex-direction:column; align-items:center; gap:6px; flex:none;" onclick="push('weibo_artist')">
             <div style="width:56px; height:56px; border-radius:50%; overflow:hidden; border:1px solid #eee; position:relative;"><img src="./data/avatar/mzc.jpg" style="width:100%; height:100%; object-fit:cover;"><div style="position:absolute; bottom:0; right:0; background:#ff8200; color:#fff; font-size:9px; width:14px; height:14px; border-radius:50%; display:grid; place-items:center; border:1px solid #fff;">V</div></div>
             <span style="font-size:12px; color:#333;">TF_ING穆...</span>
             <span style="font-size:10px; color:#999;">访问1次</span>
           </div>
         </div>
         <div onclick="toastDev()" style="display:flex; justify-content:space-between; align-items:center; border-top:0.5px solid #f0f0f0; padding-top:12px; margin-top:4px;">
            <span style="font-size:12px; color:#666;">添加桌面组件，随时关注博主动态</span>
            <span style="font-size:12px; color:#ff8200; font-weight:600;">去添加 ></span>
         </div>
       </div>
       <div style="background:#fff; margin:10px 12px 20px; border-radius:12px; padding:16px;">
         <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;"><div style="font-size:16px; font-weight:700; color:#111;">超话社区</div><div onclick="toastDev()" style="font-size:13px; color:#999;">立即签到 ></div></div>
         <div style="display:flex; gap:12px; overflow-x:auto; scrollbar-width:none;">
           <div style="flex:none; width:76px; text-align:center;" onclick="push('weibo_supertopic')">
             <div style="width:76px; height:76px; border-radius:8px; overflow:hidden; background:#f5f5f5; position:relative;">
               <img src="./data/avatar/mzc.jpg" style="width:100%; height:100%; object-fit:cover;">
               <div style="position:absolute; bottom:0; left:0; right:0; background:rgba(255,130,0,0.8); color:#fff; font-size:10px; text-align:center; padding:2px 0;">待签</div>
             </div>
             <div style="font-size:13px; font-weight:600; color:#333; margin-top:6px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">穆祉丞</div>
             <div style="font-size:10px; color:#999;">日新帖10.1万</div>
           </div>
           <div style="flex:none; width:76px; text-align:center;" onclick="toastDev()">
             <div style="width:76px; height:76px; border-radius:8px; overflow:hidden; background:#f5f5f5; position:relative;">
               <img src="https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=200&auto=format&fit=crop" style="width:100%; height:100%; object-fit:cover;">
               <div style="position:absolute; bottom:0; left:0; right:0; background:rgba(255,130,0,0.8); color:#fff; font-size:10px; text-align:center; padding:2px 0;">待签</div>
             </div>
             <div style="font-size:13px; font-weight:600; color:#333; margin-top:6px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">童禹坤周...</div>
             <div style="font-size:10px; color:#999;">日新帖82</div>
           </div>
           <div style="flex:none; width:76px; text-align:center;" onclick="toastDev()">
             <div style="width:76px; height:76px; border-radius:8px; overflow:hidden; background:#f5f5f5; position:relative;">
               <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" style="width:100%; height:100%; object-fit:cover;">
               <div style="position:absolute; bottom:0; left:0; right:0; background:rgba(90,200,250,0.8); color:#fff; font-size:10px; text-align:center; padding:2px 0;">推荐</div>
             </div>
             <div style="font-size:13px; font-weight:600; color:#333; margin-top:6px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">肖战</div>
             <div style="font-size:10px; color:#999;">当前热门</div>
           </div>
         </div>
       </div>
    </div>
    ${getWBTabbar('me')}`
});

// ==========================================
// 📱 页面 3：我的关注
// ==========================================
VIEWS.weibo_follows = () => ({
  html: navHTML({ title: "关注", back: "返回", backFn: "back()", right: `<span onclick="toastDev()" style="color:#111; font-size:15px;">发现用户</span>` }) +
    `<div class="scroll" style="background:#f5f5f5; padding-top:88px; padding-bottom:20px;">
      <div style="display:flex; justify-content:space-around; background:#fff; padding:12px 0; border-bottom:0.5px solid #eee; font-size:15px; color:#666;">
        <span style="font-weight:700; color:#111; position:relative;">关注的人<span style="position:absolute; bottom:-12px; left:50%; transform:translateX(-50%); width:20px; height:3px; background:#ffc107; border-radius:2px;"></span></span>
        <span onclick="toastDev()">经常访问</span>
        <span onclick="toastDev()">推荐</span>
        <span onclick="toastDev()">超话</span>
      </div>
      <div style="background:#fff; padding:10px 16px; border-bottom:0.5px solid #eee;">
        <div onclick="toastDev()" class="srch" style="margin:0; background:#f5f5f5; height:36px; border-radius:18px;">${G.search}搜全部关注</div>
      </div>
      <div style="background:#fff; display:flex; justify-content:space-between; padding:16px; border-bottom:8px solid #f5f5f5;">
        <div style="text-align:center; font-size:12px; color:#333;" onclick="toastDev()"><div style="font-size:24px; color:#ff3b30; margin-bottom:6px;">★</div>特别关注</div>
        <div style="text-align:center; font-size:12px; color:#333;" onclick="toastDev()"><div style="font-size:24px; color:#5ac8fa; margin-bottom:6px;">👤</div>是TA的铁粉</div>
        <div style="text-align:center; font-size:12px; color:#333;" onclick="toastDev()"><div style="font-size:24px; color:#ffc107; margin-bottom:6px;">👥</div>关注分组</div>
        <div style="text-align:center; font-size:12px; color:#333;" onclick="toastDev()"><div style="font-size:24px; color:#af52de; margin-bottom:6px;">💜</div>兴趣主页</div>
      </div>
      ${FOLLOW_DATA.map(u => `
        <div style="background:#fff; padding:16px; display:flex; gap:12px; border-bottom:0.5px solid #eee; cursor:pointer;" onclick="if(${u.isArtist}) push('weibo_artist'); else toastDev();">
          <div style="width:50px; height:50px; border-radius:50%; overflow:hidden; flex:none; position:relative;">
            <img src="${u.avatar}" style="width:100%; height:100%; object-fit:cover;">
            ${u.isArtist ? `<div style="position:absolute; bottom:0; right:0; background:#ff8200; color:#fff; font-size:9px; width:14px; height:14px; border-radius:50%; display:grid; place-items:center; border:1px solid #fff;">V</div>` : ''}
          </div>
          <div style="flex:1; min-width:0;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:15px; font-weight:600; color:${u.isArtist ? '#ff8200' : '#333'};">${u.name} ${u.isArtist ? '👑' : ''}</span>
              <div style="border:1px solid #ccc; border-radius:14px; padding:2px 10px; font-size:12px; color:#666; display:flex; align-items:center; gap:2px;">
                ${u.status === '特别关注' ? '☆' : '✓'} ${u.status}
              </div>
            </div>
            <div style="font-size:13px; color:#666; margin-top:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${u.desc}</div>
            <div style="font-size:13px; color:#999; margin-top:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${u.latest}</div>
            ${u.supertopic ? `
              <div style="background:#f5f5f5; border-radius:6px; padding:6px 10px; margin-top:8px; display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:12px; color:#ff8200;">💎 ${u.supertopic}</span>
                <span style="font-size:12px; color:#ff8200;">去超话 ></span>
              </div>
            ` : ''}
          </div>
        </div>
      `).join('')}
    </div>`
});

// ==========================================
// 📱 页面 4：我-微博列表
// ==========================================
VIEWS.weibo_my_posts = () => ({
  html: navHTML({ title: "微博", back: "返回", backFn: "back()", right: `<span onclick="toastDev()" style="cursor:pointer">${G.gear}</span>` }) +
    `<div class="scroll" style="background:#f5f5f5; padding-top:88px; padding-bottom:20px;">
      <div style="display:flex; overflow-x:auto; white-space:nowrap; font-size:15px; color:#666; border-bottom:0.5px solid #eee; background:#fff; scrollbar-width:none;">
        <div style="padding:12px 16px; font-weight:700; color:#111; position:relative;">全部<span style="position:absolute; bottom:0; left:50%; transform:translateX(-50%); width:24px; height:3px; background:#ff8200; border-radius:2px;"></span></div>
        <div style="padding:12px 16px;" onclick="toastDev()">超话帖</div>
        <div style="padding:12px 16px;" onclick="toastDev()">原创</div>
        <div style="padding:12px 16px;" onclick="toastDev()">视频</div>
        <div style="padding:12px 16px;" onclick="toastDev()">文章</div>
        <div style="padding:12px 16px;" onclick="toastDev()">图片</div>
      </div>
      <div style="background:#fff; padding:10px 16px;">
        <div onclick="toastDev()" class="srch" style="margin:0; background:#f5f5f5; height:36px; border-radius:18px;">${G.search}搜我的微博</div>
      </div>
      <div style="background:#fff; padding:0 16px 16px; margin-bottom:10px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <span style="font-size:14px; color:#999;">合集 ⓘ</span>
          <span onclick="toastDev()" style="font-size:13px; color:#5c8bd6;">➕ 创建</span>
        </div>
        <div style="display:flex; gap:10px;">
          <div onclick="toastDev()" style="flex:1; background:linear-gradient(135deg, #f0f4ff, #fdf2ff); border-radius:8px; padding:12px; position:relative; overflow:hidden;">
            <div style="font-size:13px; font-weight:600; color:#333; margin-bottom:4px;">☁️ 为你推荐</div>
            <div style="font-size:12px; color:#666; line-height:1.4; margin-bottom:12px; width:80%;">根据你的近期常用话题词为你推荐专属合集</div>
            <div style="display:inline-block; border:1px solid #ff8200; color:#ff8200; font-size:11px; padding:2px 10px; border-radius:12px; font-weight:600;">创建合集</div>
            <div style="position:absolute; right:-10px; bottom:-10px; font-size:50px; opacity:0.2;">🎈</div>
          </div>
          <div onclick="toastDev()" style="flex:1; background:#eee; border-radius:8px; position:relative; overflow:hidden;">
            <img src="https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=400&auto=format&fit=crop" style="width:100%; height:100%; object-fit:cover;">
            <div style="position:absolute; top:8px; left:8px; background:rgba(0,0,0,0.5); color:#fff; font-size:11px; padding:2px 8px; border-radius:4px;">☁️ 近期热门</div>
          </div>
        </div>
      </div>
      <div style="background:#f5f5f5; padding:10px 16px; display:flex; justify-content:space-between; align-items:center; font-size:13px; color:#666;">
        <span>全部微博(112)</span>
        <span onclick="toastDev()">☰ 筛选</span>
      </div>
      ${DATA_WEIBO_DATA.map(w => `
        <div style="background:#fff; margin-bottom:10px; padding:16px;" onclick="window._wbData={type:'my',id:${w.id}}; push('weibo_detail');">
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:10px; color:#666; font-size:12px;">
             <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 11V7a2 2 0 0 1 2-2h10l4 4v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4"/><path d="m4 11 4-4"/></svg> 公开
          </div>
          <div style="display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:10px;">
            <div style="display:flex; align-items:center; gap:10px;">
              <div style="width:44px; height:44px; border-radius:50%; overflow:hidden; background:#eee;">
                 <img src="${CFG.myAvatar || 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=100&auto=format&fit=crop'}" style="width:100%; height:100%; object-fit:cover;">
              </div>
              <div>
                <div style="font-size:16px; font-weight:600; color:#333;">小狗团汪汪</div>
                <div style="font-size:12px; color:#999;">${w.time} ${w.device}</div>
              </div>
            </div>
            <div style="position:relative; border:1px solid #eee; border-radius:12px 0 12px 12px; padding:4px 8px; font-size:10px; color:#999; text-align:center;">
              <div style="position:absolute; top:-1px; right:-1px; background:#5ac8fa; color:#fff; font-size:9px; padding:1px 4px; border-radius:0 12px 0 6px; transform:translateY(-100%);">推广</div>
              ${w.read}<br>阅读
            </div>
          </div>
          ${renderWeiboText(w.text)}
          ${w.isRepost ? renderRepostCard(w) : ''}
          ${WB_ACTION_BAR(w.likes, w.comments, w.forwards)}
        </div>
      `).join('')}
    </div>`
});

// ==========================================
// 📱 页面 5：艺人主页
// ==========================================
VIEWS.weibo_artist = () => ({
  html: navHTML({ title: "TF_ING穆祉丞MUA", back: "返回", backFn: "back()", right: `<span onclick="toastDev()" style="cursor:pointer">${G.search}</span><span onclick="toastDev()" style="cursor:pointer; margin-left:16px;">${G.dotsH}</span>` }) +
    `<div class="scroll" style="background:#f5f5f5; padding-bottom:20px; padding-top:0;">
       <div style="position:relative; height:180px; background:url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop') center/cover; margin-top:-98px;">
         <div style="position:absolute; top:98px; width:100%; text-align:center; color:#fff; font-size:13px; text-shadow:0 1px 3px rgba(0,0,0,0.5); padding-top:44px;">访问量 71万+</div>
         <div style="position:absolute; bottom:-30px; left:16px; width:80px; height:80px; border-radius:50%; border:3px solid #fff; overflow:hidden; background:#fff;">
            <img src="./data/avatar/mzc.jpg" style="width:100%; height:100%; object-fit:cover;">
         </div>
       </div>
       <div style="background:#fff; padding:42px 16px 16px;">
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="font-size:20px; font-weight:700; color:#111;">TF_ING穆祉丞MUA</span>
            <span style="color:#5ac8fa; font-size:14px;">♂</span>
            <span style="background:linear-gradient(90deg,#ffd700,#ff8c00); color:#fff; font-size:10px; font-weight:800; padding:2px 6px; border-radius:4px;">👑 SVIP8</span>
          </div>
          <div style="display:flex; gap:16px; margin-top:12px; font-size:13px; color:#666;">
            <span><b style="font-size:16px; color:#111;">544.2万</b> 粉丝</span>
            <span><b style="font-size:16px; color:#111;">68</b> 关注</span>
            <span><b style="font-size:16px; color:#111;">19.14亿</b> 转评赞</span>
          </div>
          <div style="display:flex; gap:10px; margin-top:16px;">
            <div onclick="push('weibo_supertopic')" style="flex:1; background:#f8f8f8; border-radius:8px; padding:10px; display:flex; align-items:center; gap:10px;">
              <div style="width:36px; height:36px; border-radius:4px; background:linear-gradient(135deg,#ffd700,#ff8c00); display:grid; place-items:center; color:#fff; font-size:18px;">💎</div>
              <div>
                <div style="font-size:14px; font-weight:700; color:#111;">超话</div>
                <div style="font-size:11px; color:#999; margin-top:2px;">194万小纸团</div>
              </div>
            </div>
            <div onclick="toastDev()" style="flex:1; background:#f8f8f8; border-radius:8px; padding:10px; display:flex; align-items:center; gap:10px;">
              <div style="width:36px; height:36px; border-radius:4px; background:#ff8200; display:grid; place-items:center; color:#fff; font-size:18px;">📺</div>
              <div>
                <div style="font-size:14px; font-weight:700; color:#111;">直播</div>
                <div style="font-size:11px; color:#999; margin-top:2px;">查看精彩回放</div>
              </div>
            </div>
          </div>
       </div>
       <div style="background:#fff; display:flex; padding:12px 16px; border-bottom:0.5px solid #eee; gap:24px; font-size:15px; color:#666;">
         <span>动态</span>
         <span style="font-weight:700; color:#111; position:relative;">微博<span style="position:absolute; bottom:-12px; left:50%; transform:translateX(-50%); width:20px; height:3px; background:#ff8200; border-radius:2px;"></span></span>
         <span>视频</span>
         <span>超话</span>
         <span>音频</span>
       </div>
       <div style="padding:10px 0;">
         ${ARTIST_PINNED_WEIBO.map(w => `
          <div style="background:#fff; margin-bottom:10px; padding:16px;" onclick="window._wbData={type:'pinned',id:${w.id}}; push('weibo_detail');">
            <div style="color:#ff8200; font-size:12px; font-weight:600; margin-bottom:8px;">👑 置顶</div>
            <div style="display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:10px;">
              <div style="display:flex; align-items:center; gap:10px;">
                <div style="width:44px; height:44px; border-radius:50%; overflow:hidden; background:#eee;">
                  <img src="./data/avatar/mzc.jpg" style="width:100%; height:100%; object-fit:cover;">
                </div>
                <div>
                  <div style="font-size:15px; font-weight:700; color:#ff8200; display:flex; align-items:center; gap:4px;">TF_ING穆祉丞MUA <span style="background:#ffd700; color:#fff; font-size:9px; padding:1px 4px; border-radius:4px;">V</span></div>
                  <div style="font-size:12px; color:#999;">${w.time} ${w.device}</div>
                </div>
              </div>
            </div>
            ${renderWeiboText(w.text)}
            ${w.video ? `
              <div style="border-radius:8px; overflow:hidden; margin-bottom:12px; background:#000; position:relative; cursor:pointer;" onclick="event.stopPropagation();openMediaViewer(['${w.video}'], 0)">
                <video src="${w.video}" muted preload="metadata" style="width:100%; max-height:300px; display:block; object-fit:cover; pointer-events:none;"></video>
                <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:44px; height:44px; background:rgba(0,0,0,0.5); border-radius:50%; display:grid; place-items:center; color:#fff; font-size:20px; padding-left:4px;">▶</div>
              </div>
            ` : ''}
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
               <span style="background:#fff0eb; color:#ff3b30; font-size:11px; padding:3px 8px; border-radius:12px; border:0.5px solid #ff3b30;">🔥 爆文 热文指数${w.hot}</span>
               <span style="font-size:12px; color:#999;">1031人 😆😆😆</span>
            </div>
            ${WB_ACTION_BAR(w.likes, w.comments, w.forwards)}
          </div>
        `).join('')}
         ${ARTIST_NEW_WEIBO.map(w => `
          <div style="background:#fff; margin-bottom:10px; padding:16px;" onclick="window._wbData={type:'new',id:${w.id}}; push('weibo_detail');">
            <div style="display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:10px;">
              <div style="display:flex; align-items:center; gap:10px;">
                <div style="width:44px; height:44px; border-radius:50%; overflow:hidden; background:#eee;">
                  <img src="./data/avatar/mzc.jpg" style="width:100%; height:100%; object-fit:cover;">
                </div>
                <div>
                  <div style="font-size:15px; font-weight:700; color:#ff8200; display:flex; align-items:center; gap:4px;">TF_ING穆祉丞MUA <span style="background:#ffd700; color:#fff; font-size:9px; padding:1px 4px; border-radius:4px;">V</span></div>
                  <div style="font-size:12px; color:#999;">${w.time} ${w.device}</div>
                </div>
              </div>
            </div>
            ${renderWeiboText(w.text)}
            ${w.video ? `
              <div style="border-radius:8px; overflow:hidden; margin-bottom:12px; background:#000; position:relative; cursor:pointer;" onclick="event.stopPropagation();openMediaViewer(['${w.video}'], 0)">
                <video src="${w.video}" muted preload="metadata" style="width:100%; max-height:300px; display:block; object-fit:cover; pointer-events:none;"></video>
                <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:44px; height:44px; background:rgba(0,0,0,0.5); border-radius:50%; display:grid; place-items:center; color:#fff; font-size:20px; padding-left:4px;">▶</div>
              </div>
            ` : ''}
            ${w.images && w.images.length > 0 ? `
              <div style="display:grid; grid-template-columns:repeat(${w.images.length === 1 ? 1 : w.images.length === 4 ? 2 : 3}, 1fr); gap:4px; margin-bottom:12px;">
                ${w.images.map((img, idx) => `
                  <div style="aspect-ratio:1; border-radius:4px; overflow:hidden; background:#eee;" onclick="event.stopPropagation();openMediaViewer(${JSON.stringify(w.images).replace(/"/g, '&quot;')}, ${idx})">
                    <img src="${img}" style="width:100%; height:100%; object-fit:cover;">
                  </div>
                `).join('')}
              </div>
            ` : ''}
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
               <span style="background:#fff0eb; color:#ff3b30; font-size:11px; padding:3px 8px; border-radius:12px; border:0.5px solid #ff3b30;">🔥 爆文 热文指数${w.hot}</span>
               <span style="font-size:12px; color:#999;">1031人 😆😆😆</span>
            </div>
            ${WB_ACTION_BAR(w.likes, w.comments, w.forwards)}
          </div>
        `).join('')}
       </div>
    </div>`
});

// ==========================================
// 📱 页面 6：超话页
// ==========================================
VIEWS.weibo_supertopic = () => ({
  html: `<div style="position:absolute; inset:0; background:#f5f5f5;">
    <div class="scroll" style="padding-bottom:80px; padding-top:0;">
       <div style="background:linear-gradient(180deg,#a8847b 0%, #b4978e 100%); padding:54px 16px 20px; position:relative; color:#fff;">
          <div style="display:flex; justify-content:space-between; font-size:22px;">
             <span onclick="back()" style="cursor:pointer;">‹</span>
             <div style="display:flex; gap:16px;"><span onclick="toastDev()">🔍</span><span onclick="toastDev()">↗️</span></div>
          </div>
          <div style="display:flex; gap:12px; margin-top:16px;">
             <div style="width:60px; height:60px; border-radius:8px; background:#fff; overflow:hidden;"><img src="./data/avatar/mzc.jpg" style="width:100%; height:100%; object-fit:cover;"></div>
             <div>
                <div style="font-size:20px; font-weight:700; display:flex; align-items:center; gap:4px;">穆祉丞 <span style="background:#e9d5ff; color:#8b5cf6; font-size:10px; padding:1px 4px; border-radius:4px;">💎 钻超</span></div>
                <div style="font-size:12px; opacity:0.9; margin-top:4px;">5561万 帖子 | 194万 小纸团 ></div>
             </div>
          </div>
          <div style="display:flex; gap:8px; margin-top:12px;">
             <span style="background:rgba(255,255,255,0.2); border:0.5px solid rgba(255,255,255,0.5); padding:4px 10px; border-radius:12px; font-size:12px;">明星超话</span>
             <span style="background:rgba(255,255,255,0.2); border:0.5px solid rgba(255,255,255,0.5); padding:4px 10px; border-radius:12px; font-size:12px;">今日签到 9.8万人</span>
          </div>
          <div onclick="toastDev()" style="position:absolute; bottom:20px; right:16px; background:#fff; color:#333; border-radius:50%; padding:4px; font-size:12px; font-weight:600; display:flex; flex-direction:column; align-items:center; justify-content:center; width:56px; height:56px;">
            <span>📅</span>
            <span style="font-size:10px;">连签1天</span>
          </div>
       </div>
       <div style="background:#fff; margin:10px; border-radius:12px; padding:12px; display:flex; flex-direction:column; gap:10px;">
          <div style="display:flex; justify-content:space-between; align-items:center; font-size:14px; font-weight:700; color:#333;">
            <span>饭制穿搭大赛</span>
            <span style="font-size:12px; color:#999; font-weight:400;" onclick="toastDev()">更多活动 ></span>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; background:#fdfbfb; border-radius:8px; padding:8px;">
             <div style="display:flex; gap:10px; align-items:center;">
                <div style="width:44px; height:44px; background:#ffd700; border-radius:8px; display:grid; place-items:center; font-size:24px;">🎸</div>
                <div>
                  <div style="font-size:14px; font-weight:700; color:#333;">小纸团的追星穿搭展</div>
                  <div style="font-size:11px; color:#999;">参与解锁饭制皮肤定制权</div>
                </div>
             </div>
             <div onclick="toastDev()" style="background:#fff; border:1px solid #ccc; border-radius:16px; padding:6px 14px; font-size:12px; color:#333; font-weight:600;">去加热</div>
          </div>
          <div style="font-size:12px; color:#666;">💧 @不让萌评选了作品，小纸团展厅热力值提升到2737</div>
          <div style="text-align:center; font-size:12px; color:#999; border-top:0.5px solid #eee; padding-top:8px;" onclick="toastDev()">展开查看更多 ∨</div>
       </div>
       <div style="background:#fff; display:flex; gap:24px; padding:12px 16px; font-size:15px; color:#666; overflow-x:auto; border-top-left-radius:12px; border-top-right-radius:12px;">
          <span style="font-weight:700; color:#ff5c38; position:relative;">热门<span style="position:absolute; bottom:-12px; left:50%; transform:translateX(-50%); width:20px; height:3px; background:#ff5c38; border-radius:2px;"></span></span>
          <span onclick="toastDev()">最新</span>
          <span onclick="toastDev()">名人动态</span>
          <span onclick="toastDev()">超友趣⭐</span>
          <span onclick="toastDev()">星动纪念册</span>
       </div>
       <div style="padding-bottom:20px;">
         <div style="background:#fff; padding:12px 16px; display:flex; justify-content:space-between; align-items:center; border-bottom:0.5px solid #f0f0f0; font-size:13px; color:#666;">
           <div style="display:flex; align-items:center; gap:6px;"><span style="background:#f0f0f0; padding:2px 6px; border-radius:4px; font-size:11px;">置顶</span> 🧡#穆祉丞# 💗#朝朝穆穆# ...</div>
           <span>﹀</span>
         </div>
         <div style="background:#fff; padding:12px 16px; border-bottom:0.5px solid #f0f0f0; display:flex; gap:6px; align-items:center; font-size:12px; color:#ff8200;">
            <span style="background:#5c8bd6; color:#fff; border-radius:50%; width:14px; height:14px; display:grid; place-items:center;">★</span>
            创作官热门帖 >>
            <span style="flex:1;"></span>
            <span style="color:#999;">﹀</span>
         </div>
         ${SUPERTopic_DATA.map(t => `
           <div style="background:#fff; margin-bottom:10px; padding:16px; border-bottom:0.5px solid #f0f0f0;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                 <div style="display:flex; align-items:center; gap:10px;">
                    <div style="width:40px; height:40px; border-radius:50%; background:#eee; overflow:hidden;">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" style="width:100%; height:100%; object-fit:cover;">
                    </div>
                    <div>
                       <div style="font-size:14px; font-weight:600; color:#ff8200; display:flex; align-items:center; gap:4px;">${t.user} <span style="background:#ffd700; color:#fff; font-size:9px; padding:1px 4px; border-radius:4px;">V</span> <span style="background:#f5f5f5; color:#666; font-size:9px; padding:1px 4px; border-radius:4px;">创作官</span></div>
                       <div style="font-size:11px; color:#999;">${t.time}</div>
                    </div>
                 </div>
                 <div onclick="toastDev()" style="border:1px solid #ff8200; color:#ff8200; border-radius:12px; padding:4px 14px; font-size:13px; cursor:pointer; font-weight:600;">+ 关注</div>
              </div>
              <div onclick="toastDev()" style="margin-bottom:12px;">
                 ${renderWeiboText(t.text)}
              </div>
              ${t.images && t.images.length > 0 ? `
                <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:4px; margin-bottom:12px;">
                  ${t.images.map((img, idx) => `<div style="aspect-ratio:1; border-radius:6px; overflow:hidden; position:relative;" onclick="event.stopPropagation();openMediaViewer(${JSON.stringify(t.images).replace(/"/g, '&quot;')}, ${idx})">
                    <img src="${img}" style="width:100%; height:100%; object-fit:cover;">
                    <div style="position:absolute; bottom:6px; left:6px; background:rgba(0,0,0,0.5); color:#fff; font-size:10px; padding:2px 6px; border-radius:10px; border:0.5px solid #fff;">◎ LIVE</div>
                  </div>`).join('')}
                </div>
              ` : ''}
              ${WB_ACTION_BAR(t.likes, t.comments, t.forwards)}
           </div>
         `).join('')}
       </div>
    </div>
    <div style="position:absolute; bottom:0; left:0; right:0; height:64px; background:#fff; border-top:0.5px solid #eee; display:flex; align-items:center; padding:0 16px; gap:16px; z-index:20; padding-bottom: env(safe-area-inset-bottom);">
       <div style="flex:1; background:#fff0eb; border-radius:20px; padding:10px 16px; color:#ff8200; font-size:15px; display:flex; align-items:center; gap:6px; border:1px solid #ffd1b3;" onclick="toastDev()">
         ✏️ 我来发一帖
       </div>
       <div style="display:flex; flex-direction:column; align-items:center; gap:2px; font-size:11px; color:#333;" onclick="toastDev()">
         <span style="font-size:20px;">👥</span>群聊
       </div>
       <div style="display:flex; flex-direction:column; align-items:center; gap:2px; font-size:11px; color:#333;" onclick="toastDev()">
         <span style="font-size:20px; color:#ff8200; font-weight:bold;">Lv8</span>我的
       </div>
    </div>
  </div>`
});

// ==========================================
// 📱 页面 7：微博详情页 (安全版)
// ==========================================
VIEWS.weibo_detail = () => {
  const data = window._wbData || {};
  const type = data.type || 'new';
  const id = data.id || 3;
  
  let post = null;
  if (type === 'my') post = DATA_WEIBO_DATA.find(w => w.id === id) || LIFE_WEIBO_DATA.find(w => w.id === id);
  else if (type === 'pinned') post = ARTIST_PINNED_WEIBO.find(w => w.id === id);
  else post = ARTIST_NEW_WEIBO.find(w => w.id === id);

  if (!post) return { html: `<div style="padding:100px 20px;text-align:center;color:#999;font-size:14px;">找不到这条微博</div>` };

  return {
    html: navHTML({ title: type === 'my' ? "微博正文" : "TF_ING穆祉丞MUA", back: "返回", backFn: "back()", right: `<span onclick="toastDev()">${G.dotsH}</span>` }) +
      `<div class="scroll" style="background:#f5f5f5; padding-top:88px; padding-bottom:20px;">
        <div style="background:#fff; padding:16px;">
          <div style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
            <div style="width:44px; height:44px; border-radius:50%; overflow:hidden;">
              <img src="${type === 'my' ? (CFG.myAvatar || 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=100&auto=format&fit=crop') : './data/avatar/mzc.jpg'}" style="width:100%; height:100%; object-fit:cover;">
            </div>
            <div>
              <div style="font-size:16px; font-weight:600; color:${type === 'my' ? '#333' : '#ff8200'};">${type === 'my' ? '小狗团汪汪' : 'TF_ING穆祉丞MUA'}</div>
              <div style="font-size:12px; color:#999;">${post.time} ${post.device}</div>
            </div>
          </div>
          ${renderWeiboText(post.text)}
          ${post.isRepost ? renderRepostCard(post) : ''}
          ${post.video ? `
            <div style="border-radius:8px; overflow:hidden; margin-bottom:16px; background:#000; position:relative;">
              <video src="${post.video}" controls preload="metadata" style="width:100%; max-height:400px; display:block; object-fit:contain;"></video>
            </div>
          ` : ''}
          ${post.images && post.images.length > 0 ? `
            <div style="display:grid; grid-template-columns:repeat(${post.images.length === 1 ? 1 : post.images.length === 4 ? 2 : 3}, 1fr); gap:4px; margin-bottom:12px;">
              ${post.images.map((img, idx) => `
                <div style="aspect-ratio:1; border-radius:4px; overflow:hidden; background:#eee;" onclick="event.stopPropagation();openMediaViewer(${JSON.stringify(post.images).replace(/"/g, '&quot;')}, ${idx})">
                  <img src="${img}" style="width:100%; height:100%; object-fit:cover;">
                </div>
              `).join('')}
            </div>
          ` : ''}
          <div style="display:flex; justify-content:space-between; align-items:center; border-top:0.5px solid #f0f0f0; padding-top:16px; color:#666; font-size:14px; margin-top:16px;">
            <div style="display:flex; align-items:center; gap:6px;" onclick="toastDev()">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m15 5-7 7 7 7"/><path d="M20 12H8"/></svg> ${post.forwards}
            </div>
            <div style="display:flex; align-items:center; gap:6px;" onclick="toastDev()">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg> ${post.comments}
            </div>
            <div class="like-btn" style="display:flex; align-items:center; gap:6px; cursor:pointer;" onclick="toggleWbLike(this, '${post.likes}')">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg> 
              <span class="like-count">${post.likes}</span>
            </div>
          </div>
        </div>
        <div style="background:#fff; margin-top:10px; padding:16px;">
           <div style="font-size:15px; font-weight:700; color:#111; border-bottom:0.5px solid #eee; padding-bottom:10px; margin-bottom:10px;">热门评论</div>
           <div style="display:flex; gap:10px;">
             <div style="width:36px; height:36px; border-radius:50%; background:#eee;"></div>
             <div style="flex:1;">
               <div style="font-size:13px; color:#666; font-weight:600;">事业喜上眉梢</div>
               <div style="font-size:14px; color:#333; margin-top:4px;">爱情降临掌心</div>
               <div style="font-size:11px; color:#999; margin-top:6px;">刚刚 来自 微博网页版</div>
             </div>
           </div>
        </div>
      </div>`
  };
};