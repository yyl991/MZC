# HANDOVER ·「橙粉色捡起来」捡手机网页

> 更新：2026-11-13；当前试验分支：`feature/midnight-homecoming`。旧文档核对基线为 `c6891ae`；本轮功能接续后续提交，具体以 Git 历史为准。
> 远端 `origin` = `mzc:yyl991/MZC.git`。本轮核对本地提交和源码，未重新核验线上部署。
> **每次完成项目改动，都必须同步更新本文件**，记录实际行为、验证结果与遗留事项；历史细节放 `HANDOVER-ARCHIVE.md`。

## 本轮试验：零点强制传送回家

- 用户要求在 feature 分支试做新结尾，未合并 main。旧 A/B 选择和结局由整点传送接管，不改作者维护的 story/chat_history 正文。
- `core/app.js` 在新局第636秒（零点前24秒）开始暗色遮罩、扫描线、轻微错位；第660秒黑屏，短暂淡入「用户『小纸团』已被强制传送回家」「敢不陪穆祉丞过生日？」和「继续」。遵守减少动态效果设置。
- 继续后回主屏，游戏时间从00:00起按真实速度流逝（60秒=1分钟），可探索手机；时间线、催命、回拨、耐心收尾停止。零点会结束现有来电、暂停媒体，继续后再尝试恢复BGM。
- `SS.homecoming` 保存 transferred/exploring 阶段和 continuedAt；刷新未继续时重现传送幕，刷新已继续时保留自由时间。现有到家存档若无新阶段，到零点会补上新结尾。
- `views/wx_chat.js` 为催命入口/延迟送达/耐心回调加到家门控；`views/app_extra.js` 为追命、回拨、botSay和猪哭图延迟回调加门控；`core/audio.js` 避免传送幕被自动BGM打断。
- 电话名称修复：callNameDisp 统一使用 dn/DISPLAY，最近通话与通话顶栏显示 pig/cat/rabbit/tiger 对应emoji，保留重复来电计数与拨号内部key、纯号码。新增映射与预览重播回归，12个测试文件全部通过。
- 场景渲染集中在 `renderHomecoming()`，样式在style.css尾部。生日照片、吹蜡烛和生日歌暂未加入，后续可在这里扩展。
- ASSET_V与样式URL版本更新为 `20261112-homecoming2`。
- 本地快速预览：`http://127.0.0.1:8765/?endingPreview=1`；仅开发模式有效，从最后8秒开始，跳过普通剧情，独立存档键为 `mzc_homecoming_preview`，不会覆盖正式进度。开发模式屏幕右上角有“体验结尾 · 8秒”；预览中为“重播结尾 · 8秒”。每次打开/刷新预览都清理独立预览档并从8秒前开始，不再需要重置进度。普通模式不显示此按钮；非本地主机可用 ?dev=1&endingPreview=1 测试当前分支。
- 验证：新增 `tests/homecoming.test.js`，验证触发边界、继续后时钟、两阶段读档、重复继续、A/B失效与预览存档隔离；全量回归结果见§五。Browser连接因环境缺少sandboxPolicy失败，未完成截图/真机视觉验收。

## 一、项目与协作约定

私人「捡手机」梦女向剧情网页。玩家「小纸团」在 2026-11-15 23:09 捡到自己的手机，需要在 11-16 零点前回家陪穆祉丞过 19 岁生日。各角色是不同时期、不同身份的同一个人，共享 11 月 16 日生日；情感内核是错过过去、抓住现在。

- 项目目录 `C:\Users\53184\Desktop\233\MZC\newload`，Git 仓库在上一级 MZC。
- 既有线上地址 `https://cgcgdsg.cc.cd`。旧交接记录为 EdgeOne 托管 newload 源码、push 触发部署；本轮没有重查生产跟踪分支和部署状态。
- 全程中文，回答简短，按任务读源文件，不全量读取素材与聊天正文。
- **作者2026-11-13最新授权**：作者手动修改的聊天记录、朋友圈、剧情数据、角色总表等项目内容，完成工作时直接一起保存、commit并push，**不用询问，也不用隔离或排除**。这取代此前“不带入作者改动”的约定；AI仍不擅自改写作者正文。
- 恩恩、黑猫、丞丞、Mu 此前已定稿，不自行改台词、补口癖或扩写；标注「✅ 原文」的对话不能改。
- UI 默认冻结；用户明确要求才改结构/class/style/布局。改前读当前源码，以最新要求与截图为准。
- 涉及跳转、状态、路由先说明机制，按用户授权继续；模块未加载要有防护，不能全站白屏。
- 交付代码时：跨多个视图或同文件改动超过 3 处给整文件；只改函数给函数，只改 onclick 给元素，不要求作者手动对行号打补丁。
- 完成工作后同步handover、检查、提交并主动push当前分支，包含作者手动修改的项目内容；不冒用其他工具/作者署名。

