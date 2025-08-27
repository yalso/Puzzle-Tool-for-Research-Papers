
<template>
  <div v-if="gridEl && columns > 0 && rows > 0" class="add-layer">
    <!-- ROW: 在左右两侧，显示上下两个“新增行”按钮（上=before，下=after） -->
    <button v-if="hoverRow >= 0"
            class="handle handle-add handle-row left top"
            :style="rowAddStyle('left','top')"
            title="上方增加一行"
			@pointerdown.stop.prevent="lockedRow = hoverRow"
            @click.stop.prevent="emitInsertRow('before')" />
    <button v-if="hoverRow >= 0"
            class="handle handle-add handle-row left bottom"
            :style="rowAddStyle('left','bottom')"
            title="下方增加一行"
			@pointerdown.stop.prevent="lockedRow = hoverRow"
            @click.stop.prevent="emitInsertRow('after')" />
    <button v-if="hoverRow >= 0"
            class="handle handle-add handle-row right top"
            :style="rowAddStyle('right','top')"
            title="上方增加一行"
			@pointerdown.stop.prevent="lockedRow = hoverRow"
            @click.stop.prevent="emitInsertRow('before')" />
    <button v-if="hoverRow >= 0"
            class="handle handle-add handle-row right bottom"
            :style="rowAddStyle('right','bottom')"
            title="下方增加一行"
			@pointerdown.stop.prevent="lockedRow = hoverRow"
            @click.stop.prevent="emitInsertRow('after')" />

    <!-- COL: 在上下两侧，显示左右两个“新增列”按钮（左=before，右=after） -->
    <button v-if="hoverCol >= 0"
            class="handle handle-add handle-col top left"
            :style="colAddStyle('top','left')"
            title="左侧增加一列"
			@pointerdown.stop.prevent="lockedCol = hoverCol"
            @click.stop.prevent="emitInsertCol('before')" />
    <button v-if="hoverCol >= 0"
            class="handle handle-add handle-col top right"
            :style="colAddStyle('top','right')"
            title="右侧增加一列"
			@pointerdown.stop.prevent="lockedCol = hoverCol"
            @click.stop.prevent="emitInsertCol('after')" />
    <button v-if="hoverCol >= 0"
            class="handle handle-add handle-col bottom left"
            :style="colAddStyle('bottom','left')"
            title="左侧增加一列"
			@pointerdown.stop.prevent="lockedCol = hoverCol"
            @click.stop.prevent="emitInsertCol('before')" />
    <button v-if="hoverCol >= 0"
            class="handle handle-add handle-col bottom right"
            :style="colAddStyle('bottom','right')"
            title="右侧增加一列"
			@pointerdown.stop.prevent="lockedCol = hoverCol"
            @click.stop.prevent="emitInsertCol('after')" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  gridEl:   { type: Object, required: false, default: null },
  footerEl: { type: Object, required: false, default: null },
  columns:  { type: Number, required: true },
  rows:     { type: Number, required: true },
  cells:    { type: Array,  required: false, default: () => [] },
  footers:  { type: Array,  required: false, default: () => [] },
})

const emit = defineEmits(['insert'])

const HANDLE_SIZE = 28
const GAP = 8
const OUTER_SHIFT = (HANDLE_SIZE + GAP) * 1.5  // 新增按钮在更外侧
const HANDLE_OFFSET = 6

const hoverIndex = ref(-1)
const hoverRow   = ref(-1)
const hoverCol   = ref(-1)
let   clearTimer = null
let   hideUntilTs= 0
const HOVER_LINGER_MS = 450
const HIDE_COOLDOWN_MS = 150
const lockedRow = ref(-1)
const lockedCol = ref(-1)

function elOf(x) { return x ? (x.$el ? x.$el : (x.value ? x.value : x)) : null }
function gridRect()   { const el = elOf(props.gridEl);   return el?.getBoundingClientRect ? el.getBoundingClientRect() : null }
function children()   { const el = elOf(props.gridEl);   return Array.from(el?.children || []) }

function indexFromPoint(x, y) {
  const list = children()
  for (let i=0;i<list.length;i++) {
    const r = list[i]?.getBoundingClientRect?.()
    if (r && x>=r.left && x<=r.right && y>=r.top && y<=r.bottom) return i
  }
  return -1
}
function rowCenterY(r) {
  const list = children(); const first = list[r * props.columns]
  const rr = first?.getBoundingClientRect?.(); return rr ? (rr.top + rr.height/2) : 0
}
function colCenterX(c) {
  const list = children(); const first = list[c]
  const rr = first?.getBoundingClientRect?.(); return rr ? (rr.left + rr.width/2) : 0
}

