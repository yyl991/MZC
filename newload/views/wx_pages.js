// 自动拆分自 app_wechat.js（2026-10-28）
/* ================= 聊天信息页 ================= */
window.openWxChatInfo = function () {
  if (!chatId) return toastDev();
  push("wx_chat_info");
};
window.wxToggleChatSetting = function (key, el) {
  const s = (window._wxChatSettings[chatId] =
    window._wxChatSettings[chatId] || {});
  s[key] = !s[key];
  if (el) el.classList.toggle("on", s[key]);
  vib(8);
};
// 黑名单：和「消息免打扰」「置顶聊天」一样的左右开关
window.wxToggleBlock = function (el) {
  const on = !!(window._wxBlocked && window._wxBlocked[chatId]);
  if (el) el.classList.toggle("on", !on);
  if (on) wxUnblockChat(chatId);
  else wxBlockChat(chatId);
};
window.wxSetRemark = function () {
  const cur = window._wxRemarks[chatId] || "";
  wxPrompt("设置备注", cur || "输入备注名", function (v) {
    window._wxRemarks[chatId] = v;
    show("wx_chat_info", "none");
    toastDev("备注已保存");
  });
};
window.openWxPatHistory = function () {
  const arr = (chatData[chatId] || []).filter(
    (m) => m[1] === "sys" && String(m[0]).includes("拍了拍"),
  );
  if (!arr.length) return toastDev("还没有拍过");
  wxActionSheet(
    "拍一拍记录",
    arr
      .slice(-10)
      .reverse()
      .map((m) => ({ label: `${m[2] || ""}　${m[0]}`, onClick: () => {} })),
  );
};
window.wxClearChat = function () {
  wxActionSheet("清空聊天记录", [
    {
      label: "清空",
      danger: true,
      onClick: () => {
        chatData[chatId] = [["11月15日", "date"]];
        saveChat();
        show("wx_chat_info", "none");
        toastDev("聊天记录已清空");
      },
    },
  ]);
};
function wxCell(label, right, onclick, last) {
  return `<div class="wx-cell" ${onclick ? `onclick="${onclick}"` : ""} style="${last ? "" : "border-bottom:.5px solid #f0f0f0;"}">
    <div class="wx-cell-label">${label}</div>
    <div class="wx-cell-right">${right}</div>
  </div>`;
}
VIEWS.wx_chat_info = () => {
  const s = window._wxChatSettings[chatId] || {};
  const msgCount = (chatData[chatId] || []).filter((x) => x[1] !== "date").length;
  return {
    cls: "wx-list",
    html: `
    <div class="nav solid" style="background:#ededed;border-bottom:.5px solid #dcdcdc;">
      <button class="nb-back" onclick="back()" style="border:none;background:none;color:#111;cursor:pointer;">${G.chevL}</button>
      <div class="nb-title" style="opacity:1;">聊天信息</div>
      <div class="nb-right"></div>
    </div>
    <div class="wx-scroll" style="padding-top:98px;background:#ededed;padding-bottom:30px;">
      <div style="background:#fff;padding:16px;">
        <div class="wx-member-grid">
          <div class="wx-member">
            <div class="wx-member-av">${avatarFor(chatId, false)}</div>
            <div class="wx-member-name">${esc(wxName(chatId))}</div>
          </div>
          <div class="wx-member" onclick="toastDev()">
            <div class="wx-member-av add">＋</div>
            <div class="wx-member-name"></div>
          </div>
        </div>
      </div>
      <div style="background:#fff;margin-top:8px;">
        ${wxCell("查找聊天记录", `<span style="color:#999;font-size:13px;">${msgCount} 条</span><span class="wx-cell-chev">${G.chevR}</span>`, "openWxSearch('wx_chat_info', chatId)")}
        ${wxCell("拍一拍记录", `<span class="wx-cell-chev">${G.chevR}</span>`, "openWxPatHistory()")}
        ${wxCell("消息免打扰", `<button class="sw ${s.mute ? "on" : ""}" onclick="wxToggleChatSetting('mute',this)"></button>`)}
        ${wxCell("置顶聊天", `<button class="sw ${s.top ? "on" : ""}" onclick="wxToggleChatSetting('top',this)"></button>`)}
      </div>
      <div style="background:#fff;margin-top:8px;">
        ${wxCell("设置备注和标签", `<span class="wx-cell-chev">${G.chevR}</span>`, "wxSetRemark()")}
        ${wxCell("加入黑名单", `<button class="sw ${window._wxBlocked && window._wxBlocked[chatId] ? "on" : ""}" onclick="wxToggleBlock(this)"></button>`)}
        ${wxCell("清空聊天记录", `<span class="wx-cell-chev">${G.chevR}</span>`, "wxClearChat()", true)}
      </div>
      <div style="background:#fff;margin-top:8px;">
        ${wxCell("投诉", `<span class="wx-cell-chev">${G.chevR}</span>`, "toastDev()", true)}
      </div>
    </div>`,
  };
};

