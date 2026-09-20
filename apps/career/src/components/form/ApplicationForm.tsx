import React, { useState, useRef } from 'react';

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
  customQuestions?: CustomQuestion[];
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

export function ApplicationForm({ jobId, jobTitle, jobSlug, customQuestions = [], isTalentPool = false }: ApplicationFormProps) {
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
      if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Format email tidak valid';
      if (!formData.whatsapp.trim() || !/^(\+62|62|08)\d{8,13}$/.test(formData.whatsapp.replace(/[\s-]/g, ''))) newErrors.whatsapp = 'Nomor WhatsApp tidak valid (contoh: 08123456789)';
      if (!formData.city.trim()) newErrors.city = 'Kota domisili wajib diisi';
    } else if (actualStep === 1) {
      if (!formData.lastExperience.trim()) newErrors.lastExperience = 'Pengalaman terakhir atau riwayat pendidikan wajib diisi';
      if (!file) newErrors.file = 'Upload berkas CV wajib (PDF, maks 10MB)';
      else if (file.type !== 'application/pdf') newErrors.file = 'Hanya format dokumen PDF yang diterima';
      else if (file.size > 10 * 1024 * 1024) newErrors.file = 'Ukuran berkas melebihi batas 10MB';
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

  const prevStep = () => {
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setErrors((prev) => { const n = { ...prev }; delete n.file; return n; });
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;
    if (formData.honeypot) return; // Anti-spam silently block

    setIsSubmitting(true);
    setUploadProgress(10);

    try {
      const payload = new FormData();
      if (jobId) payload.append('job_posting_id', jobId);
      payload.append('job_title', jobTitle);
      payload.append('job_slug', jobSlug);
      payload.append('full_name', formData.fullName);
      payload.append('email', formData.email);
      payload.append('phone', formData.whatsapp);
      payload.append('city', formData.city);
      payload.append('last_experience', formData.lastExperience);
      payload.append('join_availability', formData.joinAvailability);
      if (formData.expectedSalary) payload.append('expected_salary', formData.expectedSalary);
      if (formData.portfolioUrl) payload.append('portfolio_url', formData.portfolioUrl);
      if (hasCustomQuestions) payload.append('custom_answers', JSON.stringify(formData.customAnswers));
      payload.append('is_talent_pool', String(isTalentPool));
      if (file) payload.append('resume', file);

      const progressInterval = setInterval(() => {
        setUploadProgress((p) => Math.min(p + 15, 85));
      }, 300);

      const res = await fetch('/api/apply', { method: 'POST', body: payload });
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (res.ok) {
        setSubmitStatus('success');
      } else {
        const data = await res.json().catch(() => ({}));
        setErrors({ submit: data.error || 'Gagal mengirim berkas lamaran. Silakan periksa kembali dan coba lagi.' });
        setSubmitStatus('error');
      }
    } catch (err) {
      setErrors({ submit: 'Terjadi kendala koneksi internet. Silakan coba beberapa saat lagi.' });
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success State
  if (submitStatus === 'success') {
    return (
      <div className="text-center py-8 sm:py-10 bg-white rounded-2xl p-6">
        <div className="w-16 h-16 rounded-full bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0] flex items-center justify-center mx-auto mb-4 shadow-xs">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-heading font-extrabold text-[#17202A] mb-2">
          Lamaran Berhasil Terkirim!
        </h3>
        <p className="text-sm font-body text-[#475569] max-w-md mx-auto mb-6 leading-relaxed">
          Terima kasih, <strong className="text-[#17202A]">{formData.fullName}</strong>. Berkas lamaran Anda untuk posisi <strong className="text-[#22416D]">{jobTitle}</strong> telah tercatat di sistem rekrutmen kami.
          Tim People & Culture kami akan meninjau dalam 3–5 hari kerja.
        </p>
        <a href="/" className="th-btn th-btn-secondary gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Kembali ke Beranda Karir</span>
        </a>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-3 rounded-xl bg-white border border-[#CBD5E1] text-[#17202A] text-sm placeholder:text-[#94A3B8] focus:border-[#22416D] focus:ring-3 focus:ring-[#22416D]/12 focus:outline-none transition-all shadow-xs font-body";
  const labelClass = "block text-sm font-heading font-bold text-[#17202A] mb-1.5";
  const errorClass = "text-xs font-semibold text-red-600 mt-1";

  const renderStep = () => {
    const actualStep = !hasCustomQuestions && step >= 2 ? 3 : step;

    switch (actualStep) {
      // Step 1: Identity & Contact
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Nama Lengkap <span className="text-red-500">*</span></label>
              <input type="text" className={inputClass} placeholder="Contoh: Ahmad Rizky" value={formData.fullName} onChange={(e) => updateField('fullName', e.target.value)} />
              {errors.fullName && <p className={errorClass}>{errors.fullName}</p>}
            </div>
            <div>
              <label className={labelClass}>Alamat Email Aktif <span className="text-red-500">*</span></label>
              <input type="email" className={inputClass} placeholder="nama@email.com" value={formData.email} onChange={(e) => updateField('email', e.target.value)} />
              {errors.email && <p className={errorClass}>{errors.email}</p>}
            </div>
            <div>
              <label className={labelClass}>Nomor WhatsApp <span className="text-red-500">*</span></label>
              <input type="tel" className={inputClass} placeholder="08123456789" value={formData.whatsapp} onChange={(e) => updateField('whatsapp', e.target.value)} />
              {errors.whatsapp && <p className={errorClass}>{errors.whatsapp}</p>}
            </div>
            <div>
              <label className={labelClass}>Kota Domisili Saat Ini <span className="text-red-500">*</span></label>
              <input type="text" className={inputClass} placeholder="Contoh: Malang, Jawa Timur" value={formData.city} onChange={(e) => updateField('city', e.target.value)} />
              {errors.city && <p className={errorClass}>{errors.city}</p>}
            </div>
          </div>
        );

      // Step 2: Experience & Documents
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Pengalaman Terakhir / Pendidikan <span className="text-red-500">*</span></label>
              <textarea
                className={`${inputClass} min-h-[85px] resize-none`}
                placeholder="Contoh: Drafter Arsitektur di PT. Cipta Graha (2 Tahun) / S1 Teknik Sipil UB"
                value={formData.lastExperience}
                onChange={(e) => updateField('lastExperience', e.target.value)}
              />
              {errors.lastExperience && <p className={errorClass}>{errors.lastExperience}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Kesiapan Bergabung</label>
                <select className={inputClass} value={formData.joinAvailability} onChange={(e) => updateField('joinAvailability', e.target.value)}>
                  <option value="Segera">Segera (Available Now)</option>
                  <option value="1-2 Minggu">1–2 Minggu</option>
                  <option value="1 Bulan">1 Bulan (1 Month Notice)</option>
                  <option value="Fleksibel">Fleksibel</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Ekspektasi Gaji <span className="text-[#64748B] font-normal text-xs">(opsional)</span></label>
                <input type="text" className={inputClass} placeholder="Contoh: Rp 4.500.000" value={formData.expectedSalary} onChange={(e) => updateField('expectedSalary', e.target.value)} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Upload Berkas CV / Resume <span className="text-red-500">*</span></label>
              <div
                className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all bg-[#F8FAFC] ${
                  isDragOver ? 'border-[#22416D] bg-[#EFF6FF]' : 'border-[#CBD5E1] hover:border-[#22416D]'
                }`}
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
                    <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#22416D] border border-[#BFDBFE] flex items-center justify-center font-technical font-bold text-xs">
                      PDF
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-heading font-bold text-[#17202A] truncate max-w-[200px]">{file.name}</p>
                      <p className="text-xs font-technical text-[#64748B]">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      className="ml-2 p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                      title="Hapus file"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <svg className="w-8 h-8 text-[#22416D] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm font-heading font-semibold text-[#17202A]">Tarik file CV ke sini, atau klik untuk memilih</p>
                    <p className="text-xs font-technical text-[#64748B] mt-1">Format PDF, ukuran maksimal 10MB</p>
                  </>
                )}
              </div>
              {errors.file && <p className={errorClass}>{errors.file}</p>}
            </div>
            <div>
              <label className={labelClass}>Tautan Portofolio / LinkedIn <span className="text-[#64748B] font-normal text-xs">(opsional)</span></label>
              <input
                type="url"
                className={inputClass}
                placeholder="https://drive.google.com/... atau behance.net/..."
                value={formData.portfolioUrl}
                onChange={(e) => updateField('portfolioUrl', e.target.value)}
              />
            </div>
          </div>
        );

      // Step 3: Custom Questions
      case 2:
        return (
          <div className="space-y-4">
            <p className="text-xs font-body text-[#475569] mb-2">Jawab pertanyaan kualifikasi dari tim rekrutmen:</p>
            {customQuestions.map((q) => (
              <div key={q.id}>
                <label className={labelClass}>
                  {q.question} {q.required && <span className="text-red-500">*</span>}
                </label>
                {q.type === 'text' && (
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="Tuliskan jawaban Anda..."
                    value={formData.customAnswers[q.id] || ''}
                    onChange={(e) => updateCustomAnswer(q.id, e.target.value)}
                  />
                )}
                {q.type === 'radio' && q.options && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {q.options.map((opt) => (
                      <label
                        key={opt}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer text-sm font-medium transition-all ${
                          formData.customAnswers[q.id] === opt
                            ? 'bg-[#EFF6FF] border-[#22416D] text-[#22416D] font-bold shadow-xs'
                            : 'bg-white border-[#CBD5E1] text-[#334155] hover:border-[#94A3B8]'
                        }`}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          value={opt}
                          checked={formData.customAnswers[q.id] === opt}
                          onChange={() => updateCustomAnswer(q.id, opt)}
                          className="sr-only"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                )}
                {q.type === 'yesno' && (
                  <div className="flex gap-2 mt-1">
                    {['Ya', 'Tidak'].map((opt) => (
                      <label
                        key={opt}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer text-sm font-medium transition-all ${
                          formData.customAnswers[q.id] === opt
                            ? 'bg-[#EFF6FF] border-[#22416D] text-[#22416D] font-bold'
                            : 'bg-white border-[#CBD5E1] text-[#334155] hover:border-[#94A3B8]'
                        }`}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          value={opt}
                          checked={formData.customAnswers[q.id] === opt}
                          onChange={() => updateCustomAnswer(q.id, opt)}
                          className="sr-only"
                        />
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
            <p className="text-xs font-body text-[#475569] mb-3">Mohon periksa kembali kelengkapan data sebelum mengirimkan lamaran:</p>
            <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] divide-y divide-[#E2E8F0]">
              <ReviewRow label="Posisi Lamaran" value={jobTitle} highlight />
              <ReviewRow label="Nama Lengkap" value={formData.fullName} />
              <ReviewRow label="Email" value={formData.email} />
              <ReviewRow label="Nomor WhatsApp" value={formData.whatsapp} />
              <ReviewRow label="Domisili" value={formData.city} />
              <ReviewRow label="Pengalaman / Kuliah" value={formData.lastExperience} />
              <ReviewRow label="Kesiapan Bergabung" value={formData.joinAvailability} />
              {formData.expectedSalary && <ReviewRow label="Ekspektasi Gaji" value={formData.expectedSalary} />}
              <ReviewRow label="Berkas CV" value={file?.name || '-'} />
              {formData.portfolioUrl && <ReviewRow label="Tautan Portofolio" value={formData.portfolioUrl} />}
            </div>

            {/* Anti-spam Honeypot */}
            <input
              type="text"
              name="website"
              value={formData.honeypot}
              onChange={(e) => updateField('honeypot', e.target.value)}
              className="absolute opacity-0 h-0 w-0 pointer-events-none"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            {isSubmitting && (
              <div className="space-y-2 pt-2">
                <div className="h-2 rounded-full bg-[#E2E8F0] overflow-hidden">
                  <div className="h-full rounded-full bg-[#22416D] transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                </div>
                <p className="text-xs font-technical text-[#64748B] text-center">Mengirim berkas lamaran... {uploadProgress}%</p>
              </div>
            )}

            {errors.submit && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                <p className="text-xs font-medium text-red-700">{errors.submit}</p>
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
      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-6">
        {stepLabels.map((label, i) => (
          <div key={label} className="flex-1">
            <div className={`h-1.5 rounded-full transition-all duration-300 ${i <= step ? 'bg-[#22416D]' : 'bg-[#E2E8F0]'}`} />
            <p className={`text-[10px] mt-1 font-technical truncate ${i <= step ? 'text-[#22416D] font-bold' : 'text-[#94A3B8]'}`}>
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Step Form Fields */}
      {renderStep()}

      {/* Buttons Row */}
      <div className="flex items-center justify-between gap-3 mt-8 pt-5 border-t border-[#E2E8F0]">
        {step > 0 ? (
          <button
            type="button"
            onClick={prevStep}
            disabled={isSubmitting}
            className="th-btn th-btn-secondary th-btn-sm"
          >
            &larr; Kembali
          </button>
        ) : <div />}

        {isLastStep ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="th-btn th-btn-sm gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Mengirim Lamaran...' : 'Kirim Berkas Lamaran'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            onClick={nextStep}
            className="th-btn th-btn-sm gap-2"
          >
            <span>Selanjutnya</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

function ReviewRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-2.5">
      <span className="text-xs font-technical text-[#64748B] shrink-0">{label}</span>
      <span className={`text-xs font-body font-semibold text-right break-all ${highlight ? 'text-[#22416D]' : 'text-[#17202A]'}`}>
        {value}
      </span>
    </div>
  );
}
