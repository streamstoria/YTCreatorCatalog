import u from 'umbrellajs';

function parseChannelIdFromUrl(url) {
  try {
    // Handle all possible URL patterns
    const patterns = [
      // @handle format
      /youtube\.com\/@([^\/\?]+)/,
      // /c/ format
      /youtube\.com\/c\/([^\/\?]+)/,
      // /user/ format
      /youtube\.com\/user\/([^\/\?]+)/,
      // /channel/ format
      /youtube\.com\/channel\/([^\/\?]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    // For custom URLs without prefixes, try to extract from path
    const customUrlMatch = url.match(/youtube\.com\/([^\/\?]+)/);
    if (customUrlMatch && customUrlMatch[1] && !['c', 'user', 'channel'].includes(customUrlMatch[1])) {
      return customUrlMatch[1];
    }

    return null;
  } catch (error) {
    console.error('Error parsing channel ID from URL:', error);
    return null;
  }
}

function validateChannelId(channelId) {
  if (!channelId) return false;

  // Remove @ symbol if present
  channelId = channelId.replace('@', '');

  // Basic validation rules
  const isValid = (
    // Must be at least 3 characters
    channelId.length >= 3 && 
    // Maximum 100 characters (YouTube's limit)
    channelId.length <= 100 &&
    // Should not contain spaces or special characters except - and _
    /^[a-zA-Z0-9\-_]+$/.test(channelId)
  );

  return isValid;
}

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

    // Primary method: Get channel ID from metadata
    const handleElement = u('yt-content-metadata-view-model span');
    if (handleElement.length) {
      const metadataChannelId = handleElement.text().replace('@', '').trim();
      if (validateChannelId(metadataChannelId)) {
        channelData.channelId = metadataChannelId;
        return channelData;
      }
    }

    // Fallback method: Parse from URL
    const urlChannelId = parseChannelIdFromUrl(window.location.href);
    if (validateChannelId(urlChannelId)) {
      channelData.channelId = urlChannelId;
      return channelData;
    }


    // If we reach here, log a warning
    console.warn('Could not reliably determine channel ID:', {
      url: window.location.href,
      foundName: channelData.name
    });

    return channelData;

  } catch (error) {
    console.error('Error parsing channel home page:', error);
    return channelData;
  }
}