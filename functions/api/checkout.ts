type Offer = 'evidence' | 'plus-monthly' | 'plus-yearly';

type Env = {
  LEMONSQUEEZY_EVIDENCE_CHECKOUT_URL?: string;
  LEMONSQUEEZY_PLUS_MONTHLY_CHECKOUT_URL?: string;
  LEMONSQUEEZY_PLUS_YEARLY_CHECKOUT_URL?: string;
};

const offerUrls: Record<Offer, keyof Env> = {
  evidence: 'LEMONSQUEEZY_EVIDENCE_CHECKOUT_URL',
  'plus-monthly': 'LEMONSQUEEZY_PLUS_MONTHLY_CHECKOUT_URL',
  'plus-yearly': 'LEMONSQUEEZY_PLUS_YEARLY_CHECKOUT_URL',
};

const json = (body: Record<string, unknown>, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
});

const isOffer = (value: string | null): value is Offer => value !== null && value in offerUrls;

const isTrustedCheckout = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && (url.hostname === 'lemonsqueezy.com' || url.hostname.endsWith('.lemonsqueezy.com'));
  } catch {
    return false;
  }
};

export const onRequestGet = ({ request, env }: { request: Request; env: Env }) => {
  const offer = new URL(request.url).searchParams.get('offer');
  if (!isOffer(offer)) return json({ error: 'Unknown Kortex offer.' }, 400);

  const checkoutUrl = env[offerUrls[offer]];
  if (!checkoutUrl || !isTrustedCheckout(checkoutUrl)) {
    return json({ error: 'Secure checkout is being connected. Email us and we will let you know as soon as purchasing opens.' }, 503);
  }

  return Response.redirect(checkoutUrl, 302);
};

