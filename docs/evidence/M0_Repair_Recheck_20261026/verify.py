"""Read back results and verify the root checkout was not modified by tests."""
from pathlib import Path
import hashlib
import json

root = Path(__file__).resolve().parents[3]
evidence = Path(__file__).resolve().parent
initial = json.loads((evidence / 'Initial.json').read_text(encoding='utf-8'))

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

comparison = {}
for group in ['protectedInputs', 'dataContracts', 'trackedApp', 'rootDist']:
    comparison[group] = [{
        'path': relative, 'expected': expected,
        'actual': digest(root / relative),
        'unchanged': digest(root / relative) == expected,
    } for relative, expected in initial[group].items()]
isolated_dist = root / '.v/m0r/app/dist'
comparison['normalBuildParity'] = [{
    'path': relative,
    'rootHash': digest(root / relative),
    'isolatedHash': digest(isolated_dist / Path(relative).relative_to('app/dist')),
    'unchanged': digest(root / relative) == digest(isolated_dist / Path(relative).relative_to('app/dist')),
} for relative in initial['rootDist']]
commands = json.loads((evidence / 'Recheck_Final_Commands.json').read_text(encoding='utf-8'))
result = {
    'baselineHead': initial['head'],
    'commands': [{k: c[k] for k in ['command', 'exitCode', 'startedAt', 'finishedAt']} for c in commands],
    'comparisons': comparison,
    'allHashesMatch': all(row['unchanged'] for rows in comparison.values() for row in rows),
    'sevenCommandsPassed': len(commands) == 7 and all(c['exitCode'] == 0 for c in commands),
}
(evidence / 'Final.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(json.dumps({
    'allHashesMatch': result['allHashesMatch'],
    'sevenCommandsPassed': result['sevenCommandsPassed'],
    'counts': {k: len(v) for k, v in comparison.items()},
}, indent=2))
if not result['allHashesMatch'] or not result['sevenCommandsPassed']:
    raise SystemExit(1)
