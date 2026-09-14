import { supabase } from './supabase';
import { SiteSettings, DEFAULT_SITE_SETTINGS } from '../types/settings';

export async function fetchSiteSettings(): Promise<SiteSettings> {
  if (!supabase) {
    return DEFAULT_SITE_SETTINGS;
  }

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 'general')
      .single();

    if (error || !data) {
      console.warn('[settingsService] Fallback to default site settings:', error?.message);
      return DEFAULT_SITE_SETTINGS;
    }

    return {
      ...DEFAULT_SITE_SETTINGS,
      ...data,
    };
  } catch (err) {
    console.error('[settingsService] Failed to fetch settings:', err);
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function saveSiteSettings(
  settings: Partial<SiteSettings>
): Promise<{ success: boolean; message?: string }> {
  if (!supabase) {
    return { success: false, message: 'Koneksi Supabase belum terkonfigurasi.' };
  }

  try {
    const payload = {
      ...settings,
      id: 'general',
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('site_settings')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.error('[settingsService] Error saving settings:', error);
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Pengaturan profil & kontak berhasil disimpan.' };
  } catch (err: any) {
    console.error('[settingsService] Exception saving settings:', err);
    return { success: false, message: err?.message || 'Terjadi kesalahan sistem saat menyimpan.' };
  }
}
