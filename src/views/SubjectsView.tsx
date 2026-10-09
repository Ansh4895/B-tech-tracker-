import React, { useState } from 'react';
import { useLocal } from '@/src/lib/store';
import { initialSemesterSubjects, Subject } from '@/src/lib/data';
import { BookOpen, CheckCircle, ChevronDown, ChevronUp, UserCheck, AlertCircle, Plus, ExternalLink } from 'lucide-react';

export const SubjectsView: React.FC = () => {
  const [selectedSem, setSelectedSem] = useState<number>(3);
  const [allSubjects, setAllSubjects] = useLocal<Record<number, Subject[]>>(
    'semesterSubjects',
    initialSemesterSubjects
  );
  const [expandedCode, setExpandedCode] = useState<string | null>('CS-301');
  const [completedUnits, setCompletedUnits] = useLocal<Record<string, boolean>>('completedUnits', {});

  const currentSubjects = allSubjects[selectedSem] || [];

  const updateAttendance = (code: string, deltaAttended: number, deltaTotal: number) => {
    setAllSubjects((prev) => {
      const list = prev[selectedSem] || [];
      const updatedList = list.map((subj) => {
        if (subj.code === code) {
          const newAttended = Math.max(0, subj.attendedLectures + deltaAttended);
          const newTotal = Math.max(newAttended, subj.totalLectures + deltaTotal);
          return {
            ...subj,
            attendedLectures: newAttended,
            totalLectures: newTotal,
          };
        }
        return subj;
      });
      return {
        ...prev,
        [selectedSem]: updatedList,
      };
    });
  };

  const toggleUnit = (unitKey: string) => {
    setCompletedUnits((prev) => ({
      ...prev,
      [unitKey]: !prev[unitKey],
    }));
  };

  // Overall attendance for selected semester
  const totalAttended = currentSubjects.reduce((acc, s) => acc + s.attendedLectures, 0);
  const totalConducted = currentSubjects.reduce((acc, s) => acc + s.totalLectures, 0);
  const overallPct = totalConducted > 0 ? Math.round((totalAttended / totalConducted) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="panel">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Academic Curriculum & Attendance</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
              Semester Subjects Tracker
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Track course syllabus units, lecture attendance (75% mandate), and curriculum mastery.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#090d13] border border-slate-800 p-2.5 rounded-xl">
            <div className="text-right">
              <p className="text-[10px] font-mono text-muted-foreground uppercase">
                Sem {selectedSem} Attendance
              </p>
              <p
                className={`text-lg font-mono font-bold ${
                  overallPct >= 75
                    ? 'text-emerald-400'
                    : overallPct >= 65
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                {overallPct}% ({totalAttended}/{totalConducted})
              </p>
            </div>
            <div className="h-8 w-8 rounded-lg bg-slate-800/80 flex items-center justify-center">
              <UserCheck className="h-4 w-4 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Semester selector tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-5 border-t border-slate-800/80 mt-4 pb-1">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
            <button
              key={sem}
              onClick={() => setSelectedSem(sem)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition shrink-0 ${
                selectedSem === sem
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              Semester {sem}
            </button>
          ))}
        </div>
      </section>

      {/* Subjects List */}
      <div className="space-y-4">
        {currentSubjects.length === 0 ? (
          <div className="panel text-center py-12 text-muted-foreground">
            No subjects listed for Semester {selectedSem}.
          </div>
        ) : (
          currentSubjects.map((subject) => {
            const isExpanded = expandedCode === subject.code;
            const attPct =
              subject.totalLectures > 0
                ? Math.round((subject.attendedLectures / subject.totalLectures) * 100)
                : 100;

            // Attendance calculations
            // To reach 75%: (attended + x) / (total + x) >= 0.75  =>  x = 3*total - 4*attended
            const neededFor75 = Math.max(0, Math.ceil(3 * subject.totalLectures - 4 * subject.attendedLectures));
            // Bunk buffer: attended / (total + b) >= 0.75  =>  b = floor(attended / 0.75 - total)
            const bunkBuffer =
              attPct >= 75
                ? Math.max(0, Math.floor(subject.attendedLectures / 0.75 - subject.totalLectures))
                : 0;

            const unitsDoneCount = subject.units.filter(
              (u) => completedUnits[`${subject.code}-${u}`]
            ).length;
            const unitsDonePct =
              subject.units.length > 0
                ? Math.round((unitsDoneCount / subject.units.length) * 100)
                : 0;

            return (
              <div
                key={subject.code}
                className="panel transition-all hover:border-slate-700 space-y-4"
              >
                {/* Subject Header */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {subject.code}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {subject.credits} Credits
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-100">{subject.name}</h3>
                    <p className="text-xs text-muted-foreground font-mono">
                      Syllabus progress: {unitsDoneCount}/{subject.units.length} Units ({unitsDonePct}%)
                    </p>
                  </div>

                  {/* Attendance Controls */}
                  <div className="flex flex-wrap items-center gap-3 bg-[#090d13] border border-slate-800 p-2.5 rounded-xl shrink-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-base font-mono font-bold ${
                            attPct >= 75
                              ? 'text-emerald-400'
                              : attPct >= 65
                              ? 'text-amber-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {attPct}%
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          ({subject.attendedLectures}/{subject.totalLectures})
                        </span>
                      </div>
                      <div className="text-[10px] font-mono mt-0.5">
                        {attPct >= 75 ? (
                          <span className="text-emerald-500">
                            🛡️ Safe! Can miss {bunkBuffer} {bunkBuffer === 1 ? 'class' : 'classes'}
                          </span>
                        ) : (
                          <span className="text-amber-400">
                            ⚠️ Attend next {neededFor75} classes to hit 75%
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 pl-2 border-l border-slate-800">
                      <button
                        onClick={() => updateAttendance(subject.code, 1, 1)}
                        className="px-2 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs rounded hover:bg-emerald-500/30 font-mono font-semibold transition"
                        title="Mark Present (+1)"
                      >
                        + Present
                      </button>
                      <button
                        onClick={() => updateAttendance(subject.code, 0, 1)}
                        className="px-2 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs rounded hover:bg-rose-500/30 font-mono font-semibold transition"
                        title="Mark Absent (+0 attended, +1 total)"
                      >
                        + Absent
                      </button>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                    style={{ width: `${unitsDonePct}%` }}
                  />
                </div>

                {/* Units expander toggle */}
                <div className="pt-1 flex items-center justify-between text-xs">
                  <button
                    onClick={() =>
                      setExpandedCode(isExpanded ? null : subject.code)
                    }
                    className="text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1 transition"
                  >
                    <span>{isExpanded ? 'Hide Syllabus Units' : `View ${subject.units.length} Syllabus Units`}</span>
                    {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>

                  <div className="flex items-center gap-2 text-slate-400">
                    {subject.resources.map((res, i) => (
                      <span key={i} className="text-[11px] text-muted-foreground flex items-center gap-1 font-mono">
                        📖 {res.title}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Syllabus Checklist */}
                {isExpanded && (
                  <div className="pt-3 border-t border-slate-800/80 space-y-2">
                    <p className="text-[11px] font-mono text-muted-foreground uppercase">
                      Curriculum Units Checklist
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {subject.units.map((unit, idx) => {
                        const unitKey = `${subject.code}-${unit}`;
                        const isDone = Boolean(completedUnits[unitKey]);
                        return (
                          <div
                            key={idx}
                            onClick={() => toggleUnit(unitKey)}
                            className={`flex items-start gap-2.5 p-2 rounded-lg border cursor-pointer select-none transition ${
                              isDone
                                ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-300'
                                : 'bg-[#090d13] border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isDone}
                              onChange={() => {}}
                              className="mt-0.5 accent-emerald-500 cursor-pointer"
                            />
                            <div className="text-xs">
                              <span className="font-mono text-emerald-400 font-semibold mr-1.5">
                                Unit {idx + 1}:
                              </span>
                              <span className={isDone ? 'line-through text-slate-500' : 'text-slate-200'}>
                                {unit}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
