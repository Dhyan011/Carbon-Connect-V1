import { useState } from 'react';
import { Check } from 'lucide-react';
import { useApp } from '../context';
import { Card, Badge, Btn, SectionHeader } from '../components/ui';
import Nav from '../components/Nav';

const anomalies = [
  {
    id: 'ANO-089',
    type: 'Pricing Anomaly',
    severity: 'high' as const,
    status: 'open',
    detected: 'Sep 12, 10:14',
    entity: 'Food Grade CO₂ — all listings',
    description: 'Food grade CO₂ spot price increased 42% over 3 hours (13:00–16:00 UTC Sep 12). 7 listings updated simultaneously. Unusual correlation pattern detected.',
    rule: 'PRICE-RULE-04: >20% price change in <6h triggers review',
    risk: 'Potential coordinated pricing. Requires human review.',
    actions: ['Listings flagged for manual review', 'Sellers notified', 'Price change frozen pending review'],
  },
  {
    id: 'ANO-088',
    type: 'Volume Anomaly',
    severity: 'high' as const,
    status: 'open',
    detected: 'Sep 11, 17:42',
    entity: 'Nafta Carbon LLC — Account KZ-00481',
    description: 'Order volume 5.2× the 90-day average placed within 24 hours. Single buyer ordering 42,000 t across 3 sellers — significantly above their stated procurement capacity of 12,000 t/yr.',
    rule: 'VOL-RULE-07: Order volume >3× 90d average triggers enhanced due diligence',
    risk: 'Potential misrepresentation of procurement capacity. Sanctions screening repeat required.',
    actions: ['Orders placed on hold', 'Enhanced AML check initiated', 'Sanctions re-screening queued'],
  },
  {
    id: 'ANO-087',
    type: 'Document Mismatch',
    severity: 'medium' as const,
    status: 'under-review',
    detected: 'Sep 10, 09:31',
    entity: 'Nafta Carbon LLC — KYB submission',
    description: 'Beneficial ownership declaration (UBO) names a director not listed in national business registry extract submitted simultaneously. Discrepancy in UBO name: "Askar Nurmagambetov" vs "Askar Nurmagambetoff" — possible Cyrillic transliteration variant or data error.',
    rule: 'KYB-RULE-12: UBO name mismatch vs registry requires escalation',
    risk: 'Low-to-medium. Likely transliteration variant. Manual comparison recommended.',
    actions: ['KYB approval paused', 'Document clarification requested from applicant'],
  },
  {
    id: 'ANO-086',
    type: 'Delivery Deviation',
    severity: 'low' as const,
    status: 'resolved',
    detected: 'Sep 09, 13:00',
    entity: 'Order CC-O-9008 — Deccan Metals (demo) → CarbonCure',
    description: 'Actual delivery quantity 12.4 t below contracted 1,800 t (0.69%). Within tolerance (±2%) per contract but triggered auto-alert. Seller provided corrected delivery note. Invoice adjusted.',
    rule: 'DEL-RULE-02: Delivery quantity deviation >0.5% logged for audit',
    risk: 'Resolved — within contractual tolerance. No further action required.',
    actions: ['Adjusted invoice accepted', 'Delivery note corrected', 'Case closed'],
  },
];

const rules = [
  { id: 'PRICE-RULE-04', desc: 'Price change >20% in <6h', trigger: 'Automatic review', active: true },
  { id: 'VOL-RULE-07', desc: 'Volume >3× 90-day avg', trigger: 'Enhanced DD + hold', active: true },
  { id: 'KYB-RULE-12', desc: 'UBO mismatch vs registry', trigger: 'KYB pause + escalation', active: true },
  { id: 'DEL-RULE-02', desc: 'Delivery qty deviation >0.5%', trigger: 'Audit log', active: true },
  { id: 'SANC-RULE-01', desc: 'Sanctions match (any list)', trigger: 'Account freeze + review', active: true },
  { id: 'PEP-RULE-03', desc: 'PEP identified in UBO chain', trigger: 'Enhanced DD mandatory', active: true },
];

