import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react-jsx",
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          target: "ES2022",
          lib: ["DOM", "DOM.Iterable", "ES2022"],
          types: ["node", "jest", "@testing-library/jest-dom"],
        },
      },
    ],
  },
  coverageThreshold: {
    "./src/features/": {
      statements: 70,
      branches: 60,
      functions: 70,
      lines: 70,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any,
};

export default config;
