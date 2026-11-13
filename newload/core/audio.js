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
  if (!window._ringWanted || (typeof callState !== "undefined" && callState !== "ring")) return;
  if (!window._ringEl) {
    window._ringEl = new Audio("./data/app/call.mp3");
    window._ringEl.loop = true;
    window._ringEl.preload = "auto";
    window._ringEl.style.display = "none";
    (document.body || document.documentElement).appendChild(window._ringEl);
  }
  if (!window._ringEl.paused) return;
  try { window._ringEl.currentTime = 0; } catch (e) {}
  window._ringEl.play().then(() => {
    if (!window._ringWanted || (typeof callState !== "undefined" && callState !== "ring")) window._ringEl.pause();
  }).catch(() => {});
}

window.bgmPausedByOther = false;
window.syncBackgroundTrack = function () {
  const bgm = document.getElementById("bgm");
  if (!bgm) return null;

  // 先判断当前处在哪个阶段：
  // 没到家 → ""；零点传送幕 → "transferred"；点了继续 → "exploring"
  const phase = (typeof SS !== "undefined" && SS.homecoming && SS.homecoming.phase) || "";

  // 根据阶段决定用哪首歌
  const source = phase === "transferred"
    ? "./data/app/hb.mp3"   // 零点传送幕：放 hb.mp3
    : phase === "exploring"
      ? "./data/app/19.mp3" // 点继续之后：放 19.mp3
      : "./data/app/bgm.mp3"; // 普通游戏过程：放原来的 bgm.mp3

  // 当前播放器里的歌和“应该放的歌”不一样，就换歌
  const current = bgm.dataset.storyTrack || (typeof bgm.getAttribute === "function" ? bgm.getAttribute("src") : "");
  if (current !== source) {
    bgm.pause();                        // 先停
    bgm.src = source;                   // 换源
    if (typeof bgm.load === "function") bgm.load(); // 重新加载
    window._bgmStarted = false;         // 允许 tryStartBGM 重新播放
    window.bgmPausedByOther = false;
  }
  bgm.dataset.storyTrack = source;

  // 传送幕和到家探索都循环播；普通游戏过程保持原来的循环设置
  bgm.loop = phase === "transferred" || phase === "exploring";

  return bgm;
};


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
  const BGM = window.syncBackgroundTrack();
  if (!BGM || window._bgmStarted) return;
  if (window.bgmPausedByOther) return;
  if (window.AudioHub.isBusy()) return;
  BGM.volume = 1;
  const track = BGM.dataset.storyTrack;
  BGM.play().then(() => {
    if (BGM.dataset.storyTrack === track && !BGM.paused) window._bgmStarted = true;
  }).catch(() => {});
};
["pointerdown", "touchstart", "click", "keydown"].forEach((ev) => {
  document.addEventListener(ev, () => { ac(); window.tryStartBGM(); }, { passive: true });
});
