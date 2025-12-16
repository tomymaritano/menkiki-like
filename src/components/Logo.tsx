import { View, Text, StyleSheet, TextStyle } from "react-native";
import { Soup } from "lucide-react-native";
import { COLORS, TYPOGRAPHY, CAMERA_HUD } from "../constants";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  color?: string;
  withShadow?: boolean;
}

const SIZES = {
  sm: { icon: 20, text: 18, gap: 6 },
  md: { icon: 28, text: 24, gap: 8 },
  lg: { icon: 40, text: 36, gap: 12 },
};

export function Logo({ size = "md", showIcon = true, color = COLORS.primary, withShadow = false }: LogoProps) {
  const dimensions = SIZES[size];
  const shadowStyle: TextStyle = withShadow ? CAMERA_HUD.textShadowStrong : {};

  return (
    <View style={styles.container}>
      {showIcon && (
        <View style={[styles.iconWrapper, { marginRight: dimensions.gap }]}>
          <Soup size={dimensions.icon} color={COLORS.accent} strokeWidth={2} />
        </View>
      )}
      <Text style={[styles.text, { fontSize: dimensions.text, color }, shadowStyle]}>
        Menkiki
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontWeight: TYPOGRAPHY.weight.bold,
    letterSpacing: -0.5,
  },
});
