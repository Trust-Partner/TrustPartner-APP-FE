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

// 이미지 업로드 URL 발급
export interface ContractUploadSlot {
  fileKey: string;
  uploadUrl: string;
}

export interface GetContractUploadUrlsResponse {
  contractPhotos: ContractUploadSlot[];
  signaturePhoto: ContractUploadSlot;
}

export const getContractUploadUrls = async (
  contractId: number,
): Promise<GetContractUploadUrlsResponse> => {
  const res = await axiosInstance.post<
    ApiResponse<{
      contractPhotos: { fileKey: string; uploadUrl: string }[];
      signaturePhoto: { fileKey: string; uploadUrl: string };
    }>
  >(`/contracts/v1/${contractId}/upload-urls`);

  const data = res.data.data;

  return {
    contractPhotos: data.contractPhotos.map(p => ({
      fileKey: p.fileKey,
      uploadUrl: p.uploadUrl,
    })),
    signaturePhoto: {
      fileKey: data.signaturePhoto.fileKey,
      uploadUrl: data.signaturePhoto.uploadUrl,
    },
  };
};

// 보험 계약서 임시저장 / 최종 저장
export interface SaveInsuranceContractRequest {
  customerName?: string;
  customerPhoneNumber?: string;
  customerAddress?: string;
  customerCarType?: string;
  customerCarNumber?: string;
  customerCarDisplacement?: string;

  insuranceCompanyName?: string;
  insuranceApplicationNumber?: string;

  partnerId?: string;
  repairShopId?: string;

  contractPhotoKeys?: string[];
  fuelQuantity?: number;
  customerSignatureKey?: string;

  /** true = 임시저장, false = 최종 저장 */
  isDraft: boolean;
}

export const saveInsuranceContract = async (
  contractId: number,
  body: SaveInsuranceContractRequest,
): Promise<void> => {
  await axiosInstance.put<ApiResponse<void>>(
    `/contracts/v1/insurance/${contractId}`,
    body,
  );
};
