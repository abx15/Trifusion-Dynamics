import { create } from "zustand";

export interface User {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  organizationId: string;
  roles: string[];
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  setAuth: (user, accessToken) =>
    set({ user, accessToken, isAuthenticated: true }),
  clearAuth: () =>
    set({ user: null, accessToken: null, isAuthenticated: false }),
}));
export default useAuthStore;
