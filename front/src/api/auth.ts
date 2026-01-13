import axiosInstance from './axiosInstance';

export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

export async function loginStaff(loginId: string, password: string) {
  const response = await axiosInstance.post('auth/v1/staffs', {
    loginId,
    password,
  });

  return response;
}

export async function loginPartner(loginId: string, password: string) {
  const response = await axiosInstance.post('auth/v1/partners', {
    loginId,
    password,
  });

  return response;
}

// Find ID - Send Code
export interface FindIdCodePayload {
  name: string;
  phoneNumber: string;
}

export async function sendFindIdCode(
  role: 'admin' | 'user',
  payload: FindIdCodePayload,
): Promise<void> {
  const endpoint =
    role === 'admin'
      ? '/auth/v1/staff/find-id/code'
      : '/auth/v1/partner/find-id/code';

  await axiosInstance.post<ApiResponse<null>>(endpoint, payload);
}

// Find ID - Verify Code
export interface FindIdPayload {
  name: string;
  phoneNumber: string;
  verificationCode: string;
}

export interface FindIdResponse {
  loginId: string;
}

export async function findId(
  role: 'admin' | 'user',
  payload: FindIdPayload,
): Promise<FindIdResponse> {
  const endpoint =
    role === 'admin' ? '/auth/v1/staff/find-id' : '/auth/v1/partner/find-id';

  const response = await axiosInstance.post<ApiResponse<FindIdResponse>>(
    endpoint,
    payload,
  );

  return response.data.data;
}
