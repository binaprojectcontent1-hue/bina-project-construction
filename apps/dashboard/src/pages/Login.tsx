import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  Eye,
  EyeOff,
  AlertCircle,
  ExternalLink,
  X,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

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
        throw new Error('Koneksi server pusat belum siap. Hubungi administrator sistem.');
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
      setResetStatus(err?.message || 'Gagal mengirim email reset. Hubungi administrator.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex items-center justify-center p-4 sm:p-6 select-none">
      <div className="w-full max-w-4xl bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left Panel: Studio Identity & Branding */}
        <div className="hidden md:flex md:col-span-5 bg-[#1B365D] text-white p-8 flex-col justify-between relative overflow-hidden">
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-white text-[#1B365D] font-semibold flex items-center justify-center text-sm shadow-2xs">
                B
              </div>
              <div>
                <span className="font-semibold text-sm block leading-tight">Bina Project Studio</span>
                <span className="text-[11px] text-blue-200/80 block">Panel Redaksi & Manajemen</span>
              </div>
            </div>

            <div className="pt-8 space-y-3">
              <h2 className="text-xl font-semibold tracking-tight text-white leading-snug">
                Pusat Kontrol Website & Redaksi Editorial
              </h2>
              <p className="text-xs text-blue-100/70 leading-relaxed">
                Kelola portofolio arsitektur, progres proyek konstruksi, publikasi artikel edukasi, dan karir dalam satu sistem terintegrasi.
              </p>
            </div>

            <div className="space-y-2.5 pt-4">
              <div className="flex items-center gap-2 text-xs text-blue-100/90">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Pembaruan Langsung ke Website Resmi</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-blue-100/90">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Manajemen Portofolio & Peta Interaktif</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-blue-100/90">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Otomatisasi Tampilan Google & Kompresi Foto</span>
              </div>
            </div>
          </div>

          <div className="pt-8 text-[11px] text-blue-200/60 flex items-center justify-between relative z-10 border-t border-white/10">
            <span>PT Bina Project Studio</span>
            <span className="font-mono">v2.0</span>
          </div>
        </div>

        {/* Right Panel: Authentication Form */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-6 border-b border-slate-100">
            <div className="flex items-center gap-2 md:hidden">
              <div className="w-8 h-8 rounded-lg bg-[#1B365D] text-white font-semibold flex items-center justify-center text-xs">
                B
              </div>
              <span className="font-semibold text-xs text-slate-900">Bina Project</span>
            </div>

            <a
              href="https://binaproject.id"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-500 hover:text-[#1B365D] flex items-center gap-1.5 transition-colors font-medium ml-auto"
            >
              <span>Web Publik</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>

          <div className="py-6 sm:py-8">
            <div className="space-y-1 mb-6">
              <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
                Masuk ke Panel Studio
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Gunakan akun admin terotorisasi untuk mengakses dashboard.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Email Admin
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@binaproject.id"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Kata Sandi
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(true)}
                    className="text-xs text-[#1B365D] hover:underline font-medium cursor-pointer"
                  >
                    Lupa sandi?
                  </button>
                </div>

                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 mt-2 font-semibold"
              >
                {loading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}
              </Button>
            </form>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Akses Terenkripsi & Terproteksi</span>
            </span>
            <span>Bina Project</span>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">Pemulihan Kata Sandi</h3>
              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Masukkan alamat email admin yang terdaftar. Sistem akan mengirimkan tautan reset kata sandi resmi dari Supabase Auth.
            </p>

            {resetStatus && (
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs">
                {resetStatus}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-3">
              <Input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="admin@binaproject.id"
                required
              />
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setForgotModalOpen(false)}
                >
                  Batal
                </Button>
                <Button type="submit" size="sm" disabled={resetLoading}>
                  {resetLoading ? 'Mengirim...' : 'Kirim Tautan Reset'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
