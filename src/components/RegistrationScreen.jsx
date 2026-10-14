import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WARDS_DATA, ALL_WARD_NUMBERS, TVK_WHISTLE_LOGO_URL } from '../data/singanallurData';

export const RegistrationScreen = () => {
  const { registerResident, setCurrentRole, t, lang } = useApp();

  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedWard, setSelectedWard] = useState('24');
  const [selectedArea, setSelectedArea] = useState('V.O.C Street');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd1, setShowPwd1] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Get areas for the selected ward
  const currentWardData = WARDS_DATA.find(w => w.ward === Number(selectedWard));
  const availableAreas = currentWardData 
    ? (lang === 'ta' ? currentWardData.areasTa : currentWardData.areasEn)
    : [];

  const handleWardChange = (newWard) => {
    setSelectedWard(newWard);
    const wardObj = WARDS_DATA.find(w => w.ward === Number(newWard));
    if (wardObj) {
      const areas = lang === 'ta' ? wardObj.areasTa : wardObj.areasEn;
      setSelectedArea(areas[0] || `Ward ${newWard}`);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg(t.passwordMismatch);
      return;
    }
    if (password.length < 4) {
      setErrorMsg(lang === 'ta' ? 'கடவுச்சொல் குறைந்தது 4 எழுத்துக்கள் இருக்க வேண்டும்.' : 'Password must be at least 4 characters.');
      return;
    }

    setErrorMsg('');
    registerResident({
      name: fullName,
      age,
      phone: phoneNumber,
      ward: selectedWard,
      area: selectedArea,
      address,
      password
    });
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 sm:py-8 max-w-[420px] mx-auto w-full">
      {/* Registration Card */}
      <div className="w-full bg-white rounded-3xl border border-amber-200/90 shadow-xl overflow-hidden relative">
        {/* Top Accent Strip: Yellow & Red */}
        <div className="h-1.5 w-full flex">
          <div className="h-full w-1/2 bg-[#FEF08A]"></div>
          <div className="h-full w-1/2 bg-[#EF4444]"></div>
        </div>

        <div className="p-5 sm:p-6">
          {/* Header & Logo */}
          <div className="flex flex-col items-center text-center mt-1 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#EF4444] to-[#DC2626] text-white flex items-center justify-center shadow-md shadow-red-500/20 mb-2 border-2 border-white p-2">
              <img
                src={TVK_WHISTLE_LOGO_URL}
                alt="Whistle Logo"
                className="w-full h-full object-contain filter brightness-0 invert"
              />
            </div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              TVK ERA
            </h2>
            <div className="inline-flex items-center gap-1.5 mt-1 px-3 py-0.5 rounded-full bg-[#FEF9C3] border border-[#FEF08A] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span className="text-[11px] font-semibold text-amber-900 tracking-wide">
                AC 121 - Coimbatore District
              </span>
            </div>
          </div>

          {/* Section Heading */}
          <div className="text-center mb-4">
            <h3 className="text-sm sm:text-base font-extrabold tracking-wider text-slate-800 uppercase">
              {t.regTitle}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed max-w-[300px] mx-auto">
              {t.regSubtitle}
            </p>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-4 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5] p-2.5 flex items-start gap-2 shadow-xs animate-fade-in">
              <span className="material-symbols-outlined text-[#DC2626] text-[18px] shrink-0 mt-0.5">
                error
              </span>
              <p className="text-xs font-medium text-[#B91C1C] leading-snug">
                {errorMsg}
              </p>
            </div>
          )}

          {/* Form */}
          <form className="space-y-3" onSubmit={handleRegister}>
            {/* Row: Full Name & Age */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-800 tracking-wide uppercase mb-1">
                  {t.fullNameLabel}
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-2.5 text-slate-400 pointer-events-none flex items-center">
                    <span className="material-symbols-outlined text-[17px]">person</span>
                  </span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={lang === 'ta' ? 'சம்பூரணியன்' : 'Sampooraniyan'}
                    className="w-full h-10 pl-8 pr-2.5 text-xs rounded-xl border border-amber-200/90 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#EF4444]/25 focus:border-[#EF4444] transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-800 tracking-wide uppercase mb-1">
                  {t.ageLabel}
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-2.5 text-slate-400 pointer-events-none flex items-center">
                    <span className="material-symbols-outlined text-[17px]">cake</span>
                  </span>
                  <input
                    type="number"
                    min="18"
                    max="110"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="28"
                    className="w-full h-10 pl-8 pr-2.5 text-xs rounded-xl border border-amber-200/90 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#EF4444]/25 focus:border-[#EF4444] transition-all font-medium"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-[11px] font-bold text-slate-800 tracking-wide uppercase mb-1">
                {t.phoneLabel}
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-2.5 text-slate-400 pointer-events-none flex items-center">
                  <span className="material-symbols-outlined text-[17px]">call</span>
                </span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 94431 23456"
                  className="w-full h-10 pl-8 pr-2.5 text-xs rounded-xl border border-amber-200/90 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#EF4444]/25 focus:border-[#EF4444] transition-all font-medium"
                  required
                />
              </div>
            </div>

            {/* Row: Ward Number & Area */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-800 tracking-wide uppercase mb-1">
                  {t.wardSelectLabel}
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-2.5 text-slate-400 pointer-events-none flex items-center">
                    <span className="material-symbols-outlined text-[17px]">domain</span>
                  </span>
                  <select
                    value={selectedWard}
                    onChange={(e) => handleWardChange(e.target.value)}
                    className="w-full h-10 pl-8 pr-6 text-xs rounded-xl border border-amber-200/90 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#EF4444]/25 focus:border-[#EF4444] transition-all font-medium appearance-none cursor-pointer"
                    required
                  >
                    {ALL_WARD_NUMBERS.map(w => (
                      <option key={w} value={w}>Ward {w}</option>
                    ))}
                  </select>
                  <span className="absolute right-2 text-slate-400 pointer-events-none">
                    <span className="material-symbols-outlined text-[16px]">expand_more</span>
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-800 tracking-wide uppercase mb-1">
                  {t.areaSelectLabel}
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-2.5 text-slate-400 pointer-events-none flex items-center">
                    <span className="material-symbols-outlined text-[17px]">location_on</span>
                  </span>
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="w-full h-10 pl-8 pr-6 text-xs rounded-xl border border-amber-200/90 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#EF4444]/25 focus:border-[#EF4444] transition-all font-medium appearance-none cursor-pointer truncate"
                    required
                  >
                    {availableAreas.map((a, i) => (
                      <option key={i} value={a}>{a}</option>
                    ))}
                  </select>
                  <span className="absolute right-2 text-slate-400 pointer-events-none">
                    <span className="material-symbols-outlined text-[16px]">expand_more</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Address (Door No / Street) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-800 tracking-wide uppercase mb-1">
                {t.addressLabel}
              </label>
              <div className="relative flex items-start">
                <span className="absolute left-2.5 top-2.5 text-slate-400 pointer-events-none flex items-center">
                  <span className="material-symbols-outlined text-[17px]">home</span>
                </span>
                <textarea
                  rows="2"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={t.addressPlaceholder}
                  className="w-full pl-8 pr-2.5 py-2 text-xs rounded-xl border border-amber-200/90 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#EF4444]/25 focus:border-[#EF4444] transition-all font-medium resize-none"
                  required
                ></textarea>
              </div>
            </div>

            {/* Row: Password & Confirm Password */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-800 tracking-wide uppercase mb-1">
                  {t.passwordLabel}
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-2.5 text-slate-400 pointer-events-none flex items-center">
                    <span className="material-symbols-outlined text-[17px]">lock</span>
                  </span>
                  <input
                    type={showPwd1 ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-10 pl-8 pr-7 text-xs rounded-xl border border-amber-200/90 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#EF4444]/25 focus:border-[#EF4444] transition-all font-medium"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd1(prev => !prev)}
                    className="absolute right-1.5 text-slate-400 hover:text-slate-600 p-1"
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {showPwd1 ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-800 tracking-wide uppercase mb-1">
                  {t.confirmPasswordLabel}
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-2.5 text-slate-400 pointer-events-none flex items-center">
                    <span className="material-symbols-outlined text-[17px]">check_circle</span>
                  </span>
                  <input
                    type={showPwd2 ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-10 pl-8 pr-7 text-xs rounded-xl border border-amber-200/90 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#EF4444]/25 focus:border-[#EF4444] transition-all font-medium"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd2(prev => !prev)}
                    className="absolute right-1.5 text-slate-400 hover:text-slate-600 p-1"
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {showPwd2 ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Primary Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-[#EF4444] hover:bg-[#DC2626] active:scale-[0.99] text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-md shadow-red-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>{t.registerBtn}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </form>

          {/* Back to Login */}
          <div className="mt-5 pt-3.5 border-t border-amber-200/80 flex flex-col items-center">
            <p className="text-xs text-slate-500 font-medium mb-2">
              {t.alreadyRegistered}
            </p>
            <button
              type="button"
              onClick={() => setCurrentRole('LOGIN')}
              className="w-full h-10 rounded-xl border-2 border-[#EF4444] bg-white text-[#EF4444] hover:bg-red-50 active:scale-[0.99] font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
            >
              <span className="material-symbols-outlined text-[17px]">login</span>
              <span>{t.backToLoginBtn}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
