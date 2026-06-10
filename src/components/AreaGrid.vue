<template>
  <div class="area-grid">
    <!-- 草地 4x4 -->
    <div class="cell grass-field" style="grid-row: 1 / 5; grid-column: 1 / 5;" @click="handleCutGrass">
      <div class="grass-emoji-row">
        <span v-for="i in grassDisplay" :key="i">{{ resDefs[0].emoji }}</span>
        <span v-if="grassCount === 0" class="grass-empty">等待生长...</span>
      </div>
      <div class="grass-count">{{ grassCount }} / {{ a.grassField.maxGrass }}</div>
      <div class="grass-bar-outer"><div class="grass-bar-inner" :style="{width: grassPct+'%'}"></div></div>
      <div class="grass-hint">点击割草</div>
    </div>

    <!-- 等级经验条 1x4 -->
    <div class="cell xp-bar-cell" style="grid-row: 1; grid-column: 5 / 9;">
      <div class="xp-top">
        <span class="xp-label">Lv.{{ a.level }}</span>
        <span class="xp-val">{{ fmt(a.xp) }} / {{ fmt(totalXpForLevel(a.level + 1)) }}</span>
        <span class="xp-bonus" v-if="areaIndex===0">草 +{{ (a.level*100).toFixed(0) }}%</span>
        <span class="xp-bonus" v-if="areaIndex===1">充能 +{{ (a.level*100).toFixed(0) }}%</span>
        <span class="xp-bonus" v-if="areaIndex===2">压缩 +{{ (a.level*100).toFixed(0) }}%</span>
        <span class="xp-bonus" v-if="areaIndex===3">速度 +{{ (a.level*100).toFixed(0) }}%</span>
      </div>
      <div class="xp-bottom">
        <div class="xp-fill"><div class="xp-inner" :style="{width: xpPct+'%'}"></div></div>
      </div>
    </div>

    <!-- 二重等级经验条 1x4 -->
    <div class="cell xp-bar-cell dl-xp-cell" style="grid-row: 2; grid-column: 5 / 9;">
      <div class="xp-top">
        <span class="xp-label dl-label">DLv.{{ a.doubleLevel }}</span>
        <span class="xp-val">{{ fmt(a.doubleXp) }} / {{ fmt(doubleXpCost(a.doubleLevel)) }}</span>
        <span class="xp-bonus" v-if="a.doubleUnlocked && a.doubleLevel>0">草/经验 ×10<sup>{{ a.doubleLevel }}</sup></span>
        <span class="xp-bonus" v-else>Lv.30 解锁</span>
      </div>
      <div class="xp-bottom">
        <div class="xp-fill"><div class="xp-inner dl-inner" :style="{width: dlXpPct+'%'}"></div></div>
      </div>
    </div>

    <!-- 重置按钮 2x2：声望 -->
    <div class="cell reset-btn" :class="{ disabled: a.level < 30 }" style="grid-row: 3 / 5; grid-column: 5 / 7;" @click="handleLayer1Reset">
      <div class="rb-name">{{ RESET_NAMES[areaIndex].layer1 }}</div>
      <div class="rb-desc">{{ RESET_NAMES[areaIndex].l1Desc }}</div>
      <div class="rb-req">需Lv.30</div>
      <div class="rb-count">×{{ a.resetCounts.layer1 }}</div>
      <div class="rb-gain" v-if="a.level>=30">{{ previewPrestige }}</div>
    </div>

    <!-- 重置按钮 2x2：结晶 -->
    <div class="cell reset-btn" :class="{ disabled: a.level < 100 }" style="grid-row: 3 / 5; grid-column: 7 / 9;" @click="handleLayer2Reset">
      <div class="rb-name">{{ RESET_NAMES[areaIndex].layer2 }}</div>
      <div class="rb-desc">{{ RESET_NAMES[areaIndex].l2Desc }}</div>
      <div class="rb-req">需Lv.100</div>
      <div class="rb-count">×{{ a.resetCounts.layer2 }}</div>
      <div class="rb-gain" v-if="a.level>=100">{{ previewCrystal }}</div>
    </div>

    <!-- 重置按钮 2x2：草蹦 -->
    <div class="cell reset-btn" :class="{ disabled: a.level < reqL3B1 }" style="grid-row: 5 / 7; grid-column: 5 / 7;" @click="handleLayer3B1Reset">
      <div class="rb-name">{{ RESET_NAMES[areaIndex].layer3B1 }}</div>
      <div class="rb-desc">{{ RESET_NAMES[areaIndex].l3Desc }}</div>
      <div class="rb-req">需Lv.{{ reqL3B1 }}</div>
      <div class="rb-count">×{{ a.resetCounts.layer3B1 + a.milestones.layer3B1 }}</div>
    </div>

    <!-- 重置按钮 2x2：钢化 -->
    <div class="cell reset-btn reset-special" :class="{ disabled: !a.unlockedFeatures.layer3B2 || a.level < 270 }" style="grid-row: 5 / 7; grid-column: 7 / 9;" @click="handleLayer3B2Reset">
      <div class="rb-name">{{ RESET_NAMES[areaIndex].layer3B2 }}</div>
      <div class="rb-desc">{{ RESET_NAMES[areaIndex].l3B2Desc }}</div>
      <div class="rb-req">需Lv.270</div>
      <div class="rb-count">×{{ a.resetCounts.layer3B2 }}</div>
    </div>

    <!-- 资源显示 1x4 -->
    <div class="cell resources-display" style="grid-row: 5 / 7; grid-column: 1 / 5;">
      <div v-for="(r, ri) in resDefs" :key="ri" class="res-chip">
        {{ r.emoji }}{{ r.name }}{{ fmt(a.resources[r.id]) }}
      </div>
    </div>

    <!-- 草蹦里程碑 3x3 -->
    <div class="cell milestones" style="grid-row: 1 / 4; grid-column: 9 / 12;">
      <div class="ms-header">草蹦里程碑</div>
      <div class="ms-scroll">
        <div class="ms-section">已进行 {{ a.milestones.layer3B1 }} 次</div>
        <div v-for="m in allGrassHopMile" :key="'gh'+m.times" class="ms-item" :class="{ done: a.milestones.layer3B1 >= m.times }">
          <span v-if="a.milestones.layer3B1 >= m.times">✓</span><span v-else>○</span>
          {{ m.times }}次: {{ m.desc.substring(0, 28) }}{{ m.desc.length > 28 ? '...' : '' }}
        </div>
      </div>
    </div>

    <!-- 充能里程碑 3x3 (购买143后解锁) -->
    <div class="cell milestones charge-ms" v-if="isChargeUnlocked" style="grid-row: 4 / 7; grid-column: 9 / 12;">
      <div class="ms-header">充能里程碑</div>
      <div class="ms-scroll">
        <div class="ms-section">当前: {{ fmt(a.resources[chargeKey]) }}</div>
        <div v-for="m in allChargeMile" :key="'ch'+m.charge" class="ms-item" :class="{ done: chargeMet(m) }">
          <span v-if="chargeMet(m)">✓</span><span v-else>○</span>
          {{ fmtNum(m.charge) }}: {{ m.desc.substring(0, 28) }}{{ m.desc.length > 28 ? '...' : '' }}
        </div>
      </div>
    </div>

    <!-- 充能未解锁占位 -->
    <div class="cell milestones locked-ms" v-else style="grid-row: 4 / 7; grid-column: 9 / 12;">
      <div class="ms-header">充能里程碑</div>
      <div class="ms-locked">🔒 购买升级后解锁</div>
    </div>

    <!-- 升级分类块 (从第7行开始) -->
    <template v-for="(cat, ci) in upgradeCategories" :key="'cat'+ci">
      <div class="upg-block" :style="blockStyle(ci)">
        <div class="upg-cat-label">{{ cat.emoji }} {{ cat.name }}</div>
        <div
          v-for="(upg, ui) in cat.upgrades"
          :key="upg.id"
          class="cell upgrade-tile"
          :class="{ capped: isCapped(upg), affordable: canAfford(upg) }"
          :style="upgStyle(ci, ui)"
          @click="handleBuyUpgrade(upg.id)"
        >
          <div class="tile-lv">Lv.{{ upg.level }}{{ displayCap(upg) }}</div>
          <div class="tile-cost">{{ resEmoji(upg.buyResource) }} {{ fmt(costCache[upg.id] || '0') }}</div>
          <div class="tile-eff">{{ getEffectText(upg) }}</div>
          <div class="tile-tooltip">
            <div>{{ upg.description }}</div>
            <div class="tt-effect" v-if="upg.level > 0">{{ getEffectText(upg) }} (当前)</div>
            <div class="tt-cap" v-if="upg.cap === Infinity">无上限</div>
            <div class="tt-cap" v-else-if="upg.cap != null">上限: Lv.{{ upg.cap }}</div>
            <div class="tt-cap" v-else>无上限</div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, shallowRef, watch } from 'vue'
