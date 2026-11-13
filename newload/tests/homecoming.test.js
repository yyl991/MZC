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
    setTimeout: (fn, delay) => { fn.delay = delay; timers.push(fn); return timers.length; }, clearTimeout() {},
    setInterval() {}, clearInterval() {}, addEventListener() {},
    STORY: { homecomingTimeline: [{ id: "birthday", from: "恩仔", text: "birthday message" }], timeline: [{ at: 0, type: "choice" }, { at: 0, type: "ending" }, { at: 0, type: "notify", from: "cat", text: "x" }] },
    STORY_STATE: { fired: new Set(), fragments: new Set() },
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
let birthdayMessages = 0;
s.sb.deliverFrom = (from, text) => {
  assert.strictEqual(from, "恩仔");
  assert.strictEqual(text, "birthday message");
  birthdayMessages++;
};
s.run("updateHomecoming(GAME_END_AT - HOMECOMING_FAULT_SECONDS - 1)");
assert(!s.nodes.has("homecoming-fault"));
s.run("updateHomecoming(GAME_END_AT - HOMECOMING_FAULT_SECONDS)");
assert(s.nodes.has("homecoming-fault"));
// 零点前最后10秒：上半屏纯数字倒计时，00:00:00停留1秒后到00:00:01进传送幕。
s.run("updateHomecoming(GAME_END_AT - HOMECOMING_COUNTDOWN_SECONDS)");
assert(s.nodes.has("homecoming-countdown"));
assert.strictEqual(s.nodes.get("homecoming-countdown").textContent, "00:00:10");
s.run("updateHomecoming(GAME_END_AT - 1)");
assert.strictEqual(s.nodes.get("homecoming-countdown").textContent, "00:00:01");
s.run("updateHomecoming(GAME_END_AT)");
assert.strictEqual(s.nodes.get("homecoming-countdown").textContent, "00:00:00");
assert(!s.nodes.has("homecoming-scene"));
s.sb.now += 661000;
s.run("updateHomecoming(elapsed())");
assert(s.nodes.has("homecoming-scene"));
assert(!s.nodes.has("homecoming-countdown"));
assert(!s.nodes.has("homecoming-fault"));
assert(s.run("SS.arriveHome"));
assert.strictEqual(s.run("gameMin()"), 1440);
let notifications = 0;
s.sb.incomingMsgFrom = () => { notifications++; };
s.run("storyTick(9999); pressureTick(); midnightBoom();");
assert.strictEqual(notifications, 0);
assert.strictEqual(s.run("SS.homecoming.phase"), "transferred");
assert.strictEqual(birthdayMessages, 0); // 传送幕期间不被消息打断
// 刷新停在传送幕，继续后从00:00按真实分钟流逝。
const restored = session("", s.storage);
restored.run("loadGameState(); base = 0; startClock(); updateHomecoming(elapsed());");
assert.strictEqual(restored.run("SS.homecoming.phase"), "transferred");
assert(restored.nodes.has("homecoming-scene"));
s.run("continueHomecoming()");
assert.strictEqual(birthdayMessages, 1);
assert(!s.nodes.has("homecoming-scene"));
assert.strictEqual(s.run("view"), "home");
s.sb.now += 120000;
assert.strictEqual(s.run("gameMin()"), 1442);
s.run("continueHomecoming(); saveGameState();");
assert.strictEqual(birthdayMessages, 1);
assert.strictEqual(s.run("gameMin()"), 1442); // 重复继续不重置时钟
const free = session("", s.storage);
free.sb.deliverFrom = () => { birthdayMessages++; };
free.run("loadGameState(); base = 0; startClock(); updateHomecoming(elapsed());");
assert.strictEqual(birthdayMessages, 1); // 刷新自由探索不重发
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
// 旧预览即使已继续，下次打开仍从20秒前开始；正式存档保持不变。
const originalSave = s.storage.mzc_game_save;
preview.storage.mzc_homecoming_preview = preview.storage.mzc_game_save;
preview.run("fit = () => {}; buildInterleavedTimeline = () => {}; tick = () => {}; hideBoot = () => {}; base = 0; initApp();");
assert.strictEqual(preview.run("elapsed()"), 640);
assert(!preview.run("SS.homecoming"));
assert.strictEqual(preview.storage.mzc_game_save, originalSave);
assert.strictEqual(preview.nodes.get("ending-preview-control").textContent, "重播结尾 · 21秒");
preview.nodes.get("ending-preview-control").onclick();
assert.strictEqual(preview.sb.location.href, "/?dev=1&endingPreview=1");
const normal = session();
normal.run("mountEndingPreviewControl()");
assert.strictEqual(normal.nodes.get("ending-preview-control").textContent, "体验结尾 · 21秒");
const production = session("?dev=0");
production.run("mountEndingPreviewControl()");
assert(!production.nodes.has("ending-preview-control"));

