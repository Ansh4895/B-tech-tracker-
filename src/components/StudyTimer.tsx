import React, { useState, useEffect, useRef } from 'react';
import { useLocal, StudySession, uid } from '@/src/lib/store';
import { Play, Pause, RotateCcw, Clock, Flame, Award, BarChart2 } from 'lucide-react';

const SUBJECT_OPTIONS = [
  'Data Structures & Algorithms',
  'Web Development (React & Node)',
  'Operating Systems',
  'Database Management Systems',
  'Computer Networks',
  'Discrete Mathematics',
  'Java / OOPs',
  'Competitive Programming',
];

export const StudyTimer: React.FC = () => {
  const [sessions, setSessions] = useLocal<StudySession[]>('studySessions', []);
  const [subject, setSubject] = useState(SUBJECT_OPTIONS[0]);
  const [customSubject, setCustomSubject] = useState('');
  const [mode, setMode] = useState<'pomodoro' | 'stopwatch'>('pomodoro');
  const [pomoDuration, setPomoDuration] = useState<number>(25); // minutes
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [elapsedStopwatch, setElapsedStopwatch] = useState<number>(0);
  const [showHistory, setShowHistory] = useState(false);

  const activeSubject = subject === 'Custom' ? (customSubject.trim() || 'General Study') : subject;

  // Interval reference
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer tick
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        if (mode === 'pomodoro') {
          setSecondsLeft((prev) => {
            if (prev <= 1) {
              clearInterval(timerRef.current as NodeJS.Timeout);
              setIsActive(false);
              handleCompleteSession(pomoDuration);
              return 0;
            }
            return prev - 1;
          });
        } else {
          setElapsedStopwatch((prev) => prev + 1);
        }
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, mode, pomoDuration]);

  // Handle pomodoro duration changes
  const switchPomoDuration = (mins: number) => {
    setIsActive(false);
    setPomoDuration(mins);
    setSecondsLeft(mins * 60);
  };

  const handleStartPause = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    if (mode === 'pomodoro') {
      setSecondsLeft(pomoDuration * 60);
    } else {
      if (elapsedStopwatch >= 60) {
        // Save session if at least 1 min
        handleCompleteSession(Math.round(elapsedStopwatch / 60));
      }
      setElapsedStopwatch(0);
    }
  };

  const handleCompleteSession = (durationMins: number) => {
    if (durationMins <= 0) return;
    const today = new Date().toISOString().slice(0, 10);
    const newSession: StudySession = {
      id: uid(),
      subject: activeSubject,
      durationMinutes: durationMins,
      timestamp: Date.now(),
      date: today,
    };
    setSessions((prev) => [newSession, ...prev]);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Weekly stats calculation
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayMinutes = sessions
    .filter((s) => s.date === todayStr)
    .reduce((acc, curr) => acc + curr.durationMinutes, 0);

  // Last 7 days chart
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const now = new Date();
  const past7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(now.getDate() - (6 - i));
    const dStr = d.toISOString().slice(0, 10);
    const dayName = daysOfWeek[d.getDay()];
    const totalMins = sessions
      .filter((s) => s.date === dStr)
      .reduce((acc, curr) => acc + curr.durationMinutes, 0);
    return { date: dStr, label: dayName, hours: (totalMins / 60).toFixed(1), mins: totalMins };
  });

  const weeklyTotalMins = past7Days.reduce((acc, d) => acc + d.mins, 0);
  const maxMins = Math.max(...past7Days.map((d) => d.mins), 60);

  return (
    <section className="panel space-y-5">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-emerald-400" />
          <span className="eyebrow">Focused Study Engine</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setIsActive(false);
              setMode('pomodoro');
              setSecondsLeft(pomoDuration * 60);
            }}
            className={`px-2.5 py-1 text-xs rounded transition font-mono ${
              mode === 'pomodoro'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold'
                : 'text-muted-foreground hover:text-slate-200'
            }`}
          >
            Pomodoro
          </button>
          <button
            onClick={() => {
              setIsActive(false);
              setMode('stopwatch');
              setElapsedStopwatch(0);
            }}
            className={`px-2.5 py-1 text-xs rounded transition font-mono ${
              mode === 'stopwatch'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold'
                : 'text-muted-foreground hover:text-slate-200'
            }`}
          >
            Stopwatch
          </button>
        </div>
      </div>

      {/* Subject Selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
          <span>Active Subject Focus</span>
          <span className="text-[11px] text-emerald-400 font-mono">
            {isActive ? '⚡ Session in progress' : 'Ready'}
          </span>
        </label>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="field text-sm cursor-pointer"
          disabled={isActive}
        >
          {SUBJECT_OPTIONS.map((opt) => (
            <option key={opt} value={opt} className="bg-slate-900 text-slate-200">
              {opt}
            </option>
          ))}
          <option value="Custom" className="bg-slate-900 text-slate-200">
            + Custom Subject...
          </option>
        </select>
        {subject === 'Custom' && (
          <input
            type="text"
            placeholder="Type subject name (e.g. Compiler Design)"
            value={customSubject}
            onChange={(e) => setCustomSubject(e.target.value)}
            className="field text-xs mt-1"
          />
        )}
      </div>

      {/* Main Timer Display */}
      <div className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-[#090d13] p-6 relative overflow-hidden">
        {isActive && (
          <div className="absolute inset-0 bg-emerald-500/5 animate-pulse pointer-events-none" />
        )}

        {mode === 'pomodoro' && (
          <div className="flex gap-2 mb-3">
            {[15, 25, 45, 60].map((m) => (
              <button
                key={m}
                onClick={() => switchPomoDuration(m)}
                disabled={isActive}
                className={`text-xs px-2.5 py-0.5 rounded font-mono transition ${
                  pomoDuration === m
                    ? 'bg-slate-800 text-emerald-400 font-bold border border-emerald-500/40'
                    : 'text-muted-foreground hover:text-slate-300'
                }`}
              >
                {m}m
              </button>
            ))}
          </div>
        )}

        {/* Big digits */}
        <div className="text-5xl sm:text-6xl font-extrabold font-mono tracking-tight text-slate-100 my-2 select-none">
          {mode === 'pomodoro' ? formatTime(secondsLeft) : formatTime(elapsedStopwatch)}
        </div>

        <p className="text-xs text-muted-foreground font-mono truncate max-w-[280px]">
          Target: <span className="text-emerald-400 font-semibold">{activeSubject}</span>
        </p>

        {/* Controls */}
        <div className="flex items-center gap-3 mt-5">
          <button
            onClick={handleStartPause}
            className="btn-primary px-5 py-2 text-sm font-semibold flex items-center gap-2"
          >
            {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
            <span>{isActive ? 'Pause' : 'Start Focus'}</span>
          </button>
          <button
            onClick={handleReset}
            className="btn-ghost px-3 py-2 text-xs flex items-center gap-1.5"
            title="Reset or Save"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{mode === 'stopwatch' && elapsedStopwatch > 60 ? 'Save & Reset' : 'Reset'}</span>
          </button>
        </div>
      </div>

      {/* Stats summary & Weekly bar chart */}
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg border border-slate-800/80 bg-slate-900/40 p-2">
            <p className="text-[10px] text-muted-foreground uppercase font-mono">Today</p>
            <p className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
              {(todayMinutes / 60).toFixed(1)} hrs
            </p>
          </div>
          <div className="rounded-lg border border-slate-800/80 bg-slate-900/40 p-2">
            <p className="text-[10px] text-muted-foreground uppercase font-mono">This Week</p>
            <p className="text-sm font-bold text-teal-400 font-mono mt-0.5">
              {(weeklyTotalMins / 60).toFixed(1)} hrs
            </p>
          </div>
          <div className="rounded-lg border border-slate-800/80 bg-slate-900/40 p-2">
            <p className="text-[10px] text-muted-foreground uppercase font-mono">Sessions</p>
            <p className="text-sm font-bold text-slate-200 font-mono mt-0.5">
              {sessions.length}
            </p>
          </div>
        </div>

        {/* 7-day mini chart */}
        <div className="rounded-lg border border-slate-800/80 bg-[#090d13] p-3">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
              <BarChart2 className="h-3.5 w-3.5 text-emerald-400" /> Past 7 Days Study Trend
            </span>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-[11px] text-emerald-400 hover:underline font-mono"
            >
              {showHistory ? 'Hide log' : 'View session log'}
            </button>
          </div>
          <div className="flex items-end justify-between gap-1.5 h-16 pt-2">
            {past7Days.map((d, idx) => {
              const heightPct = maxMins > 0 ? Math.min(100, Math.round((d.mins / maxMins) * 100)) : 0;
              const isToday = d.date === todayStr;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                  <div className="text-[9px] font-mono opacity-0 group-hover:opacity-100 text-emerald-300 transition-opacity whitespace-nowrap">
                    {d.hours}h
                  </div>
                  <div className="w-full bg-slate-800 rounded-t h-full max-h-12 flex items-end overflow-hidden">
                    <div
                      className={`w-full transition-all duration-300 rounded-t ${
                        isToday
                          ? 'bg-gradient-to-t from-emerald-600 to-emerald-400'
                          : 'bg-gradient-to-t from-teal-700 to-teal-500/80'
                      }`}
                      style={{ height: `${Math.max(heightPct, 6)}%` }}
                    />
                  </div>
                  <span className={`text-[10px] font-mono ${isToday ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Session history dropdown */}
        {showHistory && (
          <div className="rounded-lg border border-slate-800 bg-[#090d13] p-3 max-h-40 overflow-y-auto space-y-1.5">
            <p className="text-[11px] font-mono text-muted-foreground mb-1">Recent Study Records</p>
            {sessions.length === 0 ? (
              <p className="text-xs text-slate-500">No recorded sessions yet.</p>
            ) : (
              sessions.slice(0, 10).map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between text-xs py-1 border-b border-slate-800/40 text-slate-300"
                >
                  <span className="truncate max-w-[180px] font-medium">{s.subject}</span>
                  <div className="flex items-center gap-3 shrink-0 text-muted-foreground font-mono text-[11px]">
                    <span className="text-emerald-400">{s.durationMinutes} min</span>
                    <span>{s.date}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
};
