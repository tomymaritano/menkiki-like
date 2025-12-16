import {
  Camera,
  Heart,
  Clock,
  MapPin,
  Phone,
  Star,
  X,
  ArrowLeft,
  ChevronRight,
  Utensils,
  Pizza,
  Fish,
  Beef,
  Soup,
  Wifi,
  WifiOff,
  Sparkles,
  Search,
  AlertCircle,
  CheckCircle,
  Info,
  Trash2,
  RefreshCw,
  type LucideIcon,
} from "lucide-react-native";

// Tab bar icons
export const TabIcons = {
  camera: Camera,
  favorites: Heart,
  history: Clock,
} as const;

// Food category icons
export const FoodIcons: Record<string, LucideIcon> = {
  pizza: Pizza,
  sushi: Fish,
  ramen: Soup,
  burger: Beef,
  empanada: Utensils,
  default: Utensils,
};

// Action icons
export const ActionIcons = {
  mapPin: MapPin,
  phone: Phone,
  close: X,
  back: ArrowLeft,
  chevronRight: ChevronRight,
  star: Star,
  remove: Trash2,
  retry: RefreshCw,
  search: Search,
  heart: Heart,
  utensils: Utensils,
} as const;

// Status icons
export const StatusIcons = {
  wifi: Wifi,
  wifiOff: WifiOff,
  ai: Sparkles,
  error: AlertCircle,
  success: CheckCircle,
  info: Info,
  camera: Camera,
} as const;

// Helper to get food icon
export function getFoodIcon(category: string): LucideIcon {
  const key = category.toLowerCase();
  return FoodIcons[key] || FoodIcons.default;
}

// Export individual icons for direct use
export {
  Camera,
  Heart,
  Clock,
  MapPin,
  Phone,
  Star,
  X,
  ArrowLeft,
  ChevronRight,
  Utensils,
  Pizza,
  Fish,
  Beef,
  Soup,
  Wifi,
  WifiOff,
  Sparkles,
  Search,
  AlertCircle,
  CheckCircle,
  Info,
  Trash2,
  RefreshCw,
};

export type { LucideIcon };
