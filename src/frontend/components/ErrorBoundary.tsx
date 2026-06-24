"use client";
import { Component, ReactNode } from 'react';
import { Compass } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: () => void;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("ErrorBoundary caught:", error);
    this.props.onError?.();
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="w-full min-h-[100dvh] bg-background text-ink flex flex-col items-center justify-center p-6">
          <Compass className="w-12 h-12 text-gold mb-4" />
          <h1 className="font-display text-2xl font-light text-night lowercase mb-2">journey interrupted</h1>
          <p className="text-xs text-muted leading-relaxed max-w-xs text-center mb-6">
            We're consulting our explorer archive and preparing an alternative journey.
          </p>
          <button
            onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
            className="px-5 py-2.5 bg-gold text-night font-bold text-[10px] uppercase tracking-wider rounded-xl hover:bg-gold/90 transition-all cursor-pointer min-h-[40px] border-none"
          >
            Retry Action
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}