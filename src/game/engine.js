import { ref } from 'vue'
import Decimal from 'break_eternity.js'

// ============ 全局 tick 驱动 UI 更新 ============
export const tick = ref(0)

// ============ 工具 ============
export const D = (v) => new Decimal(v)
export const D0 = new Decimal(0)
export const D1 = new Decimal(1)
export const DEC = D

export function fmt(d) {
  if (d === null || d === undefined) return '0'
  if (typeof d === 'number') return d < 1e6 ? (Number.isInteger(d) ? d.toLocaleString() : d.toFixed(2)) : d.toExponential(3)
  try {
    if (d.eq(0)) return '0'
    if (d.lt(1e6)) { const n = d.toNumber(); return Number.isInteger(n) ? n.toLocaleString() : n.toFixed(2) }
    return d.toExponential(3)
  } catch (e) {}
  return String(d || '0')
}

// 确保 Decimal 实例
export function ensureDec(v) {
  if (v instanceof Decimal) return v
  if (v === null || v === undefined) return D0
  if (typeof v === 'object' && v !== null && typeof v[DEC_MARKER] === 'string') return D(v[DEC_MARKER])
  try { return D(v) } catch(e) { return D0 }
}

// ============ 常量 ============
export const AREA_FULL_NAMES = ['区域A1', '区域A2', '区域A3', '区域A4']
export const RESET_NAMES = [
  { layer1: '声望', layer2: '结晶', layer3B1: '草蹦', layer3B2: '钢化',
    l1Desc: '重置草及草升级\n获得声望点',
    l2Desc: '重置声望及以下\n获得水晶',
    l3Desc: '重置结晶及以下\n获得草蹦次数',
    l3B2Desc: '重置草蹦重置的东西\n获得钢' },
  { layer1: '匿名', layer2: '液化', layer3B1: '草跳', layer3B2: '趣化',
    l1Desc: '重置反草及升级\n获得匿名点',
    l2Desc: '重置匿名及以下\n获得石油',
    l3Desc: '重置液化及以下\n获得草跳次数',
    l3B2Desc: '重置草跳重置的东西\n获得乐趣/SFRGT' },
  { layer1: '常态', layer2: '气化', layer3B1: '草跃', layer3B2: '暗化',
    l1Desc: '重置非自然草\n获得正常点',
    l2Desc: '重置常态及以下\n获得云',
    l3Desc: '重置气化及以下\n获得草跃次数',
    l3B2Desc: '重置草跳跃锁的东西\n获得暗视/AFWCS' },
  { layer1: '四分', layer2: '电离', layer3B1: '草跨', layer3B2: '行星化',
    l1Desc: '重置小行星草\n获得四分点',
    l2Desc: '重置四分及以下\n获得等离子体',
    l3Desc: '重置电离及以下\n获得草跨次数',
    l3B2Desc: '重置草跨重置的东西\n获得行星/暗充能' },
]
export const ADVANCED_AREAS = [
  { id: 'star', name: '星星', emoji: '✨' },
  { id: 'darkMatter', name: '暗物质', emoji: '🌑' },
  { id: 'lightMatter', name: '光物质', emoji: '💡' },
  { id: 'supernova', name: '超新星', emoji: '💥' },
]

export const AREA_RESOURCES_LIST = [
  [
    { id: 'grass', name: '草', emoji: '🌿' },
    { id: 'prestige', name: '声望点', emoji: '⭐' },
    { id: 'crystal', name: '水晶', emoji: '💎' },
    { id: 'steel', name: '钢', emoji: '🔩' },
    { id: 'perk', name: '级点', emoji: '📌' },
    { id: 'cuprum', name: '铜', emoji: '🟠' },
    { id: 'charge', name: '充能', emoji: '⚡' },
  ],
  [
    { id: 'antiGrass', name: '反草', emoji: '🌪️' },
    { id: 'anonymousPoint', name: '匿名点', emoji: '📛' },
    { id: 'oil', name: '石油', emoji: '🛢️' },
    { id: 'fun', name: '乐趣', emoji: '😄' },
    { id: 'antiPerk', name: '反级点', emoji: '📍' },
    { id: 'argentum', name: '银', emoji: '⚪' },
    { id: 'sfrgt', name: 'SFRGT', emoji: '🌼' },
  ],
  [
    { id: 'unnaturalGrass', name: '非自然草', emoji: '🌱' },
    { id: 'normalityPoint', name: '正常点', emoji: '✅' },
    { id: 'cloud', name: '云', emoji: '☁️' },
    { id: 'darkvision', name: '暗视', emoji: '👁️' },
    { id: 'unnaturalPerk', name: '非自然级点', emoji: '📎' },
    { id: 'aurum', name: '金', emoji: '🟡' },
    { id: 'afwcs', name: 'AFWCS', emoji: '😰' },
  ],
  [
    { id: 'planetoidGrass', name: '小行星草', emoji: '🪐' },
    { id: 'quadrantPoint', name: '四分点', emoji: '🔷' },
    { id: 'plasma', name: '等离子体', emoji: '🔥' },
    { id: 'planet', name: '行星', emoji: '🌍' },
    { id: 'questionPerk', name: '？！级点', emoji: '⁉️' },
    { id: 'roentgenium', name: '𬬭', emoji: '⚫️' },
    { id: 'darkCharge', name: '暗充能', emoji: '🌌' },
  ],
]

// ============ 资源键 ============
function rk(ai, ri) { return AREA_RESOURCES_LIST[ai][ri].id }
export function grassKey(ai) { return rk(ai, 0) }
export function prestKey(ai) { return rk(ai, 1) }
export function crystKey(ai) { return rk(ai, 2) }
export function steeKey(ai) { return rk(ai, 3) }
export function perkKey(ai) { return rk(ai, 4) }
export function cuprKey(ai) { return rk(ai, 5) }
export function charKey(ai) { return rk(ai, 6) }

