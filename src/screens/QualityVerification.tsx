import { useState } from 'react';
import { Check } from 'lucide-react';
import { useApp } from '../context';
import { Card, Badge, Btn, SectionHeader } from '../components/ui';
import Nav from '../components/Nav';

const tests = [
  { name: 'CO₂ purity (GC analysis)', spec: '≥ 99.51%', measured: '99.63%', status: 'pass' },
  { name: 'H₂O (Karl Fischer)', spec: '≤ 10 ppm', measured: '5.2 ppm', status: 'pass' },
  { name: 'O₂ (galvanic sensor)', spec: '≤ 5 ppm', measured: '1.8 ppm', status: 'pass' },
  { name: 'SO₂ (UV fluorescence)', spec: '≤ 0.1 ppm', measured: '<0.05 ppm', status: 'pass' },
  { name: 'NOₓ (chemiluminescence)', spec: '≤ 2.5 ppm', measured: '0.9 ppm', status: 'pass' },
  { name: 'CO (NDIR)', spec: '≤ 10 ppm', measured: '3.4 ppm', status: 'pass' },
  { name: 'H₂S (electrochemical)', spec: '≤ 0.1 ppm', measured: '<0.05 ppm', status: 'pass' },
  { name: 'NH₃ (colorimetric)', spec: '≤ 2.5 ppm', measured: '0.3 ppm', status: 'pass' },
  { name: 'Total hydrocarbons (FID)', spec: '≤ 50 ppm', measured: '15.2 ppm', status: 'pass' },
  { name: 'Volume delivered', spec: '500 t ±2%', measured: '499.4 t', status: 'pass' },
  { name: 'Delivery temperature', spec: '-20°C ±3°C', measured: '-19.2°C', status: 'pass' },
  { name: 'Delivery pressure', spec: '18.5 bar ±0.5', measured: '18.4 bar', status: 'pass' },
];