/* ================= 全局搜索 ================= */
window._wxSearchHits = [];
window.openWxSearch = function (from, scope) {
  window._wxSearchFrom = from || view || "wechat";
  window._wxSearchScope = scope || "";
  window._wxSearchQuery = "";
  push("wx_search");
};
window.wxSearchInput = function (v) {
  window._wxSearchQuery = v;
  wxRenderSearch(v);
};
window.openSearchHit = function (i) {
  const h = (window._wxSearchHits || [])[i];
  if (!h) return;
  if (h.kind === "profile") {
    chatId = h.chat;
    window._profileFrom = "wx_search";
    push("wx_profile");
  } else if (h.kind === "chat") {
    chatId = h.chat;
    window._chatBackTo = "wx_search";
    push("chat");
  } else if (h.kind === "moment") {
    window._momentDetailFrom = "wx_search";
    window._currentMomentDetail = {
      author: h.author,
      authorId: h.authorId || h.author,
      avatar: h.avatar,
      post: h.post,
    };
    window._mDetailOpen = false;
    push("wx_moments_detail");
  }
};
window.wxRenderSearch = function (q) {
  const box = document.getElementById("wx-search-results");
  if (!box) return;
  const query = String(q || "").trim().toLowerCase();
  const scope = window._wxSearchScope || "";
  if (!query) {
    box.innerHTML = `<div class="wx-search-empty">搜索聊天记录、联系人和朋友圈</div>`;
    window._wxSearchHits = [];
    return;
  }
  const hits = [];
  const chats = [];
  chatNames.forEach((n) => {
    if (scope && n !== scope) return;
    const arr = chatData[n] || [];
    const shown = wxName(n);
    if (!scope && shown.toLowerCase().includes(query)) {
      chats.push({ kind: "profile", chat: n, label: shown, sub: "联系人" });
      return;
    }
    const msgs = arr.filter((x) => x[1] !== "date");
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (String(msgs[i][0]).toLowerCase().includes(query)) {
        chats.push({
          kind: "chat",
          chat: n,
          label: scope ? shown : "聊天记录 · " + shown,
          sub: msgs[i][0],
          time: msgs[i][2] || "",
        });
        break;
      }
    }
  });
  const momentHits = [];
  if (!scope) {
    const all = [];
    for (const user in MOCK_MOMENTS_DATA) {
      const u = MOCK_MOMENTS_DATA[user];
      const av = (CFG.roles && CFG.roles[user] && CFG.roles[user].avatar) || u.avatar || G.sil;
      (u.posts || []).forEach((p) => all.push({ author: user, avatar: av, post: p }));
    }
    (window._wxMyPosts || []).forEach((p) =>
      all.push({ author: "我", avatar: CFG.myAvatar || G.sil, post: p }),
    );
    all.forEach((h) => {
      if (String(h.post.text || "").toLowerCase().includes(query))
        momentHits.push({ kind: "moment", label: h.author, sub: h.post.text, author: h.author, avatar: h.avatar, post: h.post });
    });
  }
  let html = "";
  if (chats.length) {
    html += `<div class="wx-search-sec">${scope ? "聊天记录" : "聊天"}</div>`;
    chats.slice(0, 30).forEach((h) => {
      const i = hits.push(h) - 1;
      html += `<div class="wx-search-row" onclick="openSearchHit(${i})">
        <div class="wx-search-av">${avatarFor(h.chat, false)}</div>
        <div class="wx-search-info"><div class="wx-search-name">${esc(h.label)}</div><div class="wx-search-sub">${esc(h.sub)}</div></div>
        ${h.time ? `<div class="wx-search-time">${esc(h.time)}</div>` : ""}
      </div>`;
    });
  }
  if (momentHits.length) {
    html += `<div class="wx-search-sec">朋友圈</div>`;
    momentHits.slice(0, 30).forEach((h) => {
      const i = hits.push(h) - 1;
      html += `<div class="wx-search-row" onclick="openSearchHit(${i})">
        <div class="wx-search-av"><img src="${h.avatar}" style="width:100%;height:100%;object-fit:cover;border-radius:6px;" /></div>
        <div class="wx-search-info"><div class="wx-search-name">${esc(h.author)}</div><div class="wx-search-sub">${esc(h.sub)}</div></div>
      </div>`;
    });
  }
  window._wxSearchHits = hits;
  box.innerHTML = html || `<div class="wx-search-empty">没有找到相关内容</div>`;
};
VIEWS.wx_search = () => {
  const q = window._wxSearchQuery || "";
  const scopeName = window._wxSearchScope ? wxName(window._wxSearchScope) : "";
  return {
    cls: "wx-list",
    html: `
    <div class="wx-search-head">
      <div class="wx-search-box">${G.wxSearch}<input id="wx-search-input" value="${esc(q)}" placeholder="${scopeName ? "搜索 " + esc(scopeName) + " 的聊天记录" : "搜索"}" oninput="wxSearchInput(this.value)" /></div>
      <button class="wx-search-cancel" onclick="back()">取消</button>
    </div>
    <div class="wx-scroll" id="wx-search-results" style="background:#fff;"></div>`,
    init: () => {
      wxRenderSearch(window._wxSearchQuery || "");
      setTimeout(() => {
        const i = document.getElementById("wx-search-input");
        if (i) i.focus();
      }, 100);
    },
  };
};

