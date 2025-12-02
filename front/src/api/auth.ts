import axiosInstance from './axiosInstance';

export async function loginStaff(loginId: string, password: string) {
  const response = await axiosInstance.post('/api/auth/staffs', {
    loginId,
    password,
  });

  return response;
}

export async function loginPartner(loginId: string, password: string) {
  const response = await axiosInstance.post('/api/auth/partners', {
    loginId,
    password,
  });

  return response;
}
