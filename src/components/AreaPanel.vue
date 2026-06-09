<template>
  <div class="area-content">
    <!-- 草地 -->
    <div class="grass-field" @click="cutGrass(areaIndex)">
      <div class="grass-visual">
        <div class="grass-emoji">
          <span v-for="i in grassDisplay" :key="i">{{ areaDef[0].emoji }}</span>
        </div>
        <div class="grass-empty" v-if="area.grassField.grass === 0">
          草地空空如也... 等待草生长
        </div>
      </div>
      <div class="grass-info">
        草: {{ area.grassField.grass }} / {{ area.grassField.maxGrass }} | 
        生长速度: {{ fmt(area.grassField.grassPerSec) }}/s | 
        点击割草!
      </div>
      <div class="grass-progress">
        <div class="grass-bar" :style="{ width: (area.grassField.grass / area.grassField.maxGrass * 100) + '%' }"></div>
      </div>
    </div>

    <!-- 等级和XP -->
    <div class="level-section">
      <span class="level-badge">Lv.{{ area.level }}</span>
      <span class="xp-text">XP: {{ fmt(area.xp) }} / {{ fmt(totalXpForLevel(area.level + 1)) }}</span>
      <span class="xp-bar">
        <span class="xp-fill" :style="{ width: xpPercent + '%' }"></span>
      </span>
    </div>

    <!-- 资源列表 -->
    <div class="resources-grid">
      <div
        v-for="(res, ri) in areaDef"
        :key="ri"
        class="resource-item"
        :class="{ highlighted: ri === 0 }"
      >
        <span class="res-emoji">{{ res.emoji }}</span>
        <span class="res-name">{{ res.name }}</span>
        <span class="res-value">{{ fmt(area.resources[res.id]) }}</span>
      </div>
    </div>

    <!-- 重置按钮 -->
    <div class="reset-section">
      <h3>重置操作</h3>
      <div class="reset-buttons">
        <button class="btn btn-reset" @click="doLayer1Reset">
          {{ RESET_NAMES[areaIndex].layer1 }} (L1)
          <span class="reset-count">×{{ area.resetCounts.layer1 }}</span>
        </button>
        <button class="btn btn-reset" @click="doLayer2Reset">
          {{ RESET_NAMES[areaIndex].layer2 }} (L2)
          <span class="reset-count">×{{ area.resetCounts.layer2 }}</span>
        </button>
        <button
          class="btn btn-reset"
          :disabled="!canDoLayer3Branch1"
          @click="doLayer3Branch1Reset"
        >
          {{ RESET_NAMES[areaIndex].layer3Branch1 }} (L3B1)
          <span class="reset-count">×{{ area.resetCounts.layer3Branch1 }}</span>
          <span class="req-level">需Lv.{{ requiredBranch1Level }}</span>
        </button>
        <button
          class="btn btn-reset btn-special"
          :disabled="!area.unlockedFeatures.layer3Branch2"
          @click="doLayer3Branch2Reset"
        >
          {{ RESET_NAMES[areaIndex].layer3Branch2 }} (L3B2)
          <span class="reset-count">×{{ area.resetCounts.layer3Branch2 }}</span>
        </button>
      </div>
      <div class="milestone-info" v-if="area.milestones.layer3Branch1 > 0">
        里程碑: {{ area.milestones.layer3Branch1 }} / 8
        <span v-if="area.milestones.layer3Branch1 >= 8 && !area.unlockedFeatures.layer3Branch2">
          (需要Lv.270解锁{{ RESET_NAMES[areaIndex].layer3Branch2 }})
        </span>
        <span v-if="area.unlockedFeatures.layer3Branch2" class="unlocked-badge">
          {{ RESET_NAMES[areaIndex].layer3Branch2 }}已解锁！
        </span>
      </div>
    </div>

    <!-- 升级面板 -->
    <div class="upgrades-section">
      <h3>
        升级
        <span v-if="area.unlockedFeatures.upgrades" class="unlocked-badge">升级物品</span>
        <span v-if="area.unlockedFeatures.rares" class="unlocked-badge rare">稀有物品</span>
        <span v-if="area.unlockedFeatures.generators" class="unlocked-badge gen">生成物品</span>
      </h3>
      <div class="upgrades-grid">
        <div
          v-for="(upg, ui) in area.upgrades"
          :key="ui"
          class="upgrade-item"
        >
          <div class="upg-header">
            <span class="upg-emoji">{{ areaDef[ui].emoji }}</span>
            <span class="upg-name">{{ upgradeNames[ui] }}</span>
            <span class="upg-level">Lv.{{ upg.level }}</span>
          </div>
          <div class="upg-cost">
            价格: {{ fmt(getUpgradeCost(areaIndex, ui)) }} {{ areaDef[Math.min(ui, 6)].name }}
          </div>
          <button
            class="btn btn-buy"
            :disabled="!canAffordUpgrade(areaIndex, ui)"
            @click="buyUpgrade(areaIndex, ui)"
          >
            购买
          </button>
        </div>
      </div>
    </div>

    <!-- 自动化升级 -->
    <div class="auto-section">
      <h3>自动化升级 (消耗{{ areaDef[3].name }})</h3>
      <div class="auto-grid">
        <div class="auto-item">
          <span>🪚 自动割草</span>
          <span>Lv.{{ area.autoUpgrades.autoCut.level }}</span>
          <button
            class="btn btn-buy"
            :disabled="!canAffordAuto(areaIndex, 'autoCut')"
            @click="buyAutoUpgrade(areaIndex, 'autoCut')"
          >
            {{ fmt(autoCutCost) }}
          </button>
        </div>
        <div class="auto-item">
          <span>🛒 自动购买升级</span>
          <span>Lv.{{ area.autoUpgrades.autoBuyUpgrades.level }}</span>
          <button
            class="btn btn-buy"
            :disabled="!canAffordAuto(areaIndex, 'autoBuyUpgrades')"
            @click="buyAutoUpgrade(areaIndex, 'autoBuyUpgrades')"
          >
            {{ fmt(autoBuyCost) }}
          </button>
        </div>
        <div class="auto-item">
          <span>💰 购买升级不消耗资源</span>
          <span>Lv.{{ area.autoUpgrades.freeUpgrades.level }}</span>
          <button
            class="btn btn-buy"
            :disabled="!canAffordAuto(areaIndex, 'freeUpgrades')"
            @click="buyAutoUpgrade(areaIndex, 'freeUpgrades')"
          >
            {{ fmt(freeUpgCost) }}
          </button>
        </div>
        <div class="auto-item">
          <span>📊 每秒自动获得10%重置资源</span>
          <span>Lv.{{ area.autoUpgrades.autoResetGain.level }}</span>
          <button
            class="btn btn-buy"
            :disabled="!canAffordAuto(areaIndex, 'autoResetGain')"
            @click="buyAutoUpgrade(areaIndex, 'autoResetGain')"
          >
            {{ fmt(autoResetCost) }}
          </button>
        </div>
      </div>
    </div>

    <!-- 稀有物品统计 -->
    <div class="rare-stats" v-if="area.unlockedFeatures.rares">
      <h3>稀有物品统计</h3>
      <div class="rare-chain">
        <span v-if="areaIndex === 0">{{ areaDef[5].emoji }} {{ areaDef[5].name }}: {{ fmt(area.rareChances.cuprumTotal) }}</span>
        <span v-if="areaIndex >= 1 && gameState.areas[0].unlockedFeatures.rares">🟤 铜→⚪ 银级联</span>
        <span v-if="areaIndex >= 2 && gameState.areas[1].unlockedFeatures.rares">⚪ 银→🟡 金级联</span>
        <span v-if="areaIndex >= 3 && gameState.areas[2].unlockedFeatures.rares">🟡 金→🟣 𬬭级联</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  gameState, DEC, D0, D1, D10, D100, fmt,
  AREA_RESOURCES, RESET_NAMES,
  cutGrass, buyUpgrade, buyAutoUpgrade,
  doLayer1Reset, doLayer2Reset, doLayer3Branch1Reset, doLayer3Branch2Reset,
  getUpgradeCost,
  getLayer3Branch1RequiredLevel,
  xpForLevel, totalXpForLevel,
  canLayer3Branch1 as checkCanLayer3B1,
} from '../game/engine.js'