// ============ CSV 升级解析 ============
const UPGRADES_CSV = `111,"grass",10,1.333,"Infinity","每级使草的获得数量+100%,每10级使草的获得数量×2"
112,"grass",25,1.333,"990","每级使A1区域草的数量上限增加1"
113,"grass",100,1.333,"990","每级使A1区域草的生长速度增加10%"
114,"grass",1e3,1.333,"Infinity","每级使经验的获得数量+100%,每10级使经验的获得数量×2"
115,"grass",1e5,2.333,"9","点击一次多割1个草"
116,"grass",1e10,2.333,"Infinity","每级使声望点的获得数量+25%,每10级使声望点的获得数量×1.25"
121,"prestige",1,1.333,"Infinity","每级使草的获得数量+50%,每10级使草的获得数量×1.5"
122,"prestige",3,1.333,"Infinity","每级使经验的获得数量+50%,每10级使经验的获得数量×1.5"
123,"prestige",15,1.333,"Infinity","每级使二重经验获得数量+100%,每10级使二重经验的获得数量×2"
124,"prestige",105,1.5,"Infinity","每级使水晶的获得数量+25%,每10级使水晶的获得数量×1.25"
131,"crystal",1,1.333,"Infinity","每级使草的获得数量+50%,每10级使草的获得数量×1.5"
132,"crystal",2,1.333,"Infinity","每级使经验的获得数量+50%,每10级使经验的获得数量×1.5"
133,"crystal",6,1.333,"Infinity","每级使二重经验获得数量+100%,每10级使二重经验的获得数量×2"
134,"crystal",24,1.5,"Infinity","每级使声望点的获得数量+25%,每10级使声望点的获得数量×1.25"
141,"steel",1,1.15,"90","解锁钢增益升级，每级使钢增益升级效果+10%"
142,"steel",1e3,1.15,"90","解锁自动增益升级，每级使自动增益升级效果+10%"
143,"steel",1e6,1.15,"90","解锁生成物品（充能），每级使充能获得数量+10%"
144,"steel",1e9,1.15,"90","解锁更多自动化升级，每级使充能获得数量+10%"
145,"steel",1e12,1.15,"90","解锁A2区域，每级使充能获得数量+10%"
146,"steel",1e15,1.15,"90","解锁火箭燃料（fuel，需要充能charge和石油oil合成），每级使充能获得数量+10%"
147,"steel",1e18,1.15,"90","解锁火箭部件（part，需要火箭燃料fuel和钢steel合成），每级使充能获得数量+10%"
147,"steel",1e21,1.15,"90","解锁B1区域，每级使充能获得数量+10%"
151,"perk",1,1,"99","草的获得数量+100%"
152,"perk",1,1,"9","一次点击割草数量的倍数+1"
153,"perk",2,1,"90","经验的获得数量+10%"
154,"perk",5,1,"90","二重经验的获得数量+10%"
155,"perk",10,1,"90","声望点的获得数量+10%"
156,"perk",20,1,"90","水晶的获得数量+10%"
157,"perk",50,1,"90","钢的获得数量+10%"
158,"perk",100,1,"90","充能的获得数量+10%"
161,"cuprum",10,1,"45","草的获得数量+20%"
162,"cuprum",10,1,"45","经验的获得数量+20%"
163,"cuprum",50,1,"45","声望点的获得数量+20%"
164,"cuprum",50,1,"45","水晶的获得数量+20%"
165,"cuprum",250,1,"45","钢的获得数量+20%"
166,"cuprum",250,1,"45","充能的获得数量+20%"
171,"charge",1e21,1.2,"99","草的获得数量+100%"
172,"charge",1e22,1.2,"99","声望点的获得数量+100%"
173,"charge",1e23,1.2,"99","水晶的获得数量+100%"
174,"charge",1e34,1.2,"99","钢的获得数量+100%"
181,"grass",1e24,2,"999","钢的获取数量+100%"
182,"prestige",1e12,1.2,"999","钢的获取数量+100%"
183,"crystal",1e9,1.2,"999","钢的获取数量+100%"
184,"steel",1e6,1.2,"999","钢的获取数量+100%"
191,"grass",1e18,2,"99","每秒自动生成的声望点+1%"
192,"prestige",1e9,1.2,"100","充能获取+100%，每10级使充能获取数量×2"
193,"crystal",1e6,1.2,"100","充能获取+100%，每10级使充能获取数量×2"
194,"steel",1e3,1.2,"99","每秒自动生成的水晶+1%"
1A1,"grass",1000,10,"5","每5秒自动割1次草，之后每级使时间间隔-1"
1A2,"grass",1e8,10,"9","自动割草获得的资源数量+100%"
1A3,"grass",1e15,1,"1","自动购买草升级"
1A4,"prestige",1e4,1,"1","每秒自动生成重置时能获得声望点的+1%"
1A5,"prestige",1e8,1,"1","自动购买声望升级"
1A6,"prestige",1e12,1,"1","声望不再重置级点和级点升级"
1A7,"crystal",1e4,1,"1","每秒自动生成重置时能获得水晶的+1%"
1A8,"crystal",1e8,1,"1","自动购买水晶升级"
1A9,"crystal",1e12,1,"1","结晶不再重置级点和级点升级"
1AA,"steel",1e9,1,"1","购买草升级不再消耗草"
1AB,"steel",1e10,1,"1","购买水晶升级不再消耗水晶"
1AC,"steel",1e11,1,"1","购买声望升级不再消耗声望"`

function parseCSV(csv) {
  const lines = csv.trim().split('\n')
  const upgrades = {}
  for (const line of lines) {
    const parts = line.match(/(?:^|,)("(?:[^"]*)"|[^,]*)/g)
    if (!parts || parts.length < 6) continue
    const clean = parts.map(p => p.replace(/^,/, '').replace(/^"|"$/g, ''))
    const cap = clean[4] === 'Infinity' ? Infinity : parseInt(clean[4])
    upgrades[clean[0]] = {
      id: clean[0],
      buyResource: clean[1],
      baseCost: parseFloat(clean[2]),
      costScaling: parseFloat(clean[3]),
      cap,
      description: clean[5],
      level: 0,
    }
  }
  return upgrades
}

