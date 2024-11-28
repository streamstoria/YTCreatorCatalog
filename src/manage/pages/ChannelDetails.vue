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
  
        <!-- Tags -->
        <div class="mb-6">
          <h2 class="text-lg font-semibold mb-2">Tags</h2>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="tag in channel.tags" 
              :key="tag"
              class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              {{ tag }}
            </span>
            <span v-if="!channel.tags?.length" class="text-gray-500">
              No tags added
            </span>
          </div>
        </div>
  
        <!-- Notes -->
        <div class="mb-6">
          <h2 class="text-lg font-semibold mb-2">Notes</h2>
          <div class="bg-gray-50 p-4 rounded">
            {{ channel.notes || 'No notes added' }}
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
  const { getChannelById } = useStorage();
  
  // Format helpers
  const formatNumber = (num) => {
    if (!num) return '0';
    return new Intl.NumberFormat().format(num);
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString();
  };
  
  // Load channel data
  onMounted(async () => {
    channel.value = await getChannelById(props.id);
  });
  </script>