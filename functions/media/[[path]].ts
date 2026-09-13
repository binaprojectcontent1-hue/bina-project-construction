interface Env {
  PUBLIC_SUPABASE_URL?: string;
  PUBLIC_CDN_REPO?: string;
  PUBLIC_CDN_BRANCH?: string;
}

export const onRequest = async (context: {
  request: Request;
  params: { path: string | string[] };
  env: Env;
}) => {
  const { request, params, env } = context;
  const subpath = Array.isArray(params.path)
    ? params.path.join('/')
    : ((params.path as string) || '');

  if (!subpath) {
    return new Response('Media path missing', { status: 400 });
  }

  // 1. Try GitHub Media Repo (via jsDelivr & Raw GitHub)
  const ghRepo = env.PUBLIC_CDN_REPO || 'binaprojectcontent1-hue/bina-media';
  const ghBranch = env.PUBLIC_CDN_BRANCH || 'main';

  const urlsToTry: string[] = [];
  if (ghRepo) {
    urlsToTry.push(`https://cdn.jsdelivr.net/gh/${ghRepo}@${ghBranch}/${subpath}`);
    urlsToTry.push(`https://raw.githubusercontent.com/${ghRepo}/${ghBranch}/${subpath}`);
  }

  // 2. Fallback to Supabase Storage if configured
  const supabaseOrigin = (env.PUBLIC_SUPABASE_URL || 'https://jymlsrmilckmphwhsrld.supabase.co').replace(/\/$/, '');
  urlsToTry.push(`${supabaseOrigin}/storage/v1/object/public/media/${subpath}`);

  for (const targetUrl of urlsToTry) {
    try {
      const upstreamRes = await fetch(targetUrl, {
        method: request.method,
        headers: {
          Accept: request.headers.get('Accept') || '*/*',
          'User-Agent': 'Cloudflare-Edge-Media-Proxy',
        },
        // @ts-ignore — Cloudflare Workers-specific cf options (not in standard RequestInit)
        cf: {
          cacheEverything: true,
          cacheTtl: 31536000, // 1 year edge cache
        },
      } as RequestInit);

      if (upstreamRes.ok) {
        const responseHeaders = new Headers(upstreamRes.headers);
        responseHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');
        responseHeaders.set('Access-Control-Allow-Origin', '*');
        responseHeaders.set('X-Robots-Tag', 'all'); // Instruct Googlebot Images to index

        return new Response(upstreamRes.body, {
          status: 200,
          headers: responseHeaders,
        });
      }
    } catch (e) {
      continue;
    }
  }

  return new Response(`Media file not found (${subpath})`, {
    status: 404,
    headers: { 'Cache-Control': 'no-store' },
  });
};
