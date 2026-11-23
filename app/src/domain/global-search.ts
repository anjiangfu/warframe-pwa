import type {Catalog,ProfileDocument} from './model';
import type {GoalCatalog} from './goals';
import type {WeaponCatalog} from './weapon';
import type {ResourceCatalog} from './resources';
import type {CraftingCatalog} from './crafting';
import type {SyndicateCatalog} from './syndicates';
import {relicDisplayName,type RelicCatalog} from './relics';
import {createEquipmentIndex,type EquipmentMetadata} from './prime-equipment';
import {filterActiveSnapshot,type WorldStateSnapshot} from './worldstate';
import type {ActivityReviewRecord} from './activity-review';

export type SearchCategory =
  | 'tree'
  | 'goal'
  | 'material'
  | 'crafting'
  | 'syndicate'
  | 'relic'
  | 'worldstate';

export const SEARCH_CATEGORY_LABELS: Record<SearchCategory, string> = {
  tree: '互动科技树',
  goal: '养成目标',
  material: '材料查询',
  crafting: '制作配方',
  syndicate: '集团晋升',
  relic: '遗物与装备',
  worldstate: '实时世界状态',
};

export interface GlobalSearchTarget {
  page: 'tree' | 'assistant' | 'materials' | 'crafting' | 'syndicates' | 'relics' | 'console';
  id?: string;
  relicMode?: 'relic' | 'reward' | 'equipment';
  relicQuery?: string;
}

export interface GlobalSearchHit {
  uid: string;
  category: SearchCategory;
  title: string;
  subtitle: string;
  badge: string;
  score: number;
  target: GlobalSearchTarget;
}

export interface SearchSources {
  catalog: Readonly<Catalog>;
  goals: Readonly<GoalCatalog>;
  weapons: Readonly<WeaponCatalog>;
  resources: Readonly<ResourceCatalog>;
  crafting: Readonly<CraftingCatalog>;
  syndicates: Readonly<SyndicateCatalog>;
  relics: Readonly<RelicCatalog>;
  equipment?: Readonly<EquipmentMetadata>;
  profile?: ProfileDocument;
  worldState?: WorldStateSnapshot | null;
  activityReviews?: Record<string, ActivityReviewRecord>;
  nowMs?: number;
}

function normalize(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, ' ');
}

function matchScore(tokens: string[], primary: string, secondary: string): number {
  const p = normalize(primary);
  const s = normalize(secondary);
  const combined = p + ' ' + s;
  for (const token of tokens) {
    if (!combined.includes(token)) return 0;
  }
  let score = 10;
  const full = tokens.join(' ');
  if (p === full) score += 100;
  else if (p.startsWith(full)) score += 60;
  else if (p.includes(full)) score += 40;
  else if (tokens.every(t => p.includes(t))) score += 25;
  return score;
}

