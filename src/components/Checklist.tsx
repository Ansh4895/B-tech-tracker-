import React, { useState } from 'react';
import { Check, uid } from '@/src/lib/store';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';

interface ChecklistProps {
  items: Check[];
  setItems: (items: Check[] | ((prev: Check[]) => Check[])) => void;
  placeholder?: string;
  category?: string;
}

export const Checklist: React.FC<ChecklistProps> = ({
  items = [],
  setItems,
  placeholder = 'Add a new goal or task...',
  category,
}) => {
  const [newText, setNewText] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const filteredItems = items.filter((item) => {
    if (filter === 'pending') return !item.done;
    if (filter === 'completed') return item.done;
    return true;
  });

  const total = items.length;
  const completed = items.filter((x) => x.done).length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const addItem = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = newText.trim();
    if (!text) return;
    setItems((prev) => [
      ...prev,
      {
        id: uid(),
        text,
        done: false,
        category: category || 'General',
      },
    ]);
    setNewText('');
  };

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Completion Rate</span>
          <span className="font-mono font-bold text-emerald-400">
            {completed}/{total} ({pct}%)
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Input */}
      <form onSubmit={addItem} className="flex gap-2">
        <input
          type="text"
          className="field flex-1"
          placeholder={placeholder}
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
        />
        <button
          type="submit"
          className="btn-primary shrink-0"
          disabled={!newText.trim()}
          title="Add task"
        >
          <Plus className="h-4 w-4" />
          <span>Add</span>
        </button>
      </form>

      {/* Filter tabs */}
      {total > 0 && (
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 text-xs">
          <div className="flex gap-2">
            {(['all', 'pending', 'completed'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilter(mode)}
                className={`capitalize px-2 py-0.5 rounded transition ${
                  filter === mode
                    ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                    : 'text-muted-foreground hover:text-slate-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
          {completed > 0 && (
            <button
              onClick={() => setItems((prev) => prev.filter((x) => !x.done))}
              className="text-slate-400 hover:text-red-400 transition text-[11px]"
            >
              Clear completed
            </button>
          )}
        </div>
      )}

      {/* Items list */}
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {filteredItems.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-800 p-6 text-center text-xs text-muted-foreground">
            {total === 0 ? 'No tasks yet. Add one above!' : 'No tasks match current filter.'}
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`group flex items-start justify-between gap-3 rounded-lg border p-2.5 transition ${
                item.done
                  ? 'border-slate-800/60 bg-slate-900/40 text-slate-500'
                  : 'border-slate-800 bg-[#0d141f] text-slate-200 hover:border-slate-700'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                className="mt-0.5 text-slate-400 hover:text-emerald-400 transition shrink-0"
              >
                {item.done ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
              </button>
              <span
                className={`flex-1 text-xs leading-relaxed select-text ${
                  item.done ? 'line-through text-slate-500' : 'text-slate-200'
                }`}
              >
                {item.text}
              </span>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition shrink-0 p-0.5"
                title="Delete"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
