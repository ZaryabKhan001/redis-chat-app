import { create } from "zustand";

type preferences = {
  soundEnabled: boolean;
  setSoundEnabled: (soundEnabled: boolean) => void;
};

export const usePreferencesStore = create<preferences>((set) => ({
  soundEnabled: false,
  setSoundEnabled: (soundEnabled: boolean): void => {
    set({ soundEnabled: soundEnabled });
  },
}));
