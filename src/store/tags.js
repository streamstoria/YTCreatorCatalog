// src/store/tags.js
import { dbConnection } from './db/connection';
import { STORES, INDEXES } from './db/config';

export class TagsStore {
  async saveChannelTags(channelId, tags) {
    if (!Array.isArray(tags)) {
      throw new Error('Tags must be an array');
    }

    try {
      const transaction = await dbConnection.getTransaction([STORES.TAGS], 'readwrite');
      const store = transaction.objectStore(STORES.TAGS);
      const channelIdIndex = store.index(INDEXES.TAGS.CHANNEL_ID);

      // Remove existing tags
      const existingTagsRequest = channelIdIndex.getAll(channelId);
      
      return new Promise((resolve, reject) => {
        existingTagsRequest.onsuccess = async () => {
          try {
            // Delete existing tags
            for (const tag of existingTagsRequest.result) {
              await this.deleteTag(tag.id);
            }

            // Add new tags
            const addPromises = tags.map(tag => 
              new Promise((resolveAdd, rejectAdd) => {
                const addRequest = store.add({
                  tag,
                  channelId
                });
                addRequest.onsuccess = resolveAdd;
                addRequest.onerror = rejectAdd;
              })
            );

            await Promise.all(addPromises);
            resolve();
          } catch (error) {
            reject(error);
          }
        };

        existingTagsRequest.onerror = () => reject(existingTagsRequest.error);
        transaction.onerror = () => reject(transaction.error);
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
}

export const tagsStore = new TagsStore();