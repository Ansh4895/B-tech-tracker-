import React, { useState } from 'react';
import { useLocal, CalendarEvent, defaultCalendarEvents, uid } from '@/src/lib/store';
import { Calendar, Plus, Trash2, Clock, Tag } from 'lucide-react';

export const CalendarPanel: React.FC = () => {
  const [events, setEvents] = useLocal<CalendarEvent[]>('calendarEvents', defaultCalendarEvents);
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10));
  const [time, setTime] = useState('10:00 AM');
  const [type, setType] = useState<CalendarEvent['type']>('exam');
  const [subject, setSubject] = useState('');

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;
    const newEvent: CalendarEvent = {
      id: uid(),
      title: title.trim(),
      date,
      time: time.trim() || undefined,
      type,
      subject: subject.trim() || undefined,
    };
    setEvents((prev) => [...prev, newEvent].sort((a, b) => a.date.localeCompare(b.date)));
    setTitle('');
    setSubject('');
    setIsAdding(false);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  // Sorted events
  const sortedEvents = [...events].sort((a, b) => a.date.localeCompare(b.date));

  const getDaysDiff = (targetDateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDateStr);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return `${Math.abs(diffDays)}d ago`;
    return `In ${diffDays} days`;
  };

  const getTypeBadge = (eventType: CalendarEvent['type']) => {
    switch (eventType) {
      case 'exam':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'assignment':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'hackathon':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'contest':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-700';
    }
  };

  return (
    <section className="panel space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-emerald-400" />
          <span className="eyebrow">Academic Schedule & Deadlines</span>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="btn-ghost text-xs px-2.5 py-1 flex items-center gap-1 text-emerald-400 border-emerald-500/30"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{isAdding ? 'Cancel' : 'Add Event'}</span>
        </button>
      </div>

      {/* Add Event Form */}
      {isAdding && (
        <form
          onSubmit={handleAddEvent}
          className="rounded-lg border border-slate-800 bg-[#090d13] p-3.5 space-y-3"
        >
          <p className="text-xs font-semibold text-slate-200">New Schedule Item</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <label className="text-[11px] text-muted-foreground">Title</label>
              <input
                type="text"
                className="field text-xs mt-1"
                placeholder="e.g. End-Sem Exam: Operating Systems"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground">Type</label>
              <select
                className="field text-xs mt-1"
                value={type}
                onChange={(e) => setType(e.target.value as any)}
              >
                <option value="exam">Exam</option>
                <option value="assignment">Assignment / Project</option>
                <option value="contest">Coding Contest</option>
                <option value="hackathon">Hackathon</option>
                <option value="lecture">Important Lecture / Viva</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground">Date</label>
              <input
                type="date"
                className="field text-xs mt-1"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground">Time (optional)</label>
              <input
                type="text"
                className="field text-xs mt-1"
                placeholder="e.g. 10:30 AM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="btn-ghost text-xs py-1"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary text-xs py-1">
              Save Event
            </button>
          </div>
        </form>
      )}

      {/* Events List */}
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {sortedEvents.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-800 p-6 text-center text-xs text-muted-foreground">
            No upcoming events scheduled. Click 'Add Event' above!
          </div>
        ) : (
          sortedEvents.map((ev) => {
            const badgeClass = getTypeBadge(ev.type);
            const countdown = getDaysDiff(ev.date);

            return (
              <div
                key={ev.id}
                className="group flex items-start justify-between gap-3 rounded-lg border border-slate-800 bg-[#0d141f] p-3 transition hover:border-slate-700"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded border font-semibold ${badgeClass}`}
                    >
                      {ev.type}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 font-medium">
                      {countdown}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-200">{ev.title}</h4>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-500" />
                      {ev.date} {ev.time && `· ${ev.time}`}
                    </span>
                    {ev.subject && (
                      <span className="flex items-center gap-1">
                        <Tag className="h-3 w-3 text-slate-500" />
                        {ev.subject}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteEvent(ev.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition p-1 shrink-0"
                  title="Remove event"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
