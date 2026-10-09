import React, { useState, useEffect } from 'react';
import { DashboardView } from '@/src/views/DashboardView';
import { SubjectsView } from '@/src/views/SubjectsView';
import { SkillsView } from '@/src/views/SkillsView';
import { PlannerView } from '@/src/views/PlannerView';
import { CodePlaygroundView } from '@/src/views/CodePlaygroundView';
import { NotesView } from '@/src/views/NotesView';
import { Terminal, ShieldCheck, Database, Heart } from 'lucide-react';

const NAV_ITEMS = [
  ['/', 'Dashboard'],
  ['/subjects', 'Subjects'],
  ['/skills', 'Skills & DSA'],
  ['/planner', 'AI Plan'],
  ['/code', 'Playground'],
  ['/notes', 'Notes'],
] as const;

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const hash = window.location.hash.replace(/^#/, '');
    if (hash && hash.startsWith('/')) return hash;
    return window.location.pathname || '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash && hash.startsWith('/')) {
        setCurrentPath(hash);
      } else {
        setCurrentPath(window.location.pathname || '/');
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigateTo = (path: string) => {
    setCurrentPath(path);
    window.location.hash = path;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderActiveView = () => {
    switch (currentPath) {
      case '/subjects':
        return <SubjectsView />;
      case '/skills':
        return <SkillsView />;
      case '/planner':
        return <PlannerView />;
      case '/code':
        return <CodePlaygroundView />;
      case '/notes':
        return <NotesView />;
      case '/':
      default:
        return <DashboardView onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f14] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#0b0f14]/90 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigateTo('/')}
              className="mr-3 flex items-center gap-2 font-mono font-bold text-emerald-400 hover:text-emerald-300 transition tracking-tight group"
            >
              <div className="h-6 w-6 rounded bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-xs group-hover:scale-105 transition">
                <Terminal className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              <span className="text-base font-extrabold text-emerald-400">~/btech</span>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center gap-1">
            {NAV_ITEMS.map(([to, label]) => {
              const isActive = currentPath === to;
              return (
                <button
                  key={to}
                  onClick={() => navigateTo(to)}
                  className={`rounded-md px-3 py-1.5 text-xs sm:text-sm transition font-medium cursor-pointer ${
                    isActive
                      ? 'bg-slate-800 text-emerald-400 font-semibold border border-emerald-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-8">
        {renderActiveView()}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#080c10] py-6 text-xs text-slate-500">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-2 font-mono">
            <span className="text-emerald-400 font-bold">~/btech</span>
            <span>—</span>
            <span>Engineering Journey Tracker</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <Database className="h-3 w-3 text-emerald-400" /> IndexedDB & LocalStorage Synced
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-teal-400" /> Server-side Gemini Engine
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