## 二、当前状态与后续提交

功能主体和内容已落地，作者随后持续更新聊天、时间线、素材和 UI。旧版「13 个角色 / 1518 条聊天 / 96 条时间线 / 24 条朋友圈」是历史统计，不作为当前验收数量；当前 S.roles 有 12 个键（含保留角色 tiger）。

| 模块 | 当前行为 |
|---|---|
| 存档 | **已有 localStorage 统一存档，刷新续玩**；本分支也保存结尾/自由探索阶段 |
| 重置 | 锁屏提供确认式重置；先置 `_resetting` 再删档，防自动存档写回 |
| 电话 | 按角色停止追命，支持回拨；回拨对话完成后排除该角色后续时间线通知/来电与随机催命 |
| 时限/铃声 | 来电 5 秒未接挂断，呼出 3 秒未接结束；铃声 `data/app/call.mp3` |
| 电话留言 | 已删除；旧 vm tab 回落 recent |
| 相册 | 「最近项目」三列照片墙，底部「我的相簿」有私密入口；旧分类相簿方案不再作为待办 |
| 开局/聊天 | 黑猫、丞丞各 1 条预置未读；打开聊天滚动位置已调整；恩仔/Mu 入口恢复，目前只有催命、没有回复分支 |
| 错过对话 | `S.missLinesOn = false` 仅关闭追加收尾句，耐心计时和 SS.missed 标记仍运行 |
| 免打扰/桌面 | 锁屏与主屏等状态同步；桌面网格/dock 重叠与图标尺寸已修正 |
| 闲鱼 | 订单加红点；其他社交页面、头像封面和素材也有后续修订 |

重要提交：`7b47999` 铃声/回拨；`0955159` 恩仔/Mu 入口；`ae81289` 闲鱼红点/删除留言；`e82220f` 关闭错过收尾句；`6a23a52`、`01c0985` 桌面/dock。大量提交标题为 `1` / `all`，应看 diff 和当前源码，不能仅凭标题推断行为。

## 三、技术入口

原生 JS，无框架，所有脚本共享全局作用域。index.html 先预取再按序加载 17 个脚本，当前 `ASSET_V = '20261112-homecoming2'`。

| 文件 | 职责 |
|---|---|
| index.html | 入口、脚本顺序、资源版本、锁屏容器、分享元信息、BGM |
| core/app.js | 路由、时钟、锁屏、时间线、通知、免打扰、统一存档、重置、启动 |
| core/audio.js | 音效、铃声、BGM、AudioHub |
| core/icons.js | 集中 SVG 图标；新增 SVG 放这里 |
| core/utils.js | 导航栏、底栏、转义、时间日期工具 |
| core/store.js | 文件存在，但未列入入口 scripts，不是当前存档引擎 |
| data/story.js | roles/wxids/chats/timeline/pace/notes/events/邮件、DATA_SIG |
| data/chat_history.js | 历史聊天正文 |
| views/home_ui.js | 主屏、日历天气卡片、黑胶、dock，另有注入样式 |
| views/app_extra.js | 电话、天气、录音机、日历、备忘录、设置等 |
| views/app_photos.js | 最近项目、私密相册、查看器、微信选图入口 |
| views/wx_chat.js | 聊天、状态、拉黑、引用、拍一拍、朋友圈数据 |
| 其他 views/ | 微信页面、朋友圈、邮件、微博、闲鱼、哔哩哔哩、小红书 |
| style.css | 公共样式，并非样式的唯一来源 |
| tests/ | 12 个 Node vm 测试文件，tests/run.js 汇总 |
| obfuscate.js | 可选构建到 dist，现有部署记录仍为源码托管 |

新增脚本按依赖加入入口；视图为 `VIEWS.xxx = () => ({ cls, html })`。新增全局函数先搜索同名，防后加载覆盖；onclick 使用函数应挂 window 或顶层 function，拼接名字需转义。

## 四、关键机制与约定

