<template>
  <div class="w-full bg-white border-t border-b border-gray-200 p-3">
    <div class="max-w-4xl">
      <!-- Header with close button -->
      <div class="flex justify-between items-center mb-3">
        <h3 class="text-lg font-semibold text-gray-800">Add to Bookmarks</h3>
        <button 
          @click="close" 
          class="text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >×</button>
      </div>
      
      <!-- Tags section with horizontal layout -->
      <div class="mb-3">
        <div class="flex items-center gap-2">
          <!-- Existing tags -->
          <div class="flex flex-wrap gap-1">
            <span 
              v-for="tag in tags" 
              :key="tag"
              class="bg-blue-100 text-blue-800 px-4 py-1 rounded-full flex items-center gap-1 text-2xl"
            >
              {{ tag }}
              <button 
                @click="removeTag(tag)" 
                class="text-blue-600 hover:text-blue-800 ml-1 text-2xl"
                aria-label="Remove tag"
              >×</button>
            </span>
          </div>
          
          <!-- Tag input form -->
          <form @submit.prevent="addTag" class="flex-1 flex gap-2">
            <input
              v-model="newTag"
              type="text"
              placeholder="Add tags..."
              class="flex-1 px-2 py-1 border rounded text-2xl"
            />
            <button
              type="submit"
              class="py-1 px-6 bg-blue-500 text-white rounded hover:bg-blue-600 text-2xl"
            >
              Add
            </button>
          </form>
        </div>
      </div>
      
      <!-- Notes textarea -->
      <div class="mb-3">
        <textarea
          v-model="notes"
          @input="updateNotes"
          class="w-full px-4 py-2 border rounded text-2xl"
          rows="2"
          placeholder="Add notes about this channel..."
        ></textarea>
      </div>
      
      <!-- Bottom close button -->
      <div class="flex justify-end">
        <button
          @click="close"
          class="px-4 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-2xl"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useContentStore } from '../../store/contentStore';

const props = defineProps({
  channelId: {
    type: String,
    required: true
  },
  onClose: Function
});

const tags = ref([]);
const newTag = ref('');
const notes = ref('');
const store = useContentStore();

// Load existing data
onMounted(async () => {
  const channelData = await store.getChannelById(props.channelId);
  if (channelData) {
    tags.value = channelData.tags || [];
    notes.value = channelData.notes || '';
  }
});

const addTag = async () => {
  const tag = newTag.value.trim();
  if (tag && !tags.value.includes(tag)) {
    await store.addTagToChannel(props.channelId, tag);
    tags.value.push(tag);
    newTag.value = '';
  }
};

const removeTag = async (tag) => {
  await store.removeTagFromChannel(props.channelId, tag);
  tags.value = tags.value.filter(t => t !== tag);
};

// Debounce function
const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

// Debounced notes update
const updateNotes = debounce(async () => {
  await store.updateChannelNotes(props.channelId, notes.value);
}, 500);

const close = () => {
  props.onClose?.();
};
</script>