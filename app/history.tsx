import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useHistory } from "../src/hooks/useHistory";
import { COLORS } from "../src/constants";

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>🕐</Text>
      <Text style={styles.emptyTitle}>No search history</Text>
      <Text style={styles.emptyText}>
        Your food searches will appear here so you can quickly find them again.
      </Text>
      <TouchableOpacity style={styles.emptyButton} onPress={() => router.push("/")}>
        <Text style={styles.emptyButtonText}>Start Searching</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function HistoryScreen() {
  const { history, removeFromHistory, clearHistory } = useHistory();

  const handleSearchAgain = (category: string) => {
    router.push({
      pathname: "/results",
      params: { category },
    });
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
        <View style={styles.headerRow}>
          <Text style={styles.title}>History</Text>
          {history.length > 0 && (
            <TouchableOpacity onPress={clearHistory}>
              <Text style={styles.clearButton}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
        {history.length > 0 && (
          <Text style={styles.subtitle}>{history.length} recent searches</Text>
        )}
      </View>

      {history.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => handleSearchAgain(item.category)}
              activeOpacity={0.7}
            >
              <View style={styles.cardContent}>
                <Text style={styles.category}>{item.category}</Text>
                <Text style={styles.time}>{formatTimeAgo(item.timestamp)}</Text>
              </View>
              <TouchableOpacity
                onPress={() => removeFromHistory(item.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.removeIcon}>✕</Text>
              </TouchableOpacity>
            </TouchableOpacity>
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    color: COLORS.secondary,
    fontSize: 16,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: COLORS.primary,
    fontSize: 32,
    fontWeight: "700",
  },
  clearButton: {
    color: COLORS.error,
    fontSize: 14,
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
  category: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  time: {
    color: COLORS.secondary,
    fontSize: 13,
  },
  removeIcon: {
    color: COLORS.secondary,
    fontSize: 16,
    padding: 4,
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
});