import {
  gameState, tick, fmt, D, D0, D1, ensureDec,
  AREA_RESOURCES_LIST, RESET_NAMES,
  cutGrass, buyUpgrade, canAffordUpgrade,
  doLayer1Reset, doLayer2Reset, doLayer3Branch1Reset, doLayer3Branch2Reset,
  getUpgradeCategory, calcUpgradeCost, totalXpForLevel,
  getLayer3B1RequiredLevel, doubleXpCost,
  milestoneDefs, isChargeMilestonesUnlocked,
} from '../game/engine.js'

const props = defineProps({ areaIndex: { type: Number, required: true } })

// 游戏状态 getter
function getA() { void tick.value; return gameState.areas[props.areaIndex] }
const resDefs = computed(() => AREA_RESOURCES_LIST[props.areaIndex])
const chargeKey = computed(() => AREA_RESOURCES_LIST[props.areaIndex][6].id)

// 所有 computeds 直接依赖 tick
const a = computed(() => { void tick.value; return gameState.areas[props.areaIndex] })
const grassCount = computed(() => { void tick.value; return Math.floor(gameState.areas[props.areaIndex].grassField.grass) })
const grassDisplay = computed(() => { void tick.value; return Math.min(Math.floor(gameState.areas[props.areaIndex].grassField.grass), 50) })
const grassPct = computed(() => { void tick.value; const a = gameState.areas[props.areaIndex]; return a.grassField.maxGrass > 0 ? Math.floor(a.grassField.grass) / a.grassField.maxGrass * 100 : 0 })
const reqL3B1 = computed(() => getLayer3B1RequiredLevel(props.areaIndex))
const isChargeUnlocked = computed(() => isChargeMilestonesUnlocked(props.areaIndex))

