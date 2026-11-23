import helminthRaw from '../catalog/helminth.v1.json';

export const WFCD_ITEMS_BASE = 'https://api.warframestat.us/items/search/';
export const WFCD_DROPS_BASE = 'https://api.warframestat.us/drops/search/';
export const LIVE_WIKI_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export interface HelminthEntry {
  id: string;
  warframeZh: string;
  warframeEn: string;
  abilityZh: string;
  abilityEn: string;
  tags: string[];
  fitHint: string;
}

export const HELMINTH_CATALOG: {catalogVersion: string; note: string; entries: HelminthEntry[]} = helminthRaw;

export interface LiveDropRow {
  location: string;
  item: string;
  chance: number | null;
  rarity: string | null;
}

export interface LiveComponentRow {
  uniqueName: string;
  name: string;
  nameZh: string;
  itemCount: number;
  locationHint: string | null;
  drops: LiveDropRow[];
}

export interface LiveAbilityRow {
  name: string;
  description: string;
}

export interface LiveWikiItem {
  id: string;
  name: string;
  englishName: string | null;
  category: string;
  categoryZh: string;
  type: string;
  description: string | null;
  masteryReq: number | null;
  buildPrice: number | null;
  buildTimeHours: number | null;
  tradable: boolean;
  isPrime: boolean;
  wikiaUrl: string | null;
  components: LiveComponentRow[];
  drops: LiveDropRow[];
  abilities: LiveAbilityRow[];
  helminth?: HelminthEntry;
}

export interface LiveSearchResult {
  query: string;
  fetchedAt: string;
  expiresAt: string;
  sourceLanguage: 'zh' | 'en';
  items: LiveWikiItem[];
}

const HAS_CJK = /[\u4e00-\u9fff]/;

const CATEGORY_LABELS: Record<string, string> = {
  Warframes: '战甲（Warframes）',
  Primary: '主武器（Primary）',
  Secondary: '副武器（Secondary）',
  Melee: '近战武器（Melee）',
  'Arch-Gun': '空战枪械（Arch-Gun）',
  'Arch-Melee': '空战近战（Arch-Melee）',
  Archwing: '曲翼（Archwing）',
  Sentinels: '守护（Sentinels）',
  Pets: '同伴（Pets）',
  Mods: '振幅晶体（Mods）',
  Arcanes: '赋能（Arcanes）',
  Relics: '虚空遗物（Relics）',
  Resources: '资源材料（Resources）',
  Misc: '材料/杂项（Misc）',
  Gear: '携带道具（Gear）',
  Fish: '鱼类资源（Fish）',
  Glyphs: '浮印（Glyphs）',
  Skins: '外观（Skins）',
};

const COMPONENT_ZH: Record<string, string> = {
  blueprint: '总蓝图（Blueprint）',
  chassis: '机体（Chassis）',
  neuroptics: '头部神经光元（Neuroptics）',
  systems: '系统（Systems）',
  barrel: '枪管（Barrel）',
  receiver: '枪机（Receiver）',
  stock: '枪托（Stock）',
  blade: '刀刃（Blade）',
  handle: '握柄（Handle）',
  hilt: '剑柄（Hilt）',
  link: '连接件（Link）',
  string: '弓弦（String）',
  grip: '弓身/握把（Grip）',
  'lower limb': '下弓臂（Lower Limb）',
  'upper limb': '上弓臂（Upper Limb）',
  forma: '福马（Forma）',
  'orokin cell': '奥罗金电池（Orokin Cell）',
  'argon crystal': '氩结晶（Argon Crystal）',
  'neural sensors': '神经传感器（Neural Sensors）',
  neurodes: '神经元（Neurodes）',
  morphics: '非晶态合金（Morphics）',
  gallium: '镓（Gallium）',
  'control module': '控制模块（Control Module）',
  'tellurium': '碲（Tellurium）',
  'nitain extract': '泥炭萃取物（Nitain Extract）',
  'alloy plate': '合金板（Alloy Plate）',
  'ferrite': '铁氧体（Ferrite）',
  'rubedo': '红化结晶（Rubedo）',
  'salvage': '回收金属（Salvage）',
  'circuits': '电路（Circuits）',
  'nano spores': '纳米孢子（Nano Spores）',
  'plastids': '生物质（Plastids）',
  'polymer bundle': '聚合物束（Polymer Bundle）',
  'cryotic': '永冻晶矿（Cryotic）',
  'oxium': '奥席金属（Oxium）',
  'kuva': '赤毒（Kuva）',
  'fieldron': '电磁力场装置（Fieldron）',
  'detonite injector': '爆燃喷射器（Detonite Injector）',
  'mutagen mass': '突变原聚合物（Mutagen Mass）',
  'mutagen sample': '突变原样本（Mutagen Sample）',
  'hexenon': '六醇燃料（Hexenon）',
  'voidgel orb': '虚空凝胶球（Voidgel Orb）',
  'entrati lanthorn': '英择谛灯笼（Entrati Lanthorn）',
};

