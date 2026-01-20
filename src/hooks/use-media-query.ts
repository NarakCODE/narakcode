import { useSyncExternalStore } from "react";

export function useMediaQuery(query: string) {
  const subscribe = (onStoreChange: () => void) => {
    const matchMedia = window.matchMedia(query);
    matchMedia.addEventListener("change", onStoreChange);
    return () => matchMedia.removeEventListener("change", onStoreChange);
  };

  const getSnapshot = () => window.matchMedia(query).matches;
  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
