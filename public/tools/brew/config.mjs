export function compute(values) {
  const coffee = Number(values.coffee);
  const water = Number(values.water);
  const seconds = Number(values.seconds);
  const temperature = Number(values.temperature);
  const rating = Number(values.rating);
  const methods = new Set(['Pour over', 'AeroPress', 'French press', 'Espresso']);
  if (![coffee, water, seconds, temperature, rating].every(Number.isFinite)) throw new Error('Enter valid numbers for the brew recipe.');
  if (coffee <= 0 || water <= 0 || seconds <= 0) throw new Error('Coffee, water, and brew time must be greater than zero.');
  if (temperature < 100 || temperature > 212) throw new Error('Choose a water temperature between 100 and 212 degrees F.');
  if (rating < 1 || rating > 10) throw new Error('Choose a rating between 1 and 10.');
  if (!methods.has(values.method)) throw new Error('Choose a supported brew method.');
  const ratio = water / coffee;
  const extractionBand = seconds < 120 ? 'Fast' : seconds > 300 ? 'Slow' : 'Balanced window';
  return {
    method: values.method,
    ratio,
    ratioLabel: '1:' + ratio.toFixed(1),
    extractionBand,
    temperature,
    rating,
    note: values.note || 'No tasting note',
  };
}
export default {
  id: 'kortex-brew',
  name: 'Kortex Brew',
  eyebrow: 'Coffee field journal',
  subtitle: 'A focused, offline brew log that makes repeatable coffee easier without a subscription or cloud account.',
  accent: '#d7a86e',
  privacy: 'Brew recipes and tasting notes remain in this browser.',
  formTitle: 'Log a brew',
  action: 'Save brew',
  fields: [
    { id: 'method', label: 'Method', type: 'select', options: [{ label: 'Pour over', value: 'Pour over' }, { label: 'AeroPress', value: 'AeroPress' }, { label: 'French press', value: 'French press' }, { label: 'Espresso', value: 'Espresso' }] },
    { id: 'coffee', label: 'Coffee grams', type: 'number', min: 1, step: .1, default: 18, required: true },
    { id: 'water', label: 'Water grams', type: 'number', min: 1, step: 1, default: 288, required: true },
    { id: 'seconds', label: 'Brew seconds', type: 'number', min: 1, default: 180, required: true },
    { id: 'temperature', label: 'Water °F', type: 'number', min: 100, max: 212, default: 200, required: true },
    { id: 'rating', label: 'Rating 1-10', type: 'number', min: 1, max: 10, default: 8, required: true },
    { id: 'note', label: 'Taste and adjustment', type: 'textarea', placeholder: 'Sweet, bright, slightly dry...' },
  ],
  compute,
  summary: result => [
    { label: 'Recipe ratio', value: result.ratioLabel },
    { label: 'Flow', value: result.extractionBand },
    { label: 'Temperature', value: result.temperature + '°F' },
    { label: 'Rating', value: result.rating + '/10', detail: result.note },
  ],
  recordTitle: record => record.result.method + ' ' + record.result.ratioLabel,
  recordDetail: record => record.result.note,
};


