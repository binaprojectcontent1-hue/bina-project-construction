import { createClient } from '@supabase/supabase-js';

interface Env {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  SUPABASE_ANON_KEY?: string;
  PUBLIC_SUPABASE_URL?: string;
  PUBLIC_SUPABASE_ANON_KEY?: string;
}

interface PagesFunctionContext<TEnv = unknown> {
  request: Request;
  env: TEnv;
  params: Record<string, string | string[]>;
  waitUntil: (promise: Promise<unknown>) => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  data: Record<string, unknown>;
}

type PagesFunction<TEnv = unknown> = (context: PagesFunctionContext<TEnv>) => Promise<Response> | Response;

function getSupabaseClient(env: Partial<Env>) {
  const supabaseUrl = env.SUPABASE_URL || env.PUBLIC_SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL || 'https://jymlsrmilckmphwhsrld.supabase.co';
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY || env.PUBLIC_SUPABASE_ANON_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY || '';
  return createClient(supabaseUrl, supabaseKey);
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  let uploadedFilePath: string | null = null;

  try {
    const formData = await request.formData();

    // Extract fields with bidirectional fallback (camelCase & snake_case)
    const jobId = (formData.get('jobId') || formData.get('job_posting_id') || formData.get('job_id')) as string || null;
    const jobTitle = (formData.get('jobTitle') || formData.get('job_title')) as string || '';
    const jobSlug = (formData.get('jobSlug') || formData.get('job_slug')) as string || (jobId ? `job-${jobId}` : 'general');
    const fullName = (formData.get('fullName') || formData.get('full_name')) as string || '';
    const email = (formData.get('email')) as string || '';
    
    // Normalisasi WhatsApp ke format internasional bersih (contoh: 628123456789)
    const rawWhatsapp = (formData.get('whatsapp') || formData.get('phone')) as string || '';
    let cleanPhone = rawWhatsapp.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    } else if (cleanPhone.startsWith('8')) {
      cleanPhone = '62' + cleanPhone;
    }
    const whatsapp = cleanPhone;

    const city = (formData.get('city')) as string || '';
    const lastExperience = (formData.get('lastExperience') || formData.get('last_experience')) as string || '';
    const joinAvailability = (formData.get('joinAvailability') || formData.get('join_availability')) as string || 'Segera';
    const expectedSalary = (formData.get('expectedSalary') || formData.get('expected_salary')) as string || '';
    const portfolioUrl = (formData.get('portfolioUrl') || formData.get('portfolio_url')) as string || '';
    const customAnswersRaw = (formData.get('customAnswers') || formData.get('custom_answers')) as string || '{}';
    const resume = formData.get('resume') as File | null;
    const honeypot = (formData.get('honeypot') || formData.get('bot_field')) as string || '';

    // Bot trap silent reject: Jika honeypot terisi, kembalikan respons sukses palsu tanpa simpan ke DB
    if (honeypot.trim().length > 0) {
      return Response.json({ success: true, id: 'mock-bot-id' }, { status: 200 });
    }

    // Validation
    if (!fullName || !email || !whatsapp || !city || !lastExperience) {
      return Response.json({ error: 'Data tidak lengkap. Pastikan semua field wajib terisi.' }, { status: 400 });
    }

    if (!resume || resume.type !== 'application/pdf') {
      return Response.json({ error: 'CV wajib berupa file PDF.' }, { status: 400 });
    }

    if (resume.size > 10 * 1024 * 1024) {
      return Response.json({ error: 'Ukuran file CV maksimal 10MB.' }, { status: 400 });
    }

    // Validasi tipe biner Magic Bytes PDF (%PDF-) untuk mencegah MIME-type spoofing
    const fileBuffer = await resume.arrayBuffer();
    const headerBytes = new Uint8Array(fileBuffer.slice(0, 4));
    const isPdfMagic =
      headerBytes[0] === 0x25 && // %
      headerBytes[1] === 0x50 && // P
      headerBytes[2] === 0x44 && // D
      headerBytes[3] === 0x46;   // F

    if (!isPdfMagic) {
      return Response.json({ error: 'Integritas berkas tidak valid. Berkas harus berupa dokumen PDF asli.' }, { status: 400 });
    }

    // Initialize Supabase with service role key if available, or anon key fallback
    const supabase = getSupabaseClient(env);

    // Verifikasi status lowongan & deadline aktif di database
    let customAnswers: Record<string, string> = {};
    try {
      customAnswers = JSON.parse(customAnswersRaw);
    } catch { /* ignore parse error */ }

    let screeningStatus = 'review';

    if (jobId) {
      const { data: jobData } = await supabase
        .from('job_postings')
        .select('status, application_deadline, custom_questions')
        .eq('id', jobId)
        .single();

      if (!jobData || jobData.status === 'closed') {
        return Response.json({ error: 'Penerimaan lamaran untuk posisi ini telah resmi ditutup.' }, { status: 400 });
      }

      if (jobData.application_deadline && new Date(jobData.application_deadline).getTime() < Date.now()) {
        return Response.json({ error: 'Batas waktu pendaftaran untuk posisi ini telah berakhir.' }, { status: 400 });
      }

      if (jobData?.custom_questions) {
        const questions = jobData.custom_questions as Array<{
          id: string;
          knockout_value?: string;
          required?: boolean;
        }>;

        const knockedOut = questions.some((q) => {
          if (q.knockout_value && customAnswers[q.id]) {
            return customAnswers[q.id] === q.knockout_value;
          }
          return false;
        });

        screeningStatus = knockedOut ? 'knocked_out' : 'passed';
      }
    }

    // Upload CV to private storage
    const timestamp = Date.now();
    const sanitizedName = fullName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const filePath = `${jobSlug}/${timestamp}_${sanitizedName}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from('job-applications')
      .upload(filePath, fileBuffer, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return Response.json({ error: 'Gagal mengunggah file CV.' }, { status: 500 });
    }
    uploadedFilePath = filePath;

    // Generate application ID upfront to avoid RLS SELECT restrictions when anon key is used
    const applicationId = crypto.randomUUID();

    // Insert application record
    const { error: insertError } = await supabase
      .from('job_applications')
      .insert({
        id: applicationId,
        job_id: jobId || null,
        job_title: jobTitle,
        full_name: fullName,
        email,
        whatsapp,
        city,
        last_experience: lastExperience,
        join_availability: joinAvailability,
        expected_salary: expectedSalary,
        resume_path: filePath,
        portfolio_url: portfolioUrl,
        custom_answers: customAnswers,
        is_talent_pool: false,
        screening_status: screeningStatus,
        pipeline_stage: 'new',
      });

    if (insertError) {
      console.error('Insert error:', insertError);
      // Rollback: Hapus file yang terlanjur diunggah agar tidak menjadi berkas yatim piatu
      try {
        await supabase.storage.from('job-applications').remove([filePath]);
      } catch (cleanupErr) {
        console.error('Failed to cleanup file on insert error:', cleanupErr);
      }
      return Response.json({ error: 'Gagal menyimpan data lamaran.' }, { status: 500 });
    }

    return Response.json({ success: true, id: applicationId }, { status: 200 });
  } catch (err) {
    console.error('Unhandled error:', err);
    if (uploadedFilePath) {
      try {
        const supabase = getSupabaseClient(env);
        await supabase.storage.from('job-applications').remove([uploadedFilePath]);
      } catch (cleanupErr) {
        console.error('Failed to cleanup orphaned file:', cleanupErr);
      }
    }
    return Response.json({ error: 'Terjadi kesalahan server.' }, { status: 500 });
  }
};
