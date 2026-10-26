"""Prepare an isolated verification copy, preserving all root application files."""
from pathlib import Path
import hashlib
import json
import shutil
import subprocess

root = Path(__file__).resolve().parents[3]
evidence = Path(__file__).resolve().parent
isolated = root / '.v' / 'm0r'
if isolated.exists():
    raise RuntimeError('Refusing to overwrite an existing verification copy')

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

tracked = subprocess.check_output(['git', 'ls-files', '-z'], cwd=root).decode().split('\0')
protected = json.loads((root / 'docs/evidence/Relic_Source_Check_v0/Protected_Inputs_Initial.json').read_text(encoding='utf-8'))
contracts = json.loads((root / 'docs/evidence/Relic_Source_Check_v0/Data_Contracts_Initial.json').read_text(encoding='utf-8'))
for relative, expected in {**protected, **contracts}.items():
    if digest(root / relative) != expected:
        raise RuntimeError('Baseline hash mismatch: ' + relative)
initial = {
    'head': subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=root).decode().strip(),
    'protectedInputs': protected,
    'dataContracts': contracts,
    'trackedApp': {p: digest(root / p) for p in tracked if p.startswith('app/')},
    'rootDist': {p.relative_to(root).as_posix(): digest(p) for p in (root / 'app/dist').rglob('*') if p.is_file()},
    'lockSha256': digest(root / 'app/package-lock.json'),
    'isolatedApp': str(isolated / 'app'),
}
(evidence / 'Initial.json').write_text(json.dumps(initial, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
shutil.copytree(root / 'app', isolated / 'app', ignore=shutil.ignore_patterns(
    'node_modules', 'dist', '.b', '.test-browser', 'test-results', 'playwright-report', '.vite'))
paths = list(protected) + ['data/legacy-step-map.v1.json', 'docs/evidence/M0_Input_Hashes.json',
    'docs/evidence/Material_Guides_v1/Baseline_Contracts.json',
    'docs/evidence/Relic_Query_v0/Samples.json',
    'docs/evidence/Relic_Query_v1/Relic_Graph_Baseline.json',
    'docs/evidence/Relic_Query_v1/Name_Audit.json',
    'docs/evidence/Relic_Query_v1/Location_Audit.json',
    'docs/evidence/Relic_Query_v2/Baseline_Catalog.json',
    'docs/evidence/Relic_Query_v2/Samples.json',
    'docs/evidence/Relic_Query_v2/New_Name_Audit.json',
    'docs/evidence/Relic_Source_Check_v0/Author_Audit.json',
    'docs/evidence/Relic_Source_Check_v0/Baseline_Catalog.json']
for relative in paths:
    target = isolated / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(root / relative, target)
if digest(isolated / 'app/package-lock.json') != initial['lockSha256']:
    raise RuntimeError('Dependency lock mismatch')
print(isolated / 'app')
