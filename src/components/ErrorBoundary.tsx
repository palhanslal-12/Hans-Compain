import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { RotateCcw, ArrowLeft } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("HansAI Component Crash Caught:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="bg-[#0f172a] border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-2xl shadow-lg">
              ⚠️
            </div>
            
            <div>
              <h3 className="text-lg font-black text-white">
                {this.props.fallbackTitle || 'फीचर लोड करने में समस्या आई / Feature Recovery'}
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                यह फीचर सुरक्षित रूप से रीसेट कर दिया गया है। बिना ऐप बंद किए तुरंत दोबारा शुरू करने के लिए नीचे बटन दबाएं।
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-550 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg cursor-pointer border-none active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>पुनः शुरू करें (Restart View)</span>
              </button>

              {this.props.onReset && (
                <button
                  type="button"
                  onClick={this.props.onReset}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-slate-700"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>मुख्य चैट (Back to Chat)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
