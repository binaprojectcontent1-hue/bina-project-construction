/**
 * @file site.ts
 * @description Type definitions for site metadata, branding, and contact channels.
 */

export interface NavItem {
  readonly name: string;
  readonly href: string;
  readonly icon?: string;
}

export interface SocialLink {
  readonly platform: string;
  readonly url: string;
  readonly icon: string;
  readonly label: string;
}

export interface ContactInfo {
  readonly phoneDisplay: string;
  readonly phoneTel: string;
  readonly whatsappNumber: string;
  readonly whatsappUrl: string;
  readonly email: string;
  readonly address: string;
  readonly city: string;
  readonly province: string;
  readonly postalCode: string;
  readonly country: string;
  readonly googleMapsUrl: string;
  readonly googleMapsEmbedUrl: string;
  readonly openingHours: string;
  readonly openingHoursDetail: string;
}

export interface SiteConfig {
  readonly name: string;
  readonly legalName: string;
  readonly tagline: string;
  readonly description: string;
  readonly siteUrl: string;
  readonly contact: ContactInfo;
  readonly socials: readonly SocialLink[];
  readonly mainNav: readonly NavItem[];
}
