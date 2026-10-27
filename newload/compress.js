const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { execSync } = require('child_process');
const { globSync } = require('glob');

// ================= 配置区 =================
const IMAGE_QUALITY = 80; // 图片质量 (80为肉眼无损，嫌大可以改 70)
const MIN_IMAGE_SIZE_KB = 100; // 小于 100KB 的图不压
const MIN_VIDEO_SIZE_MB = 2; // 小于 2MB 的视频不压
const AUDIO_BITRATE = '192k'; // 音频转码码率

const ffmpegPath = path.join(__dirname, 'ffmpeg.exe');
const hasFfmpeg = fs.existsSync(ffmpegPath);
// ==========================================

let savedSpace = 0; // 统计总共节省的空间 (KB)

// 1. 压缩图片
async function compressImages() {
  const files = globSync('data/**/*.{jpg,jpeg,png,webp}', { cwd: __dirname });
  console.log(`\n📸 找到 ${files.length} 张图片，开始无痛压缩...`);
  
  for (const file of files) {
    const filePath = path.join(__dirname, file);
    const stat = fs.statSync(filePath);
    const sizeKB = stat.size / 1024;

    if (sizeKB < MIN_IMAGE_SIZE_KB) continue;

    try {
      const ext = path.extname(filePath).toLowerCase();
      let pipeline = sharp(filePath);
      const metadata = await pipeline.metadata();
      if (metadata.width > 800) pipeline = pipeline.resize({ width: 800 });

      if (ext === '.jpg' || ext === '.jpeg') pipeline = pipeline.jpeg({ quality: IMAGE_QUALITY, mozjpeg: true });
      else if (ext === '.png') pipeline = pipeline.png({ quality: IMAGE_QUALITY, compressionLevel: 9 });
      else if (ext === '.webp') pipeline = pipeline.webp({ quality: IMAGE_QUALITY });

      const tempPath = filePath + '.tmp';
      await pipeline.toFile(tempPath);
      const newSizeKB = fs.statSync(tempPath).size / 1024;

      if (newSizeKB < sizeKB) {
        fs.unlinkSync(filePath);
        fs.renameSync(tempPath, filePath);
        savedSpace += (sizeKB - newSizeKB);
        console.log(`✅ [图片] ${file} : ${sizeKB.toFixed(0)}KB -> ${newSizeKB.toFixed(0)}KB`);
      } else {
        fs.unlinkSync(tempPath);
      }
    } catch (err) {
      console.error(`❌ 图片压缩失败: ${file}`, err.message);
    }
  }
}

// 2. 压缩视频
function compressVideos() {
  if (!hasFfmpeg) return;
  const files = globSync('data/**/*.mp4', { cwd: __dirname });
  console.log(`\n🎬 找到 ${files.length} 个视频，开始压缩...`);

  files.forEach(file => {
    const filePath = path.join(__dirname, file);
    const stat = fs.statSync(filePath);
    const sizeMB = stat.size / 1024 / 1024;
    
    if (sizeMB < MIN_VIDEO_SIZE_MB) return;

    console.log(`⏳ 正在压缩视频: ${file} (${sizeMB.toFixed(1)}MB)...`);
    const tempPath = filePath + '.temp.mp4';
    const cmd = `"${ffmpegPath}" -y -i "${filePath}" -vf "scale=-2:720" -c:v libx264 -crf 28 -c:a aac -b:a 96k "${tempPath}"`;
    
    try {
      execSync(cmd, { stdio: 'ignore' });
      fs.unlinkSync(filePath);
      fs.renameSync(tempPath, filePath);
      const newSizeMB = fs.statSync(filePath).size / 1024 / 1024;
      savedSpace += (sizeMB - newSizeMB) * 1024;
      console.log(`✅ [视频] ${file} : ${sizeMB.toFixed(1)}MB -> ${newSizeMB.toFixed(1)}MB`);
    } catch (e) {
      console.error(`❌ 视频压缩失败: ${file}`, e.message);
    }
  });
}

// 3. 转换音频
function convertAudios() {
  if (!hasFfmpeg) return;
  const files = globSync('data/**/*.wav', { cwd: __dirname });
  console.log(`\n🎵 找到 ${files.length} 个 WAV 音频，准备转为 MP3...`);

  files.forEach(file => {
    const filePath = path.join(__dirname, file);
    const mp3Path = filePath.replace(/\.wav$/i, '.mp3');
    const sizeMB = fs.statSync(filePath).size / 1024 / 1024;
    
    console.log(`⏳ 正在转换音频: ${file} (${sizeMB.toFixed(1)}MB)...`);
    const cmd = `"${ffmpegPath}" -y -i "${filePath}" -codec:a libmp3lame -b:a ${AUDIO_BITRATE} "${mp3Path}"`;
    
    try {
      execSync(cmd, { stdio: 'ignore' });
      fs.unlinkSync(filePath); // 删掉原来的 wav
      const newSizeMB = fs.statSync(mp3Path).size / 1024 / 1024;
      savedSpace += (sizeMB - newSizeMB) * 1024;
      console.log(`✅ [音频] ${file} -> ${path.basename(mp3Path)} (${sizeMB.toFixed(1)}MB -> ${newSizeMB.toFixed(1)}MB)`);
    } catch (e) {
      console.error(`❌ 音频转换失败: ${file}`, e.message);
    }
  });
}

// ================= 执行入口 =================
(async () => {
  console.log("🚀 开始一键压缩任务...");
  
  if (!hasFfmpeg) {
    console.warn("⚠️ 未找到 ffmpeg.exe，将跳过视频和音频的压缩！(只压图片)");
  }

  await compressImages();
  compressVideos();
  convertAudios();

  console.log(`\n🎉 全部任务完成！`);
  if (savedSpace > 0) {
    console.log(`✨ 共节省了约 ${(savedSpace / 1024).toFixed(2)} MB 空间！`);
  }
  
  if (hasFfmpeg) {
    console.log(`\n🚨 重要提醒：音频已从 .wav 转换为了 .mp3。`);
    console.log(`请务必去 index.html 或代码里，把 src="./data/app/bgm.wav" 改成 src="./data/app/bgm.mp3" !`);
  }
})();