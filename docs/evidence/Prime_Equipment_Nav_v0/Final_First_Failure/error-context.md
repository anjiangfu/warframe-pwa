# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: actions.spec.ts >> unsaved overview facts block a production update; cancel keeps the draft and later update retains explicit save
- Location: e2e\actions.spec.ts:53:1

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false

Call Log:
- Timeout 5000ms exceeded while waiting on the predicate
```

# Page snapshot

```yaml
- generic [ref=f1e3]:
  - complementary [ref=f1e4]:
    - generic [ref=f1e5]:
      - generic [ref=f1e6]: ✦
      - generic [ref=f1e7]:
        - text: 天诺星图
        - generic [ref=f1e8]: 本地行动档案
    - generic [ref=f1e9]:
      - text: 当前档案
      - combobox "切换档案" [ref=f1e10]:
        - option "尚未创建" [disabled]
        - option "空白行动档案" [selected]
      - generic [ref=f1e11]:
        - generic [ref=f1e12]:
          - generic [ref=f1e13]: MR
          - strong [ref=f1e14]: "?"
        - generic [ref=f1e15]:
          - text: 目标 未知
          - generic [ref=f1e16]: 未知 分钟 / 日
      - paragraph [ref=f1e18]: 0 项目标已完成
    - navigation [ref=f1e19]:
      - button "养成助手" [ref=f1e20] [cursor=pointer]:
        - generic [ref=f1e21]: ✧
        - text: 养成助手
        - generic [ref=f1e22]: ↗
      - button "互动科技树" [ref=f1e23] [cursor=pointer]:
        - generic [ref=f1e24]: ◇
        - text: 互动科技树
        - generic [ref=f1e25]: ↗
      - button "材料查询" [ref=f1e26] [cursor=pointer]:
        - generic [ref=f1e27]: ⌕
        - text: 材料查询
        - generic [ref=f1e28]: ↗
      - button "制作缺口" [ref=f1e29] [cursor=pointer]:
        - generic [ref=f1e30]: ▱
        - text: 制作缺口
        - generic [ref=f1e31]: ↗
      - button "集团晋升" [ref=f1e32] [cursor=pointer]:
        - generic [ref=f1e33]: ⊙
        - text: 集团晋升
        - generic [ref=f1e34]: ↗
      - button "虚空遗物" [ref=f1e35] [cursor=pointer]:
        - generic [ref=f1e36]: ◈
        - text: 虚空遗物
        - generic [ref=f1e37]: ↗
      - button "档案与物资" [ref=f1e38] [cursor=pointer]:
        - generic [ref=f1e39]: ▤
        - text: 档案与物资
        - generic [ref=f1e40]: ↗
      - button "备份与恢复" [ref=f1e41] [cursor=pointer]:
        - generic [ref=f1e42]: ⇅
        - text: 备份与恢复
        - generic [ref=f1e43]: ↗
      - button "行动日志" [ref=f1e44] [cursor=pointer]:
        - generic [ref=f1e45]: ≡
        - text: 行动日志
        - generic [ref=f1e46]: ↗
    - generic [ref=f1e47]:
      - text: 个人资料仅存此设备
      - paragraph [ref=f1e49]: 动态资料：尚未同步
      - button "＋ 新建空白档案" [ref=f1e50] [cursor=pointer]
  - main [ref=f1e51]:
    - generic [ref=f1e52]: 构建 actions-v1 · 正在准备离线资源
    - generic [ref=f1e53]:
      - generic [ref=f1e54]:
        - paragraph [ref=f1e55]: TENNO / 个人进度终端
        - heading "把下一步，变成自己的路线。" [level=1] [ref=f1e56]
        - paragraph [ref=f1e57]: 记录养成，保留选择。无需游戏账号或云端登录。
      - generic [ref=f1e58]:
        - text: ● 浏览器在线
        - generic [ref=f1e59]: 档案在本机
    - generic [ref=f1e60]:
      - status [ref=f1e61]: 本地档案就绪
      - generic [ref=f1e62]: 用户模板 · 事实待核实
    - generic [ref=f1e64]:
      - generic [ref=f1e65]:
        - generic [ref=f1e66]:
          - paragraph [ref=f1e67]: 目标 → 当前卡点 → 下一步行动
          - heading "通用目标助手" [level=2] [ref=f1e68]
          - paragraph [ref=f1e69]: 按你的手工记录解释下一步，不读取游戏账号，不按未知资料计算天数。
        - generic [ref=f1e70]: 资料 2026.10.21.1
      - region "行动清单" [ref=f1e71]:
        - generic [ref=f1e72]:
          - generic [ref=f1e73]:
            - paragraph [ref=f1e74]: 已保存记录 / 只读行动概览
            - heading "行动清单" [level=2] [ref=f1e75]
          - generic [ref=f1e76]: 每日预算：未填写 · 耗时未估
        - paragraph [ref=f1e77]: 先列你关注的目标，其余按资料顺序。没有耗时或收益证据，不承诺几局、天数或预算内完成；以下不会自动扣料或更新进度。
        - paragraph [ref=f1e78]: 共2条行动，当前显示2条
        - generic [ref=f1e79]:
          - article [ref=f1e80]:
            - paragraph [ref=f1e81]: 已关注
            - heading "普通福马蓝图制作 · 本次制作" [level=3] [ref=f1e82]
            - heading "下一步" [level=4] [ref=f1e83]
            - paragraph [ref=f1e84]: 打开制作需求，先核对资料与未知库存
            - heading "原因" [level=4] [ref=f1e85]
            - paragraph [ref=f1e86]: 未知不能按0计算；旧引用与已有数量保留。
            - paragraph [ref=f1e87]: 核对入口：制作缺口 · 游戏铸造厂前提核对
            - generic [ref=f1e88]:
              - generic [ref=f1e89]: 候选地点 · 路线已对照资料
              - paragraph [ref=f1e90]: 导航 · 虚空裂缝列表 → 对应纪元遗物
              - paragraph [ref=f1e91]: 裂缝任务 · 开启遗物（非固定星图节点）
              - generic [ref=f1e92]: 核对日期：2026-10-20；这里只展示已有线索，不代表你已解锁或一定能参加。
            - heading "未知事项 / 开始前核对" [level=4] [ref=f1e93]
            - list [ref=f1e94]:
              - listitem [ref=f1e95]: 蓝图为单次消耗，持有张数另列；不要由科技树状态推断。
              - listitem [ref=f1e96]: 铸造厂、裂缝及相关地图是否开放未确认。
              - listitem [ref=f1e97]: 材料满足只表示已知投入足够；开始制作前请核对当前游戏界面。
              - listitem [ref=f1e98]: 福马蓝图（Forma Blueprint）库存未知
              - listitem [ref=f1e99]: 非晶态合金（Morphics）库存未知
              - listitem [ref=f1e100]: 神经传感器（Neural Sensors）库存未知
              - listitem [ref=f1e101]: 神经元（Neurodes）库存未知
              - listitem [ref=f1e102]: 奥罗金电池（Orokin Cell）库存未知
              - listitem [ref=f1e103]: 地图与任务开放尚未确认，材料够用不等于可以进入或完成
            - generic [ref=f1e104]:
              - button "查看制作需求" [ref=f1e105] [cursor=pointer]
              - button "查看材料 福马蓝图" [ref=f1e106] [cursor=pointer]
              - button "查看材料 非晶态合金" [ref=f1e107] [cursor=pointer]
              - button "查看材料 神经传感器" [ref=f1e108] [cursor=pointer]
              - button "查看材料 神经元" [ref=f1e109] [cursor=pointer]
              - button "查看材料 奥罗金电池" [ref=f1e110] [cursor=pointer]
            - paragraph [ref=f1e111]: 耗时未估；单项目材料入口不作共享库存分配，合计请看下方唯一汇总入口。
          - article [ref=f1e112]:
            - paragraph [ref=f1e113]: 已关注
            - heading "六人组 · 晋升目标" [level=3] [ref=f1e114]
            - heading "下一步" [level=4] [ref=f1e115]
            - paragraph [ref=f1e116]: 前往KIM核对六人档案，完成介绍对话后核对对应赏金；为终章准备关系。
            - heading "原因" [level=4] [ref=f1e117]
            - paragraph [ref=f1e118]: 只判断当前一步；四类条件分别核对，不自动改等级或余额。
            - paragraph [ref=f1e119]: 核对入口：集团晋升 · 3 → 4 · 四类条件核对
            - generic [ref=f1e120]:
              - paragraph [ref=f1e121]: 声望：未满足
              - paragraph [ref=f1e122]: 祭品与货币：未知
              - paragraph [ref=f1e123]: 任务：未知
              - paragraph [ref=f1e124]: 关系：未知
            - generic [ref=f1e125]:
              - generic [ref=f1e126]: 候选地点 · 路线已对照资料
              - paragraph [ref=f1e127]: 霍瓦尼亚 · Rhu Manor
              - paragraph [ref=f1e128]: 普通难度 · 歼灭（科腐者）
              - generic [ref=f1e129]: 核对日期：2026-10-20；这里只展示已有线索，不代表你已解锁或一定能参加。
            - heading "未知事项 / 开始前核对" [level=4] [ref=f1e130]
            - list [ref=f1e131]:
              - listitem [ref=f1e132]: 地图与任务开放尚未确认，材料够用不等于可以进入或完成
              - listitem [ref=f1e133]: 祭品与货币记录或资料未知
              - listitem [ref=f1e134]: 任务记录或资料未知
              - listitem [ref=f1e135]: 关系记录或资料未知
              - listitem [ref=f1e136]: 科腐者几丁质持有量未知
              - listitem [ref=f1e137]: 殁世线圈持有量未知
              - listitem [ref=f1e138]: 艾弗旺样本持有量未知
            - generic [ref=f1e139]:
              - button "查看晋升条件" [ref=f1e140] [cursor=pointer]
              - button "查看材料 科腐者几丁质" [ref=f1e141] [cursor=pointer]
              - button "查看材料 殁世线圈" [ref=f1e142] [cursor=pointer]
              - button "查看材料 艾弗旺样本" [ref=f1e143] [cursor=pointer]
            - paragraph [ref=f1e144]: 耗时未估；单项目材料入口不作共享库存分配，合计请看下方唯一汇总入口。
        - generic [ref=f1e145]:
          - heading "当前共享材料" [level=3] [ref=f1e146]
          - paragraph [ref=f1e147]: 库存未知，缺口待核
          - paragraph [ref=f1e148]: 已知共享缺项：星币（Credits） 35000
          - paragraph [ref=f1e149]: 同资源先合计，再抵扣一次库存；不把各项目差值相加，也不按地点文字合并刷图任务。
          - list [ref=f1e150]:
            - listitem [ref=f1e151]: 普通福马蓝图制作
            - listitem [ref=f1e152]: 六人组 · 下一次晋升
          - button "查看当前共享汇总" [ref=f1e153] [cursor=pointer]
      - generic [ref=f1e154]:
        - generic [ref=f1e155]:
          - text: 当前查看目标
          - combobox "当前目标" [ref=f1e156]:
            - option "毒囊双枪整体养成 · 信息待确认"
            - option "大嘴（Helminth）安装 · 信息待确认"
            - option "原力石模块 · 用户原称 · 信息待确认"
            - option "海波单剑整体养成 · 信息待确认"
            - option "普通福马蓝图制作 · 本次制作 · 信息待确认" [selected]
            - option "六人组 · 晋升目标 · 信息待确认"
        - generic [ref=f1e157]:
          - text: 目标安排
          - combobox "目标安排" [ref=f1e158]:
            - option "待核对"
            - option "关注" [selected]
            - option "整体目标已完成"
            - option "暂缓"
      - region "当前目标卡点" [ref=f1e159]:
        - generic [ref=f1e160]: 信息待确认
        - heading "普通福马蓝图制作 · 本次制作" [level=3] [ref=f1e161]
        - paragraph [ref=f1e162]: 计划是新制作产出，不扣除现有成品；完成不自动增减库存。
        - heading "建议下一步" [level=4] [ref=f1e163]
        - paragraph [ref=f1e164]: 打开制作需求，先核对资料与未知库存
        - heading "为什么" [level=4] [ref=f1e165]
        - paragraph [ref=f1e166]: 未知不能按0计算；旧引用与已有数量保留。
        - heading "未确认事项" [level=4] [ref=f1e167]
        - list [ref=f1e168]:
          - listitem [ref=f1e169]: 蓝图为单次消耗，持有张数另列；不要由科技树状态推断。
          - listitem [ref=f1e170]: 铸造厂、裂缝及相关地图是否开放未确认。
          - listitem [ref=f1e171]: 材料满足只表示已知投入足够；开始制作前请核对当前游戏界面。
          - listitem [ref=f1e172]: blueprint:forma库存未知
          - listitem [ref=f1e173]: material:morphics库存未知
          - listitem [ref=f1e174]: material:neural-sensors库存未知
          - listitem [ref=f1e175]: material:neurodes库存未知
          - listitem [ref=f1e176]: material:orokin-cell库存未知
        - generic [ref=f1e177]:
          - button "查看缺项 星币 需35000 / 持有100000 / 缺口0" [ref=f1e178] [cursor=pointer]:
            - text: 查看缺项 星币
            - generic [ref=f1e179]: 需35000 / 持有100000 / 缺口0
          - button "查看缺项 福马蓝图 需1 / 持有未知 / 缺口未知" [ref=f1e180] [cursor=pointer]:
            - text: 查看缺项 福马蓝图
            - generic [ref=f1e181]: 需1 / 持有未知 / 缺口未知
          - button "查看缺项 非晶态合金 需1 / 持有未知 / 缺口未知" [ref=f1e182] [cursor=pointer]:
            - text: 查看缺项 非晶态合金
            - generic [ref=f1e183]: 需1 / 持有未知 / 缺口未知
          - button "查看缺项 神经传感器 需1 / 持有未知 / 缺口未知" [ref=f1e184] [cursor=pointer]:
            - text: 查看缺项 神经传感器
            - generic [ref=f1e185]: 需1 / 持有未知 / 缺口未知
          - button "查看缺项 神经元 需1 / 持有未知 / 缺口未知" [ref=f1e186] [cursor=pointer]:
            - text: 查看缺项 神经元
            - generic [ref=f1e187]: 需1 / 持有未知 / 缺口未知
          - button "查看缺项 奥罗金电池 需1 / 持有未知 / 缺口未知" [ref=f1e188] [cursor=pointer]:
            - text: 查看缺项 奥罗金电池
            - generic [ref=f1e189]: 需1 / 持有未知 / 缺口未知
        - button "打开制作需求" [ref=f1e190] [cursor=pointer]
        - paragraph [ref=f1e191]: 树是原路线记录；整体养成声明、具体安装事实和进化分项含义不同，不自动互相补写。
      - group [ref=f1e192]:
        - generic "待办建议 · 6项（完成／暂缓已排除）" [ref=f1e193] [cursor=pointer]
        - button "普通福马蓝图制作 · 本次制作 信息待确认" [ref=f1e194] [cursor=pointer]:
          - text: 普通福马蓝图制作 · 本次制作
          - generic [ref=f1e195]: 信息待确认
        - button "六人组 · 晋升目标 信息待确认" [ref=f1e196] [cursor=pointer]:
          - text: 六人组 · 晋升目标
          - generic [ref=f1e197]: 信息待确认
        - button "毒囊双枪整体养成 信息待确认" [ref=f1e198] [cursor=pointer]:
          - text: 毒囊双枪整体养成
          - generic [ref=f1e199]: 信息待确认
        - button "大嘴（Helminth）安装 信息待确认" [ref=f1e200] [cursor=pointer]:
          - text: 大嘴（Helminth）安装
          - generic [ref=f1e201]: 信息待确认
        - button "原力石模块 · 用户原称 信息待确认" [ref=f1e202] [cursor=pointer]:
          - text: 原力石模块 · 用户原称
          - generic [ref=f1e203]: 信息待确认
        - button "海波单剑整体养成 信息待确认" [ref=f1e204] [cursor=pointer]:
          - text: 海波单剑整体养成
          - generic [ref=f1e205]: 信息待确认
      - generic [ref=f1e207]:
        - generic [ref=f1e208]:
          - paragraph [ref=f1e209]: 你的近况 / 仅显式应用
          - heading "本次进度草案" [level=3] [ref=f1e210]
          - paragraph [ref=f1e211]: 2026-10-18你提供的近况不会成为新档案默认值。
        - button "预览本次进度草案" [ref=f1e212] [cursor=pointer]
      - generic [ref=f1e213]:
        - paragraph [ref=f1e214]: 手工摘要 / 不推算天数
        - heading "1999声望记录" [level=3] [ref=f1e215]
        - paragraph [ref=f1e216]: 当前等级：3；当前声望点数：0
        - generic [ref=f1e217]:
          - generic [ref=f1e218]:
            - text: 当前实际等级
            - spinbutton "1999等级" [ref=f1e219]: "3"
          - generic [ref=f1e220]:
            - text: 当前可用声望点数
            - spinbutton "1999声望点数" [ref=f1e221]: "0"
          - paragraph [ref=f1e222]: 将保存等级：3；声望：0。等级与点数分开，不假定晋升后剩0。
          - button "保存1999摘要" [ref=f1e223] [cursor=pointer]
        - paragraph [ref=f1e224]: 其他集团具体进度未填写。
        - paragraph [ref=f1e225]: 这里只保存你的声明，不计算晋升材料、每日上限、关系、轮换、优先级或等待天数。
    - generic [ref=f1e226]:
      - text: 天诺星图 · 材料与制作 v0
      - generic [ref=f1e227]: 中文优先 / 你的数据由你保管
