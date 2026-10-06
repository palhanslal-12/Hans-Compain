import React, { useState } from 'react';
import { Award, Calendar, CheckCircle2, AlertCircle, ExternalLink, Calculator, Search, Filter, FileText, ChevronRight } from 'lucide-react';

interface JobNotification {
  id: string;
  title: string;
  dept: string;
  totalPosts: string;
  qualification: string;
  minAge: number;
  maxAge: number;
  lastDate: string;
  examDate: string;
  category: 'SSC' | 'RAILWAY' | 'DEFENCE' | 'BANKING' | 'STATE';
  applyUrl: string;
  syllabusUrl: string;
}

export const SarkariResultEligibilityHub: React.FC = () => {
  // Calculator state
  const [userBirthYear, setUserBirthYear] = useState<number>(2001);
  const [userCategory, setUserCategory] = useState<'UR' | 'OBC' | 'SC' | 'ST' | 'EWS'>('UR');
  const [userQualification, setUserQualification] = useState<'10th' | '12th' | 'Graduation'>('12th');
  const [activeTab, setActiveTab] = useState<'jobs' | 'calculator'>('jobs');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const currentYear = 2026;
  const calculatedAge = currentYear - userBirthYear;

  const ageRelaxation: Record<string, number> = {
    UR: 0,
    EWS: 0,
    OBC: 3,
    SC: 5,
    ST: 5
  };

  const jobsList: JobNotification[] = [
    {
      id: 'ssc-steno-2026',
      title: 'SSC Stenographer Grade C & D Recruitment 2026',
      dept: 'Staff Selection Commission (SSC)',
      totalPosts: '2,614 पद',
      qualification: '12th Pass + Shorthand (80/100 WPM)',
      minAge: 18,
      maxAge: 30,
      lastDate: '30 अप्रैल 2026',
      examDate: 'जुलाई 2026',
      category: 'SSC',
      applyUrl: 'https://ssc.gov.in',
      syllabusUrl: '#'
    },
    {
      id: 'ssc-cgl-2026',
      title: 'SSC Combined Graduate Level (CGL) 2026',
      dept: 'Staff Selection Commission',
      totalPosts: '14,500+ पद',
      qualification: 'Graduation in Any Stream',
      minAge: 18,
      maxAge: 32,
      lastDate: '15 मई 2026',
      examDate: 'सितंबर 2026',
      category: 'SSC',
      applyUrl: 'https://ssc.gov.in',
      syllabusUrl: '#'
    },
    {
      id: 'rrb-ntpc-2026',
      title: 'Railway RRB Non-Technical (NTPC) 2026',
      dept: 'Railway Recruitment Control Board (RRB)',
      totalPosts: '11,558 पद',
      qualification: '12th Pass / Graduate',
      minAge: 18,
      maxAge: 33,
      lastDate: '10 जून 2026',
      examDate: 'अक्टूबर 2026',
      category: 'RAILWAY',
      applyUrl: 'https://indianrailways.gov.in',
      syllabusUrl: '#'
    },
    {
      id: 'bihar-police-2026',
      title: 'बिहार पुलिस कांस्टेबल व सब-इंस्पेक्टर (BSSC/CSBC)',
      dept: 'Bihar Police & Home Guards',
      totalPosts: '21,391 पद',
      qualification: '12th Pass (Constable) / Graduate (SI)',
      minAge: 18,
      maxAge: 25,
      lastDate: '25 मई 2026',
      examDate: 'अगस्त 2026',
      category: 'STATE',
      applyUrl: 'https://csbc.bih.nic.in',
      syllabusUrl: '#'
    },
    {
      id: 'ibps-po-2026',
      title: 'IBPS Probationary Officer (PO) & Clerk',
      dept: 'Institute of Banking Personnel Selection',
      totalPosts: '4,450 पद',
      qualification: 'Graduation Degree',
      minAge: 20,
      maxAge: 30,
      lastDate: '28 जून 2026',
      examDate: 'नवंबर 2026',
      category: 'BANKING',
      applyUrl: 'https://ibps.in',
      syllabusUrl: '#'
    }
  ];

  const filteredJobs = jobsList.filter(j => filterCategory === 'ALL' || j.category === filterCategory);

  const eligibleJobs = jobsList.filter(job => {
    const effectiveMaxAge = job.maxAge + (ageRelaxation[userCategory] || 0);
    const ageEligible = calculatedAge >= job.minAge && calculatedAge <= effectiveMaxAge;
    
    let qualEligible = false;
    if (userQualification === 'Graduation') qualEligible = true;
    else if (userQualification === '12th') qualEligible = job.qualification.includes('12th') || job.qualification.includes('Constable');
    else if (userQualification === '10th') qualEligible = job.qualification.includes('10th');

    return ageEligible && qualEligible;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/40 p-5 sm:p-6 rounded-3xl border border-emerald-500/30 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase border border-emerald-500/30 mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>सत्यापित सरकारी भर्ती सूचना 2026</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              सरकारी रिजल्ट व पात्रता केंद्र (Sarkari Result Hub)
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              SSC, रेलवे, बैंकिंग, बिहार व यूपी राज्य भर्तियों की समय-सारिणी, प्रवेश पत्र, और आयु व योग्यता पात्रता कैलकुलेटर।
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'jobs' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              ताज़ा भर्तियां (Live Jobs)
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'calculator' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>पात्रता कैलकुलेटर</span>
            </button>
          </div>
        </div>

        {/* Filter categories */}
        {activeTab === 'jobs' && (
          <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-800">
            {['ALL', 'SSC', 'RAILWAY', 'STATE', 'BANKING'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-emerald-500 text-slate-950 shadow'
                    : 'bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {cat === 'ALL' ? 'सभी भर्तियां' : cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* VIEW 1: LATEST JOBS LIST */}
      {activeTab === 'jobs' && (
        <div className="space-y-3">
          {filteredJobs.map(job => (
            <div
              key={job.id}
              className="bg-[#091122] border border-slate-800 hover:border-emerald-500/50 rounded-3xl p-5 space-y-3 transition-all shadow-md group"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-slate-850 pb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-black uppercase">
                      {job.category}
                    </span>
                    <span className="text-xs font-bold text-slate-400">{job.dept}</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-white group-hover:text-emerald-300 transition-colors">
                    {job.title}
                  </h3>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-xl block sm:inline-block">
                    {job.totalPosts}
                  </span>
                </div>
              </div>

              {/* Job Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-850">
                  <span className="text-[10px] text-slate-400 block">शैक्षणिक योग्यता:</span>
                  <span className="font-bold text-slate-200">{job.qualification}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-850">
                  <span className="text-[10px] text-slate-400 block">आयु सीमा:</span>
                  <span className="font-bold text-slate-200">{job.minAge} - {job.maxAge} वर्ष</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-850">
                  <span className="text-[10px] text-slate-400 block">अंतिम तिथि:</span>
                  <span className="font-bold text-amber-300">{job.lastDate}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-850">
                  <span className="text-[10px] text-slate-400 block">संभावित परीक्षा:</span>
                  <span className="font-bold text-cyan-300">{job.examDate}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-1">
                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 transition-all shadow cursor-pointer"
                >
                  <span>आधिकारिक वेबसाइट पर आवेदन करें</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: ELIGIBILITY CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="bg-[#091122] border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-400" />
              <span>व्यक्तिगत सरकारी नौकरी पात्रता परीक्षक (Check Your Eligibility)</span>
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              अपनी जन्म तिथि, श्रेणी (Category) और योग्यता चुनें और जानें कि आप किन-किन सरकारी परीक्षाओं के लिए योग्य हैं।
            </p>
          </div>

          {/* Calculator Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 mb-1.5 block">जन्म वर्ष (Birth Year):</label>
              <select
                value={userBirthYear}
                onChange={(e) => setUserBirthYear(parseInt(e.target.value))}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
              >
                {Array.from({ length: 25 }, (_, i) => 2010 - i).map(year => (
                  <option key={year} value={year}>{year} (आयु: {currentYear - year} वर्ष)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 mb-1.5 block">आरक्षण श्रेणी (Category):</label>
              <select
                value={userCategory}
                onChange={(e) => setUserCategory(e.target.value as any)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
              >
                <option value="UR">General / Unreserved (UR)</option>
                <option value="OBC">OBC (3 वर्ष की छूट)</option>
                <option value="SC">SC (5 वर्ष की छूट)</option>
                <option value="ST">ST (5 वर्ष की छूट)</option>
                <option value="EWS">EWS</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 mb-1.5 block">उच्चतम योग्यता (Highest Qualification):</label>
              <select
                value={userQualification}
                onChange={(e) => setUserQualification(e.target.value as any)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
              >
                <option value="10th">10th Matriculation</option>
                <option value="12th">12th Intermediate</option>
                <option value="Graduation">Graduation / Degree</option>
              </select>
            </div>
          </div>

          {/* Result Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-teal-950/40 border border-emerald-500/30 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-semibold">आपकी गणना की गई वर्तमान आयु:</span>
              <div className="text-lg font-black text-emerald-300 font-mono">
                {calculatedAge} वर्ष ({userCategory} श्रेणी छूट लागू)
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 font-semibold">कुल योग्य परीक्षाएं:</span>
              <div className="text-xl font-black text-white">
                {eligibleJobs.length} / {jobsList.length}
              </div>
            </div>
          </div>

          {/* Eligible Jobs List */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300 block">
              आप निम्नलिखित परीक्षाओं के लिए 100% पात्र हैं:
            </span>
            {eligibleJobs.length > 0 ? (
              <div className="space-y-2">
                {eligibleJobs.map(job => (
                  <div key={job.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-850 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-white">{job.title}</div>
                        <div className="text-[10px] text-slate-400">{job.totalPosts} • {job.qualification}</div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-black">
                      Eligible
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>चयनित आयु या योग्यता के अनुसार अभी कोई सीधी भर्ती उपलब्ध नहीं है। कृपया अपनी योग्यता बदलें।</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
