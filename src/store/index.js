// src/store/index.js
export const useStorage = () => {
  const getChannelsMap = async () => {
    const { channelsMap } = await chrome.storage.local.get('channelsMap');
    return channelsMap || {};
  };

  const getChannelById = async (channelId) => {
    const channelsMap = await getChannelsMap();
    return channelsMap[channelId] || null;
  };

  const getBookmarkedChannels = async () => {
    const channelsMap = await getChannelsMap();
    return Object.values(channelsMap);
  };

  // Save or update base channel data
  const saveChannelData = async (channelData) => {
    if (!channelData.channelId) {
      console.error('Cannot save channel: channelId is required');
      return null;
    }

    const channelsMap = await getChannelsMap();
    
    channelsMap[channelData.channelId] = {
      ...channelData,
      tags: channelsMap[channelData.channelId]?.tags || [],
      notes: channelsMap[channelData.channelId]?.notes || '',
      lastUpdated: new Date().toISOString()
    };

    await chrome.storage.local.set({ channelsMap });
    return channelData.channelId;
  };

  // Add a tag to a channel
  const addTagToChannel = async (channelId, tag) => {
    const channelsMap = await getChannelsMap();
    const channel = channelsMap[channelId];
    
    if (channel) {
      if (!channel.tags) {
        channel.tags = [];
      }
      
      if (!channel.tags.includes(tag)) {
        channel.tags.push(tag);
        channel.lastUpdated = new Date().toISOString();
        await chrome.storage.local.set({ channelsMap });
      }
    }
  };

  // Remove a tag from a channel
  const removeTagFromChannel = async (channelId, tag) => {
    const channelsMap = await getChannelsMap();
    const channel = channelsMap[channelId];
    
    if (channel && channel.tags) {
      channel.tags = channel.tags.filter(t => t !== tag);
      channel.lastUpdated = new Date().toISOString();
      await chrome.storage.local.set({ channelsMap });
    }
  };

  // Update channel notes
  const updateChannelNotes = async (channelId, notes) => {
    const channelsMap = await getChannelsMap();
    const channel = channelsMap[channelId];
    
    if (channel) {
      channel.notes = notes;
      channel.lastUpdated = new Date().toISOString();
      await chrome.storage.local.set({ channelsMap });
    }
  };

  return {
    getChannelsMap,
    getChannelById,
    getBookmarkedChannels,
    saveChannelData,
    addTagToChannel,
    removeTagFromChannel,
    updateChannelNotes
  };
};