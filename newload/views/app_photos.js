// ==========================================
// 📱 相册模块 (app_photos.js) - 纯净原版 (无相簿分组)
// ==========================================

window.currentMediaList = [];

// 相册里是这部手机真正拍过的照片（本地素材，不依赖外网）
const MOCK_PHOTOS = [
  // 分组 1：今天
  /*
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
   */
  
  { type: 'section', title: '2023年10月', date: '' },
  
  { src: "./data/photo/1.mp4", isVideo: true, time: "0:26" },
  
  { src: "./data/photo/2.mp4", isVideo: true, time: "0:19" },

];

// 供微信发图调用
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
    return displayList;
  }
  return displayList;
}

window.getPhoneDisplayList = getPhoneDisplayList;
window.getPhoneMedia = function () {
  return getPhoneDisplayList().filter(
    (item) =>
      !item.type &&
      item.src &&
      (item.src.startsWith("http") ||
        item.src.startsWith("./") ||
        item.src.startsWith("/"))
  );
};

// 3. 相册主页 (一进相册直接是最近项目)
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
      
      <!-- 照片网格 -->
      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:4px; padding:0 12px;">
        ${displayList.map((item, i) => {
          if (item.type === 'section') {
            return `<div style="grid-column: 1 / -1; font-size:22px; font-weight:700; color:#111; margin: 24px 0 10px;">
                      ${esc(item.title)} 
                      ${item.date ? `<span style="font-size:14px; font-weight:400; color:#8e8e93; margin-left:8px;">${item.date}</span>` : ''}
                    </div>`;
          }
          
          const p = item.src;
          const isVideo = item.isVideo || /\.(mp4|webm|mov)$/i.test(p);
          const realIndex = window.currentMediaList.indexOf(p);
          
          return `
          <div style="aspect-ratio:1; background:#eee; overflow:hidden; cursor:pointer; position:relative; border-radius:4px;" onclick="openMediaViewer(${realIndex})">
             ${isVideo 
               ? `<video src="${p}" muted preload="metadata" style="width:100%; height:100%; object-fit:cover; pointer-events:none;"></video>
                  <div style="position:absolute; bottom:4px; left:6px; color:#fff; font-size:11px; font-weight:500; text-shadow:0 1px 2px rgba(0,0,0,0.8); z-index:2;">${item.time || '0:00'}</div>
                  <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:32px; height:32px; background:rgba(0,0,0,0.4); border-radius:50%; display:grid; place-items:center; color:#fff; font-size:14px; padding-left:2px; backdrop-filter:blur(4px);">▶</div>`
               : (p && p.length > 5 ? `<img src="${p}" style="width:100%; height:100%; object-fit:cover;" loading="lazy">` : `
                 <div style="width:100%; height:100%; background:linear-gradient(45deg, hsl(${(i*47)%360},80%,75%), hsl(${(i*47+40)%360},80%,85%)); display:flex; align-items:center; justify-content:center; color:rgba(255,255,255,0.8); font-size:20px;">🌸</div>
               `)}
          </div>
        `}).join('')}
      </div>
      
      <!-- 底部我的相簿：改成一行三列的网格 -->
      <h1 class="lt" style="margin: 24px 16px 10px; font-size:22px;">私密相册</h1>
      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:4px; padding:0 12px; margin-bottom: 40px;">
        <div style="aspect-ratio:1; background:#3a3a3c; overflow:hidden; cursor:pointer; border-radius:4px; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff;" onclick="push('privateAlbum')">
          <div style="font-size:28px; line-height:1;">🔒</div>
          <div style="font-size:11px; margin-top:8px; opacity:.85;">私密相册</div>
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
  const pics = [
    { src: "./data/photo/private (1).jpg" },
    { src: "./data/photo/private (2).jpg" },    
    { src: "./data/photo/private (3).jpg" },
    { src: "./data/photo/private (4).jpg" },
    { src: "./data/photo/private (5).jpg" },
    { src: "./data/photo/private (6).jpg" },
    
    { src: "./data/photo/mouth1.jpg" },
    
    { src: "./data/photo/mouth2.jpg" },
    
    { src: "./data/photo/mouth3.jpg" },
    
    { src: "./data/photo/private (9).jpg" },   
    
    { src: "./data/photo/private (8).jpg" },
    { src: "./data/photo/private (7).jpg" },    
 //   { src: "./data/photo/private (8).jpg" },
   // { src: "./data/photo/private (9).jpg" },   
    
    { src: "./data/photo/private (1).mp4" , isVideo: true, time: "0:02"},
    
    { src: "./data/photo/private (10).jpg" },
    { src: "./data/photo/private (2).mp4", isVideo: true, time: "0:02" }, 
    { src: "./data/photo/private (11).jpg" },
    { src: "./data/photo/private (12).jpg" },    
    { src: "./data/photo/private (13).jpg" },
    { src: "./data/photo/private (14).jpg" },
  ];

  if (!privateAlbumUnlocked) {
    privatePincode = "";
    return {
      cls: "dark", dark: true, 
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

  const validSrcs = pics.map(p => p.src);
  window.currentMediaList = validSrcs;

  return {
    cls: "dark", dark: true, 
    html: `
    <!-- 👇 padding-top 增加到 90px，让整个内容往下沉 -->
    <div class="scroll" style="background:#000; padding-bottom: 0; min-height:100vh; padding-top: 90px;">
      
      <div style="padding: 0 16px 20px; display:flex; justify-content:space-between; align-items:flex-end;">
         <h1 class="lt" style="margin:0; color:#fff; font-size:32px; font-weight:700;">私密照片</h1>
         <span style="color:#ff3b30; font-size:15px; cursor:pointer; padding:4px 0; margin-bottom:6px;" onclick="privateAlbumUnlocked=false; show('privateAlbum')">重新锁定</span>
      </div>
      
      <!-- 👇 gap 缩小到 1px，更满；底部不留任何 padding，直接顶到底 -->
      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:1px;">
        ${pics.map((p, i) => {
          const isVideo = p.isVideo || /\.(mp4|webm|mov)$/i.test(p.src);
          return `
          <div style="aspect-ratio:1; background:#1a1a1a; overflow:hidden; position:relative; cursor:pointer;" onclick="openMediaViewer(${i})">
             ${isVideo 
               ? `<video src="${p.src}" muted preload="metadata" playsinline webkit-playsinline style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; pointer-events:none;"></video>
                  <div style="position:absolute; bottom:4px; left:6px; color:#fff; font-size:11px; font-weight:500; text-shadow:0 1px 2px rgba(0,0,0,0.8); z-index:2;">${p.time || "0:02"}</div>
                  <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:32px; height:32px; background:rgba(0,0,0,0.5); border-radius:50%; display:grid; place-items:center; color:#fff; font-size:14px; padding-left:2px; backdrop-filter:blur(4px);">▶</div>`
               : `<img src="${p.src}" style="width:100%; height:100%; object-fit:cover; display:block;" loading="lazy">`}
          </div>
        `}).join('')}
      </div>
    </div>`
  };
};
// ==========================================
// iOS 风格相册选择器（微信发图 / 朋友圈配图共用）
// ==========================================
window._phoneAlbumState = null;

window.openPhoneAlbumPicker = function (opts) {
  const o = opts || {};
  const display =
    typeof getPhoneDisplayList === "function" ? getPhoneDisplayList() : [];
  if (!display.length) return toastDev("相册里还没有照片");
  window._phoneAlbumState = {
    display: display,
    selected: [],
    multiple: !!o.multiple,
    max: o.max || (o.multiple ? 9 : 1),
    imagesOnly: !!o.imagesOnly,
    onDone: o.onDone,
  };
  renderPhoneAlbumPicker();
};

function renderPhoneAlbumPicker() {
  const st = window._phoneAlbumState;
  if (!st) return;
  const old = document.getElementById("pa-root");
  if (old && old.remove) old.remove();
  const root = document.createElement("div");
  root.id = "pa-root";
  root.className = "pa-root";
  const cells = st.display
    .map(function (item, i) {
      if (!item.src) return "";
      const sel = st.selected.indexOf(i) >= 0;
      const isV = item.isVideo || /\.(mp4|webm|mov)$/i.test(item.src);
      const s = typeof esc === "function" ? esc(item.src) : item.src;
      return `<button class="pa-cell${sel ? " sel" : ""}" onclick="phoneAlbumTap(${i})">${
        isV
          ? `<video src="${s}" muted preload="metadata"></video><i class="pa-vd">${item.time || "0:02"}</i>`
          : `<img src="${s}" loading="lazy" />`
      }</button>`;
    })
    .join("");
  root.innerHTML =
    `<div class="pa-bar"><button onclick="closePhoneAlbumPicker()">取消</button><b>照片</b>` +
    (st.multiple
      ? `<button onclick="phoneAlbumDone()">完成${st.selected.length ? "(" + st.selected.length + ")" : ""}</button>`
      : `<span style="width:34px"></span>`) +
    `</div><div class="pa-grid">${cells}</div>`;
  const host = document.getElementById("screen") || document.body;
  if (host && host.appendChild) host.appendChild(root);
}

window.closePhoneAlbumPicker = function () {
  window._phoneAlbumState = null;
  const old = document.getElementById("pa-root");
  if (old && old.remove) old.remove();
};

window.phoneAlbumTap = function (i) {
  const st = window._phoneAlbumState;
  if (!st) return;
  const item = st.display[i];
  if (!item || !item.src) return;
  const isV = item.isVideo || /\.(mp4|webm|mov)$/i.test(item.src);
  if (st.imagesOnly && isV) return toastDev("这里只能选图片");
  if (typeof vib === "function") vib(6);
  if (!st.multiple) {
    const cb = st.onDone;
    window.closePhoneAlbumPicker();
    if (typeof cb === "function") cb([item.src]);
    return;
  }
  const at = st.selected.indexOf(i);
  if (at >= 0) st.selected.splice(at, 1);
  else {
    if (st.selected.length >= st.max)
      return toastDev("最多选 " + st.max + " 张");
    st.selected.push(i);
  }
  renderPhoneAlbumPicker();
};

window.phoneAlbumDone = function () {
  const st = window._phoneAlbumState;
  if (!st) return;
  const urls = st.selected
    .map(function (i) {
      return st.display[i];
    })
    .filter(function (x) {
      if (!x || !x.src) return false;
      const isV = x.isVideo || /\.(mp4|webm|mov)$/i.test(x.src);
      return !(st.imagesOnly && isV);
    })
    .map(function (x) {
      return x.src;
    });
  if (!urls.length) return toastDev("先选一张吧");
  const cb = st.onDone;
  window.closePhoneAlbumPicker();
  if (typeof cb === "function") cb(urls);
};