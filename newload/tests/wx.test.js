const fs=require("fs"),vm=require("vm");
const P=require("path").resolve(__dirname, "..");
const sb={console};sb.window=sb;sb.globalThis=sb;
sb.VIEWS={};sb.CFG={roles:{},chats:{},myAvatar:""};sb.SS={};
sb.show=()=>{};sb.push=()=>{};sb.back=()=>{};sb.vib=()=>{};sb.toastDev=(m)=>{sb._toast=m};
sb.localStorage={_d:{},getItem(k){return this._d[k]??null},setItem(k,v){this._d[k]=String(v)},removeItem(k){delete this._d[k]}};
sb.chatData={};sb.chatNames=[];sb.chatId="";sb.view="wechat";sb.unread={};sb.wxNotifyOn=true;
const mk=(id)=>({id,style:{},dataset:{},classList:{add(){},remove(){},toggle(){},contains:()=>false},setAttribute(){},appendChild(){},animate(){},querySelectorAll:()=>[],querySelector:()=>null,addEventListener(){},remove(){},innerHTML:"",textContent:"",value:""});
sb.document={createElement:()=>mk("t"),getElementById:(i)=>mk(i),querySelector:()=>null,querySelectorAll:()=>[],addEventListener(){},body:mk("b")};
sb.Audio=function(){return{play:()=>Promise.reject(),pause(){},dataset:{}}};
vm.createContext(sb);
const load=f=>vm.runInContext(fs.readFileSync(P+"/"+f,"utf8"),sb,{filename:f});
load("core/utils.js");load("core/icons.js");load("views/wx_chat.js");load("views/wx_pages.js");load("views/wx_moments.js");
let fails=0;const ok=(n,c,e)=>{if(!c){fails++;console.log("FAIL "+n+(e?" :: "+e:""))}else console.log("OK   "+n)};
let r=sb.VIEWS.wx_discover();
["朋友圈","视频号","直播","扫一扫","搜一搜","看一看","听一听","附近的人","游戏","小程序"].forEach(t=>ok("discover:"+t,r.html.includes(t)));
ok("discover placeholders use toastDev",(r.html.match(/toastDev\(\)/g)||[]).length>=7);
r=sb.VIEWS.wx_me();
["服务","收藏","朋友圈","我的作品","小店与卡包","表情","设置"].forEach(t=>ok("me:"+t,r.html.includes(t)));
const panel=sb.wxPlusPanelHTML();
ok("plus has 拍摄",panel.includes("拍摄"));
ok("plus has 相册",panel.includes("相册"));
console.log(fails===0?"ALL PASS":fails+" FAILS");

// ===== 本轮 UI 改版校验 =====
let r3=sb.VIEWS.wechat();
ok("chat head shows 微信(count)",/微信(\(\d+\))?</.test(r3.html));
ok("pc login bar",r3.html.includes("已登录Windows电脑"));
ok("pc bar uses icon",r3.html.includes("<svg"));
const panel2=sb.wxPlusPanelHTML();
["相册","拍摄","视频通话","位置","红包","礼物","转账","收藏"].forEach(t=>ok("plus:"+t,panel2.includes(t)));
ok("plus dots",panel2.includes("wx-plus-dots"));
ok("plus icons are svg",(panel2.match(/<svg/g)||[]).length===8);
const sv=sb.VIEWS.wx_services();
["收付款","钱包","金融理财","信用卡还款","理财通","保险服务","生活服务","手机充值","生活缴费","Q币充值","城市服务","腾讯公益","医疗健康","交通出行","出行服务","火车票机票","滴滴出行","酒店民宿","购物消费"].forEach(t=>ok("svc:"+t,sv.html.includes(t)));
ok("svc green card",sv.html.includes("#07c160"));
ok("svc icons svg",(sv.html.match(/<svg/g)||[]).length>=20);

