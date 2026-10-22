"use strict";
const LANG = "zh";
const LOCALE = "zh-CN";
const L6 = (zh) => ({ zh });
const UI = {
  home: L6("主屏幕"),
  now: L6("现在"),
  bdayTitle: L6("生日 🎂"),
  bdayEvent: L6("生日"),
  inDays: L6("{0}天后"),
  swipeUp: L6("向上轻扫以打开"),
  enterPass: L6("输入密码"),
  emergency: L6("紧急情况"),
  cancel: L6("取消"),
  delete: L6("删除"),
  app_maps: L6("地图"),
  app_instagram: L6("Instagram"),
  app_photos: L6("照片"),
  app_mail: L6("邮件"),
  app_calendar: L6("日历"),
  app_clock: L6("时钟"),
  app_notes: L6("备忘录"),
  app_weather: L6("天气"),
  app_settings: L6("设置"),
  app_phone: L6("电话"),
  app_safari: L6("Safari"),
  app_kakao: L6("微信"),
  app_music: L6("音乐"),
  allDay: L6("全天"),
  seoul: L6("首尔"),
  mostlySunny: L6("大部晴朗"),
  hiLo: L6("最高:21° 最低:12°"),
  search: L6("搜索"),
  folders: L6("文件夹"),
  pinned: L6("置顶"),
  notesSec: L6("备忘录"),
  nNotes: L6("{0}个备忘录"),
  yesterday: L6("昨天"),
  noEvents: L6("无日程"),
  today: L6("今天"),
  calendars: L6("日历"),
  inbox: L6("收件箱"),
  edit: L6("编辑"),
  alarm: L6("闹钟"),
  alarmLabel: L6("闹钟"),
  sleepWake: L6("🛏 睡眠 | 起床"),
  noAlarm: L6("无闹钟"),
  setUp: L6("设置"),
  other: L6("其他"),
  worldClock: L6("世界时钟"),
  stopwatch: L6("秒表"),
  timer: L6("计时器"),
  all: L6("全部"),
  missed: L6("未接来电"),
  recents: L6("最近通话"),
  mobile: L6("手机"),
  favorites: L6("个人收藏"),
  contacts: L6("通讯录"),
  keypad: L6("拨号键盘"),
  voicemail: L6("语音留言"),
  chats: L6("聊天"),
  friends: L6("好友"),
  openChat: L6("开放聊天"),
  shopping: L6("购物"),
  more: L6("更多"),
  photo: L6("照片"),
  voiceMsg: L6("语音消息"),
  giftSent: L6("送出了礼物。"),
  fileColon: L6("文件: "),
  video: L6("视频"),
  giftArrived: L6("礼物到啦"),
  giftItem: L6("热柚子茶 1 杯"),
  giftCheck: L6("查看礼物"),
  expired: L6("已过期"),
  expPhoto: L6("照片已过期"),
  expVideo: L6("视频已过期"),
  f_assign: L6("文件.pdf"),
  f_assign2: L6("修改版.pdf"),
  f_check: L6("检查表.xlsx"),
  msgInput: L6("输入消息"),
  space: L6("空格"),
  ret: L6("换行"),
  searchWeb: L6("搜索或输入网站名称"),
  recentSearches: L6("最近搜索"),
  clear: L6("清除"),
  sf_portal: L6("门户"),
  sf_acad: L6("教务系统"),
  sf_lib: L6("图书馆"),
  sf_elearn: L6("网络课程"),
  sf_pe: L6("体育学院"),
  sf_mail: L6("网页邮箱"),
  sf_news: L6("新闻"),
  favoritesSf: L6("个人收藏"),
  privacyReport: L6("隐私报告"),
  privacyText: L6("过去 7 天，Safari 已阻止 14 个跟踪器分析你的个人资料。"),
  readingList: L6("阅读列表"),
  readingEmpty: L6("阅读列表为空"),
  aa: L6("大小"),
  mailboxes: L6("邮箱"),
  updatedNow: L6("刚刚更新"),
  toMe: L6("收件人：我 ›"),
  mailSchool: L6("{0}\n\n{1}\n\n详情请参阅学校官网。\n{0}"),
  mailShop: L6("{0}\n\n请在应用中查看订单详情。\n\n系统邮件请勿回复。"),
  library: L6("图库"),
  select: L6("选择"),
  nPhotos: L6("{0} 张照片"),
  years: L6("年"),
  months: L6("月"),
  allPhotos: L6("所有照片"),
  screenshot: L6("{0} · 截屏"),
  posts: L6("帖子"),
  followers: L6("粉丝"),
  following: L6("关注"),
  followingBtn: L6("已关注 ˅"),
  followingTag: L6("已关注"),
  message: L6("发消息"),
  bio: L6("你好"),
  cover: L6("翻唱 🎧"),
  likedBy: L6("❤ {0} 和其他 {1} 人赞了"),
  origAudio: L6("♫ 原声"),
  reels: L6("Reels"),
  back: L6("返回"),
  songs: L6("歌曲"),
  libraryMu: L6("资料库"),
  play: L6("播放"),
  shuffle: L6("⤮ 随机播放"),
  listenNow: L6("现在就听"),
  browse: L6("浏览"),
  radio: L6("广播"),
  voiceMemo: L6("语音备忘录"),
  m_univ: L6("大学"),
  currentLoc: L6("当前位置"),
  walkMin: L6("步行{0}分钟"),
  minN: L6("{0}分钟"),
  favorite: L6("收藏"),
  favorited: L6("已收藏"),
  share: L6("共享"),
  moreInfo: L6("更多"),
  info: L6("信息"),
  noInfo: L6("暂无更多信息"),
  searchMaps: L6("搜索地图"),
  recentsMap: L6("最近"),
  add: L6("添加"),
  myLoc: L6("我的位置"),
  wxSummary: L6("大部晴朗。"),
  tenDay: L6("10 天天气预报"),
  uv: L6("紫外线指数"),
  moderate: L6("中等"),
  sunset: L6("日落"),
  sunrise: L6("日出"),
  acct: L6("账户、iCloud、媒体与购买项目"),
  airplane: L6("飞行模式"),
  on: L6("打开"),
  cellular: L6("蜂窝网络"),
  battery: L6("电池"),
  general: L6("通用"),
  access: L6("辅助功能"),
  camera: L6("相机"),
  wallpaper: L6("墙纸"),
  notif: L6("通知"),
  sound: L6("声音与触感"),
  focus: L6("专注模式"),
  screenTime: L6("屏幕使用时间"),
  faceid: L6("面容 ID 与密码"),
  privacy: L6("隐私与安全性"),
  wonbinsIphone: L6("的 iPhone"),
  dailyAvg: L6("日均"),
  hm: L6("{0}小时{1}分钟"),
  mOnly: L6("{0}分钟"),
  upPct: L6("比上周增加 {0}%"),
  mostUsed: L6("最常使用"),
  pickups: L6("拿起次数"),
  firstPickup: L6("首次拿起"),
  avgPickups: L6("日均拿起"),
  pickN: L6("{0} 次"),
  firstUsed: L6("拿起后首先使用"),
  notifSec: L6("通知"),
  perDay: L6("日均 {0} 条"),
  remind: L6("提醒我"),
  message2: L6("信息"),
  slideAnswer: L6("滑动来接听"),
  decline: L6("拒绝"),
  accept: L6("接听"),
  speaker: L6("扬声器"),
  mute: L6("静音"),
  addCall: L6("添加通话"),
  endCall: L6("结束"),
  calling: L6("正在呼叫…"),
  liveCap: L6("实时字幕"),
  callEnded: L6("通话结束"),
  noAnswer: L6("无人接听"),
  missedCall: L6("未接来电"),
};

