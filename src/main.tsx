import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// Override global fetch to always bypass localtunnel warning
const originalFetch = window.fetch;
window.fetch = async (input, init) => {
  init = init || {};
  init.headers = {
    ...init.headers,
    'Bypass-Tunnel-Reminder': 'true'
  };
  return originalFetch(input, init);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
