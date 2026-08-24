import eslintPluginAstro from 'eslint-plugin-astro';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    ignores: ['dist/', '.astro/', 'node_modules/'],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      // Ban `as` casts. A cast asserts a type the compiler cannot verify, so it
      // silences the one check that would have caught the mismatch. Use a
      // runtime check or a type guard instead. `as const` is not a cast — it
      // narrows a literal — so it stays allowed.
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSAsExpression:not([typeAnnotation.typeName.name="const"])',
          message:
            "No 'as' casts — narrow with a runtime check or a type guard. `as const` is fine.",
        },
      ],
    },
  },
  ...eslintPluginAstro.configs.recommended,
];
