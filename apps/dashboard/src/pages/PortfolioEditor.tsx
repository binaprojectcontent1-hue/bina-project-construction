import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, Globe, Check, AlertCircle, RefreshCw, Rocket, Sparkles, Star, Lock, Unlock, SlidersHorizontal } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { generateSlug, checkSlugAvailability, record301Redirect } from '../utils/slug';
import { portfolioFormSchema } from '../schemas/portfolioSchema';
import { GoogleSerpPreview } from '../components/GoogleSerpPreview';
import { ImageUploader } from '../components/ImageUploader';
import { GalleryUploader } from '../components/GalleryUploader';
import { HelpTooltip } from '../components/ui/HelpTooltip';
import { triggerCloudflareDeploy } from '../lib/cloudflare';
import { submitContentUrl } from '../lib/indexing';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input, Textarea } from '../components/ui/input';
import { useToast } from '../components/ui/Toast';
import { Skeleton } from '../components/ui/skeleton';

interface PortfolioEditorProps {
  projectId?: string;
  onBack?: () => void;
  onSave?: (id: string) => void;
}

export function PortfolioEditor({ projectId, onBack, onSave }: PortfolioEditorProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const toast = useToast();

  // Form Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [initialSlug, setInitialSlug] = useState('');
  const [category, setCategory] = useState('Konstruksi');
  const [location, setLocation] = useState('Malang, Jawa Timur');
  const [projectDate, setProjectDate] = useState('2026');
  const [client, setClient] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [altCoverImage, setAltCoverImage] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<'published' | 'draft'>('published');

  // Specific SEO Fields
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [ogImageType, setOgImageType] = useState<'branded' | 'raw_cover'>('branded');
  const [autoSlug, setAutoSlug] = useState(!projectId);
  const [isSlugLocked, setIsSlugLocked] = useState(Boolean(projectId));
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);

  // Before & After Transformation Fields
  const [enableBeforeAfter, setEnableBeforeAfter] = useState(false);
  const [beforeImage, setBeforeImage] = useState('');
  const [afterImage, setAfterImage] = useState('');
  const [renovationDuration, setRenovationDuration] = useState('');
  const [transformationScope, setTransformationScope] = useState('');

  useEffect(() => {
    if (!projectId || !supabase) return;

    async function loadProject() {
      setLoading(true);
      try {
        const { data, error: err } = await supabase!
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();

        if (err) throw err;
        if (data) {
          setTitle(data.title || '');
          setSlug(data.slug || '');
          setInitialSlug(data.slug || '');
          setCategory(data.category || 'Konstruksi');
          setLocation(data.location || 'Malang, Jawa Timur');
          setProjectDate(data.project_date || '');
          setClient(data.client || '');
          setDescription(data.description || '');
          setCoverImage(data.cover_image || '');
          setAltCoverImage(data.alt_cover_image || '');
          setGalleryImages(data.gallery_images || []);
          setFeatured(Boolean(data.featured));
          setStatus(data.status || 'published');
          setMetaTitle(data.meta_title || '');
          setMetaDescription(data.meta_description || '');
          setOgImageType(data.og_image_type || 'branded');
          setEnableBeforeAfter(Boolean(data.enable_before_after));
          setBeforeImage(data.before_image || '');
          setAfterImage(data.after_image || '');
          setRenovationDuration(data.renovation_duration || '');
          setTransformationScope(data.transformation_scope || '');
          setAutoSlug(false);
          setIsSlugLocked(true);
        }
      } catch (err: any) {
        console.error('Failed to load project:', err);
        setError('Gagal memuat data proyek: ' + err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [projectId]);

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

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setIsDirty(true);
    if (autoSlug) {
      const generated = generateSlug(val);
      setSlug(generated);
      validateSlug(generated);
    }
  };

  const handleSlugChange = (val: string) => {
    setAutoSlug(false);
    setIsDirty(true);
    const cleaned = generateSlug(val);
    setSlug(cleaned);
    validateSlug(cleaned);
  };

  const validateSlug = async (checkValue: string) => {
    if (!checkValue) {
      setSlugAvailable(null);
      return;
    }
    const isAvail = await checkSlugAvailability(checkValue, 'projects', projectId);
    setSlugAvailable(isAvail);
  };

  // Guard against accidental loss of unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (title.trim() || description.trim()) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [title, description]);

  const handleSave = async (autoDeploy = false) => {
    // Validate with centralized Zod Schema
    const validation = portfolioFormSchema.safeParse({
      title,
      slug,
      category,
      location,
      projectDate,
      client,
      description,
      coverImage,
      altCoverImage,
      galleryImages,
      featured,
      status,
      metaTitle,
      metaDescription,
      og_image_type: ogImageType,
    });

    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      if (!supabase) throw new Error('Koneksi Supabase tidak tersedia.');

      const isAvail = await checkSlugAvailability(slug, 'projects', projectId);
      if (!isAvail) {
        throw new Error(`Slug URL "${slug}" sudah digunakan pada proyek lain.`);
      }

      if (projectId && initialSlug && initialSlug !== slug && status === 'published') {
        const redirectRes = await record301Redirect(initialSlug, slug, 'portfolio');
        if (!redirectRes.success) {
          console.warn('Gagal mencatat 301 redirect:', redirectRes.message);
        }
      }

      const payload: Record<string, any> = {
        title,
        slug,
        category,
        location,
        project_date: projectDate,
        client,
        description,
        cover_image: coverImage,
        alt_cover_image: altCoverImage,
        gallery_images: galleryImages,
        featured,
        status,
        enable_before_after: enableBeforeAfter,
        before_image: beforeImage || null,
        after_image: afterImage || null,
        renovation_duration: renovationDuration || null,
        transformation_scope: transformationScope || null,
        meta_title: metaTitle || null,
        meta_description: metaDescription || null,
        og_image_type: ogImageType,
        updated_at: new Date().toISOString(),
      };

      // Helper to strip newer columns if SQL migration is pending
      const stripPendingColumns = (targetPayload: Record<string, any>, errMsg: string) => {
        if (errMsg.includes('og_image_type')) delete targetPayload.og_image_type;
        if (errMsg.includes('before_after') || errMsg.includes('before_image') || errMsg.includes('after_image')) {
          delete targetPayload.enable_before_after;
          delete targetPayload.before_image;
          delete targetPayload.after_image;
          delete targetPayload.renovation_duration;
          delete targetPayload.transformation_scope;
        }
      };

      if (projectId) {
        let { error: updateErr } = await supabase
          .from('projects')
          .update(payload)
          .eq('id', projectId);
        if (updateErr && (updateErr.message?.includes('og_image_type') || updateErr.message?.includes('before_'))) {
          stripPendingColumns(payload, updateErr.message);
          const retry = await supabase.from('projects').update(payload).eq('id', projectId);
          updateErr = retry.error;
        }
        if (updateErr) throw updateErr;
      } else {
        const insertData: Record<string, any> = {
          ...payload,
          published_at: status === 'published' ? new Date().toISOString() : null,
        };
        let { error: insertErr } = await supabase.from('projects').insert([insertData]);
        if (insertErr && (insertErr.message?.includes('og_image_type') || insertErr.message?.includes('before_'))) {
          stripPendingColumns(insertData, insertErr.message);
          const retry = await supabase.from('projects').insert([insertData]);
          insertErr = retry.error;
        }
        if (insertErr) throw insertErr;
      }

      setIsDirty(false);
      toast.success('Proyek Berhasil Disimpan', 'Data portofolio telah disimpan ke database.');
      setSuccess('Proyek berhasil disimpan ke database!');

      if (autoDeploy) {
        setDeploying(true);
        const deployToastId = toast.loading('Memicu deployment & sinyal pengindeksan...');
        const [deployRes] = await Promise.all([
          triggerCloudflareDeploy(),
          submitContentUrl('portfolio', slug).catch(() => null),
        ]);
        toast.dismiss(deployToastId);
        if (deployRes.success) {
          toast.success(
            'Deploy & Indexing Terpicu',
            'Website sedang diperbarui & URL telah dikirim ke IndexNow untuk pengindeksan instan.'
          );
          setSuccess('Proyek berhasil disimpan, Deployment Cloudflare & IndexNow terkirim!');
        } else {
          toast.error('Deploy Gagal', deployRes.message);
          setError('Proyek tersimpan, respon Cloudflare: ' + deployRes.message);
        }
        setDeploying(false);
      }

      setTimeout(() => {
        onSave && onSave(projectId!);
      }, 1200);
    } catch (err: any) {
      const msg = err?.message || 'Terjadi kesalahan saat menyimpan data.';
      setError(msg);
      toast.error('Gagal Menyimpan Proyek', msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 pb-28 animate-in fade-in duration-150">
        {/* Top Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48 rounded-lg" />
              <Skeleton className="h-4 w-72 rounded-md" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24 rounded-xl" />
            <Skeleton className="h-9 w-36 rounded-xl" />
          </div>
        </div>

        {/* 2-Column Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            <Card className="p-6 space-y-4 rounded-2xl">
              <Skeleton className="h-5 w-40 rounded-md" />
              <Skeleton className="h-4 w-60 rounded-md" />
              <div className="space-y-3 pt-2">
                <Skeleton className="h-10 w-full rounded-xl" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-10 rounded-xl" />
                  <Skeleton className="h-10 rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-10 rounded-xl" />
                  <Skeleton className="h-10 rounded-xl" />
                </div>
                <Skeleton className="h-32 w-full rounded-xl" />
              </div>
            </Card>
            <Card className="p-6 space-y-4 rounded-2xl">
              <Skeleton className="h-5 w-40 rounded-md" />
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-28 w-full rounded-xl" />
            </Card>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <Card className="p-5 space-y-3 rounded-2xl">
              <Skeleton className="h-5 w-32 rounded-md" />
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-14 w-full rounded-xl" />
            </Card>
            <Card className="p-5 space-y-3 rounded-2xl">
              <Skeleton className="h-5 w-40 rounded-md" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </Card>
            <Card className="p-5 space-y-3 rounded-2xl">
              <Skeleton className="h-5 w-48 rounded-md" />
              <Skeleton className="h-36 w-full rounded-xl" />
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-28">
      {/* Sticky Action Bar */}
      <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3.5 bg-[#F8FAFC]/95 backdrop-blur-md border-b border-slate-200/80 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="outline" size="icon" onClick={handleBack} className="h-9 w-9 rounded-xl text-slate-600 hover:bg-white shadow-xs cursor-pointer shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 truncate">
                {projectId ? 'Edit Portofolio Proyek' : 'Tambah Proyek Baru'}
              </h2>
              <Badge variant="outline" className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${status === 'published' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                {status === 'published' ? '🟢 Tayang di Web' : '🟡 Draft (Konsep)'}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              Isi data pengerjaan, foto dokumentasi, dan optimasi alamat link pencarian Google.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            pill
            onClick={() => handleSave(false)}
            disabled={saving || deploying}
            className="text-xs font-bold gap-1.5 h-9 px-4 rounded-full border-slate-200 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer shadow-xs"
            title="Simpan data ke database tanpa langsung memicu perubahan di website publik"
          >
            <Save className="w-3.5 h-3.5 text-slate-500" />
            <span>{saving && !deploying ? 'Menyimpan...' : 'Simpan Draft'}</span>
          </Button>

          <Button
            size="sm"
            pill
            onClick={() => handleSave(true)}
            disabled={saving || deploying}
            className="text-xs font-bold gap-2 h-9 px-5 rounded-full bg-[#22416D] hover:bg-[#1A3356] text-white shadow-md shadow-[#22416D]/20 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            title="Simpan ke database dan publikasikan langsung ke website live"
          >
            {deploying ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Rocket className="w-3.5 h-3.5" />
            )}
            <span>{deploying ? 'Mempublikasikan...' : 'Simpan & Publikasikan'}</span>
          </Button>
        </div>
      </div>

      {/* Toast Feedback */}
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

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="shadow-xs rounded-[28px]">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Informasi Proyek</CardTitle>
              <CardDescription>
                Detail utama hasil karya yang akan ditampilkan kepada calon klien di website.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div>
                <label className="text-sm font-bold text-slate-800 block mb-1.5">
                  Judul Proyek <span className="text-rose-500">*</span>
                </label>
                <Input
                  pill
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Contoh: Villa Tropis Modern Batu"
                />
              </div>

              {/* Category & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-slate-800 block mb-1.5">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="flex h-11 w-full rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-800 shadow-xs focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#22416D]/15 focus-visible:border-[#22416D]"
                  >
                    <option value="Konstruksi">Konstruksi</option>
                    <option value="Eksterior">Eksterior</option>
                    <option value="Interior">Interior</option>
                    <option value="Kitchen Set">Kitchen Set</option>
                    <option value="Renovasi">Renovasi</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-800 block mb-1.5">Lokasi</label>
                  <Input
                    pill
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      setIsDirty(true);
                    }}
                    placeholder="Contoh: Kota Batu, Jawa Timur"
                  />
                </div>
              </div>

              {/* Client & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-slate-800 block mb-1.5">Nama Klien (Opsional)</label>
                  <Input
                    pill
                    value={client}
                    onChange={(e) => {
                      setClient(e.target.value);
                      setIsDirty(true);
                    }}
                    placeholder="Contoh: Bpk. Hendra & Ibu Maya"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-800 block mb-1.5">Tahun / Tanggal</label>
                  <Input
                    pill
                    value={projectDate}
                    onChange={(e) => {
                      setProjectDate(e.target.value);
                      setIsDirty(true);
                    }}
                    placeholder="Contoh: 15 Januari 2026"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-bold text-slate-800 block mb-1.5">
                  Deskripsi Hasil Karya <span className="text-rose-500">*</span>
                </label>
                <Textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ceritakan detail ruang lingkup pekerjaan konstruksi, arsitektur, dan interior..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Media Image Uploader */}
          <Card className="shadow-xs">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Media & Dokumentasi</CardTitle>
              <CardDescription>
                Foto utama beresolusi tinggi dengan alt-text untuk optimasi Google Images.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUploader
                label="Foto Utama Portofolio"
                value={coverImage}
                onChange={setCoverImage}
                altText={altCoverImage}
                onAltChange={setAltCoverImage}
                bucket="media"
                folder="portfolio"
                requiredAlt={true}
              />

              <div className="pt-2">
                <GalleryUploader
                  label="Dokumentasi Proyek (Foto Galeri)"
                  value={galleryImages}
                  onChange={setGalleryImages}
                  folder="portfolio"
                />
              </div>
            </CardContent>
          </Card>

          {/* Before & After Transformation Slider Card */}
          <Card className="shadow-xs border-slate-200">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-sky-500" />
                    Perbandingan Sebelum & Sesudah (Before-After Slider)
                  </CardTitle>
                  <CardDescription>
                    Tampilkan slider interaktif split-screen untuk membandingkan foto sebelum vs sesudah renovasi.
                  </CardDescription>
                </div>
                {/* Custom Accessible Toggle Switch */}
                <button
                  type="button"
                  onClick={() => setEnableBeforeAfter(!enableBeforeAfter)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    enableBeforeAfter ? 'bg-[#22416D]' : 'bg-slate-300'
                  }`}
                  role="switch"
                  aria-checked={enableBeforeAfter}
                  title={enableBeforeAfter ? 'Nonaktifkan fitur Sebelum & Sesudah' : 'Aktifkan fitur Sebelum & Sesudah'}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      enableBeforeAfter ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </CardHeader>
            {enableBeforeAfter && (
              <CardContent className="space-y-4 pt-0 border-t border-slate-100 mt-2">
                <div className="p-3 bg-sky-50 rounded-xl text-xs text-sky-800 flex items-start gap-2 mt-4">
                  <span className="font-semibold text-sky-900 shrink-0">ℹ️ Info:</span>
                  <span>
                    Fitur perbandingan ini akan ditampilkan di halaman detail proyek (<code>/portfolio/{slug || 'nama-slug'}</code>) tepat di bawah deskripsi dan di atas galeri foto.
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Before Image */}
                  <div>
                    <ImageUploader
                      label="Foto Kondisi Sebelum (Before Image)"
                      value={beforeImage}
                      onChange={setBeforeImage}
                      altText={`Foto sebelum renovasi - ${title}`}
                      onAltChange={() => {}}
                      bucket="media"
                      folder="portfolio"
                      requiredAlt={false}
                    />
                  </div>

                  {/* After Image */}
                  <div>
                    <ImageUploader
                      label="Foto Hasil Sesudah (After Image - Opsional)"
                      value={afterImage}
                      onChange={setAfterImage}
                      altText={`Foto hasil renovasi - ${title}`}
                      onAltChange={() => {}}
                      bucket="media"
                      folder="portfolio"
                      requiredAlt={false}
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Kosongkan jika ingin otomatis memakai <strong>Foto Utama (Cover)</strong> proyek.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Durasi Pengerjaan Renovasi
                    </label>
                    <Input
                      value={renovationDuration}
                      onChange={(e) => setRenovationDuration(e.target.value)}
                      placeholder="Contoh: 60 Hari Kalender"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Lingkup Pekerjaan / Transformasi
                    </label>
                    <Input
                      value={transformationScope}
                      onChange={(e) => setTransformationScope(e.target.value)}
                      placeholder="Contoh: Fasad Eksterior & Pagar Modern"
                    />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </div>

        {/* Right Column: SEO Engine & Live Google Preview */}
        <div className="lg:col-span-5 space-y-6">
          {/* Status Card */}
          <Card className="shadow-xs rounded-[28px]">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-1.5">
                <CardTitle className="text-sm">Status & Keterlihatan Halaman</CardTitle>
                <HelpTooltip content="Pilih 'Live di Publik' jika proyek sudah selesai dirapikan dan siap ditampilkan ke calon klien di website resmi. Gunakan 'Draft' jika masih berupa konsep internal." />
              </div>
              <CardDescription>Tentukan apakah halaman proyek ini langsung aktif di website publik.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50">
                <div className="text-xs">
                  <span className="font-semibold text-slate-800 block">
                    {status === 'published' ? '🟢 Live di Website' : '📝 Draft (Tersimpan Saja)'}
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    {status === 'published' ? 'Bisa dibuka oleh umum & Google' : 'Hanya tampak di dashboard admin'}
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-white p-1 rounded-full shadow-xs">
                  <button
                    type="button"
                    onClick={() => setStatus('draft')}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                      status === 'draft' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-500'
                    }`}
                  >
                    Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('published')}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                      status === 'published' ? 'bg-[#22416D] text-white font-semibold shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Published
                  </button>
                </div>
              </div>

              {/* Featured Project Switch */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50">
                <div className="flex items-center gap-2">
                  <Star className={`w-4 h-4 ${featured ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
                  <div>
                    <span className="text-xs font-semibold text-slate-800 flex items-center">
                      Proyek Unggulan
                      <HelpTooltip content="Jika diaktifkan, proyek ini akan mendapat prioritas tampil di halaman depan (Home) website Bina Project sebagai karya sorotan utama." />
                    </span>
                    <span className="text-slate-500 text-[11px] block">Tampilkan di etalase beranda utama</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFeatured(!featured)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${featured ? 'bg-[#22416D]' : 'bg-slate-200'}`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${featured ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Smart Slug Engine Card with Padlock */}
          <Card className="shadow-xs rounded-[28px]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-slate-500" />
                  <span>Alamat Link Halaman (URL)</span>
                  <HelpTooltip content="Ini adalah alamat tautan proyek di website (misal: binaproject.com/portfolio/nama-proyek). Sistem membuatnya secara otomatis dari judul proyek agar rapi dan ramah Google." />
                </CardTitle>
                <div className="flex items-center gap-2">
                  {!isSlugLocked && (
                    <button
                      type="button"
                      onClick={() => {
                        setAutoSlug(true);
                        const generated = generateSlug(title);
                        setSlug(generated);
                        validateSlug(generated);
                      }}
                      className="text-xs text-[#22416D] hover:underline font-semibold cursor-pointer"
                    >
                      Reset dari Judul
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsSlugLocked((prev) => !prev)}
                    className={`flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full border transition-colors cursor-pointer ${
                      isSlugLocked
                        ? 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                        : 'border-amber-200 bg-amber-50 text-amber-800'
                    }`}
                    title={isSlugLocked ? 'Klik untuk mengubah alamat link secara manual' : 'Kunci kembali alamat link'}
                  >
                    {isSlugLocked ? (
                      <>
                        <Lock className="w-3 h-3 text-slate-500" />
                        <span>Terkunci</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3 h-3 text-amber-600" />
                        <span>Buka Kunci</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              <CardDescription>
                {isSlugLocked
                  ? 'Alamat link dikunci otomatis untuk mencegah link rusak tak sengaja.'
                  : 'Mode ubah link aktif. Gunakan huruf kecil dan tanda hubung (-).'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className={`flex rounded-full border shadow-xs transition-all overflow-hidden ${
                isSlugLocked ? 'bg-slate-50/80 border-slate-200' : 'bg-white border-[#22416D] ring-4 ring-[#22416D]/10'
              }`}>
                <span className="inline-flex items-center px-4 bg-slate-100 text-slate-500 text-xs font-mono select-none border-r border-slate-200">
                  /portfolio/
                </span>
                <input
                  type="text"
                  value={slug}
                  readOnly={isSlugLocked}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="villa-tropis-modern-batu"
                  className={`flex-1 px-4 py-2.5 text-xs font-mono focus:outline-none ${
                    isSlugLocked ? 'text-slate-600 bg-slate-50/80 cursor-not-allowed' : 'text-slate-900 bg-white'
                  }`}
                />
              </div>

              {/* Real-time slug check feedback */}
              <div className="text-xs pt-1 flex items-center justify-between flex-wrap gap-1">
                {slugAvailable === true && (
                  <span className="text-emerald-600 flex items-center gap-1 text-[11px] font-medium">
                    <Check className="w-3.5 h-3.5" /> Alamat link aman & siap dipakai
                  </span>
                )}
                {slugAvailable === false && (
                  <span className="text-rose-600 flex items-center gap-1 text-[11px] font-medium">
                    <AlertCircle className="w-3.5 h-3.5" /> Alamat link sudah pernah digunakan! Mohon ubah sedikit.
                  </span>
                )}
                {initialSlug && initialSlug !== slug && (
                  <span className="text-amber-600 text-[11px] font-medium">
                    (Pengalihan otomatis dari /{initialSlug} aktif agar link lama tidak error 404)
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Meta Tag Customization */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-1.5">
                <CardTitle className="text-sm">Pengaturan Google SEO (Opsional)</CardTitle>
                <HelpTooltip content="Pengaturan ini opsional. Jika dikosongkan, Google akan otomatis mengambil Judul dan Deskripsi proyek di sebelah kiri." />
              </div>
              <CardDescription>Kustomisasi judul dan kalimat promosi khusus di hasil pencarian Google.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1 flex items-center">
                  Judul Tampilan Google (Meta Title)
                  <HelpTooltip content="Judul biru tebal yang tampil di Google. Disarankan 50-60 karakter." />
                </label>
                <Input
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Contoh: Kontraktor Villa Tropis Modern Batu | Mutu Bergaransi"
                  className="h-8 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1 flex items-center">
                  Kalimat Ringkasan Google (Meta Description)
                  <HelpTooltip content="Kalimat 1-2 baris di bawah judul pada Google. Disarankan 120-160 karakter untuk memikat calon klien mengklik." />
                </label>
                <Textarea
                  rows={2}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Ringkasan 140-160 karakter untuk memikat calon klien di Google..."
                  className="text-xs"
                />
              </div>

              {/* OG Social Share Preview Selector */}
              <div className="pt-3 border-t border-slate-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    Tampilan Media Sosial (OG Image)
                    <HelpTooltip content="Pilih tampilan gambar kartu ketika portofolio dibagikan ke WhatsApp, Facebook, LinkedIn, atau Twitter." />
                  </label>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-medium px-2 py-0.5 rounded-full">
                    1200 × 630 px
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setOgImageType('branded');
                      setIsDirty(true);
                    }}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      ogImageType === 'branded'
                        ? 'border-amber-500 bg-amber-50/60 ring-1 ring-amber-500'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-medium text-xs text-slate-900">
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      Split-Screen Otomatis
                      <span className="text-[9px] text-amber-700 font-bold bg-amber-100 px-1 py-0.2 rounded">Rekomendasi</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Kartu modern berlogo resmi, judul rapi, badge kategori, dan foto proyek di sisi kanan.
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOgImageType('raw_cover');
                      setIsDirty(true);
                    }}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      ogImageType === 'raw_cover'
                        ? 'border-amber-500 bg-amber-50/60 ring-1 ring-amber-500'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-medium text-xs text-slate-900">
                      <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
                      Foto Sampul Asli
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Menggunakan file foto cover proyek polos tanpa grafis tambahan.
                    </p>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Live Google Preview */}
          <GoogleSerpPreview
            title={title}
            metaTitle={metaTitle}
            description={description}
            metaDescription={metaDescription}
            slug={slug}
            type="portfolio"
            publishedDate={projectDate}
          />
        </div>
      </div>

      {/* Sticky Bottom Floating Action Bar */}
      <div className="fixed bottom-0 left-0 md:left-72 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-3 px-4 md:px-8 shadow-lg flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Status Publikasi:</span>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
              status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            {status === 'published' ? 'Tayang (Published)' : 'Draft'}
          </span>
          {isDirty && (
            <span className="text-xs text-amber-600 font-medium hidden sm:inline flex items-center gap-1">
              • Ada perubahan belum disimpan
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleBack}
            disabled={saving || deploying}
            className="text-xs h-9 px-3 text-slate-600"
          >
            Batal
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleSave(false)}
            disabled={saving || deploying}
            className="text-xs h-9 px-3.5 gap-1.5 text-slate-800 font-semibold"
          >
            <Save className="w-3.5 h-3.5 text-slate-500" />
            <span>{saving && !deploying ? 'Menyimpan...' : 'Simpan Saja'}</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => handleSave(true)}
            disabled={saving || deploying}
            className="text-xs h-9 px-4 gap-1.5 bg-[#22416D] hover:bg-[#1A3356] text-white shadow-xs font-semibold"
          >
            {deploying ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Rocket className="w-3.5 h-3.5" />
            )}
            <span>{deploying ? 'Deploying...' : 'Simpan & Deploy'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PortfolioEditor;
