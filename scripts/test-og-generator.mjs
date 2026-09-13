import fs from 'node:fs';
import path from 'node:path';
import { generateOgImage } from '../src/lib/ogGenerator.ts';

async function runTest() {
  console.log('Testing OG Image Generator...');

  // Test 1: Generate Blog Card (with blueprint fallback)
  const blogBuf = await generateOgImage({
    title: 'Tips Memilih Material Kitchen Set Minimalis Anti Rayap & Lembap',
    category: 'TIPS & EDUKASI',
    metaInfo: '4 Menit Baca',
    type: 'blog',
  });

  if (!Buffer.isBuffer(blogBuf)) throw new Error('Result is not a buffer');
  console.log(`✓ Blog OG Generated: ${blogBuf.length} bytes (${Math.round(blogBuf.length / 1024)} KB)`);

  // Test 2: Generate Portfolio Card with local asset cover
  const portfolioBuf = await generateOgImage({
    title: 'Modern Minimalist Living & Kitchen Set di Sleman Yogyakarta',
    category: 'INTERIOR DESIGN',
    metaInfo: 'Sleman, D.I. Yogyakarta',
    coverImageUrl: 'public/assets/img/og-image.webp',
    type: 'portfolio',
  });

  console.log(`✓ Portfolio OG Generated: ${portfolioBuf.length} bytes (${Math.round(portfolioBuf.length / 1024)} KB)`);

  // Verification: Ensure well under WhatsApp's 500 KB limit and < 250 KB for instant previews
  if (blogBuf.length > 250 * 1024) throw new Error(`Blog OG exceeds 250 KB: ${blogBuf.length}`);
  if (portfolioBuf.length > 250 * 1024) throw new Error(`Portfolio OG exceeds 250 KB: ${portfolioBuf.length}`);

  const outputDir = path.resolve('dist-test');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, 'test-blog-og.png'), blogBuf);
  fs.writeFileSync(path.join(outputDir, 'test-portfolio-og.png'), portfolioBuf);
  console.log('✓ Test output saved to dist-test/ for visual review.');
}

runTest().catch((err) => {
  console.error('OG Generator test failed:', err);
  process.exit(1);
});
