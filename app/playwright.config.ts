import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'e2e',workers:1,timeout:30000,use:{baseURL:'http://127.0.0.1:4173',headless:true,channel:'chrome',viewport:{width:1440,height:960},screenshot:'only-on-failure'},webServer:{command:'npm.cmd run preview -- --port 4173',url:'http://127.0.0.1:4173',reuseExistingServer:false}});
