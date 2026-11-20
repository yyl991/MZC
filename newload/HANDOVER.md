# HANDOVER ·「橙粉色捡起来」捡手机网页

> 更新：2026-11-21；当前分支：`main`。旧文档核对基线为 `c6891ae`；本轮功能接续后续提交，具体以 Git 历史为准。
> 远端 `origin` = `mzc:yyl991/MZC.git`。本轮核对本地提交和源码，未重新核验线上部署。
> **每次完成项目改动，都必须同步更新本文件**，记录实际行为、验证结果与遗留事项；历史细节放 `HANDOVER-ARCHIVE.md`。

## 本轮：日历橙粉渐变 + 玩家自主输入全量收集（2026-11-21，本地）

- 作者需求：①日历日期圈从纯粉改橙粉渐变；②所有能上报的数据全部建表收集，且所有表都要带用户ID（uid）。
- **日历渐变**（`style.css` 5510+）：`.wx-cal-cell.has::before` 空心圈改 `linear-gradient(135deg,#ffa05c,#ff5f96)` + `mask:radial-gradient` 挖空中心留圆环；`.today::before` 实心圈同款渐变；`.today.has::before` 加 `mask:none` 覆盖成实心。无绿色、橙→粉渐变。
- **SQL 新表**：`data/survey/supabase_user_inputs.sql`（幂等，未执行/未 push）——5 张表全部带 `time/uid/ip/region`：
  - `user_wx_chat`(chat,text) 微信聊天；`user_moment_posts`(text,image_count) 朋友圈发帖；`user_sms`(to_who,text)；`user_notes`(title,body)；`user_mails`(to_who,subject,body)。各带 RLS + 匿名 insert policy。`uid` 与 replies/visits/source_survey 同源（getDeviceId），可按 uid 串起同一玩家全部行为。附 nth 现算/分组查询示例。
- **前端接线**（5 文件，防御式 `typeof`+`try/catch`，失败静默不影响发送/保存）：
  - `core/app.js`：新增 `window.collectUserInput(kind, fields)`，kind→表映射，复用 REPLY_SB 与 getDeviceId，IP/region 直接读 `sessionStorage.mzc_player_net` 缓存（不额外发请求），POST `/rest/v1/<表>`。
  - `views/wx_chat.js` sendLine：发消息时 `collectUserInput("wx_chat",{chat:chatId,text:line})`。
  - `views/wx_moments.js` wxPublishMoment：`("moment_post",{text,image_count:imgs.length})`。
  - `views/app_extra.js` sendSms：`("sms",{to_who:data.name,text:t})`；saveNote：`("note",{title,body})`。
  - `views/mail.js` sendMail：`("mail",{to_who,subject,body})`。
  - 恩仔自由回复仍走原 `collectPlayerReply`→replies 表（AO3 脚本依赖，未动）。
- 现有 5 张表（replies/visits/moments/source_survey/ao3_messages）本就都带 uid，本轮未改动结构与数据。
- 验证：5 文件 `node --check` 通过；`npm test` 15/15 全通过（含长期 wx.test.js）；`_日历橙粉效果预览.html` 已同步渐变样式供展示。
- 版本：ASSET_V + style.css?v → `20261121-input-collect`。
- 待办：作者在 Supabase Run 新 SQL 后数据自动进来；本轮本地未 push。

## 本轮：查找聊天记录入口直达日历（2026-11-21，本地未push）

- 作者需求调整：不要分类入口那一步了，点「查找聊天记录」直接进「按日期查找」日历界面。
- 改动（本地，2 文件）：
  - `views/wx_pages.js`：`wx_chat_info` 里「查找聊天记录」cell 的 onclick 从 `openWxSearch('wx_chat_info', chatId)` 改为 `openWxChatDates('wx_chat_info', chatId)`；`VIEWS.wx_search` 删掉那排分类入口（日期/图片视频/文件/链接）HTML；`openWxChatDates(from, scope)` 增加来源参数，`_wxDateBackTo = from || "wx_chat_info"`、`_wxDateScope = scope || _wxSearchScope || chatId`。全局搜索（放大镜）不受影响。
  - `core/app.js`：`back()` 增 `wx_chat_dates` 分支 → 返回到 `_wxDateBackTo`（默认聊天信息页）。点某天进聊天（`_chatBackTo=wx_chat_dates`）再返回日历的路径不变。
- 验证：node --check 两 JS 通过；npm test 全 15 个测试通过。真实浏览器验证见下方（若未记录则以测试为准）。
- 待办：作者确认效果后再决定升 ASSET_V + push。

## 本轮：按日期查找聊天记录（2026-11-21，本地未push）

- 作者需求：在聊天搜索页仿微信做「按日期查找」日历——点搜索框下方分类里的「日期」进入日历，按当前会话有聊天记录的日期高亮，点某天回到该聊天并定位到那天。给了两张参考图：搜索页（搜索 丞哥 的聊天记录）+ 微信日历页（跨月排布、日一二三四五六表头、有记录日期可点、今天绿圈）。
- 作者补充：时间跨度很大时**只显示有聊天记录的那几个月**，不铺满中间空月份。
- 实现（4 文件，本地未 push）：
  - `views/wx_pages.js`：搜索页 `VIEWS.wx_search` 在有 scope（单会话搜索）时于搜索框下加分类行（日期/图片视频/文件/链接，后三项 toastDev 占位）；新增 `calendarGlyph()` SVG；新增 `wxChatDateMap(id)`（扫 chatData 的 date 标记 → Map(key=`y-m-d`→当天首条消息下标)，用 parseChatDate 解析）；`window.openWxChatDates()` 设 `_wxDateScope`/`_wxDateBackTo` 后 push("wx_chat_dates")；`VIEWS.wx_chat_dates` 日历页——只取有记录的月份倒序（最新月在上）、每月完整网格（周日=0 起始）、有记录日期 `.has`（黑字+绿点，onclick `wxGotoChatDate`）、今天 `.today`（绿圈白字）、顶部「X · N 天有聊天记录」；`window.wxGotoChatDate(key)` 设 chatId/`_chatBackTo=wx_chat_dates`/`_wxJumpDate=key` 后 push("chat")。
  - `views/wx_chat.js`：`chatMsgs()` 给每个日期段首条消息的 `.wx-dpill` 加 `id="wx-date-y-m-d"`（Set 去重避免重复 id）；`VIEWS.chat.init` 检测 `_wxJumpDate`，用双 rAF + 320ms setTimeout 把 `#msgs` 滚到对应锚点（`el.offsetTop - box.offsetTop - 8`），随后清标记。
  - `core/app.js`：PARENT 加 `wx_chat_dates: "wx_search"`（back 从日历回搜索）。
  - `style.css` 末尾追加 `.wx-search-cats/.wx-search-cat*` 分类样式 + `.wx-cal-*` 日历样式（绿点/绿圈用 ::after/::before）。
- 返回栈：聊天(`_chatBackTo`)→日历(PARENT)→搜索，实测完整。
- 验证：node --check 三 JS 通过；npm test 全 15 个测试通过；真实 Chrome CDP：搜索页分类 4 项渲染✓；日历页 3 个月（2026年9/10/11，与参考图一致）、3 天有记录、今天绿圈 1 个✓；点 2026-9-15 → 进丞哥聊天、锚点存在、滚动定位到那天✓；返回栈三级完整✓。
- **注意**：本轮全程本地改动未 push、未升 ASSET_V；封面截图因 CDP 连到旧 target 拍到主屏（DOM 校验为准，功能无误）。作者曾反馈"所有 app 打不开"——排查确认本地 8 个 app 实测均能打开，非本轮改动所致（openApp 仅在 view=home 生效，测试脚本在子页连调导致误判）。
- 待办：作者确认效果后再决定升 ASSET_V + push。

## 本轮：SQL 脚本整理（2026-11-21）

- `data/survey/supabase_ao3_messages.sql`：AO3 玩家留言快照表幂等脚本，加 `nth`（该玩家第几条回复，来自 `replies_numbered` 视图）、从视图取 nth + replies 补 ip/region、`delete` 先清空再重灌。
- `data/survey/supabase_moments_comments.sql`：朋友圈评论表——建 `moments`（time/ip/region/uid/post/content，post=「朋友圈主人｜正文前60字」全角｜U+FF5C），按作者要求加 `nth`（与 replies 同款：add column + `moments_numbered` 视图 row_number + `set_moment_nth()` 触发器 security definer + 历史回填）；明细视图 `moments_comment_detail`（含 nth）、汇总视图 `moments_comment_summary`。作者自己在 Supabase Run；客户端上报字段不变、nth 由触发器生成。
- 汇总视图 `moments_comment_summary` 加一栏 `commenter_ids`：`string_agg(distinct uid, '、' order by uid)`，列出该条朋友圈所有回复者设备ID（去重）。因为该视图按朋友圈分组、一条朋友圈可能多人评论，故用聚合列；只改这一个视图定义，表/明细视图/数据不动。
- **修复 42P16**：作者重跑脚本报错 `cannot change name of view column "time" to "nth"`——因旧版 detail 视图第一列是 time、新版加了 nth 在首位，CREATE OR REPLACE VIEW 不允许改已有列顺序/名字。解决：脚本开头加第 0 步 `drop view if exists`（逆依赖顺序 summary→detail→numbered）再重建，drop 视图不影响底层表/数据、幂等。
- 均为本地 SQL 文件，未执行、未 push。

## 本轮：AO3 双引流链接代发（2026-11-21）

