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

// Solar Icon Components (lightweight SVG replacements for Lucide)
const Icon = {
  ArrowLeft: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>,
  Save: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  Globe: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Check: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12"/></svg>,
  AlertCircle: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>,
  RefreshCw: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>,
  Rocket: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>,
  Send: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>,
};

const { ArrowLeft, Save, Globe, Check, AlertCircle, RefreshCw, Rocket, Send } = Icon;


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
  const [autoSlug, setAutoSlug] = useState(true);
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
          setAutoSlug(false);
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

      const payload = {
        title,
        slug,
        category,
        author,
        publish_date: publishDate,
        excerpt,
        content,
        cover_image: coverImage,
        alt_cover_image: altCoverImage,
        status,
        reading_time: readingTime,
        meta_title: metaTitle || null,
        meta_description: metaDescription || null,
        focus_keyword: focusKeyword || null,
        updated_at: new Date().toISOString(),
      };

      if (articleId) {
        const { error: updateErr } = await supabase
          .from('articles')
          .update(payload)
          .eq('id', articleId);
        if (updateErr) throw updateErr;
      } else {
        const { error: insertErr } = await supabase
          .from('articles')
          .insert([
            {
              ...payload,
              published_at: status === 'published' ? new Date().toISOString() : null,
            },
          ]);
        if (insertErr) throw insertErr;
      }

      setIsDirty(false);
      toast.success('Artikel Berhasil Disimpan', 'Data artikel telah tersimpan ke database.');
      setSuccess('Artikel berhasil disimpan!');

      if (autoDeploy) {
        setDeploying(true);
        const deployToastId = toast.loading('Memicu deployment ke Cloudflare Pages...');
        const deployRes = await triggerCloudflareDeploy();
        toast.dismiss(deployToastId);
        if (deployRes.success) {
          toast.success('Deployment Terpicu', 'Website sedang diperbarui otomatis (~45s).');
          setSuccess('Artikel tersimpan & Trigger Deploy ke Cloudflare Pages berhasil dikirim!');
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
      <Card className="p-16 text-center text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-500" />
        <span className="text-xs font-medium">Memuat data artikel...</span>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-28">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={handleBack}
            className="h-9 w-9 text-slate-600"
            title="Kembali ke Daftar"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs uppercase font-semibold">
                {articleId ? 'Edit Mode' : 'New Article'}
              </Badge>
              <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                {articleId ? 'Edit Artikel' : 'Tulis Artikel SEO Baru'}
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Konten edukasi arsitektur dan tips konstruksi untuk pembaca & Google
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => handleSave(false)}
            disabled={saving || deploying}
            className="gap-2"
          >
            <Save className="w-4 h-4 text-slate-500" />
            <span>{saving && !deploying ? 'Menyimpan...' : 'Simpan Draft'}</span>
          </Button>

          <Button
            onClick={() => handleSave(true)}
            disabled={saving || deploying}
            className="gap-2"
          >
            {deploying ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Simpan & Terbitkan</span>
              </>
            )}
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
          {/* Smart Slug Engine */}
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-slate-600" />
                <CardTitle className="text-sm font-semibold text-slate-900">
                  Alamat Web Artikel (URL)
                </CardTitle>
                <HelpTooltip content="Alamat tautan permanen artikel di web (misal: binaproject.com/blog/tips-memilih-kontraktor). Otomatis dibuat dari judul agar rapi dan ramah SEO Google." />
              </div>
              <button
                type="button"
                onClick={() => {
                  setAutoSlug(true);
                  const generated = generateSlug(title);
                  setSlug(generated);
                  validateSlug(generated);
                }}
                className="text-[11px] text-slate-500 hover:text-[#22416D] underline font-medium"
              >
                Buat Otomatis
              </button>
            </CardHeader>

            <CardContent className="pt-4 space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">
                  Alamat Tautan URL (Slug) <span className="text-rose-500">*</span>
                </label>
                <div className="flex rounded-md border border-slate-200 overflow-hidden focus-within:ring-1 focus-within:ring-[#22416D]">
                  <span className="inline-flex items-center px-3 bg-slate-50 text-slate-500 text-xs font-mono select-none border-r border-slate-200">
                    /blog/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="tips-memilih-kontraktor-malang"
                    className="flex-1 px-3 py-1.5 text-xs font-mono text-slate-900 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  {slugAvailable === true && (
                    <span className="text-emerald-600 flex items-center gap-1 font-medium text-[11px]">
                      <Check className="w-3.5 h-3.5" /> Alamat URL valid & tersedia
                    </span>
                  )}
                  {slugAvailable === false && (
                    <span className="text-rose-600 flex items-center gap-1 font-medium text-[11px]">
                      <AlertCircle className="w-3.5 h-3.5" /> Alamat URL sudah pernah dipakai!
                    </span>
                  )}
                  {initialSlug && initialSlug !== slug && (
                    <span className="text-amber-600 text-xs font-medium">
                      (Tautan lama /{initialSlug} otomatis dialihkan aman)
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 flex items-center">
                  Target Kata Kunci (Focus Keyword)
                  <HelpTooltip content="Kata atau kalimat pencarian yang sering diketikkan orang di Google saat mencari topik ini (misal: 'biaya bangun rumah di malang')." />
                </label>
                <Input
                  value={focusKeyword}
                  onChange={(e) => setFocusKeyword(e.target.value)}
                  placeholder="Contoh: kontraktor rumah malang"
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
