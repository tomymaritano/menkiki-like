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
import { useLocalSearchParams, router } from "expo-router";
import { useRestaurants } from "../src/hooks/useRestaurants";
import { COLORS } from "../src/constants";
import { SkeletonList, FadeIn } from "../src/components";
import type { Restaurant } from "../src/types";

interface ActionSheetProps {
  visible: boolean;
  restaurant: Restaurant | null;
  onClose: () => void;
}

function ActionSheet({ visible, restaurant, onClose }: ActionSheetProps) {
  if (!restaurant) return null;

  const handleOpenMaps = () => {
    const query = encodeURIComponent(`${restaurant.name} ${restaurant.address} Buenos Aires`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
    onClose();
  };

  const handleCall = () => {
    // Mock phone numbers for demo
    const mockPhones: Record<string, string> = {
      "Pizzeria Güerrin": "+54 11 4371-8141",
      "El Cuartito": "+54 11 4816-1758",
      Osaka: "+54 11 4775-6964",
      "Burger Joint": "+54 11 4833-5151",
    };
    const phone = restaurant.phone || mockPhones[restaurant.name] || null;

    if (phone) {
      Linking.openURL(`tel:${phone.replace(/\s/g, "")}`);
    }
    onClose();
  };

  const hasPhone =
    restaurant.phone ||
    ["Pizzeria Güerrin", "El Cuartito", "Osaka", "Burger Joint"].includes(restaurant.name);

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

          {hasPhone && (
            <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
              <Text style={styles.actionButtonIcon}>📞</Text>
              <Text style={styles.actionButtonText}>Call Restaurant</Text>
            </TouchableOpacity>
          )}

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
          <Text style={styles.distance}>{restaurant.distance}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.price}>{restaurant.priceLevel}</Text>
        </View>
        <Text style={styles.address}>{restaurant.address}</Text>
      </View>
      <Text style={styles.arrow}>→</Text>
    </TouchableOpacity>
  );
}

function LoadingState() {
  return (
    <View style={styles.loadingState}>
      <Text style={styles.loadingText}>Finding nearby places...</Text>
      <SkeletonList />
    </View>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View style={styles.centerState}>
      <Text style={styles.errorTitle}>Oops!</Text>
      <Text style={styles.errorText}>{message}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryButtonText}>Try again</Text>
      </TouchableOpacity>
    </View>
  );
}

function EmptyState({ category }: { category: string }) {
  return (
    <View style={styles.centerState}>
      <Text style={styles.emptyTitle}>No restaurants found</Text>
      <Text style={styles.emptyText}>
        We couldn't find any {category.toLowerCase()} places nearby. Try a different category or
        expand your search area.
      </Text>
      <TouchableOpacity style={styles.emptyButton} onPress={() => router.back()}>
        <Text style={styles.emptyButtonText}>Try another photo</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function ResultsScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const { restaurants, isLoading, error, retry } = useRestaurants(category || "Pizza");
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (error && restaurants.length === 0) {
      return <ErrorState message={error} onRetry={retry} />;
    }

    if (restaurants.length === 0) {
      return <EmptyState category={category || "Food"} />;
    }

    return (
      <FadeIn>
        <FlatList
          data={restaurants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RestaurantCard restaurant={item} onPress={() => setSelectedRestaurant(item)} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </FadeIn>
    );
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
        <Text style={styles.title}>{category || "Food"} nearby</Text>
        {!isLoading && restaurants.length > 0 && (
          <Text style={styles.subtitle}>{restaurants.length} places found</Text>
        )}
      </View>

      {renderContent()}

      <ActionSheet
        visible={!!selectedRestaurant}
        restaurant={selectedRestaurant}
        onClose={() => setSelectedRestaurant(null)}
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
  distance: {
    color: COLORS.secondary,
    fontSize: 14,
  },
  price: {
    color: COLORS.secondary,
    fontSize: 14,
  },
  address: {
    color: "#666",
    fontSize: 13,
  },
  arrow: {
    color: COLORS.secondary,
    fontSize: 20,
  },
  loadingState: {
    flex: 1,
  },
  centerState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  loadingText: {
    color: COLORS.secondary,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  errorTitle: {
    color: COLORS.primary,
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8,
  },
  errorText: {
    color: COLORS.secondary,
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 10,
  },
  retryButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "600",
  },
  emptyTitle: {
    color: COLORS.primary,
    fontSize: 20,
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
    backgroundColor: COLORS.surface,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: COLORS.primary,
    fontSize: 16,
  },
  // Action Sheet styles
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
