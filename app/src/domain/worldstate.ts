import type {OnlineCacheMeta} from './model';

export const WFCD_PC_ENDPOINT = 'https://api.warframestat.us/pc/?language=zh';
export const WFCD_PC_FALLBACK_ENDPOINT = 'https://api.warframestat.us/pc/';
export const DEFAULT_WORLDSTATE_TTL_MS = 5 * 60 * 1000;

export interface CycleSummary {
  id: 'cetus' | 'vallis' | 'cambion' | 'zariman' | 'duviri';
  titleZh: string;
  stateLabel: string;
  rawState: string;
  expiry: string | null;
  shortString: string | null;
}

export interface VoidTraderInventoryItem {
  item: string;
  ducats: number | null;
  credits: number | null;
}

export interface VoidTraderSummary {
  active: boolean;
  character: string;
  location: string;
  activation: string | null;
  expiry: string | null;
  inventoryCount: number;
  inventorySample: VoidTraderInventoryItem[];
  inventoryItems?: VoidTraderInventoryItem[];
}

export interface WorldEventSummary {
  id: string;
  title: string;
  faction: string | null;
  node: string | null;
  description: string | null;
  expiry: string | null;
  progressPercent: number | null;
  rewardSummary: string[];
  verification: 'official-api-summary';
}

export interface NightwaveChallengeSummary {
  id: string;
  title: string;
  desc: string;
  reputation: number | null;
  isDaily: boolean;
  isElite: boolean;
  expiry: string | null;
}

export interface NightwaveSummary {
  season: number | null;
  expiry: string | null;
  activeChallenges: NightwaveChallengeSummary[];
}

export interface SortieSummary {
  boss: string;
  faction: string;
  expiry: string | null;
  variants: {missionType: string; modifier: string; node: string}[];
}

export interface ArchonHuntSummary {
  boss: string;
  faction: string;
  expiry: string | null;
  missions: {type: string; node: string}[];
}

export interface FissureHighlight {
  id: string;
  tier: string;
  tierZh: string;
  missionType: string;
  node: string;
  enemy: string;
  isHard: boolean;
  isStorm: boolean;
  expiry: string | null;
}

export interface FissureSummary {
  totalActive: number;
  steelPathCount: number;
  normalCount: number;
  byTier: Record<string, number>;
  highlights: FissureHighlight[];
  allActive?: FissureHighlight[];
}

export interface NewsItemSummary {
  id: string;
  title: string;
  link: string;
  date: string | null;
  isUpdate: boolean;
}

export interface WorldStateSnapshot {
  schemaVersion: 1;
  platform: 'pc';
  apiTimestamp: string | null;
  meta: OnlineCacheMeta;
  cycles: CycleSummary[];
  voidTrader: VoidTraderSummary | null;
  events: WorldEventSummary[];
  nightwave: NightwaveSummary | null;
  sortie: SortieSummary | null;
  archonHunt: ArchonHuntSummary | null;
  fissures: FissureSummary;
  news: NewsItemSummary[];
}

export type CacheFreshness = 'empty' | 'fresh' | 'stale';

const HAS_CJK = /[\u4e00-\u9fff]/;

const STATE_LABELS: Record<string, string> = {
  day: '白昼（Day）',
  night: '夜晚（Night）',
  warm: '温暖（Warm）',
  cold: '寒冷（Cold）',
  fass: 'Fass（活跃期）',
  vome: 'Vome（沉寂期）',
  grineer: 'Grineer 占领',
  corpus: 'Corpus 占领',
  joy: '喜悦螺旋（Joy）',
  anger: '愤怒螺旋（Anger）',
  envy: '嫉妒螺旋（Envy）',
  sorrow: '悲伤螺旋（Sorrow）',
  fear: '恐惧螺旋（Fear）',
};

const TIER_LABELS: Record<string, string> = {
  Lith: '古纪（Lith）',
  Meso: '前纪（Meso）',
  Neo: '中纪（Neo）',
  Axi: '后纪（Axi）',
  Requiem: '安魂（Requiem）',
  Omnia: '全能（Omnia）',
};

