const checkFile = require("eslint-plugin-check-file");

const eslintConfig = [
  {
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" },
      ],
      "@typescript-eslint/no-explicit-any": "error",
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
  {
    files: ["**/*.spec.ts", "**/*.e2e-spec.ts", "test/**/*.ts"],
    rules: {
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-floating-promises": "off",
    },
  },
];

module.exports = { eslintConfig };
