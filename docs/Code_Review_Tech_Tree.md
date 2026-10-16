# 原互动科技树技术审查

## 已确认的源码事实

- 单文件 HTML；CSS + 原生 JS；无构建过程；不包含网络 `fetch` 调用或 PWA Service Worker。
- 七条路线：武器火力、战甲战术、段位跃升、舰船系统、高难征途、集团声望、同伴守护；29 个 `base` 节点。
- 支持拖拽、滚轮缩放、双指缩放、导航小地图、搜索、详情展开、打勾、笔记、资源预算、行动日志与每日任务预算。
- 状态存 `localStorage`，key 为 `tenno_progress_lab_v1`，版本 `1`；JSON 文件导入导出。
- `initialState` 中预置 `origin / torid / valkyr / mr12 / blueprint / steel` 为已完成。
- `ready(n)` 判断所有 `deps` 已完成，混合了硬前置和养成建议。`generateDaily()` 按静态优先级与静态 `minutes` 贪心选项目，不是基于任务真实收益、材料缺口、已解锁情况优化。
- `renderNodes()` 使用内联 HTML 动态更新科技树卡片；原文件对部分用户输入采用 `safe()` 转义，但重构时应使用 React 文本节点、避免危险 `innerHTML`。

## 应复用

1. 科技树视觉语言：主支线、节点详情、完成状态、拖拽缩放、缩略图。
2. 原始节点文字可作为个人**推荐模板**；保留稳定原 ID，使旧存档可映射。
3. JSON 导出、导入的用户操作路径。
4. 今日任务卡片、资源预算和可自由添加笔记的体验。

## 不应原样复用

1. 不以所有 `deps` 表示真实游戏解锁硬条件。
2. 不将 MR12→18 绝对坐标或静态 29 节点写死在 React 组件中；改为外部模型驱动。
3. 不使用单体 localStorage 承载大型装备和材料数据库；用 IndexedDB + 版本化 migration。
4. 不用固定 `S>A>B + 预计分钟` 代替活动奖励、材料/声望/任务的优先评分。
5. 不把任务的“项目预计 70 分钟”当作真实刷图任务耗时和收益。
6. 原网页不等于已安装的 PWA；需 manifest + service worker + HTTPS/localhost 实测。

## 技术迁移映射

旧数据 `state.statuses[nodeId]` → `AccountGoalState{goalId,status,updatedAt}`；`state.steps[nodeId][idx]` → `GoalChecklistItem{goalId,stepId,checked}`；`state.notes` → `GoalNote`; `state.stock` → `InventoryEntry`; `state.events` → `ChangeLog`；`state.rank` → `AccountProfile.masteryRank`。

旧节点 `deps` 迁移为 `suggestedBefore`（默认）；仅当经过官方/可靠来源证实才移至 `hardRequirements`。旧科技树备份恢复必须提供预览（数量/冲突/不识别字段），允许取消并保留原文件。不能要求用户重新打勾全部节点。

## 验收

- 可以导入原 `tenno_progress_lab_v1` JSON，迁移 29 节点状态、笔记、资源库存，旧 JSON 仍可导出备份。
- 允许未来新增加路线与节点，不挪用旧 ID，不改变已有状态。
- 可仅折叠某路线、搜索某节点，并从任意功能页跳回相应科技树节点。
- 离线模式可查看科技树与已缓存资料；活动页显示“上次同步于…”并避免把旧活动称为进行中。
