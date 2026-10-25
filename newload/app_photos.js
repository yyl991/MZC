// ==========================================
// 📱 相册模块 (app_photos.js) - 终极防错版
// ==========================================

window.currentMediaList = [];

// ---------------- 普通相册 ----------------
VIEWS.photos = () => {
  let allPhotos = [];
  if (typeof photoSections !== 'undefined' && photoSections.length > 0) {
    photoSections.forEach(sec => allPhotos = allPhotos.concat(sec[1]));
  } else {
    allPhotos = ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9"];
  }
  
  window.currentMediaList = allPhotos;

  return {
    html: navHTML({ title: "照片", back: "主页", backFn: "closeApp()" }) + 
    `<div class="scroll" style="background:#fff; padding-bottom: 100px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin: 0 16px 10px;">
         <h1 class="lt" style="margin:0; font-size:28px;">最近项目</h1>
         <span style="color:#007aff; font-size:16px;">选择</span>
      </div>
      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:4px; padding:0 4px;">
        ${allPhotos.map((p, i) => {
          const isVideo = /\.(mp4|webm|mov)$/i.test(p);
          return `
          <div style="aspect-ratio:1; background:#eee; overflow:hidden; cursor:pointer; position:relative;" onclick="openMediaViewer(${i})">
             ${isVideo 
               ? `<video src="${p}" muted preload="metadata" style="width:100%; height:100%; object-fit:cover; pointer-events:none;"></video>
                  <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:30px; height:30px; background:rgba(0,0,0,0.5); border-radius:50%; display:grid; place-items:center; color:#fff; font-size:14px; padding-left:2px;">▶</div>`
               : (p.length > 5 ? `<img src="${p}" style="width:100%; height:100%; object-fit:cover;">` : `
                 <div style="width:100%; height:100%; background:linear-gradient(45deg, hsl(${i*40},80%,80%), hsl(${i*40+20},80%,90%)); display:flex; align-items:center; justify-content:center; color:#fff; font-size:12px;">[照片]</div>
               `)}
          </div>
        `}).join('')}
      </div>
      <h1 class="lt" style="margin: 24px 16px 10px; font-size:22px;">我的相簿</h1>
      <div style="padding:0 16px; display:flex; flex-direction:column; gap:12px;">
        <div style="display:flex; align-items:center; gap:16px; cursor:pointer;" onclick="push('privateAlbum')">
          <div style="width:80px; height:80px; border-radius:8px; background:#3a3a3c; display:grid; place-items:center; color:#fff; font-size:24px;">🔒</div>
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

// ---------------- 私密相册 ----------------
let privateAlbumUnlocked = false;

VIEWS.privateAlbum = () => {
  const pics = (typeof CFG !== 'undefined' && CFG.privateAlbum) 
    ? CFG.privateAlbum 
    : [{ src: "p_secret1", label: "占位 · 剪影" }, { src: "p_secret2", label: "占位 · 舞台灯" }];
  
  const correctPassword = (typeof CFG !== 'undefined' && CFG.start?.privatePin) ? CFG.start.privatePin : "1116";

  window.checkPrivatePin = () => {
    const val = document.getElementById("private-pin-input").value;
    if (val === correctPassword) {
      privateAlbumUnlocked = true;
      show("privateAlbum");
    } else {
      vib([60, 40, 60]);
      const box = document.getElementById("private-pin-box");
      box.animate([{ transform: 'translateX(-10px)' }, { transform: 'translateX(10px)' }, { transform: 'translateX(0)' }], { duration: 300 });
      document.getElementById("private-pin-input").value = "";
    }
  };

  if (!privateAlbumUnlocked) {
    return {
      cls: "dark",
      html: navHTML({ title: "私密相册", back: "照片", backFn: "back()", solid: true }) + 
      `<div style="height:100vh; background:#000; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:0 40px; padding-bottom:100px;">
        <div style="width:80px; height:80px; background:#222; border-radius:20px; display:flex; align-items:center; justify-content:center; font-size:36px; margin-bottom:20px; box-shadow:0 10px 30px rgba(0,0,0,0.5);">🔒</div>
        <div style="color:#fff; font-size:20px; font-weight:600; margin-bottom:10px;">输入密码以查看</div>
        <div style="color:#888; font-size:14px; margin-bottom:30px; text-align:center;">请输入4位数字密码</div>
        <div id="private-pin-box" style="display:flex; gap:10px; margin-bottom:30px;">
          <input id="private-pin-input" type="password" maxlength="4" pattern="\\d*" inputmode="numeric" style="background:#222; border:1px solid #444; color:#fff; font-size:24px; width:160px; text-align:center; border-radius:12px; padding:10px; outline:none; letter-spacing:10px;">
        </div>
        <button onclick="checkPrivatePin()" style="background:#007aff; color:#fff; border:none; padding:12px 40px; border-radius:20px; font-size:16px; font-weight:600; width:100%;">解锁</button>
      </div>`,
    };
  }

  const validSrcs = pics.map(p => p.src);
  window.currentMediaList = validSrcs;

  return {
    html: navHTML({ title: "私密相册", back: "照片", backFn: "back()" }) + 
    `<div class="scroll" style="background:#000; padding-bottom: 100px; min-height:100vh;">
      <div style="padding: 10px 16px; display:flex; justify-content:space-between; align-items:center;">
         <h1 class="lt" style="margin:0; color:#fff; font-size:24px;">私密照片</h1>
         <span style="color:#ff3b30; font-size:16px;" onclick="privateAlbumUnlocked=false; show('privateAlbum')">重新锁定</span>
      </div>
      <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:8px; padding:0 16px;">
        ${pics.map((p, i) => {
          const isVideo = /\.(mp4|webm|mov)$/i.test(p.src);
          return `
          <div style="aspect-ratio:3/4; background:#222; overflow:hidden; border-radius:10px; position:relative; cursor:pointer;" onclick="openMediaViewer(${i})">
             ${isVideo 
               ? `<video src="${p.src}" muted preload="metadata" style="width:100%; height:100%; object-fit:cover; pointer-events:none;"></video>
                  <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:44px; height:44px; background:rgba(0,0,0,0.5); border-radius:50%; display:grid; place-items:center; color:#fff; font-size:20px; padding-left:4px;">▶</div>`
               : (p.src.length > 5 ? `<img src="${p.src}" style="width:100%; height:100%; object-fit:cover;">` : `
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