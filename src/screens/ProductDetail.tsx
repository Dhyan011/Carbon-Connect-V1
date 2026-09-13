import { useState } from 'react';
import { Check, FileText } from 'lucide-react';
import { useApp } from '../context';
import { Card, Badge, Btn, ScorePill, ProgressBar } from '../components/ui';
import Nav from '../components/Nav';
import WorkflowProgress from '../components/WorkflowProgress';

const specs = [
  { label: 'CO₂ Purity', value: '99.51% vol minimum', highlight: true },
  { label: 'Physical state', value: 'Liquid (cryogenic)' },
  { label: 'Temperature', value: '-20 °C (storage & delivery)' },
  { label: 'Pressure', value: '18.5 bar(g)' },
  { label: 'CO₂ Source', value: 'Cement kiln flue gas — post-combustion amine capture' },
  { label: 'Annual volume', value: '85,000 tonnes / year' },
  { label: 'Minimum order', value: '50 tonnes' },
  { label: 'Delivery terms', value: 'DAP (Delivered at Place) — Incoterms 2020' },
  { label: 'Lead time', value: '5 business days from order confirmation' },
  { label: 'Available from', value: 'October 1, 2026' },
  { label: 'Max delivery radius', value: '800 km from Mundra' },
];

const contaminants = [
  { name: 'H₂O (water)', max: '10 ppm', typical: '4–6 ppm', status: 'pass' },
  { name: 'O₂ (oxygen)', max: '5 ppm', typical: '1–2 ppm', status: 'pass' },
  { name: 'SO₂ (sulfur dioxide)', max: '0.1 ppm', typical: '<0.05 ppm', status: 'pass' },
  { name: 'NOₓ (nitrogen oxides)', max: '2.5 ppm', typical: '0.8–1.2 ppm', status: 'pass' },
  { name: 'CO (carbon monoxide)', max: '10 ppm', typical: '3–5 ppm', status: 'pass' },
  { name: 'H₂S (hydrogen sulfide)', max: '0.1 ppm', typical: '<0.05 ppm', status: 'pass' },
  { name: 'NH₃ (ammonia)', max: '2.5 ppm', typical: '0.3–0.5 ppm', status: 'pass' },
  { name: 'Total hydrocarbons', max: '50 ppm', typical: '12–18 ppm', status: 'pass' },
];

