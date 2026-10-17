/* Own implementation. Build-time placeholders are replaced by vite.config.ts. */
/* global Response */
const BASE=__BASE__,BUILD=__BUILD__,FILES=__FILES__;
const CACHE='tenno-shell-'+BUILD;
const JOURNAL=new URL(BASE+'__update_session__',self.location.href).href;
let job=null,loaded=false,activating=false,serial=Promise.resolve();
const session=token=>({token,ids:new Set(),drained:new Set(),barriers:new Set(),phase:'drain'});
async function journal(token){const cache=await caches.open(CACHE);if(token)await cache.put(JOURNAL,new Response(JSON.stringify({token})));else await cache.delete(JOURNAL);}
async function load(){if(loaded)return;const saved=await(await caches.open(CACHE)).match(JOURNAL);if(saved){const value=await saved.json();if(typeof value.token==='string')job=session(value.token);}loaded=true;}
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)));});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('tenno-shell-')&&key!==CACHE)await caches.delete(key);await journal(null);job=null;activating=false;loaded=true;await self.clients.claim();})());});
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.pathname.startsWith(BASE))return;event.respondWith((async()=>{const cache=await caches.open(CACHE);if(event.request.mode==='navigate')return (await cache.match(BASE+'index.html',{ignoreVary:true}))||fetch(event.request);return (await cache.match(event.request,{ignoreVary:true}))||fetch(event.request);})());});
async function windows(){return (await self.clients.matchAll({type:'window',includeUncontrolled:true})).filter(c=>new URL(c.url).pathname.startsWith(BASE));}
function announce(clients){for(const c of clients)c.postMessage({type:'UPDATE_SESSION',token:job.token,target:BUILD});}
async function progress(){
 if(!job||activating)return;const clients=await windows();const live=new Set(clients.map(c=>c.id));for(const id of job.ids)if(!live.has(id))job.ids.delete(id);
 announce(clients);
 for(const c of clients)if(!job.ids.has(c.id)){job.ids.add(c.id);job.phase='drain';c.postMessage({type:'PREPARE_UPDATE',token:job.token,target:BUILD});}
 const waiting=[...job.ids].filter(id=>!(job.phase==='drain'?job.drained:job.barriers).has(id));
 for(const c of clients)c.postMessage({type:'UPDATE_PROGRESS',text:waiting.length?`等待 ${waiting.length} 个页面保存或关闭…`:'正在切换已缓存的新版本…'});
 if(waiting.length||!clients.length)return;
 if(job.phase==='drain'){job.phase='barrier';job.barriers.clear();for(const c of clients)c.postMessage({type:'SET_BARRIER',token:job.token,target:BUILD});}
 else {activating=true;for(const c of clients)c.postMessage({type:'ACTIVATING_UPDATE',target:BUILD});await self.skipWaiting();}
}
async function handle(event){
 const data=event.data||{};if(data.type==='GET_BUILD'){event.ports[0]?.postMessage(BUILD);return;}
 await load();if(activating)return;
 if(data.type==='PREPARE_UPDATE'||data.type==='SYNC_UPDATE'){
  if(!job&&typeof data.token==='string'&&data.token){await journal(data.token);job=session(data.token);}
  if(job){
   // Refresh can retain a client ID; require a fresh drain acknowledgement.
   if(data.type==='SYNC_UPDATE'&&event.source){job.ids.delete(event.source.id);job.drained.delete(event.source.id);job.barriers.delete(event.source.id);job.phase='drain';}
   await progress();
  }
 }else if(data.type==='UPDATE_DRAINED'&&job?.token===data.token){job.drained.add(event.source.id);await progress();}
 else if(data.type==='BARRIER_READY'&&job?.token===data.token){job.barriers.add(event.source.id);await progress();}
 else if(data.type==='UPDATE_BLOCKED'&&job?.token===data.token){for(const c of await windows())c.postMessage({type:'UPDATE_PROGRESS',text:data.text+'；保存后重试，或取消更新。'});}
 else if(data.type==='CHECK_UPDATE')await progress();
 else if(data.type==='CANCEL_UPDATE'&&typeof data.token==='string'&&data.token&&(!job||job.token===data.token)){
  await journal(null);job=null;for(const c of await windows())c.postMessage({type:'CANCEL_UPDATE',token:data.token});
 }
}
self.addEventListener('message',event=>{
 // Serialize async message processing so cancellation cannot race journal writes.
 const operation=serial.then(()=>handle(event));serial=operation.catch(()=>{});
 event.waitUntil(operation.catch(async error=>{for(const c of await windows())c.postMessage({type:'UPDATE_PROGRESS',text:'更新协调失败，请取消后重试：'+String(error)});}));
});