const MISSION_TYPE_LABELS: Record<string, string> = {
  capture: '捕获（Capture）',
  exterminate: '歼灭（Exterminate）',
  extermination: '歼灭（Exterminate）',
  survival: '生存（Survival）',
  defense: '防御（Defense）',
  'mobile defense': '移动防御（Mobile Defense）',
  spy: '间谍（Spy）',
  rescue: '救援（Rescue）',
  sabotage: '破坏（Sabotage）',
  disruption: '中断（Disruption）',
  interception: '拦截（Interception）',
  excavation: '挖掘（Excavation）',
  hijack: '劫持（Hijack）',
  assassination: '刺杀（Assassination）',
  defection: '叛逃（Defection）',
  alchemy: '炼金（Alchemy）',
  'void cascade': '虚空覆涌（Void Cascade）',
  'void flood': '虚空洪流（Void Flood）',
  'void armageddon': '虚空末日（Void Armageddon）',
  'mirror defense': '镜像防御（Mirror Defense）',
  'conjunction survival': '结合生存（Conjunction Survival）',
  skirmish: '前哨战（Skirmish）',
  volatile: '爆发（Volatile）',
  orpheus: '奥菲斯（Orphix）',
  orphix: '奥菲斯（Orphix）',
  'crossfire exterminate': '多方交战歼灭（Crossfire Exterminate）',
  hive: '清巢（Hive）',
  infested: '感染者清剿（Infested）',
};

const FACTION_LABELS: Record<string, string> = {
  grineer: 'Grineer（克隆尼）',
  corpus: 'Corpus（科普斯）',
  infested: 'Infested（感染者）',
  corrupted: 'Corrupted（堕落者）',
  orokin: 'Orokin（奥罗金）',
  narmer: '合一众（Narmer）',
  'the murmur': '低语者（The Murmur）',
  murmur: '低语者（The Murmur）',
  scaldra: '炽蛇军（Scaldra）',
  techrot: '科腐者（Techrot）',
  crossfire: '多方交战（Crossfire）',
};

const MODIFIER_LABELS: Record<string, string> = {
  'augmented enemy armor': '敌人护甲强化（Augmented Enemy Armor）',
  'augmented enemy shields': '敌人护盾强化（Augmented Enemy Shields）',
  'energy reduction': '能量上限降低（Energy Reduction）',
  'eximus stronghold': '卓越者大本营（Eximus Stronghold）',
  'extreme cold': '极度寒冷（Extreme Cold）',
  'dense fog': '浓雾（Dense Fog）',
  'radiation hazard': '辐射灾害（Radiation Hazard）',
  'cryogenic leakage': '低温泄漏（Cryogenic Leakage）',
  'electromagnetic anomalies': '电磁异常（Electromagnetic Anomalies）',
  'fire': '火灾环境（Fire）',
  'low gravity': '低重力（Low Gravity）',
  'weapon restriction: melee only': '武器限制：仅近战（Melee Only）',
  'weapon restriction: primary only': '武器限制：仅主武器（Primary Only）',
  'weapon restriction: secondary only': '武器限制：仅副武器（Secondary Only）',
  'weapon restriction: sniper only': '武器限制：仅狙击枪（Sniper Only）',
  'weapon restriction: bow only': '武器限制：仅弓箭（Bow Only）',
  'weapon restriction: shotgun only': '武器限制：仅霰弹枪（Shotgun Only）',
  'weapon restriction: assault rifle only': '武器限制：仅突击步枪（Assault Rifle Only）',
};

function asObject(v: unknown): Record<string, unknown> | null {
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
}

function asString(v: unknown): string | null {
  return typeof v === 'string' && v.trim() ? v.trim() : null;
}

function asNumber(v: unknown): number | null {
  return typeof v === 'number' && Number.isFinite(v) ? v : null;
}

function asIsoDate(v: unknown): string | null {
  const text = asString(v);
  if (!text) return null;
  return Number.isFinite(Date.parse(text)) ? text : null;
}

function translateState(raw: string): string {
  const key = raw.trim().toLowerCase();
  return STATE_LABELS[key] ?? raw;
}

export function translateFissureTier(tier: string): string {
  if (HAS_CJK.test(tier)) return tier;
  return TIER_LABELS[tier] ?? tier;
}

export function translateMissionType(raw: string): string {
  if (HAS_CJK.test(raw)) return raw;
  return MISSION_TYPE_LABELS[raw.trim().toLowerCase()] ?? raw;
}

export function translateFaction(raw: string): string {
  if (HAS_CJK.test(raw)) return raw;
  return FACTION_LABELS[raw.trim().toLowerCase()] ?? raw;
}