### 存档与重置

- app.js 的 `saveGameState()` / `loadGameState()` 使用 `mzc_game_save`。tick 约每 5 秒自动保存，saveChat/saveStory 转调统一引擎。
- 保存 elapsed、chatData、unread、lockNotes、wxBlocked 和部分 SS：stage/lineIdx/fired/fragments/missed/arriveHome/choice/talked/homecoming；**不是所有 window 状态都会恢复**。
- DATA_SIG 根据初始 chatData 与 timeline 生成，指纹变化弃旧档；不是任意配置变更都会改变指纹。
- initApp 先读档再启动时钟，startClock 从存档 elapsed 恢复 base，不能让聊天与时间错位。
- resetGameState 使用页面内确认框；确认先 `_resetting = true`，再删除存档、reload。
- **已发现、未修复**：wx_chat.js 的 resetWxChat 重复定义，后者仅 reload，覆盖前者调用统一重置的实现。需要修时先核对入口，不能把它当可靠删档。

### 时钟、时间线、回复

- 新局23:09起，GAME_END_AT=660，11分钟到00:00进入传送幕；继续前停在零点，继续后按真实时间流逝。凌晨显示「上午 00:xx」，不改成12。
- pacedAt 为 offset + amp * ln(1 + at/soft)，at=0 特判返回0；当前 pace={offset:90,amp:1124,soft:500}，nagFrom=680。beat.t 可指定直接触发秒数。
- buildInterleavedTimeline 按角色交错，调整节奏需结合重排与曲线，不让尾部消息拥挤。
- hasRepliedTo 看本局 stage/lineIdx/talked，不能用历史 me 消息判定。skipIfReplied、needStage 也会门控触发。
- localhost / ?dev=1 开发模式直接进主屏；本分支新结尾在开发模式同样触发，旧choice/ending不再执行。?dev=0可测试正式锁屏开场；endingPreview=1仅开发模式有效。
- 锁屏/私密 PIN=1116，备忘录 PIN=0913。备忘录解锁字段不在统一存档中。
- 天气设定北京夜间0°，阴转小雪，最高2°最低-3°；主屏、天气 App 多处写死，修改须一起核对。
- missLinesOn=false 只关闭错过收尾文案，不取消耐心计时与 missed 标记。

### 电话

- dial 对非号码角色设置 `_playerCalledWho[name]`，只停此人的追命与时间线来电；旧 `_playerCalled` 全员停止逻辑已不适用。
- 普通角色呼出结束后可经 scheduleCallBack 延迟3秒回拨，纯号码不回拨。
- 回拨来电接通并挂断时记 `_playerCalledBack[name]`，排除该角色后续时间线 notify/call 与随机催命；该标记未纳入现有存档。
- incomingCallFrom 拦黑名单、到家状态，并用 `_totalCalls` 限每人最多3次；scheduleCallAgain 另有限制与 CALL_ANGRY 收尾，不能改为无限。
- 回家前时间线来电、追命、回拨有各自门控；本分支零点由传送幕接管，旧零点催命消息与电话不再执行，到家后停止自动催促。
- 来电5秒未接、呼出3秒未接结束；closeCallUI 返回原页面。

### 路由、相册、微信

- show/push/back 配合 PARENT。微信底部 Tab 用 show；ROOT_VIEWS 控制一级页返回键，二级页自动补返回键，避免重复。主页物理返回有二次确认，App 内先返回。
- 朋友圈来源 `_momentDetailFrom` / `_momentsUserFrom` / `_profileFrom` 用后重置。
- 相册 getPhoneDisplayList 优先用符合条件的 photoSections，否则 MOCK_PHOTOS；getPhoneMedia 供微信选图，currentMediaList 供查看器。
- 当前文件已无 MOCK_ALBUMS / VIEWS.albumDetail；PARENT 留有映射不等于视图存在。私密密码键盘及重新锁定仍保留，不擅自修改。
- cat/pig/tiger/rabbit 用英文键+DISPLAY 映射、dn 渲染，不用 emoji 作键；roles/wxids/chats/CHAT_HISTORY 的关联键必须一致。
- 拉黑拦新消息/通知/来电；引用存消息第5项 `{name,text}`。拍一拍单击头像约300ms后进资料、双击拍一拍，聊天信息页可看记录。
- rejected 是被对方删除：叹号+验证提示；blocked 是自己拉黑后发送：只有叹号。运行时拉黑以消息对象锚定，不追溯改变旧消息。
- 中文用系统输入法，金额用内置数字键盘；占位入口继续 toastDev，不自行实现真实功能。
- 朋友圈三点仅控制赞/评论胶囊，灰框常显；正文左对齐，灰框首列52px，仅首评论有气泡图标；玩家写「我」，空状态保留灰虚线圆点。

