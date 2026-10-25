import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TVK_WHISTLE_LOGO_URL } from '../data/singanallurData';
import { compressImage } from '../utils/imageCompressor';

export const GrassrootsScreen = () => {
  const {
    currentUser,
    complaints,
    resolveComplaint,
    residents,
    showToast,
    lang
  } = useApp();

  // Active Tab: 'COMPLAINTS' | 'RESIDENTS' | 'OFFICER' (Directives removed as requested)
  const [activeTab, setActiveTab] = useState('COMPLAINTS');

  // Filter mode for complaints: 'ALL' | 'PENDING' | 'COMPLETED'
  const [filterMode, setFilterMode] = useState('ALL');

  // Active Complaint opened for Detail View (null = list view)
  const [activeComplaintDetail, setActiveComplaintDetail] = useState(null);

  // Search query for residents directory
  const [residentSearchQuery, setResidentSearchQuery] = useState('');

  // Resolution Form State inside Complaint Detail View
  const [actionNotes, setActionNotes] = useState('');
  const [proofPhotoPreview, setProofPhotoPreview] = useState(null);
  const [proofFileSize, setProofFileSize] = useState('');
  const [formError, setFormError] = useState('');

  // Confirmation Modal State ("Yes, Confirma?")
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Officer Avatar state
  const [officerAvatar, setOfficerAvatar] = useState(null);

  // Active Ward: 24 (or officer's assigned ward)
  const officerWard = currentUser?.ward || 24;

  // Filter complaints by ward safely
  const safeComplaints = Array.isArray(complaints) ? complaints : [];
  const wardComplaints = safeComplaints.filter(c => c && Number(c.ward) === Number(officerWard));
  const pendingCount = wardComplaints.filter(c => c && c.status !== 'COMPLETED').length;
  const completedCount = wardComplaints.filter(c => c && c.status === 'COMPLETED').length;

  const displayedComplaints = wardComplaints.filter(c => {
    if (!c) return false;
    if (filterMode === 'PENDING') return c.status !== 'COMPLETED';
    if (filterMode === 'COMPLETED') return c.status === 'COMPLETED';
    return true;
  });

  // Filter residents for officer's ward
  const safeResidents = Array.isArray(residents) ? residents : [];
  const wardResidents = safeResidents.filter(r => r && Number(r.ward) === Number(officerWard));
  const displayedResidents = wardResidents.filter(r => {
    if (!r) return false;
    if (!residentSearchQuery.trim()) return true;
    const q = residentSearchQuery.toLowerCase();
    return (
      (r.name && r.name.toLowerCase().includes(q)) ||
      (r.area && r.area.toLowerCase().includes(q)) ||
      (r.phone && r.phone.includes(q))
    );
  });

  // Open Complaint Detail View
  const handleOpenDetail = (complaint) => {
    setActiveComplaintDetail(complaint);
    setActionNotes(complaint?.actionTaken || '');
    setProofPhotoPreview(complaint?.completionPhotoUrl || null);
    setProofFileSize('');
    setFormError('');
    setShowConfirmModal(false);
  };

  // Close Detail View
  const handleCloseDetail = () => {
    setActiveComplaintDetail(null);
    setShowConfirmModal(false);
  };

  // Handle Photo Picker for Resolution Proof with Automatic Compression
  const handleProofImageChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setProofFileSize(`${(file.size / 1024).toFixed(1)} KB`);
      try {
        const compressed = await compressImage(file, 900, 900, 0.72);
        setProofPhotoPreview(compressed);
        showToast(lang === 'ta' ? 'தீர்வு புகைப்படம் இணைக்கப்பட்டது' : 'Resolution photo attached', 'success');
      } catch (err) {
        console.warn('Proof image compression fallback:', err);
        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
          setProofPhotoPreview(uploadEvent.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Trigger Confirmation Step
  const handleInitiateResolution = (e) => {
    e.preventDefault();
    if (!actionNotes.trim()) {
      setFormError(lang === 'ta' ? 'மேற்கொண்ட நடவடிக்கையை எழுதவும்.' : 'Please describe action taken notes.');
      return;
    }
    setFormError('');
    setShowConfirmModal(true);
  };

  // Final Confirmation: Mark Resolved
  const handleFinalConfirmResolution = () => {
    if (activeComplaintDetail) {
      try {
        resolveComplaint(activeComplaintDetail.id, actionNotes, proofPhotoPreview);

        // Update the active detail view with resolved state
        setActiveComplaintDetail(prev => ({
          ...prev,
          status: 'COMPLETED',
          actionTaken: actionNotes,
          completionPhotoUrl: proofPhotoPreview || prev?.completionPhotoUrl
        }));

        setShowConfirmModal(false);
        showToast(
          lang === 'ta' 
            ? 'புகார் தீர்க்கப்பட்டது! குடிமகனுக்கு அறிவிப்பு அனுப்பப்பட்டது.' 
            : 'Complaint resolved! Notification sent to resident.', 
          'success'
        );
      } catch (err) {
        console.error('Error resolving complaint:', err);
        showToast(lang === 'ta' ? 'பிழை ஏற்பட்டது' : 'Resolution error', 'error');
      }
    }
  };

  // Handle Officer Avatar change with Automatic Compression
  const handleAvatarChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 400, 400, 0.8);
        setOfficerAvatar(compressed);
        showToast(lang === 'ta' ? 'சுயவிவரப் படம் மாற்றப்பட்டது' : 'Profile photo updated', 'success');
      } catch {
        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
          setOfficerAvatar(uploadEvent.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col max-w-[420px] mx-auto w-full select-none">
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-28 space-y-4">

        {/* ============================================================== */}
        {/* TAB 1: GRASSROOTS COMPLAINTS                                  */}
        {/* ============================================================== */}
        {activeTab === 'COMPLAINTS' && (
          <div className="space-y-4 animate-fade-in">
            {/* If an individual complaint is opened, show DEDICATED SEPARATE DETAIL PAGE */}
            {activeComplaintDetail ? (
              <div className="space-y-4 animate-fade-in">
                {/* Back Button & Header */}
                <div className="flex items-center justify-between pb-1">
                  <button
                    type="button"
                    onClick={handleCloseDetail}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold shadow-2xs active:scale-95 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px] text-brand-red">arrow_back</span>
                    <span>{lang === 'ta' ? 'பின்செல்க (Back)' : 'Back to List'}</span>
                  </button>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-black text-slate-700">
                    #{activeComplaintDetail.id}
                  </span>
                </div>

                {/* 1. Person Details Card (யார் கம்ப்ளைன்ட் பண்ணிருக்கா) */}
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

                {/* 2. Complaint Details Card (என்ன கம்ப்ளைன்ட் பண்ணிருக்காங்க) */}
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
                        <span>{lang === 'ta' ? 'குடிமகன் இணைத்த புகைப்படம்' : 'Issue Photo Attached by Resident'}</span>
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

                {/* 3. Action & Resolution Section (தீர்க்கும் பகுதி) */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[17px] text-emerald-600">task_alt</span>
                      <span>{lang === 'ta' ? 'கள நடவடிக்கை & தீர்வு' : 'Resolution & Action'}</span>
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

                  {/* If ALREADY COMPLETED */}
                  {activeComplaintDetail.status === 'COMPLETED' ? (
                    <div className="space-y-3">
                      {activeComplaintDetail.actionTaken && (
                        <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 font-medium leading-relaxed">
                          <strong className="block text-emerald-900 font-bold mb-1">
                            {lang === 'ta' ? 'மேற்கொண்ட நடவடிக்கை:' : 'Action Taken Notes:'}
                          </strong>
                          {activeComplaintDetail.actionTaken}
                        </div>
                      )}

                      {/* Display Resolution Photo */}
                      {activeComplaintDetail.completionPhotoUrl && (
                        <div className="rounded-xl overflow-hidden border border-emerald-300 shadow-xs">
                          <div className="bg-emerald-600 text-white px-3 py-1.5 text-[10px] font-bold flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-[15px]">verified</span>
                              <span>{lang === 'ta' ? 'தீர்வு புகைப்படம் (வார்டு செயலாளர்)' : 'Resolution Photo (Ward Officer)'}</span>
                            </span>
                            <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded font-bold">Verified Work</span>
                          </div>
                          <img
                            src={activeComplaintDetail.completionPhotoUrl}
                            alt="Resolution Work"
                            className="w-full h-44 object-cover"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    /* If IN PROGRESS / PENDING: Resolution Form */
                    <form onSubmit={handleInitiateResolution} className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                          {lang === 'ta' ? 'மேற்கொண்ட நடவடிக்கை குறிப்புகள் *' : 'Action Taken Notes *'}
                        </label>
                        <textarea
                          rows="3"
                          value={actionNotes}
                          onChange={(e) => setActionNotes(e.target.value)}
                          placeholder={
                            lang === 'ta'
                              ? 'களப்பணி முடிக்கப்பட்ட விபரத்தை எழுதவும் (எ.கா. குடிநீர் குழாய் உடைப்பு சீரமைக்கப்பட்டது)...'
                              : 'Describe the work completed on ground (e.g. Fixed water pipeline leakage and restored normal flow)...'
                          }
                          className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none shadow-2xs resize-none"
                          required
                        ></textarea>
                        {formError && (
                          <p className="text-[10px] text-brand-red font-bold mt-1">{formError}</p>
                        )}
                      </div>

                      {/* Work Completion Photo Upload */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                          {lang === 'ta' ? 'தீர்வு புகைப்படம் பதிவேற்ற *' : 'Resolution Work Photo *'}
                        </label>

                        {!proofPhotoPreview ? (
                          <label className="h-28 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 hover:border-brand-red bg-slate-50 cursor-pointer p-2 text-center transition-colors">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleProofImageChange}
                            />
                            <span className="material-symbols-outlined text-brand-red text-3xl">add_a_photo</span>
                            <span className="text-xs font-bold text-slate-800 mt-1">
                              {lang === 'ta' ? 'தீர்வு புகைப்படம் இணைக்க' : 'Upload Completion Photo'}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {lang === 'ta' ? 'களப்பணி முடிந்த புகைப்படத்தை இணைக்கவும்' : 'Attach proof photo of completed work'}
                            </span>
                          </label>
                        ) : (
                          <div className="relative rounded-xl overflow-hidden border border-emerald-300">
                            <img src={proofPhotoPreview} alt="Work Proof" className="w-full h-40 object-cover" />
                            <button
                              type="button"
                              onClick={() => setProofPhotoPreview(null)}
                              className="absolute top-2 right-2 w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-700 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[16px]">close</span>
                            </button>
                            <div className="absolute bottom-0 inset-x-0 bg-black/70 px-2.5 py-1 text-[10px] text-white flex justify-between">
                              <span>{lang === 'ta' ? 'தீர்வு படம் தயாராக உள்ளது' : 'Work Proof Attached'}</span>
                              <span>{proofFileSize}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Mark as Solved Button (Triggers Confirmation) */}
                      <button
                        type="submit"
                        className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 active:scale-[0.99] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[19px]">task_alt</span>
                        <span>{lang === 'ta' ? 'முடிந்தது / தீர்க்கப்பட்டது (Mark as Solved)' : 'Mark as Solved'}</span>
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ) : (
              /* If viewing the complaints list: CLEAN, SPACIOUS, BEAUTIFUL CARDS */
              <>
                {/* Header Title */}
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-yellowSoft border border-brand-yellow text-amber-900 text-[11px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse"></span>
                    <span>{lang === 'ta' ? 'வார்டு 24 களப் புகார்கள்' : 'Ward 24 Field Grievances'}</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
                    {lang === 'ta' ? 'பொதுமக்கள் புகார்கள் பட்டியல்' : 'Citizens Grievance Directory'}
                  </h2>
                </div>

                {/* Filter Pills Bar */}
                <div className="flex items-center justify-between bg-white p-1 rounded-xl border border-slate-200 shadow-2xs text-xs font-bold gap-1">
                  <button
                    type="button"
                    onClick={() => setFilterMode('ALL')}
                    className={`flex-1 py-1.5 rounded-lg text-center transition cursor-pointer ${
                      filterMode === 'ALL'
                        ? 'bg-brand-red text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>{lang === 'ta' ? 'அனைத்தும்' : 'ALL'}</span> ({wardComplaints.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterMode('PENDING')}
                    className={`flex-1 py-1.5 rounded-lg text-center transition cursor-pointer ${
                      filterMode === 'PENDING'
                        ? 'bg-brand-red text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>{lang === 'ta' ? 'செயலில்' : 'IN PROGRESS'}</span> ({pendingCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterMode('COMPLETED')}
                    className={`flex-1 py-1.5 rounded-lg text-center transition cursor-pointer ${
                      filterMode === 'COMPLETED'
                        ? 'bg-brand-red text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>{lang === 'ta' ? 'தீர்க்கப்பட்டவை' : 'SOLVED'}</span> ({completedCount})
                  </button>
                </div>

                {/* Clean, Spacious Complaint Cards */}
                <div className="space-y-3">
                  {displayedComplaints.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500 space-y-2">
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
                          onClick={() => handleOpenDetail(c)}
                          className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:border-amber-300 hover:shadow-md transition-all cursor-pointer space-y-3"
                        >
                          {/* Top Row: Ward + Status Badge */}
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-[11px] font-bold text-amber-900">
                              <span>Ward {c.ward}</span>
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
                              {c.residentName}
                            </h3>
                            <div className="text-xs text-slate-600 flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[15px] text-brand-red shrink-0">location_on</span>
                              <span className="font-medium truncate">{c.area}</span>
                            </div>
                          </div>

                          {/* Bottom Row: Date/Time + Complaint ID + Call to Action */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 text-slate-400 font-medium text-[11px]">
                              <span className="font-mono text-slate-600 font-bold bg-slate-100 px-1.5 py-0.5 rounded">
                                #{c.id}
                              </span>
                              <span className="flex items-center gap-0.5">
                                <span className="material-symbols-outlined text-[13px]">schedule</span>
                                <span>{c.createdAt || 'Recent'}</span>
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
        {/* TAB 2: WARD RESIDENTS DIRECTORY                                */}
        {/* ============================================================== */}
        {activeTab === 'RESIDENTS' && (
          <div className="space-y-3.5 animate-fade-in">
            {/* Header */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-yellowSoft border border-brand-yellow text-amber-900 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-brand-red"></span>
                <span>Ward 24 • Singanallur</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
                {lang === 'ta' ? 'குடியிருப்பாளர்கள் பட்டியல்' : 'Residents Directory'}
              </h2>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-slate-400 text-xl pointer-events-none">
                search
              </span>
              <input
                type="text"
                value={residentSearchQuery}
                onChange={(e) => setResidentSearchQuery(e.target.value)}
                placeholder={lang === 'ta' ? 'குடியிருப்பாளர் பெயர், தொலைபேசி அல்லது தெரு தேடுக...' : 'Search residents by name, phone, street...'}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent shadow-2xs"
              />
            </div>

            {/* Ward Directory Count Banner */}
            <div className="flex items-center justify-between px-1 text-xs font-bold text-slate-600">
              <span>{lang === 'ta' ? 'பதிவு செய்யப்பட்ட வாக்காளர்கள்' : 'Registered Citizens'}</span>
              <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md text-[10px]">
                {displayedResidents.length} {lang === 'ta' ? 'நபர்கள்' : 'Members'}
              </span>
            </div>

            {/* Residents List */}
            <div className="space-y-2.5">
              {displayedResidents.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 text-center border border-slate-200 text-slate-500">
                  <span className="material-symbols-outlined text-3xl text-slate-400">person_search</span>
                  <p className="text-xs font-bold mt-1">
                    {lang === 'ta' ? 'குடியிருப்பாளர் காணப்படவில்லை' : 'No matching residents found'}
                  </p>
                </div>
              ) : (
                displayedResidents.map(user => {
                  const userComplaints = complaints.filter(c => c.residentName === user.name || (user.phone && c.userPhone === user.phone));

                  return (
                    <div
                      key={user.id}
                      className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center font-black text-amber-900 text-sm shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-slate-900 text-xs truncate">{user.name}</h4>
                          <p className="text-[10px] text-slate-500 truncate mt-0.5">{user.area}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-mono font-bold text-slate-700">{user.phone}</span>
                            {userComplaints.length > 0 && (
                              <span className="text-[9px] bg-red-50 text-brand-red font-bold px-1.5 py-0.2 rounded border border-red-200">
                                {userComplaints.length} {lang === 'ta' ? 'மனு' : 'grievances'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Contact Actions: Call & Message */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <a
                          href={`tel:${user.phone.replace(/[^0-9+]/g, '')}`}
                          className="w-9 h-9 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl flex items-center justify-center text-xs font-bold active:scale-95 transition shadow-2xs cursor-pointer"
                          title="Call"
                        >
                          <span className="material-symbols-outlined text-[17px]">call</span>
                        </a>
                        <a
                          href={`sms:${user.phone.replace(/[^0-9+]/g, '')}`}
                          className="w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-xl flex items-center justify-center text-xs font-bold active:scale-95 transition shadow-2xs cursor-pointer"
                          title="SMS"
                        >
                          <span className="material-symbols-outlined text-[17px]">chat</span>
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
        {/* TAB 3: OFFICER ID (CLEAN WHITE CARD, NO ORANGE/ACTIVE STRIP)  */}
        {/* ============================================================== */}
        {activeTab === 'OFFICER' && (
          <div className="space-y-4 animate-fade-in">
            {/* Header */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-yellowSoft border border-brand-yellow text-amber-900 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-brand-red"></span>
                <span>Ward 24 Field Official</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
                {lang === 'ta' ? 'அதிகாரி அடையாள அட்டை' : 'Officer ID Credentials'}
              </h2>
            </div>

            {/* Official ID Badge Card: Pure White, Clean, No Orange Strip */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm text-center space-y-4">
              {/* Avatar with Photo Controls */}
              <div className="flex flex-col items-center justify-center">
                <label className="relative group cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  <div className="w-24 h-24 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center p-1 shadow-xs relative overflow-hidden">
                    {officerAvatar ? (
                      <img src={officerAvatar} alt="Officer" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <span className="material-symbols-outlined text-5xl text-brand-red">shield_person</span>
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 p-1.5 bg-brand-red hover:bg-brand-redHover text-white rounded-full shadow-md border-2 border-white active:scale-95 transition flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">photo_camera</span>
                  </div>
                </label>

                {/* Upload / Remove Buttons */}
                <div className="mt-2.5 flex items-center space-x-1.5">
                  <label className="flex items-center space-x-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-lg text-[10px] font-bold active:scale-95 transition shadow-2xs cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    <span className="material-symbols-outlined text-[13px] text-brand-red">upload_file</span>
                    <span>Upload</span>
                  </label>
                  {officerAvatar && (
                    <button
                      type="button"
                      onClick={() => setOfficerAvatar(null)}
                      className="flex items-center space-x-1 px-2.5 py-1 bg-white hover:bg-red-50 text-slate-600 hover:text-brand-red border border-slate-200 rounded-lg text-[10px] font-bold active:scale-95 transition shadow-2xs cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[13px] text-slate-400">delete</span>
                      <span>Remove</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Officer Details */}
              <div>
                <h3 className="font-black text-slate-900 text-lg leading-tight">
                  {currentUser?.name || 'M. Karthik Kumar'}
                </h3>
                <p className="text-xs font-bold text-slate-500 mt-0.5">
                  {lang === 'ta' ? 'வார்டு 24 கள ஒருங்கிணைப்பாளர்' : 'Ward 24 Field Coordinator'}
                </p>
                <div className="inline-block mt-2 bg-slate-100 text-slate-700 text-[11px] font-semibold px-3 py-1 rounded-full border border-slate-200">
                  ID: <span className="font-mono font-bold text-slate-900">{currentUser?.officerId || 'TVK-GR-121-024'}</span>
                </div>
              </div>

              {/* Credential Table */}
              <div className="space-y-2 text-left text-xs border-t border-slate-100 pt-3">
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">Constituency</span>
                  <span className="font-bold text-slate-800">Singanallur (121)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">Assigned Ward</span>
                  <span className="font-black text-brand-red">Ward {officerWard} (V.O.C Street)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">Official Contact</span>
                  <a href="tel:+919842100024" className="font-bold text-slate-800">
                    {currentUser?.phone || '+91 98421 00024'}
                  </a>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500 font-medium">Role Authority</span>
                  <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    GRASSROOT FIELD OFFICER
                  </span>
                </div>
              </div>

              {/* TVK Whistle Seal */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center space-x-1.5 text-left">
                  <img src={TVK_WHISTLE_LOGO_URL} alt="Seal" className="w-5 h-5 object-contain" />
                  <span className="font-bold text-slate-700">TVK ERA Official</span>
                </div>
                <span className="text-emerald-700 font-bold flex items-center">
                  <span className="material-symbols-outlined text-sm mr-0.5">verified</span> AUTHENTICATED
                </span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ============================================================== */}
      {/* CONFIRMATION MODAL ("Yes, Confirma?")                          */}
      {/* ============================================================== */}
      {showConfirmModal && activeComplaintDetail && (
        <div className="fixed inset-0 z-[10001] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-[360px] bg-white rounded-2xl p-5 shadow-2xl border border-slate-200 space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
              <span className="material-symbols-outlined text-3xl">task_alt</span>
            </div>

            <div>
              <h3 className="text-base font-black text-slate-900">
                {lang === 'ta' ? 'தீர்வை உறுதி செய்க (Confirm)' : 'Confirm Resolution'}
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {lang === 'ta'
                  ? `புகார் #${activeComplaintDetail.id} வெற்றிகரமாக தீர்க்கப்பட்டுவிட்டதா? தீர்வு விவரம் மற்றும் புகைப்படம் குடிமகனுக்கு உடனடியாக அனுப்பப்படும்.`
                  : `Are you sure grievance #${activeComplaintDetail.id} is resolved? The resolution photo and update will be sent immediately to the resident.`}
              </p>
            </div>

            {/* Quick Preview of Action Notes */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs text-slate-700">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">
                {lang === 'ta' ? 'நடவடிக்கை குறிப்பு:' : 'Action Note:'}
              </span>
              <p className="line-clamp-2 italic font-medium">{actionNotes}</p>
            </div>

            {/* Confirm Actions */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="h-10 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs active:scale-95 transition cursor-pointer"
              >
                {lang === 'ta' ? 'ரத்து (Cancel)' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleFinalConfirmResolution}
                className="h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 active:scale-95 transition cursor-pointer flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">check</span>
                <span>{lang === 'ta' ? 'ஆம், உறுதி (Yes, Confirm)' : 'Yes, Confirm'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* FIXED GRASSROOTS BOTTOM NAVIGATION (3 TABS: NO DIRECTIVES)     */}
      {/* ============================================================== */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 shadow-lg select-none">
        <div className="flex items-center justify-around h-16 px-4 max-w-[420px] mx-auto">
          {/* 1. Complaints */}
          <button
            type="button"
            onClick={() => { setActiveTab('COMPLAINTS'); setActiveComplaintDetail(null); }}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all relative cursor-pointer ${
              activeTab === 'COMPLAINTS' ? 'text-brand-red font-bold' : 'text-slate-500 font-medium'
            }`}
          >
            <span className={`material-symbols-outlined text-2xl ${activeTab === 'COMPLAINTS' ? 'fill' : ''}`}>
              schedule
            </span>
            <span className="text-[11px] tracking-tight mt-0.5">
              {lang === 'ta' ? 'புகார்கள்' : 'Complaints'}
            </span>
            {pendingCount > 0 && (
              <span className="absolute top-2.5 right-8 bg-brand-red text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                {pendingCount}
              </span>
            )}
          </button>

          {/* 2. Residents */}
          <button
            type="button"
            onClick={() => { setActiveTab('RESIDENTS'); setActiveComplaintDetail(null); }}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all cursor-pointer ${
              activeTab === 'RESIDENTS' ? 'text-brand-red font-bold' : 'text-slate-500 font-medium'
            }`}
          >
            <span className={`material-symbols-outlined text-2xl ${activeTab === 'RESIDENTS' ? 'fill' : ''}`}>
              group
            </span>
            <span className="text-[11px] tracking-tight mt-0.5">
              {lang === 'ta' ? 'குடிமக்கள்' : 'Residents'}
            </span>
          </button>

          {/* 3. Officer ID */}
          <button
            type="button"
            onClick={() => { setActiveTab('OFFICER'); setActiveComplaintDetail(null); }}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all cursor-pointer ${
              activeTab === 'OFFICER' ? 'text-brand-red font-bold' : 'text-slate-500 font-medium'
            }`}
          >
            <span className={`material-symbols-outlined text-2xl ${activeTab === 'OFFICER' ? 'fill' : ''}`}>
              shield
            </span>
            <span className="text-[11px] tracking-tight mt-0.5">
              {lang === 'ta' ? 'அதிகாரி அட்டை' : 'Officer ID'}
            </span>
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
