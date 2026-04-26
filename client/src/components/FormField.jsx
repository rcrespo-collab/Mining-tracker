import React from 'react';

export function FormField({ label, required, children, error }) {
  return (
    <div>
      <label className="label">
        {label}{required && <span className="text-[#D4860B] ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

export function Input({ label, required, error, ...props }) {
  return (
    <FormField label={label} required={required} error={error}>
      <input className="input" {...props} />
    </FormField>
  );
}

export function Textarea({ label, required, error, ...props }) {
  return (
    <FormField label={label} required={required} error={error}>
      <textarea className="input min-h-[80px] resize-y" {...props} />
    </FormField>
  );
}

export function Select({ label, required, error, children, ...props }) {
  return (
    <FormField label={label} required={required} error={error}>
      <select className="input cursor-pointer" {...props}>{children}</select>
    </FormField>
  );
}

export function Checkbox({ label, ...props }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" className="w-4 h-4 accent-[#D4860B]" {...props} />
      <span className="text-sm text-slate-300">{label}</span>
    </label>
  );
}

export function FormGrid({ children, cols = 2 }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-${cols} gap-4`}>
      {children}
    </div>
  );
}

export function FormSection({ title, children }) {
  return (
    <div className="space-y-4">
      {title && <h3 className="text-xs font-bold uppercase tracking-widest text-[#D4860B] border-b border-[#2E3349] pb-2">{title}</h3>}
      {children}
    </div>
  );
}
