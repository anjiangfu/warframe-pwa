from pathlib import Path
import hashlib
import json
import sys

root=Path(__file__).resolve().parents[3]
evidence=Path(__file__).resolve().parent
sha=lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
baseline=json.loads((evidence/'Baseline.json').read_text(encoding='utf-8'))
result={'protectedInputs':[], 'contracts':[], 'preservedAppFiles':[], 'authorizedAppChanges':[]}
for key in ['protectedInputs','contracts']:
    for path,expected in baseline[key].items():
        actual=sha(root/path)
        result[key].append({'path':path,'expected':expected,'actual':actual,'unchanged':actual==expected})
allowed={'app/README.md','app/src/App.tsx','app/src/catalog/provider.ts','app/src/features/RelicsPage.tsx','app/src/styles.css'}
for path,expected in baseline['app'].items():
    actual=sha(root/path)
    row={'path':path,'before':expected,'after':actual,'unchanged':actual==expected}
    result['authorizedAppChanges' if path in allowed else 'preservedAppFiles'].append(row)
before=json.loads((evidence/'Root_Dist_Before.json').read_text(encoding='utf-8'))
if '--before-delivery' in sys.argv:
    result['rootDist']=[{'path':path,'unchanged':sha(root/path)==expected} for path,expected in before.items()]
    target=evidence/'Integrity_Before_Delivery.json'
else:
    iso=root/'.v/pg/app/dist'
    result['normalArtifactParity']=[{'path':p.relative_to(root/'app/dist').as_posix(),'sha256':sha(p),'equal':sha(p)==sha(iso/p.relative_to(root/'app/dist'))} for p in (root/'app/dist').rglob('*') if p.is_file()]
    result['noTestHarnessInDelivery']=not (root/'app/dist/test-fixtures').exists()
    target=evidence/'Integrity_Final.json'
target.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
assert all(r['unchanged'] for key in ['protectedInputs','contracts','preservedAppFiles'] for r in result[key])
assert all(r['unchanged'] for r in result.get('rootDist',[]))
assert all(r['equal'] for r in result.get('normalArtifactParity',[]))
assert result.get('noTestHarnessInDelivery',True)
print(json.dumps({k:len(v) if isinstance(v,list) else v for k,v in result.items()},indent=2))
