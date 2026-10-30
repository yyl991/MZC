# HANDOVER ·「橙粉色捡起来」捡手机网页

> 更新时间：2026-10-30
> 分支：`feature/update-ui` · 最新提交：`4988a73` · 远端：`origin`（= `mzc:yyl991/MZC.git`）

写给接手的新 AI。读完这份 + 同目录的 `角色聊天记录总表.md` 就能接着干。

---

## 一、这是个什么项目

**「捡手机」梦女向剧情网页**。

玩家（身份：小纸团，穆祉丞的粉丝）恍惚间在街角捡到一部手机——那是自己的手机，但微信里塞满了好几个"穆祉丞"：不同时期、不同身份的他。他们全都在疯狂找你。你要在 **2026 年 11 月 16 日零点前赶回家**，陪他过 19 岁生日。

- **形态**：纯静态网页，手机浏览器打开
- **用途**：作者发给朋友玩的私人作品，**不是商业项目**
- **线上**：`https://cgcgdsg.cc.cd`
- **仓库**：`C:\Users\53184\Desktop\233\MZC`，项目在 `newload/`
- **技术栈**：原生 JS，无框架、无打包器。`index.html` 动态按序插入 `<script>`，全部共享全局作用域

### 情感内核
玩家入坑很晚，错过了穆祉丞九年练习生岁月里无数难熬的时刻。手机里那些"过去的他"（8 岁的穆瑞恩、12 岁的恩仔）一直在各自的时间里等他，而那时候他还不认识他。现在他终于来了，却隔着时间缺口。

---

## 二、当前状态（一句话）

**功能主体已完成，内容层（聊天记录 / 催命时间线 / 朋友圈）已全部落地。**

结构层（角色增删、微信号、聊天列表）和内容层（聊天记录 1518 条、催命时间线 96 条、朋友圈 24 条）都已改完并推送。

---

## 三、马上要接手的活儿（重要）

> 内容层（时间线 / 聊天记录 / 朋友圈）**已经全部落地**，下面 3.1–3.3 是事后记录，方便你改的时候不踩坑。

### 3.1 已完成 · 今晚催命时间线

`S.timeline` 共 **96 条**，由 `角色聊天记录总表.md` §3–§13 的「今晚催命」表生成。

2026-10-29 重排过一次节奏（作者反馈「有点急，让人探索完」）：

- `GAME_END_AT` 460 → **660 秒**（23:09 → 00:00 用 11 分钟走完）
- `S.pace = { offset:90, amp:1124, soft:500 }`
- `at` 按**槽位**均匀分配：`call` 和 `choice` 各占 1.8 个槽位，前后自动空出约 12 秒
- 结果：相邻消息间隔 **4.3–11.8 秒**，平均 6 秒；三通来电落在 192 / 263 / 508 秒
- `S.nagFrom` 470 → **680**（时间线跑完之后再施压）

**改 `at` 前先看这段，别再把尾部压成 1 秒一条。** `pacedAt()` 会做对数压缩，`buildInterleavedTimeline()` 会把同一个人连发的消息打散。

### 3.2 已完成 · 各角色聊天记录

13 个角色全部按文档导入，约 1518 条。`CHAT_HISTORY` 的键名必须和 `S.roles` / `S.wxids` / `S.chats` 完全一致。

### 3.3 已完成 · 朋友圈内容

`MOCK_MOMENTS_DATA` 共 24 条、12 个角色。`cat` / `pig` / `rabbit` 用代码 key，渲染走 `dn()`。

### 3.4 已做 · 拉黑 / 引用 / 拍一拍记录

- **拉黑**：聊天长按菜单和资料页都有「加入黑名单」，`window._wxBlocked[name]` 会拦掉对方的新消息、追命电话和通知；聊天信息页可移出。
- **引用**：长按任意消息选「引用」，输入条上方出现引用预览，发送后消息第 5 位存 `{name,text}`。
- **拍一拍记录**：聊天信息页 →「拍一拍记录」，列出聊天里所有「拍了拍」系统消息。
- 被对方删除的 `'rejected'` 特效保持原样。消息第 4 位还支持手写 `'blocked'`（自己拉黑对方后发的消息），只出红叹号、没有验证提示。

