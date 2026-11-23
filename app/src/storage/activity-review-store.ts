import type {PlannerDB} from './db';
import type {ActivityReviewRecord} from '../domain/activity-review';

export const ACTIVITY_REVIEWS_KEY = 'activity-reviews:v1';

export type ActivityReviewMap = Record<string, ActivityReviewRecord>;

export async function loadActivityReviews(db: PlannerDB): Promise<ActivityReviewMap> {
  if (db.unavailable) return {};
  try {
    const row = await db.meta.get(ACTIVITY_REVIEWS_KEY);
    if (!row || !row.value || typeof row.value !== 'object' || Array.isArray(row.value)) return {};
    const result: ActivityReviewMap = {};
    for (const [key, val] of Object.entries(row.value as Record<string, unknown>)) {
      if (val && typeof val === 'object' && (val as Partial<ActivityReviewRecord>).schemaVersion === 1) {
        result[key] = val as ActivityReviewRecord;
      }
    }
    return result;
  } catch {
    return {};
  }
}

export async function saveActivityReview(
  db: PlannerDB,
  record: ActivityReviewRecord,
): Promise<ActivityReviewMap> {
  const existing = await loadActivityReviews(db);
  const next: ActivityReviewMap = {
    ...existing,
    [record.eventId]: structuredClone(record),
  };
  if (!db.unavailable) {
    await db.meta.put({key: ACTIVITY_REVIEWS_KEY, value: next});
  }
  return next;
}

export async function deleteActivityReview(
  db: PlannerDB,
  eventId: string,
): Promise<ActivityReviewMap> {
  const existing = await loadActivityReviews(db);
  const next: ActivityReviewMap = {...existing};
  delete next[eventId];
  if (!db.unavailable) {
    await db.meta.put({key: ACTIVITY_REVIEWS_KEY, value: next});
  }
  return next;
}
