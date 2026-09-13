import type { Bid, Rfq, Role } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
let token = localStorage.getItem('carbon-connect-api-token') || '';

export function setApiToken(next: string) { token = next; if (next) localStorage.setItem('carbon-connect-api-token', next); else localStorage.removeItem('carbon-connect-api-token'); }
export function getApiToken() { return token; }

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}/api/v1${path}`, { ...options, headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) } });
  const payload = await response.json();
  if (!response.ok || payload.error) throw new Error(payload.error?.message || 'Request failed');
  return payload.data as T;
}

export async function login(email: string, password: string, role: Exclude<Role, null>) {
  const result = await request<{ token: string; user: { id: string; role: Exclude<Role, null> } }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password, role }) });
  setApiToken(result.token); return result.user;
}
export async function loadRfqs() { return request<Rfq[]>('/rfqs'); }
export async function createRfq(input: Partial<Rfq>) { return request<Rfq>('/rfqs', { method: 'POST', body: JSON.stringify(input) }); }
export async function loadBids(rfqId: string) { return request<Bid[]>(`/rfqs/${rfqId}/bids`); }
export async function createBid(rfqId: string, input: Partial<Bid>) { return request<Bid>(`/rfqs/${rfqId}/bids`, { method: 'POST', body: JSON.stringify(input) }); }
export async function awardBid(rfqId: string, bidId: string) { return request<{ id: string }>(`/rfqs/${rfqId}/award`, { method: 'POST', headers: { 'idempotency-key': `award-${rfqId}-${bidId}` }, body: JSON.stringify({ bidId }) }); }
