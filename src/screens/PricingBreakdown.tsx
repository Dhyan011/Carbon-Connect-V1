import { useState } from 'react';
import { useApp } from '../context';
import { Card, Btn, Badge, downloadFile } from '../components/ui';
import Nav from '../components/Nav';
import WorkflowProgress from '../components/WorkflowProgress';

const components = [
  { category: 'Production', label: 'CO₂ capture cost', basis: 'Amine scrubbing OPEX', rate: 28.00, editable: false },
  { category: 'Production', label: 'Liquefaction', basis: 'On-site liquefaction plant', rate: 12.50, editable: false },
  { category: 'Production', label: 'Storage (cryogenic tank)', basis: '₹0.08/t/day × 50 day avg', rate: 4.00, editable: false },
  { category: 'Production', label: 'Quality control & analysis', basis: 'Third-party testing allocation', rate: 2.50, editable: false },
  { category: 'Seller margin', label: 'Seller gross margin', basis: '20% on production cost', rate: 9.40, editable: false },
  { category: 'Handling', label: 'Plant gate loading', basis: 'Road tanker / ISO container fill', rate: 3.50, editable: false },
  { category: 'Platform', label: 'Carbon-Connect platform fee', basis: '2% of ex-works price', rate: 1.70, editable: false },
  { category: 'Logistics', label: 'Road transport (600 km)', basis: 'Messer Transport — cryogenic tanker', rate: 19.50, editable: true },
  { category: 'Logistics', label: 'Toll & fuel surcharge', basis: 'Sep 2026 fuel index + 8%', rate: 1.80, editable: true },
  { category: 'Logistics', label: 'Discharge / offloading', basis: 'Receiver site handling', rate: 1.50, editable: true },
  { category: 'Taxes & levies', label: 'Transport CO₂ emission levy', basis: 'EU ETF-1 road freight', rate: 0.80, editable: false },
];

