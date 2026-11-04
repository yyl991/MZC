// ==========================================
// 混淆打包脚本（最终安全版：核心逻辑放行，防抄袭拉满）
// ==========================================
const JavaScriptObfuscator = require("javascript-obfuscator");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const DIST = path.join(ROOT, "dist");

// 🛡️ 王牌 1：域名锁白名单
const ALLOWED_DOMAINS = [
  'cgcgdsg.cc.cd',
  'mzc1116.cc.cd',
  'mzc-dpnwtj1zgivj.edgeone.dev',
  'mzc1116-10g3u3eg.maozi.io',
  'localhost',
  '127.0.0.1'
];

// 不输出到 dist 的目录/文件
const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "waste", "trash", "tests"]);
const SKIP_FILES = new Set([
  "obfuscate.js",
  "compress.js",
  "warmup.js",
  "package.json",
  "package-lock.json",
  ".gitignore",
  ".assetsignore",
  "ffmpeg.exe",
  // 👇 极度重要：核心逻辑文件跳过混淆！
  // 只要文件名是这个，就直接原样复制过去，不改名不压缩，确保时间线100%正常
  "app.js", 
  "story.js", 
  "chat_history.js", 
  "audio.js",
  "utils.js"
]);

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    if (name.startsWith(".")) continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (!SKIP_FILES.has(name) && !/\.(exe|dll|so|dylib)$/i.test(name)) out.push(p);
  }
  return out;
}

const files = walk(ROOT);
console.log(`📦 共 ${files.length} 个文件准备输出到 dist/`);

fs.rmSync(DIST, { recursive: true, force: true });
let ok = 0, fail = 0;

for (const src of files) {
  const rel = path.relative(ROOT, src);
  const dest = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });

  if (!src.endsWith(".js")) {
    if (rel === "index.html") {
      const stamp = Date.now().toString(36);
      let html = fs.readFileSync(src, "utf8");
      html = html.replace(/const ASSET_V = '[^']*';/, `const ASSET_V = '${stamp}';`);
      fs.writeFileSync(dest, html);
      console.log(`✅ ${rel}（自动更新版本号 ${stamp}）`);
      ok++;
      continue;
    }
    fs.copyFileSync(src, dest);
    ok++;
    continue;
  }

  // 如果这个文件在跳过名单里（比如 app.js），直接原样复制，不混淆！
  if (SKIP_FILES.has(path.basename(src))) {
    fs.copyFileSync(src, dest);
    console.log(`⏭️ [跳过] ${rel}（核心逻辑放行）`);
    ok++;
    continue;
  }

  const code = fs.readFileSync(src, "utf8");
  try {
    const obfuscated = JavaScriptObfuscator.obfuscate(code, {
      compact: true, 
      controlFlowFlattening: false,
      deadCodeInjection: false,
      debugProtection: false,       
      stringArray: false,           
      selfDefending: false,         
      disableConsoleOutput: true,   
      domainLock: ALLOWED_DOMAINS,  
      identifierNamesGenerator: "hexadecimal", 
      renameGlobals: false,         
    }).getObfuscatedCode();

    fs.writeFileSync(dest, obfuscated);
    ok++;
    console.log("✅ [混淆] " + rel);
  } catch (err) {
    fail++;
    console.error("❌ " + rel + " 混淆失败:", err.message);
  }
}
console.log(`\n🎉 完成：成功 ${ok} 个，失败 ${fail} 个`);