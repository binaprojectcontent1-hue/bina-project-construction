import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  ExternalLink,
  Shield,
  HelpCircle,
  X,
  CheckCircle2,
  Briefcase,
  Layers,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (user: any) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetStatus, setResetStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Silakan masukkan email dan kata sandi admin.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (!supabase) {
        throw new Error('Supabase client belum dikonfigurasi. Periksa kredensial VITE_SUPABASE_URL.');
      }

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) throw authError;

      if (data.user) {
        onLoginSuccess(data.user);
      }
    } catch (err: any) {
      setError(err?.message || 'Login gagal. Periksa kembali email dan kata sandi Anda.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;

    setResetLoading(true);
    setResetStatus(null);
    try {
      if (supabase) {
        const { error: resetErr } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
          redirectTo: window.location.origin,
        });
        if (resetErr) throw resetErr;
        setResetStatus('Tautan pemulihan kata sandi telah dikirim ke email Anda.');
      }
    } catch (err: any) {
      setResetStatus(err?.message || 'Gagal mengirim email reset. Hubungi tim IT Bina Project.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080E18] text-slate-100 flex items-center justify-center p-4 sm:p-6 md:p-10 py-6 sm:py-10 relative overflow-x-hidden selection:bg-[#22416D] selection:text-white">
      {/* Ambient background soft glow effects aligned with Bina Navy & subtle Gold */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-[#22416D]/30 via-[#152B49]/20 to-transparent rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[650px] h-[650px] bg-gradient-to-tl from-[#0E1E38]/40 via-[#1A3356]/20 to-transparent rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#F68A0A]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Unified Dual-Tone Card */}
      <div className="w-full max-w-[440px] lg:max-w-[1060px] min-h-0 lg:min-h-[620px] bg-[#0B1528] rounded-[28px] sm:rounded-[36px] lg:rounded-[44px] shadow-2xl shadow-black/90 border border-slate-700/50 overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10 backdrop-blur-sm">
        
        {/* ================= LEFT PANEL: Deep Bina Navy Brand Visual Showcase (Hidden on Mobile, Visible on lg+) ================= */}
        <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 bg-gradient-to-b from-[#0E1E38] via-[#0B172C] to-[#07101E] relative flex-col justify-between p-8 sm:p-10 lg:p-12 overflow-hidden select-none border-b lg:border-b-0 lg:border-r border-slate-700/50">
          
          {/* Concentric radar circles in subtle Bina Navy tone */}
          <div className="absolute top-[46%] left-[45%] -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] rounded-full border border-blue-400/[0.07] pointer-events-none" />
          <div className="absolute top-[46%] left-[45%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-blue-400/[0.08] pointer-events-none" />
          <div className="absolute top-[46%] left-[45%] -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] rounded-full border border-blue-400/[0.09] pointer-events-none" />

          {/* Top Tagline & Headline */}
          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F68A0A] shadow-xs shadow-[#F68A0A]/50 animate-pulse" />
              <p className="text-[11px] sm:text-xs tracking-wider uppercase text-blue-200/60 font-semibold">
                Arsitektur, Konstruksi & Interior – Bina Project Studio
              </p>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-white tracking-tight leading-[1.08] mt-6 sm:mt-8">
              Kelola <br />
              <span className="text-slate-200">studio Anda</span>
            </h2>
          </div>

          {/* Dedicated Vector-Sharp Mobile Smartphone Mockup (Exact 1:1 Theme Harmony) */}
          <div className="relative mt-8 -mx-8 -mb-8 sm:-mx-10 sm:-mb-10 lg:-mx-12 lg:-mb-12 pt-4 flex justify-center items-end overflow-hidden">
            <div className="w-[290px] sm:w-[320px] bg-[#080F1D] border-[5px] border-slate-700/90 rounded-t-[40px] shadow-2xl shadow-black/80 px-4 pt-3 pb-8 text-left space-y-3 transform translate-y-3 rotate-[-2deg] transition-transform duration-500 hover:rotate-0 hover:translate-y-0">
              
              {/* Phone Dynamic Island & Speaker */}
              <div className="flex items-center justify-between px-2 pt-0.5">
                <span className="text-[10px] font-mono text-slate-400 font-semibold">09:41</span>
                <div className="w-18 h-3.5 bg-black rounded-full flex items-center justify-end px-1.5 gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <span>5G</span>
                  <div className="w-3.5 h-2 border border-slate-400 rounded-xs p-0.5 flex items-center">
                    <div className="w-full h-full bg-slate-300 rounded-2xs" />
                  </div>
                </div>
              </div>

              {/* Smartphone In-App Header */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#22416D] text-white flex items-center justify-center text-[10px] font-bold">
                    B
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-white leading-none">Bina Project Studio</p>
                    <p className="text-[9px] text-emerald-400 font-medium mt-0.5 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Live Web Connected
                    </p>
                  </div>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 font-medium">
                  Studio Admin
                </span>
              </div>

              {/* Studio Analytics Card inside Phone (Bina Navy + Gold Highlights) */}
              <div className="bg-[#12233B] border border-blue-500/20 rounded-2xl p-3 text-white space-y-2.5 shadow-inner">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-blue-200/70 font-medium">Statistik Realisasi Proyek</span>
                  <span className="text-[#F68A0A] font-semibold flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> +19.8%
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="text-xl font-black text-white tracking-tight">24 Proyek</p>
                    <p className="text-[9px] text-slate-300">18 Tayang • 6 Draft Tersimpan</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#F68A0A]/20 text-[#F68A0A] font-bold border border-[#F68A0A]/30">
                    4.9 ★ Rating
                  </span>
                </div>

                {/* Micro Bar Chart in Bina Navy & Gold */}
                <div className="pt-1 flex items-end gap-1.5 h-14 justify-between px-1">
                  <div className="w-full flex flex-col items-center gap-1">
                    <div className="w-full bg-blue-400/25 rounded-t-sm h-7" />
                    <span className="text-[8px] text-slate-400">Sen</span>
                  </div>
                  <div className="w-full flex flex-col items-center gap-1">
                    <div className="w-full bg-blue-400/35 rounded-t-sm h-9" />
                    <span className="text-[8px] text-slate-400">Sel</span>
                  </div>
                  <div className="w-full flex flex-col items-center gap-1">
                    <div className="w-full bg-blue-400/30 rounded-t-sm h-6" />
                    <span className="text-[8px] text-slate-400">Rab</span>
                  </div>
                  <div className="w-full flex flex-col items-center gap-1">
                    <div className="w-full bg-gradient-to-t from-[#22416D] to-[#F68A0A] rounded-t-sm h-12 shadow-sm shadow-[#F68A0A]/30" />
                    <span className="text-[8px] text-[#F68A0A] font-bold">Kam</span>
                  </div>
                  <div className="w-full flex flex-col items-center gap-1">
                    <div className="w-full bg-blue-400/40 rounded-t-sm h-10" />
                    <span className="text-[8px] text-slate-400">Jum</span>
                  </div>
                  <div className="w-full flex flex-col items-center gap-1">
                    <div className="w-full bg-blue-400/25 rounded-t-sm h-8" />
                    <span className="text-[8px] text-slate-400">Sab</span>
                  </div>
                </div>
              </div>

              {/* Mini Project List inside Phone */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#22416D]/40 text-blue-300 flex items-center justify-center text-[10px]">
                      <Briefcase className="w-3 h-3 text-blue-300" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-white">Villa Tropis Modern Batu</p>
                      <p className="text-[8px] text-slate-400">Malang, Jawa Timur</p>
                    </div>
                  </div>
                  <span className="text-[8px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.5 rounded-full">
                    Tayang
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-[#F68A0A] flex items-center justify-center text-[10px]">
                      <Layers className="w-3 h-3 text-[#F68A0A]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-white">Kitchen Set Minimalis</p>
                      <p className="text-[8px] text-slate-400">Desain Interior</p>
                    </div>
                  </div>
                  <span className="text-[8px] font-semibold text-blue-400 bg-blue-950/60 border border-blue-800/60 px-1.5 py-0.5 rounded-full">
                    Tayang
                  </span>
                </div>
              </div>
            </div>

            {/* Smooth gradient blend into bottom */}
            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#07101E] to-transparent pointer-events-none" />
          </div>

          {/* Bottom Left Accent Emblem */}
          <div className="absolute bottom-6 left-8 z-20 flex items-center gap-2 pointer-events-none">
            <div className="w-5 h-5 rounded-full border border-blue-400/30 flex items-center justify-center bg-[#22416D]/30">
              <span className="w-2 h-2 rounded-full bg-[#22416D]" />
            </div>
            <span className="text-[10px] tracking-widest uppercase text-blue-200/40 font-mono">BINA STUDIO CORE</span>
          </div>
        </div>

        {/* ================= RIGHT PANEL: Clean Rounded White Form ================= */}
        <div className="lg:col-span-6 xl:col-span-5 bg-white lg:rounded-l-[36px] p-6 sm:p-8 lg:p-12 flex flex-col justify-between text-slate-800 z-10 shadow-[-12px_0_35px_rgba(0,0,0,0.18)]">
          
          {/* Top Row: Brand Monogram & Website Link */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {/* Circular Logo Monogram with Bina Navy #22416D */}
              <div className="w-8 h-8 rounded-full bg-[#22416D] text-white flex items-center justify-center font-bold text-sm shadow-xs ring-2 ring-[#22416D]/15">
                B
              </div>
              <div className="leading-tight">
                <span className="font-bold text-base text-slate-900 tracking-tight block">
                  Bina Project
                </span>
                <span className="text-[10px] text-slate-400 font-medium block">
                  Studio Management
                </span>
              </div>
            </div>

            <a
              href="https://binaproject.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-500 hover:text-[#22416D] flex items-center gap-1.5 transition-colors font-medium group py-1 px-2.5 sm:py-1.5 sm:px-3 rounded-full hover:bg-slate-100 border border-slate-200/80"
            >
              <span>Web Publik</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#22416D] transition-colors" />
            </a>
          </div>

          {/* Center: Sign In Form */}
          <div className="my-6 sm:my-auto">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
              Sign In
            </h1>
            <p className="text-xs text-slate-500 mb-6 font-medium">
              Masuk ke panel editorial <span className="font-mono text-slate-700">dash.binaproject.com</span>
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email or Username Input */}
              <div className="space-y-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Administrator"
                  className="w-full h-12 px-6 rounded-full text-sm bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#22416D] focus:ring-4 focus:ring-[#22416D]/15 transition-all shadow-xs"
                />
              </div>

              {/* Password Input with Eye Toggle */}
              <div className="space-y-1 relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Kata Sandi"
                  className="w-full h-12 px-6 pr-12 rounded-full text-sm bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#22416D] focus:ring-4 focus:ring-[#22416D]/15 transition-all shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full transition-colors cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Forgot Password Link */}
              <div className="pt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email);
                    setForgotModalOpen(true);
                  }}
                  className="text-xs font-semibold text-[#22416D] hover:text-[#152B49] hover:underline transition-colors cursor-pointer"
                >
                  Lupa kata sandi?
                </button>
              </div>

              {/* Primary Bina Navy Button Aligned with Dashboard Theme */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-full bg-[#22416D] hover:bg-[#1A3356] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#22416D]/25 hover:shadow-[#22416D]/40 active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer mt-5"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Memproses...
                  </span>
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4" />
                    <span>Masuk ke Studio</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Bottom Row: Footer info & Links */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-4 border-t border-slate-100">
            <span>© 2026 Bina Project Studio.</span>
            <div className="flex items-center gap-3 font-medium">
              <button
                type="button"
                onClick={() => setForgotModalOpen(true)}
                className="hover:text-slate-700 transition-colors cursor-pointer"
              >
                Bantuan
              </button>
              <span>•</span>
              <span className="text-slate-500 flex items-center gap-1">
                Indonesia
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-slate-800 space-y-4 relative border border-slate-100">
            <button
              onClick={() => {
                setForgotModalOpen(false);
                setResetStatus(null);
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#22416D] flex items-center justify-center font-bold">
              <HelpCircle className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Pemulihan Akun Studio</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Masukkan email administrator yang terdaftar. Kami akan mengirimkan tautan aman untuk menyetel ulang kata sandi Anda.
              </p>
            </div>

            {resetStatus && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                <span>{resetStatus}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-3 pt-2">
              <input
                type="email"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="admin@binaproject.com"
                className="w-full h-11 px-5 rounded-full text-sm bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#22416D] focus:ring-4 focus:ring-[#22416D]/15 transition-all"
              />

              <div className="flex gap-2 justify-end pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setForgotModalOpen(false);
                    setResetStatus(null);
                  }}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-full cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="px-5 py-2 text-xs font-medium text-white bg-[#22416D] hover:bg-[#1A3356] rounded-full transition-colors cursor-pointer"
                >
                  {resetLoading ? 'Mengirim...' : 'Kirim Tautan Reset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
