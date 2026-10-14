import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TVK_WHISTLE_LOGO_URL } from '../data/singanallurData';

export const GrassrootsScreen = () => {
  const {
    currentUser,
    complaints,
    resolveComplaint,
    residents,
    directives,
    showToast,
    t,
    lang
  } = useApp();

  // Active Tab: 'COMPLAINTS' | 'RESIDENTS' | 'DIRECTIVES' | 'OFFICER'
  const [activeTab, setActiveTab] = useState('COMPLAINTS');

  // Filter mode for complaints: 'ALL' | 'PENDING' | 'COMPLETED'
  const [filterMode, setFilterMode] = useState('ALL');

  // Search query for residents directory
  const [residentSearchQuery, setResidentSearchQuery] = useState('');

  // Resolution Modal State
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [actionNotes, setActionNotes] = useState('');
  const [proofPhotoPreview, setProofPhotoPreview] = useState(null);
  const [proofFileSize, setProofFileSize] = useState('');
  const [modalError, setModalError] = useState('');

  // Officer Avatar state
  const [officerAvatar, setOfficerAvatar] = useState(null);

  // Active Ward: 24 (or officer's assigned ward)
  const officerWard = currentUser?.ward || 24;

  // Filter complaints by ward
  const wardComplaints = complaints.filter(c => Number(c.ward) === Number(officerWard));
  const pendingCount = wardComplaints.filter(c => c.status !== 'COMPLETED').length;
  const completedCount = wardComplaints.filter(c => c.status === 'COMPLETED').length;

  const displayedComplaints = wardComplaints.filter(c => {
    if (filterMode === 'PENDING') return c.status !== 'COMPLETED';
    if (filterMode === 'COMPLETED') return c.status === 'COMPLETED';
    return true;
  });

  // Filter residents for officer's ward
  const wardResidents = residents.filter(r => Number(r.ward) === Number(officerWard));
  const displayedResidents = wardResidents.filter(r => {
    if (!residentSearchQuery.trim()) return true;
    const q = residentSearchQuery.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.area.toLowerCase().includes(q) ||
      r.phone.includes(q)
    );
  });

  // Filter directives (ALL or this ward)
  const relevantDirectives = directives.filter(
    d => d.targetWard === 'ALL' || Number(d.targetWard) === Number(officerWard)
  );

  // Open Resolution Modal
  const handleOpenResolutionModal = (complaint) => {
    setSelectedComplaint(complaint);
    setActionNotes('');
    setProofPhotoPreview(null);
    setProofFileSize('');
    setModalError('');
  };

  // Handle Photo Picker for Resolution Proof
  const handleProofImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofFileSize(`${(file.size / 1024).toFixed(1)} KB`);
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setProofPhotoPreview(uploadEvent.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Resolution
  const handleConfirmResolution = () => {
    if (!actionNotes.trim()) {
      setModalError(lang === 'ta' ? 'நடவடிக்கை குறிப்புகளை உள்ளிடவும்.' : 'Please provide detailed action taken notes.');
      return;
    }

    if (selectedComplaint) {
      resolveComplaint(selectedComplaint.id, actionNotes, proofPhotoPreview);
      setSelectedComplaint(null);
    }
  };

  // Handle Officer Avatar change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setOfficerAvatar(uploadEvent.target.result);
      };
      reader.readAsDataURL(file);
      showToast('Profile photo updated', 'success');
    }
  };

  return (
    <div className="flex-1 flex flex-col max-w-[420px] mx-auto w-full pb-20 select-none">
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5">

        {/* ============================================================== */}
        {/* WARD GRASSROOTS STATUS CARD                                    */}
        {/* ============================================================== */}
        <section className="bg-white rounded-2xl p-4 shadow-xs border border-amber-200/90 relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-amber-100/60 rounded-full blur-xl pointer-events-none"></div>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="bg-amber-100 border border-amber-300 text-amber-950 font-black text-xs px-2.5 py-0.5 rounded-full">
                  Ward {officerWard}
                </span>
                <span className="inline-flex items-center text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>
                  <span>{t.officerStatusActive}</span>
                </span>
              </div>
              <h2 className="font-extrabold text-gray-900 text-base leading-tight">
                {currentUser?.name || 'M. Karthik Kumar'}
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                {currentUser?.designation || `Ward ${officerWard} Coordinator • Singanallur Central`}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                {t.lblJurisdiction}
              </span>
              <span className="text-xs font-extrabold text-brand-red">Singanallur (121)</span>
            </div>
          </div>

          {/* Live Operations Metrics Strip */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-amber-100 text-center">
            <div className="bg-red-50 rounded-xl p-1.5 border border-red-200">
              <div className="text-[10px] font-bold text-brand-red uppercase">{t.lblNeedsAction}</div>
              <div className="text-sm font-black text-brand-redText mt-0.5">{pendingCount}</div>
            </div>
            <div className="bg-amber-50 rounded-xl p-1.5 border border-amber-200">
              <div className="text-[10px] font-bold text-amber-900 uppercase">{t.lblTotalResidents}</div>
              <div className="text-sm font-black text-amber-900 mt-0.5">{wardResidents.length}</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-1.5 border border-slate-200">
              <div className="text-[10px] font-bold text-slate-600 uppercase">{t.lblDirectives}</div>
              <div className="text-sm font-black text-slate-800 mt-0.5">{relevantDirectives.length}</div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* TAB 1: GRASSROOTS COMPLAINTS                                  */}
        {/* ============================================================== */}
        {activeTab === 'COMPLAINTS' && (
          <div className="space-y-3 animate-fade-in">
            {/* Filter Pills Bar */}
            <div className="flex items-center justify-between bg-white p-1.5 rounded-xl border border-amber-200 shadow-2xs text-xs font-bold gap-1">
              <button
                type="button"
                onClick={() => setFilterMode('ALL')}
                className={`flex-1 py-1.5 rounded-lg text-center transition cursor-pointer ${
                  filterMode === 'ALL'
                    ? 'bg-brand-red text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>{t.filterAll}</span> ({wardComplaints.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('PENDING')}
                className={`flex-1 py-1.5 rounded-lg text-center transition cursor-pointer ${
                  filterMode === 'PENDING'
                    ? 'bg-brand-red text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>{t.filterInProgress}</span> ({pendingCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('COMPLETED')}
                className={`flex-1 py-1.5 rounded-lg text-center transition cursor-pointer ${
                  filterMode === 'COMPLETED'
                    ? 'bg-brand-red text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>{t.filterCompleted}</span> ({completedCount})
              </button>
            </div>

            {/* Complaints List Container */}
            <div className="space-y-3">
              {displayedComplaints.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center border border-amber-200 text-gray-500 space-y-2">
                  <span className="material-symbols-outlined text-4xl text-amber-400">inventory_2</span>
                  <p className="text-xs font-bold">
                    {lang === 'ta' ? 'புகார்கள் எதுவும் இல்லை' : 'No grievances found in this filter'}
                  </p>
                </div>
              ) : (
                displayedComplaints.map(c => {
                  const isCompleted = c.status === 'COMPLETED';

                  return (
                    <div
                      key={c.id}
                      className={`bg-white rounded-2xl p-4 shadow-xs border transition hover:border-brand-red space-y-2.5 ${
                        isCompleted ? 'border-emerald-300 bg-emerald-50/20' : 'border-amber-200'
                      }`}
                    >
                      {/* Header: ID + Status Badge */}
                      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-black text-gray-800 bg-gray-100 px-2 py-0.5 rounded">
                            #{c.id}
                          </span>
                          <span className="text-[10px] text-gray-400 font-semibold">{c.createdAt || 'Recent'}</span>
                        </div>
                        <span
                          className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                            isCompleted
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-red-100 text-brand-red border border-red-300 animate-pulse'
                          }`}
                        >
                          {isCompleted
                            ? (lang === 'ta' ? 'தீர்க்கப்பட்டது ✓' : 'RESOLVED')
                            : (lang === 'ta' ? 'நடவடிக்கை தேவை' : 'NEEDS ACTION')}
                        </span>
                      </div>

                      {/* Resident & Location */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-gray-900 text-xs">{c.residentName}</h4>
                          <p className="text-[11px] text-gray-500 flex items-center mt-0.5">
                            <span className="material-symbols-outlined text-[13px] text-brand-red mr-1">location_on</span>
                            <span>{c.area}</span>
                          </p>
                        </div>

                        {/* Call Resident Action */}
                        {c.userPhone && (
                          <a
                            href={`tel:${c.userPhone}`}
                            className="flex items-center space-x-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-gray-900 border border-amber-300 rounded-lg text-[11px] font-bold active:scale-95 transition shadow-2xs"
                          >
                            <span className="material-symbols-outlined text-sm text-emerald-600">call</span>
                            <span>{t.callResidentBtn}</span>
                          </a>
                        )}
                      </div>

                      {/* Category & Description */}
                      <div className="bg-[#FFFBEB] rounded-xl p-2.5 border border-amber-200/80">
                        <span className="text-[10px] font-extrabold text-brand-red uppercase tracking-wide block mb-0.5">
                          {c.category}
                        </span>
                        <p className="text-xs text-gray-800 leading-relaxed">{c.description}</p>
                      </div>

                      {/* Optional Photo Attachment */}
                      {c.photoUrl && (
                        <div className="rounded-xl overflow-hidden border border-gray-200">
                          <img src={c.photoUrl} alt="Complaint Attachment" className="w-full h-32 object-cover" />
                        </div>
                      )}

                      {/* Action CTA or Resolved Outcome */}
                      {isCompleted ? (
                        <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200 space-y-1.5">
                          <div className="flex items-center space-x-1.5 text-emerald-900 font-extrabold text-xs">
                            <span className="material-symbols-outlined text-emerald-600 text-sm">verified</span>
                            <span>{t.resolvedStatusTitle}</span>
                          </div>
                          {c.actionTaken && (
                            <div className="text-[11px] text-gray-700">
                              <strong className="font-bold text-gray-900">{t.actionTakenLabel}</strong> {c.actionTaken}
                            </div>
                          )}
                          {c.completionPhotoUrl && (
                            <div className="mt-2 rounded-lg overflow-hidden border border-emerald-300">
                              <img src={c.completionPhotoUrl} alt="Completion Proof" className="w-full h-32 object-cover" />
                              <p className="text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.5 font-bold">
                                Verified Completion Proof Attached
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenResolutionModal(c)}
                          className="w-full py-2.5 bg-brand-red hover:bg-brand-redHover active:scale-98 text-white font-extrabold text-xs rounded-xl shadow-md shadow-red-500/20 flex items-center justify-center space-x-1.5 transition cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">fact_check</span>
                          <span>{t.takeActionBtn}</span>
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: WARD RESIDENTS DIRECTORY                                */}
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
                placeholder={t.searchResidentsPlaceholder}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-amber-200 rounded-xl text-xs font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent shadow-2xs"
              />
            </div>

            {/* Ward Directory Count Banner */}
            <div className="flex items-center justify-between px-1 text-xs font-bold text-gray-600">
              <span>{t.wardDirectoryTitle}</span>
              <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-md text-[10px]">
                {displayedResidents.length} {lang === 'ta' ? 'சரிபார்க்கப்பட்ட குடியிருப்பாளர்கள்' : 'Verified Residents'}
              </span>
            </div>

            {/* Residents List */}
            <div className="space-y-2.5">
              {displayedResidents.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 text-center border border-amber-200 text-gray-500">
                  <span className="material-symbols-outlined text-3xl text-gray-400">person_search</span>
                  <p className="text-xs font-bold mt-1">
                    {lang === 'ta' ? 'குடியிருப்பாளர் காணப்படவில்லை' : 'No matching residents found'}
                  </p>
                </div>
              ) : (
                displayedResidents.map(user => (
                  <div
                    key={user.id}
                    className="bg-white rounded-2xl p-3.5 border border-amber-200 shadow-2xs flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center font-black text-amber-900 text-sm">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-gray-900 text-xs">{user.name}</h4>
                        <p className="text-[10px] text-gray-500 mt-0.5">{user.area}</p>
                        <span className="inline-block mt-0.5 text-[9px] font-mono text-gray-400">{user.phone}</span>
                      </div>
                    </div>

                    <a
                      href={`tel:${user.phone}`}
                      className="flex items-center space-x-1 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold active:scale-95 transition shadow-2xs"
                    >
                      <span className="material-symbols-outlined text-sm">phone_in_talk</span>
                      <span>{lang === 'ta' ? 'அழைக்க' : 'Call'}</span>
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: GUIDANCE & DIRECTIVES                                  */}
        {/* ============================================================== */}
        {activeTab === 'DIRECTIVES' && (
          <div className="space-y-3 animate-fade-in">
            {/* Banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start space-x-2.5 text-xs text-amber-900">
              <span className="material-symbols-outlined text-brand-red text-xl flex-none">campaign</span>
              <div>
                <span className="font-extrabold block">OFFICIAL LEADERSHIP DIRECTIVES</span>
                <p className="text-[11px] text-amber-800">
                  Direct instructions from MLA Constituency Office & Ward District Secretary.
                </p>
              </div>
            </div>

            {/* Directive Cards List */}
            <div className="space-y-3">
              {relevantDirectives.map(d => (
                <div key={d.id} className="bg-white rounded-2xl p-4 border border-amber-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-brand-red bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                      {d.role}
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold">{d.date}</span>
                  </div>

                  <h4 className="font-black text-gray-900 text-xs">
                    {(lang === 'ta' && d.titleTa) ? d.titleTa : d.title}
                  </h4>
                  <p className="text-xs text-gray-700 leading-relaxed bg-[#FFFBEB] p-2.5 rounded-xl border border-amber-100">
                    {d.message}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-gray-500 font-medium">
                    <span>By: <strong className="text-gray-800">{d.createdBy}</strong></span>
                    <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-bold">
                      Target: {d.targetWard === 'ALL' ? 'All AC 121' : `Ward ${d.targetWard}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: OFFICER ID BADGE                                        */}
        {/* ============================================================== */}
        {activeTab === 'OFFICER' && (
          <div className="space-y-3 animate-fade-in">
            {/* Official ID Badge Card */}
            <div className="bg-white border-2 border-brand-red rounded-2xl p-5 shadow-lg relative overflow-hidden text-center">
              <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-brand-red via-brand-yellow to-brand-red"></div>

              {/* Avatar with Photo Controls */}
              <div className="mt-2 flex flex-col items-center justify-center">
                <label className="relative group cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  <div className="w-24 h-24 bg-amber-50 border-2 border-amber-300 rounded-full flex items-center justify-center p-2 shadow-inner relative overflow-hidden">
                    {officerAvatar ? (
                      <img src={officerAvatar} alt="Officer" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <span className="material-symbols-outlined text-4xl text-brand-red">shield_person</span>
                    )}
                    <span className="absolute bottom-1 right-2 bg-emerald-500 border-2 border-white w-4 h-4 rounded-full z-10"></span>
                  </div>
                  <div className="absolute bottom-0 right-0 p-1.5 bg-brand-red hover:bg-brand-redHover text-white rounded-full shadow-md border-2 border-white active:scale-95 transition flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">photo_camera</span>
                  </div>
                </label>

                {/* Upload Buttons */}
                <div className="mt-3 flex items-center space-x-1.5 bg-amber-50/80 p-1.5 rounded-xl border border-amber-200">
                  <label className="flex items-center space-x-1 px-2 py-1 bg-white hover:bg-amber-100 text-gray-800 border border-amber-200 rounded-lg text-[10px] font-bold active:scale-95 transition shadow-2xs cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    <span className="material-symbols-outlined text-[13px] text-brand-red">upload_file</span>
                    <span>Upload</span>
                  </label>
                  {officerAvatar && (
                    <button
                      type="button"
                      onClick={() => setOfficerAvatar(null)}
                      className="flex items-center space-x-1 px-2 py-1 bg-white hover:bg-red-50 text-gray-600 hover:text-brand-red border border-amber-200 rounded-lg text-[10px] font-bold active:scale-95 transition shadow-2xs"
                    >
                      <span className="material-symbols-outlined text-[13px] text-gray-400">delete</span>
                      <span>Remove</span>
                    </button>
                  )}
                </div>
              </div>

              <h3 className="font-black text-gray-900 text-lg mt-3">
                {currentUser?.name || 'M. Karthik Kumar'}
              </h3>
              <p className="text-xs font-bold text-brand-red uppercase tracking-wider">
                {t.officerIdTitle}
              </p>
              <div className="inline-block mt-1 bg-gray-100 text-gray-700 text-[11px] font-semibold px-3 py-0.5 rounded-full">
                ID: <span className="font-mono font-bold text-gray-900">{currentUser?.officerId || 'TVK-GR-121-024'}</span>
              </div>

              {/* Credential Table */}
              <div className="mt-5 space-y-2 text-left text-xs border-t border-gray-100 pt-3">
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-500 font-medium">Constituency</span>
                  <span className="font-bold text-gray-800">Singanallur (121)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-500 font-medium">District</span>
                  <span className="font-bold text-gray-800">Coimbatore Urban</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-500 font-medium">Assigned Ward</span>
                  <span className="font-black text-brand-red">Ward {officerWard} (V.O.C Street)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-500 font-medium">Official Contact</span>
                  <a href="tel:+919842100024" className="font-bold text-blue-600 underline">
                    {currentUser?.phone || '+91 98421 00024'}
                  </a>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500 font-medium">RBAC Role</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    GRASSROOT OFFICIAL
                  </span>
                </div>
              </div>

              {/* TVK Security Seal */}
              <div className="mt-4 pt-3 border-t border-dashed border-gray-200 flex items-center justify-between text-[11px] text-gray-500">
                <div className="flex items-center space-x-1.5 text-left">
                  <img src={TVK_WHISTLE_LOGO_URL} alt="Seal" className="w-5 h-5 object-contain" />
                  <span className="font-bold text-gray-700">TVK ERA Verified Portal</span>
                </div>
                <span className="text-emerald-700 font-bold flex items-center">
                  <span className="material-symbols-outlined text-sm mr-0.5">verified</span> AUTHENTICATED
                </span>
              </div>
            </div>

            {/* Access Control Policy Note */}
            <div className="p-3 bg-white rounded-xl border border-gray-200 text-xs text-gray-600 space-y-1">
              <div className="font-bold text-gray-800 flex items-center space-x-1">
                <span className="material-symbols-outlined text-brand-red text-sm">lock</span>
                <span>{t.securityPolicyTitle}</span>
              </div>
              <p className="text-[11px]">
                {t.securityPolicyBody}
              </p>
            </div>
          </div>
        )}

      </div>

      {/* ============================================================== */}
      {/* RESOLUTION MODAL / SLIDE-OVER (TAKE ACTION & RESOLVE)         */}
      {/* ============================================================== */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-[10000] bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="w-full max-w-[420px] bg-white rounded-t-[28px] sm:rounded-2xl max-h-[85vh] overflow-y-auto p-5 shadow-2xl border-t sm:border border-amber-200 space-y-4">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-brand-red text-2xl">verified</span>
                <div>
                  <h3 className="font-black text-gray-900 text-sm">{t.modalActionTitle}</h3>
                  <p className="text-[10px] font-bold text-gray-500">
                    Grievance #{selectedComplaint.id} • Ward {selectedComplaint.ward}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedComplaint(null)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Complaint Mini Summary */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 text-xs space-y-1">
              <div className="flex justify-between font-bold text-gray-800">
                <span>{selectedComplaint.residentName}</span>
                <span className="text-brand-red">{selectedComplaint.category}</span>
              </div>
              <p className="text-gray-600 italic text-[11px]">"{selectedComplaint.description}"</p>
            </div>

            {/* Resolution Form */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-black text-gray-800 mb-1">
                  {t.modalActionNotesLabel}
                </label>
                <textarea
                  rows="3"
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  placeholder={t.modalActionNotesPlaceholder}
                  className="w-full p-3 bg-white border border-gray-300 rounded-xl text-xs font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent resize-none shadow-inner"
                ></textarea>
                {modalError && (
                  <p className="text-[10px] text-brand-red font-bold mt-1">{modalError}</p>
                )}
              </div>

              {/* Completion Proof Photo Picker */}
              <div>
                <label className="block text-xs font-black text-gray-800 mb-1">
                  {t.modalProofPhotoLabel}
                </label>

                {!proofPhotoPreview ? (
                  <label className="border-2 border-dashed border-amber-300 bg-amber-50/40 rounded-xl p-4 text-center cursor-pointer hover:bg-amber-100/40 transition flex flex-col items-center">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProofImageChange}
                    />
                    <span className="material-symbols-outlined text-brand-red text-3xl">add_a_photo</span>
                    <p className="text-xs font-bold text-gray-800 mt-1">{t.modalTapToUploadProof}</p>
                    <p className="text-[10px] text-gray-500">Camera capture or gallery image (JPG/PNG)</p>
                  </label>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-amber-300">
                    <img src={proofPhotoPreview} alt="Proof" className="w-full h-36 object-cover" />
                    <button
                      type="button"
                      onClick={() => setProofPhotoPreview(null)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                    <div className="absolute bottom-0 inset-x-0 bg-black/60 px-2 py-1 text-[10px] text-white flex justify-between">
                      <span>Verified Upload Preview</span>
                      <span>{proofFileSize}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Confirm Resolution Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleConfirmResolution}
                className="w-full py-3 bg-brand-red hover:bg-brand-redHover active:scale-98 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-500/25 flex items-center justify-center space-x-1.5 transition cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">task_alt</span>
                <span>{t.modalConfirmBtn}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* FIXED GRASSROOTS BOTTOM NAVIGATION                            */}
      {/* ============================================================== */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-amber-200/80 shadow-lg select-none">
        <div className="flex items-center justify-around h-16 px-2 max-w-[420px] mx-auto">
          {/* 1. Complaints */}
          <button
            type="button"
            onClick={() => setActiveTab('COMPLAINTS')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all relative cursor-pointer ${
              activeTab === 'COMPLAINTS' ? 'text-brand-red font-bold' : 'text-gray-500 font-semibold'
            }`}
          >
            <span className="material-symbols-outlined text-2xl">schedule</span>
            <span className="text-[10px] tracking-tight mt-0.5">{t.navComplaints}</span>
            {pendingCount > 0 && (
              <span className="absolute top-2 right-6 bg-brand-red text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {pendingCount}
              </span>
            )}
          </button>

          {/* 2. Residents */}
          <button
            type="button"
            onClick={() => setActiveTab('RESIDENTS')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all cursor-pointer ${
              activeTab === 'RESIDENTS' ? 'text-brand-red font-bold' : 'text-gray-500 font-semibold'
            }`}
          >
            <span className="material-symbols-outlined text-2xl">group</span>
            <span className="text-[10px] tracking-tight mt-0.5">{t.navResidents}</span>
          </button>

          {/* 3. Directives */}
          <button
            type="button"
            onClick={() => setActiveTab('DIRECTIVES')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all cursor-pointer ${
              activeTab === 'DIRECTIVES' ? 'text-brand-red font-bold' : 'text-gray-500 font-semibold'
            }`}
          >
            <span className="material-symbols-outlined text-2xl">description</span>
            <span className="text-[10px] tracking-tight mt-0.5">{t.navDirectives}</span>
          </button>

          {/* 4. Officer ID */}
          <button
            type="button"
            onClick={() => setActiveTab('OFFICER')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all cursor-pointer ${
              activeTab === 'OFFICER' ? 'text-brand-red font-bold' : 'text-gray-500 font-semibold'
            }`}
          >
            <span className="material-symbols-outlined text-2xl">shield</span>
            <span className="text-[10px] tracking-tight mt-0.5">{t.navOfficerId}</span>
          </button>
        </div>

        {/* Mobile Home Indicator */}
        <div className="pb-1.5 pt-0.5 flex justify-center bg-white">
          <div className="w-32 h-1 bg-slate-300 rounded-full"></div>
        </div>
      </nav>
    </div>
  );
};
