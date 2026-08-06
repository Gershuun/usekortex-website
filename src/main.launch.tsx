import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AppLaunch from './AppLaunch';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppLaunch />
  </StrictMode>,
);
