import sharp from 'sharp';
import { mkdir, writeFile, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import https from 'https';
import FormData from 'form-data';

const publicDir = 'client/public';
const outputPath = path.join(publicDir, 'images');

async function ensureDirectoryExists(directory) {
  if (!existsSync(directory)) {
    await mkdir(directory, { recursive: true });
    console.log(`Created directory: ${directory}`);
  }
}

async function removeBackground(inputPath, outputPath) {
  try {
    const imageData = await readFile(inputPath);

    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('image_file', imageData, {
        filename: 'image.jpg',
        contentType: 'image/jpeg'
      });
      formData.append('size', 'regular');
      formData.append('type', 'person');
      formData.append('format', 'png');
      formData.append('crop', 'true');
      formData.append('crop_margin', '25'); // Keep margin for head capture

      const options = {
        hostname: 'api.remove.bg',
        path: '/v1.0/removebg',
        method: 'POST',
        headers: {
          'X-Api-Key': process.env.REMOVE_BG_API_KEY,
          ...formData.getHeaders()
        }
      };

      const req = https.request(options, (res) => {
        if (res.statusCode !== 200) {
          console.error('Remove.bg API response:', res.statusCode);
          const chunks = [];
          res.on('data', (chunk) => chunks.push(chunk));
          res.on('end', () => {
            const errorResponse = Buffer.concat(chunks).toString();
            console.error('API Error Response:', errorResponse);
            reject(new Error(`Remove.bg API error: ${res.statusCode}`));
          });
          return;
        }

        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', async () => {
          const buffer = Buffer.concat(chunks);
          await writeFile(outputPath, buffer);
          resolve();
        });
      });

      req.on('error', (error) => {
        console.error('Request error:', error);
        reject(error);
      });

      formData.pipe(req);
    });
  } catch (error) {
    console.error('Error reading input file:', error);
    throw error;
  }
}

async function processImage() {
  try {
    await ensureDirectoryExists(publicDir);
    await ensureDirectoryExists(outputPath);

    const inputPath = 'attached_assets/IMG_8807.jpeg';
    const tempOutputPath = path.join(outputPath, 'temp-profile.png');
    const finalOutputPath = path.join(outputPath, 'eugene-profile.png');

    console.log('Removing background from image...');
    await removeBackground(inputPath, tempOutputPath);

    console.log('Centering and adjusting image...');
    await sharp(tempOutputPath)
      .resize({
        width: 800,
        height: 800,
        fit: 'contain',
        position: 'centre',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .modulate({
        brightness: 1.1,
        saturation: 1.1
      })
      .toFormat('png', { 
        quality: 100,
        compressionLevel: 9
      })
      .toFile(finalOutputPath);

    console.log('Image processed and saved successfully');
  } catch (err) {
    console.error('Error processing image:', err);
    process.exit(1);
  }
}

processImage();