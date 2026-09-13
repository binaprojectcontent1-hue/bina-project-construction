import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

export interface OgImageOptions {
  title: string;
  category?: string;
  metaInfo?: string;
  coverImageUrl?: string;
  type?: 'blog' | 'portfolio';
}

/**
 * Helper to escape XML special characters
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Word wrap helper for SVG text
 */
function wrapText(text: string, maxCharsPerLine: number = 24, maxLines: number = 3): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + (currentLine ? ' ' : '') + word).length <= maxCharsPerLine) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
      if (lines.length >= maxLines - 1) {
        break;
      }
    }
  }

  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine);
  }

  // If there were more words, append ellipsis to last line
  const totalLength = lines.join(' ').length;
  if (totalLength < text.length && lines.length > 0) {
    lines[lines.length - 1] = lines[lines.length - 1].replace(/[.,;:!?\s]+$/, '') + '...';
  }

  return lines;
}

/**
 * Creates SVG Left Panel Overlay (640 × 630 px)
 */
function createLeftPanelSvg(options: OgImageOptions): Buffer {
  const category = escapeXml(
    options.category?.toUpperCase() ||
      (options.type === 'portfolio' ? 'PROYEK ARSITEKTUR' : 'TIPS & EDUKASI')
  );
  const metaInfo = escapeXml(
    options.metaInfo || (options.type === 'portfolio' ? 'Bina Project' : '3 Menit Baca')
  );
  const titleLines = wrapText(options.title || 'Bina Project Construction & Interior', 24, 3);

  const titleSvgSpans = titleLines
    .map((line, idx) => `<tspan x="70" dy="${idx === 0 ? 0 : 54}">${escapeXml(line)}</tspan>`)
    .join('');

  const svg = `
  <svg width="640" height="630" viewBox="0 0 640 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="navyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1E3A5F" />
        <stop offset="100%" stop-color="#0E1E38" />
      </linearGradient>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#F68A0A" />
        <stop offset="100%" stop-color="#FFA439" />
      </linearGradient>
    </defs>

    <!-- Background -->
    <rect width="640" height="630" fill="url(#navyGrad)" />

    <!-- Subtle Architectural Grid on Left Panel -->
    <g opacity="0.06" stroke="#FFFFFF" stroke-width="1">
      <line x1="70" y1="0" x2="70" y2="630" />
      <line x1="200" y1="0" x2="200" y2="630" />
      <line x1="330" y1="0" x2="330" y2="630" />
      <line x1="460" y1="0" x2="460" y2="630" />
      <line x1="0" y1="120" x2="640" y2="120" />
      <line x1="0" y1="240" x2="640" y2="240" />
      <line x1="0" y1="360" x2="640" y2="360" />
      <line x1="0" y1="480" x2="640" y2="480" />
    </g>

    <!-- Logo & Brand Header -->
    <g transform="translate(70, 65)">
      <!-- Bina Project Monogram Icon -->
      <rect width="36" height="36" rx="8" fill="url(#goldGrad)" />
      <path d="M10 26V10L18 15V26H10Z" fill="#1E3A5F" />
      <path d="M18 15L26 20V26H18V15Z" fill="#0E1E38" opacity="0.7" />
      <text x="48" y="25" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="800" fill="#FFFFFF" letter-spacing="1">BINA PROJECT</text>
    </g>

    <!-- Category Badge -->
    <g transform="translate(70, 145)">
      <rect width="${Math.max(120, category.length * 9 + 32)}" height="32" rx="16" fill="#F68A0A" fill-opacity="0.16" stroke="#F68A0A" stroke-width="1" />
      <text x="16" y="21" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#F68A0A" letter-spacing="1.5">${category}</text>
    </g>

    <!-- Article / Project Title -->
    <text x="70" y="240" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="40" font-weight="800" fill="#FFFFFF">
      ${titleSvgSpans}
    </text>

    <!-- Meta Info (Reading Time or City Location) -->
    <g transform="translate(70, 475)">
      <circle cx="8" cy="8" r="4" fill="#F68A0A" />
      <text x="24" y="12" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="500" fill="#94A3B8">${metaInfo}</text>
    </g>

    <!-- Footer Watermark & Domain Badge -->
    <g transform="translate(70, 545)">
      <text font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#F68A0A" letter-spacing="0.5">binaproject.com</text>
      <text x="135" y="0" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="400" fill="#64748B">• Jasa Konstruksi &amp; Interior Terpercaya</text>
    </g>

    <!-- Right Side Divider Glow -->
    <line x1="639" y1="0" x2="639" y2="630" stroke="#F68A0A" stroke-opacity="0.3" stroke-width="2" />
  </svg>
  `;

  return Buffer.from(svg);
}

