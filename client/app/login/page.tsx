'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Bus, User, Eye, EyeOff, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Role = 'passenger' | 'driver';
type Tab = 'signin' | 'signup';

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('signin');
  const [role, setRole] = useState<Role>('passenger');

  // Sign in fields
  const [siEmail, setSiEmail] = useState('');
  const [siPassword, setSiPassword] = useState('');
  const [siShowPw, setSiShowPw] = useState(false);

  // Sign up fields
  const [suName, setSuName] = useState('');
  const [suEmail, setSuEmail] = useState('');
  const [suPhone, setSuPhone] = useState('');
  const [suPassword, setSuPassword] = useState('');
  const [suConfirm, setSuConfirm] = useState('');
  const [suShowPw, setSuShowPw] = useState(false);
  const [suShowConfirm, setSuShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const saveSession = (email: string) => {
    localStorage.setItem('tm_role', role);
    localStorage.setItem('tm_user', JSON.stringify({ email, role }));
    router.push(role === 'driver' ? '/driver' : '/passenger');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!siEmail || !siPassword) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    saveSession(siEmail);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!suName || !suEmail || !suPassword || !suConfirm) { setError('Please fill in all required fields.'); return; }
    if (suPassword.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (suPassword !== suConfirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    saveSession(suEmail);
  };

  const RoleSelector = () => (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {(['passenger', 'driver'] as Role[]).map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => setRole(r)}
          className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl border-2 transition-all ${
            role === r
              ? 'border-accent bg-accent/10 text-accent'
              : 'border-border bg-card text-muted-foreground hover:border-accent/40'
          }`}
        >
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${role === r ? 'bg-accent/20' : 'bg-muted'}`}>
            {r === 'passenger' ? <User className="w-4 h-4 sm:w-5 sm:h-5" /> : <Bus className="w-4 h-4 sm:w-5 sm:h-5" />}
          </div>
          <div className="text-center">
            <p className="font-semibold text-xs sm:text-sm capitalize">{r}</p>
            <p className="text-[10px] sm:text-xs opacity-60 mt-0.5">{r === 'passenger' ? 'Track your bus' : 'Manage your route'}</p>
          </div>
        </button>
      ))}
    </div>
  );

  const PwToggle = ({ show, onToggle }: { show: boolean; onToggle: () => void }) => (
    <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <MapPin className="w-5 h-5 text-accent-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">Thadam</span>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">

          {/* Tab Toggle */}
          <div className="flex bg-muted rounded-xl p-1 mb-8">
            {(['signin', 'signup'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); setSuccess(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  tab === t
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* Heading */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-foreground">
              {tab === 'signin' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {tab === 'signin' ? 'Sign in to continue to Thadam' : 'Join Thadam to start tracking'}
            </p>
          </div>

          {/* Role Selector — shared */}
          <RoleSelector />

          {/* Error / Success */}
          {error && <p className="text-sm text-red-500 bg-red-500/10 px-3 py-2 rounded-lg mb-4">{error}</p>}
          {success && <p className="text-sm text-green-600 bg-green-500/10 px-3 py-2 rounded-lg mb-4">{success}</p>}

          {/* ── SIGN IN FORM ── */}
          {tab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input type="email" placeholder="you@example.com" value={siEmail} onChange={(e) => setSiEmail(e.target.value)} className="h-11" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Password</label>
                  <a href="#" className="text-xs text-accent hover:underline">Forgot password?</a>
                </div>
                <div className="relative">
                  <Input type={siShowPw ? 'text' : 'password'} placeholder="••••••••" value={siPassword} onChange={(e) => setSiPassword(e.target.value)} className="h-11 pr-10" />
                  <PwToggle show={siShowPw} onToggle={() => setSiShowPw(!siShowPw)} />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full h-11 bg-accent hover:bg-accent/90 font-semibold">
                {loading
                  ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />Signing in...</span>
                  : `Sign in as ${role === 'driver' ? 'Driver' : 'Passenger'}`}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                No account?{' '}
                <button type="button" onClick={() => setTab('signup')} className="text-accent hover:underline font-medium">
                  Create one
                </button>
              </p>
            </form>
          )}

          {/* ── SIGN UP FORM ── */}
          {tab === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">Full Name <span className="text-red-500">*</span></label>
                <Input placeholder="John Doe" value={suName} onChange={(e) => setSuName(e.target.value)} className="h-11" />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">Email <span className="text-red-500">*</span></label>
                <Input type="email" placeholder="you@example.com" value={suEmail} onChange={(e) => setSuEmail(e.target.value)} className="h-11" />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">
                  Phone <span className="text-muted-foreground text-xs font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="+1 234 567 8900" value={suPhone} onChange={(e) => setSuPhone(e.target.value)} className="h-11 pl-9" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Input type={suShowPw ? 'text' : 'password'} placeholder="Min. 8 characters" value={suPassword} onChange={(e) => setSuPassword(e.target.value)} className="h-11 pr-10" />
                  <PwToggle show={suShowPw} onToggle={() => setSuShowPw(!suShowPw)} />
                </div>
                {suPassword && (
                  <div className="flex gap-1 mt-1.5">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`flex-1 h-1 rounded-full transition-all ${
                        suPassword.length >= i * 3
                          ? suPassword.length >= 12 ? 'bg-green-500' : suPassword.length >= 8 ? 'bg-yellow-500' : 'bg-red-500'
                          : 'bg-muted'
                      }`} />
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">Confirm Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Input type={suShowConfirm ? 'text' : 'password'} placeholder="Re-enter password" value={suConfirm} onChange={(e) => setSuConfirm(e.target.value)} className="h-11 pr-10" />
                  <PwToggle show={suShowConfirm} onToggle={() => setSuShowConfirm(!suShowConfirm)} />
                </div>
                {suConfirm && suPassword !== suConfirm && (
                  <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                )}
                {suConfirm && suPassword === suConfirm && suConfirm.length > 0 && (
                  <p className="text-xs text-green-600 mt-1">✓ Passwords match</p>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                By creating an account you agree to our{' '}
                <a href="#" className="text-accent hover:underline">Terms of Service</a> and{' '}
                <a href="#" className="text-accent hover:underline">Privacy Policy</a>.
              </p>

              <Button type="submit" disabled={loading} className="w-full h-11 bg-accent hover:bg-accent/90 font-semibold">
                {loading
                  ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />Creating account...</span>
                  : `Create ${role === 'driver' ? 'Driver' : 'Passenger'} Account`}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <button type="button" onClick={() => setTab('signin')} className="text-accent hover:underline font-medium">
                  Sign in
                </button>
              </p>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
