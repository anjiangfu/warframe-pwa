import type {PlannerDB} from './db';
import {
  createEmptySessionPlan,
  localDateKey,
  type DailySessionPlan,
} from '../domain/session-planner';

export function sessionPlanKey(profileId: string | undefined): string {
  return `session-plan:v1:${profileId || 'guest'}`;
}

export async function loadDailySessionPlan(
  db: PlannerDB,
  profileId: string | undefined,
  defaultBudgetMinutes: number | null,
  now = new Date(),
): Promise<DailySessionPlan> {
  const fallback = createEmptySessionPlan(defaultBudgetMinutes, now);
  if (db.unavailable) return fallback;
  try {
    const row = await db.meta.get(sessionPlanKey(profileId));
    if (!row || !row.value || typeof row.value !== 'object') return fallback;
    const saved = row.value as Partial<DailySessionPlan>;
    if (saved.schemaVersion !== 1 || !Array.isArray(saved.items)) return fallback;
    const today = localDateKey(now);
    if (saved.dateKey !== today) {
      // Keep user's long-lived preferences (priority / skip / deferred) across days, but reset daily done_today and bucket items.
      const carriedPreferences: DailySessionPlan['preferences'] = {};
      for (const [id, pref] of Object.entries(saved.preferences ?? {})) {
        if (pref === 'priority' || pref === 'deferred' || pref === 'skip') {
          carriedPreferences[id] = pref;
        }
      }
      return {
        ...fallback,
        budgetMinutes: saved.budgetMinutes ?? defaultBudgetMinutes,
        preferences: carriedPreferences,
      };
    }
    return {
      schemaVersion: 1,
      dateKey: today,
      budgetMinutes: typeof saved.budgetMinutes === 'number' ? saved.budgetMinutes : defaultBudgetMinutes,
      items: saved.items,
      preferences: saved.preferences ?? {},
      updatedAt: typeof saved.updatedAt === 'string' ? saved.updatedAt : now.toISOString(),
    };
  } catch {
    return fallback;
  }
}

export async function saveDailySessionPlan(
  db: PlannerDB,
  profileId: string | undefined,
  plan: DailySessionPlan,
): Promise<void> {
  if (db.unavailable) return;
  await db.meta.put({key: sessionPlanKey(profileId), value: structuredClone(plan)});
}
