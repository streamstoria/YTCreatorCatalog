<template>
    <div v-if="modelValue" class="bookmark-form w-full bg-white border-t border-b border-gray-200 p-4">
      <div class="max-w-4xl mx-auto">
        <!-- Form Content -->
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-lg font-medium">Add Bookmark</h3>
          <button @click="$emit('update:modelValue', false)" class="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>
  
        <!-- Tags Section -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Tags</label>
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
              >
                ×
              </button>
            </span>
          </div>
          <form @submit.prevent="addTag" class="flex gap-2">
            <input
              v-model="newTag"
              type="text"
              placeholder="Add a tag"
              class="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Add
            </button>
          </form>
        </div>
  
        <!-- Notes Section -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Notes</label>
          <textarea
            v-model="notes"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
          />
        </div>
  
        <!-- Action Buttons -->
        <div class="flex justify-end gap-2">
          <button
            @click="$emit('update:modelValue', false)"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            @click="handleSave"
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
    modelValue: Boolean,
    initialTags: {
      type: Array,
      default: () => []
    },
    initialNotes: {
      type: String,
      default: ''
    }
  });
  
  const emit = defineEmits(['update:modelValue']);
  
  const tags = ref(props.initialTags);
  const newTag = ref('');
  const notes = ref(props.initialNotes);
  const { addBookmark } = useStorage();
  
  const addTag = () => {
    if (newTag.value.trim() && !tags.value.includes(newTag.value.trim())) {
      tags.value.push(newTag.value.trim());
      newTag.value = '';
    }
  };
  
  const removeTag = (tagToRemove) => {
    tags.value = tags.value.filter(tag => tag !== tagToRemove);
  };
  
  const handleSave = async () => {
    const response = await chrome.runtime.sendMessage({ action: 'getChannelInfo' });
    
    if (response) {
      await addBookmark({
        ...response,
        url: window.location.href,
        tags: tags.value,
        notes: notes.value,
        dateAdded: new Date().toISOString()
      });
    }
    
    emit('update:modelValue', false);
  };
  </script>