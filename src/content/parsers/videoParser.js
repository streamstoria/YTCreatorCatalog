import u from 'umbrellajs';

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

        // Handle different metadata formats
        if (metadataSpans.length === 2) {
          // Regular video with both views and date
          viewsText = metadataSpans[0]?.textContent?.trim() || '';
          dateText = metadataSpans[1]?.textContent?.trim() || '';
        } else if (metadataSpans.length === 1) {
          // Members-only video or special case with only date
          const text = metadataSpans[0]?.textContent?.trim() || '';
          // Check if the text contains "views" to determine if it's views or date
          if (text.toLowerCase().includes('views')) {
            viewsText = text;
          } else {
            dateText = text;
          }
        }

        // Extract numeric view count only if we have views
        const views = viewsText ? viewsText.split(' ')[0] : '0';

        videos.push({
          title: videoTitle,
          url: `https://www.youtube.com${videoUrl}`,
          views: views,
          postedDate: dateText,
          metadata: {
            rawViews: viewsText,
            numericViews: parseViewCount(views),
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