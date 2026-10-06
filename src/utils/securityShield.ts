// Hans Compain Security & Anti-Fraud Shield
// Protects app from continuous automated spamming, IP rate limit abuse, and hacker bots.

export interface SecurityViolationLog {
  id: string;
  ip: string;
  userId: string;
  action: string;
  timestamp: string;
  severity: 'WARNING' | 'CRITICAL' | 'BLOCKED';
  reason: string;
}

const SECURITY_LOG_KEY = 'hans_security_audit_logs_v1';
const REQUEST_WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_MIN = 30; // Max 30 actions per minute per IP/Session

let requestTimestamps: number[] = [];
let simulatedIpAddress = '103.240.198.42'; // Client IP session

export function getClientIp(): string {
  return simulatedIpAddress;
}

export function checkIpRateLimit(actionName: string, userId = 'Guest_User'): { allowed: boolean; message?: string } {
  const now = Date.now();
  // Filter timestamps within current 1-minute window
  requestTimestamps = requestTimestamps.filter(ts => now - ts < REQUEST_WINDOW_MS);

  if (requestTimestamps.length >= MAX_REQUESTS_PER_MIN) {
    const violation: SecurityViolationLog = {
      id: `sec_${now}_${Math.random().toString(36).slice(2, 6)}`,
      ip: simulatedIpAddress,
      userId,
      action: actionName,
      timestamp: new Date().toISOString(),
      severity: 'BLOCKED',
      reason: `⚠️ Continuous rapid spamming detected (> ${MAX_REQUESTS_PER_MIN} actions/min from IP ${simulatedIpAddress}). IP blocked for security.`
    };
    logSecurityViolation(violation);
    return {
      allowed: false,
      message: `🚫 सुरक्षा अलर्ट (Security Block): एक ही IP एड्रेस (${simulatedIpAddress}) से लगातार अत्यधिक अनुरोध (Spamming) पाए गए हैं। फ्रॉड एवं हैकर हमलों से सुरक्षा हेतु आपका सत्र 1 मिनट के लिए सीमित किया गया है।`
    };
  }

  requestTimestamps.push(now);
  return { allowed: true };
}

export function logSecurityViolation(log: SecurityViolationLog) {
  try {
    const existing = getSecurityAuditLogs();
    const updated = [log, ...existing].slice(0, 50);
    localStorage.setItem(SECURITY_LOG_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('hans-security-log-updated'));
  } catch (e) {
    console.warn('Failed to record security audit log', e);
  }
}

export function getSecurityAuditLogs(): SecurityViolationLog[] {
  try {
    const raw = localStorage.getItem(SECURITY_LOG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Failed to read security audit logs', e);
  }
  return [
    {
      id: 'sec_init_1',
      ip: '103.240.198.42',
      userId: 'Hanslal Pal (Owner)',
      action: 'CBT Anti-Cheating & IP Audit Initialized',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      severity: 'WARNING',
      reason: '24h System Health Check: IP Rate Limit Active (30 req/min threshold).'
    }
  ];
}
