import React, { useState, useEffect, useRef } from 'react';
import {
  Megaphone,
  Save,
  RefreshCw,
  Eye,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Upload,
  X,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { HelpTooltip } from '../components/ui/HelpTooltip';
import { useToast } from '../components/ui/Toast';
import { supabase } from '../lib/supabase';
import { isGitHubConfigured, uploadToGitHubStorage, getGitHubConfig } from '../lib/github';
import { resolveDashboardMediaUrl } from '../lib/media';
import { compressImageClientSide, formatFileSize } from '../utils/imageCompression';
import { fetchAnnouncement, saveAnnouncement } from '../lib/announcementService';
import { triggerCloudflareDeploy } from '../lib/cloudflare';
import type { AnnouncementSettings } from '../types/announcement';
import { DEFAULT_ANNOUNCEMENT_SETTINGS } from '../types/announcement';

export const AnnouncementManager: React.FC = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [formData, setFormData] = useState<AnnouncementSettings>(DEFAULT_ANNOUNCEMENT_SETTINGS);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadAnnouncement();
  }, []);

  const loadAnnouncement = async () => {
    setLoading(true);
    try {
      const data = await fetchAnnouncement();
      setFormData(data);
      setIsDirty(false);
    } catch (err: any) {
      toast.error('Gagal Memuat Pengumuman', err?.message || 'Gagal memuat data dari database.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof AnnouncementSettings, value: string | boolean) => {
    setIsDirty(true);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadError(null);
      if (!e.target.files || e.target.files.length === 0) return;

      const rawFile = e.target.files[0];
      if (!rawFile.type.startsWith('image/')) {
        setUploadError('File harus berupa gambar (JPG, PNG, atau WebP).');
        return;
      }

      setUploading(true);

      // Auto compress large photos client-side (same pipeline as portfolio/articles)
      const { file, wasCompressed, originalSize, compressedSize } =
        await compressImageClientSide(rawFile);
      if (wasCompressed) {
        toast.success(
          'Foto Dioptimalkan',
          `${formatFileSize(originalSize)} ➔ ${formatFileSize(compressedSize)} agar cepat dimuat.`
        );
      }

      const ghConfig = getGitHubConfig();

      // Priority 1: GitHub Storage (dedicated media repo)
      if (isGitHubConfigured() && ghConfig) {
        const ghRes = await uploadToGitHubStorage(file, 'announcements', ghConfig);
        handleChange('announcement_image_url', ghRes.own_domain_url);
        toast.success('Foto Terunggah', 'Gambar tersimpan dan siap tampil di popup.');
        return;
      }

      // Priority 2: Supabase Storage fallback
      if (supabase) {
        const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const cleanFileName = file.name
          .replace(/\.[^/.]+$/, '')
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-');
        const filePath = `announcements/${Date.now()}-${cleanFileName}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file, { upsert: true });

        if (uploadError) throw uploadError;

        handleChange('announcement_image_url', `/media/${filePath}`);
        toast.success('Foto Terunggah', 'Gambar tersimpan dan siap tampil di popup.');
        return;
      }

      setUploadError('Penyimpanan foto belum terhubung. Hubungkan GitHub Storage di menu Pengaturan.');
    } catch (err: any) {
      console.error('Announcement image upload failed:', err);
      setUploadError(err?.message || 'Gagal mengunggah gambar.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    handleChange('announcement_image_url', '');
    setUploadError(null);
  };

  const handleSave = async () => {
    if (
      !formData.announcement_title.trim() &&
      !formData.announcement_description.trim() &&
      !formData.announcement_image_url.trim()
    ) {
      toast.error('Validasi Gagal', 'Isi minimal salah satu: gambar, judul, atau deskripsi.');
      return;
    }
    if (formData.announcement_cta_label.trim() && !formData.announcement_cta_url.trim()) {
      toast.error('Validasi Gagal', 'Tautan tombol wajib diisi jika label tombol diisi.');
      return;
    }

    setSaving(true);
    try {
      const res = await saveAnnouncement(formData);
      if (res.success) {
        setIsDirty(false);
        setLastSavedTime(new Date().toLocaleString('id-ID'));
        toast.success('Berhasil Disimpan', res.message || 'Pengaturan pengumuman tersimpan. Tekan Publikasi Live agar tampil di website.');
      } else {
        toast.error('Gagal Menyimpan', res.message || 'Gagal menyimpan pengaturan.');
      }
    } catch (err: any) {
      toast.error('Kesalahan Sistem', err?.message || 'Gagal menyimpan.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeploy = async () => {
    setDeploying(true);
    try {
      const res = await triggerCloudflareDeploy();
      if (res.success) {
        toast.success('Pembaruan Terkirim', 'Website publik sedang diperbarui, popup akan tampil dalam ~45 detik.');
      } else {
        toast.error('Pembaruan Gagal', res.message);
      }
    } catch (err: any) {
      toast.error('Gagal memperbarui website', err?.message || 'Koneksi bermasalah');
    } finally {
      setDeploying(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-4 pb-16">
        <div className="h-10 w-64 rounded-lg bg-slate-200 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 h-96 rounded-xl bg-slate-100 animate-pulse" />
          <div className="lg:col-span-5 h-96 rounded-xl bg-slate-100 animate-pulse" />
        </div>
      </div>
    );
  }

  const showPreviewCta = Boolean(formData.announcement_cta_label.trim() && formData.announcement_cta_url.trim());

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="p-2 rounded-lg bg-[#1B365D] text-white shadow-xs">
              <Megaphone className="w-5 h-5" />
            </div>
            <h1 className="text-xl md:text-2xl font-semibold text-slate-900 tracking-tight">
              Pengumuman Popup
            </h1>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                formData.is_announcement_active
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${formData.is_announcement_active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              {formData.is_announcement_active ? 'Aktif' : 'Nonaktif'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Satu pengumuman promo yang tampil sebagai popup di halaman beranda setiap kunjungan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadAnnouncement} disabled={saving}>
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Muat Ulang</span>
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving || !isDirty}>
            {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saving ? 'Menyimpan...' : 'Simpan'}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: form */}
        <div className="lg:col-span-7 space-y-5">
          <Card className="rounded-xl border border-slate-200/80 bg-white shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                Status Tampil
                <HelpTooltip content="Aktifkan untuk menampilkan popup di beranda. Matikan untuk menyembunyikan tanpa menghapus isi." />
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Popup tampil setiap kunjungan beranda setelah perubahan dipublikasikan
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-1">
              <button
                type="button"
                role="switch"
                aria-checked={formData.is_announcement_active}
                onClick={() => handleChange('is_announcement_active', !formData.is_announcement_active)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors cursor-pointer ${
                  formData.is_announcement_active ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                    formData.is_announcement_active ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="ml-3 text-xs font-semibold text-slate-700">
                {formData.is_announcement_active ? 'Popup aktif di beranda' : 'Popup disembunyikan'}
              </span>
            </CardContent>
          </Card>

          <Card className="rounded-xl border border-slate-200/80 bg-white shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-900">Teks Pengumuman (opsional)</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Boleh dikosongkan semua bila popup hanya berupa gambar yang diklik
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-1 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Label Kecil (Badge)</label>
                <Input
                  type="text"
                  value={formData.announcement_badge}
                  onChange={(e) => handleChange('announcement_badge', e.target.value)}
                  placeholder="Contoh: Promo Terbatas"
                  maxLength={100}
                  className="text-xs h-9 rounded-lg"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Judul</label>
                <Input
                  type="text"
                  value={formData.announcement_title}
                  onChange={(e) => handleChange('announcement_title', e.target.value)}
                  placeholder="Contoh: Gratis Survei & Konsultasi RAB"
                  maxLength={200}
                  className="text-xs h-9 rounded-lg"
                />
                <p className="text-[11px] text-slate-400 text-right">{formData.announcement_title.length}/200</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Deskripsi</label>
                <textarea
                  value={formData.announcement_description}
                  onChange={(e) => handleChange('announcement_description', e.target.value)}
                  placeholder="Contoh: Khusus bulan ini, dapatkan gratis survei lokasi area Malang Raya plus estimasi RAB transparan."
                  rows={4}
                  maxLength={500}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B365D]/20 focus:border-[#1B365D] resize-y"
                />
                <p className="text-[11px] text-slate-400 text-right">{formData.announcement_description.length}/500</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border border-slate-200/80 bg-white shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                Gambar & Tombol
                <HelpTooltip content="Upload foto atau tempel URL. Klik pada gambar popup akan membuka tautan tujuan. Label tombol boleh dikosongkan." />
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-1 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Gambar (klik gambar membuka tautan di bawah)</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
                {uploading ? (
                  <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4 flex items-center justify-center gap-2.5 text-xs font-semibold text-slate-700">
                    <RefreshCw className="w-4 h-4 animate-spin text-[#1B365D]" />
                    <span>Mengunggah & mengoptimalkan foto...</span>
                  </div>
                ) : formData.announcement_image_url ? (
                  <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-50 group">
                    <img
                      src={resolveDashboardMediaUrl(formData.announcement_image_url)}
                      alt="Pratinjau gambar pengumuman"
                      className="w-full h-auto max-h-80 object-contain bg-slate-50"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-1.5 bg-slate-900/80 hover:bg-rose-600 text-white rounded-md transition-all cursor-pointer shadow-sm"
                      title="Hapus gambar"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white/95 hover:bg-white text-[11px] font-semibold text-slate-700 shadow-sm transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#1B365D]" />
                      <span>Ganti Foto</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full rounded-lg border-2 border-dashed border-slate-300 hover:border-[#1B365D] bg-slate-50/50 hover:bg-slate-50 p-4 flex items-center justify-center gap-2.5 cursor-pointer transition-colors"
                  >
                    <span className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-2xs shrink-0">
                      <Upload className="w-4 h-4 text-[#1B365D]" />
                    </span>
                    <span className="text-left">
                      <span className="block text-xs font-semibold text-slate-800">Upload Foto Pengumuman</span>
                      <span className="block text-[11px] text-slate-400">Rasio 16:9, JPG/PNG/WebP — otomatis dioptimalkan</span>
                    </span>
                  </button>
                )}
                {uploadError && (
                  <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2 rounded-lg">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-500">atau tempel URL gambar</label>
                  <Input
                    type="url"
                    value={formData.announcement_image_url}
                    onChange={(e) => handleChange('announcement_image_url', e.target.value)}
                    placeholder="https://.../promo.webp"
                    className="text-xs font-mono h-9 rounded-lg"
                  />
                </div>
                {!formData.announcement_image_url && !uploading && (
                  <div className="flex items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2.5 text-[11px] text-slate-400">
                    <ImageIcon className="w-4 h-4" />
                    <span>Belum ada gambar — popup tampil teks saja.</span>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Label Tombol (boleh kosong bila hanya gambar diklik)</label>
                  <Input
                    type="text"
                    value={formData.announcement_cta_label}
                    onChange={(e) => handleChange('announcement_cta_label', e.target.value)}
                    placeholder="Contoh: Konsultasi Gratis"
                    maxLength={100}
                    className="text-xs h-9 rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Tautan Tujuan (dibuka saat gambar / tombol diklik)</label>
                  <Input
                    type="text"
                    value={formData.announcement_cta_url}
                    onChange={(e) => handleChange('announcement_cta_url', e.target.value)}
                    placeholder="https://wa.me/628... atau /kontak"
                    className="text-xs font-mono h-9 rounded-lg"
                  />
                </div>
              </div>
              {formData.announcement_cta_url && (
                <a
                  href={formData.announcement_cta_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1B365D] hover:underline"
                >
                  <span>Uji tautan tombol</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </CardContent>
          </Card>

          {lastSavedTime && (
            <p className="text-[11px] text-slate-400">Terakhir disimpan: {lastSavedTime}</p>
          )}
        </div>

        {/* Right: preview + publish */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-4">
          <Card className="rounded-xl border border-slate-200/80 bg-white shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-slate-500" />
                Pratinjau Popup
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Tampilan mendekati popup asli di beranda
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-1">
              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                {formData.announcement_image_url && (
                  <img
                    src={resolveDashboardMediaUrl(formData.announcement_image_url)}
                    alt={formData.announcement_title || 'Pratinjau pengumuman'}
                    className="w-full h-auto max-h-72 object-contain bg-slate-50"
                    loading="lazy"
                  />
                )}
                <div className="p-5 text-center space-y-2.5">
                  {formData.announcement_badge ? (
                    <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
                      {formData.announcement_badge}
                    </span>
                  ) : null}
                  {(formData.announcement_title || !formData.announcement_image_url) && (
                    <p className="font-bold text-slate-900 text-base leading-snug">
                      {formData.announcement_title || <span className="text-slate-300">(Belum ada judul)</span>}
                    </p>
                  )}
                  {(formData.announcement_description || !formData.announcement_image_url) && (
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {formData.announcement_description || <span className="text-slate-300">(Belum ada deskripsi)</span>}
                    </p>
                  )}
                  {showPreviewCta ? (
                    <span className="inline-flex items-center justify-center px-6 h-10 rounded-xl bg-[#1B365D] text-white text-xs font-bold">
                      {formData.announcement_cta_label}
                    </span>
                  ) : (
                    <span className="inline-block text-[11px] text-slate-300">(Tanpa tombol)</span>
                  )}
                </div>
              </div>
              {!formData.is_announcement_active && (
                <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
                  <span>Status nonaktif — pratinjau di atas tidak tampil di website sampai diaktifkan.</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-xl bg-[#1B365D] text-white border border-[#1B365D] p-4 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h3 className="font-semibold text-xs">Tayangkan ke Website</h3>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Setelah menyimpan, tekan tombol di bawah agar popup terbaru tampil di beranda (~45 detik).
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDeploy}
              disabled={deploying}
              className="w-full"
            >
              {deploying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
              <span>{deploying ? 'Mempublikasikan...' : 'Publikasi Live Sekarang'}</span>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
