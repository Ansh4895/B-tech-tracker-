import { useState, useEffect } from 'react';

export function uid(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

export interface Profile {
  name: string;
  college: string;
  branch: string;
  goal: string;
  currentSem: number;
}

export const defaultProfile: Profile = {
  name: 'Ansh Tiwari',
  college: 'IET DAVV',
  branch: 'Computer Science & Engineering',
  goal: 'Software Engineer @ Top Product Firm & 9.0+ CGPA',
  currentSem: 3,
};

export interface Check {
  id: string;
  text: string;
  done: boolean;
  category?: string;
  dueDate?: string;
}

export function mkChecks(topics: string[]): Check[] {
  return topics.map((t, idx) => ({
    id: `check-${idx}-${t.slice(0, 10).replace(/\s+/g, '-').toLowerCase()}`,
    text: t,
    done: false,
  }));
}

export interface StudySession {
  id: string;
  subject: string;
  durationMinutes: number;
  timestamp: number;
  date: string; // YYYY-MM-DD
}

export interface SemGrade {
  sem: number;
  sgpa: number | null;
  credits: number;
  status: 'completed' | 'in-progress' | 'pending';
}

export const defaultSemGrades: SemGrade[] = [
  { sem: 1, sgpa: 8.55, credits: 21, status: 'completed' },
  { sem: 2, sgpa: 8.59, credits: 22, status: 'completed' },
  { sem: 3, sgpa: null, credits: 23, status: 'in-progress' },
  { sem: 4, sgpa: null, credits: 22, status: 'pending' },
  { sem: 5, sgpa: null, credits: 24, status: 'pending' },
  { sem: 6, sgpa: null, credits: 22, status: 'pending' },
  { sem: 7, sgpa: null, credits: 20, status: 'pending' },
  { sem: 8, sgpa: null, credits: 18, status: 'pending' },
];

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string;
  type: 'exam' | 'assignment' | 'hackathon' | 'contest' | 'lecture';
  subject?: string;
}

export const defaultCalendarEvents: CalendarEvent[] = [
  {
    id: 'ev-1',
    title: 'Mid-Sem Exam: Operating Systems',
    date: new Date(Date.now() + 86400000 * 5).toISOString().slice(0, 10),
    time: '10:00 AM',
    type: 'exam',
    subject: 'Operating Systems',
  },
  {
    id: 'ev-2',
    title: 'DSA Contest: Weekly 420',
    date: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10),
    time: '08:00 PM',
    type: 'contest',
    subject: 'LeetCode',
  },
  {
    id: 'ev-3',
    title: 'DBMS Project Milestone Submission',
    date: new Date(Date.now() + 86400000 * 9).toISOString().slice(0, 10),
    time: '11:59 PM',
    type: 'assignment',
    subject: 'Database Systems',
  },
  {
    id: 'ev-4',
    title: 'Smart India Hackathon College Round',
    date: new Date(Date.now() + 86400000 * 14).toISOString().slice(0, 10),
    time: '09:00 AM',
    type: 'hackathon',
  },
];

export function useLocal<T>(key: string, initialValue: T): [T, (val: T | ((prev: T) => T)) => void] {
  const prefixedKey = 'btech_' + key;

  const [state, setState] = useState<T>(() => {
    try {
      const item = localStorage.getItem(prefixedKey);
      return item ? JSON.parse(item) : initialValue;
    } catch (e) {
      console.warn(`Error reading localStorage key "${prefixedKey}":`, e);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(prefixedKey, JSON.stringify(state));
    } catch (e) {
      console.warn(`Error setting localStorage key "${prefixedKey}":`, e);
    }
  }, [prefixedKey, state]);

  return [state, setState];
}
