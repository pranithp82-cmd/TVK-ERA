import React from 'react';
import { useApp } from '../context/AppContext';

export const Toast = () => {
  const { toast } = useApp();

  if (!toast.visible) return null;

  return (
    <div className="fixed top-14 left-1/2 -translate-x-1/2 z-[10000] max-w-[360px] w-[90%] px-4 py-2.5 rounded-xl bg-slate-900/95 text-white text-xs font-semibold shadow-2xl flex items-center gap-2.5 border border-slate-700 backdrop-blur-md animate-fade-in">
      <span
        className={`material-symbols-outlined text-[20px] ${
          toast.type === 'error' ? 'text-brand-red' : 'text-brand-yellow'
        }`}
      >
        {toast.type === 'error' ? 'error' : 'check_circle'}
      </span>
      <span className="flex-1 leading-snug">{toast.message}</span>
    </div>
  );
};
