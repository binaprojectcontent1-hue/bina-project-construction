import React, { useState, useEffect } from 'react';
import type { TabType } from './components/Sidebar';
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
import { Login } from './pages/Login';
import { sessionManager } from './lib/session-manager';
import ErrorBoundary from './components/ErrorBoundary';

export function App() {
  const [session, setSession] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [editingPortfolioId, setEditingPortfolioId] = useState<string | undefined>(undefined);
  const [editingArticleId, setEditingArticleId] = useState<string | undefined>(undefined);

  // Counts
  const [portfolioCount, setPortfolioCount] = useState(0);
  const [articleCount, setArticleCount] = useState(0);

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
          setSession(data?.session || null);

          const { data: authData } = supabase.auth.onAuthStateChange((_event, newSession) => {
            setSession(newSession);
          });
          subscription = authData.subscription;
        } catch (e) {
          console.warn('Supabase auth session check warning:', e);
        }
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

  const handlePortfolioSave = () => {
    setActiveTab('portfolio');
  };

  const handleArticleSave = () => {
    setActiveTab('articles');
  };

  const handleLoginSuccess = async (newSession: any) => {
    setSession(newSession);
    // sessionManager.startSession(newSession.user.id);
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
      window.location.href = '/login';
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
      'portfolio-new': 'Editor Portofolio - Bina Project Studio',
      'articles': 'Artikel & Berita - Bina Project Studio',
      'article-new': 'Editor Artikel - Bina Project Studio',
      'redirects': 'Pengalihan Tautan (301) - Bina Project Studio',
      'settings': 'Pengaturan & Publikasi - Bina Project Studio',
    };

    if (isSupabaseConfigured && !session) {
      document.title = 'Masuk ke Studio - Bina Project Studio';
    } else {
      document.title = titles[activeTab] || 'Bina Project Studio - Panel Manajemen';
    }
  }, [activeTab, session, isSupabaseConfigured]);

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
        return <Overview portfolioCount={portfolioCount} articleCount={articleCount} onNewPortfolio={() => setActiveTab('portfolio-new')} onNewArticle={() => setActiveTab('article-new')} onEditPortfolio={setEditingPortfolioId} onEditArticle={setEditingArticleId} onViewAllPortfolios={() => setActiveTab('portfolio')} onViewAllArticles={() => setActiveTab('articles')} />;
      case 'portfolio':
        return <PortfolioList onEdit={setEditingPortfolioId} />;
        case 'portfolio-new':
          return <PortfolioEditor projectId={undefined} onBack={() => setActiveTab('portfolio')} onSave={handleArticleSave} />;
        case 'articles':
          return <ArticleList onEdit={setEditingArticleId} />;
        case 'article-new':
          return <ArticleEditor articleId={undefined} onBack={() => setActiveTab('articles')} onSave={handleArticleSave} />;
      case 'redirects':
        return <RedirectsList />;
      case 'settings':
        return <Settings user={session?.user} />;
      default:
        return <Overview portfolioCount={portfolioCount} articleCount={articleCount} onNewPortfolio={() => setActiveTab('portfolio-new')} onNewArticle={() => setActiveTab('article-new')} onEditPortfolio={setEditingPortfolioId} onEditArticle={setEditingArticleId} onViewAllPortfolios={() => setActiveTab('portfolio')} onViewAllArticles={() => setActiveTab('articles')} />;
    }
  };

  return (
    <ErrorBoundary>
      {session ? (
        <div className="h-screen bg-[#F8FAFC] flex flex-col font-sans overflow-hidden">
          <Navbar
            activeTab={activeTab}
            userEmail={session?.user?.email || 'admin@binaproject.com'}
            onLogout={session ? () => handleLogout('Manual logout') : undefined}
            onToggleMobile={() => setMobileNavOpen((prev) => !prev)}
          />

          <div className="flex flex-1 overflow-hidden">
            <Sidebar
              activeTab={activeTab}
              onNavigate={setActiveTab}
              mobileOpen={mobileNavOpen}
              onCloseMobile={() => setMobileNavOpen(false)}
              portfolioCount={portfolioCount}
              articleCount={articleCount}
            />

            <main className="flex-1 overflow-y-auto p-6">
              {renderContent()}
            </main>
          </div>
        </div>
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </ErrorBoundary>
  );
}

export default App;
