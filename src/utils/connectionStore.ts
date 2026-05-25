type Listener = (state: ConnectionState) => void;

export type ConnectionState = {
  online: boolean;
  apiUp: boolean;
};

const state: ConnectionState = {
  online: typeof navigator !== "undefined" ? navigator.onLine : true,
  apiUp: true,
};

const listeners = new Set<Listener>();

function emit() {
  for (const l of listeners) l(state);
}

export const connectionStore = {
  getState(): ConnectionState {
    return state;
  },
  subscribe(cb: Listener): () => void {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  setOnline(online: boolean) {
    if (state.online === online) return;
    state.online = online;
    emit();
  },
  setApiUp(apiUp: boolean) {
    if (state.apiUp === apiUp) return;
    state.apiUp = apiUp;
    emit();
  },
};

if (typeof window !== "undefined") {
  window.addEventListener("online", () => connectionStore.setOnline(true));
  window.addEventListener("offline", () => connectionStore.setOnline(false));
}
