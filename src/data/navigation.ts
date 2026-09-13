/**
 * @file navigation.ts
 * @description Single Source of Truth for site navigation links, menus, and footers.
 */

import type { NavItem } from '@types';

export const MAIN_NAV: readonly NavItem[] = [
  { name: 'Home', href: '/', icon: 'solar:home-2-linear' },
  { name: 'Tentang Kami', href: '/about', icon: 'solar:users-group-rounded-linear' },
  { name: 'Portfolio', href: '/portfolio', icon: 'solar:city-linear' },
  { name: 'Wilayah Layanan', href: '/about#coverage-sec', icon: 'solar:map-point-linear' },
  { name: 'Artikel', href: '/blog', icon: 'solar:document-text-linear' },
  { name: 'Kontak Kami', href: '/contact', icon: 'solar:headphones-round-sound-linear' },
] as const;

export const FOOTER_QUICK_LINKS: readonly NavItem[] = [
  ...MAIN_NAV,
  { name: 'Syarat & Ketentuan', href: '/syarat-ketentuan', icon: 'solar:document-linear' },
] as const;

export const FOOTER_SERVICES: readonly NavItem[] = [
  { name: 'Konstruksi Rumah & Villa Baru', href: '/portfolio' },
  { name: 'Desain Interior & Kitchen Set', href: '/portfolio' },
  { name: 'Renovasi & Penambahan Ruang', href: '/contact' },
  { name: 'Cafe & Bangunan Komersial', href: '/portfolio' },
  { name: 'Perencanaan 3D & Pembuatan RAB', href: '/contact' },
] as const;
