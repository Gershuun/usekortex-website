import { Polar } from '@polar-sh/sdk';

export interface PolarEnv {
  POLAR_ACCESS_TOKEN: string;
  POLAR_ORGANIZATION_ID: string;
  POLAR_WEBHOOK_SECRET: string;
  POLAR_SERVER: string;
}

let cachedPolar: Polar | null = null;

function normalizeAccessToken(value: string | undefined): string {
  return (value || '').replace(/^\uFEFF/, '').trim();
}

function normalizeServer(value: string | undefined): 'production' | 'sandbox' {
  const normalized = (value || '')
    .trim()
    .replace(/^['"]|['"]$/g, '')
    .toLowerCase();

  if (
    normalized === 'sandbox' ||
    normalized === 'https://sandbox-api.polar.sh' ||
    normalized === 'https://sandbox-api.polar.sh/v1'
  ) {
    return 'sandbox';
  }
  if (
    !normalized ||
    normalized === 'production' ||
    normalized === 'https://api.polar.sh' ||
    normalized === 'https://api.polar.sh/v1'
  ) {
    return 'production';
  }
  throw new Error('POLAR_SERVER must be exactly production or sandbox.');
}

export function getPolar(env: PolarEnv): Polar {
  if (!cachedPolar) {
    const accessToken = normalizeAccessToken(env.POLAR_ACCESS_TOKEN);
    if (!accessToken) {
      throw new Error('POLAR_ACCESS_TOKEN is missing.');
    }

    cachedPolar = new Polar({
      accessToken,
      server: normalizeServer(env.POLAR_SERVER),
    });
  }
  return cachedPolar;
}
