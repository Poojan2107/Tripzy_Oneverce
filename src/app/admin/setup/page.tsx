"use client";
import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Shield, ShieldCheck, LogIn, ArrowRight, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';

const ADMIN_SETUP_KEY = '8bae487b-637a-40ad-bd88-93d2e45e3f5b';

export default function AdminSetupPage() {
  const { data: session, status } = useSession();
  const [setupKey, setSetupKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [alreadyAdmin, setAlreadyAdmin] = useState(false);

  // Check current admin status on mount
  useEffect(() => {
    if (session) {
      fetch('/api/admin')
        .then(r => r.json())
        .then(data => {
          if (data.isAdmin) setAlreadyAdmin(true);
        })
        .catch(() => {});
    }
  }, [session]);

  const handleSetupAdmin = async () => {
    if (!setupKey.trim()) {
      setStatusMsg({ type: 'error', text: 'Enter the admin setup key.' });
      return;
    }
    setLoading(true);
    setStatusMsg({ type: '', text: '' });
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: session?.user?.email, setupKey: setupKey.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMsg({ type: 'success', text: data.message || 'Admin access granted!' });
        setAlreadyAdmin(true);
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
    <div className="min-h-[100dvh] bg-background flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl border border-border shadow-sm p-8 text-center space-y-6">
        
        <div className="w-16 h-16 rounded-full bg-night flex items-center justify-center mx-auto">
          {alreadyAdmin ? <ShieldCheck className="w-8 h-8 text-emerald-400" /> : <Shield className="w-8 h-8 text-gold" />}
        </div>

        <div>
          <h1 className="font-display text-3xl font-light text-night lowercase">admin setup</h1>
          <p className="text-xs text-muted/60 mt-2 font-light leading-relaxed">
            {alreadyAdmin
              ? 'You already have admin access.'
              : 'Enter the setup key to grant yourself admin access.'}
          </p>
        </div>

        {status === 'loading' ? (
          <div className="py-8">
            <span className="text-micro font-mono uppercase tracking-widest text-muted/40 animate-pulse">checking session...</span>
          </div>
        ) : !session ? (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-left">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-small text-amber-800 font-light leading-relaxed">
                Sign in with Google first, then enter the setup key.
              </p>
            </div>
            <button
              onClick={() => signIn('google', { callbackUrl: window.location.href })}
              className="btn-night w-full py-3.5 text-micro font-bold uppercase tracking-wider hover:bg-coral transition-all cursor-pointer inline-flex items-center justify-center gap-2 min-h-[44px]"
            >
              <LogIn className="w-4 h-4" />
              Sign in with Google
            </button>
          </div>
        ) : alreadyAdmin ? (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
              <p className="text-sm font-bold text-emerald-800">Admin access active</p>
              <p className="text-micro text-emerald-600 mt-1 font-light">
                {session.user?.email}
              </p>
            </div>
            <a
              href="/admin"
              className="w-full py-3.5 rounded-xl bg-gold text-white text-micro font-bold uppercase tracking-wider hover:bg-gold/80 transition-all cursor-pointer inline-flex items-center justify-center gap-2 min-h-[44px]"
            >
              Go to Admin Dashboard
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-background border border-border rounded-2xl p-4 text-left">
              <p className="text-micro font-mono uppercase tracking-widest text-muted/50 mb-1">signed in as</p>
              <p className="text-sm font-bold text-night">{session.user?.email}</p>
            </div>

            {statusMsg.type === 'error' && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 text-left">
                <p className="text-small text-rose-700 font-light">{statusMsg.text}</p>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-background border border-border focus-within:border-gold transition-colors">
                <KeyRound className="w-4 h-4 text-muted/40 shrink-0" />
                <input
                  type="text"
                  placeholder="Enter admin setup key"
                  value={setupKey}
                  onChange={e => setSetupKey(e.target.value)}
                  className="bg-transparent text-base text-night placeholder:text-muted/30 outline-none w-full font-sans font-light"
                  autoComplete="off"
                />
              </div>
              <button
                onClick={handleSetupAdmin}
                disabled={loading}
              className="btn-night w-full py-3.5 text-micro font-bold uppercase tracking-wider hover:bg-coral transition-all cursor-pointer disabled:opacity-50 inline-flex items-center justify-center gap-2 min-h-[44px]"
            >
              <ShieldCheck className="w-4 h-4" />
              {loading ? 'Setting up...' : 'Grant Admin Access'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
