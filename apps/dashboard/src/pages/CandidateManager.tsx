import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import {
  Search,
  Filter,
  LayoutGrid,
  Table as TableIcon,
  Star,
  MessageSquare,
  FileText,
  X,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Save,
} from 'lucide-react';

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
  { key: 'new', label: 'Masuk', color: 'bg-blue-500', bgLight: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  { key: 'screening', label: 'Screening', color: 'bg-amber-500', bgLight: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
  { key: 'interview', label: 'Wawancara', color: 'bg-violet-500', bgLight: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200' },
  { key: 'offering', label: 'Diterima', color: 'bg-emerald-500', bgLight: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
  { key: 'rejected', label: 'Belum Sesuai', color: 'bg-red-500', bgLight: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
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
  const [jobs, setJobs] = useState<{id: string; title: string}[]>([]);
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

  useEffect(() => { fetchData(); }, []);

  const updateApplicant = async (id: string, updates: Partial<Applicant>) => {
    if (!supabase) return;
    await supabase.from('job_applications').update(updates).eq('id', id);
    setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
    if (selectedApplicant?.id === id) {
      setSelectedApplicant((prev) => prev ? { ...prev, ...updates } : prev);
    }
  };

  const getResumeUrl = async (path: string): Promise<string | null> => {
    if (!supabase) return null;
    const { data } = await supabase.storage.from('job-applications').createSignedUrl(path, 600);
    return data?.signedUrl || null;
  };

  const filtered = applicants.filter((a) => {
    const matchSearch = a.full_name.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase()) || a.city.toLowerCase().includes(search.toLowerCase());
    const matchJob = jobFilter === 'all' || a.job_id === jobFilter || (jobFilter === 'talent-pool' && a.is_talent_pool);
    return matchSearch && matchJob;
  });

  const screeningBadge = (status: string) => {
    switch (status) {
      case 'passed': return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">Lolos</span>;
      case 'knocked_out': return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">Knocked Out</span>;
      default: return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">Review</span>;
    }
  };

  const ratingStars = (rating: number, applicantId: string) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button key={s} type="button" onClick={() => updateApplicant(applicantId, { rating: s })} className={`p-0.5 ${s <= rating ? 'text-amber-400' : 'text-slate-300'} hover:text-amber-400 transition-colors`}>
          <Star className="w-3.5 h-3.5" fill={s <= rating ? 'currentColor' : 'none'} />
        </button>
      ))}
    </div>
  );

  // Drag handlers for Kanban
  const handleDragStart = (id: string) => setDraggedId(id);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (stage: string) => {
    if (draggedId) {
      updateApplicant(draggedId, { pipeline_stage: stage } as any);
      setDraggedId(null);
    }
  };

  // Open WhatsApp with template
  const openWhatsApp = (applicant: Applicant, templateFn: (name: string, pos: string) => string) => {
    const phone = applicant.whatsapp.replace(/[^0-9]/g, '').replace(/^0/, '62');
    const message = templateFn(applicant.full_name, applicant.job_title);
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    setShowWaModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Kandidat Pelamar</h1>
          <p className="text-sm text-slate-500 mt-1">{applicants.length} total pelamar</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setViewMode('kanban')} className={`p-2.5 rounded-xl transition-all ${viewMode === 'kanban' ? 'bg-[#22416D] text-white' : 'bg-slate-100 text-slate-400 hover:text-slate-700'}`} title="Kanban">
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => setViewMode('table')} className={`p-2.5 rounded-xl transition-all ${viewMode === 'table' ? 'bg-[#22416D] text-white' : 'bg-slate-100 text-slate-400 hover:text-slate-700'}`} title="Tabel">
            <TableIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Cari nama, email, kota..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30 focus:outline-none" />
        </div>
        <select value={jobFilter} onChange={(e) => setJobFilter(e.target.value)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-600 focus:border-blue-400 focus:outline-none">
          <option value="all">Semua Posisi</option>
          <option value="talent-pool">Talent Pool</option>
          {jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400 text-sm">Memuat data pelamar...</div>
      ) : viewMode === 'kanban' ? (
        /* === KANBAN VIEW === */
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2">
          {PIPELINE_STAGES.map((stage) => {
            const stageApplicants = filtered.filter((a) => a.pipeline_stage === stage.key);
            return (
              <div
                key={stage.key}
                className={`flex-shrink-0 w-72 rounded-2xl ${stage.bgLight} border ${stage.border} p-3`}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(stage.key)}
              >
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
                    <span className={`text-sm font-bold ${stage.text}`}>{stage.label}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-white px-2 py-0.5 rounded-full">{stageApplicants.length}</span>
                </div>

                <div className="space-y-2.5 min-h-[100px]">
                  {stageApplicants.map((a) => (
                    <div
                      key={a.id}
                      draggable
                      onDragStart={() => handleDragStart(a.id)}
                      className="bg-white rounded-xl p-3.5 border border-slate-100 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
                      onClick={() => setSelectedApplicant(a)}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-slate-800 truncate">{a.full_name}</h4>
                          <p className="text-xs text-slate-400 truncate">{a.job_title}</p>
                        </div>
                        {screeningBadge(a.screening_status)}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <MapPin className="w-3 h-3" />
                          <span>{a.city}</span>
                        </div>
                        {ratingStars(a.rating, a.id)}
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                        <span className="text-[10px] text-slate-400">{new Date(a.created_at).toLocaleDateString('id-ID')}</span>
                        <div className="flex gap-1">
                          <button type="button" onClick={(e) => { e.stopPropagation(); setWaApplicant(a); setShowWaModal(true); }} className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors" title="WhatsApp">
                            <Phone className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* === TABLE VIEW === */
        <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase">Pelamar</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase hidden md:table-cell">Posisi</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase">Status</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase hidden sm:table-cell">Screening</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase hidden lg:table-cell">Rating</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-slate-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((a) => {
                const stageInfo = PIPELINE_STAGES.find((s) => s.key === a.pipeline_stage);
                return (
                  <tr key={a.id} className="hover:bg-slate-50/50 cursor-pointer transition-colors" onClick={() => setSelectedApplicant(a)}>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-800">{a.full_name}</div>
                      <div className="text-xs text-slate-400">{a.email} · {a.city}</div>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className="text-sm text-slate-600">{a.job_title}</span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${stageInfo?.bgLight} ${stageInfo?.text} border ${stageInfo?.border}`}>
                        {stageInfo?.label || a.pipeline_stage}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center hidden sm:table-cell">{screeningBadge(a.screening_status)}</td>
                    <td className="px-4 py-3.5 text-center hidden lg:table-cell">{ratingStars(a.rating, a.id)}</td>
                    <td className="px-4 py-3.5 text-right">
                      <button type="button" onClick={(e) => { e.stopPropagation(); setWaApplicant(a); setShowWaModal(true); }} className="p-2 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors">
                        <Phone className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* === APPLICANT DETAIL MODAL === */}
      {selectedApplicant && (
        <ApplicantDetailModal
          applicant={selectedApplicant}
          onClose={() => setSelectedApplicant(null)}
          onUpdate={updateApplicant}
          getResumeUrl={getResumeUrl}
          onWhatsApp={(a) => { setWaApplicant(a); setShowWaModal(true); }}
        />
      )}

      {/* === WHATSAPP TEMPLATE MODAL === */}
      {showWaModal && waApplicant && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowWaModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">Hubungi via WhatsApp</h3>
              <button type="button" onClick={() => setShowWaModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-sm text-slate-500">Pilih template pesan untuk <strong className="text-slate-700">{waApplicant.full_name}</strong>:</p>
            <div className="space-y-2">
              {WA_TEMPLATES.map((t, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => openWhatsApp(waApplicant, t.template)}
                  className="w-full text-left px-4 py-3 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50 text-sm font-medium text-slate-700 transition-all"
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

// === Applicant Detail Modal Sub-Component ===
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
    await onUpdate(applicant.id, { hr_notes: notes } as any);
    setSaving(false);
  };

  const stageInfo = PIPELINE_STAGES.find((s) => s.key === applicant.pipeline_stage);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-12 sm:pt-20 bg-black/50 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mb-12" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-800">{applicant.full_name}</h2>
            <p className="text-sm text-slate-500 mt-0.5">{applicant.job_title}{applicant.is_talent_pool && ' (Talent Pool)'}</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-6">
          {/* Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4 text-slate-400" /><span className="text-slate-600">{applicant.email}</span></div>
            <div className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-slate-400" /><span className="text-slate-600">{applicant.whatsapp}</span></div>
            <div className="flex items-center gap-2 text-sm"><MapPin className="w-4 h-4 text-slate-400" /><span className="text-slate-600">{applicant.city}</span></div>
            <div className="flex items-center gap-2 text-sm"><Clock className="w-4 h-4 text-slate-400" /><span className="text-slate-600">Bergabung: {applicant.join_availability}</span></div>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500">Pipeline:</span>
              <select
                value={applicant.pipeline_stage}
                onChange={(e) => onUpdate(applicant.id, { pipeline_stage: e.target.value } as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border ${stageInfo?.bgLight} ${stageInfo?.text} ${stageInfo?.border} focus:outline-none`}
              >
                {PIPELINE_STAGES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500">Screening:</span>
              {applicant.screening_status === 'passed' && <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700"><CheckCircle2 className="w-3 h-3" />Lolos Kualifikasi</span>}
              {applicant.screening_status === 'knocked_out' && <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-700"><XCircle className="w-3 h-3" />Disqualified</span>}
              {applicant.screening_status === 'review' && <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600"><AlertTriangle className="w-3 h-3" />Perlu Review</span>}
            </div>
          </div>

          {/* Experience & Salary */}
          <div className="rounded-xl bg-slate-50 p-4 space-y-2">
            <div><span className="text-xs text-slate-500">Pengalaman:</span><p className="text-sm text-slate-700 mt-0.5">{applicant.last_experience}</p></div>
            {applicant.expected_salary && <div><span className="text-xs text-slate-500">Ekspektasi Gaji:</span><p className="text-sm text-slate-700 mt-0.5">{applicant.expected_salary}</p></div>}
            {applicant.portfolio_url && (
              <div>
                <span className="text-xs text-slate-500">Portofolio:</span>
                <a href={applicant.portfolio_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mt-0.5">
                  {applicant.portfolio_url.substring(0, 50)}... <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* Custom Answers */}
          {Object.keys(applicant.custom_answers).length > 0 && (
            <div className="rounded-xl bg-amber-50 border border-amber-100 p-4">
              <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-3">Jawaban Kuesioner</h4>
              <div className="space-y-2">
                {Object.entries(applicant.custom_answers).map(([key, value]) => (
                  <div key={key} className="flex items-start gap-2">
                    <span className="text-xs text-amber-600 font-bold shrink-0">{key}:</span>
                    <span className="text-sm text-slate-700">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CV Preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-slate-700">CV / Resume</h4>
              {!pdfUrl && (
                <button type="button" onClick={loadPdf} disabled={loadingPdf} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 transition-colors disabled:opacity-50">
                  <FileText className="w-3.5 h-3.5" />
                  {loadingPdf ? 'Memuat...' : 'Preview CV'}
                </button>
              )}
            </div>
            {pdfUrl && (
              <iframe src={pdfUrl} className="w-full h-[400px] rounded-xl border border-slate-200" title="CV Preview" />
            )}
          </div>

          {/* HR Notes */}
          <div>
            <label className="text-sm font-bold text-slate-700 mb-1.5 block">Catatan Internal HRD</label>
            <textarea
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-700 placeholder-slate-400 min-h-[80px] resize-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30 focus:outline-none"
              placeholder="Tambahkan catatan seleksi, hasil interview, dll..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <button type="button" onClick={saveNotes} disabled={saving} className="mt-2 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#22416D] text-white text-xs font-bold hover:bg-[#1A3356] transition-colors disabled:opacity-50">
              <Save className="w-3.5 h-3.5" />{saving ? 'Menyimpan...' : 'Simpan Catatan'}
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => onWhatsApp(applicant)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition-colors">
              <Phone className="w-4 h-4" />Hubungi WhatsApp
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-sm font-bold hover:bg-slate-200 transition-colors">
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
