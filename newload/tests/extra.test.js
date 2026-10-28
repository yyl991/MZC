const fs = require("fs");
const vm = require("vm");
const path = require("path").resolve(__dirname, "..");

const sb = { console };
sb.window = sb;
sb.globalThis = sb;
sb.G = new Proxy({}, { get: () => "<svg></svg>" });
sb.VIEWS = {};
sb.CFG = { roles: { 穆祉丞: { avatar: "./data/avatar/mzc.jpg", initial: "穆" } } };
sb.SS = {};
sb.chatNames = ["穆祉丞"];
sb.calls = [];
sb.notes = [
  ["旧备忘录 · 迟到", "如果早一点认识就好了", "如果早一点认识就好了。", "2026-11-15"],
];
sb.emailData = [
  { id: 1, from: "时代峰峻", subject: "周边发货提醒", preview: "你的周边已发货", time: "今天 20:00", body: "……", unread: true },
];
sb.photoSections = [];
sb.view = "settings";
sb.toastDev = () => {};
sb.vib = () => {};
sb.show = () => {};
sb.push = () => {};
sb.back = () => {};
sb.ampm = () => "下午 11:09";
sb.wdLong = () => "星期四";
sb.sfx = () => {};
sb.localStorage = {
  _d: {},
  getItem(k) { return this._d[k] === undefined ? null : this._d[k]; },
  setItem(k, v) { this._d[k] = String(v); },
  removeItem(k) { delete this._d[k]; },
};
const mkEl = (id) => ({
  id, style: {}, dataset: {}, classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
  setAttribute() {}, appendChild() {}, animate() {}, querySelectorAll: () => [], querySelector: () => null,
  addEventListener() {}, remove() {}, innerHTML: "", textContent: "", value: "", children: [],
});
const els = {};
sb.document = {
  createElement: () => mkEl("tmp"),
  getElementById: (id) => (els[id] = els[id] || mkEl(id)),
  querySelector: () => null,
  querySelectorAll: () => [],
  body: mkEl("body"),
};
sb.APP = { lastElementChild: null, querySelectorAll: () => [], querySelector: () => null };
sb.OV = { querySelector: () => null, querySelectorAll: () => [] };
sb.PLAYER = { dataset: {}, pause() {}, play: () => Promise.reject() };
sb.Audio = function () { return { play: () => Promise.reject(), pause() {}, dataset: {} }; };
vm.createContext(sb);
const load = (f) => vm.runInContext(fs.readFileSync(path + "/" + f, "utf8"), sb, { filename: f });
load("core/utils.js");
load("views/app_extra.js");

let fails = 0;
const ok = (n, c, e) => { if (!c) { fails++; console.log("FAIL " + n + (e ? " :: " + e : "")); } else console.log("OK   " + n); };

const ids = ["settings", "settings_display", "settings_wallpaper", "settings_notifications", "settings_about", "notes", "note_edit"];
ids.forEach((id) => {
  try {
    const v = sb.VIEWS[id]();
    ok("render " + id, v && v.html && v.html.length > 50, v && v.html && v.html.length);
  } catch (e) {
    ok("render " + id, false, e.message);
  }
});

// 设置开关
const before = sb.window._phoneSettings.wifi;
sb.phoneToggle("wifi", mkEl("x"));
ok("phoneToggle flips wifi", sb.window._phoneSettings.wifi !== before);
// 亮度
sb.setPhoneBrightness(60);
ok("brightness applied", String(sb.window._phoneSettings.brightness) === "0.6");
// 壁纸
sb.setPhoneWallpaper("./data/album/cat.jpg");
ok("wallpaper saved", sb.window._phoneSettings.wallpaper === "./data/album/cat.jpg");
ok("wallpaper persisted", JSON.parse(sb.localStorage.getItem("phone_settings") || "{}").wallpaper === "./data/album/cat.jpg");

// 备忘录增删改
const beforeLen = sb.notes.length;
sb.confirm = () => true;
sb.openNoteEditor(-1);
ok("note_edit view renders", sb.VIEWS.note_edit().html.includes("备忘录"));
sb.document.getElementById("note-edit-title").value = "测试标题";
sb.document.getElementById("note-edit-body").value = "测试内容";
sb.saveNote();
ok("saveNote adds", sb.notes.length === beforeLen + 1, sb.notes.length);
const newIdx = sb.notes.findIndex((n) => n[0] === "测试标题");
ok("note title stored", newIdx >= 0);
sb.deleteNote(newIdx);
ok("deleteNote removes", sb.notes.length === beforeLen);

console.log(fails === 0 ? "ALL PASS" : fails + " FAILS");
