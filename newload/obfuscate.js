// ==========================================
// 混淆打包脚本（静默防御版：防域名盗用 + 防格式化 + 零性能损耗）
// 用法：node obfuscate.js   →   把 dist/ 整个上传到托管平台
// ==========================================
const JavaScriptObfuscator = require("javascript-obfuscator");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const DIST = path.join(ROOT, "dist");

// 🛡️ 王牌 1：域名锁白名单（别人搬运代码换域名，直接变成白屏）
// ⚠️ 请确认这里有你所有正在使用的域名，如果有遗漏，新域名下网页会白屏！
const ALLOWED_DOMAINS = [
  'cgcgdsg.cc.cd',
  'mzc1116.cc.cd',
  'mzc-dpnwtj1zgivj.edgeone.dev',
  'mzc1116-10g3u3eg.maozi.io',
  'localhost',
  '127.0.0.1'
];

// 这些目录/文件不进 dist（保持你原有的精简逻辑）
const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "waste", "trash", "tests"]);
// 注意：上面加了 "data"，因为你的 data 里面全是图片和聊天记录，不需要参与 JS 混淆，直接原样复制就行

const SKIP_FILES = new Set([
  "obfuscate.js",
  "compress.js",
  "warmup.js", 
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

  // 处理非 JS 文件（HTML、图片、CSS、JSON 等）
  if (!src.endsWith(".js")) {
    if (rel === "index.html") {
      // 每次打包自动更新资源版本号，让你的更新立即生效，同时破解浏览器的强缓存
      const stamp = Date.now().toString(36);
      let html = fs.readFileSync(src, "utf8");
      html = html.replace(
        /const ASSET_V = '[^']*';/,
        `const ASSET_V = '${stamp}';`,
      );
      fs.writeFileSync(dest, html);
      console.log(`✅ ${rel}（自动更新版本号 ${stamp}）`);
      ok++;
      continue;
    }
    fs.copyFileSync(src, dest);
    ok++;
    continue;
  }

  // 处理 JS 文件（进入静默防御混淆）
  const code = fs.readFileSync(src, "utf8");
  try {
    const obfuscated = JavaScriptObfuscator.obfuscate(code, {
      compact: true, // 压缩代码，去掉所有换行和空格，体积最小，加载最快
      
      // 🚫 关掉所有耗性能、容易导致手机白屏的炸弹
      controlFlowFlattening: false,
      deadCodeInjection: false,
      debugProtection: false,       // 绝对不要开
      stringArray: false,           // 关掉字符串加密，0 性能损耗，不影响黑胶动画
      disableConsoleOutput: true,   // 顺手把 console.log 屏蔽了，防小白偷看
      
      // 👇 三大静默防御王牌：
      domainLock: ALLOWED_DOMAINS,  // 1. 防盗版搬运（换域名直接 403/白屏）
      selfDefending: true,          // 2. 防格式化（一用代码美化工具整理就变形报错）
      identifierNamesGenerator: "hexadecimal", // 3. 变量名全变成 _0x3a4b，完全没法阅读
      
      // ⚠️ 必须关掉！否则 HTML 里的 onclick 事件全部失效
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

console.log(`\n🎉 静默防御混淆完成：成功 ${ok} 个，失败 ${fail} 个`);
console.log("👉 请将 dist/ 目录里的所有内容上传到线上服务器，源码目录未被改动。");