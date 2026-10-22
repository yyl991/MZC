'use strict';
const LOCALE='zh-CN';
const UI={
  home:'主屏幕',
  now:'现在',
  bdayTitle:'生日 🎂',
  bdayEvent:'生日',
  inDays:'{0}天后',
  swipeUp:'向上轻扫以打开',
  enterPass:'输入密码',
  emergency:'紧急情况',
  cancel:'取消',
  delete:'删除',
  app_maps:'地图',
  app_instagram:'Instagram',
  app_photos:'照片',
  app_mail:'邮件',
  app_calendar:'日历',
  app_clock:'时钟',
  app_notes:'备忘录',
  app_weather:'天气',
  app_settings:'设置',
  app_phone:'电话',
  app_safari:'Safari',
  app_kakao:'微信',
  app_music:'音乐',
  allDay:'全天',
  seoul:'首尔',
  mostlySunny:'大部晴朗',
  hiLo:'最高:21° 最低:12°',
  search:'搜索',
  folders:'文件夹',
  pinned:'置顶',
  notesSec:'备忘录',
  nNotes:'{0}个备忘录',
  yesterday:'昨天',
  noEvents:'无日程',
  today:'今天',
  calendars:'日历',
  inbox:'收件箱',
  edit:'编辑',
  alarm:'闹钟',
  alarmLabel:'闹钟',
  sleepWake:'🛏 睡眠 | 起床',
  noAlarm:'无闹钟',
  setUp:'设置',
  other:'其他',
  worldClock:'世界时钟',
  stopwatch:'秒表',
  timer:'计时器',
  all:'全部',
  missed:'未接来电',
  recents:'最近通话',
  mobile:'手机',
  favorites:'个人收藏',
  contacts:'通讯录',
  keypad:'拨号键盘',
  voicemail:'语音留言',
  chats:'聊天',
  friends:'好友',
  openChat:'开放聊天',
  shopping:'购物',
  more:'更多',
  photo:'照片',
  voiceMsg:'语音消息',
  giftSent:'送出了礼物。',
  fileColon:'文件: ',
  video:'视频',
  giftArrived:'礼物到啦',
  giftItem:'热柚子茶 1 杯',
  giftCheck:'查看礼物',
  expired:'已过期',
  expPhoto:'照片已过期',
  expVideo:'视频已过期',
  f_assign:'文件.pdf',
  f_assign2:'修改版.pdf',
  f_check:'检查表.xlsx',
  msgInput:'输入消息',
  space:'空格',
  ret:'换行',
  searchWeb:'搜索或输入网站名称',
  recentSearches:'最近搜索',
  clear:'清除',
  sf_portal:'门户',
  sf_acad:'教务系统',
  sf_lib:'图书馆',
  sf_elearn:'网络课程',
  sf_pe:'体育学院',
  sf_mail:'网页邮箱',
  sf_news:'新闻',
  favoritesSf:'个人收藏',
  privacyReport:'隐私报告',
  privacyText:'过去 7 天，Safari 已阻止 14 个跟踪器分析你的个人资料。',
  readingList:'阅读列表',
  readingEmpty:'阅读列表为空',
  aa:'大小',
  mailboxes:'邮箱',
  updatedNow:'刚刚更新',
  toMe:'收件人：我 ›',
  mailSchool:'{0}\n\n{1}\n\n详情请参阅学校官网。\n{0}',
  mailShop:'{0}\n\n请在应用中查看订单详情。\n\n系统邮件请勿回复。',
  library:'图库',
  select:'选择',
  nPhotos:'{0} 张照片',
  years:'年',
  months:'月',
  allPhotos:'所有照片',
  screenshot:'{0} · 截屏',
  posts:'帖子',
  followers:'粉丝',
  following:'关注',
  followingBtn:'已关注 ˅',
  followingTag:'已关注',
  message:'发消息',
  bio:'你好',
  cover:'翻唱 🎧',
  likedBy:'❤ {0} 和其他 {1} 人赞了',
  origAudio:'♫ 原声',
  reels:'Reels',
  back:'返回',
  songs:'歌曲',
  libraryMu:'资料库',
  play:'播放',
  shuffle:'⤮ 随机播放',
  listenNow:'现在就听',
  browse:'浏览',
  radio:'广播',
  voiceMemo:'语音备忘录',
  m_univ:'大学',
  currentLoc:'当前位置',
  walkMin:'步行{0}分钟',
  minN:'{0}分钟',
  favorite:'收藏',
  favorited:'已收藏',
  share:'共享',
  moreInfo:'更多',
  info:'信息',
  noInfo:'暂无更多信息',
  searchMaps:'搜索地图',
  recentsMap:'最近',
  add:'添加',
  myLoc:'我的位置',
  wxSummary:'大部晴朗。',
  tenDay:'10 天天气预报',
  uv:'紫外线指数',
  moderate:'中等',
  sunset:'日落',
  sunrise:'日出',
  acct:'账户、iCloud、媒体与购买项目',
  airplane:'飞行模式',
  on:'打开',
  cellular:'蜂窝网络',
  battery:'电池',
  general:'通用',
  access:'辅助功能',
  camera:'相机',
  wallpaper:'墙纸',
  notif:'通知',
  sound:'声音与触感',
  focus:'专注模式',
  screenTime:'屏幕使用时间',
  faceid:'面容 ID 与密码',
  privacy:'隐私与安全性',
  wonbinsIphone:'的 iPhone',
  dailyAvg:'日均',
  hm:'{0}小时{1}分钟',
  mOnly:'{0}分钟',
  upPct:'比上周增加 {0}%',
  mostUsed:'最常使用',
  pickups:'拿起次数',
  firstPickup:'首次拿起',
  avgPickups:'日均拿起',
  pickN:'{0} 次',
  firstUsed:'拿起后首先使用',
  notifSec:'通知',
  perDay:'日均 {0} 条',
  remind:'提醒我',
  message2:'信息',
  slideAnswer:'滑动来接听',
  decline:'拒绝',
  accept:'接听',
  speaker:'扬声器',
  mute:'静音',
  addCall:'添加通话',
  endCall:'结束',
  calling:'正在呼叫…',
  liveCap:'实时字幕',
  callEnded:'通话结束',
  noAnswer:'无人接听',
  missedCall:'未接来电'
};
// t函数：插值，app.js到处调用这个t('key')拿文字
function t(k,...a){
  let s=UI[k]??k;
  a.forEach((v,i)=>{
    s=s.split('{'+i+'}').join(v)
  })
  return s
}
const dn=n=>(typeof DISPLAY!=='undefined'&&DISPLAY[n])||n;
const _fc={};
const _f=o=>{const k=JSON.stringify(o);return _fc[k]||(_fc[k]=new Intl.DateTimeFormat(LOCALE,o))};
const _d=(y,m,d,h=12,mi=0)=>new Date(y,m-1,d,h,mi);
function fmtTime(min){min=((Math.round(min)%1440)+1440)%1440;return _f({hour:'numeric',minute:'2-digit'}).format(_d(2026,10,17,Math.floor(min/60),min%60))}
const fmtFull=(y,m,d)=>_f({year:'numeric',month:'long',day:'numeric',weekday:'long'}).format(_d(y,m,d));
const fmtYMD=(y,m,d)=>_f({year:'numeric',month:'long',day:'numeric'}).format(_d(y,m,d));
const fmtMD=(m,d)=>_f({month:'long',day:'numeric'}).format(_d(2026,m,d));
const fmtYM=(y,m)=>_f({year:'numeric',month:'long'}).format(_d(y,m,1));
const fmtMonth=m=>_f({month:'long'}).format(_d(2026,m,1));
const fmtYear=y=>_f({year:'numeric'}).format(_d(y,6,1));
const fmtNum=(y,m,d)=>_f({year:'numeric',month:'numeric',day:'numeric'}).format(_d(y,m,d));
const wdLong=(y,m,d)=>_f({weekday:'long'}).format(_d(y,m,d));
const wdShort=(y,m,d)=>_f({weekday:'short'}).format(_d(y,m,d));
const wdNarrow=()=>[0,1,2,3,4,5,6].map(i=>_f({weekday:'narrow'}).format(_d(2026,10,4+i)));
const fmtLockDate=()=>_f({month:'long',day:'numeric',weekday:'long'}).format(_d(2026,11,15));
const fmtHour=h=>_f({hour:'numeric'}).format(_d(2026,10,17,h,0));
function alarmParts(h,mi){const ps=_f({hour:'numeric',minute:'2-digit'}).formatToParts(_d(2026,10,17,h,mi));const di=ps.findIndex(p=>p.type==='dayPeriod');const dp=di>=0?ps[di].value:'';const tm=ps.filter(p=>p.type!=='dayPeriod').map(p=>p.value).join('').trim();const hi=ps.findIndex(p=>p.type==='hour');return{dp,tm,before:di>=0&&di<hi}}
function parseLabel(l){
  let m=l.match(/^(\d{4})年 (\d+)月 (\d+)日$/);if(m)return{y:+m[1],m:+m[2],d:+m[3]};
  m=l.match(/^(\d+)月 (\d+)日$/);if(m)return{y:2026,m:+m[1],d:+m[2]};
  return null
}
function fmtLabel(l,full){
  if(l==='今天')return full?fmtFull(2026,11,15):t('today');
  if(l==='昨天')return t('yesterday');
  const p=parseLabel(l);
  if(!p)return l;
  if(!p.d)return fmtYM(p.y,p.m);
  if(full)return fmtFull(p.y,p.m,p.d);
  return p.y===2026?fmtMD(p.m,p.d):fmtYMD(p.y,p.m,p.d)
}
document.documentElement.lang='zh-CN';
