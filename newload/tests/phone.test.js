const fs = require("fs");
const vm = require("vm");
const path = require("path").resolve(__dirname, "..");

const sb = { console };
sb.window = sb;
sb.globalThis = sb;
sb.G = new Proxy({}, { get: () => "<svg></svg>" });
sb.VIEWS = {};
sb.CFG = { roles: {} };
sb.SS = {};
sb.chatNames = ["穆祉丞", "MuAMuA", "恩仔"];
sb.calls = [
  ["穆小恩", "今天 23:08", "呼出"],
  ["MuAMuA", "今天 23:05", "未接来电"],
];
sb.smsData = undefined;
sb.toastDev = () => {};
sb.ampm = (m) => "下午 " + Math.floor(m / 60) + ":" + String(m % 60).padStart(2, "0");
sb.wdLong = () => "星期四";
sb.vib = () => {};
sb.show = () => {};
sb.push = () => {};
sb.back = () => {};
sb.openChat = () => {};
sb.document = {
  createElement: () => ({
    style: {}, dataset: {}, classList: { add() {}, toggle() {}, remove() {} },
    setAttribute() {}, appendChild() {}, animate() {}, querySelectorAll: () => [],
    querySelector: () => null, addEventListener() {}, remove() {}, innerHTML: "",
  }),
  getElementById: () => null,
  querySelector: () => null,
  querySelectorAll: () => [],
  body: { appendChild() {} },
};
sb.Audio = function () { return { play: () => Promise.reject() , pause() {}, dataset:{} }; };
vm.createContext(sb);

const load = (f) => vm.runInContext(fs.readFileSync(path + "/" + f, "utf8"), sb, { filename: f });
load("core/utils.js");
load("views/app_extra.js");

let fails = 0;
const ok = (name, cond, extra) => {
  if (!cond) { fails++; console.log("FAIL " + name + (extra ? " :: " + extra : "")); }
  else console.log("OK   " + name);
};

// 电话 - 最近通话
sb.phoneTab = "recent";
let r = sb.VIEWS.phone();
ok("phone recent renders", r.html.includes("最近通话") && r.html.includes("穆小恩"));
ok("phone tabbar clickable", r.html.includes("onclick=\"setPhoneTab('contacts')\""));
// 通讯录
sb.setPhoneTab("contacts");
r = sb.VIEWS.phone();
ok("phone contacts renders", r.html.includes("穆祉丞") && r.html.includes("通讯录"));
// 收藏页已删除，不该再出现入口
r = sb.VIEWS.phone();
ok("phone fav removed", !r.html.includes("个人收藏") && !r.html.includes("setPhoneTab('fav')"));
// 语音留言
sb.setPhoneTab("vm");
r = sb.VIEWS.phone();
ok("phone voicemail renders", r.html.includes("语音留言") && r.html.includes("0:14"));
// 拨号键盘
sb.setPhoneTab("keypad");
r = sb.VIEWS.phone();
ok("phone keypad renders", r.html.includes("phoneDialNum") && r.html.includes("phoneCallBtn"));
// 拨号输入（通过文本框观察）
const els = {};
sb.document.getElementById = (id) =>
  (els[id] = els[id] || { id, textContent: "", value: "", style: {} });
sb.phoneDialKey("1"); sb.phoneDialKey("3"); sb.phoneDialKey("9");
ok("dialBuf accumulates", els.phoneDialNum.textContent === "139", els.phoneDialNum.textContent);
sb.phoneDialKey("del");
ok("dialBuf delete", els.phoneDialNum.textContent === "13", els.phoneDialNum.textContent);

// 短信列表 & 详情
r = sb.VIEWS.sms();
ok("sms list renders", r.html.includes("大麦网") && r.html.includes("smsComposeMenu"));
sb.composeSms("穆祉丞");
r = sb.VIEWS.sms();
ok("composeSms creates thread", r.html.includes("穆祉丞"));
r = sb.VIEWS.sms_detail();
ok("sms detail renders input", r.html.includes("smsInput") && r.html.includes("sendSms()"));
ok("sms detail no toastDev input", !r.html.includes('onclick="toastDev()" style="flex:1'));

// 发送短信（模拟输入框）
sb.document.getElementById("smsInput").value = "我马上回家";
sb.document.querySelector = () => ({ scrollHeight: 300, scrollTop: 0 });
sb.sendSms();
r = sb.VIEWS.sms_detail();
ok("sendSms appends message", r.html.includes("我马上回家"));
r = sb.VIEWS.sms();
ok("sendSms updates preview", r.html.includes("我马上回家"));

console.log(fails === 0 ? "ALL PASS" : fails + " FAILS");