### 3.5 用户自己改了一半的地方

`views/wx_moments.js` 里用户把「小狗团汪汪」全部改成了「我」（4 处），**还没提交**。不要回滚，正常保留即可。

---

## 四、已经完成的（按时间倒序）

### 本轮：微信时间分级 / 补零 / 两种红叹号（`cc2b365`、`1dd8cce`、`fe8585f`、`13837c4`）
- **会话列表时间分级** `wxListTime(dateLabel, timeStr)`：
  | 距今天 | 显示 |
  |---|---|
  | 今天 | `下午 03:00` |
  | 昨天 | `昨天` |
  | 2–6 天前 | `周二` |
  | 今年更早 | `11月12日` |
  | 跨年 | `2025年11月12日` |
  「今天」唯一来源 = `gameTodayLabel()`：`gameMin() >= 24*60` 算 `11月16日`，否则 `CFG.start.date`（`11月15日`）。列表渲染处 `const time = last ? wxListTime(chatLastDate(n), last[2]) : ""`，`chatLastDate()` 取「**最后一条消息**所属的日期段」——数据末尾常挂着一条空的 `["11月15日","date"]`（留给今晚的消息），直接取最后一个 date 行会让所有会话都判成今天（踩过）。
- **聊天记录内的时间胶囊** `getWxTimeString()` 同一套规则（早就实现，只是「今天」原来硬编码 `2026-10-15`，已改走 `gameTodayLabel()`）。10 分钟内不重复显示时间。
- **排序**：置顶优先，其余按 `chatLastStamp`（日期+时间）倒序；新消息先 `ensureChatToday()` 补今天日期段再 push，`view==="wechat"` 时整体重渲染 → 自动上浮，无需手动重排。
- **时间补零** `padHm()`（`core/utils.js`）：`下午 6:16 → 下午 06:16`。用在：消息胶囊早返回分支（`昨天/前天/周x/yyyy年`）、聊天搜索、朋友圈、`wxTimeLabel`。**数据文件里仍是裸时间，只在渲染层补，没有动 `data/`。**
- **两种红叹号**（都是 `.wx-reject-ic`，交互不同）：
  - `'rejected'`（对方把我删了）→ 红叹号 **+ 下方「开启了朋友验证…发送朋友验证」**，点击提示「消息已发出，但被对方拒收了。」
  - `'blocked'`（**数据里手写的第 4 位标记**：我拉黑对方后发的消息）→ 只有红叹号，**没有**验证提示，点击提示「对方已被你加入黑名单，这条消息没有送达。」
  - 运行时拉黑（黑名单开关）：`wxBlockChat()` 把「拉黑那一刻数组最后一行」**行对象**存进 `_wxBlockedSince[name]` 当锚点，渲染时 `x.rawIdx > ai` 才算 blocked。用行对象而不是下标，删消息/清空都不会算错；**拉黑前已发的消息不会追溯变叹号** —— 想给某条补叹号就在数据里写 `'blocked'`。
- **验证**：沙箱跑真实 `chat_history`，黑猫（`cat`）聊天里 `'rejected'` 11 条 + `'blocked'` 2 条 = 渲染出 13 个 `.wx-reject-ic`，对得上；`npm test` 11/11 通过。
- **测试**：`tests/chat.test.js` 增加列表时间 5 条、补零 1 条、`'blocked'` 2 条、黑名单文案 2 条。
- ⚠️ `data/chat_history.js`、`data/story.js` 是**作者自己在改**，全程未提交、未改动，`git add` 也别带它们。
- **`角色聊天记录总表.md` 结构重排**（2026-10-30）：§0 的 10 个「本轮追加」小表合并成一张 61 行的修订表（编号保留原样，重复的用 `41b` / `45b`）；新增目录；§2 时间线表头归位；§2.5 C 角色索引改为指向 §1（两处不再重复维护）；§11 子标题改 `11.1–11.4`；§14.1 老虎标题规整；§17 末尾重复的改动表并入 §0。**恩恩 / MU / 黑猫 / 丞丞四个角色的聊天记录逐行比对过，正文零改动**（黑猫只把小节标题的「（含被删除特效）」挪进正文说明）。
- 顺手留个疑点没动数据：§2 时间线写「大圈证（全国第 33 / 招 25）」，而 §0 #41 和 §17 都写「27」，作者自己确认哪个对。

