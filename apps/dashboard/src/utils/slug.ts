/**
 * Smart Slug Engine for Bina Project Admin
 * Generates semantic, clean, URL-safe slugs optimized for Google Indexing.
 */

import { supabase } from '../lib/supabase';

/**
 * Converts any title string into a strict, Google-friendly URL slug.
 * - Lowercase
 * - Strips Indonesian/English punctuation & special symbols
 * - Normalizes accents & diacritics
 * - Converts spaces to single hyphens
 * - Removes leading & trailing hyphens
 */
export function generateSlug(text: string): string {
  if (!text) return '';

  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[^\w\s-]/g, '') // remove special characters
    .trim()
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-') // collapse multiple dashes
    .replace(/^-+/, '') // trim starting dash
    .replace(/-+$/, ''); // trim ending dash
}

/**
 * Checks if a slug already exists in Supabase.
 * Returns true if available, false if duplicate.
 */
export async function checkSlugAvailability(
  slug: string,
  table: 'projects' | 'articles',
  currentId?: string
): Promise<boolean> {
  if (!slug || !supabase) return true;

  try {
    let query = supabase.from(table).select('id').eq('slug', slug);
    if (currentId) {
      query = query.neq('id', currentId);
    }
    const { data, error } = await query;
    if (error) {
      console.warn('Error checking slug:', error);
      return true;
    }
    return !data || data.length === 0;
  } catch (err) {
    console.error('Slug check exception:', err);
    return true;
  }
}

/**
 * Records a 301 redirect in Supabase when an admin changes a published slug.
 * This ensures Google search juice is transferred to the new URL without broken 404 links.
 */
export async function record301Redirect(
  oldSlug: string,
  newSlug: string,
  prefix: 'portfolio' | 'blog'
): Promise<{ success: boolean; message?: string }> {
  if (!oldSlug || !newSlug || oldSlug === newSlug || !supabase) {
    return { success: true };
  }

  const sourcePath = `/${prefix}/${oldSlug}`;
  const targetPath = `/${prefix}/${newSlug}`;

  try {
    const { error } = await supabase.from('redirects').upsert(
      {
        source_path: sourcePath,
        target_path: targetPath,
        status_code: 301,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'source_path' }
    );

    if (error) {
      console.error('Failed to record 301 redirect:', error);
      return { success: false, message: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Exception recording redirect:', err);
    return { success: false, message: err?.message || 'Error recording redirect' };
  }
}
