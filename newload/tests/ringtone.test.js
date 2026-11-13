const fs = require("fs"), vm = require("vm"), path = require("path"), assert = require("assert");
async function run() {
  const timers = [], intervals = [], pendingPlay = [];
  let callNode = null, closingAnimation = null;
  const sb = { console, VIEWS: {}, CFG: { roles: {} }, SS: { talked: {} },
    view: "home", nowSong: -1, speech: [], calls: [], chatNames: [], photoSections: [], notes: [],
    callName: "cat", PLAYER: { dataset: {}, pause() {} },
    APP: { querySelectorAll: () => [] },
    OV: { querySelector: sel => sel === ".call" ? callNode : null, querySelectorAll: () => [] },
    navigator: { vibrate() {} }, vib() {}, $: () => null,
    gameTime24: () => "23:59", dn: n => n,
    document: { addEventListener() {}, getElementById: () => null, querySelectorAll: () => [], querySelector: () => null, body: { appendChild() {} } },
    setTimeout: fn => { timers.push(fn); return timers.length; }, clearTimeout() {},
    setInterval: fn => { intervals.push(fn); return intervals.length; }, clearInterval() {},
    Audio: function () {
      this.style = {}; this.paused = true;
      this.pause = () => { this.paused = true; };
      this.play = () => new Promise(resolve => pendingPlay.push(() => { this.paused = false; resolve(); }));
    },
  };
  sb.window = sb; vm.createContext(sb);
  for (const f of ["core/audio.js", "views/app_extra.js"]) vm.runInContext(fs.readFileSync(path.join(__dirname, "..", f), "utf8"), sb);
  sb.renderCall = () => {};
  const exec = code => vm.runInContext(code, sb);
  sb.incomingCallFrom("cat");
  const session = sb._callSession, oldMiss = timers.at(-1);
  sb.incomingCallFrom("pig");
  assert.strictEqual(sb._callSession, session);
  assert.strictEqual(sb.callName, "cat"); // 不允许第二通来电覆盖第一通
  sb.stopRing();
  pendingPlay.shift()(); await Promise.resolve();
  assert(sb._ringEl.paused); // stop先发生，异步play后完成也必须停
  assert.strictEqual(sb._ringWanted, false);
  exec('callState = ""');
  callNode = { dataset: {}, remove() {}, animate() { closingAnimation = {}; return closingAnimation; } };
  sb.closeCallUI();
  sb.incomingCallFrom("pig");
  const current = sb._callSession;
  closingAnimation.onfinish();
  assert.strictEqual(exec("callState"), "ring"); // 旧动画不能清空新来电
  oldMiss();
  assert.strictEqual(sb._callSession, current);
  assert.strictEqual(exec("callState"), "ring"); // 旧超时不能挂新电话
  callNode = null;
  sb.answerCall();
  while (pendingPlay.length) pendingPlay.shift()();
  await Promise.resolve();
  assert.strictEqual(exec("callState"), "active");
  assert(sb._ringEl.paused);
  assert.strictEqual(sb._ringWanted, false);
  intervals.forEach(fn => fn()); // 即使旧interval已进入队列，也不能重新响
  assert(sb._ringEl.paused);
  assert.strictEqual(pendingPlay.length, 0);
  console.log("OK ringtone: overlap, stale close/timeout, delayed play, answer and queued interval");
}
run().catch(error => { console.error(error); process.exitCode = 1; });
