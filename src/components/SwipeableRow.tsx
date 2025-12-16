import { useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Trash2 } from "lucide-react-native";
import { COLORS, SPACING, RADIUS } from "../constants";
import { useHaptics } from "../hooks";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = -80;
const DELETE_THRESHOLD = -SCREEN_WIDTH * 0.4;

interface SwipeableRowProps {
  children: React.ReactNode;
  onDelete: () => void;
}

export function SwipeableRow({ children, onDelete }: SwipeableRowProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const haptics = useHaptics();
  const hasTriggeredHaptic = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to horizontal gestures
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && gestureState.dx < -10;
      },
      onPanResponderGrant: () => {
        hasTriggeredHaptic.current = false;
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow left swipe (negative dx)
        if (gestureState.dx < 0) {
          translateX.setValue(gestureState.dx);

          // Haptic feedback when crossing threshold
          if (gestureState.dx < DELETE_THRESHOLD && !hasTriggeredHaptic.current) {
            haptics.warning();
            hasTriggeredHaptic.current = true;
          } else if (gestureState.dx > DELETE_THRESHOLD && hasTriggeredHaptic.current) {
            hasTriggeredHaptic.current = false;
          }
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < DELETE_THRESHOLD) {
          // Delete - animate off screen
          Animated.timing(translateX, {
            toValue: -SCREEN_WIDTH,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            haptics.error();
            onDelete();
          });
        } else if (gestureState.dx < SWIPE_THRESHOLD) {
          // Show delete button
          Animated.spring(translateX, {
            toValue: SWIPE_THRESHOLD,
            friction: 8,
            useNativeDriver: true,
          }).start();
        } else {
          // Reset
          Animated.spring(translateX, {
            toValue: 0,
            friction: 8,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const handleDeletePress = () => {
    Animated.timing(translateX, {
      toValue: -SCREEN_WIDTH,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      haptics.error();
      onDelete();
    });
  };

  const resetPosition = () => {
    Animated.spring(translateX, {
      toValue: 0,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  // Interpolate background color based on swipe distance
  const deleteButtonOpacity = translateX.interpolate({
    inputRange: [-100, -50, 0],
    outputRange: [1, 0.5, 0],
    extrapolate: "clamp",
  });

  const deleteButtonScale = translateX.interpolate({
    inputRange: [DELETE_THRESHOLD, SWIPE_THRESHOLD, 0],
    outputRange: [1.1, 1, 0.8],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      {/* Delete button background */}
      <Animated.View
        style={[
          styles.deleteContainer,
          {
            opacity: deleteButtonOpacity,
          },
        ]}
      >
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeletePress}>
          <Animated.View style={{ transform: [{ scale: deleteButtonScale }] }}>
            <Trash2 size={20} color={COLORS.primary} />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>

      {/* Main content */}
      <Animated.View
        style={[
          styles.content,
          {
            transform: [{ translateX }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity activeOpacity={1} onPress={resetPosition}>
          {children}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
    borderRadius: RADIUS.xl,
  },
  deleteContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 100,
    backgroundColor: COLORS.error,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RADIUS.xl,
  },
  deleteButton: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: COLORS.background,
  },
});