window.openMoments = function () {
  window._wxDiscoverNew = false;
  push("moments");
};
VIEWS.wx_discover = () => {
  const row = (icon, text, onclick = "toastDev()", isLast = false) => `
    <div class="row tap" onclick="${onclick}" style="min-height:56px; padding:0 16px; position:relative; display:flex; align-items:center; background:#fff; width:100%; text-align:left; border:none;">
      <div style="width:24px; height:24px; display:flex; justify-content:center; align-items:center; margin-right:16px; flex:none;">${icon}</div>
      <div style="flex:1; font-size:16px; color:#111;">${text}</div>
      <div style="width:16px; display:flex; justify-content:flex-end;">${G.chevR}</div>
      ${!isLast ? `<div style="position:absolute; bottom:0; left:56px; right:0; height:.5px; background:#e5e5ea;"></div>` : ""}
    </div>`;

  return {
    cls: "wx-list",
    html: `
    <div class="wx-head" style="background:#ededed;">
      <div class="wx-head-left"></div>
      <h1>发现</h1>
      <div class="wx-actions"><span style="display:flex;cursor:pointer;" onclick="openWxSearch('wx_discover')">${G.wxSearch}</span></div>
    </div>

    <div class="wx-scroll" style="flex:1; overflow-y:auto; background:#ededed; padding-bottom: 80px;">
      <div style="background:#fff; margin-top:8px;">
${row(G.wxPengyouquan, "朋友圈", "openMoments()", true)}
      </div>
      <div style="background:#fff; margin-top:8px;">${row(G.wxShipinhao, "视频号", "toastDev()")}${row(G.wxZhibo, "直播", "toastDev()", true)}</div>
      <div style="background:#fff; margin-top:8px;">${row(G.wxSaoyisao, "扫一扫", "openWxScan()")}${row(G.wxSouyisou, "搜一搜", "openWxSearch('wx_discover')", true)}</div>
      <div style="background:#fff; margin-top:8px;">${row(G.wxKanyikan, "看一看", "toastDev()")}${row(G.wxTingyiting, "听一听", "toastDev()", true)}</div>
      <div style="background:#fff; margin-top:8px;">${row(G.wxFujin, "附近的人", "toastDev()")}${row(G.wxYouxi, "游戏", "toastDev()")}${row(G.wxXiaochengxu, "小程序", "toastDev()", true)}</div>
    </div>

    <div class="wx-tabbar">
      <button onclick="show('wechat')" style="position:relative;"><span>${G.wxTabChat}</span>${wxChatTabBadge()}<small>微信</small></button>
      <button onclick="show('wx_contacts')"><span>${G.wxTabContacts}</span><small>通讯录</small></button>
      <button class="on" style="position:relative;">
        <span>${G.wxTabDiscover}</span>
        ${wxTabDot()}
        <small>发现</small>
      </button>
      <button onclick="show('wx_me')" style="position:relative;">
        <span>${G.wxTabMe}</span>
        <span style="position:absolute;top:4px;right:22px;width:8px;height:8px;background:#fa5151;border-radius:50%;"></span>
        <small>我</small>
      </button>
    </div>`,
  };
};

function getPinyinInitial(str) {
  const map = {
    穆: "M",
    丞: "C",
    恩: "E",
    小: "X",
    蓝: "L",
    瑞: "R",
    闺: "G",
    爹: "D",
    哥: "G",
    仔: "Z",
    胖: "P",
    M: "M",
    p: "P",
    c: "C",
    r: "R",
    t: "T",
  };
  const c = str.charAt(0);
  if (/[a-zA-Z]/.test(c)) return c.toUpperCase();
  return map[c] || "#";
}

