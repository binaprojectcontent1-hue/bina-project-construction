import React, { useState } from 'react';
import { Upload, CheckCircle2, X, AlertCircle, GitBranch, Settings } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { isGitHubConfigured, uploadToGitHubStorage, getGitHubConfig } from '../lib/github';
import { resolveDashboardMediaUrl } from '../lib/media';
import { compressImageClientSide, formatFileSize } from '../utils/imageCompression';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  altText: string;
  onAltChange: (alt: string) => void;
  bucket?: string;
  folder?: string;
  requiredAlt?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  value,
  onChange,
  altText,
  onAltChange,
  bucket = 'media',
  folder = 'portfolio',
  requiredAlt = true,
}) => {
  const [uploading, setUploading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [compressionNote, setCompressionNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ghConfigured = isGitHubConfigured();
  const ghConfig = getGitHubConfig();

  // Resolve preview URL via universal helper
  const previewSrc = resolveDashboardMediaUrl(value);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setError(null);
      setCompressionNote(null);
      if (!e.target.files || e.target.files.length === 0) return;

      const rawFile = e.target.files[0];
      setCompressing(true);

      // Auto compress large photos client-side
      const { file, wasCompressed, originalSize, compressedSize } =
        await compressImageClientSide(rawFile);
      setCompressing(false);

      if (wasCompressed) {
        setCompressionNote(
          `Foto otomatis diperkecil: ${formatFileSize(originalSize)} ➔ ${formatFileSize(compressedSize)} agar cepat diakses`
        );
      }

      const cleanFileName = file.name
        .replace(/\.[^/.]+$/, '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-');

      setUploading(true);

      // Priority 1: GitHub Storage (Dedicated Media Repo)
      if (ghConfigured && ghConfig) {
        const ghRes = await uploadToGitHubStorage(file, folder, ghConfig);
        // Save CDN URL
        onChange(ghRes.cdn_url);

        if (!altText) {
          onAltChange(`Foto ${cleanFileName.replace(/-/g, ' ')} Bina Project`);
        }
        return;
      }

      // Priority 2: Supabase Storage fallback
      if (supabase) {
        const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const filePath = `${folder}/${Date.now()}-${cleanFileName}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
        if (data?.publicUrl) {
          onChange(`/media/${filePath}`);
          if (!altText) {
            onAltChange(`Dokumentasi ${cleanFileName.replace(/-/g, ' ')} Bina Project`);
          }
        }
        return;
      }

      // Neither configured
      setError(
        'Penyimpanan foto belum terhubung. Silakan hubungi tim administrator.'
      );
    } catch (err: any) {
      console.error('Upload failed:', err);
      setError(err?.message || 'Gagal mengunggah gambar.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="rounded-xl border border-slate-200 shadow-xs bg-white">
      <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-semibold text-slate-900">{label}</CardTitle>
          {ghConfigured && ghConfig ? (
            <Badge variant="secondary" className="text-xs gap-1 text-slate-700 bg-slate-100 border border-slate-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Penyimpanan Foto Aktif</span>
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs text-amber-600 bg-amber-50/60 border-amber-200">
              Perlu Dihubungkan
            </Badge>
          )}
        </div>

        {requiredAlt && (
          <Badge variant="outline" className="text-xs font-normal text-slate-600">
            Wajib Deskripsi Foto
          </Badge>
        )}
      </CardHeader>

      <CardContent className="pt-3.5 space-y-3.5">
        {uploading || compressing ? (
          <div className="relative h-44 rounded-lg overflow-hidden border border-slate-200 bg-slate-50/80 p-4 flex flex-col items-center justify-center space-y-2.5 animate-pulse">
            <div className="w-9 h-9 rounded-full bg-slate-100 text-[#1B365D] flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-[#1B365D] border-t-transparent rounded-full animate-spin" />
            </div>
            <div className="text-center space-y-0.5">
              <p className="text-xs font-semibold text-slate-800">
                {compressing ? 'Mengoptimalkan Foto...' : 'Mengunggah Foto...'}
              </p>
              <p className="text-[11px] text-slate-500">
                Memproses foto agar cepat dimuat oleh pengunjung website
              </p>
            </div>
          </div>
        ) : value ? (
          <div className="relative h-44 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 group">
            <img
              src={previewSrc}
              alt={altText || 'Preview'}
              className="w-full h-full object-cover object-center"
              onError={() => {
                console.warn('Image preview propagating...');
              }}
            />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-2.5 right-2.5 p-1.5 bg-slate-900/80 hover:bg-rose-600 text-white rounded-md transition-all cursor-pointer shadow-sm"
              title="Ganti atau Hapus Gambar"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 left-2 right-2 bg-slate-900/85 backdrop-blur-xs text-white px-2.5 py-1 rounded-md text-[11px] flex items-center justify-between">
              <span className="truncate max-w-[260px] font-mono text-xs">
                {value}
              </span>
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Siap Tayang
              </span>
            </div>
          </div>
        ) : (
          <label className="h-44 border-2 border-dashed border-slate-200 hover:border-[#1B365D] bg-slate-50/50 hover:bg-slate-50 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-colors select-none text-center">
            <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-slate-600 flex items-center justify-center mb-2 shadow-2xs">
              <Upload className="w-4 h-4 text-[#1B365D]" />
            </div>
            <span className="text-xs font-semibold text-slate-800">
              Pilih Foto Dokumentasi
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5 max-w-[240px]">
              {ghConfigured && ghConfig
                ? `Rekomendasi rasio lanskap (16:9). Otomatis dioptimalkan CDN.`
                : 'Format JPG, PNG, atau WebP (Maks. 5MB)'}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        )}

        {error && (
          <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2 rounded-lg">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {compressionNote && (
          <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-md border border-slate-100">
            {compressionNote}
          </div>
        )}

        {!ghConfigured && !value && (
          <div className="flex items-center gap-2 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 p-2.5 rounded-lg">
            <Settings className="w-3.5 h-3.5 flex-shrink-0 text-amber-600" />
            <span>
              Tip: Hubungkan <strong>GitHub Storage</strong> di menu <em>Pengaturan</em> agar foto otomatis terunggah ke repository media Anda.
            </span>
          </div>
        )}

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold text-slate-700">
              Deskripsi Gambar untuk Google (Alt Text) <span className="text-rose-500">*</span>
            </label>
            <span className="text-slate-400 text-[11px]">Membantu rangking Google Image</span>
          </div>
          <Input
            value={altText}
            onChange={(e) => onAltChange(e.target.value)}
            placeholder="Contoh: Tampak Depan Villa Tropis Modern di Kota Batu Malang"
            className="rounded-lg h-9 text-xs"
          />
        </div>
      </CardContent>
    </Card>
  );
};
