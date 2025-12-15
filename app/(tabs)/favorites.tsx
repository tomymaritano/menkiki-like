import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Linking,
  Modal,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFavorites } from "../../src/hooks/useFavorites";
import { COLORS } from "../../src/constants";
import { FadeIn } from "../../src/components";
import type { Restaurant } from "../../src/types";

interface ActionSheetProps {
  visible: boolean;
  restaurant: Restaurant | null;
  onClose: () => void;
  onRemove: () => void;
}

function ActionSheet({ visible, restaurant, onClose, onRemove }: ActionSheetProps) {
  if (!restaurant) return null;

  const handleOpenMaps = () => {
    const query = encodeURIComponent(`${restaurant.name} ${restaurant.address}`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
    onClose();
  };

  const handleCall = () => {
    if (restaurant.phone) {
      Linking.openURL(`tel:${restaurant.phone}`);
    }
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.actionSheet}>
          <View style={styles.actionSheetHandle} />
          <Text style={styles.actionSheetTitle}>{restaurant.name}</Text>
          <Text style={styles.actionSheetSubtitle}>{restaurant.address}</Text>

          <TouchableOpacity style={styles.actionButton} onPress={handleOpenMaps}>
            <View style={styles.actionIconContainer}>
              <Text style={styles.actionButtonIcon}>📍</Text>
            </View>
            <Text style={styles.actionButtonText}>Open in Maps</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
            <View style={styles.actionIconContainer}>
              <Text style={styles.actionButtonIcon}>📞</Text>
            </View>
            <Text style={styles.actionButtonText}>Call Restaurant</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.removeButton]} onPress={onRemove}>
            <View style={[styles.actionIconContainer, styles.removeIconContainer]}>
              <Text style={styles.actionButtonIcon}>💔</Text>
            </View>
            <Text style={[styles.actionButtonText, styles.removeButtonText]}>
              Remove from Favorites
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
}

function RestaurantCard({
  restaurant,
  onPress,
  index,
}: {
  restaurant: Restaurant;
  onPress: () => void;
  index: number;
}) {
  return (
    <FadeIn delay={index * 50}>
      <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.cardIcon}>
          <Text style={styles.cardEmoji}>🍽️</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.name} numberOfLines={1}>
            {restaurant.name}
          </Text>
          <View style={styles.meta}>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingStar}>★</Text>
              <Text style={styles.ratingText}>{restaurant.rating.toFixed(1)}</Text>
            </View>
            <Text style={styles.price}>{restaurant.priceLevel}</Text>
            <Text style={styles.distance}>{restaurant.distance}</Text>
          </View>
          <Text style={styles.address} numberOfLines={1}>
            {restaurant.address}
          </Text>
        </View>
        <View style={styles.heartContainer}>
          <Text style={styles.heart}>❤️</Text>
        </View>
      </TouchableOpacity>
    </FadeIn>
  );
}

function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Text style={styles.emptyEmoji}>❤️</Text>
      </View>
      <Text style={styles.emptyTitle}>No favorites yet</Text>
      <Text style={styles.emptyText}>
        Save restaurants you love for quick access. Tap the heart on any restaurant to add it here.
      </Text>
    </View>
  );
}

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const { favorites, removeFavorite, isLoading } = useFavorites();
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  const handleRemove = async () => {
    if (selectedRestaurant) {
      await removeFavorite(selectedRestaurant.id);
      setSelectedRestaurant(null);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorites</Text>
        {favorites.length > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{favorites.length}</Text>
          </View>
        )}
      </View>

      {!isLoading && favorites.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <RestaurantCard
              restaurant={item}
              onPress={() => setSelectedRestaurant(item)}
              index={index}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      <ActionSheet
        visible={!!selectedRestaurant}
        restaurant={selectedRestaurant}
        onClose={() => setSelectedRestaurant(null)}
        onRemove={handleRemove}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    color: COLORS.primary,
    fontSize: 34,
    fontWeight: "700",
  },
  countBadge: {
    backgroundColor: COLORS.error,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 12,
  },
  countText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 12,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  cardIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  cardEmoji: {
    fontSize: 24,
  },
  cardContent: {
    flex: 1,
  },
  name: {
    color: COLORS.primary,
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 6,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 4,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(251, 191, 36, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ratingStar: {
    color: COLORS.warning,
    fontSize: 12,
    marginRight: 3,
  },
  ratingText: {
    color: COLORS.warning,
    fontSize: 13,
    fontWeight: "600",
  },
  price: {
    color: COLORS.secondary,
    fontSize: 13,
  },
  distance: {
    color: COLORS.secondary,
    fontSize: 13,
  },
  address: {
    color: "#666",
    fontSize: 13,
  },
  heartContainer: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  heart: {
    fontSize: 18,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyEmoji: {
    fontSize: 48,
  },
  emptyTitle: {
    color: COLORS.primary,
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 12,
  },
  emptyText: {
    color: COLORS.secondary,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  // Action Sheet
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  actionSheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
  },
  actionSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.secondary,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
    opacity: 0.5,
  },
  actionSheetTitle: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  actionSheetSubtitle: {
    color: COLORS.secondary,
    fontSize: 14,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  actionButtonIcon: {
    fontSize: 20,
  },
  actionButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "500",
  },
  removeButton: {
    marginTop: 10,
  },
  removeIconContainer: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
  removeButtonText: {
    color: COLORS.error,
  },
  cancelButton: {
    padding: 16,
    marginTop: 10,
  },
  cancelButtonText: {
    color: COLORS.secondary,
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
  },
});
