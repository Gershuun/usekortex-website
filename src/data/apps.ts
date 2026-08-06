export const appCategories = ['organize', 'create', 'explore', 'work', 'games'] as const;

export type AppCategory = (typeof appCategories)[number];
export type ProductKind = 'utility' | 'game';
export type AppStatus = 'testing' | 'closedTest' | 'inDevelopment';
export type AppPreview = 'contacts' | 'captions' | 'filters' | 'trails' | 'identity' | 'bowl' | 'numbers' | 'arcade';

interface AppDefinition {
  id: string;
  name: string;
  icon?: string;
  glyph: string;
  category: AppCategory;
  kind: ProductKind;
  accent: string;
  accentRgb: string;
  status: AppStatus;
  preview: AppPreview;
  isNew?: boolean;
}

const appDefinitions = [
  { id: 'contacts', name: 'Kortex Contacts', icon: '/apps/contacts.png?v=20260729', glyph: 'C', category: 'organize', kind: 'utility', accent: '#5ea1ff', accentRgb: '94, 161, 255', status: 'closedTest', preview: 'contacts' },
  { id: 'captions', name: 'Kortex Captions', icon: '/apps/captions.png?v=20260729', glyph: 'C', category: 'create', kind: 'utility', accent: '#9b78ff', accentRgb: '155, 120, 255', status: 'closedTest', preview: 'captions' },
  { id: 'filters', name: 'Kortex Filters', icon: '/apps/filters.png?v=20260729', glyph: 'F', category: 'create', kind: 'utility', accent: '#d6ff63', accentRgb: '214, 255, 99', status: 'closedTest', preview: 'filters' },
  { id: 'trails', name: 'Kortex Trails', icon: '/apps/trails.png?v=20260729', glyph: 'T', category: 'explore', kind: 'utility', accent: '#63e6b1', accentRgb: '99, 230, 177', status: 'closedTest', preview: 'trails' },
  { id: 'bowl', name: 'Kortex Bowl', icon: '/apps/bowl.png?v=20260729', glyph: 'B', category: 'games', kind: 'game', accent: '#ff9d66', accentRgb: '255, 157, 102', status: 'testing', preview: 'bowl', isNew: true },
  { id: 'numbers', name: 'Kortex Numbers', icon: '/apps/numbers.png?v=20260729', glyph: '10', category: 'games', kind: 'game', accent: '#f4d35e', accentRgb: '244, 211, 94', status: 'testing', preview: 'numbers', isNew: true },
  { id: 'words', name: 'Kortex Words', icon: '/apps/words.png?v=20260729', glyph: 'W', category: 'games', kind: 'game', accent: '#7ee0ff', accentRgb: '126, 224, 255', status: 'testing', preview: 'arcade', isNew: true },
  { id: 'pulse-stack', name: 'Pulse Stack', icon: '/apps/pulse-stack.png?v=20260729', glyph: 'P', category: 'games', kind: 'game', accent: '#ff5f8f', accentRgb: '255, 95, 143', status: 'testing', preview: 'arcade', isNew: true },
  { id: 'orbit-snap', name: 'Orbit Snap', icon: '/apps/orbit-snap.png?v=20260729', glyph: 'O', category: 'games', kind: 'game', accent: '#7697ff', accentRgb: '118, 151, 255', status: 'testing', preview: 'arcade', isNew: true },
  { id: 'ten-dash', name: 'Ten Dash', icon: '/apps/ten-dash.png?v=20260729', glyph: '10', category: 'games', kind: 'game', accent: '#ffb34f', accentRgb: '255, 179, 79', status: 'testing', preview: 'arcade', isNew: true },
  { id: 'echo-grid', name: 'Echo Grid', icon: '/apps/echo-grid.png?v=20260729', glyph: 'E', category: 'games', kind: 'game', accent: '#bd8cff', accentRgb: '189, 140, 255', status: 'testing', preview: 'arcade', isNew: true },
  { id: 'signal-switch', name: 'Signal Switch', icon: '/apps/signal-switch.png?v=20260729', glyph: 'S', category: 'games', kind: 'game', accent: '#55e0b0', accentRgb: '85, 224, 176', status: 'testing', preview: 'arcade', isNew: true },
  { id: 'routes', name: 'Kortex Routes', icon: '/apps/routes.png?v=20260729', glyph: 'R', category: 'work', kind: 'utility', accent: '#ff9b5e', accentRgb: '255, 155, 94', status: 'testing', preview: 'identity' },
  { id: 'haul', name: 'Kortex Haul', icon: '/apps/haul.png?v=20260729', glyph: 'H', category: 'work', kind: 'utility', accent: '#ffc857', accentRgb: '255, 200, 87', status: 'testing', preview: 'identity' },
  { id: 'clock', name: 'Kortex Clock', icon: '/apps/clock.png?v=20260729', glyph: 'C', category: 'work', kind: 'utility', accent: '#55d6e6', accentRgb: '85, 214, 230', status: 'testing', preview: 'identity' },
  { id: 'route-rush', name: 'Route Rush', icon: '/apps/route-rush.png?v=20260729', glyph: 'R', category: 'games', kind: 'game', accent: '#ff5fa2', accentRgb: '255, 95, 162', status: 'testing', preview: 'identity' },
  { id: 'shiftpocalypse', name: 'Shiftpocalypse', icon: '/apps/shiftpocalypse.png?v=20260729', glyph: 'S', category: 'games', kind: 'game', accent: '#ff7a59', accentRgb: '255, 122, 89', status: 'testing', preview: 'identity' },
  { id: 'backstage-ops', name: 'Backstage Ops', icon: '/apps/backstage-ops.png?v=20260729', glyph: 'B', category: 'games', kind: 'game', accent: '#53e0a8', accentRgb: '83, 224, 168', status: 'testing', preview: 'identity' },
  { id: 'critter-sort', name: 'Kortex Critter Sort', icon: '/apps/critter-sort.png?v=20260801', glyph: 'C', category: 'games', kind: 'game', accent: '#c486ff', accentRgb: '196, 134, 255', status: 'closedTest', preview: 'arcade', isNew: true },
  { id: 'perfect-produce', name: 'Perfect Produce', icon: '/apps/perfect-produce.png?v=20260801', glyph: 'P', category: 'organize', kind: 'utility', accent: '#b8f45c', accentRgb: '184, 244, 92', status: 'testing', preview: 'identity', isNew: true },
  { id: 'capybara-grove', name: 'Capybara Grove', icon: '/apps/capybara-grove.png?v=20260802', glyph: 'C', category: 'games', kind: 'game', accent: '#c9845b', accentRgb: '201, 132, 91', status: 'closedTest', preview: 'arcade', isNew: true },
  { id: 'dreamquiet', name: 'DreamQuiet', icon: '/apps/dreamquiet.png?v=20260802', glyph: 'D', category: 'explore', kind: 'utility', accent: '#b9adff', accentRgb: '185, 173, 255', status: 'testing', preview: 'identity', isNew: true },
  { id: 'lesson-nook', name: 'Lesson Nook', icon: '/apps/lesson-nook.png?v=20260802', glyph: 'L', category: 'organize', kind: 'utility', accent: '#f4bd45', accentRgb: '244, 189, 69', status: 'testing', preview: 'identity', isNew: true },
  { id: 'untwist', name: 'Kortex Untwist', icon: '/apps/untwist.png?v=20260802', glyph: 'U', category: 'games', kind: 'game', accent: '#55d6e6', accentRgb: '85, 214, 230', status: 'testing', preview: 'arcade', isNew: true },
] as const satisfies readonly AppDefinition[];

