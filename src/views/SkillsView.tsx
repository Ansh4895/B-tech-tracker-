import React, { useState } from 'react';
import { useLocal, mkChecks, Check } from '@/src/lib/store';
import { webDevTopics, dsaTopics } from '@/src/lib/data';
import { Checklist } from '@/src/components/Checklist';
import { Code, Terminal, Trophy, Flame, CheckCircle, ExternalLink, Filter } from 'lucide-react';

interface LeetCodeStats {
  easy: number;
  medium: number;
  hard: number;
  targetTotal: number;
}

const defaultLeetCodeStats: LeetCodeStats = {
  easy: 45,
  medium: 52,
  hard: 11,
  targetTotal: 250,
};

export const SkillsView: React.FC = () => {
  const [activeTrack, setActiveTrack] = useState<'dsa' | 'webdev'>('dsa');
  const [dsaList, setDsaList] = useLocal<Check[]>('dsa', mkChecks(dsaTopics));
  const [webList, setWebList] = useLocal<Check[]>('webdev', mkChecks(webDevTopics));
  const [leetStats, setLeetStats] = useLocal<LeetCodeStats>('leetcodeStats', defaultLeetCodeStats);

  const totalLeetSolved = leetStats.easy + leetStats.medium + leetStats.hard;
  const leetPct = Math.min(100, Math.round((totalLeetSolved / leetStats.targetTotal) * 100));

  const updateCount = (type: 'easy' | 'medium' | 'hard', delta: number) => {
    setLeetStats((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta),
    }));
  };

  const dsaDone = dsaList.filter((x) => x.done).length;
  const dsaPct = Math.round((dsaDone / dsaList.length) * 100);

  const webDone = webList.filter((x) => x.done).length;
  const webPct = Math.round((webDone / webList.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="panel">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Career Mastery & Roadmaps</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
              Skills, DSA & Web Dev
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Structured preparation roadmaps for engineering placements, hackathons, and software engineering.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTrack('dsa')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
                activeTrack === 'dsa'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="h-3.5 w-3.5" />
              <span>DSA Roadmap ({dsaPct}%)</span>
            </button>
            <button
              onClick={() => setActiveTrack('webdev')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
                activeTrack === 'webdev'
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="h-3.5 w-3.5" />
              <span>Web Dev ({webPct}%)</span>
            </button>
          </div>
        </div>
      </section>

      {/* LeetCode Tracker Banner (shown prominently) */}
      <section className="panel space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <Trophy className="h-5 w-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold text-slate-100">LeetCode Progress Counter</h2>
              <p className="text-xs text-muted-foreground font-mono">
                Target: {leetStats.targetTotal} Problems · Solved: {totalLeetSolved} ({leetPct}%)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <span>Target Goal:</span>
            <input
              type="number"
              className="w-16 bg-[#090d13] border border-slate-800 rounded px-1.5 py-0.5 text-center text-emerald-400 font-bold outline-none"
              value={leetStats.targetTotal}
              onChange={(e) =>
                setLeetStats({ ...leetStats, targetTotal: parseInt(e.target.value) || 250 })
              }
            />
          </div>
        </div>

        {/* LeetCode difficulty counters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Easy */}
          <div className="rounded-xl border border-emerald-500/20 bg-[#090d13] p-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono font-bold text-emerald-400">Easy</p>
              <p className="text-2xl font-mono font-extrabold text-slate-100 mt-1">
                {leetStats.easy}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => updateCount('easy', -1)}
                className="h-7 w-7 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center justify-center font-mono"
              >
                -
              </button>
              <button
                onClick={() => updateCount('easy', 1)}
                className="h-7 w-7 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold flex items-center justify-center font-mono"
              >
                +
              </button>
            </div>
          </div>

          {/* Medium */}
          <div className="rounded-xl border border-amber-500/20 bg-[#090d13] p-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono font-bold text-amber-400">Medium</p>
              <p className="text-2xl font-mono font-extrabold text-slate-100 mt-1">
                {leetStats.medium}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => updateCount('medium', -1)}
                className="h-7 w-7 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center justify-center font-mono"
              >
                -
              </button>
              <button
                onClick={() => updateCount('medium', 1)}
                className="h-7 w-7 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold flex items-center justify-center font-mono"
              >
                +
              </button>
            </div>
          </div>

          {/* Hard */}
          <div className="rounded-xl border border-rose-500/20 bg-[#090d13] p-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono font-bold text-rose-400">Hard</p>
              <p className="text-2xl font-mono font-extrabold text-slate-100 mt-1">
                {leetStats.hard}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => updateCount('hard', -1)}
                className="h-7 w-7 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center justify-center font-mono"
              >
                -
              </button>
              <button
                onClick={() => updateCount('hard', 1)}
                className="h-7 w-7 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold flex items-center justify-center font-mono"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Big Progress bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono text-muted-foreground">
            <span>Progress towards placement target</span>
            <span className="text-emerald-400 font-bold">{leetPct}%</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full transition-all"
              style={{ width: `${(leetStats.easy / Math.max(1, totalLeetSolved)) * leetPct}%` }}
              title={`Easy: ${leetStats.easy}`}
            />
            <div
              className="bg-amber-500 h-full transition-all"
              style={{ width: `${(leetStats.medium / Math.max(1, totalLeetSolved)) * leetPct}%` }}
              title={`Medium: ${leetStats.medium}`}
            />
            <div
              className="bg-rose-500 h-full transition-all"
              style={{ width: `${(leetStats.hard / Math.max(1, totalLeetSolved)) * leetPct}%` }}
              title={`Hard: ${leetStats.hard}`}
            />
          </div>
        </div>
      </section>

      {/* Active Roadmap Checklist */}
      <section className="panel space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div>
            <p className="eyebrow">
              {activeTrack === 'dsa' ? 'Algorithms & Problem Solving' : 'Full-Stack Development'}
            </p>
            <h2 className="text-lg font-bold text-slate-100">
              {activeTrack === 'dsa' ? 'DSA Topic Checklist' : 'Web Dev Roadmap Checklist'}
            </h2>
          </div>

          <div className="text-xs font-mono text-muted-foreground">
            {activeTrack === 'dsa' ? `${dsaDone}/${dsaList.length} Done` : `${webDone}/${webList.length} Done`}
          </div>
        </div>

        {activeTrack === 'dsa' ? (
          <Checklist
            items={dsaList}
            setItems={setDsaList}
            placeholder="Add custom DSA topic (e.g. Disjoint Set Union)..."
          />
        ) : (
          <Checklist
            items={webList}
            setItems={setWebList}
            placeholder="Add custom Web Dev topic (e.g. Next.js App Router)..."
          />
        )}
      </section>
    </div>
  );
};
