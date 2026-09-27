/**
 * Bina Project Unified Media & Image CDN Helper
 * - Serves media exclusively via official domain /media/... (https://binaproject.id/media/...)
 * - Automatically normalizes legacy jsDelivr CDN URLs to the official domain
 */
export function getMediaUrl(path: string): string {
  if (!path) return '';

  // 1. If path is a Supabase public storage URL, normalize to /media/...
  const supabaseStoragePattern = /https?:\/\/[^/]+\/storage\/v1\/object\/public\/media\/(.+)/;
  const match = path.match(supabaseStoragePattern);
  if (match && match[1]) {
    return `/media/${match[1]}`;
  }

  // 2. If path is own-domain https://binaproject.id/media/... or legacy https://binaproject.com/media/...
  const ownDomainPattern = /^https?:\/\/(?:www\.)?binaproject\.(?:com|id)\/media\/(.+)$/;
  const ownMatch = path.match(ownDomainPattern);
  if (ownMatch && ownMatch[1]) {
    return `/media/${ownMatch[1]}`;
  }

  // 3. If path is a legacy jsDelivr CDN URL pointing to GitHub media repo, normalize to /media/...
  const jsdelivrPattern = /^https?:\/\/cdn\.jsdelivr\.net\/gh\/[^/@]+@[^/]+\/(.+)$/;
  const jsdelivrMatch = path.match(jsdelivrPattern);
  if (jsdelivrMatch && jsdelivrMatch[1]) {
    return `/media/${jsdelivrMatch[1]}`;
  }

  // 4. If it's already an external absolute URL (e.g. Unsplash), return as is
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//') || path.startsWith('data:')) {
    return path;
  }

  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // 5. If path is media/..., return /media/...
  if (cleanPath.startsWith('media/')) {
    return `/${cleanPath}`;
  }

  // 6. If path is a local asset (e.g. assets/img/...), return local path
  if (cleanPath.startsWith('assets/')) {
    return `/${cleanPath}`;
  }

  // 7. If it's in portfolio/ or articles/, route through /media/...
  if (cleanPath.startsWith('portfolio/') || cleanPath.startsWith('articles/')) {
    return `/media/${cleanPath}`;
  }

  // 8. Fallback to local root-relative path
  return `/${cleanPath}`;
}

