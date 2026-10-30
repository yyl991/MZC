// ==========================================
// 📱 主屏幕自定义布局 (home_ui.js) - 物理弹性回弹版
// ==========================================

(function() {
  // 👇 你的图片数组
  const musicImages = [
    "./data/music/pangmao1.jpg", 
    "./data/avatar/miantuan.jpg",   
    "./data/music/pangmao2.jpg",    
    "./data/avatar/miantuan.jpg"
  ];
  
  let currentMusicImageIdx = 0; 

  let globalVinylDeg = 0;
  let lastVinylTick = Date.now();
  let isVinylLoopRunning = false;

  // 定义基准大小
  const SIZE_PAUSE = 1.1;  // 暂停时的小尺寸
  const SIZE_PLAY = 1.2;   // 播放时的正常尺寸
  const SIZE_BOUNCE = 1.3; // 弹跳时的最大尺寸

  const style = document.createElement('style');
  style.innerHTML = `
    .hgrid {
      position: absolute; top: 50px; left: 12px; right: 12px; bottom: 100px; 
      display: grid; grid-template-columns: repeat(4, 1fr);
      grid-template-rows: 0.85fr 0.85fr 1.1fr 1.1fr 1.1fr 1.1fr;
      gap: 2px 2px; justify-items: center; align-items: center;
    }
    .wcal-wide, .wwx-dark, .w-music { box-sizing: border-box; overflow: hidden; }
    .app { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; }
    .app .icon { position: relative; width: 95%; max-width: 68px; aspect-ratio: 1; height: auto; border-radius: 23%; margin: 0 auto; box-shadow: 0 2px 8px rgba(0,0,0,0.1); flex-shrink: 0; }
    .app .icon > .ic { position: absolute; inset: 0; border-radius: inherit; overflow: hidden; }
    .app .icon .app-icon-fallback, .app .icon img, .app .icon svg { width: 100% !important; height: 100% !important; object-fit: cover; border-radius: inherit; }
    .app .icon .bdg { position: absolute; top: -5px; right: -5px; min-width: 22px; height: 22px; padding: 0 6px; border-radius: 11px; background: #ff3b30; color: #fff; font-size: 13px; font-weight: 500; display: flex; align-items: center; justify-content: center; z-index: 10; }
    .app .lbl { font-size: 11px; font-weight: 500; color: #fff; text-shadow: 0 1px 4px rgba(0, 0, 0, .5); white-space: nowrap; }

    .wcal-wide { grid-column: span 4; grid-row: span 2; width: 100%; height: 100%; background: rgba(255, 255, 255, 0.96); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-radius: 22px; padding: 12px 16px; display: flex; justify-content: space-between; box-shadow: 0 4px 16px rgba(0,0,0,0.1); color: #000; text-align: left; }
    .wcal-wide .cal-left { display: flex; flex-direction: column; justify-content: center; gap: 4px; flex: 1; }
    .wcal-wide .cal-top { display: flex; align-items: baseline; gap: 6px; }
    .wcal-wide .cal-day { font-size: 44px; font-weight: 400; line-height: 1; letter-spacing: -1.5px; color: #111; }
    .wcal-wide .cal-week { font-size: 15px; font-weight: 600; color: #ff3b30; }
    .wcal-wide .cal-events { font-size: 13px; color: #666; }
    .wcal-wide .cal-events .we { font-weight: 500; color: #111; padding-left: 6px; border-left: 3px solid #af52de; margin-top: 2px; }
    .wcal-wide .cal-events .we small { font-weight: 400; color: #999; margin-left: 6px; }
    .wcal-wide .cal-right { display: flex; flex-direction: column; justify-content: center; margin-left: 8px; width: 52%; gap: 4px; }
    .wcal-wide .cal-month-title { font-size: 13px; color: #ff3b30; font-weight: 600; width: 100%; text-align: left; padding-left: 2px; }
    .wcal-wide .mini-cal { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px 0; font-size: 11px; text-align: center; width: 100%; }
    .wcal-wide .mini-cal span { width: 18px; height: 18px; line-height: 18px; color: #111; font-weight: 500; justify-self: center; position: relative; }
    .wcal-wide .mini-cal span.dim { color: #999; font-weight: 400; }
    .wcal-wide .mini-cal span.today { background: #ff3b30; color: #fff; border-radius: 50%; font-weight: 600; }
    
    /* 👇 将小圆点颜色改成 #FDAFAB (橙色) */
    .wcal-wide .mini-cal span.has-event::after { content: ''; position: absolute; bottom: -1px; left: 50%; transform: translateX(-50%); width: 4px; height: 4px; background: #FDAFAB; border-radius: 50%; }

    .wwx-dark { grid-column: span 2; grid-row: span 2; width: 100%; aspect-ratio: 1 / 1.05; background: linear-gradient(180deg, #5c6670, #3a4149); border-radius: 22px; padding: 12px; color: #fff; position: relative; text-align: left; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
    .wwx-dark .w-top { display: flex; justify-content: space-between; align-items: flex-start; }
    .wwx-dark .w-city { font-size: 13px; font-weight: 500; display: flex; align-items: center; gap: 2px; }
    .wwx-dark .w-temp { font-size: 42px; font-weight: 300; line-height: 1; letter-spacing: -1px; }
    .wwx-dark .w-desc { font-size: 12px; font-weight: 500; display: flex; align-items: center; gap: 4px; }
    .wwx-dark .w-range { font-size: 11px; font-weight: 500; margin-top: auto; display: flex; gap: 6px; }

    @media (max-width: 540px) {
      .hgrid { top: 46px; bottom: 95px; gap: 4px 4px; grid-template-rows: 0.85fr 0.85fr 1.1fr 1.1fr 1.1fr 1.1fr; }
      .app .lbl { font-size: 10px; }
      .wcal-wide { padding: 10px 14px; border-radius: 20px; }
      .wcal-wide .cal-day { font-size: 40px; }
      .wwx-dark .w-temp { font-size: 38px; }
      .wwx-dark { border-radius: 20px; }
    }
  `;
  document.head.appendChild(style);

  function startVinylTicker() {
    if (isVinylLoopRunning) return;
    isVinylLoopRunning = true;
    
    function tick() {
      if (typeof view !== 'undefined' && view !== "home") {
        requestAnimationFrame(tick);
        return; 
      }

      const bgm = document.getElementById('bgm');
      const spinner = document.getElementById('vinyl-spinner');
      
      if (bgm && !bgm.paused) {
        const now = Date.now();
        const delta = now - lastVinylTick;
        lastVinylTick = now;
        globalVinylDeg = (globalVinylDeg + delta * 0.06) % 360;
        if (spinner) {
          spinner.style.transform = `rotate(${globalVinylDeg}deg)`;
        }
      } else {
        lastVinylTick = Date.now();
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function buildMiniCalHTML(year, month, todayDate) {
    const firstDay = new Date(year, month - 1, 1).getDay(); 
    const daysInMonth = new Date(year, month, 0).getDate();
    let html = `<span class="dim">日</span><span class="dim">一</span><span class="dim">二</span><span class="dim">三</span><span class="dim">四</span><span class="dim">五</span><span class="dim">六</span>`;
    for (let i = 0; i < firstDay; i++) html += `<span></span>`;
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = (d === todayDate && month === 11);
      
      // 判断该日是否有日程（支持 events 数据或 11 月 16 号默认触发）
      const hasEv = (typeof events !== 'undefined' && events[d] && events[d].length > 0) || (d === 16 && month === 11);
      
      html += `<span class="${isToday ? 'today' : ''} ${hasEv ? 'has-event' : ''}">${d}</span>`;
    }
    return html;
  }

  function getMusicWidgetHTML(isPlaying) {
    if (!document.getElementById('music-widget-style')) {
      const style = document.createElement('style');
      style.id = 'music-widget-style';
      style.innerHTML = `
        .w-music { 
          grid-column: span 2; grid-row: span 2; width: 100%; aspect-ratio: 1 / 1.05; 
          background: rgba(255, 255, 255, 0.12); 
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); 
          border-radius: 22px; display: flex; align-items: center; justify-content: center; 
          box-shadow: 0 4px 15px rgba(0,0,0,0.08); cursor: pointer; position: relative; overflow: hidden; 
        }
        .w-music:active { transform: none !important; filter: none !important; }

        .vinyl-disc { 
          position: relative; width: 250%; aspect-ratio: 1; border-radius: 50%; 
          background: repeating-radial-gradient(circle, #111, #111 2px, #222 3px, #222 4px); 
          box-shadow: 0 8px 25px rgba(0,0,0,0.6), inset 0 0 15px rgba(0,0,0,0.9), inset 0 0 40px rgba(255,255,255,0.05); 
          display: flex; align-items: center; justify-content: center; 
          /* 👇 保底过渡，用于消息重绘时防跳变 */
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); 
        }
        .vinyl-spinner { 
          width: 80%; aspect-ratio: 1; border-radius: 50%; border: 1px solid #222; 
          box-shadow: 0 0 10px rgba(0,0,0,0.8); overflow: hidden; position: relative; 
        }
        .vinyl-cover-layer { 
          position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; border-radius: 50%; 
          transition: opacity 0.4s ease-in-out; pointer-events: none; 
        }
        .tonearm { position: absolute; top: 0; right: 0; width: 100%; height: 100%; pointer-events: none; z-index: 5; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4)); }
        @media (max-width: 540px) { .w-music { border-radius: 20px; } }
      `;
      document.head.appendChild(style);
    }

    musicImages.forEach(src => {
      const img = new Image(); img.src = src; if (img.decode) img.decode().catch(() => {});
    });

    const showIdx = currentMusicImageIdx % 2;
    const hideIdx = (currentMusicImageIdx + 1) % 2;
    const currentSrc = musicImages[currentMusicImageIdx];
    const nextSrc = musicImages[(currentMusicImageIdx + 1) % musicImages.length];
    
    // 根据是否播放，决定初始尺寸
    const discScale = isPlaying ? SIZE_PLAY : SIZE_PAUSE;
    
    return `
      <button class="widget w-music" onclick="event.stopPropagation(); toggleHomeMusic()">
        <div class="vinyl-disc" id="vinyl-disc-wrap" style="transform: scale(${discScale});">
          <div id="vinyl-spinner" class="vinyl-spinner" style="transform: rotate(${globalVinylDeg}deg);">
             <img id="vinyl-img-${showIdx}" class="vinyl-cover-layer" src="${currentSrc}" style="opacity: 1;">
             <img id="vinyl-img-${hideIdx}" class="vinyl-cover-layer" src="${nextSrc}" style="opacity: 0;">
          </div>
        </div>

        ${G.vinylTonearm}
      </button>
    `;
  }

  window.renderHome = function() {
    const bgm = document.getElementById('bgm');
    if (bgm) bgm.loop = false; 
    const isPlaying = bgm && !bgm.paused;

    // 👇 获取今天和明天的日程
    const evsToday = events[15] || [];
    const evsTomorrow = events[16] || ["🎂 穆祉丞生日"]; // 确保明天一定有生日

    // 👇 删掉了没有日程时的默认提示文案，直接为空
    let evHTML = evsToday.map(x => `<div class="we">${esc(x)}<small>全天</small></div>`).join("");
    
    // 👇 将明天的生日加在下面，边框颜色改成 #FDAFAB (橙色)
    evHTML += evsTomorrow.map(x => `<div class="we" style="border-left-color:#FDAFAB">${esc(x)}<small>明天</small></div>`).join("");

    const musicHTML = getMusicWidgetHTML(isPlaying);
    const dockApps = ["wechat", "phone", "sms", "recorder"];

    HOME.innerHTML = `
      <div class="hgrid">
        <button class="widget wcal-wide" data-app="calendar" onclick="openApp('calendar',this)">
          <div class="cal-left">
            <div class="cal-top"><span class="cal-day">15</span><span class="cal-week">${wdLong(2026, 11, 15).replace('星期', '周')}</span></div>
            <div class="cal-events">${evHTML}</div>
          </div>
          <div class="cal-right"><div class="cal-month-title">11月</div><div class="mini-cal">${buildMiniCalHTML(2026, 11, 15)}</div></div>
        </button>

               <button class="widget wwx-dark" data-app="weather" onclick="openApp('weather',this)" style="position: relative; overflow: hidden;">
          
          <!-- 👇 右上角超大 Emoji -->
          <div style="position: absolute; top: 30px; right: 0px; font-size: 90px; line-height: 1;">🌨️</div>
          
          <div style="font-size: 18px; font-weight: 500; margin-bottom: 2px; position: relative; z-index: 1;">北京</div>
          
          <div style="font-size: 64px; font-weight: 200; line-height: 1; letter-spacing: -1.5px; margin-top: 4px; margin-bottom: 2px; position: relative; z-index: 1;">0°</div>
          
          <div style="font-size: 17px; font-weight: 500; margin-top: 2px; margin-bottom: auto; position: relative; z-index: 1;">阴转小雪</div>
          
          <!-- 底部最高最低，结合 15 号的真实历史天气 -->
          <div style="display: flex; gap: 12px; align-items: flex-end; margin-top: 8px; position: relative; z-index: 1;">
            <div style="display: flex; align-items: flex-end;">
              <div style="font-size: 11px; line-height: 1.1; margin-right: 3px; opacity: 0.9; margin-bottom: 2px;">最<br>高</div>
              <div style="font-size: 22px; font-weight: 400; line-height: 1;">2°</div>
            </div>
            <div style="display: flex; align-items: flex-end;">
              <div style="font-size: 11px; line-height: 1.1; margin-right: 3px; opacity: 0.9; margin-bottom: 2px;">最<br>低</div>
              <div style="font-size: 22px; font-weight: 400; line-height: 1;">-3°</div>
            </div>
          </div>
        </button>
        ${appBtn("photos")}${appBtn("mail")}${appBtn("clock")}${appBtn("notes")}
        ${appBtn("weibo")}${appBtn("xianyu")}
        ${musicHTML}
        ${appBtn("bilibili")}${appBtn("xhs")}
      </div>
      <div class="dock">${dockApps.map(appBtn).join("")}</div>
    `;

    // 绑定音频结束自动切图
    setTimeout(() => {
      const bgm = document.getElementById('bgm');
      if (bgm) {
        bgm.onended = () => {
          switchVinylImage(true);
          bgm.currentTime = 0;
          bgm.play().catch(e => console.log("切歌播放被拦截", e));
        };
      }
    }, 50);

    startVinylTicker();
  };

  function switchVinylImage(isNext = true) {
    if (musicImages.length < 1) return;
    
    if (isNext) {
      currentMusicImageIdx = (currentMusicImageIdx + 1) % musicImages.length;
    }

    const showIdx = currentMusicImageIdx % 2;
    const hideIdx = (currentMusicImageIdx + 1) % 2;

    const showImg = document.getElementById(`vinyl-img-${showIdx}`);
    const hideImg = document.getElementById(`vinyl-img-${hideIdx}`);

    if (showImg && hideImg) {
      showImg.src = musicImages[currentMusicImageIdx];
      showImg.style.opacity = 1;
      hideImg.style.opacity = 0;
    }
  }  window.toggleHomeMusic = function() {
    const bgm = document.getElementById('bgm');
    const discWrap = document.getElementById("vinyl-disc-wrap");
    if (!bgm) return;

    // 👇 加上这把锁，告诉系统“我现在正在点唱片，别重绘”
    window.isVinylBusy = true; 

    if (bgm.paused) {
      if (discWrap) {
        discWrap.style.transition = 'none'; 
        discWrap.animate([
          { transform: `scale(${SIZE_PAUSE})`, offset: 0 },
          { transform: `scale(${SIZE_BOUNCE})`, offset: 0.4 },
          { transform: `scale(${SIZE_PLAY})`, offset: 1 }
        ], { duration: 300, easing: 'ease-out' }).onfinish = () => {
          discWrap.style.transform = `scale(${SIZE_PLAY})`;
          setTimeout(() => {
            discWrap.style.transition = 'transform 0.3s ease-out';
            window.isVinylBusy = false; // 👈 动画结束，解锁
          }, 50);
        };
      }
      switchVinylImage(true);
      bgm.volume = 1.0; 
      bgm.play().catch(e => console.log("播放被拦截:", e));
    } else {
      if (discWrap) {
        discWrap.style.transition = 'none';
        discWrap.animate([
          { transform: `scale(${SIZE_PLAY})`, offset: 0 },
          { transform: `scale(${SIZE_BOUNCE})`, offset: 0.4 },
          { transform: `scale(${SIZE_PAUSE})`, offset: 1 }
        ], { duration: 300, easing: 'ease-out' }).onfinish = () => {
          discWrap.style.transform = `scale(${SIZE_PAUSE})`;
          setTimeout(() => {
            discWrap.style.transition = 'transform 0.3s ease-out';
            window.isVinylBusy = false; // 👈 动画结束，解锁
          }, 50);
        };
      }
      bgm.pause();
    }
  };

})();