const props = defineProps({
  areaIndex: { type: Number, required: true }
})

const area = computed(() => gameState.areas[props.areaIndex])
const areaDef = computed(() => AREA_RESOURCES[props.areaIndex])

const upgradeNames = ['基础资源', '重置层1', '重置层2', '重置层3', '级点', '稀有物品', '生成物品']

const requiredBranch1Level = computed(() => getLayer3Branch1RequiredLevel(props.areaIndex))
const canDoLayer3Branch1 = computed(() => checkCanLayer3B1(props.areaIndex))

const grassDisplay = computed(() => Math.min(area.value.grassField.grass, 20))

const xpPercent = computed(() => {
  try {
    const xp = area.value.xp
    if (!xp || typeof xp.div !== 'function') return 0
    const next = totalXpForLevel(area.value.level + 1)
    if (!next || typeof next.eq !== 'function' || next.eq(0)) return 0
    return Math.min(100, xp.div(next).mul(100).toNumber())
  } catch (e) { return 0 }
})

const autoCutCost = computed(() => { try { return DEC(100).mul(DEC(1.5).pow(area.value.autoUpgrades.autoCut.level)) } catch(e) { return DEC(100) } })
const autoBuyCost = computed(() => { try { return DEC(500).mul(DEC(1.6).pow(area.value.autoUpgrades.autoBuyUpgrades.level)) } catch(e) { return DEC(500) } })
const freeUpgCost = computed(() => { try { return DEC(5000).mul(DEC(1.8).pow(area.value.autoUpgrades.freeUpgrades.level)) } catch(e) { return DEC(5000) } })
const autoResetCost = computed(() => { try { return DEC(10000).mul(DEC(2.0).pow(area.value.autoUpgrades.autoResetGain.level)) } catch(e) { return DEC(10000) } })

