// ============================================================================
// TVK ERA — INITIAL SEED DATA & MOCK DATABASE
// ============================================================================

export const SEED_COMPLAINTS = [
  {
    id: "GR-121-8842",
    ward: 24,
    residentName: "Sampooraniyan (சம் பூரணியன்)",
    userPhone: "+91 94432 18890",
    area: "V.O.C Street, Ward 24",
    category: "Water Supply & Sewage",
    categoryTa: "குடிநீர் & கழிவுநீர்",
    title: "Water Supply Contamination & Low Pressure / குடிநீர் விநியோக கோளாறு",
    description: "Drinking water pipeline has leakage near house #42; tap water is murky with foul odor. Needs immediate inspection and pressure check.",
    status: "IN_PROGRESS", // IN_PROGRESS or COMPLETED
    stage: 2, // 1 to 4
    createdAt: "Today, 10:15 AM",
    actionTaken: "TWAD water supervisor notified. Pipeline trenching crew assigned for 2:00 PM repair & supply test.",
    wingName: "TWAD Wing",
    hasAudio: true,
    photoUrl: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=500&auto=format&fit=crop&q=80",
    completionPhotoUrl: null,
    verifiedBy: "Ward Coordinator #121"
  },
  {
    id: "GR-121-7910",
    ward: 24,
    residentName: "Sampooraniyan (சம் பூரணியன்)",
    userPhone: "+91 94432 18890",
    area: "Kamarajar Road Cross 2, Ward 24",
    category: "Roads & Streetlights",
    categoryTa: "சாலை & தெருவிளக்கு",
    title: "Non-Functional LED Street Light on Pole 14 / தெருவிளக்கு பழுது",
    description: "Street lamp has been flickering and dead for 4 nights creating safety hazard for school children and senior citizens.",
    status: "COMPLETED",
    stage: 4,
    createdAt: "18 Oct 2024",
    actionTaken: "Electrical wing replaced 45W driver unit and installed new LED fixture. Checked and verified functional.",
    wingName: "Electrical Wing",
    hasAudio: false,
    photoUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=500&auto=format&fit=crop&q=80",
    completionPhotoUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=500&auto=format&fit=crop&q=80",
    verifiedBy: "Verified by Ward Coordinator • Singanallur Field Team #121"
  },
  {
    id: "GR-121-7104",
    ward: 24,
    residentName: "Annamalai S.",
    userPhone: "+91 98940 33211",
    area: "Trichy Road, Ward 24",
    category: "Garbage & Sanitation",
    categoryTa: "தூய்மைப்பணி",
    title: "Overflowing Garbage Bin & Stray Cattle / குப்பை தொட்டி பராமரிப்பு",
    description: "Commercial waste dumped outside designated collection bin blocking pavement and attracting stray cattle.",
    status: "COMPLETED",
    stage: 4,
    createdAt: "12 Oct 2024",
    actionTaken: "Compactor vehicle cleared 1.8 tons of waste; disinfectant lime powder sprayed across site.",
    wingName: "Sanitation Wing",
    hasAudio: false,
    photoUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=500&auto=format&fit=crop&q=80",
    completionPhotoUrl: null,
    verifiedBy: "Verified by Field Inspector #121"
  },
  {
    id: "GR-121-6540",
    ward: 24,
    residentName: "Meenakshi Sundaram",
    userPhone: "+91 97891 44522",
    area: "Nehru Nagar 1st Street, Ward 24",
    category: "Public Health & Parks",
    categoryTa: "சுகாதாரம் & பூங்காக்கள்",
    title: "Mosquito Fogging and Stagnant Rainwater Removal",
    description: "Stagnant rainwater in open plot adjacent to corporation school. Need mosquito fogging to prevent dengue outbreak.",
    status: "COMPLETED",
    stage: 4,
    createdAt: "05 Oct 2024",
    actionTaken: "Health inspector sprayed abate larvicide and fogging vehicle completed morning misting cycle.",
    wingName: "Health Wing",
    hasAudio: false,
    photoUrl: "",
    completionPhotoUrl: null,
    verifiedBy: "Verified by Ward Coordinator"
  },
  {
    id: "GR-121-9102",
    ward: 21,
    residentName: "P. Rangarajan",
    userPhone: "+91 98421 21001",
    area: "Ramanathapuram Main Rd, Ward 21",
    category: "Roads & Streetlights",
    categoryTa: "சாலை & தெருவிளக்கு",
    title: "Deep Pothole Causing Traffic Jam at Temple Junction",
    description: "Heavy rain created 2-foot pothole near Kaliamman Kovil arch. Two-wheelers skidding frequently.",
    status: "IN_PROGRESS",
    stage: 2,
    createdAt: "Yesterday, 3:30 PM",
    actionTaken: "Highway division notified; wet mix macadam patch truck scheduled for night repair.",
    wingName: "Roads Wing",
    hasAudio: true,
    photoUrl: "",
    completionPhotoUrl: null,
    verifiedBy: "Ward 21 Incharge"
  },
  {
    id: "GR-121-9345",
    ward: 28,
    residentName: "Senthil Nathan",
    userPhone: "+91 98433 11223",
    area: "Vellalore Road, Ward 28",
    category: "Water Supply & Sewage",
    categoryTa: "குடிநீர் & கழிவுநீர்",
    title: "Underground Sewage Overflow Near Bus Stop",
    description: "Choked sewage chamber overflowing on pedestrian pathway near bus stop. Foul odor in residential area.",
    status: "IN_PROGRESS",
    stage: 3,
    createdAt: "Today, 7:15 AM",
    actionTaken: "Super sucker jetting machine dispatched to clear blockage in chamber #12.",
    wingName: "TWAD Wing",
    hasAudio: false,
    photoUrl: "",
    completionPhotoUrl: null,
    verifiedBy: "Ward 28 Incharge"
  }
];

