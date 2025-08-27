
<template>
  <div class="drag-layer" v-show="visible">
    <!-- Row handles (left/right), vertically centered -->
    <button
      v-if="hoverRow >= 0"
      class="handle handle-drag handle-row left"
      :style="rowHandleStyle('left')"
      title="拖动整行"
      @pointerdown.prevent.stop="startDragRow"
    />
    <button
      v-if="hoverRow >= 0"
      class="handle handle-drag handle-row right"
      :style="rowHandleStyle('right')"
      title="拖动整行"
      @pointerdown.prevent.stop="startDragRow"
    />

    <!-- Column handles (top/bottom), horizontally centered -->
    <button
      v-if="hoverCol >= 0"
      class="handle handle-drag handle-col top"
      :style="colHandleStyle('top')"
      title="拖动整列"
      @pointerdown.prevent.stop="startDragCol"
    />
    <button
      v-if="hoverCol >= 0"
      class="handle handle-drag handle-col bottom"
      :style="colHandleStyle('bottom')"
      title="拖动整列"
      @pointerdown.prevent.stop="startDragCol"
    />

    <!-- (Optional) highlights retained -->
    <div v-if="hoverRow >= 0" class="highlight highlight-row" :style="rowHighlightStyle(hoverRow)"></div>
    <div v-if="hoverCol >= 0" class="highlight highlight-col" :style="colHighlightStyle(hoverCol)"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  gridEl: { type: Object, required: false, default: null },
  footerEl: { type: Object, required: false, default: null },
  columns: { type: Number, required: true },
  rows: { type: Number, required: true },
  cells: { type: Array, required: false, default: () => [] },
  footers: { type: Array, required: false, default: () => [] },
})
const emit = defineEmits(['swap'])
let hideUntilTs = 0
const HIDE_COOLDOWN_MS = 150
// ---- unified sizes/colors ----
const HANDLE_SIZE = 28       // px (统一大小)
const BORDER_WIDTH = 2       // px
const GAP = 8                // px (drag/delete 对称分离距离的一半将用这个派生)
const SPREAD = HANDLE_SIZE + GAP // 对称分离的总距离基准
const HANDLE_OFFSET = 6      // 手柄距离网格外侧的距离

const hoverIndex = ref(-1)
const hoverRow   = ref(-1)
const hoverCol   = ref(-1)

const dragging   = ref(false)
const dragMode   = ref(null) // 'row' | 'col'
const dragFrom   = ref(-1)
const dragTo     = ref(-1)

let clearHoverTimer = null

const visible = computed(() => hoverRow.value >= 0 || hoverCol.value >= 0)

function elOf(x){ return x ? (x.$el ? x.$el : (x.value ? x.value : x)) : null }
function gridRect(){ const el = elOf(props.gridEl); return el?.getBoundingClientRect ? el.getBoundingClientRect() : null }
function footerRect(){ const el = elOf(props.footerEl); return el?.getBoundingClientRect ? el.getBoundingClientRect() : null }
function children(){ const el = elOf(props.gridEl); return Array.from(el?.children || []) }

function indexFromPoint(x,y){
  const items = children()
  for (let i=0;i<items.length;i++){
    const r = items[i]?.getBoundingClientRect?.()
    if (r && x>=r.left && x<=r.right && y>=r.top && y<=r.bottom) return i
  }
  return -1
}
function rowCenterY(r){
  const items = children(); const first = items[r * props.columns]
  const rr = first?.getBoundingClientRect?.(); return rr ? (rr.top + rr.height/2) : 0
}
function colCenterX(c){
  const items = children(); const first = items[c]
  const rr = first?.getBoundingClientRect?.(); return rr ? (rr.left + rr.width/2) : 0
}

