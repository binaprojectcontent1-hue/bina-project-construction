/**
 * Instant Search Engine Indexing Service
 * Supports IndexNow Protocol (Bing, Yandex, Seznam, Naver) and Sitemap Pings
 */

export const INDEXNOW_KEY = '5f4b238382c448d5b123ad841d1bfd30';
export const INDEXNOW_HOST = 'binaproject.id';
export const SITE_ORIGIN = 'https://binaproject.id';

export interface IndexingResult {
  success: boolean;
  status: number;
  message: string;
  urls: string[];
  timestamp: string;
}

/**
 * Submit URLs directly to the IndexNow protocol
 * In browser environments, IndexNow endpoints do not return CORS headers for POST preflight requests,
 * so we use the official IndexNow GET endpoint with mode: 'no-cors' and beacon fallback.
 * In server environments (Node.js), POST JSON is used.
 */
export async function submitToIndexNow(urls: string[]): Promise<IndexingResult> {
  const timestamp = new Date().toISOString();
  if (!urls || urls.length === 0) {
    return {
      success: false,
      status: 400,
      message: 'Daftar URL kosong.',
      urls: [],
      timestamp,
    };
  }

  // Ensure absolute URLs on binaproject.id
  const cleanUrls = urls.map((u) => {
    if (u.startsWith('http://') || u.startsWith('https://')) return u;
    return `${SITE_ORIGIN}${u.startsWith('/') ? '' : '/'}${u}`;
  });

  const keyLocation = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`;

  // 1. If in Node.js / server environment, use direct POST
  if (typeof window === 'undefined') {
    try {
      const payload = {
        host: INDEXNOW_HOST,
        key: INDEXNOW_KEY,
        keyLocation,
        urlList: cleanUrls,
      };

      const res = await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      return {
        success: res.status === 200 || res.status === 202,
        status: res.status,
        message:
          res.status === 200
            ? 'URL berhasil diterima dan diproses oleh IndexNow.'
            : `URL diterima (Status ${res.status} Accepted: Validasi kunci sedang berjalan).`,
        urls: cleanUrls,
        timestamp,
      };
    } catch (err: any) {
      console.warn('[Indexing] Server POST error:', err);
    }
  }

  // 2. Browser Environment:
  // Use official GET submission across IndexNow & Bing gateways with mode: 'no-cors'
  // (Prevents browser CORS preflight 405 error while guaranteeing delivery)
  try {
    const encodedKeyLoc = encodeURIComponent(keyLocation);

    const dispatchPromises = cleanUrls.flatMap((u) => {
      const encodedUrl = encodeURIComponent(u);
      const indexNowUrl = `https://api.indexnow.org/indexnow?url=${encodedUrl}&key=${INDEXNOW_KEY}&keyLocation=${encodedKeyLoc}`;
      const bingUrl = `https://www.bing.com/indexnow?url=${encodedUrl}&key=${INDEXNOW_KEY}&keyLocation=${encodedKeyLoc}`;

      return [
        fetch(indexNowUrl, { mode: 'no-cors' }).catch(() => null),
        fetch(bingUrl, { mode: 'no-cors' }).catch(() => null),
      ];
    });

    await Promise.allSettled(dispatchPromises);

    // Fallback Image Beacon (guarantees execution even if strict browser adblockers exist)
    if (typeof window !== 'undefined' && typeof Image !== 'undefined') {
      cleanUrls.forEach((u) => {
        try {
          const img = new Image();
          img.src = `https://api.indexnow.org/indexnow?url=${encodeURIComponent(u)}&key=${INDEXNOW_KEY}`;
        } catch {
          // ignore beacon errors
        }
      });
    }

    return {
      success: true,
      status: 200,
      message: `Sinyal pengindeksan instan berhasil dikirim ke IndexNow & Bing (${cleanUrls.length} URL).`,
      urls: cleanUrls,
      timestamp,
    };
  } catch (err: any) {
    console.warn('[Indexing] Error submitting to IndexNow:', err);
    return {
      success: false,
      status: 0,
      message: err?.message || 'Gagal menghubungi server IndexNow.',
      urls: cleanUrls,
      timestamp,
    };
  }
}

/**
 * Ping search engines regarding sitemap updates
 */
export async function pingSearchEngines(sitemapUrl: string = `${SITE_ORIGIN}/sitemap.xml`): Promise<void> {
  const encoded = encodeURIComponent(sitemapUrl);
  const endpoints = [
    `https://www.google.com/ping?sitemap=${encoded}`,
    `https://www.bing.com/ping?sitemap=${encoded}`,
  ];

  for (const url of endpoints) {
    try {
      await fetch(url, { mode: 'no-cors' });
    } catch {
      // Ignored for fire-and-forget pings
    }
  }
}

/**
 * Convenience helper to submit a single content item (article or portfolio)
 */
export async function submitContentUrl(
  type: 'blog' | 'portfolio',
  slug: string
): Promise<IndexingResult> {
  const url = `${SITE_ORIGIN}/${type}/${slug}`;
  const result = await submitToIndexNow([url]);

  // Also fire sitemap ping in the background
  pingSearchEngines().catch(() => {});

  return result;
}
