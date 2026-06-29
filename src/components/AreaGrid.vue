<template>
  <div class="area-grid">
    <!-- 草地 4x4 -->
    <div class="cell grass-field" style="grid-row: 1 / 5; grid-column: 1 / 5;" @click="handleCutGrass">
      <div class="grass-emoji-row">
        <span v-for="i in argentumDisplay" :key="'a'+i">⚪</span><br v-if="argentumCount > 0" />
        <span v-for="i in cuprumDisplay" :key="'c'+i">🟠</span><br v-if="cuprumCount > 0" />
        <span v-for="i in grassDisplay" :key="'g'+i">{{ resDefs[0].emoji }}</span>
        <span v-if="grassCount === 0 && cuprumCount === 0 && argentumCount === 0" class="grass-empty">等待生长...</span>
      </div>
      <div class="grass-count">
        <span v-if="argentumCount > 0">⚪{{ argentumCount }} </span>
        <span v-if="cuprumCount > 0">🟠{{ cuprumCount }} </span>
        {{ resDefs[0].emoji }}{{ grassCount }} / {{ fmt(a.grassField.maxGrass) }}
      </div>
      <div class="grass-bar-outer"><div class="grass-bar-inner" :style="{width: grassPct+'%'}"></div></div>
      <div class="grass-hint">点击割草</div>
    </div>

    <!-- 等级经验条 1x4 -->
    <div class="cell xp-bar-cell" style="grid-row: 1; grid-column: 5 / 9;">
      <div class="xp-top">
        <span class="xp-label">{{ areaIndex===1 ? 'ALv.' : 'Lv.' }}{{ fmt(a.level) }}</span>
        <span class="xp-val">{{ fmt(a.xp) }} / {{ fmt(xpForLevelUp(a.level)) }}</span>
        <span class="xp-bonus" v-if="areaIndex===0">草 ×{{ fmt(xpEffect(areaIndex)) }}</span>
        <span class="xp-bonus" v-if="areaIndex===1">充能 ×{{ fmt(D(1).add(a.level.div(2)).mul(D(1.05).pow(a.level))) }}</span>
        <span class="xp-bonus" v-if="areaIndex===2">压缩 +{{ a.level.mul(100).toNumber().toFixed(0) }}%</span>
        <span class="xp-bonus" v-if="areaIndex===3">速度 +{{ a.level.mul(100).toNumber().toFixed(0) }}%</span>
      </div>
      <div class="xp-bottom">
        <div class="xp-fill"><div class="xp-inner" :style="{width: xpPct+'%'}"></div></div>
      </div>
    </div>

    <!-- 二重等级经验条 1x4 -->
    <div class="cell xp-bar-cell dl-xp-cell" v-if="areaIndex===0" style="grid-row: 2; grid-column: 5 / 9;">
      <div class="xp-top">
        <span class="xp-label dl-label">DLv.{{ fmt(a.doubleLevel) }}</span>
        <span class="xp-val">{{ fmt(a.doubleXp) }} / {{ fmt(doubleXpCost(a.doubleLevel)) }}</span>
        <span class="xp-bonus" v-if="a.doubleUnlocked">草/经验 ×{{ fmt(doubleXpEffect(areaIndex)) }}</span>
        <span class="xp-bonus" v-else>Lv.30 解锁</span>
      </div>
      <div class="xp-bottom">
        <div class="xp-fill"><div class="xp-inner dl-inner" :style="{width: dlXpPct+'%'}"></div></div>
      </div>
    </div>
    <!-- A2 DLv留空 -->
    <div class="cell xp-bar-cell dl-xp-cell" v-else style="grid-row: 2; grid-column: 5 / 9;">
    </div>

    <!-- 重置按钮 2x2：声望 -->
    <div class="cell reset-btn" :class="{ disabled: !canPrestige }" style="grid-row: 3 / 5; grid-column: 5 / 7;" @click="handleLayer1Reset">
      <div class="rb-name">{{ RESET_NAMES[areaIndex].layer1 }}</div>
      <div class="rb-desc">{{ RESET_NAMES[areaIndex].l1Desc }}</div>
      <div class="rb-req">需Lv.30</div>
      <div class="rb-gain" v-if="canPrestige">{{ previewPrestige }}</div>
    </div>

    <!-- 重置按钮 2x2：结晶 -->
    <div class="cell reset-btn" :class="{ disabled: !canCrystal }" style="grid-row: 3 / 5; grid-column: 7 / 9;" @click="handleLayer2Reset">
      <div class="rb-name">{{ RESET_NAMES[areaIndex].layer2 }}</div>
      <div class="rb-desc">{{ RESET_NAMES[areaIndex].l2Desc }}</div>
      <div class="rb-req">需Lv.100</div>
      <div class="rb-gain" v-if="canCrystal">{{ previewCrystal }}</div>
    </div>

    <!-- 重置按钮 2x2：草蹦 -->
    <div class="cell reset-btn" :class="{ disabled: !canGrassHop }" style="grid-row: 5 / 7; grid-column: 5 / 7;" @click="handleLayer3B1Reset">
      <div class="rb-name">{{ RESET_NAMES[areaIndex].layer3B1 }}</div>
      <div class="rb-desc">{{ RESET_NAMES[areaIndex].l3Desc }}</div>
      <div class="rb-req">需Lv.{{ fmt(reqL3B1) }}</div>
      <div class="rb-gain" v-if="canGrassHop">{{ previewGrassHop }}</div>
    </div>

    <!-- 重置按钮 2x2：钢化 -->
    <div class="cell reset-btn reset-special" :class="{ disabled: !canSteel }" style="grid-row: 5 / 7; grid-column: 7 / 9;" @click="handleLayer3B2Reset">
      <div class="rb-name">{{ RESET_NAMES[areaIndex].layer3B2 }}</div>
      <div class="rb-desc">{{ RESET_NAMES[areaIndex].l3B2Desc }}</div>
      <div class="rb-req">需Lv.270</div>
      <div class="rb-gain" v-if="canSteel">{{ previewSteel }}</div>
    </div>

    <!-- 资源显示 2x4 -->
    <div class="cell resources-display" style="grid-row: 5 / 7; grid-column: 1 / 5;">
      <div v-for="(r, ri) in resDefs" :key="ri" class="res-chip">
        {{ r.emoji }}{{ r.name }}{{ fmt(a.resources[r.id]) }}
      </div>
    </div>

    <!-- 草蹦/草跳里程碑 3x3 -->
    <div class="cell milestones" style="grid-row: 1 / 4; grid-column: 9 / 12;">
      <div class="ms-header">{{ areaIndex === 1 ? '草跳里程碑' : '草蹦里程碑' }}</div>
      <div class="ms-scroll">
        <div class="ms-section">已进行 {{ fmt(areaIndex === 1 ? a.milestones.grassSkip : a.milestones.layer3B1) }} 次</div>
        <div v-for="m in allGrassHopMile" :key="'gh'+m.times" class="ms-item" :class="{ done: hopMileMet(m) }">
          <span v-if="hopMileMet(m)">✓</span><span v-else>○</span>
          {{ m.times }}次: {{ m.desc.substring(0, 28) }}{{ m.desc.length > 28 ? '...' : '' }}
        </div>
      </div>
    </div>

    <!-- 充能/SFRGT里程碑 3x3 -->
    <div class="cell milestones charge-ms" v-if="isChargeUnlocked" style="grid-row: 4 / 7; grid-column: 9 / 12;">
      <div class="ms-header">{{ areaIndex === 1 ? 'SFRGT里程碑' : '充能里程碑' }}</div>
      <div class="ms-scroll">
        <div class="ms-section">当前: {{ fmt(a.resources[chargeKey]) }} | +{{ fmt(chargePerSec) }}/秒</div>
        <div v-for="m in visibleChargeMile" :key="'ch'+m.charge" class="ms-item" :class="{ done: chargeMet(m) }">
          <span v-if="chargeMet(m)">✓</span><span v-else>○</span>
          {{ fmtNum(m.charge) }}: {{ m.desc.substring(0, 22) }}{{ m.desc.length > 22 ? '...' : '' }}
          <span v-if="chargeMet(m)" class="ms-bonus">×{{ fmt(getChargeMilestoneEffect(props.areaIndex, m).multiplier) }}</span>
        </div>
      </div>
    </div>

    <!-- 里程碑未解锁占位 -->
    <div class="cell milestones locked-ms" v-else style="grid-row: 4 / 7; grid-column: 9 / 12;">
      <div class="ms-header">{{ areaIndex === 1 ? 'SFRGT里程碑' : '充能里程碑' }}</div>
      <div class="ms-locked">🔒 购买升级后解锁</div>
    </div>

    <!-- 火箭燃料 3x3 (购买146后解锁，仅A1) -->
    <div class="cell milestones fuel-panel" v-if="areaIndex===0 && fuelUnlocked" style="grid-row: 1 / 4; grid-column: 12 / 15;">
      <div class="ms-header">🚀 火箭燃料</div>
      <div class="ms-scroll">
        <div class="ms-section">当前: {{ fmt(a.resources['fuel']) }}</div>
        <div class="ms-section">合成: ⚡1e6 + 🛢️1e3 → 🚀×1</div>
        <div class="synth-btns">
          <button class="synth-btn" :disabled="maxFuel.lte(D0)" @click="handleSynthFuel">合成1个</button>
          <button class="synth-btn" :disabled="maxFuel.lte(D0)" @click="handleSynthFuelMax">最大×{{ fmt(maxFuel) }}</button>
        </div>
      </div>
    </div>

    <!-- 星星重置 2x2 (购买148后解锁，仅A1，火箭燃料右侧) -->
    <div class="cell reset-btn star-reset" v-if="starUnlocked" style="grid-row: 1 / 3; grid-column: 15 / 17;" @click="handleStarReset">
      <div class="rb-name">✨ 星星重置</div>
      <div class="rb-desc">重置A1全部和A2液化及以前</div>
      <div class="rb-gain">获得 {{ fmt(starGain) }} ✨</div>
    </div>

    <!-- 火箭部件 3x3 (购买147后解锁，仅A1) -->
    <div class="cell milestones part-panel" v-if="areaIndex===0 && partUnlocked" style="grid-row: 4 / 7; grid-column: 12 / 15;">
      <div class="ms-header">🔧 火箭部件</div>
      <div class="ms-scroll">
        <div class="ms-section">当前: {{ fmt(a.resources['part']) }}</div>
        <div class="ms-section">合成: 🚀1e3 + 🔩1e6 → 🔧×1</div>
        <div class="synth-btns">
          <button class="synth-btn" :disabled="maxPart.lte(D0)" @click="handleSynthPart">合成1个</button>
          <button class="synth-btn" :disabled="maxPart.lte(D0)" @click="handleSynthPartMax">最大×{{ fmt(maxPart) }}</button>
        </div>
      </div>
    </div>

    <!-- 升级分类块 (从第7行开始) -->
    <template v-for="(cat, ci) in upgradeCategories" :key="'cat'+ci">
      <div class="upg-block" :style="blockStyle(ci)">
        <div class="upg-cat-label">{{ cat.emoji }} {{ cat.name }}</div>
        <div
          v-for="(upg, ui) in cat.upgrades"
          :key="upg.id"
          class="cell upgrade-tile"
          :class="{ capped: isCapped(upg), affordable: canAfford(upg), locked: isLocked(upg) }"
          :style="upgStyle(ci, ui)"
          @click="handleBuyUpgrade(upg.id)"
        >
          <div class="tile-lv">{{ isLocked(upg) ? '🔒' : 'Lv.'+fmt(upg.level) }}{{ displayCap(upg) }}</div>
          <div class="tile-cost">{{ isLocked(upg) ? '锁定' : resEmoji(upg.buyResource) + ' ' + (shiftHeld ? '×10: ' + fmt(totalCostCache[upg.id] || '0') : fmt(costCache[upg.id] || '0')) }}</div>
          <div class="tile-eff">{{ getEffectText(upg) }}</div>
          <div class="tile-tooltip">
            <div>{{ upg.description }}</div>
            <div class="tt-effect" v-if="D(upg.level).gt(0)">{{ getEffectText(upg) }} (当前)</div>
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
  cutGrass, buyUpgrade, buyUpgradeMultiple, canAffordUpgrade, getUpgradeLevel,
  doLayer1Reset, doLayer2Reset, doLayer3Branch1Reset, doLayer3Branch2Reset,
  getUpgradeCategory, calcUpgradeCost, calcUpgradeTotalCost, xpForLevelUp,
  getLayer3B1RequiredLevel, doubleXpCost, xpEffect, doubleXpEffect,
  calcPrestigeGain, calcCrystalGain, calcSteelGain,
  milestoneDefs, isChargeMilestonesUnlocked, isUpgradeUnlocked,
  isCuprumUnlocked, cuprumMultiplier, isArgentumUnlocked, argentumMultiplier,
  getChargeMilestoneEffect, calcChargePerSec,
  isFuelUnlocked, isPartUnlocked, synthesizeFuel, synthesizePart, maxFuelSynth, maxPartSynth,
  isStarResetUnlocked, calcStarGain, doStarReset,
} from '../game/engine.js'