export function searchWorkspace(
  rawQuery: string,
  sources: SearchSources,
  categoryFilter: SearchCategory | 'all' = 'all',
  limit = 36,
): GlobalSearchHit[] {
  const cleaned = normalize(rawQuery);
  if (!cleaned) return [];
  const tokens = cleaned.split(' ').filter(Boolean);
  if (!tokens.length) return [];

  const hits: GlobalSearchHit[] = [];
  const allow = (c: SearchCategory) => categoryFilter === 'all' || categoryFilter === c;

  // 1. Tech tree nodes (catalog + custom nodes)
  if (allow('tree')) {
    const laneNames = new Map(sources.catalog.lanes.map(l => [l.id, l.name]));
    const allNodes = [...sources.catalog.nodes, ...(sources.profile?.customNodes ?? [])];
    for (const node of allNodes) {
      const laneName = laneNames.get(node.lane) ?? node.lane;
      const score = matchScore(
        tokens,
        node.title,
        `${node.sub} ${node.description} ${laneName} ${node.id}`,
      );
      if (score > 0) {
        const status = sources.profile?.statuses[node.goalId];
        const statusBadge =
          status === 'done' ? '已完成' : status === 'progress' ? '进行中' : laneName;
        hits.push({
          uid: `tree:${node.goalId}`,
          category: 'tree',
          title: node.title,
          subtitle: node.sub || node.description || `路线：${laneName}`,
          badge: statusBadge,
          score: score + 4,
          target: {page: 'tree', id: node.goalId},
        });
      }
    }
  }

  // 2. Goals & Incarnon weapon guides
  if (allow('goal')) {
    const weaponById = new Map(sources.weapons.weapons.map(w => [w.id, w]));
    for (const goal of sources.goals.goals) {
      const weapon = goal.weaponId ? weaponById.get(goal.weaponId) : undefined;
      const score = matchScore(
        tokens,
        goal.title,
        `${goal.summary} ${weapon?.name ?? ''} ${weapon?.english ?? ''} ${goal.id}`,
      );
      if (score > 0) {
        hits.push({
          uid: `goal:${goal.id}`,
          category: 'goal',
          title: goal.title,
          subtitle: weapon ? `${weapon.name}（${weapon.english}） · ${goal.summary}` : goal.summary,
          badge: goal.kind === 'weapon' ? '灵化武器' : '养成目标',
          score: score + 5,
          target: {page: 'assistant', id: goal.id},
        });
      }
    }
  }

  // 3. Resources / Materials
  if (allow('material')) {
    const acqById = new Map(sources.resources.acquisitions.map(a => [a.id, a]));
    for (const res of sources.resources.resources) {
      const places = res.acquisitionIds
        .map(id => acqById.get(id)?.place ?? '')
        .filter(Boolean)
        .join(' ');
      const title = `${res.name}（${res.english}）`;
      const score = matchScore(tokens, title, `${res.id} ${places}`);
      if (score > 0) {
        const owned = sources.profile?.stock[res.id];
        hits.push({
          uid: `material:${res.id}`,
          category: 'material',
          title,
          subtitle: places || '点击查看获取路线与库存记录',
          badge: owned !== null && owned !== undefined ? `库存 ${owned}` : '材料',
          score: score + 3,
          target: {page: 'materials', id: res.id},
        });
      }
    }
  }

  // 4. Crafting recipes
  if (allow('crafting')) {
    for (const recipe of sources.crafting.recipes) {
      const score = matchScore(tokens, recipe.title, `${recipe.id} ${recipe.output.resourceId}`);
      if (score > 0) {
        const targetCount = sources.profile?.craftingTargets?.[recipe.id];
        hits.push({
          uid: `crafting:${recipe.id}`,
          category: 'crafting',
          title: recipe.title,
          subtitle: `计划数量：${targetCount ?? '未设定'} · 查看共享材料缺口`,
          badge: '制作配方',
          score: score + 3,
          target: {page: 'crafting', id: recipe.id},
        });
      }
    }
  }

  // 5. Syndicates
  if (allow('syndicate')) {
    for (const syn of sources.syndicates.syndicates) {
      const membersText = syn.members.map(m => `${m.name} ${m.english}`).join(' ');
      const title = `${syn.name}（${syn.english}）`;
      const score = matchScore(tokens, title, `${syn.id} ${membersText}`);
      if (score > 0) {
        hits.push({
          uid: `syndicate:${syn.id}`,
          category: 'syndicate',
          title,
          subtitle: `最高 ${syn.maxRank} 级 · 成员：${syn.members.map(m => m.name).join('、')}`,
          badge: '集团晋升',
          score: score + 4,
          target: {page: 'syndicates', id: syn.id},
        });
      }
    }
  }

  // 6. Relics, Rewards & Prime Equipment navigation
  if (allow('relic')) {
    const eqIndex = createEquipmentIndex(sources.relics, sources.equipment);
    for (const group of eqIndex.groups) {
      const title =
        group.parent.nameZh !== group.parent.english
          ? `${group.parent.nameZh}（${group.parent.english}）`
          : group.parent.nameZh;
      const score = matchScore(tokens, title, group.parent.id);
      if (score > 0) {
        hits.push({
          uid: `equipment:${group.parent.id}`,
          category: 'relic',
          title,
          subtitle: `关联 ${group.rewards.length} 项遗物奖励 · 按装备找部件`,
          badge: 'Prime 装备',
          score: score + 4,
          target: {
            page: 'relics',
            id: group.parent.id,
            relicMode: 'equipment',
            relicQuery: group.parent.nameZh,
          },
        });
      }
    }

    for (const relic of sources.relics.relics) {
      const display = relicDisplayName(relic);
      const score = matchScore(tokens, display, `${relic.tier} ${relic.code} ${relic.id}`);
      if (score > 0) {
        hits.push({
          uid: `relic:${relic.id}`,
          category: 'relic',
          title: display,
          subtitle: '点击查看该遗物的收录奖励与来源摘录',
          badge: '虚空遗物',
          score: score + 2,
          target: {
            page: 'relics',
            id: relic.id,
            relicMode: 'relic',
            relicQuery: `${relic.tier} ${relic.code}`,
          },
        });
      }
    }

    for (const reward of sources.relics.rewards) {
      const display = relicDisplayName(reward);
      const score = matchScore(tokens, display, `${reward.name} ${reward.id}`);
      if (score > 0) {
        hits.push({
          uid: `reward:${reward.id}`,
          category: 'relic',
          title: display,
          subtitle: '反查包含该奖励的收录遗物',
          badge: '遗物奖励',
          score: score + 1,
          target: {
            page: 'relics',
            id: reward.id,
            relicMode: 'reward',
            relicQuery: reward.display?.nameZh ?? reward.name,
          },
        });
      }
    }
  }

  // 7. Active WFCD worldstate & manual activity reviews
  if (allow('worldstate')) {
    const nowMs = sources.nowMs ?? Date.now();
    if (sources.worldState) {
      const active = filterActiveSnapshot(sources.worldState, nowMs);
      for (const cycle of sources.worldState.cycles) {
        const score = matchScore(tokens, cycle.titleZh, `${cycle.stateLabel} ${cycle.rawState}`);
        if (score > 0) {
          hits.push({
            uid: `ws:cycle:${cycle.id}`,
            category: 'worldstate',
            title: `${cycle.titleZh} · ${cycle.stateLabel}`,
            subtitle: 'WFCD 开放世界实时周期',
            badge: '实时周期',
            score: score + 2,
            target: {page: 'console'},
          });
        }
      }
      for (const ev of active.activeEvents) {
        const score = matchScore(
          tokens,
          ev.title,
          `${ev.node ?? ''} ${ev.faction ?? ''} ${ev.rewardSummary.join(' ')}`,
        );
        if (score > 0) {
          hits.push({
            uid: `ws:event:${ev.id}`,
            category: 'worldstate',
            title: ev.title,
            subtitle: `${ev.node ?? '星图活动'} · WFCD 实时活动摘要`,
            badge: '限时活动',
            score: score + 3,
            target: {page: 'console'},
          });
        }
      }
      if (active.archonActive) {
        const score = matchScore(
          tokens,
          `执刑官猎杀 ${active.archonActive.boss}`,
          active.archonActive.missions.map(m => `${m.type} ${m.node}`).join(' '),
        );
        if (score > 0) {
          hits.push({
            uid: 'ws:archon',
            category: 'worldstate',
            title: `执刑官猎杀 · ${active.archonActive.boss}`,
            subtitle: active.archonActive.missions.map(m => m.type).join(' → '),
            badge: '周常猎杀',
            score: score + 2,
            target: {page: 'console'},
          });
        }
      }
      if (active.sortieActive) {
        const score = matchScore(
          tokens,
          `每日突击 ${active.sortieActive.boss}`,
          active.sortieActive.variants.map(v => `${v.missionType} ${v.modifier}`).join(' '),
        );
        if (score > 0) {
          hits.push({
            uid: 'ws:sortie',
            category: 'worldstate',
            title: `每日突击 · ${active.sortieActive.boss}`,
            subtitle: active.sortieActive.variants.map(v => v.missionType).join(' → '),
            badge: '每日突击',
            score: score + 2,
            target: {page: 'console'},
          });
        }
      }
    }

    for (const review of Object.values(sources.activityReviews ?? {})) {
      const rewardText = review.rewards.map(r => r.nameZh).join(' ');
      const score = matchScore(
        tokens,
        review.titleZh,
        `${review.recommendationReason} ${review.howToPlay} ${rewardText}`,
      );
      if (score > 0) {
        hits.push({
          uid: `review:${review.eventId}`,
          category: 'worldstate',
          title: `活动评估 · ${review.titleZh}`,
          subtitle: rewardText ? `兑换：${rewardText}` : review.recommendationReason,
          badge: '已核实活动',
          score: score + 4,
          target: {page: 'console'},
        });
      }
    }
  }

  hits.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, 'zh-CN'));
  return hits.slice(0, limit);
}
