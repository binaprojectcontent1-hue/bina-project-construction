import React, { useState } from 'react';
import {
  Rocket,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  LogOut,
  ChevronRight,
  Slash,
  Search,
  Menu,
  User,
} from 'lucide-react';
import { triggerCloudflareDeploy } from '../lib/cloudflare';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface NavbarProps {
  activeTab: string;
  userEmail?: string;
  onLogout?: () => void;
  onToggleMobile?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, userEmail, onLogout, onToggleMobile }) => {
  const [deploying, setDeploying] = useState(false);
  const [deployResult, setDeployResult] = useState<{ success: boolean; message: string; timestamp?: string } | null>(null);

  const handleDeploy = async () => {
    setDeploying(true);
    setDeployResult(null);
    try {
      const res = await triggerCloudflareDeploy();
      setDeployResult(res);
      if (res.success) {
        setTimeout(() => setDeployResult(null), 7000);
      }
    } finally {
      setDeploying(false);
    }
  };

  // Human readable breadcrumb title
  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'overview':
        return 'Beranda & Ringkasan';
      case 'portfolio':
        return 'Portofolio Proyek';
      case 'portfolio-new':
        return 'Portofolio / Editor Proyek';
      case 'articles':
        return 'Artikel & Berita';
      case 'article-new':
        return 'Artikel / Tulis Baru';
      case 'redirects':
        return 'Pengalihan Tautan (301)';
      case 'settings':
        return 'Pengaturan & Publikasi';
      default:
        return 'Beranda';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-slate-200/90 bg-white/95 backdrop-blur-md px-4 md:px-8 shadow-xs">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        {onToggleMobile && (
          <button
            type="button"
            onClick={onToggleMobile}
            className="p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 md:hidden flex-shrink-0 transition-colors"
            aria-label="Buka Menu Navigasi"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 min-w-0">
          <span className="text-[#22416D] font-extrabold hidden sm:inline">Bina Project</span>
          <ChevronRight className="w-4 h-4 text-slate-300 hidden sm:inline flex-shrink-0" />
          <span className="text-slate-900 font-bold truncate text-sm md:text-base">
            {getBreadcrumbTitle()}
          </span>
        </div>
      </div>

      {/* Right: Global Actions & User Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
        {/* View Live Website Button */}
        <a
          href="https://binaproject.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex"
        >
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 h-9 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors shadow-xs"
          >
            <span>Web Publik</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </a>

        {/* Deploy to Cloudflare Button */}
        <button
          type="button"
          onClick={handleDeploy}
          disabled={deploying}
          className="inline-flex items-center gap-1.5 h-9 px-3.5 bg-[#22416D] hover:bg-[#1A3356] text-white text-xs font-bold rounded-lg shadow-xs transition-colors disabled:opacity-50"
        >
          {deploying ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Rocket className="w-3.5 h-3.5" />
          )}
          <span>{deploying ? 'Deploying...' : 'Perbarui Web'}</span>
        </button>

        {/* User Avatar & Logout */}
        {userEmail && (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#22416D] text-xs font-bold text-white shadow-xs"
              title={`Logged in as ${userEmail}`}
            >
              {userEmail.charAt(0).toUpperCase()}
            </div>
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Keluar dari Dashboard"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Floating Notification Toast if deploy status active */}
      {deployResult && (
        <div
          className={`absolute top-18 right-6 z-50 flex items-center gap-3 rounded-xl border p-3.5 text-xs font-medium shadow-xl transition-all animate-in fade-in slide-in-from-top-2 ${
            deployResult.success
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
              : 'border-rose-200 bg-rose-50 text-rose-900'
          }`}
        >
          {deployResult.success ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          )}
          <span>{deployResult.message}</span>
          <button
            onClick={() => setDeployResult(null)}
            className="text-xs font-bold underline ml-2 text-slate-700 hover:text-slate-950"
          >
            Tutup
          </button>
        </div>
      )}
    </header>
  );
};
