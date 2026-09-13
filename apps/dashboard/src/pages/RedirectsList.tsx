import React, { useState, useEffect } from 'react';
import { Plus, Search, Shuffle, Trash2, ArrowRight, RefreshCw, AlertCircle, Info } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';

export const RedirectsList: React.FC = () => {
  const [redirects, setRedirects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
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
    } catch (err) {
      console.error('Failed to fetch redirects:', err);
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
    } catch (err: any) {
      setError(err?.message || 'Gagal menyimpan redirect.');
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
    } catch (err: any) {
      alert('Gagal menghapus redirect: ' + err.message);
    }
  };

  const filtered = redirects.filter(
    (r) =>
      r.source_path?.toLowerCase().includes(search.toLowerCase()) ||
      r.target_path?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Manajemen 301 Redirects
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Mencegah error 404 & mengamankan ranking SEO Google saat URL slug portofolio atau artikel diubah
          </p>
        </div>

        <Button onClick={() => setShowAddModal(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          <span>Tambah Redirect Manual</span>
        </Button>
      </div>

      {/* Info Notice Box */}
      <div className="rounded-2xl bg-white shadow-sm p-4 text-xs text-slate-600 flex items-start gap-3">
        <Info className="w-4 h-4 text-slate-700 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-slate-900">Sistem Proteksi Otomatis:</strong> Setiap kali admin mengubah slug pada portofolio atau artikel yang telah berstatus <em>Published</em>, sistem akan otomatis mencatat aturan 301 Permanent Redirect ke tabel ini. Pengunjung dan Googlebot yang membuka URL lama akan langsung diarahkan ke URL baru tanpa kehilangan ranking SEO.
        </div>
      </div>

      {/* Search Toolbar */}
      <Card className="p-3.5 shadow-sm rounded-2xl">
        <div className="flex items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari URL asal (/portfolio/...) atau URL tujuan..."
              className="pl-9 h-9"
            />
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={fetchRedirects}
            title="Refresh Data"
            className="h-9 w-9"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </Card>

      {/* Table */}
      {loading ? (
        <Card className="p-16 text-center text-slate-400 shadow-sm rounded-2xl">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-500" />
          <span className="text-xs font-medium">Memuat aturan redirect...</span>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="p-16 text-center space-y-2 shadow-sm rounded-2xl">
          <Shuffle className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-800">Belum ada aturan redirect</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Aturan redirect akan otomatis tercatat saat Anda memperbarui slug portofolio atau artikel yang sudah live.
          </p>
        </Card>
      ) : (
        <Card className="overflow-hidden shadow-sm rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-medium border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">URL Asal (Source)</th>
                  <th className="py-3 px-4 text-center">Status Code</th>
                  <th className="py-3 px-4">URL Tujuan (Target)</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <code className="font-mono text-[11px] text-rose-600 bg-rose-50/60 px-2 py-0.5 rounded">
                        {item.source_path}
                      </code>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold font-mono bg-slate-100 text-slate-700">
                        {item.status_code || 301}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-700 bg-emerald-50/60 px-2 py-0.5 rounded w-fit">
                        <ArrowRight className="w-3 h-3 text-emerald-500" />
                        <span>{item.target_path}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item.id, item.source_path)}
                        className="h-7 w-7 text-slate-400 hover:text-rose-600"
                        title="Hapus Aturan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modal Add Manual */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div>
              <h3 className="text-base font-semibold text-slate-900 tracking-tight">
                Tambah 301 Redirect Manual
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Arahkan URL lama yang sudah usang ke link halaman baru
              </p>
            </div>

            {error && (
              <div className="text-xs text-rose-700 bg-rose-50 border border-rose-200 p-2.5 rounded-md flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleAddRedirect} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Path Asal (Lama)</label>
                <Input
                  placeholder="/portfolio/villa-lama"
                  value={sourcePath}
                  onChange={(e) => setSourcePath(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Path Tujuan (Baru)</label>
                <Input
                  placeholder="/portfolio/villa-modern-batu"
                  value={targetPath}
                  onChange={(e) => setTargetPath(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">HTTP Status Code</label>
                <select
                  value={statusCode}
                  onChange={(e) => setStatusCode(Number(e.target.value))}
                  className="w-full h-9 px-3 text-xs border border-slate-200 rounded-md bg-white text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#22416D]"
                >
                  <option value={301}>301 - Moved Permanently (Direkomendasikan SEO)</option>
                  <option value={302}>302 - Temporary Redirect</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddModal(false)}
                >
                  Batal
                </Button>
                <Button type="submit" size="sm" disabled={saving}>
                  {saving ? 'Menyimpan...' : 'Simpan Aturan'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
