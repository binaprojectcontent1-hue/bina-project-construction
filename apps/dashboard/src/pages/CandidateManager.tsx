import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  Search,
  LayoutGrid,
  Table as TableIcon,
  Star,
  FileText,
  X,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Save,
  Users,
  UserCheck,
  UserX,
  RefreshCw,
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';

interface Applicant {
  id: string;
  job_id: string | null;
  job_title: string;
  full_name: string;
  email: string;
  whatsapp: string;
  city: string;
  last_experience: string;
  expected_salary: string;
  join_availability: string;
  resume_path: string;
  portfolio_url: string;
  custom_answers: Record<string, string>;
  is_talent_pool: boolean;
  screening_status: string;
  pipeline_stage: string;
  hr_notes: string;
  rating: number;
  created_at: string;
}

const PIPELINE_STAGES = [
  { key: 'new', label: 'Masuk', color: 'bg-blue-500', bgLight: 'bg-blue-50/70', text: 'text-blue-700', border: 'border-blue-200' },
  { key: 'screening', label: 'Screening', color: 'bg-amber-500', bgLight: 'bg-amber-50/70', text: 'text-amber-700', border: 'border-amber-200' },
  { key: 'interview', label: 'Wawancara', color: 'bg-violet-500', bgLight: 'bg-violet-50/70', text: 'text-violet-700', border: 'border-violet-200' },
  { key: 'offering', label: 'Diterima', color: 'bg-emerald-500', bgLight: 'bg-emerald-50/70', text: 'text-emerald-700', border: 'border-emerald-200' },
  { key: 'rejected', label: 'Belum Sesuai', color: 'bg-rose-500', bgLight: 'bg-rose-50/70', text: 'text-rose-700', border: 'border-rose-200' },
];

const WA_TEMPLATES = [
  { label: '📋 Undangan Wawancara Offline', template: (name: string, pos: string) => `Halo ${name},\n\nTerima kasih atas lamarannya untuk posisi ${pos} di Bina Project.\n\nKami mengundang Anda untuk hadir dalam sesi wawancara di kantor kami:\n📍 Kantor Bina Project, Malang\n📅 [Tanggal & Jam]\n\nMohon konfirmasi kehadirannya ya. Terima kasih! 🙏\n\n— Tim HRD Bina Project` },
  { label: '💻 Undangan Wawancara Online', template: (name: string, pos: string) => `Halo ${name},\n\nTerima kasih atas lamarannya untuk posisi ${pos} di Bina Project.\n\nKami mengundang Anda untuk sesi wawancara online:\n🔗 Link Meet: [Link Google Meet/Zoom]\n📅 [Tanggal & Jam]\n\nMohon bergabung tepat waktu. Terima kasih! 🙏\n\n— Tim HRD Bina Project` },
  { label: '📁 Permintaan Portofolio/Dokumen', template: (name: string, pos: string) => `Halo ${name},\n\nTerima kasih atas minat Anda pada posisi ${pos} di Bina Project.\n\nUntuk melanjutkan proses seleksi, bisakah Anda mengirimkan:\n- Portofolio gambar kerja terbaru\n- [Dokumen lainnya]\n\nDitunggu ya! Terima kasih 🙏\n\n— Tim HRD Bina Project` },
  { label: '🎉 Lolos Seleksi / Offering', template: (name: string, pos: string) => `Halo ${name},\n\nSelamat! 🎉 Kami dengan senang hati menginformasikan bahwa Anda LOLOS seleksi untuk posisi ${pos} di Bina Project.\n\nSelanjutnya, kami ingin mendiskusikan detail penawaran kerja. Apakah Anda bersedia bertemu/call untuk membahasnya?\n\nSelamat bergabung! 💪\n\n— Tim HRD Bina Project` },
  { label: '✍️ Pesan Bebas Kustom', template: (name: string, pos: string) => `Halo ${name},\n\nTerkait lamaran Anda untuk posisi ${pos} di Bina Project:\n\n[Tulis pesan Anda di sini]\n\nTerima kasih.\n\n— Tim HRD Bina Project` },
];

