// Push后运行：node scripts/warmup.cjs [部署地址]；只读取公开资源。
const fs = require("fs"), path = require("path");
async function main() {
  const base = new URL(process.argv[2] || "https://cgcgdsg.cc.cd/");
  const local = fs.readFileSync(path.join(__dirname, "../index.html"), "utf8").match(/const ASSET_V = '([^']+)'/)[1];
  const get = async resource => {
    const response = await fetch(new URL(resource, base), { signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`${response.status}: ${resource}`);
    return response;
  };
  const html = await (await get("./")).text();
  const version = html.match(/const ASSET_V = '([^']+)'/)?.[1];
  if (!version) throw new Error("线上入口未找到ASSET_V，无法确认目标版本");
  console.log(`线上版本 ${version}；本地版本 ${local}`);
  const files = [...new Set([...html.matchAll(/'\.\/((?:core|views|data)\/[^']+\.js)'/g)].map(m => `${m[1]}?v=${version}`))];
  for (const match of html.matchAll(/<link[^>]*href="([^"]+\.css[^"]*)"/g)) files.push(match[1]);
  files.push("data/xhs/xhs.mp4", "data/xhs/xhs-cover.jpg");
  let failed = 0;
  for (let i = 0; i < files.length; i += 3) {
    const results = await Promise.allSettled(files.slice(i, i + 3).map(async file => { await (await get(file)).arrayBuffer(); }));
    results.forEach((result, j) => { if (result.status === "rejected") { failed++; console.error(files[i + j], result.reason.message); } });
  }
  console.log(`预热完成：${files.length - failed}/${files.length}个资源成功`);
  if (version !== local) console.warn("线上部署尚未同步本地版本，本次预热的是线上现有版本");
  if (failed || version !== local) process.exitCode = 1;
}
main().catch(error => { console.error("预热失败：", error.message); process.exitCode = 1; });
