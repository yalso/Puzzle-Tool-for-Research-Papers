<template>
  <div class="solid-card p-6 shadow-xl">
    <h2 class="text-xl font-semibold mb-4 border-b border-white/10 pb-2">{{ t('layout.title') }}</h2>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium mb-1">{{ t('layout.columns') }}</label>
        <input type="number" :value="columns" min="1" class="field" @input="$emit('update:columns', Number($event.target.value))" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">{{ t('layout.rows') }}</label>
        <input type="number" :value="rows" min="1" class="field" @input="$emit('update:rows', Number($event.target.value))" />
      </div>
      <div class="col-span-2 grid grid-cols-2 gap-2">
        <button @click="$emit('generate')" class="w-full mt-2 btn-primary">{{ t('layout.generate') }}</button>
        <button @click="$emit('clear')" class="w-full mt-2 btn-primary">{{ t('layout.clear') }}</button>
      </div>
    </div>
  </div>
</template>
<script setup>
const { t, columns, rows } = defineProps({
  t: Function,
  columns: Number,
  rows: Number,
})

const emit = defineEmits(['update:columns','update:rows','generate','clear'])
</script>