- 作者需求：AO3 引流链接有时打不开，放两个（原 `https://cgcgdsg.cc.cd/` + 新 `https://mzc1116.cc.cd/`），说明「两个链接是同一个游戏，哪个打得开用哪个，左边加载快一些」；不用①②编号；两个按钮横排、等宽、居中、UI 不变。
- 本地改：`_ao3_build.js`/`_ao3_moments_build.js` promo 块 + CSS；导出目录 `C:/Users/53184/WorkBuddy/2026-11-17-21-04-27/ao3-export/` 的 chapter.html(11章)/preview.html/preview_moments.html + 3 个 CSS（图片 CDN 链接一个没动）。
- AO3 线上代发：用保活调试浏览器（系统代理，不带 --proxy-server）登录作者账号 gujigujiji，作品《在穆祉丞19岁生日前夜捡到了用户小纸团的手机》id 96077076 共 12 章，每章文末精确替换 1 处 promo（+142/+8 字符校验）；Work Skin id 19503626 补 `.mzc-promo-note` 样式。遇 AO3 "Retry later" 限流，退避重试后 12 章全部发布成功，终检每章 newLink=1/newText=1。
- 未 push（本地导出文件）；AO3 线上已公开发布完成。

## 本轮：朋友圈评论 owner 修复（已 push 41e7e7f）

- `views/wx_moments.js:204`：collectMomentReply 第一参由 `chatId`（主页主人）改为 `post.author || chatId`（真实朋友圈作者），修信息流里不同作者朋友圈评论被记成同一人的 bug。`index.html` ASSET_V→`20261121-moment-owner`。语法 OK、15 测试全通过、push 成功。

## 本轮：微博按游戏时间到点发布 + 到点提醒横幅（2026-11-21，本地未push）

- 作者需求：微博像微信时间线一样按游戏时钟到点解锁——23:16 出「18岁的最后一条动态」视频帖（id7），0:00 出生日海报帖（id8）与生日单曲帖（id9，带 QQ/酷狗/酷我/咪咕四条音乐跳转）；到点弹「特别关注」系统提醒横幅，样式参考作者给的真实微信截图（左微博App图标 + 「特别关注 @TF_ING穆祉丞MUA · 刚刚」+ 内容预览 + 右侧艺人头像）。作者最终定稿（两次调整）：微博不需要 detail 页；0:00 **只弹单曲一条**且要在恩仔发消息**之前**（点继续后立刻弹），海报帖**不弹通知**、点进微博列表才看到。
- 实现（仅 `views/app_weibo.js` + `index.html` ASSET_V）：`ARTIST_NEW_WEIBO` 原始4条不动；新增 `ARTIST_SCHEDULED_WEIBO`（id7 unlockMin=1396，id8/id9 unlockMin=1440，纯本地判定不进存档、DATA_SIG 不变）+ `getArtistWeibo()`（按 gameMin() 过滤 concat），三处渲染引用（首页 map、艺人主页 map、详情 find）统一改调它；渲染时判定，无定时器刷列表。提醒横幅：`WB_NOTIFY_PLAN` + 300ms setInterval（load.test.js 沙盒无 setInterval 由 typeof 守卫跳过）。id7 按 gameMin≥1396 弹（正逢来电时顺延到 callState 清空）；id9 afterContinue=0——点继续进入 exploring 后 300ms 内即弹，抢在恩仔第一条生日消息（0.7s 送达）横幅之前；id8 无横幅。横幅标记只存内存：刷新后首次判定已到点的静默标记不补弹；免打扰时不弹（帖子照常在列表）；错过窗口（>afterContinue+8s）不补弹。横幅支持点按进微博首页流、上滑关闭、5.6秒自动消失；标题 13px 单行（作者反馈两行不好看后改小）。
- 单曲帖折叠：正文+链接合并折叠块 `WB_POST_TEXT`——默认只显示到「酷狗音乐>>🔗网页链接」后跟「… 全文」（作者参考真机截图指定截断点，非按行数估算），点击展开酷我/咪咕与#朝朝穆穆#。链接只显示「🔗网页链接」，onclick `window.open(_blank)` 跳真实地址（与B站/小红书外链同模式），已核对四条 onclick 均带正确 URL。
- 素材：`data/weibo/18.mp4`+`18cover.jpg`（23:16 视频）、`happybirthday.png`（0:00 海报；作者中途放入的版本曾为全透明空白 1047×594，后作者重导出真图已生效）、`yintian.jpg`（单曲封面690×690）。作者同期手改正文装饰符号为 ᖰ🌥️ᖳ（已保留）。
- 验证：`node --check` 通过；`npm test` 基线 14/15（仅历史遗留 wx.test.js）；真实浏览器全程验证：23:16 前列表无新帖、23:16 横幅准点弹出+新帖置顶（截图）、首页/艺人主页双列表正常、原4条完好、0:00 预览中恩仔五条+两条追问全部送达（交错未吃消息）、单曲帖折叠/展开正常、四链接 onclick 均带正确 URL、海报/封面/视频渲染正常；作者本人预览确认 0:00 单曲横幅弹出；微信时间线横幅（MuAMuA/穆祉丞等多条）全程正常弹出。0:00 弹出顺序（微博≤0.3s→恩仔0.7/2.2/3.7/5.2/6.7s）由 300ms 轮询与固定节拍保证；「… 全文」用App橙色#ff8200（参考图是微博蓝灰，作者要改可一句话换色）。
- 作者问过的预览机制（记档）：`?dev=1&tailPreview=1`（重播尾段·10秒）从第650秒起跑，650秒**之前**的时间线消息（含546-573s穆瑞恩/恩恩/丞哥等末段高潮）开局即按 `due<TAIL_PREVIEW_START` 标记 SS.fired 不补播不弹横幅（core/app.js:1324，防轰炸设计）——只有 ~650s恩恩、~657s穆瑞恩最后一两条会在预览里弹；看完整末段要跑正式局。另：正式局里接过某人电话满8秒（SS.callDone）会让其后续时间线通知/来电整段作废；消息密集时横幅互相顶掉、正开在那个人的聊天页时直接进聊天不弹横幅，均为既有设计。
- ASSET_V 本轮最终 `20261121-enzai-gap07`（迭代链 weibo-clock→weibo-collapse→weibo-banner-font→notify-one→enzai-gap07，作者测试需强刷/换端口）。代码+素材已 push（140bf9e），md 随后单独提交推送。
- 2026-11-21追加：按作者要求把 0 点微博横幅与恩仔首条消息的间隔调为约0.7秒——homecomingTimeline after 改为 0.3/1.8/3.3/4.8/6.3（恩仔五条节奏1.5s间隔不变；该组数据不参与存档指纹，老玩家不受影响），微博横幅仍在 exploring 后≤0.3s弹出。作者本人已自行 push 文本类修改（e59b00c，含 timeline 穆瑞恩文本/新增at:116——timeline 参与 DATA_SIG，会弃老档，作者知晓）。push 后按惯例运行 scripts/warmup.cjs（纯 GET 预热公开资源，不执行页面JS、不触发 visits/回复上报，不污染 Supabase 数据）。
- 2026-11-21追加2：免打扰桌宠按作者要求改回右左右左奇偶交替（首次右，奇数右=生气问答/偶数左=委屈傲娇），恢复奇偶判定替换50%随机，计数仍存 localStorage（作者设备可用 window.resetDndPetCount() 归零）；浏览器实测第1/3次=右、第4次=左 ✓；ASSET_V升20261121-dnd-alternate，push 16e7536。
- 2026-11-21追加3：天气App 10天预报按作者要求改真实北京天气——今天(11.15)/周一(11.16)保留剧情设定（阴转小雪/-5），周二(11.17)~周二(11.24)换成对应日期真实数据：17-20号实况（天气后报历史：多云9/1、晴7/-2、晴7/-2、多云转晴8/-2）、21号实况晴6/-3、22-24号预报（中国天气网：多云4/-2、晴8/-3、晴6/-2）；主屏天气卡/逐小时条为"今天"设定不动；游戏日历与真实2026年11月星期完全对应；不影响存档指纹；ASSET_V升20261121-real-weather，push 9759f14。
- 2026-11-21追加4：修复分享封面404——og:image等所有分享标签指向的 data/share-cover.jpg 原本不存在（线上404、卡片无图）；按作者"用wallpaper做1:1版本"要求，从 data/app/wallpaper.jpg（800×1422）居中裁切**新建** 800×800/60KB 的 data/share-cover.jpg（壁纸本体未动、游戏内显示不受影响），并补 og:image:width/height/alt、twitter:title/description/image、meta description；push 349a406；线上已验证200。提醒：微信对链接卡片有抓取缓存，改封面后分享需带参数（如 ?v=2）刷新抓取。

## 本轮：桌面文件夹纳入返回栈（2026-11-20）

