// ==========================================
// 📱 B站模块 (app_bilibili.js)
// ==========================================
VIEWS.bilibili = () => {
  const topCoverStyle = "background: url('https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1000&auto=format&fit=crop') center/cover;";
  
  const videos = [
    { title: "连出道首舞台都不行的根本不是帽女", up: "Jeninini_", views: "34.1万", danmu: "1539", time: "09:32", type: "link", url: "https://www.bilibili.com/", coverType: "web_img", coverSrc: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=500&auto=format&fit=crop" },
    { title: "EP2：小猪背后看看左边看看，我们颜色咋不一样捏", up: "好眠_Aurora", views: "634", danmu: "2", time: "03:39", type: "link", url: "https://www.bilibili.com/", coverType: "web_img", coverSrc: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=500&auto=format&fit=crop" },
    { title: "卡门：地区限定摄政王", up: "奇奇怪怪的英专生", views: "13.1万", danmu: "330", time: "05:14", type: "local", video: "./data/chat/1.mp4", coverType: "video" },
    { title: "【大脑里的能量战争】越休息越累的原因找到", up: "脑洞大开", views: "78.1万", danmu: "168", time: "12:00", type: "link", url: "https://www.bilibili.com/", coverType: "gradient", cover: "linear-gradient(135deg, #43e97b, #38f9d7)" },
    { title: "自制猫猫头！萌化了", up: "喵喵教教主", views: "11.2万", danmu: "420", time: "01:15", type: "link", url: "https://www.bilibili.com/", coverType: "web_img", coverSrc: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=500&auto=format&fit=crop" },
    { title: "深夜放毒：一碗完美的拉面", up: "食神小当家", views: "55.3万", danmu: "890", time: "08:20", type: "local", video: "./data/chat/1.mp4", coverType: "video" }
  ];

  return {
    html: `
    <div class="scroll" style="background:#f4f4f4; padding-top:0; padding-bottom:70px;">
      <div style="padding:54px 16px 10px; background:#fff; display:flex; align-items:center; gap:12px; position:sticky; top:0; z-index:10;">
        <div onclick="toastDev()" style="width:36px; height:36px; border-radius:50%; background:#ccc; flex:none; overflow:visible; position:relative;">
          ${typeof CFG !== "undefined" && CFG.myAvatar ? `<img src="${CFG.myAvatar}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">` : ""}
          <div style="position:absolute; bottom:-2px; left:-4px; width:16px; height:16px; background:#fff; border-radius:50%; display:grid; place-items:center; border:1px solid #eee;">
            ${G.biliLightning}
          </div>
        </div>
        <div onclick="toastDev()" style="flex:1; background:#fff; border:1px solid #ccc; border-radius:18px; height:34px; display:flex; align-items:center; padding:0 12px; font-size:13.5px; color:#333; gap:6px;">
          ${G.biliSearch} 王楚淇解说 · 18小时...
        </div>
        <div onclick="toastDev()" style="width:28px; height:28px; display:grid; place-items:center; flex:none; color:#111;">
          ${G.biliGame}
        </div>
        <div onclick="toastDev()" style="width:28px; height:28px; display:grid; place-items:center; flex:none; color:#111; position:relative;">
          ${G.biliMessage}
          <div style="position:absolute; top:0px; right:2px; width:6px; height:6px; background:#ff5d5d; border-radius:50%;"></div>
        </div>
      </div>

      <div style="background:#fff; padding:10px 16px; display:flex; gap:20px; font-size:15px; color:#333; overflow-x:auto; border-bottom:0.5px solid #eee; scrollbar-width:none; align-items:center;">
        <span onclick="toastDev()">直播</span>
        <span style="font-weight:700; color:#fb7299; position:relative;">推荐<span style="position:absolute; bottom:-6px; left:50%; transform:translateX(-50%); width:16px; height:3px; background:#fb7299; border-radius:2px;"></span></span>
        <span onclick="toastDev()">热门</span>
        <span onclick="toastDev()">动画</span>
        <span onclick="toastDev()">影视</span>
        <span onclick="toastDev()">S16</span>
        <span onclick="toastDev()">新</span>
        <div style="margin-left:auto; display:flex; align-items:center;">
          ${G.biliMenu}
        </div>
      </div>

      <div style="padding:10px 8px;">
        <div onclick="event.stopPropagation(); window.open('https://www.bilibili.com/video/BV1cgTV6bEru/', '_blank')" style="background:#fff; border-radius:8px; overflow:hidden; cursor:pointer;">
          <div style="height:200px; ${topCoverStyle} position:relative;">
            <div style="position:absolute; inset:0; background:linear-gradient(transparent 60%, rgba(0,0,0,0.4));"></div>
            <div style="position:absolute; bottom:6px; left:8px; display:flex; gap:10px; color:#fff; font-size:11px; font-weight:500; z-index:2; align-items:center;">
               <span style="display:flex; align-items:center; gap:2px;">${G.biliPlay14} 10.3万</span>
               <span style="display:flex; align-items:center; gap:2px;">${G.biliDanmu14} 262</span>
            </div>
            <span style="position:absolute; bottom:6px; right:8px; color:#fff; font-size:11px; text-shadow:0 1px 2px rgba(0,0,0,0.8); z-index:2;">3:43</span>
          </div>
          <div style="padding:10px 12px; display:flex; justify-content:space-between; align-items:flex-start; gap:10px;">
            <div style="font-size:15px; font-weight:600; color:#111; line-height:1.4;">曼联献礼巴佩梅开二度，足球圈齐贺王楚淇南瓜大婚</div>
            <div style="display:flex; flex-direction:column; align-items:center; color:#999;">
               ${G.biliLike16}
               <span style="font-size:10px; margin-top:2px;">4131</span>
            </div>
          </div>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; padding:0 8px;">
        ${videos.map((v) => {
            let coverHTML = "";
            if (v.coverType === "video") {
              coverHTML = `<video src="${v.video}" muted preload="metadata" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; pointer-events:none;"></video><div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); z-index:2; width:32px; height:32px; background:rgba(0,0,0,0.5); border-radius:50%; display:grid; place-items:center; color:#fff;">${G.biliVideoPlay}</div>`;
            } else if (v.coverType === "local_img" || v.coverType === "web_img") {
              coverHTML = `<img src="${v.coverSrc}" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; pointer-events:none;">`;
            } else {
              coverHTML = `<div style="position:absolute; inset:0; background:${v.cover};"></div>`;
            }
            
            return `
            <div style="background:#fff; border-radius:8px; overflow:hidden; cursor:pointer; display:flex; flex-direction:column;" onclick="event.stopPropagation(); if('${v.type}'==='link'){window.open('${v.url}', '_blank');} else {openMediaViewer(['${v.video}'], 0);}">
              
              <div style="height:110px; position:relative; width:100%;">
                ${coverHTML}
                <div style="position:absolute; inset:0; background:linear-gradient(transparent 70%, rgba(0,0,0,0.3));"></div>
                
                <div style="position:absolute; bottom:4px; left:6px; z-index:2; display:flex; align-items:center; gap:6px; color:#fff; font-size:10px; text-shadow:0 1px 2px rgba(0,0,0,0.8);">
                  <div style="display:flex; align-items:center; gap:2px;">${G.biliPlay12} ${v.views}</div>
                  <div style="display:flex; align-items:center; gap:2px;">${G.biliDanmu12} ${v.danmu}</div>
                </div>
                <span style="position:absolute; bottom:4px; right:6px; z-index:2; color:#fff; font-size:10px; text-shadow:0 1px 2px rgba(0,0,0,0.8);">${v.time}</span>
              </div>
              
              <div style="padding:8px; flex:1; display:flex; flex-direction:column; justify-content:space-between;">
                <div style="font-size:13px; color:#222; font-weight:600; line-height:1.4; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; margin-bottom:8px; min-height:36px;">
                  ${esc(v.title)}
                </div>
                
                <div style="font-size:11px; color:#999; display:flex; justify-content:space-between; align-items:center;">
                  <div style="display:flex; align-items:center; gap:4px; max-width:80px;">
                    <span style="background:#f1f2f3; color:#9499a0; padding:1px 3px; border-radius:3px; font-size:10px; font-weight:700; flex:none;">UP</span>
                    <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${esc(v.up)}</span>
                  </div>
                  <div style="display:grid; place-items:center; padding:2px;">${G.biliDots}</div>
                </div>
              </div>

            </div>`;
          }).join("")}
      </div>
    </div>

    <div class="tabbar" style="background:#fff; border-top:0.5px solid #eee; display:flex; height:60px; padding-bottom:20px;">
      <button style="color:#fb7299; flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px; border:none; background:none;">
        ${G.biliTabHome}
        <small style="font-size:10px; font-weight:500;">首页</small>
      </button>
      <button onclick="toastDev()" style="color:#333; flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px; border:none; background:none;">
        ${G.biliTabFollow}
        <small style="font-size:10px; font-weight:500;">关注</small>
      </button>
      <div style="flex:1; display:flex; justify-content:center; position:relative; top:-12px;">
        <button onclick="toastDev()" style="width:52px; height:42px; background:#fb7299; border-radius:12px; display:grid; place-items:center; border:none; color:#fff;">
          ${G.biliTabPlus}
        </button>
      </div>
      <button onclick="toastDev()" style="color:#333; flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px; border:none; background:none;">
        ${G.biliTabBag}
        <small style="font-size:10px; font-weight:500;">会员购</small>
      </button>
      <button onclick="toastDev()" style="color:#333; flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px; border:none; background:none;">
        ${G.biliTabMe}
        <small style="font-size:10px; font-weight:500;">我的</small>
      </button>
    </div>`,
  };
};