import type {PlannerDB} from './db';

export const PINNED_TARGETS_KEY = 'pinned-targets:v1';

export interface PinnedWikiTarget {
  id: string;
  title: string;
  where: string;
  why: string;
  whatNext: string;
  externalUrl?: string;
  addedAt: string;
}

export async function loadPinnedTargets(db?: PlannerDB): Promise<PinnedWikiTarget[]> {
  if (!db || db.unavailable) return [];
  try {
    const row = await db.meta.get(PINNED_TARGETS_KEY);
    if (!row || !Array.isArray(row.value)) return [];
    return row.value.filter(
      (item): item is PinnedWikiTarget =>
        !!item && typeof item === 'object' && typeof (item as PinnedWikiTarget).id === 'string',
    );
  } catch {
    return [];
  }
}

export async function addPinnedTarget(
  db: PlannerDB | undefined,
  target: PinnedWikiTarget,
): Promise<PinnedWikiTarget[]> {
  const current = await loadPinnedTargets(db);
  const next = [target, ...current.filter(t => t.id !== target.id)].slice(0, 30);
  if (db && !db.unavailable) {
    await db.meta.put({key: PINNED_TARGETS_KEY, value: structuredClone(next)});
  }
  return next;
}

export async function removePinnedTarget(
  db: PlannerDB | undefined,
  id: string,
): Promise<PinnedWikiTarget[]> {
  const current = await loadPinnedTargets(db);
  const next = current.filter(t => t.id !== id);
  if (db && !db.unavailable) {
    await db.meta.put({key: PINNED_TARGETS_KEY, value: structuredClone(next)});
  }
  return next;
}
