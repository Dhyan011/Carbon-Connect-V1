import { useApp } from '../context';
import { AlertTriangle, ArrowRight, Check } from 'lucide-react';
import type { Role } from '../types';

const roles = [
  {
    role: 'seller' as Role,
    title: 'CO₂ Seller',
    subtitle: 'Industrial CO₂ Producer',
    desc: 'You generate industrial CO₂ from cement, steel, power, chemicals, or refining and want to sell verified batches to utilization buyers.',
    items: ['List CO₂ batches with full specs', 'Receive RFQs and issue quotes', 'Manage logistics and delivery', 'Generate Digital CO₂ Passports', 'Access MRV and impact analytics'],
    examples: 'Cement plants · Steel mills · Power stations · Refineries · Chemical plants',
    badge: 'Seller',
    color: 'border-slate-600 hover:border-[#2F6B4F]',
  },
  {
    role: 'buyer' as Role,
    title: 'CO₂ Buyer',
    subtitle: 'CO₂ Utilization Offtaker',
    desc: 'You require industrial CO₂ for concrete mineralization, chemical synthesis, food carbonation, greenhouse operations, algae cultivation, or fuel production.',
    items: ['Post detailed requirements', 'Search and compare suppliers', 'Request quotes and negotiate', 'Track logistics and delivery', 'Verify quality and receive CO₂ Passport', 'Report utilization for ESG/MRV'],
    examples: 'Concrete producers · Food manufacturers · Greenhouses · Algae farms · E-fuel plants',
    badge: 'Buyer',
    color: 'border-slate-600 hover:border-[#2F6B4F]',
  },
];

export default function RoleSelection() {
  const { navigate, setRole } = useApp();

  function select(role: Role) {
    setRole(role);
    navigate('registration');
  }

  return (
    <div className="min-h-screen bg-[#F4F7F2] flex flex-col">
      <header className="border-b border-slate-700/70 bg-[#FFFFFF]">
        <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center justify-between">
          <button onClick={() => navigate('landing')} className="flex items-center">
            <img src="/carbon-connect-logo-transparent.png" alt="CarbonConnect" className="h-13 w-auto max-w-[260px] object-contain" />
          </button>
          <button onClick={() => navigate('login')} className="inline-flex items-center gap-1 text-sm text-[#607267] hover:text-[#1F2B23]">Sign in instead <ArrowRight size={14}/></button>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="text-center mb-12">
          <div className="text-xs font-mono text-[#718276] tracking-widest uppercase mb-3">Step 1 of 4</div>
          <h1 className="text-3xl font-semibold text-[#1F2B23] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>What is your role?</h1>
          <p className="text-[#607267] max-w-md">Select the role that best describes your organization's activity on the platform.</p>
        </div>

        <div className="grid grid-cols-2 gap-6 max-w-2xl w-full mb-8">
          {roles.map((r) => (
            <button
              key={r.role}
              onClick={() => select(r.role)}
              className={`bg-[#FFFFFF] border-2 rounded-lg p-7 text-left transition-all group ${r.color} hover:shadow-md`}
            >
              <div className="inline-block text-xs font-medium px-2 py-0.5 rounded mb-4 bg-[#FFFFFF] text-[#415547] border border-[#C7D7C8]">{r.badge}</div>
              <h3 className="text-lg font-semibold text-[#1F2B23] mb-1" style={{ fontFamily: 'var(--font-heading)' }}>{r.title}</h3>
              <p className="text-xs text-[#607267] mb-4">{r.subtitle}</p>
              <p className="text-sm text-[#607267] mb-5 leading-relaxed">{r.desc}</p>
              <ul className="space-y-1.5 mb-5">
                {r.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-[#607267]">
                    <span className="text-[#2F6B4F]"><Check size={14}/></span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-[#718276] border-t border-slate-800 pt-4">{r.examples}</p>
              <div className="mt-4 text-sm font-medium text-[#2F6B4F] group-hover:underline">
                Continue as {r.badge} →
              </div>
            </button>
          ))}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded p-4 max-w-2xl w-full">
          <div className="flex gap-3">
            <span className="text-amber-600 shrink-0"><AlertTriangle size={17}/></span>
            <div className="text-xs text-amber-800">
              <strong>Physical CO₂ only.</strong> Carbon-Connect is exclusively a marketplace for physical industrial CO₂ gas and liquid. It does not trade carbon credits, voluntary emissions units (VCUs), guarantees of origin (GOs), or any other financial carbon instruments. Those are traded on separate regulated registries.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
