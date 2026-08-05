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

// Global error logging to screen for debugging in WebViews
const errorDiv = document.createElement('div');
errorDiv.style.position = 'fixed';
errorDiv.style.top = '0';
errorDiv.style.left = '0';
errorDiv.style.width = '100%';
errorDiv.style.height = '100%';
errorDiv.style.backgroundColor = 'rgba(30, 30, 46, 0.95)';
errorDiv.style.color = '#ff6b6b';
errorDiv.style.padding = '20px';
errorDiv.style.overflow = 'auto';
errorDiv.style.zIndex = '999999';
errorDiv.style.fontFamily = 'monospace';
errorDiv.style.whiteSpace = 'pre-wrap';
errorDiv.style.display = 'none';

window.addEventListener('error', (event) => {
  errorDiv.style.display = 'block';
  errorDiv.innerHTML = `<h3>Uncaught Runtime Error:</h3><p>${event.message}</p><p>at ${event.filename}:${event.lineno}:${event.colno}</p><pre>${event.error?.stack || ''}</pre>`;
  if (!errorDiv.parentElement) {
    document.body.appendChild(errorDiv);
  }
});

window.addEventListener('unhandledrejection', (event) => {
  errorDiv.style.display = 'block';
  errorDiv.innerHTML = `<h3>Unhandled Promise Rejection:</h3><p>${event.reason?.message || event.reason}</p><pre>${event.reason?.stack || ''}</pre>`;
  if (!errorDiv.parentElement) {
    document.body.appendChild(errorDiv);
  }
});

// Debug log root element contents every 3 seconds
setInterval(() => {
  const root = document.getElementById('root');
  console.log("Root HTML:", root ? root.innerHTML : "root not found");
  console.log("Location pathname:", window.location.pathname, "hash:", window.location.hash);
}, 3000);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
