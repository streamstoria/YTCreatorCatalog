<template>
  <button 
    @click="toggleForm"
    class="yt-spec-button-shape-next yt-spec-button-shape-next--filled yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--disable-text-ellipsis yt-spec-button-shape-next--enable-backdrop-filter-experiment"
  >
    <div class="yt-spec-button-shape-next__button-text-content">Bookmark</div>
  </button>
</template>

<script setup>
const emit = defineEmits(['toggle']);

const toggleForm = () => {
  emit('toggle');
};
</script>