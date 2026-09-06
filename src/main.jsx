// Safeguard to ensure window.fetch is reassignable in all browser and iframe environments
(function() {
  try {
    if (typeof window !== 'undefined') {
      var _fetch = window.fetch;
      var desc = Object.getOwnPropertyDescriptor(window, 'fetch');
      if (!desc || !desc.set || desc.writable === false) {
        Object.defineProperty(window, 'fetch', {
          get: function() { return _fetch; },
          set: function(fn) { _fetch = fn; },
          configurable: true,
          enumerable: true
        });
      }
    }
  } catch (_) {}
})();

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
