const node = (tag, options = {}, children = []) => {
  const element = document.createElement(tag);
  for (const [key, value] of Object.entries(options)) {
    if (value === null || value === undefined || value === false) continue;
    if (key === 'className') element.className = value;
    else if (key === 'text') element.textContent = value;
    else if (key.startsWith('on')) element.addEventListener(key.slice(2).toLowerCase(), value);
    else element.setAttribute(key, value);
  }
  for (const child of children) element.append(child);
  return element;
};

const storageKey = config => 'kortex-' + config.id;

const localRecords = config => {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey(config)) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const database = config => new Promise((resolve, reject) => {
  if (!('indexedDB' in globalThis)) return resolve(null);
  const request = indexedDB.open(storageKey(config), 1);
  request.onupgradeneeded = () => {
    if (!request.result.objectStoreNames.contains('records')) {
      request.result.createObjectStore('records', { keyPath: 'id' });
    }
  };
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});

const allRecords = async config => {
  const db = await database(config);
  if (!db) return localRecords(config);
  return new Promise((resolve, reject) => {
    const request = db.transaction('records', 'readonly').objectStore('records').getAll();
    request.onsuccess = () => {
      db.close();
      resolve(request.result);
    };
    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
};
const putRecord = async (config, record) => {
  const db = await database(config);
  if (db) {
    try {
      await new Promise((resolve, reject) => {
        const request = db.transaction('records', 'readwrite').objectStore('records').put(record);
        request.onsuccess = resolve;
        request.onerror = () => reject(request.error);
      });
    } finally {
      db.close();
    }
  } else {
    const records = localRecords(config);
    records.unshift(record);
    localStorage.setItem(storageKey(config), JSON.stringify(records));
  }
};
const removeRecord = async (config, id) => {
  const db = await database(config);
  if (db) {
    try {
      await new Promise((resolve, reject) => {
        const request = db.transaction('records', 'readwrite').objectStore('records').delete(id);
        request.onsuccess = resolve;
        request.onerror = () => reject(request.error);
      });
    } finally {
      db.close();
    }
  } else {
    const records = localRecords(config).filter(record => record.id !== id);
    localStorage.setItem(storageKey(config), JSON.stringify(records));
  }
};
const clearRecords = async config => {
  const db = await database(config);
  if (db) {
    try {
      await new Promise((resolve, reject) => {
        const request = db.transaction('records', 'readwrite').objectStore('records').clear();
        request.onsuccess = resolve;
        request.onerror = () => reject(request.error);
      });
    } finally {
      db.close();
    }
  } else localStorage.removeItem(storageKey(config));
};

const valueFor = input => {
  if (input.type === 'checkbox') return input.checked;
  if (input.type === 'number') {
    const raw = String(input.value).trim();
    if (raw === '') return Number.NaN;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : Number.NaN;
  }
  if (input.type === 'file') return Array.from(input.files || []);
  return input.value.trim();
};

const createField = field => {
  const group = node('label', { className: 'field' });
  group.append(node('span', { className: 'field-label', text: field.label }));
  let input;
  if (field.type === 'select') {
    input = node('select', { name: field.id, required: field.required ? '' : null });
    for (const option of field.options) input.append(node('option', { value: option.value, text: option.label }));
  } else if (field.type === 'textarea') {
    input = node('textarea', { name: field.id, rows: field.rows || '5', placeholder: field.placeholder || '', required: field.required ? '' : null });
  } else {
    input = node('input', {
      name: field.id,
      type: field.type || 'text',
      min: field.min ?? '',
      max: field.max ?? '',
      step: field.step ?? '',
      placeholder: field.placeholder || '',
      required: field.required ? '' : null,
      multiple: field.multiple ? '' : null,
      accept: field.accept || '',
    });
  }
  if (field.default !== undefined) {
    if (field.type === 'checkbox') input.checked = field.default;
    else input.value = field.default;
  }
  input.dataset.field = field.id;
  group.append(input);
  if (field.help) group.append(node('small', { text: field.help }));
  return { group, input };
};

const safeExport = records => records.map(record => ({
  ...record,
  input: Object.fromEntries(Object.entries(record.input).map(([key, value]) => [
    key,
    Array.isArray(value) && value.every(item => item instanceof File) ? value.map(file => ({ name: file.name, size: file.size, type: file.type })) : value,
  ])),
}));

const download = (name, payload) => {
  const link = node('a', { href: URL.createObjectURL(new Blob([payload], { type: 'application/json' })), download: name });
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
};

const renderMetrics = (target, config, result) => {
  target.replaceChildren();
  const metrics = config.summary(result);
  for (const metric of metrics) {
    const card = node('article', { className: 'metric' }, [
      node('span', { text: metric.label }),
      node('strong', { text: String(metric.value) }),
    ]);
    if (metric.detail) card.append(node('small', { text: metric.detail }));
    target.append(card);
  }
};

let activeTimer = null;

const startTimer = (minutes, timerTarget) => {
  if (activeTimer !== null) clearInterval(activeTimer);
  let seconds = Math.max(1, Math.round(minutes * 60));
  timerTarget.hidden = false;
  const tick = () => {
    const remainingMinutes = String(Math.floor(seconds / 60)).padStart(2, '0');
    const remainingSeconds = String(seconds % 60).padStart(2, '0');
    timerTarget.textContent = remainingMinutes + ':' + remainingSeconds;
    if (seconds <= 0) {
      clearInterval(activeTimer);
      activeTimer = null;
      timerTarget.textContent = 'Session complete';
      if ('Notification' in globalThis && Notification.permission === 'granted') new Notification('Kortex Focus', { body: 'Your intentional session is complete.' });
      return;
    }
    seconds -= 1;
  };
  tick();
  activeTimer = setInterval(tick, 1000);
};

const installVoice = (config, inputs, host) => {
  if (!config.voiceField) return;
  const Recognition = globalThis.SpeechRecognition || globalThis.webkitSpeechRecognition;
  const input = inputs.get(config.voiceField);
  const button = node('button', { className: 'secondary compact', type: 'button', text: Recognition ? 'Record voice' : 'Voice unavailable' });
  button.disabled = !Recognition;
  let recognition = null;
  let listening = false;
  button.addEventListener('click', () => {
    if (listening && recognition) {
      recognition.stop();
      return;
    }
    recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.onresult = event => {
      input.value = Array.from(event.results).map(result => result[0].transcript).join(' ');
    };
    recognition.onerror = event => host.textContent = 'Voice capture stopped: ' + event.error;
    recognition.onend = () => {
      listening = false;
      recognition = null;
      button.textContent = 'Record voice';
    };
    try {
      recognition.start();
      listening = true;
      button.textContent = 'Listening... tap to stop';
    } catch {
      listening = false;
      recognition = null;
      button.textContent = 'Record voice';
      host.textContent = 'Voice capture could not start. Try again.';
    }
  });
  input.closest('.field').append(button);
};

const renderRecords = async (config, target, resultTarget) => {
  const records = (await allRecords(config)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  target.replaceChildren();
  if (!records.length) {
    target.append(node('p', { className: 'empty', text: 'Nothing saved yet. Your first entry will stay on this device.' }));
    return;
  }
  for (const record of records) {
    const card = node('article', { className: 'record' });
    const heading = node('div', { className: 'record-heading' }, [
      node('strong', { text: config.recordTitle(record) }),
      node('time', { text: new Date(record.createdAt).toLocaleString() }),
    ]);
    const actions = node('div', { className: 'record-actions' });
    actions.append(node('button', { className: 'secondary compact', type: 'button', text: 'View', onClick: () => {
      renderMetrics(resultTarget, config, record.result);
      resultTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }}));
    actions.append(node('button', { className: 'danger compact', type: 'button', text: 'Delete', onClick: async () => {
      await removeRecord(config, record.id);
      await renderRecords(config, target, resultTarget);
    }}));
    card.append(heading, node('p', { text: config.recordDetail(record) }), actions);
    target.append(card);
  }
};

export async function mountApp(config) {
  document.documentElement.style.setProperty('--accent', config.accent);
  document.title = config.name;
  const root = document.querySelector('#app');
  if (!root) throw new Error('Unable to find the application root.');
  const status = node('p', { className: 'status', text: config.privacy });
  const form = node('form', { className: 'entry-form' });
  const inputs = new Map();
  for (const field of config.fields) {
    const built = createField(field);
    inputs.set(field.id, built.input);
    form.append(built.group);
  }
  const submit = node('button', { type: 'submit', text: config.action });
  form.append(submit);
  const resultTarget = node('div', { className: 'metrics' });
  const timerTarget = node('div', { className: 'timer' });
  timerTarget.hidden = true;
  const recordsTarget = node('div', { className: 'records' });
  const tools = node('div', { className: 'tools' });
  tools.append(
    node('button', { className: 'secondary', type: 'button', text: 'Export my data', onClick: async () => download(config.id + '-export.json', JSON.stringify(safeExport(await allRecords(config)), null, 2)) }),
    node('button', { className: 'danger', type: 'button', text: 'Delete all data', onClick: async () => {
      if (!confirm('Delete every local entry for ' + config.name + '?')) return;
      await clearRecords(config);
      resultTarget.replaceChildren();
      await renderRecords(config, recordsTarget, resultTarget);
    }}),
  );
  root.append(
    node('header', { className: 'hero' }, [
      node('span', { className: 'eyebrow', text: config.eyebrow }),
      node('h1', { text: config.name }),
      node('p', { text: config.subtitle }),
    ]),
    node('main', {}, [
      node('section', { className: 'panel' }, [node('h2', { text: config.formTitle }), status, form]),
      node('section', { className: 'result-panel' }, [node('h2', { text: 'Your result' }), resultTarget, timerTarget]),
      node('section', { className: 'panel' }, [node('h2', { text: 'Saved locally' }), recordsTarget, tools]),
    ]),
    node('footer', { text: 'Kortex local-first software. No account required.' }),
  );
  installVoice(config, inputs, status);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    submit.disabled = true;
    submit.textContent = 'Working...';
    try {
      const values = Object.fromEntries(Array.from(inputs.entries()).map(([id, input]) => [id, valueFor(input)]));
      const result = await config.compute(values);
      const record = {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36),
        createdAt: new Date().toISOString(),
        input: values,
        result,
      };
      await putRecord(config, record);
      renderMetrics(resultTarget, config, result);
      if (config.timerMinutes) {
        const minutes = config.timerMinutes(result);
        const timerButton = node('button', { className: 'secondary', type: 'button', text: 'Start ' + minutes + ' minute session', onClick: async () => {
          if ('Notification' in globalThis && Notification.permission === 'default') await Notification.requestPermission();
          startTimer(minutes, timerTarget);
        }});
        resultTarget.append(timerButton);
      }
      await renderRecords(config, recordsTarget, resultTarget);
      status.textContent = 'Saved privately on this device.';
    } catch (error) {
      status.textContent = error instanceof Error ? error.message : 'Unable to finish this entry.';
    } finally {
      submit.disabled = false;
      submit.textContent = config.action;
    }
  });
  await renderRecords(config, recordsTarget, resultTarget);
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./service-worker.js').catch(() => undefined);
}




