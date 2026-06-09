<template>
  <div class="app">
    <header class="header">
      <h1>🌾 不真实割草增量</h1>
      <span class="subtitle">NRGCI - Not Real Grass Cutting Incremental</span>
      <div class="save-buttons">
        <button @click="saveGame" class="btn btn-save">💾 保存</button>
        <button @click="loadGame" class="btn btn-load">📂 加载</button>
        <button @click="exportClipboard" class="btn btn-export">📋 导出剪贴板</button>
        <button @click="importClipboard" class="btn btn-import">📥 导入剪贴板</button>
        <button @click="exportFile" class="btn btn-export-file">📄 导出文件</button>
        <button @click="importFile" class="btn btn-import-file">📁 导入文件</button>
        <button @click="doHardReset" class="btn btn-danger">⚠️ 硬重置</button>
      </div>
    </header>

    <div class="tab-bar">
      <button
        v-for="(tab, i) in tabs"
        :key="i"
        :class="['tab', { active: activeTab === i, locked: !tab.unlocked }]"
        @click="activeTab = i"
        :disabled="!tab.unlocked"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 基础区域 A1-A4 -->
    <div v-if="activeTab < 4" class="area-panel">
      <AreaPanel :areaIndex="activeTab" />
    </div>

    <!-- 高级区域 B1-B4 -->
    <div v-else class="area-panel">
      <AdvancedPanel :areaIndex="activeTab - 4" />
    </div>

    <!-- 通知区域 -->
    <div class="notifications" v-if="gameState.notifications.length > 0">
      <div
        v-for="n in gameState.notifications.slice(0, 5)"
        :key="n.id"
        class="notification"
      >
        {{ n.msg }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gameState, gameTick, hardReset, addNotification, D0, DEC } from './game/engine.js'
import {
  saveToLocal, loadFromLocal, hasSave,
  exportToClipboard, importFromClipboard,
  exportToFile, importFromFile,
  startAutoSave, stopAutoSave,
} from './game/save.js'
import AreaPanel from './components/AreaPanel.vue'
import AdvancedPanel from './components/AdvancedPanel.vue'

const activeTab = ref(0)

const tabs = [
  { label: 'A1 · 草', unlocked: true },
  { label: 'A2 · 反草', unlocked: false },
  { label: 'A3 · 非自然草', unlocked: false },
  { label: 'A4 · 小行星草', unlocked: false },
  { label: 'B1 · 星星', unlocked: false },
  { label: 'B2 · 暗物质', unlocked: false },
  { label: 'B3 · 光物质', unlocked: false },
  { label: 'B4 · 超新星', unlocked: false },
]

let tickInterval = null

onMounted(() => {
  // 自动加载存档，失败则清除
  if (hasSave()) {
    try {
      const loaded = loadFromLocal()
      // 验证加载的数据是否正常 (检查关键字段是否为 Decimal)
      if (loaded && gameState.areas[0]) {
        const gp = gameState.areas[0].grassField?.grassPerSec
        if (!gp || typeof gp.mul !== 'function') {
          // 数据损坏，清除存档
          localStorage.removeItem('nrgci_save')
          window.location.reload()
          return
        }
      }
    } catch (e) {
      localStorage.removeItem('nrgci_save')
    }
  }
  // 更新tab解锁状态
  updateTabUnlocks()
  // 游戏循环
  tickInterval = setInterval(() => {
    gameTick()
    updateTabUnlocks()
  }, gameState.tickSpeed)
  // 自动保存
  startAutoSave(30000)
})

onUnmounted(() => {
  if (tickInterval) clearInterval(tickInterval)
  stopAutoSave()
})

function updateTabUnlocks() {
  for (let i = 0; i < 4; i++) {
    tabs[i].unlocked = gameState.areas[i].unlocked
  }
  for (let i = 0; i < 4; i++) {
    tabs[i + 4].unlocked = gameState.advancedAreas[i].unlocked
  }
}

function saveGame() { saveToLocal() }
function loadGame() { loadFromLocal() }
function exportClipboard() { exportToClipboard() }
function importClipboard() { importFromClipboard() }
function exportFile() { exportToFile() }
function importFile() { importFromFile() }
function doHardReset() {
  if (confirm('确定要硬重置吗？所有进度将丢失！')) {
    hardReset()
    updateTabUnlocks()
    activeTab.value = 0
  }
}
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  background: #0d1117;
  color: #c9d1d9;
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
}
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px;
  min-height: 100vh;
}
.header {
  text-align: center;
  padding: 10px 0;
  border-bottom: 2px solid #30363d;
  margin-bottom: 10px;
}
.header h1 {
  font-size: 24px;
  color: #58a6ff;
  margin-bottom: 4px;
}
.subtitle {
  font-size: 12px;
  color: #8b949e;
}
.save-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: center;
  margin-top: 8px;
}
.btn {
  padding: 4px 10px;
  border: 1px solid #30363d;
  border-radius: 6px;
  background: #21262d;
  color: #c9d1d9;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.15s;
}
.btn:hover { background: #30363d; border-color: #58a6ff; }
.btn-danger { color: #f85149; border-color: #f8514940; }
.btn-danger:hover { background: #f8514920; }

.tab-bar {
  display: flex;
  gap: 2px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}
.tab {
  padding: 6px 14px;
  border: 1px solid #30363d;
  background: #161b22;
  color: #8b949e;
  cursor: pointer;
  border-radius: 6px 6px 0 0;
  font-size: 13px;
  transition: all 0.15s;
}
.tab.active {
  background: #1c2533;
  color: #58a6ff;
  border-bottom-color: #1c2533;
}
.tab.locked {
  opacity: 0.4;
  cursor: not-allowed;
}
.tab:not(.locked):hover {
  background: #21262d;
  color: #c9d1d9;
}

.area-panel {
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 8px;
  padding: 15px;
  min-height: 400px;
}

.notifications {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 1000;
  max-width: 300px;
}
.notification {
  background: #1c2533;
  border: 1px solid #58a6ff;
  border-radius: 6px;
  padding: 6px 10px;
  margin-bottom: 4px;
  font-size: 12px;
  animation: fadeIn 0.3s;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>