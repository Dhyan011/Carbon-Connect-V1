import { useState, type FormEvent } from 'react';
import { ArrowRight, CheckCircle2, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react';
import { useApp } from '../context';
import type { Role } from '../types';

const demoRoles: { label: string; role: Exclude<Role, null>; description: string }[] = [
  { label: 'Seller industry', role: 'seller', description: 'Publish supply and respond to requirements' },
  { label: 'Buyer industry', role: 'buyer', description: 'Discover supply and manage demand' },
  { label: 'Admin', role: 'admin', description: 'Review platform activity and controls' },
];

export default function Login() {
  const { navigate, authenticate } = useApp();
  const [selectedRole, setSelectedRole] = useState<Exclude<Role, null>>('buyer');
  const roleLabel = selectedRole === 'seller' ? 'Seller' : selectedRole === 'admin' ? 'Admin' : 'Buyer';

  function handleLogin(event: FormEvent) {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    void authenticate(selectedRole, String(data.get('email') || ''), String(data.get('password') || ''));
  }

  return <div className="min-h-screen bg-[#F4F7F2] lg:grid lg:grid-cols-[minmax(420px,.86fr)_1.14fr]">
    <aside className="hidden lg:flex relative overflow-hidden bg-[#173C2A] px-12 py-12 text-white flex-col justify-between">
      <div className="absolute -right-32 top-20 h-96 w-96 rounded-full border border-white/10" />
      <div className="absolute -right-20 top-32 h-72 w-72 rounded-full border border-[#B9D0BC]/20" />
      <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-[#102A1E]/80 to-transparent" />
      <button onClick={() => navigate('landing')} className="relative z-10 inline-flex self-start rounded-xl bg-white px-3 py-2.5 shadow-sm" aria-label="Go to CarbonConnect homepage"><img src="/carbon-connect-logo-transparent.png" alt="CarbonConnect" className="h-10 w-auto max-w-[210px] object-contain" /></button>
      <div className="relative z-10 max-w-lg">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#B9D0BC]/35 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[.14em] text-[#EAF3EA]"><Sparkles size={13}/> Carbon-Connect workspace</div>
        <h2 className="max-w-md text-4xl font-semibold leading-[1.08] tracking-[-.04em]">Move captured carbon toward its next useful life.</h2>
        <p className="mt-5 max-w-md text-base leading-relaxed text-[#DDEADE]">A clearer operating layer for supply, demand, evidence, contracting and delivery.</p>
        <div className="mt-9 grid grid-cols-3 gap-3 max-w-md"><div className="rounded-xl border border-white/15 bg-white/10 p-3"><div className="text-lg font-semibold text-white">01</div><div className="mt-1 text-xs leading-snug text-[#DDEADE]">Specify</div></div><div className="rounded-xl border border-white/15 bg-white/10 p-3"><div className="text-lg font-semibold text-white">02</div><div className="mt-1 text-xs leading-snug text-[#DDEADE]">Match</div></div><div className="rounded-xl border border-white/15 bg-white/10 p-3"><div className="text-lg font-semibold text-white">03</div><div className="mt-1 text-xs leading-snug text-[#DDEADE]">Move</div></div></div>
      </div>
      <div className="relative z-10 flex items-center gap-5 text-xs font-medium text-[#DDEADE]"><span className="inline-flex items-center gap-2"><ShieldCheck size={16} className="text-[#B9D0BC]"/> Evidence-led workflows</span><span className="inline-flex items-center gap-2"><CheckCircle2 size={16} className="text-[#B9D0BC]"/> Demo environment</span></div>
    </aside>

    <main className="flex min-h-screen items-center justify-center px-5 py-8 sm:px-8">
      <div className="w-full max-w-[520px]">
        <div className="mb-8 flex items-center justify-between"><button onClick={() => navigate('landing')} className="inline-flex items-center gap-2 text-sm font-semibold text-[#315744] hover:text-[#173C2A]"><ArrowRight size={16} className="rotate-180"/> Back to home</button><span className="hidden items-center gap-2 text-xs font-semibold text-[#607267] sm:inline-flex"><LockKeyhole size={14}/> Secure demo access</span></div>
        <div className="mb-7 lg:hidden"><button onClick={() => navigate('landing')} className="inline-flex rounded-xl bg-white px-3 py-2.5 shadow-sm" aria-label="Go to CarbonConnect homepage"><img src="/carbon-connect-logo-transparent.png" alt="CarbonConnect" className="h-10 w-auto max-w-[210px] object-contain" /></button></div>
        <section className="rounded-3xl border border-[#C7D7C8] bg-white p-6 shadow-[0_20px_60px_rgba(20,45,27,.10)] sm:p-9">
          <div className="mb-7"><p className="mb-2 text-xs font-bold uppercase tracking-[.16em] text-[#2F6B4F]">Workspace sign in</p><h1 className="text-3xl font-bold tracking-[-.035em] text-[#14231B]">Welcome back</h1><p className="mt-2 text-base leading-relaxed text-[#496153]">Choose your workspace and sign in to continue.</p></div>
          <div className="mb-7 grid gap-3">{demoRoles.map(({ label, role, description }) => <button type="button" key={role} onClick={() => setSelectedRole(role)} className={`flex min-h-[68px] items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${selectedRole === role ? 'border-[#2F6B4F] bg-[#EAF3EA] ring-2 ring-[#B9D0BC]' : 'border-[#C7D7C8] bg-white hover:border-[#7FA68A] hover:bg-[#F4F8F3]'}`}><span><span className="block text-sm font-bold text-[#1C3325]">{label}</span><span className="mt-0.5 block text-xs font-medium text-[#496153]">{description}</span></span><span className={`h-5 w-5 rounded-full border-2 ${selectedRole === role ? 'border-[#2F6B4F] bg-[#2F6B4F] shadow-[inset_0_0_0_4px_white]' : 'border-[#9FB7A3]'}`} /></button>)}</div>
          <form className="space-y-5" onSubmit={handleLogin}><label className="block text-sm font-bold text-[#1C3325]">Work email<input name="email" required type="email" defaultValue={`${selectedRole}@carbon-connect.demo`} className="mt-2 h-12 w-full rounded-xl border border-[#AFC4B2] bg-[#FCFEFC] px-4 text-base font-medium text-[#14231B] shadow-sm outline-none placeholder:text-[#718276] focus:border-[#2F6B4F] focus:ring-4 focus:ring-[#B9D0BC]/45" /></label><label className="block text-sm font-bold text-[#1C3325]">Password<input name="password" required minLength={6} type="password" defaultValue="demo-password" className="mt-2 h-12 w-full rounded-xl border border-[#AFC4B2] bg-[#FCFEFC] px-4 text-base font-medium text-[#14231B] shadow-sm outline-none placeholder:text-[#718276] focus:border-[#2F6B4F] focus:ring-4 focus:ring-[#B9D0BC]/45" /></label><button type="submit" className="mt-2 flex h-12 w-full items-center justify-center rounded-xl bg-[#2F6B4F] text-base font-bold text-white shadow-sm transition-colors hover:bg-[#24553F]">Sign in as {roleLabel}<ArrowRight size={18} className="ml-2" /></button></form>
          <div className="mt-7 border-t border-[#DFE9DF] pt-5 text-center"><p className="text-sm font-medium text-[#496153]">Demo credentials: selected role email + <span className="rounded bg-[#EAF3EA] px-1.5 py-0.5 font-mono font-bold text-[#315744]">demo-password</span></p><button onClick={() => navigate('role-selection')} className="mt-3 text-sm font-bold text-[#2F6B4F] underline decoration-[#9FB7A3] underline-offset-4 hover:text-[#173C2A]">Apply for access</button></div>
        </section>
      </div>
    </main>
  </div>;
}
