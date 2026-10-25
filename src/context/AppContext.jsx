import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SEED_COMPLAINTS,
  SEED_RESIDENTS,
  SEED_DIRECTIVES,
  SEED_OFFICERS,
  DEMO_USERS
} from '../data/initialData';
import { translations } from '../data/translations';

const AppContext = createContext(null);

const STORAGE_KEYS = {
  LANG: 'tvk_era_lang',
  THEME: 'tvk_era_theme',
  ROLE: 'tvk_era_role',
  USER: 'tvk_era_user',
  COMPLAINTS: 'tvk_era_complaints',
  RESIDENTS: 'tvk_era_residents',
  DIRECTIVES: 'tvk_era_directives',
  OFFICERS: 'tvk_era_officers',
};

const safeStorage = {
  get: (key, fallback) => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) return fallback;
      return JSON.parse(saved);
    } catch (e) {
      console.warn(`[Storage] Failed to read ${key}:`, e);
      return fallback;
    }
  },
  getString: (key, fallback) => {
    try {
      return localStorage.getItem(key) || fallback;
    } catch {
      return fallback;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    } catch (e) {
      console.warn(`[Storage] Failed to write ${key}:`, e);
      // QuotaExceededError fallback
      if (key === STORAGE_KEYS.COMPLAINTS && Array.isArray(value)) {
        try {
          const trimmed = value.map(c => ({
            ...c,
            photoUrl: c.photoUrl && c.photoUrl.length > 50000 ? '' : c.photoUrl,
            completionPhotoUrl: c.completionPhotoUrl && c.completionPhotoUrl.length > 50000 ? '' : c.completionPhotoUrl
          }));
          localStorage.setItem(key, JSON.stringify(trimmed));
        } catch {
          // Gracefully suppress quota errors without crashing React
        }
      }
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }
};

