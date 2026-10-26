import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {resolve} from 'node:path';
// Isolated test harness, never an input to the normal application build.
export default defineConfig({plugins:[react()],base:'/test-fixtures/',publicDir:false,build:{outDir:'dist/test-fixtures',emptyOutDir:false,rollupOptions:{input:resolve('e2e/fixtures/prime.html')}}});
