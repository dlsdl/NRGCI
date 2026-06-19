<template>
  <div class="adv-grid">
    <div class="adv-resource-display">
      <span class="adv-emoji">{{ advInfo.emoji }}</span>
      <span class="adv-name">{{ advInfo.name }}</span>
      <span class="adv-value">{{ fmt(advArea.resource) }}</span>
      <span class="adv-count">重置 ×{{ advArea.resetCounts }}</span>
    </div>

    <div class="adv-reset-info">
      <p>重置 {{ affectedAreas }} 的全部内容</p>
    </div>

    <button class="adv-reset-btn" @click="doAdvReset">
      ⚡ {{ advInfo.name }}重置
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { gameState, tick, fmt, ADVANCED_AREAS, doAdvancedReset } from '../game/engine.js'

const props = defineProps({ areaIndex: { type: Number, required: true } })
const advArea = computed(() => { void tick.value; return gameState.advancedAreas[props.areaIndex] })
const advInfo = computed(() => ADVANCED_AREAS[props.areaIndex])

const affectedAreas = computed(() => {
  if (props.areaIndex === 3) return 'A1-A4'
  return `A${props.areaIndex + 1}和A${props.areaIndex + 2}`
})

function doAdvReset() { doAdvancedReset(props.areaIndex) }
</script>

<style scoped>
.adv-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px;
  min-height: 200px;
}
.adv-resource-display {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background: #1a1424;
  border: 2px solid #a371f744;
  border-radius: 12px;
}
.adv-emoji { font-size: 36px; }
.adv-name { font-size: 20px; color: #a371f7; font-weight: bold; }
.adv-value { font-size: 22px; color: #c9d1d9; }
.adv-count { font-size: 14px; color: #8b949e; }

.adv-reset-info {
  font-size: 13px;
  color: #f0883e;
}

.adv-reset-btn {
  padding: 12px 32px;
  border: 2px solid #a371f7;
  border-radius: 10px;
  background: linear-gradient(180deg, #2a1a4a, #1a0a2a);
  color: #a371f7;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}
.adv-reset-btn:hover { background: linear-gradient(180deg, #3a2a5a, #2a1a3a); }
</style>