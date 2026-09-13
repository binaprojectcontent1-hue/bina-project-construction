/**
 * Editorial Article Formatter & Typographic Beautifier for Dashboard
 * Converts plain text / drafts / pasted content into clean, semantic HTML
 * with paragraphs, headings, bullet lists, bold text, and blockquotes.
 */

/**
 * Strips dangerous tags and attributes to prevent XSS attacks.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  return html
    // Remove <script> tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove on* event handlers (onclick, onerror, onload, etc.)
    .replace(/\s+on\w+\s*=\s*(["']).*?\1/gi, '')
    .replace(/\s+on\w+\s*=\s*[^\s>]+/gi, '')
    // Remove javascript: protocol URLs
    .replace(/href\s*=\s*(["'])\s*javascript:.*?\1/gi, 'href="#"')
    .replace(/src\s*=\s*(["'])\s*javascript:.*?\1/gi, 'src=""')
    // Remove <iframe>, <object>, <embed>, <form>, <base>, <meta>, <link> tags
    .replace(/<\/?(?:iframe|object|embed|form|base|meta|link)\b[^>]*>/gi, '')
    // Remove style attributes containing expression() or url() with javascript:
    .replace(/style\s*=\s*(["'])[^"']*expression\s*\([^"']*\1/gi, '')
    .replace(/style\s*=\s*(["'])[^"']*javascript:[^"']*\1/gi, '');
}

export function formatInlineTypography(text: string): string {
  return text
    // Markdown bold: **text**
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Markdown italic: *text* or _text_
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>')
    .replace(/(?<!_)_([^_]+)_(?!_)/g, '<em>$1</em>')
    // Highlight "Trik pertama:", "Trik kedua:", etc. as strong
    .replace(/\b(Trik (?:pertama|kedua|ketiga|keempat|kelima|keenam|ketujuh|terakhir)[^:]*:)/gi, '<strong>$1</strong>');
}

export function formatPlainTextToHtml(raw: string): string {
  if (!raw) return '';

  const rawBlocks = raw.split(/\r?\n\s*\r?\n/);
  const formattedBlocks: string[] = [];

  for (let block of rawBlocks) {
    block = block.trim();
    if (!block) continue;

    // 1. Markdown Heading
    const mdHeading = block.match(/^(#{1,6})\s+(.+)$/);
    if (mdHeading) {
      const level = Math.min(mdHeading[1].length + 1, 4);
      formattedBlocks.push(`<h${level}>${formatInlineTypography(mdHeading[2])}</h${level}>`);
      continue;
    }

    // 2. Numbered Section Heading: e.g. "1. Sesuaikan dengan Tinggi Badan"
    const numHeading = block.match(/^(\d+)[\.\)]\s+([A-Z\xC0-\u024F][^\n.!?]{2,80})$/);
    if (numHeading) {
      formattedBlocks.push(`<h2>${formatInlineTypography(block)}</h2>`);
      continue;
    }

    // 3. Reference or Quote Block: e.g. "Referensi: TikTok @upproject"
    if (/^Referensi:\s*/i.test(block)) {
      formattedBlocks.push(
        `<blockquote class="article-reference"><p><strong>Referensi:</strong> ${formatInlineTypography(block.replace(/^Referensi:\s*/i, ''))}</p></blockquote>`
      );
      continue;
    }

    // 4. Multi-line block inspection (List items, sub-points)
    const lines = block.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

    // Check if the first line is a heading and the rest is body text in the same block
    const firstLineHeading = lines[0].match(/^(\d+)[\.\)]\s+([A-Z\xC0-\u024F][^\n.!?]{2,80})$/);
    if (firstLineHeading && lines.length > 1) {
      formattedBlocks.push(`<h2>${formatInlineTypography(lines[0])}</h2>`);
      lines.shift();
    }

    // Check if lines form an explicit or semantic list
    const isExplicitList = lines.every(l => /^[-*•\d+\.]\s+/.test(l));
    const isItemList = lines.length > 1 && lines.some(l =>
      /^(Jika\s|Rak\s|Ruang\s|Penyimpanan\s|Pilihlah\s|Gunakan\s|Tambahkan\s|Pertimbangkan\s|Ketinggian\s)/i.test(l)
    );

    if (isExplicitList || isItemList) {
      const listItems: string[] = [];
      const normalParas: string[] = [];

      for (const line of lines) {
        const bulletMatch = line.match(/^[-*•]\s+(.+)$/);
        const numberedMatch = line.match(/^(\d+)[\.\)]\s+(.+)$/);
        const itemLineMatch = line.match(/^((?:Jika[^:]+|Pertimbangkan[^:]+|Rak[^:]*|Ruang[^:]*|Penyimpanan[^:]*|Pilihlah[^:]*|Gunakan[^:]*|Tambahkan[^:]*|Ketinggian[^:]*):?)\s*(.*)$/i);

        if (bulletMatch) {
          listItems.push(`  <li>${formatInlineTypography(bulletMatch[1])}</li>`);
        } else if (numberedMatch && !isExplicitList && !itemLineMatch) {
          listItems.push(`  <li>${formatInlineTypography(numberedMatch[2])}</li>`);
        } else if (isItemList && (bulletMatch || itemLineMatch)) {
          if (itemLineMatch && itemLineMatch[2]) {
            const prefix = itemLineMatch[1].endsWith(':') ? itemLineMatch[1] : `${itemLineMatch[1]}:`;
            listItems.push(`  <li><strong>${prefix}</strong> ${formatInlineTypography(itemLineMatch[2])}</li>`);
          } else {
            listItems.push(`  <li>${formatInlineTypography(line)}</li>`);
          }
        } else {
          // Concluding sentence inside the list block
          if (listItems.length > 0) {
            formattedBlocks.push(`<ul>\n${listItems.join('\n')}\n</ul>`);
            listItems.length = 0;
          }
          normalParas.push(`<p>${formatInlineTypography(line)}</p>`);
        }
      }

      if (listItems.length > 0) {
        formattedBlocks.push(`<ul>\n${listItems.join('\n')}\n</ul>`);
      }
      if (normalParas.length > 0) {
        formattedBlocks.push(normalParas.join('\n\n'));
      }
      continue;
    }

    // 5. Normal Paragraph
    const pText = lines.join(' ');
    formattedBlocks.push(`<p>${formatInlineTypography(pText)}</p>`);
  }

  return formattedBlocks.join('\n\n');
}

export function formatArticleContent(raw: string): string {
  if (!raw) return '';
  const hasHtmlBlocks = /<\/?(?:p|div|h[1-6]|ul|ol|li|blockquote|table|section|article)\b/i.test(raw);
  if (hasHtmlBlocks) {
    return raw;
  }
  return formatPlainTextToHtml(raw);
}

export function formatAndSanitizeArticleContent(raw: string): string {
  const formatted = formatArticleContent(raw);
  return sanitizeHtml(formatted);
}