聊天数据格式：

```js
['11月15日', 'date']
['文本', 'me', '下午 10:05', 'rejected'] // 或 blocked / rd
['文本', 'me', '下午 10:05', '', { name, text }]
['[图片] ./data/chat/1.jpg', 'them', '下午 10:05']
['[语音] 5|路径|转写', 'them', '下午 10:05']
['[视频] 路径|封面|0:15', 'them', '下午 10:05']
['[位置] 名称|地址', 'them', '下午 10:05']
['[红包] 文案|88.88', 'them', '下午 10:05']
['[转账] 88.88|备注', 'them', '下午 10:05']
```

### 黑胶、音频、免打扰

- 黑胶用 requestAnimationFrame 算角度，不换CSS animation；重绘遵守 isVinylBusy；暂停只pause，不清currentTime。切图先核对 home_ui 当前实现。
- AudioHub 接管原生audio/video与BGM，新增媒体沿用管理，避免另写冲突的暂停恢复逻辑。BGM用手势重试启动，修改音量先搜所有赋值点。
- 本地音频duration在手机可能不可读，不用setInterval猜进度。BGM为data/app/bgm.mp3，铃声为data/app/call.mp3，录音机素材在data/recorder/。
- toggleDnd/syncDndUI 同步锁屏、主屏等状态；设置页另有 phoneToggle 入口，修改需检查各入口。

## 五、验证、提交、部署

在newload执行 `node tests/run.js` 或 `npm test`。2026-11-12本分支全量回归12个测试文件全部通过，修改的JS语法检查与git diff --check通过；本地预览HTTP返回200。Browser环境连接失败，未完成浏览器完整交互、真机视觉或生产部署验证。

1. 检查git status和当前分支，读取源文件后修改。
2. 按改动运行必要检查；业务代码改动跑现有回归，UI还需按目标屏幕检查。
3. **同步本handover**；运行时代码发版递增ASSET_V，纯文档改动无需改版本。
4. 检查工作区和staged diff，按具体文件暂存本轮改动及作者手动修改的项目内容，不再隔离聊天记录或朋友圈。
5. 提交并push实际工作分支（本轮feature/midnight-homecoming）；本分支未合并main，上线成功需另查结果。

旧线上缓存记录max-age=1200（20分钟，本轮未重查），保留固定ASSET_V，不换Date.now()；本地可禁用缓存或硬刷新。

可选混淆构建当前状态：

- domainLock: ALLOWED_DOMAINS 已启用，debugProtection:false；旧「待恢复/待关闭」事项已完成。
- 白名单：cgcgdsg.cc.cd、mzc1116.cc.cd、mzc-dpnwtj1zgivj.edgeone.dev、mzc1116-10g3u3eg.maozi.io、localhost、127.0.0.1。新增域名需核对，名单外可能跳about:blank。
- app.js/story.js/chat_history.js/audio.js/utils.js 跳过混淆。dist是可选产物，不据此推断生产已改用dist。
- .assetsignore当前排除node_modules/、.git/、.wrangler/、dist/。素材公开范围按实际目录检查，不沿用旧数量。

## 六、遗留与下次核对

- 本轮试验为零点传送与自由探索；生日照片、吹蜡烛、生日歌待用户后续定稿。不自动恢复旧分类相簿、无存档或电话留言方案。
- resetWxChat重复定义问题见§四，本轮仅记录未修。
- 涉及存档时验证刷新续玩、指纹弃档、确认重置；涉及电话时分别验证追命/回拨/零点及刷新后的状态，现有回归通过不等于这些路径全部验收。
- 素材迁移至data/photo、data/avatar、data/chat、data/app等；检查当前引用，缺素材沿用wxMediaMiss，不照旧data/album路径补写。
- og:image/weibo:image 当前指向 `https://cgcgdsg.cc.cd/data/share-cover.jpg`；上线前核对可达性和平台尺寸，必要时用分享链接版本参数刷新抓取。
- 角色总表与归档保留历史设定和统计，和当前源码冲突时先确认上下文，不能自行回退作者后续修改。
