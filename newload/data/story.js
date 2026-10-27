var chatData = {};
var chatNames = [];
var notes = [];
var events = {};
var songs = [];
var emails = [];
var calls = [];
var searches = [];
var photoSections = [];
var MAP_PLACES = [];
var MAP_RECENTS = [];
var DISPLAY = {};
var liveReplies = [];
var speech = [];
var SOHEE_AFTER = [];
var INCOMING = [];

(function () {
  const S = (window.STORY = {});

  S.start = {
    date: "11月15日",
    weekday: "星期日",
    time: "23:09",
    pin: "1116",
    privatePin: "1116",
    memoPin: "0913",
  };

  /*
  S.roles = {
    穆小恩: { initial: "闺", color: "#8e8e93" },
    MuAMuA: { initial: "妈", color: "#f6b6c8" },
    穆老爹: { initial: "爸", color: "#7d8ea8" },
    丞哥: { initial: "哥", color: "#c9a227" },
    穆祉丞: { initial: "丞", color: "#ff8a3d" },
    穆瑞恩: { initial: "瑞", color: "#9ad0ec" },
    恩仔: { initial: "恩", color: "#d9a7c7" },
    Mu: { initial: "M", color: "#3a3a3c" },
  };*/

  S.roles = {
    穆小恩: { initial: "闺", color: "#8e8e93", avatar: "./data/avatar/guimi.jpg", pat: "的脑壳说醒醒" },
    MuAMuA: { initial: "妈", color: "#f6b6c8", avatar: "./data/avatar/mama.jpg", pat: ":不是说学了吗‎•᷄ࡇ•᷅" },
    恩恩: { initial: "婆", color: "#f6b6c8", avatar: "./data/avatar/enen.jpg", pat: "的小屁股" },
    穆老爹: { initial: "爸", color: "#7d8ea8", avatar: "./data/avatar/baba.jpg", pat: "的保温杯" },
    丞哥: { initial: "哥", color: "#c9a227", avatar: "./data/avatar/gege.jpg", pat: "说丞哥丞哥大帅哥" },
    穆祉丞: { initial: "丞", color: "#ff8a3d", avatar: "./data/avatar/mzc.jpg", pat: "的脸颊说真乖" },
    穆瑞恩: { initial: "瑞", color: "#9ad0ec", avatar: "./data/avatar/ruien.jpg", pat: "的小脸蛋" },
    恩仔: { initial: "恩", color: "#d9a7c7", avatar: "./data/avatar/enzai.jpg", pat: "的小脑袋" },
    Mu: { initial: "M", color: "#3a3a3c", avatar: "./data/avatar/mu.jpg", pat: ":汪汪" },
    小队长: { initial: "M", color: "#3a3a3c", avatar: "./data/avatar/duizhang.jpg", pat: "并敬了个礼" },
    蓝胖胖: { initial: "L", color: "#3a3a3c", avatar: "./data/avatar/lpp.jpg", pat: "的肥肉" },
    pig: { initial: "Z", color: "#ffb6c1", avatar: "./data/avatar/pig.jpg", pat: "说别吃了" }, // 猪
    // 👇 新增的三个角色
    cat: { initial: "猫", color: "#3a3a3c", avatar: "./data/avatar/cat.jpg", pat: "踩了一脚" },
    rabbit: { initial: "兔", color: "#ffb3c1", avatar: "./data/avatar/rabbit.jpg", pat: "的长耳朵" },
    tiger: { initial: "虎", color: "#ff9f0a", avatar: "./data/avatar/tiger.jpg", pat: "的尾巴" },
  };  
    S.display = {
    pig: "🐖",      // 侧面的小猪
    cat: "🐈‍⬛",     // 黑猫
    rabbit: "🐇",   // 兔子
    tiger: "🐅",    // 老虎
  };
 // 你的专属拍一拍后缀
  S.myAvatar = "./data/avatar/me.jpg"; 
  S.myPat = "的聪明小脑瓜"; 

    S.chats = {
    '穆小恩': {
      init: [['11月15日','date']],
      replies: [
        { mine:['我好像……捡到了自己的手机。'], them:['啊？你在说什么，先找个暖和的地方站着。'] },
        { mine:['我没事，我马上回去。'], them:['好，别乱跑。穆祉丞急得要死……你自己看着办吧。'] }
      ],
      fragment: null
    },
    'MuAMuA': {
      init: [['11月15日','date']],
      replies: [
        { mine:['我没事，就是有点懵。'], them:['那就好。慢慢来，妈妈在这里。'] },
        { mine:['我好像错过了很多。'], them:['以前练习到深夜的时候，我多希望有人告诉我不用硬撑。现在你来了，就别再一个人扛。'] }
      ],
      fragment: { title:'碎片 · 温柔', body:'他学会的第一件事，是把别人的情绪轻轻接住。\n\n“如果你也会害怕，就靠过来一点。”' }
    },
    '穆老爹': {
      init: [['11月15日','date']],
      replies: [
        { mine:['我在回去了。'], them:['嗯。'] },
        { mine:['对不起，让你担心。'], them:['我已经熬过很多难走的夜晚。不想你也熬。'] }
      ],
      fragment: { title:'碎片 · 沉默', body:'他不太会说“疼”。\n\n但每一次咬牙撑过去，都希望有人看见。' }
    },
    '丞哥': {
      init: [['11月15日','date']],
      replies: [
        { mine:['知道了，我马上到。'], them:['这还差不多。'] },
        { mine:['我是不是来晚了。'], them:['不用怪过去的自己。现在陪在我身边就可以。'] }
      ],
      fragment: { title:'碎片 · 铠甲', body:'台上气场很稳的人，台下也会偷偷看门口。\n\n“我不是不需要人，我只是习惯了不说。”' }
    },
    '穆祉丞': {
      init: [['11月15日','date']],
      replies: [
        { mine:['我在回家的路上。'], them:['好。门给你留着。'] },
        { mine:['过去已经过去了，我会抓住现在的你。'], them:['嗯。我想要的是此刻，是今天生日，有你。'] }
      ],
      fragment: { title:'碎片 · 此刻', body:'他等的不只是一个生日。\n\n是有人推开门，说“我到了”。' }
    },
    '穆瑞恩': {
      init: [['11月15日','date']],
      replies: [
        { mine:['我现在来了。'], them:['真的吗？那我可以再等一会儿。'] },
        { mine:['对不起，我来得太晚。'], them:['没关系，现在你来就够啦。以前我一个人，现在有你了。'] }
      ],
      fragment: { title:'碎片 · 九岁', body:'九岁那年，练习室的灯总是最后一个关。\n\n他以为没有人会来。' }
    },
    '恩仔': {
      init: [['11月15日','date']],
      replies: [
        { mine:['我看见你了。'], them:['……真的吗？'] },
        { mine:['我知道我现在才认识你，但我会在。'], them:['没关系，你来就很好。'] }
      ],
      fragment: { title:'碎片 · 角落', body:'有些难过说不出口。\n\n只能自己消化，然后第二天继续笑。' }
    },
    'Mu': {
      init: [['11月15日','date']],
      replies: [
        { mine:['我不会消失。'], them:['最好是这样。'] },
        { mine:['迟到总比永远不来要好。'], them:['……嗯。不用为没有发生的过去自责。'] }
      ],
      fragment: { title:'碎片 · 铠甲', body:'摔过话筒之后，他学会先把自己包起来。\n\n但铠甲里面，还是那个想被接住的人。' }
    },
        '蓝胖胖': {
      init: [['11月15日','date']], // 必须有一个初始日期分割线
      replies: [
        { mine:['不玩了，我今天有点事。'], them:['哎？这么扫兴！'] }
      ],
      fragment: null
    },
    'pig': {
      init: [['11月15日','date']],
      replies: [
        { mine:['别闹了，早点睡。'], them:['好吧，晚安小猪。'] }
      ],
      fragment: null
    },
    'cat': {
      init: [['11月15日','date']],
      replies: [
        { mine:['别踩我键盘了。'], them:['喵~'] }
      ],
      fragment: null
    },
    'rabbit': {
      init: [['11月15日','date']],
      replies: [
        { mine:['给你吃胡萝卜。'], them:['吧唧吧唧。'] }
      ],
      fragment: null
    },
    'tiger': {
      init: [['11月15日','date']],
      replies: [
        { mine:['你到底是猫还是老虎？'], them:['嗷呜！'] }
      ],
      fragment: null
    },
        'tiger': {
      init: [['11月15日','date']],
      replies: [
        { mine:['你到底是猫还是老虎？'], them:['嗷呜！'] }
      ],
      fragment: null
    },
    
    // 👇 新增 '恩恩' 的剧情配置 👇
    '恩恩': {
      init: [['11月15日','date']],
      replies: [
        { mine:['我尽量早点过去。'], them:['好，我等你。'] }
      ],
      fragment: null
    },
    
    // 👇 如果你把 '闺蜜' 改成了 '穆小恩'，要在这里也加上 👇
    '穆小恩': {
      init: [['11月15日','date']],
      replies: [
        { mine:['我马上回去。'], them:['好，别乱跑。穆祉丞急得要死……你自己看着办吧。'] }
      ],
      fragment: null
    }
  };

  /* 完整时间线：所有人都会按秒数弹出来 */
  S.timeline = [
    // 穆小恩 0秒
    { at: 0,  type:'notify', from:'穆小恩', text:'你跑哪去了？刚刚还跟我说话，一转眼人不见了。' },
    { at: 3,  type:'notify', from:'穆小恩', text:'你手机怎么丢在街上？我打了好几通都没人接。' },
    // 妈妈 8秒
    { at: 8,  type:'notify', from:'MuAMuA', text:'跑去哪里了？外面很冷，不要一个人待在外边好不好。' },
    { at: 11, type:'notify', from:'MuAMuA', text:'我看到你已读了。回我一句，就一句。' },
    // 穆老爹 14秒
    { at: 14, type:'notify', from:'穆老爹', text:'回消息。' },
    { at: 17, type:'notify', from:'穆老爹', text:'外面不安全。不管发生什么，先回家。' },
    // 丞哥 20秒
    { at: 20, type:'notify', from:'丞哥', text:'人呢？玩失踪？别让我到处找你。' },
    { at: 23, type:'notify', from:'丞哥', text:'快点回来，有我在，不用逞强。' },
    // 穆祉丞 26秒
    { at: 26, type:'notify', from:'穆祉丞', text:'你去哪里了？马上快要到我的生日零点了，蛋糕已经摆好了，就差你。' },
    { at: 29, type:'notify', from:'穆祉丞', text:'今天我很想你。' },
    // 穆瑞恩 34秒
    { at: 34, type:'notify', from:'穆瑞恩', text:'你在哪里呀？练习室好黑，大家都走了。' },
    { at: 37, type:'notify', from:'穆瑞恩', text:'今天压腿很痛，我不敢跟别人说。你什么时候才会来呀？' },
    { at: 40, type:'notify', from:'穆瑞恩', text:'我等了你好久好久。' },
    // 恩仔 44秒
    { at: 44, type:'notify', from:'恩仔', text:'我有点害怕……你不要丢下我好不好。' },
    { at: 47, type:'notify', from:'恩仔', text:'曾经很多次，我躲起来哭的时候，都在幻想会不会有一个人看见我。' },
    // Mu 50秒
    { at: 50, type:'notify', from:'Mu', text:'这样不乖哦。' },
    { at: 53, type:'notify', from:'Mu', text:'不要消失。我见过太多人来了又走。' },
    { at: 56, type:'notify', from:'Mu', text:'我习惯一个人扛所有事，但我不想习惯失去你。' },

    // 中间穿插后续动作
    { at: 75, type:'call', from:'穆祉丞' },
    { at: 110, type:'notify', from:'穆老爹', text:'先回家。' },
    { at: 140, type:'choice' },
    { at: 170, type:'notify', from:'MuAMuA', text:'慢慢来，妈妈在这里。' },
    { at: 200, type:'notify', from:'丞哥', text:'有我在，不用逞强。' },
    { at: 230, type:'notify', from:'穆瑞恩', text:'快来！蛋糕要凉掉啦' },
    { at: 260, type:'notify', from:'穆祉丞', text:'门已经为你留好了。回来。' },
    { at: 300, type:'ending' }
  ];

  S.notes = [
    [
      "旧备忘录 · 迟到",
      "如果早一点认识就好了",
      "如果早一点认识就好了。\n\n是不是就能早一点看见他。",
      "2026-11-15",
    ],
    [
      "🔒 0913",
      "加密笔记 · 输入密码",
      "这是九岁那年留下的字。\n\n“今天也没有人来接我。”",
      "2026-11-15",
    ],
    [
      "生日清单",
      "蛋糕 / 橙粉色 / 回家",
      "蛋糕\n橙粉色\n回家\n零点之前",
      "2026-11-15",
    ],
  ];
  S.encryptedNote = {
    title: "致九岁的穆瑞恩",
    body: "我知道你等了很多年。\n\n练习室的灯很冷，压腿很痛，走廊很长。\n\n但现在有人来了。\n\n她走得慢，可她到了。",
  };
  S.events = { 15: ["捡到手机", "生日前夜"], 16: ["🎂 穆祉丞生日"] };
  S.songs = [
    ["小恩恩弹唱", ""],
    ["玻璃弹唱", ""],
    ["橙粉色", ""],
    ["Mu的吉他", ""],
    ["占位循环", ""],
  ];
  S.emails = [
    [
      "时代峰峻周边",
      "局部宇宙 · 购买成功",
      "你购买的「局部宇宙」周边已下单。",
      "11/15",
    ],
    ["大麦", "演出提醒", "你关注的演出即将开票。", "11/15"],
  ];
  S.calls = [
    ["穆小恩", "今天 23:08", "呼出"],
    ["MuAMuA", "今天 23:05", "未接来电"],
    ["穆祉丞", "今天 23:00", "未接来电"],    
    ["穆祉丞", "今天 20:07", "未接来电"],
    ["恩仔", "昨天 18:22", "呼出"],  
    ["Mu", "11/14", "呼出"], 
  ];
  S.searches = [
    "迟到 入坑晚 怎么办",
    "穆祉丞 练习生 九年",
    "橙粉色 应援",
    "如何赶上生日零点",
  ];



  S.notes = [
    [
      "旧备忘录 · 迟到", // 1. 标题
      "如果早一点认识就好了", // 2. 预览内容
      "如果早一点认识就好了。\n\n是不是就能早一点看见他。", // 3. 点进去后的详情内容
      "2026-11-15", // 4. 日期（必须是 YYYY-MM-DD 格式，不能漏）
    ],
    [
      "🔒 0913",
      "加密笔记 · 输入密码",
      "这是九岁那年留下的字。\n\n“今天也没有人来接我。”",
      "2026-11-15",
    ],
    [
      "生日清单",
      "蛋糕 / 橙粉色 / 回家",
      "蛋糕\n橙粉色\n回家\n零点之前",
      "2026-11-15",
    ],
  ];
  S.mapPlaces = [
    {
      id: "home",
      name: "家",
      sub: "回去的地方",
      x: 700,
      y: 880,
      color: "#5e5ce6",
      glyph: "home",
      fav: true,
      info: [
        ["地址", "回家路线"],
        ["备注", "门留着"],
      ],
    },
    {
      id: "street",
      name: "街角",
      sub: "捡到手机的地方",
      x: 500,
      y: 600,
      color: "#ff9f0a",
      glyph: "pin",
      fav: false,
      info: [],
    },
  ];
  S.mapRecents = [
    ["家", "回家 · 现在"],
    ["街角", "11月15日 23:09"],
  ];
  S.incoming = ["快回家。"];

  S.privateAlbum = [
  { src: "./data/album/1leader.jpg", label: "" },
  { src: "./data/album/1.mp4", label: "" },
  { src: "p_secret3", label: "占位 · 被折叠的信" },
  { src: "p_secret4", label: "占位 · 模糊的剪影" }
];

  S.ending = {
    B: {
      title: "结局一｜拥抱此刻",
      body: "推开门，房间暖黄灯光。蛋糕蜡烛已经点燃，正好零点 11-16。\n\n所有的切面全部归为一个完整的穆祉丞。\n\n他看向你，笑着说：\n“不用再遗憾迟到，现在，你到了。生日快乐给我，也谢谢你来了。”",
    },
    A: {
      title: "结局二｜与过去和解",
      body: "你依旧到家赶上零点。\n\n备忘录多出一段：\n“不必沉溺于没能参与的旧岁月。九岁在练习室等待的穆瑞恩，受过伤害的 Mu，爱逞强的丞哥，脆弱的恩仔，全部的我，都很高兴，终于等到你。\n\n我们不纠结错过，我们只看向以后。”",
    },
  };
  S.callScripts = {
    穆祉丞: [
      ["穆祉丞", "你终于接电话了。"],
      ["你", "我在回去。"],
      ["穆祉丞", "好。慢一点，别跑。"],
      ["你", "对不起，我好像来晚了。"],
      ["穆祉丞", "不晚。今天还没过。"],
    ],
    Mu: [
      ["Mu", "不要消失。"],
      ["你", "我不会。"],
      ["Mu", "那就回来。"],
    ],
  };

  /*
  for (const k in chatData) delete chatData[k];
  Object.keys(S.chats).forEach((id) => {
    chatData[id] = S.chats[id].init.slice();
  });
*/
  for (const k in chatData) delete chatData[k];
  Object.keys(S.chats).forEach((id) => {
    // 获取独立文件里的历史记录，如果没有就设为空数组
    const history = window.CHAT_HISTORY && window.CHAT_HISTORY[id] ? window.CHAT_HISTORY[id] : [];
    // 把【历史记录】和原来的【初始初始化内容】拼在一起
    chatData[id] = [...history, ...S.chats[id].init];
  });

  chatNames.splice(0, chatNames.length, ...Object.keys(S.chats));
  notes.splice(0, notes.length, ...S.notes);
  for (const k in events) delete events[k];
  Object.assign(events, S.events);
  songs.splice(0, songs.length, ...S.songs);
  emails.splice(0, emails.length, ...S.emails);
  calls.splice(0, calls.length, ...S.calls);
  searches.splice(0, searches.length, ...S.searches);
  photoSections.splice(0, photoSections.length, ...S.photoSections);
  MAP_PLACES.splice(0, MAP_PLACES.length, ...S.mapPlaces);
  MAP_RECENTS.splice(0, MAP_RECENTS.length, ...S.mapRecents);
  for (const k in DISPLAY) delete DISPLAY[k];
  Object.assign(DISPLAY, S.display);

  window.STORY_STATE = {
    stage: {},
    lineIdx: {},
    fragments: new Set(),
    goingHome: 0,
    choice: null,
    arriveHome: false,
    completed: new Set(),
    fired: new Set(),
    privateUnlocked: false,
    memoUnlocked: false,
    pendingText: "",
    typing: false,
    replyBusy: false,
  };
  /*
    // 👈 新增：读取本地存档，防止刷新后剧情重复触发
  try {
    const savedStory = localStorage.getItem("wb_story");
    if (savedStory) {
      const parsed = JSON.parse(savedStory);
      window.STORY_STATE.stage = parsed.stage || {};
      window.STORY_STATE.lineIdx = parsed.lineIdx || {};
      window.STORY_STATE.choice = parsed.choice || null;
      window.STORY_STATE.arriveHome = parsed.arriveHome || false;
      window.STORY_STATE.fired = new Set(parsed.fired || []);
      window.STORY_STATE.completed = new Set(parsed.completed || []);
      window.STORY_STATE.fragments = new Set(parsed.fragments || []);
    }
  } catch(e) {}
*/
  
})();


S.roles = S.roles || {};
S.chats = S.chats || {};
S.timeline = S.timeline || [];
S.notes = S.notes || [];
S.events = S.events || {};