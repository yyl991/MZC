// core/store.js
window.Store = {
  // 1. 状态区
  state: {
    chats: {},            // 替代原来的 chatData
    unread: {},           // 替代原来的 unread
    story: {              // 替代原来的 STORY_STATE (SS)
      stage: {},
      lineIdx: {},
      fragments: new Set(),
      fired: new Set(),
      privateUnlocked: false,
    }
  },

  // 2. 操作方法区
  // 获取聊天记录
  getChats(name) {
    return this.state.chats[name] || [];
  },
  // 增加聊天记录
  pushChat(name, text, who, time) {
    if (!this.state.chats[name]) this.state.chats[name] = [];
    this.state.chats[name].push([text, who, time]);
  },
  // 增加未读数
  addUnread(name) {
    this.state.unread[name] = (this.state.unread[name] || 0) + 1;
  },
  // 清零未读
  clearUnread(name) {
    this.state.unread[name] = 0;
  }
};