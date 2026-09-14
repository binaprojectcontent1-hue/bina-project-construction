import {
  icons,
  Globe,
  MessageCircle,
  Briefcase,
  BookOpen,
  Calculator,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  FileText,
  ShoppingBag,
  ShieldCheck,
  Star,
  Award,
  Heart,
  Share2,
  Sparkles,
  ExternalLink,
  ArrowUpRight,
  Building2,
  Home,
  Wrench,
  Compass,
  Layers,
  Send,
  Camera,
  Video,
  Link2,
} from 'lucide-react';
import type { BioLink } from '../types';
import { supabase } from '../lib/supabase';
import { GlassButton } from '@/components/ui/glass-button';

interface LinkButtonProps {
  link: BioLink;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  globe: Globe,
  web: Globe,
  website: Globe,
  'message-circle': MessageCircle,
  whatsapp: MessageCircle,
  chat: MessageCircle,
  briefcase: Briefcase,
  portfolio: Briefcase,
  proyek: Briefcase,
  'book-open': BookOpen,
  blog: BookOpen,
  article: BookOpen,
  artikel: BookOpen,
  calculator: Calculator,
  calc: Calculator,
  estimasi: Calculator,
  phone: Phone,
  telepon: Phone,
  mail: Mail,
  email: Mail,
  'map-pin': MapPin,
  maps: MapPin,
  lokasi: MapPin,
  calendar: Calendar,
  jadwal: Calendar,
  user: User,
  profil: User,
  'file-text': FileText,
  dokumen: FileText,
  'shopping-bag': ShoppingBag,
  toko: ShoppingBag,
  'shield-check': ShieldCheck,
  garansi: ShieldCheck,
  star: Star,
  rating: Star,
  award: Award,
  prestasi: Award,
  heart: Heart,
  share: Share2,
  'share-2': Share2,
  sparkles: Sparkles,
  'external-link': ExternalLink,
  'building-2': Building2,
  konstruksi: Building2,
  kantor: Building2,
  home: Home,
  rumah: Home,
  interior: Home,
  wrench: Wrench,
  renovasi: Wrench,
  compass: Compass,
  desain: Compass,
  layers: Layers,
  send: Send,
  camera: Camera,
  foto: Camera,
  instagram: Camera,
  video: Video,
  youtube: Video,
  link: Link2,
  'link-2': Link2,
};

function getIcon(iconName: string): React.ComponentType<{ className?: string }> {
  if (!iconName) return Globe;
  const normalized = iconName.trim().toLowerCase();
  if (ICON_MAP[normalized]) return ICON_MAP[normalized];

  const iconObj = icons as Record<string, React.ComponentType<{ className?: string }>>;
  if (iconObj[iconName]) return iconObj[iconName];

  const pascal = iconName
    .split(/[-_]/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join('');
  if (iconObj[pascal]) return iconObj[pascal];

  const stripped = normalized.replace(/[-_]/g, '');
  const foundKey = Object.keys(iconObj).find((k) => k.toLowerCase() === stripped);
  if (foundKey && iconObj[foundKey]) return iconObj[foundKey];

  return Link2;
}

export function LinkButton({ link }: LinkButtonProps) {
  let Icon = getIcon(link.icon);
  if (link.url?.includes('maps') && (!link.icon || link.icon === 'globe')) {
    Icon = MapPin;
  }

  // Ensure title has proper spacing
  const displayTitle = (link.title || '')
    .replace(/WebsiteBina/g, 'Website Bina')
    .trim();

  const handleClick = () => {
    // Non-blocking fire-and-forget atomic click tracking
    if (supabase && link.id && !link.id.startsWith('demo-')) {
      supabase.rpc('increment_biolink_click', { link_id: link.id }).then(
        () => {},
        () => {}
      );
    }
  };

  return (
    <GlassButton
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      size="default"
      className="w-full group"
      contentClassName="relative flex items-center justify-center w-full px-5 py-4 min-h-[58px]"
      aria-label={displayTitle}
    >
      <div className="absolute left-5 flex items-center justify-center pointer-events-none">
        <Icon className="w-5 h-5 text-white shrink-0 transition-transform duration-200 group-hover:scale-110" />
      </div>
      <span className="font-semibold text-[15px] text-white tracking-normal select-none text-center px-8">
        {displayTitle}
      </span>
      <div className="absolute right-5 flex items-center justify-center pointer-events-none">
        <ArrowUpRight className="w-4 h-4 text-white/60 shrink-0 transition-transform duration-200 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </GlassButton>
  );
}

export default LinkButton;
