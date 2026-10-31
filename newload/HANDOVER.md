# HANDOVER ·「橙粉色捡起来」捡手机网页

> 更新时间：2026-10-31
> 分支：`feature/update-ui` · 功能基线提交：`4988a73`（当前 HEAD `824c5a4`） · 远端：`origin`（= `mzc:yyl991/MZC.git`）

写给接手的新 AI。读完这份 + 同目录的 `角色聊天记录总表.md` 就能接着干。

---

## 速读索引（先看这里，别整篇读）

> 本文约 400 行 / 26KB，整读约 6.5k tokens；历史与旧文档对照已拆到 **`HANDOVER-ARCHIVE.md`**（约 100 行，只在追溯原因时读）。**按任务跳读**：先看下表，再 `grep -n '^## ' HANDOVER.md` 定位（行号会随编辑漂移，以标题为准）。

| 节 | 里面有什么 | 什么时候读 |
|---|---|---|
| §一 | 项目定位、情感内核、线上地址 | 第一次接手 |
| §二 | 当前状态一句话 | 想知道做到哪了 |
| §三 | 已落地的活；**3.5 相册分组改造（私密入口待挪成最后一张卡）** | 动手前必看 |
| §四 | 产品决策（不要推翻）+ 历史改动指针 | 想改既有行为前 |
| §五 | 角色名单、微信号、键名规则、谁已冻结 | 改角色 / 聊天 / 朋友圈前 |
| §六 | 技术架构：路由、时钟、节奏、数据格式、黑胶、音频、朋友圈对齐 | **改代码前的主入口** |
| §七 | 跑测试、发版流程、EdgeOne 部署 | 要提交 / 上线 |
| §八 | 踩坑清单，按模块分组 | 改哪个模块就先读对应小节 |
| §九 | 和作者协作的规矩、交付格式 | 每次交付前 |
| §十 | 上线前检查清单 | 发版前 |
| §十一 | 旧文档对照指针 | 翻到旧资料时 |
| `HANDOVER-ARCHIVE.md` | 历次改动记录（§A）+ 旧文档结论对照（§B） | 只想知道「为什么这么写」时 |

**按任务跳读组合**：
- 微信聊天 / 朋友圈 → §五 + §六「关键机制」「数据格式速查」+ §八「数据」「朋友圈」
- 锁屏 / 时间线 / 剧情 → §六「游戏时钟」「剧情节奏」「剧情锁定设定」+ §八「时钟」
- 相册 → §三 3.5 + §六「关键机制」（路由）+ §八「缓存 / 部署」
- 黑胶 / 音频 → §六「主屏幕与黑胶唱片」「音频」+ §八「主屏幕」「音频」
- 发版 → §七 + §十

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

**2026-10-31 追加**：锁屏免打扰文案微调；角色「丞丞小队长」全局改名「丞丞」；聊天素材大幅补齐（`data/chat/` 31 个）；相册正在重做（见 §3.5）。

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

### 3.5 已落地 · 相册分组改造（2026-10-31，`23916f7`）

- `views/app_photos.js` 已整体重写：`VIEWS.photos` = **三列相簿卡片**；`VIEWS.albumDetail` 顶栏 + 大标题绑定当前相册名，按 `section` 分组渲染三列照片墙；`window.currentMediaList` 只装当前相簿的媒体，供大图查看器用。
- 返回路由：`core/app.js` 的 `PARENT` 增加 `albumDetail: "photos"`，详情页返回不再跳回主屏。
- 相簿数据在 `MOCK_ALBUMS`（`id` / `title` / `cover` / `items`），加相簿=往数组加一项。
- ⚠️ 作者要的最终形态是 **私密相册作为分类网格的最后一张卡片**；当前它还在首页底部独立「我的相簿」区块。要改只动 `VIEWS.photos` 的渲染顺序，**别碰 `VIEWS.privateAlbum` 的密码键盘逻辑**。
- `data/story.js`、`data/chat_history.js`、`角色聊天记录总表.md` 的改动都在作者手上，**不要改内容、不要 `git add` 带上**。

---

## 四、产品决策与历史改动

> 历次改动记录（2026-10-31 最近一轮、微信时间分级、角色体系重构等）已移到 **`HANDOVER-ARCHIVE.md` §A**，只有追溯「为什么这么写」时才读。

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

> **「丞丞」旧名「丞丞小队长」**：2026-10-31 全局改名，代码与数据里已无残留。旧文档/旧记录里看到「丞丞小队长」就是现在的「丞丞」。
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

**视图写法**：每个页面文件都是 `VIEWS.xxx = () => ({ cls, html })`（`cls` 可省），`show(id)` 直接取返回值渲染。新增页面 = 一个 `VIEWS.xxx` 赋值 + `index.html` 加一行 `<script>`，没有别的注册步骤。

### 关键机制

**路由**：`VIEWS` 注册表 → `show(id, anim)` / `push(id)` / `back()`。`PARENT` 映射决定返回目标，`ROOT_VIEWS` 白名单里的页面会隐藏返回键（详见下面「全局返回键」）。相册相关：`privateAlbum → photos`、`albumDetail → photos`（2026-10-31 补的，否则相册详情返回会跳回主屏）。

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

