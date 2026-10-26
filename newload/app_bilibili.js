// ==========================================
// 📱 B站模块 (app_bilibili.js) - 像素级复刻终极版
// ==========================================

VIEWS.bilibili = () => {
  const topCoverStyle =
    "background: url('https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1000&auto=format&fit=crop') center/cover;";
  
  const videos = [
    {
      title: "连出道首舞台都不行的根本不是帽女",
      up: "Jeninini_",
      views: "34.1万",
      danmu: "1539",
      time: "09:32",
      type: "link",
      url: "https://www.bilibili.com/",
      coverType: "web_img",
      coverSrc: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=500&auto=format&fit=crop",
    },
    {
      title: "EP2：小猪背后看看左边看看，我们颜色咋不一样捏",
      up: "好眠_Aurora",
      views: "634",
      danmu: "2",
      time: "03:39",
      type: "link",
      url: "https://www.bilibili.com/",
      coverType: "web_img",
      coverSrc: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=500&auto=format&fit=crop",
    },
    {
      title: "卡门：地区限定摄政王",
      up: "奇奇怪怪的英专生",
      views: "13.1万",
      danmu: "330",
      time: "05:14",
      type: "local",
      video: "./data/chat/1.mp4",
      coverType: "video",
    },
    {
      title: "【大脑里的能量战争】越休息越累的原因找到",
      up: "脑洞大开",
      views: "78.1万",
      danmu: "168",
      time: "12:00",
      type: "link",
      url: "https://www.bilibili.com/",
      coverType: "gradient",
      cover: "linear-gradient(135deg, #43e97b, #38f9d7)",
    },
    {
      title: "自制猫猫头！萌化了",
      up: "喵喵教教主",
      views: "11.2万",
      danmu: "420",
      time: "01:15",
      type: "link",
      url: "https://www.bilibili.com/",
      coverType: "web_img",
      coverSrc: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=500&auto=format&fit=crop",
    },
    {
      title: "深夜放毒：一碗完美的拉面",
      up: "食神小当家",
      views: "55.3万",
      danmu: "890",
      time: "08:20",
      type: "local",
      video: "./data/chat/1.mp4",
      coverType: "video",
    },
  ];

  return {
    html: `
    <div class="scroll" style="background:#f4f4f4; padding-top:0; padding-bottom:70px;">
      
      <!-- 顶部搜索栏 (补充了左下角的小闪电、游戏手柄、带红点的邮件) -->
      <div style="padding:54px 16px 10px; background:#fff; display:flex; align-items:center; gap:12px; position:sticky; top:0; z-index:10;">
        <div onclick="toastDev()" style="width:36px; height:36px; border-radius:50%; background:#ccc; flex:none; overflow:visible; position:relative;">
          ${typeof CFG !== "undefined" && CFG.myAvatar ? `<img src="${CFG.myAvatar}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">` : ""}
          <!-- 头像左下角的小闪电 -->
          <div style="position:absolute; bottom:-2px; left:-4px; width:16px; height:16px; background:#fff; border-radius:50%; display:grid; place-items:center; border:1px solid #eee;">
            <svg viewBox="0 0 24 24" width="10" height="10" fill="#fb7299"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          </div>
        </div>
        
        <div onclick="toastDev()" style="flex:1; background:#fff; border:1px solid #ccc; border-radius:18px; height:34px; display:flex; align-items:center; padding:0 12px; font-size:13.5px; color:#333; gap:6px;">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          王楚淇解说 · 18小时...
        </div>
        
        <!-- 游戏手柄 -->
        <div onclick="toastDev()" style="width:28px; height:28px; display:grid; place-items:center; flex:none; color:#111;">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="4"/><path d="M6 12h4m-2-2v4M15 11h.01M18 13h.01"/></svg>
        </div>
        
        <!-- 消息 (带红点) -->
        <div onclick="toastDev()" style="width:28px; height:28px; display:grid; place-items:center; flex:none; color:#111; position:relative;">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          <div style="position:absolute; top:0px; right:2px; width:6px; height:6px; background:#ff5d5d; border-radius:50%;"></div>
        </div>
      </div>

      <!-- 分类导航 (末尾加了汉堡菜单) -->
      <div style="background:#fff; padding:10px 16px; display:flex; gap:20px; font-size:15px; color:#333; overflow-x:auto; border-bottom:0.5px solid #eee; scrollbar-width:none; align-items:center;">
        <span onclick="toastDev()">直播</span>
        <span style="font-weight:700; color:#fb7299; position:relative;">推荐<span style="position:absolute; bottom:-6px; left:50%; transform:translateX(-50%); width:16px; height:3px; background:#fb7299; border-radius:2px;"></span></span>
        <span onclick="toastDev()">热门</span>
        <span onclick="toastDev()">动画</span>
        <span onclick="toastDev()">影视</span>
        <span onclick="toastDev()">S16</span>
        <span onclick="toastDev()">新</span>
        <div style="margin-left:auto; display:flex; align-items:center;">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </div>
      </div>

      <!-- 顶部大卡片 (根据截图：图片在上方，播放/弹幕在图片左下角，标题在下方) -->
      <div style="padding:10px 8px;">
        <div onclick="event.stopPropagation(); window.open('https://www.bilibili.com/video/BV1cgTV6bEru/', '_blank')" style="background:#fff; border-radius:8px; overflow:hidden; cursor:pointer;">
          <!-- 图片容器 -->
          <div style="height:200px; ${topCoverStyle} position:relative;">
            <div style="position:absolute; inset:0; background:linear-gradient(transparent 60%, rgba(0,0,0,0.4));"></div>
            <!-- 左下角 播放量 & 弹幕 -->
            <div style="position:absolute; bottom:6px; left:8px; display:flex; gap:10px; color:#fff; font-size:11px; font-weight:500; z-index:2; align-items:center;">
               <span style="display:flex; align-items:center; gap:2px;">
                 <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m10 9 5 3-5 3z" fill="currentColor"/></svg>
                 10.3万
               </span>
               <span style="display:flex; align-items:center; gap:2px;">
                 <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 9h4M7 13h8M7 17h5"/></svg>
                 262
               </span>
            </div>
            <!-- 右下角 时长 -->
            <span style="position:absolute; bottom:6px; right:8px; color:#fff; font-size:11px; text-shadow:0 1px 2px rgba(0,0,0,0.8); z-index:2;">3:43</span>
          </div>
          <!-- 标题区 -->
          <div style="padding:10px 12px; display:flex; justify-content:space-between; align-items:flex-start; gap:10px;">
            <div style="font-size:15px; font-weight:600; color:#111; line-height:1.4;">曼联献礼巴佩梅开二度，足球圈齐贺王楚淇南瓜大婚</div>
            <div style="display:flex; flex-direction:column; align-items:center; color:#999;">
               <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
               <span style="font-size:10px; margin-top:2px;">4131</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 瀑布流网格 -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; padding:0 8px;">
        ${videos
          .map((v) => {
            let coverHTML = "";
            if (v.coverType === "video") {
              coverHTML = `<video src="${v.video}" muted preload="metadata" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; pointer-events:none;"></video><div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); z-index:2; width:32px; height:32px; background:rgba(0,0,0,0.5); border-radius:50%; display:grid; place-items:center; color:#fff;"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style="margin-left:2px;"><path d="M7 4.5v15l12.5-7.5Z"/></svg></div>`;
            } else if (v.coverType === "local_img" || v.coverType === "web_img") {
              coverHTML = `<img src="${v.coverSrc}" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; pointer-events:none;">`;
            } else {
              coverHTML = `<div style="position:absolute; inset:0; background:${v.cover};"></div>`;
            }
            
            return `
            <div style="background:#fff; border-radius:8px; overflow:hidden; cursor:pointer; display:flex; flex-direction:column;" onclick="event.stopPropagation(); if('${v.type}'==='link'){window.open('${v.url}', '_blank');} else {openMediaViewer(['${v.video}'], 0);}">
              
              <!-- 封面 -->
              <div style="height:110px; position:relative; width:100%;">
                ${coverHTML}
                <div style="position:absolute; inset:0; background:linear-gradient(transparent 70%, rgba(0,0,0,0.3));"></div>
                
                <!-- 👇 修正：把播放量和弹幕放回左下角 -->
                <div style="position:absolute; bottom:4px; left:6px; z-index:2; display:flex; align-items:center; gap:6px; color:#fff; font-size:10px; text-shadow:0 1px 2px rgba(0,0,0,0.8);">
                  <div style="display:flex; align-items:center; gap:2px;">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m10 9 5 3-5 3z" fill="currentColor"/></svg>
                    ${v.views}
                  </div>
                  <div style="display:flex; align-items:center; gap:2px;">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 9h4M7 13h8M7 17h5"/></svg>
                    ${v.danmu}
                  </div>
                </div>
                <!-- 右下角时长 -->
                <span style="position:absolute; bottom:4px; right:6px; z-index:2; color:#fff; font-size:10px; text-shadow:0 1px 2px rgba(0,0,0,0.8);">${v.time}</span>
              </div>
              
              <!-- 标题与UP主 -->
              <div style="padding:8px; flex:1; display:flex; flex-direction:column; justify-content:space-between;">
                <div style="font-size:13px; color:#222; font-weight:600; line-height:1.4; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; margin-bottom:8px; min-height:36px;">
                  ${esc(v.title)}
                </div>
                
                <!-- 底部 UP 信息区 -->
                <div style="font-size:11px; color:#999; display:flex; justify-content:space-between; align-items:center;">
                  <div style="display:flex; align-items:center; gap:4px; max-width:80px;">
                    <!-- UP 小方块 -->
                    <span style="background:#f1f2f3; color:#9499a0; padding:1px 3px; border-radius:3px; font-size:10px; font-weight:700; flex:none;">UP</span>
                    <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${esc(v.up)}</span>
                  </div>
                  <!-- 右侧的三个点 -->
                  <div style="display:grid; place-items:center; padding:2px;">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>
                  </div>
                </div>
              </div>

            </div>`;
          })
          .join("")}
      </div>
    </div>

    <!-- 底部 Tabbar (精准复刻原图形状) -->
    <div class="tabbar" style="background:#fff; border-top:0.5px solid #eee; display:flex; height:60px; padding-bottom:20px;">
      
      <!-- 首页 (粉色房子内带笑脸) -->
      <button style="color:#fb7299; flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px; border:none; background:none;">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
          <path d="M9 15c.8 1 2.2 1 3 0" stroke-width="1.5"/>
          <circle cx="9" cy="12" r="0.5" fill="currentColor"/>
          <circle cx="15" cy="12" r="0.5" fill="currentColor"/>
        </svg>
        <small style="font-size:10px; font-weight:500;">首页</small>
      </button>
      
            <!-- 关注 (小风车) -->
      <button onclick="toastDev()" style="color:#333; flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px; border:none; background:none;">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
           <path d="M12 12V4a4 4 0 0 1 4-4 4 4 0 0 1 4 4c0 2.2-1.8 4-4 4h-4z" />
           <path d="M12 12h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4c-2.2 0-4-1.8-4-4v-4z" />
           <path d="M12 12v8a4 4 0 0 1-4 4 4 4 0 0 1-4-4c0-2.2 1.8-4 4-4h4z" />
           <path d="M12 12H4a4 4 0 0 1-4-4 4 4 0 0 1 4-4c2.2 0 4 1.8 4 4v4z" />
        </svg>
        <small style="font-size:10px; font-weight:500;">关注</small>
      </button>

      <!-- 加号按钮 (粉色大圆角方块) -->
      <div style="flex:1; display:flex; justify-content:center; position:relative; top:-12px;">
        <button onclick="toastDev()" style="width:52px; height:42px; background:#fb7299; border-radius:12px; display:grid; place-items:center; border:none; color:#fff;">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
        </button>
      </div>

      <!-- 会员购 (购物袋带"购"字) -->
      <button onclick="toastDev()" style="color:#333; flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px; border:none; background:none;">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 6h12l2 15H4L6 6z"/>
          <path d="M9 6V4a3 3 0 0 1 6 0v2"/>
          <text x="12" y="16" font-size="9" fill="currentColor" text-anchor="middle" font-weight="bold" stroke="none">购</text>
        </svg>
        <small style="font-size:10px; font-weight:500;">会员购</small>
      </button>

      <!-- 我的 (小电视机) -->
      <button onclick="toastDev()" style="color:#333; flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px; border:none; background:none;">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="7" width="18" height="14" rx="3"/>
          <path d="M8 3l4 4 4-4"/>
          <line x1="9" y1="12" x2="9.01" y2="12" stroke-width="3"/>
          <line x1="15" y1="12" x2="15.01" y2="12" stroke-width="3"/>
        </svg>
        <small style="font-size:10px; font-weight:500;">我的</small>
      </button>
    </div>`,
  };
};