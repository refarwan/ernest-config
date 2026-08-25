const checkFile = require("eslint-plugin-check-file");

const eslintConfig = [
  {
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" },
      ],
    },
  },
  {
    files: ["src/**/*.ts"],
    plugins: {
      "check-file": checkFile,
    },
    rules: {
      "check-file/filename-naming-convention": [
        "error",
        {
          "**/*.ts": "KEBAB_CASE",
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
      "check-file/folder-naming-convention": [
        "error",
        {
          "src/**/": "KEBAB_CASE",
        },
      ],
      "check-file/folder-match-with-fex": [
        "error",
        {
          "*.dto.ts": "**/dtos/",
          "*.{interface,type}.ts": "**/interfaces/",
          "*.{function,util}.ts": "**/utils/",
          "*.{constant,enum}.ts": "**/constants/",
        },
      ],
    },
  },
  {
    files: [
      "src/**/interfaces/index.ts",
      "src/**/utils/index.ts",
      "src/**/constants/index.ts",
    ],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "ExportAllDeclaration",
          message:
            "Wildcard exports (export * from '...') are not allowed in interfaces/utils/constants index.ts files. Please use named exports instead: export { Name } from './file';",
        },
      ],
    },
  },
];

module.exports = { eslintConfig };
