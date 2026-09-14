import React, { useState, useEffect } from 'react';
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
  CheckCircle2,
  AlertCircle,
  Eye,
  Info,
  Send,
  Zap,
} from 'lucide-react';

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
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { HelpTooltip } from '../components/ui/HelpTooltip';
import { useToast } from '../components/ui/Toast';
import { fetchSiteSettings, saveSiteSettings } from '../lib/settingsService';
import { triggerCloudflareDeploy } from '../lib/cloudflare';
import type { SiteSettings } from '../types/settings';
import { DEFAULT_SITE_SETTINGS } from '../types/settings';

export const BusinessProfileSettings: React.FC = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [deploying, setDeploying] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await fetchSiteSettings();
      setFormData(data);
    } catch (err: any) {
      toast.error('Gagal Memuat Pengaturan', err?.message || 'Gagal memuat data dari database.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof SiteSettings, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Automatically keep whatsapp_url synchronized with whatsapp_number
      if (field === 'whatsapp_number') {
        const cleanedNumber = value.replace(/[^0-9]/g, '');
        updated.whatsapp_url = cleanedNumber ? `https://wa.me/${cleanedNumber}` : '';
      }
      return updated;
    });
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const res = await saveSiteSettings(formData);
      if (res.success) {
        const time = new Date().toLocaleTimeString('id-ID');
        setLastSavedTime(time);
        toast.success('Pengaturan Tersimpan', 'Profil & data kontak bisnis berhasil diperbarui di database.');
      } else {
        toast.error('Gagal Menyimpan', res.message || 'Terjadi kesalahan saat menyimpan data.');
      }
    } catch (err: any) {
      toast.error('Kesalahan Sistem', err?.message || 'Gagal menghubungi server.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeploy = async () => {
    setDeploying(true);
    try {
      const res = await triggerCloudflareDeploy();
      if (res.success) {
        toast.success(
          'Publikasi Dimulai!',
          'Cloudflare sedang mem-build ulang website statis. Perubahan profil & kontak akan live dalam 30–60 detik.'
        );
      } else {
        toast.error('Gagal Memulai Publikasi', res.message);
      }
    } catch (err: any) {
      toast.error('Kesalahan Deploy', err?.message || 'Gagal menghubungi Cloudflare webhook.');
    } finally {
      setDeploying(false);
    }
  };

  // Generate test WhatsApp URL with current customized default message
  const testWhatsAppUrl = React.useMemo(() => {
    const num = formData.whatsapp_number.replace(/[^0-9]/g, '');
    if (!num) return '#';
    const text = encodeURIComponent(formData.whatsapp_default_message || 'Halo Bina Project');
    return `https://wa.me/${num}?text=${text}`;
  }, [formData.whatsapp_number, formData.whatsapp_default_message]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <RefreshCw className="w-7 h-7 text-[#22416D] animate-spin mx-auto" />
          <p className="text-xs font-medium text-slate-500">Memuat profil & kontak bisnis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#22416D] text-white shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Profil & Kontak Bisnis
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Pusat kendali nomor WhatsApp, CS greeting, nomor telepon, alamat kantor, dan media sosial resmi.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => loadSettings()}
            disabled={saving || deploying}
            className="text-xs gap-1.5 h-9 bg-white"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
            <span>Reset / Muat Ulang</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => handleSave()}
            disabled={saving}
            className="bg-[#22416D] hover:bg-[#1A3356] text-white text-xs font-semibold h-9 px-4 gap-1.5 shadow-xs"
          >
            {saving ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
          </Button>
        </div>
      </div>

      {/* Main Grid: Form Left (7 cols), Live Preview Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= LEFT COLUMN: FORM SECTIONS ================= */}
        <div className="lg:col-span-7 space-y-5">
          {/* Section 1: WhatsApp & CS Direct Channels */}
          <Card className="shadow-xs border-slate-200">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold text-slate-900">
                    Saluran WhatsApp & Layanan Konsultasi CS
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Nomor WhatsApp utama untuk tombol konsultasi, floating chat, dan form kontak
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  Nomor WhatsApp Resmi
                  <HelpTooltip content="Gunakan kode negara tanpa tanda tambah (+), contoh: 6281335335304. Ini akan dipakai langsung untuk link wa.me." />
                </label>
                <Input
                  type="text"
                  value={formData.whatsapp_number}
                  onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                  placeholder="6281335335304"
                  className="font-mono text-xs h-9"
                />
                <span className="text-[11px] text-slate-400">
                  Tautan otomatis: <span className="font-mono text-slate-600">{formData.whatsapp_url || 'https://wa.me/...'}</span>
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  Template Pesan Pembuka WhatsApp CS
                  <HelpTooltip content="Pesan default yang langsung terisi otomatis saat calon klien menekan tombol 'Konsultasi WhatsApp' di website." />
                </label>
                <textarea
                  rows={3}
                  value={formData.whatsapp_default_message}
                  onChange={(e) => handleChange('whatsapp_default_message', e.target.value)}
                  placeholder="Halo Bina Project, saya ingin konsultasi rencana proyek..."
                  className="w-full text-xs rounded-md border border-slate-200 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#22416D]/30 focus:border-[#22416D]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    Telepon Tampilan (Display)
                    <HelpTooltip content="Format nomor telepon yang cantik untuk dibaca manusia di footer & header." />
                  </label>
                  <Input
                    type="text"
                    value={formData.phone_display}
                    onChange={(e) => handleChange('phone_display', e.target.value)}
                    placeholder="+62 81-335-335-304"
                    className="text-xs h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    URI Dial Telepon (tel:)
                    <HelpTooltip content="Protokol panggilan langsung saat diklik di HP, contoh: tel:+6281335335304" />
                  </label>
                  <Input
                    type="text"
                    value={formData.phone_tel}
                    onChange={(e) => handleChange('phone_tel', e.target.value)}
                    placeholder="tel:+6281335335304"
                    className="font-mono text-xs h-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  Email Kantor Resmi
                  <HelpTooltip content="Alamat email resmi untuk pengiriman inquiries dan formal tender." />
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="binaproject.info@gmail.com"
                  className="text-xs h-9"
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Address & Google Maps */}
          <Card className="shadow-xs border-slate-200">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-50 text-[#22416D]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold text-slate-900">
                    Alamat Studio & Google Maps
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Lokasi fisik kantor, workshop, dan peta interaktif yang tampil di halaman Kontak & Footer
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Alamat Lengkap Kantor / Studio
                </label>
                <Input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Jl. Watumujur II No.6, Kota Malang"
                  className="text-xs h-9"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Kota</label>
                  <Input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="Kota Malang"
                    className="text-xs h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Provinsi</label>
                  <Input
                    type="text"
                    value={formData.province}
                    onChange={(e) => handleChange('province', e.target.value)}
                    placeholder="Jawa Timur"
                    className="text-xs h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Kode Pos</label>
                  <Input
                    type="text"
                    value={formData.postal_code}
                    onChange={(e) => handleChange('postal_code', e.target.value)}
                    placeholder="65145"
                    className="text-xs h-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  Link Google Maps (Share URL)
                  <HelpTooltip content="Tautan langsung ke Google Maps saat pengunjung menekan tombol 'Buka Petunjuk Arah'." />
                </label>
                <Input
                  type="url"
                  value={formData.google_maps_url}
                  onChange={(e) => handleChange('google_maps_url', e.target.value)}
                  placeholder="https://maps.app.goo.gl/..."
                  className="font-mono text-xs h-9"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  URL Iframe Embed Google Maps
                  <HelpTooltip content="Link 'src' iframe embed dari Google Maps untuk peta interaktif di halaman /contact." />
                </label>
                <Input
                  type="text"
                  value={formData.google_maps_embed_url}
                  onChange={(e) => handleChange('google_maps_embed_url', e.target.value)}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  className="font-mono text-xs h-9"
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Operating Hours */}
          <Card className="shadow-xs border-slate-200">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold text-slate-900">
                    Jam Operasional Kantor & Workshop
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Jadwal buka untuk konsultasi studio dan survei lokasi
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Jam Buka Reguler (Ringkas)
                </label>
                <Input
                  type="text"
                  value={formData.opening_hours}
                  onChange={(e) => handleChange('opening_hours', e.target.value)}
                  placeholder="Senin - Sabtu: 08:00 - 16:00 WIB"
                  className="text-xs h-9"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Jam Buka Detail (Termasuk Kebijakan Hari Libur)
                </label>
                <Input
                  type="text"
                  value={formData.opening_hours_detail}
                  onChange={(e) => handleChange('opening_hours_detail', e.target.value)}
                  placeholder="Senin - Sabtu: 08:00 - 16:00 WIB | Minggu / Libur: Khusus Janji Temu"
                  className="text-xs h-9"
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Social Media Links */}
          <Card className="shadow-xs border-slate-200">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-50 text-purple-700">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold text-slate-900">
                    Akun Media Sosial Resmi
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Tautan media sosial yang tampil pada footer, header, dan bio link
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3.5 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <InstagramIcon className="w-3.5 h-3.5 text-pink-600" />
                  <span>Instagram</span>
                </label>
                <Input
                  type="url"
                  value={formData.instagram_url}
                  onChange={(e) => handleChange('instagram_url', e.target.value)}
                  placeholder="https://www.instagram.com/binaproject.id"
                  className="text-xs h-9"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <span className="font-bold text-xs text-slate-900">TikTok</span>
                  <span className="text-[11px] text-slate-400">(@binaproject.id)</span>
                </label>
                <Input
                  type="url"
                  value={formData.tiktok_url}
                  onChange={(e) => handleChange('tiktok_url', e.target.value)}
                  placeholder="https://www.tiktok.com/@binaproject.id"
                  className="text-xs h-9"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <YouTubeIcon className="w-3.5 h-3.5 text-red-600" />
                  <span>YouTube Channel</span>
                </label>
                <Input
                  type="url"
                  value={formData.youtube_url}
                  onChange={(e) => handleChange('youtube_url', e.target.value)}
                  placeholder="https://www.youtube.com/@binaproject.id"
                  className="text-xs h-9"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  <span>Google Business Profile (Maps Official Review Link)</span>
                </label>
                <Input
                  type="url"
                  value={formData.google_business_url}
                  onChange={(e) => handleChange('google_business_url', e.target.value)}
                  placeholder="https://share.google/..."
                  className="text-xs h-9"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ================= RIGHT COLUMN: LIVE INTERACTIVE PREVIEW & ACTIONS ================= */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-4">
          {/* Action & Publication Status Box */}
          <Card className="bg-gradient-to-br from-[#0B172C] via-[#0E1E38] to-[#142646] text-white border-0 rounded-[24px] shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <CardTitle className="text-sm font-semibold text-white">
                    Status Sinkronisasi
                  </CardTitle>
                </div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                  Database Online
                </span>
              </div>
              <CardDescription className="text-xs text-blue-200/70">
                Simpan perubahan ke database dan publikasikan live ke Cloudflare
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-1">
              <div className="p-3 rounded-xl bg-[#08101E]/70 border border-blue-500/20 text-xs space-y-1">
                <div className="flex items-center justify-between text-xs text-blue-200/80">
                  <span>Terakhir Tersimpan:</span>
                  <span className="font-mono text-white font-medium">
                    {lastSavedTime ? `${lastSavedTime} WIB` : 'Sesi Aktif'}
                  </span>
                </div>
                <p className="text-xs text-slate-300/80 leading-relaxed pt-1">
                  Setelah menyimpan, Anda dapat langsung menekan tombol <strong>Publikasikan ke Website</strong> agar seluruh halaman publik di-refresh otomatis.
                </p>
              </div>

              <div className="space-y-2">
                <Button
                  type="button"
                  onClick={() => handleSave()}
                  disabled={saving}
                  className="w-full bg-[#22416D] hover:bg-[#1A3356] text-white font-semibold text-xs h-10 shadow-xs gap-2"
                >
                  {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{saving ? 'Sedang Menyimpan...' : 'Simpan Profil & Kontak'}</span>
                </Button>

                <Button
                  type="button"
                  onClick={handleDeploy}
                  disabled={deploying}
                  className="w-full rounded-full bg-[#22416D] hover:bg-[#1A3356] text-white font-semibold text-xs h-10 shadow-md gap-2 transition-colors cursor-pointer"
                >
                  {deploying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
                  <span>{deploying ? 'Memicu Cloudflare Build...' : 'Publikasikan ke Website Live'}</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Live Card Preview */}
          <Card className="shadow-sm hover:shadow-md transition-shadow border-0 bg-white rounded-[24px] overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#22416D]" />
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Live Preview Kartu Kontak
                  </CardTitle>
                </div>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  Pratinjau Langsung
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Mock Contact Card (matches website aesthetic) */}
              <div className="p-4 rounded-2xl bg-gradient-to-b from-[#0F203B] to-[#0A1527] text-white shadow-md border border-blue-900/40 space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#22416D] flex items-center justify-center font-bold text-white shadow-inner">
                    B
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white leading-tight">
                      Bina Project Construction
                    </h4>
                    <p className="text-[11px] text-blue-200/60 font-medium">
                      {formData.city || 'Kota Malang'}, {formData.province || 'Jawa Timur'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-1 text-xs">
                  <div className="flex items-start gap-2 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                    <span className="text-[11px] leading-snug line-clamp-2">
                      {formData.address || 'Jl. Watumujur II No.6, Kota Malang'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-[11px] font-mono">
                      {formData.phone_display || '+62 81-335-335-304'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="text-[11px] font-mono truncate">
                      {formData.email || 'binaproject.info@gmail.com'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="text-[11px] truncate">
                      {formData.opening_hours || 'Senin - Sabtu: 08:00 - 16:00 WIB'}
                    </span>
                  </div>
                </div>

                {/* Social Icons Strip in Preview */}
                <div className="pt-2 border-t border-slate-700/60 flex items-center gap-2">
                  <span className="text-[10px] text-slate-400">Sosial:</span>
                  <div className="flex items-center gap-1.5">
                    {formData.instagram_url && (
                      <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-pink-400">
                        <InstagramIcon className="w-3 h-3" />
                      </span>
                    )}
                    {formData.youtube_url && (
                      <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-red-400">
                        <YouTubeIcon className="w-3 h-3" />
                      </span>
                    )}
                    {formData.tiktok_url && (
                      <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-cyan-300 font-bold text-[9px]">
                        TT
                      </span>
                    )}
                    {formData.google_business_url && (
                      <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-blue-400">
                        <Globe className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Test Button */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide block">
                  Uji Coba Tautan WhatsApp Langsung:
                </label>
                <a
                  href={testWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full h-10 rounded-full bg-[#22416D] hover:bg-[#1A3356] text-white text-xs font-semibold transition-colors shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Buka Chat WhatsApp Klien</span>
                  <ExternalLink className="w-3 h-3 text-blue-200" />
                </a>
                <p className="text-xs text-slate-500 text-center">
                  Menguji pesan template pembuka dengan nomor saat ini.
                </p>
              </div>

              {/* Google Maps Embed Preview */}
              {formData.google_maps_embed_url && (
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide block">
                    Pratinjau Peta Embed:
                  </label>
                  <div className="rounded-xl overflow-hidden border border-slate-200 h-36 bg-slate-100 relative">
                    <iframe
                      title="Google Maps Preview"
                      src={formData.google_maps_embed_url}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
