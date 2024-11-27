<template>
  <div class="w-96 p-4">
    <div v-if="!isChannelPage" class="text-center text-gray-600">
      Please navigate to a YouTube channel page to bookmark it.
    </div>

    <div v-else>
      <div v-if="loading" class="text-center">
        Loading channel info...
      </div>

      <div v-else-if="channelInfo" class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold">{{ channelInfo.title }}</h2>
          <button @click="toggleBookmark" class="px-4 py-2 rounded"
            :class="isBookmarked ? 'bg-red-500 text-white' : 'bg-green-500 text-white'">
            {{ isBookmarked ? 'Remove Bookmark' : 'Bookmark' }}
          </button>
        </div>

        <div v-if="!isBookmarked" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Tags</label>
            <div class="flex flex-wrap gap-2">
              <input v-model="newTag" @keyup.enter="addTag" class="border p-1 rounded text-sm"
                placeholder="Add tag and press Enter">
              <span v-for="tag in tags" :key="tag" class="bg-blue-100 px-2 py-1 rounded text-sm flex items-center gap-1">
                {{ tag }}
                <button @click="removeTag(tag)" class="text-red-500">&times;</button>
              </span>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Notes</label>
            <textarea v-model="notes" class="w-full border rounded p-2" rows="3"></textarea>
          </div>
        </div>

        <div class="space-y-2">
          <div class="text-sm">
            <span class="font-medium">Subscribers:</span> {{ channelInfo.subscriberCount }}
          </div>
          <div class="text-sm">
            <span class="font-medium">Videos:</span> {{ channelInfo.videoCount }}
          </div>
          <div class="text-sm">
            <span class="font-medium">Views:</span> {{ channelInfo.viewCount }}
          </div>
        </div>
      </div>
    </div>

    <div class="mt-4">
      <a href="/src/manage/index.html" target="_blank"
        class="block text-center bg-gray-100 p-2 rounded hover:bg-gray-200">
        Manage Bookmarks
      </a>
    </div>
  </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import { useStorage } from '../store';

const { getBookmarkedChannels, addBookmark, removeBookmark } = useStorage();

const channelInfo = ref(null);
const loading = ref(true);
const isChannelPage = ref(false);
const isBookmarked = ref(false);
const tags = ref([]);
const notes = ref('');
const newTag = ref('');

const getCurrentTab = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
};

const checkIfChannelPage = (url) => {
  return url.includes('youtube.com/') &&
    (url.includes('/channel/') || url.includes('/c/') || url.includes('/user/'));
};

const loadChannelInfo = async () => {
  const tab = await getCurrentTab();
  isChannelPage.value = checkIfChannelPage(tab.url);

  if (!isChannelPage.value) {
    loading.value = false;
    return;
  }

  const response = await chrome.tabs.sendMessage(tab.id, { action: 'getChannelInfo' });
  channelInfo.value = response;

  const bookmarkedChannels = await getBookmarkedChannels();
  isBookmarked.value = bookmarkedChannels.some(ch => ch.url === tab.url);

  if (isBookmarked.value) {
    const channel = bookmarkedChannels.find(ch => ch.url === tab.url);
    tags.value = channel.tags;
    notes.value = channel.notes;
  }

  loading.value = false;
};

const toggleBookmark = async () => {
  const tab = await getCurrentTab();

  if (isBookmarked.value) {
    await removeBookmark(tab.url);
    isBookmarked.value = false;
    tags.value = [];
    notes.value = '';
  } else {
    const newChannel = {
      ...channelInfo.value,
      url: tab.url,
      tags: tags.value,
      notes: notes.value,
      dateAdded: new Date().toISOString()
    };
    await addBookmark(newChannel);
    isBookmarked.value = true;
  }
};

const addTag = () => {
  if (newTag.value && !tags.value.includes(newTag.value)) {
    tags.value.push(newTag.value);
    newTag.value = '';
  }
};

const removeTag = (tag) => {
  tags.value = tags.value.filter(t => t !== tag);
};

onMounted(loadChannelInfo);
</script>