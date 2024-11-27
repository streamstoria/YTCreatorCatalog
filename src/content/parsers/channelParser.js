export function parseChannelInfo() {
    const channelInfo = {
      title: '',
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
        console.warn('No rows found in YouTube About page table');
        return null;
      }
  
      rows.forEach(row => {
        const iconElement = row.querySelector('yt-icon');
        if (!iconElement) return;
        
        const iconType = iconElement.getAttribute('icon');
        const content = row.querySelector('td:last-child');
        
        if (!content) return;
  
        switch(iconType) {
          case 'person_radar':
            channelInfo.subscriberCount = content.textContent.trim();
            break;
          case 'my_videos':
            channelInfo.videoCount = content.textContent.trim();
            break;
          case 'trending_up':
            channelInfo.viewCount = content.textContent.trim();
            break;
          case 'info_outline':
            channelInfo.joinDate = content.textContent.trim();
            break;
          case 'privacy_public':
            channelInfo.location = content.textContent.trim();
            break;
        }
      });
  
      return channelInfo;
    } catch (error) {
      console.error('Error parsing channel info:', error);
      return null;
    }
  }