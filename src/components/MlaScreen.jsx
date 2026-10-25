import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WARDS_DATA, ALL_WARD_NUMBERS, MLA_INFO } from '../data/singanallurData';

export const MlaScreen = () => {
  const {
    complaints,
    officers,
    addOfficer,
    toggleOfficerStatus,
    showToast,
    lang
  } = useApp();

  // Active Tab: 'HOME' (Complaints Oversight) | 'OFFICERS' (Ward Coordinators Directory)
  const [activeTab, setActiveTab] = useState('HOME');

  // Active Complaint for separate detail page
  const [activeComplaintDetail, setActiveComplaintDetail] = useState(null);

  // Ward Filter: 'ALL' or specific ward number
  const [selectedWard, setSelectedWard] = useState('ALL');

  // Complaints Filter: 'ALL' | 'PENDING' | 'COMPLETED'
  const [compFilter, setCompFilter] = useState('ALL');

  // Add Officer Modal State
  const [isAddOfficerModalOpen, setIsAddOfficerModalOpen] = useState(false);
  const [officerName, setOfficerName] = useState('');
  const [officerLoginId, setOfficerLoginId] = useState('');
  const [officerWard, setOfficerWard] = useState('24');
  const [officerArea, setOfficerArea] = useState('');
  const [officerPhone, setOfficerPhone] = useState('');

  // Newly created officer credentials for copying/sending
  const [lastCreatedOfficer, setLastCreatedOfficer] = useState(null);

  // Ward-filtered complaints safely
  const safeComplaints = Array.isArray(complaints) ? complaints : [];
  const wardFilteredComplaints = safeComplaints.filter(c => {
    if (!c) return false;
    if (selectedWard === 'ALL') return true;
    return Number(c.ward) === Number(selectedWard);
  });

  const displayedComplaints = wardFilteredComplaints.filter(c => {
    if (!c) return false;
    if (compFilter === 'PENDING') return c.status !== 'COMPLETED';
    if (compFilter === 'COMPLETED') return c.status === 'COMPLETED';
    return true;
  });

  const totalGrievances = wardFilteredComplaints.length;
  const pendingGrievances = wardFilteredComplaints.filter(c => c && c.status !== 'COMPLETED').length;
  const resolvedGrievances = wardFilteredComplaints.filter(c => c && c.status === 'COMPLETED').length;

  // Ward-filtered officers
  const safeOfficers = Array.isArray(officers) ? officers : [];
  const wardFilteredOfficers = safeOfficers.filter(o => {
    if (!o) return false;
    if (selectedWard === 'ALL') return true;
    return Number(o.ward) === Number(selectedWard);
  });

  // Handle Add Officer
  const handleCreateOfficer = (e) => {
    e.preventDefault();
    if (!officerName.trim()) {
      showToast(lang === 'ta' ? 'அதிகாரி பெயரை உள்ளிடவும்.' : 'Please enter officer name', 'error');
      return;
    }

    const username = officerLoginId.trim() || `officer_w${officerWard}`;
    const password = 'password123';

    addOfficer({
      name: officerName,
      username,
      password,
      ward: officerWard,
      area: officerArea || `Ward ${officerWard} Central`,
      phone: officerPhone || '+91 98421 00000'
    });

    setLastCreatedOfficer({
      name: officerName,
      username,
      password,
      ward: officerWard,
      phone: officerPhone || '+91 98421 00000'
    });

    setOfficerName('');
    setOfficerLoginId('');
    setOfficerArea('');
    setOfficerPhone('');
    setIsAddOfficerModalOpen(false);

    showToast(
      lang === 'ta' 
        ? 'புதிய அதிகாரி கணக்கு உருவாக்கப்பட்டது!' 
        : 'New ward officer created successfully!', 
      'success'
    );
  };

  return (
    <div className="flex-1 flex flex-col max-w-[420px] mx-auto w-full select-none">
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-28 space-y-4">

        {/* ============================================================== */}
        {/* TOP WARD FILTER BOX (NO HERO/ACTIVE/KPI BOXES)                 */}
        {/* ============================================================== */}
        <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[17px] text-brand-red">filter_alt</span>
              <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                {lang === 'ta' ? 'தொகுதி வார்டு தேர்வு' : 'Select Ward'}
              </span>
            </div>
            <span className="text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-full">
              Singanallur AC 121
            </span>
          </div>

          <div className="relative">
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="w-full text-xs font-bold bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red shadow-2xs cursor-pointer"
            >
              <option value="ALL">
                {lang === 'ta' ? 'அனைத்து 20 வார்டுகள் (All 20 Wards)' : 'All 20 Wards (AC 121)'}
              </option>
              {ALL_WARD_NUMBERS.map(w => {
                const wardObj = WARDS_DATA.find(item => item.ward === w);
                const wardName = wardObj ? (lang === 'ta' ? wardObj.nameTa : wardObj.nameEn) : `Ward ${w}`;
                return (
                  <option key={w} value={w}>Ward {w} — {wardName}</option>
                );
              })}
            </select>
          </div>

          {/* Quick Status Sub-filters (All / Pending / Resolved) - Only on HOME Tab list view */}
          {activeTab === 'HOME' && !activeComplaintDetail && (
            <div className="flex items-center justify-between bg-slate-100 p-1 rounded-xl text-xs font-bold gap-1 pt-1">
              <button
                type="button"
                onClick={() => setCompFilter('ALL')}
                className={`flex-1 py-1.5 rounded-lg text-center transition cursor-pointer ${
                  compFilter === 'ALL'
                    ? 'bg-brand-red text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{lang === 'ta' ? 'அனைத்தும்' : 'ALL'}</span> ({totalGrievances})
              </button>
              <button
                type="button"
                onClick={() => setCompFilter('PENDING')}
                className={`flex-1 py-1.5 rounded-lg text-center transition cursor-pointer ${
                  compFilter === 'PENDING'
                    ? 'bg-brand-red text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{lang === 'ta' ? 'செயலில்' : 'PENDING'}</span> ({pendingGrievances})
              </button>
              <button
                type="button"
                onClick={() => setCompFilter('COMPLETED')}
                className={`flex-1 py-1.5 rounded-lg text-center transition cursor-pointer ${
                  compFilter === 'COMPLETED'
                    ? 'bg-brand-red text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{lang === 'ta' ? 'தீர்க்கப்பட்டவை' : 'RESOLVED'}</span> ({resolvedGrievances})
              </button>
            </div>
          )}
        </section>

        {/* Recently Created Officer Credentials Card (If any) */}
        {lastCreatedOfficer && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 space-y-2 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-emerald-700">key</span>
                <span>{lang === 'ta' ? 'உருவாக்கப்பட்ட அதிகாரி லாகின் விவரம்' : 'Officer Login Credentials'}</span>
              </span>
              <button
                type="button"
                onClick={() => setLastCreatedOfficer(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
            <div className="text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-emerald-200 space-y-1">
              <div><strong>Name:</strong> {lastCreatedOfficer.name} (Ward {lastCreatedOfficer.ward})</div>
              <div><strong>Login Username:</strong> <code className="bg-slate-100 px-1 py-0.5 rounded font-bold text-brand-red">{lastCreatedOfficer.username}</code></div>
              <div><strong>Password:</strong> <code className="bg-slate-100 px-1 py-0.5 rounded font-bold text-slate-900">{lastCreatedOfficer.password}</code></div>
            </div>
            <a
              href={`sms:${lastCreatedOfficer.phone.replace(/[^0-9+]/g, '')}?body=TVK ERA Ward Officer Login: Username: ${lastCreatedOfficer.username}, Password: ${lastCreatedOfficer.password}`}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition"
            >
              <span className="material-symbols-outlined text-[15px]">send</span>
              <span>{lang === 'ta' ? 'விவரங்களை அதிகாரிக்கு SMS செய்க' : 'Send Credentials via SMS'}</span>
            </a>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 1: HOME / COMPLAINTS OVERSIGHT (முகப்பு)                    */}
        {/* ============================================================== */}
        {activeTab === 'HOME' && (
          <div className="space-y-4 animate-fade-in">
            {/* If an individual complaint is opened, show DEDICATED SEPARATE DETAIL PAGE */}
            {activeComplaintDetail ? (
              <div className="space-y-4 animate-fade-in">
                {/* Back Button & Header */}
                <div className="flex items-center justify-between pb-1">
                  <button
                    type="button"
                    onClick={() => setActiveComplaintDetail(null)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold shadow-2xs active:scale-95 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px] text-brand-red">arrow_back</span>
                    <span>{lang === 'ta' ? 'பின்செல்க (Back)' : 'Back to Home'}</span>
                  </button>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-black text-slate-700">
                    #{activeComplaintDetail.id}
                  </span>
                </div>

                {/* 1. Person Details Card */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[17px] text-brand-red">person</span>
                      <span>{lang === 'ta' ? 'புகாரளித்த குடிமகன் விவரம்' : 'Resident Person Details'}</span>
                    </span>
                    <span className="text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-full">
                      Ward {activeComplaintDetail.ward}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-base font-black text-slate-900 leading-tight truncate">
                        {activeComplaintDetail.residentName}
                      </h3>
                      <p className="text-xs text-slate-600 font-medium flex items-center gap-1 mt-1">
                        <span className="material-symbols-outlined text-[15px] text-brand-red">location_on</span>
                        <span>{activeComplaintDetail.area}</span>
                      </p>
                      {activeComplaintDetail.userPhone && (
                        <p className="text-xs font-mono font-bold text-slate-800 mt-1">
                          {activeComplaintDetail.userPhone}
                        </p>
                      )}
                    </div>

                    {/* Direct Contact Buttons */}
                    {activeComplaintDetail.userPhone && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <a
                          href={`tel:${activeComplaintDetail.userPhone.replace(/[^0-9+]/g, '')}`}
                          className="w-10 h-10 rounded-xl bg-brand-red hover:bg-brand-redHover active:scale-95 text-white flex items-center justify-center shadow-md shadow-red-500/20 cursor-pointer"
                          title="Call Resident"
                        >
                          <span className="material-symbols-outlined text-[20px]">call</span>
                        </a>
                        <a
                          href={`sms:${activeComplaintDetail.userPhone.replace(/[^0-9+]/g, '')}`}
                          className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 flex items-center justify-center shadow-2xs active:scale-95 cursor-pointer"
                          title="Message Resident"
                        >
                          <span className="material-symbols-outlined text-[20px]">chat</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Complaint Details Card */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[17px] text-brand-red">description</span>
                      <span>{lang === 'ta' ? 'புகார் விவரம்' : 'Complaint Description'}</span>
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px] text-slate-400">schedule</span>
                      <span>{activeComplaintDetail.createdAt}</span>
                    </span>
                  </div>

                  {/* Complaint Text */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                    {activeComplaintDetail.description}
                  </div>

                  {/* Resident Attached Photo */}
                  {activeComplaintDetail.photoUrl && (
                    <div className="rounded-xl overflow-hidden border border-slate-200">
                      <div className="bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-700 border-b border-slate-200 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[15px] text-brand-red">image</span>
                        <span>{lang === 'ta' ? 'குடிமகன் இணைத்த பிரச்சனை புகைப்படம்' : 'Issue Photo Attached by Resident'}</span>
                      </div>
                      <img
                        src={activeComplaintDetail.photoUrl}
                        alt="Resident Issue"
                        className="w-full h-44 object-cover"
                      />
                    </div>
                  )}

                  {/* Resident Attached Voice Note */}
                  {activeComplaintDetail.hasAudio && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 text-brand-red border border-red-200 text-xs font-bold">
                      <span className="material-symbols-outlined text-[17px]">mic</span>
                      <span>{lang === 'ta' ? 'குடிமகன் குரல் பதிவு (Voice Note 0:14)' : 'Voice Note Attached (0:14)'}</span>
                    </div>
                  )}
                </div>

                {/* 3. Field Resolution Status & Officer Work Proof Photo */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[17px] text-emerald-600">task_alt</span>
                      <span>{lang === 'ta' ? 'கள தீர்வு நிலை (Field Resolution)' : 'Field Resolution Status'}</span>
                    </span>
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                        activeComplaintDetail.status === 'COMPLETED'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-900 border border-amber-200'
                      }`}
                    >
                      {activeComplaintDetail.status === 'COMPLETED'
                        ? (lang === 'ta' ? 'தீர்க்கப்பட்டது ✓' : 'Solved ✓')
                        : (lang === 'ta' ? 'செயலில் உள்ளது' : 'In Progress')}
                    </span>
                  </div>

                  {activeComplaintDetail.status === 'COMPLETED' ? (
                    <div className="space-y-3">
                      {activeComplaintDetail.actionTaken && (
                        <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 font-medium leading-relaxed">
                          <strong className="block text-emerald-900 font-bold mb-1">
                            {lang === 'ta' ? 'வார்டு அதிகாரி மேற்கொண்ட நடவடிக்கை:' : 'Action Taken by Ward Officer:'}
                          </strong>
                          {activeComplaintDetail.actionTaken}
                        </div>
                      )}

                      {/* Resolution Photo Uploaded by Ward Officer */}
                      {activeComplaintDetail.completionPhotoUrl ? (
                        <div className="rounded-xl overflow-hidden border border-emerald-300 shadow-xs">
                          <div className="bg-emerald-600 text-white px-3 py-1.5 text-[10px] font-bold flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-[15px]">verified</span>
                              <span>{lang === 'ta' ? 'தீர்வு புகைப்படம் (வார்டு செயலாளர் வழங்கியது)' : 'Resolution Photo (Ward Officer)'}</span>
                            </span>
                            <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded font-bold">Verified Work</span>
                          </div>
                          <img
                            src={activeComplaintDetail.completionPhotoUrl}
                            alt="Resolution Work Proof"
                            className="w-full h-44 object-cover"
                          />
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center text-xs text-emerald-800 font-semibold">
                          {lang === 'ta' ? 'களப்பணி முடிக்கப்பட்டு சரிபார்க்கப்பட்டது.' : 'Field resolution completed & verified.'}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
                      <div className="font-bold flex items-center gap-1.5 text-amber-900">
                        <span className="material-symbols-outlined text-[16px]">engineering</span>
                        <span>{lang === 'ta' ? 'களப்பணி செயலாக்கத்தில் உள்ளது' : 'Field Work In Progress'}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {lang === 'ta'
                          ? `வார்டு ${activeComplaintDetail.ward} கள அதிகாரிக்கு இப்பணி ஒதுக்கப்பட்டுள்ளது. பணி முடிந்ததும் தீர்வு புகைப்படம் இங்கு தானாகப் புதுப்பிக்கப்படும்.`
                          : `Assigned to Ward ${activeComplaintDetail.ward} field coordinator. Once resolved on ground, resolution photo will appear here.`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Complaint Feed Cards (Clean Spacious Layout matching Ward Officer) */
              <>
                <div className="space-y-1">
                  <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
                    {lang === 'ta' ? 'தொகுதி புகார்கள் கண்காணிப்பு' : 'Constituency Complaints Feed'}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    {selectedWard === 'ALL'
                      ? (lang === 'ta' ? 'அனைத்து 20 வார்டுகளின் நேரடி புகார்கள்' : 'Live grievances across all 20 wards')
                      : (lang === 'ta' ? `வார்டு ${selectedWard} நேரடி புகார்கள்` : `Live grievances in Ward ${selectedWard}`)}
                  </p>
                </div>

                <div className="space-y-3">
                  {displayedComplaints.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500 space-y-2">
                      <span className="material-symbols-outlined text-4xl text-amber-400">inventory_2</span>
                      <p className="text-xs font-bold">
                        {lang === 'ta' ? 'இப்பிரிவில் புகார்கள் எதுவும் இல்லை' : 'No grievances found in this filter'}
                      </p>
                    </div>
                  ) : (
                    displayedComplaints.map(comp => {
                      const isCompleted = comp.status === 'COMPLETED';

                      return (
                        <div
                          key={comp.id}
                          onClick={() => setActiveComplaintDetail(comp)}
                          className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:border-amber-300 hover:shadow-md transition-all cursor-pointer space-y-3"
                        >
                          {/* Top Row: Ward + Status Badge */}
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-[11px] font-bold text-amber-900">
                              <span>Ward {comp.ward}</span>
                            </span>

                            <span
                              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                                isCompleted
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-900 border border-amber-200'
                              }`}
                            >
                              {isCompleted ? (
                                <>
                                  <span className="material-symbols-outlined text-[14px] text-emerald-600">check_circle</span>
                                  <span>{lang === 'ta' ? 'தீர்க்கப்பட்டது ✓' : 'Solved ✓'}</span>
                                </>
                              ) : (
                                <>
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                  <span>{lang === 'ta' ? 'செயலில் உள்ளது' : 'In Progress'}</span>
                                </>
                              )}
                            </span>
                          </div>

                          {/* Middle: Resident Name & Area / Street */}
                          <div className="space-y-1">
                            <h3 className="font-black text-slate-900 text-base sm:text-lg tracking-tight leading-snug">
                              {comp.residentName}
                            </h3>
                            <div className="text-xs text-slate-600 flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[15px] text-brand-red shrink-0">location_on</span>
                              <span className="font-medium truncate">{comp.area}</span>
                            </div>
                          </div>

                          {/* Bottom Row: Date/Time + Complaint ID + Call to Action */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 text-slate-400 font-medium text-[11px]">
                              <span className="font-mono text-slate-600 font-bold bg-slate-100 px-1.5 py-0.5 rounded">
                                #{comp.id}
                              </span>
                              <span className="flex items-center gap-0.5">
                                <span className="material-symbols-outlined text-[13px]">schedule</span>
                                <span>{comp.createdAt || 'Recent'}</span>
                              </span>
                            </div>

                            <div className="text-xs font-bold text-brand-red flex items-center gap-0.5 hover:underline">
                              <span>{lang === 'ta' ? 'விவரம் பார்க்க' : 'View Details'}</span>
                              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: GRASSROOTS OFFICERS DIRECTORY                           */}
        {/* ============================================================== */}
        {activeTab === 'OFFICERS' && (
          <div className="space-y-3.5 animate-fade-in">
            {/* Header with "+ Add Officer" button */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
                  {lang === 'ta' ? 'வார்டு கள செயலாளர்கள்' : 'Ward Field Officers'}
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  {wardFilteredOfficers.length} {lang === 'ta' ? 'பொறுப்பாளர்கள்' : 'Assigned Coordinators'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddOfficerModalOpen(true)}
                className="px-3 py-2 rounded-xl bg-brand-red hover:bg-brand-redHover text-white text-xs font-bold shadow-md shadow-red-500/20 flex items-center gap-1 active:scale-95 transition cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">person_add</span>
                <span>{lang === 'ta' ? '+ புதிய அதிகாரி' : '+ Add Officer'}</span>
              </button>
            </div>

            {/* Officers List */}
            <div className="space-y-2.5">
              {wardFilteredOfficers.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 text-center border border-slate-200 text-slate-500">
                  <p className="text-xs font-bold">
                    {lang === 'ta' ? 'இவ்வார்டில் அதிகாரிகள் பதிவு செய்யப்படவில்லை' : 'No officers found for this ward'}
                  </p>
                </div>
              ) : (
                wardFilteredOfficers.map(off => (
                  <div
                    key={off.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center font-black text-amber-900 text-sm shrink-0">
                        {off.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">{off.name}</h4>
                          <span className="bg-amber-50 text-amber-900 text-[10px] font-bold px-2 py-0.2 rounded border border-amber-200 shrink-0">
                            Ward {off.ward}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{off.area}</p>
                        <span className="text-[10px] font-mono font-bold text-slate-700 block mt-0.5">{off.phone}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleOfficerStatus(off.id)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition ${
                          off.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {off.status}
                      </button>
                      <a
                        href={`tel:${off.phone.replace(/[^0-9+]/g, '')}`}
                        className="w-8 h-8 rounded-lg bg-brand-red text-white flex items-center justify-center shadow-xs hover:bg-brand-redHover transition cursor-pointer"
                        title="Call Officer"
                      >
                        <span className="material-symbols-outlined text-[16px]">call</span>
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>

      {/* ============================================================== */}
      {/* FIXED MLA BOTTOM NAVIGATION (2 TABS: HOME & OFFICERS)          */}
      {/* ============================================================== */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 shadow-lg select-none">
        <div className="flex items-center justify-around h-16 px-6 max-w-[420px] mx-auto">
          {/* 1. Home (Oversight) */}
          <button
            type="button"
            onClick={() => { setActiveTab('HOME'); setActiveComplaintDetail(null); }}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all relative cursor-pointer ${
              activeTab === 'HOME' ? 'text-brand-red font-bold' : 'text-slate-500 font-medium'
            }`}
          >
            <span className={`material-symbols-outlined text-2xl ${activeTab === 'HOME' ? 'fill' : ''}`}>
              home
            </span>
            <span className="text-[11px] tracking-tight mt-0.5">
              {lang === 'ta' ? 'முகப்பு (Home)' : 'Home'}
            </span>
            {pendingGrievances > 0 && (
              <span className="absolute top-2.5 right-10 bg-brand-red text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                {pendingGrievances}
              </span>
            )}
          </button>

          {/* 2. Officers */}
          <button
            type="button"
            onClick={() => { setActiveTab('OFFICERS'); setActiveComplaintDetail(null); }}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all cursor-pointer ${
              activeTab === 'OFFICERS' ? 'text-brand-red font-bold' : 'text-slate-500 font-medium'
            }`}
          >
            <span className={`material-symbols-outlined text-2xl ${activeTab === 'OFFICERS' ? 'fill' : ''}`}>
              shield_person
            </span>
            <span className="text-[11px] tracking-tight mt-0.5">
              {lang === 'ta' ? 'அதிகாரிகள்' : 'Officers'}
            </span>
          </button>
        </div>

        {/* Mobile Home Indicator */}
        <div className="pb-1.5 pt-0.5 flex justify-center bg-white">
          <div className="w-32 h-1 bg-slate-300 rounded-full"></div>
        </div>
      </nav>

      {/* ============================================================== */}
      {/* ADD OFFICER MODAL DIALOG                                       */}
      {/* ============================================================== */}
      {isAddOfficerModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-[380px] rounded-2xl border border-slate-200 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                  {lang === 'ta' ? 'புதிய வார்டு அதிகாரி சேர்க்க' : 'Onboard New Ward Officer'}
                </h3>
                <p className="text-[10px] text-slate-400">Creates login access for Ward Grassroots Officer</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddOfficerModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateOfficer} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {lang === 'ta' ? 'முழு பெயர் *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  placeholder="Officer Name"
                  className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 bg-white font-medium focus:border-brand-red outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {lang === 'ta' ? 'லாகின் பயனர் பெயர் (Username ID)' : 'Login Username ID'}
                </label>
                <input
                  type="text"
                  value={officerLoginId}
                  onChange={(e) => setOfficerLoginId(e.target.value)}
                  placeholder={`officer_w${officerWard}`}
                  className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 bg-white font-medium focus:border-brand-red outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Default password: <code className="font-bold text-slate-700">password123</code>
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {lang === 'ta' ? 'ஒதுக்கப்பட்ட வார்டு *' : 'Assigned Ward *'}
                </label>
                <select
                  value={officerWard}
                  onChange={(e) => setOfficerWard(e.target.value)}
                  className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 bg-white font-bold focus:border-brand-red outline-none"
                >
                  {ALL_WARD_NUMBERS.map(w => (
                    <option key={w} value={w}>Ward {w}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {lang === 'ta' ? 'பகுதி / செக்டர்' : 'Locality / Sector'}
                </label>
                <input
                  type="text"
                  value={officerArea}
                  onChange={(e) => setOfficerArea(e.target.value)}
                  placeholder={`Ward ${officerWard} Central`}
                  className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 bg-white font-medium focus:border-brand-red outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {lang === 'ta' ? 'தொலைபேசி எண்' : 'Phone Number'}
                </label>
                <input
                  type="tel"
                  value={officerPhone}
                  onChange={(e) => setOfficerPhone(e.target.value)}
                  placeholder="+91 98421 00000"
                  className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 bg-white font-medium focus:border-brand-red outline-none"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOfficerModalOpen(false)}
                  className="flex-1 h-10 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  {lang === 'ta' ? 'ரத்து' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-xl bg-brand-red hover:bg-brand-redHover text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  {lang === 'ta' ? 'உருவாக்குக' : 'Onboard Officer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