### 上一轮：角色体系重构（`59f7d0e`）
- **删除穆老爹**：角色、聊天、微信号全移除；他的三句（钱打你卡上了 / 别省 / 几点回）改写成丞哥的阴湿男语气
- **删除蓝胖胖**：食堂留饭、开黑记录并入 `pig`（猪）
- **新增「丞丞」** `chengcheng`：八中足球队队长 if 线，129 条记录，从 2023.3 球场初遇 → 2026.7 中戏录取
- **修 bug**：`chat_history.js` 和 `story.js` 里 `'穆小恩'`、`'tiger'` 各定义了两次，后者覆盖前者，导致穆小恩前面一整段记录根本不显示
- **微信号全部换新**（见下表）
- 时间线里穆老爹两条 → 丞哥「？」「这样不乖哦。」
- 通讯录分组、朋友圈点赞名单同步

### 上一轮：微信「被删除」特效（`54687d5`）
- 消息数组第 4 位支持 `'rejected'`
- 气泡左侧红色感叹号，点击提示发送失败
- 连续拒收消息只在最后一条下方显示一次「你还不是对方好友」
- 4 条测试断言

### 更早（本轮会话内）
| 提交 | 内容 |
|---|---|
| `fc006b6` | 凌晨显示「上午0:xx」而不是「上午12:xx」 |
| `e83496d` | BGM 改为手势重试直到播放成功（原来 `{once:true}` 失败一次就永久静音）；音量调大 |
| `e8c786a` | 资源版本号机制 |
| `2b59808` | 朋友圈三个点只控制赞/评论胶囊，他人的点赞评论恢复常显 |
| `42afa05` | 适配 EdgeOne 构建（未启用） |
| `38809bf` | 时钟自然流动、锁屏/拨号下移、首屏加速、收藏页删除等一批 |
| `b102520` | 朋友圈详情页九宫格 + 浮动赞/评论入口 |

### 早期就定下的产品决策（不要推翻）
| 决策 | 说明 |
|---|---|
| **完全没有存档** | 每次刷新 = 全新一局。`saveStory()` / `saveChat()` 是空函数。**绝对不要再加 localStorage 存档**——之前加过，刷新后游戏时钟回到开头但聊天记录已推到后面，完全错乱 |
| **占位功能统一 `toastDev()`** | 视频号/直播/看一看/听一听/附近的人/游戏/小程序/我的作品/小店与卡包/拍摄，只留入口，点击弹随机文案，**不要实现真实功能** |
| **所有 SVG 放 `core/icons.js`** | 视图文件里不许写内联 `<svg>` |
| **中文用系统输入法** | 自绘键盘打不了中文。只有红包/转账金额用内置数字键盘 `wxAmountPad` |
| **拍一拍 + 点头像共存** | 单击(300ms延迟)进资料页，双击触发拍一拍，见 `wxPatTap` |
| **消息交错到达** | `buildInterleavedTimeline()` 按人 round-robin 打散成 a-b-c-a-b-c |
| **打电话给谁都会回拨** | `scheduleCallBack()`，但**拨号键盘直接拨的号码不回拨**（`dial(name, true)`） |

---

## 五、角色与微信号（当前生效）