export function translateModifier(raw: string): string {
  if (HAS_CJK.test(raw)) return raw;
  const lower = raw.trim().toLowerCase();
  if (MODIFIER_LABELS[lower]) return MODIFIER_LABELS[lower];
  if (lower.startsWith('enemy elemental enhancement:')) {
    const elem = raw.slice(raw.indexOf(':') + 1).trim();
    return `敌人元素强化：${elem}（${raw}）`;
  }
  if (lower.startsWith('enemy physical enhancement:')) {
    const phys = raw.slice(raw.indexOf(':') + 1).trim();
    return `敌人物理强化：${phys}（${raw}）`;
  }
  return raw;
}

export function isExpired(expiry: string | null | undefined, nowMs = Date.now()): boolean {
  if (!expiry) return false;
  const target = Date.parse(expiry);
  if (!Number.isFinite(target)) return false;
  return target <= nowMs;
}

export function getCacheFreshness(meta: OnlineCacheMeta | undefined | null, nowMs = Date.now()): CacheFreshness {
  if (!meta) return 'empty';
  const expiresAt = Date.parse(meta.expiresAt);
  if (!Number.isFinite(expiresAt)) return 'stale';
  return expiresAt > nowMs ? 'fresh' : 'stale';
}

export function formatRemaining(expiry: string | null | undefined, nowMs = Date.now()): string {
  if (!expiry) return '时间未公布';
  const target = Date.parse(expiry);
  if (!Number.isFinite(target)) return '时间未公布';
  const diffMs = target - nowMs;
  if (diffMs <= 0) return '已过截止时间（缓存待刷新）';
  const totalMinutes = Math.floor(diffMs / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) return `剩余 ${days}天 ${hours}小时`;
  if (hours > 0) return `剩余 ${hours}小时 ${minutes}分`;
  if (minutes > 0) return `剩余 ${minutes}分`;
  return '不足 1 分钟';
}

function parseCycle(
  id: CycleSummary['id'],
  titleZh: string,
  raw: unknown,
  fallbackStateKey?: string,
): CycleSummary | null {
  const obj = asObject(raw);
  if (!obj) return null;
  const rawState =
    asString(obj.state) ??
    (fallbackStateKey && typeof obj[fallbackStateKey] === 'boolean'
      ? obj[fallbackStateKey]
        ? 'day'
        : 'night'
      : null);
  if (!rawState) return null;
  return {
    id,
    titleZh,
    rawState,
    stateLabel: translateState(rawState),
    expiry: asIsoDate(obj.expiry),
    shortString: asString(obj.shortString),
  };
}

function parseVoidTrader(raw: unknown): VoidTraderSummary | null {
  const obj = asObject(raw);
  if (!obj) return null;
  const inventoryRaw = Array.isArray(obj.inventory) ? obj.inventory : [];
  const inventoryItems: VoidTraderInventoryItem[] = [];
  for (const entry of inventoryRaw.slice(0, 60)) {
    const row = asObject(entry);
    const item = asString(row?.item);
    if (!item) continue;
    inventoryItems.push({
      item,
      ducats: asNumber(row?.ducats),
      credits: asNumber(row?.credits),
    });
  }
  const rawChar = asString(obj.character);
  const character =
    rawChar && rawChar.toLowerCase() === "baro ki'teer"
      ? "虚空商人（Baro Ki'Teer）"
      : rawChar ?? "虚空商人（Baro Ki'Teer）";
  return {
    active: Boolean(obj.active),
    character,
    location: asString(obj.location) ?? '位置待公布',
    activation: asIsoDate(obj.activation),
    expiry: asIsoDate(obj.expiry),
    inventoryCount: inventoryRaw.length,
    inventorySample: inventoryItems.slice(0, 8),
    inventoryItems,
  };
}

function parseEvents(raw: unknown): WorldEventSummary[] {
  if (!Array.isArray(raw)) return [];
  const list: WorldEventSummary[] = [];
  for (const entry of raw) {
    const obj = asObject(entry);
    if (!obj) continue;
    const id = asString(obj.id);
    const title = asString(obj.description) ?? asString(obj.tooltip);
    if (!id || !title) continue;
    const rewards: string[] = [];
    if (Array.isArray(obj.rewards)) {
      for (const r of obj.rewards) {
        const rewardObj = asObject(r);
        const asText = asString(rewardObj?.asString);
        if (asText) rewards.push(asText);
      }
    }
    const health = asNumber(obj.health);
    const score = asNumber(obj.currentScore);
    const maxScore = asNumber(obj.maximumScore);
    let progressPercent: number | null = null;
    if (health !== null) progressPercent = Math.max(0, Math.min(100, Math.round(health)));
    else if (score !== null && maxScore !== null && maxScore > 0) {
      progressPercent = Math.max(0, Math.min(100, Math.round((score / maxScore) * 100)));
    }
    const rawFaction = asString(obj.faction);
    list.push({
      id,
      title,
      faction: rawFaction ? translateFaction(rawFaction) : null,
      node: asString(obj.node) ?? asString(obj.victimNode),
      description: asString(obj.tooltip),
      expiry: asIsoDate(obj.expiry),
      progressPercent,
      rewardSummary: [...new Set(rewards)],
      verification: 'official-api-summary',
    });
  }
  return list;
}

