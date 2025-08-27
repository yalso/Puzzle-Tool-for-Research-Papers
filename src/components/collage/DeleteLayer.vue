
<template>
  <div v-if="gridEl && columns > 0 && rows > 0" class="delete-layer">
    <!-- Row delete (left/right), vertically centered; shifted DOWN by half spread -->
    <button v-if="hoverRow >= 0"
            class="handle handle-delete handle-row left"
            :style="rowDeleteStyle('left')"
            title="删除该行"
			@pointerdown.stop.prevent="lockedRow = hoverRow"
            @click.stop.prevent="emitDeleteRow" />
    <button v-if="hoverRow >= 0"
            class="handle handle-delete handle-row right"
            :style="rowDeleteStyle('right')"
            title="删除该行"
			@pointerdown.stop.prevent="lockedRow = hoverRow"
            @click.stop.prevent="emitDeleteRow" />

    <!-- Column delete (top/bottom), horizontally centered; shifted RIGHT by half spread -->
    <button v-if="hoverCol >= 0"
            class="handle handle-delete handle-col top"
            :style="colDeleteStyle('top')"
            title="删除该列（含脚注）"
			@pointerdown.stop.prevent="lockedCol = hoverCol"
            @click.stop.prevent="emitDeleteCol" />
    <button v-if="hoverCol >= 0"
            class="handle handle-delete handle-col bottom"
            :style="colDeleteStyle('bottom')"
            title="删除该列（含脚注）"
			@pointerdown.stop.prevent="lockedCol = hoverCol"
            @click.stop.prevent="emitDeleteCol" />
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

const emit = defineEmits(['delete'])
let hideUntilTs = 0
const HIDE_COOLDOWN_MS = 150
// ---- unified sizing/spacing ----
const HANDLE_SIZE = 28
const GAP = 8
const SPREAD = HANDLE_SIZE + GAP
const HANDLE_OFFSET = 6

// ==== 内部状态 ====
const hoverIndex = ref(-1)
const hoverRow   = ref(-1)
const hoverCol   = ref(-1)
let clearTimer   = null
const HOVER_LINGER_MS = 450
const lockedRow = ref(-1)
const lockedCol = ref(-1)
// ---- utils ----
function elOf(x) { return x ? (x.$el ? x.$el : (x.value ? x.value : x)) : null }
function gridRect()   { const el = elOf(props.gridEl);   return el?.getBoundingClientRect ? el.getBoundingClientRect() : null }
function footerRect() { const el = elOf(props.footerEl); return el?.getBoundingClientRect ? el.getBoundingClientRect() : null }
function children()   { const el = elOf(props.gridEl);   return Array.from(el?.children || []) }

function indexFromPoint(x, y) {
  const list = children()
  for (let i = 0; i < list.length; i++) {
    const r = list[i]?.getBoundingClientRect?.()
    if (!r) continue
    if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return i
  }
  return -1
}
function rowCenterY(r) {
  const list = children(); const first = list[r * props.columns]
  const rr = first?.getBoundingClientRect?.(); return rr ? (rr.top + rr.height / 2) : 0
}
function colCenterX(c) {
  const list = children(); const first = list[c]
  const rr = first?.getBoundingClientRect?.(); return rr ? (rr.left + rr.width / 2) : 0
}

function cancelClear(){ if (clearTimer){ clearTimeout(clearTimer); clearTimer=null } }
function scheduleClear(){ cancelClear(); clearTimer=setTimeout(()=>{ hoverIndex.value=hoverRow.value=hoverCol.value=-1 }, HOVER_LINGER_MS) }

