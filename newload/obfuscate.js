const JavaScriptObfuscator = require("javascript-obfuscator");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const DIST = path.join(ROOT, "dist");

const ALLOWED_DOMAINS = [
  'cgcgdsg.cc.cd', 'mzc1116.cc.cd', 'mzc-dpnwtj1zgivj.edgeone.dev',
  'mzc1116-10g3u3eg.maozi.io', 'localhost', '127.0.0.1'
];

// 这些文件/目录不上传（纯本地文件）
const IGNORE_FILES = new Set([
  "obfuscate.js", "compress.js", "warmup.js", "package.json", 
  "package-lock.json", ".gitignore", ".assetsignore", "ffmpeg.exe"
]);
const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "waste", "trash", "tests"]);

// 这些 JS 文件要放进 dist，但是【不混淆】（保证剧情逻辑100%正常）
const SKIP_OBFUSCATION = new Set([
  "app.js", "story.js", "chat_history.js", "audio.js", "utils.js"
]);

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    if (name.startsWith(".") || IGNORE_FILES.has(name)) continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    // 不过滤 SKIP_OBFUSCATION，让它们进入待处理列表
    if (st.isDirectory()) walk(p, out);
    else if (!/\.(exe|dll|so|dylib)$/i.test(name)) out.push(p);
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

  // 👇 核心修复：如果是需要保留但不混淆的 JS，直接原样复制！
  if (SKIP_OBFUSCATION.has(path.basename(src))) {
    fs.copyFileSync(src, dest);
    console.log(`⏭️ [跳过混淆] ${rel}`);
    ok++;
    continue;
  }

  const code = fs.readFileSync(src, "utf8");
  try {
    const obfuscated = JavaScriptObfuscator.obfuscate(code, {
      compact: true, controlFlowFlattening: false, deadCodeInjection: false,
      debugProtection: false, stringArray: false, selfDefending: false,         
      disableConsoleOutput: true, domainLock: ALLOWED_DOMAINS,  
      identifierNamesGenerator: "hexadecimal", renameGlobals: false,         
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