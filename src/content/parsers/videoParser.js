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
        const metadataSpans = u('#metadata-line span', element);

        console.log("metadata-lines ", metadataSpans)
        
        if (!titleElement.length || !metadataSpans.length) return;

        // Get video URL and title
        const videoUrl = titleElement.first().getAttribute('href');
        const videoTitle = titleElement.first().textContent.trim();
        
        if (!videoUrl || !videoTitle) return;

        // Get views and date from metadata spans
        // Convert NodeList to Array to safely access elements
        const spans = Array.from(metadataSpans);
        console.log("spans ", spans);
        const viewsText = spans[0]?.textContent?.trim() || '';
        const dateText = spans[1]?.textContent?.trim() || '';

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