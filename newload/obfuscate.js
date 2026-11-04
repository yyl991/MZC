// ==========================================
// 混淆打包脚本（绝对安全版，牺牲一点防抄，保证绝不报错）
// ==========================================
const JavaScriptObfuscator = require("javascript-obfuscator");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const DIST = path.join(ROOT, "dist");

// 白名单，如果你是在 EdgeOne 测试域名跑的，一定要加上
const ALLOWED_DOMAINS = [
  'cgcgdsg.cc.cd',
  'mzc1116.cc.cd',
  'mzc-dpnwtj1zgivj.edgeone.dev',
  'mzc1116-10g3u3eg.maozi.io',
  'localhost',
  '127.0.0.1'
];

const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "waste", "trash", "tests"]);
const SKIP_FILES = new Set([
  "obfuscate.js", "compress.js", "warmup.js", "package.json", 
  "package-lock.json", ".gitignore", ".assetsignore", "ffmpeg.exe",
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

  const code = fs.readFileSync(src, "utf8");
  try {
    const obfuscated = JavaScriptObfuscator.obfuscate(code, {
      compact: true, 
      
      // 🚫 关掉所有可能导致运行中断的暗病
      controlFlowFlattening: false,
      deadCodeInjection: false,
      debugProtection: false,       
      stringArray: false,           
      selfDefending: false,         // 👈 极度容易导致部分机型/代码变异，关掉！
      disableConsoleOutput: false,  // 👈 留着控制台，方便看报错
      
      // 👇 仅保留的基础防御
      domainLock: ALLOWED_DOMAINS,  
      identifierNamesGenerator: "hexadecimal", 
      renameGlobals: false,         
    }).getObfuscatedCode();

    fs.writeFileSync(dest, obfuscated);
    ok++;
    console.log("✅ " + rel);
  } catch (err) {
    fail++;
    console.error("❌ " + rel + " 混淆失败:", err.message);
  }
}
console.log(`\n🎉 完成：成功 ${ok} 个，失败 ${fail} 个`);