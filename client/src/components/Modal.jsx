import React, { useEffect } from 'react';

export default function Modal({ open, onClose, title, children, maxWidth = 'max-w-2xl' }) {
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative z-10 w-full ${maxWidth} bg-[#1A1D27] border border-[#2E3349] rounded-2xl shadow-2xl flex flex-col max-h-[90vh]`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2E3349]">
          <h2 className="font-sora font-semibold text-white text-lg">{title}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors text-xl leading-none">&times;</button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );
}
