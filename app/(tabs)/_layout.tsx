import { Tabs } from "expo-router";
import { View, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Camera, Heart, Clock } from "lucide-react-native";
import { COLORS, SPACING } from "../../src/constants";
import { useHaptics } from "../../src/hooks";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const haptics = useHaptics();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.secondary,
        tabBarStyle: [
          styles.tabBar,
          {
            height: 50 + (insets.bottom > 0 ? insets.bottom : SPACING[2]),
            paddingBottom: insets.bottom > 0 ? insets.bottom : SPACING[2],
          },
        ],
        tabBarBackground: () => (
          <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
        ),
        tabBarLabelStyle: styles.label,
        tabBarIconStyle: styles.icon,
      }}
      screenListeners={{
        tabPress: () => haptics.selection(),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Scan",
          tabBarIcon: ({ color }) => (
            <Camera size={22} color={color} strokeWidth={1.8} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Saved",
          tabBarIcon: ({ color }) => (
            <Heart size={22} color={color} strokeWidth={1.8} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => (
            <Clock size={22} color={color} strokeWidth={1.8} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    borderTopWidth: 0,
    backgroundColor: "transparent",
    elevation: 0,
  },
  label: {
    fontSize: 10,
    fontWeight: "500",
    marginTop: -2,
  },
  icon: {
    marginTop: 4,
  },
});
