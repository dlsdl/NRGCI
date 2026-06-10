<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal teleport-modal">
      <h3>🗺️ 区域传送</h3>
      <div class="teleport-list">
        <div
          v-for="ai in 4"
          :key="'a'+ai"
          class="teleport-item"
          :class="{ locked: !gameState.areas[ai-1].unlocked }"
          @click="teleportTo(ai-1, false)"
        >
          <span>A{{ ai }} · {{ AREA_FULL_NAMES[ai-1] }}</span>
          <span v-if="!gameState.areas[ai-1].unlocked" class="lock-icon">🔒</span>
        </div>
        <div
          v-for="bi in 4"
          :key="'b'+bi"
          class="teleport-item adv-teleport"
          :class="{ locked: !gameState.advancedAreas[bi-1].unlocked }"
          @click="teleportTo(bi-1, true)"
        >
          <span>B{{ bi }} · {{ ADVANCED_AREAS[bi-1].name }}</span>
          <span v-if="!gameState.advancedAreas[bi-1].unlocked" class="lock-icon">🔒</span>
        </div>
      </div>
      <button class="modal-close-btn" @click="$emit('close')">关闭</button>
    </div>
  </div>
</template>

<script setup>
import { gameState, AREA_FULL_NAMES, ADVANCED_AREAS, getAreaPos, getAdvancedAreaPos, CELL, showTeleport } from '../game/engine.js'

defineEmits(['close'])

const AREA_SIZE = CELL * 20

function teleportTo(idx, isAdvanced) {
  const pos = isAdvanced ? getAdvancedAreaPos(idx) : getAreaPos(idx)
  gameState.viewX = -pos.x + window.innerWidth / 2 - AREA_SIZE / 2
  gameState.viewY = -pos.y + window.innerHeight / 2 - 200
  gameState.viewScale = 1
  showTeleport.value = false
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal {
  background: #161b22;
  border: 2px solid #58a6ff;
  border-radius: 12px;
  padding: 20px;
  min-width: 320px;
  max-height: 80vh;
}
.modal h3 { font-size: 18px; color: #58a6ff; margin-bottom: 12px; }
.teleport-list { display: flex; flex-direction: column; gap: 4px; }
.teleport-item {
  padding: 10px 16px;
  border: 1px solid #30363d;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  transition: all 0.15s;
}
.teleport-item:hover:not(.locked) { background: #21262d; border-color: #58a6ff; }
.teleport-item.locked { opacity: 0.4; cursor: not-allowed; }
.adv-teleport { border-color: #a371f744; }
.adv-teleport:hover:not(.locked) { border-color: #a371f7; }
.lock-icon { font-size: 14px; }

.modal-close-btn {
  margin-top: 12px;
  width: 100%;
  padding: 8px;
  border: 1px solid #30363d;
  border-radius: 6px;
  background: #21262d;
  color: #c9d1d9;
  cursor: pointer;
  font-size: 14px;
}
.modal-close-btn:hover { background: #30363d; }
</style>