import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  MapPin,
  RefreshCw,
  Eye,
  EyeOff,
  CheckCircle2,
  Building2,
  Clock,
  AlertCircle,
  Copy,
  Check,
  Globe,
  ImageIcon,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Skeleton } from '../components/ui/skeleton';
import { useToast } from '../components/ui/Toast';
import { resolveDashboardMediaUrl } from '../lib/media';
import { FALLBACK_LIVE_PROJECTS } from '../../../../src/data/liveProjects';

export interface LiveProjectRecord {
  id: string;
  title: string;
  area_name: string;
  category: 'Konstruksi' | 'Renovasi' | 'Interior' | 'Arsitektur';
  stage: string;
  progress: number;
  lat: number;
  lng: number;
  image_url?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface LiveProjectsManagerProps {
  onNew?: () => void;
  onEdit?: (id: string) => void;
}

export function LiveProjectsManager({ onNew, onEdit }: LiveProjectsManagerProps) {
  const [projects, setProjects] = useState<LiveProjectRecord[]>(FALLBACK_LIVE_PROJECTS as any);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [isTableMissing, setIsTableMissing] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toast = useToast();

  const fetchProjects = async () => {
    setLoading(true);
    setIsTableMissing(false);
    try {
      if (!supabase) {
        setProjects(FALLBACK_LIVE_PROJECTS as any);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('live_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          setIsTableMissing(true);
          setProjects(FALLBACK_LIVE_PROJECTS as any);
        } else {
          throw error;
        }
      } else if (data && data.length > 0) {
        setProjects(data as LiveProjectRecord[]);
      } else {
        setProjects(FALLBACK_LIVE_PROJECTS as any);
      }
    } catch (err: any) {
      console.warn('Using fallback data for live projects:', err?.message);
      setProjects(FALLBACK_LIVE_PROJECTS as any);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleToggleActive = async (proj: LiveProjectRecord) => {
    const newStatus = !proj.is_active;
    const oldStatus = proj.is_active;

    setProjects((prev) =>
      prev.map((item) => (item.id === proj.id ? { ...item, is_active: newStatus } : item))
    );

    try {
      if (supabase && !isTableMissing) {
        const { error } = await supabase
          .from('live_projects')
          .update({ is_active: newStatus, updated_at: new Date().toISOString() })
          .eq('id', proj.id);

        if (error) throw error;
      }

      toast.success(
        `Status Diperbarui: ${newStatus ? 'Aktif di Peta' : 'Arsip'}`,
        `Proyek "${proj.title}" sekarang ${newStatus ? 'ditampilkan di' : 'disembunyikan dari'} peta publik.`
      );
    } catch (err: any) {
      setProjects((prev) =>
        prev.map((item) => (item.id === proj.id ? { ...item, is_active: oldStatus } : item))
      );
      toast.error('Gagal Mengubah Status', err?.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (supabase && !isTableMissing) {
        const { error } = await supabase.from('live_projects').delete().eq('id', id);
        if (error) throw error;
      }

      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success('Proyek Dihapus', 'Data proyek berhasil dihapus.');
      setDeletingId(null);
    } catch (err: any) {
      toast.error('Gagal Menghapus Proyek', err?.message);
    }
  };

  const handleCopySql = () => {
    const migrationSql = `-- Migration: 20260914_live_projects.sql
create table if not exists public.live_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  area_name text not null,
  category text not null default 'Konstruksi',
  stage text not null,
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  lat double precision not null,
  lng double precision not null,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_live_projects_active on public.live_projects(is_active) where is_active = true;
alter table public.live_projects enable row level security;
create policy "Public can view active live projects" on public.live_projects for select using (is_active = true);
create policy "Authenticated users have full access to live projects" on public.live_projects for all using (auth.role() = 'authenticated');`;

    navigator.clipboard.writeText(migrationSql);
    setCopiedSql(true);
    toast.success('SQL Disalin!', 'Salin dan jalankan di SQL Editor Supabase.');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  // Filtered dataset
  const filteredProjects = projects.filter((p) => {
    const matchSearch =
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.area_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.stage?.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && p.is_active) ||
      (statusFilter === 'archived' && !p.is_active);

    return matchSearch && matchCat && matchStatus;
  });

  // Calculate stats
  const activeCount = projects.filter((p) => p.is_active).length;
  const archivedCount = projects.filter((p) => !p.is_active).length;
  const totalSaved = projects.length;
  const avgProgress =
    totalSaved > 0
      ? Math.round(projects.reduce((acc, curr) => acc + curr.progress, 0) / totalSaved)
      : 0;

  return (
    <div className="space-y-6 pb-10">
      {/* Missing table banner */}
      {isTableMissing && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-amber-900">Tabel `live_projects` belum dibuat di Supabase Remote</p>
              <p className="text-amber-700 mt-0.5">
                Dashboard saat ini menampilkan data starter lokal. Jalankan SQL migration untuk sinkronisasi penuh.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            pill
            variant="outline"
            onClick={handleCopySql}
            className="text-xs font-bold border-amber-300 text-amber-900 hover:bg-amber-100 shrink-0 gap-1.5 bg-white"
          >
            {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSql ? 'Tersalin' : 'Salin SQL Migration'}</span>
          </Button>
        </div>
      )}

      {/* Page Header (Unified Theme) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
            Peta Proyek Berjalan
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Kelola titik sebaran proyek aktif dan progres lapangan yang tampil di peta publik website.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={onNew}
            pill
            className="gap-2 shadow-xs bg-[#22416D] hover:bg-[#1A3356] text-white font-bold h-10 px-5 text-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Proyek Baru</span>
          </Button>
        </div>
      </div>

      {/* Stats Metric Cards Row (Unified Theme) */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5 shadow-sm rounded-[24px] border-0 bg-white hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-600">Total Proyek Berjalan</p>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 font-mono tabular-nums">
            {loading ? <Skeleton className="h-8 w-16 my-0.5 rounded-lg" /> : totalSaved}
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">Aktif maupun arsip tersimpan</p>
        </Card>

        <Card className="p-5 shadow-sm rounded-[24px] border-0 bg-white hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-600">Rata-rata Progres</p>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight text-amber-600 font-mono tabular-nums">
            {loading ? <Skeleton className="h-8 w-16 my-0.5 rounded-lg" /> : `${avgProgress}%`}
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">Akumulasi pengerjaan lapangan</p>
        </Card>

        <Card className="p-5 shadow-sm rounded-[24px] border-0 bg-white hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-600">Tayang di Peta Website</p>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight text-emerald-600 font-mono tabular-nums">
            {loading ? <Skeleton className="h-8 w-16 my-0.5 rounded-lg" /> : activeCount}
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">Tampil pada halaman peta publik</p>
        </Card>
      </div>

      {/* Filter Toolbar (Unified Theme) */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3.5 rounded-[28px] border-0 shadow-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <div className="relative w-full sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              pill
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari proyek, kawasan, tahap..."
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
              onClick={() => setStatusFilter('active')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'active'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusFilter === 'active' ? 'bg-white' : 'bg-emerald-500'}`} />
              Aktif ({activeCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('archived')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'archived'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusFilter === 'archived' ? 'bg-white' : 'bg-amber-500'}`} />
              Arsip ({archivedCount})
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
            <option value="Renovasi">Renovasi</option>
            <option value="Interior">Interior</option>
            <option value="Arsitektur">Arsitektur</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-slate-200 rounded-full p-1 bg-slate-50">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tabel
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer ${
                viewMode === 'cards' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kartu
            </button>
          </div>
        </div>
      </div>

      {/* Loading Skeletons */}
      {loading ? (
        <Card className="p-6 rounded-[28px] border-0 bg-white space-y-4 shadow-sm">
          <Skeleton className="h-6 w-48 rounded-lg" />
          <div className="space-y-3">
            <Skeleton className="h-14 w-full rounded-2xl" />
            <Skeleton className="h-14 w-full rounded-2xl" />
            <Skeleton className="h-14 w-full rounded-2xl" />
          </div>
        </Card>
      ) : filteredProjects.length === 0 ? (
        <Card className="p-12 text-center space-y-4 rounded-[28px] border-0 bg-white shadow-sm">
          <Globe className="w-12 h-12 text-slate-300 mx-auto" />
          <div>
            <h4 className="text-base font-bold text-slate-800">Tidak ada proyek yang sesuai</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              {search || categoryFilter !== 'all' || statusFilter !== 'all'
                ? 'Coba ubah filter pencarian atau status kategori Anda.'
                : 'Mulai tambahkan titik sebaran proyek baru untuk ditampilkan pada peta publik website.'}
            </p>
          </div>
          <Button onClick={onNew} pill size="sm" className="text-xs font-bold bg-[#22416D] hover:bg-[#1A3356] text-white px-5 cursor-pointer">
            Tambah Proyek Baru
          </Button>
        </Card>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW (With 1:1 image thumbnails) */
        <Card className="overflow-hidden shadow-sm rounded-[28px] border-0 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-100 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Proyek & Dokumentasi (1:1)</th>
                  <th className="py-3.5 px-4">Kategori</th>
                  <th className="py-3.5 px-4">Kawasan Lapangan</th>
                  <th className="py-3.5 px-4">Progres Pekerjaan</th>
                  <th className="py-3.5 px-4 text-center">Status di Peta</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProjects.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3.5">
                        {item.image_url ? (
                          <img
                            src={resolveDashboardMediaUrl(item.image_url)}
                            alt={item.title}
                            className="w-12 h-12 rounded-xl object-cover aspect-square bg-slate-100 flex-shrink-0 shadow-2xs border border-slate-200"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl aspect-square bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 flex-shrink-0">
                            <ImageIcon className="w-5 h-5 text-slate-300" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate max-w-xs">{item.title}</p>
                          <p className="text-xs text-slate-500 truncate max-w-xs font-medium mt-0.5">
                            {item.stage}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#22416D] border border-blue-200/60">
                        {item.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 text-xs font-medium">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate max-w-[150px]">{item.area_name}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="w-36 space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-500 font-medium">Progres:</span>
                          <span className="font-mono font-extrabold text-amber-600">{item.progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(item)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                          item.is_active
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                        }`}
                        title="Klik untuk tampilkan/sembunyikan di peta website"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${item.is_active ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span>{item.is_active ? 'Aktif' : 'Arsip'}</span>
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onEdit && onEdit(item.id)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-[#22416D] hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Edit Proyek"
                          aria-label={`Edit ${item.title}`}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingId(item.id)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Hapus Proyek"
                          aria-label={`Hapus ${item.title}`}
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
        /* CARD GRID VIEW (Unified with 1:1 image thumbnails) */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden shadow-sm rounded-[24px] border-0 bg-white hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* 1:1 Ratio Thumbnail Box */}
                <div className="relative w-full aspect-square bg-slate-100 overflow-hidden">
                  {item.image_url ? (
                    <img
                      src={resolveDashboardMediaUrl(item.image_url)}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1">
                      <ImageIcon className="w-8 h-8 text-slate-300" />
                      <span className="text-xs font-medium">Belum ada foto</span>
                    </div>
                  )}
                  <span className="absolute top-3 left-3 text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#22416D] text-white shadow-sm">
                    {item.category}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggleActive(item)}
                    className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm backdrop-blur-md cursor-pointer transition-all ${
                      item.is_active
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-600 text-white'
                    }`}
                  >
                    {item.is_active ? '● Aktif di Peta' : '○ Arsip'}
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{item.area_name}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border-0 space-y-1.5">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-500 font-medium">Tahap:</span>
                      <span className="font-mono font-extrabold text-amber-600">{item.progress}%</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800 line-clamp-1">
                      {item.stage}
                    </p>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
                <span className="text-[11px] text-slate-400 font-medium">
                  Privasi: koordinat disembunyikan
                </span>
                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit && onEdit(item.id)}
                    className="h-8 px-2.5 text-xs text-slate-600 hover:text-[#22416D] gap-1 cursor-pointer font-bold"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setDeletingId(item.id)}
                    className="h-8 px-2.5 text-xs text-rose-500 hover:text-rose-700 hover:bg-rose-50 gap-1 cursor-pointer font-bold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-[28px] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-600">
              <span className="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
                <Trash2 className="w-6 h-6" />
              </span>
              <h3 className="text-lg font-bold text-slate-900">Konfirmasi Hapus Proyek</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus data proyek ini? Data yang dihapus tidak dapat dipulihkan kembali.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeletingId(null)}
                className="rounded-full border-slate-300 text-slate-700 font-semibold px-4 cursor-pointer"
              >
                Batal
              </Button>
              <Button
                size="sm"
                onClick={() => handleDelete(deletingId)}
                className="rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 cursor-pointer"
              >
                Hapus Permanen
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
