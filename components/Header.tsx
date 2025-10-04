
import React from 'react';
import { DocumentMagnifyingGlassIcon } from './icons/DocumentMagnifyingGlassIcon';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center gap-3">
        <DocumentMagnifyingGlassIcon className="w-8 h-8 text-sky-600" />
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">AI Resume Screener</h1>
      </div>
    </header>
  );
};
