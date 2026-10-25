// ==========================================
// 📱 闲鱼模块 (app_xianyu.js) - 完美滑动无滚动条版
// ==========================================

const getMyXyAvatar = () =>
  typeof CFG !== "undefined" && CFG.myAvatar
    ? `<img src="${CFG.myAvatar}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`
    : `<div style="width:100%; height:100%; border-radius:50%; background:#eee; display:grid; place-items:center; font-size:24px;">团</div>`;

const XY_ITEMS = [
  {
    title: "标价无捆直出卡比恩",
    price: "101",
    wants: 2,
    tag: "包邮",
    time: "48小时内发布",
    seller: "狗塑钟...",
    credit: "极好",
    img: "linear-gradient(135deg, #fdfbfb, #ebedee)",
    cover: "🐱",
  },
  {
    title: "六神满赠面团擦手巾 感兴趣的话点“我想要”",
    price: "20",
    wants: 12,
    tag: "包邮",
    time: "",
    seller: "红油金...",
    credit: "极好",
    img: "linear-gradient(135deg, #e0c3fc, #8ec5fc)",
    cover: "🐈‍⬛",
  },
  {
    title: "好价盘出胖蛋裸娃",
    price: "199",
    wants: 23,
    tag: "包邮",
    time: "距离拍卖结束 1天14时30分",
    seller: "养金鱼...",
    credit: "极好",
    img: "linear-gradient(135deg, #fbc2eb, #a6c1ee)",
    cover: "🐧",
  },
  {
    title: "全新未拆 娃衣 适合20cm",
    price: "45",
    wants: 8,
    tag: "包邮",
    time: "",
    seller: "棉花糖...",
    credit: "极好",
    img: "linear-gradient(135deg, #a1c4fd, #c2e9fb)",
    cover: "🧸",
  },
];

const XY_BOUGHT = [
  {
    name: "zrzp穆恩恩",
    price: "120.72",
    seller: "苏茶恬",
    avatar: "🐱",
    img: "https://picsum.photos/100/100?random=1",
  },
  {
    name: "小卡",
    price: "11.16",
    seller: "千点正事吧",
    avatar: "👧",
    img: "https://picsum.photos/100/100?random=2",
  },
  {
    name: "场周无卡全fys",
    price: "11.16",
    seller: "榕城冥想的芝士",
    avatar: "🧀",
    img: "https://picsum.photos/100/100?random=3",
  },
  {
    name: "PUROO 10x25 反保罗双筒望远镜 黑色",
    price: "70.00",
    seller: "西北率直的格陵...",
    avatar: "🧑‍🦱",
    img: "https://picsum.photos/100/100?random=4",
  },
];

const XY_SOLD = [
  {
    name: "【可直拍/非偏包邮】两瓶未拆六神香氛洗手液全新官方旗舰店...",
    price: "30.00",
    buyer: "小棉花养殖户",
    avatar: "🐻",
    img: "https://picsum.photos/100/100?random=5",
  },
  {
    name: "除蛋壳抱枕外全套周边+洗手液一瓶+沐浴露左边两瓶",
    price: "90.00",
    buyer: "养金鱼晒太阳",
    avatar: "🐟",
    img: "https://picsum.photos/100/100?random=6",
  },
  {
    name: "【标价包邮可直拍】穆祉丞六神面团擦手巾+行李牌满赠 非偏...",
    price: "25.00",
    buyer: "竹霁问玉",
    avatar: "🌿",
    img: "https://picsum.photos/100/100?random=7",
  },
];

let xyOrderTab = "bought";

