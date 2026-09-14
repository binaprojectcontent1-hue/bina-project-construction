/**
 * @file siteSettingsService.ts
 * @description Dynamic Site Settings Service for Astro.
 * Loads business identity, contact channels, and social links from Supabase
 * with a 100% resilient fallback to static siteConfig.
 */

import { supabase, isSupabaseConfigured } from './supabase';
import { siteConfig as staticSiteConfig } from '@config/site';
import type { SiteConfig, ContactInfo, SocialLink } from '@types';

let cachedSiteConfig: SiteConfig | null = null;

export async function getSiteSettings(): Promise<SiteConfig> {
  if (cachedSiteConfig) {
    return cachedSiteConfig;
  }

  if (!isSupabaseConfigured || !supabase) {
    return staticSiteConfig;
  }

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 'general')
      .single();

    if (error || !data) {
      // Fallback seamlessly to static configuration
      return staticSiteConfig;
    }

    const mergedContact: ContactInfo = {
      phoneDisplay: data.phone_display || staticSiteConfig.contact.phoneDisplay,
      phoneTel: data.phone_tel || staticSiteConfig.contact.phoneTel,
      whatsappNumber: data.whatsapp_number || staticSiteConfig.contact.whatsappNumber,
      whatsappUrl: data.whatsapp_url || staticSiteConfig.contact.whatsappUrl,
      email: data.email || staticSiteConfig.contact.email,
      address: data.address || staticSiteConfig.contact.address,
      city: data.city || staticSiteConfig.contact.city,
      province: data.province || staticSiteConfig.contact.province,
      postalCode: data.postal_code || staticSiteConfig.contact.postalCode,
      country: staticSiteConfig.contact.country,
      googleMapsUrl: data.google_maps_url || staticSiteConfig.contact.googleMapsUrl,
      googleMapsEmbedUrl: data.google_maps_embed_url || staticSiteConfig.contact.googleMapsEmbedUrl,
      openingHours: data.opening_hours || staticSiteConfig.contact.openingHours,
      openingHoursDetail: data.opening_hours_detail || staticSiteConfig.contact.openingHoursDetail,
    };

    const mergedSocials: SocialLink[] = [
      {
        platform: 'Google Business',
        url: data.google_business_url || 'https://share.google/bF9i03JuwxrcOQo7y',
        icon: 'simple-icons:google',
        label: 'Google Business Profile Resmi Bina Project',
      },
      {
        platform: 'Instagram',
        url: data.instagram_url || 'https://www.instagram.com/binaproject.id',
        icon: 'simple-icons:instagram',
        label: 'Kunjungi Instagram Resmi Bina Project',
      },
      {
        platform: 'WhatsApp',
        url: data.whatsapp_url || `https://wa.me/${mergedContact.whatsappNumber}`,
        icon: 'simple-icons:whatsapp',
        label: 'Hubungi WhatsApp Resmi Bina Project',
      },
      {
        platform: 'TikTok',
        url: data.tiktok_url || 'https://www.tiktok.com/@binaproject.id',
        icon: 'simple-icons:tiktok',
        label: 'Ikuti TikTok Resmi Bina Project',
      },
      {
        platform: 'YouTube',
        url: data.youtube_url || 'https://www.youtube.com/@binaproject.id',
        icon: 'simple-icons:youtube',
        label: 'Tonton Kanal YouTube Resmi Bina Project',
      },
    ];

    cachedSiteConfig = {
      ...staticSiteConfig,
      contact: mergedContact,
      socials: mergedSocials,
    };

    return cachedSiteConfig;
  } catch (err) {
    console.warn('[SiteSettingsService] Database query exception, falling back to static config:', err);
    return staticSiteConfig;
  }
}

export async function getContactInfo(): Promise<ContactInfo> {
  const config = await getSiteSettings();
  return config.contact;
}
