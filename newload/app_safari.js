// ==========================================
// 🌐 Safari 浏览器模块 (app_safari.js)
// ==========================================
let searchHistory = [
  "穆祉丞 练习生 九年",
  "如何赶上生日零点",
  "中延大学 插班 学分",
  "20岁男生生日礼物"
];

VIEWS.safari = () => {
  if (safSearch) {
    return {
      cls: "saf",
      html: `
      <div style="position:absolute;top:54px;left:0;right:0;padding:6px 14px;display:flex;gap:12px;align-items:center;z-index:3">
        <div class="srch" style="margin:0;flex:1;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.08);height:40px">${G.search}<span style="color:#000">|</span><span>搜索或输入网站名称</span></div>
        <button style="color:var(--blue);font-size:17px" onclick="safSearch=false;show('safari')">取消</button>
      </div>
      <div class="scroll" style="padding-top:112px">
        <div style="display:flex;justify-content:space-between;margin:0 16px 8px">
          <b style="font-size:20px">最近搜索</b>
          <span style="color:var(--blue);cursor:pointer" onclick="searchHistory=[];show('safari')">清除</span>
        </div>
        <div class="group srec">
          ${searchHistory.map(s=>`<div class="row" style="--inset:44px">${G.clock.replace('<svg','<svg width="18" height="18" style="color:#8e8e93;flex:none"')}<span>${esc(s)}</span></div>`).join('')}
        </div>
      </div>`,
      init: pg => pg.querySelector('.srec')?.animate([{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'none'}],{duration:300})
    };
  }

  const fav = [
    ['门', '#2a5bd7'], ['教', '#1e8e5a'], ['图', '#8b5a2b'], 
    ['网', '#d9480f'], ['体', '#4b6cb7'], ['邮', '#5e5ce6'], 
    ['新', '#34c759'], ['地', '#ff9f0a']
  ];
  
  return {
    cls: "saf",
    html: `
    <div class="scroll">
      <div class="sh" style="font-size:22px">个人收藏</div>
      <div class="favs">
        ${fav.map(f=>`<div class="fav"><i style="color:${f[1]}">${f[0]}</i></div>`).join('')}
      </div>
      
      <div class="sh" style="font-size:22px;margin-top:28px">隐私报告</div>
      <div class="group" style="padding:14px 16px;display:flex;gap:12px;align-items:center;font-size:15px">
        <span style="font-size:26px">🛡️</span><span>过去 7 天，Safari 已阻止 14 个跟踪器分析你的个人资料。</span>
      </div>
      
      <div class="sh" style="font-size:22px;margin-top:28px">阅读列表</div>
      <div class="group"><div class="row muted" style="font-size:15px">阅读列表为空</div></div>
    </div>
    
        <div class="sbar">
      <button class="ad" style="width:100%" onclick="safSearch=true;show('safari')">
        <b>大小</b><span style="flex:1;text-align:center">搜索或输入网站名称</span>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></svg>
      </button>
      
      <div class="tb" style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px 34px;">
        <!-- 后退 (置灰) -->
        <svg viewBox="0 0 24 24" style="width:24px;height:24px;stroke:#c4c4c7;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;"><path d="m15 5-7 7 7 7"/></svg>
        <!-- 前进 (置灰) -->
        <svg viewBox="0 0 24 24" style="width:24px;height:24px;stroke:#c4c4c7;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;"><path d="m9 5 7 7-7 7"/></svg>
        <!-- 分享 -->
        <svg viewBox="0 0 24 24" style="width:24px;height:24px;stroke:var(--blue);fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;"><path d="M12 3v12M8 7l4-4 4 4"/><path d="M6 11v9h12v-9"/></svg>
        <!-- 书签 -->
        <svg viewBox="0 0 24 24" style="width:24px;height:24px;stroke:var(--blue);fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;"><path d="M4 5.5C6 4.5 9 4.5 12 6c3-1.5 6-1.5 8-.5V19c-2-1-5-1-8 .5-3-1.5-6-1.5-8-.5Z"/><path d="M12 6v13.5"/></svg>
        <!-- 标签页 -->
        <svg viewBox="0 0 24 24" style="width:24px;height:24px;stroke:var(--blue);fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;"><rect x="4" y="4" width="11" height="11" rx="2"/><path d="M9 20h9a2 2 0 0 0 2-2V9"/></svg>
      </div>
    </div>`
  };
};