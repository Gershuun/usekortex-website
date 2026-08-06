import { getPolar, type PolarEnv } from '../../_lib/polar';

type ValidationRequest = { licenseKey?: string; instanceId?: string };

const json = (body: Record<string, unknown>, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
});

export const onRequestPost = async ({ request, env }: { request: Request; env: PolarEnv }) => {
  let body: ValidationRequest;
  try { body = await request.json() as ValidationRequest; } catch { return json({ error: 'Invalid request.' }, 400); }
  
  const licenseKey = body.licenseKey?.trim() || '';
  
  if (!licenseKey) return json({ error: 'License details are incomplete.' }, 400);

  const polar = getPolar(env);

  try {
    await polar.customerPortal.licenseKeys.validate({
      key: licenseKey,
      organizationId: env.POLAR_ORGANIZATION_ID,
    });
    
    // In Polar, the validation throws or returns the license key info.
    // If it succeeds and validation is not expired, it's valid.
    return json({ active: true, productName: 'Kortex Plus' });
  } catch (err: any) {
    return json({ error: 'This license is no longer active.' }, 403);
  }
};
