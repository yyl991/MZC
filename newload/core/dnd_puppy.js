// core/dnd_puppy.js
// 开启「免打扰」时，在原 toast 之外，从屏幕侧面滑出一个穆祉丞桌宠 + 气泡。
// 不是弹窗：无遮罩、无背景模糊、pointer-events:none，不挡任何操作；原「已开启/已关闭免打扰」toast 逻辑完全不动。
// 左右两套固定组合：左边=委屈图+傲娇三句，右边=生气图+问答文案。次数无上限，一直左右交替。
// 文案与图片路径在 window.DND_PUPPY_CFG 里改；把抠好的图放到对应路径即可。
"use strict";
(function () {
  var ID = "dnd-puppy";
  var COUNT_KEY = "mzc_dnd_pet_count";
  var memCount = null; // localStorage 不可用时的会话内兜底
  var CFG = {
    // 作者抠好的透明底小猫图（身体内部白色不透明、外部透明）
    // 左边一套：委屈图 + 傲娇文案（第 1、3、5… 次）
    petImage: "./data/survey/dnd_pet_sad.png",          // 兜底默认（=左侧图）
    petImageNormal: "./data/survey/dnd_pet_sad.png",    // 左侧图
    line1: "嫌烦了？",
    line2: "我又不是一直很安静",
    line3: "我一直很吵闹！",
    // 右边一套：生气图 + 问答文案（第 2、4、6… 次）
    petImageSpecial: "./data/survey/dnd_pet_angry.png", // 右侧图
    specialLine1: "那你觉得你这几年和谁关系非常好后来又疏远了",
    specialLine2: "：我感觉，我感觉跟小纸团吧😿",
    showDelayMs: 350,   // 先弹"已开启免打扰"toast，约0.35秒后桌宠出现
    bubbleDelayMs: 520, // 桌宠出现后多久"发出"对话气泡
    bubbleCloseMs: 220, // 气泡收起动画时长
    autoCloseMs: 7000,  // 气泡出现后停留多久自动收气泡+弹跳退场（保证字看得完）
    firstSide: "left",  // 第一次从左边出，之后左右交替（奇数左、偶数右）
    side: "right",      // 兜底默认方向
  };
  window.DND_PUPPY_CFG = CFG;

  function escS(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function screenEl() { return document.getElementById("screen") || document.body; }
  function q() {
    try { return typeof window.__Q === "function" ? window.__Q() : (location.search || ""); }
    catch (e) { return ""; }
  }
  function getCount() {
    if (memCount != null) return memCount;
    var n = 0;
    try { n = parseInt(localStorage.getItem(COUNT_KEY) || "0", 10) || 0; } catch (e) {}
    memCount = n; return n;
  }
  function incCount() {
    var n = getCount() + 1; memCount = n;
    try { localStorage.setItem(COUNT_KEY, String(n)); } catch (e) {}
    return n;
  }
  function resetCount() {
    memCount = 0;
    try { localStorage.removeItem(COUNT_KEY); } catch (e) {}
  }
  window.resetDndPetCount = resetCount; // 供作者控制台/预览重置

  function removeHost() {
    var p = document.getElementById(ID);
    if (p && p.parentNode) p.parentNode.removeChild(p);
  }

  // 关闭免打扰时立即收起桌宠，避免「已关闭」还挂着傲娇文案
  window.hideDndPuppy = function () { removeHost(); };

  function slideOutAndRemove() {
    var p = document.getElementById(ID);
    if (!p || !p.parentNode) return;
    var finish = function () { removeHost(); };
    var right = p.getAttribute("data-side") !== "left";
    if (p.animate) {
      var a = p.animate(
        [{ opacity: 1, transform: "translateX(0)" }, { opacity: 0, transform: "translateX(" + (right ? "115%" : "-115%") + ")" }],
        { duration: 320, easing: "ease-in", fill: "forwards" }
      );
      if (a && a.onfinish !== undefined) a.onfinish = finish;
      else setTimeout(finish, 320);
    } else finish();
  }

  // side: "left" | "right"；variant 仅作兼容参数，实际文案/表情完全由 side 决定。
  // 左边固定委屈傲娇，右边固定生气问答；想把两套内容对调，把 isSpecial 一行反过来即可。
  window.showDndPuppy = function (variant, side) {
    try {
      removeHost();
      var first = CFG.firstSide || "left";
      // 未传 side 时按 variant 兜底（老预览用）
      if (!side) side = (variant === "special") ? (first === "left" ? "right" : "left") : first;
      var isSpecial = (side !== "left"); // 右=生气问答款，左=委屈傲娇款
      var right = side !== "left";
      var host = document.createElement("div");
      host.id = ID;
      host.setAttribute("data-side", side);
      // 桌宠贴边悬浮：整体不盖遮罩；气泡区穿透点击，只有小猫本体可点（触发弹跳）
      host.style.cssText = "position:absolute;" + (right ? "right:4px;" : "left:4px;") +
        "bottom:96px;z-index:1000002;pointer-events:none;display:flex;align-items:flex-end;gap:4px;" +
        "-webkit-tap-highlight-color:transparent;";

      // 统一深色，仅用字号/粗细区分层次；圆形内居中排版
      var bubbleContent = isSpecial
        ? '<div style="font-size:11.5px;color:#3a3034;line-height:1.6;">' + escS(CFG.specialLine1) + '</div>' +
          '<div style="font-size:11.5px;color:#3a3034;font-weight:700;line-height:1.6;margin-top:5px;">' + escS(CFG.specialLine2) + '</div>'
        : '<div style="font-size:12px;color:#3a3034;line-height:1.55;">' + escS(CFG.line1) + '</div>' +
          '<div style="font-size:12px;color:#3a3034;line-height:1.55;margin-top:6px;">' + escS(CFG.line2) + '</div>' +
          '<div style="font-size:12.5px;color:#3a3034;font-weight:700;line-height:1.5;margin-top:2px;">' + escS(CFG.line3) + '</div>';
      // 椭圆气泡：宽大于高；special 文案多所以整体大一点
      var bubbleW = isSpecial ? "210px" : "180px";
      var bubbleH = isSpecial ? "156px" : "136px";
      // 锥形尾巴：贴圆的侧面靠下、尖端朝猫；贴左时水平翻转
      var tailSVG =
        '<svg class="dnd-bubble-tail" width="19" height="22" viewBox="0 0 18 21" ' +
          'style="position:absolute;' + (right ? 'right:-7px;' : 'left:-7px;transform:scaleX(-1);') +
          'bottom:26px;overflow:visible;display:block;">' +
          '<path d="M0 6 C 0 14, 5 19, 17 20 C 9 14, 5 8, 3 0 C 1 2, 0 4, 0 6 Z" fill="#fff"></path>' +
        '</svg>';
      var bubbleOrigin = right ? "100% 78%" : "0% 78%";
      var bubbleHTML =
        '<div class="dnd-bubble" style="position:relative;width:' + bubbleW + ';height:' + bubbleH + ';background:#fff;' +
          'border-radius:50%;box-sizing:border-box;padding:14px 22px;pointer-events:auto;cursor:pointer;' +
          'display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;' +
          'transform-origin:' + bubbleOrigin + ';' +
          'filter:drop-shadow(0 5px 13px rgba(60,20,40,.24));' +
          'font-family:-apple-system,BlinkMacSystemFont,\'PingFang SC\',\'Microsoft YaHei\',sans-serif;">' +
          tailSVG +
          '<div style="position:relative;z-index:1;">' + bubbleContent + '</div>' +
        '</div>';

      var petSrc = isSpecial ? (CFG.petImageSpecial || CFG.petImage) : (CFG.petImageNormal || CFG.petImage);
      var petHTML =
        '<div class="dnd-pet-hit" style="position:relative;width:112px;flex:none;pointer-events:auto;cursor:pointer;' +
          '-webkit-tap-highlight-color:transparent;filter:drop-shadow(0 8px 10px rgba(60,20,40,.22));">' +
          '<img class="dnd-pet-img" src="' + escS(petSrc) + '" alt="" style="display:block;width:100%;height:auto;object-fit:contain;pointer-events:none;">' +
          '<div class="dnd-pet-ph" style="display:none;width:100%;height:112px;align-items:flex-end;justify-content:center;font-size:82px;line-height:1;">' + (isSpecial ? "😿" : "😾") + '</div>' +
        '</div>';

      var reduceMotion = (typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

      // 变量与退场流程（reveal / finishSequence 共用）
      var bubbleEl = null;
      var autoTimer = null;
      var exiting = false;
      var revealed = false;

      // 先把桌宠插入 DOM（图片此时开始加载；若已预加载则 complete=true）
      host.innerHTML = petHTML;
      screenEl().appendChild(host);

      // 图加载失败：显示 emoji 占位
      var im = host.querySelector(".dnd-pet-img");
      var ph = host.querySelector(".dnd-pet-ph");
      if (im && ph) {
        im.onerror = function () {
          if (im.parentNode) im.parentNode.removeChild(im);
          ph.style.display = "flex";
          reveal();
        };
        // 关键：等图片真正就绪才开始整条时序，避免"图还没加载出来就没了"
        if (im.complete && im.naturalWidth > 0) reveal();
        else { im.onload = reveal; setTimeout(reveal, 1600); } // 兜底：图片异常时也能出现
      } else reveal();

      // 桌宠滑入 → 稍后吐气泡：都等图片 ready 后才开始
      function reveal() {
        if (revealed || exiting || !host.parentNode) return;
        revealed = true;
        if (host.animate && !reduceMotion) {
          host.animate(
            [{ opacity: 0, transform: "translateX(" + (right ? "115%" : "-115%") + ")" },
             { opacity: 1, transform: "translateX(0)" }],
            { duration: 420, easing: "cubic-bezier(.2,1.2,.35,1)", fill: "both" }
          );
        }
        spawnBubble();
      }

      // 收气泡 → 弹跳 → 退场（点击与超时共用这条退场流程）
      function finishSequence() {
        if (exiting) return;
        exiting = true;
        if (autoTimer) { clearTimeout(autoTimer); autoTimer = null; }
        var afterBubble = function () {
          var hit = host.querySelector(".dnd-pet-hit");
          if (hit && hit.animate && !reduceMotion) {
            var a = hit.animate(
              [{ transform: "translateY(0) scale(1,1)" },
               { transform: "translateY(4px) scale(1.08,.92)", offset: .18 },
               { transform: "translateY(-16px) scale(.94,1.08)", offset: .45 },
               { transform: "translateY(0) scale(1.03,.97)", offset: .7 },
               { transform: "translateY(-5px) scale(.99,1.01)", offset: .86 },
               { transform: "translateY(0) scale(1,1)" }],
              { duration: 560, easing: "cubic-bezier(.3,.8,.4,1)" }
            );
            var out = function () { setTimeout(slideOutAndRemove, 90); };
            if (a && a.onfinish !== undefined) a.onfinish = out;
            else setTimeout(out, 560);
          } else slideOutAndRemove();
        };
        if (bubbleEl && bubbleEl.parentNode) {
          if (bubbleEl.animate && !reduceMotion) {
            // 朝小猫方向（尾巴所指方向）缩小位移，像话被吸回嘴里
            var toCat = right ? "26px" : "-26px";
            var ba = bubbleEl.animate(
              [{ opacity: 1, transform: "translateX(0) scale(1)" },
               { opacity: .85, transform: "translateX(" + toCat + ") scale(.72)", offset: .45 },
               { opacity: 0, transform: "translateX(" + toCat + ") scale(.06)" }],
              { duration: (CFG.bubbleCloseMs || 220) + 80, easing: "cubic-bezier(.5,0,.75,.4)", fill: "forwards" }
            );
            if (ba && ba.onfinish !== undefined) ba.onfinish = afterBubble;
            else setTimeout(afterBubble, (CFG.bubbleCloseMs || 220) + 80);
          } else afterBubble();
        } else afterBubble();
      }

      // 第二步：图片就绪后延迟"发出"气泡，气泡出现才开始计时停留
      function spawnBubble() {
        setTimeout(function () {
          if (exiting || !host.parentNode) return;
          if (right) host.insertAdjacentHTML("afterbegin", bubbleHTML);
          else host.insertAdjacentHTML("beforeend", bubbleHTML);
          bubbleEl = host.querySelector(".dnd-bubble");
        // 气泡也可点：跟点小猫走同一条收气泡+弹跳退场流程
        if (bubbleEl) {
          bubbleEl.addEventListener("click", function (e) { if (e) { e.preventDefault(); e.stopPropagation(); } finishSequence(); });
          bubbleEl.addEventListener("touchstart", function (e) { e.stopPropagation(); }, { passive: true });
        }
        if (bubbleEl && bubbleEl.animate && !reduceMotion) {
          // 从猫嘴方向（transform-origin 靠猫侧）由小放大吐出，跟收回嘴里对称
          var fromCat = right ? "26px" : "-26px";
          bubbleEl.animate(
            [{ opacity: 0, transform: "translateX(" + fromCat + ") scale(.06)" },
             { opacity: .85, transform: "translateX(" + fromCat + ") scale(.72)", offset: .55 },
             { opacity: 1, transform: "translateX(0) scale(1)" }],
            { duration: 420, easing: "cubic-bezier(.2,1.3,.4,1)", fill: "both" }
          );
        }
        autoTimer = setTimeout(finishSequence, Math.max(1200, CFG.autoCloseMs || 3200));
        }, Math.max(120, CFG.bubbleDelayMs || 520));
      }

      // 点击桌宠本体：收气泡 + 弹跳提前退场（只吃小猫这一块的点击，不挡桌面）
      var hit0 = host.querySelector(".dnd-pet-hit");
      if (hit0) {
        hit0.addEventListener("click", function (e) { if (e) { e.preventDefault(); e.stopPropagation(); } finishSequence(); });
        hit0.addEventListener("touchstart", function (e) { e.stopPropagation(); }, { passive: true });
      }
    } catch (e) {}
  };

  // 三个开关入口在「开启」时调这个：先弹原 toast，约0.35秒后桌宠出现。
  window.showDndPet = function () {
    try {
      var n = incCount();
      // 左右两套固定：奇数次=左边(委屈图+傲娇三句)，偶数次=右边(生气图+问答两句)，无次数上限
      var first = CFG.firstSide || "left";
      var side = (n % 2 === 1) ? first : (first === "left" ? "right" : "left");
      setTimeout(function () { window.showDndPuppy(null, side); }, Math.max(0, CFG.showDelayMs || 280));
    } catch (e) {}
  };

  window.initDndPuppy = function () {
    try {
      // 页面加载即预加载两张桌宠图：首次开关免打扰时图片已在缓存，桌宠立刻出现不等待
      [CFG.petImageNormal || CFG.petImage, CFG.petImageSpecial].forEach(function (src) {
        if (!src) return;
        var pre = new Image(); pre.src = src; window.__dndPreloaded = window.__dndPreloaded || []; window.__dndPreloaded.push(pre);
      });
      var qs = q();
      if (/(?:^|[?&])dndReset=1\b/.test(qs)) resetCount();
      var m = /(?:^|[?&])dndPreview=(\d+)\b/.exec(qs);
      if (m) {
        var v = parseInt(m[1], 10) || 1;
        // dndPreview=1 看左边(委屈傲娇)；=2 或 =3 看右边(生气问答)
        var first = CFG.firstSide || "left";
        var side = (v <= 1) ? first : (first === "left" ? "right" : "left");
        setTimeout(function () { window.showDndPuppy(null, side); }, 600);
      }
    } catch (e) {}
  };
})();
