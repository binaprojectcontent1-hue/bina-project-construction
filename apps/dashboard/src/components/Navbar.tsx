import React, { useState } from 'react';
import {
  Rocket,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  LogOut,
  ChevronRight,
  Menu,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { triggerCloudflareDeploy } from '../lib/cloudflare';
import { useToast } from './ui/Toast';

interface NavbarProps {
  activeTab: string;
  userEmail?: string;
  onLogout?: () => void;
  onToggleMobile?: () => void;
  onToggleCollapse?: () => void;
  isCollapsed?: boolean;
  onNavigate?: (tab: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  userEmail,
  onLogout,
  onToggleMobile,
  onToggleCollapse,
  isCollapsed = false,
  onNavigate,
}) => {
  const [deploying, setDeploying] = useState(false);
  const [deployResult, setDeployResult] = useState<{ success: boolean; message: string; timestamp?: string } | null>(null);
  const toast = useToast();

  const handleDeploy = async () => {
    setDeploying(true);
    setDeployResult(null);
    const toastId = toast.loading('Memperbarui halaman website publik...');
    try {
      const res = await triggerCloudflareDeploy();
      setDeployResult(res);
      toast.dismiss(toastId);
      if (res.success) {
        toast.success('Pembaruan Berhasil Terkirim!', 'Sistem sedang memperbarui halaman website utama (~45 detik).');
        setTimeout(() => setDeployResult(null), 7000);
      } else {
        toast.error('Pembaruan Gagal', res.message);
      }
    } catch (err: any) {
      toast.dismiss(toastId);
      toast.error('Gagal memperbarui website', err?.message || 'Koneksi bermasalah');
    } finally {
      setDeploying(false);
    }
  };

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'overview':
        return 'Beranda & Ringkasan';
      case 'portfolio':
        return 'Portofolio Proyek';
      case 'portfolio-new':
        return 'Editor Portofolio';
      case 'articles':
        return 'Artikel & Berita';
      case 'article-new':
        return 'Editor Artikel';
      case 'live-projects':
        return 'Proyek Berjalan';
      case 'live-project-new':
        return 'Editor Proyek Berjalan';
      case 'biolink':
        return 'Bio Link';
      case 'site-settings':
        return 'Profil & Kontak Bisnis';
      case 'recruitment-jobs':
        return 'Lowongan Kerja';
      case 'recruitment-job-edit':
        return 'Editor Lowongan';
      case 'recruitment-candidates':
        return 'Kandidat Pelamar';
      case 'redirects':
        return 'Pengalihan Tautan';
      case 'settings':
        return 'Pengaturan & Publikasi Web';
      default:
        return 'Beranda';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 md:px-6">
      {/* Left: Sidebar Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile menu button */}
        {onToggleMobile && (
          <button
            type="button"
            onClick={onToggleMobile}
            className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 md:hidden flex-shrink-0 transition-colors"
            aria-label="Buka Menu Navigasi"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        {/* Desktop collapse toggle */}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden md:flex p-1.5 rounded-md border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 flex-shrink-0 transition-colors"
            title={isCollapsed ? 'Buka Sidebar' : 'Ciutkan Sidebar'}
          >
            {isCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        )}

        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-500 min-w-0">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('overview')}
            className="text-[#1B365D] font-semibold hover:underline hidden sm:inline cursor-pointer transition-colors"
          >
            Studio
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 hidden sm:inline flex-shrink-0" />
          <span className="text-slate-900 font-semibold truncate text-xs md:text-sm">
            {getBreadcrumbTitle()}
          </span>
        </nav>
      </div>

      {/* Right: Actions & User */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        <a
          href="https://binaproject.id"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex"
        >
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 h-8 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors shadow-2xs cursor-pointer"
          >
            <span>Lihat Web</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </a>

        {/* Cloudflare Deploy Button */}
        <button
          type="button"
          onClick={handleDeploy}
          disabled={deploying}
          className="inline-flex items-center gap-1.5 h-8 px-3.5 bg-[#1B365D] hover:bg-[#132845] text-white text-xs font-semibold rounded-md shadow-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          title="Publikasikan perubahan data terbaru langsung ke website live"
        >
          {deploying ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Rocket className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline">{deploying ? 'Mempublikasikan...' : 'Publikasi Live'}</span>
          <span className="sm:hidden">{deploying ? 'Proses...' : 'Publikasi'}</span>
        </button>

        {/* User Profile & Logout */}
        {userEmail && (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200 shadow-2xs"
              title={`Masuk sebagai ${userEmail}`}
            >
              {userEmail.charAt(0).toUpperCase()}
            </div>
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Keluar dari Dashboard"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Deploy Notification */}
      {deployResult && (
        <div
          className={`absolute top-16 right-4 z-50 flex items-center gap-2.5 rounded-lg border p-3 text-xs font-medium shadow-lg transition-all animate-in fade-in slide-in-from-top-2 ${
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
            className="text-xs font-semibold underline ml-2 text-slate-700 hover:text-slate-950 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}
    </header>
  );
};
