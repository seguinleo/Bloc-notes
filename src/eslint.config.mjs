import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  {
    ignores: ["**/*.min.js", "**/*.mjs"],
  },
  {
    rules: {
      "import/extensions": "off",
      "no-alert": "off",
      "no-use-before-define": "off",
    },
  },
];