export type KortexAppId = (typeof appDefinitions)[number]['id'];

export interface KortexApp extends Omit<AppDefinition, 'id' | 'status'> {
  id: KortexAppId;
  taglineKey: string;
  descriptionKey: string;
  statusKey: string;
  featureKeys: readonly [string, string, string];
}

export const kortexApps: readonly KortexApp[] = appDefinitions.map(({ status, ...app }) => ({
  ...app,
  taglineKey: `site.apps.${app.id}.tagline`,
  descriptionKey: `site.apps.${app.id}.description`,
  statusKey: `site.status.${status}`,
  featureKeys: [
    `site.apps.${app.id}.feature1`,
    `site.apps.${app.id}.feature2`,
    `site.apps.${app.id}.feature3`,
  ],
}));

const appsById = new Map<KortexAppId, KortexApp>(kortexApps.map((app) => [app.id, app]));

export function isKortexAppId(value: string): value is KortexAppId {
  return appsById.has(value as KortexAppId);
}

export function getKortexApp(id: KortexAppId): KortexApp | undefined {
  return appsById.get(id);
}

const heroOrbitIds: readonly KortexAppId[] = ['contacts', 'filters', 'trails', 'bowl', 'numbers', 'signal-switch'];

export const heroOrbitApps = heroOrbitIds
  .map((id) => appsById.get(id))
  .filter((app): app is KortexApp => app !== undefined);
