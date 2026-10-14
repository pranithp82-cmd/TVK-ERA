import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { TVK_WHISTLE_LOGO_URL } from '../data/singanallurData';

export const TopHeader = () => {
  const {
    lang,
    setLanguage,
    theme,
    toggleTheme,
    currentRole,
    currentUser,
    quickLogin,
    logout,
    t
  } = useApp();

  const [currentTime, setCurrentTime] = useState('9:41');
  const [showRoleMenu, setShowRoleMenu] = useState(false);

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

        {/* Right side: Role pill + Theme + Bilingual controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Role Indicator / Switcher Pill */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowRoleMenu(prev => !prev)}
              className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-slate-800 text-[10px] font-bold flex items-center gap-1 active:scale-95 transition-all shadow-2xs"
              title="Switch role view"
            >
              <span className="material-symbols-outlined text-[14px] text-brand-red">
                {currentRole === 'RESIDENT' ? 'person' : currentRole === 'GRASSROOTS' ? 'shield_person' : currentRole === 'MLA' ? 'account_balance' : 'login'}
              </span>
              <span className="max-w-[70px] truncate">
                {currentRole === 'RESIDENT' ? 'Citizen' : currentRole === 'GRASSROOTS' ? 'Officer' : currentRole === 'MLA' ? 'MLA' : 'Login'}
              </span>
              <span className="material-symbols-outlined text-[13px] text-slate-400">expand_more</span>
            </button>

            {/* Role Switcher Dropdown */}
            {showRoleMenu && (
              <div className="absolute right-0 top-full mt-1.5 w-60 bg-white rounded-2xl shadow-2xl border border-amber-200 p-2 z-50 animate-fade-in text-xs space-y-1">
                <div className="px-2 py-1 font-bold text-[10px] uppercase tracking-wider text-slate-400 border-b border-amber-100">
                  {lang === 'ta' ? 'பயனர் பாத்திரம் மாற்றுக' : 'Switch Role View'}
                </div>

                <button
                  type="button"
                  onClick={() => { quickLogin('RESIDENT'); setShowRoleMenu(false); }}
                  className={`w-full text-left px-2.5 py-2 rounded-xl flex items-center gap-2 font-bold transition-colors ${currentRole === 'RESIDENT' ? 'bg-red-50 text-brand-red' : 'hover:bg-amber-50 text-slate-700'}`}
                >
                  <span className="material-symbols-outlined text-[18px] text-brand-red">person</span>
                  <div>
                    <div className="text-xs">Citizen (சம்பூரணியன்)</div>
                    <div className="text-[10px] text-slate-400 font-normal">Ward 24 • Grievance Portal</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => { quickLogin('GRASSROOTS'); setShowRoleMenu(false); }}
                  className={`w-full text-left px-2.5 py-2 rounded-xl flex items-center gap-2 font-bold transition-colors ${currentRole === 'GRASSROOTS' ? 'bg-red-50 text-brand-red' : 'hover:bg-amber-50 text-slate-700'}`}
                >
                  <span className="material-symbols-outlined text-[18px] text-amber-600">shield_person</span>
                  <div>
                    <div className="text-xs">Ward 24 Officer (கார்த்திக்)</div>
                    <div className="text-[10px] text-slate-400 font-normal">Grassroots Operations Center</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => { quickLogin('MLA'); setShowRoleMenu(false); }}
                  className={`w-full text-left px-2.5 py-2 rounded-xl flex items-center gap-2 font-bold transition-colors ${currentRole === 'MLA' ? 'bg-red-50 text-brand-red' : 'hover:bg-amber-50 text-slate-700'}`}
                >
                  <span className="material-symbols-outlined text-[18px] text-emerald-600">account_balance</span>
                  <div>
                    <div className="text-xs">MLA Leadership (ஸ்ரீ கிரி)</div>
                    <div className="text-[10px] text-slate-400 font-normal">AC 121 Executive Command</div>
                  </div>
                </button>

                <div className="border-t border-amber-100 pt-1">
                  <button
                    type="button"
                    onClick={() => { logout(); setShowRoleMenu(false); }}
                    className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-slate-100 text-slate-600 flex items-center gap-2 font-medium"
                  >
                    <span className="material-symbols-outlined text-[16px]">logout</span>
                    <span>{t.logoutBtn} / Login Screen</span>
                  </button>
                </div>
              </div>
            )}
          </div>

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
