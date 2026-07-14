type FollowRequest = {
  email?: string;
  app?: string;
  appName?: string;
  company?: string;
  language?: string;
};

type Env = {
  RESEND_API_KEY?: string;
  FOLLOWUP_FROM_EMAIL?: string;
  FOLLOWUP_NOTIFY_EMAIL?: string;
};

const allowedApps = new Set(['contacts', 'captions', 'filters', 'trails']);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (body: Record<string, unknown>, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
});

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character] ?? character));

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  let body: FollowRequest;
  try { body = await request.json() as FollowRequest; } catch { return json({ error: 'Invalid request' }, 400); }

  // Quietly discard obvious bots without revealing the honeypot.
  if (body.company) return json({ ok: true });
  const email = body.email?.trim().toLowerCase() ?? '';
  const app = body.app?.trim() ?? '';
  const appName = body.appName?.trim() || app;
  if (!emailPattern.test(email) || !allowedApps.has(app)) return json({ error: 'Please provide a valid email and app.' }, 400);
  if (!env.RESEND_API_KEY) return json({ error: 'Signup service is not configured.' }, 503);

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.FOLLOWUP_FROM_EMAIL || 'Kortex <updates@usekortex.com>',
      to: [env.FOLLOWUP_NOTIFY_EMAIL || 'garymax10@gmail.com'],
      reply_to: email,
      subject: `New ${appName} interest — Kortex`,
      html: `<h2>New Kortex app interest</h2><p><strong>App:</strong> ${escapeHtml(appName)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Language:</strong> ${escapeHtml(body.language || 'unknown')}</p><p><strong>Source:</strong> usekortex.com</p>`,
    }),
  });

  if (!response.ok) return json({ error: 'Email provider rejected the signup.' }, 502);
  return json({ ok: true });
};