export function CandidateManager() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [search, setSearch] = useState('');
  const [jobFilter, setJobFilter] = useState('all');
  const [jobs, setJobs] = useState<{ id: string; title: string }[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [showWaModal, setShowWaModal] = useState(false);
  const [waApplicant, setWaApplicant] = useState<Applicant | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const fetchData = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const [{ data: appsData }, { data: jobsData }] = await Promise.all([
        supabase.from('job_applications').select('*').order('created_at', { ascending: false }),
        supabase.from('job_postings').select('id, title').order('title'),
      ]);
      if (appsData) setApplicants(appsData);
      if (jobsData) setJobs(jobsData);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateApplicant = async (id: string, updates: Partial<Applicant>) => {
    if (!supabase) return;
    await supabase.from('job_applications').update(updates).eq('id', id);
    setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
    if (selectedApplicant?.id === id) {
      setSelectedApplicant((prev) => (prev ? { ...prev, ...updates } : prev));
    }
  };

  const getResumeUrl = async (path: string): Promise<string | null> => {
    if (!supabase) return null;
    const { data } = await supabase.storage.from('resumes').createSignedUrl(path, 600);
    return data?.signedUrl || null;
  };

  const filtered = applicants.filter((a) => {
    const matchSearch =
      a.full_name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.city.toLowerCase().includes(search.toLowerCase());
    const matchJob =
      jobFilter === 'all' ||
      a.job_id === jobFilter ||
      (jobFilter === 'talent-pool' && a.is_talent_pool);
    return matchSearch && matchJob;
  });

  const totalCandidates = applicants.length;
  const interviewCandidates = applicants.filter((a) => a.pipeline_stage === 'interview').length;
  const offeredCandidates = applicants.filter((a) => a.pipeline_stage === 'offering').length;
  const talentPoolCandidates = applicants.filter((a) => a.is_talent_pool).length;

  const screeningBadge = (status: string) => {
    switch (status) {
      case 'passed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
            Lolos
          </span>
        );
      case 'knocked_out':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
            Gugur
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
            Review
          </span>
        );
    }
  };

  const ratingStars = (rating: number, applicantId: string) => (
    <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => updateApplicant(applicantId, { rating: s })}
          className={`p-0.5 transition-colors cursor-pointer ${
            s <= rating ? 'text-amber-400' : 'text-slate-300 hover:text-amber-300'
          }`}
          title={`Rating ${s}/5`}
        >
          <Star className="w-3.5 h-3.5" fill={s <= rating ? 'currentColor' : 'none'} />
        </button>
      ))}
    </div>
  );

  const handleDragStart = (id: string) => setDraggedId(id);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (stage: string) => {
    if (draggedId) {
      updateApplicant(draggedId, { pipeline_stage: stage });
      setDraggedId(null);
    }
  };

  const openWhatsApp = (applicant: Applicant, templateFn: (name: string, pos: string) => string) => {
    const phone = applicant.whatsapp.replace(/[^0-9]/g, '').replace(/^0/, '62');
    const message = templateFn(applicant.full_name, applicant.job_title);
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    setShowWaModal(false);
  };

  return (
    <div className="space-y-6 min-h-[760px]">
      {/* 1. Header with Mode Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Kandidat Pelamar</h1>
          <p className="text-sm text-slate-500 mt-1">
            Pipeline rekrutmen ATS dan evaluasi calon kandidat Bina Project
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchData}
            className="w-10 h-10 flex items-center justify-center border border-slate-200 rounded-xl hover:bg-white text-slate-600 transition-colors shadow-xs"
            title="Segarkan Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/60 shadow-xs">
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-[#22416D] text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[#22416D] text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Tabel</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Metric Anchors (Locks page height & avoids viewport shifting) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#22416D] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-500 truncate">Total Pelamar</p>
            {loading ? (
              <Skeleton className="h-6 w-12 mt-1 rounded-md" />
            ) : (
              <p className="text-lg font-bold text-slate-800 mt-0.5">{totalCandidates}</p>
            )}
          </div>
        </Card>

        <Card className="p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-500 truncate">Tahap Wawancara</p>
            {loading ? (
              <Skeleton className="h-6 w-12 mt-1 rounded-md" />
            ) : (
              <p className="text-lg font-bold text-slate-800 mt-0.5">{interviewCandidates}</p>
            )}
          </div>
        </Card>

        <Card className="p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-500 truncate">Diterima (Offering)</p>
            {loading ? (
              <Skeleton className="h-6 w-12 mt-1 rounded-md" />
            ) : (
              <p className="text-lg font-bold text-slate-800 mt-0.5">{offeredCandidates}</p>
            )}
          </div>
        </Card>

        <Card className="p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <UserX className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-500 truncate">Talent Pool</p>
            {loading ? (
              <Skeleton className="h-6 w-12 mt-1 rounded-md" />
            ) : (
              <p className="text-lg font-bold text-slate-800 mt-0.5">{talentPoolCandidates}</p>
            )}
          </div>
        </Card>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari kandidat berdasarkan nama, email, atau domisili..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#22416D] focus:ring-2 focus:ring-[#22416D]/15 focus:outline-none shadow-xs transition-all"
          />
        </div>
        <select
          value={jobFilter}
          onChange={(e) => setJobFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-700 focus:border-[#22416D] focus:outline-none shadow-xs cursor-pointer"
        >
          <option value="all">Semua Posisi Lowongan</option>
          <option value="talent-pool">Talent Pool (Pendaftaran Bebas)</option>
          {jobs.map((j) => (
            <option key={j.id} value={j.id}>
              {j.title}
            </option>
          ))}
        </select>
      </div>

      {/* 4. Main Body: Kanban vs Table View inside Stable Min-Height Container */}
      <div className="min-h-[580px] flex flex-col">
        {loading ? (
          viewMode === 'kanban' ? (
            /* Skeleton Kanban Board (No Layout Shift) */
            <div className="flex gap-4 overflow-x-auto pb-4 pt-1">
              {PIPELINE_STAGES.map((s) => (
                <div
                  key={s.key}
                  className="flex-shrink-0 w-72 rounded-2xl bg-slate-50/80 border border-slate-200/80 p-3 min-h-[520px] flex flex-col"
                >
                  <div className="flex items-center justify-between mb-3 px-1">
                    <Skeleton className="h-5 w-24 rounded-md" />
                    <Skeleton className="h-5 w-7 rounded-full" />
                  </div>
                  <div className="space-y-3 flex-1">
                    <Skeleton className="h-32 w-full rounded-xl" />
                    <Skeleton className="h-32 w-full rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Skeleton Table (No Layout Shift) */
            <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-xs">
              <table className="table-fixed w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="w-[30%] text-left px-4 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Pelamar</th>
                    <th className="w-[24%] text-left px-4 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Posisi</th>
                    <th className="w-[14%] text-center px-4 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Tahap</th>
                    <th className="w-[12%] text-center px-4 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Screening</th>
                    <th className="w-[10%] text-center px-4 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Rating</th>
                    <th className="w-[10%] text-right px-4 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="h-[68px]">
                      <td className="px-4 py-3.5">
                        <Skeleton className="h-4 w-36 rounded-md mb-1.5" />
                        <Skeleton className="h-3 w-48 rounded-sm" />
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <Skeleton className="h-4 w-32 rounded-md" />
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <Skeleton className="h-6 w-16 mx-auto rounded-full" />
                      </td>
                      <td className="px-4 py-3.5 text-center hidden sm:table-cell">
                        <Skeleton className="h-5 w-14 mx-auto rounded-full" />
                      </td>
                      <td className="px-4 py-3.5 text-center hidden lg:table-cell">
                        <Skeleton className="h-4 w-20 mx-auto rounded-md" />
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <Skeleton className="h-8 w-8 ml-auto rounded-lg" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : viewMode === 'kanban' ? (
          /* Real Kanban Board with Fixed Column Widths & Uniform Minimum Height */
          <div className="flex gap-4 overflow-x-auto pb-4 pt-1">
            {PIPELINE_STAGES.map((stage) => {
              const stageApplicants = filtered.filter((a) => a.pipeline_stage === stage.key);
              return (
                <div
                  key={stage.key}
                  className={`flex-shrink-0 w-72 rounded-2xl ${stage.bgLight} border ${stage.border} p-3 min-h-[520px] flex flex-col transition-all`}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(stage.key)}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-3 px-1 shrink-0">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
                      <span className={`text-sm font-bold ${stage.text}`}>{stage.label}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-600 bg-white px-2.5 py-0.5 rounded-full border border-slate-200/60 shadow-2xs">
                      {stageApplicants.length}
                    </span>
                  </div>

                  {/* Cards Drop Area (Maintains min-height so columns never collapse) */}
                  <div className="space-y-2.5 flex-1 min-h-[440px]">
                    {stageApplicants.length === 0 ? (
                      <div className="h-32 border-2 border-dashed border-slate-200/80 rounded-xl flex flex-col items-center justify-center text-slate-400 text-xs gap-1.5 p-4 text-center">
                        <Users className="w-5 h-5 opacity-30" />
                        <span>Tarik kandidat ke tahap ini</span>
                      </div>
                    ) : (
                      stageApplicants.map((a) => (
                        <div
                          key={a.id}
                          draggable
                          onDragStart={() => handleDragStart(a.id)}
                          onClick={() => setSelectedApplicant(a)}
                          className="bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-xs cursor-grab active:cursor-grabbing hover:shadow-md hover:border-[#22416D]/30 transition-all select-none"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-slate-800 truncate" title={a.full_name}>
                                {a.full_name}
                              </h4>
                              <p className="text-xs text-slate-400 truncate mt-0.5" title={a.job_title}>
                                {a.job_title}
                              </p>
                            </div>
                            {screeningBadge(a.screening_status)}
                          </div>

                          <div className="flex items-center justify-between mt-2.5 text-xs text-slate-500">
                            <div className="flex items-center gap-1.5 truncate">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{a.city}</span>
                            </div>
                            {ratingStars(a.rating, a.id)}
                          </div>

                          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                            <span>
                              {new Date(a.created_at).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                              })}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setWaApplicant(a);
                                  setShowWaModal(true);
                                }}
                                className="p-1 rounded-md hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                                title="Kirim Chat WhatsApp"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table View with Rigid Table-Fixed Column Geometry */
          <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-xs">
            <table className="table-fixed w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="w-[30%] text-left px-4 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Pelamar</th>
                  <th className="w-[24%] text-left px-4 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Posisi</th>
                  <th className="w-[14%] text-center px-4 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Tahap</th>
                  <th className="w-[12%] text-center px-4 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Screening</th>
                  <th className="w-[10%] text-center px-4 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Rating</th>
                  <th className="w-[10%] text-right px-4 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400 text-sm">
                      Tidak ada kandidat pelamar yang cocok dengan kriteria filter.
                    </td>
                  </tr>
                ) : (
                  filtered.map((a) => {
                    const stageInfo = PIPELINE_STAGES.find((s) => s.key === a.pipeline_stage);
                    return (
                      <tr
                        key={a.id}
                        onClick={() => setSelectedApplicant(a)}
                        className="h-[68px] hover:bg-slate-50/70 cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3.5">
                          <div className="font-bold text-slate-800 truncate" title={a.full_name}>
                            {a.full_name}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5 truncate" title={a.email}>
                            {a.email} &bull; {a.city}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 hidden md:table-cell truncate" title={a.job_title}>
                          <span className="text-sm font-medium text-slate-700">{a.job_title}</span>
                          {a.is_talent_pool && (
                            <span className="ml-1.5 inline-block text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                              Talent Pool
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-center whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${stageInfo?.bgLight} ${stageInfo?.text} border ${stageInfo?.border}`}
                          >
                            {stageInfo?.label || a.pipeline_stage}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center hidden sm:table-cell whitespace-nowrap">
                          {screeningBadge(a.screening_status)}
                        </td>
                        <td className="px-4 py-3.5 text-center hidden lg:table-cell">
                          <div className="flex justify-center">{ratingStars(a.rating, a.id)}</div>
                        </td>
                        <td className="px-4 py-3.5 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setWaApplicant(a);
                              setShowWaModal(true);
                            }}
                            className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                            title="WhatsApp"
                          >
                            <Phone className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. Applicant Detail Modal (With Fixed Height CV Container to Avoid Shifting) */}
      {selectedApplicant && (
        <ApplicantDetailModal
          applicant={selectedApplicant}
          onClose={() => setSelectedApplicant(null)}
          onUpdate={updateApplicant}
          getResumeUrl={getResumeUrl}
          onWhatsApp={(a) => {
            setWaApplicant(a);
            setShowWaModal(true);
          }}
        />
      )}

      {/* 6. WhatsApp Template Modal */}
      {showWaModal && waApplicant && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overscroll-contain animate-fade-in"
          onClick={() => setShowWaModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4 border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-800">
                <Phone className="w-4 h-4 text-emerald-600" />
                <h3 className="text-base font-bold">Hubungi via WhatsApp</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowWaModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Pilih template pesan untuk <strong className="text-slate-800">{waApplicant.full_name}</strong>:
            </p>

            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {WA_TEMPLATES.map((t, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => openWhatsApp(waApplicant, t.template)}
                  className="w-full text-left px-4 py-3 rounded-xl border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/50 text-xs font-semibold text-slate-700 transition-all cursor-pointer"
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// === Stable Applicant Detail Modal Sub-Component ===
function ApplicantDetailModal({
  applicant,
  onClose,
  onUpdate,
  getResumeUrl,
  onWhatsApp,
}: {
  applicant: Applicant;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Applicant>) => Promise<void>;
  getResumeUrl: (path: string) => Promise<string | null>;
  onWhatsApp: (a: Applicant) => void;
}) {
  const [notes, setNotes] = useState(applicant.hr_notes || '');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadPdf = async () => {
    setLoadingPdf(true);
    const url = await getResumeUrl(applicant.resume_path);
    setPdfUrl(url);
    setLoadingPdf(false);
  };

  const saveNotes = async () => {
    setSaving(true);
    await onUpdate(applicant.id, { hr_notes: notes });
    setSaving(false);
  };

  const stageInfo = PIPELINE_STAGES.find((s) => s.key === applicant.pipeline_stage);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 sm:pt-14 bg-black/50 backdrop-blur-xs overflow-y-auto overscroll-contain animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mb-12 border border-slate-200/80 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-800">{applicant.full_name}</h2>
              {applicant.is_talent_pool && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  Talent Pool
                </span>
              )}
            </div>
            <p className="text-xs font-semibold text-slate-500 mt-1">{applicant.job_title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/60">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate">{applicant.email}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{applicant.whatsapp}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{applicant.city}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Kesiapan: {applicant.join_availability}</span>
            </div>
          </div>

          {/* Status Selectors */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Tahap Pipeline:</span>
              <select
                value={applicant.pipeline_stage}
                onChange={(e) => onUpdate(applicant.id, { pipeline_stage: e.target.value })}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${stageInfo?.bgLight} ${stageInfo?.text} ${stageInfo?.border} focus:outline-none cursor-pointer`}
              >
                {PIPELINE_STAGES.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Hasil Screening:</span>
              {applicant.screening_status === 'passed' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Lolos Kualifikasi
                </span>
              )}
              {applicant.screening_status === 'knocked_out' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  <XCircle className="w-3.5 h-3.5" /> Disqualified
                </span>
              )}
              {applicant.screening_status === 'review' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                  <AlertTriangle className="w-3.5 h-3.5" /> Perlu Review
                </span>
              )}
            </div>
          </div>

          {/* Experience & Expectations */}
          <div className="rounded-xl border border-slate-200/80 p-4 space-y-2.5 bg-white">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Pengalaman / Pendidikan:
              </span>
              <p className="text-sm text-slate-700 mt-1 leading-relaxed">{applicant.last_experience}</p>
            </div>
            {applicant.expected_salary && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Ekspektasi Gaji:</span>
                <span className="text-sm font-bold text-slate-800">{applicant.expected_salary}</span>
              </div>
            )}
            {applicant.portfolio_url && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Portofolio Pelamar:</span>
                <a
                  href={applicant.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800"
                >
                  <span className="truncate max-w-[200px]">{applicant.portfolio_url}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* Custom Answers */}
          {applicant.custom_answers && Object.keys(applicant.custom_answers).length > 0 && (
            <div className="rounded-xl bg-amber-50/70 border border-amber-200/80 p-4">
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2.5">
                Jawaban Kuesioner Khusus
              </h4>
              <div className="space-y-2">
                {Object.entries(applicant.custom_answers).map(([key, value]) => (
                  <div key={key} className="text-xs">
                    <span className="font-bold text-amber-900 block">{key}</span>
                    <span className="text-slate-700 mt-0.5 block">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CV / Resume Section (Reserved Height to Prevent Layout Shift) */}
          <div className="border border-slate-200/80 rounded-xl p-4 bg-slate-50/50">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Berkas CV / Resume</h4>
              {!pdfUrl && (
                <button
                  type="button"
                  onClick={loadPdf}
                  disabled={loadingPdf}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#22416D] text-white text-xs font-bold hover:bg-[#1A3356] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{loadingPdf ? 'Memuat Pratinjau...' : 'Buka Pratinjau CV'}</span>
                </button>
              )}
            </div>

            {loadingPdf && (
              <div className="h-[380px] w-full flex items-center justify-center bg-white rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sedang mengambil berkas CV dari penyimpanan aman...</span>
                </div>
              </div>
            )}

            {pdfUrl && !loadingPdf && (
              <iframe
                src={pdfUrl}
                className="w-full h-[420px] rounded-lg border border-slate-200 bg-white"
                title="Pratinjau CV Pelamar"
              />
            )}
          </div>

          {/* Internal HR Notes */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
              Catatan Evaluasi Internal HRD
            </label>
            <textarea
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 min-h-[90px] resize-none focus:border-[#22416D] focus:ring-2 focus:ring-[#22416D]/15 focus:outline-none transition-all"
              placeholder="Tuliskan catatan interview, kesesuaian gaji, atau rekomendasi..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={saveNotes}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#22416D] text-white text-xs font-bold hover:bg-[#1A3356] transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Menyimpan...' : 'Simpan Catatan'}</span>
              </button>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onWhatsApp(applicant)}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>Hubungi via WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-sm font-bold hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
