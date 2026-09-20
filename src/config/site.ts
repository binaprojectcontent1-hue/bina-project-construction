/**
 * @file site.ts
 * @description Centralized Single Source of Truth for Bina Project Construction.
 * Contains global business identity, contact channels, and official social links.
 */

import type { SiteConfig } from '@types';
import { MAIN_NAV } from '@data/navigation';

export const siteConfig: SiteConfig = {
  name: 'Bina Project',
  legalName: 'Bina Project Construction & Interior',
  tagline: 'Jasa Konstruksi & Desain Interior Malang',
  description:
    'Jasa konstruksi, renovasi rumah, desain interior & kitchen set di Malang & Jawa Timur. Pengerjaan profesional, bergaransi & gratis survei lokasi.',
  siteUrl: 'https://binaproject.id',

  contact: {
    phoneDisplay: '+62 81 335 335 304',
    phoneTel: 'tel:+6281335335304',
    whatsappNumber: '6281335335304',
    whatsappUrl: 'https://wa.me/6281335335304',
    email: 'binaproject.info@gmail.com',
    address: 'Jl. Watumujur II No.6, Kota Malang',
    city: 'Kota Malang',
    province: 'Jawa Timur',
    postalCode: '65145',
    country: 'ID',
    googleMapsUrl: 'https://maps.app.goo.gl/3E54uS2WDg4EPDgL6',
    googleMapsEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.4746073810625!2d112.60884237591145!3d-7.94980687920362!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7883eadea01223%3A0x3bf7f69bb74761e0!2sBina%20Project%20%7C%20Jasa%20Konstruksi%20dan%20Interior!5e0!3m2!1sid!2sid!4v1737646658910!5m2!1sid!2sid',
    openingHours: 'Senin - Sabtu: 08:00 - 16:00 WIB',
    openingHoursDetail: 'Senin - Sabtu: 08:00 - 16:00 WIB | Minggu / Tanggal Merah: Libur',
  },

  socials: [
    {
      platform: 'Google Business',
      url: 'https://share.google/bF9i03JuwxrcOQo7y',
      icon: 'simple-icons:google',
      label: 'Google Business Profile Resmi Bina Project',
    },    {
      platform: 'Instagram',
      url: 'https://www.instagram.com/binaproject.id',
      icon: 'simple-icons:instagram',
      label: 'Kunjungi Instagram Resmi Bina Project',
    },
    {
      platform: 'WhatsApp',
      url: 'https://wa.me/6281335335304',
      icon: 'simple-icons:whatsapp',
      label: 'Hubungi WhatsApp Resmi Bina Project',
    },
    {
      platform: 'TikTok',
      url: 'https://www.tiktok.com/@binaproject.id',
      icon: 'simple-icons:tiktok',
      label: 'Ikuti TikTok Resmi Bina Project',
    },
    {
      platform: 'YouTube',
      url: 'https://www.youtube.com/@binaproject.id',
      icon: 'simple-icons:youtube',
      label: 'Tonton Kanal YouTube Resmi Bina Project',
    },
  ],

  mainNav: MAIN_NAV,
} as const;

/**
 * Helper function to generate standardized WhatsApp chat URLs with localized default messages.
 */
export function getWhatsAppUrl(
  customMessage?: string,
  lang: 'id' | 'en' = 'id'
): string {
  const num = siteConfig.contact.whatsappNumber;
  if (!customMessage) {
    const defaultMsg =
      lang === 'en'
        ? 'Hello Bina Project Team, I would like to consult on architectural construction & interior design plans.'
        : 'Halo Tim Bina Project, saya ingin konsultasi rencana proyek konstruksi & desain interior.';
    return `https://wa.me/${num}?text=${encodeURIComponent(defaultMsg)}`;
  }
  return `https://wa.me/${num}?text=${encodeURIComponent(customMessage)}`;
}

