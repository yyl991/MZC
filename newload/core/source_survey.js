// core/source_survey.js
// 「从哪里刷到的」来源调查弹窗（文案为占位，等作者给正式文案后替换 window.SRC_SURVEY）
// 设计要点：
//  - 只在 #screen 手机屏幕内弹，不遮状态栏外的真实页面
//  - 每台设备只弹一次（localStorage 标记），可随时重置
//  - 答案存本机 localStorage，并上报到独立 Supabase source_survey 表（与恩仔聊天 replies 表分开）
//  - ?dev=1&source=1（或任意 source=1）打开作者统计查看页，自动汇总各来源占比
"use strict";
(function () {
  var KEY = "mzc_source_survey";
  var ONCE = "mzc_source_survey_done";
  var surveyShown = false; // 本次会话是否已弹过（防止「点微博」与「5分钟兜底」重复弹）

  // ============ 可配置区：文案由作者后续提供，直接改这里 ============
  window.SRC_SURVEY = {
    enabled: true,
    // 触发：首次点开微博立即弹；若开局 5 分钟内没点过微博，到时兜底弹（两者互斥只弹一次）
    trigger: "weibo",
    fallbackMs: 5 * 60 * 1000,
    title: "所以想问一下各位小纸团到底是在哪里捡到这部手机的呢",
    body: "各位蛋蛋妈恩老公丞妻打扰一下，因为发不同平台基本都被限流了，后台浏览量一直不变，但是小游戏访问量莫名其妙一直在增加",
    options: ["微博", "小红书", "抖音", "ao3", "朋友分享", "其他"],
    // 选项配图（对应上面顺序），不放图则自动回退到彩色图标
    optionImages: [
      "./data/survey/wb.jpg", "./data/survey/xhs.jpg", "./data/survey/dy.jpg",
      "./data/survey/ao3.jpg", "./data/survey/py.jpg", "./data/survey/qt.jpg",
    ],
    otherPlaceholder: "其他来源（选填）",
    submitText: "就选这个",
    // 答完后的感谢页
    thanksTitle: "感谢你的回答",
    thanksBody: "请继续尽情玩弄恩恩吧（bushi",
    thanksImage: "./data/survey/thanks.jpg", // 把图片放到这个路径即可，找不到会自动隐藏不破图
    thanksAutoCloseMs: 2000, // 感谢页停留几毫秒后自动消失（作者预览页不自动关，方便看效果）
  };
  // ================================================================

  function escS(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function screenEl() {
    return document.getElementById("screen") || document.body;
  }
  function nowStr() {
    try { return new Date().toLocaleString("zh-CN", { hour12: false }); } catch (e) { return "—"; }
  }
  function readArr() {
    try {
      var a = JSON.parse(localStorage.getItem(KEY) || "[]");
      return Array.isArray(a) ? a : [];
    } catch (e) { return []; }
  }
  function writeArr(a) {
    try {
      while (a.length > 500) a.shift();
      localStorage.setItem(KEY, JSON.stringify(a));
    } catch (e) {}
  }
  function done() {
    try { return localStorage.getItem(ONCE) === "1"; } catch (e) { return false; }
  }
  function markDone() {
    try { localStorage.setItem(ONCE, "1"); } catch (e) {}
  }

  // 上报到独立 Supabase source_survey 表（与恩仔聊天 replies 表完全分开，不混在一起）
  function upload(item) {
    try {
      var SB = (typeof REPLY_SB !== "undefined") ? REPLY_SB : null;
      if (!SB || !SB.key) return;
      if (location.protocol !== "http:" && location.protocol !== "https:") return;
      if (typeof fetch !== "function") return;
      fetch(SB.url + "/rest/v1/source_survey", {
        method: "POST",
        headers: {
          apikey: SB.key,
          Authorization: "Bearer " + SB.key,
          "content-type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          time: item.time,
          source: item.source,
          detail: item.detail || "",
          ip: item.ip || "未知", region: item.region || "未知", uid: item.uid || "unknown",
        }),
      }).catch(function () {});
    } catch (e) {}
  }

  // 玩家点选来源 → 记录 + 上报 + 关闭 + 致谢
  window.recordSourceAnswer = function (source, detail) {
    if (!source) return;
    var item = {
      time: nowStr(),
      uid: (typeof window.getDeviceId === "function") ? window.getDeviceId() : "unknown",
      ip: "未知", region: "未知",
      source: String(source).slice(0, 40),
      detail: String(detail || "").slice(0, 200),
    };
    // 复用游戏启动时 getPlayerNet 已缓存的公网 IP + 省市（搜狐接口，best effort）。
    // 直接从缓存同步读取并立即上报：不再等待异步回调（最长 3.6s），避免玩家答完秒关页面丢数据；
    // 同时把 ip/region 真正写进待上报的 item（旧逻辑只改了本机数组，上报体里仍是「未知」）。
    try {
      if (typeof sessionStorage !== "undefined") {
        var cached = JSON.parse(sessionStorage.getItem("mzc_player_net") || "null");
        if (cached && cached.ip && cached.ip !== "unknown") {
          item.ip = cached.ip;
          item.region = cached.region || "unknown";
        }
      }
    } catch (e) {}
    var arr = readArr();
    arr.push(item);
    writeArr(arr);
    markDone();
    upload(item);
    try { showThanks(); } catch (e) { closePopup(); }
  };

  function closePopup() {
    var p = document.getElementById("src-survey-pop");
    if (p && p.parentNode) p.parentNode.removeChild(p);
  }

  // 答完后的感谢页：与调查弹窗同一套卡片/配色
  function showThanks() {
    var wrap = document.getElementById("src-survey-pop") || document.createElement("div");
    wrap.id = "src-survey-pop";
    wrap.style.cssText = "position:absolute;inset:0;z-index:1000003;background:rgba(38,18,28,.46);display:flex;flex-direction:column;align-items:center;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:18px 18px 24px;-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px);-webkit-tap-highlight-color:transparent;";
    var c = window.SRC_SURVEY;
    var img = String(c.thanksImage || "");

    var html =
      '<div style="height:4px;background:linear-gradient(90deg,#ff9a76,#ff6b81,#9c8ad6);"></div>' +
      '<div style="padding:24px 22px 4px;text-align:center;">' +
        '<div style="width:52px;height:52px;margin:0 auto 14px;border-radius:16px;background:linear-gradient(135deg,#ff9a76,#ff6b81);display:flex;align-items:center;justify-content:center;box-shadow:0 6px 16px rgba(255,107,129,.35);">' +
          '<svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>' +
        '</div>' +
        '<div style="font-size:19px;font-weight:700;color:#2b2024;line-height:1.4;">' + escS(c.thanksTitle) + '</div>' +
        '<div style="font-size:13.5px;color:#8a7d82;line-height:1.65;margin-top:9px;">' + escS(c.thanksBody) + '</div>' +
      '</div>';

    if (img) {
      html +=
        '<div id="src-thanks-media" style="padding:12px 18px 4px;text-align:center;">' +
          '<img id="src-thanks-img" src="' + escS(img) + '" alt="" style="display:block;width:100%;max-height:230px;object-fit:contain;border-radius:14px;background:#faf6f8;">' +
        '</div>';
    }

    html += '<div style="height:20px;"></div>';

    var card = document.createElement("div");
    card.style.cssText = "width:100%;max-width:336px;margin:auto 0;background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 18px 50px rgba(60,20,40,.30),0 2px 8px rgba(60,20,40,.08);font-family:-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif;";
    card.innerHTML = html;

    // 图片加载失败就隐藏图片区，不留破图/空白
    if (img) {
      var media = card.querySelector("#src-thanks-media");
      var imgEl = card.querySelector("#src-thanks-img");
      if (imgEl) {
        imgEl.onload = function () { imgEl.style.display = "block"; };
        imgEl.onerror = function () { if (media && media.parentNode) media.parentNode.removeChild(media); };
      }
    }

    wrap.innerHTML = "";
    wrap.appendChild(card);
    if (!wrap.parentNode) screenEl().appendChild(wrap);

    if (!(typeof location !== "undefined" && /[?&]thanksPreview=1\b/.test((typeof window.__Q === "function" ? window.__Q() : (location.search || ""))))) {
      setTimeout(function () { closePopup(); }, Math.max(800, c.thanksAutoCloseMs || 3000));
    }

    if (card.animate && !(typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
      card.animate([{ opacity: 0, transform: "scale(.94)" }, { opacity: 1, transform: "none" }], { duration: 260, easing: "cubic-bezier(.2,.9,.3,1)" });
    }
  }

  // skipMark=true 仅用于作者预览：预览不写「已弹过」标记，方便反复查看
  function showPopup(skipMark) {
    if (surveyShown || document.getElementById("src-survey-pop")) return;
    surveyShown = true;
    // 展示即标记：一个设备只弹一次。覆盖「弹出后未作答/只展开其他就刷新」的情况
    if (!skipMark) markDone();
    var c = window.SRC_SURVEY;
    var wrap = document.createElement("div");
    wrap.id = "src-survey-pop";
    wrap.style.cssText = "position:absolute;inset:0;z-index:1000003;background:rgba(38,18,28,.46);display:flex;flex-direction:column;align-items:center;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:18px 18px 24px;-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px);-webkit-tap-highlight-color:transparent;";

    var card = document.createElement("div");
    card.style.cssText = "width:100%;max-width:336px;margin:auto 0;background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 18px 50px rgba(60,20,40,.30),0 2px 8px rgba(60,20,40,.08);font-family:-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif;";

    var palette = ["#ff6b81", "#ff9a76", "#5b5b66", "#9c8ad6", "#67c2a8", "#c0a8a0"];
    var glyphs = [
      '<path d="M4 5h16v11H9l-5 4V5Z"/><path d="M8 9h8M8 12h5"/>',                                          // 微博：对话框
      '<path d="M4 5h7a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4V5Z"/><path d="M20 5h-7a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h7V5Z"/>', // 小红书：书
      '<path d="M9 17V6l10-2v11"/><circle cx="6.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="15" r="2.5"/>', // 抖音：音符
      '<rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9"/><path d="M10 13h4"/>', // ao3：档案盒
      '<circle cx="9" cy="8" r="3"/><path d="M3 19v-1.5A5.5 5.5 0 0 1 14.5 14"/><path d="M16 5.3a3 3 0 0 1 0 5.4M18 13.5A5.5 5.5 0 0 1 22 19"/>', // 朋友分享：多人
      '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>' // 其他：省略号
    ];
    var html =
      '<style>' +
        '#src-survey-pop .src-opt{transition:background .15s,transform .1s;}' +
        '#src-survey-pop .src-opt:active{background:#fff0f3;transform:scale(.985);}' +
        '#src-survey-pop .src-opt .src-dot{transition:transform .15s;}' +
        '#src-survey-pop .src-opt:active .src-dot{transform:scale(1.25);}' +
        '#src-survey-pop #src-other-ok:active{filter:brightness(.94);transform:scale(.97);}' +
      '</style>' +
      '<div style="height:4px;background:linear-gradient(90deg,#ff9a76,#ff6b81,#9c8ad6);"></div>' +
      '<div style="padding:22px 20px 8px;">' +
        '<div style="font-size:13px;color:#8a7d82;line-height:1.7;text-align:left;">' + escS(c.body) + '</div>' +
        '<div style="font-size:16px;font-weight:700;color:#2b2024;line-height:1.5;margin-top:11px;text-align:left;">' + escS(c.title) + '</div>' +
      '</div>' +
      '<div id="src-options" style="padding:4px 16px 16px;display:grid;grid-template-columns:repeat(2,108px);gap:10px;justify-content:center;">';

    var imgs = c.optionImages || [];
    (c.options || []).forEach(function (opt, i) {
      var color = palette[i % palette.length];
      var glyph = glyphs[i % glyphs.length];
      var imgSrc = imgs[i] ? escS(imgs[i]) : "";
      // 有图：整块铺图 + 底部渐变文字条；无图：回退到彩色图标方块
      var inner = imgSrc
        ? '<img class="src-opt-img" data-i="' + i + '" src="' + imgSrc + '" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;opacity:0;">' +
          '<div class="src-opt-shade" style="position:absolute;left:0;right:0;bottom:0;height:46px;background:linear-gradient(transparent,rgba(30,18,24,.78));"></div>' +
          '<span class="src-fallback" style="display:none;align-items:center;justify-content:center;width:36px;height:36px;border-radius:12px;background:linear-gradient(135deg,' + color + ',' + color + 'd9);">' +
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' + glyph + '</svg>' +
          '</span>'
        : '<span class="src-dot" style="width:36px;height:36px;border-radius:12px;background:linear-gradient(135deg,' + color + ',' + color + 'd9);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 10px ' + color + '38;">' +
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' + glyph + '</svg>' +
          '</span>';
      html += '<button class="src-opt" data-i="' + i + '" style="position:relative;overflow:hidden;width:100%;aspect-ratio:1/1;padding:0;border:1px solid #f0e9ec;background:' + (imgSrc ? '#f3eef0' : '#fcfafc') + ';border-radius:16px;color:#3a3034;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:9px;">' +
        inner +
        (imgSrc ? '' : '') +
        '<span style="position:relative;z-index:2;font-size:13.5px;font-weight:600;' + (imgSrc ? 'color:#fff;margin-top:auto;margin-bottom:9px;text-shadow:0 1px 3px rgba(0,0,0,.4);' : '') + '">' + escS(opt) + '</span>' +
        '</button>';
    });
    html +=
      '<div id="src-other-box" style="display:none;grid-column:1/-1;gap:8px;padding-top:2px;">' +
        '<input id="src-other-input" type="text" maxlength="40" placeholder="' + escS(c.otherPlaceholder) + '" style="flex:1;min-width:0;padding:11px 12px;border:1px solid #e7dde1;border-radius:11px;font-size:14px;color:#2b2024;outline:none;background:#fff;" onfocus="this.style.borderColor=\'#ff6b81\'" onblur="this.style.borderColor=\'#e7dde1\'">' +
        '<button id="src-other-ok" style="padding:11px 14px;border:none;border-radius:11px;background:linear-gradient(135deg,#ff9a76,#ff6b81);color:#fff;font-size:14px;font-weight:600;cursor:pointer;box-shadow:0 4px 12px rgba(255,107,129,.3);">' + escS(c.submitText) + '</button>' +
      '</div>' +
      '</div>';

    card.innerHTML = html;
    wrap.appendChild(card);
    screenEl().appendChild(wrap);

    // 选项配图：加载成功淡入铺满；加载失败回退到彩色 SVG 图标
    card.querySelectorAll(".src-opt-img").forEach(function (im) {
      var btn = im.parentNode;
      var fb = btn.querySelector(".src-fallback");
      im.onload = function () { im.style.opacity = "1"; };
      im.onerror = function () {
        if (im.parentNode) im.parentNode.removeChild(im);
        var shade = btn.querySelector(".src-opt-shade");
        if (shade && shade.parentNode) shade.parentNode.removeChild(shade);
        if (fb) fb.style.display = "flex";
        var label = btn.querySelector("span:last-child");
        if (label) { label.style.color = "#3a3034"; label.style.textShadow = "none"; }
      };
    });

    if (card.animate && !(typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
      card.animate([{ opacity: 0, transform: "scale(.92) translateY(12px)" }, { opacity: 1, transform: "none" }], { duration: 280, easing: "cubic-bezier(.2,.9,.3,1)" });
    }

    var otherBox = card.querySelector("#src-other-box");
    var otherInput = card.querySelector("#src-other-input");
    card.querySelectorAll(".src-opt").forEach(function (btn) {
      btn.onclick = function (e) {
        e.stopPropagation();
        var opt = (window.SRC_SURVEY.options || [])[parseInt(btn.getAttribute("data-i"), 10)];
        if (opt === "其他" && otherBox) {
          otherBox.style.display = "flex";
          if (otherInput) otherInput.focus();
          return;
        }
        window.recordSourceAnswer(opt, "");
      };
    });
    var ok = card.querySelector("#src-other-ok");
    if (ok) ok.onclick = function (e) { e.stopPropagation(); window.recordSourceAnswer("其他", (otherInput && otherInput.value) || ""); };
    wrap.onclick = function () { /* 遮罩不可点关：没有跳过入口，必须选一项才算完成 */ };
  }

  // 由 core/app.js 的 openApp() 调用，传入原始 appId
  window.maybeShowSourceSurvey = function (appId) {
    try {
      var c = window.SRC_SURVEY;
      if (!c || !c.enabled || done() || surveyShown) return;
      var t = c.trigger;
      var hit = false;
      if (t === "weibo") hit = (appId === "weibo");
      else if (t === "social") hit = ["weibo", "xhs", "bilibili", "xianyu"].indexOf(appId) >= 0;
      else if (t === "home") hit = true; // 由 initSourceSurvey 在进主屏时调用
      if (!hit) return;
      setTimeout(function () { showPopup(); }, 700);
    } catch (e) {}
  };

  // 开局兜底计时器：到点若还没弹过/没答过，直接弹
  function armFallback() {
    try {
      var c = window.SRC_SURVEY;
      if (!c || !c.enabled || c.trigger === "none" || done() || surveyShown) return;
      var q = (typeof window.__Q === "function" ? window.__Q() : (location.search || ""));
      var delay = c.fallbackMs || 5 * 60 * 1000;
      // 本机快速测兜底：?sourceFallback=1 → 5 秒后弹，避免真等 5 分钟
      if (/[?&]sourceFallback=1\b/.test(q)) delay = 5000;
      setTimeout(function () {
        if (!done() && !surveyShown) showPopup();
      }, delay);
    } catch (e) {}
  }

  // 作者查看页：?dev=1&source=1，统计各来源数量/占比 + 自动总结 + 明细节
  window.mountSourceSurveyViewer = function () {
    var screen = document.getElementById("screen");
    if (!screen) return;
    var old = document.getElementById("src-survey-viewer");
    if (old && old.parentNode) old.parentNode.removeChild(old);
    var box = document.createElement("div");
    box.id = "src-survey-viewer";
    box.style.cssText = "position:absolute;inset:0;z-index:1000004;background:#141414;color:#eee;overflow-y:auto;padding:18px 16px 40px;font-size:14px;line-height:1.65;font-family:-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif;";
    screen.appendChild(box);

    function render() {
      var arr = readArr();
      var counts = {};
      arr.forEach(function (x) { var s = x.source || "未填"; counts[s] = (counts[s] || 0) + 1; });
      var sorted = Object.keys(counts).map(function (k) { return [k, counts[k]]; }).sort(function (a, b) { return b[1] - a[1]; });
      var total = arr.length;
      var top = sorted[0];
      var summary = total
        ? "共收到 " + total + " 份回答；最多来自「" + top[0] + "」" + top[1] + " 人（" + Math.round(top[1] / total * 100) + "%）" +
          (sorted[1] ? "，其次是「" + sorted[1][0] + "」" + sorted[1][1] + " 人（" + Math.round(sorted[1][1] / total * 100) + "%）。" : "。")
        : "暂无回答。";

      var h =
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;gap:8px;">' +
          '<b style="font-size:16px;">来源调查统计</b>' +
          '<span><button id="sv-reset" style="margin-right:6px;padding:6px 10px;background:#5b2233;color:#f1d6df;border:1px solid #7a4f5e;border-radius:6px;cursor:pointer;font-size:12px;">重置弹窗</button>' +
          '<button id="sv-clear" style="margin-right:6px;padding:6px 10px;background:#5b2233;color:#f1d6df;border:1px solid #7a4f5e;border-radius:6px;cursor:pointer;font-size:12px;">清空</button>' +
          '<button id="sv-close" style="padding:6px 10px;background:#261d25;color:#f1d6df;border:1px solid #705564;border-radius:6px;cursor:pointer;font-size:12px;">关闭</button></span>' +
        '</div>' +
        '<div style="background:#1f1f22;border-radius:12px;padding:12px 14px;margin-bottom:16px;color:#f1d6df;">' + escS(summary) + '</div>';

      if (total) {
        h += '<div style="margin-bottom:16px;">';
        sorted.forEach(function (p) {
          var pct = Math.round(p[1] / total * 100);
          h += '<div style="margin-bottom:10px;">' +
            '<div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px;"><span>' + escS(p[0]) + '</span><span style="color:#b9aab0;">' + p[1] + ' · ' + pct + '%</span></div>' +
            '<div style="height:8px;background:#2a2a2e;border-radius:6px;overflow:hidden;"><div style="height:100%;width:' + pct + '%;background:linear-gradient(90deg,#ff8fa3,#ff6b81);border-radius:6px;"></div></div>' +
            '</div>';
        });
        h += '</div>';
      }

      h += '<div style="margin:16px 0 10px;font-size:15px;font-weight:600;">回答明细（本机 ' + total + ' 条）</div>';
      h += arr.length
        ? arr.slice().reverse().map(function (r) {
            return '<div style="background:#1f1f22;border-radius:10px;padding:10px 12px;margin-bottom:8px;">' +
              '<span style="color:#8e8e93;font-size:12px;">' + escS(r.time) + (r.region && r.region !== "未知" ? ' · ' + escS(r.region) : '') + (r.uid ? ' · ' + escS(r.uid) : '') + '</span><br>' +
              '<b style="color:#ffb3c1;">' + escS(r.source) + '</b>' + (r.detail ? '：' + escS(r.detail) : '') +
              '</div>';
          }).join("")
        : '<div style="color:#8e8e93;">还没有收集到回答</div>';

      box.innerHTML = h;
      box.querySelector("#sv-close").onclick = function () { if (box.parentNode) box.parentNode.removeChild(box); };
      box.querySelector("#sv-clear").onclick = function () {
        try { localStorage.removeItem(KEY); } catch (e) {}
        render();
      };
      box.querySelector("#sv-reset").onclick = function () {
        try { localStorage.removeItem(ONCE); } catch (e) {}
        if (typeof window.toastDev === "function") window.toastDev("弹窗已重置，刷新后重进微博可再看");
      };
    }
    render();
  };

  window.initSourceSurvey = function () {
    try {
      var q = (typeof window.__Q === "function" ? window.__Q() : (location.search || ""));
      if (/[?&]source=1\b/.test(q)) window.mountSourceSurveyViewer();
      // 作者预览：?dev=1&sourcePreview=1 直接弹窗（本机测试用，不影响正式环境）
      var isDev = /[?&]dev=1\b/.test(q) || /^(localhost|127\.0\.0\.1)$/.test(location.hostname || "");
      if (isDev && /[?&]sourcePreview=1\b/.test(q)) {
        setTimeout(function () { showPopup(true); }, 600);
        return;
      }
      if (isDev && /[?&]thanksPreview=1\b/.test(q)) {
        setTimeout(function () { showThanks(); }, 600);
        return;
      }
      // trigger=home：首次进主屏时弹
      if (window.SRC_SURVEY.trigger === "home" && window.SRC_SURVEY.enabled && !done()) {
        setTimeout(function () { showPopup(); }, 1800);
      }
      // 作者工具页（统计/预览）绝不挂兜底计时器，避免干扰其他功能
      var toolPage = /[?&]source=1\b/.test(q) || /[?&]sourcePreview=1\b/.test(q) || /[?&]thanksPreview=1\b/.test(q);
      if (!toolPage) armFallback();
    } catch (e) {}
  };
})();
