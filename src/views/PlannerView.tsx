import React, { useState } from 'react';
import { useLocal, defaultProfile, Check, uid } from '@/src/lib/store';
import { Sparkles, Calendar, Clock, BookOpen, Target, ArrowRight, CheckCircle2, History, Copy, Check as CheckIcon } from 'lucide-react';

function weekLabel() {
  const d = new Date();
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  return d.toISOString().slice(0, 10);
}

interface PlanSession {
  timeSlot: string;
  title: string;
  type: string;
  task: string;
}

interface PlanDay {
  day: string;
  theme: string;
  sessions: PlanSession[];
}

interface StudyPlan {
  title: string;
  weeklyOverview: {
    strategy: string;
    totalHours: number;
    academicSplit: string;
  };
  dailySchedule: PlanDay[];
  milestones: string[];
  tips: string[];
  createdAt?: string;
}

export const PlannerView: React.FC = () => {
  const [profile] = useLocal('profile', defaultProfile);
  const week = weekLabel();
  const [weeklyGoals, setWeeklyGoals] = useLocal<Check[]>('goals-' + week, []);
  const [savedPlans, setSavedPlans] = useLocal<StudyPlan[]>('savedPlans', []);

  // Form states
  const [weeklyHours, setWeeklyHours] = useState(20);
  const [currentSem, setCurrentSem] = useState(profile.currentSem || 3);
  const [weakSubjects, setWeakSubjects] = useState('Operating Systems, Dynamic Programming');
  const [targetCgpa, setTargetCgpa] = useState('8.8');
  const [focusAreas, setFocusAreas] = useState<string[]>([
    'IET DAVV Semester Subjects',
    'Data Structures & Algorithms',
    'Full-Stack Web Development',
  ]);
  const [customNotes, setCustomNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<StudyPlan | null>(() => {
    return savedPlans.length > 0 ? savedPlans[0] : null;
  });
  const [appliedMilestones, setAppliedMilestones] = useState(false);

  const toggleFocusArea = (area: string) => {
    if (focusAreas.includes(area)) {
      setFocusAreas(focusAreas.filter((a) => a !== area));
    } else {
      setFocusAreas([...focusAreas, area]);
    }
  };

  const handleGeneratePlan = async () => {
    setLoading(true);
    setError(null);
    setAppliedMilestones(false);

    try {
      const response = await fetch('/api/planner/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weeklyHours,
          currentSem,
          branch: profile.branch,
          college: profile.college,
          goal: profile.goal,
          focusAreas,
          weakSubjects,
          targetCgpa,
          customNotes,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate study plan');
      }

      const planWithDate: StudyPlan = {
        ...data.plan,
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      };

      setCurrentPlan(planWithDate);
      setSavedPlans((prev) => [planWithDate, ...prev.slice(0, 4)]);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Could not connect to AI planner service.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyMilestones = () => {
    if (!currentPlan || !currentPlan.milestones) return;
    const newMilestoneChecks: Check[] = currentPlan.milestones.map((m) => ({
      id: uid(),
      text: m,
      done: false,
      category: 'AI Milestone',
    }));

    setWeeklyGoals((prev) => [...prev, ...newMilestoneChecks]);
    setAppliedMilestones(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <section className="panel">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI Study Planner</span>
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
              Personalized B.Tech Study Engine
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Balanced timetable harmonizing {profile.college} academic coursework, LeetCode DSA, and Web Development.
            </p>
          </div>

          {savedPlans.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-mono">
                {savedPlans.length} plans saved
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Plan Configuration Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form controls */}
        <section className="panel space-y-4 lg:col-span-1">
          <h2 className="text-base font-bold text-slate-100 border-b border-slate-800/80 pb-2 flex items-center gap-2">
            <span>Configure Schedule</span>
          </h2>

          <div className="space-y-3 text-xs">
            {/* Weekly Hours */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-muted-foreground font-semibold">Weekly Study Hours</label>
                <span className="font-mono text-emerald-400 font-bold">{weeklyHours} hrs/week</span>
              </div>
              <input
                type="range"
                min="10"
                max="45"
                step="2"
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(parseInt(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>10h (Light)</span>
                <span>25h (Ideal)</span>
                <span>45h (Sprint)</span>
              </div>
            </div>

            {/* Current Semester */}
            <div>
              <label className="text-muted-foreground font-semibold">Semester</label>
              <select
                className="field text-xs mt-1"
                value={currentSem}
                onChange={(e) => setCurrentSem(parseInt(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Focus areas */}
            <div>
              <label className="text-muted-foreground font-semibold block mb-1.5">
                Priority Balance Areas
              </label>
              <div className="space-y-1.5">
                {[
                  'IET DAVV Semester Subjects',
                  'Data Structures & Algorithms',
                  'Full-Stack Web Development',
                  'Competitive Programming',
                  'Core CS (OS, DBMS, Networks)',
                ].map((area) => (
                  <label
                    key={area}
                    className="flex items-center gap-2 text-slate-300 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={focusAreas.includes(area)}
                      onChange={() => toggleFocusArea(area)}
                      className="accent-emerald-500"
                    />
                    <span>{area}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Weak subjects */}
            <div>
              <label className="text-muted-foreground font-semibold">
                Weak Subjects / Topics Needing Extra Focus
              </label>
              <input
                type="text"
                className="field text-xs mt-1"
                placeholder="e.g. Operating Systems, Dynamic Programming"
                value={weakSubjects}
                onChange={(e) => setWeakSubjects(e.target.value)}
              />
            </div>

            {/* Target CGPA */}
            <div>
              <label className="text-muted-foreground font-semibold">Target CGPA Goal</label>
              <input
                type="text"
                className="field text-xs mt-1"
                placeholder="e.g. 8.8+"
                value={targetCgpa}
                onChange={(e) => setTargetCgpa(e.target.value)}
              />
            </div>

            {/* Custom context */}
            <div>
              <label className="text-muted-foreground font-semibold">
                Additional Constraints (Optional)
              </label>
              <textarea
                className="field text-xs mt-1 h-16 resize-none"
                placeholder="e.g. Free after 5 PM on weekdays, morning contest on Sunday..."
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
              />
            </div>

            <button
              onClick={handleGeneratePlan}
              disabled={loading}
              className="btn-primary w-full mt-2 py-2.5 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              <span>{loading ? 'Synthesizing with Gemini...' : 'Generate Custom Plan'}</span>
            </button>

            {error && (
              <p className="text-xs text-rose-400 bg-rose-500/10 p-2 rounded border border-rose-500/20">
                {error}
              </p>
            )}
          </div>
        </section>

        {/* Generated Plan Output */}
        <section className="space-y-4 lg:col-span-2">
          {!currentPlan ? (
            <div className="panel h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
              <Sparkles className="h-10 w-10 text-emerald-400/40 animate-pulse" />
              <h3 className="text-base font-bold text-slate-200">No Study Plan Generated Yet</h3>
              <p className="text-xs text-muted-foreground max-w-md">
                Configure your available weekly hours, semester priorities, and weak subjects on the left, then click "Generate Custom Plan" to get a daily structured schedule.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Plan Header */}
              <div className="panel bg-gradient-to-br from-emerald-950/20 to-teal-950/10 border-emerald-500/30">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="eyebrow">Gemini Active Strategy</span>
                    <h2 className="text-lg font-bold text-slate-100 mt-1">{currentPlan.title}</h2>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                      {currentPlan.weeklyOverview.strategy}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleApplyMilestones}
                      disabled={appliedMilestones}
                      className="btn-primary text-xs px-3 py-1.5"
                    >
                      {appliedMilestones ? (
                        <>
                          <CheckIcon className="h-3.5 w-3.5" />
                          <span>Applied to Goals!</span>
                        </>
                      ) : (
                        <>
                          <Target className="h-3.5 w-3.5" />
                          <span>Apply to Weekly Goals</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-4 text-xs font-mono">
                  <span className="text-emerald-400 font-semibold">
                    ⏱️ {currentPlan.weeklyOverview.totalHours} hrs Target
                  </span>
                  <span className="text-slate-400">
                    📊 {currentPlan.weeklyOverview.academicSplit}
                  </span>
                </div>
              </div>

              {/* Milestones Card */}
              {currentPlan.milestones && currentPlan.milestones.length > 0 && (
                <div className="panel space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <p className="eyebrow">Weekly Actionable Milestones</p>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {currentPlan.milestones.length} Key Deliverables
                    </span>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {currentPlan.milestones.map((m, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-slate-800 bg-[#090d13] p-2.5 flex items-start gap-2 text-xs"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-slate-200">{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 7-Day Timetable */}
              <div className="space-y-3">
                <p className="eyebrow px-1">Day-by-Day Execution Breakdown</p>
                <div className="grid gap-3">
                  {currentPlan.dailySchedule.map((daySchedule, dIdx) => (
                    <div
                      key={dIdx}
                      className="panel transition hover:border-slate-700 bg-[#0f1520] space-y-2"
                    >
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-emerald-400">
                            {daySchedule.day}
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="text-xs text-slate-300 font-medium">
                            {daySchedule.theme}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-muted-foreground">
                          {daySchedule.sessions.length} Sessions
                        </span>
                      </div>

                      <div className="grid gap-2 sm:grid-cols-2">
                        {daySchedule.sessions.map((sess, sIdx) => (
                          <div
                            key={sIdx}
                            className="rounded-lg border border-slate-800 bg-[#090d13] p-2 text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[10px] text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20">
                                {sess.timeSlot}
                              </span>
                              <span
                                className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded font-semibold ${
                                  sess.type === 'DSA'
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : sess.type === 'Web Dev'
                                    ? 'bg-cyan-500/20 text-cyan-300'
                                    : 'bg-amber-500/20 text-amber-300'
                                }`}
                              >
                                {sess.type}
                              </span>
                            </div>
                            <p className="font-semibold text-slate-200">{sess.title}</p>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                              {sess.task}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              {currentPlan.tips && currentPlan.tips.length > 0 && (
                <div className="panel border-slate-800 bg-[#090d13] p-4 space-y-2">
                  <p className="eyebrow">Engineering Mentor Guidance</p>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {currentPlan.tips.map((t, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
