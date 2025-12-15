import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";
import { useNetwork } from "../src/hooks";
import { OfflineBanner } from "../src/components";

export default function RootLayout() {
  const { isConnected, isInternetReachable } = useNetwork();
  const isOffline = isConnected === false || isInternetReachable === false;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {isOffline && <OfflineBanner />}
      <View style={styles.content}>
        <Slot />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  content: {
    flex: 1,
  },
});
