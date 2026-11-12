// 结尾跨零点、自由探索、存档恢复与异步催命的回归。
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const root = path.resolve(__dirname, "..");
function session(search = "", storage = {}) {
  const nodes = new Map();
  const timers = [];
  const make = (id = "") => ({
    id, style: { setProperty(k, v) { this[k] = v; } }, dataset: {},
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    addEventListener() {}, setAttribute() {}, focus() {}, pause() {},
    appendChild(el) { nodes.set(el.id, el); },
    remove() { nodes.delete(this.id); },
    querySelector() { return make(); }, querySelectorAll() { return []; },
    getAnimations() { return []; }, innerHTML: "",
  });
  const get = (id) => { if (!nodes.has(id)) nodes.set(id, make(id)); return nodes.get(id); };
  const sb = {
    console, now: 1000000, location: { hostname: "localhost", pathname: "/", search },
    Date: { now: () => sb.now }, navigator: {},
    document: {
      querySelector: (sel) => get(sel.slice(1)), querySelectorAll: () => [],
      getElementById: (id) => /^(homecoming-|ending-preview-)/.test(id) ? nodes.get(id) || null : get(id), createElement: () => make(),
      addEventListener() {},
    },
    localStorage: { getItem: k => storage[k] || null, setItem: (k, v) => { storage[k] = v; }, removeItem: k => { delete storage[k]; } },
    setTimeout: fn => { timers.push(fn); return timers.length; }, clearTimeout() {},
    setInterval() {}, clearInterval() {}, addEventListener() {},
    STORY: { timeline: [{ at: 0, type: "choice" }, { at: 0, type: "ending" }, { at: 0, type: "notify", from: "cat", text: "x" }] },
    STORY_STATE: { fired: new Set(), missed: new Set(), fragments: new Set() },
    DATA_SIG: "test", chatData: {}, unread: {}, renderHome() {},
    pad: n => String(n).padStart(2, "0"), speech: [], calls: [], notes: [], photoSections: [],
  };
  sb.window = sb;
  vm.createContext(sb);
  vm.runInContext(fs.readFileSync(path.join(root, "core/app.js"), "utf8"), sb);
  // 真实页面依赖在此用 spy 代替，仅检查结尾路由与事件状态。
  vm.runInContext("base = Date.now(); setStatus = () => {}; updateIsland = () => {};", sb);
  return { sb, nodes, timers, storage, run: code => vm.runInContext(code, sb) };
}
const s = session();
s.run("updateHomecoming(GAME_END_AT - 25)");
assert(!s.nodes.has("homecoming-fault"));
s.run("updateHomecoming(GAME_END_AT - 24)");
assert(s.nodes.has("homecoming-fault"));
s.sb.now += 660000;
s.run("updateHomecoming(elapsed())");
assert(s.nodes.has("homecoming-scene"));
assert(!s.nodes.has("homecoming-fault"));
assert(s.run("SS.arriveHome"));
assert.strictEqual(s.run("gameMin()"), 1440);
let notifications = 0;
s.sb.incomingMsgFrom = () => { notifications++; };
s.run("storyTick(9999); pressureTick(); midnightBoom();");
assert.strictEqual(notifications, 0);
assert.strictEqual(s.run("SS.homecoming.phase"), "transferred");
// 刷新停在传送幕，继续后从00:00按真实分钟流逝。
const restored = session("", s.storage);
restored.run("loadGameState(); base = 0; startClock(); updateHomecoming(elapsed());");
assert.strictEqual(restored.run("SS.homecoming.phase"), "transferred");
assert(restored.nodes.has("homecoming-scene"));
s.run("continueHomecoming()");
assert(!s.nodes.has("homecoming-scene"));
assert.strictEqual(s.run("view"), "home");
s.sb.now += 120000;
assert.strictEqual(s.run("gameMin()"), 1442);
s.run("continueHomecoming(); saveGameState();");
assert.strictEqual(s.run("gameMin()"), 1442); // 重复继续不重置时钟
const free = session("", s.storage);
free.run("loadGameState(); base = 0; startClock(); updateHomecoming(elapsed());");
assert.strictEqual(free.run("gameMin()"), 1442);
assert(!free.nodes.has("homecoming-scene"));
// 旧A/B beat被忽略，其他正常剧情在回家前仍能运行。
const before = session();
before.sb.incomingMsgFrom = () => { notifications++; };
before.run("storyTick(10)");
assert.strictEqual(notifications, 1);
assert(!before.run("SS.arriveHome"));
// 快速预览与正式存档隔离。
const preview = session("?endingPreview=1", s.storage);
assert.strictEqual(preview.run("GAME_SAVE_KEY"), "mzc_homecoming_preview");
preview.run("loadGameState()");
assert(!preview.run("SS.homecoming"));
// 旧预览即使已继续，下次打开仍从8秒前开始；正式存档保持不变。
const originalSave = s.storage.mzc_game_save;
preview.storage.mzc_homecoming_preview = preview.storage.mzc_game_save;
preview.run("fit = () => {}; buildInterleavedTimeline = () => {}; tick = () => {}; hideBoot = () => {}; base = 0; initApp();");
assert.strictEqual(preview.run("elapsed()"), 652);
assert(!preview.run("SS.homecoming"));
assert.strictEqual(preview.storage.mzc_game_save, originalSave);
assert.strictEqual(preview.nodes.get("ending-preview-control").textContent, "重播结尾 · 8秒");
preview.nodes.get("ending-preview-control").onclick();
assert.strictEqual(preview.sb.location.href, "/?dev=1&endingPreview=1");
const normal = session();
normal.run("mountEndingPreviewControl()");
assert.strictEqual(normal.nodes.get("ending-preview-control").textContent, "体验结尾 · 8秒");
const production = session("?dev=0");
production.run("mountEndingPreviewControl()");
assert(!production.nodes.has("ending-preview-control"));
console.log("OK homecoming: boundary, continue, clock, reload, legacy beats, isolated/repeatable 8s preview");
