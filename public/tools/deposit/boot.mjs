import config from './config.mjs';
import { mountApp } from './runtime.mjs';

mountApp(config).catch(error => {
  const root = document.querySelector('#app');
  root.textContent = error instanceof Error ? error.message : 'Unable to start Kortex Deposit.';
});

