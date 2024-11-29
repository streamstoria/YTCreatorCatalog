// src/store/channels.js
import { dbConnection } from './db/connection';
import { STORES } from './db/config';

export class ChannelsStore {
  async saveChannel(channelData) {
    if (!channelData.channelId) {
      throw new Error('Cannot save channel: channelId is required');
    }

    try {
      const transaction = await dbConnection.getTransaction([STORES.CHANNELS], 'readwrite');
      const store = transaction.objectStore(STORES.CHANNELS);

      const channelToSave = {
        ...channelData,
        lastUpdated: new Date().toISOString()
      };

      return new Promise((resolve, reject) => {
        const request = store.put(channelToSave);
        
        request.onsuccess = () => resolve(channelData.channelId);
        request.onerror = () => reject(request.error);

        transaction.oncomplete = () => resolve(channelData.channelId);
        transaction.onerror = () => reject(transaction.error);
      });
    } catch (error) {
      console.error('Error saving channel:', error);
      throw error;
    }
  }
}

export const channelsStore = new ChannelsStore();