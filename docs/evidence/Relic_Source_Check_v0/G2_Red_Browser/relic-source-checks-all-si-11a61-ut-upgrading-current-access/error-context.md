# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: relic-source-checks.spec.ts >> all sixty-two source cards expose exact dated saved evidence without upgrading current access
- Location: e2e\relic-source-checks.spec.ts:11:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: getByTestId('source-check:relic:lith:c7:source:location:wfcd:79a7f0cc072fc47b')
Expected substring: "来源核验：所查官方表列出"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" getByTestId('source-check:relic:lith:c7:source:location:wfcd:79a7f0cc072fc47b') with timeout 5000ms
  - waiting for getByTestId('source-check:relic:lith:c7:source:location:wfcd:79a7f0cc072fc47b')

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
  - text: 构建 m0-c64c9827fb38 · 离线应用壳已就绪
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
      - text: Lith C7
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
    - button "查看遗物 Lith C7": 古纪 C7 遗物（Lith C7 Relic） 当前可获取未知 · 中文组合显示已对照
  - region "遗物详情":
    - button "返回查询结果"
    - paragraph: 遗物奖励与来源分别核对
    - heading "古纪 C7 遗物（Lith C7 Relic）" [level=3]
    - paragraph: 中文组合显示已对照
    - group: 名称核对依据
    - paragraph: 当前可获取：未知
    - paragraph: 6项基础奖励表已对照快照。来源仅摘录2条，不是全部来源，也不标为完整已核。
    - paragraph: 本版不展示概率。精炼开出概率和获取遗物的掉率含义不同，均不计算；以下为Intact基础表奖励关系。
    - list:
      - listitem:
        - text: 西诺斯 Prime 下弓臂（Cernos Prime Lower Limb） 部件 · 中文组合显示已对照 基础奖励表核对：表快照已对照
        - group: 名称核对依据
        - button "反查此奖励"
      - listitem:
        - text: Nyx Prime 系统蓝图（Nyx Prime Systems Blueprint） 蓝图 · 组合已对照，专名仍保留原文（中文名待核） 基础奖励表核对：表快照已对照
        - group: 名称核对依据
        - button "反查此奖励"
      - listitem:
        - text: 分裂斩斧 Prime 蓝图（Scindo Prime Blueprint） 蓝图 · 上游专名＋项目蓝图类型词 基础奖励表核对：表快照已对照
        - group: 名称核对依据
        - button "反查此奖励"
      - listitem:
        - text: Valkyr Prime 蓝图（Valkyr Prime Blueprint） 蓝图 · 组合已对照，专名仍保留原文（中文名待核） 基础奖励表核对：表快照已对照
        - group: 名称核对依据
        - button "反查此奖励"
      - listitem:
        - text: 飞扬 Prime 镖袋（Hikou Prime Pouch） 部件 · 中文组合显示已对照 基础奖励表核对：表快照已对照
        - group: 名称核对依据
        - button "反查此奖励"
      - listitem:
        - text: 福马蓝图（Forma Blueprint） 蓝图 · 沿用已有中文名 基础奖励表核对：表快照已对照 Forma Blueprint · 沿用既有福马蓝图实体，不是成品福马
        - button "反查此奖励"
    - link "固定遗物奖励表（联网打开） ↗":
      - /url: https://raw.githubusercontent.com/WFCD/warframe-drop-data/3263b2dff8bc1b434a191f0364395b156bd26561/data/relics.json
    - text: 检查：2026-10-21 · 资料快照：2026-10-07T15:18:33Z
    - link "官方公开掉落表（联网打开） ↗":
      - /url: https://warframe-web-assets.nyc3.cdn.digitaloceanspaces.com/uploads/cms/hnfvc0o3jnfvc873njb03enrf56.html
    - text: 检查：2026-10-21 · 资料快照：2026-10-07T15:18:33Z
    - heading "获取来源摘录" [level=4]
    - paragraph: 先按下述模式规则理解奖励机会；原表标签不直接等于分钟或波次，也不保证获取次数。不包含全量兑换、复刻或实时裂缝资料。
    - article:
      - heading "Venus / Bifrost Echo (Caches)" [level=4]
      - text: 中文名待核；英文原始键保留
      - heading "入口与获取说明" [level=4]
      - paragraph: 入口：航道星图 → 金星比邻星 → Bifrost Echo
      - text: 入口核对：待核；用户账号解锁未知。
      - paragraph: 基础任务模式：歼灭（社区节点表线索）
      - text: 模式核对：待核
      - paragraph: 奖励表类别：Caches：额外兴趣点奖励表，非基础任务模式
      - paragraph: 具体触发：待核
      - heading "航道额外兴趣点：Caches是额外奖励表" [level=4]
      - paragraph: 航道星图普通任务中的兴趣点机制；四节点B表的具体触发对应未逐节点核实。
      - text: 规则说明：已对照资料；公开资料核对，不是游戏亲测。
      - paragraph: 节点入口仍待核；以下是通用机制参考，不能当作该节点触发表已确认。
      - list:
        - listitem: 切换到航道星图，按对应比邻星区域和保留的节点原名找入口；当前准入未确认。
        - listitem: 按HUD完成基础任务；如发现可进入的废船／兴趣点，登船按提示完成额外目标并确认反馈。
        - listitem: 额外目标奖励仍须完成主任务才结算；金星废船与冥王星货运结构是不同区域实例。
        - listitem: 主任务完成后通过正常导航返回干船坞并等待结算，不用中止任务代替。
      - paragraph: 本条B表说明：B是此处额外奖励表索引，不是第2轮或第2个箱子。具体触发表对应未核，不能保证探索兴趣点就取得本表或指定遗物。
      - text: 轮次解释核对：待核；表中有记录不等于当前可刷。
      - list:
        - listitem: 基础任务子类型仅有社区节点表线索，仍待游戏面板核对。
        - listitem: Khufu Envoy涉及奥影玩法；机甲与剧情等具体准入未逐项确认，不因一个通用条件就判定可进入。
        - listitem: 节点中文名、具体准入、基础模式现场核对及B表具体触发未核；不将B解释为第二箱。
      - link "官方支持：航道兴趣点（联网打开） ↗":
        - /url: https://support.warframe.com/hc/en-us/articles/38820115630093-Railjack
      - text: 检查：2026-10-24 · 资料快照：未知
      - link "社区节点事实线索（非导入模块）（联网打开） ↗":
        - /url: https://wiki.warframe.com/w/Module:Missions/data
      - text: 检查：2026-10-24 · 资料快照：未知
      - link "PC官方：航道额外奖励（联网打开） ↗":
        - /url: https://www.warframe.com/en/patch-notes/pc/30-0-0
      - text: 检查：2026-10-24 · 资料快照：2021-04-13
      - group: 原始表键与旧条件（追溯）
      - paragraph: 表快照已对照 · 当前可获取：未知
      - link "固定任务掉落表（联网打开） ↗":
        - /url: https://raw.githubusercontent.com/WFCD/warframe-drop-data/3263b2dff8bc1b434a191f0364395b156bd26561/data/missionRewards.json
      - text: 检查：2026-10-21 · 资料快照：2026-10-07T15:18:33Z
      - link "官方公开掉落表（联网打开） ↗":
        - /url: https://warframe-web-assets.nyc3.cdn.digitaloceanspaces.com/uploads/cms/hnfvc0o3jnfvc873njb03enrf56.html
      - text: 检查：2026-10-21 · 资料快照：2026-10-07T15:18:33Z
    - article:
      - heading "Venus / Beacon Shield Ring (Caches)" [level=4]
      - text: 中文名待核；英文原始键保留
      - heading "入口与获取说明" [level=4]
      - paragraph: 入口：航道星图 → 金星比邻星 → Beacon Shield Ring
      - text: 入口核对：待核；用户账号解锁未知。
      - paragraph: 基础任务模式：易变反应堆破坏／Volatile（社区节点表线索）
      - text: 模式核对：待核
      - paragraph: 奖励表类别：Caches：额外兴趣点奖励表，非基础任务模式
      - paragraph: 具体触发：待核
      - heading "航道额外兴趣点：Caches是额外奖励表" [level=4]
      - paragraph: 航道星图普通任务中的兴趣点机制；四节点B表的具体触发对应未逐节点核实。
      - text: 规则说明：已对照资料；公开资料核对，不是游戏亲测。
      - paragraph: 节点入口仍待核；以下是通用机制参考，不能当作该节点触发表已确认。
      - list:
        - listitem: 切换到航道星图，按对应比邻星区域和保留的节点原名找入口；当前准入未确认。
        - listitem: 按HUD完成基础任务；如发现可进入的废船／兴趣点，登船按提示完成额外目标并确认反馈。
        - listitem: 额外目标奖励仍须完成主任务才结算；金星废船与冥王星货运结构是不同区域实例。
        - listitem: 主任务完成后通过正常导航返回干船坞并等待结算，不用中止任务代替。
      - paragraph: 本条B表说明：B是此处额外奖励表索引，不是第2轮或第2个箱子。具体触发表对应未核，不能保证探索兴趣点就取得本表或指定遗物。
      - text: 轮次解释核对：待核；表中有记录不等于当前可刷。
      - list:
        - listitem: 基础任务子类型仅有社区节点表线索，仍待游戏面板核对。
        - listitem: Khufu Envoy涉及奥影玩法；机甲与剧情等具体准入未逐项确认，不因一个通用条件就判定可进入。
        - listitem: 节点中文名、具体准入、基础模式现场核对及B表具体触发未核；不将B解释为第二箱。
      - link "官方支持：航道兴趣点（联网打开） ↗":
        - /url: https://support.warframe.com/hc/en-us/articles/38820115630093-Railjack
      - text: 检查：2026-10-24 · 资料快照：未知
      - link "社区节点事实线索（非导入模块）（联网打开） ↗":
        - /url: https://wiki.warframe.com/w/Module:Missions/data
      - text: 检查：2026-10-24 · 资料快照：未知
      - link "PC官方：航道额外奖励（联网打开） ↗":
        - /url: https://www.warframe.com/en/patch-notes/pc/30-0-0
      - text: 检查：2026-10-24 · 资料快照：2021-04-13
      - group: 原始表键与旧条件（追溯）
      - paragraph: 表快照已对照 · 当前可获取：未知
      - link "固定任务掉落表（联网打开） ↗":
        - /url: https://raw.githubusercontent.com/WFCD/warframe-drop-data/3263b2dff8bc1b434a191f0364395b156bd26561/data/missionRewards.json
      - text: 检查：2026-10-21 · 资料快照：2026-10-07T15:18:33Z
      - link "官方公开掉落表（联网打开） ↗":
        - /url: https://warframe-web-assets.nyc3.cdn.digitaloceanspaces.com/uploads/cms/hnfvc0o3jnfvc873njb03enrf56.html
      - text: 检查：2026-10-21 · 资料快照：2026-10-07T15:18:33Z
  - text: 天诺星图 · 材料与制作 v0 中文优先 / 你的数据由你保管
