import axiosInstance from '../axiosInstance';

export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

export type ContractType = 'GENERAL_CONTRACT' | 'INSURANCE_CONTRACT';

// 계약서 생성
export interface CreateContractRequest {
  carDispatchId: number;
  contractType: ContractType;
}

export interface CreateContractResponse {
  contractId: number;
}

export const createContract = async (
  body: CreateContractRequest,
): Promise<number> => {
  const res = await axiosInstance.post<ApiResponse<CreateContractResponse>>(
    '/contracts/v1',
    body,
  );

  const contractId = res.data.data?.contractId;

  if (!contractId) {
    throw new Error('contractId not found in createContract response');
  }

  return contractId;
};

// 보험 계약서 저장 (임시 / 최종 공용)
export interface SaveInsuranceContractRequest {
  // TODO
}

export const saveInsuranceContract = async (
  contractId: number,
  body: SaveInsuranceContractRequest,
) => {
  await axiosInstance.put(`/contracts/v1/insurance/${contractId}`, body);
};

// 업로드 URL 발급
export interface UploadUrlRequest {
  fileName: string;
  contentType: string;
}

export interface UploadUrlResponse {
  uploadUrl: string;
  fileUrl: string;
}

export const getContractUploadUrls = async (
  contractId: number,
  body: UploadUrlRequest[],
): Promise<UploadUrlResponse[]> => {
  const res = await axiosInstance.post<ApiResponse<UploadUrlResponse[]>>(
    `/contracts/v1/${contractId}/upload-urls`,
    body,
  );

  return res.data.data;
};
