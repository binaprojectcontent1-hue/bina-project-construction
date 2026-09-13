import { useState, useEffect } from 'react';
import { Particles } from './components/Particles';
import { BioCard } from './components/BioCard';
import { supabase } from './lib/supabase';
import type { BioLink, BioLinkSettings } from './types';

const DEFAULT_LINKS: BioLink[] = [
  {
    id: 'demo-1',
    title: 'Konsultasi Gratis via WhatsApp',
    url: 'https://wa.me/6281335335304?text=Halo%20Bina%20Project,%20saya%20ingin%20konsultasi%20proyek%20konstruksi/interior',
    icon: 'message-circle',
    is_active: true,
    sort_order: 1,
    click_count: 0,
  },
  {
    id: 'demo-2',
    title: 'Kunjungi Website Resmi Bina Project',
    url: 'https://binaproject.com',
    icon: 'globe',
    is_active: true,
    sort_order: 2,
    click_count: 0,
  },
  {
    id: 'demo-3',
    title: 'Lihat Portofolio Proyek & Desain',
    url: 'https://binaproject.com/portfolio',
    icon: 'briefcase',
    is_active: true,
    sort_order: 3,
    click_count: 0,
  },
  {
    id: 'demo-4',
    title: 'Hitung Estimasi Biaya Bangun & Renovasi',
    url: 'https://binaproject.com/kontak',
    icon: 'calculator',
    is_active: true,
    sort_order: 4,
    click_count: 0,
  },
  {
    id: 'demo-5',
    title: 'Baca Artikel & Tips Konstruksi',
    url: 'https://binaproject.com/blog',
    icon: 'book-open',
    is_active: true,
    sort_order: 5,
    click_count: 0,
  },
];

const DEFAULT_SETTINGS: BioLinkSettings = {
  id: 'demo-settings',
  profile_name: 'Bina Project',
  tagline: 'Jasa Konstruksi & Interior Terpercaya di Malang',
  avatar_url: '/logo.webp',
};

export function App() {
  const [links, setLinks] = useState<BioLink[]>(DEFAULT_LINKS);
  const [settings, setSettings] = useState<BioLinkSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      if (!supabase) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const [linksRes, settingsRes] = await Promise.all([
          supabase
            .from('biolinks')
            .select('id, title, url, icon, is_active, sort_order, click_count')
            .eq('is_active', true)
            .order('sort_order', { ascending: true }),
          supabase
            .from('biolink_settings')
            .select('*')
            .limit(1)
            .maybeSingle(),
        ]);

        if (isMounted) {
          if (linksRes.data && linksRes.data.length > 0) {
            setLinks(linksRes.data);
          }
          if (settingsRes.data) {
            let loadedSocials = settingsRes.data.social_links;
            if (!loadedSocials || !Array.isArray(loadedSocials)) {
              const localSaved = localStorage.getItem('biolink_social_links');
              if (localSaved) {
                try {
                  loadedSocials = JSON.parse(localSaved);
                } catch {
                  // ignore
                }
              }
            }
            if (Array.isArray(loadedSocials)) {
              loadedSocials = loadedSocials.filter(
                (s: any) => s.platform?.toLowerCase() !== 'youtube' && s.icon?.toLowerCase() !== 'youtube'
              );
            }
            setSettings({
              ...settingsRes.data,
              social_links: loadedSocials || undefined,
            });
          }
        }
      } catch (err) {
        console.warn('Using default fallback bio link data due to:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="bio-app-wrapper">
      {/* Background Particles WebGL */}
      <div className="particles-bg">
        <Particles
          particleCount={150}
          particleSpread={11}
          speed={0.1}
          particleColors={['#FFFFFF', '#F68A0A', '#FABC6A', '#38BDF8']}
          moveParticlesOnHover={true}
          particleHoverFactor={0.8}
          alphaParticles={true}
          particleBaseSize={75}
          sizeRandomness={1.2}
          cameraDistance={24}
        />
      </div>

      {/* Main Content Card with Scroll View */}
      <div className="content-scroll w-full flex justify-center">
        <BioCard settings={settings} links={links} loading={loading} />
      </div>
    </div>
  );
}

export default App;
