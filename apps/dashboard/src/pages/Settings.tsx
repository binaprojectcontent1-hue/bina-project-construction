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
  Info,
} from 'lucide-react';
import { getStoredDeployHookUrl, setStoredDeployHookUrl, triggerCloudflareDeploy } from '../lib/cloudflare';
import { isSupabaseConfigured } from '../lib/supabase';
import { isGitHubConfigured } from '../lib/github';
import { HelpTooltip } from '../components/ui/HelpTooltip';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { deployRateLimiter } from '../lib/rate-limiter';
import { validateInput, cloudflareDeployHookSchema } from '../lib/validation-schemas';
import type { User } from '@supabase/supabase-js';

export const Settings: React.FC<{ user?: User }> = ({ user }) => {
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

  useEffect(() => {
    setHookUrl(getStoredDeployHookUrl());

    // Check rate limit status on mount
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
    
    // Validate input
    const validation = validateInput(
      cloudflareDeployHookSchema,
      { url: hookUrl },
      'CloudflareHook'
    );
    
    if (!validation.success) {
      alert(validation.error);
      return;
    }
    
    setStoredDeployHookUrl(hookUrl);
    setCfSaved(true);
    setTimeout(() => setCfSaved(false), 3000);
  };

  const handleQuickDeploy = async () => {
    if (!user?.id) {
      setQuickDeployResult({ success: false, message: 'User tidak terautentikasi' });
      return;
    }

    // Check rate limit first
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
      
      // Update rate info after successful attempt
      if (res.success) {
        const updatedStatus = await deployRateLimiter.getStatus(`deploy_${user.id}`);
        setDeployRateInfo(updatedStatus);
        setCfRemainingAttempts(updatedStatus.remainingAttempts);
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
    } finally {
      setCfTesting(false);
    }
  };

  const ghActive = isGitHubConfigured();

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Pengaturan & Publikasi Website
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Pusat kendali publikasi website live dan pemantauan integrasi sistem Bina Project.
        </p>
      </div>

      {/* 1. Quick Action: Publish / Update Live Website (Friendly for Non-Tech) */}
      <Card className="shadow-sm bg-gradient-to-br from-white via-white to-blue-50/30">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-50 text-[#22416D]">
                <Rocket className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-slate-900">
                  Perbarui Website Live
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Sinkronkan seluruh data portofolio & artikel terbaru ke website publik
                </CardDescription>
              </div>
            </div>
            <Badge variant="success" className="w-fit text-[11px] gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Sistem Siap Diperbarui</span>
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-2 space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-50 text-xs text-slate-600 leading-relaxed flex items-start gap-3">
            <Info className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-slate-800 mb-0.5">Kapan tombol ini perlu ditekan?</p>
              <p>
                Tekan tombol di bawah setelah Anda selesai menambah atau mengedit proyek/artikel agar perubahan langsung tampil di internet.
                Website publik akan diperbarui otomatis oleh server Cloudflare dalam waktu <strong>~45 detik</strong>.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
            <Button
              size="default"
              onClick={handleQuickDeploy}
              disabled={quickDeploying || cfRateLimited}
              className={`bg-[#22416D] hover:bg-[#1A3356] text-white shadow-xs gap-2 text-xs font-semibold px-5 h-10 ${cfRateLimited ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {quickDeploying ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Rocket className="w-4 h-4" />
              )}
              <span>{quickDeploying ? 'Sedang Memperbarui Website...' : 'Perbarui Website Sekarang'}</span>
            </Button>

            <div className="flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-lg border border-slate-200">
              <div className="text-center">
                <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Sisa Deploy</div>
                <div className="text-sm font-bold text-[#22416D]">{deployRateInfo.remainingAttempts}/10</div>
              </div>
              <div className="h-8 w-px bg-slate-300"></div>
              <div className="text-center">
                <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Status</div>
                <div className={`text-xs font-semibold ${deployRateInfo.isBlocked ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {deployRateInfo.isBlocked ? '🔒 Terkunci' : '✅ Aktif'}
                </div>
              </div>
            </div>

            <a
              href="https://bina-project.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-4 h-10 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors"
            >
              <span>Lihat Website Asli</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </a>
          </div>

          {/* Rate Limit Warning */}
          {cfRateLimited && (
            <div className="p-3 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="font-semibold block mb-1">Sudah Terlalu Banyak Request!</strong>
                Silakan tunggu sampai rate limit reset sebelum mencoba deploy lagi. Ini untuk mencegah penyalahgunaan sistem.
              </div>
            </div>
          )}

          {quickDeployResult && (
            <div
              className={`p-3 rounded-md text-xs flex items-center gap-2.5 border animate-in fade-in-50 ${
                quickDeployResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {quickDeployResult.success ? (
                <Check className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              )}
              <span>
                {quickDeployResult.success
                  ? 'Permintaan update berhasil dikirim ke Cloudflare! Website publik Anda akan diperbarui dalam 30–60 detik.'
                  : quickDeployResult.message}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. System Health Status (Reassuring & Clean) */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <CardTitle className="text-sm font-semibold text-slate-900">
              Status Koneksi Layanan
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-slate-500">
            Pemantauan langsung komponen utama website Bina Project
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 flex items-start justify-between">
              <div className="flex items-start gap-2.5">
                <HardDrive className="w-4 h-4 text-slate-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900 text-xs flex items-center">
                    Penyimpanan Foto
                    <HelpTooltip content="Tempat semua file foto portofolio dan artikel disimpan dengan aman di repository GitHub." />
                  </p>
                  <p className="text-slate-500 text-[11px] mt-0.5">GitHub Media Storage</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200">
                {ghActive ? '🟢 Terhubung (.env)' : '⚠️ Perlu Setup'}
              </Badge>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 flex items-start justify-between">
              <div className="flex items-start gap-2.5">
                <Database className="w-4 h-4 text-slate-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900 text-xs flex items-center">
                    Basis Data Konten
                    <HelpTooltip content="Database PostgreSQL Supabase tempat teks artikel dan rincian portofolio tersimpan." />
                  </p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Supabase Database</p>
                </div>
              </div>
              <Badge variant={isSupabaseConfigured ? 'success' : 'outline'} className="text-xs">
                {isSupabaseConfigured ? '🟢 Online' : '⚠️ Terputus'}
              </Badge>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 flex items-start justify-between">
              <div className="flex items-start gap-2.5">
                <Globe className="w-4 h-4 text-slate-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900 text-xs flex items-center">
                    Server Website
                    <HelpTooltip content="Jaringan server global Cloudflare yang menyajikan website super cepat ke pengunjung." />
                  </p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Cloudflare Pages</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200">
                🟢 Aktif
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Advanced Technical Settings (Isolated in Collapsible Accordion) */}
      <Card className="bg-slate-50/70 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-slate-500" />
              <div>
                <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                  Pengaturan Teknis Lanjutan
                  <Badge variant="outline" className="text-xs font-normal text-slate-500 bg-white">
                    Khusus Tim IT / Pengembang
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Konfigurasi webhook integrasi Cloudflare (Penyimpanan foto GitHub dikunci via .env)
                </CardDescription>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs gap-1.5 bg-white text-slate-700"
            >
              <span>{showAdvanced ? 'Tutup Pengaturan Teknis' : 'Buka Pengaturan Teknis'}</span>
              {showAdvanced ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              )}
            </Button>
          </div>
        </CardHeader>

        {showAdvanced && (
          <CardContent className="pt-5 space-y-6 animate-in fade-in-50 duration-200">
            {/* Warning Banner */}
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-semibold block">Catatan Keamanan:</span>
                <span>
                  Kredensial GitHub Media Storage dan Supabase telah tersimpan aman di berkas lingkungan sistem (.env).
                  Pengaturan di bawah ini hanya digunakan untuk memperbarui Webhook deploy Cloudflare.
                </span>
              </div>
            </div>

            {/* Cloudflare Deploy Hook Form */}
            <div className="p-4 rounded-lg bg-white border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <Rocket className="w-4 h-4 text-slate-700" />
                <h3 className="text-xs font-semibold text-slate-900">
                  Cloudflare Deploy Hook Webhook URL
                </h3>
              </div>

              <form onSubmit={handleSaveCf} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">
                    Deploy Hook Webhook URL
                  </label>
                  <Input
                    type="url"
                    value={hookUrl}
                    onChange={(e) => setHookUrl(e.target.value)}
                    placeholder="https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/..."
                    className="font-mono text-xs"
                  />
                  <span className="text-[11px] text-slate-400 block pt-0.5">
                    Ditemukan di: <strong>Cloudflare Dashboard → Workers & Pages → Bina Project → Settings → Builds & deployments → Deploy hooks</strong>.
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <Button type="submit" size="sm" className="gap-2 text-xs">
                    {cfSaved && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    <span>{cfSaved ? 'Tersimpan!' : 'Simpan Webhook Cloudflare'}</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleTestDeploy}
                    disabled={cfTesting || !hookUrl}
                    className="gap-2 text-xs"
                  >
                    {cfTesting ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Rocket className="w-3.5 h-3.5 text-slate-600" />
                    )}
                    <span>{cfTesting ? 'Menguji Trigger...' : 'Uji Trigger Cloudflare'}</span>
                  </Button>
                </div>
              </form>

              {cfTestResult && (
                <div
                  className={`p-3 rounded-md text-xs flex items-center gap-2.5 border ${
                    cfTestResult.success
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800'
                      : 'bg-rose-50/70 border-rose-200 text-rose-800'
                  }`}
                >
                  {cfTestResult.success ? (
                    <Check className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                  )}
                  <span>{cfTestResult.message}</span>
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};
