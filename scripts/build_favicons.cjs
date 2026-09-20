const sharp = require('sharp');
const fs = require('fs');

async function run() {
  const source = 'public/favicon.png';
  console.log('Source exists:', fs.existsSync(source));

  // Generate 48x48 PNG specifically for Google guidelines
  const buf16 = await sharp(source).resize(16, 16).png().toBuffer();
  const buf32 = await sharp(source).resize(32, 32).png().toBuffer();
  const buf48 = await sharp(source).resize(48, 48).png().toBuffer();

  fs.writeFileSync('public/assets/img/favicons/favicon-48x48.png', buf48);
  console.log('Created favicon-48x48.png');

  // Build multi-size ICO with 16x16, 32x32, and 48x48 embedded PNGs
  const images = [
    { width: 16, height: 16, buffer: buf16 },
    { width: 32, height: 32, buffer: buf32 },
    { width: 48, height: 48, buffer: buf48 }
  ];

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // ICO type = 1
  header.writeUInt16LE(images.length, 4); // number of images

  let offset = 6 + images.length * 16;
  const entries = [];

  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // color palette count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8); // size of image data
    entry.writeUInt32LE(offset, 12); // offset
    entries.push(entry);
    offset += img.buffer.length;
  }

  const icoBuffer = Buffer.concat([header, ...entries, ...images.map(img => img.buffer)]);

  fs.writeFileSync('public/favicon.ico', icoBuffer);
  fs.writeFileSync('public/assets/img/favicons/favicon.ico', icoBuffer);
  console.log('Successfully created multi-resolution favicon.ico (16, 32, 48px) - Size:', icoBuffer.length);
}

run().catch(console.error);
