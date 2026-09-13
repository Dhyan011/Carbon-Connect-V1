export type Screen =
  | 'landing'
  | 'resources'
  | 'insights'
  | 'login'
  | 'role-selection'
  | 'registration'
  | 'terms'
  | 'privacy'
  | 'compliance'
  | 'profile'
  | 'seller-dashboard'
  | 'create-listing'
  | 'buyer-dashboard'
  | 'buyer-requirement'
  | 'marketplace'
  | 'supplier-details'
  | 'product-detail'
  | 'pricing-breakdown'
  | 'quote-order'
  | 'bid-response'
  | 'bid-review'
  | 'contract'
  | 'payment'
  | 'logistics'
  | 'quality-verification'
  | 'digital-passport'
  | 'impact-mrv'
  | 'admin-dashboard'
  | 'anomaly-monitoring';

export type Role = 'seller' | 'buyer' | 'admin' | null;
export type DocumentStatus = 'Pending' | 'Under Review' | 'Verified' | 'Rejected' | 'Expired';
export type RfqStatus = 'open' | 'bids-received' | 'awarded' | 'closed';
export type BidStatus = 'submitted' | 'shortlisted' | 'awarded' | 'declined';

export interface Rfq {
  id: string;
  title: string;
  buyer: string;
  grade: string;
  quantity: string;
  delivery: string;
  budget: string;
  status: RfqStatus;
  bids: number;
}

export interface Bid {
  id: string;
  rfqId: string;
  supplier: string;
  listing: string;
  quantity: string;
  price: string;
  delivered: string;
  leadTime: string;
  evidence: string;
  status: BidStatus;
}

export interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  status: DocumentStatus;
  size: string;
}

export interface OrganizationProfile {
  legalName: string;
  industry: string;
  address: string;
  state: string;
  city: string;
  gstin: string;
  cin: string;
  representative: string;
  email: string;
  phone: string;
  facilityName: string;
  facilityLocation: string;
  facilityType: string;
  capacity: string;
}

export const demoProfile: OrganizationProfile = {
  legalName: 'Kutch Industrial Materials Pvt. Ltd.',
  industry: 'Cement',
  address: 'Industrial Estate, Kutch district',
  state: 'Gujarat',
  city: 'Mundra',
  gstin: '24AAACK0000A1Z0',
  cin: 'U26940GJ2020PTC000000',
  representative: 'Aarav Mehta',
  email: 'operations@kutch-materials.example',
  phone: '+91 79 4000 0000',
  facilityName: 'Kutch Capture & Conditioning Unit',
  facilityLocation: 'Mundra, Gujarat',
  facilityType: 'Cement kiln capture',
  capacity: '240,000 t CO₂/year (demo)',
};

export const demoDocuments: UploadedDocument[] = [
  { id: 'DOC-001', name: 'Certificate of Analysis.pdf', type: 'Certificate of Analysis', uploadedAt: '13 Sep 2026', status: 'Under Review', size: '1.8 MB' },
  { id: 'DOC-002', name: 'Facility registration.pdf', type: 'Business Registration', uploadedAt: '10 Sep 2026', status: 'Verified', size: '2.4 MB' },
  { id: 'DOC-003', name: 'Quality report — Batch CC-IND-2409.pdf', type: 'Quality Report', uploadedAt: '08 Sep 2026', status: 'Pending', size: '780 KB' },
];

export const demoRfqs: Rfq[] = [
  { id: 'CC-RFQ-2041', title: 'Q4 2026 Concrete Mineralization', buyer: 'Maharashtra Concrete Systems', grade: 'Captured CO₂ ≥95%', quantity: '3,200 t', delivery: 'Oct–Dec 2026 · Mumbai', budget: '₹67–80/t delivered', status: 'bids-received', bids: 2 },
  { id: 'CC-RFQ-2039', title: 'Food Carbonation — Winter Stock', buyer: 'Maharashtra Concrete Systems', grade: 'Food Grade ≥99.9%', quantity: '400 t', delivery: 'Nov 2026 · Mumbai', budget: '₹140–165/t delivered', status: 'open', bids: 0 },
];

export const demoBids: Bid[] = [
  { id: 'CC-BID-7012', rfqId: 'CC-RFQ-2041', supplier: 'Kutch Industrial Materials Pvt. Ltd.', listing: 'CC-L-4820 · Industrial Grade CO₂', quantity: '3,200 t', price: '₹72/t', delivered: '₹78/t', leadTime: '5 business days', evidence: '4 verified documents', status: 'submitted' },
  { id: 'CC-BID-7013', rfqId: 'CC-RFQ-2041', supplier: 'Deccan Metals (demo)', listing: 'CC-L-4815 · Captured CO₂', quantity: '3,200 t', price: '₹69/t', delivered: '₹81/t', leadTime: '8 business days', evidence: '3 verified documents', status: 'submitted' },
];

export const sellerScreens: Screen[] = ['seller-dashboard', 'create-listing', 'bid-response', 'logistics', 'impact-mrv', 'digital-passport', 'compliance', 'profile', 'contract', 'payment', 'quality-verification', 'pricing-breakdown'];
export const buyerScreens: Screen[] = ['buyer-dashboard', 'buyer-requirement', 'marketplace', 'supplier-details', 'product-detail', 'pricing-breakdown', 'quote-order', 'bid-review', 'logistics', 'impact-mrv', 'digital-passport', 'compliance', 'profile', 'contract', 'payment', 'quality-verification'];
export const adminScreens: Screen[] = ['admin-dashboard', 'anomaly-monitoring', 'compliance', 'profile'];
