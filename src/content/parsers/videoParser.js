import u from 'umbrellajs';

function parseRelativeDate(relativeTime) {
  const now = new Date();
  const parts = relativeTime.toLowerCase().split(' ');
  
  if (parts.length !== 2 && parts.length !== 3) return null;
  
  const amount = parseInt(parts[0]);
  const unit = parts[1].replace('ago', '').trim();
  
  const date = new Date(now);
  
  switch (unit) {
    case 'second':
    case 'seconds':
      date.setSeconds(date.getSeconds() - amount);
      break;
    case 'minute':
    case 'minutes':
      date.setMinutes(date.getMinutes() - amount);
      break;
    case 'hour':
    case 'hours':
      date.setHours(date.getHours() - amount);
      break;
    case 'day':
    case 'days':
      date.setDate(date.getDate() - amount);
      break;
    case 'week':
    case 'weeks':
      date.setDate(date.getDate() - (amount * 7));
      break;
    case 'month':
    case 'months':
      date.setMonth(date.getMonth() - amount);
      break;
    case 'year':
    case 'years':
      date.setFullYear(date.getFullYear() - amount);
      break;
    default:
      return null;
  }
  
  return date;
}

function parseViewCount(viewCount) {
  if (!viewCount || viewCount === '0') return 0;

  const multipliers = {
    'K': 1000,
    'M': 1000000,
    'B': 1000000000
  };

  const match = viewCount.match(/^([\d.]+)([KMB])?$/);
  if (!match) return 0;

  const [, num, suffix] = match;
  const baseValue = parseFloat(num);
  return suffix ? baseValue * multipliers[suffix] : baseValue;
}

export function parseVideoList() {
  const videos = [];
  const maxVideos = 50;
  
  try {
    const videoElements = u('ytd-grid-video-renderer');
    
    videoElements.each((element, index) => {
      if (index >= maxVideos) return;
      
      try {
        const titleElement = u('#video-title', element);
        if (!titleElement.length) return;

        const videoUrl = titleElement.first().getAttribute('href');
        const videoTitle = titleElement.first().textContent.trim();
        
        if (!videoUrl || !videoTitle) return;

        const metadataSpans = element.querySelectorAll('#metadata-line span');
        let viewsText = '';
        let dateText = '';

        if (metadataSpans.length === 2) {
          viewsText = metadataSpans[0]?.textContent?.trim() || '';
          dateText = metadataSpans[1]?.textContent?.trim() || '';
        } else if (metadataSpans.length === 1) {
          const text = metadataSpans[0]?.textContent?.trim() || '';
          if (text.toLowerCase().includes('views')) {
            viewsText = text;
          } else {
            dateText = text;
          }
        }

        const viewCount = viewsText ? viewsText.split(' ')[0] : '0';
        const postedDate = parseRelativeDate(dateText);

        videos.push({
          title: videoTitle,
          url: `https://www.youtube.com${videoUrl}`,
          views: parseViewCount(viewCount), // Now directly storing the numeric value
          postedDate: postedDate ? postedDate.toISOString() : null,
          metadata: {
            rawViews: viewsText,
            rawPostedDate: dateText,
            isMembersOnly: metadataSpans.length === 1 && !viewsText,
          }
        });
        
      } catch (elementError) {
        console.warn('Error parsing video element:', elementError);
      }
    });
    
    return videos;
  } catch (error) {
    console.error('Error parsing video list:', error);
    return [];
  }
}