/**
 * @file whatsapp.ts
 * @description Single Source of Truth for generating WhatsApp consultation URLs.
 */

import { siteConfig } from '@config/site';

export interface WhatsAppUrlOptions {
  /** Type of consultation */
  type?: 'general' | 'location' | 'service' | 'contact_form';
  /** City or coverage area name (for type='location') */
  city?: string;
  /** Service title (for type='service') */
  service?: string;
  /** Structured form submission data */
  formData?: {
    name: string;
    email: string;
    phone: string;
    service: string;
    message: string;
  };
  /** Direct custom message override */
  customMessage?: string;
  /** Optional custom WhatsApp number override */
  whatsappNumber?: string;
}

/**
 * Creates a fully-encoded, valid WhatsApp URL based on structured options.
 */
export function createWhatsAppUrl(options: WhatsAppUrlOptions = {}): string {
  const number = options.whatsappNumber || siteConfig.contact.whatsappNumber;

  if (options.customMessage) {
    return `https://wa.me/${number}?text=${encodeURIComponent(options.customMessage)}`;
  }

  if (options.type === 'location' && options.city) {
    const text = `Halo Bina Project, saya ingin konsultasi layanan konstruksi & interior untuk wilayah ${options.city}.`;
    return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  }

  if (options.type === 'service' && options.service) {
    const text = `Halo Bina Project, saya tertarik dengan layanan ${options.service}. Mohon info estimasi biaya dan jadwal survei.`;
    return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  }

  if (options.type === 'contact_form' && options.formData) {
    const { name, email, phone, service, message } = options.formData;
    const text =
      `*Halo Tim Bina Project, saya ingin konsultasi proyek:*\n\n` +
      `👤 *Nama Lengkap:* ${name}\n` +
      `📧 *Email:* ${email}\n` +
      `📱 *No. HP/WhatsApp:* ${phone}\n` +
      `🛠️ *Jenis Layanan:* ${service}\n` +
      `📝 *Detail Rencana Proyek:*\n${message}\n\n` +
      `_Dikirimkan melalui formulir kontak binaproject.com_`;
    return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  }

  // Default general consultation message
  const defaultText = 'Halo Bina Project, saya ingin konsultasi mengenai proyek bangunan/interior saya.';
  return `https://wa.me/${number}?text=${encodeURIComponent(defaultText)}`;
}