/**
 * Creates Blueprint Architectural Illustration Fallback (560 × 630 px)
 */
function createBlueprintFallbackSvg(): Buffer {
  const svg = `
  <svg width="560" height="630" viewBox="0 0 560 630" xmlns="http://www.w3.org/2000/svg">
    <rect width="560" height="630" fill="#132644" />
    <!-- Architectural Blueprint Grid -->
    <g stroke="#1E3A5F" stroke-width="1" opacity="0.6">
      ${Array.from({ length: 15 }, (_, i) => `<line x1="0" y1="${i * 45}" x2="560" y2="${i * 45}" />`).join('')}
      ${Array.from({ length: 13 }, (_, i) => `<line x1="${i * 45}" y1="0" x2="${i * 45}" y2="630" />`).join('')}
    </g>
    <!-- Isometric 3D Architectural Wireframe -->
    <g transform="translate(140, 180)" stroke="#F68A0A" stroke-width="2" fill="none" opacity="0.75">
      <polygon points="140,0 280,70 140,140 0,70" stroke="#FFFFFF" fill="#1E3A5F" fill-opacity="0.4" />
      <polygon points="0,70 140,140 140,280 0,210" stroke="#F68A0A" fill="#0E1E38" fill-opacity="0.6" />
      <polygon points="280,70 140,140 140,280 280,210" stroke="#FFFFFF" fill="#162D4D" fill-opacity="0.6" />
      <!-- Interior Elements Wireframe -->
      <line x1="50" y1="95" x2="50" y2="235" stroke="#F68A0A" stroke-dasharray="4,4" />
      <line x1="90" y1="115" x2="90" y2="255" stroke="#F68A0A" stroke-dasharray="4,4" />
      <line x1="230" y1="95" x2="230" y2="235" stroke="#94A3B8" stroke-dasharray="4,4" />
    </g>
    <text x="280" y="520" text-anchor="middle" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="600" fill="#64748B" letter-spacing="2">ARCHITECTURAL BLUEPRINT</text>
  </svg>
  `;
  return Buffer.from(svg);
}

/**
 * Loads and resizes right cover image to 560 × 630 px
 */
async function loadCoverBuffer(coverImageUrl?: string): Promise<Buffer> {
  if (!coverImageUrl) {
    return sharp(createBlueprintFallbackSvg()).png().toBuffer();
  }

  try {
    let sourceBuffer: Buffer | null = null;

    if (coverImageUrl.startsWith('http://') || coverImageUrl.startsWith('https://')) {
      const res = await fetch(coverImageUrl);
      if (res.ok) {
        const arrayBuf = await res.arrayBuffer();
        sourceBuffer = Buffer.from(arrayBuf);
      }
    } else {
      // Local or relative path resolution
      const cleanPath = coverImageUrl.startsWith('/') ? coverImageUrl.slice(1) : coverImageUrl;
      const localDirectPath = path.resolve(cleanPath);
      const publicPath = path.resolve('public', cleanPath);

      if (fs.existsSync(localDirectPath)) {
        sourceBuffer = fs.readFileSync(localDirectPath);
      } else if (fs.existsSync(publicPath)) {
        sourceBuffer = fs.readFileSync(publicPath);
      } else {
        // Fallback to jsDelivr CDN
        const cdnUrl = `https://cdn.jsdelivr.net/gh/binaprojectcontent1-hue/bina-media@main/${cleanPath.replace(/^media\//, '')}`;
        const cdnRes = await fetch(cdnUrl);
        if (cdnRes.ok) {
          sourceBuffer = Buffer.from(await cdnRes.arrayBuffer());
        }
      }
    }

    if (sourceBuffer) {
      return await sharp(sourceBuffer)
        .resize(560, 630, { fit: 'cover', position: 'center' })
        .png()
        .toBuffer();
    }
  } catch (err) {
    console.warn(`[ogGenerator] Failed to load cover image "${coverImageUrl}", using blueprint fallback:`, err);
  }

  return sharp(createBlueprintFallbackSvg()).png().toBuffer();
}

/**
 * Main Generator: Produces a 1200 × 630 px PNG buffer
 */
export async function generateOgImage(options: OgImageOptions): Promise<Buffer> {
  const leftOverlay = createLeftPanelSvg(options);
  const rightCover = await loadCoverBuffer(options.coverImageUrl);

  // Composite 1200 × 630 image:
  // Base 1200 × 630 canvas with Navy background
  const baseCanvas = sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: { r: 14, g: 30, b: 56, alpha: 1 },
    },
  });

  return await baseCanvas
    .composite([
      { input: rightCover, left: 640, top: 0 },
      { input: leftOverlay, left: 0, top: 0 },
    ])
    .png({ quality: 85, compressionLevel: 9 })
    .toBuffer();
}
