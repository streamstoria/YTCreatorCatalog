import { injectBookmarkComponents } from './components/bookmarkInjector';
import { setupMessageHandlers } from './messageHandler';
import '../assets/style.css'; // Make sure Tailwind is imported

function initialize() {
  // Wait for the YouTube header to be fully loaded
  const checkForHeader = setTimeout(() => {
    const actionsContainer = document.querySelector('yt-flexible-actions-view-model');
    if (actionsContainer) {
      //clearInterval(checkForHeader);
      console.log('Found actions container, injecting components...');
      injectBookmarkComponents();
    }
  }, 2000);

  // Clear interval after 10 seconds to prevent infinite checking
 // setTimeout(() => clearInterval(checkForHeader), 10000);
}

// Watch for navigation changes
const observer = new MutationObserver((mutations) => {
  if (window.location.href.includes('/channel/') || 
      window.location.href.includes('/c/') || 
      window.location.href.includes('/user/')) {
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
if (window.location.href.includes('/channel/') || 
    window.location.href.includes('/c/') || 
    window.location.href.includes('/user/')) {
  initialize();
}

// Log for debugging
console.log('Content script initialized');