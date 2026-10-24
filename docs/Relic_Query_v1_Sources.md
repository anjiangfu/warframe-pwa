# 遗物查询 v1：名称、入口和规则来源审计

2026-10-24。仅改善已有12遗物/57奖励/72关系/24来源/11地点；不扩目录。逐项清单为[evidence/Relic_Query_v1/Audit.md](evidence/Relic_Query_v1/Audit.md)，精确关联与状态分别存Name_Audit.json、Era_Audit.json、Location_Audit.json，规则文本存Route_Rule_Audit.json。它们在实现前形成，不以旧待核提示重排充当交付。

## 中文映射：许可及固定输入

采用MIT包[@wfcd/items@1.1276.31](https://www.npmjs.com/package/@wfcd/items/v/1.1276.31)，npm元数据申报gitHead `ec9b91104d7a00c0b8e839d97f6fcff5a4789c99`。GitHub API本轮不可直读，未二次核验Git commit；固定的是不可变npm版本与实际下载文件SHA，而非浮动master。Npm_Package_Metadata.json保存完整元数据；所声明tarball integrity留作出处，未下载/安装/执行tar包，不宣称验证过整包签名。

输入从`https://cdn.jsdelivr.net/npm/@wfcd/items@1.1276.31/`逐文件只读下载；LICENSE、README、data/json/i18n/zh.json、Components.json、Node.json、Relics.json、Warframes.json、Melee.json、Primary.json、Secondary.json、Arch-Melee.json的实际字节数/SHA256见Source_Manifest.json，下载URL及成功/失败见Downloads_Initial.json和Rule_Downloads.json。完整原始文件仅留忽略目录.v/rv1-source，不进入应用或SW缓存，不作为新全量百科。

上游LICENSE为MIT，Copyright (c) 2017 Kaptard，原文WFCD_ITEMS_LICENSE.txt。它不概括授权游戏图片、地图或第三方攻略；本轮只取少量名称字段及精确标识。没有执行包内代码或采集脚本，没有引入依赖、图片、Tenno Hub加工映射或在线AI。

上游README说明数据来自Warframe自身接口，i18n的zh为其中文语言包；不是国服独立译名表。但这是经过社区加工的接口映射，不把它表述成当前PC客户端逐项亲测或官方认证。该版本component中文为拆分名称，必须按父实体uniqueName和component uniqueName重建完整标签。

## 精确名称关联方法及限制

每条奖励要求：父实体组件引用准确命中component.uniqueName；英文父名+英文部件字段（战甲部件明确加Blueprint类型）与原奖励英文全串相等；该组件drops[].type也与原英文全串相等。再以相同uniqueName读取zh字段。两次英文精确核对、唯一父/部件标识和原reward ID均写入Name_Audit.json，不按模糊名/中文相同合并。

14个总蓝图的独立component zh字段为空，使用既有项目类型词“蓝图”，与上游父专名组合；战甲系统/机体/头部神经光元的blueprint关系同样保留类型，不把它们写成已制成部件。这里是字段组合，不是机器翻译专名，也不声称上游直接提供了完整中文字符串。福马蓝图沿用原blueprint:forma。

56项新增组合显示全部能唯一关联，福马1项沿用。39项新增父专名含汉字；17项上游zh父专名仍为拉丁字母，组合显示可查但中文专名继续待核。四纪元古纪/前纪/中纪/后纪由原Intact遗物的精确uniqueName关联，保留Lith/Meso/Neo/Axi及编号检索。地点7条能对应英文planet/name及Node.uniqueName；3条有中文节点名，4条上游仍原文，沿用原文而不造译名；4条航道节点未在该Node集合匹配，中文及精确准入待核。名称核验不升级奖励表、入口、触发表或当前可获取状态。

## 模式和入口：采用的事实与逐项适用范围

以下只参考事实，短步骤独立编写，不复制攻略段落、Wiki模块或图像。官方网页正文下载成功者保留原字节hash于Rule_Downloads/Source_Manifest；支持页直读403但本轮网页工具能读正文，社区页部分只能读检索缓存，均明确日期和访问方式，不假称取得固定修订版本。

| 来源ID/页面 | 采用范围 | 限制 |
|---|---|---|
| pc-defense385：[PC 38.5](https://www.warframe.com/en/patch-notes/pc/38-5-0) | 普通防御每次奖励由5波改为3波，区分特例 | 不把舞台/镜像或任务变体写成同一套；当前版本仍需游戏面板核对 |
| pc-survival42：[PC 42](https://www.warframe.com/en/patch-notes/pc/42-0-0) | 安全旁路可加速生存计时，任务刻度非现实用时 | 不给刷取现实时间；不扩到其他变体 |
| pc-mirror32：[PC 32.3](https://www.warframe.com/en/patch-notes/pc/32-3-0) | Tyana Pass入口、双水晶完整防守算一次检查；不是普通波数防御 | 历史规则和准入条件，不等于当前账号已解锁 |
| pc-disruption25：[PC 25](https://www.warframe.com/en/patch-notes/pc/25-0-0) | Ganymede、Natah历史门槛、钥匙/导管与按表现选奖励 | 不自动判断个人准入；C具体格与社区表交叉对照 |
| official-railjack：[官方支持](https://support.warframe.com/hc/en-us/articles/38820115630093-Railjack)；pc-railjack30：[PC 30](https://www.warframe.com/en/patch-notes/pc/30-0-0) | 比邻星区域、额外兴趣点/废船与主任务完成后结算、正常返回；Caches并非基础任务模式 | 逐节点B表具体触发未核，不按第二箱/第二轮解释；剧情/机甲准入不拼成通用已满足 |
| community-rewards：[奖励规则](https://wiki.warframe.com/w/Mission_Rewards) | 本轮普通生存/防御/拦截/镜像的AABC表解释 | 社区缓存事实、非实时保证；不导入页面或通用算法 |
| community-interception：[拦截](https://wiki.warframe.com/w/Interception)；community-disruption：[中断](https://wiki.warframe.com/w/Disruption) | Odin成功讯息、Ganymede的C表条件；任务动作与表索引分开 | 社区正文/检索缓存；不据此保证成功或当前开放 |
| community-missions：[节点资料](https://wiki.warframe.com/w/Module:Missions/data) | 仅独立参考11地点中的星图/航道类别及4航道基础子类型线索 | 不复制Lua/表文件；4航道基础模式保留待核，名称不从该模块导入 |

普通防御Lares/Romula/Coba分别保留节点身份；Tyana Pass明确引用mirror规则及附证据特例，不因原Defense键误套。Ganymede不是AABC；C表看回合和成功导管数。4航道来源仍显示Caches原始键，另列基础任务候选、额外奖励表类别、已核通用步骤和未核B触发。没有把B当第二箱，也没有把解锁剧情当成账号已满足。

## G0结论和当前缺口

证据足以形成真实改进：56项中文组合显示/双语搜索、四纪元中文、3个中文节点名、7地点的模式与轮次说明、4航道地点的额外表/主任务区别和一般结算步骤。仍待核：17父专名的汉字译名、4原文星图名及4航道节点中文、航道各B表确切触发和部分准入、所有当前可获取与用户解锁。没有为了覆盖率将这些标为已核，也不把社区线索当官方当前事实。

网络审计：GitHub API请求WinError10061、raw直读SSL EOF；对单次请求尝试无代理仍拒绝，没有改系统设置。固定npm注册表及jsDelivr文件可读；官方PC补丁可读。中文终端显示过乱码，但检查源JSON码点正确且无U+FFFD，未把终端显示问题误当作映射损坏。完整输入hash、逐项关联和待核表均保留，真机/游戏亲测仍未执行。
