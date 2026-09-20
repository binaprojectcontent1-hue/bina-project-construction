import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  RefreshCw,
  X,
  Globe,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { isGitHubConfigured, getGitHubConfig, uploadToGitHubStorage } from '../lib/github';
import { supabase } from '../lib/supabase';
import { resolveDashboardMediaUrl } from '../lib/media';
import { compressImageClientSide, formatFileSize } from '../utils/imageCompression';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { useToast } from './ui/Toast';

interface LiveProjectImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}

export const LiveProjectImageUploader: React.FC<LiveProjectImageUploaderProps> = ({
  value,
  onChange,
  folder = 'live-projects',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const [uploading, setUploading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const ghConfigured = isGitHubConfigured();
  const ghConfig = getGitHubConfig();

  const handleProcessFile = async (rawFile: File) => {
    if (!rawFile.type.startsWith('image/')) {
      setError('Format file harus berupa gambar (JPG, PNG, atau WebP).');
      return;
    }

    try {
      setError(null);
      setCompressing(true);
      setStatusMessage('Mengompresi foto secara otomatis...');

      // 1. Client-side compression
      const { file, wasCompressed, originalSize, compressedSize } =
        await compressImageClientSide(rawFile);
      setCompressing(false);

      if (wasCompressed) {
        toast.info(
          'Optimasi Foto',
          `Ukuran foto dioptimalkan: ${formatFileSize(originalSize)} ➔ ${formatFileSize(compressedSize)}`
        );
      }

      setUploading(true);
      setStatusMessage('Menyimpan ke Cloud Media Resmi Bina Project...');

      // 1. Primary: Upload to GitHub Storage and assign own domain proxy URL
      if (ghConfigured && ghConfig) {
        const ghRes = await uploadToGitHubStorage(file, folder, ghConfig);
        // Save own domain URL (https://binaproject.id/media/live-projects/...)
        onChange(ghRes.own_domain_url);
        toast.success(
          'Foto Berhasil Diunggah!',
          `Tersimpan di Cloud Media Resmi (https://binaproject.id/media/${folder}/...)`
        );
        setStatusMessage(null);
        return;
      }

      // 2. Fallback: Supabase Storage if GitHub is not configured
      if (supabase) {
        setStatusMessage('Mengunggah ke Supabase Storage fallback...');
        const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const cleanName = file.name
          .replace(/\.[^/.]+$/, '')
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-');
        const filePath = `${folder}/${Date.now()}-${cleanName}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('media').getPublicUrl(filePath);
        if (data?.publicUrl) {
          onChange(`https://binaproject.id/media/${filePath}`);
          toast.success('Foto Diunggah ke Media Cloud');
          setStatusMessage(null);
          return;
        }
      }

      throw new Error('Penyimpanan media belum terkonfigurasi di pengaturan.');
    } catch (err: any) {
      console.error('Failed to upload image:', err);
      setError(err?.message || 'Gagal mengunggah foto.');
      toast.error('Upload Gagal', err?.message || 'Terjadi kesalahan saat mengunggah foto.');
    } finally {
      setUploading(false);
      setCompressing(false);
      setStatusMessage(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleProcessFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const isOwnDomainUrl = value.includes('binaproject.id/media') || value.includes('binaproject.com/media') || value.startsWith('/media');

  return (
    <div className="space-y-3">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Storage Backend Indicator Badge */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Foto Lapangan (1:1)
        </span>
        <Badge
          variant="secondary"
          className="text-[10px] font-semibold gap-1 text-emerald-800 bg-emerald-50 border border-emerald-200/80 rounded-full py-0.5 px-2.5"
        >
          <Globe className="w-3 h-3 text-emerald-600" />
          <span>Cloud Media Resmi (binaproject.id)</span>
        </Badge>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Uploading / Compressing Overlay Card */}
      {uploading || compressing ? (
        <div className="w-full aspect-square rounded-2xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center p-6 text-center shadow-xs">
          <RefreshCw className="w-8 h-8 text-[#22416D] animate-spin mb-3" />
          <p className="text-xs font-bold text-slate-800">
            {compressing ? 'Mengompresi Foto...' : 'Mengunggah ke Media Cloud...'}
          </p>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">{statusMessage}</p>
        </div>
      ) : value ? (
        /* Image Preview State (1:1 Ratio) */
        <div className="space-y-2">
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs group">
            <img
              src={resolveDashboardMediaUrl(value)}
              alt="Dokumentasi Proyek"
              className="w-full h-full object-cover"
              onError={(e) => {
                // If broken URL, show placeholder
                (e.target as HTMLElement).classList.add('opacity-40');
              }}
            />

            {/* Top Badges */}
            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#22416D] text-white shadow-sm">
                Rasio 1:1
              </span>
              {isOwnDomainUrl && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-sm flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>binaproject.id</span>
                </span>
              )}
            </div>

            {/* Hover Actions Bar */}
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2.5 p-4">
              <Button
                type="button"
                size="sm"
                pill
                onClick={() => fileInputRef.current?.click()}
                className="bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs gap-1.5 h-8 px-4 shadow-md"
              >
                <UploadCloud className="w-3.5 h-3.5 text-[#22416D]" />
                <span>Ganti Foto Baru</span>
              </Button>
              <Button
                type="button"
                size="sm"
                pill
                variant="outline"
                onClick={() => onChange('')}
                className="bg-rose-500/90 hover:bg-rose-600 text-white border-transparent font-bold text-xs gap-1.5 h-8 px-4 shadow-md"
              >
                <X className="w-3.5 h-3.5" />
                <span>Hapus Foto</span>
              </Button>
            </div>
          </div>

          {/* Quick Info & Toggle Manual URL */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span className="truncate max-w-[200px] font-mono text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
              {value.length > 34 ? `${value.slice(0, 34)}...` : value}
            </span>
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="text-[#22416D] hover:underline font-semibold text-[11px] cursor-pointer"
            >
              {showUrlInput ? 'Sembunyikan URL' : 'Edit URL'}
            </button>
          </div>
        </div>
      ) : (
        /* Empty Dropzone State (1:1 Ratio) */
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`w-full aspect-square rounded-2xl border-2 border-dashed transition-all cursor-pointer p-6 flex flex-col items-center justify-center text-center group ${
            isDragging
              ? 'border-[#22416D] bg-blue-50/40 scale-[0.99]'
              : 'border-slate-300 hover:border-[#22416D] bg-slate-50/60 hover:bg-blue-50/20'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200/80 shadow-2xs group-hover:scale-105 group-hover:border-[#22416D]/30 transition-all flex items-center justify-center text-[#22416D] mb-3">
            <UploadCloud className="w-7 h-7 stroke-[1.75]" />
          </div>
          <h4 className="text-sm font-bold text-slate-800 group-hover:text-[#22416D] transition-colors">
            Klik atau Geser Foto Lapangan
          </h4>
          <p className="text-xs text-slate-500 mt-1 max-w-[210px] leading-relaxed">
            Format JPG, PNG, atau WebP. Otomatis dikompresi & disajikan via domain resmi binaproject.id.
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-semibold border border-emerald-200/60">
            <Globe className="w-3 h-3 text-emerald-600" />
            <span>Target: https://binaproject.id/media/live-projects/...</span>
          </div>
        </div>
      )}

      {/* Optional Raw URL Input */}
      {(showUrlInput || !value) && (
        <div className="pt-1">
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
            Atau masukkan link URL gambar langsung:
          </label>
          <Input
            pill
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://binaproject.id/media/... atau URL gambar"
            className="text-xs placeholder:text-slate-400 border-slate-200"
          />
        </div>
      )}
    </div>
  );
};
