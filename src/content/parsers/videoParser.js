export function parseVideoList() {
    const videos = [];
    const videoElements = document.querySelectorAll('ytd-rich-grid-media');
    
    videoElements.forEach((element, index) => {
      if (index >= 5) return;
      
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