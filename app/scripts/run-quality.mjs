import {spawnSync} from 'node:child_process';
import {writeFileSync,mkdirSync} from 'node:fs';
const commands=['npm.cmd run lint','npm.cmd test','npm.cmd run typecheck','npm.cmd run build','npm.cmd run test:browser -- --reporter=line','npm.cmd run build','node scripts/verify-delivery.mjs'];
const prefix=process.env.M0_EVIDENCE_PREFIX||'M0';if(!/^[A-Za-z0-9_-]+$/.test(prefix))throw Error('Invalid evidence prefix');
const evidenceDir=process.env.M0_EVIDENCE_DIR||'../docs/evidence';mkdirSync(evidenceDir,{recursive:true});
const records=[];
for(const command of commands){const startedAt=new Date().toISOString();const result=spawnSync(process.env.ComSpec||'C:\\Windows\\System32\\cmd.exe',['/d','/s','/c',command],{encoding:'utf8',maxBuffer:5*1024*1024});const output=(result.stdout||'')+(result.stderr||'');records.push({command,exitCode:result.status,startedAt,finishedAt:new Date().toISOString(),output});console.log(command,'exit',result.status);console.log(output);writeFileSync(`${evidenceDir}/${prefix}_Commands.json`,JSON.stringify(records,null,2)+'\n');if(result.status!==0){process.exitCode=1;break;}}
