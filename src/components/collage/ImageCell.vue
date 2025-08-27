<template>
  <div
    class="image-upload-box"
    :class="{ active: active, empty: !cell?.src, 'with-border': !!cell?.src && showImageBorder }"
    @click="onCellClick"
  >
    <div v-if="!cell?.src" class="upload-prompt flex flex-col items-center justify-center p-2 select-none">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mb-2 icon-contrast">
        <path d="M21.2 15c.7-1.2 1-2.5.7-3.9-.6-2.4-2.4-4.2-4.8-4.8-.9-.3-1.8-.5-2.7-.5-1.7 0-3.3.7-4.5 2-1.2-1.3-2.8-2-4.5-2-2.5 0-4.7 1.8-5.2 4.2-.5 2.5.7 5 3.2 5.7.5.1 1 .2 1.5.2H20c.7 0 1.3-.2 1.8-.5l-.6-1.2z"/>
        <path d="M12 12v9"/>
        <path d="m16 16-4-4-4 4"/>
      </svg>
      <span class="upload-text-contrast">{{ t('cell.uploadPrompt') }}</span>
    </div>
    <input ref="fileInput" type="file" accept="image/*" class="image-input hidden" @change="onUpload" />
    <img v-if="cell?.src" :src="cell.src" class="preview-img" />
  </div>
</template>
<script setup>
import { ref } from 'vue'

const {t, idx, cell, active, showImageBorder} = defineProps({
  t: Function,
  idx: Number,
  cell: Object,
  active: Boolean,
  showImageBorder: Boolean
})
const emit = defineEmits(['request-active','set-cell'])

const fileInput = ref(null)
function onCellClick() {
  emit('request-active', idx)
  fileInput.value?.click()
}
function onUpload(e) {
  const file = e.target?.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    const src = ev.target?.result
    if (typeof src === 'string') emit('set-cell', idx, src)
  }
  reader.readAsDataURL(file)
}
</script>
<style scoped>
.image-upload-box {
  position: relative; width: 100%; border: none;
  display: flex; align-items: center; justify-content: center;
  background-color: var(--slot-bg);
  overflow: hidden; transition: all 0.2s ease-in-out;
  min-height: 100px; cursor: pointer;
}
.image-upload-box:hover { background-color: var(--slot-hover); }
.image-upload-box.active { outline: 2px solid rgba(59,130,246,.4); }
.image-upload-box.empty { border: 2px dashed var(--line-strong); }
.image-upload-box.with-border { border: 1px solid var(--line); }
.preview-img { width: 100%; height: 100%; object-fit: contain; position: absolute; top: 0; left: 0; pointer-events: none; }
.upload-text-contrast { color: var(--slot-text); font-weight: 600; }
.icon-contrast { stroke: var(--slot-text); }
</style>
