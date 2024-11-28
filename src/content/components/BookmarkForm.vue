<template>
  <div class="w-full bg-white border-t border-b border-gray-200 p-4">
    <div class="max-w-4xl">
      <div class="flex justify-between items-start mb-4">
        <h3 class="text-lg text-slate-500 font-medium">Manage Tags & Notes</h3>
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
          @input="updateNotes"
          class="w-full px-3 py-2 border rounded-lg"
          rows="4"
          placeholder="Add notes about this channel..."
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStorage } from '../../store';

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
const { getChannelById, addTagToChannel, removeTagFromChannel, updateChannelNotes } = useStorage();

// Load existing data
onMounted(async () => {
  const channelData = await getChannelById(props.channelId);
  if (channelData) {
    tags.value = channelData.tags || [];
    notes.value = channelData.notes || '';
  }
});

const addTag = async () => {
  const tag = newTag.value.trim();
  if (tag && !tags.value.includes(tag)) {
    await addTagToChannel(props.channelId, tag);
    tags.value.push(tag);
    newTag.value = '';
  }
};

const removeTag = async (tag) => {
  await removeTagFromChannel(props.channelId, tag);
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
  await updateChannelNotes(props.channelId, notes.value);
}, 500);

const close = () => {
  props.onClose?.();
};
</script>