function cancelClear(){ if (clearTimer){ clearTimeout(clearTimer); clearTimer=null } }
function scheduleClear(){ cancelClear(); clearTimer=setTimeout(()=>{ hoverIndex.value=hoverRow.value=hoverCol.value=-1 }, HOVER_LINGER_MS) }
function hideImmediately(){ hoverIndex.value=-1; hoverRow.value=-1; hoverCol.value=-1 }
function onWheel(){ hideImmediately(); hideUntilTs = performance.now() + HIDE_COOLDOWN_MS }

function onPointerMove(e) {
  if (performance.now() < hideUntilTs) return
  const gr = gridRect(); const x=e.clientX, y=e.clientY
  const inside = !!(gr && x>=gr.left && x<=gr.right && y>=gr.top && y<=gr.bottom)
  if (!inside) return scheduleClear()
  cancelClear()

  const idx = indexFromPoint(x,y)
  if (idx >= 0 && props.columns > 0){
    hoverIndex.value = idx
    hoverRow.value = Math.floor(idx / props.columns)
    hoverCol.value = idx % props.columns
  } else {
    let bestRow=-1, minDy=Infinity, bestCol=-1, minDx=Infinity
    const list = children()
    for (let r=0;r<props.rows;r++){
      const first = list[r*props.columns]; if (!first) continue
      const rr = first.getBoundingClientRect(); const cy=rr.top+rr.height/2
      const d = Math.abs(y - cy); if (d<minDy){ minDy=d; bestRow=r }
    }
    for (let c=0;c<props.columns;c++){
      const first = list[c]; if (!first) continue
      const rr = first.getBoundingClientRect(); const cx=rr.left+rr.width/2
      const d = Math.abs(x - cx); if (d<minDx){ minDx=d; bestCol=c }
    }
    hoverRow.value = bestRow; hoverCol.value = bestCol
    hoverIndex.value = (bestRow>=0 && bestCol>=0) ? (bestRow*props.columns + bestCol) : -1
  }
}

onMounted(()=>{
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('wheel', onWheel, { passive: true })
})
onBeforeUnmount(()=>{
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('wheel', onWheel)
})

function rowAddStyle(side, pos) {
  const gr = gridRect(); if (!gr) return {}
  const y = rowCenterY(hoverRow.value)
  const left = (side === 'left') ? (gr.left - HANDLE_OFFSET) : (gr.right + HANDLE_OFFSET)
  const top = y + ((pos==='top' ? -1 : 1) * OUTER_SHIFT)
  return { top: top+'px', left: left+'px' }
}
function colAddStyle(side, pos) {
  const gr = gridRect(); if (!gr) return {}
  const x = colCenterX(hoverCol.value)
  const baseTop = (side === 'top') ? (gr.top - HANDLE_OFFSET) : (gr.bottom + HANDLE_OFFSET)
  const left = x + ((pos==='left' ? -1 : 1) * OUTER_SHIFT)
  return { top: baseTop+'px', left: left+'px' }
}

function emitInsertRow(where){
  const idx = (lockedRow.value >= 0) ? lockedRow.value : hoverRow.value
  lockedRow.value = -1
  if (idx >= 0) emit('insert', { type:'row', index: idx, where })
}
function emitInsertCol(where){
  const idx = (lockedCol.value >= 0) ? lockedCol.value : hoverCol.value
  lockedCol.value = -1
  if (idx >= 0) emit('insert', { type:'col', index: idx, where })
}
</script>

<style scoped>
.add-layer { position: fixed; inset: 0; z-index: 62; pointer-events: none; }

/* 与删除按钮一致的风格，只是颜色改为淡蓝色 */
.handle {
  position: fixed;
  width: 28px;
  height: 28px;
  border-radius: 9999px;
  pointer-events: auto;
  background: white;
  border: 2px solid #60a5fa; /* blue-400 */
  box-shadow: 0 2px 10px rgba(0,0,0,.18);
}

.handle-row.left   { transform: translate(-100%, -50%); }
.handle-row.right  { transform: translate(0, -50%); }
.handle-col.top    { transform: translate(-50%, -100%); }
.handle-col.bottom { transform: translate(-50%, 0); }

/* 加号图形 */
.handle::before,
.handle::after {
  content: "";
  position: absolute;
  background: #60a5fa;
  border-radius: 2px;
}
.handle::before { left: 7px; right: 7px; top: 50%; height: 2px; transform: translateY(-50%); } /* 横线 */
.handle::after  { top: 7px; bottom: 7px; left: 50%; width: 2px; transform: translateX(-50%); } /* 竖线 */

@media (prefers-color-scheme: dark) {
  .handle { background: #0b1220; }
}
</style>
