# 🚀 ernest-config

Terjemahan: [English](README.md) | [Bahasa Indonesia](README-id.md)

[![npm version](https://img.shields.io/npm/v/ernest-config.svg?style=flat-flat&color=3399ff)](https://www.npmjs.com/package/ernest-config)
[![license](https://img.shields.io/npm/l/ernest-config.svg?style=flat-flat&color=47d147)](https://github.com/refarwan/ernest-config)

Orkestrator Prettier & ESLint terbaik, tanpa konfigurasi ribet untuk proyek NestJS dan TypeScript. Standardisasi format kode Anda, paksakan penggunaan type-only import, dan jaga struktur nama file kebab-case yang konsisten dalam hitungan detik.

---

## ✨ Fitur

- ⚡ **Setup Otomatis**: Secara otomatis menyalin template konfigurasi dan menggabungkan pengaturan setelah instalasi selesai.
- 📐 **Paksakan Type-only Import**: Mengonfigurasi VS Code dan ESLint untuk otomatis menulis `import type { ... }` pada interface dan type.
- 📁 **Pewajiban Kebab-Case**: Memastikan semua berkas dan direktori mematuhi format penamaan `kebab-case`.
- 🔮 **Pengurutan Impor Cerdas**: Mengurutkan impor secara otomatis, memisahkan impor modul logika dan impor tipe data.
- 🛠️ **Script Setup Idempotent**: Tidak akan merusak atau menduplikasi impor jika dijalankan berkali-kali.

---

## 📦 Instalasi

Untuk menerapkan standar konfigurasi ini ke proyek NestJS/TypeScript Anda, cukup instal package ini sebagai development dependency:

```bash
npm install --save-dev ernest-config
```

Selesai! Script setup `postinstall` akan berjalan secara otomatis di latar belakang.

> [!IMPORTANT]
> **Rekomendasi Ekstensi Editor**:
> Untuk pengalaman terbaik di VS Code atau Antigravity IDE, pastikan Anda telah menginstal ekstensi resmi [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) dan [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode). Ekstensi ini diperlukan agar linting real-time, pemformatan otomatis saat menyimpan (*format on save*), dan type-only import otomatis dapat berfungsi secara maksimal.

---

## ⚙️ Cara Kerja (Setup Otomatis)

Saat Anda menjalankan perintah install, script postinstall akan mengeksekusi langkah-langkah berikut di folder root proyek Anda:

1. **Menyalin `.prettierrc`**: Menyediakan aturan terstruktur untuk pengurutan impor dan pemformatan kode.
2. **Mengonfigurasi Pengaturan VS Code**: Menggabungkan konfigurasi secara aman ke dalam `.vscode/settings.json` Anda untuk mengaktifkan fitur type-only auto-imports.
3. **Menginstal Dev Dependencies**: Memasang plugin yang diperlukan (`eslint-plugin-check-file`, `@ianvs/prettier-plugin-sort-imports`, `eslint-config-prettier`, dll.) ke dalam proyek lokal Anda.
4. **Memodifikasi `eslint.config.mjs`**: Secara otomatis menyisipkan aturan `eslintConfig` pada awal konfigurasi ESLint Flat Config Anda.

---

## 🛠️ Integrasi Manual (Cadangan)

Jika Anda memiliki struktur proyek kustom dan script setup melewati proses injeksi otomatis, Anda dapat menambahkannya secara manual dalam dua langkah mudah:

### 1. Perbarui `eslint.config.mjs`

```javascript
import { eslintConfig } from 'ernest-config';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  ...eslintConfig, // <-- Tambahkan spread operator ini di awal array
  
  // Konfigurasi kustom Anda yang lain...
);
```

### 2. Perbarui `.vscode/settings.json`

```json
{
  "typescript.preferences.preferTypeOnlyAutoImports": true
}
```

---

## 📜 Standar Pemformatan yang Diterapkan

### Pengurutan Impor Prettier
Semua impor akan dikelompokkan dan diurutkan secara otomatis seperti berikut:
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

### Konvensi Penamaan (`kebab-case`)
Semua nama berkas dan nama folder di dalam direktori `src/` wajib ditulis menggunakan format kebab-case (contoh: `create-user.dto.ts` atau `auth-handler.service.ts`). Ekstensi tengah seperti `.service.ts`, `.controller.ts`, dan `.dto.ts` secara otomatis didukung dan diperbolehkan.

---

## 📄 Lisensi

MIT © [refarwan](https://github.com/refarwan)
