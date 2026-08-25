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
- 🚫 **Larangan Penggunaan Tipe `any`**: Melarang keras penggunaan tipe data `any` demi menjaga kebersihan dan keamanan tipe data (*type-safety*) kode Anda.
- 🛠️ **Script Setup Idempotent**: Tidak akan merusak atau menduplikasi impor jika dijalankan berkali-kali.

---

## 📦 Instalasi & Setup

Untuk menerapkan standar konfigurasi ini, cukup jalankan perintah inisialisasi berikut langsung di folder root proyek Anda:
```bash
npx ernest-config
```
*Tidak perlu melakukan instalasi awal! Script setup akan secara otomatis mengatur konfigurasi editor Anda, memperbarui eslint/prettier config, serta menginstal `ernest-config` beserta seluruh devDependencies yang dibutuhkan ke dalam proyek lokal Anda.*

> [!TIP]
> **Pembersihan Cache Ekstensi VS Code**: Jika editor VS Code Anda masih menampilkan garis merah/error palsu setelah menjalankan setup, muat ulang window editor Anda dengan membuka Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) lalu jalankan perintah **`Developer: Restart Window`** agar ekstensi memuat plugin baru yang baru saja dipasang secara bersih.

> [!IMPORTANT]
> **Rekomendasi Ekstensi Editor**:
> Untuk pengalaman terbaik di VS Code atau Antigravity IDE, pastikan Anda telah menginstal ekstensi resmi [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) dan [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode). Ekstensi ini diperlukan agar linting real-time, pemformatan otomatis saat menyimpan (*format on save*), dan type-only import otomatis dapat berfungsi secara maksimal.

---

## ⚙️ Cara Kerja (Setup Otomatis)

Saat Anda menjalankan `npx ernest-config`, script inisialisasi akan mengeksekusi langkah-langkah berikut di folder root proyek Anda:

1. **Menyalin `.prettierrc`**: Menyediakan aturan terstruktur untuk pengurutan impor dan pemformatan kode.
2. **Mengonfigurasi Pengaturan VS Code**: Menggabungkan konfigurasi secara aman ke dalam `.vscode/settings.json` Anda untuk mengaktifkan fitur type-only auto-imports.
3. **Menginstal Dev Dependencies**: Memasang plugin yang diperlukan (`eslint-plugin-check-file`, `@ianvs/prettier-plugin-sort-imports`, `eslint-config-prettier`, dll.) ke dalam proyek lokal Anda.
4. **Memodifikasi `eslint.config.mjs`**: Secara otomatis menyisipkan aturan `eslintConfig` pada awal konfigurasi ESLint Flat Config Anda.

---


## 📜 Standar Pemformatan yang Diterapkan

### Pengurutan Impor Prettier
Plugin `@ianvs/prettier-plugin-sort-imports` merapikan susunan impor Anda ke dalam kelompok logika yang jelas dan dipisahkan oleh baris kosong. Berikut adalah urutan spesifik yang diterapkan:

#### 1. Value Imports (Kode Logika & Runtime)
1. **Modul Bawaan Node.js (Built-in)**: Modul inti Node (contoh: `fs`, `path`).
2. **Modul Pihak Ketiga (Third-party)**: Package yang diinstal (contoh: `@nestjs/common`, `express`).
3. **Modul Lokal Alias** (menggunakan alias `@/` atau `@`), berurutan dari:
   - **Service**: diakhiri dengan `service`.
   - **DTO**: diakhiri dengan `dto`.
   - **Constanta & Enum**: diakhiri dengan `constant` atau `enum`.
   - **Utility, Function & Helper**: diakhiri dengan `util`, `function`, atau `helper`.
   - **Modul Alias Umum**.
4. **Modul Lokal Relatif** (menggunakan path relatif `./` atau `../`), berurutan dari:
   - **Service**: diakhiri dengan `service`.
   - **DTO**: diakhiri dengan `dto`.
   - **Constanta & Enum**: diakhiri dengan `constant` atau `enum`.
   - **Utility, Function & Helper**: diakhiri dengan `util`, `function`, atau `helper`.
   - **Modul Relatif Umum**.

#### 2. Type Imports (Tipe Data & Interface)
Impor tipe data mengikuti hierarki struktur yang persis sama (Tipe Bawaan, Tipe Pihak Ketiga, Tipe Alias, dan Tipe Relatif), di mana masing-masing bagian juga diurutkan secara internal.

Contoh impor yang sudah terurut:
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

### Konvensi Penamaan & Direktori
- **kebab-case**: Semua nama berkas dan nama folder di dalam direktori `src/` wajib ditulis menggunakan format kebab-case (contoh: `create-user.dto.ts` atau `auth-handler.service.ts`). Ekstensi tengah seperti `.service.ts`, `.controller.ts`, dan `.dto.ts` secara otomatis didukung.
- **Lokasi DTO**: Semua berkas DTO (`*.dto.ts`) wajib diletakkan di dalam folder bernama `dtos` (contoh: `src/user/dtos/create-user.dto.ts`).
- **Struktur Direktori Interface & Type**:
  - **Berkas Tunggal (sedikit interface)**: Gunakan satu berkas `interfaces.ts` langsung di folder modul (contoh: `src/users/interfaces.ts`).
  - **Struktur Folder (banyak interface)**: Buat folder `interfaces/`, letakkan masing-masing berkas `*.interface.ts` atau `*.type.ts` di dalamnya, lalu ekspor semuanya melalui `interfaces/index.ts` menggunakan **named exports** (contoh: `export { User } from './user.interface';`). *Ekspor wildcard (`export *`) dilarang keras di dalam berkas index ini.*
- **Struktur Direktori Function & Util**:
  - **Berkas Tunggal (sedikit utilitas)**: Gunakan satu berkas `utils.ts` langsung di folder modul (contoh: `src/users/utils.ts`).
  - **Struktur Folder (banyak utilitas)**: Buat folder `utils/`, letakkan masing-masing berkas `*.util.ts` atau `*.function.ts` di dalamnya, lalu ekspor semuanya melalui `utils/index.ts` menggunakan **named exports** (contoh: `export { formatDate } from './format-date.util';`). *Ekspor wildcard (`export *`) dilarang keras di dalam berkas index ini.*
- **Struktur Direktori Constant & Enum**:
  - **Berkas Tunggal (sedikit konstanta)**: Gunakan satu berkas `constants.ts` langsung di folder modul (contoh: `src/users/constants.ts`).
  - **Struktur Folder (banyak konstanta)**: Buat folder `constants/`, letakkan masing-masing berkas `*.constant.ts` atau `*.enum.ts` di dalamnya, lalu ekspor semuanya melalui `constants/index.ts` menggunakan **named exports** (contoh: `export { USER_ROLES } from './user-roles.constant';`). *Ekspor wildcard (`export *`) dilarang keras di dalam berkas index ini.*

---

## 📄 Lisensi

MIT © [refarwan](https://github.com/refarwan)
