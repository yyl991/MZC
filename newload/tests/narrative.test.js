// 剧情/交互规则测试：微信号、锁屏折叠、追命电话、节奏
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
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
  querySelector: (sel) => (_els["q:" + sel] = _els["q:" + sel] || mkEl(sel)),
  querySelectorAll: () => [],
  addEventListener() {},
  innerHTML: "",
  textContent: "",
  value: "",
  scrollTop: 0,
  scrollHeight: 0,
  offsetWidth: 1,
  getBoundingClientRect: () => ({ left: 0, top: 0, width: 0, height: 0 }),
});
const sb = { console };
sb.window = sb;
sb.globalThis = sb;
const _els = {};
sb.document = {
  createElement: (t) => mkEl(t),
  getElementById: (id) => (_els[id] = _els[id] || mkEl(id)),
  querySelector: (sel) => (_els["q:" + sel] = _els["q:" + sel] || mkEl(sel)),
  querySelectorAll: () => [],
  addEventListener() {},
  body: mkEl("body"),
  head: mkEl("head"),
  documentElement: mkEl("html"),
};
sb.localStorage = {
  _d: {},
  getItem(k) {
    return this._d[k] === undefined ? null : this._d[k];
  },
  setItem(k, v) {
    this._d[k] = String(v);
  },
  removeItem(k) {
    delete this._d[k];
  },
};
sb.navigator = { vibrate() {}, userAgent: "node" };
sb.location = { href: "http://localhost/", hostname: "localhost", search: "", reload() {} };
sb.performance = { now: () => Date.now() };
sb.requestAnimationFrame = () => 1;
sb.cancelAnimationFrame = () => {};
sb.setTimeout = () => 1;
sb.clearTimeout = () => {};
sb.setInterval = () => 1;
sb.clearInterval = () => {};
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

const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const scripts = html
  .split(/\r?\n/)
  .filter((line) => !line.trim().startsWith("//"))
  .flatMap((line) =>
    [...line.matchAll(/'\.\/((?:core|views|data)\/[^']+\.js)'/g)].map((m) => m[1]),
  );
for (const f of scripts) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), sb, {
    filename: f,
  });
}

let fails = 0;
const ok = (n, c, e) => {
  if (!c) {
    fails++;
    console.log("FAIL " + n + (e ? " :: " + e : ""));
  } else console.log("OK   " + n);
};

// 1. 每个联系人都要有微信号
const wxids = vm.runInContext("window.STORY.wxids", sb);
const chats = vm.runInContext("Object.keys(window.STORY.chats)", sb);
const noId = chats.filter((c) => !wxids[c]);
ok("每个联系人都有微信号", noId.length === 0, noId.join(","));
ok("微信号不重复", new Set(Object.values(wxids)).size === Object.keys(wxids).length);

// 资料页能显示
vm.runInContext('chatId = "MuAMuA"', sb);
const prof = vm.runInContext('VIEWS.wx_profile().html', sb);
ok("资料页显示微信号", prof.includes("mama"), "未找到");

// 2. 锁屏折叠
vm.runInContext("lockNotes.length = 0", sb);
for (let i = 0; i < 6; i++)
  vm.runInContext(
    `lockNotes.push({title:"某人${i}",body:"消息${i}",app:"wechat",time:"现在"})`,
    sb,
  );
vm.runInContext("renderLock()", sb);
const lockHTML = String(vm.runInContext('document.querySelector("#lkc").innerHTML', sb));
ok("锁屏只展开 3 条", (lockHTML.match(/class="ncard"/g) || []).length === 3);
ok("锁屏显示折叠提示", lockHTML.includes("还有 3 条更早的通知"), lockHTML.slice(-200));
ok("锁屏有免打扰", lockHTML.includes("免打扰"));
ok("锁屏不再有重置按钮", !lockHTML.includes("重置进度"));

// 3. 追命电话：已经回过消息就不再打
const target = "穆祉丞";
vm.runInContext(`chatData["${target}"].push(["我在路上了","me","下午 11:20"])`, sb);
let called = 0;
sb.incomingCallFrom = () => called++;
sb.scheduleCallAgain(target, "miss");
ok("回过消息不再追命", called === 0);

// 没回过消息 -> 会记一次追命
const target2 = "恩仔";
vm.runInContext(`chatData["${target2}"].push(["你在哪","them","下午 11:19"])`, sb);
const before = vm.runInContext(`chatData["${target2}"].length`, sb);
sb.scheduleCallAgain(target2, "miss");
const after = vm.runInContext(`chatData["${target2}"].length`, sb);
ok("没回消息会追问一句", after > before, before + "->" + after);

// 4. 节奏：第一条被推迟，后面越来越密
const p0 = vm.runInContext("pacedAt(0)", sb);
const p60 = vm.runInContext("pacedAt(60)", sb);
const p300 = vm.runInContext("pacedAt(300)", sb);
ok("开场先安静", p0 >= 30, p0);
ok("时间线有延迟", p60 > 60, p60);
ok("零点前能跑完", p300 < 900, p300);
const gapEarly = vm.runInContext("pacedAt(30) - pacedAt(27)", sb);
const gapLate = vm.runInContext("pacedAt(297) - pacedAt(294)", sb);
// 后段仍然更密，但整体放慢了（作者要求给玩家留探索时间），所以陡度阈值放宽到 0.75
ok("消息越来越急", gapLate < gapEarly * 0.75, gapEarly.toFixed(1) + "s -> " + gapLate.toFixed(1) + "s");
ok("压力循环存在", typeof vm.runInContext("pressureTick", sb) === "function");

// 5. 拍一拍后对方会「？」
ok("拍一拍函数存在", typeof sb.wxPatTap === "function");

// 6. 时间线交错：前 8 条不应该全是同一个人连发
vm.runInContext("buildInterleavedTimeline()", sb);
const senders = vm.runInContext(
  "CFG.timeline.filter(b=>b.from).slice(0,8).map(b=>b.from)",
  sb,
);
ok("消息交错发送", new Set(senders).size >= 4, senders.join(","));
const maxRun = senders.reduce(
  (m, x, i) => (i && x === senders[i - 1] ? m + 1 : m),
  1,
);
ok("没有连续同一人", maxRun <= 2, "最长连发 " + maxRun);

// 7. 不再存档
ok("saveChat 是空实现", !sb.saveChat.toString().includes("localStorage"));
ok("saveStory 是空实现", vm.runInContext("saveStory.toString().includes('localStorage')", sb) === false);

console.log(fails === 0 ? "ALL PASS" : fails + " FAILS");
process.exit(fails ? 1 : 0);
