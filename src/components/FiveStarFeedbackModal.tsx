import React, { useState } from 'react';
import { Star, MessageSquare, Sparkles, X, CheckCircle2, Heart, Send, ThumbsUp, Zap, HelpCircle } from 'lucide-react';
import { addReviewToFirestore } from '../lib/firebase';

interface FiveStarFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'hindi' | 'english';
  user?: { name?: string; email?: string } | null;
  initialContext?: string; // e.g. "Chat Response", "Interactive Quiz", "Voice Reading", "General"
  onFeedbackSubmitted?: (feedbackData: any) => void;
  showToast?: (msg: string, type?: 'success' | 'warn' | 'info' | 'error') => void;
}

export const FiveStarFeedbackModal: React.FC<FiveStarFeedbackModalProps> = ({
  isOpen,
  onClose,
  language = 'hindi',
  user,
  initialContext = 'HansAI Companion App',
  onFeedbackSubmitted,
  showToast = () => {}
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string>('');
  const [name, setName] = useState<string>(user?.name || '');
  const [email, setEmail] = useState<string>(user?.email || '');
  const [selectedTag, setSelectedTag] = useState<string>('Overall Experience');
  const [aspectRatings, setAspectRatings] = useState<{
    speed: number;
    voice: number;
    accuracy: number;
    ui: number;
  }>({
    speed: 5,
    voice: 5,
    accuracy: 5,
    ui: 5
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const quickTags = [
    '⚡ Super Speed',
    '🎙️ Clear Voice',
    '🎯 Accurate Content',
    '📱 Clean UI',
    '💡 Great Suggestions',
    '📚 Helpful Quiz'
  ];

  const ratingDescriptions: Record<number, { text: string; emoji: string; color: string }> = {
    1: { text: 'सुधार की आवश्यकता (Needs Improvement)', emoji: '😞', color: 'text-rose-400' },
    2: { text: 'ठीक-ठाक (Fair)', emoji: '😐', color: 'text-amber-400' },
    3: { text: 'अच्छा (Good)', emoji: '🙂', color: 'text-yellow-400' },
    4: { text: 'बहुत बढ़िया (Very Good)', emoji: '😊', color: 'text-emerald-400' },
    5: { text: 'उत्कृष्ट एवं शानदार! (Outstanding 5-Star)', emoji: '🌟', color: 'text-amber-300' }
  };

  const currentStarVal = hoverRating || rating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() && !suggestions.trim() && rating < 4) {
      showToast("कृपया 1-2 पंक्तियों में अपना अनुभव या सुझाव लिखें 🙏", "warn");
      return;
    }

    setIsSubmitting(true);

    const feedbackPayload = {
      id: `review_${Date.now()}`,
      userName: name.trim() || user?.name || 'Aspirant Student',
      userEmail: email.trim() || user?.email || 'student@hansai.app',
      rating,
      comment: comment.trim() || (rating === 5 ? 'शानदार और उपयोगी अनुभव! HansAI Companion बहुत मददगार है।' : 'Good experience.'),
      suggestions: suggestions.trim(),
      context: initialContext,
      aspectRatings,
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
          suggestion: feedbackPayload.suggestions,
          featureContext: feedbackPayload.context,
          tag: feedbackPayload.tag,
          aspects: aspectRatings
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

      showToast("फीडबैक और बहुमूल्य सुझाव सहेज लिया गया! धन्यवाद ⭐", "success");

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1600);
    } catch (error: any) {
      setIsSubmitting(false);
      showToast("Feedback saved locally! Thank you for supporting HansAI.", "success");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#090D1A] border border-amber-500/30 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Ribbon */}
        <div className="px-5 py-4 bg-gradient-to-r from-amber-600/20 via-indigo-950/80 to-cyan-950/40 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base sm:text-lg flex items-center gap-1.5">
                फीडबैक व सुझाव
                <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                  {rating} ★ Rating
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                {initialContext} • HansAI Companion Feedback
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-white">बहुत-बहुत धन्यवाद! 🙏</h4>
            <p className="text-sm text-slate-300 max-w-xs">
              आपका {rating}-Star ({rating}/5 ★) फीडबैक और सुझाव सुरक्षित हो गया है। HansAI Companion को बेहतर बनाने में आपकी राय अमूल्य है!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-slate-200 text-sm">
            {/* Primary 5-Star Interactive Rating */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-center space-y-2">
              <span className="text-xs font-semibold text-slate-400 block">
                HansAI आपको कैसा लगा? (Tap Stars to Rate)
              </span>
              
              <div className="flex items-center justify-center gap-2 py-1">
                {[1, 2, 3, 4, 5].map((starVal) => (
                  <button
                    key={starVal}
                    type="button"
                    onClick={() => setRating(starVal)}
                    onMouseEnter={() => setHoverRating(starVal)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 hover:scale-125 transition-transform focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        starVal <= currentStarVal
                          ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                          : 'text-slate-600 hover:text-slate-500'
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
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 block">
                त्वरित टैग (Quick Tag):
              </label>
              <div className="flex flex-wrap gap-1.5">
                {quickTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTag(tag)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                      selectedTag === tag
                        ? 'bg-amber-500/20 border-amber-500 text-amber-200 font-bold'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Area */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                कैसा लगा? अपना अनुभव लिखें (Your Feedback / Comment):
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
                placeholder="उदा. AI की स्पीड और वॉयस बहुत बढ़िया लगी, प्रश्नों की व्याख्या बहुत आसान है..."
                className="w-full bg-[#040814] border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
              />
            </div>

            {/* Additional Suggestions Input */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                आप कुछ और सुझाव दे सकते हैं? (Any Suggestions or New Features?):
              </label>
              <textarea
                value={suggestions}
                onChange={(e) => setSuggestions(e.target.value)}
                rows={2}
                placeholder="उदा. और अधिक स्टेट परीक्षा के पेपर्स जोड़ें, हिंदी और तमिल में ऑडियो स्पीड तेज रखें..."
                className="w-full bg-[#040814] border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
              />
            </div>

            {/* User Name & Email info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 block mb-0.5">आपका नाम (Name):</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Aspirant / Student Name"
                  className="w-full bg-[#040814] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-slate-700"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-0.5">ईमेल (Email):</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full bg-[#040814] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-slate-700"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                रद्द करें
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    सहेजा जा रहा है...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    फीडबैक सबमिट करें
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
