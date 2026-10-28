"use strict";

// 全局唯一的语言兜底函数（只留它，没有任何多余变量）
function t(k, ...a) {
  const dict = {
    today: "今天", yesterday: "昨天", now: "现在",
    app_wechat: "微信", app_weibo: "微博", app_photos: "照片", app_mail: "邮件", 
    app_clock: "时钟", app_notes: "备忘录", app_weather: "天气", app_settings: "设置", 
    app_phone: "电话", app_safari: "Safari", app_music: "音乐", app_xianyu: "闲鱼", 
    app_bilibili: "B站", app_xhs: "小红书", app_sms: "短信", app_recorder: "录音", 
    app_privateAlbum: "私密相册", app_calendar: "日历"
  };
  let s = dict[k] || k;
  a.forEach((v, i) => { s = s.split("{" + i + "}").join(v); });
  return s;
}

const dn = (n) => (typeof DISPLAY !== "undefined" && DISPLAY[n]) || n;
const pad = (n) => String(n).padStart(2, "0");
const esc = (v) => String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const _fc = {};
// 直接写死 zh-CN，不需要外部变量
const _f = (o) => { const k = JSON.stringify(o); return _fc[k] || (_fc[k] = new Intl.DateTimeFormat("zh-CN", o)); };
const _d = (y, m, d, h = 12, mi = 0) => new Date(y, m - 1, d, h, mi);

function fmtTime(min) { min = ((Math.round(min) % 1440) + 1440) % 1440; return _f({ hour: "numeric", minute: "2-digit" }).format(_d(2026, 10, 17, Math.floor(min / 60), min % 60)); }
const fmtFull = (y, m, d) => _f({ year: "numeric", month: "long", day: "numeric", weekday: "long" }).format(_d(y, m, d));
const fmtYMD = (y, m, d) => _f({ year: "numeric", month: "long", day: "numeric" }).format(_d(y, m, d));
const fmtMD = (m, d) => _f({ month: "long", day: "numeric" }).format(_d(2026, m, d));
const fmtYM = (y, m) => _f({ year: "numeric", month: "long" }).format(_d(y, m, 1));
const fmtMonth = (m) => _f({ month: "long" }).format(_d(2026, m, 1));
const fmtYear = (y) => _f({ year: "numeric" }).format(_d(y, 6, 1));
const fmtNum = (y, m, d) => _f({ year: "numeric", month: "numeric", day: "numeric" }).format(_d(y, m, d));

const wdLong = (y, m, d) => _f({ weekday: "long" }).format(_d(y, m, d));
const wdShort = (y, m, d) => _f({ weekday: "short" }).format(_d(y, m, d));
const wdNarrow = () => [0, 1, 2, 3, 4, 5, 6].map((i) => _f({ weekday: "narrow" }).format(_d(2026, 10, 4 + i)));
const fmtLockDate = () => _f({ month: "long", day: "numeric", weekday: "long" }).format(_d(2026, 11, 15));
const fmtHour = (h) => _f({ hour: "numeric" }).format(_d(2026, 10, 17, h, 0));

function alarmParts(h, mi) {
  const ps = _f({ hour: "numeric", minute: "2-digit" }).formatToParts(_d(2026, 10, 17, h, mi));
  const di = ps.findIndex((p) => p.type === "dayPeriod");
  const dp = di >= 0 ? ps[di].value : "";
  const tm = ps.filter((p) => p.type !== "dayPeriod").map((p) => p.value).join("").trim();
  const hi = ps.findIndex((p) => p.type === "hour");
  return { dp, tm, before: di >= 0 && di < hi };
}

function parseLabel(l) {
  let m = l.match(/^(\d{4})年(\d+)月(\d+)日$/);
  if (m) return { y: +m[1], m: +m[2], d: +m[3] };
  m = l.match(/^(\d+)月(\d+)日$/);
  if (m) return { y: 2026, m: +m[1], d: +m[2] };
  return null;
}
function fmtLabel(l, full) {
  if (l === "今天") return full ? fmtFull(2026, 11, 15) : "今天";
  if (l === "昨天") return "昨天";
  const p = parseLabel(l);
  if (!p) return l;
  if (!p.d) return fmtYM(p.y, p.m);
  if (full) return fmtFull(p.y, p.m, p.d);
  return p.y === 2026 ? fmtMD(p.m, p.d) : fmtYMD(p.y, p.m, p.d);
}

const ZH_WD = { 星期日: 0, 星期一: 1, 星期二: 2, 星期三: 3, 星期四: 4, 星期五: 5, 星期六: 6 };

function navHTML(o) {
  return `<div class="nav ${o.solid ? "solid" : ""}">${o.back !== undefined ? `<button class="nb-back" onclick="${o.backFn || "back()"}">${G.chevL}</button>` : o.left || "<span></span>"}<div class="nb-title">${o.title || ""}</div><div class="nb-right">${o.right || ""}</div></div>`;
}
function tabbar(items, on, cls = "") {
  return `<div class="tabbar ${cls}">${items.map(([ic, l, fn], i) => `<button class="${i === on ? "on" : ""}"${fn ? ` onclick="${fn}"` : ""}>${G[ic] || ic}<span>${l}</span></button>`).join("")}</div>`;
}
const sw = (on, fn) => `<button class="sw ${on ? "on" : ""}" onclick="this.classList.toggle('on');vib(8);${fn || ""}"></button>`;

// "下午 10:11" / "10:11 PM" / "23:09" → 当天分钟数
function timeToMin(s) {
  if (!s) return 0;
  const str = String(s);
  let m = str.match(/(上午|下午)\s*(\d+):(\d+)/);
  if (m) {
    let h = parseInt(m[2]);
    if (m[1] === "下午" && h < 12) h += 12;
    if (m[1] === "上午" && h === 12) h = 0;
    return h * 60 + parseInt(m[3]);
  }
  m = str.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (m) {
    let h = parseInt(m[1]);
    const ap = (m[3] || "").toUpperCase();
    if (ap === "PM" && h < 12) h += 12;
    if (ap === "AM" && h === 12) h = 0;
    return h * 60 + parseInt(m[2]);
  }
  return 0;
}
// 聊天列表右上角的时间文案（上午/下午 H:MM）
function wxTimeLabel(s) {
  const min = timeToMin(s);
  const h = Math.floor(min / 60) % 24;
  return `${h >= 12 ? "下午" : "上午"} ${h % 12 || 12}:${pad(min % 60)}`;
}