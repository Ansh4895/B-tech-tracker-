import React, { useEffect, useState } from 'react';
import { basicTopics, CheatTopic } from '@/src/lib/data';
import { uid } from '@/src/lib/store';
import { savePdf, listPdfs, deletePdf, type PdfRecord } from '@/src/lib/pdfStore';
import { FileText, Upload, Trash2, ExternalLink, Download, Search, Eye, X, BookOpen } from 'lucide-react';

export const NotesView: React.FC = () => {
  const [pdfs, setPdfs] = useState<PdfRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [subjectTag, setSubjectTag] = useState('Operating Systems');
  const [semTag, setSemTag] = useState(3);
  const [activePdfUrl, setActivePdfUrl] = useState<string | null>(null);
  const [activePdfName, setActivePdfName] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const refreshPdfs = () => {
    listPdfs()
      .then(setPdfs)
      .catch((err) => console.error('Failed to list PDFs from IndexedDB:', err));
  };

  useEffect(() => {
    refreshPdfs();
  }, []);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || file.type !== 'application/pdf') return;

    setLoading(true);
    try {
      const meta = {
        id: uid(),
        name: file.name,
        subject: subjectTag,
        sem: semTag,
        size: file.size,
        added: Date.now(),
      };
      await savePdf(meta, file);
      await refreshPdfs();
    } catch (err) {
      console.error('Failed to save PDF in IndexedDB:', err);
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  }

  const handleOpenPdf = (pdf: PdfRecord) => {
    const url = URL.createObjectURL(pdf.blob);
    setActivePdfUrl(url);
    setActivePdfName(pdf.name);
  };

  const handleDownloadPdf = (pdf: PdfRecord) => {
    const url = URL.createObjectURL(pdf.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = pdf.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredTopics = basicTopics.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.points.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="panel">
        <p className="eyebrow">Academic Knowledge Base</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
          Subject PDF Notes & Cheat-Sheets
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Store lecture slides, handwritten PDF notes locally via IndexedDB, and revise core CS fundamentals.
        </p>
      </section>

      {/* PDF Management Section */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-400" />
              <span>Subject PDF Repository</span>
            </h2>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">
              Saved locally in browser IndexedDB storage (offline capable)
            </p>
          </div>
        </div>

        {/* Upload Box */}
        <div className="panel space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-xs">
              <label className="text-muted-foreground font-mono">Subject Tag:</label>
              <select
                value={subjectTag}
                onChange={(e) => setSubjectTag(e.target.value)}
                className="field text-xs ml-2 py-1 inline-block w-auto"
              >
                <option value="Operating Systems">Operating Systems</option>
                <option value="DBMS">Database Management</option>
                <option value="Data Structures & Algorithms">Data Structures & Algo</option>
                <option value="Computer Networks">Computer Networks</option>
                <option value="OOPs Java">OOPs Java</option>
                <option value="Discrete Mathematics">Discrete Mathematics</option>
                <option value="Compiler Design">Compiler Design</option>
                <option value="General">General / Other</option>
              </select>
            </div>

            <div className="text-xs">
              <label className="text-muted-foreground font-mono">Semester:</label>
              <select
                value={semTag}
                onChange={(e) => setSemTag(parseInt(e.target.value))}
                className="field text-xs ml-2 py-1 inline-block w-auto"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Sem {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-800 p-8 hover:border-emerald-500/50 hover:bg-slate-900/40 transition">
            <Upload className="h-8 w-8 text-emerald-400/80 mb-2" />
            <span className="text-sm font-semibold text-slate-200">
              {loading ? 'Storing PDF in IndexedDB...' : 'Click or drop PDF here to upload'}
            </span>
            <span className="text-xs text-muted-foreground font-mono mt-1">
              Supports semester notes, lecture handouts & exam papers (.pdf)
            </span>
            <input
              type="file"
              className="hidden"
              accept=".pdf,application/pdf"
              onChange={onUpload}
              disabled={loading}
            />
          </label>
        </div>

        {/* Uploaded PDF Cards Grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pdfs.length === 0 ? (
            <div className="panel col-span-full text-center py-8 text-xs text-muted-foreground border-dashed">
              No PDFs uploaded yet. Upload your first subject notes above!
            </div>
          ) : (
            pdfs.map((p) => (
              <div
                key={p.id}
                className="panel group flex flex-col justify-between hover:border-slate-700 transition"
              >
                <div className="space-y-1.5 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Sem {p.sem} · {p.subject}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {(p.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                  <p className="truncate font-bold text-sm text-slate-100" title={p.name}>
                    {p.name}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Added: {new Date(p.added).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 mt-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenPdf(p)}
                      className="btn-primary text-xs py-1 px-2.5 flex items-center gap-1 font-mono"
                    >
                      <Eye className="h-3 w-3" />
                      <span>Preview</span>
                    </button>
                    <button
                      onClick={() => handleDownloadPdf(p)}
                      className="btn-ghost text-xs py-1 px-2 text-slate-300"
                      title="Download PDF"
                    >
                      <Download className="h-3 w-3" />
                    </button>
                  </div>

                  <button
                    onClick={async () => {
                      await deletePdf(p.id);
                      refreshPdfs();
                    }}
                    className="text-xs text-rose-400 hover:text-rose-300 p-1 transition"
                    title="Delete PDF"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* PDF Modal Reader */}
      {activePdfUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="flex flex-col h-[90vh] w-full max-w-5xl rounded-xl border border-slate-800 bg-[#090d13] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between bg-[#0d141f] px-4 py-3 border-b border-slate-800">
              <div className="flex items-center gap-2 overflow-hidden">
                <FileText className="h-4 w-4 text-emerald-400 shrink-0" />
                <h3 className="text-sm font-bold text-slate-200 truncate">{activePdfName}</h3>
              </div>
              <button
                onClick={() => {
                  URL.revokeObjectURL(activePdfUrl);
                  setActivePdfUrl(null);
                }}
                className="text-slate-400 hover:text-slate-100 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 bg-slate-900">
              <iframe
                src={activePdfUrl}
                className="w-full h-full border-none"
                title={activePdfName}
              />
            </div>
          </div>
        </div>
      )}

      {/* Core CS Cheat-Sheets Section */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-teal-400" />
              <span>Core CS Interview Cheat-Sheets</span>
            </h2>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">
              High-yield revision summaries for campus interviews and semester tests
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search concepts (e.g. ACID, Deadlock)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="field text-xs pl-8 py-1.5"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {filteredTopics.map((t) => (
            <details
              key={t.name}
              className="panel group transition-all"
              open
            >
              <summary className="cursor-pointer font-bold text-sm text-slate-100 flex items-center justify-between select-none">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span>{t.name}</span>
                </span>
                <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                  {t.category}
                </span>
              </summary>
              <ul className="mt-3 space-y-2 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
                {t.points.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
};
