// src/store/index.js
import { channelsStore } from './channels';
import { tagsStore } from './tags';

export const useStorage = () => {
  const saveChannelData = async (channelData) => {
    try {
      // Save channel data
      const channelId = await channelsStore.saveChannel(channelData);
      
      // Save tags if present
      if (Array.isArray(channelData.tags)) {
        await tagsStore.saveChannelTags(channelId, channelData.tags);
      }

      return channelId;
    } catch (error) {
      console.error('Error in saveChannelData:', error);
      throw error;
    }
  };

  return {
    saveChannelData,
    // Other methods to be implemented...
  };
};