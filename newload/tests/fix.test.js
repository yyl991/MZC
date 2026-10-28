const fs=require("fs"),vm=require("vm");
const P=require("path").resolve(__dirname, "..");
const sb={console};sb.window=sb;sb.globalThis=sb;
sb.VIEWS={};sb.CFG={roles:{},chats:{}};sb.SS={fired:new Set(),stage:{}};
sb.chatNames=["穆祉丞"];sb.calls=[];sb.notes=[];sb.photoSections=[];sb.view="mail";
sb.toastDev=()=>{};sb.vib=()=>{};sb.show=()=>{};sb.push=()=>{};sb.back=()=>{};sb.sfx=()=>{};
sb.ampm=()=>"下午 11:09";sb.wdLong=()=>"星期四";sb.fmtYMD=(y,m,d)=>`${y}年${m}月${d}日`;sb.fmtNum=(y,m,d)=>`${m}月${d}日`;
sb.localStorage={_d:{},getItem(k){return this._d[k]??null},setItem(k,v){this._d[k]=String(v)},removeItem(k){delete this._d[k]}};
const mk=(id)=>({id,style:{},dataset:{},classList:{add(){},remove(){},toggle(){},contains:()=>false},setAttribute(){},appendChild(){},animate(){},querySelectorAll:()=>[],querySelector:()=>null,addEventListener(){},remove(){},replaceWith(){},parentNode:{replaceChild(){}},innerHTML:"",textContent:"",value:""});
sb.document={createElement:()=>mk("t"),getElementById:(i)=>mk(i),querySelector:()=>null,querySelectorAll:()=>[],addEventListener(){},body:mk("b")};
sb.APP={lastElementChild:null,querySelectorAll:()=>[],querySelector:()=>null};
sb.OV={querySelector:()=>null,querySelectorAll:()=>[]};
sb.PLAYER={dataset:{},pause(){},play:()=>Promise.reject()};
sb.Audio=function(){return{play:()=>Promise.reject(),pause(){},dataset:{}}};
sb.setTimeout=(fn)=>{sb._pending=fn;return 1};sb.clearTimeout=()=>{};sb.setInterval=()=>1;sb.clearInterval=()=>{};
sb.gameMin=()=>1445; // 跨零点 -> 11.16 00:05
vm.createContext(sb);
const load=f=>vm.runInContext(fs.readFileSync(P+"/"+f,"utf8"),sb,{filename:f});
load("core/utils.js");load("core/icons.js");load("views/app_extra.js");
sb.emailData=[{id:1,from:"a@b.com",sender:"时代峰峻",subject:"x",preview:"y",time:"今天",body:"b",unread:false}];
load("views/mail.js");
let fails=0;const ok=(n,c,e)=>{if(!c){fails++;console.log("FAIL "+n+(e?" :: "+e:""))}else console.log("OK   "+n)};

// 2. 邮件发送后列表显示对方
sb.view="mail_compose";
sb.document.getElementById=(id)=>{
  if(id==="mail-to")return {value:"friend@test.com"};
  if(id==="mail-subject")return {value:"测试主题"};
  if(id==="mail-body")return {value:"正文"};
  return mk(id);
};
const _t=sb.toastDev;let _msg=null;sb.toastDev=(m)=>{_msg=m};sb.sendMail();sb.toastDev=_t;console.log("  [debug sendMail toast]",_msg);
const mailHTML=sb.VIEWS.mail().html;
ok("mail row shows recipient",mailHTML.includes("friend@test.com"));
console.log("  首封位置", mailHTML.indexOf("friend@test.com"), mailHTML.indexOf("时代峰峻"));
vm.runInContext("currentMailId = emailData[0].id", sb);
const det=sb.VIEWS.mail_detail().html;
ok("mail detail shows 收件人",det.includes("收件人: friend@test.com"),det.includes("收件人")?"has label":"no label");

// 3. 备忘录时间用游戏时钟
sb.document.getElementById=(id)=>{
  if(id==="note-edit-title")return {value:"新笔记"};
  if(id==="note-edit-body")return {value:"内容"};
  return mk(id);
};
sb.openNoteEditor(-1);
sb.saveNote();
const d=sb.notes[0][3];
ok("note date from game clock",d==="2026-11-16 00:05",d);
const listHTML=sb.VIEWS.notes().html;
ok("note list shows time",listHTML.includes("00:05"));

// 8. 打电话回拨
let rang=null;
sb.incomingCallFrom=(n)=>{rang=n};
sb.scheduleCallBack("丞哥");
if(sb._pending) sb._pending();
ok("call back rings",rang==="丞哥",String(rang));

console.log(fails===0?"ALL PASS":fails+" FAILS");