const xpPct = computed(() => {
  void tick.value
  try {
    const a = gameState.areas[props.areaIndex]
    const n = totalXpForLevel(a.level + 1)
    if (!n || n.eq(0)) return 0
    return Math.min(100, ensureDec(a.xp).div(n).mul(100).toNumber())
  } catch (e) { return 0 }
})

const dlXpPct = computed(() => {
  void tick.value
  const a = gameState.areas[props.areaIndex]
  if (!a.doubleUnlocked) return 0
  try {
    const cost = doubleXpCost(a.doubleLevel)
    if (!cost || cost.eq(0)) return 0
    return Math.min(100, ensureDec(a.doubleXp).div(cost).mul(100).toNumber())
  } catch (e) { return 0 }
})

// 里程碑
const allGrassHopMile = computed(() => milestoneDefs.grassHop)
const allChargeMile = computed(() => milestoneDefs.charge)

function chargeMet(m) {
  try {
    const a = gameState.areas[props.areaIndex]
    return ensureDec(a.resources[chargeKey.value]).gte(D(m.charge))
  } catch (e) { return false }
}

function fmtNum(n) {
  void tick.value
  if (n >= 1e15) return n.toExponential(2)
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return String(n)
}

// 重置预览
const previewPrestige = computed(() => {
  void tick.value
  const a = gameState.areas[props.areaIndex]
  if (a.level < 30) return '需要30级'
  try {
    let g = D(1.4142).pow(a.level / 10)
    const gk = AREA_RESOURCES_LIST[props.areaIndex][0].id
    const grass = ensureDec(a.resources[gk])
    if (grass.gt(0)) g = g.mul(D(1.1487).pow(Math.max(0, Math.log10(grass.toNumber()))))
    return '≈' + fmt(g.floor())
  } catch (e) { return '' }
})

const previewCrystal = computed(() => {
  void tick.value
  const a = gameState.areas[props.areaIndex]
  if (a.level < 100) return '需要100级'
  try {
    let g = D(1.1892).pow(a.level / 10)
    return '≈' + fmt(g.floor())
  } catch (e) { return '' }
})

// 事件处理器
function handleCutGrass() { cutGrass(props.areaIndex); tick.value++ }
function handleBuyUpgrade(id) { buyUpgrade(props.areaIndex, id); tick.value++ }
function handleLayer1Reset() { doLayer1Reset(props.areaIndex); tick.value++ }
function handleLayer2Reset() { doLayer2Reset(props.areaIndex); tick.value++ }
function handleLayer3B1Reset() { doLayer3Branch1Reset(props.areaIndex); tick.value++ }
function handleLayer3B2Reset() { doLayer3Branch2Reset(props.areaIndex); tick.value++ }

