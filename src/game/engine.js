import { ref } from 'vue'
import Decimal from 'break_eternity.js'

// ============ 全局 tick 驱动 UI 更新 ============
export const tick = ref(0)

// ============ 工具 ============
export const D = (v) => new Decimal(v)
export const D0 = new Decimal(0)
export const D1 = new Decimal(1)
export const Q1 = new Decimal(2).root(2)
export const Q2 = new Decimal(2).root(4)
export const Q3 = new Decimal(2).root(8)
export const Q4 = new Decimal(2).root(16)
export const Q5 = new Decimal(2).root(32)
export const Q6 = new Decimal(2).root(64)
export const DEC = D

export function fmt(d) {
  if (d === null || d === undefined) return '0'
  if (typeof d === 'number') return d < 1e3 ? (Number.isInteger(d) ? d.toLocaleString() : d.toFixed(2)) : d.toExponential(3)
  try {
    if (d.eq(0)) return '0'
    if (d.lt(1e6)) return d.toFixed(0) 
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
    l3B2Desc: '重置草跳重置的东西\n获得乐趣' },
  { layer1: '常态', layer2: '气化', layer3B1: '草跃', layer3B2: '暗化',
    l1Desc: '重置非自然草\n获得正常点',
    l2Desc: '重置常态及以下\n获得云',
    l3Desc: '重置气化及以下\n获得草跃次数',
    l3B2Desc: '重置草跳跃锁的东西\n获得暗视' },
  { layer1: '四分', layer2: '电离', layer3B1: '草跨', layer3B2: '行星',
    l1Desc: '重置小行星草\n获得四分点',
    l2Desc: '重置四分及以下\n获得等离子体',
    l3Desc: '重置电离及以下\n获得草跨次数',
    l3B2Desc: '重置草跨重置的东西\n获得行星' },
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
    { id: 'fuel', name: '火箭燃料', emoji: '🚀' },
    { id: 'part', name: '火箭部件', emoji: '🔧' },
  ],
  [
    { id: 'antiGrass', name: '反草', emoji: '🥬' },
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
//ID,cost_resource,base_cost,cost_scaling,boost_resource,base_boost,boost_scaling,desc
const UPGRADES_CSV = `111,"grass",10,1.32,"grass",1,2,"Infinity","每级使草的获得数量+100%,每10级使草的获得数量×2"
112,"grass",25,1.32,"A1_grass_cap",1,1,990,"每级使A1区域草的数量上限增加1"
113,"grass",100,1.32,"A1_growth_speed",0.1,1,990,"每级使A1区域草的生长速度增加10%"
114,"grass",1e3,1.32,"xp",1,2,"Infinity","每级使经验的获得数量+100%,每10级使经验的获得数量×2"
115,"grass",1e5,2,"cut_amount",1,1,9,"点击一次多割1个草"
116,"grass",1e10,2,"prestige",0.25,1.25,"Infinity","每级使声望点的获得数量+25%,每10级使声望点的获得数量×1.25"
121,"prestige",1,1.32,"grass",0.5,1.5,"Infinity","每级使草的获得数量+50%,每10级使草的获得数量×1.5"
122,"prestige",3,1.32,"xp",0.5,1.5,"Infinity","每级使经验的获得数量+50%,每10级使经验的获得数量×1.5"
123,"prestige",15,1.32,"doubleXp",1,2,"Infinity","每级使二重经验获得数量+100%,每10级使二重经验的获得数量×2"
124,"prestige",105,1.4,"crystal",0.25,1.25,"Infinity","每级使水晶的获得数量+25%,每10级使水晶的获得数量×1.25"
131,"crystal",1,1.32,"grass",0.5,1.5,"Infinity","每级使草的获得数量+50%,每10级使草的获得数量×1.5"
132,"crystal",2,1.32,"xp",0.5,1.5,"Infinity","每级使经验的获得数量+50%,每10级使经验的获得数量×1.5"
133,"crystal",6,1.32,"doubleXp",1,2,"Infinity","每级使二重经验获得数量+100%,每10级使二重经验的获得数量×2"
134,"crystal",24,1.4,"prestige",0.25,1.25,"Infinity","每级使声望点的获得数量+25%,每10级使声望点的获得数量×1.25"
141,"steel",1,1.15,"",0.1,1,90,"解锁钢增益升级，每级使钢增益升级效果+10%"
142,"steel",1e3,1.15,"",0.1,1,90,"解锁自动增益升级，每级使自动增益升级效果+10%"
143,"steel",1e6,1.15,"charge",0.1,1,90,"解锁生成物品（充能），每级使充能获得数量+10%"
144,"steel",1e9,1.15,"charge",0.1,1,90,"解锁更多自动化升级，每级使充能获得数量+10%"
145,"steel",1e12,1.15,"charge",0.1,1,90,"解锁A2区域，每级使充能获得数量+10%"
146,"steel",1e15,1.15,"charge",0.1,1,90,"解锁火箭燃料（fuel，需要充能charge和石油oil合成），每级使充能获得数量+10%"
147,"steel",1e18,1.15,"charge",0.1,1,90,"解锁火箭部件（part，需要火箭燃料fuel和钢steel合成），每级使充能获得数量+10%"
148,"steel",1e21,1.15,"charge",0.1,1,90,"解锁B1区域，每级使充能获得数量+10%"
151,"perk",1,1,"grass",1,1,99,"草的获得数量+100%"
152,"perk",1,1,"cut_amount",1,1,9,"一次点击割草数量的倍数+1"
153,"perk",2,1,"xp",0.1,1,90,"经验的获得数量+10%"
154,"perk",5,1,"doubleXp",0.1,1,90,"二重经验的获得数量+10%"
155,"perk",10,1,"prestige",0.1,1,90,"声望点的获得数量+10%"
156,"perk",20,1,"crystal",0.1,1,90,"水晶的获得数量+10%"
157,"perk",50,1,"steel",0.1,1,90,"钢的获得数量+10%"
158,"perk",100,1,"charge",0.1,1,90,"充能的获得数量+10%"
161,"cuprum",10,1,"grass",0.1,1,90,"草的获得数量+10%"
162,"cuprum",10,1,"xp",0.1,1,90,"经验的获得数量+10%"
163,"cuprum",50,1,"prestige",0.1,1,90,"声望点的获得数量+10%"
164,"cuprum",50,1,"crystal",0.1,1,90,"水晶的获得数量+10%"
165,"cuprum",250,1,"steel",0.1,1,90,"钢的获得数量+10%"
166,"cuprum",250,1,"charge",0.1,1,90,"充能的获得数量+10%"
171,"charge",1e21,1.1,"grass",1,1,"Infinity","草的获得数量+100%"
172,"charge",1e22,1.1,"prestige",1,1,"Infinity","声望点的获得数量+100%"
173,"charge",1e23,1.1,"crystal",1,1,"Infinity","水晶的获得数量+100%"
174,"charge",1e34,1.1,"steel",1,1,"Infinity","钢的获得数量+100%"
181,"grass",1e24,2,"steel",0.1,1,999,"钢的获得数量+10%"
182,"prestige",1e8,1.4,"steel",0.1,1,999,"钢的获得数量+10%"
183,"crystal",1e4,1.2,"steel",0.1,1,999,"钢的获得数量+10%"
184,"steel",100,1.1,"steel",0.1,1,999,"钢的获得数量+10%"
191,"grass",1e24,2,"",0.001,1,99,"每秒自动生成的声望点+0.1%"
192,"prestige",1e12,1.2,"charge",1,2,100,"充能获得+100%，每10级使充能获得数量×2"
193,"crystal",1e6,1.2,"charge",1,2,100,"充能获得+100%，每10级使充能获得数量×2"
194,"steel",1e3,1.2,"",0.001,1,99,"每秒自动生成的水晶+0.1%"
1A1,"grass",1000,10,"",1,1,5,"每5秒自动割1次草，之后每级使时间间隔-1"
1A2,"grass",1e8,1,"",1,1,1,"自动购买草升级"
1A3,"prestige",100,3,"",1,1,9,"自动割草获得的资源数量+100%"
1A4,"prestige",1e3,1,"",1,1,1,"声望不再重置级点和级点升级"
1A5,"prestige",1e4,1,"",1,1,1,"每秒自动生成重置时能获得声望点的+1%"
1A6,"prestige",1e6,1,"",1,1,1,"自动购买声望升级"
1A7,"crystal",100,3,"",1,1,9,"自动割草的时间间隔-0.1秒"
1A8,"crystal",1e3,1,"",1,1,1,"结晶不再重置级点和级点升级"
1A9,"crystal",1e4,1,"",1,1,1,"每秒自动生成重置时能获得水晶的+1%"
1AA,"crystal",1e6,1,"",1,1,1,"自动购买水晶升级"
1AB,"steel",1e9,1,"",1,1,1,"购买草升级不再消耗草"
1AC,"steel",1e10,1,"",1,1,1,"购买声望升级不再消耗声望点"
1AD,"steel",1e11,1,"",1,1,1,"购买水晶升级不再消耗水晶"
1AE,"steel",1e12,1,"",1,1,1,"草蹦不再重置级点和级点升级"
211,"antiGrass",10,1.32,"antiGrass",1,1.25,"Infinity","每级使反草的获得数量+100%，每10级使反草的获得数量×1.25"
212,"antiGrass",100,1.32,"charge",0.25,1.25,"Infinity","每级使充能的获得数量+25%，每10级使充能的获得数量×1.25"
213,"antiGrass",500,1.32,"A2_grass_cap",1,1,990,"每级使A2区域的草的上限+1"
214,"antiGrass",1000,1.32,"antiXp",1,1.25,"Infinity","每级使反经验的获得数量+100%，每10级使反经验的获得数量×1.25"
215,"antiGrass",5000,1.32,"A2_growth_speed",1,1,990,"每级使A2区域的草的增长速度+10%"
216,"antiGrass",1e5,1.32,"grass",0.25,1.25,"Infinity","每级使草的获得数量+25%，每10级使草的获得数量×1.25"
217,"antiGrass",1e6,1.32,"xp",0.25,1.25,"Infinity","每级使经验的获得数量+25%，每10级使经验的获得数量×1.25"
218,"antiGrass",1e9,1.8,"anonymousPoint",0.25,1.25,"Infinity","每级使匿名点的获得数量+25%，每10级使匿名点的获得数量×1.25"
221,"anonymousPoint",1,1.32,"antiGrass",0.25,1.25,"Infinity","每级使反草的获得数量+25%，每10级使反草的获得数量×1.25"
222,"anonymousPoint",2,1.32,"charge",0.25,1.25,"Infinity","每级使充能的获得数量+25%，每10级使充能的获得数量×1.25"
223,"anonymousPoint",5,1.32,"grass",0.25,1.25,"Infinity","每级使草的获得数量+25%，每10级使草的获得数量×1.25"
224,"anonymousPoint",10,1.32,"xp",0.25,1.25,"Infinity","每级使经验的获得数量+25%，每10级使经验的获得数量×1.25"
225,"anonymousPoint",20,1.32,"antiXp",0.25,1.25,"Infinity","每级使反经验的获得数量+25%，每10级使反经验的获得数量×1.25"
226,"anonymousPoint",50,1.8,"oil",0.25,1.25,"Infinity","每级使石油的获得数量+25%，每10级使石油的获得数量×1.25"
231,"oil",1,1.32,"antiGrass",0.25,1.25,"Infinity","每级使反草的获得数量+25%，每10级使反草的获得数量×1.25"
232,"oil",2,1.32,"grass",0.25,1.25,"Infinity","每级使草的获得数量+25%，每10级使草的获得数量×1.25"
233,"oil",3,1.32,"antiXp",0.25,1.25,"Infinity","每级使反经验的获得数量+25%，每10级使反经验的获得数量×1.25"
234,"oil",6,1.32,"xp",0.25,1.25,"Infinity","每级使经验的获得数量+25%，每10级使经验的获得数量×1.25"
235,"oil",10,1.32,"doubleXp",0.1,1.1,"Infinity","每级使二重经验的获得数量+10%，每10级使二重经验的获得数量×1.1"
236,"oil",20,1.8,"steel",1,2,"Infinity","每级使钢的获得数量+100%，每10级使钢的获得数量×2"
241,"fun",1,1.15,"",0.1,1,90,"解锁乐趣增益升级，每级使充能的获得数量+10%"
242,"fun",1e3,1.15,"",0.1,1,90,"解锁新的充能里程碑，每级使充能的获得数量+10%"
243,"fun",1e6,1.15,"",0.1,1,90,"解锁SFRGT生成器和SFRGT里程碑，每级使SFRGT的获得数量+10%"
244,"fun",1e9,1.15,"",0.1,1,90,"解锁新的A2区域自动化，每级使SFRGT的获得数量+10%"
245,"fun",1e18,1.15,"",0.1,1,90,"解锁A3区域，每级使SFRGT的获得数量+10%"
246,"fun",1e27,1.15,"",0.1,1,90,"解锁B2区域，每级使SFRGT的获得数量+10%"
251,"antiPerk",1,1,"antiGrass",1,1,99,"反草的获得数量+100%"
252,"antiPerk",2,1,"charge",1,1,99,"充能的获得数量+100%"
253,"antiPerk",5,1,"antiXp",0.1,1,90,"反经验的获得数量+10%"
254,"antiPerk",10,1,"anonymousPoint",0.1,1,90,"匿名点的获得数量+10%"
255,"antiPerk",20,1,"oil",0.1,1,90,"石油的获得数量+10%"
256,"antiPerk",50,1,"fun",0.1,1,90,"乐趣的获得数量+10%"
261,"argentum",3,1,"antiGrass",0.1,1,90,"反草的获得数量+10%"
262,"argentum",6,1,"anonymousPoint",0.1,1,90,"匿名点的获得数量+10%"
263,"argentum",9,1,"oil",0.1,1,90,"石油的获得数量+10%"
264,"argentum",12,1,"fun",0.1,1,90,"乐趣的获得数量+10%"
265,"argentum",15,1.1,"cuprum",1,1,99,"铜的获得数量+100%"
266,"argentum",60,1.1,"star",1,1,99,"星星的获得数量+100%"
267,"argentum",250,1.1,"SFRGT",1,1,99,"SFRGT的获得数量+100%"
268,"argentum",1000,1.1,"steel",1,1,99,"钢的获得数量+100%"
271,"SFRGT",50,1.4,"tripleXp",0.25,1.25,"Infinity","每级使三重经验的获得数量+25%，每10级使三重经验的获得数量×1.25"
272,"SFRGT",500,1.4,"star",0.25,1.25,"Infinity","每级使星星的获得数量+25%，每10级使星星的获得数量×1.25"
281,"cuprum",100,1.05,"fun",1,1,999,"每级使乐趣的获得数量+100%"
282,"star",1,1.05,"fun",1,1,999,"每级使乐趣的获得数量+100%"
283,"fun",1,1.2,"fun",1,1,999,"每级使乐趣的获得数量+100%"
284,"SFRGT",1,1.05,"fun",1,1,999,"每级使乐趣的获得数量+100%"
291,"SFRGT",1e5,1.5,"SFRGT",1,2,200,"每级使SFRGT的获得数量获得数量+100%，每10级使SFRGT的获得数量×2"
292,"fun",1e12,2,"SFRGT",1,2,200,"每级使SFRGT的获得数量+100%，每10级使SFRGT的获得数量×2"
2A1,"antiGrass",100,10,"",1,1,10,"每(1/该升级等级)秒自动割1次反草"
2A2,"antiGrass",300,10,"",1,1,9,"自动割反草获得的资源数量+100%"
2A3,"anonymousPoint",100,1,"",1,1,1,"自动购买反草升级"
2A4,"anonymousPoint",1000,1,"",1,1,1,"匿名不再重置反级点及其升级"
2A5,"anonymousPoint",10000,1,"",1,1,1,"每秒自动生成重置时能获得匿名点的1%"
2A6,"oil",100,1,"",1,1,1,"自动购买匿名点升级"
2A7,"oil",1000,1,"",1,1,1,"液化不再重置反级点及其升级"
2A8,"oil",10000,1,"",1,1,1,"每秒自动生成重置时能获得石油的1%"
2A9,"antiGrass",1e30,1,"",1,1,1,"购买反草升级不再消耗反草"
2AA,"anonymousPoint",1e12,1,"",1,1,1,"购买匿名点升级不再消耗匿名点"
2AB,"oil",1e6,1,"",1,1,1,"购买石油升级不再消耗石油"
2AC,"antiGrass",1e40,1,"",1,1,1,"草跳不再重置反级点及其升级"
`

const B1_UPGRADES_CSV = `511,"star",5,2,"",1,1,10,"每级使钢的获得数量×2"
512,"star",1e4,1.11,"",0.01,1,100,"自动生成该升级等级×1%重置时能获得的钢"
513,"star",1e9,1.23,"",0.09,1,100,"自动生成该升级等级×9%重置时能获得的钢"
514,"star",15,1.23,"charge",1,2,"Infinity","每级使充能的获得数量+100%，每10级使充能的获得数量×2"
515,"star",20,1.23,"xp",1,2,"Infinity","每级使经验的获得数量+100%，每10级使经验的获得数量×2"
516,"star",40,1.23,"doubleXp",1,2,"Infinity","每级使二重经验的获得数量+100%，每10级使二重经验的获得数量×2"
517,"star",80,1.23,"tripleXp",1,2,"Infinity","每级使三重经验的获得数量+100%，每10级使三重经验的获得数量×2"
518,"star",30,1.23,"grass",0.5,1.5,100,"每级使草的获得数量+50%，每10级使草的获得数量×1.5"
519,"star",60,1.23,"oil",0.5,1.5,100,"每级使石油的获得数量+50%，每10级使石油的获得数量×1.5"
521,"star",10,10,"A1_grass_cap",100,1,10,"每级使A1区域草的上限增加100"
522,"star",20,10,"",1,1,10,"每级使A1区域自动割草获得的资源数量增加100%"
523,"star",40,10,"",1,1,10,"每级使A1区域自动割草速度增加100%"
524,"cuprum",1e6,2,"star",1,2,100,"星星的获得数量增加100%，每10级使星星的获得数量×2"
525,"steel",1e36,4,"star",1,2,100,"星星的获得数量增加100%，每10级使星星的获得数量×2"
526,"argentum",1e3,2,"star",1,2,100,"星星的获得数量增加100%，每10级使星星的获得数量×2"
5A1,"star",5,2,"",1,1,7,"星星重置时保留A1区域前2x个自动化升级，x为该升级等级"
5A2,"star",500,1,"",1,1,1,"A1区域自动割草价值乘数应用于铜的获得数量"
5A3,"star",1000,1,"",1,1,1,"草蹦重置可以一次获得多个草蹦次数(基于等级)"
5A4,"star",1e12,1,"",1,1,1,"自动获得草蹦次数，它不再重置任何东西"
5A5,"star",400,1,"",1,1,1,"自动购买钢升级"
5A6,"star",600,1,"",1,1,1,"自动购买级点升级"
5A7,"star",1000,1,"",1,1,1,"自动购买铜升级"
5A8,"star",1600,1,"",1,1,1,"自动购买充能升级"
5A9,"star",3000,1,"",1,1,1,"自动购买钢增益升级"
5AA,"star",5000,1,"",1,1,1,"自动购买自动增益升级"
`

function parseCSV(csv) {
  const lines = csv.trim().split('\n')
  const upgrades = {}
  for (const line of lines) {
    const parts = line.match(/(?:^|,)("(?:[^"]*)"|[^,]*)/g)
    if (!parts || parts.length < 9) continue
    const clean = parts.map(p => p.replace(/^,/, '').replace(/^"|"$/g, ''))
    const cap = clean[7] === 'Infinity' ? Infinity : parseInt(clean[7])
    upgrades[clean[0]] = {
      id: clean[0],
      buyResource: clean[1],
      baseCost: parseFloat(clean[2]),
      costScaling: parseFloat(clean[3]),
      boostResource: clean[4] || '',
      addition: parseFloat(clean[5]) || 0,
      multPer10: parseFloat(clean[6]) || 1,
      cap,
      description: clean[8],
      level: D(0),
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
  if (p === '21') return { cat: 'antiGrass', name: '反草升级', emoji: '🌪️', idx: 0 }
  if (p === '22') return { cat: 'anonymousPoint', name: '匿名点升级', emoji: '📛', idx: 1 }
  if (p === '23') return { cat: 'oil', name: '石油升级', emoji: '🛢️', idx: 2 }
  if (p === '24') return { cat: 'fun', name: '乐趣升级', emoji: '😄', idx: 3 }
  if (p === '25') return { cat: 'antiPerk', name: '反级点升级', emoji: '📍', idx: 4 }
  if (p === '26') return { cat: 'argentum', name: '银升级', emoji: '⚪', idx: 5 }
  if (p === '27') return { cat: 'sfrgt', name: 'SFRGT升级', emoji: '🌼', idx: 6 }
  if (p === '28') return { cat: 'funGain', name: '乐趣增益', emoji: '😄', idx: 7 }
  if (p === '29') return { cat: 'sfrgtGain', name: 'SFRGT增益', emoji: '🌼', idx: 8 }
  if (p === '2A') return { cat: 'a2Automation', name: '自动化', emoji: '🤖', idx: 9 }
  return { cat: 'unknown', name: '', emoji: '', idx: -1 }
}

// 升级解锁条件
export function isUpgradeUnlocked(ai, id) {
  const area = gameState.areas[ai]
  const prefix = id.substring(0, 2)
  // A1区域升级
  if (prefix === '11') return true
  if (prefix === '12') return area.resetCounts.layer1.gt(D0)
  if (prefix === '13') return area.resetCounts.layer2.gt(D0)
  if (prefix === '14') return area.resetCounts.layer3B2.gt(D0)
  if (prefix === '15') return area.resetCounts.layer1.gt(D0)
  if (prefix === '16') return area.resetCounts.layer2.gt(D0)
  if (prefix === '17') return getUpgradeLevel(ai, '143') >= 1
  if (prefix === '18') return getUpgradeLevel(ai, '141') >= 1
  if (prefix === '19') return getUpgradeLevel(ai, '142') >= 1
  if (prefix === '1A') {
    // 1A1~1AA 一开始解锁，1AB~1AE 需要购买144后解锁
    if (id === '1AB' || id === '1AC' || id === '1AD' || id === '1AE') return getUpgradeLevel(ai, '144') >= 1
    return true
  }
  // A2区域升级
  if (prefix === '21') return true
  if (prefix === '22') return area.resetCounts.layer1.gt(D0)
  if (prefix === '23') return area.resetCounts.layer2.gt(D0)
  if (prefix === '24') return area.resetCounts.layer3B3.gt(D0)
  if (prefix === '25') return area.resetCounts.layer1.gt(D0)
  if (prefix === '26') return area.resetCounts.layer2.gt(D0)
  if (prefix === '27') return getUpgradeLevel(ai, '243') >= 1
  if (prefix === '28') return getUpgradeLevel(ai, '241') >= 1
  if (prefix === '29') return getUpgradeLevel(ai, '243') >= 1
  if (prefix === '2A') {
    if (id === '2A9' || id === '2AA' || id === '2AB' || id === '2AC') return getUpgradeLevel(ai, '244') >= 1
    return true
  }
  // B1区域升级（5xx）
  if (prefix === '51' || prefix === '52' || prefix === '5A') return gameState.advancedAreas[0].resetCounts >= 1
  return false
}

// 计算升级价格
export function calcUpgradeCost(def) {
  const lv = D(def.level)
  if (lv.lte(1000)) {
    return D(def.baseCost).mul(D(def.costScaling).pow(lv))
  }
  // 1000级后: baseCost × costScaling^(1000×(level/1000)^2)
  const exp = D(1000).mul(lv.div(1000).pow(2))
  return D(def.baseCost).mul(D(def.costScaling).pow(exp))
}

// 反函数：给定资源量，求从0级开始能买到的最大等级
export function calcMaxAffordableLevel(def, budget) {
  const cap = (def.cap === null || def.cap === undefined) ? Infinity : def.cap
  const baseCost = D(def.baseCost)
  const cs = D(def.costScaling)

  if (budget.lt(baseCost)) return D0

  // 先算1000级以内能买到的最大等级
  // cost(level) = baseCost × cs^level
  // 最大等级满足: baseCost × cs^maxLv <= budget
  // => maxLv = log(budget / baseCost) / log(cs)
  let maxLv
  if (cs.eq(1)) {
    // costScaling=1 时每级价格相同
    maxLv = budget.div(baseCost)
  } else {
    const logCs = cs.log()
    if (logCs <= 0) {
      maxLv = D(1000)
    } else {
      maxLv = budget.div(baseCost).log().div(logCs)
    }
  }
  maxLv = maxLv.floor()

  // 如果最大等级 <= 1000，直接返回
  if (maxLv.lte(1000)) {
    return Decimal.min(maxLv, D(cap))
  }

  // 如果最大等级 > 1000，需要用1000级后的公式重新计算
  // cost(level) = baseCost × cs^(1000×(level/1000)^2)
  // level = 1000 × sqrt(log(budget / baseCost) / (1000 × log(cs)))
  if (cs.eq(1)) {
    return Decimal.min(maxLv, D(cap))
  }
  const logCs = cs.log()
  const exp = budget.div(baseCost).log().div(D(1000).mul(logCs))
  if (exp.lt(0)) return Decimal.min(D(1000), D(cap))
  maxLv = D(1000).mul(exp.sqrt()).floor()
  return Decimal.min(maxLv, D(cap))
}

// ============ 里程碑解析 ============
const MILESTONE_CSV = `grass_hop,1,"草的获得数量×4×(1+草蹦次数)"
grass_hop,2,"经验的获得数量×(1+草蹦次数)"
grass_hop,3,"二重经验的获得数量×(1+草蹦次数)"
grass_hop,4,"铜的基础获得数量+1"
grass_hop,5,"铜的基础获得数量再次+1"
grass_hop,6,"级点的基础获得数量+1"
grass_hop,7,"铜的基础获得数量第三次+1"
grass_hop,8,"永久解锁钢化重置"
grass_hop,10,"钢的获得数量×(1+0.25×草蹦次数)"
grass_hop,12,"使充能获得数量乘以2^(草蹦次数-10)"
grass_hop,14,"这次及以后的每次草蹦使充能奖励公式中的除数÷10(除数最低为1)"
grass_hop,16,"反草的获得数量×(1+0.5×草蹦次数)"
grass_hop,18,"反经验的获得数量×(1.2^草蹦次数)"
grass_hop,30,"从30次草蹦开始每次草蹦使充能奖励乘以1.1"
charge,1,"充能加成钢的获得数量"
charge,1e3,"充能加成经验的获得数量"
charge,1e6,"充能加成二重经验的获得数量"
charge,1e9,"充能加成草的获得数量"
charge,1e12,"充能加成声望点的获得数量"
charge,1e15,"充能加成水晶的获得数量"
charge,1e18,"充能加成反草的获得数量"
charge,1e21,"充能加成反经验的获得数量"
charge,1e24,"充能加成匿名点的获得数量"
charge,1e27,"充能加成石油的获得数量"
charge,1e30,"充能加成三重经验的获得数量"
charge,1e33,"充能加成乐趣的获得数量"
grass_skip,1,"星星的获得数量×(1+0.5×草跳次数)"
grass_skip,2,"三重经验的获得数量×(1+草跳次数)"
grass_skip,3,"A2区域的自动割草速度、自动割草获得的资源×2"
grass_skip,4,"铜的基础获得数量+10"
grass_skip,5,"A2区域的自动割草速度×5"
grass_skip,6,"银的基础获得数量+1"
grass_skip,7,"A2区域的自动割草获得的资源×5"
grass_skip,8,"永久解锁趣化重置"
grass_skip,12,"钢的获得数量×(1+0.25×草跳次数)"
grass_skip,16,"乐趣的获得数量×(1+0.25×草跳次数)"
grass_skip,20,"15次开始的每5次草跳都使银的获得数量+1"
grass_skip,30,"从30次草跳开始每次草跳使充能奖励乘以1.075"
SFRGT,1,"SFRGT加成充能的获得数量以(1+x)^0.1"
SFRGT,1e3,"SFRGT加成反经验的获得数量以(1+x)^0.1"
tripleLevel,2,"三重等级加成声望点的获取×1.4^x"
tripleLevel,4,"三重等级加成水晶的获取×1.24^x"
tripleLevel,6,"三重等级加成钢的获取×1.08^x"
tripleLevel,8,"三重等级加成铜的获取×(1+x)"
`

function parseMilestones() {
  const lines = MILESTONE_CSV.trim().split('\n')
  const grassHop = [], charge = [], grassSkip = [], sfrgt = [], tripleLevel = []
  for (const line of lines) {
    const parts = line.match(/(?:^|,)("(?:[^"]*)"|[^,]*)/g)
    if (!parts || parts.length < 3) continue
    const clean = parts.map(p => p.replace(/^,/, '').replace(/^"|"$/g, ''))
    if (clean[0] === 'grass_hop') grassHop.push({ times: parseInt(clean[1]), desc: clean[2] })
    else if (clean[0] === 'charge') charge.push({ charge: parseFloat(clean[1]), desc: clean[2] })
    else if (clean[0] === 'grass_skip') grassSkip.push({ times: parseInt(clean[1]), desc: clean[2] })
    else if (clean[0] === 'SFRGT') sfrgt.push({ amount: parseFloat(clean[1]), desc: clean[2] })
    else if (clean[0] === 'tripleLevel') tripleLevel.push({ level: parseInt(clean[1]), desc: clean[2] })
  }
  return {
    grassHop: grassHop.sort((a, b) => a.times - b.times),
    charge: charge.sort((a, b) => a.charge - b.charge),
    grassSkip: grassSkip.sort((a, b) => a.times - b.times),
    sfrgt: sfrgt.sort((a, b) => a.amount - b.amount),
    tripleLevel: tripleLevel.sort((a, b) => a.level - b.level),
  }
}

export const milestoneDefs = parseMilestones()

export function getGrassHopMilestones(count) {
  return milestoneDefs.grassHop.filter(m => D(count).gte(D(m.times)))
}

export function getChargeMilestones(chargeAmount, hidePost242 = false) {
  return milestoneDefs.charge.filter(m => {
    try {
      if (!(chargeAmount instanceof Decimal) || !chargeAmount.gte(D(m.charge))) return false
      // 1e27及以上需要购买升级242才显示/生效
      if (D(m.charge).gte(D(1e27)) && hidePost242) return false
      return true
    }
    catch (e) { return false }
  })
}

export function isChargeMilestonesUnlocked(areaIndex) {
  if (areaIndex === 1) return getUpgradeLevel(areaIndex, '243') >= 1
  return getUpgradeLevel(areaIndex, '143') >= 1
}

// ============ 里程碑效果 ============
function applyGrassHopEffects(areaIndex) {
  const area = gameState.areas[areaIndex]
  const count = area.milestones.layer3B1
  const countN = area.milestones.layer3B1.toNumber()
  const ms = getGrassHopMilestones(count)
  const eff = { grass: D1, xp: D1, doubleXp: D1, steel: D1, cuprumBase: D0, perkBase: D0, charge: D1, prestige: D1, crystal: D1, antiGrass: D1, antiXp: D1, perk: D1 }
  for (const m of ms) {
    if (m.times === 1) eff.grass = eff.grass.mul(D(4).mul(D(1).add(count)))
    if (m.times === 2) eff.xp = eff.xp.mul(D(1).add(count))
    if (m.times === 3) eff.doubleXp = eff.doubleXp.mul(D(1).add(count))
    if (m.times === 4 || m.times === 5 || m.times === 7) eff.cuprumBase = eff.cuprumBase.add(D1)
    if (m.times === 6) eff.perk = eff.perk.mul(D(1).add(D(0.5).mul(count)))
    if (m.times === 10) eff.steel = eff.steel.mul(D(1).add(D(0.25).mul(count)))
    if (m.times === 12) {
      const bonusHops = Math.max(0, countN - 10)
      eff.charge = eff.charge.mul(D(2).pow(bonusHops))
    }
    if (m.times === 14) {
      const divisor = D(10).pow(count).max(D1)
      eff.charge = eff.charge.mul(D(10).pow(count).div(divisor).max(D1))
    }
    if (m.times === 16) eff.antiGrass = eff.antiGrass.mul(D(1).add(D(0.5).mul(count)))
    if (m.times === 18) eff.antiXp = eff.antiXp.mul(D(1.2).pow(count))
    if (m.times === 30) {
      const bonusHops = Math.max(0, countN - 29)
      eff.charge = eff.charge.mul(D(1.1).pow(bonusHops))
    }
  }
  return eff
}

// 草跳(grassSkip)里程碑效果
function applyGrassSkipEffects(areaIndex) {
  const area = gameState.areas[areaIndex]
  const count = area.milestones.grassSkip || D0
  const countN = count.toNumber()
  const ms = getGrassSkipMilestones(count)
  const eff = { star: D1, tripleXp: D1, a2AutoSpeed: D1, a2AutoMult: D1, cuprumBase: D0, argentumBase: D0, steel: D1, fun: D1, charge: D1 }
  for (const m of ms) {
    if (m.times === 1) eff.star = eff.star.mul(D(1).add(D(0.5).mul(count)))
    if (m.times === 2) eff.tripleXp = eff.tripleXp.mul(D(1).add(count))
    if (m.times === 3) { eff.a2AutoSpeed = eff.a2AutoSpeed.mul(D(2)); eff.a2AutoMult = eff.a2AutoMult.mul(D(2)) }
    if (m.times === 4) eff.cuprumBase = eff.cuprumBase.add(D(10))
    if (m.times === 5) eff.a2AutoSpeed = eff.a2AutoSpeed.mul(D(5))
    if (m.times === 6) eff.argentumBase = eff.argentumBase.add(D1)
    if (m.times === 7) eff.a2AutoMult = eff.a2AutoMult.mul(D(5))
    if (m.times === 12) eff.steel = eff.steel.mul(D(1).add(D(0.25).mul(count)))
    if (m.times === 16) eff.fun = eff.fun.mul(D(1).add(D(0.25).mul(count)))
    if (m.times === 20) {
      const bonus = Math.max(0, Math.floor((countN - 14) / 5))
      eff.argentumBase = eff.argentumBase.add(D(bonus))
    }
    if (m.times === 30) {
      const bonusHops = Math.max(0, countN - 29)
      eff.charge = eff.charge.mul(D(1.075).pow(bonusHops))
    }
  }
  return eff
}

// 获取已达成的草跳里程碑
function getGrassSkipMilestones(count) {
  const thresholds = [1, 2, 3, 4, 5, 6, 7, 8, 12, 16, 20, 30]
  return thresholds.filter(t => count.gte(D(t))).map(t => ({ times: t }))
}

// SFRGT里程碑效果
function applySFRGTEffects(ai) {
  const area = gameState.areas[ai]
  const sfrgtAmount = ensureDec(area.resources['sfrgt'])
  const eff = { charge: D1, antiXp: D1 }
  const ms = milestoneDefs.sfrgt || []
  for (const m of ms) {
    if (sfrgtAmount.gte(D(m.amount))) {
      const bonus = D(1).add(sfrgtAmount).pow(D(0.1))
      if (m.amount === 1) eff.charge = eff.charge.mul(bonus)
      if (m.amount === 1e3) eff.antiXp = eff.antiXp.mul(bonus)
    }
  }
  return eff
}

function applyChargeEffects(areaIndex) {
  const area = gameState.areas[areaIndex]
  if (!isChargeMilestonesUnlocked(areaIndex)) return { steel: D1, xp: D1, doubleXp: D1, grass: D1, prestige: D1, crystal: D1, tripleXp: D1, fun: D1, charge: D1 }
  const chk = charKey(areaIndex)
  const cv = ensureDec(area.resources[chk])
  const hidePost242 = getUpgradeLevel(areaIndex, '242') < 1
  const ms = getChargeMilestones(cv, hidePost242)
  const eff = { steel: D1, xp: D1, doubleXp: D1, grass: D1, prestige: D1, crystal: D1, tripleXp: D1, fun: D1, charge: D1, oil: D1 }
  for (const m of ms) {
    const c = D(m.charge)
    const ratio = cv.div(c).add(D1)
    const bonus = ratio.pow(D(0.2))
    if (c.gte(D(1e33))) eff.fun = eff.fun.mul(bonus)
    else if (c.gte(D(1e30))) eff.tripleXp = eff.tripleXp.mul(bonus)
    else if (c.gte(D(1e27))) eff.oil = eff.oil.mul(bonus)
    else if (c.gte(D(1e15))) eff.crystal = eff.crystal.mul(bonus)
    else if (c.gte(D(1e12))) eff.prestige = eff.prestige.mul(bonus)
    else if (c.gte(D(1e9))) eff.grass = eff.grass.mul(bonus)
    else if (c.gte(D(1e6))) eff.doubleXp = eff.doubleXp.mul(bonus)
    else if (c.gte(D(1e3))) eff.xp = eff.xp.mul(bonus)
    else eff.steel = eff.steel.mul(bonus)
  }
  return eff
}

// 计算每个充能里程碑对资源的乘数（用于显示）
export function getChargeMilestoneEffect(areaIndex, m) {
  const chk = charKey(areaIndex)
  const cv = ensureDec(gameState.areas[areaIndex].resources[chk])
  const c = D(m.charge)
  const ratio = cv.div(c).add(D1)
  const bonus = ratio.pow(D(0.2))
  if (c.gte(D(1e33))) return { resource: '乐趣', multiplier: bonus }
  if (c.gte(D(1e30))) return { resource: '三重经验', multiplier: bonus }
  if (c.gte(D(1e27))) return { resource: '石油', multiplier: bonus }
  if (c.gte(D(1e15))) return { resource: '水晶', multiplier: bonus }
  if (c.gte(D(1e12))) return { resource: '声望点', multiplier: bonus }
  if (c.gte(D(1e9))) return { resource: '草', multiplier: bonus }
  if (c.gte(D(1e6))) return { resource: '二重经验', multiplier: bonus }
  if (c.gte(D(1e3))) return { resource: '经验', multiplier: bonus }
  return { resource: '钢', multiplier: bonus }
}

// 计算每秒获得的充能数量
export function calcChargePerSec(ai) {
  if (!gameState.areas[ai].unlockedFeatures.generators) return D0
  let cg = D1
  cg = cg.mul(D(1).add(D(getUpgradeLevel(ai, '143')).mul(0.1)))
  cg = cg.mul(D(1).add(D(getUpgradeLevel(ai, '144')).mul(0.1)))
  cg = cg.mul(D(2).pow(Math.floor(getUpgradeLevel(ai, '192') / 10)))
  cg = cg.mul(D(2).pow(Math.floor(getUpgradeLevel(ai, '193') / 10)))
  // 草蹦里程碑对充能的加成
  const hopEff = applyGrassHopEffects(ai)
  cg = cg.mul(hopEff.charge)
  // A2反等级加成充能
  if (ai === 0 && gameState.areas[1].level.gt(D0)) {
    const aLv = gameState.areas[1].level
    cg = cg.mul(D(1).add(aLv.div(2))).mul(D(1.04).pow(aLv))
  }
  // A2升级对充能的加成
  if (ai === 0) {
    cg = cg.mul(calcTotalBoost(1, 'charge'))
  }
  return cg
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
    level: D(0),
    xp: D(0),
    doubleUnlocked: false,
    doubleLevel: D(0),
    doubleXp: D(0),
    grassField: { grass: D(0), maxGrass: D(10), grassPerSec: D(1), _frac: D(0), cuprum: D(0), argentum: D(0) },
    resetCounts: { layer1: D(0), layer2: D(0), layer3B1: D(0), layer3B2: D(0), layer3B3: D(0) },
    milestones: { layer3B1: D(0), grassSkip: D(0) },
    unlockedFeatures: { upgrades: false, rares: false, generators: false, layer3B2: false, layer3B3: false },
    autoTimers: { cut: D(0), buy: D(0), resetGain: D(0), crystalGain: D(0) },
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
    upgrades: i === 0 ? parseCSV(B1_UPGRADES_CSV) : {},
    tripleLevel: D(0),
    tripleXp: D(0),
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
  if (lv.lt(D0)) return D0
  return D(100).mul(lv.add(1)).mul(D(1.2).pow(lv))
}

export function doubleXpCost(lv) { return D(100).mul(D(lv).add(1).pow(2)).mul(D(2).pow(lv)) }

// 三重经验需求公式: 100 × (等级^3) × 8^等级
export function tripleXpCost(lv) { return D(100).mul(D(lv).add(1).pow(3)).mul(D(8).pow(lv)) }

// 等级对草的加成
export function xpEffect(ai) {
  const area = gameState.areas[ai]
  if (ai === 0) return D(area.level).add(1).mul(D(1.08).pow(area.level))
  if (ai === 1) return D(1).add(D(area.level)) // 充能
  if (ai === 2) return D(1).add(D(area.level)) // 压缩
  if (ai === 3) return D(1).add(D(area.level)) // 速度
  return D1
}

// 二重等级对草和经验的加成: (doubleLevel+1)×1.2^doubleLevel
export function doubleXpEffect(ai) {
  const area = gameState.areas[ai]
  if (!area.doubleUnlocked || area.doubleLevel.lte(D0) || ai === 1) return D1
  return D(area.doubleLevel).add(1).mul(D(1.2).pow(area.doubleLevel))
}

// 三重等级加成（星星重置1次后解锁）
export function isTripleUnlocked() { return gameState.advancedAreas[0].resetCounts >= 1 }

// 三重等级对草/经验/二重经验的加成: 1.4^三重等级 + 里程碑额外加成
export function tripleLevelEffect(ai) {
  const b1 = gameState.advancedAreas[0]
  if (!isTripleUnlocked() || b1.tripleLevel.lte(D0)) return D1
  return D(1.4).pow(b1.tripleLevel).mul(b1.tripleLevel.add(1))
}

// 三重等级里程碑对特定资源的额外加成
export function tripleLevelMilestoneEffect(resourceKey) {
  const b1 = gameState.advancedAreas[0]
  if (!isTripleUnlocked() || b1.tripleLevel.lte(D0)) return D1
  const tl = b1.tripleLevel.toNumber()
  let eff = D1
  // tripleLevel里程碑
  if (tl >= 2 && resourceKey === 'prestige') eff = eff.mul(D(1.4).pow(b1.tripleLevel))
  if (tl >= 4 && resourceKey === 'crystal') eff = eff.mul(D(1.24).pow(b1.tripleLevel))
  if (tl >= 6 && resourceKey === 'steel') eff = eff.mul(D(1.08).pow(b1.tripleLevel))
  if (tl >= 8 && resourceKey === 'cuprum') eff = eff.mul(D(1).add(b1.tripleLevel))
  return eff
}

// 检查三重等级升级
function checkTripleLevelUp() {
  const b1 = gameState.advancedAreas[0]
  if (!isTripleUnlocked()) return
  while (true) {
    const cost = tripleXpCost(b1.tripleLevel)
    if (ensureDec(b1.tripleXp).gte(cost)) {
      b1.tripleXp = ensureDec(b1.tripleXp).sub(cost)
      b1.tripleLevel = b1.tripleLevel.add(D1)
    } else break
  }
}

// ============ B1升级等级辅助 ============
function getB1UpgradeLevel(id) {
  const b1 = gameState.advancedAreas[0]
  if (!b1.unlocked || !b1.upgrades || !b1.upgrades[id]) return 0
  const lv = b1.upgrades[id].level
  if (lv instanceof Decimal) return lv.toNumber()
  return lv || 0
}

// ============ 升级存取 ============
export function getUpgradeLevel(ai, id) {
  const lv = gameState.areas[ai].upgrades[id]?.level
  if (lv instanceof Decimal) return lv.toNumber()
  return lv || 0
}

// 计算单个升级对特定资源的加成倍数
// 公式: ×(1+等级×addition)×multPer10^floor(等级/10)
export function calcUpgradeMultiplier(ai, id) {
  const def = gameState.areas[ai].upgrades[id]
  if (!def || D(def.level).lte(D0) || !def.boostResource) return D1
  const add = D(1).add(D(def.level).mul(def.addition))
  const mult = D(def.multPer10).pow(D(def.level).div(D(10)).floor())
  return add.mul(mult)
}

// 计算所有升级对特定资源的总加成倍数
export function calcTotalBoost(ai, resourceKey) {
  const area = gameState.areas[ai]
  let total = D1
  for (const id in area.upgrades) {
    const def = area.upgrades[id]
    if (def.boostResource === resourceKey && D(def.level).gt(D0)) {
      total = total.mul(calcUpgradeMultiplier(ai, id))
    }
  }
  // B1升级加成（对所有区域生效）
  const b1 = gameState.advancedAreas[0]
  if (b1.unlocked) {
    for (const id in b1.upgrades) {
      const def = b1.upgrades[id]
      if (def.boostResource === resourceKey && D(def.level).gt(D0)) {
        total = total.mul(calcB1UpgradeMultiplier(id))
      }
    }
  }
  // 草跳里程碑对特定资源的加成
  const hopEff = applyGrassHopEffects(ai)
  if (resourceKey === 'antiGrass' && !hopEff.antiGrass.eq(D1)) total = total.mul(hopEff.antiGrass)
  if (resourceKey === 'antiXp' && !hopEff.antiXp.eq(D1)) total = total.mul(hopEff.antiXp)
  if (resourceKey === 'perk' && !hopEff.perk.eq(D1)) total = total.mul(hopEff.perk)
  // 草跳里程碑加成（A2区域）
  if (ai === 1) {
    const skipEff = applyGrassSkipEffects(1)
    if (resourceKey === 'star' && !skipEff.star.eq(D1)) total = total.mul(skipEff.star)
    if (resourceKey === 'tripleXp' && !skipEff.tripleXp.eq(D1)) total = total.mul(skipEff.tripleXp)
    if (resourceKey === 'steel' && !skipEff.steel.eq(D1)) total = total.mul(skipEff.steel)
    if (resourceKey === 'fun' && !skipEff.fun.eq(D1)) total = total.mul(skipEff.fun)
    if (resourceKey === 'charge' && !skipEff.charge.eq(D1)) total = total.mul(skipEff.charge)
  }
  return total
}

// 计算B1单个升级的加成倍数
function calcB1UpgradeMultiplier(id) {
  const def = gameState.advancedAreas[0].upgrades[id]
  if (!def || D(def.level).lte(D0) || !def.boostResource) return D1
  const add = D(1).add(D(def.level).mul(def.addition))
  const mult = D(def.multPer10).pow(D(def.level).div(D(10)).floor())
  return add.mul(mult)
}

// 获得对特定资源的所有升级加成分解（用于统计面板）
// 返回 [{ source, multiplier }]，source为"XX升级"
export function getUpgradeBoostBreakdown(ai, resourceKey) {
  const area = gameState.areas[ai]
  const result = []
  for (const id in area.upgrades) {
    const def = area.upgrades[id]
    if (def.boostResource === resourceKey && D(def.level).gt(D0)) {
      const cat = getUpgradeCategory(id)
      result.push({ source: cat.name, multiplier: calcUpgradeMultiplier(ai, id) })
    }
  }
  // 合并同source
  const merged = {}
  for (const r of result) {
    if (merged[r.source]) merged[r.source] = merged[r.source].mul(r.multiplier)
    else merged[r.source] = r.multiplier
  }
  return Object.entries(merged).map(([source, multiplier]) => ({ source, multiplier }))
}

// 获得某区域某资源的完整加成分解
// 返回 { total, breakdown: [{ source, multiplier }] }
export function getResourceBoostBreakdown(ai, resourceKey) {
  const area = gameState.areas[ai]
  const breakdown = []

  // 升级加成
  const upgBreakdown = getUpgradeBoostBreakdown(ai, resourceKey)
  for (const b of upgBreakdown) breakdown.push(b)

  // 二重等级加成（对草和经验）
  if ((resourceKey === grassBoostKey(ai) || resourceKey === xpBoostKey(ai)) && area.doubleUnlocked && area.doubleLevel.gt(D0)) {
    const dlMult = D(area.doubleLevel).add(1).mul(D(1.2).pow(area.doubleLevel))
    breakdown.push({ source: '二重等级', multiplier: dlMult })
  }

  // 三重等级加成（对草、经验、二重经验）
  const b1 = gameState.advancedAreas[0]
  if (b1.unlocked && b1.tripleLevel.gt(D0)) {
    const tlEff = tripleLevelEffect(ai)
    const tlMile = tripleLevelMilestoneEffect(resourceKey)
    if ((resourceKey === grassBoostKey(ai) || resourceKey === xpBoostKey(ai) || resourceKey === 'doubleXp') && !tlEff.eq(D1)) {
      breakdown.push({ source: '三重等级', multiplier: tlEff })
    }
    if (!tlMile.eq(D1)) {
      breakdown.push({ source: '三重等级里程碑', multiplier: tlMile })
    }
  }

  // A1等级加成（对草）
  if (ai === 0 && resourceKey === 'grass' && area.level.gt(D0)) {
    const lvMult = D(1).add(area.level).mul(D(1.08).pow(area.level))
    breakdown.push({ source: '等级', multiplier: lvMult })
  }

  // A2反等级加成（对充能）
  if (ai === 0 && resourceKey === 'charge' && gameState.areas[1].level.gt(D0)) {
    const aLv = gameState.areas[1].level
    breakdown.push({ source: '反等级', multiplier: D(1).add(aLv.div(2)).mul(D(1.04).pow(aLv)) })
  }

  // 草蹦里程碑加成
  const hopEff = applyGrassHopEffects(ai)
  const hopMap = {
    grass: hopEff.grass, xp: hopEff.xp, doubleXp: hopEff.doubleXp,
    cuprum: D1.add(hopEff.cuprumBase), prestige: hopEff.prestige, crystal: hopEff.crystal,
    steel: hopEff.steel, perk: hopEff.perk || D1,
    antiGrass: hopEff.antiGrass || D1, antiXp: hopEff.antiXp || D1,
  }
  const hopKey = resourceKey === grassBoostKey(ai) ? 'grass' : resourceKey === xpBoostKey(ai) ? 'xp' : resourceKey
  if (hopKey && hopMap[hopKey] && !hopMap[hopKey].eq(D1)) {
    breakdown.push({ source: ai === 1 ? '草跳里程碑' : '草蹦里程碑', multiplier: hopMap[hopKey] })
  }

  // 充能里程碑加成
  const chEff = applyChargeEffects(ai)
  const chMap = { steel: chEff.steel, xp: chEff.xp, doubleXp: chEff.doubleXp, grass: chEff.grass, prestige: chEff.prestige, crystal: chEff.crystal, tripleXp: chEff.tripleXp, fun: chEff.fun, oil: chEff.oil }
  if (chMap[resourceKey] && !chMap[resourceKey].eq(D1)) {
    breakdown.push({ source: '充能里程碑', multiplier: chMap[resourceKey] })
  }

  // A2升级对A1资源的加成
  if (ai === 0 && gameState.areas[1].unlocked) {
    const a2Boost = calcTotalBoost(1, resourceKey)
    if (!a2Boost.eq(D1)) breakdown.push({ source: 'A2升级', multiplier: a2Boost })
  }

  // 草跳里程碑加成（A2）
  if (ai === 1) {
    const skipEff = applyGrassSkipEffects(1)
    const skipMap = {
      star: skipEff.star, tripleXp: skipEff.tripleXp, cuprum: skipEff.cuprum, argentum: skipEff.argentum,
      steel: skipEff.steel, fun: skipEff.fun, antiGrass: skipEff.antiGrass, antiXp: skipEff.antiXp,
    }
    if (skipMap[resourceKey] && !skipMap[resourceKey].eq(D1)) {
      breakdown.push({ source: '草跳里程碑', multiplier: skipMap[resourceKey] })
    }
  }

  // SFRGT里程碑加成
  if (ai === 1) {
    const sfrgtEff = applySFRGTEffects(ai)
    const sfrgtMap = { charge: sfrgtEff.charge, antiXp: sfrgtEff.antiXp }
    if (sfrgtMap[resourceKey] && !sfrgtMap[resourceKey].eq(D1)) {
      breakdown.push({ source: 'SFRGT里程碑', multiplier: sfrgtMap[resourceKey] })
    }
  }

  // 计算总计
  let total = D1
  for (const b of breakdown) total = total.mul(b.multiplier)

  return { total, breakdown }
}

// 获得某区域所有需要显示加成的资源列表
export function getResourceBreakdownList(ai) {
  const area = gameState.areas[ai]
  const resources = AREA_RESOURCES_LIST[ai]
  const result = []
  // 草/反草
  result.push({ key: grassBoostKey(ai), name: resources[0].name })
  // 经验（特殊）
  result.push({ key: xpBoostKey(ai), name: ai === 0 ? '经验' : '反经验' })
  // 二重经验
  if (area.doubleUnlocked || ai === 0) result.push({ key: 'doubleXp', name: '二重经验' })
  // 三重经验
  if (ai === 0 && b1TripleUnlocked()) result.push({ key: 'tripleXp', name: '三重经验' })
  // 声望/匿名点
  result.push({ key: prestigeBoostKey(ai), name: resources[1].name })
  // 水晶/石油
  result.push({ key: crystalBoostKey(ai), name: resources[2].name })
  // 钢/乐趣
  result.push({ key: ai === 0 ? 'steel' : resources[3].id, name: resources[3].name })
  // 充能/SFRGT
  if (ai === 0 && area.unlockedFeatures.generators) result.push({ key: 'charge', name: '充能' })
  if (ai === 1) result.push({ key: 'sfrgt', name: 'SFRGT' })
  return result
}

function b1TripleUnlocked() {
  return gameState.advancedAreas[0].unlocked && gameState.advancedAreas[0].resetCounts >= 1
}

// ============ 割草收益计算 ============
// 获得区域对应的草和经验boostResource键
function grassBoostKey(ai) { return ai === 0 ? 'grass' : ai === 1 ? 'antiGrass' : ai === 2 ? 'unnaturalGrass' : 'planetoidGrass' }
function xpBoostKey(ai) { return ai === 0 ? 'xp' : ai === 1 ? 'antiXp' : ai === 2 ? 'unnaturalXp' : 'planetoidXp' }

function calcCutGains(areaIndex, cutAmount) {
  const area = gameState.areas[areaIndex]
  // 草收益 - 使用通用升级效果计算
  let gain = calcTotalBoost(areaIndex, grassBoostKey(areaIndex))
  // 二重等级加成: (doubleLevel+1)×1.2^doubleLevel (A2无二重等级)
  if (area.doubleUnlocked && area.doubleLevel.gt(D0) && areaIndex !== 1) gain = gain.mul(D(area.doubleLevel).add(1).mul(D(1.2).pow(area.doubleLevel)))
  // 三重等级加成: 1.4^三重等级
  if (isTripleUnlocked()) gain = gain.mul(tripleLevelEffect(areaIndex))
  gain = gain.mul(tripleLevelMilestoneEffect(grassBoostKey(areaIndex)))
  // 其他特殊加成
  if (areaIndex === 0 && gameState.areas[0].level.gt(D0)) gain = gain.mul(D(1).add(D(gameState.areas[0].level)).mul(D(1.08).pow(D(gameState.areas[0].level))))
  if (gameState.areas[2].level.gt(D0)) gain = gain.mul(D(1).add(D(gameState.areas[2].level).mul(0.05)))
  gain = gain.mul(cutAmount).mul(gameState.gameSpeed)
  const hopEff = applyGrassHopEffects(areaIndex)
  gain = gain.mul(hopEff.grass)
  const chEff = applyChargeEffects(areaIndex)
  gain = gain.mul(chEff.grass)
  // 火箭燃料/部件加成
  gain = gain.mul(fuelPartBoost(areaIndex).grass)
  if (area.milestones.layer3B1.gte(D(12))) {
    gain = gain.mul(D(2).pow(Decimal.min(area.milestones.layer3B1.sub(11), Math.log2(1e6))))
  }
  
  // 经验 - 使用通用升级效果计算
  let xpGain = calcTotalBoost(areaIndex, xpBoostKey(areaIndex))
  // 二重等级加成 (A2无二重等级)
  if (area.doubleUnlocked && area.doubleLevel.gt(D0) && areaIndex !== 1) xpGain = xpGain.mul(D(area.doubleLevel).add(1).mul(D(1.2).pow(area.doubleLevel)))
  // 三重等级加成
  if (isTripleUnlocked()) xpGain = xpGain.mul(tripleLevelEffect(areaIndex))
  xpGain = xpGain.mul(tripleLevelMilestoneEffect(xpBoostKey(areaIndex)))
  xpGain = xpGain.mul(hopEff.xp).mul(chEff.xp).mul(cutAmount).mul(gameState.gameSpeed)
  
  // 二重经验 - A2无二重等级
  let dXp = null
  if (area.doubleUnlocked && areaIndex !== 1) {
    dXp = calcTotalBoost(areaIndex, 'doubleXp')
    dXp = dXp.mul(hopEff.doubleXp).mul(chEff.doubleXp).mul(cutAmount).mul(gameState.gameSpeed)
    if (isTripleUnlocked()) dXp = dXp.mul(tripleLevelEffect(areaIndex))
  }
  // 三重经验
  let tXp = null
  if (isTripleUnlocked()) {
    tXp = calcTotalBoost(areaIndex, 'tripleXp')
    tXp = tXp.mul(cutAmount).mul(gameState.gameSpeed)
  }
  return { gain, xpGain, dXp, tXp }
}

// ============ 铜相关 ============
export function isCuprumUnlocked(ai) { return gameState.areas[ai].resetCounts.layer2.gt(D0) }

// ============ 银相关 ============
export function isArgentumUnlocked(ai) { return gameState.areas[ai].resetCounts.layer2.gt(D0) }

export function argentumMultiplier(ai) {
  const base = D(1).add(applyGrassSkipEffects(ai).argentumBase)
  return base.mul(calcTotalBoost(ai, 'argentum'))
}

// 铜的倍率 = (基础数量+里程碑加成) × calcTotalBoost(ai, 'cuprum')
export function cuprumMultiplier(ai) {
  const base = D(1).add(applyGrassHopEffects(ai).cuprumBase)
  return base.mul(calcTotalBoost(ai, 'cuprum'))
}

// ============ 火箭燃料 & 火箭部件 ============
export function isFuelUnlocked(ai) { return getUpgradeLevel(ai, '146') >= 1 }
export function isPartUnlocked(ai) { return getUpgradeLevel(ai, '147') >= 1 }

// 火箭燃料/部件对草/声望/水晶/钢的加成: (x+1)^0.25 × B19加成
export function fuelPartBoost(ai) {
  if (ai !== 0) return { grass: D1, prestige: D1, crystal: D1, steel: D1 }
  let fuel = ensureDec(gameState.areas[0].resources['fuel']).add(D1).pow(D(0.25))
  let part = ensureDec(gameState.areas[0].resources['part']).add(D1).pow(D(0.25))
  // B19升级对火箭燃料效果的加成
  const b1 = gameState.advancedAreas[0]
  if (b1.unlocked) {
    const b19lv = D(b1.upgrades['B19']?.level || 0)
    if (b19lv.gt(D0)) {
      const b19boost = D(1).add(b19lv.mul(0.25)).mul(D(1.15).pow(b19lv.div(10).floor()))
      fuel = fuel.pow(b19boost)
      part = part.pow(b19boost)
    }
  }
  return { grass: fuel.mul(part), prestige: fuel.mul(part), crystal: fuel.mul(part), steel: fuel.mul(part) }
}

// 合成火箭燃料：消耗充能和石油
export function synthesizeFuel(ai, amount) {
  const area = gameState.areas[ai]
  if (!isFuelUnlocked(ai)) return
  const chk = charKey(ai)
  const oilKey = 'oil' // 石油在A2区域
  const a2 = gameState.areas[1]
  const charge = ensureDec(area.resources[chk])
  const oil = ensureDec(a2.resources[oilKey])
  // 每个燃料需要 1e6 充能 + 1e3 石油
  const costCharge = D(1e6).mul(amount)
  const costOil = D(1e3).mul(amount)
  if (charge.gte(costCharge) && oil.gte(costOil)) {
    area.resources[chk] = charge.sub(costCharge)
    a2.resources[oilKey] = oil.sub(costOil)
    area.resources['fuel'] = ensureDec(area.resources['fuel']).add(amount)
  }
}

// 合成火箭部件：消耗火箭燃料和钢
export function synthesizePart(ai, amount) {
  const area = gameState.areas[ai]
  if (!isPartUnlocked(ai)) return
  const fuel = ensureDec(area.resources['fuel'])
  const steel = ensureDec(area.resources[steeKey(ai)])
  // 每个部件需要 1e3 火箭燃料 + 1e6 钢
  const costFuel = D(1e3).mul(amount)
  const costSteel = D(1e6).mul(amount)
  if (fuel.gte(costFuel) && steel.gte(costSteel)) {
    area.resources['fuel'] = fuel.sub(costFuel)
    area.resources[steeKey(ai)] = steel.sub(costSteel)
    area.resources['part'] = ensureDec(area.resources['part']).add(amount)
  }
}

// 计算最大可合成燃料数量
export function maxFuelSynth(ai) {
  if (!isFuelUnlocked(ai)) return D0
  const area = gameState.areas[ai]
  const a2 = gameState.areas[1]
  const charge = ensureDec(area.resources[charKey(ai)])
  const oil = ensureDec(a2.resources['oil'])
  return Decimal.min(charge.div(1e6), oil.div(1e3)).floor().max(D0)
}

// 计算最大可合成部件数量
export function maxPartSynth(ai) {
  if (!isPartUnlocked(ai)) return D0
  const area = gameState.areas[ai]
  const fuel = ensureDec(area.resources['fuel'])
  const steel = ensureDec(area.resources[steeKey(ai)])
  return Decimal.min(fuel.div(1e3), steel.div(1e6)).floor().max(D0)
}

// ============ 割草 ============
export function cutGrass(areaIndex) {
  const area = gameState.areas[areaIndex]
  if (!area || !area.unlocked) return
  area.grassField.grass = area.grassField.grass.floor().max(D0)
  area.grassField.cuprum = (area.grassField.cuprum || D0).floor().max(D0)
  area.grassField.argentum = (area.grassField.argentum || D0).floor().max(D0)
  if (area.grassField.grass.lt(D1) && area.grassField.cuprum.lt(D1) && area.grassField.argentum.lt(D1)) return

  const cutAmount = (1 + getUpgradeLevel(areaIndex, '115')) * (1 + getUpgradeLevel(areaIndex, '152'))
  const totalOnField = area.grassField.grass.add(area.grassField.cuprum).add(area.grassField.argentum)
  const actualCut = Decimal.min(cutAmount, totalOnField)

  // 优先切割银，然后铜
  let argentumCut = D0, cuprumCut = D0, grassCut = D0
  let remaining = actualCut
  if (area.grassField.argentum.gt(D0) && isArgentumUnlocked(areaIndex)) {
    argentumCut = Decimal.min(remaining, area.grassField.argentum)
    remaining = remaining.sub(argentumCut)
  }
  if (area.grassField.cuprum.gt(D0) && isCuprumUnlocked(areaIndex) && remaining.gt(D0)) {
    cuprumCut = Decimal.min(remaining, area.grassField.cuprum)
    remaining = remaining.sub(cuprumCut)
  }
  grassCut = remaining
  area.grassField.argentum = area.grassField.argentum.sub(argentumCut)
  area.grassField.cuprum = area.grassField.cuprum.sub(cuprumCut)
  area.grassField.grass = area.grassField.grass.sub(grassCut)

  // 草收益
  if (grassCut.gt(D0)) {
    const { gain, xpGain, dXp, tXp } = calcCutGains(areaIndex, grassCut)
    const gk = grassKey(areaIndex)
    area.resources[gk] = ensureDec(area.resources[gk]).add(gain)
    if (areaIndex === 0) gameState.totalGrassCut = gameState.totalGrassCut.add(gain)
    area.xp = ensureDec(area.xp).add(xpGain)
    if (areaIndex === 0) gameState.totalXpEarned = gameState.totalXpEarned.add(xpGain)
    if (dXp) area.doubleXp = ensureDec(area.doubleXp).add(dXp)
    if (tXp) gameState.advancedAreas[0].tripleXp = ensureDec(gameState.advancedAreas[0].tripleXp).add(tXp)
  }

  // 铜收益：切割的铜数量 × 倍率
  if (cuprumCut.gt(D0)) {
    const cm = cuprumMultiplier(areaIndex)
    const cuprumGain = D(cuprumCut).mul(cm)
    const cuk = AREA_RESOURCES_LIST[areaIndex].find(r => r.id === 'cuprum')?.id
    if (cuk) area.resources[cuk] = ensureDec(area.resources[cuk]).add(cuprumGain)
    const { xpGain, dXp, tXp } = calcCutGains(areaIndex, cuprumCut)
    area.xp = ensureDec(area.xp).add(xpGain)
    if (dXp) area.doubleXp = ensureDec(area.doubleXp).add(dXp)
    if (tXp) gameState.advancedAreas[0].tripleXp = ensureDec(gameState.advancedAreas[0].tripleXp).add(tXp)
  }

  // 银收益：切割的银数量 × 倍率
  if (argentumCut.gt(D0)) {
    const am = argentumMultiplier(areaIndex)
    const argentumGain = D(argentumCut).mul(am)
    area.resources['argentum'] = ensureDec(area.resources['argentum']).add(argentumGain)
    const { xpGain, dXp, tXp } = calcCutGains(areaIndex, argentumCut)
    area.xp = ensureDec(area.xp).add(xpGain)
    if (dXp) area.doubleXp = ensureDec(area.doubleXp).add(dXp)
    if (tXp) gameState.advancedAreas[0].tripleXp = ensureDec(gameState.advancedAreas[0].tripleXp).add(tXp)
  }

  checkLevelUp(areaIndex)
  if (area.unlockedFeatures.rares) rollRareItems(areaIndex)
}

function checkLevelUp(areaIndex) {
  const area = gameState.areas[areaIndex]
  while (true) {
    const needed = xpForLevelUp(area.level)
    if (ensureDec(area.xp).gte(needed)) {
      area.xp = ensureDec(area.xp).sub(needed)
      area.level = area.level.add(D1)
      area.resources[perkKey(areaIndex)] = ensureDec(area.resources[perkKey(areaIndex)]).add(D1)
      checkUnlocks(areaIndex)
    } else break
  }
  checkDoubleLevelUp(areaIndex)
}

function checkDoubleLevelUp(areaIndex) {
  const area = gameState.areas[areaIndex]
  if (!area.doubleUnlocked || areaIndex === 1) return // A2无二重等级
  while (true) {
    const cost = doubleXpCost(area.doubleLevel)
    if (ensureDec(area.doubleXp).gte(cost)) {
      area.doubleXp = ensureDec(area.doubleXp).sub(cost)
      area.doubleLevel = area.doubleLevel.add(D1)
    } else break
  }
}

function checkUnlocks(areaIndex) {
  const area = gameState.areas[areaIndex]
  if (area.level.gte(D(30)) && !area.unlockedFeatures.upgrades) {
    area.unlockedFeatures.upgrades = true
    addNotification(`${AREA_FULL_NAMES[areaIndex]}: 升级物品已解锁`)
  }
  if (area.level.gte(D(30)) && !area.doubleUnlocked) {
    area.doubleUnlocked = true
    addNotification(`${AREA_FULL_NAMES[areaIndex]}: 二重经验系统永久解锁`)
  }
  if (area.level.gte(D(100)) && !area.unlockedFeatures.rares) {
    area.unlockedFeatures.rares = true
    addNotification(`${AREA_FULL_NAMES[areaIndex]}: 稀有物品已解锁`)
  }
  if (area.milestones.layer3B1.gte(D(8)) && !area.unlockedFeatures.layer3B2) {
    area.unlockedFeatures.layer3B2 = true
    addNotification(`${AREA_FULL_NAMES[areaIndex]}: 钢化已解锁`)
  }
  if (getUpgradeLevel(areaIndex, '145') >= 1 && areaIndex < 3 && !gameState.areas[areaIndex + 1].unlocked) {
    gameState.areas[areaIndex + 1].unlocked = true
    addNotification(`${AREA_FULL_NAMES[areaIndex + 1]} 已解锁`)
  }
  // 245解锁A3区域（A2的升级）
  if (getUpgradeLevel(1, '245') >= 1 && !gameState.areas[2].unlocked) {
    gameState.areas[2].unlocked = true
    addNotification(`${AREA_FULL_NAMES[2]} 已解锁`)
  }
  // 246解锁B2区域
  if (getUpgradeLevel(1, '246') >= 1 && !gameState.advancedAreas[1].unlocked) {
    gameState.advancedAreas[1].unlocked = true
    addNotification(`B2 (${ADVANCED_AREAS[1].name}) 已解锁`)
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

// ============ 重置收益计算 ============
// 获得区域对应的声望和结晶boostResource键
function prestigeBoostKey(ai) { return ai === 0 ? 'prestige' : ai === 1 ? 'anonymousPoint' : ai === 2 ? 'normalityPoint' : 'quadrantPoint' }
function crystalBoostKey(ai) { return ai === 0 ? 'crystal' : ai === 1 ? 'oil' : ai === 2 ? 'cloud' : 'plasma' }

export function calcPrestigeGain(ai) {
  const area = gameState.areas[ai]
  const gk = grassKey(ai)
  const grass = ensureDec(area.resources[gk])
  let gain = Decimal.pow(2, area.level-30).mul(grass).pow(0.05).mul(9)
  gain = gain.mul(calcTotalBoost(ai, prestigeBoostKey(ai)))
  gain = gain.mul(fuelPartBoost(ai).prestige)
  return gain.floor().max(D1)
}

export function calcCrystalGain(ai) {
  const area = gameState.areas[ai]
  const gk = grassKey(ai)
  const grass = ensureDec(area.resources[gk])
  let gain = Decimal.pow(2, area.level-100).mul(grass).pow(0.03).mul(3)
  gain = gain.mul(calcTotalBoost(ai, crystalBoostKey(ai)))
  gain = gain.mul(fuelPartBoost(ai).crystal)
  return gain.floor().max(D1)
}

export function calcSteelGain(ai) {
  const area = gameState.areas[ai]
  const gk = grassKey(ai)
  const grass = ensureDec(area.resources[gk])
  let gain = Decimal.pow(2, area.level-270).mul(grass).pow(0.01)
  // 181~184: ×(1+0.1×(1+0.1×141等级)×181~184等级)
  const u141 = getUpgradeLevel(ai, '141')
  const boost141 = D(1).add(D(u141).mul(0.1))
  for (const id of ['181', '182', '183', '184']) {
    const lv = getUpgradeLevel(ai, id)
    if (lv > 0) gain = gain.mul(D(1).add(D(0.1).mul(boost141).mul(lv)))
  }
  gain = gain.mul(calcTotalBoost(ai, 'steel'))
  gain = gain.mul(fuelPartBoost(ai).steel)
  // 511: 每级使钢的获得数量×2
  const b1 = gameState.advancedAreas[0]
  if (b1.unlocked) {
    const u511 = getB1UpgradeLevel('511')
    if (u511 > 0) gain = gain.mul(D(2).pow(u511))
  }
  return gain.floor().max(D1)
}

// ============ 星星重置 ============
export function isStarResetUnlocked() { return getUpgradeLevel(0, '148') >= 1 }

export function calcStarGain() {
  if (!isStarResetUnlocked()) return D0
  const a1 = gameState.areas[0]
  const steel = ensureDec(a1.resources['steel'])
  // 星星 = max(10, 钢^(1/20)) × 星星获取数量加成
  let base = Decimal.max(D(10), steel.pow(D(1).div(20)))
  base = base.mul(calcTotalBoost(0, 'star'))
  // 草跳里程碑对星星的加成
  const skipEff = applyGrassSkipEffects(1)
  base = base.mul(skipEff.star)
  // 火箭燃料/部件加成
  base = base.mul(fuelPartBoost(0).steel)
  return base.floor().max(D1)
}

export function doStarReset() {
  if (!isStarResetUnlocked()) return
  const gain = calcStarGain()
  if (gain.lte(D0)) return
  // 5A1: 星星重置时保留A1区域前2x个自动化升级
  const u5A1 = getB1UpgradeLevel('5A1')
  let savedAutoLevels = null
  if (u5A1 > 0) {
    const keepCount = 2 * u5A1
    const autoUpgIds = Object.keys(gameState.areas[0].upgrades).filter(id => id.startsWith('1A')).sort()
    savedAutoLevels = {}
    for (let i = 0; i < Math.min(keepCount, autoUpgIds.length); i++) {
      savedAutoLevels[autoUpgIds[i]] = D(gameState.areas[0].upgrades[autoUpgIds[i]].level)
    }
  }
  // 增加星星
  gameState.advancedAreas[0].resource = ensureDec(gameState.advancedAreas[0].resource).add(gain)
  gameState.advancedAreas[0].resetCounts++
  // 重置A1全部内容
  fullResetArea(0)
  // 恢复5A1保留的自动化升级
  if (savedAutoLevels) {
    for (const id in savedAutoLevels) {
      if (gameState.areas[0].upgrades[id]) {
        gameState.areas[0].upgrades[id].level = savedAutoLevels[id]
      }
    }
  }
  // 重置A2液化及以前的内容
  const a2 = gameState.areas[1]
  if (a2.unlocked) {
    a2.level = D(0); a2.xp = D(0)
    a2.doubleLevel = D(0); a2.doubleXp = D(0)
    a2.grassField.grass = D(0); a2.grassField.cuprum = D(0); a2.grassField.argentum = D(0); a2.grassField._frac = D(0)
    // 重置A2的反草、匿名点、石油、反级点
    a2.resources['antiGrass'] = D(0)
    a2.resources['anonymousPoint'] = D(0)
    a2.resources['oil'] = D(0)
    a2.resources['antiPerk'] = D(0)
    // 重置A2的草跳次数
    a2.milestones.grassSkip = D(0)
    // 重置A2的升级21x、22x、23x、25x
    for (const prefix of ['21', '22', '23', '25']) {
      for (const id of Object.keys(a2.upgrades).filter(id => id.startsWith(prefix))) a2.upgrades[id].level = D(0)
    }
  }
  // 解锁B1
  gameState.advancedAreas[0].unlocked = true
  addNotification('✨ 星星重置完成！获得' + fmt(gain) + '星星')
}

// ============ 声望/匿名重置 ============
export function doLayer1Reset(areaIndex) {
  const area = gameState.areas[areaIndex]
  if (area.level.lt(D(30))) return
  const gk = grassKey(areaIndex); const pk = prestKey(areaIndex)
  const gain = calcPrestigeGain(areaIndex)
  area.resources[pk] = ensureDec(area.resources[pk]).add(gain)
  area.resetCounts.layer1 = area.resetCounts.layer1.add(D1)
  addNotification(`${AREA_FULL_NAMES[areaIndex]}: ${RESET_NAMES[areaIndex].layer1} ×${fmt(area.resetCounts.layer1)} 获得 ${fmt(gain)}`)

  if (areaIndex === 1) {
    // A2匿名重置：重置反草 + 升级21x
    area.resources[gk] = D(0)
    for (const id of Object.keys(area.upgrades).filter(id => id.startsWith('21'))) area.upgrades[id].level = D(0)
  } else {
    area.resources[gk] = D(0)
    for (const id of ['111', '112', '113', '114', '115', '116']) area.upgrades[id].level = D(0)
  }
  // 重置级点和级点升级（除非购买了1A4/2A4）
  const preservePerk = areaIndex === 0 ? getUpgradeLevel(areaIndex, '1A4') > 0
    : areaIndex === 1 ? getUpgradeLevel(areaIndex, '2A4') > 0
    : getUpgradeLevel(areaIndex, '1A4') > 0
  if (!preservePerk) {
    area.resources[perkKey(areaIndex)] = D(0)
    const perkPrefix = areaIndex === 1 ? '25' : '15'
    for (const id of Object.keys(area.upgrades).filter(id => id.startsWith(perkPrefix))) area.upgrades[id].level = D(0)
  }
  area.xp = D(0); area.level = D(0); area.doubleXp = D(0); area.doubleLevel = D(0)
}

// ============ 结晶/液化重置 ============
export function doLayer2Reset(areaIndex) {
  const area = gameState.areas[areaIndex]
  if (area.level.lt(D(100))) return
  const gk = grassKey(areaIndex); const pk = prestKey(areaIndex); const ck = crystKey(areaIndex)
  const gain = calcCrystalGain(areaIndex)
  area.resources[ck] = ensureDec(area.resources[ck]).add(gain)
  area.resetCounts.layer2 = area.resetCounts.layer2.add(D1)

  if (areaIndex === 1) {
    // A2液化重置：重置反草、匿名点 + 升级21x、22x
    area.resources[gk] = D(0); area.resources[pk] = D(0)
    for (const prefix of ['21', '22']) {
      for (const id of Object.keys(area.upgrades).filter(id => id.startsWith(prefix))) area.upgrades[id].level = D(0)
    }
  } else {
    area.resources[gk] = D(0); area.resources[pk] = D(0)
    for (const id of ['111', '112', '113', '114', '115', '116', '121', '122', '123', '124']) area.upgrades[id].level = D(0)
  }
  // 重置级点和级点升级（除非购买了1A8/2A7）
  const preservePerk = areaIndex === 0 ? getUpgradeLevel(areaIndex, '1A8') > 0
    : areaIndex === 1 ? getUpgradeLevel(areaIndex, '2A7') > 0
    : getUpgradeLevel(areaIndex, '1A8') > 0
  if (!preservePerk) {
    area.resources[perkKey(areaIndex)] = D(0)
    const perkPrefix = areaIndex === 1 ? '25' : '15'
    for (const id of Object.keys(area.upgrades).filter(id => id.startsWith(perkPrefix))) area.upgrades[id].level = D(0)
  }
  area.xp = D(0); area.level = D(0); area.doubleXp = D(0); area.doubleLevel = D(0)
  addNotification(`${AREA_FULL_NAMES[areaIndex]}: ${RESET_NAMES[areaIndex].layer2} ×${fmt(area.resetCounts.layer2)} 获得 ${fmt(gain)}`)
}

// ============ 草蹦重置 ============
export function getLayer3B1RequiredLevel(areaIndex) {
  const hopCount = areaIndex === 1 ? gameState.areas[areaIndex].milestones.grassSkip : gameState.areas[areaIndex].milestones.layer3B1
  return D(200).add(D(10).mul(ensureDec(hopCount)))
}

export function doLayer3Branch1Reset(areaIndex) {
  const area = gameState.areas[areaIndex]
  if (area.level.lt(getLayer3B1RequiredLevel(areaIndex))) return
  const gk = grassKey(areaIndex); const pk = prestKey(areaIndex)
  const ck = crystKey(areaIndex)

  // 草蹦/草跳重置获得1次次数
  let hopCount = D1
  if (areaIndex === 0 && gameState.advancedAreas[0].unlocked) {
    const u5A3 = getB1UpgradeLevel('5A3')
    if (u5A3 > 0) hopCount = D(u5A3)
  }
  if (areaIndex === 1) {
    area.milestones.grassSkip = ensureDec(area.milestones.grassSkip).add(hopCount)
  } else {
    area.milestones.layer3B1 = area.milestones.layer3B1.add(hopCount)
  }

  if (areaIndex === 1) {
    // A2草跳：重置反草、匿名点、石油、升级21x/22x/23x
    area.resources['antiGrass'] = D(0)
    area.resources['anonymousPoint'] = D(0)
    area.resources['oil'] = D(0)
    for (const prefix of ['21', '22', '23']) {
      for (const id of Object.keys(area.upgrades).filter(id => id.startsWith(prefix))) area.upgrades[id].level = D(0)
    }
  } else {
    area.resources[gk] = D(0); area.resources[pk] = D(0); area.resources[ck] = D(0)
    for (const id of ['111', '112', '113', '114', '115', '116', '121', '122', '123', '124', '131', '132', '133', '134']) area.upgrades[id].level = D(0)
  }
  // 重置级点和级点升级（除非购买了1AE=草蹦不再重置级点和级点升级，或A2的2AC）
  const preservePerk = areaIndex === 0 ? getUpgradeLevel(areaIndex, '1AE') > 0
    : areaIndex === 1 ? getUpgradeLevel(areaIndex, '2AC') > 0
    : getUpgradeLevel(areaIndex, '1AE') > 0
  if (!preservePerk) {
    area.resources[perkKey(areaIndex)] = D(0)
    const perkPrefix = areaIndex === 1 ? '25' : '15'
    for (const id of Object.keys(area.upgrades).filter(id => id.startsWith(perkPrefix))) area.upgrades[id].level = D(0)
  }
  area.xp = D(0); area.level = D(0); area.doubleXp = D(0); area.doubleLevel = D(0)
  addNotification(`${AREA_FULL_NAMES[areaIndex]}: 草蹦 #${fmt(area.milestones.layer3B1)} 获得1次草蹦次数`)
}

// ============ 钢化/趣化重置 ============
function calcFunGain(ai) {
  const area = gameState.areas[ai]
  const gk = grassKey(ai)
  const grass = ensureDec(area.resources[gk])
  let gain = Decimal.pow(2, area.level.sub(270)).mul(grass).pow(0.01)
  gain = gain.mul(calcTotalBoost(ai, 'fun'))
  return gain.floor().max(D1)
}

export function doLayer3Branch2Reset(areaIndex) {
  const area = gameState.areas[areaIndex]
  if (!area.unlockedFeatures.layer3B2 || area.level.lt(D(270))) return
  const gk = grassKey(areaIndex); const pk = prestKey(areaIndex)
  const ck = crystKey(areaIndex); const sk = steeKey(areaIndex); const chk = charKey(areaIndex)

  const gain = areaIndex === 1 ? calcFunGain(areaIndex) : calcSteelGain(areaIndex)
  area.resources[sk] = ensureDec(area.resources[sk]).add(gain)
  area.resources[chk] = ensureDec(area.resources[chk]).add(gain.div(2).max(D1))
  area.resetCounts.layer3B2 = area.resetCounts.layer3B2.add(D1)

  area.resources[gk] = D(0); area.resources[pk] = D(0); area.resources[ck] = D(0)
  if (areaIndex === 0) {
    for (const id of ['111', '112', '113', '114', '115', '116', '121', '122', '123', '124', '131', '132', '133', '134']) area.upgrades[id].level = D(0)
  } else if (areaIndex === 1) {
    // A2趣化：重置反草、匿名点、石油 + 升级21x、22x、23x
    area.resources['antiGrass'] = D(0); area.resources['anonymousPoint'] = D(0); area.resources['oil'] = D(0)
    for (const prefix of ['21', '22', '23']) {
      for (const id of Object.keys(area.upgrades).filter(id => id.startsWith(prefix))) area.upgrades[id].level = D(0)
    }
  }
  // 重置级点和级点升级（钢化/趣化始终重置）
  area.resources[perkKey(areaIndex)] = D(0)
  const perkPrefix = areaIndex === 1 ? '25' : '15'
  for (const id of Object.keys(area.upgrades).filter(id => id.startsWith(perkPrefix))) area.upgrades[id].level = D(0)
  area.xp = D(0); area.level = D(0)
  addNotification(`${AREA_FULL_NAMES[areaIndex]}: ${RESET_NAMES[areaIndex].layer3B2}完成`)
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

// ============ B1升级购买 ============
export function buyB1Upgrade(upgradeId) {
  const b1 = gameState.advancedAreas[0]
  if (!b1.unlocked) return
  const def = b1.upgrades[upgradeId]
  if (!def) return
  const cap = (def.cap === null || def.cap === undefined) ? Infinity : def.cap
  if (D(def.level).gte(cap)) return
  const cost = calcUpgradeCost(def)
  if (ensureDec(b1.resource).gte(cost)) {
    b1.resource = ensureDec(b1.resource).sub(cost)
    def.level = D(def.level).add(D1)
  }
}

export function canAffordB1Upgrade(id) {
  const b1 = gameState.advancedAreas[0]
  if (!b1.unlocked) return false
  const def = b1.upgrades[id]
  if (!def) return false
  const cap = (def.cap === null || def.cap === undefined) ? Infinity : def.cap
  if (D(def.level).gte(cap)) return false
  return ensureDec(b1.resource).gte(calcUpgradeCost(def))
}

// ============ 升级购买 ============
export function buyUpgrade(areaIndex, upgradeId) {
  const area = gameState.areas[areaIndex]
  const def = area.upgrades[upgradeId]
  if (!def) return
  if (!isUpgradeUnlocked(areaIndex, upgradeId)) return
  // 防御：上限为 null/undefined 视为无上限
  const cap = (def.cap === null || def.cap === undefined) ? Infinity : def.cap
  if (D(def.level).gte(cap)) return

  const cost = calcUpgradeCost(def)
  const resKey = def.buyResource
  const res = ensureDec(area.resources[resKey])
  if (!res) return

  if (res.gte(cost)) {
    area.resources[resKey] = res.sub(cost)
    def.level = D(def.level).add(D1)
    if (upgradeId === '143') gameState.areas[areaIndex].unlockedFeatures.generators = true
    if (upgradeId === '142') gameState.areas[areaIndex].unlockedFeatures.autoGain = true
    checkUnlocks(areaIndex)
  }
}

// 计算购买多级升级的总花费
export function calcUpgradeTotalCost(def, count) {
  let total = D(0)
  const startLv = D(def.level)
  for (let i = 0; i < count; i++) {
    const lv = startLv.add(D(i))
    const cap = (def.cap === null || def.cap === undefined) ? Infinity : def.cap
    if (lv.gte(cap)) break
    if (lv.lte(1000)) {
      total = total.add(D(def.baseCost).mul(D(def.costScaling).pow(lv)))
    } else {
      const exp = D(1000).mul(lv.div(1000).pow(2))
      total = total.add(D(def.baseCost).mul(D(def.costScaling).pow(exp)))
    }
  }
  return total
}

// 购买多级升级
export function buyUpgradeMultiple(areaIndex, upgradeId, count) {
  const area = gameState.areas[areaIndex]
  const def = area.upgrades[upgradeId]
  if (!def) return
  if (!isUpgradeUnlocked(areaIndex, upgradeId)) return
  const cap = (def.cap === null || def.cap === undefined) ? Infinity : def.cap
  
  const totalCost = calcUpgradeTotalCost(def, count)
  const resKey = def.buyResource
  const res = ensureDec(area.resources[resKey])
  if (!res) return

  if (res.gte(totalCost)) {
    area.resources[resKey] = res.sub(totalCost)
    const maxBuy = Decimal.min(count, D(cap).sub(D(def.level)))
    def.level = D(def.level).add(maxBuy)
    if (upgradeId === '143') gameState.areas[areaIndex].unlockedFeatures.generators = true
    if (upgradeId === '142') gameState.areas[areaIndex].unlockedFeatures.autoGain = true
    checkUnlocks(areaIndex)
  }
}

export function canAffordUpgrade(ai, id) {
  try {
    const a = gameState.areas[ai]; const def = a.upgrades[id]
    if (!def) return false
    if (!isUpgradeUnlocked(ai, id)) return false
    const cap = (def.cap === null || def.cap === undefined) ? Infinity : def.cap
    if (D(def.level).gte(cap)) return false
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

    // 草场上限和生长速度升级ID（按区域）
    const capUpgId = ai === 0 ? '112' : ai === 1 ? '213' : ai === 2 ? '312' : '412'
    const speedUpgId = ai === 0 ? '113' : ai === 1 ? '215' : ai === 2 ? '313' : '413'
    const capLevel = getUpgradeLevel(ai, capUpgId)
    const speedLevel = getUpgradeLevel(ai, speedUpgId)

    area.grassField.maxGrass = D(10).add(D(capLevel))
    // 521: A1区域草的上限增加100/级
    if (ai === 0 && gameState.advancedAreas[0].unlocked) {
      const u521 = getB1UpgradeLevel('521')
      if (u521 > 0) area.grassField.maxGrass = area.grassField.maxGrass.add(D(100).mul(u521))
    }

    let gm = D1.add(D(speedLevel).mul(0.1))
    const gpt = area.grassField.grassPerSec.mul(gm).mul(tm).div(1000 / gameState.tickSpeed)
    area.grassField._frac = ensureDec(area.grassField._frac).add(gpt)
    const whole = area.grassField._frac.floor()
    if (whole.gt(D0)) {
      area.grassField._frac = area.grassField._frac.sub(whole)
      const atCap = area.grassField.grass.gte(area.grassField.maxGrass)
      if (atCap) {
        // 草场已满，不再生长任何东西
        area.grassField._frac = D0
      } else if (isCuprumUnlocked(ai)) {
        // 铜生成：每生长出1个草有1%概率变成铜
        // 银生成：每生长出1个铜有1%概率变成银（液化后解锁）
        let cuprumGrow = 0, argentumGrow = 0
        const wholeN = whole.toNumber()
        for (let i = 0; i < wholeN; i++) {
          if (Math.random() < 0.01) {
            if (isArgentumUnlocked(ai) && Math.random() < 0.01) argentumGrow++
            else cuprumGrow++
          }
        }
        const grassGrow = wholeN - cuprumGrow - argentumGrow
        area.grassField.cuprum = Decimal.min(area.grassField.maxGrass, (area.grassField.cuprum || D0).floor().add(D(cuprumGrow)))
        area.grassField.argentum = Decimal.min(area.grassField.maxGrass, (area.grassField.argentum || D0).floor().add(D(argentumGrow)))
        area.grassField.grass = Decimal.min(area.grassField.maxGrass, area.grassField.grass.floor().add(D(grassGrow)))
      } else {
        area.grassField.grass = Decimal.min(area.grassField.maxGrass, area.grassField.grass.floor().add(whole))
      }
    }

    if (area.unlockedFeatures.generators) {
      let cg = D1
      cg = cg.mul(D(1).add(D(getUpgradeLevel(ai, '143')).mul(0.1)))
      cg = cg.mul(D(1).add(D(getUpgradeLevel(ai, '144')).mul(0.1)))
      cg = cg.mul(D(2).pow(Math.floor(getUpgradeLevel(ai, '192') / 10)))
      cg = cg.mul(D(2).pow(Math.floor(getUpgradeLevel(ai, '193') / 10)))
      // 草蹦里程碑对充能的加成
      const hopEff = applyGrassHopEffects(ai)
      cg = cg.mul(hopEff.charge)
      // A2反等级加成充能: ×(1+反等级/2)×1.05^反等级
      if (ai === 0 && gameState.areas[1].level.gt(D0)) {
        const aLv = gameState.areas[1].level
        cg = cg.mul(D(1).add(aLv.div(2))).mul(D(1.05).pow(aLv))
      }
      // A2升级对充能的加成（212, 222）
      if (ai === 0) {
        cg = cg.mul(calcTotalBoost(1, 'charge'))
      }
      cg = cg.mul(tm).div(1000 / gameState.tickSpeed)
      area.resources[charKey(ai)] = ensureDec(area.resources[charKey(ai)]).add(cg)
    }

    autoTick(ai, tm)
  }

  // 三重等级升级检查
  checkTripleLevelUp()

  if (gameState.areas[3].level.gt(D0)) gameState.gameSpeed = D1.add(D(gameState.areas[3].level).mul(0.02))
  else gameState.gameSpeed = D1

  gameState.totalTicks++
  tick.value++
}

function autoTick(ai, tm) {
  const area = gameState.areas[ai]
  const pk = prestKey(ai); const ck = crystKey(ai)

  if (ai === 0) {
    // ===== A1区域自动化 =====
    // 自动割草
    const al = getUpgradeLevel(ai, '1A1')
    if (al > 0) {
      area.autoTimers.cut = ensureDec(area.autoTimers.cut).add(D(tm))
      const a7Level = getUpgradeLevel(ai, '1A7')
      let baseIvSec = Math.max(0.1, 5 - (al - 1) - a7Level * 0.1)
      // 523: A1区域自动割草速度增加100%/级
      const u523 = getB1UpgradeLevel('523')
      if (u523 > 0) baseIvSec = baseIvSec / (1 + u523)
      const ivTicks = D(Math.max(2, baseIvSec * 1000 / gameState.tickSpeed))
      while (ensureDec(area.autoTimers.cut).gte(ivTicks)) {
        area.autoTimers.cut = ensureDec(area.autoTimers.cut).sub(ivTicks)
        const { gain, xpGain, dXp, tXp } = calcCutGains(ai, 1)
        let a3Mult = D(1).add(D(getUpgradeLevel(ai, '1A3')))
        // 522: A1区域自动割草获得的资源数量增加100%/级
        const u522 = getB1UpgradeLevel('522')
        if (u522 > 0) a3Mult = a3Mult.mul(D(1).add(D(u522)))
        const gk = grassKey(ai)
        area.resources[gk] = ensureDec(area.resources[gk]).add(gain.mul(a3Mult))
        gameState.totalGrassCut = gameState.totalGrassCut.add(gain.mul(a3Mult))
        area.xp = ensureDec(area.xp).add(xpGain.mul(a3Mult))
        gameState.totalXpEarned = gameState.totalXpEarned.add(xpGain.mul(a3Mult))
        if (dXp) area.doubleXp = ensureDec(area.doubleXp).add(dXp.mul(a3Mult))
        if (tXp) gameState.advancedAreas[0].tripleXp = ensureDec(gameState.advancedAreas[0].tripleXp).add(tXp.mul(a3Mult))
        checkLevelUp(ai)
        if (area.unlockedFeatures && area.unlockedFeatures.rares) rollRareItems(ai)
      }
    }

    // 自动购买
    if (getUpgradeLevel(ai, '1A2') > 0) autoBuy(ai, '11')
    if (getUpgradeLevel(ai, '1A6') > 0) autoBuy(ai, '12')
    if (getUpgradeLevel(ai, '1AA') > 0) autoBuy(ai, '13')

    // 自动声望
    if (getUpgradeLevel(ai, '1A5') > 0) {
      area.resources[pk] = ensureDec(area.resources[pk]).add(ensureDec(calcPrestigeGain(ai)).div(2e3))
    }
    const u191 = getUpgradeLevel(ai, '191')
    if (u191 > 0) {
      const u142 = getUpgradeLevel(ai, '142')
      const boost142 = D(1).add(D(u142).mul(0.1))
      const rate = D(0.01).add(D(0.001).mul(boost142).mul(u191))
      area.resources[pk] = ensureDec(area.resources[pk]).add(ensureDec(calcPrestigeGain(ai)).mul(rate).mul(tm).div(1000 / gameState.tickSpeed))
    }

    // 自动水晶
    if (getUpgradeLevel(ai, '1A9') > 0) {
      area.resources[ck] = ensureDec(area.resources[ck]).add(ensureDec(calcCrystalGain(ai)).div(2e3))
    }
    const u194 = getUpgradeLevel(ai, '194')
    if (u194 > 0) {
      const u142 = getUpgradeLevel(ai, '142')
      const boost142 = D(1).add(D(u142).mul(0.1))
      const rate = D(0.01).add(D(0.001).mul(boost142).mul(u194))
      area.resources[ck] = ensureDec(area.resources[ck]).add(ensureDec(calcCrystalGain(ai)).mul(rate).mul(tm).div(1000 / gameState.tickSpeed))
    }

    // 自动铜
    if (isCuprumUnlocked(ai)) {
      const cm = cuprumMultiplier(ai)
      if (cm.gte(10)) {
        const cuk = AREA_RESOURCES_LIST[ai].find(r => r.id === 'cuprum')?.id
        if (cuk) {
          const autoCuprum = cm.div(10).mul(tm).div(1000 / gameState.tickSpeed)
          area.resources[cuk] = ensureDec(area.resources[cuk]).add(autoCuprum)
        }
      }
    }

    // 自动银（倍率≥10时每秒自动生成倍率/10的银）
    if (isArgentumUnlocked(ai)) {
      const am = argentumMultiplier(ai)
      if (am.gte(10)) {
        const autoArgentum = am.div(10).mul(tm).div(1000 / gameState.tickSpeed)
        area.resources['argentum'] = ensureDec(area.resources['argentum']).add(autoArgentum)
      }
    }

    // 1AB~1AD: 不消耗资源购买升级
    if (getUpgradeLevel(ai, '1AB') > 0) autoBuyFree(ai, '11')
    if (getUpgradeLevel(ai, '1AC') > 0) autoBuyFree(ai, '12')
    if (getUpgradeLevel(ai, '1AD') > 0) autoBuyFree(ai, '13')

    // B1升级512/513: 自动生成钢
    const b1 = gameState.advancedAreas[0]
    if (b1.unlocked) {
      const sk = steeKey(ai)
      const steelGain = calcSteelGain(ai)
      const u512 = getB1UpgradeLevel('512')
      if (u512 > 0) {
        area.resources[sk] = ensureDec(area.resources[sk]).add(steelGain.mul(D(u512).mul(0.01)).mul(tm).div(1000 / gameState.tickSpeed))
      }
      const u513 = getB1UpgradeLevel('513')
      if (u513 > 0) {
        area.resources[sk] = ensureDec(area.resources[sk]).add(steelGain.mul(D(u513).mul(0.09)).mul(tm).div(1000 / gameState.tickSpeed))
      }
      // 5A2: A1区域自动割草价值乘数应用于铜的获得数量
      if (getB1UpgradeLevel('5A2') > 0 && isCuprumUnlocked(ai)) {
        const a3Mult = D(1).add(D(getUpgradeLevel(ai, '1A3')))
        const u522 = getB1UpgradeLevel('522')
        if (u522 > 0) a3Mult.mul(D(1).add(D(u522)))
        const cuk = AREA_RESOURCES_LIST[ai].find(r => r.id === 'cuprum')?.id
        if (cuk) {
          const autoCuprumFromCut = a3Mult.mul(tm).div(1000 / gameState.tickSpeed)
          area.resources[cuk] = ensureDec(area.resources[cuk]).add(autoCuprumFromCut)
        }
      }
      // 5A4: 自动获得草蹦次数
      if (getB1UpgradeLevel('5A4') > 0 && area.level.gte(D(30))) {
        area.milestones.layer3B1 = area.milestones.layer3B1.add(D(0.001).mul(tm).div(1000 / gameState.tickSpeed))
      }
      // 5A5~5AA: 自动购买各类升级
      if (getB1UpgradeLevel('5A5') > 0) autoBuy(ai, '14')
      if (getB1UpgradeLevel('5A6') > 0) autoBuy(ai, '15')
      if (getB1UpgradeLevel('5A7') > 0) autoBuy(ai, '16')
      if (getB1UpgradeLevel('5A8') > 0) autoBuy(ai, '17')
      if (getB1UpgradeLevel('5A9') > 0) autoBuy(ai, '18')
      if (getB1UpgradeLevel('5AA') > 0) autoBuy(ai, '19')
    }
  }

  if (ai === 1) {
    // ===== A2区域自动化 =====
    // 2A1: 自动割反草
    const a2a1 = getUpgradeLevel(ai, '2A1')
    if (a2a1 > 0) {
      area.autoTimers.cut = ensureDec(area.autoTimers.cut).add(D(tm))
      const baseIvSec = Math.max(0.1, 1 / a2a1)
      const ivTicks = D(Math.max(2, baseIvSec * 1000 / gameState.tickSpeed))
      while (ensureDec(area.autoTimers.cut).gte(ivTicks)) {
        area.autoTimers.cut = ensureDec(area.autoTimers.cut).sub(ivTicks)
        const { gain, xpGain, dXp } = calcCutGains(ai, 1)
        const a2a2Mult = D(1).add(D(getUpgradeLevel(ai, '2A2'))) // 2A2: 自动割反草获得的资源数量+100%/级
        const gk = grassKey(ai)
        area.resources[gk] = ensureDec(area.resources[gk]).add(gain.mul(a2a2Mult))
        area.xp = ensureDec(area.xp).add(xpGain.mul(a2a2Mult))
        if (dXp) area.doubleXp = ensureDec(area.doubleXp).add(dXp.mul(a2a2Mult))
        checkLevelUp(ai)
      }
    }

    // 2A3: 自动购买反草升级
    if (getUpgradeLevel(ai, '2A3') > 0) autoBuy(ai, '21')
    // 2A4: 匿名不再重置反级点及其升级
    // 2A5: 每秒自动生成重置时能获得匿名点的1%
    if (getUpgradeLevel(ai, '2A5') > 0) {
      area.resources[pk] = ensureDec(area.resources[pk]).add(ensureDec(calcPrestigeGain(ai)).div(100))
    }
    // 2A6: 自动购买匿名点升级
    if (getUpgradeLevel(ai, '2A6') > 0) autoBuy(ai, '22')
    // 2A7: 液化不再重置反级点及其升级（在doLayer2Reset中处理）
    // 2A8: 每秒自动生成重置时能获得石油的1%
    if (getUpgradeLevel(ai, '2A8') > 0) {
      area.resources[ck] = ensureDec(area.resources[ck]).add(ensureDec(calcCrystalGain(ai)).div(100))
    }
    // 2A9: 购买反草升级不再消耗反草
    if (getUpgradeLevel(ai, '2A9') > 0) autoBuyFree(ai, '21')
    // 2AA: 购买匿名点升级不再消耗匿名点
    if (getUpgradeLevel(ai, '2AA') > 0) autoBuyFree(ai, '22')
    // 2AB: 购买石油升级不再消耗石油
    if (getUpgradeLevel(ai, '2AB') > 0) autoBuyFree(ai, '23')
    // 2AC: 草跳不再重置反级点及其升级（在doLayer3Branch1Reset中处理）

    // 243: SFRGT生成器 - 购买后每秒生成SFRGT
    if (getUpgradeLevel(ai, '243') >= 1) {
      let sfrgtRate = D(1).add(D(getUpgradeLevel(ai, '243')).mul(0.1))
      sfrgtRate = sfrgtRate.mul(calcTotalBoost(ai, 'SFRGT'))
      area.resources['sfrgt'] = ensureDec(area.resources['sfrgt']).add(sfrgtRate.mul(tm).div(1000 / gameState.tickSpeed))
    }
  }
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

// 1AB~1AD: 不消耗资源购买升级，用反函数求最大可购买等级
function autoBuyFree(ai, prefix) {
  const area = gameState.areas[ai]
  const ids = Object.keys(area.upgrades).filter(id => id.startsWith(prefix))
  for (const id of ids) {
    if (!isUpgradeUnlocked(ai, id)) continue
    const def = area.upgrades[id]
    const budget = ensureDec(area.resources[def.buyResource])
    const maxLv = calcMaxAffordableLevel(def, budget)
    if (maxLv.gt(D(def.level))) {
      def.level = maxLv
      if (id === '143') area.unlockedFeatures.generators = true
      if (id === '142') area.unlockedFeatures.autoGain = true
      checkUnlocks(ai)
    }
  }
}

// ============ 完整重置 ============
function fullResetArea(ai) {
  const area = gameState.areas[ai]
  AREA_RESOURCES_LIST[ai].forEach(r => { area.resources[r.id] = D(0) })
  area.upgrades = createUpgrades()
  area.level = D(0); area.xp = D(0); area.doubleLevel = D(0); area.doubleXp = D(0); area.doubleUnlocked = false
  area.grassField.grass = D(0); area.grassField.maxGrass = D(10); area.grassField.grassPerSec = D(1); area.grassField._frac = D(0); area.grassField.cuprum = D(0); area.grassField.argentum = D(0)
  area.resetCounts = { layer1: D(0), layer2: D(0), layer3B1: D(0), layer3B2: D(0), layer3B3: D(0) }
  area.milestones = { layer3B1: D(0), grassSkip: D(0) }
  area.unlockedFeatures = { upgrades: false, rares: false, generators: false, layer3B2: false, layer3B3: false }
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
  const state = JSON.parse(JSON.stringify(gameState, (k, v) =>
    v === Infinity ? INF_MARKER :
    v instanceof Decimal ? { [DEC_MARKER]: v.toString() } : v
  ))
  // 升级只保存 ID 和等级
  if (state.areas) {
    for (const area of state.areas) {
      if (area && area.upgrades) {
        const simplified = {}
        for (const id in area.upgrades) {
          simplified[id] = { id, level: area.upgrades[id].level }
        }
        area.upgrades = simplified
      }
    }
  }
  // B1升级也只保存ID和等级
  if (state.advancedAreas) {
    for (const adv of state.advancedAreas) {
      if (adv && adv.upgrades && Object.keys(adv.upgrades).length > 0) {
        const simplified = {}
        for (const id in adv.upgrades) {
          simplified[id] = { id, level: adv.upgrades[id].level }
        }
        adv.upgrades = simplified
      }
    }
  }
  return state
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
    // 恢复升级定义，只读取等级
    if (r.areas) {
      for (let i = 0; i < r.areas.length; i++) {
        const area = r.areas[i]
        if (area && area.upgrades) {
          const defaultUpgrades = parseCSV(UPGRADES_CSV)
          for (const id in area.upgrades) {
            if (defaultUpgrades[id] && area.upgrades[id]) {
              defaultUpgrades[id].level = D(area.upgrades[id].level || 0)
            }
          }
          area.upgrades = defaultUpgrades
        }
      }
    }
    // 恢复B1升级
    if (r.advancedAreas) {
      const b1Adv = r.advancedAreas[0]
      if (b1Adv) {
        if (b1Adv.upgrades && Object.keys(b1Adv.upgrades).length > 0) {
          const defaultB1Upgrades = parseCSV(B1_UPGRADES_CSV)
          for (const id in b1Adv.upgrades) {
            if (defaultB1Upgrades[id] && b1Adv.upgrades[id]) {
              defaultB1Upgrades[id].level = D(b1Adv.upgrades[id].level || 0)
            }
          }
          b1Adv.upgrades = defaultB1Upgrades
        } else {
          b1Adv.upgrades = parseCSV(B1_UPGRADES_CSV)
        }
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
          area.level = ensureDec(area.level)
          area.doubleLevel = ensureDec(area.doubleLevel)
          if (area.grassField) {
            area.grassField.grassPerSec = ensureDec(area.grassField.grassPerSec)
            area.grassField._frac = ensureDec(area.grassField._frac)
            area.grassField.grass = ensureDec(area.grassField.grass).floor().max(D0)
            area.grassField.cuprum = ensureDec(area.grassField.cuprum).floor().max(D0)
            area.grassField.argentum = ensureDec(area.grassField.argentum || 0).floor().max(D0)
            area.grassField.maxGrass = ensureDec(area.grassField.maxGrass)
          }
          if (area.resetCounts) {
            area.resetCounts.layer1 = ensureDec(area.resetCounts.layer1)
            area.resetCounts.layer2 = ensureDec(area.resetCounts.layer2)
            area.resetCounts.layer3B1 = ensureDec(area.resetCounts.layer3B1)
            area.resetCounts.layer3B2 = ensureDec(area.resetCounts.layer3B2)
            area.resetCounts.layer3B3 = ensureDec(area.resetCounts.layer3B3 || 0)
          }
          if (area.milestones) {
            area.milestones.layer3B1 = ensureDec(area.milestones.layer3B1)
            area.milestones.grassSkip = ensureDec(area.milestones.grassSkip || 0)
          }
          if (area.autoTimers) {
            area.autoTimers.cut = ensureDec(area.autoTimers.cut)
            area.autoTimers.buy = ensureDec(area.autoTimers.buy)
            area.autoTimers.resetGain = ensureDec(area.autoTimers.resetGain)
            area.autoTimers.crystalGain = ensureDec(area.autoTimers.crystalGain)
          }
        }
      }
    }
    if (r.advancedAreas) {
      for (const adv of r.advancedAreas) {
        if (adv) {
          adv.resource = ensureDec(adv.resource)
          adv.tripleLevel = ensureDec(adv.tripleLevel || 0)
          adv.tripleXp = ensureDec(adv.tripleXp || 0)
        }
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
  return { x: (-4000 + 2000 * idx), y: -2000 }
}
export function getAdvancedAreaPos(idx) {
  return { x: (-4000 + 2000 * idx), y: 0 }
}