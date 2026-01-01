import axiosInstance from '../axiosInstance';

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
  generalContractId: number;
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

// 보험/일반/교체 계약서 이미지 업로드 URL 발급
export const fetchContractUploadUrls = async (
  contractId: number,
): Promise<ContractUploadUrlsResponse> => {
  const res = await axiosInstance.post(
    `/contracts/v1/${contractId}/upload-urls`,
  );

  return res.data.data;
};

// 보험 계약서 저장
export interface SaveInsuranceContractRequest {
  // 고객 정보
  customerName: string;
  customerPhoneNumber: string;
  customerAddress: string;

  // 고객 차량 정보
  customerCarType: string;
  customerCarNumber: string;
  customerCarDisplacement: string;

  // 보험 정보
  insuranceCompanyName: string;
  insuranceApplicationNumber: string;

  // 거래처 / 입고 공업사
  partnerId: string;
  repairShopId: string;

  // 첨부
  contractPhotoKeys: string[];
  customerSignatureKey: string;

  // 기타
  fuelQuantity: number;
  isDraft: boolean;
}

export const saveInsuranceContract = async (
  contractId: number,
  payload: SaveInsuranceContractRequest,
): Promise<void> => {
  await axiosInstance.put(`/contracts/v1/insurance/${contractId}`, payload);
};
