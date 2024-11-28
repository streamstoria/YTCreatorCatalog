import u from 'umbrellajs';
import { createApp } from 'vue';
import BookmarkForm from './BookmarkForm.vue';

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
  u('#yt-bookmark-button button').on('click', async () => {
    const moreButton = u('button.truncated-text-wiz__absolute-button');
    if (moreButton.length) {
      moreButton.trigger('click');
      
      // Wait for popup to open then find and click close button using more specific selector
      setTimeout(() => {
        const closeButton = u('#visibility-button .yt-spec-button-shape-next--icon-only-default');
        if (closeButton.length) {
          closeButton.trigger('click');
        }
      }, 1000);
    }

    if (vueApp) {
      const vm = vueApp._instance.proxy;
      vm.show = !vm.show;
      return;
    }

    vueApp = createApp(BookmarkForm, {
      show: true,
      onClose: () => {
        console.log("vueApp onClose ...");
        
        if (vueApp) {
          vueApp.unmount();
          vueApp = null;
          formWrapper.innerHTML = ''; // Clear the container
        }
      }
    });
    
    vueApp.mount('#yt-bookmark-form');
  });
}