import { useState } from 'react';
import { useApp } from '../context';
import { Card, Badge, Btn, SectionHeader, ScorePill, Table } from '../components/ui';
import Nav from '../components/Nav';

export default function SupplierDetails() {
  const { navigate } = useApp();
  const [messageSent, setMessageSent] = useState(false);
  function downloadProfile() {
    const pdf = `%PDF-1.4\n1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj\n2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj\n3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources<< /Font<< /F1 5 0 R >> >> >>endobj\n4 0 obj<< /Length 190 >>stream\nBT /F1 18 Tf 72 720 Td (Carbon-Connect Supplier Profile) Tj /F1 12 Tf 0 -30 Td (Kutch Industrial Materials Pvt. Ltd.) Tj 0 -20 Td (Illustrative Gujarat cement facility profile.) Tj 0 -20 Td (Demo data only.) Tj ET\nendstream endobj\n5 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>endobj\ntrailer<< /Root 1 0 R >>\n%%EOF`;
    const file = new Blob([pdf], { type: 'application/pdf' });
    const url = URL.createObjectURL(file); const link = document.createElement('a'); link.href = url; link.download = 'carbon-connect-supplier-profile-demo.txt'; link.click(); URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-[#F4F7F2]">
      <Nav />
      <div className="max-w-screen-xl mx-auto px-6 py-8">
        <div className="mb-6">
          <button onClick={() => navigate('marketplace')} className="text-sm text-[#607267] hover:text-[#1F2B23] mb-4 block">← Back to marketplace</button>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-semibold text-[#1F2B23]" style={{ fontFamily: 'var(--font-heading)' }}>Kutch Industrial Materials Pvt. Ltd.</h1>
                <Badge variant="green">VERIFIED SELLER</Badge>
                <Badge variant="blue">CCTS context (where applicable) COMPLIANT</Badge>
              </div>
              <p className="text-[#607267] text-sm">Cement facility — Mundra, Kutch, Gujarat · Illustrative organization profile</p>
            </div>
            <div className="flex gap-2">
              <Btn variant="outline" onClick={() => navigate('marketplace')}>← Back</Btn>
              <Btn onClick={() => navigate('product-detail')}>View CO₂ Listings →</Btn>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            {/* About */}
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-[#1F2B23] mb-3">About the Supplier</h3>
              <p className="text-sm text-[#607267] leading-relaxed mb-4">
                Kutch Industrial Materials Pvt. Ltd. is an illustrative Gujarat cement facility profile. The demo plant captures CO₂ from kiln flue gases, conditions it on-site, stores it in insulated tanks, and dispatches by road tanker within India. Capacity and process details are sample data for the Hackout '26 demonstration.
              </p>
              <p className="text-sm text-[#607267] leading-relaxed">
                The capture facility is shown with CCTS context (where applicable), CPCB / SPCB documentation and ISO 9001 / ISO 14001 management systems for demonstration only. Applicable approvals, permits and verification must be assessed independently before any transaction.
              </p>
              <div className="mt-4 grid grid-cols-4 gap-4 border-t border-slate-800 pt-4">
                {[
                  { label: 'Capture capacity', v: '240,000 t/yr (demo)' },
                  { label: 'CO₂ source', v: 'Cement kiln flue gas' },
                  { label: 'Delivery range', v: 'Up to 800 km' },
                  { label: 'Lead time', v: '5 business days' },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="text-xs text-[#718276]">{s.label}</div>
                    <div className="text-sm font-medium text-[#1F2B23] mt-0.5 font-mono">{s.v}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Active listings */}
            <Card className="overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800">
                <h3 className="text-sm font-semibold text-[#1F2B23]">Active CO₂ Listings</h3>
              </div>
              <Table
                headers={['Listing', 'Grade', 'Purity', 'Volume', 'Ex-works', 'State', 'Action']}
                rows={[
                  ['CC-L-4821', 'Food Grade CO₂', '99.92%', '1,200 t/yr', '₹148/t', 'Liquid (-20°C)', <Btn onClick={() => navigate('product-detail')} className="text-xs py-1 px-2">View →</Btn>],
                  ['CC-L-4820', 'Industrial Grade CO₂', '99.51%', '8,400 t/yr', '₹89/t', 'Liquid (-20°C)', <Btn onClick={() => navigate('product-detail')} className="text-xs py-1 px-2">View →</Btn>],
                  ['CC-L-4815', 'Captured CO₂', '98.10%', '24,000 t/yr', '₹67/t', 'Gas / Liquid', <Btn onClick={() => navigate('product-detail')} className="text-xs py-1 px-2">View →</Btn>],
                ]}
              />
            </Card>

            {/* Transaction history */}
            <Card className="overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800">
                <h3 className="text-sm font-semibold text-[#1F2B23]">Completed Transactions (Platform)</h3>
              </div>
              <Table
                headers={['Order', 'Buyer', 'Volume', 'Grade', 'Delivered', 'Rating']}
                rows={[
                  ['CC-O-8920', 'Maharashtra Concrete Systems (demo)', '400 t', 'Food Grade', 'Aug 2026', '★★★★★'],
                  ['CC-O-8891', 'Maharashtra Concrete Systems (demo)', '2,200 t', 'Captured CO₂', 'Jul 2026', '★★★★☆'],
                  ['CC-O-8847', 'Vertis Greenhouse BV', '1,800 t', 'Industrial Grade', 'Jul 2026', '★★★★★'],
                  ['CC-O-8820', 'Carbon8 Systems Ltd', '800 t', 'Captured CO₂', 'Jun 2026', '★★★★☆'],
                ]}
              />
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Scores */}
            <Card className="p-5">
              <div className="text-xs font-semibold text-[#607267] uppercase tracking-widest mb-4">Supplier Scores</div>
              <div className="space-y-4">
                <ScorePill label="Commercial Score" score={82} />
                <ScorePill label="Climate Score" score={74} />
                <ScorePill label="Compliance Score" score={76} />
                <ScorePill label="Delivery Reliability" score={98} />
                <ScorePill label="Documentation" score={91} />
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-[#718276]">
                Scores based on 24 completed orders, third-party audits, and platform activity.
              </div>
            </Card>

            {/* Certifications */}
            <Card className="p-5">
              <div className="text-xs font-semibold text-[#607267] uppercase tracking-widest mb-3">Certifications</div>
              <div className="space-y-2">
                {[
                  { name: 'ISO 9001:2015', status: 'Valid until Mar 2027' },
                  { name: 'ISO 14001:2015', status: 'Valid until Mar 2027' },
                  { name: 'Indian chain-of-custody documentation', status: 'Valid until Nov 2026' },
                  { name: 'CPCB / SPCB documentation', status: 'Active — DE-9-0001234' },
                  { name: 'Food-grade specification review', status: 'Food grade certified' },
                ].map((c, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-800 last:border-0">
                    <div className="text-xs font-medium text-[#1F2B23]">{c.name}</div>
                    <div className="text-xs text-[#718276]">{c.status}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Actions */}
            <Card className="p-5">
              <div className="space-y-2">
                <Btn onClick={() => navigate('product-detail')} className="w-full justify-center">View CO₂ listings →</Btn>
                <Btn variant="outline" className="w-full justify-center" onClick={() => setMessageSent(true)}>{messageSent ? 'Message request recorded' : 'Send message'}</Btn>
                <Btn variant="outline" className="w-full justify-center" onClick={downloadProfile}>Download profile PDF</Btn>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
