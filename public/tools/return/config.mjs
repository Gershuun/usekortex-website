export function compute(values, now = new Date()) {
  const item = String(values.item || '').trim();
  const retailer = String(values.retailer || '').trim();
  const purchaseDate = String(values.purchaseDate || '');
  const daysValue = Number(values.windowDays);
  const days = Math.round(daysValue);
  const parts = purchaseDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const purchase = parts ? Date.UTC(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3])) : Number.NaN;
  const validPurchaseDate = Number.isFinite(purchase) && new Date(purchase).toISOString().slice(0, 10) === purchaseDate;
  if (item.length < 2 || retailer.length < 2) throw new Error('Enter the item and retailer.');
  if (!validPurchaseDate || !Number.isFinite(daysValue) || days < 1) throw new Error('Enter a valid purchase date and return window.');
  const deadline = purchase + days * 86400000;
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const remaining = Math.round((deadline - today) / 86400000);
  return {
    item,
    retailer,
    deadline: new Date(deadline).toISOString().slice(0, 10),
    remaining,
    status: remaining < 0 ? 'Expired' : remaining <= 3 ? 'Act now' : remaining <= 10 ? 'Soon' : 'On track',
    receipt: Array.isArray(values.receipt) ? values.receipt.map(file => file.name) : [],
  };
}
export default {
  id: 'kortex-return',
  name: 'Kortex Return',
  eyebrow: 'Never miss the window',
  subtitle: 'Track return and warranty deadlines with the receipt attached locally, without granting inbox access.',
  accent: '#ff7f6a',
  privacy: 'Purchase records and receipt files stay in local browser storage.',
  formTitle: 'Track a purchase',
  action: 'Track deadline',
  fields: [
    { id: 'item', label: 'Item', required: true, placeholder: 'Noise-canceling headphones' },
    { id: 'retailer', label: 'Retailer', required: true },
    { id: 'purchaseDate', label: 'Purchase date', type: 'date', required: true },
    { id: 'windowDays', label: 'Return window days', type: 'number', min: 1, default: 30, required: true },
    { id: 'receipt', label: 'Receipt or policy', type: 'file', accept: 'image/*,.pdf', multiple: true },
  ],
  compute,
  summary: result => [
    { label: 'Item', value: result.item },
    { label: 'Deadline', value: result.deadline },
    { label: 'Status', value: result.status, detail: result.remaining >= 0 ? result.remaining + ' days remaining' : Math.abs(result.remaining) + ' days past deadline' },
    { label: 'Evidence files', value: result.receipt.length },
  ],
  recordTitle: record => record.result.item,
  recordDetail: record => record.result.retailer + ' • ' + record.result.status,
};



