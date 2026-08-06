import { Hono } from 'hono';
import { handle } from 'hono/cloudflare-pages';
import { validateEvent } from '@polar-sh/sdk/webhooks';
import type { PolarEnv } from '../../_lib/polar';

const app = new Hono<{ Bindings: PolarEnv }>();

// Pages has already selected this file for /api/webhook/polar.
app.post('*', async (c) => {
  const body = await c.req.text();
  const webhookId = c.req.header('webhook-id');
  const webhookTimestamp = c.req.header('webhook-timestamp');
  const webhookSignature = c.req.header('webhook-signature');

  if (!webhookId || !webhookTimestamp || !webhookSignature) {
    return c.text('Missing webhook headers', 403);
  }

  try {
    const event = validateEvent(
      body,
      {
        'webhook-id': webhookId,
        'webhook-timestamp': webhookTimestamp,
        'webhook-signature': webhookSignature,
      },
      c.env.POLAR_WEBHOOK_SECRET
    );

    if (event.type === 'order.paid') {
      // TODO: Handle order.paid
    } else if (event.type === 'customer.state_changed') {
      // TODO: Handle customer.state_changed
    }

    return c.json({ received: true });
  } catch (err) {
    return c.text('Invalid signature', 403);
  }
});

export const onRequest = handle(app);
