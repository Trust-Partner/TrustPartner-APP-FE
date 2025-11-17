import { create } from 'zustand';
import { loginStaff, loginPartner } from '../api/auth';

type Role = 'USER' | 'ADMIN';

type User = {
  id: string;
  name: string;
  role: Role;
  roleCode?: string;
  roleDesc?: string;
  branch?: string;
  loginId?: string;
  phoneNumber?: string;
  address?: string;
  gradeName?: string;
};

type AuthState = {
  user: User | null;
  login: (loginId: string, password: string, role: Role) => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>(set => ({
  user: null,

  login: async (loginId, password, role) => {
    try {
      const data =
        role === 'ADMIN'
          ? await loginStaff(loginId, password)
          : await loginPartner(loginId, password);

      const normalizedRole: Role = data.role.code === 'USER' ? 'USER' : 'ADMIN';

      const userData: User = {
        id: data.staffId || data.partnerId,
        name: data.name,
        role: normalizedRole,
        roleCode: data.role.code,
        roleDesc: data.role.description,
        branch: data.branch,
        loginId: data.loginId,
        phoneNumber: data.phoneNumber,
        address: data.address,
        gradeName: data.gradeName,
      };

      set({ user: userData });
    } catch (error) {
      console.error('로그인 실패:', error);
      throw error;
    }
  },

  logout: () => set({ user: null }),
}));
