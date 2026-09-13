import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, Globe, Check, AlertCircle, RefreshCw, Rocket, Sparkles, Star } from 'lucide-react';
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
  const [autoSlug, setAutoSlug] = useState(true);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);

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
          setGalleryImages(Array.isArray(data.gallery_images) ? data.gallery_images : []);
          setFeatured(Boolean(data.featured));
          setStatus(data.status || 'published');
          setMetaTitle(data.meta_title || '');
          setMetaDescription(data.meta_description || '');
          if (data.og_image_type) {
            setOgImageType(data.og_image_type);
          }
          setAutoSlug(false);
          setIsDirty(false);
        }
      } catch (err: any) {
        setError('Gagal memuat detail proyek: ' + err.message);
        toast.error('Gagal Memuat Proyek', err.message);
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
        meta_title: metaTitle || null,
        meta_description: metaDescription || null,
        og_image_type: ogImageType,
        updated_at: new Date().toISOString(),
      };

      if (projectId) {
        let { error: updateErr } = await supabase
          .from('projects')
          .update(payload)
          .eq('id', projectId);
        if (updateErr && updateErr.message?.includes('og_image_type')) {
          delete payload.og_image_type;
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
        if (insertErr && insertErr.message?.includes('og_image_type')) {
          delete insertData.og_image_type;
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
      <Card className="p-12 text-center text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-600" />
        <p className="text-xs">Memuat data proyek...</p>
      </Card>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-28">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={handleBack} className="h-8 w-8 text-slate-600">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              {projectId ? 'Edit Portofolio Proyek' : 'Tambah Portofolio Baru'}
            </h2>
            <p className="text-xs text-slate-500">
              Sesuaikan rincian pengerjaan, gambar dokumentasi, dan optimasi slug SEO.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSave(false)}
            disabled={saving || deploying}
            className="text-xs gap-1.5"
          >
            <Save className="w-3.5 h-3.5 text-slate-500" />
            <span>{saving && !deploying ? 'Menyimpan...' : 'Simpan Saja'}</span>
          </Button>

          <Button
            size="sm"
            onClick={() => handleSave(true)}
            disabled={saving || deploying}
            className="text-xs gap-1.5 bg-[#22416D] hover:bg-[#1A3356]"
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

      {/* Toast Feedback */}
      {error && (
        <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="shadow-xs">
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
                    className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-800 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22416D]/30 focus-visible:border-[#22416D]"
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
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Contoh: Kota Batu, Jawa Timur"
                  />
                </div>
              </div>

              {/* Client & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-slate-800 block mb-1.5">Nama Klien (Opsional)</label>
                  <Input
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    placeholder="Contoh: Bpk. Hendra & Ibu Maya"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-800 block mb-1.5">Tahun / Tanggal</label>
                  <Input
                    value={projectDate}
                    onChange={(e) => setProjectDate(e.target.value)}
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
        </div>

        {/* Right Column: SEO Engine & Live Google Preview */}
        <div className="lg:col-span-5 space-y-6">
          {/* Status Card */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-1.5">
                <CardTitle className="text-sm">Status & Keterlihatan Halaman</CardTitle>
                <HelpTooltip content="Pilih 'Live di Publik' jika proyek sudah selesai dirapikan dan siap ditampilkan ke calon klien di website resmi. Gunakan 'Draft' jika masih berupa konsep internal." />
              </div>
              <CardDescription>Tentukan apakah halaman proyek ini langsung aktif di website publik.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div className="text-xs">
                  <span className="font-semibold text-slate-800 block">
                    {status === 'published' ? '🟢 Live di Website' : '📝 Draft (Tersimpan Saja)'}
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    {status === 'published' ? 'Bisa dibuka oleh umum & Google' : 'Hanya tampak di dashboard admin'}
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-white p-1 rounded-lg shadow-xs">
                  <button
                    type="button"
                    onClick={() => setStatus('draft')}
                    className={`px-2.5 py-1 text-xs font-medium rounded transition-all ${
                      status === 'draft' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-500'
                    }`}
                  >
                    Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('published')}
                    className={`px-2.5 py-1 text-xs font-medium rounded transition-all ${
                      status === 'published' ? 'bg-[#22416D] text-white font-semibold shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Published
                  </button>
                </div>
              </div>

              {/* Featured Project Switch */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
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
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${featured ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Smart Slug Engine Card */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-slate-500" />
                  <span>Alamat Web Halaman (URL)</span>
                  <HelpTooltip content="Ini adalah tautan link halaman proyek (contoh: binaproject.com/portfolio/nama-proyek). Sistem otomatis membuatnya dari judul proyek agar rapi dan ramah pencarian Google." />
                </CardTitle>
                <button
                  type="button"
                  onClick={() => {
                    setAutoSlug(true);
                    const generated = generateSlug(title);
                    setSlug(generated);
                    validateSlug(generated);
                  }}
                  className="text-xs text-[#22416D] hover:underline font-medium"
                >
                  Buat Otomatis dari Judul
                </button>
              </div>
              <CardDescription>Alamat link bersih yang mudah dibaca oleh calon klien & Google.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex rounded-md border border-slate-200 shadow-xs focus-within:ring-1 focus-within:ring-[#22416D] overflow-hidden">
                <span className="inline-flex items-center px-2.5 bg-slate-50 text-slate-500 text-xs font-mono select-none border-r border-slate-200">
                  /portfolio/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="villa-tropis-modern-batu"
                  className="flex-1 px-3 py-1.5 text-xs font-mono text-slate-900 focus:outline-none bg-white"
                />
              </div>

              {/* Real-time slug check feedback */}
              <div className="text-xs pt-1 flex items-center justify-between">
                {slugAvailable === true && (
                  <span className="text-emerald-600 flex items-center gap-1 text-[11px] font-medium">
                    <Check className="w-3.5 h-3.5" /> Alamat URL tersedia & siap dipakai
                  </span>
                )}
                {slugAvailable === false && (
                  <span className="text-rose-600 flex items-center gap-1 text-[11px] font-medium">
                    <AlertCircle className="w-3.5 h-3.5" /> Alamat URL sudah pernah dipakai! Mohon ganti sedikit.
                  </span>
                )}
                {initialSlug && initialSlug !== slug && (
                  <span className="text-amber-600 text-[11px]">
                    (Tautan lama /{initialSlug} otomatis dialihkan aman)
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
