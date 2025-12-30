import { useQuery } from '@tanstack/react-query';
import {
  getPartnerCars,
  PartnerCarStatus,
  PartnerCarListResponse,
} from '../../api/vehicleStatus';

export const usePartnerCars = (carStatus?: PartnerCarStatus) => {
  return useQuery<PartnerCarListResponse>({
    queryKey: ['partner-cars', carStatus ?? 'ALL'],
    queryFn: () => getPartnerCars(carStatus),
    placeholderData: previous => previous,
  });
};
