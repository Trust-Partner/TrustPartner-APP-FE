import { useQuery } from '@tanstack/react-query';
import { getInsuranceContractDraft } from '../../api/contracts/contract';
import { mapInsuranceContractDraftToForm } from '../../utils/mapInsuranceContractDraft';

export const useInsuranceContractDraft = (contractId?: number) => {
  return useQuery({
    queryKey: ['insurance-contract-draft', contractId],
    queryFn: () => getInsuranceContractDraft(contractId!),
    enabled: !!contractId,
    select: mapInsuranceContractDraftToForm,
  });
};
