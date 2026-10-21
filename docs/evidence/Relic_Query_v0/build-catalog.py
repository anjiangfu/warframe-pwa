"""Project-owned one-time adaptation of the audited subset, not an upstream updater."""
from pathlib import Path
import json
import hashlib

root = Path(__file__).resolve().parents[3]
audit = json.loads((Path(__file__).resolve().parent / 'Samples.json').read_text('utf-8'))
prefix = 'https://raw.githubusercontent.com/WFCD/warframe-drop-data/' + audit['commit'] + '/data/'
sources = [dict(id='wfcd-relics', url=prefix + 'relics.json', checkedAt=audit['checkedAt'], snapshotAt='2026-10-07T15:18:33Z'),
           dict(id='wfcd-missions', url=prefix + 'missionRewards.json', checkedAt=audit['checkedAt'], snapshotAt='2026-10-07T15:18:33Z'),
           dict(id='de-table', url=audit['officialUrl'], checkedAt=audit['checkedAt'], snapshotAt='2026-10-07T15:18:33Z')]
rewards = {}; locations = {}; relics = []; relations = []; acquisitions = []
modes = {'Survival': '生存', 'Defense': '防御', 'Caches': '秘藏奖励表（触发条件待核）'}
for sample in audit['samples']:
    rid = sample['id']
    relics.append(dict(id=rid, name='虚空遗物 · ' + sample['tier'] + ' ' + sample['number'], english=sample['name'], tier=sample['tier'], code=sample['number'],
                       nameStatus='unverified', expectedRewards=6, rewardCompleteness='complete', availability='unknown', sourceScope='partial', sourceIds=['wfcd-relics', 'de-table']))
    for raw in sample['upstream']['rewards']:
        reward_id = 'blueprint:forma' if raw['itemName'] == 'Forma Blueprint' else 'reward:wfcd:' + raw['_id']
        kind = 'blueprint' if raw['itemName'].endswith(' Blueprint') else 'component'
        if kind == 'component':
            assert raw['itemName'].endswith((' Lower Limb', ' Upper Limb', ' Barrel', ' Receiver', ' Stock', ' Handle', ' Blade', ' Blades', ' Grip', ' Pouch', ' Head', ' String'))
        label = '蓝图' if kind == 'blueprint' else '部件'
        item = dict(id=reward_id, upstreamId=raw['_id'], name='福马蓝图' if reward_id == 'blueprint:forma' else label + ' · ' + raw['itemName'], english=raw['itemName'], type=kind,
                    nameStatus='verified' if reward_id == 'blueprint:forma' else 'unverified')
        assert reward_id not in rewards or rewards[reward_id] == item
        rewards[reward_id] = item
        relations.append(dict(id=rid + ':reward:' + raw['_id'], relicId=rid, rewardId=reward_id, refinement='Intact', openingChancePercent=None,
                              verification='snapshot-checked', sourceIds=['wfcd-relics', 'de-table']))
    for raw in sample['routes']:
        lid = 'location:wfcd:' + hashlib.sha256(json.dumps([raw['planet'], raw['node'], raw['gameMode']], separators=(',', ':')).encode()).hexdigest()[:16]
        locations[lid] = dict(id=lid, planet=raw['planet'], node=raw['node'], mode=raw['gameMode'], modeZh=modes.get(raw['gameMode'], '任务模式待核'), condition=None, sourceIds=['wfcd-missions', 'de-table'])
        acquisitions.append(dict(id=rid + ':source:' + lid, relicId=rid, locationId=lid, rotation=raw['rotation'], dropChancePercent=None,
                                 verification='snapshot-checked', availability='unknown', sourceIds=['wfcd-missions', 'de-table']))
catalog = dict(catalogVersion='relics.2026.10.21.1', upstreamCommit=audit['commit'], sources=sources, relics=relics,
               rewards=list(rewards.values()), relations=relations, locations=list(locations.values()), acquisitions=acquisitions)
path = root / 'app/src/catalog/relics.v1.json'
path.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + '\n', 'utf-8')
print('Adapted', len(relics), 'relics,', len(rewards), 'distinct rewards,', len(relations), 'relations,', len(acquisitions), 'routes.')
