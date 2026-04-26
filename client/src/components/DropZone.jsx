import React, { useRef, useState } from 'react';

export default function DropZone({ onFile, accept, label = 'Drop file here or click to upload' }) {
  const inputRef = useRef();
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  };

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current.click()}
      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
        dragging
          ? 'border-[#D4860B] bg-[#D4860B]/10 text-[#F0A830]'
          : 'border-[#2E3349] bg-[#0F1117] text-slate-500 hover:border-[#D4860B]/50 hover:text-slate-400'
      }`}
    >
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={e => e.target.files[0] && onFile(e.target.files[0])} />
      <div className="text-3xl mb-2">⬆</div>
      <p className="text-sm">{label}</p>
      <p className="text-xs mt-1 text-slate-600">Max 50MB</p>
    </div>
  );
}
