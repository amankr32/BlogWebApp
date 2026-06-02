import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow, format } from 'date-fns';

export const cn = (...inputs) => twMerge(clsx(inputs));

export const formatDate = (date) => {
  try { return format(new Date(date), 'MMM d, yyyy'); } catch { return ''; }
};

export const formatRelativeDate = (date) => {
  try { return formatDistanceToNow(new Date(date), { addSuffix: true }); } catch { return ''; }
};

export const formatNumber = (num) => {
  if (!num) return '0';
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000)     return `${(num / 1_000).toFixed(1)}K`;
  return String(num);
};

export const truncate = (str = '', n = 150) =>
  str.length > n ? str.slice(0, n - 1) + '…' : str;

export const getInitials = (name = '') =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

export const CATEGORIES = [
  'All', 'Technology', 'Programming', 'Design',
  'Career', 'Tutorial', 'Opinion', 'News', 'Other',
];

// Tailwind v4 — classes must be complete strings (no dynamic construction)
export const CATEGORY_STYLES = {
  Technology:  { dot: '#6366f1', label: 'bg-indigo-950/40 text-indigo-400 border-indigo-500/20' },
  Programming: { dot: '#22c55e', label: 'bg-green-950/40  text-green-400  border-green-500/20'  },
  Design:      { dot: '#a855f7', label: 'bg-purple-950/40 text-purple-400 border-purple-500/20' },
  Career:      { dot: '#f97316', label: 'bg-orange-950/40 text-orange-400 border-orange-500/20' },
  Tutorial:    { dot: '#06b6d4', label: 'bg-cyan-950/40   text-cyan-400   border-cyan-500/20'   },
  Opinion:     { dot: '#f43f5e', label: 'bg-rose-950/40   text-rose-400   border-rose-500/20'   },
  News:        { dot: '#eab308', label: 'bg-yellow-950/40 text-yellow-400 border-yellow-500/20' },
  Other:       { dot: '#71717a', label: 'bg-zinc-900      text-zinc-400   border-zinc-700'       },
};

export const getCategoryStyle = (cat) =>
  CATEGORY_STYLES[cat] || CATEGORY_STYLES.Other;

export const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Latest'      },
  { value: 'createdAt:asc',  label: 'Oldest'      },
  { value: 'views:desc',     label: 'Most Read'   },
];

export const TAG_SUGGESTIONS = [
  'javascript','typescript','react','nodejs','python',
  'css','webdev','devops','ai','tutorial','career','beginners',
];
