import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import Config from 'react-native-config';
import { useAuthStore } from '../states/useAuthStore';

const axiosInstance = axios.create({
  baseURL: Config.API_BASE_URL,
  timeout: 15000,
});

const SKIP_AUTH_PATHS = [
  '/auth/v1/partners',
  '/auth/v1/staffs',
  '/auth/v1/partner/find-id/code',
  '/auth/v1/staff/find-id/code',
  '/auth/v1/partner/find-id',
  '/auth/v1/staff/find-id',
];

// 요청 시 자동으로 AccessToken 주입
axiosInstance.interceptors.request.use(async config => {
  const url = config.url ?? '';

  const shouldSkipAuth = SKIP_AUTH_PATHS.some(path => url.includes(path));

  if (shouldSkipAuth) {
    return config;
  }

  const token = await EncryptedStorage.getItem('accessToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Refresh Token API 나오기 전 placeholder 구조
axiosInstance.interceptors.response.use(
  res => res,
  async error => {
    const status = error.response?.status;

    if (status === 401) {
      console.log('[401] 토큰 만료 - 로그아웃 처리');
      await useAuthStore.getState().logout();
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
