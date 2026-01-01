import axiosInstance from '../axiosInstance';

// 배차확정
export interface ContractDispatchConfirmPayload {
  carId: number;
  dispatchId: number;
  message: string;
  autoSave: boolean;
}

export const confirmContractDispatch = (
  payload: ContractDispatchConfirmPayload,
) => {
  return axiosInstance.post('/cars/v1/dispatch/confirm', payload);
};
