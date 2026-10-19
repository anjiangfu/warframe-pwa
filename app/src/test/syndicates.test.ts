import {it,expect} from 'vitest';
import {LocalProvider} from '../catalog/provider';
import {newProfile} from '../storage/imports';
import {evaluateSyndicate,syndicateContributions,syndicateGoalId,type SyndicateProfile} from '../domain/syndicates';
const provider=new LocalProvider(),catalog=provider.getSyndicateCatalog(),id='syndicate:hex',definition=catalog.syndicates[0];
function profile(rank:number|null=3,standing:number|null=65000):SyndicateProfile{const p:SyndicateProfile=newProfile(provider.getCatalog(),'p','测试',false);p.personalFacts={[definition.rankFactId]:{value:rank,recordedAt:'原时间'},[definition.standingFactId]:{value:standing,recordedAt:'原时间'}};p.syndicateTargets={[id]:5};return p;}
it('catalog covers exactly five adjacent steps with checked costs, shared credits and thirteen new resources',()=>{
 expect(definition.steps.map(s=>[s.from,s.to,s.standing.quantity,s.sacrifices.find(x=>x.resourceId==='credits')?.quantity])).toEqual([[0,1,5000,10000],[1,2,22000,25000],[2,3,44000,50000],[3,4,70000,100000],[4,5,99000,200000]]);expect(provider.getResourceCatalog().resources).toHaveLength(23);expect(provider.getResourceCatalog().resources.filter(r=>r.id==='credits')).toHaveLength(1);expect(definition.steps[3].sacrifices.map(x=>x.quantity)).toEqual([100000,25,25,40]);
});
it('current 3 target 5 evaluates only 3 to 4; standing cost is 70000, not the next capacity',()=>{
 const p=profile(),before=structuredClone(p),r=evaluateSyndicate(catalog,p,id);expect(r.step?.id).toBe('hex:3-4');expect(r.standing).toMatchObject({required:70000,owned:65000,deficit:5000,state:'unmet'});expect(r.materials.some(x=>x.resourceId==='material:techrot-motherboard')).toBe(false);expect(p).toEqual(before);p.personalFacts![definition.rankFactId].value=4;expect(evaluateSyndicate(catalog,p,id).step?.id).toBe('hex:4-5');
});
it('unknown, abnormal old ranks, unknown standing and incomplete provenance never become zero demand',()=>{
 const p=profile(null,null),before=structuredClone(p);expect(evaluateSyndicate(catalog,p,id).mode).toBe('unknown');expect(syndicateContributions(catalog,p)[0].requirementsComplete).toBe(false);expect(p).toEqual(before);p.personalFacts![definition.rankFactId].value=9;expect(evaluateSyndicate(catalog,p,id).mode).toBe('unknown');expect(p.personalFacts![definition.rankFactId].value).toBe(9);p.personalFacts![definition.rankFactId].value=3;expect(evaluateSyndicate(catalog,p,id).standing.deficit).toBeNull();const c=structuredClone(catalog);c.syndicates[0].steps[3].sacrifices[1].verification='unverified';const r=evaluateSyndicate(c,p,id);expect(r.requirementsComplete).toBe(false);expect(r.materials[1].required).toBeNull();
});
it('Liked and finale are independent and materials alone do not make rankup ready; no romance requirement',()=>{
 const p=profile(3,70000);for(const x of definition.steps[3].sacrifices)p.stock[x.resourceId]=x.quantity;let r=evaluateSyndicate(catalog,p,id);expect(r.materialsState).toBe('satisfied');expect(r.relations.state).toBe('unknown');expect(r.task.state).toBe('unknown');expect(r.ready).toBe(false);for(const m of definition.members)p.personalFacts![m.factId]={value:true,recordedAt:'手动'};p.personalFacts![definition.finaleFactId]={value:false,recordedAt:'手动'};r=evaluateSyndicate(catalog,p,id);expect(r.relations.state).toBe('satisfied');expect(r.task.state).toBe('unmet');expect(r.action).toContain('终章');expect(r.ready).toBe(false);expect(JSON.stringify(definition.steps[3].conditions)).not.toMatch(/romance|Trusted|Close/);
});
it('completed finale does not require regrinding or fabricate six relationship facts',()=>{
 const p=profile(3,70000);p.personalFacts![definition.finaleFactId]={value:true,recordedAt:'手动'};const before=structuredClone(p),r=evaluateSyndicate(catalog,p,id);expect(r.relations.state).toBe('satisfied');expect(r.relations.reason).toContain('不再');expect(r.task.state).toBe('satisfied');expect(p).toEqual(before);expect(definition.members.every(m=>p.personalFacts![m.factId]===undefined)).toBe(true);
});
it('reached, completed and deferred goals contribute nothing; restored goals use the current actual rank',()=>{
 const p=profile();p.goalStates={[syndicateGoalId(id)]:'done'};expect(syndicateContributions(catalog,p)).toEqual([]);p.goalStates[syndicateGoalId(id)]='deferred';expect(syndicateContributions(catalog,p)).toEqual([]);p.goalStates[syndicateGoalId(id)]='focused';p.personalFacts![definition.rankFactId].value=4;expect(syndicateContributions(catalog,p)[0].lines.some(l=>l.resourceId==='material:techrot-motherboard')).toBe(true);p.personalFacts![definition.rankFactId].value=5;expect(evaluateSyndicate(catalog,p,id).mode).toBe('reached');expect(syndicateContributions(catalog,p)).toEqual([]);
});
it('synthetic second syndicate uses its own stable facts, standing and goal ID',()=>{
 const c=structuredClone(catalog),other=structuredClone(definition);other.id='syndicate:synthetic';other.rankFactId='synthetic:rank';other.standingFactId='synthetic:standing';other.steps[3].id='synthetic:3-4';c.syndicates.push(other);const p=profile();p.syndicateTargets![other.id]=5;p.personalFacts![other.rankFactId]={value:3,recordedAt:'x'};p.personalFacts![other.standingFactId]={value:0,recordedAt:'x'};expect(evaluateSyndicate(c,p,id).standing.deficit).toBe(5000);expect(evaluateSyndicate(c,p,other.id).standing.deficit).toBe(70000);expect(syndicateContributions(c,p).map(x=>x.id)).toEqual(['goal:syndicate:hex','goal:syndicate:synthetic']);
});
it('catalog renames, missing old references and unsaved target queries preserve all personal fields',()=>{
 const p=profile(),before=structuredClone(p),c=structuredClone(catalog);c.syndicates[0].name='重命名';c.syndicates[0].steps.reverse();expect(evaluateSyndicate(c,p,id).step?.id).toBe('hex:3-4');expect(evaluateSyndicate(c,p,id,3).mode).toBe('reached');expect(p).toEqual(before);p.syndicateTargets!['old:unknown']=2;expect(syndicateContributions(c,p).find(x=>x.id==='goal:old:unknown')?.requirementsComplete).toBe(false);
});
