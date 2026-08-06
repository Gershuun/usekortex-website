export function compute(values) {
  const text = String(values.memo || '').replace(/\s+/g, ' ').trim();
  if (text.length < 12) throw new Error('Add a little more detail before structuring this memo.');
  if (!['meeting', 'actions', 'journal'].includes(values.format)) throw new Error('Choose a supported output style.');
  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
  const actions = sentences.filter(sentence => /\b(need to|should|must|will|follow up|remember|todo|send|call|book|finish)\b/i.test(sentence));
  const bullets = sentences.slice(0, 8);
  return {
    title: text.split(/[.!?]/)[0].slice(0, 72),
    bullets,
    actions,
    journal: values.format === 'journal' ? text : '',
    wordCount: text.split(/\s+/).length,
  };
}
export default {
  id: 'kortex-memo',
  name: 'Kortex Memo',
  eyebrow: 'Voice to clarity',
  subtitle: 'Capture a thought, meeting, or lecture and turn it into clean notes and action items without sending the text to a server.',
  accent: '#ffbf69',
  privacy: 'Text structuring is deterministic and runs locally. Browser voice capture availability depends on your device.',
  formTitle: 'Capture a memo',
  action: 'Structure this memo',
  voiceField: 'memo',
  fields: [
    { id: 'memo', label: 'Memo or transcript', type: 'textarea', rows: 8, required: true, placeholder: 'Talk or type naturally...' },
    { id: 'format', label: 'Output style', type: 'select', options: [{ label: 'Meeting notes', value: 'meeting' }, { label: 'Action list', value: 'actions' }, { label: 'Journal', value: 'journal' }] },
  ],
  compute,
  summary: result => [
    { label: 'Title', value: result.title },
    { label: 'Key points', value: result.bullets.length, detail: result.bullets.join(' • ') },
    { label: 'Action items', value: result.actions.length, detail: result.actions.join(' • ') || 'No explicit action language found.' },
    { label: 'Words', value: result.wordCount },
  ],
  recordTitle: record => record.result.title,
  recordDetail: record => record.result.bullets[0],
};



