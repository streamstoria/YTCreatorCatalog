import u from 'umbrellajs';

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
    // Get description
    const descriptionContainer = u('#description-container');
    if (descriptionContainer.length) {
      channelInfo.description = descriptionContainer.text().trim();
    }

    // Get social links
    const linkList = u('#link-list-container');
    if (linkList.length) {
      const linkElements = u('yt-channel-external-link-view-model', linkList.first());
      channelInfo.socialLinks = linkElements.map((element) => {
        const title = u('.yt-channel-external-link-view-model-wiz__title', element).text().trim();
        const link = u('.yt-channel-external-link-view-model-wiz__link a', element).attr('href');
        
        // Extract actual URL from YouTube redirect URL
        const url = new URL(link);
        const actualUrl = url.searchParams.get('q') || link;
        
        return {
          title,
          url: actualUrl
        };
      });
    }

    // Process stats and details
    const rows = u('#additional-info-container table tr.description-item');
    rows.each((row) => {
      const iconElement = u('yt-icon', row);
      if (!iconElement.length) return;
      
      const iconType = iconElement.attr('icon');
      const content = u('td:last-child', row).text().trim();
      
      switch(iconType) {
        case 'person_radar':
          channelInfo.subscriberCount = content;
          break;
        case 'my_videos':
          channelInfo.videoCount = content;
          break;
        case 'trending_up':
          channelInfo.viewCount = content;
          break;
        case 'info_outline':
          channelInfo.joinDate = content;
          break;
        case 'privacy_public':
          channelInfo.location = content;
          break;
      }
    });

    // Clean up the data
    // Remove "subscribers" from subscriberCount
    channelInfo.subscriberCount = channelInfo.subscriberCount.replace(' subscribers', '');
    // Remove "videos" from videoCount
    channelInfo.videoCount = channelInfo.videoCount.replace(' videos', '');
    // Remove "views" from viewCount
    channelInfo.viewCount = channelInfo.viewCount.replace(' views', '');
    // Remove "Joined " from joinDate
    channelInfo.joinDate = channelInfo.joinDate.replace('Joined ', '');

    // Get channel title from page
    const titleElement = u('ytd-channel-name yt-formatted-string#text');
    if (titleElement.length) {
      channelInfo.title = titleElement.text().trim();
    }

    return channelInfo;
  } catch (error) {
    console.error('Error parsing channel info:', error);
    return null;
  }
}