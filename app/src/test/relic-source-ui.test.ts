import {it,expect} from 'vitest';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {LocalProvider} from '../catalog/provider';
import {RelicsPage} from '../features/RelicsPage';
import {RelicSourceCheckCard} from '../features/RelicSourceCheckCard';
const p=new LocalProvider(),c=p.getRelicCatalog();
it('legacy public query and source cards without an attachment explicitly say no saved verification record',()=>{
 const old=renderToStaticMarkup(createElement(RelicsPage,{catalog:c}));expect(old).toContain('未附本轮核验记录');expect(old).toContain('本轮已收录31个遗物');expect(renderToStaticMarkup(createElement(RelicSourceCheckCard,{catalog:c,acquisitionId:c.acquisitions[0].id}))).toContain('未附本轮核验记录');
 // Synthetic legacy attachment with the optional feature's root list absent.
 const incomplete=structuredClone(p.getRelicSourceChecks()!);Reflect.deleteProperty(incomplete,'records');expect(renderToStaticMarkup(createElement(RelicSourceCheckCard,{catalog:c,checks:incomplete,acquisitionId:c.acquisitions[0].id}))).toContain('未附本轮核验记录');
});
it('synthetic incomplete metadata is pending in the UI and cannot be labelled listed',()=>{
 const a=structuredClone(p.getRelicSourceChecks()!);delete a.document!.checkedAt;const html=renderToStaticMarkup(createElement(RelicSourceCheckCard,{catalog:c,checks:a,acquisitionId:c.acquisitions[0].id}));expect(html).toContain('来源核验：待核');expect(html).not.toContain('来源核验：所查官方表列出');expect(html).toContain('未提供');
});
it('synthetic old dates and missing-row evidence retain their meaning without latest or account claims',()=>{
 const a=structuredClone(p.getRelicSourceChecks()!);a.document!.publishedAt='2020-01-01';a.document!.retrievedAt='2020-01-02T00:00:00Z';a.document!.checkedAt='2020-01-03T00:00:00Z';a.records[0].status='not-listed';a.records[0].reason='missing-row';a.records[0].matchCount=0;const html=renderToStaticMarkup(createElement(RelicSourceCheckCard,{catalog:c,checks:a,acquisitionId:c.acquisitions[0].id}));expect(html).toContain('2020-01-03');expect(html).toContain('不代表不能获取');expect(html).toContain('此后更新未核');expect(html).toContain('具体触发待核');expect(html).not.toContain('最新');
});
