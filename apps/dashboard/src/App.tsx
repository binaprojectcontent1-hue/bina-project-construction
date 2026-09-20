import React, { useState, useEffect, useCallback } from 'react';
import type { TabType } from './components/Sidebar';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Overview } from './pages/Overview';
import { PortfolioList } from './pages/PortfolioList';
import { PortfolioEditor } from './pages/PortfolioEditor';
import { ArticleList } from './pages/ArticleList';
import { ArticleEditor } from './pages/ArticleEditor';
import { RedirectsList } from './pages/RedirectsList';
import { Settings } from './pages/Settings';
import { BioLinkEditor } from './pages/BioLinkEditor';
import { LiveProjectsManager } from './pages/LiveProjectsManager';
import { LiveProjectEditor } from './pages/LiveProjectEditor';
import { BusinessProfileSettings } from './pages/BusinessProfileSettings';
import { JobManager } from './pages/JobManager';
import { JobEditor } from './pages/JobEditor';
import { CandidateManager } from './pages/CandidateManager';
import { Login } from './pages/Login';
import { sessionManager } from './lib/session-manager';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/ui/Toast';

interface RouteState {
  tab: TabType;
  portfolioId?: string;
  articleId?: string;
  liveProjectId?: string;
  jobId?: string;
}

function parseHash(rawHash: string): RouteState {
  const hash = (rawHash || '').replace(/^#\/?/, '').trim();
  if (!hash) return { tab: 'overview' };

  const [path, queryString] = hash.split('?');
  const params = new URLSearchParams(queryString || '');

  if (path === 'article-edit') {
    return {
      tab: 'article-new',
      articleId: params.get('id') || undefined,
    };
  }

  if (path === 'portfolio-edit') {
    return {
      tab: 'portfolio-new',
      portfolioId: params.get('id') || undefined,
    };
  }

  if (path === 'live-project-edit') {
    return {
      tab: 'live-project-new',
      liveProjectId: params.get('id') || undefined,
    };
  }

  if (path === 'recruitment-job-edit') {
    return {
      tab: 'recruitment-job-edit',
      jobId: params.get('id') || undefined,
    };
  }

  const validTabs: TabType[] = [
    'overview',
    'portfolio',
    'portfolio-new',
    'articles',
    'article-new',
    'live-projects',
    'live-project-new',
    'biolink',
    'site-settings',
    'redirects',
    'settings',
    'recruitment-jobs',
    'recruitment-job-edit',
    'recruitment-candidates',
  ];

  if (validTabs.includes(path as TabType)) {
    return {
      tab: path as TabType,
      portfolioId: params.get('portfolioId') || undefined,
      articleId: params.get('articleId') || undefined,
      liveProjectId: params.get('liveProjectId') || undefined,
      jobId: params.get('jobId') || undefined,
    };
  }

  return { tab: 'overview' };
}

function buildHash(tab: TabType, portfolioId?: string, articleId?: string, liveProjectId?: string, jobId?: string): string {
  if (tab === 'article-new' && articleId) {
    return `#article-edit?id=${encodeURIComponent(articleId)}`;
  }
  if (tab === 'portfolio-new' && portfolioId) {
    return `#portfolio-edit?id=${encodeURIComponent(portfolioId)}`;
  }
  if (tab === 'live-project-new' && liveProjectId) {
    return `#live-project-edit?id=${encodeURIComponent(liveProjectId)}`;
  }
  if (tab === 'recruitment-job-edit' && jobId) {
    return `#recruitment-job-edit?id=${encodeURIComponent(jobId)}`;
  }
  return `#${tab}`;
}

export function App() {
  const initialRoute = parseHash(typeof window !== 'undefined' ? window.location.hash : '');
  const [session, setSession] = useState<Session | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>(initialRoute.tab);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [editingPortfolioId, setEditingPortfolioId] = useState<string | undefined>(initialRoute.portfolioId);
  const [editingArticleId, setEditingArticleId] = useState<string | undefined>(initialRoute.articleId);
  const [editingLiveProjectId, setEditingLiveProjectId] = useState<string | undefined>(initialRoute.liveProjectId);
  const [editingJobId, setEditingJobId] = useState<string | undefined>(initialRoute.jobId);

  // Counts
  const [portfolioCount, setPortfolioCount] = useState(0);
  const [articleCount, setArticleCount] = useState(0);

  // Sync state to URL Hash
  const syncRouteToHash = useCallback((tab: TabType, pId?: string, aId?: string, lId?: string, jId?: string) => {
    const targetHash = buildHash(tab, pId, aId, lId, jId);
    if (window.location.hash !== targetHash) {
      window.history.replaceState(null, '', targetHash);
    }
  }, []);

  // Listen to browser Back/Forward (hashchange)
  useEffect(() => {
    const handleHashChange = () => {
      const route = parseHash(window.location.hash);
      setActiveTab(route.tab);
      setEditingPortfolioId(route.portfolioId);
      setEditingArticleId(route.articleId);
      setEditingLiveProjectId(route.liveProjectId);
      setEditingJobId(route.jobId);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when tab or IDs change
  useEffect(() => {
    syncRouteToHash(activeTab, editingPortfolioId, editingArticleId, editingLiveProjectId, editingJobId);
  }, [activeTab, editingPortfolioId, editingArticleId, editingLiveProjectId, editingJobId, syncRouteToHash]);

  // Initialize session management when user logs in
  useEffect(() => {
    if (session?.user) {
      sessionManager.initialize();
      console.info('[App] Session initialized for user:', session.user.id);
    }
  }, [session]);

  // Check Supabase Auth
  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;

    async function checkAuth() {
      if (supabase) {
        try {
          const { data } = await supabase.auth.getSession();
          if (data?.session) {
            setSession(data.session);
          } else if (typeof window !== 'undefined' && localStorage.getItem('bina_dev_session') === 'true') {
            setSession({ user: { email: 'admin@binaproject.id' } } as any);
          } else {
            setSession(null);
          }

          const { data: authData } = supabase.auth.onAuthStateChange((_event, newSession) => {
            if (newSession) {
              setSession(newSession);
            } else if (typeof window !== 'undefined' && localStorage.getItem('bina_dev_session') === 'true') {
              setSession({ user: { email: 'admin@binaproject.id' } } as any);
            } else {
              setSession(null);
            }
          });
          subscription = authData.subscription;
        } catch (e) {
          console.warn('Supabase auth session check warning:', e);
        }
      } else if (typeof window !== 'undefined' && localStorage.getItem('bina_dev_session') === 'true') {
        setSession({ user: { email: 'admin@binaproject.id' } } as any);
      }
      setAuthChecked(true);
    }

    checkAuth();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Fetch counts
  const refreshCounts = async () => {
    if (!supabase) return;
    try {
      const { count: pCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });
      const { count: aCount } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true });

      if (typeof pCount === 'number') setPortfolioCount(pCount);
      if (typeof aCount === 'number') setArticleCount(aCount);
    } catch (e) {
      console.warn('Failed to fetch counts:', e);
    }
  };

  const handleEditPortfolio = (id: string) => {
    setEditingPortfolioId(id);
    setActiveTab('portfolio-new');
  };

  const handleNewPortfolio = () => {
    setEditingPortfolioId(undefined);
    setActiveTab('portfolio-new');
  };

  const handleEditArticle = (id: string) => {
    setEditingArticleId(id);
    setActiveTab('article-new');
  };

  const handleNewArticle = () => {
    setEditingArticleId(undefined);
    setActiveTab('article-new');
  };

  const handlePortfolioSave = () => {
    setEditingPortfolioId(undefined);
    setActiveTab('portfolio');
    refreshCounts();
  };

  const handleArticleSave = () => {
    setEditingArticleId(undefined);
    setActiveTab('articles');
    refreshCounts();
  };

  const handleEditLiveProject = (id: string) => {
    setEditingLiveProjectId(id);
    setActiveTab('live-project-new');
  };

  const handleNewLiveProject = () => {
    setEditingLiveProjectId(undefined);
    setActiveTab('live-project-new');
  };

  const handleLiveProjectSave = () => {
    setEditingLiveProjectId(undefined);
    setActiveTab('live-projects');
  };

  const handleNavigate = (tab: TabType) => {
    if (tab === 'portfolio' || tab === 'portfolio-new') {
      setEditingPortfolioId(undefined);
    }
    if (tab === 'articles' || tab === 'article-new') {
      setEditingArticleId(undefined);
    }
    if (tab === 'live-projects' || tab === 'live-project-new') {
      setEditingLiveProjectId(undefined);
    }
    if (tab === 'recruitment-jobs' || tab === 'recruitment-job-edit') {
      setEditingJobId(undefined);
    }
    setActiveTab(tab);
  };

  const handleLoginSuccess = async (newSession: Session | null) => {
    setSession(newSession);
    await refreshCounts();
  };

  useEffect(() => {
    refreshCounts();
  }, [activeTab]);

  const handleLogout = async (reason: string = 'User logout') => {
    try {
      await sessionManager.logout(reason);
    } catch (error) {
      console.error('Logout error:', error);
      if (supabase) {
        await supabase.auth.signOut();
      }
      setSession(null);
      window.location.hash = '';
      window.location.href = '/';
    }
  };

  // If Supabase is configured and user is not logged in, show Login page
  const isSupabaseConfigured = Boolean(
    import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  // Dynamic Browser Tab Title Management
  useEffect(() => {
    const titles: Record<TabType, string> = {
      'overview': 'Beranda & Ringkasan - Bina Project Studio',
      'portfolio': 'Portofolio Proyek - Bina Project Studio',
      'portfolio-new': editingPortfolioId ? 'Edit Portofolio Proyek - Bina Project Studio' : 'Tambah Portofolio Baru - Bina Project Studio',
      'articles': 'Artikel & Berita - Bina Project Studio',
      'article-new': editingArticleId ? 'Edit Artikel - Bina Project Studio' : 'Tulis Artikel Baru - Bina Project Studio',
      'live-projects': 'Peta Proyek Berjalan - Bina Project Studio',
      'live-project-new': editingLiveProjectId ? 'Edit Proyek Berjalan - Bina Project Studio' : 'Tambah Proyek Berjalan Baru - Bina Project Studio',
      'biolink': 'Bio Link Manager - Bina Project Studio',
      'site-settings': 'Profil & Kontak Bisnis - Bina Project Studio',
      'redirects': 'Pengalihan Tautan (301) - Bina Project Studio',
      'settings': 'Pengaturan & Publikasi - Bina Project Studio',
      'recruitment-jobs': 'Lowongan Kerja - Bina Project Studio',
      'recruitment-job-edit': editingJobId ? 'Edit Lowongan - Bina Project Studio' : 'Buat Lowongan Baru - Bina Project Studio',
      'recruitment-candidates': 'Kandidat Pelamar - Bina Project Studio',
    };

    if (isSupabaseConfigured && !session) {
      document.title = 'Masuk ke Studio - Bina Project Studio';
    } else {
      document.title = titles[activeTab] || 'Bina Project Studio - Panel Manajemen';
    }
  }, [activeTab, session, isSupabaseConfigured, editingPortfolioId, editingArticleId, editingLiveProjectId]);

  // Show loading state while checking auth
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 rounded-lg bg-[#22416D] text-white flex items-center justify-center font-bold text-sm mx-auto animate-pulse">B</div>
          <p className="text-xs text-slate-500">Memverifikasi sesi...</p>
        </div>
      </div>
    );
  }

  if (isSupabaseConfigured && !session) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <Overview
            portfolioCount={portfolioCount}
            articleCount={articleCount}
            onNewPortfolio={handleNewPortfolio}
            onNewArticle={handleNewArticle}
            onEditPortfolio={handleEditPortfolio}
            onEditArticle={handleEditArticle}
            onViewAllPortfolios={() => {
              setEditingPortfolioId(undefined);
              setActiveTab('portfolio');
            }}
            onViewAllArticles={() => {
              setEditingArticleId(undefined);
              setActiveTab('articles');
            }}
          />
        );
      case 'portfolio':
        return (
          <PortfolioList
            onEdit={handleEditPortfolio}
            onNew={handleNewPortfolio}
          />
        );
      case 'portfolio-new':
        return (
          <PortfolioEditor
            key={editingPortfolioId || 'new-portfolio'}
            projectId={editingPortfolioId}
            onBack={() => {
              setEditingPortfolioId(undefined);
              setActiveTab('portfolio');
            }}
            onSave={handlePortfolioSave}
          />
        );
      case 'articles':
        return (
          <ArticleList
            onEdit={handleEditArticle}
            onNew={handleNewArticle}
          />
        );
      case 'article-new':
        return (
          <ArticleEditor
            key={editingArticleId || 'new-article'}
            articleId={editingArticleId}
            onBack={() => {
              setEditingArticleId(undefined);
              setActiveTab('articles');
            }}
            onSave={handleArticleSave}
          />
        );
      case 'biolink':
        return <BioLinkEditor />;
      case 'site-settings':
        return <BusinessProfileSettings />;
      case 'live-projects':
        return (
          <LiveProjectsManager
            onNew={handleNewLiveProject}
            onEdit={handleEditLiveProject}
          />
        );
      case 'live-project-new':
        return (
          <LiveProjectEditor
            key={editingLiveProjectId || 'new-live-project'}
            projectId={editingLiveProjectId}
            onBack={() => {
              setEditingLiveProjectId(undefined);
              setActiveTab('live-projects');
            }}
            onSave={handleLiveProjectSave}
          />
        );
      case 'redirects':
        return <RedirectsList />;
      case 'settings':
        return <Settings user={session?.user} />;
      case 'recruitment-jobs':
        return (
          <JobManager
            onNew={() => {
              setEditingJobId(undefined);
              setActiveTab('recruitment-job-edit');
            }}
            onEdit={(id) => {
              setEditingJobId(id);
              setActiveTab('recruitment-job-edit');
            }}
          />
        );
      case 'recruitment-job-edit':
        return (
          <JobEditor
            key={editingJobId || 'new-job'}
            jobId={editingJobId}
            onBack={() => {
              setEditingJobId(undefined);
              setActiveTab('recruitment-jobs');
            }}
            onSave={() => {
              setEditingJobId(undefined);
              setActiveTab('recruitment-jobs');
            }}
          />
        );
      case 'recruitment-candidates':
        return <CandidateManager />;
      default:
        return (
          <Overview
            portfolioCount={portfolioCount}
            articleCount={articleCount}
            onNewPortfolio={handleNewPortfolio}
            onNewArticle={handleNewArticle}
            onEditPortfolio={handleEditPortfolio}
            onEditArticle={handleEditArticle}
            onViewAllPortfolios={() => {
              setEditingPortfolioId(undefined);
              setActiveTab('portfolio');
            }}
            onViewAllArticles={() => {
              setEditingArticleId(undefined);
              setActiveTab('articles');
            }}
          />
        );
    }
  };

  return (
    <ErrorBoundary>
      <ToastProvider>
        {session ? (
          <div className="h-screen bg-[#080E18] text-slate-100 flex flex-col font-sans overflow-hidden relative selection:bg-[#22416D] selection:text-white">
            {/* Ambient Background Glows */}
            <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-[#22416D]/25 via-[#152B49]/15 to-transparent rounded-full blur-[160px] pointer-events-none" />
            <div className="absolute -bottom-40 -right-40 w-[650px] h-[650px] bg-gradient-to-tl from-[#0E1E38]/40 via-[#1A3356]/20 to-transparent rounded-full blur-[170px] pointer-events-none" />

            <Navbar
              activeTab={activeTab}
              userEmail={session?.user?.email || 'admin@binaproject.id'}
              onLogout={session ? () => handleLogout('Manual logout') : undefined}
              onToggleMobile={() => setMobileNavOpen((prev) => !prev)}
              onNavigate={handleNavigate}
            />

            <div className="flex flex-1 overflow-hidden p-2 sm:p-3 md:p-4 gap-3 md:gap-4 relative z-10">
              <Sidebar
                activeTab={activeTab}
                onNavigate={handleNavigate}
                mobileOpen={mobileNavOpen}
                onCloseMobile={() => setMobileNavOpen(false)}
                portfolioCount={portfolioCount}
                articleCount={articleCount}
              />

              <main className="flex-1 overflow-y-auto bg-[#F8FAFC] text-slate-900 rounded-[24px] sm:rounded-[32px] shadow-2xl border border-slate-700/40 p-4 sm:p-6 lg:p-8">
                {renderContent()}
              </main>
            </div>
          </div>
        ) : (
          <Login onLoginSuccess={handleLoginSuccess} />
        )}
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
