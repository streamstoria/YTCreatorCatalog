import u from 'umbrellajs';

// Helper function to parse numeric values with K, M, B suffixes
function parseNumericValue(value) {
  if (!value) return 0;
  
  // Remove any non-numeric characters except K, M, B and decimal points
  const cleanValue = value.replace(/[^\d.KMB]/g, '');
  
  const multipliers = {
    'K': 1000,
    'M': 1000000,
    'B': 1000000000
  };

  const match = cleanValue.match(/^([\d.]+)([KMB])?$/);
  if (!match) return 0;
  
  const [, num, suffix] = match;
  const baseValue = parseFloat(num);
  return suffix ? baseValue * multipliers[suffix] : baseValue;
}

export function parseChannelInfo() {
  const channelInfo = {
    title: '',
    description: '',
    subscriberCount: 0,
    videoCount: 0,
    viewCount: 0,
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
        case 'person_radar': {
          // Remove "subscribers" and parse the number
          const cleanValue = content.replace(' subscribers', '');
          channelInfo.subscriberCount = parseNumericValue(cleanValue);
          break;
        }
        case 'my_videos': {
          // Remove "videos" and parse the number
          const cleanValue = content.replace(' videos', '');
          channelInfo.videoCount = parseNumericValue(cleanValue);
          break;
        }
        case 'trending_up': {
          // Remove "views" and parse the number
          const cleanValue = content.replace(' views', '');
          channelInfo.viewCount = parseNumericValue(cleanValue);
          break;
        }
        case 'info_outline':
          // Remove "Joined " from joinDate
          channelInfo.joinDate = content.replace('Joined ', '');
          break;
        case 'privacy_public':
          channelInfo.location = content;
          break;
      }
    });

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