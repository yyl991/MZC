// 自动拆分自 app_wechat.js（2026-10-28）
VIEWS.wx_moments_user = () => {
  const role = CFG.roles?.[chatId] || { initial: chatId.charAt(0) };
  const avatar = role.avatar || G.sil;
  const data = MOCK_MOMENTS_DATA[chatId] || { cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800", posts: [] };

  window._wxMomentUserFeed = data.posts || [];

  return {
    cls: "wx-list",
    html: `
    <!-- 👇 手写的返回键已全部删除，交给 app.js 自动生成 -->

    <div class="wx-scroll" id="wx-moments-scroll" style="background:#fff; padding-top:0; padding-bottom:20px;">
      
      <div style="position:relative; height:320px; background:url('${data.cover}') center/cover;">
        <div style="position:absolute; right:16px; bottom:-20px; display:flex; align-items:flex-end; gap:12px;">
          <span style="color:#fff; font-size:16px; font-weight:500; text-shadow:0 1px 3px rgba(0,0,0,0.5); padding-bottom:24px;">${esc(wxName(chatId))}</span>
          <img src="${avatar}" onclick="event.stopPropagation(); window._profileFrom='wx_moments_user'; push('wx_profile')" style="width:72px; height:72px; border-radius:8px; border:2px solid #fff; object-fit:cover; cursor:pointer;">
        </div>
      </div>

      <div style="margin-top:30px;">
        <!-- 空状态：长横线+圆点+长横线 -->
        ${(data.posts || []).length === 0 ? `
          <div style="display:flex; align-items:center; justify-content:center; gap:12px; margin-top: 80px;">
            <div style="width: 80px; height: 1px; background: #dcdcdc;"></div>
            <div style="width: 4px; height: 4px; background: #dcdcdc; border-radius: 50%;"></div>
            <div style="width: 80px; height: 1px; background: #dcdcdc;"></div>
          </div>
        ` : ''}
        
        ${(data.posts || []).map((post, index) => `
          <div onclick="openMomentDetailFromUserFeed(${index})" style="display:flex; gap:16px; padding:16px; border-bottom:0.5px solid #f0f0f0; cursor:pointer;">
            <div style="width:44px; height:44px; flex-shrink:0;">
               <img src="${avatar}" style="width:100%; height:100%; border-radius:6px; object-fit:cover;">
            </div>
            <div style="flex:1; min-width:0;">
              <div style="color: #576b95; font-size: 16px; font-weight: 600; margin-bottom: 4px;">${esc(wxName(chatId))}</div>
              <div style="font-size:15px; color:#111; line-height:1.45; margin-bottom:8px; white-space:pre-wrap;">${esc(post.text)}</div>
              ${post.images && post.images.length > 0 ? `
                <div style="display:grid; grid-template-columns:repeat(${post.images.length === 1 ? 1 : 3}, 1fr); gap:4px; margin-bottom: 6px; max-width:${post.images.length === 1 ? '180px' : '100%'};">
                  ${post.images.map(img => `<div style="${post.images.length === 1 ? 'aspect-ratio:4/3' : 'aspect-ratio:1'}; background:#eee; border-radius:2px; overflow:hidden;"><img src="${img}" style="width:100%;height:100%;object-fit:cover;"></div>`).join('')}
                </div>
              ` : ''}
              <div style="font-size: 13px; color: #999; margin-top: 8px;">${post.time || '刚刚'}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>`,
    init: (pg) => {
      const scroll = pg.querySelector('#wx-moments-scroll');
      scroll.addEventListener('scroll', () => {
        // 由于删了 nav，这里滑动变色逻辑也删了
      });
    }
  };
};

VIEWS.wx_moments_detail = () => {
  let post, avatar, authorName;

  if (window._currentMomentDetail) {
    post = window._currentMomentDetail.post;
    avatar = window._currentMomentDetail.avatar;
    authorName = window._currentMomentDetail.author;
  } else {
    const role = CFG.roles?.[chatId] || { initial: chatId.charAt(0) };
    avatar = role.avatar || G.sil;
    authorName = wxName(chatId);
    const data = MOCK_MOMENTS_DATA[chatId] || { posts: [] };
    const postId = window._currentMomentId || 1;
    post = data.posts.find(p => p.id === postId) || data.posts[0];
  }

  if (!post) return { html: "动态不存在" };

  const getLikeAvatar = (user) => {
    if (user === "我") return CFG.myAvatar || G.sil;
    return (CFG.roles && CFG.roles[user] && CFG.roles[user].avatar) ? CFG.roles[user].avatar : G.sil;
  };

  return {
    cls: "wx-list",
    html: `
    <!-- 👇 顶部换成带返回键的标准 nav，删掉原来的 wx-head -->
    <div class="nav solid" style="background:#ededed; position:absolute; z-index:10; width:100%; border-bottom:none;">
      <button class="nb-back" onclick="back()" style="border:none; background:none; cursor:pointer; color:#111; pointer-events: auto;">${G.chevL}</button>
      <div class="nb-title" style="opacity:1; font-size:17px; color:#111;">详情</div>
      <div class="nb-right"></div>
    </div>

    <div class="wx-scroll" style="background:#fff; padding-top: 98px; padding-bottom: 60px;">
      
      <!-- 设置统一的左右内边距 -->
      <div style="padding: 16px;">
        
        <!-- 顶部左右结构：大头像 + 右侧内容 -->
        <div style="display:flex; gap: 12px; align-items: flex-start;">
          
          <!-- 左侧头像 -->
          <img src="${avatar}" onclick="event.stopPropagation(); openWxProfileFromDetail()" style="width:40px; height:40px; border-radius:6px; object-fit:cover; flex: none; cursor:pointer;">
          
          <!-- 右侧文字、图片、时间等 -->
          <div style="flex:1; min-width:0;">
            <div style="color:#576b95; font-size:16px; font-weight:600; margin-bottom: 6px;">${esc(authorName)}</div>
            <div style="font-size:15px; color:#111; line-height:1.45; margin-bottom:8px; white-space:pre-wrap;">${esc(post.text)}</div>
            
            ${(() => {
              const imgs = post.images || [];
              if (!imgs.length) return "";
              const cols = imgs.length === 1 ? 1 : imgs.length <= 4 ? 2 : 3;
              const box = imgs.length === 1 ? "width:72%;aspect-ratio:4/3;" : "width:100%;aspect-ratio:1;";
              return `<div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:4px;max-width:${cols === 1 ? "72%" : "100%"};margin-bottom:10px;">${imgs
                .map((img) => `<img src="${img}" style="${box}object-fit:cover;border-radius:3px;display:block;cursor:pointer;" onclick="event.stopPropagation();openMediaViewer(['${img}'], 0)">`)
                .join("")}</div>`;
            })()}

            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px;">
              <div style="font-size:13px; color:#999;">${post.time || '刚刚'}</div>
              <div style="display:flex; align-items:center; gap:8px;">
                <div style="display:inline-flex; align-items:center; background:#4c4c4c; border-radius:6px; overflow:hidden;">
                  <button onclick="event.stopPropagation();wxMomentLikeCurrent()" style="display:flex;align-items:center;gap:5px;background:none;border:none;color:#fff;font-size:14px;padding:8px 14px;font-family:inherit;">${G.heart.replace('<svg', '<svg width="16" height="16" style="color:#fff;"')} 赞</button>
                  <span style="width:.5px;height:20px;background:#666;"></span>
                  <button onclick="event.stopPropagation();wxMomentCommentCurrent()" style="display:flex;align-items:center;gap:5px;background:none;border:none;color:#fff;font-size:14px;padding:8px 14px;font-family:inherit;">${G.comment.replace('<svg', '<svg width="16" height="16" style="color:#fff;"')} 评论</button>
                </div>
                <div style="width:30px;height:26px;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.12);border-radius:6px;display:grid;place-items:center;color:#333;cursor:pointer;" onclick="event.stopPropagation();wxMomentActionsCurrent()">${G.dotsH}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 灰框（点赞评论）：跳出右侧容器，直接占满下方，左边缘与上方大头像对齐 -->
        <div style="background:#f7f7f7; border-radius:6px; margin-top: 10px; padding: 12px 12px 12px 0; display: ${((post.likes && post.likes.length) || (post.comments && post.comments.length)) ? "flex" : "none"}; flex-direction: column; gap: 10px;">
          
          <!-- 点赞区 -->
          ${post.likes && post.likes.length > 0 ? `
            <div style="display:flex; align-items:flex-start; ${post.comments && post.comments.length > 0 ? 'border-bottom:0.5px solid #e5e5ea; padding-bottom:10px;' : ''}">
              <!-- 第一列占位 52px，图标居左，对齐大头像中心 -->
              <div style="width: 52px; flex: none; display: flex; justify-content: flex-start; padding-left: 10px;">
                 ${G.heart.replace('<svg', '<svg width="20" height="20" style="color:#576b95;"')}
              </div>
              <!-- 第二列从 52px 处开始，与上方文字完美对齐 -->
              <div style="display:flex; gap:6px; flex-wrap:wrap; flex: 1; align-items:center;">
                ${post.likes.map(name => `<img src="${getLikeAvatar(name)}" onclick="event.stopPropagation(); window.openWxProfileByName('${name}', 'wx_moments_detail')" style="width:24px; height:24px; border-radius:4px; object-fit:cover; cursor:pointer;">`).join('')}
              </div>
            </div>
          ` : ''}

          <!-- 评论区 -->
          ${(post.comments || []).map((c, index) => `
            <div style="display:flex; align-items:flex-start;">
              <!-- 第一列占位 52px -->
              <div style="width: 52px; flex: none; display: flex; justify-content: flex-start; padding-left: 10px; margin-top: 2px;">
                 ${index === 0 ? G.comment.replace('<svg', '<svg width="20" height="20" style="color:#576b95;"') : ''}
              </div>
              <!-- 第二列头像从 52px 处开始，与上方文字完美对齐 -->
              <img src="${getLikeAvatar(c.user)}" onclick="event.stopPropagation(); window.openWxProfileByName('${c.user}', 'wx_moments_detail')" style="width: 24px; height: 24px; border-radius: 4px; object-fit: cover; flex: none; margin-right: 8px; margin-top: 2px;">
              <!-- 第三列名字和内容 -->
              <div style="flex:1; min-width:0;">
                <div style="color:#576b95; font-size:14px; font-weight:500;">
                  <span onclick="event.stopPropagation(); window.openWxProfileByName('${c.user}', 'wx_moments_detail')" style="cursor:pointer;">${esc(c.user)}</span>
                  ${c.replyTo ? `<span style="color:#111; font-weight:normal;"> 回复 </span><span onclick="event.stopPropagation(); window.openWxProfileByName('${c.replyTo}', 'wx_moments_detail')" style="color:#576b95; cursor:pointer;">${esc(c.replyTo)}</span>` : ''}
                </div>
                <div style="font-size:14px; color:#111; line-height:1.4; margin-top:2px;">${esc(c.text)}</div>
              </div>
            </div>
          `).join('')}

        </div>

      </div>
    </div>

    <div style="position:absolute; bottom:0; left:0; right:0; height:50px; background:#f7f7f7; border-top:0.5px solid #e5e5ea; display:flex; align-items:center; padding:0 12px; gap:12px;">
      <div onclick="wxMomentCommentCurrent()" style="flex:1; background:#fff; height:34px; border-radius:4px; display:flex; align-items:center; padding:0 10px; color:#999; font-size:14px; cursor:text;">发表评论：</div>
      <span style="font-size:20px;cursor:pointer;" onclick="wxMomentCommentCurrent()">${G.smile}</span>
      <span style="font-size:20px;cursor:pointer;" onclick="toastDev('朋友圈图片功能还没做~')">${G.photo}</span>
      <button onclick="wxMomentCommentCurrent()" style="height:30px;padding:0 14px;border-radius:5px;background:#07c160;color:#fff;border:none;font-size:14px;font-family:inherit;opacity:.55;">发送</button>
    </div>`,
    init: () => {}
  };
};

/* ================= 朋友圈交互 / 发表 ================= */
window.wxRefreshWxView = function () {
  if (["moments", "wx_moments_detail", "wx_moments_user", "wx_moments_self"].indexOf(view) < 0) return;
  const old = APP.lastElementChild;
  let top = 0;
  if (old) {
    const sc = old.querySelector(".wx-scroll, .scroll");
    if (sc) top = sc.scrollTop;
  }
  show(view, "none");
  const pg = APP.lastElementChild;
  if (pg) {
    const sc = pg.querySelector(".wx-scroll, .scroll");
    if (sc) sc.scrollTop = top;
  }
};
window.wxMomentComment = function (post) {
  if (!post) return;
  wxPrompt("评论", "说点什么...", function (txt) {
    post.comments = post.comments || [];
    post.comments.push({ user: "我", text: txt, replyTo: "" });
    wxRefreshWxView();
    toastDev("评论成功");
  });
};
window.wxMomentActions = function (post) {
  if (!post) return;
  const likes = (post.likes = post.likes || []);
  const liked = likes.indexOf("我") >= 0;
  wxActionSheet("", [
    {
      label: liked ? "取消赞" : "赞",
      onClick: () => {
        if (liked) {
          const i = likes.indexOf("我");
          if (i >= 0) likes.splice(i, 1);
        } else likes.push("我");
        wxRefreshWxView();
      },
    },
    { label: "评论", onClick: () => wxMomentComment(post) },
  ]);
};
window.wxMomentActionsFromFeed = function (i) {
  wxMomentActions((window._wxMomentFeed || [])[i]);
};
window.wxMomentLikeCurrent = function () {
  const p = window._currentMomentDetail && window._currentMomentDetail.post;
  if (!p) return;
  p.likes = p.likes || [];
  const i = p.likes.indexOf("我");
  if (i >= 0) p.likes.splice(i, 1);
  else p.likes.push("我");
  if (typeof vib === "function") vib(8);
  if (i < 0 && typeof sfx === "function") sfx("send");
  show("wx_moments_detail", "none");
};

window.wxMomentActionsCurrent = function () {
  wxMomentActions(window._currentMomentDetail && window._currentMomentDetail.post);
};
window.wxMomentCommentCurrent = function () {
  wxMomentComment(window._currentMomentDetail && window._currentMomentDetail.post);
};
window.openMomentDetailFromSelf = function (i) {
  const p = (window._wxMyPosts || [])[i];
  if (!p) return;
  window._momentDetailFrom = "wx_moments_self";
  window._currentMomentDetail = {
    author: "小狗团汪汪",
    authorId: "我",
    avatar: CFG.myAvatar || G.sil,
    post: p,
  };
  push("wx_moments_detail");
};

window._wxComposeFrom = "moments";
window.openMomentCompose = function () {
  window._wxComposeFrom = view || "moments";
  window._wxComposeImages = [];
  push("wx_moment_compose");
};
window.wxComposeBack = function () {
  show(window._wxComposeFrom || "moments", "pop");
};
window.wxComposePick = function () {
  if (typeof openPhoneAlbumPicker !== "function")
    return toastDev("相册还没准备好~");
  openPhoneAlbumPicker({
    multiple: true,
    max: 9,
    imagesOnly: true,
    onDone: function (urls) {
      urls.forEach(function (u) {
        if (window._wxComposeImages.length < 9)
          window._wxComposeImages.push(u);
      });
      wxRenderComposeImages();
    },
  });
};
window.wxComposeRemove = function (i) {
  window._wxComposeImages.splice(i, 1);
  wxRenderComposeImages();
};
window.wxRenderComposeImages = function () {
  const box = document.getElementById("wx-compose-imgs");
  if (!box) return;
  box.innerHTML =
    window._wxComposeImages
      .map(
        (u, i) =>
          `<div class="wx-compose-img"><img src="${u}"><button onclick="event.stopPropagation();wxComposeRemove(${i})">×</button></div>`,
      )
      .join("") +
    (window._wxComposeImages.length < 9
      ? `<div class="wx-compose-add" onclick="wxComposePick()">＋</div>`
      : "");
};
window.wxPublishMoment = function () {
  const ta = document.getElementById("wx-compose-text");
  const text = ta ? ta.value.trim() : "";
  const imgs = (window._wxComposeImages || []).slice();
  if (!text && !imgs.length) return toastDev("写点什么再发表吧~");
  window._wxMyPosts.unshift({
    id: Date.now(),
    date: { day: "今天", month: "" },
    text,
    images: imgs,
    location: "",
    time: "刚刚",
    likes: [],
    comments: [],
  });
  window._wxComposeImages = [];
  show(window._wxComposeFrom || "moments", "pop");
  setTimeout(() => toastDev("发表成功"), 260);
};
VIEWS.wx_moment_compose = () => ({
  cls: "wx-list",
  html: `
  <div class="nav solid" style="background:#fff;border-bottom:.5px solid #e5e5ea;">
    <button onclick="wxComposeBack()" style="justify-self:start;border:none;background:none;color:#111;font-size:16px;cursor:pointer;">取消</button>
    <div class="nb-title" style="opacity:1;">发表</div>
    <button onclick="wxPublishMoment()" style="justify-self:end;border:none;background:none;color:#07c160;font-size:16px;font-weight:600;cursor:pointer;">发表</button>
  </div>
  <div class="wx-scroll" style="padding-top:98px;background:#fff;padding-bottom:30px;">
    <div style="padding:16px;">
      <textarea id="wx-compose-text" class="wx-compose-text" placeholder="这一刻的想法..."></textarea>
      <div id="wx-compose-imgs" class="wx-compose-imgs"></div>
      <div class="wx-compose-row" onclick="toastDev()"><span>📍 所在位置</span><span class="wx-compose-hint">所在位置</span></div>
      <div class="wx-compose-row" onclick="toastDev()"><span>👥 谁可以看</span><span class="wx-compose-hint">公开</span></div>
    </div>
  </div>`,
  init: () => {
    wxRenderComposeImages();
    setTimeout(() => {
      const t = document.getElementById("wx-compose-text");
      if (t) t.focus();
    }, 100);
  },
});
VIEWS.wx_moments_self = () => {
  const posts = window._wxMyPosts || [];
  const cover = MOCK_MOMENTS_DATA["穆祉丞"]?.cover || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800";
  const myAvatar = CFG.myAvatar || "./data/avatar/miantuan.jpg";
  return {
    cls: "wx-list",
    html: `
    <div class="wx-scroll" style="background:#fff;padding-bottom:20px;">
      <div style="position:relative;height:320px;background:url('${cover}') center/cover;">
        <div style="position:absolute;inset:0;background:linear-gradient(transparent 60%,rgba(0,0,0,.35));"></div>
        <button class="nb-back" onclick="back()" style="position:absolute;top:45px;left:10px;z-index:20;width:36px;height:36px;border-radius:50%;border:none;background:rgba(0,0,0,.25);color:#fff;display:grid;place-items:center;cursor:pointer;">${G.chevL}</button>
        <button onclick="openMomentCompose()" style="position:absolute;top:45px;right:14px;z-index:20;border:none;background:rgba(0,0,0,.25);color:#fff;border-radius:18px;padding:7px 12px;font-size:13px;cursor:pointer;">发表</button>
        <div style="position:absolute;right:16px;bottom:-20px;display:flex;align-items:flex-end;gap:12px;">
          <span style="color:#fff;font-size:16px;font-weight:500;text-shadow:0 1px 3px rgba(0,0,0,.5);padding-bottom:24px;">小狗团汪汪</span>
          <img src="${myAvatar}" style="width:72px;height:72px;border-radius:8px;border:2px solid #fff;object-fit:cover;">
        </div>
      </div>
      <div style="margin-top:30px;">
        ${
          posts.length === 0
            ? `<div class="wx-moments-empty"><div class="wx-moments-empty-line"></div><div class="wx-moments-empty-dot"></div><div class="wx-moments-empty-line"></div></div>
               <div style="text-align:center;color:#999;font-size:14px;margin-top:16px;">还没有发过朋友圈</div>
               <div style="text-align:center;margin-top:16px;"><button class="wx-mini-btn" style="padding:7px 18px;" onclick="openMomentCompose()">发表第一条</button></div>`
            : posts
                .map(
                  (post, index) => `<div onclick="openMomentDetailFromSelf(${index})" style="display:flex;gap:16px;padding:16px;border-bottom:.5px solid #f0f0f0;cursor:pointer;">
              <div style="width:44px;height:44px;flex-shrink:0;"><img src="${myAvatar}" style="width:100%;height:100%;border-radius:6px;object-fit:cover;"></div>
              <div style="flex:1;min-width:0;">
                <div style="color:#576b95;font-size:16px;font-weight:600;margin-bottom:4px;">小狗团汪汪</div>
                <div style="font-size:15px;color:#111;line-height:1.45;margin-bottom:8px;white-space:pre-wrap;">${esc(post.text)}</div>
                ${
                  post.images && post.images.length
                    ? `<div style="display:grid;grid-template-columns:repeat(${post.images.length === 1 ? 1 : 3},1fr);gap:4px;margin-bottom:6px;max-width:${post.images.length === 1 ? "180px" : "100%"};">${post.images
                        .map(
                          (img) =>
                            `<div style="${post.images.length === 1 ? "aspect-ratio:4/3" : "aspect-ratio:1"};background:#eee;border-radius:2px;overflow:hidden;"><img src="${img}" style="width:100%;height:100%;object-fit:cover;"></div>`,
                        )
                        .join("")}</div>`
                    : ""
                }
                <div style="font-size:13px;color:#999;margin-top:8px;">${esc(post.time || "刚刚")}</div>
              </div>
            </div>`,
                )
                .join("")
        }
      </div>
    </div>`,
  };
};

VIEWS.moments = () => {
  let allPosts = [];
  for (const user in MOCK_MOMENTS_DATA) {
    const userData = MOCK_MOMENTS_DATA[user];
    const userAvatar = CFG.roles?.[user]?.avatar || userData.avatar || G.sil;
    
    userData.posts.forEach(post => {
      allPosts.push({
        ...post,
        author: user,
        avatar: userAvatar
      });
    });
  }
  (window._wxMyPosts || []).forEach((post) => {
    allPosts.push({
      ...post,
      author: "小狗团汪汪",
      avatar: CFG.myAvatar || G.sil,
    });
  });
  allPosts.sort((a, b) => b.id - a.id);

  window._wxMomentFeed = allPosts;

  const renderImages = (images) => {
    if (!images || images.length === 0) return '';
    const isSingle = images.length === 1;
    return `
      <div style="display: grid; grid-template-columns: ${isSingle ? '1fr' : 'repeat(3, 1fr)'}; gap: 4px; margin-top: 8px; margin-bottom: 8px; max-width: ${isSingle ? '200px' : '100%'};">
        ${images.map(img => `
          <div style="${isSingle ? 'aspect-ratio: 4/3;' : 'aspect-ratio: 1;'} background: #eee; border-radius: 4px; overflow: hidden;" onclick="event.stopPropagation(); openMediaViewer(['${img}'], 0)">
            <img src="${img}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
        `).join('')}
      </div>
    `;
  };

  const renderSocial = (likes, comments) => {
    if ((!likes || likes.length === 0) && (!comments || comments.length === 0)) return '';
    let html = `<div style="background: #f7f7f7; border-radius: 4px; padding: 8px 10px; margin-top: 8px; font-size: 14px; line-height: 1.5;">`;
    
    if (likes && likes.length > 0) {
      const namesHTML = likes.map((n, i) => {
        const isLast = i === likes.length - 1;
        return `<span onclick="event.stopPropagation(); window.openWxProfileByName('${n}', 'moments')" style="color: #576b95; font-weight: 500; cursor:pointer;">${esc(n)}</span>${isLast ? '' : '<span style="color: #576b95;">，</span>'}`;
      }).join('');
      
      html += `<div style="display:flex; gap:6px; align-items:flex-start; ${comments && comments.length > 0 ? 'border-bottom:0.5px solid #e5e5ea; padding-bottom:8px; margin-bottom:8px;' : ''}">
                 <div style="width: 18px; height: 18px; flex:none; display:flex; align-items:center; justify-content:center; margin-top:2px;">
                   ${G.heart.replace('<svg', '<svg width="18" height="18" style="color:#576b95;"')}
                 </div>
                 <div style="flex:1;">${namesHTML}</div>
               </div>`;
    }
    
    if (comments && comments.length > 0) {
      comments.forEach(c => {
        html += `<div style="margin-top: 4px;">`;
        html += `<span onclick="event.stopPropagation(); window.openWxProfileByName('${c.user}', 'moments')" style="color: #576b95; font-weight: 500; cursor:pointer;">${esc(c.user)}</span>`;
        if (c.replyTo) {
          html += ` <span style="color: #111;">回复</span> <span onclick="event.stopPropagation(); window.openWxProfileByName('${c.replyTo}', 'moments')" style="color: #576b95; font-weight: 500; cursor:pointer;">${esc(c.replyTo)}</span>`;
        }
        html += `<span style="color: #111;">：${esc(c.text)}</span>`;
        html += `</div>`;
      });
    }
    html += `</div>`;
    return html;
  };

  return {
    cls: "dark",
    html: `
    <div class="nav" id="moments-nav" style="position: absolute; z-index: 10; top: 0; left: 0; right: 0; height: 98px; padding: 54px 16px 0; display: flex; align-items: center; justify-content: space-between; color: #fff; background: transparent; transition: background 0.3s, color 0.3s; box-shadow: none; pointer-events: none;">
      <button class="nb-back" onclick="back()" style="pointer-events:auto; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));">${G.chevL}</button>
      <div id="moments-nav-title" style="position: absolute; left: 50%; transform: translateX(-50%); font-size: 17px; font-weight: 600; opacity: 0; transition: opacity 0.3s;">朋友圈</div>
      <div style="pointer-events:auto; display: flex; gap: 18px; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));">
        <span onclick="openMomentCompose()" style="cursor:pointer;">${G.camera}</span>
      </div>
    </div>

    <div class="scroll" id="moments-scroll" style="background: #fff; padding-top: 0; padding-bottom: 40px;">
      
      <div style="position: relative; height: 300px; background: url('${MOCK_MOMENTS_DATA["穆祉丞"]?.cover || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800"}') center/cover;">
        <div style="position: absolute; inset: 0; background: linear-gradient(transparent 60%, rgba(0,0,0,0.4));"></div>
        
        <div style="position: absolute; bottom: 20px; right: 16px; display: flex; align-items: flex-end; gap: 12px;">
          <div style="text-align: right; color: #fff; padding-bottom: 4px;">
            <div style="font-size: 18px; font-weight: 600; text-shadow: 0 1px 3px rgba(0,0,0,0.5);">小狗团汪汪</div>
          </div>
          <img src="${CFG.myAvatar || './data/avatar/miantuan.jpg'}" style="width: 70px; height: 70px; border-radius: 8px; border: 2px solid #fff; object-fit: cover;">
        </div>
      </div>

      <div style="padding-bottom: 20px;">
        ${allPosts.map((m, index) => `
          <div onclick="openMomentDetailFromFeed(${index})" style="display: flex; gap: 12px; padding: 20px 16px; border-bottom: 0.5px solid #f0f0f0; cursor: pointer;">
            
            <img src="${m.avatar}" onclick="event.stopPropagation(); openWxProfileFromFeed(${index}, 'moments')" style="width: 44px; height: 44px; border-radius: 6px; object-fit: cover; flex-shrink: 0; cursor: pointer;">
            
            <div style="flex: 1; min-width: 0;">
              <div style="color: #576b95; font-size: 16px; font-weight: 600; margin-bottom: 4px;">${esc(m.author)}</div>
              <div style="font-size: 15px; color: #111; line-height: 1.45; white-space: pre-wrap; margin-bottom: 6px;">${esc(m.text)}</div>
              
              ${renderImages(m.images)}
              
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
                <span style="font-size: 12px; color: #999;">${esc(m.time)}</span>
                <div style="background: #f7f7f7; padding: 2px 8px; border-radius: 4px; color: #576b95; font-size: 13px; font-weight: 500; cursor: pointer;" onclick="event.stopPropagation(); wxMomentActionsFromFeed(${index})">•••</div>
              </div>

              ${renderSocial(m.likes, m.comments)}
            </div>
          </div>
        `).join('')}
      </div>
    </div>`,
    
    init: (pg) => {
      const nav = pg.querySelector('#moments-nav');
      const title = pg.querySelector('#moments-nav-title');
      const scroll = pg.querySelector('#moments-scroll');
      if (scroll && nav && title) {
        scroll.addEventListener('scroll', () => {
          if (scroll.scrollTop > 150) {
            nav.style.background = 'rgba(255, 255, 255, 0.96)';
            nav.style.backdropFilter = 'blur(10px)';
            nav.style.color = '#111';
            nav.style.boxShadow = '0 0.5px 0 #eee';
            title.style.opacity = '1';
            nav.querySelectorAll('.nb-back, div[style*="filter"]').forEach(el => el.style.filter = 'none');
          } else {
            nav.style.background = 'transparent';
            nav.style.backdropFilter = 'none';
            nav.style.color = '#fff';
            nav.style.boxShadow = 'none';
            title.style.opacity = '0';
            nav.querySelectorAll('.nb-back, div[style*="filter"]').forEach(el => el.style.filter = 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))');
          }
        });
      }
    }
  };
};