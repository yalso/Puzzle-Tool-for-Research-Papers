<template>
  <div class="solid-card p-6 shadow-xl mb-8">
    <h2 class="text-xl font-semibold mb-4 border-b border-white/10 pb-2">{{ t('export.title') }}</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
      <div class="md:col-span-2 flex items-center gap-2">
        <input type="text" :value="fileBase" class="field flex-grow" @input="$emit('update:file-base', $event.target.value)" :placeholder="t('export.filename')" />
        <select :value="format" class="select" @change="$emit('update:format', $event.target.value)">
          <option value="png">.png</option>
          <option value="jpeg">.jpeg</option>
          <option value="pdf">.pdf</option>
        </select>
      </div>
      <button :disabled="loading" @click="$emit('export')" class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        <span>{{ t('export.download') }}</span>
      </button>
    </div>
    <div v-if="loading" class="mt-4 text-center text-blue-400">{{ t('export.generating') }}</div>
  </div>
</template>
<script setup>
defineProps({t: Function, fileBase: String, format: String, loading: Boolean })
defineEmits(['update:file-base','update:format','export'])
</script>
