import { supabase } from './supabase';
import { AnnouncementSettings, DEFAULT_ANNOUNCEMENT_SETTINGS } from '../types/announcement';

const ANNOUNCEMENT_FIELDS = [
  'is_announcement_active',
  'announcement_badge',
  'announcement_title',
  'announcement_description',
  'announcement_image_url',
  'announcement_cta_label',
  'announcement_cta_url',
].join(',');

export async function fetchAnnouncement(): Promise<AnnouncementSettings> {
  if (!supabase) {
    return DEFAULT_ANNOUNCEMENT_SETTINGS;
  }

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select(ANNOUNCEMENT_FIELDS)
      .eq('id', 'general')
      .single();

    if (error || !data) {
      console.warn('[announcementService] Fallback to defaults:', error?.message);
      return DEFAULT_ANNOUNCEMENT_SETTINGS;
    }

    return {
      ...DEFAULT_ANNOUNCEMENT_SETTINGS,
      ...(data as Partial<AnnouncementSettings>),
    };
  } catch (err) {
    console.error('[announcementService] Failed to fetch announcement:', err);
    return DEFAULT_ANNOUNCEMENT_SETTINGS;
  }
}

export async function saveAnnouncement(
  settings: Partial<AnnouncementSettings>
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
      console.error('[announcementService] Error saving announcement:', error);
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Pengaturan pengumuman popup berhasil disimpan.' };
  } catch (err: any) {
    console.error('[announcementService] Exception saving announcement:', err);
    return { success: false, message: err?.message || 'Terjadi kesalahan sistem saat menyimpan.' };
  }
}
