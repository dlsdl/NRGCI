import { reactive, ref, markRaw } from 'vue'
import Decimal from 'break_eternity.js'

// ============ 常量定义 ============
export const DEC = (v) => markRaw(new Decimal(v))
export const D0 = DEC(0)
export const D1 = DEC(1)
export const D10 = DEC(10)
export const D100 = DEC(100)

// 区域定义
export const AREA_NAMES = ['A1', 'A2', 'A3', 'A4']
export const AREA_FULL_NAMES = ['区域A1', '区域A2', '区域A3', '区域A4']

// 基础资源名称
export const BASE_RESOURCES = [
  { id: 'grass', name: '草', emoji: '🌿' },
  { id: 'prestige', name: '声望点', emoji: '⭐' },
  { id: 'crystal', name: '水晶', emoji: '💎' },
  { id: 'steel', name: '钢', emoji: '🔩' },
  { id: 'perk', name: '级点', emoji: '📌' },
  { id: 'cuprum', name: '铜', emoji: '🟤' },
  { id: 'charge', name: '充能', emoji: '⚡' },
]

export const AREA_RESOURCES = [
  // A1
  [
    { id: 'grass', name: '草', emoji: '🌿' },
    { id: 'prestigePoint', name: '声望点', emoji: '⭐' },
    { id: 'crystal', name: '水晶', emoji: '💎' },
    { id: 'steel', name: '钢', emoji: '🔩' },
    { id: 'perk', name: '级点', emoji: '📌' },
    { id: 'cuprum', name: '铜', emoji: '🟤' },
    { id: 'charge', name: '充能', emoji: '⚡' },
  ],
  // A2
  [
    { id: 'antiGrass', name: '反草', emoji: '🌪️' },
    { id: 'anonymousPoint', name: '匿名点', emoji: '❓' },
    { id: 'oil', name: '石油', emoji: '🛢️' },
    { id: 'fun', name: '乐趣', emoji: '🎉' },
    { id: 'antiPerk', name: '反级点', emoji: '📍' },
    { id: 'argentum', name: '银', emoji: '⚪' },
    { id: 'sfrgt', name: 'SFRGT', emoji: '🌟' },
  ],
  // A3
  [
    { id: 'unnaturalGrass', name: '非自然草', emoji: '🌱' },
    { id: 'normalityPoint', name: '正常点', emoji: '✅' },
    { id: 'cloud', name: '云', emoji: '☁️' },
    { id: 'darkvision', name: '暗视', emoji: '🌑' },
    { id: 'unnaturalPerk', name: '非自然级点', emoji: '📎' },
    { id: 'aurum', name: '金', emoji: '🟡' },
    { id: 'afwcs', name: 'AFWCS', emoji: '😰' },
  ],
  // A4
  [
    { id: 'planetoidGrass', name: '小行星草', emoji: '🪐' },
    { id: 'quadrantPoint', name: '四分点', emoji: '🔷' },
    { id: 'plasma', name: '等离子体', emoji: '💫' },
    { id: 'planet', name: '行星', emoji: '🌍' },
    { id: 'questionPerk', name: '？！级点', emoji: '⁉️' },
    { id: 'roentgenium', name: '𬬭', emoji: '🟣' },
    { id: 'darkCharge', name: '暗充能', emoji: '🌌' },
  ],
]

// 重置名称
export const RESET_NAMES = [
  // A1
  { layer1: '声望', layer2: '结晶', layer3Branch1: '草蹦', layer3Branch2: '钢化' },
  // A2
  { layer1: '匿名', layer2: '液化', layer3Branch1: '草跳', layer3Branch2: '趣化' },
  // A3
  { layer1: '常态', layer2: '气化', layer3Branch1: '草跃', layer3Branch2: '暗化' },
  // A4
  { layer1: '四分', layer2: '电离', layer3Branch1: '草跨', layer3Branch2: '行星化' },
]

// 高级区域
export const ADVANCED_AREAS = [
  { id: 'star', name: '星星', emoji: '⭐', layer: 4, resetsArea: 0 },
  { id: 'darkMatter', name: '暗物质', emoji: '🌑', layer: 5, resetsArea: 1 },
  { id: 'lightMatter', name: '光物质', emoji: '💡', layer: 6, resetsArea: 2 },
  { id: 'supernova', name: '超新星', emoji: '💥', layer: 7, resetsArea: 3 },
]

