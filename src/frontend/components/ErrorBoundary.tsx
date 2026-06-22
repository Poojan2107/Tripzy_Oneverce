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
          <h1 className="text-xl font-bold uppercase tracking-wider mb-2">Something went wrong</h1>
          <p className="text-xs text-muted mb-6">Please refresh the page to try again.</p>
          <button
            onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
            className="px-5 py-2.5 bg-gold text-night font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-gold-light transition-all"
          >
            Refresh
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}