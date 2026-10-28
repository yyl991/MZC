const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');
const { globSync } = require('glob'); 

// 自动扫描当前目录下所有的 .js 文件
const files = globSync('*.js', { 
  cwd: __dirname, 
  ignore: ['node_modules/**', 'obfuscate.js'] 
});

console.log(`📦 发现 ${files.length} 个 JS 文件，准备开始混淆...`);

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  const code = fs.readFileSync(filePath, 'utf8');
  
  try {
    const obfuscated = JavaScriptObfuscator.obfuscate(code, {
      compact: true,                 
      controlFlowFlattening: true,   
      deadCodeInjection: true,       
      identifierNamesGenerator: 'hexadecimal', 
      stringArray: true,             
      stringArrayEncoding: ['base64'], 
      
      // 👇 开启调试保护和禁用控制台
      debugProtection: true,
      debugProtectionInterval: 2000,
      disableConsoleOutput: true,

      // 👇 已关闭域名白名单：任何人、任何域名、本地 file:// 都能打开
      // domainLock: [...]
    }).getObfuscatedCode();
    
    fs.writeFileSync(filePath, obfuscated);
    console.log(`✅ ${file} 混淆成功`);
  } catch (err) {
    console.error(`❌ ${file} 混淆失败:`, err);
  }
});

console.log('🎉 所有文件混淆完成！');