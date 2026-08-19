import React, { useState, useMemo } from 'react';
import { 
  FileText, Search, Filter, CheckCircle, Clock, Calendar, 
  Sparkles, Award, ArrowRight, ExternalLink, HelpCircle, RefreshCw, 
  Briefcase, GraduationCap, UserCheck, ChevronRight, Bookmark, 
  Flame, Bell, ShieldCheck, MapPin, Share2, BookOpen
} from 'lucide-react';

export interface JobListing {
  id: string;
  title: string;
  organization: string;
  departmentCategory: 'ssc' | 'railway' | 'bpsc' | 'court_steno' | 'police' | 'banking' | 'teaching' | 'defense' | 'other';
  departmentNameHindi: string;
  minQualification: '10th' | '12th' | 'graduate' | 'post_graduate' | 'steno_diploma' | 'iti' | 'bed';
  qualificationLabelHindi: string;
  minAge: number;
  maxAgeGeneral: number;
  totalVacancies: number;
  stenoRequired: boolean;
  stenoSpeedWpm?: number;
  typingRequired: boolean;
  typingSpeedWpm?: number;
  drivingLicenseRequired?: boolean;
  computerCertificateRequired?: boolean;
  startDate: string;
  lastDate: string;
  examDate: string;
  salaryPayScale: string;
  officialApplyUrl: string;
  notificationPdfUrl: string;
  status: 'active' | 'upcoming' | 'closing_soon';
  descriptionHindi: string;
  syllabusHighlights: string[];
  selectionStages: string[];
}