const props = defineProps({ areaIndex: { type: Number, required: true } })

// Shift 键状态跟踪
const shiftHeld = shallowRef(false)
function onKeyDown(e) { if (e.key === 'Shift') shiftHeld.value = true }
function onKeyUp(e) { if (e.key === 'Shift') shiftHeld.value = false }
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
}

// 游戏状态 getter
function getA() { void tick.value; return gameState.areas[props.areaIndex] }
const resDefs = computed(() => AREA_RESOURCES_LIST[props.areaIndex])
const chargeKey = computed(() => AREA_RESOURCES_LIST[props.areaIndex][6].id)

// 所有 computeds 直接依赖 tick
const a = computed(() => { void tick.value; return gameState.areas[props.areaIndex] })
const grassCount = computed(() => { void tick.value; return gameState.areas[props.areaIndex].grassField.grass.floor().toNumber() })
const grassDisplay = computed(() => { void tick.value; return Math.min(gameState.areas[props.areaIndex].grassField.grass.floor().toNumber(), 100) })
const grassPct = computed(() => { void tick.value; const a = gameState.areas[props.areaIndex]; return a.grassField.maxGrass.gt(D0) ? a.grassField.grass.div(a.grassField.maxGrass).mul(100).toNumber() : 0 })
const cuprumCount = computed(() => { void tick.value; return isCuprumUnlocked(props.areaIndex) ? gameState.areas[props.areaIndex].grassField.cuprum.floor().toNumber() : 0 })
const cuprumDisplay = computed(() => { void tick.value; return Math.min(cuprumCount.value, 20) })
const argentumCount = computed(() => { void tick.value; return isArgentumUnlocked(props.areaIndex) ? (gameState.areas[props.areaIndex].grassField.argentum || D0).floor().toNumber() : 0 })
const argentumDisplay = computed(() => { void tick.value; return Math.min(argentumCount.value, 20) })
const reqL3B1 = computed(() => getLayer3B1RequiredLevel(props.areaIndex))
const isChargeUnlocked = computed(() => { void tick.value; return isChargeMilestonesUnlocked(props.areaIndex) })
const chargePerSec = computed(() => { void tick.value; return calcChargePerSec(props.areaIndex) })
const fuelUnlocked = computed(() => { void tick.value; return isFuelUnlocked(props.areaIndex) })
const partUnlocked = computed(() => { void tick.value; return isPartUnlocked(props.areaIndex) })
const maxFuel = computed(() => { void tick.value; return maxFuelSynth(props.areaIndex) })
const maxPart = computed(() => { void tick.value; return maxPartSynth(props.areaIndex) })
const starUnlocked = computed(() => { void tick.value; return props.areaIndex === 0 && isStarResetUnlocked() })
const starGain = computed(() => { void tick.value; return calcStarGain() })

