// src/store/__tests__/setup.js
import { beforeEach, afterEach, vi } from 'vitest';
import 'fake-indexeddb/auto';
import { dbConnection } from '../db/connection';

// Mock chrome.storage API
global.chrome = {
  storage: {
    local: {
      get: vi.fn(),
      set: vi.fn(),
    },
  },
};

beforeEach(async () => {
  // Reset all mocks
  vi.clearAllMocks();
  
  // Delete all databases before each test
  const databases = await window.indexedDB.databases();
  await Promise.all(
    databases.map(({ name }) => 
      new Promise((resolve) => {
        const request = window.indexedDB.deleteDatabase(name);
        request.onsuccess = () => resolve();
        request.onerror = () => resolve();
      })
    )
  );
});

afterEach(async () => {
  // Close the connection after each test
  await dbConnection.closeConnection();
});