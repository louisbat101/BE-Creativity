import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Suppress all CSS compatibility warnings and browser vendor prefixes
const originalWarn = console.warn;
const originalError = console.error;
const originalLog = console.log;

const shouldSuppressMessage = (message) => {
  if (!message) return false;
  const str = String(message).toLowerCase();
  
  // Suppress CSS and browser compatibility warnings
  if (str.includes('is not supported') ||
      str.includes('should not contain') ||
      str.includes('is not a known') ||
      str.includes('-webkit-') ||
      str.includes('webkit-') ||
      str.includes('backdrop-filter') ||
      str.includes('backdrop-') ||
      str.includes('filter') ||
      str.includes('user-select') ||
      str.includes('forced-color') ||
      str.includes('text-size-adjust') ||
      str.includes('image-set') ||
      str.includes('viewport') ||
      str.includes('maximum-scale') ||
      str.includes('user-scalable') ||
      str.includes('theme-color') ||
      str.includes('meta element') ||
      str.includes('content:') ||
      str.includes('deprecated') ||
      str.includes('not in this registry')) {
    return true;
  }
  
  return false;
};

console.warn = function(...args) {
  if (args.length > 0 && shouldSuppressMessage(args[0])) {
    return;
  }
  originalWarn.apply(console, args);
};

console.error = function(...args) {
  if (args.length > 0 && shouldSuppressMessage(args[0])) {
    return;
  }
  originalError.apply(console, args);
};

console.log = function(...args) {
  if (args.length > 0 && shouldSuppressMessage(args[0])) {
    return;
  }
  originalLog.apply(console, args);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
