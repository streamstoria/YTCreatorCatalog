<template>
  <div class="container mx-auto p-4 max-w-4xl">
    <div class="mb-4">
      <router-link to="/" class="text-blue-600 hover:underline">&larr; Back to Channels</router-link>
    </div>
    
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Channel Analysis Export</h1>
      <p class="text-gray-600 mt-2">Copy this markdown text to use with AI tools for channel analysis.</p>
    </div>
    
    <div class="mb-4">
      <textarea
        ref="textareaRef"
        class="w-full h-[600px] p-4 border rounded font-mono text-sm"
        readonly
        v-model="markdownContent"
      ></textarea>
    </div>
    
    <div class="flex justify-end">
      <button
        @click="copyToClipboard"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Copy to Clipboard
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const textareaRef = ref(null);
const markdownContent = ref('');

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(markdownContent.value);
    alert('Copied to clipboard!');
  } catch (err) {
    console.error('Failed to copy:', err);
    // Fallback: select the text for manual copying
    textareaRef.value.select();
    alert('Please use Ctrl+C to copy the selected text');
  }
};

onMounted(() => {
  // Get the markdown content from localStorage
  const markdown = localStorage.getItem('exportMarkdown');
  if (!markdown) {
    // If no markdown content is provided, redirect back to channels
    router.push('/');
    return;
  }
  
  markdownContent.value = markdown;
  // Clear the stored markdown
  localStorage.removeItem('exportMarkdown');
});
</script>