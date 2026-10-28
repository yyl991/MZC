const fs = require("fs");
const vm = require("vm");
const path = require("path").resolve(__dirname, "..");

const sb = { console };
sb.window = sb; sb.globalThis = sb;
sb.G = new Proxy({}, { get: () => "<svg></svg>" });
sb.VIEWS = {}; sb.CFG = { roles: {} }; sb.SS = {};
sb.photoSections = [];
sb.toastDev = () => {}; sb.vib = () => {}; sb.show = () => {}; sb.push = () => {}; sb.back = () => {};
const mkEl = (id) => ({
  id, style: {}, dataset: {}, classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
  setAttribute() {}, appendChild() {}, animate() {}, querySelectorAll: () => [], querySelector: () => null,
  addEventListener() {}, remove() {}, innerHTML: "", textContent: "", value: "", children: [],
});
const els = {};
sb.document = {
  createElement: () => mkEl("tmp"),
  getElementById: (id) => (els[id] = els[id] || mkEl(id)),
  querySelector: () => null, querySelectorAll: () => [], body: mkEl("body"),
};
els.screen = mkEl("screen");
els.screen.appendChild = (c) => { sb._lastRoot = c; };
sb.Audio = function () { return { play: () => Promise.reject(), pause() {}, dataset: {} }; };
vm.createContext(sb);
const load = (f) => vm.runInContext(fs.readFileSync(path + "/" + f, "utf8"), sb, { filename: f });
let fails = 0;
const ok = (n, c, e) => { if (!c) { fails++; console.log("FAIL " + n + (e ? " :: " + e : "")); } else console.log("OK   " + n); };

load("core/utils.js");
load("views/app_photos.js");

const media = sb.getPhoneMedia();
ok("phone media list", media.length >= 10, media.length);
ok("media all local", media.every((m) => m.src.startsWith("./data/album/")));

let picked = null;
sb.openPhoneAlbumPicker({ multiple: false, onDone: (u) => (picked = u) });
ok("picker mounted", !!sb._lastRoot && sb._lastRoot.innerHTML.includes("取消"));
ok("picker uses local album", sb._lastRoot.innerHTML.includes("./data/album/mzc.jpg"));
sb.phoneAlbumTap(1);
ok("single pick returns 1", Array.isArray(picked) && picked.length === 1, JSON.stringify(picked));
ok("state cleared after pick", sb._phoneAlbumState === null);

picked = null;
sb.openPhoneAlbumPicker({ multiple: true, max: 2, onDone: (u) => (picked = u) });
sb.phoneAlbumTap(1); sb.phoneAlbumTap(2);
sb.phoneAlbumDone();
ok("multi pick returns 2", Array.isArray(picked) && picked.length === 2, JSON.stringify(picked));

picked = null;
sb.openPhoneAlbumPicker({ multiple: true, imagesOnly: true, onDone: (u) => (picked = u) });
const disp = sb._phoneAlbumState.display;
const vIdx = disp.findIndex((x) => x.isVideo || /\.(mp4|webm|mov)$/i.test(x.src || ""));
ok("video in display", vIdx >= 0);
sb.phoneAlbumTap(vIdx);
sb.phoneAlbumDone();
ok("imagesOnly filters video", picked === null, JSON.stringify(picked));

const pv = sb.VIEWS.photos();
ok("photos view renders", pv.html.includes("照片") || pv.html.length > 100);

console.log(fails === 0 ? "ALL PASS" : fails + " FAILS");
