import type {PlannerDB} from './db';
import {
  LIVE_WIKI_CACHE_TTL_MS,
  WFCD_DROPS_BASE,
  WFCD_ITEMS_BASE,
  parseLiveDropsPayload,
  parseLiveItemsPayload,
  type LiveDropRow,
  type LiveSearchResult,
} from '../domain/live-wiki';

export const LIVE_WIKI_CACHE_KEY = 'live-wiki-cache:v1';
const MAX_CACHED_QUERIES = 30;
const HAS_CJK = /[\u4e00-\u9fff]/;

type CacheMap = Record<string, LiveSearchResult>;

function normKey(q: string): string {
  return q.trim().toLowerCase();
}

export async function loadLiveWikiCacheMap(db?: PlannerDB): Promise<CacheMap> {
  if (!db || db.unavailable) return {};
  try {
    const row = await db.meta.get(LIVE_WIKI_CACHE_KEY);
    if (!row || !row.value || typeof row.value !== 'object' || Array.isArray(row.value)) return {};
    return row.value as CacheMap;
  } catch {
    return {};
  }
}

export async function saveLiveWikiCacheEntry(
  db: PlannerDB | undefined,
  entry: LiveSearchResult,
): Promise<void> {
  if (!db || db.unavailable) return;
  const map = await loadLiveWikiCacheMap(db);
  map[normKey(entry.query)] = entry;
  const sortedKeys = Object.keys(map).sort((a, b) =>
    (map[b]?.fetchedAt ?? '').localeCompare(map[a]?.fetchedAt ?? ''),
  );
  const trimmed: CacheMap = {};
  for (const k of sortedKeys.slice(0, MAX_CACHED_QUERIES)) {
    trimmed[k] = map[k];
  }
  await db.meta.put({key: LIVE_WIKI_CACHE_KEY, value: trimmed});
}

export async function loadRecentWikiEntries(db?: PlannerDB): Promise<LiveSearchResult[]> {
  const map = await loadLiveWikiCacheMap(db);
  return Object.values(map).sort((a, b) => b.fetchedAt.localeCompare(a.fetchedAt)).slice(0, 12);
}

export interface LiveFetchOptions {
  fetcher?: typeof fetch;
  timeoutMs?: number;
  forceRefresh?: boolean;
  now?: () => Date;
}

async function fetchJson(url: string, fetcher: typeof fetch, timeoutMs: number): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetcher(url, {
      method: 'GET',
      credentials: 'omit',
      headers: {Accept: 'application/json'},
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`WFCD 查询失败（HTTP ${res.status}）`);
    return await res.json();
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('WFCD 查询超时，请稍后重试。', {cause: error});
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

export async function searchLiveItems(
  rawQuery: string,
  db?: PlannerDB,
  options: LiveFetchOptions = {},
): Promise<{result: LiveSearchResult; fromCache: boolean; staleFallback: boolean}> {
  const query = rawQuery.trim();
  if (!query) throw new Error('请输入要搜索的战甲、武器、材料、MOD 或遗物名称');

  const key = normKey(query);
  const nowDate = options.now?.() ?? new Date();
  const nowMs = nowDate.getTime();
  const cacheMap = await loadLiveWikiCacheMap(db);
  const cached = cacheMap[key];

  if (!options.forceRefresh && cached && Date.parse(cached.expiresAt) > nowMs) {
    return {result: cached, fromCache: true, staleFallback: false};
  }

  const fetcher = options.fetcher ?? globalThis.fetch;
  const timeoutMs = options.timeoutMs ?? 12000;
  const encoded = encodeURIComponent(query);
  const preferZh = HAS_CJK.test(query);

  try {
    const primaryLang: 'zh' | 'en' = preferZh ? 'zh' : 'en';
    const primaryUrl = primaryLang === 'zh' ? `${WFCD_ITEMS_BASE}${encoded}?language=zh` : `${WFCD_ITEMS_BASE}${encoded}`;
    let items = parseLiveItemsPayload(await fetchJson(primaryUrl, fetcher, timeoutMs));
    let usedLang: 'zh' | 'en' = primaryLang;

    if (items.length === 0) {
      const fallbackLang: 'zh' | 'en' = primaryLang === 'zh' ? 'en' : 'zh';
      const fallbackUrl =
        fallbackLang === 'zh' ? `${WFCD_ITEMS_BASE}${encoded}?language=zh` : `${WFCD_ITEMS_BASE}${encoded}`;
      const fallbackItems = parseLiveItemsPayload(await fetchJson(fallbackUrl, fetcher, timeoutMs));
      if (fallbackItems.length > 0) {
        items = fallbackItems;
        usedLang = fallbackLang;
      }
    }

    const result: LiveSearchResult = {
      query,
      fetchedAt: nowDate.toISOString(),
      expiresAt: new Date(nowMs + LIVE_WIKI_CACHE_TTL_MS).toISOString(),
      sourceLanguage: usedLang,
      items,
    };
    await saveLiveWikiCacheEntry(db, result);
    return {result, fromCache: false, staleFallback: false};
  } catch (error) {
    if (cached) {
      return {result: cached, fromCache: true, staleFallback: true};
    }
    throw error;
  }
}

export async function searchLiveDrops(
  rawQuery: string,
  options: Pick<LiveFetchOptions, 'fetcher' | 'timeoutMs'> = {},
): Promise<LiveDropRow[]> {
  const query = rawQuery.trim();
  if (!query) return [];
  const fetcher = options.fetcher ?? globalThis.fetch;
  const timeoutMs = options.timeoutMs ?? 12000;
  const url = `${WFCD_DROPS_BASE}${encodeURIComponent(query)}`;
  const json = await fetchJson(url, fetcher, timeoutMs);
  return parseLiveDropsPayload(json, 40);
}
