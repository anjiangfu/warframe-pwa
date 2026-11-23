import type {PlannerDB} from './db';
import {
  DEFAULT_WORLDSTATE_TTL_MS,
  WFCD_PC_ENDPOINT,
  WFCD_PC_FALLBACK_ENDPOINT,
  parseWorldStatePayload,
  type WorldStateSnapshot,
} from '../domain/worldstate';

export const WORLDSTATE_CACHE_KEY = 'worldstate:pc:v1';

export async function loadWorldStateCache(db: PlannerDB): Promise<WorldStateSnapshot | null> {
  if (db.unavailable) return null;
  try {
    const row = await db.meta.get(WORLDSTATE_CACHE_KEY);
    if (!row || !row.value || typeof row.value !== 'object') return null;
    const candidate = row.value as Partial<WorldStateSnapshot>;
    if (candidate.schemaVersion !== 1 || !candidate.meta?.fetchedAt) return null;
    return candidate as WorldStateSnapshot;
  } catch {
    return null;
  }
}

export async function saveWorldStateCache(db: PlannerDB, snapshot: WorldStateSnapshot): Promise<void> {
  if (db.unavailable) return;
  await db.meta.put({key: WORLDSTATE_CACHE_KEY, value: structuredClone(snapshot)});
}

export interface FetchWorldStateOptions {
  endpoint?: string;
  fetcher?: typeof fetch;
  timeoutMs?: number;
  ttlMs?: number;
  now?: () => Date;
}

async function fetchJsonOnce(url: string, fetcher: typeof fetch, timeoutMs: number): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetcher(url, {
      method: 'GET',
      credentials: 'omit',
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`WFCD 世界状态请求失败（HTTP ${response.status}）`);
    }
    return await response.json();
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('WFCD 世界状态同步超时，已保留上次缓存。', {cause: error});
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchAndCacheWorldState(
  db?: PlannerDB,
  options: FetchWorldStateOptions = {},
): Promise<WorldStateSnapshot> {
  const endpoint = options.endpoint ?? WFCD_PC_ENDPOINT;
  const fetcher = options.fetcher ?? globalThis.fetch;
  const timeoutMs = options.timeoutMs ?? 18000;
  const ttlMs = options.ttlMs ?? DEFAULT_WORLDSTATE_TTL_MS;
  const nowIso = (options.now?.() ?? new Date()).toISOString();

  let usedEndpoint = endpoint;
  let json: unknown;
  try {
    json = await fetchJsonOnce(endpoint, fetcher, timeoutMs);
  } catch (firstError) {
    if (!options.endpoint && endpoint !== WFCD_PC_FALLBACK_ENDPOINT) {
      usedEndpoint = WFCD_PC_FALLBACK_ENDPOINT;
      json = await fetchJsonOnce(WFCD_PC_FALLBACK_ENDPOINT, fetcher, timeoutMs);
    } else {
      throw firstError;
    }
  }

  const snapshot = parseWorldStatePayload(json, nowIso, usedEndpoint, ttlMs);
  if (db && !db.unavailable) {
    await saveWorldStateCache(db, snapshot);
  }
  return snapshot;
}
