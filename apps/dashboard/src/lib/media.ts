import { getGitHubConfig } from './github';

/**
 * Resolves a stored media URL (such as /media/portfolio/...) into a loadable URL
 * for the admin dashboard.
 */
export function resolveDashboardMediaUrl(url: string | undefined | null): string {
  if (!url) return '';

  // If it's a data URL or blob URL, return directly
  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }

  const gh = getGitHubConfig();
  const owner = gh?.owner || 'binaprojectcontent1-hue';
  const repo = gh?.repo || 'bina-media';
  const branch = gh?.branch || 'main';

  // If it's the own-domain production URL (https://binaproject.com/media/...)
  const ownDomainMatch = url.match(/^https?:\/\/(?:www\.)?binaproject\.com\/media\/(.+)$/);
  if (ownDomainMatch && ownDomainMatch[1]) {
    const subpath = ownDomainMatch[1];
    return `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/${subpath}`;
  }

  // If already absolute external URL (e.g. unsplash, direct cdn, etc.)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // If it's a /media/... or media/... path, resolve to jsDelivr CDN
  if (url.startsWith('/media/') || url.startsWith('media/')) {
    const subpath = url.replace(/^\/?media\//, '');
    return `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/${subpath}`;
  }

  // Fallback to local root-relative path
  return url.startsWith('/') ? url : `/${url}`;
}