VIEWS.wx_contacts = () => {
  const groups = {};
  chatNames.forEach((name) => {
    const initial = getPinyinInitial(name);
    if (!groups[initial]) groups[initial] = [];
    groups[initial].push(name);
  });

  const sortedInitials = Object.keys(groups).sort((a, b) => {
    if (a === "#") return 1;
    if (b === "#") return -1;
    return a.localeCompare(b);
  });

  let listHTML = "";
  sortedInitials.forEach((initial) => {
    listHTML += `<div id="group-${initial}" style="padding:4px 16px; font-size:13px; color:#888; background:#ededed; font-weight:500;">${initial}</div>`;
    groups[initial].forEach((name) => {
      listHTML += `
        <div class="wx-item" style="padding-left:16px; background:#fff;" onclick="window._profileFrom='wx_contacts'; chatId='${name}'; push('wx_profile')">
          <div class="wx-av" onclick="event.stopPropagation(); openWxProfileByName('${name}', 'wx_contacts')">${avatarFor(name)}</div>
          <div class="wx-info"><div class="wx-name">${esc(wxName(name))}</div></div>
        </div>
      `;
    });
  });

  const topIcon = (bg, svg) =>
    `<div style="width:40px; height:40px; border-radius:6px; background:${bg}; display:grid; place-items:center; flex:none; margin-right:16px;">${svg}</div>`;

  return {
    cls: "wx-list",
    html: `
    <div class="wx-head" style="background:#ededed; position:relative;">
      <div class="wx-head-left"></div>
      <h1>通讯录</h1>
      <div class="wx-actions"><span style="display:flex;cursor:pointer;" onclick="openWxSearch('wx_contacts')">${G.wxSearch}</span><span style="display:flex;cursor:pointer;" onclick="wxOpenAddMenu()">${G.wxPlus}</span></div>
    </div>
    <div class="wx-scroll" style="flex:1; overflow-y:auto; padding-top: 0; background:#ededed;">
      
      <div style="background:#fff; margin-bottom:8px;">
        <div class="wx-item" style="padding-left:16px; background:#fff; border-bottom: 0.5px solid #ededed;" onclick="openWxContactsSub('new_friends')">
          ${topIcon("#fca130", G.wxNewFriend)}
          <div class="wx-info"><div class="wx-name">新的朋友</div></div>
        </div>
        <div class="wx-item" style="padding-left:16px; background:#fff; border-bottom: 0.5px solid #ededed;" onclick="openWxContactsSub('chat_only')">
          ${topIcon("#fca130", G.wxChatOnly)}
          <div class="wx-info"><div class="wx-name">仅聊天的朋友</div></div>
        </div>
        <div class="wx-item" style="padding-left:16px; background:#fff; border-bottom: 0.5px solid #ededed;" onclick="openWxContactsSub('groups')">
          ${topIcon("#07c160", G.wxGroup)}
          <div class="wx-info"><div class="wx-name">群聊</div></div>
        </div>
        <div class="wx-item" style="padding-left:16px; background:#fff; border-bottom: 0.5px solid #ededed;" onclick="openWxContactsSub('tags')">
          ${topIcon("#2782d7", G.wxTag)}
          <div class="wx-info"><div class="wx-name">标签</div></div>
        </div>
        <div class="wx-item" style="padding-left:16px; background:#fff; border-bottom: 0.5px solid #ededed;" onclick="openWxContactsSub('official')">
          ${topIcon("#2782d7", G.wxOfficial)}
          <div class="wx-info"><div class="wx-name">公众号</div></div>
        </div>
        <div class="wx-item" style="padding-left:16px; background:#fff;" onclick="openWxContactsSub('service')">
          ${topIcon("#2782d7", G.wxService)}
          <div class="wx-info"><div class="wx-name">服务号</div></div>
        </div>
      </div>

      <div style="padding:6px 16px; font-size:13px; color:#888; background:#ededed;">我的企业及企业联系人</div>
      <div style="background:#fff; margin-bottom:8px;">
        <div class="wx-item" style="padding-left:16px; background:#fff;" onclick="openWxContactsSub('enterprise')">
          ${topIcon("#2782d7", G.wxEnterprise)}
          <div class="wx-info"><div class="wx-name">企业微信联系人</div></div>
        </div>
      </div>

      <div style="background:#fff;">
        ${listHTML}
      </div>
      
      <div style="text-align:center; padding: 20px 0 40px; color: #999; font-size: 15px;">705个朋友</div>
    </div>

    <div style="position: absolute; right: 2px; top: 100px; bottom: 80px; width: 24px; display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 100; gap: 1px; background: transparent;">
      <span style="font-size:12px; color:#555; font-weight:600; padding:2px 0;" onclick="document.querySelector('.wx-scroll').scrollTo({top:0,behavior:'smooth'})">↑</span>
      <span style="font-size:12px; color:#555; font-weight:600; padding:2px 0;" onclick="document.querySelector('.wx-scroll').scrollTo({top:0,behavior:'smooth'})">☆</span>
      ${sortedInitials.map((initial) => `<span style="font-size:11px; color:#555; font-weight:600; padding:1px 0; cursor:pointer;" onclick="document.getElementById('group-${initial}').scrollIntoView({behavior:'smooth'});">${initial}</span>`).join("")}
    </div>

    <div class="wx-tabbar">
      <button onclick="show('wechat')" style="position:relative;"><span>${G.wxTabChat}</span>${wxChatTabBadge()}<small>微信</small></button>
      <button class="on"><span>${G.wxTabContacts}</span><small>通讯录</small></button>
      <button onclick="show('wx_discover')" style="position:relative;"><span>${G.wxTabDiscover}</span>${wxTabDot()}<small>发现</small></button>
      <button onclick="show('wx_me')" style="position:relative;"><span>${G.wxTabMe}</span><span style="position:absolute;top:4px;right:22px;width:8px;height:8px;background:#fa5151;border-radius:50%;"></span><small>我</small></button>
    </div>`,
  };
};

