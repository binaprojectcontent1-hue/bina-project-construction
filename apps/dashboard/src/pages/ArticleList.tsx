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
  Copy,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { resolveDashboardMediaUrl } from '../lib/media';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Skeleton } from '../components/ui/skeleton';
import { useToast } from '../components/ui/Toast';

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
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const toast = useToast();

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

  const handleToggleStatus = async (a: any) => {
    const newStatus = a.status === 'draft' ? 'published' : 'draft';
    const oldStatus = a.status;
    setArticles((prev) =>
      prev.map((item) => (item.id === a.id ? { ...item, status: newStatus } : item))
    );
    try {
      if (!supabase) return;
      const { error } = await supabase
        .from('articles')
        .update({
          status: newStatus,
          published_at: newStatus === 'published' ? new Date().toISOString() : null,
        })
        .eq('id', a.id);
      if (error) throw error;
      toast.success(
        `Status Diubah: ${newStatus === 'published' ? 'Tayang (Live)' : 'Draft'}`,
        `Artikel "${a.title}" sekarang berstatus ${newStatus === 'published' ? 'Tayang' : 'Draft'}.`
      );
    } catch (err: any) {
      setArticles((prev) =>
        prev.map((item) => (item.id === a.id ? { ...item, status: oldStatus } : item))
      );
      toast.error('Gagal Mengubah Status', err?.message);
    }
  };

  const handleCopyLink = (slug: string) => {
    const url = `https://binaproject.id/blog/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success('Tautan Publik Disalin!', url);
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
    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && (a.status === 'published' || !a.status)) ||
      (statusFilter === 'draft' && a.status === 'draft');
    return matchSearch && matchCat && matchStatus;
  });

  const publishedCount = articles.filter((a) => a.status === 'published' || !a.status).length;
  const draftCount = articles.filter((a) => a.status === 'draft').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            Artikel & Edukasi Desain
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Publikasikan tips arsitektur, panduan renovasi, dan edukasi material untuk calon klien Bina Project.
          </p>
        </div>

        <Button onClick={onNew} size="sm" className="gap-1.5 font-medium">
          <Plus className="w-4 h-4" />
          <span>Tulis Artikel Baru</span>
        </Button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Naskah</span>
            <div className="p-1.5 rounded-md bg-slate-100 text-slate-600">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-semibold text-slate-900 mt-2 font-mono tabular-nums">
            {loading ? <Skeleton className="h-7 w-14 my-0.5" /> : articles.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">Semua artikel terdaftar</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Terpublikasi (Live)</span>
            <div className="p-1.5 rounded-md bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-semibold text-emerald-600 mt-2 font-mono tabular-nums">
            {loading ? <Skeleton className="h-7 w-14 my-0.5" /> : publishedCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">Dapat dibaca publik & terindeks Google</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Draft Naskah</span>
            <div className="p-1.5 rounded-md bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-semibold text-slate-700 mt-2 font-mono tabular-nums">
            {loading ? <Skeleton className="h-7 w-14 my-0.5" /> : draftCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">Masih dalam penyusunan internal</p>
        </Card>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
          <div className="relative w-full sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul artikel, kata kunci..."
              className="pl-9 h-8 text-xs"
            />
          </div>

          {/* Quick Status Filter Tabs */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({articles.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'published'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusFilter === 'published' ? 'bg-white' : 'bg-emerald-500'}`} />
              Tayang ({publishedCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'draft'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusFilter === 'draft' ? 'bg-white' : 'bg-amber-500'}`} />
              Draft ({draftCount})
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-8 px-2.5 text-xs font-medium border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1B365D]/20 shadow-2xs"
          >
            <option value="all">Semua Kategori</option>
            <option value="Interior">Interior</option>
            <option value="Konstruksi">Konstruksi</option>
            <option value="Arsitektur">Arsitektur</option>
            <option value="Tips & Panduan">Tips & Panduan</option>
          </select>

          {/* View switcher */}
          <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-100">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tabel
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                viewMode === 'cards' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kartu
            </button>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={fetchArticles}
            className="h-8 w-8"
            title="Segarkan Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Content Rendering */}
      {loading ? (
        viewMode === 'table' ? (
          <Card className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <tbody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="border-b border-slate-100 last:border-0">
                      <td className="py-3 px-4"><Skeleton className="h-8 w-44 rounded-md" /></td>
                      <td className="py-3 px-4"><Skeleton className="h-4 w-32 rounded-md" /></td>
                      <td className="py-3 px-4"><Skeleton className="h-5 w-24 rounded-md" /></td>
                      <td className="py-3 px-4 text-center"><Skeleton className="h-5 w-16 mx-auto rounded-md" /></td>
                      <td className="py-3 px-4 text-right"><Skeleton className="h-7 w-16 ml-auto rounded-md" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden flex flex-col">
                <Skeleton className="w-full aspect-video" />
                <div className="p-4 space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <div className="pt-2 flex justify-between items-center">
                    <Skeleton className="h-4 w-16 rounded-md" />
                    <Skeleton className="h-4 w-14 rounded-md" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      ) : filteredArticles.length === 0 ? (
        <Card className="p-12 text-center space-y-4">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <div>
            <h4 className="text-sm font-semibold text-slate-800">Tidak ada artikel yang sesuai</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              {search || categoryFilter !== 'all' || statusFilter !== 'all'
                ? 'Coba ubah kata kunci pencarian atau filter status artikel Anda.'
                : 'Mulai buat artikel baru yang kaya informasi dan ramah SEO untuk pembaca.'}
            </p>
          </div>
          <Button onClick={onNew} size="sm">
            Tulis Artikel Baru
          </Button>
        </Card>
      ) : viewMode === 'table' ? (
        /* DATA TABLE VIEW */
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Artikel</th>
                  <th className="py-3.5 px-4 font-semibold">Alamat URL</th>
                  <th className="py-3.5 px-4 font-semibold">Kategori & Waktu</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Aksi</th>
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
                          <p className="font-semibold text-slate-900 truncate max-w-xs">{item.title}</p>
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
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-50 text-[#1B365D]">
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
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(item)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                          item.status === 'published' || !item.status
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                        }`}
                        title="Klik untuk beralih status (Tayang / Draft)"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'published' || !item.status ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span>{item.status === 'published' || !item.status ? 'Tayang' : 'Draft'}</span>
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopyLink(item.slug)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          title="Salin Tautan Publik"
                          aria-label={`Salin tautan artikel ${item.title}`}
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <a
                          href={`https://binaproject.id/blog/${item.slug}`}
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
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-[#1B365D] hover:bg-slate-100 transition-colors"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArticles.map((item) => (
            <Card key={item.id} className="overflow-hidden flex flex-col justify-between group hover:border-slate-300 transition-colors">
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={resolveDashboardMediaUrl(item.cover_image) || '/assets/img/blog/blog_1.jpg'}
                    alt={item.alt_cover_image || item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-900/80 text-white backdrop-blur-xs">
                      {item.category}
                    </span>
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(item)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors shadow-xs ${
                        item.status === 'published' || !item.status
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-white text-amber-800 border border-amber-200 hover:bg-amber-50'
                      }`}
                      title="Klik untuk beralih status Tayang / Draft"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'published' || !item.status ? 'bg-white' : 'bg-amber-500'}`} />
                      <span>{item.status === 'published' || !item.status ? 'Tayang' : 'Draft'}</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {item.publish_date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {item.reading_time || 3} menit
                    </span>
                  </div>

                  <h3 className="font-semibold text-sm text-slate-900 group-hover:text-[#1B365D] transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">
                    {item.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyLink(item.slug)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                    title="Salin Tautan Publik"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href={`https://binaproject.id/blog/${item.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-slate-600 hover:text-[#1B365D] inline-flex items-center gap-1 font-medium"
                  >
                    <span>Lihat di Web</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit && onEdit(item.id)}
                    className="h-8 px-2.5 text-xs"
                  >
                    <Edit3 className="w-3.5 h-3.5 mr-1" />
                    <span>Edit</span>
                  </Button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.title)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
