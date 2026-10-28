// ==========================================
// 📱 相册模块 (app_photos.js) - 沉浸式时间分组版
// ==========================================

window.currentMediaList = [];

// 相册里是这部手机真正拍过的照片（本地素材，不依赖外网）
const MOCK_PHOTOS = [
  // 分组 1：今天
  { type: 'section', title: '今天', date: '2026年11月15日' },
  { src: "./data/album/mzc.jpg" },
  { src: "./data/album/me.jpg" },
  { src: "./data/album/cat.jpg" },
  { src: "./data/album/1.mp4", isVideo: true, time: "0:15" },

  // 分组 2：昨天
  { type: 'section', title: '昨天', date: '2026年11月14日' },
  { src: "./data/album/enzai.jpg" },
  { src: "./data/album/leader.jpg" },
  { src: "./data/album/rabbit.jpg" },
  { src: "./data/album/1tiger.jpg" },
  { src: "./data/album/mama.jpg" },

  // 分组 3：2026年10月
  { type: 'section', title: '2026年10月', date: '' },
  { src: "./data/album/enen.jpg" },
  { src: "./data/album/mu.jpg" },
  { src: "./data/album/lpp.jpg" },
  { src: "./data/album/pigcry.jpg" },
  { src: "./data/album/le.jpg" },
  { src: "./data/album/2mama.jpg" }
];

function getPhoneDisplayList() {
  let displayList = [];
  if (
    typeof photoSections !== "undefined" &&
    photoSections.length > 0 &&
    photoSections[0][1].length > 1
  ) {
    photoSections.forEach((sec) => {
      displayList.push({ type: "section", title: sec[2] || sec[0], date: sec[0] });
      sec[1].forEach((src) => {
        displayList.push({ src });
      });
    });
  } else {
    displayList = MOCK_PHOTOS.map((item) => ({ ...item }));
  }
  return displayList;
}

// 给微信/其他 App 用的真实相册数据
window.getPhoneDisplayList = getPhoneDisplayList;
window.getPhoneMedia = function () {
  return getPhoneDisplayList().filter(
    (item) =>
      !item.type &&
      item.src &&
      (item.src.startsWith("http") ||
        item.src.startsWith("./") ||
        item.src.startsWith("/")),
  );
};

// iOS 风格相册选择器（微信发图 / 朋友圈配图共用）
window.openPhoneAlbumPicker = function (opts) {
  opts = opts || {};
  const display = getPhoneDisplayList();
  const multiple = !!opts.multiple;
  const max = multiple ? opts.max || 9 : 1;
  const imagesOnly = !!opts.imagesOnly;
  const selected = [];
  const root = document.createElement("div");
  root.className = "phone-album-picker";
  root.style.cssText =
    "position:absolute;inset:0;z-index:999999;background:#fff;display:flex;flex-direction:column;color:#111;";

  const close = () => {
    root.remove();
    window._phoneAlbumState = null;
  };
  const finish = () => {
    if (!selected.length) return;
    const out = selected.slice();
    close();
    if (opts.onDone) opts.onDone(out);
  };
  const render = () => {
    const header = `<div style="flex:none;height:88px;padding:44px 16px 0;display:flex;align-items:flex-end;justify-content:space-between;background:#fff;border-bottom:.5px solid #e5e5ea;">
      <button onclick="window.phoneAlbumClose()" style="border:none;background:none;color:#111;font-size:16px;padding:0 0 10px;cursor:pointer;">取消</button>
      <div style="font-size:17px;font-weight:600;padding-bottom:10px;">照片</div>
      <button onclick="window.phoneAlbumDone()" style="border:none;background:none;color:${selected.length ? "#007aff" : "#c7c7cc"};font-size:16px;font-weight:600;padding:0 0 10px;cursor:pointer;">${multiple ? "完成" + (selected.length ? "(" + selected.length + ")" : "") : "选择"}</button>
    </div>`;
    let body = "";
    display.forEach((item, i) => {
      if (item.type === "section") {
        body += `<div style="grid-column:1/-1;padding:14px 16px 8px;font-size:15px;font-weight:600;color:#111;">${esc(item.title)}${item.date ? `<span style="font-size:12px;color:#8e8e93;font-weight:400;margin-left:6px;">${esc(item.date)}</span>` : ""}</div>`;
        return;
      }
      const isVideo = item.isVideo || /\.(mp4|webm|mov)$/i.test(item.src || "");
      if (imagesOnly && isVideo) return;
      if (!item.src || item.src.length <= 5) return;
      const idx = selected.indexOf(item.src);
      body += `<div style="position:relative;aspect-ratio:1;background:#eee;overflow:hidden;cursor:pointer;" onclick="window.phoneAlbumTap(${i})">
        ${
          isVideo
            ? `<video src="${item.src}" muted preload="metadata" style="width:100%;height:100%;object-fit:cover;pointer-events:none;"></video>
               <div style="position:absolute;inset:0;display:grid;place-items:center;color:#fff;font-size:22px;text-shadow:0 1px 3px #000;">▶</div>
               <div style="position:absolute;left:6px;bottom:4px;color:#fff;font-size:10px;text-shadow:0 1px 2px #000;">${esc(item.time || "0:00")}</div>`
            : `<img src="${item.src}" style="width:100%;height:100%;object-fit:cover;">`
        }
        ${
          idx >= 0
            ? `<div style="position:absolute;top:6px;right:6px;width:22px;height:22px;border-radius:50%;background:#007aff;color:#fff;font-size:12px;display:grid;place-items:center;border:2px solid #fff;">${multiple ? idx + 1 : "✓"}</div>`
            : ""
        }
      </div>`;
    });
    root.innerHTML =
      header +
      `<div style="flex:1;overflow-y:auto;padding:0 4px 30px;"><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:2px;">${body || `<div style="grid-column:1/-1;padding:80px 0;text-align:center;color:#999;">相册里没有照片</div>`}</div></div>`;
    window._phoneAlbumState = {
      display,
      selected,
      multiple,
      max,
      imagesOnly,
      root,
      finish,
      close,
      render,
    };
  };
  window.phoneAlbumTap = function (i) {
    const s = window._phoneAlbumState;
    if (!s) return;
    const item = s.display[i];
    if (!item || item.type) return;
    if (
      s.imagesOnly &&
      (item.isVideo || /\.(mp4|webm|mov)$/i.test(item.src || ""))
    )
      return;
    if (s.max === 1) {
      s.selected.length = 0;
      s.selected.push(item.src);
      return s.finish();
    }
    const pos = s.selected.indexOf(item.src);
    if (pos >= 0) s.selected.splice(pos, 1);
    else if (s.selected.length >= s.max) {
      if (typeof toastDev === "function")
        toastDev("最多只能选 " + s.max + " 张");
      return;
    } else s.selected.push(item.src);
    s.render();
  };
  window.phoneAlbumDone = function () {
    const s = window._phoneAlbumState;
    if (s) s.finish();
  };
  window.phoneAlbumClose = function () {
    const s = window._phoneAlbumState;
    if (s) s.close();
  };
  render();
  document.getElementById("screen").appendChild(root);
};

