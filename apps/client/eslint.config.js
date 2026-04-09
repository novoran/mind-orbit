import mindorbitConfig from "@mindorbit/eslint-config"

export default [
  {
    ignores: ["src/routeTree.gen.ts"],
  },
  ...mindorbitConfig,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: null,
      },
    },
  },
]