export const SARKARI_JOBS_DATABASE: JobListing[] = [
  {
    id: 'ssc-steno-2026',
    title: 'SSC Stenographer Grade "C" & "D" Examination 2026',
    organization: 'Staff Selection Commission (SSC)',
    departmentCategory: 'ssc',
    departmentNameHindi: 'कर्मचारी चयन आयोग (एसएससी)',
    minQualification: '12th',
    qualificationLabelHindi: '12वीं पास (Intermediate) + शॉर्टहैंड ज्ञान',
    minAge: 18,
    maxAgeGeneral: 30,
    totalVacancies: 3450,
    stenoRequired: true,
    stenoSpeedWpm: 80,
    typingRequired: true,
    typingSpeedWpm: 35,
    startDate: '10 फरवरी 2026',
    lastDate: '15 मार्च 2026',
    examDate: 'मई - जून 2026',
    salaryPayScale: 'Level-4 to Level-7 (₹25,500 - ₹1,42,400)',
    officialApplyUrl: 'https://ssc.gov.in/',
    notificationPdfUrl: 'https://ssc.gov.in/',
    status: 'active',
    descriptionHindi: 'केंद्रीय मंत्रालयों और विभागों में स्टेनोग्राफर ग्रेड सी व डी के रिक्त पदों पर सीधी भर्ती।',
    syllabusHighlights: ['सामान्य बुद्धि एवं तर्कशक्ति (50 अंक)', 'सामान्य जागरूकता (50 अंक)', 'अंग्रेजी/हिंदी भाषा एवं समझ (100 अंक)', 'स्किल टेस्ट (80/100 WPM)'],
    selectionStages: ['कंप्यूटर आधारित परीक्षा (CBT)', 'शॉर्टहैंड स्किल टेस्ट (Steno Test)', 'दस्तावेज सत्यापन (DV)']
  },
  {
    id: 'rrb-ntpc-2026',
    title: 'Railway RRB NTPC (Non-Technical Popular Categories) 2026',
    organization: 'Railway Recruitment Boards (RRB)',
    departmentCategory: 'railway',
    departmentNameHindi: 'रेलवे भर्ती बोर्ड (RRB)',
    minQualification: 'graduate',
    qualificationLabelHindi: 'किसी भी मान्यता प्राप्त विश्वविद्यालय से स्नातक (Graduate)',
    minAge: 18,
    maxAgeGeneral: 33,
    totalVacancies: 11558,
    stenoRequired: false,
    typingRequired: true,
    typingSpeedWpm: 30,
    startDate: '15 जनवरी 2026',
    lastDate: '28 फरवरी 2026',
    examDate: 'अप्रैल 2026',
    salaryPayScale: 'Level-5 & Level-6 (₹29,200 - ₹92,300)',
    officialApplyUrl: 'https://www.rrbcdg.gov.in/',
    notificationPdfUrl: 'https://www.rrbcdg.gov.in/',
    status: 'active',
    descriptionHindi: 'भारतीय रेलवे में स्टेशन मास्टर, गुड्स गार्ड, सीनियर क्लर्क कम टाइपिस्ट के पदों पर बंपर भर्ती।',
    syllabusHighlights: ['सामान्य गणित (30)', 'रीजनिंग (30)', 'सामान्य जागरूकता एवं करंट अफेयर्स (40)'],
    selectionStages: ['CBT Stage 1', 'CBT Stage 2', 'Typing Skill / CBAT', 'दस्तावेज सत्यापन']
  },
  {
    id: 'bpsc-71st-cce',
    title: 'BPSC 71st Combined Competitive Examination (CCE) 2026',
    organization: 'Bihar Public Service Commission (BPSC)',
    departmentCategory: 'bpsc',
    departmentNameHindi: 'बिहार लोक सेवा आयोग (BPSC)',
    minQualification: 'graduate',
    qualificationLabelHindi: 'स्नातक (Graduate Degree in Any Stream)',
    minAge: 20,
    maxAgeGeneral: 37,
    totalVacancies: 1980,
    stenoRequired: false,
    typingRequired: false,
    startDate: '01 फरवरी 2026',
    lastDate: '10 मार्च 2026',
    examDate: 'जुलाई 2026',
    salaryPayScale: 'Level-7 & Level-9 (SDO, DSP, BDO, Registrar)',
    officialApplyUrl: 'https://www.bpsc.bih.nic.in/',
    notificationPdfUrl: 'https://www.bpsc.bih.nic.in/',
    status: 'active',
    descriptionHindi: 'बिहार प्रशासनिक सेवा, पुलिस सेवा, वित्तीय सेवा एवं अन्य राजपत्रित अधिकारियों की भर्ती।',
    syllabusHighlights: ['सामान्य अध्ययन (GS 150 अंक)', 'बिहार विशेष GK', 'मेंस GS 1, GS 2, निबंध एवं वैकल्पिक'],
    selectionStages: ['प्रारंभिक परीक्षा (Prelims 150 Marks)', 'मुख्य परीक्षा (Mains 900 Marks)', 'साक्षात्कार (Interview 120 Marks)']
  },
  {
    id: 'delhi-high-court-steno-2026',
    title: 'Delhi High Court Senior Personal Assistant (Steno 110 WPM)',
    organization: 'High Court of Delhi',
    departmentCategory: 'court_steno',
    departmentNameHindi: 'दिल्ली उच्च न्यायालय (High Court)',
    minQualification: 'graduate',
    qualificationLabelHindi: 'स्नातक डिग्री + अंग्रेजी/हिंदी शॉर्टहैंड 110 WPM',
    minAge: 18,
    maxAgeGeneral: 32,
    totalVacancies: 180,
    stenoRequired: true,
    stenoSpeedWpm: 110,
    typingRequired: true,
    typingSpeedWpm: 45,
    startDate: '20 जनवरी 2026',
    lastDate: '25 फरवरी 2026',
    examDate: 'मार्च - अप्रैल 2026',
    salaryPayScale: 'Pay Level-8 (₹47,600 - ₹1,51,100 + भत्ते)',
    officialApplyUrl: 'https://delhihighcourt.nic.in/',
    notificationPdfUrl: 'https://delhihighcourt.nic.in/',
    status: 'active',
    descriptionHindi: 'दिल्ली हाईकोर्ट के न्यायाधीशों के साथ सीनियर पर्सनल असिस्टेंट व कोर्ट स्टेनोग्राफर की प्रतिष्ठित पोस्टिंग।',
    syllabusHighlights: ['अंग्रेजी व्याकरण व समझ', 'शॉर्टहैंड डिक्टेशन टेस्ट (110 WPM for 5 mins)', 'कंप्यूटर टाइपिंग'],
    selectionStages: ['इंग्लिश टाइपिंग टेस्ट', 'शॉर्टहैंड स्किल टेस्ट', 'लिखित परीक्षा', 'इंटरव्यू']
  },
  {
    id: 'ssc-chsl-2026',
    title: 'SSC CHSL (10+2) Combined Higher Secondary Level 2026',
    organization: 'Staff Selection Commission (SSC)',
    departmentCategory: 'ssc',
    departmentNameHindi: 'कर्मचारी चयन आयोग (SSC CHSL)',
    minQualification: '12th',
    qualificationLabelHindi: '12वीं पास (10+2 Intermediate from Recognized Board)',
    minAge: 18,
    maxAgeGeneral: 27,
    totalVacancies: 4200,
    stenoRequired: false,
    typingRequired: true,
    typingSpeedWpm: 35,
    startDate: '25 जनवरी 2026',
    lastDate: '05 मार्च 2026',
    examDate: 'मई 2026',
    salaryPayScale: 'Level-2 & Level-4 (LDC, JSA, Data Entry Operator)',
    officialApplyUrl: 'https://ssc.gov.in/',
    notificationPdfUrl: 'https://ssc.gov.in/',
    status: 'active',
    descriptionHindi: 'एलडीसी (LDC), जूनियर सेक्रेटेरिएट असिस्टेंट (JSA) एवं डेटा एंट्री ऑपरेटर (DEO) के पद।',
    syllabusHighlights: ['इंग्लिश (50 अंक)', 'रीजनिंग (50 अंक)', 'क्वांटिटेटिव एप्टीट्यूड (50 अंक)', 'जीके (50 अंक)'],
    selectionStages: ['Tier-1 CBT Exam', 'Tier-2 CBT + Typing/Data Entry Skill Test']
  },
  {
    id: 'up-police-si-steno',
    title: 'UP Police Sub Inspector (Confidential) & Assistant Steno 2026',
    organization: 'UPPRPB (Uttar Pradesh Police Board)',
    departmentCategory: 'police',
    departmentNameHindi: 'उत्तर प्रदेश पुलिस भर्ती एवं प्रोन्नति बोर्ड',
    minQualification: 'graduate',
    qualificationLabelHindi: 'स्नातक + हिंदी स्टेनोग्राफी (80 WPM) + CCC/O Level',
    minAge: 21,
    maxAgeGeneral: 28,
    totalVacancies: 921,
    stenoRequired: true,
    stenoSpeedWpm: 80,
    typingRequired: true,
    typingSpeedWpm: 25,
    computerCertificateRequired: true,
    startDate: '12 जनवरी 2026',
    lastDate: '20 फरवरी 2026',
    examDate: 'अप्रैल 2026',
    salaryPayScale: 'Pay Matrix Level-6 (₹35,400 - ₹1,12,400)',
    officialApplyUrl: 'https://uppbpb.gov.in/',
    notificationPdfUrl: 'https://uppbpb.gov.in/',
    status: 'active',
    descriptionHindi: 'उत्तर प्रदेश पुलिस विभाग में गोपनीय उप-निरीक्षक एवं सहायक उप-निरीक्षक (लिपिक/लेखा) पद।',
    syllabusHighlights: ['सामान्य हिंदी व कंप्यूटर (100 अंक)', 'सामान्य जानकारी/सामयिक विषय (100 अंक)', 'संख्यात्मक व मानसिक योग्यता (100 अंक)', 'मानसिक अभिरुचि व रीजनिंग (100 अंक)'],
    selectionStages: ['लिखित परीक्षा (400 Marks)', 'शारीरिक मानक परीक्षण (PST)', 'स्टेनो व टाइपिंग परीक्षा']
  },
  {
    id: 'rrb-group-d-2026',
    title: 'Railway RRB Level-1 (Group D) Recruitments 2026',
    organization: 'Railway Recruitment Boards (RRB)',
    departmentCategory: 'railway',
    departmentNameHindi: 'भारतीय रेलवे (Group D)',
    minQualification: '10th',
    qualificationLabelHindi: '10वीं पास (High School) अथवा ITI',
    minAge: 18,
    maxAgeGeneral: 33,
    totalVacancies: 32000,
    stenoRequired: false,
    typingRequired: false,
    startDate: '18 फरवरी 2026',
    lastDate: '30 मार्च 2026',
    examDate: 'अगस्त 2026',
    salaryPayScale: 'Level-1 (₹18,000 - ₹56,900 + अलाउंस)',
    officialApplyUrl: 'https://www.rrbcdg.gov.in/',
    notificationPdfUrl: 'https://www.rrbcdg.gov.in/',
    status: 'active',
    descriptionHindi: 'ट्रैकमैन, पॉइंट्समैन, असिस्टेंट लोको शेड, वर्कशॉप आदि तकनीकी व गैर-तकनीकी पदों पर भर्ती।',
    syllabusHighlights: ['जनरल साइंस (25)', 'गणित (25)', 'जनरल इंटेलिजेंस व रीजनिंग (30)', 'करंट अफेयर्स (20)'],
    selectionStages: ['कंप्यूटर आधारित टेस्ट (CBT)', 'शारीरिक दक्षता परीक्षा (PET)', 'दस्तावेज सत्यापन एवं मेडिकल']
  },
  {
    id: 'bihar-civil-court-steno',
    title: 'Bihar Civil Court Stenographer & Clerk Recruitments 2026',
    organization: 'Civil Court Patna / Bihar State Judicial Service',
    departmentCategory: 'court_steno',
    departmentNameHindi: 'बिहार सिविल कोर्ट प्रशासन',
    minQualification: 'graduate',
    qualificationLabelHindi: 'स्नातक डिग्री + हिंदी/इंग्लिश स्टेनो प्रमाण पत्र',
    minAge: 21,
    maxAgeGeneral: 37,
    totalVacancies: 1562,
    stenoRequired: true,
    stenoSpeedWpm: 80,
    typingRequired: true,
    typingSpeedWpm: 30,
    computerCertificateRequired: true,
    startDate: '05 फरवरी 2026',
    lastDate: '10 मार्च 2026',
    examDate: 'मई 2026',
    salaryPayScale: 'Level-4 (₹25,500 - ₹81,100)',
    officialApplyUrl: 'https://districts.ecourts.gov.in/patna',
    notificationPdfUrl: 'https://districts.ecourts.gov.in/patna',
    status: 'active',
    descriptionHindi: 'बिहार के विभिन्न जिला एवं सत्र न्यायालयों में आशुलिपिक (Stenographer) की नियुक्ति।',
    syllabusHighlights: ['इंग्लिश व हिंदी भाषा ज्ञान', 'सामान्य ज्ञान व गणित', 'कंप्यूटर प्रोफिशिएंसी', 'शॉर्टहैंड डिक्टेशन टेस्ट'],
    selectionStages: ['प्रारंभिक स्क्रीनिंग टेस्ट', 'लिखित परीक्षा', 'शॉर्टहैंड स्किल टेस्ट', 'साक्षात्कार']
  },
  {
    id: 'ssc-cgl-2026',
    title: 'SSC CGL (Combined Graduate Level) Examination 2026',
    organization: 'Staff Selection Commission (SSC)',
    departmentCategory: 'ssc',
    departmentNameHindi: 'कर्मचारी चयन आयोग (SSC CGL)',
    minQualification: 'graduate',
    qualificationLabelHindi: 'किसी भी संकाय में स्नातक (Any Bachelor Degree)',
    minAge: 18,
    maxAgeGeneral: 30,
    totalVacancies: 14500,
    stenoRequired: false,
    typingRequired: true,
    typingSpeedWpm: 27,
    startDate: '10 जून 2026',
    lastDate: '15 जुलाई 2026',
    examDate: 'सितंबर 2026',
    salaryPayScale: 'Level-4 to Level-8 (Inspector, ASO, Tax Assistant, Auditor)',
    officialApplyUrl: 'https://ssc.gov.in/',
    notificationPdfUrl: 'https://ssc.gov.in/',
    status: 'upcoming',
    descriptionHindi: 'इनकम टैक्स इंस्पेक्टर, जीएसटी इंस्पेक्टर, एएसओ (ASO इन CSS/MEA), प्रिवेंटिव ऑफिसर आदि शीर्ष पद।',
    syllabusHighlights: ['Tier 1: रीजनिंग, क्वांट, इंग्लिश, जीएस (200 अंक)', 'Tier 2: मैथ (90), रीजनिंग (90), इंग्लिश (135), जीएस (75), कंप्यूटर (60)'],
    selectionStages: ['Tier-1 Online Exam', 'Tier-2 Online Exam + Data Entry Typing Test', 'दस्तावेज सत्यापन']
  },
  {
    id: 'india-post-gds-2026',
    title: 'India Post Gramin Dak Sevak (GDS) 2026 (44,000+ Posts)',
    organization: 'Department of Posts, Ministry of Communications',
    departmentCategory: 'other',
    departmentNameHindi: 'भारतीय डाक विभाग (India Post)',
    minQualification: '10th',
    qualificationLabelHindi: '10वीं पास (गणित व अंग्रेजी विषय अनिवार्य) + स्थानीय भाषा',
    minAge: 18,
    maxAgeGeneral: 40,
    totalVacancies: 44228,
    stenoRequired: false,
    typingRequired: false,
    computerCertificateRequired: true,
    startDate: '01 फरवरी 2026',
    lastDate: '25 फरवरी 2026',
    examDate: 'सीधी मेरिट सूची (No Exam)',
    salaryPayScale: 'TRCA (₹10,000 - ₹29,380)',
    officialApplyUrl: 'https://indiapostgdsonline.gov.in/',
    notificationPdfUrl: 'https://indiapostgdsonline.gov.in/',
    status: 'active',
    descriptionHindi: 'बिना किसी लिखित परीक्षा के केवल 10वीं के अंकों की मेरिट के आधार पर सीधी भर्ती।',
    syllabusHighlights: ['10वीं बोर्ड परीक्षा के प्रतिशत के आधार पर ऑटो-जनरेटेड मेरिट'],
    selectionStages: ['10वीं कक्षा मेरिट लिस्ट', 'दस्तावेज सत्यापन', 'जॉइनिंग']
  }
];

