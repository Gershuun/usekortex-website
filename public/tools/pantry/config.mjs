export function compute(values) {
  const product = String(values.product || '').trim();
  if (product.length < 2) throw new Error('Enter a food or pet-food product to check.');
  return { product, lot: String(values.lot || '').trim(), checkedAt: new Date().toISOString(), matches: [], source: 'openFDA' };
}
export async function lookup(values, fetcher = fetch) {
  const result = compute(values);
  const phrase = encodeURIComponent('product_description:"' + result.product.replace(/["\\]/g, '') + '"');
  const response = await fetcher('https://api.fda.gov/food/enforcement.json?search=' + phrase + '&limit=8');
  if (response.status === 404) return result;
  if (!response.ok) throw new Error('FDA recall lookup is unavailable. Try again when connected.');
  const data = await response.json();
  result.matches = (data.results || []).map(item => ({
    product: item.product_description,
    classification: item.classification,
    reason: item.reason_for_recall,
    date: item.report_date,
  }));
  return result;
}
export default {
  id: 'kortex-pantry',
  name: 'Kortex Pantry Safety',
  eyebrow: 'Food recall check',
  subtitle: 'Search the official FDA food enforcement feed for pantry and pet-food products, then keep your checks on-device.',
  accent: '#9dd274',
  privacy: 'Only your product search is sent to openFDA. This is a recall aid, not medical advice.',
  formTitle: 'Check the pantry',
  action: 'Search FDA recalls',
  fields: [
    { id: 'product', label: 'Food or pet-food name', required: true, placeholder: 'Peanut butter' },
    { id: 'lot', label: 'Lot, UPC, or date code', placeholder: 'Keep for manual comparison' },
  ],
  compute: values => lookup(values),
  summary: result => [
    { label: 'Checked item', value: result.product },
    { label: 'Official source', value: result.source },
    { label: 'Potential matches', value: result.matches.length },
    { label: 'Reasons', value: result.matches.length ? result.matches.map(item => item.classification + ': ' + item.reason).join(' | ') : 'No matching enforcement reports returned.' },
  ],
  recordTitle: record => record.result.product,
  recordDetail: record => record.result.matches.length + ' potential FDA matches',
};
