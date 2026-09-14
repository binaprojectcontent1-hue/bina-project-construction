import React, { useState, useEffect } from 'react';
import {
  Rocket,
  Check,
  AlertCircle,
  RefreshCw,
  Database,
  Globe,
  Key,
  HardDrive,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  ShieldCheck,
  ExternalLink,
  Radio,
  Send,
  CheckCircle2,
  Settings as SettingsIcon,
  Zap,
  Lock,
  Activity,
} from 'lucide-react';
import { getStoredDeployHookUrl, setStoredDeployHookUrl, triggerCloudflareDeploy } from '../lib/cloudflare';
import { isSupabaseConfigured } from '../lib/supabase';
import { isGitHubConfigured } from '../lib/github';
import { HelpTooltip } from '../components/ui/HelpTooltip';
import { Input } from '../components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { deployRateLimiter } from '../lib/rate-limiter';
import { validateInput, cloudflareDeployHookSchema } from '../lib/validation-schemas';
import { useToast } from '../components/ui/Toast';
import {
  INDEXNOW_KEY,
  INDEXNOW_HOST,
  submitToIndexNow,
  pingSearchEngines,
  type IndexingResult,
} from '../lib/indexing';
import type { User } from '@supabase/supabase-js';

export const Settings: React.FC<{ user?: User }> = ({ user }) => {
  const toast = useToast();

  // Advanced toggle
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Cloudflare State
  const [hookUrl, setHookUrl] = useState('');
  const [cfSaved, setCfSaved] = useState(false);
  const [cfTesting, setCfTesting] = useState(false);
  const [cfTestResult, setCfTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [cfRateLimited, setCfRateLimited] = useState(false);
  const [cfRemainingAttempts, setCfRemainingAttempts] = useState(10);

  // One-click quick deploy state
  const [quickDeploying, setQuickDeploying] = useState(false);
  const [quickDeployResult, setQuickDeployResult] = useState<{ success: boolean; message: string } | null>(null);
  const [deployRateInfo, setDeployRateInfo] = useState({ attempts: 0, remainingAttempts: 10, isBlocked: false });

  // IndexNow & Search Engine Indexing State
  const [indexingRunning, setIndexingRunning] = useState(false);
  const [manualUrlInput, setManualUrlInput] = useState('');
  const [manualSubmitting, setManualSubmitting] = useState(false);
  const [indexingResult, setIndexingResult] = useState<IndexingResult | null>(null);

  useEffect(() => {
    setHookUrl(getStoredDeployHookUrl());
    updateUserStatus();
  }, []);

  const updateUserStatus = async () => {
    if (!user?.id) return;
    const status = await deployRateLimiter.getStatus(`deploy_${user.id}`);
    setDeployRateInfo(status);
    setCfRemainingAttempts(status.remainingAttempts);
    setCfRateLimited(status.isBlocked);
  };

  const handleSaveCf = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateInput(
      cloudflareDeployHookSchema,
      { url: hookUrl },
      'CloudflareHook'
    );
    
    if (!validation.success) {
      toast.error('Validasi Gagal', validation.error);
      return;
    }
    
    setStoredDeployHookUrl(hookUrl);
    setCfSaved(true);
    toast.success('Webhook Tersimpan', 'Deploy hook Cloudflare telah diperbarui.');
    setTimeout(() => setCfSaved(false), 3000);
  };

  const handleQuickDeploy = async () => {
    if (!user?.id) {
      setQuickDeployResult({ success: false, message: 'User tidak terautentikasi.' });
      return;
    }

    const rateStatus = await deployRateLimiter.isAllowed(`deploy_${user.id}`);
    if (!rateStatus.allowed) {
      const resetTime = new Date(rateStatus.blockedUntil!).toLocaleString('id-ID');
      setQuickDeployResult({ 
        success: false, 
        message: `Terlalu banyak permintaan deploy. Silakan coba lagi setelah ${resetTime}.` 
      });
      return;
    }

    setQuickDeploying(true);
    setQuickDeployResult(null);
    
    try {
      const res = await triggerCloudflareDeploy(hookUrl, user.id);
      if (res.success) {
        const updatedStatus = await deployRateLimiter.getStatus(`deploy_${user.id}`);
        setDeployRateInfo(updatedStatus);
        setCfRemainingAttempts(updatedStatus.remainingAttempts);
        toast.success(
          'Permintaan Update Terkirim',
          'Cloudflare sedang mem-build ulang website live (~45 detik).'
        );
      }
      setQuickDeployResult(res);
    } finally {
      setQuickDeploying(false);
    }
  };

  const handleTestDeploy = async () => {
    setCfTesting(true);
    setCfTestResult(null);
    try {
      const res = await triggerCloudflareDeploy(hookUrl);
      setCfTestResult(res);
      if (res.success) {
        toast.success('Trigger Berhasil', res.message);
      } else {
        toast.error('Trigger Gagal', res.message);
      }
    } finally {
      setCfTesting(false);
    }
  };

  const handleBroadcastAll = async () => {
    setIndexingRunning(true);
    setIndexingResult(null);
    try {
      const corePages = [
        '/',
        '/tentang-kami',
        '/layanan',
        '/portfolio',
        '/blog',
        '/kontak',
      ];
      const res = await submitToIndexNow(corePages);
      await pingSearchEngines();
      setIndexingResult(res);

      if (res.success) {
        toast.success(
          'IndexNow & Ping Berhasil',
          `6 halaman utama dikirim ke Bing, Yandex, dan ping sitemap ke Google.`
        );
      } else {
        toast.error('Gagal Mengirim ke IndexNow', res.message);
      }
    } catch (err: any) {
      toast.error('Kesalahan Indexing', err?.message || 'Gagal mengirim sinyal indeks.');
    } finally {
      setIndexingRunning(false);
    }
  };

  const handleManualIndexNow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrlInput.trim()) return;

    setManualSubmitting(true);
    setIndexingResult(null);
    try {
      const res = await submitToIndexNow([manualUrlInput.trim()]);
      await pingSearchEngines();
      setIndexingResult(res);

      if (res.success) {
        toast.success(
          'IndexNow Terkirim',
          `URL berhasil dikirim ke IndexNow (${res.status === 202 ? '202 Accepted' : '200 OK'}).`
        );
        setManualUrlInput('');
      } else {
        toast.error('IndexNow Ditolak', res.message);
      }
    } catch (err: any) {
      toast.error('Kesalahan Indexing', err?.message || 'Gagal menghubungi IndexNow.');
    } finally {
      setManualSubmitting(false);
    }
  };

  const ghActive = isGitHubConfigured();

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="p-2 rounded-xl bg-[#22416D] text-white shadow-sm">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
              Pengaturan & Publikasi Website
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Pusat kendali publikasi website live, pengindeksan instan mesin pencari, dan integrasi sistem.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://binaproject.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors shadow-2xs"
          >
            <span>Buka Website Asli</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </a>
        </div>
      </div>

      {/* 2. Main 2-Column Grid (Left Controls: 7 cols, Right Monitor: 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= LEFT COLUMN ================= */}
        <div className="lg:col-span-7 space-y-5">
          {/* Card 1: Perbarui Website Live */}
          <Card className="rounded-[24px] shadow-sm hover:shadow-md transition-shadow border-0 bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-50 text-[#22416D]">
                    <Rocket className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                      Perbarui Website Live
                      <HelpTooltip content="Memicu build otomatis di Cloudflare Pages agar perubahan portofolio, artikel, atau kontak langsung tampil di website publik dalam ~45 detik." />
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                      Kompilasi ulang website statis dengan data terbaru dari database
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-1 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Tekan tombol di bawah setelah menambah atau memperbarui konten agar perubahan langsung ditayangkan ke pengunjung website.
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleQuickDeploy}
                  disabled={quickDeploying || cfRateLimited}
                  className={`inline-flex items-center justify-center gap-2 px-6 h-10 rounded-full font-bold text-xs transition-all shadow-md shadow-[#22416D]/20 cursor-pointer active:scale-95 ${
                    cfRateLimited
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                      : 'bg-[#22416D] hover:bg-[#1A3356] text-white'
                  }`}
                >
                  {quickDeploying ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Rocket className="w-4 h-4" />
                  )}
                  <span>{quickDeploying ? 'Sedang Memproses Build...' : 'Perbarui Website Sekarang'}</span>
                </button>
              </div>

              {/* Rate Limit Warning */}
              {cfRateLimited && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
                  <div>
                    <strong className="font-semibold block mb-0.5">Batas Kuota Deploy Tercapai</strong>
                    Silakan tunggu hingga batas reset untuk memicu deploy berikutnya.
                  </div>
                </div>
              )}

              {/* Feedback Alert */}
              {quickDeployResult && (
                <div
                  className={`p-3.5 rounded-2xl text-xs flex items-center gap-2.5 border animate-in fade-in-50 ${
                    quickDeployResult.success
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}
                >
                  {quickDeployResult.success ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  )}
                  <span>
                    {quickDeployResult.success
                      ? 'Permintaan build terkirim ke Cloudflare! Website publik akan aktif dalam 30–60 detik.'
                      : quickDeployResult.message}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 2: Pengindeksan Instan Mesin Pencari (IndexNow) */}
          <Card className="rounded-[24px] shadow-sm hover:shadow-md transition-shadow border-0 bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                    <Radio className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                      Pengindeksan Instan Mesin Pencari
                      <HelpTooltip content="Mengirim sinyal URL langsung ke Microsoft Bing, Yandex, dan ping sitemap ke Google tanpa harus menunggu crawler berminggu-minggu." />
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                      Protokol IndexNow otomatis untuk halaman portofolio dan artikel
                    </CardDescription>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <Activity className="w-3.5 h-3.5 text-emerald-600" />
                  IndexNow Aktif
                </span>
              </div>
            </CardHeader>

            <CardContent className="pt-1 space-y-4">
              <div className="p-3.5 rounded-2xl bg-slate-50 flex items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                    Kunci Verifikasi Domain
                  </span>
                  <span className="font-mono text-slate-700 font-semibold text-xs">
                    {INDEXNOW_KEY}
                  </span>
                </div>
                <a
                  href={`https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline font-bold inline-flex items-center gap-1 shrink-0"
                >
                  <span>Cek Berkas</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Quick Actions & URL Form */}
              <div className="space-y-3 pt-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <button
                    type="button"
                    onClick={handleBroadcastAll}
                    disabled={indexingRunning}
                    className="inline-flex items-center gap-2 px-5 h-10 rounded-full bg-[#22416D] hover:bg-[#1A3356] text-white text-xs font-bold transition-all shadow-md shadow-[#22416D]/20 cursor-pointer disabled:opacity-50"
                  >
                    {indexingRunning ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>{indexingRunning ? 'Mengirim Sinyal...' : 'Kirim Seluruh Halaman Utama'}</span>
                  </button>

                  <span className="text-[11px] text-slate-400">
                    Beranda, Layanan, Portofolio, Blog, Kontak
                  </span>
                </div>

                {/* Manual URL Submit Form */}
                <form onSubmit={handleManualIndexNow} className="flex flex-col sm:flex-row gap-2 pt-1">
                  <Input
                    type="text"
                    placeholder="Contoh: /blog/tips-kitchen-set atau /portfolio/villa-batu"
                    value={manualUrlInput}
                    onChange={(e) => setManualUrlInput(e.target.value)}
                    className="text-xs font-mono h-10 flex-1 rounded-full px-4 border-slate-200"
                  />
                  <button
                    type="submit"
                    disabled={manualSubmitting || !manualUrlInput.trim()}
                    className="inline-flex items-center justify-center gap-2 px-5 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
                  >
                    {manualSubmitting ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>Kirim URL</span>
                  </button>
                </form>
              </div>

              {/* Indexing Feedback Result */}
              {indexingResult && (
                <div
                  className={`p-3.5 rounded-2xl text-xs flex items-start gap-2.5 border animate-in fade-in-50 ${
                    indexingResult.success
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}
                >
                  {indexingResult.success ? (
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600 mt-0.5" />
                  )}
                  <div className="space-y-0.5">
                    <p className="font-bold">{indexingResult.message}</p>
                    {indexingResult.urls.length > 0 && (
                      <p className="text-[11px] text-slate-600 font-mono">
                        URL: {indexingResult.urls.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 3: Advanced Webhook Configuration */}
          <Card className="rounded-[24px] bg-slate-50/70 border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-200 text-slate-700">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      Pengaturan Webhook Lanjutan
                      <HelpTooltip content="Konfigurasi webhook Cloudflare Pages deploy hook. Disarankan hanya diubah oleh administrator teknis." />
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                      Konfigurasi endpoint otomatisasi build Cloudflare Pages
                    </CardDescription>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition-colors cursor-pointer"
                >
                  <span>{showAdvanced ? 'Tutup' : 'Buka'}</span>
                  {showAdvanced ? (
                    <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </button>
              </div>
            </CardHeader>

            {showAdvanced && (
              <CardContent className="pt-2 space-y-4 animate-in fade-in-50 duration-200">
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <p className="leading-relaxed">
                    Kredensial database Supabase dan media storage GitHub telah diamankan di berkas lingkungan sistem (.env).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border-0 shadow-xs space-y-3.5">
                  <form onSubmit={handleSaveCf} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Cloudflare Deploy Hook URL
                      </label>
                      <Input
                        type="url"
                        value={hookUrl}
                        onChange={(e) => setHookUrl(e.target.value)}
                        placeholder="https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/..."
                        className="font-mono text-xs h-10 rounded-xl"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#22416D] hover:bg-[#1A3356] text-white text-xs font-bold transition-all shadow-md shadow-[#22416D]/20 cursor-pointer"
                      >
                        {cfSaved && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                        <span>{cfSaved ? 'Tersimpan' : 'Simpan Webhook'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleTestDeploy}
                        disabled={cfTesting || !hookUrl}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {cfTesting ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Rocket className="w-3.5 h-3.5 text-slate-600" />
                        )}
                        <span>{cfTesting ? 'Menguji...' : 'Uji Trigger'}</span>
                      </button>
                    </div>
                  </form>

                  {cfTestResult && (
                    <div
                      className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
                        cfTestResult.success
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : 'bg-rose-50 border-rose-200 text-rose-800'
                      }`}
                    >
                      {cfTestResult.success ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      )}
                      <span>{cfTestResult.message}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        </div>

        {/* ================= RIGHT COLUMN: MONITORING & HEALTH ================= */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-4">
          {/* Card 1: Kuota & Deploy Monitor (Deep Oceanic Card) */}
          <Card className="rounded-[24px] bg-gradient-to-br from-[#0B172C] via-[#0E1E38] to-[#142646] text-white border-0 p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-white">Kuota Pembaruan Live</h3>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                  deployRateInfo.isBlocked
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}
              >
                {deployRateInfo.isBlocked ? (
                  <>
                    <Lock className="w-3 h-3 text-rose-400" />
                    Terkunci
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Aktif
                  </>
                )}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-blue-200/70">Sisa Kuota Deploy Hari Ini:</span>
                <span className="font-mono font-bold text-emerald-400 text-lg">
                  {deployRateInfo.remainingAttempts} <span className="text-xs text-blue-200/50">/ 10</span>
                </span>
              </div>
              <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(deployRateInfo.remainingAttempts / 10) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                Batas deploy ini untuk menjaga efisiensi pipeline Cloudflare dan mencegah lonjakan build berlebihan.
              </p>
            </div>
          </Card>

          {/* Card 2: Status Koneksi Layanan (Clean Studio Card) */}
          <Card className="rounded-[24px] shadow-sm hover:shadow-md transition-shadow border-0 bg-white p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-50 text-[#22416D]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                  Status Koneksi Sistem
                </h3>
              </div>
              <span className="inline-flex items-center text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                Terkoneksi
              </span>
            </div>

            <div className="space-y-3">
              {/* Row 1: GitHub Media Storage */}
              <div className="p-3 rounded-2xl bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-white shadow-2xs text-slate-700">
                    <HardDrive className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-xs">Penyimpanan Foto</p>
                    <p className="text-xs text-slate-500">GitHub Media Storage</p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    ghActive
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {ghActive ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Terhubung
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      Perlu Setup
                    </>
                  )}
                </span>
              </div>

              {/* Row 2: Supabase Database */}
              <div className="p-3 rounded-2xl bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-white shadow-2xs text-slate-700">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-xs">Database Proyek & Blog</p>
                    <p className="text-xs text-slate-500">Supabase PostgreSQL</p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    isSupabaseConfigured
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  {isSupabaseConfigured ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Online
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                      Terputus
                    </>
                  )}
                </span>
              </div>

              {/* Row 3: Cloudflare Pages */}
              <div className="p-3 rounded-2xl bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-white shadow-2xs text-slate-700">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-xs">Jaringan Edge CDN</p>
                    <p className="text-xs text-slate-500">Cloudflare Pages</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Aktif
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