export default function QualityVerification() {
  const { navigate } = useApp();
  const [accepted, setAccepted] = useState(false);

  if (accepted) {
    return (
      <div className="min-h-screen bg-[#F4F7F2]">
        <Nav />
        <div className="max-w-xl mx-auto px-6 py-24 text-center">
          <div className="w-16 h-16 bg-[#DDE9DE] rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-[#2F6B4F]"><Check size={24}/></span>
          </div>
          <h2 className="text-xl font-semibold text-[#1F2B23] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Delivery Accepted</h2>
          <p className="text-[#607267] text-sm mb-2">All quality parameters verified. CO₂ Digital Passport has been issued.</p>
          <p className="text-[#607267] text-sm mb-6">Payment funds will be released to Kutch Industrial Materials Pvt. Ltd. within 2 business days.</p>
          <div className="flex justify-center gap-3">
            <Btn onClick={() => navigate('digital-passport')}>View CO₂ Passport →</Btn>
            <Btn variant="outline" onClick={() => navigate('impact-mrv')}>Impact report →</Btn>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7F2]">
      <Nav />
      <div className="max-w-screen-xl mx-auto px-6 py-8">
        <SectionHeader
          title="Quality Verification"
          sub="Batch CC-B-2026-09-0847 · Order CC-O-9012 · Delivered Sep 21, 2026"
          action={
            <div className="flex gap-2">
              <Btn variant="outline" onClick={() => setAccepted(false)}>Request quality review</Btn>
              <Btn onClick={() => setAccepted(true)} className="inline-flex items-center gap-2">Accept delivery <Check size={14}/></Btn>
            </div>
          }
        />

        {/* Overall result */}
        <div className="bg-[#E4ECE4] border border-[#9FB7A3] rounded p-5 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#3D7658] rounded-full flex items-center justify-center text-white"><Check size={20}/></div>
            <div>
              <div className="text-sm font-semibold text-[#294133]">All quality checks passed</div>
              <div className="text-xs text-[#2F6B4F]">12 of 12 parameters within specification · Verified by ACVA / accredited verifier (demo) on Sep 21, 2026</div>
            </div>
          </div>
          <Badge variant="green">QUALITY PASSED</Badge>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            {/* Analysis results */}
            <Card className="overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#1F2B23]">Quality Analysis Results</h3>
                <span className="text-xs text-[#718276]">ACVA / accredited verifier (demo) · Sep 21, 2026 · EN 13279 + ISO 8573</span>
              </div>
              <div className="divide-y divide-zinc-100">
                <div className="px-6 py-2 grid grid-cols-4 gap-4">
                  {['Parameter', 'Specification', 'Measured', 'Result'].map((h, i) => (
                    <div key={i} className="text-xs font-medium text-[#718276]">{h}</div>
                  ))}
                </div>
                {tests.map((t, i) => (
                  <div key={i} className="px-6 py-3 grid grid-cols-4 gap-4 items-center hover:bg-slate-900/50">
                    <div className="text-xs text-[#415547] font-medium">{t.name}</div>
                    <div className="text-xs font-mono text-[#607267]">{t.spec}</div>
                    <div className="text-xs font-mono font-semibold text-[#1F2B23]">{t.measured}</div>
                    <div>
                      <span className="inline-flex items-center gap-1 text-xs text-[#2F6B4F] bg-[#E4ECE4] px-2 py-0.5 rounded border border-[#9FB7A3] font-mono"><Check size={12}/>PASS</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Receiver notes */}
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-[#1F2B23] mb-4">Receiver Notes</h3>
              <textarea
                defaultValue="Delivery arrived on schedule. Tank TK-4921 in good condition. Product meets all specifications. Cryogenic offloading completed without incident. Ready for utilization in concrete batching."
                className="w-full px-3 py-2 text-sm border border-slate-600 rounded bg-[#FFFFFF] text-[#415547] focus:outline-none focus:border-[#2F6B4F] transition-colors h-24 resize-none"
              />
              <div className="mt-3 flex gap-3">
                <Btn variant="outline" onClick={() => setAccepted(false)}>
                  Request quality review
                </Btn>
                <Btn onClick={() => setAccepted(true)}>
                  <span className="inline-flex items-center gap-2">Accept delivery & release payment <Check size={14}/></span>
                </Btn>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="p-5">
              <div className="text-xs font-semibold text-[#607267] uppercase tracking-widest mb-3">Batch Details</div>
              <div className="space-y-2.5 text-xs">
                {[
                  { k: 'Batch ID', v: 'CC-B-2026-09-0847' },
                  { k: 'Order ID', v: 'CC-O-9012' },
                  { k: 'Product', v: 'Industrial Grade CO₂' },
                  { k: 'Net delivered', v: '499.4 tonnes' },
                  { k: 'CO₂ purity', v: '99.63% vol' },
                  { k: 'Delivery date', v: 'Sep 21, 2026' },
                  { k: 'Analysis lab', v: 'ACVA / accredited verifier (demo)' },
                  { k: 'Standard', v: 'EN 13279' },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between border-b border-slate-800 pb-1.5 last:border-0">
                    <span className="text-[#607267]">{row.k}</span>
                    <span className="font-mono text-[#1F2B23]">{row.v}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <div className="text-xs font-semibold text-[#607267] uppercase tracking-widest mb-3">On Acceptance</div>
              <div className="space-y-2 text-xs text-[#607267] leading-relaxed">
                <div>• CO₂ Digital Passport is issued on the platform</div>
                <div>• Payment funds released to seller (2 business days)</div>
                <div>• Batch record locked for MRV reporting</div>
                <div>• Impact metrics updated in your dashboard</div>
              </div>
              <button
                onClick={() => navigate('digital-passport')}
                className="mt-3 text-xs text-[#2F6B4F] hover:underline"
              >
                Preview CO₂ Digital Passport →
              </button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
