import axiosInstance from './axiosInstance';

export type ContractType =
  | 'GENERAL_CONTRACT'
  | 'INSURANCE_CONTRACT'
  | 'REPLACEMENT_CONTRACT';

// 계약서 최초 생성
export interface CreateContractRequest {
  carDispatchId: number;
  contractType: ContractType;
}

export interface CreateContractResponse {
  contractId: number;
}

export const createContract = async (
  payload: CreateContractRequest,
): Promise<CreateContractResponse> => {
  const res = await axiosInstance.post('/contracts/v1', payload);
  return res.data.data;
};

// 업로드 URL 발급
export interface UploadUrlInfo {
  uploadUrl: string;
  fileKey: string;
  expiresAt: string;
  remainingMinutes: number;
  expired: boolean;
}

export interface ContractUploadUrlsResponse {
  contractPhotos: UploadUrlInfo[];
  signaturePhoto: UploadUrlInfo;
}

export const fetchContractUploadUrls = async (
  contractId: number,
): Promise<ContractUploadUrlsResponse> => {
  const res = await axiosInstance.post(`/contracts/${contractId}/upload-urls`);
  return res.data.data;
};

// 일반 계약서 저장
export interface SaveGeneralContractRequest {
  customerName: string;
  customerPhoneNumber: string;
  customerAddress: string;

  paymentMethod: 'ACCOUNT_TRANSFER' | 'CARD';
  paymentAmount: number;

  memo?: string;

  contractPhotoKeys: string[];
  customerSignatureKey: string;

  fuelQuantity?: number;
  isDraft: boolean;
}

export const saveGeneralContract = async (
  contractId: number,
  payload: SaveGeneralContractRequest,
) => {
  const res = await axiosInstance.put(
    `/contracts/general/${contractId}`,
    payload,
  );
  return res.data.data;
};

// 보험 계약서 저장
export interface SaveInsuranceContractRequest {
  requestCompany: string;
  repairShop: string;

  insuranceCompanyName: string;
  insuranceApplicationNumber: string;
  insuranceManagerName: string;
  insuranceManagerPhoneNumber: string;

  memo?: string;

  contractPhotoKeys: string[];
  customerSignatureKey: string;

  isDraft: boolean;
}

export const saveInsuranceContract = async (
  contractId: number,
  payload: SaveInsuranceContractRequest,
) => {
  const res = await axiosInstance.put(
    `/contracts/insurance/${contractId}`,
    payload,
  );
  return res.data.data;
};