// ============ 工具函数 ============
export function fmt(d) {
  if (d === null || d === undefined) return '0'
  if (typeof d === 'number') return d < 1e6 ? (Number.isInteger(d) ? d.toLocaleString() : d.toFixed(2)) : d.toExponential(3)
  // 尝试转为 Decimal
  try {
    if (typeof d.eq === 'function') {
      if (d.eq(0)) return '0'
      if (d.lt(1e6)) {
        const n = d.toNumber()
        if (Number.isInteger(n)) return n.toLocaleString()
        return n.toFixed(2)
      }
      return d.toExponential(3)
    }
  } catch (e) {}
  return String(d || '0')
}

export function xpForLevel(lv) {
  if (lv <= 0) return D0
  return DEC(10).mul(lv).mul(DEC(1.3195).pow(lv))
}

export function totalXpForLevel(lv) {
  if (lv <= 0) return D0
  let total = D0
  for (let i = 1; i <= lv; i++) {
    total = total.add(xpForLevel(i))
  }
  return total
}

// 升级价格公式 (参考wiki)
export function upgradeCost(baseCost, costScale, level) {
  if (level <= 1000) {
    return baseCost.mul(Decimal.pow(costScale, level))
  }
  // 超过1001级价格折算
  let cost = baseCost.mul(Decimal.pow(costScale, 1000))
  for (let i = 1001; i <= level; i++) {
    const mult = DEC(1.12).pow(i - 1000)
    cost = cost.mul(mult)
  }
  return cost
}

// ============ 创建初始区域状态 ============
function createUpgrades() {
  const upgrades = {}
  for (let i = 0; i < 7; i++) {
    upgrades[i] = { level: 0, id: i }
  }
  return upgrades
}

function createAreaState(areaIndex) {
  const resDefs = AREA_RESOURCES[areaIndex]
  const resources = {}
  resDefs.forEach(r => { resources[r.id] = DEC(0) })

  // 基础资源初始为0，草地每秒产生草
  const grassKey = resDefs[0].id // 基础资源总是第一个

  return {
    unlocked: areaIndex === 0, // A1一开始解锁
    resources,
    upgrades: createUpgrades(),
    autoUpgrades: {
      autoCut: { level: 0, bought: false },       // 自动割草
      autoBuyUpgrades: { level: 0, bought: false }, // 自动购买升级
      freeUpgrades: { level: 0, bought: false },    // 购买升级不消耗资源
      autoResetGain: { level: 0, bought: false },   // 每秒自动获得10%重置资源
    },
    level: 0,
    xp: DEC(0),
    grassField: {
      grass: 0,            // 当前草地里的草数量
      maxGrass: 10,         // 草地最大草数量
      grassPerSec: DEC(1),      // 每秒产生草数量
    },
    resetCounts: {
      layer1: 0,  // prestige / anonymity / normality / quadrantity
      layer2: 0,  // crystalize / liquify / vapourize / ionify
      layer3Branch1: 0, // grass hop / grass skip / grass jump / grass leap
      layer3Branch2: 0, // steelie / funify / darkify / planetify
    },
    milestones: {
      layer3Branch1: 0, // 里程碑次数
    },
    unlockedFeatures: {
      upgrades: false,    // 升级物品 (Lv30)
      rares: false,       // 稀有物品 (Lv100)
      generators: false,  // 生成物品 (steelie已解锁后)
      layer3Branch2: false, // 分支二解锁
    },
    rareChances: {
      cuprumTotal: DEC(0),
      argentumTotal: DEC(0),
      aurumTotal: DEC(0),
      roentgeniumTotal: DEC(0),
    },
    // 自动化计时器
    autoTimers: {
      cut: 0,
      buy: 0,
      resetGain: 0,
    },
    // 标记是否已经完成过层3分支2
    hasDoneLayer3Branch2: false,
  }
}

function createAdvancedAreaState(areaIndex) {
  const advDef = ADVANCED_AREAS[areaIndex]
  return {
    unlocked: false,
    resource: DEC(0),
    upgrades: createUpgrades(),
    level: 0,
    xp: DEC(0),
    resetCounts: 0,
    advResetCount: 0,
    resourceId: advDef.id,
  }
}

// ============ 游戏状态 ============
export const gameState = reactive({
  tickSpeed: 50,
  gameSpeed: DEC(1),
  totalTicks: 0,
  lastTickTime: Date.now(),
  running: true,

  areas: [
    createAreaState(0),
    createAreaState(1),
    createAreaState(2),
    createAreaState(3),
  ],
  advancedAreas: [
    createAdvancedAreaState(0),
    createAdvancedAreaState(1),
    createAdvancedAreaState(2),
    createAdvancedAreaState(3),
  ],

  compressionMult: DEC(1),

  totalGrassCut: DEC(0),
  totalXpEarned: DEC(0),

  notifications: [],

  lastSaveTime: 0,
})

// ============ 游戏逻辑函数 ============

