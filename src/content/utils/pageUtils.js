export function isYouTubeChannelPage() {
    return window.location.href.includes('youtube.com') && 
           (window.location.href.includes('/channel/') || 
            window.location.href.includes('/c/') || 
            window.location.href.includes('/user/'));
  }
  
  export function waitForElement(selector, callback, maxAttempts = 10) {
    let attempts = 0;
    
    const checkElement = () => {
      attempts++;
      const element = document.querySelector(selector);
      
      if (element) {
        callback(element);
        return;
      }
      
      if (attempts < maxAttempts) {
        setTimeout(checkElement, 1000);
      }
    };
    
    checkElement();
  }
  