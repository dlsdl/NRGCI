<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal stats-modal">
      <div class="modal-header">
        <h3>📊 加成统计</h3>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>
      <div class="modal-body">
        <div class="area-tabs">
          <button
            v-for="ai in unlockedAreas"
            :key="ai"
            class="area-tab"
            :class="{ active: selectedArea === ai }"
            @click="selectedArea = ai"
          >A{{ ai + 1 }}</button>
        </div>
        <div class="stats-content">
          <div v-for="res in resourceList" :key="res.key" class="res-block">
            <div class="res-title">{{ res.name }} ×{{ fmt(breakdown(res.key).total) }}</div>
            <div v-for="b in breakdown(res.key).breakdown" :key="b.source" class="res-line">
              ——{{ b.source }} ×{{ fmt(b.multiplier) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  gameState, tick, fmt, D, D1,
  AREA_FULL_NAMES,
  getResourceBoostBreakdown, getResourceBreakdownList,
} from '../game/engine.js'

defineEmits(['close'])

const selectedArea = ref(0)

const unlockedAreas = computed(() => {
  void tick.value
  const result = []
  for (let i = 0; i < 4; i++) {
    if (gameState.areas[i].unlocked) result.push(i)
  }
  return result
})

const resourceList = computed(() => {
  void tick.value
  return getResourceBreakdownList(selectedArea.value)
})

function breakdown(key) {
  void tick.value
  return getResourceBoostBreakdown(selectedArea.value, key)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(0,0,0,0.7);
  display: flex; align-items: center; justify-content: center;
}
.modal {
  background: #161b22; border: 2px solid #30363d; border-radius: 12px;
  width: 520px; max-height: 80vh; display: flex; flex-direction: column;
}
.modal-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px 16px; border-bottom: 1px solid #30363d;
}
.modal-header h3 { margin: 0; color: #58a6ff; font-size: 16px; }
.close-btn {
  background: none; border: none; color: #8b949e; font-size: 18px;
  cursor: pointer; padding: 4px 8px;
}
.close-btn:hover { color: #f85149; }
.modal-body { padding: 12px 16px; overflow-y: auto; flex: 1; }

.area-tabs { display: flex; gap: 6px; margin-bottom: 12px; }
.area-tab {
  padding: 4px 14px; border: 1px solid #30363d; border-radius: 6px;
  background: #0d1117; color: #8b949e; cursor: pointer; font-size: 13px;
}
.area-tab.active { background: #1c2533; color: #58a6ff; border-color: #58a6ff; }

.stats-content { display: flex; flex-direction: column; gap: 10px; }
.res-block {
  background: #0d1117; border: 1px solid #21262d; border-radius: 6px;
  padding: 8px 12px;
}
.res-title { color: #58a6ff; font-weight: bold; font-size: 14px; margin-bottom: 2px; }
.res-line { color: #8b949e; font-size: 12px; padding-left: 12px; }
</style>
