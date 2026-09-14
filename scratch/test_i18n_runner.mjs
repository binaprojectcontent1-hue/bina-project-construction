import { ui } from '../src/i18n/ui.js';

// Test UI keys
console.log('Testing dictionary keys...');
if (!ui.id['nav.about'] || ui.id['nav.about'] !== 'Tentang Kami') {
  throw new Error('ID translation missing nav.about');
}
if (!ui.en['nav.about'] || ui.en['nav.about'] !== 'About Us') {
  throw new Error('EN translation missing nav.about');
}

// Test path localization logic
function getLocalizedPath(pathname, targetLang) {
  let cleanPath = pathname.replace(/\/$/, '') || '/';
  const isEn = cleanPath === '/en' || cleanPath.startsWith('/en/');
  let basePath = isEn ? cleanPath.replace(/^\/en/, '') : cleanPath;
  if (!basePath) basePath = '/';

  if (targetLang === 'en') {
    return basePath === '/' ? '/en' : `/en${basePath}`;
  }
  return basePath;
}

if (getLocalizedPath('/about', 'en') !== '/en/about') throw new Error('Path localization failed for en');
if (getLocalizedPath('/en/about', 'id') !== '/about') throw new Error('Path localization failed for id');
if (getLocalizedPath('/', 'en') !== '/en') throw new Error('Root to en failed');
if (getLocalizedPath('/en', 'id') !== '/') throw new Error('En to root failed');
if (getLocalizedPath('/portfolio/villa-modern', 'en') !== '/en/portfolio/villa-modern') throw new Error('Nested path en failed');
if (getLocalizedPath('/en/portfolio/villa-modern', 'id') !== '/portfolio/villa-modern') throw new Error('Nested path id failed');

console.log('PASS: All i18n logic tests passed successfully!');
