import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../constants";

interface OfflineBannerProps {
  message?: string;
}

export function OfflineBanner({ message = "No internet connection" }: OfflineBannerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📡</Text>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.error,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 8,
  },
  icon: {
    fontSize: 14,
  },
  text: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
});
