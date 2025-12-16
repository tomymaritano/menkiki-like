import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Heart, Utensils, Star } from "lucide-react-native";
import { useFavorites, useHaptics } from "../../src/hooks";
import { COLORS, SPACING, RADIUS, SHADOWS, TYPOGRAPHY } from "../../src/constants";
import { FadeIn, EmptyState, ActionSheet } from "../../src/components";
import type { Restaurant } from "../../src/types";

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
    <FadeIn delay={index * 60} type="spring" direction="up">
      <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.cardIcon}>
          <Utensils size={24} color={COLORS.accent} />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.name} numberOfLines={1}>
            {restaurant.name}
          </Text>
          <View style={styles.meta}>
            <View style={styles.ratingBadge}>
              <Star size={12} color={COLORS.warning} fill={COLORS.warning} />
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
          <Heart size={18} color={COLORS.error} fill={COLORS.error} />
        </View>
      </TouchableOpacity>
    </FadeIn>
  );
}

function FavoritesEmptyState() {
  return (
    <EmptyState
      Icon={Heart}
      title="Your favorites await"
      description="Found a gem? Tap the heart to save it here for your next craving"
    />
  );
}

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const { favorites, removeFavorite, isLoading } = useFavorites();
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const haptics = useHaptics();

  const handleSelectRestaurant = (restaurant: Restaurant) => {
    haptics.selection();
    setSelectedRestaurant(restaurant);
  };

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
        <FavoritesEmptyState />
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <RestaurantCard
              restaurant={item}
              onPress={() => handleSelectRestaurant(item)}
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
        bottomInset={insets.bottom}
        showRemove
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
    paddingHorizontal: SPACING[5],
    paddingVertical: SPACING[4],
  },
  title: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.size["4xl"],
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  countBadge: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING[3],
    paddingVertical: SPACING[1],
    marginLeft: SPACING[3],
  },
  countText: {
    color: COLORS.background,
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
  },
  list: {
    paddingHorizontal: SPACING[5],
    paddingBottom: 120,
    gap: SPACING[3],
  },
  card: {
    backgroundColor: COLORS.glass.background,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.glass.border,
    padding: SPACING[4],
    flexDirection: "row",
    alignItems: "center",
    ...SHADOWS.md,
  },
  cardIcon: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.accentMuted,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING[3],
  },
  cardContent: {
    flex: 1,
  },
  name: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.semibold,
    marginBottom: SPACING[1],
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING[2],
    marginBottom: SPACING[1],
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.warningMuted,
    paddingHorizontal: SPACING[2],
    paddingVertical: SPACING[1],
    borderRadius: RADIUS.sm,
    gap: SPACING[1],
  },
  ratingText: {
    color: COLORS.warning,
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
  },
  price: {
    color: COLORS.secondary,
    fontSize: TYPOGRAPHY.size.sm,
  },
  distance: {
    color: COLORS.secondary,
    fontSize: TYPOGRAPHY.size.sm,
  },
  address: {
    color: COLORS.tertiary,
    fontSize: TYPOGRAPHY.size.sm,
  },
  heartContainer: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
});
