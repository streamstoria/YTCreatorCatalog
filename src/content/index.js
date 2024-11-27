// Main function to parse channel information
function parseChannelInfo() {
    const channelInfo = {
      description: '',
      subscriberCount: '',
      videoCount: '',
      viewCount: '',
      joinDate: '',
      location: '',
      socialLinks: []
    };
  
    try {
      // Select all rows in the about page table
      const rows = document.querySelectorAll('ytd-about-channel-renderer table tbody tr');
      if (!rows.length) {
        console.warn('No rows found in YouTube About page table - waiting for content to load');
        return null; // Return null to indicate data isn't ready
      }
  
      rows.forEach(row => {
        try {
          // Get the icon attribute from yt-icon element
          const iconElement = row.querySelector('yt-icon');
          if (!iconElement) return;
          
          const iconType = iconElement.getAttribute('icon');
          const content = row.querySelector('td:last-child');
          
          if (!content) return;
  
          // Log the raw data for debugging
          console.log('Icon type:', iconType);
          console.log('Content:', content.textContent.trim());
  
          // Match different statistics based on the icon type
          switch(iconType) {
            case 'person_radar':
              channelInfo.subscriberCount = content.textContent.trim();
              console.log('Found subscribers:', channelInfo.subscriberCount);
              break;
            
            case 'my_videos':
              channelInfo.videoCount = content.textContent.trim();
              console.log('Found videos:', channelInfo.videoCount);
              break;
            
            case 'trending_up':
              channelInfo.viewCount = content.textContent.trim();
              console.log('Found views:', channelInfo.viewCount);
              break;
            
            case 'info_outline':
              channelInfo.joinDate = content.textContent.trim();
              console.log('Found join date:', channelInfo.joinDate);
              break;
            
            case 'privacy_public':
              channelInfo.location = content.textContent.trim();
              console.log('Found location:', channelInfo.location);
              break;
          }
        } catch (rowError) {
          console.error('Error parsing row:', rowError);
        }
      });
  
      // Log the final parsed data
      console.log('Parsed Channel Info:', channelInfo);
      return channelInfo;
  
    } catch (error) {
      console.error('Error parsing channel info:', error);
      return null;
    }
  }
  
  function parseVideoList() {
    const videos = [];
    const videoElements = document.querySelectorAll('ytd-rich-grid-media');
    
    videoElements.forEach((element, index) => {
      if (index >= 5) return; // Only get first 5 videos
      
      try {
        const titleElement = element.querySelector('#video-title');
        const metaElement = element.querySelector('#metadata-line');
        
        if (!titleElement || !metaElement) return;
        
        const views = metaElement.querySelector('.inline-metadata-item')?.textContent || 'N/A';
        const publishTime = metaElement.querySelectorAll('.inline-metadata-item')[1]?.textContent || 'N/A';
        
        videos.push({
          title: titleElement.textContent.trim(),
          views: views.trim(),
          publishTime: publishTime.trim(),
          url: titleElement.closest('a')?.href || '#'
        });
      } catch (error) {
        console.error('Error parsing video:', error);
      }
    });
    
    return videos;
  }
  
  
  // Function to check if we're on a YouTube channel about page
  function isYouTubeAboutPage() {
    return window.location.href.includes('youtube.com') && 
           window.location.href.includes('/about');
  }
  
  // Function to wait for content to load
  function waitForContent(callback, maxAttempts = 10) {
    let attempts = 0;
    
    const checkContent = () => {
      attempts++;
      console.log(`Checking for content... Attempt ${attempts}`);
      
      const table = document.querySelector('ytd-about-channel-renderer table');
      if (table && table.querySelectorAll('tbody tr').length > 0) {
        console.log('Content found!');
        callback();
        return;
      }
      
      if (attempts < maxAttempts) {
        setTimeout(checkContent, 1000); // Check every second
      } else {
        console.error('Max attempts reached - content not found');
      }
    };
    
    checkContent();
  }
  
  // Initialize the parser
  function initialize() {
    if (!isYouTubeAboutPage()) {
      console.log('Not on YouTube About page, parser waiting...');
      return;
    }
    
    console.log('YouTube About page detected, waiting for content...');
    waitForContent(() => {
      const info = parseChannelInfo();
      if (info) {
        console.log('Successfully parsed channel info:', info);
      }
    });
  }
  
  // Set up page load handling
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getChannelInfo') {
      // Try to get info immediately
      let info = parseChannelInfo();
      const videos = parseVideoList();
      console.log("received videos ", videos)
      if(!info) {
        info = {};
      }
        sendResponse({
          ...info,
          videos: videos
        });
        return true;
      
      // If no info, wait for content and then respond
      /*waitForContent(() => {
        info = parseChannelInfo();
        if (info) {
          sendResponse(info);
        } else {
          sendResponse(null);
        }
      });*/
      
      //return true; // Keep message channel open for async response
    }
  });
  
  // Watch for YouTube SPA navigation
  let lastUrl = location.href;
  const observer = new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      if (isYouTubeAboutPage()) {
        console.log('Navigation to YouTube About page detected');
        initialize();
      }
    }
  });
  
  observer.observe(document, {subtree: true, childList: true});
  
  // Log that content script has loaded
  console.log('YouTube Channel Info Parser loaded and running');