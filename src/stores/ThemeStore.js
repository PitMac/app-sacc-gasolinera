import { create } from 'zustand';

const useThemeStore = create((set) => ({
  isDarkTheme: false,
  toggleTheme: () => set((state) => ({ isDarkTheme: !state.isDarkTheme })),
  setTheme: (value) => set({ isDarkTheme: value }),
}));

export default useThemeStore;
