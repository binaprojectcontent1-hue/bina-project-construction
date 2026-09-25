import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  XCircle,
  CheckCircle2,
  Users,
  Clock,
  Briefcase,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';

interface JobPosting {
  id: string;
  slug: string;
  title: string;
  department: string;
  job_type: string;
  status: string;
  application_deadline: string | null;
  views_count: number;
  created_at: string;
  applicant_count?: number;
}

interface JobManagerProps {
  onNew: () => void;
  onEdit: (id: string) => void;
}

export function JobManager({ onNew, onEdit }: JobManagerProps) {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchJobs = async (silent = false) => {
    if (!supabase) return;
    if (!silent) setLoading(true);
    try {
      const { data: jobsData } = await supabase
        .from('job_postings')
        .select('*')
        .order('created_at', { ascending: false });

      if (jobsData) {
        const { data: counts } = await supabase
          .from('job_applications')
          .select('job_id');

        const countMap: Record<string, number> = {};
        counts?.forEach((c) => {
          if (c.job_id) countMap[c.job_id] = (countMap[c.job_id] || 0) + 1;
        });

        setJobs(jobsData.map((j) => ({ ...j, applicant_count: countMap[j.id] || 0 })));
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!supabase) return;
    // Optimistic UI update
    setJobs((prev) => prev.filter((j) => j.id !== id));
    setDeleteConfirm(null);
    try {
      await supabase.from('job_postings').delete().eq('id', id);
      fetchJobs(true);
    } catch (err) {
      console.error('Failed to delete job:', err);
      fetchJobs(true);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    if (!supabase) return;
    const newStatus = currentStatus === 'published' ? 'closed' : 'published';
    // Optimistic instant UI update (zero layout shift or flicker)
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status: newStatus } : j)));
    try {
      await supabase.from('job_postings').update({ status: newStatus }).eq('id', id);
      fetchJobs(true);
    } catch (err) {
      console.error('Failed to toggle status:', err);
      fetchJobs(true);
    }
  };

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((j) => j.status === 'published').length;
  const draftJobs = jobs.filter((j) => j.status === 'draft').length;
  const totalApplicants = jobs.reduce((acc, j) => acc + (j.applicant_count || 0), 0);

  const filteredJobs = jobs.filter((j) => {
    const matchSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.department.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || j.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center justify-center min-w-[62px] px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Aktif
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center justify-center min-w-[62px] px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            Ditutup
          </span>
        );
      case 'draft':
      default:
        return (
          <span className="inline-flex items-center justify-center min-w-[62px] px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            Draft
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 min-h-[720px]">
      {/* 1. Stable Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Lowongan Kerja</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Kelola lowongan pekerjaan yang tampil di karir.binaproject.id
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => fetchJobs(false)}
            className="h-8 w-8 text-slate-600"
            title="Segarkan Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            size="sm"
            onClick={onNew}
            className="gap-1.5 font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Lowongan Baru</span>
          </Button>
        </div>
      </div>

      {/* 2. Top Metric Anchors (Prevents vertical viewport jump) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#1B365D] flex items-center justify-center shrink-0">
            <Briefcase className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">Total Posisi</p>
            {loading ? (
              <Skeleton className="h-6 w-12 mt-1 rounded-md" />
            ) : (
              <p className="text-xl font-semibold text-slate-900 mt-0.5 font-mono tabular-nums">{totalJobs}</p>
            )}
          </div>
        </Card>

        <Card className="p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">Lowongan Aktif</p>
            {loading ? (
              <Skeleton className="h-6 w-12 mt-1 rounded-md" />
            ) : (
              <p className="text-xl font-semibold text-emerald-600 mt-0.5 font-mono tabular-nums">{activeJobs}</p>
            )}
          </div>
        </Card>

        <Card className="p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">Draft / Tertutup</p>
            {loading ? (
              <Skeleton className="h-6 w-12 mt-1 rounded-md" />
            ) : (
              <p className="text-xl font-semibold text-slate-700 mt-0.5 font-mono tabular-nums">{totalJobs - activeJobs}</p>
            )}
          </div>
        </Card>

        <Card className="p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">Total Pelamar</p>
            {loading ? (
              <Skeleton className="h-6 w-12 mt-1 rounded-md" />
            ) : (
              <p className="text-xl font-semibold text-slate-900 mt-0.5 font-mono tabular-nums">{totalApplicants}</p>
            )}
          </div>
        </Card>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari posisi atau departemen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#1B365D] focus:ring-1 focus:ring-[#1B365D]/20 focus:outline-none shadow-2xs transition-all"
          />
        </div>
        <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'published', label: 'Aktif' },
            { id: 'closed', label: 'Ditutup' },
            { id: 'draft', label: 'Draft' },
          ].map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStatusFilter(s.id)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                statusFilter === s.id
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Table Container with Fixed Min-Height & Table-Fixed Column Geometry */}
      <div className="min-h-[460px] flex flex-col">
        {loading ? (
          /* Stable Skeleton Table (No CLS) */
          <div className="overflow-x-auto rounded-xl border border-slate-200/80 bg-white shadow-xs">
            <table className="table-fixed w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="w-[34%] text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Posisi</th>
                  <th className="w-[20%] text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Departemen</th>
                  <th className="w-[12%] text-center px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="w-[10%] text-center px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Pelamar</th>
                  <th className="w-[12%] text-center px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Deadline</th>
                  <th className="w-[12%] text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="h-[68px]">
                    <td className="px-5 py-3.5">
                      <Skeleton className="h-4 w-44 rounded-md mb-1.5" />
                      <Skeleton className="h-3 w-24 rounded-sm" />
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <Skeleton className="h-4 w-32 rounded-md" />
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <Skeleton className="h-6 w-16 mx-auto rounded-full" />
                    </td>
                    <td className="px-5 py-3.5 text-center hidden md:table-cell">
                      <Skeleton className="h-4 w-8 mx-auto rounded-md" />
                    </td>
                    <td className="px-5 py-3.5 text-center hidden lg:table-cell">
                      <Skeleton className="h-4 w-20 mx-auto rounded-md" />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-8 w-8 rounded-lg" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : filteredJobs.length === 0 ? (
          /* Empty State within same bounded container */
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center rounded-xl bg-white border border-slate-200/80 shadow-xs">
            <div className="w-12 h-12 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-700 mb-1">
              {search || statusFilter !== 'all' ? 'Tidak Ada Lowongan yang Cocok' : 'Belum Ada Lowongan'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              {search || statusFilter !== 'all'
                ? 'Coba ganti kata kunci pencarian atau ubah filter status lowongan.'
                : 'Buat lowongan pertama Anda untuk mulai menerima berkas lamaran dari publik.'}
            </p>
            {search || statusFilter !== 'all' ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setSearch(''); setStatusFilter('all'); }}
              >
                Reset Filter
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={onNew}
              >
                + Buat Lowongan Baru
              </Button>
            )}
          </div>
        ) : (
          /* Real Data Table with Rigid Table-Fixed Column Geometry */
          <div className="overflow-x-auto rounded-xl border border-slate-200/80 bg-white shadow-xs">
            <table className="table-fixed w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="w-[34%] text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Posisi</th>
                  <th className="w-[20%] text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Departemen</th>
                  <th className="w-[12%] text-center px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="w-[10%] text-center px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Pelamar</th>
                  <th className="w-[12%] text-center px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Deadline</th>
                  <th className="w-[12%] text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="h-[68px] hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-900 truncate" title={job.title}>
                        {job.title}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                        <span>{job.job_type}</span>
                        <span>&bull;</span>
                        <a
                          href={`https://karir.binaproject.id/loker/${job.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#1B365D] hover:underline flex items-center gap-0.5 font-medium"
                          title="Lihat halaman publik"
                        >
                          <span>Lihat Web</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell truncate" title={job.department}>
                      <span className="text-xs font-medium text-slate-600">{job.department}</span>
                    </td>
                    <td className="px-5 py-3.5 text-center whitespace-nowrap">
                      {statusBadge(job.status)}
                    </td>
                    <td className="px-5 py-3.5 text-center hidden md:table-cell">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {job.applicant_count || 0}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center hidden lg:table-cell whitespace-nowrap">
                      {job.application_deadline ? (
                        <span className="text-xs font-medium text-slate-600">
                          {new Date(job.application_deadline).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onEdit(job.id)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors"
                          title="Edit Spesifikasi Lowongan"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(job.id, job.status)}
                          className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-colors"
                          title={job.status === 'published' ? 'Tutup Lowongan' : 'Publikasikan'}
                        >
                          {job.status === 'published' ? (
                            <XCircle className="w-4 h-4 text-amber-500" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          )}
                        </button>
                        {deleteConfirm === job.id ? (
                          <div className="inline-flex items-center gap-1 bg-rose-50 p-0.5 rounded-lg border border-rose-200">
                            <button
                              type="button"
                              onClick={() => handleDelete(job.id)}
                              className="px-2 py-1 rounded-md bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors"
                            >
                              Ya
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirm(null)}
                              className="px-2 py-1 rounded-md bg-white text-slate-600 text-xs font-semibold hover:bg-slate-100 transition-colors border border-slate-200"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeleteConfirm(job.id)}
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Hapus Lowongan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
