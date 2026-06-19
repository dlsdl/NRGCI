<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal debug-modal">
      <h3>🔧 调试面板</h3>
      <div class="debug-section">
        <div class="debug-row">
          <label>区域:</label>
          <select v-model="selectedArea">
            <option v-for="ai in 4" :key="ai" :value="ai-1">A{{ ai }}</option>
          </select>
        </div>
        <div class="debug-resources">
          <div class="debug-row" v-for="(r, ri) in resources" :key="ri">
            <label>{{ r.emoji }} {{ r.name }}:</label>
            <input type="text" v-model="resourceValues[r.id]" @change="setResource(r.id)" />
            <button class="debug-btn" @click="addResource(r.id, 1000)">+1K</button>
            <button class="debug-btn" @click="mulResource(r.id, 1000)">×1K</button>
            <button class="debug-btn" @click="resetResource(r.id)">归零</button>
          </div>
        </div>
      </div>
      <div class="debug-section">
        <h4>快速操作</h4>
        <div class="debug-actions">
          <button class="debug-btn" @click="setLevel(30)">等级→30</button>
          <button class="debug-btn" @click="setLevel(100)">等级→100</button>
          <button class="debug-btn" @click="setLevel(200)">等级→200</button>
          <button class="debug-btn" @click="setLevel(270)">等级→270</button>
          <button class="debug-btn" @click="unlockAllUpgrades">解锁所有升级</button>
          <button class="debug-btn" @click="maxAllUpgrades">满级所有升级</button>
          <button class="debug-btn danger-btn" @click="resetArea">重置当前区域</button>
        </div>
      </div>
      <button class="modal-close-btn" @click="$emit('close')">关闭</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { gameState, D, ensureDec, AREA_RESOURCES_LIST, hardReset, isUpgradeUnlocked } from '../game/engine.js'

const emit = defineEmits(['close'])
const selectedArea = ref(0)
const statusMsg = ref('')
const resourceValues = ref({})

const resources = computed(() => AREA_RESOURCES_LIST[selectedArea.value])

// 初始化资源值显示
watch([selectedArea, resources], () => {
  const area = gameState.areas[selectedArea.value]
  for (const r of resources.value) {
    resourceValues.value[r.id] = String(ensureDec(area.resources[r.id]).toNumber())
  }
}, { immediate: true })

function setResource(id) {
  const area = gameState.areas[selectedArea.value]
  const val = parseFloat(resourceValues.value[id]) || 0
  area.resources[id] = D(val)
  statusMsg.value = `${id} 已设为 ${val}`
  setTimeout(() => statusMsg.value = '', 1500)
}

function addResource(id, amount) {
  const area = gameState.areas[selectedArea.value]
  area.resources[id] = ensureDec(area.resources[id]).add(D(amount))
  resourceValues.value[id] = String(ensureDec(area.resources[id]).toNumber())
  statusMsg.value = `${id} +${amount}`
  setTimeout(() => statusMsg.value = '', 1500)
}

function mulResource(id, amount) {
  const area = gameState.areas[selectedArea.value]
  area.resources[id] = ensureDec(area.resources[id]).mul(D(amount))
  resourceValues.value[id] = String(ensureDec(area.resources[id]).toNumber())
  statusMsg.value = `${id} x${amount}`
  setTimeout(() => statusMsg.value = '', 1500)
}

function resetResource(id) {
  const area = gameState.areas[selectedArea.value]
  area.resources[id] = D(0)
  resourceValues.value[id] = '0'
  statusMsg.value = `${id} 已归零`
  setTimeout(() => statusMsg.value = '', 1500)
}

function setLevel(lv) {
  const area = gameState.areas[selectedArea.value]
  area.level = lv
  area.xp = D(0)
  statusMsg.value = `等级已设为 ${lv}`
  setTimeout(() => statusMsg.value = '', 1500)
}

function unlockAllUpgrades() {
  const area = gameState.areas[selectedArea.value]
  area.resetCounts.layer1 = 1
  area.resetCounts.layer2 = 1
  area.resetCounts.layer3B2 = 1
  area.unlockedFeatures.layer3B2 = true
  area.unlockedFeatures.generators = true
  area.unlockedFeatures.autoGain = true
  // 解锁所有区域
  for (let i = 0; i < 4; i++) gameState.areas[i].unlocked = true
  statusMsg.value = '所有升级已解锁'
  setTimeout(() => statusMsg.value = '', 1500)
}

function maxAllUpgrades() {
  const area = gameState.areas[selectedArea.value]
  for (const id in area.upgrades) {
    const def = area.upgrades[id]
    const cap = (def.cap === null || def.cap === undefined || def.cap === Infinity) ? 100 : def.cap
    def.level = Math.min(cap, 100)
  }
  statusMsg.value = '所有升级已满级'
  setTimeout(() => statusMsg.value = '', 1500)
}

function resetArea() {
  const area = gameState.areas[selectedArea.value]
  area.level = 0
  area.xp = D(0)
  area.doubleLevel = 0
  area.doubleXp = D(0)
  for (const r of resources.value) {
    area.resources[r.id] = D(0)
    resourceValues.value[r.id] = '0'
  }
  for (const id in area.upgrades) area.upgrades[id].level = 0
  statusMsg.value = '区域已重置'
  setTimeout(() => statusMsg.value = '', 1500)
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
}
.modal h3 { font-size: 18px; color: #58a6ff; margin-bottom: 12px; }
.debug-modal {
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}
.debug-section {
  margin: 12px 0;
}
.debug-section h4 {
  margin: 8px 0;
  color: #58a6ff;
}
.debug-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 6px 0;
}
.debug-row label {
  min-width: 100px;
  font-size: 14px;
}
.debug-row input {
  width: 120px;
  padding: 4px 8px;
  border: 1px solid #30363d;
  border-radius: 4px;
  background: #0d1117;
  color: #c9d1d9;
  font-size: 14px;
}
.debug-resources {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #30363d;
  border-radius: 4px;
  padding: 8px;
  background: #0d1117;
}
.debug-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.debug-btn {
  padding: 6px 12px;
  border: 1px solid #30363d;
  border-radius: 4px;
  background: #161b22;
  color: #c9d1d9;
  cursor: pointer;
  font-size: 14px;
}
.debug-btn:hover { background: #21262d; border-color: #58a6ff; }
.danger-btn { border-color: #f85149; color: #f85149; }
.danger-btn:hover { background: #f8514922; }
.debug-status {
  margin: 8px 0;
  padding: 6px;
  background: #1a3a1a;
  border-radius: 4px;
  color: #3fb950;
  font-size: 14px;
}
.modal-close-btn {
  margin-top: 12px;
  padding: 8px 20px;
  border: 2px solid #58a6ff;
  border-radius: 6px;
  background: #161b22;
  color: #58a6ff;
  cursor: pointer;
  font-size: 14px;
}
</style>