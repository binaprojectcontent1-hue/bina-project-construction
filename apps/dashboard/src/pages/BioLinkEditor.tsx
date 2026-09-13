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
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { useToast } from '../components/ui/Toast';

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

export interface BioSettings {
  id: string;
  profile_name: string;
  tagline: string;
  avatar_url: string | null;
  updated_at?: string;
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

export const BioLinkEditor: React.FC = () => {
  const toast = useToast();
  const [links, setLinks] = useState<BioLink[]>([]);
  const [settings, setSettings] = useState<BioSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  const handleSaveSettings = async () => {
    if (!supabase) return;
    setSaving(true);
    try {
      if (settings?.id) {
        const { error } = await supabase
          .from('biolink_settings')
          .update({
            profile_name: editProfileName.trim(),
            tagline: editTagline.trim(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', settings.id);
        if (error) throw error;
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
        <RefreshCw className="w-8 h-8 text-[#22416D] animate-spin" />
        <span className="text-sm font-semibold text-slate-500">Memuat data Bio Link...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Bio Link Manager
            </h1>
            <Badge variant="outline" className="text-xs font-semibold bg-blue-50 text-[#22416D] border-blue-200">
              bio.binaproject.com
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Kelola daftar tautan resmi, profil brand, dan pantau statistik klik pengunjung.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            title="Muat Ulang Data"
            className="flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4 text-slate-500" />
            <span>Segarkan</span>
          </Button>

          <a
            href="https://bio.binaproject.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 h-9 rounded-md px-3 text-xs font-semibold bg-[#22416D] text-white hover:bg-[#1A3356] transition-colors shadow-xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Buka bio.binaproject.com</span>
          </a>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 flex items-center gap-4 bg-white border-slate-200">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <Link2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Tautan</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{links.length}</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4 bg-white border-slate-200">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tautan Aktif</p>
            <p className="text-2xl font-black text-emerald-600 mt-0.5">{activeCount}</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4 bg-white border-slate-200">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#F68A0A] flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Klik</p>
            <p className="text-2xl font-black text-[#F68A0A] mt-0.5">{totalClicks}</p>
          </div>
        </Card>
      </div>

      {/* Main Grid: Management Panel (Left) & Mobile Mockup Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Management Controls (8 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Profile & Branding Settings */}
          <Card className="border-slate-200 bg-white">
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F68A0A]" />
                Pengaturan Profil & Identitas Brand
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Nama dan deskripsi yang tampil di bagian atas halaman bio link.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Nama Profil / Brand</label>
                <Input
                  value={editProfileName}
                  onChange={(e) => setEditProfileName(e.target.value)}
                  placeholder="Contoh: Bina Project"
                  className="h-10"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Tagline / Deskripsi Singkat</label>
                  <span className="text-[10px] text-slate-400 font-medium">Bisa ditekan Enter untuk baris baru</span>
                </div>
                <textarea
                  value={editTagline}
                  onChange={(e) => setEditTagline(e.target.value)}
                  placeholder="Contoh:&#10;Jasa Konstruksi & Interior Terpercaya&#10;Melayani Area Malang & Sekitarnya"
                  rows={3}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#22416D] focus:border-[#22416D] transition-colors resize-y leading-relaxed font-sans"
                />
              </div>

              <div className="flex justify-end pt-1">
                <Button
                  onClick={handleSaveSettings}
                  disabled={saving}
                  size="sm"
                  className="bg-[#22416D] hover:bg-[#1A3356] text-white flex items-center gap-1.5 font-bold"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Menyimpan...' : 'Simpan Profil'}</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Links Management Card */}
          <Card className="border-slate-200 bg-white">
            <CardHeader className="pb-4 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-[#22416D]" />
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
                  className="bg-[#22416D] hover:bg-[#1A3356] text-white flex items-center gap-1.5 font-bold shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Link</span>
                </Button>
              )}
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              {/* Form Tambah Link Baru */}
              {showAddForm && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3.5 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5 text-[#22416D]" />
                      Tambah Tautan Baru
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Judul Tombol</label>
                      <Input
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Contoh: Konsultasi Gratis via WhatsApp"
                        className="h-9 bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Tujuan URL</label>
                      <Input
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        placeholder="Contoh: https://wa.me/6281335335304"
                        className="h-9 bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Pilih Ikon</label>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                        {PRESET_ICONS.map((p) => {
                          const IconCmp = p.icon;
                          const isSelected = newIcon === p.id;
                          return (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => setNewIcon(p.id)}
                              className={`flex items-center gap-1.5 p-2 rounded-lg text-xs font-semibold border transition-all text-left ${
                                isSelected
                                  ? 'bg-[#22416D] text-white border-[#22416D] shadow-xs'
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
                      >
                        Batal
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleAddLink}
                        disabled={saving || !newTitle.trim() || !newUrl.trim()}
                        className="bg-[#22416D] hover:bg-[#1A3356] text-white font-bold"
                      >
                        {saving ? 'Menyimpan...' : 'Simpan Tautan'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* List of Links */}
              <div className="space-y-2.5">
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
                      className={`group flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                        isEditing
                          ? 'bg-blue-50/50 border-[#22416D] shadow-xs'
                          : link.is_active
                          ? 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
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
                        <div className="flex-1 space-y-2.5 py-1">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">Judul</label>
                              <Input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="h-8 text-xs bg-white"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">URL</label>
                              <Input
                                value={editUrl}
                                onChange={(e) => setEditUrl(e.target.value)}
                                className="h-8 text-xs bg-white"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">Pilih Ikon</label>
                            <div className="flex flex-wrap gap-1">
                              {PRESET_ICONS.map((p) => {
                                const IconCmp = p.icon;
                                const isSelected = editIcon === p.id;
                                return (
                                  <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => setEditIcon(p.id)}
                                    className={`px-2 py-1 rounded-md text-[11px] font-medium border flex items-center gap-1 ${
                                      isSelected
                                        ? 'bg-[#22416D] text-white border-[#22416D]'
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
                              className="h-7 px-2 text-xs"
                            >
                              <X className="w-3 h-3 mr-1" /> Batal
                            </Button>
                            <Button
                              size="sm"
                              onClick={handleSaveEdit}
                              disabled={saving || !editTitle.trim() || !editUrl.trim()}
                              className="h-7 px-2.5 text-xs bg-[#22416D] text-white"
                            >
                              <Check className="w-3 h-3 mr-1" /> Simpan
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm truncate">
                                {link.title}
                              </span>
                              {!link.is_active && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">
                                  Nonaktif
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 truncate mt-0.5">{link.url}</p>
                          </div>

                          {/* Stats Badge */}
                          <div className="shrink-0 text-right">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-50 text-[#F68A0A] border border-amber-200/60">
                              {link.click_count || 0} klik
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleToggleActive(link.id, link.is_active)}
                              title={link.is_active ? 'Nonaktifkan tautan' : 'Aktifkan tautan'}
                              className={`p-1.5 rounded-lg transition-colors ${
                                link.is_active
                                  ? 'text-emerald-600 hover:bg-emerald-50'
                                  : 'text-slate-400 hover:bg-slate-100'
                              }`}
                            >
                              {link.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleStartEdit(link)}
                              title="Edit Tautan"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteLink(link.id, link.title)}
                              title="Hapus Tautan"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}

                {links.length === 0 && !showAddForm && (
                  <div className="text-center py-12 px-4 rounded-xl border-2 border-dashed border-slate-200">
                    <Link2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-700">Belum ada tautan bio</p>
                    <p className="text-xs text-slate-400 mt-1 mb-4">
                      Tambahkan tautan WhatsApp, Website, atau Portofolio untuk bio profil Anda.
                    </p>
                    <Button
                      size="sm"
                      onClick={() => setShowAddForm(true)}
                      className="bg-[#22416D] text-white font-bold"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Tambah Tautan Pertama
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Live Mobile Mockup Preview (5 cols) */}
        <div className="lg:col-span-5 sticky top-6">
          <Card className="border-slate-200 bg-white overflow-hidden shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#22416D]" />
                <CardTitle className="text-sm font-bold text-slate-900">Live Mobile Preview</CardTitle>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Interaktif
              </span>
            </CardHeader>

            <CardContent className="p-4 bg-slate-100 flex justify-center">
              {/* Phone Frame Mockup */}
              <div className="w-[320px] rounded-[36px] bg-[#070F1E] border-[7px] border-slate-800 shadow-2xl p-4 flex flex-col items-center min-h-[560px] text-white relative overflow-hidden select-none">
                {/* Ambient Top Glow */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#152B49] rounded-full blur-2xl pointer-events-none opacity-60" />

                {/* Speaker Notch */}
                <div className="w-24 h-4 bg-slate-800 rounded-full mb-6 z-10" />

                {/* Profile Logo */}
                <div className="relative z-10 w-16 h-16 rounded-full border-2 border-[#F68A0A] p-1 bg-[#0E1E38] shadow-lg mb-3 flex items-center justify-center">
                  <img
                    src="https://binaproject.com/favicon.png"
                    alt="Logo"
                    className="w-12 h-12 object-contain rounded-full"
                  />
                </div>

                {/* Profile Title & Tagline */}
                <div className="text-center z-10 mb-5 px-2">
                  <h3 className="font-extrabold text-sm tracking-tight text-white flex items-center justify-center gap-1">
                    <span>{editProfileName || 'Bina Project'}</span>
                    <span className="text-[#F68A0A] text-xs">✓</span>
                  </h3>
                  <p className="text-[11px] text-slate-300 mt-0.5 whitespace-pre-line leading-relaxed">
                    {editTagline || 'Jasa Konstruksi & Interior Terpercaya di Malang'}
                  </p>
                </div>

                {/* Buttons List */}
                <div className="w-full space-y-2 z-10 flex-1 overflow-y-auto pr-0.5">
                  {links
                    .filter((l) => l.is_active)
                    .map((link) => (
                      <div
                        key={link.id}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 transition-all text-xs font-semibold text-white shadow-xs cursor-pointer"
                      >
                        <span className="w-6 h-6 rounded-md bg-[#F68A0A]/20 flex items-center justify-center text-[#F68A0A] shrink-0">
                          <Link2 className="w-3.5 h-3.5" />
                        </span>
                        <span className="truncate flex-1 text-[11.5px]">{link.title}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                      </div>
                    ))}

                  {links.filter((l) => l.is_active).length === 0 && (
                    <div className="text-center py-8 text-slate-400 text-xs">
                      Tidak ada link aktif.
                    </div>
                  )}
                </div>

                {/* Phone Footer */}
                <div className="z-10 text-center text-[10px] text-slate-500 pt-4 pb-1">
                  bio.binaproject.com
                </div>

                {/* Home Indicator bar */}
                <div className="w-28 h-1 bg-slate-700 rounded-full mt-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BioLinkEditor;
