// ============================================
// DESIGN TOKENS - Glassmorphism Dark Theme
// ============================================

// Color Palette
export const COLORS = {
  // Base colors
  background: "#000000",
  backgroundElevated: "#0a0a0a",
  surface: "#1a1a1a",
  surfaceElevated: "#252525",

  // Text colors
  primary: "#ffffff",
  secondary: "#888888",
  tertiary: "#666666",
  muted: "#444444",

  // Orange/Amber accent (primary brand color)
  accent: "#f97316",
  accentLight: "#fb923c",
  accentDark: "#ea580c",
  accentMuted: "rgba(249, 115, 22, 0.15)",
  accentGlow: "rgba(249, 115, 22, 0.3)",

  // Semantic colors
  success: "#22c55e",
  successMuted: "rgba(34, 197, 94, 0.15)",
  warning: "#f59e0b",
  warningMuted: "rgba(245, 158, 11, 0.15)",
  error: "#ef4444",
  errorMuted: "rgba(239, 68, 68, 0.15)",
  info: "#3b82f6",
  infoMuted: "rgba(59, 130, 246, 0.15)",

  // Glass effect colors
  glass: {
    background: "rgba(26, 26, 26, 0.7)",
    backgroundLight: "rgba(40, 40, 40, 0.6)",
    border: "rgba(255, 255, 255, 0.08)",
    borderLight: "rgba(255, 255, 255, 0.12)",
    highlight: "rgba(255, 255, 255, 0.05)",
  },

  // Overlay colors
  overlay: {
    light: "rgba(0, 0, 0, 0.3)",
    medium: "rgba(0, 0, 0, 0.5)",
    dark: "rgba(0, 0, 0, 0.7)",
    heavy: "rgba(0, 0, 0, 0.85)",
  },
} as const;

// Typography Scale
export const TYPOGRAPHY = {
  size: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 28,
    "4xl": 34,
    "5xl": 48,
  },

  weight: {
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },

  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
} as const;

// Spacing Scale (4px base unit)
export const SPACING = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

// Border Radius Scale
export const RADIUS = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  "2xl": 20,
  "3xl": 24,
  full: 9999,
} as const;

// Shadow/Elevation (for glassmorphism)
export const SHADOWS = {
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
  },
  glow: {
    shadowColor: "#f97316",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
} as const;

// Blur intensities for glassmorphism
export const BLUR = {
  none: 0,
  sm: 10,
  md: 20,
  lg: 40,
  xl: 60,
} as const;

// Animation durations
export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

// Tab Bar specific constants
export const TAB_BAR = {
  height: 70,
  marginHorizontal: 20,
  marginBottom: 24,
  borderRadius: 24,
  iconSize: 24,
} as const;

// Icon sizes
export const ICON_SIZE = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 32,
  "2xl": 40,
  "3xl": 48,
} as const;

// Default location: Escobar, Buenos Aires, Argentina
export const DEFAULT_LOCATION = {
  latitude: -34.348,
  longitude: -58.7653,
  name: "Escobar",
  region: "Buenos Aires",
  country: "Argentina",
} as const;

// Camera HUD specific tokens
export const CAMERA_HUD = {
  // Text shadows for legibility over camera
  textShadow: {
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  // Strong shadow for titles
  textShadowStrong: {
    textShadowColor: "rgba(0, 0, 0, 0.9)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  // Text colors
  textPrimary: "#ffffff",
  textSecondary: "rgba(255, 255, 255, 0.9)",
  textHint: "rgba(255, 255, 255, 0.7)",
  // Pill backgrounds for icons
  pillBackground: "rgba(0, 0, 0, 0.4)",
  pillBackgroundStrong: "rgba(0, 0, 0, 0.6)",
} as const;

// Touch targets (accessibility)
export const TOUCH_TARGET = {
  minimum: 44,
  iconButton: 48,
  shutter: 76,
  tabIcon: 44,
} as const;
