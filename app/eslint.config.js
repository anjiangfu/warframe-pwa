import js from '@eslint/js';
import ts from 'typescript-eslint';
export default ts.config({ignores:['dist/**','node_modules/**','test-results/**','playwright-report/**','.test-browser/**']},js.configs.recommended,...ts.configs.recommended,{files:['**/*.js','**/*.mjs'],languageOptions:{globals:{process:'readonly',console:'readonly',Buffer:'readonly',URL:'readonly'}}},{rules:{'@typescript-eslint/no-explicit-any':'error'}});
