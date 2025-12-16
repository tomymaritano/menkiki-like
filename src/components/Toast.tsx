import { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import { Check, X, Info, AlertTriangle } from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from "../constants";

const { width } = Dimensions.get("window");

type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onHide: () => void;
}

const toastConfig: Record<ToastType, { icon: LucideIcon; color: string; bgColor: string }> = {
  success: {
    icon: Check,
    color: COLORS.success,
    bgColor: COLORS.successMuted,
  },
  error: {
    icon: X,
    color: COLORS.error,
    bgColor: COLORS.errorMuted,
  },
  info: {
    icon: Info,
    color: COLORS.info,
    bgColor: COLORS.infoMuted,
  },
  warning: {
    icon: AlertTriangle,
    color: COLORS.warning,
    bgColor: COLORS.warningMuted,
  },
};

export function Toast({
  visible,
  message,
  type = "success",
  duration = 2000,
  onHide,
}: ToastProps) {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Slide in
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          friction: 8,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  if (!visible) return null;

  const config = toastConfig[type];
  const Icon = config.icon;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <View style={[styles.toast, { borderLeftColor: config.color }]}>
        <View style={[styles.iconContainer, { backgroundColor: config.bgColor }]}>
          <Icon size={16} color={config.color} />
        </View>
        <Text style={styles.message} numberOfLines={2}>
          {message}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60,
    left: SPACING[5],
    right: SPACING[5],
    zIndex: 9999,
    alignItems: "center",
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderLeftWidth: 3,
    paddingVertical: SPACING[3],
    paddingHorizontal: SPACING[4],
    maxWidth: width - SPACING[10],
    ...SHADOWS.lg,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING[3],
  },
  message: {
    flex: 1,
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.medium,
  },
});
