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
import { COLORS } from "../src/constants";
import type { Restaurant } from "../src/types";

// Mock data - will be replaced with Google Places API in Phase 3
const MOCK_RESTAURANTS: Record<string, Restaurant[]> = {
  Pizza: [
    { id: "1", name: "Pizzeria Güerrin", rating: 4.5, distance: "0.3 km", priceLevel: "$$", address: "Av. Corrientes 1368" },
    { id: "2", name: "El Cuartito", rating: 4.3, distance: "0.7 km", priceLevel: "$$", address: "Talcahuano 937" },
    { id: "3", name: "La Mezzetta", rating: 4.4, distance: "1.2 km", priceLevel: "$$", address: "Av. Álvarez Thomas 1321" },
    { id: "4", name: "Banchero", rating: 4.2, distance: "1.5 km", priceLevel: "$", address: "Av. Corrientes 1300" },
  ],
  Sushi: [
    { id: "1", name: "Osaka", rating: 4.6, distance: "0.5 km", priceLevel: "$$$", address: "Soler 5608" },
    { id: "2", name: "Sushi Pop", rating: 4.4, distance: "0.8 km", priceLevel: "$$", address: "Costa Rica 4681" },
    { id: "3", name: "Green Bamboo", rating: 4.3, distance: "1.0 km", priceLevel: "$$", address: "Costa Rica 5802" },
  ],
  Ramen: [
    { id: "1", name: "Fukuro Noodle Bar", rating: 4.7, distance: "0.4 km", priceLevel: "$$", address: "Costa Rica 5514" },
    { id: "2", name: "Ramen House", rating: 4.2, distance: "1.1 km", priceLevel: "$$", address: "Thames 1810" },
  ],
  Burger: [
    { id: "1", name: "Burger Joint", rating: 4.5, distance: "0.3 km", priceLevel: "$$", address: "J. L. Borges 1766" },
    { id: "2", name: "Deniro", rating: 4.4, distance: "0.6 km", priceLevel: "$$", address: "Godoy Cruz 1823" },
    { id: "3", name: "Dellepiane", rating: 4.3, distance: "0.9 km", priceLevel: "$$", address: "Av. Libertador 4791" },
  ],
  Empanada: [
    { id: "1", name: "El Sanjuanino", rating: 4.4, distance: "0.2 km", priceLevel: "$", address: "Posadas 1515" },
    { id: "2", name: "La Cocina", rating: 4.3, distance: "0.5 km", priceLevel: "$", address: "Pueyrredón 1508" },
    { id: "3", name: "El Noble", rating: 4.0, distance: "0.8 km", priceLevel: "$", address: "Av. Santa Fe 1234" },
  ],
};

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
          <Text style={styles.rating}>★ {restaurant.rating}</Text>
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

export default function ResultsScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();

  const restaurants = MOCK_RESTAURANTS[category || "Pizza"] || MOCK_RESTAURANTS.Pizza;
  const hasResults = restaurants.length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{category || "Food"} nearby</Text>
        <Text style={styles.subtitle}>
          {hasResults ? `${restaurants.length} places found` : "No places found"}
        </Text>
      </View>

      {hasResults ? (
        <FlatList
          data={restaurants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <RestaurantCard restaurant={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No restaurants found</Text>
          <Text style={styles.emptyText}>
            Try a different food category or expand your search area.
          </Text>
          <TouchableOpacity style={styles.emptyButton} onPress={() => router.back()}>
            <Text style={styles.emptyButtonText}>Try another photo</Text>
          </TouchableOpacity>
        </View>
      )}
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
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
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
