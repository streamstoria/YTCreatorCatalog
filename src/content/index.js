// src/content/index.js
import { injectBookmarkComponents } from './components/bookmarkInjector';
import { setupMessageHandlers } from './messageHandler';
import { isYouTubeChannelPage } from './utils/pageUtils';

// Global initialization state
const INIT_STATE = {
  isInitialized: false,
  attemptCount: 0,
  maxAttempts: 10,
  currentUrl: '',
};

function shouldInitialize(url) {
  // Check if we're on a channel page using the shared function
  const isChannelPage = isYouTubeChannelPage();
                        
  // If not a channel page, reset initialization state
  if (!isChannelPage) {
    INIT_STATE.isInitialized = false;
    INIT_STATE.currentUrl = '';
    return false;
  }

  // If already initialized for this URL, skip
  if (INIT_STATE.isInitialized && INIT_STATE.currentUrl === url) {
    return false;
  }

  // Allow initialization for new channel URLs
  return true;
}

function initialize() {
  // Clear any existing intervals
  if (INIT_STATE.checkInterval) {
    clearInterval(INIT_STATE.checkInterval);
  }

  // Reset attempt count for new initialization
  INIT_STATE.attemptCount = 0;
  INIT_STATE.currentUrl = window.location.href;

  // Check for the actions container
  const checkForHeader = setInterval(() => {
    INIT_STATE.attemptCount++;
    console.log(`Initialization attempt ${INIT_STATE.attemptCount}`);

    const actionsContainer = document.querySelector('yt-flexible-actions-view-model');
    
    if (actionsContainer) {
      clearInterval(checkForHeader);
      
      // Check if bookmark button already exists
      if (!document.getElementById('yt-bookmark-button')) {
        console.log('Initializing bookmark components...');
        injectBookmarkComponents();
        INIT_STATE.isInitialized = true;
      }
      
      return;
    }

    // Stop checking after max attempts
    if (INIT_STATE.attemptCount >= INIT_STATE.maxAttempts) {
      console.log('Max initialization attempts reached');
      clearInterval(checkForHeader);
    }
  }, 1000);

  // Store interval reference for cleanup
  INIT_STATE.checkInterval = checkForHeader;
}

// Watch for navigation changes
const observer = new MutationObserver((mutations) => {
  const currentUrl = window.location.href;
  
  // Only proceed if we should initialize for this URL
  if (shouldInitialize(currentUrl)) {
    initialize();
  }
});

// Start observing
observer.observe(document, { 
  childList: true, 
  subtree: true 
});

// Set up message handlers
setupMessageHandlers();

// Initial check
if (shouldInitialize(window.location.href)) {
  initialize();
}

console.log('Content script initialized');