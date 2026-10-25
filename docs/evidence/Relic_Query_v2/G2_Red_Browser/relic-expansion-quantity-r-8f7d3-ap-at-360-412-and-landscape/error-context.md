# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: relic-expansion.spec.ts >> quantity reward links the existing Forma blueprint; long evidence and all results wrap at 360/412 and landscape
- Location: e2e\relic-expansion.spec.ts:21:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: getByRole('region', { name: '遗物详情', exact: true }).getByTestId('quantity-reward')
Expected substring: "2份"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" getByRole('region', { name: '遗物详情', exact: true }).getByTestId('quantity-reward') with timeout 5000ms
  - waiting for getByRole('region', { name: '遗物详情', exact: true }).getByTestId('quantity-reward')

```

```yaml
- complementary:
  - text: ✦ 天诺星图 本地行动档案 当前档案
  - combobox "切换档案":
    - option "尚未创建" [disabled] [selected]
  - text: MR
  - strong: "?"
  - text: 目标 未知 未知 分钟 / 日
  - paragraph: 0 项目标已完成
  - navigation:
    - button "养成助手": ✧ 养成助手 ↗
    - button "互动科技树": ◇ 互动科技树 ↗
    - button "材料查询": ⌕ 材料查询 ↗
    - button "制作缺口": ▱ 制作缺口 ↗
    - button "集团晋升": ⊙ 集团晋升 ↗
    - button "虚空遗物": ◈ 虚空遗物 ↗
    - button "档案与物资": ▤ 档案与物资 ↗
    - button "备份与恢复": ⇅ 备份与恢复 ↗
    - button "行动日志": ≡ 行动日志 ↗
  - text: 个人资料仅存此设备
  - paragraph: 动态资料：尚未同步
  - button "＋ 新建空白档案"
