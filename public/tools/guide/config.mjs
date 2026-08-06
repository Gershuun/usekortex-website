const ROUTES = {
  riverwalk: { name: 'Tampa Riverwalk Essentials', miles: 2.6, minutes: 85, stops: ['Curtis Hixon Park', 'Tampa Museum of Art', 'University of Tampa view', 'Water Works Park'] },
  ybor: { name: 'Ybor Story Walk', miles: 1.8, minutes: 75, stops: ['Centennial Park', '7th Avenue', 'José Martí Park', 'Cigar worker landmarks'] },
  gardens: { name: 'Busch Gardens Companion', miles: 2.2, minutes: 120, stops: ['Morocco gateway', 'Serengeti overlook', 'Congo', 'Pantopia'] },
};
export function compute(values) {
  const route = ROUTES[values.route];
  if (!route) throw new Error('Choose an available offline route.');
  if (!['relaxed', 'steady', 'quick'].includes(values.pace)) throw new Error('Choose a supported walking pace.');
  const pace = values.pace === 'relaxed' ? 1.25 : values.pace === 'quick' ? .8 : 1;
  return { ...route, minutes: Math.round(route.minutes * pace), note: values.note || 'No trip note', routeId: values.route };
}
export default {
  id: 'kortex-guide',
  name: 'Kortex Guide',
  eyebrow: 'Tampa, carried offline',
  subtitle: 'Small, dependable self-guided routes designed to remain readable when reception disappears.',
  accent: '#f28f3b',
  privacy: 'The guide uses bundled route content and does not record location history.',
  formTitle: 'Prepare an offline outing',
  action: 'Save route',
  fields: [
    { id: 'route', label: 'Guide', type: 'select', options: [{ label: 'Tampa Riverwalk', value: 'riverwalk' }, { label: 'Ybor City', value: 'ybor' }, { label: 'Busch Gardens companion', value: 'gardens' }] },
    { id: 'pace', label: 'Pace', type: 'select', options: [{ label: 'Relaxed', value: 'relaxed' }, { label: 'Steady', value: 'steady' }, { label: 'Quick', value: 'quick' }] },
    { id: 'note', label: 'Trip note', type: 'textarea', placeholder: 'Parking, accessibility, meeting point...' },
  ],
  compute,
  summary: result => [
    { label: 'Route', value: result.name },
    { label: 'Distance', value: result.miles + ' mi' },
    { label: 'Planned time', value: result.minutes + ' min' },
    { label: 'Offline stops', value: result.stops.length, detail: result.stops.join(' → ') },
  ],
  recordTitle: record => record.result.name,
  recordDetail: record => record.result.stops.join(' → '),
};



