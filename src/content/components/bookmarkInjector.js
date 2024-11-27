// src/content/components/bookmarkInjector.js
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

  // Create form
  const formWrapper = document.createElement('div');
  formWrapper.id = 'yt-bookmark-form';
  formWrapper.style.display = 'none';
  formWrapper.innerHTML = `
    <div class="w-full bg-white border-t border-b border-gray-200 p-4">
      <div class="max-w-4xl mx-auto">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-lg font-medium">Add Bookmark</h3>
          <button class="text-gray-500 hover:text-gray-700" id="close-form">×</button>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Tags</label>
          <div class="flex flex-wrap gap-2 mb-2" id="tags-container"></div>
          <form id="tag-form" class="flex gap-2">
            <input
              type="text"
              placeholder="Add a tag"
              class="flex-1 px-3 py-2 border rounded-lg"
              id="tag-input"
            />
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Add
            </button>
          </form>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Notes</label>
          <textarea
            id="notes-input"
            class="w-full px-3 py-2 border rounded-lg"
            rows="4"
          ></textarea>
        </div>

        <div class="flex justify-end gap-2">
          <button
            id="cancel-button"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            id="save-button"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Save Bookmark
          </button>
        </div>
      </div>
    </div>
  `;

  // Insert components
  const lastAction = actionsContainer.lastElementChild;
  if (lastAction) {
    lastAction.after(buttonWrapper);
  } else {
    actionsContainer.appendChild(buttonWrapper);
  }
  actionsContainer.parentNode.insertBefore(formWrapper, actionsContainer.nextSibling);

  // Add event listeners
  const tags = new Set();
  const tagForm = formWrapper.querySelector('#tag-form');
  const tagInput = formWrapper.querySelector('#tag-input');
  const tagsContainer = formWrapper.querySelector('#tags-container');
  const notesInput = formWrapper.querySelector('#notes-input');

  function renderTags() {
    tagsContainer.innerHTML = Array.from(tags).map(tag => `
      <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
        ${tag}
        <button class="remove-tag text-blue-600 hover:text-blue-800 ml-1" data-tag="${tag}">×</button>
      </span>
    `).join('');
  }

  buttonWrapper.querySelector('button').addEventListener('click', () => {
    formWrapper.style.display = formWrapper.style.display === 'none' ? 'block' : 'none';
  });

  formWrapper.querySelector('#close-form').addEventListener('click', () => {
    formWrapper.style.display = 'none';
  });

  formWrapper.querySelector('#cancel-button').addEventListener('click', () => {
    formWrapper.style.display = 'none';
  });

  tagForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const tag = tagInput.value.trim();
    if (tag && !tags.has(tag)) {
      tags.add(tag);
      renderTags();
      tagInput.value = '';
    }
  });

  tagsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-tag')) {
      const tag = e.target.dataset.tag;
      tags.delete(tag);
      renderTags();
    }
  });

  formWrapper.querySelector('#save-button').addEventListener('click', async () => {
    const response = await chrome.runtime.sendMessage({ action: 'getChannelInfo' });
    
    if (response) {
      const { addBookmark } = await import('../../store');
      await addBookmark({
        ...response,
        url: window.location.href,
        tags: Array.from(tags),
        notes: notesInput.value,
        dateAdded: new Date().toISOString()
      });
      formWrapper.style.display = 'none';
    }
  });
}
