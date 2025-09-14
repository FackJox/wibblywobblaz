import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const eslintConfig = [
  // Next.js core rules and TypeScript support
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  
  // Override for Node.js scripts directory
  {
    files: ['scripts/**/*.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
  
  // PandaCSS generated files should be ignored
  {
    ignores: [
      'styled-system/**',
      '.panda/**',
      'panda-css/**',
    ],
  },
];

export default eslintConfig;