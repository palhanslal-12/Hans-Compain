import { auth } from '../firebase';

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
    const user = auth.currentUser;
    const isLogged = !!user;
    const visitorId = isLogged ? user.uid : getVisitorId();
    const displayName = user?.displayName || (isLogged ? 'पंजीकृत छात्र' : `अतिथि (#${visitorId.slice(-4)})`);
    const email = user?.email || (isLogged ? 'student@hanscompain.in' : 'बिना लॉगिन (Guest)');
    const targetExam = localStorage.getItem('hans_target_exam') || 'SSC & Steno 2026';

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
      device: typeof navigator !== 'undefined' ? (navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop/Tablet') : 'Web'
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
