import React, { useState } from 'react';
import { useLocal, SemGrade, defaultSemGrades } from '@/src/lib/store';
import { GraduationCap, TrendingUp, Edit2, Check, Sparkles, Target } from 'lucide-react';

export const CgpaCard: React.FC = () => {
  const [grades, setGrades] = useLocal<SemGrade[]>('semGrades', defaultSemGrades);
  const [targetCgpa, setTargetCgpa] = useLocal<number>('targetCgpa', 8.8);
  const [editingSem, setEditingSem] = useState<number | null>(null);
  const [tempSgpa, setTempSgpa] = useState<string>('');

  // Calculate Cumulative CGPA
  const completedGrades = grades.filter((g) => g.status === 'completed' && g.sgpa !== null);
  const totalEarnedQualityPoints = completedGrades.reduce(
    (acc, g) => acc + (g.sgpa || 0) * g.credits,
    0
  );
  const totalCompletedCredits = completedGrades.reduce((acc, g) => acc + g.credits, 0);

  const weightedCgpa =
    totalCompletedCredits > 0
      ? (totalEarnedQualityPoints / totalCompletedCredits).toFixed(2)
      : '0.00';

  const simpleAvg =
    completedGrades.length > 0
      ? (completedGrades.reduce((acc, g) => acc + (g.sgpa || 0), 0) / completedGrades.length).toFixed(2)
      : '0.00';

  const handleEditClick = (sem: SemGrade) => {
    setEditingSem(sem.sem);
    setTempSgpa(sem.sgpa !== null ? sem.sgpa.toString() : '');
  };

  const handleSaveSem = (semNum: number) => {
    const val = parseFloat(tempSgpa);
    const valid = !isNaN(val) && val >= 0 && val <= 10;

    setGrades((prev) =>
      prev.map((g) => {
        if (g.sem === semNum) {
          if (valid) {
            return {
              ...g,
              sgpa: Math.round(val * 100) / 100,
              status: 'completed',
            };
          } else {
            return {
              ...g,
              sgpa: null,
              status: g.sem === 3 ? 'in-progress' : 'pending',
            };
          }
        }
        return g;
      })
    );
    setEditingSem(null);
  };

  return (
    <section className="panel space-y-5">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-emerald-400" />
          <span className="eyebrow">Academic Records & CGPA</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
          <Target className="h-3.5 w-3.5 text-teal-400" />
          <span>Goal: </span>
          <input
            type="number"
            step="0.1"
            min="5"
            max="10"
            className="w-12 bg-[#090d13] border border-slate-800 rounded px-1 text-center text-emerald-400 font-bold outline-none"
            value={targetCgpa}
            onChange={(e) => setTargetCgpa(parseFloat(e.target.value) || 8.8)}
          />
        </div>
      </div>

      {/* Main Stats Header */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/20 to-teal-950/10 p-4">
          <p className="text-[11px] font-mono text-muted-foreground">Cumulative CGPA</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl font-extrabold font-mono text-emerald-400">
              {weightedCgpa}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ 10.0</span>
          </div>
          <p className="text-[11px] text-emerald-500/80 font-mono mt-1 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> Based on {completedGrades.length} completed semesters
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#090d13] p-4 flex flex-col justify-between">
          <div>
            <p className="text-[11px] font-mono text-muted-foreground">Credits Completed</p>
            <p className="text-2xl font-bold font-mono text-slate-200 mt-1">
              {totalCompletedCredits}{' '}
              <span className="text-xs text-muted-foreground font-normal">/ 170 Total</span>
            </p>
          </div>
          <div className="pt-2">
            <div className="flex justify-between text-[10px] text-muted-foreground font-mono mb-1">
              <span>Degree Progress</span>
              <span className="text-emerald-400">
                {Math.round((totalCompletedCredits / 170) * 100)}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                style={{ width: `${Math.round((totalCompletedCredits / 170) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Semester by Semester Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground font-mono px-1">
          <span>Semester-wise Breakdown</span>
          <span className="text-[11px]">Click any semester to edit</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {grades.map((g) => {
            const isEditing = editingSem === g.sem;
            const isCompleted = g.status === 'completed' && g.sgpa !== null;
            const isInProgress = g.status === 'in-progress';

            return (
              <div
                key={g.sem}
                onClick={() => !isEditing && handleEditClick(g)}
                className={`relative rounded-lg border p-2.5 transition cursor-pointer select-none ${
                  isCompleted
                    ? 'border-emerald-500/30 bg-emerald-950/10 hover:border-emerald-500/50'
                    : isInProgress
                    ? 'border-teal-500/40 bg-teal-950/20 hover:border-teal-500/60'
                    : 'border-slate-800/80 bg-[#090d13] opacity-60 hover:opacity-100 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-300">
                    Sem {g.sem}
                  </span>
                  <span
                    className={`text-[9px] uppercase font-mono px-1.5 py-0.2 rounded font-semibold ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : isInProgress
                        ? 'bg-teal-500/20 text-teal-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {g.status}
                  </span>
                </div>

                {isEditing ? (
                  <div
                    className="mt-2 flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      placeholder="SGPA"
                      value={tempSgpa}
                      onChange={(e) => setTempSgpa(e.target.value)}
                      className="w-16 bg-slate-900 border border-emerald-500 rounded px-1.5 py-0.5 text-xs text-emerald-300 font-mono outline-none"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveSem(g.sem)}
                      className="p-1 bg-emerald-500 text-slate-900 rounded hover:bg-emerald-400"
                    >
                      <Check className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="mt-2">
                    <div className="text-lg font-bold font-mono text-slate-100">
                      {isCompleted ? (
                        <span className="text-emerald-400">{g.sgpa?.toFixed(2)}</span>
                      ) : isInProgress ? (
                        <span className="text-teal-300 text-sm italic">In Progress</span>
                      ) : (
                        <span className="text-slate-500 text-sm">—</span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground font-mono">
                      {g.credits} Credits
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Projection Tip */}
      <div className="rounded-lg border border-slate-800 bg-[#090d13] p-3 text-xs text-slate-300 flex items-start gap-2.5">
        <Sparkles className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed text-slate-400">
          <strong className="text-slate-200">Pro Tip:</strong> To graduate with your target CGPA of{' '}
          <span className="text-emerald-400 font-semibold">{targetCgpa}</span>, you need to maintain
          an average SGPA of{' '}
          <span className="text-emerald-400 font-semibold font-mono">
            {Math.max(
              0,
              (targetCgpa * 170 - totalEarnedQualityPoints) /
                Math.max(1, 170 - totalCompletedCredits)
            ).toFixed(2)}
          </span>{' '}
          in the remaining semesters.
        </p>
      </div>
    </section>
  );
};
