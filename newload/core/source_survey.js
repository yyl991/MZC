// core/source_survey.js
// 「从哪里刷到的」来源调查弹窗（文案为占位，等作者给正式文案后替换 window.SRC_SURVEY）
// 设计要点：
//  - 只在 #screen 手机屏幕内弹，不遮状态栏外的真实页面
//  - 每台设备只弹一次（localStorage 标记），可随时重置
//  - 答案存本机 localStorage，并复用现有 Supabase replies 表上报（文本带 [来源] 前缀）
//  - ?dev=1&source=1（或任意 source=1）打开作者统计查看页，自动汇总各来源占比
"use strict";
(function () {
  var KEY = "mzc_source_survey";
  var ONCE = "mzc_source_survey_done";

  // ============ 可配置区：文案由作者后续提供，直接改这里 ============
  window.SRC_SURVEY = {
    enabled: true,
    // 触发时机：weibo=首次打开微博 | social=首次打开任一社交App | home=首次进主屏 | none=关闭自动弹
    trigger: "weibo",
    title: "【标题文案待填】",
    body: "【正文文案待填：你是从哪里刷到这个捡手机的？】",
    options: ["微博", "小红书", "B站", "抖音", "朋友推荐", "其他"],
    otherPlaceholder: "其他来源（选填）",
    submitText: "就选这个",
    skipText: "先不填",
    thanksText: "记下啦，谢谢你～",
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

  // 上报到既有 Supabase replies 表：用 [来源] 前缀区分，作者原查看页也能看到
  function upload(item) {
    try {
      var SB = (typeof REPLY_SB !== "undefined") ? REPLY_SB : null;
      if (!SB || !SB.key) return;
      if (location.protocol !== "http:" && location.protocol !== "https:") return;
      if (typeof fetch !== "function") return;
      var text = "[来源] " + item.source + (item.detail ? "｜" + item.detail : "");
      fetch(SB.url + "/rest/v1/replies", {
        method: "POST",
        headers: {
          apikey: SB.key,
          Authorization: "Bearer " + SB.key,
          "content-type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          time: item.time, text: text,
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
    var arr = readArr();
    arr.push(item);
    writeArr(arr);
    markDone();

    // 复用现有 IP 解析，写回本机记录
    try {
      if (typeof window.getPlayerNet === "function") {
        window.getPlayerNet(function (net) {
          try {
            var a = readArr();
            for (var i = a.length - 1; i >= 0; i--) {
              if (a[i].uid === item.uid && a[i].time === item.time && a[i].ip === "未知") {
                a[i].ip = (net && net.ip) || "unknown";
                a[i].region = (net && net.region) || "unknown";
                break;
              }
            }
            writeArr(a);
          } catch (e) {}
          upload(item);
        });
      } else upload(item);
    } catch (e) { upload(item); }

    closePopup();
    if (typeof window.toastDev === "function") window.toastDev(window.SRC_SURVEY.thanksText);
  };

  function closePopup() {
    var p = document.getElementById("src-survey-pop");
    if (p && p.parentNode) p.parentNode.removeChild(p);
  }

  function showPopup() {
    if (document.getElementById("src-survey-pop")) return;
    var c = window.SRC_SURVEY;
    var wrap = document.createElement("div");
    wrap.id = "src-survey-pop";
    wrap.style.cssText = "position:absolute;inset:0;z-index:1000003;background:rgba(0,0,0,.44);display:flex;align-items:center;justify-content:center;padding:26px 22px;-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);-webkit-tap-highlight-color:transparent;";

    var card = document.createElement("div");
    card.style.cssText = "width:100%;max-width:340px;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 14px 44px rgba(0,0,0,.32);font-family:-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif;";

    var html =
      '<div style="padding:22px 20px 12px;text-align:center;">' +
        '<div style="font-size:17px;font-weight:600;color:#1c1c1e;line-height:1.45;">' + escS(c.title) + '</div>' +
        '<div style="font-size:13px;color:#6b6b70;line-height:1.65;margin-top:9px;">' + escS(c.body) + '</div>' +
      '</div>' +
      '<div id="src-options" style="padding:2px 16px 14px;display:flex;flex-direction:column;gap:8px;">';

    (c.options || []).forEach(function (opt, i) {
      html += '<button class="src-opt" data-i="' + i + '" style="width:100%;padding:12px 14px;border:1px solid #e8e8ed;background:#f7f7f9;border-radius:12px;font-size:15px;color:#2c2c2e;cursor:pointer;text-align:center;">' + escS(opt) + '</button>';
    });
    html +=
      '<div id="src-other-box" style="display:none;gap:8px;">' +
        '<input id="src-other-input" type="text" maxlength="40" placeholder="' + escS(c.otherPlaceholder) + '" style="flex:1;min-width:0;padding:11px 12px;border:1px solid #e0e0e5;border-radius:10px;font-size:14px;color:#1c1c1e;outline:none;">' +
        '<button id="src-other-ok" style="padding:11px 14px;border:none;border-radius:10px;background:#ff6b81;color:#fff;font-size:14px;font-weight:600;cursor:pointer;">' + escS(c.submitText) + '</button>' +
      '</div>' +
      '</div>' +
      '<div style="border-top:.5px solid #e5e5ea;"><button id="src-skip" style="width:100%;padding:14px;border:none;background:none;color:#8e8e93;font-size:14px;cursor:pointer;">' + escS(c.skipText) + '</button></div>';

    card.innerHTML = html;
    wrap.appendChild(card);
    screenEl().appendChild(wrap);

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
    var skip = card.querySelector("#src-skip");
    if (skip) skip.onclick = function (e) { e.stopPropagation(); markDone(); closePopup(); };
    wrap.onclick = function () { /* 遮罩不可点关，避免误触漏答 */ };
  }

  // 由 core/app.js 的 openApp() 调用，传入原始 appId
  window.maybeShowSourceSurvey = function (appId) {
    try {
      var c = window.SRC_SURVEY;
      if (!c || !c.enabled || done()) return;
      var t = c.trigger;
      var hit = false;
      if (t === "weibo") hit = (appId === "weibo");
      else if (t === "social") hit = ["weibo", "xhs", "bilibili", "xianyu"].indexOf(appId) >= 0;
      else if (t === "home") hit = true; // 由 initSourceSurvey 在进主屏时调用
      if (!hit) return;
      setTimeout(function () { showPopup(); }, 700);
    } catch (e) {}
  };

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
      var q = (location.search || "");
      if (/[?&]source=1\b/.test(q)) window.mountSourceSurveyViewer();
      // 作者预览：?dev=1&sourcePreview=1 直接弹窗（本机测试用，不影响正式环境）
      var isDev = /[?&]dev=1\b/.test(q) || /^(localhost|127\.0\.0\.1)$/.test(location.hostname || "");
      if (isDev && /[?&]sourcePreview=1\b/.test(q)) {
        setTimeout(function () { showPopup(); }, 600);
        return;
      }
      // trigger=home：首次进主屏时弹
      if (window.SRC_SURVEY.trigger === "home" && window.SRC_SURVEY.enabled && !done()) {
        setTimeout(function () { showPopup(); }, 1800);
      }
    } catch (e) {}
  };
})();