export default function AnomalyMonitoring() {
  const { navigate } = useApp();
  const [selected, setSelected] = useState<string | null>(null);
  const [actionNote, setActionNote] = useState('');
  const selectedAnomaly = anomalies.find(a => a.id === selected);

  const severityColor = (s: string) => s === 'high' ? 'red' : s === 'medium' ? 'yellow' : 'default';
  const statusColor = (s: string) => s === 'resolved' ? 'green' : s === 'under-review' ? 'yellow' : 'red';

  return (
    <div className="min-h-screen bg-[#F4F7F2]">
      <Nav />
      <div className="max-w-screen-xl mx-auto px-6 py-8">
        <SectionHeader
          title="Anomaly Monitoring"
          sub="Rules-based automated surveillance · 6 active rules · Sep 12, 2026"
          action={
            <div className="flex gap-2">
              <Btn variant="outline" onClick={() => navigate('admin-dashboard')}>← Admin dashboard</Btn>
              <Btn variant="outline">Configure rules</Btn>
            </div>
          }
        />

        {/* Summary row */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'High severity', value: '2', color: 'text-red-600' },
            { label: 'Medium severity', value: '1', color: 'text-amber-600' },
            { label: 'Under review', value: '1', color: 'text-blue-600' },
            { label: 'Resolved (30d)', value: '18', color: 'text-[#2F6B4F]' },
          ].map((s, i) => (
            <Card key={i} className="p-4">
              <div className="text-xs text-[#607267] mb-1">{s.label}</div>
              <div className={`text-2xl font-semibold font-mono ${s.color}`} style={{ fontFamily: 'var(--font-heading)' }}>{s.value}</div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Anomaly list */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-[#607267] uppercase tracking-widest mb-2">Active Anomalies</div>
            {anomalies.map(a => (
              <button
                key={a.id}
                onClick={() => setSelected(a.id === selected ? null : a.id)}
                className={`w-full text-left p-4 rounded border transition-all ${
                  selected === a.id ? 'border-[#2F6B4F] bg-[#E4ECE4]' : 'bg-[#FFFFFF] border-slate-700/70 hover:border-slate-600'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-mono text-[#607267]">{a.id}</span>
                  <Badge variant={severityColor(a.severity) as any}>{a.severity.toUpperCase()}</Badge>
                </div>
                <div className="text-sm font-medium text-[#1F2B23] mb-1">{a.type}</div>
                <div className="text-xs text-[#607267] mb-2">{a.entity}</div>
                <div className="flex items-center justify-between">
                  <Badge variant={statusColor(a.status) as any}>{a.status.toUpperCase().replace('-', ' ')}</Badge>
                  <span className="text-xs text-[#718276] font-mono">{a.detected}</span>
                </div>
              </button>
            ))}

            {/* Detection rules */}
            <div className="mt-6">
              <div className="text-xs font-semibold text-[#607267] uppercase tracking-widest mb-2">Detection Rules</div>
              <Card className="overflow-hidden">
                {rules.map((r, i) => (
                  <div key={i} className="px-4 py-3 flex items-start justify-between border-b border-slate-800 last:border-0">
                    <div>
                      <div className="text-xs font-mono text-[#607267]">{r.id}</div>
                      <div className="text-xs text-[#415547] mt-0.5">{r.desc}</div>
                      <div className="text-xs text-[#718276] mt-0.5">→ {r.trigger}</div>
                    </div>
                    <div className={`w-2 h-2 rounded-full mt-1 ${r.active ? 'bg-[#E4ECE4]0' : 'bg-zinc-300'}`} />
                  </div>
                ))}
              </Card>
            </div>
          </div>

          {/* Detail panel */}
          <div className="col-span-2">
            {!selectedAnomaly ? (
              <Card className="p-10 text-center text-[#718276]">
                <div className="text-lg mb-2">Select an anomaly to review</div>
                <div className="text-sm">Click any anomaly on the left to view details, evidence, and actions.</div>
              </Card>
            ) : (
              <div className="space-y-4">
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-lg font-semibold text-[#1F2B23]" style={{ fontFamily: 'var(--font-heading)' }}>{selectedAnomaly.type}</h2>
                        <Badge variant={severityColor(selectedAnomaly.severity) as any}>{selectedAnomaly.severity.toUpperCase()}</Badge>
                      </div>
                      <div className="text-sm text-[#607267]">{selectedAnomaly.entity}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono text-[#718276]">{selectedAnomaly.id}</div>
                      <div className="text-xs text-[#718276] mt-0.5">{selectedAnomaly.detected}</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-xs font-semibold text-[#718276] uppercase tracking-widest mb-2">Description</div>
                      <p className="text-sm text-[#415547] leading-relaxed">{selectedAnomaly.description}</p>
                    </div>

                    <div className="bg-slate-900/50 border border-slate-700/70 rounded p-3">
                      <div className="text-xs font-semibold text-[#607267] mb-1">Triggered Rule</div>
                      <div className="text-xs font-mono text-[#1F2B23]">{selectedAnomaly.rule}</div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded p-3">
                      <div className="text-xs font-semibold text-amber-800 mb-1">Risk Assessment</div>
                      <div className="text-xs text-amber-800">{selectedAnomaly.risk}</div>
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-[#718276] uppercase tracking-widest mb-2">Actions Taken</div>
                      <div className="space-y-1.5">
                        {selectedAnomaly.actions.map((action, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-[#415547]">
                            <Check size={13} className="text-[#2F6B4F]"/>{action}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                {selectedAnomaly.status !== 'resolved' && (
                  <Card className="p-5">
                    <div className="text-sm font-semibold text-[#1F2B23] mb-4">Resolution Actions</div>
                    <div className="flex flex-wrap gap-2">
                      <Btn className="text-xs" onClick={() => setActionNote('Case marked resolved in this demo workspace.')}>Mark as resolved</Btn>
                      <Btn variant="outline" className="text-xs" onClick={() => navigate('compliance')}>Escalate to compliance</Btn>
                      <Btn variant="outline" className="text-xs" onClick={() => setActionNote('Additional documentation request queued.')}>Request additional docs</Btn>
                      <Btn variant="danger" className="text-xs" onClick={() => setActionNote('Account freeze request recorded for review.')}>Freeze account</Btn>
                      <Btn variant="ghost" className="text-xs" onClick={() => setActionNote('Added to watchlist in this demo workspace.')}>Add to watchlist</Btn>
                    </div>
                    {actionNote && <div className="mt-3 text-xs text-[#2F6B4F]">{actionNote}</div>}
                    <div className="mt-4">
                      <label className="text-xs text-[#607267] mb-1 block">Investigator notes</label>
                      <textarea
                        placeholder="Add investigation notes..."
                        className="w-full px-3 py-2 text-xs border border-slate-600 rounded bg-[#FFFFFF] focus:outline-none focus:border-[#2F6B4F] transition-colors h-20 resize-none text-[#415547]"
                      />
                    </div>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
