/**
 * Resolves a stored media URL (such as /media/portfolio/...) into a loadable URL
 * for the admin dashboard using the official domain binaproject.id.
 */
export function resolveDashboardMediaUrl(url: string | undefined | null): string {
  if (!url) return '';

  // If it's a data URL or blob URL, return directly
  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }

  // If path is a legacy jsDelivr CDN URL, convert to official binaproject.id domain
  const jsdelivrPattern = /^https?:\/\/cdn\.jsdelivr\.net\/gh\/[^/@]+@[^/]+\/(.+)$/;
  const jsdelivrMatch = url.match(jsdelivrPattern);
  if (jsdelivrMatch && jsdelivrMatch[1]) {
    const subpath = jsdelivrMatch[1];
    return `https://binaproject.id/media/${subpath}`;
  }

  // If it's the own-domain production URL (https://binaproject.id/media/... or legacy https://binaproject.com/media/...)
  const ownDomainMatch = url.match(/^https?:\/\/(?:www\.)?binaproject\.(?:com|id)\/media\/(.+)$/);
  if (ownDomainMatch && ownDomainMatch[1]) {
    const subpath = ownDomainMatch[1];
    return `https://binaproject.id/media/${subpath}`;
  }

  // If already absolute external URL (e.g. unsplash)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // If it's a /media/... or media/... path, resolve to official domain
  if (url.startsWith('/media/') || url.startsWith('media/')) {
    const subpath = url.replace(/^\/?media\//, '');
    return `https://binaproject.id/media/${subpath}`;
  }

  // Fallback to local root-relative path
  return url.startsWith('/') ? url : `/${url}`;
}