```

# Test source

```ts
  1  | import {test,expect,type Page} from '@playwright/test';
  2  | import {readFile,writeFile} from 'node:fs/promises';
  3  | import {execFileSync} from 'node:child_process';
  4  | import {resolve} from 'node:path';
  5  | import type {ProfileDocument} from '../src/domain/model';
  6  | import {evidencePath,TEST_ORIGIN} from './environment';
  7  | const overview=(page:Page)=>page.getByRole('region',{name:'行动清单',exact:true});
  8  | const card=(page:Page,id:string)=>overview(page).getByTestId('action:'+id);
  9  | async function records(page:Page){return page.evaluate(()=>new Promise<{profiles:ProfileDocument[];snapshots:unknown[];imports:unknown[]}>((resolve,reject)=>{const r=indexedDB.open('tenno-planner');r.onerror=()=>reject(r.error);r.onsuccess=()=>{const db=r.result,tx=db.transaction(['profiles','snapshots','imports']),p=tx.objectStore('profiles').getAll(),s=tx.objectStore('snapshots').getAll(),i=tx.objectStore('imports').getAll();tx.oncomplete=()=>{db.close();resolve({profiles:p.result,snapshots:s.result,imports:i.result});};};}));}
  10 | async function create(page:Page,patch:Partial<ProfileDocument>={}){
  11 |  await page.goto('/#assistant');await page.getByRole('button',{name:'从空白档案开始',exact:true}).click();await expect(page.getByRole('status')).toContainText('已创建');const id=await page.getByLabel('切换档案').inputValue();
  12 |  // Only this Playwright context's synthetic database is seeded, before assertions.
  13 |  await page.evaluate(([id,patch])=>new Promise<void>((resolve,reject)=>{const r=indexedDB.open('tenno-planner');r.onerror=()=>reject(r.error);r.onsuccess=()=>{const db=r.result,tx=db.transaction('profiles','readwrite'),store=tx.objectStore('profiles'),get=store.get(id);get.onsuccess=()=>{const p=get.result;Object.assign(p,patch);p.revision++;store.put(p);};tx.oncomplete=()=>{db.close();resolve();};tx.onabort=()=>reject(tx.error);};}),[id,patch] as const);await page.reload();await expect(overview(page)).toBeVisible();return id;
  14 | }
  15 | const sharedFixture:Partial<ProfileDocument>={craftingTargets:{'recipe:forma':1},syndicateTargets:{'syndicate:hex':5},goalStates:{'crafting:recipe:forma':'focused','goal:syndicate:hex':'focused'},stock:{credits:100000},personalFacts:{'syndicate:hex:rank':{value:3,recordedAt:'t'},'syndicate:hex:standing':{value:0,recordedAt:'t'}}};
  16 | 
  17 | test('blank action list has no historical facts; focus sorting, top three, expansion and browsing are read only',async({page})=>{
  18 |  await create(page);await expect(overview(page)).toContainText('尚无已记录的行动目标');await expect(overview(page).getByTestId('action-budget')).toContainText('未填写');const empty=await records(page);await overview(page).getByRole('button',{name:'查看目标核对入口',exact:true}).click();expect(await records(page)).toEqual(empty);
  19 |  await page.getByLabel('当前目标',{exact:true}).selectOption('goal:dual-toxocyst');for(const id of ['goal:dual-toxocyst','goal:helminth-install','goal:shard-module','goal:nami-solo']){await page.getByLabel('当前目标',{exact:true}).selectOption(id);await page.getByLabel('目标安排',{exact:true}).selectOption('focused');await expect(page.getByRole('status')).toContainText('已保存');}
  20 |  await page.getByRole('button',{name:'制作缺口',exact:true}).click();await page.getByRole('button',{name:'加入制作目标',exact:true}).click();await expect(page.getByRole('status')).toContainText('已保存');await page.getByRole('button',{name:'养成助手',exact:true}).click();const before=await records(page);
  21 |  await expect(overview(page).getByTestId('action-count')).toHaveText('共5条行动，当前显示3条');await expect(overview(page).locator('article[data-testid^="action:"]')).toHaveCount(3);await overview(page).getByRole('button',{name:'展开全部5条行动'}).click();await expect(overview(page).locator('article[data-testid^="action:"]')).toHaveCount(5);expect(await overview(page).locator('article[data-testid^="action:"]').evaluateAll(xs=>xs.map(x=>x.getAttribute('data-testid')))).toEqual(['action:goal:dual-toxocyst','action:goal:helminth-install','action:goal:shard-module','action:goal:nami-solo','action:crafting:recipe:forma']);
  22 |  await overview(page).getByRole('button',{name:'收起为前三条'}).click();expect(await records(page)).toEqual(before);await writeFile(evidencePath('Actions_Readonly.json'),JSON.stringify({emptyNoHistory:true,focusCatalogOrder:true,topThreeCanExpand:true,queryExpandNoWrites:true},null,2));
  23 | });
  24 | test('completed and installed targets are excluded; operation and unverified material links use existing guides',async({page})=>{
  25 |  await create(page,{goalStates:{'goal:dual-toxocyst':'done','goal:nami-solo':'focused'},personalFacts:{'system:helminth:installed':{value:true,recordedAt:'t'}},weaponProgress:{'weapon:nami-solo':{owned:null,adapterOwned:null,installed:null,currentStageId:'nami-solo:iv',stages:{}}}});const before=await records(page);
  26 |  await expect(card(page,'goal:dual-toxocyst')).toHaveCount(0);await expect(card(page,'goal:helminth-install')).toHaveCount(0);await card(page,'goal:nami-solo').getByRole('button',{name:'查看操作攻略',exact:true}).click();await expect(page.getByLabel('当前进化',{exact:true})).toHaveValue('nami-solo:iv');await expect(page.locator('[data-stage-id="nami-solo:iv"] details')).toHaveAttribute('open','');expect(await records(page)).toEqual(before);
  27 |  await page.getByLabel('当前目标',{exact:true}).selectOption('goal:dual-toxocyst');await page.getByLabel('目标安排',{exact:true}).selectOption('focused');await expect(page.getByRole('status')).toContainText('已保存');for(const label of ['拥有本体','拥有适配器']){await page.getByLabel(label,{exact:true}).selectOption('yes');await expect(page.getByRole('status')).toContainText('已保存');}await page.getByLabel('已安装灵化之源',{exact:true}).selectOption('no');await expect(page.getByRole('status')).toContainText('已保存');
  28 |  // All three stock values unknown still exposes a candidate and the entry uncertainty.
  29 |  await expect(card(page,'goal:dual-toxocyst')).toContainText('地图');const saved=await records(page);await card(page,'goal:dual-toxocyst').getByRole('button',{name:'查看材料 瑶丛',exact:true}).click();await expect(page.getByRole('region',{name:'材料详情'})).toContainText('路线待核');expect(await records(page)).toEqual(saved);
  30 |  await writeFile(evidencePath('Actions_Guides.json'),JSON.stringify({completedInstalledExcluded:true,recordedStageGuide:true,noEarlierStagesWritten:true,unverifiedRouteReadable:true},null,2));
  31 | });
  32 | test('shared entry uses one deduction and follows quantity, inventory, next rank and goal status across pages',async({page,context})=>{
  33 |  test.setTimeout(60000);await create(page,sharedFixture);await expect(overview(page).getByTestId('action-known-missing')).toContainText('35000');await expect(overview(page).getByTestId('action-summary-state')).toContainText('库存未知');await expect(card(page,'goal:syndicate:hex')).toContainText('任务：未知');await expect(overview(page).getByRole('button',{name:'查看当前共享汇总',exact:true})).toHaveCount(1);await overview(page).getByRole('button',{name:'查看当前共享汇总',exact:true}).click();await expect(page.getByTestId('summary-credits')).toContainText('135000');await expect(page.getByTestId('summary-credits')).toContainText('35000');
  34 |  const second=await context.newPage();await second.goto(TEST_ORIGIN+'/#crafting');await second.getByLabel('本次计划新制作数量').fill('2');await second.getByRole('button',{name:'保存制作数量',exact:true}).click();await expect(second.getByRole('status')).toContainText('已保存');await expect(page.getByTestId('summary-credits')).toContainText('170000');
  35 |  await second.getByRole('button',{name:'档案与物资',exact:true}).click();await second.getByLabel('星币（Credits）库存').fill('');await second.getByRole('button',{name:'保存库存',exact:true}).click();await expect(second.getByRole('status')).toContainText('已保存');await expect(page.getByTestId('summary-credits')).toContainText('未知');
  36 |  await second.getByRole('button',{name:'集团晋升',exact:true}).click();await second.getByLabel('集团当前等级',{exact:true}).fill('4');await second.getByLabel('等级变更后的声望处理').selectOption('unknown');await second.getByRole('button',{name:'保存集团事实',exact:true}).click();await expect(second.getByRole('status')).toContainText('已保存');await page.getByRole('button',{name:'养成助手',exact:true}).click();await expect(card(page,'goal:syndicate:hex')).toContainText('4 → 5');
  37 |  await second.getByLabel('晋升目标状态').selectOption('done');await expect(card(page,'goal:syndicate:hex')).toHaveCount(0);await second.getByLabel('晋升目标状态').selectOption('focused');await expect(card(page,'goal:syndicate:hex')).toHaveCount(1);
  38 |  await second.getByRole('button',{name:'制作缺口',exact:true}).click();await second.getByLabel('制作目标状态').selectOption('deferred');await expect(card(page,'crafting:recipe:forma')).toHaveCount(0);await second.getByLabel('制作目标状态').selectOption('focused');await expect(card(page,'crafting:recipe:forma')).toHaveCount(1);
  39 |  await writeFile(evidencePath('Actions_Live.json'),JSON.stringify({credits135000Minus100000Equals35000:true,quantityAndUnknownStockFollow:true,nextRankOnly:true,statusAndResumeRecompute:true},null,2));
  40 | });
  41 | test('action navigation preserves unsaved facts, stale writes fail and profile switches do not leak actions',async({page,context})=>{
  42 |  const id=await create(page,sharedFixture);await page.getByLabel('1999声望点数',{exact:true}).fill('12345');const before=await records(page);await card(page,'crafting:recipe:forma').getByRole('button',{name:'查看制作需求',exact:true}).click();await expect(page.getByRole('alert')).toContainText('未保存');await expect(page.getByLabel('1999声望点数',{exact:true})).toHaveValue('12345');expect(await records(page)).toEqual(before);
  43 |  const second=await context.newPage();await second.goto(TEST_ORIGIN+'/#syndicates');await second.getByLabel('集团当前声望',{exact:true}).fill('9');await second.getByRole('button',{name:'保存集团事实',exact:true}).click();await expect(second.getByRole('status')).toContainText('已保存');const changed=await records(second);await expect(page.getByRole('alert')).toContainText('其他页面');await page.getByRole('button',{name:'保存1999摘要',exact:true}).click();await expect(page.getByRole('status')).toContainText('保存失败');expect(await records(page)).toEqual(changed);
  44 |  await page.getByRole('button',{name:'重新载入档案',exact:true}).click();await expect(page.getByLabel('1999声望点数',{exact:true})).toHaveValue('9');await page.getByRole('button',{name:'＋ 新建空白档案'}).click();await expect(overview(page)).toContainText('尚无已记录的行动目标');await page.getByLabel('切换档案').selectOption(id);await expect(card(page,'crafting:recipe:forma')).toHaveCount(1);
  45 |  await writeFile(evidencePath('Actions_Draft_Protection.json'),JSON.stringify({navigationBlockedBeforeDiscard:true,draftPreserved:true,staleRevisionRejected:true,reloadAndProfileSwitch:true},null,2));
  46 | });
  47 | test('full backup restores business state and derived actions reopen offline with desktop and mobile views',async({page,context})=>{
  48 |  await create(page,sharedFixture);const before=(await records(page)).profiles[0];await page.getByRole('button',{name:'备份与恢复',exact:true}).click();const wait=page.waitForEvent('download');await page.getByRole('button',{name:'↓ 导出完整备份',exact:true}).click();const file=(await(await wait).path())!,backup=JSON.parse(await readFile(file,'utf8'));expect(backup.profile).toEqual(before);expect(backup.profile.actions).toBeUndefined();await page.getByLabel('选择存档文件').setInputFiles(file);await page.getByLabel('我已核对目标，确认新建').check();await page.getByRole('button',{name:'确认导入',exact:true}).click();await expect(page.getByRole('status')).toContainText('导入完成');const restoredId=await page.getByLabel('切换档案').inputValue();await page.reload();await page.getByLabel('切换档案').selectOption(restoredId);const restored=(await records(page)).profiles.find(p=>p.id===restoredId)!;expect({...restored,id:before.id,revision:before.revision}).toEqual(before);
  49 |  await page.getByRole('button',{name:'养成助手',exact:true}).click();await page.screenshot({path:evidencePath('Actions_Desktop.png'),fullPage:true});await overview(page).screenshot({path:evidencePath('Actions_Overview_Desktop.png')});for(const width of [360,412]){await page.setViewportSize({width,height:860});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:evidencePath(`Actions_Mobile_${width}.png`),fullPage:true});await overview(page).screenshot({path:evidencePath(`Actions_Overview_Mobile_${width}.png`)});}
  50 |  await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);await context.setOffline(true);await page.close();const offline=await context.newPage();await offline.goto(TEST_ORIGIN+'/#assistant');await offline.getByLabel('切换档案').selectOption(restoredId);await expect(card(offline,'crafting:recipe:forma')).toBeVisible();await overview(offline).getByRole('button',{name:'查看当前共享汇总',exact:true}).click();await offline.getByTestId('summary-credits').getByRole('button',{name:'星币（Credits）',exact:true}).click();await expect(offline.getByRole('region',{name:'材料详情'})).toContainText('The Index');
  51 |  await writeFile(evidencePath('Actions_Restore_Offline.json'),JSON.stringify({allBusinessEqual:true,derivedActionsNotExported:true,offlineCloseReopen:true,existingRoutesOffline:true},null,2));
  52 | });
  53 | test('unsaved overview facts block a production update; cancel keeps the draft and later update retains explicit save',async({page})=>{
  54 |  test.setTimeout(60000);const rebuild=(id?:string)=>{const env={...process.env};if(id)env.APP_BUILD_ID=id;else delete env.APP_BUILD_ID;execFileSync(process.execPath,[resolve('node_modules/vite/bin/vite.js'),'build'],{env,stdio:'pipe'});};
> 55 |  try{rebuild('actions-v1');await create(page,sharedFixture);await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);await page.getByLabel('1999声望点数',{exact:true}).fill('12345');rebuild('actions-v2');await page.evaluate(async()=>{await(await navigator.serviceWorker.getRegistration())!.update();});await expect(page.getByRole('region',{name:'应用更新'})).toBeVisible();await page.getByRole('button',{name:'保存后更新',exact:true}).click();await expect(page.getByRole('region',{name:'应用更新'})).toContainText('未提交表单');await page.getByRole('button',{name:'取消更新',exact:true}).click();await expect(page.locator('.workspace')).not.toHaveAttribute('inert');await expect(page.getByLabel('1999声望点数',{exact:true})).toHaveValue('12345');await page.getByRole('button',{name:'保存1999摘要',exact:true}).click();await expect(page.getByRole('status')).toContainText('已保存');await page.getByRole('button',{name:'保存后更新',exact:true}).click();await expect(page.locator('.build-label')).toContainText('actions-v2',{timeout:20000});await expect(page.getByLabel('1999声望点数',{exact:true})).toHaveValue('12345');await expect(card(page,'goal:syndicate:hex')).toBeVisible();await writeFile(evidencePath('Actions_Update.json'),JSON.stringify({dirtyFormBlocked:true,cancelRetainsDraft:true,explicitSaveRetainedAfterUpdate:true,overviewRestored:true},null,2));}finally{rebuild();}
     |                                                                                                                                            ^ Error: expect(received).toBe(expected) // Object.is equality
  56 | });
  57 | 
```