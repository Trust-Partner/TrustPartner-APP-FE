import { useQuery } from '@tanstack/react-query';
import { getInsuranceContractDraft } from '../../api/contracts/contract';
import { mapReplacementContractDraftToForm } from '../../utils/mapReplacementContractDraft';

export const useReplacementContractDraft = (contractId?: number) => {
  return useQuery({
    queryKey: ['replacement-contract-draft', contractId],
    queryFn: () => getInsuranceContractDraft(contractId!),
    enabled: !!contractId,
    select: mapReplacementContractDraftToForm,
  });
};
