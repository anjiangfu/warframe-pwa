import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {auditOfficial,loadPinnedHtml} from './match.mjs';
const root=resolve(import.meta.dirname,'../..'),evidence=resolve(root,'docs/evidence/Relic_Source_Check_v0');
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const target=process.argv[2];if(!target)throw Error('必须显式指定新附件输出，不默认覆盖目录或历史记录');
const comparison=read(resolve(evidence,'Input_Comparison.json')),access=read(resolve(evidence,'Access_Attempts.json')).find(r=>r.success&&r.path.endsWith('official.online.html')),audit=read(resolve(evidence,'Author_Audit.json'));
if(!access)throw Error('没有作者实际取得原文的元数据');
const html=loadPinnedHtml(resolve(root,'.v/rs-source/official.online.html'),comparison.authorOriginalSha256),catalog=read(resolve(root,'app/src/catalog/relics.v1.json'));
const checks=auditOfficial(catalog,{html,sourceUrl:access.url,retrievedAt:access.retrievedAt,checkedAt:audit.checkedAt,accessMode:'downloaded'});
for(const row of checks.records){const expected=audit.acquisitions.find(a=>a.acquisitionId===row.acquisitionId);if(!expected||expected.status!==row.status||['heading','rotation','item','section'].some(k=>expected[k]!==row.locator[k]))throw Error('与作者独立审计不同：'+row.acquisitionId);}
writeFileSync(resolve(target),JSON.stringify(checks,null,2)+'\n');console.log(JSON.stringify({output:resolve(target),records:checks.records.length,statuses:Object.fromEntries(['listed','not-listed','conflicting','unverified'].map(s=>[s,checks.records.filter(r=>r.status===s).length])),sha256:checks.document.sha256}));
