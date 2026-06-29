<template>
  <div class="b1-grid">
    <!-- 资源显示 9x1 -->
    <div class="cell adv-resource-display" style="grid-row: 1; grid-column: 1 / 10;">
      <span class="adv-emoji">{{ advInfo.emoji }}</span>
      <span class="adv-name">{{ advInfo.name }}</span>
      <span class="adv-value">{{ fmt(advArea.resource) }}</span>
      <span class="adv-count">重置 ×{{ advArea.resetCounts }}</span>
    </div>

    <!-- 三重等级 4x1 -->
    <div v-if="tripleUnlocked" class="cell triple-level-display" style="grid-row: 2; grid-column: 1 / 5;">
      <div class="tl-top">
        <span class="tl-label">TLv.{{ fmt(advArea.tripleLevel) }}</span>
        <span class="tl-val">{{ fmt(advArea.tripleXp) }} / {{ fmt(tripleXpCostFn(advArea.tripleLevel)) }}</span>
        <span class="tl-bonus">草/经验/二重经验 ×{{ fmt(tripleEff) }}</span>
      </div>
      <div class="tl-bottom">
        <div class="tl-fill"><div class="tl-inner" :style="{width: tlXpPct+'%'}"></div></div>
      </div>
    </div>

    <!-- 三重等级里程碑 4x4 -->
    <div v-if="tripleUnlocked" class="cell milestones" style="grid-row: 3 / 7; grid-column: 1 / 5;">
      <div class="ms-header">三重等级里程碑</div>
      <div class="ms-scroll">
        <div class="ms-section">TLv.{{ fmt(advArea.tripleLevel) }}</div>
        <div v-for="m in tripleMileList" :key="'tm'+m.level" class="ms-item" :class="{ done: advArea.tripleLevel.gte(D(m.level)) }">
          <span v-if="advArea.tripleLevel.gte(D(m.level))">✓</span><span v-else>○</span>
          Lv.{{ m.level }}: {{ m.desc.substring(0, 28) }}{{ m.desc.length > 28 ? '...' : '' }}
        </div>
      </div>
    </div>

    <!-- B1区域升级 5列显示在三重等级右侧 -->
    <template v-for="(upg, ui) in b1UpgradeList" :key="upg.id">
      <div
        class="upgrade-tile"
        :class="{ affordable: canAffordB1Upgrade(upg.id), capped: D(upg.level).gte(upg.cap === undefined || upg.cap === null ? Infinity : upg.cap), locked: !isB1UpgradeUnlocked(upg.id) }"
        :style="upgStyle(ui)"
        @click="handleBuyB1(upg.id)"
        @mouseenter="hoverUpg = upg.id"
        @mouseleave="hoverUpg = null"
      >
        <div class="tile-lv">{{ isB1UpgradeUnlocked(upg.id) ? 'Lv.'+fmt(upg.level) : '🔒' }}{{ displayCap(upg) }}</div>
        <div class="tile-cost">{{ isB1UpgradeUnlocked(upg.id) ? '✨'+fmt(calcUpgradeCost(upg)) : '锁定' }}</div>
      </div>
    </template>

    <!-- 悬停详细信息（固定在网格外，不受overflow影响） -->
    <div v-if="hoverUpg && hoverUpgData" class="tile-tooltip-fixed" :style="tooltipStyle">
      <div class="tt-desc">{{ hoverUpgData.description }}</div>
      <div class="tt-cost">费用: ✨{{ fmt(calcUpgradeCost(hoverUpgData)) }}</div>
      <div class="tt-level">等级: Lv.{{ fmt(hoverUpgData.level) }}{{ hoverUpgData.cap === Infinity ? ' (无上限)' : hoverUpgData.cap ? ' / '+hoverUpgData.cap : '' }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { gameState, tick, fmt, D, D0, ADVANCED_AREAS, doAdvancedReset, buyB1Upgrade, canAffordB1Upgrade, calcUpgradeCost, isTripleUnlocked, tripleLevelEffect, tripleXpCost, ensureDec, isUpgradeUnlocked, milestoneDefs } from '../game/engine.js'

const props = defineProps({ areaIndex: { type: Number, required: true } })
const advArea = computed(() => { void tick.value; return gameState.advancedAreas[props.areaIndex] })
const advInfo = computed(() => ADVANCED_AREAS[props.areaIndex])

const hoverUpg = ref(null)

const tripleUnlocked = computed(() => { void tick.value; return props.areaIndex === 0 && isTripleUnlocked() })
const tripleEff = computed(() => { void tick.value; return tripleLevelEffect(0) })

function tripleXpCostFn(lv) { return tripleXpCost(lv) }

const tlXpPct = computed(() => {
  void tick.value
  const b1 = gameState.advancedAreas[0]
  try {
    const cost = tripleXpCost(b1.tripleLevel)
    if (!cost || cost.eq(0)) return 0
    return Math.min(100, ensureDec(b1.tripleXp).div(cost).mul(100).toNumber())
  } catch (e) { return 0 }
})

const tripleMileList = computed(() => {
  void tick.value
  return milestoneDefs.tripleLevel || []
})

const b1UpgradeList = computed(() => {
  void tick.value
  if (props.areaIndex !== 0) return []
  const b1 = gameState.advancedAreas[0]
  if (!b1.unlocked) return []
  return Object.values(b1.upgrades)
})

const hoverUpgData = computed(() => {
  if (!hoverUpg.value) return null
  const b1 = gameState.advancedAreas[0]
  return b1.upgrades[hoverUpg.value] || null
})

const tooltipStyle = computed(() => {
  if (!hoverUpg.value) return {}
  const ui = b1UpgradeList.value.findIndex(u => u.id === hoverUpg.value)
  if (ui < 0) return {}
  const row = upgRow(ui)
  const col = upgCol(ui)
  // 定位在升级格子下方
  return {
    left: ((col - 1) * 100 + 50) + 'px',
    top: (row * 100-50) + 'px',
  }
})

function isB1UpgradeUnlocked(id) {
  void tick.value
  const b1 = gameState.advancedAreas[0]
  if (!b1.unlocked) return false
  if (b1.resetCounts < 1) return false
  return true
}

function upgRow(ui) {
  const baseRow = tripleUnlocked.value ? 2 : 2
  return baseRow + Math.floor(ui / 5)
}

function upgCol(ui) {
  return 5 + (ui % 5)
}

function upgStyle(ui) {
  return { gridRow: upgRow(ui), gridColumn: upgCol(ui) }
}

function displayCap(upg) {
  if (upg.cap === Infinity || upg.cap === undefined || upg.cap === null) return ''
  return '/' + upg.cap
}

function handleBuyB1(id) {
  if (!isB1UpgradeUnlocked(id)) return
  buyB1Upgrade(id)
  tick.value++
}

function doAdvReset() { doAdvancedReset(props.areaIndex) }
</script>

<style scoped>
.b1-grid {
  display: grid;
  grid-template-columns: repeat(9, 100px);
  grid-template-rows: repeat(auto-fill, 100px);
  gap: 0;
  position: relative;
}
.cell {
  background: #161b22;
  border: 1px solid #30363d;
  padding: 4px;
  font-size: 14px;
  overflow: hidden;
}

/* 资源显示 */
.adv-resource-display {
  display: flex; align-items: center; gap: 8px;
  background: #1a1424; border-color: #a371f744;
  padding: 8px;
}
.adv-emoji { font-size: 24px; }
.adv-name { color: #a371f7; font-weight: bold; font-size: 14px; }
.adv-value { color: #c9d1d9; font-size: 14px; }
.adv-count { color: #8b949e; font-size: 14px; }

/* 三重等级 */
.triple-level-display {
  display: flex; flex-direction: column; justify-content: center;
  gap: 4px; padding: 6px 8px; min-height: 100px;
  border-color: #ff6b6b44;
}
.tl-top { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.tl-label { color: #ff6b6b; font-weight: bold; font-size: 20px; }
.tl-val { color: #8b949e; font-size: 14px; }
.tl-bonus { color: #ff3d3d; font-size: 14px; }
.tl-bottom { width: 100%; }
.tl-fill { width: 100%; height: 12px; background: #21262d; border-radius: 4px; overflow: hidden; }
.tl-inner { height: 100%; background: linear-gradient(90deg, #ff6b6b, #ff3d3d); border-radius: 4px; transition: width 0.15s; }

/* 里程碑 */
.milestones {
  background: #0d1117; border-color: #58a6ff44;
  display: flex; flex-direction: column;min-height: 400px;
  overflow: hidden;
}
.ms-header { color: #58a6ff; font-weight: bold; font-size: 14px; margin-bottom: 4px; }
.ms-scroll { overflow-y: auto; flex: 1; font-size: 14px; }
.ms-section { color: #8b949e; margin-bottom: 2px; }
.ms-item { padding: 1px 0; color: #8b949e; }
.ms-item.done { color: #3fb950; }

/* 升级 */
.upgrade-tile {
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 4px;
  cursor: pointer; transition: all 0.1s;
  display: flex; flex-direction: column; justify-content: space-between;
  padding: 4px 6px;
  font-size: 14px;
  position: relative;
}
.upgrade-tile.affordable { border-color: #3fb950; }
.upgrade-tile.affordable:hover { background: #1c2a1c; }
.upgrade-tile.capped { opacity: 0.5; cursor: not-allowed; }
.upgrade-tile.locked { opacity: 0.3; cursor: not-allowed; background: #0d1117; }
.tile-lv { color: #a371f7; font-weight: bold; font-size: 14px; }
.tile-cost { color: #f0883e; font-size: 14px; }
.tile-id { color: #58a6ff; font-size: 14px; text-align: right; }

/* 悬停详细信息 - 绝对定位在网格上，不受overflow影响 */
.tile-tooltip-fixed {
  position: absolute;
  background: #1a1a2e;
  border: 1px solid #58a6ff;
  border-radius: 6px;
  padding: 8px 10px;
  z-index: 100;
  min-width: 180px;
  font-size: 14px;
  color: #c9d1d9;
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.6);
}
.tt-id { color: #58a6ff; font-weight: bold; font-size: 14px; margin-bottom: 3px; }
.tt-desc { color: #c9d1d9; margin-bottom: 3px; }
.tt-cost { color: #f0883e; font-size: 14px; }
.tt-level { color: #a371f7; font-size: 14px; }
</style>
