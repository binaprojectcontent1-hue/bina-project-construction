import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Trash2,
  GripVertical,
  ExternalLink,
  Eye,
  EyeOff,
  Save,
  BarChart3,
  Link2,
  Edit2,
  Check,
  X,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  ArrowUpRight,
  CheckCircle2,
  Globe,
  MessageCircle,
  Briefcase,
  BookOpen,
  Calculator,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Smartphone,
  Sparkles,
  Share2,
  Building2,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { useToast } from '../components/ui/Toast';
import { IconPickerModal, resolveLucideIcon } from '../components/IconPickerModal';

export interface BioLink {
  id: string;
  title: string;
  url: string;
  icon: string;
  is_active: boolean;
  sort_order: number;
  click_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface BioSocialLink {
  platform: string;
  url: string;
  icon: string;
  is_active: boolean;
}

export interface BioSettings {
  id: string;
  profile_name: string;
  tagline: string;
  avatar_url: string | null;
  social_links?: BioSocialLink[];
  updated_at?: string;
}

const DEFAULT_SOCIALS: BioSocialLink[] = [
  { platform: 'WhatsApp', url: 'https://wa.me/6281335335304', icon: 'whatsapp', is_active: true },
  { platform: 'Instagram', url: 'https://www.instagram.com/binaproject.id', icon: 'instagram', is_active: true },
  { platform: 'TikTok', url: 'https://www.tiktok.com/@binaproject.id', icon: 'tiktok', is_active: true },
  { platform: 'Google Maps & Review', url: 'https://share.google/bF9i03JuwxrcOQo7y', icon: 'google', is_active: true },
];

function SocialPreviewIcon({ name, className }: { name: string; className?: string }) {
  const icons: Record<string, React.ReactElement> = {
    instagram: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    tiktok: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
    whatsapp: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    google: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
      </svg>
    ),
  };
  return icons[name.toLowerCase()] || <Globe className={className} />;
}

const PRESET_ICONS = [
  { id: 'message-circle', label: 'WhatsApp', icon: MessageCircle },
  { id: 'globe', label: 'Website', icon: Globe },
  { id: 'briefcase', label: 'Portofolio', icon: Briefcase },
  { id: 'calculator', label: 'Estimator', icon: Calculator },
  { id: 'book-open', label: 'Artikel/Blog', icon: BookOpen },
  { id: 'phone', label: 'Telepon', icon: Phone },
  { id: 'mail', label: 'Email', icon: Mail },
  { id: 'map-pin', label: 'Lokasi/Maps', icon: MapPin },
  { id: 'calendar', label: 'Konsultasi', icon: Calendar },
  { id: 'sparkles', label: 'Promo/Spesial', icon: Sparkles },
];

const getPreviewIcon = (iconName: string) => {
  return resolveLucideIcon(iconName);
};