export default function PricingBreakdown() {
  const { navigate } = useApp();
  const [qty, setQty] = useState(500);

  const byCategory: Record<string, typeof components> = {};
  components.forEach(c => {
    if (!byCategory[c.category]) byCategory[c.category] = [];
    byCategory[c.category].push(c);
  });

  const exWorks = components.filter(c => c.category !== 'Logistics' && c.category !== 'Taxes & levies').reduce((s, c) => s + c.rate, 0);
  const logistics = components.filter(c => c.category === 'Logistics' || c.category === 'Taxes & levies').reduce((s, c) => s + c.rate, 0);
  const total = exWorks + logistics;

  const catColors: Record<string, string> = {
    'Production': 'border-l-blue-400',
    'Seller margin': 'border-l-purple-400',
    'Handling': 'border-l-zinc-400',
    'Platform': 'border-l-amber-400',
    'Logistics': 'border-l-[#2F6B4F]',
    'Taxes & levies': 'border-l-red-300',
  };

  return (
    <div className="min-h-screen bg-[#F4F7F2]">
      <Nav />
      <div className="max-w-screen-xl mx-auto px-6 py-8">
        <WorkflowProgress current="pricing-breakdown" />
        <button onClick={() => navigate('product-detail')} className="text-sm text-[#607267] hover:text-[#1F2B23] mb-6 block">← Back to product</button>

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-[#1F2B23] mb-1" style={{ fontFamily: 'var(--font-heading)' }}>Pricing Breakdown</h1>
            <p className="text-[#607267] text-sm">Transparent, rules-based pricing. Every cost component is itemized below. No black-box calculations.</p>
          </div>
          <div className="flex gap-2">
            <Btn variant="outline" onClick={() => downloadFile('carbon-connect-pricing-breakdown-demo.pdf', 'Carbon-Connect Pricing Breakdown\nDemo data only.', 'application/pdf')}>Download PDF</Btn>
            <Btn onClick={() => navigate('quote-order')}>Proceed to quote →</Btn>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            {/* Quantity input */}
            <Card className="p-5">
              <div className="flex items-center gap-6">
                <div>
                  <label className="text-xs text-[#607267] mb-1 block">Quantity (tonnes)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={50}
                      max={5000}
                      step={50}
                      value={qty}
                      onChange={e => setQty(Number(e.target.value))}
                      className="w-48 accent-[#2F6B4F]"
                    />
                    <span className="text-sm font-mono font-semibold text-[#1F2B23] w-16">{qty} t</span>
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-[#718276]">Ex-works (per tonne)</div>
                    <div className="text-lg font-semibold text-[#1F2B23] font-mono mt-0.5">${exWorks.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#718276]">Logistics (per tonne)</div>
                    <div className="text-lg font-semibold text-[#1F2B23] font-mono mt-0.5">${logistics.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#718276]">Total delivered</div>
                    <div className="text-lg font-semibold text-[#2F6B4F] font-mono mt-0.5">${total.toFixed(2)}/t</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Breakdown table */}
            {Object.entries(byCategory).map(([cat, items]) => (
              <Card key={cat} className="overflow-hidden">
                <div className="px-6 py-3 border-b border-slate-800 bg-slate-900/50">
                  <span className="text-xs font-semibold text-[#607267] uppercase tracking-widest">{cat}</span>
                </div>
                <div className="divide-y divide-zinc-100">
                  {items.map((item, i) => (
                    <div key={i} className={`px-6 py-3.5 flex items-center justify-between border-l-2 ${catColors[cat] || 'border-l-zinc-300'}`}>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-[#1F2B23]">{item.label}</div>
                        <div className="text-xs text-[#718276] mt-0.5">{item.basis}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono font-semibold text-[#1F2B23]">${item.rate.toFixed(2)}/t</div>
                        <div className="text-xs text-[#718276] font-mono">${(item.rate * qty).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {/* Summary sidebar */}
          <div className="space-y-4">
            <Card className="p-5">
              <div className="text-xs font-semibold text-[#607267] uppercase tracking-widest mb-4">Order Summary</div>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-[#607267]">
                  <span>Quantity</span><span className="font-mono font-medium">{qty} t</span>
                </div>
                <div className="flex justify-between text-[#607267] border-b border-slate-800 pb-2.5">
                  <span>Grade</span><span>Industrial (99.51%)</span>
                </div>

                {Object.entries(byCategory).map(([cat, items]) => {
                  const subtotal = items.reduce((s, c) => s + c.rate, 0);
                  return (
                    <div key={cat} className="flex justify-between text-xs text-[#607267]">
                      <span>{cat}</span>
                      <span className="font-mono">${subtotal.toFixed(2)}/t</span>
                    </div>
                  );
                })}

                <div className="border-t border-slate-700/70 pt-3 mt-2">
                  <div className="flex justify-between text-sm font-medium text-[#415547]">
                    <span>Ex-works subtotal</span>
                    <span className="font-mono">${exWorks.toFixed(2)}/t</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-[#415547] mt-1">
                    <span>Logistics subtotal</span>
                    <span className="font-mono">${logistics.toFixed(2)}/t</span>
                  </div>
                </div>

                <div className="border-t-2 border-slate-600 pt-3 flex justify-between">
                  <span className="text-sm font-semibold text-[#1F2B23]">Total delivered</span>
                  <span className="text-lg font-semibold text-[#2F6B4F] font-mono">${total.toFixed(2)}/t</span>
                </div>
                <div className="flex justify-between text-xs text-[#607267] font-mono">
                  <span>Total order value</span>
                  <span className="font-medium">${(total * qty).toLocaleString()}</span>
                </div>
              </div>
              <Btn onClick={() => navigate('quote-order')} className="w-full mt-5 justify-center">
                Request formal quote →
              </Btn>
            </Card>

            <Card className="p-5 border-slate-700/70">
              <div className="text-xs font-semibold text-[#607267] uppercase tracking-widest mb-3">Pricing Rules</div>
              <div className="space-y-2 text-xs text-[#607267] leading-relaxed">
                <div>• Production costs are fixed per the seller's published rate card.</div>
                <div>• Platform fee is fixed at 2% of ex-works value.</div>
                <div>• Logistics is calculated by Carbon-Connect logistics engine using current fuel indices and route data.</div>
                <div>• Taxes and levies reflect current EU regulatory rates.</div>
                <div>• No hidden fees. All components above are final.</div>
              </div>
            </Card>

            <Card className="p-4 bg-amber-50 border-amber-200">
              <div className="text-xs text-amber-800">
                <strong>Not included:</strong> Carbon credit costs, offset fees, or environmental certificate charges. These are separate financial instruments not managed here.
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
