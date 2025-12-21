import axiosInstance from './axiosInstance';

// 배차 확정
export interface ConfirmDispatchRequest {
  carId: number;
  dispatchId: number;
  message?: string;
  autoSave?: boolean;
}

export interface ConfirmDispatchResponse {
  staffId: string;
  staffName: string;
  carId: number;
  dispatchId: number;
  message: string;
  dispatchStatus: string;
  autoSave: boolean;
}

export const confirmDispatch = async (
  payload: ConfirmDispatchRequest,
): Promise<ConfirmDispatchResponse> => {
  const res = await axiosInstance.post('/cars/v1/dispatch/confirm', payload);

  return res.data.data;
};

export type ContractType =
  | 'GENERAL_CONTRACT'
  | 'INSURANCE_CONTRACT'
  | 'REPLACEMENT_CONTRACT';

// 계약서 최초 생성
export interface CreateContractRequest {
  carDispatchId: number | null;
  contractType: ContractType;
}

export interface CreateContractResponse {
  generalContractId: number;
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
  const res = await axiosInstance.post(
    `/contracts/v1/${contractId}/upload-urls`,
  );
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
    `/contracts/v1/general/${contractId}`,
    payload,
  );
  return res.data.data;
};

// 보험 계약서 저장
export interface SaveInsuranceContractRequest {
  customerName: string;
  customerPhoneNumber: string;
  customerAddress: string;
  customerCarType: string;
  customerCarNumber: string;
  customerCarDisplacement: string;

  insuranceCompanyName: string;
  insuranceApplicationNumber: string;

  partnerId: string;
  repairShopId: string;

  contractPhotoKeys: string[];
  fuelQuantity?: number;
  customerSignatureKey: string;

  isDraft: boolean;
}

export const saveInsuranceContract = async (
  contractId: number,
  payload: SaveInsuranceContractRequest,
) => {
  const res = await axiosInstance.put(
    `/contracts/v1/insurance/${contractId}`,
    payload,
  );
  return res.data.data;
};

// 계약서 조회 및 임시저장 불러오기
export interface ContractDetailResponse {
  contractId: number;
  contractType: 'GENERAL_CONTRACT' | 'INSURANCE_CONTRACT';

  fuelQuantity?: number;
  contractFilePaths: string[];
  signatureFilePath?: string;

  memo?: string;

  customerDetail?: {
    customerName?: string;
    customerPhoneNumber?: string;
    customerAddress?: string;
    customerCarType?: string;
    customerCarNumber?: string;
    customerCarDisplacement?: string;
  };

  insuranceDetail?: {
    insuranceCompanyName?: string;
    insuranceApplicationNumber?: string;
    insuranceManagerName?: string;
    insuranceManagerPhoneNumber?: string;
    insuranceFaxNumber?: string;
  };

  partnerInfo?: {
    partnerId: string;
    partnerName: string;
  };

  repairShopInfo?: {
    partnerId: string;
    partnerName: string;
  };
}

export const fetchContractDetail = async (contractId: number) => {
  const res = await axiosInstance.get<{
    code: string;
    message: string;
    data: ContractDetailResponse;
  }>(`/contracts/v1/${contractId}`);

  return res.data.data;
};
