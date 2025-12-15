import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHistory } from "../../src/hooks/useHistory";
import { COLORS } from "../../src/constants";
import { FadeIn } from "../../src/components";

const CATEGORY_ICONS: Record<string, string> = {
  pizza: "🍕",
  burger: "🍔",
  sushi: "🍣",
  ramen: "🍜",
  empanada: "🥟",
};

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

function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Text style={styles.emptyEmoji}>🕐</Text>
      </View>
      <Text style={styles.emptyTitle}>No search history</Text>
      <Text style={styles.emptyText}>
        Your food searches will appear here. Start scanning food to build your history.
      </Text>
    </View>
  );
}

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { history, removeFromHistory, clearHistory, isLoading } = useHistory();

  const handleSearchAgain = (category: string) => {
    router.push({
      pathname: "/results",
      params: { category },
    });
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear History",
      "Are you sure you want to clear all search history?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: clearHistory,
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
        <EmptyState />
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <FadeIn delay={index * 50}>
              <TouchableOpacity
                style={styles.card}
                onPress={() => handleSearchAgain(item.category)}
                activeOpacity={0.7}
              >
                <View style={styles.cardIcon}>
                  <Text style={styles.cardEmoji}>
                    {CATEGORY_ICONS[item.category.toLowerCase()] || "🍽️"}
                  </Text>
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.category}>{capitalizeFirst(item.category)}</Text>
                  <Text style={styles.time}>{formatTimeAgo(item.timestamp)}</Text>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeFromHistory(item.id)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.removeIcon}>✕</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </FadeIn>
          )}
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    color: COLORS.primary,
    fontSize: 34,
    fontWeight: "700",
  },
  countBadge: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 12,
  },
  countText: {
    color: COLORS.secondary,
    fontSize: 14,
    fontWeight: "600",
  },
  clearButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  clearButtonText: {
    color: COLORS.error,
    fontSize: 15,
    fontWeight: "500",
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 10,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  cardIcon: {
    width: 48,
    height: 48,
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
  category: {
    color: COLORS.primary,
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 4,
  },
  time: {
    color: COLORS.secondary,
    fontSize: 13,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  removeIcon: {
    color: COLORS.secondary,
    fontSize: 14,
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
});
