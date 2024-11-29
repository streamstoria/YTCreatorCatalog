// src/store/__tests__/utils.js
import { dbConnection } from '../db/connection';
import { STORES } from '../db/config';

export async function getAllFromStore(storeName) {
  const transaction = await dbConnection.getTransaction([storeName]);
  const store = transaction.objectStore(storeName);
  
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export const mockChannel = {
  channelId: 'test-channel',
  title: 'Test Channel',
  description: 'Test Description',
  subscriberCount: 1000,
  videoCount: 100,
  viewCount: 10000,
  videos: [
    {
      title: 'Test Video',
      url: 'https://youtube.com/watch?v=123',
      views: 1000,
      postedDate: '2023-01-01T00:00:00.000Z'
    }
  ]
};

export const mockTags = ['gaming', 'tutorials', 'tech'];