import React from 'react';
import {
  LayoutDashboard,
  Briefcase,
  BookOpen,
  Shuffle,
  Settings,
  FolderPlus,
  PenTool,
  ExternalLink,
  Link2,
  MapPin,
  Building2,
  Users,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
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
  | 'live-project-new'
  | 'recruitment-jobs'
  | 'recruitment-job-edit'
  | 'recruitment-candidates';

interface SidebarProps {
  activeTab: TabType;
  onNavigate: (tab: TabType) => void;
  portfolioCount?: number;
  articleCount?: number;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onNavigate,
  portfolioCount = 0,
  articleCount = 0,
  mobileOpen = false,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const handleSelect = (tab: TabType) => {
    onNavigate(tab);
    if (onCloseMobile) onCloseMobile();
  };

  const isTabActive = (tab: TabType) => {
    if (tab === 'portfolio' && activeTab === 'portfolio-new') return true;
    if (tab === 'articles' && activeTab === 'article-new') return true;
    if (tab === 'live-projects' && activeTab === 'live-project-new') return true;
    if (tab === 'recruitment-jobs' && activeTab === 'recruitment-job-edit') return true;
    return activeTab === tab;
  };

  const navItems = [
    {
      group: 'Utama',
      items: [
        {
          id: 'overview' as TabType,
          label: 'Beranda',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      group: 'Konten Website',
      items: [
        {
          id: 'portfolio' as TabType,
          label: 'Portofolio',
          icon: Briefcase,
          count: portfolioCount,
        },
        {
          id: 'live-projects' as TabType,
          label: 'Proyek Berjalan',
          icon: MapPin,
        },
        {
          id: 'articles' as TabType,
          label: 'Artikel & Berita',
          icon: BookOpen,
          count: articleCount,
        },
        {
          id: 'biolink' as TabType,
          label: 'Bio Link',
          icon: Link2,
          badge: 'Aktif',
        },
        {
          id: 'site-settings' as TabType,
          label: 'Profil Bisnis',
          icon: Building2,
        },
      ],
    },
    {
      group: 'Rekrutmen',
      items: [
        {
          id: 'recruitment-jobs' as TabType,
          label: 'Lowongan Kerja',
          icon: Briefcase,
        },
        {
          id: 'recruitment-candidates' as TabType,
          label: 'Kandidat Pelamar',
          icon: Users,
        },
      ],
    },
    {
      group: 'Pengaturan',
      items: [
        {
          id: 'redirects' as TabType,
          label: 'Pengalihan Tautan',
          icon: Shuffle,
        },
        {
          id: 'settings' as TabType,
          label: 'Pengaturan & Publikasi Web',
          icon: Settings,
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen bg-white border-r border-slate-200 flex flex-col justify-between select-none transition-all duration-300 ease-in-out ${
          isCollapsed ? 'md:w-16 w-64' : 'w-64'
        } ${
          mobileOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Header & Workspace Brand */}
        <div className="flex flex-col min-h-0 flex-1">
          <div className="h-14 border-b border-slate-200 flex items-center justify-between px-3.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-lg bg-[#1B365D] text-white font-semibold flex items-center justify-center shrink-0 text-sm shadow-xs">
                B
              </div>
              {(!isCollapsed || mobileOpen) && (
                <div className="min-w-0 flex-1">
                  <h2 className="text-xs font-semibold text-slate-900 truncate leading-tight">
                    Bina Project Studio
                  </h2>
                  <span className="text-[11px] font-medium text-slate-500 truncate block">
                    Panel Manajemen
                  </span>
                </div>
              )}
            </div>

            {/* Mobile close button */}
            {mobileOpen && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 md:hidden"
                aria-label="Tutup Menu"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Quick Create Action (Only in expanded view) */}
          {(!isCollapsed || mobileOpen) && (
            <div className="p-3 border-b border-slate-100 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSelect('portfolio-new')}
                className={`flex items-center justify-center gap-1.5 h-8 px-2.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'portfolio-new'
                    ? 'bg-[#1B365D] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
                title="Tambah Proyek Baru"
              >
                <FolderPlus className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">+ Proyek</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelect('article-new')}
                className={`flex items-center justify-center gap-1.5 h-8 px-2.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'article-new'
                    ? 'bg-[#1B365D] text-white shadow-xs'
                    : 'border border-slate-200 hover:bg-slate-50 text-slate-800'
                }`}
                title="Tulis Artikel Baru"
              >
                <PenTool className="w-3.5 h-3.5 shrink-0 text-[#1B365D]" />
                <span className="truncate">+ Artikel</span>
              </button>
            </div>
          )}

          {/* Navigation Items List */}
          <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
            {navItems.map((group) => (
              <div key={group.group} className="space-y-1">
                {(!isCollapsed || mobileOpen) && (
                  <div className="px-2.5 pb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    {group.group}
                  </div>
                )}
                {group.items.map((item) => {
                  const active = isTabActive(item.id);
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelect(item.id)}
                      title={isCollapsed && !mobileOpen ? item.label : undefined}
                      className={`w-full flex items-center ${
                        isCollapsed && !mobileOpen
                          ? 'justify-center h-10 px-0'
                          : 'justify-between h-9 px-2.5'
                      } rounded-md text-xs font-semibold transition-all cursor-pointer group ${
                        active
                          ? 'bg-[#1B365D] text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            active
                              ? 'text-white'
                              : 'text-slate-500 group-hover:text-slate-900'
                          }`}
                        />
                        {(!isCollapsed || mobileOpen) && (
                          <span className="truncate">{item.label}</span>
                        )}
                      </div>

                      {(!isCollapsed || mobileOpen) && (
                        <div>
                          {typeof item.count === 'number' && (
                            <span
                              className={`text-[11px] font-mono tabular-nums px-1.5 py-0.5 rounded-sm ${
                                active
                                  ? 'bg-white/20 text-white'
                                  : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                              }`}
                            >
                              {item.count}
                            </span>
                          )}
                          {item.badge && (
                            <span
                              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-sm ${
                                active
                                  ? 'bg-white/20 text-white'
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Footer & Collapse Toggle */}
        <div className="p-2 border-t border-slate-200 space-y-2 bg-slate-50/60">
          {(!isCollapsed || mobileOpen) && (
            <a
              href="https://binaproject.id"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full px-2.5 h-8 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
            >
              <span className="flex items-center gap-1.5 truncate">
                <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-emerald-500" />
                <span className="truncate">Web Publik</span>
              </span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            </a>
          )}

          {/* Desktop Collapse Button */}
          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className={`hidden md:flex items-center justify-center w-full h-8 rounded-md border border-slate-200 bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors text-xs font-medium cursor-pointer ${
                isCollapsed ? 'px-0' : 'gap-2 px-2'
              }`}
              title={isCollapsed ? 'Buka Sidebar' : 'Ciutkan Sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <>
                  <ChevronLeft className="w-4 h-4" />
                  <span className="text-[11px]">Ciutkan Menu</span>
                </>
              )}
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
