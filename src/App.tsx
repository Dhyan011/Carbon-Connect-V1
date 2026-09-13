import { useEffect, useState } from 'react';
import { AppContext } from './context';
import type { Bid, DocumentStatus, OrganizationProfile, Rfq, Role, Screen, UploadedDocument } from './types';
import { adminScreens, buyerScreens, demoBids, demoDocuments, demoProfile, demoRfqs, sellerScreens } from './types';
import { awardBid as apiAwardBid, createBid as apiCreateBid, createRfq as apiCreateRfq, loadBids, loadRfqs, login as apiLogin, loginWithGoogle as apiLoginWithGoogle, setApiToken } from './lib/api';

import Landing from './screens/Landing';
import Resources from './screens/Resources';
import Insights from './screens/Insights';
import Login from './screens/Login';
import RoleSelection from './screens/RoleSelection';
import Registration from './screens/Registration';
import LegalInfo from './screens/LegalInfo';
import Compliance from './screens/Compliance';
import Profile from './screens/Profile';
import SellerDashboard from './screens/SellerDashboard';
import CreateListing from './screens/CreateListing';
import BuyerDashboard from './screens/BuyerDashboard';
import BuyerRequirement from './screens/BuyerRequirement';
import Marketplace from './screens/Marketplace';
import SupplierDetails from './screens/SupplierDetails';
import ProductDetail from './screens/ProductDetail';
import PricingBreakdown from './screens/PricingBreakdown';
import QuoteOrder from './screens/QuoteOrder';
import Contract from './screens/Contract';
import Payment from './screens/Payment';
import Logistics from './screens/Logistics';
import QualityVerification from './screens/QualityVerification';
import DigitalPassport from './screens/DigitalPassport';
import ImpactMRV from './screens/ImpactMRV';
import AdminDashboard from './screens/AdminDashboard';
import AnomalyMonitoring from './screens/AnomalyMonitoring';
import BidResponse from './screens/BidResponse';
import BidReview from './screens/BidReview';

function homeForRole(role: Role): Screen { return role === 'seller' ? 'seller-dashboard' : role === 'admin' ? 'admin-dashboard' : 'buyer-dashboard'; }
function userStorageKey(userId: string, resource: string) { return `carbon-connect-user:${userId}:${resource}`; }
function readStored<T>(userId: string | null, resource: string, fallback: T): T { if (!userId) return fallback; try { const raw = localStorage.getItem(userStorageKey(userId, resource)); return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; } }

