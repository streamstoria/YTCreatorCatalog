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

  async getChannel(channelId) {
    try {
      const transaction = await dbConnection.getTransaction([STORES.CHANNELS]);
      const store = transaction.objectStore(STORES.CHANNELS);

      return new Promise((resolve, reject) => {
        const request = store.get(channelId);
        
        request.onsuccess = () => {
          if (request.result) {
            resolve(request.result);
          } else {
            resolve(null); // Channel not found
          }
        };
        
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error getting channel:', error);
      throw error;
    }
  }


  async getAllChannels() {
    try {
      const transaction = await dbConnection.getTransaction([STORES.CHANNELS]);
      const store = transaction.objectStore(STORES.CHANNELS);

      return new Promise((resolve, reject) => {
        const request = store.getAll();
        
        request.onsuccess = () => {
          resolve(request.result || []);
        };
        
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error getting all channels:', error);
      throw error;
    }
  }

  async removeChannel(channelId) {
    try {
      const transaction = await dbConnection.getTransaction([STORES.CHANNELS], 'readwrite');
      const store = transaction.objectStore(STORES.CHANNELS);

      return new Promise((resolve, reject) => {
        const request = store.delete(channelId);
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
        
        // Ensure transaction completes
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      });
    } catch (error) {
      console.error('Error removing channel:', error);
      throw error;
    }
  }
}

export const channelsStore = new ChannelsStore();