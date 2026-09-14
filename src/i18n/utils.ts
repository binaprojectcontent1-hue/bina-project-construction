/**
 * @file utils.ts
 * @description i18n Path and Translation Utilities for Bina Project
 */

import { ui, defaultLang, type Language, type TranslationKey } from './ui';

export function getLangFromUrl(url: URL): Language {
  const [, lang] = url.pathname.split('/');
  if (lang === 'en') return 'en';
  return defaultLang;
}

export function useTranslations(lang: Language) {
  return function t(key: TranslationKey): string {
    const dict = ui[lang] || ui[defaultLang];
    return (dict as Record<string, string>)[key] || (ui[defaultLang] as Record<string, string>)[key] || key;
  };
}

export function getLocalizedPath(pathname: string, targetLang: Language): string {
  // Normalize path removing trailing slash unless root
  let cleanPath = pathname.replace(/\/$/, '') || '/';
  
  // Check if already prefixed with /en
  const isEn = cleanPath === '/en' || cleanPath.startsWith('/en/');
  
  // Extract base path without locale prefix
  let basePath = isEn ? cleanPath.replace(/^\/en/, '') : cleanPath;
  if (!basePath) basePath = '/';

  if (targetLang === 'en') {
    return basePath === '/' ? '/en' : `/en${basePath}`;
  }

  // Indonesian default locale has no prefix
  return basePath;
}

const CATEGORY_TRANSLATIONS: Record<string, { id: string; en: string }> = {
  konstruksi: { id: 'Konstruksi', en: 'Construction' },
  interior: { id: 'Interior', en: 'Interior' },
  renovasi: { id: 'Renovasi', en: 'Renovation' },
  arsitektur: { id: 'Arsitektur', en: 'Architecture' },
  eksterior: { id: 'Eksterior', en: 'Exterior' },
  'kitchen set': { id: 'Kitchen Set', en: 'Kitchen Set' },
  developer: { id: 'Developer', en: 'Housing Development' },
  waterproofing: { id: 'Waterproofing', en: 'Specialist Waterproofing' },
};

export function getCategoryLabel(category: string | undefined, lang: Language): string {
  if (!category) return '';
  const key = category.toLowerCase().trim();
  const match = CATEGORY_TRANSLATIONS[key];
  if (match) return match[lang];
  return category;
}
