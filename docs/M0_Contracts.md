# M0 数据及保护契约

本文件定义批准范围内的最小契约，后续类型以本文件为依据。无 M1—M4 计算、外部账号、在线请求和遥测。

1. DataProvider.getCatalog() 返回不可变 Catalog：catalogVersion、lanes、nodes、来源。LocalProvider 只读本项目 JSON，校验 ID 唯一、依赖存在、stepId 唯一。node.id 原值；node.goalId 原值显式映射，目录视图不存进度。Step ID 为 legacy:{nodeId}:{v1Index}，冻结文件提供索引。自定义 ID 为 custom:UUID，步骤为独立 stable ID。
2. ProfileDocument：id、revision、name、masteryRank/targetRank/dailyMinutes（number|null）、mainFrame、statuses、steps、notes、stock、budget、events、customNodes、legacyArchive、originals。所有这些是个人数据，按 id 隔离存一份文档，以避免跨表部分提交；未知为 null，显式0保留。events 顺序及原 time 保留，编辑追加日志不改已有次序。
3. 数据库 tenno-planner，当前 DB_VERSION=1；profiles 按 id、snapshots 按 id、imports 按 [profileId+hash]、meta 按 key。备份 schemaVersion=1；catalogVersion=2026.10.16.1；build ID 来自构建配置。四者互不替代。备份包不包含线上缓存。
4. 导入解析无副作用。旧档文件2 MiB、新完整备份文件8 MiB；保存/导出/导入共享BACKUP_LIMITS。业务负载为移除id/revision后的完整档案紧凑JSON，UTF-8上限8,386,560字节（8 MiB减2 KiB），包含所有笔记、日志、归档和原件；预留2 KiB容纳最多100字符的id/catalogVersion及安全整数revision/备份头。完整备份以紧凑JSON输出，另检查最终文件大小。深度20、遍历值计数50,000均以profile为根（深度0），不重复计入备份包装；包装元数据另检。普通字符串100,000、base64字符串3,000,000个UTF-16代码单元，数值有限；非JSON值明确拒绝，不能在序列化时静默丢弃。拒绝 __proto__/constructor/prototype 和过新版本。超限在保存/导出/迁移提交前报错，不裁剪数据，原持久档案不变。v1缺status→todo、缺stock→null；未知字段/节点/额外步骤完整隔离。保留原字节base64及SHA256，可再次下载。新格式保留业务文档，不信任传入revision/id作为本地目标。
5. 预览包含 hash、格式、数量、未知字段、目标 revision；确认前不写任何数据。提交参数：预览、targetId、expectedRevision、方式 new/replace。事务先检查 revision 和 targetId+hash 幂等记录，再保存旧快照、验证可读取、写入新文档与导入记录。重复点击不重复写日志；不同档案允许同 hash。每次后续编辑使 revision 增加；想再次恢复同档到已改变的档案必须重新预览，不能被旧幂等记录吞掉。
6. 保存按预期 revision 原子比较，失败给出中文错误，不能先显示已保存；视图不对未落盘数据发成功消息。节点状态不改变 MR。失去目录引用的 statuses/notes 原样留存并可显示。
7. 数据库升级使用同一个 versionchange 事务取得旧文档、写快照并读回确认；快照失败 abort。blocked 提示关闭旧页，旧连接 versionchange 立即关闭并阻止后续写入。VersionError 不回退创建默认档案。未来新增 DB 版本须追加迁移及故障测试，不原地降版本。
8. SW仅同源缓存清单内应用壳/构建资源/小目录，另在候选版本缓存保存仅含token的更新会话日志，不缓存个人资料。更新须用户确认，所有页冻结编辑、排空队列、回ACK，持久meta写屏障后再激活；不因超时自动解锁。刷新、发起页关闭、worker停止后可重新加入会话并重新ACK，任一参与页可按同token取消；异步消息串行处理，取消后的迟到ACK/屏障写入忽略。没有等待worker的孤立屏障由用户明确取消，经active worker确认后解除。激活后controllerchange刷新，新构建仅解除匹配target的屏障；只清本应用旧tenno-shell-*缓存，不动IndexedDB。所有旧受控页面均关闭时，浏览器正常自动激活不受skipWaiting握手约束，重新打开后仍须验证数据保持。
9. 通用条件仅保留三态类型及合成判定测试；全部旧 deps 为 recommended，不能锁定完成按钮。SourceKind 与 VerificationStatus 分开；用户模板标 user/unverified。动态缓存接口只有元数据边界，显示尚未同步。
10. 桌面与手机采用原创科技树的深色星图、路线色条和节点面板；不迁移旧每日推荐算法和伪精确时长。预算仅手工记录，不执行制作缺口/库存分配算法。