| 角色 | 微信号 | 身份 | 时间段 |
|---|---|---|---|
| 穆祉丞 | `nanpengyou` | 正室 · 男朋友 | 2026 当下 |
| 穆瑞恩 | `xiaobaobei` | 8 岁舞社小孩（未公开） | 2014–2016 |
| 恩恩 | `laopo_jiao` | **娇** · 一哄就化 | 2025–2026 |
| **cat**（黑猫） | `laopo_zuo` | **作** · 重庆大小姐 | 2025–2026 |
| **rabbit**（兔子） | **`laopo_guai`** | **乖** · 说啥都信 | 2025–2026 |
| 丞丞 | `chengcheng` | 八中足球队队长 · 艺考 if 线（大圈） | 2023–2026 |
| **pig**（猪） | `xiaopangpang` | 只想吃蛋糕的 | 2026 当下 |
| Mu | `CSGOD` | CSGO 电竞选手 | 2025–2026 |
| MuAMuA | `mama` | 男生 · 强行当妈（错位感） | 2026 当下 |
| 丞哥 | `cgcgdsg` | 阴湿哥哥 | 2026 当下 |
| 恩仔 | `xiaolianxisheng` | 12–14 岁公司小练习生；聊天记录里存着公开之后每年的生日 | 2019–2025 |
| tiger（老虎） | `laohu_henmeng` | 保留原样，待规划 | — |

> **键名规则**：`cat`、`pig`、`tiger`、`rabbit` 用英文键 + `DISPLAY` 映射成 emoji（🐈‍⬛ / 🐖 / 🐅 / 🐇）。这是作者的要求（"保持原来的映射"）。
> 其他角色直接用中文名做键。
> **`roles` / `wxids` / `CHAT_HISTORY` / `STORY.chats` 四处键名必须完全一致**，否则聊天记录不显示。

---

## 六、技术架构速览

```
newload/
├── index.html      入口。动态按序 load 11 个脚本，ASSET_V 控制缓存
├── style.css       全部样式（约 4400 行）
├── core/
│   ├── app.js      路由、游戏时钟、锁屏、timeline 引擎、启动
│   ├── audio.js    音效合成 + BGM 管理
│   ├── icons.js    所有内联 SVG（唯一存放处）
│   ├── utils.js    navHTML / tabbar / esc / pad / 时间解析
│   └── store.js
├── data/
│   ├── story.js    主配置：roles / chats / wxids / timeline / pace / notes / emails
│   └── chat_history.js  各角色过往聊天记录
├── views/          11 个页面模块，注册到全局 VIEWS
├── tests/          Node vm 沙箱回归测试（115 项）
└── obfuscate.js    打包脚本（输出 dist/，当前未启用）
```

> **加新模块时**：在 `index.html` 的 `scripts` 数组里按依赖顺序插一行（`data/` → `core/` → `views/`），漏加就是 `initApp()` 时找不到全局函数。`dist/` 不参与部署。

### 关键机制

**路由**：`VIEWS` 注册表 → `show(id, anim)` / `push(id)` / `back()`。`PARENT` 映射决定返回目标，`ROOT_VIEWS` 白名单里的页面会隐藏返回键（详见下面「全局返回键」）。

**游戏时钟**：
```js
let base = 0;                                    // 不在脚本加载时定
function startClock() { base = Date.now(); }     // 锁屏渲染完成后才定
function gameMin() {
  const e = elapsed();
  if (e <= GAME_END_AT) return GAME_START_MIN + Math.floor((e / GAME_END_AT) * 51);
  return GAME_START_MIN + 51;  // 00:00 卡住，不让生日过去
}
```
23:09 开始，**660 秒**后到 00:00，之后**停在零点**。时间线里的 `choice` / `ending` 已经接通，但**开发模式（localhost / ?dev=1）下不触发**，方便调试。

> 凌晨 0 点显示成「**上午 00:0x**」（`clock12()` / `ampm()` 里用 `pad(h % 12)`）。作者 2026-10-30 明确要求改回 0 点，不要再按旧文档改成 12。

**剧情节奏**：
```js
pacedAt(at) = offset + amp * ln(1 + at/soft)   // CFG.pace = {offset:90, amp:1124, soft:500}
```
对数压缩：越往后间隔越短（当前 6.4 秒 → 4.2 秒，不再陡成 1 秒一条）。`pressureTick()` 在 `nagFrom`(680秒) 之后继续施压。

**语音留言**：占位用 `data/album/boli.mp3`，等作者换真人录音。

