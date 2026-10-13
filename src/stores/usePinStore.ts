import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PinState {
  pinnedIds: string[];
  togglePin: (id: string) => void;
  isPinned: (id: string) => boolean;
}

export const usePinStore = create<PinState>()(
  persist(
    (set, get) => ({
      pinnedIds: [],
      togglePin: (id: string) => {
        set((state) => {
          const exists = state.pinnedIds.includes(id);
          return {
            pinnedIds: exists
              ? state.pinnedIds.filter((pinnedId) => pinnedId !== id)
              : [...state.pinnedIds, id],
          };
        });
      },
      isPinned: (id: string) => get().pinnedIds.includes(id),
    }),
    {
      name: "pinned-deadlines-storage",
    }
  )
);
