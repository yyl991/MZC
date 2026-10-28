// 冒烟测试：按 index.html 的顺序把全部脚本跑一遍，确认没有加载期报错、视图齐全
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");

const mkEl = (id) => ({
  id,
  style: {},
  dataset: {},
  classList: {
    add() {},
    remove() {},
    toggle() {},
    contains: () => false,
  },
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
sb.location = { href: "http://localhost/", hostname: "localhost", reload() {} };
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
    createOscillator: () => ({ connect() {}, start() {}, stop() {}, frequency: {} }),
    createGain: () => ({ connect() {}, gain: { value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {} } }),
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

let error = null;
for (const f of scripts) {
  try {
    vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), sb, {
      filename: f,
    });
  } catch (e) {
    error = `加载 ${f} 失败: ${e.message}`;
    break;
  }
}

let fails = 0;
const ok = (n, c, e) => {
  if (!c) {
    fails++;
    console.log("FAIL " + n + (e ? " :: " + e : ""));
  } else console.log("OK   " + n);
};

ok("脚本全部加载成功", !error, error);
ok("脚本数量合理", scripts.length >= 15, scripts.length);
const need = [
  "wechat",
  "chat",
  "wx_chat_info",
  "wx_search",
  "wx_discover",
  "wx_contacts",
  "wx_me",
  "wx_contacts_sub",
  "wx_services",
  "wx_favorites",
  "wx_settings",
  "wx_profile",
  "moments",
  "wx_moment_compose",
  "phone",
  "sms",
  "notes",
  "mail",
  "photos",
  "weibo",
  "xianyu",
  "bilibili",
  "xhs",
  "settings",
];
const VIEWS = vm.runInContext("typeof VIEWS !== 'undefined' ? VIEWS : {}", sb);
const missing = need.filter((k) => typeof VIEWS[k] !== "function");
ok("关键视图齐全", missing.length === 0, missing.join(","));
ok("路由函数存在", typeof sb.show === "function" && typeof sb.back === "function");
ok("聊天存档函数存在", typeof sb.saveChat === "function");
ok("数据已装载", sb.chatNames.length > 5, sb.chatNames.length);
ok("本地调试判定存在", typeof vm.runInContext("IS_DEV_HOST", sb) === "boolean");
ok("重置进度函数存在", typeof sb.askResetProgress === "function" && typeof sb.resetAllProgress === "function");
let lockErr = null;
try {
  vm.runInContext("renderLock()", sb);
} catch (e) {
  lockErr = e.message;
}
ok("锁屏可渲染", !lockErr, lockErr);
const lockHTML = vm.runInContext('document.querySelector("#lkc").innerHTML', sb);
ok("锁屏有免打扰按钮", String(lockHTML).includes("免打扰"), lockHTML.slice(0, 60));
ok("锁屏有重置进度按钮", String(lockHTML).includes("重置进度"));

console.log(fails === 0 ? "ALL PASS" : fails + " FAILS");
process.exit(fails ? 1 : 0);
