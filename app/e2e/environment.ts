import {mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
export const TEST_PORT=Number(process.env.APP_TEST_PORT??4173);
if(!Number.isInteger(TEST_PORT)||TEST_PORT<1024||TEST_PORT>65535)throw Error('Invalid test port');
export const TEST_ORIGIN=`http://127.0.0.1:${TEST_PORT}`;
export function evidencePath(name:string){const directory=resolve(process.env.APP_EVIDENCE_DIR??'../docs/evidence');mkdirSync(directory,{recursive:true});return resolve(directory,name);}
