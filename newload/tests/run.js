// 一键回归：node tests/run.js
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const dir = __dirname;
const files = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith(".test.js"))
  .sort();

let failed = 0;
for (const f of files) {
  const r = spawnSync(process.execPath, [path.join(dir, f)], {
    encoding: "utf8",
  });
  const out = (r.stdout || "") + (r.stderr || "");
  const bad = r.status !== 0 || /\bFAIL\b|\d+ FAILS/.test(out);
  console.log((bad ? "✗ " : "✓ ") + f);
  if (bad) {
    failed++;
    console.log(
      out
        .split("\n")
        .filter((l) => /FAIL|Error|error/.test(l))
        .slice(0, 6)
        .map((l) => "    " + l)
        .join("\n"),
    );
  }
}
console.log(failed ? `\n${failed} 个测试失败` : "\n全部通过 ✅");
process.exit(failed ? 1 : 0);
