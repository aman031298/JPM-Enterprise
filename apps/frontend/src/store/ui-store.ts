import { create } from "zustand";

interface UiState {
  darkMode: boolean;
  toggleTheme: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  darkMode: false,
  toggleTheme: () => {
    set((state) => {
      const next = !state.darkMode;
      document.documentElement.classList.toggle("dark", next);
      return { darkMode: next };
    });
  }
}));
