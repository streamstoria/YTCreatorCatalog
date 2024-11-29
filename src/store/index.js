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

  const addTagToChannel = async (channelId, newTag) => {
    try {
      // Get current channel tags
      const tags = await tagsStore.getChannelTags(channelId);
      
      // Add new tag if it doesn't exist
      if (!tags.includes(newTag)) {
        const updatedTags = [...tags, newTag];
        await tagsStore.saveChannelTags(channelId, updatedTags);
      }
    } catch (error) {
      console.error('Error in addTagToChannel:', error);
      throw error;
    }
  };

  const removeTagFromChannel = async (channelId, tagToRemove) => {
    try {
      // Get current channel tags
      const tags = await tagsStore.getChannelTags(channelId);
      
      // Remove the tag
      const updatedTags = tags.filter(tag => tag !== tagToRemove);
      
      // Save updated tags
      await tagsStore.saveChannelTags(channelId, updatedTags);
    } catch (error) {
      console.error('Error in removeTagFromChannel:', error);
      throw error;
    }
  };

  const updateChannelNotes = async (channelId, notes) => {
    try {
      const channel = await channelsStore.getChannel(channelId);
      if (!channel) {
        throw new Error('Channel not found');
      }

      // Update notes and save
      const updatedChannel = {
        ...channel,
        notes: notes
      };
      
      await channelsStore.saveChannel(updatedChannel);
    } catch (error) {
      console.error('Error in updateChannelNotes:', error);
      throw error;
    }
  };

  const getChannelsMap = async () => {
    try {
      // Get all channels
      const channels = await channelsStore.getAllChannels();
      
      // Get all tags for all channels in parallel
      const channelsWithTags = await Promise.all(
        channels.map(async channel => {
          const tags = await tagsStore.getChannelTags(channel.channelId);
          return {
            ...channel,
            tags
          };
        })
      );

      // Convert to map with channelId as key
      return channelsWithTags.reduce((acc, channel) => {
        acc[channel.channelId] = channel;
        return acc;
      }, {});
    } catch (error) {
      console.error('Error in getChannelsMap:', error);
      throw error;
    }
  };

  const removeChannel = async (channelId) => {
    try {
      // Start with removing tags
      await tagsStore.removeAllChannelTags(channelId);
      
      // Then remove the channel
      await channelsStore.removeChannel(channelId);
    } catch (error) {
      console.error('Error in removeChannel:', error);
      throw error;
    }
  };

  return {
    saveChannelData,
    getChannelById,
    addTagToChannel,
    removeTagFromChannel,
    updateChannelNotes,
    getChannelsMap,
    removeChannel
  };
};