const RARITY_ZH: Record<string, string> = {
  common: '常见',
  uncommon: '罕见',
  rare: '稀有',
  legendary: '传说',
};

function asObj(v: unknown): Record<string, unknown> | null {
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
}

function asStr(v: unknown): string | null {
  return typeof v === 'string' && v.trim() ? v.trim() : null;
}

function asNum(v: unknown): number | null {
  return typeof v === 'number' && Number.isFinite(v) ? v : null;
}

export function translateComponentName(raw: string): string {
  if (HAS_CJK.test(raw)) return raw;
  return COMPONENT_ZH[raw.trim().toLowerCase()] ?? raw;
}

export function translateRarity(raw: string | null): string | null {
  if (!raw) return null;
  if (HAS_CJK.test(raw)) return raw;
  return RARITY_ZH[raw.trim().toLowerCase()] ?? raw;
}

function extractLocationHint(desc: string | null): string | null {
  if (!desc) return null;
  const match = desc.match(/Location:\s*([^\n]+)/i) ?? desc.match(/位置[：:]\s*([^\n]+)/);
  return match ? match[1].trim() : null;
}

function extractEnglishFromWikiaUrl(url: string | null): string | null {
  if (!url) return null;
  const match = url.match(/\/w\/([^?#]+)/) ?? url.match(/\/wiki\/([^?#]+)/);
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]).replaceAll('_', ' ').trim();
  } catch {
    return match[1].replaceAll('_', ' ').trim();
  }
}

export function findHelminthByWarframe(name: string, englishName: string | null): HelminthEntry | undefined {
  const candidates = [name, englishName ?? '']
    .map(s => s.replace(/\s*Prime\s*$/i, '').replace(/\s*Umbra\s*$/i, '').trim().toLowerCase())
    .filter(Boolean);
  for (const entry of HELMINTH_CATALOG.entries) {
    const zh = entry.warframeZh.toLowerCase();
    const en = entry.warframeEn.toLowerCase();
    if (candidates.some(c => c === zh || c === en)) {
      return entry;
    }
  }
  return undefined;
}

function parseDropsList(raw: unknown, fallbackItem = ''): LiveDropRow[] {
  if (!Array.isArray(raw)) return [];
  const rows: LiveDropRow[] = [];
  for (const entry of raw) {
    const obj = asObj(entry);
    if (!obj) continue;
    const location = asStr(obj.location) ?? asStr(obj.place);
    if (!location) continue;
    const rawChance = asNum(obj.chance);
    // WFCD items drops use 0..1 decimals (sometimes 0..100 percentages); normalize cleanly.
    const chance =
      rawChance === null ? null : rawChance > 0 && rawChance <= 1 ? Number((rawChance * 100).toFixed(2)) : Number(rawChance.toFixed(2));
    rows.push({
      location,
      item: asStr(obj.type) ?? asStr(obj.item) ?? fallbackItem,
      chance,
      rarity: translateRarity(asStr(obj.rarity)),
    });
  }
  rows.sort((a, b) => (b.chance ?? -1) - (a.chance ?? -1));
  return rows;
}

export function parseLiveDropsPayload(raw: unknown, limit = 40): LiveDropRow[] {
  return parseDropsList(raw).slice(0, limit);
}

