import u from 'umbrellajs';

export function parseVideoList() {
  const videos = [];
  const maxVideos = 50;
  
  try {
    // Select all video grid items on the page
    const videoElements = u('ytd-grid-video-renderer');
    
    videoElements.each((element, index) => {
      // Limit to max 50 videos
      if (index >= maxVideos) return;
      
      try {
        // Create new umbrella instances for each element
        const titleElement = u('#video-title', element);
        
        if (!titleElement.length) return;

        // Get video URL and title
        const videoUrl = titleElement.first().getAttribute('href');
        const videoTitle = titleElement.first().textContent.trim();
        
        if (!videoUrl || !videoTitle) return;

        // Get metadata spans - these are direct DOM elements
        const metadataSpans = element.querySelectorAll('#metadata-line span');
        
        // Extract views and date from spans
        const viewsText = metadataSpans[0]?.textContent?.trim() || '';
        const dateText = metadataSpans[1]?.textContent?.trim() || '';

        // Extract numeric view count
        const views = viewsText.split(' ')[0];

        videos.push({
          title: videoTitle,
          url: `https://www.youtube.com${videoUrl}`,
          views: views,
          postedDate: dateText,
          metadata: {
            rawViews: viewsText,
            numericViews: parseViewCount(views)
          }
        });

        // Debug log for verification
        console.log('Parsed video:', {
          title: videoTitle,
          views: viewsText,
          date: dateText
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

// Helper function to parse view count with K, M suffixes
function parseViewCount(viewCount) {
  const multipliers = {
    'K': 1000,
    'M': 1000000,
    'B': 1000000000
  };

  const match = viewCount.match(/^([\d.]+)([KMB])?$/);
  if (!match) return null;

  const [, num, suffix] = match;
  const baseValue = parseFloat(num);
  return suffix ? baseValue * multipliers[suffix] : baseValue;
}