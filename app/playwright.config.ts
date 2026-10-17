import {TEST_ORIGIN,TEST_PORT} from './e2e/environment';
import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'e2e',workers:1,timeout:30000,use:{baseURL:TEST_ORIGIN,headless:true,channel:'chrome',viewport:{width:1440,height:960},screenshot:'only-on-failure'},webServer:{command:`npm.cmd run preview -- --port ${TEST_PORT}`,url:TEST_ORIGIN,reuseExistingServer:false}});
