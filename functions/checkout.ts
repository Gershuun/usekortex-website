import { Hono } from 'hono';
import { handle } from 'hono/cloudflare-pages';
import { getPolar, type PolarEnv } from './_lib/polar';

const app = new Hono<{ Bindings: PolarEnv }>();

// Pages has already selected this file for /checkout. Match the request
// regardless of whether the adapter exposes the full or mount-relative path.
app.get('*', async (c) => {
  const products = c.req.queries('products');
  if (!products || products.length === 0) {
    return c.text('No products supplied', 400);
  }

  try {
    const polar = getPolar(c.env);
    const checkout = await polar.checkouts.create({ products });
    return c.redirect(checkout.url);
  } catch (err) {
    const error = err instanceof Error
      ? { name: err.name, message: err.message.slice(0, 300) }
      : { name: 'UnknownError', message: 'Non-Error value thrown by Polar.' };
    console.error('[checkout] Polar checkout creation failed', {
      ...error,
      hasAccessToken: Boolean(c.env.POLAR_ACCESS_TOKEN),
      hasServer: Boolean(c.env.POLAR_SERVER),
    });
    return c.json({ error: 'Failed to create checkout' }, 502);
  }
});

export const onRequest = handle(app);