export default function ProductDetail() {
  const { navigate } = useApp();
  const [openCert, setOpenCert] = useState<number | null>(null);
  const [quantity, setQuantity] = useState('500');
  const quantityValue = Math.max(0, Number(quantity.replace(/,/g, '')) || 0);
  const basePrice = 89;
  const logisticsEstimate = 23;
  const productSubtotal = quantityValue * basePrice;
  const logisticsTotal = quantityValue * logisticsEstimate;
  const estimatedTotal = productSubtotal + logisticsTotal;
  const formatCurrency = (value: number) => `₹${Math.round(value).toLocaleString('en-IN')}`;

  return (
    <div className="min-h-screen bg-[#F4F7F2]">
      <Nav />
      <div className="max-w-screen-xl mx-auto px-6 py-8">
        <WorkflowProgress current="product-detail" />
        <button onClick={() => navigate('marketplace')} className="text-sm text-[#607267] hover:text-[#1F2B23] mb-6 block">← Back to marketplace</button>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            {/* Header */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-xl font-semibold text-[#1F2B23]" style={{ fontFamily: 'var(--font-heading)' }}>Industrial Grade CO₂ — Liquid</h1>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="green">VERIFIED</Badge>
                    <Badge variant="blue">ISO 9001</Badge>
                    <Badge variant="outline">Indian chain-of-custody documentation</Badge>
                    <Badge variant="outline">CCTS context (where applicable)</Badge>
                  </div>
                  <div className="text-sm text-[#607267]">
                    Listing ID: <span className="font-mono">CC-L-4820</span> · Kutch Industrial Materials Pvt. Ltd. · Mundra, Gujarat
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-semibold text-[#1F2B23] font-mono">₹89</div>
                  <div className="text-xs text-[#718276]">per tonne ex-works</div>
                  <div className="text-xs text-[#607267] mt-1">Est. delivered: <span className="font-mono font-medium">₹112/t</span></div>
                </div>
              </div>
              <div className="flex gap-2 pt-4 border-t border-slate-800">
                <Btn onClick={() => navigate('pricing-breakdown')}>View full pricing breakdown</Btn>
                <Btn variant="outline" onClick={() => navigate('quote-order')}>Request quote</Btn>
                <Btn variant="ghost" onClick={() => navigate('supplier-details')}>View supplier →</Btn>
              </div>
            </Card>

            {/* Specs */}
            <Card className="overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800">
                <h3 className="text-sm font-semibold text-[#1F2B23]">CO₂ Product Specifications</h3>
              </div>
              <div className="divide-y divide-zinc-100">
                {specs.map((s, i) => (
                  <div key={i} className={`px-6 py-3 flex items-center justify-between ${s.highlight ? 'bg-[#E4ECE4]/50' : ''}`}>
                    <span className="text-xs text-[#607267]">{s.label}</span>
                    <span className={`text-xs font-medium font-mono ${s.highlight ? 'text-[#3F5145]' : 'text-[#1F2B23]'}`}>{s.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Contaminant analysis */}
            <Card className="overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-[#1F2B23]">Contaminant Analysis</h3>
                  <p className="text-xs text-[#718276] mt-0.5">Third-party analysis — ACVA / accredited verifier (demo), Sep 2026 · EN 13279 standard</p>
                </div>
                <Badge variant="green">ALL PASS</Badge>
              </div>
              <div className="divide-y divide-zinc-100">
                {contaminants.map((c, i) => (
                  <div key={i} className="px-6 py-3 grid grid-cols-4 gap-4 items-center">
                    <span className="text-xs text-[#415547] font-medium">{c.name}</span>
                    <span className="text-xs text-[#718276] font-mono">Max: {c.max}</span>
                    <span className="text-xs text-[#607267] font-mono">Typical: {c.typical}</span>
                    <div className="flex justify-end">
                      <span className="inline-flex items-center gap-1 text-xs text-[#2F6B4F] bg-[#E4ECE4] px-2 py-0.5 rounded border border-[#9FB7A3] font-mono"><Check size={12}/>PASS</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Certifications */}
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-[#1F2B23] mb-4">Certifications &amp; Documentation</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'ISO 9001:2015 Certificate', issuer: 'TÜV SÜD', date: '2027-03-15' },
                  { name: 'ISO 14001:2015 Certificate', issuer: 'ACVA / accredited verifier (demo)', date: '2027-03-15' },
                  { name: 'Indian chain-of-custody documentation Chain of Custody', issuer: 'Applicable Indian verifier (demo)', date: '2026-11-30' },
                  { name: 'CPCB / SPCB environmental documentation', issuer: 'MoEFCC / applicable Indian authority (review)', date: '2027-01-01' },
                  { name: 'Food-grade specification review Compliance', issuer: 'EIGA', date: '2027-06-01' },
                  { name: 'Gas Analysis Report', issuer: 'ACVA / accredited verifier (demo)', date: 'Sep 2026' },
                ].map((cert, i) => (
                  <div
                    key={i}
                    onClick={() => setOpenCert(openCert === i ? null : i)}
                    className="flex flex-col gap-2 p-3 border border-slate-700/70 rounded hover:border-slate-600 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <FileText size={18} className="text-[#2F6B4F]"/>
                      <div>
                        <div className="text-xs font-medium text-[#1F2B23]">{cert.name}</div>
                        <div className="text-xs text-[#718276] mt-0.5">{cert.issuer} · {cert.date}</div>
                      </div>
                    </div>
                    {openCert === i && (
                      <div className="text-xs text-[#607267] bg-slate-900/50 border border-slate-700/70 rounded p-2">
                        Issued by {cert.issuer} on {cert.date}. Verified document on file with Carbon-Connect compliance records.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="p-5">
              <div className="text-xs font-semibold text-[#607267] uppercase tracking-widest mb-4">Supplier Scores</div>
              <div className="space-y-3.5">
                <ScorePill label="Commercial Score" score={82} />
                <ScorePill label="Climate Score" score={74} />
                <ScorePill label="Compliance Score" score={76} />
                <ScorePill label="Delivery Reliability" score={98} />
              </div>
            </Card>

            <Card className="p-5 bg-[#2F6B4F] border-[#2F6B4F]">
              <div className="text-xs font-semibold text-[#3F5145] uppercase tracking-widest mb-3">Quick order</div>
              <div className="mb-3">
                <label className="text-xs text-[#2F6B4F] mb-1 block">Quantity (tonnes)</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value.replace(/[^0-9,]/g, ''))}
                  className="w-full px-3 py-2 text-sm border border-[#9FB7A3] rounded bg-[#14231B] text-white placeholder-sky-400 focus:outline-none focus:border-sky-300"
                />
              </div>
              <div className="border-t border-[#9FB7A3] pt-3 mb-4">
                <div className="flex justify-between text-sm text-[#3F5145] mb-1">
                  <span>{quantityValue.toLocaleString('en-IN')} t × ₹89/t ex-works</span>
                  <span className="font-mono">{formatCurrency(productSubtotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-[#2F6B4F] mb-1">
                  <span>Est. logistics (road, 600 km)</span>
                  <span className="font-mono">{formatCurrency(logisticsTotal)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-white border-t border-[#9FB7A3] pt-2 mt-2">
                  <span>Estimated total</span>
                  <span className="font-mono">{formatCurrency(estimatedTotal)}</span>
                </div>
              </div>
              <button
                onClick={() => navigate('quote-order')}
                className="w-full py-2.5 bg-[#FFFFFF] text-[#2F6B4F] text-sm font-semibold rounded hover:bg-[#E4ECE4] transition-colors"
              >
                Request formal quote →
              </button>
            </Card>

            <Card className="p-5">
              <div className="text-xs font-semibold text-[#607267] uppercase tracking-widest mb-3">Digital Passport</div>
              <p className="text-xs text-[#607267] mb-3 leading-relaxed">Each delivered batch comes with an immutable CO₂ Digital Passport recording purity, contaminants, chain of custody, and certification.</p>
              <button onClick={() => navigate('digital-passport')} className="text-xs text-[#2F6B4F] hover:underline">
                View sample passport →
              </button>
            </Card>

            <Card className="p-4 bg-amber-50 border-amber-200">
              <div className="text-xs text-amber-800 leading-relaxed">
                <strong>Note:</strong> This listing covers physical CO₂ molecules only. Climate impact reporting and MRV documentation are provided separately and do not constitute carbon credit issuance.
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
