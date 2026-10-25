const SVG_PLAY =
  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l12.5-7.5Z"/></svg>';
const SVG_PAUSE =
  '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4.5" width="4" height="15" rx="1"/><rect x="14" y="4.5" width="4" height="15" rx="1"/></svg>';
const SVG_FWD =
  '<svg viewBox="0 0 32 24" fill="currentColor"><path d="M2 4.5v15l12-7.5Z"/><path d="M15 4.5v15l12-7.5Z"/></svg>';
const SVG_NOTE =
  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 3v11.5a3 3 0 1 1-2-2.8V7.3l-6 1.4v8a3 3 0 1 1-2-2.8V5.5Z"/></svg>';
const MUSIC_DATA = [
  {
    name: "小恩恩弹唱",
    artist: "穆祉丞",
    cover: "./data/music/pigcry.jpg",
    src: "./data/music/boli.mp3",
  },
  {
    name: "玻璃弹唱",
    artist: "小恩恩",
    cover: "",
    src: "./data/music/boli.mp3",
  },
  {
    name: "橙粉色",
    artist: "时代峰峻",
    cover: "",
    src: "./data/music/boli.mp3",
  },
  {
    name: "Mu的吉他",
    artist: "未知歌手",
    cover: "",
    src: "./data/music/boli.mp3",
  },
  {
    name: "占位循环",
    artist: "占位循环",
    cover: "",
    src: "./data/music/boli.mp3",
  },
];
const artStyle = (i) =>
  MUSIC_DATA[i] && MUSIC_DATA[i].cover
    ? `background-image:url(${MUSIC_DATA[i].cover})`
    : "";
VIEWS.music = () => ({
  html:
    navHTML({
      title: "歌曲",
      back: "资料库",
      backFn: "closeApp()",
      right: "",
    }) +
    `<div class="scroll" style="padding-bottom:180px"><h1 class="lt">歌曲</h1><div style="display:flex;gap:12px;margin:4px 16px 14px"><button onclick="playSong(0)" style="flex:1;background:#eeeef0;border-radius:10px;padding:12px;color:#fa2d48;font-weight:600;display:flex;justify-content:center;gap:6px;align-items:center">${SVG_PLAY.replace("<svg", '<svg width="14" style="color:#fa2d48"')}播放</button><button onclick="playSong(Math.floor(Math.random()*${MUSIC_DATA.length}))" style="flex:1;background:#eeeef0;border-radius:10px;padding:12px;color:#fa2d48;font-weight:600">随机播放</button></div>${MUSIC_DATA.map((s, i) => `<button class="mrow" onclick="playSong(${i})"><span class="art" style="${artStyle(i)}">${s.cover ? "" : SVG_NOTE}</span><span class="mt ${i === nowSong ? "pl" : ""}">${esc(s.name)}<small>${s.artist}</small></span><span onclick="event.stopPropagation();toastDev()" style="color:#8e8e93">${G.dotsH ? G.dotsH.replace("<svg", '<svg width="20"') : ""}</span></button>`).join("")}</div>${miniHTML()}<div class="tabbar"><button onclick="toastDev()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="m10 8.5 5 3.5-5 3.5Z" fill="currentColor"/></svg><span>现在就听</span></button><button onclick="toastDev()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/></svg><span>浏览</span></button><button onclick="toastDev()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="2"/><path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14"/></svg><span>广播</span></button><button class="on" style="color:#fa2d48"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5 4v16M10 4v16M14.5 4.5l5 15"/></svg><span>资料库</span></button><button onclick="toastDev()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><span>搜索</span></button></div>`,
});
function miniHTML() {
  if (nowSong < 0 || !MUSIC_DATA[nowSong]) return "";
  const s = MUSIC_DATA[nowSong];
  return `<div class="mini" style="display:flex; align-items:center;"><span class="art" style="${artStyle(nowSong)}">${s.cover ? "" : SVG_NOTE}</span><b style="flex:1; margin-left:10px; font-size:15px; font-weight:500;">${esc(s.name)}</b><button onclick="event.stopPropagation(); toggleSong(event)" style="padding:10px; display:flex; align-items:center;">${PLAYER.paused ? SVG_PLAY : SVG_PAUSE}</button><button onclick="event.stopPropagation(); nextSong(1)" style="padding:10px; display:flex; align-items:center;">${SVG_FWD.replace("<svg", '<svg width="24"')}</button></div>`;
}
function playSong(i) {
  if (!MUSIC_DATA[i] || !MUSIC_DATA[i].src) return;
  if (typeof pauseBGM === "function") pauseBGM();
  nowSong = i;
  delete PLAYER.dataset.isRecorder;
  PLAYER.src = MUSIC_DATA[i].src;
  PLAYER.volume = 0.5;
  PLAYER.load();
  PLAYER.onended = () => nextSong(1);
  PLAYER.play().catch((e) => {
    console.warn("音频播放失败:", e);
  });
  if (view === "music") {
    const sc = APP.querySelector(".scroll");
    const st = sc ? sc.scrollTop : 0;
    const pg = show("music");
    if (pg) pg.querySelector(".scroll").scrollTop = st;
  }
}
function toggleSong(e) {
  if (e) e.stopPropagation();
  if (nowSong < 0 || !MUSIC_DATA[nowSong]) return;
  if (typeof pauseBGM === "function") pauseBGM();
  if (PLAYER.paused) PLAYER.play().catch(() => {});
  else PLAYER.pause();
  updateMiniUI();
}
function nextSong(d) {
  const target = (nowSong + d + MUSIC_DATA.length) % MUSIC_DATA.length;
  playSong(target);
}
function updateMiniUI() {
  const m = APP.querySelector(".mini");
  if (m) m.outerHTML = miniHTML();
}
PLAYER.addEventListener("play", updateMiniUI);
PLAYER.addEventListener("pause", updateMiniUI);
