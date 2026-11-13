const fs = require("fs"), vm = require("vm"), path = require("path"), assert = require("assert");
function create(homecoming = null) {
  const bgm = { id: "bgm", dataset: {}, src: "./data/app/bgm.mp3", paused: true, loads: 0, plays: 0, currentTime: 0,
    getAttribute() { return this.src; }, pause() { this.paused = true; }, load() { this.loads++; this.currentTime = 0; },
    play() { this.plays++; if (this.blocked) return Promise.reject(new Error("gesture needed")); this.paused = false; return Promise.resolve(); } };
  const voice = { id: "player", paused: true, ended: false };
  const sb = { console, SS: { homecoming }, document: {
    getElementById: id => id === "bgm" ? bgm : null,
    querySelectorAll: sel => sel === "audio" ? [bgm, voice] : [], querySelector: () => null, addEventListener() {},
  } };
  sb.window = sb; vm.createContext(sb);
  vm.runInContext(fs.readFileSync(path.join(__dirname, "../core/audio.js"), "utf8"), sb);
  return { sb, bgm, voice };
}
async function run() {
  const { sb, bgm, voice } = create();
  sb.tryStartBGM(); await Promise.resolve();
  assert.strictEqual(bgm.src, "./data/app/bgm.mp3");
  assert.strictEqual(bgm.loads, 0);
  sb.SS.homecoming = { phase: "transferred" };
  sb.tryStartBGM(); await Promise.resolve();
  assert.strictEqual(bgm.src, "./data/app/hb.mp3");
  assert.strictEqual(bgm.loads, 1);
  assert.strictEqual(bgm.paused, false); // 传送幕已开始播放
  assert.strictEqual(bgm.loop, true);
  bgm.currentTime = 12;
  sb.SS.homecoming.phase = "exploring";
  sb.tryStartBGM(); await Promise.resolve();
  assert.strictEqual(bgm.loads, 2);
  assert.strictEqual(bgm.src, "./data/app/19.mp3");
  assert.strictEqual(bgm.currentTime, 0); // 继续从传送音乐切到19
  bgm.currentTime = 12;
  sb.tryStartBGM(); await Promise.resolve();
  assert.strictEqual(bgm.loads, 2);
  assert.strictEqual(bgm.currentTime, 12);
  sb.AudioHub.pauseBGM(); voice.paused = false;
  sb.AudioHub.resumeBGM(); assert(bgm.paused);
  voice.paused = true; sb.AudioHub.resumeBGM();
  assert(!bgm.paused); assert.strictEqual(bgm.src, "./data/app/19.mp3");
  assert.strictEqual(bgm.currentTime, 12);
  const restored = create({ phase: "transferred" });
  restored.bgm.blocked = true;
  restored.sb.tryStartBGM(); await Promise.resolve();
  assert.strictEqual(restored.bgm.src, "./data/app/hb.mp3");
  assert(!restored.sb._bgmStarted);
  restored.bgm.blocked = false;
  restored.sb.tryStartBGM(); await Promise.resolve();
  assert(!restored.bgm.paused);
  assert.strictEqual(restored.bgm.loads, 1); // 手势重试不反复load
  console.log("OK background music: transfer, continue, reload, voice interruption, autoplay retry");
}
run().catch(error => { console.error(error); process.exitCode = 1; });
