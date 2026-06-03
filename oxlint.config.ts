import { configOverrides, oxlintClientConfig, testOverrides } from '@finografic/oxc-config/oxlint';
import { defineConfig } from 'oxlint';
import type { OxlintConfig } from 'oxlint';

export default defineConfig({
  ...oxlintClientConfig,
  ignorePatterns: ['src/components/ui/**', 'src/lib/utils.ts'],
  rules: {
    ...oxlintClientConfig.rules,
    // react-jsx transform (tsconfig jsx: react-jsx) — React import not required for JSX.
    'react/react-in-jsx-scope': 'off',
    // Side-effect CSS imports (Astro layouts, global styles) are intentional.
    'import/no-unassigned-import': ['warn', { allow: ['**/*.css'] }],
  },
  options: {
    ...oxlintClientConfig.options,
    typeAware: undefined,
    typeCheck: undefined,
    reportUnusedDisableDirectives: undefined,
  },
  overrides: [testOverrides, configOverrides],
} satisfies OxlintConfig);