- main:
  - text: 构建 m0-41614215ac4a · 离线应用壳已就绪
  - paragraph: TENNO / 个人进度终端
  - heading "把下一步，变成自己的路线。" [level=1]
  - paragraph: 记录养成，保留选择。无需游戏账号或云端登录。
  - text: ● 浏览器在线 档案在本机
  - status: 本地档案就绪
  - text: 用户模板 · 事实待核实
  - paragraph: 内置资料快照 / 双向只读查询
  - heading "虚空遗物" [level=2]
  - text: 本轮已收录31个遗物
  - paragraph: 奖励反查仅本目录范围。无结果不代表游戏不存在；掉落表快照不等于当前可刷，也不代表账号已解锁。
  - paragraph: 只查询奖励与摘录来源，不记录遗物库存、精炼、目标或查询历史。
  - text: 独立目录：relics.2026.10.25.1 · 中文组合名与原英文都可查；上游保留拉丁专名时仍注明待核。
  - region "遗物查询方式":
    - button "按遗物查奖励" [pressed]
    - button "按奖励查遗物"
    - text: 遗物名称或编号
    - textbox "遗物名称或编号":
      - /placeholder: 例如 古纪 G14、Lith G14 或 G14
      - text: Lith C15
    - text: 纪元筛选
    - combobox "纪元筛选":
      - option "全部收录纪元" [selected]
      - option "古纪（Lith）"
      - option "前纪（Meso）"
      - option "中纪（Neo）"
      - option "后纪（Axi）"
    - button "清空查询"
  - region "遗物查询结果":
    - heading "遗物查询结果" [level=3]
    - paragraph: 1项命中 · 仅本目录范围
    - button "查看遗物 Lith C15": 古纪 C15 遗物（Lith C15 Relic） 当前可获取未知 · 中文组合显示已对照
  - region "遗物详情":
    - button "返回查询结果"
    - paragraph: 遗物奖励与来源分别核对
    - heading "古纪 C15 遗物（Lith C15 Relic）" [level=3]
    - paragraph: 中文组合显示已对照
    - group: 名称核对依据
    - paragraph: 当前可获取：未知
    - paragraph: 6项基础奖励表已对照快照。来源仅摘录2条，不是全部来源，也不标为完整已核。
    - paragraph: 本版不展示概率。精炼开出概率和获取遗物的掉率含义不同，均不计算；以下为Intact基础表奖励关系。
    - list:
      - listitem:
        - text: 塞多 Prime 蓝图（Cedo Prime Blueprint） 蓝图 · 上游专名＋项目蓝图类型词 基础奖励表核对：表快照已对照
        - group: 名称核对依据
        - button "反查此奖励"
      - listitem:
        - text: Yareli Prime 蓝图（Yareli Prime Blueprint） 蓝图 · 组合已对照，专名仍保留原文（中文名待核） 基础奖励表核对：表快照已对照
        - group: 名称核对依据
        - button "反查此奖励"
      - listitem:
        - text: 2份福马蓝图（2X Forma Blueprint） 蓝图 · 中文组合显示已对照 基础奖励表核对：表快照已对照
        - group: 名称核对依据
        - button "反查此奖励"
      - listitem:
        - text: 闪劫 Prime 枪托（Corufell Prime Stock） 部件 · 中文组合显示已对照 基础奖励表核对：表快照已对照
        - group: 名称核对依据
        - button "反查此奖励"
      - listitem:
        - text: 伯斯顿 Prime 枪机（Burston Prime Receiver） 部件 · 中文组合显示已对照 基础奖励表核对：表快照已对照
        - group: 名称核对依据
        - button "反查此奖励"
      - listitem:
        - text: 大久和弓 Prime 弓弦（Daikyu Prime String） 部件 · 中文组合显示已对照 基础奖励表核对：表快照已对照
        - group: 名称核对依据
        - button "反查此奖励"
    - link "固定遗物奖励表 · v2核对（联网打开） ↗":
      - /url: https://raw.githubusercontent.com/WFCD/warframe-drop-data/3263b2dff8bc1b434a191f0364395b156bd26561/data/relics.json
    - text: 检查：2026-10-25 · 资料快照：2026-10-07T15:18:33Z
    - heading "获取来源摘录" [level=4]
    - paragraph: 先按下述模式规则理解奖励机会；原表标签不直接等于分钟或波次，也不保证获取次数。不包含全量兑换、复刻或实时裂缝资料。
    - article:
      - heading "阿波罗多罗斯撞击坑（Apollodorus）" [level=4]
      - text: 中文组合显示已对照；英文原始键保留
      - group: 名称核对依据
      - heading "入口与获取说明" [level=4]
      - paragraph: 入口：水星星图 → 阿波罗多罗斯撞击坑（Apollodorus）
      - text: 入口核对：已对照资料；用户账号解锁未知。
      - paragraph: 基础任务模式：生存
      - text: 模式核对：已对照资料
      - paragraph: 奖励表类别：常规任务奖励表
      - paragraph: 具体触发：已对照资料
      - heading "普通生存：按任务计时器检查奖励" [level=4]
      - paragraph: 仅此目录的普通生存来源；不是仲裁、任务变体或现实耗时预测。
      - text: 规则说明：已对照资料；公开资料核对，不是游戏亲测。
      - list:
        - listitem: 在星图打开对应节点，启动任务后按指示触发警报。
        - listitem: 击败敌人并维持生命维持系统，观察任务内生存计时器与奖励提示。
        - listitem: 任务内每5分钟刻度检查一次奖励，普通序列为A、A、B、C后重复；使用安全旁路可能推进任务计时，不等于现实等待同样时间。
        - listitem: 已达到撤离条件时走正常撤离点，确认任务结算；不要中止任务强退。
      - paragraph: 本条B表说明：每周期第3次奖励检查取B表，不是第二次。
      - text: 轮次解释核对：已对照资料；表中有记录不等于当前可刷。
      - list:
        - listitem: 安全旁路实际刷新与账号解锁未实测；不按墙上时间承诺刷取时长。
        - listitem: 当前账号解锁、当前遗物掉落仍未知；上游zh字段为原文时不制造中文专名。
      - link "固定上游节点身份（联网打开） ↗":
        - /url: https://cdn.jsdelivr.net/npm/@wfcd/items@1.1276.31/data/json/Node.json
      - text: 检查：2026-10-24 · 资料快照：未知
      - link "固定上游中文映射 1.1276.31（联网打开） ↗":
        - /url: https://cdn.jsdelivr.net/npm/@wfcd/items@1.1276.31/data/json/i18n/zh.json
      - text: 检查：2026-10-24 · 资料快照：未知
      - link "社区节点事实线索（非导入模块）（联网打开） ↗":
        - /url: https://wiki.warframe.com/w/Module:Missions/data
      - text: 检查：2026-10-24 · 资料快照：未知
      - link "PC官方：生存安全旁路（联网打开） ↗":
        - /url: https://www.warframe.com/en/patch-notes/pc/42-0-0
      - text: 检查：2026-10-24 · 资料快照：2026-03-26
      - link "社区资料：奖励表规则（联网打开） ↗":
        - /url: https://wiki.warframe.com/w/Mission_Rewards
      - text: 检查：2026-10-24 · 资料快照：未知
      - group: 原始表键与旧条件（追溯）
      - paragraph: 表快照已对照 · 当前可获取：未知
      - link "固定任务奖励表 · v2核对（联网打开） ↗":
        - /url: https://raw.githubusercontent.com/WFCD/warframe-drop-data/3263b2dff8bc1b434a191f0364395b156bd26561/data/missionRewards.json
      - text: 检查：2026-10-25 · 资料快照：2026-10-07T15:18:33Z
    - article:
      - heading "神守基地（Lares）" [level=4]
      - text: 中文组合显示已对照；英文原始键保留
      - group: 名称核对依据
      - heading "入口与获取说明" [level=4]
      - paragraph: 入口：水星星图 → 神守基地（Lares）
      - text: 入口核对：已对照资料；用户账号解锁未知。
      - paragraph: 基础任务模式：防御
      - text: 模式核对：已对照资料
      - paragraph: 奖励表类别：常规任务奖励表
      - paragraph: 具体触发：已对照资料
      - heading "普通防御：每3波一次奖励检查" [level=4]
      - paragraph: 仅Lares、Romula、Coba普通节点；不套用于Tyana Pass镜像防御或仲裁等变体。
      - text: 规则说明：已对照资料；公开资料核对，不是游戏亲测。
      - list:
        - listitem: 从星图选择对应节点，核对普通防御或黑暗地带防御的任务面板。
        - listitem: 保住防御目标并清理每波敌人；普通防御已由旧5波改为每3波出现奖励与继续／撤离选择。
        - listitem: 普通奖励检查按A、A、B、C循环；不要把C写成第三轮。
        - listitem: 达到想核对的奖励机会后，按结算界面的撤离选择正常完成；继续后失败仍有丢失奖励风险。
      - paragraph: 本条A表说明：周期内第1、2次检查为A；普通防御对应完成3、6波。
      - text: 轮次解释核对：已对照资料；表中有记录不等于当前可刷。
      - list:
        - listitem: 此说明不是全游戏防御算法，特殊节点应采用各自规则。
        - listitem: 当前账号解锁、当前遗物掉落仍未知；上游zh字段为原文时不制造中文专名。
      - link "固定上游节点身份（联网打开） ↗":
        - /url: https://cdn.jsdelivr.net/npm/@wfcd/items@1.1276.31/data/json/Node.json
      - text: 检查：2026-10-24 · 资料快照：未知
      - link "固定上游中文映射 1.1276.31（联网打开） ↗":
        - /url: https://cdn.jsdelivr.net/npm/@wfcd/items@1.1276.31/data/json/i18n/zh.json
      - text: 检查：2026-10-24 · 资料快照：未知
      - link "社区节点事实线索（非导入模块）（联网打开） ↗":
        - /url: https://wiki.warframe.com/w/Module:Missions/data
      - text: 检查：2026-10-24 · 资料快照：未知
      - link "PC官方：普通防御改为3波（联网打开） ↗":
        - /url: https://www.warframe.com/en/patch-notes/pc/38-5-0
      - text: 检查：2026-10-24 · 资料快照：2025-03-19
      - link "社区资料：奖励表规则（联网打开） ↗":
        - /url: https://wiki.warframe.com/w/Mission_Rewards
      - text: 检查：2026-10-24 · 资料快照：未知
      - group: 原始表键与旧条件（追溯）
      - paragraph: 表快照已对照 · 当前可获取：未知
      - link "固定任务奖励表 · v2核对（联网打开） ↗":
        - /url: https://raw.githubusercontent.com/WFCD/warframe-drop-data/3263b2dff8bc1b434a191f0364395b156bd26561/data/missionRewards.json
      - text: 检查：2026-10-25 · 资料快照：2026-10-07T15:18:33Z
  - text: 天诺星图 · 材料与制作 v0 中文优先 / 你的数据由你保管
