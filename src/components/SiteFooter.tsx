import { Mail, MapPin, Phone } from 'lucide-react';
import { useApp } from '../context';

export default function SiteFooter() {
  const { navigate } = useApp();
  return <footer className="border-t border-[#294133] bg-[#14231B] text-[#D7E4D8]">
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid md:grid-cols-[1.3fr_1fr_1fr_1.1fr] gap-10">
        <div>
          <button onClick={() => navigate('landing')} className="inline-flex rounded-xl bg-white px-3 py-2.5 mb-5 shadow-sm" aria-label="Go to CarbonConnect homepage"><img src="/carbon-connect-logo-transparent.png" alt="CarbonConnect" className="h-10 w-auto max-w-[210px] object-contain" /></button>
          <p className="text-sm leading-relaxed text-[#D7E4D8] max-w-xs">Carbon-Connect is a marketplace layer for discovering, specifying, contracting and moving physical CO₂.</p>
          <p className="text-xs leading-relaxed text-[#B9D0BC] mt-4">Physical CO₂ transactions only. Carbon credits, offsets and certificates are separate instruments.</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white mb-4">Explore</h3>
          <nav className="space-y-3 text-sm text-[#D7E4D8]">
            <a href="/#how" className="block hover:text-white">How it works</a>
            <a href="/#supply" className="block hover:text-white">Supply</a>
            <a href="/#demand" className="block hover:text-white">Demand</a>
            <button onClick={() => navigate('resources')} className="block hover:text-white">Trust Center</button>
            <button onClick={() => navigate('insights')} className="block hover:text-white">Insights & CCTS</button>
          </nav>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white mb-4">Company details</h3>
          <div className="space-y-3 text-sm text-[#D7E4D8]">
            <div className="flex items-start gap-2"><MapPin size={16} className="text-[#B9D0BC] mt-0.5 shrink-0"/><span>Industrial marketplace<br/>Serving suppliers and utilization buyers</span></div>
            <div className="flex items-center gap-2"><span className="text-[#B9D0BC] font-medium">Hours</span><span>Mon–Fri · 09:00–18:00 IST</span></div>
            <div className="flex items-center gap-2"><span className="text-[#B9D0BC] font-medium">Status</span><span>Demo environment</span></div>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white mb-4">Contact for inquiries</h3>
          <div className="space-y-3 text-sm">
            <a href="mailto:pateldhyan011@gmail.com" className="flex items-center gap-2 text-[#D7E4D8] hover:text-white"><Mail size={16} className="text-[#B9D0BC] shrink-0"/> pateldhyan011@gmail.com</a>
            <a href="tel:+9194261417" className="flex items-center gap-2 text-[#D7E4D8] hover:text-white"><Phone size={16} className="text-[#B9D0BC] shrink-0"/> +91 94261417</a>
            <p className="text-xs leading-relaxed text-[#B9D0BC] pt-2">For supplier onboarding, buyer requirements, product questions and platform feedback, please contact our team.</p>
          </div>
        </div>
      </div>
      <div className="border-t border-[#52715A] mt-10 pt-5 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between text-xs text-[#B9D0BC]">
        <span>© 2026 Carbon-Connect. All rights reserved.</span>
        <div className="flex flex-wrap gap-x-5 gap-y-2"><button onClick={() => navigate('terms')} className="hover:text-white">Terms & Conditions</button><button onClick={() => navigate('privacy')} className="hover:text-white">Privacy</button><span>Demo / sample data only</span></div>
      </div>
    </div>
  </footer>;
}
