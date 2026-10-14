import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TVK_WHISTLE_LOGO_URL } from '../data/singanallurData';

export const LoginScreen = () => {
  const { login, quickLogin, setCurrentRole, t, lang } = useApp();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg(t.invalidCredentials);
      return;
    }
    const result = login(username, password);
    if (!result.success) {
      setErrorMsg(result.message || t.invalidCredentials);
    } else {
      setErrorMsg('');
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 sm:py-10 max-w-[420px] mx-auto w-full">
      {/* Login Card */}
      <div className="w-full bg-white rounded-3xl border border-amber-200/90 shadow-xl overflow-hidden relative">
        {/* Top Accent Strip: Yellow & Red */}
        <div className="h-1.5 w-full flex">
          <div className="h-full w-1/2 bg-[#FEF08A]"></div>
          <div className="h-full w-1/2 bg-[#EF4444]"></div>
        </div>

        <div className="p-6 sm:p-7">
          {/* Card Header & Emblem */}
          <div className="flex flex-col items-center text-center">
            {/* 121 Emblem with Whistle Logo */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#EF4444] to-[#DC2626] text-white flex items-center justify-center shadow-md shadow-red-500/20 mb-3 border-2 border-white p-2">
              <img
                src={TVK_WHISTLE_LOGO_URL}
                alt="Whistle Logo"
                className="w-full h-full object-contain filter brightness-0 invert"
              />
            </div>

            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
              TVK ERA
            </h2>

            {/* AC 121 Pill */}
            <div className="inline-flex items-center gap-1.5 mt-1.5 px-3 py-1 rounded-full bg-[#FEF9C3] border border-[#FEF08A] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-amber-900 tracking-wide">
                AC 121 - Coimbatore District
              </span>
            </div>
          </div>

          {/* Section Title */}
          <div className="text-center my-4">
            <h3 className="text-base font-extrabold tracking-wider text-slate-800 uppercase">
              {t.loginTitle}
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-[280px] mx-auto">
              {t.loginSubtitle}
            </p>
          </div>

          {/* Quick Role Fill Shortcuts */}
          <div className="mb-4 p-2.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs">
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-900 mb-1.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-amber-600">bolt</span>
              <span>{t.quickDemoCredentials}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => quickLogin('RESIDENT')}
                className="p-1.5 rounded-xl bg-white border border-amber-200 hover:border-brand-red text-center font-bold text-[10px] text-slate-700 hover:text-brand-red shadow-2xs active:scale-95 transition-all"
              >
                👤 Citizen
              </button>
              <button
                type="button"
                onClick={() => quickLogin('GRASSROOTS')}
                className="p-1.5 rounded-xl bg-white border border-amber-200 hover:border-brand-red text-center font-bold text-[10px] text-slate-700 hover:text-brand-red shadow-2xs active:scale-95 transition-all"
              >
                🛡️ Officer
              </button>
              <button
                type="button"
                onClick={() => quickLogin('MLA')}
                className="p-1.5 rounded-xl bg-white border border-amber-200 hover:border-brand-red text-center font-bold text-[10px] text-slate-700 hover:text-brand-red shadow-2xs active:scale-95 transition-all"
              >
                🏛️ MLA
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-4 rounded-2xl bg-[#FEE2E2] border border-[#FCA5A5] p-3 flex items-start gap-2.5 shadow-xs animate-fade-in">
              <span className="material-symbols-outlined text-[#DC2626] text-[18px] shrink-0 mt-0.5">
                error
              </span>
              <p className="text-xs font-medium text-[#B91C1C] leading-snug">
                {errorMsg}
              </p>
            </div>
          )}

          {/* Form */}
          <form className="space-y-3.5" onSubmit={handleSubmit}>
            {/* Username / ID */}
            <div>
              <label className="block text-xs font-bold text-slate-800 tracking-wide uppercase mb-1.5">
                {t.usernameLabel}
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
                  <span className="material-symbols-outlined text-[20px]">person</span>
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t.usernamePlaceholder}
                  className="w-full h-11 pl-11 pr-4 text-xs sm:text-sm rounded-xl border border-amber-200/90 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#EF4444]/25 focus:border-[#EF4444] transition-all shadow-2xs font-medium"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-800 tracking-wide uppercase mb-1.5">
                {t.passwordLabel}
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.passwordPlaceholder}
                  className="w-full h-11 pl-11 pr-11 text-xs sm:text-sm rounded-xl border border-amber-200/90 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#EF4444]/25 focus:border-[#EF4444] transition-all shadow-2xs font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 text-slate-400 hover:text-slate-700 flex items-center p-1 rounded-md transition-colors"
                  aria-label="Toggle password visibility"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Login Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-[#EF4444] hover:bg-[#DC2626] active:scale-[0.99] text-white font-bold text-sm tracking-wider uppercase shadow-md shadow-red-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>{t.loginBtn}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </form>

          {/* Registration Prompt */}
          <div className="mt-6 pt-4 border-t border-amber-200/80 flex flex-col items-center">
            <p className="text-xs text-slate-500 font-medium mb-2.5">
              {t.newResidentQuestion}
            </p>
            <button
              type="button"
              onClick={() => setCurrentRole('REGISTER')}
              className="w-full h-11 rounded-xl border-2 border-[#EF4444] bg-white text-[#EF4444] hover:bg-red-50 active:scale-[0.99] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-2xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              <span>{t.newResidentBtn}</span>
            </button>

            {/* Quick helpline info footer */}
            <div className="mt-4 flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="material-symbols-outlined text-[14px]">help</span>
              <span>{t.helpdeskText}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
