import { isYouTubeChannelPage, waitForElement } from './utils/pageUtils';
import { injectBookmarkComponents } from './components/bookmarkInjector';
import { setupMessageHandlers } from './messageHandler';

// Initialize content script
function initialize() {
  if (!isYouTubeChannelPage()) {
    return;
  }

  
  waitForElement('yt-flexible-actions-view-model', () => {
    injectBookmarkComponents();
  });
}

// Set up observers for SPA navigation
const observer = new MutationObserver(() => {
  if (isYouTubeChannelPage()) {
    initialize();
  }
});

observer.observe(document, { childList: true, subtree: true });

// Initial setup
setupMessageHandlers();
initialize();