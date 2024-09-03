import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    languageOptions: {
      globals: {
        ...globals.mocha, // Add Mocha globals like `describe`, `it`, etc.
        ...globals.browser, // Browser globals like `window`, `document`, etc.
        ...globals.node,    // Node.js globals like `process`, `__dirname`, etc.
      },
    },
  },
  pluginJs.configs.recommended,
];
