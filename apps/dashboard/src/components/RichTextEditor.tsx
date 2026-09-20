import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import {
  Bold,
  Italic,
  Strikethrough,
  Code as CodeIcon,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link as LinkIcon,
  Unlink,
  Undo2,
  Redo2,
  Sparkles,
  Eye,
  Edit3,
  Code2,
  Check,
  Lightbulb,
  PhoneCall,
} from 'lucide-react';
import { formatPlainTextToHtml, formatArticleContent, formatAndSanitizeArticleContent } from '../utils/formatContent';

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
  placeholder = 'Mulai ketik naskah artikel Anda di sini, atau gunakan tombol toolbar...',
  readingTime,
}) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'code' | 'preview'>('visual');
  const [htmlCode, setHtmlCode] = useState(value);

  // Initialize Tiptap WYSIWYG Editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
        HTMLAttributes: {
          class: 'text-[#22416D] underline font-medium hover:text-[#1B3457]',
        },
      }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class:
          'tiptap prose prose-slate max-w-none focus:outline-none min-h-[380px] p-6 text-slate-800 leading-relaxed font-sans text-base',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setHtmlCode(html);
      onChange(html);
    },
  });

  // Keep internal states in sync when external value prop changes
  useEffect(() => {
    setHtmlCode(value);
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value || '', { emitUpdate: false });
    }
  }, [value, editor]);

  // Handle Tab Switching & Content Synchronization
  const handleTabChange = (tab: 'visual' | 'code' | 'preview') => {
    if (tab === 'visual' && activeTab === 'code' && editor) {
      // Sync code changes into visual editor
      editor.commands.setContent(htmlCode, { emitUpdate: false });
    }
    setActiveTab(tab);
  };

  // Handle Code Mode Direct Input
  const handleCodeChange = (newCode: string) => {
    setHtmlCode(newCode);
    onChange(newCode);
  };

  // Quick Format Plain Text
  const handleAutoFormat = () => {
    const raw = editor ? editor.getHTML() : value;
    if (!raw.trim()) return;
    const formatted = formatPlainTextToHtml(raw);
    if (editor) {
      editor.commands.setContent(formatted, { emitUpdate: true });
    }
    setHtmlCode(formatted);
    onChange(formatted);
  };

  // Link Inserter
  const setLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Masukkan URL tautan (contoh: https://binaproject.id):', previousUrl || 'https://');

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  // Custom Bina Project Blocks Insertion
  const insertCalloutBox = () => {
    if (!editor) return;
    const calloutHtml = `
      <div class="article-callout" style="background:#F0FDF4; border-left:4px solid #10B981; padding:16px; border-radius:8px; margin:20px 0;">
        <strong style="color:#065F46;">💡 Tips Ahli Bina Project:</strong>
        <p style="margin-top:4px; color:#1E293B;">Tulis catatan penting, rekomendasi material, atau standar arsitektur di sini.</p>
      </div>
    `;
    editor.chain().focus().insertContent(calloutHtml).run();
  };

  const insertCtaBox = () => {
    if (!editor) return;
    const ctaHtml = `
      <div class="article-cta-box" style="background:linear-gradient(135deg, #F8FAFC, #EFF6FF); border:1px solid #BFDBFE; border-radius:12px; padding:24px; margin:24px 0; text-align:center;">
        <h4 style="color:#22416D; font-size:1.25rem; font-weight:700; margin:0 0 8px 0;">Wujudkan Bangunan & Interior Impian Anda</h4>
        <p style="color:#334155; font-size:0.95rem; margin:0 0 16px 0;">Konsultasikan kebutuhan gambar 3D, RAB transparan, dan pengerjaan bergaransi bersama tim ahli Bina Project.</p>
        <a href="/contact" style="display:inline-block; background:#22416D; color:#FFFFFF; padding:10px 20px; border-radius:8px; font-weight:600; text-decoration:none;">Konsultasi Gratis Sekarang</a>
      </div>
    `;
    editor.chain().focus().insertContent(ctaHtml).run();
  };

  // Word, Character & Reading Time Stats
  const rawText = (value || '').replace(/<[^>]*>/g, ' ');
  const words = rawText.trim().split(/\s+/).filter(Boolean).length;
  const chars = rawText.length;
  const estimatedMin = Math.max(1, Math.ceil(words / 180));

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs">
      {/* Top Header & Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-slate-50/80 px-4 py-2.5 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-900">{label}</span>
          <span className="text-[11px] font-medium text-slate-400 hidden sm:inline">
            (Visual WYSIWYG ala WordPress & Notion)
          </span>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => handleTabChange('visual')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'visual'
                ? 'bg-white text-[#22416D] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Visual Editor</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('code')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'code'
                ? 'bg-white text-[#22416D] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Kode HTML</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('preview')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'preview'
                ? 'bg-white text-[#22416D] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Pratinjau Layar</span>
          </button>
        </div>
      </div>

      {/* Visual Editor Interactive Toolbar */}
      {activeTab === 'visual' && editor && (
        <div className="sticky top-0 z-20 flex flex-wrap items-center gap-1 p-2 border-b border-slate-200 bg-white/95 backdrop-blur-xs text-slate-700 select-none">
          {/* Headings Selector Group */}
          <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg mr-1">
            <button
              type="button"
              onClick={() => editor.chain().focus().setParagraph().run()}
              className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${
                editor.isActive('paragraph')
                  ? 'bg-[#22416D] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Teks Paragraf Normal"
            >
              P
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-0.5 ${
                editor.isActive('heading', { level: 2 })
                  ? 'bg-[#22416D] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Judul Bab (Heading 2)"
            >
              <Heading2 className="w-3.5 h-3.5" />
              <span>H2</span>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-0.5 ${
                editor.isActive('heading', { level: 3 })
                  ? 'bg-[#22416D] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Sub-Judul (Heading 3)"
            >
              <Heading3 className="w-3.5 h-3.5" />
              <span>H3</span>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
              className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-0.5 ${
                editor.isActive('heading', { level: 4 })
                  ? 'bg-[#22416D] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Sub-Poin Kecil (Heading 4)"
            >
              <Heading4 className="w-3.5 h-3.5" />
              <span>H4</span>
            </button>
          </div>

          <div className="h-4 w-px bg-slate-200 mx-0.5" />

          {/* Inline Formatters */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive('bold')
                ? 'bg-[#22416D] text-white shadow-2xs'
                : 'hover:bg-slate-100 text-slate-700'
            }`}
            title="Tebal (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive('italic')
                ? 'bg-[#22416D] text-white shadow-2xs'
                : 'hover:bg-slate-100 text-slate-700'
            }`}
            title="Miring (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive('strike')
                ? 'bg-[#22416D] text-white shadow-2xs'
                : 'hover:bg-slate-100 text-slate-700'
            }`}
            title="Coret Teks (Strikethrough)"
          >
            <Strikethrough className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive('code')
                ? 'bg-[#22416D] text-white shadow-2xs'
                : 'hover:bg-slate-100 text-slate-700'
            }`}
            title="Kode Inline"
          >
            <CodeIcon className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-200 mx-0.5" />

          {/* Lists */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive('bulletList')
                ? 'bg-[#22416D] text-white shadow-2xs'
                : 'hover:bg-slate-100 text-slate-700'
            }`}
            title="Daftar Poin (Bullet List)"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive('orderedList')
                ? 'bg-[#22416D] text-white shadow-2xs'
                : 'hover:bg-slate-100 text-slate-700'
            }`}
            title="Daftar Nomor (Numbered List)"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-200 mx-0.5" />

          {/* Blocks */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive('blockquote')
                ? 'bg-[#22416D] text-white shadow-2xs'
                : 'hover:bg-slate-100 text-slate-700'
            }`}
            title="Kutipan / Blockquote"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors"
            title="Garis Pembatas (Divider)"
          >
            <Minus className="w-4 h-4" />
          </button>

          {/* Links */}
          <button
            type="button"
            onClick={setLink}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive('link')
                ? 'bg-[#22416D] text-white shadow-2xs'
                : 'hover:bg-slate-100 text-slate-700'
            }`}
            title="Sisipkan Tautan URL"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          {editor.isActive('link') && (
            <button
              type="button"
              onClick={() => editor.chain().focus().unsetLink().run()}
              className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors"
              title="Hapus Tautan"
            >
              <Unlink className="w-4 h-4" />
            </button>
          )}

          <div className="h-4 w-px bg-slate-200 mx-0.5" />

          {/* Bina Project Special Inserts */}
          <button
            type="button"
            onClick={insertCalloutBox}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 transition-colors shadow-2xs"
            title="Sisipkan Kotak Tips Hijau"
          >
            <Lightbulb className="w-3.5 h-3.5 text-emerald-600" />
            <span>+ Tips</span>
          </button>

          <button
            type="button"
            onClick={insertCtaBox}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 transition-colors shadow-2xs"
            title="Sisipkan Box Call to Action Konsultasi"
          >
            <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
            <span>+ Box CTA</span>
          </button>

          {/* Auto Format Helper */}
          <button
            type="button"
            onClick={handleAutoFormat}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 transition-colors shadow-2xs"
            title="Rapikan struktur teks polos otomatis menjadi paragraf, H2, dan list"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Format Rapi</span>
          </button>

          {/* History Undo / Redo */}
          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Urungkan Perubahan (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Ulangi Perubahan (Ctrl+Y)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Editor Main Canvas */}
      {activeTab === 'visual' && (
        <div className="bg-white min-h-[400px]">
          <EditorContent editor={editor} />
        </div>
      )}

      {/* Raw HTML Code Tab */}
      {activeTab === 'code' && (
        <div className="p-4 bg-slate-900">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs text-slate-400">
            <span>Editor Tag HTML Mentah (Langsung disinkronkan ke Visual Editor)</span>
            <span className="font-mono text-emerald-400">UTF-8 HTML</span>
          </div>
          <textarea
            rows={18}
            value={htmlCode}
            onChange={(e) => handleCodeChange(e.target.value)}
            placeholder="<html>..."
            className="w-full font-mono text-xs md:text-sm text-slate-100 bg-transparent leading-relaxed border-0 focus:outline-none focus:ring-0 resize-y p-2 min-h-[380px]"
          />
        </div>
      )}

      {/* Live Website Preview Tab */}
      {activeTab === 'preview' && (
        <div className="p-6 md:p-8 min-h-[400px] bg-white">
          <div className="mb-5 pb-3 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Pratinjau Tampilan Live Website:
            </span>
            <span className="text-xs font-bold text-[#22416D]">
              Format Desain Editorial Bina Project
            </span>
          </div>

          {value && value.trim() ? (
            <div
              className="prose prose-slate max-w-none text-slate-800 space-y-4 leading-relaxed font-sans text-sm md:text-base [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:border-b [&_h2]:border-slate-200 [&_h2]:pb-2 [&_h2]:mt-6 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-slate-800 [&_h3]:mt-4 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-4 [&_blockquote]:border-[#22416D] [&_blockquote]:bg-slate-50 [&_blockquote]:p-3 [&_blockquote]:rounded-r-lg"
              dangerouslySetInnerHTML={{ __html: formatAndSanitizeArticleContent(value) }}
            />
          ) : (
            <div className="py-16 text-center text-slate-400 text-sm italic">
              Belum ada isi konten naskah. Silakan tulis di Tab Visual Editor.
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
          <span>Format semantik aman tersimpan</span>
        </div>
      </div>

      {/* Editor Custom ProseMirror Scoped Styles */}
      <style>{`
        .tiptap {
          outline: none !important;
        }
        .tiptap p {
          margin-top: 0;
          margin-bottom: 1.25rem;
          line-height: 1.85;
          font-size: 1.05rem;
          color: #334155;
        }
        .tiptap h2 {
          font-size: 1.45rem;
          font-weight: 700;
          color: #17202A;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          line-height: 1.4;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #E2E8F0;
        }
        .tiptap h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #17202A;
          margin-top: 1.6rem;
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }
        .tiptap h4 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #17202A;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
        }
        .tiptap ul {
          list-style-type: disc;
          padding-left: 1.75rem;
          margin-top: 0.5rem;
          margin-bottom: 1.25rem;
        }
        .tiptap ol {
          list-style-type: decimal;
          padding-left: 1.75rem;
          margin-top: 0.5rem;
          margin-bottom: 1.25rem;
        }
        .tiptap li {
          margin-bottom: 0.4rem;
          line-height: 1.75;
          color: #334155;
        }
        .tiptap blockquote {
          border-left: 4px solid #22416D;
          background: #F8FAFC;
          padding: 1rem 1.25rem;
          border-radius: 0 8px 8px 0;
          margin: 1.5rem 0;
          font-style: normal;
          color: #334155;
        }
        .tiptap hr {
          border: none;
          height: 1px;
          background: #E2E8F0;
          margin: 2rem 0;
        }
        .tiptap code {
          background-color: #F1F5F9;
          color: #0F172A;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.9em;
          font-family: monospace;
        }
      `}</style>
    </div>
  );
};
