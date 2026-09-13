import type { APIRoute } from 'astro';
import { getAllArticles } from '@lib/blogService';
import { generateOgImage } from '@lib/ogGenerator';
import type { Article } from '@types';

export const prerender = true;

export async function getStaticPaths() {
  const articles = await getAllArticles();
  return articles.map((article) => ({
    params: { slug: article.slug },
    props: { article },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const article = props.article as Article;

  if (!article) {
    return new Response('Not Found', { status: 404 });
  }

  const pngBuffer = await generateOgImage({
    title: article.title,
    category: article.category,
    metaInfo: `${article.reading_time || 3} Menit Baca`,
    coverImageUrl: article.cover_image,
    type: 'blog',
  });

  return new Response(new Uint8Array(pngBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
