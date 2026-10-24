// ==========================================
// 📱 微博模块 (app_weibo.js) - 独立版
// ==========================================

const WEIBO_DATA = [
  { 
    id: 1,
    text: "小萌萌", 
    time: "10-16", 
    device: "来自 HarmonyOS设备", 
    images: ["./data/avatar/mzc.jpg", "E404", "E404"], 
    video: "",
    repost: "@与橡树至世界尽头：🐼➡️😡➡️啊打", 
    likes: 1024, 
    liked: false,
    comments: 88, 
    forwards: 56 
  },
  { 
    id: 2,
    text: "小猪宝宝🐷今天给我跳了个舞，但我没录下来，气死我了！", 
    time: "10-15", 
    device: "来自 iPhone 15 Pro", 
    images: [], 
    video: "./data/chat/1.mp4", // 如果路径不对，请改成你实际存在的视频路径
    repost: "",
    likes: 2048, 
    liked: false,
    comments: 156, 
    forwards: 23 
  },
  { 
    id: 3,
    text: "今天排练真的很累，但是看到大家应援又充满了力量！", 
    time: "10-10", 
    device: "来自 微博网页版", 
    images: ["E404"], 
    video: "",
    repost: "",
    likes: 5120, 
    liked: false,
    comments: 420, 
    forwards: 102 
  }
];

// 点赞交互
function likeWeibo(id, btn) {
  const w = WEIBO_DATA.find(x => x.id === id);
  if (!w) return;
  
  w.liked = !w.liked;
  w.likes += w.liked ? 1 : -1;
  vib(15);
  
  // 点赞动画
  if (w.liked) {
    btn.style.color = "#ff8200";
    btn.querySelector(".like-count").textContent = w.likes;
    btn.animate([
      { transform: "scale(1)" },
      { transform: "scale(1.3)" },
      { transform: "scale(1)" }
    ], { duration: 300, easing: "cubic-bezier(.2,1.4,.4,1)" });
  } else {
    btn.style.color = "#666";
    btn.querySelector(".like-count").textContent = w.likes;
  }
}

// 全屏看图 (独立封装，不依赖全局)
window.viewWeiboImg = (url) => {
  if (url === 'E404') return;
  const d = document.createElement("div");
  d.className = "viewer";
  d.style.cssText = "position:fixed; inset:0; z-index:99999; background:rgba(0,0,0,0.95); display:flex; align-items:center; justify-content:center; flex-direction:column;";
  d.innerHTML = `
    <div style="position:absolute; top:50px; left:20px; color:#fff; font-size:30px; cursor:pointer; padding:10px;" onclick="this.parentElement.remove()">×</div>
    <img src="${url}" style="max-width:100%; max-height:80%; object-fit:contain;">
  `;
  document.getElementById("screen").appendChild(d);
};

