import axiosInstance from '../axiosInstance';

export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

// 계약서 리스트
export interface ContractListItem {
  contractId: number;
  contractType: 'GENERAL_CONTRACT' | 'INSURANCE_CONTRACT';
  customerName: string;
  dispatchTime: string;
  model: string;
  carNum: string;
}

export interface ContractListParams {
  startDate?: string;
  endDate?: string;
}

export const getContractList = async (
  params?: ContractListParams,
): Promise<ContractListItem[]> => {
  const res = await axiosInstance.get<ApiResponse<ContractListItem[]>>(
    '/contracts/v1/app/list',
    { params },
  );

  return res.data.data;
};
