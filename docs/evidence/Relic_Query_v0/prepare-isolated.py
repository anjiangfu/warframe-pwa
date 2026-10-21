"""Copy project-owned sources and verification inputs; never copy a user browser DB."""
from pathlib import Path
import shutil
import json

root = Path(__file__).resolve().parents[3]
isolated = root / '.v' / 'rl'
shutil.copytree(root / 'app', isolated / 'app', dirs_exist_ok=True,
                ignore=shutil.ignore_patterns('node_modules', 'dist', '.b', '.test-browser',
                                             'test-results', 'playwright-report', '.vite'))
initial = json.loads((root / 'docs/evidence/M0_Input_Hashes.json').read_text(encoding='utf-8'))
paths = list(initial['files']) + ['data/legacy-step-map.v1.json',
                                 'docs/evidence/M0_Input_Hashes.json',
                                 'docs/evidence/Material_Guides_v1/Baseline_Contracts.json',
                                 'docs/evidence/Relic_Query_v0/Samples.json']
for relative in paths:
    target = isolated / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(root / relative, target)
print(isolated / 'app')
print('Create a node_modules junction to the existing app dependency directory if absent.')
