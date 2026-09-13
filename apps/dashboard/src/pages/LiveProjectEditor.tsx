import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, RefreshCw, AlertCircle, Check, MapPin, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { liveProjectFormSchema } from '../schemas/liveProjectSchema';
import { LocationPickerMap } from '../components/LocationPickerMap';
import { LiveProjectImageUploader } from '../components/LiveProjectImageUploader';
import { FALLBACK_LIVE_PROJECTS } from '../../../../src/data/liveProjects';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Skeleton } from '../components/ui/skeleton';
import { useToast } from '../components/ui/Toast';

interface LiveProjectEditorProps {
  projectId?: string;
  onBack?: () => void;
  onSave?: (id: string) => void;
}

export function LiveProjectEditor({ projectId, onBack, onSave }: LiveProjectEditorProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const toast = useToast();

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Konstruksi' | 'Renovasi' | 'Interior' | 'Arsitektur'>('Konstruksi');
  const [areaName, setAreaName] = useState('Kota Malang');
  const [lat, setLat] = useState(-7.9780);
  const [lng, setLng] = useState(112.6300);
  const [stage, setStage] = useState('');
  const [progress, setProgress] = useState(50);
  const [imageUrl, setImageUrl] = useState('');
  const [imgError, setImgError] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Load existing project if editing
  useEffect(() => {
    if (!projectId) return;

    async function loadProject() {
      setLoading(true);
      try {
        if (supabase) {
          const { data, error: err } = await supabase
            .from('live_projects')
            .select('*')
            .eq('id', projectId)
            .single();

          if (!err && data) {
            setTitle(data.title || '');
            setCategory(data.category || 'Konstruksi');
            setAreaName(data.area_name || '');
            setLat(data.lat || -7.9780);
            setLng(data.lng || 112.6300);
            setStage(data.stage || '');
            setProgress(typeof data.progress === 'number' ? data.progress : 50);
            setImageUrl(data.image_url || '');
            setIsActive(data.is_active ?? true);
            setLoading(false);
            return;
          }
        }

        // Check fallback if not in remote Supabase
        const fb = FALLBACK_LIVE_PROJECTS.find((p) => p.id === projectId);
        if (fb) {
          setTitle(fb.title);
          setCategory(fb.category as any);
          setAreaName(fb.area_name);
          setLat(fb.lat);
          setLng(fb.lng);
          setStage(fb.stage);
          setProgress(fb.progress);
          setImageUrl(fb.image_url || '');
          setIsActive(fb.is_active);
        }
      } catch (err: any) {
        console.error('Failed to load live project:', err);
        setError('Gagal memuat data proyek: ' + err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [projectId]);

  // Prevent accidental back navigation with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleBack = () => {
    if (isDirty) {
      if (!window.confirm('Ada perubahan data yang belum disimpan. Yakin ingin meninggalkan halaman ini?')) {
        return;
      }
    }
    onBack && onBack();
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(null);

    const formData = {
      title: title.trim(),
      category,
      area_name: areaName.trim(),
      lat,
      lng,
      stage: stage.trim(),
      progress,
      image_url: imageUrl.trim() || undefined,
      is_active: isActive,
    };

    // Validate with Zod
    const validation = liveProjectFormSchema.safeParse(formData);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || 'Periksa kembali formulir Anda.';
      setError(firstError);
      toast.error('Validasi Gagal', firstError);
      return;
    }

    setSaving(true);
    try {
      if (!supabase) {
        throw new Error('Supabase client tidak tersedia.');
      }

      if (projectId) {
        const { error: updateErr } = await supabase
          .from('live_projects')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', projectId);

        if (updateErr) throw updateErr;

        toast.success(
          'Proyek Berhasil Diperbarui!',
          `Perubahan pada "${formData.title}" telah disimpan ke database.`
        );
        setIsDirty(false);
        onSave && onSave(projectId);
      } else {
        const { data: inserted, error: insertErr } = await supabase
          .from('live_projects')
          .insert([formData])
          .select()
          .single();

        if (insertErr) throw insertErr;

        toast.success(
          'Proyek Berhasil Diterbitkan!',
          `Proyek "${formData.title}" kini telah terdaftar di peta.`
        );
        setIsDirty(false);
        onSave && onSave(inserted?.id || 'new');
      }
    } catch (err: any) {
      console.error('Failed to save live project:', err);
      // Fallback message
      const errMsg = err?.message || 'Gagal menyimpan proyek.';
      setError(errMsg);
      toast.error('Gagal Menyimpan', errMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 pb-28">
        <div className="flex items-center justify-between py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-xl" />
            <div className="space-y-1.5">
              <Skeleton className="h-6 w-52 rounded-lg" />
              <Skeleton className="h-4 w-72 rounded-md" />
            </div>
          </div>
          <Skeleton className="h-9 w-36 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            <Card className="p-6 space-y-4 rounded-[28px] border border-slate-200/80 bg-white">
              <Skeleton className="h-5 w-40 rounded-md" />
              <Skeleton className="h-10 w-full rounded-full" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-10 rounded-full" />
                <Skeleton className="h-10 rounded-full" />
              </div>
            </Card>
            <Card className="p-6 space-y-4 rounded-[28px] border border-slate-200/80 bg-white">
              <Skeleton className="h-5 w-48 rounded-md" />
              <Skeleton className="h-72 w-full rounded-2xl" />
            </Card>
          </div>
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-6 space-y-4 rounded-[28px] border border-slate-200/80 bg-white">
              <Skeleton className="h-5 w-36 rounded-md" />
              <Skeleton className="aspect-square w-full rounded-2xl" />
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-28">
      {/* Sticky Action Header */}
      <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3.5 bg-[#F8FAFC]/95 backdrop-blur-md border-b border-slate-200/80 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all">
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="outline"
            size="icon"
            onClick={handleBack}
            className="h-9 w-9 rounded-xl text-slate-600 hover:bg-white shadow-xs cursor-pointer shrink-0"
            title="Kembali ke Daftar Proyek Berjalan"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 truncate">
                {projectId ? 'Edit Proyek Berjalan' : 'Tambah Proyek Berjalan Baru'}
              </h2>
              <Badge
                variant="outline"
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {isActive ? '🟢 Aktif di Peta' : '🟡 Arsip (Disembunyikan)'}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              Kelola data sebaran lokasi proyek, tahap pengerjaan lapangan, dan persentase progres.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            pill
            onClick={handleBack}
            disabled={saving}
            className="text-xs font-bold h-9 px-4 rounded-full border-slate-200 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer shadow-xs"
          >
            Batal
          </Button>

          <Button
            size="sm"
            pill
            onClick={handleSave}
            disabled={saving}
            className="text-xs font-bold gap-2 h-9 px-5 rounded-full bg-[#22416D] hover:bg-[#1A3356] text-white shadow-md shadow-[#22416D]/20 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>{saving ? 'Menyimpan...' : projectId ? 'Simpan Perubahan' : 'Terbitkan ke Peta'}</span>
          </Button>
        </div>
      </div>

      {/* Toast / Error banner */}
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Two-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7/12): Main Details & Interactive Map */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Informasi Proyek */}
          <Card className="shadow-xs rounded-[28px] border border-slate-200/80 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-bold text-slate-900">Informasi Proyek</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Nama proyek dan pengelompokan kategori yang akan dikenali oleh pengunjung.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1.5 uppercase tracking-wider">
                  Nama Proyek <span className="text-rose-500">*</span>
                </label>
                <Input
                  pill
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="Contoh: Pembangunan Rumah Tinggal Modern 2 Lantai"
                  className="text-xs placeholder:text-slate-400 border-slate-200"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1.5 uppercase tracking-wider">
                    Kategori <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value as any);
                      setIsDirty(true);
                    }}
                    className="w-full h-11 px-4 text-xs font-semibold border border-slate-200 rounded-full bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#22416D]/30 shadow-xs"
                  >
                    <option value="Konstruksi">Konstruksi</option>
                    <option value="Renovasi">Renovasi</option>
                    <option value="Interior">Interior</option>
                    <option value="Arsitektur">Arsitektur</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1.5 uppercase tracking-wider">
                    Kawasan / Area Umum <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    pill
                    value={areaName}
                    onChange={(e) => {
                      setAreaName(e.target.value);
                      setIsDirty(true);
                    }}
                    placeholder="Contoh: Araya, Kota Malang"
                    className="text-xs placeholder:text-slate-400 border-slate-200"
                  />
                  <p className="text-[11px] text-slate-400 mt-1 font-medium">
                    🛡️ Cukup sebutkan area umum demi menjaga privasi pemilik hunian.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Interactive Location Picker Map (No Cropping!) */}
          <Card className="shadow-xs rounded-[28px] border border-slate-200/80 bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900">
                    Titik Lokasi Proyek di Peta
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 mt-0.5">
                    Klik atau geser pin pada peta untuk menentukan posisi proyek.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold rounded-full">
                  ✓ Lokasi Ditentukan
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
                <LocationPickerMap
                  lat={lat}
                  lng={lng}
                  onChange={(newLat, newLng) => {
                    setLat(newLat);
                    setLng(newLng);
                    setIsDirty(true);
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Progres Lapangan */}
          <Card className="shadow-xs rounded-[28px] border border-slate-200/80 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-bold text-slate-900">Tahap & Progres Pengerjaan</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Informasi progres fisik aktual di lapangan yang ditampilkan pada kartu peta.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1.5 uppercase tracking-wider">
                  Tahap Pengerjaan Saat Ini <span className="text-rose-500">*</span>
                </label>
                <Input
                  pill
                  value={stage}
                  onChange={(e) => {
                    setStage(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="Contoh: Pengecoran Plat Lantai 2 & Struktur Kolom"
                  className="text-xs placeholder:text-slate-400 border-slate-200"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Persentase Progres Fisik:
                  </span>
                  <span className="text-lg font-extrabold text-amber-600 font-mono">
                    {progress}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => {
                    setProgress(parseInt(e.target.value, 10));
                    setIsDirty(true);
                  }}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600 mt-1"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium pt-1">
                  <span>0% (Pondasi Awal)</span>
                  <span>50% (Struktur Utama)</span>
                  <span>100% (Finishing Lengkap)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (5/12): 1:1 Photo Documentation & Live Preview */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card 1: Foto Dokumentasi Lapangan (1:1 Ratio) */}
          <Card className="shadow-xs rounded-[28px] border border-slate-200/80 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-slate-900">
                Foto Dokumentasi Lapangan
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Unggah foto dokumentasi proyek langsung ke GitHub Media via jsDelivr CDN (rasio 1:1).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LiveProjectImageUploader
                value={imageUrl}
                onChange={(url) => {
                  setImageUrl(url);
                  setIsDirty(true);
                }}
                folder="live-projects"
              />
            </CardContent>
          </Card>

          {/* Card 2: Visibilitas Peta */}
          <Card className="shadow-xs rounded-[28px] border border-slate-200/80 bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="space-y-0.5 pr-4">
                  <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    {isActive ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-amber-600" />}
                    <span>Tampilkan di Peta Website</span>
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {isActive
                      ? 'Proyek aktif dan dapat dilihat langsung oleh pengunjung pada peta publik.'
                      : 'Proyek diarsipkan di database dan disembunyikan dari peta publik.'}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => {
                    setIsActive(e.target.checked);
                    setIsDirty(true);
                  }}
                  className="w-5 h-5 rounded border-slate-300 text-[#22416D] focus:ring-[#22416D] cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Simulasi Pop-up Peta Publik (Live Card Preview) */}
          <Card className="shadow-xs rounded-[28px] border border-slate-200/80 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-slate-900">
                Simulasi Pop-up di Peta Publik
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Pratinjau persis bagaimana kartu ini muncul saat pin diklik pengunjung.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-[280px] mx-auto rounded-[20px] overflow-hidden border border-slate-200/90 bg-white shadow-xl">
                {imageUrl && !imgError ? (
                  <div className="w-full aspect-square relative overflow-hidden bg-slate-100">
                    <img
                      src={imageUrl}
                      alt={title || 'Preview Proyek'}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2.5 left-2.5 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#22416D] text-white shadow-sm z-10">
                      {category}
                    </span>
                  </div>
                ) : (
                  <div className="px-3.5 pt-3.5 pb-1">
                    <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#22416D] text-white">
                      {category}
                    </span>
                  </div>
                )}

                <div className="p-3.5 space-y-2">
                  <h4 className="font-extrabold text-sm text-slate-900 leading-snug line-clamp-2">
                    {title || 'Nama Proyek Baru'}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{areaName || 'Nama Kawasan'}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1 mt-2">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-500 font-semibold">Tahap Pekerjaan:</span>
                      <span className="font-mono font-extrabold text-amber-600">{progress}%</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800 leading-tight line-clamp-2">
                      {stage || 'Belum diisi'}
                    </p>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden mt-1.5">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
