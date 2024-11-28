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
            <th class="p-4 font-medium text-gray-600" 
                @click="updateSort('title')"
                :class="{'cursor-pointer hover:bg-gray-100': true}">
              Channel Name
              <SortIndicator :active="sortBy === 'title'" :order="sortOrder" />
            </th>
            <th class="p-4 font-medium text-gray-600" 
                @click="updateSort('videoCount')"
                :class="{'cursor-pointer hover:bg-gray-100': true}">
              Videos
              <SortIndicator :active="sortBy === 'videoCount'" :order="sortOrder" />
            </th>
            <th class="p-4 font-medium text-gray-600" 
                @click="updateSort('viewCount')"
                :class="{'cursor-pointer hover:bg-gray-100': true}">
              Total Views
              <SortIndicator :active="sortBy === 'viewCount'" :order="sortOrder" />
            </th>
            <th class="p-4 font-medium text-gray-600 w-20">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="channel in sortedAndFilteredChannels" 
              :key="channel.channelId"
              class="border-b hover:bg-gray-50">
            <td class="p-4">
              <a 
                :href="channel.url" 
                target="_blank"
                class="text-blue-600 hover:underline"
              >
                {{ channel.title }}
              </a>
            </td>
            <td class="p-4">{{ formatNumber(channel.videoCount) }}</td>
            <td class="p-4">{{ formatNumber(channel.viewCount) }}</td>
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
            <td colspan="4" class="p-4 text-center text-gray-500">
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
import { useStorage } from '../store';

// Sort indicator component
const SortIndicator = {
  props: {
    active: Boolean,
    order: String
  },
  render() {
    if (!this.active) return '↕️';
    return this.order === 'asc' ? '↑' : '↓';
  }
};

const { getChannelsMap, saveChannelData } = useStorage();

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

// Update sort
const updateSort = (field) => {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = field;
    sortOrder.value = 'asc';
  }
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
    return channel.title.toLowerCase().includes(searchLower);
  });

  return filtered.sort((a, b) => {
    let comparison = 0;
    
    if (sortBy.value === 'title') {
      comparison = a.title.localeCompare(b.title);
    } else {
      // For numeric values
      comparison = (a[sortBy.value] || 0) - (b[sortBy.value] || 0);
    }
    
    return sortOrder.value === 'asc' ? comparison : -comparison;
  });
});

onMounted(() => {
  loadChannels();
});

</script>