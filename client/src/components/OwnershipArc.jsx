import React from 'react';

export default function OwnershipArc({ pct }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r={r} fill="none" stroke="#2E3349" strokeWidth="8" />
        <circle
          cx="44" cy="44" r={r} fill="none"
          stroke="#D4860B" strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 44 44)"
        />
        <text x="44" y="44" textAnchor="middle" dominantBaseline="middle"
          className="font-mono" fill="#F0A830" fontSize="14" fontWeight="bold"
          fontFamily="IBM Plex Mono, monospace">
          {pct}%
        </text>
      </svg>
      <span className="text-xs text-slate-500">Ownership available</span>
    </div>
  );
}
