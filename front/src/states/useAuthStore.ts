import { create } from 'zustand';
import { loginStaff, loginPartner } from '../api/auth';
import axiosInstance from '../api/axiosInstance';

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
      // 1. 서버 로그인 요청 (response 전체를 받아야 header 접근 가능)
      const response =
        role === 'ADMIN'
          ? await loginStaff(loginId, password)
          : await loginPartner(loginId, password);

      // 2. 응답 헤더에서 accessToken 추출
      const accessToken = response.headers['authorization'];

      // 3. axios 전역 Authorization 헤더 설정
      axiosInstance.defaults.headers.Authorization = accessToken;

      // 4. body 데이터 추출
      const data = response.data.data;

      // 5. userData 생성
      const userData: User = {
        id: data.staffId || data.partnerId,
        name: data.name,
        role,
        roleCode: data.role.code,
        roleDesc: data.role.description,
        branch: data.branch,
        loginId: data.loginId,
        phoneNumber: data.phoneNumber,
        address: data.address,
        gradeName: data.gradeName,
      };

      // 6. 전역 user 상태 저장
      set({ user: userData });
    } catch (error) {
      console.error('로그인 실패:', error);
      throw error;
    }
  },

  logout: () => {
    delete axiosInstance.defaults.headers.Authorization;
    set({ user: null });
  },
}));
