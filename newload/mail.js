// ==========================================
// 📱 邮件 (Mail)
// ==========================================

let mailEditMode = false;
let mailSelected = new Set();
let currentMailId = 0;

// 强制刷新桌面 Mail 图标的角标
function updateMailHomeBadge() {
  const mailApp = document.querySelector('.app[data-app="mail"]');
  if (!mailApp) return;
  const icon = mailApp.querySelector('.icon');
  if (!icon) return;
  let bdg = icon.querySelector('.bdg');
  const unreadCount = emailData.filter(m => m.unread).length;
  
  if (unreadCount > 0) {
    if (!bdg) {
      bdg = document.createElement('span');
      bdg.className = 'bdg';
      icon.appendChild(bdg);
    }
    bdg.textContent = unreadCount;
  } else if (bdg) {
    bdg.remove();
  }
}

const emailData = [
  {
    id: 3, sender: "TFEntertainment", initial: "T", from: "TFEntertainment <no-reply@mails.shoplineinfo.com>", subject: "TFEntertainment 订单确认", preview: "关于您的订单或联系TFEntertainment的任何问题，请点击查看订单详情...", time: "2026年7月15日 22:58", unread: true,
    body: `
      <div style="text-align:center; margin-bottom:24px;">
        <div style="width:40px;height:40px;background:#ffb703;border-radius:8px;margin:0 auto 10px;transform:rotate(45deg);display:flex;align-items:center;justify-content:center;"><div style="transform:rotate(-45deg);color:#fff;font-weight:900;">TF</div></div>
        <h2 style="font-size:20px; font-weight:600; margin:0;">TFEntertainment 订单确认</h2>
      </div>
      <p style="font-size:15px; color:#333; line-height:1.6;">关于您的订单或联系TFEntertainment的任何问题，请点击查看订单详情或访问我们的商店。</p>
      <div style="text-align:center; margin:24px 0;">
        <button onclick="toastDev()" style="background:#111;color:#fff;padding:12px 24px;border-radius:6px;font-size:15px;font-weight:500;border:none;margin-bottom:16px;cursor:pointer;">查看订单详情</button><br>
        <a href="#" onclick="toastDev();return false;" style="color:#007aff; font-size:14px; text-decoration:underline;">查看我们的商店</a>
      </div>
      <div style="background:#f9f9f9; border-radius:8px; padding:16px; margin-bottom:24px; color:#111;">
        <h3 style="font-size:16px; margin:0 0 16px 0; font-weight:600;">订单摘要 （1）</h3>
        <div style="display:flex; gap:12px; margin-bottom:16px;">
          <div style="width:64px; height:64px; background:linear-gradient(135deg,#ffd1dc,#fbc2eb); border-radius:4px; flex:none; display:flex; align-items:center; justify-content:center; font-size:10px; color:#fff;">图片</div>
          <div style="flex:1;">
            <div style="font-size:14px; line-height:1.4; margin-bottom:4px;">2026TF家族 運動會<br>TF_ING周邊 套裝單人款</div>
            <div style="font-size:13px; color:#666;">穆祉丞 × 1</div>
          </div>
          <div style="font-size:14px; font-weight:500;">HKD HK$79.00</div>
        </div>
        <div style="border-top:0.5px solid #e5e5ea; padding-top:12px; display:flex; justify-content:space-between; font-size:14px; margin-bottom:8px;"><span>小计</span><span>HK$79.00</span></div>
        <div style="display:flex; justify-content:space-between; font-size:14px; margin-bottom:16px;"><span>运费</span><span>免费</span></div>
        <div style="display:flex; justify-content:space-between; font-size:16px; font-weight:600;"><span>总计</span><span>HK$79.00</span></div>
      </div>
      <div style="text-align:center; font-size:13px; color:#666; line-height:1.6;">
        <p style="margin-bottom:4px; font-weight:600; color:#111;">任何问题？欢迎与我们联系。</p>
        <p>我们将尽最大努力为您提供良好的购物体验，如果您有任何问题或反馈，请联系 <a href="#" onclick="toastDev();return false;" style="color:#007aff; text-decoration:underline;">LL@tfent.cn</a>。</p>
      </div>
    `
  },
  {
    id: 2, sender: "TFEntertainment", initial: "T", from: "TFEntertainment <no-reply@mails.shoplineinfo.com>", subject: "欢迎加入 TFEntertainment", preview: "您已成功在 TFEntertainment 创建账号，下次惠顾时请登录...", time: "2026年7月15日 22:57", unread: true,
    body: `
      <div style="text-align:center; margin-bottom:24px;">
        <div style="width:40px;height:40px;background:#ffb703;border-radius:8px;margin:0 auto 10px;transform:rotate(45deg);display:flex;align-items:center;justify-content:center;"><div style="transform:rotate(-45deg);color:#fff;font-weight:900;">TF</div></div>
        <h2 style="font-size:20px; font-weight:600; margin:0;">欢迎加入 TFEntertainment</h2>
      </div>
      <p style="font-size:15px; color:#333; line-height:1.6;"><a href="#" onclick="toastDev();return false;" style="color:#007aff;">531847297</a>，您好！<br><br>您已成功在 TFEntertainment 创建账号，下次惠顾时请登录以便更快捷地完成结帐，并享受会员优惠及服务。</p>
      <div style="text-align:center; margin:24px 0;">
        <button onclick="toastDev()" style="background:#111;color:#fff;padding:12px 32px;border-radius:6px;font-size:15px;font-weight:500;border:none;cursor:pointer;">访问店铺</button>
      </div>
      <div style="background:#f9f9f9; border-radius:8px; padding:24px 16px; text-align:center; font-size:13px; color:#666; line-height:1.6;">
        <p style="margin-bottom:4px; font-weight:600; color:#111;">需要任何帮助？欢迎联系我们</p>
        <p>我们将竭尽所能为您提供良好的购物体验。如果您有任何问题或反馈，请通过 <a href="#" onclick="toastDev();return false;" style="color:#007aff; text-decoration:underline;">LL@tfent.cn</a> 与我们联系。</p>
        <p style="margin-top:16px;">该邮件由TFEntertainment 发送</p>
        <a href="#" onclick="toastDev();return false;" style="display:inline-block; margin-top:16px; color:#007aff; text-decoration:underline;">取消订阅</a>
      </div>
    `
  },
  {
    id: 1, sender: "TFEntertainment", initial: "T", from: "TFEntertainment <no-reply@mails.shoplineinfo.com>", subject: "您已成功订阅 TFEntertainment", preview: "感谢您订阅TFEntertainment！点击按钮进入店铺查看最近热卖的商品吧！", time: "2026年7月15日 22:56", unread: false,
    body: `
      <div style="text-align:center; margin-bottom:24px;">
        <div style="width:40px;height:40px;background:#ffb703;border-radius:8px;margin:0 auto 10px;transform:rotate(45deg);display:flex;align-items:center;justify-content:center;"><div style="transform:rotate(-45deg);color:#fff;font-weight:900;">TF</div></div>
        <h2 style="font-size:20px; font-weight:600; margin:0;">您已成功订阅<br>TFEntertainment</h2>
      </div>
      <p style="font-size:15px; color:#333; line-height:1.6;"><a href="#" onclick="toastDev();return false;" style="color:#007aff;">531847297</a> 您好！<br><br>感谢您订阅TFEntertainment！点击按钮进入店铺查看最近热卖的商品吧！</p>
      <div style="text-align:center; margin:24px 0;">
        <button onclick="toastDev()" style="background:#111;color:#fff;padding:12px 32px;border-radius:6px;font-size:15px;font-weight:500;border:none;cursor:pointer;">访问店铺</button>
      </div>
      <div style="background:#f9f9f9; border-radius:8px; padding:24px 16px; text-align:center; font-size:13px; color:#666; line-height:1.6;">
        <p style="margin-bottom:4px; font-weight:600; color:#111;">需要任何帮助？欢迎联系我们</p>
        <p>我们将竭尽所能为您提供良好的购物体验。如果您有任何问题或反馈，请通过 <a href="#" onclick="toastDev();return false;" style="color:#007aff; text-decoration:underline;">LL@tfent.cn</a> 与我们联系。</p>
        <p style="margin-top:16px;">该邮件由TFEntertainment 发送</p>
        <a href="#" onclick="toastDev();return false;" style="display:inline-block; margin-top:16px; color:#007aff; text-decoration:underline;">取消订阅</a>
      </div>
    `
  },
  {
    id: 0, sender: "TFEntertainment", initial: "T", from: "TFEntertainment <no-reply@mails.shoplineinfo.com>", subject: "注册帐号", preview: "感谢您在TFEntertainment创建账号，您需要使用以下验证码...", time: "2026年7月15日 22:55", unread: false,
    body: `
      <div style="text-align:center; margin-bottom:24px;">
        <div style="width:40px;height:40px;background:#ffb703;border-radius:8px;margin:0 auto 10px;transform:rotate(45deg);display:flex;align-items:center;justify-content:center;"><div style="transform:rotate(-45deg);color:#fff;font-weight:900;">TF</div></div>
        <h2 style="font-size:20px; font-weight:600; margin:0;">注册帐号</h2>
      </div>
      <p style="font-size:15px; color:#333; line-height:1.6;"><a href="#" onclick="toastDev();return false;" style="color:#007aff;">531847297</a>，你好！<br><br>感谢您在TFEntertainment创建账号，您需要使用以下验证码来验证您的账号，以便完成注册。</p>
      <div style="background:#f9f9f9; padding:20px; text-align:center; margin:24px 0; border-radius:8px;">
        <span style="font-size:28px; font-weight:600; letter-spacing:4px; color:#111;">078433</span>
      </div>
      <p style="text-align:center; font-size:13px; color:#888; margin-top:40px;">如果您没有提出此请求，可以忽略此邮件。</p>
      <p style="text-align:center; font-size:13px; color:#888;">该邮件由TFEntertainment 发送</p>
      <p style="text-align:center; margin-top:16px;"><a href="#" onclick="toastDev();return false;" style="color:#007aff; text-decoration:underline;">访问店铺</a></p>
    `
  }
];

