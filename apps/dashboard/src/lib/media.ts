import { getGitHubConfig } from './github';

/**
 * Resolves a stored media URL (such as /media/portfolio/...) into a loadable URL
 * for the admin dashboard.
 */
export function resolveDashboardMediaUrl(url: string | undefined | null): string {
  if (!url) return '';

  // If already absolute (http:// or https://), return directly
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }

  // If it's a /media/... or media/... path, resolve to jsDelivr CDN
  if (url.startsWith('/media/') || url.startsWith('media/')) {
    const subpath = url.replace(/^\/?media\//, '');
    const gh = getGitHubConfig();
    const owner = gh?.owner || 'binaprojectcontent1-hue';
    const repo = gh?.repo || 'bina-media';
    const branch = gh?.branch || 'main';
    return `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/${subpath}`;
  }

  // Fallback to local root-relative path
  return url.startsWith('/') ? url : `/${url}`;
}
