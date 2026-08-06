import { getPolar, type PolarEnv } from '../../_lib/polar';

type ActivationRequest = { licenseKey?: string; deviceName?: string };

const json = (body: Record<string, unknown>, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
});

export const onRequestPost = async ({ request, env }: { request: Request; env: PolarEnv }) => {
  if (Number(request.headers.get('Content-Length') || 0) > 8_192) return json({ error: 'Request is too large.' }, 413);

  let body: ActivationRequest;
  try { body = await request.json() as ActivationRequest; } catch { return json({ error: 'Invalid request.' }, 400); }
  
  const licenseKey = body.licenseKey?.trim() || '';
  const deviceName = body.deviceName?.trim().slice(0, 80) || 'Kortex Web';
  
  if (licenseKey.length < 20 || licenseKey.length > 100) return json({ error: 'Enter the license key from your receipt.' }, 400);

  const polar = getPolar(env);

  try {
    const activation = await polar.customerPortal.licenseKeys.activate({
      key: licenseKey,
      organizationId: env.POLAR_ORGANIZATION_ID,
      label: deviceName,
    });
    
    return json({
      active: true,
      instanceId: activation.id,
      productName: 'Kortex Plus', // Polar doesn't return the product name directly in the activation response usually, or we can fetch it. For now, default to Kortex Plus.
    });
  } catch (err: any) {
    return json({ error: 'This license could not be activated.' }, 400);
  }
};
