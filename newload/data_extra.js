// ==========================================
// 📱 1. 短信 (SMS) - 带详情页
// ==========================================
// ==========================================
// 📱 短信 (SMS) - 完美复刻 iOS 列表与详情
// ==========================================
// ==========================================
// 📱 短信 (SMS) - 完美融入全局主题
// ==========================================

const smsData = [
  {
    id: 0,
    name: "中国农业银行",
    tag: "个人",
    text: "【中国农业银行】尾号1109卡11月15日02:58农业银行收入(劳务费)...",
    time: "02:58",
    iconText: "农",
    iconColor: "#007AFF",
    unread: true,
    msgs: [
      { me: false, time: "11月15日 02:58", text: "【中国农业银行】尾号1109卡11月15日02:58农业银行收入(劳务费)5.21元，余额11.16元。", type: "text" }
    ]
  },
  {
    id: 1,
    name: "中国移动高频骚扰电话防护",
    tag: "商务",
    text: "【高频骚扰电话防护】尊敬的用户您好，2026年11月14日17时38分37秒高频系统...",
    time: "昨天",
    iconText: "移",
    iconColor: "#3FA9F5",
    unread: false,
    msgs: [
      { me: false, time: "昨天 17:38", text: "【高频骚扰电话防护】尊敬的用户您好，2026年11月14日17时38分37秒高频系统为您拦截了1个骚扰电话。", type: "text" }
    ]
  },
  {
    id: 2,
    name: "美团",
    tag: "商务",
    text: "665540 (商户登录二次验证验证码)。工作人员不会向您索要，请勿向任何人泄露，...",
    time: "星期四",
    iconText: "美",
    iconColor: "#FFD100",
    unread: false,
    msgs: [
      { me: false, time: "星期四 11:00", text: "665540 (商户登录二次验证验证码)。工作人员不会向您索要，请勿向任何人泄露。", type: "text" }
    ]
  },
  {
    id: 3,
    name: "5G消息 AI助手",
    tag: "商务",
    text: "信息：【灵犀会员，让每一秒都成为成长阶梯】",
    time: "星期三",
    iconText: "AI",
    iconColor: "#4CD964",
    unread: false,
    msgs: [
      { 
        me: false, 
        time: "11月11日 周三 09:11", // 对齐到11月11日（星期三）
        type: "card",
        title: "【流量查询提醒】",
        desc: "尊敬的用户，您好！为方便您随时掌握流量使用情况，可点击下方按钮查询，避免扣费。祝您生活愉快！【中国移动】",
        buttons: ["一句话查询", "同意协议免费关注", "用户协议", "如何取消推送"]
      }
    ]
  }
];
VIEWS.sms = () => ({
  html: navHTML({ title: "信息", back: "主页", backFn: "closeApp()" }) +
  `<div class="scroll" style="background:#f2f2f7;">
    <!-- 搜索框放回正常的滚动区域内 -->
    <div class="srch" style="margin-top:10px;">${G.search}搜索</div>
    
    <div style="background:#fff; margin:0 16px; border-radius:12px; overflow:hidden;">
      ${smsData.map(m => `
        <div onclick="openSmsDetail(${m.id})" style="display:flex; align-items:flex-start; padding:12px 16px; border-bottom:0.5px solid #e5e5ea; cursor:pointer;">
          
          <!-- 纯 CSS 绘制的圆形图标，绝不拉垮 -->
          <div style="width:48px; height:48px; border-radius:50%; background:${m.iconColor}22; display:flex; align-items:center; justify-content:center; margin-right:12px; flex:none; border:1px solid ${m.iconColor}44;">
             <span style="color:${m.iconColor}; font-weight:800; font-size:16px;">${m.iconText}</span>
          </div>
          
          <!-- 内容区 -->
          <div style="flex:1; min-width:0; padding-top:2px;">
            <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:4px;">
              <span style="font-size:16px; font-weight:500; color:#111; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${esc(m.name)}</span>
              <div style="display:flex; align-items:center; gap:6px; flex:none; margin-left:8px;">
                <span style="font-size:13px; color:#8e8e93;">${m.time}</span>
                <span style="color:#c4c4c7;">${G.chevR}</span>
              </div>
            </div>
            <div style="font-size:14px; line-height:1.35; color:#8e8e93; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
              <span style="display:inline-block; background:#e5e5ea; color:#666; font-size:10px; padding:1px 4px; border-radius:4px; margin-right:4px; transform:translateY(-1px);">${m.tag}</span>
              ${esc(m.text)}
            </div>
          </div>
          ${m.unread ? `<div style="width:10px; height:10px; border-radius:50%; background:#007aff; margin-left:10px; align-self:center; flex:none;"></div>` : ''}
        </div>
      `).join('')}
    </div>
  </div>`,
});

VIEWS.sms_detail = () => {
  const data = smsData.find(d => d.id === currentSmsDetailId);
  if (!data) return { html: "" };

  return {
    // 顶部导航栏
    html: navHTML({ title: data.name, back: "信息", backFn: "back()", right: `<span style="color:#007aff; display:flex;"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></span>` }) +
    
    // 聊天记录区 (加上 padding-top 避开导航栏)
    `<div class="scroll" style="background:#f2f2f7; padding-top:88px; padding-bottom:100px; display:flex; flex-direction:column; gap:8px;">
        
        ${data.msgs.map(msg => {
          if (msg.type === "card") {
             // 【核心修改】将卡片拆分成两个独立气泡：文字气泡 + 按钮气泡
             return `
               <!-- 居中的时间 -->
               <div style="text-align:center; font-size:12px; color:#8e8e93; margin: 10px 0;">${msg.time}</div>
               
               <!-- 1. 文字内容气泡 -->
               <div style="padding:0 16px; display:flex; flex-direction:column; align-items:flex-start;">
                  <div style="max-width:85%; background:#e9e9eb; border-radius:16px; padding:12px 16px; color:#111;">
                     <div style="font-size:15px; font-weight:600; margin-bottom:4px;">${esc(msg.title)}</div>
                     <div style="font-size:14px; line-height:1.4; color:#333;">${esc(msg.desc)}</div>
                  </div>
               </div>
               
               <!-- 2. 按钮操作气泡 (紧挨着上面，用负边距收拢) -->
               <div style="padding:0 16px; display:flex; flex-direction:column; align-items:flex-start; margin-top:-4px;">
                  <div style="max-width:85%; background:#e9e9eb; border-radius:16px; overflow:hidden;">
                     ${msg.buttons.map((btn, i) => `
                        <div style="font-size:15px; color:#007aff; padding:11px 16px; cursor:pointer; ${i > 0 ? 'border-top:0.5px solid #d1d1d6;' : ''}">
                           ${esc(btn)}
                        </div>
                     `).join('')}
                  </div>
               </div>
             `;
          } else {
             // 普通文本消息
             return `
               <div style="text-align:center; font-size:12px; color:#8e8e93; margin: 10px 0;">${msg.time}</div>
               <div style="padding:0 16px; display:flex; flex-direction:column; align-items:${msg.me ? 'flex-end' : 'flex-start'};">
                  <div style="max-width:75%; padding:10px 14px; border-radius:18px; font-size:15px; line-height:1.4; background:${msg.me ? '#007aff' : '#e9e9eb'}; color:${msg.me ? '#fff' : '#111'};">
                    ${esc(msg.text)}
                  </div>
               </div>
             `;
          }
        }).join('')}
      </div>

      <!-- 底部输入框 (完美还原图2底部的悬浮感) -->
      <div style="position:absolute; bottom:34px; left:16px; right:16px; display:flex; align-items:flex-end; gap:12px;">
         <!-- 加号按钮增加白底和阴影 -->
         <div style="width:36px; height:36px; background:#fff; border-radius:50%; display:grid; place-items:center; color:#333; font-size:24px; font-weight:300; margin-bottom:2px; cursor:pointer; box-shadow:0 1px 4px rgba(0,0,0,0.08);">+</div>
         <!-- 输入框 -->
         <div style="flex:1; background:#fff; height:38px; border-radius:19px; display:flex; align-items:center; justify-content:space-between; padding:0 14px; color:#8e8e93; box-shadow:0 1px 4px rgba(0,0,0,0.05);">
            <span style="font-size:15px;">信息 · RCS</span>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3"/></svg>
         </div>
      </div>`,
  };
};