function parseNightwave(raw: unknown): NightwaveSummary | null {
  const obj = asObject(raw);
  if (!obj) return null;
  const challengesRaw = Array.isArray(obj.activeChallenges) ? obj.activeChallenges : [];
  const activeChallenges: NightwaveChallengeSummary[] = [];
  for (const entry of challengesRaw) {
    const row = asObject(entry);
    if (!row) continue;
    const id = asString(row.id);
    const title = asString(row.title);
    const desc = asString(row.desc) ?? '';
    if (!id || !title) continue;
    activeChallenges.push({
      id,
      title,
      desc,
      reputation: asNumber(row.reputation),
      isDaily: Boolean(row.isDaily),
      isElite: Boolean(row.isElite),
      expiry: asIsoDate(row.expiry),
    });
  }
  activeChallenges.sort((a, b) => (b.reputation ?? 0) - (a.reputation ?? 0));
  return {
    season: asNumber(obj.season),
    expiry: asIsoDate(obj.expiry),
    activeChallenges,
  };
}

function parseSortie(raw: unknown): SortieSummary | null {
  const obj = asObject(raw);
  if (!obj) return null;
  const boss = asString(obj.boss);
  if (!boss) return null;
  const variantsRaw = Array.isArray(obj.variants) ? obj.variants : [];
  const variants = variantsRaw
    .map(v => {
      const row = asObject(v);
      const missionType = asString(row?.missionType);
      const node = asString(row?.node);
      if (!missionType || !node) return null;
      const rawModifier = asString(row?.modifier);
      return {
        missionType: translateMissionType(missionType),
        modifier: rawModifier ? translateModifier(rawModifier) : '无附加词条',
        node,
      };
    })
    .filter((v): v is {missionType: string; modifier: string; node: string} => v !== null);
  const rawFaction = asString(obj.faction);
  return {
    boss,
    faction: rawFaction ? translateFaction(rawFaction) : '未知派系',
    expiry: asIsoDate(obj.expiry),
    variants,
  };
}

function parseArchonHunt(raw: unknown): ArchonHuntSummary | null {
  const obj = asObject(raw);
  if (!obj) return null;
  const boss = asString(obj.boss);
  if (!boss) return null;
  const missionsRaw = Array.isArray(obj.missions) ? obj.missions : [];
  const missions = missionsRaw
    .map(v => {
      const row = asObject(v);
      const type = asString(row?.type);
      const node = asString(row?.node);
      if (!type || !node) return null;
      return {type: translateMissionType(type), node};
    })
    .filter((v): v is {type: string; node: string} => v !== null);
  const rawFaction = asString(obj.faction);
  return {
    boss,
    faction: rawFaction ? translateFaction(rawFaction) : '合一众（Narmer）',
    expiry: asIsoDate(obj.expiry),
    missions,
  };
}

function parseFissures(raw: unknown): FissureSummary {
  const empty: FissureSummary = {
    totalActive: 0,
    steelPathCount: 0,
    normalCount: 0,
    byTier: {},
    highlights: [],
    allActive: [],
  };
  if (!Array.isArray(raw)) return empty;
  const byTier: Record<string, number> = {};
  const allActive: FissureHighlight[] = [];
  let steelPathCount = 0;
  let normalCount = 0;

  for (const entry of raw) {
    const row = asObject(entry);
    if (!row || row.expired === true) continue;
    const id = asString(row.id);
    const tier = asString(row.tier);
    const missionType = asString(row.missionType);
    const node = asString(row.node);
    if (!id || !tier || !missionType || !node) continue;
    const isHard = Boolean(row.isHard);
    const isStorm = Boolean(row.isStorm);
    if (isHard) steelPathCount += 1;
    else normalCount += 1;
    byTier[tier] = (byTier[tier] ?? 0) + 1;
    const rawEnemy = asString(row.enemy);
    allActive.push({
      id,
      tier,
      tierZh: translateFissureTier(tier),
      missionType: translateMissionType(missionType),
      node,
      enemy: rawEnemy ? translateFaction(rawEnemy) : '未知派系',
      isHard,
      isStorm,
      expiry: asIsoDate(row.expiry),
    });
  }

  allActive.sort(
    (a, b) =>
      Number(b.tier === 'Omnia') - Number(a.tier === 'Omnia') ||
      Number(b.isHard) - Number(a.isHard),
  );

  return {
    totalActive: steelPathCount + normalCount,
    steelPathCount,
    normalCount,
    byTier,
    highlights: allActive.slice(0, 8),
    allActive,
  };
}

