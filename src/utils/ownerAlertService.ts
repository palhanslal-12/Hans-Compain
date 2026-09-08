// 🚨 OWNER PHONE & EMAIL ALERT SERVICE
// Owner: Hanslal Pal (palhanslal4@gmail.com)

export interface OwnerAlertItem {
  id: string;
  type: 'problem' | 'update' | 'security' | 'test_quiz';
  title: string;
  message: string;
  timestamp: string;
  severity: 'critical' | 'high' | 'medium' | 'info';
  source?: string;
  userEmail?: string;
  deviceInfo?: string;
  emailDispatched?: boolean;
}

// Play an instant attention chime via Web Audio API (safe, offline, no external file needed)
export function playOwnerAlertChime(isCritical: boolean = false) {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = isCritical ? 'sawtooth' : 'sine';
    const now = ctx.currentTime;

    if (isCritical) {
      // Urgent siren-like two tone beep
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(440, now + 0.15);
      osc.frequency.setValueAtTime(880, now + 0.3);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    } else {
      // Pleasant double notification chime
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.12); // A5
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    }
  } catch (e) {
    // AudioContext may be restricted before user gesture
  }
}

// Vibrate user phone if supported
export function vibratePhoneForAlert(pattern: number[] = [200, 100, 200, 100, 300]) {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  } catch (e) {
    // Vibrate not available or permission denied
  }
}

// Trigger system browser notification on phone / desktop
export function showSystemPhoneNotification(title: string, body: string) {
  try {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(`🚨 HansAI Alert: ${title}`, {
        body,
        icon: '/favicon.ico',
        tag: 'hansai-owner-alert'
      });
    }
  } catch (e) {
    // Suppressed
  }
}

// Main dispatcher to alert owner (Phone & Email to palhanslal4@gmail.com)
export async function dispatchOwnerAlert(
  type: 'problem' | 'update' | 'security' | 'test_quiz',
  title: string,
  message: string,
  severity: 'critical' | 'high' | 'medium' | 'info' = 'high',
  meta?: any
) {
  const isCritical = severity === 'critical' || type === 'problem';

  // 1. Phone Vibration
  vibratePhoneForAlert(isCritical ? [300, 100, 300, 100, 500] : [150, 80, 150]);

  // 2. Audio Chime
  playOwnerAlertChime(isCritical);

  // 3. Browser / Phone Push Notification
  showSystemPhoneNotification(title, message);

  // 4. Send to Server to register alert & trigger email dispatch to palhanslal4@gmail.com
  try {
    const payload = {
      type,
      title,
      message,
      severity,
      source: navigator?.userAgent ? (navigator.userAgent.includes('Mobile') ? 'Mobile Phone App' : 'Web App') : 'Web',
      userEmail: 'palhanslal4@gmail.com',
      details: meta || {}
    };

    await fetch('/api/owner/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    // Also dispatch email alert route
    await fetch('/api/owner/dispatch-email-alert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        message,
        type,
        details: meta || {}
      })
    });
  } catch (err) {
    console.error('Failed to report alert to server:', err);
  }
}

// Fetch unread owner alerts
export async function getOwnerAlertsFromServer(): Promise<{ alerts: OwnerAlertItem[]; problemCount: number }> {
  try {
    const res = await fetch('/api/owner/alerts');
    if (res.ok) {
      const data = await res.json();
      return { alerts: data.alerts || [], problemCount: data.problemCount || 0 };
    }
  } catch (e) {
    // Ignore fetch error
  }
  return { alerts: [], problemCount: 0 };
}