### 数据格式速查（填内容照这个写）

**聊天消息**（`CHAT_HISTORY[角色]` / `S.chats[角色]`，两者拼起来就是完整聊天）：

```js
['11月15日', 'date']                              // 日期分隔行
['文本', 'me' | 'them', '下午 10:05']              // 普通气泡
['文本', 'me', '下午 10:05', 'rejected']           // 被对方删除 → 红叹号 + 验证提示
['文本', 'me', '下午 10:05', 'blocked']            // 我拉黑 TA 之后发的 → 只有红叹号
['文本', 'me', '下午 10:05', 'rd']                 // 发送中
['文本', 'me', '下午 10:05', '', { name, text }]   // 带引用
['[系统] 我拍了拍他', 'sys', '下午 10:15']          // 系统提示（会补小尾巴）
['[图片] ./data/chat/1.jpg', 'them', '...']
['[表情] ./data/chat/emoji.png', 'them', '...']
['[语音] 5|./data/chat/boli.mp3|今天好累呀', 'them', '...']        // 秒数|音频|转写
['[视频] ./data/chat/1.mp4|./data/chat/c.jpg|0:15', 'them', '...'] // 视频|封面|时长
```

**时间线**：`S.timeline = [{ at: 秒, type: 'notify' | 'call' | 'mail', from, text, subject, body }]`
**备忘录**：`S.notes = [标题, 预览, 全文, 日期]`，全文里的换行用 `\n`
**日历**：`S.events = { 15: ['捡到手机'], 16: ['🎂 生日'] }`
**朋友圈**：`MOCK_MOMENTS_DATA[角色] = { wxid, region, cover, posts: [{ id, date:{day,month}, text, images, time, likes, comments }] }`，`id` 越大越靠前；`cat` / `pig` / `tiger` / `rabbit` 用代码 key，渲染走 `dn()`。

### 主屏幕与黑胶唱片（`views/home_ui.js`）

`renderHome()` 完全接管主屏幕：大日历（含迷你月历 + 事件点）占满顶部，天气 + 黑胶 2x2，下面 App 图标网格。

- **旋转**：`requestAnimationFrame` 实时算角度，写成行内 `transform: rotate()`。**绝对不能用 CSS animation**——收消息重绘会把动画打回零。
- **切图**：`musicImages` 数组（加图直接 push），两层 `<img>` 用 opacity 交叉过渡。监听 `bgm.onended` 才切下一张；暂停不切，恢复播放才切。
- **点击锁**：`toggleHomeMusic()` 置 `window.isVinylBusy = true`，动画结束解锁；`core/app.js` 重绘处 `if (view === "home" && !window.isVinylBusy) renderHome()` 拦截。
- 暂停**只 `pause()`**，不要碰 `currentTime`。

### 全局返回键（`show()` 自动注入，别手写）

- **一级界面**（`core/app.js` 的 `ROOT_VIEWS`：home / lock / pin / wechat / wx_contacts / wx_discover / wx_me / phone / sms / weather / recorder / calendar / clock / notes / safari / music / maps / photos / settings / mail / weibo / weibo_profile / xianyu / xianyu_me / bilibili / xhs / instagram）→ 强制隐藏页面内的 `.nb-back` / `.bk`。
- **二级界面** → 若已有 `.nav` 或 `.wx-chat-h` 容器，或 HTML 里写了 `onclick="back()"` / `closeApp()` / `backSuperTopic()`，就认为你处理过了；**都没有才**自动在 `top:45px; left:10px` 插一个纯色无圆圈的箭头（`.auto-global-back`）。
- ⛔ 所以**别在非 `.nav` 页面再手写返回键**，会出现两个。
- 侧滑 / 物理返回走 `popstate`：主页要 2 秒内两次才允许退出网页；App 内执行 `goBack()` 后重新 `pushState`。
- 微信底部 Tab 切换用 `show()`，**不要用 `push()`**（否则出现推拉覆盖动画）。

### 音频（`core/audio.js` + `#bgm`）

