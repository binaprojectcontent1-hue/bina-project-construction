import React, { useState, useMemo } from 'react';
import { icons, Search, X, Check, type LucideIcon } from 'lucide-react';

interface IconPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIcon: string;
  onSelectIcon: (iconId: string) => void;
}

// Indonesian keyword synonym mapping for instant bilingual search
const INDO_KEYWORD_MAP: Record<string, string[]> = {
  rumah: ['Home', 'Building', 'Building2', 'Warehouse'],
  bangun: ['Building2', 'Building', 'HardHat', 'Hammer', 'BrickWall', 'Construction'],
  konstruksi: ['Building2', 'HardHat', 'Hammer', 'Wrench', 'Trowel', 'Ruler', 'Truck'],
  arsitektur: ['DraftingCompass', 'Ruler', 'Building2', 'Compass', 'PenTool'],
  interior: ['Home', 'Armchair', 'Sofa', 'Lamp', 'Bed', 'DoorOpen', 'Bath'],
  dapur: ['Utensils', 'Coffee'],
  tukang: ['Hammer', 'Wrench', 'HardHat', 'Drill', 'Axe', 'PaintRoller'],
  cat: ['Paintbrush', 'PaintRoller', 'Palette'],
  peta: ['Map', 'MapPin', 'Compass', 'Navigation'],
  lokasi: ['MapPin', 'Map', 'Navigation'],
  wa: ['MessageCircle', 'Phone'],
  chat: ['MessageCircle', 'MessageSquare', 'Send'],
  telepon: ['Phone', 'PhoneCall', 'Smartphone'],
  email: ['Mail', 'AtSign', 'Send'],
  diskon: ['BadgePercent', 'Percent', 'Tag', 'Sparkles'],
  promo: ['Sparkles', 'BadgePercent', 'Megaphone', 'Gift'],
  uang: ['DollarSign', 'Coins', 'Wallet', 'CreditCard'],
  harga: ['DollarSign', 'Calculator', 'Receipt', 'Coins'],
  biaya: ['Calculator', 'DollarSign', 'Receipt'],
  belanja: ['ShoppingBag', 'ShoppingCart', 'Store'],
  toko: ['Store', 'ShoppingBag'],
  dokumen: ['FileText', 'File', 'FileCheck', 'Files', 'ClipboardList'],
  katalog: ['BookOpen', 'FileText', 'Files', 'Layers'],
  jadwal: ['Calendar', 'Clock', 'CalendarDays'],
  garansi: ['ShieldCheck', 'Shield', 'Award', 'CheckCircle2'],
  kualitas: ['Award', 'Star', 'CheckCircle2', 'Crown'],
  bintang: ['Star', 'Sparkles'],
  review: ['Star', 'MessageSquareText', 'CheckCircle2'],
  sosial: ['Share2', 'Globe', 'Users', 'Heart'],
  foto: ['Camera', 'Image', 'Images'],
  video: ['Video', 'Play', 'Film'],
  kamera: ['Camera', 'Video'],
  tentang: ['User', 'Users', 'Info', 'HelpCircle'],
  profil: ['User', 'Users', 'CircleUser'],
};

const POPULAR_ICONS = [
  'MessageCircle',
  'Globe',
  'Briefcase',
  'Calculator',
  'BookOpen',
  'Phone',
  'Mail',
  'MapPin',
  'Calendar',
  'Building2',
  'Home',
  'Hammer',
  'Wrench',
  'FileText',
  'ShieldCheck',
  'Star',
  'Share2',
  'Camera',
  'Video',
  'ShoppingBag',
];

const CATEGORY_MAP: Record<string, { label: string; iconNames: string[] }> = {
  popular: {
    label: '🌟 Populer',
    iconNames: POPULAR_ICONS,
  },
  construction: {
    label: '🏗️ Konstruksi & Desain',
    iconNames: [
      'Building2',
      'Building',
      'Home',
      'Hammer',
      'Wrench',
      'HardHat',
      'Ruler',
      'Paintbrush',
      'PaintRoller',
      'DraftingCompass',
      'BrickWall',
      'Shovel',
      'Drill',
      'Axe',
      'Truck',
      'Warehouse',
      'Hotel',
      'DoorOpen',
      'Bed',
      'Bath',
      'Armchair',
      'Sofa',
      'Lamp',
      'Fence',
      'Trees',
      'Compass',
      'Layers',
      'Palette',
    ],
  },
  business: {
    label: '💼 Bisnis & Legal',
    iconNames: [
      'Briefcase',
      'Calculator',
      'FileText',
      'BadgePercent',
      'ShieldCheck',
      'Award',
      'Handshake',
      'Users',
      'DollarSign',
      'Wallet',
      'CreditCard',
      'TrendingUp',
      'Target',
      'BarChart3',
      'PieChart',
      'Landmark',
      'Scale',
      'Receipt',
      'Stamp',
      'Clock',
      'Shield',
      'FileSpreadsheet',
      'CheckCircle2',
    ],
  },
  contact: {
    label: '📱 Kontak & Sosmed',
    iconNames: [
      'Phone',
      'PhoneCall',
      'Mail',
      'MessageCircle',
      'MessageSquare',
      'Send',
      'Globe',
      'Share2',
      'MapPin',
      'Map',
      'Navigation',
      'Calendar',
      'Clock',
      'Bell',
      'AtSign',
      'Radio',
      'Headphones',
      'Megaphone',
      'Smartphone',
      'Link2',
    ],
  },
  media: {
    label: '🎨 Media & Visual',
    iconNames: [
      'Camera',
      'Video',
      'Image',
      'Images',
      'Film',
      'Palette',
      'PenTool',
      'Scissors',
      'Wand2',
      'Shapes',
      'Maximize2',
      'Crop',
      'Sliders',
      'Sun',
      'Moon',
      'Eye',
      'Layout',
      'Grid',
    ],
  },
  all: {
    label: '🔍 Semua 1800+ Ikon',
    iconNames: [], // filled from Object.keys(icons)
  },
};

