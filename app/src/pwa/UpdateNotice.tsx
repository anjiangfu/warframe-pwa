import {useEffect,useRef,useState,type MutableRefObject} from 'react';
import type {Repository} from '../storage/db';
declare const __BUILD_ID__:string;
function dirtyForm(){return [...document.querySelectorAll<HTMLFormElement>('form')].some(form=>[...form.querySelectorAll<HTMLInputElement|HTMLTextAreaElement>('input:not([type=checkbox]),textarea')].some(el=>el.type!=='file'&&el.value!==el.defaultValue));}
export function UpdateNotice({repo,queue,lock,hasError}:{repo:Repository;queue:MutableRefObject<Promise<void>>;lock:(b:boolean)=>void;hasError:()=>boolean}){
 const [offlineState,setOfflineState]=useState(navigator.serviceWorker?.controller?'离线应用壳已就绪':'正在准备离线资源');const [registration,setRegistration]=useState<ServiceWorkerRegistration>();const [ready,setReady]=useState(false);const [busy,setBusy]=useState(false);const [text,setText]=useState('新版本已缓存。可以保存后更新，也可以稍后处理。');const token=useRef('');const latest=useRef({lock,hasError});latest.current={lock,hasError};
 useEffect(()=>{
  if(!import.meta.env.PROD){setOfflineState('开发模式：不启用离线缓存');return;}if(!('serviceWorker'in navigator)){setOfflineState('离线未就绪：需要 HTTPS 或 localhost');return;}let disposed=false;let reg:ServiceWorkerRegistration|undefined;let hadController=!!navigator.serviceWorker.controller;
  const controller=()=>{if(hadController)location.reload();else{hadController=true;setOfflineState('离线应用壳已就绪');}};
  const message=(event:MessageEvent)=>{const d=event.data;if(!d||typeof d.type!=='string')return;const worker=event.source as ServiceWorker;
   if(d.type==='PREPARE_UPDATE'){
    token.current=d.token;latest.current.lock(true);(document.activeElement as HTMLElement|null)?.blur();
    void queue.current.then(()=>new Promise<void>(resolve=>requestAnimationFrame(()=>resolve()))).then(()=>{if(dirtyForm()||latest.current.hasError()){worker.postMessage({type:'UPDATE_BLOCKED',token:d.token,text:'有未提交表单或保存失败，请先保存'});return;}worker.postMessage({type:'UPDATE_DRAINED',token:d.token});});
   }else if(d.type==='SET_BARRIER'){
    void queue.current.then(async()=>{await repo.db.meta.put({key:'writeBarrier',value:{target:d.target,token:d.token}});worker.postMessage({type:'BARRIER_READY',token:d.token});}).catch(e=>setText('写保护失败，更新未激活：'+String(e)));
   }else if(d.type==='UPDATE_PROGRESS')setText(d.text);
   else if(d.type==='CANCEL_UPDATE'){void repo.db.transaction('rw',repo.db.meta,async()=>{const barrier=await repo.db.meta.get('writeBarrier');if((barrier?.value as {token?:string}|undefined)?.token===d.token)await repo.db.meta.delete('writeBarrier');}).then(()=>{latest.current.lock(false);setBusy(false);setText('已取消更新，继续使用当前版本。');});}
  };
  navigator.serviceWorker.addEventListener('message',message);navigator.serviceWorker.addEventListener('controllerchange',controller);
  void (async()=>{
   const barrier=await repo.db.meta.get('writeBarrier');if(barrier){if((barrier.value as {target?:string}).target===__BUILD_ID__)await repo.db.meta.delete('writeBarrier');else{latest.current.lock(true);setText('另一页面正在更新。请等待全部页面更新，或关闭旧页面后重新打开。');}}
   reg=await navigator.serviceWorker.register(import.meta.env.BASE_URL+'sw.js',{scope:import.meta.env.BASE_URL,updateViaCache:'none'});if(disposed)return;setRegistration(reg);if(reg.waiting)setReady(true);reg.addEventListener('updatefound',()=>{const installing=reg?.installing;installing?.addEventListener('statechange',()=>{if(installing.state==='installed'&&navigator.serviceWorker.controller)setReady(true);});});
  })().catch(e=>{setText('离线资源准备失败：'+String(e));setOfflineState('离线资源未就绪，请联网重开或检查浏览器权限');});
  return()=>{disposed=true;navigator.serviceWorker.removeEventListener('message',message);navigator.serviceWorker.removeEventListener('controllerchange',controller);};
 },[repo,queue]);
 useEffect(()=>{if(!busy)return;const id=setInterval(()=>registration?.waiting?.postMessage({type:'CHECK_UPDATE'}),1500);return()=>clearInterval(id);},[busy,registration]);
 return <><span className="build-label">构建 {__BUILD_ID__} · <span>{offlineState}</span></span>{ready&&<aside className="update-notice" role="region" aria-label="应用更新"><strong>新版本已准备好</strong><p>{text}</p><div className="actions"><button className="primary" disabled={busy} onClick={()=>{token.current=crypto.randomUUID();setBusy(true);registration?.waiting?.postMessage({type:'PREPARE_UPDATE',token:token.current});}}>保存后更新</button><button onClick={()=>{if(busy)registration?.waiting?.postMessage({type:'CANCEL_UPDATE',token:token.current});else{setText('已暂缓，当前页面和档案可继续使用。');}}}>{busy?'取消更新':'稍后更新'}</button></div></aside>}</>;
}
