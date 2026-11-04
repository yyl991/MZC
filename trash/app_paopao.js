// ==========================================
// 📱 TF家族泡泡模块 (app_paopao.js)
// ==========================================

// 全局状态
window.paopaoState = {
  selectedMember: null,
  msgCount: 0,
  maxMsg: 3,
  canSend: true,
  messages: {}
};

// 成员数据
const PAOPAO_MEMBERS = [
  { id: "mzc", name: "穆祉丞", avatar: "./data/avatar/mzc.jpg", subscribed: true, latest: "今天练舞好累，但想到你们就不累了。" },
  { id: "wlj", name: "王橹杰", avatar: "./data/avatar/wlj.jpg", subscribed: true, latest: "别急别急啦。我来我来了～" },
  { id: "zgy", name: "张桂源", avatar: "./data/avatar/zgy.jpg", subscribed: false, latest: "暂无消息" }
];

// 初始化聊天记录
function initPaopaoMessages() {
  if (!window.paopaoState.messages["mzc"]) {
    window.paopaoState.messages["mzc"] = [
      { from: "artist", text: "今天练舞好累，但想到你们就不累了。", time: "刚刚" },
      { from: "artist", text: "你们今天过得怎么样呀？", time: "刚刚" }
    ];
  }
  if (!window.paopaoState.messages["wlj"]) {
    window.paopaoState.messages["wlj"] = [
      { from: "artist", text: "别急别急啦。我来我来了～꒪ˊ꒳ˋ꒪ 今天会是好天气嘛…", time: "刚刚" }
    ];
  }
}

// ==========================================
// 视图1：泡泡成员列表
// ==========================================
VIEWS.paopao = () => {
  initPaopaoMessages();
  return {
    cls: "wx-list",
    html: `
    <div class="wx-head"><div class="wx-head-left"></div><h1 style="color:#ff8200;">泡泡</h1><div class="wx-actions" onclick="toastDev()">${G.search}${G.plus}</div></div>
    <div class="wx-scroll" style="background:#fff;">
      <!-- 高会提示条 -->
      <div style="background:linear-gradient(90deg,#fff8e6,#fff3d6);padding:12px 16px;display:flex;align-items:center;gap:8px;border-bottom:0.5px solid #f0f0f0;">
        <span style="font-size:20px;">👑</span>
        <div style="flex:1;">
          <div style="font-size:14px;font-weight:700;color:#b8860b;">高会专属权益</div>
          <div style="font-size:12px;color:#b8860b;margin-top:2px;">单次最多发3条，艺人更新后可继续</div>
        </div>
        <div style="font-size:11px;color:#b8860b;background:#fff;padding:4px 10px;border-radius:12px;">已开通</div>
      </div>

      ${PAOPAO_MEMBERS.map(m => `
        <button class="wx-item" onclick="openPaopaoChat('${m.id}')" style="background:#fff;">
          <div class="wx-av" style="border-radius:12px;">
            <img src="${m.avatar}" style="width:100%;height:100%;object-fit:cover;border-radius:12px;" onerror="this.style.display='none';this.parentElement.innerHTML='<div class=\\'app-icon-fallback\\' style=\\'background:#ff8200;font-size:20px;border-radius:12px;\\'>${m.name[0]}</div>';">
            ${m.subscribed ? `<span class="wx-badge" style="background:#ff8200;font-size:9px;padding:1px 5px;height:16px;top:-4px;right:-4px;">已订</span>` : ""}
          </div>
          <div class="wx-info">
            <div class="wx-name" style="display:flex;align-items:center;gap:6px;">
              ${m.name}
              ${window.paopaoState.selectedMember === m.id ? `<span style="font-size:9px;background:#ff8200;color:#fff;padding:1px 6px;border-radius:8px;">当前对话</span>` : ""}
            </div>
            <div class="wx-msg" style="color:#999;">${m.latest}</div>
          </div>
          <div class="wx-meta">
            <span style="font-size:11px;color:#ff8200;">${m.subscribed ? "更新" : ""}</span>
          </div>
        </button>
      `).join("")}
    </div>
    <div style="position:absolute;bottom:84px;left:16px;right:16px;text-align:center;font-size:11px;color:#999;">
      泡泡为高会专属功能，消息不显示您的头像和ID
    </div>
    <div class="wx-tabbar">
      <button onclick="show('wechat')"><span>${G.chat}</span><small>微信</small></button>
      <button class="on" style="color:#ff8200;"><span>${G.smile}</span><small style="font-weight:600;">泡泡</small></button>
    </div>`,
  };
};

