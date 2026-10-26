import {createRoot} from 'react-dom/client';
import {LocalProvider} from '../../src/catalog/provider';
import {RelicsPage} from '../../src/features/RelicsPage';
import '../../src/styles.css';
const provider=new LocalProvider(),kind=new URLSearchParams(location.search).get('fixture');
const catalog=structuredClone(provider.getRelicCatalog()),checks=structuredClone(provider.getRelicSourceChecks()),metadata=structuredClone(provider.getPrimeEquipmentCatalog());
if(kind==='old')catalog.catalogVersion='synthetic-legacy';
if(kind==='conflict')metadata!.parents[0].componentIds=[];
if(kind==='partial')for(let i=1;i<checks!.records.length;i++){const row=checks!.records[i];row.status='not-listed';row.reason='missing-row';row.matchCount=0;row.rowOrdinals=[];}
createRoot(document.getElementById('root')!).render(<><p>合成故障／筛选夹具，不是游戏事实或发布目录。</p><RelicsPage catalog={catalog} checks={checks} equipment={kind==='missing'?undefined:metadata}/></>);
