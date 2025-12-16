import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Clock } from "lucide-react-native";
import { useHistory, useHaptics, useToast } from "../../src/hooks";
import { COLORS, SPACING, RADIUS, SHADOWS, TYPOGRAPHY, getFoodIcon } from "../../src/constants";
import { FadeIn, EmptyState, SwipeableRow } from "../../src/components";

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function HistoryEmptyState() {
  return (
    <EmptyState
      Icon={Clock}
      title="Start exploring"
      description="Snap a photo of any food and we'll remember your discoveries here"
    />
  );
}

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { history, removeFromHistory, clearHistory, isLoading } = useHistory();
  const haptics = useHaptics();
  const { showToast } = useToast();

  const handleSearchAgain = (category: string) => {
    haptics.selection();
    router.push({
      pathname: "/results",
      params: { category },
    });
  };

  const handleRemoveItem = (id: string, category: string) => {
    removeFromHistory(id);
    showToast(`${capitalizeFirst(category)} removed from history`, "info");
  };

  const handleClearAll = () => {
    haptics.warning();
    Alert.alert(
      "Clear History",
      "Are you sure you want to clear all search history?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            haptics.error();
            clearHistory();
            showToast("History cleared", "info");
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>History</Text>
          {history.length > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{history.length}</Text>
            </View>
          )}
        </View>
        {history.length > 0 && (
          <TouchableOpacity onPress={handleClearAll} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {!isLoading && history.length === 0 ? (
        <HistoryEmptyState />
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            const IconComponent = getFoodIcon(item.category);
            return (
              <FadeIn delay={index * 60} type="spring" direction="up">
                <SwipeableRow onDelete={() => handleRemoveItem(item.id, item.category)}>
                  <TouchableOpacity
                    style={styles.card}
                    onPress={() => handleSearchAgain(item.category)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.cardIcon}>
                      <IconComponent size={24} color={COLORS.accent} />
                    </View>
                    <View style={styles.cardContent}>
                      <Text style={styles.category}>{capitalizeFirst(item.category)}</Text>
                      <Text style={styles.time}>{formatTimeAgo(item.timestamp)}</Text>
                    </View>
                    <View style={styles.swipeHint}>
                      <Text style={styles.swipeHintText}>Swipe to delete</Text>
                    </View>
                  </TouchableOpacity>
                </SwipeableRow>
              </FadeIn>
            );
          }}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING[5],
    paddingVertical: SPACING[4],
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.size["4xl"],
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  countBadge: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING[3],
    paddingVertical: SPACING[1],
    marginLeft: SPACING[3],
  },
  countText: {
    color: COLORS.secondary,
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
  },
  clearButton: {
    paddingVertical: SPACING[2],
    paddingHorizontal: SPACING[3],
  },
  clearButtonText: {
    color: COLORS.error,
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.medium,
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
    padding: SPACING[3],
    flexDirection: "row",
    alignItems: "center",
    ...SHADOWS.md,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.accentMuted,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING[3],
  },
  cardContent: {
    flex: 1,
  },
  category: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.semibold,
    marginBottom: SPACING[1],
  },
  time: {
    color: COLORS.secondary,
    fontSize: TYPOGRAPHY.size.sm,
  },
  swipeHint: {
    opacity: 0.5,
  },
  swipeHintText: {
    color: COLORS.tertiary,
    fontSize: TYPOGRAPHY.size.xs,
  },
});