// ---------- 1. 首页 ----------
VIEWS.xianyu = () => ({
  html: `
  <div style="position:absolute; inset:0; background:#f5f5f5;">
    
    <!-- 顶部固定区 -->
    <div style="position:absolute; top:0; left:0; right:0; z-index:20; background:#fff; padding-top:54px;">
      <div style="padding:0 16px 10px; display:flex; align-items:center; justify-content:space-between; font-size:18px; font-weight:700;">
        <div style="display:flex; gap:16px; align-items:baseline;">
          <span style="font-size:20px; border-bottom:2px solid #111; padding-bottom:2px;">首页</span>
          <span onclick="toastDev()" style="color:#666; font-size:16px; font-weight:400;">集市 <span style="font-size:10px; background:#ff3b30; color:#fff; padding:1px 4px; border-radius:4px; vertical-align:middle;">更便宜</span></span> 
          <span onclick="toastDev()" style="color:#666; font-size:16px; font-weight:400;">圈子</span> 
          <span onclick="toastDev()" style="color:#666; font-size:16px; font-weight:400;">回收</span>
        </div>
        <div onclick="toastDev()" style="display:flex; gap:8px; align-items:center;">
          <div style="font-size:12px; color:#ff5000; border:1px solid #ff5000; border-radius:10px; padding:2px 6px;">签到</div>
        </div>
      </div>

      <div style="padding:0 16px 12px; display:flex; align-items:center; gap:8px;">
        <div onclick="toastDev()" style="flex:1; background:#f5f5f5; border:1px solid #eee; border-radius:20px; height:36px; display:flex; align-items:center; padding:0 12px;">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px;"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <span style="color:#333; font-size:15px; font-weight:500;">穆祉丞 蛋壳</span>
          <span style="margin-left:auto; color:#999; font-size:18px;">📷</span>
        </div>
        <div onclick="toastDev()" style="width:56px; height:36px; background:#111; border-radius:18px; display:grid; place-items:center; color:#fff; font-size:18px;">🔍</div>
      </div>

      <div style="padding:10px 16px; display:flex; gap:20px; font-size:16px; color:#333; border-bottom:0.5px solid #eee;">
        <span onclick="toastDev()">关注</span>
        <span style="font-weight:700;">推荐</span>
        <span onclick="toastDev()">新发</span>
        <span onclick="toastDev()">找服务</span>
        <span onclick="toastDev()" style="color:#999;">价格指数</span>
      </div>
    </div>

    <!-- 👇 核心修改：加上 class="scroll"，覆盖默认 padding-top，彻底隐藏滚动条 -->
    <div class="scroll" style="position:absolute; top:176px; bottom:0; left:0; right:0; padding-top:0; padding-bottom:80px;">
      
      <div style="background:#fff; padding:12px 0; display:flex; justify-content:space-around; text-align:center; font-size:12px; color:#333; border-bottom:8px solid #f5f5f5;">
        <div onclick="toastDev()"><div style="font-size:28px; margin-bottom:4px;">🍔</div>吃喝玩乐</div>
        <div onclick="toastDev()"><div style="font-size:28px; margin-bottom:4px;">📱</div>手机数码</div>
        <div onclick="toastDev()"><div style="font-size:28px; margin-bottom:4px;">♻️</div>上门回收</div>
        <div onclick="toastDev()"><div style="font-size:28px; margin-bottom:4px;">🧰</div>找活儿</div>
        <div onclick="toastDev()"><div style="font-size:28px; margin-bottom:4px;">🧧</div>领红包</div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; padding:8px;">
        ${XY_ITEMS.map(
          (item) => `
          <div onclick="toastDev()" style="background:#fff; border-radius:10px; overflow:hidden; display:flex; flex-direction:column;">
            <div style="height:180px; background:${item.img}; display:grid; place-items:center; font-size:60px; position:relative;">
              ${item.cover}
              ${item.time ? `<div style="position:absolute; bottom:0; left:0; right:0; background:rgba(255,220,0,0.9); color:#333; font-size:11px; padding:4px 6px;">${item.time}</div>` : ""}
            </div>
            <div style="padding:8px; flex:1; display:flex; flex-direction:column;">
              <div style="font-size:14px; color:#333; line-height:1.4; margin-bottom:6px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
                <span style="background:#ffda00; color:#111; font-size:11px; font-weight:700; padding:1px 4px; border-radius:4px; margin-right:4px; vertical-align:middle;">${item.tag}</span>
                ${esc(item.title)}
              </div>
              <div style="display:flex; align-items:baseline; margin-top:auto;">
                <span style="color:#ff3b30; font-size:12px; font-weight:700;">¥</span>
                <span style="color:#ff3b30; font-size:20px; font-weight:700; margin-right:6px;">${item.price}</span>
                <span style="color:#999; font-size:11px;">${item.wants}人想要</span>
              </div>
              <div style="display:flex; align-items:center; gap:4px; margin-top:8px;">
                <div style="width:16px; height:16px; border-radius:50%; background:#eee; display:grid; place-items:center; font-size:10px;">🐶</div>
                <span style="font-size:11px; color:#999; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:60px;">${item.seller}</span>
                <span style="font-size:9px; color:#ff8c00; background:#fff4e6; padding:1px 4px; border-radius:4px;">卖家信用${item.credit}</span>
              </div>
            </div>
          </div>
        `,
        ).join("")}
      </div>
    </div>
  </div>

  <!-- 底部 Tabbar -->
  <div class="tabbar" style="position:absolute; bottom:0; left:0; right:0; z-index:20; background:#fff; border-top:0.5px solid #eee; height:60px; padding-bottom:20px;">
    <button class="on" style="color:#111;"><span style="font-size:24px;">🐟</span><small style="font-weight:600;">闲鱼</small></button>
    <button onclick="toastDev()" style="color:#666;"><span style="font-size:24px;">📍</span><small>重庆</small></button>
    <div style="position:relative; top:-15px;">
      <button style="width:64px; height:48px; background:#ffda00; border-radius:24px; border:4px solid #fff; display:grid; place-items:center; box-shadow:0 2px 8px rgba(0,0,0,0.1);" onclick="toastDev()">
        <span style="font-size:24px;">📷</span>
      </button>
      <div style="font-size:11px; color:#666; text-align:center; margin-top:2px;">卖闲置</div>
    </div>
    <button onclick="toastDev()" style="color:#666;"><span style="font-size:24px;">💬</span><small>消息</small></button>
    <button onclick="show('xianyu_me')" style="color:#666;"><span style="font-size:24px;">👤</span><small>我的</small></button>
  </div>`,
});

