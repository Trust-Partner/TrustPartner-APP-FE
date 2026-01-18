import { create } from 'zustand';
import EncryptedStorage from 'react-native-encrypted-storage';
import axiosInstance from '../api/axiosInstance';
import { User } from '../types/User';
import { loginStaff, loginPartner } from '../api/auth';

type Role = 'USER' | 'ADMIN';

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;

  initialized: boolean;

  login: (
    loginId: string,
    password: string,
    role: Role,
    autoLogin: boolean,
  ) => Promise<void>;

  logout: () => Promise<void>;
  restore: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,

  initialized: false,

  login: async (loginId, password, role, autoLogin) => {
    try {
      const response =
        role === 'ADMIN'
          ? await loginStaff(loginId, password)
          : await loginPartner(loginId, password);

      const data = response.data.data;

      const rawToken = response.headers['authorization'];
      const accessToken = rawToken?.replace('Bearer ', '') ?? '';
      const refreshToken = ''; // 아직 없음

      // User 타입 생성
      let user: User;

      if (role === 'ADMIN') {
        user = {
          kind: 'ADMIN',
          staffId: data.staffId,
          name: data.name,
          loginId: data.loginId,
          phoneNumber: data.phoneNumber,
          branch: data.branch,
          enabled: data.enabled,
          role: {
            code: data.role.code,
            description: data.role.description,
          },
        };
      } else {
        user = {
          kind: 'USER',
          partnerId: data.partnerId,
          locationId: data.locationId,
          name: data.name,
          loginId: data.loginId,
          phoneNumber: data.phoneNumber,
          branch: data.branch,
          enabled: data.enabled,
          address: data.address,
          gradeName: data.gradeName,
          role: {
            code: data.role.code,
            description: data.role.description,
          },
        };
      }

      await EncryptedStorage.setItem('accessToken', accessToken);
      await EncryptedStorage.setItem('refreshToken', refreshToken);

      axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;

      if (autoLogin) {
        await EncryptedStorage.setItem('user', JSON.stringify(user));
      }

      set({ user, accessToken, refreshToken });
    } catch (error) {
      console.error('로그인 실패:', error);
      throw error;
    }
  },

  logout: async () => {
    await EncryptedStorage.clear();
    delete axiosInstance.defaults.headers.Authorization;
    set({ user: null, accessToken: null, refreshToken: null });
  },

  restore: async () => {
    try {
      const [userStr, token, refresh] = await Promise.all([
        EncryptedStorage.getItem('user'),
        EncryptedStorage.getItem('accessToken'),
        EncryptedStorage.getItem('refreshToken'),
      ]);

      if (userStr && token) {
        axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;

        const user: User = JSON.parse(userStr);
        set({
          user,
          accessToken: token,
          refreshToken: refresh ?? '',
        });
      }
    } finally {
      set({ initialized: true });
    }
  },
}));
