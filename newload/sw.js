/* sw.js — 静态资源缓存（解决静态托管无缓存头导致的头像/图片反复"重新加载"）
 *
 * 策略：
 * - 页面导航（HTML）不拦截，始终走网络，保证代码更新能生效。
 * - 同源静态资源（图片/音频/字体/CSS/JS）：stale-while-revalidate。
 *   命中缓存立即返回（零等待、不闪白），同时后台静默拉新并更新缓存，
 *   这样既秒开、又能在作者换图后自动拿到新版本，无需手动清缓存。
 * - 只处理 GET、只处理同源，跨域（如统计/定位接口）一律放行不干预。
 *
 * 注意：此文件不要混淆，必须原样部署在站点根目录（scope 才能覆盖全站）。
 */
"use strict";

var CACHE = "mzc-static-v1";

// 只缓存这些后缀的静态资源。
// 注意：音频(mp3/wav/m4a…)故意不缓存——音频走 HTTP Range 分段请求，SW 用整份响应
// 拦截会破坏 seek/循环；而且音频体积大，缓存它收益低还可能干扰播放。交给浏览器原生缓存。
var ASSET_RE = /\.(png|jpe?g|gif|webp|svg|ico|bmp|woff2?|ttf|otf|css|js)(\?|$)/i;

self.addEventListener("install", function () {
  // 新版本 SW 立即接管，不用等旧页面全部关闭
  try { self.skipWaiting(); } catch (e) {}
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    Promise.resolve()
      .then(function () {
        return caches.keys().then(function (keys) {
          return Promise.all(keys.map(function (k) {
            if (k !== CACHE) return caches.delete(k);
          }));
        });
      })
      .then(function () {
        try { return self.clients.claim(); } catch (e) {}
      })
      .catch(function () {})
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  try {
    if (req.method !== "GET") return;
    var url = new URL(req.url);
    if (url.origin !== self.location.origin) return;          // 跨域不碰
    if (req.mode === "navigate") return;                       // HTML 走网络
    if (!ASSET_RE.test(url.pathname)) return;                  // 非静态资源不碰

    e.respondWith(
      caches.open(CACHE).then(function (cache) {
        return cache.match(req).then(function (cached) {
          // 后台静默更新缓存（stale-while-revalidate）：不阻塞显示
          var network = fetch(req).then(function (res) {
            if (res && res.ok && res.type === "basic") {
              try { cache.put(req, res.clone()); } catch (e) {}
            }
            return res;
          }).catch(function () { return null; });

          if (cached) {
            network.catch(function () {}); // fire-and-forget
            return cached;
          }
          return network.then(function (res) {
            if (res) return res;
            return fetch(req); // 兜底：让浏览器自己报错
          });
        });
      }).catch(function () {
        return fetch(req); // SW 任何异常都不能害资源加载失败
      })
    );
  } catch (err) {
    // 解析失败等边缘情况：不接管，交回浏览器默认行为
    return;
  }
});
