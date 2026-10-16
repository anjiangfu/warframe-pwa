import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
export default defineConfig({base:process.env.APP_BASE || '/',plugins:[react()],define:{__BUILD_ID__:JSON.stringify(process.env.APP_BUILD_ID || 'm0-v1')},test:{include:['src/test/**/*.test.ts'],environment:'node'}});
