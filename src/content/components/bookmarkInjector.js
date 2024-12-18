// src/content/components/bookmarkInjector.js
import u from 'umbrellajs';
import { createApp } from 'vue';
import BookmarkForm from './BookmarkForm.vue';
import { parseChannelInfo } from '../parsers/channelParser';
import { parseVideoList } from '../parsers/videoParser';
import { waitForElement } from '../utils/pageUtils';
import { parseChannelHomePage } from '../parsers/channelHomeParser';
import { useContentStore } from '../../store/contentStore';

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

  function closeBookmarkForm() {
    vueApp.unmount();
    vueApp = null;
    formWrapper.innerHTML = '';
  }

  u('#yt-bookmark-button button').on('click', async () => {
    if (vueApp) {
      closeBookmarkForm();
      return;
    }

    const store = useContentStore();
    const homePageData = parseChannelHomePage();

    // Ensure we have a valid channelId
    if (!homePageData.channelId) {
      console.error('Could not determine channelId');
      return;
    }

    // Check if channel exists, if not save it
    const channel = await store.getChannelById(homePageData.channelId);
    if (!channel) {
      let channelInfo = await collectChannelInfo();
      const videos = parseVideoList();
      const channelData = {
        ...channelInfo,
        ...homePageData,
        videos,
        lastUpdated: new Date().toISOString()
      };
      await store.saveChannelData(channelData);
    }

    // Create the bookmark form for tags and notes
    vueApp = createApp(BookmarkForm, {
      channelId: homePageData.channelId,
      onClose: () => {
        if (vueApp) {
          closeBookmarkForm();
        }
      }
    });

    vueApp.mount('#yt-bookmark-form');
  });
}

async function collectChannelData() {
  return new Promise((resolve) => {
    waitForElement('#about-container', (aboutContainer) => {
      setTimeout(() => {
        const channelInfo = parseChannelInfo();
        resolve(channelInfo);
      }, 300);
    }, 20);
  });
}

async function collectChannelInfo() {
  let channelInfo = {};
  const moreButton = u('button.truncated-text-wiz__absolute-button');
  if (moreButton.length) {
    // Click the more button to open about popup
    moreButton.trigger('click');

    try {
      // Wait for and collect channel data
      channelInfo = await collectChannelData();

      // Close the about popup after collecting data
      const closeButton = u('tp-yt-paper-dialog ytd-engagement-panel-section-list-renderer #visibility-button .yt-spec-button-shape-next--icon-only-default');
      if (closeButton.length) {
        closeButton.trigger('click');
      }
    } catch (e) {
      console.error("Error collecting channel info ", e);
    }
  }
  return channelInfo;
}