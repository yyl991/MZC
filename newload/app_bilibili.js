// ==========================================
// 📱 B站模块 (app_bilibili.js) - 独立版
// ==========================================
VIEWS.bilibili = () => {
  const videos = [
    { title: "连出道首舞台都不行的根本不是帽女", up: "Jeninini_", views: "34.1万", danmu: "1539", time: "09:32", cover: "linear-gradient(135deg, #667eea, #764ba2)" },
    { title: "EP2：小猪背后看看左边看看，我们颜色咋不一样捏", up: "好眠_Aurora", views: "634", danmu: "2", time: "03:39", cover: "linear-gradient(135deg, #4facfe, #00f2fe)" },
    { title: "卡门：地区限定摄政王", up: "奇奇怪怪的英专生", views: "13.1万", danmu: "330", time: "05:14", cover: "linear-gradient(135deg, #f093fb, #f5576c)" },
    { title: "【大脑里的能量战争】越休息越累的原因找到", up: "脑洞大开", views: "78.1万", danmu: "168", time: "12:00", cover: "linear-gradient(135deg, #43e97b, #38f9d7)" },
  ];

  return {
    html: `
    <div class="scroll" style="background:#f4f4f4; padding-bottom:20px;">
      <div style="padding:54px 16px 10px; background:#fff; display:flex; align-items:center; gap:12px; position:sticky; top:0; z-index:10;">
        <div style="width:32px; height:32px; border-radius:50%; background:#ccc; flex:none;"></div>
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
      <div style="padding:10px 8px;">
        <div style="height:200px; background:linear-gradient(45deg, #2b5876, #4e4376); border-radius:12px; position:relative; display:flex; align-items:flex-end; padding:12px;">
          <div style="font-size:18px; font-weight:700; color:#fff; text-shadow:0 1px 3px rgba(0,0,0,0.5);">3天2晚深入斐济赶海，只为挑战米级大马…</div>
          <div style="position:absolute; bottom:8px; right:8px; display:flex; gap:4px;">
            <span style="width:6px; height:6px; border-radius:50%; background:#fff;"></span>
            <span style="width:6px; height:6px; border-radius:50%; background:rgba(255,255,255,0.5);"></span>
            <span style="width:6px; height:6px; border-radius:50%; background:rgba(255,255,255,0.5);"></span>
          </div>
        </div>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; padding:0 8px;">
        ${videos.map(v => `
          <div style="background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.08);">
            <div style="height:110px; background:${v.cover}; position:relative;">
               <span style="position:absolute; bottom:4px; right:4px; background:rgba(0,0,0,0.5); color:#fff; padding:1px 4px; border-radius:3px; font-size:10px;">${v.time}</span>
            </div>
            <div style="padding:8px;">
              <div style="font-size:13px; color:#222; font-weight:600; line-height:1.3; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; margin-bottom:6px; height:34px;">
                ${esc(v.title)}
              </div>
              <div style="font-size:11px; color:#999; display:flex; justify-content:space-between; align-items:center;">
                <span>UP：${esc(v.up)}</span>
                <span>▶ ${v.views} 💬 ${v.danmu}</span>
              </div>
            </div>
          </div>
        `).join('')}
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