// 获取区域基础资源键名
function getGrassKey(areaIndex) {
  return AREA_RESOURCES[areaIndex][0].id
}
function getLayer1Key(areaIndex) {
  return AREA_RESOURCES[areaIndex][1].id
}
function getLayer2Key(areaIndex) {
  return AREA_RESOURCES[areaIndex][2].id
}
function getLayer3Key(areaIndex) {
  return AREA_RESOURCES[areaIndex][3].id
}
function getPerkKey(areaIndex) {
  return AREA_RESOURCES[areaIndex][4].id
}
function getRareKey(areaIndex) {
  return AREA_RESOURCES[areaIndex][5].id
}
function getChargeKey(areaIndex) {
  return AREA_RESOURCES[areaIndex][6].id
}

export function getGrassKeyFn(areaIndex) { return getGrassKey(areaIndex) }
export function getLayer1KeyFn(areaIndex) { return getLayer1Key(areaIndex) }
export function getLayer2KeyFn(areaIndex) { return getLayer2Key(areaIndex) }
export function getLayer3KeyFn(areaIndex) { return getLayer3Key(areaIndex) }
export function getPerkKeyFn(areaIndex) { return getPerkKey(areaIndex) }
export function getRareKeyFn(areaIndex) { return getRareKey(areaIndex) }
export function getChargeKeyFn(areaIndex) { return getChargeKey(areaIndex) }

// 升级价格
export function getUpgradeCost(areaIndex, upgradeIndex) {
  const area = gameState.areas[areaIndex]
  const lv = area.upgrades[upgradeIndex].level

  // 不同升级有不同的基础价格
  const baseCosts = [
    DEC(10),     // 基础资源升级
    DEC(1000),   // 层1资源升级
    DEC(1e5),    // 层2资源升级
    DEC(1e8),    // 层3资源升级
    DEC(100),    // 级点升级
    DEC(1000),   // 稀有物品升级
    DEC(500),    // 生成物品升级
  ]
  const scales = [1.15, 1.2, 1.25, 1.3, 1.18, 1.22, 1.28]

  return upgradeCost(baseCosts[upgradeIndex], scales[upgradeIndex], lv)
}

// 执行割草
export function cutGrass(areaIndex) {
  const area = gameState.areas[areaIndex]
  if (!area.unlocked) return
  if (area.grassField.grass <= 0) return

  area.grassField.grass--
  const grassKey = getGrassKey(areaIndex)

  // 基础草量（受升级影响）
  let gain = D1
  const upgradeLevel = area.upgrades[0].level
  if (upgradeLevel > 0) {
    gain = gain.add(DEC(upgradeLevel).mul(0.5))
  }

  // A1等级加成草的获取
  if (areaIndex === 0 && gameState.areas[0].level > 0) {
    gain = gain.mul(DEC(1).add(DEC(gameState.areas[0].level).mul(0.1)))
  }

  // 压缩倍率 (A3等级影响)
  if (gameState.areas[2].level > 0) {
    gain = gain.mul(DEC(1).add(DEC(gameState.areas[2].level).mul(0.05)))
  }

  gain = gain.mul(gameState.gameSpeed)
  area.resources[grassKey] = area.resources[grassKey].add(gain)
  gameState.totalGrassCut = gameState.totalGrassCut.add(gain)

  // 经验获取
  let xpGain = D1
  if (gameState.areas[2].level > 0) {
    xpGain = xpGain.mul(DEC(1).add(DEC(gameState.areas[2].level).mul(0.05)))
  }
  xpGain = xpGain.mul(gameState.gameSpeed)
  area.xp = area.xp.add(xpGain)
  gameState.totalXpEarned = gameState.totalXpEarned.add(xpGain)

  // 检查升级
  checkLevelUp(areaIndex)

  // 稀有物品链 (仅在解锁后)
  if (area.unlockedFeatures.rares) {
    rollRareItems(areaIndex)
  }
}

// 稀有物品链: 草→铜→银→金→𬬭 (1%级联)
function rollRareItems(areaIndex) {
  const area = gameState.areas[areaIndex]
  const rareKey = getRareKey(areaIndex)

  // 铜: 1% 概率
  if (areaIndex === 0) {
    const rareName = AREA_RESOURCES[areaIndex][5].id // cuprum
    if (Math.random() < 0.01) {
      const gain = D1.mul(gameState.gameSpeed)
      area.resources[rareName] = area.resources[rareName].add(gain)
      area.rareChances.cuprumTotal = area.rareChances.cuprumTotal.add(gain)
    }
  }
  // 检查级联 (通过所有已解锁区域)
  for (let i = 0; i < 4; i++) {
    if (!gameState.areas[i].unlockedFeatures.rares) continue
    const rareNames = [
      'cuprum',     // A1 稀有
      'argentum',   // A2 稀有
      'aurum',      // A3 稀有
      'roentgenium', // A4 稀有
    ]
    // 级联: 每产生1个稀有物品，有1%概率产生下一级的稀有物品
    if (i < 3 && gameState.areas[i].unlockedFeatures.rares) {
      // 这里简化处理：每次割草时roll
      if (i === 0 && Math.random() < 0.0001) { // 0.01% 草→银
        gameState.areas[3].resources.roentgenium = gameState.areas[3].resources.roentgenium.add(D1)
      }
    }
  }
}

