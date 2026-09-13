import fs from 'node:fs';

// 1. Ensure sitemap.xml fallback exists
if (fs.existsSync('dist/sitemap-index.xml')) {
  fs.copyFileSync('dist/sitemap-index.xml', 'dist/sitemap.xml');
  console.log('✓ sitemap-index.xml copied to sitemap.xml');
}

// 2. Ping Search Engines (Google & Bing)
const sitemapUrl = encodeURIComponent('https://binaproject.com/sitemap.xml');
const pingEndpoints = [
  `https://www.google.com/ping?sitemap=${sitemapUrl}`,
  `https://www.bing.com/ping?sitemap=${sitemapUrl}`,
];

console.log('📡 Notifying search engines about sitemap update...');

for (const endpoint of pingEndpoints) {
  try {
    const res = await fetch(endpoint);
    console.log(`✓ Pinged ${new URL(endpoint).hostname} (Status: ${res.status})`);
  } catch (err) {
    console.warn(`! Ping notice for ${endpoint}:`, err.message);
  }
}

// 3. Trigger IndexNow for core pages
try {
  const indexNowPayload = {
    host: 'binaproject.com',
    key: '5f4b238382c448d5b123ad841d1bfd30',
    keyLocation: 'https://binaproject.com/5f4b238382c448d5b123ad841d1bfd30.txt',
    urlList: [
      'https://binaproject.com/',
      'https://binaproject.com/portfolio',
      'https://binaproject.com/blog',
      'https://binaproject.com/about',
      'https://binaproject.com/contact',
    ],
  };

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(indexNowPayload),
  });
  console.log(`✓ IndexNow broadcast completed (Status: ${res.status})`);
} catch (err) {
  console.warn('! IndexNow broadcast notice:', err.message);
}

console.log('🚀 SEO sitemap & IndexNow notification process finished.');
