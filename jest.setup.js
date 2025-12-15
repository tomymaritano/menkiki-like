// Jest setup file

// Mock expo modules
jest.mock("expo-file-system", () => ({
  readAsStringAsync: jest.fn(),
  EncodingType: {
    Base64: "base64",
  },
}));

jest.mock("@tensorflow/tfjs", () => ({
  ready: jest.fn().mockResolvedValue(undefined),
  util: {
    encodeString: jest.fn().mockReturnValue({ buffer: new ArrayBuffer(0) }),
  },
}));

jest.mock("@tensorflow/tfjs-react-native", () => ({
  decodeJpeg: jest.fn(),
}));

jest.mock("@tensorflow-models/mobilenet", () => ({
  load: jest.fn(),
}));

// Mock expo constants
jest.mock("expo-constants", () => ({
  default: {
    expoConfig: {
      extra: {},
    },
  },
}));

// Silence console errors in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Warning:")
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
