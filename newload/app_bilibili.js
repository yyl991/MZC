// ==========================================
// 📱 B站模块 (app_bilibili.js) - 完美排版修复版
// ==========================================
VIEWS.bilibili = () => {
  // 顶部大图：用了一张漂亮的高清网图兜底
  const topCoverStyle = "background: url('https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1000&auto=format&fit=crop') center/cover;"; 

  const videos = [
    // 1. 网络图片封面 + 跳转外链
    { 
      title: "连出道首舞台都不行的根本不是帽女", up: "Jeninini_", views: "34.1万", danmu: "1539", time: "09:32", 
      type: "link", url: "https://www.bilibili.com/", 
      coverType: "web_img", coverSrc: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=500&auto=format&fit=crop" 
    },
    // 2. 网络图片封面 + 跳转外链
    { 
      title: "EP2：小猪背后看看左边看看，我们颜色咋不一样捏", up: "好眠_Aurora", views: "634", danmu: "2", time: "03:39", 
      type: "link", url: "https://www.bilibili.com/", 
      coverType: "web_img", coverSrc: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=500&auto=format&fit=crop" 
    },
    // 3. 本地视频直接抓第一帧作封面 + 全屏播放
    { 
      title: "卡门：地区限定摄政王", up: "奇奇怪怪的英专生", views: "13.1万", danmu: "330", time: "05:14", 
      type: "local", video: "./data/chat/1.mp4", 
      coverType: "video"
    },
    // 4. 纯渐变色兜底 + 跳转外链
    { 
      title: "【大脑里的能量战争】越休息越累的原因找到", up: "脑洞大开", views: "78.1万", danmu: "168", time: "12:00", 
      type: "link", url: "https://www.bilibili.com/", 
      coverType: "gradient", cover: "linear-gradient(135deg, #43e97b, #38f9d7)"
    },
    // 5. 网络图片封面 + 跳转外链
    { 
      title: "自制猫猫头！萌化了", up: "喵喵教教主", views: "11.2万", danmu: "420", time: "01:15", 
      type: "link", url: "https://www.bilibili.com/", 
      coverType: "web_img", coverSrc: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=500&auto=format&fit=crop" 
    },
    // 6. 本地视频直接抓第一帧作封面 + 全屏播放
    { 
      title: "深夜放毒：一碗完美的拉面", up: "食神小当家", views: "55.3万", danmu: "890", time: "08:20", 
      type: "local", video: "./data/chat/1.mp4", 
      coverType: "video"
    }
  ];

  return {
    html: `
    <!-- 👇 核心修复：底部留白增加到 100px，解决滑动不到底被 Tabbar 挡住的问题 -->
    <div class="scroll" style="background:#f4f4f4; padding-top:0; padding-bottom:100px;">
      <div style="padding:54px 16px 10px; background:#fff; display:flex; align-items:center; gap:12px; position:sticky; top:0; z-index:10;">
        <div style="width:32px; height:32px; border-radius:50%; background:#ccc; flex:none; overflow:hidden;">
  ${(typeof CFG !== 'undefined' && CFG.myAvatar) ? `<img src="${CFG.myAvatar}" style="width:100%; height:100%; object-fit:cover;">` : ''}
</div>
        <div style="flex:1; background:#f4f4f4; border-radius:16px; height:32px; display:flex; align-items:center; padding:0 12px; font-size:14px; color:#666;">
          🔍 接二连珊妄想症
        </div>
        <div style="width:32px; height:32px; border-radius:50%; background:#ffb300; display:grid; place-items:center; flex:none;">📪</div>
      </div>
      <div style="background:#fff; padding:10px 16px; display:flex; gap:20px; font-size:15px; color:#666; overflow-x:auto; border-bottom:0.5px solid #eee;">
        <span>直播</span>
        <span style="font-weight:700; color:#111; position:relative;">推荐<span style="position:absolute; bottom:-6px; left:50%; transform:translateX(-50%); width:16px; height:3px; background:#fb7299; border-radius:2px;"></span></span>
        <span>热门</span>
        <span>动画</span>
        <span>影视</span>
      </div>

      <!-- 顶部大图 -->
      <div style="padding:10px 8px;">
        <div onclick="event.stopPropagation(); window.open('https://www.bilibili.com/video/BV1cgTV6bEru/', '_blank')" 
             style="height:200px; ${topCoverStyle} border-radius:12px; position:relative; display:flex; align-items:flex-end; padding:12px; cursor:pointer; overflow:hidden;">
          <div style="position:absolute; inset:0; background:linear-gradient(transparent 40%, rgba(0,0,0,0.7));"></div>
          <div style="position:relative; z-index:2; font-size:18px; font-weight:700; color:#fff; text-shadow:0 1px 3px rgba(0,0,0,0.5);">
            点击播放：为你定制的专属视频
          </div>
        </div>
      </div>

      <!-- 👇 核心修复：确保 Grid 容器正确包裹所有卡片 -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; padding:0 8px;">
        ${videos.map(v => {
          let coverHTML = '';
          if (v.coverType === 'video') {
            coverHTML = `<video src="${v.video}" muted preload="metadata" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; pointer-events:none;"></video>
                         <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); z-index:2; width:30px; height:30px; background:rgba(0,0,0,0.5); border-radius:50%; display:grid; place-items:center; color:#fff; font-size:12px; padding-left:2px;">▶</div>`;
          } else if (v.coverType === 'local_img' || v.coverType === 'web_img') {
            coverHTML = `<img src="${v.coverSrc}" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; pointer-events:none;">`;
          } else {
            coverHTML = `<div style="position:absolute; inset:0; background:${v.cover};"></div>`;
          }

          return `
          <div style="background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.08); cursor:pointer; display:flex; flex-direction:column;" 
               onclick="event.stopPropagation(); if('${v.type}'==='link'){window.open('${v.url}', '_blank');} else {openMediaViewer(['${v.video}'], 0);}">
            
            <div style="height:110px; position:relative; width:100%;">
               ${coverHTML}
               <span style="position:absolute; bottom:4px; right:4px; z-index:2; background:rgba(0,0,0,0.5); color:#fff; padding:1px 4px; border-radius:3px; font-size:10px;">${v.time}</span>
            </div>
            
            <div style="padding:8px; flex:1; display:flex; flex-direction:column; justify-content:space-between;">
              <div style="font-size:13px; color:#222; font-weight:600; line-height:1.3; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; margin-bottom:6px; height:34px;">
                ${esc(v.title)}
              </div>
              <div style="font-size:11px; color:#999; display:flex; justify-content:space-between; align-items:center;">
                <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:60px;">UP：${esc(v.up)}</span>
                <span style="white-space:nowrap;">▶ ${v.views} 💬 ${v.danmu}</span>
              </div>
            </div>
            
          </div>
        `}).join('')}
      </div>
    </div>
    
    <div class="tabbar" style="background:#fff; border-top:0.5px solid #eee;">
      <button style="color:#fb7299;"><span style="font-size:24px;">🏠</span><small>首页</small></button>
      <button style="color:#111;"><span style="font-size:24px;">🎯</span><small>关注</small></button>
      <button><span style="font-size:32px; background:#fb7299; color:#fff; width:44px; height:32px; border-radius:16px; display:grid; place-items:center; font-weight:300;">+</span></button>
      <button style="color:#111;"><span style="font-size:24px;">🛒</span><small>会员购</small></button>
      <button style="color:#111;"><span style="font-size:24px;">👤</span><small>我的</small></button>
    </div>`,
  };
};