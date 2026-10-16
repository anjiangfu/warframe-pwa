/* global navigator, fetch */
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
import {writeFileSync} from 'node:fs';
import {chromium} from '@playwright/test';
import {preview} from 'vite';
import assert from 'node:assert/strict';
function build(base){execFileSync(process.execPath,[resolve('node_modules/vite/bin/vite.js'),'build'],{env:{...process.env,APP_BASE:base,APP_BUILD_ID:''},stdio:'pipe'});}
let server,browser;
try{
 build('/tenno/');server=await preview({base:'/tenno/',preview:{host:'127.0.0.1',port:4174,strictPort:true}});browser=await chromium.launch({channel:'chrome',headless:true});const context=await browser.newContext();let page=await context.newPage();await page.goto('http://127.0.0.1:4174/tenno/#profile');await page.getByRole('button',{name:'使用 MR12 模板创建档案'}).click();await page.waitForFunction(()=>!!navigator.serviceWorker.controller);await page.getByLabel('档案名称').fill('子路径专用档案');await page.getByRole('button',{name:'保存账号档案'}).click();await page.getByRole('status').filter({hasText:'已保存'}).waitFor();const manifest=await page.evaluate(async()=>await(await fetch('/tenno/manifest.webmanifest')).json());assert.equal(manifest.scope,'/tenno/');assert.equal(manifest.start_url,'/tenno/#tree');await context.setOffline(true);await page.close();page=await context.newPage();await page.goto('http://127.0.0.1:4174/tenno/#profile');assert.equal(await page.getByLabel('档案名称').inputValue(),'子路径专用档案');writeFileSync('../docs/evidence/M0_Subpath.json',JSON.stringify({base:'/tenno/',scope:manifest.scope,start_url:manifest.start_url,offlineDeepLinkReopen:true,profilePreserved:true},null,2));console.log('PASS /tenno/ manifest/scope/assets/SW/offline profile reopen');
}finally{await browser?.close();if(server)await new Promise(resolve=>server.httpServer.close(resolve));build('/');}
