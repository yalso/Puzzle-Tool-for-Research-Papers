<template>
  <div ref="wrapperRef" class="transition-all duration-300 collage-wrapper" :style="wrapperStyle">
    <div ref="containerRef" class="flex flex-col">
      <p v-if="!hasGrid" class="text-slate-700/80 dark:text-slate-200/70 text-center py-10 font-semibold">
        请在上方设置行列数并点击“生成网格”
      </p>

      <div v-else ref="gridRef" class="grid image-grid" :style="imageGridStyle">
        <ImageCell
		  :t="props.t"
          v-for="(cell, idx) in cells"
          :key="(cell && (cell.id || cell.src)) ? (cell.id || cell.src) : idx"
          :idx="idx"
          :cell="cell"
          :active="activeIndex === idx"
          :show-image-border="showImageBorder"
          @request-active="(i)=> $emit('update:active-index', i)"
          @set-cell="(i, src)=> $emit('set-cell', i, src)"
        />
      </div>

      <!-- 拖拽层 -->
      <DragSwapLayer
        v-if="hasGrid && gridRef"
        :grid-el="gridRef"
        :columns="columns"
        :rows="rows"
        :cells="cells"
        :footers="footers"
        :footer-el="footerRef"
        @swap="(p) => $emit('swap', p)"
      />

      <!-- 删除层 -->
      <DeleteLayer
        v-if="hasGrid && gridRef"
        :grid-el="gridRef"
        :columns="columns"
        :rows="rows"
        :cells="cells"
        :footers="footers"
        :footer-el="footerRef"
        @delete="$emit('delete', $event)"
      />
		<!-- 新增层 -->
		<AddLayer
		  :grid-el="gridRef"
		  :footer-el="footerRef"
		  :columns="columns"
		  :rows="rows"
		  :cells="cells"
		  :footers="footers"
		  @insert="$emit('insert', $event)"
		/>

      <!-- 脚注 -->
      <div ref="footerRef" v-if="hasGrid">
        <FooterCaptions
          :footers="footers"
          :columns="columns"
          :font-size="fontSize"
          :column-gap="columnGap"
          :footer-gap="footerGap"
		  :placeholder="(i) => props.t('footer.placeholder', { i })"
          @update:footers="(arr)=> $emit('update-footers', arr)"

        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import ImageCell from './ImageCell.vue'
import FooterCaptions from './FooterCaptions.vue'
import DragSwapLayer from './DragSwapLayer.vue'
import DeleteLayer from './DeleteLayer.vue'
import AddLayer from './AddLayer.vue'

const props = defineProps({
  t: Function, 
  columns: { type: Number, default: 0 },
  rows: { type: Number, default: 0 },
  cells: { type: Array, default: () => [] },
  footers: { type: Array, default: () => [] },
  activeIndex: { type: Number, default: -1 },
  pageMargin: { type: Number, default: 0 },
  columnGap: { type: Number, default: 0 },
  rowGap: { type: Number, default: 0 },
  footerGap: { type: Number, default: 0 },
  fontSize: { type: Number, default: 16 },
  bgColor: { type: String, default: '' },
  showImageBorder: { type: Boolean, default: false }
})
const emit = defineEmits(['update:active-index','set-cell','update-footers','swap','delete'])

const containerRef = ref(null)
const wrapperRef = ref(null)
const gridRef = ref(null)
const footerRef = ref(null)

// 关键：提供 hasGrid，避免渲染时未定义
const hasGrid = computed(() => {
  const c = Number(props.columns) || 0
  const r = Number(props.rows) || 0
  return c > 0 && r > 0 && (props.cells?.length || 0) === c * r
})

const wrapperStyle = computed(() => ({
  padding: (props.pageMargin ?? 0) + 'px',
  backgroundColor: props.bgColor || 'transparent',
}))

const imageGridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${Math.max(1, props.columns || 1)}, 1fr)`,
  columnGap: (props.columnGap ?? 0) + 'px',
  rowGap: (props.rowGap ?? 0) + 'px',
}))

function updateAllRowHeights() {
  const grid = containerRef.value?.querySelector('.image-grid')
  if (!grid) return
  const cols = Math.max(1, props.columns || 1)
  const rws = Math.max(1, props.rows || 1)
  const all = Array.from(grid.children)
  for (let r = 0; r < rws; r++) {
    const first = all[r * cols]
    if (!first) continue
    const idx = r * cols
    const cell = props.cells[idx]
    if (cell?.src && cell.naturalW > 0) {
      const boxWidth = first.clientWidth
      const aspect = cell.naturalH / cell.naturalW
      const newH = boxWidth * aspect
      for (let c = 0; c < cols; c++) {
        const el = all[r * cols + c]
        if (el) el.style.height = `${newH}px`
      }
    } else {
      for (let c = 0; c < cols; c++) {
        const el = all[r * cols + c]
        if (el) el.style.removeProperty('height')
      }
    }
  }
}

watch(() => [props.columns, props.rows], () => nextTick(updateAllRowHeights))
watch(() => props.cells, () => nextTick(updateAllRowHeights), { deep: true })

onMounted(() => {
  if (typeof window !== 'undefined') window.addEventListener('resize', updateAllRowHeights, { passive: true })
  nextTick(updateAllRowHeights)
})
onBeforeUnmount(() => {
  if (typeof window !== 'undefined') window.removeEventListener('resize', updateAllRowHeights)
})

defineExpose({
  getWrapperEl: () => wrapperRef.value,
  updateAllRowHeights
})
</script>

<style scoped>
.collage-wrapper { border: 2px dashed var(--line-strong); border-radius: 12px; transition: all .3s ease; }
.image-grid { display: grid; width: 100%; }
</style>