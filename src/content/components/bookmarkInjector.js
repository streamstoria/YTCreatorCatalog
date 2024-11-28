// src/content/components/bookmarkInjector.js
import u from 'umbrellajs';
import { createApp } from 'vue';
import BookmarkForm from './BookmarkForm.vue';
import { parseChannelInfo } from '../parsers/channelParser';
import { parseVideoList } from '../parsers/videoParser';
import { waitForElement } from '../utils/pageUtils';
import { parseChannelHomePage } from '../parsers/channelHomeParser';
import { useStorage } from '../../store';

export function injectBookmarkComponents() {
  const existingButton = u('#yt-bookmark-button');
  const existingForm = u('#yt-bookmark-form');
  if (existingButton.length) existingButton.remove();
  if (existingForm.length) existingForm.remove();

  const actionsContainer = u('yt-flexible-actions-view-model');
  if (!actionsContainer.length) return;

  // Create button wrapper
  const buttonWrapper = document.createElement('div');
  buttonWrapper.className = 'yt-flexible-actions-view-model-wiz__action';
  buttonWrapper.id = 'yt-bookmark-button';
  buttonWrapper.innerHTML = `
    <button class="yt-spec-button-shape-next yt-spec-button-shape-next--outline yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m">
      <div class="yt-spec-button-shape-next__button-text-content">Bookmark</div>
    </button>
  `;

  // Create form container
  const formWrapper = document.createElement('div');
  formWrapper.id = 'yt-bookmark-form';

  const lastAction = actionsContainer.first().lastElementChild;
  if (lastAction) {
    u(lastAction).after(buttonWrapper);
  } else {
    actionsContainer.append(buttonWrapper);
  }
  actionsContainer.after(formWrapper);

  let vueApp = null;
  
  u('#yt-bookmark-button button').on('click', async () => {
    const moreButton = u('button.truncated-text-wiz__absolute-button');
    
    if (moreButton.length) {
      // Click the more button to open about popup
      moreButton.trigger('click');
      
      try {
        // Wait for and collect channel data
        const channelInfo = await collectChannelData();
        
        // Close the about popup after collecting data
        const closeButton = u('#visibility-button .yt-spec-button-shape-next--icon-only-default');
        if (closeButton.length) {
          closeButton.trigger('click');
        }

        const homePageData = parseChannelHomePage();
        const videos = parseVideoList();

        // Ensure we have a valid channelId
        if (!homePageData.channelId) {
          console.error('Could not determine channelId');
          return;
        }

        const channelData = {
          ...channelInfo,
          ...homePageData,
          videos,
          lastUpdated: new Date().toISOString()
        };

        // Immediately save the channel data
        const { saveChannelData } = useStorage();
        await saveChannelData(channelData);

        console.log('Saved Channel Data:', channelData);

        // Create the bookmark form for tags and notes
        vueApp = createApp(BookmarkForm, {
          channelId: channelData.channelId, // Pass only the channelId
          onClose: () => {
            if (vueApp) {
              vueApp.unmount();
              vueApp = null;
              formWrapper.innerHTML = '';
            }
          }
        });
        
        vueApp.mount('#yt-bookmark-form');
      } catch (error) {
        console.error('Error collecting channel data:', error);
      }
    } else {
      console.warn('More button not found');
    }
  });
}

async function collectChannelData() {
  return new Promise((resolve) => {
    waitForElement('#about-container', (aboutContainer) => {
      setTimeout(() => {
        const channelInfo = parseChannelInfo();
        resolve(channelInfo);
      }, 500);
    }, 20);
  });
}