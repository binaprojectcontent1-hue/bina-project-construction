import fs from 'node:fs';
import path from 'node:path';

// 1. Ensure sitemap.xml fallback exists
if (fs.existsSync('dist/sitemap-index.xml')) {
  fs.copyFileSync('dist/sitemap-index.xml', 'dist/sitemap.xml');
  console.log('✓ sitemap-index.xml copied to sitemap.xml');
}

// 2. Dynamically Extract All Live URLs from Generated Sitemaps
const urls = new Set();

if (fs.existsSync('dist')) {
  const sitemapFiles = fs.readdirSync('dist').filter(file => file.startsWith('sitemap') && file.endsWith('.xml'));

  for (const file of sitemapFiles) {
    const content = fs.readFileSync(path.join('dist', file), 'utf-8');
    const locMatches = content.matchAll(/<loc>(https?:\/\/[^<]+)<\/loc>/g);
    for (const match of locMatches) {
      const url = match[1].trim();
      // Exclude sub-sitemaps from page URL list
      if (!url.endsWith('.xml')) {
        urls.add(url);
      }
    }
  }
}

// Ensure homepage & core pages are present as fallback if sitemap was empty
if (urls.size === 0) {
  urls.add('https://binaproject.com/');
  urls.add('https://binaproject.com/portfolio');
  urls.add('https://binaproject.com/blog');
  urls.add('https://binaproject.com/about');
  urls.add('https://binaproject.com/contact');
}

const urlList = Array.from(urls);
console.log(`📡 Discovered ${urlList.length} live URLs from sitemaps for search engine indexing.`);

// 3. Ping Bing Search Engine
const sitemapUrl = encodeURIComponent('https://binaproject.com/sitemap.xml');
const bingEndpoint = `https://www.bing.com/ping?sitemap=${sitemapUrl}`;

console.log('📡 Notifying Bing search engine about sitemap update...');
try {
  const res = await fetch(bingEndpoint);
  console.log(`✓ Pinged www.bing.com (Status: ${res.status})`);
} catch (err) {
  console.warn(`! Bing ping notice:`, err.message);
}

// 4. Trigger Dynamic IndexNow Broadcast for ALL Live URLs
try {
  const indexNowPayload = {
    host: 'binaproject.com',
    key: '5f4b238382c448d5b123ad841d1bfd30',
    keyLocation: 'https://binaproject.com/5f4b238382c448d5b123ad841d1bfd30.txt',
    urlList: urlList,
  };

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(indexNowPayload),
  });
  console.log(`✓ IndexNow broadcast completed for ${urlList.length} URLs (Status: ${res.status})`);
} catch (err) {
  console.warn('! IndexNow broadcast notice:', err.message);
}

console.log('🚀 SEO sitemap & IndexNow notification process finished.');
