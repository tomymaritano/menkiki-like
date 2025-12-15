import { useState, useEffect } from "react";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";

interface UseNetworkReturn {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
  type: string | null;
}

export function useNetwork(): UseNetworkReturn {
  const [state, setState] = useState<UseNetworkReturn>({
    isConnected: null,
    isInternetReachable: null,
    type: null,
  });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((netState: NetInfoState) => {
      setState({
        isConnected: netState.isConnected,
        isInternetReachable: netState.isInternetReachable,
        type: netState.type,
      });
    });

    return () => unsubscribe();
  }, []);

  return state;
}
