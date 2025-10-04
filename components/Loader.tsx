
import React from 'react';
import { DocumentMagnifyingGlassIcon } from './icons/DocumentMagnifyingGlassIcon';

export const Loader: React.FC = () => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10">
      <DocumentMagnifyingGlassIcon className="w-16 h-16 text-sky-500 animate-pulse-fast" />
      <p className="mt-4 text-lg font-semibold text-slate-600">Analyzing Resume...</p>
      <p className="text-sm text-slate-500">This may take a moment.</p>
    </div>
  );
};
