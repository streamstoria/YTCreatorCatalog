<template>
  <div class="container mx-auto p-4">
    <div class="mb-4">
      <router-link to="/" class="text-blue-600 hover:underline">&larr; Back to Channels</router-link>
    </div>

    <div v-if="channel" class="border rounded p-6 bg-white">
      <!-- Header -->
      <h1 class="text-2xl font-bold mb-6">{{ channel.title }}</h1>

      <!-- Channel Stats -->
      <div class="grid grid-cols-4 gap-4 mb-6">
        <div class="p-4 bg-gray-50 rounded">
          <div class="text-sm text-gray-600">Subscribers</div>
          <div class="text-lg font-semibold">{{ formatNumber(channel.subscriberCount) }}</div>
        </div>
        <div class="p-4 bg-gray-50 rounded">
          <div class="text-sm text-gray-600">Total Views</div>
          <div class="text-lg font-semibold">{{ formatNumber(channel.viewCount) }}</div>
        </div>
        <div class="p-4 bg-gray-50 rounded">
          <div class="text-sm text-gray-600">Videos</div>
          <div class="text-lg font-semibold">{{ formatNumber(channel.videoCount) }}</div>
        </div>
        <div class="p-4 bg-gray-50 rounded">
          <div class="text-sm text-gray-600">Joined</div>
          <div class="text-lg font-semibold">{{ channel.joinDate }}</div>
        </div>
      </div>

      <!-- Channel Description -->
      <div class="mb-6">
        <h2 class="text-lg font-semibold mb-2">About</h2>
        <div class="bg-gray-50 p-4 rounded whitespace-pre-wrap">
          {{ channel.description || 'No description available' }}
        </div>
      </div>

      <!-- Tags with Edit UI -->
      <div class="mb-6">
        <h2 class="text-lg font-semibold mb-2">Tags</h2>
        <div class="bg-gray-50 p-4 rounded">
          <div class="mb-3">
            <div class="flex items-center gap-2">
              <!-- Existing tags -->
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="tag in channel.tags" 
                  :key="tag"
                  class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center gap-1 text-sm"
                >
                  {{ tag }}
                  <button 
                    @click="removeTag(tag)" 
                    class="text-blue-600 hover:text-blue-800 ml-1"
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
                  class="flex-1 px-2 py-1 border rounded text-sm"
                />
                <button
                  type="submit"
                  class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  Add
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Notes with Edit UI -->
      <div class="mb-6">
        <div class="flex justify-between items-center mb-2">
          <h2 class="text-lg font-semibold">Notes</h2>
          <button 
            v-if="!isEditingNotes" 
            @click="startEditingNotes" 
            class="text-blue-600 hover:text-blue-800 text-sm"
          >
            Edit
          </button>
        </div>
        <div class="bg-gray-50 p-4 rounded">
          <div v-if="isEditingNotes">
            <textarea
              v-model="editedNotes"
              class="w-full px-2 py-1 border rounded text-sm min-h-[100px] mb-2"
              placeholder="Add notes about this channel..."
            ></textarea>
            <div class="flex justify-end gap-2">
              <button
                @click="cancelEditingNotes"
                class="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
              >
                Cancel
              </button>
              <button
                @click="saveNotes"
                class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                Save
              </button>
            </div>
          </div>
          <div v-else class="whitespace-pre-wrap">
            {{ channel.notes || 'No notes added' }}
          </div>
        </div>
      </div>

      <!-- Popular Videos -->
      <div class="mb-6">
        <h2 class="text-lg font-semibold mb-2">Popular Videos</h2>
        <div class="space-y-2">
          <div 
            v-for="video in channel.videos?.slice(0, 5)" 
            :key="video.url"
            class="flex justify-between items-center p-2 hover:bg-gray-50 rounded"
          >
            <a 
              :href="video.url" 
              target="_blank"
              class="text-blue-600 hover:underline flex-1"
            >
              {{ video.title }}
            </a>
            <span class="text-gray-600 text-sm">
              {{ formatNumber(video.views) }} views
            </span>
          </div>
        </div>
      </div>

      <!-- Last Updated -->
      <div class="text-sm text-gray-500">
        Last updated: {{ formatDate(channel.lastUpdated) }}
      </div>
    </div>

    <div v-else class="text-center text-gray-500 py-8">
      Channel not found
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStorage } from '../../store';

const props = defineProps({
  id: {
    type: String,
    required: true
  }
});

const channel = ref(null);
const newTag = ref('');
const isEditingNotes = ref(false);
const editedNotes = ref('');
const { getChannelById, addTagToChannel, removeTagFromChannel, updateChannelNotes } = useStorage();

// Format helpers
const formatNumber = (num) => {
  if (!num) return '0';
  return new Intl.NumberFormat().format(num);
};

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown';
  return new Date(dateString).toLocaleDateString();
};

const addTag = async () => {
  const tag = newTag.value.trim();
  if (tag && !channel.value.tags?.includes(tag)) {
    await addTagToChannel(props.id, tag);
    // Update local state
    if (!channel.value.tags) channel.value.tags = [];
    channel.value.tags.push(tag);
    newTag.value = '';
  }
};

const removeTag = async (tagToRemove) => {
  await removeTagFromChannel(props.id, tagToRemove);
  // Update local state
  channel.value.tags = channel.value.tags.filter(tag => tag !== tagToRemove);
};

// Notes editing functions
const startEditingNotes = () => {
  editedNotes.value = channel.value.notes || '';
  isEditingNotes.value = true;
};

const cancelEditingNotes = () => {
  isEditingNotes.value = false;
  editedNotes.value = '';
};

const saveNotes = async () => {
  await updateChannelNotes(props.id, editedNotes.value);
  // Update local state
  channel.value.notes = editedNotes.value;
  isEditingNotes.value = false;
};

// Load channel data
onMounted(async () => {
  channel.value = await getChannelById(props.id);
});
</script>