import { parseChannelInfo } from './parsers/channelParser';
import { parseVideoList } from './parsers/videoParser';

export function setupMessageHandlers() {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getChannelInfo') {
      const channelInfo = parseChannelInfo();
      const videos = parseVideoList();
      
      sendResponse({
        ...channelInfo,
        videos
      });
      return true;
    }
  });
}