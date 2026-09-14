import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  ExternalLink,
  Edit3,
  Trash2,
  Globe,
  MapPin,
  RefreshCw,
  LayoutGrid,
  ListFilter,
  CheckCircle2,
  FileText,
  Clock,
  Copy,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { resolveDashboardMediaUrl } from '../lib/media';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Skeleton } from '../components/ui/skeleton';
import { useToast } from '../components/ui/Toast';

interface PortfolioListProps {
  onEdit?: (id: string) => void;
  onNew?: () => void;
  onDelete?: (id: string) => void;
}

export function PortfolioList({ onEdit, onNew, onDelete: onDeleteProp }: PortfolioListProps) {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const toast = useToast();

  const fetchProjects = async () => {
    setLoading(true);
    try {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Yakin ingin menghapus proyek "${title}"?`)) return;

    try {
      if (!supabase) return;
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (onDeleteProp) onDeleteProp(id);
    } catch (err: any) {
      alert('Gagal menghapus proyek: ' + err.message);
    }
  };

  const handleToggleStatus = async (p: any) => {
    const newStatus = p.status === 'draft' ? 'published' : 'draft';
    const oldStatus = p.status;
    setProjects((prev) =>
      prev.map((item) => (item.id === p.id ? { ...item, status: newStatus } : item))
    );
    try {
      if (!supabase) return;
      const { error } = await supabase
        .from('projects')
        .update({
          status: newStatus,
          published_at: newStatus === 'published' ? new Date().toISOString() : null,
        })
        .eq('id', p.id);
      if (error) throw error;
      toast.success(
        `Status Diubah: ${newStatus === 'published' ? 'Tayang (Live)' : 'Draft'}`,
        `Proyek "${p.title}" sekarang berstatus ${newStatus === 'published' ? 'Tayang' : 'Draft'}.`
      );
    } catch (err: any) {
      setProjects((prev) =>
        prev.map((item) => (item.id === p.id ? { ...item, status: oldStatus } : item))
      );
      toast.error('Gagal Mengubah Status', err?.message);
    }
  };

  const handleCopyLink = (slug: string) => {
    const url = `https://binaproject.com/portfolio/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success('Tautan Publik Disalin!', url);
  };

  const handleNew = () => {
    onNew && onNew();
  };

  const filteredProjects = projects.filter((p) => {
    const matchSearch =
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.slug?.toLowerCase().includes(search.toLowerCase()) ||
      p.location?.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && (p.status === 'published' || !p.status)) ||
      (statusFilter === 'draft' && p.status === 'draft');
    return matchSearch && matchCat && matchStatus;
  });

  // Calculate stats
  const publishedCount = projects.filter((p) => p.status === 'published' || !p.status).length;
  const draftCount = projects.filter((p) => p.status === 'draft').length;

  return (
    <div className="space-y-6 pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
            Portofolio & Hasil Karya
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Kelola data realisasi proyek konstruksi, dokumentasi foto, dan tautan halaman website Bina Project.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={onNew} pill className="gap-2 shadow-xs bg-[#22416D] hover:bg-[#1A3356] text-white font-bold h-10 px-5 text-xs">
            <Plus className="w-4 h-4" />
            <span>Tambah Proyek Baru</span>
          </Button>
        </div>
      </div>

      {/* Stats Metric Cards Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5 shadow-sm rounded-[24px] border-0 bg-white hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-600">Total Portofolio</p>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 font-mono tabular-nums">
            {loading ? <Skeleton className="h-8 w-16 my-0.5 rounded-lg" /> : projects.length}
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">Tersimpan di database</p>
        </Card>

        <Card className="p-5 shadow-sm rounded-[24px] border-0 bg-white hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-600">Terpublikasi (Live)</p>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight text-emerald-600 font-mono tabular-nums">
            {loading ? <Skeleton className="h-8 w-16 my-0.5 rounded-lg" /> : publishedCount}
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">Aktif tampil di website publik</p>
        </Card>

        <Card className="p-5 shadow-sm rounded-[24px] border-0 bg-white hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-600">Draft Tersimpan</p>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight text-slate-700 font-mono tabular-nums">
            {loading ? <Skeleton className="h-8 w-16 my-0.5 rounded-lg" /> : draftCount}
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">Belum ditayangkan ke publik</p>
        </Card>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3.5 rounded-[28px] border-0 shadow-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <div className="relative w-full sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              pill
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul proyek, kota lokasi..."
              className="pl-10 text-xs placeholder:text-slate-400 border-slate-200"
            />
          </div>

          {/* Quick Status Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-full">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({projects.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('published')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'published'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusFilter === 'published' ? 'bg-white' : 'bg-emerald-500'}`} />
              Tayang ({publishedCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('draft')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'draft'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusFilter === 'draft' ? 'bg-white' : 'bg-amber-500'}`} />
              Draft ({draftCount})
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-11 px-4 text-xs font-semibold border border-slate-200 rounded-full bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#22416D]/30 shadow-xs"
          >
            <option value="all">Semua Kategori</option>
            <option value="Konstruksi">Konstruksi</option>
            <option value="Eksterior">Eksterior</option>
            <option value="Interior">Interior</option>
            <option value="Kitchen Set">Kitchen Set</option>
            <option value="Renovasi">Renovasi</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-slate-200 rounded-full p-1 bg-slate-50">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tabel
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all ${
                viewMode === 'cards' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kartu
            </button>
          </div>

          <button
            type="button"
            onClick={fetchProjects}
            className="w-10 h-10 flex items-center justify-center border border-slate-200 rounded-full hover:bg-slate-50 text-slate-600 transition-colors shadow-xs cursor-pointer"
            title="Segarkan Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content Rendering: Table vs Cards */}
      {loading ? (
        viewMode === 'table' ? (
          <Card className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <tbody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="border-b border-slate-100 last:border-0">
                      <td className="py-3.5 px-4"><Skeleton className="h-10 w-44 rounded-lg" /></td>
                      <td className="py-3.5 px-4"><Skeleton className="h-4 w-32 rounded-md" /></td>
                      <td className="py-3.5 px-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                      <td className="py-3.5 px-4"><Skeleton className="h-4 w-28 rounded-md" /></td>
                      <td className="py-3.5 px-4 text-center"><Skeleton className="h-6 w-16 mx-auto rounded-full" /></td>
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
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <div className="pt-2 flex justify-between items-center">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-14 rounded-full" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      ) : filteredProjects.length === 0 ? (
        <Card className="p-12 text-center space-y-4 rounded-[28px] border-slate-200/80 bg-white">
          <Globe className="w-12 h-12 text-slate-300 mx-auto" />
          <div>
            <h4 className="text-base font-bold text-slate-800">Tidak ada proyek yang sesuai</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              {search || categoryFilter !== 'all' || statusFilter !== 'all'
                ? 'Coba ubah filter pencarian atau status kategori Anda.'
                : 'Mulai tambahkan proyek baru dengan foto jernih dan deskripsi pengerjaan yang menarik.'}
            </p>
          </div>
          <Button onClick={onNew} pill size="sm" className="text-xs font-bold bg-[#22416D] px-5">
            Tambah Proyek Baru
          </Button>
        </Card>
      ) : viewMode === 'table' ? (
        /* DATA TABLE VIEW */
        <Card className="overflow-hidden shadow-sm rounded-[28px] border-0 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-100 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Proyek</th>
                  <th className="py-3.5 px-4">Alamat Tautan (URL)</th>
                  <th className="py-3.5 px-4">Kategori</th>
                  <th className="py-3.5 px-4">Lokasi</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProjects.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={resolveDashboardMediaUrl(item.cover_image) || '/assets/img/project/1.jpg'}
                          alt={item.alt_cover_image || item.title}
                          className="w-12 h-9 rounded-lg object-cover bg-slate-100 flex-shrink-0 shadow-2xs"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate max-w-xs">{item.title}</p>
                          <p className="text-xs text-slate-500 truncate max-w-xs font-medium">
                            {item.client || 'Klien Bina Project'}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-xs text-slate-600">
                      /portfolio/{item.slug}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-[#22416D]">
                        {item.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 text-xs font-medium">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate max-w-[140px]">{item.location}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(item)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold cursor-pointer transition-all hover:scale-105 active:scale-95 ${
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
                          aria-label={`Salin tautan proyek ${item.title}`}
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <a
                          href={`https://binaproject.com/portfolio/${item.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          title="Buka di Website Asli"
                          aria-label={`Buka portfolio ${item.title} di website publik`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          type="button"
                          onClick={() => onEdit && onEdit(item.id)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-[#22416D] hover:bg-slate-100 transition-colors"
                          title="Edit Proyek"
                          aria-label={`Edit portfolio ${item.title}`}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id, item.title)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                          title="Hapus Proyek"
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
          {filteredProjects.map((item) => (
            <Card key={item.id} className="overflow-hidden flex flex-col justify-between group shadow-sm rounded-[28px] border-0 hover:shadow-md transition-all bg-white">
              <div>
                <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                  <img
                    src={resolveDashboardMediaUrl(item.cover_image) || '/assets/img/project/1.jpg'}
                    alt={item.alt_cover_image || item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-950/80 text-white backdrop-blur-xs">
                      {item.category}
                    </span>
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(item)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-sm ${
                        item.status === 'published' || !item.status
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white/95 text-amber-800 border border-amber-200'
                      }`}
                      title="Klik untuk beralih status Tayang / Draft"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'published' || !item.status ? 'bg-white' : 'bg-amber-500'}`} />
                      <span>{item.status === 'published' || !item.status ? 'Tayang' : 'Draft'}</span>
                    </button>
                  </div>
                </div>

                <div className="p-5 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.location}</span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 line-clamp-1 group-hover:text-[#22416D] transition-colors">
                    {item.title}
                  </h3>
                  <p className="font-mono text-xs text-slate-500">/portfolio/{item.slug}</p>
                </div>
              </div>

              <div className="p-5 pt-0 mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyLink(item.slug)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                    title="Salin Tautan Publik"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href={`https://binaproject.com/portfolio/${item.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-slate-600 hover:text-[#22416D] inline-flex items-center gap-1 font-semibold"
                  >
                    <span>Lihat di Web</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onEdit && onEdit(item.id)}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-700 bg-slate-100 hover:bg-[#22416D] hover:text-white transition-colors cursor-pointer"
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
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
