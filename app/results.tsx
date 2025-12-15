import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";

interface Restaurant {
  id: string;
  name: string;
  rating: number;
  distance: string;
  priceLevel: string;
  address: string;
}

// Mock data - will be replaced with Google Places API
const mockRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "Pizzeria Güerrin",
    rating: 4.5,
    distance: "0.3 km",
    priceLevel: "$$",
    address: "Av. Corrientes 1368",
  },
  {
    id: "2",
    name: "El Cuartito",
    rating: 4.3,
    distance: "0.7 km",
    priceLevel: "$$",
    address: "Talcahuano 937",
  },
  {
    id: "3",
    name: "La Mezzetta",
    rating: 4.4,
    distance: "1.2 km",
    priceLevel: "$$",
    address: "Av. Álvarez Thomas 1321",
  },
  {
    id: "4",
    name: "Banchero",
    rating: 4.2,
    distance: "1.5 km",
    priceLevel: "$",
    address: "Av. Corrientes 1300",
  },
];

function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const handlePress = () => {
    // Open in Google Maps
    const query = encodeURIComponent(`${restaurant.name} ${restaurant.address}`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{category || "Food"} nearby</Text>
      </View>

      <FlatList
        data={mockRestaurants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RestaurantCard restaurant={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    color: "#888",
    fontSize: 16,
    marginBottom: 12,
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "700",
  },
  list: {
    paddingHorizontal: 20,
    gap: 12,
  },
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
  },
  name: {
    color: "#fff",
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
    color: "#fbbf24",
    fontSize: 14,
  },
  dot: {
    color: "#888",
    marginHorizontal: 6,
  },
  distance: {
    color: "#888",
    fontSize: 14,
  },
  price: {
    color: "#888",
    fontSize: 14,
  },
  address: {
    color: "#666",
    fontSize: 13,
  },
  arrow: {
    color: "#888",
    fontSize: 20,
  },
});
