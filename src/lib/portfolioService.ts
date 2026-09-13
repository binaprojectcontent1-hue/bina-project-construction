import { supabase, isSupabaseConfigured } from './supabase';
import type { Project } from '@types';
import { INITIAL_PROJECTS } from '@data/projects';

export { INITIAL_PROJECTS };

export async function getAllProjects(): Promise<Project[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .or('status.eq.published,status.is.null')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data as Project[];
      }
    } catch (e) {
      // Log error without exposing details in production
      console.warn('[PortfolioService] Database fetch failed, using fallback dataset');
    }
  }

  return INITIAL_PROJECTS as unknown as Project[];
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const all = await getAllProjects();
  return all.filter((p) => p.featured);
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!error && data) {
        return data as Project;
      }
      return undefined;
    } catch (e) {
      // Log error without exposing details in production
      console.warn(`[PortfolioService] Failed to fetch project ${slug}`);
      return undefined;
    }
  }

  return (INITIAL_PROJECTS as unknown as Project[]).find((p) => p.slug === slug);
}

export async function getCategories(): Promise<string[]> {
  const all = await getAllProjects();
  const cats = new Set(all.map((p) => p.category));
  return Array.from(cats);
}
