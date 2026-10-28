// 存档一致性：刷新后不应该重复收到同一条时间线消息
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const scripts = html
  .split(/\r?\n/)
  .filter((line) => !line.trim().startsWith("//"))
  .flatMap((line) =>
    [...line.matchAll(/'\.\/((?:core|views|data)\/[^']+\.js)'/g)].map((m) => m[1]),
  );

const shared = {};

function boot() {
  const mkEl = (id) => ({
    id,
    style: {},
    dataset: {},
    classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
    setAttribute() {},
    getAttribute: () => "",
    appendChild() {},
    removeChild() {},
    remove() {},
    animate() {},
    querySelector: (sel) => mkEl(sel),
    querySelectorAll: () => [],
    addEventListener() {},
    innerHTML: "",
    textContent: "",
    value: "",
    scrollTop: 0,
    scrollHeight: 0,
    offsetWidth: 1,
    pause() {},
    play: () => Promise.resolve(),
    paused: true,
    currentTime: 0,
    duration: 0,
    volume: 1,
    muted: false,
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 0, height: 0 }),
  });
  const sb = { console };
  sb.window = sb;
  sb.globalThis = sb;
  const els = {};
  sb.document = {
    createElement: (t) => mkEl(t),
    getElementById: (id) => (els[id] = els[id] || mkEl(id)),
    querySelector: (sel) => (els["q:" + sel] = els["q:" + sel] || mkEl(sel)),
    querySelectorAll: () => [],
    addEventListener() {},
    body: mkEl("body"),
    head: mkEl("head"),
    documentElement: mkEl("html"),
  };
  sb.localStorage = {
    getItem: (k) => (shared[k] === undefined ? null : shared[k]),
    setItem: (k, v) => {
      shared[k] = String(v);
    },
    removeItem: (k) => {
      delete shared[k];
    },
  };
  Object.defineProperty(sb.localStorage, "length", {
    get: () => Object.keys(shared).length,
  });
  sb.navigator = { vibrate() {}, userAgent: "node" };
  sb.location = { href: "http://localhost/", hostname: "localhost", search: "", reload() {} };
  sb.performance = { now: () => Date.now() };
  sb.requestAnimationFrame = () => 1;
  sb.cancelAnimationFrame = () => {};
  sb.setTimeout = () => 1;
  sb.clearTimeout = () => {};
  sb.setInterval = () => 1;
  sb.clearInterval = () => {};
  sb.Image = function () {
    return { set src(v) {}, decode: () => Promise.resolve() };
  };
  sb.Audio = function () {
    return { play: () => Promise.reject(), pause() {}, dataset: {}, load() {} };
  };
  sb.AudioContext = function () {
    return {
      createOscillator: () => ({ connect() { return this; }, start() {}, stop() {}, frequency: {} }),
      createGain: () => ({ connect() { return this; }, gain: { value: 0, setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {} } }),
      destination: {},
      currentTime: 0,
    };
  };
  vm.createContext(sb);
  for (const f of scripts)
    vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), sb, { filename: f });
  return sb;
}

let fails = 0;
const ok = (n, c, e) => {
  if (!c) {
    fails++;
    console.log("FAIL " + n + (e ? " :: " + e : ""));
  } else console.log("OK   " + n);
};

// 第一次打开：跑完前 60 秒
const a = boot();
vm.runInContext("view = 'home'", a);
vm.runInContext("storyTick(4000)", a);
const countA = vm.runInContext("chatData['穆祉丞'].length", a);
const firedA = vm.runInContext("SS.fired.size", a);
ok("第一次有消息推进", firedA > 0, "fired=" + firedA);
ok("聊天记录已写入", Object.keys(shared).some((k) => k.startsWith("wx_chat_")));
ok("剧情进度已写入", !!shared["wb_story"]);

// 模拟刷新（同一份 localStorage）
const b = boot();
vm.runInContext("view = 'home'", b);
const countB = vm.runInContext("chatData['穆祉丞'].length", b);
ok("刷新后聊天记录一致", countB === countA, countA + " vs " + countB);
ok("刷新后进度已恢复", vm.runInContext("SS.fired.size", b) === firedA);

// 再跑同样的时间，不应该重复推送
vm.runInContext("storyTick(4000)", b);
const countC = vm.runInContext("chatData['穆祉丞'].length", b);
ok("不会重复推送", countC === countB, countB + " -> " + countC);

// 数据指纹
const sig = a.DATA_SIG;
ok("有数据指纹", typeof sig === "string" && sig.length > 0);

// 刷新后游戏时钟要接着走，不能回到 23:09
const saved1 = JSON.parse(shared["wb_story"]);
ok("存档记录时钟起点", typeof saved1.base === "number");
saved1.base = Date.now() - 120000; // 假装已经玩了 2 分钟
shared["wb_story"] = JSON.stringify(saved1);
const c = boot();
const elapsedC = vm.runInContext("elapsed()", c);
ok("刷新后时钟接着走", elapsedC > 110, elapsedC.toFixed(1) + "s");
ok("刷新后聊天仍一致", vm.runInContext("chatData['穆祉丞'].length", c) === countA);

// 超过 6 小时的存档整体作废（剧情 + 聊天一起清）
const saved2 = JSON.parse(shared["wb_story"]);
saved2.base = Date.now() - 7 * 3600 * 1000;
shared["wb_story"] = JSON.stringify(saved2);
boot();
ok("过期存档清掉剧情", !shared["wb_story"]);
ok("过期存档清掉聊天", !Object.keys(shared).some((k) => k.startsWith("wx_chat_")));

console.log(fails === 0 ? "ALL PASS" : fails + " FAILS");
process.exit(fails ? 1 : 0);
