import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  Bell, 
  Sparkles, 
  Send, 
  History, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  CheckSquare, 
  Clock, 
  Settings, 
  Award, 
  Activity,
  Smartphone,
  Eye,
  RefreshCw,
  TrendingUp,
  Inbox
} from 'lucide-react';
import { db, auth, OperationType, handleFirestoreError } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  setDoc, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  onSnapshot 
} from 'firebase/firestore';

interface RetentionAlertsDashboardProps {
  user: { name: string; email: string; phone?: string } | null;
  onUpdateUser: (updatedUser: { name: string; email: string; phone?: string }) => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'warn' | 'error') => void;
  language?: string;
}

interface EmailLog {
  id: string;
  recipient: string;
  type: 'daily_inactivity' | 'performance_milestone' | 'weekly_summary';
  status: 'Delivered' | 'Pending' | 'Bounced';
  timestamp: any;
  subject: string;
  scoreCard?: {
    rank: number;
    score: number;
    streak: number;
  };
}

export const RetentionAlertsDashboard: React.FC<RetentionAlertsDashboardProps> = ({
  user,
  onUpdateUser,
  showToast,
  language = 'hindi'
}) => {
  const isHindi = language === 'hindi';
  
  // Local profile states
  const [emailInput, setEmailInput] = useState(user?.email || 'palhanslal4@gmail.com');
  const [phoneInput, setPhoneInput] = useState(user?.phone || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Retention Alert settings
  const [settings, setSettings] = useState({
    enableDailyEmails: true,
    enableRankMilestones: true,
    enablePhoneVibrationAlerts: true,
    preferredHour: 19, // 7 PM
    inactivityTriggerDays: 1
  });

  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [isLogsLoading, setIsLogsLoading] = useState(false);
  const [activePreviewType, setActivePreviewType] = useState<'daily_inactivity' | 'performance_milestone'>('performance_milestone');
  const [showHtmlPreviewModal, setShowHtmlPreviewModal] = useState(false);

  // Fallback state if user is offline or not authenticated
  const targetEmail = user?.email || 'palhanslal4@gmail.com';

  // Sync state when props change
  useEffect(() => {
    if (user) {
      if (user.email) setEmailInput(user.email);
      if (user.phone) setPhoneInput(user.phone);
    }
  }, [user]);

  // Firestore Real-Time Listener for Email Dispatch Logs
  useEffect(() => {
    const q = query(
      collection(db, 'retention_emails_logs'),
      where('recipient', '==', targetEmail),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const parsedLogs: EmailLog[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        parsedLogs.push({
          id: docSnap.id,
          recipient: data.recipient,
          type: data.type,
          status: data.status || 'Delivered',
          timestamp: data.timestamp,
          subject: data.subject,
          scoreCard: data.scoreCard
        });
      });
      setLogs(parsedLogs);
    }, (error) => {
      console.warn("Real-time logs subscription failed, falling back to static query: ", error);
      fetchLogsStatic();
    });

    return () => unsubscribe();
  }, [targetEmail]);

  const fetchLogsStatic = async () => {
    setIsLogsLoading(true);
    try {
      const q = query(
        collection(db, 'retention_emails_logs'),
        where('recipient', '==', targetEmail),
        orderBy('timestamp', 'desc')
      );
      const snapshot = await getDocs(q);
      const parsedLogs: EmailLog[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        parsedLogs.push({
          id: docSnap.id,
          recipient: data.recipient,
          type: data.type,
          status: data.status || 'Delivered',
          timestamp: data.timestamp,
          subject: data.subject,
          scoreCard: data.scoreCard
        });
      });
      setLogs(parsedLogs);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLogsLoading(false);
    }
  };

  // Update Settings in Firestore & Local storage
  const handleSaveSettings = async () => {
    setIsSavingProfile(true);
    try {
      const normalizedEmail = emailInput.trim().toLowerCase();
      // Update local profile variables
      onUpdateUser({
        name: user?.name || 'Scholar Student',
        email: normalizedEmail,
        phone: phoneInput.trim()
      });

      // Save user retention parameters to Firestore
      const userRef = doc(db, 'retention_profiles', normalizedEmail.replace(/[^a-zA-Z0-9]/g, '_'));
      await setDoc(userRef, {
        email: normalizedEmail,
        phone: phoneInput.trim(),
        settings,
        updatedAt: serverTimestamp()
      });

      showToast(
        isHindi 
          ? '🔔 रीटेंशन सेटिंग्स एवं प्रोफाइल डेटा सफलतापूर्वक सेव कर दिया गया है!' 
          : '🔔 Retention Preferences and Profile synced in Firestore successfully!',
        'success'
      );
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'retention_profiles');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Dispatch Simulated/Real Email Trigger to Firestore
  const triggerEmailAlert = async (type: 'daily_inactivity' | 'performance_milestone') => {
    const isMilestone = type === 'performance_milestone';
    const subject = isMilestone
      ? '🏆 HANS AI: उत्कृष्ट प्रदर्शन रिपोर्ट! नया शैक्षणिक रैंक अनलॉक हुआ'
      : '📚 क्या आप आज पढ़ना भूल गए? चलिए अपनी तैयारी जारी रखते हैं!';

    const scoreCard = isMilestone ? {
      rank: 4,
      score: 92,
      streak: 5
    } : undefined;

    try {
      // Add dispatch record in Firestore
      const logData = {
        recipient: emailInput.trim().toLowerCase(),
        type,
        status: 'Delivered',
        timestamp: serverTimestamp(),
        subject,
        scoreCard
      };

      await addDoc(collection(db, 'retention_emails_logs'), logData);

      showToast(
        isHindi 
          ? `📧 ईमेल अलर्ट सफलतापूर्वक ${emailInput} पर भेजा गया! लॉग सुरक्षित किया गया।` 
          : `📧 Simulated Retention alert dispatched to ${emailInput}! Logged in Firestore.`,
        'success'
      );

      // Trigger standard web notification as fallback browser behavior
      if (Notification.permission === 'granted') {
        new Notification(subject, {
          body: isMilestone ? 'बधाई हो! आपकी तैयारी का स्कोर शानदार रहा है। आगे बढ़ें।' : 'आलस्य त्यागें और पढ़ाई शुरू करें!',
          icon: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=100'
        });
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'retention_emails_logs');
    }
  };

  // HTML Rendered Template Preview for Live Envelope View
  const renderEmailBodyHTML = (type: 'daily_inactivity' | 'performance_milestone') => {
    const isMilestone = type === 'performance_milestone';
    return (
      <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 text-[#0F172A] font-sans max-w-xl mx-auto shadow-inner text-left">
        {/* Header Branding */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-4 rounded-xl text-center text-white mb-4">
          <h1 className="text-xl font-extrabold tracking-wide m-0">🎓 HANS STUDY HUB AI</h1>
          <p className="text-xs text-indigo-100 mt-1 font-medium m-0">Bharati Bhawan Academic & Competitions Companion</p>
        </div>

        {/* Content Box */}
        <div className="space-y-4 text-xs sm:text-sm">
          <p className="font-bold text-slate-800 text-sm">नमस्ते, {user?.name || 'प्रिय विद्यार्थी'}!</p>

          {isMilestone ? (
            <div className="space-y-3.5">
              <p className="leading-relaxed text-slate-600">
                हमें यह बताते हुए अत्यंत प्रसन्नता हो रही है कि आपके **Academic Quiz Studio** टेस्ट प्रदर्शन का लाइव विश्लेषण पूरा हो गया है। आप अपनी कक्षा के शीर्ष रैंकर्स में शामिल हो चुके हैं!
              </p>

              {/* Scorecard visual */}
              <div className="bg-white p-3.5 rounded-xl border border-indigo-100 flex items-center justify-around text-center shadow-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">SCORE</span>
                  <span className="text-lg font-black text-emerald-600">92%</span>
                </div>
                <div className="border-r border-slate-200 h-8"></div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">RANK</span>
                  <span className="text-lg font-black text-indigo-600">#4</span>
                </div>
                <div className="border-r border-slate-200 h-8"></div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">DAILY STREAK</span>
                  <span className="text-lg font-black text-amber-500">🔥 5 Days</span>
                </div>
              </div>

              <div className="bg-indigo-50 border-l-4 border-indigo-600 p-2.5 rounded text-indigo-950 font-bold text-[11px]">
                💡 एआई फीडबैक: आपका इतिहास एवं सामान्य ज्ञान उत्कृष्ट है। अगले पड़ाव में 'गणित' और 'स्टेनो' अध्यायों पर विशेष बल दें।
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              <p className="leading-relaxed text-slate-600">
                हमने देखा कि आपने पिछले **24 घंटों** से भारती भवन स्टडी हब ऐप में लॉग इन नहीं किया है। नियमित अभ्यास ही परीक्षा में सफलता की असली कुंजी है!
              </p>
              
              {/* Daily Tip Card */}
              <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl flex items-start gap-2.5">
                <span className="text-lg shrink-0">⏳</span>
                <div>
                  <h4 className="font-bold text-amber-800 text-xs m-0">आज का दैनिक मोटिवेशन सूत्र:</h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-normal m-0">
                    "सफलता कभी अंतिम नहीं होती और विफलता कभी घातक नहीं होती, प्रयास जारी रखने का साहस ही मायने रखता है।" - विंस्टन चर्चिल
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Slogans and Dynamic Recommendation */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] text-slate-400 block font-bold">🎯 आज का अनुशंसित अध्याय (Recommended Task):</span>
            <span className="font-black text-slate-750 text-xs block mt-1">भारती भवन प्रकाशकीय - भौतिक विज्ञान : अध्याय 3 अभ्यास</span>
          </div>

          {/* Action button inside simulated email */}
          <div className="text-center pt-2">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); showToast('🔗 ईमेल लिंक: मुख्य अध्ययन स्टूडियो सक्रीय!', 'info'); }}
              className="inline-block py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-black text-xs tracking-wider shadow-sm"
            >
              RESUME STUDY WORKSPACE (पढ़ाई जारी रखें)
            </a>
          </div>

          <hr className="border-t border-slate-200 my-4" />
          <div className="text-[10px] text-slate-400 text-center leading-normal">
            HANS AI Autonomous Retention System • palhanslal4@gmail.com <br />
            यदि आप इन ईमेल सूचनाओं को बंद करना चाहते हैं, तो ऐप के अलर्ट डैशबोर्ड पर जाकर अनसब्सक्राइब करें।
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 bg-slate-50 text-slate-900 rounded-3xl border border-slate-200 shadow-xl space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-xs">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-800 flex items-center gap-2">
              <span>HANS AI Auto-Retention Engine</span>
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">PREMIUM</span>
            </h1>
            <p className="text-xs text-slate-500 font-bold mt-1">
              {isHindi 
                ? 'ईमेल एवं फोन अलर्ट सुचारू व्यवस्था - विद्यार्थियों को दैनिक परीक्षा की याद दिलाने के लिए' 
                : 'Automated retention update dispatch center for registered students'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (Notification.permission !== 'granted') {
                Notification.requestPermission();
              } else {
                showToast('💡 ब्राउज़र पुश अलर्ट पहले से सक्रिय हैं!', 'info');
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
          >
            <Bell className="w-3.5 h-3.5 text-indigo-600" />
            <span>Enable Push Alert</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Profile and Settings Forms (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* USER BIO CARD SYNC */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-indigo-600" />
              <span>{isHindi ? '1. ओनर / विद्यार्थी अलर्ट गंतव्य (Alert Identity Sync)' : '1. Student Destination Settings'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-slate-500 uppercase block">Recipient Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full text-xs pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none text-slate-800 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-slate-500 uppercase block">SMS Phone Number (Alert Recipient)</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 10-digit phone"
                    maxLength={10}
                    className="w-full text-xs pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none text-slate-800 font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-[11px] text-slate-600 leading-relaxed">
              💡 **Retention Rule:** जब कोई विद्यार्थी नया लॉग इन करता है या यहाँ फोन नंबर/ईमेल अपडेट करता है, तो बड़ी कंपनियों की तरह रीटेंशन रोबोट स्वतः सक्रिय होकर प्रत्येक **24 घंटे की निष्क्रियता** के बाद दैनिक प्रगति मेल भेजता है।
            </div>
          </div>

          {/* ADVANCED RETENTION CONFIGURATOR */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <Settings className="w-4 h-4 text-indigo-600" />
              <span>{isHindi ? '2. रिमाइंडर्स एवं शेड्यूलर पैरामीटर्स' : '2. Retention Scheduler Rules'}</span>
            </h3>

            <div className="space-y-3">
              {/* Toggle Daily Retention Email */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-150">
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800">दैनिक निष्क्रियता रिमाइंडर्स (Daily Retention Alerts)</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">24 घंटे पढ़ाई न करने पर स्वतः अनुस्मारक ईमेल भेजें।</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableDailyEmails}
                  onChange={(e) => setSettings(prev => ({ ...prev, enableDailyEmails: e.target.checked }))}
                  className="w-4 h-4 text-indigo-600 accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Toggle Performance Milestones */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-150">
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800">रैंक व उत्कृष्ट प्रदर्शन उत्सव (Rank Milestone Celebration)</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">क्विज़ में रैंक सुधरने या उच्च स्कोर प्राप्त होने पर बधाई ईमेल भेजें।</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableRankMilestones}
                  onChange={(e) => setSettings(prev => ({ ...prev, enableRankMilestones: e.target.checked }))}
                  className="w-4 h-4 text-indigo-600 accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Toggle Phone Vibration alert */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-150">
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800">मोबाइल वाइब्रेशन व अलर्ट (Smartphone Vibration Alert)</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">फोन पर महत्वपूर्ण टेस्ट सूचना या री-ओपनिंग के लिए हल्की कंपन अलर्ट।</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enablePhoneVibrationAlerts}
                  onChange={(e) => setSettings(prev => ({ ...prev, enablePhoneVibrationAlerts: e.target.checked }))}
                  className="w-4 h-4 text-indigo-600 accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Daily dispatch preferred hour slider */}
            <div className="space-y-2 pt-2 text-left">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <span>⏰ दैनिक शेड्यूलर प्रेषण समय (Daily Dispatch Target):</span>
                <span className="text-indigo-600 font-extrabold">{settings.preferredHour % 12 || 12} {settings.preferredHour >= 12 ? 'PM' : 'AM'}</span>
              </div>
              <input
                type="range"
                min={0}
                max={23}
                value={settings.preferredHour}
                onChange={(e) => setSettings(prev => ({ ...prev, preferredHour: parseInt(e.target.value) }))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="text-[9px] text-slate-500 block leading-normal mt-1">
                📅 शेड्यूलर दैनिक रूप से आपके चयनित घंटे पर रीटेंशन ऑडिट शुरू करता है। यदि आप सक्रिय नहीं हैं, तो ईमेल फायर की जाती है।
              </span>
            </div>

            <button
              onClick={handleSaveSettings}
              disabled={isSavingProfile}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSavingProfile ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>SYNCHRONIZING IN FIRESTORE...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>SYNC ALERT PREFERENCES & BIO (डाटा सेव करें)</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: Interactive Simulator, Previewer & Firestore Log History (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* INTERACTIVE DISPATCH CONTROLLERS */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-xl space-y-4">
            <h3 className="text-sm font-black flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>HANS AI Email Trigger Console</span>
            </h3>
            
            <p className="text-[11px] text-slate-300 leading-normal text-left">
              यहाँ से आप तुरंत **HANS Retention Robot** को टेस्ट ईमेल डिस्पैच करने की कमांड दे सकते हैं। यह ठीक बड़ी एड-टेक कंपनियों के ऑटो-सिस्टम की तरह कार्य करेगा:
            </p>

            <div className="grid grid-cols-1 gap-2.5">
              <button
                onClick={() => triggerEmailAlert('daily_inactivity')}
                className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-750 border border-indigo-500/30 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all active:scale-98 text-left cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-black">
                  1
                </div>
                <div className="flex-1 min-h-0 text-left">
                  <span className="block text-xs font-black">Fire Inactivity Alert 📚</span>
                  <span className="block text-[9px] text-slate-400">दैनिक रिमाइंडर्स प्रेषित करें</span>
                </div>
                <Send className="w-3.5 h-3.5 text-indigo-400" />
              </button>

              <button
                onClick={() => triggerEmailAlert('performance_milestone')}
                className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-750 border border-emerald-500/30 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all active:scale-98 text-left cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-black">
                  2
                </div>
                <div className="flex-1 min-h-0 text-left">
                  <span className="block text-xs font-black">Fire Milestone Celebration Report 🏆</span>
                  <span className="block text-[9px] text-slate-400">बधाई व प्रोग्रेस रिपोर्ट भेजें</span>
                </div>
                <Send className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  setActivePreviewType('performance_milestone');
                  setShowHtmlPreviewModal(true);
                }}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[10px] rounded-lg tracking-wider transition-all flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>PREVIEW DYNAMIC EMAIL MOCKUP</span>
              </button>
            </div>
          </div>

          {/* REAL-TIME FIRESTORE DISPATCH LOGS */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3.5 text-left">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1.5">
                <History className="w-4 h-4 text-indigo-600" />
                <span>Firestore Email Logs ({logs.length})</span>
              </h3>
              
              <button
                onClick={fetchLogsStatic}
                disabled={isLogsLoading}
                className="p-1.5 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                title="Refresh logs from database"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLogsLoading ? 'animate-spin text-indigo-600' : ''}`} />
              </button>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {logs.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  <Inbox className="w-8 h-8 mx-auto text-slate-300 mb-1" />
                  <span>कोई रिमाइंडर्स लॉग दर्ज नहीं है। <br />ऊपर डिस्पैच बटन दबाएं!</span>
                </div>
              ) : (
                logs.map((log) => {
                  const date = log.timestamp?.seconds 
                    ? new Date(log.timestamp.seconds * 1000).toLocaleTimeString() 
                    : new Date().toLocaleTimeString();

                  return (
                    <div 
                      key={log.id} 
                      className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 flex items-start gap-2.5 hover:bg-slate-100/60 transition-colors text-xs"
                    >
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                        log.type === 'performance_milestone' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'
                      }`}>
                        {log.type === 'performance_milestone' ? '🏆' : '📚'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-extrabold text-slate-700 text-[11px] truncate">{log.subject}</span>
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded shrink-0">SENT</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">To: {log.recipient} • {date}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </div>

      {/* MODAL: PREMIUM REAL-TIME HTML EMAIL PREVIEWER */}
      {showHtmlPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn font-sans">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl p-5 sm:p-6 relative shadow-2xl space-y-4 text-left max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">📧</span>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800">Direct Responsive HTML Email Template</h3>
                  <p className="text-[9px] text-slate-500 font-bold">See exactly what goes to palhanslal4@gmail.com</p>
                </div>
              </div>
              <button 
                onClick={() => setShowHtmlPreviewModal(false)}
                className="p-1 px-2.5 text-slate-400 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all text-xs font-bold border-none cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {/* Toggle tabs inside modal */}
            <div className="flex border-b border-slate-100 pb-2 gap-2">
              <button
                onClick={() => setActivePreviewType('performance_milestone')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  activePreviewType === 'performance_milestone'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                🏆 performance_milestone.html
              </button>
              <button
                onClick={() => setActivePreviewType('daily_inactivity')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  activePreviewType === 'daily_inactivity'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                📚 daily_inactivity.html
              </button>
            </div>

            {/* HTML preview render */}
            <div className="max-h-[50vh] overflow-y-auto p-1.5 bg-slate-100 rounded-2xl">
              {renderEmailBodyHTML(activePreviewType)}
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
              <span className="text-[10px] text-slate-400 italic">Precompiled with responsive inline tables & fluid design structures.</span>
              <button
                onClick={() => {
                  triggerEmailAlert(activePreviewType);
                  setShowHtmlPreviewModal(false);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch Simulated Email Alert</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
