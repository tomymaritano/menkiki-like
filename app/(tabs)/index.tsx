import { useRef, useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Camera } from "lucide-react-native";
import { COLORS, SPACING, RADIUS, SHADOWS, TYPOGRAPHY, CAMERA_HUD, TAB_BAR } from "../../src/constants";
import { GlassCard, GlassButton, Logo } from "../../src/components";
import { useHaptics } from "../../src/hooks";

export default function CameraScreen() {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const insets = useSafeAreaInsets();
  const haptics = useHaptics();
  const buttonScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    haptics.medium();
    Animated.spring(buttonScale, {
      toValue: 0.92,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handleCapture = async () => {
    if (!cameraRef.current || isCapturing) return;

    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      if (photo?.uri) {
        router.push({
          pathname: "/detection",
          params: { photoUri: photo.uri },
        });
      }
    } catch (error) {
      console.error("Failed to capture photo:", error);
    } finally {
      setIsCapturing(false);
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Getting your camera ready...</Text>
        </View>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <GlassCard style={styles.permissionCard}>
            <View style={styles.iconContainer}>
              <Camera size={64} color={COLORS.accent} strokeWidth={1.5} />
            </View>
            <Text style={styles.title}>Ready to scan?</Text>
            <Text style={styles.message}>
              Let us see what you're craving and we'll find the perfect spot nearby
            </Text>
            <GlassButton
              title="Enable Camera"
              onPress={requestPermission}
              variant="primary"
              size="lg"
              fullWidth
            />
          </GlassCard>
        </View>
      </View>
    );
  }

  // Calculate dynamic spacing
  const controlsHeight = 140 + TAB_BAR.height + TAB_BAR.marginBottom + insets.bottom;

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back">
        {/* Top gradient for header readability */}
        <LinearGradient
          colors={["rgba(0,0,0,0.6)", "transparent"]}
          style={[styles.topGradient, { paddingTop: insets.top }]}
        >
          <View style={styles.header}>
            <Logo size="md" showIcon={false} color={CAMERA_HUD.textPrimary} withShadow />
          </View>
        </LinearGradient>

        {/* Center content - minimal focus frame */}
        <View style={styles.centerContent}>
          <View style={styles.focusFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        </View>

        {/* Bottom gradient for controls */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)", COLORS.background]}
          locations={[0, 0.5, 1]}
          style={[styles.bottomGradient, { height: controlsHeight }]}
        />
      </CameraView>

      {/* Controls area */}
      <View style={[styles.controls, { paddingBottom: TAB_BAR.height + TAB_BAR.marginBottom + insets.bottom + 16 }]}>
        <TouchableOpacity
          onPress={handleCapture}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={isCapturing}
          activeOpacity={1}
        >
          <Animated.View
            style={[
              styles.captureButton,
              isCapturing && styles.captureButtonDisabled,
              { transform: [{ scale: buttonScale }] }
            ]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  camera: {
    flex: 1,
  },
  // Top gradient overlay for header
  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING[5],
    paddingBottom: SPACING[8],
    zIndex: 10,
  },
  header: {
    alignItems: "center",
    paddingTop: SPACING[4],
  },
  // Center content area
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  focusFrame: {
    width: 240,
    height: 240,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 32,
    height: 32,
    borderColor: "rgba(255, 255, 255, 0.6)",
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopLeftRadius: RADIUS.lg,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderTopRightRadius: RADIUS.lg,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderBottomLeftRadius: RADIUS.lg,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomRightRadius: RADIUS.lg,
  },
  // Bottom gradient
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 5,
  },
  // Controls area
  controls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 20,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primary,
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  // Loading state
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: COLORS.secondary,
    fontSize: TYPOGRAPHY.size.md,
  },
  // Permission state
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING[5],
  },
  permissionCard: {
    width: "100%",
    alignItems: "center",
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.accentMuted,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING[5],
  },
  title: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.size["2xl"],
    fontWeight: TYPOGRAPHY.weight.bold,
    marginBottom: SPACING[3],
  },
  message: {
    color: COLORS.secondary,
    fontSize: TYPOGRAPHY.size.md,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: SPACING[6],
  },
});
