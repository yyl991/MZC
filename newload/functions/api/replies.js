// EdgeOne Pages 边缘函数：收集玩家在恩仔聊天里留下的自由回复
// 路由：POST /api/replies  上报一条（游戏端自动调用，无需口令）
//       GET  /api/replies?key=<读取口令>                返回 JSON 列表
//       GET  /api/replies?key=<读取口令>&format=html    返回手机友好的表格页
// 前置（一次性）：EdgeOne 控制台 → 本项目 → KV 存储 → 创建命名空间并绑定到边缘函数，变量名必须为 REPLIES_KV
const ADMIN_KEY = "0adac617350db75003c4f80b8ad733cb"; // 读取口令：改这里即可（改完重新部署）
const KV_KEY = "enzai_replies";
const MAX_ITEMS = 1000;

const esc = (s) =>
  String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function htmlPage(body) {
  return new Response(
    `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>玩家自由回复</title><body style="margin:0;background:#141414;color:#eee;font-size:14px;line-height:1.7;padding:16px;">${body}</body>`,
    { headers: { "content-type": "text/html; charset=utf-8" } },
  );
}

async function readList(env) {
  const kv = env && env.REPLIES_KV;
  if (!kv) return null; // KV 未绑定
  try {
    const raw = await kv.get(KV_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    return [];
  }
}

export async function onRequestPost({ request, env }) {
  try {
    let body = {};
    try {
      body = await request.json();
    } catch (e) {
      return json({ ok: false, error: "bad json" }, 400);
    }
    const text = String(body.text || "").trim();
    if (!text) return json({ ok: false, error: "empty" }, 400);
    const list = await readList(env);
    if (list === null) {
      return json(
        { ok: false, error: "KV 未绑定：请在 EdgeOne 控制台创建 KV 命名空间并绑定变量名 REPLIES_KV 后重新部署" },
        503,
      );
    }
    list.push({
      time: String(body.time || "").slice(0, 40),
      recv: new Date().toISOString(),
      text: text.slice(0, 300),
    });
    while (list.length > MAX_ITEMS) list.shift();
    await env.REPLIES_KV.put(KV_KEY, JSON.stringify(list));
    return json({ ok: true, count: list.length });
  } catch (e) {
    return json({ ok: false, error: String((e && e.message) || e) }, 500);
  }
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  if ((url.searchParams.get("key") || "") !== ADMIN_KEY) {
    return json({ ok: false, error: "forbidden" }, 403);
  }
  const list = (await readList(env)) || [];
  if (url.searchParams.get("format") !== "html") {
    return json({ ok: true, count: list.length, list });
  }
  const rows = list
    .map(
      (r) =>
        `<div style="background:#1f1f22;border-radius:10px;padding:10px 12px;margin-bottom:8px;">` +
        `<span style="color:#8e8e93;font-size:12px;">${esc(r.recv || r.time || "")}</span>` +
        (r.time ? ` <span style="color:#8e8e93;font-size:12px;">· 玩家时区 ${esc(r.time)}</span>` : "") +
        `<br>${esc(r.text)}</div>`,
    )
    .join("");
  return htmlPage(
    `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">` +
      `<b style="font-size:16px;">玩家自由回复（共 ${list.length} 条）</b>` +
      `<a href="?key=${esc(ADMIN_KEY)}" style="color:#d7a5b3;text-decoration:none;">JSON</a></div>` +
      (list.length ? rows : `<div style="color:#8e8e93;">还没有收集到回复</div>`),
  );
}