VIEWS.photos = () => {
  const displayList = getPhoneDisplayList();

  // 记录所有纯媒体路径，给全屏查看器使用
  window.currentMediaList = displayList.filter(item => !item.type).map(item => item.src);

  return {
    html: navHTML({ title: "照片", back: "主页", backFn: "closeApp()" }) + 
    `<div class="scroll" style="background:#fff; padding-bottom: 100px;">
      
      <!-- 顶部标题 -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin: 10px 16px 4px;">
         <h1 class="lt" style="margin:0; font-size:32px; font-weight:700;">最近项目</h1>
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

  // ================= 未解锁状态 =================
  if (!privateAlbumUnlocked) {
    privatePincode = "";
    return {
      cls: "dark",
      dark: true, // 👈 核心修改：告诉系统状态栏变白字！
      html: `
      <div style="height:100vh; background:#000; display:flex; flex-direction:column; align-items:center; padding-top:12vh;">
        <div style="width:60px; height:60px; background:#222; border-radius:15px; display:flex; align-items:center; justify-content:center; font-size:28px; margin-bottom:16px; box-shadow:0 4px 15px rgba(0,0,0,0.5);">🔒</div>
        <div class="pt" style="color:#fff; font-size:20px; font-weight:500; margin-bottom: 24px;">输入密码以查看</div>
        
        <div class="pdots" id="private-pdots" style="margin-bottom: 40px;">
            ${[0,1,2,3].map(i => `<i class="${i < privatePincode.length ? "on" : ""}"></i>`).join("")}
        </div>

        <div class="pkeys">
            ${[1,2,3,4,5,6,7,8,9].map(n => `<button class="pk" onclick="pressPrivatePin('${n}',this)"><b>${n}</b><small>${["","ABC","DEF","GHI","JKL","MNO","PQRS","TUV","WXYZ"][n-1]}</small></button>`).join("")}
            <span></span>
            <button class="pk" onclick="pressPrivatePin('0',this)"><b>0</b><small></small></button>
            <span></span>
        </div>
        
        <div class="pbot" style="position:absolute; bottom:48px; left:46px; right:46px; display:flex; justify-content:center;">
            <button id="private-del-btn" onclick="delPrivatePin()" style="color:#007aff; font-size:16px; text-align:center; background:transparent; border:none; cursor:pointer;">取消</button>
        </div>
      </div>`
    };
  }

  // ================= 已解锁状态 =================
  const validSrcs = pics.map(p => p.src);
  window.currentMediaList = validSrcs;

  return {
    cls: "dark",
    dark: true, // 👈 核心修改：解锁后依然保持白字状态栏，并去掉了多余的黑色导航栏
    html: `
    <div class="scroll" style="background:#000; padding-bottom: 100px; min-height:100vh; padding-top: 60px;">
      <div style="padding: 10px 16px 20px; display:flex; justify-content:space-between; align-items:center;">
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
    </div>`
  };
};