export function parseLiveItemsPayload(raw: unknown, limit = 25): LiveWikiItem[] {
  if (!Array.isArray(raw)) return [];
  const items: LiveWikiItem[] = [];
  const seen = new Set<string>();

  for (const entry of raw) {
    const obj = asObj(entry);
    if (!obj) continue;
    const name = asStr(obj.name);
    const id = asStr(obj.uniqueName) ?? name;
    if (!name || !id || seen.has(id)) continue;
    seen.add(id);

    const category = asStr(obj.category) ?? 'Misc';
    const wikiaUrlRaw = asStr(obj.wikiaUrl);
    const wikiaUrl = wikiaUrlRaw && /^https?:\/\//i.test(wikiaUrlRaw) ? wikiaUrlRaw : null;
    const englishName = extractEnglishFromWikiaUrl(wikiaUrl) ?? (!HAS_CJK.test(name) ? name : null);

    const componentsRaw = Array.isArray(obj.components) ? obj.components : [];
    const components: LiveComponentRow[] = [];
    for (const c of componentsRaw) {
      const cObj = asObj(c);
      const cName = asStr(cObj?.name);
      if (!cObj || !cName) continue;
      components.push({
        uniqueName: asStr(cObj.uniqueName) ?? cName,
        name: cName,
        nameZh: translateComponentName(cName),
        itemCount: asNum(cObj.itemCount) ?? 1,
        locationHint: extractLocationHint(asStr(cObj.description)),
        drops: parseDropsList(cObj.drops, cName).slice(0, 12),
      });
    }

    const abilitiesRaw = Array.isArray(obj.abilities) ? obj.abilities : [];
    const abilities: LiveAbilityRow[] = [];
    for (const a of abilitiesRaw) {
      const aObj = asObj(a);
      const aName = asStr(aObj?.name);
      if (!aObj || !aName) continue;
      abilities.push({
        name: aName,
        description: asStr(aObj.description) ?? '',
      });
    }

    const buildTimeSec = asNum(obj.buildTime);
    const helminth = category === 'Warframes' ? findHelminthByWarframe(name, englishName) : undefined;

    items.push({
      id,
      name,
      englishName,
      category,
      categoryZh: CATEGORY_LABELS[category] ?? category,
      type: asStr(obj.type) ?? category,
      description: asStr(obj.description),
      masteryReq: asNum(obj.masteryReq),
      buildPrice: asNum(obj.buildPrice),
      buildTimeHours: buildTimeSec !== null && buildTimeSec > 0 ? Number((buildTimeSec / 3600).toFixed(1)) : null,
      tradable: Boolean(obj.tradable),
      isPrime: Boolean(obj.isPrime) || /\bPrime\b/i.test(name) || /\bPrime\b/i.test(englishName ?? ''),
      wikiaUrl,
      components,
      drops: parseDropsList(obj.drops, name).slice(0, 20),
      abilities,
      helminth,
    });

    if (items.length >= limit) break;
  }

  // Prioritize Warframes, Weapons, Mods, Arcanes, Relics, Resources over Cosmetics/Glyphs.
  const priorityWeight = (cat: string) => {
    if (cat === 'Warframes') return 0;
    if (['Primary', 'Secondary', 'Melee', 'Arch-Gun', 'Arch-Melee'].includes(cat)) return 1;
    if (['Resources', 'Misc', 'Relics', 'Mods', 'Arcanes'].includes(cat)) return 2;
    if (['Skins', 'Glyphs'].includes(cat)) return 5;
    return 3;
  };
  items.sort((a, b) => priorityWeight(a.category) - priorityWeight(b.category));
  return items;
}

export function buildExternalGuideLinks(item: LiveWikiItem) {
  const searchZh = encodeURIComponent(item.name);
  const searchBili = encodeURIComponent(`星际战甲 ${item.name} 配卡`);
  const searchEn = encodeURIComponent(item.englishName ?? item.name);
  return {
    officialWiki: item.wikiaUrl ?? `https://wiki.warframe.com/w/Special:Search?search=${searchEn}`,
    huijiWiki: `https://warframe.huijiwiki.com/index.php?search=${searchZh}`,
    bilibiliBuild: `https://search.bilibili.com/all?keyword=${searchBili}`,
    overframe: `https://overframe.gg/items/arsenal/search/?q=${searchEn}`,
  };
}

export function filterHelminthEntries(query: string, tag: string): HelminthEntry[] {
  const q = query.trim().toLowerCase();
  return HELMINTH_CATALOG.entries.filter(entry => {
    if (tag !== 'all' && !entry.tags.includes(tag)) return false;
    if (!q) return true;
    const hay = `${entry.warframeZh} ${entry.warframeEn} ${entry.abilityZh} ${entry.abilityEn} ${entry.tags.join(' ')} ${entry.fitHint}`.toLowerCase();
    return hay.includes(q);
  });
}
