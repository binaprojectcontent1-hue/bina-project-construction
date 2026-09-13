import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  BookOpen,
  Plus,
  ExternalLink,
  Globe,
  Clock,
  Sparkles,
  ArrowRight,
  Edit3,
  CheckCircle2,
  RefreshCw,
  TrendingUp,
  FolderPlus,
  PenTool,
  Shuffle,
  MapPin,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { resolveDashboardMediaUrl } from '../lib/media';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

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
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [recentArticles, setRecentArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (supabase) {
        // Counts
        const { count: pCount } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true });
        const { count: aCount } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true });

        const { count: pPubCount } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'published');

        const { count: aPubCount } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'published');

        if (typeof pCount === 'number') setPortfolioCount(pCount);
        if (typeof aCount === 'number') setArticleCount(aCount);
        if (typeof pPubCount === 'number') setPortfolioPublishedCount(pPubCount);
        if (typeof aPubCount === 'number') setArticlePublishedCount(aPubCount);

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
    <div className="space-y-6 pb-12">
      {/* 1. Executive Header (Compact, High-Hierarchy & Functional) */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
              Selamat Datang di Studio 👋
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Sistem Publikasi Normal
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-500 font-medium">
            {todayFormatted} • Pantau portofolio bangunan dan naskah artikel edukasi Bina Project.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={fetchData}
            title="Segarkan Data"
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors shadow-2xs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={onNewArticle}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors shadow-2xs"
          >
            <PenTool className="w-3.5 h-3.5 text-[#22416D]" />
            <span>+ Tulis Artikel</span>
          </button>

          <button
            type="button"
            onClick={onNewPortfolio}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#22416D] hover:bg-[#1A3356] text-white text-xs font-bold transition-colors shadow-xs"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>+ Tambah Proyek</span>
          </button>
        </div>
      </div>

      {/* 2. 4-Grid Balanced KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Portfolio */}
        <Card className="p-5 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Portofolio Proyek</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#22416D] flex items-center justify-center shadow-2xs">
              <Briefcase className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono tabular-nums">
              {portfolioCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">total proyek</span>
          </div>
          <div className="mt-2 text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>{portfolioPublishedCount} Tayang Live</span>
            {portfolioCount - portfolioPublishedCount > 0 && (
              <span className="text-slate-400 font-normal">• {portfolioCount - portfolioPublishedCount} Draft</span>
            )}
          </div>
        </Card>

        {/* KPI 2: Articles */}
        <Card className="p-5 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Artikel & Edukasi</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#22416D] flex items-center justify-center shadow-2xs">
              <BookOpen className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono tabular-nums">
              {articleCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">total naskah</span>
          </div>
          <div className="mt-2 text-xs text-[#22416D] font-semibold flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-[#22416D] flex-shrink-0" />
            <span>{articlePublishedCount} Live Google</span>
            {articleCount - articlePublishedCount > 0 && (
              <span className="text-slate-400 font-normal">• {articleCount - articlePublishedCount} Draft</span>
            )}
          </div>
        </Card>

        {/* KPI 3: Server Status */}
        <Card className="p-5 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Server Publikasi</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-2xs">
              <Globe className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-700 tracking-tight">100% Online</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
            <span>Cloudflare Edge Global</span>
          </div>
        </Card>

        {/* KPI 4: 301 Redirect Protection */}
        <Card className="p-5 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Proteksi URL (301)</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#22416D] flex items-center justify-center shadow-2xs">
              <Shuffle className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">Aktif Aman</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 font-medium flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>Anti Broken Link Otomatis</span>
          </div>
        </Card>
      </div>

      {/* 3. Two Column Section: Recent Projects & Recent Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Column 1: Recent Projects */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 flex flex-col overflow-hidden">
          {/* Card Header Bar */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50/50">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#22416D] flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                <Briefcase className="w-4 h-4 text-[#22416D]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                    Portofolio Proyek Terkini
                  </h2>
                  <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700">
                    {portfolioCount}
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate">
                  Dokumentasi karya arsitektur & interior terbaru
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={onViewAllPortfolios}
              className="text-xs font-semibold h-8 px-3 gap-1.5 text-slate-700 hover:text-[#22416D] hover:bg-slate-100/80 rounded-lg shrink-0 border-slate-200"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Card Body */}
          <div className="p-4 md:p-5 flex-1 flex flex-col justify-between">
            {recentProjects.length === 0 ? (
              <div className="my-auto py-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#22416D] flex items-center justify-center mx-auto shadow-2xs">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900">Belum Ada Portofolio</p>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                    Unggah karya pertama Anda untuk menampilkan portofolio Bina Project.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onNewPortfolio}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#22416D] hover:bg-[#1A3356] transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Proyek Pertama</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentProjects.map((p) => {
                  const img = resolveDashboardMediaUrl(p.cover_image);
                  return (
                    <div
                      key={p.id}
                      className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/80 hover:shadow-xs transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 shadow-2xs border border-slate-100">
                          {img ? (
                            <img src={img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <Briefcase className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-slate-900 group-hover:text-[#22416D] transition-colors truncate">
                            {p.title}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                            <span className="font-semibold text-[#22416D] bg-blue-50 px-2 py-0.5 rounded-md text-[11px]">
                              {p.category}
                            </span>
                            <span>•</span>
                            <span className="truncate flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {p.location || 'Jawa Timur'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            p.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {p.status === 'published' ? 'Live' : 'Draft'}
                        </span>
                        <button
                          type="button"
                          onClick={() => onEditPortfolio(p.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-[#22416D] hover:border-[#22416D] hover:text-white transition-all shadow-2xs"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Recent Articles */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 flex flex-col overflow-hidden">
          {/* Card Header Bar */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50/50">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#22416D] flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                <BookOpen className="w-4 h-4 text-[#22416D]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                    Artikel Blog Terkini
                  </h2>
                  <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700">
                    {articleCount}
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate">
                  Naskah artikel & tips edukasi yang tayang di web
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={onViewAllArticles}
              className="text-xs font-semibold h-8 px-3 gap-1.5 text-slate-700 hover:text-[#22416D] hover:bg-slate-100/80 rounded-lg shrink-0 border-slate-200"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Card Body */}
          <div className="p-4 md:p-5 flex-1 flex flex-col justify-between">
            {recentArticles.length === 0 ? (
              <div className="my-auto py-10 text-center space-y-3.5">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#22416D] flex items-center justify-center mx-auto shadow-2xs">
                  <PenTool className="w-5 h-5 text-[#22416D]" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900">Belum Ada Artikel yang Diterbitkan</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Tulis tips renovasi atau panduan arsitektur untuk meningkatkan ranking website Bina Project di Google dan memikat calon klien.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onNewArticle}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#22416D] hover:bg-[#1A3356] transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tulis Artikel Pertama</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentArticles.map((a) => {
                  const img = resolveDashboardMediaUrl(a.cover_image);
                  return (
                    <div
                      key={a.id}
                      className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/80 hover:shadow-xs transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 shadow-2xs border border-slate-100">
                          {img ? (
                            <img src={img} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <BookOpen className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-slate-900 group-hover:text-[#22416D] transition-colors truncate">
                            {a.title}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                            <span className="font-semibold text-[#22416D] bg-blue-50 px-2 py-0.5 rounded-md text-[11px]">
                              {a.category}
                            </span>
                            <span>•</span>
                            <span className="truncate">{a.publish_date || 'Baru'}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onEditArticle(a.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-[#22416D] hover:border-[#22416D] hover:text-white transition-all shadow-2xs shrink-0"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
