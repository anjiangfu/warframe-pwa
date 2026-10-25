// Project-owned offline adapter. Reads explicitly pinned public data only; never profiles.
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve,relative,isAbsolute} from 'node:path';
import {fileURLToPath} from 'node:url';
const rootDefault=resolve(import.meta.dirname,'../..');
const folder='docs/evidence/Relic_Query_v2/';
const parentFiles=['Warframes','Melee','Primary','Secondary','Arch-Melee'];
const nodes=['Apollodorus','Lares','Odin','Romula','Coba','Tyana Pass','Ganymede'];
const tiers=['Lith','Meso','Neo','Axi'];
const approved={Lith:['A13','C15','C7','G14','L8','S18','S19','V11'],Meso:['A12','C11','D8','D9','K9','V13','V17','Y2'],Neo:['A16','C10','C11','C7','K10','V13','Y2'],Axi:['A21','A22','C12','D6','P10','S21','S8','V14']};
const fail=message=>{throw Error(message);};
const parse=b=>JSON.parse(b.toString('utf8'));
export function loadPinned(root=rootDefault,manifest=parse(readFileSync(resolve(root,folder+'Inputs.json')))){
 const raw=new Map();for(const [path,entry]of Object.entries(manifest.files)){
  const absolute=resolve(root,path),rel=relative(root,absolute);if(isAbsolute(rel)||rel.startsWith('..'))fail('输入路径越界');
  const bytes=readFileSync(absolute);if(createHash('sha256').update(bytes).digest('hex')!==entry.sha256)fail('Input hash mismatch: '+path);raw.set(path.replaceAll('\\','/'),bytes);
 }
 const get=path=>parse(raw.get(path)??fail('缺固定输入 '+path));
 return {baseline:parse(readFileSync(resolve(root,folder+'Baseline_Catalog.json'))),relics:get('.v/rl-source/data/relics.json').relics,missions:get('.v/rl-source/data/missionRewards.json').missionRewards,zh:get('.v/rv1-source/zh.json'),components:get('.v/rv1-source/components.json'),parents:parentFiles.flatMap(file=>get('.v/rv1-source/'+file+'.json').map(row=>({file,row}))),itemsRelics:get('.v/rv1-source/relics.json')};
}
function exactParts(input,english){
 const components=new Map(input.components.map(c=>[c.uniqueName,c])),hits=[];
 for(const {file,row:p}of input.parents)for(const ref of p.components??[]){
  const c=components.get(ref.uniqueName);if(!c)continue;
  const war=p.category==='Warframes'&&['Chassis','Neuroptics','Systems'].includes(c.name);
  if(p.name+' '+c.name+(war?' Blueprint':'')!==english)continue;
  if(!c.drops?.some(d=>d.type===english))continue;
  const pzh=input.zh[p.uniqueName]?.name;let czh=input.zh[c.uniqueName]?.name;const generic=c.name==='Blueprint'&&czh===undefined;
  if(generic)czh='蓝图';if(war&&czh)czh+='蓝图';
  hits.push({file,parentId:p.uniqueName,componentId:c.uniqueName,nameZh:pzh&&czh?pzh+' '+czh:undefined,properNameUntranslated:pzh===p.name,typeGlossary:generic,type:war||c.name==='Blueprint'?'blueprint':'component'});
 }
 return [...new Map(hits.map(h=>[h.parentId+'|'+h.componentId,h])).values()];
}
export function convertCatalog(input){
 const c=structuredClone(input.baseline);c.catalogVersion='relics.2026.10.25.1';
 for(const key of ['relics','rewards','relations','acquisitions','locations','sources','routeRules'])if(new Set(c[key].map(x=>x.id)).size!==c[key].length)fail('重复旧ID '+key);
 const source=id=>{
  const newid=id+'-v2';if(!c.sources.some(s=>s.id===newid)){const old=c.sources.find(s=>s.id===id)??fail('悬空来源 '+id);c.sources.push({...old,id:newid,checkedAt:'2026-10-25',label:(old.label??(id==='wfcd-relics'?'固定遗物奖励表':'固定任务奖励表'))+' · v2核对'});}return newid;
 };
 const oldNames=new Set(c.relics.map(r=>r.english)),selected=new Set(oldNames),routes=new Map();
 for(const name of nodes){
  const l=c.locations.find(l=>l.node===name)??fail('悬空地点 '+name),mission=input.missions[l.planet]?.[name];
  if(!mission||mission.gameMode!==l.mode||mission.isEvent!==false)fail('来源模式不符 '+name);
  for(const rot of ['A','B','C'])for(const row of mission.rewards[rot]??[]){
   if(!/^(Lith|Meso|Neo|Axi) [A-Z]\d+ Relic$/.test(row.itemName))continue;
   selected.add(row.itemName);const list=routes.get(row.itemName)??[];list.push({locationId:l.id,rotation:rot});routes.set(row.itemName,list);
  }
 }
 const wanted=Object.entries(approved).flatMap(([t,codes])=>codes.map(code=>t+' '+code+' Relic')).sort();
 if(JSON.stringify([...selected].sort())!==JSON.stringify(wanted))fail('选样与批准集合不符，不能补造来源');
 const newNames=[...selected].filter(n=>!oldNames.has(n)).sort((a,b)=>tiers.indexOf(a.split(' ')[0])-tiers.indexOf(b.split(' ')[0])||(a<b?-1:a>b?1:0));
 const rewardByUpstream=new Map(c.rewards.filter(r=>r.upstreamId).map(r=>[r.upstreamId,r]));
 const rewardByEnglish=new Map(c.rewards.map(r=>[r.english,r]));
 // Check old raw tables too: preserving an old display is not permission to accept a changed source.
 for(const english of [...oldNames,...newNames]){
  const [tier,code]=english.split(' '),id='relic:'+tier.toLowerCase()+':'+code.toLowerCase();
  const hits=input.relics.filter(x=>x.tier===tier&&x.relicName===code&&x.state==='Intact');
  if(hits.length!==1)fail('重复或缺失Intact '+english);const row=hits[0];
  if(row.rewards.length!==6||new Set(row.rewards.map(r=>r._id)).size!==6)fail('必须有唯一六项奖励 '+english);
  if(oldNames.has(english)){
   const expected=c.relations.filter(x=>x.relicId===id).map(x=>c.rewards.find(r=>r.id===x.rewardId).english);
   if(JSON.stringify(expected)!==JSON.stringify(row.rewards.map(r=>r.itemName)))fail('旧奖励事实冲突 '+english);continue;
  }
  const itemHits=input.itemsRelics.filter(r=>r.name===tier+' '+code+' Intact');if(itemHits.length!==1)fail('遗物名称关联不唯一 '+english);
  const item=itemHits[0],nameZh=input.zh[item.uniqueName]?.name;
  const relic={id,name:'虚空遗物 · '+tier+' '+code,english,tier,code,nameStatus:'unverified',expectedRewards:6,rewardCompleteness:'complete',availability:'unknown',sourceScope:'partial',sourceIds:[source('wfcd-relics')]};
  if(nameZh)relic.display={nameZh,aliases:[],upstreamIds:[item.uniqueName],properNameUntranslated:false,verification:'snapshot-checked',sourceIds:[source('items-relics'),source('items-zh')]};
  c.relics.push(relic);
  for(const raw of row.rewards){
   let reward=rewardByUpstream.get(raw._id);
   if(reward&&reward.english!==raw.itemName||rewardByEnglish.has(raw.itemName)&&rewardByEnglish.get(raw.itemName).upstreamId!==raw._id)fail('源奖励身份／英文冲突 '+raw.itemName);
   if(!reward){
    const quantity=raw.itemName==='2X Forma Blueprint',parts=quantity?[]:exactParts(input,raw.itemName);
    const type=quantity||raw.itemName.endsWith(' Blueprint')?'blueprint':parts.length&&new Set(parts.map(p=>p.type)).size===1?parts[0].type:fail('部件类型不明确 '+raw.itemName);
    reward={id:'reward:wfcd:'+raw._id,upstreamId:raw._id,name:(type==='blueprint'?'蓝图':'部件')+' · '+raw.itemName,english:raw.itemName,type,nameStatus:'unverified'};
    if(quantity){
     if(!c.rewards.some(r=>r.id==='blueprint:forma'&&r.english==='Forma Blueprint'&&r.type==='blueprint'))fail('缺既有福马蓝图');
     reward.bundleOf={rewardId:'blueprint:forma',quantity:2};reward.display={nameZh:'2份福马蓝图',aliases:[],upstreamIds:[raw._id],properNameUntranslated:false,verification:'snapshot-checked',sourceIds:[source('wfcd-relics')]};
    }else if(parts.length&&parts[0].nameZh){
     const p=parts[0];reward.display={nameZh:p.nameZh,aliases:[],upstreamIds:[...new Set(parts.flatMap(x=>[x.parentId,x.componentId]))],properNameUntranslated:p.properNameUntranslated,typeGlossary:p.typeGlossary,verification:parts.length===1?'snapshot-checked':'conflicting',sourceIds:[source('items-zh'),source('items-components'),...new Set(parts.map(x=>source('items-'+x.file)))]};
    }
    c.rewards.push(reward);rewardByUpstream.set(raw._id,reward);rewardByEnglish.set(raw.itemName,reward);
   }
   c.relations.push({id:id+':reward:'+raw._id,relicId:id,rewardId:reward.id,refinement:'Intact',openingChancePercent:null,verification:'snapshot-checked',sourceIds:[source('wfcd-relics')]});
  }
  const list=[];for(const route of routes.get(english)??[])if(!list.some(x=>x.locationId===route.locationId))list.push(route);
  if(list.length<2)fail('来源不足两节点 '+english);
  for(const route of list.slice(0,2))c.acquisitions.push({id:id+':source:'+route.locationId,relicId:id,...route,dropChancePercent:null,verification:'snapshot-checked',availability:'unknown',sourceIds:[source('wfcd-missions')]});
 }
 for(const key of ['relics','rewards','relations','acquisitions'])if(new Set(c[key].map(x=>x.id)).size!==c[key].length)fail('重复输出ID '+key);
 return c;
}
export const serializeCatalog=c=>JSON.stringify(c,null,2)+'\n';
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const out=process.argv[2];if(!out)fail('必须显式指定输出文件；不会默认覆盖app或旧证据');
 const c=convertCatalog(loadPinned());writeFileSync(resolve(out),serializeCatalog(c));console.log(JSON.stringify({output:resolve(out),relics:c.relics.length,rewards:c.rewards.length,relations:c.relations.length,acquisitions:c.acquisitions.length}));
}
