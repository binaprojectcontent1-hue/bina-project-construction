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
  X,
  Building2,
  Clock,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Skeleton } from '../components/ui/skeleton';
import { useToast } from '../components/ui/Toast';
import { LocationPickerMap } from '../components/LocationPickerMap';
import { liveProjectFormSchema, type LiveProjectFormData } from '../schemas/liveProjectSchema';

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

const DEFAULT_FORM_DATA: LiveProjectFormData = {
  title: '',
  area_name: '',
  category: 'Konstruksi',
  stage: '',
  progress: 50,
  lat: -7.9780,
  lng: 112.6300,
  image_url: '',
  is_active: true,
};

const STARTER_FALLBACK_PROJECTS: LiveProjectRecord[] = [
  {
    id: 'starter-1',
    title: 'Pembangunan Rumah Tinggal Modern 2 Lantai',
    area_name: 'Araya, Kota Malang',
    category: 'Konstruksi',
    stage: 'Pengecoran Plat Lantai 2 & Struktur Kolom',
    progress: 65,
    lat: -7.9350,
    lng: 112.6580,
    image_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?q=80&w=800&auto=format&fit=crop',
    is_active: true,
  },
  {
    id: 'starter-2',
    title: 'Renovasi Total Fasad & Interior Villa',
    area_name: 'Bumiaji, Kota Batu',
    category: 'Renovasi',
    stage: 'Pemasangan Finishing Plafon & Rangka Atap',
    progress: 80,
    lat: -7.8500,
    lng: 112.5350,
    image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
    is_active: true,
  },
  {
    id: 'starter-3',
    title: 'Fabrikasi & Instalasi Kitchen Set Minimalis',
    area_name: 'Klojen, Kota Malang',
    category: 'Interior',
    stage: 'Finishing Duco & Fitting Hardware Slow-Motion',
    progress: 90,
    lat: -7.9780,
    lng: 112.6300,
    image_url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop',
    is_active: true,
  },
  {
    id: 'starter-4',
    title: 'Pembangunan Ruko & Kantor Bisnis 3 Lantai',
    area_name: 'Warugunung, Surabaya Barat',
    category: 'Konstruksi',
    stage: 'Pekerjaan Struktur Bawah & Pondasi Footplate',
    progress: 35,
    lat: -7.3400,
    lng: 112.6900,
    image_url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop',
    is_active: true,
  },
];

