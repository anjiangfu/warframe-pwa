import {createRoot} from 'react-dom/client';
import {useEffect,useState} from 'react';
import {LocalProvider} from './catalog/provider';
import {openDatabase,Repository} from './storage/db';
import {newProfile} from './storage/imports';
import {BackupPanel} from './features/BackupPanel';
import type {ProfileDocument} from './domain/model';
const provider=new LocalProvider();
function Bootstrap(){const [repo,setRepo]=useState<Repository>();const [profiles,setProfiles]=useState<ProfileDocument[]>([]);const [message,setMessage]=useState('读取本地档案…');useEffect(()=>{void openDatabase('tenno-planner',setMessage).then(db=>{const r=new Repository(db);setRepo(r);return r.list();}).then(setProfiles).then(()=>setMessage('本地保存就绪')).catch(e=>setMessage(String(e)));},[]);return <main><h1>天诺星图 · 数据恢复</h1><p role="status">{message}</p><button onClick={async()=>{if(!repo)return;try{await repo.create(newProfile(provider.getCatalog(),crypto.randomUUID(),'本地档案',true));setProfiles(await repo.list());}catch(e){setMessage(String(e));}}}>创建模板档案</button>{repo&&<BackupPanel provider={provider} repo={repo} profiles={profiles} active={profiles[0]} onError={setMessage} onRestored={()=>{void repo.list().then(setProfiles);}}/>}</main>;}
createRoot(document.getElementById('root')!).render(<Bootstrap/>);
