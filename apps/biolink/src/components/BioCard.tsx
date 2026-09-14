import type { BioLink, BioLinkSettings } from '../types';
import { LinkButton } from './LinkButton';
import { SocialBar } from './SocialBar';
import { CheckCircle2 } from 'lucide-react';

interface BioCardProps {
  settings: BioLinkSettings | null;
  links: BioLink[];
  loading?: boolean;
}

export function BioCard({ settings, links, loading = false }: BioCardProps) {
  const activeLinks = links
    .filter((l) => l.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);

  const defaultLogo = '/logo.webp';
  const logoSrc =
    settings?.avatar_url &&
    settings.avatar_url.trim() !== '' &&
    !settings.avatar_url.includes('favicon.png')
      ? settings.avatar_url
      : defaultLogo;

  return (
    <div className="bio-card">
      {/* Brand Logo */}
      <div className="bio-logo-wrap">
        <img
          src={logoSrc}
          alt={settings?.profile_name || 'Bina Project'}
          className="bio-logo"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/logo.webp';
          }}
        />
      </div>

      {/* Profile Header */}
      <div className="bio-header">
        <div className="bio-name-row">
          <h1 className="bio-name">{settings?.profile_name || 'Bina Project'}</h1>
          <span title="Official Verified Account" className="flex items-center">
            <CheckCircle2 className="bio-verified-badge" />
          </span>
        </div>
        <p className="bio-tagline">
          {settings?.tagline || 'Jasa Konstruksi & Interior Terpercaya di Malang'}
        </p>
      </div>

      {/* Bio Links Container */}
      <div className="bio-links">
        {loading ? (
          <div className="bio-skeleton-list">
            <div className="bio-skeleton-item" />
            <div className="bio-skeleton-item" />
            <div className="bio-skeleton-item" />
            <div className="bio-skeleton-item" />
          </div>
        ) : activeLinks.length > 0 ? (
          activeLinks.map((link) => (
            <LinkButton key={link.id} link={link} />
          ))
        ) : (
          <div className="bio-empty">
            <p>Belum ada tautan aktif yang tersedia.</p>
          </div>
        )}
      </div>

      {/* Social Media Bar */}
      <SocialBar socials={settings?.social_links} />

      {/* Footer & Copyright */}
      <footer className="bio-footer">
        <p>© 2026 Bina Project</p>
      </footer>
    </div>
  );
}

export default BioCard;
