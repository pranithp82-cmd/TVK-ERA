import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WARDS_DATA, ALL_WARD_NUMBERS, MLA_INFO } from '../data/singanallurData';

export const MlaScreen = () => {
  const {
    currentUser,
    complaints,
    officers,
    residents,
    directives,
    addDirective,
    addOfficer,
    toggleOfficerStatus,
    showToast,
    t,
    lang
  } = useApp();

  // Active Section Tab: 'COMPLAINTS' | 'OFFICERS' | 'DIRECTIVES' | 'RESIDENTS'
  const [activeTab, setActiveTab] = useState('COMPLAINTS');

  // Ward Filter: 'ALL' or specific ward number
  const [selectedWard, setSelectedWard] = useState('ALL');

  // Complaints Filter: 'ALL' | 'PENDING' | 'COMPLETED'
  const [compFilter, setCompFilter] = useState('ALL');

  // Directives Form State
  const [directiveTitle, setDirectiveTitle] = useState('');
  const [directiveMessage, setDirectiveMessage] = useState('');
  const [directiveTargetWard, setDirectiveTargetWard] = useState('ALL');

  // Add Officer Modal State
  const [isAddOfficerModalOpen, setIsAddOfficerModalOpen] = useState(false);
  const [officerName, setOfficerName] = useState('');
  const [officerLoginId, setOfficerLoginId] = useState('');
  const [officerWard, setOfficerWard] = useState('24');
  const [officerArea, setOfficerArea] = useState('');
  const [officerPhone, setOfficerPhone] = useState('');

  // Resident search query
  const [residentSearchQuery, setResidentSearchQuery] = useState('');

  // Ward-filtered data
  const wardFilteredComplaints = complaints.filter(c => {
    if (selectedWard === 'ALL') return true;
    return Number(c.ward) === Number(selectedWard);
  });

  const displayedComplaints = wardFilteredComplaints.filter(c => {
    if (compFilter === 'PENDING') return c.status !== 'COMPLETED';
    if (compFilter === 'COMPLETED') return c.status === 'COMPLETED';
    return true;
  });

  const totalGrievances = wardFilteredComplaints.length;
  const pendingGrievances = wardFilteredComplaints.filter(c => c.status !== 'COMPLETED').length;
  const resolvedGrievances = wardFilteredComplaints.filter(c => c.status === 'COMPLETED').length;
  const resolutionRate = totalGrievances > 0 
    ? Math.round((resolvedGrievances / totalGrievances) * 100) 
    : 100;

  const wardFilteredOfficers = officers.filter(o => {
    if (selectedWard === 'ALL') return true;
    return Number(o.ward) === Number(selectedWard);
  });

  const wardFilteredResidents = residents.filter(r => {
    if (selectedWard === 'ALL') return true;
    return Number(r.ward) === Number(selectedWard);
  });

  const searchedResidents = wardFilteredResidents.filter(r => {
    if (!residentSearchQuery.trim()) return true;
    const q = residentSearchQuery.toLowerCase();
    return r.name.toLowerCase().includes(q) || r.phone.includes(q) || r.area.toLowerCase().includes(q);
  });

  // Handle Directive Broadcast
  const handleBroadcastDirective = (e) => {
    e.preventDefault();
    if (!directiveTitle.trim() || !directiveMessage.trim()) {
      showToast(lang === 'ta' ? 'தலைப்பு மற்றும் விபரங்களை உள்ளிடவும்.' : 'Please enter title and message.', 'error');
      return;
    }

    addDirective({
      title: directiveTitle,
      message: directiveMessage,
      targetWard: directiveTargetWard
    });

    setDirectiveTitle('');
    setDirectiveMessage('');
  };

  // Handle Add Officer
  const handleCreateOfficer = (e) => {
    e.preventDefault();
    if (!officerName.trim()) {
      showToast('Please enter officer name', 'error');
      return;
    }

    addOfficer({
      name: officerName,
      username: officerLoginId || `officer_w${officerWard}`,
      ward: officerWard,
      area: officerArea || `Ward ${officerWard} Central`,
      phone: officerPhone || '+91 98421 00000'
    });

    setOfficerName('');
    setOfficerLoginId('');
    setOfficerArea('');
    setOfficerPhone('');
    setIsAddOfficerModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col max-w-[420px] mx-auto w-full pb-20 select-none">
      <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3.5">

        {/* ============================================================== */}
        {/* 1. MLA STATUS CARD (LEADERSHIP COMMAND CENTER)                */}
        {/* ============================================================== */}
        <section className="bg-white rounded-2xl border border-amber-200 shadow-xs p-4 space-y-3">
          {/* MLA Designation & Name Banner */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-[11px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                  <span className="material-symbols-outlined text-[14px] text-amber-600">verified</span>
                  <span>{t.mlaHeroPill}</span>
                </span>
                <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded">
                  AC 121
                </span>
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>{t.activeStatus}</span>
                </span>
              </div>

              {/* Name Heading */}
              <h1 className="text-slate-900 font-extrabold text-base leading-snug">
                {lang === 'ta' ? 'கே. எஸ். ஸ்ரீ கிரி பிரசாத்' : 'K. S. Sri Giri Prasath'}
                <span className="block text-red-600 font-bold text-xs mt-0.5">
                  {lang === 'ta' ? 'K. S. Sri Giri Prasath' : 'MLA • Singanallur Assembly Constituency'}
                </span>
              </h1>
              <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px] text-slate-400">location_on</span>
                <span>{t.mlaSubTag}</span>
              </p>
            </div>

            {/* MLA Avatar Initials */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 text-white font-extrabold text-base flex items-center justify-center shadow-md shadow-red-200 shrink-0">
              {MLA_INFO.initials}
            </div>
          </div>

          {/* Ward Filter Toolbar */}
          <div className="pt-2 border-t border-slate-100 flex flex-col items-stretch gap-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-700">
              <span className="material-symbols-outlined text-sm">filter_alt</span>
              <span>{t.wardFilterLabel}</span>
            </div>
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="w-full text-xs font-bold bg-amber-50 border border-amber-300 text-slate-800 rounded-xl px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 shadow-2xs cursor-pointer"
            >
              <option value="ALL">{t.allWardsOption}</option>
              {ALL_WARD_NUMBERS.map(w => {
                const wardObj = WARDS_DATA.find(item => item.ward === w);
                const wardName = wardObj ? (lang === 'ta' ? wardObj.nameTa : wardObj.nameEn) : `Ward ${w}`;
                return (
                  <option key={w} value={w}>Ward {w} — {wardName}</option>
                );
              })}
            </select>
          </div>

          {/* Executive KPI Metrics Strip */}
          <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-slate-100 text-center">
            <div className="bg-amber-50 rounded-xl p-2 border border-amber-200">
              <div className="text-[9px] font-bold text-slate-500 uppercase">{t.kpiTotalComplaints}</div>
              <div className="text-sm font-black text-slate-900 mt-0.5">{totalGrievances}</div>
            </div>
            <div className="bg-red-50 rounded-xl p-2 border border-red-200">
              <div className="text-[9px] font-bold text-red-700 uppercase">{t.kpiPending}</div>
              <div className="text-sm font-black text-red-600 mt-0.5">{pendingGrievances}</div>
            </div>
            <div className="bg-emerald-50 rounded-xl p-2 border border-emerald-200">
              <div className="text-[9px] font-bold text-emerald-800 uppercase">{t.kpiResolved}</div>
              <div className="text-sm font-black text-emerald-700 mt-0.5">{resolvedGrievances}</div>
            </div>
            <div className="bg-yellow-50 rounded-xl p-2 border border-yellow-200">
              <div className="text-[9px] font-bold text-amber-900 uppercase">Rate (%)</div>
              <div className="text-sm font-black text-amber-800 mt-0.5">{resolutionRate}%</div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* TAB 1: COMPLAINTS OVERSIGHT                                    */}
        {/* ============================================================== */}
        {activeTab === 'COMPLAINTS' && (
          <div className="space-y-3 animate-fade-in">
            {/* Header & Filter pills */}
            <div className="bg-white rounded-2xl border border-amber-200 p-3 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[20px]">schedule</span>
                  </div>
                  <div>
                    <h2 className="text-xs sm:text-sm font-black text-slate-900">
                      {t.mlaCompHeading}
                    </h2>
                    <p className="text-[10px] text-slate-500">
                      {selectedWard === 'ALL' ? 'All 20 Wards Feed' : `Ward ${selectedWard} Feed`}
                    </p>
                  </div>
                </div>
                <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  {totalGrievances} Feed
                </span>
              </div>

              {/* Sub-Filters */}
              <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold gap-1">
                <button
                  type="button"
                  onClick={() => setCompFilter('ALL')}
                  className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${
                    compFilter === 'ALL'
                      ? 'bg-red-500 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ALL ({totalGrievances})
                </button>
                <button
                  type="button"
                  onClick={() => setCompFilter('PENDING')}
                  className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${
                    compFilter === 'PENDING'
                      ? 'bg-red-500 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  PENDING ({pendingGrievances})
                </button>
                <button
                  type="button"
                  onClick={() => setCompFilter('COMPLETED')}
                  className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${
                    compFilter === 'COMPLETED'
                      ? 'bg-red-500 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  RESOLVED ({resolvedGrievances})
                </button>
              </div>
            </div>

            {/* Grievance Feed Cards */}
            <div className="space-y-3">
              {displayedComplaints.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center border border-amber-200 text-slate-500 space-y-2">
                  <span className="material-symbols-outlined text-4xl text-amber-400">check_circle</span>
                  <p className="text-xs font-bold">No grievances in this filter</p>
                </div>
              ) : (
                displayedComplaints.map(comp => {
                  const isCompleted = comp.status === 'COMPLETED';

                  return (
                    <div
                      key={comp.id}
                      className={`bg-white rounded-2xl border p-4 shadow-xs space-y-2.5 transition ${
                        isCompleted ? 'border-emerald-300 bg-emerald-50/20' : 'border-amber-200'
                      }`}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-md">
                              Ward {comp.ward}
                            </span>
                            <span className="text-slate-400 text-xs">•</span>
                            <span className="text-xs font-bold text-slate-700">{comp.residentName}</span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-1">
                            {comp.title || comp.category}
                          </h4>
                        </div>
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            isCompleted
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-red-100 text-red-700 border border-red-300'
                          }`}
                        >
                          {isCompleted ? 'RESOLVED' : 'PENDING'}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-600 bg-amber-50/60 p-2.5 rounded-xl border border-amber-100 leading-relaxed">
                        {comp.description}
                      </p>

                      {/* Action Taken */}
                      {comp.actionTaken && (
                        <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-xs space-y-1">
                          <div className="flex items-center gap-1 text-emerald-900 font-bold">
                            <span className="material-symbols-outlined text-[15px] text-emerald-700">task_alt</span>
                            <span>Action Taken:</span>
                          </div>
                          <p className="text-slate-700 text-[11px] leading-relaxed pl-5">{comp.actionTaken}</p>
                        </div>
                      )}

                      {/* Proof Image if present */}
                      {comp.completionPhotoUrl && (
                        <div className="rounded-xl overflow-hidden border border-emerald-300">
                          <img src={comp.completionPhotoUrl} alt="Proof" className="w-full h-32 object-cover" />
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-amber-100">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px] text-red-500">location_on</span>
                          <span>{comp.area}</span>
                        </span>
                        <a href={`tel:${comp.userPhone}`} className="text-blue-600 font-bold hover:underline flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[13px]">call</span>
                          <span>{comp.userPhone}</span>
                        </a>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: GRASSROOTS FIELD OFFICERS                               */}
        {/* ============================================================== */}
        {activeTab === 'OFFICERS' && (
          <div className="space-y-3 animate-fade-in">
            {/* Header with "+ Add Officer" button */}
            <div className="bg-white rounded-2xl border border-amber-200 p-3.5 shadow-xs flex items-center justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-black text-slate-900">{t.mlaOfficersHeading}</h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  {wardFilteredOfficers.length} Assigned Coordinators
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddOfficerModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-brand-red hover:bg-brand-redHover text-white text-xs font-bold shadow-sm flex items-center gap-1 active:scale-95 transition cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">person_add</span>
                <span>{lang === 'ta' ? '+ புதிய அதிகாரி' : '+ Add Officer'}</span>
              </button>
            </div>

            {/* Officers List */}
            <div className="space-y-2.5">
              {wardFilteredOfficers.map(off => (
                <div
                  key={off.id}
                  className="bg-white rounded-2xl p-3.5 border border-amber-200 shadow-2xs flex items-center justify-between gap-2"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-white font-black text-sm flex items-center justify-center shadow-xs">
                      {off.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-slate-900 text-xs">{off.name}</span>
                        <span className="bg-amber-100 text-amber-900 text-[9px] font-bold px-1.5 py-0.2 rounded">
                          Ward {off.ward}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">{off.area}</p>
                      <span className="text-[9px] font-mono text-slate-400">{off.phone}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => toggleOfficerStatus(off.id)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition ${
                        off.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 text-slate-500 border border-slate-300'
                      }`}
                    >
                      {off.status}
                    </button>
                    <a
                      href={`tel:${off.phone}`}
                      className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 hover:bg-emerald-100"
                    >
                      <span className="material-symbols-outlined text-sm">call</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: DIRECTIVES PUBLISHING                                   */}
        {/* ============================================================== */}
        {activeTab === 'DIRECTIVES' && (
          <div className="space-y-3.5 animate-fade-in">
            {/* Directives Composition Card */}
            <div className="bg-white rounded-2xl border border-amber-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center gap-2 border-b border-amber-100 pb-2">
                <span className="material-symbols-outlined text-brand-red text-xl">campaign</span>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-slate-900">
                    {t.mlaDirectivesHeading}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {t.mlaDirectivesSub}
                  </p>
                </div>
              </div>

              <form onSubmit={handleBroadcastDirective} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-800 uppercase mb-1">
                    {t.targetWardLabel}
                  </label>
                  <select
                    value={directiveTargetWard}
                    onChange={(e) => setDirectiveTargetWard(e.target.value)}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-amber-200 bg-amber-50/40 text-slate-800 font-bold outline-none cursor-pointer"
                  >
                    <option value="ALL">{t.allWardsOption}</option>
                    {ALL_WARD_NUMBERS.map(w => (
                      <option key={w} value={w}>Ward {w}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-800 uppercase mb-1">
                    {t.directiveTitleLabel}
                  </label>
                  <input
                    type="text"
                    value={directiveTitle}
                    onChange={(e) => setDirectiveTitle(e.target.value)}
                    placeholder="e.g. Special Dengue Prevention Drive"
                    className="w-full h-10 px-3 text-xs rounded-xl border border-amber-200 bg-white text-slate-800 font-medium outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-800 uppercase mb-1">
                    {t.directiveMessageLabel}
                  </label>
                  <textarea
                    rows="3"
                    value={directiveMessage}
                    onChange={(e) => setDirectiveMessage(e.target.value)}
                    placeholder="Provide detailed instructions to ward officers..."
                    className="w-full p-3 text-xs rounded-xl border border-amber-200 bg-white text-slate-800 font-medium outline-none resize-none"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-brand-red hover:bg-brand-redHover active:scale-98 text-white font-extrabold text-xs uppercase tracking-wide shadow-md shadow-red-500/20 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">send</span>
                  <span>{t.broadcastBtn}</span>
                </button>
              </form>
            </div>

            {/* Active Directives Ledger */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-700 uppercase px-1">
                Active Published Directives ({directives.length})
              </h4>
              {directives.map(d => (
                <div key={d.id} className="bg-white rounded-2xl p-3.5 border border-amber-200 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-brand-red bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                      {d.role}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">{d.date}</span>
                  </div>
                  <h5 className="font-extrabold text-slate-900 text-xs">{d.title}</h5>
                  <p className="text-xs text-slate-600 leading-relaxed bg-[#FFFBEB] p-2 rounded-xl border border-amber-100">
                    {d.message}
                  </p>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
                    <span>By: <strong className="text-slate-800">{d.createdBy}</strong></span>
                    <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">
                      Target: {d.targetWard === 'ALL' ? 'All AC 121' : `Ward ${d.targetWard}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: CONSTITUENCY RESIDENTS                                  */}
        {/* ============================================================== */}
        {activeTab === 'RESIDENTS' && (
          <div className="space-y-3 animate-fade-in">
            {/* Search Bar */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-gray-400 text-xl pointer-events-none">
                search
              </span>
              <input
                type="text"
                value={residentSearchQuery}
                onChange={(e) => setResidentSearchQuery(e.target.value)}
                placeholder="Search constituency voters by name, phone, area..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-amber-200 rounded-xl text-xs font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red shadow-2xs"
              />
            </div>

            {/* List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1 text-xs font-bold text-slate-600">
                <span>{t.residentsAnalyticsHeading}</span>
                <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-md text-[10px]">
                  {searchedResidents.length} Verified
                </span>
              </div>

              {searchedResidents.map(r => (
                <div
                  key={r.id}
                  className="bg-white rounded-2xl p-3 border border-amber-200 shadow-2xs flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center font-black text-amber-900 text-xs">
                      {r.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h5 className="font-extrabold text-slate-900 text-xs">{r.name}</h5>
                        <span className="bg-amber-50 text-amber-900 text-[9px] font-bold px-1.5 py-0.2 rounded border border-amber-200">
                          Ward {r.ward}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">{r.area}</p>
                      <span className="text-[9px] font-mono text-slate-400">{r.phone}</span>
                    </div>
                  </div>

                  <a
                    href={`tel:${r.phone}`}
                    className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 hover:bg-emerald-100"
                  >
                    <span className="material-symbols-outlined text-sm">call</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ============================================================== */}
      {/* FIXED MLA BOTTOM NAVIGATION                                    */}
      {/* ============================================================== */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-amber-200/80 shadow-lg select-none">
        <div className="flex items-center justify-around h-16 px-2 max-w-[420px] mx-auto">
          {/* 1. Oversight */}
          <button
            type="button"
            onClick={() => setActiveTab('COMPLAINTS')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all relative cursor-pointer ${
              activeTab === 'COMPLAINTS' ? 'text-brand-red font-bold' : 'text-gray-500 font-semibold'
            }`}
          >
            <span className="material-symbols-outlined text-2xl">monitoring</span>
            <span className="text-[10px] tracking-tight mt-0.5">{t.navOversight}</span>
            {pendingGrievances > 0 && (
              <span className="absolute top-2 right-6 bg-brand-red text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {pendingGrievances}
              </span>
            )}
          </button>

          {/* 2. Officers */}
          <button
            type="button"
            onClick={() => setActiveTab('OFFICERS')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all cursor-pointer ${
              activeTab === 'OFFICERS' ? 'text-brand-red font-bold' : 'text-gray-500 font-semibold'
            }`}
          >
            <span className="material-symbols-outlined text-2xl">shield</span>
            <span className="text-[10px] tracking-tight mt-0.5">{t.navOfficers}</span>
          </button>

          {/* 3. Directives */}
          <button
            type="button"
            onClick={() => setActiveTab('DIRECTIVES')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all cursor-pointer ${
              activeTab === 'DIRECTIVES' ? 'text-brand-red font-bold' : 'text-gray-500 font-semibold'
            }`}
          >
            <span className="material-symbols-outlined text-2xl">campaign</span>
            <span className="text-[10px] tracking-tight mt-0.5">{t.navDirectives}</span>
          </button>

          {/* 4. Residents */}
          <button
            type="button"
            onClick={() => setActiveTab('RESIDENTS')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all cursor-pointer ${
              activeTab === 'RESIDENTS' ? 'text-brand-red font-bold' : 'text-gray-500 font-semibold'
            }`}
          >
            <span className="material-symbols-outlined text-2xl">group</span>
            <span className="text-[10px] tracking-tight mt-0.5">{t.navAnalytics}</span>
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
          <div className="bg-white w-full max-w-[380px] rounded-2xl border border-brand-cardBorder p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-amber-100 pb-2.5">
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Onboard New Ward Officer</h3>
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
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name *</label>
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  placeholder="Officer Name"
                  className="w-full h-10 px-3 text-xs rounded-xl border border-amber-200 bg-white font-medium focus:border-brand-red outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Login Username ID</label>
                <input
                  type="text"
                  value={officerLoginId}
                  onChange={(e) => setOfficerLoginId(e.target.value)}
                  placeholder={`officer_w${officerWard}`}
                  className="w-full h-10 px-3 text-xs rounded-xl border border-amber-200 bg-white font-medium focus:border-brand-red outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Assigned Ward *</label>
                <select
                  value={officerWard}
                  onChange={(e) => setOfficerWard(e.target.value)}
                  className="w-full h-10 px-3 text-xs rounded-xl border border-amber-200 bg-white font-bold focus:border-brand-red outline-none"
                >
                  {ALL_WARD_NUMBERS.map(w => (
                    <option key={w} value={w}>Ward {w}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Locality / Sector</label>
                <input
                  type="text"
                  value={officerArea}
                  onChange={(e) => setOfficerArea(e.target.value)}
                  placeholder={`Ward ${officerWard} Central`}
                  className="w-full h-10 px-3 text-xs rounded-xl border border-amber-200 bg-white font-medium focus:border-brand-red outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={officerPhone}
                  onChange={(e) => setOfficerPhone(e.target.value)}
                  placeholder="+91 98421 00000"
                  className="w-full h-10 px-3 text-xs rounded-xl border border-amber-200 bg-white font-medium focus:border-brand-red outline-none"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOfficerModalOpen(false)}
                  className="flex-1 h-10 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-xl bg-brand-red hover:bg-brand-redHover text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Onboard Officer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
