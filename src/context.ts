import { createContext, useContext } from 'react';
import type { Bid, DocumentStatus, OrganizationProfile, Rfq, Role, Screen, UploadedDocument } from './types';

interface AppContextType {
  screen: Screen;
  navigate: (s: Screen) => void;
  role: Role;
  setRole: (r: Role) => void;
  authenticate: (r: Exclude<Role, null>, email?: string, password?: string) => void;
  authenticated: boolean;
  userId: string | null;
  signOut: () => void;
  complianceAcknowledged: boolean;
  acknowledgeCompliance: () => void;
  profile: OrganizationProfile;
  setProfile: (p: OrganizationProfile) => void;
  documents: UploadedDocument[];
  addDocument: (doc: UploadedDocument) => void;
  removeDocument: (id: string) => void;
  updateDocumentStatus: (id: string, status: DocumentStatus) => void;
  rfqs: Rfq[];
  bids: Bid[];
  submitRfq: (rfq: Rfq) => void;
  submitBid: (bid: Bid) => void;
  awardBid: (bidId: string, rfqId: string) => void;
}

export const AppContext = createContext<AppContextType>({
  screen: 'landing', navigate: () => {}, role: null, setRole: () => {}, authenticate: () => {},
  authenticated: false, userId: null, signOut: () => {}, complianceAcknowledged: false,
  acknowledgeCompliance: () => {}, profile: {} as OrganizationProfile, setProfile: () => {},
  documents: [], addDocument: () => {}, removeDocument: () => {}, updateDocumentStatus: () => {}, rfqs: [], bids: [], submitRfq: () => {}, submitBid: () => {}, awardBid: () => {},
});

export const useApp = () => useContext(AppContext);
