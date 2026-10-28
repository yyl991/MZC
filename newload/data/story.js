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
    穆小恩: { initial: "恩", color: "#8e8e93", avatar: "./data/avatar/guimi.jpg", pat: "的工牌说加油穆小恩！" },
    MuAMuA: { initial: "妈", color: "#f6b6c8", avatar: "./data/avatar/mama.jpg", pat: ":不是说学了吗‎•᷄ࡇ•᷅" },
    恩恩: { initial: "婆", color: "#f6b6c8", avatar: "./data/avatar/enen.jpg", pat: "，哼" },
    丞哥: { initial: "哥", color: "#c9a227", avatar: "./data/avatar/gege.jpg", pat: "说丞哥丞哥大帅哥" },
    穆祉丞: { initial: "丞", color: "#ff8a3d", avatar: "./data/avatar/mzc.jpg", pat: "叫哥哥" },
    穆瑞恩: { initial: "瑞", color: "#9ad0ec", avatar: "./data/avatar/ruien.jpg", pat: "说再练一遍" },
    恩仔: { initial: "恩", color: "#d9a7c7", avatar: "./data/avatar/enzai.jpg", pat: "说我命由我不由天" },
    Mu: { initial: "M", color: "#3a3a3c", avatar: "./data/avatar/mu.jpg", pat: "的AWP并疯狂报点：“A大！A大！”" },
    丞丞: { initial: "丞", color: "#4a90e2", avatar: "./data/avatar/duizhang.jpg", pat: "一起SIU~~~" },
    pig: { initial: "Z", color: "#ffb6c1", avatar: "./data/avatar/pig.jpg", pat: "说老板要大份的谢谢" }, // 猪
    // 👇 新增的三个角色
    cat: { initial: "猫", color: "#3a3a3c", avatar: "./data/avatar/cat.jpg", pat: "…你敢拍老子？" },
    rabbit: { initial: "兔", color: "#ffb3c1", avatar: "./data/avatar/rabbit.jpg", pat: "的小脑袋，听到了海浪声" },
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
        { mine:['我好像……捡到了自己的手机。'], them:['啊？你先找个亮的地方站着。','手机的事我们回头说。'] },
        { mine:['我没事，我马上回去。'], them:['好，别乱跑。','我在楼下等你。','穆小恩，说到做到！'] }
      ],
      fragment: null
    },
    'MuAMuA': {
      init: [['11月15日','date']],
      replies: [
        { mine:['我没事，就是有点懵。'], them:['那就好。','先找个亮的地方站着，别一直看手机。'] },
        { mine:['我好像错过了很多。'], them:['以前那些事，你不用替我难过。','你现在回来就好。'] },
        { mine:['我想你了。'], them:['……宝宝。','别在外面说这种话。'] }
      ],
      fragment: { title:'碎片 · 温柔', body:'他学会的第一件事，是把别人的情绪轻轻接住。\n\n“如果你也会害怕，就靠过来一点。”' }
    },
    '丞哥': {
      init: [['11月15日','date']],
      replies: [
        { mine:['知道了，我马上到。'], them:['这还差不多。'] },
        { mine:['我是不是来晚了。'], them:['晚了。','门给你留着。','上来。'] }
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
        { mine:['我不会消失。'], them:['1','上号'] },
        { mine:['迟到总比永远不来要好。'], them:['上号','1'] }
      ],
      fragment: { title:'碎片 · 铠甲', body:'摔过话筒之后，他学会先把自己包起来。\n\n但铠甲里面，还是那个想被接住的人。' }
    },
        'pig': {
      init: [['11月15日','date']],
      replies: [
        { mine:['别闹了，早点睡。'], them:['不行，蛋糕还没切。','切了才睡。'] },
        { mine:['我快到了。'], them:['好！','我先尝一口边缘。','就一口。'] }
      ],
      fragment: null
    },
    'cat': {
      init: [['11月15日','date']],
      replies: [
        { mine:['别生气了，我马上回。'], them:['蒽。','老子等着的。'] },
        { mine:['门锁了？'], them:['……没锁。','快点。'] }
      ],
      fragment: null
    },
    'rabbit': {
      init: [['11月15日','date']],
      replies: [
        { mine:['我快到家了。'], them:['好呀。','那我去把饭热一下。'] },
        { mine:['你先吃吧。'], them:['我先吃了。','但是我留的是你爱吃的那个。','我不太爱吃那个。'] },
        { mine:['对不起，我回来晚了。'], them:['没关系呀。','我等你不算晚。'] }
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

    // 八中足球队队长 · 艺体两开花的 if 线
    '丞丞': {
      init: [['11月15日','date']],
      replies: [
        { mine:['我马上回去。'], them:['快回去啊，别让人等 😾'] },
        { mine:['你今天怎么这么晚还踢球。'], them:['路过你家，灯是暗的。'] }
      ],
      fragment: null
    },
        
    // 👇 新增 '恩恩' 的剧情配置 👇
    '恩恩': {
      init: [['11月15日','date']],
      replies: [
        { mine:['我尽量早点过去。'], them:['不用勉强。','我一个人也可以的。','……真的。'] },
        { mine:['对不起，让你等了。'], them:['我没生气。','我只是有点难过。','但是你说对不起，我就不难过了。'] }
      ],
      fragment: null
    },
    
    // 👇 如果你把 '闺蜜' 改成了 '穆小恩'，要在这里也加上 👇
  };

  /* 完整时间线：所有人都会按秒数弹出来 */
  S.timeline = [
    { at: 0, type:'notify', from:'穆小恩', text:'姐们儿 你人呢？手机怎么在街上？' },
    { at: 3, type:'notify', from:'穆小恩', text:'我打你电话你不接 我打的不是抢劫报警' },
    { at: 7, type:'notify', from:'穆小恩', text:'刚刚还跟我说话，一转眼人没了。' },
    { at: 10, type:'notify', from:'穆祉丞', text:'你去哪里了？马上快要到我的生日零点了，蛋糕已经摆好了，就差你。' },
    { at: 13, type:'notify', from:'pig', text:'馋死了' },
    { at: 17, type:'notify', from:'pig', text:'你什么时候回来吃蛋糕' },
    { at: 20, type:'notify', from:'穆小恩', text:'你有病吧 别吓我' },
    { at: 23, type:'notify', from:'MuAMuA', text:'宝宝，今天下雪了外面很冷，不要一个人待在外边好不好。' },
    { at: 27, type:'notify', from:'穆祉丞', text:'今天我很想你。' },
    { at: 30, type:'notify', from:'cat', text:'你死哪去了' },
    { at: 34, type:'notify', from:'cat', text:'？' },
    { at: 37, type:'notify', from:'丞哥', text:'？' },
    { at: 40, type:'notify', from:'丞哥', text:'这样不乖哦。' },
    { at: 44, type:'notify', from:'穆小恩', text:'喂。' },
    { at: 47, type:'notify', from:'cat', text:'老子不问了' },
    { at: 50, type: 'call', from: 'pig' },
    { at: 56, type:'notify', from:'rabbit', text:'下雪了 你回来的时候小心一点哦' },
    { at: 60, type:'notify', from:'穆瑞恩', text:'你在哪里呀？练习室好黑，大家都走了。' },
    { at: 63, type:'notify', from:'pig', text:'？' },
    { at: 66, type:'notify', from:'pig', text:'没人要猪了' },
    { at: 70, type:'notify', from:'pig', text:'😭😭😭' },
    { at: 73, type:'notify', from:'恩仔', text:'我有点害怕……你不要丢下我好不好。' },
    { at: 76, type:'notify', from:'穆小恩', text:'下这么大雪你现在还在外面 说个位置' },
    { at: 80, type:'notify', from:'穆祉丞', text:'？' },
    { at: 83, type:'notify', from:'恩恩', text:'蛋糕我摆好了，再不来我就自己吹蜡烛了。' },
    { at: 87, type: 'call', from: '穆祉丞' },
    { at: 93, type:'notify', from:'cat', text:'老子数到三' },
    { at: 96, type:'notify', from:'恩恩', text:'哦。' },
    { at: 99, type:'notify', from:'cat', text:'三' },
    { at: 103, type:'notify', from:'恩恩', text:'我没有生气啊。' },
    { at: 106, type:'notify', from:'Mu', text:'上号' },
    { at: 109, type:'notify', from:'cat', text:'二' },
    { at: 113, type:'notify', from:'rabbit', text:'我给你留了饭' },
    { at: 116, type:'notify', from:'穆小恩', text:'接电话啊！' },
    { at: 119, type:'notify', from:'MuAMuA', text:'我看到你已读了。回我一句，就一句。' },
    { at: 123, type:'notify', from:'恩仔', text:'我明天就十四岁了。' },
    { at: 126, type:'notify', from:'穆祉丞', text:'宝宝，回一句。' },
    { at: 129, type: 'choice' },
    { at: 135, type:'notify', from:'丞丞', text:'诶你人呢' },
    { at: 139, type:'notify', from:'丞丞', text:'今天不是他生日吗' },
    { at: 142, type:'notify', from:'恩恩', text:'我数三下了。三。' },
    { at: 146, type:'notify', from:'丞丞', text:'你该不会还在外面吧' },
    { at: 149, type:'notify', from:'cat', text:'一' },
    { at: 152, type:'notify', from:'rabbit', text:'是不是路上堵车了？' },
    { at: 156, type:'notify', from:'丞丞', text:'😾' },
    { at: 159, type:'notify', from:'丞哥', text:'定位在解放碑。你一个人？' },
    { at: 162, type:'notify', from:'恩恩', text:'二。' },
    { at: 166, type:'notify', from:'穆瑞恩', text:'今天压腿很痛，我不敢跟别人说。你什么时候才会来呀？' },
    { at: 169, type:'notify', from:'穆小恩', text:'行 你不接我挨个儿问' },
    { at: 172, type:'notify', from:'rabbit', text:'那我再等一会儿' },
    { at: 176, type:'notify', from:'恩仔', text:'曾经很多次，我躲起来哭的时候，都在幻想会不会有一个人看见我。' },
    { at: 179, type:'notify', from:'Mu', text:'？' },
    { at: 182, type:'notify', from:'恩恩', text:'你是不是不爱我了。' },
    { at: 186, type:'notify', from:'Mu', text:'今天他生日' },
    { at: 189, type:'notify', from:'穆祉丞', text:'外面下雪了，你到底在哪。' },
    { at: 193, type:'notify', from:'Mu', text:'你不回去？' },
    { at: 196, type:'notify', from:'rabbit', text:'我不催你的，真的' },
    { at: 199, type:'notify', from:'穆小恩', text:'说真的，这手机明明是你的，为什么里面全是他？' },
    { at: 203, type:'notify', from:'MuAMuA', text:'我不问你去了哪。' },
    { at: 206, type:'notify', from:'cat', text:'你要爪子嘛，回个话要你命哦' },
    { at: 209, type:'notify', from:'恩仔', text:'后来真的有一个人看见了。' },
    { at: 213, type:'notify', from:'cat', text:'老子把门反锁了，你别回来了' },
    { at: 216, type:'notify', from:'丞哥', text:'气笑了。' },
    { at: 219, type:'notify', from:'丞丞', text:'雪把球场盖了，球踢一半就散了' },
    { at: 223, type:'notify', from:'恩恩', text:'我不是非要你今天回来的。' },
    { at: 226, type:'notify', from:'丞丞', text:'我路过你家楼下了 灯是暗的' },
    { at: 229, type: 'call', from: '恩恩' },
    { at: 235, type:'notify', from:'恩恩', text:'我只是……算了。' },
    { at: 239, type:'notify', from:'rabbit', text:'就是今天……好像是什么日子' },
    { at: 242, type:'notify', from:'丞哥', text:'几点。' },
    { at: 246, type:'notify', from:'穆小恩', text:'我不进你家门 我就在楼下站着' },
    { at: 249, type:'notify', from:'穆瑞恩', text:'我等了你好久好久。' },
    { at: 252, type:'notify', from:'恩仔', text:'没关系，你忙。' },
    { at: 256, type:'notify', from:'MuAMuA', text:'但你得让我知道你没事。' },
    { at: 259, type:'notify', from:'cat', text:'（门没锁）' },
    { at: 262, type:'notify', from:'穆祉丞', text:'我数到十。' },
    { at: 266, type:'notify', from:'rabbit', text:'我把蜡烛摆好了，不会点' },
    { at: 269, type:'notify', from:'丞哥', text:'我要开始数了。' },
    { at: 272, type:'notify', from:'恩恩', text:'我生气了（真的）。' },
    { at: 276, type:'notify', from:'cat', text:'……我一个人吃的烧烤，凉了' },
    { at: 279, type:'notify', from:'pig', text:'蛋糕要化了' },
    { at: 282, type:'notify', from:'恩仔', text:'我今天练完了，一个人在练习室。' },
    { at: 286, type:'notify', from:'rabbit', text:'你慢慢来，我不着急' },
    { at: 289, type:'notify', from:'丞丞', text:'快回去啊，别让人等' },
    { at: 292, type:'notify', from:'穆小恩', text:'不管了，先去你家门口等你。' },
    { at: 296, type:'notify', from:'穆祉丞', text:'穆祉丞。' },
    { at: 299, type:'notify', from:'Mu', text:'1' },
    { at: 303, type:'notify', from:'MuAMuA', text:'雪这么大，长寿面煮好了，汤还温着。' },
    { at: 306, type:'notify', from:'cat', text:'你回来老子不打你' },
    { at: 309, type:'notify', from:'rabbit', text:'但是我有点想你了' },
    { at: 313, type:'notify', from:'丞哥', text:'三。' },
    { at: 316, type:'notify', from:'恩仔', text:'你还会来吗。' },
    { at: 319, type:'notify', from:'恩恩', text:'……你回来我就不生气了。' },
    { at: 323, type:'notify', from:'穆祉丞', text:'零点过了。你说过会回来的。' },
    { at: 326, type:'notify', from:'穆瑞恩', text:'姐姐，生日要过去了，你还不来吗。' },
    { at: 330, type: 'ending' }
  ];

  // 节奏：开场多久开始催、压缩强度（数字越大越早结束）
  S.pace = { offset: 90, amp: 1124, soft: 500 };
  // 多少秒之后开始"时间线跑完还在催"的追加压力
  S.nagFrom = 680;

  // 耐心值：对方发来催促后多少秒内没回，就算错过这段对话
  S.patienceSec = 100;
  // 错过时对方留下的最后一句
  S.missLines = {
    default: "算了。",
    穆小恩: "行吧，你先忙。我等你回我。",
    MuAMuA: "不催你了，记得吃饭。",
    丞丞: "快回去啊，别让人等。",
    丞哥: "爱回不回。",
    穆祉丞: "那我自己吹蜡烛了。",
    穆瑞恩: "没关系，我再等一会儿。",
    恩仔: "我不吵你了……",
    Mu: "我记住了。",
    恩恩: "哦。",
    pig: "那我把蛋糕吃了啊",
    cat: "……喵都不喵了",
    rabbit: "我不催你的，真的。",
    tiger: "哼",
  };

  // 每个人的微信号（资料页展示）
  S.wxids = {
    穆祉丞: "nanpengyou",
    穆瑞恩: "xiaobaobei",
    穆小恩: "haoguimi",
    恩恩: "laopo_jiao",
    恩仔: "xiaolianxisheng",
    丞哥: "cgcgdsg",
    MuAMuA: "mama",
    Mu: "CSGOD",
    丞丞: "chengcheng",
    pig: "xiaopangpang",
    cat: "laopo_zuo",
    rabbit: "laopo_guai",
    tiger: "laohu_henmeng",
  };
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
  S.events = {
    16: ["🎂 19岁生日"],
  };
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
    ["穆小恩", "今天 23:04", "未接来电"],
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
      ["穆祉丞", "下雪了。慢一点，别跑。"],
      ["你", "对不起，我好像来晚了。"],
      ["穆祉丞", "不晚。今天还没过。"],
      ["穆祉丞", "蛋糕给你留着。"],
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
  S.photoSections = S.photoSections || [];
  photoSections.splice(0, photoSections.length, ...S.photoSections);
  MAP_PLACES.splice(0, MAP_PLACES.length, ...S.mapPlaces);
  MAP_RECENTS.splice(0, MAP_RECENTS.length, ...S.mapRecents);
  for (const k in DISPLAY) delete DISPLAY[k];
  Object.assign(DISPLAY, S.display);

  // 数据指纹：改过 chat_history / story 后，旧存档自动作废
  window.DATA_SIG = (function () {
    try {
      const s = JSON.stringify(chatData) + "|" + (S.timeline || []).length;
      let h = 5381;
      for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
      return (h >>> 0).toString(36);
    } catch (e) {
      return "0";
    }
  })();

  window.STORY_STATE = {
    stage: {},
    lineIdx: {},
    fragments: new Set(),
    goingHome: 0,
    choice: null,
    arriveHome: false,
    completed: new Set(),
    fired: new Set(),
    missed: new Set(),
    privateUnlocked: false,
    memoUnlocked: false,
    pendingText: "",
    typing: false,
    replyBusy: false,
  };
  // 不做存档：每次刷新都是全新一局
  
})();


const S = (window.STORY = window.STORY || {});
S.roles = S.roles || {};
S.chats = S.chats || {};
S.timeline = S.timeline || [];
S.notes = S.notes || [];
S.events = S.events || {};