VIEWS.mail = () => {
  const unreadCount = emailData.filter((m) => m.unread).length;
  const navRight = mailEditMode
    ? `<span style="color:#007aff;font-size:17px;cursor:pointer;" onclick="toggleMailEdit()">完成</span>`
    : `<span style="color:#007aff;font-size:17px;cursor:pointer;" onclick="toggleMailEdit()">编辑</span>`;

  const nav = mailEditMode
    ? `<div class="nav solid">
        <div style="justify-self:start;padding-left:16px;color:#ff3b30;font-size:17px;cursor:pointer;" onclick="deleteSelectedMails()">删除</div>
        <div class="nb-title" style="opacity:1;">已选择 ${mailSelected.size} 封</div>
        <div class="nb-right">${navRight}</div>
      </div>`
    : navHTML({ title: "", back: "主页", backFn: "closeApp()", right: navRight });

  return {
    html:
      nav +
      `<div class="scroll" style="padding-top:98px; padding-bottom:100px; background:#fff;">
        <h1 class="lt" style="font-size:36px; font-weight:700; margin:10px 16px 16px;">收件箱</h1>
        <div class="srch" onclick="toastDev()" style="margin:0 16px 16px;">${G.search}搜索</div>
        <div style="padding:0 16px;">
          ${emailData.length === 0 ? `<div style="text-align:center;padding:60px 0;color:#8e8e93;font-size:15px;">没有邮件</div>` : ""}
          ${emailData.map((m) => {
            const selected = mailSelected.has(m.id);
            return `
              <div onclick="${mailEditMode ? `toggleMailSelect(${m.id})` : `openMailDetail(${m.id})`}" style="display:flex; align-items:flex-start; gap:8px; padding:12px 0; border-bottom:0.5px solid #e5e5ea; cursor:pointer; background:${selected ? "#f0f8ff" : "transparent"};">
                ${
                  mailEditMode
                    ? `<div style="width:24px; flex:none; padding-top:6px; display:flex; align-items:center; justify-content:center;">
                        <div style="width:22px;height:22px;border-radius:50%;border:1.5px solid ${selected ? "#007aff" : "#c7c7cc"};background:${selected ? "#007aff" : "transparent"};display:grid;place-items:center;">
                          ${selected ? `<svg viewBox="0 0 24 24" width="14" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>` : ""}
                        </div>
                      </div>`
                    : `<div style="width:8px; flex:none; padding-top:6px;">
                        ${m.unread ? `<div style="width:8px;height:8px;border-radius:50%;background:#007aff;"></div>` : ""}
                      </div>`
                }
                <div style="flex:1; min-width:0;">
                  <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:2px;">
                    <span style="font-size:16px; font-weight:${m.unread ? "700" : "600"}; color:#111; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${esc(m.sender)}</span>
                    <div style="display:flex; align-items:center; gap:6px; color:#8e8e93; font-size:14px; flex:none;">
                      <span>${m.time}</span>
                      <span style="color:#c4c4c7; font-size:16px;">›</span>
                    </div>
                  </div>
                  <div style="font-size:15px; font-weight:500; color:#111; margin-bottom:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${esc(m.subject)}</div>
                  <div style="font-size:14px; color:#8e8e93; line-height:1.3; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${esc(m.preview)}</div>
                </div>
              </div>`;
          }).join("")}
        </div>
      </div>
      <div class="toolbar" style="justify-content:space-between; padding:10px 30px 34px;">
        ${
          mailEditMode
            ? `<div style="color:#007aff; cursor:pointer; font-size:16px;" onclick="selectAllMails()">${mailSelected.size === emailData.length ? "取消全选" : "全选"}</div>
               <div style="font-size:13px; color:#8e8e93; font-weight:500; padding-top:4px;">已选 ${mailSelected.size}</div>
               <div style="color:#007aff; cursor:pointer; font-size:16px;" onclick="markSelectedRead()">标为已读</div>`
            : `<div style="color:#007aff; cursor:pointer;" onclick="toastDev()">
                 <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none"/></svg>
               </div>
               <div style="font-size:13px; color:#8e8e93; font-weight:500; padding-top:4px;">${unreadCount > 0 ? `${unreadCount} 封未读` : "全部已读"}</div>
               <div style="color:#007aff; cursor:pointer;" onclick="toastDev()">
                 <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
               </div>`
        }
      </div>`,
  };
};

