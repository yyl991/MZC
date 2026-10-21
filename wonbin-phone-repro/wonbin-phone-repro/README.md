# wonbin-phone 复现项目

完整复现自 `https://wonbin-phone.pages.dev/` 的 iPhone 模拟器网页。

## 项目结构
```
wonbin-phone-repro/
├── index.html        # 入口页面（锁屏/主屏/应用外壳，CSS）
├── app.js            # 核心逻辑：UI、动画、导航、游戏时间线
├── i18n.js           # 多语言文案 + 日期时间本地化
├── chat_times.js     # 聊天消息时间轴
├── data.ko/en/ja/zh/vi/th/id.js  # 7 种语言的数据（对话、备忘录、邮件、相册、歌曲、地图、剧本）
├── wallpaper.jpg     # 锁屏壁纸
├── media/            # 音乐、语音、头像、Reels 视频（15 个文件）
└── photos/           # 相册图片（55 张）
```

## 运行方式
推荐用本地静态服务器打开（浏览器对音频/视频自动播放有要求）：
```bash
cd wonbin-phone-repro
python3 -m http.server 8000
# 浏览器访问 http://localhost:8000/index.html
```
或直接用浏览器打开 `index.html`。

## 功能
- 锁屏：日期/时间、生日提醒、语言切换、上滑解锁
- 密码解锁：PIN 1121
- 主屏：日历/天气小组件、应用图标与角标、Dock
- 应用：KakaoTalk（完整对话+实时消息+自动回复）、Instagram(Reels)、相册(图片查看器)、邮件、日历、时钟、备忘录、天气、设置、屏幕使用时间、地图、音乐(播放器)、Safari、电话(含剧情来电)
- 多语言：韩/英/日/简中/越/泰/印尼（右上角或锁屏 🌐 切换，`?lang=` 指定）
- 游戏时间线：到点自动收到消息、来电与剧情分支

## 备注
- 锁屏 PIN 为 `1121`（对应 11月21日 生日剧情）。
- 唯一外部依赖为 Pretendard 字体 CDN（与原网页一致），离线时自动回退系统字体。
