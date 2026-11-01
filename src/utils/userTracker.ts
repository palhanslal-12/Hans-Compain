import { getEffectiveUser } from '../firebase';

export function getVisitorId(): string {
  try {
    let id = localStorage.getItem('hans_visitor_id');
    if (!id) {
      id = `guest_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
      localStorage.setItem('hans_visitor_id', id);
    }
    return id;
  } catch {
    return `guest_${Date.now().toString(36)}`;
  }
}

export function trackVisitorAction(featureName: string, actionDetail?: string) {
  try {
    let user = getEffectiveUser();
    if (!user) {
      try {
        const raw = localStorage.getItem('hans_auth_session');
        if (raw) user = JSON.parse(raw);
      } catch {}
    }

    const isLogged = !!user && !user.isAnonymous && !!(user.email || user.displayName);
    const visitorId = user?.uid || getVisitorId();
    const displayName = user?.displayName || (user?.email ? user.email.split('@')[0] : `अतिथि छात्र (#${visitorId.slice(-4)})`);
    const email = user?.email || (isLogged ? 'student@hanscompain.in' : 'अतिथि (Guest)');
    const targetExam = localStorage.getItem('hans_target_exam') || 'SSC & Steno 2026';

    const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const deviceType = width < 768 ? 'Mobile (फोन)' : width < 1024 ? 'Tablet (टैबलेट)' : 'Laptop / Desktop (लैपटॉप)';

    const payload = {
      userId: visitorId,
      email,
      displayName,
      isLoggedIn: isLogged,
      userType: isLogged ? 'registered' : 'guest',
      targetExam,
      lastTopic: featureName,
      featureName,
      actionDetail: actionDetail || `देखा: ${featureName}`,
      device: deviceType
    };

    fetch('/api/user/ping', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(() => {});
  } catch (e) {
    // silent fallback
  }
}
