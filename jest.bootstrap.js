// Bootstrap file that runs BEFORE jest loads any modules
// This is needed to bypass Expo SDK 54's winter runtime

// Force web runtime which doesn't have the import.meta issues
process.env.EXPO_OS = "web";

// Override the global import.meta resolution that expo uses
global.__ExpoImportMetaRegistry = undefined;
