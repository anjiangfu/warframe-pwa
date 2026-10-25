// Project-owned fact extractor, never executed by the browser or against personal data.
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const url='https://warframe-web-assets.nyc3.cdn.digitaloceanspaces.com/uploads/cms/hnfvc0o3jnfvc873njb03enrf56.html';
const disclaimer='https://forums.warframe.com/topic/809777-warframe-drop-rates-data/';
export function loadPinnedHtml(path,expectedSha256){const bytes=readFileSync(path);if(createHash('sha256').update(bytes).digest('hex')!==expectedSha256)throw Error('Official input hash mismatch; retain new bytes and audit before accepting another version');return bytes.toString('utf8');}
function text(html){
 const named={amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:' '};let failed=false;
 const value=html.replace(/<[^>]*>/g,'').replace(/&(#x[0-9a-f]+|#\d+|[a-z][a-z0-9]*);/gi,(all,key)=>{
  if(key[0]==='#'){const n=parseInt(key.slice(key[1]?.toLowerCase()==='x'?2:1),key[1]?.toLowerCase()==='x'?16:10);if(n>0&&n<=0x10ffff)return String.fromCodePoint(n);failed=true;return all;}
  if(Object.hasOwn(named,key))return named[key];failed=true;return all;
 }).replace(/\s+/g,' ').trim();return {value,failed};
}
function publication(html){
 const label=html.match(/<b[^>]*>\s*Last Update:\s*<\/b>\s*([^<]*)/i)?.[1]?.trim();
 const m=label?.match(/^(\d{1,2}) (January|February|March|April|May|June|July|August|September|October|November|December), (\d{4})$/);
 if(!m)return null;const month=['January','February','March','April','May','June','July','August','September','October','November','December'].indexOf(m[2])+1;
 const date=`${m[3]}-${String(month).padStart(2,'0')}-${m[1].padStart(2,'0')}`;return Number.isFinite(Date.parse(date))&&new Date(date).toISOString().slice(0,10)===date?date:null;
}
function parseMissionTables(html){
 const starts=[...html.matchAll(/<h3\b[^>]*\bid\s*=\s*["']missionRewards["'][^>]*>[\s\S]*?<\/h3>/gi)];
 if(starts.length!==1)return {error:'mission-section-missing',blocks:[]};
 const after=html.slice(starts[0].index+starts[0][0].length),end=after.search(/<h3\b/i);if(end<0)return {error:'parse-failed',blocks:[]};const body=after.slice(0,end);
 const rows=[...body.matchAll(/<tr\b[^>]*>[\s\S]*?<\/tr>/gi)];
 if(/<script\b/i.test(body)||rows.length!==(body.match(/<tr\b/gi)??[]).length||rows.length!==(body.match(/<\/tr>/gi)??[]).length)return {error:'parse-failed',blocks:[]};
 const blocks=[];let current,rotation=null,ordinal=0;
 for(const match of rows){
  const html=match[0];if(/^<tr\b[^>]*class\s*=\s*["']blank-row["']/i.test(html))continue;
  const rowOrdinal=ordinal++,cells=[...html.matchAll(/<(td|th)\b[^>]*>([\s\S]*?)<\/\1>/gi)].map(m=>({tag:m[1].toLowerCase(),...text(m[2])}));
  if(cells.length===1&&cells[0].tag==='th'&&!cells[0].failed){
   const t=cells[0].value,rot=t.match(/^Rotation ([A-Z])$/);if(rot){rotation=rot[1];if(current)current.rotations.add(rotation);}else{current={heading:t,rows:[],rotations:new Set(),error:false};blocks.push(current);rotation=null;}continue;
  }
  if(!current)continue;
  if(cells.length!==2||cells.some(c=>c.tag!=='td'||c.failed||!c.value)){current.error=true;continue;}
  current.rows.push({rotation,item:cells[0].value,ordinal:rowOrdinal});
 }
 return {blocks};
}
const timestamp=s=>typeof s==='string'&&/T.*(?:Z|[+-]\d\d:\d\d)$/.test(s)&&Number.isFinite(Date.parse(s));
export function auditOfficial(catalog,input){
 const html=input.html??'',publishedAt=publication(html),scope=text(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]??'').value==='Warframe PC Drops'?'pc-international':'unverified';
 const document={sourceUrl:input.sourceUrl??url,disclaimerUrl:disclaimer,sha256:html?createHash('sha256').update(html,'utf8').digest('hex'):null,bytes:Buffer.byteLength(html),publishedAt,retrievedAt:input.retrievedAt??null,checkedAt:input.checkedAt??null,scope,accessMode:input.error?'failed':input.accessMode??'fixed-local',attribution:'Digital Extremes 官方PC公开表',limitations:'保存的静态核验；公开表不保证完备，也不是每次热修均发布。后续更新、账号准入及游戏掉落未实测。'};
 const parsed=parseMissionTables(html),metadataOK=publishedAt&&timestamp(document.retrievedAt)&&timestamp(document.checkedAt)&&document.sourceUrl===url&&scope==='pc-international'&&['downloaded','fixed-local'].includes(document.accessMode);
 const records=catalog.acquisitions.map(a=>{
  const l=catalog.locations.find(l=>l.id===a.locationId),r=catalog.relics.find(r=>r.id===a.relicId);if(!l||!r)throw Error('Dangling original catalog acquisition');
  const heading=`${l.planet}/${l.node}${l.mode==='Caches'&&l.node.endsWith(' (Caches)')?'':` (${l.mode})`}`;
  const locator={section:'missionRewards',heading,rotation:a.rotation,item:r.english},blocks=parsed.blocks.filter(b=>b.heading===heading),matches=blocks.flatMap(b=>b.rows.filter(row=>row.rotation===a.rotation&&row.item===r.english));
  const tableRead=blocks.length>0&&blocks.every(b=>!b.error),rotationRead=tableRead&&blocks.every(b=>b.rotations.has(a.rotation)&&b.rows.some(row=>row.rotation===a.rotation));
  let status='unverified',reason=input.error?'network-failed':parsed.error??(!metadataOK?'missing-evidence':!blocks.length?'table-missing':!tableRead?'parse-failed':blocks.length>1?'duplicate-table':!rotationRead?'rotation-missing':matches.length>1?'duplicate-row':matches.length===1?'exact-row':'missing-row');
  if(['duplicate-table','duplicate-row'].includes(reason))status='conflicting';else if(reason==='exact-row')status='listed';else if(reason==='missing-row')status='not-listed';
  return {acquisitionId:a.id,status,reason,locator,tableRead,rotationRead,matchCount:matches.length,rowOrdinals:matches.map(m=>m.ordinal)};
 });
 return {schemaVersion:1,checkVersion:'relic-checks.2026.10.25.1',catalogVersion:catalog.catalogVersion,document,records};
}
