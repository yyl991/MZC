let mapSel = null,
  mapPos = { x: -480, y: -640 };
const MAP_PLACES = [
  {
    id: "home",
    name: "家",
    sub: "回家路线",
    x: 700,
    y: 880,
    color: "#5e5ce6",
    glyph: "home",
    fav: true,
    info: [
      ["地址", "中延大学附近"],
      ["备注", "门留着"],
    ],
  },
  {
    id: "street",
    name: "街角",
    sub: "捡到手机的地方",
    x: 500,
    y: 600,
    color: "#ff9f0a",
    glyph: "pin",
    fav: false,
    info: [],
  },
  {
    id: "school",
    name: "中延大学",
    sub: "学校",
    x: 300,
    y: 400,
    color: "#34c759",
    glyph: "pin",
    fav: false,
    info: [],
  },
];
function mapSVG() {
  return `<svg width="900" height="1200" viewBox="0 0 900 1200" style="position:absolute;inset:0"><rect width="900" height="1200" fill="#f2efe9"/><path d="M0 980C160 940 260 1010 380 1080S640 1150 900 1120V1200H0Z" fill="#b9dcf7"/><path d="M60 700h260v230H60Z" fill="#cfe8c4" rx="20"/><path d="M820 0h80v380h-80Z" fill="#cfe8c4"/><rect x="110" y="110" width="460" height="460" rx="18" fill="#ece3d6"/><g stroke="#d8d3ca" stroke-width="22" fill="none" stroke-linecap="round"><path d="M0 605H900"/><path d="M590 0V1200"/></g><g stroke="#fff" stroke-width="18" fill="none" stroke-linecap="round"><path d="M590 0V1200"/></g><path d="M0 605H900" stroke="#ffe08a" stroke-width="20"/></svg>`;
}
const MG = {
  home: '<path d="M4 11 12 4l8 7v9h-5v-6H9v6H4Z"/>',
  pin: '<circle cx="12" cy="10" r="3"/><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z"/>',
};
const mg = (k) =>
  `<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">${MG[k] || MG.pin}</svg>`;
const placeById = (id) => MAP_PLACES.find((p) => p.id === id);
function mapCanvas() {
  const pins = MAP_PLACES.map(
    (p) =>
      `<div class="mpin ${mapSel === p.id ? "sel" : ""}" style="left:${p.x}px;top:${p.y}px" onclick="event.stopPropagation();selPlace('${p.id}')"><span class="pc" style="background:${p.color}">${mg(p.glyph)}</span>${esc(p.name)}</div>`,
  ).join("");
  return mapSVG() + pins;
}
function setMapPos(x, y, anim) {
  const cv = $("#mapcv");
  if (!cv) return;
  const W = SCREEN.clientWidth,
    H = SCREEN.clientHeight;
  mapPos = {
    x: Math.min(0, Math.max(W - 900, x)),
    y: Math.min(0, Math.max(H - 1200, y)),
  };
  const t = `translate(${mapPos.x}px, ${mapPos.y}px)`;
  if (anim)
    cv.animate(
      [{ transform: cv.style.transform || "none" }, { transform: t }],
      { duration: 450, easing: "cubic-bezier(.2,.9,.25,1)" },
    );
  cv.style.transform = t;
}
function centerOn(p, anim) {
  const W = SCREEN.clientWidth,
    H = SCREEN.clientHeight;
  setMapPos(W / 2 - p.x, H * 0.27 - p.y, anim);
}
function selPlace(id) {
  mapSel = id;
  const s = $("#msheet");
  if (s) {
    s.innerHTML = mapSheet();
    s.animate(
      [
        { transform: "translateY(16px)", opacity: 0.6 },
        { transform: "none", opacity: 1 },
      ],
      { duration: 260 },
    );
  }
  document
    .querySelectorAll(".mpin")
    .forEach((el) => el.classList.remove("sel"));
  if (id) {
    const p = placeById(id);
    const i = MAP_PLACES.indexOf(p);
    const el = document.querySelectorAll(".mpin")[i];
    if (el) el.classList.add("sel");
    centerOn(p, true);
  }
}
function mapSheet() {
  if (mapSel) {
    const p = placeById(mapSel);
    return `<div class="grab"></div><div class="mdet"><div style="display:flex;justify-content:space-between;align-items:flex-start"><div><h2>${esc(p.name)}</h2><div class="sb">${esc(p.sub)}</div></div><button onclick="selPlace(null)" style="width:30px;height:30px;border-radius:50%;background:#e3e3e8;color:#7c7c80;font-size:17px">✕</button></div><div class="acts"><button class="pri" onclick="toastDev()">${G.send.replace("<svg", '<svg style="color:#fff"')}路线</button><button onclick="toastDev()">${G.star}收藏</button></div><div class="inf">${(p.info.length ? p.info : [["信息", "暂无更多信息"]]).map((r) => `<div><small>${esc(r[0])}</small>${esc(r[1])}</div>`).join("")}</div></div>`;
  }
  return `<div class="grab"></div><div class="srch" onclick="toastDev()" style="margin:0 0 14px;background:rgba(118,118,128,.14)">${G.search}搜索地图</div><div style="font-size:15px;font-weight:600;color:var(--grey);margin-bottom:8px">收藏</div><div class="mfav">${MAP_PLACES.filter(
    (p) => p.fav,
  )
    .map(
      (p) =>
        `<button onclick="selPlace('${p.id}')"><span class="fc" style="background:${p.color}">${mg(p.glyph)}</span>${esc(p.name)}<small>${esc(p.sub)}</small></button>`,
    )
    .join("")}</div>`;
}
VIEWS.maps = () => ({
  cls: "mapv",
  html: `<div class="mapwrap" id="mapwrap"><div class="mapcv" id="mapcv">${mapCanvas()}</div></div><div class="mbtns"><button onclick="centerOn(placeById('home'),true)">${'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3.5 3.5 10.6l7.2 2.7 2.7 7.2Z"/></svg>'}</button></div><div class="msheet" id="msheet">${mapSheet()}</div>`,
  init: (pg) => {
    centerOn(placeById(mapSel || "home"));
    const w = pg.querySelector("#mapwrap");
    let x0 = null,
      y0 = 0,
      sx = 0,
      sy = 0,
      mv = false;
    w.addEventListener("pointerdown", (e) => {
      x0 = e.clientX;
      y0 = e.clientY;
      sx = mapPos.x;
      sy = mapPos.y;
      mv = false;
    });
    w.addEventListener("pointermove", (e) => {
      if (x0 === null) return;
      const dx = (e.clientX - x0) / SC,
        dy = (e.clientY - y0) / SC;
      if (Math.hypot(dx, dy) > 4) mv = true;
      if (mv) setMapPos(sx + dx, sy + dy);
    });
    w.addEventListener("pointerup", () => {
      x0 = null;
    });
  },
});