### 剧情锁定设定（改了会穿帮）

| 项 | 值 | 落在哪 |
|---|---|---|
| 捡到手机 / 开场 | **2026 年 11 月 15 日 23:09** | `data/story.js` `CFG.start`、`index.html` 锁屏 `#sbt` |
| 终点 | 11 月 16 日 **00:00** 生日；之后时钟停在零点不再走 | `GAME_END_AT = 660`（见上「游戏时钟」） |
| 天气 | 北京夜间 **0°**，阴转小雪，最高 2° 最低 -3° | 主屏卡片 `views/home_ui.js:220`、天气 App `views/app_extra.js:892` |
| 次日起 | 16 号大降温、下雪 | 聊天 / 朋友圈文案引用要和这个一致 |
| 备忘录 PIN | `0913` | `views/app_extra.js` `pressNotePin` |

> 天气是**硬编码散在几处**：主屏卡片 `home_ui.js` 一份，天气 App 里「当前温度区」和「逐小时」的『现在』又各一份（`app_extra.js:826` 与 `:892`）。改一处必须全改；桌面卡片右侧的超大 `🌨️` 也是写死的。

### 数据格式速查（填内容照这个写）

**聊天消息**（`CHAT_HISTORY[角色]` / `S.chats[角色]`，两者拼起来就是完整聊天）：

```js
['11月15日', 'date']                              // 日期分隔行
['文本', 'me' | 'them', '下午 10:05']              // 普通气泡
['文本', 'me', '下午 10:05', 'rejected']           // 被对方删除 → 红叹号 + 验证提示
['文本', 'me', '下午 10:05', 'blocked']            // 我拉黑 TA 之后发的 → 只有红叹号
['文本', 'me', '下午 10:05', 'rd']                 // 发送中
['文本', 'me', '下午 10:05', '', { name, text }]   // 带引用
['[系统] 我拍了拍他', 'sys', '下午 10:15']          // 拍一拍提示，normalizePatSys 会统一成「我拍了拍"名字"+小尾巴」
['"黑猫"撤回了一条消息', 'sys', '上午 3:08']         // 撤回提示：引号里写谁撤的；自己撤是「你撤回了一条消息」
['[图片] ./data/chat/1.jpg', 'them', '...']
['[表情] ./data/chat/emoji.png', 'them', '...']
['[语音] 5|./data/chat/boli.mp3|今天好累呀', 'them', '...']        // 秒数|音频|转写
['[视频] ./data/chat/1.mp4|./data/chat/c.jpg|0:15', 'them', '...'] // 视频|封面|时长
['[位置] 朝阳公园|北京市朝阳区某某路 1 号', 'them', '...']          // 名称|详细地址
['[红包] 恭喜发财，大吉大利|88.88', 'them', '...']                 // 文案|金额
['[转账] 88.88|拿去买糖', 'them', '...']                           // 金额|备注
```

> 三种卡片都是纯展示，点击只弹 `toastDev` 提示（地图/零钱未接入）。解析在 `views/wx_chat.js` 的 `x.text.startsWith("[位置]"/"[红包]"/"[转账]")` 分支。

**时间线**：`S.timeline = [{ at: 秒, type: 'notify' | 'call' | 'mail', from, text, subject, body }]`
**备忘录**：`S.notes = [标题, 预览, 全文, 日期]`，全文里的换行用 `\n`。标题**以 `🔒` 开头** → 点进去要输 4 位 PIN（默认 `0913`，可被 `CFG.start.memoPin` / `notePin` 覆盖，`views/app_extra.js:1267` `pressNotePin`）；解锁状态只存在 `window._noteUnlocked`，刷新即失效（符合无存档决策）
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
- ⛔ **`views/app_photos.js` 第 4 行有 `alert("相册新代码已加载")` 调试残留**（2026-10-31 加）。它能帮你判断缓存，但上线前必须删掉。
- 本地开发看效果：DevTools → Network → 勾 `Disable cache`（工具保持打开），或 `Ctrl+Shift+R` 硬刷新；不必每次改 `ASSET_V`。

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
- **非常在意 token**，回答要短，给结论不要罗列；他会**按需只发一个文件或一个函数**，别索要其余源码，别全量读
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
4. **删除 `views/app_photos.js` 第 4 行的 `alert("相册新代码已加载")`**（2026-10-31 的调试残留）。
5. **核对聊天素材引用**：`data/chat/` 已补到 31 个（约 11MB），但 `data/chat_history.js` 里仍可能有指向不存在文件的路径，缺的会走 `wxMediaMiss` 占位，控制台会报 404。
6. **决定 `data/素材/` 去留**：26 个原图/原片（约 5MB）是素材库，页面不引用，但 EdgeOne 会跟着源码一起托管。不想让玩家下载到，就加进 `.assetsignore` 或发版前移出目录。
7. **核对分享卡片**：`index.html` 的 `og:image` / `weibo:image` 必须是完整 HTTPS 绝对路径、正方形（600×600 或 1200×630）；改完在分享链接后加 `?v=1` 让微信 / 微博重新抓取。

---

## 十一、旧版交接文档对照

已移到 **`HANDOVER-ARCHIVE.md` §B**。只在翻到旧文档 / 旧结论时读。
