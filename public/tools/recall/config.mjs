export function compute(values) {
  const product = String(values.product || '').trim();
  if (product.length < 2) throw new Error('Enter a product name to watch.');
  return { product, brand: String(values.brand || '').trim(), checkedAt: new Date().toISOString(), matches: [], source: 'CPSC' };
}
export async function lookup(values, fetcher = fetch) {
  const result = compute(values);
  const query = encodeURIComponent(result.product);
  const response = await fetcher('https://www.saferproducts.gov/RestWebServices/Recall?format=json&ProductName=' + query);
  if (!response.ok) throw new Error('CPSC recall lookup is unavailable. Your watch item was not saved as checked.');
  const data = await response.json();
  result.matches = (Array.isArray(data) ? data : []).slice(0, 8).map(item => ({
    title: item.Title || item.Description || 'Recall notice',
    date: item.RecallDate || '',
    number: item.RecallNumber || '',
  }));
  return result;
}
export default {
  id: 'kortex-recall',
  name: 'Kortex Recall',
  eyebrow: 'Household safety watch',
  subtitle: 'Check a product against the official U.S. Consumer Product Safety Commission recall feed and keep a local watch list.',
  accent: '#ef476f',
  privacy: 'Only your search words are sent to the public CPSC API. Saved watch items remain local.',
  formTitle: 'Check a product',
  action: 'Check official recalls',
  fields: [
    { id: 'product', label: 'Product name', required: true, placeholder: 'Portable power bank' },
    { id: 'brand', label: 'Brand or model', placeholder: 'Optional narrowing note' },
  ],
  compute: values => lookup(values),
  summary: result => [
    { label: 'Watch item', value: result.product },
    { label: 'Official source', value: result.source },
    { label: 'Potential matches', value: result.matches.length, detail: result.matches.map(item => item.title).join(' • ') || 'No title matches returned. Verify model numbers manually.' },
  ],
  recordTitle: record => record.result.product,
  recordDetail: record => record.result.matches.length + ' potential CPSC matches',
};