const faults = session();
faults.sb.callState = "active";
const countBefore = faults.timers.length;
for (const fraction of [0, .18, .38, .57, .76, .94]) {
  faults.run(`updateHomecoming(GAME_END_AT - HOMECOMING_FAULT_SECONDS + ${fraction} * HOMECOMING_FAULT_SECONDS)`);
  assert(faults.nodes.has("homecoming-fault"));
  faults.timers.at(-1)();
  assert(!faults.nodes.has("homecoming-fault"));
}
assert.strictEqual(faults.timers.length - countBefore, 6);
assert.strictEqual(faults.sb.callState, "active");
assert.strictEqual(faults.run("view"), "lock");
faults.run("updateHomecoming(GAME_END_AT - .2)");
assert(!faults.nodes.has("homecoming-fault"));
const background = session();
background.run("updateHomecoming(GAME_END_AT - 1)");
assert(!background.nodes.has("homecoming-fault"));
const reduced = session();
reduced.sb.matchMedia = () => ({ matches: true });
reduced.run("updateHomecoming(GAME_END_AT - HOMECOMING_FAULT_SECONDS)");
assert(!reduced.nodes.has("homecoming-fault"));
// 倒计时是核心信息：减少动态效果时仍显示数字，只去掉逐秒闪动。
reduced.run("updateHomecoming(GAME_END_AT - HOMECOMING_COUNTDOWN_SECONDS)");
assert(reduced.nodes.has("homecoming-countdown"));
assert.strictEqual(reduced.nodes.get("homecoming-countdown").textContent, "00:00:10");
assert.strictEqual(preview.run("gameMin()"), 1435);
// 生日分句逐条发送，刷新续发；旧长句已发则不重复。
const split = session();
split.sb.STORY.homecomingTimeline = [0, 1.5, 3, 4.5].map((after, i) => ({ id: `part-${i}`, group: "old-birthday", from: "恩仔", text: `line-${i}`, after }));
const sent = [];
split.sb.deliverFrom = (_, text) => sent.push(text);
split.run("beginHomecoming(); continueHomecoming()");
assert.deepStrictEqual(sent, ["line-0"]);
split.sb.now += 2000;
split.run("updateHomecoming(elapsed())");
assert.deepStrictEqual(sent, ["line-0", "line-1"]);
const resumeSplit = session("", split.storage);
resumeSplit.sb.STORY.homecomingTimeline = split.sb.STORY.homecomingTimeline;
resumeSplit.sb.deliverFrom = (_, text) => sent.push(text);
resumeSplit.run("loadGameState(); base = 0; startClock()");
resumeSplit.sb.now += 3000;
resumeSplit.run("updateHomecoming(elapsed()); updateHomecoming(elapsed())");
assert.deepStrictEqual(sent, ["line-0", "line-1", "line-2", "line-3"]);
resumeSplit.run('SS.homecoming.fired = ["old-birthday"]; updateHomecoming(elapsed())');
assert.strictEqual(sent.length, 4);
// 到家后即使有遗留层也会清理；更新红点不触碰主屏innerHTML或黑胶节点。
const badgeSession = session();
const icon = { badge: null, querySelector() { return this.badge; }, appendChild(el) { this.badge = el; } };
const app = { dataset: { app: "wechat" }, querySelector() { return icon; } };
const home = badgeSession.nodes.get("homeL");
home.innerHTML = "existing vinyl";
home.querySelectorAll = () => [app];
badgeSession.run("unread = {test: 1}; updateHomeBadges()");
const firstBadge = icon.badge;
assert.strictEqual(firstBadge.textContent, "1");
badgeSession.run("unread.test = 4; updateHomeBadges()");
assert.strictEqual(icon.badge, firstBadge);
assert.strictEqual(firstBadge.textContent, "4");
assert.strictEqual(home.innerHTML, "existing vinyl");
const stale = { remove() { badgeSession.nodes.delete("homecoming-fault"); } };
badgeSession.nodes.set("homecoming-fault", stale);
badgeSession.run('SS.homecoming = { phase: "exploring", continuedAt: elapsed() }; updateHomecoming(elapsed())');
assert(!badgeSession.nodes.has("homecoming-fault"));
{
function phoneSession() {
  const p = session();
  p.sb.pauseBGM = () => {};
  p.run(fs.readFileSync(path.join(root, "views/app_extra.js"), "utf8"));
  p.sb.renderCall = () => {};
  p.sb.closeDialpad = () => {};
  p.sb.closeCallUI = () => {};
  p.sb.startRing = () => {};
  p.sb.clearPatience = () => {};
  return p;
}
const longCall = phoneSession(), endings = [];
longCall.sb.deliverFrom = (from, text) => endings.push([from, text]);
longCall.sb.incomingCallFrom("cat"); longCall.sb.answerCall();
longCall.sb.now += 8000;longCall.sb.endCall();
assert.strictEqual(longCall.run('SS.callDone.cat'),1);
assert.strictEqual(JSON.parse(longCall.storage.mzc_game_save).SS.callDone.cat,1);
const endTimer = longCall.timers.find(fn => fn.delay === 1400);
assert(endTimer);assert.strictEqual(endings.length,0);endTimer();
assert.strictEqual(endings.length,1);
const pending = longCall.timers.length, oldSession = longCall.sb._callSession;
longCall.run('callState = ""');
longCall.sb.incomingCallFrom("cat");longCall.sb.scheduleCallAgain("cat","hangup");longCall.sb.scheduleCallBack("cat");
assert.strictEqual(longCall.timers.length,pending);
assert.strictEqual(longCall.sb._callSession,oldSession);
const reloadDone = session("",longCall.storage);
reloadDone.run("loadGameState()");assert.strictEqual(reloadDone.run("SS.callDone.cat"),1);
const resetStorage={...longCall.storage};delete resetStorage.mzc_game_save;
const newGame=session("",resetStorage);newGame.run("loadGameState()");
assert(!newGame.run("SS.callDone.cat"));
const oldSave=JSON.parse(longCall.storage.mzc_game_save);delete oldSave.SS.callDone;
const legacy=session("",{mzc_game_save:JSON.stringify(oldSave)});legacy.run("loadGameState()");
assert.strictEqual(legacy.run("Object.keys(SS.callDone).length"),0);
const shortCall=phoneSession();
shortCall.sb.incomingCallFrom("cat");shortCall.sb._isCallBackName="cat";shortCall.sb.answerCall();
shortCall.sb.now+=7999;shortCall.sb.endCall();
assert(!shortCall.run("SS.callDone.cat"));assert(!shortCall.sb._playerCalledBack?.cat);
assert(!shortCall.timers.some(fn=>fn.delay===1400));
const outgoing=phoneSession();outgoing.sb.dial("cat",false);
assert(!outgoing.run("SS.callDone.cat"));assert.strictEqual(outgoing.run("callState"),"dialing");
outgoing.timers.find(fn=>fn.delay===3000)(); // 呼出3秒未接结束，安排回拨
assert(!outgoing.run("SS.callDone.cat"));
outgoing.timers.at(-1)(); // 回拨
assert.strictEqual(outgoing.run("callState"),"ring");
outgoing.sb.answerCall();outgoing.sb.now+=8000;outgoing.sb.endCall();
assert.strictEqual(outgoing.run("SS.callDone.cat"),1);
const stopped=session();const notifications=[];
stopped.sb.incomingMsgFrom=(from)=>notifications.push(from);
stopped.sb.incomingCallFrom=()=>{throw Error("completed caller must not ring");};
stopped.run('SS.callDone.cat=1;CFG.timeline=[{at:0,type:"notify",from:"cat",text:"x"},{at:0,type:"call",from:"cat"},{at:0,type:"notify",from:"rabbit",text:"ok"}];storyTick(1000)');
assert.deepStrictEqual(notifications,["rabbit"]);
stopped.run('CFG.chats={cat:{},rabbit:{}};CFG.nagFrom=0;base=Date.now()-1000000;window._nextNag=Date.now()-1;pressureTick()');
assert.deepStrictEqual(notifications,["rabbit","rabbit"]);
stopped.sb.deliverFrom=(from)=>notifications.push(from);
stopped.run('SS.callDone["恩仔"]=1;SS.homecoming={phase:"exploring",continuedAt:elapsed()};deliverHomecomingTimeline()');
assert.strictEqual(notifications.at(-1),"恩仔");
}
console.log("OK homecoming: states, birthday, fault cleanup; 8s call completion, persistence, short/outgoing/callback and stop gates");
