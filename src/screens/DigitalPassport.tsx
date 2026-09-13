import { useApp } from '../context';
import { AlertTriangle, Check } from 'lucide-react';
import { Card, Badge, Btn, downloadFile } from '../components/ui';
import Nav from '../components/Nav';
import WorkflowProgress from '../components/WorkflowProgress';

export default function DigitalPassport() {
  const { navigate } = useApp();

  return (
    <div className="min-h-screen bg-[#F4F7F2]">
      <Nav />
      <div className="max-w-screen-xl mx-auto px-6 py-8">
        <WorkflowProgress current="digital-passport" />
        <button onClick={() => navigate('quality-verification')} className="text-sm text-[#607267] hover:text-[#1F2B23] mb-6 block">← Back to quality check</button>

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-[#1F2B23] mb-1" style={{ fontFamily: 'var(--font-heading)' }}>CO₂ Digital Passport</h1>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-[#607267]">CC-DP-2026-09-0847</span>
              <Badge variant="green">VERIFIED & LOCKED</Badge>
              <Badge variant="blue">IMMUTABLE RECORD</Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Btn variant="outline" onClick={() => downloadFile('co2-digital-passport-demo.pdf', 'Carbon-Connect CO2 Digital Passport\nCC-DP-2026-09-0847\nDemo data only.', 'application/pdf')}>Download PDF</Btn>
            <Btn variant="outline" onClick={() => downloadFile('co2-digital-passport-demo.json', JSON.stringify({ id:'CC-DP-2026-09-0847', status:'verified-and-locked', demo:true }, null, 2), 'application/json')}>Export JSON</Btn>
            <Btn onClick={() => navigate('impact-mrv')}>View impact report →</Btn>
          </div>
        </div>

        {/* Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded p-4 mb-6 flex items-start gap-3">
          <span className="text-amber-600 shrink-0"><AlertTriangle size={17}/></span>
          <div className="text-xs text-amber-800 leading-relaxed">
            <strong>Physical CO₂ Passport only.</strong> This document records the physical properties, chain of custody, and utilization of CO₂ molecules from the source facility to the utilization site. It is <em>not</em> a carbon credit, voluntary carbon unit (VCU), guarantee of origin (GO), or any financial instrument. Any carbon accounting claims must be verified separately by accredited third parties.
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            {/* Passport card */}
            <Card className="overflow-hidden border-2 border-[#2F6B4F]">
              <div className="bg-[#2F6B4F] px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#FFFFFF]/20 rounded flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 14 14" fill="none"><path d="M7 1L13 4V10L7 13L1 10V4L7 1Z" fill="white" fillOpacity="0.9"/><circle cx="7" cy="7" r="2" fill="white"/></svg>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm" style={{ fontFamily: 'var(--font-heading)' }}>CO₂ Digital Passport</div>
                    <div className="text-[#2F6B4F] text-xs">Carbon-Connect Platform · ISO 14064-3 aligned</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-mono text-sm">CC-DP-2026-09-0847</div>
                  <div className="text-[#2F6B4F] text-xs">Issued Sep 21, 2026 · 14:32 UTC</div>
                </div>
              </div>

              <div className="p-6 grid grid-cols-2 gap-6">
                {/* Origin */}
                <div>
                  <div className="text-xs font-semibold text-[#718276] uppercase tracking-widest mb-3">Origin / Source</div>
                  <div className="space-y-2 text-xs">
                    {[
                      { k: 'Source facility', v: 'Kutch Industrial Materials Pvt. Ltd. — Cement Plant' },
                      { k: 'Location', v: 'Berliner Str. 6, 69120 Mundra, Gujarat' },
                      { k: 'CO₂ source process', v: 'Cement kiln flue gas — post-combustion amine capture' },
                      { k: 'Capture method', v: 'MEA amine scrubbing (Fluor Econamine FG+)' },
                      { k: 'Capture date', v: 'Sep 10–12, 2026' },
                      { k: 'CCTS context (where applicable) Installation', v: 'DE-9-0001234' },
                      { k: 'Indian chain-of-custody documentation ID', v: 'ISCC-DE-0000481-20250401' },
                    ].map((r, i) => (
                      <div key={i} className="flex justify-between border-b border-slate-800 pb-1.5 last:border-0">
                        <span className="text-[#607267]">{r.k}</span>
                        <span className="font-mono text-[#1F2B23] text-right max-w-48">{r.v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Physical properties */}
                <div>
                  <div className="text-xs font-semibold text-[#718276] uppercase tracking-widest mb-3">Physical Properties</div>
                  <div className="space-y-2 text-xs">
                    {[
                      { k: 'CO₂ purity', v: '99.63% vol' },
                      { k: 'Physical state', v: 'Liquid (cryogenic)' },
                      { k: 'Temperature', v: '-20°C' },
                      { k: 'Pressure', v: '18.5 bar(g)' },
                      { k: 'Net quantity', v: '499.4 metric tonnes' },
                      { k: 'H₂O', v: '5.2 ppm' },
                      { k: 'O₂', v: '1.8 ppm' },
                      { k: 'SO₂', v: '<0.05 ppm' },
                      { k: 'NOₓ', v: '0.9 ppm' },
                      { k: 'Total HC', v: '15.2 ppm' },
                    ].map((r, i) => (
                      <div key={i} className="flex justify-between border-b border-slate-800 pb-1.5 last:border-0">
                        <span className="text-[#607267]">{r.k}</span>
                        <span className="font-mono text-[#1F2B23]">{r.v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chain of custody */}
                <div>
                  <div className="text-xs font-semibold text-[#718276] uppercase tracking-widest mb-3">Chain of Custody</div>
                  <div className="space-y-2 text-xs">
                    {[
                      { k: 'Loading date', v: 'Sep 13, 2026 07:00 UTC' },
                      { k: 'Tank ID', v: 'TK-4921 (cryogenic road tanker)' },
                      { k: 'Logistics operator', v: 'Messer Transport GmbH' },
                      { k: 'Vessel', v: 'MV Atlantic Crest' },
                      { k: 'Bill of Lading', v: 'ATL-2026-09-4821' },
                      { k: 'Delivery date', v: 'Sep 21, 2026 14:00 UTC' },
                      { k: 'Seal integrity', v: 'Intact (verified)' },
                    ].map((r, i) => (
                      <div key={i} className="flex justify-between border-b border-slate-800 pb-1.5 last:border-0">
                        <span className="text-[#607267]">{r.k}</span>
                        <span className="font-mono text-[#1F2B23]">{r.v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Utilization */}
                <div>
                  <div className="text-xs font-semibold text-[#718276] uppercase tracking-widest mb-3">Utilization Record</div>
                  <div className="space-y-2 text-xs">
                    {[
                      { k: 'Buyer', v: 'Maharashtra Concrete Systems (demo)' },
                      { k: 'Utilization site', v: 'Mumbai Plant, NS, India' },
                      { k: 'Application', v: 'Ready-mix concrete mineralization' },
                      { k: 'Injection date', v: 'Sep 22–30, 2026 (est.)' },
                      { k: 'CO₂ permanently stored', v: '499.4 t (in concrete matrix)' },
                      { k: 'MRV standard', v: 'ISO 14064-2' },
                      { k: 'Verifier', v: 'Pending — Accredited verifier (demo)' },
                    ].map((r, i) => (
                      <div key={i} className="flex justify-between border-b border-slate-800 pb-1.5 last:border-0">
                        <span className="text-[#607267]">{r.k}</span>
                        <span className="font-mono text-[#1F2B23] text-right max-w-40">{r.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Certifications */}
              <div className="px-6 pb-6">
                <div className="text-xs font-semibold text-[#718276] uppercase tracking-widest mb-3">Certifications Attached</div>
                <div className="flex flex-wrap gap-2">
                  {['ISO 9001:2015', 'ISO 14001:2015', 'Indian chain-of-custody documentation', 'CPCB / SPCB documentation', 'Food-grade specification review', 'EN 13279', 'ACVA / accredited verifier (demo) Analysis'].map(c => (
                    <span key={c} className="text-xs px-2 py-1 bg-slate-800 text-[#415547] rounded border border-slate-700/70 font-mono">{c}</span>
                  ))}
                </div>
              </div>

              {/* Passport footer */}
              <div className="bg-slate-900/50 border-t border-slate-700/70 px-6 py-3 flex items-center justify-between">
                <div className="text-xs text-[#607267] font-mono">
                  Hash: sha256:a7f3c2b1e...9d4f8 · Ledger: Carbon-Connect Immutable Record
                </div>
                <Badge variant="green">VERIFIED & LOCKED</Badge>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="p-5">
              <div className="text-xs font-semibold text-[#607267] uppercase tracking-widest mb-3">Passport Status</div>
              <div className="space-y-2.5">
                {[
                  { l: 'Batch quality verified', done: true },
                  { l: 'Chain of custody confirmed', done: true },
                  { l: 'Passport issued', done: true },
                  { l: 'Utilization recorded', done: false },
                  { l: 'MRV verification (SGS)', done: false },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] border ${s.done ? 'bg-[#2F6B4F] border-[#2F6B4F] text-white' : 'bg-[#FFFFFF] border-slate-600'}`}>
                      {s.done ? <Check size={13}/> : null}
                    </div>
                    <span className={`text-xs ${s.done ? 'text-[#415547]' : 'text-[#718276]'}`}>{s.l}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5 bg-amber-50 border-amber-200">
              <div className="text-xs font-semibold text-amber-900 mb-2">Not a Carbon Credit</div>
              <div className="text-xs text-amber-800 leading-relaxed">
                This passport records physical CO₂ utilization data. It does NOT issue, represent, or transfer carbon credits, VCUs, removal credits, GOs, or any other environmental financial instrument. Carbon credit claims must be separately verified by accredited bodies.
              </div>
            </Card>

            <Btn className="w-full justify-center" onClick={() => navigate('impact-mrv')}>
              View impact & MRV →
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