// Decimal 比较的 computed 布尔值（模板中无法直接使用 .lt/.gte 等方法）
const canPrestige = computed(() => { void tick.value; return gameState.areas[props.areaIndex].level.gte(D(30)) })
const canCrystal = computed(() => { void tick.value; return gameState.areas[props.areaIndex].level.gte(D(100)) })
const canGrassHop = computed(() => { void tick.value; return gameState.areas[props.areaIndex].level.gte(reqL3B1.value) })
const canSteel = computed(() => { void tick.value; const a = gameState.areas[props.areaIndex]; return a.unlockedFeatures.layer3B2 && a.level.gte(D(270)) })
const l3B1TotalCount = computed(() => { void tick.value; const a = gameState.areas[props.areaIndex]; return a.resetCounts.layer3B1.add(a.milestones.layer3B1).toNumber() })

const xpPct = computed(() => {
  void tick.value
  try {
    const a = gameState.areas[props.areaIndex]
    const n = xpForLevelUp(a.level)
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
const allGrassHopMile = computed(() => {
  void tick.value
  return props.areaIndex === 1 ? milestoneDefs.grassSkip : milestoneDefs.grassHop
})
const allChargeMile = computed(() => milestoneDefs.charge)

const visibleChargeMile = computed(() => {
  void tick.value
  const hidePost242 = getUpgradeLevel(props.areaIndex, '242') < 1
  return milestoneDefs.charge.filter(m => {
    if (hidePost242 && D(m.charge).gte(D(1e27))) return false
    return true
  })
})

function hopMileMet(m) {
  void tick.value
  const a = gameState.areas[props.areaIndex]
  const count = props.areaIndex === 1 ? a.milestones.grassSkip : a.milestones.layer3B1
  return ensureDec(count).gte(D(m.times))
}

function chargeMet(m) {
  try {
    const a = gameState.areas[props.areaIndex]
    return ensureDec(a.resources[chargeKey.value]).gte(D(m.charge))
  } catch (e) { return false }
}

function fmtNum(n) {
  void tick.value
  if (n >= 1e3) return n.toExponential(2)
  return String(n)
}

// 重置预览
const previewPrestige = computed(() => {
  void tick.value
  const a = gameState.areas[props.areaIndex]
  if (a.level.lt(D(30))) return '需要30级'
  try {
    const resName = AREA_RESOURCES_LIST[props.areaIndex][1].name
    return '获得' + fmt(calcPrestigeGain(props.areaIndex)) + resName
  } catch (e) { return '' }
})

const previewCrystal = computed(() => {
  void tick.value
  const a = gameState.areas[props.areaIndex]
  if (a.level.lt(D(100))) return '需要100级'
  try {
    const resName = AREA_RESOURCES_LIST[props.areaIndex][2].name
    return '获得' + fmt(calcCrystalGain(props.areaIndex)) + resName
  } catch (e) { return '' }
})

const previewGrassHop = computed(() => {
  void tick.value
  const a = gameState.areas[props.areaIndex]
  const req = getLayer3B1RequiredLevel(props.areaIndex)
  if (a.level.lt(req)) return ''
  try {
    return '草蹦次数+1'
  } catch (e) { return '' }
})

const previewSteel = computed(() => {
  void tick.value
  const a = gameState.areas[props.areaIndex]
  if (!a.unlockedFeatures.layer3B2 || a.level.lt(D(270))) return '需要270级'
  try {
    const resName = AREA_RESOURCES_LIST[props.areaIndex][3].name
    return '获得' + fmt(calcSteelGain(props.areaIndex)) + resName
  } catch (e) { return '' }
})

// 事件处理器
function handleCutGrass() { cutGrass(props.areaIndex); tick.value++ }
function handleBuyUpgrade(id) {
  if (shiftHeld.value) {
    buyUpgradeMultiple(props.areaIndex, id, 10)
  } else {
    buyUpgrade(props.areaIndex, id)
  }
  tick.value++
}
function handleLayer1Reset() { doLayer1Reset(props.areaIndex); tick.value++ }
function handleLayer2Reset() { doLayer2Reset(props.areaIndex); tick.value++ }
function handleLayer3B1Reset() { doLayer3Branch1Reset(props.areaIndex); tick.value++ }
function handleLayer3B2Reset() { doLayer3Branch2Reset(props.areaIndex); tick.value++ }
function handleSynthFuel() { if (maxFuel.value.gt(D0)) { synthesizeFuel(props.areaIndex, D1); tick.value++ } }
function handleSynthFuelMax() { if (maxFuel.value.gt(D0)) { synthesizeFuel(props.areaIndex, maxFuel.value); tick.value++ } }
function handleSynthPart() { if (maxPart.value.gt(D0)) { synthesizePart(props.areaIndex, D1); tick.value++ } }
function handleSynthPartMax() { if (maxPart.value.gt(D0)) { synthesizePart(props.areaIndex, maxPart.value); tick.value++ } }
function handleStarReset() { doStarReset(); tick.value++ }

// 升级分类
const upgradeCategories = computed(() => {
  void tick.value
  const a = gameState.areas[props.areaIndex]
  const cats = {}
  // A1区域只显示1xx升级，A2区域只显示2xx升级
  const areaPrefix = props.areaIndex === 0 ? '1' : props.areaIndex === 1 ? '2' : String(props.areaIndex + 1)
  for (const id in a.upgrades) {
    if (!id.startsWith(areaPrefix)) continue
    if (!isUpgradeUnlocked(props.areaIndex, id)) continue
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

function isLocked(upg) {
  void tick.value
  return !isUpgradeUnlocked(props.areaIndex, upg.id)
}

function isCapped(upg) {
  const cap = (upg.cap === null || upg.cap === undefined) ? Infinity : upg.cap
  return D(upg.level).gte(D(cap))
}

function displayCap(upg) {
  if (upg.cap === Infinity) return ''
  if (upg.cap != null && upg.cap < 1e9) return '/' + upg.cap
  return ''
}

// 解析升级效果文本（含每10级翻倍逻辑）
function getEffectText(upg) {
  try {
    const lv = D(upg.level).toNumber()
    const boost = upg.boostResource || ''
    const add = upg.addition || 0
    const multPer10 = upg.multPer10 || 1

    // 无加成资源的升级
    if (!boost) {
      if (lv === 0) {
        if (upg.description.includes('解锁')) return '解锁'
        if (upg.description.includes('自动购买')) return '自动购买'
        if (upg.description.includes('不再消耗')) return '免费'
        if (upg.description.includes('自动割1')) return '自动'
        if (upg.description.includes('自动割草')) return '自动割草'
        if (upg.description.includes('自动割反草')) return '自动割反草'
        if (upg.description.includes('自动生成')) return '自动生成'
        if (upg.description.includes('不再重置')) return '不再重置'
        return upg.description.length > 14 ? upg.description.substring(0, 12) + '...' : upg.description
      }
      if (upg.description.includes('效果')) return `效果 +${lv * 10}%`
      if (upg.description.includes('解锁')) return `已解锁 Lv.${lv}`
      if (upg.description.includes('自动购买')) return `已激活`
      if (upg.description.includes('不再消耗')) return `已激活`
      if (upg.description.includes('自动割1次反草')) return `间隔 ${(1/lv).toFixed(2)}s`
      if (upg.description.includes('自动割1')) return `间隔 ${Math.max(0, 5 - (lv - 1))}s`
      if (upg.description.includes('自动割草')) return `已激活 Lv.${lv}`
      if (upg.description.includes('自动割反草')) return `×${1+lv} 自动割反草`
      if (upg.description.includes('自动生成')) return `已激活`
      if (upg.description.includes('不再重置')) return `已激活`
      return upg.description.length > 14 ? upg.description.substring(0, 12) + '...' : upg.description
    }

    // 有加成资源的升级 - 使用新公式
    // 公式: ×(1+等级×addition)×multPer10^floor(等级/10)
    const addMult = 1 + lv * add
    const per10Mult = Math.pow(multPer10, Math.floor(lv / 10))
    const totalMult = addMult * per10Mult

    // 获得资源名称显示
    let resName = boost
    if (boost === 'grass') resName = '草'
    else if (boost === 'xp') resName = '经验'
    else if (boost === 'doubleXp') resName = '二重'
    else if (boost === 'prestige') resName = '声望'
    else if (boost === 'crystal') resName = '水晶'
    else if (boost === 'steel') resName = '钢'
    else if (boost === 'charge') resName = '充能'
    else if (boost === 'cut_amount') resName = '多割'
    else if (boost === 'A1_grass_cap') resName = '上限'
    else if (boost === 'A1_growth_speed') resName = '长速'
    else if (boost === 'antiGrass') resName = '反草'
    else if (boost === 'antiXp') resName = '反经验'
    else if (boost === 'A2_grass_cap') resName = '上限'
    else if (boost === 'A2_growth_speed') resName = '长速'
    else if (boost === 'anonymousPoint') resName = '匿名点'
    else if (boost === 'oil') resName = '石油'
    else if (boost === 'cuprum') resName = '铜'

    if (lv === 0) return `${resName} ×?`

    return `${resName} ×${fmt(D(totalMult))}`
  } catch (e) {
    return upg.description ? upg.description.slice(0, 12) + '...' : '?'
  }
}

// ===== 新版升级布局：2行 × (n+1)列 =====
// 左1列标签（2行），其余列每列竖排2个升级
// 多类横向排列，满16列换行

function blockStyle(ci) {
  void tick.value
  const cats = upgradeCategories.value
  let c = 1, r = 7
  for (let i = 0; i < ci; i++) {
    const w = cats[i].upgrades.length / 2 + 1  // n+1 列
    if (c + w > 17) { c = 1; r += 2 }
    c += w
  }
  const w = cats[ci].upgrades.length / 2 + 1
  if (c + w > 17) { c = 1; r += 2 }
  return {
    gridRow: `${r} / ${r + 2}`,
    gridColumn: `${c} / ${c + w}`,
    display: 'grid',
    gridTemplateColumns: `100px repeat(${Math.floor(cats[ci].upgrades.length / 2)}, 100px)`,
    gridTemplateRows: '100px 100px',
    gap: '0',
  }
}

function upgStyle(ci, ui) {
  // 标签占第1列，升级从第2列开始，每列竖排2个
  const col = 2 + Math.floor(ui / 2)
  const row = 1 + (ui % 2)
  return { gridRow: `${row}`, gridColumn: `${col}` }
}

const costCache = shallowRef({})
const totalCostCache = shallowRef({})
watch(tick, () => {
  const c = {}
  const tc = {}
  const a = gameState.areas[props.areaIndex]
  for (const id in a.upgrades) {
    try {
      c[id] = calcUpgradeCost(a.upgrades[id])
      tc[id] = calcUpgradeTotalCost(a.upgrades[id], 10)
    } catch (e) { c[id] = D0; tc[id] = D0 }
  }
  costCache.value = c
  totalCostCache.value = tc
}, { immediate: true })

function resEmoji(buyRes) {
  for (const d of resDefs.value) if (d.id === buyRes) return d.emoji
  return '❓'
}
</script>

<style scoped>
.area-grid {
  display: grid;
  grid-template-columns: repeat(20, 100px);
  grid-auto-rows: 100px;
  gap: 0;
  justify-content: start;
}

.cell {
  border: 1px solid #30363d;
  background: #161b22;
  overflow: hidden;
  padding: 2px;
  font-size: 14px;
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
.grass-emoji-row { font-size: 14px; line-height: 1.2; flex-wrap: wrap; max-height: 140px; overflow: hidden; }
.grass-empty { color: #4a7a4a; font-size: 14px; }
.grass-count { font-size: 18px; font-weight: bold; color: #7adf7a; margin: 4px 0; }
.grass-bar-outer { width: 80%; height: 6px; background: #1a3a1a; border-radius: 3px; margin: 4px 0; }
.grass-bar-inner { height: 100%; background: linear-gradient(90deg, #3fb950, #7ee787); border-radius: 3px; transition: width 0.3s; }
.grass-hint { color: #4a7a4a; font-size: 14px; }

/* 经验条 */
.xp-bar-cell {
  display: flex;
  flex-direction: column;
  padding: 10px 10px;
  gap: 10px;
}
.xp-top {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  line-height: 1.2;
}
.xp-label { font-size: 20px; font-weight: bold; color: #58a6ff; }
.axp-label { font-size: 20px; font-weight: bold; color:  #000ed3; }
.dl-label { color: #f7ee71; }
.xp-val { color: #8b949e; font-size: 14px; }
.xp-bonus { color: #d29922; font-size: 14px; }
.xp-bottom { height: 10px; padding-bottom: 4px; }
.xp-fill { width: 100%; height: 10px; background: #21262d; border-radius: 2px; }
.xp-inner { height: 100%; background: linear-gradient(90deg, #58a6ff, #83d8ff); border-radius: 2px; transition: width 0.2s; }
.axp-inner { height: 100%; background: linear-gradient(90deg, #000ed3, #1423ff); border-radius: 2px; transition: width 0.2s; }
.dl-inner { background: linear-gradient(90deg, #f5f771, #fff9a8); }
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
.rb-name { font-size: 14px; font-weight: bold; color: #f0883e; }
.rb-desc { font-size: 14px; color: #8b949e; white-space: pre-line; line-height: 1.2; }
.rb-count { font-size: 14px; color: #8b949e; }
.rb-req { font-size: 14px; color: #f0883e; }
.rb-gain { font-size: 14px; color: #3fb950; }

/* 资源 */
.resources-display {
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: stretch;
  padding: 5px 5px;
  border-color: #30363d;
}
.res-chip { font-size: 14px; color: #c9d1d9; white-space: nowrap; line-height: 1.4; }

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
  font-size: 14px;
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
  font-size: 14px;
  line-height: 1.4;
}
.ms-scroll::-webkit-scrollbar { width: 3px; }
.ms-scroll::-webkit-scrollbar-thumb { background: #30363d; border-radius: 2px; }
.ms-section { color: #d29922; font-size: 14px; font-weight: bold; margin: 3px 0 1px; }
.charge-ms .ms-section { color: #a371f7; }
.ms-item { color: #484f58; padding: 1px 0; }
.ms-item.done { color: #7ee787; }
.ms-bonus { color: #a371f7; font-size: 0.85em; margin-left: 4px; }
.synth-btns { display: flex; gap: 4px; margin-top: 4px; }
.synth-btn { background: #21262d; color: #c9d1d9; border: 1px solid #30363d; border-radius: 4px; padding: 3px 8px; cursor: pointer; font-size: 0.8em; }
.synth-btn:hover:not(:disabled) { background: #30363d; }
.synth-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.charge-ms .ms-item.done { color: #a371f7; }
.ms-locked {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #484f58;
  font-size: 14px;
}

/* 升级分类块 */
.upg-block {
  display: grid;
  gap: 0;
}

/* 升级分类标签 - 占第1列，2行高 */
.upg-cat-label {
  grid-row: 1 / 3;
  grid-column: 1;
  font-size: 14px;
  font-weight: bold;
  color: #58a6ff;
  padding: 4px;
  border: 1px solid #58a6ff44;
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
.upgrade-tile.locked { opacity: 0.4; border-color: #484f58; background: #0d1117; cursor: not-allowed; }
.tile-lv { font-size: 14px; color: #58a6ff; font-weight: bold; }
.tile-cost { font-size: 14px; color: #8b949e; }
.tile-eff { font-size: 14px; color: #d29922; line-height: 1.2; text-align: center; }
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
  font-size: 14px;
  color: #c9d1d9;
  white-space: normal;
  z-index: 50;
  width: 200px;
  text-align: left;
  line-height: 1.4;
  pointer-events: none;
}
.tt-effect { color: #d29922; margin-top: 3px; }
.tt-cap { color: #8b949e; margin-top: 2px; font-size: 14px; }
</style>