// 升级分类
export function getUpgradeCategory(id) {
  const p = id.substring(0, 2)
  if (p === '11') return { cat: 'grass', name: '草升级', emoji: '🌿', idx: 0 }
  if (p === '12') return { cat: 'prestige', name: '声望升级', emoji: '⭐', idx: 1 }
  if (p === '13') return { cat: 'crystal', name: '水晶升级', emoji: '💎', idx: 2 }
  if (p === '14') return { cat: 'steel', name: '钢升级', emoji: '🔩', idx: 3 }
  if (p === '15') return { cat: 'perk', name: '级点升级', emoji: '📌', idx: 4 }
  if (p === '16') return { cat: 'cuprum', name: '铜升级', emoji: '🟠', idx: 5 }
  if (p === '17') return { cat: 'charge', name: '充能升级', emoji: '⚡', idx: 6 }
  if (p === '18') return { cat: 'steelGain', name: '钢增益', emoji: '🔩', idx: 7 }
  if (p === '19') return { cat: 'autoGain', name: '自动增益', emoji: '⚙️', idx: 8 }
  if (p === '1A') return { cat: 'automation', name: '自动化', emoji: '🤖', idx: 9 }
  return { cat: 'unknown', name: '', emoji: '', idx: -1 }
}

// 升级解锁条件
export function isUpgradeUnlocked(ai, id) {
  const area = gameState.areas[ai]
  const prefix = id.substring(0, 2)
  if (prefix === '11') return true
  if (prefix === '12') return area.resetCounts.layer1 > 0
  if (prefix === '13') return area.resetCounts.layer2 > 0
  if (prefix === '14') return area.resetCounts.layer3B2 > 0
  if (prefix === '15') return area.resetCounts.layer1 > 0
  if (prefix === '16') return area.resetCounts.layer2 > 0
  if (prefix === '17') return getUpgradeLevel(ai, '143') >= 1
  if (prefix === '18') return getUpgradeLevel(ai, '141') >= 1
  if (prefix === '19') return getUpgradeLevel(ai, '142') >= 1
  if (prefix === '1A') {
    if (id === '1AA' || id === '1AB' || id === '1AC') return getUpgradeLevel(ai, '144') >= 1
    return true
  }
  return false
}

// 计算升级价格
export function calcUpgradeCost(def) {
  const lv = def.level
  let cost = D(def.baseCost).mul(D(def.costScaling).pow(lv))
  if (lv > 1000) {
    // 使用指数平方增长公式: costScaling^1000 * costScaling^((lv-1000)^2)
    const overflow = lv - 1000
    cost = D(def.baseCost).mul(D(def.costScaling).pow(1000)).mul(D(def.costScaling).pow(overflow * overflow))
  }
  return cost
}

// ============ 里程碑解析 ============
const MILESTONE_CSV = `grass_hop,1,"草的获取数量×4×(1+0.25×草蹦次数)"
grass_hop,2,"经验的获取数量×(1+0.25×草蹦次数)"
grass_hop,3,"二重经验的获取数量×(1+0.25×草蹦次数)"
grass_hop,4,"铜的基础获取数量+1"
grass_hop,5,"铜的基础获取数量再次+1"
grass_hop,6,"层点的基础获取数量+1"
grass_hop,7,"铜的基础获取数量第三次+1"
grass_hop,8,"永久解锁钢化重置"
grass_hop,10,"钢的获取数量×(1+0.25×草蹦次数)"
grass_hop,12,"这次及以后的每次草蹦使充能获取数量翻倍(上限为×1e6倍)"
grass_hop,14,"使所有充能加成公式变得更好×(充能×1000+1)^0.1"
grass_hop,16,"反草的获取数量×(1+0.5×草蹦次数)"
charge,1,"充能加成钢的获取数量×(充能+1)^0.1"
charge,1e3,"充能加成经验的获取数量×(充能+1)^0.1"
charge,1e6,"充能加成二重经验的获取数量×(充能+1)^0.1"
charge,1e9,"充能加成草的获取数量×(充能+1)^0.1"
charge,1e12,"充能加成声望点的获取数量×(充能+1)^0.1"
charge,1e15,"充能加成水晶的获取数量×(充能+1)^0.1"`

function parseMilestones() {
  const lines = MILESTONE_CSV.trim().split('\n')
  const grassHop = [], charge = []
  for (const line of lines) {
    const parts = line.match(/(?:^|,)("(?:[^"]*)"|[^,]*)/g)
    if (!parts || parts.length < 3) continue
    const clean = parts.map(p => p.replace(/^,/, '').replace(/^"|"$/g, ''))
    if (clean[0] === 'grass_hop') grassHop.push({ times: parseInt(clean[1]), desc: clean[2] })
    else if (clean[0] === 'charge') charge.push({ charge: parseFloat(clean[1]), desc: clean[2] })
  }
  return { grassHop: grassHop.sort((a, b) => a.times - b.times), charge: charge.sort((a, b) => a.charge - b.charge) }
}

export const milestoneDefs = parseMilestones()

export function getGrassHopMilestones(count) {
  return milestoneDefs.grassHop.filter(m => m.times <= count)
}

export function getChargeMilestones(chargeAmount) {
  return milestoneDefs.charge.filter(m => {
    try { return chargeAmount instanceof Decimal && chargeAmount.gte(D(m.charge)) }
    catch (e) { return false }
  })
}

export function isChargeMilestonesUnlocked(areaIndex) {
  return gameState.areas[areaIndex].upgrades['143']?.level >= 1
}

// ============ 里程碑效果 ============
function applyGrassHopEffects(areaIndex) {
  const area = gameState.areas[areaIndex]
  const count = area.milestones.layer3B1
  const ms = getGrassHopMilestones(count)
  const eff = { grass: D1, xp: D1, doubleXp: D1, steel: D1, cuprumBase: 0 }
  for (const m of ms) {
    if (m.times === 1) eff.grass = eff.grass.mul(D(4).mul(D(1).add(D(0.25).mul(count))))
    if (m.times === 2) eff.xp = eff.xp.mul(D(1).add(D(0.25).mul(count)))
    if (m.times === 3) eff.doubleXp = eff.doubleXp.mul(D(1).add(D(0.25).mul(count)))
    if (m.times === 4 || m.times === 5 || m.times === 7) eff.cuprumBase++
    if (m.times === 10) eff.steel = eff.steel.mul(D(1).add(D(0.25).mul(count)))
  }
  return eff
}

