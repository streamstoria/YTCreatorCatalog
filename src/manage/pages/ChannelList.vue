<template>
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-6">Bookmarked Channels</h1>
      
      <!-- Search and Sort Controls -->
      <div class="mb-6 flex gap-4">
        <input 
          v-model="search"
          class="flex-1 border rounded p-2"
          placeholder="Search channels..."
        >
        
        <select 
          v-model="sortBy"
          class="border rounded p-2"
        >
          <option value="title">Channel Name</option>
          <option value="videoCount">Video Count</option>
          <option value="viewCount">Total Views</option>
          <option value="subscriberCount">Subscribers</option>
        </select>
        
        <select 
          v-model="sortOrder"
          class="border rounded p-2"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
  
      <!-- Table -->
      <div class="overflow-x-auto border rounded">
        <table class="w-full text-left">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th class="p-4 font-medium text-gray-600">Channel Name</th>
              <th class="p-4 font-medium text-gray-600">Videos</th>
              <th class="p-4 font-medium text-gray-600">Views</th>
              <th class="p-4 font-medium text-gray-600">Subscribers</th>
              <th class="p-4 font-medium text-gray-600 w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="channel in sortedAndFilteredChannels" 
                :key="channel.channelId" 
                class="border-b hover:bg-gray-50">
              <td class="p-4">
                <router-link 
                  :to="{ name: 'channel-details', params: { id: channel.channelId }}"
                  class="text-blue-600 hover:underline"
                >
                  {{ channel.title }}
                </router-link>
              </td>
              <td class="p-4">{{ formatNumber(channel.videoCount) }}</td>
              <td class="p-4">{{ formatNumber(channel.viewCount) }}</td>
              <td class="p-4">{{ formatNumber(channel.subscriberCount) }}</td>
              <td class="p-4">
                <button 
                  @click="removeChannel(channel.channelId)"
                  class="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </td>
            </tr>
            <tr v-if="sortedAndFilteredChannels.length === 0">
              <td colspan="5" class="p-4 text-center text-gray-500">
                No channels found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useStorage } from '../../store';
  
  const { getChannelsMap } = useStorage();
  const channels = ref({});
  const search = ref('');
  const sortBy = ref('title');
  const sortOrder = ref('asc');
  
  // Load channels on mount
  const loadChannels = async () => {
    channels.value = await getChannelsMap();
  };
  
  // Format large numbers
  const formatNumber = (num) => {
    if (!num) return '0';
    return new Intl.NumberFormat().format(num);
  };
  
  // Remove channel
  const removeChannel = async (channelId) => {
    if (confirm('Are you sure you want to remove this channel?')) {
      const { [channelId]: removed, ...rest } = channels.value;
      channels.value = rest;
      await chrome.storage.local.set({ channelsMap: channels.value });
    }
  };
  
  // Computed property for filtered and sorted channels
  const sortedAndFilteredChannels = computed(() => {
    let filtered = Object.values(channels.value).filter(channel => {
      const searchLower = search.value.toLowerCase();
      return (
        channel.title?.toLowerCase().includes(searchLower) ||
        channel.description?.toLowerCase().includes(searchLower) ||
        channel.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    });
  
    return filtered.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy.value === 'title') {
        comparison = a.title?.localeCompare(b.title);
      } else {
        comparison = (a[sortBy.value] || 0) - (b[sortBy.value] || 0);
      }
      
      return sortOrder.value === 'asc' ? comparison : -comparison;
    });
  });
  
  onMounted(() => {
    loadChannels();
  });
  </script>