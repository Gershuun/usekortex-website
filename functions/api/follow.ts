import { getKortexApp, isKortexAppId } from '../../src/data/apps';

type FollowRequest = {
  email?: string;
  app?: string;
  company?: string;
  language?: string;
};

type Env = {
  RESEND_API_KEY?: string;
  FOLLOWUP_FROM_EMAIL?: string;
  FOLLOWUP_NOTIFY_EMAIL?: string;
};

type CacheStorageWithDefault = CacheStorage & { default?: Cache };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const productionOrigins = new Set(['https://usekortex.com', 'https://www.usekortex.com']);

const json = (body: Record<string, unknown>, status = 200, headers: Record<string, string> = {}) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers },
});

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character] ?? character));

const digest = async (value: string) => {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return [...new Uint8Array(bytes)].map((item) => item.toString(16).padStart(2, '0')).join('');
};

const edgeCache = () => (globalThis.caches as CacheStorageWithDefault | undefined)?.default;

const cacheRequest = (kind: string, key: string) => new Request(`https://follow-cache.usekortex.internal/${kind}/${key}`);

async function rateLimit(request: Request): Promise<{ allowed: boolean; retryAfter: number }> {
  const cache = edgeCache();
  if (!cache) return { allowed: true, retryAfter: 0 };
  const ip = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() || 'unknown';
  const windowSeconds = 3_600;
  const window = Math.floor(Date.now() / (windowSeconds * 1_000));
  const key = await digest(`${ip}:${window}`);
  const cacheKey = cacheRequest('rate', key);
  const current = await cache.match(cacheKey);
  const count = current ? Number((await current.json() as { count?: number }).count || 0) : 0;
  if (count >= 5) {
    const retryAfter = windowSeconds - Math.floor((Date.now() / 1_000) % windowSeconds);
    return { allowed: false, retryAfter };
  }
  await cache.put(cacheKey, new Response(JSON.stringify({ count: count + 1 }), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': `public, max-age=${windowSeconds}` },
  }));
  return { allowed: true, retryAfter: 0 };
}

async function duplicateSignup(email: string, app: string): Promise<boolean> {
  const cache = edgeCache();
  if (!cache) return false;
  return Boolean(await cache.match(cacheRequest('dedupe', await digest(`${email}:${app}`))));
}

async function rememberSignup(email: string, app: string): Promise<void> {
  const cache = edgeCache();
  if (!cache) return;
  await cache.put(cacheRequest('dedupe', await digest(`${email}:${app}`)), new Response('1', {
    headers: { 'Cache-Control': 'public, max-age=86400' },
  }));
}

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  const requestUrl = new URL(request.url);
  const origin = request.headers.get('Origin');
  const isProduction = requestUrl.hostname === 'usekortex.com' || requestUrl.hostname === 'www.usekortex.com';
  if (isProduction && (!origin || !productionOrigins.has(origin))) return json({ error: 'Origin is not allowed.' }, 403);
  if (Number(request.headers.get('Content-Length') || 0) > 8_192) return json({ error: 'Request is too large.' }, 413);

  const limit = await rateLimit(request);
  if (!limit.allowed) return json({ error: 'Please wait before trying again.' }, 429, { 'Retry-After': String(limit.retryAfter) });

  let body: FollowRequest;
  try { body = await request.json() as FollowRequest; } catch { return json({ error: 'Invalid request' }, 400); }

  if (body.company) return json({ ok: true });
  const email = body.email?.trim().toLowerCase() ?? '';
  const app = body.app?.trim() ?? '';
  const language = body.language?.trim().slice(0, 32) || 'unknown';
  if (email.length > 254 || !emailPattern.test(email) || !isKortexAppId(app)) {
    return json({ error: 'Please provide a valid email and app.' }, 400);
  }
  if (await duplicateSignup(email, app)) return json({ duplicate: true, ok: true });
  if (!env.RESEND_API_KEY) return json({ error: 'Signup service is not configured.' }, 503);
  const appName = getKortexApp(app)?.name ?? app;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.FOLLOWUP_FROM_EMAIL || 'Kortex <updates@usekortex.com>',
      to: [env.FOLLOWUP_NOTIFY_EMAIL || 'garymax10@gmail.com'],
      reply_to: email,
      subject: `New ${appName} interest - Kortex`,
      html: `<h2>New Kortex app interest</h2><p><strong>App:</strong> ${escapeHtml(appName)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Language:</strong> ${escapeHtml(language)}</p><p><strong>Source:</strong> usekortex.com</p>`,
    }),
  });

  if (!response.ok) return json({ error: 'Email provider rejected the signup.' }, 502);
  await rememberSignup(email, app);
  return json({ ok: true });
};
