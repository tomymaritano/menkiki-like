import { View, StyleSheet, ViewStyle, StyleProp } from "react-native";
import { BlurView } from "expo-blur";
import { COLORS, RADIUS, SHADOWS } from "../constants";

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: "light" | "medium" | "heavy";
  noBorder?: boolean;
  noShadow?: boolean;
  padding?: number;
}

const intensityMap = {
  light: 20,
  medium: 40,
  heavy: 60,
};

export function GlassCard({
  children,
  style,
  intensity = "medium",
  noBorder = false,
  noShadow = false,
  padding = 16,
}: GlassCardProps) {
  return (
    <View style={[styles.container, !noShadow && SHADOWS.lg, style]}>
      <BlurView
        intensity={intensityMap[intensity]}
        tint="dark"
        style={StyleSheet.absoluteFill}
      />
      <View
        style={[
          styles.content,
          !noBorder && styles.border,
          { padding },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: RADIUS.xl,
    overflow: "hidden",
    backgroundColor: COLORS.glass.background,
  },
  content: {
    flex: 1,
  },
  border: {
    borderWidth: 1,
    borderColor: COLORS.glass.border,
    borderRadius: RADIUS.xl,
  },
});
