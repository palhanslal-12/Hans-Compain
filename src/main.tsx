import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

// 1. STRICT APPLICATION-WIDE ANTI-ZOOM CONSTITUTION (Restricted as ordered)
if (typeof window !== 'undefined') {
  // Block multi-touch pinch-to-zoom
  document.addEventListener(
    'touchstart',
    (e: TouchEvent) => {
      if (e.touches && e.touches.length > 1) {
        e.preventDefault();
      }
    },
    { passive: false }
  );

  document.addEventListener(
    'touchmove',
    (e: TouchEvent) => {
      if ((e.touches && e.touches.length > 1) || ((e as any).scale !== undefined && (e as any).scale !== 1)) {
        e.preventDefault();
      }
    },
    { passive: false }
  );

  // Block double-tap to zoom on all elements
  let lastTouchEnd = 0;
  document.addEventListener(
    'touchend',
    (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    },
    { passive: false }
  );

  document.addEventListener(
    'dblclick',
    (e: MouseEvent) => {
      e.preventDefault();
    },
    { passive: false }
  );

  // Block iOS Safari gesture pinch zoom
  ['gesturestart', 'gesturechange', 'gestureend'].forEach((eventName) => {
    document.addEventListener(
      eventName,
      (e: Event) => {
        e.preventDefault();
      },
      { passive: false }
    );
  });

  // Block Laptop trackpad 2-finger pinch & Ctrl + Mouse wheel zoom
  window.addEventListener(
    'wheel',
    (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    },
    { passive: false }
  );

  // Block Ctrl/Cmd + [+, -, =, 0] keyboard zoom
  window.addEventListener(
    'keydown',
    (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0' || e.code === 'NumpadAdd' || e.code === 'NumpadSubtract')
      ) {
        e.preventDefault();
      }
    },
    { passive: false }
  );

  // Prevent visual viewport scale changes on iOS
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', () => {
      if (window.visualViewport && window.visualViewport.scale !== 1) {
        // Attempt to reset zoom level
        const meta = document.querySelector('meta[name="viewport"]');
        if (meta) {
          meta.setAttribute(
            'content',
            'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no, viewport-fit=cover'
          );
        }
      }
    });
  }

  // 2. Production Offline Mode Service Worker Auto-Registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((reg) => {
          reg.update().catch(() => {});
        })
        .catch((err) => {
          console.warn('Offline Service Worker registration failed:', err);
        });
    });
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
