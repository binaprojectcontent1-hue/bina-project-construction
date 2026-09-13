/**
 * @file partners.ts
 * @description Single Source of Truth for corporate partners and institutions collaborating with Bina Project.
 */

import type { PartnerBrand } from '@types';

export const PARTNER_BRANDS: readonly PartnerBrand[] = [
  { id: 1, src: '/assets/img/brand/brand_1_1.svg', name: 'Apotek Multazam' },
  { id: 2, src: '/assets/img/brand/brand_1_2.svg', name: 'Yayasan Barokah Multazam' },
  { id: 3, src: '/assets/img/brand/brand_1_3.svg', name: 'Rosana' },
  { id: 4, src: '/assets/img/brand/brand_1_4.svg', name: 'Arkatama' },
  { id: 5, src: '/assets/img/brand/brand_1_5.svg', name: 'AMD Academy' },
  { id: 6, src: '/assets/img/brand/brand_1_6.svg', name: 'RS Permata Bunda' },
  { id: 7, src: '/assets/img/brand/brand_1_7.svg', name: 'Bea Cukai Pasuruan' },
  { id: 8, src: '/assets/img/brand/brand_1_8.svg', name: 'Multazam' },
] as const;
