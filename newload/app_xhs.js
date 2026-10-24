// ==========================================
// 📱 小红书模块 (app_xhs.js) - 独立版
// ==========================================
VIEWS.xhs = () => {
  const notes = [
    { title: "【赠】送一张今晚19:30宁波天然舞台纳歌演出票…", author: "Casualidad", likes: "132", cover: "linear-gradient(135deg, #ff9a9e, #fecfef)", isVideo: false },
    { title: "朔朔店长", author: "no name", likes: "6", cover: "linear-gradient(135deg, #a1c4fd, #c2e9fb)", isVideo: true },
    { title: "表现不好的人能被喷成筛子", author: "star侃球", likes: "98", cover: "linear-gradient(135deg, #84fab0, #8fd3f4)", isVideo: false },
    { title: "令人心动的Offer程序员季", author: "可不可以不工作", likes: "1278", cover: "linear-gradient(135deg, #fbc2eb, #a6c1ee)", isVideo: true },
  ];

  return {
    html: `
    <div class="scroll" style="background:#fff; padding-bottom:20px; padding-top:80px;">
      <div style="position:fixed; top:44px; left:0; right:0; background:#fff; z-index:10; display:flex; justify-content:center; align-items:center; height:36px; gap:30px; font-size:16px; color:#666;">
        <span>关注</span>
        <span style="font-weight:700; color:#111; font-size:17px; position:relative;">发现<span style="position:absolute; bottom:-6px; left:50%; transform:translateX(-50%); width:16px; height:3px; background:#ff2442; border-radius:2px;"></span></span>
        <span>杭州</span>
      </div>
      <div style="display:flex; gap:20px; padding:10px 16px; overflow-x:auto; white-space:nowrap; font-size:14px; color:#666; border-bottom:0.5px solid #f0f0f0;">
        <span style="font-weight:600; color:#111;">推荐</span>
        <span>视频</span>
        <span>直播</span>
        <span>热点</span>
        <span>短剧</span>
        <span>明星</span>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; padding:10px;">
        ${notes.map(n => `
          <div style="display:flex; flex-direction:column;">
            <div style="height:200px; background:${n.cover}; border-radius:12px; margin-bottom:8px; display:flex; align-items:center; justify-content:center; color:#fff; position:relative;">
               ${n.isVideo ? `<div style="width:30px; height:30px; background:rgba(0,0,0,0.4); border-radius:50%; display:grid; place-items:center; font-size:14px;">▶</div>` : '[ 笔记 ]'}
            </div>
            <div style="font-size:14px; color:#333; font-weight:600; line-height:1.3; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; margin-bottom:6px;">
              ${esc(n.title)}
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:auto; font-size:12px; color:#666;">
              <div style="display:flex; align-items:center; gap:4px;">
                <div style="width:16px; height:16px; border-radius:50%; background:#ddd;"></div>
                <span>${esc(n.author)}</span>
              </div>
              <span style="color:#999;">♡ ${n.likes}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="tabbar" style="background:#fff; border-top:0.5px solid #eee;">
      <button style="color:#111;"><span style="font-size:24px;">🏠</span><small>首页</small></button>
      <button style="color:#111;"><span style="font-size:24px;">🛍️</span><small>市集</small></button>
      <button><span style="font-size:32px; color:#ff2442;">➕</span></button>
      <button style="color:#111;"><span style="font-size:24px;">💬</span><small>消息</small></button>
      <button style="color:#111;"><span style="font-size:24px;">👤</span><small>我</small></button>
    </div>`,
  };
};