- 作者反馈 bug：从桌面文件夹点开 App 后返回直接落桌面，期望「先退回文件夹、再退一次才回桌面」。根因：文件夹面板是 `home_ui.js` 的 wgroup 遮罩，打开时全局 `view` 仍是 `"home"`；面板内 App 原 onclick 是 `openApp();closeWgroup()` 直接丢掉文件夹层，`closeApp()` 回 home 时也没有文件夹信息。
- 实现（`views/home_ui.js` + `core/app.js`）：把文件夹做成真正的返回层级。① 面板内 App 按钮改调 `openWgroupApp(id,el,kind)`，先记 `wgroupBackKind`（来源文件夹 tools/media），再 `openApp` + `closeWgroup`（保持先量 rect 再收面板的动画顺序）；② 暴露 `isWgroupOpen()` / `takeWgroupBackKind()` 给 app.js；③ `closeApp()` 回 home 时若取到 backKind 则 `openWgroup(null,backKind)` 先恢复文件夹面板，再退才回桌面；④ 新增 `closeWgroupPanels()`，小白条 `hbAction`、`goBack`（键盘 Backspace/右键/浏览器返回）、`edgeBack` 左滑、`hbAction` 的 home 分支在面板打开时先收面板（原来 home 状态这些入口不处理面板）。
- 关键：来源标记只在从面板点 App 时写入、`closeApp` 时清空，正常主屏打开的 App 返回不受影响；面板 `style.display` 与 class 恢复均由既有 openWgroup/closeWgroup 管理，不改动画。
- 验证：node --check 双文件通过；npm test 基线 14/15（仅既有 wx.test.js 失败，无关）；真实 Chrome CDP 全链路：点「实用工具」面板开(labels=天气/日历/设置/时钟)、点设置进 App(view=settings)、返回一次回文件夹(panelOpen:true 截图确认)、再返回回桌面(panelOpen:false)；`那个用`文件夹按钮完好。ASSET_V 升 `20261120-folder-back`。已 commit+push。

## 本轮试验：零点强制传送回家

- 2026-11-19按作者要求给恩仔结尾亲亲加次数上限：原来玩家在自由回复阶段每发一条，恩仔0.9秒防抖后回一个😽，可无限循环；现改为回满3个😽后，玩家再发则依次发三句晚安「好困呀」→「早些休息哦，晚安」→「睡告告了」，三句发完后彻底不再回复（消息仍静默收集，只是无回复气泡）。改动点views/wx_chat.js sendLine恩仔分支：计数用SS.homecoming.kissCount、结束标记用SS.homecoming.enzaiDone（均随GAME_SAVE_KEY整对象存读档，刷新不清零），在900ms防抖timer真正触发时才+1（玩家连发只算一次回复）；满3次后置enzaiDone=true，三句晚安错开i*1200ms依次sendEnzaiChat（每句自带0.6秒「对方正在输入中」再送达），此后timer回调开头直接return、不再回任何话（连输入提示也不出现）。存档结构未变，core/app.js无需改。tests/wx.test.js新增「3次😽→三句晚安→之后沉默+无输入提示」断言并spy输入提示计数=6，顺手修正既存过时断言（追问文案已由「怎么不说话」改为「怎么不理我」，测试此前未同步）。15个测试全部通过。ASSET_V升20261119-countdown55。
- 2026-11-16 Instagram改为两页真机复刻（作者参考截图P1主页+P2帖子页）：P1=VIEWS.instagram主页（← muzh1ch3ng+🔔⋮；施工中黑圆头像+蓝色"新"角标；穆祉丞+1帖子/29.1千粉丝/0关注；已关注▾/发消息/＋人；网格/圈人两个tab（网格active下划线））；网格里1个帖子缩略图（第一张图cover裁切+右上白色叠层图标）点击push("instagram_post")。P2=VIEWS.instagram_post（← 帖子；小头像+muzh1ch3ng+☰；图片区18张横向scroll-snap轮播+"1/18"黑pill+18圆点（active蓝#4193ef，onscroll→window.insCarouselScroll同步计数和点））；❤️22.3千/💬20千/🔁5,199/✈️4,282/🔖行+muzh1ch3ng MU18.zip+23小时前。core/app.js PARENT加instagram_post:"instagram"（back()从P2回P1）。ASSET_V升countdown44（强制刷新脚本缓存，countdown43起因浏览器内存缓存旧icons.js导致新图标不生效）。浏览器验证：P1/P2渲染✓、滑动计数5/18→1/18✓、点同步✓、back回P1✓、零错误。图标不用emoji：INS_ICON常量组（铃铛/竖点/三线/红心fill#ff3040/评论圈/转发双箭头/纸飞机/书签，24viewBox描边1.8-2），ASSET_V升countdown45。P1右上铃铛/竖点在dev=1下会被「体验结尾」悬浮球盖住，线上无此球不影响。点赞可切换：insToggleLike()红心↔空心描边（INS_ICON.heart/heartOutline），状态存localStorage mzc_ins_liked（默认已赞），ASSET_V升46。2026-11-16主屏天气右侧四格改序：第一行实用工具/那个用，第二行邮件/ins（home_ui.js DOM顺序，auto-flow自动落位）；.lbl字号调大基础12→13px、小屏(≤540px)11→12px（style.css 812/4405，dock标签仍隐藏，ins面板标签跟随变大）；ASSET_V升47。四格功能回归✓（面板开关/邮件/ins/返回），15测试通过。2026-11-16按作者要求文件夹面板改居中直接打开：openWgroup去掉锚定图标位置的transformOrigin计算（原动画从四格左上角图标弹出，作者不喜欢），keyframes默认从中心缩放；ASSET_V升48。2026-11-16修复面板内App打开动画起点：面板按钮onclick原为 closeWgroup();openApp() ——先关面板导致图标rect量到0,0、App从左上角弹出；改为 openApp();closeWgroup()（面板可见时量到中心202,464），ASSET_V升49。2026-11-16零点传送幕BGM替换（作者提供flac）：data/app/hb.mp3 从33.5秒旧曲换成穆祉丞《阴天也会有烦恼吗》完整版272.6秒——flac 55MB用 python soundfile+lameenc（ffmpeg未装）压成128kbps/48kHz/stereo mp3 4.3MB，直接覆盖hb.mp3（audio.js:50引用路径不变，浏览器验证可加载273s）。原始flac留在data/目录未提交（55MB勿入git），作者可自行删除。ffmpeg.exe就在newload根目录（gyan.dev essentials build，当时不在PATH所以先用了python soundfile+lameenc方案，两者结果一致），以后音频转换/截取直接用 ./ffmpeg.exe。2026-11-16 BGM调整（作者纠正）：新歌从hb.mp3挪到19.mp3（exploring阶段，即点继续后玩的BGM），原hb.mp3从git恢复（33.5s老曲），audio.js三首BGM的src加?v=20261116缓存参数（以后换音频文件改AUDIO_V即可），background_music.test.js断言同步更新，ASSET_V升50。浏览器验证exploring阶段bgm时长273s=新歌✓。2026-11-16新增地图App（VIEWS.maps）和音乐App（VIEWS.music）两个视图，作者要求暂不上主屏（openApp('maps')/openApp('music')调用，后面要用再接入口）。地图：手绘SVG地图（街道/公园/河流）+图钉+地点列表（家/街角/公园，MAP_APP_PLACES数组可编辑，x/y为百分比坐标）+搜索过滤，点地点图钉跟随。音乐：iOS风格播放器（封面/进度条可点/上下首/播放暂停，MUSIC_APP_SONGS数组可编辑，现放bgm.mp3「日常」+hb.mp3「回家」），播放时暂停游戏BGM并记状态，离开音乐页(closeApp包装)自动停歌恢复游戏BGM。注意：常量不能叫MAP_PLACES（story.js:10已有var MAP_PLACES地图数据），撞名会炸load测试；app_extra.js顶层const在load.test.js双加载沙盒也会撞，所以名字带APP_前缀。浏览器验证两页渲染/交互/播放链路/零错误，15测试通过。ASSET_V升52。2026-11-16重要发现：app标签字号的真实来源是home_ui.js注入的 .app .lbl 规则（10px小屏/11px基础），优先级高于style.css的.lbl——之前改style.css无效。已改为12px(≤540px)/13px(基础)，ASSET_V升51，部署为线上构建mwi5qiua并线上验证13px✓（旧构建页面被浏览器缓存时新开标签或加随机参数可看到新版）。已合并main推送上线：b863d85+5e49e2d（主屏四格/文件夹/ins全套/设置9项/微博新帖/BGM/字号全部上线）。注意：cua鼠标拖拽不能滚动原生overflow容器（真机触摸可以）；游戏侧滑返回只从屏幕左缘25px内触发，与轮播滑动不冲突。
- 2026-11-15Instagram正式版（作者提供logo参考+18张图）：①icons.js的instagram图标改为经典Instagram相机glyph（渐变底+白描边圆角方框31x31 rx9+圆镜头r7.4+右上白点r2.4，作者确认样式）；②VIEWS.instagram从placeholderView改为真页面：微博流式页头（44px状态栏 spacer+44px行：◀closeApp+手写体Instagram wordmark+♡/✈装饰）、3列正方形网格18张图（object-fit:cover）按 ins (1..18).jpg 顺序、点图openMediaViewer(全18张数组, 索引)带"x / 18"计数可左右滑；③18张图作者已下载到data/ins/，PIL压到长边1600/质量82：5.1MB→2.6MB，覆盖原文件。浏览器验证：新图标✓、网格渲染✓、viewer定位正确（第5张开ins (5).jpg）✓、关闭✓、零JS错误。15个测试通过。
- 2026-11-15艺人微博新增11-15图文帖（作者提供截图+图）：ARTIST_NEW_WEIBO顶部加id 6「冰原底下藏的不是钥匙\n岩层深处，新的故事正待发生\n\n#朝朝穆穆#」，time「3小时前」（微博相对时间样式，渲染为纯文本）、device空、4图 data/weibo/1115 (1..4).jpg（作者下载原图1.1-5.7MB，已用PIL压到长边1600px/质量82：152/209/365/100KB，覆盖原文件）、likes 440万/comments 9.5万/forwards 100万+/hot 30000+。浏览器验证艺人主页+关注流渲染正常（4图2x2、数据齐全）。注意：IAB tab.reload()会用内存缓存旧JS，换端口（新origin）才彻底刷新；push()不负责APP层显隐，从主屏直接push会"看不到页面"（visibility仍hidden），真实路径从微博内进入无此问题。
- 2026-11-15按作者清单9项修改（作者逐项确认版）：①设置Apple ID名改「小狗团」（头像本就是CFG.myAvatar=me.jpg，全头像链路已统一：设置/B站/微信朋友圈/微博均走CFG.myAvatar，聊天wx_chat.js:595也回退me.jpg）；②屏幕使用时间11小时16分；③电池81%；④关于本机删「捡到这部手机」整块+页脚；⑤型号名称iPhone 17 Pro；⑥放大面板.wgroup-panel加aspect-ratio 1/1改正方形（300×300实测）；⑦专注模式→免打扰模式（settings主页+settings_notifications两处，搜索关键词保留）；⑧无线局域网MZC-JBYZ；⑨主屏新建文件夹「那个用」（照片+录音，openWgroup(this,'media')复用组合组件两步交互，openWgroup加kind参数+wgroupPanelHTML(kind)生成面板内容+renderHome恢复时按wgroupOpenKind重建），照片原格放文件夹、录音原格放Instagram（icons.js已有渐变相机图标、APPS.instagram、VIEWS.instagram占位页均已存在，appBtn("instagram")直接用）。core/app.js closeApp回位动画加.wapp[data-app]兜底（照片/录音进文件夹后能缩回文件夹图标）。浏览器实测：设置5项值✓、关于本机3项✓、那个用面板2图标正方形✓、实用工具面板4图标300×300✓、照片/Instagram打开✓。15个测试通过。注意：浏览器缓存旧JS会让改动"不生效"，换端口或强刷即可。
- 2026-11-15组合组件改两步交互（iOS文件夹式，作者参考图P4）：主屏点组合框不再直接进App——点框先「放大」成居中大玻璃面板（.wgroup-open全屏遮罩 z-1500 黑0.28+blur22，.wgroup-panel 白0.55磨砂+38px圆角，2x2四个标准62px图标带深色标签 天气/日历/设置/时钟），从框图标位置zoom放大（transformOrigin动态计算+keyframes wgroupZoom .32s）；点面板内图标才openApp进App（closeWgroup+openApp），点面板外空白关闭。主屏组合框本体保持单格（62/56px继承.icon）+「实用工具」标签不变。修复：主屏时钟每分钟renderHome重建innerHTML会冲掉打开的面板——模块级wgroupOpenState标记，renderHome末尾恢复.on状态。浏览器验证：点框放大/点图标进设置App/点空白关闭/renderHome后面板保持，全部通过；15个测试通过。分支try/group-widget本地提交、未push。