// 升级分类
const upgradeCategories = computed(() => {
  void tick.value
  const a = gameState.areas[props.areaIndex]
  const cats = {}
  for (const id in a.upgrades) {
    const def = a.upgrades[id]
    const cat = getUpgradeCategory(id)
    if (cat.idx < 0) continue
    if (!cats[cat.cat]) cats[cat.cat] = { ...cat, upgrades: [] }
    cats[cat.cat].upgrades.push(def)
  }
  return Object.values(cats).sort((a, b) => a.idx - b.idx)
})

function canAfford(upg) {
  void tick.value
  return canAffordUpgrade(props.areaIndex, upg.id)
}

function isCapped(upg) {
  const cap = (upg.cap === null || upg.cap === undefined) ? Infinity : upg.cap
  return upg.level >= cap
}

function displayCap(upg) {
  if (upg.cap === Infinity) return ''
  if (upg.cap != null && upg.cap < 1e9) return '/' + upg.cap
  return ''
}

// 解析升级效果文本（含每10级翻倍逻辑）
function getEffectText(upg) {
  try {
    const desc = upg.description
    const lv = upg.level
    if (lv === 0) {
      if (desc.includes('上限增加')) return '上限 +X'
      if (desc.includes('生长速度')) return '生长 +X%'
      if (desc.includes('多割')) return '多割 +X'
      if (desc.includes('解锁')) return '解锁'
      if (desc.includes('自动购买')) return '自动购买'
      if (desc.includes('不再消耗')) return '免费'
      if (desc.includes('自动割')) return '自动割'
      if (desc.includes('获得数量') || desc.includes('获取数量')) return '资源 +X'
      if (desc.includes('效果')) return '效果 +X'
      return desc.length > 14 ? desc.substring(0, 12) + '...' : desc
    }

    const mRes = desc.match(/每级使(\S+?)(?:的)?(?:获得|获取)数量/)
    const mPer = desc.match(/\+\d+%/g)
    const mPer10 = desc.match(/每(\d+)级使(\S+?)(?:的)?(?:获得|获取)数量×([\d.]+)/)

    if (mRes) {
      const resName = mRes[1]
      let mult = 1
      if (mPer) {
        const pct = parseFloat(String(mPer[0]).replace(/[^\d.]/g, ''))
        if (!isNaN(pct)) mult = 1 + pct / 100 * lv
      }
      if (mPer10) {
        const perN = parseInt(mPer10[1])
        const mul10 = parseFloat(mPer10[3])
        if (!isNaN(mul10)) mult *= Math.pow(mul10, Math.floor(lv / perN))
      }
      const result = mult.toFixed(2)
      return isNaN(+result) || result === 'NaN' ? desc.slice(0, 14) : `${resName} ×${result}`
    }

    const mSimple = desc.match(/^(\S+?)(?:的)?(?:获得|获取)数量\+(\d+)%/)
    if (mSimple) {
      const resName = mSimple[1]
      const pct = parseFloat(mSimple[2])
      if (!isNaN(pct)) {
        let mult = 1 + pct / 100 * lv
        // 处理每N级×W额外乘数
        if (mPer10) {
          const perN = parseInt(mPer10[1])
          const mul10 = parseFloat(mPer10[3])
          if (!isNaN(perN) && !isNaN(mul10)) {
            mult *= Math.pow(mul10, Math.floor(lv / perN))
          }
        }
        const result = mult.toFixed(2)
        return isNaN(+result) || result === 'NaN' ? desc.slice(0, 14) : `${resName} ×${result}`
      }
    }

    const mCharge = desc.match(/(\S+?)获取\+(\d+)%/)
    if (mCharge) {
      const resName = mCharge[1]
      const pct = parseFloat(mCharge[2])
      let mult = !isNaN(pct) ? 1 + pct / 100 * lv : 1
      if (mPer10) {
        const perN = parseInt(mPer10[1])
        const mul10 = parseFloat(mPer10[3])
        if (!isNaN(mul10)) mult *= Math.pow(mul10, Math.floor(lv / perN))
      }
      const result = mult.toFixed(2)
      return isNaN(+result) || result === 'NaN' ? desc.slice(0, 14) : `${resName} ×${result}`
    }

    if (desc.includes('效果')) return `效果 +${lv * 10}%`
    if (desc.includes('上限增加')) return `上限 +${lv}`
    if (desc.includes('生长速度')) return `生长 +${lv * 10}%`
    if (desc.includes('多割')) return `多割 +${lv}`
    if (desc.includes('解锁')) return `已解锁 Lv.${lv}`
    if (desc.includes('自动购买')) return `已激活 Lv.${lv}`
    if (desc.includes('不再消耗')) return `已激活`
    if (desc.includes('自动割')) return `间隔 ${Math.max(0, 5 - (lv - 1))}s`
    return desc.length > 14 ? desc.substring(0, 12) + '...' : desc
  } catch (e) {
    return upg.description ? upg.description.slice(0, 12) + '...' : '?'
  }
}