// ==========================================
// 视图2：泡泡聊天界面
// ==========================================
VIEWS.paopao_chat = () => {
  const m = PAOPAO_MEMBERS.find(x => x.id === window.paopaoState.selectedMember);
  if (!m) return { html: "<div style='padding:100px;text-align:center;'>请先选择一个成员</div>" };

  const msgs = window.paopaoState.messages[m.id] || [];
  const remaining = window.paopaoState.maxMsg - window.paopaoState.msgCount;
  const canSend = window.paopaoState.canSend && remaining > 0;

  return {
    cls: "wx-chat",
    html: `
    <!-- 顶部栏 -->
    <div class="wx-chat-h" style="border-bottom:0.5px solid #f0f0f0; background:#fff;">
      <button class="bk" onclick="show('paopao')">${G.chevL}</button>
      <div class="nm" style="color:#ff8200;">${m.name} 的泡泡</div>
      <div class="rt" onclick="toastDev()">${G.dotsH}</div>
    </div>

    <!-- 消息区 -->
    <div class="msgs" id="paopao-msgs" style="background:#f9f9f9;padding-bottom:20px;">
      <div style="text-align:center;font-size:11px;color:#999;padding:12px 16px;">
        ${m.name} 的泡泡 · 高会专属
      </div>
      
      ${msgs.map(msg => `
        <div class="wx-ln ${msg.from === "me" ? "me" : "th"}">
          <!-- 只显示艺人头像 -->
          ${msg.from === "artist" ? `<div class="wx-sav"><img src="${m.avatar}" style="width:100%;height:100%;border-radius:6px;object-fit:cover;"></div>` : ""}
          <div class="wx-wrap" style="margin-left:${msg.from === "me" ? "auto" : "0"}; margin-right:${msg.from === "me" ? "0" : "40px"};">
            <div class="wx-bb" style="background:${msg.from === "me" ? "#ff8200" : "#fff"};color:${msg.from === "me" ? "#fff" : "#111"};border-radius:${msg.from === "me" ? "16px 4px 16px 16px" : "4px 16px 16px 16px"}; box-shadow:0 1px 2px rgba(0,0,0,0.05);">
              ${esc(msg.text)}
            </div>
          </div>
        </div>
      `).join("")}

      <!-- 等待更新提示 -->
      ${!canSend ? `
        <div style="text-align:center;font-size:12px;color:#999;padding:20px 16px;">
          ⏳ 等待 ${m.name} 的下一条泡泡更新...
        </div>
      ` : ""}
    </div>

    <!-- 输入区 -->
    <div class="wx-cin safe" id="paopao-cin" style="flex-direction:column;gap:8px;background:#fff;border-top:0.5px solid #f0f0f0; padding-bottom:20px;">
      <!-- 剩余条数 -->
      <div style="display:flex;justify-content:space-between;width:100%;padding:0 4px;">
        <span style="font-size:11px;color:${remaining > 0 ? "#999" : "#ff3b30"};">
          今日剩余：${remaining} 条
        </span>
        <span style="font-size:11px;color:#999;">不可截图/录屏</span>
      </div>
      
      <div style="display:flex;gap:12px;align-items:flex-end;width:100%;">
        <button class="ic" onclick="toastDev()" style="padding-bottom:6px;">${G.plusSq}</button>
        <div class="wx-fld" id="paopao-fld" onclick="event.stopPropagation();${canSend ? "openPaopaoInput()" : "toastDev('请等待艺人更新')"}" 
             style="background:#f5f5f5;border-radius:20px;flex:1;min-height:38px;padding:10px 14px;color:${canSend ? "#999" : "#ccc"}; display:flex; align-items:center;">
          ${canSend ? "说点什么..." : "等待更新后解锁"}
        </div>
        <button class="wx-snd" id="paopao-snd" onclick="${canSend ? "sendPaopaoMsg()" : "toastDev('请等待艺人更新')"}" 
                style="background:${canSend ? "#ff8200" : "#ccc"}; border-radius:20px; padding:0 16px; height:38px; display:${canSend ? "grid" : "none"}; place-items:center; color:#fff; font-size:14px; border:none; font-weight:500;">
          发送
        </button>
      </div>
      
      <!-- 隐藏输入框 -->
      <input id="paopao-input" type="text" placeholder="输入消息..." style="display:none;width:100%;border:1px solid #eee;border-radius:20px;padding:10px 14px;font-size:15px;outline:none;background:#f5f5f5;" onkeydown="if(event.key==='Enter')sendPaopaoMsg()">
    </div>`,
  };
};

