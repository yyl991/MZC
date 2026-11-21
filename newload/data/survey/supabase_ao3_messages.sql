-- ============================================================
-- AO3 玩家留言 · 实时视图方案（可重复执行，一次 Run 完）
-- 用途：查看「来源调查里选了 ao3 的玩家」发给恩仔的全部留言
-- 数据来源（实时 join，永远最新）：
--   source_survey → 找出 source='ao3' 的玩家 uid
--   replies       → 这些玩家的留言正文/时间/IP/地区，并用 row_number 现算第几条
-- 与旧方案区别：旧版是「快照表」，每次 Run 才刷新（所以会停在最后一次 Run）；
--               新版是「视图」，任何时候查都实时反映最新数据，无需再手动重跑。
-- 安全：旧快照表改名备份、不丢数据；视图只读、以所有者权限执行以绕过源表 RLS。
-- 项目：oprecriimhoisvvwazte（与 replies / source_survey 同一个项目）
-- ============================================================

-- 1) 旧快照表 → 改名备份（幂等：只有当前是「真实表」才改名，已是视图则跳过）
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'ao3_messages' and table_type = 'BASE TABLE'
  ) then
    drop table if exists ao3_messages_bak;
    alter table ao3_messages rename to ao3_messages_bak;
  end if;
end $$;

-- 2) 建实时视图（直接读 replies + source_survey，自动算第几条）
create or replace view ao3_messages as
with ranked as (
  select
    id,
    uid,
    "time" as reply_time,
    "text" as reply_text,
    row_number() over (partition by uid order by id) as nth
  from replies
)
select
  row_number() over (order by ranked.uid, ranked.nth)::bigint as id,
  now() as created_at,
  ranked.uid,
  ranked.nth,
  ranked.reply_time as time,
  ranked.reply_text as text,
  r.ip,
  r.region,
  'ao3'::text as source
from ranked
join replies r on r.id = ranked.id
where exists (
  select 1 from source_survey s
  where s.uid = ranked.uid and lower(s.source) = 'ao3'
);

-- 3) 允许匿名/登录用户读取（只读视图，不暴露源表本身）
grant select on ao3_messages to anon, authenticated;

-- 4) 显式确保视图以所有者权限执行（绕过 replies / source_survey 的 RLS）
--    Supabase 的 PG15+ 视图默认就是 security_invoker=false，这句是双保险；
--    若极老版本报错可忽略，不影响视图读取。
alter view ao3_messages set (security_invoker = false);

-- ============================================================
-- 常用查询（需要时单独复制运行）
-- 看最新 20 条：
--   select uid, nth, time, text from ao3_messages order by time desc limit 20;
-- 查看全部 AO3 留言（按玩家、第几条排序）：
--   select uid, nth, time, text from ao3_messages order by uid, nth;
-- 统计有多少 AO3 玩家留过言：
--   select count(distinct uid) from ao3_messages;
-- ============================================================
