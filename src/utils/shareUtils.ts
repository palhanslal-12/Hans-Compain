/**
 * HansAI / Hans Compain Sharing Engine
 * Generates clean, robust, and dynamic public URLs with one-click social share & deep-linking
 */

export interface ShareOptions {
  url?: string;
  tab?: string;
  title?: string;
  text?: string;
  summary?: string;
}

export const FALLBACK_APP_URL = "https://ais-pre-eja2hqh55k6pg6dfrk3z4m-1011428299500.asia-southeast1.run.app";

/**
 * Returns the best public shareable URL for the application
 */
export function getAppShareUrl(tab?: string): string {
  let baseOrigin = FALLBACK_APP_URL;

  if (typeof window !== "undefined") {
    try {
      const origin = window.location.origin;
      const href = window.location.href;

      if (origin && origin !== "null" && !origin.includes("about:") && !origin.startsWith("file://")) {
        // If inside an iframe on googleusercontent or localhost, keep it clean
        baseOrigin = origin;
      } else if (href && href.startsWith("http")) {
        baseOrigin = href.split("?")[0].split("#")[0];
      }
    } catch {
      baseOrigin = FALLBACK_APP_URL;
    }
  }

  // If a specific sub-feature or tab is requested, add it as a clean query parameter
  if (tab && tab !== "chat") {
    const separator = baseOrigin.includes("?") ? "&" : "?";
    return `${baseOrigin}${separator}tab=${encodeURIComponent(tab)}`;
  }

  return baseOrigin;
}

/**
 * Generates an engaging Hinglish promotional and educational share text
 */
export function getShareText(options: { tab?: string; quote?: { t: string; a: string }; featureName?: string } = {}): { title: string; text: string; fullMsg: string } {
  const url = getAppShareUrl(options.tab);
  const title = "Hans Compain - Expert AI Academic & Career Companion";

  let featureHighlight = "🧠 Live Quizzes, ✍️ Shorthand (Steno Master), 🔬 Virtual Science Lab, 📸 Photo Doubt Solver & Study Planner";
  if (options.featureName) {
    featureHighlight = `✨ Feature Highlight: *${options.featureName}*`;
  }

  let quoteText = "";
  if (options.quote) {
    quoteText = `\n\n💡 _"${options.quote.t}"_\n— *${options.quote.a}*`;
  }

  const text = `🎯 *HANS COMPAIN* — Expert AI Academic & Career Companion!\n\n${featureHighlight}\n\n👉 *Free में अपनी परीक्षा और स्टेनोग्राफी की तैयारी शुरू करें:*\n${url}${quoteText}\n\n🕊️ _HANS COMPAIN • AI Academic & Shorthand Ecosystem_`;

  return {
    title,
    text,
    fullMsg: text
  };
}

/**
 * Share directly on WhatsApp
 */
export function shareViaWhatsApp(options: ShareOptions = {}): void {
  const { fullMsg } = getShareText({ tab: options.tab, featureName: options.title });
  const shareMsg = options.text ? `${options.text}\n\n🔗 ${options.url || getAppShareUrl(options.tab)}` : fullMsg;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMsg)}`;
  window.open(whatsappUrl, "_blank");
}

/**
 * Share on Telegram
 */
export function shareViaTelegram(options: ShareOptions = {}): void {
  const url = options.url || getAppShareUrl(options.tab);
  const text = options.text || "Hans Compain • Expert AI Academic & Career Companion for SSC, Shorthand, Science & Competitive Exams!";
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
  window.open(telegramUrl, "_blank");
}

/**
 * Share on X (Twitter)
 */
export function shareViaTwitter(options: ShareOptions = {}): void {
  const url = options.url || getAppShareUrl(options.tab);
  const text = options.text || "Check out Hans Compain — Expert AI Academic & Career Companion for students with Live Quiz, Shorthand Studio & Virtual Science Lab!";
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  window.open(twitterUrl, "_blank");
}

/**
 * Share on Facebook
 */
export function shareViaFacebook(options: ShareOptions = {}): void {
  const url = options.url || getAppShareUrl(options.tab);
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  window.open(facebookUrl, "_blank");
}

/**
 * Share on LinkedIn
 */
export function shareViaLinkedIn(options: ShareOptions = {}): void {
  const url = options.url || getAppShareUrl(options.tab);
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  window.open(linkedinUrl, "_blank");
}

/**
 * Share via Email
 */
export function shareViaEmail(options: ShareOptions = {}): void {
  const url = options.url || getAppShareUrl(options.tab);
  const subject = encodeURIComponent(options.title || "Hans Compain - AI Academic & Career Companion");
  const body = encodeURIComponent(`Hi,\n\nI want to share this incredible AI study and exam preparation companion with you:\n\nHans Compain (HansAI) features Live Quizzes, Hindi/English Shorthand dictations, a Virtual Science Lab, and instant Photo Doubt Solving.\n\nCheck it out here:\n${url}\n\nBest regards!`);
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

/**
 * Universal Mobile Native Share / Web Share API with Clipboard Fallback
 */
export async function shareUniversal(options: ShareOptions = {}, onToast?: (msg: string, type: 'info' | 'success' | 'warn') => void): Promise<boolean> {
  const targetUrl = options.url || getAppShareUrl(options.tab);
  const { title, fullMsg } = getShareText({ tab: options.tab, featureName: options.title });

  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({
        title: options.title || title,
        text: options.text || fullMsg,
        url: targetUrl
      });
      if (onToast) onToast("Shared successfully! 🎉", "success");
      return true;
    } catch (err: any) {
      // User cancelled or unsupported
      if (err.name !== "AbortError") {
        return copyToClipboard(targetUrl, onToast);
      }
      return false;
    }
  } else {
    return copyToClipboard(targetUrl, onToast);
  }
}

/**
 * Copy string to Clipboard with notification
 */
export async function copyToClipboard(text: string, onToast?: (msg: string, type: 'info' | 'success' | 'warn') => void): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      if (onToast) onToast("📋 Link copied to clipboard!", "success");
      return true;
    } else {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      if (onToast) onToast("📋 Link copied to clipboard!", "success");
      return true;
    }
  } catch (e) {
    if (onToast) onToast("Could not copy link automatically", "warn");
    return false;
  }
}