VIEWS.wx_me = () => {
  const row = (icon, title, extra = "", onclick = "toastDev()") => `
    <div class="wx-item" style="background:#fff; padding: 12px 16px; display:flex; align-items:center; border-bottom:0.5px solid #f0f0f0;" onclick="${onclick}">
      <div style="width:22px; height:22px; margin-right:14px; display:flex; align-items:center; justify-content:center;">${icon}</div>
      <div style="flex:1; font-size:16px; color:#111;">${title}</div>
      ${extra ? `<div style="font-size:14px; color:#888; margin-right:8px;">${extra}</div>` : ""}
      <div style="color:#c7c7cc;">${G.chevR}</div>
    </div>`;

  return {
    cls: "wx-list",
    html: `
    <div class="wx-scroll" style="flex:1; overflow-y:auto; background:#ededed; padding-top: 88px; padding-bottom: 20px;">
      
      <div style="background:#fff; padding: 24px 16px 20px; display:flex; align-items:flex-start; border-radius: 8px; margin-bottom: 8px;">
        <div style="width: 64px; height: 64px; border-radius: 8px; overflow: hidden; border: 0.5px solid #e5e5ea; flex:none; margin-right: 16px;">
          ${CFG.myAvatar ? `<img src="${CFG.myAvatar}" style="width:100%;height:100%;border-radius:8px;object-fit:cover;">` : `<div style="width:100%;height:100%;border-radius:8px;background:#eee;display:grid;place-items:center;">${G.sil}</div>`}
        </div>
        <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap: 6px; padding-top: 4px;">
          <div style="font-size: 20px; font-weight: 500; color: #111; display:flex; align-items:center; gap:6px;">我</div>
          <div style="font-size: 14px; color: #888;">微信号：cgcgdsg</div>
          
          <div style="display:flex; gap: 8px; margin-top: 4px;">
            <div style="border: 1px solid #e5e5ea; border-radius: 14px; padding: 2px 10px; font-size: 12px; color: #555; display:flex; align-items:center;">+ 状态</div>
            <div style="border: 1px solid #e5e5ea; border-radius: 14px; padding: 2px 10px; font-size: 12px; color: #555; display:flex; align-items:center;">
              <span style="margin-right:4px;">👥</span>等12个朋友 <span style="color:#fa5151; margin-left:4px;">●</span>
            </div>
          </div>
        </div>
        <div style="color:#111; margin-top:4px;cursor:pointer;" onclick="openWxScan()">${G.wxMeScan}</div>
      </div>

      <div style="background:#fff; margin-bottom: 8px;">
        ${row(G.wxMeService, '服务', '', "push('wx_services')")}
      </div>

      <div style="background:#fff; margin-bottom: 8px;">
        ${row(G.wxMeFav, '收藏', '', "push('wx_favorites')")}
        ${row(G.photo, '朋友圈', '', "push('wx_moments_self')")}
      </div>

      <div style="background:#fff; margin-bottom: 8px;">
        ${row(G.wxMeWorks, '我的作品', '', "toastDev()")}
        ${row(G.wxMeShop, '小店与卡包', '', "toastDev()")}
        ${row(G.wxMeEmoji, '表情', '', "toastDev()")}
      </div>

      <div style="background:#fff; margin-bottom: 8px;">
        ${row(G.wxMeSettings, '设置', '<span style="width:8px;height:8px;background:#fa5151;border-radius:50%;"></span>', "push('wx_settings')")}
      </div>

    </div>

    <div class="wx-tabbar">
      <button onclick="show('wechat')" style="position:relative;"><span>${G.wxTabChat}</span>${wxChatTabBadge()}<small>微信</small></button>
      <button onclick="show('wx_contacts')"><span>${G.wxTabContacts}</span><small>通讯录</small></button>
      <button onclick="show('wx_discover')" style="position:relative;"><span>${G.wxTabDiscover}</span>${wxTabDot()}<small>发现</small></button>
      <button class="on" style="position:relative;"><span>${G.wxTabMe}</span><span style="position:absolute;top:4px;right:22px;width:8px;height:8px;background:#fa5151;border-radius:50%;"></span><small>我</small></button>
    </div>`,
  };
};
/* ================= 加号菜单 / 扫一扫 ================= */
window.wxOpenAddMenu = function () {
  wxActionSheet("", [
    { label: "发起群聊", onClick: () => toastDev("建群功能还在路上~") },
    {
      label: "添加朋友",
      onClick: () => openWxContactsSub("new_friends", view),
    },
    { label: "扫一扫", onClick: () => openWxScan() },
    { label: "收付款", onClick: () => toastDev("收付款还没接进来~") },
  ]);
};
window.openWxScan = function () {
  window._wxScanFrom = view === "wx_scan" ? "wx_me" : view || "wx_me";
  push("wx_scan");
};
VIEWS.wx_scan = () => ({
  cls: "dark",
  html: `
  <div class="wx-scan-page">
    <div class="wx-scan-head">
      <button onclick="back()">${G.chevL}</button>
      <div>扫一扫</div>
      <span style="width:22px;"></span>
    </div>
    <div class="wx-scan-body">
      <div class="wx-scan-box">
        <span class="wx-scan-corner tl"></span><span class="wx-scan-corner tr"></span>
        <span class="wx-scan-corner bl"></span><span class="wx-scan-corner br"></span>
        <span class="wx-scan-line"></span>
      </div>
      <div class="wx-scan-tip">将二维码放入框内，即可自动扫描</div>
      <button class="wx-scan-btn" onclick="toastDev('相册里没有二维码~')">从相册选取</button>
    </div>
  </div>`,
});

