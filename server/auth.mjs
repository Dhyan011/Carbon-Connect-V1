import { createHmac, timingSafeEqual } from 'node:crypto';
import { config } from './config.mjs';

const secret = config.jwtAccessSecret;
function encode(value) { return Buffer.from(JSON.stringify(value)).toString('base64url'); }
export function issueAccessToken(user) {
  const payload = { sub: user.id, role: user.role, organizationId: user.organizationId, iat: Date.now(), exp: Date.now() + 1000 * 60 * 60 * 8 };
  const body = encode(payload);
  const signature = createHmac('sha256', secret).update(body).digest('base64url');
  return `${body}.${signature}`;
}
export function verifyAccessToken(token) {
  try {
    const [body, signature] = String(token || '').split('.');
    if (!body || !signature) return null;
    const expected = createHmac('sha256', secret).update(body).digest('base64url');
    if (expected.length !== signature.length || !timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) return null;
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    return payload.exp > Date.now() ? payload : null;
  } catch { return null; }
}
