import { useMutation, useQueryClient } from '@tanstack/react-query';
import { confirmBilling } from '../../api/billings';

export const useConfirmBilling = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (billingId: number) => confirmBilling(billingId),
    onSuccess: () => {
      // 지급대기 리스트 조회 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['billings', 'pending'],
      });
    },
  });
};

