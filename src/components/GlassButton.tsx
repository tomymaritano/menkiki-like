import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from "react-native";
import { COLORS, TYPOGRAPHY, RADIUS, SHADOWS, SPACING } from "../constants";
import { useHaptics } from "../hooks";
import type { LucideIcon } from "lucide-react-native";

type ButtonVariant = "primary" | "secondary" | "ghost" | "glass" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface GlassButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  fullWidth?: boolean;
  haptic?: "light" | "medium" | "selection" | "success" | "none";
}

const sizeStyles = {
  sm: {
    paddingVertical: SPACING[2],
    paddingHorizontal: SPACING[4],
    fontSize: TYPOGRAPHY.size.sm,
    iconSize: 16,
  },
  md: {
    paddingVertical: SPACING[3],
    paddingHorizontal: SPACING[5],
    fontSize: TYPOGRAPHY.size.md,
    iconSize: 20,
  },
  lg: {
    paddingVertical: SPACING[4],
    paddingHorizontal: SPACING[6],
    fontSize: TYPOGRAPHY.size.lg,
    iconSize: 24,
  },
};

export function GlassButton({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  icon: Icon,
  iconPosition = "left",
  style,
  textStyle,
  fullWidth = false,
  haptic = "selection",
}: GlassButtonProps) {
  const sizeConfig = sizeStyles[size];
  const haptics = useHaptics();

  const handlePress = () => {
    if (haptic !== "none") {
      switch (haptic) {
        case "light":
          haptics.light();
          break;
        case "medium":
          haptics.medium();
          break;
        case "success":
          haptics.success();
          break;
        case "selection":
        default:
          haptics.selection();
          break;
      }
    }
    onPress();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          container: {
            backgroundColor: COLORS.accent,
            ...SHADOWS.glow,
          } as ViewStyle,
          text: { color: COLORS.background },
          icon: COLORS.background,
        };
      case "secondary":
        return {
          container: {
            backgroundColor: COLORS.surface,
            borderWidth: 1,
            borderColor: COLORS.glass.border,
          } as ViewStyle,
          text: { color: COLORS.primary },
          icon: COLORS.primary,
        };
      case "ghost":
        return {
          container: { backgroundColor: "transparent" } as ViewStyle,
          text: { color: COLORS.secondary },
          icon: COLORS.secondary,
        };
      case "glass":
        return {
          container: {
            backgroundColor: COLORS.glass.background,
            borderWidth: 1,
            borderColor: COLORS.glass.border,
            ...SHADOWS.md,
          } as ViewStyle,
          text: { color: COLORS.primary },
          icon: COLORS.primary,
        };
      case "danger":
        return {
          container: {
            backgroundColor: COLORS.errorMuted,
            borderWidth: 1,
            borderColor: COLORS.error,
          } as ViewStyle,
          text: { color: COLORS.error },
          icon: COLORS.error,
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        styles.container,
        variantStyles.container,
        {
          paddingVertical: sizeConfig.paddingVertical,
          paddingHorizontal: sizeConfig.paddingHorizontal,
        },
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
    >
      {Icon && iconPosition === "left" && (
        <Icon
          size={sizeConfig.iconSize}
          color={variantStyles.icon}
          style={styles.iconLeft}
        />
      )}
      <Text
        style={[
          styles.text,
          variantStyles.text,
          { fontSize: sizeConfig.fontSize },
          textStyle,
        ]}
      >
        {title}
      </Text>
      {Icon && iconPosition === "right" && (
        <Icon
          size={sizeConfig.iconSize}
          color={variantStyles.icon}
          style={styles.iconRight}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.lg,
  },
  fullWidth: {
    width: "100%",
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: TYPOGRAPHY.weight.semibold,
  },
  iconLeft: {
    marginRight: SPACING[2],
  },
  iconRight: {
    marginLeft: SPACING[2],
  },
});
