// ==========================================
// 🎨 icons.js - 全局唯一图标库
// ==========================================
"use strict";

const g = (p, o = "") =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ${o}>${p}</svg>`;

window.G = {
  // ================= 基础通用 =================
  chevL: `<svg viewBox="0 0 12 20" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2 2 10l8 8"/></svg>`,
  chevR: `<svg class="chev" viewBox="0 0 8 13"><path d="m1.5 1.5 5 5-5 5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  chevRb: g('<path d="m9 5 7 7-7 7"/>'),
  chevLb: g('<path d="m15 5-7 7 7 7"/>'),
  chevDown: '<svg viewBox="0 0 10 6" width="10" height="6" fill="#111" style="margin-top:2px;"><path d="M0 0l5 6 5-6H0z"/></svg>',
  search: g('<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>'),
  plus: g('<path d="M12 5v14M5 12h14"/>'),
  plusSq: g('<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><path d="M12 8v8M8 12h8"/>'),
  dots: g('<circle cx="12" cy="12" r="9.2"/><circle cx="8" cy="12" r=".8" fill="currentColor"/><circle cx="12" cy="12" r=".8" fill="currentColor"/><circle cx="16" cy="12" r=".8" fill="currentColor"/>'),
  dotsH: g('<circle cx="5" cy="12" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="19" cy="12" r="1.2" fill="currentColor"/>'),
  gear: g('<circle cx="12" cy="12" r="3"/><path d="M12 2.8v2.6M12 18.6v2.6M2.8 12h2.6M18.6 12h2.6M5.5 5.5l1.8 1.8M16.7 16.7l1.8 1.8M5.5 18.5l1.8-1.8M16.7 7.3l1.8-1.8"/><circle cx="12" cy="12" r="6.4"/>'),
  person: g('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>'),
  chat: g('<path d="M12 4C7 4 3 7.1 3 11c0 2.4 1.5 4.5 3.9 5.8L6 20.5l4-2.4c.6.1 1.3.1 2 .1 5 0 9-3.1 9-7.1S17 4 12 4Z"/>'),
  bag: g('<path d="M5 8h14l-1 12H6Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>'),
  clock: g('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  star: g('<path d="m12 3.6 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9Z"/>'),
  contacts: g('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="9.5" r="3"/><path d="M6.8 18c.9-2.4 2.9-3.6 5.2-3.6s4.3 1.2 5.2 3.6"/>'),
  keypad: g('<g fill="currentColor" stroke="none"><circle cx="6" cy="5" r="1.7"/><circle cx="12" cy="5" r="1.7"/><circle cx="18" cy="5" r="1.7"/><circle cx="6" cy="11" r="1.7"/><circle cx="12" cy="11" r="1.7"/><circle cx="18" cy="11" r="1.7"/><circle cx="6" cy="17" r="1.7"/><circle cx="12" cy="17" r="1.7"/><circle cx="18" cy="17" r="1.7"/><circle cx="12" cy="22" r="1.5"/></g>'),
  info: g('<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5"/><circle cx="12" cy="7.8" r=".7" fill="currentColor"/>'),
  compose: g('<path d="M20 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h6"/><path d="M17.5 3.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4Z"/>'),
  share: g('<path d="M12 3v12M8 7l4-4 4 4"/><path d="M6 11v9h12v-9"/>'),
  heart: g('<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z"/>'),
  trash: g('<path d="M5 7h14M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/>'),
  book: g('<path d="M4 5.5C6 4.5 9 4.5 12 6c3-1.5 6-1.5 8-.5V19c-2-1-5-1-8 .5-3-1.5-6-1.5-8-.5Z"/><path d="M12 6v13.5"/>'),
  mic: g('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>'),
  globe: g('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.8 3.5 5.8 3.5 9s-1 6.2-3.5 9c-2.5-2.8-3.5-5.8-3.5-9s1-6.2 3.5-9Z"/>'),
  smile: g('<circle cx="12" cy="12" r="9"/><path d="M8.5 14.5c1.8 2 5.2 2 7 0"/><circle cx="9" cy="10" r=".9" fill="currentColor"/><circle cx="15" cy="10" r=".9" fill="currentColor"/>'),
  arrowUp: g('<path d="M12 19V5M6 11l6-6 6 6"/>'),
  home: g('<path d="M4 10.5 12 4l8 6.5V20h-5v-6H9v6H4Z"/>'),
  bell: g('<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15Z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>'),
  send: g('<path d="M21 3 10 14"/><path d="M21 3 14.5 21l-4.5-7-7-4.5Z"/>'),
  comment: g('<path d="M12 3.5a8.5 8.5 0 1 0 4.3 15.8l4.2 1.2-1.2-4.2A8.5 8.5 0 0 0 12 3.5Z"/>'),
  grid: g('<rect x="3.5" y="3.5" width="17" height="17" rx="1.5"/><path d="M9.2 3.5v17M14.8 3.5v17M3.5 9.2h17M3.5 14.8h17"/>'),
  camera: g('<path d="M4 8h3.5L9 5.5h6L16.5 8H20v11H4Z"/><circle cx="12" cy="13" r="3.5"/>'),
  photo: g('<rect x="3.5" y="5" width="17" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="m4 17 5-4.5 4 3.5 3-2.5 4 3.5"/>'),
  video: g('<rect x="3" y="6.5" width="13" height="11" rx="2"/><path d="m16 10.5 5-3v9l-5-3"/>'),
  list: g('<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r=".9" fill="currentColor"/><circle cx="4.5" cy="12" r=".9" fill="currentColor"/><circle cx="4.5" cy="18" r=".9" fill="currentColor"/>'),
  inbox: g('<path d="M3.5 13.5 6 5h12l2.5 8.5V19h-17Z"/><path d="M3.5 13.5H9a3 3 0 0 0 6 0h5.5"/>'),
  check: g('<circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.8 2.7L16 9.5"/>'),
  pen: g('<path d="m14.5 5.5 4 4L8 20H4v-4Z"/>'),
  alarm: g('<circle cx="12" cy="13" r="7.5"/><path d="M12 9.5V13l2.5 1.5M4.5 5 7 3M19.5 5 17 3"/>'),
  stopwatch: g('<circle cx="12" cy="13.5" r="7.5"/><path d="M12 13.5V9.5M10 2.5h4M12 2.5V6"/>'),
  timer: g('<circle cx="12" cy="12" r="8.5"/><path d="M12 12 8 8"/>'),
  musicNote: '<svg viewBox="0 0 24 24"><path d="M17 3v11.5a3 3 0 1 1-2-2.8V7.3l-6 1.4v8a3 3 0 1 1-2-2.8V5.5Z"/></svg>',
  playF: '<svg viewBox="0 0 24 24"><path d="M7 4.5v15l12.5-7.5Z"/></svg>',
  pauseF: '<svg viewBox="0 0 24 24"><rect x="6" y="4.5" width="4" height="15" rx="1"/><rect x="14" y="4.5" width="4" height="15" rx="1"/></svg>',
  handset: '<svg viewBox="0 0 24 24"><path d="M6.6 3.2c.6-.3 1.4-.1 1.8.5l1.9 3c.4.6.3 1.4-.2 1.9l-1.4 1.3a12.4 12.4 0 0 0 5.4 5.4l1.3-1.4c.5-.5 1.3-.6 1.9-.2l3 1.9c.6.4.8 1.2.5 1.8l-.9 1.9c-.5 1-1.6 1.6-2.7 1.4C10 19.6 4.4 14 3.3 6.8c-.2-1.1.4-2.2 1.4-2.7Z"/></svg>',
  voicemail: g('<circle cx="12" cy="12" r="9"/><path d="M8.5 15a4 4 0 0 1 0-6M15.5 9a4 4 0 0 1 0 6"/><path d="M12 9v6"/>'),
  bellF: '<svg viewBox="0 0 24 24"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15Z"/><circle cx="12" cy="20.5" r="2"/></svg>',
  msgF: '<svg viewBox="0 0 24 24"><path d="M12 4C7 4 3 7.1 3 11c0 2.4 1.5 4.5 3.9 5.8L6 20.5l4-2.4c.6.1 1.3.1 2 .1 5 0 9-3.1 9-7.1S17 4 12 4Z"/></svg>',
  shift: '<svg viewBox="0 0 24 24" width="22" fill="none" stroke="#000" stroke-width="1.7" stroke-linejoin="round"><path d="M12 4 4 12.5h4.5V20h7v-7.5H20Z"/></svg>',
  bksp: '<svg viewBox="0 0 26 20" width="26" fill="none" stroke="#000" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"><path d="M8 3h15v14H8l-6-7Z"/><path d="m12 7 6 6M18 7l-6 6"/></svg>',
  sil: '<svg viewBox="0 0 24 24"><circle cx="12" cy="9" r="4.3" fill="#fff"/><path d="M3.8 22c.6-4.4 4-7 8.2-7s7.6 2.6 8.2 7Z" fill="#fff"/></svg>',
  sun: '<svg viewBox="0 0 24 24" width="24"><circle cx="12" cy="12" r="5" fill="#ffd60a"/><g stroke="#ffd60a" stroke-width="2" stroke-linecap="round"><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></g></svg>',
  moon: '<svg viewBox="0 0 24 24" width="24"><path d="M15.5 3.5A8.5 8.5 0 1 0 20.5 15 7 7 0 0 1 15.5 3.5Z" fill="#fff"/></svg>',
  pcloud: '<svg viewBox="0 0 24 24" width="24"><circle cx="9" cy="9" r="4.2" fill="#ffd60a"/><path d="M8 19.5h9.5a3.5 3.5 0 0 0 .3-7A5 5 0 0 0 8.4 11 4.3 4.3 0 0 0 8 19.5Z" fill="#fff"/></svg>',
  cloud: '<svg viewBox="0 0 24 24" width="24"><path d="M7 19h10.5a4 4 0 0 0 .4-8A5.6 5.6 0 0 0 7.2 9.2 5 5 0 0 0 7 19Z" fill="#fff"/></svg>',

  // ================= B站 =================
  biliLightning: '<svg viewBox="0 0 24 24" width="10" height="10" fill="#fb7299"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
  biliSearch: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
  biliGame: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="4"/><path d="M6 12h4m-2-2v4M15 11h.01M18 13h.01"/></svg>',
  biliMessage: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
  biliMenu: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  biliPlay14: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m10 9 5 3-5 3z" fill="currentColor"/></svg>',
  biliDanmu14: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 9h4M7 13h8M7 17h5"/></svg>',
  biliLike16: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>',
  biliVideoPlay: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style="margin-left:2px;"><path d="M7 4.5v15l12.5-7.5Z"/></svg>',
  biliPlay12: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m10 9 5 3-5 3z" fill="currentColor"/></svg>',
  biliDanmu12: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 9h4M7 13h8M7 17h5"/></svg>',
  biliDots: '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>',
  biliTabHome: `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><path d="M9 15c.8 1 2.2 1 3 0" stroke-width="1.5"/><circle cx="9" cy="12" r="0.5" fill="currentColor"/><circle cx="15" cy="12" r="0.5" fill="currentColor"/></svg>`,
  biliTabFollow: `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12V4a4 4 0 0 1 4-4 4 4 0 0 1 4 4c0 2.2-1.8 4-4 4h-4z" /><path d="M12 12h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4c-2.2 0-4-1.8-4-4v-4z" /><path d="M12 12v8a4 4 0 0 1-4 4 4 4 0 0 1-4-4c0-2.2 1.8-4 4-4h4z" /><path d="M12 12H4a4 4 0 0 1-4-4 4 4 0 0 1 4-4c2.2 0 4 1.8 4 4v4z" /></svg>`,
  biliTabPlus: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>',
  biliTabBag: `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6h12l2 15H4L6 6z"/><path d="M9 6V4a3 3 0 0 1 6 0v2"/><text x="12" y="16" font-size="9" fill="currentColor" text-anchor="middle" font-weight="bold" stroke="none">购</text></svg>`,
  biliTabMe: `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="14" rx="3"/><path d="M8 3l4 4 4-4"/><line x1="9" y1="12" x2="9.01" y2="12" stroke-width="3"/><line x1="15" y1="12" x2="15.01" y2="12" stroke-width="3"/></svg>`,

  // ================= 微信 =================
  wxSearch: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>`,
  wxPlus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>`,
  wxTabChat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 4C7 4 3 7.1 3 11c0 2.4 1.5 4.5 3.9 5.8L6 20.5l4-2.4c.6.1 1.3.1 2 .1 5 0 9-3.1 9-7.1S17 4 12 4Z"/></svg>`,
  wxTabContacts: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>`,
  wxTabDiscover: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5Z"/></svg>`,
  wxTabMe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="7" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>`,
  wxPengyouquan: `<svg viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="11" fill="#41b883"/><circle cx="12" cy="12" r="4" fill="#fff"/><path d="M12 1a11 11 0 0 1 9.5 5.5H12V1z" fill="#ffd200"/><path d="M22 13a11 11 0 0 1-6 9.5V13h6z" fill="#e96923"/><path d="M12 23A11 11 0 0 1 2.5 17.5H12V23z" fill="#2b9ded"/></svg>`,
  wxShipinhao: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fa9d3b" stroke-width="2"><path d="M4 8c4-4 12-4 16 0M4 16c4 4 12 4 16 0"/><circle cx="8" cy="8" r="2" fill="#fa9d3b"/><circle cx="16" cy="16" r="2" fill="#fa9d3b"/></svg>`,
  wxZhibo: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fa5151" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="#fa5151"/></svg>`,
  wxSaoyisao: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#4a90e2" stroke-width="2"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/><path d="M3 12h18"/></svg>`,
  wxTingyiting: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fa5151" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  wxKanyikan: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#f5c84c" stroke-width="2"><path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/></svg>`,
  wxSouyisou: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fa5151" stroke-width="2"><path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M5 19l4-4M15 9l4-4"/></svg>`,
  wxFujin: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#4a90e2" stroke-width="2"><circle cx="9" cy="8" r="3"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><circle cx="17" cy="10" r="2"/><path d="M17 15a3 3 0 0 1 3 3v3"/></svg>`,
  wxYouxi: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke-width="2"><polygon points="12,2 22,8 22,16 12,22 2,16 2,8" fill="#a2e6ff" stroke="#4a90e2"/><polygon points="12,2 22,8 12,12 2,8" fill="#ffd200" stroke="#e9a623"/><polygon points="12,12 22,8 22,16 12,22" fill="#fa5151" stroke="#c73b3b"/></svg>`,
  wxXiaochengxu: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#8c65e3" stroke-width="2"><path d="M18 6a8 8 0 0 0-11.3 0M6 18a8 8 0 0 0 11.3 0"/><circle cx="12" cy="12" r="3"/></svg>`,

  // ================= 通用 / 页面内小图标 =================
  backThin: `<svg viewBox="0 0 12 20" width="10" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2 2 10l8 8"/></svg>`,
  calSmall: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>`,
  mapRoad: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fff" stroke-width="1.8"><path d="M9 20l-5.5 2.5V6L9 3.5M9 20l6-2.5M9 20V3.5M15 17.5l5.5 2.5V8L15 5.5M15 17.5V5.5"/></svg>`,
  listWhite: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
  mailCheck: `<svg viewBox="0 0 24 24" width="14" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`,
  mailList: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none"/></svg>`,
  mailCompose: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  mailTrash: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4.5h8V6M5.5 6l1 14h11l1-14"/></svg>`,
  mailShare: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>`,
  mailReply: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>`,
  mailDots: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none"/></svg>`,
  smsCompose: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`,
  vinylTonearm: `<svg class="tonearm" viewBox="0 0 100 100"><circle cx="93" cy="7" r="4" fill="#777"/><circle cx="93" cy="7" r="2.2" fill="#ddd"/><circle cx="93" cy="7" r="1" fill="#333"/><path d="M 93 7 L 93 70 L 73 91" fill="none" stroke="#555" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M 93 7 L 93 70 L 73 91" fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><g transform="translate(72, 90) rotate(42)"><rect x="-1.75" y="0" width="3.5" height="7" rx="1" fill="#fff"/><rect x="-1.25" y="0" width="2.5" height="1.8" fill="#ccc"/><circle cx="0" cy="5.2" r="0.6" fill="#ff3b30"/></g></svg>`,

  // ================= 微博 =================
  wbSearch: '<svg viewBox="0 0 24 24" width="18" height="18" fill="#5c8bd6"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>',
  wbDiscover: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/><circle cx="16" cy="8" r="5" fill="#ff3b30" stroke="none"/><text x="16" y="10" font-size="6" fill="#fff" text-anchor="middle" font-weight="bold">热</text></svg>',
  wbTabHome: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M12 3 2 10v11h7v-7h6v7h7V10L12 3z"/></svg>',
  wbTabVideo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><rect x="2" y="6" width="20" height="12" rx="4"/><path d="m10 10 5 2-5 2v-4z" fill="currentColor"/></svg>',
  wbTabMessage: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
  wbTabMe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  wbForward18: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m15 5-7 7 7 7"/><path d="M20 12H8"/></svg>',
  wbComment18: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
  wbLike18: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>',
  wbForward22: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m15 5-7 7 7 7"/><path d="M20 12H8"/></svg>',
  wbComment22: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
  wbLike22: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>',
  wbGridXiangce: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#222" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5" fill="#ff8200" stroke="none"/><polyline points="21 15 16 10 5 21" stroke="#222"/></svg>',
  wbGridZan: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#222" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polygon points="12 7 13.5 10.5 17 11 14.5 13.5 15 17 12 15.5 9 17 9.5 13.5 7 11 10.5 10.5" fill="#ff8200" stroke="none"/></svg>',
  wbGridLiulan: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#222" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2" stroke="#ff8200"/></svg>',
  wbGridCaogao: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#222" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13l-4 4-2 1 1-2 4-4a1.4 1.4 0 0 1 2 2z" fill="#ff8200" stroke="none"/></svg>',
  wbGridQianbao: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#222" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M7 6V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2"/><circle cx="17" cy="15" r="2.5" fill="#ff8200" stroke="none"/></svg>',
  wbGridDingdan: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#222" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0" stroke="#ff8200"/></svg>',
  wbGridChuangzuo: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#222" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-7 7c0 2.4 1.2 4.5 3 5.7V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.3c1.8-1.2 3-3.3 3-5.7a7 7 0 0 0-7-7z"/><path d="M12 8l-2 4h4l-2 3" stroke="#ff8200"/></svg>',
  wbGridFensi: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#222" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 15h8" stroke="#ff8200" stroke-width="2.5"/></svg>',
  wbTopCrown: '<svg viewBox="0 0 24 24" width="14" height="14" fill="#c9a227"><path d="M2 18h20L20 7l-5 4-3-6-3 6-5-4z"/></svg>',
  wbSVIPCrown: '<svg viewBox="0 0 24 24" width="12" height="12" fill="#fff"><path d="M2 18h20L20 7l-5 4-3-6-3 6-5-4z"/></svg>',
  wbLive: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#666" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="14" rx="2"/><path d="m17 2-5 4-5-4"/><path d="m10 11 5 3-5 3z" fill="#666"/></svg>',
  wbShiPinhao: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#666" stroke-width="1.6" stroke-linejoin="round"><path d="M6 3h12l4 6-10 12L2 9z"/><path d="M2 9h20M12 21V9M6 3l6 6 6-6"/></svg>',
  wbVerified: '<svg viewBox="0 0 24 24" width="16" height="16" fill="#b3b3b3"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.4-1.4 3.6 3.6 7.6-7.6L19 8l-9 9z"/></svg>',
  wbFilter: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h10M4 18h16"/></svg>',
  wbPublic: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 11V7a2 2 0 0 1 2-2h10l4 4v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4"/><path d="m4 11 4-4"/></svg>',
  wbYuanchuang: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',
  wbAudio: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
  wbRecent: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18"/></svg>',

  // ================= 小红书 =================
  xhsBack: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 5-7 7 7 7"/></svg>',
  xhsCamera: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#333" stroke-width="1.8"><path d="M4 8h3.5L9 5.5h6L16.5 8H20v11H4Z"/><circle cx="12" cy="13" r="3.5"/></svg>',
  xhsSearchGray: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px;"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
  xhsDelete: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 7h14M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/></svg>',
  xhsArrowDown: (expanded) => `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(${expanded ? '180deg' : '0deg'}); transition: transform 0.3s;"><path d="m6 9 6 6 6-6"/></svg>`,
  xhsHideEye: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>',
  xhsVoice: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#ff2442" stroke-width="2" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></svg>',
  xhsTabHome: '<svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M12 3 2 10v11h7v-7h6v7h7V10L12 3z"/></svg>',
  xhsTabVideo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><rect x="2" y="6" width="20" height="12" rx="4"/><path d="m10 10 5 2-5 2v-4z" fill="currentColor"/></svg>',
  xhsPlusFab: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  xhsTabMessage: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
  xhsTabMe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  xhsLikeHeart: (liked) => `<svg class="heart-icon" viewBox="0 0 24 24" width="14" height="14" fill="${liked ? '#ff2442' : 'none'}" stroke="${liked ? '#ff2442' : '#999'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
  xhsMutual: (bgColor) => `<svg viewBox="0 0 24 24" width="12" height="12" style="background:${bgColor}; border-radius:50%; padding:2px; fill:#fff; display:inline-block; vertical-align:middle; margin-right:4px;"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>`,

  // ================= 闲鱼 =================
  xyDefaultAvatar: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="#ccc"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`,
  xyTabHome: (active) => `<svg viewBox="0 0 24 24" width="24" height="24" fill="${active === 'home' ? '#ffda00' : 'none'}" stroke="${active === 'home' ? '#ffda00' : '#111'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  xyTabLocation: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  xyTabCamera: '<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#111" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:1px;"><path d="M4 8h3.5L9 5.5h6L16.5 8H20v11H4Z"/><circle cx="12" cy="13" r="3.5"/></svg>',
  xyTabMessage: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
  xyTabMe: (active) => `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${active === 'me' ? '#ffda00' : '#111'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg>`,
  xySearch: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px;"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
  xySearchWhite: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
  xyCamera: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3.5L9 5.5h6L16.5 8H20v11H4Z"/><circle cx="12" cy="13" r="3.5"/></svg>',
  xyKefu: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg>',
  xySetting: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  xyFabu: '<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#111" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M16 6l-4-4-4 4"/><path d="M9 14s1.5 2 3 2 3-2 3-2"/></svg>',
  xyMaichu: '<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#111" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/></svg>',
  xyMaidao: '<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#111" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="4"/><path d="M7 10h10M7 14h6"/></svg>',
  xyStar: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/></svg>',

  // ================== 录音 ==================
    // ================= 录音模块 =================
  recList: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h10M4 18h16"/><circle cx="18" cy="12" r="2" fill="currentColor"/></svg>',
  recSeekBack: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#111" stroke-width="1.8" stroke-linecap="round"><path d="M12 21a9 9 0 1 1 9-9"/><path d="M21 3v6h-6"/><text x="12" y="16" font-size="8" font-weight="bold" stroke="none" fill="#111" text-anchor="middle">15</text></svg>',
  recSeekFwd: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#111" stroke-width="1.8" stroke-linecap="round"><path d="M12 21a9 9 0 1 0-9-9"/><path d="M3 3v6h6"/><text x="12" y="16" font-size="8" font-weight="bold" stroke="none" fill="#111" text-anchor="middle">15</text></svg>',
  recTrash: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4.5h8V6M5.5 6l1 14h11l1-14"/></svg>',
  recPlay: '<svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
  recPause: '<svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor"><rect x="6" y="4.5" width="4" height="15" rx="1"/><rect x="14" y="4.5" width="4" height="15" rx="1"/></svg>',

    // ================= 通话缺失图标补充 =================
  speaker: g('<path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"/>'),
  videoF: g('<rect x="3" y="6.5" width="13" height="11" rx="2"/><path d="m16 10.5 5-3v9l-5-3"/>'),
  muteF: g('<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/><line x1="1" y1="1" x2="23" y2="23"/>'),
  plusF: g('<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>'),
  keypadF: g('<g fill="currentColor" stroke="none"><circle cx="6" cy="5" r="1.7"/><circle cx="12" cy="5" r="1.7"/><circle cx="18" cy="5" r="1.7"/><circle cx="6" cy="11" r="1.7"/><circle cx="12" cy="11" r="1.7"/><circle cx="18" cy="11" r="1.7"/><circle cx="6" cy="17" r="1.7"/><circle cx="12" cy="17" r="1.7"/><circle cx="18" cy="17" r="1.7"/><circle cx="12" cy="22" r="1.5"/></g>'),
    // ================= 微信通讯录/我 =================
    // ================= 微信通讯录完美版 =================
  // ================= 微信通讯录极简线框图标 =================
  wxNewFriend: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>`,
  wxChatOnly: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><circle cx="12" cy="9" r="2"></circle><path d="M8 14c.5-1.5 2-2 4-2s3.5.5 4 2"></path></svg>`,
  wxGroup: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
  wxTag: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>`,
  wxOfficial: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`,
  wxService: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 12l10 10 10-10L12 2z"></path><path d="M12 6l-6 6 6 6 6-6-6-6z"></path></svg>`,
  wxEnterprise: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
    wxMeScan: `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M3 3h8v8H3V3zm2 2v4h4V5H5z"/><path d="M13 3h8v8h-8V3zm2 2v4h4V5h-4z"/><path d="M3 13h8v8H3v-8zm2 2v4h4v-4H5z"/><path d="M13 13h3v3h-3v-3zm5 0h3v3h-3v-3zm-5 5h3v3h-3v-3zm5 5h3v3h-3v-3zm5-5h-3v3h3v-3z"/></svg>`,
  wxMeService: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#07c160" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-5"/></svg>`,
  wxMeFav: `<svg viewBox="0 0 24 24" width="22" height="22" fill="#fa9d3b"><path d="M12 2 2 7l10 5 10-5-10-5Zm0 11-10-5v9l10 5 10-5v-9l-10 5Z"/></svg>`,
  wxMeWorks: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#2782d7" stroke-width="2"><rect x="3" y="5" width="14" height="16" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v14"/></svg>`,
  wxMeShop: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#ff3b30" stroke-width="2"><path d="M3 9h18v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9Zm0 0 2-4h14l2 4"/></svg>`,
  wxMeEmoji: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#f5c84c" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M8.5 14.5c1.8 2 5.2 2 7 0"/><circle cx="9" cy="10" r=".9" fill="#f5c84c"/><circle cx="15" cy="10" r=".9" fill="#f5c84c"/></svg>`,
  wxMeSettings: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#2782d7" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    wxIdxSearch: `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#666" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
  wxIdxUser: `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#666" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>`,


};



