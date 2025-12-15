module.exports = {
  preset: "jest-expo",
  setupFiles: ["<rootDir>/jest.bootstrap.js"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|@tensorflow/.*|@tensorflow-models/.*)",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/index.ts",
  ],
  coverageReporters: ["text", "text-summary", "lcov", "html"],
  coverageDirectory: "coverage",
  testEnvironment: "node",
  moduleNameMapper: {
    "^expo$": "<rootDir>/__mocks__/expo.js",
    "^expo/src/winter$": "<rootDir>/__mocks__/expo/src/winter/index.js",
    "^expo/src/winter/runtime$": "<rootDir>/__mocks__/expo/src/winter/index.js",
    "^expo/src/winter/runtime.native$": "<rootDir>/__mocks__/expo/src/winter/runtime.native.js",
  },
  testPathIgnorePatterns: ["/node_modules/", "/android/", "/ios/"],
};
