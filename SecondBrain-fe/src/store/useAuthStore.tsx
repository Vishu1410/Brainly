// src/store/useAuthStore.ts
import { create } from "zustand"

interface AuthStore {
  brainToken: string | null;
  username: string | null;
  setUser: (token: string, username: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  brainToken: null,
  username: null,
  setUser: (token, username) => set({ brainToken: token, username }),
  logout: () => set({ brainToken: null, username: null }),
}));