```

# Test source

```ts
  1  | import {test,expect,type Page} from '@playwright/test';
  2  | import {readFile,writeFile} from 'node:fs/promises';
  3  | import type {RelicCatalog} from '../src/domain/relics';
  4  | import type {RelicSourceChecks} from '../src/domain/relic-source-checks';
  5  | import {TEST_ORIGIN,evidencePath} from './environment';
  6  | const c=JSON.parse(await readFile('src/catalog/relics.v1.json','utf8')) as RelicCatalog,a=JSON.parse(await readFile('src/catalog/relic-source-checks.v1.json','utf8')) as RelicSourceChecks;
  7  | const results=(p:Page)=>p.getByRole('region',{name:'遗物查询结果',exact:true}),detail=(p:Page)=>p.getByRole('region',{name:'遗物详情',exact:true}),proof=(p:Page,id:string)=>p.getByTestId('source-check:'+id);
  8  | async function open(p:Page){await p.goto('/#relics');await expect(p.getByRole('status')).toContainText('本地档案就绪');await expect(p.getByTestId('relic-count')).toHaveText('本轮已收录31个遗物');}
  9  | async function choose(p:Page,id:string){const r=c.relics.find(r=>r.id===id)!;await p.getByRole('button',{name:'按遗物查奖励',exact:true}).click();await p.getByLabel('遗物名称或编号',{exact:true}).fill(r.tier+' '+r.code);await results(p).locator(`button[data-relic-id="${id}"]`).click();}
  10 | async function records(p:Page){return p.evaluate(()=>new Promise<unknown>((resolve,reject)=>{const q=indexedDB.open('tenno-planner');q.onerror=()=>reject(q.error);q.onsuccess=()=>{const db=q.result,tx=db.transaction(['profiles','snapshots','imports']),x=tx.objectStore('profiles').getAll(),y=tx.objectStore('snapshots').getAll(),z=tx.objectStore('imports').getAll();tx.oncomplete=()=>{resolve([x.result,y.result,z.result]);db.close();};};}));}
  11 | test('all sixty-two source cards expose exact dated saved evidence without upgrading current access',async({page})=>{
> 12 |  test.setTimeout(90000);await open(page);const before=await records(page);for(const r of c.relics){await choose(page,r.id);for(const link of c.acquisitions.filter(x=>x.relicId===r.id)){const card=proof(page,link.id),row=a.records.find(x=>x.acquisitionId===link.id)!;await expect(card).toContainText('来源核验：所查官方表列出');await expect(card).toContainText(a.document!.publishedAt!);await expect(card).toContainText(a.document!.checkedAt!.slice(0,10));await expect(card).toContainText(row.locator!.heading!);await expect(card).toContainText('Rotation '+link.rotation);await expect(card).toContainText(r.english);await expect(card).toContainText(a.document!.sha256!);await expect(card.getByTestId('official-check-link')).toHaveAttribute('href',a.document!.sourceUrl+'#missionRewards');await expect(detail(page)).toContainText('当前可获取：未知');}}expect(await records(page)).toEqual(before);await writeFile(evidencePath('Source_Check_All_62.json'),JSON.stringify({checked:62,sourceHash:a.document!.sha256,publishedAt:a.document!.publishedAt,checkedAt:a.document!.checkedAt,exactHeadingRotationEnglish:true,currentAvailabilityStillUnknown:true,readonly:true},null,2));
     |                                                                                                                                                                                                                                                                                              ^ Error: expect(locator).toContainText(expected) failed
  13 | });
  14 | test('saved-evidence filters, reverse search, returns and profile switches are readonly and consistent across entry points',async({page})=>{
  15 |  await open(page);await page.getByRole('button',{name:'＋ 新建空白档案',exact:true}).click();await expect(page.getByRole('status')).toContainText('已创建');const one=await page.getByLabel('切换档案').inputValue();await page.getByRole('button',{name:'＋ 新建空白档案',exact:true}).click();await expect(page.getByRole('status')).toContainText('已创建');const two=await page.getByLabel('切换档案').inputValue(),before=await records(page);
  16 |  await page.getByLabel('来源核验筛选',{exact:true}).selectOption('listed');await expect(results(page).locator('button[data-relic-id]')).toHaveCount(31);for(const filter of ['pending','not-listed']){await page.getByLabel('来源核验筛选',{exact:true}).selectOption(filter);await expect(results(page).locator('button[data-relic-id]')).toHaveCount(0);await expect(results(page)).toContainText('当前核验筛选无匹配');}await page.getByLabel('来源核验筛选',{exact:true}).selectOption('all');await choose(page,'relic:lith:c7');const first=c.acquisitions.find(x=>x.relicId==='relic:lith:c7')!;const initial=await proof(page,first.id).textContent();await detail(page).getByTestId('reward:blueprint:forma').getByRole('button',{name:'反查此奖励',exact:true}).click();await page.getByRole('region',{name:'奖励反查结果',exact:true}).getByRole('button',{name:'查看遗物 Lith C7',exact:true}).click();expect(await proof(page,first.id).textContent()).toBe(initial);for(const id of [one,two]){await page.getByLabel('切换档案').selectOption(id);expect(await proof(page,first.id).textContent()).toBe(initial);}await detail(page).getByRole('button',{name:'返回查询结果',exact:true}).click();await page.getByRole('button',{name:'清空查询',exact:true}).click();expect(await records(page)).toEqual(before);await writeFile(evidencePath('Source_Check_Readonly.json'),JSON.stringify({filters:['all','listed','not-listed','pending'],listedRelics:31,pendingRelics:0,notListedRelics:0,reverseDateConsistent:true,profileSwitches:true,profilesSnapshotsImportsEqual:true},null,2));
  17 | });
  18 | test('all saved source evidence and filtering reopen offline without substituting a fresh verification date',async({page,context})=>{
  19 |  test.setTimeout(90000);await open(page);await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);const before=await records(page);await context.setOffline(true);await page.close();const p=await context.newPage();await p.goto(TEST_ORIGIN+'/#relics');for(const r of c.relics){await choose(p,r.id);for(const link of c.acquisitions.filter(x=>x.relicId===r.id)){await expect(proof(p,link.id)).toContainText(a.document!.checkedAt!.slice(0,10));await expect(proof(p,link.id)).toContainText('非实时');}}await p.getByLabel('来源核验筛选',{exact:true}).selectOption('listed');await expect(results(p).locator('button[data-relic-id]')).toHaveCount(1);await p.getByRole('button',{name:'清空查询',exact:true}).click();await expect(results(p).locator('button[data-relic-id]')).toHaveCount(31);expect(await records(p)).toEqual(before);await p.screenshot({path:evidencePath('Source_Check_Offline.png')});await writeFile(evidencePath('Source_Check_Offline.json'),JSON.stringify({swControlled:true,closedAndReopened:true,evidenceRows:62,savedDatesPreserved:true,noAutomaticNetworkVerification:true,readonly:true},null,2));
  20 | });
  21 | test('Caches warnings and mirror distinction survive readable dated proof at desktop 360 412 and landscape',async({page})=>{
  22 |  await open(page);await choose(page,'relic:lith:c7');const link=c.acquisitions.find(x=>x.relicId==='relic:lith:c7')!,card=proof(page,link.id);await expect(card).toContainText('具体触发待核');await expect(card).toContainText('不是第二箱或第二轮');await card.locator('summary').click();await page.screenshot({path:evidencePath('Source_Check_Desktop.png'),fullPage:true});for(const [width,height]of [[360,860],[412,860],[860,412]]){await page.setViewportSize({width,height});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await card.screenshot({path:evidencePath(`Source_Check_Card_${width}.png`)});}const mirror=c.acquisitions.find(x=>c.locations.find(l=>l.id===x.locationId)?.node==='Tyana Pass')!;await choose(page,mirror.relicId);await expect(detail(page)).toContainText('镜像防御');await expect(proof(page,mirror.id)).toContainText('Defense分组只作原表定位');await writeFile(evidencePath('Source_Check_Layout.json'),JSON.stringify({viewports:[[1440,960],[360,860],[412,860],[860,412]],horizontalOverflow:false,cachesTriggerPending:true,mirrorGuideKept:true,expandedProof:true,androidPhysical:false},null,2));
  23 | });
  24 | 
```