#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const pkgJson = require("../package.json");

const projectRoot = process.env.INIT_CWD || process.cwd();

let targetDir = projectRoot;
if (projectRoot.includes("node_modules")) {
  targetDir = projectRoot.split("/node_modules")[0];
}

function setupProject() {
  console.log("\n🚀 [ernest-config] Memulai setup otomatis...");

  // 1. Copy file .prettierrc
  try {
    const templatePrettier = path.join(__dirname, "../templates/.prettierrc");
    const targetPrettier = path.join(targetDir, ".prettierrc");
    if (fs.existsSync(templatePrettier)) {
      fs.copyFileSync(templatePrettier, targetPrettier);
      console.log("✅ File .prettierrc berhasil di-copy ke project NestJS!");
    } else {
      console.error("❌ Template .prettierrc tidak ditemukan!");
    }
  } catch (err) {
    console.error("❌ Gagal me-copy file .prettierrc:", err.message);
  }

  // 2. Copy / Merge .vscode (settings.json & extensions.json)
  try {
    const vscodeTargetDir = path.join(targetDir, ".vscode");
    if (!fs.existsSync(vscodeTargetDir)) {
      fs.mkdirSync(vscodeTargetDir, { recursive: true });
    }

    // 2.1 settings.json
    const vscodeTemplateSettings = path.join(__dirname, "../templates/.vscode/settings.json");
    const vscodeTargetSettings = path.join(vscodeTargetDir, "settings.json");
    if (fs.existsSync(vscodeTemplateSettings)) {
      let mergedSettings = {};
      if (fs.existsSync(vscodeTargetSettings)) {
        try {
          const existingContent = fs.readFileSync(vscodeTargetSettings, "utf8");
          mergedSettings = JSON.parse(existingContent);
        } catch (e) {
          console.warn("⚠️ Gagal membaca settings.json yang sudah ada, akan ditimpa.");
        }
      }
      const templateSettings = JSON.parse(fs.readFileSync(vscodeTemplateSettings, "utf8"));
      mergedSettings = { ...mergedSettings, ...templateSettings };
      fs.writeFileSync(vscodeTargetSettings, JSON.stringify(mergedSettings, null, 2), "utf8");
      console.log("✅ File .vscode/settings.json berhasil dikonfigurasi!");
    }

    // 2.2 extensions.json
    const vscodeTemplateExtensions = path.join(__dirname, "../templates/.vscode/extensions.json");
    const vscodeTargetExtensions = path.join(vscodeTargetDir, "extensions.json");
    if (fs.existsSync(vscodeTemplateExtensions)) {
      let mergedExtensions = { recommendations: [] };
      if (fs.existsSync(vscodeTargetExtensions)) {
        try {
          const existingExt = JSON.parse(fs.readFileSync(vscodeTargetExtensions, "utf8"));
          if (Array.isArray(existingExt.recommendations)) {
            mergedExtensions.recommendations = existingExt.recommendations;
          }
        } catch (e) {
          console.warn("⚠️ Gagal membaca extensions.json yang sudah ada.");
        }
      }
      const templateExt = JSON.parse(fs.readFileSync(vscodeTemplateExtensions, "utf8"));
      if (Array.isArray(templateExt.recommendations)) {
        templateExt.recommendations.forEach((item) => {
          if (!mergedExtensions.recommendations.includes(item)) {
            mergedExtensions.recommendations.push(item);
          }
        });
      }
      fs.writeFileSync(vscodeTargetExtensions, JSON.stringify(mergedExtensions, null, 2), "utf8");
      console.log("✅ File .vscode/extensions.json berhasil dikonfigurasi!");
    }
  } catch (err) {
    console.error("❌ Gagal mengatur file .vscode:", err.message);
  }

  // 3. Install devDependencies ke project user
  try {
    const devDeps = [
      `ernest-config@${pkgJson.version}`,
      "prettier",
      "eslint",
      "eslint-config-prettier",
      "eslint-plugin-prettier",
      "eslint-plugin-check-file",
      "typescript-eslint",
      "@eslint/js",
      "globals",
      "@ianvs/prettier-plugin-sort-imports"
    ];

    console.log("📦 Meng-install devDependencies...");
    execSync(`npm install --save-dev ${devDeps.join(" ")}`, {
      cwd: targetDir,
      stdio: "inherit",
    });
    console.log("✅ Semua dependencies (Prettier & ESLint) berhasil di-install!");
  } catch (err) {
    console.error("⚠️ Gagal meng-install dependencies otomatis:", err.message);
  }

  // 4. Injeksi otomatis eslint.config.mjs
  try {
    const eslintConfigPath = path.join(targetDir, "eslint.config.mjs");
    if (fs.existsSync(eslintConfigPath)) {
      let content = fs.readFileSync(eslintConfigPath, "utf8");

      // Cek apakah sudah pernah diinjeksi
      if (!content.includes("ernest-config")) {
        // Prepend import di awal berkas
        content = "import { eslintConfig } from 'ernest-config';\n" + content;

        // Injeksi ...eslintConfig di bagian akhir tseslint.config atau array export agar tidak ditimpa
        if (content.includes("export default tseslint.config(")) {
          const lastIndex = content.lastIndexOf(");");
          if (lastIndex !== -1) {
            const prefix = content.slice(0, lastIndex);
            const comma = prefix.trim().endsWith(",") ? "" : ",";
            content = prefix + `${comma}\n  ...eslintConfig\n` + content.slice(lastIndex);
            console.log("✅ Berhasil menginjeksi eslintConfig di akhir tseslint.config di eslint.config.mjs!");
          } else {
            console.log("\n⚠️ Pola tseslint.config tidak lengkap (tidak ditemukan ');').");
          }
        } else if (content.includes("export default [")) {
          const lastIndex = content.lastIndexOf("];");
          if (lastIndex !== -1) {
            const prefix = content.slice(0, lastIndex);
            const comma = prefix.trim().endsWith(",") ? "" : ",";
            content = prefix + `${comma}\n  ...eslintConfig\n` + content.slice(lastIndex);
            console.log("✅ Berhasil menginjeksi eslintConfig di akhir array export default di eslint.config.mjs!");
          } else {
            console.log("\n⚠️ Pola export default array tidak lengkap (tidak ditemukan '];').");
          }
        } else {
          console.log("\n⚠️ Pola export default tidak dikenali.");
          console.log("Silakan tambahkan secara manual di eslint.config.mjs:");
          console.log("  ...eslintConfig,");
        }

        fs.writeFileSync(eslintConfigPath, content, "utf8");
      } else {
        console.log("ℹ️ eslintConfig sudah terdaftar di eslint.config.mjs.");
      }
    } else {
      console.log("\n⚠️ File eslint.config.mjs tidak ditemukan di proyek target.");
      console.log("Silakan buat file eslint.config.mjs dan tambahkan:");
      console.log("   import { eslintConfig } from 'ernest-config';");
      console.log("   export default tseslint.config(");
      console.log("     ...eslintConfig,");
      console.log("     // config lainnya...");
      console.log("   );");
    }
  } catch (err) {
    console.error("❌ Gagal menginjeksi eslint.config.mjs otomatis:", err.message);
  }

  // 5. Tambahkan/Perbarui script "format" di package.json target
  try {
    const targetPkgJsonPath = path.join(targetDir, "package.json");
    if (fs.existsSync(targetPkgJsonPath)) {
      const targetPkgJson = JSON.parse(fs.readFileSync(targetPkgJsonPath, "utf8"));
      if (!targetPkgJson.scripts) {
        targetPkgJson.scripts = {};
      }
      targetPkgJson.scripts.format = 'prettier --write "src/**/*.ts" "test/**/*.ts" "*.{js,mjs,json}"';
      fs.writeFileSync(targetPkgJsonPath, JSON.stringify(targetPkgJson, null, 2), "utf8");
      console.log("✅ Script 'format' berhasil ditambahkan/diperbarui di package.json!");
    }
  } catch (err) {
    console.error("❌ Gagal menambahkan script format ke package.json:", err.message);
  }

  // 6. Jalankan format otomatis pertama kali setelah instalasi selesai
  try {
    console.log("🧹 Menjalankan pemformatan kode perdana (npm run format)...");
    execSync("npm run format", {
      cwd: targetDir,
      stdio: "inherit",
    });
    console.log("✅ Berkas kode berhasil dirapikan otomatis!");
  } catch (err) {
    console.warn("⚠️ Gagal menjalankan pemformatan otomatis secara langsung:", err.message);
  }

  // 7. Jalankan linter otomatis pertama kali setelah format selesai
  try {
    console.log("🔍 Menjalankan linter perdana (npm run lint) untuk memperbaiki tipe impor...");
    execSync("npm run lint", {
      cwd: targetDir,
      stdio: "inherit",
    });
    console.log("✅ Berkas kode berhasil di-lint secara otomatis!");
    console.log("\n💡 TIP: Jika editor VS Code Anda masih menampilkan garis merah/error palsu:");
    console.log("   Buka Command Palette (Cmd+Shift+P) -> jalankan 'Developer: Restart Window' agar ekstensi memuat konfigurasi baru.\n");
  } catch (err) {
    console.warn("⚠️ Gagal menjalankan linter otomatis secara langsung:", err.message);
  }
}

setupProject();
