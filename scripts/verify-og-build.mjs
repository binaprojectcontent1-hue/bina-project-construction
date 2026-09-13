import fs from 'node:fs';
import path from 'node:path';

function inspectOgDir(dir) {
  if (!fs.existsSync(dir)) {
    console.error('Directory does not exist:', dir);
    return;
  }
  const files = fs.readdirSync(dir, { recursive: true });
  for (const f of files) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isFile()) {
      console.log(`[OG FILE] ${f} - ${stat.size} bytes (${Math.round(stat.size / 1024)} KB)`);
    }
  }
}

console.log('=== Checking dist/og ===');
inspectOgDir('dist/og');

console.log('\n=== Checking HTML og:image tags ===');
const blogHtmlPath = 'dist/blog/trik-desain-kitchen-set-kunci-untuk-dapur-nyaman-dan-modern/index.html';
if (fs.existsSync(blogHtmlPath)) {
  const blogHtml = fs.readFileSync(blogHtmlPath, 'utf-8');
  const blogOgMatch = blogHtml.match(/<meta property=["']og:image["'] content=["']([^"']+)["']/);
  const blogTwMatch = blogHtml.match(/<meta name=["']twitter:image["'] content=["']([^"']+)["']/);
  console.log('Blog og:image tag:', blogOgMatch ? blogOgMatch[1] : 'NOT FOUND');
  console.log('Blog twitter:image tag:', blogTwMatch ? blogTwMatch[1] : 'NOT FOUND');
}

const portHtmlPath = 'dist/portfolio/kitchen-set-pak-mario/index.html';
if (fs.existsSync(portHtmlPath)) {
  const portHtml = fs.readFileSync(portHtmlPath, 'utf-8');
  const portOgMatch = portHtml.match(/<meta property=["']og:image["'] content=["']([^"']+)["']/);
  const portTwMatch = portHtml.match(/<meta name=["']twitter:image["'] content=["']([^"']+)["']/);
  console.log('Portfolio og:image tag:', portOgMatch ? portOgMatch[1] : 'NOT FOUND');
  console.log('Portfolio twitter:image tag:', portTwMatch ? portTwMatch[1] : 'NOT FOUND');
}
