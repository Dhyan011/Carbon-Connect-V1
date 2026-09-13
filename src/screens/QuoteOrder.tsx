import { useState } from 'react';
import { Check } from 'lucide-react';
import { useApp } from '../context';
import { Card, Badge, Btn, Input, Select } from '../components/ui';
import Nav from '../components/Nav';
import WorkflowProgress from '../components/WorkflowProgress';

export default function QuoteOrder() {
  const { navigate } = useApp();
  const [mode, setMode] = useState<'quote' | 'order'>('quote');
  const [submitted, setSubmitted] = useState(false);
  const [quantity, setQuantity] = useState('500');
  const quantityValue = Math.max(0, Number(quantity.replace(/,/g, '')) || 0);
  const basePrice = 89;
  const logisticsEstimate = 23;
  const productSubtotal = quantityValue * basePrice;
  const logisticsTotal = quantityValue * logisticsEstimate;
  const platformFee = productSubtotal * 0.02;
  const estimatedTotal = productSubtotal + logisticsTotal + platformFee;
  const formatCurrency = (value: number) => `₹${Math.round(value).toLocaleString('en-IN')}`;

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F4F7F2]">
        <Nav />
        <div className="max-w-xl mx-auto px-6 py-24 text-center">
          <div className="w-16 h-16 bg-[#DDE9DE] rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-[#2F6B4F]"><Check size={24}/></span>
          </div>
          <h2 className="text-2xl font-semibold text-[#1F2B23] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
            {mode === 'quote' ? 'Quote Request Sent' : 'Order Placed'}
          </h2>
          <p className="text-[#607267] mb-2">Reference: <span className="font-mono font-medium">CC-Q-{Math.floor(Math.random() * 9000) + 1000}</span></p>
          <p className="text-[#607267] text-sm mb-8">
            {mode === 'quote'
              ? 'Kutch Industrial Materials Pvt. Ltd. has been notified and will respond within 24 hours.'
              : 'Your order has been placed. Proceed to contract signing to complete the transaction.'}
          </p>
          <div className="flex justify-center gap-3">
            {mode === 'quote'
              ? <Btn onClick={() => navigate('buyer-dashboard')}>Back to dashboard</Btn>
              : <Btn onClick={() => navigate('contract')}>Sign contract →</Btn>
            }
            <Btn variant="outline" onClick={() => setSubmitted(false)}>View details</Btn>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7F2]">
      <Nav />
      <div className="max-w-screen-xl mx-auto px-6 py-8">
        <WorkflowProgress current="quote-order" />
        <button onClick={() => navigate('product-detail')} className="text-sm text-[#607267] hover:text-[#1F2B23] mb-6 block">← Back to product</button>

        <h1 className="text-2xl font-semibold text-[#1F2B23] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
          {mode === 'quote' ? 'Request Quote' : 'Place Order'}
        </h1>

        {/* Mode toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode('quote')}
            className={`px-4 py-2 text-sm font-medium rounded border transition-all ${mode === 'quote' ? 'bg-[#2F6B4F] text-white border-[#2F6B4F]' : 'bg-[#FFFFFF] text-[#607267] border-slate-600 hover:border-zinc-500'}`}
          >
            Request Quote (RFQ)
          </button>
          <button
            onClick={() => setMode('order')}
            className={`px-4 py-2 text-sm font-medium rounded border transition-all ${mode === 'order' ? 'bg-[#2F6B4F] text-white border-[#2F6B4F]' : 'bg-[#FFFFFF] text-[#607267] border-slate-600 hover:border-zinc-500'}`}
          >
            Direct Order
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            {/* Product summary */}
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-[#1F2B23]">Industrial Grade CO₂ — Liquid</div>
                  <div className="text-xs text-[#718276] mt-0.5">Kutch Industrial Materials Pvt. Ltd. · CC-L-4820</div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="green">VERIFIED</Badge>
                  <Badge variant="outline">ISO 9001</Badge>
                </div>
              </div>
            </Card>

            {/* Order details */}
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-[#1F2B23] mb-5">{mode === 'quote' ? 'Quote Request Details' : 'Order Details'}</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[#607267] mb-1.5 block">Quantity (tonnes)</label>
                    <Input value={quantity} onChange={(event) => setQuantity(event.target.value.replace(/[^0-9,]/g, ''))} />
                  </div>
                  <div>
                    <label className="text-xs text-[#607267] mb-1.5 block">Required delivery date</label>
                    <Input value="2026-10-15" type="date" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-[#607267] mb-1.5 block">Delivery address</label>
                  <Input value="Maharashtra Concrete Systems, Mumbai, Maharashtra" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[#607267] mb-1.5 block">Preferred delivery mode</label>
                    <Select options={['Cryogenic road tanker', 'ISO tank container', 'Any']} value="Cryogenic road tanker" />
                  </div>
                  <div>
                    <label className="text-xs text-[#607267] mb-1.5 block">Payment terms</label>
                    <Select options={['Net 30', 'Net 15', 'Prepayment', 'Letter of Credit']} value="Net 30" />
                  </div>
                </div>
                {mode === 'quote' && (
                  <div>
                    <label className="text-xs text-[#607267] mb-1.5 block">Target price (optional)</label>
                    <div className="flex gap-2 items-center">
                      <Input value="105" className="w-32" />
                      <span className="text-sm text-[#607267]">INR / tonne delivered</span>
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-xs text-[#607267] mb-1.5 block">Additional requirements / notes</label>
                  <textarea
                    defaultValue="CO₂ will be injected into ready-mix concrete. Indian chain-of-custody documentation chain-of-custody required for MRV reporting. Batch certificate required with each delivery."
                    className="w-full px-3 py-2 text-sm border border-slate-600 rounded bg-[#FFFFFF] focus:outline-none focus:border-[#2F6B4F] transition-colors h-20 resize-none text-[#415547]"
                  />
                </div>

                <div className="border-t border-slate-800 pt-4">
                  <div className="text-xs font-semibold text-[#607267] uppercase tracking-widest mb-3">Required Documents from Seller</div>
                  <div className="space-y-2">
                    {['Batch purity certificate (per delivery)', 'Chain-of-custody documentation (Indian chain-of-custody documentation)', 'Third-party gas analysis report', 'Delivery note / CMR waybill'].map(d => (
                      <label key={d} className="flex items-center gap-2 text-xs text-[#607267] cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded border-slate-600" />
                        {d}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Price summary */}
          <div className="space-y-4">
            <Card className="p-5">
              <div className="text-xs font-semibold text-[#607267] uppercase tracking-widest mb-4">Price Summary</div>
              <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between text-[#607267]">
                  <span>{quantityValue.toLocaleString('en-IN')} t × ₹89/t</span><span className="font-mono">{formatCurrency(productSubtotal)}</span>
                </div>
                <div className="flex justify-between text-[#607267]">
                  <span>Logistics est.</span><span className="font-mono">{formatCurrency(logisticsTotal)}</span>
                </div>
                <div className="flex justify-between text-[#607267] text-xs border-b border-slate-800 pb-2">
                  <span>Platform fee (2%)</span><span className="font-mono">{formatCurrency(platformFee)}</span>
                </div>
                <div className="flex justify-between font-semibold text-[#1F2B23]">
                  <span>Total estimated</span><span className="font-mono text-[#2F6B4F]">{formatCurrency(estimatedTotal)}</span>
                </div>
                <div className="text-xs text-[#718276]">Prices confirmed in seller's formal quote response.</div>
              </div>

              <div className="mt-5 space-y-2">
                <Btn className="w-full justify-center" onClick={() => setSubmitted(true)}>
                  {mode === 'quote' ? 'Send quote request' : 'Place order'} →
                </Btn>
                <Btn variant="outline" className="w-full justify-center" onClick={() => navigate('pricing-breakdown')}>
                  Review pricing detail
                </Btn>
              </div>
            </Card>

            <Card className="p-5">
              <div className="text-xs font-semibold text-[#607267] uppercase tracking-widest mb-3">What happens next</div>
              <div className="space-y-2.5 text-xs text-[#607267]">
                {(mode === 'quote' ? [
                  '1. RFQ sent to Kutch Industrial Materials Pvt. Ltd.',
                  '2. Seller reviews and responds (≤24h)',
                  '3. You receive formal quote by email',
                  '4. Accept quote to place order',
                  '5. Contract signing and payment',
                ] : [
                  '1. Order confirmed to seller',
                  '2. Proceed to contract signing',
                  '3. Payment processed on platform',
                  '4. Seller dispatches; logistics tracked',
                  '5. Delivery, quality check, CO₂ Passport issued',
                ]).map((s, i) => <div key={i} className="leading-relaxed">{s}</div>)}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