// Converts PascalCase to kebab-case ID (e.g. 'Building2' -> 'building-2')
export function pascalToKebab(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z0-9])/g, '$1-$2')
    .toLowerCase();
}

// Converts any string (kebab, snake, lower) to PascalCase to resolve in Lucide icons
export function resolveLucideIcon(name: string): LucideIcon {
  if (!name) return icons.Link2 || icons.Globe;
  const iconObj = icons as Record<string, LucideIcon>;
  if (iconObj[name]) return iconObj[name];

  const pascal = name
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');
  if (iconObj[pascal]) return iconObj[pascal];

  const lower = name.toLowerCase().replace(/[-_]/g, '');
  const foundKey = Object.keys(iconObj).find((k) => k.toLowerCase() === lower);
  if (foundKey && iconObj[foundKey]) return iconObj[foundKey];

  return iconObj.Link2 || iconObj.Globe;
}

export const IconPickerModal: React.FC<IconPickerModalProps> = ({
  isOpen,
  onClose,
  selectedIcon,
  onSelectIcon,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('popular');
  const [displayLimit, setDisplayLimit] = useState(72);

  const allIconKeys = useMemo(() => Object.keys(icons).sort(), []);

  // Filtered icons based on active category and bilingual search query
  const filteredIcons = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    // 1. If searching, search across all 1800+ icons
    if (q) {
      // Check for Indonesian synonyms
      const synonymIcons = new Set<string>();
      Object.entries(INDO_KEYWORD_MAP).forEach(([indoKey, matchedIcons]) => {
        if (indoKey.includes(q) || q.includes(indoKey)) {
          matchedIcons.forEach((i) => synonymIcons.add(i));
        }
      });

      return allIconKeys.filter((key) => {
        const lowerKey = key.toLowerCase();
        const kebabKey = pascalToKebab(key);
        return (
          lowerKey.includes(q) ||
          kebabKey.includes(q) ||
          synonymIcons.has(key)
        );
      });
    }

    // 2. If not searching, return category list
    if (activeCategory === 'all') {
      return allIconKeys;
    }

    const cat = CATEGORY_MAP[activeCategory];
    if (cat && cat.iconNames.length > 0) {
      return cat.iconNames.filter((k) => k in icons);
    }

    return POPULAR_ICONS;
  }, [searchQuery, activeCategory, allIconKeys]);

  const visibleIcons = useMemo(() => {
    return filteredIcons.slice(0, displayLimit);
  }, [filteredIcons, displayLimit]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl max-w-2xl w-full p-5 shadow-2xl border border-slate-200 flex flex-col max-h-[85vh] space-y-3.5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
              Pilih Ikon Bio Link
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Tersedia 1.800+ pilihan ikon Lucide dengan pencarian dwi-bahasa
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setDisplayLimit(72);
            }}
            placeholder="Cari ikon (cth: rumah, wa, tukang, hammer, building, phone, star)..."
            className="w-full h-9 pl-9 pr-9 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B365D]/20 focus:border-[#1B365D] font-medium"
            autoFocus
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Tabs (shown when not actively searching) */}
        {!searchQuery && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {Object.entries(CATEGORY_MAP).map(([catKey, catVal]) => {
              const isActive = activeCategory === catKey;
              return (
                <button
                  key={catKey}
                  type="button"
                  onClick={() => {
                    setActiveCategory(catKey);
                    setDisplayLimit(72);
                  }}
                  className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#1B365D] text-white shadow-2xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {catVal.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Grid Container */}
        <div className="flex-1 overflow-y-auto pr-1">
          {visibleIcons.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <p className="text-sm font-semibold text-slate-700">Tidak ada ikon ditemukan</p>
              <p className="text-xs">Coba kata kunci lain dalam bahasa Indonesia atau Inggris.</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {visibleIcons.map((iconName) => {
                const IconComponent = (icons as Record<string, LucideIcon>)[iconName];
                if (!IconComponent) return null;

                const kebabId = pascalToKebab(iconName);
                const isSelected =
                  selectedIcon === kebabId ||
                  selectedIcon.toLowerCase() === iconName.toLowerCase();

                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => {
                      onSelectIcon(kebabId);
                      onClose();
                    }}
                    title={iconName}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-lg border transition-all text-center group cursor-pointer ${
                      isSelected
                        ? 'bg-[#1B365D] text-white border-[#1B365D] shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 mb-1 transition-transform group-hover:scale-110 ${isSelected ? 'text-white' : 'text-slate-700'}`} />
                    <span className={`text-[10px] font-medium truncate w-full px-1 ${isSelected ? 'text-blue-100' : 'text-slate-600'}`}>
                      {iconName}
                    </span>
                    {isSelected && (
                      <Check className="w-3 h-3 text-emerald-400 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Load More Button for large list */}
          {filteredIcons.length > displayLimit && (
            <div className="text-center pt-3 pb-1">
              <button
                type="button"
                onClick={() => setDisplayLimit((prev) => prev + 72)}
                className="px-4 py-1.5 rounded-md text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                Tampilkan Lebih Banyak ({filteredIcons.length - displayLimit} lagi)
              </button>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Menampilkan {visibleIcons.length} dari {filteredIcons.length} ikon</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};
