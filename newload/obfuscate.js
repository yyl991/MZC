// ==========================================
// 混淆打包脚本（输出到 dist/，不再原地覆盖源码）
// 用法：node obfuscate.js   →   把 dist/ 整个上传到托管平台
// ==========================================
const JavaScriptObfuscator = require("javascript-obfuscator");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const DIST = path.join(ROOT, "dist");

// 这些目录/文件不进 dist
const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "waste", "tests"]);
const SKIP_FILES = new Set([
  "obfuscate.js",
  "compress.js",
  "package.json",
  "package-lock.json",
  ".gitignore",
  ".assetsignore",
  "ffmpeg.exe",
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

let ok = 0,
  fail = 0;

for (const src of files) {
  const rel = path.relative(ROOT, src);
  const dest = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });

  if (!src.endsWith(".js")) {
    fs.copyFileSync(src, dest);
    ok++;
    continue;
  }

  const code = fs.readFileSync(src, "utf8");
  try {
    const obfuscated = JavaScriptObfuscator.obfuscate(code, {
      compact: true,
      controlFlowFlattening: true,
      deadCodeInjection: true,
      identifierNamesGenerator: "hexadecimal",
      stringArray: true,
      stringArrayEncoding: ["base64"],

      // 调试保护 / 禁用控制台
      debugProtection: true,
      debugProtectionInterval: 2000,
      disableConsoleOutput: true,

      // 域名白名单已关闭（任何域名 / file:// 都能打开）
      // 需要恢复时在这里加回 domainLock 数组
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
console.log("👉 上传 dist/ 目录即可；源码目录没有被改动。");
