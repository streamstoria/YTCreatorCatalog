export function isYouTubeChannelPage() {
  const url = window.location.href;

  if (!url.includes('youtube.com')) {
    return false;
  }

  // Check for all possible channel URL patterns
  return (
    url.includes('/channel/') ||
    url.includes('/c/') ||
    url.includes('/user/') ||
    url.includes('/@') ||  // Add support for @ handles
    url.match(/youtube\.com\/[^\/]+\/?(?:featured|videos|playlists|community|channels|about)?$/) !== null // Support channel sections
  );
}

export function waitForElement(selector, callback, maxAttempts = 10) {
  let attempts = 0;

  const checkElement = () => {
    attempts++;
    const element = document.querySelector(selector);

    if (element) {
      callback(element);
      return;
    }

    if (attempts < maxAttempts) {
      setTimeout(checkElement, 1000);
    }
  };

  checkElement();
}
