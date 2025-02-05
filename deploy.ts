import { fileURLToPath } from 'url';
import path from 'path';
import * as basicFtp from 'basic-ftp';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use environment variables for sensitive data
const config = {
  host: 'pdx1-shared-a1-45.dreamhost.com',
  username: process.env.DREAMHOST_USERNAME,
  password: process.env.DREAMHOST_PASSWORD,
  path: '/nxuacademy.co.uk/public',
  port: 21
};

async function buildProject() {
  console.log('Building project...');
  try {
    const { exec } = await import('child_process');
    await new Promise((resolve, reject) => {
      exec('npm run build', (error, stdout, stderr) => {
        if (error) reject(error);
        else resolve(stdout);
      });
    });
    console.log('Build completed successfully');
  } catch (error) {
    console.error('Build failed:', error);
    throw error;
  }
}

async function uploadDirectory(client: basicFtp.Client, localDir: string, remoteDir: string): Promise<void> {
  try {
    const files = await fs.promises.readdir(localDir);

    // Ensure remote directory exists
    await client.ensureDir(remoteDir);
    console.log(`Created/ensured directory exists: ${remoteDir}`);

    for (const file of files) {
      const localPath = path.join(localDir, file);
      const remotePath = path.posix.join(remoteDir, file);
      const stats = await fs.promises.stat(localPath);

      if (stats.isDirectory()) {
        console.log(`Processing directory: ${remotePath}`);
        await uploadDirectory(client, localPath, remotePath);
      } else {
        console.log(`Uploading file: ${remotePath}`);
        await client.uploadFrom(localPath, remotePath);
        console.log(`Uploaded: ${file}`);
      }
    }
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

async function deployFiles() {
  console.log('Starting deployment...');
  const client = new basicFtp.Client();
  client.ftp.verbose = true;

  try {
    console.log('Connecting to FTP server...');
    // Don't log sensitive information
    console.log('Using host:', config.host);
    console.log('Using port:', config.port);

    await client.access({
      host: config.host,
      user: config.username,
      password: config.password,
      port: config.port,
      secure: false
    });

    console.log('FTP connection established successfully');

    const distPath = path.resolve(__dirname, '..', 'dist');
    console.log('Uploading from:', distPath);
    console.log('Uploading to:', config.path);

    await uploadDirectory(client, distPath, config.path);
    console.log('Deployment completed successfully');
  } catch (error) {
    console.error('Deployment failed:', error);
    throw error;
  } finally {
    client.close();
  }
}

async function deploy() {
  try {
    await buildProject();
    await deployFiles();
    console.log('Deployment completed successfully');
  } catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
  }
}

deploy();