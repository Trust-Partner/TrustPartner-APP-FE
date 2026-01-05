import { useQuery } from '@tanstack/react-query';
import {
  getPartnerCurrentMonthDispatchList,
  GetPartnerCurrentMonthDispatchListParams,
  PartnerCurrentMonthDispatchList,
} from '../../api/billings';

export const usePartnerCurrentMonthDispatchList = (
  params: GetPartnerCurrentMonthDispatchListParams,
) => {
  return useQuery<PartnerCurrentMonthDispatchList>({
    queryKey: [
      'billings',
      'partner',
      'current-month-dispatch-list',
      params.year,
      params.month,
    ],
    queryFn: () => getPartnerCurrentMonthDispatchList(params),
    placeholderData: previous => previous,
  });
};