// 检查并升级
function checkLevelUp(areaIndex) {
  const area = gameState.areas[areaIndex]
  while (true) {
    const nextLevel = area.level + 1
    const needed = totalXpForLevel(nextLevel)
    if (area.xp.gte(needed)) {
      area.level = nextLevel
      // 每升1级获得1个级点 (升级物品)
      const perkKey = getPerkKey(areaIndex)
      let perkGain = D1
      // 级点升级加成
      const perkUpg = area.upgrades[4]
      if (perkUpg.level > 0) {
        perkGain = perkGain.add(DEC(perkUpg.level).mul(0.2))
      }
      area.resources[perkKey] = area.resources[perkKey].add(perkGain)

      // 检查解锁
      checkUnlocks(areaIndex)
    } else {
      break
    }
  }
}

// 检查解锁条件
function checkUnlocks(areaIndex) {
  const area = gameState.areas[areaIndex]
  if (area.level >= 30 && !area.unlockedFeatures.upgrades) {
    area.unlockedFeatures.upgrades = true
    addNotification(`${AREA_FULL_NAMES[areaIndex]}: 升级物品已解锁！`)
  }
  if (area.level >= 100 && !area.unlockedFeatures.rares) {
    area.unlockedFeatures.rares = true
    addNotification(`${AREA_FULL_NAMES[areaIndex]}: 稀有物品已解锁！`)
  }
  // 生成物品在层3分支2解锁后启用

  // 层3分支2解锁条件: 里程碑8次 + 270级
  if (area.milestones.layer3Branch1 >= 8 && area.level >= 270 && !area.unlockedFeatures.layer3Branch2) {
    area.unlockedFeatures.layer3Branch2 = true
    addNotification(`${AREA_FULL_NAMES[areaIndex]}: ${RESET_NAMES[areaIndex].layer3Branch2}已解锁！`)
  }

  // 解锁下级区域 (通过层3资源升级)
  // 这由升级系统处理
}

// ============ 重置系统 ============

// 层1重置 (Prestige / Anonymity / Normality / Quadrantity)
export function doLayer1Reset(areaIndex) {
  const area = gameState.areas[areaIndex]
  const grassKey = getGrassKey(areaIndex)
  const layer1Key = getLayer1Key(areaIndex)

  // 计算获得的重置资源
  let gain = area.resources[grassKey].div(100).max(D1).floor()
  // 层1升级加成
  if (area.upgrades[1].level > 0) {
    gain = gain.mul(DEC(1).add(DEC(area.upgrades[1].level).mul(0.1)))
  }

  area.resources[layer1Key] = area.resources[layer1Key].add(gain)
  area.resetCounts.layer1++

  // 重置基础资源和升级
  area.resources[grassKey] = D0
  area.upgrades[0].level = 0
  area.xp = D0
  area.level = 0

  // 重新检查解锁
  area.unlockedFeatures.upgrades = false
  area.unlockedFeatures.rares = false
  area.unlockedFeatures.generators = false
  area.unlockedFeatures.layer3Branch2 = false
  area.milestones.layer3Branch1 = 0
  area.hasDoneLayer3Branch2 = false

  addNotification(`${AREA_FULL_NAMES[areaIndex]}: ${RESET_NAMES[areaIndex].layer1}完成！获得 ${fmt(gain)} ${AREA_RESOURCES[areaIndex][1].name}`)

  // 达到30级后重新解锁升级物品
  if (area.level >= 30) area.unlockedFeatures.upgrades = true
  if (area.level >= 100) area.unlockedFeatures.rares = true
}

