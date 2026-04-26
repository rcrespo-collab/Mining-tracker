import React from 'react';

export default function FilterBar({ filters, values, onChange, onSearch, searchValue }) {
  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-[#1A1D27] border-b border-[#2E3349]">
      {onSearch !== undefined && (
        <input
          type="text"
          placeholder="Search..."
          value={searchValue || ''}
          onChange={e => onSearch(e.target.value)}
          className="input w-48 h-8 text-sm py-1"
        />
      )}
      {filters.map(f => (
        <select
          key={f.name}
          value={values[f.name] || ''}
          onChange={e => onChange(f.name, e.target.value)}
          className="input w-auto h-8 text-sm py-1 pr-6 cursor-pointer"
        >
          <option value="">{f.label}</option>
          {f.options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ))}
      {Object.values(values).some(Boolean) && (
        <button
          onClick={() => filters.forEach(f => onChange(f.name, ''))}
          className="text-xs text-[#D4860B] hover:text-[#F0A830] transition-colors"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
