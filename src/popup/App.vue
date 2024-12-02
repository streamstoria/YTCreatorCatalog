<template>
  <div class="w-80 p-4 flex flex-col gap-4 bg-white shadow-lg">
    <!-- Header -->
    <div class="flex items-center gap-2 pb-3 border-b border-gray-200">
      <img src="/src/assets/icons/icon16.png" alt="YT Creator Catalog" class="w-5 h-5" />
      <h1 class="text-lg font-semibold text-gray-800">YT Creator Catalog</h1>
    </div>

    <!-- Main Action -->
    <a 
      href="/src/manage/index.html" 
      target="_blank"
      class="flex items-center justify-between p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
             transition-all duration-200 ease-in-out transform hover:scale-[1.02] 
             shadow-sm hover:shadow-md group"
    >
      <div class="flex items-center gap-2">
        <img src="/src/assets/icons/icon16.png" alt="Manage Bookmarks" 
             class="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
        <span class="font-medium text-lg">Manage Bookmarks</span>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        class="transform group-hover:translate-x-1 transition-transform duration-200">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </a>

    <!-- About Section -->
    <div class="bg-gray-50 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-200
                border border-gray-100 hover:border-gray-200">
      <div class="flex items-center gap-2 mb-2 text-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="text-gray-500">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
        <h2 class="font-medium">About</h2>
      </div>
      <p class="text-sm text-gray-600 leading-relaxed">
        Bookmark and organize your favorite YouTube creators with tags and notes. 
        Visit any YouTube channel page and click the "Bookmark" button to save it 
        to your collection.
      </p>
    </div>
  </div>
</template>

<script setup>
// No additional script needed
</script>

<style scoped>
@import '../assets/style.css';

</style>