// ---------- 2. 我的 ----------
VIEWS.xianyu_me = () => ({
  html: `
  <div style="position:absolute; inset:0; background:#f5f5f5;">
    
    <!-- 👇 核心修改：加上 class="scroll" 隐藏滚动条 -->
    <div class="scroll" style="position:absolute; top:54px; bottom:60px; left:0; right:0; padding-top:0; padding-bottom:20px;">
      
      <div style="display:flex; align-items:center; justify-content:space-between; padding:16px 16px 20px; background:#f5f5f5;">
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="width:64px; height:64px; border-radius:50%; overflow:hidden; border:2px solid #fff; box-shadow:0 1px 4px rgba(0,0,0,0.1);">
            ${getMyXyAvatar()}
          </div>
          <div>
            <div style="font-size:22px; font-weight:700; display:flex; align-items:center; gap:4px; color:#111;">
              团 <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
            <div onclick="toastDev()" style="display:inline-block; background:#fff; border-radius:12px; padding:3px 10px; font-size:12px; color:#666; margin-top:6px; border:0.5px solid #eee;">
              鱼力值 789
            </div>
          </div>
        </div>
        <div style="display:flex; gap:20px; color:#333; font-size:12px; text-align:center;">
          <div onclick="toastDev()" style="display:flex; flex-direction:column; align-items:center; gap:4px;">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg>
            帮助与客服
          </div>
          <div onclick="toastDev()" style="display:flex; flex-direction:column; align-items:center; gap:4px;">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            设置
          </div>
        </div>
      </div>

      <div onclick="toastDev()" style="margin:0 12px; background:linear-gradient(90deg, #ffe4e6, #ffc2d1); border-radius:16px; padding:16px 20px; position:relative; overflow:hidden; height:110px;">
        <div style="font-size:24px; font-weight:900; color:#111; letter-spacing:1px;">闲鱼会员X7</div>
        <div style="font-size:13px; color:#333; margin-top:8px; display:flex; align-items:center; gap:8px;">
          哆啦A梦皮肤上新 
          <span style="background:#111; color:#fff; padding:3px 10px; border-radius:12px; font-size:11px;">去查看</span>
        </div>
        <div style="position:absolute; right:10px; bottom:-10px; font-size:80px; opacity:0.8;">🧚‍♀️</div>
      </div>

      <div style="margin:12px 12px 0; background:#fff; border-radius:12px; display:flex; padding:20px 0;">
        <div onclick="toastDev()" style="flex:1; text-align:center;"><div style="font-size:24px; font-weight:800; color:#111;">200</div><div style="font-size:13px; color:#666; margin-top:4px;">我的收藏</div></div>
        <div onclick="toastDev()" style="flex:1; text-align:center;"><div style="font-size:24px; font-weight:800; color:#111;">7</div><div style="font-size:13px; color:#666; margin-top:4px;">历史浏览</div></div>
        <div onclick="toastDev()" style="flex:1; text-align:center;"><div style="font-size:24px; font-weight:800; color:#111;">111</div><div style="font-size:13px; color:#666; margin-top:4px;">我的关注</div></div>
        <div onclick="toastDev()" style="flex:1; text-align:center;"><div style="font-size:24px; font-weight:800; color:#111;">6</div><div style="font-size:13px; color:#666; margin-top:4px;">红包卡券</div></div>
      </div>

      <div style="margin:12px 12px 0; background:#fff; border-radius:12px; padding:16px;">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:20px;">
          <div style="display:flex; align-items:baseline; gap:8px;">
            <span style="font-size:18px; font-weight:700; color:#111;">我的交易</span>
            <span style="font-size:12px; color:#999;">在闲鱼赚了 9827.07元</span>
          </div>
          <div onclick="toastDev()" style="background:#fff8e6; color:#ff5000; padding:5px 10px; border-radius:16px; font-size:12px; font-weight:600;">今日擦亮 曝光+5 ></div>
        </div>

        <div style="display:flex; justify-content:space-around; text-align:center;">
          <div onclick="toastDev()" style="display:flex; flex-direction:column; align-items:center; gap:8px; cursor:pointer;">
            <div style="position:relative;">
              <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#111" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M16 6l-4-4-4 4"/><path d="M9 14s1.5 2 3 2 3-2 3-2"/></svg>
              <span style="position:absolute; bottom:-2px; right:-4px; font-size:11px; font-weight:700; background:#fff;">0</span>
            </div>
            <span style="font-size:13px; color:#111;">我发布的</span>
          </div>

          <div onclick="xyOrderTab='sold'; push('xianyu_orders')" style="display:flex; flex-direction:column; align-items:center; gap:8px; cursor:pointer;">
            <div style="position:relative;">
              <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#111" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/></svg>
              <span style="position:absolute; bottom:2px; right:0; left:0; text-align:center; font-size:11px; font-weight:700;">¥</span>
              <span style="position:absolute; bottom:-2px; right:-8px; font-size:11px; font-weight:700; background:#fff;">3</span>
            </div>
            <span style="font-size:13px; color:#111;">我卖出的</span>
          </div>

          <div onclick="xyOrderTab='bought'; push('xianyu_orders')" style="display:flex; flex-direction:column; align-items:center; gap:8px; cursor:pointer;">
            <div style="position:relative;">
              <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#111" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="4"/><path d="M7 10h10M7 14h6"/></svg>
              <span style="position:absolute; bottom:-2px; right:-4px; font-size:11px; font-weight:700; background:#fff;">4</span>
            </div>
            <span style="font-size:13px; color:#111;">我买到的</span>
          </div>

          <div onclick="toastDev()" style="display:flex; flex-direction:column; align-items:center; gap:8px; cursor:pointer;">
            <div style="width:36px; height:36px; border-radius:50%; border:1.8px solid #111; display:flex; align-items:center; justify-content:center; font-size:18px; font-weight:700; color:#111; font-family:sans-serif;">淘</div>
            <span style="font-size:13px; color:#111;">我可卖的</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="tabbar" style="position:absolute; bottom:0; left:0; right:0; z-index:20; background:#fff; border-top:0.5px solid #eee; height:60px; padding-bottom:20px;">
    <button onclick="show('xianyu')" style="color:#666;"><span style="font-size:24px;">🐟</span><small>闲鱼</small></button>
    <button onclick="toastDev()" style="color:#666;"><span style="font-size:24px;">📍</span><small>重庆</small></button>
    <div style="position:relative; top:-15px;">
      <button onclick="toastDev()" style="width:64px; height:48px; background:#ffda00; border-radius:24px; border:4px solid #fff; display:grid; place-items:center; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
        <span style="font-size:24px;">📷</span>
      </button>
      <div style="font-size:11px; color:#666; text-align:center; margin-top:2px;">卖闲置</div>
    </div>
    <button onclick="toastDev()" style="color:#666;"><span style="font-size:24px;">💬</span><small>消息</small></button>
    <button class="on" style="color:#111;"><span style="font-size:24px;">👤</span><small style="font-weight:600;">我的</small></button>
  </div>`,
});

