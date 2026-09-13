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
  ExternalLink,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
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

export function LiveProjectsManager() {
  const [projects, setProjects] = useState<LiveProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('all');

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
      if (!supabase) return;
      const { data, error } = await supabase
        .from('live_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (err: any) {
      console.error('Failed to fetch live projects:', err);
      toast.error('Gagal memuat data proyek berjalan', err?.message || 'Terjadi kesalahan.');
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
      toast.error('Validasi Gagal', 'Mohon periksa kolom input yang ditandai merah.');
      return;
    }

    if (!supabase) {
      toast.error('Koneksi Error', 'Supabase belum dikonfigurasi.');
      return;
    }

    setIsSaving(true);
    try {
      if (editingProject) {
        // Update
        const { error } = await supabase
          .from('live_projects')
          .update({
            ...validationResult.data,
            image_url: validationResult.data.image_url || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingProject.id);

        if (error) throw error;
        toast.success('Proyek Diperbarui', 'Data proyek berjalan berhasil disimpan.');
      } else {
        // Insert
        const { error } = await supabase
          .from('live_projects')
          .insert([
            {
              ...validationResult.data,
              image_url: validationResult.data.image_url || null,
            },
          ]);

        if (error) throw error;
        toast.success('Proyek Ditambahkan', 'Titik proyek baru berhasil tampil di peta.');
      }

      handleCloseModal();
      await fetchProjects();
    } catch (err: any) {
      console.error('Save error:', err);
      toast.error('Gagal Menyimpan', err?.message || 'Terjadi kesalahan pada database.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (proj: LiveProjectRecord) => {
    if (!supabase) return;
    const nextState = !proj.is_active;

    // Optimistic UI update
    setProjects((prev) =>
      prev.map((p) => (p.id === proj.id ? { ...p, is_active: nextState } : p))
    );

    try {
      const { error } = await supabase
        .from('live_projects')
        .update({ is_active: nextState, updated_at: new Date().toISOString() })
        .eq('id', proj.id);

      if (error) throw error;
      toast.success(
        nextState ? 'Proyek Diaktifkan' : 'Proyek Diarsipkan',
        nextState
          ? `Titik "${proj.title}" kini aktif dan tampil di peta website.`
          : `Titik "${proj.title}" disembunyikan dari peta publik.`
      );
    } catch (err: any) {
      console.error('Toggle error:', err);
      toast.error('Gagal mengubah status', err?.message || 'Gagal sinkronisasi.');
      await fetchProjects();
    }
  };

  const handleDelete = async (id: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('live_projects').delete().eq('id', id);
      if (error) throw error;
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success('Proyek Dihapus', 'Data proyek berhasil dihapus permanen.');
    } catch (err: any) {
      console.error('Delete error:', err);
      toast.error('Gagal Menghapus', err?.message || 'Terjadi kesalahan.');
    } finally {
      setDeletingId(null);
    }
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

  // Calculate stats
  const activeCount = projects.filter((p) => p.is_active).length;
  const avgProgress =
    activeCount > 0
      ? Math.round(
          projects.filter((p) => p.is_active).reduce((acc, p) => acc + p.progress, 0) / activeCount
        )
      : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <MapPin className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">Peta Proyek Berjalan</h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Kelola titik sebaran proyek aktif dan progres lapangan yang tampil di peta publik website.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchProjects}
            className="border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Segarkan
          </Button>

          <Button
            size="sm"
            onClick={handleOpenAddModal}
            className="bg-amber-600 hover:bg-amber-500 text-white font-semibold shadow-lg shadow-amber-600/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Proyek
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Proyek Aktif di Peta</p>
              <h3 className="text-2xl font-bold text-white mt-1">{activeCount} Proyek</h3>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Eye className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Rata-rata Progres</p>
              <h3 className="text-2xl font-bold text-amber-400 mt-1">{avgProgress}%</h3>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Data Tersimpan</p>
              <h3 className="text-2xl font-bold text-slate-200 mt-1">{projects.length} Proyek</h3>
            </div>
            <div className="p-3 rounded-xl bg-slate-800 text-slate-400 border border-slate-700">
              <Building2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Cari proyek, kawasan, atau tahap..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-slate-800 border-slate-700 text-white placeholder-slate-500 text-sm h-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Category Filter */}
          <div className="flex items-center rounded-lg bg-slate-800 p-0.5 border border-slate-700 text-xs">
            {['all', 'Konstruksi', 'Renovasi', 'Interior'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  categoryFilter === cat
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'Semua' : cat}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center rounded-lg bg-slate-800 p-0.5 border border-slate-700 text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                statusFilter === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('active')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                statusFilter === 'active' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Aktif
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('archived')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                statusFilter === 'archived' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Arsip
            </button>
          </div>
        </div>
      </div>

      {/* Projects List View */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-3">
              <Skeleton className="h-6 w-3/4 bg-slate-800" />
              <Skeleton className="h-4 w-1/2 bg-slate-800" />
              <Skeleton className="h-2 w-full bg-slate-800" />
            </div>
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
          <MapPin className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-300">Belum ada proyek ditemukan</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-5">
            {search || categoryFilter !== 'all' || statusFilter !== 'all'
              ? 'Tidak ada proyek yang sesuai dengan filter pencarian saat ini.'
              : 'Mulai tambahkan titik pengerjaan proyek pertama Anda untuk ditampilkan di peta publik.'}
          </p>
          <Button
            onClick={handleOpenAddModal}
            className="bg-amber-600 hover:bg-amber-500 text-white"
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
              className={`border transition-all duration-200 overflow-hidden ${
                proj.is_active
                  ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-950/60 border-slate-800/60 opacity-70'
              }`}
            >
              <div className="p-5 flex flex-col justify-between h-full space-y-4">
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-xs font-semibold px-2 py-0.5"
                      >
                        {proj.category}
                      </Badge>
                      <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {proj.area_name}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleActive(proj)}
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold transition-colors ${
                        proj.is_active
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-700/50 hover:bg-emerald-900/80'
                          : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                      }`}
                      title="Klik untuk tampilkan/sembunyikan di peta website"
                    >
                      {proj.is_active ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          Aktif di Peta
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          Nonaktif
                        </>
                      )}
                    </button>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-white line-clamp-2 leading-snug">
                    {proj.title}
                  </h3>

                  {/* Stage of work */}
                  <p className="text-xs text-slate-300 mt-2 line-clamp-1">
                    <strong className="text-slate-400 font-normal">Tahap saat ini:</strong> {proj.stage}
                  </p>

                  {/* Progress Bar */}
                  <div className="mt-3 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Progres Pekerjaan</span>
                      <span className="font-bold text-amber-400">{proj.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-300"
                        style={{ width: `${proj.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                  <span className="text-[11px] text-slate-500">
                    Privasi aman: koordinat disembunyikan
                  </span>

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenEditModal(proj)}
                      className="h-8 px-2.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800"
                    >
                      <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                      Edit
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletingId(proj.id)}
                      className="h-8 px-2.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                      Hapus
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <MapPin className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {editingProject ? 'Edit Proyek Berjalan' : 'Tambah Proyek Berjalan'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Atur nama proyek, kawasan umum, dan tempatkan pin di peta interaktif.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-5">
              {/* Row 1: Title */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Nama Proyek <span className="text-amber-500">*</span>
                </label>
                <Input
                  placeholder="Contoh: Pembangunan Rumah Tinggal Modern 2 Lantai"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                />
                {formErrors.title && (
                  <p className="text-xs text-rose-400 mt-1">{formErrors.title}</p>
                )}
              </div>

              {/* Row 2: Category & General Area */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Kategori <span className="text-amber-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as LiveProjectFormData['category'],
                      })
                    }
                    className="w-full h-10 px-3 rounded-md bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Konstruksi">Konstruksi</option>
                    <option value="Renovasi">Renovasi</option>
                    <option value="Interior">Interior</option>
                    <option value="Arsitektur">Arsitektur</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Kawasan / Area Umum <span className="text-amber-500">*</span>
                  </label>
                  <Input
                    placeholder="Contoh: Araya, Kota Malang (tanpa detail jalan)"
                    value={formData.area_name}
                    onChange={(e) => setFormData({ ...formData, area_name: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                  />
                  {formErrors.area_name && (
                    <p className="text-xs text-rose-400 mt-1">{formErrors.area_name}</p>
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
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Tahap Pengerjaan Lapangan <span className="text-amber-500">*</span>
                  </label>
                  <Input
                    placeholder="Contoh: Pengecoran Plat Lantai 2 & Struktur"
                    value={formData.stage}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                  />
                  {formErrors.stage && (
                    <p className="text-xs text-rose-400 mt-1">{formErrors.stage}</p>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Progres:
                    </label>
                    <span className="text-sm font-bold text-amber-400">{formData.progress}%</span>
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
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 mt-2"
                  />
                </div>
              </div>

              {/* Row 5: Optional Image URL */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  URL Foto Dokumentasi Lapangan (Opsional)
                </label>
                <Input
                  placeholder="https://images.unsplash.com/... atau URL foto"
                  value={formData.image_url || ''}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                />
                {formErrors.image_url && (
                  <p className="text-xs text-rose-400 mt-1">{formErrors.image_url}</p>
                )}
              </div>

              {/* Row 6: Toggle Status */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
                <div>
                  <p className="text-sm font-semibold text-white">Tampilkan di Peta Website</p>
                  <p className="text-xs text-slate-400">
                    Jika dinonaktifkan, proyek akan disimpan sebagai arsip dan disembunyikan dari publik.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-amber-500 cursor-pointer"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  disabled={isSaving}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-semibold"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <span className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <Trash2 className="w-6 h-6" />
              </span>
              <h3 className="text-lg font-bold text-white">Konfirmasi Hapus Proyek</h3>
            </div>
            <p className="text-sm text-slate-400">
              Apakah Anda yakin ingin menghapus data proyek ini? Data yang dihapus tidak dapat dipulihkan kembali.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeletingId(null)}
                className="border-slate-700 text-slate-300"
              >
                Batal
              </Button>
              <Button
                size="sm"
                onClick={() => handleDelete(deletingId)}
                className="bg-rose-600 hover:bg-rose-500 text-white"
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
