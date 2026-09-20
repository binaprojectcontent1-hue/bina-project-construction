/**
 * Bina Project Unified Media & Image CDN Helper
 * - In local dev (localhost): Directly serves from jsDelivr CDN for instant 100% reliable rendering.
 * - In production (binaproject.id): Serves via own-domain /media/... Cloudflare Edge Proxy for Google Images SEO.
 */
export function getMediaUrl(path: string): string {
  if (!path) return '';

  const cdnRepo = import.meta.env.PUBLIC_CDN_REPO || 'binaprojectcontent1-hue/bina-media';
  const cdnBranch = import.meta.env.PUBLIC_CDN_BRANCH || 'main';

  // 1. If path is a Supabase public storage URL, normalize to /media/...
  const supabaseStoragePattern = /https?:\/\/[^/]+\/storage\/v1\/object\/public\/media\/(.+)/;
  const match = path.match(supabaseStoragePattern);
  if (match && match[1]) {
    const subpath = match[1];
    if (import.meta.env.DEV) {
      return `https://cdn.jsdelivr.net/gh/${cdnRepo}@${cdnBranch}/${subpath}`;
    }
    return `/media/${subpath}`;
  }

  // 2. If path is own-domain https://binaproject.id/media/... or legacy https://binaproject.com/media/...
  const ownDomainPattern = /^https?:\/\/(?:www\.)?binaproject\.(?:com|id)\/media\/(.+)$/;
  const ownMatch = path.match(ownDomainPattern);
  if (ownMatch && ownMatch[1]) {
    const subpath = ownMatch[1];
    if (import.meta.env.DEV) {
      return `https://cdn.jsdelivr.net/gh/${cdnRepo}@${cdnBranch}/${subpath}`;
    }
    return `/media/${subpath}`;
  }

  // 3. If path is a jsDelivr CDN URL pointing to GitHub media repo, normalize
  const jsdelivrPattern = /^https?:\/\/cdn\.jsdelivr\.net\/gh\/[^/@]+@[^/]+\/(.+)$/;
  const jsdelivrMatch = path.match(jsdelivrPattern);
  if (jsdelivrMatch && jsdelivrMatch[1]) {
    const subpath = jsdelivrMatch[1];
    if (import.meta.env.DEV) {
      return `https://cdn.jsdelivr.net/gh/${cdnRepo}@${cdnBranch}/${subpath}`;
    }
    return `/media/${subpath}`;
  }

  // 4. If it's already an external absolute URL (e.g. Unsplash), return as is
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//') || path.startsWith('data:')) {
    return path;
  }

  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // 3. If path is media/..., handle dev vs prod
  if (cleanPath.startsWith('media/')) {
    const subpath = cleanPath.replace(/^media\//, '');
    // In local development, load directly from jsDelivr CDN so images never 404 on localhost:4321
    if (import.meta.env.DEV) {
      return `https://cdn.jsdelivr.net/gh/${cdnRepo}@${cdnBranch}/${subpath}`;
    }
    // In production, keep own-domain /media/... for Cloudflare Edge Proxy & Google Images SEO
    return `/${cleanPath}`;
  }

  // 4. If path is a local asset (e.g. assets/img/...), return local path
  if (cleanPath.startsWith('assets/')) {
    return `/${cleanPath}`;
  }

  // 5. If it's in portfolio/ or articles/, route through media
  if (cleanPath.startsWith('portfolio/') || cleanPath.startsWith('articles/')) {
    if (import.meta.env.DEV) {
      return `https://cdn.jsdelivr.net/gh/${cdnRepo}@${cdnBranch}/${cleanPath}`;
    }
    return `/media/${cleanPath}`;
  }

  // 6. Fallback to local root-relative path
  return `/${cleanPath}`;
}
