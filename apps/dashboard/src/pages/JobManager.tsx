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
  Eye,
} from 'lucide-react';

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

  const fetchJobs = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const { data: jobsData } = await supabase
        .from('job_postings')
        .select('*')
        .order('created_at', { ascending: false });

      if (jobsData) {
        // Get applicant counts per job
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
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleDelete = async (id: string) => {
    if (!supabase) return;
    await supabase.from('job_postings').delete().eq('id', id);
    setDeleteConfirm(null);
    fetchJobs();
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    if (!supabase) return;
    const newStatus = currentStatus === 'published' ? 'closed' : 'published';
    await supabase.from('job_postings').update({ status: newStatus }).eq('id', id);
    fetchJobs();
  };

  const filteredJobs = jobs.filter((j) => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) || j.department.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || j.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusBadge = (status: string) => {
    switch (status) {
      case 'published': return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">Aktif</span>;
      case 'closed': return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-500/15 text-red-400 border border-red-500/20">Ditutup</span>;
      case 'draft': return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-500/15 text-slate-400 border border-slate-500/20">Draft</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Lowongan Kerja</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola lowongan pekerjaan yang tampil di karir.binaproject.id</p>
        </div>
        <button
          type="button"
          onClick={onNew}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#22416D] text-white text-sm font-bold hover:bg-[#1A3356] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Buat Lowongan Baru
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari lowongan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30 focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'published', 'closed', 'draft'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${statusFilter === s ? 'bg-[#22416D] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            >
              {s === 'all' ? 'Semua' : s === 'published' ? 'Aktif' : s === 'closed' ? 'Ditutup' : 'Draft'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 text-sm">Memuat data lowongan...</div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="text-3xl mb-3">📋</div>
          <h3 className="text-base font-bold text-slate-700 mb-1">Belum Ada Lowongan</h3>
          <p className="text-sm text-slate-400 mb-4">Buat lowongan pertama Anda untuk mulai menerima lamaran.</p>
          <button onClick={onNew} className="px-5 py-2.5 rounded-xl bg-[#22416D] text-white text-sm font-bold hover:bg-[#1A3356] transition-colors">
            + Buat Lowongan
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Posisi</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Departemen</th>
                <th className="text-center px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-center px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Pelamar</th>
                <th className="text-center px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Deadline</th>
                <th className="text-right px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-800">{job.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{job.job_type}</div>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span className="text-sm text-slate-600">{job.department}</span>
                  </td>
                  <td className="px-5 py-4 text-center">{statusBadge(job.status)}</td>
                  <td className="px-5 py-4 text-center hidden md:table-cell">
                    <span className="inline-flex items-center gap-1 text-sm font-bold text-slate-700">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {job.applicant_count || 0}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center hidden lg:table-cell">
                    {job.application_deadline ? (
                      <span className="text-xs text-slate-500">
                        {new Date(job.application_deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(job.id)}
                        className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(job.id, job.status)}
                        className="p-2 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-colors"
                        title={job.status === 'published' ? 'Tutup Lowongan' : 'Aktifkan'}
                      >
                        {job.status === 'published' ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                      </button>
                      {deleteConfirm === job.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleDelete(job.id)} className="px-2 py-1 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-600">Hapus</button>
                          <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 rounded-lg bg-slate-100 text-slate-500 text-xs font-bold hover:bg-slate-200">Batal</button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDeleteConfirm(job.id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                          title="Hapus"
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
  );
}
