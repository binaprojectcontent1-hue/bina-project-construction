import React, { useState, useRef } from 'react';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Eye,
  Edit3,
  Code,
  Sparkles,
  HelpCircle,
  Check,
  AlertCircle,
  Info,
} from 'lucide-react';
import { Button } from './ui/button';

interface RichTextEditorProps {
  value: string;
  onChange: (htmlContent: string) => void;
  label?: string;
  placeholder?: string;
  readingTime?: number;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  label = 'Isi Konten Artikel',
  placeholder = 'Tulis naskah artikel Anda di sini...',
  readingTime,
}) => {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [showCode, setShowCode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Calculate Stats
  const rawText = value.replace(/<[^>]*>/g, ' ');
  const words = rawText.trim().split(/\s+/).filter(Boolean).length;
  const chars = rawText.length;
  const estimatedMin = Math.max(1, Math.ceil(words / 180));

  // Helper to wrap or insert formatting
  const insertFormat = (prefix: string, suffix: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || defaultText;

    const replacement = `${prefix}${selectedText}${suffix}`;
    const newContent = value.substring(0, start) + replacement + value.substring(end);
    onChange(newContent);

    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 0);
  };

  // Quick insertion helpers (Non-programming friendly)
  const handleBold = () => insertFormat('<strong>', '</strong>', 'teks tebal');
  const handleItalic = () => insertFormat('<em>', '</em>', 'teks miring');
  const handleH2 = () => insertFormat('\n\n<h2>', '</h2>\n\n', 'Judul Bagian Baru');
  const handleH3 = () => insertFormat('\n\n<h3>', '</h3>\n\n', 'Sub-Judul Poin');
  const handleBulletList = () => {
    insertFormat('\n<ul>\n  <li>', '</li>\n  <li>Poin kedua</li>\n</ul>\n', 'Poin pertama');
  };
  const handleNumberedList = () => {
    insertFormat('\n<ol>\n  <li>', '</li>\n  <li>Langkah kedua</li>\n</ol>\n', 'Langkah pertama');
  };
  const handleQuote = () => {
    insertFormat('\n<blockquote>', '</blockquote>\n', 'Kutipan penting atau tips arsitek...');
  };
  const handleCalloutBox = () => {
    insertFormat(
      '\n<div style="background:#F0FDF4;border-left:4px solid #10B981;padding:16px;border-radius:8px;margin:16px 0;">\n  <strong>💡 Tips Penting:</strong>\n  <p>',
      '</p>\n</div>\n',
      'Tulis catatan penting atau rekomendasi material di sini.'
    );
  };
  const handleDivider = () => insertFormat('\n\n<hr />\n\n');

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white overflow-hidden shadow-xs">
      {/* Top Header & Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-slate-50/70 px-4 py-2.5 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-900">{label}</span>
          <span className="text-[11px] font-medium text-slate-400">
            (Bebas Tag HTML — Gunakan Tombol Toolbar)
          </span>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-200/60 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'write'
                ? 'bg-white text-[#22416D] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Mode Tulis</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'preview'
                ? 'bg-white text-[#22416D] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Pratinjau Layar (Preview)</span>
          </button>
        </div>
      </div>

      {/* Visual Formatting Toolbar (Only in Write Mode) */}
      {activeTab === 'write' && (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-100 bg-white text-slate-700">
          <button
            type="button"
            onClick={handleBold}
            title="Teks Tebal (Bold)"
            className="p-1.5 rounded hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleItalic}
            title="Teks Miring (Italic)"
            className="p-1.5 rounded hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Italic className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-200 mx-1" />

          <button
            type="button"
            onClick={handleH2}
            title="Judul Bagian (Heading 2)"
            className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Heading2 className="w-4 h-4" />
            <span>Judul Bab</span>
          </button>

          <button
            type="button"
            onClick={handleH3}
            title="Sub-Judul (Heading 3)"
            className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Heading3 className="w-4 h-4" />
            <span>Sub-Judul</span>
          </button>

          <div className="h-4 w-px bg-slate-200 mx-1" />

          <button
            type="button"
            onClick={handleBulletList}
            title="Daftar Poin (Bullet List)"
            className="p-1.5 rounded hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <List className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleNumberedList}
            title="Daftar Nomor (Numbered List)"
            className="p-1.5 rounded hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleQuote}
            title="Blok Kutipan / Quote"
            className="p-1.5 rounded hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Quote className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleCalloutBox}
            title="Kotak Tips Hijau"
            className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>+ Kotak Tips</span>
          </button>

          <button
            type="button"
            onClick={handleDivider}
            title="Garis Pembatas (Divider)"
            className="p-1.5 rounded hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowCode(!showCode)}
              className={`p-1.5 rounded text-xs flex items-center gap-1 ${
                showCode ? 'bg-[#22416D] text-white' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Toggle Lihat Kode HTML Asli"
            >
              <Code className="w-3.5 h-3.5" />
              <span className="text-xs hidden sm:inline">HTML</span>
            </button>
          </div>
        </div>
      )}

      {/* Editor Body */}
      {activeTab === 'write' ? (
        <div className="p-4">
          <textarea
            ref={textareaRef}
            rows={14}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full text-sm md:text-base font-normal text-slate-800 leading-relaxed border-0 focus:outline-none focus:ring-0 resize-y p-2 min-h-[320px] placeholder:text-slate-400"
          />
        </div>
      ) : (
        /* Live Reader Preview Mode */
        <div className="p-6 md:p-8 min-h-[340px] bg-white">
          <div className="mb-5 pb-3 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Pratinjau Tampilan di Website:
            </span>
            <span className="text-xs font-bold text-[#22416D]">
              Format Otomatis Desain Bina Project
            </span>
          </div>

          {value.trim() ? (
            <div
              className="prose prose-slate max-w-none text-slate-800 space-y-4 leading-relaxed font-sans text-sm md:text-base"
              dangerouslySetInnerHTML={{ __html: value }}
            />
          ) : (
            <div className="py-14 text-center text-slate-400 text-sm italic">
              Belum ada isi konten naskah. Silakan ketik di Tab Mode Tulis.
            </div>
          )}
        </div>
      )}

      {/* Bottom Status Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 border-t border-slate-200 bg-slate-50 text-xs text-slate-600 gap-2">
        <div className="flex items-center gap-4">
          <span>
            <strong className="text-slate-900">{words}</strong> kata
          </span>
          <span>
            <strong className="text-slate-900">{chars}</strong> karakter
          </span>
          <span>
            Waktu Baca: <strong className="text-slate-900">±{readingTime || estimatedMin} menit</strong>
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Format aman tersimpan</span>
        </div>
      </div>
    </div>
  );
};
