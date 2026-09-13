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
  const defaultLogo = '/favicon.svg';
  const activeLinks = links
    .filter((l) => l.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="bio-card">
      {/* Brand Avatar */}
      <div className="bio-logo-wrap">
        <img
          src={settings?.avatar_url || '/avatar.png'}
          alt={settings?.profile_name || 'Bina Project'}
          className="bio-logo"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/favicon.svg';
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
      <SocialBar />

      {/* Footer & Copyright */}
      <footer className="bio-footer">
        <p>© {new Date().getFullYear()} Bina Project Construction & Interior</p>
        <span className="bio-footer-sub">All Rights Reserved</span>
      </footer>
    </div>
  );
}

export default BioCard;
