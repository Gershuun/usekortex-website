export type AppCategory = 'organize' | 'create' | 'explore';

export interface KortexApp {
  id: 'contacts' | 'captions' | 'filters' | 'trails';
  name: string;
  icon: string;
  category: AppCategory;
  accent: string;
  accentRgb: string;
  taglineKey: string;
  descriptionKey: string;
  statusKey: string;
  featureKeys: readonly string[];
}

export const kortexApps: readonly KortexApp[] = [
  {
    id: 'contacts',
    name: 'Kortex Contacts',
    icon: '/apps/contacts.png?v=20260714',
    category: 'organize',
    accent: '#5ea1ff',
    accentRgb: '94, 161, 255',
    taglineKey: 'site.apps.contacts.tagline',
    descriptionKey: 'site.apps.contacts.description',
    statusKey: 'site.status.testing',
    featureKeys: ['site.apps.contacts.feature1', 'site.apps.contacts.feature2', 'site.apps.contacts.feature3'],
  },
  {
    id: 'captions',
    name: 'Kortex Captions',
    icon: '/apps/captions.png?v=20260714',
    category: 'create',
    accent: '#9b78ff',
    accentRgb: '155, 120, 255',
    taglineKey: 'site.apps.captions.tagline',
    descriptionKey: 'site.apps.captions.description',
    statusKey: 'site.status.testing',
    featureKeys: ['site.apps.captions.feature1', 'site.apps.captions.feature2', 'site.apps.captions.feature3'],
  },
  {
    id: 'filters',
    name: 'Kortex Filters',
    icon: '/apps/filters.png?v=20260714',
    category: 'create',
    accent: '#d6ff63',
    accentRgb: '214, 255, 99',
    taglineKey: 'site.apps.filters.tagline',
    descriptionKey: 'site.apps.filters.description',
    statusKey: 'site.status.closedTest',
    featureKeys: ['site.apps.filters.feature1', 'site.apps.filters.feature2', 'site.apps.filters.feature3'],
  },
  {
    id: 'trails',
    name: 'Kortex Trails',
    icon: '/apps/trails.png?v=20260714',
    category: 'explore',
    accent: '#63e6b1',
    accentRgb: '99, 230, 177',
    taglineKey: 'site.apps.trails.tagline',
    descriptionKey: 'site.apps.trails.description',
    statusKey: 'site.status.inDevelopment',
    featureKeys: ['site.apps.trails.feature1', 'site.apps.trails.feature2', 'site.apps.trails.feature3'],
  },
];
