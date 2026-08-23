import React, { useState } from 'react';
import { Star, MessageSquare, Sparkles, X, CheckCircle2, Heart, Send, LogIn, ThumbsUp, UserCheck } from 'lucide-react';
import { addReviewToFirestore } from '../lib/firebase';

interface FiveStarFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'hindi' | 'english';
  user?: { name?: string; email?: string } | null;
  onOpenLogin?: () => void;
  initialContext?: string;
  onFeedbackSubmitted?: (feedbackData: any) => void;
  showToast?: (msg: string, type?: 'success' | 'warn' | 'info' | 'error') => void;
}

export const FiveStarFeedbackModal: React.FC<FiveStarFeedbackModalProps> = ({
  isOpen,
  onClose,
  language = 'hindi',
  user,
  onOpenLogin,
  initialContext = 'HansAI Companion App',
  onFeedbackSubmitted,
  showToast = () => {}
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('⚡ Fast Response');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const quickTags = [
    '⚡ Fast Response',
    '🎙️ Clear Voice',
    '🎯 Accurate Content',
    '📱 Clean UI',
    '💡 Great Suggestions',
    '📚 Helpful Quiz'
  ];

  const ratingDescriptions: Record<number, { text: string; emoji: string; color: string }> = {
    1: { text: 'Needs Improvement', emoji: '😞', color: 'text-rose-400' },
    2: { text: 'Fair', emoji: '😐', color: 'text-amber-400' },
    3: { text: 'Good', emoji: '🙂', color: 'text-yellow-400' },
    4: { text: 'Very Good', emoji: '😊', color: 'text-emerald-400' },
    5: { text: 'Outstanding 5-Star!', emoji: '🌟', color: 'text-amber-300' }
  };

  const currentStarVal = hoverRating || rating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If user is not logged in, prompt them to login
    if (!user) {
      if (onOpenLogin) {
        onClose();
        onOpenLogin();
        showToast(
          language === 'hindi' 
            ? 'फीडबैक व रेटिंग सबमिट करने के लिए कृपया पहले लॉगिन करें।' 
            : 'Please login to submit your feedback & rating.',
          'info'
        );
        return;
      }
    }

    setIsSubmitting(true);

    const feedbackPayload = {
      id: `review_${Date.now()}`,
      userName: user?.name || 'Aspirant Student',
      userEmail: user?.email || 'student@hansai.app',
      rating,
      comment: comment.trim() || (rating === 5 ? 'शानदार और उपयोगी अनुभव!' : 'Good experience.'),
      suggestions: '',
      context: initialContext,
      tag: selectedTag,
      timestamp: new Date().toISOString(),
      dateStr: new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    try {
      // 1. Save to local storage for instant feedback persistence
      const existingReviewsStr = localStorage.getItem('hansai-user-reviews');
      const existing = existingReviewsStr ? JSON.parse(existingReviewsStr) : [];
      const updated = [feedbackPayload, ...existing];
      localStorage.setItem('hansai-user-reviews', JSON.stringify(updated));

      // 2. Submit to Firestore if available
      try {
        await addReviewToFirestore({
          stars: feedbackPayload.rating,
          userName: feedbackPayload.userName,
          userEmail: feedbackPayload.userEmail,
          comment: feedbackPayload.comment,
          suggestion: '',
          featureContext: feedbackPayload.context,
          tag: feedbackPayload.tag
        });
      } catch (err) {
        console.warn("Firestore feedback sync notice:", err);
      }

      // 3. Post to server endpoint
      try {
        await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(feedbackPayload)
        });
      } catch (e) {}

      setIsSubmitting(false);
      setIsSuccess(true);
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted(feedbackPayload);
      }

      showToast(
        language === 'hindi' ? "⭐ आपका बहुमूल्य फीडबैक दर्ज हो गया!" : "⭐ Feedback submitted successfully!",
        "success"
      );

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1400);
    } catch (error: any) {
      setIsSubmitting(false);
      showToast("Feedback saved! Thank you.", "success");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm bg-[#0B1120] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Compact Header Ribbon */}
        <div className="px-4 py-3 bg-gradient-to-r from-amber-600/20 via-slate-900 to-indigo-950/40 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-sm flex items-center gap-1.5">
                {language === 'hindi' ? 'रेटिंग व फीडबैक' : 'Rate & Feedback'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-6 text-center space-y-3 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 animate-bounce">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-white">बहुत-बहुत धन्यवाद! 🙏</h4>
            <p className="text-xs text-slate-300">
              आपका {rating}-Star ({rating}/5 ★) फीडबैक दर्ज हो गया है।
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 space-y-3 text-slate-200 text-xs">
            
            {/* User Logged-in badge or Login prompt */}
            {user ? (
              <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300">
                <div className="flex items-center gap-1.5 truncate">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="font-semibold text-slate-200 truncate">{user.name || user.email}</span>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono">
                  Verified
                </span>
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-[11px]">
                <span className="text-amber-200 font-medium">लॉगिन नहीं हैं? (Not logged in)</span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenLogin) onOpenLogin();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <LogIn className="w-3 h-3" />
                  लॉगिन करें
                </button>
              </div>
            )}

            {/* Interactive Stars Rating - Main Focus */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 text-center space-y-1.5">
              <div className="flex items-center justify-center gap-1.5 py-0.5">
                {[1, 2, 3, 4, 5].map((starVal) => (
                  <button
                    key={starVal}
                    type="button"
                    onClick={() => setRating(starVal)}
                    onMouseEnter={() => setHoverRating(starVal)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 hover:scale-125 transition-transform focus:outline-none cursor-pointer"
                  >
                    <Star
                      className={`w-7 h-7 transition-colors ${
                        starVal <= currentStarVal
                          ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                          : 'text-slate-700 hover:text-slate-500'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <div className={`text-xs font-bold transition-all ${ratingDescriptions[currentStarVal]?.color || 'text-amber-300'}`}>
                {ratingDescriptions[currentStarVal]?.emoji} {ratingDescriptions[currentStarVal]?.text}
              </div>
            </div>

            {/* Quick Tag Pills */}
            <div className="flex flex-wrap gap-1.5 justify-center">
              {quickTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`text-[10px] px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                    selectedTag === tag
                      ? 'bg-amber-500/20 border-amber-500 text-amber-200 font-bold'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Optional Comment Input */}
            <div className="space-y-1">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={language === 'hindi' ? "वैकल्पिक टिप्पणी या सुझाव लिखें..." : "Optional comment or suggestion..."}
                className="w-full bg-[#050814] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-1 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                बंद करें
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3 h-3 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    सहेजा जा रहा...
                  </>
                ) : (
                  <>
                    <Send className="w-3 h-3" />
                    सबमिट करें
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
