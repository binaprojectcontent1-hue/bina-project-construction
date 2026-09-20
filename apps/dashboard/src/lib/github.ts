/**
 * GitHub Storage API Service for Bina Project Studio
 * Uploads images directly to a designated media repository (e.g. username/bina-media)
 */

// Crypto utilities for secure token storage
const ENCRYPTION_IV = 'bina-project-123456'; // Fixed IV for consistency

function encryptConfig(config: any): string {
  try {
    const jsonString = JSON.stringify(config);
    
    // Simple XOR-based encryption (for development - upgrade to AES in production)
    const bytes = new TextEncoder().encode(jsonString);
    const encrypted = new Uint8Array(bytes.length);
    
    for (let i = 0; i < bytes.length; i++) {
      encrypted[i] = bytes[i] ^ ENCRYPTION_IV.charCodeAt(i % ENCRYPTION_IV.length);
    }
    
    // Convert to hex string for storage
    return Array.from(encrypted)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  } catch (e) {
    console.error('Encryption failed:', e);
    throw new Error('Gagal mengenkripsi konfigurasi keamanan');
  }
}

function decryptConfig(encryptedHex: string): any {
  try {
    // Convert hex back to bytes
    const bytes = new Uint8Array(encryptedHex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);
    
    if (bytes.length === 0) {
      throw new Error('Data kosong atau tidak valid');
    }
    
    // Decrypt using same XOR method
    const decrypted = new Uint8Array(bytes.length);
    
    for (let i = 0; i < bytes.length; i++) {
      decrypted[i] = bytes[i] ^ ENCRYPTION_IV.charCodeAt(i % ENCRYPTION_IV.length);
    }
    
    // Convert back to string
    const jsonString = new TextDecoder().decode(decrypted);
    return JSON.parse(jsonString);
  } catch (e) {
    console.error('Decryption failed:', e);
    throw new Error('Token tidak valid atau telah kadaluarsa. Silakan configure ulang.');
  }
}

export interface GitHubStorageConfig {
  owner: string;
  repo: string;
  branch: string;
  token: string;
}

const STORAGE_KEY = 'gh_studio_config';

/**
 * Save GitHub configuration securely in localStorage (encrypted)
 */
export function saveGitHubConfig(config: GitHubStorageConfig): void {
  try {
    const encrypted = encryptConfig(config);
    localStorage.setItem(STORAGE_KEY, encrypted);
  } catch (e: any) {
    throw new Error(`Gagal menyimpan konfigurasi: ${e.message}`);
  }
}

/**
 * Load GitHub configuration from localStorage (decrypt)
 */
export function loadGitHubConfig(): GitHubStorageConfig | null {
  try {
    const encrypted = localStorage.getItem(STORAGE_KEY);
    if (encrypted) {
      const decrypted = decryptConfig(encrypted);
      if (decrypted && decrypted.token) {
        return decrypted;
      }
    }
  } catch (e) {
    localStorage.removeItem(STORAGE_KEY);
  }

  // Fallback to environment variables from .env if available
  const owner = import.meta.env.VITE_GITHUB_OWNER;
  const repo = import.meta.env.VITE_GITHUB_REPO;
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  const branch = import.meta.env.VITE_GITHUB_BRANCH || 'main';

  if (owner && repo && token) {
    return { owner, repo, branch, token };
  }

  return null;
}

/**
 * Check if GitHub is configured
 */
export function isGitHubConfigured(): boolean {
  return loadGitHubConfig() !== null;
}

/**
 * Get GitHub config (alias for loadGitHubConfig)
 */
export function getGitHubConfig(): GitHubStorageConfig | null {
  return loadGitHubConfig();
}

/**
 * Set GitHub config (alias for saveGitHubConfig)
 */
export function setGitHubConfig(config: GitHubStorageConfig): void {
  saveGitHubConfig(config);
}

/**
 * Test GitHub configuration (validate credentials)
 */
export async function testGitHubConnection(config: GitHubStorageConfig): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`https://api.github.com/repos/${config.owner}/${config.repo}`, {
      headers: {
        Authorization: `Bearer ${config.token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (response.ok) {
      return { success: true, message: 'Koneksi berhasil! GitHub Storage siap digunakan.' };
    } else {
      const error = await response.json();
      return { success: false, message: error.message || 'Failed to connect' };
    }
  } catch (e: any) {
    return { success: false, message: e.message || 'Network error' };
  }
}

/**
 * Upload image to GitHub repository
 */
export async function uploadToGitHubStorage(
  file: File,
  path: string,
  config: GitHubStorageConfig
): Promise<{ url: string; cdn_url: string; own_domain_url: string; path: string }> {
  try {
    const reader = new FileReader();
    const base64Content = await new Promise<string>((resolve, reject) => {
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    // Resolve target path: ensure clean filename and extension if only directory is provided
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const cleanFileName = file.name
      .replace(/\.[^/.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    const finalPath = path.includes('.')
      ? path
      : `${path.replace(/\/$/, '')}/${Date.now()}-${cleanFileName}.${fileExt}`;

    const apiUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${finalPath}`;

    const checkResponse = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${config.token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    let sha: string | undefined;
    if (checkResponse.ok) {
      const existing = await checkResponse.json();
      sha = existing.sha;
    }

    const uploadResponse = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${config.token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Upload: ${finalPath}`,
        content: base64Content,
        branch: config.branch,
        ...(sha && { sha }),
      }),
    });

    if (!uploadResponse.ok) {
      const error = await uploadResponse.json();
      throw new Error(error.message || 'Upload gagal');
    }

    const result = await uploadResponse.json();
    const cdn_url = `https://cdn.jsdelivr.net/gh/${config.owner}/${config.repo}@${config.branch}/${finalPath}`;
    const own_domain_url = `https://binaproject.id/media/${finalPath}`;

    return {
      url: result.content.html_url,
      cdn_url,
      own_domain_url,
      path: finalPath,
    };
  } catch (e: any) {
    throw new Error(`Upload gagal: ${e.message}`);
  }
}

/**
 * Delete file from GitHub repository
 */
export async function deleteFromGitHub(
  path: string,
  config: GitHubStorageConfig
): Promise<void> {
  try {
    const apiUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${path}`;

    const checkResponse = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${config.token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!checkResponse.ok) {
      throw new Error('File tidak ditemukan');
    }

    const fileData = await checkResponse.json();

    const deleteResponse = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${config.token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Delete: ${path}`,
        sha: fileData.sha,
        branch: config.branch,
      }),
    });

    if (!deleteResponse.ok) {
      const error = await deleteResponse.json();
      throw new Error(error.message || 'Delete gagal');
    }
  } catch (e: any) {
    throw new Error(`Delete gagal: ${e.message}`);
  }
}