- `AudioHub` 在捕获阶段接管所有 `<video>` / `<audio>`（`#bgm` 除外）：一播放就暂停 BGM，停 100ms 后恢复。**新增视频 / 语音直接写原生标签，不要手写暂停 BGM 的代码。**
- 本地 MP3 在手机端读不到 `duration`，**不要用 `setInterval` 做进度条**。
- `#bgm` 的 volume 有两处设置（`initApp()` 和 `pointerdown` 监听），改一处会被另一处覆盖。

### 朋友圈：路由来源与像素级对齐

- 三组来源变量，`back()` 照此 `pop` 回正确的页面，用完即重置：`_momentDetailFrom`（详情页）、`_momentsUserFrom`（个人相册）、`_profileFrom`（资料页）。都在 `core/app.js`。
- **像素级对齐（作者亲自调过，别动）**：左侧头像固定，右侧内容 `flex: 1`；名字 / 文案 / 图片 / 日期 / 灰框左边缘必须垂直对齐。灰框里**第一列固定 52px** 放点赞爱心与评论气泡，第二列放头像（24 或 32px）。只有**第一条**评论显示气泡 SVG，后面用空 `<div>` 占位。
- 空状态不写"暂无朋友圈"，画一条 80px 灰虚线 + 圆点。
- **三个点只控制黑色胶囊**（赞 / 评论按钮），灰色点赞评论区常显。

---

## 七、怎么跑、怎么测、怎么发版

```bash
cd C:/Users/53184/Desktop/233/MZC
npm --prefix newload test        # 115 项断言，必须全绿
```

发版流程（**顺序不能错**）：
1. 改代码
2. `npm test` 通过
3. **把 `index.html` 里的 `ASSET_V` 加一**（`'20261028f'` → `'20261028g'`）
4. `git add` **具体文件**（不要 `git add .`，会带上作者自己的改动）
5. commit（末尾加 `Co-Authored-By: Claude Code <noreply@anthropic.com>`）
6. `git push origin feature/update-ui`

### 部署
**EdgeOne 直接托管 `newload` 源码目录，push 即部署，不需要上传任何东西。**
线上 `core/app.js` 返回的是明文源码（已验证）。

EdgeOne 的静态缓存是 `Cache-Control: max-age=1200`（20 分钟），所以第 3 步的版本号是必须的，否则作者刷新还是旧版。

> 备选方案（作者说"先不动了"）：在 EdgeOne 控制台配 根目录 `newload` / 构建命令 `npm run build` / 输出目录 `dist`，就能走混淆 + 自动版本号。配置已就绪，但未启用。

---

## 八、绝对不要再踩的坑

### 缓存 / 部署
- ⛔ **不要把脚本 URL 改回 `?v=` + `Date.now()`**。那是"强力防缓存"，每次刷新重下全部资源，作者为此抱怨过两轮
- ⛔ **改完代码忘记 bump `ASSET_V`**。会得到"我明明改了但没生效"的幽灵 bug
- ⛔ **不要说"上传 dist/"**。EdgeOne 自动部署源码，`dist/` 不参与

### 数据
- ⛔ **不要在 JS 对象字面量里重复定义同一个键**。`chat_history.js` 和 `story.js` 都踩过，后者覆盖前者，记录静默消失
- ⛔ **不要把 Emoji 当对象键名**。`cat` / `pig` / `tiger` / `rabbit` 用英文键 + `DISPLAY` 映射，渲染走 `dn()`
- ⛔ **内联 `onclick` 拼名字要转义**。名字里带引号会截断 HTML 属性，用 `esc()` 或 `&quot;`
- ⛔ **不要引不存在的图片路径**。控制台一堆红色 404 会拖慢主线程；缺素材走 `wxMediaMiss` 占位
- ⛔ **大图记得预加载**（`new Image().src = url` 放在 `core/app.js`），否则进页面一片白块
- ⛔ **不要重新引入持久化存档**
- ⛔ **恩恩 / 黑猫 / 丞丞 / MU 四个角色已定稿（2026-10-30 作者定）**：聊天记录、性格、口癖、催命、朋友圈全部冻结，不要改、不要补、不要"顺手优化"，**口癖也不用再写**。见总表 §0.6
- ⛔ **注意 `'pig'` 在 `S.chats` 里的缩进是 8 空格**（不是 4），脚本化改文件时要小心