export function LiveProjectsManager() {
  const [projects, setProjects] = useState<LiveProjectRecord[]>(STARTER_FALLBACK_PROJECTS);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('all');
  const [isTableMissing, setIsTableMissing] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<LiveProjectRecord | null>(null);
  const [formData, setFormData] = useState<LiveProjectFormData>(DEFAULT_FORM_DATA);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Delete State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toast = useToast();

  const fetchProjects = async () => {
    setLoading(true);
    try {
      if (!supabase) {
        setProjects(STARTER_FALLBACK_PROJECTS);
        return;
      }

      const { data, error } = await supabase
        .from('live_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.message?.includes('does not exist') || error.code === '42P01') {
          setIsTableMissing(true);
          setProjects(STARTER_FALLBACK_PROJECTS);
          return;
        }
        throw error;
      }

      setIsTableMissing(false);
      setProjects(data && data.length > 0 ? data : STARTER_FALLBACK_PROJECTS);
    } catch (err: any) {
      console.warn('Live projects load fallback:', err);
      setProjects(STARTER_FALLBACK_PROJECTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenAddModal = () => {
    setEditingProject(null);
    setFormData(DEFAULT_FORM_DATA);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (proj: LiveProjectRecord) => {
    setEditingProject(proj);
    setFormData({
      title: proj.title,
      area_name: proj.area_name,
      category: proj.category,
      stage: proj.stage,
      progress: proj.progress,
      lat: proj.lat,
      lng: proj.lng,
      image_url: proj.image_url || '',
      is_active: proj.is_active,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setFormData(DEFAULT_FORM_DATA);
    setFormErrors({});
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const validationResult = liveProjectFormSchema.safeParse(formData);
    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      });
      setFormErrors(fieldErrors);
      toast.error('Validasi Gagal', 'Mohon lengkapi kolom input yang ditandai merah.');
      return;
    }

    setIsSaving(true);
    try {
      if (supabase && !isTableMissing) {
        if (editingProject) {
          const { error } = await supabase
            .from('live_projects')
            .update({
              ...validationResult.data,
              image_url: validationResult.data.image_url || null,
              updated_at: new Date().toISOString(),
            })
            .eq('id', editingProject.id);

          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('live_projects')
            .insert([
              {
                ...validationResult.data,
                image_url: validationResult.data.image_url || null,
              },
            ]);

          if (error) throw error;
        }
        await fetchProjects();
      } else {
        // Fallback local state update
        if (editingProject) {
          setProjects((prev) =>
            prev.map((p) =>
              p.id === editingProject.id
                ? { ...p, ...validationResult.data, image_url: validationResult.data.image_url || null }
                : p
            )
          );
        } else {
          const newRecord: LiveProjectRecord = {
            id: 'local-' + Date.now(),
            ...validationResult.data,
            image_url: validationResult.data.image_url || null,
            created_at: new Date().toISOString(),
          };
          setProjects((prev) => [newRecord, ...prev]);
        }
      }

      toast.success(
        editingProject ? 'Perubahan Disimpan' : 'Proyek Ditambahkan',
        'Data proyek berjalan berhasil diperbarui.'
      );
      handleCloseModal();
    } catch (err: any) {
      console.error('Save error:', err);
      toast.error('Gagal Menyimpan', err?.message || 'Terjadi kesalahan saat menyimpan data.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (proj: LiveProjectRecord) => {
    const nextState = !proj.is_active;

    // Optimistic UI update
    setProjects((prev) =>
      prev.map((p) => (p.id === proj.id ? { ...p, is_active: nextState } : p))
    );

    if (supabase && !isTableMissing) {
      try {
        const { error } = await supabase
          .from('live_projects')
          .update({ is_active: nextState, updated_at: new Date().toISOString() })
          .eq('id', proj.id);

        if (error) throw error;
      } catch (err: any) {
        console.warn('Toggle sync error:', err);
      }
    }

    toast.success(
      nextState ? 'Proyek Diaktifkan' : 'Proyek Diarsipkan',
      nextState
        ? `Titik "${proj.title}" kini aktif dan tampil di peta website.`
        : `Titik "${proj.title}" disembunyikan dari peta publik.`
    );
  };

  const handleDelete = async (id: string) => {
    if (supabase && !isTableMissing) {
      try {
        const { error } = await supabase.from('live_projects').delete().eq('id', id);
        if (error) throw error;
      } catch (err: any) {
        console.warn('Delete sync error:', err);
      }
    }
    setProjects((prev) => prev.filter((p) => p.id !== id));
    toast.success('Proyek Dihapus', 'Data proyek berhasil dihapus.');
    setDeletingId(null);
  };

  // Filtered List
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.area_name.toLowerCase().includes(search.toLowerCase()) ||
      p.stage.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === 'all' || p.category.toLowerCase() === categoryFilter.toLowerCase();

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && p.is_active) ||
      (statusFilter === 'archived' && !p.is_active);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const activeCount = projects.filter((p) => p.is_active).length;
  const avgProgress =
    activeCount > 0
      ? Math.round(
          projects.filter((p) => p.is_active).reduce((acc, p) => acc + p.progress, 0) / activeCount
        )
      : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Header Section (Matching PortfolioList Light Theme) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
              <MapPin className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Peta Proyek Berjalan
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                Kelola titik sebaran proyek aktif dan progres lapangan yang tampil di peta publik website.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchProjects}
            className="rounded-full border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-xs h-10 px-4 font-semibold"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Segarkan
          </Button>

          <Button
            size="sm"
            onClick={handleOpenAddModal}
            className="rounded-full bg-[#22416D] hover:bg-[#1A3356] text-white font-bold shadow-md shadow-[#22416D]/20 h-10 px-5"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Proyek
          </Button>
        </div>
      </div>

      {/* Migration Notice Banner if Supabase table not created yet */}
      {isTableMissing && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs sm:text-sm font-bold">Tabel database Supabase siap dimigrasi</p>
              <p className="text-xs text-amber-700 mt-0.5">
                File migrasi SQL telah tersedia di <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono font-bold">supabase/migrations/20260914_live_projects.sql</code>. Data saat ini aktif menggunakan starter dataset lokal.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText('supabase/migrations/20260914_live_projects.sql');
              setCopiedSql(true);
              setTimeout(() => setCopiedSql(false), 2000);
            }}
            className="shrink-0 rounded-full border-amber-300 bg-white text-amber-800 hover:bg-amber-100 text-xs font-semibold"
          >
            {copiedSql ? <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
            {copiedSql ? 'Tersalin' : 'Salin Path SQL'}
          </Button>
        </div>
      )}

      {/* Metrics Row (Matching PortfolioList 24px rounded cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 shadow-xs rounded-[24px] border border-slate-200/80 bg-white">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-600">Proyek Aktif di Peta</p>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <Eye className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 font-mono tabular-nums">
            {loading ? <Skeleton className="h-8 w-16 my-0.5 rounded-lg" /> : `${activeCount} Proyek`}
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">Tampil di peta publik website</p>
        </Card>

        <Card className="p-5 shadow-xs rounded-[24px] border border-slate-200/80 bg-white">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-600">Rata-rata Progres</p>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight text-amber-600 font-mono tabular-nums">
            {loading ? <Skeleton className="h-8 w-16 my-0.5 rounded-lg" /> : `${avgProgress}%`}
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">Akumulasi pengerjaan lapangan</p>
        </Card>

        <Card className="p-5 shadow-xs rounded-[24px] border border-slate-200/80 bg-white">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-600">Total Data Tersimpan</p>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight text-slate-700 font-mono tabular-nums">
            {loading ? <Skeleton className="h-8 w-16 my-0.5 rounded-lg" /> : `${projects.length} Proyek`}
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">Aktif maupun arsip pengerjaan</p>
        </Card>
      </div>

      {/* Filter Toolbar (Matching PortfolioList Pill-bar) */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3.5 rounded-[28px] border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <div className="relative w-full sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari proyek, kawasan, atau tahap..."
              className="pl-10 text-xs rounded-full placeholder:text-slate-400 border-slate-200 h-9"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-full border border-slate-200/80 overflow-x-auto">
            {['all', 'Konstruksi', 'Renovasi', 'Interior'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat === 'all' ? 'Semua Kategori' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-full border border-slate-200/80 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua ({projects.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'active' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusFilter === 'active' ? 'bg-white' : 'bg-emerald-500'}`} />
            Aktif di Peta ({activeCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('archived')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'archived' ? 'bg-slate-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Arsip ({projects.length - activeCount})
          </button>
        </div>
      </div>

      {/* Projects Grid View */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="p-5 rounded-[24px] border border-slate-200 bg-white space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-[32px] border border-dashed border-slate-300 bg-white">
          <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">Belum ada proyek ditemukan</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-5">
            {search || categoryFilter !== 'all' || statusFilter !== 'all'
              ? 'Tidak ada proyek yang sesuai dengan filter pencarian saat ini.'
              : 'Mulai tambahkan titik pengerjaan proyek pertama Anda untuk ditampilkan di peta publik.'}
          </p>
          <Button
            onClick={handleOpenAddModal}
            className="rounded-full bg-[#22416D] hover:bg-[#1A3356] text-white font-bold px-6"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Proyek Pertama
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.map((proj) => (
            <Card
              key={proj.id}
              className={`p-5 rounded-[24px] border transition-all duration-200 flex flex-col justify-between ${
                proj.is_active
                  ? 'bg-white border-slate-200/90 shadow-xs hover:shadow-md'
                  : 'bg-slate-50 border-slate-200/60 opacity-75'
              }`}
            >
              <div className="space-y-3">
                {/* Top Row: Category + Area & Toggle */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="bg-amber-50 text-amber-700 border-amber-200 text-xs font-bold px-2.5 py-0.5 rounded-full"
                    >
                      {proj.category}
                    </Badge>
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {proj.area_name}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleActive(proj)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      proj.is_active
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-200 text-slate-600 border border-slate-300 hover:bg-slate-300'
                    }`}
                    title="Klik untuk tampilkan atau sembunyikan di peta website"
                  >
                    {proj.is_active ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Aktif di Peta
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        Nonaktif
                      </>
                    )}
                  </button>
                </div>

                {/* Project Title */}
                <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
                  {proj.title}
                </h3>

                {/* Stage of work */}
                <p className="text-xs text-slate-600 line-clamp-1">
                  <strong className="text-slate-400 font-semibold">Tahap:</strong> {proj.stage}
                </p>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Progres Pengerjaan</span>
                    <span className="font-extrabold text-amber-600 font-mono">{proj.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/80">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-300"
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                <span className="text-[11px] text-slate-400 font-medium">
                  Privasi aman: koordinat disembunyikan
                </span>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenEditModal(proj)}
                    className="h-8 px-3 rounded-full text-xs text-slate-700 hover:text-slate-900 hover:bg-slate-100 font-semibold"
                  >
                    <Edit3 className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                    Edit
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeletingId(proj.id)}
                    className="h-8 px-3 rounded-full text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                    Hapus
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-[28px] shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
                  <MapPin className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {editingProject ? 'Edit Proyek Berjalan' : 'Tambah Proyek Berjalan'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Atur nama proyek, kawasan umum, dan tempatkan pin di peta interaktif.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-5">
              {/* Row 1: Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Nama Proyek <span className="text-rose-500">*</span>
                </label>
                <Input
                  placeholder="Contoh: Pembangunan Rumah Tinggal Modern 2 Lantai"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 rounded-xl"
                />
                {formErrors.title && (
                  <p className="text-xs text-rose-500 mt-1 font-medium">{formErrors.title}</p>
                )}
              </div>

              {/* Row 2: Category & General Area */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Kategori <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as LiveProjectFormData['category'],
                      })
                    }
                    className="w-full h-10 px-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#22416D]"
                  >
                    <option value="Konstruksi">Konstruksi</option>
                    <option value="Renovasi">Renovasi</option>
                    <option value="Interior">Interior</option>
                    <option value="Arsitektur">Arsitektur</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Kawasan / Area Umum <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    placeholder="Contoh: Araya, Kota Malang (tanpa detail jalan)"
                    value={formData.area_name}
                    onChange={(e) => setFormData({ ...formData, area_name: e.target.value })}
                    className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 rounded-xl"
                  />
                  {formErrors.area_name && (
                    <p className="text-xs text-rose-500 mt-1 font-medium">{formErrors.area_name}</p>
                  )}
                </div>
              </div>

              {/* Row 3: Interactive Location Picker */}
              <div className="pt-1">
                <LocationPickerMap
                  lat={formData.lat}
                  lng={formData.lng}
                  onChange={(newLat, newLng) => {
                    setFormData((prev) => ({ ...prev, lat: newLat, lng: newLng }));
                  }}
                />
              </div>

              {/* Row 4: Stage & Progress Slider */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Tahap Pengerjaan Lapangan <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    placeholder="Contoh: Pengecoran Plat Lantai 2 & Struktur"
                    value={formData.stage}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                    className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 rounded-xl"
                  />
                  {formErrors.stage && (
                    <p className="text-xs text-rose-500 mt-1 font-medium">{formErrors.stage}</p>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Progres:
                    </label>
                    <span className="text-sm font-extrabold text-amber-600 font-mono">{formData.progress}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={formData.progress}
                    onChange={(e) =>
                      setFormData({ ...formData, progress: parseInt(e.target.value, 10) })
                    }
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600 mt-2"
                  />
                </div>
              </div>

              {/* Row 5: Optional Image URL */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  URL Foto Dokumentasi Lapangan (Opsional)
                </label>
                <Input
                  placeholder="https://images.unsplash.com/... atau URL foto dokumentasi"
                  value={formData.image_url || ''}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 rounded-xl"
                />
                {formErrors.image_url && (
                  <p className="text-xs text-rose-500 mt-1 font-medium">{formErrors.image_url}</p>
                )}
              </div>

              {/* Row 6: Toggle Status */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <p className="text-sm font-bold text-slate-800">Tampilkan di Peta Website</p>
                  <p className="text-xs text-slate-500">
                    Jika dinonaktifkan, proyek akan disimpan sebagai arsip dan disembunyikan dari peta publik.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-300 text-[#22416D] focus:ring-[#22416D] cursor-pointer"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  disabled={isSaving}
                  className="rounded-full border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold px-5"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-full bg-[#22416D] hover:bg-[#1A3356] text-white font-bold px-6 shadow-md shadow-[#22416D]/20"
                >
                  {isSaving ? 'Menyimpan...' : editingProject ? 'Simpan Perubahan' : 'Terbitkan ke Peta'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
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
                className="rounded-full border-slate-300 text-slate-700 font-semibold px-4"
              >
                Batal
              </Button>
              <Button
                size="sm"
                onClick={() => handleDelete(deletingId)}
                className="rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold px-5"
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
