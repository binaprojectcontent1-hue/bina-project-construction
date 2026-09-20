import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Save, Plus, Trash2, GripVertical, ChevronDown, AlertTriangle } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';

interface CustomQuestion {
  id: string;
  question: string;
  type: 'text' | 'radio' | 'yesno';
  options: string[];
  knockout_value: string;
  required: boolean;
}

interface JobEditorProps {
  jobId?: string;
  onBack: () => void;
  onSave: () => void;
}

const DEPARTMENTS = ['Arsitektur & Desain', 'Konstruksi & Lapangan', 'Estimator & RAB', 'Marketing & Finance', 'Magang'];
const JOB_TYPES = ['Full-time', 'Kontrak', 'Magang / Internship', 'Freelance'];
const WORKPLACE_TYPES = ['On-site', 'Hybrid', 'Remote'];
const EXP_LEVELS = ['Fresh Graduate', '1-3 Tahun', '3-5 Tahun', 'Senior'];

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function JobEditor({ jobId, onBack, onSave }: JobEditorProps) {
  const isEdit = Boolean(jobId);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [jobType, setJobType] = useState(JOB_TYPES[0]);
  const [workplaceType, setWorkplaceType] = useState(WORKPLACE_TYPES[0]);
  const [location, setLocation] = useState('Malang, Jawa Timur');
  const [experienceLevel, setExperienceLevel] = useState(EXP_LEVELS[1]);
  const [showSalary, setShowSalary] = useState(false);
  const [salaryRange, setSalaryRange] = useState('');
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState<string[]>(['']);
  const [requirements, setRequirements] = useState<string[]>(['']);
  const [benefits, setBenefits] = useState<string[]>(['']);
  const [customQuestions, setCustomQuestions] = useState<CustomQuestion[]>([]);
  const [status, setStatus] = useState('draft');
  const [deadline, setDeadline] = useState('');

  // Auto-generate slug from title
  useEffect(() => {
    if (!isEdit) setSlug(generateSlug(title));
  }, [title, isEdit]);

  // Load existing job
  useEffect(() => {
    if (!isEdit || !supabase || !jobId) return;
    (async () => {
      const { data } = await supabase.from('job_postings').select('*').eq('id', jobId).single();
      if (data) {
        setTitle(data.title);
        setSlug(data.slug);
        setDepartment(data.department);
        setJobType(data.job_type);
        setWorkplaceType(data.workplace_type);
        setLocation(data.location);
        setExperienceLevel(data.experience_level);
        setShowSalary(data.show_salary || false);
        setSalaryRange(data.salary_range || '');
        setDescription(data.description);
        setResponsibilities(data.responsibilities?.length ? data.responsibilities : ['']);
        setRequirements(data.requirements?.length ? data.requirements : ['']);
        setBenefits(data.benefits?.length ? data.benefits : ['']);
        setCustomQuestions(data.custom_questions || []);
        setStatus(data.status);
        setDeadline(data.application_deadline || '');
      }
      setLoading(false);
    })();
  }, [jobId, isEdit]);

  // List management helpers
  const updateListItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number, value: string) => {
    setter((prev) => prev.map((item, i) => (i === index ? value : item)));
  };
  const addListItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter((prev) => [...prev, '']);
  };
  const removeListItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  // Custom Question management
  const addQuestion = () => {
    setCustomQuestions((prev) => [
      ...prev,
      { id: `q${Date.now()}`, question: '', type: 'text', options: [], knockout_value: '', required: false },
    ]);
  };

  const updateQuestion = (index: number, updates: Partial<CustomQuestion>) => {
    setCustomQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, ...updates } : q)));
  };

  const removeQuestion = (index: number) => {
    setCustomQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!supabase || !title.trim() || !slug.trim() || !description.trim()) return;
    setSaving(true);

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      department,
      job_type: jobType,
      workplace_type: workplaceType,
      location: location.trim(),
      experience_level: experienceLevel,
      show_salary: showSalary,
      salary_range: salaryRange.trim() || null,
      description: description.trim(),
      responsibilities: responsibilities.filter((r) => r.trim()),
      requirements: requirements.filter((r) => r.trim()),
      benefits: benefits.filter((b) => b.trim()),
      custom_questions: customQuestions.filter((q) => q.question.trim()),
      status,
      application_deadline: deadline || null,
    };

    try {
      if (isEdit && jobId) {
        await supabase.from('job_postings').update(payload).eq('id', jobId);
      } else {
        await supabase.from('job_postings').insert(payload);
      }
      onSave();
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30 focus:outline-none transition-all";
  const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5";

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl min-h-[600px]">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48 rounded-xl" />
          <Skeleton className="h-10 w-28 rounded-xl" />
        </div>
        <Card className="p-6 space-y-4 border border-slate-200/80">
          <Skeleton className="h-5 w-32 rounded-md" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="h-11 w-full rounded-xl sm:col-span-2" />
            <Skeleton className="h-11 w-full rounded-xl sm:col-span-2" />
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        </Card>
        <Card className="p-6 space-y-4 border border-slate-200/80">
          <Skeleton className="h-5 w-32 rounded-md" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onBack} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">{isEdit ? 'Edit Lowongan' : 'Buat Lowongan Baru'}</h1>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !title.trim() || !description.trim()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#22416D] text-white text-sm font-bold hover:bg-[#1A3356] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>

      {/* Basic Info */}
      <div className="rounded-2xl bg-white border border-slate-100 p-6 space-y-5 shadow-sm">
        <h2 className="text-base font-bold text-slate-800 mb-2">Informasi Dasar</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelClass}>Judul Posisi *</label>
            <input type="text" className={inputClass} placeholder="Contoh: Arsitek & Desainer Interior" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Slug URL</label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 shrink-0">karir.binaproject.id/loker/</span>
              <input type="text" className={inputClass} value={slug} onChange={(e) => setSlug(e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Departemen</label>
            <select className={inputClass} value={department} onChange={(e) => setDepartment(e.target.value)}>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Tipe Pekerjaan</label>
            <select className={inputClass} value={jobType} onChange={(e) => setJobType(e.target.value)}>
              {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Tipe Tempat Kerja</label>
            <select className={inputClass} value={workplaceType} onChange={(e) => setWorkplaceType(e.target.value)}>
              {WORKPLACE_TYPES.map((w) => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Level Pengalaman</label>
            <select className={inputClass} value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)}>
              {EXP_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Lokasi</label>
            <input type="text" className={inputClass} value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Batas Lamaran</label>
            <input type="date" className={inputClass} value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </div>
        </div>

        {/* Salary Toggle */}
        <div className="flex items-center gap-4 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={showSalary} onChange={(e) => setShowSalary(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-400" />
            <span className="text-sm text-slate-600 font-medium">Tampilkan Gaji</span>
          </label>
          {showSalary && (
            <input type="text" className={`${inputClass} max-w-xs`} placeholder="Rp 3.500.000 - Rp 5.500.000" value={salaryRange} onChange={(e) => setSalaryRange(e.target.value)} />
          )}
        </div>
      </div>

      {/* Description */}
      <div className="rounded-2xl bg-white border border-slate-100 p-6 space-y-5 shadow-sm">
        <h2 className="text-base font-bold text-slate-800 mb-2">Deskripsi Pekerjaan</h2>
        <div>
          <label className={labelClass}>Deskripsi *</label>
          <textarea className={`${inputClass} min-h-[120px]`} placeholder="Jelaskan peran dan tanggung jawab posisi ini..." value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        {/* Responsibilities */}
        <div>
          <label className={labelClass}>Tanggung Jawab Utama</label>
          {responsibilities.map((item, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <input type="text" className={inputClass} placeholder="Contoh: Membuat gambar kerja proyek..." value={item} onChange={(e) => updateListItem(setResponsibilities, i, e.target.value)} />
              {responsibilities.length > 1 && (
                <button type="button" onClick={() => removeListItem(setResponsibilities, i)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => addListItem(setResponsibilities)} className="text-xs text-blue-500 font-bold hover:text-blue-700">+ Tambah</button>
        </div>

        {/* Requirements */}
        <div>
          <label className={labelClass}>Kualifikasi & Persyaratan</label>
          {requirements.map((item, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <input type="text" className={inputClass} placeholder="Contoh: Menguasai AutoCAD & SketchUp..." value={item} onChange={(e) => updateListItem(setRequirements, i, e.target.value)} />
              {requirements.length > 1 && (
                <button type="button" onClick={() => removeListItem(setRequirements, i)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => addListItem(setRequirements)} className="text-xs text-blue-500 font-bold hover:text-blue-700">+ Tambah</button>
        </div>

        {/* Benefits */}
        <div>
          <label className={labelClass}>Benefit & Fasilitas</label>
          {benefits.map((item, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <input type="text" className={inputClass} placeholder="Contoh: BPJS Kesehatan & Ketenagakerjaan..." value={item} onChange={(e) => updateListItem(setBenefits, i, e.target.value)} />
              {benefits.length > 1 && (
                <button type="button" onClick={() => removeListItem(setBenefits, i)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => addListItem(setBenefits)} className="text-xs text-blue-500 font-bold hover:text-blue-700">+ Tambah</button>
        </div>
      </div>

      {/* Custom Questions Builder */}
      <div className="rounded-2xl bg-white border border-slate-100 p-6 space-y-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800">Pertanyaan Khusus Posisi</h2>
            <p className="text-xs text-slate-400 mt-1">Tambahkan pertanyaan kualifikasi yang wajib dijawab pelamar.</p>
          </div>
          <button type="button" onClick={addQuestion} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 text-amber-700 text-xs font-bold hover:bg-amber-100 transition-colors">
            <Plus className="w-3.5 h-3.5" />
            Tambah Pertanyaan
          </button>
        </div>

        {customQuestions.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            Belum ada pertanyaan khusus. Klik tombol di atas untuk menambahkan.
          </div>
        ) : (
          <div className="space-y-4">
            {customQuestions.map((q, i) => (
              <div key={q.id} className="rounded-xl border border-slate-200 p-4 space-y-3 bg-slate-50/50">
                <div className="flex items-start gap-3">
                  <GripVertical className="w-4 h-4 text-slate-300 mt-2.5 shrink-0 cursor-grab" />
                  <div className="flex-1 space-y-3">
                    <input type="text" className={inputClass} placeholder="Tulis pertanyaan..." value={q.question} onChange={(e) => updateQuestion(i, { question: e.target.value })} />

                    <div className="flex flex-wrap items-center gap-3">
                      <select
                        className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-600"
                        value={q.type}
                        onChange={(e) => updateQuestion(i, { type: e.target.value as CustomQuestion['type'], options: e.target.value === 'text' ? [] : [''] })}
                      >
                        <option value="text">Teks Singkat</option>
                        <option value="radio">Pilihan Ganda</option>
                        <option value="yesno">Ya / Tidak</option>
                      </select>

                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" checked={q.required} onChange={(e) => updateQuestion(i, { required: e.target.checked })} className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600" />
                        <span className="text-xs text-slate-500">Wajib</span>
                      </label>

                      {q.type !== 'text' && (
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <AlertTriangle className="w-3 h-3 text-amber-500" />
                          <span className="text-xs text-slate-500">Knockout:</span>
                          <input
                            type="text"
                            className="w-20 px-2 py-1 rounded-lg bg-white border border-slate-200 text-xs text-slate-600"
                            placeholder="Jawaban"
                            value={q.knockout_value}
                            onChange={(e) => updateQuestion(i, { knockout_value: e.target.value })}
                          />
                        </label>
                      )}
                    </div>

                    {q.type === 'radio' && (
                      <div className="space-y-2">
                        {q.options.map((opt, oi) => (
                          <div key={oi} className="flex items-center gap-2">
                            <span className="text-xs text-slate-400 w-4">{oi + 1}.</span>
                            <input type="text" className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-600" placeholder="Opsi jawaban" value={opt} onChange={(e) => {
                              const newOpts = [...q.options];
                              newOpts[oi] = e.target.value;
                              updateQuestion(i, { options: newOpts });
                            }} />
                            {q.options.length > 1 && (
                              <button type="button" onClick={() => {
                                updateQuestion(i, { options: q.options.filter((_, j) => j !== oi) });
                              }} className="text-slate-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                            )}
                          </div>
                        ))}
                        <button type="button" onClick={() => updateQuestion(i, { options: [...q.options, ''] })} className="text-xs text-blue-500 font-bold">+ Tambah Opsi</button>
                      </div>
                    )}
                  </div>

                  <button type="button" onClick={() => removeQuestion(i)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status & Publish */}
      <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-800 mb-4">Status Publikasi</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { value: 'draft', label: 'Draft', desc: 'Simpan sebagai draft, belum tampil di portal' },
            { value: 'published', label: 'Publikasikan', desc: 'Langsung tampil di karir.binaproject.id' },
            { value: 'closed', label: 'Ditutup', desc: 'Lowongan tidak menerima lamaran lagi' },
          ].map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setStatus(s.value)}
              className={`p-4 rounded-xl border-2 text-left cursor-pointer transition-all ${
                status === s.value
                  ? 'border-blue-500 bg-blue-50/50 shadow-xs'
                  : 'border-slate-100 hover:border-slate-200 bg-white'
              }`}
            >
              <div className={`text-sm font-bold ${status === s.value ? 'text-blue-700' : 'text-slate-700'}`}>
                {s.label}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">{s.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
