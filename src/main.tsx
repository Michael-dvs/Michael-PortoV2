// Patch window.fetch and globalThis.fetch to be writable in sandboxed environments
(() => {
  try {
    let currentFetch = globalThis.fetch;
    const windowProto = Object.getPrototypeOf(window);
    const windowDesc = Object.getOwnPropertyDescriptor(window, 'fetch') || 
                       (windowProto ? Object.getOwnPropertyDescriptor(windowProto, 'fetch') : undefined);
    const globalThisDesc = Object.getOwnPropertyDescriptor(globalThis, 'fetch');

    const patchFetch = (target: any, desc: PropertyDescriptor | undefined) => {
      if (!desc || desc.set === undefined) {
        Object.defineProperty(target, 'fetch', {
          get() {
            return currentFetch;
          },
          set(newFetch) {
            currentFetch = newFetch;
          },
          configurable: true,
          enumerable: true
        });
      }
    };

    patchFetch(window, windowDesc);
    patchFetch(globalThis, globalThisDesc);
  } catch (e) {
    console.warn("Failed to polyfill global fetch setter:", e);
  }
})();

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import ProjectDetailPage from './ProjectDetailPage.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/projects/:slug" element={<ProjectDetailPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