// 层2重置 (Crystalize / Liquify / Vapourize / Ionify)
export function doLayer2Reset(areaIndex) {
  const area = gameState.areas[areaIndex]
  const grassKey = getGrassKey(areaIndex)
  const layer1Key = getLayer1Key(areaIndex)
  const layer2Key = getLayer2Key(areaIndex)

  let gain = area.resources[layer1Key].div(50).max(D1).floor()
  if (area.upgrades[2].level > 0) {
    gain = gain.mul(DEC(1).add(DEC(area.upgrades[2].level).mul(0.1)))
  }

  area.resources[layer2Key] = area.resources[layer2Key].add(gain)
  area.resetCounts.layer2++

  // 重置基础、层1资源及升级
  area.resources[grassKey] = D0
  area.resources[layer1Key] = D0
  area.upgrades[0].level = 0
  area.upgrades[1].level = 0
  area.xp = D0
  area.level = 0

  addNotification(`${AREA_FULL_NAMES[areaIndex]}: ${RESET_NAMES[areaIndex].layer2}完成！获得 ${fmt(gain)} ${AREA_RESOURCES[areaIndex][2].name}`)
}

// 层3分支1 - 里程碑式重置 (Grass Hop / Grass Skip / Grass Jump / Grass Leap)
export function doLayer3Branch1Reset(areaIndex) {
  const area = gameState.areas[areaIndex]
  const grassKey = getGrassKey(areaIndex)
  const layer1Key = getLayer1Key(areaIndex)
  const layer2Key = getLayer2Key(areaIndex)
  const layer3Key = getLayer3Key(areaIndex)

  // 需要等级: 200 + 10 * 里程碑次数
  const requiredLevel = 200 + 10 * area.milestones.layer3Branch1
  if (area.level < requiredLevel) return

  let gain = area.resources[layer2Key].div(30).max(D1).floor()
  if (area.upgrades[3].level > 0) {
    gain = gain.mul(DEC(1).add(DEC(area.upgrades[3].level).mul(0.1)))
  }

  area.resources[layer3Key] = area.resources[layer3Key].add(gain)
  area.resetCounts.layer3Branch1++
  area.milestones.layer3Branch1++

  // 重置基础、层1、层2资源及升级
  area.resources[grassKey] = D0
  area.resources[layer1Key] = D0
  area.resources[layer2Key] = D0
  area.upgrades[0].level = 0
  area.upgrades[1].level = 0
  area.upgrades[2].level = 0
  area.xp = D0
  area.level = 0

  addNotification(`${AREA_FULL_NAMES[areaIndex]}: ${RESET_NAMES[areaIndex].layer3Branch1} #${area.milestones.layer3Branch1}完成！获得 ${fmt(gain)} ${AREA_RESOURCES[areaIndex][3].name}`)
}

// 层3分支2 - 生成物品解锁 (Steelie / Funify / Darkify / Planetify)
export function doLayer3Branch2Reset(areaIndex) {
  const area = gameState.areas[areaIndex]
  if (!area.unlockedFeatures.layer3Branch2) return

  const grassKey = getGrassKey(areaIndex)
  const layer1Key = getLayer1Key(areaIndex)
  const layer2Key = getLayer2Key(areaIndex)
  const layer3Key = getLayer3Key(areaIndex)
  const chargeKey = getChargeKey(areaIndex)

  // 分支2给更多层3资源 + 生成物品
  let gain = area.resources[layer2Key].div(15).max(D1).floor()
  if (area.upgrades[3].level > 0) {
    gain = gain.mul(DEC(1).add(DEC(area.upgrades[3].level).mul(0.15)))
  }

  area.resources[layer3Key] = area.resources[layer3Key].add(gain)
  area.resetCounts.layer3Branch2++

  // 生成物品 (charge resource)
  let chargeGain = gain.div(5).max(D1)
  area.resources[chargeKey] = area.resources[chargeKey].add(chargeGain)

  // 解锁生成物品
  if (!area.unlockedFeatures.generators) {
    area.unlockedFeatures.generators = true
    addNotification(`${AREA_FULL_NAMES[areaIndex]}: 生成物品已解锁！`)
  }

  // 层3资源升级可以解锁下级区域 A{x+1} 和 Bx
  checkAreaUnlocks(areaIndex)

  // 重置
  area.resources[grassKey] = D0
  area.resources[layer1Key] = D0
  area.resources[layer2Key] = D0
  area.upgrades[0].level = 0
  area.upgrades[1].level = 0
  area.upgrades[2].level = 0
  area.xp = D0
  area.level = 0

  area.hasDoneLayer3Branch2 = true

  addNotification(`${AREA_FULL_NAMES[areaIndex]}: ${RESET_NAMES[areaIndex].layer3Branch2}完成！获得 ${fmt(gain)} ${AREA_RESOURCES[areaIndex][3].name}`)
}

