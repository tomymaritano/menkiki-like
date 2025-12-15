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
import { router } from "expo-router";
import { useFavorites } from "../src/hooks/useFavorites";
import { COLORS } from "../src/constants";
import type { Restaurant } from "../src/types";

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

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.actionSheet}>
          <View style={styles.actionSheetHandle} />
          <Text style={styles.actionSheetTitle}>{restaurant.name}</Text>
          <Text style={styles.actionSheetSubtitle}>{restaurant.address}</Text>

          <TouchableOpacity style={styles.actionButton} onPress={handleOpenMaps}>
            <Text style={styles.actionButtonIcon}>📍</Text>
            <Text style={styles.actionButtonText}>Open in Maps</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={onRemove}>
            <Text style={styles.actionButtonIcon}>💔</Text>
            <Text style={styles.actionButtonText}>Remove from Favorites</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
}

function RestaurantCard({ restaurant, onPress }: { restaurant: Restaurant; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardContent}>
        <Text style={styles.name}>{restaurant.name}</Text>
        <View style={styles.meta}>
          <Text style={styles.rating}>★ {restaurant.rating.toFixed(1)}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.price}>{restaurant.priceLevel}</Text>
        </View>
        <Text style={styles.address}>{restaurant.address}</Text>
      </View>
      <Text style={styles.heart}>❤️</Text>
    </TouchableOpacity>
  );
}

function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>💔</Text>
      <Text style={styles.emptyTitle}>No favorites yet</Text>
      <Text style={styles.emptyText}>
        Start exploring and save your favorite restaurants for quick access.
      </Text>
      <TouchableOpacity style={styles.emptyButton} onPress={() => router.push("/")}>
        <Text style={styles.emptyButtonText}>Find Restaurants</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function FavoritesScreen() {
  const { favorites, removeFavorite } = useFavorites();
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  const handleRemove = async () => {
    if (selectedRestaurant) {
      await removeFavorite(selectedRestaurant.id);
      setSelectedRestaurant(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Favorites</Text>
        {favorites.length > 0 && <Text style={styles.subtitle}>{favorites.length} saved</Text>}
      </View>

      {favorites.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RestaurantCard restaurant={item} onPress={() => setSelectedRestaurant(item)} />
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    color: COLORS.secondary,
    fontSize: 16,
    marginBottom: 12,
  },
  title: {
    color: COLORS.primary,
    fontSize: 32,
    fontWeight: "700",
  },
  subtitle: {
    color: COLORS.secondary,
    fontSize: 14,
    marginTop: 4,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
  },
  name: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  rating: {
    color: COLORS.warning,
    fontSize: 14,
  },
  dot: {
    color: COLORS.secondary,
    marginHorizontal: 6,
  },
  price: {
    color: COLORS.secondary,
    fontSize: 14,
  },
  address: {
    color: "#666",
    fontSize: 13,
  },
  heart: {
    fontSize: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyTitle: {
    color: COLORS.primary,
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptyText: {
    color: COLORS.secondary,
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 10,
  },
  emptyButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "600",
  },
  // Action Sheet
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  actionSheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  actionButtonIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  actionButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "500",
  },
  cancelButton: {
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  cancelButtonText: {
    color: COLORS.secondary,
    fontSize: 16,
    textAlign: "center",
  },
});