- 2026-11-15组合组件定稿（作者确认方向：单格、时钟原位、其他不变）：组合组件做成普通 .app 槽位（button.app > div.icon.wgroup-frame + span.lbl「实用工具」），无显式grid定位，自动流式布局正好落在原时钟格（r4c3，照片/邮件/录音位置不变）；.icon 类继承应用图标尺寸（62px，小屏540px以下56px），框内磨砂白0.30+blur14，四小图标2x2自适应（base padding7px/gap3px，小屏6px）。浏览器430px/920px两档截图验证：与原版P2布局完全一致，仅时钟位换成组合框。大玻璃面板版（9f46618）废弃：其跨2列2行+6条显式定位规则把照片/邮件/天气挤乱。15个测试全部通过。分支try/group-widget本地提交、未push（作者要求本地先试）。
- 2026-11-15组合组件改为单格尺寸：.wgroup-frame 89×89（占时钟原格子，1格）内含 天气/日历/设置/时钟 四个~34px小图标2x2（磨砂白0.30+blur14+22px圆角，点击openApp对应App），其他图标位置全部不变；天气/日历大组件恢复原位。CSS清理：删除重复xhs规则与旧wrap/label样式。15个测试全部通过。分支try/group-widget本地提交、未push（作者要求本地先试）。
- 2026-11-15组合组件改为参考图样式（最终）：.wgroup-frame大玻璃面板跨2列4行（grid-column 1/3, grid-row 1/5，aspect-ratio:auto覆盖.widget的方形约束）——白0.16磨砂+blur16+1px浅色内描边+28px圆角；内部2x2放 天气/日历/设置/时钟 四个56px带文字应用图标（点击openApp对应App），面板下半为留白玻璃（与iOS大组件一致）。布局：照片/邮件/录音/微博自动填右侧两列（r1-2），闲鱼/B站第三行，音乐组件r4-5右侧，小红书r5左，r5有一处自然空位。15个测试全部通过。分支try/group-widget本地提交、未push（作者要求本地先试）。

