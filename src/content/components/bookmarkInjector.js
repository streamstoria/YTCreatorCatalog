import { createApp } from 'vue';
import BookmarkForm from './BookmarkForm.vue';

export function injectBookmarkComponents() {
  const existingButton = document.getElementById('yt-bookmark-button');
  const existingForm = document.getElementById('yt-bookmark-form');
  if (existingButton) existingButton.remove();
  if (existingForm) existingForm.remove();

  const actionsContainer = document.querySelector('yt-flexible-actions-view-model');
  if (!actionsContainer) {
    console.warn('Actions container not found');
    return;
  }

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

  // Insert components
  const lastAction = actionsContainer.lastElementChild;
  if (lastAction) {
    lastAction.after(buttonWrapper);
  } else {
    actionsContainer.appendChild(buttonWrapper);
  }
  actionsContainer.parentNode.insertBefore(formWrapper, actionsContainer.nextSibling);

  let vueApp = null;
  buttonWrapper.querySelector('button').addEventListener('click', () => {
    console.log("Bookmark button clicked");
    
    if (vueApp) {
      console.log("Toggling form visibility");
      const vm = vueApp._instance.proxy;
      vm.show = !vm.show;
      return;
    }

    console.log("Creating new Vue app");
    vueApp = createApp(BookmarkForm, {
      show: true,
      onClose: () => {
        
        const vm = vueApp._instance.proxy;
        vm.show = false;
      }
    });
    
    console.log("Mounting Vue app");
    vueApp.mount('#yt-bookmark-form');
  });
}