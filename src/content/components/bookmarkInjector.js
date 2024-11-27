import { createApp, ref } from 'vue';
import BookmarkButton from './BookmarkButton.vue';
import BookmarkForm from './BookmarkForm.vue';

let buttonApp = null;
let formApp = null;
const showForm = ref(false);

export function injectBookmarkComponents() {
  // Clean up existing instances if any
  if (buttonApp) {
    buttonApp.unmount();
    buttonApp = null;
  }
  if (formApp) {
    formApp.unmount();
    formApp = null;
  }

  // Remove existing elements if any
  const existingButton = document.getElementById('yt-bookmark-button');
  const existingForm = document.getElementById('yt-bookmark-form');
  if (existingButton) existingButton.remove();
  if (existingForm) existingForm.remove();

  // Find the actions container
  const actionsContainer = document.querySelector('yt-flexible-actions-view-model');
  if (!actionsContainer) {
    console.warn('Actions container not found');
    return;
  }

  // Create a wrapper div that matches YouTube's structure
  const buttonWrapper = document.createElement('div');
  buttonWrapper.className = 'yt-flexible-actions-view-model-wiz__action';
  buttonWrapper.id = 'yt-bookmark-button';
  
  // Add button to actions container
  const lastAction = actionsContainer.lastElementChild;
  if (lastAction) {
    lastAction.after(buttonWrapper);
  } else {
    actionsContainer.appendChild(buttonWrapper);
  }

  // Create form container
  const formWrapper = document.createElement('div');
  formWrapper.id = 'yt-bookmark-form';
  actionsContainer.parentNode.insertBefore(formWrapper, actionsContainer.nextSibling);

  // Create and mount button component
  buttonApp = createApp(BookmarkButton, {
    onToggle: () => {
      showForm.value = !showForm.value;
    }
  });

  // Create and mount form component
  formApp = createApp(BookmarkForm, {
    modelValue: showForm.value,
    'onUpdate:modelValue': (value) => {
      showForm.value = value;
    }
  });

  // Mount components
  try {
    buttonApp.mount('#yt-bookmark-button');
    formApp.mount('#yt-bookmark-form');
    console.log('Components mounted successfully');
  } catch (error) {
    console.error('Error mounting components:', error);
  }
}