import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'admin' | 'user';

interface User {
  id: number;
  name: string;
  role: Role;
}

interface AuthState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      login: user => set({ user }),
      logout: () => set({ user: null }),
    }),
    { name: 'auth-storage' },
  ),
);
