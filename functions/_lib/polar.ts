import { Polar } from '@polar-sh/sdk';

export interface PolarEnv {
  POLAR_ACCESS_TOKEN: string;
  POLAR_ORGANIZATION_ID: string;
  POLAR_WEBHOOK_SECRET: string;
  POLAR_SERVER: string;
}

let cachedPolar: Polar | null = null;

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
    if (!env.POLAR_ACCESS_TOKEN?.trim()) {
      throw new Error('POLAR_ACCESS_TOKEN is missing.');
    }

    cachedPolar = new Polar({
      accessToken: env.POLAR_ACCESS_TOKEN,
      server: normalizeServer(env.POLAR_SERVER),
    });
  }
  return cachedPolar;
}