function applyChargeEffects(areaIndex) {
  const area = gameState.areas[areaIndex]
  if (!isChargeMilestonesUnlocked(areaIndex)) return { steel: D1, xp: D1, doubleXp: D1, grass: D1, prestige: D1, crystal: D1 }
  const chk = charKey(areaIndex)
  const cv = ensureDec(area.resources[chk])
  const ms = getChargeMilestones(cv)
  const eff = { steel: D1, xp: D1, doubleXp: D1, grass: D1, prestige: D1, crystal: D1 }
  for (const m of ms) {
    const bonus = cv.add(D1).pow(0.1)
    const c = m.charge
    if (c >= 1e15) eff.crystal = eff.crystal.mul(bonus)
    else if (c >= 1e12) eff.prestige = eff.prestige.mul(bonus)
    else if (c >= 1e9) eff.grass = eff.grass.mul(bonus)
    else if (c >= 1e6) eff.doubleXp = eff.doubleXp.mul(bonus)
    else if (c >= 1e3) eff.xp = eff.xp.mul(bonus)
    else eff.steel = eff.steel.mul(bonus)
  }
  return eff
}

// ============ 创建状态 ============
function createUpgrades() { return parseCSV(UPGRADES_CSV) }

function createAreaState(ai) {
  const rl = AREA_RESOURCES_LIST[ai]
  const resources = {}
  rl.forEach(r => { resources[r.id] = D(0) })

  return {
    unlocked: ai === 0,
    resources,
    upgrades: createUpgrades(),
    level: 0,
    xp: D(0),
    doubleUnlocked: false,
    doubleLevel: 0,
    doubleXp: D(0),
    grassField: { grass: 0, maxGrass: 10, grassPerSec: D(1), _frac: 0 },
    resetCounts: { layer1: 0, layer2: 0, layer3B1: 0, layer3B2: 0 },
    milestones: { layer3B1: 0 },
    unlockedFeatures: { upgrades: false, rares: false, generators: false, layer3B2: false },
    autoTimers: { cut: 0, buy: 0, resetGain: 0, crystalGain: 0 },
    grassFree: false,
    prestigeFree: false,
    crystalFree: false,
  }
}

function createAdvState(i) {
  return {
    unlocked: false,
    resource: D(0),
    level: 0,
    xp: D(0),
    resetCounts: 0,
    resourceId: ADVANCED_AREAS[i].id,
  }
}

export const showTeleport = ref(false)
export const showSaveWindow = ref(false)
export const viewTick = ref(0)

// ============ 游戏状态（纯对象） ============
export const gameState = {
  tickSpeed: 50,
  gameSpeed: D(1),
  totalTicks: 0,
  areas: [createAreaState(0), createAreaState(1), createAreaState(2), createAreaState(3)],
  advancedAreas: [createAdvState(0), createAdvState(1), createAdvState(2), createAdvState(3)],
  totalGrassCut: D(0),
  totalXpEarned: D(0),
  notifications: [],
  lastSaveTime: 0,
  viewX: 0,
  viewY: 0,
  viewScale: 1,
}

// ============ XP ============
export function xpForLevelUp(lv) {
  // 从等级 lv 升到 lv+1 所需经验 = 100 × (lv + 1) × 1.2^lv
  if (lv < 0) return D0
  return D(100).mul(lv + 1).mul(D(1.2).pow(lv))
}

export function doubleXpCost(lv) { return D(10000).pow(lv + 1) }

// ============ 升级存取 ============
export function getUpgradeLevel(ai, id) {
  return gameState.areas[ai].upgrades[id]?.level || 0
}

// ============ 割草收益计算 ============
function calcCutGains(areaIndex, cutAmount) {
  const area = gameState.areas[areaIndex]
  // 草收益
  let gain = D1
  const u111 = getUpgradeLevel(areaIndex, '111')
  gain = gain.mul(D(2).pow(Math.floor(u111 / 10))).mul(D(1).add(D(u111)))
  const u121 = getUpgradeLevel(areaIndex, '121')
  gain = gain.mul(D(1.5).pow(Math.floor(u121 / 10))).mul(D(1).add(D(u121).mul(0.5)))
  const u131 = getUpgradeLevel(areaIndex, '131')
  gain = gain.mul(D(1.5).pow(Math.floor(u131 / 10))).mul(D(1).add(D(u131).mul(0.5)))
  gain = gain.mul(D(1).add(D(getUpgradeLevel(areaIndex, '151'))))
  gain = gain.mul(D(1).add(D(getUpgradeLevel(areaIndex, '161')).mul(0.2)))
  gain = gain.mul(D(1).add(D(getUpgradeLevel(areaIndex, '171'))))
  if (area.doubleUnlocked && area.doubleLevel > 0) gain = gain.mul(D(10).pow(area.doubleLevel))
  if (areaIndex === 0 && gameState.areas[0].level > 0) gain = gain.mul(D(1).add(D(gameState.areas[0].level)))
  if (gameState.areas[2].level > 0) gain = gain.mul(D(1).add(D(gameState.areas[2].level).mul(0.05)))
  gain = gain.mul(cutAmount).mul(gameState.gameSpeed)
  const hopEff = applyGrassHopEffects(areaIndex)
  gain = gain.mul(hopEff.grass)
  const chEff = applyChargeEffects(areaIndex)
  gain = gain.mul(chEff.grass)
  if (area.milestones.layer3B1 >= 12) {
    gain = gain.mul(D(2).pow(Math.min(area.milestones.layer3B1 - 11, Math.log2(1e6))))
  }
  // 经验
  let xpGain = D1
  xpGain = xpGain.mul(D(2).pow(Math.floor(getUpgradeLevel(areaIndex, '114') / 10))).mul(D(1).add(D(getUpgradeLevel(areaIndex, '114'))))
  xpGain = xpGain.mul(D(1.5).pow(Math.floor(getUpgradeLevel(areaIndex, '122') / 10))).mul(D(1).add(D(getUpgradeLevel(areaIndex, '122')).mul(0.5)))
  xpGain = xpGain.mul(D(1.5).pow(Math.floor(getUpgradeLevel(areaIndex, '132') / 10))).mul(D(1).add(D(getUpgradeLevel(areaIndex, '132')).mul(0.5)))
  xpGain = xpGain.mul(D(1).add(D(getUpgradeLevel(areaIndex, '153')).mul(0.1)))
  xpGain = xpGain.mul(D(1).add(D(getUpgradeLevel(areaIndex, '162')).mul(0.2)))
  if (area.doubleUnlocked && area.doubleLevel > 0) xpGain = xpGain.mul(D(10).pow(area.doubleLevel))
  xpGain = xpGain.mul(hopEff.xp).mul(chEff.xp).mul(cutAmount).mul(gameState.gameSpeed)
  // 二重经验
  let dXp = null
  if (area.doubleUnlocked) {
    dXp = D1
    dXp = dXp.mul(D(2).pow(Math.floor(getUpgradeLevel(areaIndex, '123') / 10))).mul(D(1).add(D(getUpgradeLevel(areaIndex, '123'))))
    dXp = dXp.mul(D(2).pow(Math.floor(getUpgradeLevel(areaIndex, '133') / 10))).mul(D(1).add(D(getUpgradeLevel(areaIndex, '133'))))
    dXp = dXp.mul(D(1).add(D(getUpgradeLevel(areaIndex, '154')).mul(0.1)))
    dXp = dXp.mul(hopEff.doubleXp).mul(chEff.doubleXp).mul(cutAmount).mul(gameState.gameSpeed)
  }
  return { gain, xpGain, dXp }
}

