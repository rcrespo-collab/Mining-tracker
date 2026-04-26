import React from 'react';

const STATUS_COLORS = {
  active:   'bg-green-900/50 text-green-300 border-green-800',
  inactive: 'bg-red-900/50 text-red-300 border-red-800',
  pending:  'bg-amber-900/50 text-amber-300 border-amber-800',
  open:     'bg-blue-900/50 text-blue-300 border-blue-800',
  sourcing: 'bg-sky-900/50 text-sky-300 border-sky-800',
  matched:  'bg-purple-900/50 text-purple-300 border-purple-800',
  closed:   'bg-slate-800 text-slate-400 border-slate-700',
  'on hold':'bg-yellow-900/50 text-yellow-300 border-yellow-800',
};

const STAGE_COLORS = {
  exploration: 'bg-indigo-900/50 text-indigo-300 border-indigo-800',
  development: 'bg-orange-900/50 text-orange-300 border-orange-800',
  producing:   'bg-green-900/50 text-green-300 border-green-800',
};

const MINERAL_COLORS = {
  Gold:       'bg-yellow-900/50 text-yellow-300 border-yellow-700',
  Silver:     'bg-slate-700/50 text-slate-200 border-slate-600',
  Copper:     'bg-orange-900/50 text-orange-300 border-orange-700',
  Lithium:    'bg-pink-900/50 text-pink-300 border-pink-700',
  Cobalt:     'bg-blue-900/50 text-blue-300 border-blue-700',
  Nickel:     'bg-teal-900/50 text-teal-300 border-teal-700',
  'Iron Ore': 'bg-red-900/50 text-red-300 border-red-700',
  Zinc:       'bg-cyan-900/50 text-cyan-300 border-cyan-700',
  Uranium:    'bg-lime-900/50 text-lime-300 border-lime-700',
  Platinum:   'bg-violet-900/50 text-violet-300 border-violet-700',
  Manganese:  'bg-fuchsia-900/50 text-fuchsia-300 border-fuchsia-700',
  Tin:        'bg-stone-700/50 text-stone-300 border-stone-600',
};

export function StatusBadge({ status }) {
  const cls = STATUS_COLORS[status] || 'bg-slate-800 text-slate-400 border-slate-700';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cls} capitalize`}>
      {status}
    </span>
  );
}

export function StageBadge({ stage }) {
  const cls = STAGE_COLORS[stage] || 'bg-slate-800 text-slate-400 border-slate-700';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cls} capitalize`}>
      {stage}
    </span>
  );
}

export function MineralTag({ mineral }) {
  const cls = MINERAL_COLORS[mineral] || 'bg-slate-800 text-slate-300 border-slate-600';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${cls}`}>
      {mineral}
    </span>
  );
}

export function JORCBadge({ hasJorc }) {
  if (!hasJorc) return null;
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border bg-amber-900/50 text-amber-300 border-amber-700">
      JORC
    </span>
  );
}
