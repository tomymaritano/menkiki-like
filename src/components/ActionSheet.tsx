import { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Linking,
  Animated,
  Dimensions,
} from "react-native";
import { BlurView } from "expo-blur";
import { MapPin, Phone, HeartOff } from "lucide-react-native";
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from "../constants";
import { useHaptics } from "../hooks";
import type { Restaurant } from "../types";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface ActionSheetProps {
  visible: boolean;
  restaurant: Restaurant | null;
  onClose: () => void;
  onRemove?: () => void;
  bottomInset: number;
  showRemove?: boolean;
}

export function ActionSheet({
  visible,
  restaurant,
  onClose,
  onRemove,
  bottomInset,
  showRemove = false,
}: ActionSheetProps) {
  const haptics = useHaptics();
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 65,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, backdropAnim]);

  if (!restaurant) return null;

  const handleOpenMaps = () => {
    haptics.selection();
    const query = encodeURIComponent(`${restaurant.name} ${restaurant.address}`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
    onClose();
  };

  const handleCall = () => {
    haptics.selection();
    // Mock phone numbers for demo
    const mockPhones: Record<string, string> = {
      "Pizzeria Güerrin": "+54 11 4371-8141",
      "El Cuartito": "+54 11 4816-1758",
      "Osaka": "+54 11 4775-6964",
      "Burger Joint": "+54 11 4833-5151",
    };
    const phone = restaurant.phone || mockPhones[restaurant.name] || null;

    if (phone) {
      Linking.openURL(`tel:${phone.replace(/\s/g, "")}`);
    }
    onClose();
  };

  const handleRemove = () => {
    haptics.warning();
    onRemove?.();
  };

  const hasPhone =
    restaurant.phone ||
    ["Pizzeria Güerrin", "El Cuartito", "Osaka", "Burger Joint"].includes(restaurant.name);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        {/* Blur backdrop */}
        <Animated.View style={[styles.blurContainer, { opacity: backdropAnim }]}>
          <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill} />
        </Animated.View>

        {/* Tap to dismiss */}
        <Pressable style={styles.backdrop} onPress={onClose} />

        {/* Action sheet */}
        <Animated.View
          style={[
            styles.actionSheet,
            {
              paddingBottom: SPACING[5] + bottomInset,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.handle} />
          <Text style={styles.title}>{restaurant.name}</Text>
          <Text style={styles.subtitle}>{restaurant.address}</Text>

          <TouchableOpacity style={styles.actionButton} onPress={handleOpenMaps} activeOpacity={0.7}>
            <View style={styles.actionIconContainer}>
              <MapPin size={20} color={COLORS.accent} />
            </View>
            <Text style={styles.actionButtonText}>Open in Maps</Text>
          </TouchableOpacity>

          {hasPhone && (
            <TouchableOpacity style={styles.actionButton} onPress={handleCall} activeOpacity={0.7}>
              <View style={styles.actionIconContainer}>
                <Phone size={20} color={COLORS.accent} />
              </View>
              <Text style={styles.actionButtonText}>Call Restaurant</Text>
            </TouchableOpacity>
          )}

          {showRemove && onRemove && (
            <TouchableOpacity
              style={[styles.actionButton, styles.removeButton]}
              onPress={handleRemove}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIconContainer, styles.removeIconContainer]}>
                <HeartOff size={20} color={COLORS.error} />
              </View>
              <Text style={[styles.actionButtonText, styles.removeButtonText]}>
                Remove from Favorites
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.cancelButton} onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  blurContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  actionSheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS["3xl"],
    borderTopRightRadius: RADIUS["3xl"],
    padding: SPACING[5],
    // Shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.secondary,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: SPACING[5],
    opacity: 0.5,
  },
  title: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.size.xl,
    fontWeight: TYPOGRAPHY.weight.semibold,
    textAlign: "center",
  },
  subtitle: {
    color: COLORS.secondary,
    fontSize: TYPOGRAPHY.size.sm,
    textAlign: "center",
    marginTop: SPACING[1],
    marginBottom: SPACING[6],
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    padding: SPACING[4],
    borderRadius: RADIUS.lg,
    marginBottom: SPACING[2],
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.accentMuted,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING[3],
  },
  actionButtonText: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.medium,
  },
  removeButton: {
    marginTop: SPACING[2],
  },
  removeIconContainer: {
    backgroundColor: COLORS.errorMuted,
  },
  removeButtonText: {
    color: COLORS.error,
  },
  cancelButton: {
    padding: SPACING[4],
    marginTop: SPACING[2],
  },
  cancelButtonText: {
    color: COLORS.secondary,
    fontSize: TYPOGRAPHY.size.md,
    textAlign: "center",
    fontWeight: TYPOGRAPHY.weight.medium,
  },
});
