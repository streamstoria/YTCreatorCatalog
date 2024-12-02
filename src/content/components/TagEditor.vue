<template>
    <div class="flex flex-wrap gap-2">
      <!-- Existing tags -->
      <span 
        v-for="tag in modelValue" 
        :key="tag"
        class="bg-blue-100 text-blue-800 px-4 py-1 rounded-full flex items-center gap-1 text-2xl"
      >
        {{ tag }}
        <button 
          @click="removeTag(tag)" 
          class="text-blue-600 hover:text-blue-800 ml-1 text-2xl"
          aria-label="Remove tag"
        >×</button>
      </span>
      
      <!-- Tag input -->
      <input
        ref="inputRef"
        v-model="inputValue"
        @keydown="handleKeydown"
        @paste="handlePaste"
        @blur="handleBlur"
        type="text"
        :placeholder="placeholder"
        class="flex-1 px-2 py-1 border rounded text-2xl min-w-[200px]"
      />
    </div>
  </template>
  <style scoped>
  @import '../../assets/style.css';
  </style>
  <script setup>
  import { ref } from 'vue';
  
  const props = defineProps({
    modelValue: {
      type: Array,
      required: true
    },
    placeholder: {
      type: String,
      default: 'Add tags... (separate by comma)'
    }
  });
  
  const emit = defineEmits(['update:modelValue', 'add', 'remove']);
  
  const inputRef = ref(null);
  const inputValue = ref('');
  
  const processTags = (value) => {
    // Split only by commas, preserving spaces within tags
    return value
      .split(',')
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag.length > 0)
      // Remove duplicates and existing tags
      .filter((tag, index, self) => 
        self.indexOf(tag) === index && !props.modelValue.includes(tag)
      );
  };
  
  const addTags = (tagsToAdd) => {
    for (const tag of tagsToAdd) {
      if (tag && !props.modelValue.includes(tag)) {
        emit('add', tag);
      }
    }
  };
  
  const handleKeydown = (e) => {
    // Handle Enter
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.value) {
        const tagsToAdd = processTags(inputValue.value);
        addTags(tagsToAdd);
        inputValue.value = '';
      }
    }
    // Handle Comma
    if (e.key === ',') {
      e.preventDefault();
      if (inputValue.value) {
        const tagsToAdd = processTags(inputValue.value);
        addTags(tagsToAdd);
        inputValue.value = '';
      }
    }
    // Handle Backspace to edit last tag
    if (e.key === 'Backspace' && !inputValue.value && props.modelValue.length > 0) {
      const lastTag = props.modelValue[props.modelValue.length - 1];
      removeTag(lastTag);
      inputValue.value = lastTag;
      // Focus input after setting value
      inputRef.value?.focus();
    }
  };
  
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const tagsToAdd = processTags(pastedText);
    addTags(tagsToAdd);
    inputValue.value = '';
  };
  
  const handleBlur = () => {
    if (inputValue.value) {
      const tagsToAdd = processTags(inputValue.value);
      addTags(tagsToAdd);
      inputValue.value = '';
    }
  };
  
  const removeTag = (tag) => {
    emit('remove', tag);
  };
  </script>