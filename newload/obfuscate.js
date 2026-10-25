const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');

const files = ['app.js', 'app_music.js', 'app_xianyu.js', 'app_weibo.js', 'app_wechat.js']; // 按需添加

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;
  const code = fs.readFileSync(filePath, 'utf8');
  const obfuscated = JavaScriptObfuscator.obfuscate(code, {
    compact: true,
    controlFlowFlattening: true,
    deadCodeInjection: true,
    identifierNamesGenerator: 'hexadecimal',
    stringArray: true,
    stringArrayEncoding: ['base64']
  }).getObfuscatedCode();
  fs.writeFileSync(filePath, obfuscated);
  console.log(`✅ ${file} 混淆完成`);
});