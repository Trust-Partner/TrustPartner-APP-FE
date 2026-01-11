import { useQuery } from '@tanstack/react-query';
import { getGeneralContractDraft } from '../../api/contracts/contract';
import { mapGeneralContractDraftToForm } from '../../utils/mapGeneralContractDraft';

export const useGeneralContractDraft = (contractId?: number) => {
  return useQuery({
    queryKey: ['general-contract-draft', contractId],
    queryFn: () => getGeneralContractDraft(contractId!),
    enabled: !!contractId,
    select: mapGeneralContractDraftToForm,
  });
};
