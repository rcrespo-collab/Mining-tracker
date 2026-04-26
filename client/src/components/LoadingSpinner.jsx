import React from 'react';

export default function LoadingSpinner({ size = 'md' }) {
  const sz = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-10 h-10' : 'w-6 h-6';
  return (
    <div className={`${sz} border-2 border-[#2E3349] border-t-[#D4860B] rounded-full animate-spin`} />
  );
}

export function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center h-full">
      <LoadingSpinner size="lg" />
    </div>
  );
}
