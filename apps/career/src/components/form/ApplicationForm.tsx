import React, { useState, useRef, useEffect } from 'react';

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
  formLayout?: 'multi_step' | 'single_page';
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

export function ApplicationForm({
  jobId,
  jobTitle,
  jobSlug,
  customQuestions = [],
  formLayout = 'multi_step',
}: ApplicationFormProps) {
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
  const [applicationRef, setApplicationRef] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Restore draft from sessionStorage if available (prevents mobile data wipeout on app switch)
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(`bp_draft_${jobSlug}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({ ...prev, ...parsed, honeypot: '' }));
      }
    } catch {}
  }, [jobSlug]);

  // Persist draft changes
  useEffect(() => {
    try {
      const { honeypot, ...toSave } = formData;
      sessionStorage.setItem(`bp_draft_${jobSlug}`, JSON.stringify(toSave));
    } catch {}
  }, [formData, jobSlug]);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const updateCustomAnswer = (qId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      customAnswers: { ...prev.customAnswers, [qId]: value },
    }));
    if (errors[`q_${qId}`]) setErrors((prev) => { const n = { ...prev }; delete n[`q_${qId}`]; return n; });
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
      else if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) newErrors.file = 'Hanya format dokumen PDF yang diterima';
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

  const validateAll = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Nama lengkap wajib diisi';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Format email tidak valid';
    if (!formData.whatsapp.trim() || !/^(\+62|62|08)\d{8,13}$/.test(formData.whatsapp.replace(/[\s-]/g, ''))) newErrors.whatsapp = 'Nomor WhatsApp tidak valid (contoh: 08123456789)';
    if (!formData.city.trim()) newErrors.city = 'Kota domisili wajib diisi';
    if (!formData.lastExperience.trim()) newErrors.lastExperience = 'Pengalaman terakhir atau riwayat pendidikan wajib diisi';
    if (!file) newErrors.file = 'Upload berkas CV wajib (PDF, maks 10MB)';
    else if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) newErrors.file = 'Hanya format dokumen PDF yang diterima';
    else if (file.size > 10 * 1024 * 1024) newErrors.file = 'Ukuran berkas melebihi batas 10MB';

    if (hasCustomQuestions) {
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
    if (validateStep(step)) {
      setStep((s) => Math.min(s + 1, totalSteps - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Immediate file validation on selection & drop
  const handleFileSelection = (selectedFile: File | null) => {
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setErrors((prev) => ({ ...prev, file: 'Format berkas tidak sesuai. Hanya dokumen PDF yang diperbolehkan.' }));
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, file: 'Ukuran berkas melebihi batas 10MB. Silakan kompresi dokumen CV Anda.' }));
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setFile(selectedFile);
    setErrors((prev) => {
      const n = { ...prev };
      delete n.file;
      return n;
    });
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileSelection(droppedFile);
  };

  const handleSubmit = async () => {
    // Jalankan validasi menyeluruh pada saat submit untuk menjamin integritas data
    const isValid = validateAll();
    if (!isValid) {
      if (formLayout === 'multi_step') {
        // Navigasikan user ke step yang memiliki error pertama agar tidak terjebak
        if (!formData.fullName.trim() || !formData.email.trim() || !formData.whatsapp.trim() || !formData.city.trim()) {
          setStep(0);
        } else if (!formData.lastExperience.trim() || !file) {
          setStep(1);
        } else if (hasCustomQuestions) {
          setStep(2);
        }
      }
      // Defer scroll to allow React to mount error messages to the DOM
      setTimeout(() => {
        const firstError = document.querySelector('.text-red-600');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 60);
      return;
    }
    if (formData.honeypot) return; // Anti-spam silent drop

    setIsSubmitting(true);
    setUploadProgress(10);

    try {
      const payload = new FormData();
      if (jobId) {
        payload.append('jobId', jobId);
        payload.append('job_posting_id', jobId);
      }
      payload.append('jobTitle', jobTitle);
      payload.append('job_title', jobTitle);
      payload.append('jobSlug', jobSlug);
      payload.append('job_slug', jobSlug);
      payload.append('fullName', formData.fullName);
      payload.append('full_name', formData.fullName);
      payload.append('email', formData.email);
      payload.append('whatsapp', formData.whatsapp);
      payload.append('phone', formData.whatsapp);
      payload.append('city', formData.city);
      payload.append('lastExperience', formData.lastExperience);
      payload.append('last_experience', formData.lastExperience);
      payload.append('joinAvailability', formData.joinAvailability);
      payload.append('join_availability', formData.joinAvailability);
      if (formData.expectedSalary) {
        payload.append('expectedSalary', formData.expectedSalary);
        payload.append('expected_salary', formData.expectedSalary);
      }
      if (formData.portfolioUrl) {
        payload.append('portfolioUrl', formData.portfolioUrl);
        payload.append('portfolio_url', formData.portfolioUrl);
      }
      if (hasCustomQuestions) {
        const answersStr = JSON.stringify(formData.customAnswers);
        payload.append('customAnswers', answersStr);
        payload.append('custom_answers', answersStr);
      }
      payload.append('honeypot', formData.honeypot);
      if (file) payload.append('resume', file);

      const progressInterval = setInterval(() => {
        setUploadProgress((p) => Math.min(p + 15, 85));
      }, 250);

      const res = await fetch('/api/apply', { method: 'POST', body: payload });
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (res.ok) {
        const refCode = `BP-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
        setApplicationRef(refCode);
        setSubmitStatus('success');
        try {
          sessionStorage.removeItem(`bp_draft_${jobSlug}`);
        } catch {}
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const data = await res.json().catch(() => ({}));
        setErrors({ submit: data.error || 'Gagal mengirim berkas lamaran. Silakan periksa kelengkapan form dan coba lagi.' });
        setSubmitStatus('error');
      }
    } catch (err) {
      setErrors({ submit: 'Terjadi kendala koneksi internet saat mengirim berkas. Silakan coba kembali.' });
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success State (GForm Style confirmation card)
  if (submitStatus === 'success') {
    const HRD_WA_NUMBER = '6281333388700'; // Official People & Culture Bina Project
    const waText = encodeURIComponent(
      `Halo HRD Bina Project, saya telah melengkapi formulir lamaran online untuk posisi *${jobTitle}* (No. Ref: ${applicationRef}). Nama saya: *${formData.fullName}*. Terima kasih.`
    );
    const waUrl = `https://wa.me/${HRD_WA_NUMBER}?text=${waText}`;

    return (
      <div className="bg-white rounded-2xl p-8 sm:p-10 border border-slate-200/80 shadow-[0_4px_24px_rgba(13,25,43,0.06)] text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0] flex items-center justify-center mx-auto shadow-xs">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div>
          <p className="text-xs font-technical font-bold uppercase tracking-widest text-emerald-700 mb-2">
            Tanggapan Anda Telah Direkam
          </p>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-[#17202A] tracking-tight">
            Lamaran Berhasil Terkirim!
          </h2>
          <p className="text-sm sm:text-base font-body text-slate-600 max-w-lg mx-auto mt-2 leading-relaxed">
            Terima kasih, <strong className="text-slate-900">{formData.fullName}</strong>. Berkas Anda untuk posisi <strong className="text-[#22416D]">{jobTitle}</strong> telah aman tersimpan di sistem rekrutmen Bina Project.
          </p>
        </div>

        {/* Reference & SLA Details */}
        <div className="bg-[#F8FAFC] rounded-xl p-5 border border-slate-200/80 max-w-md mx-auto text-left space-y-2 text-xs font-body">
          <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
            <span className="text-slate-500 font-technical">Nomor Referensi Pelamar:</span>
            <span className="font-mono font-bold text-[#22416D]">{applicationRef}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
            <span className="text-slate-500 font-technical">Posisi:</span>
            <span className="font-semibold text-slate-800">{jobTitle}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-500 font-technical">Estimasi Review HR:</span>
            <span className="font-semibold text-emerald-700">3 – 5 Hari Kerja</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] text-white font-heading font-bold text-xs hover:bg-[#1EBE5D] shadow-sm transition-all"
          >
            <span>Konfirmasi Cepat via WhatsApp</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>

          <a
            href={`/loker/${jobSlug}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-heading font-semibold text-xs hover:bg-slate-200 transition-colors"
          >
            <span>Lihat Rincian Lowongan</span>
          </a>

          <a
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 font-heading font-semibold text-xs hover:bg-slate-50 transition-colors"
          >
            <span>Beranda Karir</span>
          </a>
        </div>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-3 rounded-xl bg-white border border-[#CBD5E1] text-[#17202A] text-sm placeholder:text-[#94A3B8] focus:border-[#22416D] focus:ring-3 focus:ring-[#22416D]/12 focus:outline-none transition-all shadow-xs font-body";
  const labelClass = "block text-sm font-heading font-bold text-[#17202A] mb-1.5";
  const errorClass = "text-xs font-semibold text-red-600 mt-1.5 flex items-center gap-1";

  // Reusable Section 1: Identitas & Kontak
  const SectionIdentity = (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>
          Nama Lengkap <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          autoComplete="name"
          className={inputClass}
          placeholder="Contoh: Ahmad Rizky Pratama"
          value={formData.fullName}
          onChange={(e) => updateField('fullName', e.target.value)}
        />
        {errors.fullName && <p className={errorClass}>{errors.fullName}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            Alamat Email Aktif <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            autoComplete="email"
            inputMode="email"
            className={inputClass}
            placeholder="nama@email.com"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
          />
          {errors.email && <p className={errorClass}>{errors.email}</p>}
        </div>

        <div>
          <label className={labelClass}>
            Nomor WhatsApp Aktif <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            className={inputClass}
            placeholder="08123456789"
            value={formData.whatsapp}
            onChange={(e) => updateField('whatsapp', e.target.value)}
          />
          {errors.whatsapp && <p className={errorClass}>{errors.whatsapp}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>
          Kota Domisili Saat Ini <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          autoComplete="address-level2"
          className={inputClass}
          placeholder="Contoh: Malang, Jawa Timur"
          value={formData.city}
          onChange={(e) => updateField('city', e.target.value)}
        />
        {errors.city && <p className={errorClass}>{errors.city}</p>}
      </div>
    </div>
  );

  // Reusable Section 2: Pengalaman & Berkas CV
  const SectionExperience = (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>
          Pengalaman Terakhir / Riwayat Pendidikan <span className="text-red-500">*</span>
        </label>
        <textarea
          className={`${inputClass} min-h-[90px] resize-none`}
          placeholder="Contoh: Drafter Arsitektur di PT. Cipta Karya (2 Tahun) / Lulusan S1 Arsitektur UB 2024"
          value={formData.lastExperience}
          onChange={(e) => updateField('lastExperience', e.target.value)}
        />
        {errors.lastExperience && <p className={errorClass}>{errors.lastExperience}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Kesiapan Bergabung</label>
          <select
            className={inputClass}
            value={formData.joinAvailability}
            onChange={(e) => updateField('joinAvailability', e.target.value)}
          >
            <option value="Segera">Segera (Available Now)</option>
            <option value="1-2 Minggu">1–2 Minggu</option>
            <option value="1 Bulan">1 Bulan (1 Month Notice)</option>
            <option value="Fleksibel">Fleksibel</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>
            Ekspektasi Gaji <span className="text-slate-400 font-normal text-xs">(opsional)</span>
          </label>
          <input
            type="text"
            className={inputClass}
            placeholder="Contoh: Rp 4.500.000 / Nego"
            value={formData.expectedSalary}
            onChange={(e) => updateField('expectedSalary', e.target.value)}
          />
        </div>
      </div>

      {/* CV PDF File Upload with Drag & Drop */}
      <div>
        <label className={labelClass}>
          Upload Berkas CV / Resume Terbaru <span className="text-red-500">*</span>
        </label>
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
              if (f) handleFileSelection(f);
            }}
          />
          {file ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#22416D] border border-blue-200/80 flex items-center justify-center font-technical font-bold text-xs shrink-0">
                PDF
              </div>
              <div className="text-left min-w-0">
                <p className="text-sm font-heading font-bold text-[#17202A] truncate max-w-[220px]">{file.name}</p>
                <p className="text-xs font-technical text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB &bull; Siap diunggah</p>
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
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#22416D] flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-sm font-heading font-semibold text-[#17202A]">Tarik file CV ke sini, atau klik untuk memilih file</p>
              <p className="text-xs font-technical text-slate-500 mt-1">Hanya format PDF, ukuran maksimal 10MB</p>
            </>
          )}
        </div>
        {errors.file && <p className={errorClass}>{errors.file}</p>}
      </div>

      <div>
        <label className={labelClass}>
          Tautan Portofolio / LinkedIn / Google Drive <span className="text-slate-400 font-normal text-xs">(opsional)</span>
        </label>
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

  // Reusable Section 3: Custom Questions
  const SectionCustomQuestions = hasCustomQuestions ? (
    <div className="space-y-4">
      <p className="text-xs font-body text-slate-500 mb-2">Jawab pertanyaan kualifikasi khusus dari tim rekrutmen:</p>
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
          {errors[`q_${q.id}`] && <p className={errorClass}>{errors[`q_${q.id}`]}</p>}
        </div>
      ))}
    </div>
  ) : null;

  // Single-Page Scroll Layout (Google Forms card-stack look)
  if (formLayout === 'single_page') {
    return (
      <div className="space-y-6">
        {/* Card 1: Data Diri */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_2px_12px_rgba(13,25,43,0.04)]">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
            <span className="w-7 h-7 rounded-lg bg-[#EFF6FF] text-[#22416D] font-technical font-bold text-xs flex items-center justify-center">1</span>
            <h3 className="text-base font-heading font-extrabold text-[#17202A]">Data Diri &amp; Kontak</h3>
          </div>
          {SectionIdentity}
        </div>

        {/* Card 2: Pengalaman & Berkas CV */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_2px_12px_rgba(13,25,43,0.04)]">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
            <span className="w-7 h-7 rounded-lg bg-[#EFF6FF] text-[#22416D] font-technical font-bold text-xs flex items-center justify-center">2</span>
            <h3 className="text-base font-heading font-extrabold text-[#17202A]">Pengalaman Kerja &amp; Berkas CV</h3>
          </div>
          {SectionExperience}
        </div>

        {/* Card 3: Kuesioner Khusus (if any) */}
        {hasCustomQuestions && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_2px_12px_rgba(13,25,43,0.04)]">
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
              <span className="w-7 h-7 rounded-lg bg-[#EFF6FF] text-[#22416D] font-technical font-bold text-xs flex items-center justify-center">3</span>
              <h3 className="text-base font-heading font-extrabold text-[#17202A]">Pertanyaan Kualifikasi Khusus</h3>
            </div>
            {SectionCustomQuestions}
          </div>
        )}

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

        {/* Submit Actions Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_2px_12px_rgba(13,25,43,0.04)]">
          {isSubmitting && (
            <div className="space-y-2 mb-4">
              <div className="h-1.5 rounded-sm bg-[#E2E8F0] overflow-hidden">
                <div className="h-full rounded-sm bg-[#22416D] transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
              </div>
              <p className="text-xs font-technical text-slate-500 text-center">Mengunggah berkas CV &amp; data pelamar... {uploadProgress}%</p>
            </div>
          )}

          {errors.submit && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4 mb-4">
              <p className="text-xs font-medium text-red-700">{errors.submit}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs font-body text-slate-500">
              Dengan mengklik tombol kirim, Anda menyetujui data Anda diproses untuk keperluan seleksi kerja Bina Project.
            </p>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-auto th-btn px-8 py-3.5 gap-2 text-sm shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Mengirim Lamaran...' : 'Kirim Berkas Lamaran'}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Multi-step Wizard Layout
  const renderStep = () => {
    const actualStep = !hasCustomQuestions && step >= 2 ? 3 : step;

    switch (actualStep) {
      case 0:
        return SectionIdentity;
      case 1:
        return SectionExperience;
      case 2:
        return SectionCustomQuestions;
      case 3:
        return (
          <div className="space-y-4">
            <p className="text-xs font-body text-slate-500 mb-3">Mohon periksa kembali kelengkapan data sebelum mengirimkan lamaran:</p>
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

            {/* Privacy and Trust Consent Note */}
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 text-xs font-body text-slate-600">
              <svg className="w-4 h-4 text-[#22416D] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <p className="leading-relaxed">
                Dengan mengklik tombol kirim, Anda menyetujui seluruh data dan berkas lamaran diproses oleh tim People &amp; Culture Bina Project sesuai kebijakan privasi kerja internal.
              </p>
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
                <div className="h-1.5 rounded-sm bg-[#E2E8F0] overflow-hidden">
                  <div className="h-full rounded-sm bg-[#22416D] transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                </div>
                <p className="text-xs font-technical text-slate-500 text-center">Mengirim berkas lamaran... {uploadProgress}%</p>
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
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_2px_12px_rgba(13,25,43,0.04)]">
      {/* Step Indicator Header */}
      <div className="flex items-center gap-2 mb-8">
        {stepLabels.map((label, i) => (
          <div key={label} className="flex-1">
            <div className={`h-1.5 rounded-sm transition-all duration-300 ${i <= step ? 'bg-[#22416D]' : 'bg-[#E2E8F0]'}`} />
            <p className={`text-[11px] mt-1.5 font-technical truncate ${i <= step ? 'text-[#22416D] font-bold' : 'text-slate-400'}`}>
              {i + 1}. {label}
            </p>
          </div>
        ))}
      </div>

      {/* Step Form Fields */}
      {renderStep()}

      {/* Buttons Row */}
      <div className="flex items-center justify-between gap-3 mt-8 pt-5 border-t border-slate-100">
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
            <span>Langkah Berikutnya</span>
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
    <div className="flex items-start justify-between gap-4 px-4 py-3">
      <span className="text-xs font-technical text-slate-500 shrink-0">{label}</span>
      <span className={`text-xs font-body font-semibold text-right break-all ${highlight ? 'text-[#22416D]' : 'text-slate-800'}`}>
        {value}
      </span>
    </div>
  );
}
