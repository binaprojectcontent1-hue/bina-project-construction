import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function devCloudflareFunctionsPlugin() {
  return {
    name: 'dev-cloudflare-functions',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const urlObj = new URL(req.url || '/', 'http://localhost:4323');
        if (urlObj.pathname === '/api/apply') {
          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', '*');
            res.end();
            return;
          }

          if (req.method !== 'POST') {
            res.statusCode = 405;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Method not allowed' }));
            return;
          }

          try {
            const chunks = [];
            for await (const chunk of req) {
              chunks.push(chunk);
            }
            const bodyBuffer = Buffer.concat(chunks);

            const headers = new Headers();
            for (const [key, value] of Object.entries(req.headers)) {
              if (value !== undefined) {
                if (Array.isArray(value)) {
                  value.forEach((v) => headers.append(key, v));
                } else {
                  headers.set(key, value);
                }
              }
            }

            const webRequest = new Request(urlObj.href, {
              method: req.method,
              headers,
              body: bodyBuffer,
            });

            const envVars = loadEnv(server.config.mode || 'development', process.cwd(), '');
            const env = {
              SUPABASE_URL: envVars.PUBLIC_SUPABASE_URL || 'https://jymlsrmilckmphwhsrld.supabase.co',
              SUPABASE_SERVICE_ROLE_KEY: envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.PUBLIC_SUPABASE_ANON_KEY || '',
              SUPABASE_ANON_KEY: envVars.PUBLIC_SUPABASE_ANON_KEY || '',
              PUBLIC_SUPABASE_URL: envVars.PUBLIC_SUPABASE_URL || 'https://jymlsrmilckmphwhsrld.supabase.co',
              PUBLIC_SUPABASE_ANON_KEY: envVars.PUBLIC_SUPABASE_ANON_KEY || '',
            };

            const applyModulePath = path.resolve(__dirname, 'functions/api/apply.ts');
            const { onRequestPost } = await server.ssrLoadModule(applyModulePath);

            const webResponse = await onRequestPost({
              request: webRequest,
              env,
              params: {},
              waitUntil: () => {},
              next: async () => new Response('Not found', { status: 404 }),
              data: {},
            });

            res.statusCode = webResponse.status;
            webResponse.headers.forEach((val, key) => res.setHeader(key, val));
            const arrayBuf = await webResponse.arrayBuffer();
            res.end(Buffer.from(arrayBuf));
            return;
          } catch (err) {
            console.error('[dev-cloudflare-functions] Error in /api/apply:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Terjadi kendala server dev pada endpoint apply.' }));
            return;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig({
  site: 'https://karir.binaproject.id',
  output: 'static',
  compressHTML: true,
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
  image: {
    domains: ['binaproject.id', 'images.unsplash.com'],
  },
  vite: {
    plugins: [tailwindcss(), devCloudflareFunctionsPlugin()],
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
    build: {
      sourcemap: false,
    },
    server: {
      proxy: {
        '/media': {
          target: 'https://binaproject.id',
          changeOrigin: true,
        },
      },
    },
  },
});