// ==========================================
// 交互逻辑代码
// ==========================================

window.openPaopaoChat = function(id) {
  const m = PAOPAO_MEMBERS.find(x => x.id === id);
  if (!m.subscribed) {
    toastDev(`请先订阅 ${m.name} 的泡泡`);
    return;
  }
  window.paopaoState.selectedMember = id;
  window.paopaoState.msgCount = 0;
  window.paopaoState.canSend = true;
  
  if (!window.paopaoState.messages[id]) {
    window.paopaoState.messages[id] = [
      { from: "artist", text: `你好呀，我是${m.name}～`, time: "刚刚" },
    ];
  }
  push("paopao_chat");
  setTimeout(() => {
    const msgs = document.getElementById("paopao-msgs");
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
  }, 100);
};

window.openPaopaoInput = function() {
  const input = document.getElementById("paopao-input");
  const fld = document.getElementById("paopao-fld");
  if (input && fld) {
    fld.style.display = "none";
    input.style.display = "block";
    input.focus();
  }
};

window.sendPaopaoMsg = function() {
  const input = document.getElementById("paopao-input");
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  
  if (window.paopaoState.msgCount >= window.paopaoState.maxMsg) {
    toastDev("已达到发送上限，请等待更新");
    return;
  }
  
  const id = window.paopaoState.selectedMember;
  window.paopaoState.messages[id].push({
    from: "me",
    text: text,
    time: "刚刚"
  });
  window.paopaoState.msgCount++;

  // 清空输入
  input.value = "";
  input.style.display = "none";
  const fld = document.getElementById("paopao-fld");
  if (fld) fld.style.display = "flex";

  // 重新渲染
  show("paopao_chat");
  setTimeout(() => {
    const msgs = document.getElementById("paopao-msgs");
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
  }, 50);

  // 达到3条后锁定
  if (window.paopaoState.msgCount >= window.paopaoState.maxMsg) {
    window.paopaoState.canSend = false;
    
    // 模拟艺人几秒后回复（解锁）
    setTimeout(() => {
      const artistMsg = generateArtistReply(id);
      window.paopaoState.messages[id].push({
        from: "artist",
        text: artistMsg,
        time: "刚刚"
      });
      window.paopaoState.msgCount = 0;
      window.paopaoState.canSend = true;
      
      if (view === "paopao_chat") {
        show("paopao_chat");
        setTimeout(() => {
          const msgs = document.getElementById("paopao-msgs");
          if (msgs) msgs.scrollTop = msgs.scrollHeight;
        }, 50);
      }
      
      toastDev("艺人更新了泡泡，可以继续发送了");
      sfx("msg"); // 播放消息提示音
    }, 5000); // 模拟5秒后艺人回复
  }
};

function generateArtistReply(id) {
  const replies = {
    mzc: ["刚练完舞，看到你们的消息就不累了～", "今天也要好好吃饭哦！", "你们发来的每一条我都会看的。"],
    wlj: ["我来啦我来啦～今天过得怎么样？", "刚刚在摩托车上兜风，下次拍给你们看！", "别急别急，我一直在呢。"],
    zgy: ["今天训练好累，但是看到你们就有动力了！", "悄悄告诉你们，我最近在练一首新歌～"]
  };
  const arr = replies[id] || ["收到你们的消息啦～"];
  return arr[Math.floor(Math.random() * arr.length)];
}