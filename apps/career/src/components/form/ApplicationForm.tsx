import React, { useState, useRef, useCallback } from 'react';

interface CustomQuestion {
  id: string;
  question: string;
  type: 'text' | 'radio' | 'yesno';
  options?: string[];
  knockout_value?: string;
  required?: boolean;
}

interface ApplicationFormProps {
  jobId: string | null;
  jobTitle: string;
  jobSlug: string;
  customQuestions: CustomQuestion[];
  isTalentPool?: boolean;
}

type FormData = {
  fullName: string;
  email: string;
  whatsapp: string;
  city: string;
  lastExperience: string;
  joinAvailability: string;
  expectedSalary: string;
  portfolioUrl: string;
  customAnswers: Record<string, string>;
  honeypot: string;
};

const STEPS = ['Identitas & Kontak', 'Pengalaman & Berkas', 'Kuesioner Khusus', 'Konfirmasi & Kirim'];

export function ApplicationForm({ jobId, jobTitle, jobSlug, customQuestions, isTalentPool = false }: ApplicationFormProps) {
  const hasCustomQuestions = customQuestions.length > 0;
  const totalSteps = hasCustomQuestions ? 4 : 3;
  const stepLabels = hasCustomQuestions ? STEPS : [STEPS[0], STEPS[1], STEPS[3]];

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    whatsapp: '',
    city: '',
    lastExperience: '',
    joinAvailability: 'Segera',
    expectedSalary: '',
    portfolioUrl: '',
    customAnswers: {},
    honeypot: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const updateCustomAnswer = (qId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      customAnswers: { ...prev.customAnswers, [qId]: value },
    }));
  };

  const validateStep = (s: number): boolean => {
    const newErrors: Record<string, string> = {};
    const actualStep = !hasCustomQuestions && s >= 2 ? 3 : s;

    if (actualStep === 0) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Nama lengkap wajib diisi';
      if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email tidak valid';
      if (!formData.whatsapp.trim() || !/^(\+62|62|08)\d{8,12}$/.test(formData.whatsapp.replace(/[\s-]/g, ''))) newErrors.whatsapp = 'Nomor WhatsApp tidak valid';
      if (!formData.city.trim()) newErrors.city = 'Kota domisili wajib diisi';
    } else if (actualStep === 1) {
      if (!formData.lastExperience.trim()) newErrors.lastExperience = 'Pengalaman/pendidikan wajib diisi';
      if (!file) newErrors.file = 'Upload CV wajib (PDF, maks 10MB)';
      else if (file.type !== 'application/pdf') newErrors.file = 'Hanya file PDF yang diterima';
      else if (file.size > 10 * 1024 * 1024) newErrors.file = 'Ukuran file maksimal 10MB';
    } else if (actualStep === 2 && hasCustomQuestions) {
      customQuestions.forEach((q) => {
        if (q.required && !formData.customAnswers[q.id]?.trim()) {
          newErrors[`q_${q.id}`] = 'Pertanyaan ini wajib dijawab';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, totalSteps - 1));
  };
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) {
      if (f.type !== 'application/pdf') {
        setErrors((prev) => ({ ...prev, file: 'Hanya file PDF yang diterima' }));
        return;
      }
      if (f.size > 10 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, file: 'Ukuran file maksimal 10MB' }));
        return;
      }
      setFile(f);
      setErrors((prev) => { const n = { ...prev }; delete n.file; return n; });
    }
  }, []);

  const handleSubmit = async () => {
    if (!validateStep(step)) return;
    if (formData.honeypot) return; // Bot trap

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      const payload = new FormData();
      payload.append('jobId', jobId || '');
      payload.append('jobTitle', jobTitle);
      payload.append('jobSlug', jobSlug);
      payload.append('isTalentPool', String(isTalentPool));
      payload.append('fullName', formData.fullName);
      payload.append('email', formData.email);
      payload.append('whatsapp', formData.whatsapp);
      payload.append('city', formData.city);
      payload.append('lastExperience', formData.lastExperience);
      payload.append('joinAvailability', formData.joinAvailability);
      payload.append('expectedSalary', formData.expectedSalary);
      payload.append('portfolioUrl', formData.portfolioUrl);
      payload.append('customAnswers', JSON.stringify(formData.customAnswers));
      if (file) payload.append('resume', file);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const res = await fetch('/api/apply', { method: 'POST', body: payload });
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (res.ok) {
        setSubmitStatus('success');
      } else {
        const data = await res.json().catch(() => ({}));
        setErrors({ submit: data.error || 'Gagal mengirim lamaran. Silakan coba lagi.' });
        setSubmitStatus('error');
      }
    } catch (err) {
      setErrors({ submit: 'Terjadi kesalahan jaringan. Silakan coba lagi.' });
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success State
  if (submitStatus === 'success') {
    return (
      <div className="text-center py-8 sm:py-12">
        <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Lamaran Terkirim! 🎉</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
          Terima kasih, <strong className="text-white">{formData.fullName}</strong>! Lamaran Anda untuk posisi <strong className="text-amber-400">{jobTitle}</strong> telah berhasil dikirim.
          Tim HRD kami akan meninjau dalam 3-5 hari kerja dan menghubungi Anda melalui WhatsApp atau email.
        </p>
        <a href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all">
          ← Kembali ke Beranda Karir
        </a>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-3 rounded-xl bg-[#0B132B] border border-white/10 text-white text-sm placeholder-slate-500 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 focus:outline-none transition-all";
  const labelClass = "block text-sm font-semibold text-slate-200 mb-1.5";
  const errorClass = "text-xs text-red-400 mt-1";

  const renderStep = () => {
    const actualStep = !hasCustomQuestions && step >= 2 ? 3 : step;

    switch (actualStep) {
      // Step 1: Identity & Contact
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Nama Lengkap <span className="text-red-400">*</span></label>
              <input type="text" className={inputClass} placeholder="Contoh: Ahmad Fadhil" value={formData.fullName} onChange={(e) => updateField('fullName', e.target.value)} />
              {errors.fullName && <p className={errorClass}>{errors.fullName}</p>}
            </div>
            <div>
              <label className={labelClass}>Email Aktif <span className="text-red-400">*</span></label>
              <input type="email" className={inputClass} placeholder="nama@email.com" value={formData.email} onChange={(e) => updateField('email', e.target.value)} />
              {errors.email && <p className={errorClass}>{errors.email}</p>}
            </div>
            <div>
              <label className={labelClass}>Nomor WhatsApp <span className="text-red-400">*</span></label>
              <input type="tel" className={inputClass} placeholder="08123456789" value={formData.whatsapp} onChange={(e) => updateField('whatsapp', e.target.value)} />
              {errors.whatsapp && <p className={errorClass}>{errors.whatsapp}</p>}
            </div>
            <div>
              <label className={labelClass}>Kota Domisili <span className="text-red-400">*</span></label>
              <input type="text" className={inputClass} placeholder="Contoh: Malang" value={formData.city} onChange={(e) => updateField('city', e.target.value)} />
              {errors.city && <p className={errorClass}>{errors.city}</p>}
            </div>
          </div>
        );

      // Step 2: Experience & Documents
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Pengalaman Terakhir / Pendidikan <span className="text-red-400">*</span></label>
              <textarea className={`${inputClass} min-h-[80px] resize-none`} placeholder="Contoh: Drafter di CV. Karya Abadi (2 tahun) / S1 Arsitektur Universitas Brawijaya" value={formData.lastExperience} onChange={(e) => updateField('lastExperience', e.target.value)} />
              {errors.lastExperience && <p className={errorClass}>{errors.lastExperience}</p>}
            </div>
            <div>
              <label className={labelClass}>Kesiapan Mulai Bekerja</label>
              <select className={inputClass} value={formData.joinAvailability} onChange={(e) => updateField('joinAvailability', e.target.value)}>
                <option value="Segera">Segera</option>
                <option value="2 Minggu">2 Minggu</option>
                <option value="1 Bulan">1 Bulan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Ekspektasi Gaji <span className="text-slate-500">(opsional)</span></label>
              <input type="text" className={inputClass} placeholder="Contoh: Rp 4.000.000" value={formData.expectedSalary} onChange={(e) => updateField('expectedSalary', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Upload CV / Resume <span className="text-red-400">*</span></label>
              <div
                className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${isDragOver ? 'border-amber-500/50 bg-amber-500/5' : 'border-white/10 hover:border-white/20'}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) { setFile(f); setErrors((prev) => { const n = { ...prev }; delete n.file; return n; }); }
                  }}
                />
                {file ? (
                  <div className="flex items-center justify-center gap-3">
                    <svg className="w-6 h-6 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <div className="text-left">
                      <p className="text-sm text-white font-medium truncate max-w-[200px]">{file.name}</p>
                      <p className="text-xs text-slate-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                    <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); }} className="ml-2 p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-red-400 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <svg className="w-8 h-8 text-slate-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                    <p className="text-sm text-slate-400">Drag & drop atau klik untuk upload</p>
                    <p className="text-xs text-slate-500 mt-1">PDF, maks 10MB</p>
                  </>
                )}
              </div>
              {errors.file && <p className={errorClass}>{errors.file}</p>}
            </div>
            <div>
              <label className={labelClass}>Link Portofolio <span className="text-slate-500">(opsional)</span></label>
              <input type="url" className={inputClass} placeholder="https://drive.google.com/... atau behance.net/..." value={formData.portfolioUrl} onChange={(e) => updateField('portfolioUrl', e.target.value)} />
            </div>
          </div>
        );

      // Step 3: Custom Questions
      case 2:
        return (
          <div className="space-y-5">
            <p className="text-sm text-slate-400 mb-2">Jawab pertanyaan khusus dari tim HRD untuk posisi ini:</p>
            {customQuestions.map((q) => (
              <div key={q.id}>
                <label className={labelClass}>
                  {q.question} {q.required && <span className="text-red-400">*</span>}
                </label>
                {q.type === 'text' && (
                  <input type="text" className={inputClass} placeholder="Jawaban Anda..." value={formData.customAnswers[q.id] || ''} onChange={(e) => updateCustomAnswer(q.id, e.target.value)} />
                )}
                {q.type === 'radio' && q.options && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {q.options.map((opt) => (
                      <label key={opt} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer text-sm transition-all ${formData.customAnswers[q.id] === opt ? 'bg-amber-500/15 border-amber-500/30 text-amber-300' : 'bg-[#0B132B] border-white/10 text-slate-300 hover:border-white/20'}`}>
                        <input type="radio" name={q.id} value={opt} checked={formData.customAnswers[q.id] === opt} onChange={() => updateCustomAnswer(q.id, opt)} className="sr-only" />
                        {opt}
                      </label>
                    ))}
                  </div>
                )}
                {q.type === 'yesno' && (
                  <div className="flex gap-2 mt-1">
                    {['Ya', 'Tidak'].map((opt) => (
                      <label key={opt} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer text-sm transition-all ${formData.customAnswers[q.id] === opt ? 'bg-amber-500/15 border-amber-500/30 text-amber-300' : 'bg-[#0B132B] border-white/10 text-slate-300 hover:border-white/20'}`}>
                        <input type="radio" name={q.id} value={opt} checked={formData.customAnswers[q.id] === opt} onChange={() => updateCustomAnswer(q.id, opt)} className="sr-only" />
                        {opt}
                      </label>
                    ))}
                  </div>
                )}
                {errors[`q_${q.id}`] && <p className={errorClass}>{errors[`q_${q.id}`]}</p>}
              </div>
            ))}
          </div>
        );

      // Step 4: Review & Submit
      case 3:
        return (
          <div className="space-y-4">
            <p className="text-sm text-slate-400 mb-4">Periksa kembali data Anda sebelum mengirim:</p>
            <div className="rounded-xl bg-[#0B132B] border border-white/5 divide-y divide-white/5">
              <ReviewRow label="Nama Lengkap" value={formData.fullName} />
              <ReviewRow label="Email" value={formData.email} />
              <ReviewRow label="WhatsApp" value={formData.whatsapp} />
              <ReviewRow label="Domisili" value={formData.city} />
              <ReviewRow label="Pengalaman" value={formData.lastExperience} />
              <ReviewRow label="Kesiapan Bergabung" value={formData.joinAvailability} />
              {formData.expectedSalary && <ReviewRow label="Ekspektasi Gaji" value={formData.expectedSalary} />}
              <ReviewRow label="CV" value={file?.name || '-'} />
              {formData.portfolioUrl && <ReviewRow label="Portofolio" value={formData.portfolioUrl} />}
              {hasCustomQuestions && customQuestions.map((q) => (
                <ReviewRow key={q.id} label={q.question} value={formData.customAnswers[q.id] || '-'} />
              ))}
            </div>
            <ReviewRow label="Posisi" value={jobTitle} />

            {/* Honeypot */}
            <input type="text" name="website" value={formData.honeypot} onChange={(e) => updateField('honeypot', e.target.value)} className="absolute opacity-0 h-0 w-0 pointer-events-none" tabIndex={-1} autoComplete="off" aria-hidden="true" />

            {isSubmitting && (
              <div className="space-y-2">
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                </div>
                <p className="text-xs text-slate-400 text-center">Mengunggah... {uploadProgress}%</p>
              </div>
            )}

            {errors.submit && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4">
                <p className="text-sm text-red-400">{errors.submit}</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const isLastStep = step === totalSteps - 1;

  return (
    <div>
      {/* Progress Bar */}
      <div className="flex items-center gap-2 mb-8">
        {stepLabels.map((label, i) => (
          <div key={label} className="flex-1">
            <div className={`h-1.5 rounded-full transition-all duration-300 ${i <= step ? 'bg-gradient-to-r from-amber-500 to-amber-400' : 'bg-white/5'}`} />
            <p className={`text-[10px] mt-1.5 font-medium truncate ${i <= step ? 'text-amber-400' : 'text-slate-500'}`}>{label}</p>
          </div>
        ))}
      </div>

      {/* Form Content */}
      {renderStep()}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-3 mt-8 pt-6 border-t border-white/5">
        {step > 0 ? (
          <button type="button" onClick={prevStep} className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 transition-all">
            ← Kembali
          </button>
        ) : <div />}

        {isLastStep ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-7 py-3 rounded-xl bg-gradient-to-r from-[#F68A0A] to-[#E07800] text-white font-bold text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {isSubmitting ? 'Mengirim...' : '🚀 Kirim Lamaran'}
          </button>
        ) : (
          <button type="button" onClick={nextStep} className="px-7 py-3 rounded-xl bg-gradient-to-r from-[#F68A0A] to-[#E07800] text-white font-bold text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all hover:-translate-y-0.5">
            Lanjut →
          </button>
        )}
      </div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3">
      <span className="text-xs text-slate-500 shrink-0">{label}</span>
      <span className="text-sm text-white text-right break-all">{value}</span>
    </div>
  );
}
