import http from 'node:http';
import { randomUUID } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { issueAccessToken, verifyAccessToken } from './auth.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(ROOT, 'data.json');
const PORT = Number(process.env.API_PORT || 4000);

const seed = {
  organizations: [
    { id: 'org-buyer-demo', name: 'Maharashtra Concrete Systems', role: 'buyer', city: 'Mumbai', state: 'Maharashtra' },
    { id: 'org-seller-demo', name: 'Kutch Industrial Materials Pvt. Ltd.', role: 'seller', city: 'Mundra', state: 'Gujarat' },
    { id: 'org-admin-demo', name: 'Carbon-Connect Platform', role: 'admin', city: 'Ahmedabad', state: 'Gujarat' },
  ],
  users: [
    { id: 'user-buyer-demo', email: 'buyer@carbon-connect.demo', password: 'demo-password', role: 'buyer', organizationId: 'org-buyer-demo' },
    { id: 'user-seller-demo', email: 'seller@carbon-connect.demo', password: 'demo-password', role: 'seller', organizationId: 'org-seller-demo' },
    { id: 'user-admin-demo', email: 'admin@carbon-connect.demo', password: 'demo-password', role: 'admin', organizationId: 'org-admin-demo' },
  ],
  rfqs: [
    { id: 'CC-RFQ-2041', title: 'Q4 2026 Concrete Mineralization', buyer: 'Maharashtra Concrete Systems', buyerOrganizationId: 'org-buyer-demo', grade: 'Captured CO₂ ≥95%', quantity: '3,200 t', delivery: 'Oct–Dec 2026 · Mumbai', budget: '₹67–80/t delivered', status: 'bids-received', bids: 2, createdAt: '2026-09-10T09:00:00.000Z' },
    { id: 'CC-RFQ-2039', title: 'Food Carbonation — Winter Stock', buyer: 'Maharashtra Concrete Systems', buyerOrganizationId: 'org-buyer-demo', grade: 'Food Grade ≥99.9%', quantity: '400 t', delivery: 'Nov 2026 · Mumbai', budget: '₹140–165/t delivered', status: 'open', bids: 0, createdAt: '2026-09-11T09:00:00.000Z' },
  ],
  bids: [
    { id: 'CC-BID-7012', rfqId: 'CC-RFQ-2041', supplier: 'Kutch Industrial Materials Pvt. Ltd.', sellerOrganizationId: 'org-seller-demo', listing: 'CC-L-4820 · Industrial Grade CO₂', quantity: '3,200 t', price: '₹72/t', delivered: '₹78/t', leadTime: '5 business days', evidence: '4 verified documents', status: 'submitted', createdAt: '2026-09-11T11:00:00.000Z' },
    { id: 'CC-BID-7013', rfqId: 'CC-RFQ-2041', supplier: 'Deccan Metals (demo)', sellerOrganizationId: 'org-seller-alt', listing: 'CC-L-4815 · Captured CO₂', quantity: '3,200 t', price: '₹69/t', delivered: '₹81/t', leadTime: '8 business days', evidence: '3 verified documents', status: 'submitted', createdAt: '2026-09-11T12:00:00.000Z' },
  ],
  awards: [],
  audit: [],
};

