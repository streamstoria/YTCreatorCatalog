import u from 'umbrellajs';
import { createApp } from 'vue';
import BookmarkForm from './BookmarkForm.vue';
import { parseChannelInfo } from '../parsers/channelParser';
import { parseVideoList } from '../parsers/videoParser';
import { waitForElement } from '../utils/pageUtils';

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
    <button class="yt-spec-button-shape-next yt-spec-button-shape-next--filled yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m">
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

  const collectChannelData = async () => {
    return new Promise((resolve) => {
      // Wait for the about container to appear
      waitForElement('#about-container', (aboutContainer) => {
        // Give a small delay for content to populate
        setTimeout(() => {
          const channelInfo = parseChannelInfo();
          const videos = parseVideoList();
          
          const channelData = {
            ...channelInfo,
            videos
          };
          
          console.log('Collected Channel Data:', channelData);
          resolve(channelData);
        }, 500);
      }, 20); // Increase max attempts since popup loading might take time
    });
  };

  u('#yt-bookmark-button button').on('click', async () => {
    const moreButton = u('button.truncated-text-wiz__absolute-button');
    
    if (moreButton.length) {
      // Click the more button to open about popup
      moreButton.trigger('click');
      
      try {
        // Wait for and collect channel data
        const channelData = await collectChannelData();
        
        // Close the about popup after collecting data
        const closeButton = u('#visibility-button .yt-spec-button-shape-next--icon-only-default');
        if (closeButton.length) {
          closeButton.trigger('click');
        }

        // Handle Vue app display
        if (vueApp) {
          const vm = vueApp._instance.proxy;
          vm.show = !vm.show;
          return;
        }

        vueApp = createApp(BookmarkForm, {
          show: true,
          channelData, // Pass the collected data to the form
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