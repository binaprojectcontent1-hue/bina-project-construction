import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Monitor, Smartphone } from 'lucide-react';

// Solar Icon Components (lightweight SVG replacements)
const Icons = {
  Plus: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Search: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  ExternalLink: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>,
  Edit3: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 3a2.82 2.82 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/></svg>,
  Trash2: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  BookOpen: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h6z"/></svg>,
  Calendar: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>,
  Clock: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
};


import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface GoogleSerpPreviewProps {
  title: string;
  metaTitle: string;
  description: string;
  metaDescription: string;
  slug: string;
  type: 'portfolio' | 'blog';
  publishedDate?: string;
}

export const GoogleSerpPreview: React.FC<GoogleSerpPreviewProps> = ({
  title,
  metaTitle,
  description,
  metaDescription,
  slug,
  type,
}) => {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Compute active values with fallback
  const displayTitle = (metaTitle || title || 'Judul Halaman Belum Diisi').trim();
  const displayDesc = (
    metaDescription ||
    description ||
    'Deskripsi ringkas halaman belum diisi. Google akan menampilkan ringkasan ini di bawah judul halaman pada hasil pencarian.'
  ).trim();
  const displayUrl = `https://binaproject.id › ${type} › ${slug || 'nama-halaman'}`;

  const titleLength = displayTitle.length;
  const descLength = displayDesc.length;

  const getTitleStatus = () => {
    if (titleLength === 0) return { label: 'Kosong', color: 'text-slate-400', bar: 'bg-slate-200', icon: AlertCircle, badge: 'secondary' as const };
    if (titleLength < 35) return { label: 'Bisa Ditambah Lagi', color: 'text-amber-600', bar: 'bg-amber-500', icon: AlertTriangle, badge: 'outline' as const };
    if (titleLength <= 60) return { label: 'Sangat Pas untuk Google', color: 'text-emerald-600', bar: 'bg-emerald-500', icon: CheckCircle2, badge: 'success' as const };
    return { label: 'Terlalu Panjang (Bisa Terpotong)', color: 'text-rose-600', bar: 'bg-rose-500', icon: AlertCircle, badge: 'destructive' as const };
  };

  const getDescStatus = () => {
    if (descLength === 0) return { label: 'Kosong', color: 'text-slate-400', bar: 'bg-slate-200', icon: AlertCircle, badge: 'secondary' as const };
    if (descLength < 90) return { label: 'Bisa Ditambah Lagi', color: 'text-amber-600', bar: 'bg-amber-500', icon: AlertTriangle, badge: 'outline' as const };
    if (descLength <= 160) return { label: 'Sangat Pas untuk Google', color: 'text-emerald-600', bar: 'bg-emerald-500', icon: CheckCircle2, badge: 'success' as const };
    return { label: 'Terlalu Panjang (Bisa Terpotong)', color: 'text-rose-600', bar: 'bg-rose-500', icon: AlertCircle, badge: 'destructive' as const };
  };

  const titleStatus = getTitleStatus();
  const descStatus = getDescStatus();
  const TitleIcon = titleStatus.icon;
  const DescIcon = descStatus.icon;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#1B365D] text-white flex items-center justify-center font-semibold text-xs">
              G
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-slate-900">
                Pratinjau Hasil Pencarian Google
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Tampilan judul & ringkasan yang akan dilihat pengunjung di Google
              </CardDescription>
            </div>
          </div>

          {/* Device toggle */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-100">
            <button
              type="button"
              onClick={() => setDevice('desktop')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-all ${
                device === 'desktop'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-3 h-3" />
              <span>Komputer</span>
            </button>
            <button
              type="button"
              onClick={() => setDevice('mobile')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-all ${
                device === 'mobile'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              <span>HP / Mobile</span>
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2 space-y-4">
        {/* Real-time Indicator Meters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">Panjang Judul Halaman</span>
              <span className={`flex items-center gap-1 font-semibold text-xs ${titleStatus.color}`}>
                <TitleIcon className="w-3 h-3" />
                {titleLength}/60 karakter
              </span>
            </div>
            <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${titleStatus.bar}`}
                style={{ width: `${Math.min(100, (titleLength / 60) * 100)}%` }}
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">Panjang Kalimat Ringkasan</span>
              <span className={`flex items-center gap-1 font-semibold text-xs ${descStatus.color}`}>
                <DescIcon className="w-3 h-3" />
                {descLength}/160 karakter
              </span>
            </div>
            <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${descStatus.bar}`}
                style={{ width: `${Math.min(100, (descLength / 160) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Google Result Card Simulation */}
        <div className="p-3.5 rounded-xl bg-slate-50">
          <div
            className={`mx-auto bg-white p-4 rounded-xl shadow-xs transition-all ${
              device === 'mobile' ? 'max-w-[340px]' : 'w-full max-w-[620px]'
            }`}
          >
            {/* Favicon + Brand URL */}
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-4 h-4 rounded-full bg-[#1B365D] flex items-center justify-center text-xs text-white font-semibold flex-shrink-0">
                B
              </div>
              <div className="flex flex-col leading-tight min-w-0">
                <span className="text-xs font-semibold text-[#202124] truncate">Bina Project</span>
                <span className="text-xs text-[#4D5156] truncate font-sans">{displayUrl}</span>
              </div>
            </div>

            {/* Title Link */}
            <h3 className="text-[17px] font-medium text-[#1A0DAB] hover:underline cursor-pointer leading-snug line-clamp-2">
              {displayTitle}
            </h3>

            {/* Snippet / Description */}
            <p className="text-xs text-[#4D5156] mt-1.5 leading-relaxed line-clamp-2">
              {displayDesc}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