// 检查区域解锁 (通过层3资源升级)
function checkAreaUnlocks(areaIndex) {
  const area = gameState.areas[areaIndex]
  const layer3Key = getLayer3Key(areaIndex)

  // 层3资源升级6 (index 6 = 生成物品升级) 解锁下一区域和高级区域
  if (area.upgrades[6].level >= 1 && areaIndex < 3) {
    // 解锁A{x+1}
    if (!gameState.areas[areaIndex + 1].unlocked) {
      gameState.areas[areaIndex + 1].unlocked = true
      addNotification(`${AREA_FULL_NAMES[areaIndex + 1]} 已解锁！`)
    }
    // 解锁Bx
    if (!gameState.advancedAreas[areaIndex].unlocked) {
      gameState.advancedAreas[areaIndex].unlocked = true
      addNotification(`区域B${areaIndex + 1} (${ADVANCED_AREAS[areaIndex].name}) 已解锁！`)
    }
  }
}

// ============ 高级区域重置 (B1-B4) ============
export function doAdvancedReset(advAreaIndex) {
  const advArea = gameState.advancedAreas[advAreaIndex]
  if (!advArea.unlocked) return

  const targetAreaIndex = ADVANCED_AREAS[advAreaIndex].resetsArea

  // 计算获得的高级资源
  let gain = D1
  // B4重置换所有四个基础区域
  let maxAreaIndex = targetAreaIndex
  if (advAreaIndex === 3) {
    maxAreaIndex = 3
  }

  // 累计所有被重置区域的总资源
  for (let i = 0; i <= maxAreaIndex; i++) {
    const area = gameState.areas[i]
    if (!area.unlocked) continue
    const l3Key = getLayer3Key(i)
    gain = gain.add(area.resources[l3Key].div(100))
    if (advAreaIndex >= 1 && i <= maxAreaIndex - 1) {
      // 也计算前一个区域的里程碑
    }
  }
  gain = gain.max(D1).floor()

  advArea.resource = advArea.resource.add(gain)
  advArea.resetCounts++

  // Bx重置Ax的所有内容
  for (let i = 0; i <= maxAreaIndex; i++) {
    const area = gameState.areas[i]
    if (!area.unlocked) continue
    // 完全重置该区域
    Object.keys(area.resources).forEach(k => { area.resources[k] = D0 })
    area.upgrades = createUpgrades()
    area.level = 0
    area.xp = D0
    area.grassField.grass = 0
    area.grassField.maxGrass = 10
    area.resetCounts = { layer1: 0, layer2: 0, layer3Branch1: 0, layer3Branch2: 0 }
    area.milestones.layer3Branch1 = 0
    area.unlockedFeatures = {
      upgrades: false,
      rares: false,
      generators: false,
      layer3Branch2: false,
    }
    area.hasDoneLayer3Branch2 = false
  }

  // B4特殊: 重置所有四个
  if (advAreaIndex === 3) {
    gameState.areas[3].unlocked = gameState.areas[3].unlocked // 保持解锁状态但内容重置
  }

  addNotification(`B${advAreaIndex + 1}: ${ADVANCED_AREAS[advAreaIndex].name}重置完成！获得 ${fmt(gain)} ${ADVANCED_AREAS[advAreaIndex].name}`)
}

// ============ 升级购买 ============
export function buyUpgrade(areaIndex, upgradeIndex) {
  const area = gameState.areas[areaIndex]
  const cost = getUpgradeCost(areaIndex, upgradeIndex)
  const resourceKey = getResourceKeyForUpgrade(areaIndex, upgradeIndex)

  if (area.resources[resourceKey].gte(cost)) {
    area.resources[resourceKey] = area.resources[resourceKey].sub(cost)
    area.upgrades[upgradeIndex].level++

    // 检查区域解锁
    if (upgradeIndex === 6 && area.upgrades[6].level >= 1) {
      checkAreaUnlocks(areaIndex)
    }
  }
}

function getResourceKeyForUpgrade(areaIndex, upgradeIndex) {
  const resDefs = AREA_RESOURCES[areaIndex]
  return resDefs[Math.min(upgradeIndex, resDefs.length - 1)].id
}

// 自动升级购买
export function buyAutoUpgrade(areaIndex, autoUpgradeId) {
  const area = gameState.areas[areaIndex]
  const autoUp = area.autoUpgrades[autoUpgradeId]
  if (!autoUp) return

  const costs = {
    autoCut: DEC(100),
    autoBuyUpgrades: DEC(500),
    freeUpgrades: DEC(5000),
    autoResetGain: DEC(10000),
  }
  const costScales = {
    autoCut: 1.5,
    autoBuyUpgrades: 1.6,
    freeUpgrades: 1.8,
    autoResetGain: 2.0,
  }

  const cost = DEC(costs[autoUpgradeId]).mul(DEC(costScales[autoUpgradeId]).pow(autoUp.level))
  const layer3Key = getLayer3Key(areaIndex)

  if (area.resources[layer3Key].gte(cost)) {
    area.resources[layer3Key] = area.resources[layer3Key].sub(cost)
    autoUp.level++
    autoUp.bought = true
  }
}

