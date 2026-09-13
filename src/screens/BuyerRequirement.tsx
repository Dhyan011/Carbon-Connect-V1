import { useState } from 'react';
import { useApp } from '../context';
import type { Rfq } from '../types';
import { Card, Btn, SectionHeader, Input, Select, FormRow, Chip } from '../components/ui';
import Nav from '../components/Nav';

const utilizationTypes = [
  'Concrete / mineralization', 'Chemical synthesis', 'E-fuels / e-methanol',
  'Food carbonation', 'Beverage carbonation', 'Greenhouse horticulture',
  'Algae cultivation', 'Enhanced oil recovery', 'Industrial solvent',
];

export default function BuyerRequirement() {
  const { navigate, submitRfq } = useApp();
  const [utilization, setUtilization] = useState<string[]>(['Concrete / mineralization']);
  const [draftSaved, setDraftSaved] = useState(false);

  function toggleUtil(u: string) {
    setUtilization(prev => prev.includes(u) ? prev.filter(x => x !== u) : [...prev, u]);
  }

  return (
    <div className="min-h-screen bg-[#F4F7F2]">
      <Nav />
      <div className="max-w-screen-xl mx-auto px-6 py-8">
        <SectionHeader
          title="Post Procurement Requirement"
          sub="Define your CO₂ specifications, utilization, quantity, and budget. Matched suppliers will receive your RFQ."
          action={<Btn variant="outline" onClick={() => navigate('buyer-dashboard')}>← Back</Btn>}
        />

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <Card>
              <div className="px-8 py-5 border-b border-slate-800">
                <h3 className="text-sm font-semibold text-[#1F2B23]">Requirement Details</h3>
              </div>
              <div className="px-8 py-2">
                <FormRow label="Requirement name">
                  <Input value="Q4 2026 — Concrete Mineralization CO₂" />
                </FormRow>
                <FormRow label="Utilization application" hint="Select all that apply">
                  <div className="flex flex-wrap gap-2">
                    {utilizationTypes.map(u => (
                      <Chip key={u} label={u} active={utilization.includes(u)} onClick={() => toggleUtil(u)} />
                    ))}
                  </div>
                </FormRow>
                <FormRow label="CO₂ grade required">
                  <Select options={['Food Grade (≥99.9%)', 'Industrial Grade (≥99.5%)', 'Technical Grade (≥98.0%)', 'Captured CO₂ (≥95.0%)', 'Any grade (specify minimum purity)']} value="Captured CO₂ (≥95.0%)" />
                </FormRow>
                <FormRow label="Minimum purity" hint="% CO₂ by volume">
                  <div className="flex gap-2 items-center">
                    <Input value="95.0" className="w-28" />
                    <span className="text-sm text-[#607267]">% vol minimum</span>
                  </div>
                </FormRow>
                <FormRow label="Physical state" hint="Preferred delivery state">
                  <Select options={['Liquid (cryogenic)', 'Gas (compressed)', 'Either acceptable']} value="Liquid (cryogenic)" />
                </FormRow>

                <div className="py-4 border-b border-slate-800">
                  <div className="text-sm font-medium text-[#415547] mb-3">Maximum contaminant limits (ppm)</div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { name: 'H₂O', val: '300' },
                      { name: 'SO₂', val: '5' },
                      { name: 'NOₓ', val: '25' },
                      { name: 'CO', val: '50' },
                      { name: 'H₂S', val: '0.5' },
                      { name: 'Total HC', val: '500' },
                    ].map((c, i) => (
                      <div key={i}>
                        <label className="text-xs text-[#607267] mb-1 block">{c.name} max</label>
                        <div className="flex gap-1 items-center">
                          <Input value={c.val} className="w-20" />
                          <span className="text-xs text-[#718276]">ppm</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <FormRow label="Required quantity" hint="For this procurement period">
                  <div className="flex gap-2">
                    <Input value="3,200" className="w-32" />
                    <Select options={['tonnes (total)', 'tonnes/month', 'tonnes/year']} value="tonnes (total)" />
                  </div>
                </FormRow>
                <FormRow label="Procurement period">
                  <div className="flex gap-3 items-center">
                    <Input value="2026-10-01" type="date" className="w-44" />
                    <span className="text-sm text-[#718276]">to</span>
                    <Input value="2026-12-31" type="date" className="w-44" />
                  </div>
                </FormRow>
                <FormRow label="Delivery location" hint="Plant / site address">
                  <Input value="Maharashtra Concrete Systems, Mumbai, Maharashtra" />
                </FormRow>
                <FormRow label="Budget (delivered price)">
                  <div className="flex gap-2 items-center">
                    <Input value="67" className="w-20" placeholder="Min" />
                    <span className="text-sm text-[#718276]">–</span>
                    <Input value="80" className="w-20" placeholder="Max" />
                    <span className="text-sm text-[#607267]">INR / tonne (delivered)</span>
                  </div>
                </FormRow>
                <FormRow label="Preferred delivery mode">
                  <Select options={['Cryogenic road tanker', 'ISO tank container', 'Rail tank car', 'Any']} value="Cryogenic road tanker" />
                </FormRow>
                <FormRow label="Certification requirements">
                  <div className="space-y-2">
                    {['ISO 9001 quality certification', 'Third-party gas analysis (< 90 days)', 'Chain-of-custody documentation', 'Delivery batch certificate'].map(c => (
                      <label key={c} className="flex items-center gap-2 text-sm text-[#607267] cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded border-slate-600" />
                        {c}
                      </label>
                    ))}
                  </div>
                </FormRow>
                <FormRow label="CO₂ source preference" hint="For MRV reporting">
                  <Select options={['No preference', 'Cement / industrial capture preferred', 'Bio-based preferred', 'Point-source capture only']} value="Cement / industrial capture preferred" />
                </FormRow>
                <FormRow label="Additional notes">
                  <textarea
                    className="w-full px-3 py-2 text-sm border border-slate-600 rounded bg-[#FFFFFF] text-[#1F2B23] placeholder-[#819488] focus:outline-none focus:border-[#2F6B4F] transition-colors h-20 resize-none"
                    defaultValue="CO₂ will be injected into ready-mix concrete at point of batching. Full utilization MRV reporting required for ESG disclosure."
                  />
                </FormRow>
              </div>
              <div className="px-8 py-5 border-t border-slate-800 bg-slate-900/50 flex items-center justify-between">
                <button onClick={() => navigate('buyer-dashboard')} className="text-sm text-[#607267] hover:text-[#1F2B23]">← Cancel</button>
                <div className="flex gap-2">
                  <Btn variant="outline" onClick={() => setDraftSaved(true)}>{draftSaved ? 'Draft saved' : 'Save draft'}</Btn>
                  <Btn onClick={() => { const rfq: Rfq = { id: `CC-RFQ-${Math.floor(2050 + Math.random() * 900)}`, title: 'Q4 2026 — Concrete Mineralization CO₂', buyer: 'Maharashtra Concrete Systems', grade: 'Captured CO₂ ≥95%', quantity: '3,200 t', delivery: 'Oct–Dec 2026 · Mumbai', budget: '₹67–80/t delivered', status: 'open', bids: 0 }; submitRfq(rfq); navigate('marketplace'); }}>Publish & find suppliers →</Btn>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="p-5">
              <div className="text-xs font-semibold text-[#607267] uppercase tracking-widest mb-3">How it works</div>
              <div className="space-y-3 text-xs text-[#607267] leading-relaxed">
                <div className="flex gap-2"><span className="text-[#2F6B4F] font-semibold shrink-0">1.</span> Define your CO₂ specs and budget</div>
                <div className="flex gap-2"><span className="text-[#2F6B4F] font-semibold shrink-0">2.</span> Your requirement is matched to verified suppliers</div>
                <div className="flex gap-2"><span className="text-[#2F6B4F] font-semibold shrink-0">3.</span> Matched sellers receive an RFQ notification</div>
                <div className="flex gap-2"><span className="text-[#2F6B4F] font-semibold shrink-0">4.</span> Review quotes and negotiate terms</div>
                <div className="flex gap-2"><span className="text-[#2F6B4F] font-semibold shrink-0">5.</span> Place order — contract, payment, logistics managed on platform</div>
              </div>
            </Card>

            <Card className="p-5">
              <div className="text-xs font-semibold text-[#607267] uppercase tracking-widest mb-3">Market Prices (Sep 2026)</div>
              <div className="space-y-2 text-xs">
                {[
                  { g: 'Food Grade', p: '₹130–180/t' },
                  { g: 'Industrial Grade', p: '₹75–110/t' },
                  { g: 'Technical Grade', p: '₹45–70/t' },
                  { g: 'Captured CO₂', p: '₹50–85/t' },
                ].map((g, i) => (
                  <div key={i} className="flex justify-between text-[#607267] border-b border-slate-800 pb-1.5 last:border-0">
                    <span>{g.g}</span><span className="font-mono font-medium">{g.p}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-xs text-[#718276]">Ex-works. Add logistics for delivered price.</div>
            </Card>

            <Card className="p-5 bg-amber-50 border-amber-200">
              <div className="text-xs font-semibold text-amber-900 mb-2">Physical CO₂ only</div>
              <div className="text-xs text-amber-800 leading-relaxed">
                Requirements on this platform are for physical CO₂ molecules only. Carbon credits and environmental certificates are not procured here.
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
