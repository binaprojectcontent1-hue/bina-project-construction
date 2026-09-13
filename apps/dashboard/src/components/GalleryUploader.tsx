import React, { useState } from 'react';
import { isGitHubConfigured, uploadToGitHubStorage, getGitHubConfig } from '../lib/github';
import { resolveDashboardMediaUrl } from '../lib/media';
import { compressImageClientSide, formatFileSize } from '../utils/imageCompression';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

// Solar Icon Components
const Icons = {
  Upload: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>,
  X: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 18 18"/></svg>,
  Images: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>,
  AlertCircle: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>,
  CheckCircle2: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  GitBranch: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>,
  Sparkles: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.274L3 12l5.813 1.912a2 2 0 0 1 1.274 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.274-1.275L12 3Z"/></svg>,
};

const { Upload, X, Images, AlertCircle, CheckCircle2, GitBranch, Sparkles } = Icons;

interface GalleryUploaderProps {
  label?: string;
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
}

export const GalleryUploader: React.FC<GalleryUploaderProps> = ({
  label = 'Dokumentasi Proyek (Foto Galeri)',
  value = [],
  onChange,
  folder = 'portfolio',
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number; statusText: string } | null>(null);
  const [compressionNote, setCompressionNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ghConfigured = isGitHubConfigured();
  const ghConfig = getGitHubConfig();

  const handleMultipleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setError(null);
      setCompressionNote(null);
      if (!e.target.files || e.target.files.length === 0) return;

      const rawFiles = Array.from(e.target.files);
      setUploading(true);
      const total = rawFiles.length;
      let compressedCount = 0;
      let totalSavedBytes = 0;

      const newUrls: string[] = [];

      for (let i = 0; i < total; i++) {
        const rawFile = rawFiles[i];

        // 1. Client-side compression if file is large
        setUploadProgress({
          current: i + 1,
          total,
          statusText: `Mengoptimalkan foto (${i + 1}/${total})...`,
        });

        const { file: fileToUpload, wasCompressed, originalSize, compressedSize } =
          await compressImageClientSide(rawFile);

        if (wasCompressed) {
          compressedCount++;
          totalSavedBytes += Math.max(0, originalSize - compressedSize);
        }

        // 2. Upload to GitHub Storage
        setUploadProgress({
          current: i + 1,
          total,
          statusText: `Mengunggah foto (${i + 1}/${total})...`,
        });

        if (ghConfigured && ghConfig) {
          const ghRes = await uploadToGitHubStorage(fileToUpload, folder, ghConfig);
          newUrls.push(ghRes.cdn_url);
        } else {
          throw new Error('GitHub Storage belum dikonfigurasi. Hubungkan Token & Repo di Pengaturan.');
        }
      }

      if (compressedCount > 0) {
        setCompressionNote(
          `✨ ${compressedCount} dari ${total} foto otomatis diperkecil (hemat ${formatFileSize(totalSavedBytes)}) agar website cepat dimuat pengunjung.`
        );
      }

      onChange([...value, ...newUrls]);
    } catch (err: any) {
      console.error('Gallery upload failed:', err);
      setError(err?.message || 'Gagal mengunggah foto galeri.');
    } finally {
      setUploading(false);
      setUploadProgress(null);
      // Reset input value so same files can be re-selected if needed
      e.target.value = '';
    }
  };

  const handleRemove = (indexToRemove: number) => {
    const updated = value.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  return (
    <Card className="shadow-xs">
      <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <Images className="w-4 h-4 text-slate-500" />
          <CardTitle className="text-sm font-semibold text-slate-900">{label}</CardTitle>
          <Badge variant="secondary" className="text-xs text-slate-600 bg-slate-100">
            {value.length} Foto
          </Badge>
        </div>

        {ghConfigured && (
          <Badge variant="secondary" className="text-xs gap-1 text-slate-700 bg-slate-100 border border-slate-200">
            <GitBranch className="w-2.5 h-2.5 text-slate-500" />
            <span>GitHub Storage</span>
          </Badge>
        )}
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Upload Zone */}
        <label className="border border-dashed border-slate-300 hover:border-[#22416D] bg-slate-50/50 hover:bg-slate-50 rounded-md p-5 flex flex-col items-center justify-center cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-md bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center mb-2">
            {uploading ? (
              <div className="w-4 h-4 border-2 border-[#22416D] border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
          </div>
          <span className="text-xs font-medium text-slate-800">
            {uploading && uploadProgress
              ? uploadProgress.statusText
              : 'Klik untuk unggah foto dokumentasi galeri'}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5">
            Pilih satu atau beberapa foto sekaligus (JPG, PNG, WebP)
          </span>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleMultipleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>

        {compressionNote && (
          <div className="flex items-center gap-2 text-xs text-[#22416D] bg-blue-50 border border-blue-200/80 p-2.5 rounded-md">
            <Sparkles className="w-4 h-4 flex-shrink-0 text-[#22416D]" />
            <span>{compressionNote}</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50/70 border border-rose-200/70 p-2.5 rounded-md">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Thumbnails Grid */}
        {value.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
            {value.map((imgUrl, index) => {
              const previewSrc = resolveDashboardMediaUrl(imgUrl);
              return (
                <div
                  key={`${imgUrl}-${index}`}
                  className="relative group rounded-md overflow-hidden border border-slate-200 bg-slate-100 aspect-video"
                >
                  <img
                    src={previewSrc}
                    alt={`Dokumentasi ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleRemove(index)}
                      className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-md shadow-sm transition-transform transform hover:scale-110"
                      title="Hapus foto"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="absolute bottom-1 left-1 bg-[#0D192B]/80 text-white text-xs px-1.5 py-0.5 rounded font-mono">
                    #{index + 1}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
