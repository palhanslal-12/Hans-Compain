import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, ShieldAlert, Sparkles, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Hans Compain ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleResetApp = () => {
    try {
      localStorage.removeItem('hans_test_history');
      localStorage.removeItem('hans_chat_history');
      localStorage.removeItem('hans_compain_mistake_notebook');
      localStorage.removeItem('hans_seen_question_ids');
    } catch {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#03060E] text-white font-sans flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#0A1020] border-2 border-rose-500/40 rounded-3xl p-6 shadow-2xl space-y-5 text-center">
            <div className="w-16 h-16 rounded-3xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto shadow-lg">
              <ShieldAlert className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-black font-hindi-title text-white">
                हंस कैंपेन ऐप लोडिंग रीस्टार्ट (App Recovery)
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed">
                ब्राउज़र कैश या किसी अस्थायी त्रुटि के कारण स्क्रीन लोड नहीं हो सकी। नीचे दिए गए बटन से ऐप को सुरक्षित रीस्टार्ट करें।
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-rose-300 text-left max-h-28 overflow-y-auto">
                {this.state.error.message || 'Unknown render error occurred.'}
              </div>
            )}

            <div className="space-y-2 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs tracking-wide shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>पुनः लोड करें (RELOAD APP)</span>
              </button>

              <button
                onClick={this.handleResetApp}
                className="w-full py-3 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>कैश साफ़ कर पुनः प्रारंभ करें (RESET CACHE & RELOAD)</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
