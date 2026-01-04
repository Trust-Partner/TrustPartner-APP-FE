import axiosInstance from '../axiosInstance';

export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

// 계약서 메모
export interface ContractMemo {
  memo: string;
  staffId: string;
  staffName: string;
  contractId: number;
  createdAt: string;
}

export const getContractMemos = async (
  contractId: number,
): Promise<ContractMemo[]> => {
  const res = await axiosInstance.get<ApiResponse<ContractMemo[]>>(
    `/memo/v1/${contractId}`,
  );
  return res.data.data;
};

export const createContractMemo = async (
  contractId: number,
  body: {
    memo: string;
    staffId: string;
  },
): Promise<ContractMemo> => {
  const res = await axiosInstance.post<ApiResponse<ContractMemo>>(
    `/memo/v1/${contractId}`,
    body,
  );
  return res.data.data;
};

// 계약서 고객 정보
export interface ContractCustomer {
  customerName: string;
  customerPhoneNumber: string;
  customerAddress: string;
  customerCarModel: string;
  customerCarNum: string;
  customerCarDisplacement: string;
}

export const getContractCustomer = async (
  contractId: number,
): Promise<ContractCustomer> => {
  const res = await axiosInstance.get<ApiResponse<ContractCustomer>>(
    `/contracts/v1/detail/customer/${contractId}`,
  );
  return res.data.data;
};

export const updateContractCustomer = async (
  contractId: number,
  body: {
    customerName: string;
    customerPhoneNumber: string;
    customerAddress: string;
  },
): Promise<ContractCustomer> => {
  const res = await axiosInstance.patch<ApiResponse<ContractCustomer>>(
    `/contracts/v1/detail/customer/${contractId}`,
    body,
  );
  return res.data.data;
};

// 사고 차량 정보
export enum AccidentCarStatus {
  AVAILABLE = 'AVAILABLE', // 대기중
  IN_USE = 'IN_USE', // 배차중
  RETURN_REQUESTED = 'RETURN_REQUESTED', // 반납신청
}

export interface ContractAccidentCar {
  carStatuses: AccidentCarStatus[];
  customerCarNumber: string;
  customerCarModel: string;
  customerCarDisplacement: string;
  repairShopId: string;
  repairShopName: string;
  partnerId: string;
  partnerName: string;
}

export const getContractAccidentCar = async (
  contractId: number,
): Promise<ContractAccidentCar> => {
  const res = await axiosInstance.get<ApiResponse<ContractAccidentCar>>(
    `/contracts/v1/detail/accidentCar/${contractId}`,
  );
  return res.data.data;
};

// 보험사 청구 정보
export enum BillingStatus {
  PENDING = 'PENDING', // 지급대기
  CONFIRMED = 'CONFIRMED', // 지급확정
  COMPLETED_BILLED = 'COMPLETED_BILLED', // 청구완료
  COMPLETED_APPROVED = 'COMPLETED_APPROVED', // 입금완료(승인)
  COMPLETED_UNAPPROVED = 'COMPLETED_UNAPPROVED', // 입금완료(미승인)
  CANCELLED = 'CANCELLED', // 지급취소
}

export interface ContractInsuranceClaim {
  insuranceCompany: string;
  caseNumber: string;
  managerName: string;
  managerPhoneNum: string;
  faxNum: string;
  billingStatus: BillingStatus;
}

export const getContractInsuranceClaim = async (
  contractId: number,
): Promise<ContractInsuranceClaim> => {
  const res = await axiosInstance.get<ApiResponse<ContractInsuranceClaim>>(
    `/contracts/v1/detail/app/invoice/${contractId}`,
  );
  return res.data.data;
};

export interface UpdateInsuranceClaimRequest {
  insuranceCompany: string;
  caseNumber: string;
  managerName: string;
  managerPhoneNum: string;
  faxNum: string;
}

export const updateContractInsuranceClaim = async (
  contractId: number,
  body: UpdateInsuranceClaimRequest,
): Promise<ContractInsuranceClaim> => {
  const res = await axiosInstance.patch<ApiResponse<ContractInsuranceClaim>>(
    `/contracts/v1/detail/app/invoice/${contractId}`,
    body,
  );
  return res.data.data;
};

// 일반 계약서 결제 정보
export enum PaymentMethod {
  ACCOUNT_TRANSFER = 'ACCOUNT_TRANSFER', // 계좌이체
  CARD = 'CARD', // 카드
}

export enum PaymentTime {
  PREPAID = 'PREPAID', // 선불
  POSTPAID = 'POSTPAID', // 후불
}

export interface ContractPayment {
  paymentMethod: PaymentMethod;
  paymentTime: PaymentTime;
  paymentAmount: number;
  memo: string;
}

export const getContractPayment = async (
  contractId: number,
): Promise<ContractPayment> => {
  const res = await axiosInstance.get<ApiResponse<ContractPayment>>(
    `/contracts/v1/detail/general/${contractId}`,
  );
  return res.data.data;
};
