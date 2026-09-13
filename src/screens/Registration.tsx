import { useState } from 'react';
import { Check } from 'lucide-react';
import { useApp } from '../context';
import { Btn, Input, Select, FormRow, Badge } from '../components/ui';

const steps = [
  { id: 1, label: 'Organization' },
  { id: 2, label: 'Contact' },
  { id: 3, label: 'KYB / KYC' },
  { id: 4, label: 'Review' },
];

export default function Registration() {
  const { navigate, role } = useApp();
  const [step, setStep] = useState(1);
  const [kybUploaded, setKybUploaded] = useState(false);

  function next() {
    if (step < 4) setStep(s => s + 1);
    else navigate('login');
  }

  return (
    <div className="min-h-screen bg-[#F4F7F2]">
      <header className="border-b border-slate-700/70 bg-[#FFFFFF]">
        <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-white px-2 py-1.5 shadow-sm">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L13 4V10L7 13L1 10V4L7 1Z" fill="white" fillOpacity="0.9"/><circle cx="7" cy="7" r="2" fill="white"/></svg>
            </div>
            <img src="/carbon-connect-logo.jpg" alt="CarbonConnect" className="h-9 w-auto max-w-[190px] object-contain" />
          </div>
          <Badge variant="outline">{role === 'seller' ? 'Seller Registration' : 'Buyer Registration'}</Badge>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Step progress */}
        <div className="flex items-center gap-0 mb-10">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors ${
                  step > s.id ? 'bg-[#2F6B4F] border-[#2F6B4F] text-white' :
                  step === s.id ? 'bg-[#FFFFFF] border-[#2F6B4F] text-[#2F6B4F]' :
                  'bg-[#FFFFFF] border-slate-600 text-[#718276]'
                }`}>
                  {step > s.id ? <Check size={14}/> : s.id}
                </div>
                <span className={`text-xs mt-1 ${step >= s.id ? 'text-[#415547]' : 'text-[#718276]'}`}>{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px mx-2 mb-4 ${step > s.id ? 'bg-[#2F6B4F]' : 'bg-slate-700'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-[#FFFFFF] border border-slate-700/70 rounded-lg overflow-hidden">
          {step === 1 && (
            <div>
              <div className="px-8 py-6 border-b border-slate-800">
                <h2 className="text-lg font-semibold text-[#1F2B23]" style={{ fontFamily: 'var(--font-heading)' }}>Organization details</h2>
                <p className="text-sm text-[#607267] mt-0.5">Tell us about your company.</p>
              </div>
              <div className="px-8 py-2">
                <FormRow label="Legal company name" hint="As registered with your national authority">
                  <Input value={role === 'seller' ? 'Kutch Industrial Materials Pvt. Ltd.' : 'Maharashtra Concrete Systems (demo)'} />
                </FormRow>
                <FormRow label="Registration number">
                  <Input value={role === 'seller' ? 'DE811708516' : 'CA-BC-1047823'} />
                </FormRow>
                <FormRow label="Country of incorporation">
                  <Select options={['Gujarat', 'India', 'United States', 'Norway', 'Netherlands', 'United Kingdom']} value={role === 'seller' ? 'Gujarat' : 'India'} />
                </FormRow>
                <FormRow label="Industry sector">
                  <Select
                    options={role === 'seller'
                      ? ['Cement & Construction', 'Steel & Metals', 'Power Generation', 'Oil Refining', 'Chemicals']
                      : ['Concrete Mineralization', 'Food & Beverage', 'Greenhouses', 'Chemicals & Fuels', 'Algae Cultivation']}
                    value={role === 'seller' ? 'Cement & Construction' : 'Concrete Mineralization'}
                  />
                </FormRow>
                <FormRow label="Estimated annual CO₂ volume" hint={role === 'seller' ? 'Total capturable / sellable' : 'Procurement target'}>
                  <div className="flex gap-2">
                    <Input value={role === 'seller' ? '85,000' : '12,000'} className="w-40" />
                    <Select options={['tonnes/year', 'tonnes/month', 'tonnes/day']} />
                  </div>
                </FormRow>
                <FormRow label="Company website">
                  <Input value={role === 'seller' ? 'https://heidelbergmaterials.com' : 'https://carboncure.com'} />
                </FormRow>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="px-8 py-6 border-b border-slate-800">
                <h2 className="text-lg font-semibold text-[#1F2B23]" style={{ fontFamily: 'var(--font-heading)' }}>Primary contact</h2>
                <p className="text-sm text-[#607267] mt-0.5">The authorized representative for this account.</p>
              </div>
              <div className="px-8 py-2">
                <FormRow label="Full name">
                  <Input value={role === 'seller' ? 'Klaus Weber' : 'Dr. Amara Osei-Mensah'} />
                </FormRow>
                <FormRow label="Job title">
                  <Input value={role === 'seller' ? 'CO₂ Sales Manager' : 'Head of Procurement'} />
                </FormRow>
                <FormRow label="Work email">
                  <Input value={role === 'seller' ? 'k.weber@heidelbergmaterials.com' : 'a.osei@carboncure.com'} type="email" />
                </FormRow>
                <FormRow label="Direct phone">
                  <Input value={role === 'seller' ? '+49 6221 481-0' : '+1 902 440 3400'} />
                </FormRow>
                <FormRow label="Password">
                  <Input type="password" placeholder="Min. 12 characters, mixed case + symbol" />
                </FormRow>
                <FormRow label="Confirm password">
                  <Input type="password" placeholder="Repeat password" />
                </FormRow>
                <FormRow label="Two-factor authentication" hint="Required for all accounts">
                  <Select options={['Authenticator app (recommended)', 'SMS / TOTP', 'Hardware key (FIDO2)']} />
                </FormRow>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="px-8 py-6 border-b border-slate-800">
                <h2 className="text-lg font-semibold text-[#1F2B23]" style={{ fontFamily: 'var(--font-heading)' }}>Know Your Business (KYB) &amp; Know Your Customer (KYC)</h2>
                <p className="text-sm text-[#607267] mt-0.5">Required for all participants under EU AML and trade compliance regulations.</p>
              </div>
              <div className="px-8 py-6 space-y-6">
                {[
                  { label: 'Certificate of Incorporation', hint: 'Official document from national business registry', status: 'uploaded' },
                  { label: 'VAT / Tax Registration Certificate', hint: 'Government-issued tax number document', status: 'uploaded' },
                  { label: 'Beneficial Ownership Declaration', hint: 'Identifying all owners with ≥25% stake', status: kybUploaded ? 'uploaded' : 'pending' },
                  { label: 'Director / Officer ID Documents', hint: 'Passport or national ID for listed directors', status: 'uploaded' },
                  { label: 'Bank Account Verification Letter', hint: 'IBAN and bank name on bank letterhead', status: kybUploaded ? 'uploaded' : 'pending' },
                  ...(role === 'seller' ? [{ label: 'Environmental Operating Permit', hint: 'Permit for CO₂ capture / emission operations', status: 'uploaded' }] : []),
                ].map((doc, i) => (
                  <div key={i} className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[#1F2B23]">{doc.label}</div>
                      <div className="text-xs text-[#718276] mt-0.5">{doc.hint}</div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {doc.status === 'uploaded' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-[#2F6B4F] bg-[#E4ECE4] border border-[#9FB7A3] px-2 py-0.5 rounded font-mono"><Check size={12}/>Uploaded</span>
                      ) : (
                        <button
                          onClick={() => setKybUploaded(true)}
                          className="text-xs px-3 py-1.5 border border-slate-600 rounded text-[#607267] hover:border-[#2F6B4F] hover:text-[#2F6B4F] transition-colors"
                        >
                          Upload PDF
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <div className="bg-blue-50 border border-blue-200 rounded p-4 text-xs text-blue-800">
                  <strong>Verification timeline:</strong> Standard KYB review takes 2–5 business days. Enhanced due diligence may apply for volumes exceeding 50,000 t/year. You will receive email notifications at each review stage.
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <div className="px-8 py-6 border-b border-slate-800">
                <h2 className="text-lg font-semibold text-[#1F2B23]" style={{ fontFamily: 'var(--font-heading)' }}>Review &amp; submit</h2>
                <p className="text-sm text-[#607267] mt-0.5">Review your application before submission.</p>
              </div>
              <div className="px-8 py-6 space-y-6">
                {[
                  { section: 'Organization', items: [
                    { k: 'Name', v: role === 'seller' ? 'Kutch Industrial Materials Pvt. Ltd.' : 'Maharashtra Concrete Systems (demo)' },
                    { k: 'Registration', v: role === 'seller' ? 'DE811708516' : 'CA-BC-1047823' },
                    { k: 'Country', v: role === 'seller' ? 'Gujarat' : 'India' },
                    { k: 'Sector', v: role === 'seller' ? 'Cement & Construction' : 'Concrete Mineralization' },
                  ]},
                  { section: 'Contact', items: [
                    { k: 'Name', v: role === 'seller' ? 'Klaus Weber' : 'Dr. Amara Osei-Mensah' },
                    { k: 'Email', v: role === 'seller' ? 'k.weber@heidelbergmaterials.com' : 'a.osei@carboncure.com' },
                    { k: 'MFA', v: 'Authenticator app' },
                  ]},
                  { section: 'KYB / KYC', items: [
                    { k: 'Documents submitted', v: role === 'seller' ? '6 of 6' : '5 of 5' },
                    { k: 'Beneficial ownership', v: 'Declared' },
                    { k: 'Review status', v: 'Pending verification (2–5 days)' },
                  ]},
                ].map((section, i) => (
                  <div key={i}>
                    <div className="text-xs font-semibold text-[#718276] uppercase tracking-widest mb-3">{section.section}</div>
                    <div className="border border-slate-700/70 rounded overflow-hidden">
                      {section.items.map((item, j) => (
                        <div key={j} className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 last:border-0 text-sm">
                          <span className="text-[#607267]">{item.k}</span>
                          <span className="text-[#1F2B23] font-medium">{item.v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="flex items-start gap-2">
                  <input type="checkbox" id="agree" className="mt-0.5 rounded border-slate-600" defaultChecked />
                  <label htmlFor="agree" className="text-xs text-[#607267]">
                    I confirm all information is accurate and authorize Carbon-Connect to conduct verification checks in accordance with the{' '}
                    <button type="button" onClick={() => navigate('terms')} className="text-[#2F6B4F] hover:underline">Platform Terms</button> and{' '}
                    <button type="button" onClick={() => navigate('privacy')} className="text-[#2F6B4F] hover:underline">Privacy Policy</button>.
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="px-8 py-5 border-t border-slate-800 bg-slate-900/50 flex items-center justify-between">
            <button
              onClick={() => step > 1 ? setStep(s => s - 1) : navigate('role-selection')}
              className="text-sm text-[#607267] hover:text-[#1F2B23]"
            >
              ← {step > 1 ? 'Back' : 'Change role'}
            </button>
            <Btn onClick={next}>
              {step === 4 ? 'Submit application' : 'Continue'} →
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