function onPointerMove(e) {
  const gr = gridRect()
  const x = e.clientX, y = e.clientY
  const inside = !!(gr && x >= gr.left && x <= gr.right && y >= gr.top && y <= gr.bottom)
  if (performance.now() < hideUntilTs) return
  if (!inside) return scheduleClear()
  cancelClear()

  const idx = indexFromPoint(x, y)
  if (idx >= 0 && props.columns > 0) {
    hoverIndex.value = idx
    hoverRow.value = Math.floor(idx / props.columns)
    hoverCol.value = idx % props.columns
  } else {
    let bestRow=-1, minDy=Infinity, bestCol=-1, minDx=Infinity
    const list = children()
    for (let r=0;r<props.rows;r++){
      const first = list[r*props.columns]; if (!first) continue
      const rr = first.getBoundingClientRect(); const cy = rr.top + rr.height/2
      const d = Math.abs(y - cy); if (d<minDy){ minDy=d; bestRow=r }
    }
    for (let c=0;c<props.columns;c++){
      const first = list[c]; if (!first) continue
      const rr = first.getBoundingClientRect(); const cx = rr.left + rr.width/2
      const d = Math.abs(x - cx); if (d<minDx){ minDx=d; bestCol=c }
    }
    hoverRow.value = bestRow; hoverCol.value = bestCol
    hoverIndex.value = (bestRow>=0 && bestCol>=0) ? (bestRow*props.columns + bestCol) : -1
  }
}

onMounted(()=>{ window.addEventListener('pointermove', onPointerMove, { passive: true }) })
onBeforeUnmount(()=>{ window.removeEventListener('pointermove', onPointerMove) })

// ---- centered styles + symmetric offsets ----
function rowDeleteStyle(side) {
  const gr = gridRect(); if (!gr) return {}
  const y = rowCenterY(hoverRow.value)
  const left = (side === 'left') ? (gr.left - HANDLE_OFFSET) : (gr.right + HANDLE_OFFSET)
  const top = y + ((HANDLE_SIZE + GAP)/2) // Delete goes DOWN by half spread
  return { top: top+'px', left: left+'px' }
}
function colDeleteStyle(side) {
  const gr = gridRect(); if (!gr) return {}
  const x = colCenterX(hoverCol.value)
  const fr = footerRect()
  const bottomY = fr ? Math.max(gr.bottom, fr.bottom) : gr.bottom
  //const baseTop = (side==='top') ? (gr.top - 6) : (bottomY + 6) // The button is located below the footer.
  //The button is located below the last image grid.
  const baseTop = (side==='top') ? (gr.top - HANDLE_OFFSET) : (gr.bottom + HANDLE_OFFSET) 
  const left = x + ((HANDLE_SIZE + GAP)/2) // Delete goes RIGHT by half spread
  return { top: baseTop+'px', left: left+'px' }
}


function hideImmediately(){
  // DragSwapLayer 里还会把 dragging/dragMode 清掉
  hoverIndex.value = hoverRow.value = hoverCol.value = -1
}

function onWheel(){
  hideImmediately()
  hideUntilTs = performance.now() + HIDE_COOLDOWN_MS
}

onMounted(()=>{
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('wheel', onWheel, { passive: true })  // ✅ 只监听 wheel
})
onBeforeUnmount(()=>{
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('wheel', onWheel)
})
// ---- emit ----
function emitDeleteRow() {
  const idx = (lockedRow.value >= 0) ? lockedRow.value : hoverRow.value
  lockedRow.value = -1
  if (idx >= 0) emit('delete', { type: 'row', index: idx })
}
function emitDeleteCol() {
  const idx = (lockedCol.value >= 0) ? lockedCol.value : hoverCol.value
  lockedCol.value = -1
  if (idx >= 0) emit('delete', { type: 'col', index: idx })
}
</script>

<style scoped>
/* Overlay */
.delete-layer { position: fixed; inset: 0; z-index: 61; pointer-events: none; }

/* Unified handle look (same size as drag, distinct color) */
.handle {
  position: fixed;
  width: 28px;
  height: 28px;
  border-radius: 9999px;
  pointer-events: auto;
  background: white;
  border: 2px solid #dc2626; /* red-600 */
  box-shadow: 0 2px 10px rgba(0,0,0,.18);
}

.handle-row.left   { transform: translate(-100%, -50%); }
.handle-row.right  { transform: translate(0, -50%); }
.handle-col.top    { transform: translate(-50%, -100%); }
.handle-col.bottom { transform: translate(-50%, 0); }

/* Minus glyph */
.handle::after {
  content: "";
  position: absolute;
  left: 7px; right: 7px; top: 50%; height: 2px;
  transform: translateY(-50%);
  background: #dc2626;
  border-radius: 2px;
}

@media (prefers-color-scheme: dark) {
  .handle { background: #0b1220; }
}
</style>
