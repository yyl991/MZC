// ==========================================
// 📱 相册模块 (app_photos.js) - 沉浸式时间分组版
// ==========================================

window.currentMediaList = [];

// 模拟一些高质量占位图和视频
const MOCK_PHOTOS = [
  // 分组 1：今天
  { type: 'section', title: '今天', date: '2026年11月15日' },
  { src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop" },
  { src: "./data/chat/1.mp4", isVideo: true, time: "0:15" },
  { src: "p1" }, // 渐变色兜底
  { src: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=400&auto=format&fit=crop" },
  
  // 分组 2：昨天
  { type: 'section', title: '昨天', date: '2026年11月14日' },
  { src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop" },
  { src: "p2" },
  { src: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=400&auto=format&fit=crop" },
  { src: "./data/chat/1.mp4", isVideo: true, time: "1:20" },
  { src: "p3" },
  { src: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?q=80&w=400&auto=format&fit=crop" },
  { src: "p4" },
  { src: "p5" },
  
  // 分组 3：2026年10月
  { type: 'section', title: '2026年10月', date: '' },
  { src: "p6" },
  { src: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400&auto=format&fit=crop" },
  { src: "p7" },
  { src: "p8" },
  { src: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&auto=format&fit=crop" },
  { src: "p9" }
];

VIEWS.photos = () => {
  // 如果 CFG 里配置了真实的相册，就用配置的，否则使用丰富的 Mock 数据
  let displayList = [];
  
  if (typeof photoSections !== 'undefined' && photoSections.length > 0 && photoSections[0][1].length > 1) {
    // 把配置的数据加上时间分组
    photoSections.forEach(sec => {
      displayList.push({ type: 'section', title: sec[2] || sec[0], date: sec[0] });
      sec[1].forEach(src => {
        displayList.push({ src });
      });
    });
  } else {
    // 默认兜底数据（保留之前的 Mock 数据）
    displayList = [
      { type: 'section', title: '今天', date: '2026年11月15日' },
      { src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop" },
      { src: "./data/chat/1.mp4", isVideo: true, time: "0:15" },
      { src: "p1" },
      { src: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=400&auto=format&fit=crop" },
      
      { type: 'section', title: '昨天', date: '2026年11月14日' },
      { src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop" },
      { src: "p2" },
      { src: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=400&auto=format&fit=crop" },
      { src: "./data/chat/1.mp4", isVideo: true, time: "1:20" },
      { src: "p3" },
      { src: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?q=80&w=400&auto=format&fit=crop" },
      { src: "p4" },
      { src: "p5" },
      
      { type: 'section', title: '2026年10月', date: '' },
      { src: "p6" },
      { src: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400&auto=format&fit=crop" },
      { src: "p7" },
      { src: "p8" },
      { src: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&auto=format&fit=crop" },
      { src: "p9" }
    ];
  }

  // 记录所有纯媒体路径，给全屏查看器使用
  window.currentMediaList = displayList.filter(item => !item.type).map(item => item.src);

  return {
    html: navHTML({ title: "照片", back: "主页", backFn: "closeApp()" }) + 
    `<div class="scroll" style="background:#fff; padding-bottom: 100px;">
      
      <!-- 顶部标题 -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin: 10px 16px 4px;">
         <h1 class="lt" style="margin:0; font-size:32px; font-weight:700;">最近项目</h1>
         <span onclick="toastDev()" style="color:#007aff; font-size:16px; cursor:pointer;">选择</span>
      </div>
      
      <!-- 👇 核心修改：换用 Grid 布局，完美 3 列 -->
      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:4px; padding:0 12px;">
        ${displayList.map((item, i) => {
          // 如果是时间标题分割线
          if (item.type === 'section') {
            return `<div style="grid-column: 1 / -1; font-size:22px; font-weight:700; color:#111; margin: 24px 0 10px;">
                      ${esc(item.title)} 
                      ${item.date ? `<span style="font-size:14px; font-weight:400; color:#8e8e93; margin-left:8px;">${item.date}</span>` : ''}
                    </div>`;
          }
          
          // 如果是图片或视频
          const p = item.src;
          const isVideo = item.isVideo || /\.(mp4|webm|mov)$/i.test(p);
          // 找到这个媒体在整个纯媒体数组里的索引（用于全屏查看）
          const realIndex = window.currentMediaList.indexOf(p);
          
          return `
          <div style="aspect-ratio:1; background:#eee; overflow:hidden; cursor:pointer; position:relative; border-radius:4px;" onclick="openMediaViewer(${realIndex})">
             ${isVideo 
               ? `<video src="${p}" muted preload="metadata" style="width:100%; height:100%; object-fit:cover; pointer-events:none;"></video>
                  <!-- 左下角视频时长 -->
                  <div style="position:absolute; bottom:4px; left:6px; color:#fff; font-size:11px; font-weight:500; text-shadow:0 1px 2px rgba(0,0,0,0.8); z-index:2;">${item.time || '0:00'}</div>
                  <!-- 居中播放图标 -->
                  <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:32px; height:32px; background:rgba(0,0,0,0.4); border-radius:50%; display:grid; place-items:center; color:#fff; font-size:14px; padding-left:2px; backdrop-filter:blur(4px);">▶</div>`
               : (p && p.length > 5 ? `<img src="${p}" style="width:100%; height:100%; object-fit:cover;" loading="lazy">` : `
                 <!-- 渐变占位图 -->
                 <div style="width:100%; height:100%; background:linear-gradient(45deg, hsl(${(i*47)%360},80%,75%), hsl(${(i*47+40)%360},80%,85%)); display:flex; align-items:center; justify-content:center; color:rgba(255,255,255,0.8); font-size:20px;">🌸</div>
               `)}
          </div>
        `}).join('')}
      </div>
      
      <!-- 底部我的相簿 -->
      <h1 class="lt" style="margin: 24px 16px 10px; font-size:22px;">我的相簿</h1>
      <div style="padding:0 16px; display:flex; flex-direction:column; gap:12px;">
        
        <!-- 私密相册入口 -->
        <div style="display:flex; align-items:center; gap:16px; cursor:pointer; padding-bottom: 20px;" onclick="push('privateAlbum')">
          <div style="width:80px; height:80px; border-radius:8px; background:#3a3a3c; display:grid; place-items:center; color:#fff; font-size:24px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">🔒</div>
          <div style="flex:1;">
            <div style="font-size:16px; font-weight:600; color:#111;">私密相册</div>
            <div style="font-size:13px; color:#888; margin-top:4px;">已加密</div>
          </div>
          <div style="color:#999;">${G.chevR}</div>
        </div>
        
      </div>
    </div>`,
  };
};

// ==========================================
// 🔒 私密相册 (密码键盘版)
// ==========================================
let privateAlbumUnlocked = false;
let privatePincode = "";

window.renderPrivateDots = function() {
  const dots = document.getElementById("private-pdots");
  if (dots) {
    dots.innerHTML = [0, 1, 2, 3].map(i => `<i class="${i < privatePincode.length ? "on" : ""}"></i>`).join("");
  }
  const delBtn = document.getElementById("private-del-btn");
  if (delBtn) {
    delBtn.textContent = privatePincode.length > 0 ? "删除" : "取消";
  }
};

window.pressPrivatePin = function(num, el) {
  if (privatePincode.length >= 4) return;
  if (el) {
    el.classList.add("dn");
    setTimeout(() => el.classList.remove("dn"), 90);
  }
  if(typeof sfx === 'function') sfx("key");
  if(typeof vib === 'function') vib(8);
  
  privatePincode += num;
  renderPrivateDots();
  
  if (privatePincode.length === 4) {
    const correctPassword = (typeof CFG !== 'undefined' && CFG.start?.privatePin) ? CFG.start.privatePin : "1116";
    if (privatePincode === correctPassword) {
      setTimeout(() => {
        privateAlbumUnlocked = true;
        privatePincode = "";
        show("privateAlbum");
      }, 140);
    } else {
      setTimeout(() => {
        const d = document.getElementById("private-pdots");
        if (d) {
          d.classList.remove("shake");
          void d.offsetWidth;
          d.classList.add("shake");
        }
        if(typeof vib === 'function') vib([60, 40, 60]);
        setTimeout(() => {
          privatePincode = "";
          renderPrivateDots();
        }, 420);
      }, 120);
    }
  }
};

window.delPrivatePin = function() {
  if (privatePincode.length > 0) {
    privatePincode = privatePincode.slice(0, -1);
    renderPrivateDots();
    if(typeof sfx === 'function') sfx("key");
    if(typeof vib === 'function') vib(8);
  } else {
    back();
  }
};

VIEWS.privateAlbum = () => {
  const defaultSecretPics = [
    { src: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=400&auto=format&fit=crop" },
    { src: "./data/chat/1.mp4", isVideo: true, time: "0:30" },
    { src: "p_secret1", label: "占位 · 剪影" },
    { src: "p_secret2", label: "占位 · 舞台灯" },
    { src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop" },
    { src: "p_secret3", label: "占位 · 秘密" },
  ];

  const pics = (typeof CFG !== 'undefined' && CFG.privateAlbum && CFG.privateAlbum.length > 1) 
    ? CFG.privateAlbum 
    : defaultSecretPics;

  if (!privateAlbumUnlocked) {
    privatePincode = "";
    return {
      cls: "dark",
      html: navHTML({ title: "私密相册", back: "照片", backFn: "back()", solid: true }) + 
      `<div style="height:100vh; background:#000; display:flex; flex-direction:column; align-items:center; padding-top:12vh;">
        
        <div style="width:60px; height:60px; background:#222; border-radius:15px; display:flex; align-items:center; justify-content:center; font-size:28px; margin-bottom:16px; box-shadow:0 4px 15px rgba(0,0,0,0.5);">🔒</div>
        <div class="pt" style="color:#fff; font-size:20px; font-weight:500; margin-bottom: 24px;">输入密码以查看</div>
        
        <div class="pdots" id="private-pdots" style="margin-bottom: 40px;">
            ${[0,1,2,3].map(i => `<i class="${i < privatePincode.length ? "on" : ""}"></i>`).join("")}
        </div>

        <!-- 👇 修复：改成 onclick 触发，彻底绕过全局的假按钮拦截 -->
        <div class="pkeys">
            ${[1,2,3,4,5,6,7,8,9].map(n => `<button class="pk" onclick="pressPrivatePin('${n}',this)"><b>${n}</b><small>${["","ABC","DEF","GHI","JKL","MNO","PQRS","TUV","WXYZ"][n-1]}</small></button>`).join("")}
            <span></span>
            <button class="pk" onclick="pressPrivatePin('0',this)"><b>0</b><small></small></button>
            <span></span>
        </div>
        
        <!-- 👇 修复：去掉了 width:100%，让它居中且自适应 -->
        <div class="pbot" style="position:absolute; bottom:48px; left:46px; right:46px; display:flex; justify-content:center;">
            <button id="private-del-btn" onclick="delPrivatePin()" style="color:#007aff; font-size:16px; text-align:center; background:transparent; border:none; cursor:pointer;">取消</button>
        </div>
      </div>`
    };
  }

  // 已解锁的相册部分保持不变
  const validSrcs = pics.map(p => p.src);
  window.currentMediaList = validSrcs;

  return {
    html: navHTML({ title: "私密相册", back: "照片", backFn: "back()" }) + 
    `<div class="scroll" style="background:#000; padding-bottom: 100px; min-height:100vh;">
      <div style="padding: 10px 16px; display:flex; justify-content:space-between; align-items:center;">
         <h1 class="lt" style="margin:0; color:#fff; font-size:24px;">私密照片</h1>
         <span style="color:#ff3b30; font-size:16px; cursor:pointer; padding:4px;" onclick="privateAlbumUnlocked=false; show('privateAlbum')">重新锁定</span>
      </div>
      
      <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:8px; padding:0 16px;">
        ${pics.map((p, i) => {
          const isVideo = p.isVideo || /\.(mp4|webm|mov)$/i.test(p.src);
          return `
          <div style="aspect-ratio:3/4; background:#222; overflow:hidden; border-radius:10px; position:relative; cursor:pointer;" onclick="openMediaViewer(${i})">
             ${isVideo 
               ? `<video src="${p.src}" muted preload="metadata" style="width:100%; height:100%; object-fit:cover; pointer-events:none;"></video>
                  <div style="position:absolute; bottom:6px; left:8px; color:#fff; font-size:12px; font-weight:500; text-shadow:0 1px 2px rgba(0,0,0,0.8); z-index:2;">${p.time || '0:00'}</div>
                  <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:44px; height:44px; background:rgba(0,0,0,0.5); border-radius:50%; display:grid; place-items:center; color:#fff; font-size:20px; padding-left:4px; backdrop-filter:blur(4px);">▶</div>`
               : (p.src.length > 5 ? `<img src="${p.src}" style="width:100%; height:100%; object-fit:cover;" loading="lazy">` : `
                 <div style="width:100%; height:100%; background:linear-gradient(135deg, #4a00e0, #8e2de2); display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff;">
                   <div style="font-size:12px; opacity:0.8;">${esc(p.label)}</div>
                   <div style="font-size:24px; margin-top:10px;">🔒</div>
                 </div>
               `)}
          </div>
        `}).join('')}
      </div>
    </div>`,
  };
};