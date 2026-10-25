import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { TVK_WHISTLE_LOGO_URL } from '../data/singanallurData';

export const TopHeader = () => {
  const {
    lang,
    setLanguage,
    theme,
    toggleTheme,
    t
  } = useApp();

  const [currentTime, setCurrentTime] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours % 12 || 12}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="shrink-0 bg-white z-40 border-b border-amber-200/80 shadow-xs select-none">
      {/* 1. Mobile Native Status Bar */}
      <div className="px-5 pt-2 pb-1 flex items-center justify-between text-xs font-semibold text-slate-700 bg-white">
        <span>{currentTime}</span>
        <div className="flex items-center gap-1.5 text-slate-600">
          <span className="material-symbols-outlined text-[15px]">signal_cellular_4_bar</span>
          <span className="material-symbols-outlined text-[15px]">wifi</span>
          <span className="material-symbols-outlined text-[18px]">battery_full</span>
        </div>
      </div>

      {/* 2. TVK Dual Color Accent Bar (Yellow & Red) */}
      <div className="h-1.5 w-full flex">
        <div className="h-full w-1/2 bg-[#FEF08A]"></div>
        <div className="h-full w-1/2 bg-[#EF4444]"></div>
      </div>

      {/* 3. Main Header Bar */}
      <header className="px-4 py-2.5 bg-white flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Whistle Logo Red Box */}
          <div className="w-10 h-10 rounded-xl bg-[#EF4444] text-white flex items-center justify-center shadow-xs shrink-0 p-1.5">
            <img
              src={TVK_WHISTLE_LOGO_URL}
              alt="TVK Whistle Logo"
              className="w-full h-full object-contain brightness-0 invert"
            />
          </div>

          {/* Title and Constituency hierarchy */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-extrabold text-slate-900 tracking-tight leading-none">
                TVK ERA
              </h1>
              <span className="px-1.5 py-0.5 rounded bg-brand-yellowSoft text-[10px] font-bold text-amber-900 border border-brand-yellow">
                121
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 leading-tight mt-0.5 truncate">
              {t.headerSubtitle}
            </p>
          </div>
        </div>

        {/* Right side: Theme + Bilingual controls */}
        <div className="flex items-center gap-1.5 shrink-0">

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-amber-50 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">
              {theme === 'light' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Bilingual Switcher (Tamil / English) */}
          <div className="inline-flex p-0.5 rounded-lg bg-amber-100/70 border border-amber-200/80">
            <button
              type="button"
              onClick={() => setLanguage('ta')}
              className={`px-2 py-1 text-[11px] font-bold rounded-md transition-colors ${lang === 'ta' ? 'bg-[#EF4444] text-white shadow-2xs' : 'text-slate-700 hover:text-slate-900'}`}
            >
              தமிழ்
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 text-[11px] font-bold rounded-md transition-colors ${lang === 'en' ? 'bg-[#EF4444] text-white shadow-2xs' : 'text-slate-700 hover:text-slate-900'}`}
            >
              English
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};