// ============ 割草 ============
export function cutGrass(areaIndex) {
  const area = gameState.areas[areaIndex]
  if (!area || !area.unlocked) return
  area.grassField.grass = Math.max(0, Math.floor(area.grassField.grass))
  if (area.grassField.grass < 1) return

  const cutAmount = (1 + getUpgradeLevel(areaIndex, '115')) * (1 + getUpgradeLevel(areaIndex, '152'))
  const actualCut = Math.min(cutAmount, area.grassField.grass)
  area.grassField.grass -= actualCut

  const { gain, xpGain, dXp } = calcCutGains(areaIndex, actualCut)
  const gk = grassKey(areaIndex)
  area.resources[gk] = ensureDec(area.resources[gk]).add(gain)
  gameState.totalGrassCut = gameState.totalGrassCut.add(gain)
  area.xp = ensureDec(area.xp).add(xpGain)
  gameState.totalXpEarned = gameState.totalXpEarned.add(xpGain)
  if (dXp) area.doubleXp = ensureDec(area.doubleXp).add(dXp)
  checkLevelUp(areaIndex)
  if (area.unlockedFeatures.rares) rollRareItems(areaIndex)
}

function checkLevelUp(areaIndex) {
  const area = gameState.areas[areaIndex]
  while (true) {
    const needed = xpForLevelUp(area.level)
    if (ensureDec(area.xp).gte(needed)) {
      area.xp = ensureDec(area.xp).sub(needed)
      area.level++
      area.resources[perkKey(areaIndex)] = ensureDec(area.resources[perkKey(areaIndex)]).add(D1)
      checkUnlocks(areaIndex)
      checkDoubleLevelUp(areaIndex)
    } else break
  }
}

function checkDoubleLevelUp(areaIndex) {
  const area = gameState.areas[areaIndex]
  if (!area.doubleUnlocked) return
  while (true) {
    const cost = doubleXpCost(area.doubleLevel)
    if (ensureDec(area.doubleXp).gte(cost)) {
      area.doubleXp = ensureDec(area.doubleXp).sub(cost)
      area.doubleLevel++
    } else break
  }
}

function checkUnlocks(areaIndex) {
  const area = gameState.areas[areaIndex]
  if (area.level >= 30 && !area.unlockedFeatures.upgrades) {
    area.unlockedFeatures.upgrades = true
    addNotification(`${AREA_FULL_NAMES[areaIndex]}: 升级物品已解锁`)
  }
  if (area.level >= 30 && !area.doubleUnlocked) {
    area.doubleUnlocked = true
    addNotification(`${AREA_FULL_NAMES[areaIndex]}: 二重经验系统永久解锁`)
  }
  if (area.level >= 100 && !area.unlockedFeatures.rares) {
    area.unlockedFeatures.rares = true
    addNotification(`${AREA_FULL_NAMES[areaIndex]}: 稀有物品已解锁`)
  }
  if (area.milestones.layer3B1 >= 8 && !area.unlockedFeatures.layer3B2) {
    area.unlockedFeatures.layer3B2 = true
    addNotification(`${AREA_FULL_NAMES[areaIndex]}: 钢化已解锁`)
  }
  if (getUpgradeLevel(areaIndex, '145') >= 1 && areaIndex < 3 && !gameState.areas[areaIndex + 1].unlocked) {
    gameState.areas[areaIndex + 1].unlocked = true
    addNotification(`${AREA_FULL_NAMES[areaIndex + 1]} 已解锁`)
  }
  if (getUpgradeLevel(areaIndex, '147') >= 1 && !gameState.advancedAreas[areaIndex].unlocked) {
    gameState.advancedAreas[areaIndex].unlocked = true
    addNotification(`B${areaIndex + 1} (${ADVANCED_AREAS[areaIndex].name}) 已解锁`)
  }
}

function rollRareItems(areaIndex) {
  if (Math.random() < 0.01) {
    const ck = cuprKey(areaIndex)
    gameState.areas[areaIndex].resources[ck] = ensureDec(gameState.areas[areaIndex].resources[ck]).add(D1)
  }
}

// ============ 声望重置 ============
export function doLayer1Reset(areaIndex) {
  const area = gameState.areas[areaIndex]
  if (area.level < 30) return
  const gk = grassKey(areaIndex); const pk = prestKey(areaIndex)
  const grass = ensureDec(area.resources[gk])
  if (!grass.eq(0)) {
    let gain = D(1.4142).pow(area.level / 10 - 3).mul(10)
    if (grass.gt(0)) gain = gain.mul(D(1.1487).pow(Math.max(0, Math.log10(grass.toNumber()))))
    const u116 = getUpgradeLevel(areaIndex, '116')
    gain = gain.mul(D(1.25).pow(Math.floor(u116 / 10))).mul(D(1).add(D(u116).mul(0.25)))
    gain = gain.mul(D(1).add(D(getUpgradeLevel(areaIndex, '155')).mul(0.1)))
    gain = gain.mul(D(1).add(D(getUpgradeLevel(areaIndex, '163')).mul(0.2)))
    gain = gain.mul(D(1).add(D(getUpgradeLevel(areaIndex, '172'))))
    gain = gain.floor().max(D1)
    area.resources[pk] = ensureDec(area.resources[pk]).add(gain)
    area.resetCounts.layer1++
    addNotification(`${AREA_FULL_NAMES[areaIndex]}: 声望 ×${area.resetCounts.layer1} 获得 ${fmt(gain)}`)
  }
  area.resources[gk] = D(0)
  area.upgrades['111'].level = 0; area.upgrades['112'].level = 0; area.upgrades['113'].level = 0
  area.upgrades['114'].level = 0; area.upgrades['115'].level = 0; area.upgrades['116'].level = 0
  // 重置级点和级点升级（除非购买了1A6）
  if (getUpgradeLevel(areaIndex, '1A6') <= 0) {
    area.resources[perkKey(areaIndex)] = D(0)
    for (const id of ['151', '152', '153', '154', '155', '156', '157', '158']) area.upgrades[id].level = 0
  }
  area.xp = D(0); area.level = 0; area.doubleXp = D(0); area.doubleLevel = 0
}

