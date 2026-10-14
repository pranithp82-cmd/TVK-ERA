import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TVK_WHISTLE_LOGO_URL, OFFICIALS_DIRECTORY } from '../data/singanallurData';

export const CitizenScreen = () => {
  const {
    currentUser,
    complaints,
    addComplaint,
    updateResidentProfile,
    logout,
    showToast,
    t,
    lang
  } = useApp();

  // Active Tab: 'REPORT' | 'STATUS' | 'CONTACTS' | 'PROFILE'
  const [activeTab, setActiveTab] = useState('STATUS');

  // Grievance Form State
  const [category, setCategory] = useState('Roads & Streetlights');
  const [description, setDescription] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoName, setPhotoName] = useState('');
  const [videoName, setVideoName] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [voiceRecorded, setVoiceRecorded] = useState(false);

  // Status Filter: 'ALL' | 'IN_PROGRESS' | 'COMPLETED'
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Profile Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(currentUser?.name || 'Sampooraniyan (சம் பூரணியன்)');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '+91 94432 18890');
  const [editArea, setEditArea] = useState(currentUser?.area || 'V.O.C Street, Ward 24');

  // Filter complaints for current resident or ward
  const residentWard = currentUser?.ward || 24;
  const filteredComplaints = complaints.filter(c => {
    if (statusFilter === 'IN_PROGRESS') return c.status !== 'COMPLETED';
    if (statusFilter === 'COMPLETED') return c.status === 'COMPLETED';
    return true;
  });

  const reportedCount = complaints.length;
  const inProgressCount = complaints.filter(c => c.status !== 'COMPLETED').length;
  const resolvedCount = complaints.filter(c => c.status === 'COMPLETED').length;

  // Handle Photo Pick
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoName(file.name);
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setPhotoPreview(uploadEvent.target.result);
      };
      reader.readAsDataURL(file);
      showToast(`${file.name} attached`, 'success');
    }
  };

  // Handle Video Pick
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoName(file.name);
      showToast(`Video attached: ${file.name}`, 'success');
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
      }, 3500);
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
      showToast(lang === 'ta' ? 'புகார் விபரங்களை உள்ளிடவும்.' : 'Please enter complaint details.', 'error');
      return;
    }

    addComplaint({
      category,
      description,
      photoUrl: photoPreview,
      videoName,
      hasVoice: voiceRecorded,
      ward: residentWard,
      area: currentUser?.area || 'V.O.C Street'
    });

    // Reset Form
    setDescription('');
    setPhotoPreview(null);
    setPhotoName('');
    setVideoName('');
    setVoiceRecorded(false);

    // Navigate to status tab
    setTimeout(() => {
      setActiveTab('STATUS');
    }, 600);
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
    <div className="flex-1 flex flex-col max-w-[420px] mx-auto w-full pb-20 select-none">
      {/* Scrollable Content Container */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">

        {/* ============================================================== */}
        {/* RESIDENT WARD STATUS CARD                                      */}
        {/* ============================================================== */}
        <section className="bg-white rounded-2xl p-4 border border-brand-cardBorder shadow-xs relative overflow-hidden">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-yellowSoft border border-brand-yellow text-amber-900 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span>{lang === 'ta' ? `வார்டு ${residentWard} • சிங்காநல்லூர்` : `Ward ${residentWard} • Singanallur`}</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 pt-1">
                {currentUser?.name || 'Sampooraniyan (சம் பூரணியன்)'}
              </h2>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-slate-400">home_pin</span>
                <span>{currentUser?.area || 'V.O.C Street, Ward 24, Singanallur'}</span>
              </p>
            </div>

            {/* Emergency Hotline Button */}
            <a
              href="tel:1950"
              className="px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-brand-red border border-red-200 text-xs font-bold flex items-center gap-1 shadow-2xs active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">emergency</span>
              <span>1950</span>
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-amber-100 text-center">
            <div className="bg-amber-50/60 rounded-xl p-1.5 border border-amber-200/60">
              <div className="text-[10px] font-bold text-slate-500 uppercase">{t.statReported}</div>
              <div className="text-sm font-black text-slate-900 mt-0.5">{reportedCount}</div>
            </div>
            <div className="bg-amber-100/60 rounded-xl p-1.5 border border-amber-300/60">
              <div className="text-[10px] font-bold text-amber-900 uppercase">{t.statInProgress}</div>
              <div className="text-sm font-black text-amber-800 mt-0.5">{inProgressCount}</div>
            </div>
            <div className="bg-emerald-50 rounded-xl p-1.5 border border-emerald-200">
              <div className="text-[10px] font-bold text-emerald-800 uppercase">{t.statResolved}</div>
              <div className="text-sm font-black text-emerald-700 mt-0.5">{resolvedCount}</div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* TAB 1: REPORT GRIEVANCE (புகார் பதிவு)                         */}
        {/* ============================================================== */}
        {activeTab === 'REPORT' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-white rounded-2xl p-4 border border-brand-cardBorder shadow-xs space-y-3.5">
              <div className="flex items-center justify-between border-b border-amber-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-brand-redSoft text-brand-red flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[18px]">campaign</span>
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900 tracking-wide uppercase">
                    {t.reportTabTitle}
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-slate-400">{t.ac121Direct}</span>
              </div>

              {/* Category Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                  {t.labelCategory}
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-11 px-3 text-xs sm:text-sm rounded-xl border border-amber-200/90 bg-white text-slate-800 font-medium focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none shadow-2xs cursor-pointer"
                  >
                    <option value="Roads & Streetlights">Roads & Streetlights / சாலை & தெருவிளக்கு</option>
                    <option value="Water Supply & Sewage">Water Supply & Sewage / குடிநீர் & கழிவுநீர்</option>
                    <option value="Garbage & Sanitation">Garbage & Sanitation / தூய்மைப்பணி</option>
                    <option value="Public Health & Parks">Public Health & Parks / சுகாதாரம் & பூங்காக்கள்</option>
                    <option value="Other Civic Inquiries">Other Civic Inquiries / இதர கோரிக்கைகள்</option>
                  </select>
                </div>
              </div>

              {/* Description Textarea */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                  {t.labelDetails}
                </label>
                <textarea
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t.detailsPlaceholder}
                  className="w-full p-3 text-xs sm:text-sm rounded-xl border border-amber-200/90 bg-white text-slate-800 placeholder-slate-400 font-medium focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none shadow-2xs resize-none"
                  required
                ></textarea>
              </div>

              {/* Media Upload Grid (Photo, Video, Voice) */}
              <div className="grid grid-cols-3 gap-2">
                {/* 1. Photo Upload */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1 truncate">
                    {t.labelPhoto}
                  </label>
                  <label className="h-20 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-amber-300 hover:border-brand-red bg-brand-appBg cursor-pointer p-1.5 text-center transition-colors relative overflow-hidden">
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
                          {photoName ? photoName.slice(0, 10) : t.uploadPhotoPrompt}
                        </span>
                      </>
                    )}
                  </label>
                </div>

                {/* 2. Video Upload */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1 truncate">
                    {t.labelVideo}
                  </label>
                  <label className="h-20 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-amber-300 hover:border-brand-red bg-brand-appBg cursor-pointer p-1.5 text-center transition-colors">
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
                      {videoName ? videoName.slice(0, 10) : t.uploadVideoPrompt}
                    </span>
                  </label>
                </div>

                {/* 3. Voice Recording */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1 truncate">
                    {t.labelVoice}
                  </label>
                  <div className="h-20 rounded-xl border border-amber-200/90 bg-brand-appBg flex flex-col items-center justify-center p-1.5 text-center">
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
                      {isRecording ? t.recordingInProgress : voiceRecorded ? t.voiceSaved : t.tapToRecord}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmitGrievance}
                className="w-full h-11 rounded-xl bg-brand-red hover:bg-brand-redHover active:scale-[0.99] text-white font-bold text-sm tracking-wide uppercase shadow-lg shadow-red-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[19px]">send</span>
                <span>{t.submitBtn}</span>
              </button>
            </div>

            {/* Recent Activity Quick Preview */}
            <div className="bg-white rounded-xl p-3.5 border border-brand-cardBorder flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">pending_actions</span>
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900 leading-tight">Damaged Pipeline Repair</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">V.O.C Street • Action: Inspection dispatched</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('STATUS')}
                className="px-2.5 py-1 rounded-full bg-brand-yellowSoft text-[10px] font-bold text-amber-900 border border-brand-yellow shrink-0 cursor-pointer"
              >
                View
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: STATUS & MY GRIEVANCES (நிலை கண்காணிப்பு)              */}
        {/* ============================================================== */}
        {activeTab === 'STATUS' && (
          <div className="space-y-3.5 animate-fade-in">
            {/* Header & Subtitle */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-yellowSoft border border-brand-yellow text-amber-900 text-[11px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse"></span>
                  <span>நேரடி கண்காணிப்பு • Live Tracking</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('REPORT')}
                  className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-red-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <span>{lang === 'ta' ? 'புதிய மனு +' : 'New +'}</span>
                </button>
              </div>

              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight leading-tight">
                  {t.statusTabTitle}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  {t.statusTabSub}
                </p>
              </div>
            </div>

            {/* Filter Tabs */}
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
                {t.filterAll} ({complaints.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('IN_PROGRESS')}
                className={`flex-1 py-1.5 text-center rounded-xl transition-all cursor-pointer ${
                  statusFilter === 'IN_PROGRESS'
                    ? 'bg-brand-red text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {t.filterInProgress} ({inProgressCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('COMPLETED')}
                className={`flex-1 py-1.5 text-center rounded-xl transition-all cursor-pointer ${
                  statusFilter === 'COMPLETED'
                    ? 'bg-brand-red text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {t.filterCompleted} ({resolvedCount})
              </button>
            </div>

            {/* Grievance Cards List */}
            <div className="space-y-3.5">
              {filteredComplaints.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center border border-amber-200 text-slate-500 space-y-2">
                  <span className="material-symbols-outlined text-4xl text-amber-400">inventory_2</span>
                  <p className="text-xs font-bold">No grievances found in this category</p>
                </div>
              ) : (
                filteredComplaints.map(comp => {
                  const isCompleted = comp.status === 'COMPLETED';
                  const stage = isCompleted ? 4 : (comp.stage || 2);

                  return (
                    <div
                      key={comp.id}
                      className={`bg-white rounded-2xl p-4 border shadow-xs space-y-3.5 relative overflow-hidden ${
                        isCompleted ? 'border-emerald-200' : 'border-brand-cardBorder'
                      }`}
                    >
                      {/* Top status accent border */}
                      <div
                        className={`absolute top-0 left-0 right-0 h-1 ${
                          isCompleted
                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                            : 'bg-gradient-to-r from-amber-500 to-[#EF4444]'
                        }`}
                      ></div>

                      {/* Header: ID + Badge */}
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
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-1.5 leading-snug">
                            {comp.title || comp.category}
                          </h4>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
                            isCompleted
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-brand-yellowSoft text-amber-900 border border-brand-yellow'
                          }`}
                        >
                          {isCompleted ? (
                            <>
                              <span className="material-symbols-outlined text-[13px] text-emerald-700">check_circle</span>
                              <span>{lang === 'ta' ? 'தீர்க்கப்பட்டது ✓' : 'Resolved ✓'}</span>
                            </>
                          ) : (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                              <span>{lang === 'ta' ? 'செயலில் உள்ளது' : 'In Progress'}</span>
                            </>
                          )}
                        </span>
                      </div>

                      {/* Description */}
                      <div className="p-2.5 rounded-xl bg-brand-appBg/80 border border-amber-100 text-xs text-slate-700 leading-relaxed">
                        {comp.description}
                      </div>

                      {/* Optional Photo Attachment */}
                      {comp.photoUrl && (
                        <div className="rounded-xl overflow-hidden border border-amber-200/80 max-h-36">
                          <img src={comp.photoUrl} alt="Complaint" className="w-full h-32 object-cover" />
                        </div>
                      )}

                      {/* 4-Stage Resolution Stepper */}
                      <div className="pt-1">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2 flex items-center justify-between">
                          <span>{lang === 'ta' ? 'தீர்வு கட்டங்கள் (Stages)' : 'Resolution Stages'}</span>
                          <span className={isCompleted ? 'text-emerald-700 font-bold' : 'text-brand-red font-semibold'}>
                            {lang === 'ta' ? `கட்டம் ${stage} / 4` : `Stage ${stage} / 4`}
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-1 relative">
                          {/* Step 1 */}
                          <div className="flex flex-col items-center text-center space-y-1">
                            <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                              <span className="material-symbols-outlined text-[14px]">done</span>
                            </div>
                            <span className="text-[9px] font-bold text-emerald-800 leading-tight">பதிவு</span>
                          </div>
                          {/* Step 2 */}
                          <div className={`flex flex-col items-center text-center space-y-1 ${stage >= 2 ? '' : 'opacity-50'}`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              stage >= 2 
                                ? 'bg-amber-100 border border-amber-300 text-amber-900 ring-2 ring-amber-200' 
                                : 'bg-slate-100 border border-slate-200 text-slate-500'
                            }`}>
                              <span className="material-symbols-outlined text-[14px]">engineering</span>
                            </div>
                            <span className="text-[9px] font-bold text-amber-900 leading-tight">அதிகாரி</span>
                          </div>
                          {/* Step 3 */}
                          <div className={`flex flex-col items-center text-center space-y-1 ${stage >= 3 ? '' : 'opacity-50'}`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              stage >= 3
                                ? 'bg-amber-100 border border-amber-300 text-amber-900 ring-2 ring-amber-200'
                                : 'bg-slate-100 border border-slate-200 text-slate-500'
                            }`}>
                              <span className="material-symbols-outlined text-[13px]">build</span>
                            </div>
                            <span className="text-[9px] font-medium text-slate-600 leading-tight">கள ஆய்வு</span>
                          </div>
                          {/* Step 4 */}
                          <div className={`flex flex-col items-center text-center space-y-1 ${isCompleted ? '' : 'opacity-50'}`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              isCompleted
                                ? 'bg-emerald-50 border border-emerald-200 text-emerald-700 ring-2 ring-emerald-200'
                                : 'bg-slate-100 border border-slate-200 text-slate-500'
                            }`}>
                              <span className="material-symbols-outlined text-[13px]">verified</span>
                            </div>
                            <span className={`text-[9px] font-bold leading-tight ${isCompleted ? 'text-emerald-800' : 'text-slate-600'}`}>
                              {isCompleted ? 'தீர்வு ✓' : 'தீர்வு'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Taken Section */}
                      <div className={`rounded-xl p-3 border space-y-1.5 ${
                        isCompleted
                          ? 'bg-emerald-50/70 border-emerald-200'
                          : 'bg-brand-appBg border-amber-200/80 shadow-2xs'
                      }`}>
                        <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                          <div className="flex items-center gap-1.5">
                            <span className={`material-symbols-outlined text-[16px] ${isCompleted ? 'text-emerald-700' : 'text-amber-800'}`}>
                              {isCompleted ? 'task_alt' : 'construction'}
                            </span>
                            <span>{t.actionTakenLabel}</span>
                          </div>
                          {comp.wingName && (
                            <span className="text-[10px] text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded-full border border-amber-200">
                              {comp.wingName}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          {comp.actionTaken || 'Assigned to field team for inspection.'}
                        </p>

                        {/* Verified Seal Badge if Completed */}
                        {isCompleted && (
                          <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-emerald-200 text-xs shadow-2xs mt-2">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                                <span className="material-symbols-outlined text-[14px]">verified</span>
                              </div>
                              <span className="text-[10px] font-bold text-emerald-900">
                                {comp.verifiedBy || t.verifiedBadge}
                              </span>
                            </div>
                            <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                              AC 121
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Completion Photo Proof (if exists) */}
                      {comp.completionPhotoUrl && (
                        <div className="rounded-xl overflow-hidden border border-emerald-300">
                          <img src={comp.completionPhotoUrl} alt="Work Proof" className="w-full h-32 object-cover" />
                          <div className="bg-emerald-100 text-emerald-900 px-2 py-1 text-[10px] font-bold flex items-center justify-between">
                            <span>Verified Completion Proof</span>
                            <span>Photo Verified</span>
                          </div>
                        </div>
                      )}

                      {/* Footer Meta */}
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-amber-100">
                        <span className="flex items-center gap-1 text-slate-600">
                          <span className="material-symbols-outlined text-[15px] text-brand-red">location_on</span>
                          <span>{comp.area}</span>
                        </span>
                        {comp.hasAudio && (
                          <span className="font-bold text-brand-red flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand-redSoft border border-brand-redBorder/80">
                            <span className="material-symbols-outlined text-[13px]">mic</span>
                            <span>Audio Note</span>
                          </span>
                        )}
                      </div>
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
            <div>
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-tight">
                {t.contactsTabTitle}
              </h2>
              <p className="text-xs text-slate-500">{t.contactsTabSub}</p>
            </div>

            {/* Category 1: Area Coordinator */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 px-1">
                <span className="w-2 h-2 rounded-full bg-brand-red"></span>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  {t.secAreaCoord}
                </h3>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-brand-cardBorder shadow-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-brand-red text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                    <span className="material-symbols-outlined text-[24px]">account_circle</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">
                      K. Vijayakumar (விஜயகுமார்)
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">Constituency Head • Singanallur AC 121</p>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-600">
                      <span className="font-medium">+91 94432 10121</span>
                    </div>
                  </div>
                </div>
                <a
                  href="tel:+919443210121"
                  className="w-10 h-10 rounded-xl bg-brand-red hover:bg-brand-redHover active:scale-95 text-white flex items-center justify-center shadow-md shadow-red-500/20 shrink-0"
                  title="Call Officer"
                >
                  <span className="material-symbols-outlined text-[20px]">call</span>
                </a>
              </div>
            </div>

            {/* Category 2: Ward 24 Representatives */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-1.5 px-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  {t.secWardMembers}
                </h3>
              </div>

              {/* Member 1: Councillor */}
              <div className="bg-white rounded-2xl p-3.5 border border-brand-cardBorder shadow-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-yellowSoft text-amber-900 border border-brand-yellow flex items-center justify-center font-bold shrink-0">
                    <span className="material-symbols-outlined text-[22px]">badge</span>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                      M. Shanmugam (சண்முகம்)
                    </h4>
                    <p className="text-[11px] text-slate-500">Ward Councillor • Ward 24</p>
                    <span className="text-[11px] text-slate-600 font-medium">+91 98421 55678</span>
                  </div>
                </div>
                <a
                  href="tel:+919842155678"
                  className="w-9 h-9 rounded-xl bg-brand-red hover:bg-brand-redHover active:scale-95 text-white flex items-center justify-center shadow-sm shrink-0"
                >
                  <span className="material-symbols-outlined text-[18px]">call</span>
                </a>
              </div>

              {/* Member 2: Sanitation Inspector */}
              <div className="bg-white rounded-2xl p-3.5 border border-brand-cardBorder shadow-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-yellowSoft text-amber-900 border border-brand-yellow flex items-center justify-center font-bold shrink-0">
                    <span className="material-symbols-outlined text-[22px]">support_agent</span>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                      R. Meenakshi (மீனாட்சி)
                    </h4>
                    <p className="text-[11px] text-slate-500">Sanitation Inspector • Ward 24</p>
                    <span className="text-[11px] text-slate-600 font-medium">+91 94420 33812</span>
                  </div>
                </div>
                <a
                  href="tel:+919442033812"
                  className="w-9 h-9 rounded-xl bg-brand-red hover:bg-brand-redHover active:scale-95 text-white flex items-center justify-center shadow-sm shrink-0"
                >
                  <span className="material-symbols-outlined text-[18px]">call</span>
                </a>
              </div>
            </div>

            {/* Category 3: Booth 142 Committee */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-1.5 px-1">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  {t.secBoothMembers}
                </h3>
              </div>

              <div className="bg-white rounded-2xl p-3.5 border border-brand-cardBorder shadow-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold shrink-0">
                    <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                      S. Karthikeyan (கார்த்திகேயன்)
                    </h4>
                    <p className="text-[11px] text-slate-500">Booth Incharge • V.O.C Street (Booth 142)</p>
                    <span className="text-[11px] text-slate-600 font-medium">+91 97500 12345</span>
                  </div>
                </div>
                <a
                  href="tel:+919750012345"
                  className="w-9 h-9 rounded-xl bg-brand-red hover:bg-brand-redHover active:scale-95 text-white flex items-center justify-center shadow-sm shrink-0"
                >
                  <span className="material-symbols-outlined text-[18px]">call</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: PROFILE & EMERGENCY SOS (சுயவிபரம்)                     */}
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
              <p className="text-xs text-slate-500 mt-0.5">AC 121 Registered Citizen • Coimbatore</p>
              <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-brand-yellowSoft border border-brand-yellow text-xs font-bold text-amber-900">
                <span className="material-symbols-outlined text-[15px] text-amber-600">verified_user</span>
                <span>Voter ID: {currentUser?.voterId || 'TNH121-98741'}</span>
              </div>
            </div>

            {/* Resident Details List */}
            <div className="bg-white rounded-2xl p-4 border border-brand-cardBorder shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  {t.profileInfoTitle}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="text-xs font-bold text-brand-red hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">edit</span>
                  <span>{t.editBtn}</span>
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-amber-50">
                  <span className="text-slate-500">{t.lblPhone}</span>
                  <span className="font-bold text-slate-800">{currentUser?.phone || '+91 94432 18890'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-amber-50">
                  <span className="text-slate-500">{t.lblWard}</span>
                  <span className="font-bold text-slate-800">Ward {residentWard}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-amber-50">
                  <span className="text-slate-500">{t.lblArea}</span>
                  <span className="font-bold text-slate-800">{currentUser?.area || 'V.O.C Street'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-amber-50">
                  <span className="text-slate-500">{t.lblBooth}</span>
                  <span className="font-bold text-slate-800">{currentUser?.booth || 'Booth 142 - Corporation School'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">{t.lblLanguage}</span>
                  <span className="font-bold text-brand-red">{lang === 'ta' ? 'தமிழ்' : 'English'}</span>
                </div>
              </div>
            </div>

            {/* Emergency SOS Hub */}
            <div className="bg-gradient-to-r from-red-50 to-amber-50 rounded-2xl p-4 border border-brand-redBorder/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-brand-red text-[22px]">fmd_bad</span>
                <div>
                  <h4 className="text-xs font-extrabold text-brand-redText uppercase tracking-wide">
                    {t.sosTitle}
                  </h4>
                  <p className="text-[11px] text-slate-600">{t.sosSubtitle}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href="tel:1950"
                  className="h-10 rounded-xl bg-brand-red hover:bg-brand-redHover text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">call</span>
                  <span>{t.helpline1950}</span>
                </a>
                <a
                  href="tel:108"
                  className="h-10 rounded-xl bg-white hover:bg-red-50 text-brand-red border border-brand-redBorder text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">ambulance</span>
                  <span>{t.sos108}</span>
                </a>
              </div>
            </div>

            {/* Logout Action */}
            <button
              type="button"
              onClick={logout}
              className="w-full h-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-slate-500">logout</span>
              <span>{t.logoutBtn}</span>
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
            <span className="text-[11px] mt-0.5">{t.navReport}</span>
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
            <span className="text-[11px] mt-0.5">{t.navStatus}</span>
            {inProgressCount > 0 && (
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
            <span className="text-[11px] mt-0.5">{t.navContacts}</span>
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
            <span className="text-[11px] mt-0.5">{t.navProfile}</span>
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
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Edit Resident Profile</h3>
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
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full h-10 px-3 text-xs rounded-xl border border-amber-200 bg-white font-medium focus:border-brand-red outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full h-10 px-3 text-xs rounded-xl border border-amber-200 bg-white font-medium focus:border-brand-red outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Area / Locality</label>
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
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-xl bg-brand-red hover:bg-brand-redHover text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
