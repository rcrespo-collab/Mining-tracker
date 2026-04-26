import React from 'react';
import { MineralTag } from './Badges';

const ALL_MINERALS = ['Gold', 'Silver', 'Copper', 'Lithium', 'Cobalt', 'Nickel', 'Iron Ore', 'Zinc', 'Uranium', 'Platinum', 'Manganese', 'Tin'];

export default function MineralSelect({ value = [], onChange, label = 'Minerals of Interest' }) {
  const toggle = (m) => {
    onChange(value.includes(m) ? value.filter(x => x !== m) : [...value, m]);
  };

  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex flex-wrap gap-2 p-3 bg-[#0F1117] border border-[#2E3349] rounded-lg min-h-[44px]">
        {ALL_MINERALS.map(m => (
          <button
            key={m}
            type="button"
            onClick={() => toggle(m)}
            className={`transition-all duration-100 text-xs px-2 py-0.5 rounded border font-medium ${
              value.includes(m)
                ? 'opacity-100 ring-1 ring-[#D4860B]'
                : 'opacity-40 hover:opacity-70'
            }`}
          >
            <MineralTag mineral={m} />
          </button>
        ))}
      </div>
    </div>
  );
}
