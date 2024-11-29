// src/store/tags.js
import { dbConnection } from './db/connection';
import { STORES, INDEXES } from './db/config';

export class TagsStore {
  async saveChannelTags(channelId, tags) {
    if (!Array.isArray(tags)) {
      throw new Error('Tags must be an array');
    }

    try {
      // First get existing tags
      const existingTags = await this.getChannelTags(channelId);
      
      // Start a new transaction for deletion and addition
      const transaction = await dbConnection.getTransaction([STORES.TAGS], 'readwrite');
      const store = transaction.objectStore(STORES.TAGS);
      const channelIdIndex = store.index(INDEXES.TAGS.CHANNEL_ID);

      return new Promise((resolve, reject) => {
        // Get all existing tag records for this channel
        const getRequest = channelIdIndex.getAll(channelId);
        
        getRequest.onsuccess = () => {
          try {
            // Delete all existing tags in this transaction
            getRequest.result.forEach(tag => {
              store.delete(tag.id);
            });

            // Add all new tags in the same transaction
            tags.forEach(tag => {
              store.add({
                tag,
                channelId
              });
            });

            // Handle transaction completion
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
          } catch (error) {
            reject(error);
          }
        };

        getRequest.onerror = () => reject(getRequest.error);
      });
    } catch (error) {
      console.error('Error saving channel tags:', error);
      throw error;
    }
  }

  async getChannelTags(channelId) {
    try {
      const transaction = await dbConnection.getTransaction([STORES.TAGS]);
      const store = transaction.objectStore(STORES.TAGS);
      const channelIdIndex = store.index(INDEXES.TAGS.CHANNEL_ID);

      return new Promise((resolve, reject) => {
        const request = channelIdIndex.getAll(channelId);
        
        request.onsuccess = () => {
          // Extract just the tag strings from the tag objects
          const tags = request.result.map(tagObj => tagObj.tag);
          resolve(tags);
        };
        
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error getting channel tags:', error);
      throw error;
    }
  }

  async deleteTag(tagId) {
    const transaction = await dbConnection.getTransaction([STORES.TAGS], 'readwrite');
    const store = transaction.objectStore(STORES.TAGS);

    return new Promise((resolve, reject) => {
      const request = store.delete(tagId);
      request.onsuccess = resolve;
      request.onerror = () => reject(request.error);
    });
  }

  async removeAllChannelTags(channelId) {
    try {
      const transaction = await dbConnection.getTransaction([STORES.TAGS], 'readwrite');
      const store = transaction.objectStore(STORES.TAGS);
      const channelIdIndex = store.index(INDEXES.TAGS.CHANNEL_ID);

      return new Promise((resolve, reject) => {
        const getRequest = channelIdIndex.getAll(channelId);
        
        getRequest.onsuccess = () => {
          try {
            // Delete all tags for this channel
            getRequest.result.forEach(tag => {
              store.delete(tag.id);
            });

            // Handle transaction completion
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
          } catch (error) {
            reject(error);
          }
        };

        getRequest.onerror = () => reject(getRequest.error);
      });
    } catch (error) {
      console.error('Error removing channel tags:', error);
      throw error;
    }
  }
  
}

export const tagsStore = new TagsStore();