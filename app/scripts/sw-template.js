/* Own implementation. Build-time placeholders are replaced by vite.config.ts. */
const BASE=__BASE__,BUILD=__BUILD__,FILES=__FILES__;
const CACHE='tenno-shell-'+BUILD;
let job=null;
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)));});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('tenno-shell-')&&key!==CACHE)await caches.delete(key);await self.clients.claim();})());});
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.pathname.startsWith(BASE))return;event.respondWith((async()=>{const cache=await caches.open(CACHE);if(event.request.mode==='navigate')return (await cache.match(BASE+'index.html',{ignoreVary:true}))||fetch(event.request);return (await cache.match(event.request,{ignoreVary:true}))||fetch(event.request);})());});
async function windows(){return (await self.clients.matchAll({type:'window',includeUncontrolled:true})).filter(c=>new URL(c.url).pathname.startsWith(BASE));}
async function progress(){
 if(!job)return;const clients=await windows();const live=new Set(clients.map(c=>c.id));for(const id of job.ids)if(!live.has(id))job.ids.delete(id);
 const newcomers=clients.filter(c=>!job.ids.has(c.id));for(const c of newcomers){job.ids.add(c.id);job.phase='drain';c.postMessage({type:'PREPARE_UPDATE',token:job.token,target:BUILD});}
 const waiting=[...job.ids].filter(id=>!(job.phase==='drain'?job.drained:job.barriers).has(id));
 const owner=clients.find(c=>c.id===job.owner);owner?.postMessage({type:'UPDATE_PROGRESS',text:waiting.length?`等待 ${waiting.length} 个页面保存或关闭…`:'正在切换已缓存的新版本…'});
 if(waiting.length)return;
 if(job.phase==='drain'){job.phase='barrier';for(const c of clients)c.postMessage({type:'SET_BARRIER',token:job.token,target:BUILD});}
 else {for(const c of clients)c.postMessage({type:'ACTIVATING_UPDATE',target:BUILD});job=null;await self.skipWaiting();}
}
self.addEventListener('message',event=>{const data=event.data||{};if(data.type==='GET_BUILD'){event.ports[0]?.postMessage(BUILD);return;}
 event.waitUntil((async()=>{
  if(data.type==='PREPARE_UPDATE'){
   if(job){event.source?.postMessage({type:'UPDATE_PROGRESS',text:'其他页面正在协调更新，请稍后或关闭旧页。'});await progress();return;}
   const clients=await windows();job={token:data.token,owner:event.source.id,ids:new Set(clients.map(c=>c.id)),drained:new Set(),barriers:new Set(),phase:'drain'};
   for(const c of clients)c.postMessage({type:'PREPARE_UPDATE',token:job.token,target:BUILD});await progress();
  }else if(data.type==='UPDATE_DRAINED'&&job?.token===data.token){job.drained.add(event.source.id);await progress();}
  else if(data.type==='BARRIER_READY'&&job?.token===data.token){job.barriers.add(event.source.id);await progress();}
  else if(data.type==='UPDATE_BLOCKED'&&job?.token===data.token){const owner=await self.clients.get(job.owner);owner?.postMessage({type:'UPDATE_PROGRESS',text:data.text+'；保存后重试，或取消更新。'});}
  else if(data.type==='CHECK_UPDATE')await progress();
  else if(data.type==='CANCEL_UPDATE'&&job?.token===data.token){const token=job.token;job=null;for(const c of await windows())c.postMessage({type:'CANCEL_UPDATE',token});}
 })());
});
