import { useState, type FormEvent } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useApp } from '../context';
import type { Role } from '../types';

const demoRoles: { label: string; role: Exclude<Role, null> }[] = [
  { label: 'Seller industry', role: 'seller' },
  { label: 'Buyer industry', role: 'buyer' },
  { label: 'Admin', role: 'admin' },
];

export default function Login() {
  const { navigate, authenticate, authenticateGoogle } = useApp();
  const [selectedRole, setSelectedRole] = useState<Exclude<Role, null>>('buyer');
  const [googleError, setGoogleError] = useState('');
  const roleLabel = selectedRole === 'seller' ? 'Seller' : selectedRole === 'admin' ? 'Admin' : 'Buyer';
  const googleClientConfigured = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  function handleLogin(event: FormEvent) {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    void authenticate(selectedRole, String(data.get('email') || ''), String(data.get('password') || ''));
  }

  async function handleGoogleSuccess(credential?: string) {
    if (!credential || selectedRole === 'admin') return;
    setGoogleError('');
    try {
      await authenticateGoogle(credential, selectedRole);
    } catch (error) {
      setGoogleError(error instanceof Error ? error.message : 'Google sign-in failed. Please try again.');
    }
  }

  return <div className="min-h-screen bg-[#F4F7F2] flex">
    <div className="hidden lg:flex w-1/2 bg-[#2F6B4F] flex-col justify-between p-12">
      <button onClick={() => navigate('landing')} className="shrink-0" aria-label="Go to CarbonConnect homepage"><img src="/carbon-connect-logo-transparent.png" alt="CarbonConnect" className="h-14 w-auto max-w-[280px] object-contain" /></button>
      <div><blockquote className="text-2xl font-medium text-white leading-relaxed mb-6">A structured marketplace for Indian industries that capture CO₂ and industries that use it productively.</blockquote><div className="text-[#3F5145] text-xs">Illustrative platform experience · India</div></div>
      <div className="grid grid-cols-2 gap-4">{[['Gujarat', 'Capture & conditioning'], ['Maharashtra', 'Concrete utilization'], ['Rajasthan', 'Power generation'], ['Tamil Nadu', 'Industrial demand']].map(([v, l]) => <div key={v} className="bg-[#FFFFFF]/10 rounded p-3"><div className="text-sm font-semibold text-white">{v}</div><div className="text-xs text-[#3F5145] mt-0.5">{l}</div></div>)}</div>
    </div>
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <button onClick={() => navigate('landing')} className="text-xs text-[#718276] hover:text-[#415547] mb-8">← Back to Carbon-Connect</button>
        <div className="mb-6 lg:hidden"><button onClick={() => navigate('landing')} className="shrink-0" aria-label="Go to CarbonConnect homepage"><img src="/carbon-connect-logo-transparent.png" alt="CarbonConnect" className="h-14 w-auto max-w-[280px] object-contain" /></button></div>
        <h1 className="text-2xl font-semibold text-[#1F2B23] mb-1">Sign in</h1>
        <p className="text-[#607267] text-sm mb-6">Use Google for a persistent account, or use a demo account for the presentation environment.</p>
        <div className="grid grid-cols-3 gap-2 mb-6">{demoRoles.map(({ label, role }) => <button type="button" key={role} onClick={() => setSelectedRole(role)} className={`py-2.5 text-xs font-medium rounded-lg border transition-colors ${selectedRole === role ? 'border-[#2F6B4F] bg-[#E4ECE4] text-[#3F5145]' : 'border-slate-700/70 text-[#607267] hover:border-[#9FB7A3] hover:text-[#314237]'}`}>{label}</button>)}</div>
        {selectedRole !== 'admin' && googleClientConfigured && <div className="mb-5"><GoogleLogin onSuccess={response => void handleGoogleSuccess(response.credential)} onError={() => setGoogleError('Google sign-in was cancelled or could not be completed.')} useOneTap={false} /></div>}
        {selectedRole !== 'admin' && !googleClientConfigured && <div className="mb-5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">Google sign-in will appear after the deployment is configured with a Google OAuth client ID.</div>}
        {googleError && <div role="alert" className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{googleError}</div>}
        <div className="flex items-center gap-3 mb-5 text-xs text-[#718276]"><span className="h-px flex-1 bg-[#C7D7C8]" /><span>Demo password login</span><span className="h-px flex-1 bg-[#C7D7C8]" /></div>
        <form className="space-y-4" onSubmit={handleLogin}><label className="block text-sm font-medium text-[#415547]">Work email<input name="email" required type="email" defaultValue={`${selectedRole}@carbon-connect.demo`} className="mt-1.5 w-full px-3 py-2.5 text-sm border border-slate-600 rounded bg-[#FFFFFF]" /></label><label className="block text-sm font-medium text-[#415547]">Password<input name="password" required minLength={6} type="password" defaultValue="demo-password" className="mt-1.5 w-full px-3 py-2.5 text-sm border border-slate-600 rounded bg-[#FFFFFF]" /></label><button type="submit" className="w-full py-2.5 bg-[#2F6B4F] text-white text-sm font-medium rounded-xl hover:bg-[#24553F] transition-colors">Sign in as {roleLabel}</button></form>
        <p className="mt-8 text-xs text-[#718276] text-center">Demo credentials: selected role email + <span className="font-mono">demo-password</span>. New organization? <button onClick={() => navigate('role-selection')} className="text-[#2F6B4F] font-medium">Apply for access</button></p>
      </div>
    </div>
  </div>;
}
