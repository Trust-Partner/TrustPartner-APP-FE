import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  confirmContractDispatch,
  ContractDispatchConfirmPayload,
} from '../../api/contracts/dispatch';

export const useContractDispatchConfirm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ContractDispatchConfirmPayload) =>
      confirmContractDispatch(payload),

    onSuccess: () => {
      // 배차 요청 리스트 갱신
      queryClient.invalidateQueries({
        queryKey: ['dispatchList'],
      });

      // 차량 현황 (등급별 배차 가능 차량)
      queryClient.invalidateQueries({
        queryKey: ['vehicleStatus', 'dispatchCarsByGrade'],
        exact: false, // gradeId 전체 갱신
      });
    },
  });
};
