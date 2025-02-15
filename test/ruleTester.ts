/* global describe */

import { RuleTester } from "eslint";
import { RuleTester as RuleTester_v6 } from "eslint-v6";
import { RuleTester as RuleTester_v7 } from "eslint-v7";

// The default parser
const jsxTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
});

// TypeScript's ESLint parser
const tsTester = new RuleTester({
  parser: require.resolve("@typescript-eslint/parser"),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
});
// Babel's ESLint parser
const babelTester = new RuleTester({
  parser: require.resolve("@babel/eslint-parser"),
  parserOptions: {
    sourceType: "module",
    requireConfigFile: false,
    babelOptions: {
      parserOpts: {
        plugins: ["jsx", "typescript"], //
      },
    },
  },
});

const v7Tester = new RuleTester_v7({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
});

const v6Tester = new RuleTester_v6({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
});

export const run: typeof RuleTester.prototype.run = (name, rule, tests) => {
  switch (process.env.PARSER) {
    case "ts":
      describe("@typescript-eslint/parser", () => tsTester.run(name, rule, tests));
      break;
    case "babel":
      describe("@babel/eslint-parser", () => babelTester.run(name, rule, tests));
      break;
    case "v7":
      describe("eslint v7", () => v7Tester.run(name, rule, tests));
      break;
    case "v6":
      describe("eslint v6", () => v6Tester.run(name, rule, tests));
      break;
    case "all":
      describe("esprima", () => jsxTester.run(name, rule, tests));
      describe("@typescript-eslint/parser", () => tsTester.run(name, rule, tests));
      describe("@babel/eslint-parser", () => babelTester.run(name, rule, tests));
      describe("eslint v7", () => v7Tester.run(name, rule, tests));
      describe("eslint v6", () => v6Tester.run(name, rule, tests));
      break;
    case "none":
      break;
    default:
      describe("esprima", () => jsxTester.run(name, rule, tests));
      break;
  }
};

export type Cases = Parameters<typeof RuleTester.prototype.run>[2];
