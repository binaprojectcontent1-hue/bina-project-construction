import { createClient } from '@supabase/supabase-js';

interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  RESEND_API_KEY: string;
  HRD_EMAIL: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const formData = await request.formData();

    // Extract fields
    const jobId = formData.get('jobId') as string || null;
    const jobTitle = formData.get('jobTitle') as string;
    const jobSlug = formData.get('jobSlug') as string;
    const isTalentPool = formData.get('isTalentPool') === 'true';
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const whatsapp = formData.get('whatsapp') as string;
    const city = formData.get('city') as string;
    const lastExperience = formData.get('lastExperience') as string;
    const joinAvailability = formData.get('joinAvailability') as string || 'Segera';
    const expectedSalary = formData.get('expectedSalary') as string || '';
    const portfolioUrl = formData.get('portfolioUrl') as string || '';
    const customAnswersRaw = formData.get('customAnswers') as string || '{}';
    const resume = formData.get('resume') as File | null;

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

    // Initialize Supabase with service role key (server-side)
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

    // Upload CV to private storage
    const timestamp = Date.now();
    const sanitizedName = fullName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const filePath = `${jobSlug}/${timestamp}_${sanitizedName}.pdf`;

    const fileBuffer = await resume.arrayBuffer();
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

    // Parse custom answers and evaluate knockout questions
    let customAnswers: Record<string, string> = {};
    try {
      customAnswers = JSON.parse(customAnswersRaw);
    } catch { /* ignore parse error */ }

    let screeningStatus = 'review';

    // Evaluate knockout if job has custom questions
    if (jobId) {
      const { data: jobData } = await supabase
        .from('job_postings')
        .select('custom_questions')
        .eq('id', jobId)
        .single();

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

    // Insert application record
    const { data: appData, error: insertError } = await supabase
      .from('job_applications')
      .insert({
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
        is_talent_pool: isTalentPool,
        screening_status: screeningStatus,
        pipeline_stage: 'new',
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return Response.json({ error: 'Gagal menyimpan data lamaran.' }, { status: 500 });
    }

    // Send email notification via Resend
    const hrdEmail = env.HRD_EMAIL || 'hrd@binaproject.id';
    const resendKey = env.RESEND_API_KEY;

    if (resendKey) {
      try {
        const screeningLabel = screeningStatus === 'passed' ? '✅ Lolos Screening Awal'
          : screeningStatus === 'knocked_out' ? '❌ Tidak Memenuhi Kualifikasi Kunci'
          : '🔍 Perlu Review Manual';

        const dashboardUrl = `https://dash.binaproject.id/#recruitment-candidates?id=${appData?.id || ''}`;

        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Bina Project Karir <karir@binaproject.id>',
            to: [hrdEmail],
            subject: `[Pelamar Baru] ${jobTitle} — ${fullName} (${city})`,
            html: `
              <div style="font-family: 'Inter', system-ui, sans-serif; max-width: 600px; margin: 0 auto; background: #0B132B; border-radius: 16px; overflow: hidden; border: 1px solid #1e3a5f;">
                <div style="background: linear-gradient(135deg, #F68A0A, #E07800); padding: 24px 32px;">
                  <h1 style="color: white; margin: 0; font-size: 18px;">📨 Pelamar Baru Masuk</h1>
                  <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0; font-size: 13px;">${jobTitle}</p>
                </div>
                <div style="padding: 24px 32px; color: #e2e8f0;">
                  <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                    <tr><td style="padding: 8px 0; color: #94a3b8; width: 140px;">Nama</td><td style="padding: 8px 0; font-weight: 600;">${fullName}</td></tr>
                    <tr><td style="padding: 8px 0; color: #94a3b8;">Email</td><td style="padding: 8px 0;">${email}</td></tr>
                    <tr><td style="padding: 8px 0; color: #94a3b8;">WhatsApp</td><td style="padding: 8px 0;">${whatsapp}</td></tr>
                    <tr><td style="padding: 8px 0; color: #94a3b8;">Domisili</td><td style="padding: 8px 0;">${city}</td></tr>
                    <tr><td style="padding: 8px 0; color: #94a3b8;">Pengalaman</td><td style="padding: 8px 0;">${lastExperience}</td></tr>
                    <tr><td style="padding: 8px 0; color: #94a3b8;">Status Screening</td><td style="padding: 8px 0; font-weight: 600;">${screeningLabel}</td></tr>
                  </table>
                  <div style="margin-top: 24px; text-align: center;">
                    <a href="${dashboardUrl}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #F68A0A, #E07800); color: white; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 14px;">
                      Buka di Dashboard →
                    </a>
                  </div>
                </div>
              </div>
            `,
          }),
        });
      } catch (emailError) {
        console.error('Resend email error:', emailError);
        // Don't fail the application if email fails
      }
    }

    return Response.json({ success: true, id: appData?.id }, { status: 200 });
  } catch (err) {
    console.error('Unhandled error:', err);
    return Response.json({ error: 'Terjadi kesalahan server.' }, { status: 500 });
  }
};
