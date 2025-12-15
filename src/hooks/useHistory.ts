import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HISTORY_KEY = "@menkiki:search_history";
const MAX_HISTORY_ITEMS = 10;

interface HistoryItem {
  id: string;
  category: string;
  timestamp: number;
}

interface UseHistoryReturn {
  history: HistoryItem[];
  isLoading: boolean;
  addToHistory: (category: string) => Promise<void>;
  removeFromHistory: (id: string) => Promise<void>;
  clearHistory: () => Promise<void>;
}

export function useHistory(): UseHistoryReturn {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const stored = await AsyncStorage.getItem(HISTORY_KEY);
        if (stored) {
          setHistory(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Failed to load history:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadHistory();
  }, []);

  const saveHistory = async (newHistory: HistoryItem[]) => {
    try {
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      setHistory(newHistory);
    } catch (error) {
      console.error("Failed to save history:", error);
    }
  };

  const addToHistory = useCallback(
    async (category: string) => {
      const newItem: HistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        category,
        timestamp: Date.now(),
      };

      // Remove duplicates of the same category and add new item at the start
      const filtered = history.filter(
        (item) => item.category.toLowerCase() !== category.toLowerCase()
      );
      const newHistory = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);

      await saveHistory(newHistory);
    },
    [history]
  );

  const removeFromHistory = useCallback(
    async (id: string) => {
      const newHistory = history.filter((item) => item.id !== id);
      await saveHistory(newHistory);
    },
    [history]
  );

  const clearHistory = useCallback(async () => {
    await saveHistory([]);
  }, []);

  return {
    history,
    isLoading,
    addToHistory,
    removeFromHistory,
    clearHistory,
  };
}
