export function compute(values) {
  const property = String(values.property || '').trim();
  const inspectionDate = String(values.inspectionDate || '');
  const roomsValue = Number(values.rooms);
  const rooms = Math.round(roomsValue);
  const photos = Array.isArray(values.photos) ? values.photos.length : 0;
  const issues = String(values.issues || '').split(/\n+/).map(value => value.trim()).filter(Boolean);
  if (property.length < 2) throw new Error('Enter a property label.');
  const inspectionTime = Date.parse(inspectionDate + 'T12:00:00Z');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(inspectionDate) || !Number.isFinite(inspectionTime) || new Date(inspectionTime).toISOString().slice(0, 10) !== inspectionDate) throw new Error('Enter a valid inspection date.');
  if (!Number.isFinite(roomsValue) || rooms < 1) throw new Error('Enter at least one inspected room or area.');
  const signed = values.signed === true;
  const coverage = Math.min(100, Math.round((Math.min(photos, rooms * 4) / (rooms * 4)) * 70 + (issues.length ? 20 : 0) + (signed ? 10 : 0)));
  return { property, inspectionDate, rooms, photos, issues, signed, coverage };
}
export default {
  id: 'kortex-deposit',
  name: 'Kortex Deposit',
  eyebrow: 'Move-in evidence packet',
  subtitle: 'Organize room-by-room condition notes and photos into a private record before memories and deadlines blur.',
  accent: '#f4d35e',
  privacy: 'Photos are stored in this browser's IndexedDB and are never uploaded. Export before clearing browser data.',
  formTitle: 'Document an inspection',
  action: 'Save inspection',
  fields: [
    { id: 'property', label: 'Property label', required: true, placeholder: 'Apartment 204' },
    { id: 'inspectionDate', label: 'Inspection date', type: 'date', required: true },
    { id: 'rooms', label: 'Areas inspected', type: 'number', min: 1, default: 5, required: true },
    { id: 'photos', label: 'Condition photos', type: 'file', accept: 'image/*', multiple: true, help: 'Use wide and close-up photos. Large files consume device storage.' },
    { id: 'issues', label: 'Existing damage, one item per line', type: 'textarea', placeholder: 'Living room: scratch by window\nKitchen: chipped tile' },
    { id: 'signed', label: 'Landlord form also completed', type: 'checkbox', default: false },
  ],
  compute,
  summary: result => [
    { label: 'Property', value: result.property },
    { label: 'Evidence coverage', value: result.coverage + '%' },
    { label: 'Photos', value: result.photos },
    { label: 'Issues logged', value: result.issues.length, detail: result.issues.join(' • ') || 'No condition issues entered.' },
  ],
  recordTitle: record => record.result.property,
  recordDetail: record => record.result.inspectionDate + ' • ' + record.result.rooms + ' areas',
};




