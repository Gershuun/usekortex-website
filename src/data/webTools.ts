export type WebToolGroup = 'everyday' | 'evidence' | 'safety' | 'focus';

export interface WebTool {
  id: string;
  name: string;
  shortName: string;
  href: string;
  icon: string;
  group: WebToolGroup;
  accent: string;
  accentRgb: string;
  taglineKey: string;
  descriptionKey: string;
  premium?: 'evidence';
}

export const webTools = [
  {
    id: 'brew', name: 'Kortex Brew', shortName: 'Brew', href: '/tools/brew/', icon: '/tools/brew/icon.svg', group: 'everyday',
    accent: '#d7a86e', accentRgb: '215, 168, 110', taglineKey: 'site.tools.items.brew.tagline',
    descriptionKey: 'site.tools.items.brew.description',
  },
  {
    id: 'deposit', name: 'Kortex Deposit', shortName: 'Deposit', href: '/tools/deposit/', icon: '/tools/deposit/icon.svg', group: 'evidence',
    accent: '#f4d35e', accentRgb: '244, 211, 94', taglineKey: 'site.tools.items.deposit.tagline',
    descriptionKey: 'site.tools.items.deposit.description', premium: 'evidence',
  },
  {
    id: 'focus', name: 'Kortex Focus', shortName: 'Focus', href: '/tools/focus/', icon: '/tools/focus/icon.svg', group: 'focus',
    accent: '#7de2d1', accentRgb: '125, 226, 209', taglineKey: 'site.tools.items.focus.tagline',
    descriptionKey: 'site.tools.items.focus.description',
  },
  {
    id: 'guide', name: 'Kortex Guide', shortName: 'Guide', href: '/tools/guide/', icon: '/tools/guide/icon.svg', group: 'everyday',
    accent: '#f28f3b', accentRgb: '242, 143, 59', taglineKey: 'site.tools.items.guide.tagline',
    descriptionKey: 'site.tools.items.guide.description',
  },
  {
    id: 'memo', name: 'Kortex Memo', shortName: 'Memo', href: '/tools/memo/', icon: '/tools/memo/icon.svg', group: 'focus',
    accent: '#ffbf69', accentRgb: '255, 191, 105', taglineKey: 'site.tools.items.memo.tagline',
    descriptionKey: 'site.tools.items.memo.description',
  },
  {
    id: 'pantry', name: 'Kortex Pantry Safety', shortName: 'Pantry', href: '/tools/pantry/', icon: '/tools/pantry/icon.svg', group: 'safety',
    accent: '#9dd274', accentRgb: '157, 210, 116', taglineKey: 'site.tools.items.pantry.tagline',
    descriptionKey: 'site.tools.items.pantry.description',
  },
  {
    id: 'proof', name: 'Kortex Proof', shortName: 'Proof', href: '/tools/proof/', icon: '/tools/proof/icon.svg', group: 'evidence',
    accent: '#65b5f6', accentRgb: '101, 181, 246', taglineKey: 'site.tools.items.proof.tagline',
    descriptionKey: 'site.tools.items.proof.description', premium: 'evidence',
  },
  {
    id: 'recall', name: 'Kortex Recall', shortName: 'Recall', href: '/tools/recall/', icon: '/tools/recall/icon.svg', group: 'safety',
    accent: '#ef476f', accentRgb: '239, 71, 111', taglineKey: 'site.tools.items.recall.tagline',
    descriptionKey: 'site.tools.items.recall.description',
  },
  {
    id: 'return', name: 'Kortex Return', shortName: 'Return', href: '/tools/return/', icon: '/tools/return/icon.svg', group: 'evidence',
    accent: '#ff7f6a', accentRgb: '255, 127, 106', taglineKey: 'site.tools.items.return.tagline',
    descriptionKey: 'site.tools.items.return.description', premium: 'evidence',
  },
] as const satisfies readonly WebTool[];
