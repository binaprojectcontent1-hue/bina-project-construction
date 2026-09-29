export interface AnnouncementSettings {
  is_announcement_active: boolean;
  announcement_badge: string;
  announcement_title: string;
  announcement_description: string;
  announcement_image_url: string;
  announcement_cta_label: string;
  announcement_cta_url: string;
}

export const DEFAULT_ANNOUNCEMENT_SETTINGS: AnnouncementSettings = {
  is_announcement_active: false,
  announcement_badge: '',
  announcement_title: '',
  announcement_description: '',
  announcement_image_url: '',
  announcement_cta_label: '',
  announcement_cta_url: '',
};
