import React, { useState } from 'react';
import { languages, codeTemplates, CodeTemplate } from '@/src/lib/data';
import { Play, RotateCcw, Copy, Check, Terminal, Cpu, Clock, Code2, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const CodePlaygroundView: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState<'java' | 'cpp' | 'python' | 'javascript'>('java');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('two-sum');
  
  // Find current template
  const currTpl = codeTemplates.find((t) => t.id === selectedTemplate) || codeTemplates[0];

  const [code, setCode] = useState<string>(currTpl.starterCodes[selectedLang] || '');
  const [customInput, setCustomInput] = useState<string>('nums = [2, 7, 11, 15], target = 9');
  
  // Execution state
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [execStatus, setExecStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [execTime, setExecTime] = useState<number | null>(null);
  const [memoryUsage, setMemoryUsage] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const handleLanguageChange = (lang: 'java' | 'cpp' | 'python' | 'javascript') => {
    setSelectedLang(lang);
    if (currTpl && currTpl.starterCodes[lang]) {
      setCode(currTpl.starterCodes[lang]);
    }
  };

  const handleTemplateChange = (tplId: string) => {
    setSelectedTemplate(tplId);
    const found = codeTemplates.find((t) => t.id === tplId);
    if (found && found.starterCodes[selectedLang]) {
      setCode(found.starterCodes[selectedLang]);
    }
  };

  const handleResetCode = () => {
    if (currTpl && currTpl.starterCodes[selectedLang]) {
      setCode(currTpl.starterCodes[selectedLang]);
      setOutput(null);
      setExecStatus('idle');
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setExecStatus('idle');
    setOutput(null);

    try {
      const response = await fetch('/api/code/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: selectedLang,
          code,
          customInput,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setExecStatus('error');
        setOutput(data.error || 'Server execution failed');
      } else {
        setExecStatus(data.status === 'success' ? 'success' : 'error');
        setOutput(data.output);
        setExecTime(data.executionTimeMs || 15);
        setMemoryUsage(data.memoryUsageKb || 1400);
      }
    } catch (err: any) {
      setExecStatus('error');
      setOutput(err?.message || 'Network error connecting to runner');
    } finally {
      setIsRunning(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = code.split('\n').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <section className="panel">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow flex items-center gap-1.5">
              <Code2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Algorithmic Sandbox</span>
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
              Code Playground & Compiler
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Write, test, and execute Java, C++, Python, and JavaScript solutions with LeetCode templates.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="btn-primary text-xs px-4 py-2 flex items-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <Play className={`h-4 w-4 ${isRunning ? 'animate-spin' : 'fill-current'}`} />
              <span>{isRunning ? 'Compiling & Running...' : 'Run Code'}</span>
            </button>
          </div>
        </div>

        {/* Toolbar: Languages & Templates */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          {/* Languages Selector */}
          <div className="flex items-center gap-1.5 bg-[#090d13] p-1 rounded-lg border border-slate-800">
            {languages.map((l) => (
              <button
                key={l.id}
                onClick={() => handleLanguageChange(l.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-medium transition ${
                  selectedLang === l.id
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{l.icon}</span>
                <span>{l.name}</span>
              </button>
            ))}
          </div>

          {/* Template Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground font-mono">Template:</span>
            <select
              value={selectedTemplate}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="field text-xs py-1 font-mono cursor-pointer"
            >
              {codeTemplates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.difficulty})
                </option>
              ))}
            </select>
            <button
              onClick={handleResetCode}
              className="btn-ghost text-xs p-1.5"
              title="Reset template code"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Main Workspace Grid: Editor & Terminal */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Code Editor (7 cols) */}
        <div className="lg:col-span-7 flex flex-col rounded-xl border border-slate-800 bg-[#090d13] overflow-hidden shadow-2xl">
          {/* Editor Header */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-[#0d141f] px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="text-xs font-mono text-slate-400 ml-2">
                Solution.{selectedLang === 'java' ? 'java' : selectedLang === 'cpp' ? 'cpp' : selectedLang === 'python' ? 'py' : 'js'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-500">
                {lineCount} lines
              </span>
              <button
                onClick={copyCode}
                className="btn-ghost text-xs p-1 text-slate-400 hover:text-slate-200"
                title="Copy Code"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          {/* Textarea with Line Numbers */}
          <div className="relative flex flex-1 min-h-[420px] font-mono text-xs">
            {/* Line Numbers gutter */}
            <div className="select-none bg-[#090d13] border-r border-slate-800/80 px-2.5 py-3 text-right text-slate-600 font-mono text-[11px] leading-5 shrink-0">
              {Array.from({ length: lineCount }, (_, i) => (
                <div key={i + 1}>{i + 1}</div>
              ))}
            </div>

            {/* Code Input */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              className="w-full flex-1 resize-none bg-transparent p-3 text-slate-200 font-mono text-xs leading-5 outline-none whitespace-pre overflow-x-auto selection:bg-emerald-500/30"
              style={{ tabSize: 4 }}
            />
          </div>
        </div>

        {/* Right Panel: Problem Details & Terminal Output (5 cols) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col">
          {/* Problem Statement Card */}
          <div className="panel space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>{currTpl.title}</span>
                <span
                  className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded font-semibold ${
                    currTpl.difficulty === 'Easy'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : currTpl.difficulty === 'Medium'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-rose-500/20 text-rose-300'
                  }`}
                >
                  {currTpl.difficulty}
                </span>
              </h3>
              <span className="text-[10px] font-mono text-muted-foreground">
                {currTpl.category}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {currTpl.description}
            </p>
          </div>

          {/* Custom Input */}
          <div className="panel space-y-1.5">
            <label className="text-[11px] font-mono text-muted-foreground flex items-center justify-between">
              <span>Standard Input / Test Arguments</span>
              <span className="text-emerald-400 text-[10px]">stdin</span>
            </label>
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="field text-xs font-mono"
              placeholder="Custom input data..."
            />
          </div>

          {/* Terminal Console */}
          <div className="panel flex-1 flex flex-col rounded-xl border border-slate-800 bg-[#090d13] p-0 overflow-hidden min-h-[220px]">
            {/* Terminal Top bar */}
            <div className="flex items-center justify-between bg-[#0d141f] px-3 py-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-xs font-mono text-slate-300 font-semibold">
                  Execution Output
                </span>
              </div>

              {execStatus !== 'idle' && (
                <div className="flex items-center gap-3 text-[10px] font-mono">
                  {execTime !== null && (
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-500" /> {execTime}ms
                    </span>
                  )}
                  {memoryUsage !== null && (
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Cpu className="h-3 w-3 text-slate-500" /> {(memoryUsage / 1024).toFixed(1)}MB
                    </span>
                  )}
                  <span
                    className={`font-bold uppercase px-1.5 py-0.5 rounded ${
                      execStatus === 'success'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {execStatus}
                  </span>
                </div>
              )}
            </div>

            {/* Terminal Body */}
            <div className="p-3 font-mono text-xs text-slate-300 overflow-y-auto flex-1 whitespace-pre-wrap leading-relaxed select-text">
              {isRunning ? (
                <div className="flex items-center gap-2 text-emerald-400 animate-pulse">
                  <span>Executing {selectedLang.toUpperCase()} binary...</span>
                </div>
              ) : output ? (
                output
              ) : (
                <span className="text-slate-600">
                  Ready. Click 'Run Code' above to compile and execute against test constraints.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