// ============ 结晶重置 ============
export function doLayer2Reset(areaIndex) {
  const area = gameState.areas[areaIndex]
  if (area.level < 100) return
  const gk = grassKey(areaIndex); const pk = prestKey(areaIndex); const ck = crystKey(areaIndex)
  let gain = D(1.1892).pow(area.level / 10 - 10).mul(10)
  if (ensureDec(area.resources[gk]).gt(0)) {
    gain = gain.mul(D(1.0718).pow(Math.max(0, Math.log10(ensureDec(area.resources[gk]).toNumber()))))
  }
  const u124 = getUpgradeLevel(areaIndex, '124')
  gain = gain.mul(D(1.25).pow(Math.floor(u124 / 10))).mul(D(1).add(D(u124).mul(0.25)))
  gain = gain.mul(D(1).add(D(getUpgradeLevel(areaIndex, '156')).mul(0.1)))
  gain = gain.mul(D(1).add(D(getUpgradeLevel(areaIndex, '164')).mul(0.2)))
  gain = gain.mul(D(1).add(D(getUpgradeLevel(areaIndex, '173'))))
  gain = gain.floor().max(D1)
  area.resources[ck] = ensureDec(area.resources[ck]).add(gain)
  area.resetCounts.layer2++

  area.resources[gk] = D(0); area.resources[pk] = D(0)
  for (const id of ['111', '112', '113', '114', '115', '116', '121', '122', '123', '124']) area.upgrades[id].level = 0
  // 重置级点和级点升级（除非购买了1A9）
  if (getUpgradeLevel(areaIndex, '1A9') <= 0) {
    area.resources[perkKey(areaIndex)] = D(0)
    for (const id of ['151', '152', '153', '154', '155', '156', '157', '158']) area.upgrades[id].level = 0
  }
  area.xp = D(0); area.level = 0; area.doubleXp = D(0); area.doubleLevel = 0
  addNotification(`${AREA_FULL_NAMES[areaIndex]}: 结晶 ×${area.resetCounts.layer2} 获得 ${fmt(gain)}`)
}

// ============ 草蹦重置 ============
export function getLayer3B1RequiredLevel(areaIndex) {
  return 200 + 10 * gameState.areas[areaIndex].milestones.layer3B1
}

export function doLayer3Branch1Reset(areaIndex) {
  const area = gameState.areas[areaIndex]
  if (area.level < getLayer3B1RequiredLevel(areaIndex)) return
  const gk = grassKey(areaIndex); const pk = prestKey(areaIndex)
  const ck = crystKey(areaIndex); const sk = steeKey(areaIndex)

  let gain = D1
  gain = gain.mul(D(1).add(D(getUpgradeLevel(areaIndex, '157')).mul(0.1)))
  gain = gain.mul(D(1).add(D(getUpgradeLevel(areaIndex, '165')).mul(0.2)))
  gain = gain.mul(D(1).add(D(getUpgradeLevel(areaIndex, '174'))))
  for (const id of ['181', '182', '183', '184']) gain = gain.mul(D(2).pow(getUpgradeLevel(areaIndex, id)))
  gain = gain.mul(applyGrassHopEffects(areaIndex).steel)

  area.resources[sk] = ensureDec(area.resources[sk]).add(gain)
  area.resetCounts.layer3B1++
  area.milestones.layer3B1++

  area.resources[gk] = D(0); area.resources[pk] = D(0); area.resources[ck] = D(0)
  for (const id of ['111', '112', '113', '114', '115', '116', '121', '122', '123', '124', '131', '132', '133', '134']) area.upgrades[id].level = 0
  // 重置级点和级点升级（草蹦始终重置）
  area.resources[perkKey(areaIndex)] = D(0)
  for (const id of ['151', '152', '153', '154', '155', '156', '157', '158']) area.upgrades[id].level = 0
  area.xp = D(0); area.level = 0
  addNotification(`${AREA_FULL_NAMES[areaIndex]}: 草蹦 #${area.milestones.layer3B1} 获得 ${fmt(gain)}`)
}

// ============ 钢化重置 ============
export function doLayer3Branch2Reset(areaIndex) {
  const area = gameState.areas[areaIndex]
  if (!area.unlockedFeatures.layer3B2 || area.level < 270) return
  const gk = grassKey(areaIndex); const pk = prestKey(areaIndex)
  const ck = crystKey(areaIndex); const sk = steeKey(areaIndex); const chk = charKey(areaIndex)

  let gain = D1
  for (const id of ['181', '182', '183', '184']) gain = gain.mul(D(2).pow(getUpgradeLevel(areaIndex, id)))
  gain = gain.mul(D(1).add(D(getUpgradeLevel(areaIndex, '157')).mul(0.1)))
  gain = gain.mul(D(1).add(D(getUpgradeLevel(areaIndex, '165')).mul(0.2)))

  area.resources[sk] = ensureDec(area.resources[sk]).add(gain)
  area.resources[chk] = ensureDec(area.resources[chk]).add(gain.div(2).max(D1))
  area.resetCounts.layer3B2++

  area.resources[gk] = D(0); area.resources[pk] = D(0); area.resources[ck] = D(0)
  for (const id of ['111', '112', '113', '114', '115', '116', '121', '122', '123', '124', '131', '132', '133', '134']) area.upgrades[id].level = 0
  // 重置级点和级点升级（钢化始终重置）
  area.resources[perkKey(areaIndex)] = D(0)
  for (const id of ['151', '152', '153', '154', '155', '156', '157', '158']) area.upgrades[id].level = 0
  area.xp = D(0); area.level = 0
  addNotification(`${AREA_FULL_NAMES[areaIndex]}: 钢化完成`)
}

