"use client";
import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Shield, ShieldCheck, LogIn, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminSetupPage() {
  const { data: session, status } = useSession();
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleSetupAdmin = async () => {
    setLoading(true);
    setStatusMsg({ type: '', text: '' });
    try {
      const res = await fetch('/api/admin');
      const data = await res.json();
      if (res.ok) {
        setStatusMsg({ type: 'success', text: data.message });
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Something went wrong.' });
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Network error. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-sand flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl border border-warm-gray shadow-sm p-8 text-center space-y-6">
        
        <div className="w-16 h-16 rounded-full bg-night flex items-center justify-center mx-auto">
          <Shield className="w-8 h-8 text-gold" />
        </div>

        <div>
          <h1 className="font-display text-3xl font-light text-night lowercase">admin setup</h1>
          <p className="text-xs text-muted/60 mt-2 font-light leading-relaxed">
            Grant yourself admin access to manage destinations, tours, and experiences.
          </p>
        </div>

        {status === 'loading' ? (
          <div className="py-8">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted/40 animate-pulse">checking session...</span>
          </div>
        ) : !session ? (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-left">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-800 font-light leading-relaxed">
                You need to sign in with Google first before you can set up admin access.
              </p>
            </div>
            <button
              onClick={() => signIn('google')}
              className="w-full py-3.5 rounded-xl bg-night text-white text-[10px] font-bold uppercase tracking-wider hover:bg-saffron transition-all cursor-pointer inline-flex items-center justify-center gap-2 min-h-[44px]"
            >
              <LogIn className="w-4 h-4" />
              Sign in with Google
            </button>
          </div>
        ) : statusMsg.type === 'success' ? (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
              <p className="text-sm font-bold text-emerald-800">{statusMsg.text}</p>
              <p className="text-[10px] text-emerald-600 mt-1 font-light">
                Signed in as {session.user?.email}
              </p>
            </div>
            <a
              href="/admin"
              className="w-full py-3.5 rounded-xl bg-gold text-white text-[10px] font-bold uppercase tracking-wider hover:bg-gold/80 transition-all cursor-pointer inline-flex items-center justify-center gap-2 min-h-[44px]"
            >
              Go to Admin Dashboard
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-sand border border-warm-gray rounded-2xl p-4 text-left">
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted/50 mb-1">signed in as</p>
              <p className="text-sm font-bold text-night">{session.user?.email}</p>
            </div>

            {statusMsg.type === 'error' && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 text-left">
                <p className="text-[11px] text-rose-700 font-light">{statusMsg.text}</p>
              </div>
            )}

            <button
              onClick={handleSetupAdmin}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-night text-white text-[10px] font-bold uppercase tracking-wider hover:bg-saffron transition-all cursor-pointer disabled:opacity-50 inline-flex items-center justify-center gap-2 min-h-[44px]"
            >
              <ShieldCheck className="w-4 h-4" />
              {loading ? 'Setting up...' : 'Grant Admin Access'}
            </button>

            <p className="text-[8px] text-muted/40 font-mono uppercase tracking-widest">
              Only the first-time setup is needed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
