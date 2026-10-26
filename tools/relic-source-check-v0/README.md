# 遗物来源核验 v0：固定原文匹配工具

本项目独立编写，只处理明确的官方HTML与原目录，不联网、不读个人数据、不执行页面脚本。完整官方原文仅留忽略目录.v/rs-source，不进入PWA或Git；应用仅携带62条必要定位事实和文档元数据。

从项目根运行：

```powershell
node --test tools/relic-source-check-v0/match.test.mjs
node tools/relic-source-check-v0/generate.mjs .v/rs/checks.check.json
```

必须显式指定输出，不默认覆盖文件。发布附件时明确指定app/src/catalog/relic-source-checks.v1.json。生成结果为UTF-8、两空格和LF；使用固定元数据，相同输入序列化字节一致。不会将重跑日期当重新核对日期。

输入为.v/rs-source/official.online.html（4484205字节，SHA256 c31c421954adbd46ec962d40f71d7e7360df3248bd43ce8885d89b7375ddd3d9）、原app/src/catalog/relics.v1.json，以及docs/evidence/Relic_Source_Check_v0的Access_Attempts、Input_Comparison和Author_Audit。取得和首次核对时间来自作者2026-10-25实际记录；2026-10-26续工测试不更改这些时间。缺原文时停止，不自动请求新页或改hash接受新版本；可使用同hash作者原件或批准的固定参考副本，并明确访问方式。若官方新原文已变，应另留新字节和差异、重新审计及新版本，不能覆盖旧证据。

loadPinnedHtml先验原始字节hash。auditOfficial限定唯一missionRewards段，到后续h3停止，不能以relicRewards名称证明获取。按精确星球／节点／类别标题、Rotation、英文遗物匹配；Caches后缀只拼一次。只读取标题和第一单元格的必要事实，概率文本不进入结果。结构不完整或未知实体导致相关表待核；不执行或解释脚本。

- listed：对应任务表和轮次结构完整，精确行唯一。
- not-listed：对应表和非空轮次确实读取成功，但没有精确行；不代表不能获取。
- conflicting：目标标题或精确行重复。
- unverified：缺任务段／标题／轮次、解析／网络失败、缺日期或证据不完整。

日期分别保留页面发布日、取得副本时刻和首次作者核对时刻；全部是保存的静态记录。域层还验证目录版本、身份定位、PC范围、hash和日期。附件缺失／根字段缺失可退回旧查询；不完整证据不默认为listed。错误ID等结构冲突仍拒绝。

十项Node测试含真实62条与独立合成的缺行、缺表／轮次、奖励段假命中、网络／解析失败、重复、缺日期、Caches／镜像边界、幂等及hash错误。合成HTML只在内存，不写入真实附件。生成结果另与G0独立Python HTMLParser审计逐条比较，原v2七转换测试和原输出独立保留。
