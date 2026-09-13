import { supabase, isSupabaseConfigured } from './supabase';
import type { Lead } from '@types';

export interface SubmitLeadResponse {
  success: boolean;
  message?: string;
  leadId?: string;
}

/**
 * Saves inbound consultation leads to Supabase database.
 * Uses a strict timeout race (800ms) to ensure user redirection to WhatsApp
 * is never blocked or noticeably delayed by network latency.
 */
export async function submitLead(leadData: Omit<Lead, 'id' | 'created_at'>): Promise<SubmitLeadResponse> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('[leadsService] Supabase not configured, bypassing database write.');
    return { success: false, message: 'Database unconfigured' };
  }

  const timeoutPromise = new Promise<SubmitLeadResponse>((_, reject) =>
    setTimeout(() => reject(new Error('Supabase lead write timed out')), 800)
  );

  const insertPromise = (async (): Promise<SubmitLeadResponse> => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert([
          {
            name: leadData.name.trim(),
            email: leadData.email ? leadData.email.trim().toLowerCase() : null,
            phone: leadData.phone.trim(),
            service: leadData.service || 'Konsultasi Umum',
            message: leadData.message ? leadData.message.trim() : null,
            source_url: leadData.source_url || (typeof window !== 'undefined' ? window.location.href : null),
            status: 'new',
          },
        ])
        .select('id')
        .single();

      if (error) {
        console.error('[leadsService] Error inserting lead into Supabase:', error.message);
        return { success: false, message: error.message };
      }

      return { success: true, leadId: data?.id };
    } catch (err: any) {
      console.error('[leadsService] Unexpected error inserting lead:', err);
      return { success: false, message: err?.message || 'Unknown error' };
    }
  })();

  try {
    return await Promise.race([insertPromise, timeoutPromise]);
  } catch (timeoutOrError: any) {
    console.warn('[leadsService] Supabase insertion resolved with fallback:', timeoutOrError?.message || timeoutOrError);
    return { success: false, message: 'Fallback timeout' };
  }
}
