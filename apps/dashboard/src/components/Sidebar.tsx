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
} from 'lucide-react';

export type TabType =
  | 'overview'
  | 'portfolio'
  | 'articles'
  | 'biolink'
  | 'redirects'
  | 'settings'
  | 'portfolio-new'
  | 'article-new';

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
    return activeTab === tab;
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 min-w-[18rem] max-w-[18rem] shrink-0 h-full border-r border-slate-200/90 bg-white flex flex-col justify-between p-4 overflow-y-auto select-none ${
          mobileOpen
            ? 'translate-x-0 shadow-2xl transition-transform duration-300'
            : '-translate-x-full md:translate-x-0 md:transform-none md:transition-none pointer-events-none md:pointer-events-auto'
        }`}
      >
        <div className="space-y-5">
          {/* Workspace Branding Header */}
          <div className="flex items-center justify-between gap-3 rounded-2xl p-3 bg-slate-50/90 shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#22416D] text-white font-extrabold text-base shadow-xs">
                B
              </div>
              <div className="min-w-0 flex-1 leading-tight">
                <span className="block truncate font-bold text-slate-900 text-sm">
                  Bina Project Studio
                </span>
                <span className="truncate text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 shrink-0 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Panel Admin Online</span>
                </span>
              </div>
            </div>
            {mobileOpen && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-1.5 shrink-0 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 md:hidden"
                aria-label="Tutup Menu"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Quick Create Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleSelect('portfolio-new')}
              className={`flex items-center justify-center gap-1.5 h-9 px-2.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'portfolio-new'
                  ? 'bg-[#152B49] text-white shadow-xs'
                  : 'bg-[#22416D] hover:bg-[#1A3356] text-white shadow-xs'
              }`}
            >
              <FolderPlus className="w-3.5 h-3.5 shrink-0" />
              <span>+ Proyek</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelect('article-new')}
              className={`flex items-center justify-center gap-1.5 h-9 px-2.5 rounded-lg text-xs font-bold border transition-colors ${
                activeTab === 'article-new'
                  ? 'bg-slate-100 border-[#22416D] text-[#22416D]'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800 shadow-xs'
              }`}
            >
              <PenTool className="w-3.5 h-3.5 shrink-0 text-slate-600" />
              <span>+ Artikel</span>
            </button>
          </div>

          {/* Navigation Section 1: Dashboard */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Menu Utama
            </div>

            <button
              type="button"
              onClick={() => handleSelect('overview')}
              className={`w-full flex items-center justify-between gap-3 rounded-xl px-3.5 h-11 text-sm font-semibold transition-colors ${
                activeTab === 'overview'
                  ? 'bg-[#22416D] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <LayoutDashboard className={`w-5 h-5 shrink-0 ${activeTab === 'overview' ? 'text-white' : 'text-slate-500'}`} />
                <span className="truncate">Beranda & Ringkasan</span>
              </div>
            </button>
          </div>

          {/* Navigation Section 2: Content Management */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Kelola Konten
            </div>

            {/* Portofolio */}
            <button
              type="button"
              onClick={() => handleSelect('portfolio')}
              className={`w-full flex items-center justify-between gap-3 rounded-xl px-3.5 h-11 text-sm font-semibold transition-colors ${
                isTabActive('portfolio')
                  ? 'bg-[#22416D] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Briefcase className={`w-5 h-5 shrink-0 ${isTabActive('portfolio') ? 'text-white' : 'text-slate-500'}`} />
                <span className="truncate">Portofolio Proyek</span>
              </div>
              <span
                className={`text-xs font-bold font-mono tabular-nums px-2 py-0.5 rounded-full min-w-[1.75rem] text-center shrink-0 ${
                  isTabActive('portfolio') ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {portfolioCount}
              </span>
            </button>

            {/* Artikel Blog */}
            <button
              type="button"
              onClick={() => handleSelect('articles')}
              className={`w-full flex items-center justify-between gap-3 rounded-xl px-3.5 h-11 text-sm font-semibold transition-colors ${
                isTabActive('articles')
                  ? 'bg-[#22416D] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <BookOpen className={`w-5 h-5 shrink-0 ${isTabActive('articles') ? 'text-white' : 'text-slate-500'}`} />
                <span className="truncate">Artikel & Berita</span>
              </div>
              <span
                className={`text-xs font-bold font-mono tabular-nums px-2 py-0.5 rounded-full min-w-[1.75rem] text-center shrink-0 ${
                  isTabActive('articles') ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {articleCount}
              </span>
            </button>

            {/* Bio Link (Linktree) */}
            <button
              type="button"
              onClick={() => handleSelect('biolink')}
              className={`w-full flex items-center justify-between gap-3 rounded-xl px-3.5 h-11 text-sm font-semibold transition-colors ${
                activeTab === 'biolink'
                  ? 'bg-[#22416D] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Link2 className={`w-5 h-5 shrink-0 ${activeTab === 'biolink' ? 'text-white' : 'text-slate-500'}`} />
                <span className="truncate">Bio Link (Linktree)</span>
              </div>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                  activeTab === 'biolink' ? 'bg-white/20 text-white' : 'bg-blue-50 text-[#22416D]'
                }`}
              >
                Baru
              </span>
            </button>
          </div>

          {/* Navigation Section 3: Settings & Tools */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Sistem & Pengaturan
            </div>

            <button
              type="button"
              onClick={() => handleSelect('redirects')}
              className={`w-full flex items-center justify-between gap-3 rounded-xl px-3.5 h-11 text-sm font-semibold transition-colors ${
                activeTab === 'redirects'
                  ? 'bg-[#22416D] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Shuffle className={`w-5 h-5 shrink-0 ${activeTab === 'redirects' ? 'text-white' : 'text-slate-500'}`} />
                <span className="truncate">Pengalihan Tautan (301)</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSelect('settings')}
              className={`w-full flex items-center justify-between gap-3 rounded-xl px-3.5 h-11 text-sm font-semibold transition-colors ${
                activeTab === 'settings'
                  ? 'bg-[#22416D] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Settings className={`w-5 h-5 shrink-0 ${activeTab === 'settings' ? 'text-white' : 'text-slate-500'}`} />
                <span className="truncate">Pengaturan & Publikasi</span>
              </div>
            </button>
          </div>
        </div>

        {/* Sidebar Footer: Website link & Status */}
        <div className="space-y-2 pt-4 border-t border-slate-200/80 shrink-0">
          <a
            href="https://binaproject.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full px-3.5 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-800 transition-colors shadow-xs"
          >
            <span className="flex items-center gap-2 truncate">
              <span className="w-2.5 h-2.5 shrink-0 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
              <span className="truncate">Buka Website Asli</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 shrink-0 text-slate-400" />
          </a>

          <div className="rounded-xl bg-slate-50/90 p-3 text-xs space-y-1 shadow-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Sistem Siap Digunakan</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Auto-kompresi gambar & SEO aktif otomatis.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