VIEWS.mail_detail = () => {
  const data = emailData.find((d) => d.id === currentMailId);
  if (!data) return { html: "" };
  return {
    html:
      navHTML({ title: "", back: "收件箱", backFn: "back()", right: `<span style="color:#007aff;font-size:16px;cursor:pointer;" onclick="markMailUnread(${data.id})">标为未读</span>` }) +
      `<div class="scroll" style="padding-top:98px; padding-bottom:100px; background:#fff;">
        <div style="padding: 12px 16px 16px; border-bottom:0.5px solid #e5e5ea;">
          <div style="font-size:20px; font-weight:600; color:#111; margin-bottom:16px;">${esc(data.subject)}</div>
          <div style="display:flex; align-items:flex-start;">
            <div style="width:40px; height:40px; border-radius:50%; background:#ffb703; display:flex; align-items:center; justify-content:center; color:#fff; font-size:20px; font-weight:900; flex:none;">T</div>
            <div style="flex:1; margin-left:12px; min-width:0;">
              <div style="display:flex; justify-content:space-between; align-items:baseline;">
                <span style="font-size:16px; font-weight:600; color:#111;">${esc(data.sender)}</span>
                <span style="font-size:13px; color:#8e8e93;">${data.time}</span>
              </div>
              <div style="font-size:12px; color:#8e8e93; margin-top:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">发件人: ${esc(data.from)}</div>
            </div>
          </div>
        </div>
        <div style="background:#f2f2f7; padding:12px 16px; display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px;">
          <div style="font-size:13px; color:#666; line-height:1.4; padding-right:16px;">邮件内容可能涉及财产、账号安全，请谨慎对待。</div>
          <div style="color:#999; font-size:16px; line-height:1;">×</div>
        </div>
        <div style="padding: 0 16px 40px;">${data.body}</div>
      </div>
      <div class="toolbar" style="justify-content:space-around; padding:10px 10px 34px;">
        <div style="color:#007aff; cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:4px;" onclick="deleteCurrentMail(${data.id})">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4.5h8V6M5.5 6l1 14h11l1-14"/></svg>
          <span style="font-size:10px; color:#111;">删除</span>
        </div>
        <div style="color:#007aff; cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:4px;" onclick="toastDev()">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
          <span style="font-size:10px; color:#111;">分享</span>
        </div>
        <div style="color:#007aff; cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:4px;" onclick="toastDev()">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>
          <span style="font-size:10px; color:#111;">回复转发</span>
        </div>
        <div style="color:#007aff; cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:4px;" onclick="toastDev()">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none"/></svg>
          <span style="font-size:10px; color:#111;">更多</span>
        </div>
      </div>`,
  };
};

