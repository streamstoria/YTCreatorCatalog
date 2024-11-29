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

  const getChannelById = async (channelId) => {
    try {
      // Fetch channel data and tags in parallel
      const [channel, tags] = await Promise.all([
        channelsStore.getChannel(channelId),
        tagsStore.getChannelTags(channelId)
      ]);

      if (!channel) {
        return null;
      }

      // Combine channel data with tags
      return {
        ...channel,
        tags
      };
    } catch (error) {
      console.error('Error in getChannelById:', error);
      throw error;
    }
  };

  return {
    saveChannelData,
    getChannelById,
    // Other methods to be implemented...
  };
};