let currentSmsDetailId = 0;
function openSmsDetail(id) {
  const data = smsData.find(d => d.id === id);
  if (!data) return;
  data.unread = false; 
  currentSmsDetailId = id;
  push('sms_detail');
}

// ==========================================
// 📱 2. 微博 (Weibo) - 带个人主页
// ==========================================
const weiboData = [
  { text: "小萌萌", time: "10-16", device: "来自 HarmonyOS设备", images: ["./data/avatar/mzc.jpg", "E404", "E404"], repost: "@与橡树至世界尽头：🐼➡️😡➡️啊打", likes: 1024, comments: 88, forwards: 56 },
  { text: "小猪宝宝🐷", time: "10-15", device: "来自 iPhone 15 Pro", images: [], likes: 2048, comments: 156, forwards: 23 },
  { text: "今天排练真的很累，但是看到大家应援又充满了力量！", time: "10-10", device: "来自 微博网页版", images: ["E404"], likes: 5120, comments: 420, forwards: 102 },
];

VIEWS.weibo = () => ({
  html: navHTML({ title: "微博", back: "主页", backFn: "closeApp()", right: G.gear }) +
    `<div class="scroll" style="background:#f5f5f5; padding-top:88px; padding-bottom:20px;">
      
      <div style="background:#fff; padding:10px 16px 0;">
        <div style="display:flex; gap:20px; overflow-x:auto; white-space:nowrap; font-size:16px; color:#666; padding-bottom:10px; scrollbar-width:none;">
          <span style="font-weight:700; color:#111; position:relative;">全部<span style="position:absolute; bottom:-8px; left:50%; transform:translateX(-50%); width:20px; height:3px; background:#ff8200; border-radius:2px;"></span></span>
          <span>超话帖</span>
          <span>原创</span>
          <span>视频</span>
          <span>文章</span>
          <span>图片</span>
        </div>
        <div class="srch" style="margin:10px 0; background:#f5f5f5;">${G.search}搜我的微博</div>
      </div>

      <!-- 个人主页入口 -->
      <div style="background:#fff; margin-top:10px; padding:14px 16px; display:flex; justify-content:space-between; align-items:center;">
        <div style="display:flex; align-items:center; gap:10px; cursor:pointer;" onclick="push('weibo_profile')">
           <div style="width:48px; height:48px; border-radius:50%; background:#eee; overflow:hidden;">
             ${CFG.myAvatar ? `<img src="${CFG.myAvatar}" style="width:100%; height:100%; object-fit:cover;">` : ''}
           </div>
           <div>
             <div style="font-size:16px; font-weight:600; color:#111;">赶快跑赶快长</div>
             <div style="font-size:12px; color:#999;">查看过往微博 ></div>
           </div>
        </div>
      </div>

      <div style="padding:10px 16px; font-size:13px; color:#666; display:flex; justify-content:space-between;">
        <span>全部微博(${weiboData.length})</span>
        <span>☰ 筛选</span>
      </div>

      ${weiboData.map(w => `
        <div style="background:#fff; margin-bottom:10px; padding:16px;">
          <div style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
            <div style="width:44px; height:44px; border-radius:50%; overflow:hidden; background:#eee;">
               ${CFG.myAvatar ? `<img src="${CFG.myAvatar}" style="width:100%; height:100%; object-fit:cover;">` : ''}
            </div>
            <div>
              <div style="font-size:16px; font-weight:600; color:#333;">赶快跑赶快长</div>
              <div style="font-size:12px; color:#999;">${w.time} ${w.device}</div>
            </div>
          </div>
          <div style="font-size:15px; color:#333; line-height:1.5; margin-bottom:8px;">${esc(w.text)}</div>
          ${w.repost ? `<div style="font-size:13px; color:#666; margin-bottom:8px; background:#f5f5f5; padding:8px; border-radius:4px;">${esc(w.repost)}</div>` : ''}
          
          ${w.images.length > 0 ? `
            <div style="display:grid; grid-template-columns:repeat(${w.images.length === 1 ? 1 : w.images.length === 4 ? 2 : 3}, 1fr); gap:4px; margin-bottom:12px;">
              ${w.images.map(img => `
                <div style="aspect-ratio:1; border-radius:4px; overflow:hidden; background:#eee; display:flex; align-items:center; justify-content:center; color:#999; font-size:12px;">
                  ${img === 'E404' ? '图片占位' : `<img src="${img}" style="width:100%; height:100%; object-fit:cover;">`}
                </div>
              `).join('')}
            </div>
          ` : ''}

          <div style="display:flex; justify-content:space-between; align-items:center; border-top:0.5px solid #f0f0f0; padding-top:12px; color:#666; font-size:13px;">
            <span style="display:flex; align-items:center; gap:4px;">↻ 转发</span>
            <span style="display:flex; align-items:center; gap:4px;">💬 评论</span>
            <span style="display:flex; align-items:center; gap:4px;">👍 赞</span>
          </div>
        </div>
      `).join('')}
    </div>`,
});