VIEWS.weibo = () => ({
  html: navHTML({ title: "微博", back: "主页", backFn: "closeApp()", right: G.gear }) +
    `<div class="scroll" style="background:#f5f5f5; padding-top:88px; padding-bottom:20px;">
      
      <div style="background:#fff; padding:10px 16px 0;">
        <div style="display:flex; gap:20px; overflow-x:auto; white-space:nowrap; font-size:16px; color:#666; padding-bottom:10px; scrollbar-width:none;">
          <span style="font-weight:700; color:#111; position:relative;">全部<span style="position:absolute; bottom:-8px; left:50%; transform:translateX(-50%); width:20px; height:3px; background:#ff8200; border-radius:2px;"></span></span>
          <span>超话帖</span>
          <span>原创</span>
          <span>视频</span>
          <span>文章</span>
          <span>图片</span>
        </div>
        <div class="srch" style="margin:10px 0; background:#f5f5f5;">${G.search}搜我的微博</div>
      </div>

      <!-- 个人主页入口 -->
      <div style="background:#fff; margin-top:10px; padding:14px 16px; display:flex; justify-content:space-between; align-items:center;">
        <div style="display:flex; align-items:center; gap:10px; cursor:pointer;" onclick="push('weibo_profile')">
           <div style="width:48px; height:48px; border-radius:50%; background:#eee; overflow:hidden;">
             ${CFG.myAvatar ? `<img src="${CFG.myAvatar}" style="width:100%; height:100%; object-fit:cover;">` : ''}
           </div>
           <div>
             <div style="font-size:16px; font-weight:600; color:#111;">赶快跑赶快长</div>
             <div style="font-size:12px; color:#999;">查看过往微博 ></div>
           </div>
        </div>
      </div>

      <div style="padding:10px 16px; font-size:13px; color:#666; display:flex; justify-content:space-between;">
        <span>全部微博(${WEIBO_DATA.length})</span>
        <span>☰ 筛选</span>
      </div>

      ${WEIBO_DATA.map(w => `
        <div style="background:#fff; margin-bottom:10px; padding:16px;">
          <div style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
            <div style="width:44px; height:44px; border-radius:50%; overflow:hidden; background:#eee;">
               ${CFG.myAvatar ? `<img src="${CFG.myAvatar}" style="width:100%; height:100%; object-fit:cover;">` : ''}
            </div>
            <div>
              <div style="font-size:16px; font-weight:600; color:#333;">赶快跑赶快长</div>
              <div style="font-size:12px; color:#999;">${w.time} ${w.device}</div>
            </div>
          </div>
          
          <div style="font-size:15px; color:#333; line-height:1.5; margin-bottom:8px;">${esc(w.text)}</div>
          
          ${w.repost ? `<div style="font-size:13px; color:#666; margin-bottom:8px; background:#f5f5f5; padding:8px; border-radius:4px;">${esc(w.repost)}</div>` : ''}
          
          ${w.video ? `
            <div style="border-radius:8px; overflow:hidden; margin-bottom:12px; background:#000;">
              <video src="${w.video}" controls playsinline style="width:100%; max-height:300px; display:block;"></video>
            </div>
          ` : ''}

          ${w.images && w.images.length > 0 ? `
            <div style="display:grid; grid-template-columns:repeat(${w.images.length === 1 ? 1 : w.images.length === 4 ? 2 : 3}, 1fr); gap:4px; margin-bottom:12px;">
              ${w.images.map(img => `
                <div style="aspect-ratio:1; border-radius:4px; overflow:hidden; background:#eee; display:flex; align-items:center; justify-content:center; color:#999; font-size:12px; cursor:${img === 'E404' ? 'default' : 'pointer'};" onclick="viewWeiboImg('${img}')">
                  ${img === 'E404' ? '图片占位' : `<img src="${img}" style="width:100%; height:100%; object-fit:cover;">`}
                </div>
              `).join('')}
            </div>
          ` : ''}

          <div style="display:flex; justify-content:space-between; align-items:center; border-top:0.5px solid #f0f0f0; padding-top:12px; color:#666; font-size:13px;">
            <span style="display:flex; align-items:center; gap:4px; cursor:pointer;">↻ ${w.forwards}</span>
            <span style="display:flex; align-items:center; gap:4px; cursor:pointer;">💬 ${w.comments}</span>
            <button onclick="likeWeibo(${w.id}, this)" style="display:flex; align-items:center; gap:4px; border:none; background:none; color:${w.liked ? '#ff8200' : '#666'}; cursor:pointer; padding:0; font-size:13px;">
              <span>👍</span> <span class="like-count">${w.likes}</span>
            </button>
          </div>
        </div>
      `).join('')}
    </div>`,
});

VIEWS.weibo_profile = () => ({
  html: navHTML({ title: "个人主页", back: "微博", backFn: "back()" }) +
    `<div class="scroll" style="background:#f5f5f5; padding-bottom:20px;">
       <div style="background:linear-gradient(180deg, #ff9a9e, #fecfef); height:120px; position:relative;">
          <div style="position:absolute; bottom:-30px; left:20px; width:80px; height:80px; border-radius:50%; border:3px solid #fff; overflow:hidden; background:#fff;">
             ${CFG.myAvatar ? `<img src="${CFG.myAvatar}" style="width:100%; height:100%; object-fit:cover;">` : ''}
          </div>
       </div>
       <div style="background:#fff; padding:40px 20px 20px;">
          <div style="font-size:20px; font-weight:700; color:#111;">赶快跑赶快长</div>
          <div style="font-size:13px; color:#999; margin-top:6px;">📍 北京</div>
          <div style="font-size:14px; color:#333; margin-top:12px;">今天也很想你。</div>
       </div>
       <div style="padding:10px 16px; font-size:13px; color:#666;">全部微博(${WEIBO_DATA.length})</div>
       ${WEIBO_DATA.map(w => `
        <div style="background:#fff; margin-bottom:10px; padding:16px;">
          <div style="font-size:15px; color:#333; line-height:1.5; margin-bottom:8px;">${esc(w.text)}</div>
          ${w.images && w.images.length > 0 ? `
            <div style="display:grid; grid-template-columns:repeat(${w.images.length === 1 ? 1 : w.images.length === 4 ? 2 : 3}, 1fr); gap:4px; margin-bottom:12px;">
              ${w.images.map(img => `
                <div style="aspect-ratio:1; border-radius:4px; overflow:hidden; background:#eee; display:flex; align-items:center; justify-content:center; color:#999; font-size:12px; cursor:${img === 'E404' ? 'default' : 'pointer'};" onclick="viewWeiboImg('${img}')">
                  ${img === 'E404' ? '图片占位' : `<img src="${img}" style="width:100%; height:100%; object-fit:cover;">`}
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `).join('')}
    </div>`,
});