```

# Test source

```ts
  1  | import {test,expect,type Page} from '@playwright/test';
  2  | import {readFile,writeFile} from 'node:fs/promises';
  3  | import type {RelicCatalog} from '../src/domain/relics';
  4  | import {TEST_ORIGIN,evidencePath} from './environment';
  5  | const c=JSON.parse(await readFile('src/catalog/relics.v1.json','utf8')) as RelicCatalog;
  6  | const old=JSON.parse(await readFile('../docs/evidence/Relic_Query_v2/Baseline_Catalog.json','utf8')) as RelicCatalog;
  7  | const fresh=c.relics.filter(r=>!old.relics.some(o=>o.id===r.id)),newRewards=c.rewards.filter(r=>!old.rewards.some(o=>o.id===r.id));
  8  | const results=(p:Page)=>p.getByRole('region',{name:'遗物查询结果',exact:true}),detail=(p:Page)=>p.getByRole('region',{name:'遗物详情',exact:true}),reverse=(p:Page)=>p.getByRole('region',{name:'奖励反查结果',exact:true});
  9  | async function records(p:Page){return p.evaluate(()=>new Promise<unknown>((resolve,reject)=>{const q=indexedDB.open('tenno-planner');q.onerror=()=>reject(q.error);q.onsuccess=()=>{const db=q.result,tx=db.transaction(['profiles','snapshots','imports']),a=tx.objectStore('profiles').getAll(),b=tx.objectStore('snapshots').getAll(),c=tx.objectStore('imports').getAll();tx.oncomplete=()=>{resolve([a.result,b.result,c.result]);db.close();};};}));}
  10 | async function open(p:Page){await p.goto('/#relics');await expect(p.getByRole('status')).toContainText('本地档案就绪');await expect(p.getByTestId('relic-count')).toHaveText('本轮已收录31个遗物');}
  11 | async function choose(p:Page,id:string){const r=c.relics.find(x=>x.id===id)!;await p.getByRole('button',{name:'按遗物查奖励',exact:true}).click();await p.getByLabel('遗物名称或编号',{exact:true}).fill(r.tier+' '+r.code);await results(p).locator(`button[data-relic-id="${id}"]`).click();}
  12 | test('all nineteen additions show six exact rewards and sixty new rewards resolve to precise reverse sets in both languages',async({page})=>{
  13 |  test.setTimeout(120000);await open(page);const before=await records(page);expect(fresh).toHaveLength(19);expect(newRewards).toHaveLength(60);
  14 |  for(const r of fresh){await choose(page,r.id);const edges=c.relations.filter(e=>e.relicId===r.id);await expect(detail(page).getByTestId('relic-rewards').locator('li')).toHaveCount(6);for(const e of edges)await expect(detail(page).getByTestId('reward:'+e.rewardId)).toContainText(c.rewards.find(r=>r.id===e.rewardId)!.english);await expect(detail(page).getByTestId('relic-route')).toHaveCount(2);await expect(detail(page)).toContainText('当前可获取：未知');}
  15 |  await page.getByRole('button',{name:'按奖励查遗物',exact:true}).click();for(const r of newRewards)for(const q of [r.english,r.display!.nameZh.replace(/\s+/g,'')]){await page.getByLabel('奖励名称',{exact:true}).fill(q);await results(page).locator(`button[data-reward-id="${r.id}"]`).click();await expect(reverse(page)).toContainText(r.english);const expected=c.relics.filter(x=>c.relations.some(e=>e.relicId===x.id&&e.rewardId===r.id)).map(x=>x.id);expect(await reverse(page).locator('button[data-relic-id]').evaluateAll(xs=>xs.map(x=>x.getAttribute('data-relic-id')))).toEqual(expected);}
  16 |  expect(await records(page)).toEqual(before);await writeFile(evidencePath('Relic_V2_All_Added.json'),JSON.stringify({newRelics:19,newRewards:60,queries:120,exactSixRows:true,exactReverseSets:true,profilesSnapshotsImportsEqual:true},null,2));
  17 | });
  18 | test('all thirty-one complete reward tables reopen offline with finite scope and without personal writes',async({page,context})=>{
  19 |  test.setTimeout(90000);await open(page);await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);const before=await records(page);await context.setOffline(true);await page.close();const p=await context.newPage();await p.goto(TEST_ORIGIN+'/#relics');await expect(p.getByTestId('relic-count')).toHaveText('本轮已收录31个遗物');for(const r of c.relics){await choose(p,r.id);await expect(detail(p).getByTestId('relic-rewards').locator('li')).toHaveCount(6);await expect(detail(p).getByTestId('relic-route')).toHaveCount(2);await expect(detail(p)).toContainText('不是全部来源');}await p.getByLabel('遗物名称或编号',{exact:true}).fill('合成测试-未收录');await expect(results(p)).toContainText('本目录未收录／未找到');expect(await records(p)).toEqual(before);await p.screenshot({path:evidencePath('Relic_V2_Offline.png')});await writeFile(evidencePath('Relic_V2_Offline.json'),JSON.stringify({swControlled:true,closedAndReopened:true,relics:31,rewardRows:186,excerptedRoutes:62,finiteScope:true,readonly:true},null,2));
  20 | });
  21 | test('quantity reward links the existing Forma blueprint; long evidence and all results wrap at 360/412 and landscape',async({page})=>{
> 22 |  await open(page);await choose(page,'relic:lith:c15');const quantity=detail(page).getByTestId('quantity-reward');await expect(quantity).toContainText('2份');await expect(quantity).toContainText('福马蓝图');await expect(quantity).toContainText('不会自动入库');await detail(page).getByTestId('name-evidence').first().locator('summary').click();await page.screenshot({path:evidencePath('Relic_V2_Desktop.png'),fullPage:true});for(const [width,height]of [[360,860],[412,860],[860,412]]){await page.setViewportSize({width,height});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await detail(page).screenshot({path:evidencePath(`Relic_V2_Detail_${width}.png`)});}await page.getByRole('button',{name:'清空查询',exact:true}).click();await expect(results(page).locator('button[data-relic-id]')).toHaveCount(31);await page.getByRole('button',{name:'按奖励查遗物',exact:true}).click();await expect(results(page).locator('button[data-reward-id]')).toHaveCount(117);await page.screenshot({path:evidencePath('Relic_V2_Results.png')});await writeFile(evidencePath('Relic_V2_Layout.json'),JSON.stringify({viewports:[[1440,960],[360,860],[412,860],[860,412]],horizontalOverflow:false,expandedEvidence:true,quantityIsBlueprintBundle:true,relicResults:31,rewardResults:117,androidPhysical:false},null,2));
     |                                                                                                                                         ^ Error: expect(locator).toContainText(expected) failed
  23 | });
  24 | 
```