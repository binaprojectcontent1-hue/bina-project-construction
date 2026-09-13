import { supabase, isSupabaseConfigured } from './supabase';
import type { Project } from '@types';

export async function getAllProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('[PortfolioService] Supabase is not configured');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .or('status.eq.published,status.is.null')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[PortfolioService] Database fetch error:', error.message);
      return [];
    }

    return (data as Project[]) || [];
  } catch (e) {
    console.error('[PortfolioService] Database fetch failed:', e);
    return [];
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const all = await getAllProjects();
  return all.filter((p) => p.featured);
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  if (!isSupabaseConfigured || !supabase) {
    return undefined;
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .or('status.eq.published,status.is.null')
      .single();

    if (!error && data) {
      return data as Project;
    }
  } catch (e) {
    console.error(`[PortfolioService] Failed to fetch project ${slug} from DB:`, e);
  }

  return undefined;
}

export async function getCategories(): Promise<string[]> {
  const all = await getAllProjects();
  const cats = new Set(all.map((p) => p.category).filter(Boolean));
  return Array.from(cats);
}

