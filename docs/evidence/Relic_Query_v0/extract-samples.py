"""Project-owned audit extractor. Reads pinned data only; never runs upstream code."""
from pathlib import Path
from html.parser import HTMLParser
import hashlib
import json

root = Path(__file__).resolve().parents[3]
raw = root / '.v/rl-source'
out = Path(__file__).resolve().parent
sha = '3263b2dff8bc1b434a191f0364395b156bd26561'
selected = [('Lith', n) for n in ['C7', 'G14', 'S19']] + [('Meso', n) for n in ['A12', 'V13', 'V17']] + [('Neo', n) for n in ['C10', 'C7', 'K10']] + [('Axi', n) for n in ['A21', 'P10', 'S8']]
data = json.loads((raw / 'data/relics.json').read_bytes())['relics']
missions = json.loads((raw / 'data/missionRewards.json').read_bytes())['missionRewards']
info = json.loads((raw / 'data/info.json').read_bytes())
official = (raw / 'official-drop-table.html').read_bytes()
assert hashlib.md5(official).hexdigest() == info['hash']
for row in json.loads((out / 'Download_Initial.json').read_text('utf-8')):
    if row['ok']:
        assert hashlib.sha256((raw / row['path']).read_bytes()).hexdigest() == row['sha256']

class Rows(HTMLParser):
    def __init__(self):
        super().__init__(); self.rows = []; self.cells = []; self.text = None; self.header = False
    def handle_starttag(self, tag, attrs):
        if tag == 'tr': self.cells = []; self.header = False
        if tag in ('td', 'th'): self.text = ''; self.header |= tag == 'th'
    def handle_data(self, text):
        if self.text is not None: self.text += text
    def handle_endtag(self, tag):
        if tag in ('td', 'th') and self.text is not None:
            self.cells.append(self.text.strip()); self.text = None
        if tag == 'tr' and any(self.cells): self.rows.append((self.header, self.cells))

parser = Rows(); parser.feed(official.decode('utf-8'))
sections = {}; heading = ''
for header, cells in parser.rows:
    if header and len(cells) == 1:
        heading = cells[0]; sections.setdefault(heading, [])
    elif not header:
        sections.setdefault(heading, []).append(cells)
# Mission rotation headings are shared, so retain a separate keyed traversal.
mission_rows = {}; place = ''; rotation = None
for header, cells in parser.rows:
    if header and len(cells) == 1:
        if cells[0].startswith('Rotation '): rotation = cells[0].removeprefix('Rotation ')
        else: place = cells[0]; rotation = None
    elif not header: mission_rows.setdefault((place, rotation), []).append(cells)

samples = []
for tier, number in selected:
    candidates = [r for r in data if r['tier'] == tier and r['relicName'] == number]
    intact = next(r for r in candidates if r['state'] == 'Intact')
    names = [r['itemName'] for r in intact['rewards']]
    assert len(names) == len(set(names)) == 6 and 'Forma Blueprint' in names
    assert all(set(r['itemName'] for r in variant['rewards']) == set(names) for variant in candidates)
    name = tier + ' ' + number + ' Relic'
    official_rows = sections[name + ' (Intact)']
    assert [row[0] for row in official_rows] == names
    routes = []; seen = set()
    for planet, nodes in missions.items():
        for node, entry in nodes.items():
            if entry.get('isEvent') or (planet, node) in seen: continue
            rotations = entry['rewards'].items() if isinstance(entry['rewards'], dict) else [(None, entry['rewards'])]
            for rotation, rows in rotations:
                matches = [x for x in rows if x['itemName'] == name]
                if matches and len(routes) < 2:
                    suffix = ' (' + entry['gameMode'] + ')'
                    heading = planet + '/' + node + ('' if node.endswith(suffix) else suffix)
                    assert any(row[0] == name for row in mission_rows[(heading, rotation)])
                    routes.append(dict(planet=planet, node=node, gameMode=entry['gameMode'], rotation=rotation,
                                       isEvent=entry['isEvent'], row=matches[0], officialHeading=heading))
                    seen.add((planet, node)); break
    assert len(routes) == 2
    samples.append(dict(id='relic:' + tier.lower() + ':' + number.lower(), name=name,
                        tier=tier, number=number, upstream=intact, routes=routes,
                        rewardRowsOfficialEqual=True, variantRewardSetsEqual=True))
report = dict(commit=sha, checkedAt='2026-10-21', info=info, officialUrl='https://warframe-web-assets.nyc3.cdn.digitaloceanspaces.com/uploads/cms/hnfvc0o3jnfvc873njb03enrf56.html',
              officialSha256=hashlib.sha256(official).hexdigest(), officialBytes=len(official),
              officialMd5MatchesPinnedBuild=True, sourceScope='Two excerpted mission rows per relic, not all acquisition sources; current availability unknown.', samples=samples)
(out / 'Samples.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', 'utf-8')
lines = ['# 首批真实样本（固定表快照）', '', '12个，四纪元各3个；均含福马蓝图。中文遗物纪元/专名未核，界面提供中文类别及原名；奖励类型按原名称后缀明确区分。', '', '每项6个完整基础奖励，来源只摘录2条，不称全部来源或当前可刷。', '']
for x in samples:
    lines += ['## ' + x['id'] + ' · 虚空遗物 ' + x['name'], '', '奖励：' + '；'.join(r['itemName'] for r in x['upstream']['rewards']), '', '来源快照：' + '；'.join(r['officialHeading'] + ' / ' + (r['rotation'] or '轮次未列') for r in x['routes']), '']
(out / 'Samples.md').write_text('\n'.join(lines), 'utf-8')
print('12 relics, 72 reward rows, 24 excerpted routes verified against the same official bytes; availability unknown.')
