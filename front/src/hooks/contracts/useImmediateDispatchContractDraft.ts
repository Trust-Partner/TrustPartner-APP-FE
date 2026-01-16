import { useQuery } from '@tanstack/react-query';
import { getImmediateDispatchContract } from '../../api/contracts/userImmediateDispatch';
import { mapInsuranceContractDraftToForm } from '../../utils/mapInsuranceContractDraft';

export const useImmediateDispatchContractDraft = (contractId?: number) => {
  return useQuery({
    queryKey: ['immediate-dispatch-contract-draft', contractId],
    queryFn: () => getImmediateDispatchContract(contractId!),
    enabled: !!contractId,
    select: mapInsuranceContractDraftToForm,
  });
};
