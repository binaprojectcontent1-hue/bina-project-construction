import React from 'react';
import {
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
  return ICON_MAP[normalized] || Globe;
}

export function LinkButton({ link }: LinkButtonProps) {
  const Icon = getIcon(link.icon);

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
      contentClassName="flex items-center gap-4 w-full px-5 py-4"
      aria-label={link.title}
    >
      <div className="link-button-icon-wrapper">
        <Icon className="link-button-icon" />
      </div>
      <span className="link-button-text flex-1 text-left">{link.title}</span>
      <ArrowUpRight className="link-button-arrow" />
    </GlassButton>
  );
}

export default LinkButton;
