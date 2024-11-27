<template>
    <div class="container mx-auto p-4 max-w-4xl">
      <h1 class="text-2xl font-bold mb-6">Bookmarked Channels</h1>
      
      <div class="mb-6 space-y-4">
        <input 
          v-model="search"
          class="w-full border rounded p-2"
          placeholder="Search channels..."
        >
        
        <div class="flex gap-4">
          <select 
            v-model="sortBy"
            class="border rounded p-2"
          >
            <option value="dateAdded">Date Added</option>
            <option value="subscriberCount">Subscribers</option>
            <option value="videoCount">Videos</option>
            <option value="viewCount">Views</option>
          </select>
          
          <select 
            v-model="sortOrder"
            class="border rounded p-2"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
      
      <div class="grid gap-4">
        <div 
          v-for="channel in sortedAndFilteredChannels" 
          :key="channel.url"
          class="border rounded p-4"
        >
          <div class="flex justify-between items-start">
            <div>
              <a 
                :href="channel.url" 
                target="_blank"
                class="text-lg font-medium hover:underline"
              >
                {{ channel.title }}
              </a>
              
              <div class="mt-2 space-y-1 text-sm text-gray-600">
                <div>Subscribers: {{ channel.subscriberCount }}</div>
                <div>Videos: {{ channel.videoCount }}</div>
                <div>Views: {{ channel.viewCount }}</div>
                <div>Added: {{ formatDate(channel.dateAdded) }}</div>
              </div>
              
              <div class="mt-2 flex flex-wrap gap-2">
                <span 
                  v-for="tag in channel.tags" 
                  :key="tag"
                  class="bg-blue-100 px-2 py-1 rounded text-sm"
                >
                  {{ tag }}
                </span>
              </div>
              
              <div v-if="channel.notes" class="mt-2 text-sm">
                <div class="font-medium">Notes:</div>
                <div class="whitespace-pre-line">{{ channel.notes }}</div>
              </div>
            </div>
            
            <button 
              @click="removeChannel(channel)"
              class="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useStorage } from '../store';
  
  const { getBookmarkedChannels, removeBookmark } = useStorage();
  
  const channels = ref([]);
  const search = ref('');
  const sortBy = ref('dateAdded');
  const sortOrder = ref('desc');
  
  const loadChannels = async () => {
    channels.value = await getBookmarkedChannels();
  };
  
  const removeChannel = async (channel) => {
    await removeBookmark(channel.url);
    await loadChannels();
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  const sortedAndFilteredChannels = computed(() => {
    let filtered = channels.value.filter(channel => {
      const searchLower = search.value.toLowerCase();
      return (
        channel.title.toLowerCase().includes(searchLower) ||
        channel.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        channel.notes.toLowerCase().includes(searchLower)
      );
    });
  
    return filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy.value) {
        case 'subscriberCount':
          comparison = parseInt(a.subscriberCount) - parseInt(b.subscriberCount);
          break;
        case 'videoCount':
          comparison = parseInt(a.videoCount) - parseInt(b.videoCount);
          break;
        case 'viewCount':
          comparison = parseInt(a.viewCount) - parseInt(b.viewCount);
          break;
        default:
          comparison = new Date(a.dateAdded) - new Date(b.dateAdded);
      }
      return sortOrder.value === 'asc' ? comparison : -comparison;
    });
  });
  
  onMounted(loadChannels);
  </script>