import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Automatically cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock localStorage for jotai atomWithStorage
let localStorageData: Record<string, string> = {};
const localStorageMock: Storage = {
  getItem: vi.fn((key: string) => localStorageData[key] ?? null),
  setItem: vi.fn((key: string, value: string) => {
    localStorageData[key] = value;
    (localStorageMock as any).length = Object.keys(localStorageData).length;
  }),
  removeItem: vi.fn((key: string) => {
    delete localStorageData[key];
    (localStorageMock as any).length = Object.keys(localStorageData).length;
  }),
  clear: vi.fn(() => {
    localStorageData = {};
    (localStorageMock as any).length = 0;
  }),
  length: 0,
  key: vi.fn((index: number) => Object.keys(localStorageData)[index] ?? null),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Automatically cleanup after each test
afterEach(() => {
  cleanup();
  localStorageMock.clear();
  vi.clearAllMocks();
});

// Mock matchMedia for Arco Design
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
