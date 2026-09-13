/**
 * Cloudflare Pages Deploy Hook Trigger Utility
 * Sends a POST request to Cloudflare to automatically rebuild the public static site
 * so newly published articles/projects and sitemaps are live within ~45s.
 */

const STORAGE_KEY = 'bina_cf_deploy_hook';

export function getStoredDeployHookUrl(): string {
  const envUrl = import.meta.env.VITE_CLOUDFLARE_DEPLOY_HOOK_URL || '';
  const localUrl = localStorage.getItem(STORAGE_KEY) || '';
  return localUrl || envUrl;
}

export function setStoredDeployHookUrl(url: string): void {
  localStorage.setItem(STORAGE_KEY, url.trim());
}

import { deployRateLimiter } from './rate-limiter';

export async function triggerCloudflareDeploy(
  overrideUrl?: string,
  userId?: string
): Promise<{ success: boolean; message: string; timestamp?: string }> {
  const hookUrl = overrideUrl || getStoredDeployHookUrl();

  if (!hookUrl) {
    return {
      success: false,
      message: 'Cloudflare Pages Deploy Hook URL belum dikonfigurasi di Pengaturan.',
    };
  }

  // Rate limiting check
  const userIdentifier = userId || 'anonymous';
  const rateStatus = await deployRateLimiter.isAllowed(`deploy_${userIdentifier}`);
  
  if (!rateStatus.allowed) {
    const resetTime = new Date(rateStatus.blockedUntil!).toLocaleString('id-ID');
    return {
      success: false,
      message: `Terlalu banyak permintaan deploy. Silakan coba lagi setelah ${resetTime}.`,
    };
  }

  try {
    const response = await fetch(hookUrl, {
      method: 'POST',
    });

    if (response.ok) {
      return {
        success: true,
        message: 'Deployment terpicu! Cloudflare sedang mem-build ulang halaman statis dan sitemap (~45 detik).',
        timestamp: new Date().toLocaleTimeString('id-ID'),
      };
    } else {
      const text = await response.text();
      return {
        success: false,
        message: `Gagal memicu deployment (${response.status}): ${text || 'Respons tidak valid dari Cloudflare.'}`,
      };
    }
  } catch (err: any) {
    console.error('Cloudflare hook error:', err);
    return {
      success: false,
      message: `Terjadi kendala jaringan saat menghubungi Cloudflare: ${err?.message || 'Network error'}`,
    };
  }
}
