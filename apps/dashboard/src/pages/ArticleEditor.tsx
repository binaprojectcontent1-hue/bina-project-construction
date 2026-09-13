import React, { useState, useEffect } from 'react';
export interface Article {
  id?: string;
  slug: string;
  title: string;
  author: string;
  publish_date: string;
  category: string;
  excerpt: string;
  content: string;
  cover_image: string;
  meta_title?: string;
  meta_description?: string;
  focus_keyword?: string;
  alt_cover_image?: string;
  status?: string;
  reading_time?: number;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
}
import { supabase } from '../lib/supabase';
import { generateSlug, checkSlugAvailability, record301Redirect } from '../utils/slug';
import { articleFormSchema } from '../schemas/articleSchema';
import { GoogleSerpPreview } from '../components/GoogleSerpPreview';
import { ImageUploader } from '../components/ImageUploader';
import { RichTextEditor } from '../components/RichTextEditor';
import { HelpTooltip } from '../components/ui/HelpTooltip';
import { triggerCloudflareDeploy } from '../lib/cloudflare';
import { submitContentUrl } from '../lib/indexing';
import { Button } from '../components/ui/button';
import { Input, Textarea } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { useToast } from '../components/ui/Toast';

interface ArticleEditorProps {
  articleId?: string;
  onBack?: () => void;
  onSave?: (id: string) => void;
}

import {
  ArrowLeft,
  Save,
  Globe,
  Check,
  AlertCircle,
  RefreshCw,
  Rocket,
  Send,
  Lock,
  Unlock,
} from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';

