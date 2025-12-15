import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useRestaurants } from "../src/hooks/useRestaurants";
import { COLORS } from "../src/constants";
import type { Restaurant } from "../src/types";

function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const handlePress = () => {
    const query = encodeURIComponent(`${restaurant.name} ${restaurant.address} Buenos Aires`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
  };

  const handleCall = () => {
    if (restaurant.phone) {
      Linking.openURL(`tel:${restaurant.phone}`);
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.7}>
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
    <View style={styles.centerState}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.loadingText}>Finding nearby places...</Text>
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
        We couldn't find any {category.toLowerCase()} places nearby. Try a different category or expand your search area.
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
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RestaurantCard restaurant={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
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
  centerState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  loadingText: {
    color: COLORS.secondary,
    fontSize: 16,
    marginTop: 16,
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
});
