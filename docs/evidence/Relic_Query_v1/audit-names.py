"""Project-owned audit of exact parent/component identities; emits evidence only."""
from pathlib import Path
import json

root = Path(__file__).resolve().parents[3]
folder = root / '.v/rv1-source'
out = Path(__file__).resolve().parent
z = json.loads((folder / 'zh.json').read_bytes())
components = {x['uniqueName']: x for x in json.loads((folder / 'components.json').read_bytes())}
parents = sum([json.loads((folder / (n + '.json')).read_bytes()) for n in ['Warframes', 'Melee', 'Primary', 'Secondary', 'Arch-Melee']], [])
old = json.loads((out / 'Relic_Graph_Baseline.json').read_text('utf-8'))
rows = []
for reward in old['rewards']:
    if reward['id'] == 'blueprint:forma':
        rows.append(dict(id=reward['id'], english=reward['english'], status='retained', nameZh='福马蓝图', source='existing-project', checkedAt='2026-10-24'))
        continue
    hits = []
    for p in parents:
        for ref in p.get('components', []):
            c = components.get(ref['uniqueName'])
            if not c: continue
            full = p['name'] + ' ' + c['name']
            warframe_part = p.get('category') == 'Warframes' and c['name'] in ['Chassis', 'Neuroptics', 'Systems']
            if warframe_part: full += ' Blueprint'
            if full != reward['english']: continue
            pzh = z.get(p['uniqueName'], {}).get('name')
            czh = z.get(c['uniqueName'], {}).get('name')
            generic = c['name'] == 'Blueprint' and czh is None
            if generic: czh = '蓝图'  # Existing project type glossary; not a fabricated proper name.
            if warframe_part and czh: czh += '蓝图'
            hits.append(dict(parentId=p['uniqueName'], componentId=c['uniqueName'], parentEn=p['name'], partEn=c['name'], parentZh=pzh, partZh=czh,
                             blueprintTypeGlossary=generic, nameZh=pzh + ' ' + czh if pzh and czh else None,
                             parentProperNameRemainsLatin=pzh == p['name'], dropExact=any(d.get('type') == reward['english'] for d in c.get('drops', []))))
    hits = list({(h['parentId'], h['componentId']): h for h in hits}.values())
    valid = len(hits) == 1 and hits[0]['nameZh'] is not None and hits[0]['dropExact']
    rows.append(dict(id=reward['id'], english=reward['english'], status='added' if valid else 'conflicting' if len(hits) > 1 else 'unverified',
                     nameZh=hits[0]['nameZh'] if valid else None, checkedAt='2026-10-24', hits=hits))
(out / 'Name_Audit.json').write_text(json.dumps(rows, ensure_ascii=False, indent=2) + '\n', 'utf-8')
assert len(rows) == 57 and sum(x['status'] == 'added' for x in rows) == 56
print('56 exact parent/component mappings; one retained Forma blueprint; no fuzzy bindings.')
