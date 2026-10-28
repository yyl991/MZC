# 📂 项目目录树结构 (PROJECT_TREE.md)

本项目为原生 HTML/JS/CSS 架构，无打包工具。以下是完整的目录结构及各文件职责，**AI 在写代码必须严格遵守此路径结构**：

```text
📦 根目录 (newload)
┣ 📜 index.html          # 【入口】负责加载所有 JS 和 CSS。动态加载 JS 时带有防缓存时间戳。
┣ 📜 style.css           # 【全局样式】包含手机外壳、通用 UI 组件、以及微信/天气等各 App 的样式。
┣ 📜 README.md           # 项目基础说明 (本地启动命令等)。
┣ 📜 HANDOVER.md         # 【核心】AI 交接文档（包含铁律、坑点、当前进度）。
┣ 📜 PROJECT_TREE.md     # 【本文件】项目结构说明。
┣ 📜 compress.js         # 【工具】图片/视频/音频本地压缩脚本。
┣ 📜 obfuscate.js        # 【工具】上线前代码混淆脚本。
┣ 📜 package.json        # 项目依赖 (glob, javascript-obfuscator, sharp 等)。
┃
┣ 📂 core/               # 【核心逻辑层】
┃ ┣ 📜 app.js            # 【内核】路由控制 (show/back/openApp)、返回键自动注入、系统通知、时间线引擎。
┃ ┣ 📜 audio.js          # 【音频调度】全局接管 BGM、视频、语音播放暂停，防止冲突。
┃ ┣ 📜 icons.js          # 【图标库】所有 SVG 图标与图标生成器 (window.G 与 appIcon)。
┃ ┣ 📜 utils.js          # 【工具函数】文字防 XSS 转义 (esc)、时间格式化 (pad)、navHTML / tabbar 生成器。
┃ ┗ 📜 store.js          # 状态管理辅助 (可选)。
┃
┣ 📂 data/               # 【纯数据层】
┃ ┣ 📜 story.js          # 【剧情库】角色设定 (roles)、时间线 (timeline)、备忘录 (notes)、事件 (events)。
┃ ┣ 📜 chat_history.js   # 【微信聊天库】所有角色的历史聊天记录。
┃ ┣ 📂 avatar/           # 存放所有角色的头像图片 (如 mzc.jpg, miantuan.jpg)。
┃ ┣ 📂 app/              # 存放主屏幕 App 的图标、壁纸 (如 wallpaper.jpg, wechat.png)。
┃ ┣ 📂 chat/             # 存放聊天记录里用到的图片、音频、视频 (如 1.jpg, boli.mp3, 1.mp4)。
┃ ┣ 📂 music/            # 存放音乐 App 里的封面图和音频。
┃ ┣ 📂 weibo/            # 存放微博背景图等。
┃ ┗ 📂 album/            # 存放相册的图片。
┃
┗ 📂 views/              # 【视图层】包含所有 App 的具体逻辑与页面渲染
┣ 📜 home_ui.js        # 【主屏幕】自定义布局、日历组件、天气卡片、黑胶唱片动画。
┣ 📜 app_wechat.js     # 【微信】聊天列表、聊天详情、通讯录、朋友圈、资料页。
┣ 📜 app_extra.js      # 【系统内置 App】电话、短信、天气、录音、日历、时钟、备忘录。
┣ 📜 app_photos.js     # 【照片】相册瀑布流、私密相册、媒体查看器。
┣ 📜 app_weibo.js      # 【微博】首页、个人主页、艺人主页、超话。
┣ 📜 app_xhs.js        # 【小红书】瀑布流、搜索页。
┣ 📜 app_bilibili.js   # 【B站】视频列表。
┣ 📜 app_xianyu.js     # 【闲鱼】二手商品列表。
┣ 📜 app_safari.js     # 【Safari】浏览器。
┣ 📜 app_music.js      # 【音乐】播放器。
┣ 📜 app_map.js        # 【地图】位置与路径。
┣ 📜 mail.js           # 【邮件】收件箱与详情。
┗ 📜 app_paopao.js     # 【泡泡】追星互动 App (可选)。
```



### ⚠️ AI 读取路径避坑指北：

1. **图片引用**：尽量使用相对路径（如 `./data/chat/1.jpg`），HTML 中直接写 `<img>`，不要用 `import`。
2. **JS 加载顺序**：`index.html` 里的 `scripts` 数组决定了加载顺序（先加载 `core` 里的工具，再加载 `views` 里的业务）。**如果你新加了 JS 文件，必须提醒用户去 `index.html` 里加上路径。**
3. **样式修改**：如果只是改某一个 App 的局部样式，尽量写在 `VIEWS.xxx` 函数内的行内 `style` 里；如果是全局通用的，再去改 `style.css`。