function renderScreen(screen: Screen) {
  switch (screen) {
    case 'landing': return <Landing />; case 'resources': return <Resources />; case 'insights': return <Insights />; case 'login': return <Login />; case 'role-selection': return <RoleSelection />; case 'registration': return <Registration />; case 'terms': return <LegalInfo kind="terms" />; case 'privacy': return <LegalInfo kind="privacy" />;
    case 'compliance': return <Compliance />; case 'profile': return <Profile />; case 'seller-dashboard': return <SellerDashboard />; case 'create-listing': return <CreateListing />;
    case 'buyer-dashboard': return <BuyerDashboard />; case 'buyer-requirement': return <BuyerRequirement />; case 'marketplace': return <Marketplace />; case 'supplier-details': return <SupplierDetails />;
    case 'product-detail': return <ProductDetail />; case 'pricing-breakdown': return <PricingBreakdown />; case 'quote-order': return <QuoteOrder />; case 'contract': return <Contract />;
    case 'payment': return <Payment />; case 'logistics': return <Logistics />; case 'quality-verification': return <QualityVerification />; case 'digital-passport': return <DigitalPassport />; case 'bid-response': return <BidResponse />; case 'bid-review': return <BidReview />;
    case 'impact-mrv': return <ImpactMRV />; case 'admin-dashboard': return <AdminDashboard />; case 'anomaly-monitoring': return <AnomalyMonitoring />;
    default: return <Landing />;
  }
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [role, setRoleState] = useState<Role>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [complianceAcknowledged, setComplianceAcknowledged] = useState(false);
  const [profile, setProfile] = useState<OrganizationProfile>(demoProfile);
  const [documents, setDocuments] = useState<UploadedDocument[]>(demoDocuments);
  const [rfqs, setRfqs] = useState<Rfq[]>(demoRfqs);
  const [bids, setBids] = useState<Bid[]>(demoBids);

  useEffect(() => {
    const saved = localStorage.getItem('carbon-connect-session');
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as { role?: Role; userId?: string; compliance?: boolean };
      const validRole = parsed.role === 'seller' || parsed.role === 'buyer' || parsed.role === 'admin' ? parsed.role : null;
      if (validRole && parsed.userId) { setRoleState(validRole); setUserId(parsed.userId); setAuthenticated(true); setComplianceAcknowledged(parsed.compliance === true); }
      else localStorage.removeItem('carbon-connect-session');
    } catch { localStorage.removeItem('carbon-connect-session'); }
  }, []);

  useEffect(() => {
    if (!userId) return;
    setProfile(readStored(userId, 'profile', demoProfile));
    setDocuments(readStored(userId, 'documents', demoDocuments));
    setRfqs(readStored(userId, 'rfqs', demoRfqs));
    setBids(readStored(userId, 'bids', demoBids));
  }, [userId]);

  useEffect(() => {
    if (!authenticated) return;
    loadRfqs().then(async remoteRfqs => {
      setRfqs(remoteRfqs);
      const bidLists = await Promise.all(remoteRfqs.filter(r => r.bids > 0).map(r => loadBids(r.id).catch(() => [])));
      setBids(bidLists.flat());
    }).catch(() => {});
  }, [authenticated]);

  function setRole(next: Role) { setRoleState(next); }
  async function completeAuthentication(next: Exclude<Role, null>, identity: string) { setRoleState(next); setUserId(identity); setAuthenticated(true); setScreen(homeForRole(next)); localStorage.setItem('carbon-connect-session', JSON.stringify({ userId: identity, role: next, compliance: complianceAcknowledged })); }
  async function authenticate(next: Exclude<Role, null>, email = `${next}@carbon-connect.demo`, password = 'demo-password') { try { const user = await apiLogin(email, password, next); await completeAuthentication(user.role, user.id || email.toLowerCase()); } catch { await completeAuthentication(next, `demo-${next}-${email.toLowerCase()}`); } }
  async function authenticateGoogle(credential: string, next: Exclude<Role, null>) { const user = await apiLoginWithGoogle(credential, next); await completeAuthentication(user.role, user.id); }
  function acknowledgeCompliance() { setComplianceAcknowledged(true); localStorage.setItem('carbon-connect-session', JSON.stringify({ userId, role, compliance: true })); }
  function navigate(next: Screen) {
    const protectedScreen = next !== 'landing' && next !== 'login' && next !== 'role-selection' && next !== 'registration' && next !== 'terms' && next !== 'privacy';
    if (protectedScreen && next !== 'resources' && next !== 'insights' && (!authenticated || !role)) { setScreen('login'); return; }
    if (next === 'registration' && !role) { setScreen('role-selection'); return; }
    if (next === 'marketplace' && role !== 'buyer' && role !== 'admin') { setScreen(role ? homeForRole(role) : 'login'); return; }
    if (role === 'seller' && !sellerScreens.includes(next) && next !== 'landing' && next !== 'resources' && next !== 'insights' && next !== 'login' && next !== 'terms' && next !== 'privacy') { setScreen('seller-dashboard'); return; }
    if (role === 'buyer' && !buyerScreens.includes(next) && next !== 'landing' && next !== 'resources' && next !== 'insights' && next !== 'login' && next !== 'terms' && next !== 'privacy') { setScreen('buyer-dashboard'); return; }
    if (role === 'admin' && !adminScreens.includes(next) && next !== 'landing' && next !== 'resources' && next !== 'insights' && next !== 'login' && next !== 'terms' && next !== 'privacy') { setScreen('admin-dashboard'); return; }
    setScreen(next); window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function signOut() { setApiToken(''); setRoleState(null); setUserId(null); setAuthenticated(false); setComplianceAcknowledged(false); localStorage.removeItem('carbon-connect-session'); setScreen('landing'); }
  function updateProfile(next: OrganizationProfile) { setProfile(next); if (userId) localStorage.setItem(userStorageKey(userId, 'profile'), JSON.stringify(next)); }
  function addDocument(doc: UploadedDocument) { setDocuments(prev => { const next = [doc, ...prev]; if (userId) localStorage.setItem(userStorageKey(userId, 'documents'), JSON.stringify(next)); return next; }); }
  function removeDocument(id: string) { setDocuments(prev => { const next = prev.filter(doc => doc.id !== id); if (userId) localStorage.setItem(userStorageKey(userId, 'documents'), JSON.stringify(next)); return next; }); }
  function updateDocumentStatus(id: string, status: DocumentStatus) { setDocuments(prev => { const next = prev.map(doc => doc.id === id ? { ...doc, status } : doc); if (userId) localStorage.setItem(userStorageKey(userId, 'documents'), JSON.stringify(next)); return next; }); }
  function saveRfqs(next: Rfq[]) { setRfqs(next); if (userId) localStorage.setItem(userStorageKey(userId, 'rfqs'), JSON.stringify(next)); }
  function saveBids(next: Bid[]) { setBids(next); if (userId) localStorage.setItem(userStorageKey(userId, 'bids'), JSON.stringify(next)); }
  function submitRfq(rfq: Rfq) { apiCreateRfq(rfq).then(saved => saveRfqs([saved, ...rfqs.filter(r => r.id !== saved.id)])).catch(() => saveRfqs([rfq, ...rfqs])); }
  function submitBid(bid: Bid) { apiCreateBid(bid.rfqId, bid).then(saved => { saveBids([saved, ...bids.filter(b => b.id !== saved.id)]); saveRfqs(rfqs.map(r => r.id === bid.rfqId ? { ...r, status: 'bids-received', bids: r.bids + 1 } : r)); }).catch(() => { saveBids([bid, ...bids]); saveRfqs(rfqs.map(r => r.id === bid.rfqId ? { ...r, status: 'bids-received', bids: r.bids + 1 } : r)); }); }
  function awardBid(bidId: string, rfqId: string) { apiAwardBid(rfqId, bidId).then(() => { saveBids(bids.map(b => b.rfqId === rfqId ? { ...b, status: b.id === bidId ? 'awarded' : 'declined' } : b)); saveRfqs(rfqs.map(r => r.id === rfqId ? { ...r, status: 'awarded' } : r)); }).catch(() => { saveBids(bids.map(b => b.rfqId === rfqId ? { ...b, status: b.id === bidId ? 'awarded' : 'declined' } : b)); saveRfqs(rfqs.map(r => r.id === rfqId ? { ...r, status: 'awarded' } : r)); }); }

  return <AppContext.Provider value={{ screen, navigate, role, setRole, authenticate, authenticateGoogle, authenticated, userId, signOut, complianceAcknowledged, acknowledgeCompliance, profile, setProfile: updateProfile, documents, addDocument, removeDocument, updateDocumentStatus, rfqs, bids, submitRfq, submitBid, awardBid }}><div className="ambient-scene" aria-hidden="true"><div className="ambient-orb ambient-orb-one"/><div className="ambient-orb ambient-orb-two"/></div><div className="app-layer animate-fade-in-up">{renderScreen(screen)}</div></AppContext.Provider>;
}
