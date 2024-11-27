import { createApp } from 'vue';
import BookmarkButton from './BookmarkButton.vue';
import BookmarkForm from './BookmarkForm.vue';

export function injectBookmarkComponents() {
  if (document.getElementById('yt-bookmark-button') || 
      document.getElementById('yt-bookmark-form')) {
    return;
  }

  const actionsContainer = document.querySelector('yt-flexible-actions-view-model');
  if (!actionsContainer) {
    console.warn('Actions container not found');
    return;
  }

  const buttonContainer = document.createElement('div');
  buttonContainer.id = 'yt-bookmark-button';
  actionsContainer.appendChild(buttonContainer);

  const formContainer = document.createElement('div');
  formContainer.id = 'yt-bookmark-form';
  actionsContainer.parentNode.insertBefore(formContainer, actionsContainer.nextSibling);

  const showForm = ref(false);

  const buttonApp = createApp(BookmarkButton, {
    onToggle: () => {
      showForm.value = !showForm.value;
    }
  });
  buttonApp.mount(buttonContainer);

  const formApp = createApp(BookmarkForm, {
    modelValue: showForm,
    'onUpdate:modelValue': (value) => {
      showForm.value = value;
    }
  });
  formApp.mount(formContainer);
}