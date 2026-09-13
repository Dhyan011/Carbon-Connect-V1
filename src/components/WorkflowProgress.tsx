import { Check } from 'lucide-react';
import type { Screen } from '../types';
import { useApp } from '../context';

const steps: Array<{ label: string; screen: Screen }> = [
  { label: 'Product', screen: 'product-detail' },
  { label: 'Pricing', screen: 'pricing-breakdown' },
  { label: 'Quote / order', screen: 'quote-order' },
  { label: 'Contract', screen: 'contract' },
  { label: 'Payment', screen: 'payment' },
  { label: 'Logistics', screen: 'logistics' },
  { label: 'Passport', screen: 'digital-passport' },
];

export default function WorkflowProgress({ current }: { current: Screen }) {
  const { navigate } = useApp();
  const currentIndex = Math.max(0, steps.findIndex(step => step.screen === current));
  return <div className="mb-7 overflow-x-auto pb-1" aria-label="Transaction progress">
    <div className="flex min-w-[720px] items-center">
      {steps.map((step, index) => <div key={step.screen} className="flex items-center flex-1 last:flex-none">
        <button onClick={() => navigate(step.screen)} className="group flex items-center gap-2 text-left" aria-current={index === currentIndex ? 'step' : undefined}>
          <span className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition-colors ${index < currentIndex ? 'bg-[#2F6B4F] border-[#2F6B4F] text-white' : index === currentIndex ? 'bg-[#FFFFFF] border-[#79A88A] text-[#79A88A]' : 'bg-[#FFFFFF] border-slate-600 text-[#718276]'}`}>{index < currentIndex ? <Check size={14}/> : index + 1}</span>
          <span className={`text-xs whitespace-nowrap ${index === currentIndex ? 'text-[#1F2B23] font-semibold' : index < currentIndex ? 'text-[#3F5145]' : 'text-[#718276]'} group-hover:text-[#1F2B23]`}>{step.label}</span>
        </button>
        {index < steps.length - 1 && <div className={`mx-3 h-px flex-1 ${index < currentIndex ? 'bg-[#2F6B4F]' : 'bg-slate-700'}`} />}
      </div>)}
    </div>
  </div>;
}
