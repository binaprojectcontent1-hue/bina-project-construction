export interface SiteSettings {
  id: string;
  phone_display: string;
  phone_tel: string;
  whatsapp_number: string;
  whatsapp_url: string;
  whatsapp_default_message: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  google_maps_url: string;
  google_maps_embed_url: string;
  opening_hours: string;
  opening_hours_detail: string;
  instagram_url: string;
  tiktok_url: string;
  youtube_url: string;
  google_business_url: string;
  updated_at?: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: 'general',
  phone_display: '+62 81-335-335-304',
  phone_tel: 'tel:+6281335335304',
  whatsapp_number: '6281335335304',
  whatsapp_url: 'https://wa.me/6281335335304',
  whatsapp_default_message: 'Halo Bina Project, saya ingin konsultasi rencana proyek konstruksi/interior dan estimasi RAB gratis.',
  email: 'binaproject.info@gmail.com',
  address: 'Jl. Watumujur II No.6, Kota Malang',
  city: 'Kota Malang',
  province: 'Jawa Timur',
  postal_code: '65145',
  google_maps_url: 'https://maps.app.goo.gl/3E54uS2WDg4EPDgL6',
  google_maps_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.4746073810625!2d112.60884237591145!3d-7.94980687920362!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7883eadea01223%3A0x3bf7f69bb74761e0!2sBina%20Project%20%7C%20Jasa%20Konstruksi%20dan%20Interior!5e0!3m2!1sid!2sid!4v1737646658910!5m2!1sid!2sid',
  opening_hours: 'Senin - Sabtu: 08:00 - 16:00 WIB',
  opening_hours_detail: 'Senin - Sabtu: 08:00 - 16:00 WIB | Minggu / Libur: Khusus Janji Temu',
  instagram_url: 'https://www.instagram.com/binaproject.id',
  tiktok_url: 'https://www.tiktok.com/@binaproject.id',
  youtube_url: 'https://www.youtube.com/@binaproject.id',
  google_business_url: 'https://share.google/bF9i03JuwxrcOQo7y',
};
