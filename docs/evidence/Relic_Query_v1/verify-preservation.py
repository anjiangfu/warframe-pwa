"""Read-only comparisons of protected inputs, data contracts and isolated test inputs."""
from pathlib import Path
import hashlib
import json
import sys

root = Path(__file__).resolve().parents[3]
evidence = Path(__file__).resolve().parent
isolated = root / '.v/rv1/app'
phase = sys.argv[1] if len(sys.argv) > 1 else 'Before_Final_Build'
assert phase in ('Before_Final_Build', 'After_Final_Build')
digest = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
initial = json.loads((evidence / 'Protected_Inputs_Initial.json').read_text('utf-8'))
inputs = [dict(path=x['path'], expected=x['after'], actual=digest(root / x['path']))
          for x in initial['results']]
contracts = json.loads((evidence / 'Data_Contracts_Initial.json').read_text('utf-8'))
contracts = [dict(path=p, expected=h, actual=digest(root / p)) for p, h in contracts.items()]
def files(folder):
    return {p.relative_to(folder).as_posix(): digest(p)
            for p in folder.rglob('*') if p.is_file()}
test_inputs = {}
for directory in ('src', 'public', 'e2e', 'scripts'):
    test_inputs.update({directory + '/' + p: h for p, h in files(root / 'app' / directory).items()})
for p in (root / 'app').iterdir():
    if p.is_file() and p.suffix in ('.json', '.ts'):
        test_inputs[p.name] = digest(p)
parity = [dict(path=p, original=h, isolated=digest(isolated / p)) for p, h in test_inputs.items()]
baseline_dist = json.loads((evidence / 'Original_Dist_Initial.json').read_text('utf-8'))
current_dist = files(root / 'app/dist')
expected_dist = baseline_dist if phase == 'Before_Final_Build' else files(isolated / 'dist')
report = dict(phase=phase, protectedInputs=inputs, dataContracts=contracts,
              testedSourceParity=parity, originalDist=current_dist,
              expectedDist=expected_dist, distMatches=current_dist == expected_dist)
old_graph = json.loads((evidence / 'Relic_Graph_Baseline.json').read_text('utf-8'))
new_graph = json.loads((root / 'app/src/catalog/relics.v1.json').read_text('utf-8'))
graph_equal = True
for key in ('relics', 'rewards', 'relations', 'locations', 'acquisitions'):
    graph_equal &= len(old_graph[key]) == len(new_graph[key])
    for old, new in zip(old_graph[key], new_graph[key]):
        graph_equal &= all(new.get(k) == v for k, v in old.items())
for old in old_graph['sources']:
    new = next((x for x in new_graph['sources'] if x['id'] == old['id']), {})
    graph_equal &= all(new.get(k) == v for k, v in old.items())
report['legacyRelicGraphUnchanged'] = graph_equal
report['passed'] = (len(inputs) == 17 and
                    all(x['expected'] == x['actual'] for x in inputs + contracts) and
                    all(x['original'] == x['isolated'] for x in parity) and report['distMatches'] and graph_equal)
(evidence / ('Preservation_' + phase + '.json')).write_text(
    json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
assert report['passed'], 'Preservation or isolated-source comparison failed'
print(json.dumps(dict(passed=True, protectedInputs=len(inputs), dataContracts=len(contracts),
                      testedFiles=len(parity), distFiles=len(current_dist), phase=phase)))