// ===== 传送幕后恩仔自由回复：不走向答剧本，静默收集 =====
const assert = require("assert");
sb.document.querySelector = (s2) => mk("q" + s2);
sb.$ = (s2) => sb.document.querySelector(s2);
sb.CFG.chats["恩仔"] = { replies: [] };
sb.chatData["恩仔"] = [["好不好?", "them", "上午 00:00"]];
sb.SS.homecoming = { phase: "exploring" };
sb.SS.stage = {};
sb.SS.lineIdx = {};
sb.chatId = "恩仔";
sb.view = "chat";
sb.SS.pendingText = "我会一直陪着你";
sb.renderQuoteBar = () => {};
sb.clearPatience = () => {};
sb.setField = () => {};
sb.sfx = () => {};
sb.saveChat = () => {};
sb.refreshChat = () => {};
sb.scrollChat = () => {};
sb.nowAmpm = () => "上午 00:01";
sb.setTimeout = (fn) => { fn(); return 1; };
sb.clearTimeout = () => {};
sb.collectPlayerReply = (t) => { sb._collected = (sb._collected || []).concat([t]); };
sb.tone = () => {};
sb.sendLine();
const rows = sb.chatData["恩仔"];
assert.strictEqual(rows.at(-1)[0], "😽"); // 恩仔即时回应已入库
const mine = rows.filter((r) => r[1] === "me");
assert.strictEqual(mine.length, 1);
assert.strictEqual(mine[0][0], "我会一直陪着你");
assert.strictEqual(mine[0][3], ""); // rd 已清
assert.deepStrictEqual(sb._collected, ["我会一直陪着你"]);
assert.strictEqual(sb._enzaiReplied, true);
assert.strictEqual(sb.SS.lineIdx["恩仔"], undefined);
const chatHtml = sb.VIEWS.chat().html;
assert(chatHtml.includes("fld-real"), "自由回复渲染真输入框");
assert(!chatHtml.includes('id="kbd"'), "自由回复不渲染假键盘");
assert(chatHtml.includes("输入消息"), "占位提示保留");

// ===== 结尾互动：回复→😽，超时→两条追问 =====
sb._delivered = [];
sb.deliverFrom = (from, text) => sb._delivered.push([from, text]);
sb._enzaiReplied = false;
sb.scheduleEnzaiNudge(); // 测试计时器立即执行：9秒无回复 → 追问
assert.deepStrictEqual(sb._delivered, [["恩仔", "怎么不理我"], ["恩仔", "好不好嘛😾"]]);
sb._delivered = [];
sb._enzaiReplied = true;
sb.scheduleEnzaiNudge();
assert.deepStrictEqual(sb._delivered, []); // 已回复则不再追问

// ===== 结尾亲亲上限：满三次后依次发三句晚安（各带输入提示），之后沉默 =====
const origCollect = sb.collectPlayerReply;
sb.collectPlayerReply = () => {}; // 本段只测回复，不污染收集断言
sb.SS.homecoming = { phase: "exploring" }; // 重置计数
sb._delivered = [];
let typingCalls = 0;
const origShowTyping = sb.showTypingFrom;
sb.showTypingFrom = (from) => { if (from === "恩仔") typingCalls++; };
for (let i = 0; i < 4; i++) {
  sb.SS.pendingText = "再陪我说说话 " + i;
  sb.sendLine();
}
assert.deepStrictEqual(
  sb._delivered.filter((d) => d[0] === "恩仔").map((d) => d[1]),
  ["😽", "😽", "😽", "好困呀", "早些休息哦，晚安", "睡告告了"]
); // 3次亲亲 + 第4次起依次发三句晚安
assert.strictEqual(typingCalls, 6, "每条恩仔回复都带正在输入中提示"); // 3亲亲+3晚安
assert.strictEqual(sb.SS.homecoming.kissCount, 3); // 计数落在存档对象上
assert.strictEqual(sb.SS.homecoming.enzaiDone, true); // 晚安已发，标记落档
// 三句晚安之后再发：消息仍会收集入库，但恩仔不再有任何回复（含输入提示）
const beforeSilent = sb._delivered.length;
const typingBeforeSilent = typingCalls;
sb.SS.pendingText = "还说";
sb.sendLine();
sb.SS.pendingText = "怎么不说话了";
sb.sendLine();
assert.strictEqual(sb._delivered.length, beforeSilent, "晚安后不再回复");
assert.strictEqual(typingCalls, typingBeforeSilent, "晚安后连输入提示都不再出现");
sb.showTypingFrom = origShowTyping;
sb.collectPlayerReply = origCollect;

// ===== 朋友圈评论收集 =====
sb.collectMomentReply = (owner, post, content) => { sb._mcollected = (sb._mcollected || []).concat([[owner, post, content]]); };
sb.wxPrompt = (title, ph, cb) => cb("这条评论");
sb.chatId = "穆祉丞";
sb.wxMomentComment({ text: "测试帖子", comments: [] });
assert.deepStrictEqual(sb._mcollected, [["穆祉丞", "测试帖子", "这条评论"]]);

// ===== 0点前恩仔聊天：发送被忽略（不出气泡、不收集、不清输入） =====
sb.chatData["恩仔"] = [["好不好?", "them", "上午 00:00"]];
sb.SS.homecoming = null;
sb.SS.pendingText = "还没到家";
sb.sendLine();
assert.strictEqual(sb.chatData["恩仔"].length, 1);
assert.strictEqual(sb.SS.pendingText, "还没到家");
assert.deepStrictEqual(sb._collected, ["我会一直陪着你"]);
