import fs from 'node:fs';
import path from 'node:path';

// Parse .env if present
function loadEnv() {
  if (fs.existsSync('.env')) {
    const lines = fs.readFileSync('.env', 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnv();

const repo = process.env.PUBLIC_CDN_REPO || 'binaprojectcontent1-hue/bina-media';
const branch = process.env.PUBLIC_CDN_BRANCH || 'main';
const token = process.env.GITHUB_TOKEN;

async function syncMedia() {
  console.log(`📦 [Media Sync] Checking media assets from ${repo}@${branch}...`);

  const headers = {
    'User-Agent': 'BinaProject-MediaSync/1.0',
  };
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/git/trees/${branch}?recursive=1`, { headers });
    if (!res.ok) {
      console.warn(`⚠️ [Media Sync] GitHub API returned status ${res.status}. Falling back to local cache.`);
      return;
    }

    const data = await res.json();
    if (!data.tree || !Array.isArray(data.tree)) {
      console.warn('⚠️ [Media Sync] No git tree found in response.');
      return;
    }

    const mediaFiles = data.tree.filter((item) => {
      return item.type === 'blob' && !item.path.endsWith('.md');
    });

    console.log(`🔍 [Media Sync] Found ${mediaFiles.length} media files in repository.`);

    const publicMediaDir = path.resolve('public/media');
    const distMediaDir = fs.existsSync('dist') ? path.resolve('dist/media') : null;

    let downloaded = 0;
    let cached = 0;

    for (const file of mediaFiles) {
      const destPublic = path.join(publicMediaDir, file.path);
      fs.mkdirSync(path.dirname(destPublic), { recursive: true });

      const needsDownload = !fs.existsSync(destPublic) || fs.statSync(destPublic).size !== file.size;

      if (needsDownload) {
        try {
          const imgUrl = `https://cdn.jsdelivr.net/gh/${repo}@${branch}/${file.path}`;
          const imgRes = await fetch(imgUrl);
          if (imgRes.ok) {
            const buffer = Buffer.from(await imgRes.arrayBuffer());
            fs.writeFileSync(destPublic, buffer);
            downloaded++;
          } else {
            console.warn(`⚠️ [Media Sync] Could not fetch ${file.path}: ${imgRes.status}`);
          }
        } catch (downloadErr) {
          console.warn(`⚠️ [Media Sync] Error downloading ${file.path}:`, downloadErr.message);
        }
      } else {
        cached++;
      }

      // Also ensure dist/media has the file if dist exists (for preview)
      if (distMediaDir && fs.existsSync(destPublic)) {
        const destDist = path.join(distMediaDir, file.path);
        fs.mkdirSync(path.dirname(destDist), { recursive: true });
        if (!fs.existsSync(destDist) || fs.statSync(destDist).size !== fs.statSync(destPublic).size) {
          fs.copyFileSync(destPublic, destDist);
        }
      }
    }

    console.log(`✅ [Media Sync] Complete: ${downloaded} downloaded, ${cached} already up-to-date.`);
  } catch (err) {
    console.warn('⚠️ [Media Sync] Network check failed, proceeding with local assets:', err.message);
  }
}

async function minifyAssets() {
  try {
    const { transformSync } = await import('esbuild');

    // Minify style.css
    const cssPath = path.resolve('public/assets/css/style.css');
    const cssMinPath = path.resolve('public/assets/css/style.min.css');
    if (fs.existsSync(cssPath)) {
      const rawCss = fs.readFileSync(cssPath, 'utf-8');
      const minifiedCss = transformSync(rawCss, { loader: 'css', minify: true });
      fs.writeFileSync(cssMinPath, minifiedCss.code);
      console.log(`⚡ [Asset Minify] style.min.css generated (${Math.round(minifiedCss.code.length / 1024)} KB).`);
    }
  } catch (err) {
    console.warn('⚠️ [Asset Minify] Minification skipped:', err.message);
  }
}

async function optimizeMediaImages() {
  try {
    const sharpModule = await import('sharp');
    const sharp = sharpModule.default || sharpModule;
    const portfolioDir = path.resolve('public/media/portfolio');
    if (!fs.existsSync(portfolioDir)) return;

    const files = fs.readdirSync(portfolioDir);
    let optimizedCount = 0;
    let savedBytes = 0;

    for (const file of files) {
      const filePath = path.join(portfolioDir, file);
      if (!/\.(jpe?g|png)$/i.test(file)) continue;

      const stat = fs.statSync(filePath);
      // If file is > 60 KB, compress and resize to max width 800
      if (stat.size > 60 * 1024) {
        const rawBuffer = fs.readFileSync(filePath);
        const image = sharp(rawBuffer);
        const meta = await image.metadata();

        if (meta.width && meta.width > 800) {
          const buffer = await sharp(rawBuffer)
            .resize({ width: 800, withoutEnlargement: true })
            .jpeg({ quality: 78, mozjpeg: true })
            .toBuffer();

          if (buffer.length < stat.size) {
            savedBytes += (stat.size - buffer.length);
            fs.writeFileSync(filePath, buffer);
            optimizedCount++;

            // Also update dist if it exists
            const distPath = path.resolve('dist/media/portfolio', file);
            if (fs.existsSync(path.dirname(distPath))) {
              fs.writeFileSync(distPath, buffer);
            }
          }
        }
      }
    }

    if (optimizedCount > 0) {
      console.log(`🖼️  [Media Optimize] Compressed ${optimizedCount} images (saved ${(savedBytes / 1024).toFixed(1)} KB).`);
    }
  } catch (err) {
    console.warn('⚠️ [Media Optimize] Image optimization skipped:', err.message);
  }
}

await syncMedia();
await optimizeMediaImages();
await minifyAssets();

