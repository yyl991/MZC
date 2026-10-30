"use strict";
let AC = null;
function ac() {
  if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
  if (AC && AC.state === "suspended") AC.resume();
  return AC;
}
function tone(f, t0, dur, vol = 0.12, type = "sine") {
  const a = ac(); if (!a) return;
  vol = Math.min(0.95, vol * 4.5); // 整体调响
  const t = a.currentTime + t0, o = a.createOscillator(), gn = a.createGain();
  o.type = type; o.frequency.value = f;
  gn.gain.setValueAtTime(0, t); gn.gain.linearRampToValueAtTime(vol, t + 0.008); gn.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(gn).connect(a.destination); o.start(t); o.stop(t + dur + 0.05);
}
function sfx(k) {
  if (k === "key") tone(2400, 0, 0.025, 0.035, "triangle");
  else if (k === "msg") { tone(1046, 0, 0.22, 0.09); tone(1397, 0.1, 0.32, 0.09); }
  else if (k === "send") { tone(620, 0, 0.07, 0.05); tone(930, 0.05, 0.09, 0.05); }
  else if (k === "unlock") { tone(1300, 0, 0.05, 0.04, "triangle"); tone(1700, 0.04, 0.05, 0.03, "triangle"); }
  else if (k === "lock") tone(500, 0, 0.06, 0.05, "triangle");
}
function ringOnce() {
  [[784, 0], [988, 0.2], [1175, 0.4], [988, 0.6], [784, 1.0], [988, 1.2], [1175, 1.4], [1319, 1.6]].forEach(([f, t]) => {
    tone(f, t, 0.35, 0.11); tone(f * 2, t, 0.18, 0.03);
  });
}

window.bgmPausedByOther = false;
window.AudioHub = {
  bgm: () => document.getElementById("bgm"),
  isBusy() {
    const videos = document.querySelectorAll("video");
    for (let v of videos) { if (!v.paused && !v.ended) return true; }
    const audios = document.querySelectorAll("audio");
    for (let a of audios) { if (a.id === "bgm") continue; if (!a.paused && !a.ended) return true; }
    if (document.querySelector(".voice-bb.playing")) return true;
    if (typeof callState !== "undefined" && callState) return true;
    if (typeof PLAYER !== "undefined" && !PLAYER.paused && typeof nowSong !== "undefined" && nowSong >= 0) return true;
    return false;
  },
  // 只有 BGM 本来在播时才记“被别的音频打断”，否则挂电话后会莫名其妙开始放歌
  pauseBGM() { const b = this.bgm(); if (!b) return; if (!b.paused) { b.pause(); window.bgmPausedByOther = true; } },
  resumeBGM() { const b = this.bgm(); if (!b || !window.bgmPausedByOther) return; if (this.isBusy()) return; b.play().catch(() => {}); window.bgmPausedByOther = false; },
};
window.pauseBGM = () => window.AudioHub.pauseBGM();
window.resumeBGM = () => window.AudioHub.resumeBGM();

document.addEventListener("play", (e) => {
  if (e.target.tagName === "VIDEO" || (e.target.tagName === "AUDIO" && e.target.id !== "bgm")) window.AudioHub.pauseBGM();
}, true);
document.addEventListener("pause", (e) => {
  if (e.target.tagName === "VIDEO" || (e.target.tagName === "AUDIO" && e.target.id !== "bgm")) setTimeout(() => window.AudioHub.resumeBGM(), 100);
}, true);
// 进页面后任何一次手势都试着把 BGM 放起来，直到成功为止
// （原来是 { once: true }，第一次点击被拦或资源没就绪就永远不放音乐了）
window._bgmStarted = false;
window.tryStartBGM = function () {
  const BGM = document.getElementById("bgm");
  if (!BGM || window._bgmStarted) return;
  if (window.bgmPausedByOther) return;
  BGM.volume = 1;
  BGM.play().then(() => { window._bgmStarted = true; }).catch(() => {});
};
["pointerdown", "touchstart", "click", "keydown"].forEach((ev) => {
  document.addEventListener(ev, () => { ac(); window.tryStartBGM(); }, { passive: true });
});