// ===== 新版升级布局：2行 × (n+1)列 =====
// 左1列标签（2行），其余列每列竖排2个升级
// 多类横向排列，满20列换行

function blockStyle(ci) {
  void tick.value
  const cats = upgradeCategories.value
  let c = 1, r = 7
  for (let i = 0; i < ci; i++) {
    const w = cats[i].upgrades.length / 2 + 1  // n+1 列
    if (c + w > 21) { c = 1; r += 2 }
    c += w
  }
  const w = cats[ci].upgrades.length / 2 + 1
  if (c + w > 21) { c = 1; r += 2 }
  return {
    gridRow: `${r} / ${r + 2}`,
    gridColumn: `${c} / ${c + w}`,
    display: 'grid',
    gridTemplateColumns: `64px repeat(${Math.floor(cats[ci].upgrades.length / 2)}, 64px)`,
    gridTemplateRows: '64px 64px',
    gap: '2px',
  }
}

function upgStyle(ci, ui) {
  // 标签占第1列，升级从第2列开始，每列竖排2个
  const col = 2 + Math.floor(ui / 2)
  const row = 1 + (ui % 2)
  return { gridRow: `${row}`, gridColumn: `${col}` }
}

const costCache = shallowRef({})
watch(tick, () => {
  const c = {}
  const a = gameState.areas[props.areaIndex]
  for (const id in a.upgrades) {
    try { c[id] = calcUpgradeCost(a.upgrades[id]) } catch (e) { c[id] = D0 }
  }
  costCache.value = c
}, { immediate: true })

function resEmoji(buyRes) {
  for (const d of resDefs.value) if (d.id === buyRes) return d.emoji
  return '❓'
}
</script>

<style scoped>
.area-grid {
  display: grid;
  grid-template-columns: repeat(20, 64px);
  grid-auto-rows: 64px;
  gap: 2px;
  justify-content: start;
}

.cell {
  border: 1px solid #30363d;
  border-radius: 4px;
  background: #161b22;
  overflow: hidden;
  padding: 2px;
  font-size: 10px;
  transition: border-color 0.15s;
}

