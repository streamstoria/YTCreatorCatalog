// src/store/db/connection.js
import { DB_NAME, DB_VERSION } from './config';
import { setupDatabase } from './schema';

class DatabaseConnection {
  constructor() {
    this.db = null;
    this.connectionPromise = null;
  }

  async connect() {
    if (this.db) return this.db;
    if (this.connectionPromise) return this.connectionPromise;

    this.connectionPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        this.connectionPromise = null;
        reject(new Error('Failed to open database'));
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        this.connectionPromise = null;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        setupDatabase(db);
      };
    });

    return this.connectionPromise;
  }

  async getTransaction(storeNames, mode = 'readonly') {
    const db = await this.connect();
    return db.transaction(storeNames, mode);
  }

  async closeConnection() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

// Export singleton instance
export const dbConnection = new DatabaseConnection();