function cancelClear(){ if (clearHoverTimer){ clearTimeout(clearHoverTimer); clearHoverTimer=null } }
function scheduleClear(){
  cancelClear(); clearHoverTimer=setTimeout(()=>{
    if (!dragging.value){ hoverIndex.value=hoverRow.value=hoverCol.value=-1 }
  }, 450)
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

function onPointerMove(e){
  const gr = gridRect(); const x=e.clientX, y=e.clientY
  const inside = !!(gr && x>=gr.left && x<=gr.right && y>=gr.top && y<=gr.bottom)
  if (performance.now() < hideUntilTs) return
  if (inside) cancelClear()
  if (dragging.value){
    if (dragMode.value==='row'){
      let best=-1, bestDist=Infinity
      const items = children()
      for (let r=0;r<props.rows;r++){
        const first = items[r*props.columns]; if (!first) continue
        const rr = first.getBoundingClientRect(); const cy = rr.top + rr.height/2
        const d = Math.abs(y - cy); if (d<bestDist){ bestDist=d; best=r }
      }
      dragTo.value = best
    } else if (dragMode.value==='col'){
      let best=-1, bestDist=Infinity
      const items = children()
      for (let c=0;c<props.columns;c++){
        const first = items[c]; if (!first) continue
        const rr = first.getBoundingClientRect(); const cx = rr.left + rr.width/2
        const d = Math.abs(x - cx); if (d<bestDist){ bestDist=d; best=c }
      }
      dragTo.value = best
    }
    return
  }
  const idx = indexFromPoint(x,y)
  if (idx >= 0 && props.columns > 0){
    hoverIndex.value = idx
    hoverRow.value = Math.floor(idx / props.columns)
    hoverCol.value = idx % props.columns
  } else if (inside){
    let bestRow=-1, bestCol=-1, minDy=Infinity, minDx=Infinity
    const items = children()
    for (let r=0;r<props.rows;r++){
      const first = items[r*props.columns]; if (!first) continue
      const rr = first.getBoundingClientRect(); const cy=rr.top+rr.height/2
      const d = Math.abs(y - cy); if (d<minDy){ minDy=d; bestRow=r }
    }
    for (let c=0;c<props.columns;c++){
      const first = items[c]; if (!first) continue
      const rr = first.getBoundingClientRect(); const cx=rr.left+rr.width/2
      const d = Math.abs(x - cx); if (d<minDx){ minDx=d; bestCol=c }
    }
    hoverRow.value = bestRow; hoverCol.value = bestCol
    hoverIndex.value = (bestRow>=0 && bestCol>=0) ? (bestRow*props.columns + bestCol) : -1
  } else {
    scheduleClear()
  }
}

function onPointerUp(){
  if (!dragging.value) return
  const from=dragFrom.value, to=dragTo.value, mode=dragMode.value
  dragging.value=false; dragMode.value=null; dragFrom.value=-1
  if (to!=null && to>=0 && from!=null && from>=0 && from!==to){
    emit('swap', { type: mode, from, to })
  }
}

onMounted(()=>{
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('pointerup', onPointerUp, { passive: true })
})
onBeforeUnmount(()=>{
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
})

function startDragRow(){ dragging.value=true; dragMode.value='row'; dragFrom.value=hoverRow.value; dragTo.value=hoverRow.value }
function startDragCol(){ dragging.value=true; dragMode.value='col'; dragFrom.value=hoverCol.value; dragTo.value=hoverCol.value }

// ---- Centered styles with symmetric offset ----
function rowHandleStyle(side){
  const gr = gridRect(); if (!gr) return {}
  const y = rowCenterY(hoverRow.value)
  const left = (side==='left') ? (gr.left - 6) : (gr.right + 6)
  const top = y - ((HANDLE_SIZE + GAP)/2)  // Drag goes UP by half spread
  return { top: top+'px', left: left+'px' }
}
function colHandleStyle(side){
  const gr = gridRect(); if (!gr) return {}
  const x = colCenterX(hoverCol.value)
  const fr = footerRect()
  const bottomY = fr ? Math.max(gr.bottom, fr.bottom) : gr.bottom
  //const baseTop = (side==='top') ? (gr.top - 6) : (bottomY + 6) // The button is located below the footer.
  //The button is located below the last image grid.
  const baseTop = (side==='top') ? (gr.top - HANDLE_OFFSET) : (gr.bottom + HANDLE_OFFSET) 
  const left = x - ((HANDLE_SIZE + GAP)/2)    // Drag goes LEFT by half spread
  return { top: baseTop+'px', left: left+'px' }
}
function rowHighlightStyle(r){
  const items = children(); const first = items[r*props.columns]; if (!first) return {}
  const rr = first.getBoundingClientRect()
  const last = items[r*props.columns + (props.columns-1)] || first
  const rl = last.getBoundingClientRect()
  return { top: rr.top+'px', left: rr.left+'px', width: (rl.right-rr.left)+'px', height: (rr.bottom-rr.top)+'px' }
}
function colHighlightStyle(c){
  const items = children(); const first = items[c]; if (!first) return {}
  const rt = first.getBoundingClientRect()
  const last = items[(props.rows-1)*props.columns + c] || first
  const rb = last.getBoundingClientRect()
  const fr = footerRect()
  const bottom = fr ? Math.max(rb.bottom, fr.bottom) : rb.bottom
  return { top: rt.top+'px', left: rt.left+'px', width: rt.width+'px', height: (bottom-rt.top)+'px' }
}

</script>

<style scoped>
.drag-layer { position: fixed; inset: 0; z-index: 60; pointer-events: none; }

/* Unified handle style */
.handle {
  position: fixed;
  width: 28px;
  height: 28px;
  border-radius: 9999px;
  pointer-events: auto;
  background: white;
  border: 2px solid #2563eb; /* blue-600 */
  box-shadow: 0 2px 10px rgba(0,0,0,.18);
}

.handle-row.left   { transform: translate(-100%, -50%); }
.handle-row.right  { transform: translate(0, -50%); }
.handle-col.top    { transform: translate(-50%, -100%); }
.handle-col.bottom { transform: translate(-50%, 0); }

/* .highlight {
  position: fixed;
  background: rgba(37, 99, 235, 0.08);
  outline: 2px dashed rgba(37, 99, 235, 0.6);
  border-radius: 6px;
  pointer-events: none;
}*/

@media (prefers-color-scheme: dark) {
  .handle { background: #111827; }
}
</style>
