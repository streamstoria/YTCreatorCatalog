<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-xl font-bold">Bookmarked Channels</h1>
      
      <!-- Add Export Markdown Button -->
      <button
        @click="generateMarkdown"
        class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Export to Markdown
      </button>
    </div>

    <!-- Tags Section -->
    <div class="mb-6">
      <h2 class="text-lg font-semibold mb-2">Filter by Tags</h2>
      <div class="flex flex-wrap gap-2 mb-4">
        <button
          v-for="tag in uniqueTags"
          :key="tag"
          @click="toggleTag(tag)"
          :class="[
            'px-3 py-1 rounded-full text-lg',
            selectedTags.includes(tag)
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          {{ tag }}
        </button>
      </div>
      <div v-if="selectedTags.length > 0" class="flex items-center gap-2 mb-4">
        <span class="text-lg text-gray-600">
          Showing channels with all tags:
        </span>
        <div class="flex flex-wrap gap-1">
          <span
            v-for="tag in selectedTags"
            :key="tag"
            class="bg-blue-100 text-blue-800 px-5 py-1 rounded-full text-lg"
          >
            {{ tag }}
          </span>
        </div>
        <button
          @click="clearTags"
          class="text-lg text-red-600 hover:text-red-800"
        >
          Clear
        </button>
      </div>
    </div>

    <!-- Search Control -->
    <div class="mb-6">
      <input
        v-model="search"
        class="w-full border rounded p-2"
        placeholder="Search channels..."
      >
    </div>

    <!-- Table -->
    <div class="overflow-x-auto border rounded">
      <table class="w-full text-left">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th 
              @click="updateSort('name')" 
              class="p-4 font-medium text-gray-600 cursor-pointer hover:bg-gray-100"
            >
              <div class="flex items-center gap-1">
                Channel Name
                <span v-if="sortBy !== 'name'" class="text-gray-400">↕</span>
                <span v-else>{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
              </div>
            </th>
            <th class="p-4 font-medium text-gray-600">Tags</th>
            <th 
              @click="updateSort('videoCount')" 
              class="p-4 font-medium text-gray-600 cursor-pointer hover:bg-gray-100"
            >
              <div class="flex items-center gap-1">
                Videos
                <span v-if="sortBy !== 'videoCount'" class="text-gray-400">↕</span>
                <span v-else>{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
              </div>
            </th>
            <th 
              @click="updateSort('viewCount')" 
              class="p-4 font-medium text-gray-600 cursor-pointer hover:bg-gray-100"
            >
              <div class="flex items-center gap-1">
                Views
                <span v-if="sortBy !== 'viewCount'" class="text-gray-400">↕</span>
                <span v-else>{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
              </div>
            </th>
            <th 
              @click="updateSort('subscriberCount')" 
              class="p-4 font-medium text-gray-600 cursor-pointer hover:bg-gray-100"
            >
              <div class="flex items-center gap-1">
                Subscribers
                <span v-if="sortBy !== 'subscriberCount'" class="text-gray-400">↕</span>
                <span v-else>{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
              </div>
            </th>
            <th class="p-4 font-medium text-gray-600 w-20">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="channel in sortedAndFilteredChannels"
            :key="channel.channelId"
            class="border-b hover:bg-gray-50"
          >
            <td class="p-4">
              <router-link
                :to="{ name: 'channel-details', params: { id: channel.channelId } }"
                class="text-blue-600 hover:underline text-xl"
              >
                {{ channel.name }}
              </router-link>
            </td>
            <td class="p-4">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="tag in channel.tags"
                  :key="tag"
                  class="bg-gray-100 text-gray-700 px-5 py-1 rounded-full text-lg"
                >
                  {{ tag }}
                </span>
              </div>
            </td>
            <td class="p-4">{{ formatNumber(channel.videoCount) }}</td>
            <td class="p-4">{{ formatNumber(channel.viewCount) }}</td>
            <td class="p-4">{{ formatNumber(channel.subscriberCount) }}</td>
            <td class="p-4">
              <button
                @click="handleRemoveChannel(channel.channelId)"
                class="text-red-500 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </td>
          </tr>
          <tr v-if="sortedAndFilteredChannels.length === 0">
            <td colspan="6" class="p-4 text-center text-gray-500">
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
import { useRouter } from 'vue-router';


const { getChannelsMap, removeChannel } = useStorage();

const router = useRouter();

const channels = ref({});
const search = ref('');
const sortBy = ref('videoCount'); // Default sort field
const sortOrder = ref('desc'); // Default to descending order
const selectedTags = ref([]);

// Computed property for all unique tags
const uniqueTags = computed(() => {
  const tagSet = new Set();
  Object.values(channels.value).forEach(channel => {
    channel.tags?.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
});

// Load channels on mount
const loadChannels = async () => {
  channels.value = await getChannelsMap();
};

// Toggle tag selection
const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag);
  if (index === -1) {
    selectedTags.value.push(tag);
  } else {
    selectedTags.value.splice(index, 1);
  }
};

// Clear all selected tags
const clearTags = () => {
  selectedTags.value = [];
};

// Format large numbers
const formatNumber = (num) => {
  if (!num) return '0';
  return new Intl.NumberFormat().format(num);
};

// Handle sort column click
const updateSort = (field) => {
  if (sortBy.value === field) {
    // If clicking the same field, toggle sort order
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    // If clicking a new field, set it as sort field and default to descending
    sortBy.value = field;
    sortOrder.value = 'desc';
  }
};

// Handle channel removal
const handleRemoveChannel = async (channelId) => {
  if (confirm('Are you sure you want to remove this channel?')) {
    try {
      await removeChannel(channelId);
      await loadChannels();
    } catch (error) {
      console.error('Failed to remove channel:', error);
      alert('Failed to remove channel. Please try again.');
    }
  }
};

// Computed property for filtered and sorted channels
const sortedAndFilteredChannels = computed(() => {
  let filtered = Object.values(channels.value).filter(channel => {
    // Text search filter
    const searchLower = search.value.toLowerCase();
    const matchesSearch = 
      channel.name?.toLowerCase().includes(searchLower) ||
      channel.description?.toLowerCase().includes(searchLower);

    // Tag filter - channel must have ALL selected tags
    const matchesTags = selectedTags.value.length === 0 || 
      selectedTags.value.every(tag => channel.tags?.includes(tag));

    return matchesSearch && matchesTags;
  });

  return filtered.sort((a, b) => {
    let comparison = 0;
    if (sortBy.value === 'name') {
      comparison = a.name?.localeCompare(b.name);
    } else {
      comparison = (a[sortBy.value] || 0) - (b[sortBy.value] || 0);
    }
    return sortOrder.value === 'asc' ? comparison : -comparison;
  });
});

const generateMarkdown = () => {
  let markdown = `# YouTube Channel Catalog\n\n`;
  
  // Add summary section
  markdown += `## Summary\n`;
  markdown += `Total Channels: ${sortedAndFilteredChannels.value.length}\n`;
  if (selectedTags.length > 0) {
    markdown += `Applied Tags: ${selectedTags.join(', ')}\n`;
  }
  if (search.value) {
    markdown += `Search Term: "${search.value}"\n`;
  }
  
  // Add channel details
  markdown += `\n`;
  
  sortedAndFilteredChannels.value.forEach((channel, index) => {
    markdown += `### ${index + 1}. ${channel.name}\n`;
    markdown += `- **Subscribers:** ${formatNumber(channel.subscriberCount)}\n`;
    markdown += `- **Total Views:** ${formatNumber(channel.viewCount)}\n`;
    markdown += `- **Video Count:** ${formatNumber(channel.videoCount)}\n`;
    
    if (channel.description) {
      markdown += `\n**Channel Description:**\n${channel.description.trim()}\n`;
    }
    
    if (channel.tags && channel.tags.length > 0) {
      markdown += `\n**Tags:** ${channel.tags.join(', ')}\n`;
    }
    
    if (channel.notes) {
      markdown += `\n**Notes:**\n${channel.notes.trim()}\n`;
    }
    
    if (channel.videos && channel.videos.length > 0) {
      markdown += `\n**Top Videos:**\n`;
      channel.videos.slice(0, 10).forEach(video => {
        markdown += `- [${video.title}](${video.url}) (${formatNumber(video.views)} views)\n`;
      });
    }
    
    markdown += `\n---\n\n`;
  });
  
  // Store markdown in localStorage and navigate
  localStorage.setItem('exportMarkdown', markdown);
  router.push('/export');
};

onMounted(() => {
  loadChannels();
});
</script>