export const SEED_RESIDENTS = [
  {
    id: "RES-121-001",
    name: "Sampooraniyan (சம் பூரணியன்)",
    phone: "+91 94432 18890",
    ward: 24,
    area: "V.O.C Street, Ward 24, Singanallur",
    booth: "Booth 142 - Corporation School",
    voterId: "TNH121-98741",
    verified: true,
    registeredDate: "12 Feb 2025"
  },
  {
    id: "RES-121-002",
    name: "Annamalai S. (அண்ணாமலை)",
    phone: "+91 98940 33211",
    ward: 24,
    area: "Kamarajar Road Cross 2, Ward 24",
    booth: "Booth 142 - Corporation School",
    voterId: "TNH121-65412",
    verified: true,
    registeredDate: "18 Jan 2025"
  },
  {
    id: "RES-121-003",
    name: "Meenakshi Sundaram (மீனாட்சி சுந்தரம்)",
    phone: "+91 97891 44522",
    ward: 24,
    area: "Nehru Nagar 1st Street, Ward 24",
    booth: "Booth 143 - Community Hall",
    voterId: "TNH121-43219",
    verified: true,
    registeredDate: "05 Feb 2025"
  },
  {
    id: "RES-121-004",
    name: "R. Vignesh (விக்னேஷ்)",
    phone: "+91 90031 77654",
    ward: 24,
    area: "Trichy Road Junction, Ward 24",
    booth: "Booth 144 - Higher Secondary School",
    voterId: "TNH121-88901",
    verified: true,
    registeredDate: "20 Feb 2025"
  },
  {
    id: "RES-121-005",
    name: "P. Rangarajan (ரங்கராஜன்)",
    phone: "+91 98421 21001",
    ward: 21,
    area: "Ramanathapuram Main Rd, Ward 21",
    booth: "Booth 125 - Govt High School",
    voterId: "TNH121-12001",
    verified: true,
    registeredDate: "10 Feb 2025"
  },
  {
    id: "RES-121-006",
    name: "N. Murugan (முருகன்)",
    phone: "+91 98421 28008",
    ward: 28,
    area: "Vellalore Road, Ward 28",
    booth: "Booth 160 - Panchayat Union School",
    voterId: "TNH121-28008",
    verified: true,
    registeredDate: "08 Feb 2025"
  }
];