/* ================= 通讯录二级页 ================= */
window._wxSubType = "new_friends";
window._wxSubFrom = "wx_contacts";
window.openWxContactsSub = function (type, from) {
  window._wxSubType = type;
  window._wxSubFrom = from || "wx_contacts";
  push("wx_contacts_sub");
};
window.wxSubBack = function () {
  show(window._wxSubFrom || "wx_contacts", "pop");
};
function wxEmpty(text) {
  return `<div style="padding:80px 20px;text-align:center;color:#999;font-size:15px;">${esc(text)}</div>`;
}
VIEWS.wx_contacts_sub = () => {
  const t = window._wxSubType;
  const titles = {
    new_friends: "新的朋友",
    chat_only: "仅聊天的朋友",
    groups: "群聊",
    tags: "标签",
    official: "公众号",
    service: "服务号",
    enterprise: "企业微信联系人",
  };
  const av = (n) => `<div class="wx-av">${avatarFor(n, false)}</div>`;
  let body = "";

  if (t === "new_friends") {
    const reqs = [
      { name: "恩仔", note: "来自群聊「4组」" },
      { name: "pig", note: "来自附近的人" },
    ];
    body = `<div style="background:#fff;">${reqs
      .map(
        (r) => `<div class="wx-item" style="background:#fff;padding-left:16px;">
        ${av(r.name)}
        <div class="wx-info"><div class="wx-name">${esc(wxName(r.name))}</div><div class="wx-msg">${esc(r.note)}</div></div>
        <button class="wx-mini-btn" onclick="event.stopPropagation();this.textContent='已添加';this.disabled=true;this.classList.add('done')">接受</button>
      </div>`,
      )
      .join("")}</div>`;
  } else if (t === "groups") {
    const gs = chatNames.filter(isGroup);
    body = gs.length
      ? `<div style="background:#fff;">${gs
          .map(
            (n) =>
              `<div class="wx-item" style="background:#fff;padding-left:16px;" onclick="chatId='${n}';push('chat')">${av(n)}<div class="wx-info"><div class="wx-name">${esc(wxName(n))}</div></div></div>`,
          )
          .join("")}</div>`
      : wxEmpty("暂无群聊");
  } else if (t === "tags") {
    const tags = [
      { name: "家人", members: ["MuAMuA", "恩恩", "穆瑞恩"] },
      { name: "朋友", members: ["丞哥", "穆祉丞", "穆瑞恩", "恩仔"] },
      { name: "同事", members: ["丞丞小队长", "pig"] },
      { name: "不想说话", members: ["Mu", "pig", "cat"] },
    ];
    body = `<div style="background:#fff;">${tags
      .map(
        (g) => `<div class="wx-item" style="background:#fff;padding-left:16px;" onclick="toastDev()">
        <div class="wx-av" style="background:#2782d7;display:grid;place-items:center;font-size:18px;">🏷️</div>
        <div class="wx-info"><div class="wx-name">${esc(g.name)}</div><div class="wx-msg">${g.members.map((m) => esc(wxName(m))).join("、")}</div></div>
      </div>`,
      )
      .join("")}</div>`;
  } else if (t === "official" || t === "service" || t === "enterprise") {
    const list =
      t === "official"
        ? ["TF家族", "时代峰峻", "穆祉丞工作室", "橙粉色研究所"]
        : t === "service"
          ? ["微信支付", "城市服务", "手机充值", "信用卡还款"]
          : ["企业微信", "腾讯文档", "腾讯会议"];
    body = `<div style="background:#fff;">${list
      .map(
        (n, i) =>
          `<div class="wx-item" style="background:#fff;padding-left:16px;" onclick="toastDev()">
        <div class="wx-av" style="background:${t === "service" ? "#07c160" : t === "enterprise" ? "#2782d7" : "#fca130"};display:grid;place-items:center;color:#fff;font-size:20px;">${esc(n.charAt(0))}</div>
        <div class="wx-info"><div class="wx-name">${esc(n)}</div><div class="wx-msg">${t === "official" ? "公众号" : t === "service" ? "服务号" : "企业微信"}</div></div>
      </div>`,
      )
      .join("")}</div>`;
  } else {
    body = wxEmpty("这里暂时还没有内容");
  }

  return {
    cls: "wx-list",
    html: `
    <div class="nav solid" style="background:#ededed;border-bottom:.5px solid #dcdcdc;">
      <button class="nb-back" onclick="wxSubBack()" style="border:none;background:none;color:#111;cursor:pointer;">${G.chevL}</button>
      <div class="nb-title" style="opacity:1;">${titles[t] || "通讯录"}</div>
      <div class="nb-right"></div>
    </div>
    <div class="wx-scroll" style="padding-top:98px;background:#ededed;padding-bottom:30px;">${body}</div>`,
  };
};

