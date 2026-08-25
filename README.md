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
The plugin `@ianvs/prettier-plugin-sort-imports` organizes your imports into logical groups separated by empty lines. Here is the exact sorting order applied:

#### 1. Value Imports (Logic & Runtime Code)
1. **Built-in Node.js Modules**: Core modules (e.g. `fs`, `path`).
2. **Third-party Modules**: Installed packages (e.g. `@nestjs/common`, `express`).
3. **Alias Local Modules** (using `@/` or `@` path alias), ordered as:
   - **Services**: ending with `service`.
   - **DTOs**: ending with `dto`.
   - **Constants & Enums**: ending with `constant` or `enum`.
   - **Utilities, Functions & Helpers**: ending with `util`, `function`, or `helper`.
   - **General Alias Modules**.
4. **Relative Local Modules** (using relative paths `./` or `../`), ordered as:
   - **Services**: ending with `service`.
   - **DTOs**: ending with `dto`.
   - **Constants & Enums**: ending with `constant` or `enum`.
   - **Utilities, Functions & Helpers**: ending with `util`, `function`, or `helper`.
   - **General Relative Modules**.

#### 2. Type Imports (Types & Interfaces)
Type imports follow the exact same hierarchy structure (Built-in Types, Third-party Types, Alias Types, and Relative Types), with each subset sorted internally.

Example of sorted imports:
```typescript
// --- 1. VALUE IMPORTS (KODE LOGIKA) ---
import fs from 'fs';
import { Injectable, Logger } from '@nestjs/common';

// Alias Local Modules
import { UserService } from '@/user/user.service';
import { CreateUserDto, UpdateUserDto } from '@/user/dtos/create-user.dto';
import { USER_ROLES, USER_STATUS } from '@/user/constants';
import { formatDate, parseDate } from '@/common/utils';
import { someConfig } from '@/config';

// Relative Local Modules
import { PageService } from './page.service';
import { CreatePageDto, UpdatePageDto } from './dtos/create-page.dto';
import { PAGE_LIMIT, PAGE_OFFSET } from './constants';
import { parseHtml, cleanHtml } from './utils';
import { someLocalHelper } from './helper';

// --- 2. TYPE IMPORTS (INTERFACE / TYPES) ---
import type { Request, Response } from 'express';

// Alias Type Modules
import type { UserInterface } from '@/user/interfaces';
import type { ImageInterface, ImageMetadata } from '@/common/interfaces';

// Relative Type Modules
import type { PageInterface, PageMetadata } from './interfaces';
```

### Naming & Directory Conventions
- **kebab-case**: All file names and directory names under `src/` must be formatted in kebab-case (e.g. `create-user.dto.ts` or `auth-handler.service.ts`). Middle-extensions like `.service.ts`, `.controller.ts`, and `.dto.ts` are automatically supported.
- **DTOs Location**: All DTO files (`*.dto.ts`) must be placed inside a folder named `dtos` (e.g. `src/user/dtos/create-user.dto.ts`).
- **Interfaces & Types Directory Structure**:
  - **Single file (few interfaces)**: Use a single `interfaces.ts` file directly in the module folder (e.g. `src/users/interfaces.ts`).
  - **Folder structure (multiple interfaces)**: Create an `interfaces/` folder, place individual `*.interface.ts` or `*.type.ts` files inside, and export them all from `interfaces/index.ts` using **named exports** (e.g. `export { User } from './user.interface';`). *Wildcard exports (`export *`) are strictly forbidden inside these index files.*
- **Functions & Utilities Directory Structure**:
  - **Single file (few utilities)**: Use a single `utils.ts` file directly in the module folder (e.g. `src/users/utils.ts`).
  - **Folder structure (multiple utilities)**: Create a `utils/` folder, place individual `*.util.ts` or `*.function.ts` files inside, and export them all from `utils/index.ts` using **named exports** (e.g. `export { formatDate } from './format-date.util';`). *Wildcard exports (`export *`) are strictly forbidden inside these index files.*
- **Constants & Enums Directory Structure**:
  - **Single file (few constants)**: Use a single `constants.ts` file directly in the module folder (e.g. `src/users/constants.ts`).
  - **Folder structure (multiple constants)**: Create a `constants/` folder, place individual `*.constant.ts` or `*.enum.ts` files inside, and export them all from `constants/index.ts` using **named exports** (e.g. `export { USER_ROLES } from './user-roles.constant';`). *Wildcard exports (`export *`) are strictly forbidden inside these index files.*

---

## 📄 License

MIT © [refarwan](https://github.com/refarwan)
