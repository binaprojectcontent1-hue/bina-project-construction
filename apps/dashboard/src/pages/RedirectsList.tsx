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
  X,
  ShieldCheck,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Input } from '../components/ui/input';
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
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="p-2 rounded-lg bg-[#1B365D] text-white shadow-2xs">
              <Shuffle className="w-5 h-5" />
            </div>
            <h1 className="text-xl md:text-2xl font-semibold text-slate-900 tracking-tight">
              Pengalihan Tautan
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Mencegah halaman tidak ditemukan jika link portofolio atau artikel diubah, sehingga pengunjung otomatis diarahkan ke link baru.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={fetchRedirects}
            title="Segarkan Data"
            disabled={loading}
            className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1B365D] hover:bg-[#132845] text-white text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Tambah Pengalihan Manual</span>
          </button>
        </div>
      </div>

      {/* 2. 3-Grid KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* KPI 1: Total */}
        <Card className="p-4 rounded-xl border border-slate-200/80 bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Pengalihan</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-[#1B365D] flex items-center justify-center">
              <Shuffle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            {loading ? (
              <Skeleton className="h-8 w-16 my-0.5" />
            ) : (
              <span className="text-2xl font-semibold text-slate-900 tracking-tight font-mono tabular-nums">
                {redirects.length}
              </span>
            )}
            <span className="text-xs text-slate-500 font-medium">tautan aktif</span>
          </div>
          <p className="mt-1.5 text-xs text-slate-500 flex items-center gap-1">
            <span>Diterapkan langsung ke website</span>
          </p>
        </Card>

        {/* KPI 2: 301 Permanent */}
        <Card className="p-4 rounded-xl border border-slate-200/80 bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pengalihan Permanen</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            {loading ? (
              <Skeleton className="h-8 w-16 my-0.5" />
            ) : (
              <span className="text-2xl font-semibold text-emerald-700 tracking-tight font-mono tabular-nums">
                {count301}
              </span>
            )}
            <span className="text-xs text-slate-500 font-medium">selamanya</span>
          </div>
          <p className="mt-1.5 text-xs text-emerald-700 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Pengunjung & Google tetap diarahkan lancar</span>
          </p>
        </Card>

        {/* KPI 3: 302 Temporary */}
        <Card className="p-4 rounded-xl border border-slate-200/80 bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pengalihan Sementara</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            {loading ? (
              <Skeleton className="h-8 w-16 my-0.5" />
            ) : (
              <span className="text-2xl font-semibold text-slate-700 tracking-tight font-mono tabular-nums">
                {count302}
              </span>
            )}
            <span className="text-xs text-slate-500 font-medium">sementara</span>
          </div>
          <p className="mt-1.5 text-xs text-slate-500">
            Untuk keperluan promo atau perbaikan sesaat
          </p>
        </Card>
      </div>

      {/* 3. Modern Callout Box */}
      <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 text-xs text-slate-600 flex items-start gap-3 shadow-2xs">
        <div className="p-1 rounded-md bg-[#1B365D] text-white shrink-0 mt-0.5">
          <Info className="w-3.5 h-3.5" />
        </div>
        <div className="leading-relaxed">
          <strong className="text-slate-900 font-semibold">Pengalihan Otomatis:</strong> Setiap kali Anda mengubah alamat link artikel atau portofolio yang sudah tayang, sistem secara otomatis mencatat pengalihan di sini agar pengunjung yang membuka link lama tidak mengalami halaman error.
        </div>
      </div>

      {/* 4. Search & Filter Bar */}
      <Card className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari link lama (/portfolio/...) atau link tujuan..."
              className="pl-9 h-9 rounded-lg text-xs border-slate-200 bg-white"
            />
          </div>

          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-[#1B365D] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              Semua ({redirects.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('301')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === '301'
                  ? 'bg-[#1B365D] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              Permanen ({count301})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('302')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === '302'
                  ? 'bg-[#1B365D] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              Sementara ({count302})
            </button>
          </div>
        </div>
      </Card>

      {/* 5. Table Container */}
      {loading ? (
        <Card className="p-16 text-center text-slate-400 rounded-xl border border-slate-200 bg-white shadow-xs">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3 text-[#1B365D]" />
          <span className="text-xs font-medium text-slate-600">Memuat data pengalihan tautan...</span>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="p-14 text-center space-y-3 rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-[#1B365D] flex items-center justify-center mx-auto">
            <Shuffle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {search ? 'Tidak ada hasil yang cocok' : 'Belum ada aturan pengalihan'}
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              {search
                ? `Tidak ditemukan pengalihan yang mengandung kata kunci "${search}".`
                : 'Pengalihan tautan akan otomatis tercatat saat Anda memperbarui alamat link portofolio atau artikel yang sudah live.'}
            </p>
          </div>
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="text-xs font-semibold text-[#1B365D] hover:underline pt-2 cursor-pointer"
            >
              Reset Pencarian
            </button>
          )}
        </Card>
      ) : (
        <Card className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-xs">
                <tr>
                  <th className="py-3 px-4">Alamat Link Lama (Asal)</th>
                  <th className="py-3 px-4 text-center">Tipe Pengalihan</th>
                  <th className="py-3 px-4">Alamat Link Baru (Tujuan)</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <code className="font-mono text-xs font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200/60">
                          {item.source_path}
                        </code>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          item.status_code === 302
                            ? 'bg-amber-50 text-amber-800 border-amber-200/60'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200/60'
                        }`}
                      >
                        {item.status_code === 302 ? 'Sementara' : 'Permanen'}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 font-mono text-xs font-medium text-emerald-800 bg-emerald-50/80 px-2.5 py-0.5 rounded border border-emerald-200/60 w-fit">
                        <ArrowRight className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{item.target_path}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id, item.source_path)}
                        className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Hapus Pengalihan"
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

      {/* 6. Modal Add Manual */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150 relative">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#1B365D] text-white shadow-2xs">
                  <Shuffle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
                    Tambah Pengalihan Tautan
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Arahkan link lama ke halaman baru secara otomatis
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="text-xs text-rose-700 bg-rose-50 border border-rose-200 p-2.5 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleAddRedirect} className="space-y-3.5 pt-1">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Alamat Link Lama (Asal)
                </label>
                <Input
                  placeholder="/portfolio/villa-lama"
                  value={sourcePath}
                  onChange={(e) => setSourcePath(e.target.value)}
                  className="font-mono text-xs h-9 rounded-lg"
                  required
                />
                <span className="text-[11px] text-slate-400 block">
                  Contoh: <code>/portfolio/proyek-lama</code> atau <code>/blog/tips-lama</code>
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Alamat Link Baru (Tujuan)
                </label>
                <Input
                  placeholder="/portfolio/villa-modern-batu"
                  value={targetPath}
                  onChange={(e) => setTargetPath(e.target.value)}
                  className="font-mono text-xs h-9 rounded-lg"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Jenis Pengalihan
                </label>
                <select
                  value={statusCode}
                  onChange={(e) => setStatusCode(Number(e.target.value))}
                  className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg bg-white text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#1B365D]/20 focus:border-[#1B365D]"
                >
                  <option value={301}>Permanen (Direkomendasikan - Link lama diganti selamanya)</option>
                  <option value={302}>Sementara (Hanya untuk keperluan promo / perbaikan sesaat)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 rounded-md text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#1B365D] hover:bg-[#132845] text-white text-xs font-semibold transition-all shadow-2xs cursor-pointer disabled:opacity-50"
                >
                  {saving ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  <span>{saving ? 'Menyimpan...' : 'Simpan Pengalihan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
