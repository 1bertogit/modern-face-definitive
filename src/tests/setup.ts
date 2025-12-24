import '@testing-library/jest-dom';
import * as React from 'react';

// Polyfill for React 19 compatibility with testing-library
// @ts-expect-error - React 19 act() polyfill
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Ensure React is available globally for testing-library
if (typeof globalThis.React === 'undefined') {
  (globalThis as Record<string, unknown>).React = React;
}
