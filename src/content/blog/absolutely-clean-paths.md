---
title: "Absolute-ly Clean Paths"
description: "A quick tip for cleaning up messy relative import paths in Node projects using eslint-import-resolver-alias."
pubDate: 2020-01-28
tags: ["javascript", "eslint", "node"]
---

If you've ever dealt with deeply nested relative imports in a Node project, you know the pain:

```javascript
import MyComponent from '../../../components/MyComponent';
```

These paths are fragile, hard to read, and a nightmare when you refactor your folder structure.

## The fix

The `eslint-import-resolver-alias` package offers a clean solution. Install it, then add the following to your `.eslintrc.json`:

```json
{
  "settings": {
    "import/resolver": {
      "node": {
        "paths": ["src", "server"]
      }
    }
  }
}
```

The `paths` array should reference your source directories. Once configured, those messy relative imports become clean absolute-style paths:

```javascript
import MyComponent from 'components/MyComponent';
```

Much better. Your imports are now readable, resilient to folder restructuring, and consistent across the project.