VIEWS.weibo_profile = () => ({
  html: navHTML({ title: "个人主页", back: "微博", backFn: "back()" }) +
    `<div class="scroll" style="background:#f5f5f5; padding-bottom:20px;">
       <div style="background:linear-gradient(180deg, #ff9a9e, #fecfef); height:120px; position:relative;">
          <div style="position:absolute; bottom:-30px; left:20px; width:80px; height:80px; border-radius:50%; border:3px solid #fff; overflow:hidden; background:#fff;">
             ${CFG.myAvatar ? `<img src="${CFG.myAvatar}" style="width:100%; height:100%; object-fit:cover;">` : ''}
          </div>
       </div>
       <div style="background:#fff; padding:40px 20px 20px;">
          <div style="font-size:20px; font-weight:700; color:#111;">赶快跑赶快长</div>
          <div style="font-size:13px; color:#999; margin-top:6px;">📍 北京</div>
          <div style="font-size:14px; color:#333; margin-top:12px;">今天也很想你。</div>
       </div>
       <div style="padding:10px 16px; font-size:13px; color:#666;">全部微博(${weiboData.length})</div>
       ${weiboData.map(w => `
        <div style="background:#fff; margin-bottom:10px; padding:16px;">
          <div style="font-size:15px; color:#333; line-height:1.5; margin-bottom:8px;">${esc(w.text)}</div>
          ${w.images.length > 0 ? `
            <div style="display:grid; grid-template-columns:repeat(${w.images.length === 1 ? 1 : w.images.length === 4 ? 2 : 3}, 1fr); gap:4px; margin-bottom:12px;">
              ${w.images.map(img => `
                <div style="aspect-ratio:1; border-radius:4px; overflow:hidden; background:#eee; display:flex; align-items:center; justify-content:center; color:#999; font-size:12px;">
                  ${img === 'E404' ? '图片占位' : `<img src="${img}" style="width:100%; height:100%; object-fit:cover;">`}
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `).join('')}
    </div>`,
});

// ==========================================
// 📱 3. 闲鱼 (Xianyu)
// ==========================================
VIEWS.xianyu = () => {
  const items = [
    { title: "【已大刀/可直拍】毛二双 吾个音480档，12-48，不包邮", price: "￥300", wants: 7, img: "linear-gradient(135deg, #ff9a9e, #fecfef)", tag: "包邮" },
    { title: "出穆思恩裸娃 捆6个", price: "￥201.21", wants: 7, img: "linear-gradient(135deg, #a1c4fd, #c2e9fb)", tag: "包邮" },
    { title: "SanDisk 128G 内存卡 全新未拆封", price: "￥89", wants: 12, img: "linear-gradient(135deg, #84fab0, #8fd3f4)", tag: "" },
    { title: "穆祉丞同款卫衣 九成新 仅试穿", price: "￥199", wants: 23, img: "linear-gradient(135deg, #fbc2eb, #a6c1ee)", tag: "" },
  ];

  return {
    html: `
    <div class="scroll" style="background:#f5f5f5; padding-bottom:20px;">
      <div style="padding:54px 16px 10px; background:#fff; display:flex; align-items:center; justify-content:space-between; font-size:18px; font-weight:700;">
        <span>首页</span> <span style="color:#666; font-size:16px; font-weight:400;">集市 <span style="font-size:10px; background:#ff3b30; color:#fff; padding:1px 4px; border-radius:4px;">更便宜</span></span> <span style="color:#666; font-size:16px; font-weight:400;">圈子</span> <span style="color:#666; font-size:16px; font-weight:400;">回收</span>
      </div>
      <div style="background:#fff; padding:0 16px 10px;">
        <div style="background:#f5f5f5; border-radius:20px; height:36px; display:flex; align-items:center; padding:0 12px; color:#999; font-size:14px;">
          <span style="margin-right:8px;">📷</span> 清扬面团 <span style="margin-left:auto;">🔍</span>
        </div>
      </div>
      <div style="background:#fff; padding:10px 0; display:flex; justify-content:space-around; text-align:center; font-size:12px; color:#666;">
        <div><div style="width:36px; height:36px; background:#ffd700; border-radius:12px; margin:0 auto 4px;"></div>吃喝玩乐</div>
        <div><div style="width:36px; height:36px; background:#4a90e2; border-radius:12px; margin:0 auto 4px;"></div>手机数码</div>
        <div><div style="width:36px; height:36px; background:#f5c84c; border-radius:12px; margin:0 auto 4px;"></div>上门回收</div>
        <div><div style="width:36px; height:36px; background:#5e5ce6; border-radius:12px; margin:0 auto 4px;"></div>租房</div>
        <div><div style="width:36px; height:36px; background:#fa5151; border-radius:12px; margin:0 auto 4px;"></div>领红包</div>
      </div>
      <div style="background:#fff; padding:10px 16px; display:flex; gap:20px; font-size:15px; color:#666; overflow-x:auto; border-bottom:0.5px solid #eee;">
        <span style="font-weight:700; color:#111;">关注</span>
        <span style="font-weight:700; color:#111;">推荐</span>
        <span>新发</span>
        <span>找服务</span>
        <span>价格指数</span>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; padding:8px;">
        ${items.map(item => `
          <div style="background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 1px 4px rgba(0,0,0,0.06); display:flex; flex-direction:column;">
            <div style="height:160px; background:${item.img}; display:flex; align-items:center; justify-content:center; color:#fff; font-size:12px; position:relative;">
               [ 商品图 ]
               ${item.tag ? `<span style="position:absolute; top:4px; left:4px; background:#ffe0b2; color:#e65100; font-size:10px; padding:2px 4px; border-radius:4px;">${item.tag}</span>` : ''}
            </div>
            <div style="padding:8px 10px; flex:1; display:flex; flex-direction:column;">
              <div style="font-size:13px; color:#333; font-weight:500; line-height:1.3; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; margin-bottom:6px;">
                ${esc(item.title)}
              </div>
              <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:auto;">
                <span style="color:#ff4400; font-size:17px; font-weight:700;">${item.price}</span>
                <span style="font-size:11px; color:#999;">${item.wants}人想要</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="tabbar">
      <button class="on" style="color:#ffb300;"><span style="font-size:24px;">🐟</span><small>闲鱼</small></button>
      <button><span style="font-size:24px;">📍</span><small>济宁</small></button>
      <button><span style="font-size:28px; background:#ffb300; color:#fff; width:48px; height:36px; border-radius:18px; display:grid; place-items:center;">📷</span><small>卖闲置</small></button>
      <button><span style="font-size:24px;">💬</span><small>消息</small></button>
      <button><span style="font-size:24px;">👤</span><small>我的</small></button>
    </div>`,
  };
};

// ==========================================
// 📱 4. 小红书 (XHS)
// ==========================================
VIEWS.xhs = () => {
  const notes = [
    { title: "【赠】送一张今晚19:30宁波天然舞台纳歌演出票…", author: "Casualidad", likes: "132", cover: "linear-gradient(135deg, #ff9a9e, #fecfef)", isVideo: false },
    { title: "朔朔店长", author: "no name", likes: "6", cover: "linear-gradient(135deg, #a1c4fd, #c2e9fb)", isVideo: true },
    { title: "表现不好的人能被喷成筛子", author: "star侃球", likes: "98", cover: "linear-gradient(135deg, #84fab0, #8fd3f4)", isVideo: false },
    { title: "令人心动的Offer程序员季", author: "可不可以不工作", likes: "1278", cover: "linear-gradient(135deg, #fbc2eb, #a6c1ee)", isVideo: true },
  ];

  return {
    html: `
    <div class="scroll" style="background:#fff; padding-bottom:20px; padding-top:80px;">
      <div style="position:fixed; top:44px; left:0; right:0; background:#fff; z-index:10; display:flex; justify-content:center; align-items:center; height:36px; gap:30px; font-size:16px; color:#666;">
        <span>关注</span>
        <span style="font-weight:700; color:#111; font-size:17px; position:relative;">发现<span style="position:absolute; bottom:-6px; left:50%; transform:translateX(-50%); width:16px; height:3px; background:#ff2442; border-radius:2px;"></span></span>
        <span>杭州</span>
      </div>
      <div style="display:flex; gap:20px; padding:10px 16px; overflow-x:auto; white-space:nowrap; font-size:14px; color:#666; border-bottom:0.5px solid #f0f0f0;">
        <span style="font-weight:600; color:#111;">推荐</span>
        <span>视频</span>
        <span>直播</span>
        <span>热点</span>
        <span>短剧</span>
        <span>明星</span>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; padding:10px;">
        ${notes.map(n => `
          <div style="display:flex; flex-direction:column;">
            <div style="height:200px; background:${n.cover}; border-radius:12px; margin-bottom:8px; display:flex; align-items:center; justify-content:center; color:#fff; position:relative;">
               ${n.isVideo ? `<div style="width:30px; height:30px; background:rgba(0,0,0,0.4); border-radius:50%; display:grid; place-items:center; font-size:14px;">▶</div>` : '[ 笔记 ]'}
            </div>
            <div style="font-size:14px; color:#333; font-weight:600; line-height:1.3; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; margin-bottom:6px;">
              ${esc(n.title)}
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:auto; font-size:12px; color:#666;">
              <div style="display:flex; align-items:center; gap:4px;">
                <div style="width:16px; height:16px; border-radius:50%; background:#ddd;"></div>
                <span>${esc(n.author)}</span>
              </div>
              <span style="color:#999;">♡ ${n.likes}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="tabbar" style="background:#fff; border-top:0.5px solid #eee;">
      <button style="color:#111;"><span style="font-size:24px;">🏠</span><small>首页</small></button>
      <button style="color:#111;"><span style="font-size:24px;">🛍️</span><small>市集</small></button>
      <button><span style="font-size:32px; color:#ff2442;">➕</span></button>
      <button style="color:#111;"><span style="font-size:24px;">💬</span><small>消息</small></button>
      <button style="color:#111;"><span style="font-size:24px;">👤</span><small>我</small></button>
    </div>`,
  };
};

// ==========================================
// 📱 5. B站 (Bilibili)
// ==========================================
VIEWS.bilibili = () => {
  const videos = [
    { title: "连出道首舞台都不行的根本不是帽女", up: "Jeninini_", views: "34.1万", danmu: "1539", time: "09:32", cover: "linear-gradient(135deg, #667eea, #764ba2)" },
    { title: "EP2：小猪背后看看左边看看，我们颜色咋不一样捏", up: "好眠_Aurora", views: "634", danmu: "2", time: "03:39", cover: "linear-gradient(135deg, #4facfe, #00f2fe)" },
    { title: "卡门：地区限定摄政王", up: "奇奇怪怪的英专生", views: "13.1万", danmu: "330", time: "05:14", cover: "linear-gradient(135deg, #f093fb, #f5576c)" },
    { title: "【大脑里的能量战争】越休息越累的原因找到", up: "脑洞大开", views: "78.1万", danmu: "168", time: "12:00", cover: "linear-gradient(135deg, #43e97b, #38f9d7)" },
  ];

  return {
    html: `
    <div class="scroll" style="background:#f4f4f4; padding-bottom:20px;">
      <div style="padding:54px 16px 10px; background:#fff; display:flex; align-items:center; gap:12px; position:sticky; top:0; z-index:10;">
        <div style="width:32px; height:32px; border-radius:50%; background:#ccc; flex:none;"></div>
        <div style="flex:1; background:#f4f4f4; border-radius:16px; height:32px; display:flex; align-items:center; padding:0 12px; font-size:14px; color:#666;">
          🔍 接二连珊妄想症
        </div>
        <div style="width:32px; height:32px; border-radius:50%; background:#ffb300; display:grid; place-items:center; flex:none;">📪</div>
      </div>
      <div style="background:#fff; padding:10px 16px; display:flex; gap:20px; font-size:15px; color:#666; overflow-x:auto; border-bottom:0.5px solid #eee;">
        <span>直播</span>
        <span style="font-weight:700; color:#111; position:relative;">推荐<span style="position:absolute; bottom:-6px; left:50%; transform:translateX(-50%); width:16px; height:3px; background:#fb7299; border-radius:2px;"></span></span>
        <span>热门</span>
        <span>动画</span>
        <span>影视</span>
      </div>
      <div style="padding:10px 8px;">
        <div style="height:200px; background:linear-gradient(45deg, #2b5876, #4e4376); border-radius:12px; position:relative; display:flex; align-items:flex-end; padding:12px;">
          <div style="font-size:18px; font-weight:700; color:#fff; text-shadow:0 1px 3px rgba(0,0,0,0.5);">3天2晚深入斐济赶海，只为挑战米级大马…</div>
          <div style="position:absolute; bottom:8px; right:8px; display:flex; gap:4px;">
            <span style="width:6px; height:6px; border-radius:50%; background:#fff;"></span>
            <span style="width:6px; height:6px; border-radius:50%; background:rgba(255,255,255,0.5);"></span>
            <span style="width:6px; height:6px; border-radius:50%; background:rgba(255,255,255,0.5);"></span>
          </div>
        </div>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; padding:0 8px;">
        ${videos.map(v => `
          <div style="background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.08);">
            <div style="height:110px; background:${v.cover}; position:relative;">
               <span style="position:absolute; bottom:4px; right:4px; background:rgba(0,0,0,0.5); color:#fff; padding:1px 4px; border-radius:3px; font-size:10px;">${v.time}</span>
            </div>
            <div style="padding:8px;">
              <div style="font-size:13px; color:#222; font-weight:600; line-height:1.3; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; margin-bottom:6px; height:34px;">
                ${esc(v.title)}
              </div>
              <div style="font-size:11px; color:#999; display:flex; justify-content:space-between; align-items:center;">
                <span>UP：${esc(v.up)}</span>
                <span>▶ ${v.views} 💬 ${v.danmu}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="tabbar" style="background:#fff; border-top:0.5px solid #eee;">
      <button style="color:#fb7299;"><span style="font-size:24px;">🏠</span><small>首页</small></button>
      <button style="color:#111;"><span style="font-size:24px;">🎯</span><small>关注</small></button>
      <button><span style="font-size:32px; background:#fb7299; color:#fff; width:44px; height:32px; border-radius:16px; display:grid; place-items:center; font-weight:300;">+</span></button>
      <button style="color:#111;"><span style="font-size:24px;">🛒</span><small>会员购</small></button>
      <button style="color:#111;"><span style="font-size:24px;">👤</span><small>我的</small></button>
    </div>`,
  };
};

// ==========================================
// 📱 6. 相册 (Photos)
// ==========================================
VIEWS.photos = () => {
  const photos = (typeof photoSections !== 'undefined' && photoSections.length > 0) 
    ? photoSections[0][1] : ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9"];

  window.openPhotoViewer = (url) => {
    const d = document.createElement("div");
    d.className = "viewer";
    d.style.cssText = "position:fixed; inset:0; z-index:99999; background:#000; display:flex; align-items:center; justify-content:center; flex-direction:column;";
    d.innerHTML = `
      <div style="position:absolute; top:50px; left:20px; color:#fff; font-size:30px; cursor:pointer;" onclick="this.parentElement.remove()">×</div>
      <div style="width:100%; height:80%; display:flex; align-items:center; justify-content:center; color:#fff;">
         ${url.length > 5 ? `<img src="${url}" style="max-width:100%; max-height:100%; object-fit:contain;">` : `<div style="font-size:20px; padding:40px; background:linear-gradient(45deg,#ff9a9e,#fecfef); border-radius:12px;">🎀 图片占位：${url}</div>`}
      </div>
      <div style="color:rgba(255,255,255,0.6); font-size:14px; margin-top:20px;">2026年11月15日</div>
    `;
    document.getElementById("screen").appendChild(d);
  };

  return {
    html: navHTML({ title: "照片", back: "主页", backFn: "closeApp()" }) + 
    `<div class="scroll" style="background:#fff; padding-bottom: 100px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin: 0 16px 10px;">
         <h1 class="lt" style="margin:0; font-size:28px;">最近项目</h1>
         <span style="color:#007aff; font-size:16px;">选择</span>
      </div>
      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:4px; padding:0 4px;">
        ${photos.map((p, i) => `
          <div style="aspect-ratio:1; background:#eee; overflow:hidden; cursor:pointer;" onclick="openPhotoViewer('${p}')">
             ${p.length > 5 ? `<img src="${p}" style="width:100%; height:100%; object-fit:cover;">` : `
               <div style="width:100%; height:100%; background:linear-gradient(45deg, hsl(${i*40},80%,80%), hsl(${i*40+20},80%,90%)); display:flex; align-items:center; justify-content:center; color:#fff; font-size:12px;">
                 [照片]
               </div>
             `}
          </div>
        `).join('')}
      </div>
      <h1 class="lt" style="margin: 24px 16px 10px; font-size:22px;">我的相簿</h1>
      <div style="padding:0 16px; display:flex; flex-direction:column; gap:12px;">
        <div style="display:flex; align-items:center; gap:16px;">
          <div style="width:80px; height:80px; border-radius:8px; background:linear-gradient(45deg, #a1c4fd, #c2e9fb); display:grid; place-items:center; color:#fff; font-size:12px;">封面</div>
          <div style="flex:1;">
            <div style="font-size:16px; font-weight:600; color:#111;">旧时光</div>
            <div style="font-size:13px; color:#888; margin-top:4px;">${photos.length} 个项目</div>
          </div>
          <div style="color:#999;">${G.chevR}</div>
        </div>
        
        <!-- 👇 改成了 push('privateAlbum') -->
        <div style="display:flex; align-items:center; gap:16px; cursor:pointer;" onclick="push('privateAlbum')">
          <div style="width:80px; height:80px; border-radius:8px; background:#3a3a3c; display:grid; place-items:center; color:#fff; font-size:24px;">🔒</div>
          <div style="flex:1;">
            <div style="font-size:16px; font-weight:600; color:#111;">私密相册</div>
            <div style="font-size:13px; color:#888; margin-top:4px;">已加密</div>
          </div>
          <div style="color:#999;">${G.chevR}</div>
        </div>

      </div>
    </div>`,
  };
};

// ==========================================
// 📱 7. 私密相册 (Private Album)
// ==========================================
let privateAlbumUnlocked = false;

VIEWS.privateAlbum = () => {
  const pics = (typeof CFG !== 'undefined' && CFG.privateAlbum) 
    ? CFG.privateAlbum 
    : [{ src: "p_secret1", label: "占位 · 剪影" }, { src: "p_secret2", label: "占位 · 舞台灯" }];
  
  const correctPassword = (typeof CFG !== 'undefined' && CFG.start?.privatePin) ? CFG.start.privatePin : "1116";

  window.checkPrivatePin = () => {
    const val = document.getElementById("private-pin-input").value;
    if (val === correctPassword) {
      privateAlbumUnlocked = true;
      show("privateAlbum");
    } else {
      vib([60, 40, 60]);
      const box = document.getElementById("private-pin-box");
      box.animate([{ transform: 'translateX(-10px)' }, { transform: 'translateX(10px)' }, { transform: 'translateX(0)' }], { duration: 300 });
      document.getElementById("private-pin-input").value = "";
    }
  };

  if (!privateAlbumUnlocked) {
    return {
      cls: "dark",
      html: navHTML({ title: "私密相册", back: "照片", backFn: "back()", solid: true }) + 
      `<div style="height:100vh; background:#000; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:0 40px; padding-bottom:100px;">
        <div style="width:80px; height:80px; background:#222; border-radius:20px; display:flex; align-items:center; justify-content:center; font-size:36px; margin-bottom:20px; box-shadow:0 10px 30px rgba(0,0,0,0.5);">🔒</div>
        <div style="color:#fff; font-size:20px; font-weight:600; margin-bottom:10px;">输入密码以查看</div>
        <div style="color:#888; font-size:14px; margin-bottom:30px; text-align:center;">请输入4位数字密码</div>
        <div id="private-pin-box" style="display:flex; gap:10px; margin-bottom:30px;">
          <input id="private-pin-input" type="password" maxlength="4" pattern="\\d*" inputmode="numeric" style="background:#222; border:1px solid #444; color:#fff; font-size:24px; width:160px; text-align:center; border-radius:12px; padding:10px; outline:none; letter-spacing:10px;">
        </div>
        <button onclick="checkPrivatePin()" style="background:#007aff; color:#fff; border:none; padding:12px 40px; border-radius:20px; font-size:16px; font-weight:600; width:100%;">解锁</button>
      </div>`,
    };
  }

  return {
    html: navHTML({ title: "私密相册", back: "照片", backFn: "back()" }) + 
    `<div class="scroll" style="background:#000; padding-bottom: 100px; min-height:100vh;">
      <div style="padding: 10px 16px; display:flex; justify-content:space-between; align-items:center;">
         <h1 class="lt" style="margin:0; color:#fff; font-size:24px;">私密照片</h1>
         <span style="color:#ff3b30; font-size:16px;" onclick="privateAlbumUnlocked=false; show('privateAlbum')">重新锁定</span>
      </div>
      <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:8px; padding:0 16px;">
        ${pics.map((p, i) => `
          <div style="aspect-ratio:3/4; background:#222; overflow:hidden; border-radius:10px; position:relative; cursor:pointer;" onclick="openPhotoViewer('${p.src}')">
             ${p.src.length > 5 ? `<img src="${p.src}" style="width:100%; height:100%; object-fit:cover;">` : `
               <div style="width:100%; height:100%; background:linear-gradient(135deg, #4a00e0, #8e2de2); display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff;">
                 <div style="font-size:12px; opacity:0.8;">${esc(p.label)}</div>
                 <div style="font-size:24px; margin-top:10px;">🔒</div>
               </div>
             `}
          </div>
        `).join('')}
      </div>
    </div>`,
  };
};

// ==========================================
// 📱 8. 基础占位 APP
// ==========================================
const placeholderView = (title) => () => ({
  html:
    navHTML({ title: title, back: "主页", backFn: "closeApp()" }) +
    `<div class="scroll" style="display:flex;align-items:center;justify-content:center;height:80vh;color:#8e8e93;font-size:15px">暂无内容</div>`,
});
VIEWS.instagram = placeholderView("Instagram");

// ==========================================
// 📱 邮件 (Mail) - 完美避开状态栏版
// ==========================================

// 👇 邮件数据预留位，你以后改内容只需要改这里
const emailData = [
  {
    id: 0,
    sender: "中延大学 教务管理组",
    initial: "中",
    subject: "2026学年第二学期 期中考试时间通知",
    preview: "特此通知期中考试时间及考场变更事项。",
    time: "昨天",
    unread: true,
    body: "您好，这里是中延大学 教务管理组。\n\n特此通知期中考试时间及考场变更事项。\n\n详情请参阅学校官网公告。\n如有疑问，请联系所在院系办公室。\n\n谢谢。\n中延大学 教务管理组"
  },
  {
    id: 1,
    sender: "김시현 教授",
    initial: "김",
    subject: "关于通识课发表资料的提交",
    preview: "请确认发表小组资料的提交期限。",
    time: "昨天",
    unread: true,
    body: "同学们好，\n\n关于本周通识课的小组发表资料，请务必在周五下午5点前提交到系统内。\n逾期将扣除平时分。\n\n김시현 教授"
  },
  {
    id: 2,
    sender: "Naver Pay",
    initial: "N",
    subject: "您订购的商品已发货",
    preview: "您订购的商品正在配送中。",
    time: "2026/10/15",
    unread: false,
    body: "您好，您在 Naver Pay 订购的商品已发货。\n\n快递单号：1234567890\n配送状态：正在派送中。"
  },
  {
    id: 3,
    sender: "中延大学 图书馆",
    initial: "中",
    subject: "图书归还提醒",
    preview: "特此通知您所借图书的归还日期。",
    time: "2026/10/12",
    unread: false,
    body: "读者您好，\n\n您所借阅的《现代文学史》将于11月20日到期，请及时归还以免产生滞纳金。"
  },
  {
    id: 4,
    sender: "MUSINSA",
    initial: "M",
    subject: "请确认您的订单",
    preview: "您的订单已成功提交。",
    time: "2026/10/10",
    unread: false,
    body: "您的订单已成功提交，我们将尽快为您发货。"
  }
];

let currentMailId = 0;

// ==========================================
// 邮件列表页
// ==========================================
VIEWS.mail = () => ({
  // 👈 使用系统自带的 navHTML
  html: navHTML({ title: "", back: "邮箱", backFn: "closeApp()", right: `<span style="color:#007aff;font-size:17px;cursor:pointer;">编辑</span>` }) +
  `<div class="scroll" style="padding-top:98px; padding-bottom:100px; background:#fff;">
    
    <h1 class="lt" style="font-size:36px; font-weight:700; margin: 10px 16px 16px;">收件箱</h1>
    
    <div class="srch" style="margin: 0 16px 16px;">${G.search}搜索</div>

    <div style="padding: 0 16px;">
      ${emailData.map(m => `
        <div onclick="openMailDetail(${m.id})" style="display:flex; align-items:flex-start; gap:8px; padding: 12px 0; border-bottom:0.5px solid #e5e5ea; cursor:pointer;">
          
          <!-- 未读蓝点 -->
          <div style="width:8px; flex:none; padding-top:6px;">
             ${m.unread ? `<div style="width:8px; height:8px; border-radius:50%; background:#007aff;"></div>` : ''}
          </div>
          
          <!-- 内容 -->
          <div style="flex:1; min-width:0;">
            <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:2px;">
              <span style="font-size:16px; font-weight:600; color:#111; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${esc(m.sender)}</span>
              <div style="display:flex; align-items:center; gap:6px; color:#8e8e93; font-size:14px; flex:none;">
                <span>${m.time}</span>
                <span style="color:#c4c4c7; font-size:16px;">›</span>
              </div>
            </div>
            <div style="font-size:15px; font-weight:500; color:#111; margin-bottom:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              ${esc(m.subject)}
            </div>
            <div style="font-size:14px; color:#8e8e93; line-height:1.3; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
              ${esc(m.preview)}
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  </div>

  <!-- 👈 使用系统自带底栏样式 -->
  <div class="toolbar" style="justify-content:space-between; padding: 10px 30px 34px;">
     <div style="color:#007aff; cursor:pointer;">
       <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none"/></svg>
     </div>
     <div style="font-size:13px; color:#8e8e93; font-weight:500; padding-top:4px;">刚刚更新</div>
     <div style="color:#007aff; cursor:pointer;">
       <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
     </div>
  </div>`,
});

// ==========================================
// 邮件详情页
// ==========================================
VIEWS.mail_detail = () => {
  const data = emailData.find(d => d.id === currentMailId);
  if (!data) return { html: "" };

  return {
    // 👈 同样使用系统自带导航
    html: navHTML({ title: "", back: "收件箱", backFn: "back()" }) +
    `<div class="scroll" style="padding-top:98px; padding-bottom:100px; background:#fff;">
      
      <!-- 发件人信息 -->
      <div style="display:flex; align-items:flex-start; padding: 16px; border-bottom:0.5px solid #e5e5ea;">
         <div style="width:44px; height:44px; border-radius:50%; background:#8e8e93; display:flex; align-items:center; justify-content:center; color:#fff; font-size:20px; font-weight:500; flex:none;">
           ${data.initial}
         </div>
         <div style="flex:1; margin-left:12px; min-width:0;">
            <div style="font-size:16px; font-weight:600; color:#111; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${esc(data.sender)}</div>
            <div style="font-size:13px; color:#8e8e93; margin-top:2px;">收件人：我 <span style="font-size:11px;">›</span></div>
         </div>
         <div style="font-size:14px; color:#8e8e93; flex:none; margin-left:8px; padding-top:4px;">
            ${data.time}
         </div>
      </div>

      <!-- 邮件正文 -->
      <div style="padding: 20px 16px;">
         <h2 style="font-size:20px; font-weight:700; margin: 0 0 16px 0; line-height:1.3;">${esc(data.subject)}</h2>
         <div style="font-size:16px; line-height:1.6; color:#333; white-space:pre-wrap;">${esc(data.body)}</div>
      </div>

    </div>

    <!-- 详情页底部 4 个操作按钮 -->
    <div class="toolbar" style="justify-content:space-around; padding: 10px 20px 34px;">
       <div style="color:#007aff; cursor:pointer;">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4.5h8V6M5.5 6l1 14h11l1-14"/></svg>
       </div>
       <div style="color:#007aff; cursor:pointer;">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
       </div>
       <div style="color:#007aff; cursor:pointer;">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 17H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4"/><path d="M9 15l7-7a2.121 2.121 0 0 1 3 3l-7 7-4 1 1-4z"/></svg>
       </div>
       <div style="color:#007aff; cursor:pointer;">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
       </div>
    </div>`,
  };
};

function openMailDetail(id) {
  const data = emailData.find(d => d.id === id);
  if (!data) return;
  data.unread = false; // 标记已读
  currentMailId = id;
  push('mail_detail');
}

// ==========================================
// 📱 天气 (Weather) - 北京 2026年11月15日 星期日
// ==========================================
VIEWS.weather = () => {
  // 小时预报 (契合故事开局 23:09 设定)
  const hours = [
    { t: "现在", icon: "moon", temp: "18°" },
    { t: "23时", icon: "moon", temp: "14°" },
    { t: "0时", icon: "moon", temp: "13°" },
    { t: "1时", icon: "moon", temp: "11°" },
    { t: "2时", icon: "moon", temp: "11°" },
    { t: "3时", icon: "moon", temp: "10°" },
    { t: "4时", icon: "moon", temp: "10°" },
  ];

  // 10天预报 (11月15日是周日，后面依次是周一、周二...)
  const daily = [
    { day: "今天", icon: "sun", min: 12, max: 21 }, 
    { day: "周一", icon: "cloud-sun", min: 11, max: 20 }, 
    { day: "周二", icon: "cloud", min: 10, max: 18 }, 
    { day: "周三", icon: "sun", min: 9, max: 19 }, 
    { day: "周四", icon: "sun", min: 10, max: 20 }, 
    { day: "周五", icon: "cloud-sun", min: 11, max: 19 }, 
    { day: "周六", icon: "cloud", min: 8, max: 15 }, 
    { day: "周日", icon: "sun", min: 7, max: 16 }, 
    { day: "周一", icon: "sun", min: 8, max: 17 }, 
    { day: "周二", icon: "cloud-sun", min: 9, max: 18 }, 
  ];

  // SVG 图标
  const Icons = {
    moon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="#fff"><path d="M15.5 3.5A8.5 8.5 0 1 0 20.5 15 7 7 0 0 1 15.5 3.5Z"/></svg>`,
    sun: `<svg viewBox="0 0 24 24" width="22" height="22" fill="#ffd60a"><circle cx="12" cy="12" r="5"/><g stroke="#ffd60a" stroke-width="2" stroke-linecap="round"><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></g></svg>`,
    cloud: `<svg viewBox="0 0 24 24" width="22" height="22" fill="#fff"><path d="M7 19h10.5a4 4 0 0 0 .4-8A5.6 5.6 0 0 0 7.2 9.2 5 5 0 0 0 7 19Z"/></svg>`,
    "cloud-sun": `<svg viewBox="0 0 24 24" width="22" height="22"><circle cx="8" cy="8" r="4" fill="#ffd60a"/><path d="M10 19h8.5a3.5 3.5 0 0 0 .3-7A5 5 0 0 0 10 12.5 4 4 0 0 0 10 19Z" fill="#fff"/></svg>`,
  };

  // 温度条位置计算
  const globalMin = 5;
  const globalMax = 25;
  const getBarStyle = (min, max) => {
    const left = ((min - globalMin) / (globalMax - globalMin)) * 100;
    const width = ((max - min) / (globalMax - globalMin)) * 100;
    return `left: ${left}%; width: ${width}%;`;
  };

  return {
    html: `
    <div style="position:absolute; inset:0; background:linear-gradient(180deg, #3d65d8 0%, #6495ed 50%, #3d65d8 100%); color:#fff; display:flex; flex-direction:column; overflow:hidden;">
      
      <!-- 顶部导航 (适配无灵动岛状态，高度上提) -->
      <div style="position:absolute; top:50px; left:16px; z-index:10; display:flex; align-items:center; gap:4px; font-size:15px; font-weight:500; cursor:pointer;" onclick="closeApp()">
        <svg viewBox="0 0 12 20" width="10" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2 2 10l8 8"/></svg> 主屏幕
      </div>

      <div class="scroll" style="flex:1; padding-top:85px; padding-bottom:100px; overflow-y:auto; scrollbar-width:none;">
        
        <!-- 顶部当前天气 -->
        <div style="text-align:center; margin-bottom:20px;">
          <div style="font-size:15px; font-weight:500; opacity:0.8; margin-bottom:2px;">我的位置</div>
          <div style="font-size:34px; font-weight:400; margin-bottom:0px;">北京</div>
          <div style="font-size:96px; font-weight:200; line-height:1; margin:0 0 4px -15px;">18°</div>
          <div style="font-size:20px; font-weight:500;">大部晴朗</div>
          <div style="font-size:16px; font-weight:500; opacity:0.9; margin-top:2px;">最高21° 最低12°</div>
        </div>

        <!-- 小时预报 -->
        <div style="background:rgba(255,255,255,0.15); border-radius:16px; margin:0 16px 16px; padding:14px 16px; backdrop-filter:blur(10px);">
          <div style="font-size:14px; font-weight:500; padding-bottom:10px; border-bottom:0.5px solid rgba(255,255,255,0.2); margin-bottom:10px;">
            预计整个下午大部晴朗。阵风风速最高 4 米/秒。
          </div>
          <div style="display:flex; gap:24px; overflow-x:auto; scrollbar-width:none;">
            ${hours.map((h, i) => `
              <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
                <div style="font-size:15px; font-weight:600;">${h.t}</div>
                ${Icons[h.icon]}
                <div style="font-size:17px; font-weight:600;">${h.temp}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 10天预报 -->
        <div style="background:rgba(255,255,255,0.15); border-radius:16px; margin:0 16px 16px; padding:14px 16px; backdrop-filter:blur(10px);">
          <div style="font-size:13px; font-weight:600; opacity:0.7; display:flex; align-items:center; gap:6px; padding-bottom:10px; border-bottom:0.5px solid rgba(255,255,255,0.2); margin-bottom:6px;">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg> 10 天天气预报
          </div>
          ${daily.map((d, i) => `
            <div style="display:flex; align-items:center; padding:10px 0; ${i > 0 ? 'border-top:0.5px solid rgba(255,255,255,0.15);' : ''}">
              <div style="width:50px; font-size:16px; font-weight:600;">${d.day}</div>
              <div style="width:40px; display:flex; justify-content:center;">${Icons[d.icon]}</div>
              <div style="width:35px; font-size:16px; font-weight:500; opacity:0.8; text-align:right;">${d.min}°</div>
              
              <div style="flex:1; height:4px; background:rgba(0,0,0,0.15); border-radius:2px; margin:0 12px; position:relative;">
                <div style="position:absolute; top:0; bottom:0; border-radius:2px; background:linear-gradient(90deg, #84fab0, #ffe259); ${getBarStyle(d.min, d.max)}"></div>
              </div>
              
              <div style="width:35px; font-size:16px; font-weight:500; text-align:right;">${d.max}°</div>
            </div>
          `).join('')}
        </div>

        <!-- 底部卡片 -->
        <div style="display:flex; gap:16px; margin:0 16px 20px;">
          <div style="flex:1; background:rgba(255,255,255,0.15); border-radius:16px; padding:14px; backdrop-filter:blur(10px);">
            <div style="font-size:13px; font-weight:600; opacity:0.7; padding-bottom:8px; border-bottom:0.5px solid rgba(255,255,255,0.2); margin-bottom:8px;">紫外线指数</div>
            <div style="font-size:28px; font-weight:600; line-height:1.1;">3</div>
            <div style="font-size:15px; font-weight:500;">中等</div>
          </div>
          <div style="flex:1; background:rgba(255,255,255,0.15); border-radius:16px; padding:14px; backdrop-filter:blur(10px);">
            <div style="font-size:13px; font-weight:600; opacity:0.7; padding-bottom:8px; border-bottom:0.5px solid rgba(255,255,255,0.2); margin-bottom:8px;">日落</div>
            <div style="font-size:28px; font-weight:600; line-height:1.1;">17:56</div>
            <div style="font-size:15px; font-weight:500;">日出: 6:39</div>
          </div>
        </div>

      </div>

      <!-- 底部导航 -->
      <div style="position:absolute; bottom:0; left:0; right:0; height:84px; background:rgba(255,255,255,0.15); backdrop-filter:blur(20px); display:flex; justify-content:space-between; align-items:center; padding:0 24px;">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fff" stroke-width="1.8"><path d="M9 20l-5.5 2.5V6L9 3.5M9 20l6-2.5M9 20V3.5M15 17.5l5.5 2.5V8L15 5.5M15 17.5V5.5"/></svg>
        <div style="display:flex; gap:8px;">
          <div style="width:8px; height:8px; border-radius:50%; background:#fff;"></div>
          <div style="width:8px; height:8px; border-radius:50%; background:rgba(255,255,255,0.4);"></div>
        </div>
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
      </div>

    </div>`
  };
};

VIEWS.settings = placeholderView("设置");
VIEWS.maps = placeholderView("地图");
VIEWS.music = placeholderView("音乐");
VIEWS.safari = placeholderView("Safari");

VIEWS.recorder = () => ({
  html: navHTML({ title: "录音", back: "主页", backFn: "closeApp()" }) +
    `<div class="scroll" style="background:#f9f9f9; padding-bottom:120px;">
      <h1 class="lt" style="margin-top:10px;">所有录音</h1>
      <div style="margin:0 16px;">
        ${["小恩恩唱歌|0:13|11月15日", "玻璃弹唱|0:21|11月14日", "🎧 穆祉丞动静|0:08|11月13日", "练习室环境音|1:05|11月10日"].map(r => { const [title, time, date] = r.split("|"); return `
          <div style="background:#fff; border-radius:12px; padding:14px 16px; margin-bottom:10px; display:flex; align-items:center; justify-content:space-between; box-shadow:0 1px 3px rgba(0,0,0,0.04);">
            <div>
              <div style="font-size:16px; font-weight:600; color:#111; margin-bottom:4px;">${esc(title)}</div>
              <div style="font-size:13px; color:#888;">${date}</div>
            </div>
            <div style="display:flex; align-items:center; gap:12px;">
              <span style="font-size:15px; color:#666; font-variant-numeric:tabular-nums;">${time}</span>
              <button style="width:36px; height:36px; border-radius:50%; background:#ff3b30; color:#fff; display:grid; place-items:center; border:none;">▶</button>
            </div>
          </div>
        `}).join('')}
      </div>
    </div>
    <div style="position:absolute; bottom:40px; left:50%; transform:translateX(-50%);">
      <button style="width:72px; height:72px; border-radius:50%; background:#ff3b30; color:#fff; border:4px solid #fff; box-shadow:0 4px 20px rgba(255,59,48,0.4); font-size:28px; display:grid; place-items:center;">🎙️</button>
    </div>`,
});

// ==========================================
// 📱 9. 微信的发现页、通讯录、我
// ==========================================
VIEWS.wx_discover = () => {
  const icPengyouquan = `<svg viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="11" fill="#41b883"/><circle cx="12" cy="12" r="4" fill="#fff"/><path d="M12 1a11 11 0 0 1 9.5 5.5H12V1z" fill="#ffd200"/><path d="M22 13a11 11 0 0 1-6 9.5V13h6z" fill="#e96923"/><path d="M12 23A11 11 0 0 1 2.5 17.5H12V23z" fill="#2b9ded"/></svg>`;
  const icShipinhao = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fa9d3b" stroke-width="2"><path d="M4 8c4-4 12-4 16 0M4 16c4 4 12 4 16 0"/><circle cx="8" cy="8" r="2" fill="#fa9d3b"/><circle cx="16" cy="16" r="2" fill="#fa9d3b"/></svg>`;
  const icZhibo = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fa5151" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="#fa5151"/></svg>`;
  const icSaoyisao = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#4a90e2" stroke-width="2"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/><path d="M3 12h18"/></svg>`;
  const icTingyiting = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fa5151" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`;
  const icKanyikan = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#f5c84c" stroke-width="2"><path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/></svg>`;
  const icSouyisou = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fa5151" stroke-width="2"><path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M5 19l4-4M15 9l4-4"/></svg>`;
  const icFujin = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#4a90e2" stroke-width="2"><circle cx="9" cy="8" r="3"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><circle cx="17" cy="10" r="2"/><path d="M17 15a3 3 0 0 1 3 3v3"/></svg>`;
  const icYouxi = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke-width="2"><polygon points="12,2 22,8 22,16 12,22 2,16 2,8" fill="#a2e6ff" stroke="#4a90e2"/><polygon points="12,2 22,8 12,12 2,8" fill="#ffd200" stroke="#e9a623"/><polygon points="12,12 22,8 22,16 12,22" fill="#fa5151" stroke="#c73b3b"/></svg>`;
  const icXiaochengxu = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#8c65e3" stroke-width="2"><path d="M18 6a8 8 0 0 0-11.3 0M6 18a8 8 0 0 0 11.3 0"/><circle cx="12" cy="12" r="3"/></svg>`;
  const svgSearch = `<svg viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>`;
  const svgPlus = `<svg viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>`;

  const row = (icon, text, isLast = false) => `
    <div class="row tap" style="min-height:56px; padding:0 16px; position:relative; display:flex; align-items:center; background:#fff; width:100%; text-align:left; border:none;">
      <div style="width:24px; height:24px; display:flex; justify-content:center; align-items:center; margin-right:16px; flex:none;">${icon}</div>
      <div style="flex:1; font-size:16px; color:#111;">${text}</div>
      <div style="width:16px; display:flex; justify-content:flex-end;">${G.chevR}</div>
      ${!isLast ? `<div style="position:absolute; bottom:0; left:56px; right:0; height:.5px; background:#e5e5ea;"></div>` : ''}
    </div>
  `;

  return {
    cls: "wx-list",
    html: `
    <div class="wx-head" style="display:grid; grid-template-columns:1fr auto 1fr; align-items:center; height:88px; padding:44px 18px 0; background:#ededed; padding-bottom:8px;">
        <div></div><h1 style="font-size:18px; font-weight:500; color:#000; margin:0; text-align:center;">发现</h1>
        <div class="wx-actions" style="display:flex; gap:18px; justify-self:end; align-items:center;">${svgSearch}${svgPlus}</div>
    </div>
    <div class="wx-scroll" style="background:#ededed;">
        <div style="background:#fff; margin-top:8px;">${row(icPengyouquan, "朋友圈", true)}</div>
        <div style="background:#fff; margin-top:8px;">${row(icShipinhao, "视频号")}${row(icZhibo, "直播", true)}</div>
        <div style="background:#fff; margin-top:8px;">${row(icSaoyisao, "扫一扫")}${row(icTingyiting, "听一听", true)}</div>
        <div style="background:#fff; margin-top:8px;">${row(icKanyikan, "看一看")}${row(icSouyisou, "搜一搜", true)}</div>
        <div style="background:#fff; margin-top:8px;">${row(icFujin, "附近的人", true)}</div>
        <div style="background:#fff; margin-top:8px;">${row(icYouxi, "游戏", true)}</div>
        <div style="background:#fff; margin-top:8px; margin-bottom:20px;">${row(icXiaochengxu, "小程序", true)}</div>
    </div>
    <div class="wx-tabbar">
        <button onclick="back()"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 4C7 4 3 7.1 3 11c0 2.4 1.5 4.5 3.9 5.8L6 20.5l4-2.4c.6.1 1.3.1 2 .1 5 0 9-3.1 9-7.1S17 4 12 4Z"/></svg></span><small>微信</small></button>
        <button><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg></span><small>通讯录</small></button>
        <button class="on" onclick="push('wx_discover')"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5Z"/></svg></span><small>发现</small></button>
        <button><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="7" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg><span class="wx-badge" style="top:-4px;right:-8px;">1</span></span><small>我</small></button>
    </div>`,
  };
};

VIEWS.wx_contacts = () => ({
  cls: "wx-list",
  html: `
  <div class="wx-head"><h1>通讯录</h1><div class="wx-actions"></div></div>
  <div class="wx-scroll" style="padding-top: 10px;">
      ${chatNames.map(n => `<div class="wx-item"><div class="wx-av">${avatarFor(n)}</div><div class="wx-info"><div class="wx-name">${esc(dn(n))}</div></div></div>`).join('')}
  </div>
  <div class="wx-tabbar">
      <button onclick="back()"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 4C7 4 3 7.1 3 11c0 2.4 1.5 4.5 3.9 5.8L6 20.5l4-2.4c.6.1 1.3.1 2 .1 5 0 9-3.1 9-7.1S17 4 12 4Z"/></svg></span><small>微信</small></button>
      <button class="on" onclick="push('wx_contacts')"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg></span><small>通讯录</small></button>
      <button onclick="push('wx_discover')"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5Z"/></svg></span><small>发现</small></button>
      <button onclick="push('wx_me')"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="7" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg></span><small>我</small></button>
  </div>`,
});

VIEWS.wx_me = () => ({
  cls: "wx-list",
  html: `
  <div class="wx-head"><h1>我</h1><div class="wx-actions"></div></div>
  <div class="wx-scroll" style="padding-top: 20px;">
      <div class="wx-item" style="background:#fff; margin-bottom:10px; padding:20px 16px;">
          <div class="wx-av" style="width:64px;height:64px;">${CFG.myAvatar ? `<img src="${CFG.myAvatar}" style="width:100%;height:100%;border-radius:6px;object-fit:cover;">` : G.sil}</div>
          <div class="wx-info" style="margin-left:12px;">
              <div class="wx-name" style="font-size:20px; font-weight:600;">我</div>
              <div class="wx-msg" style="margin-top:6px;">微信号：wan_wan</div>
          </div>
      </div>
      <div class="wx-item" style="background:#fff;"><div class="wx-info"><div class="wx-name">收藏</div></div></div>
      <div class="wx-item" style="background:#fff;"><div class="wx-info"><div class="wx-name">朋友圈</div></div></div>
      <div class="wx-item" style="background:#fff;"><div class="wx-info"><div class="wx-name">卡包</div></div></div>
      <div class="wx-item" style="background:#fff;"><div class="wx-info"><div class="wx-name">表情</div></div></div>
      <div class="wx-item" style="background:#fff; margin-top:10px;"><div class="wx-info"><div class="wx-name">设置</div></div></div>
  </div>
  <div class="wx-tabbar">
      <button onclick="back()"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 4C7 4 3 7.1 3 11c0 2.4 1.5 4.5 3.9 5.8L6 20.5l4-2.4c.6.1 1.3.1 2 .1 5 0 9-3.1 9-7.1S17 4 12 4Z"/></svg></span><small>微信</small></button>
      <button onclick="push('wx_contacts')"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg></span><small>通讯录</small></button>
      <button onclick="push('wx_discover')"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5Z"/></svg></span><small>发现</small></button>
      <button class="on" onclick="push('wx_me')"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="7" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg></span><small>我</small></button>
  </div>`,
});