/* ================= 我的：服务 / 收藏 / 设置 ================= */
VIEWS.wx_services = () => {
  const svcBtn = (icon, label) =>
    `<button onclick="toastDev()" style="display:flex;flex-direction:column;align-items:center;gap:9px;background:none;border:none;padding:0 0 12px;font-family:inherit;"><span style="height:30px;display:grid;place-items:center;">${icon}</span><span style="font-size:13px;color:#111;">${label}</span></button>`;
  const sec = (title, items, last) => `
    <div style="background:#fff;border-radius:10px;margin:0 12px 10px;padding:16px 6px 4px;">
      <div style="font-size:13px;color:#94949a;padding:0 8px 14px;">${title}</div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px 2px;">${items
        .map(([ic, label]) => svcBtn(ic, label))
        .join("")}</div>
    </div>`;
  return {
    cls: "wx-list",
    html: `
    <div class="nav solid" style="background:#ededed;border-bottom:.5px solid #dcdcdc;">
      <button class="nb-back" onclick="back()" style="border:none;background:none;color:#111;cursor:pointer;">${G.chevL}</button>
      <div class="nb-title" style="opacity:1;">服务</div>
      <div class="nb-right">${G.dots}</div>
    </div>
    <div class="wx-scroll" style="padding-top:98px;background:#ededed;padding-bottom:30px;">
      <div style="background:#07c160;border-radius:10px;margin:10px 12px 12px;padding:24px 0 26px;display:flex;">
        <button onclick="toastDev()" style="flex:1;display:flex;flex-direction:column;align-items:center;gap:12px;background:none;border:none;font-family:inherit;">
          <span style="height:32px;display:grid;place-items:center;">${G.wxSvcScan}</span>
          <span style="font-size:16px;color:#fff;">收付款</span>
        </button>
        <button onclick="toastDev()" style="flex:1;display:flex;flex-direction:column;align-items:center;gap:12px;background:none;border:none;font-family:inherit;">
          <span style="height:32px;display:grid;place-items:center;">${G.wxSvcWallet}</span>
          <span style="font-size:16px;color:#fff;line-height:1.1;">钱包</span>
          <span style="font-size:13px;color:rgba(255,255,255,.85);margin-top:-4px;">¥0.00</span>
        </button>
      </div>
      ${sec("金融理财", [
        [G.wxSvcCredit, "信用卡还款"],
        [G.wxSvcLicaicai, "理财通"],
        [G.wxSvcInsurance, "保险服务"],
      ])}
      ${sec("生活服务", [
        [G.wxSvcPhoneTop, "手机充值"],
        [G.wxSvcUtility, "生活缴费"],
        [G.wxSvcQcoin, "Q币充值"],
        [G.wxSvcCity, "城市服务"],
        [G.wxSvcGongyi, "腾讯公益"],
        [G.wxSvcMedical, "医疗健康"],
      ])}
      ${sec("交通出行", [
        [G.wxSvcTravel, "出行服务"],
        [G.wxSvcTrain, "火车票机票"],
        [G.wxSvcDidi, "滴滴出行"],
        [G.wxSvcHotel, "酒店民宿"],
      ])}
      ${sec("购物消费", [
        [G.wxSvcShop, "京东购物"],
        [G.wxSvcGift, "拼多多"],
        [G.wxSvcUtility, "电影演出"],
        [G.wxSvcMore, "更多"],
      ])}
    </div>`,
  };
};

VIEWS.wx_favorites = () => {
  const items = [
    ["🔗", "穆祉丞工作室的微博", "链接 · 11月14日"],
    ["🖼️", "演唱会现场的晚霞", "图片 · 11月13日"],
    ["📝", "给穆祉丞的生日小作文", "笔记 · 11月12日"],
    ["💬", "和恩恩的聊天记录", "聊天记录 · 11月11日"],
    ["🎵", "循环了一整晚的歌", "音乐 · 11月10日"],
  ];
  return {
    cls: "wx-list",
    html: `
    <div class="nav solid" style="background:#ededed;border-bottom:.5px solid #dcdcdc;">
      <button class="nb-back" onclick="back()" style="border:none;background:none;color:#111;cursor:pointer;">${G.chevL}</button>
      <div class="nb-title" style="opacity:1;">收藏</div>
      <div class="nb-right"></div>
    </div>
    <div class="wx-scroll" style="padding-top:98px;background:#ededed;padding-bottom:30px;">
      <div style="background:#fff;margin-top:8px;">
        ${items
          .map(
            ([ic, title, sub], i) =>
              `<div class="wx-cell" onclick="toastDev()" style="${i === items.length - 1 ? "" : "border-bottom:.5px solid #f0f0f0;"}">
                <div class="wx-fav-icon">${ic}</div>
                <div style="flex:1;min-width:0;"><div class="wx-cell-label" style="font-size:16px;">${title}</div><div class="wx-cell-sub">${sub}</div></div>
              </div>`,
          )
          .join("")}
      </div>
    </div>`,
  };
};

