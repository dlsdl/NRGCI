<template>
  <div class="advanced-content">
    <div class="adv-header">
      <h2>{{ advDef.emoji }} 区域B{{ areaIndex + 1 }}：{{ advDef.name }}</h2>
      <span class="adv-layer">第{{ advDef.layer }}层重置</span>
    </div>

    <div class="adv-resource">
      <span class="adv-emoji">{{ advDef.emoji }}</span>
      <span class="adv-name">{{ advDef.name }}</span>
      <span class="adv-value">{{ fmt(advArea.resource) }}</span>
    </div>

    <div class="adv-info">
      <span>重置次数: {{ advArea.resetCounts }}</span>
      <span>等级: Lv.{{ advArea.level }}</span>
      <span>XP: {{ fmt(advArea.xp) }}</span>
    </div>

    <div class="adv-reset-info">
      <p>重置范围: 区域A{{ areaIndex + 1 }}的<span class="warn">全部内容</span>
        <span v-if="areaIndex < 3">和A{{ areaIndex + 2 }}的里程碑及之前内容</span>
        <span v-if="areaIndex === 3">（重置所有四个基础区域的全部内容！）</span>
      </p>
    </div>

    <button class="btn btn-adv-reset" @click="doAdvReset">
      ⚡ 执行{{ advDef.name }}重置
    </button>

    <!-- 升级 -->
    <div class="adv-upgrades">
      <h3>{{ advDef.name }}升级</h3>
      <div class="upgrades-grid">
        <div v-for="(upg, ui) in advArea.upgrades" :key="ui" class="upgrade-item">
          <div class="upg-header">
            <span class="upg-name">{{ advUpgradeNames[ui] }}</span>
            <span class="upg-level">Lv.{{ upg.level }}</span>
          </div>
          <div class="upg-cost">
            价格: {{ fmt(advUpgradeCost(ui)) }} {{ advDef.name }}
          </div>
          <button
            class="btn btn-buy"
            :disabled="advArea.resource.lt(advUpgradeCost(ui))"
            @click="buyAdvUpgrade(ui)"
          >
            购买
          </button>
        </div>
      </div>
    </div>

    <!-- 查看影响的基础区域 -->
    <div class="affected-areas">
      <h3>影响的基础区域</h3>
      <div class="affected-grid">
        <div
          v-for="ai in affectedAreas"
          :key="ai"
          class="affected-item"
        >
          <span>{{ AREA_FULL_NAMES[ai] }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  gameState, DEC, D0, fmt,
  ADVANCED_AREAS, AREA_FULL_NAMES,
  doAdvancedReset,
} from '../game/engine.js'

const props = defineProps({
  areaIndex: { type: Number, required: true }
})

const advDef = computed(() => ADVANCED_AREAS[props.areaIndex])
const advArea = computed(() => gameState.advancedAreas[props.areaIndex])

const advUpgradeNames = ['效率', '产出', '速度', '增益', '额外', '缩放', '增强']

const affectedAreas = computed(() => {
  const areas = []
  for (let i = 0; i <= props.areaIndex + 1; i++) {
    if (i < 4) areas.push(i)
  }
  // B4特殊：重置所有四个
  if (props.areaIndex === 3) {
    return [0, 1, 2, 3]
  }
  return areas
})

function advUpgradeCost(upgradeIndex) {
  const lv = advArea.value.upgrades[upgradeIndex].level
  const baseCosts = [DEC(100), DEC(1000), DEC(1e4), DEC(1e5), DEC(1e6), DEC(1e7), DEC(1e8)]
  const scales = [1.2, 1.25, 1.3, 1.35, 1.4, 1.45, 1.5]
  return baseCosts[upgradeIndex].mul(DEC(scales[upgradeIndex]).pow(lv))
}

function buyAdvUpgrade(upgradeIndex) {
  const cost = advUpgradeCost(upgradeIndex)
  if (advArea.value.resource.gte(cost)) {
    advArea.value.resource = advArea.value.resource.sub(cost)
    advArea.value.upgrades[upgradeIndex].level++
  }
}

function doAdvReset() {
  doAdvancedReset(props.areaIndex)
}
</script>

<style scoped>
.advanced-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.adv-header {
  text-align: center;
  padding: 16px;
  background: linear-gradient(180deg, #1a1a3a 0%, #0d0d1f 100%);
  border: 2px solid #a371f7;
  border-radius: 12px;
}
.adv-header h2 { font-size: 20px; color: #a371f7; margin-bottom: 4px; }
.adv-layer { font-size: 14px; color: #8b949e; }

.adv-resource {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #21262d;
  border: 1px solid #a371f744;
  border-radius: 10px;
}
.adv-emoji { font-size: 32px; }
.adv-name { font-size: 18px; color: #a371f7; flex: 1; }
.adv-value { font-size: 20px; color: #c9d1d9; font-weight: bold; }

.adv-info {
  display: flex;
  gap: 20px;
  font-size: 13px;
  color: #8b949e;
}

.adv-reset-info {
  background: #1c2533;
  border: 1px solid #f0883e44;
  border-radius: 8px;
  padding: 12px;
  font-size: 13px;
  color: #c9d1d9;
}
.warn { color: #f0883e; font-weight: bold; }

.btn-adv-reset {
  padding: 12px 24px;
  border: 2px solid #a371f7;
  border-radius: 8px;
  background: linear-gradient(180deg, #2a1a4a 0%, #1a0a2a 100%);
  color: #a371f7;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-adv-reset:hover {
  background: linear-gradient(180deg, #3a2a5a 0%, #2a1a3a 100%);
  border-color: #c371f7;
}

.adv-upgrades {
  background: #1c2533;
  border: 1px solid #30363d;
  border-radius: 8px;
  padding: 12px;
}
.adv-upgrades h3 { font-size: 14px; margin-bottom: 8px; color: #a371f7; }

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
.upg-name { flex: 1; font-size: 14px; }
.upg-level { color: #a371f7; font-size: 14px; font-weight: bold; }
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

.affected-areas {
  background: #1c2533;
  border: 1px solid #30363d;
  border-radius: 8px;
  padding: 12px;
}
.affected-areas h3 { font-size: 14px; margin-bottom: 6px; color: #8b949e; }
.affected-grid { display: flex; gap: 6px; }
.affected-item {
  background: #21262d;
  border: 1px solid #f0883e44;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 14px;
  color: #f0883e;
}
</style>