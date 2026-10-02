import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Save, Plus, Trash2, GripVertical, ChevronDown, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { triggerCloudflareDeploy } from '../lib/cloudflare';

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

const DEPARTMENTS = ['Desain & Perencanaan', 'Konstruksi & Lapangan', 'Estimator & RAB', 'Marketing & Finance', 'Magang'];
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
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [formLayout, setFormLayout] = useState<'multi_step' | 'single_page'>('multi_step');
  const [linkCopied, setLinkCopied] = useState(false);

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
        setThumbnailUrl(data.thumbnail_url || '');
        setFormLayout(data.form_layout || 'multi_step');
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
      thumbnail_url: thumbnailUrl.trim() || null,
      form_layout: formLayout,
    };

    try {
      if (isEdit && jobId) {
        await supabase.from('job_postings').update(payload).eq('id', jobId);
      } else {
        await supabase.from('job_postings').insert(payload);
      }
      triggerCloudflareDeploy().catch(() => {});
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
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={onBack} className="h-8 w-8 text-slate-600">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">{isEdit ? 'Edit Lowongan' : 'Buat Lowongan Baru'}</h1>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving || !title.trim() || !description.trim()}
          size="sm"
          className="gap-2 font-medium"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Menyimpan...' : 'Simpan'}</span>
        </Button>
      </div>

      {/* Basic Info */}
      <div className="rounded-xl bg-white border border-slate-200/80 p-6 space-y-5 shadow-xs">
        <h2 className="text-sm font-semibold text-slate-900 mb-2">Informasi Dasar</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelClass}>Judul Posisi *</label>
            <input type="text" className={inputClass} placeholder="Contoh: Arsitek & Desainer Interior" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Alamat Link Halaman Lowongan</label>
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

          {/* Thumbnail / Foto Card Lowongan */}
          <div className="sm:col-span-2 space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className={labelClass}>URL Thumbnail / Foto Kartu Lowongan (Opsional)</label>
              <span className="text-xs text-slate-400 font-normal">Disarankan rasio 1:1 (persegi)</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                className={inputClass}
                placeholder="Contoh: https://images.unsplash.com/... atau URL gambar lainnya"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
              />
              {thumbnailUrl && (
                <button
                  type="button"
                  onClick={() => setThumbnailUrl('')}
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-red-600 bg-slate-100 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                >
                  Hapus
                </button>
              )}
            </div>
            {thumbnailUrl.trim() ? (
              <div className="mt-2 space-y-1.5">
                <div className="relative aspect-square w-36 h-36 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs">
                  <img
                    src={thumbnailUrl.trim()}
                    alt="Preview Thumbnail"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop';
                    }}
                  />
                  <span className="absolute bottom-2 left-2 text-[10px] font-mono bg-black/70 text-white px-2 py-0.5 rounded backdrop-blur-xs">
                    Live Preview 1:1
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                Kosongkan untuk otomatis menggunakan visual fotografi arsitektur &amp; konstruksi default kategori <strong className="text-slate-600">{department}</strong>.
              </p>
            )}
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
      <div className="rounded-xl bg-white border border-slate-200/80 p-6 space-y-5 shadow-xs">
        <h2 className="text-sm font-semibold text-slate-900 mb-2">Deskripsi Pekerjaan</h2>
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
          <button type="button" onClick={() => addListItem(setResponsibilities)} className="text-xs text-blue-600 font-semibold hover:text-blue-800 cursor-pointer">+ Tambah</button>
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
          <button type="button" onClick={() => addListItem(setRequirements)} className="text-xs text-blue-600 font-semibold hover:text-blue-800 cursor-pointer">+ Tambah</button>
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
          <button type="button" onClick={() => addListItem(setBenefits)} className="text-xs text-blue-600 font-semibold hover:text-blue-800 cursor-pointer">+ Tambah</button>
        </div>
      </div>

      {/* Custom Questions Builder */}
      <div className="rounded-xl bg-white border border-slate-200/80 p-6 space-y-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Pertanyaan Khusus Posisi</h2>
            <p className="text-xs text-slate-400 mt-0.5">Tambahkan pertanyaan kualifikasi yang wajib dijawab pelamar.</p>
          </div>
          <button type="button" onClick={addQuestion} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 text-xs font-semibold hover:bg-amber-100 transition-colors border border-amber-200/60 cursor-pointer">
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
                          <span className="text-xs text-slate-500">Diskualifikasi jika:</span>
                          <input
                            type="text"
                            className="w-28 px-2 py-1 rounded-lg bg-white border border-slate-200 text-xs text-slate-600"
                            placeholder="Jawaban salah"
                            title="Jika pelamar memilih jawaban ini, status lamaran otomatis ditandai tidak lolos kualifikasi."
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
                        <button type="button" onClick={() => updateQuestion(i, { options: [...q.options, ''] })} className="text-xs text-blue-600 font-semibold cursor-pointer">+ Tambah Opsi</button>
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

      {/* Form Settings & Share Link (Google Forms style) */}
      <div className="rounded-xl bg-white border border-slate-200/80 p-6 space-y-5 shadow-xs">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Pengaturan Formulir &amp; Tautan Berbagi</h2>
          <p className="text-xs text-slate-400 mt-0.5">Atur tampilan formulir lamaran online dan dapatkan tautan langsung untuk dibagikan ke kandidat.</p>
        </div>

        {/* Layout Mode Selector */}
        <div>
          <label className={labelClass}>Mode Tampilan Formulir</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1.5">
            <button
              type="button"
              onClick={() => setFormLayout('multi_step')}
              className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                formLayout === 'multi_step'
                  ? 'border-[#1B365D] bg-blue-50/50 ring-1 ring-[#1B365D]'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className={`text-xs font-semibold ${formLayout === 'multi_step' ? 'text-[#1B365D]' : 'text-slate-700'}`}>
                Bertahap (Multi-step Wizard)
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Formulir dibagi menjadi beberapa tahap pengisian dengan progress bar yang rapi.
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFormLayout('single_page')}
              className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                formLayout === 'single_page'
                  ? 'border-[#1B365D] bg-blue-50/50 ring-1 ring-[#1B365D]'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className={`text-xs font-semibold ${formLayout === 'single_page' ? 'text-[#1B365D]' : 'text-slate-700'}`}>
                Satu Halaman Penuh (Single Page)
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Semua pertanyaan tampil berurutan dalam kartu-kartu dalam satu halaman seperti Google Forms.
              </div>
            </button>
          </div>
        </div>

        {/* Shareable Direct Form Link */}
        <div className="pt-3 border-t border-slate-100">
          <label className={labelClass}>Tautan Langsung Formulir (Direct Link IG / WA)</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              className={`${inputClass} bg-slate-50 text-slate-600 font-mono text-xs select-all`}
              value={`https://karir.binaproject.id/loker/${slug || 'posisi'}/lamar`}
            />
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(`https://karir.binaproject.id/loker/${slug || 'posisi'}/lamar`);
                setLinkCopied(true);
                setTimeout(() => setLinkCopied(false), 2000);
              }}
              className="px-4 py-2.5 rounded-xl bg-[#1B365D] text-white hover:bg-[#22416D] text-xs font-medium shrink-0 transition-colors cursor-pointer"
            >
              {linkCopied ? 'Tersalin!' : 'Salin Link'}
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">
            Pelamar dari Instagram (Bio/DM) atau WhatsApp dapat langsung mengisi berkas melalui link ini tanpa perlu mencari di web karir.
          </p>
        </div>
      </div>

      {/* Status & Publish */}
      <div className="rounded-xl bg-white border border-slate-200/80 p-6 shadow-xs">
        <h2 className="text-sm font-semibold text-slate-900 mb-4">Status &amp; Visibilitas Lowongan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { value: 'published', label: 'Publik', desc: 'Tampil di web karir & link formulir aktif' },
            { value: 'unlisted', label: 'Private (Link Only)', desc: 'Tidak muncul di web karir, hanya pelamar dengan link (IG/WA) yang bisa mengisi' },
            { value: 'closed', label: 'Ditutup', desc: 'Tetap tampil di web dengan label ditutup & formulir terkunci' },
            { value: 'draft', label: 'Draft', desc: 'Tersimpan hanya di dashboard admin' },
          ].map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setStatus(s.value)}
              className={`p-4 rounded-lg border text-left cursor-pointer transition-all ${
                status === s.value
                  ? 'border-[#1B365D] bg-blue-50/50 ring-1 ring-[#1B365D]'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className={`text-xs font-semibold ${status === s.value ? 'text-[#1B365D]' : 'text-slate-700'}`}>
                {s.label}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 leading-snug">{s.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