// ---------- 3. 订单列表 ----------
VIEWS.xianyu_orders = () => {
  const isBought = xyOrderTab === "bought";
  const data = isBought ? XY_BOUGHT : XY_SOLD;

  return {
    html: `<div style="position:absolute; inset:0; background:#f5f5f5;">
      
      <div style="position:absolute; top:0; left:0; right:0; z-index:10; background:#fff; border-bottom:0.5px solid #eee;">
        <div style="padding:54px 16px 10px; display:flex; align-items:center; justify-content:space-between;">
          <button onclick="show('xianyu_me')" style="font-size:24px; color:#333; padding:0 10px; border:none; background:none; cursor:pointer;">‹</button>
          <div onclick="toastDev()" style="flex:1; background:#f5f5f5; border-radius:16px; height:32px; display:flex; align-items:center; padding:0 12px; color:#999; font-size:14px; gap:6px; margin:0 10px;">
            🔍 ${isBought ? "搜索买过的宝贝" : "搜索卖出的宝贝"}
          </div>
          <div style="display:flex; gap:12px; color:#333; font-size:14px;">
            ${isBought ? '<span onclick="toastDev()">其他订单</span><span onclick="toastDev()">筛选</span>' : '<span onclick="toastDev()">账单</span><span onclick="toastDev()">筛选</span><span onclick="toastDev()">管理</span>'}
          </div>
        </div>

        <div style="display:flex; padding:12px 16px; gap:24px; font-size:15px; color:#333; overflow-x:auto; white-space:nowrap;">
          <span style="font-weight:700; position:relative;">全部<span style="position:absolute; bottom:-4px; left:0; right:0; height:3px; background:#ffda00;"></span></span>
          <span onclick="toastDev()">待付款</span>
          <span onclick="toastDev()">待发货</span>
          <span onclick="toastDev()">待收货</span>
          <span onclick="toastDev()">待评价</span>
          <span onclick="toastDev()">退款中</span>
        </div>
      </div>

      <!-- 👇 核心修改：加上 class="scroll" 隐藏滚动条 -->
      <div class="scroll" style="position:absolute; top:145px; bottom:0; left:0; right:0; padding-top:0; padding-bottom:20px;">
        ${data
          .map(
            (d, i) => `
          <div style="background:#fff; margin-top:10px; padding:16px;">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
              <div style="display:flex; align-items:center; gap:8px;">
                <div style="width:24px; height:24px; border-radius:50%; background:#eee; display:grid; place-items:center; font-size:12px;">${d.avatar}</div>
                <span style="font-size:14px; font-weight:600; color:#333;">${isBought ? d.seller : d.buyer}</span>
              </div>
              <span style="font-size:14px; color:#ff8c00;">交易成功</span>
            </div>

            <div style="display:flex; gap:12px;">
              <img src="${d.img}" style="width:80px; height:80px; border-radius:8px; object-fit:cover; background:#f5f5f5;">
              <div style="flex:1; display:flex; flex-direction:column; justify-content:space-between;">
                <div style="font-size:14px; color:#333; line-height:1.4; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${esc(d.name)}</div>
                <div style="text-align:right;">
                  <span style="font-size:12px; color:#333; font-weight:700;">¥</span>
                  <span style="font-size:18px; color:#333; font-weight:700;">${d.price}</span>
                </div>
              </div>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px;">
              <span onclick="toastDev()" style="font-size:13px; color:#999;">更多</span>
              <div style="display:flex; gap:8px;">
                ${!isBought ? `<span onclick="toastDev()" style="font-size:13px; color:#333; border:1px solid #ddd; border-radius:16px; padding:4px 12px;">🌸 求小红花</span>` : ""}
                <span onclick="toastDev()" style="font-size:13px; color:#333; border:1px solid #ddd; border-radius:16px; padding:4px 12px;">${isBought ? "联系卖家" : "联系买家"}</span>
                <span onclick="toastDev()" style="font-size:13px; color:#111; background:#ffda00; border-radius:16px; padding:4px 12px; font-weight:600;">查看评价</span>
              </div>
            </div>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>`,
  };
};