export const AppProvider = ({ children }) => {
  // 1. Language state ('ta' default or 'en')
  const [lang, setLang] = useState(() => {
    return safeStorage.getString(STORAGE_KEYS.LANG, 'ta');
  });

  // 2. Theme state ('light' or 'dark')
  const [theme, setTheme] = useState(() => {
    return safeStorage.getString(STORAGE_KEYS.THEME, 'light');
  });

  // 3. Role & User state
  // Roles: 'LOGIN' | 'REGISTER' | 'RESIDENT' | 'GRASSROOTS' | 'MLA'
  const [currentRole, setCurrentRole] = useState(() => {
    return safeStorage.getString(STORAGE_KEYS.ROLE, 'RESIDENT');
  });

  const [currentUser, setCurrentUser] = useState(() => {
    return safeStorage.get(STORAGE_KEYS.USER, DEMO_USERS[0]);
  });

  // 4. Data lists with localStorage persistence
  const [complaints, setComplaints] = useState(() => {
    const saved = safeStorage.get(STORAGE_KEYS.COMPLAINTS, null);
    if (saved && Array.isArray(saved)) {
      return saved.filter(c => c && c.id !== 'GR-121-7104' && c.id !== 'GR-121-6540');
    }
    return SEED_COMPLAINTS;
  });

  const [residents, setResidents] = useState(() => {
    return safeStorage.get(STORAGE_KEYS.RESIDENTS, SEED_RESIDENTS);
  });

  const [directives, setDirectives] = useState(() => {
    return safeStorage.get(STORAGE_KEYS.DIRECTIVES, SEED_DIRECTIVES);
  });

  const [officers, setOfficers] = useState(() => {
    return safeStorage.get(STORAGE_KEYS.OFFICERS, SEED_OFFICERS);
  });

  // 5. Toast Notifications
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3200);
  };

  // Sync state to localStorage safely
  useEffect(() => {
    safeStorage.set(STORAGE_KEYS.LANG, lang);
  }, [lang]);

  useEffect(() => {
    safeStorage.set(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  useEffect(() => {
    safeStorage.set(STORAGE_KEYS.ROLE, currentRole);
  }, [currentRole]);

  useEffect(() => {
    if (currentUser) {
      safeStorage.set(STORAGE_KEYS.USER, currentUser);
    } else {
      safeStorage.remove(STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  useEffect(() => {
    safeStorage.set(STORAGE_KEYS.COMPLAINTS, complaints);
  }, [complaints]);

  useEffect(() => {
    safeStorage.set(STORAGE_KEYS.RESIDENTS, residents);
  }, [residents]);

  useEffect(() => {
    safeStorage.set(STORAGE_KEYS.DIRECTIVES, directives);
  }, [directives]);

  useEffect(() => {
    safeStorage.set(STORAGE_KEYS.OFFICERS, officers);
  }, [officers]);

  // Language switcher
  const setLanguage = (newLang) => {
    setLang(newLang);
    showToast(newLang === 'ta' ? 'தமிழ் மொழிக்கு மாற்றப்பட்டது' : 'Language set to English', 'success');
  };

  // Theme toggle
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    showToast(nextTheme === 'dark' ? 'Dark Mode Activated' : 'Warm TVK Mode Activated', 'success');
  };

  // Quick Role Switching for demo
  const quickLogin = (roleKey) => {
    if (roleKey === 'RESIDENT') {
      const user = DEMO_USERS[0];
      setCurrentUser(user);
      setCurrentRole('RESIDENT');
      showToast(lang === 'ta' ? 'குடிமக்கள் முகப்பிற்கு மாற்றப்பட்டது' : 'Switched to Citizen / Resident View', 'success');
    } else if (roleKey === 'GRASSROOTS') {
      const user = DEMO_USERS[1];
      setCurrentUser(user);
      setCurrentRole('GRASSROOTS');
      showToast(lang === 'ta' ? 'வார்டு 24 கள அதிகாரி முகப்பிற்கு மாற்றப்பட்டது' : 'Switched to Ward 24 Officer View', 'success');
    } else if (roleKey === 'MLA') {
      const user = DEMO_USERS[2];
      setCurrentUser(user);
      setCurrentRole('MLA');
      showToast(lang === 'ta' ? 'சட்டமன்ற உறுப்பினர் தலைமை முகப்பிற்கு மாற்றப்பட்டது' : 'Switched to MLA Command Center View', 'success');
    }
  };

  // Authenticate user via username & password
  const login = (username, password) => {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // Check pre-configured demo users
    const matched = DEMO_USERS.find(
      u => u.username.toLowerCase() === cleanUser || u.phone.includes(cleanUser)
    );

    if (matched && (matched.password === cleanPass || cleanPass === 'password123' || cleanPass.length >= 4)) {
      setCurrentUser(matched);
      setCurrentRole(matched.role);
      showToast(lang === 'ta' ? `வரவேற்கிறோம், ${matched.name}!` : `Welcome, ${matched.name}!`, 'success');
      return { success: true };
    }

    // Check registered residents
    const matchedResident = residents.find(
      r => r.phone.replace(/\s+/g, '') === cleanUser.replace(/\s+/g, '') || r.voterId?.toLowerCase() === cleanUser
    );

    if (matchedResident) {
      const userObj = {
        ...matchedResident,
        role: 'RESIDENT'
      };
      setCurrentUser(userObj);
      setCurrentRole('RESIDENT');
      showToast(lang === 'ta' ? `வரவேற்கிறோம், ${userObj.name}!` : `Welcome, ${userObj.name}!`, 'success');
      return { success: true };
    }

    // Check grassroots officers
    const matchedOfficer = officers.find(
      o => o.username?.toLowerCase() === cleanUser || 
           o.id?.toLowerCase() === cleanUser || 
           (cleanUser.length >= 8 && o.phone?.replace(/[^0-9]/g, '').includes(cleanUser.replace(/[^0-9]/g, '')))
    );

    if (matchedOfficer) {
      const userObj = {
        ...matchedOfficer,
        role: 'GRASSROOTS'
      };
      setCurrentUser(userObj);
      setCurrentRole('GRASSROOTS');
      showToast(lang === 'ta' ? `வரவேற்கிறோம், ${userObj.name}!` : `Welcome, ${userObj.name}!`, 'success');
      return { success: true };
    }

    return { success: false, message: translations[lang].invalidCredentials };
  };

  // Logout
  const logout = () => {
    setCurrentUser(null);
    setCurrentRole('LOGIN');
    showToast(lang === 'ta' ? 'வெளியேறியது' : 'Logged out successfully', 'success');
  };

  // Register New Resident
  const registerResident = ({ name, age, phone, ward, area, address, password }) => {
    const newId = `RES-121-${Math.floor(1000 + Math.random() * 9000)}`;
    const voterId = `TNH121-${Math.floor(10000 + Math.random() * 90000)}`;
    
    const newResident = {
      id: newId,
      name,
      age: Number(age),
      phone,
      ward: Number(ward),
      area,
      address,
      booth: `Booth ${120 + Number(ward)} - Corporation School`,
      voterId,
      verified: true,
      registeredDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    setResidents(prev => [newResident, ...prev]);

    // Automatically log the new resident in
    const userSession = {
      ...newResident,
      username: phone,
      password,
      role: 'RESIDENT'
    };
    setCurrentUser(userSession);
    setCurrentRole('RESIDENT');
    showToast(lang === 'ta' ? 'பதிவு வெற்றிகரமாக முடிந்தது! வரவேற்பு.' : 'Registration successful! Welcome.', 'success');
    return newResident;
  };

  // Add Grievance
  const addComplaint = ({ category, description, photoUrl, videoName, hasVoice, ward = 24, area = 'V.O.C Street' }) => {
    const newId = `GR-121-${Math.floor(1000 + Math.random() * 9000)}`;
    const newComplaint = {
      id: newId,
      ward: Number(ward),
      residentName: currentUser?.name || 'Sampooraniyan (சம் பூரணியன்)',
      userPhone: currentUser?.phone || '+91 94432 18890',
      area: area || (currentUser?.area || 'V.O.C Street, Ward 24'),
      category: category || 'Roads & Streetlights',
      categoryTa: category,
      title: `${category} Complaint / புகார் #${newId}`,
      description,
      status: 'IN_PROGRESS',
      stage: 1, // Stage 1: Registered
      createdAt: 'Just now',
      actionTaken: 'Grievance logged with Singanallur AC 121 portal. Ward member notified.',
      wingName: 'Ward Field Team',
      hasAudio: !!hasVoice,
      photoUrl: photoUrl || '',
      videoName: videoName || '',
      completionPhotoUrl: null,
      verifiedBy: 'Singanallur Field Team #121'
    };

    setComplaints(prev => [newComplaint, ...prev]);
    showToast(
      lang === 'ta' 
        ? `புகார் ${newId} வெற்றிகரமாக பதிவு செய்யப்பட்டது!` 
        : `Grievance #${newId} lodged successfully!`,
      'success'
    );
    return newComplaint;
  };

  // Resolve Grievance (Grassroots action)
  const resolveComplaint = (complaintId, actionNotes, completionPhotoUrl = null) => {
    setComplaints(prev => prev.map(comp => {
      if (comp.id === complaintId) {
        return {
          ...comp,
          status: 'COMPLETED',
          stage: 4,
          actionTaken: actionNotes,
          completionPhotoUrl: completionPhotoUrl || comp.completionPhotoUrl,
          resolvedAt: 'Just now',
          verifiedBy: `Verified by ${currentUser?.name || 'Ward Coordinator'} • Ward ${comp.ward}`
        };
      }
      return comp;
    }));

    showToast(
      lang === 'ta'
        ? `புகார் #${complaintId} வெற்றிகரமாக தீர்க்கப்பட்டது!`
        : `Grievance #${complaintId} marked as RESOLVED!`,
      'success'
    );
  };

  // Add Directive (MLA action)
  const addDirective = ({ title, titleTa, message, targetWard = 'ALL' }) => {
    const newId = `DIR-${Math.floor(100 + Math.random() * 900)}`;
    const newDirective = {
      id: newId,
      role: 'MLA Office',
      roleTa: 'சட்டமன்ற உறுப்பினர் அலுவலகம்',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      title: title || 'Special Constituency Advisory',
      titleTa: titleTa || title,
      message,
      createdBy: 'Constituency MLA Secretariat (121)',
      targetWard: targetWard === 'ALL' ? 'ALL' : Number(targetWard)
    };

    setDirectives(prev => [newDirective, ...prev]);
    showToast(
      lang === 'ta'
        ? 'புதிய வழிகாட்டல் உத்தரவு வார்டுகளுக்கு அனுப்பப்பட்டது!'
        : 'New directive broadcasted to ward officers!',
      'success'
    );
    return newDirective;
  };

  // Add Officer (MLA action)
  const addOfficer = ({ name, username, ward, area, phone }) => {
    const newId = `TVK-GR-121-${String(ward).padStart(3, '0')}`;
    const newOfficer = {
      id: newId,
      name,
      username: username || `officer_w${ward}`,
      role: 'GRASSROOT',
      designation: `Ward ${ward} Coordinator`,
      ward: Number(ward),
      area,
      phone: phone || '+91 98421 00000',
      status: 'ACTIVE'
    };

    setOfficers(prev => [newOfficer, ...prev]);
    showToast(
      lang === 'ta'
        ? `வார்டு ${ward} அதிகாரி ${name} கணக்கு உருவாக்கப்பட்டது!`
        : `Officer ${name} provisioned for Ward ${ward}!`,
      'success'
    );
    return newOfficer;
  };

  // Toggle Officer Status
  const toggleOfficerStatus = (officerId) => {
    setOfficers(prev => prev.map(off => {
      if (off.id === officerId) {
        const nextStatus = off.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
        return { ...off, status: nextStatus };
      }
      return off;
    }));
    showToast('Officer status updated', 'success');
  };

  // Update Resident Profile
  const updateResidentProfile = ({ name, phone, area }) => {
    setCurrentUser(prev => ({
      ...prev,
      name: name || prev.name,
      phone: phone || prev.phone,
      area: area || prev.area
    }));

    if (currentUser?.id) {
      setResidents(prev => prev.map(res => {
        if (res.id === currentUser.id) {
          return {
            ...res,
            name: name || res.name,
            phone: phone || res.phone,
            area: area || res.area
          };
        }
        return res;
      }));
    }

    showToast(lang === 'ta' ? 'சுயவிபரம் புதுப்பிக்கப்பட்டது!' : 'Profile updated successfully!', 'success');
  };

  const t = translations[lang] || translations.ta;

  return (
    <AppContext.Provider
      value={{
        lang,
        setLanguage,
        theme,
        toggleTheme,
        currentRole,
        setCurrentRole,
        currentUser,
        setCurrentUser,
        complaints,
        residents,
        directives,
        officers,
        toast,
        showToast,
        login,
        logout,
        quickLogin,
        registerResident,
        addComplaint,
        resolveComplaint,
        addDirective,
        addOfficer,
        toggleOfficerStatus,
        updateResidentProfile,
        t
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
