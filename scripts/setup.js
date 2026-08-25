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

  // 2. Copy / Merge .vscode/settings.json
  try {
    const vscodeTemplatePath = path.join(__dirname, "../templates/.vscode/settings.json");
    const vscodeTargetDir = path.join(targetDir, ".vscode");
    const vscodeTargetPath = path.join(vscodeTargetDir, "settings.json");

    if (fs.existsSync(vscodeTemplatePath)) {
      if (!fs.existsSync(vscodeTargetDir)) {
        fs.mkdirSync(vscodeTargetDir, { recursive: true });
      }

      let mergedSettings = {};
      if (fs.existsSync(vscodeTargetPath)) {
        try {
          const existingContent = fs.readFileSync(vscodeTargetPath, "utf8");
          mergedSettings = JSON.parse(existingContent);
        } catch (e) {
          console.warn("⚠️ Gagal membaca settings.json yang sudah ada, akan ditimpa.");
        }
      }

      const templateSettings = JSON.parse(fs.readFileSync(vscodeTemplatePath, "utf8"));
      mergedSettings = { ...mergedSettings, ...templateSettings };

      fs.writeFileSync(vscodeTargetPath, JSON.stringify(mergedSettings, null, 2), "utf8");
      console.log("✅ File .vscode/settings.json berhasil dikonfigurasi!");
    }
  } catch (err) {
    console.error("❌ Gagal mengatur .vscode/settings.json:", err.message);
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

        // Injeksi ...eslintConfig ke dalam pemanggilan tseslint.config atau array export
        if (content.includes("export default tseslint.config(")) {
          content = content.replace(
            "export default tseslint.config(",
            "export default tseslint.config(\n  ...eslintConfig,"
          );
          console.log("✅ Berhasil menginjeksi eslintConfig ke dalam tseslint.config di eslint.config.mjs!");
        } else if (content.includes("export default [")) {
          content = content.replace(
            "export default [",
            "export default [\n  ...eslintConfig,"
          );
          console.log("✅ Berhasil menginjeksi eslintConfig ke dalam array export default di eslint.config.mjs!");
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
}

setupProject();
