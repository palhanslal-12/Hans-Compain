// Student Personalized Alert & Inactivity Notification Engine for Hans Compain
// Enforces:
// 1. Mandatory official brand tagline across ALL alerts: "हर सपने को मिलेगी उड़ान, जब साथ हो Hans Compain का सच्चा ज्ञान!"
// 2. Personalization with student's real Name: "नमस्ते [User Name]! ..."
// 3. App Logo icon (/favicon-96x96.png) in push notifications

import { getEffectiveUser } from '../firebase';

export const OFFICIAL_TAGLINE = 'हर सपने को मिलेगी उड़ान, जब साथ हो Hans Compain का सच्चा ज्ञान!';

export interface UnfinishedStudySession {
  type: 'board_exam' | 'competitive_mock' | 'chapter_study' | 'steno_dictation';
  title: string;
  progressText: string;
  timestamp: number;
}

export const StudentAlertEngine = {
  // 1. Get current student name or friendly default
  getUserDisplayName(): string {
    const user = getEffectiveUser();
    if (user && user.displayName && user.displayName.trim()) {
      return user.displayName.trim();
    }
    try {
      const saved = localStorage.getItem('hans_student_name');
      if (saved && saved.trim()) return saved.trim();
    } catch {}
    return 'प्रिय विद्यार्थी';
  },

  getUserEmail(): string {
    const user = getEffectiveUser();
    if (user && user.email) return user.email;
    try {
      const saved = localStorage.getItem('hans_student_email');
      if (saved) return saved;
    } catch {}
    return '';
  },

  // 2. Request browser / mobile notification permission
  async requestNotificationPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }
    if (Notification.permission === 'granted') {
      return true;
    }
    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  },

  // 3. Dispatch a high-impact personalized notification on phone / browser
  async sendPersonalizedNotification(params: {
    title: string;
    message: string;
    targetUrl?: string;
    eventType?: 'inactivity_24h' | 'incomplete_session' | 'daily_ca' | 'subject_quiz';
  }) {
    const userName = this.getUserDisplayName();
    const userEmail = this.getUserEmail();
    const hasPermission = await this.requestNotificationPermission();

    const fullTitle = `[Hans Compain] नमस्ते ${userName}! ${params.title}`;
    const fullBody = `${params.message}\n\n✨ ${OFFICIAL_TAGLINE}`;

    // A. Native Browser/Phone Web Push Notification with Short Logo
    if (hasPermission && 'Notification' in window) {
      try {
        const notif = new Notification(fullTitle, {
          body: fullBody,
          icon: '/favicon-96x96.png',
          badge: '/favicon-96x96.png',
          tag: params.eventType || 'hans-compain-alert',
          silent: false
        });

        notif.onclick = () => {
          window.focus();
          if (params.targetUrl) {
            window.location.hash = params.targetUrl;
          }
          notif.close();
        };
      } catch (err) {
        console.warn('Native notification dispatch error:', err);
      }
    }

    // B. Dispatch to Backend for Automated Email Alert
    try {
      await fetch('/api/admin/auto-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: params.eventType || 'inactivity_24h',
          title: fullTitle,
          featureName: params.eventType || 'Personalized Student Alert',
          userEmail: userEmail || 'hanscompain@gmail.com',
          details: `छात्र: ${userName} (${userEmail || 'Guest'})\nसंदेश: ${params.message}\nटैगलाइन: ${OFFICIAL_TAGLINE}`
        })
      });
    } catch {
      // ignore network errors
    }
  },

  // 4. Save unfinished test or chapter study session
  saveUnfinishedSession(session: Omit<UnfinishedStudySession, 'timestamp'>) {
    try {
      const data: UnfinishedStudySession = {
        ...session,
        timestamp: Date.now()
      };
      localStorage.setItem('hans_unfinished_session', JSON.stringify(data));
    } catch {}
  },

  clearUnfinishedSession() {
    try {
      localStorage.removeItem('hans_unfinished_session');
    } catch {}
  },

  getUnfinishedSession(): UnfinishedStudySession | null {
    try {
      const raw = localStorage.getItem('hans_unfinished_session');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  // 5. Check Inactivity & Incomplete sessions and trigger appropriate alert
  checkAndTriggerAlerts() {
    const userName = this.getUserDisplayName();
    const now = Date.now();

    // Check last active time
    let lastActive = now;
    try {
      const saved = localStorage.getItem('hans_last_active_time');
      if (saved) lastActive = parseInt(saved, 10);
      localStorage.setItem('hans_last_active_time', now.toString());
    } catch {}

    const diffHours = (now - lastActive) / (1000 * 60 * 60);

    // Trigger 24-hour inactivity alert if > 24 hours
    if (diffHours >= 24) {
      this.sendPersonalizedNotification({
        title: 'आपकी पढ़ाई रुकनी नहीं चाहिए!',
        message: `आपने पिछले 24 घंटे से Hans Compain पर कोई अभ्यास नहीं किया है। परीक्षा नज़दीक है, केवल 10 मिनट में आज का अभ्यास पूरा करें।`,
        eventType: 'inactivity_24h'
      });
      return;
    }

    // Check if there is an unfinished session left over 1.5 hours ago
    const unfinished = this.getUnfinishedSession();
    if (unfinished && now - unfinished.timestamp > 1.5 * 60 * 60 * 1000) {
      this.sendPersonalizedNotification({
        title: 'आपका टेस्ट अधूरा छूट गया है!',
        message: `आपका सत्र "${unfinished.title}" (${unfinished.progressText}) अधूरा छूट गया था। तुरंत पूरा करके अपना फाइनल स्कोर व रैंक देखें!`,
        eventType: 'incomplete_session'
      });
      // Clear after notifying to avoid spamming
      this.clearUnfinishedSession();
    }
  },

  // 6. Test Trigger Helper (for instant UI demonstration)
  triggerDemoAlert(type: 'inactivity' | 'incomplete' | 'daily_ca' | 'quiz') {
    const userName = this.getUserDisplayName();

    switch (type) {
      case 'inactivity':
        return this.sendPersonalizedNotification({
          title: 'आपकी पढ़ाई रुकनी नहीं चाहिए!',
          message: `आपने पिछले 24 घंटे से कोई अभ्यास नहीं किया है। परीक्षा की राह में निरंतरता ही जीत दिलाती है — आज का 10 मिनट का मॉक टेस्ट पूरा करें!`,
          eventType: 'inactivity_24h'
        });
      case 'incomplete':
        return this.sendPersonalizedNotification({
          title: 'आपका टेस्ट अधूरा छूट गया है!',
          message: `आपका टेस्ट "कक्षा 10वीं विज्ञान - प्रकाश का परावर्तन" बीच में छूट गया था। केवल 5 सवाल बाकी हैं, तुरंत स्कोर व रैंक चेक करें!`,
          eventType: 'incomplete_session'
        });
      case 'daily_ca':
        return this.sendPersonalizedNotification({
          title: 'आज के 15+ परीक्षा-संभावित करेंट अफेयर्स तैयार हैं!',
          message: `PIB, The Hindu व ISRO बुलेटिन पर आधारित आज के 15+ ताज़ा करेंट अफेयर्स व क्विज़ लाइव हैं। 5 मिनट में अपना ज्ञान अपडेट करें!`,
          eventType: 'daily_ca'
        });
      case 'quiz':
        return this.sendPersonalizedNotification({
          title: 'आज का स्पेशल चैलेंज: English Grammar (Voice & Narration)',
          message: `बोर्ड व SSC परीक्षा में बार-बार पूछे जाने वाले डायरेक्ट-इनडायरेक्ट व एक्टिव-पैसिव के 10 प्रश्न हल करें और अपनी तैयारी परखें!`,
          eventType: 'subject_quiz'
        });
    }
  }
};

export default StudentAlertEngine;
