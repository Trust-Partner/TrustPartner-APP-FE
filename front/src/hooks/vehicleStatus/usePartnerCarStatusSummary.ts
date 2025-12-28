import { useQuery } from '@tanstack/react-query';
import {
  getPartnerCarStatusSummary,
  PartnerCarStatusSummary,
} from '../../api/vehicleStatus';

export const usePartnerCarStatusSummary = () => {
  return useQuery<PartnerCarStatusSummary>({
    queryKey: ['partner-car-status-summary'],
    queryFn: getPartnerCarStatusSummary,
  });
};
