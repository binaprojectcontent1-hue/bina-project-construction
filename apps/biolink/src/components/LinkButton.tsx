import React from 'react';
import * as LucideIcons from 'lucide-react';
import type { BioLink } from '../types';
import { supabase } from '../lib/supabase';

interface LinkButtonProps {
  link: BioLink;
}

function getIcon(iconName: string): React.ComponentType<{ className?: string }> {
  if (!iconName) return LucideIcons.Globe;

  // Convert kebab-case to PascalCase (e.g. "message-circle" -> "MessageCircle")
  const pascalName = iconName
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
    .join('') as keyof typeof LucideIcons;

  const IconComponent = LucideIcons[pascalName];
  if (IconComponent && typeof IconComponent === 'function') {
    return IconComponent as React.ComponentType<{ className?: string }>;
  }

  // Common fallbacks
  const commonMap: Record<string, React.ComponentType<{ className?: string }>> = {
    whatsapp: LucideIcons.MessageCircle,
    phone: LucideIcons.Phone,
    mail: LucideIcons.Mail,
    email: LucideIcons.Mail,
    web: LucideIcons.Globe,
    website: LucideIcons.Globe,
    portfolio: LucideIcons.Briefcase,
    article: LucideIcons.BookOpen,
    blog: LucideIcons.BookOpen,
    calc: LucideIcons.Calculator,
    calculator: LucideIcons.Calculator,
  };

  return commonMap[iconName.toLowerCase()] || LucideIcons.Globe;
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
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="link-button group"
      aria-label={link.title}
    >
      <div className="link-button-icon-wrapper">
        <Icon className="link-button-icon" />
      </div>
      <span className="link-button-text">{link.title}</span>
      <LucideIcons.ArrowUpRight className="link-button-arrow" />
    </a>
  );
}

export default LinkButton;
