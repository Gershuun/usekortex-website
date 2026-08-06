export function compute(values) {
  const minutes = Math.round(Number(values.minutes));
  if (!Number.isFinite(minutes) || minutes < 1 || minutes > 240) throw new Error('Choose a focus session between 1 and 240 minutes.');
  const intention = String(values.intention || '').trim();
  if (intention.length < 3) throw new Error('Name the one thing this session is for.');
  return {
    intention,
    minutes,
    friction: values.friction,
    intervention: values.friction === 'social' ? 'Take five breaths before opening social media.' : values.friction === 'messages' ? 'Write the message on paper and send it after the session.' : 'Put the distracting device outside arm's reach.',
    endsAt: new Date(Date.now() + minutes * 60000).toISOString(),
  };
}
export default {
  id: 'kortex-focus',
  name: 'Kortex Focus',
  eyebrow: 'Intent before impulse',
  subtitle: 'Start a deliberate focus block, name the distraction, and create one moment of friction before you abandon the work.',
  accent: '#7de2d1',
  privacy: 'Sessions stay local. This PWA does not claim system-level app blocking; a native FamilyControls adapter requires Apple entitlement approval.',
  formTitle: 'Begin one intentional block',
  action: 'Create focus session',
  fields: [
    { id: 'intention', label: 'One task', required: true, placeholder: 'Finish the release checklist' },
    { id: 'minutes', label: 'Minutes', type: 'number', min: 1, max: 240, default: 25, required: true },
    { id: 'friction', label: 'Likely distraction', type: 'select', options: [{ label: 'Social media', value: 'social' }, { label: 'Messages', value: 'messages' }, { label: 'General wandering', value: 'general' }] },
  ],
  compute,
  timerMinutes: result => result.minutes,
  summary: result => [
    { label: 'Single task', value: result.intention },
    { label: 'Focus block', value: result.minutes + ' min' },
    { label: 'Interruption plan', value: result.intervention },
  ],
  recordTitle: record => record.result.intention,
  recordDetail: record => record.result.minutes + ' minute session',
};


