# 项目文件夹树

> 生成时间：2026-10-28 · 对应提交 `59f7d0e`
> 仓库根是 `MZC/`，网页项目本体在 `newload/` 下。

---

## 一、全局结构

```
MZC/                              ← git 仓库根
├── .gitignore                    忽略 node_modules / *.exe / dist / .claude
├── MD/                           作者的原稿目录（已被作者删除，git 里仍留删除记录）
└── newload/                      网页本体，EdgeOne 直接托管这一层
    ├── index.html
    ├── style.css
    ├── package.json
    ├── package-lock.json
    ├── obfuscate.js
    ├── compress.js
    ├── ffmpeg.exe                本地工具，不提交
    ├── HANDOVER.md               交接文档（本项目的入口文档）
    ├── FILETREE.md               本文件
    ├── 角色聊天记录总表.md        角色设定与聊天记录的唯一来源
    ├── core/
    ├── views/
    ├── data/
    ├── tests/
    ├── trash/                    废弃文件，不打包
    └── dist/                     打包产物，已忽略，线上不参与
```

---

## 二、根目录文件

| 文件 | 作用 |
|---|---|
| `index.html` | 唯一的 HTML 入口。`<div id="phone">` 里手工搭出 iPhone 的 DOM 骨架（`#boot` 加载遮罩、`#wall` 壁纸、`#homeL` 桌面、`#lockL` 锁屏、`#appL` 应用层、`#ov` 浮层），底部用一段内联脚本按顺序 `load()` 11 个 JS，全部加载完才调 `initApp()`。**`ASSET_V` 常量在 86 行，改代码后必须 +1** |
| `style.css` | 全部样式，约 4400 行。包含 iPhone 外壳、锁屏、各 App 页面、微信气泡、朋友圈、通话界面等 |
| `package.json` | 三个脚本：`test`（跑测试）、`build`（混淆打包）、`compress`（压缩素材）。依赖只有 `glob` 和 `javascript-obfuscator` |
| `obfuscate.js` | 打包脚本：把整个目录混淆后输出到 `dist/`，跳过 `node_modules / .git / dist / waste / trash / tests` 和所有 `.exe`。会把 `index.html` 里的 `ASSET_V` 替换成构建时间戳。**domainLock 当前是关闭的，上线前要加回来** |
| `compress.js` | 素材压缩辅助脚本（图片/视频），非日常流程 |
| `ffmpeg.exe` | 本地转码工具，`.gitignore` 里排除，**不要提交** |
| `面团.jpg` | 临时素材，未使用 |

---

## 三、core/ —— 引擎层

| 文件 | 行数 | 作用 |
|---|---|---|
| `app.js` | ~1280 | **核心**。全局常量、`IS_DEV_HOST`（localhost 跳过锁屏）、游戏时钟（`base` / `startClock` / `elapsed` / `gameMin` / `clock12`）、锁屏渲染（`renderLock` / `renderPin` / `unlock`）、路由（`show` / `push` / `back` / `openApp` / `closeApp`）、`PARENT` 返回映射、`ROOT_VIEWS` 白名单、时间线引擎（`pacedAt` / `storyTick` / `pressureTick` / `midnightBoom` / `buildInterleavedTimeline`）、`initApp()` 启动 |
| `audio.js` | 57 | 音效合成（Web Audio API 直接生成波形，`tone` / `sfx` / `ringOnce`）和 BGM 管理（`AudioHub`、`tryStartBGM`）。**BGM 音量有两处设置，改一处会被另一处覆盖** |
| `icons.js` | ~300 | **所有内联 SVG 的唯一存放处**。分三类：系统图标（`backThin` / `chevL` / `heart` …）、微信加号面板（`wxAb*`）、微信服务页（`wxSvc*`）。视图文件里不允许写内联 `<svg>` |
| `utils.js` | 103 | 通用工具：`navHTML`（标准导航栏）、`tabbar`、`esc`（转义）、`pad`、`dn`（显示名）、`timeToMin`（时间字符串转分钟）、`wdLong` |
| `store.js` | 33 | 轻量状态容器 |

---

## 四、views/ —— 页面层（注册到全局 `VIEWS`）

