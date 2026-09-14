import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Shuffle,
  Trash2,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Info,
  CheckCircle2,
  Clock,
  ExternalLink,
  X,
  ShieldCheck,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { useToast } from '../components/ui/Toast';

export const RedirectsList: React.FC = () => {
  const toast = useToast();
  const [redirects, setRedirects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | '301' | '302'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Redirect Form
  const [sourcePath, setSourcePath] = useState('');
  const [targetPath, setTargetPath] = useState('');
  const [statusCode, setStatusCode] = useState(301);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRedirects = async () => {
    setLoading(true);
    try {
      if (!supabase) return;
      const { data, error: err } = await supabase
        .from('redirects')
        .select('*')
        .order('created_at', { ascending: false });

      if (err) throw err;
      setRedirects(data || []);
    } catch (err: any) {
      console.error('Failed to fetch redirects:', err);
      toast.error('Gagal Memuat Data', err?.message || 'Tidak dapat mengambil data redirects dari database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRedirects();
  }, []);

  const handleAddRedirect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourcePath.trim() || !targetPath.trim()) {
      setError('Path asal dan path tujuan wajib diisi.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      if (!supabase) return;
      const cleanSource = sourcePath.startsWith('/') ? sourcePath.trim() : `/${sourcePath.trim()}`;
      const cleanTarget = targetPath.startsWith('/') ? targetPath.trim() : `/${targetPath.trim()}`;

      const { data, error: insertErr } = await supabase
        .from('redirects')
        .insert([{ source_path: cleanSource, target_path: cleanTarget, status_code: statusCode }])
        .select()
        .single();

      if (insertErr) throw insertErr;

      setRedirects((prev) => [data, ...prev]);
      setShowAddModal(false);
      setSourcePath('');
      setTargetPath('');
      toast.success(
        'Aturan Redirect Tersimpan',
        `Pengalihan dari ${cleanSource} ke ${cleanTarget} (${statusCode}) aktif.`
      );
    } catch (err: any) {
      setError(err?.message || 'Gagal menyimpan redirect.');
      toast.error('Gagal Menyimpan', err?.message || 'Terjadi kesalahan sistem.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, source: string) => {
    if (!window.confirm(`Hapus aturan redirect dari ${source}?`)) return;

    try {
      if (!supabase) return;
      const { error: delErr } = await supabase.from('redirects').delete().eq('id', id);
      if (delErr) throw delErr;
      setRedirects((prev) => prev.filter((r) => r.id !== id));
      toast.success('Aturan Dihapus', `Redirect dari ${source} telah dihapus.`);
    } catch (err: any) {
      toast.error('Gagal Menghapus', err?.message || 'Tidak dapat menghapus data redirect.');
    }
  };

  // KPI Calculations
  const count301 = redirects.filter((r) => !r.status_code || r.status_code === 301).length;
  const count302 = redirects.filter((r) => r.status_code === 302).length;

  const filtered = redirects.filter((r) => {
    const matchSearch =
      r.source_path?.toLowerCase().includes(search.toLowerCase()) ||
      r.target_path?.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === '301' && (!r.status_code || r.status_code === 301)) ||
      (statusFilter === '302' && r.status_code === 302);

    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Signature Oceanic Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="p-2 rounded-xl bg-[#22416D] text-white shadow-sm">
              <Shuffle className="w-5 h-5" />
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
              Manajemen 301 Redirects
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Mencegah link rusak (Error 404) & mempertahankan ranking kata kunci Google saat URL portofolio atau artikel diubah.
          </p>
        </div>

        {/* Primary Action Buttons (Pill-shaped) */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={fetchRedirects}
            title="Segarkan Data"
            disabled={loading}
            className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#22416D] hover:bg-[#1A3356] text-white text-xs font-bold transition-all shadow-md shadow-[#22416D]/20 cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Tambah Redirect Manual</span>
          </button>
        </div>
      </div>

      {/* 2. 3-Grid KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* KPI 1: Total */}
        <Card className="p-5 shadow-sm rounded-[24px] border-0 bg-white hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Aturan Pengalihan</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#22416D] flex items-center justify-center shadow-2xs">
              <Shuffle className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            {loading ? (
              <Skeleton className="h-9 w-16 my-0.5" />
            ) : (
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono tabular-nums">
                {redirects.length}
              </span>
            )}
            <span className="text-xs text-slate-500 font-medium">aturan tersimpan</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <span>Dijalankan di edge server Cloudflare</span>
          </p>
        </Card>

        {/* KPI 2: 301 Permanent */}
        <Card className="p-5 shadow-sm rounded-[24px] border-0 bg-white hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">301 Permanent (SEO Safe)</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-2xs">
              <CheckCircle2 className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            {loading ? (
              <Skeleton className="h-9 w-16 my-0.5" />
            ) : (
              <span className="text-3xl font-extrabold text-emerald-700 tracking-tight font-mono tabular-nums">
                {count301}
              </span>
            )}
            <span className="text-xs text-slate-500 font-medium">standar Google</span>
          </div>
          <p className="mt-2 text-xs text-emerald-700 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Mewariskan 100% PageRank & Backlink</span>
          </p>
        </Card>

        {/* KPI 3: 302 Temporary */}
        <Card className="p-5 shadow-sm rounded-[24px] border-0 bg-white hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">302 Sementara (Temporary)</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shadow-2xs">
              <Clock className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            {loading ? (
              <Skeleton className="h-9 w-16 my-0.5" />
            ) : (
              <span className="text-3xl font-extrabold text-slate-700 tracking-tight font-mono tabular-nums">
                {count302}
              </span>
            )}
            <span className="text-xs text-slate-500 font-medium">pengalihan sementara</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Digunakan untuk promo berkala atau pemeliharaan halaman
          </p>
        </Card>
      </div>

      {/* 3. Modern Callout Box */}
      <div className="rounded-[20px] bg-gradient-to-r from-blue-50/70 via-slate-50 to-white border border-blue-100 p-4 text-xs text-slate-600 flex items-start gap-3 shadow-2xs">
        <div className="p-1.5 rounded-lg bg-[#22416D] text-white shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="leading-relaxed">
          <strong className="text-slate-900 font-semibold">Sistem Proteksi SEO Otomatis:</strong> Setiap kali admin mengubah slug pada portofolio atau artikel yang telah berstatus <em>Published</em>, sistem akan otomatis mencatat aturan 301 Permanent Redirect ke tabel ini. Pengunjung dan Googlebot yang membuka URL lama akan langsung diarahkan ke URL baru tanpa kehilangan ranking SEO.
        </div>
      </div>

      {/* 4. Search & Filter Bar */}
      <Card className="p-4 shadow-sm rounded-[24px] border-0 bg-white">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari URL asal (/portfolio/...) atau URL tujuan..."
              className="pl-10 h-10 rounded-full text-xs border-slate-200 bg-slate-50/50 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-[#22416D] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              Semua ({redirects.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('301')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                statusFilter === '301'
                  ? 'bg-[#22416D] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              301 Permanent ({count301})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('302')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                statusFilter === '302'
                  ? 'bg-[#22416D] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              302 Sementara ({count302})
            </button>
          </div>
        </div>
      </Card>

      {/* 5. Modern Table Container */}
      {loading ? (
        <Card className="p-16 text-center text-slate-400 shadow-sm rounded-[24px] border-0 bg-white">
          <RefreshCw className="w-7 h-7 animate-spin mx-auto mb-3 text-[#22416D]" />
          <span className="text-xs font-semibold text-slate-600">Memuat basis data redirect...</span>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="p-16 text-center space-y-3 shadow-sm rounded-[24px] border-0 bg-white">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#22416D] flex items-center justify-center mx-auto">
            <Shuffle className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">
              {search ? 'Tidak ada hasil yang cocok' : 'Belum ada aturan redirect'}
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              {search
                ? `Tidak ditemukan aturan redirect yang mengandung kata kunci "${search}".`
                : 'Aturan redirect akan otomatis tercatat saat Anda memperbarui slug portofolio atau artikel yang sudah live.'}
            </p>
          </div>
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="text-xs font-bold text-blue-600 hover:underline pt-2"
            >
              Reset Pencarian
            </button>
          )}
        </Card>
      ) : (
        <Card className="overflow-hidden shadow-sm rounded-[24px] border-0 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider text-xs">
                <tr>
                  <th className="py-3.5 px-5">URL Asal (Source Path)</th>
                  <th className="py-3.5 px-4 text-center">Status Code</th>
                  <th className="py-3.5 px-5">URL Tujuan (Target Path)</th>
                  <th className="py-3.5 px-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2">
                        <code className="font-mono text-xs font-medium text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200/60">
                          {item.source_path}
                        </code>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold font-mono border ${
                          item.status_code === 302
                            ? 'bg-amber-50 text-amber-800 border-amber-200/60'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200/60'
                        }`}
                      >
                        {item.status_code || 301}
                      </span>
                    </td>

                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2 font-mono text-xs font-medium text-emerald-800 bg-emerald-50/80 px-2.5 py-1 rounded-full border border-emerald-200/60 w-fit">
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{item.target_path}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id, item.source_path)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Hapus Aturan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* 6. Modern Oceanic Modal Add Manual */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-md w-full p-6 shadow-2xl border-0 space-y-4 animate-in fade-in zoom-in-95 duration-150 relative">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#22416D] text-white shadow-xs">
                  <Shuffle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    Tambah 301 Redirect Manual
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Arahkan URL lama yang sudah usang ke link halaman baru
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="text-xs text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleAddRedirect} className="space-y-4 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Path Asal (URL Lama)
                </label>
                <Input
                  placeholder="/portfolio/villa-lama"
                  value={sourcePath}
                  onChange={(e) => setSourcePath(e.target.value)}
                  className="font-mono text-xs h-10 rounded-xl"
                  required
                />
                <span className="text-[11px] text-slate-400 block">
                  Contoh: <code>/portfolio/proyek-lama</code> atau <code>/blog/tips-lama</code>
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Path Tujuan (URL Baru)
                </label>
                <Input
                  placeholder="/portfolio/villa-modern-batu"
                  value={targetPath}
                  onChange={(e) => setTargetPath(e.target.value)}
                  className="font-mono text-xs h-10 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  HTTP Status Code
                </label>
                <select
                  value={statusCode}
                  onChange={(e) => setStatusCode(Number(e.target.value))}
                  className="w-full h-10 px-3 text-xs border border-slate-200 rounded-xl bg-white text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#22416D]/20 focus:border-[#22416D]"
                >
                  <option value={301}>301 - Moved Permanently (Direkomendasikan SEO Google)</option>
                  <option value={302}>302 - Temporary Redirect (Pengalihan Sementara)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#22416D] hover:bg-[#1A3356] text-white text-xs font-bold transition-all shadow-md shadow-[#22416D]/20 cursor-pointer disabled:opacity-50"
                >
                  {saving ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  <span>{saving ? 'Menyimpan...' : 'Simpan Aturan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