// ==========================================
// 桌面 App 图标生成器
window.appIcon = function (id) {
  const newApps = {
    wechat: { cls: "ic-wechat", path: "./data/app/wechat.png", fallback: `<svg viewBox="0 0 60 60"><rect width="60" height="60" fill="#07c160"/></svg>` },
    weibo: { cls: "ic-weibo", path: "./data/app/weibo.png", fallback: `<div style="background:linear-gradient(135deg,#ff8a3d,#ff3b30); width:100%; height:100%; display:grid; place-items:center;">${window.G.globe}</div>` },
    xianyu: { cls: "ic-xianyu", path: "./data/app/xianyu.png", fallback: `<div style="background:linear-gradient(135deg,#ffe25a,#ffb300); width:100%; height:100%; display:grid; place-items:center;">${window.G.bag}</div>` },
    bilibili: { cls: "ic-bili", path: "./data/app/bilibili.png", fallback: `<div style="background:linear-gradient(135deg,#4fc3f7,#00a1d6); width:100%; height:100%; display:grid; place-items:center;">${window.G.playF}</div>` },
    xhs: { cls: "ic-xhs", path: "./data/app/xhs.png", fallback: `<div style="background:linear-gradient(135deg,#ff6b8a,#ff2442); width:100%; height:100%; display:grid; place-items:center;">${window.G.book}</div>` },
    sms: { cls: "ic-sms", icon: window.G.msgF },
    privateAlbum: { cls: "ic-private", icon: window.G.keypad },
    recorder: { cls: "ic-recorder", path: "./data/app/recorder.png", fallback: (() => { const B = (x, c) => `<rect x="${x}" y="22" width="3.5" height="16" rx="1.75" fill="${c}"/>`; return `<svg viewBox="0 0 60 60"><rect width="60" height="60" fill="#000"/>${B(14, "#ff3b30")}${B(20.5, "#ff9500")}${B(27, "#ffcc00")}${B(33.5, "#34c759")}${B(40, "#007aff")}${B(46.5, "#af52de")}</svg>`; })() }
  };
  
  if (newApps[id]) {
    const app = newApps[id];
    if (app.path) {
      // 👇 核心修改：直接只渲染图片！只有图片加载失败（比如路径错了），才显示底层的兜底 fallback。
      // 这样就不会出现图片和底层色块叠在一起的问题了。
      return `<div class="${app.cls}" style="width:100%; height:100%; border-radius:14px; overflow:hidden; position:relative; background:#fff;">
        <img src="${app.path}" style="width:100%; height:100%; object-fit:cover; position:absolute; inset:0; z-index:2;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div style="display:none; width:100%; height:100%; position:absolute; inset:0; z-index:1;">${app.fallback}</div>
      </div>`;
    } else {
      return `<div class="${app.cls}" style="width:100%; height:100%; border-radius:14px; overflow:hidden;"><div class="app-icon-fallback">${app.icon}</div></div>`;
    }
  }
  
  // 系统其他自带渐变 SVG 图标（日历、照片等）保持不变
  const L = (a, b, c, d) => `<linearGradient id="${a}" x1="0" y1="${d ? 1 : 0}" x2="${d ? 1 : 0}" y2="${d ? 0 : 1}"><stop offset="0" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient>`;
  const W = (defs, body) => `<svg viewBox="0 0 60 60"><defs>${defs}</defs>${body}</svg>`;
  switch (id) {
    case "instagram": return W(`<linearGradient id="gi" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#ffc35c"/><stop offset=".5" stop-color="#ff3d6e"/><stop offset="1" stop-color="#7c3bf0"/></linearGradient>`, `<rect width="60" height="60" fill="url(#gi)"/><rect x="17" y="12.5" width="26" height="34" rx="4.5" fill="none" stroke="#fff" stroke-width="3.2"/><rect x="21.6" y="17" width="16.8" height="17" rx="2" fill="#fff"/>`);
    case "photos": { let p = ""; for (let i = 0; i < 10; i++) p += `<ellipse cx="30" cy="18.2" rx="4.4" ry="10.5" fill="#fff" transform="rotate(${i * 36} 30 30)"/>`; return W(L("gp", "#9bdcff", "#d8f1ff"), `<rect width="60" height="60" fill="url(#gp)"/>${p}<circle cx="30" cy="30" r="7.2" fill="#ffc83d"/><circle cx="30" cy="30" r="7.2" fill="none" stroke="#f0a500" stroke-width="1"/>`); }
    case "mail": return W(L("gm", "#3fb0ff", "#0a6cf5"), `<rect width="60" height="60" fill="url(#gm)"/><rect x="11.5" y="18" width="37" height="25" rx="3.5" fill="#fff"/><path d="M12.5 20 30 32.5 47.5 20" fill="none" stroke="#1676f3" stroke-width="2.4" stroke-linejoin="round"/>`);
    case "calendar": return W("", `<rect width="60" height="60" fill="#fff"/><text x="30" y="17.5" text-anchor="middle" font-size="9.5" font-weight="600" fill="#ff3b30" font-family="-apple-system,sans-serif">星期日</text><text x="30" y="47" text-anchor="middle" font-size="31" font-weight="300" fill="#111" font-family="-apple-system,sans-serif">15</text>`);
    case "clock": { const d = new Date(), h = d.getHours() % 12, m = d.getMinutes(); let t = ""; for (let i = 0; i < 12; i++) t += `<path d="M30 8.5v${i % 3 ? 2.6 : 3.8}" stroke="#111" stroke-width="${i % 3 ? 1 : 1.6}" transform="rotate(${i * 30} 30 30)"/>`; return W("", `<rect width="60" height="60" fill="#000"/><circle cx="30" cy="30" r="24" fill="#fff"/>${t}<path d="M30 30V17" stroke="#111" stroke-width="2.6" stroke-linecap="round" transform="rotate(${h * 30 + m / 2} 30 30)"/><path d="M30 30V11.5" stroke="#111" stroke-width="1.8" stroke-linecap="round" transform="rotate(${m * 6} 30 30)"/><path d="M30 34V11" stroke="#ff9500" stroke-width="1" transform="rotate(${(m * 6 + 90) % 360} 30 30)"/><circle cx="30" cy="30" r="1.8" fill="#ff9500"/>`); }
    case "notes": return W(L("gn", "#ffe27a", "#ffc933"), `<rect width="60" height="60" fill="#fff"/><rect width="60" height="17" fill="url(#gn)"/><g stroke="#d9d9de" stroke-width="1.2"><path d="M8 27h44M8 35h44M8 43h44M8 51h44"/></g><g fill="#cfcfd4"><circle cx="10" cy="17" r=".9"/><circle cx="14" cy="17" r=".9"/><circle cx="18" cy="17" r=".9"/><circle cx="22" cy="17" r=".9"/><circle cx="26" cy="17" r=".9"/><circle cx="30" cy="17" r=".9"/><circle cx="34" cy="17" r=".9"/><circle cx="38" cy="17" r=".9"/><circle cx="42" cy="17" r=".9"/><circle cx="46" cy="17" r=".9"/><circle cx="50" cy="17" r=".9"/></g>`);
    case "weather": return W(L("gw", "#53b5ff", "#1f6fe0"), `<rect width="60" height="60" fill="url(#gw)"/><circle cx="23" cy="23" r="9.5" fill="#ffd84a"/><path d="M19 45h21.5a7.5 7.5 0 0 0 .6-15 10 10 0 0 0-19.2 3.2A6 6 0 0 0 19 45Z" fill="#fff"/>`);
    case "settings": return W(L("gs", "#a7adb6", "#6d727b"), `<rect width="60" height="60" fill="url(#gs)"/><circle cx="30" cy="30" r="17" fill="none" stroke="#e9eaee" stroke-width="7" stroke-dasharray="4.4 4.5"/><circle cx="30" cy="30" r="14" fill="#878c95" stroke="#e9eaee" stroke-width="3.2"/><circle cx="30" cy="30" r="5.5" fill="none" stroke="#e9eaee" stroke-width="3"/><g stroke="#e9eaee" stroke-width="2.4"><path d="M30 17.5v7M30 35.5v7M17.5 30h7M35.5 30h7"/></g>`);
    case "phone": return W(L("gph", "#65f38f", "#28c253"), `<rect width="60" height="60" fill="url(#gph)"/><g transform="translate(12 12) scale(1.5)" fill="#fff">${window.G.handset.replace(/<\/?svg[^>]*>/g, "")}</g>`);
    case "safari": return W(L("gsa", "#3aa8ff", "#0f5fe0"), `<rect width="60" height="60" fill="#fff"/><circle cx="30" cy="30" r="21" fill="url(#gsa)"/><g fill="none" stroke="#fff" stroke-width="1.6" opacity=".95"><ellipse cx="30" cy="30" rx="8.5" ry="21"/><path d="M9 30h42M12 19.5h36M12 40.5h36M30 9v42"/></g>`);
    case "music": return W(L("gmu", "#ff6f86", "#fa2b47"), `<rect width="60" height="60" fill="url(#gmu)"/><g transform="translate(11 10) scale(1.55)" fill="#fff">${window.G.musicNote.replace(/<\/?svg[^>]*>/g, "")}</g>`);
    case "maps": return W("", `<rect width="60" height="60" fill="#e9f2df"/><path d="M0 38 60 22v12L0 50Z" fill="#fff"/><path d="M24 0h9L27 60h-9Z" fill="#ffd966"/><path d="M0 12c14 6 30-4 60 6V0H0Z" fill="#bfe3a5"/><path d="M42 60c0-8 10-10 18-12v12Z" fill="#9fd0f5"/><path d="M40 14a8 8 0 0 0-8 8c0 6 8 14 8 14s8-8 8-14a8 8 0 0 0-8-8Z" fill="#ff3b30"/><circle cx="40" cy="22" r="3" fill="#fff"/>`);
  }
  return "";
};