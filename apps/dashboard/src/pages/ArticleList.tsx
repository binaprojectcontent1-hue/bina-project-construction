import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  ExternalLink,
  Edit3,
  Trash2,
  BookOpen,
  Calendar,
  Clock,
  RefreshCw,
  LayoutGrid,
  Table as TableIcon,
  CheckCircle2,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { resolveDashboardMediaUrl } from '../lib/media';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Skeleton } from '../components/ui/skeleton';

interface ArticleListProps {
  onEdit?: (id: string) => void;
  onNew?: () => void;
  onDelete?: (id: string) => void;
}

export function ArticleList({ onEdit, onNew, onDelete: onDeleteProp }: ArticleListProps) {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');

  const fetchArticles = async () => {
    setLoading(true);
    try {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (err) {
      console.error('Failed to fetch articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Yakin ingin menghapus artikel "${title}"?`)) return;

    try {
      if (!supabase) return;
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (error) throw error;
      setArticles((prev) => prev.filter((a) => a.id !== id));
      if (onDeleteProp) onDeleteProp(id);
    } catch (err: any) {
      alert('Gagal menghapus artikel: ' + err.message);
    }
  };

  const handleNew = () => {
    onNew && onNew();
  };

  const filteredArticles = articles.filter((a) => {
    const matchSearch =
      a.title?.toLowerCase().includes(search.toLowerCase()) ||
      a.slug?.toLowerCase().includes(search.toLowerCase()) ||
      a.focus_keyword?.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'all' || a.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const publishedCount = articles.filter((a) => a.status === 'published').length;
  const draftCount = articles.filter((a) => a.status === 'draft').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
            Artikel & Edukasi Desain
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Publikasikan tips arsitektur, panduan renovasi, dan edukasi material untuk calon klien Bina Project.
          </p>
        </div>

        <Button onClick={onNew} className="gap-2 shadow-xs bg-[#22416D] hover:bg-[#1A3356] text-white font-bold h-10 px-4 text-xs">
          <Plus className="w-4 h-4" />
          <span>Tulis Artikel Baru</span>
        </Button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 shadow-sm rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-600">Total Naskah</span>
            <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{articles.length}</div>
          <p className="text-xs text-slate-500 mt-1 font-medium">Semua artikel terdaftar</p>
        </Card>

        <Card className="p-5 shadow-sm rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-600">Terpublikasi (Live)</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 mt-2">{publishedCount}</div>
          <p className="text-xs text-slate-500 mt-1 font-medium">Dapat dibaca publik & terindeks Google</p>
        </Card>

        <Card className="p-5 shadow-sm rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-600">Draft Naskah</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-700 mt-2">{draftCount}</div>
          <p className="text-xs text-slate-500 mt-1 font-medium">Masih dalam penyusunan internal</p>
        </Card>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl shadow-sm">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul artikel, topik, atau kata kunci..."
            className="pl-9.5 h-10 text-sm border-slate-200"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 px-3.5 text-xs font-semibold border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-950 shadow-xs"
          >
            <option value="all">Semua Kategori</option>
            <option value="Interior">Interior</option>
            <option value="Konstruksi">Konstruksi</option>
            <option value="Arsitektur">Arsitektur</option>
            <option value="Tips & Panduan">Tips & Panduan</option>
          </select>

          {/* View switcher */}
          <div className="flex items-center border border-slate-200 rounded-lg p-1 bg-slate-50">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tabel
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                viewMode === 'cards' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kartu
            </button>
          </div>

          <button
            type="button"
            onClick={fetchArticles}
            title="Segarkan Data"
            className="h-10 w-10 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-xs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content Rendering */}
      {loading ? (
        viewMode === 'table' ? (
          <Card className="overflow-hidden shadow-sm rounded-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-100 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Artikel & Ringkasan</th>
                    <th className="py-3.5 px-4">Alamat URL</th>
                    <th className="py-3.5 px-4">Kategori & Waktu</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i}>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3.5">
                          <Skeleton className="w-12 h-9 rounded-lg flex-shrink-0" />
                          <div className="space-y-1.5 flex-1">
                            <Skeleton className="h-4 w-44" />
                            <Skeleton className="h-3 w-28" />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4"><Skeleton className="h-3.5 w-32" /></td>
                      <td className="py-3.5 px-4"><Skeleton className="h-5 w-20 rounded-full" /></td>
                      <td className="py-3.5 px-4 text-center"><Skeleton className="h-5 w-16 mx-auto rounded-full" /></td>
                      <td className="py-3.5 px-4 text-right"><Skeleton className="h-8 w-16 ml-auto rounded-md" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden shadow-sm rounded-2xl flex flex-col">
                <Skeleton className="w-full aspect-video" />
                <div className="p-4 space-y-2.5 flex-1">
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-3 w-3/5" />
                  <div className="pt-2 flex justify-between items-center">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-14 rounded-full" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      ) : filteredArticles.length === 0 ? (
        <Card className="p-12 text-center space-y-4 rounded-xl">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-slate-800">Belum ada artikel yang ditemukan</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Mulai tulis artikel pertama dengan mudah menggunakan editor visual tanpa tag HTML.
            </p>
          </div>
          <Button onClick={onNew} className="text-xs font-bold bg-[#22416D]">
            Tulis Artikel Baru
          </Button>
        </Card>
      ) : viewMode === 'table' ? (
        /* DATA TABLE VIEW */
        <Card className="overflow-hidden shadow-sm rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-100 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Artikel & Ringkasan</th>
                  <th className="py-3.5 px-4">Alamat URL</th>
                  <th className="py-3.5 px-4">Kategori & Waktu</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredArticles.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={resolveDashboardMediaUrl(item.cover_image) || '/assets/img/blog/blog_1.jpg'}
                          alt={item.alt_cover_image || item.title}
                          className="w-14 h-10 rounded-lg object-cover bg-slate-100 flex-shrink-0 shadow-2xs"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate max-w-xs">{item.title}</p>
                          <p className="text-xs text-slate-500 truncate max-w-xs font-normal mt-0.5">
                            {item.excerpt}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <code className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        /blog/{item.slug}
                      </code>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-[#22416D]">
                          {item.category}
                        </span>
                        <div className="flex items-center gap-2 text-slate-400 text-xs">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {item.publish_date}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {item.reading_time || 3}m
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          item.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.status === 'published' ? '🟢 Live' : '📝 Draft'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`https://binaproject.com/blog/${item.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          title="Buka Halaman Publik"
                          aria-label={`Buka artikel ${item.title} di website publik`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          type="button"
                          onClick={() => onEdit && onEdit(item.id)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit Artikel"
                          aria-label={`Edit artikel ${item.title}`}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id, item.title)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Hapus Artikel"
                          aria-label={`Hapus artikel ${item.title}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        /* CARD GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredArticles.map((item) => (
            <Card key={item.id} className="overflow-hidden flex flex-col justify-between group shadow-sm rounded-2xl hover:shadow-md transition-all">
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={resolveDashboardMediaUrl(item.cover_image) || '/assets/img/blog/blog_1.jpg'}
                    alt={item.alt_cover_image || item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-950/80 text-white backdrop-blur-xs">
                      {item.category}
                    </span>
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold backdrop-blur-xs ${
                        item.status === 'published'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white/90 text-slate-800 shadow-xs'
                      }`}
                    >
                      {item.status === 'published' ? '🟢 Live' : '📝 Draft'}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {item.publish_date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {item.reading_time || 3} menit
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 group-hover:text-[#22416D] transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">
                    {item.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href={`https://binaproject.com/blog/${item.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#22416D] hover:underline"
                  >
                    <span>Lihat di Web</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onEdit && onEdit(item.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-[#22416D] hover:text-white transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id, item.title)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