function openMailDetail(id) {
  const data = emailData.find((d) => d.id === id);
  if (!data) return;
  data.unread = false; 
  updateMailHomeBadge(); 
  currentMailId = id;
  push("mail_detail");
}

function toggleMailEdit() { mailEditMode = !mailEditMode; mailSelected.clear(); show("mail", "none"); }
function toggleMailSelect(id) { if (mailSelected.has(id)) mailSelected.delete(id); else mailSelected.add(id); show("mail", "none"); }
function selectAllMails() { if (mailSelected.size === emailData.length) mailSelected.clear(); else emailData.forEach((m) => mailSelected.add(m.id)); show("mail", "none"); }
function deleteSelectedMails() {
  if (mailSelected.size === 0) { toastDev(); return; }
  for (let i = emailData.length - 1; i >= 0; i--) {
    if (mailSelected.has(emailData[i].id)) emailData.splice(i, 1);
  }
  mailSelected.clear(); mailEditMode = false; updateMailHomeBadge(); show("mail", "none");
}
function markSelectedRead() {
  emailData.forEach((m) => { if (mailSelected.has(m.id)) m.unread = false; });
  mailSelected.clear(); mailEditMode = false; updateMailHomeBadge(); show("mail", "none");
}
function markMailUnread(id) { const data = emailData.find((d) => d.id === id); if (data) data.unread = true; updateMailHomeBadge(); back(); }
function deleteCurrentMail(id) { const idx = emailData.findIndex((d) => d.id === id); if (idx >= 0) emailData.splice(idx, 1); updateMailHomeBadge(); back(); }