export const SEED_DIRECTIVES = [
  {
    id: "DIR-101",
    role: "MLA Office",
    roleTa: "சட்டமன்ற உறுப்பினர் அலுவலகம்",
    date: "23 Feb 2025",
    title: "Monsoon Pre-Cleaning of Stormwater Channels",
    titleTa: "பருவமழை முன்னெச்சரிக்கை: மழைநீர் வடிகால் தூர்வாருதல்",
    message: "All grassroots ward teams must inspect arterial storm drains in their respective wards and report silt accumulation to Corporation engineers immediately.",
    createdBy: "Constituency MLA Secretariat (121)",
    targetWard: "ALL"
  },
  {
    id: "DIR-102",
    role: "District Secretary",
    roleTa: "மாவட்ட செயலாளர்",
    date: "21 Feb 2025",
    title: "Ward 24 Special LED Streetlight Replacement Drive",
    titleTa: "வார்டு 24 சிறப்பு எல்.இ.டி தெருவிளக்கு மாற்று இயக்கம்",
    message: "Prioritize V.O.C Street and adjacent bylanes for new high-efficiency 45W LED fittings before upcoming festival week.",
    createdBy: "Singanallur TVK District Incharge",
    targetWard: 24
  },
  {
    id: "DIR-103",
    role: "MLA Office",
    roleTa: "சட்டமன்ற உறுப்பினர் அலுவலகம்",
    date: "15 Feb 2025",
    title: "Safe Drinking Water Sampling Drive",
    titleTa: "பாதுகாப்பான குடிநீர் மாதிரி சோதனை இயக்கம்",
    message: "Field coordinators must test water pressure and collect random chlorination samples at dead-end streets across all wards.",
    createdBy: "Constituency MLA Secretariat (121)",
    targetWard: "ALL"
  }
];

export const SEED_OFFICERS = [
  {
    id: "TVK-GR-121-024",
    name: "M. Karthik Kumar (கார்த்திக் குமார்)",
    username: "grassroot_w24",
    role: "GRASSROOT",
    designation: "Ward 24 Coordinator",
    ward: 24,
    area: "V.O.C Street & Varadharajapuram",
    phone: "+91 98421 00024",
    status: "ACTIVE"
  },
  {
    id: "TVK-GR-121-021",
    name: "P. Rangarajan (ரங்கராஜன்)",
    username: "grassroot_w21",
    role: "GRASSROOT",
    designation: "Ward 21 Coordinator",
    ward: 21,
    area: "Ramanathapuram Main",
    phone: "+91 98421 21001",
    status: "ACTIVE"
  },
  {
    id: "TVK-GR-121-028",
    name: "N. Murugan (முருகன்)",
    username: "grassroot_w28",
    role: "GRASSROOT",
    designation: "Ward 28 Coordinator",
    ward: 28,
    area: "Vellalore Road",
    phone: "+91 98421 28008",
    status: "ACTIVE"
  },
  {
    id: "TVK-GR-121-025",
    name: "V. Selvam (செல்வம்)",
    username: "grassroot_w25",
    role: "GRASSROOT",
    designation: "Ward 25 Coordinator",
    ward: 25,
    area: "Singanallur Bus Stand",
    phone: "+91 98421 25005",
    status: "ACTIVE"
  }
];

export const DEMO_USERS = [
  {
    id: "USER-SAMP",
    username: "sampooraniyan",
    password: "password123",
    role: "RESIDENT",
    name: "Sampooraniyan (சம் பூரணியன்)",
    ward: 24,
    area: "V.O.C Street, Ward 24, Singanallur",
    phone: "+91 94432 18890",
    voterId: "TNH121-98741",
    booth: "Booth 142 - Corporation School"
  },
  {
    id: "OFF-KARTHIK",
    username: "karthik_w24",
    password: "password123",
    role: "GRASSROOTS",
    name: "M. Karthik Kumar",
    ward: 24,
    area: "Singanallur (V.O.C Street)",
    phone: "+91 98421 00024",
    officerId: "TVK-GR-121-024",
    designation: "Ward 24 Grassroots Officer"
  },
  {
    id: "MLA-GIRI",
    username: "mla_srigiri",
    password: "password123",
    role: "MLA",
    name: "கே. எஸ். ஸ்ரீ கிரி பிரசாத் (K. S. Sri Giri Prasath)",
    ward: "ALL",
    phone: "+91 94430 12121",
    designation: "Constituency MLA • AC 121"
  }
];
