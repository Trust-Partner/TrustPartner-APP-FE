import { useQuery } from '@tanstack/react-query';
import { fetchParkingLocations } from '../../api/locations';

export const useParkingLocations = () => {
  return useQuery({
    queryKey: ['parkingLocations'],
    queryFn: fetchParkingLocations,
  });
};
