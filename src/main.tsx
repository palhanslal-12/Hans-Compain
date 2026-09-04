import React, { StrictMode, Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  declare props: ErrorBoundaryProps;
  declare state: ErrorBoundaryState;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught React Error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#04070F] text-slate-100 flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full bg-[#090E1A] border border-amber-500/40 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-600 mx-auto flex items-center justify-center text-2xl shadow-lg shadow-amber-500/20">
              ⚠️
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-extrabold text-white">HansAI - App Refresh Needed</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                ऐप में अस्थायी डेटा लोड समस्या आई है। रिफ्रेश बटन दबाकर फिर से शुरू करें।
              </p>
            </div>
            <div className="flex flex-col gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  window.location.reload();
                }}
                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold rounded-xl text-xs transition-all shadow-lg cursor-pointer border-none"
              >
                🔄 Reload App / ऐप रिफ्रेश करें
              </button>
              <button
                type="button"
                onClick={() => {
                  try {
                    const keys = [
                      'hansai-saved-chats',
                      'hansai-chat-messages',
                      'hansai-mistake-notebook',
                      'hansai-saved-quizzes',
                      'hansai-active-quiz-draft',
                      'hansai-syllabus-trackers',
                      'hansai_usage',
                      'hanscompain_intro_seen'
                    ];
                    keys.forEach((k) => localStorage.getItem(k) && localStorage.removeItem(k));
                  } catch {}
                  window.location.reload();
                }}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold rounded-xl text-xs transition-all border border-amber-500/30 cursor-pointer"
              >
                🧹 Reset Corrupt Cache & Reload / कैश साफ़ कर रीलोड करें
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Absolute Purge & Intercept for Benign WebSocket/Vite console exception logs
if (typeof window !== 'undefined') {
  const originalError = console.error;
  const originalWarn = console.warn;
  
  console.error = (...args: any[]) => {
    const errorStr = args.map(arg => String(arg)).join(' ');
    if (
      errorStr.toLowerCase().includes('websocket') ||
      errorStr.toLowerCase().includes('vite') ||
      errorStr.toLowerCase().includes('hmr') ||
      errorStr.toLowerCase().includes('failed to connect')
    ) {
      return;
    }
    originalError.apply(console, args);
  };

  console.warn = (...args: any[]) => {
    const warnStr = args.map(arg => String(arg)).join(' ');
    if (
      warnStr.toLowerCase().includes('websocket') ||
      warnStr.toLowerCase().includes('vite') ||
      warnStr.toLowerCase().includes('hmr') ||
      warnStr.toLowerCase().includes('failed to connect')
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };

  window.addEventListener('error', (event) => {
    const msg = event?.message || '';
    if (
      msg.toLowerCase().includes('websocket') ||
      msg.toLowerCase().includes('vite') ||
      msg.toLowerCase().includes('hmr')
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event?.reason ? String(event.reason) : '';
    if (
      reason.toLowerCase().includes('websocket') ||
      reason.toLowerCase().includes('vite') ||
      reason.toLowerCase().includes('hmr')
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

