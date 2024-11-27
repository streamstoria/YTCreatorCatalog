<template>
  <div v-show="show" class="w-full bg-white border-t border-b border-gray-200 p-4">
    <div class="max-w-4xl ">
      <div class="flex justify-between items-start mb-4">
        <h3 class="text-lg text-slate-500 font-medium">Add Bookmark</h3>
        <button @click="close" class="text-gray-500 hover:text-gray-700 text-3xl">&times;</button>
      </div>

      <div class="mb-4">
        <label class="block text-2xl font-medium mb-2">Tags</label>
        <div class="flex flex-wrap gap-2 mb-2">
          <span 
            v-for="tag in tags" 
            :key="tag"
            class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
          >
            {{ tag }}
            <button 
              @click="removeTag(tag)" 
              class="text-blue-600 hover:text-blue-800 ml-1"
            >×</button>
          </span>
        </div>
        <form @submit.prevent="addTag" class="flex gap-2">
          <input
            v-model="newTag"
            type="text"
            placeholder="Add a tag"
            class="flex-1 px-3 py-2 border rounded-lg"
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
        <label class="block text-2xl font-medium mb-2">Notes</label>
        <textarea
          v-model="notes"
          class="w-full px-3 py-2 border rounded-lg"
          rows="4"
        ></textarea>
      </div>

      <div class="flex justify-end gap-2">
        <button
          @click="close"
          class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          @click="saveBookmark"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Save Bookmark
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStorage } from '../../store';

const props = defineProps({
  show: Boolean,
  onClose: Function
});

const tags = ref(new Set());
const newTag = ref('');
const notes = ref('');

const addTag = () => {
  const tag = newTag.value.trim();
  if (tag && !tags.value.has(tag)) {
    tags.value.add(tag);
    newTag.value = '';
  }
};

const removeTag = (tag) => {
  tags.value.delete(tag);
};

const close = () => {
  tags.value.clear();
  notes.value = '';
  console.log("close ...");
  props.onClose();
};

const saveBookmark = async () => {
  const response = await chrome.runtime.sendMessage({ action: 'getChannelInfo' });
  
  if (response) {
    const { addBookmark } = useStorage();
    await addBookmark({
      ...response,
      url: window.location.href,
      tags: Array.from(tags.value),
      notes: notes.value,
      dateAdded: new Date().toISOString()
    });
    close();
  }
};
</script>