### 时钟
- ⛔ **不要在脚本加载时定 `base`**，玩家看着"请稍后…"时剧情就在走了
- ⛔ **不要给 `gameMin()` 加封顶**

### 朋友圈
- ⛔ **三个点只控制黑色胶囊**（赞/评论按钮），下面的灰色点赞评论区必须一直显示。上一轮把灰框也藏了，被退回重做

### 路由
- ⛔ **微信底部 Tab 用 `show()`，不要用 `push()`**，否则出现推拉覆盖动画
- ⛔ **别在非 `.nav` 页面手写返回键**，`show()` 已经自动注入，会变成两个
- ⛔ **不要在脚本加载时提前 `pushState`**，会打乱 `popstate` 的二次确认

### 主屏幕
- ⛔ **黑胶不能用 CSS animation**，必须 `requestAnimationFrame` + 行内 `transform`
- ⛔ **别在 `renderHome()` 外面重绘主屏幕**，会打断黑胶；重绘前先看 `window.isVinylBusy`

### 电话
- ⛔ **拨号键盘拨出的号码不要回拨**（`dial(name, true)`）
- ⛔ 追命有次数上限（穆祉丞 5 次、其他人 3 次），超了发 `CALL_ANGRY` 收手，不要改成无限
- ⛔ **挂断后 `closeCallUI` 必须退回原界面**，不能强行打开电话 App

### 音频
- ⛔ **`#bgm` 的 volume 有两处设置**：`initApp()` 和 `pointerdown` 监听。改一处会被另一处覆盖——之前声音小的根因就是这里
- ⛔ BGM 播放用 `tryStartBGM()`，**不要改回 `{once:true}`**
- ⛔ BGM 被打断**只能 `pause()`**，绝不能碰 `currentTime = 0`
- ⛔ **不要手写暂停 BGM 的代码**，`AudioHub` 已全局接管
- ⛔ **不要用 `setInterval` 做本地音频进度条**，手机端读不到 `duration`

### 工具
- ⛔ Windows 下 Python `print()` 中文到 GBK 控制台会抛 `UnicodeEncodeError`，**文件其实已经写成功了**，别误判重做
- ⛔ heredoc 里的 `\n` 可能被 shell 解释成真实换行破坏 JS，用 Python 写文件更稳
- ⛔ `grep -P` 在这个环境不可用（locale 问题）
- ⛔ **`const` / `let` 定义的函数不会挂到 `window`**。要在 `onclick` 里调就得 `window.foo = foo`，或者用顶层 `function` 声明
- ⛔ 所有脚本共享全局作用域，**同名函数后者覆盖前者**，新增全局函数前先 grep 一遍

---

## 九、和作者协作的方式

- **全程中文**
- **非常在意 token**，回答要短，给结论不要罗列
- **做完主动 push**
- 改了功能要说明改了什么，让他决定是否保留
- 他会直接发截图说 UI 哪里不对，以截图为准确认
- 他给的对话原文标 `✅ 原文` 的**一个字都不能改**
- **`data/chat_history.js`、`data/story.js` 是他自己在写**，不要动内容，也别 `git add` 带上

### 交付规则（踩过很多次，按这个来）

| 情况 | 怎么给 |
|---|---|
| 一个文件改了 3 处以上 / 跨多个 `VIEWS` | **给整文件**，让他直接覆盖 |
| 只改一个函数 | 给那段函数 |
| 只改一个 `onclick` | 给那一个 div |

- ⛔ **不要"修改第 XX 行"式补丁**，他极度讨厌对行号
- ⛔ **UI 默认冻结**：除非他明确说改 UI，否则 HTML 结构 / class / style / 布局一律不碰，只改逻辑
- **先讲机制再动手**：涉及跳转、状态、路由的，先用一段话讲清楚基础逻辑，他点头再写代码
- **代码必带防呆**：`typeof X !== 'undefined'`、`|| {}`、`if (!x) return`，某个模块没加载不能全站白屏
- 他会问"你是在我源代码的基础上改的吗"，**改之前先读源文件，不要凭印象生成**

