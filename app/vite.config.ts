import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import catalog from './src/catalog/tech-tree.v1.json' with {type:'json'};
import {readFileSync,readdirSync,writeFileSync,statSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
const base=process.env.APP_BASE||'/';
if(!base.startsWith('/')||!base.endsWith('/')||base.includes('..'))throw Error('APP_BASE 必须是以/开始结束的同源路径');
function walk(dir:string):string[]{return readdirSync(dir).flatMap(n=>statSync(join(dir,n)).isDirectory()?walk(join(dir,n)):join(dir,n));}
const hash=createHash('sha256');for(const path of [...walk('src'),...walk('public'),'scripts/sw-template.js','vite.config.ts','package-lock.json'].sort()){hash.update(path);hash.update(readFileSync(path));}hash.update(base);
const build=process.env.APP_BUILD_ID||'m0-'+hash.digest('hex').slice(0,12);
export default defineConfig({base,plugins:[react(),{name:'tenno-offline-shell',transformIndexHtml(html){return html.replace('</head>',`<link rel="manifest" href="${base}manifest.webmanifest"><link rel="apple-touch-icon" href="${base}icons/icon-192.png"></head>`);},closeBundle(){
 const manifest={id:base,name:'天诺星图 · 手机副屏与行动台',short_name:'天诺星图',lang:'zh-CN',start_url:base+'#console',scope:base,display:'standalone',background_color:'#091320',theme_color:'#0a1423',icons:[{src:'icons/icon-192.png',sizes:'192x192',type:'image/png',purpose:'any'},{src:'icons/icon-512.png',sizes:'512x512',type:'image/png',purpose:'any maskable'}]};
 writeFileSync('dist/manifest.webmanifest',JSON.stringify(manifest,null,2));const files=walk('dist').filter(p=>!p.endsWith('sw.js')).map(p=>base+p.replaceAll('\\','/').replace(/^dist\//,''));
 const worker=readFileSync('scripts/sw-template.js','utf8').replace('__BASE__',JSON.stringify(base)).replace('__BUILD__',JSON.stringify(build)).replace('__FILES__',JSON.stringify(files));writeFileSync('dist/sw.js',worker);writeFileSync('dist/build-info.json',JSON.stringify({build,catalogVersion:catalog.catalogVersion,base}));
 }}],define:{__BUILD_ID__:JSON.stringify(build)},test:{include:['src/test/**/*.test.ts'],environment:'node'}});