| 文件 | 行数 | 负责的页面 |
|---|---|---|
| `wx_chat.js` | ~1360 | **微信聊天**：聊天列表、聊天详情、气泡渲染（文字/图片/表情/语音/视频/位置/红包/转账/**被删除 rejected**）、输入框、加号面板、红包转账数字键盘、拍一拍 `wxPatTap`、耐心值 `armPatience`、旧消息补发 `deliverFrom` |
| `wx_pages.js` | ~790 | **微信其它页**：通讯录、新的朋友、群聊、标签、发现页、扫一扫、我、服务（绿色收付款卡 + 4 段图标网格）、收藏、设置、资料页 |
| `wx_moments.js` | ~550 | **朋友圈**：列表页 `moments`（封面 + 所有好友动态）、详情页 `wx_moments_detail`（九宫格 + 三点菜单）、个人页 `wx_moments_self`、其他好友页 `wx_moments_user`、发表页 `wx_moment_compose` |
| `app_extra.js` | ~1770 | **电话 + 短信 + 备忘录**：电话 App 四个 tab（最近通话/通讯录/拨号键盘/语音留言）、通话界面、挂断追命 `scheduleCallAgain`、回拨 `scheduleCallBack`、短信收发、备忘录编辑与加密解锁（PIN 0913） |
| `app_weibo.js` | ~1215 | **微博**：首页、我的微博主页 `weibo_my_posts`（打开微博默认进这个）、艺人主页、超话、关注列表、详情页、签到 |
| `app_photos.js` | ~380 | **照片 App**：相册分区、大图查看器、手机相册选择器（微信发图时调起） |
| `app_xhs.js` | 306 | 小红书 |
| `app_xianyu.js` | 126 | 闲鱼 |
| `app_bilibili.js` | 138 | B站 |
| `mail.js` | 254 | 邮件：列表、详情、写邮件 |
| `home_ui.js` | 320 | 桌面：图标布局、小组件、App 图标绘制 |

---

## 五、data/ —— 数据层

| 文件/目录 | 说明 |
|---|---|
| `story.js` | **主配置**。`S.roles`（角色头像/颜色/拍一拍台词）、`S.chats`（每个角色的初始消息 + 回复脚本 + 碎片）、`S.timeline`（按秒触发的剧情）、`S.pace`（节奏曲线）、`S.nagFrom`、`S.nagLines`、`S.missLines`（错过对话时对方的最后一句）、`S.wxids`（微信号）、`S.notes`、`S.emails`、`S.events`、`S.songs`、`S.calls`、`S.photoSections`、`S.display`（emoji 映射）、`S.ending` |
| `chat_history.js` | 各角色的过往聊天记录。格式见下 |
| `album/` | 22 个文件。相册用图（`1.mp4`、`cat.jpg`、`mzc.jpg`、`me.jpg`…）+ 语音占位 `boli.mp3` |
| `app/` | 9 个。桌面壁纸 `wallpaper.jpg`、BGM `bgm.mp3`、各 App 图标 png |
| `avatar/` | 24 个。微信头像（`mzc.jpg`、`guimi.jpg`、`mama.jpg`…），`test/` 子目录是废弃副本 |
| `chat/` | 3 个。聊天内素材：`1.mp4`、`boli.mp3`、`pigcry.jpg`。**大量聊天记录引用了这里不存在的图，目前走 `wxMediaMiss` 占位** |
| `music/` | 4 个。音乐 App 用 |
| `weibo/` | 2 个。微博配图 |

### 聊天记录格式

```js
window.CHAT_HISTORY = {
  '穆祉丞': [
    ['11月15日', 'date'],                              // 日期分隔
    ['文本', 'them', '下午 8:12'],                      // 对方发的
    ['文本', 'me', '下午 8:15'],                        // 我发的
    ['"穆小恩"撤回了一条消息', 'sys', '下午 2:39'],       // 居中系统提示
    ['[图片] ./data/chat/xxx.jpg', 'them', '下午 2:36'],
    ['[表情] ./data/chat/xxx.png', 'them', '下午 2:38'],
    ['[语音] 5|./data/chat/boli.mp3|转文字内容', 'them', '下午 2:33'],
    ['[视频] ./data/chat/1.mp4|./data/album/mama.jpg|0:01', 'them', '下午 8:20'],
    ['[位置] 名字|地址', 'them', '下午 8:20'],
    ['[红包] 恭喜发财|6.66', 'them', '下午 8:20'],
    ['[转账] 88.00|备注', 'me', '下午 8:20'],
    ['？', 'me', '下午 3:20', 'rejected'],              // 被对方删除后发出的
  ],
};
```

---

## 六、tests/ —— 回归测试

用 Node 的 `vm` 沙箱，按 `index.html` 的顺序加载**真实脚本**，模拟最小 DOM 后断言渲染结果。不需要浏览器。

```bash
npm test          # = node tests/run.js，共 115 项断言
```

| 文件 | 覆盖 |
|---|---|
| `run.js` | 依次跑所有 `*.test.js`，汇总结果 |
| `load.test.js` | 脚本全部能加载、无语法错误、11 个视图齐全、路由函数存在 |
| `narrative.test.js` | 剧情规则：微信号齐全且不重复、锁屏只展开 3 条、回过消息不追命、消息交错、`saveChat/saveStory` 是空实现 |
| `chat.test.js` | 聊天渲染：表情、语音、转文字、头像单击不误触、**拉黑特效 4 条断言** |
| `phone.test.js` | 电话 + 短信：四个 tab、拨号缓冲、发短信、收藏页已删除 |
| `note_lock.test.js` | 设置开关 + 备忘录加密解锁 |
| `wx.test.js` | 微信：占位走 toastDev、加号面板、`微信(n)` 头、PC 登录条、服务页 |
| `album.test.js` | 相册选择器：单选/多选、过滤视频 |
| `extra.test.js` | 设置页开关、笔记增删 |
| `svg.test.js` | 防止图标漏配渲染成 `undefined` |
| `weibo.test.js` | 微博签到 |
| `fix.test.js` | 历史修复回归：邮件收件人、游戏时钟、回拨 |

---

## 七、其它

| 目录/文件 | 说明 |
|---|---|
| `trash/` | 废弃代码，打包时跳过 |
| `dist/` | `node obfuscate.js` 的产物，已加入 `.gitignore`，**线上不参与部署** |
| `node_modules/` | 依赖，不入库 |
| `.claude/` | Claude Code 本地配置，不入库 |
| `.assetsignore` | 打包相关配置 |
