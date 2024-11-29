// src/background/index.js
import { useStorage } from '../store';

// Initialize store
const store = useStorage();

// Message handler for content script requests
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Early return if no action specified
  if (!request.action) {
    sendResponse({ error: 'No action specified' });
    return true;
  }

  // Handle different store actions
  switch (request.action) {
    case 'saveChannelData':
      store.saveChannelData(request.data)
        .then(channelId => sendResponse({ success: true, channelId }))
        .catch(error => sendResponse({ error: error.message }));
      break;

    case 'getChannelById':
      store.getChannelById(request.channelId)
        .then(channel => sendResponse({ success: true, channel }))
        .catch(error => sendResponse({ error: error.message }));
      break;

    case 'addTagToChannel':
      store.addTagToChannel(request.channelId, request.tag)
        .then(() => sendResponse({ success: true }))
        .catch(error => sendResponse({ error: error.message }));
      break;

    case 'removeTagFromChannel':
      store.removeTagFromChannel(request.channelId, request.tag)
        .then(() => sendResponse({ success: true }))
        .catch(error => sendResponse({ error: error.message }));
      break;

    case 'updateChannelNotes':
      store.updateChannelNotes(request.channelId, request.notes)
        .then(() => sendResponse({ success: true }))
        .catch(error => sendResponse({ error: error.message }));
      break;

    default:
      sendResponse({ error: `Unknown action: ${request.action}` });
  }

  // Return true to indicate we'll send response asynchronously
  return true;
});