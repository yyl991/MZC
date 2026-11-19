# 项目长期约定（newload / 橙粉色捡起来）

## 来源调查弹窗（core/source_survey.js）— 作者明确的硬性要求

1. **一个设备只弹一次**：弹窗只要真正展示过，就必须立刻持久化标记 `mzc_source_survey_done=1`。作答、点「先不填」、以及「弹出后未作答就刷新」都必须保证刷新/重进后不再弹。会话内 `surveyShown` 只负责「点微博」与「5 分钟兜底」两者互斥，不能替代持久化标记。
   - 作者预览 `?dev=1&sourcePreview=1` 走 `showPopup(true)` 豁免标记，方便反复查看；预览页不挂兜底计时器。
   - 统计页「重置弹窗」清 `mzc_source_survey_done`，供作者重测。

2. **数据必须与恩仔聊天分离**：来源答案只上报独立表 `source_survey`（POST `/rest/v1/source_survey`，字段 time/uid/ip/region/source/detail）。**绝不能写进 `replies` 表或加 `[来源]` 前缀混写**。建表 SQL 在 `data/survey/supabase_source_survey.sql`。恩仔聊天的 `replies` 表逻辑在 `core/app.js`，勿动。

   IP/region 字段**保留**：游戏启动时 `getPlayerNet`（搜狐 `pv.sohu.com/cityjson`）已把具体公网 IP + 省市缓存进 `sessionStorage` 的 `mzc_player_net`，来源调查直接同步读缓存并**立即上报**。切勿把上报塞回 `getPlayerNet` 的异步回调里——那样最长等 3.6 秒、玩家秒关页会丢答案，且回调只改本机数组导致上报体里 IP 永远是「未知」。拿不到时降级为 "unknown"，SQL 字段无需改动。

3. **绝不影响其他功能**：`core/app.js` 里两处钩子保持 `typeof window.xxx === "function"` + `try/catch` 防御式调用（脚本加载失败也不能拖垮 app）；弹窗内联 `<style>` 选择器统一加 `#src-survey-pop` 前缀，避免全局样式污染；作者工具页（`source=1` / `sourcePreview=1` / `thanksPreview=1`）不挂 5 分钟兜底定时器。

4. **触发**：首次点开微博立即弹；开局 `fallbackMs`（默认 5 分钟）内既没点微博也没答过则兜底弹。两者互斥，只弹一次。作者本机测兜底用 `?dev=1&sourceFallback=1`（缩到 5 秒）。

## 已知无关问题
- `npm test` 中 `wx.test.js` 长期失败（聊天数据顺序断言），与来源调查模块无关。不要为修它而改动弹窗逻辑。
