
<template>
  <div class="solid-card p-6 shadow-xl">
    <h2 class="text-xl font-semibold mb-4 border-b border-white/10 pb-2">{{ t('history.title') }}</h2>

    <div class="flex items-center gap-2 mb-4">
      <input
        v-model="saveName"
        type="text"
        class="field flex-grow"
        :placeholder="t('history.namePH')"
        @keydown.enter.prevent="doSave"
      />
      <button @click="doSave" class="btn-primary shrink-0 px-4">{{ t('history.save') }}</button>
    </div>

    <div class="space-y-2">
      <template v-if="historyList.length === 0">
        <p class="opacity-70 text-center text-sm">{{ t('history.empty') }}</p>
      </template>
      <div v-else v-for="item in historyList" :key="item.id" class="history-item">
        <span class="truncate pr-4">{{ item.name }}</span>
        <div class="flex-shrink-0 space-x-2">
          <button class="btn-primary text-sm font-semibold" @click="$emit('load', item.id)">{{ t('common.load') }}</button>
          <button class="btn-primary text-sm font-semibold" @click="$emit('delete', item.id)">{{ t('common.delete') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
defineProps({t: Function, historyList: { type: Array, default: () => [] } })
const emit = defineEmits(['save','load','delete'])

const saveName = ref('')

function doSave(){
  const n = (saveName.value || '').trim()
  emit('save', n)
  saveName.value = ''
}
</script>

<style scoped>
.history-item {
  display: flex; justify-content: space-between; align-items: center;
  padding: 0.75rem; border-radius: 0.75rem; transition: none;
  background: var(--item-bg);
  border: 1px solid var(--item-border);
}
.history-item .truncate { color: var(--history-title); font-weight: 600; }

.input {
  background: var(--input-bg, rgba(255,255,255,0.06));
  border: 1px solid var(--input-border, rgba(255,255,255,0.12));
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  outline: none;
  width: 100%;
}
.input:focus {
  border-color: #2563eb66;
  box-shadow: 0 0 0 3px #2563eb22;
}
</style>
