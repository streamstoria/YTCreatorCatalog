import u from 'umbrellajs';

export function parseChannelHomePage() {
  const channelData = {
    name: '',
    channelId: ''
  };

  try {
    // Get channel title from the h1 element
    const nameElement = u('.page-header-view-model-wiz__page-header-title h1.dynamic-text-view-model-wiz__h1');
    if (nameElement.length) {
      // Extract text and remove any trailing verification mark
      channelData.name = nameElement.text().replace(/\s*✓\s*$/, '').trim();
    }

    // Get channel ID (handle) from the metadata section
    const handleElement = u('yt-content-metadata-view-model span');
    if (handleElement.length) {
      // Remove @ symbol from the handle if present
      channelData.channelId = handleElement.text().replace('@', '').trim();
    }

    return channelData;
  } catch (error) {
    console.error('Error parsing channel home page:', error);
    return channelData;
  }
}