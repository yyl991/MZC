// ==========================================
// 📱 主屏幕自定义布局 (home_ui.js) - JS无缝驱动+点击换图版
// ==========================================

(function() {
  // 👇 在这里填入你想要交替旋转的所有图片路径，想加几张加几张 👇
  const musicImages = [
    "./data/music/大胖猫.jpg", 
    "./data/avatar/miantuan.jpg",   
    "./data/music/pangmao.jpg",    
    "./data/avatar/miantuan.jpg"
  ];
  let currentMusicImageIdx = 0; 

  // 👇 全局状态记录：记录当前的角度和上次计算的时间
  let globalVinylDeg = 0;
  let lastVinylTick = Date.now();
  let isVinylLoopRunning = false;

  const style = document.createElement('style');
  style.innerHTML = `
    /* 整体铺满网格 */
    .hgrid {
      position: absolute;
      top: 50px; 
      left: 12px;
      right: 12px;
      bottom: 100px; 
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: 0.85fr 0.85fr 1.1fr 1.1fr 1.1fr 1.1fr;
      gap: 2px 2px; 
      justify-items: center;
      align-items: center;
    }

    .wcal-wide, .wwx-dark, .w-music {
      box-sizing: border-box;
      overflow: hidden;
    }

    .app {
      width: 100%; 
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center; 
      gap: 2px;
    }
    
    .app .icon {
      position: relative;
      width: 95%; 
      max-width: 68px; 
      aspect-ratio: 1; 
      height: auto; 
      border-radius: 23%; 
      margin: 0 auto;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      flex-shrink: 0; 
    }

    .app .icon > .ic {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      overflow: hidden; 
    }

    .app .icon .app-icon-fallback,
    .app .icon img,
    .app .icon svg {
      width: 100% !important;
      height: 100% !important;
      object-fit: cover; 
      border-radius: inherit; 
    }

    .app .icon .bdg {
      position: absolute;
      top: -5px;
      right: -5px;
      min-width: 22px;
      height: 22px;
      padding: 0 6px;
      border-radius: 11px;
      background: #ff3b30;
      color: #fff;
      font-size: 13px;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10; 
    }

    .app .lbl {
      font-size: 11px;
      font-weight: 500;
      color: #fff;
      text-shadow: 0 1px 4px rgba(0, 0, 0, .5);
      white-space: nowrap;
    }

    /* ================= 大日历 ================= */
    .wcal-wide {
      grid-column: span 4;
      grid-row: span 2;
      width: 100%;
      height: 100%; 
      background: rgba(255, 255, 255, 0.96);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: 22px;
      padding: 12px 16px;
      display: flex;
      justify-content: space-between;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
      color: #000;
      text-align: left;
    }
    .wcal-wide .cal-left {
      display: flex;
      flex-direction: column;
      justify-content: center; 
      gap: 4px;
      flex: 1;
    }
    .wcal-wide .cal-top {
      display: flex;
      align-items: baseline;
      gap: 6px;
    }
    .wcal-wide .cal-day {
      font-size: 44px;
      font-weight: 400;
      line-height: 1;
      letter-spacing: -1.5px;
      color: #111;
    }
    .wcal-wide .cal-week {
      font-size: 15px;
      font-weight: 600;
      color: #ff3b30;
    }
    .wcal-wide .cal-events {
      font-size: 13px;
      color: #666;
    }
    .wcal-wide .cal-events .we {
      font-weight: 500;
      color: #111;
      padding-left: 6px;
      border-left: 3px solid #af52de;
      margin-top: 2px;
    }
    .wcal-wide .cal-events .we small {
      font-weight: 400;
      color: #999;
      margin-left: 6px;
    }
    
    .wcal-wide .cal-right {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: 8px;
      width: 52%; 
      gap: 4px;
    }
    .wcal-wide .cal-month-title {
      font-size: 13px;
      color: #ff3b30;
      font-weight: 600;
      width: 100%;
      text-align: left;
      padding-left: 2px;
    }
    .wcal-wide .mini-cal {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 2px 0; 
      font-size: 11px;
      text-align: center;
      width: 100%;
    }
    .wcal-wide .mini-cal span {
      width: 18px;
      height: 18px;
      line-height: 18px;
      color: #111;
      font-weight: 500;
      justify-self: center;
    }
    .wcal-wide .mini-cal span.dim { color: #999; font-weight: 400; }
    .wcal-wide .mini-cal span.today {
      background: #ff3b30;
      color: #fff;
      border-radius: 50%;
      font-weight: 600;
    }

    /* ================= 天气组件 ================= */
    .wwx-dark {
      grid-column: span 2;
      grid-row: span 2;
      width: 100%;
      aspect-ratio: 1 / 1.05; 
      background: linear-gradient(180deg, #5c6670, #3a4149);
      border-radius: 22px;
      padding: 12px;
      color: #fff;
      position: relative;
      text-align: left;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    }
    .wwx-dark .w-top { display: flex; justify-content: space-between; align-items: flex-start; }
    .wwx-dark .w-city { font-size: 13px; font-weight: 500; display: flex; align-items: center; gap: 2px; }
    .wwx-dark .w-temp { font-size: 42px; font-weight: 300; line-height: 1; letter-spacing: -1px; }
    .wwx-dark .w-desc { font-size: 12px; font-weight: 500; display: flex; align-items: center; gap: 4px; }
    .wwx-dark .w-range { font-size: 11px; font-weight: 500; margin-top: auto; display: flex; gap: 6px; }

    /* 小屏手机微调 */
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

  // 👇 后台隐形引擎：一直计算角度，无论页面怎么刷新
  function startVinylTicker() {
    if (isVinylLoopRunning) return;
    isVinylLoopRunning = true;
    
    function tick() {
      const bgm = document.getElementById('bgm');
      const spinner = document.getElementById('vinyl-spinner');
      const now = Date.now();
      const delta = now - lastVinylTick;
      lastVinylTick = now;
      
      // 如果音乐在播放，角度开始累加（6秒一圈 = 60度/秒）
      if (bgm && !bgm.paused) {
        globalVinylDeg = (globalVinylDeg + delta * 0.06) % 360;
      }
      
      // 如果有元素在页面上，立刻把最新的角度贴上去
      if (spinner) {
        spinner.style.transform = `rotate(${globalVinylDeg}deg)`;
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
      html += `<span class="${isToday ? 'today' : ''}">${d}</span>`;
    }
    return html;
  }

  // ==========================================
  // 👇 专属的黑胶唱片 UI 函数
  // ==========================================
  function getMusicWidgetHTML(isPlaying) {
    if (!document.getElementById('music-widget-style')) {
      const style = document.createElement('style');
      style.id = 'music-widget-style';
      style.innerHTML = `
        .w-music {
          grid-column: span 2;
          grid-row: span 2;
          width: 100%;
          aspect-ratio: 1 / 1.05; 
          background: rgba(255, 255, 255, 0.12); 
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 22px;
          display: flex;
          align-items: center;
          justify-content: center; 
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .vinyl-disc {
          position: relative;
          width: 250%; 
          aspect-ratio: 1; 
          border-radius: 50%;
          background: repeating-radial-gradient(
            circle,
            #111,
            #111 2px,
            #222 3px,
            #222 4px
          );
          box-shadow: 
            0 8px 25px rgba(0,0,0,0.6), 
            inset 0 0 15px rgba(0,0,0,0.9),
            inset 0 0 40px rgba(255,255,255,0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          transform: scale(1.2); 
        }

        .vinyl-spinner {
          width: 80%; 
          aspect-ratio: 1;
          border-radius: 50%;
          border: 1px solid #222;
          box-shadow: 0 0 10px rgba(0,0,0,0.8);
          overflow: hidden;
        }

        .vinyl-cover {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          border-radius: 50%;
        }

        .tonearm {
          position: absolute;
          top: 0;
          right: 0;
          width: 100%; 
          height: 100%;
          pointer-events: none;
          z-index: 5;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));
        }

        @media (max-width: 540px) {
          .w-music { border-radius: 20px; }
        }
      `;
      document.head.appendChild(style);
    }

    musicImages.forEach(src => { const img = new Image(); img.src = src; });

    return `
      <button class="widget w-music" onclick="event.stopPropagation(); toggleHomeMusic()">
        
        <div class="vinyl-disc">
          <div id="vinyl-spinner" class="vinyl-spinner" style="transform: rotate(${globalVinylDeg}deg);">
             <div id="vinyl-img" class="vinyl-cover" style="background-image: url('${musicImages[currentMusicImageIdx]}');"></div>
          </div>
        </div>

        <svg class="tonearm" viewBox="0 0 100 100">
          <circle cx="93" cy="7" r="4" fill="#777" />
          <circle cx="93" cy="7" r="2.2" fill="#ddd" />
          <circle cx="93" cy="7" r="1" fill="#333" />
          
          <path d="M 93 7 L 93 70 L 73 91" fill="none" stroke="#555" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M 93 7 L 93 70 L 73 91" fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
          
          <g transform="translate(72, 90) rotate(42)">
             <rect x="-1.75" y="0" width="3.5" height="7" rx="1" fill="#fff" />
             <rect x="-1.25" y="0" width="2.5" height="1.8" fill="#ccc" />
             <circle cx="0" cy="5.2" r="0.6" fill="#ff3b30" />
          </g>
        </svg>

      </button>
    `;
  }

  window.renderHome = function() {
    const bgm = document.getElementById('bgm');
    if (bgm) bgm.loop = false; 
    const isPlaying = bgm && !bgm.paused;

    const evs = events[15] || [];
    const evHTML = evs.length > 0 
      ? evs.map(x => `<div class="we">${esc(x)}<small>全天</small></div>`).join("") 
      : `<div style="color:#999;font-size:12px;">今天无日程</div>`;

    const musicHTML = getMusicWidgetHTML(isPlaying);

    const dockApps = ["wechat", "phone", "sms", "recorder"];

    HOME.innerHTML = `
      <div class="hgrid">
        
        <button class="widget wcal-wide" data-app="calendar" onclick="openApp('calendar',this)">
          <div class="cal-left">
            <div class="cal-top">
              <span class="cal-day">15</span>
              <span class="cal-week">${wdLong(2026, 11, 15).replace('星期', '周')}</span>
            </div>
            <div class="cal-events">${evHTML}</div>
          </div>
          <div class="cal-right">
            <div class="cal-month-title">11月</div>
            <div class="mini-cal">
              ${buildMiniCalHTML(2026, 11, 15)}
            </div>
          </div>
        </button>

        <button class="widget wwx-dark" data-app="weather" onclick="openApp('weather',this)">
          <div class="w-top">
            <div class="w-city">北京 <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg></div>
            <div style="font-size:16px;">${G.sun}</div>
          </div>
          <div>
            <div class="w-temp">18°</div>
            <div class="w-desc">大部晴朗</div>
          </div>
          <div class="w-range">
            <span>最高 21°</span>
            <span>最低 12°</span>
          </div>
        </button>

        ${appBtn("photos")}
        ${appBtn("mail")}
        ${appBtn("clock")}
        ${appBtn("notes")}

        ${appBtn("weibo")}
        ${appBtn("xianyu")}

        ${musicHTML}
        
        ${appBtn("bilibili")}
        ${appBtn("xhs")}
        
      </div>
      
      <div class="dock">
        ${dockApps.map(appBtn).join("")}
      </div>
    `;

    // 绑定音频结束自动切图的逻辑
    setTimeout(() => {
      const cover = document.getElementById('vinyl-img');
      const bgm = document.getElementById('bgm');
      if (bgm) {
        bgm.onended = () => {
          currentMusicImageIdx = (currentMusicImageIdx + 1) % musicImages.length;
          if (cover) cover.style.backgroundImage = `url('${musicImages[currentMusicImageIdx]}')`;
          bgm.currentTime = 0;
          bgm.play().catch(e => console.log("切歌播放被拦截", e));
        };
      }
    }, 50);

    // 启动后台计算时钟
    startVinylTicker();
  };

  // 👇 核心修改：每次点击时，先切图，再处理播放/暂停 👇
  // 👇 核心修改：暂停不换图，重新播放时才换图 👇
  window.toggleHomeMusic = function() {
    const bgm = document.getElementById('bgm');
    const cover = document.getElementById('vinyl-img');
    if (!bgm) return;

    if (bgm.paused) {
      // 1. 当前是暂停状态，即将播放 -> 此时换图
      currentMusicImageIdx = (currentMusicImageIdx + 1) % musicImages.length;
      if (cover) {
        cover.style.backgroundImage = `url('${musicImages[currentMusicImageIdx]}')`;
      }
      // 2. 播放音乐
      bgm.volume = 0.3; 
      bgm.play().catch(e => console.log("播放被拦截:", e));
    } else {
      // 当前是播放状态，即将暂停 -> 只暂停，不换图
      bgm.pause();
    }
  };

})();