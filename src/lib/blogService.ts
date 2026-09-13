import { supabase, isSupabaseConfigured } from './supabase';
import type { Article } from '@types';
import { ARTICLES } from '@data/articles';

export { ARTICLES };

export async function getAllArticles(): Promise<Article[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .or('status.eq.published,status.is.null')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data as Article[];
      }
    } catch (e) {
      // Log error without exposing details in production
      console.warn('[BlogService] Database fetch failed, using fallback dataset');
    }
  }

  return ARTICLES as unknown as Article[];
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!error && data) {
        return data as Article;
      }
    } catch (e) {
      // Log error without exposing details in production
      console.warn(`[BlogService] Failed to fetch article ${slug}`);
    }
  }

  return (ARTICLES as unknown as Article[]).find((a) => a.slug === slug);
}