export const BioLinkEditor: React.FC = () => {
  const toast = useToast();
  const [links, setLinks] = useState<BioLink[]>([]);
  const [settings, setSettings] = useState<BioSettings | null>(null);
  const [socials, setSocials] = useState<BioSocialLink[]>(DEFAULT_SOCIALS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingSocials, setSavingSocials] = useState(false);

  // Socials add form state
  const [showAddSocial, setShowAddSocial] = useState(false);
  const [newSocialPlatform, setNewSocialPlatform] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');
  const [newSocialIcon, setNewSocialIcon] = useState('whatsapp');

  // Add new link state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newIcon, setNewIcon] = useState('globe');

  // Inline edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [editIcon, setEditIcon] = useState('globe');

  // Icon Picker Modal state (1,800+ Lucide Icons)
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<'new' | 'edit'>('new');

  // Settings form state
  const [editProfileName, setEditProfileName] = useState('Bina Project');
  const [editTagline, setEditTagline] = useState('Jasa Konstruksi & Interior Terpercaya di Malang');

  // Drag state
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (!supabase) return;
      const [linksRes, settingsRes] = await Promise.all([
        supabase.from('biolinks').select('*').order('sort_order', { ascending: true }),
        supabase.from('biolink_settings').select('*').limit(1).maybeSingle(),
      ]);

      if (linksRes.data) {
        setLinks(linksRes.data);
      }
      if (settingsRes.data) {
        setSettings(settingsRes.data);
        setEditProfileName(settingsRes.data.profile_name || 'Bina Project');
        setEditTagline(settingsRes.data.tagline || '');
        
        let loadedSocials = settingsRes.data.social_links;
        if (!loadedSocials || !Array.isArray(loadedSocials)) {
          const saved = localStorage.getItem('biolink_social_links');
          if (saved) {
            try {
              loadedSocials = JSON.parse(saved);
            } catch {}
          }
        }
        if (Array.isArray(loadedSocials)) {
          // Strictly exclude youtube
          const clean = loadedSocials.filter(
            (s: BioSocialLink) => s.platform?.toLowerCase() !== 'youtube' && s.icon?.toLowerCase() !== 'youtube'
          );
          setSocials(clean.length > 0 ? clean : DEFAULT_SOCIALS);
        } else {
          setSocials(DEFAULT_SOCIALS);
        }
      }
    } catch (err) {
      console.error('Failed to fetch biolinks:', err);
      toast.error('Gagal Memuat Data', 'Tidak dapat mengambil data bio link dari database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddLink = async () => {
    if (!newTitle.trim() || !newUrl.trim() || !supabase) {
      toast.error('Validasi Gagal', 'Judul dan URL tautan wajib diisi.');
      return;
    }
    setSaving(true);
    try {
      const maxOrder = links.reduce((max, l) => Math.max(max, l.sort_order), 0);
      const { error } = await supabase.from('biolinks').insert([
        {
          title: newTitle.trim(),
          url: newUrl.trim(),
          icon: newIcon.trim() || 'globe',
          sort_order: maxOrder + 1,
          is_active: true,
        },
      ]);
      if (error) throw error;

      toast.success('Berhasil Ditambahkan', 'Tautan baru berhasil disimpan.');
      setNewTitle('');
      setNewUrl('');
      setNewIcon('globe');
      setShowAddForm(false);
      await fetchData();
    } catch (err) {
      console.error('Failed to add link:', err);
      toast.error('Gagal Menyimpan', 'Terjadi kesalahan saat menambahkan tautan.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLink = async (id: string, title: string) => {
    if (!supabase) return;
    if (!window.confirm(`Hapus link "${title}"? Tindakan ini tidak dapat dibatalkan.`)) return;

    try {
      const { error } = await supabase.from('biolinks').delete().eq('id', id);
      if (error) throw error;

      toast.success('Berhasil Dihapus', 'Tautan telah dihapus dari daftar.');
      await fetchData();
    } catch (err) {
      console.error('Failed to delete link:', err);
      toast.error('Gagal Menghapus', 'Terjadi kesalahan saat menghapus tautan.');
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    if (!supabase) return;
    try {
      const nextActive = !currentActive;
      setLinks((prev) =>
        prev.map((l) => (l.id === id ? { ...l, is_active: nextActive } : l))
      );
      const { error } = await supabase
        .from('biolinks')
        .update({ is_active: nextActive, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      toast.info('Status Diperbarui', `Tautan sekarang ${nextActive ? 'Aktif' : 'Nonaktif'}.`);
    } catch (err) {
      console.error('Failed to toggle link:', err);
      toast.error('Gagal Memperbarui', 'Gagal mengubah status tautan.');
      await fetchData();
    }
  };

  const handleStartEdit = (link: BioLink) => {
    setEditingId(link.id);
    setEditTitle(link.title);
    setEditUrl(link.url);
    setEditIcon(link.icon || 'globe');
  };

  const handleSaveEdit = async () => {
    if (!supabase || !editingId || !editTitle.trim() || !editUrl.trim()) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('biolinks')
        .update({
          title: editTitle.trim(),
          url: editUrl.trim(),
          icon: editIcon.trim() || 'globe',
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingId);

      if (error) throw error;

      toast.success('Berhasil Disimpan', 'Perubahan tautan berhasil diperbarui.');
      setEditingId(null);
      await fetchData();
    } catch (err) {
      console.error('Failed to update link:', err);
      toast.error('Gagal Memperbarui', 'Gagal menyimpan perubahan tautan.');
    } finally {
      setSaving(false);
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    if (!supabase) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= links.length) return;

    const updated = [...links];
    const itemA = updated[index];
    const itemB = updated[targetIndex];

    updated[index] = { ...itemB, sort_order: index + 1 };
    updated[targetIndex] = { ...itemA, sort_order: targetIndex + 1 };

    setLinks(updated);

    try {
      await Promise.all([
        supabase
          .from('biolinks')
          .update({ sort_order: updated[index].sort_order })
          .eq('id', updated[index].id),
        supabase
          .from('biolinks')
          .update({ sort_order: updated[targetIndex].sort_order })
          .eq('id', updated[targetIndex].id),
      ]);
      toast.info('Urutan Diperbarui', 'Posisi tautan berhasil dipindahkan.');
    } catch (err) {
      console.error('Failed to move order:', err);
      await fetchData();
    }
  };

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = async () => {
    if (dragItem.current === null || dragOverItem.current === null || !supabase) return;
    if (dragItem.current === dragOverItem.current) {
      dragItem.current = null;
      dragOverItem.current = null;
      return;
    }

    const reordered = [...links];
    const [draggedItem] = reordered.splice(dragItem.current, 1);
    reordered.splice(dragOverItem.current, 0, draggedItem);

    const updated = reordered.map((link, i) => ({ ...link, sort_order: i + 1 }));
    setLinks(updated);

    dragItem.current = null;
    dragOverItem.current = null;

    try {
      await Promise.all(
        updated.map((l) =>
          supabase!.from('biolinks').update({ sort_order: l.sort_order }).eq('id', l.id)
        )
      );
      toast.success('Urutan Disimpan', 'Susunan tautan berhasil disimpan.');
    } catch (err) {
      console.error('Failed to save reordered links:', err);
      await fetchData();
    }
  };

  const handleToggleSocial = (index: number) => {
    setSocials((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], is_active: !updated[index].is_active };
      return updated;
    });
  };

  const handleUpdateSocialUrl = (index: number, url: string) => {
    setSocials((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], url };
      return updated;
    });
  };

  const handleDeleteSocial = (index: number) => {
    setSocials((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddSocial = () => {
    if (!newSocialPlatform.trim() || !newSocialUrl.trim()) {
      toast.error('Validasi Gagal', 'Nama platform dan URL media sosial wajib diisi.');
      return;
    }
    setSocials((prev) => [
      ...prev,
      {
        platform: newSocialPlatform.trim(),
        url: newSocialUrl.trim(),
        icon: newSocialIcon.trim().toLowerCase(),
        is_active: true,
      },
    ]);
    setNewSocialPlatform('');
    setNewSocialUrl('');
    setShowAddSocial(false);
    toast.success('Akun Ditambahkan', 'Akun media sosial baru ditambahkan ke daftar.');
  };

  const handleSaveSocials = async () => {
    setSavingSocials(true);
    try {
      localStorage.setItem('biolink_social_links', JSON.stringify(socials));
      if (supabase && settings?.id) {
        try {
          await supabase
            .from('biolink_settings')
            .update({
              social_links: socials,
              updated_at: new Date().toISOString(),
            })
            .eq('id', settings.id);
        } catch (dbErr) {
          console.warn('Supabase update social_links column notice:', dbErr);
        }
      }
      toast.success('Media Sosial Disimpan', 'Pengaturan akun media sosial berhasil disimpan.');
    } catch (err) {
      console.error('Failed to save socials:', err);
      toast.error('Gagal Menyimpan', 'Terjadi kesalahan saat menyimpan akun media sosial.');
    } finally {
      setSavingSocials(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!supabase) return;
    setSaving(true);
    try {
      localStorage.setItem('biolink_social_links', JSON.stringify(socials));
      if (settings?.id) {
        try {
          const { error } = await supabase
            .from('biolink_settings')
            .update({
              profile_name: editProfileName.trim(),
              tagline: editTagline.trim(),
              social_links: socials,
              updated_at: new Date().toISOString(),
            })
            .eq('id', settings.id);
          if (error) {
            await supabase
              .from('biolink_settings')
              .update({
                profile_name: editProfileName.trim(),
                tagline: editTagline.trim(),
                updated_at: new Date().toISOString(),
              })
              .eq('id', settings.id);
          }
        } catch {
          await supabase
            .from('biolink_settings')
            .update({
              profile_name: editProfileName.trim(),
              tagline: editTagline.trim(),
              updated_at: new Date().toISOString(),
            })
            .eq('id', settings.id);
        }
      } else {
        const { error } = await supabase.from('biolink_settings').insert([
          {
            profile_name: editProfileName.trim(),
            tagline: editTagline.trim(),
          },
        ]);
        if (error) throw error;
      }

      toast.success('Profil Disimpan', 'Pengaturan profil bio link berhasil diperbarui.');
      await fetchData();
    } catch (err) {
      console.error('Failed to save settings:', err);
      toast.error('Gagal Menyimpan', 'Terjadi kesalahan saat menyimpan pengaturan profil.');
    } finally {
      setSaving(false);
    }
  };

  const totalClicks = links.reduce((sum, l) => sum + (l.click_count || 0), 0);
  const activeCount = links.filter((l) => l.is_active).length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <RefreshCw className="w-6 h-6 text-[#1B365D] animate-spin" />
        <span className="text-xs font-medium text-slate-500">Memuat data Bio Link...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
              Bio Link Manager
            </h1>
            <Badge variant="outline" className="text-xs font-semibold bg-slate-50 text-[#1B365D] border-slate-200 rounded-md px-2">
              bio.binaproject.id
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kelola daftar tautan resmi, profil brand, dan pantau statistik klik pengunjung.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            title="Muat Ulang Data"
            className="flex items-center gap-1.5 px-3 h-8 text-xs font-medium rounded-lg"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Segarkan</span>
          </Button>

          <a
            href="https://bio.binaproject.id"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 h-8 rounded-lg px-3.5 text-xs font-semibold bg-[#1B365D] text-white hover:bg-[#132845] transition-colors shadow-xs cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Buka bio.binaproject.id</span>
          </a>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-3.5 bg-white border border-slate-200/80 rounded-xl shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
            <Link2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Tautan</p>
            <p className="text-xl font-semibold text-slate-900 mt-0.5 font-mono tabular-nums">{links.length}</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3.5 bg-white border border-slate-200/80 rounded-xl shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tautan Aktif</p>
            <p className="text-xl font-semibold text-emerald-600 mt-0.5 font-mono tabular-nums">{activeCount}</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3.5 bg-white border border-slate-200/80 rounded-xl shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-[#F68A0A] flex items-center justify-center shrink-0">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Klik</p>
            <p className="text-xl font-semibold text-[#F68A0A] mt-0.5 font-mono tabular-nums">{totalClicks}</p>
          </div>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Management Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Profile & Branding Settings */}
          <Card className="border border-slate-200 bg-white rounded-xl shadow-xs overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#1B365D]" />
                Pengaturan Profil & Identitas Brand
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Nama dan deskripsi yang tampil di bagian atas halaman bio link.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-3.5 space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Nama Profil / Brand</label>
                <Input
                  value={editProfileName}
                  onChange={(e) => setEditProfileName(e.target.value)}
                  placeholder="Contoh: Bina Project"
                  className="rounded-lg h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">Tagline / Deskripsi Singkat</label>
                  <span className="text-[10px] text-slate-400 font-medium">Bisa ditekan Enter untuk baris baru</span>
                </div>
                <textarea
                  value={editTagline}
                  onChange={(e) => setEditTagline(e.target.value)}
                  placeholder="Contoh:&#10;Jasa Konstruksi & Interior Terpercaya&#10;Melayani Area Malang & Sekitarnya"
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B365D]/20 focus:border-[#1B365D] transition-all resize-y leading-relaxed font-sans shadow-2xs"
                />
              </div>

              <div className="flex justify-end pt-1">
                <Button
                  onClick={handleSaveSettings}
                  disabled={saving}
                  size="sm"
                  className="bg-[#1B365D] hover:bg-[#132845] text-white flex items-center gap-1.5 font-semibold px-4 rounded-lg h-8 text-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Menyimpan...' : 'Simpan Profil'}</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Links Management Panel */}
          <Card className="border border-slate-200 bg-white rounded-xl shadow-xs overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-[#1B365D]" />
                  Daftar Tombol Tautan
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-0.5">
                  Geser kartu atau gunakan tombol panah untuk mengatur susunan urutan.
                </CardDescription>
              </div>

              {!showAddForm && (
                <Button
                  onClick={() => setShowAddForm(true)}
                  size="sm"
                  className="bg-[#1B365D] hover:bg-[#132845] text-white flex items-center gap-1.5 font-semibold shadow-xs px-3.5 rounded-lg h-8 text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Link</span>
                </Button>
              )}
            </CardHeader>

            <CardContent className="pt-3.5 space-y-3.5">
              {/* Form Tambah Link Baru */}
              {showAddForm && (
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5 text-[#1B365D]" />
                      Tambah Tautan Baru
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Judul Tombol</label>
                      <Input
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Contoh: Konsultasi Gratis via WhatsApp"
                        className="bg-white rounded-lg h-8.5 text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Tujuan URL</label>
                      <Input
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        placeholder="Contoh: https://wa.me/6281335335304"
                        className="bg-white rounded-lg h-8.5 text-xs"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-slate-700">Pilih Ikon</label>
                        <button
                          type="button"
                          onClick={() => {
                            setPickerTarget('new');
                            setPickerOpen(true);
                          }}
                          className="text-xs font-semibold text-[#1B365D] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>Buka 1.800+ Ikon Lucide →</span>
                        </button>
                      </div>

                      {/* Selected Icon Trigger Display */}
                      <div className="flex items-center gap-2 mb-2 p-2 rounded-lg bg-white border border-slate-200">
                        <div className="w-7 h-7 rounded-md bg-[#1B365D] text-white flex items-center justify-center shrink-0">
                          {React.createElement(resolveLucideIcon(newIcon), { className: 'w-3.5 h-3.5' })}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-slate-900 truncate">Ikon Terpilih: {newIcon}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setPickerTarget('new');
                            setPickerOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                        >
                          Cari Ikon
                        </button>
                      </div>

                      {/* Quick Presets */}
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                        {PRESET_ICONS.map((p) => {
                          const IconCmp = p.icon;
                          const isSelected = newIcon === p.id;
                          return (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => setNewIcon(p.id)}
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-all text-left cursor-pointer ${
                                isSelected
                                  ? 'bg-[#1B365D] text-white border-[#1B365D] shadow-2xs'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              <IconCmp className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{p.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/80">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowAddForm(false);
                          setNewTitle('');
                          setNewUrl('');
                        }}
                        className="px-3 rounded-lg h-8 text-xs font-medium"
                      >
                        Batal
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleAddLink}
                        disabled={saving || !newTitle.trim() || !newUrl.trim()}
                        className="bg-[#1B365D] hover:bg-[#132845] text-white font-semibold px-3.5 rounded-lg h-8 text-xs"
                      >
                        {saving ? 'Menyimpan...' : 'Simpan Tautan'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* List of Links */}
              <div className="space-y-2">
                {links.map((link, index) => {
                  const isEditing = editingId === link.id;

                  return (
                    <div
                      key={link.id}
                      draggable={!isEditing}
                      onDragStart={() => handleDragStart(index)}
                      onDragEnter={() => handleDragEnter(index)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => e.preventDefault()}
                      className={`group flex items-center gap-2.5 p-3 rounded-lg border transition-all ${
                        isEditing
                          ? 'bg-slate-50 border-[#1B365D] shadow-2xs'
                          : link.is_active
                          ? 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                          : 'bg-slate-50/80 border-dashed border-slate-200 opacity-60'
                      }`}
                    >
                      {/* Drag Handle */}
                      <div className="text-slate-300 group-hover:text-slate-500 cursor-grab active:cursor-grabbing shrink-0">
                        <GripVertical className="w-4 h-4" />
                      </div>

                      {/* Order buttons */}
                      <div className="flex flex-col gap-0.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleMoveOrder(index, 'up')}
                          disabled={index === 0}
                          className="p-0.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:pointer-events-none"
                          title="Pindah ke atas"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveOrder(index, 'down')}
                          disabled={index === links.length - 1}
                          className="p-0.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:pointer-events-none"
                          title="Pindah ke bawah"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Content / Inline Edit Form */}
                      {isEditing ? (
                        <div className="flex-1 space-y-2 py-0.5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Judul</label>
                              <Input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="bg-white rounded-lg h-8 text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-semibold text-slate-600 block mb-1">URL</label>
                              <Input
                                value={editUrl}
                                onChange={(e) => setEditUrl(e.target.value)}
                                className="bg-white rounded-lg h-8 text-xs"
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-xs font-semibold text-slate-700">Pilih Ikon</label>
                              <button
                                type="button"
                                onClick={() => {
                                  setPickerTarget('edit');
                                  setPickerOpen(true);
                                }}
                                className="text-xs font-semibold text-[#1B365D] hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                <span>Katalog 1.800+ Ikon →</span>
                              </button>
                            </div>

                            {/* Active Icon Display */}
                            <div className="flex items-center gap-2 mb-1.5 p-1.5 rounded-lg bg-white border border-slate-200">
                              <div className="w-6 h-6 rounded-md bg-[#1B365D] text-white flex items-center justify-center shrink-0">
                                {React.createElement(resolveLucideIcon(editIcon), { className: 'w-3 h-3' })}
                              </div>
                              <span className="text-xs font-semibold text-slate-800 flex-1 truncate">
                                {editIcon}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setPickerTarget('edit');
                                  setPickerOpen(true);
                                }}
                                className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                              >
                                Ganti
                              </button>
                            </div>

                            {/* Quick Presets */}
                            <div className="flex flex-wrap gap-1">
                              {PRESET_ICONS.map((p) => {
                                const IconCmp = p.icon;
                                const isSelected = editIcon === p.id;
                                return (
                                  <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => setEditIcon(p.id)}
                                    className={`px-2.5 py-0.5 rounded-md text-xs font-medium border flex items-center gap-1 cursor-pointer ${
                                      isSelected
                                        ? 'bg-[#1B365D] text-white border-[#1B365D]'
                                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                                    }`}
                                  >
                                    <IconCmp className="w-3 h-3" />
                                    <span>{p.label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="flex justify-end gap-1.5 pt-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingId(null)}
                              className="h-7 px-2.5 text-xs font-medium rounded-md"
                            >
                              <X className="w-3 h-3 mr-1" /> Batal
                            </Button>
                            <Button
                              size="sm"
                              onClick={handleSaveEdit}
                              disabled={saving || !editTitle.trim() || !editUrl.trim()}
                              className="h-7 px-3 text-xs bg-[#1B365D] text-white font-semibold rounded-md"
                            >
                              <Check className="w-3 h-3 mr-1" /> Simpan
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-900 text-xs truncate">
                                {link.title}
                              </span>
                              {!link.is_active && (
                                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">
                                  Nonaktif
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 truncate mt-0.5">{link.url}</p>
                          </div>

                          {/* Stats Badge */}
                          <div className="shrink-0 text-right">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-semibold bg-amber-50 text-[#F68A0A] border border-amber-200/60">
                              {link.click_count || 0} klik
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-0.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleToggleActive(link.id, link.is_active)}
                              title={link.is_active ? 'Nonaktifkan tautan' : 'Aktifkan tautan'}
                              className={`p-1.5 rounded-md transition-colors ${
                                link.is_active
                                  ? 'text-emerald-600 hover:bg-emerald-50'
                                  : 'text-slate-400 hover:bg-slate-100'
                              }`}
                            >
                              {link.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleStartEdit(link)}
                              title="Edit Tautan"
                              className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteLink(link.id, link.title)}
                              title="Hapus Tautan"
                              className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}

                {links.length === 0 && !showAddForm && (
                  <div className="text-center py-10 px-4 rounded-lg border-2 border-dashed border-slate-200">
                    <Link2 className="w-7 h-7 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-700">Belum ada tautan bio</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 mb-3">
                      Tambahkan tautan WhatsApp, Website, atau Portofolio untuk bio profil Anda.
                    </p>
                    <Button
                      size="sm"
                      onClick={() => setShowAddForm(true)}
                      className="bg-[#1B365D] text-white font-semibold px-3.5 rounded-lg h-8 text-xs"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Tambah Tautan Pertama
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Social Media Links Card */}
          <Card className="border border-slate-200 bg-white rounded-xl shadow-xs overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-[#1B365D]" />
                  Pengaturan Akun Media Sosial
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-0.5">
                  Ikon media sosial yang tampil di bagian bawah halaman bio link.
                </CardDescription>
              </div>

              {!showAddSocial && (
                <Button
                  onClick={() => setShowAddSocial(true)}
                  size="sm"
                  variant="outline"
                  className="text-xs flex items-center gap-1 font-medium px-3 rounded-lg h-8"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Akun</span>
                </Button>
              )}
            </CardHeader>

            <CardContent className="pt-3.5 space-y-3.5">
              {/* Form Tambah Social Baru */}
              {showAddSocial && (
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
                      Tambah Akun Media Sosial
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAddSocial(false)}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Nama Platform</label>
                      <Input
                        value={newSocialPlatform}
                        onChange={(e) => setNewSocialPlatform(e.target.value)}
                        placeholder="Contoh: WhatsApp, Instagram"
                        className="bg-white rounded-lg h-8.5 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Pilih Ikon</label>
                      <select
                        value={newSocialIcon}
                        onChange={(e) => setNewSocialIcon(e.target.value)}
                        className="w-full h-8.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1B365D]/20"
                      >
                        <option value="whatsapp">WhatsApp</option>
                        <option value="instagram">Instagram</option>
                        <option value="tiktok">TikTok</option>
                        <option value="google">Google Maps & Review</option>
                        <option value="globe">Website / Umum</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">URL Profil / Kontak</label>
                    <Input
                      value={newSocialUrl}
                      onChange={(e) => setNewSocialUrl(e.target.value)}
                      placeholder="https://wa.me/6281335335304"
                      className="bg-white rounded-lg h-8.5 text-xs"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAddSocial(false)}
                      className="px-3 rounded-lg h-8 text-xs font-medium"
                    >
                      Batal
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleAddSocial}
                      className="px-3.5 rounded-lg h-8 text-xs bg-[#1B365D] text-white font-semibold"
                    >
                      Tambahkan
                    </Button>
                  </div>
                </div>
              )}

              {/* Daftar Akun Social Media */}
              <div className="space-y-2">
                {socials.map((s, idx) => (
                  <div
                    key={s.platform + idx}
                    className={`flex items-center gap-2.5 p-3 rounded-lg border transition-all ${
                      s.is_active
                        ? 'bg-white border-slate-200 shadow-2xs'
                        : 'bg-slate-50/70 border-dashed border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-md bg-[#1B365D] flex items-center justify-center text-white shrink-0 shadow-2xs">
                      <SocialPreviewIcon name={s.icon} className="w-3.5 h-3.5 text-white fill-white" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-900">{s.platform}</span>
                        {!s.is_active && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">
                            Nonaktif
                          </span>
                        )}
                      </div>
                      <Input
                        value={s.url}
                        onChange={(e) => handleUpdateSocialUrl(idx, e.target.value)}
                        placeholder="https://..."
                        className="bg-slate-50 h-7 text-xs rounded-md"
                      />
                    </div>

                    <div className="flex items-center gap-0.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleSocial(idx)}
                        title={s.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                        className={`p-1.5 rounded-md transition-colors ${
                          s.is_active ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-100'
                        }`}
                      >
                        {s.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteSocial(idx)}
                        title="Hapus"
                        className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-100">
                <Button
                  onClick={handleSaveSocials}
                  disabled={savingSocials}
                  size="sm"
                  className="bg-[#1B365D] hover:bg-[#132845] text-white flex items-center gap-1.5 font-semibold px-4 rounded-lg h-8 text-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingSocials ? 'Menyimpan...' : 'Simpan Media Sosial'}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Live Mobile Mockup Preview */}
        <div className="lg:col-span-5 sticky top-6">
          <Card className="border border-slate-200 bg-white overflow-hidden shadow-xs rounded-xl">
            <CardHeader className="pb-2.5 border-b border-slate-100 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#1B365D]" />
                <CardTitle className="text-xs font-semibold text-slate-900">Live Preview 1:1</CardTitle>
              </div>
              <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                Pratinjau Mobile
              </span>
            </CardHeader>

            <CardContent className="p-4 bg-slate-100 flex justify-center">
              {/* Phone Frame Mockup */}
              <div
                className="w-[320px] sm:w-[330px] rounded-[36px] border-[6px] border-slate-800 shadow-xl p-4 flex flex-col items-center min-h-[620px] text-white relative overflow-hidden select-none"
                style={{
                  background: 'radial-gradient(circle at 50% 15%, #1B365D 0%, #11223B 45%, #0B1729 100%)',
                }}
              >
                {/* Speaker Notch */}
                <div className="w-20 h-3.5 bg-slate-900/90 rounded-full mb-4 z-20" />

                {/* Profile Brand Logo */}
                <div className="relative z-10 w-[72px] h-[52px] mb-2.5 flex items-center justify-center">
                  <img
                    src="/logo.webp"
                    alt="Logo"
                    className="w-[72px] h-[52px] object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/img/favicons/favicon.ico';
                    }}
                  />
                </div>

                {/* Profile Title & Tagline */}
                <div className="text-center z-10 mb-4 px-3 w-full">
                  <h3 className="font-semibold text-sm tracking-tight text-white flex items-center justify-center gap-1.5">
                    <span>{editProfileName || 'Bina Project'}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-white fill-white/20 shrink-0" />
                  </h3>
                  <p className="text-[11px] text-white/75 mt-1 whitespace-pre-line leading-relaxed font-normal">
                    {editTagline || 'Jasa Konstruksi & Interior Terpercaya di Malang'}
                  </p>
                </div>

                {/* 1:1 Glass Pill Buttons List */}
                <div className="w-full space-y-2 z-10 flex-1 overflow-y-auto pr-0.5 scrollbar-none">
                  {links
                    .filter((l) => l.is_active)
                    .map((link) => {
                      let IconCmp = getPreviewIcon(link.icon);
                      if (link.url?.includes('maps') && (!link.icon || link.icon === 'globe')) {
                        IconCmp = MapPin;
                      }
                      const cleanTitle = (link.title || '').replace(/WebsiteBina/g, 'Website Bina');

                      return (
                        <div key={link.id} className="relative w-full group select-none">
                          <div
                            className="relative z-10 w-full min-h-[46px] flex items-center justify-center px-4 py-2.5 rounded-full cursor-pointer transition-all duration-200 group-hover:-translate-y-0.5 group-hover:bg-white/15"
                            style={{
                              background: 'rgba(255, 255, 255, 0.09)',
                              backdropFilter: 'blur(16px)',
                              WebkitBackdropFilter: 'blur(16px)',
                              boxShadow:
                                'inset 0 1px 1px 0 rgba(255, 255, 255, 0.25), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.2), 0 3px 12px rgba(0, 0, 0, 0.2)',
                            }}
                          >
                            {/* Left Pinned Icon */}
                            <div className="absolute left-3.5 flex items-center justify-center pointer-events-none">
                              <IconCmp className="w-3.5 h-3.5 text-white shrink-0 group-hover:scale-105 transition-transform" />
                            </div>
                            {/* Centered Title */}
                            <span className="font-semibold text-xs text-white tracking-normal text-center px-6 truncate">
                              {cleanTitle}
                            </span>
                            {/* Right Pinned Arrow */}
                            <div className="absolute right-3.5 flex items-center justify-center pointer-events-none">
                              <ArrowUpRight className="w-3 h-3 text-white/60 shrink-0 group-hover:text-white transition-transform" />
                            </div>
                          </div>
                        </div>
                      );
                    })}

                  {links.filter((l) => l.is_active).length === 0 && (
                    <div className="text-center py-6 text-white/50 text-xs bg-white/5 rounded-xl">
                      Belum ada link aktif.
                    </div>
                  )}
                </div>

                {/* Social Media Bar */}
                <div className="flex items-center justify-center gap-2 mt-4 mb-1.5 z-10">
                  {socials
                    .filter((s) => s.is_active !== false)
                    .map((s) => (
                      <div
                        key={s.platform}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white transition-all hover:scale-105 cursor-pointer shadow-sm"
                        style={{
                          background: 'rgba(255, 255, 255, 0.09)',
                          backdropFilter: 'blur(8px)',
                          WebkitBackdropFilter: 'blur(8px)',
                        }}
                        title={s.platform}
                      >
                        <SocialPreviewIcon name={s.icon} className="w-3 h-3 text-white fill-white" />
                      </div>
                    ))}
                </div>

                {/* Phone Footer */}
                <div className="z-10 text-center text-[10px] text-white/50 pt-2 pb-0.5">
                  <p>© 2026 Bina Project</p>
                </div>

                {/* Home Indicator bar */}
                <div className="w-20 h-1 bg-slate-700 rounded-full mt-1.5 z-10" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Universal 1,800+ Lucide Icon Picker Modal */}
      <IconPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        selectedIcon={pickerTarget === 'new' ? newIcon : editIcon}
        onSelectIcon={(iconId) => {
          if (pickerTarget === 'new') {
            setNewIcon(iconId);
          } else {
            setEditIcon(iconId);
          }
        }}
      />
    </div>
  );
};

export default BioLinkEditor;
