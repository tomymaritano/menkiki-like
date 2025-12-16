import { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft, Star, Utensils } from "lucide-react-native";
import { useRestaurants, useFavorites, useHaptics, useToast } from "../src/hooks";
import { COLORS, SPACING, RADIUS, SHADOWS, TYPOGRAPHY } from "../src/constants";
import { SkeletonList, FadeIn, GlassButton, EmptyState, Logo, ActionSheet, AnimatedHeart } from "../src/components";
import type { Restaurant } from "../src/types";

function RestaurantCard({
  restaurant,
  onPress,
  isFavorite,
  onToggleFavorite,
  index,
}: {
  restaurant: Restaurant;
  onPress: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  index: number;
}) {
  return (
    <FadeIn delay={index * 60} type="spring" direction="up">
      <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.cardIcon}>
          <Utensils size={24} color={COLORS.accent} />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.name} numberOfLines={1}>{restaurant.name}</Text>
          <View style={styles.meta}>
            <View style={styles.ratingBadge}>
              <Star size={12} color={COLORS.warning} fill={COLORS.warning} />
              <Text style={styles.ratingText}>{restaurant.rating.toFixed(1)}</Text>
            </View>
            <Text style={styles.distance}>{restaurant.distance}</Text>
            <Text style={styles.price}>{restaurant.priceLevel}</Text>
          </View>
          <Text style={styles.address} numberOfLines={1}>{restaurant.address}</Text>
        </View>
        <AnimatedHeart
          isFavorite={isFavorite}
          onToggle={onToggleFavorite}
          size={20}
        />
      </TouchableOpacity>
    </FadeIn>
  );
}

function LoadingState() {
  return (
    <View style={styles.loadingState}>
      <Text style={styles.loadingText}>Hunting down the best spots...</Text>
      <SkeletonList />
    </View>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View style={styles.centerState}>
      <Text style={styles.errorTitle}>Whoops!</Text>
      <Text style={styles.errorText}>Something went sideways. Let's give it another shot!</Text>
      <GlassButton title="Try again" onPress={onRetry} variant="primary" />
    </View>
  );
}

function ResultsEmptyState({ category }: { category: string }) {
  return (
    <EmptyState
      Icon={Utensils}
      title="Nothing nearby"
      description={`Looks like ${category.toLowerCase()} spots are hiding! Try scanning something else or explore a new area`}
      action={
        <GlassButton
          title="Scan something new"
          onPress={() => router.canGoBack() ? router.back() : router.replace("/")}
          variant="secondary"
        />
      }
    />
  );
}

export default function ResultsScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const insets = useSafeAreaInsets();
  const { restaurants, isLoading, error, retry } = useRestaurants(category || "Pizza");
  const { isFavorite, toggleFavorite } = useFavorites();
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const haptics = useHaptics();
  const { showToast } = useToast();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    haptics.light();
    await retry();
    setRefreshing(false);
    showToast("Results updated", "info");
  }, [retry, haptics, showToast]);

  const handleBack = () => {
    haptics.light();
    router.canGoBack() ? router.back() : router.replace("/");
  };

  const handleToggleFavorite = (restaurant: Restaurant) => {
    const willBeFavorite = !isFavorite(restaurant.id);
    toggleFavorite(restaurant);
    if (willBeFavorite) {
      showToast(`${restaurant.name} added to favorites`, "success");
    }
  };

  const handleSelectRestaurant = (restaurant: Restaurant) => {
    haptics.selection();
    setSelectedRestaurant(restaurant);
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (error && restaurants.length === 0) {
      return <ErrorState message={error} onRetry={retry} />;
    }

    if (restaurants.length === 0) {
      return <ResultsEmptyState category={category || "Food"} />;
    }

    return (
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <RestaurantCard
            restaurant={item}
            onPress={() => handleSelectRestaurant(item)}
            isFavorite={isFavorite(item.id)}
            onToggleFavorite={() => handleToggleFavorite(item)}
            index={index}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.accent}
            colors={[COLORS.accent]}
          />
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={handleBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.backButton}
          >
            <ArrowLeft size={20} color={COLORS.secondary} />
          </TouchableOpacity>
          <Logo size="sm" showIcon={false} />
          <View style={styles.headerSpacer} />
        </View>
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
        bottomInset={insets.bottom}
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
    paddingHorizontal: SPACING[5],
    paddingBottom: SPACING[4],
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING[3],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  headerSpacer: {
    width: 40,
  },
  title: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.size["4xl"],
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  subtitle: {
    color: COLORS.secondary,
    fontSize: TYPOGRAPHY.size.sm,
    marginTop: SPACING[1],
  },
  list: {
    paddingHorizontal: SPACING[5],
    paddingBottom: SPACING[10],
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
    fontSize: TYPOGRAPHY.size.lg,
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
  distance: {
    color: COLORS.secondary,
    fontSize: TYPOGRAPHY.size.sm,
  },
  price: {
    color: COLORS.secondary,
    fontSize: TYPOGRAPHY.size.sm,
  },
  address: {
    color: COLORS.tertiary,
    fontSize: TYPOGRAPHY.size.sm,
  },
  heartButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingState: {
    flex: 1,
  },
  centerState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING[10],
  },
  loadingText: {
    color: COLORS.secondary,
    fontSize: TYPOGRAPHY.size.md,
    textAlign: "center",
    marginBottom: SPACING[5],
  },
  errorTitle: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.size["2xl"],
    fontWeight: TYPOGRAPHY.weight.semibold,
    marginBottom: SPACING[2],
  },
  errorText: {
    color: COLORS.secondary,
    fontSize: TYPOGRAPHY.size.md,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: SPACING[6],
  },
});
