// ==========================================
// 📱 B站模块 (app_bilibili.js)
// ==========================================
VIEWS.bilibili = () => {
  // 👈 把大图背景换成了本地的 bili1.jpg
  const topCoverStyle = "background: url('./data/bili/bili1.jpg') center/cover;";
  
  // 👈 下面的视频流数据，按你要求的顺序：P2, P3, P5, P4
  const videos = [
    { 
      title: "穆百草，就是现在！", 
      up: "Chanen响铃卷", 
      views: "19.2万", 
      danmu: "90", 
      time: "00:27", 
      type: "link", 
      url: "https://www.bilibili.com/video/BV1hCypBtEda/", 
      coverType: "local_img", 
      coverSrc: "./data/bili/bili2.jpg" 
    },
    { 
      title: "天啊！内娱竟然还有表情管理这么牛逼的练习生吗！？", 
      up: "小歪煮茶叶蛋", 
      views: "32.4万", 
      danmu: "560", 
      time: "00:27", 
      type: "link", 
      url: "https://www.bilibili.com/video/BV1bV411L7J3/", 
      coverType: "local_img", 
      coverSrc: "./data/bili/bili3.jpg" 
    },
    { 
      title: "穆祉丞：我跃迁走了，下个轮回见！期待这个朝鲜族金元勋", 
      up: "我爱祉丞", 
      views: "1.5万", 
      danmu: "1", 
      time: "01:58", 
      type: "link", 
      url: "https://www.bilibili.com/video/BV1R9M365ETV/", 
      coverType: "local_img", 
      coverSrc: "./data/bili/bili5.jpg" 
    },
    { 
      title: "【穆祉丞】倒霉熊不是停播了吗", 
      up: "我零食呢_", 
      views: "3.1万", 
      danmu: "14", 
      time: "00:14", 
      type: "link", 
      url: "https://www.bilibili.com/video/BV18rWCzmEEh/", 
      coverType: "local_img", 
      coverSrc: "./data/bili/bili4.jpg" 
    }
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
          ${G.biliSearch} TF_ING · 2小时...
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

      <!-- 👇 顶部大图推荐位 -->
      <div style="padding:10px 8px;">
        <div onclick="event.stopPropagation(); window.open('https://www.bilibili.com/video/BV1cgTV6bEru/', '_blank')" style="background:#fff; border-radius:8px; overflow:hidden; cursor:pointer;">
          <div style="height:200px; ${topCoverStyle} position:relative;">
            <div style="position:absolute; inset:0; background:linear-gradient(transparent 60%, rgba(0,0,0,0.4));"></div>
            <div style="position:absolute; bottom:6px; left:8px; display:flex; gap:10px; color:#fff; font-size:11px; font-weight:500; z-index:2; align-items:center;">
               <span style="display:flex; align-items:center; gap:2px;">${G.biliPlay14} 106.8万</span>
               <span style="display:flex; align-items:center; gap:2px;">${G.biliDanmu14} 2.3万</span>
            </div>
            <span style="position:absolute; bottom:6px; right:8px; color:#fff; font-size:11px; text-shadow:0 1px 2px rgba(0,0,0,0.8); z-index:2;">04:22</span>
          </div>
          <div style="padding:10px 12px; display:flex; justify-content:space-between; align-items:flex-start; gap:10px;">
            <div style="font-size:15px; font-weight:600; color:#111; line-height:1.4;">[4K]260628 穆祉丞-Carnival (COVER)三机位…</div>
            <div style="display:flex; flex-direction:column; align-items:center; color:#999;">
               ${G.biliLike16}
               <span style="font-size:10px; margin-top:2px;">点赞</span>
            </div>
          </div>
          <!-- 补上原图里的 UP 主和日期 -->
          <div style="padding:0 12px 10px; font-size:11px; color:#999; display:flex; align-items:center; gap:4px;">
             <span style="border:1px solid #ccc; border-radius:2px; padding:0 2px; font-size:10px;">UP</span> unlock-穆祉丞 · 6月29日
          </div>
        </div>
      </div>

      <!-- 👇 下方双列视频流 -->
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