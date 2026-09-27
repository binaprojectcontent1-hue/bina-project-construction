import React, { useState, useEffect, useMemo } from 'react';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Globe,
  MessageCircle,
  ExternalLink,
  Save,
  Rocket,
  RefreshCw,
  Eye,
  Check,
  AlertCircle,
  Share2,
  Compass,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { HelpTooltip } from '../components/ui/HelpTooltip';
import { useToast } from '../components/ui/Toast';
import { fetchSiteSettings, saveSiteSettings } from '../lib/settingsService';
import { triggerCloudflareDeploy } from '../lib/cloudflare';
import type { SiteSettings } from '../types/settings';
import { DEFAULT_SITE_SETTINGS } from '../types/settings';

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const YouTubeIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.27 1.76-.23 1.03.14 2.18.91 2.87.73.69 1.79.93 2.76.7 1.05-.22 1.92-1.07 2.15-2.11.11-.64.08-1.31.08-1.97.01-4.71 0-9.42.02-14.13z"/>
  </svg>
);

export const BusinessProfileSettings: React.FC = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [formData, setFormData] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [previewTab, setPreviewTab] = useState<'card' | 'maps' | 'footer'>('card');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await fetchSiteSettings();
      setFormData(data);
      setIsDirty(false);
    } catch (err: any) {
      toast.error('Gagal Memuat Pengaturan', err?.message || 'Gagal memuat data dari database.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof SiteSettings, value: string) => {
    setIsDirty(true);
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      
      // Keep whatsapp_url automatically synchronized
      if (field === 'whatsapp_number') {
        const cleanedNumber = value.replace(/[^0-9]/g, '');
        updated.whatsapp_url = cleanedNumber ? `https://wa.me/${cleanedNumber}` : '';
      }

      // Auto-suggest phone_tel if user updates phone_display
      if (field === 'phone_display' && (!prev.phone_tel || prev.phone_tel === 'tel:' + prev.phone_display.replace(/[^0-9+]/g, ''))) {
        const telNumber = value.replace(/[^0-9+]/g, '');
        updated.phone_tel = telNumber ? `tel:${telNumber}` : '';
      }

      return updated;
    });
  };

  const handleSave = async (autoDeploy = false) => {
    setSaving(true);
    try {
      const res = await saveSiteSettings(formData);
      if (!res.success) {
        toast.error('Gagal Menyimpan', res.message || 'Terjadi kesalahan saat menyimpan data.');
        setSaving(false);
        return;
      }

      const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      setLastSavedTime(time);
      setIsDirty(false);
      toast.success('Pengaturan Tersimpan', 'Profil & data kontak bisnis berhasil diperbarui di database.');

      if (autoDeploy) {
        setDeploying(true);
        const deployToastId = toast.loading('Memperbarui halaman website publik...');
        const deployRes = await triggerCloudflareDeploy();
        toast.dismiss(deployToastId);

        if (deployRes.success) {
          toast.success(
            'Website Berhasil Diperbarui',
            'Perubahan profil & kontak resmi telah diterapkan langsung ke website publik.'
          );
        } else {
          toast.error('Gagal Memperbarui Web', deployRes.message);
        }
        setDeploying(false);
      }
    } catch (err: any) {
      toast.error('Kesalahan Sistem', err?.message || 'Gagal menghubungi server.');
    } finally {
      setSaving(false);
    }
  };

  // Generate test WhatsApp URL with current message
  const testWhatsAppUrl = useMemo(() => {
    const num = formData.whatsapp_number.replace(/[^0-9]/g, '');
    if (!num) return '#';
    const text = encodeURIComponent(formData.whatsapp_default_message || 'Halo Bina Project');
    return `https://wa.me/${num}?text=${text}`;
  }, [formData.whatsapp_number, formData.whatsapp_default_message]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[440px]">
        <div className="text-center space-y-3">
          <RefreshCw className="w-7 h-7 text-[#1B365D] animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Memuat profil & kontak bisnis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-28">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#1B365D] text-white shadow-2xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                Profil & Kontak Bisnis
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Pusat kendali nomor WhatsApp, CS greeting, nomor telepon kantor, alamat studio, dan tautan media sosial resmi.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => loadSettings()}
            disabled={saving || deploying}
            className="text-xs gap-1.5 h-9 bg-white font-semibold text-slate-700 hover:bg-slate-50"
            title="Muat ulang data dari database server"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Muat Ulang</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => handleSave(false)}
            disabled={saving || deploying}
            className="bg-[#1B365D] hover:bg-[#152a48] text-white text-xs font-semibold h-9 px-4 gap-1.5 shadow-xs"
          >
            {saving && !deploying ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>{saving && !deploying ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
          </Button>
        </div>
      </div>

      {/* Main Grid: Form Left (7 cols), Live Interactive Preview Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= LEFT COLUMN: FORM SECTIONS ================= */}
        <div className="lg:col-span-7 space-y-5">
          {/* Section 1: WhatsApp & CS Direct Channels */}
          <Card className="shadow-xs border-slate-200/90 rounded-xl bg-white">
            <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/40">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold text-slate-900">
                    Saluran WhatsApp & Layanan Konsultasi CS
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Nomor WhatsApp utama untuk tombol konsultasi cepat, floating chat, dan form website.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  Nomor WhatsApp Resmi <span className="text-rose-500">*</span>
                  <HelpTooltip content="Gunakan kode negara tanpa tanda plus (+), contoh: 6281335335304. Sistem akan otomatis membuat tautan wa.me yang valid." />
                </label>
                <Input
                  type="text"
                  value={formData.whatsapp_number}
                  onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                  placeholder="Contoh: 6281335335304"
                  className="font-mono text-xs h-9 rounded-lg"
                />
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-0.5">
                  <span>Tautan otomatis:</span>
                  <span className="font-mono text-slate-600 truncate">{formData.whatsapp_url || 'https://wa.me/...'}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  Template Pesan Pembuka WhatsApp CS
                  <HelpTooltip content="Pesan default yang langsung terisi otomatis pada aplikasi WhatsApp saat calon klien menekan tombol 'Konsultasi Gratis' di website." />
                </label>
                <textarea
                  rows={3}
                  value={formData.whatsapp_default_message}
                  onChange={(e) => handleChange('whatsapp_default_message', e.target.value)}
                  placeholder="Halo Bina Project, saya ingin konsultasi rencana proyek konstruksi/interior dan estimasi RAB gratis."
                  className="w-full text-xs rounded-lg border border-slate-200 p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1B365D]/20 focus:border-[#1B365D] transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    Nomor Telepon Tampilan
                    <HelpTooltip content="Format nomor telepon yang rapi untuk dibaca pengunjung pada footer dan header website." />
                  </label>
                  <Input
                    type="text"
                    value={formData.phone_display}
                    onChange={(e) => handleChange('phone_display', e.target.value)}
                    placeholder="+62 81-335-335-304"
                    className="text-xs h-9 rounded-lg"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    Protokol Panggilan Telepon
                    <HelpTooltip content="Format protokol saat nomor telepon diklik di HP untuk langsung membuka keypad telepon, contoh: tel:+6281335335304" />
                  </label>
                  <Input
                    type="text"
                    value={formData.phone_tel}
                    onChange={(e) => handleChange('phone_tel', e.target.value)}
                    placeholder="tel:+6281335335304"
                    className="font-mono text-xs h-9 rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  Email Resmi Kantor
                  <HelpTooltip content="Alamat email resmi untuk pengiriman surat penawaran, tender, dan kontak formal klien." />
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="binaproject.info@gmail.com"
                  className="text-xs h-9 rounded-lg"
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Address & Google Maps */}
          <Card className="shadow-xs border-slate-200/90 rounded-xl bg-white">
            <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/40">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-blue-50 text-[#1B365D] border border-blue-100">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold text-slate-900">
                    Alamat Studio & Lokasi Google Maps
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Lokasi fisik kantor, workshop, dan peta interaktif yang tampil di halaman Kontak & Footer.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-800 block">
                  Alamat Lengkap Kantor / Studio <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Jl. Watumujur II No.6, Kota Malang"
                  className="text-xs h-9 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-800 block">Kota</label>
                  <Input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="Kota Malang"
                    className="text-xs h-9 rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-800 block">Provinsi</label>
                  <Input
                    type="text"
                    value={formData.province}
                    onChange={(e) => handleChange('province', e.target.value)}
                    placeholder="Jawa Timur"
                    className="text-xs h-9 rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-800 block">Kode Pos</label>
                  <Input
                    type="text"
                    value={formData.postal_code}
                    onChange={(e) => handleChange('postal_code', e.target.value)}
                    placeholder="65145"
                    className="text-xs h-9 rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  Link Petunjuk Arah Google Maps (Share URL)
                  <HelpTooltip content="Tautan langsung ke Google Maps saat pengunjung menekan tombol 'Buka Petunjuk Arah' atau 'Lihat di Maps'." />
                </label>
                <Input
                  type="url"
                  value={formData.google_maps_url}
                  onChange={(e) => handleChange('google_maps_url', e.target.value)}
                  placeholder="https://maps.app.goo.gl/..."
                  className="font-mono text-xs h-9 rounded-lg"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    URL Sematan Peta Interaktif (Embed Google Maps)
                    <HelpTooltip content="Link embed Google Maps (URL 'src' pada kode sematan iframe) untuk menampilkan peta visual di halaman Kontak." />
                  </label>
                </div>
                <Input
                  type="text"
                  value={formData.google_maps_embed_url}
                  onChange={(e) => handleChange('google_maps_embed_url', e.target.value)}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  className="font-mono text-xs h-9 rounded-lg"
                />
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  💡 <strong>Cara ambil dari Google Maps:</strong> Buka lokasi kantor di Google Maps → Klik tombol <em>Bagikan (Share)</em> → Pilih tab <em>Sematkan peta (Embed map)</em> → Salin URL di dalam tanda kutip <code>src="..."</code>.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Operating Hours */}
          <Card className="shadow-xs border-slate-200/90 rounded-xl bg-white">
            <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/40">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-100">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold text-slate-900">
                    Jam Operasional Kantor & Workshop
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Jadwal buka layanan konsultasi studio dan jadwal kunjungan survei lapangan.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-800 block">
                  Jam Buka Reguler (Ringkas)
                </label>
                <Input
                  type="text"
                  value={formData.opening_hours}
                  onChange={(e) => handleChange('opening_hours', e.target.value)}
                  placeholder="Contoh: Senin - Sabtu: 08:00 - 16:00 WIB"
                  className="text-xs h-9 rounded-lg"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-800 block">
                  Jam Buka Detail (Termasuk Kebijakan Hari Libur)
                </label>
                <Input
                  type="text"
                  value={formData.opening_hours_detail}
                  onChange={(e) => handleChange('opening_hours_detail', e.target.value)}
                  placeholder="Contoh: Senin - Sabtu: 08:00 - 16:00 WIB | Minggu / Libur: Khusus Janji Temu"
                  className="text-xs h-9 rounded-lg"
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Social Media Links */}
          <Card className="shadow-xs border-slate-200/90 rounded-xl bg-white">
            <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/40">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-100">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold text-slate-900">
                    Akun Media Sosial Resmi
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Tautan media sosial yang tampil pada footer, header, dan bio link resmi studio.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3.5 pt-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <InstagramIcon className="w-3.5 h-3.5 text-pink-600" />
                  <span>Instagram Resmi</span>
                </label>
                <Input
                  type="url"
                  value={formData.instagram_url}
                  onChange={(e) => handleChange('instagram_url', e.target.value)}
                  placeholder="https://www.instagram.com/binaproject.id"
                  className="text-xs h-9 rounded-lg"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <TikTokIcon className="w-3.5 h-3.5 text-slate-800" />
                  <span>TikTok Resmi</span>
                </label>
                <Input
                  type="url"
                  value={formData.tiktok_url}
                  onChange={(e) => handleChange('tiktok_url', e.target.value)}
                  placeholder="https://www.tiktok.com/@binaproject.id"
                  className="text-xs h-9 rounded-lg"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <YouTubeIcon className="w-3.5 h-3.5 text-red-600" />
                  <span>Kanal YouTube</span>
                </label>
                <Input
                  type="url"
                  value={formData.youtube_url}
                  onChange={(e) => handleChange('youtube_url', e.target.value)}
                  placeholder="https://www.youtube.com/@binaproject.id"
                  className="text-xs h-9 rounded-lg"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  <span>Link Ulasan Google Maps (Google Review Link)</span>
                </label>
                <Input
                  type="url"
                  value={formData.google_business_url}
                  onChange={(e) => handleChange('google_business_url', e.target.value)}
                  placeholder="https://share.google/..."
                  className="text-xs h-9 rounded-lg"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ================= RIGHT COLUMN: LIVE INTERACTIVE PREVIEW ================= */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-4">
          {/* Interactive Live Preview Card */}
          <Card className="shadow-xs border border-slate-200/90 bg-white rounded-xl overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#1B365D]" />
                  <CardTitle className="text-xs font-semibold text-slate-900">
                    Pratinjau Tampilan Website Langsung
                  </CardTitle>
                </div>
                <div className="flex items-center p-0.5 bg-slate-200/70 rounded-lg text-[11px] font-semibold">
                  <button
                    type="button"
                    onClick={() => setPreviewTab('card')}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      previewTab === 'card' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Kontak
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewTab('maps')}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      previewTab === 'maps' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Peta
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewTab('footer')}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      previewTab === 'footer' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Footer
                  </button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {/* TAB 1: Contact Card Preview */}
              {previewTab === 'card' && (
                <div className="space-y-3.5 animate-in fade-in duration-150">
                  <div className="p-4 rounded-xl bg-[#1B365D] text-white shadow-sm space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-white text-[#1B365D] flex items-center justify-center font-semibold text-xs shadow-2xs">
                          B
                        </div>
                        <div>
                          <h4 className="font-semibold text-xs text-white leading-tight">
                            Bina Project Construction
                          </h4>
                          <p className="text-[11px] text-blue-200/80 font-medium">
                            {formData.city || 'Kota Malang'}, {formData.province || 'Jawa Timur'}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                        Buka Hari Ini
                      </span>
                    </div>

                    <div className="space-y-2 pt-1 text-xs">
                      <div className="flex items-start gap-2 text-slate-200">
                        <MapPin className="w-3.5 h-3.5 text-blue-300 mt-0.5 shrink-0" />
                        <span className="text-[11px] leading-snug line-clamp-2">
                          {formData.address || 'Jl. Watumujur II No.6, Kota Malang'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-slate-200">
                        <Phone className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                        <span className="text-[11px] font-mono">
                          {formData.phone_display || '+62 81-335-335-304'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-slate-200">
                        <Mail className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                        <span className="text-[11px] font-mono truncate">
                          {formData.email || 'binaproject.info@gmail.com'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-slate-200">
                        <Clock className="w-3.5 h-3.5 text-purple-300 shrink-0" />
                        <span className="text-[11px] truncate">
                          {formData.opening_hours || 'Senin - Sabtu: 08:00 - 16:00 WIB'}
                        </span>
                      </div>
                    </div>

                    {/* Social Media Row in Mockup */}
                    <div className="pt-2.5 border-t border-white/15 flex items-center justify-between">
                      <span className="text-[10px] text-blue-200/70">Media Sosial Resmi:</span>
                      <div className="flex items-center gap-1.5">
                        {formData.instagram_url && (
                          <span className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center text-pink-300" title="Instagram">
                            <InstagramIcon className="w-2.5 h-2.5" />
                          </span>
                        )}
                        {formData.youtube_url && (
                          <span className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center text-red-300" title="YouTube">
                            <YouTubeIcon className="w-2.5 h-2.5" />
                          </span>
                        )}
                        {formData.tiktok_url && (
                          <span className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center text-cyan-300 font-semibold text-[8px]" title="TikTok">
                            TT
                          </span>
                        )}
                        {formData.google_business_url && (
                          <span className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center text-blue-300" title="Google Maps Review">
                            <Globe className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp Direct Test Button */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-semibold text-slate-700 block">
                      Uji Coba Tautan WhatsApp Langsung:
                    </span>
                    <a
                      href={testWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full h-9 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-2xs"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Buka Chat WhatsApp Klien</span>
                      <ExternalLink className="w-3 h-3 text-emerald-100" />
                    </a>
                    <p className="text-[10px] text-slate-400 text-center">
                      Membuka WhatsApp Web / App dengan template pesan pembuka yang sudah disesuaikan.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: Maps Live Preview */}
              {previewTab === 'maps' && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <div className="rounded-xl overflow-hidden border border-slate-200 h-52 bg-slate-100 relative shadow-2xs">
                    {formData.google_maps_embed_url ? (
                      <iframe
                        title="Google Maps Preview"
                        src={formData.google_maps_embed_url}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs p-4 text-center">
                        <Compass className="w-8 h-8 text-slate-300 mb-1" />
                        <span>Isi URL Sematan Peta di sebelah kiri untuk melihat peta interaktif di sini.</span>
                      </div>
                    )}
                  </div>

                  {formData.google_maps_url && (
                    <a
                      href={formData.google_maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 w-full h-8 rounded-lg bg-blue-50 text-[#1B365D] hover:bg-blue-100 border border-blue-200/80 text-xs font-semibold transition-colors shadow-2xs"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#1B365D]" />
                      <span>Buka Petunjuk Arah di Google Maps</span>
                      <ExternalLink className="w-3 h-3 text-blue-500" />
                    </a>
                  )}
                </div>
              )}

              {/* TAB 3: Footer Preview */}
              {previewTab === 'footer' && (
                <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3 text-xs animate-in fade-in duration-150 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-400" />
                    <span className="font-semibold text-white">Hubungi Kami</span>
                  </div>
                  <div className="space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
                    <p>{formData.address || 'Jl. Watumujur II No.6, Kota Malang'}</p>
                    <p className="text-slate-400 font-mono">{formData.phone_display || '+62 81-335-335-304'}</p>
                    <p className="text-slate-400 font-mono">{formData.email || 'binaproject.info@gmail.com'}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                    <span>© {new Date().getFullYear()} PT Bina Project</span>
                    <span className="text-amber-400 font-medium">Bina Project Construction</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Publication Note */}
          <div className="p-3.5 rounded-xl bg-slate-100/90 border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <div className="flex items-center justify-between font-semibold text-slate-800">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Penyimpanan Database Aktif</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                {lastSavedTime ? `Tersimpan ${lastSavedTime}` : 'Siap'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Setelah tombol <strong>Simpan Perubahan</strong> ditekan, gunakan tombol <strong>Simpan & Publikasikan Web</strong> di bawah untuk menerapkan perubahan ke seluruh pengunjung website resmi secara langsung.
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Floating Action Bar */}
      <div className="fixed bottom-0 left-0 md:left-72 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-3 px-4 md:px-8 shadow-lg flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Status Pengaturan:</span>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${
              isDirty ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isDirty ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
              }`}
            />
            {isDirty ? 'Ada perubahan belum disimpan' : 'Semua data tersimpan'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => loadSettings()}
            disabled={saving || deploying}
            className="text-xs h-9 px-3 text-slate-600 font-semibold"
          >
            Reset
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleSave(false)}
            disabled={saving || deploying}
            className="text-xs h-9 px-3.5 gap-1.5 text-slate-800 font-semibold"
          >
            <Save className="w-3.5 h-3.5 text-slate-500" />
            <span>{saving && !deploying ? 'Menyimpan...' : 'Simpan Draft'}</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => handleSave(true)}
            disabled={saving || deploying}
            className="text-xs h-9 px-4 gap-1.5 bg-[#1B365D] hover:bg-[#152a48] text-white shadow-xs font-semibold cursor-pointer"
          >
            {deploying ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Rocket className="w-3.5 h-3.5" />
            )}
            <span>{deploying ? 'Mempublikasikan...' : 'Simpan & Publikasikan Web'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
