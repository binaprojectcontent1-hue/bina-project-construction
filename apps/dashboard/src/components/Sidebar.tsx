import React from 'react';
import {
  LayoutDashboard,
  Briefcase,
  BookOpen,
  Shuffle,
  Settings,
  FolderPlus,
  PenTool,
  CheckCircle2,
  X,
  ExternalLink,
  Link2,
  MapPin,
  Building2,
} from 'lucide-react';

export type TabType =
  | 'overview'
  | 'portfolio'
  | 'articles'
  | 'live-projects'
  | 'biolink'
  | 'site-settings'
  | 'redirects'
  | 'settings'
  | 'portfolio-new'
  | 'article-new'
  | 'live-project-new';

interface SidebarProps {
  activeTab: TabType;
  onNavigate: (tab: TabType) => void;
  portfolioCount?: number;
  articleCount?: number;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onNavigate,
  portfolioCount = 0,
  articleCount = 0,
  mobileOpen = false,
  onCloseMobile,
}) => {
  const handleSelect = (tab: TabType) => {
    onNavigate(tab);
    if (onCloseMobile) onCloseMobile();
  };

  const isTabActive = (tab: TabType) => {
    if (tab === 'portfolio' && activeTab === 'portfolio-new') return true;
    if (tab === 'articles' && activeTab === 'article-new') return true;
    if (tab === 'live-projects' && activeTab === 'live-project-new') return true;
    return activeTab === tab;
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Floating Island Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 min-w-[18rem] max-w-[18rem] shrink-0 h-full md:h-auto md:rounded-[28px] bg-gradient-to-b from-[#0E1E38] via-[#0B172C] to-[#07101E] border border-slate-700/60 shadow-2xl flex flex-col justify-between p-4 overflow-y-auto select-none transition-transform duration-300 ${
          mobileOpen
            ? 'translate-x-0 shadow-2xl'
            : '-translate-x-full md:translate-x-0 md:transform-none'
        }`}
      >
        <div className="space-y-5">
          {/* Workspace Branding Header */}
          <div className="flex items-center justify-between gap-3 rounded-2xl p-3 bg-[#12233B]/80 border border-blue-500/20 shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#22416D] text-white font-extrabold text-base shadow-sm ring-2 ring-[#22416D]/30">
                B
              </div>
              <div className="min-w-0 flex-1 leading-tight">
                <span className="block truncate font-bold text-white text-sm">
                  Bina Project Studio
                </span>
                <span className="truncate text-xs text-blue-200/70 font-medium flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-blue-300" />
                  <span>Admin Workspace</span>
                </span>
              </div>
            </div>
            {mobileOpen && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-1.5 shrink-0 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 md:hidden"
                aria-label="Tutup Menu"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Quick Create Buttons (Pill-shaped) */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleSelect('portfolio-new')}
              className={`flex items-center justify-center gap-1.5 h-9 px-3 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer ${
                activeTab === 'portfolio-new'
                  ? 'bg-[#152B49] text-white ring-2 ring-blue-400/40'
                  : 'bg-[#22416D] hover:bg-[#1A3356] text-white'
              }`}
            >
              <FolderPlus className="w-3.5 h-3.5 shrink-0" />
              <span>+ Proyek</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelect('article-new')}
              className={`flex items-center justify-center gap-1.5 h-9 px-3 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                activeTab === 'article-new'
                  ? 'bg-[#152B49] border-blue-400 text-white'
                  : 'border-blue-400/30 bg-[#12233B]/60 hover:bg-[#12233B] text-blue-100'
              }`}
            >
              <PenTool className="w-3.5 h-3.5 shrink-0 text-blue-200" />
              <span>+ Artikel</span>
            </button>
          </div>

          {/* Navigation Section 1: Dashboard */}
          <div className="space-y-1">
            <div className="px-4 py-1 text-xs font-semibold text-blue-200/50 uppercase tracking-wider">
              Menu Utama
            </div>

            <button
              type="button"
              onClick={() => handleSelect('overview')}
              className={`w-full flex items-center justify-between gap-3 rounded-full px-4 h-11 text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#22416D] text-white shadow-md shadow-[#22416D]/30 border border-blue-400/30'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <LayoutDashboard className={`w-5 h-5 shrink-0 ${activeTab === 'overview' ? 'text-white' : 'text-blue-300/70'}`} />
                <span className="truncate">Beranda & Ringkasan</span>
              </div>
            </button>
          </div>

          {/* Navigation Section 2: Content Management */}
          <div className="space-y-1">
            <div className="px-4 py-1 text-xs font-semibold text-blue-200/50 uppercase tracking-wider">
              Kelola Konten Website
            </div>

            {/* Portofolio */}
            <button
              type="button"
              onClick={() => handleSelect('portfolio')}
              className={`w-full flex items-center justify-between gap-3 rounded-full px-4 h-11 text-sm font-semibold transition-all cursor-pointer ${
                isTabActive('portfolio')
                  ? 'bg-[#22416D] text-white shadow-md shadow-[#22416D]/30 border border-blue-400/30'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Briefcase className={`w-5 h-5 shrink-0 ${isTabActive('portfolio') ? 'text-white' : 'text-blue-300/70'}`} />
                <span className="truncate">Portofolio Proyek</span>
              </div>
              <span
                className={`text-xs font-bold font-mono tabular-nums px-2.5 py-0.5 rounded-full min-w-[1.75rem] text-center shrink-0 ${
                  isTabActive('portfolio') ? 'bg-white/25 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {portfolioCount}
              </span>
            </button>

            {/* Proyek Berjalan */}
            <button
              type="button"
              onClick={() => handleSelect('live-projects')}
              className={`w-full flex items-center justify-between gap-3 rounded-full px-4 h-11 text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'live-projects'
                  ? 'bg-[#22416D] text-white shadow-md shadow-[#22416D]/30 border border-blue-400/30'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <MapPin className={`w-5 h-5 shrink-0 ${activeTab === 'live-projects' ? 'text-white' : 'text-blue-300/70'}`} />
                <span className="truncate">Proyek Berjalan</span>
              </div>
            </button>

            {/* Artikel Blog */}
            <button
              type="button"
              onClick={() => handleSelect('articles')}
              className={`w-full flex items-center justify-between gap-3 rounded-full px-4 h-11 text-sm font-semibold transition-all cursor-pointer ${
                isTabActive('articles')
                  ? 'bg-[#22416D] text-white shadow-md shadow-[#22416D]/30 border border-blue-400/30'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <BookOpen className={`w-5 h-5 shrink-0 ${isTabActive('articles') ? 'text-white' : 'text-blue-300/70'}`} />
                <span className="truncate">Artikel & Berita</span>
              </div>
              <span
                className={`text-xs font-bold font-mono tabular-nums px-2.5 py-0.5 rounded-full min-w-[1.75rem] text-center shrink-0 ${
                  isTabActive('articles') ? 'bg-white/25 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {articleCount}
              </span>
            </button>

            {/* Bio Link (Linktree) */}
            <button
              type="button"
              onClick={() => handleSelect('biolink')}
              className={`w-full flex items-center justify-between gap-3 rounded-full px-4 h-11 text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'biolink'
                  ? 'bg-[#22416D] text-white shadow-md shadow-[#22416D]/30 border border-blue-400/30'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Link2 className={`w-5 h-5 shrink-0 ${activeTab === 'biolink' ? 'text-white' : 'text-blue-300/70'}`} />
                <span className="truncate">Bio Link (Linktree)</span>
              </div>
              <span
                className={`text-xs font-medium px-2.5 py-0.5 rounded-full shrink-0 ${
                  activeTab === 'biolink' ? 'bg-white/25 text-white' : 'bg-blue-500/20 text-blue-300'
                }`}
              >
                Aktif
              </span>
            </button>

            {/* Profil & Kontak Bisnis */}
            <button
              type="button"
              onClick={() => handleSelect('site-settings')}
              className={`w-full flex items-center justify-between gap-3 rounded-full px-4 h-11 text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'site-settings'
                  ? 'bg-[#22416D] text-white shadow-md shadow-[#22416D]/30 border border-blue-400/30'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Building2 className={`w-5 h-5 shrink-0 ${activeTab === 'site-settings' ? 'text-white' : 'text-blue-300/70'}`} />
                <span className="truncate">Profil & Kontak</span>
              </div>
            </button>
          </div>

          {/* Navigation Section 3: Settings & Tools */}
          <div className="space-y-1">
            <div className="px-4 py-1 text-xs font-semibold text-blue-200/50 uppercase tracking-wider">
              Sistem & Pengaturan
            </div>

            <button
              type="button"
              onClick={() => handleSelect('redirects')}
              className={`w-full flex items-center justify-between gap-3 rounded-full px-4 h-11 text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'redirects'
                  ? 'bg-[#22416D] text-white shadow-md shadow-[#22416D]/30 border border-blue-400/30'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Shuffle className={`w-5 h-5 shrink-0 ${activeTab === 'redirects' ? 'text-white' : 'text-blue-300/70'}`} />
                <span className="truncate">Pengalihan Link (301)</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSelect('settings')}
              className={`w-full flex items-center justify-between gap-3 rounded-full px-4 h-11 text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#22416D] text-white shadow-md shadow-[#22416D]/30 border border-blue-400/30'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Settings className={`w-5 h-5 shrink-0 ${activeTab === 'settings' ? 'text-white' : 'text-blue-300/70'}`} />
                <span className="truncate">Pengaturan & Publikasi</span>
              </div>
            </button>
          </div>
        </div>

        {/* Sidebar Footer: Website link & Status */}
        <div className="space-y-2 pt-4 border-t border-slate-700/50 shrink-0">
          <a
            href="https://binaproject.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full px-4 h-10 rounded-full bg-[#12233B]/80 hover:bg-[#1A3356] border border-blue-400/20 text-xs font-bold text-slate-200 transition-colors shadow-xs"
          >
            <span className="flex items-center gap-2 truncate">
              <span className="w-2 h-2 shrink-0 rounded-full bg-emerald-400 ring-2 ring-emerald-400/30" />
              <span className="truncate">Buka Website Asli</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 shrink-0 text-slate-400" />
          </a>

          <div className="rounded-2xl bg-[#080F1D]/80 border border-slate-800 p-3 text-xs space-y-1 shadow-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-200 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Sistem Siap Digunakan</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Auto-kompresi gambar & SEO aktif otomatis.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