export function ArticleEditor({ articleId, onBack, onSave }: ArticleEditorProps) {
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
  const [category, setCategory] = useState('Interior');
  const [author, setAuthor] = useState('Bina Project Editorial');
  const [publishDate, setPublishDate] = useState(
    new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  );
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [altCoverImage, setAltCoverImage] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [readingTime, setReadingTime] = useState(3);

  // SEO Fields
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [focusKeyword, setFocusKeyword] = useState('');
  const [ogImageType, setOgImageType] = useState<'branded' | 'raw_cover'>('branded');
  const [autoSlug, setAutoSlug] = useState(!articleId);
  const [isSlugLocked, setIsSlugLocked] = useState(Boolean(articleId));
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    if (!articleId || !supabase) return;

    async function loadArticle() {
      setLoading(true);
      try {
        const { data, error: err } = await supabase!
          .from('articles')
          .select('*')
          .eq('id', articleId)
          .single();

        if (err) throw err;
        if (data) {
          setTitle(data.title || '');
          setSlug(data.slug || '');
          setInitialSlug(data.slug || '');
          setCategory(data.category || 'Interior');
          setAuthor(data.author || 'Bina Project');
          setPublishDate(data.publish_date || '');
          setExcerpt(data.excerpt || '');
          setContent(data.content || '');
          setCoverImage(data.cover_image || '');
          setAltCoverImage(data.alt_cover_image || '');
          setStatus(data.status || 'published');
          setReadingTime(data.reading_time || 3);
          setMetaTitle(data.meta_title || '');
          setMetaDescription(data.meta_description || '');
          setFocusKeyword(data.focus_keyword || '');
          if (data.og_image_type) {
            setOgImageType(data.og_image_type);
          }
          setAutoSlug(false);
          setIsSlugLocked(true);
          setIsDirty(false);
        }
      } catch (err: any) {
        setError('Gagal memuat artikel: ' + err.message);
        toast.error('Gagal Memuat Artikel', err.message);
      } finally {
        setLoading(false);
      }
    }

    loadArticle();
  }, [articleId]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setIsDirty(true);
    if (autoSlug && !isSlugLocked) {
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
    const isAvail = await checkSlugAvailability(checkValue, 'articles', articleId);
    setSlugAvailable(isAvail);
  };

  // Guard against accidental loss of unsaved changes
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
      if (!window.confirm('Ada perubahan artikel yang belum disimpan. Yakin ingin keluar?')) {
        return;
      }
    }
    onBack && onBack();
  };

  const handleContentChange = (val: string) => {
    setContent(val);
    const words = val.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 200));
    setReadingTime(minutes);
  };

  const handleSave = async (autoDeploy = false) => {
    // Validate with centralized Zod Schema
    const validation = articleFormSchema.safeParse({
      title,
      slug,
      category,
      excerpt,
      content,
      cover_image: coverImage,
      alt_cover_image: altCoverImage,
      meta_title: metaTitle,
      meta_description: metaDescription,
      focus_keyword: focusKeyword,
      author,
      og_image_type: ogImageType,
      is_published: status === 'published',
      is_featured: false,
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

      const isAvail = await checkSlugAvailability(slug, 'articles', articleId);
      if (!isAvail) {
        throw new Error(`Slug URL "${slug}" sudah digunakan pada artikel lain.`);
      }

      // 301 Redirect Protection
      if (articleId && initialSlug && initialSlug !== slug && status === 'published') {
        const redirectRes = await record301Redirect(initialSlug, slug, 'blog');
        if (!redirectRes.success) {
          console.warn('Gagal mencatat 301 redirect artikel:', redirectRes.message);
        }
      }

      const payload: Record<string, any> = {
        title,
        slug,
        category,
        author,
        publish_date: publishDate,
        excerpt,
        content,
        cover_image: coverImage,
        alt_cover_image: altCoverImage,
        og_image_type: ogImageType,
        status,
        reading_time: readingTime,
        meta_title: metaTitle || null,
        meta_description: metaDescription || null,
        focus_keyword: focusKeyword || null,
        updated_at: new Date().toISOString(),
      };

      if (articleId) {
        let { error: updateErr } = await supabase
          .from('articles')
          .update(payload)
          .eq('id', articleId);
        if (updateErr && updateErr.message?.includes('og_image_type')) {
          delete payload.og_image_type;
          const retry = await supabase.from('articles').update(payload).eq('id', articleId);
          updateErr = retry.error;
        }
        if (updateErr) throw updateErr;
      } else {
        const insertData: Record<string, any> = {
          ...payload,
          published_at: status === 'published' ? new Date().toISOString() : null,
        };
        let { error: insertErr } = await supabase.from('articles').insert([insertData]);
        if (insertErr && insertErr.message?.includes('og_image_type')) {
          delete insertData.og_image_type;
          const retry = await supabase.from('articles').insert([insertData]);
          insertErr = retry.error;
        }
        if (insertErr) throw insertErr;
      }

      setIsDirty(false);
      toast.success('Artikel Berhasil Disimpan', 'Data artikel telah tersimpan ke database.');
      setSuccess('Artikel berhasil disimpan!');

      if (autoDeploy) {
        setDeploying(true);
        const deployToastId = toast.loading('Memicu deployment & sinyal pengindeksan...');
        const [deployRes] = await Promise.all([
          triggerCloudflareDeploy(),
          submitContentUrl('blog', slug).catch(() => null),
        ]);
        toast.dismiss(deployToastId);
        if (deployRes.success) {
          toast.success(
            'Deploy & Indexing Terpicu',
            'Website sedang diperbarui & URL telah dikirim ke IndexNow untuk pengindeksan instan.'
          );
          setSuccess('Artikel tersimpan, Trigger Deploy ke Cloudflare Pages & IndexNow berhasil dikirim!');
        } else {
          toast.error('Deploy Gagal', deployRes.message);
          setError('Artikel tersimpan, namun webhook Cloudflare gagal: ' + deployRes.message);
        }
        setDeploying(false);
      }

      setTimeout(() => {
        onSave && onSave(articleId!);
      }, 1200);
    } catch (err: any) {
      const msg = err?.message || 'Terjadi kesalahan saat menyimpan artikel.';
      setError(msg);
      toast.error('Gagal Menyimpan Artikel', msg);
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
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-44 w-full rounded-xl" />
              </div>
            </Card>
            <Card className="p-6 space-y-4 rounded-2xl">
              <Skeleton className="h-5 w-40 rounded-md" />
              <Skeleton className="h-48 w-full rounded-xl" />
            </Card>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <Card className="p-5 space-y-3 rounded-2xl">
              <Skeleton className="h-5 w-32 rounded-md" />
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
    <div className="space-y-6 max-w-6xl mx-auto pb-28">
      {/* Sticky Action Bar */}
      <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3.5 bg-[#F8FAFC]/95 backdrop-blur-md border-b border-slate-200/80 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all">
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="outline"
            size="icon"
            onClick={handleBack}
            className="h-9 w-9 rounded-xl text-slate-600 hover:bg-white shadow-xs cursor-pointer shrink-0"
            title="Kembali ke Daftar Artikel"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 truncate">
                {articleId ? 'Edit Artikel' : 'Tulis Artikel Baru'}
              </h2>
              <Badge variant="outline" className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${status === 'published' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                {status === 'published' ? '🟢 Tayang di Web' : '🟡 Draft (Konsep)'}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              Tulis konten edukasi arsitektur & konstruksi untuk pembaca dan optimasi SEO Google.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSave(false)}
            disabled={saving || deploying}
            className="text-xs font-bold gap-1.5 h-9 px-3.5 rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer shadow-xs"
            title="Simpan draf artikel tanpa langsung memicu perubahan di website publik"
          >
            <Save className="w-3.5 h-3.5 text-slate-500" />
            <span>{saving && !deploying ? 'Menyimpan...' : 'Simpan Draft'}</span>
          </Button>

          <Button
            size="sm"
            onClick={() => handleSave(true)}
            disabled={saving || deploying}
            className="text-xs font-bold gap-2 h-9 px-4 rounded-xl bg-[#22416D] hover:bg-[#1A3356] text-white shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            title="Simpan artikel dan publikasikan langsung ke website live"
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

      {error && (
        <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="p-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Main Two Column Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Content */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-900">
                Konten & Naskah Artikel
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Informasi utama artikel yang akan tampil pada halaman pembaca
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-800 block">
                  Judul Artikel <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Contoh: 7 Tips Memilih Kontraktor Bangunan Terpercaya di Malang"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-800 block">Kategori Artikel</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-800 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22416D]/30 focus-visible:border-[#22416D]"
                  >
                    <option value="Interior">Interior</option>
                    <option value="Konstruksi">Konstruksi</option>
                    <option value="Arsitektur">Arsitektur</option>
                    <option value="Tips & Panduan">Tips & Panduan</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-800 block">Penulis (Author)</label>
                  <Input
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Bina Project Editorial"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-800 flex items-center">
                  Ringkasan Singkat Artikel <span className="text-rose-500 ml-0.5">*</span>
                  <HelpTooltip content="Paragraf pendek (1-2 kalimat) yang muncul di kartu artikel pada blog utama dan cuplikan pencarian Google untuk memikat pembaca." />
                </label>
                <Textarea
                  rows={3}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Tulis 1-2 kalimat ringkasan yang menarik minat calon pembaca..."
                />
              </div>

              <div className="space-y-1.5 pt-2">
                <RichTextEditor
                  label="Isi Konten Artikel"
                  value={content}
                  onChange={handleContentChange}
                  readingTime={readingTime}
                  placeholder="Tulis naskah artikel Anda di sini. Gunakan tombol toolbar di atas untuk menebalkan teks, membuat judul bab, atau menambahkan daftar poin..."
                />
              </div>
            </CardContent>
          </Card>

          <ImageUploader
            label="Cover Gambar Artikel"
            value={coverImage}
            onChange={setCoverImage}
            altText={altCoverImage}
            onAltChange={setAltCoverImage}
            bucket="media"
            folder="blog"
            requiredAlt={true}
          />
        </div>

        {/* Right Column: SEO Configuration */}
        <div className="lg:col-span-5 space-y-6">
          {/* Smart Slug Engine with Padlock */}
          <Card className="shadow-xs rounded-2xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-1.5 font-semibold text-slate-900">
                  <Globe className="w-4 h-4 text-slate-500" />
                  <span>Alamat Link Artikel (URL)</span>
                  <HelpTooltip content="Alamat tautan permanen artikel di web (misal: binaproject.com/blog/tips-memilih-kontraktor). Otomatis dibuat dari judul agar rapi dan ramah SEO Google." />
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
                    className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg border transition-colors cursor-pointer ${
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
              <CardDescription className="text-xs text-slate-500">
                {isSlugLocked
                  ? 'Alamat link dikunci otomatis untuk mencegah link artikel rusak tak sengaja.'
                  : 'Mode ubah link aktif. Gunakan huruf kecil dan tanda hubung (-).'}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-2 space-y-3">
              <div className="space-y-1.5">
                <div className={`flex rounded-xl border shadow-xs transition-all overflow-hidden ${
                  isSlugLocked ? 'bg-slate-50/80 border-slate-200' : 'bg-white border-[#22416D] ring-2 ring-[#22416D]/10'
                }`}>
                  <span className="inline-flex items-center px-3 bg-slate-100 text-slate-500 text-xs font-mono select-none border-r border-slate-200">
                    /blog/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    readOnly={isSlugLocked}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="tips-memilih-kontraktor-malang"
                    className={`flex-1 px-3 py-2 text-xs font-mono focus:outline-none ${
                      isSlugLocked ? 'text-slate-600 bg-slate-50/80 cursor-not-allowed' : 'text-slate-900 bg-white'
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1 flex-wrap gap-1">
                  {slugAvailable === true && (
                    <span className="text-emerald-600 flex items-center gap-1 font-medium text-[11px]">
                      <Check className="w-3.5 h-3.5" /> Alamat link aman & siap dipakai
                    </span>
                  )}
                  {slugAvailable === false && (
                    <span className="text-rose-600 flex items-center gap-1 font-medium text-[11px]">
                      <AlertCircle className="w-3.5 h-3.5" /> Alamat link sudah pernah digunakan! Mohon ubah sedikit.
                    </span>
                  )}
                  {initialSlug && initialSlug !== slug && (
                    <span className="text-amber-600 text-[11px] font-medium">
                      (Pengalihan otomatis dari /{initialSlug} aktif agar link lama tidak error 404)
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center">
                  Target Kata Kunci Google (Focus Keyword)
                  <HelpTooltip content="Kata atau kalimat pencarian yang sering diketikkan orang di Google saat mencari topik ini (misal: 'biaya bangun rumah di malang')." />
                </label>
                <Input
                  value={focusKeyword}
                  onChange={(e) => setFocusKeyword(e.target.value)}
                  placeholder="Contoh: kontraktor rumah malang"
                  className="rounded-xl h-10 text-xs"
                />
              </div>
            </CardContent>
          </Card>

          {/* Visibility & Status Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-900">
                Status Publikasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div>
                  <label className="text-xs font-medium text-slate-700 block flex items-center">
                    Status Publikasi
                    <HelpTooltip content="Pilih 'Live' agar artikel tayang di website bina-project.com dan bisa dibaca publik, atau 'Draft' jika naskah masih disunting." />
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {status === 'published' ? '🟢 Live di Website & Google' : '📝 Draft Tersimpan'}
                  </span>
                </div>
                <div className="flex items-center p-0.5 bg-slate-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setStatus('draft')}
                    className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                      status === 'draft' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('published')}
                    className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                      status === 'published' ? 'bg-[#22416D] text-white shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Published
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Custom Meta Tag Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-1.5">
                <CardTitle className="text-sm font-semibold text-slate-900">
                  Pengaturan Google SEO (Opsional)
                </CardTitle>
                <HelpTooltip content="Pengaturan ini opsional. Jika dikosongkan, Google akan otomatis mengambil Judul Artikel dan Ringkasan Anda." />
              </div>
              <CardDescription className="text-xs text-slate-500">
                Kustomisasi judul dan kalimat promosi khusus di hasil pencarian Google
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4 space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 flex items-center">
                  Judul Tampilan Google (Meta Title)
                  <HelpTooltip content="Judul biru yang tampil di hasil pencarian Google. Disarankan 50-60 karakter." />
                </label>
                <Input
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Contoh: 7 Tips Kontraktor Rumah Malang Terbaik (Panduan 2026)"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 flex items-center">
                  Kalimat Ringkasan Google (Meta Description)
                  <HelpTooltip content="Kalimat 1-2 baris di bawah judul pada hasil pencarian Google. Disarankan 120-160 karakter." />
                </label>
                <Textarea
                  rows={2}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Deskripsi 140-160 karakter untuk menarik klik dari pembaca Google..."
                />
              </div>

              {/* OG Social Share Preview Selector */}
              <div className="pt-3 border-t border-slate-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    Tampilan Media Sosial (OG Image)
                    <HelpTooltip content="Pilih tampilan gambar kartu ketika tautan dibagikan ke WhatsApp, Facebook, LinkedIn, atau Twitter." />
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
                      Kartu modern berlogo resmi, judul rapi, badge kategori, dan foto cover di sisi kanan.
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
                      Foto Cover Asli
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Menggunakan file foto cover polos tanpa grafis tambahan.
                    </p>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Google SERP Simulation */}
          <GoogleSerpPreview
            title={title}
            metaTitle={metaTitle}
            description={excerpt}
            metaDescription={metaDescription}
            slug={slug}
            type="blog"
            publishedDate={publishDate}
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
          <span className="text-xs text-slate-400 hidden md:inline">
            • {readingTime} menit baca
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
            <span>{saving && !deploying ? 'Menyimpan...' : 'Simpan Draft'}</span>
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
};