async function loadDb() {
  try { return JSON.parse(await readFile(DATA_FILE, 'utf8')); } catch { await mkdir(ROOT, { recursive: true }); await saveDb(seed); return structuredClone(seed); }
}
async function saveDb(db) { await writeFile(DATA_FILE, JSON.stringify(db, null, 2)); }
function json(res, status, body) { res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': '*', 'access-control-allow-headers': 'content-type, authorization, idempotency-key', 'access-control-allow-methods': 'GET,POST,PATCH,OPTIONS' }); res.end(JSON.stringify(body)); }
function envelope(data, error = null) { return { data, meta: { requestId: randomUUID(), timestamp: new Date().toISOString() }, error }; }
async function body(req) { let raw = ''; for await (const chunk of req) raw += chunk; return raw ? JSON.parse(raw) : {}; }
function auth(req, db) { const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, ''); const claims = verifyAccessToken(token); return claims ? db.users.find(u => u.id === claims.sub) : null; }
function audit(db, actor, action, entityType, entityId, detail = {}) { db.audit.push({ id: randomUUID(), actorUserId: actor?.id || 'system', actorOrganizationId: actor?.organizationId || null, action, entityType, entityId, detail, createdAt: new Date().toISOString() }); }
function fail(res, status, code, message) { return json(res, status, envelope(null, { code, message })); }

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return json(res, 204, null);
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname === '/health') return json(res, 200, { status: 'ok', service: 'carbon-connect-api', persistence: 'json-file' });
  if (!url.pathname.startsWith('/api/v1/')) return fail(res, 404, 'NOT_FOUND', 'API route not found');
  const db = await loadDb();
  try {
    if (url.pathname === '/api/v1/auth/login' && req.method === 'POST') {
      const input = await body(req); const user = db.users.find(u => u.email === input.email && u.password === input.password && u.role === input.role);
      if (!user) return fail(res, 401, 'INVALID_CREDENTIALS', 'Use the demo credentials for the selected workspace.');
      const token = issueAccessToken(user);
      return json(res, 200, envelope({ token, user: { id: user.id, email: user.email, role: user.role, organizationId: user.organizationId } }));
    }
    const user = auth(req, db);
    if (!user) return fail(res, 401, 'UNAUTHENTICATED', 'A valid session is required.');
    if (url.pathname === '/api/v1/auth/me' && req.method === 'GET') return json(res, 200, envelope({ id: user.id, email: user.email, role: user.role, organizationId: user.organizationId }));
    if (url.pathname === '/api/v1/rfqs' && req.method === 'GET') return json(res, 200, envelope(db.rfqs));
    if (url.pathname === '/api/v1/rfqs' && req.method === 'POST') {
      if (!['buyer', 'admin'].includes(user.role)) return fail(res, 403, 'FORBIDDEN', 'Only buyers can create RFQs.');
      const input = await body(req); if (!input.title || !input.quantity) return fail(res, 400, 'VALIDATION_ERROR', 'Title and quantity are required.');
      const rfq = { id: `CC-RFQ-${Math.floor(3000 + Math.random() * 6000)}`, buyerOrganizationId: user.organizationId, buyer: db.organizations.find(o => o.id === user.organizationId)?.name, status: 'open', bids: 0, createdAt: new Date().toISOString(), ...input };
      db.rfqs.unshift(rfq); audit(db, user, 'rfq.created', 'rfq', rfq.id); await saveDb(db); return json(res, 201, envelope(rfq));
    }
    const rfqMatch = url.pathname.match(/^\/api\/v1\/rfqs\/([^/]+)$/);
    if (rfqMatch && req.method === 'GET') { const rfq = db.rfqs.find(r => r.id === rfqMatch[1]); return rfq ? json(res, 200, envelope(rfq)) : fail(res, 404, 'RFQ_NOT_FOUND', 'RFQ not found.'); }
    const bidsMatch = url.pathname.match(/^\/api\/v1\/rfqs\/([^/]+)\/bids$/);
    if (bidsMatch && req.method === 'GET') { const rfq = db.rfqs.find(r => r.id === bidsMatch[1]); if (!rfq) return fail(res, 404, 'RFQ_NOT_FOUND', 'RFQ not found.'); if (user.role === 'buyer' && rfq.buyerOrganizationId !== user.organizationId) return fail(res, 403, 'FORBIDDEN', 'This RFQ is not owned by your organization.'); return json(res, 200, envelope(db.bids.filter(b => b.rfqId === rfq.id))); }
    if (bidsMatch && req.method === 'POST') {
      if (!['seller', 'admin'].includes(user.role)) return fail(res, 403, 'FORBIDDEN', 'Only sellers can submit bids.');
      const rfq = db.rfqs.find(r => r.id === bidsMatch[1]); if (!rfq || !['open', 'bids-received'].includes(rfq.status)) return fail(res, 409, 'RFQ_NOT_OPEN', 'This RFQ is no longer accepting bids.');
      if (db.bids.some(b => b.rfqId === rfq.id && b.sellerOrganizationId === user.organizationId && ['submitted', 'shortlisted'].includes(b.status))) return fail(res, 409, 'DUPLICATE_BID', 'Your organization already has an active bid for this RFQ.');
      const input = await body(req); if (!input.price || !input.quantity) return fail(res, 400, 'VALIDATION_ERROR', 'Price and quantity are required.');
      const bid = { id: `CC-BID-${Math.floor(7000 + Math.random() * 900)}`, rfqId: rfq.id, sellerOrganizationId: user.organizationId, supplier: db.organizations.find(o => o.id === user.organizationId)?.name, status: 'submitted', createdAt: new Date().toISOString(), evidence: '4 verified documents', ...input };
      db.bids.unshift(bid); rfq.bids = db.bids.filter(b => b.rfqId === rfq.id && b.status !== 'declined').length; rfq.status = 'bids-received'; audit(db, user, 'bid.submitted', 'bid', bid.id); await saveDb(db); return json(res, 201, envelope(bid));
    }
    const awardMatch = url.pathname.match(/^\/api\/v1\/rfqs\/([^/]+)\/award$/);
    if (awardMatch && req.method === 'POST') {
      if (user.role !== 'buyer') return fail(res, 403, 'FORBIDDEN', 'Only the buyer can award a bid.');
      const rfq = db.rfqs.find(r => r.id === awardMatch[1]); if (!rfq || rfq.buyerOrganizationId !== user.organizationId) return fail(res, 403, 'FORBIDDEN', 'This RFQ is not owned by your organization.');
      const input = await body(req); const bid = db.bids.find(b => b.id === input.bidId && b.rfqId === rfq.id); if (!bid) return fail(res, 404, 'BID_NOT_FOUND', 'Bid not found for this RFQ.');
      const existing = db.awards.find(a => a.rfqId === rfq.id); if (existing) return json(res, 200, envelope(existing));
      db.bids.filter(b => b.rfqId === rfq.id).forEach(b => { b.status = b.id === bid.id ? 'awarded' : 'declined'; }); rfq.status = 'awarded'; rfq.awardedBidId = bid.id;
      const award = { id: `CC-AWARD-${Date.now()}`, rfqId: rfq.id, bidId: bid.id, buyerOrganizationId: user.organizationId, sellerOrganizationId: bid.sellerOrganizationId, status: 'active', awardedAt: new Date().toISOString() }; db.awards.push(award); audit(db, user, 'bid.awarded', 'award', award.id, { bidId: bid.id }); await saveDb(db); return json(res, 201, envelope(award));
    }
    return fail(res, 404, 'NOT_FOUND', 'API route not found');
  } catch (error) { console.error(error); return fail(res, 500, 'INTERNAL_ERROR', 'Unexpected server error.'); }
});
server.listen(PORT, '0.0.0.0', () => console.log(`Carbon-Connect API listening on http://0.0.0.0:${PORT}`));
