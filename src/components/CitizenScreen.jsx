import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TVK_WHISTLE_LOGO_URL, OFFICIALS_DIRECTORY, MLA_INFO } from '../data/singanallurData';
import { compressImage } from '../utils/imageCompressor';

export const CitizenScreen = () => {
  const {
    currentUser,
    complaints,
    addComplaint,
    updateResidentProfile,
    logout,
    showToast,
    lang
  } = useApp();

  // Active Tab: 'STATUS' (default) | 'REPORT' | 'CONTACTS' | 'PROFILE'
  const [activeTab, setActiveTab] = useState('STATUS');

  // Grievance Form State (Category dropdown removed as requested)
  const [description, setDescription] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoName, setPhotoName] = useState('');
  const [videoName, setVideoName] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [voiceRecorded, setVoiceRecorded] = useState(false);

  // Status Filter: 'ALL' | 'NOT_SOLVED' | 'SOLVED'
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Profile Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(currentUser?.name || 'Sampooraniyan (சம் பூரணியன்)');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '+91 94432 18890');
  const [editArea, setEditArea] = useState(currentUser?.area || 'V.O.C Street, Ward 24');

  // Counts
  const residentWard = currentUser?.ward || 24;
  const safeComplaints = Array.isArray(complaints) ? complaints : [];
  const totalCount = safeComplaints.length;
  const notSolvedCount = safeComplaints.filter(c => c && c.status !== 'COMPLETED').length;
  const solvedCount = safeComplaints.filter(c => c && c.status === 'COMPLETED').length;

  // Filter complaints based on statusFilter
  const filteredComplaints = safeComplaints.filter(c => {
    if (!c) return false;
    if (statusFilter === 'NOT_SOLVED') return c.status !== 'COMPLETED';
    if (statusFilter === 'SOLVED') return c.status === 'COMPLETED';
    return true;
  });

  // Handle Photo Pick with Automatic Mobile Compression
  const handlePhotoChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setPhotoName(file.name);
      try {
        const compressed = await compressImage(file, 900, 900, 0.72);
        setPhotoPreview(compressed);
        showToast(`${file.name} ${lang === 'ta' ? 'இணைக்கப்பட்டது' : 'attached'}`, 'success');
      } catch (err) {
        console.warn('Image processing fallback:', err);
        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
          setPhotoPreview(uploadEvent.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Handle Video Pick
  const handleVideoChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setVideoName(file.name);
      showToast(`${lang === 'ta' ? 'வீடியோ இணைக்கப்பட்டது:' : 'Video attached:'} ${file.name}`, 'success');
    }
  };

  // Handle Voice Recording Simulation
  const handleToggleVoice = () => {
    if (!isRecording) {
      setIsRecording(true);
      showToast(lang === 'ta' ? 'குரல் பதிவு தொடங்கப்பட்டது...' : 'Voice recording started...', 'success');
      setTimeout(() => {
        setIsRecording(false);
        setVoiceRecorded(true);
        showToast(lang === 'ta' ? 'குரல் செய்தி சேமிக்கப்பட்டது (0:14)' : 'Voice note saved (0:14)', 'success');
      }, 3000);
    } else {
      setIsRecording(false);
      setVoiceRecorded(true);
      showToast(lang === 'ta' ? 'குரல் செய்தி சேமிக்கப்பட்டது' : 'Voice note recorded', 'success');
    }
  };

  // Submit Grievance
  const handleSubmitGrievance = (e) => {
    e.preventDefault();
    if (!description.trim()) {
      showToast(lang === 'ta' ? 'புகார் விபரங்களை எழுதவும்.' : 'Please enter complaint details.', 'error');
      return;
    }

    try {
      addComplaint({
        category: 'Public Civic Grievance',
        description: description.trim(),
        photoUrl: photoPreview || '',
        videoName: videoName || '',
        hasVoice: voiceRecorded,
        ward: residentWard,
        area: currentUser?.area || 'V.O.C Street, Ward 24'
      });

      // Reset Form
      setDescription('');
      setPhotoPreview(null);
      setPhotoName('');
      setVideoName('');
      setVoiceRecorded(false);

      // Switch to status tab to view the submitted complaint
      setActiveTab('STATUS');
    } catch (err) {
      console.error('Error submitting grievance:', err);
      showToast(lang === 'ta' ? 'புகார் பதிவு செய்வதில் பிழை' : 'Failed to register grievance', 'error');
    }
  };

  // Save Profile Changes
  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateResidentProfile({
      name: editName,
      phone: editPhone,
      area: editArea
    });
    setIsEditModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col max-w-[420px] mx-auto w-full select-none">
      {/* Scrollable Content Container with mobile bottom clearance */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-28 space-y-4">

        {/* ============================================================== */}
        {/* TAB 1: REPORT GRIEVANCE (புகார் பதிவு)                         */}
        {/* ============================================================== */}
        {activeTab === 'REPORT' && (
          <div className="space-y-4 animate-fade-in">
            {/* Header */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-yellowSoft border border-brand-yellow text-amber-900 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse"></span>
                <span>{lang === 'ta' ? 'நேரடி புகார் பதிவு • AC 121' : 'Lodge Grievance • AC 121'}</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {lang === 'ta' ? 'புகார் பதிவு செய்ய' : 'Submit Civic Complaint'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {lang === 'ta'
                  ? 'உங்கள் பகுதி குறை அல்லது புகாரை விபரமாக எழுதி அனுப்பவும்'
                  : 'Write your local civic issue in detail and attach media.'}
              </p>
            </div>

            {/* Grievance Form */}
            <form onSubmit={handleSubmitGrievance} className="bg-white rounded-2xl p-4 border border-brand-cardBorder shadow-xs space-y-3.5">
              {/* Description Textarea (Letter / Details) */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5 flex items-center justify-between">
                  <span>{lang === 'ta' ? 'புகார் விபரம் (Complaint Details) *' : 'Complaint Details *'}</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {lang === 'ta' ? 'தெரு / பகுதி விபரம்' : 'Street / Area details'}
                  </span>
                </label>
                <textarea
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={
                    lang === 'ta'
                      ? 'உங்கள் பகுதி குறை, தெரு பெயர் அல்லது அடையாளத்தை விரிவாக இங்கு எழுதவும்...'
                      : 'Describe the issue in detail with street name, landmark, or house number...'
                  }
                  className="w-full p-3 text-xs sm:text-sm rounded-xl border border-amber-200 bg-white text-slate-800 placeholder-slate-400 font-medium focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none shadow-2xs resize-none"
                  required
                ></textarea>
              </div>

              {/* Media Attachments (Photo, Video, Voice) */}
              <div className="grid grid-cols-3 gap-2">
                {/* 1. Photo Upload */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1 truncate">
                    {lang === 'ta' ? 'புகைப்படம்' : 'Photo'}
                  </label>
                  <label className="h-20 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-amber-300 hover:border-brand-red bg-brand-appBg cursor-pointer p-1 text-center transition-colors relative overflow-hidden">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-brand-red text-[20px]">add_a_photo</span>
                        <span className="text-[10px] text-slate-600 font-semibold mt-1 truncate max-w-full px-0.5">
                          {photoName ? photoName.slice(0, 10) : (lang === 'ta' ? 'படம் இணைக்க' : 'Upload')}
                        </span>
                      </>
                    )}
                  </label>
                </div>

                {/* 2. Video Upload */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1 truncate">
                    {lang === 'ta' ? 'வீடியோ' : 'Video'}
                  </label>
                  <label className="h-20 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-amber-300 hover:border-brand-red bg-brand-appBg cursor-pointer p-1 text-center transition-colors">
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleVideoChange}
                    />
                    <span className={`material-symbols-outlined text-[20px] ${videoName ? 'text-emerald-600' : 'text-brand-red'}`}>
                      {videoName ? 'check_circle' : 'videocam'}
                    </span>
                    <span className="text-[10px] text-slate-600 font-semibold mt-1 truncate max-w-full px-0.5">
                      {videoName ? videoName.slice(0, 10) : (lang === 'ta' ? 'வீடியோ' : 'Upload')}
                    </span>
                  </label>
                </div>

                {/* 3. Voice Recording */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1 truncate">
                    {lang === 'ta' ? 'குரல் பதிவு' : 'Voice Note'}
                  </label>
                  <div className="h-20 rounded-xl border border-amber-200 bg-brand-appBg flex flex-col items-center justify-center p-1 text-center">
                    <button
                      type="button"
                      onClick={handleToggleVoice}
                      className={`w-7 h-7 rounded-full flex items-center justify-center shadow-xs transition-colors cursor-pointer ${
                        isRecording 
                          ? 'bg-red-600 text-white animate-pulse' 
                          : voiceRecorded 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-brand-redSoft text-brand-red hover:bg-brand-red hover:text-white'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {isRecording ? 'stop' : voiceRecorded ? 'mic_none' : 'mic'}
                      </span>
                    </button>
                    <span className="text-[10px] text-slate-600 font-semibold mt-1 truncate max-w-full">
                      {isRecording 
                        ? (lang === 'ta' ? 'பதிவாகிறது...' : 'Recording...') 
                        : voiceRecorded 
                          ? (lang === 'ta' ? 'சேமிக்கப்பட்டது' : 'Saved (0:14)') 
                          : (lang === 'ta' ? 'பேசவும்' : 'Tap to speak')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-brand-red hover:bg-brand-redHover active:scale-[0.99] text-white font-bold text-sm tracking-wide uppercase shadow-lg shadow-red-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[19px]">send</span>
                <span>{lang === 'ta' ? 'புகாரை சமர்ப்பிக்க' : 'Submit Grievance'}</span>
              </button>
            </form>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: STATUS & MY GRIEVANCES (நிலை கண்காணிப்பு)              */}
        {/* ============================================================== */}
        {activeTab === 'STATUS' && (
          <div className="space-y-3.5 animate-fade-in">
            {/* Header & Subtitle */}
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-yellowSoft border border-brand-yellow text-amber-900 text-[11px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse"></span>
                  <span>{lang === 'ta' ? 'நேரடி கண்காணிப்பு • Live Tracking' : 'Live Grievance Tracking'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('REPORT')}
                  className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-red-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <span>{lang === 'ta' ? 'புதிய புகார் +' : 'New Grievance +'}</span>
                </button>
              </div>

              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
                {lang === 'ta' ? 'புகார் நிலை கண்காணிப்பு' : 'Grievance Status Tracker'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {lang === 'ta'
                  ? 'உங்கள் புகார்களின் நேரடி தீர்வு நிலை மற்றும் தீர்வு புகைப்படங்கள்'
                  : 'Track your complaints status, field progress and resolution photos.'}
              </p>
            </div>

            {/* Filter Tabs: ALL | NOT SOLVED | SOLVED */}
            <div className="bg-amber-100/70 p-1 rounded-2xl border border-amber-200/80 flex items-center justify-between text-xs font-bold shadow-2xs gap-1">
              <button
                type="button"
                onClick={() => setStatusFilter('ALL')}
                className={`flex-1 py-1.5 text-center rounded-xl transition-all cursor-pointer ${
                  statusFilter === 'ALL'
                    ? 'bg-brand-red text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {lang === 'ta' ? 'அனைத்தும்' : 'ALL'} ({totalCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('NOT_SOLVED')}
                className={`flex-1 py-1.5 text-center rounded-xl transition-all cursor-pointer ${
                  statusFilter === 'NOT_SOLVED'
                    ? 'bg-brand-red text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {lang === 'ta' ? 'தீர்க்கப்படாதவை' : 'NOT SOLVED'} ({notSolvedCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('SOLVED')}
                className={`flex-1 py-1.5 text-center rounded-xl transition-all cursor-pointer ${
                  statusFilter === 'SOLVED'
                    ? 'bg-brand-red text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {lang === 'ta' ? 'தீர்க்கப்பட்டவை' : 'SOLVED'} ({solvedCount})
              </button>
            </div>

            {/* Grievance Cards List */}
            <div className="space-y-3.5">
              {filteredComplaints.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center border border-amber-200 text-slate-500 space-y-2">
                  <span className="material-symbols-outlined text-4xl text-amber-400">inventory_2</span>
                  <p className="text-xs font-bold">
                    {lang === 'ta' ? 'இப்பிரிவில் புகார்கள் எதுவும் இல்லை' : 'No grievances found in this category'}
                  </p>
                </div>
              ) : (
                filteredComplaints.map(comp => {
                  const isCompleted = comp.status === 'COMPLETED';

                  return (
                    <div
                      key={comp.id}
                      className={`bg-white rounded-2xl p-4 border shadow-xs space-y-3 relative overflow-hidden ${
                        isCompleted ? 'border-emerald-200' : 'border-brand-cardBorder'
                      }`}
                    >
                      {/* Top status accent line */}
                      <div
                        className={`absolute top-0 left-0 right-0 h-1 ${
                          isCompleted
                            ? 'bg-emerald-500'
                            : 'bg-gradient-to-r from-amber-500 to-[#EF4444]'
                        }`}
                      ></div>

                      {/* Header: Complaint ID, Date & Top Solved/Not Solved Button */}
                      <div className="flex items-start justify-between gap-2 pt-0.5">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-700 tracking-wider">
                              #{comp.id}
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium flex items-center gap-0.5">
                              <span className="material-symbols-outlined text-[13px] text-slate-400">schedule</span>
                              <span>{comp.createdAt}</span>
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-1">
                            <span className="material-symbols-outlined text-[13px] text-brand-red">location_on</span>
                            <span>{comp.area || 'Ward 24, Singanallur'}</span>
                          </div>
                        </div>

                        {/* Top Solved / Not Solved Button */}
                        <div
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black shrink-0 shadow-2xs ${
                            isCompleted
                              ? 'bg-emerald-50 text-emerald-800 border-2 border-emerald-300'
                              : 'bg-amber-50 text-amber-900 border-2 border-amber-300'
                          }`}
                        >
                          {isCompleted ? (
                            <>
                              <span className="material-symbols-outlined text-[16px] text-emerald-600 font-black">check_circle</span>
                              <span>{lang === 'ta' ? 'Solved ✓' : 'Solved ✓'}</span>
                            </>
                          ) : (
                            <>
                              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                              <span>{lang === 'ta' ? 'Not Solved' : 'Not Solved'}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Citizen's Complaint Letter / Details */}
                      <div className="p-3 rounded-xl bg-brand-appBg border border-amber-100 text-xs text-slate-800 leading-relaxed font-medium">
                        {comp.description}
                      </div>

                      {/* Citizen's Attached Photo (if uploaded) */}
                      {comp.photoUrl && (
                        <div className="rounded-xl overflow-hidden border border-amber-200">
                          <img
                            src={comp.photoUrl}
                            alt="Complaint Issue"
                            className="w-full h-36 object-cover"
                            onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }}
                          />
                          <div className="bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-900 border-t border-amber-200 flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-[13px]">image</span>
                              <span>{lang === 'ta' ? 'குடிமகன் இணைத்த புகைப்படம்' : 'Issue Photo Attached'}</span>
                            </span>
                            <span className="text-slate-500 font-normal">Singanallur AC</span>
                          </div>
                        </div>
                      )}

                      {/* Voice Note Indicator (if recorded) */}
                      {comp.hasAudio && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 text-brand-red border border-red-200 text-[11px] font-bold w-fit">
                          <span className="material-symbols-outlined text-[14px]">mic</span>
                          <span>{lang === 'ta' ? 'குரல் பதிவு இணைக்கப்பட்டுள்ளது' : 'Voice note attached'}</span>
                        </div>
                      )}

                      {/* Resolution Photo by Ward Officer (Shown when Solved) */}
                      {isCompleted && comp.completionPhotoUrl && (
                        <div className="rounded-xl overflow-hidden border-2 border-emerald-300 shadow-xs space-y-0">
                          <div className="bg-emerald-600 text-white px-2.5 py-1 text-[10px] font-bold flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">task_alt</span>
                              <span>{lang === 'ta' ? 'தீர்வு புகைப்படம் (வார்டு செயலாளர்)' : 'Resolution Photo (Ward Officer)'}</span>
                            </span>
                            <span className="bg-white/20 px-1.5 py-0.5 rounded text-[9px]">Verified Work</span>
                          </div>
                          <img
                            src={comp.completionPhotoUrl}
                            alt="Resolution Work Proof"
                            className="w-full h-36 object-cover"
                            onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: CONTACTS & OFFICIALS (தொகுதி பிரதிநிதிகள்)              */}
        {/* ============================================================== */}
        {activeTab === 'CONTACTS' && (
          <div className="space-y-4 animate-fade-in">
            {/* Header */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-yellowSoft border border-brand-yellow text-amber-900 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-brand-red"></span>
                <span>{lang === 'ta' ? 'தொகுதி தொடர்புகள் • AC 121' : 'Constituency Contacts • AC 121'}</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {lang === 'ta' ? 'சிங்காநல்லூர் முக்கிய தொடர்புகள்' : 'Singanallur Official Contacts'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {lang === 'ta'
                  ? 'வார்டு மற்றும் துறை சார்ந்த அதிகாரிகளை நேரடியாக தொடர்பு கொள்ளவும்'
                  : 'Direct civic representatives, ward field coordinators and department helplines.'}
              </p>
            </div>

            {/* Official Contacts List */}
            <div className="space-y-2.5">
              {OFFICIALS_DIRECTORY.map((officer) => (
                <div
                  key={officer.id}
                  className="bg-white rounded-2xl p-3.5 border border-brand-cardBorder shadow-xs flex items-center justify-between gap-3 hover:border-amber-300 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-brand-red text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                      <span className="material-symbols-outlined text-[22px]">
                        {officer.type === 'AREA_HEAD' ? 'account_circle' : officer.type === 'BOOTH_MEMBER' ? 'how_to_reg' : 'support_agent'}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight truncate">
                        {lang === 'ta' ? officer.nameTa : officer.nameEn}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {lang === 'ta' ? officer.roleTa : officer.roleEn}
                      </p>
                      <span className="text-[11px] text-slate-700 font-bold tracking-wide mt-0.5 block">
                        {officer.phone}
                      </span>
                    </div>
                  </div>
                  <a
                    href={`tel:${officer.phone.replace(/[^0-9+]/g, '')}`}
                    className="w-10 h-10 rounded-xl bg-brand-red hover:bg-brand-redHover active:scale-95 text-white flex items-center justify-center shadow-md shadow-red-500/20 shrink-0 cursor-pointer"
                    title="Call"
                  >
                    <span className="material-symbols-outlined text-[19px]">call</span>
                  </a>
                </div>
              ))}

              {/* MLA Office Contact */}
              <div className="bg-gradient-to-r from-amber-50 to-red-50 rounded-2xl p-3.5 border border-brand-cardBorder shadow-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                    <span className="material-symbols-outlined text-[22px]">account_balance</span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight truncate">
                      {lang === 'ta' ? MLA_INFO.nameTa : MLA_INFO.nameEn}
                    </h4>
                    <p className="text-[11px] text-slate-600 truncate mt-0.5">
                      {lang === 'ta' ? MLA_INFO.titleTa : MLA_INFO.titleEn}
                    </p>
                    <span className="text-[11px] text-slate-800 font-bold tracking-wide mt-0.5 block">
                      {MLA_INFO.phone}
                    </span>
                  </div>
                </div>
                <a
                  href={`tel:${MLA_INFO.phone.replace(/[^0-9+]/g, '')}`}
                  className="w-10 h-10 rounded-xl bg-brand-red hover:bg-brand-redHover active:scale-95 text-white flex items-center justify-center shadow-md shadow-red-500/20 shrink-0 cursor-pointer"
                  title="Call MLA Office"
                >
                  <span className="material-symbols-outlined text-[19px]">call</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: PROFILE (சுயவிவரம்)                                    */}
        {/* ============================================================== */}
        {activeTab === 'PROFILE' && (
          <div className="space-y-4 animate-fade-in">
            {/* Identity Card */}
            <div className="bg-white rounded-2xl p-4 border border-brand-cardBorder shadow-xs text-center relative overflow-hidden">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#EF4444] to-[#DC2626] text-white font-extrabold text-2xl flex items-center justify-center shadow-md shadow-red-500/20 mx-auto mb-2.5 border-2 border-white p-2">
                <img
                  src={TVK_WHISTLE_LOGO_URL}
                  alt="TVK Whistle Logo"
                  className="w-full h-full object-contain brightness-0 invert"
                />
              </div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                {currentUser?.name || 'Sampooraniyan (சம் பூரணியன்)'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {lang === 'ta' ? 'சிங்காநல்லூர் தொகுதி குடிமகன்' : 'Singanallur AC 121 Registered Citizen'}
              </p>
              <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-brand-yellowSoft border border-brand-yellow text-xs font-bold text-amber-900">
                <span className="material-symbols-outlined text-[15px] text-amber-600">verified_user</span>
                <span>Voter ID: {currentUser?.voterId || 'TNH121-98741'}</span>
              </div>
            </div>

            {/* Resident Details List */}
            <div className="bg-white rounded-2xl p-4 border border-brand-cardBorder shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  {lang === 'ta' ? 'குடிமக்கள் விபரம்' : 'Citizen Information'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="text-xs font-bold text-brand-red hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">edit</span>
                  <span>{lang === 'ta' ? 'விபரம் மாற்ற' : 'Edit Profile'}</span>
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-amber-50">
                  <span className="text-slate-500">{lang === 'ta' ? 'தொலைபேசி எண்' : 'Phone Number'}</span>
                  <span className="font-bold text-slate-800">{currentUser?.phone || '+91 94432 18890'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-amber-50">
                  <span className="text-slate-500">{lang === 'ta' ? 'வார்டு எண்' : 'Ward Number'}</span>
                  <span className="font-bold text-slate-800">Ward {residentWard} (சிங்காநல்லூர்)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-amber-50">
                  <span className="text-slate-500">{lang === 'ta' ? 'பகுதி / முகவரி' : 'Area / Locality'}</span>
                  <span className="font-bold text-slate-800">{currentUser?.area || 'V.O.C Street, Ward 24'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-amber-50">
                  <span className="text-slate-500">{lang === 'ta' ? 'வாக்குச்சாவடி' : 'Polling Booth'}</span>
                  <span className="font-bold text-slate-800">{currentUser?.booth || 'Booth 142 - Corporation School'}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">{lang === 'ta' ? 'செயலி மொழி' : 'Language'}</span>
                  <span className="font-bold text-brand-red">{lang === 'ta' ? 'தமிழ்' : 'English'}</span>
                </div>
              </div>
            </div>

            {/* Logout Action */}
            <button
              type="button"
              onClick={logout}
              className="w-full h-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-slate-500">logout</span>
              <span>{lang === 'ta' ? 'வெளியேறு (Logout)' : 'Logout'}</span>
            </button>
          </div>
        )}

      </div>

      {/* ============================================================== */}
      {/* FIXED MOBILE BOTTOM NAVIGATION                                */}
      {/* ============================================================== */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-amber-200/80 shadow-lg select-none">
        <div className="flex items-center justify-around h-16 px-2 max-w-[420px] mx-auto">
          {/* Tab 1: REPORT */}
          <button
            type="button"
            onClick={() => setActiveTab('REPORT')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all cursor-pointer ${
              activeTab === 'REPORT' ? 'text-brand-red font-bold' : 'text-slate-500 font-medium'
            }`}
          >
            <span className={`material-symbols-outlined text-[22px] ${activeTab === 'REPORT' ? 'fill' : ''}`}>
              campaign
            </span>
            <span className="text-[11px] mt-0.5">{lang === 'ta' ? 'புகார்' : 'REPORT'}</span>
          </button>

          {/* Tab 2: STATUS */}
          <button
            type="button"
            onClick={() => setActiveTab('STATUS')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all relative cursor-pointer ${
              activeTab === 'STATUS' ? 'text-brand-red font-bold' : 'text-slate-500 font-medium'
            }`}
          >
            <span className={`material-symbols-outlined text-[22px] ${activeTab === 'STATUS' ? 'fill' : ''}`}>
              list_alt
            </span>
            <span className="text-[11px] mt-0.5">{lang === 'ta' ? 'நிலை' : 'STATUS'}</span>
            {notSolvedCount > 0 && (
              <span className="absolute top-2.5 right-6 w-2 h-2 rounded-full bg-brand-red ring-2 ring-white"></span>
            )}
          </button>

          {/* Tab 3: CONTACTS */}
          <button
            type="button"
            onClick={() => setActiveTab('CONTACTS')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all cursor-pointer ${
              activeTab === 'CONTACTS' ? 'text-brand-red font-bold' : 'text-slate-500 font-medium'
            }`}
          >
            <span className={`material-symbols-outlined text-[22px] ${activeTab === 'CONTACTS' ? 'fill' : ''}`}>
              contact_phone
            </span>
            <span className="text-[11px] mt-0.5">{lang === 'ta' ? 'தொடர்பு' : 'CONTACTS'}</span>
          </button>

          {/* Tab 4: PROFILE */}
          <button
            type="button"
            onClick={() => setActiveTab('PROFILE')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all cursor-pointer ${
              activeTab === 'PROFILE' ? 'text-brand-red font-bold' : 'text-slate-500 font-medium'
            }`}
          >
            <span className={`material-symbols-outlined text-[22px] ${activeTab === 'PROFILE' ? 'fill' : ''}`}>
              person
            </span>
            <span className="text-[11px] mt-0.5">{lang === 'ta' ? 'சுயவிவரம்' : 'PROFILE'}</span>
          </button>
        </div>

        {/* Mobile Home Indicator */}
        <div className="pb-1.5 pt-0.5 flex justify-center bg-white">
          <div className="w-32 h-1 bg-slate-300 rounded-full"></div>
        </div>
      </nav>

      {/* ============================================================== */}
      {/* EDIT PROFILE MODAL DIALOG                                      */}
      {/* ============================================================== */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-[380px] rounded-2xl border border-brand-cardBorder p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-amber-100 pb-2.5">
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                {lang === 'ta' ? 'சுயவிபரம் திருத்துக' : 'Edit Resident Profile'}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {lang === 'ta' ? 'முழு பெயர்' : 'Full Name'}
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full h-10 px-3 text-xs rounded-xl border border-amber-200 bg-white font-medium focus:border-brand-red outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {lang === 'ta' ? 'தொலைபேசி எண்' : 'Phone Number'}
                </label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full h-10 px-3 text-xs rounded-xl border border-amber-200 bg-white font-medium focus:border-brand-red outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {lang === 'ta' ? 'பகுதி / முகவரி' : 'Area / Locality'}
                </label>
                <input
                  type="text"
                  value={editArea}
                  onChange={(e) => setEditArea(e.target.value)}
                  className="w-full h-10 px-3 text-xs rounded-xl border border-amber-200 bg-white font-medium focus:border-brand-red outline-none"
                  required
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 h-10 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  {lang === 'ta' ? 'ரத்து' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-xl bg-brand-red hover:bg-brand-redHover text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  {lang === 'ta' ? 'சேமிக்க' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
