import { renderHook, act, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFavorites } from "../../src/hooks/useFavorites";
import type { Restaurant } from "../../src/types";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

const mockRestaurant: Restaurant = {
  id: "1",
  name: "Test Restaurant",
  rating: 4.5,
  distance: "0.5 km",
  priceLevel: "$$",
  address: "123 Test St",
};

const _mockRestaurant2: Restaurant = {
  id: "2",
  name: "Another Restaurant",
  rating: 4.0,
  distance: "1.0 km",
  priceLevel: "$",
  address: "456 Test Ave",
};

describe("useFavorites", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  it("should initialize with empty favorites", async () => {
    const { result } = renderHook(() => useFavorites());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.favorites).toEqual([]);
  });

  it("should load favorites from AsyncStorage", async () => {
    const storedFavorites = [mockRestaurant];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(storedFavorites));

    const { result } = renderHook(() => useFavorites());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.favorites).toEqual(storedFavorites);
  });

  it("should add a restaurant to favorites", async () => {
    const { result } = renderHook(() => useFavorites());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.addFavorite(mockRestaurant);
    });

    expect(result.current.favorites).toContainEqual(mockRestaurant);
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  it("should not add duplicate favorites", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([mockRestaurant]));

    const { result } = renderHook(() => useFavorites());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.addFavorite(mockRestaurant);
    });

    expect(result.current.favorites.length).toBe(1);
  });

  it("should remove a restaurant from favorites", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([mockRestaurant]));

    const { result } = renderHook(() => useFavorites());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.removeFavorite(mockRestaurant.id);
    });

    expect(result.current.favorites).toEqual([]);
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  it("should check if restaurant is favorite", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([mockRestaurant]));

    const { result } = renderHook(() => useFavorites());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isFavorite(mockRestaurant.id)).toBe(true);
    expect(result.current.isFavorite("non-existent")).toBe(false);
  });

  it("should toggle favorite status", async () => {
    const { result } = renderHook(() => useFavorites());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Add favorite
    await act(async () => {
      await result.current.toggleFavorite(mockRestaurant);
    });
    expect(result.current.isFavorite(mockRestaurant.id)).toBe(true);

    // Remove favorite
    await act(async () => {
      await result.current.toggleFavorite(mockRestaurant);
    });
    expect(result.current.isFavorite(mockRestaurant.id)).toBe(false);
  });
});
