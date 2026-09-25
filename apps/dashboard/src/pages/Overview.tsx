import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  BookOpen,
  Plus,
  ArrowRight,
  Edit3,
  CheckCircle2,
  RefreshCw,
  FolderPlus,
  PenTool,
  MapPin,
  Users,
  Link2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { resolveDashboardMediaUrl } from '../lib/media';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';

interface OverviewProps {
  onNewPortfolio: () => void;
  onNewArticle: () => void;
  onEditPortfolio: (id: string) => void;
  onEditArticle: (id: string) => void;
  onViewAllPortfolios: () => void;
  onViewAllArticles: () => void;
  portfolioCount: number;
  articleCount: number;
}

export const Overview: React.FC<OverviewProps> = ({
  onNewPortfolio,
  onNewArticle,
  onEditPortfolio,
  onEditArticle,
  onViewAllPortfolios,
  onViewAllArticles,
}) => {
  const [portfolioCount, setPortfolioCount] = useState(0);
  const [portfolioPublishedCount, setPortfolioPublishedCount] = useState(0);
  const [articleCount, setArticleCount] = useState(0);
  const [articlePublishedCount, setArticlePublishedCount] = useState(0);
  const [liveProjectsCount, setLiveProjectsCount] = useState(0);
  const [candidatesCount, setCandidatesCount] = useState(0);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [recentArticles, setRecentArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (supabase) {
        // Portfolio counts
        const { count: pCount } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true });
        const { count: pPubCount } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'published');

        // Article counts
        const { count: aCount } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true });
        const { count: aPubCount } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'published');

        // Live projects count
        const { count: lpCount } = await supabase
          .from('live_projects')
          .select('*', { count: 'exact', head: true });

        // Candidates count
        const { count: cCount } = await supabase
          .from('candidates')
          .select('*', { count: 'exact', head: true });

        if (typeof pCount === 'number') setPortfolioCount(pCount);
        if (typeof pPubCount === 'number') setPortfolioPublishedCount(pPubCount);
        if (typeof aCount === 'number') setArticleCount(aCount);
        if (typeof aPubCount === 'number') setArticlePublishedCount(aPubCount);
        if (typeof lpCount === 'number') setLiveProjectsCount(lpCount);
        if (typeof cCount === 'number') setCandidatesCount(cCount);

        // Recent 4 projects
        const { data: pData } = await supabase
          .from('projects')
          .select('id, title, category, status, cover_image, created_at, location')
          .order('created_at', { ascending: false })
          .limit(4);
        if (pData) setRecentProjects(pData);

        // Recent 4 articles
        const { data: aData } = await supabase
          .from('articles')
          .select('id, title, category, status, cover_image, created_at, publish_date')
          .order('created_at', { ascending: false })
          .limit(4);
        if (aData) setRecentArticles(aData);
      }
    } catch (e) {
      console.warn('Failed to load overview data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const todayFormatted = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="space-y-6">
      {/* 1. Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
            Ringkasan Studio
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {todayFormatted} • Pusat manajemen portofolio, artikel edukasi, dan operasional website Bina Project.
          </p>
        </div>

        {/* Primary Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            title="Segarkan Data"
            className="text-slate-600"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onNewArticle}
            className="text-slate-800"
          >
            <PenTool className="w-3.5 h-3.5 text-[#1B365D]" />
            <span>Tulis Artikel</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={onNewPortfolio}
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>Tambah Proyek</span>
          </Button>
        </div>
      </div>

      {/* 2. Real-Data KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Portfolio */}
        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-4 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Portofolio Proyek
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1B365D] flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              {loading ? (
                <Skeleton className="h-8 w-14" />
              ) : (
                <span className="text-2xl font-semibold text-slate-900 font-mono tabular-nums">
                  {portfolioCount}
                </span>
              )}
              <span className="text-xs text-slate-500 font-medium">total karya</span>
            </div>
            <div className="mt-2.5 text-xs text-slate-600 flex items-center gap-2">
              <Badge variant="success" className="text-[11px] py-0 px-1.5">
                {portfolioPublishedCount} Live
              </Badge>
              {portfolioCount - portfolioPublishedCount > 0 && (
                <span className="text-slate-400 text-xs font-medium">
                  {portfolioCount - portfolioPublishedCount} Draft
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* KPI 2: Articles */}
        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-4 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Artikel & Berita
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1B365D] flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              {loading ? (
                <Skeleton className="h-8 w-14" />
              ) : (
                <span className="text-2xl font-semibold text-slate-900 font-mono tabular-nums">
                  {articleCount}
                </span>
              )}
              <span className="text-xs text-slate-500 font-medium">total naskah</span>
            </div>
            <div className="mt-2.5 text-xs text-slate-600 flex items-center gap-2">
              <Badge variant="success" className="text-[11px] py-0 px-1.5">
                {articlePublishedCount} Live
              </Badge>
              {articleCount - articlePublishedCount > 0 && (
                <span className="text-slate-400 text-xs font-medium">
                  {articleCount - articlePublishedCount} Draft
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* KPI 3: Live Projects Map */}
        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-4 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Proyek Lapangan
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              {loading ? (
                <Skeleton className="h-8 w-14" />
              ) : (
                <span className="text-2xl font-semibold text-slate-900 font-mono tabular-nums">
                  {liveProjectsCount}
                </span>
              )}
              <span className="text-xs text-slate-500 font-medium">titik peta aktif</span>
            </div>
            <div className="mt-2.5 text-xs text-emerald-700 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Transparansi progress klien</span>
            </div>
          </CardContent>
        </Card>

        {/* KPI 4: Recruitment & Candidates */}
        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-4 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Karir & Pelamar
              </span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              {loading ? (
                <Skeleton className="h-8 w-14" />
              ) : (
                <span className="text-2xl font-semibold text-slate-900 font-mono tabular-nums">
                  {candidatesCount}
                </span>
              )}
              <span className="text-xs text-slate-500 font-medium">berkas masuk</span>
            </div>
            <div className="mt-2.5 text-xs text-purple-700 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <span>Database talent studio</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Dual Recent Data Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Recent Portfolios */}
        <Card>
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#1B365D]" />
              <h2 className="text-sm font-semibold text-slate-900">
                Portofolio Proyek Terbaru
              </h2>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onViewAllPortfolios}
              className="text-xs text-slate-600 gap-1 h-7 px-2"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>

          <div className="p-3">
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="p-2 rounded-lg border border-slate-100 flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-md shrink-0" />
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-3.5 w-2/3" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentProjects.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <p className="text-xs font-semibold text-slate-700">Belum ada data portofolio</p>
                <Button variant="outline" size="sm" onClick={onNewPortfolio}>
                  + Tambah Proyek
                </Button>
              </div>
            ) : (
              <div className="space-y-1.5">
                {recentProjects.map((p) => {
                  const img = resolveDashboardMediaUrl(p.cover_image);
                  return (
                    <div
                      key={p.id}
                      className="p-2.5 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-md bg-slate-100 overflow-hidden shrink-0 border border-slate-200/60">
                          {img ? (
                            <img src={img} alt={p.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <Briefcase className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-xs font-semibold text-slate-900 group-hover:text-[#1B365D] transition-colors truncate">
                            {p.title}
                          </h3>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            <span className="font-medium text-[#1B365D]">
                              {p.category}
                            </span>
                            <span>•</span>
                            <span className="truncate">{p.location || 'Jawa Timur'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Badge
                          variant={p.status === 'published' ? 'success' : 'secondary'}
                          className="text-[10px] py-0 px-1.5"
                        >
                          {p.status === 'published' ? 'Live' : 'Draft'}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditPortfolio(p.id)}
                          className="h-7 px-2 text-xs"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                          <span className="hidden sm:inline">Edit</span>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Card>

        {/* Right: Recent Articles */}
        <Card>
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#1B365D]" />
              <h2 className="text-sm font-semibold text-slate-900">
                Artikel & Berita Terbaru
              </h2>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onViewAllArticles}
              className="text-xs text-slate-600 gap-1 h-7 px-2"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>

          <div className="p-3">
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="p-2 rounded-lg border border-slate-100 flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-md shrink-0" />
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-3.5 w-2/3" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentArticles.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <p className="text-xs font-semibold text-slate-700">Belum ada naskah artikel</p>
                <Button variant="outline" size="sm" onClick={onNewArticle}>
                  + Tulis Artikel
                </Button>
              </div>
            ) : (
              <div className="space-y-1.5">
                {recentArticles.map((a) => {
                  const img = resolveDashboardMediaUrl(a.cover_image);
                  return (
                    <div
                      key={a.id}
                      className="p-2.5 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-md bg-slate-100 overflow-hidden shrink-0 border border-slate-200/60">
                          {img ? (
                            <img src={img} alt={a.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <BookOpen className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-xs font-semibold text-slate-900 group-hover:text-[#1B365D] transition-colors truncate">
                            {a.title}
                          </h3>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            <span className="font-medium text-[#1B365D]">
                              {a.category}
                            </span>
                            <span>•</span>
                            <span className="truncate">
                              {a.publish_date
                                ? new Date(a.publish_date).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })
                                : 'Draft'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Badge
                          variant={a.status === 'published' ? 'success' : 'secondary'}
                          className="text-[10px] py-0 px-1.5"
                        >
                          {a.status === 'published' ? 'Live' : 'Draft'}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditArticle(a.id)}
                          className="h-7 px-2 text-xs"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                          <span className="hidden sm:inline">Edit</span>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
