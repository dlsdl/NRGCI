<template>
  <div class="app-container">
    <!-- 固定按钮 -->
    <div class="fixed-buttons">
      <div class="canvas-info">{{ canvasInfoText }}</div>
      <button class="fixed-btn" @click="showTeleport = true">🗺️ 传送</button>
      <button class="fixed-btn" @click="showSaveWindow = true">💾 存档</button>
    </div>

    <!-- 可拖动画布 -->
    <div
      class="canvas-viewport"
      @mousedown="startDrag"
      @mousemove="onDrag"
      @mouseup="endDrag"
      @mouseleave="endDrag"
      @wheel.prevent="onZoom"
    >
      <div
        ref="canvasEl"
        class="canvas-content"
        :style="canvasStyle"
      >
        <!-- 基础区域 A1-A4 -->
        <div
          v-for="ai in 4"
          :key="'a'+ai"
          v-show="gameState.areas[ai-1].unlocked"
          class="area-block"
          :style="areaStyle(ai-1, false)"
        >
          <AreaGrid :areaIndex="ai-1" />
        </div>

        <!-- 高级区域 B1-B4 -->
        <div
          v-for="bi in 4"
          :key="'b'+bi"
          v-show="gameState.advancedAreas[bi-1].unlocked"
          class="area-block adv-area"
          :style="areaStyle(bi-1, true)"
        >
          <AdvancedGrid :areaIndex="bi-1" />
        </div>
      </div>
    </div>

    <!-- 传送弹窗 -->
    <TeleportModal v-if="showTeleport" @close="showTeleport = false" />

    <!-- 存档弹窗 -->
    <SaveWindow v-if="showSaveWindow" @close="showSaveWindow = false" />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { gameState, gameTick, viewTick, showTeleport, showSaveWindow, AREA_FULL_NAMES, ADVANCED_AREAS, getAreaPos, getAdvancedAreaPos, CELL } from './game/engine.js'
import { loadFromLocal, hasSave, startAutoSave, stopAutoSave } from './game/save.js'
import AreaGrid from './components/AreaGrid.vue'
import AdvancedGrid from './components/AdvancedGrid.vue'
import TeleportModal from './components/TeleportModal.vue'
import SaveWindow from './components/SaveWindow.vue'

const canvasEl = ref(null)
const AREA_SIZE = CELL * 20

const canvasStyle = computed(() => {
  void viewTick.value
  return {
    transform: `translate(${gameState.viewX}px, ${gameState.viewY}px) scale(${gameState.viewScale})`,
    transformOrigin: '0 0',
  }
})

const canvasInfoText = computed(() => {
  void viewTick.value
  return `画布位置 (${Math.round(gameState.viewX)}, ${Math.round(gameState.viewY)}) 缩放 ×${gameState.viewScale.toFixed(1)}`
})

function areaStyle(idx, isAdvanced) {
  const pos = isAdvanced ? getAdvancedAreaPos(idx) : getAreaPos(idx)
  return { left: pos.x + 'px', top: pos.y + 'px' }
}

function areaTitle(idx) { return `A${idx + 1} · ${AREA_FULL_NAMES[idx]}` }
function advTitle(idx) { return `B${idx + 1} · ${ADVANCED_AREAS[idx].name}` }

// 拖拽
let dragging = false
let dragStartX = 0, dragStartY = 0
let viewStartX = 0, viewStartY = 0
let dragThreshold = false

function startDrag(e) {
  // 不拦截交互元素的拖拽
  if (e.target.closest('button, .upgrade-tile, .grass-field, .reset-btn, .modal-overlay')) return
  dragging = true
  dragThreshold = false
  dragStartX = e.clientX; dragStartY = e.clientY
  viewStartX = gameState.viewX; viewStartY = gameState.viewY
}

function onDrag(e) {
  if (!dragging) return
  const dx = e.clientX - dragStartX
  const dy = e.clientY - dragStartY
  if (!dragThreshold && Math.abs(dx) < 4 && Math.abs(dy) < 4) return
  dragThreshold = true
  document.body.style.cursor = 'grabbing'
  gameState.viewX = viewStartX + dx
  gameState.viewY = viewStartY + dy
  // 直接操作 DOM 实现流畅拖拽
  if (canvasEl.value) {
    canvasEl.value.style.transform = `translate(${gameState.viewX}px, ${gameState.viewY}px) scale(${gameState.viewScale})`
  }
}

function endDrag() {
  if (dragging) {
    dragging = false
    document.body.style.cursor = ''
    viewTick.value++ // 同步到 Vue
  }
}

function onZoom(e) {
  const delta = e.deltaY > 0 ? -0.1 : 0.1
  gameState.viewScale = Math.max(0.2, Math.min(3, gameState.viewScale + delta))
  viewTick.value++
}

function setDefaultView() {
  gameState.viewX = window.innerWidth / 2 + 4000
  gameState.viewY = window.innerHeight / 2 + 2000
  gameState.viewScale = 1
  viewTick.value++
}

let tickInterval = null

onMounted(() => {
  if (hasSave()) {
    const loaded = loadFromLocal()
    if (loaded) {
      viewTick.value++ // 触发渲染以应用保存的画布位置
    } else {
      localStorage.removeItem('nrgci_save')
      setDefaultView()
    }
  } else {
    setDefaultView()
  }
  tickInterval = setInterval(gameTick, gameState.tickSpeed)
  startAutoSave(30000)
})

onUnmounted(() => {
  if (tickInterval) clearInterval(tickInterval)
  stopAutoSave()
})
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  background: #0a0a0f;
  color: #c9d1d9;
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
  font-size: 12px;
  overflow: hidden;
  user-select: none;
}

.app-container { width: 100vw; height: 100vh; position: relative; }

.fixed-buttons {
  position: fixed; top: 10px; right: 10px; z-index: 100;
  display: flex; gap: 8px; align-items: center;
}
.canvas-info {
  font-size: 10px;
  color: #8b949e;
  background: #161b22cc;
  border: 1px solid #30363d;
  border-radius: 4px;
  padding: 4px 10px;
  white-space: nowrap;
  pointer-events: none;
}
.fixed-btn {
  padding: 8px 16px; border: 2px solid #58a6ff;
  border-radius: 8px; background: #161b22; color: #58a6ff;
  cursor: pointer; font-size: 14px; font-weight: bold; transition: all 0.15s;
}
.fixed-btn:hover { background: #1c2533; }

.canvas-viewport {
  width: 100%; height: 100%; cursor: grab; overflow: hidden;
  background-color: #0a0a0f;
  position: relative;
}

.canvas-content {
  position: relative;
  width: 100000px;
  height: 100000px;
  background-color: #0a1f0a;
}

.canvas-content::before {
  content: '';
  position: absolute;
  left: -50000px;
  top: -50000px;
  width: 100000px;
  height: 100000px;
  background:
    linear-gradient(90deg, #1a3a1a 1px, transparent 1px),
    linear-gradient(180deg, #1a3a1a 1px, transparent 1px);
  background-size: 100px 100px;
  background-color: #0a1f0a;
  z-index: -1;
}

.area-block {
  position: absolute; width: 2000px;
  border-radius: 8px; padding: 4px;
  pointer-events: auto; cursor: default;
}
.adv-area { border: 2px solid #58a6ff; }
</style>