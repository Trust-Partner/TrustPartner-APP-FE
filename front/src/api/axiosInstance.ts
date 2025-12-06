import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import Config from 'react-native-config';
import { useAuthStore } from '../states/useAuthStore';

const axiosInstance = axios.create({
  baseURL: Config.API_BASE_URL,
  timeout: 15000,
});

// 요청 시 자동으로 AccessToken 주입
axiosInstance.interceptors.request.use(async config => {
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
      console.log('[401] 토큰 만료 - refresh 준비(아직 API 없음)');
      await useAuthStore.getState().logout();
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
