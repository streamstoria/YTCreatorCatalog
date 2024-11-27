<template>
    <div class="yt-flexible-actions-view-model-wiz__action">
      <button 
        @click="toggleForm"
        class="yt-spec-button-shape-next yt-spec-button-shape-next--filled yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m"
      >
        Bookmark
      </button>
    </div>
  </template>
  
  <script setup>
  const emit = defineEmits(['toggle']);
  
  const toggleForm = () => {
    emit('toggle');
  };
  </script>
  