// ============ 游戏循环 ============

// 获取草地最大容量 (受升级影响)
function getMaxGrass(areaIndex) {
  const area = gameState.areas[areaIndex]
  let max = 10
  // 基础资源升级增加容量
  if (area.upgrades[0].level > 0) {
    max += area.upgrades[0].level * 2
  }
  return Math.floor(max)
}

// A4等级增加游戏速度
function updateGameSpeed() {
  if (gameState.areas[3].level > 0) {
    gameState.gameSpeed = D1.add(DEC(gameState.areas[3].level).mul(0.02))
  } else {
    gameState.gameSpeed = D1
  }
}

export function gameTick() {
  let speed = 1
  try {
    speed = gameState.gameSpeed.toNumber()
    if (isNaN(speed)) speed = 1
  } catch (e) { speed = 1 }
  const tickMult = speed

  for (let ai = 0; ai < 4; ai++) {
    const area = gameState.areas[ai]
    if (!area.unlocked) continue

    // 草地产生草
    area.grassField.maxGrass = getMaxGrass(ai)
    let grassPerSec = area.grassField.grassPerSec
    if (!(grassPerSec instanceof Decimal)) grassPerSec = D1
    const grassPerTick = grassPerSec.mul(tickMult).div(1000 / gameState.tickSpeed)
    area.grassField.grass = Math.min(
      area.grassField.maxGrass,
      area.grassField.grass + grassPerTick.toNumber()
    )

    // 生成物品: 充能生成 (如果已解锁)
    if (area.unlockedFeatures.generators) {
      const chargeKey = getChargeKey(ai)
      const chargeUpgLevel = area.upgrades[6].level || 0
      const chargeGain = DEC(chargeUpgLevel).mul(0.1).mul(tickMult).div(1000 / gameState.tickSpeed)
      if (chargeGain.gt(0)) {
        let charge = area.resources[chargeKey]
        if (!(charge instanceof Decimal)) charge = D0
        area.resources[chargeKey] = charge.add(chargeGain)
      }
    }

    // 自动化
    // 自动割草
    if (area.autoUpgrades.autoCut.level > 0) {
      area.autoTimers.cut += tickMult
      const cutInterval = 1000 / (area.autoUpgrades.autoCut.level * 2) // ms
      while (area.autoTimers.cut >= cutInterval && area.grassField.grass > 0) {
        area.autoTimers.cut -= cutInterval
        cutGrass(ai)
      }
    }

    // 自动购买升级
    if (area.autoUpgrades.autoBuyUpgrades.level > 0) {
      area.autoTimers.buy += tickMult
      const buyInterval = 2000 / area.autoUpgrades.autoBuyUpgrades.level
      while (area.autoTimers.buy >= buyInterval) {
        area.autoTimers.buy -= buyInterval
        // 自动购买最便宜的升级
        autoBuyCheapestUpgrade(ai)
      }
    }

    // 每秒自动获得10%重置资源
    if (area.autoUpgrades.autoResetGain.level > 0) {
      area.autoTimers.resetGain += tickMult
      const gainInterval = 1000 / area.autoUpgrades.autoResetGain.level
      while (area.autoTimers.resetGain >= gainInterval) {
        area.autoTimers.resetGain -= gainInterval
        // 获得10%各层重置资源
        const l1Key = getLayer1Key(ai)
        const l2Key = getLayer2Key(ai)
        const l3Key = getLayer3Key(ai)
        area.resources[l1Key] = area.resources[l1Key].add(area.resources[l1Key].mul(0.1))
        area.resources[l2Key] = area.resources[l2Key].add(area.resources[l2Key].mul(0.1))
        area.resources[l3Key] = area.resources[l3Key].add(area.resources[l3Key].mul(0.1))
      }
    }
  }

  updateGameSpeed()
  gameState.totalTicks++
}

function autoBuyCheapestUpgrade(areaIndex) {
  const area = gameState.areas[areaIndex]
  let minCost = null
  let minIdx = -1

  for (let i = 0; i < 7; i++) {
    const cost = getUpgradeCost(areaIndex, i)
    const resKey = getResourceKeyForUpgrade(areaIndex, i)
    if (area.resources[resKey].gte(cost)) {
      if (minCost === null || cost.lt(minCost)) {
        minCost = cost
        minIdx = i
      }
    }
  }

  if (minIdx >= 0) {
    buyUpgrade(areaIndex, minIdx)
  }
}

// ============ 通知 ============
export function addNotification(msg) {
  gameState.notifications.unshift({
    id: Date.now(),
    msg,
    time: Date.now(),
  })
  if (gameState.notifications.length > 50) {
    gameState.notifications.pop()
  }
}