// 安全地检查是否能支付升级
function canAffordUpgrade(ai, ui) {
  try {
    const defs = AREA_RESOURCES[ai]
    const resKey = defs[Math.min(ui, 6)].id
    const res = area.value.resources[resKey]
    if (!res || typeof res.lt !== 'function') return false
    return res.gte(getUpgradeCost(ai, ui))
  } catch (e) { return false }
}

function canAffordAuto(ai, autoId) {
  try {
    const defs = AREA_RESOURCES[ai]
    const resKey = defs[3].id
    const res = area.value.resources[resKey]
    if (!res || typeof res.lt !== 'function') return false
    const costMap = {
      autoCut: autoCutCost.value,
      autoBuyUpgrades: autoBuyCost.value,
      freeUpgrades: freeUpgCost.value,
      autoResetGain: autoResetCost.value,
    }
    return res.gte(costMap[autoId])
  } catch (e) { return false }
}
</script>

<style scoped>
.area-content { display: flex; flex-direction: column; gap: 12px; }

.grass-field {
  background: linear-gradient(180deg, #1a3a1a 0%, #0d1f0d 100%);
  border: 2px solid #2d5a2d;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s;
  text-align: center;
}
.grass-field:hover { border-color: #4a8a4a; background: linear-gradient(180deg, #1f4a1f 0%, #122f12 100%); }
.grass-field:active { transform: scale(0.98); }
.grass-visual { min-height: 60px; display: flex; align-items: center; justify-content: center; }
.grass-emoji { font-size: 28px; line-height: 1.4; }
.grass-empty { color: #4a7a4a; font-size: 14px; }
.grass-info { font-size: 13px; color: #8b949e; margin-top: 8px; }
.grass-progress {
  height: 6px;
  background: #1a3a1a;
  border-radius: 3px;
  margin-top: 6px;
  overflow: hidden;
}
.grass-bar {
  height: 100%;
  background: linear-gradient(90deg, #4a9a4a, #7adf7a);
  border-radius: 3px;
  transition: width 0.3s;
}

.level-section {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: #1c2533;
  border-radius: 8px;
  border: 1px solid #30363d;
}
.level-badge {
  background: #58a6ff;
  color: #0d1117;
  padding: 2px 10px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 14px;
}
.xp-text { font-size: 12px; color: #8b949e; flex: 1; }
.xp-bar {
  width: 150px;
  height: 8px;
  background: #21262d;
  border-radius: 4px;
  overflow: hidden;
}
.xp-fill {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #3fb950, #7ee787);
  border-radius: 4px;
  transition: width 0.3s;
}

.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 6px;
}
.resource-item {
  background: #21262d;
  border: 1px solid #30363d;
  border-radius: 6px;
  padding: 6px 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}
.resource-item.highlighted { border-color: #3fb950; background: #1a2e1a; }
.res-emoji { font-size: 16px; }
.res-name { color: #8b949e; flex: 1; }
.res-value { color: #c9d1d9; font-weight: bold; font-size: 11px; }

.reset-section {
  background: #1c2533;
  border: 1px solid #30363d;
  border-radius: 8px;
  padding: 12px;
}
.reset-section h3 { font-size: 14px; margin-bottom: 8px; color: #58a6ff; }
.reset-buttons { display: flex; gap: 6px; flex-wrap: wrap; }
.btn-reset {
  padding: 6px 14px;
  border: 1px solid #30363d;
  border-radius: 6px;
  background: #21262d;
  color: #c9d1d9;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.15s;
}
.btn-reset:hover:not(:disabled) { border-color: #f0883e; background: #3a2a1a; }
.btn-reset:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-special { border-color: #a371f7; }
.btn-special:hover:not(:disabled) { border-color: #a371f7; background: #2a1a4a; }
.reset-count { color: #58a6ff; font-size: 11px; }
.req-level { color: #f0883e; font-size: 10px; }
.milestone-info { font-size: 12px; color: #8b949e; margin-top: 8px; }
.unlocked-badge {
  background: #3fb95022;
  color: #3fb950;
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 11px;
  border: 1px solid #3fb95044;
  margin-left: 4px;
}
.unlocked-badge.rare { background: #d2992222; color: #d29922; border-color: #d2992244; }
.unlocked-badge.gen { background: #a371f722; color: #a371f7; border-color: #a371f744; }

.upgrades-section, .auto-section {
  background: #1c2533;
  border: 1px solid #30363d;
  border-radius: 8px;
  padding: 12px;
}
.upgrades-section h3, .auto-section h3 { font-size: 14px; margin-bottom: 8px; color: #58a6ff; }
.upgrades-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 6px; }
.upgrade-item {
  background: #21262d;
  border: 1px solid #30363d;
  border-radius: 6px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.upg-header { display: flex; align-items: center; gap: 6px; }
.upg-emoji { font-size: 16px; }
.upg-name { flex: 1; font-size: 12px; }
.upg-level { color: #58a6ff; font-size: 12px; font-weight: bold; }
.upg-cost { font-size: 11px; color: #8b949e; }
.btn-buy {
  padding: 3px 10px;
  border: 1px solid #3fb95044;
  border-radius: 4px;
  background: #3fb95011;
  color: #3fb950;
  cursor: pointer;
  font-size: 11px;
  align-self: flex-end;
}
.btn-buy:hover:not(:disabled) { background: #3fb95022; }
.btn-buy:disabled { opacity: 0.3; cursor: not-allowed; }

.auto-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 6px; }
.auto-item {
  background: #21262d;
  border: 1px solid #30363d;
  border-radius: 6px;
  padding: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}
.auto-item span:first-child { flex: 1; }
.auto-item span:nth-child(2) { color: #58a6ff; }

.rare-stats {
  background: #1c2533;
  border: 1px solid #30363d;
  border-radius: 8px;
  padding: 12px;
}
.rare-stats h3 { font-size: 14px; margin-bottom: 6px; color: #d29922; }
.rare-chain { display: flex; gap: 12px; font-size: 12px; color: #8b949e; flex-wrap: wrap; }
</style>