function parseNews(raw: unknown): NewsItemSummary[] {
  if (!Array.isArray(raw)) return [];
  const list: NewsItemSummary[] = [];
  for (const entry of raw) {
    const row = asObject(entry);
    if (!row) continue;
    const id = asString(row.id);
    const translations = asObject(row.translations);
    const title = asString(translations?.zh) ?? asString(row.message);
    const link = asString(row.link);
    if (!id || !title || !link) continue;
    if (!/^https?:\/\//i.test(link)) continue;
    list.push({
      id,
      title,
      link,
      date: asIsoDate(row.date),
      isUpdate: Boolean(row.update),
    });
  }
  list.sort((a, b) => (Date.parse(b.date ?? '') || 0) - (Date.parse(a.date ?? '') || 0));
  return list.slice(0, 8);
}

export function parseWorldStatePayload(
  raw: unknown,
  fetchedAt: string,
  sourceUrl = WFCD_PC_ENDPOINT,
  ttlMs = DEFAULT_WORLDSTATE_TTL_MS,
): WorldStateSnapshot {
  const root = asObject(raw);
  if (!root) throw new Error('WFCD 世界状态返回格式无效（非 JSON 对象）');

  const fetchedMs = Date.parse(fetchedAt);
  const safeFetchedAt = Number.isFinite(fetchedMs) ? new Date(fetchedMs).toISOString() : new Date().toISOString();
  const expiresAt = new Date((Number.isFinite(fetchedMs) ? fetchedMs : Date.now()) + ttlMs).toISOString();

  const cycles = [
    parseCycle('cetus', '夜灵平野（Plains of Eidolon）', root.cetusCycle, 'isDay'),
    parseCycle('vallis', '奥布山谷（Orb Vallis）', root.vallisCycle),
    parseCycle('cambion', '魔胎之境（Cambion Drift）', root.cambionCycle),
    parseCycle('zariman', '扎里曼号（Zariman）', root.zarimanCycle),
    parseCycle('duviri', '双衍王境（Duviri）', root.duviriCycle),
  ].filter((c): c is CycleSummary => c !== null);

  return {
    schemaVersion: 1,
    platform: 'pc',
    apiTimestamp: asIsoDate(root.timestamp),
    meta: {
      fetchedAt: safeFetchedAt,
      expiresAt,
      sourceUrl,
      reviewedAt: null,
      gamePatch: asString(root.buildLabel),
    },
    cycles,
    voidTrader: parseVoidTrader(root.voidTrader),
    events: parseEvents(root.events),
    nightwave: parseNightwave(root.nightwave),
    sortie: parseSortie(root.sortie),
    archonHunt: parseArchonHunt(root.archonHunt),
    fissures: parseFissures(root.fissures),
    news: parseNews(root.news),
  };
}

export function filterActiveSnapshot(snapshot: WorldStateSnapshot, nowMs = Date.now()) {
  const activeEvents = snapshot.events.filter(e => !isExpired(e.expiry, nowMs));
  const expiredEventsCount = snapshot.events.length - activeEvents.length;
  const sourceFissures = snapshot.fissures.allActive ?? snapshot.fissures.highlights;
  const activeFissures = sourceFissures.filter(f => !isExpired(f.expiry, nowMs));
  const activeChallenges = snapshot.nightwave?.activeChallenges.filter(c => !isExpired(c.expiry, nowMs)) ?? [];
  const sortieActive = snapshot.sortie && !isExpired(snapshot.sortie.expiry, nowMs) ? snapshot.sortie : null;
  const archonActive = snapshot.archonHunt && !isExpired(snapshot.archonHunt.expiry, nowMs) ? snapshot.archonHunt : null;

  return {
    freshness: getCacheFreshness(snapshot.meta, nowMs),
    activeEvents,
    expiredEventsCount,
    activeFissures,
    activeChallenges,
    sortieActive,
    archonActive,
  };
}
