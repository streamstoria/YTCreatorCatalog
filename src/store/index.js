export const useStorage = () => {
    const getBookmarkedChannels = async () => {
      const { bookmarkedChannels } = await chrome.storage.local.get('bookmarkedChannels');
      return bookmarkedChannels || [];
    };
  
    const addBookmark = async (channel) => {
      const channels = await getBookmarkedChannels();
      await chrome.storage.local.set({ 
        bookmarkedChannels: [...channels, channel] 
      });
    };
  
    const removeBookmark = async (url) => {
      const channels = await getBookmarkedChannels();
      const updatedChannels = channels.filter(ch => ch.url !== url);
      await chrome.storage.local.set({ bookmarkedChannels: updatedChannels });
    };
  
    return {
      getBookmarkedChannels,
      addBookmark,
      removeBookmark
    };
  };