import axiosInstance from '../axiosInstance';

export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

export type ContractType = 'GENERAL_CONTRACT' | 'INSURANCE_CONTRACT';

// 일반 계약서 생성
export interface CreateGeneralContractRequest {
  carId: number;
}

export interface CreateGeneralContractResponse {
  contractId: number;
}

export const createGeneralContract = async (
  body: CreateGeneralContractRequest,
): Promise<number> => {
  const res = await axiosInstance.post<
    ApiResponse<CreateGeneralContractResponse>
  >('/contracts/v1/general', body);

  const contractId = res.data.data?.contractId;

  if (!contractId) {
    throw new Error('contractId not found in createGeneralContract response');
  }

  return contractId;
};

// 보험 계약서 생성
export interface CreateInsuranceContractRequest {
  carDispatchId: number;
  carId: number;
}

export interface CreateInsuranceContractResponse {
  contractId: number;
}

export const createInsuranceContract = async (
  body: CreateInsuranceContractRequest,
): Promise<number> => {
  const res = await axiosInstance.post<
    ApiResponse<CreateInsuranceContractResponse>
  >('/contracts/v1/insurance', body);

  const contractId = res.data.data?.contractId;

  if (!contractId) {
    throw new Error('contractId not found in createInsuranceContract response');
  }

  return contractId;
};

// 교체 계약서 생성
export interface CreateReplacementContractRequest {
  carDispatchId: number;
}

export interface CreateReplacementContractResponse {
  contractId: number;
}

export const createReplacementContract = async (
  body: CreateReplacementContractRequest,
): Promise<number> => {
  const res = await axiosInstance.post<
    ApiResponse<CreateReplacementContractResponse>
  >('/contracts/v1/replacement', body);

  const contractId = res.data.data?.contractId;

  if (!contractId) {
    throw new Error(
      'contractId not found in createReplacementContract response',
    );
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

// 일반 계약서 임시저장 / 최종 저장
export type PaymentMethod = 'ACCOUNT_TRANSFER' | 'CARD';

export type PaymentTime = 'PREPAID' | 'POSTPAID';

export interface SaveGeneralContractRequest {
  customerName?: string;
  customerPhoneNumber?: string;
  customerAddress?: string;

  paymentMethod?: PaymentMethod;
  paymentTime?: PaymentTime;
  paymentAmount?: number;
  memo?: string;

  contractPhotoKeys?: string[];
  fuelQuantity?: number;

  customerSignatureKey?: string;

  /** true = 임시저장, false = 최종저장 */
  isDraft: boolean;
}

export const saveGeneralContract = async (
  contractId: number,
  body: SaveGeneralContractRequest,
): Promise<void> => {
  await axiosInstance.put<ApiResponse<void>>(
    `/contracts/v1/general/${contractId}`,
    body,
  );
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

// 교체 계약서 임시저장 / 최종저장
export interface SaveReplacementContractRequest {
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

  /** true = 임시저장, false = 최종저장 */
  isDraft: boolean;
}

export const saveReplacementContract = async (
  contractId: number,
  body: SaveReplacementContractRequest,
): Promise<void> => {
  await axiosInstance.put<ApiResponse<void>>(
    `/contracts/v1/replacement/${contractId}`,
    body,
  );
};

// 일반 계약서 임시저장 불러오기
export interface GetGeneralContractDraftResponse {
  contractId: number;
  contractType: 'GENERAL_CONTRACT';

  fuelQuantity?: number;
  memo?: string;

  contractFilePaths?: string[];
  signatureFilePath?: string;

  customerDetail?: {
    customerName?: string;
    customerPhoneNumber?: string;
    customerAddress?: string;
  };

  paymentDetail?: {
    paymentMethod?: 'ACCOUNT_TRANSFER' | 'CARD';
    paymentTime?: 'PREPAID' | 'POSTPAID';
    paymentAmount?: number;
  };
}

export const getGeneralContractDraft = async (
  contractId: number,
): Promise<GetGeneralContractDraftResponse> => {
  const res = await axiosInstance.get<
    ApiResponse<GetGeneralContractDraftResponse>
  >(`/contracts/v1/${contractId}`);

  return res.data.data;
};

// 보험 게약서 임시저장 불러오기
export interface GetContractDetailResponse {
  contractId: number;
  contractType: ContractType;
  fuelQuantity?: number;
  contractFilePaths?: string[];
  signatureFilePath?: string;

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
  };

  partnerInfo?: {
    partnerId?: string;
    partnerName?: string;
  };

  repairShopInfo?: {
    partnerId?: string;
    partnerName?: string;
  };
}

export const getInsuranceContractDraft = async (
  contractId: number,
): Promise<GetContractDetailResponse> => {
  const res = await axiosInstance.get<ApiResponse<GetContractDetailResponse>>(
    `/contracts/v1/${contractId}`,
  );

  return res.data.data;
};

// 교체 계약서 임시저장 불러오기
export interface GetReplacementContractDraftResponse {
  contractId: number;
  contractType: ContractType;

  fuelQuantity?: number;

  contractFilePaths?: string[];
  signatureFilePath?: string;

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
  };

  partnerInfo?: {
    partnerId?: string;
    partnerName?: string;
    partnerPhoneNumber?: string;
  };

  repairShopInfo?: {
    partnerId?: string;
    partnerName?: string;
    partnerPhoneNumber?: string;
  };

  carDispatchInfo?: {
    carDispatchId?: number;
    carModel?: string;
  };
}

export const getReplacementContractDraft = async (
  contractId: number,
): Promise<GetReplacementContractDraftResponse> => {
  const res = await axiosInstance.get<
    ApiResponse<GetReplacementContractDraftResponse>
  >(`/contracts/v1/${contractId}`);

  return res.data.data;
};
