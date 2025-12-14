import { useQuery } from '@tanstack/react-query';
import { getCarsByLocation, CarsByLocationItem } from '../../api/vehicleStatus';

export const useCarsByLocation = (locationId: number, carNum?: string) =>
  useQuery<CarsByLocationItem[]>({
    queryKey: ['carsByLocation', locationId, carNum],
    queryFn: () => getCarsByLocation(locationId, carNum),
    enabled: !!locationId,
  });
