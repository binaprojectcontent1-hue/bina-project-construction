import { supabase, isSupabaseConfigured } from './supabase';
import type { Article } from '@types';

export async function getAllArticles(): Promise<Article[]> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('[BlogService] Supabase is not configured');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .or('status.eq.published,status.is.null')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[BlogService] Database fetch error:', error.message);
      return [];
    }

    return (data as Article[]) || [];
  } catch (e) {
    console.error('[BlogService] Database fetch failed:', e);
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  if (!isSupabaseConfigured || !supabase) {
    return undefined;
  }

  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .or('status.eq.published,status.is.null')
      .single();

    if (!error && data) {
      return data as Article;
    }
  } catch (e) {
    console.error(`[BlogService] Failed to fetch article ${slug} from DB:`, e);
  }

  return undefined;
}


