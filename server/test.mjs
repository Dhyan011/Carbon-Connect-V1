import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';

const api = spawn(process.execPath, ['server/index.mjs'], { env: { ...process.env, API_PORT: '4010' }, stdio: 'ignore' });
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
async function call(path, options = {}) { const res = await fetch(`http://127.0.0.1:4010${path}`, options); const json = await res.json(); assert.equal(res.ok, true, `${path}: ${JSON.stringify(json)}`); return json.data; }
try {
  await wait(250);
  const login = await call('/api/v1/auth/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: 'buyer@carbon-connect.demo', password: 'demo-password', role: 'buyer' }) });
  assert.ok(login.token);
  const headers = { 'content-type': 'application/json', authorization: `Bearer ${login.token}` };
  const rfqs = await call('/api/v1/rfqs', { headers }); assert.ok(rfqs.length >= 2);
  const bids = await call('/api/v1/rfqs/CC-RFQ-2041/bids', { headers }); assert.equal(bids.length, 2);
  const award = await call('/api/v1/rfqs/CC-RFQ-2041/award', { method: 'POST', headers, body: JSON.stringify({ bidId: bids[0].id }) }); assert.ok(award.id);
  console.log('API smoke test passed: login, RFQs, bid listing, and idempotent award endpoint are reachable.');
} finally { api.kill('SIGTERM'); }
