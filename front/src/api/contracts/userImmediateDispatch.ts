import axiosInstance from '../axiosInstance';

export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

// 유저
// 보험 계약서 최초 생성
export const createImmediateDispatchContract = async (
  carId: number,
): Promise<number> => {
  const res = await axiosInstance.post<ApiResponse<{ contractId: number }>>(
    `/cars/v1/partners/${carId}/immediate-dispatch`,
  );

  const contractId = res.data.data?.contractId;
  if (!contractId) {
    throw new Error('contractId not found');
  }

  return contractId;
};

export interface ImmediateDispatchUploadSlot {
  fileKey: string;
  uploadUrl: string;
}

export const getImmediateDispatchUploadUrls = async (
  carId: number,
): Promise<ImmediateDispatchUploadSlot[]> => {
  const res = await axiosInstance.get<
    ApiResponse<
      {
        fileKey: string;
        uploadUrl: string;
        expiresAt: string;
        expired: boolean;
        remainingMinutes: number;
      }[]
    >
  >(`/cars/v1/partners/${carId}/immediate-dispatch/upload-urls`);

  return res.data.data.map(v => ({
    fileKey: v.fileKey,
    uploadUrl: v.uploadUrl,
  }));
};

export interface SaveImmediateDispatchContractRequest {
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

  /** true = 임시저장 */
  isDraft: boolean;
}

export const saveImmediateDispatchContract = async (
  carId: number,
  contractId: number,
  body: SaveImmediateDispatchContractRequest,
): Promise<void> => {
  await axiosInstance.patch<ApiResponse<void>>(
    `/cars/v1/partners/${carId}/immediate-dispatch/${contractId}`,
    body,
  );
};

// 보험 게약서 임시저장 불러오기
export type ImmediateDispatchContractType = 'INSURANCE_CONTRACT';

export interface GetImmediateDispatchContractResponse {
  contractId: number;
  contractType: ImmediateDispatchContractType;

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

export const getImmediateDispatchContract = async (
  contractId: number,
): Promise<GetImmediateDispatchContractResponse> => {
  const res = await axiosInstance.get<
    ApiResponse<GetImmediateDispatchContractResponse>
  >(`/contracts/v1/${contractId}`);

  return res.data.data;
};