function t(k, ...a) {
  const e = UI[k];
  let s = e ? (e[LANG] ?? e.zh) : k;
  a.forEach((v, i) => {
    s = s.split("{" + i + "}").join(v);
  });
  return s;
}
const dn = (n) => (typeof DISPLAY !== "undefined" && DISPLAY[n]) || n;

const _fc = {};
const _f = (o) => {
  const k = JSON.stringify(o);
  return _fc[k] || (_fc[k] = new Intl.DateTimeFormat(LOCALE, o));
};
const _d = (y, m, d, h = 12, mi = 0) => new Date(y, m - 1, d, h, mi);
function fmtTime(min) {
  min = ((Math.round(min) % 1440) + 1440) % 1440;
  return _f({ hour: "numeric", minute: "2-digit" }).format(
    _d(2026, 10, 17, Math.floor(min / 60), min % 60),
  );
}
const fmtFull = (y, m, d) =>
  _f({
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(_d(y, m, d));
const fmtYMD = (y, m, d) =>
  _f({ year: "numeric", month: "long", day: "numeric" }).format(_d(y, m, d));
const fmtMD = (m, d) =>
  _f({ month: "long", day: "numeric" }).format(_d(2026, m, d));
const fmtYM = (y, m) =>
  _f({ year: "numeric", month: "long" }).format(_d(y, m, 1));
const fmtMonth = (m) => _f({ month: "long" }).format(_d(2026, m, 1));
const fmtYear = (y) => _f({ year: "numeric" }).format(_d(y, 6, 1));
const fmtNum = (y, m, d) =>
  _f({ year: "numeric", month: "numeric", day: "numeric" }).format(_d(y, m, d));
const wdLong = (y, m, d) => _f({ weekday: "long" }).format(_d(y, m, d));
const wdShort = (y, m, d) => _f({ weekday: "short" }).format(_d(y, m, d));
const wdNarrow = () =>
  [0, 1, 2, 3, 4, 5, 6].map((i) =>
    _f({ weekday: "narrow" }).format(_d(2026, 10, 4 + i)),
  );
const fmtLockDate = () =>
  _f({ month: "long", day: "numeric", weekday: "long" }).format(
    _d(2026, 11, 15),
  );
const fmtHour = (h) => _f({ hour: "numeric" }).format(_d(2026, 10, 17, h, 0));
function alarmParts(h, mi) {
  const ps = _f({ hour: "numeric", minute: "2-digit" }).formatToParts(
    _d(2026, 10, 17, h, mi),
  );
  const di = ps.findIndex((p) => p.type === "dayPeriod");
  const dp = di >= 0 ? ps[di].value : "";
  const tm = ps
    .filter((p) => p.type !== "dayPeriod")
    .map((p) => p.value)
    .join("")
    .trim();
  const hi = ps.findIndex((p) => p.type === "hour");
  return { dp, tm, before: di >= 0 && di < hi };
}

function parseLabel(l) {
  let m = l.match(/^(\d{4})年(\d+)月(\d+)日$/);
  if (m) return { y: +m[1], m: +m[2], d: +m[3] };
  m = l.match(/^(\d+)月(\d+)日$/);
  if (m) return { y: 2026, m: +m[1], d: +m[2] };
  return null;
}
function fmtLabel(l, full) {
  if (l === "今天") return full ? fmtFull(2026, 11, 15) : t("today");
  if (l === "昨天") return t("yesterday");
  const p = parseLabel(l);
  if (!p) return l;
  if (!p.d) return fmtYM(p.y, p.m);
  if (full) return fmtFull(p.y, p.m, p.d);
  return p.y === 2026 ? fmtMD(p.m, p.d) : fmtYMD(p.y, p.m, p.d);
}
const ZH_WD = {
  星期日: 0,
  星期一: 1,
  星期二: 2,
  星期三: 3,
  星期四: 4,
  星期五: 5,
  星期六: 6,
};
document.documentElement.lang = LANG;