window.wxToggleNotify = function (el) {
  window._wxNotifyOn = !window._wxNotifyOn;
  if (el) el.classList.toggle("on", window._wxNotifyOn);
  vib(8);
};
window.wxToggleDnd = function (el) {
  window.isDnd = !window.isDnd;
  if (el) el.classList.toggle("on", window.isDnd);
  if (typeof updateDndBadge === "function") updateDndBadge();
  vib(8);
};
VIEWS.wx_settings = () => {
  const notifyOn = window._wxNotifyOn !== false;
  const rows = ["账号与安全", "隐私", "通用", "帮助与反馈", "关于微信"];
  return {
    cls: "wx-list",
    html: `
    <div class="nav solid" style="background:#ededed;border-bottom:.5px solid #dcdcdc;">
      <button class="nb-back" onclick="back()" style="border:none;background:none;color:#111;cursor:pointer;">${G.chevL}</button>
      <div class="nb-title" style="opacity:1;">设置</div>
      <div class="nb-right"></div>
    </div>
    <div class="wx-scroll" style="padding-top:98px;background:#ededed;padding-bottom:30px;">
      <div style="background:#fff;margin-top:8px;">
        ${wxCell("新消息通知", `<button class="sw ${notifyOn ? "on" : ""}" onclick="wxToggleNotify(this)"></button>`)}
        ${wxCell("免打扰", `<button class="sw ${window.isDnd ? "on" : ""}" onclick="wxToggleDnd(this)"></button>`, "", true)}
      </div>
      <div style="background:#fff;margin-top:8px;">
        ${rows
          .map(
            (r, i) =>
              `<div class="wx-cell" onclick="toastDev()" style="${i === rows.length - 1 ? "" : "border-bottom:.5px solid #f0f0f0;"}"><div class="wx-cell-label">${r}</div><div class="wx-cell-right"><span class="wx-cell-chev">${G.chevR}</span></div></div>`,
          )
          .join("")}
      </div>
      <div style="background:#fff;margin-top:8px;">
        ${wxCell("清空缓存", `<span style="color:#999;font-size:13px;">0 KB</span><span class="wx-cell-chev">${G.chevR}</span>`, "toastDev('缓存已经空啦~')", true)}
      </div>
    </div>`,
  };
};


window.wxProfileMenu = function () {
  const blocked = window._wxBlocked && window._wxBlocked[chatId];
  wxActionSheet("", [
    { label: "设置备注和标签", onClick: () => toastDev("备注信息已记下~") },
    { label: "朋友权限", onClick: () => toastDev("朋友权限暂时不用设置~") },
    {
      label: blocked ? "移出黑名单" : "加入黑名单",
      danger: !blocked,
      onClick: () => (blocked ? wxUnblockChat(chatId) : wxBlockChat(chatId)),
    },
    { label: "投诉", onClick: () => toastDev() },
  ]);
};

VIEWS.wx_profile = () => {
  const role = CFG.roles?.[chatId] || { initial: chatId.charAt(0) };
  const avatar = role.avatar || G.sil;
  const data = MOCK_MOMENTS_DATA[chatId] || { wxid: "wxid_default", region: "未知", posts: [] };
  const thumbnails = (data.posts || []).flatMap(p => p.images).slice(0, 4);

  return {
    cls: "wx-list",
    html: `
    <div class="wx-head" style="background:#fff; border-bottom:0.5px solid #e5e5ea; position:absolute; z-index:10; width:100%;">
      <!-- 👇 左侧留空，全局会自动注入返回键 -->
      <div class="wx-head-left"></div>
      <h1 style="opacity:0;">资料</h1>
      <div class="wx-actions"><span style="display:flex;cursor:pointer;" onclick="wxProfileMenu()">${G.dotsH}</span></div>
    </div>

    <div class="wx-scroll" style="background:#f7f7f7; padding-top: 88px; padding-bottom:20px;">
      
      <div style="background:#fff; padding: 20px 16px; display:flex; align-items:flex-start; border-bottom:0.5px solid #e5e5ea; margin-bottom:10px;">
        <div style="width:64px; height:64px; border-radius:8px; overflow:hidden; margin-right:16px; flex-shrink:0;">
          <img src="${avatar}" style="width:100%;height:100%;object-fit:cover;">
        </div>
        <div style="flex:1;">
          <div style="font-size:22px; font-weight:600; color:#111; display:flex; align-items:center; gap:6px;">
            ${esc(wxName(chatId))}
            <span style="font-size:14px; color:#5ac8fa; font-weight:normal;">♂</span>
          </div>
          <div style="font-size:14px; color:#666; margin-top:6px;">微信号：${(CFG.wxids && CFG.wxids[chatId]) || data.wxid || "wxid_" + chatId}</div>
          <div style="font-size:14px; color:#666; margin-top:4px;">地区：${data.region}</div>
        </div>
      </div>

      <div style="background:#fff; padding: 16px; border-top:0.5px solid #e5e5ea; border-bottom:0.5px solid #e5e5ea; margin-bottom:10px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span style="font-size:16px; font-weight:600; color:#111;">朋友资料</span>
          <span>${G.chevR}</span>
        </div>
        <div style="font-size:13px; color:#999; line-height:1.4;">添加朋友的备注名、电话、标签、备忘、照片等，并设置朋友权限。</div>
      </div>

      <div onclick="window._momentsUserFrom='wx_profile'; push('wx_moments_user')" style="background:#fff; padding: 16px; display:flex; align-items:center; border-top:0.5px solid #e5e5ea; border-bottom:0.5px solid #e5e5ea; margin-bottom:10px;">
        <span style="font-size:16px; font-weight:600; color:#111; margin-right:16px;">朋友圈</span>
        <div style="flex:1; display:flex; gap:4px; overflow:hidden; justify-content:flex-start;">
          ${thumbnails.map(img => `<img src="${img}" style="width:46px; height:46px; object-fit:cover; border-radius:2px;">`).join('')}
        </div>
        <span style="margin-left:12px;">${G.chevR}</span>
      </div>

      <div style="background:#fff; border-top:0.5px solid #e5e5ea; border-bottom:0.5px solid #e5e5ea;">
        <div onclick="window._chatBackTo=null; push('chat')" style="padding: 16px; display:flex; align-items:center; justify-content:center; gap:8px; color:#576b95; font-size:17px; border-bottom:0.5px solid #e5e5ea; cursor:pointer;" onpointerdown="this.style.background='#f0f0f0'" onpointerup="this.style.background='#fff'">
          ${G.chat.replace('<svg', '<svg width="22" height="22"')} 发消息
        </div>
        <div onclick="if(typeof dial==='function'){dial(chatId)}else{toastDev()}" style="padding: 16px; display:flex; align-items:center; justify-content:center; gap:8px; color:#576b95; font-size:17px; cursor:pointer;" onpointerdown="this.style.background='#f0f0f0'" onpointerup="this.style.background='#fff'">
          ${G.handset.replace('<svg', '<svg width="22" height="22"')} 音视频通话
        </div>
      </div>

    </div>`,
  };
};

