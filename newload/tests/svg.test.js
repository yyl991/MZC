const fs=require("fs"),vm=require("vm");
const P=require("path").resolve(__dirname, "..");
const sb={console};sb.window=sb;sb.globalThis=sb;
sb.VIEWS={};sb.CFG={roles:{},chats:{}};sb.SS={};
sb.chatNames=["穆祉丞"];sb.calls=[];sb.notes=[["旧备忘录","预览","正文","2026-11-15"]];
sb.photoSections=[];sb.view="mail";
sb.toastDev=()=>{};sb.vib=()=>{};sb.show=()=>{};sb.push=()=>{};sb.back=()=>{};sb.sfx=()=>{};
sb.ampm=()=>"下午 11:09";sb.wdLong=()=>"星期四";
sb.localStorage={_d:{},getItem(k){return this._d[k]??null},setItem(k,v){this._d[k]=String(v)},removeItem(k){delete this._d[k]}};
const mk=(id)=>({id,style:{},dataset:{},classList:{add(){},remove(){},toggle(){},contains:()=>false},setAttribute(){},appendChild(){},animate(){},querySelectorAll:()=>[],querySelector:()=>null,addEventListener(){},remove(){},innerHTML:"",textContent:"",value:""});
sb.document={createElement:()=>mk("t"),getElementById:(i)=>mk(i),querySelector:()=>null,querySelectorAll:()=>[],addEventListener(){},body:mk("b")};
sb.APP={lastElementChild:null,querySelectorAll:()=>[],querySelector:()=>null};
sb.OV={querySelector:()=>null,querySelectorAll:()=>[]};sb.PLAYER={dataset:{},pause(){},play:()=>Promise.reject()};
sb.Audio=function(){return{play:()=>Promise.reject(),pause(){},dataset:{}}};
vm.createContext(sb);
const load=f=>vm.runInContext(fs.readFileSync(P+"/"+f,"utf8"),sb,{filename:f});
load("core/utils.js");load("core/icons.js");load("views/app_extra.js");
sb.emailData=[
 {id:1,from:"a@b.com",sender:"时代峰峻",subject:"周边发货",preview:"已发货",time:"今天 20:00",body:"正文",unread:true},
 {id:2,from:"c@d.com",sender:"大麦网",subject:"订单确认",preview:"订单",time:"昨天",body:"正文",unread:false},
];
load("views/mail.js");
let fails=0;const ok=(n,c,e)=>{if(!c){fails++;console.log("FAIL "+n+(e?" :: "+e:""))}else console.log("OK   "+n)};
// 天气页（含 mapRoad/listWhite/calSmall）
let r=sb.VIEWS.weather();
ok("weather renders",r.html.length>500);
ok("weather no undefined icon",!r.html.includes("undefined"));
// 邮件
sb.mailEditMode=false;sb.mailSelected=new Set();
r=sb.VIEWS.mail();
ok("mail renders",r.html.length>300);
ok("mail icons present",(r.html.match(/<svg/g)||[]).length>=3);
ok("mail no undefined icon",!r.html.includes("undefined"));
sb.mailId=1;
r=sb.VIEWS.mail_detail();
ok("mail detail icons",(r.html.match(/<svg/g)||[]).length>=4);
ok("mail detail no undefined",!r.html.includes("undefined"));
r=sb.VIEWS.mail_compose();
ok("mail compose renders",r.html.length>200&&!r.html.includes("undefined"));
console.log(fails===0?"ALL PASS":fails+" FAILS");