---

## 十、上线前必做

1. **恢复 `obfuscate.js` 的 domainLock**（2026-10-28 为分享测试临时关掉的，见 memory `domain-lock-reminder.md`）。历史白名单：

   ```js
   domainLock: [
     'cgcgdsg.cc.cd',                   // 当前专属域名
     'mzc1116-10g3u3eg.maozi.io',       // 帽子云默认链接
     'mzc1116.cc.cd',                   // 旧域名
     'mzc-dpv14dr9uz2g.edgeone.dev',    // EdgeOne 备用
     'localhost'
   ]
   ```

   ⛔ 域名不在名单里会**直接白屏跳 `about:blank`**。加了新域名一定要补进来。
2. **确认 `debugProtection`**：现在 `obfuscate.js` 里是 `true`，而旧文档记录它会让部分手机浏览器崩白屏、建议设 `false`。改之前和作者确认一次。
3. 替换语音留言的占位音频
4. 补全缺失的聊天素材（`data/chat/` 里只有 `1.mp4`、`boli.mp3`、`pigcry.jpg`，但聊天记录引用了大量 `./data/chat/xxx.png`，目前走 `wxMediaMiss` 占位）
5. **核对分享卡片**：`index.html` 的 `og:image` / `weibo:image` 必须是完整 HTTPS 绝对路径、正方形（600×600 或 1200×630）；改完在分享链接后加 `?v=1` 让微信 / 微博重新抓取。

---

## 十一、旧版交接文档：哪些已经过时

以前几版交接文档的结论，有些还成立、有些已经作废。**只看这份 HANDOVER 就够**，下表是给"翻到旧文件"的人对照用的。

### 11.1 已过时（别照着做）

| 旧文档说法 | 现状 |
|---|---|
| 文件是 `app.js` / `chat.js` / `data_extra.js` / `story.zh.js` | 早已拆成 `core/` + `views/` + `data/`，名字全变了 |
| "当前是开发者调试模式，直接跳过锁屏" | 已恢复锁屏 + 密码（`1116`） |
| 部署在**帽子云** | 现在主用 **EdgeOne**，直接托管 `newload` 源码目录，push 即上线 |
| `s.src = src + '?v=' + new Date().getTime()` 强力防缓存 | 已改成固定 `ASSET_V`，**别改回去** |
| 用 `setInterval` 做音乐进度条 | 本地 MP3 读不到 `duration`，别做 |
| 黑胶用 CSS `animation` 转 | 必须 `requestAnimationFrame` |

### 11.2 旧文档里的 Todo，现在什么样

| 事项 | 状态 |
|---|---|
| 朋友圈列表 / 详情 / 点赞评论 | ✅ 已完成（`views/wx_moments.js`） |
| 通讯录 / 发现 / 我 三个 Tab | ✅ 已完成（`views/wx_pages.js`） |
| 相册九宫格 / 备忘录 / 邮件 / 日历 | ✅ 已完成 |
| 长按图标 3D Touch | ❌ 没做 |
| 控制中心 / 通知中心 | ❌ 没做 |
| 灵动岛 | ❌ 没做，HTML 在 `index.html` 里被注释掉了 |
| 音乐 App / Safari / 地图 | ❌ 没做。`index.html` 里那三行是**注释掉的**，`app_safari.js`、`app_music.js`、`app_map.js` 文件本身都不存在 |
| 加剧情分支 / 补聊天记录 | 内容层已落地；**恩恩 / 黑猫 / 丞丞 / MU 已冻结**，别加 |

### 11.3 旧文档里仍然有效的提醒

黑胶不能 CSS 动画、BGM 只能 `pause()`、AudioHub 全局接管媒体、微信 Tab 用 `show()`、域名白名单、`debugProtection` 可能崩浏览器——这些都已经并入 §六 和 §八，不用再翻旧文件。
