"use client";
import { useState, useEffect } from "react";

const KEY = "verse_integrations";

type IntegrationState = {
  connected: boolean;
  meta?: Record<string, string>;
};

type Store = Record<string, IntegrationState>;

export function useIntegrations() {
  const [store, setStore] = useState<Store>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setStore(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  const save = (next: Store) => {
    setStore(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  };

  const connect = (id: string, meta?: Record<string, string>) =>
    save({ ...store, [id]: { connected: true, meta } });

  const disconnect = (id: string) => {
    const next = { ...store };
    delete next[id];
    save(next);
  };

  const isConnected = (id: string) => !!store[id]?.connected;
  const getMeta = (id: string) => store[id]?.meta ?? {};

  return { isConnected, connect, disconnect, getMeta, loaded };
}