// ============ 手动升级等级 ============
export function addXP(areaIndex, amount) {
  gameState.areas[areaIndex].xp = gameState.areas[areaIndex].xp.add(amount)
  checkLevelUp(areaIndex)
}

// ============ 重置级别需求的层3分支1 ============
export function getLayer3Branch1RequiredLevel(areaIndex) {
  return 200 + 10 * gameState.areas[areaIndex].milestones.layer3Branch1
}

// ============ 是否满足层3分支1条件 ============
export function canLayer3Branch1(areaIndex) {
  const area = gameState.areas[areaIndex]
  return area.level >= getLayer3Branch1RequiredLevel(areaIndex)
}

// ============ 是否满足层3分支2条件 ============
export function canLayer3Branch2(areaIndex) {
  const area = gameState.areas[areaIndex]
  return area.unlockedFeatures.layer3Branch2 && area.level >= 0
}

// ============ 完整重置一个区域 (用于硬重置/高级重置) ============
export function fullResetArea(areaIndex) {
  const area = gameState.areas[areaIndex]
  const resDefs = AREA_RESOURCES[areaIndex]
  resDefs.forEach(r => { area.resources[r.id] = D0 })
  area.upgrades = createUpgrades()
  area.level = 0
  area.xp = D0
  area.grassField.grass = 0
  area.grassField.maxGrass = 10
  area.grassField.grassPerSec = D1
  area.resetCounts = { layer1: 0, layer2: 0, layer3Branch1: 0, layer3Branch2: 0 }
  area.milestones.layer3Branch1 = 0
  area.unlockedFeatures = {
    upgrades: false,
    rares: false,
    generators: false,
    layer3Branch2: false,
  }
  area.autoUpgrades = {
    autoCut: { level: 0, bought: false },
    autoBuyUpgrades: { level: 0, bought: false },
    freeUpgrades: { level: 0, bought: false },
    autoResetGain: { level: 0, bought: false },
  }
  area.hasDoneLayer3Branch2 = false
}

// ============ 硬重置 ============
export function hardReset() {
  for (let i = 0; i < 4; i++) {
    fullResetArea(i)
    gameState.advancedAreas[i] = createAdvancedAreaState(i)
  }
  gameState.areas[0].unlocked = true // A1总是解锁
  gameState.totalGrassCut = D0
  gameState.totalXpEarned = D0
  gameState.gameSpeed = D1
  gameState.totalTicks = 0
  gameState.notifications = []
  addNotification('游戏已硬重置！')
}

// ============ 导出状态用于保存 ============
const DECIMAL_MARKER = '__DECIMAL__'

export function getSaveState() {
  return JSON.parse(JSON.stringify(gameState, (key, value) => {
    if (value instanceof Decimal) {
      return { [DECIMAL_MARKER]: value.toString() }
    }
    return value
  }))
}

// ============ 加载状态 ============
export function loadSaveState(state) {
  function restoreDecimals(obj) {
    if (obj === null || obj === undefined) return obj
    if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
      if (DECIMAL_MARKER in obj) {
        return new Decimal(obj[DECIMAL_MARKER])
      }
      const result = {}
      for (const key of Object.keys(obj)) {
        result[key] = restoreDecimals(obj[key])
      }
      return result
    }
    if (Array.isArray(obj)) {
      return obj.map(restoreDecimals)
    }
    return obj
  }

  try {
    const restored = restoreDecimals(state)
    gameState.tickSpeed = restored.tickSpeed || 50
    gameState.gameSpeed = restored.gameSpeed instanceof Decimal ? restored.gameSpeed : D1
    gameState.totalTicks = restored.totalTicks || 0
    gameState.running = true
    gameState.totalGrassCut = restored.totalGrassCut instanceof Decimal ? restored.totalGrassCut : D0
    gameState.totalXpEarned = restored.totalXpEarned instanceof Decimal ? restored.totalXpEarned : D0
    gameState.lastSaveTime = restored.lastSaveTime || 0
    gameState.notifications = restored.notifications || []
    gameState.compressionMult = restored.compressionMult instanceof Decimal ? restored.compressionMult : D1

    if (restored.areas && Array.isArray(restored.areas)) {
      gameState.areas.splice(0, gameState.areas.length, ...restored.areas)
    }
    if (restored.advancedAreas && Array.isArray(restored.advancedAreas)) {
      gameState.advancedAreas.splice(0, gameState.advancedAreas.length, ...restored.advancedAreas)
    }

    addNotification('存档已加载！')
    return true
  } catch (e) {
    console.error('加载存档失败:', e)
    return false
  }
}