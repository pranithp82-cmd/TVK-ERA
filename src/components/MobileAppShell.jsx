import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TopHeader } from './TopHeader';
import { Toast } from './Toast';

export const MobileAppShell = ({ children }) => {
  const { currentRole, quickLogin, lang, setLanguage } = useApp();
  // View mode: 'mobile' (390-420px frame), 'tablet' (640px), 'full'
  const [viewMode, setViewMode] = useState('mobile');

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-start p-0 sm:py-6 sm:px-4 text-brand-textDark antialiased selection:bg-brand-red selection:text-white">
      {/* Top Floating Control Bar for Demo / Pair Programming */}
      <div className="w-full max-w-4xl mb-3 hidden sm:flex items-center justify-between px-4 py-2 bg-white/95 backdrop-blur-md rounded-2xl border border-amber-200/80 shadow-sm text-xs">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-slate-900 tracking-tight flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-red"></span>
            TVK ERA (Singanallur AC 121)
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-[11px] text-slate-500 font-medium">Role:</span>
          <div className="inline-flex gap-1">
            <button
              type="button"
              onClick={() => quickLogin('RESIDENT')}
              className={`px-2 py-0.5 rounded-lg font-bold text-[10px] transition cursor-pointer ${
                currentRole === 'RESIDENT'
                  ? 'bg-brand-red text-white shadow-2xs'
                  : 'bg-amber-50 text-slate-700 hover:bg-amber-100'
              }`}
            >
              Citizen
            </button>
            <button
              type="button"
              onClick={() => quickLogin('GRASSROOTS')}
              className={`px-2 py-0.5 rounded-lg font-bold text-[10px] transition cursor-pointer ${
                currentRole === 'GRASSROOTS'
                  ? 'bg-brand-red text-white shadow-2xs'
                  : 'bg-amber-50 text-slate-700 hover:bg-amber-100'
              }`}
            >
              Ward 24 Officer
            </button>
            <button
              type="button"
              onClick={() => quickLogin('MLA')}
              className={`px-2 py-0.5 rounded-lg font-bold text-[10px] transition cursor-pointer ${
                currentRole === 'MLA'
                  ? 'bg-brand-red text-white shadow-2xs'
                  : 'bg-amber-50 text-slate-700 hover:bg-amber-100'
              }`}
            >
              MLA Command
            </button>
          </div>
        </div>

        {/* Viewport Width Switcher */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-400 font-medium">Device:</span>
          <button
            type="button"
            onClick={() => setViewMode('mobile')}
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer transition ${
              viewMode === 'mobile' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Mobile (412px)
          </button>
          <button
            type="button"
            onClick={() => setViewMode('tablet')}
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer transition ${
              viewMode === 'tablet' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Tablet (600px)
          </button>
          <button
            type="button"
            onClick={() => setViewMode('full')}
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer transition ${
              viewMode === 'full' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Full Width
          </button>
        </div>
      </div>

      {/* Main Viewport Container */}
      <div
        className={`w-full transition-all duration-300 min-h-screen sm:min-h-[860px] sm:max-h-[920px] bg-brand-appBg flex flex-col justify-between shadow-2xl relative sm:rounded-[36px] overflow-hidden border border-amber-200/80 ${
          viewMode === 'mobile'
            ? 'max-w-[420px]'
            : viewMode === 'tablet'
            ? 'max-w-[620px]'
            : 'max-w-4xl'
        }`}
      >
        {/* Persistent App Header */}
        <TopHeader />

        {/* Screen Viewport */}
        <main className="flex-1 flex flex-col overflow-y-auto custom-scroll relative">
          {children}
        </main>

        {/* Global Toast Notification */}
        <Toast />
      </div>
    </div>
  );
};
