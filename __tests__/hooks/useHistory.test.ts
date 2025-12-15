import { renderHook, act, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useHistory } from "../../src/hooks/useHistory";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe("useHistory", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  it("should initialize with empty history", async () => {
    const { result } = renderHook(() => useHistory());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.history).toEqual([]);
  });

  it("should load history from AsyncStorage", async () => {
    const storedHistory = [
      { id: "1", category: "Pizza", timestamp: Date.now() },
    ];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(storedHistory));

    const { result } = renderHook(() => useHistory());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.history).toEqual(storedHistory);
  });

  it("should add item to history", async () => {
    const { result } = renderHook(() => useHistory());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.addToHistory("Pizza");
    });

    expect(result.current.history.length).toBe(1);
    expect(result.current.history[0].category).toBe("Pizza");
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  it("should move duplicate category to top", async () => {
    const storedHistory = [
      { id: "1", category: "Pizza", timestamp: Date.now() - 1000 },
      { id: "2", category: "Sushi", timestamp: Date.now() - 2000 },
    ];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(storedHistory));

    const { result } = renderHook(() => useHistory());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.addToHistory("Sushi");
    });

    // Sushi should be first now, Pizza second
    expect(result.current.history[0].category).toBe("Sushi");
    expect(result.current.history[1].category).toBe("Pizza");
    expect(result.current.history.length).toBe(2);
  });

  it("should limit history to 10 items", async () => {
    const storedHistory = Array.from({ length: 10 }, (_, i) => ({
      id: String(i),
      category: `Category ${i}`,
      timestamp: Date.now() - i * 1000,
    }));
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(storedHistory));

    const { result } = renderHook(() => useHistory());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.addToHistory("New Category");
    });

    expect(result.current.history.length).toBe(10);
    expect(result.current.history[0].category).toBe("New Category");
  });

  it("should remove item from history", async () => {
    const storedHistory = [
      { id: "1", category: "Pizza", timestamp: Date.now() },
    ];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(storedHistory));

    const { result } = renderHook(() => useHistory());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.removeFromHistory("1");
    });

    expect(result.current.history).toEqual([]);
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  it("should clear all history", async () => {
    const storedHistory = [
      { id: "1", category: "Pizza", timestamp: Date.now() },
      { id: "2", category: "Sushi", timestamp: Date.now() },
    ];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(storedHistory));

    const { result } = renderHook(() => useHistory());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.clearHistory();
    });

    expect(result.current.history).toEqual([]);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      expect.any(String),
      "[]"
    );
  });
});