// ============ 高级区域重置 ============
export function doAdvancedReset(advIdx) {
  const adv = gameState.advancedAreas[advIdx]
  if (!adv.unlocked) return
  let gain = D1
  const maxArea = advIdx === 3 ? 3 : advIdx
  for (let i = 0; i <= maxArea; i++) gain = gain.add(ensureDec(gameState.areas[i].resources[steeKey(i)]).div(100))
  gain = gain.max(D1).floor()
  adv.resource = ensureDec(adv.resource).add(gain)
  adv.resetCounts++
  for (let i = 0; i <= maxArea; i++) fullResetArea(i)
  addNotification(`B${advIdx + 1}: ${ADVANCED_AREAS[advIdx].name}重置完成`)
}

// ============ 升级购买 ============
export function buyUpgrade(areaIndex, upgradeId) {
  const area = gameState.areas[areaIndex]
  const def = area.upgrades[upgradeId]
  if (!def) return
  if (!isUpgradeUnlocked(areaIndex, upgradeId)) return
  // 防御：上限为 null/undefined 视为无上限
  const cap = (def.cap === null || def.cap === undefined) ? Infinity : def.cap
  if (def.level >= cap) return

  const cost = calcUpgradeCost(def)
  const resKey = def.buyResource
  const res = ensureDec(area.resources[resKey])
  if (!res) return

  if (isUpgradeFree(areaIndex, upgradeId) || res.gte(cost)) {
    if (!isUpgradeFree(areaIndex, upgradeId)) area.resources[resKey] = res.sub(cost)
    def.level++
    if (upgradeId === '143') gameState.areas[areaIndex].unlockedFeatures.generators = true
    if (upgradeId === '142') gameState.areas[areaIndex].unlockedFeatures.autoGain = true
    checkUnlocks(areaIndex)
  }
}

function isUpgradeFree(ai, id) {
  const a = gameState.areas[ai]
  const p = id.substring(0, 2)
  if (p === '11' && a.grassFree) return true
  if (p === '12' && a.prestigeFree) return true
  if (p === '13' && a.crystalFree) return true
  return false
}

export function canAffordUpgrade(ai, id) {
  try {
    const a = gameState.areas[ai]; const def = a.upgrades[id]
    if (!def) return false
    if (!isUpgradeUnlocked(ai, id)) return false
    const cap = (def.cap === null || def.cap === undefined) ? Infinity : def.cap
    if (def.level >= cap) return false
    if (isUpgradeFree(ai, id)) return true
    return ensureDec(a.resources[def.buyResource]).gte(calcUpgradeCost(def))
  } catch (e) { return false }
}

// ============ 游戏循环 ============
export function gameTick() {
  let speed = 1
  try { speed = gameState.gameSpeed.toNumber(); if (isNaN(speed)) speed = 1 } catch (e) { speed = 1 }
  const tm = speed

  for (let ai = 0; ai < 4; ai++) {
    const area = gameState.areas[ai]
    if (!area.unlocked) continue

    area.grassField.maxGrass = 10 + getUpgradeLevel(ai, '112')

    let gm = D1.add(D(getUpgradeLevel(ai, '113')).mul(0.1))
    const gpt = area.grassField.grassPerSec.mul(gm).mul(tm).div(1000 / gameState.tickSpeed)
    area.grassField._frac = (area.grassField._frac || 0) + gpt.toNumber()
    const whole = Math.floor(area.grassField._frac)
    if (whole > 0) {
      area.grassField._frac -= whole
      area.grassField.grass = Math.min(area.grassField.maxGrass, Math.floor(area.grassField.grass) + whole)
    }

    if (area.unlockedFeatures.generators) {
      let cg = D1
      cg = cg.mul(D(1).add(D(getUpgradeLevel(ai, '143')).mul(0.1)))
      cg = cg.mul(D(1).add(D(getUpgradeLevel(ai, '144')).mul(0.1)))
      cg = cg.mul(D(2).pow(Math.floor(getUpgradeLevel(ai, '192') / 10)))
      cg = cg.mul(D(2).pow(Math.floor(getUpgradeLevel(ai, '193') / 10)))
      cg = cg.mul(tm).div(1000 / gameState.tickSpeed)
      area.resources[charKey(ai)] = ensureDec(area.resources[charKey(ai)]).add(cg)
    }

    autoTick(ai, tm)
  }

  if (gameState.areas[3].level > 0) gameState.gameSpeed = D1.add(D(gameState.areas[3].level).mul(0.02))
  else gameState.gameSpeed = D1

  gameState.totalTicks++
  tick.value++
}

