import { useEffect, useState } from "react";
import { connectionStore, type ConnectionState } from "../utils/connectionStore";

export function useConnection(): ConnectionState {
  const [state, setState] = useState<ConnectionState>(() => ({ ...connectionStore.getState() }));

  useEffect(() => {
    return connectionStore.subscribe((s) => setState({ ...s }));
  }, []);

  return state;
}