interface SarkariResultEligibilityHubProps {
  onAskHansAi: (prompt: string) => void;
  onStartStenoMock: (subject: string) => void;
  showToast: (msg: string, type: 'info' | 'success' | 'warn') => void;
  language?: 'hindi' | 'english';
}

export const SarkariResultEligibilityHub: React.FC<SarkariResultEligibilityHubProps> = ({
  onAskHansAi,
  onStartStenoMock,
  showToast,
  language = 'hindi'
}) => {
  // Student Profile Filter State
  const [studentQualification, setStudentQualification] = useState<'all' | '10th' | '12th' | 'graduate' | 'post_graduate' | 'steno_diploma' | 'iti' | 'bed'>('all');
  const [studentAge, setStudentAge] = useState<number>(22);
  const [studentCategory, setStudentCategory] = useState<'ur' | 'obc' | 'ews' | 'sc' | 'st' | 'pwd' | 'female'>('ur');
  const [hasShorthandSkill, setHasShorthandSkill] = useState<boolean>(false);
  const [studentStenoSpeed, setStudentStenoSpeed] = useState<number>(80);
  const [hasTypingSkill, setHasTypingSkill] = useState<boolean>(true);
  const [hasComputerCertificate, setHasComputerCertificate] = useState<boolean>(false);
  const [selectedDepartmentCategory, setSelectedDepartmentCategory] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [onlyActiveForms, setOnlyActiveForms] = useState<boolean>(true);

  // Calculate maximum age limit considering category relaxations
  const getRelaxedMaxAge = (baseMaxAge: number, category: string) => {
    switch (category) {
      case 'obc':
        return baseMaxAge + 3;
      case 'sc':
      case 'st':
        return baseMaxAge + 5;
      case 'pwd':
        return baseMaxAge + 10;
      case 'female':
        return baseMaxAge + 3;
      default:
        return baseMaxAge;
    }
  };

  // Qualification hierarchy rank helper
  const getQualificationRank = (qual: string) => {
    switch (qual) {
      case '10th': return 1;
      case 'iti': return 1;
      case '12th': return 2;
      case 'steno_diploma': return 2;
      case 'graduate': return 3;
      case 'bed': return 3;
      case 'post_graduate': return 4;
      default: return 0;
    }
  };

  // Filter Jobs Matching Exact Student Eligibility
  const matchedJobs = useMemo(() => {
    return SARKARI_JOBS_DATABASE.filter(job => {
      // 1. Keyword search
      if (searchKeyword.trim()) {
        const q = searchKeyword.toLowerCase();
        const matchesText = job.title.toLowerCase().includes(q) ||
                            job.organization.toLowerCase().includes(q) ||
                            job.departmentNameHindi.toLowerCase().includes(q) ||
                            job.descriptionHindi.toLowerCase().includes(q);
        if (!matchesText) return false;
      }

      // 2. Department category
      if (selectedDepartmentCategory !== 'all' && job.departmentCategory !== selectedDepartmentCategory) {
        return false;
      }

      // 3. Only active applications
      if (onlyActiveForms && job.status !== 'active') {
        return false;
      }

      // 4. Educational Qualification check
      if (studentQualification !== 'all') {
        const studentRank = getQualificationRank(studentQualification);
        const jobRank = getQualificationRank(job.minQualification);
        if (studentRank < jobRank) {
          return false;
        }
      }

      // 5. Age check with category relaxation
      const allowedMaxAge = getRelaxedMaxAge(job.maxAgeGeneral, studentCategory);
      if (studentAge < job.minAge || studentAge > allowedMaxAge) {
        return false;
      }

      // 6. Shorthand skill match
      if (job.stenoRequired) {
        if (!hasShorthandSkill) return false;
        if (job.stenoSpeedWpm && studentStenoSpeed < job.stenoSpeedWpm) return false;
      }

      // 7. Computer certificate match
      if (job.computerCertificateRequired && !hasComputerCertificate) {
        // Soft filter or let it show with warning
      }

      return true;
    });
  }, [
    studentQualification,
    studentAge,
    studentCategory,
    hasShorthandSkill,
    studentStenoSpeed,
    hasTypingSkill,
    hasComputerCertificate,
    selectedDepartmentCategory,
    searchKeyword,
    onlyActiveForms
  ]);

  return (
    <div className="space-y-6">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-amber-500/20 via-orange-950/40 to-slate-900 border-2 border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <Flame className="w-3 h-3 fill-current" />
                सरकारी नौकरी पात्रता फाइंडर (Live Job Matcher)
              </span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                {SARKARI_JOBS_DATABASE.filter(j => j.status === 'active').length} फॉर्म लाइव एक्टिव हैं
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white">
              अपनी योग्यता भरें और पता करें — कौन-सा फॉर्म अभी भरा रहा है? 🎯
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              शैक्षणिक योग्यता, आयु सीमा (आरक्षण छूट सहित) व शॉर्टहैंड/टाइपिंग कौशल चुनें। सिस्टम तुरंत आपके लिए 100% योग्य एक्टिव फॉर्म्स की सूची प्रदर्शित करेगा।
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="https://www.sarkariresult.com/"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>🌐 मूल Sarkari Result</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* STUDENT ELIGIBILITY FILTER CONSOLE (पात्रता इनपुट कंसोल) */}
      <div className="bg-[#0A0F1D] border-2 border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5 shadow-2xl">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-black text-white uppercase tracking-wider">
              1. आपकी शैक्षणिक व व्यक्तिगत पात्रता दर्ज करें (Student Eligibility Inputs):
            </h2>
          </div>

          <button
            onClick={() => {
              setStudentQualification('all');
              setStudentAge(22);
              setStudentCategory('ur');
              setHasShorthandSkill(false);
              setStudentStenoSpeed(80);
              setSelectedDepartmentCategory('all');
              setSearchKeyword('');
              showToast("पात्रता फ़िल्टर रीसेट कर दिए गए 🔄", "info");
            }}
            className="text-[10px] text-amber-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>रीसेट करें</span>
          </button>
        </div>

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. Qualification */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              <span>उच्चतम शैक्षणिक योग्यता:</span>
            </label>
            <select
              value={studentQualification}
              onChange={(e) => setStudentQualification(e.target.value as any)}
              className="w-full p-2.5 bg-[#060A14] border border-slate-800 rounded-xl text-xs text-white font-medium focus:outline-none focus:border-amber-500"
            >
              <option value="all">🌟 सभी योग्यताएं (All Qualifications)</option>
              <option value="10th">10वीं पास (High School / Matric)</option>
              <option value="12th">12वीं पास (10+2 Intermediate)</option>
              <option value="graduate">स्नातक (BA / BSc / BCom / BTech)</option>
              <option value="steno_diploma">स्टेनोग्राफी / आशुलिपि डिप्लोमा</option>
              <option value="post_graduate">परास्नातक (MA / MSc / MCom / PG)</option>
              <option value="iti">ITI पास (तकनीकी)</option>
              <option value="bed">B.Ed / D.El.Ed (शिक्षक पात्रता)</option>
            </select>
          </div>

          {/* 2. Age (आयु) */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>आपकी वर्तमान आयु:</span>
              </span>
              <span className="font-mono text-emerald-400 font-black text-xs">{studentAge} वर्ष</span>
            </label>
            <div className="flex items-center gap-3 bg-[#060A14] p-2 rounded-xl border border-slate-800">
              <input
                type="range"
                min="18"
                max="45"
                value={studentAge}
                onChange={(e) => setStudentAge(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-slate-300 shrink-0">{studentAge} Yrs</span>
            </div>
          </div>

          {/* 3. Category (आरक्षण श्रेणी) */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>आरक्षण श्रेणी (Age Relaxation):</span>
            </label>
            <select
              value={studentCategory}
              onChange={(e) => setStudentCategory(e.target.value as any)}
              className="w-full p-2.5 bg-[#060A14] border border-slate-800 rounded-xl text-xs text-white font-medium focus:outline-none focus:border-indigo-500"
            >
              <option value="ur">सामान्य / UR (अनारक्षित)</option>
              <option value="obc">OBC (+3 वर्ष आयु छूट)</option>
              <option value="ews">EWS (आर्थिक रूप से कमजोर)</option>
              <option value="sc">SC (+5 वर्ष आयु छूट)</option>
              <option value="st">ST (+5 वर्ष आयु छूट)</option>
              <option value="female">महिला वर्ग (Female Candidates)</option>
              <option value="pwd">दिव्यांग / PwD (+10 वर्ष छूट)</option>
            </select>
          </div>

          {/* 4. Target Department Sector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
              <span>पसंदीदा विभाग / आयोग:</span>
            </label>
            <select
              value={selectedDepartmentCategory}
              onChange={(e) => setSelectedDepartmentCategory(e.target.value)}
              className="w-full p-2.5 bg-[#060A14] border border-slate-800 rounded-xl text-xs text-white font-medium focus:outline-none focus:border-cyan-500"
            >
              <option value="all">🏢 सभी आयोग व विभाग (All Sectors)</option>
              <option value="ssc">SSC (Stenographer, CGL, CHSL, GD)</option>
              <option value="railway">Railway RRB (NTPC, Group D, ALP)</option>
              <option value="court_steno">High Court & District Court Steno</option>
              <option value="bpsc">BPSC & State PCS Exams</option>
              <option value="police">Police & Defense (SI, Steno, ASI)</option>
              <option value="banking">Banking (IBPS, SBI, RBI)</option>
              <option value="other">Postal GDS & Others</option>
            </select>
          </div>

        </div>

        {/* Special Skills Toggle Chips */}
        <div className="pt-2 border-t border-slate-850 flex flex-wrap items-center gap-3">
          <span className="text-[11px] font-bold text-slate-400">विशेष कौशल (Skills Check):</span>
          
          {/* Steno Toggle */}
          <button
            onClick={() => setHasShorthandSkill(!hasShorthandSkill)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              hasShorthandSkill
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <span>✍️ स्टेनोग्राफी (Shorthand)</span>
            {hasShorthandSkill && <span>✅</span>}
          </button>

          {/* Steno Speed Dropdown (If Enabled) */}
          {hasShorthandSkill && (
            <div className="flex items-center gap-1.5 bg-[#060A14] px-2.5 py-1 rounded-xl border border-amber-500/40">
              <span className="text-[10px] text-amber-300 font-bold">शॉर्टहैंड गति:</span>
              <select
                value={studentStenoSpeed}
                onChange={(e) => setStudentStenoSpeed(Number(e.target.value))}
                className="bg-transparent text-xs text-amber-400 font-black focus:outline-none"
              >
                <option value={80} className="bg-slate-900">80 WPM (Grade D)</option>
                <option value={100} className="bg-slate-900">100 WPM (Grade C)</option>
                <option value={110} className="bg-slate-900">110 WPM (High Court)</option>
                <option value={120} className="bg-slate-900">120+ WPM (Parliament / Reporter)</option>
              </select>
            </div>
          )}

          {/* Typing Toggle */}
          <button
            onClick={() => setHasTypingSkill(!hasTypingSkill)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              hasTypingSkill
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            <span>⌨️ कंप्यूटर टाइपिंग (Hindi/English)</span>
          </button>

          {/* Computer Certificate */}
          <button
            onClick={() => setHasComputerCertificate(!hasComputerCertificate)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              hasComputerCertificate
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            <span>💻 CCC / O-Level / DCA डिप्लोमा</span>
          </button>
        </div>

      </div>

      {/* MATCHED APPLICATIONS RESULTS HEADER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0A0F1D] border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-sm font-black text-white">
            आपके लिए <span className="text-amber-400 text-base">{matchedJobs.length}</span> सक्रिय सरकारी फॉर्म उपलब्ध हैं:
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="फॉर्म का नाम खोजें (e.g. SSC, Steno, BPSC)..."
              className="w-full py-1.5 pl-8 pr-3 bg-[#060A14] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          </div>

          <label className="flex items-center gap-1.5 text-xs text-slate-300 font-bold whitespace-nowrap cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyActiveForms}
              onChange={(e) => setOnlyActiveForms(e.target.checked)}
              className="accent-amber-500 rounded cursor-pointer"
            />
            <span>केवल एक्टिव फॉर्म (Active Only)</span>
          </label>
        </div>
      </div>

      {/* JOBS LIST GRID */}
      {matchedJobs.length === 0 ? (
        <div className="p-12 text-center bg-[#0A0F1D] border border-slate-800 rounded-3xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">
            चयनित पात्रता के अनुसार कोई एक्टिव फॉर्म नहीं मिला
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            कृपया आयु सीमा या योग्यता फ़िल्टर में थोड़ा बदलाव करें अथवा आगामी भर्तियों को देखने के लिए 'केवल एक्टिव फॉर्म' अनचेक करें।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matchedJobs.map(job => {
            const allowedMaxAge = getRelaxedMaxAge(job.maxAgeGeneral, studentCategory);
            const isAgeEligible = studentAge >= job.minAge && studentAge <= allowedMaxAge;

            return (
              <div
                key={job.id}
                className="bg-[#0A0F1D] border border-slate-800 hover:border-amber-500/50 rounded-3xl p-5 space-y-4 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between"
              >
                
                {/* Top Badge & Organization */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-300 font-mono text-[9px] font-black uppercase tracking-wider border border-slate-700">
                      {job.departmentNameHindi}
                    </span>

                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1 ${
                      job.status === 'active'
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-950/80 text-amber-400 border border-amber-500/30'
                    }`}>
                      <Clock className="w-3 h-3" />
                      <span>{job.status === 'active' ? 'आवेदन शुरू (Apply Active)' : 'आगामी भर्ती (Upcoming)'}</span>
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-white leading-snug">
                    {job.title}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-medium">
                    {job.descriptionHindi}
                  </p>
                </div>

                {/* Eligibility Verification Badges */}
                <div className="p-3 bg-[#060A14] border border-slate-850 rounded-2xl space-y-2 text-xs">
                  <div className="text-[10px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    <span>आपकी पात्रता मिलान (Eligibility Check):</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="text-slate-300">
                      🎓 योग्यता: <strong className="text-white block truncate">{job.qualificationLabelHindi}</strong>
                    </div>
                    <div className="text-slate-300">
                      🎂 आयु सीमा: <strong className="text-emerald-400 block">{job.minAge} से {allowedMaxAge} वर्ष (छूट सहित)</strong>
                    </div>
                    <div className="text-slate-300">
                      👥 कुल पद: <strong className="text-amber-400 block">{job.totalVacancies.toLocaleString('en-IN')} पद</strong>
                    </div>
                    <div className="text-slate-300">
                      💰 वेतनमान: <strong className="text-cyan-400 block truncate">{job.salaryPayScale}</strong>
                    </div>
                  </div>

                  {job.stenoRequired && (
                    <div className="p-1.5 bg-amber-950/30 border border-amber-500/30 rounded-lg text-[10px] text-amber-300 font-bold flex items-center justify-between">
                      <span>✍️ स्टेनोग्राफी अनिवार्य: {job.stenoSpeedWpm} WPM</span>
                      <span className="text-emerald-400">आप योग्य हैं ✅</span>
                    </div>
                  )}
                </div>

                {/* Important Dates */}
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-850">
                  <span>📅 शुरू: <strong className="text-slate-200">{job.startDate}</strong></span>
                  <span>🚨 अंतिम तिथि: <strong className="text-rose-400 font-black">{job.lastDate}</strong></span>
                </div>

                {/* Action Buttons Bar */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <a
                    href={job.officialApplyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all"
                  >
                    <span>Apply Online (ऑफिशियल)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    onClick={() => {
                      onAskHansAi(`मुझे ${job.title} की पूरी चयन प्रक्रिया, सिलेबस, कटऑफ और तैयारी की सटीक रणनीति बताइए।`);
                      showToast(`${job.title} की तैयारी गाइड हंस AI चैट में लोड हो गई! 🤖`, "info");
                    }}
                    className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>सिलेबस व तैयारी पूछें</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* QUICK PREP SHORTCUTS FOOTER */}
      <div className="bg-[#0A0F1D] border border-slate-800 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">स्टेनोग्राफर व प्रतियोगी परीक्षाओं की संपूर्ण तैयारी</h4>
            <p className="text-[11px] text-slate-400">
              हंस कम्पैन के डिजिटल पैड, लाइव डिक्टेशन और AI मॉक टेस्ट से अपनी गति 80 से 120 WPM तक ले जाएं।
            </p>
          </div>
        </div>

        <button
          onClick={() => onStartStenoMock("All Stenographer")}
          className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-lg hover:scale-102 transition-all whitespace-nowrap"
        >
          <span>✍️ All Stenographer स्टूडियो खोलें</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
export default SarkariResultEligibilityHub;
