/**
 * Instant Search Engine Indexing Service
 * Supports IndexNow Protocol (Bing, Yandex, Seznam, Naver) and Sitemap Pings
 */

export const INDEXNOW_KEY = '5f4b238382c448d5b123ad841d1bfd30';
export const INDEXNOW_HOST = 'binaproject.com';
export const SITE_ORIGIN = 'https://binaproject.com';

export interface IndexingResult {
  success: boolean;
  status: number;
  message: string;
  urls: string[];
  timestamp: string;
}

/**
 * Submit URLs directly to the IndexNow protocol
 * IndexNow distributes submissions across Microsoft Bing, Yandex, and other search engines
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

  // Ensure absolute URLs on binaproject.com
  const cleanUrls = urls.map((u) => {
    if (u.startsWith('http://') || u.startsWith('https://')) return u;
    return `${SITE_ORIGIN}${u.startsWith('/') ? '' : '/'}${u}`;
  });

  try {
    const payload = {
      host: INDEXNOW_HOST,
      key: INDEXNOW_KEY,
      keyLocation: `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`,
      urlList: cleanUrls,
    };

    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    // 200 = OK, 202 = Accepted (Key verification pending)
    if (res.status === 200 || res.status === 202) {
      return {
        success: true,
        status: res.status,
        message:
          res.status === 200
            ? 'URL berhasil diterima dan diproses oleh IndexNow.'
            : 'URL berhasil diterima (Status 202 Accepted: Validasi kunci sedang berjalan).',
        urls: cleanUrls,
        timestamp,
      };
    }

    const text = await res.text().catch(() => '');
    return {
      success: false,
      status: res.status,
      message: `IndexNow merespons dengan status HTTP ${res.status}: ${text || 'Gagal mengirim URL'}`,
      urls: cleanUrls,
      timestamp,
    };
  } catch (err: any) {
    console.warn('[Indexing] Error submitting to IndexNow:', err);
    return {
      success: false,
      status: 0,
      message: err?.message || 'Gagal menghubungi server IndexNow (kemungkinan masalah koneksi).',
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
