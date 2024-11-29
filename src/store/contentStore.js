// src/store/contentStore.js
const sendMessage = (action, data) => {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ action, ...data }, response => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        
        if (response.error) {
          reject(new Error(response.error));
          return;
        }
        
        resolve(response);
      });
    });
  };
  
  export const useContentStore = () => {
    const saveChannelData = async (channelData) => {
      const response = await sendMessage('saveChannelData', { data: channelData });
      return response.channelId;
    };
  
    const getChannelById = async (channelId) => {
      const response = await sendMessage('getChannelById', { channelId });
      return response.channel;
    };
  
    const addTagToChannel = async (channelId, tag) => {
      await sendMessage('addTagToChannel', { channelId, tag });
    };
  
    const removeTagFromChannel = async (channelId, tag) => {
      await sendMessage('removeTagFromChannel', { channelId, tag });
    };
  
    const updateChannelNotes = async (channelId, notes) => {
      await sendMessage('updateChannelNotes', { channelId, notes });
    };
  
    return {
      saveChannelData,
      getChannelById,
      addTagToChannel,
      removeTagFromChannel,
      updateChannelNotes
    };
  };