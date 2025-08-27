<template>
  <div
    class="grid footer-grid mt-4"
    :style="{
      gridTemplateColumns: 'repeat(' + columns + ', 1fr)',
      columnGap: columnGap + 'px',
      marginTop: footerGap + 'px'
    }"
  >
    <input
      v-for="i in columns"
      :key="i-1"
      type="text"
      class="caption-input"
      v-model="localFooters[i-1]"
      :placeholder="resolvePlaceholder(i)"
      :style="{ fontSize: fontSize + 'px' }"
      @input="emitUpdate"
    />
  </div>
</template>

<script setup>
import { watch, ref } from 'vue'

const props = defineProps({
  footers: { type: Array,  default: () => [] },
  columns: { type: Number, default: 0 },
  fontSize:{ type: Number, default: 12 },
  columnGap:{ type: Number, default: 0 },
  footerGap:{ type: Number, default: 0 },
  placeholder: { type: Function }
  // 既支持字符串占位 '第 {i} 列脚注'，也支持函数 (i)=>string
  // placeholder: { type: [Function, String], default: '第 {i} 列脚注' }
})
const emit = defineEmits(['update:footers'])

const localFooters = ref([])

function syncLocal() {
  const cols = Math.max(0, Number(props.columns) || 0)
  const src = Array.isArray(props.footers) ? props.footers : []
  const next = new Array(cols).fill('')
  for (let i = 0; i < cols; i++) next[i] = src[i] ?? ''
  localFooters.value = next
}
watch([() => props.columns, () => props.footers], syncLocal, { immediate: true, deep: true })

function resolvePlaceholder(i) {
  const ph = props.placeholder
  return typeof ph === 'function'
    ? ph(i)
    : String(ph).replace('{i}', String(i))
}

function emitUpdate() {
  emit('update:footers', [...localFooters.value])
}
</script>

<style scoped>
.caption-input {
  font-family: 'Times New Roman', Times, serif;
  width: 100%;
  text-align: center;
  padding: .5rem .25rem;
  background: transparent;
  color: #000000;
  border: none;
  outline: none;
}
</style>
