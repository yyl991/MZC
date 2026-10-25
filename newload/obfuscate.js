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
      
      // 👇 核心白名单：必须包含你所有可能访问的域名！
      domainLock: [
        'pw8nvmgu-mzc1116-10g3u3eg.maozi.io', // 你的帽子云当前链接
        'mzc1116.cc.cd',                      // 你的专属域名（以后切过来也能用）
        'mzc-dpv14dr9uz2g.edgeone.dev',       // EdgeOne 备用
        'localhost'                           // 本地测试
      ] 
    }).getObfuscatedCode();
    
    fs.writeFileSync(filePath, obfuscated);
    console.log(`✅ ${file} 混淆成功`);
  } catch (err) {
    console.error(`❌ ${file} 混淆失败:`, err);
  }
});

console.log('🎉 所有文件混淆完成！');