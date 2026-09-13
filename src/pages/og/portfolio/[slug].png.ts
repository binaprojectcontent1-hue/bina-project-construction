import type { APIRoute } from 'astro';
import { getAllProjects } from '@lib/portfolioService';
import { generateOgImage } from '@lib/ogGenerator';
import type { Project } from '@types';

export const prerender = true;

export async function getStaticPaths() {
  const projects = await getAllProjects();
  return projects.map((project) => ({
    params: { slug: project.slug },
    props: { project },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const project = props.project as Project;

  if (!project) {
    return new Response('Not Found', { status: 404 });
  }

  const pngBuffer = await generateOgImage({
    title: project.title,
    category: project.category,
    metaInfo: project.location || 'Yogyakarta',
    coverImageUrl: project.cover_image,
    type: 'portfolio',
  });

  return new Response(new Uint8Array(pngBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
