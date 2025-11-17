import axios from 'axios';
import Config from 'react-native-config';
import EncryptedStorage from 'react-native-encrypted-storage';

const instance = axios.create({
  baseURL: Config.API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// 요청 인터셉터
instance.interceptors.request.use(async config => {
  const token = await EncryptedStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 응답 인터셉터
instance.interceptors.response.use(
  res => res,
  async error => {
    if (error.response?.status === 401) {
      // 예시: 자동 로그아웃 or refresh 로직
      console.warn('토큰 만료. 재로그인 필요');
    }
    return Promise.reject(error);
  },
);

export default instance;
