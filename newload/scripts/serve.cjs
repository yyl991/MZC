// scripts/serve.cjs — 本地预览用极简静态服务器
// 禁用缓存，改完文案直接刷新就能看到新版，不用升 ASSET_V
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PORT = Number(process.env.PORT || 8899);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".png": "image/png", ".gif": "image/gif", ".webp": "image/webp",
  ".mp3": "audio/mpeg", ".mp4": "video/mp4", ".wav": "audio/wav", ".m4a": "audio/mp4",
  ".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf",
  ".ico": "image/x-icon", ".txt": "text/plain; charset=utf-8",
};

http.createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  } catch (e) {
    res.writeHead(400);
    return res.end("bad request");
  }
  if (pathname === "/") pathname = "/index.html";

  const file = path.resolve(ROOT, "." + pathname);
  if (!file.startsWith(ROOT + path.sep)) {
    res.writeHead(403);
    return res.end("forbidden");
  }

  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) {
      res.writeHead(404);
      return res.end("404 " + pathname);
    }
    res.writeHead(200, {
      "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
    });
    fs.createReadStream(file).pipe(res);
  });
}).listen(PORT, "127.0.0.1", () => {
  console.log("本地预览已启动： http://127.0.0.1:" + PORT + "/");
  console.log("弹窗预览：       http://127.0.0.1:" + PORT + "/index.html?dev=1&sourcePreview=1");
  console.log("统计查看：       http://127.0.0.1:" + PORT + "/index.html?source=1");
  console.log("Ctrl+C 退出");
});