- 2026-11-15按作者要求主屏新增iOS组合组件：原天气+日历两个大组件位置替换为一个磨砂圆角大框（.wgroup，跨4列），内含 天气/日历/设置/时钟 四个小图标（带文字，点击openApp对应App）；时钟原主屏图标移除由组合框承载，微博顺移补位；大天气组件的雪花/温度富内容随小图标化移除（点天气仍进完整天气页）。框样式：白0.28磨砂+高斯模糊+26px圆角，高度贴合内容不占新空间。15个测试全部通过。版本20261115-countdown42。作者本地验证通过后推送。
- 2026-11-15按作者要求朋友圈评论也收集：wxMomentComment回调挂collectMomentReply（owner=chatId即朋友圈主人、post=帖子文本截60字、content=评论），本机mzc_moment_replies（上限300条）+Supabase moments表自动上报；getPlayerNet加sessionStorage缓存优先（每次会话只查一次IP）；查看层?dev=1&replies=1加第二区块「朋友圈评论」。需作者SQL建moments表（同visits结构+post/content列）：create table if not exists moments (id bigint generated by default as identity primary key, created_at timestamptz default now(), time text, uid text, ip text, region text, post text, content text); alter table moments enable row level security; create policy "anyone can insert" on moments for insert to public with check (true); 未建表时上报静默失败、本机保留。15个测试全部通过（新增朋友圈评论收集断言）。版本20261115-countdown41。
- 2026-11-15修复：作者反馈?owner=1仍被记录——实测线上代码已含owner排除（curl验证），真因是作者首次打开时线上还是旧构建（无标记代码），标记没写入设备；且visits表里03:39/03:41两条是排除功能上线前的历史记录。改进：?owner=1标记后显示2.6秒全屏确认「✓ 本设备已标记为作者设备」，作者可确认标记生效；指引重新在两台设备标记+delete from visits清理历史。15个测试全部通过。版本20261115-countdown40。
- 2026-11-15按作者要求：①恩仔生日四条祝福逐条带「正在输入中」提示（deliverHomecomingTimeline showTypingFrom→0.7秒后hideTyping+deliverFrom；wx_chat未加载的会话走原直发路径）；②追问间隔9s→5s（scheduleEnzaiNudge 9000→5000，追问两条仍带0.6秒输入指示）。15个测试全部通过。版本20261115-countdown39。
- 2026-11-15补提交结尾互动实现本体（此前仅提交了测试）：wx_chat.js新增sendEnzaiChat（快速输入指示0.6秒→deliverFrom）与scheduleEnzaiNudge（好不好？后9秒无回复→追问两条，玩家回复即取消）；core/app.js deliverHomecomingTimeline在enzai-birthday-2026-4送达后挂scheduleEnzaiNudge。发现tests/wx.test.js曾被IDE回退一次（丢失rows断言），已重新应用并修正断言错别字（喵→嘛）。15个测试全部通过。
- 2026-11-15按作者要求删除引导回复的追加消息（enzai-birthday-nudge「怎么不说话呀，回我一句」），恩仔生日祝福恢复为四条收尾于「好不好？」。15个测试全部通过。版本20261115-countdown38。
- 2026-11-15IP升级为IP+地区：getPlayerIp改getPlayerNet——搜狐cityjson（script直连，返回IP+省市+运营商cname）→ ipify（仅IP）→ 淘宝JSONP → unknown；缓存sessionStorage（mzc_player_net）。collectPlayerReply与recordVisit均带region字段；查看层显示地区。需作者SQL补列：alter table replies add column if not exists region text; alter table visits add column if not exists region text; alter table visits add column if not exists time text;（未执行时对应上报静默失败，本机保留）。15个测试全部通过。版本20261115-countdown37。
- 2026-11-15作者反馈visits时间“不对”——实测是对本机时间（Table Editor按浏览器时区显示，列宽截断了+08后缀像UTC）；为彻底避免歧义recordVisit增加time字段（玩家设备本地时间字符串，与replies表一致）。需作者SQL补列：alter table visits add column if not exists time text; 另：Windows设备ip=unknown系该设备上ipify/淘宝两个取IP接口均未通（可能代理拦截），不影响其他数据。15个测试全部通过。版本20261115-countdown36。
- 2026-11-15按作者要求引导玩家自由回复：自动拉起输入法不可行（iOS/安卓禁止无交互弹键盘，桌面无此问题但主力是手机）——改为自然引导：homecomingTimeline追加第5条 id=enzai-birthday-nudge（after:7，恩仔「怎么不说话呀，回我一句」），在「好不好？」2.5秒后到达，明确邀请打字回复；无group字段故旧档（已收旧长句group）也会收到这条。数据改动不影响DATA_SIG（只hash chatData+timeline）。台词在story.js homecomingTimeline最后一条，作者可随意改。15个测试全部通过。版本20261115-countdown35。
- 2026-11-15新增访客记录：每次会话（sessionStorage每标签页一次）向Supabase visits表上报 设备ID/公网IP/UA截断140字符；作者设备打开 ?owner=1 一次即写localStorage mzc_owner=1 永久排除（无需报设备ID）。需作者SQL建表：create table if not exists visits (id bigint generated by default as identity primary key, created_at timestamptz default now(), uid text, ip text, ua text); alter table visits enable row level security; create policy "anyone can insert" on visits for insert to public with check (true);。查看：Table Editor → visits（uid关联replies.uid可看谁留言了）。帽子云屏蔽IP能力未知（控制台找规则/IP黑名单，或问客服）；客户端屏蔽不可靠。recordVisit在initApp无条件调用（在线玩家新会话开始记录）。15个测试全部通过。版本20261115-countdown34。
- 2026-11-15按作者要求回复同时记录IP与设备ID：新增getDeviceId（localStorage键mzc_device_id，首访生成D前缀ID标识同一浏览器）与getPlayerIp（ipify CORS接口→淘宝getip.php JSONP兜底→unknown，结果缓存sessionStorage每会话只查一次）；collectPlayerReply记录{time,ip,uid,text}，本机先存后回填IP（上限300条），远程POST带ip/uid字段。查看层?dev=1&replies=1显示IP与设备ID。**需作者在Supabase SQL Editor执行**：alter table replies add column if not exists ip text; alter table replies add column if not exists uid text;（未执行时远程上报静默失败，本机保留）。15个测试全部通过。版本20261115-countdown33。
- 2026-11-15作者手改：照片App内「我的相簿」标题改为「私密相册」（app_photos.js 一处文案），随本次提交；ASSET_V同步20261115-countdown32。15个测试全部通过。
- 2026-11-15按作者要求尾段预览改为真实重播最后10秒：TAIL_PREVIEW_START 640→650（移除321跳转层mountTailCountdown），打开tailPreview即LED倒计时00:00:10→00:00:00完整走一遍（期间恩恩650s/穆瑞恩657s两条消息+一次故障照常），660秒进传送幕→继续→恩仔生日→自由回复收集（Supabase上报照旧）。按钮文案「重播尾段 · 10秒」。15个测试全部通过。版本20261115-countdown31。
- 2026-11-15实测定位并修复RLS拦截：publishable key必须同时带apikey+Authorization两个头（缺Authorization即42501），to anon/public策略都没问题；两头发送实测201插入成功（测试行diag-A入库，作者可在Table Editor删除）。前端上报已改双头并推送。远程收集正式上线：玩家回复实时进Supabase replies表，作者Table Editor查看。15个测试全部通过。版本20261115-countdown30。
- 2026-11-15作者已建Supabase项目（ref=oprecriimhoisvvwazte，项目URL已从控制台地址取得），SQL建表脚本就绪待Run。代码同步落地：REPLY_SB={url:"https://oprecriimhoisvvwazte.supabase.co",key:""}——key已填入（作者给的sb_publishable_格式，走apikey头），2026-11-15实测GET返回PGRST205——PlayerReply的replies表尚未创建，等作者在SQL Editor点Run后即全线打通。待作者点Run建表并提供anon key（或publishable key）后填入REPLY_SB即上线。15个测试全部通过。版本20261114-countdown27。
- 2026-11-14按作者确认部署为帽子云（GitHub自动部署，纯静态）撤销边缘函数方案：删除functions/（含ADMIN_KEY的replies.js在线上被静态暴露已回收）、移除同域api/replies上报；collectPlayerReply改为通用上报位REPLY_UPLOAD_URL（core/app.js，当前留空为纯本机模式）——作者在帽子云建Web应用（Node.js最低配）后填入接口地址即自动POST上报。后端零依赖Node脚本已交付作者（聊天记录内，未入库：接收/存储replies.json/带口令查看页/CORS全开）。在线玩家中途不受影响。15个测试全部通过。版本20261114-countdown26。
- 2026-11-15按作者确认部署为帽子云（GitHub自动部署，纯静态）撤销边缘函数方案：删除functions/（含ADMIN_KEY的replies.js在线上被静态暴露已回收）、移除同域api/replies上报；collectPlayerReply改为可插拔上报——本机localStorage始终保留，REPLY_SB配置（url/key，当前留空为纯本机模式）填好后自动POST Supabase REST（/rest/v1/replies）。LeanCloud国内版停止新注册已弃用，改Supabase：作者注册supabase.com→建项目→SQL Editor执行建表（replies表+匿名插入策略）→给Project URL和anon key两值即上线；免费项目闲置7天会暂停（控制台恢复即可）。在线玩家中途不受影响（内存页面继续跑、localStorage键不变、新构建行为一致）。15个测试全部通过。版本20261114-countdown24。
- 2026-11-14按作者反馈：自由回复改用系统输入法——恩仔生日阶段（chatId=恩仔且exploring）聊天输入行渲染真input#fld-real（手机自带输入法可打中文，Enter发送、isComposing防误触），不渲染假键盘#kbd，表情/加号按钮不渲染（它们依赖假键盘系统）；其他聊天与0点前恩仔保持原假键盘流程不变。sendLine自由回复后清空真输入框。回归：wx.test.js加渲染断言（fld-real/无kbd/占位提示）+发送收集断言。15个测试全部通过。版本20261114-countdown23。
- 2026-11-14按作者要求尾段预览改321跳转：不再播20秒消息/故障/倒计时，tailPreview打开即全屏DSEG7红色「3→2→1」（mountTailCountdown，每秒一跳、3.1秒后beginHomecoming直进传送幕），底层仍从640秒起保证时间线状态一致；按钮文案「重播尾段 · 321」。之后照常：继续→恩仔生日四条→自由回复收集（远程POST照旧）。15个测试全部通过。版本20261114-countdown22。
- 2026-11-14新增恩仔自由回复远程收集：EdgeOne Pages 边缘函数 functions/api/replies.js——POST /api/replies 上报（游戏端 collectPlayerReply 在存完本机 localStorage 后自动 fetch POST，失败静默），GET /api/replies?key=<口令>&format=html 手机友好表格页 / 不带 format 返回 JSON；读取口令 0adac617350db75003c4f80b8ad733cb（写在函数文件 ADMIN_KEY 常量，可改后重部署）。**需要作者一次性控制台操作**：EdgeOne 控制台 → 本 Pages 项目 → KV 存储 → 创建命名空间（名随意）→ 绑定到边缘函数、变量名必须 REPLIES_KV → 重新部署生效；未绑定时 POST 返回 503 提示、游戏端静默回退本机存储。KV 上限 1000 条。总表同步。版本20261114-countdown21。
- 2026-11-14按作者要求收窄：恩仔聊天0点前发送被完全忽略（不出气泡不收集、输入保留），仅传送幕继续后（homecoming.exploring）开放自由回复并收集——闸门移到sendLine最前部。回归补0点前忽略断言。15个测试全部通过。版本20261114-countdown20。
- 2026-11-14按作者要求新增传送幕后恩仔自由回复：sendLine对chatId=恩仔且homecoming.exploring时绕过回复剧本（恩仔replies为空数组，原来发消息会在c.replies[0].mine报错），气泡正常发出、rd标志900ms后清除，内容经collectPlayerReply静默存本机localStorage键mzc_player_replies（带真实时间戳，上限300条）；core/app.js新增getPlayerReplies()与?dev=1&replies=1查看层（列出/清空本机收集）。跨玩家远程汇总需表单或后端接口，暂未接。回归：wx.test.js新增恩仔自由发消息断言（不进剧本/rd清除/收集调用），homecoming.test.js新增收集与查看层断言（修掉insertion里text→line变量名错误，测试先抓到）。15个测试全部通过。版本20261114-countdown19。
- 2026-11-14按作者反馈修复：微博万级展示位点赞从静默return改为弹toastDev趣味文案（数字仍不变）；小红书穆祉丞展示位同步加趣味文案保持一致。15个测试全部通过。版本20261114-countdown18。
- 2026-11-14按作者截图新增微博首页第一条：ARTIST_NEW_WEIBO头部插入id=5（STILL BECOMING 19岁生日短片视频帖）——time「11-14 20:07」、device「来自 微博视频号」、text四行含#朝朝穆穆#、video=1114.mp4/cover=1114.jpg（作者已放data/weibo）、278万/20.5万/100万+、hot 30000+；格式与1113视频帖一致，首页/详情/点赞(万级展示位不变)自动生效，其他一切未动。素材未压缩（1114.mp4约2.5MB）。15个测试全部通过。版本20261114-countdown17。
- 2026-11-14按作者要求：主页右下角浮动工具组删掉「锁屏」按钮，只留「重置进度」（home_ui.js floating-tools）；lockPhone函数保留未删（无其他调用入口）。趣味文案功能确认在用：toastDev（core/app.js，14条随机文案）+ window.alert重写 + 全局click监听拦截无功能按钮（button/.row/.wx-item/.cal-d/cursor:pointer等，排除音乐滚动条/键盘/PIN/私密相册），另有「再滑一次退出网页」「进度已清空」主动调用。15个测试全部通过。版本20261114-countdown16。
- 2026-11-14按作者要求：免打扰开关提示toast下移（top 80→240px）——原来正好压住锁屏日期(84px)与大时钟(138-218px)，240px在时钟下方不遮挡；toast只有toggleDnd一处（锁屏按钮/主屏dock/控制中心），设置页开关不弹toast。15个测试全部通过。版本20261114-countdown15。
- 2026-11-14按作者要求微博同款点赞逻辑：toggleWbLike开头拦截含「万」的initialLikes（118万生活流/189万202万置顶/254万431万艺人/93.2万超话自评——全是穆祉丞展示位）直接return数字不变；0赞家人转帖与超话恩恩12赞帖保留原+1/-1互动。15个测试全部通过。版本20261114-countdown14。
- 2026-11-14按作者要求细分小红书点赞：穆祉丞那条（author=穆祉丞，7.1万空心赞）为展示位，点赞完全无效果（红心保持空心、7.1万不变，tap直接return）；其他笔记恢复原±1/±0.1万数字变化与红心切换。15个测试全部通过。版本20261114-countdown13。
- 2026-11-14按作者要求：小红书点赞前后数量不变——toggleLikeXhs删掉±1/±0.1万与note.likes改写，只保留红心状态切换、弹跳动画和震动；数字始终显示笔记原始likes（1306/4.1万等）。15个测试全部通过。版本20261114-countdown12。
- 2026-11-14三件事：①通话字幕3秒→2秒一句（tick字幕推句与自动挂断S.length*2+2同步改，播完即超8秒仍算callDone）；②missLines功能整体删除（story.js的missLinesOn/missLines数据、wx_chat.js armPatience里的收尾句追加逻辑，耐心计时与SS.missed标记保留），全库零引用；③新增《通话字幕与收尾台词.md》单独对应表（生成器node_modules/.cache/gen-calls.cjs不入库）：来电时机+每角色逐句字幕时刻表+自动挂断秒数+收尾台词+恩仔/Mu/tiger通用字幕说明；《自动对话触发总表.md》同步2秒节奏并删missLines行。15个测试全部通过，纯数据/文档部分不影响指纹。版本20261114-countdown11。
- 2026-11-14按作者要求补齐电话闸门：scheduleCallBack新增「微信回复分支已走完」检查（stage≥replies数，读存档字段不需新存档键）——回复完再呼出对方、3秒未接也不再回拨；此前只有callDone/回拨过/拉黑三道闸。注意范围：仅关「呼出未接→回拨」；对方时间线来电被拒接/漏接后仍会追打最多3次（callDone/_playerCalledWho可拦）。15个测试全部通过（新增回复完呼出不回拨回归）。总表同步该规则。版本20261114-countdown10。
- 2026-11-14新增《自动对话触发总表.md》（应作者要求整理全部微信+电话对话触发机制）：全局闸门、61条时间线消息按四阶段列表（含秒数/⚠️作废标记/📞来电）、11角色回复分支剧本（sendLine的stage/lineIdx机制：每发一条自动把建议词打进输入框，凑满阶段条数后对方逐条回）、电话全流程（时间线来电pig=50s/穆祉丞=87s/恩恩=250s、5秒未接/拒接追打CALL_NAG、满8秒callDone+CALL_END_LINES收尾、pig猪哭1+6图、呼出3秒回拨）、恩仔生日时间线、拍一拍、永不触发项（pressureTick nagFrom=680、missLines关闭、碎片注释）、加新消息at≤327注意。生成器暂存node_modules/.cache/gen-dialogues.cjs不入库；纯文档无运行时改动、无版本号变更。
- 2026-11-14按作者要求最终调节奏：S.pace恢复{90,1130,500}（取消前两轮压缩，轮询bug已修不再需要压），61条消息97s起持续发到657.2s——末条穆瑞恩生日请求在倒计时显示00:00:03时到达，作者要求的「一直发到倒计时3秒」；at上限约330（at≥330的beats会过了660不发），后续加消息注意。尾段预览TAIL_PREVIEW_START 545→640：只测最后20秒，按钮「重播尾段 · 20秒」，预览内会看到649恩恩、657穆瑞恩两条+两个故障+倒计时。15个测试全部通过（尾段预览断言同步640/20秒/658送达）。版本20261114-countdown9。作者同期story.js台词微调随本次一并提交。
- 2026-11-14修复真凶：buildInterleavedTimeline按角色轮询改写每条消息的at，条数少的角色（穆瑞恩4条运行时全部落在96-346s、丞哥499s前发完）被挤到前段，结尾槽位被恩恩/cat等9条角色占走——作者手排的303-326情绪阶梯从未生效，玩家看到末条永远是cat「你回来我不骂你」。改为按at稳定排序、保留原at触发（不再轮询改写），运行时与手排数据完全一致：546MuAMuA→549cat→553rabbit→558丞哥→565恩恩→573穆瑞恩收尾；开场穆祉丞18-27s四连手排轰炸保留。旧断言「没有连续同一人」过时已换成「不改写消息时间+结尾穆瑞恩生日请求收尾」回归。DATA_SIG在story.js载入时计算、不含改写→不弃档；旧存档SS.fired键序变化可能中途重放个别消息，正式上线前无影响。15个测试全部通过，尾段预览截图确认丞哥/穆瑞恩横幅正常弹出。版本20261114-countdown8。
- 2026-11-14新增开发专用尾段预览`?dev=1&tailPreview=1`：从第545秒开局（TAIL_PREVIEW_START），约2分钟看完结尾消息高潮(546-573s)→故障花屏→LED倒计时→跳传送幕；独立存档键mzc_tail_preview，每次打开清档重播；开始前的历史消息在initApp按storyTick同款key(i@at)标记SS.fired，不补播不轰炸；正式进度与endingPreview互不影响（TAIL_PREVIEW在ENDING_PREVIEW为假时才生效）。右上角按钮文案「重播尾段 · 2分钟」。注意：endingPreview的21秒预览里storyTick整体关闭、不出时间线消息，验证消息必须用正式局或尾段预览。倒计时10秒(650-660)内当前为0条消息——按作者压缩节奏的设计，全部提前到≤573s。15个测试文件全部通过（新增尾段预览存档/开局秒数/按钮文案/历史不补播/结尾消息照发断言）；无头截图核对消息横幅到达与传送幕接管。版本20261114-countdown7。
- 2026-11-14按作者要求二次压缩节奏：S.pace {82,1031,500}→{78,987,500}，61条消息全部在573s内发完（末条=573s穆瑞恩生日请求，正好落在作者实测能收到的at=306窗口内），距660跳转87秒缓冲；曲线形状/密度/正文/at值零改动，DATA_SIG不含pace不弃档。跳转时机不变：开局第660秒（11分钟）进传送幕，倒计时650-660。作者注明若压缩后最后一条仍是cat306那条，则元凶是作废规则（rabbit/丞哥/穆瑞恩需通话满8秒才作废其消息，恩恩回复即作废），已按作者选择保持原设计。15个测试全部通过，版本20261114-countdown6。
- 2026-11-14按作者反馈"最后没看到穆瑞恩的消息、整体时间往前提"诊断+调整：核算确认61条时间线消息全部≤654s发出、跳转本身零截断，真因是玩家最后约30秒切后台/锁屏跨过660，回来直接进传送幕，631s后的4条（rabbit/丞哥/恩恩/穆瑞恩）被吞；「通话满8秒/回复过作废」规则按作者选择保持原设计。修改S.pace从{90,1124,500}整体压缩约8%到{82,1031,500}：61条全部≤600s发完，末条=600s穆瑞恩生日请求，留60秒缓冲，跨零点切后台需持续60秒才会再吞消息；曲线形状不变、每分钟密度5-11条不变、消息正文与at值零改动。DATA_SIG只含chatData+timeline正文，pace不参与→老存档不弃档。15个测试文件全部通过。版本20261114-countdown5。作者同期story.js 3处台词微调按惯例一并提交。

