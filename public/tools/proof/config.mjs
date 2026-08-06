export function compute(values) {
  const files = Array.isArray(values.evidence) ? values.evidence : [];
  const title = String(values.title || '').trim();
  const description = String(values.description || '').trim();
  if (title.length < 3) throw new Error('Enter a recognizable incident title.');
  if (description.length < 10) throw new Error('Describe what happened with enough detail to recognize it later.');
  const occurred = new Date(values.occurredAt);
  if (!Number.isFinite(occurred.getTime())) throw new Error('Enter a valid incident date and time.');
  const readiness = Math.min(100, 25 + Math.min(files.length * 15, 45) + (values.witness ? 15 : 0) + (description.length > 80 ? 15 : 0));
  return {
    title,
    occurredAt: occurred.toISOString(),
    description,
    witness: values.witness,
    evidence: files.map(file => ({ name: file.name, size: file.size, type: file.type })),
    readiness,
  };
}
export default {
  id: 'kortex-proof',
  name: 'Kortex Proof',
  eyebrow: 'Private incident timeline',
  subtitle: 'Create a timestamped, exportable record of property damage, service problems, or household incidents while details are fresh.',
  accent: '#65b5f6',
  privacy: 'Descriptions and evidence files remain in local IndexedDB. This tool does not provide legal or insurance advice.',
  formTitle: 'Create an evidence entry',
  action: 'Save evidence entry',
  fields: [
    { id: 'title', label: 'Incident title', required: true, placeholder: 'Delivery damage to front door' },
    { id: 'occurredAt', label: 'Date and time', type: 'datetime-local', required: true },
    { id: 'description', label: 'What happened', type: 'textarea', rows: 6, required: true },
    { id: 'witness', label: 'Witness or reference', placeholder: 'Name, work order, case number' },
    { id: 'evidence', label: 'Photos or documents', type: 'file', accept: 'image/*,.pdf', multiple: true },
  ],
  compute,
  summary: result => [
    { label: 'Incident', value: result.title },
    { label: 'Record readiness', value: result.readiness + '%' },
    { label: 'Evidence files', value: result.evidence.length },
    { label: 'Reference', value: result.witness || 'None entered' },
  ],
  recordTitle: record => record.result.title,
  recordDetail: record => new Date(record.result.occurredAt).toLocaleString(),
};

