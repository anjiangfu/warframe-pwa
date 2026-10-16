import {readFileSync,writeFileSync,readdirSync,existsSync,mkdirSync} from 'node:fs';
import {join} from 'node:path';
const lock=JSON.parse(readFileSync('package-lock.json','utf8'));const metadata=[];const texts=[];const runtime=[];
for(const [location,entry]of Object.entries(lock.packages)){
 if(!location)continue;if(!entry.license)throw Error('Unknown license: '+location);
 const pkgPath=join(location,'package.json');const installed=existsSync(pkgPath);const pkg=installed?JSON.parse(readFileSync(pkgPath,'utf8')):undefined;
 metadata.push({location,version:entry.version,license:entry.license,installed,repository:pkg?.repository,integrity:entry.integrity});
 if(!installed)continue;const files=readdirSync(location).filter(n=>/^(licen[cs]e|copying|notice)(\.|$|-)/i.test(n));
 for(const file of files){const text=`\n\n======== ${pkg.name}@${entry.version} / ${entry.license} / ${file} ========\n${readFileSync(join(location,file),'utf8')}`;texts.push(text);if(!entry.dev)runtime.push(text);}
}
mkdirSync('licenses',{recursive:true});writeFileSync('licenses/THIRD_PARTY_LICENSES.txt',texts.join('\n'));writeFileSync('public/THIRD_PARTY_LICENSES.txt',runtime.join('\n'));writeFileSync('../docs/evidence/M0_Dependencies.json',JSON.stringify(metadata,null,2)+'\n');console.log(`License metadata ${metadata.length}; installed texts ${texts.length}; runtime texts ${runtime.length}`);