- 2026-11-14按作者"不给资源下载压力"要求优化字体加载：删掉index.html的preload链接，改为app.js顶层`addEventListener("load")`+4秒空闲后`fetch(...,{cache:"force-cache"})`后台预热5KB字体（typeof守卫防vm测试环境报错），首屏刷新零新增请求、倒计时出现前字体早已就绪；最坏情况倒计时首秒短暂回退等宽字体再换LED，无功能影响。style.css本轮未改（链接保持countdown3），版本20261114-countdown4。15个测试文件全部通过；截图确认LED渲染无变化。提交467262f已含作者暂存的data/chat_history.js修订并推送成功。

- 2026-11-14按作者参考图（LED数码信息历）把倒计时改成机械风：新增`data/fonts/DSEG7Classic-Bold.woff2`（DSEG7 Classic Bold，5.1KB，OFL 1.1协议见同目录DSEG-LICENSE.txt）+ style.css @font-face + index.html preload；倒计时框改16px圆角黑底(#050203)红边(rgba(255,64,72,.4))，数字用DSEG7 Classic 700/46px红色#ff2a23带LED辉光，::before垫「88:88:88」极暗红色做熄灭段余辉；实测框297.6×82px居中（左右各47.7px），JS逻辑零改动（余辉是纯CSS）。版本20261114-countdown3。15个测试文件全部通过，无头截图核对了LED段码字形、余辉和居中。push已恢复：TUN关闭后SSH认证正常，此前积压3提交经HTTPS推完（远端main=0281f95），本轮随新提交再推。

- 2026-11-14按作者要求二次调整倒计时：位置上移（容器高度46%→32%，黑框中心约在屏高17.8%），样式改为黑底带框（纯黑底、rgba(255,64,72,.5)描边、3px圆角、红色发光数字，实测框328×89px居中不溢出），去掉原上半屏红晕压暗层和cd-zero样式；逻辑改为永远不显示00:00:00（remain钳制最小1，最后一个数字是00:00:01），零点elapsed>=660直接beginHomecoming，HOMECOMING_ZERO_HOLD删除。预览恢复20秒、按钮文案回到「体验结尾／重播结尾 · 20秒」。版本20261114-countdown2（style链接同步）。15个测试文件全部通过（新增末位00:00:01、零点建幕、无00:00:00断言）；无头截图核对黑框位置样式与传送幕接管。push仍被SSH拒绝，本地累计3个待推提交。

- 2026-11-14按作者对比截图把传送幕顶部改成p1样式：时间行「11 / 15」左「23:59:59」右恢复p1灰粉配色（#81777e/#d3b5bd、13/14px、字距4px、行距8px），下一行保留「传送完成」+渐变同一行结构但换成p1配色（#a77d8a、12px、字距3px、渐变#533540→transparent、行距12px）。仅改renderHomecoming顶部两块HTML内联样式；标题、照片、警告语、按钮、倒计时等功能一律未动，本轮未改style.css。版本20261114-ending1（style链接版本不变）。测试无传送幕文案断言，15个测试文件全部通过，无头截图核对新顶部样式。上轮push因SSH被拒未完成，本轮随此改动一并重试push。

- 2026-11-14零点前新增10秒死亡倒计时：最后10个现实秒（elapsed 650起）在屏幕上半部分（顶部46%高）显示纯数字「00:00:10」→「00:00:00」，无文字，红色等宽数字+红晕压暗层；pointer-events:none不拦截操作，层序在故障层(999990)之上、传送幕(1000000)之下。到00:00:00红晕加强并停留1秒，elapsed≥661（即00:00:01）才beginHomecoming进传送幕；_dateFlipped等零点逻辑仍按660不变。倒计时按elapsed实时重算，刷新自然恢复，无新存档字段；beginHomecoming和到家分支的updateHomecoming都会清理倒计时层。减少动态效果时数字保留，只去掉逐秒闪动（WAAPI脉冲受matchMedia控制）。
- 曾给倒计时层加0.5秒入场动画，无头验证发现CSS动画在virtual-time截图下停在起始帧、整层opacity 0，已删掉入场动画保证任何环境始终可见；逐秒闪动保留。预览演示相应变为21秒（640→661），右上角按钮文案改为「体验结尾 · 21秒／重播结尾 · 21秒」。版本20261114-countdown1。
- 验证：15个测试文件全部通过；homecoming测试新增倒计时出现、数字递减、00:00:00停留、传送幕接管清理、减少动态仍显示等断言。无头Edge按`?dev=1&endingPreview=1`截图核对：倒计时盖在日历等卡片上方，红色发光数字与压暗层正确，00:00:00红晕加强，约23.5秒处传送幕正常接管。真机手感以作者预览为准。
- 2026-11-13按作者要求删除未加载的备用相册views/app_photos_new.js；入口仍加载app_photos.js，原私密相册、密码和照片视频列表保留。作者同期聊天素材替换与聊天记录一并保存。

- 2026-11-13按用户附件实现通话完成：任意来电（含回拨）接听且实际通话>=8秒，挂断时标SS.callDone[角色]并立即存档；约1.4秒后按CALL_END_LINES/CFG.callEndLines发一次收尾话，到家/重置时不再追加“回来”催促。未接、<8秒、仅主动呼出均不标完成；主动呼出仍3秒不接结束。去掉旧“回拨接通挂断就算完成”的无时长标记逻辑。
- 完成角色在incomingCallFrom/scheduleCallAgain/scheduleCallBack/pressureTick/storyTick notify-call均拦截，已排队的incomingMsgFrom、追命文本和猪哭图、耐心计时也检查完成状态；不在deliverFrom统一拦截，确保收尾及零点homecomingTimeline生日话仍可送达。SS.callDone随统一存档读写，旧档缺字段默认空对象，重置后新局为空。原missed防护保留；无UI改动，版本20261113-calldone1。
- 新增回归覆盖8秒边界、短回拨不完成、主动呼出3秒/回拨完成、收尾延迟、完成后各电话入口停止、时间线及随机催命排除、刷新完成标记、生日消息不被误拦。提交前运行全量15个测试文件，不预热。

- 2026-11-13按审计建议只修4项逻辑：app.js补SS.missed初始化/保存空集合兜底；去掉resetWxChat重复覆盖，保留统一确认重置与缺模块刷新兜底；rootOf递归走父路由并防自引用/循环，正确定位微博/闲鱼/微信等根图标；show和backgroundPreload改用可见的词法const数据，相册读取实际getPhoneDisplayList，私密相册仅预加载当前已渲染媒体、不提前加载密码后照片。未修改UI、剧情正文、相册方案、日历范围、占位App或设置规则。
- 验证：15个测试文件通过，覆盖新局/缺省missed保存、读档恢复、重置入口委托、各深层根路由及循环终止、const预加载与可选模块缺失。资源版本20261113-fixes1，提交后push当前分支，不预热。

- 朋友圈按钮修复验证：用本机Edge无头渲染393px宽详情页，评论按钮约76.6px宽、文字18px高，white-space=nowrap；14个测试文件全部通过。传送界面静态预览位于node_modules/.cache/homecoming-preview/homecoming.png（不入库）。

- 本轮沿用作者已提交的最新音乐设定：传送幕hb.mp3，继续后19.mp3；只同步背景音乐回归预期，不改写作者选择。界面相关14个测试文件提交前重新运行。

- 2026-11-13修复朋友圈详情/列表三点菜单“评论”竖排：添加局部wx-moment-actions定位，胶囊浮在三点左侧、宽度按内容、不挤压时间行；按钮文字禁止换行且禁止收缩，SVG及分隔线不收缩。点赞/评论回调、灰色互动区等功能不改，保留作者同期编辑，版本20261113-moments1。不预热。

- 2026-11-13超话新增穆祉丞纯文本「过两天再来，再再见」，使用现有miantuan艺人头像，刚刚最后评论、3.3万转发/10.5万评论/93.2万赞；保留恩恩恩原帖。新增帖头像和昵称所在区域通过既有push('weibo_artist')进入艺人主页，普通用户不增加跳转；其他交互布局沿用。版本20261113-weibo3，继续不预热。
- 作者授权的修改边界为C:/Users/53184/Desktop/233/MZC（含newload和上一级仓库.git），不修改MZC外的用户内容；环境权限设置由客户端控制。

- 2026-11-13微博超话原帖子改为纯文本「#穆祉丞超话# 感到幸福就扣11111🧡💖」，去掉截图的加速卡句，昵称「恩恩恩」，头像data/avatar/me.jpg，移除原三图；保留原布局/按钮/超话返回等交互。版本20261113-weibo2，本轮继续暂停预热。

- 本轮收尾：三张BEC019原图从共8,611,290字节压至3,158,206字节，节省5,453,084字节（约5.2MiB），长边对应宽度2048像素、JPEG高质量保留4:4:4采样；1113视频已是约1.6MiB/480p/454kbps，不二次压缩。作者手动更新19.mp3一并保存。14个测试文件通过；专项核对仅两条动态数据与首页视频poster来源变化，其他UI/交互代码不变。暂停预热。

- 2026-11-13仅更新ARTIST_NEW_WEIBO两条最新微博内容，沿用原id=3/4和全部UI/交互：蛋糕视频使用1113.mp4/1113cover.jpg，5小时前，254万赞/8.7万评论/100万+转发；BEC · 019三图按截图顺序，昨天19:00，431万赞/评论转发100万+。三张特殊Unicode文件名改为bec019-1/2/3.jpg并同步引用。标题特殊字母可正常UTF-8显示，无需改写正文。版本20261113-weibo1。
- 作者最新要求：暂停push后预热，后续只提交和push，等作者明确恢复再运行warmup。已有scripts/warmup.cjs保留但本轮不运行。

- 2026-11-13小红书首页穆祉丞笔记改为截图文案「放一些照片在这里」、7.1万赞与空心赞，使用data/xhs/xhs.mp4及其首帧xhs-cover.jpg，卡片跳转作者提供的6af1ce760000000034003f55完整链接。视频预览不自动播放，避免打断背景音乐；保留现有关注关系。版本20261113-xhs1。
- 作者要求每次push成功后warm线上资源；warmup.js实际为混淆构建副本，不用于预热。使用scripts/warmup.cjs检查线上版本并GET入口、脚本、样式与本次小红书素材；若线上版本与本地不同，明确记录部署尚未同步，不声称新版本已生效。

- 音乐切换验证：新增background_music.test.js覆盖传送幕选19、继续不重头、读档选19、语音打断后恢复同首、自动播放被拦截后的手势重试；全量14个测试文件通过，JS语法/差异检查通过。音视频未二次有损压缩，节省体积为0；优先保留音画质量。

- 2026-11-13传送后背景音乐改为data/app/19.mp3，复用#bgm播放器，传送时尝试播放，浏览器拦截自动播放时由“继续”手势重试；继续、桌面重绘、读档均保持19，循环播放，不退回旧bgm。语音/视频沿用AudioHub暂停恢复。资源版本homecoming19。
- 素材压缩核对：19.mp3为30.05秒192kbps立体声、723100字节，旧bgm为192kbps约1.6MB，视频最大约1MB；现有素材均较小，按作者“避免损失音画质”要求未二次有损压缩。未运行现有compress.js（含800px缩图/CRF28重编码）。新下载data/xhs/xhs.mp4一并保存。

- 铃声修复验证：新增tests/ringtone.test.js覆盖重叠来电、旧关闭动画/漏接回调、stop后延迟play、接听停铃、旧interval不重启；全量13个测试文件通过。上一轮黑胶修复也纳入本次提交。浏览器/真机上的偶发音频问题仍需用户实际复验。

- 2026-11-13修复call.mp3偶发循环残留：incomingCallFrom禁止与现有通话重叠，各通话使用session标记隔离旧漏接定时器/关闭动画；正在关闭的界面不复用。startRing先清理旧铃声周期，stopRing关闭播放许可；延迟play完成再次检查许可和来电状态，挂断/关闭均强制停铃。保留前一轮黑胶红点局部更新修复及新增19.mp3素材，一并保存。版本homecoming18。

- 2026-11-13修复零点后生日分句导致桌面黑胶反复重建闪动：聊天/邮件通知在主屏只调用updateHomeBadges更新红点，不再renderHome重建黑胶与封面。到家后的updateHomecoming每次检查都清理故障层及其定时器，防止残留。版本homecoming17。新文件data/app/19.mp3按作者统一保存约定随本轮提交，不自行接入播放。

- 2026-11-13恩仔传送后生日话拆成4个独立气泡：「谢谢你今年陪我过生日呀。」「以后也陪着我」「一直到120岁」「好不好？」按0/1.5/3/4.5秒依次到达（tick按秒处理），各条独立存档，刷新仅补未发送分句；旧档已收到完整长句则不重发。仍独立于回复、通话和催命状态，资源版本homecoming16。

- 本轮新效果验证：12个测试文件全部通过，JS语法和差异检查通过，本地20秒预览服务HTTP 200。

- 2026-11-13新故障效果：开发前存档已提交并push为`9340ed9`。正式模式从游戏23:55起（约第595.3现实秒）到零点安排六次间歇故障，各次约0.28—0.38秒，420ms内移除覆盖层。漏液色斑/色条撕裂/短黑屏轮换；不修改底层页面transform/filter，不暂停JS、时钟、通话或音频，覆盖层pointer-events:none。后台错过的效果不补播；减少动态效果模式关闭故障动画。零点传送幕内增加0.65秒花屏残影，原传送/继续/生日消息/存档逻辑保留。
- 快速演示更新为20秒：`?dev=1&endingPreview=1`，压缩演示23:55—00:00及六次故障，独立预览存档、刷新或右上角“重播结尾 · 20秒”可重播；普通模式不显示开发按钮。资源版本homecoming15。新增六次触发/按时清理/不改变页面和通话/后台不补播/减少动态效果回归。Browser因缺少sandboxPolicy连接失败，未完成浏览器截图及真机视觉验收，以用户快速演示体验为准。

- 2026-11-13按作者要求，先提交并推送当前聊天修改作为新失真效果开发前存档，再开发23:55起的间歇故障与快速演示。

- 2026-11-13按作者要求，MuAMuA九段聊天分别从09:34、22:52、08:18、19:43、21:27、18:04、00:56、21:08、18:22开始，拉开起始分钟差异；各段整体平移、保留原有消息间隔及文案。补11月15日末两条之间缺失逗号，凌晨12点规范为上午0点。资源版本homecoming14。

- 2026-11-13再次保存作者最新聊天记录增补与修订，正文沿用工作区版本，语法和现有回归检查后提交推送。

- 2026-11-13本轮按作者push请求保存最新聊天记录手动修订，保持正文原样，检查后同步当前feature分支。

- 2026-11-13再次核对18岁工作区最新正文，明确A，B必须拆为两条数组消息/气泡（如「看着那些消息」→「突然觉得时间过得真快」），不能只删除逗号。4处共拆为16条，每分钟两条，从23:09排到23:16；版本homecoming13。若IDE再次保存旧内容，需按最新工作区重新核对，不能只引用上次测试结果。

- 2026-11-13恩仔18岁最新要求：23:09开始、23:16结束，将正文逗号拆成独立消息（最新16条），按原顺序分布在8分钟内，允许同分钟连发；替代此前逐条一分钟的18岁安排。保留各分句原文与句号，版本homecoming12。

- 2026-11-13恩仔18岁生日按作者最新10条文案调整为23:07—23:16，每条一分钟，最后「我一直都是我」固定23:16；补齐尾部消息之间缺失的逗号，避免数组被错误解析。正文不变，资源版本homecoming11。

- 2026-11-13补充：各段起始分钟也要错开，不统一07分。最新15岁19:11—19:24、16岁23:39—23:59、17岁21:23—21:39，18岁下午段17:17起；保留段内原间隔和文案。

- 2026-11-13最新要求：恩仔全部聊天避免整点。14岁20:00附近两条顺延至20:02/20:03；15岁19:07—19:20；16岁为保留一分钟间隔且避开零点整体改为23:39—23:59，移除已无必要的次日日期；17岁21:07—21:23；18岁下午段整体后移7分钟。确认恩仔段无:00时间，文案和顺序保持不变；替代下文历史时间安排。版本homecoming9。

- 2026-11-13作者要求17岁生日聊天不要从整点开始：最新为晚上21:07—21:23，17条每条间隔一分钟，替代21:00安排。

- 2026-11-13作者追加：恩仔17岁生日17条改为晚上21:00—21:16，间隔仍为一分钟，文案顺序不变；替代此前上午9点安排。

- 2026-11-13重新整理恩仔16、17岁作者最新聊天：16岁21条从2023-11-16晚上11:43逐分钟排到11-17上午00:03，零点前补次日日期；17岁17条从2024-11-16上午9:00逐分钟排到9:16。仅修改时间并补跨日行，核对文案和顺序不变；资源版本homecoming6。

- 2026-11-13恩仔16岁生日按作者当前保留的版本调整：16条消息从晚上11:43到11:58，每条间隔一分钟，保留原文；作者同期删减的候选版本一并保存。

- 2026-11-13按作者要求，恩仔2022年11月16日（15岁）生日14条消息从下午7:00到7:13，每条间隔1分钟，仅修改时间；其余作者手动修订一并保存。

- 2026-11-13本轮继续保存作者聊天记录更新，提交以工作区最新内容为准，包含暂存后继续编辑的部分；不改写对话正文，检查后推送当前feature分支。

- 2026-11-13协助保存作者暂存的聊天记录修订，使用命令行提交说明完成提交并推送当前feature分支；聊天内容不由AI改写，提交前执行语法及现有回归检查。

- 2026-11-13新增恩仔生日消息：「谢谢你今年也陪我过生日呀。以后也陪着我，一直到120岁，好不好？」配置在`S.homecomingTimeline`；点传送幕“继续”后发送并按现有通知规则弹出，保留聊天日期和未读，尊重黑名单/免打扰。新事件不加入旧催命timeline，也不改变DATA_SIG。
- `deliverHomecomingTimeline()` 使用deliverFrom收信，事件id保存在SS.homecoming.fired，刷新/重复继续不重发；已在自由探索的旧档会补发。仍停在传送幕时不发送，催命继续关闭。新增首次发送及刷新不重发回归，12个测试文件全部通过。资源版本更新为`20261113-homecoming3`。

- 用户要求在 feature 分支试做新结尾，未合并 main。旧 A/B 选择和结局由整点传送接管，不改作者维护的 story/chat_history 正文。
- `core/app.js` 在新局第636秒（零点前24秒）开始暗色遮罩、扫描线、轻微错位；第660秒黑屏，短暂淡入「用户『小纸团』已被强制传送回家」「敢不陪穆祉丞过生日？」和「继续」。遵守减少动态效果设置。
- 继续后回主屏，游戏时间从00:00起按真实速度流逝（60秒=1分钟），可探索手机；时间线、催命、回拨、耐心收尾停止。零点会结束现有来电、暂停媒体，继续后再尝试恢复BGM。
- `SS.homecoming` 保存 transferred/exploring 阶段和 continuedAt；刷新未继续时重现传送幕，刷新已继续时保留自由时间。现有到家存档若无新阶段，到零点会补上新结尾。
- `views/wx_chat.js` 为催命入口/延迟送达/耐心回调加到家门控；`views/app_extra.js` 为追命、回拨、botSay和猪哭图延迟回调加门控；`core/audio.js` 避免传送幕被自动BGM打断。
- 电话名称修复：callNameDisp 统一使用 dn/DISPLAY，最近通话与通话顶栏显示 pig/cat/rabbit/tiger 对应emoji，保留重复来电计数与拨号内部key、纯号码。新增映射与预览重播回归，12个测试文件全部通过。
- 场景渲染集中在 `renderHomecoming()`，样式在style.css尾部。生日照片、吹蜡烛和生日歌暂未加入，后续可在这里扩展。
- ASSET_V与样式URL版本更新为 `20261112-homecoming2`。
- 本地快速预览：`http://127.0.0.1:8765/?endingPreview=1`；仅开发模式有效，从最后20秒开始，跳过普通剧情，独立存档键为 `mzc_homecoming_preview`，不会覆盖正式进度。开发模式屏幕右上角有“体验结尾 · 20秒”；预览中为“重播结尾 · 20秒”。每次打开/刷新预览都清理独立预览档并从20秒前开始，不再需要重置进度。普通模式不显示此按钮；非本地主机可用 ?dev=1&endingPreview=1 测试当前分支。
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
- 作者补充约定：commit提交说明默认用中文；git提交和push直接执行，不额外询问（环境强制权限授权除外）。每次交付最后简短总结解决了什么、检查结果、commit/push状态，并明确说明用户本次诉求是否解决。

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
- 最新通话完成状态为`SS.callDone[name]`：普通来电/回拨均须接听并聊满8秒才标记，停止该角色来电/催命/时间线通知，并保存到存档。旧`_playerCalledBack`只保留兼容判断，不再在短回拨挂断时写入。
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
- 涉及存档时验证刷新续玩、指纹弃档、确认重置；涉及电话时分别验证追命/回拨/零点及刷新后的状态，现有回归通过不等于这些路径全部验收。
- 素材迁移至data/photo、data/avatar、data/chat、data/app等；检查当前引用，缺素材沿用wxMediaMiss，不照旧data/album路径补写。
- og:image/weibo:image 当前指向 `https://cgcgdsg.cc.cd/data/share-cover.jpg`；上线前核对可达性和平台尺寸，必要时用分享链接版本参数刷新抓取。
- 角色总表与归档保留历史设定和统计，和当前源码冲突时先确认上下文，不能自行回退作者后续修改。