/* 草地 */
.grass-field {
  cursor: pointer;
  background: linear-gradient(180deg, #1a3a1a 0%, #0d1f0d 100%);
  border-color: #2d5a2d;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.grass-field:hover { border-color: #4a8a4a; }
.grass-field:active { opacity: 0.9; }
.grass-emoji-row { font-size: 16px; line-height: 1.2; flex-wrap: wrap; max-height: 80px; overflow: hidden; }
.grass-empty { color: #4a7a4a; font-size: 11px; }
.grass-count { font-size: 18px; font-weight: bold; color: #7adf7a; margin: 4px 0; }
.grass-bar-outer { width: 80%; height: 6px; background: #1a3a1a; border-radius: 3px; margin: 4px 0; }
.grass-bar-inner { height: 100%; background: linear-gradient(90deg, #3fb950, #7ee787); border-radius: 3px; transition: width 0.3s; }
.grass-hint { color: #4a7a4a; font-size: 10px; }

/* 经验条 */
.xp-bar-cell {
  display: flex;
  flex-direction: column;
  padding: 3px 6px;
  gap: 0;
}
.xp-top {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  line-height: 1.2;
}
.xp-label { font-size: 14px; font-weight: bold; color: #58a6ff; }
.dl-label { color: #a371f7; }
.xp-val { color: #8b949e; font-size: 9px; }
.xp-bonus { color: #d29922; font-size: 9px; }
.xp-bottom { height: 10px; padding-bottom: 4px; }
.xp-fill { width: 100%; height: 6px; background: #21262d; border-radius: 3px; }
.xp-inner { height: 100%; background: linear-gradient(90deg, #3fb950, #7ee787); border-radius: 3px; transition: width 0.3s; }
.dl-inner { background: linear-gradient(90deg, #a371f7, #d2a8ff); }
.dl-xp-cell { border-color: #a371f744; }

/* 重置按钮 */
.reset-btn {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-color: #f0883e44;
  background: #1c1a14;
  text-align: center;
  gap: 1px;
  padding: 2px;
}
.reset-btn:hover:not(.disabled) { border-color: #f0883e; background: #2a2018; }
.reset-btn.disabled { opacity: 0.45; cursor: not-allowed; }
.reset-special { border-color: #a371f744; background: #1a1424; }
.reset-special:hover:not(.disabled) { border-color: #a371f7; }
.rb-name { font-size: 12px; font-weight: bold; color: #f0883e; }
.rb-desc { font-size: 7px; color: #8b949e; white-space: pre-line; line-height: 1.2; }
.rb-count { font-size: 9px; color: #8b949e; }
.rb-req { font-size: 9px; color: #f0883e; }
.rb-gain { font-size: 8px; color: #3fb950; }

/* 资源 */
.resources-display {
  display: flex;
  flex-direction: column;
  gap: 1px;
  align-items: stretch;
  padding: 3px 6px;
  border-color: #30363d;
}
.res-chip { font-size: 9px; color: #c9d1d9; white-space: nowrap; line-height: 1.4; }

/* 里程碑 */
.milestones {
  display: flex;
  flex-direction: column;
  border-color: #d2992244;
  background: #1c1a14;
  overflow: hidden;
}
.charge-ms { border-color: #a371f744; background: #1a1424; }
.locked-ms { border-color: #30363d; background: #161b22; }
.ms-header {
  font-size: 12px;
  font-weight: bold;
  color: #d29922;
  padding: 4px 6px;
  border-bottom: 1px solid #30363d;
  flex-shrink: 0;
}
.charge-ms .ms-header { color: #a371f7; }
.ms-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 2px 4px;
  font-size: 9px;
  line-height: 1.4;
}
.ms-scroll::-webkit-scrollbar { width: 3px; }
.ms-scroll::-webkit-scrollbar-thumb { background: #30363d; border-radius: 2px; }
.ms-section { color: #d29922; font-size: 10px; font-weight: bold; margin: 3px 0 1px; }
.charge-ms .ms-section { color: #a371f7; }
.ms-item { color: #484f58; padding: 1px 0; }
.ms-item.done { color: #7ee787; }
.charge-ms .ms-item.done { color: #a371f7; }
.ms-locked {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #484f58;
  font-size: 11px;
}

/* 升级分类块 */
.upg-block {
  display: grid;
  gap: 2px;
}

/* 升级分类标签 - 占第1列，2行高 */
.upg-cat-label {
  grid-row: 1 / 3;
  grid-column: 1;
  font-size: 11px;
  font-weight: bold;
  color: #58a6ff;
  padding: 4px;
  border: 1px solid #58a6ff44;
  border-radius: 4px;
  background: #161b22;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  writing-mode: vertical-lr;
  text-orientation: upright;
  letter-spacing: 2px;
  line-height: 1.4;
}

/* 升级块 1x1 */
.upgrade-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: all 0.15s;
  background: #21262d;
  border-color: #30363d;
  text-align: center;
  gap: 1px;
  overflow: visible;
}
.upgrade-tile:hover { background: #30363d; }
.upgrade-tile:hover .tile-tooltip { display: block; }
.upgrade-tile.affordable { border-color: #3fb95044; background: #1a2a1a; }
.upgrade-tile.capped { opacity: 0.5; border-color: #d2992244; }
.tile-lv { font-size: 10px; color: #58a6ff; font-weight: bold; }
.tile-cost { font-size: 8px; color: #8b949e; }
.tile-eff { font-size: 7px; color: #d29922; line-height: 1.2; text-align: center; }
.tile-tooltip {
  display: none;
  position: absolute;
  bottom: 105%;
  left: 50%;
  transform: translateX(-50%);
  background: #0d1117;
  border: 1px solid #58a6ff;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 10px;
  color: #c9d1d9;
  white-space: normal;
  z-index: 50;
  width: 200px;
  text-align: left;
  line-height: 1.4;
  pointer-events: none;
}
.tt-effect { color: #d29922; margin-top: 3px; }
.tt-cap { color: #8b949e; margin-top: 2px; font-size: 9px; }
</style>