// 预留应用界面
VIEWS.wechat = () => VIEWS.kakao();
VIEWS.sms = () => ({
  html:
    navHTML({ title: "短信", back: "主页", backFn: "closeApp()" }) +
    `<div class="scroll"><h1 class="lt">短信</h1><div class="group"><div class="row"><b style="flex:1">大麦</b><span class="muted">11/15</span></div><div class="row" style="font-size:15px">【局部宇宙】购买成功，订单号 PLACEHOLDER。</div></div></div>`,
});
VIEWS.weibo = () => ({
  html:
    navHTML({ title: "微博", back: "主页", backFn: "closeApp()" }) +
    `<div class="scroll"><h1 class="lt">小号 · 做数据</h1><div class="group"><div class="row"><b style="flex:1">超话签到</b><span class="muted">已签</span></div><div class="row"><b style="flex:1">今日转赞评</b><span class="muted">28/30</span></div><div class="row" style="font-size:15px">偷偷记录：今天也很想你。</div></div></div>`,
});
VIEWS.xianyu = () => ({
  html:
    navHTML({ title: "闲鱼", back: "主页", backFn: "closeApp()" }) +
    `<div class="scroll"><h1 class="lt">收周边</h1><div class="group"><div class="row"><span style="flex:1">占位 · 小卡</span><span class="muted">¥--</span></div><div class="row"><span style="flex:1">占位 · 应援物</span><span class="muted">¥--</span></div></div></div>`,
});
VIEWS.bilibili = () => ({
  html:
    navHTML({ title: "B站", back: "主页", backFn: "closeApp()" }) +
    `<div class="scroll"><h1 class="lt">点赞过的舞台</h1><div class="group"><div class="row"><span style="flex:1">占位 · 舞台直拍</span><span class="muted">❤</span></div><div class="row"><span style="flex:1">占位 · 练习室</span><span class="muted">❤</span></div></div></div>`,
});
VIEWS.xhs = () => ({
  html:
    navHTML({ title: "小红书", back: "主页", backFn: "closeApp()" }) +
    `<div class="scroll"><h1 class="lt">收藏</h1><div class="group"><div class="row"><span style="flex:1">占位 · 梦女向剪辑</span><span class="muted">收藏</span></div></div></div>`,
});
VIEWS.recorder = () => ({
  html:
    navHTML({ title: "录音", back: "主页", backFn: "closeApp()" }) +
    `<div class="scroll"><h1 class="lt">语音备忘录</h1><div class="group"><div class="row"><span style="flex:1">小恩恩唱歌</span><span class="muted">0:13</span></div><div class="row"><span style="flex:1">玻璃弹唱</span><span class="muted">0:21</span></div><div class="row"><span style="flex:1">🎧 穆祉丞动静</span><span class="muted">0:08</span></div></div></div>`,
});
VIEWS.privateAlbum = () => ({
  html:
    navHTML({ title: "私密相册", back: "照片", backFn: "back()" }) +
    `<div class="scroll"><h1 class="lt">私密相册</h1><div class="group" style="padding:16px"><div class="muted">占位内容 · 剪影/渐变</div></div></div>`,
});

const placeholderView = (title) => () => ({
  html:
    navHTML({ title: title, back: "主页", backFn: "closeApp()" }) +
    `<div class="scroll" style="display:flex;align-items:center;justify-content:center;height:80vh;color:#8e8e93;font-size:15px">暂无内容</div>`,
});
VIEWS.instagram = placeholderView("Instagram");
VIEWS.photos = placeholderView("照片");
VIEWS.mail = placeholderView("邮件");
VIEWS.weather = placeholderView("天气");
VIEWS.settings = placeholderView("设置");
VIEWS.maps = placeholderView("地图");
VIEWS.music = placeholderView("音乐");
VIEWS.safari = placeholderView("Safari");

// 微信的发现页
VIEWS.wx_discover = () => ({
  cls: "wx-list",
  html: `
  <div class="wx-head">
      <h1>发现</h1>
      <div class="wx-actions"></div>
  </div>
  <div class="wx-scroll" style="padding-top: 10px;">
      <div class="wx-item" onclick="alert('打开朋友圈')">
          <div class="wx-av" style="background:#fff; display:grid; place-items:center; color:#ff9f0a;"><svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg></div>
          <div class="wx-info"><div class="wx-name">朋友圈</div></div>
          <div class="wx-meta">${G.chevR}</div>
      </div>
      <div class="wx-item">
          <div class="wx-av" style="background:#fff; display:grid; place-items:center; color:#fa5151;"><svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg></div>
          <div class="wx-info"><div class="wx-name">视频号</div></div>
          <div class="wx-meta">${G.chevR}</div>
      </div>
      <div class="wx-item">
          <div class="wx-av" style="background:#fff; display:grid; place-items:center; color:#facb0a;"><svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg></div>
          <div class="wx-info"><div class="wx-name">看一看</div></div>
          <div class="wx-meta">${G.chevR}</div>
      </div>
  </div>
  <div class="wx-tabbar">
      <button onclick="back()"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 4C7 4 3 7.1 3 11c0 2.4 1.5 4.5 3.9 5.8L6 20.5l4-2.4c.6.1 1.3.1 2 .1 5 0 9-3.1 9-7.1S17 4 12 4Z"/></svg></span><small>微信</small></button>
      <button><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg></span><small>通讯录</small></button>
      <button class="on" onclick="push('wx_discover')"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5Z"/></svg></span><small>发现</small></button>
      <button><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="7" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg></span><small>我</small></button>
  </div>`,
});
