const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 确保输出目录存在
const outputDir = path.join(__dirname, 'result');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// 获取img目录下的所有图片
const imgDir = path.join(__dirname, 'img');
const files = fs.readdirSync(imgDir);

// 处理每个图片
async function compressImages() {
    for (const file of files) {
        const inputPath = path.join(imgDir, file);
        const outputPath = path.join(outputDir, file);
        
        // 检查是否为图片文件
        if (/\.(jpg|jpeg|png|gif|webp)$/i.test(file)) {
            try {
                const image = sharp(inputPath);
                const metadata = await image.metadata();
                
                if (metadata.format === 'png') {
                    await image
                        .png({ quality: 80 }) // PNG压缩
                        .toFile(outputPath);
                } else if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
                    await image
                        .jpeg({ quality: 80 }) // JPEG压缩
                        .toFile(outputPath);
                } else {
                    // 其他格式保持原样
                    await image.toFile(outputPath);
                }
                console.log(`压缩成功: ${file}`);
            } catch (error) {
                console.error(`压缩失败 ${file}:`, error);
            }
        }
    }
}

compressImages().catch(console.error);
