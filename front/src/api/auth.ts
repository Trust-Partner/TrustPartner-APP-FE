import api from './axiosInstance';

export async function loginStaff(loginId: string, password: string) {
  const res = await api.post('/api/auth/staffs', { loginId, password });
  return res.data.data;
}

export async function loginPartner(loginId: string, password: string) {
  const res = await api.post('/api/auth/partners', { loginId, password });
  return res.data.data;
}
