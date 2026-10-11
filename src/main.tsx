import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

// Strictly block 2-finger pinch-to-zoom, iOS gesture zoom, double-tap zoom, and laptop trackpad Ctrl+wheel zoom
if (typeof window !== 'undefined') {
  document.addEventListener(
    'touchstart',
    (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    },
    { passive: false }
  );

  document.addEventListener(
    'touchmove',
    (e: TouchEvent) => {
      if (e.touches.length > 1 || ((e as any).scale !== undefined && (e as any).scale !== 1)) {
        e.preventDefault();
      }
    },
    { passive: false }
  );

  let lastTouchEnd = 0;
  document.addEventListener(
    'touchend',
    (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 280) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    },
    { passive: false }
  );

  // Block Safari / iPadOS gesture pinch zoom
  ['gesturestart', 'gesturechange', 'gestureend'].forEach(eventName => {
    document.addEventListener(
      eventName,
      (e: Event) => {
        e.preventDefault();
      },
      { passive: false }
    );
  });

  // Block Laptop / PC 2-finger trackpad pinch zoom & Ctrl + Mouse Wheel zoom
  window.addEventListener(
    'wheel',
    (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    },
    { passive: false }
  );

  // Block Ctrl/Cmd + (+ / - / =) keyboard zoom
  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '=')) {
      e.preventDefault();
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