function autoTick(ai, tm) {
  const area = gameState.areas[ai]
  const pk = prestKey(ai); const ck = crystKey(ai)

  // 自动割草（不减少草地上的草，直接获得收益）
  const al = getUpgradeLevel(ai, '1A1')
  if (al > 0) {
    area.autoTimers.cut += tm
    const ivTicks = Math.max(2, 100 - (al - 1) * 20)
    while (area.autoTimers.cut >= ivTicks) {
      area.autoTimers.cut -= ivTicks
      const { gain, xpGain, dXp } = calcCutGains(ai, 1)
      const a2Mult = D(1).add(D(getUpgradeLevel(ai, '1A2')))
      const gk = grassKey(ai)
      area.resources[gk] = ensureDec(area.resources[gk]).add(gain.mul(a2Mult))
      gameState.totalGrassCut = gameState.totalGrassCut.add(gain.mul(a2Mult))
      area.xp = ensureDec(area.xp).add(xpGain.mul(a2Mult))
      gameState.totalXpEarned = gameState.totalXpEarned.add(xpGain.mul(a2Mult))
      if (dXp) area.doubleXp = ensureDec(area.doubleXp).add(dXp.mul(a2Mult))
      checkLevelUp(ai)
      if (area.unlockedFeatures && area.unlockedFeatures.rares) rollRareItems(ai)
    }
  }

  // 自动购买
  if (getUpgradeLevel(ai, '1A3') > 0 || getUpgradeLevel(ai, '1A5') > 0 || getUpgradeLevel(ai, '1A8') > 0) {
    area.autoTimers.buy += tm
    if (area.autoTimers.buy >= 1000) {
      area.autoTimers.buy -= 1000
      if (getUpgradeLevel(ai, '1A3') > 0) autoBuy(ai, '11')
      if (getUpgradeLevel(ai, '1A5') > 0) autoBuy(ai, '12')
      if (getUpgradeLevel(ai, '1A8') > 0) autoBuy(ai, '13')
    }
  }

  // 自动声望
  if (getUpgradeLevel(ai, '1A4') > 0 || getUpgradeLevel(ai, '191') > 0) {
    area.autoTimers.resetGain += tm
    if (area.autoTimers.resetGain >= 1000) {
      area.autoTimers.resetGain -= 1000
      area.resources[pk] = ensureDec(area.resources[pk]).add(ensureDec(area.resources[pk]).mul(0.01).add(D1))
    }
  }

  // 自动水晶（独立定时器）
  if (getUpgradeLevel(ai, '1A7') > 0 || getUpgradeLevel(ai, '194') > 0) {
    area.autoTimers.crystalGain += tm
    if (area.autoTimers.crystalGain >= 1000) {
      area.autoTimers.crystalGain -= 1000
      area.resources[ck] = ensureDec(area.resources[ck]).add(ensureDec(area.resources[ck]).mul(0.01).add(D1))
    }
  }

  area.grassFree = getUpgradeLevel(ai, '1AA') > 0
  area.prestigeFree = getUpgradeLevel(ai, '1AC') > 0
  area.crystalFree = getUpgradeLevel(ai, '1AB') > 0
}

function autoBuy(ai, prefix) {
  const area = gameState.areas[ai]
  // 每秒尝试购买所有可买的升级（按成本从低到高排序）
  const ids = Object.keys(area.upgrades).filter(id => id.startsWith(prefix))
  ids.sort((a, b) => {
    const costA = calcUpgradeCost(area.upgrades[a]).toNumber()
    const costB = calcUpgradeCost(area.upgrades[b]).toNumber()
    return costA - costB
  })
  for (const id of ids) {
    if (canAffordUpgrade(ai, id)) buyUpgrade(ai, id)
  }
}

// ============ 完整重置 ============
function fullResetArea(ai) {
  const area = gameState.areas[ai]
  AREA_RESOURCES_LIST[ai].forEach(r => { area.resources[r.id] = D(0) })
  area.upgrades = createUpgrades()
  area.level = 0; area.xp = D(0); area.doubleLevel = 0; area.doubleXp = D(0); area.doubleUnlocked = false
  area.grassField.grass = 0; area.grassField.maxGrass = 10; area.grassField.grassPerSec = D(1); area.grassField._frac = 0
  area.resetCounts = { layer1: 0, layer2: 0, layer3B1: 0, layer3B2: 0 }
  area.milestones = { layer3B1: 0 }
  area.unlockedFeatures = { upgrades: false, rares: false, generators: false, layer3B2: false }
  area.grassFree = false; area.prestigeFree = false; area.crystalFree = false
}

export function hardReset() {
  for (let i = 0; i < 4; i++) { fullResetArea(i); gameState.advancedAreas[i] = createAdvState(i) }
  gameState.areas[0].unlocked = true
  gameState.totalGrassCut = D(0); gameState.totalXpEarned = D(0); gameState.gameSpeed = D(1)
  gameState.totalTicks = 0; gameState.notifications = []
  addNotification('硬重置完成')
}

// ============ 通知 ============
export function addNotification(msg) {
  gameState.notifications.unshift({ id: Date.now(), msg, time: Date.now() })
  if (gameState.notifications.length > 50) gameState.notifications.pop()
}

// ============ 存档 ============
const DEC_MARKER = '__DEC__'
const INF_MARKER = '__INF__'

export function getSaveState() {
  return JSON.parse(JSON.stringify(gameState, (k, v) =>
    v === Infinity ? INF_MARKER :
    v instanceof Decimal ? { [DEC_MARKER]: v.toString() } : v
  ))
}

export function loadSaveState(state) {
  function restore(obj) {
    if (obj === null || obj === undefined) return obj
    if (obj === INF_MARKER) return Infinity
    if (Array.isArray(obj)) return obj.map(v => restore(v))
    if (typeof obj !== 'object') return obj
    if (DEC_MARKER in obj) return D(obj[DEC_MARKER])
    const r = {}
    for (const k of Object.keys(obj)) r[k] = restore(obj[k])
    return r
  }
  try {
    const r = restore(state)
    if (!r) return false
    // 恢复 Infinity 上限
    function fixCaps(upgrades) {
      for (const id in upgrades) {
        const def = upgrades[id]
        if (def && (def.cap === null || def.cap === undefined)) def.cap = Infinity
      }
    }
    // 确保所有资源是 Decimal
    if (r.areas) {
      for (const area of r.areas) {
        if (area && area.resources) {
          for (const k of Object.keys(area.resources)) {
            area.resources[k] = ensureDec(area.resources[k])
          }
        }
        if (area) {
          area.xp = ensureDec(area.xp)
          area.doubleXp = ensureDec(area.doubleXp)
          if (area.grassField) {
            area.grassField.grassPerSec = ensureDec(area.grassField.grassPerSec)
            area.grassField._frac = area.grassField._frac || 0
            area.grassField.grass = Math.max(0, Math.floor(area.grassField.grass || 0))
          }
          if (area.upgrades) fixCaps(area.upgrades)
        }
      }
    }
    if (r.advancedAreas) {
      for (const adv of r.advancedAreas) {
        if (adv) adv.resource = ensureDec(adv.resource)
      }
    }
    r.gameSpeed = ensureDec(r.gameSpeed)
    r.totalGrassCut = ensureDec(r.totalGrassCut)
    r.totalXpEarned = ensureDec(r.totalXpEarned)

    Object.assign(gameState, r)
    addNotification('存档已加载')
    return true
  } catch (e) { console.error(e); return false }
}

// ============ 区域布局 ============
export const CELL = 100

export function getAreaPos(idx) {
  return { x: (-4004 + 2000 * idx), y: -2004 }
}
export function getAdvancedAreaPos(idx) {
  return { x: (-4004 + 2000 * idx), y: -4 }
}