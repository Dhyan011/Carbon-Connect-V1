import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useApp } from '../context';
import type { Role, Screen } from '../types';

interface NavItem { label: string; screen: Screen }
const sellerNav: NavItem[] = [
  { label:'Dashboard',screen:'seller-dashboard' }, { label:'Create listing',screen:'create-listing' }, { label:'Orders',screen:'contract' }, { label:'Logistics',screen:'logistics' }, { label:'Payments',screen:'payment' }, { label:'CO₂ passport',screen:'digital-passport' }, { label:'Compliance',screen:'compliance' },
];
const buyerNav: NavItem[] = [
  { label:'Dashboard',screen:'buyer-dashboard' }, { label:'Marketplace',screen:'marketplace' }, { label:'My requirements',screen:'buyer-requirement' }, { label:'Suppliers',screen:'supplier-details' }, { label:'Orders & contracts',screen:'contract' }, { label:'Logistics',screen:'logistics' }, { label:'Payments',screen:'payment' }, { label:'CO₂ passport',screen:'digital-passport' }, { label:'Impact & MRV',screen:'impact-mrv' }, { label:'Compliance',screen:'compliance' },
];
const adminNav: NavItem[] = [{ label:'Organizations',screen:'admin-dashboard' }, { label:'Listings',screen:'marketplace' }, { label:'Compliance',screen:'compliance' }, { label:'Anomalies',screen:'anomaly-monitoring' }];
function getNav(role: Role) { return role==='seller'?sellerNav:role==='buyer'?buyerNav:role==='admin'?adminNav:[]; }

export default function Nav() {
  const { screen, navigate, role, signOut } = useApp(); const [open,setOpen]=useState(false); if(!role) return null;
  const roleLabel=role==='seller'?'Seller industry':role==='buyer'?'Buyer industry':'Admin'; const orgName=role==='seller'?'Kutch Industrial Materials':role==='buyer'?'Maharashtra Concrete Systems':'Carbon-Connect Admin';
  function go(next: Screen){ setOpen(false); navigate(next); }
  return <header className="sticky top-0 z-50 bg-[#FFFFFF]/88 backdrop-blur-xl border-b border-slate-700/70 transition-colors duration-300">
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 flex items-center min-h-16 gap-4">
      <button onClick={()=>go('landing')} className="shrink-0 group" aria-label="Go to CarbonConnect homepage"><img src="/carbon-connect-logo-transparent.png" alt="CarbonConnect" className="h-13 w-auto max-w-[260px] object-contain" /></button>
      <nav className="hidden lg:flex items-center gap-1 flex-1 overflow-x-auto [scrollbar-width:none]">{getNav(role).map(item=><button key={`${item.label}-${item.screen}`} onClick={()=>go(item.screen)} className={`px-3 py-2.5 text-sm font-semibold rounded-md whitespace-nowrap transition-all duration-200 ${screen===item.screen?'bg-[#102A40] text-[#2F6B4F] shadow-[inset_0_-1px_0_#79A88A]':'text-[#415547] hover:text-[#1F2B23] hover:bg-slate-900/50'}`}>{item.label}</button>)}</nav>
      <div className="ml-auto flex items-center gap-3 shrink-0"><span className="hidden sm:inline-flex text-xs px-3 py-1.5 rounded-md border border-slate-700/70 text-[#415547]">{roleLabel}</span><button onClick={()=>go('profile')} className="flex items-center gap-2 group" aria-label="Open organization profile"><div className="w-9 h-9 rounded-full bg-[#DDE9DE] flex items-center justify-center text-sm font-medium text-[#2F6B4F]">{orgName.charAt(0)}</div><span className="hidden xl:block text-sm text-[#415547] group-hover:text-[#1F2B23]">{orgName}</span></button><button onClick={signOut} className="hidden sm:block text-sm text-[#607267] hover:text-[#1F2B23] ml-1">Sign out</button><button onClick={()=>setOpen(v=>!v)} className="lg:hidden w-10 h-10 rounded-lg border border-slate-700/70 text-[#415547] flex items-center justify-center" aria-label={open?'Close navigation':'Open navigation'}>{open?<X size={19}/>:<Menu size={19}/>}</button></div>
    </div>
    {open&&<div className="lg:hidden border-t border-slate-800 bg-[#FFFFFF] px-4 py-3 shadow-lg animate-fade-in-up"><nav className="grid grid-cols-2 gap-1.5 max-h-[65vh] overflow-y-auto">{getNav(role).map(item=><button key={`${item.label}-${item.screen}`} onClick={()=>go(item.screen)} className={`text-left px-3 py-2.5 rounded-md text-xs font-medium transition-colors ${screen===item.screen?'bg-[#102A40] text-[#2F6B4F]':'text-[#607267] hover:bg-slate-900/50 hover:text-[#1F2B23]'}`}>{item.label}</button>)}</nav><button onClick={signOut} className="mt-3 w-full border-t border-slate-800 pt-3 text-left text-xs text-[#607267] hover:text-[#1F2B23] transition-colors">Sign out of workspace</button></div>}
  </header>;
}
