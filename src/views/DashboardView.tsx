import React, { useState } from 'react';
import { useLocal, defaultProfile, mkChecks, type Profile, type Check } from '@/src/lib/store';
import { webDevTopics, dsaTopics } from '@/src/lib/data';
import { Checklist } from '@/src/components/Checklist';
import { CalendarPanel } from '@/src/components/CalendarPanel';
import { StudyTimer } from '@/src/components/StudyTimer';
import { CgpaCard } from '@/src/components/CgpaCard';
import { User, Sparkles, BookOpen, Code, Trophy, ChevronRight } from 'lucide-react';

function weekLabel() {
  const d = new Date();
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  return d.toISOString().slice(0, 10);
}

interface DashboardViewProps {
  onNavigate: (route: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const [profile, setProfile] = useLocal<Profile>('profile', defaultProfile);
  const [editing, setEditing] = useState(false);
  const week = weekLabel();
  const [goals, setGoals] = useLocal<Check[]>('goals-' + week, [
    { id: 'def-1', text: 'Solve 10 LeetCode Mediums on Two Pointers & Trees', done: true, category: 'DSA' },
    { id: 'def-2', text: 'Complete OS Process Synchronization unit & notes', done: false, category: 'Academics' },
    { id: 'def-3', text: 'Build React full-stack authentication module', done: false, category: 'Web Dev' },
    { id: 'def-4', text: 'Maintain 80%+ attendance in Semester 3 lectures', done: true, category: 'College' },
  ]);
  const [web] = useLocal<Check[]>('webdev', mkChecks(webDevTopics));
  const [dsa] = useLocal<Check[]>('dsa', mkChecks(dsaTopics));

  const pct = (c: Check[]) => (c.length ? Math.round((c.filter((x) => x.done).length / c.length) * 100) : 0);

  return (
    <div className="space-y-6">
      {/* Student Profile Banner */}
      <section className="panel relative overflow-hidden">
        <div className="absolute right-0 top-0 h-40 w-40 bg-emerald-500/5 blur-3xl pointer-events-none rounded-full" />
        
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
              <div className="h-full w-full bg-[#0b0f14] rounded-[10px] flex items-center justify-center">
                <span className="font-mono text-lg font-black text-emerald-400">
                  {profile.name.charAt(0)}
                </span>
              </div>
            </div>
            <div>
              <p className="eyebrow flex items-center gap-1.5">
                <span>Student Profile</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400 font-mono">Sem {profile.currentSem || 3}</span>
              </p>
              <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                Hi, {profile.name} 👋
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {profile.branch} · <span className="text-emerald-400 font-semibold">{profile.college}</span>
              </p>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 flex items-center gap-1.5 bg-slate-900/60 border border-slate-800/80 px-2.5 py-1 rounded-md w-fit">
                <span>🎯</span>
                <span className="font-medium">{profile.goal}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="btn-ghost text-xs"
              onClick={() => setEditing(!editing)}
            >
              {editing ? 'Close' : 'Edit profile'}
            </button>
            <button
              onClick={() => onNavigate('/planner')}
              className="btn-primary text-xs"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI Study Plan</span>
            </button>
          </div>
        </div>

        {/* Profile Edit Drawer */}
        {editing && (
          <div className="mt-5 pt-4 border-t border-slate-800/80 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-xs text-muted-foreground">
              Name
              <input
                className="field mt-1"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </label>
            <label className="text-xs text-muted-foreground">
              College
              <input
                className="field mt-1"
                value={profile.college}
                onChange={(e) => setProfile({ ...profile, college: e.target.value })}
              />
            </label>
            <label className="text-xs text-muted-foreground">
              Branch / Major
              <input
                className="field mt-1"
                value={profile.branch}
                onChange={(e) => setProfile({ ...profile, branch: e.target.value })}
              />
            </label>
            <label className="text-xs text-muted-foreground">
              Current Semester
              <input
                type="number"
                min="1"
                max="8"
                className="field mt-1"
                value={profile.currentSem || 3}
                onChange={(e) => setProfile({ ...profile, currentSem: parseInt(e.target.value) || 3 })}
              />
            </label>
            <label className="text-xs text-muted-foreground sm:col-span-2 lg:col-span-4">
              Career Target / Goal
              <input
                className="field mt-1"
                value={profile.goal}
                onChange={(e) => setProfile({ ...profile, goal: e.target.value })}
              />
            </label>
          </div>
        )}

        {/* Quick roadmap progress pills */}
        <div className="mt-5 pt-4 border-t border-slate-800/60 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div
            onClick={() => onNavigate('/skills')}
            className="rounded-lg bg-[#090d13] border border-slate-800/80 p-2.5 hover:border-slate-700 cursor-pointer transition flex items-center justify-between"
          >
            <div>
              <p className="text-[10px] text-muted-foreground font-mono">Web Dev</p>
              <p className="text-sm font-bold text-emerald-400 font-mono">{pct(web)}%</p>
            </div>
            <Code className="h-4 w-4 text-emerald-500/40" />
          </div>

          <div
            onClick={() => onNavigate('/skills')}
            className="rounded-lg bg-[#090d13] border border-slate-800/80 p-2.5 hover:border-slate-700 cursor-pointer transition flex items-center justify-between"
          >
            <div>
              <p className="text-[10px] text-muted-foreground font-mono">DSA Prep</p>
              <p className="text-sm font-bold text-teal-400 font-mono">{pct(dsa)}%</p>
            </div>
            <Trophy className="h-4 w-4 text-teal-500/40" />
          </div>

          <div
            onClick={() => onNavigate('/subjects')}
            className="rounded-lg bg-[#090d13] border border-slate-800/80 p-2.5 hover:border-slate-700 cursor-pointer transition flex items-center justify-between"
          >
            <div>
              <p className="text-[10px] text-muted-foreground font-mono">Sem 3 Subjects</p>
              <p className="text-sm font-bold text-cyan-400 font-mono">5 Courses</p>
            </div>
            <BookOpen className="h-4 w-4 text-cyan-500/40" />
          </div>

          <div
            onClick={() => onNavigate('/notes')}
            className="rounded-lg bg-[#090d13] border border-slate-800/80 p-2.5 hover:border-slate-700 cursor-pointer transition flex items-center justify-between"
          >
            <div>
              <p className="text-[10px] text-muted-foreground font-mono">Repository</p>
              <p className="text-sm font-bold text-slate-200 font-mono">PDF & Notes</p>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-500" />
          </div>
        </div>
      </section>

      {/* Timer & CGPA Tracker Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <StudyTimer />
        <CgpaCard />
      </div>

      {/* Weekly Goals & Schedule Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="panel">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2.5">
            <div>
              <p className="eyebrow">Sprint: Week of {week}</p>
              <h2 className="text-lg font-bold text-slate-100">Weekly Target Goals</h2>
            </div>
            <button
              onClick={() => onNavigate('/planner')}
              className="text-xs text-emerald-400 hover:underline font-mono flex items-center gap-1"
            >
              <Sparkles className="h-3 w-3" />
              <span>AI Plan</span>
            </button>
          </div>
          <Checklist
            items={goals}
            setItems={setGoals}
            placeholder="Add new weekly milestone (e.g. Tree Traversal problems)..."
          />
        </section>

        <CalendarPanel />
      </div>
    </div>
  );
};
