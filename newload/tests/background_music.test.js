const fs = require("fs"), vm = require("vm"), path = require("path"), assert = require("assert");
function create(homecoming = null) {
  const bgm = { id: "bgm", dataset: {}, src: "./data/app/bgm.mp3", paused: true, loads: 0, plays: 0, currentTime: 0,
    getAttribute() { return this.src; }, pause() { this.paused = true; }, load() { this.loads++; this.currentTime = 0; },
    play() { this.plays++; if (this.blocked) return Promise.reject(new Error("gesture needed")); this.paused = false; return Promise.resolve(); } };
  const voice = { id: "player", paused: true, ended: false, pause() { this.paused = true; } };
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
  assert.strictEqual(bgm.loop, true); // 普通游戏阶段也原生循环，播完不停
  assert.strictEqual(bgm.loads, 0);
  sb.SS.homecoming = { phase: "transferred" };
  sb.tryStartBGM(); await Promise.resolve();
  assert.strictEqual(bgm.src, "./data/app/hb.mp3?v=20261116");
  assert.strictEqual(bgm.loads, 1);
  assert.strictEqual(bgm.paused, false); // 传送幕已开始播放
  assert.strictEqual(bgm.loop, true);
  bgm.currentTime = 12;
  sb.SS.homecoming.phase = "exploring";
  sb.tryStartBGM(); await Promise.resolve();
  assert.strictEqual(bgm.loads, 2);
  assert.strictEqual(bgm.src, "./data/app/19.mp3?v=20261116");
  assert.strictEqual(bgm.currentTime, 0); // 继续从传送音乐切到19
  bgm.currentTime = 12;
  sb.tryStartBGM(); await Promise.resolve();
  assert.strictEqual(bgm.loads, 2);
  assert.strictEqual(bgm.currentTime, 12);
  sb.AudioHub.pauseBGM(); voice.paused = false;
  sb.AudioHub.resumeBGM(); assert(bgm.paused);
  voice.paused = true; sb.AudioHub.resumeBGM();
  assert(!bgm.paused); assert.strictEqual(bgm.src, "./data/app/19.mp3?v=20261116");
  assert.strictEqual(bgm.currentTime, 12);
  const restored = create({ phase: "transferred" });
  restored.bgm.blocked = true;
  restored.sb.tryStartBGM(); await Promise.resolve();
  assert.strictEqual(restored.bgm.src, "./data/app/hb.mp3?v=20261116");
  assert(!restored.sb._bgmStarted);
  restored.bgm.blocked = false;
  restored.sb.tryStartBGM(); await Promise.resolve();
  assert(!restored.bgm.paused);
  assert.strictEqual(restored.bgm.loads, 1); // 手势重试不反复load

  // 剧情节点强制播放：即便之前被语音/音乐暂停过（bgmPausedByOther=true、_bgmStarted=true、
  // 播放器 paused），零点与生日快乐阶段调用 forceStartBGM 也必须无条件下发 play。
  const forced = create({ phase: "transferred" });
  forced.sb.bgmPausedByOther = true;
  forced.sb._bgmStarted = true;
  forced.bgm.paused = true; // 模拟被其它音频抢占后的暂停态
  forced.voice.paused = false; // 有个“语音”正在占着
  forced.sb.forceStartBGM(); await Promise.resolve();
  assert.strictEqual(forced.bgm.src, "./data/app/hb.mp3?v=20261116");
  assert(!forced.bgm.paused, "零点：之前暂停过也要强制开始播放");
  assert.strictEqual(forced.voice.paused, true, "强制播放前先停掉抢占的其它音频");
  assert.strictEqual(forced.sb.bgmPausedByOther, false);
  assert.strictEqual(forced.sb._bgmStarted, true);

  // 生日快乐探索阶段同样强制：此时源已是19.mp3，不应因“已启动过”而跳过
  forced.sb.SS.homecoming.phase = "exploring";
  forced.bgm.pause();
  forced.sb._bgmStarted = true;
  const playsBefore = forced.bgm.plays;
  forced.sb.forceStartBGM(); await Promise.resolve();
  assert.strictEqual(forced.bgm.src, "./data/app/19.mp3?v=20261116");
  assert(!forced.bgm.paused, "生日快乐：之前暂停过也要强制开始播放");
  assert.strictEqual(forced.bgm.plays, playsBefore + 1, "强制路径下确实重新下发了 play");

  console.log("OK background music: transfer, continue, reload, voice interruption, autoplay retry, forced story beats");
}
run().catch(error => { console.error(error); process.exitCode = 1; });
