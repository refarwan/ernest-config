# 🚀 ernest-config

Translations: [English](README.md) | [Bahasa Indonesia](README-id.md)

[![npm version](https://img.shields.io/npm/v/ernest-config.svg?style=flat-flat&color=3399ff)](https://www.npmjs.com/package/ernest-config)
[![license](https://img.shields.io/npm/l/ernest-config.svg?style=flat-flat&color=47d147)](https://github.com/refarwan/ernest-config)

The ultimate, zero-config Prettier & ESLint orchestrator for NestJS and TypeScript projects. Standardize your code formatting, enforce type-only imports, and maintain consistent kebab-case file structures in seconds.

---

## ✨ Features

- ⚡ **Auto-pilot Setup**: Automatically copies configuration templates and merges settings upon installation.
- 📐 **Strict Type-only Imports**: Configures VS Code and ESLint to automatically use `import type { ... }` for interfaces and types.
- 📁 **Kebab-Case Enforcer**: Ensures files and directories strictly follow the `kebab-case` convention.
- 🔮 **Smart Import Sorting**: Auto-sorts imports, separating standard imports from type-only imports.
- 🛠️ **Idempotent Setup Script**: Won't corrupt or duplicate imports if run multiple times.

---

## 📦 Installation

To apply these standard configurations to your NestJS/TypeScript project, simply install the package as a development dependency:

```bash
npm install --save-dev ernest-config
```

That's it! The `postinstall` setup script will run automatically.

> [!IMPORTANT]
> **Editor Extensions Recommended**:
> For the best experience in VS Code or Antigravity IDE, ensure you have installed the official [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extensions. This enables real-time linting, format-on-save, and automatic type-only imports to function flawlessly.

---

## ⚙️ How It Works (Automatic Setup)

When you run `npm install`, the postinstall script runs the following steps in your project root:

1. **Copies `.prettierrc`**: Adds structured rules for import sorting and code formatting.
2. **Configures VS Code Settings**: Safely merges standard settings into your `.vscode/settings.json` to enable type-only auto-imports.
3. **Installs Dev Dependencies**: Installs the required plugins (`eslint-plugin-check-file`, `@ianvs/prettier-plugin-sort-imports`, `eslint-config-prettier`, etc.) to your local project.
4. **Modifies `eslint.config.mjs`**: Automatically injects `eslintConfig` at the start of your ESLint Flat Config.

---

## 🛠️ Manual Integration (Fallback)

If you have a customized setup and the script skips automatic injection, you can add it manually in just two steps:

### 1. Update `eslint.config.mjs`

```javascript
import { eslintConfig } from 'ernest-config';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  ...eslintConfig, // <-- Add this spread operator at the start
  
  // Your other custom configurations...
);
```

### 2. Update `.vscode/settings.json`

```json
{
  "typescript.preferences.preferTypeOnlyAutoImports": true
}
```

---

## 📜 Formatting Standards Applied

### Prettier Import Sorting
Your imports are automatically structured and grouped as:
```typescript
// --- 1. VALUE IMPORTS (KODE LOGIKA) ---
import fs from 'fs';
import { Injectable } from '@nestjs/common';
import { PageService } from './page.service';
import { CreatePageDto } from './dtos/create-page.dto';

// --- 2. TYPE IMPORTS (INTERFACE / TYPES) ---
import type { Response } from 'express';
import type { ImageInterface } from '@/common/interfaces/image.interface';
```

### Naming Conventions (`kebab-case`)
All file names and directory names under `src/` must be formatted in kebab-case (e.g. `create-user.dto.ts` or `auth-handler.service.ts`). Middle-extensions like `.service.ts`, `.controller.ts`, and `.dto.ts` are automatically supported and allowed.

---

## 📄 License

MIT © [refarwan](https://github.com/refarwan)
