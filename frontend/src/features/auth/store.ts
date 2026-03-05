import { create } from "zustand";
import { refresh } from "@/features/auth/api";

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  refreshSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isAuthenticated: false,

  refreshSession: async () => {
    try {
      const data = await refresh();

      set({
        accessToken: data.access_token,
        isAuthenticated: true,
      });
    } catch {
      set({
        accessToken: null,
        isAuthenticated: false,
      });
    }
  },
}));