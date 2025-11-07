import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import nextPlugin from '@next/eslint-plugin-next';

export default tseslint.config(
  {
    ignores: [
      'dist',
      '.next',
      'node_modules',
      'tests',
      'out',
      'build',
      'api/**/*',
      'scripts/**/*',
      'public/**/*',
      'eslint-rules/**/*',
      'supabase/**/*',
      '*.config.js',
      '*.config.ts',
      'src/ai/**/*',
      'src/api/**/*',
    ],
  },
  // Base recommended configs
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // Next.js core web vitals config
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
  // TypeScript-specific config
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        project: './tsconfig.next.json',
        tsconfigRootDir: import.meta.dirname || process.cwd(),
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/no-unused-vars': 'off',
      'react-hooks/set-state-in-effect': 'off',
    },
  }
);
